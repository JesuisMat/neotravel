import { notifyCommercial } from "@/lib/email/send-devis";
import type { NotifyCommercialParams } from "@/lib/email/send-devis";

export async function POST(req: Request) {
  const secret = req.headers.get("x-internal-secret");
  if (secret !== process.env.INTERNAL_API_KEY) {
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    const body = (await req.json()) as NotifyCommercialParams;
    await notifyCommercial(body);
    return new Response("ok", { status: 200 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Erreur inconnue";
    return new Response(message, { status: 500 });
  }
}
