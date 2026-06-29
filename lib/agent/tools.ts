import { tool, zodSchema } from "ai";
import { z } from "zod";
import { calculer_devis } from "@/lib/devis/calculer-devis";
import { estimerDistance } from "@/lib/devis/distances";
import { createAdminClient } from "@/lib/supabase/server";
import type { TypeVehicule, OptionDevis } from "@/lib/devis/types";

// ============================================================
// Mapping nb_passagers → type_vehicule
// ============================================================
function inferTypeVehicule(nb: number): TypeVehicule {
  if (nb <= 19) return "minibus_19";
  if (nb <= 53) return "autocar_53";
  if (nb <= 63) return "autocar_63";
  if (nb <= 67) return "autocar_67";
  return "autocar_85";
}

// ============================================================
// Calcul prochaine relance selon urgence
// ============================================================
function calcProchaineRelance(urgence: string, baseDate: Date): Date {
  const isUrgent = urgence === "urgent" || urgence === "tres_urgent";
  const joursRelance1 = isUrgent ? 2 : 3;
  const result = new Date(baseDate);
  result.setDate(result.getDate() + joursRelance1);
  return result;
}

// ============================================================
// Schémas Zod
// ============================================================
const calculerDevisInputSchema = z.object({
  demande_id: z.string().optional().describe("ID de la demande Supabase si déjà créée"),
  nom: z.string().optional().describe("Nom du prospect"),
  email: z.string().email().describe("Email du prospect"),
  telephone: z.string().describe("Téléphone du prospect (mettre 'non communiqué' si refus)"),
  type_client: z
    .enum(["particulier", "entreprise", "association", "scolaire"])
    .default("particulier")
    .describe("Type de client : particulier, entreprise, association ou scolaire"),
  nom_entreprise: z
    .string()
    .optional()
    .describe("Nom de l'entreprise / établissement scolaire / association (si type_client != particulier)"),
  origine: z.string().describe("Ville/lieu de départ"),
  destination: z.string().describe("Ville/lieu d'arrivée"),
  date_depart: z.string().describe("Date de départ au format YYYY-MM-DD"),
  date_retour: z.string().optional().describe("Date de retour au format YYYY-MM-DD"),
  nb_passagers: z.number().int().positive().describe("Nombre TOTAL de passagers à transporter, personne faisant la demande incluse"),
  options: z
    .array(z.enum(["guide", "nuit_chauffeur", "peages"]))
    .optional()
    .describe("Options souhaitées"),
  notes: z.string().optional().describe("Notes ou commentaires du prospect"),
  urgence: z
    .enum(["standard", "urgent", "tres_urgent"])
    .default("standard")
    .describe("Niveau d'urgence de la demande"),
});

const envoyerDevisInputSchema = z.object({
  demande_id: z.string().describe("ID de la demande Supabase"),
  devis_id: z.string().describe("ID du devis Supabase"),
  decision_token: z.string().describe("Token de décision pour les liens email"),
  email: z.string().email().describe("Email du prospect"),
  nom: z.string().optional().describe("Nom du prospect pour la personnalisation"),
  prix_ht: z.number().describe("Montant HT"),
  tva: z.number().describe("Montant TVA"),
  prix_ttc: z.number().describe("Montant TTC pour affichage dans l'email"),
  origine: z.string().describe("Ville de départ"),
  destination: z.string().describe("Ville d'arrivée"),
  date_depart: z.string().describe("Date de départ"),
  date_retour: z.string().optional().describe("Date de retour"),
  nb_passagers: z.number().optional().describe("Nombre de passagers"),
  lignes: z
    .array(z.object({ libelle: z.string(), montant: z.number() }))
    .optional()
    .describe("Lignes de calcul du devis pour le PDF"),
  coefficients: z
    .array(
      z.object({
        type: z.enum(["saisonnalite", "urgence", "capacite"]),
        code: z.string(),
        valeur: z.number(),
      })
    )
    .optional()
    .describe("Coefficients appliqués pour le PDF"),
});

const escaladerInputSchema = z.object({
  demande_id: z.string().optional().describe("ID de la demande si déjà créée"),
  nom: z.string().optional(),
  email: z.string().optional(),
  telephone: z.string().optional(),
  type_client: z.enum(["particulier", "entreprise", "association", "scolaire"]).optional(),
  nom_entreprise: z.string().optional(),
  origine: z.string().optional(),
  destination: z.string().optional(),
  nb_passagers: z.number().optional(),
  raison_escalade: z.string().describe("Raison précise de l'escalade (critère HITL déclenché)"),
  resume_conversation: z.string().describe("Résumé du contexte conversationnel pour le commercial"),
  prix_ttc_estime: z.number().optional().describe("Prix TTC estimé si calculé"),
});

const sauvegarderContexteInputSchema = z.object({
  demande_id: z.string().optional().describe("ID existant si déjà créé"),
  nom: z.string().optional(),
  email: z.string().optional(),
  telephone: z.string().optional(),
  origine: z.string().optional(),
  destination: z.string().optional(),
  date_depart: z.string().optional(),
  date_retour: z.string().optional(),
  nb_passagers: z.number().optional(),
  options: z.array(z.enum(["guide", "nuit_chauffeur", "peages"])).optional(),
  notes: z.string().optional(),
  score_completude: z.number().min(0).max(100).describe("Score de complétude estimé (0-100)"),
  nb_echanges: z.number().describe("Nombre d'échanges effectués"),
});

// ============================================================
// TOOL 1 — calculer_et_enregistrer_devis
// ============================================================
export const toolCalculerDevis = tool({
  description:
    "Calcule le devis de transport et l'enregistre en base de données. " +
    "Appelle cette fonction une fois que toutes les informations obligatoires sont collectées et confirmées par le prospect.",
  inputSchema: zodSchema(calculerDevisInputSchema),
  execute: async (params) => {
    const supabase = createAdminClient();

    try {
      const typeVehicule = inferTypeVehicule(params.nb_passagers);
      const options = (params.options ?? []) as OptionDevis[];

      // Distance : table de référence d'abord, fallback 200 km si paire inconnue
      const { km: distance_km, estime: distanceEstimee } = estimerDistance(
        params.origine,
        params.destination
      );

      const resultat = calculer_devis({
        nb_passagers: params.nb_passagers,
        date_depart: params.date_depart,
        date_retour: params.date_retour,
        distance_km,
        type_vehicule: typeVehicule,
        options,
      });

      // Vérification HITL avant d'aller plus loin
      if (resultat.prix_ttc > 15000) {
        return {
          hitl: true,
          raison: `Montant TTC (${resultat.prix_ttc} EUR) supérieur au seuil de 15 000 EUR`,
          prix_ttc: resultat.prix_ttc,
        };
      }

      // Création ou récupération de la demande
      let demandeId = params.demande_id;

      if (!demandeId) {
        const { data: demande, error: errDemande } = await supabase
          .from("demandes")
          .insert({
            nom: params.nom ?? null,
            email: params.email,
            telephone: params.telephone,
            type_client: params.type_client ?? "particulier",
            nom_entreprise: params.nom_entreprise ?? null,
            origine: params.origine,
            destination: params.destination,
            date_depart: params.date_depart,
            date_retour: params.date_retour ?? null,
            nb_passagers: params.nb_passagers,
            distance_km,
            notes: params.notes ?? null,
            urgence: params.urgence,
            score_completude: 100,
            statut: "complet",
          })
          .select("id")
          .single();

        if (errDemande || !demande) {
          throw new Error(`Erreur création demande: ${errDemande?.message}`);
        }
        demandeId = demande.id;
      }

      // Calcul prochaine relance
      const maintenant = new Date();
      const prochaineRelance = calcProchaineRelance(params.urgence, maintenant);

      // Enregistrement du devis
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
            nb_passagers: params.nb_passagers,
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

      // Log
      await supabase.from("logs").insert({
        demande_id: demandeId,
        action: "devis_calcule",
        source: "agent",
        metadata: {
          devis_id: devisRow.id,
          prix_ttc: resultat.prix_ttc,
          type_vehicule: typeVehicule,
        },
      });

      return {
        hitl: false,
        demande_id: demandeId,
        devis_id: devisRow.id,
        decision_token: devisRow.decision_token,
        prix_ht: resultat.prix_ht,
        prix_ttc: resultat.prix_ttc,
        tva: resultat.tva.montant,
        lignes: resultat.lignes,
        type_vehicule: typeVehicule,
        urgence_code: resultat.urgence_code,
        saison_niveau: resultat.saison_niveau,
        distance_km,
        distance_estimee: distanceEstimee,
      };
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erreur inconnue";
      throw new Error(`calculer_et_enregistrer_devis: ${message}`);
    }
  },
});

// ============================================================
// TOOL 2 — envoyer_devis_email
// ============================================================
export const toolEnvoyerDevis = tool({
  description:
    "Envoie le devis calculé par email au prospect via Resend. " +
    "Appelle cette fonction après calculer_et_enregistrer_devis.",
  inputSchema: zodSchema(envoyerDevisInputSchema),
  execute: async (params) => {
    const supabase = createAdminClient();

    try {
      const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
      const res = await fetch(`${baseUrl}/api/email/send-devis`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-internal-secret": process.env.INTERNAL_API_KEY ?? "",
        },
        body: JSON.stringify(params),
      });

      if (!res.ok) {
        const err = await res.text();
        throw new Error(`Erreur envoi email: ${err}`);
      }

      // Mise à jour statut demande → devis_envoye
      await supabase
        .from("demandes")
        .update({ statut: "devis_envoye" })
        .eq("id", params.demande_id);

      // Mise à jour devis email_envoye_at
      await supabase
        .from("devis")
        .update({ email_envoye_at: new Date().toISOString() })
        .eq("id", params.devis_id);

      // Log
      await supabase.from("logs").insert({
        demande_id: params.demande_id,
        action: "devis_email_envoye",
        source: "agent",
        metadata: {
          devis_id: params.devis_id,
          email: params.email,
        },
      });

      return { success: true, email: params.email };
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erreur inconnue";
      throw new Error(`envoyer_devis_email: ${message}`);
    }
  },
});

// ============================================================
// TOOL 3 — escalader_hitl
// ============================================================
export const toolEscaladerHITL = tool({
  description:
    "Escalade la demande vers un commercial NeoTravel. " +
    "Utilise quand les critères HITL sont atteints (montant > 15k, > 85 pax, ambiguïté persistante, etc.)",
  inputSchema: zodSchema(escaladerInputSchema),
  execute: async (params) => {
    const supabase = createAdminClient();

    try {
      let demandeId = params.demande_id;

      if (!demandeId && params.email) {
        const { data: demande } = await supabase
          .from("demandes")
          .insert({
            nom: params.nom ?? null,
            email: params.email,
            telephone: params.telephone ?? null,
            type_client: params.type_client ?? "particulier",
            nom_entreprise: params.nom_entreprise ?? null,
            origine: params.origine ?? null,
            destination: params.destination ?? null,
            nb_passagers: params.nb_passagers ?? null,
            statut: "complexe",
            notes: `Escalade HITL: ${params.raison_escalade}`,
          })
          .select("id")
          .single();
        demandeId = demande?.id;
      } else if (demandeId) {
        await supabase
          .from("demandes")
          .update({ statut: "complexe" })
          .eq("id", demandeId);
      }

      const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
      await fetch(`${baseUrl}/api/email/notify-commercial`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-internal-secret": process.env.INTERNAL_API_KEY ?? "",
        },
        body: JSON.stringify({
          demande_id: demandeId,
          raison_escalade: params.raison_escalade,
          resume_conversation: params.resume_conversation,
          contact: {
            nom: params.nom,
            email: params.email,
            telephone: params.telephone,
          },
          trajet: {
            origine: params.origine,
            destination: params.destination,
            nb_passagers: params.nb_passagers,
          },
          prix_ttc_estime: params.prix_ttc_estime,
        }),
      });

      if (demandeId) {
        await supabase.from("logs").insert({
          demande_id: demandeId,
          action: "escalade_hitl",
          source: "agent",
          metadata: {
            raison: params.raison_escalade,
          },
        });
      }

      return { success: true, demande_id: demandeId };
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erreur inconnue";
      throw new Error(`escalader_hitl: ${message}`);
    }
  },
});

// ============================================================
// TOOL 4 — sauvegarder_contexte
// ============================================================
export const toolSauvegarderContexte = tool({
  description:
    "Crée ou met à jour la fiche prospect en base de données avec les informations collectées jusqu'ici. " +
    "Utilise en cours de conversation pour persister l'état.",
  inputSchema: zodSchema(sauvegarderContexteInputSchema),
  execute: async (params) => {
    const supabase = createAdminClient();

    try {
      if (params.demande_id) {
        await supabase
          .from("demandes")
          .update({
            nom: params.nom ?? undefined,
            email: params.email ?? undefined,
            telephone: params.telephone ?? undefined,
            origine: params.origine ?? undefined,
            destination: params.destination ?? undefined,
            date_depart: params.date_depart ?? undefined,
            date_retour: params.date_retour ?? undefined,
            nb_passagers: params.nb_passagers ?? undefined,
            notes: params.notes ?? undefined,
            score_completude: params.score_completude,
            nb_echanges: params.nb_echanges,
            statut: "en_qualification",
          })
          .eq("id", params.demande_id);

        return { demande_id: params.demande_id };
      }

      const { data, error } = await supabase
        .from("demandes")
        .insert({
          nom: params.nom ?? null,
          email: params.email ?? null,
          telephone: params.telephone ?? null,
          origine: params.origine ?? null,
          destination: params.destination ?? null,
          date_depart: params.date_depart ?? null,
          date_retour: params.date_retour ?? null,
          nb_passagers: params.nb_passagers ?? null,
          notes: params.notes ?? null,
          score_completude: params.score_completude,
          nb_echanges: params.nb_echanges,
          statut: "en_qualification",
        })
        .select("id")
        .single();

      if (error) throw new Error(error.message);

      return { demande_id: data?.id };
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erreur inconnue";
      throw new Error(`sauvegarder_contexte: ${message}`);
    }
  },
});

export const agentTools = {
  calculer_et_enregistrer_devis: toolCalculerDevis,
  envoyer_devis_email: toolEnvoyerDevis,
  escalader_hitl: toolEscaladerHITL,
  sauvegarder_contexte: toolSauvegarderContexte,
};
