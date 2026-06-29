import { streamText, stepCountIs, convertToModelMessages, validateUIMessages } from "ai";
import { createGateway } from "@ai-sdk/gateway";
import { SYSTEM_PROMPT } from "@/lib/agent/system-prompt";
import { agentTools } from "@/lib/agent/tools";
import { createAdminClient } from "@/lib/supabase/server";

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

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const validatedMessages = await validateUIMessages({ messages, tools: agentTools as any });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const modelMessages = await convertToModelMessages(validatedMessages, { tools: agentTools as any });

    const startedAt = Date.now();

    // Capture de la demande_id créée pendant la conversation (renseignée par le tool execute)
    let capturedDemandeId: string | null = null;

    const result = streamText({
      model: gateway("anthropic/claude-haiku-4-5-20251001"),
      system: SYSTEM_PROMPT + dateContext,
      messages: modelMessages,
      tools: agentTools,
      stopWhen: stepCountIs(10),
      temperature: 0.3,
      onError: ({ error }) => {
        console.error("[chat/route] streamText error:", error);
      },
      onStepFinish: ({ toolCalls, toolResults, finishReason }) => {
        if (toolCalls?.length) {
          console.log("[chat] tool calls:", toolCalls.map((t) => t.toolName));
        }
        if (toolResults?.length) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          console.log("[chat] tool results:", JSON.stringify(toolResults.map((r: any) => ({ tool: r.toolName, result: r.result ?? r.output }))));

          // Récupère la demande_id dès qu'elle est créée par calculer_et_enregistrer_devis
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          for (const r of toolResults as any[]) {
            const output = r.result ?? r.output;
            if (output?.demande_id && !capturedDemandeId) {
              capturedDemandeId = output.demande_id;
            }
          }
        }
        if (finishReason !== "tool-calls") {
          console.log("[chat] step finish reason:", finishReason);
        }
      },
      onFinish: ({ totalUsage, finishReason }) => {
        const duree_ms = Date.now() - startedAt;

        // totalUsage = cumul de TOUS les LLM calls du stream (tool calls inclus)
        const inputTokens = totalUsage.inputTokens ?? 0;
        const outputTokens = totalUsage.outputTokens ?? 0;
        const cacheReadTokens = totalUsage.inputTokenDetails?.cacheReadTokens ?? 0;
        const cacheWriteTokens = totalUsage.inputTokenDetails?.cacheWriteTokens ?? 0;

        // Tarifs Haiku 4.5 (source: Anthropic pricing, converti USD→EUR à 0.93)
        // $0.08/M input, $0.4/M output, $0.08/M cache read, $0.32/M cache write
        const cout_eur =
          ((inputTokens * 0.08 +
            outputTokens * 0.4 +
            cacheReadTokens * 0.008 +
            cacheWriteTokens * 0.032) /
            1_000_000) *
          0.93;

        console.log(
          `[chat] finish — in:${inputTokens} out:${outputTokens} cache_read:${cacheReadTokens} cache_write:${cacheWriteTokens} — ${cout_eur.toFixed(5)}€ — ${duree_ms}ms — ${finishReason}`
        );

        createAdminClient()
          .from("logs")
          .insert({
            demande_id: capturedDemandeId ?? null,
            action: "conversation_ia",
            source: "agent",
            tokens_input: inputTokens || null,
            tokens_output: outputTokens || null,
            tokens_cache_read: cacheReadTokens || null,
            tokens_cache_write: cacheWriteTokens || null,
            cout_eur: parseFloat(cout_eur.toFixed(6)) || null,
            duree_ms: duree_ms || null,
            metadata: {
              finish_reason: finishReason,
              model: "anthropic/claude-haiku-4-5-20251001",
            },
          })
          .then(({ error }: { error: { message: string } | null }) => {
            if (error) console.error("[chat] log usage error:", error.message);
          });
      },
    });

    return result.toUIMessageStreamResponse();
  } catch (err) {
    console.error("[chat/route] POST error:", err);
    return new Response("Erreur serveur", { status: 500 });
  }
}
