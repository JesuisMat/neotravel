import { createAdminClient } from "@/lib/supabase/server";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: demandeId } = await params;
  const url = new URL(req.url);
  const token = url.searchParams.get("token");
  const status = url.searchParams.get("status");

  if (!token || !status) {
    return new Response("Paramètres manquants", { status: 400 });
  }

  if (status !== "accepte" && status !== "refuse" && status !== "rappel") {
    return new Response("Statut invalide", { status: 400 });
  }

  const supabase = createAdminClient();

  // Vérification du token
  const { data: devis, error: errDevis } = await supabase
    .from("devis")
    .select("id, decision_token, decision, demande_id")
    .eq("demande_id", demandeId)
    .eq("decision_token", token)
    .single();

  if (errDevis || !devis) {
    return new Response("Lien invalide ou expiré", { status: 404 });
  }

  // Déjà traité (sauf rappel qui peut être re-demandé)
  if (devis.decision && status !== "rappel") {
    const message =
      devis.decision === "accepte"
        ? "Votre devis a déjà été accepté. Nous vous recontacterons pour confirmer votre prestation."
        : "Votre refus a déjà été enregistré. Merci de nous avoir contactés.";
    return new Response(decisionPage(message), {
      headers: { "Content-Type": "text/html; charset=utf-8" },
    });
  }

  // ── Mise à jour statut demande + devis ──────────────────────────
  // accepte  → accepte_prospect  + devis.decision = "accepte"  + escalade dashboard
  // refuse   → refuse            + devis.decision = "refuse"   + opt-out (log opt_out)
  // rappel   → complexe          + origine_demande = rappel_demande + escalade dashboard

  const nouveauStatut =
    status === "accepte" ? "accepte_prospect"
    : status === "rappel" ? "complexe"
    : "refuse";

  const decisionValue = status === "rappel" ? null : status; // "accepte" | "refuse" | null

  // Mise à jour demande
  const demandeUpdate: Record<string, string> = { statut: nouveauStatut };
  if (status === "rappel") demandeUpdate.origine_demande = "rappel_demande";

  const { error: errUpdate } = await supabase.rpc("traiter_decision_devis", {
    p_demande_id: demandeId,
    p_devis_id: devis.id,
    p_decision: decisionValue,
    p_statut_demande: nouveauStatut,
  });

  if (errUpdate) {
    // Fallback séquentiel si RPC non disponible
    await supabase.from("demandes").update(demandeUpdate).eq("id", demandeId);

    // Pour accepte et refuse : on enregistre la décision sur le devis
    if (decisionValue !== null) {
      await supabase.from("devis").update({
        decision: decisionValue,
        decision_at: new Date().toISOString(),
        prochaine_relance: null,
      }).eq("id", devis.id);
    }

    // Pour rappel : stopper les relances automatiques (le dossier passe en manuel)
    if (status === "rappel") {
      await supabase.from("devis").update({
        prochaine_relance: null,
      }).eq("id", devis.id);
    }
  } else {
    // RPC réussie — compléments que la RPC ne gère pas
    if (status === "rappel") {
      await supabase.from("demandes")
        .update({ origine_demande: "rappel_demande" })
        .eq("id", demandeId);
      await supabase.from("devis")
        .update({ prochaine_relance: null })
        .eq("id", devis.id);
    }
    if (status === "refuse") {
      // S'assurer que prochaine_relance est bien nulle (la RPC peut ne pas le faire)
      await supabase.from("devis")
        .update({ prochaine_relance: null })
        .eq("id", devis.id);
    }
  }

  // ── Récupération données demande pour enrichir les notifications ──
  const { data: demande } = await supabase
    .from("demandes")
    .select("nom, email, telephone, origine, destination, nb_passagers, date_depart, heure_depart")
    .eq("id", demandeId)
    .single();

  const { data: devisData } = await supabase
    .from("devis")
    .select("montant_ttc")
    .eq("id", devis.id)
    .single();

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

  if (status === "accepte" || status === "rappel") {
    // ── Escalade dashboard commercial ──────────────────────────────
    const raison = status === "accepte"
      ? "✅ Prospect a ACCEPTÉ le devis — à confirmer avec le partenaire transporteur"
      : "📞 Prospect souhaite être rappelé — questions en attente avant décision";
    const resume = status === "accepte"
      ? "Acceptation via lien signé email. Contacter le prospect pour confirmer la prestation et valider avec le partenaire."
      : "Le prospect a cliqué \"Je souhaite être rappelé\" dans l'email de devis. Il n'a pas encore pris de décision — clarifier ses questions et reconfirmer le devis si besoin.";

    await fetch(`${baseUrl}/api/email/notify-commercial`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-internal-secret": process.env.INTERNAL_API_KEY ?? "",
      },
      body: JSON.stringify({
        demande_id: demandeId,
        raison_escalade: raison,
        resume_conversation: resume,
        contact: {
          nom: demande?.nom ?? undefined,
          email: demande?.email ?? undefined,
          telephone: demande?.telephone ?? undefined,
        },
        trajet: {
          origine: demande?.origine ?? undefined,
          destination: demande?.destination ?? undefined,
          nb_passagers: demande?.nb_passagers ?? undefined,
          date_depart: demande?.date_depart ?? undefined,
          heure_depart: demande?.heure_depart ?? undefined,
        },
        prix_ttc_estime: devisData?.montant_ttc ?? undefined,
      }),
    }).catch(() => null);
  }

  // ── Log ────────────────────────────────────────────────────────
  const logAction = status === "refuse" ? "opt_out_email" : `decision_${status}`;
  await supabase.from("logs").insert({
    demande_id: demandeId,
    action: logAction,
    source: "user",
    metadata: {
      devis_id: devis.id,
      ...(status === "refuse" && { opt_out: true, raison: "refus_devis_email" }),
    },
  });

  const message =
    status === "accepte"
      ? "Votre acceptation a bien été enregistrée. Notre équipe vous recontactera prochainement pour confirmer votre prestation."
      : status === "rappel"
      ? "Votre demande de rappel a bien été prise en compte. Un conseiller NeoTravel vous contactera dans les meilleurs délais."
      : "Votre réponse a bien été enregistrée. Merci de nous avoir contactés — nous espérons pouvoir vous accompagner lors d'un prochain projet.";

  return new Response(decisionPage(message), {
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}

function decisionPage(message: string): string {
  return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1"/>
  <title>NeoTravel</title>
  <style>
    body{font-family:'Helvetica Neue',Arial,sans-serif;background:#f8f7f4;display:flex;align-items:center;justify-content:center;min-height:100vh;margin:0;}
    .card{background:#fff;border-radius:12px;padding:48px 40px;max-width:480px;text-align:center;box-shadow:0 2px 8px rgba(0,0,0,0.08);}
    .logo{color:#c8a97e;font-size:12px;letter-spacing:.15em;text-transform:uppercase;margin-bottom:24px;}
    h1{color:#1a1a2e;font-size:22px;font-weight:400;margin:0 0 16px;}
    p{color:#555;font-size:15px;line-height:1.6;margin:0 0 32px;}
    a{color:#1a1a2e;text-decoration:none;font-size:14px;}
  </style>
</head>
<body>
  <div class="card">
    <div class="logo">NeoTravel</div>
    <h1>Réponse enregistrée</h1>
    <p>${message}</p>
    <a href="/">Retour à l'accueil</a>
  </div>
</body>
</html>`;
}
