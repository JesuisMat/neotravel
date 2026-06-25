import { createAdminClient } from "@/lib/supabase/server";
import { z } from "zod";

const schema = z.object({
  statut: z.enum(["devis_envoye", "refuse", "cloture", "confirme"]),
});

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: demandeId } = await params;

  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return Response.json({ error: "Statut invalide" }, { status: 400 });
  }

  const supabase = createAdminClient();

  const { error } = await supabase
    .from("demandes")
    .update({ statut: parsed.data.statut })
    .eq("id", demandeId)
    .eq("statut", "complexe");

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  await supabase.from("logs").insert({
    demande_id: demandeId,
    action: `complexe_traite_${parsed.data.statut}`,
    source: "user",
    metadata: { nouveau_statut: parsed.data.statut },
  });

  return Response.json({ success: true });
}
