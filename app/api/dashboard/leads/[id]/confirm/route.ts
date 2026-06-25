import { createAdminClient } from "@/lib/supabase/server";

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: demandeId } = await params;
  const supabase = createAdminClient();

  const { error } = await supabase
    .from("demandes")
    .update({ statut: "confirme" })
    .eq("id", demandeId)
    .eq("statut", "accepte_prospect");

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  await supabase.from("logs").insert({
    demande_id: demandeId,
    action: "statut_confirme",
    source: "user",
    metadata: {},
  });

  return Response.json({ success: true });
}
