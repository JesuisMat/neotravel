export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type StatutDemande =
  | "nouveau"
  | "en_qualification"
  | "complet"
  | "complexe"
  | "devis_envoye"
  | "relance_1"
  | "relance_2"
  | "accepte_prospect"
  | "confirme"
  | "refuse"
  | "cloture";

export type TypeVehiculeDB = "standard" | "premium" | "luxe" | "minibus";
export type UrgenceDB = "standard" | "urgent" | "tres_urgent";
export type TypeRelance = "relance_1" | "relance_2" | "cloture";
export type StatutRelance = "envoye" | "ouvert" | "erreur";
export type SourceLog = "agent" | "n8n" | "system" | "user";
export type DecisionDevis = "accepte" | "refuse";

export interface Database {
  public: {
    Tables: {
      demandes: {
        Row: {
          id: string;
          created_at: string;
          updated_at: string;
          nom: string | null;
          email: string | null;
          telephone: string | null;
          origine: string | null;
          destination: string | null;
          date_depart: string | null;
          date_retour: string | null;
          nb_passagers: number | null;
          type_vehicule: TypeVehiculeDB | null;
          urgence: UrgenceDB;
          options: Json;
          distance_km: number | null;
          notes: string | null;
          score_completude: number;
          nb_echanges: number;
          contexte_chat: Json;
          statut: StatutDemande;
        };
        Insert: {
          id?: string;
          created_at?: string;
          updated_at?: string;
          nom?: string | null;
          email?: string | null;
          telephone?: string | null;
          origine?: string | null;
          destination?: string | null;
          date_depart?: string | null;
          date_retour?: string | null;
          nb_passagers?: number | null;
          type_vehicule?: TypeVehiculeDB | null;
          urgence?: UrgenceDB;
          options?: Json;
          distance_km?: number | null;
          notes?: string | null;
          score_completude?: number;
          nb_echanges?: number;
          contexte_chat?: Json;
          statut?: StatutDemande;
        };
        Update: Partial<Database["public"]["Tables"]["demandes"]["Insert"]>;
      };
      devis: {
        Row: {
          id: string;
          created_at: string;
          updated_at: string;
          demande_id: string;
          montant_ht: number;
          tva_rate: number;
          montant_tva: number;
          montant_ttc: number;
          lignes: Json;
          parametres_calcul: Json;
          pdf_url: string | null;
          email_envoye_at: string | null;
          nb_relances: number;
          prochaine_relance: string | null;
          decision_token: string | null;
          decision_at: string | null;
          decision: DecisionDevis | null;
        };
        Insert: {
          id?: string;
          created_at?: string;
          updated_at?: string;
          demande_id: string;
          montant_ht: number;
          tva_rate?: number;
          montant_tva: number;
          montant_ttc: number;
          lignes?: Json;
          parametres_calcul?: Json;
          pdf_url?: string | null;
          email_envoye_at?: string | null;
          nb_relances?: number;
          prochaine_relance?: string | null;
          decision_token?: string | null;
          decision_at?: string | null;
          decision?: DecisionDevis | null;
        };
        Update: Partial<Database["public"]["Tables"]["devis"]["Insert"]>;
      };
      relances: {
        Row: {
          id: string;
          created_at: string;
          devis_id: string;
          demande_id: string;
          type_relance: TypeRelance;
          statut: StatutRelance;
          date_envoi: string;
          email_dest: string | null;
          metadata: Json;
        };
        Insert: {
          id?: string;
          created_at?: string;
          devis_id: string;
          demande_id: string;
          type_relance: TypeRelance;
          statut?: StatutRelance;
          date_envoi?: string;
          email_dest?: string | null;
          metadata?: Json;
        };
        Update: Partial<Database["public"]["Tables"]["relances"]["Insert"]>;
      };
      logs: {
        Row: {
          id: string;
          created_at: string;
          demande_id: string | null;
          action: string;
          source: SourceLog;
          metadata: Json;
          tokens_input: number | null;
          tokens_output: number | null;
          erreur: string | null;
          duree_ms: number | null;
        };
        Insert: {
          id?: string;
          created_at?: string;
          demande_id?: string | null;
          action: string;
          source?: SourceLog;
          metadata?: Json;
          tokens_input?: number | null;
          tokens_output?: number | null;
          erreur?: string | null;
          duree_ms?: number | null;
        };
        Update: Partial<Database["public"]["Tables"]["logs"]["Insert"]>;
      };
    };
  };
}
