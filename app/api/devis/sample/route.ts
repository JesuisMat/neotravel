import { NextResponse } from "next/server";
import { matrices } from "@/lib/devis";
import { calculer_devis } from "@/lib/devis/calculer-devis";

export async function GET() {
  const sampleInput = {
    nb_passagers: 48,
    date_depart: "2026-07-14",
    date_retour: "2026-07-16",
    date_demande: "2026-06-24",
    distance_km: 580,
    type_vehicule: "autocar_53" as const,
    options: ["guide", "peages"] as const,
  };

  const exemple = calculer_devis(sampleInput);

  return NextResponse.json({
    description:
      "Exemple de payload pour POST /api/devis/calculate et résultat calculé associé.",
    request_example: sampleInput,
    response_example: { ok: true, devis: exemple },
    matrices_disponibles: {
      vehicules: Object.values(matrices.TARIFS_VEHICULES),
      saisonnalite: matrices.MATRICE_SAISONNALITE,
      urgence: matrices.MATRICE_URGENCE,
      capacite: matrices.MATRICE_CAPACITE,
      options: matrices.MATRICE_OPTIONS,
      tva: matrices.TAUX_TVA,
      marge_commerciale: matrices.TAUX_MARGE_COMMERCIALE,
      max_passagers: matrices.MAX_PASSAGERS,
    },
  });
}
