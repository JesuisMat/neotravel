import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import { calculer_devis } from "@/lib/devis/calculer-devis";
import { estimerDistance } from "@/lib/devis/distances";
import { sendDevisEmail } from "@/lib/email/send-devis";
import { z } from "zod";
import type { TypeVehicule, OptionDevis } from "@/lib/devis/types";

function inferTypeVehicule(nb: number): TypeVehicule {
  if (nb <= 19) return "minibus_19";
  if (nb <= 53) return "autocar_53";
  if (nb <= 63) return "autocar_63";
  if (nb <= 67) return "autocar_67";
  return "autocar_85";
}

function calcProchaineRelance(urgence: string, baseDate: Date): Date {
  const isUrgent = urgence === "urgent" || urgence === "tres_urgent";
  const result = new Date(baseDate);
  result.setDate(result.getDate() + (isUrgent ? 2 : 3));
  return result;
}

const bodySchema = z.object({
  // Champs complétés/corrigés par le commercial dans le formulaire
  nom: z.string().optional(),
  email: z.string().min(1).transform((v) => v.trim()),
  telephone: z.string().optional(),
  origine: z.string().min(1),
  destination: z.string().min(1),
  date_depart: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Format YYYY-MM-DD requis"),
  heure_depart: z.string().optional(),
  date_retour: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  heure_retour: z.string().optional(),
  nb_passagers: z.number().int().positive().max(85),
  options: z.array(z.enum(["guide", "nuit_chauffeur", "peages"])).optional(),
  urgence: z.enum(["standard", "urgent", "tres_urgent"]).default("standard"),
});

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: demandeId } = await params;
  const supabase = createAdminClient();

  // Vérifier que la demande existe et est bien un cas complexe
  const { data: demande, error: errFetch } = await supabase
    .from("demandes")
    .select("id, statut, nom, email, type_client, nom_entreprise")
    .eq("id", demandeId)
    .single();

  if (errFetch || !demande) {
    return NextResponse.json({ error: "Demande introuvable" }, { status: 404 });
  }
  if (demande.statut !== "complexe") {
    return NextResponse.json({ error: "Cette demande n'est pas un cas complexe" }, { status: 400 });
  }

  const body = await req.json();
  const parsed = bodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Données invalides", details: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const p = parsed.data;

  try {
    // Calcul distance
    const { km: distance_km, estime: distanceEstimee } = estimerDistance(p.origine, p.destination);
    const typeVehicule = inferTypeVehicule(p.nb_passagers);
    const options = (p.options ?? []) as OptionDevis[];

    // Calcul devis
    const resultat = calculer_devis({
      nb_passagers: p.nb_passagers,
      date_depart: p.date_depart,
      date_retour: p.date_retour,
      distance_km,
      type_vehicule: typeVehicule,
      options,
    });

    if (resultat.prix_ttc > 15000) {
      return NextResponse.json(
        { error: `Montant TTC (${resultat.prix_ttc} €) dépasse le seuil de 15 000 € — traitement manuel requis` },
        { status: 422 }
      );
    }

    const maintenant = new Date();
    const prochaineRelance = calcProchaineRelance(p.urgence, maintenant);

    // Mettre à jour la demande avec les infos complétées
    await supabase.from("demandes").update({
      nom: p.nom ?? demande.nom,
      email: p.email,
      telephone: p.telephone ?? null,
      origine: p.origine,
      destination: p.destination,
      date_depart: p.date_depart,
      heure_depart: p.heure_depart ?? null,
      date_retour: p.date_retour ?? null,
      heure_retour: p.heure_retour ?? null,
      nb_passagers: p.nb_passagers,
      urgence: p.urgence,
      score_completude: 100,
      statut: "devis_envoye",
    }).eq("id", demandeId);

    // Créer le devis
    const { data: devisRow, error: errDevis } = await supabase
      .from("devis")
      .insert({
        demande_id: demandeId,
        montant_ht: resultat.prix_ht,
        tva_rate: 0.1,
        montant_tva: resultat.tva.montant,
        montant_ttc: resultat.prix_ttc,
        lignes: resultat.lignes,
        parametres_calcul: {
          nb_passagers: p.nb_passagers,
          type_vehicule: typeVehicule,
          distance_km,
          distance_estimee: distanceEstimee,
          options,
          urgence_code: resultat.urgence_code,
          saison_niveau: resultat.saison_niveau,
        },
        prochaine_relance: prochaineRelance.toISOString(),
      })
      .select("id, decision_token")
      .single();

    if (errDevis || !devisRow) {
      throw new Error(`Erreur création devis: ${errDevis?.message}`);
    }

    // Envoyer l'email
    await sendDevisEmail({
      demande_id: demandeId,
      devis_id: devisRow.id,
      decision_token: devisRow.decision_token,
      email: p.email,
      nom: p.nom ?? demande.nom ?? undefined,
      prix_ht: resultat.prix_ht,
      tva: resultat.tva.montant,
      prix_ttc: resultat.prix_ttc,
      origine: p.origine,
      destination: p.destination,
      date_depart: p.date_depart,
      heure_depart: p.heure_depart,
      date_retour: p.date_retour,
      heure_retour: p.heure_retour,
      nb_passagers: p.nb_passagers,
      lignes: resultat.lignes,
      coefficients: resultat.coefficients,
    });

    // Mettre à jour email_envoye_at
    await supabase.from("devis")
      .update({ email_envoye_at: new Date().toISOString() })
      .eq("id", devisRow.id);

    await supabase.from("logs").insert({
      demande_id: demandeId,
      action: "devis_complexe_envoye",
      source: "user",
      metadata: { devis_id: devisRow.id, prix_ttc: resultat.prix_ttc, type_vehicule: typeVehicule },
    });

    return NextResponse.json({
      success: true,
      devis_id: devisRow.id,
      prix_ttc: resultat.prix_ttc,
      distance_km,
      distance_estimee: distanceEstimee,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Erreur inconnue";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
