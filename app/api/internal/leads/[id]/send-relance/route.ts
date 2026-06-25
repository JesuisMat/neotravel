import { createAdminClient } from "@/lib/supabase/server";
import { sendRelanceEmail } from "@/lib/email/send-devis";

const JOURS_RELANCE_2_URGENT = 5;    // J+5 depuis envoi devis pour urgents
const JOURS_RELANCE_2_STANDARD = 7;  // J+7 depuis envoi devis pour standards

/**
 * POST /api/internal/leads/[id]/send-relance
 *
 * Déclenché par n8n après détection d'un lead éligible via pending-followup.
 * 1. Envoie l'email de relance (Resend)
 * 2. Met à jour les statuts Supabase
 * 3. Retourne les données complètes du lead pour usage dans n8n (nodes suivants)
 *
 * Protégé par header x-n8n-secret.
 *
 * Réponse 200 : données lead mises à jour
 * Réponse 401 : clé invalide
 * Réponse 404 : lead introuvable
 * Réponse 409 : relance déjà envoyée (idempotence)
 */
export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: demandeId } = await params;

  const secret = req.headers.get("x-n8n-secret");
  if (secret !== process.env.INTERNAL_API_KEY) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createAdminClient();

  // Récupération de la demande et du devis
  const { data: demande, error: errDemande } = await supabase
    .from("demandes")
    .select(
      `
      id, nom, email, telephone, origine, destination, date_depart,
      statut, urgence,
      devis (
        id, montant_ht, montant_ttc, nb_relances, decision_token,
        prochaine_relance, email_envoye_at
      )
    `
    )
    .eq("id", demandeId)
    .single();

  if (errDemande || !demande) {
    return Response.json({ error: "Demande introuvable" }, { status: 404 });
  }

  if (!["devis_envoye", "relance_1"].includes(demande.statut)) {
    return Response.json(
      { error: `Statut inéligible: ${demande.statut}` },
      { status: 400 }
    );
  }

  if (!demande.email) {
    return Response.json({ error: "Email prospect manquant" }, { status: 400 });
  }

  const devisArr = demande.devis as Array<{
    id: string;
    montant_ht: number;
    montant_ttc: number;
    nb_relances: number;
    decision_token: string | null;
    prochaine_relance: string | null;
    email_envoye_at: string | null;
  }> | null;

  if (!devisArr || devisArr.length === 0) {
    return Response.json({ error: "Devis introuvable" }, { status: 404 });
  }

  const devis = devisArr[0];
  const numeroRelance = (devis.nb_relances + 1) as 1 | 2;

  // Max relances atteint → clôture sans email
  if (numeroRelance > 2) {
    await Promise.all([
      supabase.from("demandes").update({ statut: "cloture" }).eq("id", demandeId),
      supabase.from("devis").update({ prochaine_relance: null }).eq("id", devis.id),
      supabase.from("logs").insert({
        demande_id: demandeId,
        action: "cloture_automatique",
        source: "n8n",
        metadata: { devis_id: devis.id, raison: "max_relances_atteint" },
      }),
    ]);

    return Response.json({
      action: "cloture",
      demande_id: demandeId,
      devis_id: devis.id,
      statut: "cloture",
      prochaine_relance: null,
    });
  }

  // Vérification idempotence : relance déjà envoyée ?
  const typeRelance = `relance_${numeroRelance}` as "relance_1" | "relance_2";
  const { data: existingRelance } = await supabase
    .from("relances")
    .select("id")
    .eq("devis_id", devis.id)
    .eq("type_relance", typeRelance)
    .single();

  if (existingRelance) {
    return Response.json(
      { error: `Relance ${typeRelance} déjà envoyée (idempotence)` },
      { status: 409 }
    );
  }

  const dateDevis = devis.email_envoye_at
    ? new Date(devis.email_envoye_at).toLocaleDateString("fr-FR")
    : new Date().toLocaleDateString("fr-FR");

  // Envoi de la relance email
  await sendRelanceEmail({
    email: demande.email,
    nom: demande.nom ?? undefined,
    numero_relance: numeroRelance,
    devis_id: devis.id,
    demande_id: demandeId,
    decision_token: devis.decision_token ?? "",
    prix_ttc: devis.montant_ttc,
    origine: demande.origine ?? "",
    destination: demande.destination ?? "",
    date_devis: dateDevis,
  });

  // Calcul prochaine relance ou clôture
  const isUrgent = ["urgent", "tres_urgent"].includes(demande.urgence ?? "");
  let prochaineRelance: string | null = null;
  let nouveauStatut: "relance_1" | "relance_2" = "relance_1";

  if (numeroRelance === 1) {
    const joursR2 = isUrgent ? JOURS_RELANCE_2_URGENT : JOURS_RELANCE_2_STANDARD;
    const r2Date = new Date();
    r2Date.setDate(r2Date.getDate() + joursR2);
    prochaineRelance = r2Date.toISOString();
    nouveauStatut = "relance_1";
  } else {
    prochaineRelance = null;
    nouveauStatut = "relance_2";
  }

  // Enregistrement atomique : relance + statuts + log
  await Promise.all([
    supabase.from("relances").insert({
      devis_id: devis.id,
      demande_id: demandeId,
      type_relance: typeRelance,
      statut: "envoye",
      email_dest: demande.email,
    }),
    supabase
      .from("demandes")
      .update({ statut: nouveauStatut })
      .eq("id", demandeId),
    supabase
      .from("devis")
      .update({ nb_relances: numeroRelance, prochaine_relance: prochaineRelance })
      .eq("id", devis.id),
    supabase.from("logs").insert({
      demande_id: demandeId,
      action: `relance_${numeroRelance}_envoyee`,
      source: "n8n",
      metadata: {
        devis_id: devis.id,
        email: demande.email,
        prochaine_relance: prochaineRelance,
      },
    }),
  ]);

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  const prenom = demande.nom ? demande.nom.split(" ")[0] : "";

  // Retourne les données complètes du lead pour les nodes n8n suivants
  // (ex: node Resend avec {{$json.prenom}}, {{$json.prix_ttc}}, etc.)
  return Response.json({
    success: true,
    action: "relance_envoyee",
    // Statut mis à jour
    statut: nouveauStatut,
    prochaine_relance: prochaineRelance,
    numero_relance: numeroRelance,
    // Identifiants
    demande_id: demandeId,
    devis_id: devis.id,
    // Contact
    email: demande.email,
    prenom,
    nom: demande.nom ?? "",
    telephone: demande.telephone ?? "",
    // Trajet
    origine: demande.origine ?? "",
    destination: demande.destination ?? "",
    date_depart: demande.date_depart ?? "",
    // Devis
    prix_ttc: devis.montant_ttc,
    prix_ht: devis.montant_ht,
    date_devis: dateDevis,
    // Liens signés pour boutons dans email
    accept_url: `${appUrl}/api/leads/${demandeId}/decision?token=${devis.decision_token}&status=accepte`,
    refuse_url: `${appUrl}/api/leads/${demandeId}/decision?token=${devis.decision_token}&status=refuse`,
  });
}
