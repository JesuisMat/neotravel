/**
 * triggerN8nWorkflow
 *
 * Déclenche le webhook n8n au moment de l'envoi du devis.
 * Non bloquant — une erreur réseau ne fait pas échouer l'envoi du devis.
 *
 * Payload reçu par n8n :
 *   - demande_id, devis_id      → pour les appels de vérification intermédiaires
 *   - email, prenom, nom        → personnalisation emails
 *   - origine, destination, prix_ttc, date_depart
 *   - origine_demande           → "standard" uniquement (les HITL sont exclus)
 *   - accept_url, refuse_url    → liens signés pour boutons dans email n8n
 */
export async function triggerN8nWorkflow(payload: {
  demande_id: string;
  devis_id: string;
  email: string;
  nom?: string | null;
  origine?: string | null;
  destination?: string | null;
  date_depart?: string | null;
  prix_ttc: number;
  decision_token: string;
  origine_demande: string;
}): Promise<void> {
  const webhookUrl = process.env.N8N_WEBHOOK_URL;
  if (!webhookUrl) return; // Pas de webhook configuré → silencieux

  // Ne jamais envoyer les leads HITL dans le workflow automatique
  if (
    payload.origine_demande === "complexe_hitl" ||
    payload.origine_demande === "rappel_demande"
  ) {
    return;
  }

  const appUrl = (process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000").replace(/\/$/, "");
  const prenom = payload.nom ? payload.nom.split(" ")[0] : "";

  const body = {
    demande_id: payload.demande_id,
    devis_id: payload.devis_id,
    email: payload.email,
    prenom,
    nom: payload.nom ?? "",
    origine: payload.origine ?? "",
    destination: payload.destination ?? "",
    date_depart: payload.date_depart ?? "",
    prix_ttc: payload.prix_ttc,
    origine_demande: payload.origine_demande,
    accept_url: `${appUrl}/api/leads/${payload.demande_id}/decision?token=${payload.decision_token}&status=accepte`,
    refuse_url: `${appUrl}/api/leads/${payload.demande_id}/decision?token=${payload.decision_token}&status=refuse`,
    rappel_url: `${appUrl}/api/leads/${payload.demande_id}/decision?token=${payload.decision_token}&status=rappel`,
    status_url: `${appUrl}/api/internal/leads/${payload.demande_id}/status`,
  };

  try {
    const res = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      console.error(`[n8n] webhook HTTP ${res.status}:`, await res.text().catch(() => ""));
    } else {
      console.log(`[n8n] webhook déclenché → ${payload.email} (demande ${payload.demande_id})`);
    }
  } catch (err) {
    console.error("[n8n] webhook fetch failed:", err);
  }
}
