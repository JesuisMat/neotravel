import React from "react";
import Link from "next/link";
import Image from "next/image";

export function LandingHeader() {
  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "14px clamp(20px, 5vw, 56px)",
        background: "rgba(10,32,41,0.7)",
        backdropFilter: "blur(16px) saturate(1.4)",
        WebkitBackdropFilter: "blur(16px) saturate(1.4)",
        borderBottom: "1px solid rgba(195,219,227,0.12)",
      }}
    >
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

      <nav style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <a
          href="#hero-chat"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            fontSize: 14,
            fontWeight: 600,
            color: "var(--petrol-950)",
            textDecoration: "none",
            padding: "9px 20px",
            borderRadius: 99,
            background: "linear-gradient(135deg, var(--dawn-400), var(--dawn-500))",
            fontFamily: "var(--font-sans)",
            letterSpacing: "0.01em",
            boxShadow: "0 2px 8px rgba(240,160,98,0.3)",
          }}
        >
          Demander un devis
        </a>
      </nav>
    </header>
  );
}
