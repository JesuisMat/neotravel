import { streamText, stepCountIs, convertToModelMessages } from "ai";
import { createGateway } from "@ai-sdk/gateway";
import { SYSTEM_PROMPT } from "@/lib/agent/system-prompt";
import { agentTools } from "@/lib/agent/tools";

export const runtime = "nodejs";
export const maxDuration = 60;

const gateway = createGateway({
  apiKey: process.env.AI_GATEWAY_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    if (!Array.isArray(messages)) {
      return new Response("messages requis", { status: 400 });
    }

    const now = new Date();
    const dateContext = `\n\n## Contexte temporel (injecté automatiquement à chaque requête)\nDate et heure actuelles (Europe/Paris) : ${now.toLocaleString("fr-FR", { timeZone: "Europe/Paris", weekday: "long", year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit" })}\nDate ISO : ${now.toISOString()}\nUtilise ces informations pour détecter les incohérences de dates (départ dans le passé, retour avant départ, etc.) et calculer le code d'urgence (DD_PRIORITAIRE / DD_URGENT / DD_NORMAL / DD_3MOISETPLUS).`;

    const result = streamText({
      model: gateway("anthropic/claude-haiku-4-5-20251001"),
      system: SYSTEM_PROMPT + dateContext,
      messages: await convertToModelMessages(messages),
      tools: agentTools,
      stopWhen: stepCountIs(10),
      temperature: 0.3,
      onError: ({ error }) => {
        console.error("[chat/route] streamText error:", error);
      },
    });

    return result.toUIMessageStreamResponse();
  } catch (err) {
    console.error("[chat/route] POST error:", err);
    return new Response("Erreur serveur", { status: 500 });
  }
}
