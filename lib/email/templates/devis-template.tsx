import * as React from "react";

interface DevisEmailProps {
  nom: string;
  prix_ttc: number;
  origine: string;
  destination: string;
  date_depart: string;
  acceptUrl: string;
  refuseUrl: string;
}

export function DevisEmailTemplate({
  nom,
  prix_ttc,
  origine,
  destination,
  date_depart,
  acceptUrl,
  refuseUrl,
}: DevisEmailProps): React.ReactElement {
  const dateFormatted = new Date(date_depart).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const montantFormatted = prix_ttc.toLocaleString("fr-FR", {
    style: "currency",
    currency: "EUR",
  });

  return (
    <html lang="fr">
      <head>
        <meta charSet="utf-8" />
      </head>
      <body
        style={{
          fontFamily: "'Helvetica Neue', Arial, sans-serif",
          backgroundColor: "#f8f7f4",
          margin: 0,
          padding: "40px 20px",
        }}
      >
        <div
          style={{
            maxWidth: 560,
            margin: "0 auto",
            backgroundColor: "#ffffff",
            borderRadius: 12,
            overflow: "hidden",
            boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
          }}
        >
          {/* Header */}
          <div
            style={{
              backgroundColor: "#1a1a2e",
              padding: "32px 40px",
            }}
          >
            <p
              style={{
                color: "#c8a97e",
                fontSize: 12,
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                margin: 0,
                marginBottom: 8,
              }}
            >
              NeoTravel
            </p>
            <h1
              style={{
                color: "#ffffff",
                fontSize: 24,
                fontWeight: 300,
                margin: 0,
              }}
            >
              Votre devis est prêt
            </h1>
          </div>

          {/* Body */}
          <div style={{ padding: "40px" }}>
            <p style={{ color: "#333", fontSize: 15, marginTop: 0 }}>
              Bonjour {nom},
            </p>
            <p style={{ color: "#555", fontSize: 15, lineHeight: 1.6 }}>
              Suite à votre demande, voici votre devis pour le trajet :
            </p>

            {/* Trajet card */}
            <div
              style={{
                backgroundColor: "#f8f7f4",
                borderRadius: 8,
                padding: "20px 24px",
                marginBottom: 24,
              }}
            >
              <p style={{ margin: "0 0 4px", color: "#888", fontSize: 12, textTransform: "uppercase", letterSpacing: "0.1em" }}>
                Trajet
              </p>
              <p style={{ margin: "0 0 12px", color: "#1a1a2e", fontSize: 17, fontWeight: 600 }}>
                {origine} → {destination}
              </p>
              <p style={{ margin: 0, color: "#555", fontSize: 14 }}>
                Départ le {dateFormatted}
              </p>
            </div>

            {/* Montant */}
            <div
              style={{
                borderTop: "1px solid #eee",
                borderBottom: "1px solid #eee",
                padding: "20px 0",
                marginBottom: 32,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "baseline",
              }}
            >
              <span style={{ color: "#555", fontSize: 14 }}>Montant total TTC</span>
              <span style={{ color: "#1a1a2e", fontSize: 28, fontWeight: 700 }}>
                {montantFormatted}
              </span>
            </div>

            <p style={{ color: "#555", fontSize: 14, lineHeight: 1.6 }}>
              Ce devis est valable 14 jours. Pour confirmer ou refuser,
              utilisez les boutons ci-dessous.
            </p>

            {/* CTA */}
            <div style={{ marginTop: 32, textAlign: "center" }}>
              <a
                href={acceptUrl}
                style={{
                  display: "inline-block",
                  backgroundColor: "#1a1a2e",
                  color: "#ffffff",
                  padding: "14px 32px",
                  borderRadius: 8,
                  textDecoration: "none",
                  fontSize: 15,
                  fontWeight: 600,
                  marginRight: 12,
                  marginBottom: 12,
                }}
              >
                J&apos;accepte ce devis
              </a>
              <a
                href={refuseUrl}
                style={{
                  display: "inline-block",
                  backgroundColor: "transparent",
                  color: "#666",
                  padding: "14px 24px",
                  borderRadius: 8,
                  textDecoration: "none",
                  fontSize: 14,
                  border: "1px solid #ddd",
                }}
              >
                Je refuse
              </a>
            </div>
          </div>

          {/* Footer */}
          <div
            style={{
              backgroundColor: "#f8f7f4",
              padding: "24px 40px",
              borderTop: "1px solid #eee",
            }}
          >
            <p style={{ color: "#999", fontSize: 12, margin: 0, lineHeight: 1.6 }}>
              NeoTravel — Affrètement d&apos;autocars et minibus
              <br />
              Une question ? Répondez directement à cet email.
            </p>
          </div>
        </div>
      </body>
    </html>
  );
}
