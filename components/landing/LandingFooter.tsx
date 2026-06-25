"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";

const COLS = [
  {
    h: "NeoTravel",
    items: ["Notre métier", "L'intermédiation", "Depuis 2010", "Partenaires"],
  },
  {
    h: "Transports",
    items: ["Sorties scolaires", "Séminaires", "Événements", "Tourisme groupe"],
  },
  {
    h: "Ressources",
    items: ["Questions fréquentes", "Nous contacter"],
  },
];

export function LandingFooter() {
  return (
    <footer
      style={{
        background: "var(--petrol-950)",
        color: "var(--text-on-dark)",
        padding: "clamp(48px,7vw,80px) clamp(20px,5vw,56px) 32px",
      }}
    >
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "1.6fr 1fr 1fr 1fr",
          gap: 40,
        }}
      >
        {/* Brand column */}
        <div>
          <Link href="/" style={{ display: "block", textDecoration: "none" }}>
            <Image
              src="/neotravel-logo-light.svg"
              alt="NeoTravel"
              width={130}
              height={30}
              priority
              style={{ height: "auto", width: "auto", maxHeight: 30 }}
            />
          </Link>
          <p
            style={{
              fontSize: 14.5,
              lineHeight: 1.65,
              color: "var(--text-on-dark-muted)",
              maxWidth: 270,
              margin: 0,
              fontFamily: "var(--font-sans)",
            }}
          >
            Intérmédiaire de transport. Nous mobilisons le
            bon partenaire et sécurisons votre trajet de bout en bout.
          </p>
        </div>

        {/* Nav columns */}
        {COLS.map((c) => (
          <div key={c.h}>
            <div
              style={{
                fontSize: 11,
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.12em",
                color: "var(--horizon-300)",
                marginBottom: 16,
                fontFamily: "var(--font-sans)",
              }}
            >
              {c.h}
            </div>
            <ul
              style={{
                listStyle: "none",
                padding: 0,
                margin: 0,
                display: "flex",
                flexDirection: "column",
                gap: 10,
              }}
            >
              {c.items.map((it) => (
                <li key={it}>
                  <a
                    href="#"
                    style={{
                      fontSize: 14,
                      color: "var(--text-on-dark-muted)",
                      textDecoration: "none",
                      fontFamily: "var(--font-sans)",
                      transition: "color 0.15s ease",
                    }}
                    onMouseEnter={(e) =>
                      ((e.target as HTMLAnchorElement).style.color =
                        "var(--horizon-200)")
                    }
                    onMouseLeave={(e) =>
                      ((e.target as HTMLAnchorElement).style.color =
                        "var(--text-on-dark-muted)")
                    }
                  >
                    {it}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Bottom bar */}
      <div
        style={{
          maxWidth: 1200,
          margin: "40px auto 0",
          paddingTop: 22,
          borderTop: "1px solid rgba(195,219,227,0.12)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 10,
          fontSize: 12.5,
          color: "rgba(169,194,203,0.6)",
          fontFamily: "var(--font-sans)",
        }}
      >
        <span>
          © 2010–2026 NeoTravel · Plateforme d&apos;intermédiation transport de
          groupe
        </span>
        <span style={{ display: "inline-flex", gap: 18 }}>
          <a href="#" style={{ color: "inherit", textDecoration: "none" }}>
            Mentions légales
          </a>
          <a href="#" style={{ color: "inherit", textDecoration: "none" }}>
            Confidentialité
          </a>
          <a
            href="/acces"
            style={{
              color: "rgba(169,194,203,0.35)",
              textDecoration: "none",
              fontSize: 11,
            }}
          >
            Accès équipe
          </a>
        </span>
      </div>
    </footer>
  );
}
