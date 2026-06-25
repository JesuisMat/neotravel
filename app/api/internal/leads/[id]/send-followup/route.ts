import { createAdminClient } from "@/lib/supabase/server";
import { sendRelanceEmail } from "@/lib/email/send-devis";

const JOURS_RELANCE_2_URGENT = 5; // J+5 depuis envoi devis
const JOURS_RELANCE_2_STANDARD = 7; // J+7 depuis envoi devis

/**
 * POST /api/internal/leads/[id]/send-followup
 *
 * Déclenché par n8n après détection d'un lead éligible.
 * Envoie la relance email et met à jour les statuts.
 *
 * Protégé par header x-n8n-secret.
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
      id, nom, email, origine, destination, statut, urgence,
      devis (
        id, montant_ttc, nb_relances, decision_token,
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

  const devisArray = demande.devis as Array<{
    id: string;
    montant_ttc: number;
    nb_relances: number;
    decision_token: string | null;
    prochaine_relance: string | null;
    email_envoye_at: string | null;
  }> | null;

  if (!devisArray || devisArray.length === 0) {
    return Response.json({ error: "Devis introuvable" }, { status: 404 });
  }

  const devis = devisArray[0];
  const numeroRelance = (devis.nb_relances + 1) as 1 | 2;

  if (numeroRelance > 2) {
    // Max relances atteint → clôture
    await supabase
      .from("demandes")
      .update({ statut: "cloture" })
      .eq("id", demandeId);

    await supabase
      .from("devis")
      .update({ prochaine_relance: null })
      .eq("id", devis.id);

    return Response.json({ action: "cloture", demande_id: demandeId });
  }

  const dateEnvoi = devis.email_envoye_at
    ? new Date(devis.email_envoye_at).toLocaleDateString("fr-FR")
    : "récemment";

  // Envoi de la relance
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
    date_devis: dateEnvoi,
  });

  // Enregistrement de la relance dans la table relances
  const typeRelance = `relance_${numeroRelance}` as "relance_1" | "relance_2";
  await supabase.from("relances").insert({
    devis_id: devis.id,
    demande_id: demandeId,
    type_relance: typeRelance,
    statut: "envoye",
    email_dest: demande.email,
  });

  // Calcul de la prochaine relance ou clôture
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
    // Après relance_2 → plus de relance, clôture automatique au prochain poll
    prochaineRelance = null;
    nouveauStatut = "relance_2";
  }

  // Mise à jour atomique
  await Promise.all([
    supabase
      .from("demandes")
      .update({ statut: nouveauStatut })
      .eq("id", demandeId),
    supabase
      .from("devis")
      .update({
        nb_relances: numeroRelance,
        prochaine_relance: prochaineRelance,
      })
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

  return Response.json({
    success: true,
    demande_id: demandeId,
    relance: numeroRelance,
    prochaine_relance: prochaineRelance,
    statut: nouveauStatut,
  });
}
