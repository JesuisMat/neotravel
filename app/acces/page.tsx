"use client";

import React, { useState } from "react";
import { createBrowserClient } from "@/lib/supabase/client";

export default function AccesPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const supabase = createBrowserClient();
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (authError || !data.user) {
        setError("Identifiants incorrects. Vérifiez votre email et mot de passe.");
        return;
      }

      window.location.assign("/dashboard");
    } catch (err) {
      console.error("login error", err);
      setError("Une erreur est survenue. Réessayez.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      style={{
        minHeight: "100dvh",
        background: "linear-gradient(160deg, var(--petrol-950) 0%, var(--petrol-800) 55%, var(--horizon-700) 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px 20px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Ambient glow */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          left: "50%",
          top: "30%",
          width: 560,
          height: 320,
          transform: "translate(-50%, -50%)",
          background: "radial-gradient(ellipse at center, rgba(93,155,176,0.18) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      {/* Card */}
      <div
        style={{
          width: "100%",
          maxWidth: 400,
          background: "rgba(251,252,253,0.96)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderRadius: 20,
          border: "1px solid rgba(195,219,227,0.25)",
          boxShadow: "0 24px 64px rgba(10,32,41,0.32), 0 2px 8px rgba(10,32,41,0.12)",
          padding: "40px 36px 36px",
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* Logo mark */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: 32 }}>
          <div style={{ marginBottom: 40 }}>
          <a href="/">
            <img
              src="/neotravel-logo.svg"
              alt="NeoTravel"
              width={130}
              height={30}
              style={{ height: "auto", width: "auto", maxHeight: 30 }}
          />
          </a>
    </div>
          <div
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 22,
              fontWeight: 500,
              color: "var(--petrol-900)",
              letterSpacing: "-0.02em",
              lineHeight: 1.2,
            }}
          >
            Accès équipe
          </div>
          <div
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: 13.5,
              color: "var(--text-muted)",
              marginTop: 6,
            }}
          >
            Espace réservé aux collaborateurs NeoTravel
          </div>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Email */}
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <label
              htmlFor="email"
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: 13,
                fontWeight: 600,
                color: "var(--text-strong)",
                letterSpacing: "0.01em",
              }}
            >
              Adresse email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              placeholder="prenom.nom@neotravel.fr"
              disabled={loading}
              style={{
                padding: "11px 14px",
                borderRadius: 10,
                border: "1.5px solid var(--border-medium)",
                background: "#fff",
                fontSize: 14.5,
                fontFamily: "var(--font-sans)",
                color: "var(--text-strong)",
                outline: "none",
                transition: "border-color 0.15s ease",
              }}
              onFocus={(e) => (e.target.style.borderColor = "var(--horizon-500)")}
              onBlur={(e) => (e.target.style.borderColor = "var(--border-medium)")}
            />
          </div>

          {/* Password */}
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <label
              htmlFor="password"
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: 13,
                fontWeight: 600,
                color: "var(--text-strong)",
                letterSpacing: "0.01em",
              }}
            >
              Mot de passe
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              placeholder="••••••••••"
              disabled={loading}
              style={{
                padding: "11px 14px",
                borderRadius: 10,
                border: "1.5px solid var(--border-medium)",
                background: "#fff",
                fontSize: 14.5,
                fontFamily: "var(--font-sans)",
                color: "var(--text-strong)",
                outline: "none",
                transition: "border-color 0.15s ease",
              }}
              onFocus={(e) => (e.target.style.borderColor = "var(--horizon-500)")}
              onBlur={(e) => (e.target.style.borderColor = "var(--border-medium)")}
            />
          </div>

          {/* Error */}
          {error && (
            <div
              style={{
                background: "var(--negative-100)",
                border: "1px solid var(--negative-600)",
                borderRadius: 8,
                padding: "10px 14px",
                fontSize: 13.5,
                color: "var(--negative-600)",
                fontFamily: "var(--font-sans)",
                lineHeight: 1.4,
              }}
            >
              {error}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading || !email.trim() || !password}
            style={{
              marginTop: 4,
              padding: "13px 20px",
              borderRadius: 10,
              border: "none",
              background:
                loading || !email.trim() || !password
                  ? "var(--stone-200)"
                  : "var(--petrol-800)",
              color:
                loading || !email.trim() || !password
                  ? "var(--stone-400)"
                  : "#fff",
              fontSize: 15,
              fontWeight: 600,
              fontFamily: "var(--font-sans)",
              cursor:
                loading || !email.trim() || !password ? "default" : "pointer",
              transition: "background 0.15s ease, color 0.15s ease",
              letterSpacing: "0.01em",
            }}
          >
            {loading ? "Connexion…" : "Se connecter"}
          </button>
        </form>

        <div
          style={{
            marginTop: 24,
            paddingTop: 20,
            borderTop: "1px solid var(--border-soft)",
            textAlign: "center",
            fontFamily: "var(--font-sans)",
            fontSize: 12.5,
            color: "var(--text-subtle)",
            lineHeight: 1.5,
          }}
        >
          Accès réservé. Contactez votre administrateur si vous n&apos;avez pas encore de compte.
        </div>
      </div>
    </div>
  );
}
