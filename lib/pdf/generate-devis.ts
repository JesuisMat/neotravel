"use server";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  renderToBuffer,
} from "@react-pdf/renderer";
import React from "react";
import type { LigneCalcul, CoefficientApplique } from "@/lib/devis/types";

// ============================================================
// Types
// ============================================================
export interface DevisPDFParams {
  numero_devis: string;
  nom: string;
  email: string;
  origine: string;
  destination: string;
  date_depart: string;
  date_retour?: string;
  nb_passagers: number;
  lignes: LigneCalcul[];
  coefficients: CoefficientApplique[];
  prix_ht: number;
  tva: number;
  prix_ttc: number;
  marge?: number;
  date_emission?: string;
}

// ============================================================
// Styles
// ============================================================
const DARK = "#1a1a2e";
const GOLD = "#c8a97e";
const GREY_LIGHT = "#f8f7f4";
const GREY_TEXT = "#555555";

const styles = StyleSheet.create({
  page: {
    fontFamily: "Helvetica",
    backgroundColor: "#ffffff",
    padding: 48,
    fontSize: 10,
    color: DARK,
  },
  // Header
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 32,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: GOLD,
  },
  brand: {
    fontSize: 18,
    fontFamily: "Helvetica-Bold",
    color: DARK,
    letterSpacing: 2,
  },
  brandTagline: {
    fontSize: 8,
    color: GOLD,
    letterSpacing: 1,
    marginTop: 2,
  },
  headerRight: {
    alignItems: "flex-end",
  },
  devisLabel: {
    fontSize: 9,
    color: GREY_TEXT,
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  devisNumero: {
    fontSize: 14,
    fontFamily: "Helvetica-Bold",
    color: DARK,
    marginTop: 2,
  },
  devisDate: {
    fontSize: 9,
    color: GREY_TEXT,
    marginTop: 4,
  },
  // Blocs info
  infoRow: {
    flexDirection: "row",
    gap: 16,
    marginBottom: 24,
  },
  infoBox: {
    flex: 1,
    backgroundColor: GREY_LIGHT,
    borderRadius: 4,
    padding: 12,
  },
  infoBoxTitle: {
    fontSize: 8,
    color: GOLD,
    letterSpacing: 1,
    textTransform: "uppercase",
    marginBottom: 6,
    fontFamily: "Helvetica-Bold",
  },
  infoLine: {
    fontSize: 9,
    color: DARK,
    marginBottom: 3,
  },
  infoLineGrey: {
    fontSize: 9,
    color: GREY_TEXT,
    marginBottom: 3,
  },
  // Tableau lignes
  tableHeader: {
    flexDirection: "row",
    backgroundColor: DARK,
    borderRadius: 2,
    padding: "6 10",
    marginBottom: 2,
  },
  tableHeaderText: {
    color: "#ffffff",
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
  tableRow: {
    flexDirection: "row",
    padding: "6 10",
    borderBottomWidth: 1,
    borderBottomColor: "#eeeeee",
  },
  tableRowAlt: {
    flexDirection: "row",
    padding: "6 10",
    backgroundColor: GREY_LIGHT,
    borderBottomWidth: 1,
    borderBottomColor: "#eeeeee",
  },
  colLibelle: {
    flex: 1,
    fontSize: 9,
    color: DARK,
  },
  colMontant: {
    width: 90,
    fontSize: 9,
    color: DARK,
    textAlign: "right",
  },
  colMontantHeader: {
    width: 90,
    textAlign: "right",
  },
  // Totaux
  totalsSection: {
    marginTop: 12,
    alignItems: "flex-end",
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    paddingVertical: 3,
    width: 220,
  },
  totalLabel: {
    flex: 1,
    fontSize: 9,
    color: GREY_TEXT,
    textAlign: "right",
    paddingRight: 16,
  },
  totalValue: {
    width: 80,
    fontSize: 9,
    color: DARK,
    textAlign: "right",
  },
  totalTTCRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    backgroundColor: DARK,
    borderRadius: 4,
    padding: "8 12",
    width: 220,
    marginTop: 4,
  },
  totalTTCLabel: {
    flex: 1,
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
    color: "#ffffff",
    textAlign: "right",
    paddingRight: 16,
  },
  totalTTCValue: {
    width: 80,
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
    color: GOLD,
    textAlign: "right",
  },
  // Coefficients
  coeffSection: {
    marginTop: 20,
    padding: 10,
    backgroundColor: GREY_LIGHT,
    borderRadius: 4,
    borderLeftWidth: 2,
    borderLeftColor: GOLD,
  },
  coeffTitle: {
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    color: GOLD,
    letterSpacing: 1,
    textTransform: "uppercase",
    marginBottom: 6,
  },
  coeffRow: {
    flexDirection: "row",
    marginBottom: 2,
  },
  coeffLabel: {
    flex: 1,
    fontSize: 8,
    color: GREY_TEXT,
  },
  coeffValue: {
    fontSize: 8,
    color: DARK,
    fontFamily: "Helvetica-Bold",
  },
  // Footer
  footer: {
    position: "absolute",
    bottom: 32,
    left: 48,
    right: 48,
    borderTopWidth: 1,
    borderTopColor: "#eeeeee",
    paddingTop: 10,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  footerText: {
    fontSize: 7,
    color: "#aaaaaa",
  },
  // Validité
  validityNote: {
    marginTop: 16,
    fontSize: 8,
    color: GREY_TEXT,
    fontStyle: "italic",
  },
});

// ============================================================
// Helpers
// ============================================================
function formatEur(amount: number): string {
  const fixed = amount.toFixed(2).replace(".", ",");
  const parts = fixed.split(",");
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, "\u00a0");
  return `${parts[0]},${parts[1]} \u20ac`;
}

function formatCoeffLabel(type: string, code: string): string {
  const labels: Record<string, string> = {
    saisonnalite: "Saisonnalité",
    urgence: "Urgence (délai demande/départ)",
    capacite: "Capacité véhicule",
  };
  return `${labels[type] ?? type} — ${code}`;
}

function formatCoeffValue(valeur: number): string {
  const pct = Math.round((valeur - 1) * 100);
  return pct >= 0 ? `+${pct}%` : `${pct}%`;
}

// ============================================================
// Template React PDF
// ============================================================
function DevisPDFDocument({
  numero_devis,
  nom,
  email,
  origine,
  destination,
  date_depart,
  date_retour,
  nb_passagers,
  lignes,
  coefficients,
  prix_ht,
  tva,
  prix_ttc,
  date_emission,
}: DevisPDFParams) {
  const emission = date_emission ?? new Date().toLocaleDateString("fr-FR");

  return React.createElement(
    Document,
    { title: `Devis NeoTravel — ${numero_devis}` },
    React.createElement(
      Page,
      { size: "A4", style: styles.page },
      // Header
      React.createElement(
        View,
        { style: styles.header },
        React.createElement(
          View,
          null,
          React.createElement(Text, { style: styles.brand }, "NEOTRAVEL"),
          React.createElement(
            Text,
            { style: styles.brandTagline },
            "TRANSPORT DE PERSONNES EN GROUPE"
          )
        ),
        React.createElement(
          View,
          { style: styles.headerRight },
          React.createElement(Text, { style: styles.devisLabel }, "DEVIS"),
          React.createElement(
            Text,
            { style: styles.devisNumero },
            numero_devis
          ),
          React.createElement(
            Text,
            { style: styles.devisDate },
            `Émis le ${emission}`
          )
        )
      ),
      // Blocs info
      React.createElement(
        View,
        { style: styles.infoRow },
        React.createElement(
          View,
          { style: styles.infoBox },
          React.createElement(Text, { style: styles.infoBoxTitle }, "Client"),
          React.createElement(Text, { style: styles.infoLine }, nom),
          React.createElement(Text, { style: styles.infoLineGrey }, email)
        ),
        React.createElement(
          View,
          { style: styles.infoBox },
          React.createElement(
            Text,
            { style: styles.infoBoxTitle },
            "Trajet"
          ),
          React.createElement(
            Text,
            { style: styles.infoLine },
            `${origine} → ${destination}`
          ),
          React.createElement(
            Text,
            { style: styles.infoLineGrey },
            `Départ : ${date_depart}${date_retour ? ` — Retour : ${date_retour}` : ""}`
          ),
          React.createElement(
            Text,
            { style: styles.infoLineGrey },
            `${nb_passagers} passager${nb_passagers > 1 ? "s" : ""}`
          )
        )
      ),
      // Tableau des lignes
      React.createElement(
        View,
        { style: styles.tableHeader },
        React.createElement(
          Text,
          { style: { ...styles.tableHeaderText, flex: 1 } },
          "Désignation"
        ),
        React.createElement(
          Text,
          { style: { ...styles.tableHeaderText, ...styles.colMontantHeader } },
          "Montant HT"
        )
      ),
      ...lignes.map((ligne, i) =>
        React.createElement(
          View,
          { key: i, style: i % 2 === 0 ? styles.tableRow : styles.tableRowAlt },
          React.createElement(Text, { style: styles.colLibelle }, ligne.libelle),
          React.createElement(
            Text,
            { style: styles.colMontant },
            formatEur(ligne.montant)
          )
        )
      ),
      // Totaux
      React.createElement(
        View,
        { style: styles.totalsSection },
        React.createElement(
          View,
          { style: styles.totalRow },
          React.createElement(Text, { style: styles.totalLabel }, "Sous-total HT"),
          React.createElement(
            Text,
            { style: styles.totalValue },
            formatEur(prix_ht)
          )
        ),
        React.createElement(
          View,
          { style: styles.totalRow },
          React.createElement(Text, { style: styles.totalLabel }, "TVA (10%)"),
          React.createElement(
            Text,
            { style: styles.totalValue },
            formatEur(tva)
          )
        ),
        React.createElement(
          View,
          { style: styles.totalTTCRow },
          React.createElement(
            Text,
            { style: styles.totalTTCLabel },
            "TOTAL TTC"
          ),
          React.createElement(
            Text,
            { style: styles.totalTTCValue },
            formatEur(prix_ttc)
          )
        )
      ),
      // Coefficients appliqués
      coefficients.length > 0
        ? React.createElement(
            View,
            { style: styles.coeffSection },
            React.createElement(
              Text,
              { style: styles.coeffTitle },
              "Coefficients appliqués"
            ),
            ...coefficients.map((c, i) =>
              React.createElement(
                View,
                { key: i, style: styles.coeffRow },
                React.createElement(
                  Text,
                  { style: styles.coeffLabel },
                  formatCoeffLabel(c.type, c.code)
                ),
                React.createElement(
                  Text,
                  { style: styles.coeffValue },
                  formatCoeffValue(c.valeur)
                )
              )
            )
          )
        : null,
      // Note validité
      React.createElement(
        Text,
        { style: styles.validityNote },
        "Ce devis est valable 30 jours à compter de sa date d'émission. TVA 10% incluse."
      ),
      // Footer
      React.createElement(
        View,
        { style: styles.footer },
        React.createElement(
          Text,
          { style: styles.footerText },
          "NeoTravel — Transport de personnes en groupe"
        ),
        React.createElement(
          Text,
          { style: styles.footerText },
          `Devis ${numero_devis} — ${emission}`
        )
      )
    )
  );
}

// ============================================================
// Export : génère le Buffer PDF (usage server-side uniquement)
// ============================================================
export async function generateDevisPDF(params: DevisPDFParams): Promise<Buffer> {
  // Filtrer la marge commerciale — donnée réservée à l'usage interne
  // La TVA reste visible car elle figure sur le total (ligne réglementaire)
  const lignesClient = params.lignes.filter(
    (l) =>
      !l.libelle.toLowerCase().startsWith("marge") &&
      !l.libelle.toLowerCase().startsWith("ajustements coefficients") &&
      !l.libelle.toLowerCase().startsWith("tva")
  );
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const doc = React.createElement(DevisPDFDocument, {
    ...params,
    lignes: lignesClient,
    coefficients: [], // coefficients réservés à l'usage interne
  }) as any;
  const buffer = await renderToBuffer(doc);
  return Buffer.from(buffer);
}
