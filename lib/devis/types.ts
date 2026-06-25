export type TypeVehicule =
  | "minibus_19"
  | "autocar_53"
  | "autocar_63"
  | "autocar_67"
  | "autocar_85";

export type OptionDevis = "guide" | "nuit_chauffeur" | "peages";

export type CodeUrgence =
  | "DD_PRIORITAIRE"
  | "DD_URGENT"
  | "DD_NORMAL"
  | "DD_3MOISETPLUS";

export type NiveauSaison = "basse" | "moyenne" | "haute" | "tres_haute";

export interface CalculerDevisParams {
  nb_passagers: number;
  date_depart: string | Date;
  date_demande?: string | Date;
  date_retour?: string | Date;
  distance_km: number;
  type_vehicule: TypeVehicule;
  options?: readonly OptionDevis[];
}

export interface LigneCalcul {
  libelle: string;
  montant: number;
}

export interface CoefficientApplique {
  type: "saisonnalite" | "urgence" | "capacite";
  code: string;
  valeur: number;
}

export interface DetailOptions {
  libelle: string;
  montant: number;
  nb_unites: number;
}

export interface ResultatDevis {
  base_km: LigneCalcul;
  coefficients: CoefficientApplique[];
  options: DetailOptions[];
  sous_total_ht: number;
  marge: LigneCalcul;
  prix_ht: number;
  tva: LigneCalcul;
  prix_ttc: number;
  urgence_code: CodeUrgence;
  saison_niveau: NiveauSaison;
  devise: "EUR";
  lignes: LigneCalcul[];
}
