import { Resend } from "resend";
import { DevisEmailTemplate } from "./templates/devis-template";
import { generateDevisPDF } from "@/lib/pdf/generate-devis";
import type { LigneCalcul, CoefficientApplique } from "@/lib/devis/types";

function getResend(): Resend {
  const key = process.env.RESEND_API_KEY;
  if (!key) throw new Error("RESEND_API_KEY non configurée");
  return new Resend(key);
}

const FROM_EMAIL = process.env.EMAIL_FROM ?? "NeoTravel <devis@neotravel.fr>";
const COMMERCIAL_EMAIL =
  process.env.EMAIL_COMMERCIAL ?? "commercial@neotravel.fr";
const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

export interface SendDevisParams {
  demande_id: string;
  devis_id: string;
  decision_token: string;
  email: string;
  nom?: string;
  prix_ttc: number;
  prix_ht?: number;
  tva?: number;
  origine: string;
  destination: string;
  date_depart: string;
  heure_depart?: string;
  date_retour?: string;
  heure_retour?: string;
  nb_passagers?: number;
  lignes?: LigneCalcul[];
  coefficients?: CoefficientApplique[];
}

export async function sendDevisEmail(params: SendDevisParams): Promise<void> {
  const acceptUrl = `${APP_URL}/api/leads/${params.demande_id}/decision?token=${params.decision_token}&status=accepte`;
  const refuseUrl = `${APP_URL}/api/leads/${params.demande_id}/decision?token=${params.decision_token}&status=refuse`;
  const rappelUrl = `${APP_URL}/api/leads/${params.demande_id}/decision?token=${params.decision_token}&status=rappel`;

  // Génération PDF si les données de calcul sont disponibles
  let pdfAttachment: { filename: string; content: Buffer } | undefined;
  if (params.lignes && params.lignes.length > 0 && params.prix_ht !== undefined && params.tva !== undefined) {
    try {
      const pdfBuffer = await generateDevisPDF({
        numero_devis: `NTV-${params.devis_id.slice(0, 8).toUpperCase()}`,
        nom: params.nom ?? "Madame, Monsieur",
        email: params.email,
        origine: params.origine,
        destination: params.destination,
        date_depart: params.date_depart,
        heure_depart: params.heure_depart,
        date_retour: params.date_retour,
        heure_retour: params.heure_retour,
        nb_passagers: params.nb_passagers ?? 0,
        lignes: params.lignes,
        coefficients: params.coefficients ?? [],
        prix_ht: params.prix_ht,
        tva: params.tva,
        prix_ttc: params.prix_ttc,
        date_emission: new Date().toLocaleDateString("fr-FR"),
      });
      pdfAttachment = {
        filename: `devis-neotravel-${params.devis_id.slice(0, 8)}.pdf`,
        content: pdfBuffer,
      };
    } catch {
      // PDF non bloquant — l'email part sans pièce jointe si la génération échoue
    }
  }

  const { error } = await getResend().emails.send({
    from: FROM_EMAIL,
    to: params.email,
    subject: `Votre devis NeoTravel — ${params.origine} → ${params.destination}`,
    react: DevisEmailTemplate({
      nom: params.nom ?? "Madame, Monsieur",
      prix_ttc: params.prix_ttc,
      origine: params.origine,
      destination: params.destination,
      date_depart: params.date_depart,
      acceptUrl,
      refuseUrl,
      rappelUrl,
    }),
    ...(pdfAttachment
      ? {
          attachments: [
            {
              filename: pdfAttachment.filename,
              content: pdfAttachment.content,
            },
          ],
        }
      : {}),
  });

  if (error) {
    throw new Error(`Resend error: ${JSON.stringify(error)}`);
  }
}

export interface NotifyCommercialParams {
  demande_id?: string;
  raison_escalade: string;
  resume_conversation: string;
  contact: {
    nom?: string;
    email?: string;
    telephone?: string;
  };
  trajet: {
    origine?: string;
    destination?: string;
    nb_passagers?: number;
  };
  prix_ttc_estime?: number;
}

export async function notifyCommercial(
  params: NotifyCommercialParams
): Promise<void> {
  const { error } = await getResend().emails.send({
    from: FROM_EMAIL,
    to: COMMERCIAL_EMAIL,
    subject: `[NeoTravel] Cas complexe — escalade HITL${params.demande_id ? ` #${params.demande_id.slice(0, 8)}` : ""}`,
    html: `
      <h2>Escalade HITL — NeoTravel</h2>
      <p><strong>Raison :</strong> ${params.raison_escalade}</p>
      <hr/>
      <h3>Contact prospect</h3>
      <ul>
        <li>Nom : ${params.contact.nom ?? "Non renseigné"}</li>
        <li>Email : ${params.contact.email ?? "Non renseigné"}</li>
        <li>Téléphone : ${params.contact.telephone ?? "Non renseigné"}</li>
      </ul>
      <h3>Trajet</h3>
      <ul>
        <li>Départ : ${params.trajet.origine ?? "Non renseigné"}</li>
        <li>Destination : ${params.trajet.destination ?? "Non renseigné"}</li>
        <li>Passagers : ${params.trajet.nb_passagers ?? "Non renseigné"}</li>
        ${params.prix_ttc_estime ? `<li>Montant estimé : ${params.prix_ttc_estime.toLocaleString("fr-FR")} EUR TTC</li>` : ""}
      </ul>
      <h3>Contexte conversationnel</h3>
      <pre style="background:#f5f5f5;padding:12px;border-radius:4px;">${params.resume_conversation}</pre>
      ${params.demande_id ? `<p><a href="${APP_URL}/dashboard/leads/${params.demande_id}">Voir le dossier dans le dashboard →</a></p>` : ""}
    `,
  });

  if (error) {
    throw new Error(`Resend commercial notify error: ${JSON.stringify(error)}`);
  }
}

export interface SendRelanceParams {
  email: string;
  nom?: string;
  numero_relance: 1 | 2;
  devis_id: string;
  demande_id: string;
  decision_token: string;
  prix_ttc: number;
  origine: string;
  destination: string;
  date_devis: string;
}

export async function sendRelanceEmail(
  params: SendRelanceParams
): Promise<void> {
  const acceptUrl = `${APP_URL}/api/leads/${params.demande_id}/decision?token=${params.decision_token}&status=accepte`;
  const refuseUrl = `${APP_URL}/api/leads/${params.demande_id}/decision?token=${params.decision_token}&status=refuse`;

  const sujet =
    params.numero_relance === 1
      ? `Rappel — Votre devis NeoTravel est disponible`
      : `Dernière relance — Devis NeoTravel ${params.origine} → ${params.destination}`;

  const intro =
    params.numero_relance === 1
      ? `Suite à notre devis du ${params.date_devis}, nous souhaitons savoir si vous avez eu l'occasion de l'examiner.`
      : `Nous revenons vers vous une dernière fois concernant notre devis du ${params.date_devis}.`;

  const { error } = await getResend().emails.send({
    from: FROM_EMAIL,
    to: params.email,
    subject: sujet,
    html: `
      <p>Bonjour ${params.nom ?? ""},</p>
      <p>${intro}</p>
      <p><strong>Trajet :</strong> ${params.origine} → ${params.destination}<br/>
      <strong>Montant :</strong> ${params.prix_ttc.toLocaleString("fr-FR")} EUR TTC</p>
      <p>
        <a href="${acceptUrl}" style="background:#1a1a2e;color:white;padding:12px 24px;border-radius:6px;text-decoration:none;margin-right:12px;">J'accepte ce devis</a>
        <a href="${refuseUrl}" style="color:#666;padding:12px 24px;border-radius:6px;text-decoration:none;">Je refuse</a>
      </p>
      <p>Notre équipe reste disponible pour toute question ou ajustement.</p>
      <p>Cordialement,<br/>L'équipe NeoTravel</p>
    `,
  });

  if (error) {
    throw new Error(`Resend relance error: ${JSON.stringify(error)}`);
  }
}
