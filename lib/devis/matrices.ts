import type { NiveauSaison, CodeUrgence, OptionDevis } from "./types";

/**
 * MATRICES TARIFAIRES — NeoTravel
 *
 * Source : project-doc/regle_calcul_quote.md
 * Ces constantes sont volontairement isolées et documentées pour être
 * ajustables sans toucher à la logique de calcul.
 *
 * FORMULE TRANSFERT SIMPLE (aller sans retour) :
 *   - Jusqu'à 180 km : forfait selon la grille FORFAIT_KM ci-dessous
 *   - Au-delà de 180 km : (km × 2) × 2,5 € / km parcouru
 *
 * FORMULE ALLER/RETOUR : base_transfert_simple × 2
 *
 * Les véhicules n'ont PAS de tarif propre par km dans la règle officielle :
 * la base distance est commune, puis le coefficient capacité module le prix.
 * On conserve le label et la capacité max pour l'affichage et les validations.
 */

export interface VehiculeTarif {
  type: string;
  label: string;
  capacite_max: number;
}

export const TARIFS_VEHICULES: Record<string, VehiculeTarif> = {
  minibus_19: { type: "minibus_19", label: "Minibus (≤ 19 pax)", capacite_max: 19 },
  autocar_53: { type: "autocar_53", label: "Autocar standard (≤ 53 pax)", capacite_max: 53 },
  autocar_63: { type: "autocar_63", label: "Grand autocar (≤ 63 pax)", capacite_max: 63 },
  autocar_67: { type: "autocar_67", label: "Autocar XL (≤ 67 pax)", capacite_max: 67 },
  autocar_85: { type: "autocar_85", label: "Autocar double (≤ 85 pax)", capacite_max: 85 },
};

/**
 * Grille forfaitaire jusqu'à 180 km (transfert simple).
 * Source : project-doc/regle_calcul_quote.md — tableau KM/€
 * Clé = distance en km, valeur = prix forfait €.
 */
export const FORFAIT_KM: Array<{ km: number; prix: number }> = [
  { km: 10,  prix: 250 },
  { km: 20,  prix: 250 },
  { km: 30,  prix: 250 },
  { km: 40,  prix: 320 },
  { km: 50,  prix: 350 },
  { km: 60,  prix: 390 },
  { km: 70,  prix: 430 },
  { km: 80,  prix: 500 },
  { km: 90,  prix: 540 },
  { km: 100, prix: 580 },
  { km: 110, prix: 620 },
  { km: 120, prix: 660 },
  { km: 130, prix: 700 },
  { km: 140, prix: 740 },
  { km: 150, prix: 780 },
  { km: 160, prix: 820 },
  { km: 170, prix: 860 },
  { km: 180, prix: 900 },
];

/**
 * Calcule la base distance (transfert simple aller) selon les règles officielles.
 *   - ≤ 180 km : forfait arrondi à la dizaine supérieure, plafonné à la tranche 180.
 *   - > 180 km : (km × 2) × 2,5 €/km
 */
export function calculerBaseDistance(distance_km: number): number {
  if (distance_km <= 180) {
    // Arrondi à la dizaine supérieure, plafonné à 180
    const tranche = Math.min(Math.ceil(distance_km / 10) * 10, 180);
    const forfait = FORFAIT_KM.find((f) => f.km === tranche);
    // Fallback au minimum si tranche introuvable (ex: distance < 10 km)
    return forfait?.prix ?? 250;
  }
  // Au-delà de 180 km : (km × 2) × 2,5
  return distance_km * 2 * 2.5;
}

export interface CoefficientSaison {
  niveau: NiveauSaison;
  label: string;
  mois: number[];
  coefficient: number;
}

export const MATRICE_SAISONNALITE: CoefficientSaison[] = [
  { niveau: "basse", label: "Saison basse", mois: [11, 1, 2, 8], coefficient: -0.07 },
  { niveau: "moyenne", label: "Saison moyenne", mois: [12, 10, 9], coefficient: 0.0 },
  { niveau: "haute", label: "Saison haute", mois: [3, 4, 7], coefficient: 0.1 },
  { niveau: "tres_haute", label: "Saison très haute", mois: [5, 6], coefficient: 0.15 },
];

export interface CoefficientUrgence {
  code: CodeUrgence;
  label: string;
  ecart_min_h: number;
  ecart_max_h: number;
  coefficient: number;
}

// Écarts exprimés en heures par rapport à la date de départ.
// Source : project-doc/regle_calcul_quote.md — PONDERATION DATE DEMANDE Vs DATE DEPART
//   DD_PRIORITAIRE : +10% => DEPART <= 14j
//   DD_URGENT      : + 5% => 14j < DEPART <= 30j
//   DD_NORMAL      : - 5% => 30j < DEPART <= 90j
//   DD_3MOISETPLUS : -10% => DEPART > 90j
export const MATRICE_URGENCE: CoefficientUrgence[] = [
  { code: "DD_PRIORITAIRE",  label: "Prioritaire (≤ 14 jours)",       ecart_min_h: 0,    ecart_max_h: 336,                      coefficient: 0.1  },
  { code: "DD_URGENT",       label: "Urgent (15 à 30 jours)",          ecart_min_h: 336,  ecart_max_h: 720,                      coefficient: 0.05 },
  { code: "DD_NORMAL",       label: "Normal (31 à 90 jours)",          ecart_min_h: 720,  ecart_max_h: 2160,                     coefficient: -0.05 },
  { code: "DD_3MOISETPLUS",  label: "Très anticipé (> 90 jours)",      ecart_min_h: 2160, ecart_max_h: Number.MAX_SAFE_INTEGER,  coefficient: -0.1 },
];

export interface TrancheCapacite {
  min: number;
  max: number;
  coefficient: number;
  label: string;
}

export const MATRICE_CAPACITE: TrancheCapacite[] = [
  { min: 1, max: 19, coefficient: -0.05, label: "≤ 19 passagers" },
  { min: 20, max: 53, coefficient: 0.0, label: "20 à 53 passagers" },
  { min: 54, max: 63, coefficient: 0.15, label: "54 à 63 passagers" },
  { min: 64, max: 67, coefficient: 0.2, label: "64 à 67 passagers" },
  { min: 68, max: 85, coefficient: 0.4, label: "68 à 85 passagers" },
];

export interface OptionTarif {
  code: OptionDevis;
  label: string;
  unite: "jour" | "nuit" | "forfait";
  montant: number;
}

export const MATRICE_OPTIONS: OptionTarif[] = [
  { code: "guide", label: "Guide / accompagnateur", unite: "jour", montant: 80 },
  { code: "nuit_chauffeur", label: "Nuit chauffeur", unite: "nuit", montant: 120 },
  { code: "peages", label: "Péages inclus", unite: "forfait", montant: 90 },
];

export const TAUX_TVA = 0.1;
export const TAUX_MARGE_COMMERCIALE = 0.15;

export const MAX_PASSAGERS = 85;
