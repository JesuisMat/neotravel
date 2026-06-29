import { createAdminClient } from "@/lib/supabase/server";

/**
 * GET /api/internal/leads/:id/status
 *
 * Utilisé par n8n après un Wait pour vérifier si un lead est toujours
 * éligible à une relance avant d'envoyer l'email.
 *
 * Retourne :
 *   { eligible: true,  statut, ... }  → envoyer la relance
 *   { eligible: false, statut, raison } → stopper le workflow
 *
 * Protégé par header x-n8n-secret.
 */
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const secret = req.headers.get("x-n8n-secret");
  if (secret !== process.env.INTERNAL_API_KEY) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("demandes")
    .select(
      `id, statut, email, nom,
       devis (id, decision, prochaine_relance, nb_relances, montant_ttc, decision_token)`
    )
    .eq("id", id)
    .single();

  if (error || !data) {
    return Response.json({ error: "Lead introuvable" }, { status: 404 });
  }

  // Statuts qui bloquent toute relance supplémentaire
  const STATUTS_BLOQUES = [
    "accepte_prospect",
    "confirme",
    "refuse",
    "cloture",
    "complexe", // rappel demandé → traitement manuel
  ];

  const statut = data.statut;
  const eligible = ["devis_envoye", "relance_1"].includes(statut);

  const raison = !eligible
    ? STATUTS_BLOQUES.includes(statut)
      ? statut === "refuse"
        ? "opt_out — prospect a refusé"
        : statut === "complexe"
        ? "rappel_demande — traitement manuel en cours"
        : statut === "accepte_prospect" || statut === "confirme"
        ? "converti — ne pas relancer"
        : "cloture"
      : `statut_inattendu: ${statut}`
    : null;

  return Response.json({
    eligible,
    statut,
    raison,
    id: data.id,
    email: data.email,
    nom: data.nom,
  });
}
