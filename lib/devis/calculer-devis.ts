import {
  TARIFS_VEHICULES,
  MATRICE_SAISONNALITE,
  MATRICE_URGENCE,
  MATRICE_CAPACITE,
  MATRICE_OPTIONS,
  TAUX_TVA,
  TAUX_MARGE_COMMERCIALE,
  MAX_PASSAGERS,
  calculerBaseDistance,
} from "./matrices";
import {
  determinerCoefficientCapacite,
  determinerSaison,
  determinerUrgence,
} from "./regles";
import type {
  CalculerDevisParams,
  CoefficientApplique,
  DetailOptions,
  LigneCalcul,
  ResultatDevis,
} from "./types";

/**
 * ============================================================================
 * calculer_devis() — LE CŒUR FIABLE DU SYSTÈME NeoTravel
 * ============================================================================
 *
 * Fonction TypeScript PURE et DÉTERMINISTE. ZÉRO appel au LLM, jamais.
 * Un devis est un engagement commercial : il doit être reproductible et
 * auditable. Aucune phrase du prospect ne peut influencer le prix hors
 * des paramètres structurés validés.
 *
 * Source des règles : project-doc/jour-1-cadrage.md §11
 * Ordre du calcul (source: project-doc/regle_calcul_quote.md) :
 *   1. Base transfert simple = forfait table (≤ 180km) ou (km×2)×2,5 (>180km)
 *   2. Aller/Retour = base_simple × 2 si date_retour présente
 *   3. Application des coefficients (saison, urgence, capacité) sur la base
 *   4. Ajout des options (montants fixes × unités)
 *   5. Sous-total HT
 *   6. Marge commerciale (15 %) sur le sous-total HT
 *   7. Prix HT = sous-total HT + marge
 *   8. TVA (10 %) sur le prix HT
 *   9. Prix TTC = prix HT + TVA
 *
 * Tous les montants sont arrondis à 2 décimales pour la stabilité comptable.
 * ============================================================================
 */

function round2(n: number): number {
  return Math.round((n + Number.EPSILON) * 100) / 100;
}

function toDate(v: string | Date | undefined, fallback: Date): Date {
  if (v === undefined) return fallback;
  return v instanceof Date ? v : new Date(v);
}

export function calculer_devis(params: CalculerDevisParams): ResultatDevis {
  const {
    nb_passagers,
    date_depart: date_depart_raw,
    distance_km,
    type_vehicule,
    options: options_demandees = [],
  } = params;

  // --- Validation des invariants métier -------------------------------
  if (!Number.isFinite(nb_passagers) || nb_passagers <= 0) {
    throw new Error("Le nombre de passagers doit être strictement positif.");
  }
  if (nb_passagers > MAX_PASSAGERS) {
    throw new Error(
      `Nombre de passagers (${nb_passagers}) supérieur au maximum géré (${MAX_PASSAGERS}). Cas complexe : escalade HITL requise.`
    );
  }
  if (!Number.isFinite(distance_km) || distance_km <= 0) {
    throw new Error("La distance doit être strictement positive.");
  }

  const maintenant = new Date();
  const date_demande = toDate(params.date_demande, maintenant);
  const date_depart = toDate(date_depart_raw, maintenant);

  if (isNaN(date_depart.getTime())) {
    throw new Error("La date de départ est invalide.");
  }
  if (isNaN(date_demande.getTime())) {
    throw new Error("La date de demande est invalide.");
  }
  if (date_depart.getTime() < date_demande.getTime()) {
    throw new Error(
      "La date de départ ne peut pas être antérieure à la date de demande."
    );
  }

  const vehicule = TARIFS_VEHICULES[type_vehicule];
  if (!vehicule) {
    throw new Error(`Type de véhicule inconnu : ${type_vehicule}`);
  }

  // --- 1. Base transfert simple (aller) ------------------------------
  // Forfait table jusqu'à 180 km ; au-delà : (km × 2) × 2,5 €/km
  const base_simple = round2(calculerBaseDistance(distance_km));

  // --- 2. Aller/Retour -----------------------------------------------
  // Si date_retour est renseignée, la formule est transfert_simple × 2
  const has_retour =
    params.date_retour !== undefined && params.date_retour !== null;
  const base_distance = has_retour ? round2(base_simple * 2) : base_simple;

  const formule =
    distance_km <= 180
      ? `Forfait ${Math.min(Math.ceil(distance_km / 10) * 10, 180)} km`
      : `${distance_km} km × 2 × 2,5 €/km`;
  const aller_retour_label = has_retour ? " (aller/retour)" : " (aller simple)";

  const base_km: LigneCalcul = {
    libelle: `${vehicule.label} — ${formule}${aller_retour_label}`,
    montant: base_distance,
  };

  // --- 2. Coefficients ------------------------------------------------
  const code_urgence = determinerUrgence(date_demande, date_depart);
  const niveau_saison = determinerSaison(date_depart);
  const coef_capacite = determinerCoefficientCapacite(nb_passagers);

  const coef_saison_val =
    MATRICE_SAISONNALITE.find((s) => s.niveau === niveau_saison)?.coefficient ??
    0;
  const coef_urgence_val =
    MATRICE_URGENCE.find((u) => u.code === code_urgence)?.coefficient ?? 0;
  const coef_cap_val =
    MATRICE_CAPACITE.find(
      (t) => nb_passagers >= t.min && nb_passagers <= t.max
    )?.coefficient ?? 0;

  const coefficients: CoefficientApplique[] = [
    { type: "saisonnalite", code: niveau_saison, valeur: coef_saison_val },
    { type: "urgence", code: code_urgence, valeur: coef_urgence_val },
    { type: "capacite", code: String(nb_passagers), valeur: coef_cap_val },
  ];

  const somme_coefs =
    coef_saison_val + coef_urgence_val + coef_cap_val;
  const ajustement_coefs = base_distance * somme_coefs;

  // --- 3. Options -----------------------------------------------------
  const lignes: LigneCalcul[] = [base_km];

  if (ajustement_coefs !== 0) {
    lignes.push({
      libelle: `Ajustements coefficients (${[
        `saison ${coef_saison_val >= 0 ? "+" : ""}${(coef_saison_val * 100).toFixed(0)}%`,
        `urgence ${coef_urgence_val >= 0 ? "+" : ""}${(coef_urgence_val * 100).toFixed(0)}%`,
        `capacité ${coef_cap_val >= 0 ? "+" : ""}${(coef_cap_val * 100).toFixed(0)}%`,
      ].join(", ")})`,
      montant: round2(ajustement_coefs),
    });
  }

  const detail_options: DetailOptions[] = options_demandees.map((opt) => {
    const tarif = MATRICE_OPTIONS.find((o) => o.code === opt);
    if (!tarif) {
      throw new Error(`Option inconnue : ${opt}`);
    }
    // Durée de la prestation : date_retour - date_depart (min 1 jour).
    // Le guide facture au jour de prestation, la nuit chauffeur à la nuit
    // sur place — jamais sur l'anticipation (date_demande).
    const date_retour = toDate(params.date_retour, date_depart);
    const nb_jours_prestation = Math.max(
      1,
      Math.ceil(
        (date_retour.getTime() - date_depart.getTime()) / (1000 * 60 * 60 * 24)
      )
    );
    const nb_unites = tarif.unite === "forfait" ? 1 : nb_jours_prestation;
    const montant = tarif.montant * nb_unites;
    return {
      libelle: `${tarif.label} (${tarif.unite})`,
      montant: round2(montant),
      nb_unites,
    };
  });

  for (const opt of detail_options) {
    lignes.push({ libelle: opt.libelle, montant: opt.montant });
  }

  // --- 4. Sous-total HT ----------------------------------------------
  const sous_total_ht = round2(
    base_distance + ajustement_coefs + detail_options.reduce((s, o) => s + o.montant, 0)
  );

  // --- 5. Marge commerciale ------------------------------------------
  const marge_montant = round2(sous_total_ht * TAUX_MARGE_COMMERCIALE);
  lignes.push({ libelle: "Marge commerciale (15%)", montant: marge_montant });

  // --- 6. Prix HT -----------------------------------------------------
  const prix_ht = round2(sous_total_ht + marge_montant);

  // --- 7. TVA ---------------------------------------------------------
  const tva_montant = round2(prix_ht * TAUX_TVA);
  lignes.push({ libelle: "TVA (10%)", montant: tva_montant });

  // --- 8. Prix TTC ----------------------------------------------------
  const prix_ttc = round2(prix_ht + tva_montant);

  return {
    base_km,
    coefficients,
    options: detail_options,
    sous_total_ht,
    marge: { libelle: "Marge commerciale (15%)", montant: marge_montant },
    prix_ht,
    tva: { libelle: "TVA (10%)", montant: tva_montant },
    prix_ttc,
    urgence_code: code_urgence,
    saison_niveau: niveau_saison,
    devise: "EUR",
    lignes,
  };
}
