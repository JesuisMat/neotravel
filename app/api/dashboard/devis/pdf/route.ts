import { createAdminClient } from "@/lib/supabase/server";
import { generateDevisPDF } from "@/lib/pdf/generate-devis";
import type { LigneCalcul, CoefficientApplique } from "@/lib/devis/types";

export const runtime = "nodejs";

/**
 * GET /api/dashboard/devis/pdf?devis_id=xxx
 * Génère et retourne le PDF d'un devis pour prévisualisation dans le dashboard.
 * Usage interne uniquement — l'UUID opaque suffit comme protection.
 */
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const devisId = searchParams.get("devis_id");
  if (!devisId) {
    return new Response("devis_id requis", { status: 400 });
  }

  const supabase = createAdminClient();

  const { data: devis, error } = await supabase
    .from("devis")
    .select(
      `id, montant_ht, montant_tva, montant_ttc, lignes, parametres_calcul,
       demandes (nom, email, origine, destination, date_depart, date_retour, nb_passagers)`
    )
    .eq("id", devisId)
    .single();

  if (error || !devis) {
    return new Response("Devis introuvable", { status: 404 });
  }

  const demande = Array.isArray(devis.demandes)
    ? devis.demandes[0]
    : devis.demandes;

  if (!demande) {
    return new Response("Demande associée introuvable", { status: 404 });
  }

  try {
    const d = demande as {
      nom?: string;
      email?: string;
      origine?: string;
      destination?: string;
      date_depart?: string;
      date_retour?: string;
      nb_passagers?: number;
    };

    const pdfBuffer = await generateDevisPDF({
      numero_devis: `NTV-${devis.id.slice(0, 8).toUpperCase()}`,
      nom: d.nom ?? "Madame, Monsieur",
      email: d.email ?? "",
      origine: d.origine ?? "",
      destination: d.destination ?? "",
      date_depart: d.date_depart ?? "",
      date_retour: d.date_retour,
      nb_passagers: d.nb_passagers ?? 0,
      lignes: (devis.lignes as LigneCalcul[]) ?? [],
      coefficients:
        (
          devis.parametres_calcul as {
            coefficients?: CoefficientApplique[];
          }
        )?.coefficients ?? [],
      prix_ht: devis.montant_ht,
      tva: devis.montant_tva,
      prix_ttc: devis.montant_ttc,
      date_emission: new Date().toLocaleDateString("fr-FR"),
    });

    return new Response(new Uint8Array(pdfBuffer), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `inline; filename="devis-neotravel-${devis.id.slice(0, 8)}.pdf"`,
        "Cache-Control": "private, max-age=60",
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Erreur inconnue";
    return new Response(`Erreur génération PDF: ${message}`, { status: 500 });
  }
}
