import { NextRequest, NextResponse } from "next/server";
import { calculer_devis } from "@/lib/devis/calculer-devis";
import { calculerDevisSchema } from "@/lib/devis/schema";

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { error: "Corps de requête JSON invalide." },
      { status: 400 }
    );
  }

  const parsed = calculerDevisSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "Paramètres invalides.",
        details: parsed.error.flatten(),
      },
      { status: 422 }
    );
  }

  try {
    const resultat = calculer_devis(parsed.data);
    return NextResponse.json({ ok: true, devis: resultat });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Erreur de calcul inconnue.";
    const isComplex = message.includes("HITL");
    return NextResponse.json(
      { ok: false, error: message, hitl: isComplex },
      { status: isComplex ? 422 : 400 }
    );
  }
}
