import { createAdminClient } from "@/lib/supabase/server";
import { DashboardClient } from "./DashboardClient";
import type { StatutDemande } from "@/lib/supabase/types";

export const dynamic = "force-dynamic";

interface LeadRow {
  id: string;
  nom: string | null;
  email: string | null;
  telephone: string | null;
  type_client: string | null;
  nom_entreprise: string | null;
  origine: string | null;
  destination: string | null;
  date_depart: string | null;
  heure_depart: string | null;
  date_retour: string | null;
  heure_retour: string | null;
  statut: StatutDemande;
  urgence: string;
  nb_passagers: number | null;
  notes: string | null;
  created_at: string;
  devis: Array<{
    id: string;
    montant_ttc: number;
    email_envoye_at: string | null;
    prochaine_relance: string | null;
    nb_relances: number;
    decision: string | null;
  }>;
}

export default async function DashboardPage() {
  const supabase = createAdminClient();


  const [
    { data: leads },
    { count: countRelances },
    { count: countComplexes },
  ] = await Promise.all([
    supabase
      .from("demandes")
      .select(
        `id, nom, email, telephone, type_client, nom_entreprise,
         origine, destination, date_depart, heure_depart, date_retour, heure_retour,
         statut, urgence, nb_passagers, notes, created_at,
         devis (id, montant_ttc, email_envoye_at, prochaine_relance, nb_relances, decision)`
      )
      .order("created_at", { ascending: false })
      .limit(100),

    supabase
      .from("demandes")
      .select("*", { count: "exact", head: true })
      .in("statut", ["devis_envoye", "relance_1", "relance_2"]),

    supabase
      .from("demandes")
      .select("*", { count: "exact", head: true })
      .eq("statut", "complexe"),
  ]);

  const leadsData = (leads ?? []) as LeadRow[];

  // KPIs
  const totalLeads = leadsData.length;
  const devisEnvoyes = leadsData.filter((l) =>
    ["devis_envoye", "relance_1", "relance_2", "accepte_prospect", "confirme", "refuse", "cloture"].includes(l.statut)
  ).length;
  const confirmes = leadsData.filter((l) => l.statut === "confirme").length;
  const enRelance = countRelances ?? 0;
  const casComplexes = countComplexes ?? 0;

  const montantPipeline = leadsData
    .filter((l) => !["refuse", "cloture"].includes(l.statut))
    .reduce((sum, l) => {
      const d = l.devis[0];
      return sum + (d?.montant_ttc ?? 0);
    }, 0);

  return (
    <DashboardClient
      leads={leadsData}
      kpis={{
        totalLeads,
        devisEnvoyes,
        confirmes,
        enRelance,
        casComplexes,
        montantPipeline,
      }}
    />
  );
}
