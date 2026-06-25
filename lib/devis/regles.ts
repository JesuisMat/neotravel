import {
  MATRICE_URGENCE,
  MATRICE_SAISONNALITE,
  MATRICE_CAPACITE,
} from "./matrices";
import type { CodeUrgence, NiveauSaison } from "./types";

/**
 * Calcule l'écart en heures entre la date de demande et la date de départ.
 */
export function calculerEcartHeures(
  date_demande: Date,
  date_depart: Date
): number {
  const ms = date_depart.getTime() - date_demande.getTime();
  return ms / (1000 * 60 * 60);
}

/**
 * Détermine le code d'urgence selon l'écart (date demande vs date départ).
 * Règle métier NeoTravel — voir project-doc/jour-1-cadrage.md §11.
 */
export function determinerUrgence(
  date_demande: Date,
  date_depart: Date
): CodeUrgence {
  const ecart_h = calculerEcartHeures(date_demande, date_depart);

  if (ecart_h < 0) {
    throw new Error(
      "La date de départ est dans le passé par rapport à la date de demande."
    );
  }

  const tranche = MATRICE_URGENCE.find(
    (t) => ecart_h >= t.ecart_min_h && ecart_h < t.ecart_max_h
  );

  if (!tranche) {
    return "DD_NORMAL";
  }
  return tranche.code;
}

/**
 * Détermine le niveau de saisonnalité à partir du mois de la date de départ.
 */
export function determinerSaison(date_depart: Date): NiveauSaison {
  const mois = date_depart.getMonth() + 1;
  const saison = MATRICE_SAISONNALITE.find((s) => s.mois.includes(mois));
  if (!saison) {
    throw new Error(`Aucune saison définie pour le mois ${mois}`);
  }
  return saison.niveau;
}

/**
 * Récupère le coefficient de capacité applicable selon le nombre de passagers.
 * Lève une erreur si hors plage (> 85 = escalade HITL).
 */
export function determinerCoefficientCapacite(nb_passagers: number): number {
  if (nb_passagers <= 0) {
    throw new Error("Le nombre de passagers doit être strictement positif.");
  }

  const tranche = MATRICE_CAPACITE.find(
    (t) => nb_passagers >= t.min && nb_passagers <= t.max
  );

  if (!tranche) {
    throw new Error(
      `Nombre de passagers (${nb_passagers}) hors plage gérée (1 à 85). Cas complexe : escalade HITL requise.`
    );
  }
  return tranche.coefficient;
}
