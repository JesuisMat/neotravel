import { createAdminClient } from "@/lib/supabase/server";

/**
 * GET /api/internal/leads/pending-followup
 *
 * Endpoint consommé par n8n toutes les heures.
 * Retourne les leads éligibles à une relance sous forme de tableau plat,
 * enrichi de toutes les données nécessaires pour personaliser l'email dans n8n
 * (ex: Bonjour {{prénom}}, montant {{prix_ttc}}, etc.)
 *
 * Protégé par header x-n8n-secret.
 *
 * Réponse 200 : tableau (peut être vide [])
 * Réponse 401 : clé manquante ou invalide
 */
export async function GET(req: Request) {
  const secret = req.headers.get("x-n8n-secret");
  if (secret !== process.env.INTERNAL_API_KEY) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("demandes")
    .select(
      `
      id,
      nom,
      email,
      telephone,
      origine,
      destination,
      date_depart,
      statut,
      urgence,
      devis (
        id,
        montant_ht,
        montant_ttc,
        prochaine_relance,
        nb_relances,
        decision_token,
        email_envoye_at
      )
    `
    )
    .in("statut", ["devis_envoye", "relance_1"])
    .not("devis.prochaine_relance", "is", null);

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  const now = new Date();
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

  type DemandeRow = {
    id: string;
    nom: string | null;
    email: string | null;
    telephone: string | null;
    origine: string | null;
    destination: string | null;
    date_depart: string | null;
    statut: string;
    urgence: string | null;
    devis: Array<{
      id: string;
      montant_ht: number;
      montant_ttc: number;
      prochaine_relance: string | null;
      nb_relances: number;
      decision_token: string | null;
      email_envoye_at: string | null;
    }> | null;
  };

  // Aplatir et filtrer : ne retourner que les leads dont la relance est due
  const leads = (data as DemandeRow[])
    .filter((d) => {
      const devisArr = d.devis;
      if (!devisArr || devisArr.length === 0) return false;
      const devis = devisArr[0];
      if (!devis.prochaine_relance) return false;
      return new Date(devis.prochaine_relance) <= now;
    })
    .map((d) => {
      const devisArr = d.devis as Array<{
        id: string;
        montant_ht: number;
        montant_ttc: number;
        prochaine_relance: string | null;
        nb_relances: number;
        decision_token: string | null;
        email_envoye_at: string | null;
      }>;
      const devis = devisArr[0];

      // Prénom = premier mot du nom, fallback vide
      const prenom = d.nom ? d.nom.split(" ")[0] : "";
      const nom_complet = d.nom ?? "";

      const numero_relance = (devis.nb_relances + 1) as 1 | 2;

      const date_devis = devis.email_envoye_at
        ? new Date(devis.email_envoye_at).toLocaleDateString("fr-FR")
        : new Date().toLocaleDateString("fr-FR");

      // Liens signés pour boutons dans l'email de relance
      const accept_url = `${appUrl}/api/leads/${d.id}/decision?token=${devis.decision_token}&status=accepte`;
      const refuse_url = `${appUrl}/api/leads/${d.id}/decision?token=${devis.decision_token}&status=refuse`;

      return {
        // Identifiants
        id: d.id,
        devis_id: devis.id,
        // Statut pipeline
        statut: d.statut,
        urgence: d.urgence,
        nb_relances: devis.nb_relances,
        numero_relance,
        prochaine_relance: devis.prochaine_relance,
        // Contact — utilisables directement dans les nodes n8n / Resend
        email: d.email,
        prenom,
        nom: nom_complet,
        telephone: d.telephone,
        // Trajet
        origine: d.origine,
        destination: d.destination,
        date_depart: d.date_depart,
        // Devis
        prix_ttc: devis.montant_ttc,
        prix_ht: devis.montant_ht,
        date_devis,
        // Liens signés
        accept_url,
        refuse_url,
        // Token brut (si n8n construit ses propres liens)
        decision_token: devis.decision_token,
      };
    });

  // Retourne un tableau plat (pas enveloppé dans { leads }) pour simplifier n8n
  return Response.json(leads);
}
