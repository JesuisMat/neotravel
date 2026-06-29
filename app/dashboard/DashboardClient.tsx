"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import type { StatutDemande } from "@/lib/supabase/types";
import Image from "next/image";

interface Lead {
  id: string;
  nom: string | null;
  email: string | null;
  telephone: string | null;
  type_client: string | null;
  nom_entreprise: string | null;
  origine: string | null;
  destination: string | null;
  date_depart: string | null;
  heure_depart: string | null;
  date_retour: string | null;
  heure_retour: string | null;
  statut: StatutDemande;
  urgence: string;
  nb_passagers: number | null;
  notes: string | null;
  created_at: string;
  devis: Array<{
    id: string;
    montant_ttc: number;
    email_envoye_at: string | null;
    prochaine_relance: string | null;
    nb_relances: number;
    decision: string | null;
  }>;
}

interface Kpis {
  totalLeads: number;
  devisEnvoyes: number;
  confirmes: number;
  enRelance: number;
  casComplexes: number;
  montantPipeline: number;
}

interface Props {
  leads: Lead[];
  kpis: Kpis;
}

// ─────────────────────────────────────────────
// Configs statiques
// ─────────────────────────────────────────────

const STATUT_CONFIG: Record<string, { label: string; bg: string; color: string; dot: string }> = {
  nouveau:           { label: "Nouveau",      bg: "var(--horizon-50)",    color: "var(--horizon-600)",  dot: "var(--horizon-400)"  },
  en_qualification:  { label: "En cours",     bg: "var(--horizon-50)",    color: "var(--horizon-600)",  dot: "var(--horizon-400)"  },
  complet:           { label: "Complet",      bg: "var(--positive-100)",  color: "var(--positive-600)", dot: "var(--positive-500)" },
  complexe:          { label: "Complexe",     bg: "var(--caution-100)",   color: "var(--caution-600)",  dot: "var(--caution-500)"  },
  devis_envoye:      { label: "Devis envoyé", bg: "var(--horizon-100)",   color: "var(--brand)",        dot: "var(--brand)"        },
  relance_1:         { label: "Relance 1",    bg: "var(--caution-100)",   color: "var(--caution-600)",  dot: "var(--caution-500)"  },
  relance_2:         { label: "Relance 2",    bg: "var(--urgent-100)",    color: "var(--urgent-600)",   dot: "var(--urgent-500)"   },
  accepte_prospect:  { label: "Accepté",      bg: "var(--positive-100)",  color: "var(--positive-600)", dot: "var(--positive-500)" },
  confirme:          { label: "Confirmé",     bg: "var(--positive-100)",  color: "var(--positive-600)", dot: "var(--positive-500)" },
  refuse:            { label: "Refusé",       bg: "var(--negative-100)",  color: "var(--negative-600)", dot: "var(--negative-600)" },
  cloture:           { label: "Clôturé",      bg: "var(--sand-100)",      color: "var(--stone-400)",    dot: "var(--stone-300)"    },
};

const URGENCE_LABEL: Record<string, string> = {
  tres_urgent: "Prioritaire",
  urgent: "Urgent",
  standard: "Standard",
};

const URGENCE_COLOR: Record<string, string> = {
  tres_urgent: "var(--urgent-600)",
  urgent: "var(--caution-600)",
  standard: "var(--text-subtle)",
};

const ROLE_CONFIG: Record<string, { label: string; bg: string; color: string }> = {
  admin:      { label: "Admin",      bg: "var(--petrol-800)",   color: "#fff"                    },
  direction:  { label: "Direction",  bg: "var(--horizon-100)",  color: "var(--horizon-700)"      },
  commercial: { label: "Commercial", bg: "var(--positive-100)", color: "var(--positive-700)"     },
};

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────

function formatMontant(n: number) {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(n);
}

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const min = Math.floor(diff / 60000);
  if (min < 60) return `il y a ${min} min`;
  const h = Math.floor(min / 60);
  if (h < 24) return `il y a ${h}h`;
  return `il y a ${Math.floor(h / 24)}j`;
}

function initials(nom: string) {
  return nom.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2);
}

// ─────────────────────────────────────────────
// Sous-composants
// ─────────────────────────────────────────────

function StatusBadge({ statut }: { statut: string }) {
  const cfg = STATUT_CONFIG[statut] ?? { label: statut, bg: "var(--sand-100)", color: "var(--stone-400)", dot: "var(--stone-300)" };
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "3px 9px 3px 7px", borderRadius: 99, fontSize: 12, fontWeight: 600, fontFamily: "var(--font-sans)", background: cfg.bg, color: cfg.color, whiteSpace: "nowrap", letterSpacing: "0.01em" }}>
      <span style={{ width: 5, height: 5, borderRadius: "50%", background: cfg.dot, flexShrink: 0 }} />
      {cfg.label}
    </span>
  );
}

function RoleBadge({ role }: { role: string }) {
  const cfg = ROLE_CONFIG[role] ?? { label: role, bg: "var(--sand-100)", color: "var(--stone-500)" };
  return (
    <span style={{ display: "inline-block", padding: "3px 9px", borderRadius: 99, fontSize: 11.5, fontWeight: 600, background: cfg.bg, color: cfg.color, fontFamily: "var(--font-sans)", letterSpacing: "0.01em", whiteSpace: "nowrap" }}>
      {cfg.label}
    </span>
  );
}

function StatCard({ label, value, caption, variant = "default" }: { label: string; value: string; caption?: string; variant?: "default" | "accent" | "warning" }) {
  const s = {
    default: { bg: "var(--surface-card)", border: "1px solid var(--border-soft)", labelColor: "var(--text-subtle)", valueColor: "var(--text-strong)", captionColor: "var(--text-muted)" },
    accent:  { bg: "var(--petrol-800)", border: "none", labelColor: "rgba(195,219,227,0.6)", valueColor: "#fff", captionColor: "rgba(195,219,227,0.5)" },
    warning: { bg: "var(--caution-100)", border: "1px solid rgba(200,134,47,0.2)", labelColor: "var(--caution-600)", valueColor: "var(--petrol-900)", captionColor: "var(--caution-600)" },
  }[variant];

  return (
    <div style={{ background: s.bg, border: s.border, borderRadius: 12, padding: "18px 20px" }}>
      <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: s.labelColor, fontFamily: "var(--font-sans)", marginBottom: 8 }}>{label}</div>
      <div style={{ fontSize: 30, fontWeight: 400, fontFamily: "var(--font-display)", color: s.valueColor, lineHeight: 1, letterSpacing: "-0.02em", marginBottom: caption ? 5 : 0 }}>{value}</div>
      {caption && <div style={{ fontSize: 12, color: s.captionColor, fontFamily: "var(--font-sans)" }}>{caption}</div>}
    </div>
  );
}

function ConfirmButton({ demandeId }: { demandeId: string }) {
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  async function handleConfirm() {
    setLoading(true);
    try {
      await fetch(`/api/dashboard/leads/${demandeId}/confirm`, { method: "POST" });
      setDone(true);
    } finally {
      setLoading(false);
    }
  }

  if (done) return <span style={{ fontSize: 12, color: "var(--positive-600)", fontFamily: "var(--font-sans)", fontWeight: 600 }}>Confirmé</span>;
  return (
    <button onClick={handleConfirm} disabled={loading} style={{ padding: "6px 14px", borderRadius: 7, border: "none", background: "var(--petrol-800)", color: "#fff", fontSize: 12.5, fontWeight: 600, cursor: loading ? "wait" : "pointer", fontFamily: "var(--font-sans)" }}>
      {loading ? "…" : "Confirmer"}
    </button>
  );
}

const TYPE_CLIENT_LABEL: Record<string, string> = {
  particulier: "Particulier",
  entreprise: "Entreprise",
  association: "Association",
  scolaire: "Scolaire",
};

function ChampsManquantsBadge({ manquants }: { manquants: string[] }) {
  if (manquants.length === 0) return null;
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginTop: 8 }}>
      {manquants.map((c) => (
        <span key={c} style={{ fontSize: 11, fontWeight: 600, fontFamily: "var(--font-sans)", padding: "2px 8px", borderRadius: 99, background: "var(--negative-100)", color: "var(--negative-600)", border: "1px solid rgba(200,50,50,0.15)" }}>
          {c} manquant
        </span>
      ))}
    </div>
  );
}

function ComplexeCard({ lead, onDone }: { lead: Lead; onDone: () => void }) {
  const CHAMPS_REQUIS: Array<{ key: keyof Lead; label: string }> = [
    { key: "email",       label: "Email"       },
    { key: "origine",     label: "Origine"     },
    { key: "destination", label: "Destination" },
    { key: "date_depart", label: "Date départ" },
    { key: "heure_depart",label: "Heure départ"},
    { key: "nb_passagers",label: "Passagers"   },
  ];

  const manquants = CHAMPS_REQUIS.filter((c) => !lead[c.key]).map((c) => c.label);
  const peutEnvoyer = manquants.length === 0;

  const [showForm, setShowForm] = useState(!peutEnvoyer);
  const [sending, setSending] = useState(false);
  const [closing, setClosing] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [form, setForm] = useState({
    nom:         lead.nom ?? "",
    email:       lead.email ?? "",
    telephone:   lead.telephone ?? "",
    origine:     lead.origine ?? "",
    destination: lead.destination ?? "",
    date_depart: lead.date_depart ?? "",
    heure_depart:lead.heure_depart ?? "",
    date_retour: lead.date_retour ?? "",
    heure_retour:lead.heure_retour ?? "",
    nb_passagers:lead.nb_passagers ? String(lead.nb_passagers) : "",
    urgence:     lead.urgence ?? "standard",
  });

  const inputS: React.CSSProperties = { padding: "8px 11px", borderRadius: 7, border: "1.5px solid var(--border-medium)", background: "#fff", fontSize: 13, fontFamily: "var(--font-sans)", color: "var(--text-strong)", outline: "none", width: "100%", boxSizing: "border-box" };
  const labelS: React.CSSProperties = { fontSize: 11.5, fontWeight: 600, color: "var(--text-strong)", fontFamily: "var(--font-sans)", marginBottom: 3, display: "block" };
  const missingS: React.CSSProperties = { ...inputS, borderColor: "var(--negative-500)" };

  async function handleSendDevis(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSending(true);
    try {
      const res = await fetch(`/api/dashboard/leads/${lead.id}/send-devis`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          nb_passagers: Number(form.nb_passagers),
        }),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.error ?? "Erreur lors de l'envoi");
        return;
      }
      setSuccess(`Devis envoyé — ${json.prix_ttc?.toLocaleString("fr-FR")} € TTC`);
      setTimeout(() => { setDone(true); onDone(); }, 2000);
    } catch {
      setError("Erreur réseau. Réessayez.");
    } finally {
      setSending(false);
    }
  }

  async function handleClose(statut: "refuse" | "cloture") {
    setClosing(true);
    try {
      await fetch(`/api/dashboard/leads/${lead.id}/update-statut`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ statut }),
      });
      setDone(true);
      onDone();
    } finally {
      setClosing(false);
    }
  }

  if (done) return null;

  return (
    <div style={{ background: "var(--surface-card)", border: "1px solid var(--border-soft)", borderLeft: `3px solid ${peutEnvoyer ? "var(--positive-500)" : "var(--caution-500)"}`, borderRadius: "0 12px 12px 0", padding: "20px 22px" }}>
      {/* En-tête */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 14, flexWrap: "wrap", marginBottom: 12 }}>
        <div style={{ minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 4 }}>
            <span style={{ fontSize: 15, fontWeight: 600, color: "var(--text-strong)", fontFamily: "var(--font-sans)" }}>{lead.nom ?? "Prospect sans nom"}</span>
            {lead.type_client && (
              <span style={{ fontSize: 11, fontWeight: 600, padding: "2px 8px", borderRadius: 99, background: "var(--horizon-100)", color: "var(--horizon-700)", fontFamily: "var(--font-sans)" }}>
                {TYPE_CLIENT_LABEL[lead.type_client] ?? lead.type_client}
              </span>
            )}
            {lead.nom_entreprise && (
              <span style={{ fontSize: 12, fontWeight: 500, color: "var(--text-body)", fontFamily: "var(--font-sans)" }}>· {lead.nom_entreprise}</span>
            )}
          </div>
          <div style={{ fontSize: 12.5, color: "var(--text-muted)", fontFamily: "var(--font-sans)", lineHeight: 1.5 }}>
            {lead.email && <span>{lead.email}</span>}
            {lead.telephone && <span> · {lead.telephone}</span>}
            <span style={{ marginLeft: 6, color: "var(--text-subtle)" }}>· {timeAgo(lead.created_at)}</span>
          </div>
          {/* Trajet capturé */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: 8 }}>
            {[
              { label: "Trajet",    value: lead.origine && lead.destination ? `${lead.origine} → ${lead.destination}` : null },
              { label: "Départ",   value: lead.date_depart ? `${lead.date_depart}${lead.heure_depart ? ` à ${lead.heure_depart}` : ""}` : null },
              { label: "Retour",   value: lead.date_retour ? `${lead.date_retour}${lead.heure_retour ? ` à ${lead.heure_retour}` : ""}` : null },
              { label: "Pax",      value: lead.nb_passagers ? String(lead.nb_passagers) : null },
              { label: "Urgence",  value: URGENCE_LABEL[lead.urgence] ?? lead.urgence },
            ].map(({ label, value }) => value ? (
              <div key={label} style={{ fontSize: 12, fontFamily: "var(--font-sans)" }}>
                <span style={{ color: "var(--text-subtle)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", fontSize: 10 }}>{label} </span>
                <span style={{ color: "var(--text-body)" }}>{value}</span>
              </div>
            ) : null)}
          </div>
          {lead.notes && (
            <div style={{ marginTop: 8, fontSize: 12, color: "var(--text-muted)", fontFamily: "var(--font-sans)", fontStyle: "italic", background: "var(--surface-sunken)", borderRadius: 6, padding: "6px 10px" }}>
              {lead.notes}
            </div>
          )}
          <ChampsManquantsBadge manquants={manquants} />
        </div>
        <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
          {peutEnvoyer && !showForm && (
            <button onClick={() => setShowForm(true)} style={{ padding: "7px 14px", borderRadius: 8, border: "none", background: "var(--petrol-800)", color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "var(--font-sans)" }}>
              Générer & envoyer devis
            </button>
          )}
          {!peutEnvoyer && !showForm && (
            <button onClick={() => setShowForm(true)} style={{ padding: "7px 14px", borderRadius: 8, border: "none", background: "var(--caution-500)", color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "var(--font-sans)" }}>
              Compléter & envoyer
            </button>
          )}
          <button onClick={() => handleClose("refuse")} disabled={closing} style={{ padding: "7px 12px", borderRadius: 8, border: "1px solid var(--border-medium)", background: "transparent", color: "var(--text-muted)", fontSize: 13, fontWeight: 500, cursor: closing ? "wait" : "pointer", fontFamily: "var(--font-sans)" }}>
            Refuser
          </button>
          <button onClick={() => handleClose("cloture")} disabled={closing} style={{ padding: "7px 12px", borderRadius: 8, border: "1px solid var(--border-medium)", background: "transparent", color: "var(--text-muted)", fontSize: 13, fontWeight: 500, cursor: closing ? "wait" : "pointer", fontFamily: "var(--font-sans)" }}>
            Clôturer
          </button>
        </div>
      </div>

      {/* Formulaire inline */}
      {showForm && (
        <form onSubmit={handleSendDevis} style={{ borderTop: "1px solid var(--border-soft)", marginTop: 4, paddingTop: 16, display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{ fontSize: 12.5, fontWeight: 700, color: "var(--text-strong)", fontFamily: "var(--font-sans)", textTransform: "uppercase", letterSpacing: "0.08em" }}>
            Vérifier / compléter avant envoi
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 10 }}>
            <div><label style={labelS}>Nom</label><input value={form.nom} onChange={(e) => setForm((f) => ({ ...f, nom: e.target.value }))} placeholder="Prénom Nom" style={inputS} /></div>
            <div><label style={labelS}>Email *</label><input required type="email" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} style={!form.email ? missingS : inputS} /></div>
            <div><label style={labelS}>Téléphone</label><input value={form.telephone} onChange={(e) => setForm((f) => ({ ...f, telephone: e.target.value }))} style={inputS} /></div>
            <div><label style={labelS}>Origine *</label><input required value={form.origine} onChange={(e) => setForm((f) => ({ ...f, origine: e.target.value }))} placeholder="Bordeaux" style={!form.origine ? missingS : inputS} /></div>
            <div><label style={labelS}>Destination *</label><input required value={form.destination} onChange={(e) => setForm((f) => ({ ...f, destination: e.target.value }))} placeholder="Toulouse" style={!form.destination ? missingS : inputS} /></div>
            <div><label style={labelS}>Date départ *</label><input required type="date" value={form.date_depart} onChange={(e) => setForm((f) => ({ ...f, date_depart: e.target.value }))} style={!form.date_depart ? missingS : inputS} /></div>
            <div><label style={labelS}>Heure départ *</label><input required type="time" value={form.heure_depart} onChange={(e) => setForm((f) => ({ ...f, heure_depart: e.target.value }))} style={!form.heure_depart ? missingS : inputS} /></div>
            <div><label style={labelS}>Date retour</label><input type="date" value={form.date_retour} onChange={(e) => setForm((f) => ({ ...f, date_retour: e.target.value }))} style={inputS} /></div>
            <div><label style={labelS}>Heure retour</label><input type="time" value={form.heure_retour} onChange={(e) => setForm((f) => ({ ...f, heure_retour: e.target.value }))} style={inputS} /></div>
            <div><label style={labelS}>Passagers *</label><input required type="number" min={1} max={85} value={form.nb_passagers} onChange={(e) => setForm((f) => ({ ...f, nb_passagers: e.target.value }))} style={!form.nb_passagers ? missingS : inputS} /></div>
            <div>
              <label style={labelS}>Urgence</label>
              <select value={form.urgence} onChange={(e) => setForm((f) => ({ ...f, urgence: e.target.value }))} style={{ ...inputS, cursor: "pointer" }}>
                <option value="standard">Standard</option>
                <option value="urgent">Urgent</option>
                <option value="tres_urgent">Très urgent</option>
              </select>
            </div>
          </div>
          {error && (
            <div style={{ background: "var(--negative-100)", border: "1px solid var(--negative-500)", borderRadius: 8, padding: "9px 13px", fontSize: 13, color: "var(--negative-600)", fontFamily: "var(--font-sans)" }}>
              {error}
            </div>
          )}
          {success && (
            <div style={{ background: "var(--positive-100)", border: "1px solid var(--positive-500)", borderRadius: 8, padding: "9px 13px", fontSize: 13, color: "var(--positive-700)", fontFamily: "var(--font-sans)", fontWeight: 600 }}>
              {success}
            </div>
          )}
          <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
            <button type="button" onClick={() => setShowForm(false)} style={{ padding: "8px 16px", borderRadius: 8, border: "1px solid var(--border-medium)", background: "transparent", color: "var(--text-muted)", fontSize: 13, fontWeight: 500, cursor: "pointer", fontFamily: "var(--font-sans)" }}>
              Annuler
            </button>
            <button type="submit" disabled={sending} style={{ padding: "8px 20px", borderRadius: 8, border: "none", background: sending ? "var(--stone-200)" : "var(--petrol-800)", color: sending ? "var(--stone-400)" : "#fff", fontSize: 13, fontWeight: 600, cursor: sending ? "wait" : "pointer", fontFamily: "var(--font-sans)" }}>
              {sending ? "Génération…" : "Générer & envoyer le devis"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// Prévisualisation PDF
// ─────────────────────────────────────────────

function DevisPDFPreview({ devisId, onClose }: { devisId: string; onClose: () => void }) {
  const url = `/api/dashboard/devis/pdf?devis_id=${encodeURIComponent(devisId)}`;

  return (
    <div
      style={{ position: "fixed", inset: 0, zIndex: 100, background: "rgba(6,15,20,0.72)", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}
      onClick={onClose}
    >
      <div
        style={{ background: "#fff", borderRadius: 12, overflow: "hidden", width: "min(900px, 100%)", height: "min(90dvh, 1000px)", display: "flex", flexDirection: "column", boxShadow: "0 24px 80px rgba(0,0,0,0.45)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px", borderBottom: "1px solid var(--border-soft)", background: "var(--surface-sunken)", flexShrink: 0 }}>
          <div style={{ fontSize: 13.5, fontWeight: 600, color: "var(--text-strong)", fontFamily: "var(--font-sans)" }}>
            Prévisualisation du devis
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              style={{ padding: "6px 14px", borderRadius: 7, border: "1px solid var(--border-medium)", background: "transparent", color: "var(--text-body)", fontSize: 12.5, fontWeight: 500, fontFamily: "var(--font-sans)", textDecoration: "none", display: "inline-flex", alignItems: "center" }}
            >
              Ouvrir dans l'onglet
            </a>
            <button
              onClick={onClose}
              style={{ padding: "6px 14px", borderRadius: 7, border: "none", background: "var(--petrol-800)", color: "#fff", fontSize: 12.5, fontWeight: 600, cursor: "pointer", fontFamily: "var(--font-sans)" }}
            >
              Fermer
            </button>
          </div>
        </div>
        <iframe
          src={url}
          style={{ flex: 1, border: "none", width: "100%" }}
          title="Prévisualisation devis PDF"
        />
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// Table leads (pipeline)
// ─────────────────────────────────────────────

function LeadTable({ leads, showAction }: { leads: Lead[]; showAction?: boolean }) {
  const [previewDevisId, setPreviewDevisId] = useState<string | null>(null);

  if (leads.length === 0) {
    return (
      <div style={{ padding: "48px 24px", textAlign: "center", color: "var(--text-muted)", fontSize: 14, fontFamily: "var(--font-sans)" }}>
        Aucun lead à afficher
      </div>
    );
  }

  const headers = ["Lead", "Trajet", "Pax", "Statut", "Urgence", "Montant TTC", "Reçu", "Devis"];
  if (showAction) headers.push("");

  return (
    <>
      {previewDevisId && <DevisPDFPreview devisId={previewDevisId} onClose={() => setPreviewDevisId(null)} />}
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 760 }}>
          <thead>
            <tr style={{ background: "var(--surface-sunken)" }}>
              {headers.map((h) => (
                <th key={h} style={{ textAlign: "left", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--text-subtle)", padding: "11px 16px", whiteSpace: "nowrap", fontFamily: "var(--font-sans)", borderBottom: "1px solid var(--border-soft)" }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {leads.map((r) => {
              const devis = r.devis[0];
              return (
                <tr
                  key={r.id}
                  style={{ borderBottom: "1px solid var(--border-soft)", transition: "background 0.12s" }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLTableRowElement).style.background = "var(--surface-sunken)"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLTableRowElement).style.background = "transparent"; }}
                >
                  {/* Lead */}
                  <td style={{ padding: "13px 16px" }}>
                    <div style={{ fontSize: 14, fontWeight: 600, color: "var(--text-strong)", fontFamily: "var(--font-sans)" }}>{r.nom ?? "Prospect"}</div>
                    <div style={{ fontSize: 12, color: "var(--text-subtle)", marginTop: 2, fontFamily: "var(--font-sans)" }}>{r.email}</div>
                    {r.telephone && (
                      <div style={{ fontSize: 12, color: "var(--text-subtle)", marginTop: 1, fontFamily: "var(--font-mono)" }}>{r.telephone}</div>
                    )}
                  </td>
                  {/* Trajet */}
                  <td style={{ padding: "13px 16px", fontSize: 13.5, color: "var(--text-body)", fontFamily: "var(--font-sans)", whiteSpace: "nowrap" }}>
                    {r.origine ?? "?"} → {r.destination ?? "?"}
                  </td>
                  {/* Pax */}
                  <td style={{ padding: "13px 16px", fontSize: 13, fontFamily: "var(--font-mono)", color: "var(--text-body)" }}>
                    {r.nb_passagers ?? "—"}
                  </td>
                  {/* Statut */}
                  <td style={{ padding: "13px 16px" }}>
                    <StatusBadge statut={r.statut} />
                  </td>
                  {/* Urgence */}
                  <td style={{ padding: "13px 16px", fontSize: 12.5, fontFamily: "var(--font-sans)", color: URGENCE_COLOR[r.urgence] ?? "var(--text-muted)", fontWeight: r.urgence !== "standard" ? 600 : 400 }}>
                    {URGENCE_LABEL[r.urgence] ?? r.urgence}
                  </td>
                  {/* Montant */}
                  <td style={{ padding: "13px 16px", fontSize: 13, fontFamily: "var(--font-mono)", fontWeight: 600, color: devis ? "var(--text-strong)" : "var(--text-subtle)" }}>
                    {devis ? formatMontant(devis.montant_ttc) : "—"}
                  </td>
                  {/* Reçu */}
                  <td style={{ padding: "13px 16px", fontSize: 12, color: "var(--text-subtle)", fontFamily: "var(--font-sans)" }}>
                    {timeAgo(r.created_at)}
                  </td>
                  {/* Devis PDF */}
                  <td style={{ padding: "13px 16px" }}>
                    {devis?.email_envoye_at ? (
                      <button
                        onClick={() => setPreviewDevisId(devis.id)}
                        style={{ fontSize: 12, padding: "5px 12px", borderRadius: 6, border: "1px solid var(--border-soft)", background: "var(--surface-card)", color: "var(--brand)", cursor: "pointer", fontFamily: "var(--font-sans)", fontWeight: 500, whiteSpace: "nowrap" }}
                      >
                        Voir PDF
                      </button>
                    ) : (
                      <span style={{ fontSize: 12, color: "var(--text-muted)", fontFamily: "var(--font-sans)" }}>—</span>
                    )}
                  </td>
                  {showAction && (
                    <td style={{ padding: "13px 16px" }}>
                      {r.statut === "accepte_prospect" && <ConfirmButton demandeId={r.id} />}
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}

// ─────────────────────────────────────────────
// Vue Équipe (ancienne page /dashboard/equipe)
// ─────────────────────────────────────────────

interface TeamMember {
  id: string;
  email: string;
  nom: string;
  role: "admin" | "commercial" | "direction";
  actif: boolean;
  created_at: string;
}

function EquipeView() {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [form, setForm] = useState({ nom: "", email: "", role: "commercial" as "admin" | "commercial" | "direction", password: "" });

  const loadMembers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/equipe");
      const json = await res.json();
      setMembers(json.members ?? []);
    } catch { /* silent */ } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadMembers(); }, [loadMembers]);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);
    setSubmitting(true);
    try {
      const res = await fetch("/api/equipe", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      const json = await res.json();
      if (!res.ok) { setFormError(json.error ?? "Erreur lors de la création"); return; }
      setFormSuccess(true);
      setForm({ nom: "", email: "", role: "commercial", password: "" });
      setTimeout(() => { setFormSuccess(false); setShowForm(false); loadMembers(); }, 1500);
    } catch {
      setFormError("Erreur réseau. Réessayez.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id: string) {
    setDeleting(id);
    try {
      await fetch(`/api/equipe?id=${id}`, { method: "DELETE" });
      setMembers((prev) => prev.filter((m) => m.id !== id));
    } finally {
      setDeleting(null);
    }
  }

  const activeMembers = members.filter((m) => m.actif);
  const inactiveMembers = members.filter((m) => !m.actif);

  const inputStyle: React.CSSProperties = { padding: "10px 13px", borderRadius: 8, border: "1.5px solid var(--border-medium)", background: "#fff", fontSize: 14, fontFamily: "var(--font-sans)", color: "var(--text-strong)", outline: "none", transition: "border-color 0.15s ease", width: "100%", boxSizing: "border-box" };
  const labelStyle: React.CSSProperties = { fontSize: 12.5, fontWeight: 600, color: "var(--text-strong)", fontFamily: "var(--font-sans)", letterSpacing: "0.01em" };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {/* Header section */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: 19, fontWeight: 400, color: "var(--text-strong)", margin: "0 0 2px", letterSpacing: "-0.01em" }}>Gestion de l&apos;équipe</h2>
          <p style={{ fontSize: 13, color: "var(--text-muted)", margin: 0, fontFamily: "var(--font-sans)" }}>Créer et gérer les accès collaborateurs</p>
        </div>
        <button
          onClick={() => { setShowForm((v) => !v); setFormError(null); setFormSuccess(false); }}
          style={{ padding: "9px 18px", borderRadius: 8, border: "none", background: "var(--petrol-800)", color: "#fff", fontSize: 13.5, fontWeight: 600, fontFamily: "var(--font-sans)", cursor: "pointer" }}
        >
          {showForm ? "Annuler" : "+ Ajouter un accès"}
        </button>
      </div>

      {/* Create form */}
      {showForm && (
        <div style={{ background: "var(--surface-card)", border: "1px solid var(--border-soft)", borderRadius: 12, padding: "24px 24px 20px" }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: "var(--text-strong)", fontFamily: "var(--font-sans)", marginBottom: 18 }}>Nouveau collaborateur</div>
          <form onSubmit={handleCreate} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                <label style={labelStyle}>Nom complet</label>
                <input type="text" required value={form.nom} onChange={(e) => setForm((f) => ({ ...f, nom: e.target.value }))} placeholder="Prénom Nom" style={inputStyle} onFocus={(e) => (e.target.style.borderColor = "var(--horizon-500)")} onBlur={(e) => (e.target.style.borderColor = "var(--border-medium)")} />
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                <label style={labelStyle}>Adresse email</label>
                <input type="email" required value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} placeholder="prenom.nom@neotravel.fr" style={inputStyle} onFocus={(e) => (e.target.style.borderColor = "var(--horizon-500)")} onBlur={(e) => (e.target.style.borderColor = "var(--border-medium)")} />
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                <label style={labelStyle}>Rôle</label>
                <select value={form.role} onChange={(e) => setForm((f) => ({ ...f, role: e.target.value as "admin" | "commercial" | "direction" }))} style={{ ...inputStyle, cursor: "pointer" }}>
                  <option value="commercial">Commercial</option>
                  <option value="direction">Direction</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                <label style={labelStyle}>Mot de passe provisoire</label>
                <input type="password" required minLength={8} value={form.password} onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))} placeholder="8 caractères minimum" style={inputStyle} onFocus={(e) => (e.target.style.borderColor = "var(--horizon-500)")} onBlur={(e) => (e.target.style.borderColor = "var(--border-medium)")} />
              </div>
            </div>
            {formError && <div style={{ background: "var(--negative-100)", border: "1px solid var(--negative-600)", borderRadius: 8, padding: "9px 13px", fontSize: 13, color: "var(--negative-600)", fontFamily: "var(--font-sans)" }}>{formError}</div>}
            {formSuccess && <div style={{ background: "var(--positive-100)", border: "1px solid var(--positive-500)", borderRadius: 8, padding: "9px 13px", fontSize: 13, color: "var(--positive-700)", fontFamily: "var(--font-sans)", fontWeight: 600 }}>Accès créé avec succès.</div>}
            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 4 }}>
              <button type="submit" disabled={submitting || formSuccess} style={{ padding: "10px 22px", borderRadius: 8, border: "none", background: submitting || formSuccess ? "var(--stone-200)" : "var(--petrol-800)", color: submitting || formSuccess ? "var(--stone-400)" : "#fff", fontSize: 13.5, fontWeight: 600, fontFamily: "var(--font-sans)", cursor: submitting || formSuccess ? "default" : "pointer" }}>
                {submitting ? "Création…" : formSuccess ? "Créé" : "Créer l'accès"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Members table */}
      <div style={{ background: "var(--surface-card)", border: "1px solid var(--border-soft)", borderRadius: 12, overflow: "hidden" }}>
        <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--border-soft)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ fontSize: 13.5, fontWeight: 700, color: "var(--text-strong)", fontFamily: "var(--font-sans)" }}>Collaborateurs actifs</div>
          <div style={{ fontSize: 12, color: "var(--text-subtle)", fontFamily: "var(--font-mono)" }}>{activeMembers.length} membre{activeMembers.length !== 1 ? "s" : ""}</div>
        </div>
        {loading ? (
          <div style={{ padding: "48px 24px", textAlign: "center", color: "var(--text-muted)", fontSize: 13.5, fontFamily: "var(--font-sans)" }}>Chargement…</div>
        ) : activeMembers.length === 0 ? (
          <div style={{ padding: "48px 24px", textAlign: "center", color: "var(--text-muted)", fontSize: 13.5, fontFamily: "var(--font-sans)" }}>Aucun collaborateur. Ajoutez un premier accès.</div>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "var(--surface-sunken)" }}>
                {["Collaborateur", "Email", "Rôle", "Créé le", ""].map((h) => (
                  <th key={h} style={{ textAlign: "left", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--text-subtle)", padding: "10px 16px", borderBottom: "1px solid var(--border-soft)", fontFamily: "var(--font-sans)", whiteSpace: "nowrap" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {activeMembers.map((m) => (
                <tr key={m.id} style={{ borderBottom: "1px solid var(--border-soft)" }} onMouseEnter={(e) => { (e.currentTarget as HTMLTableRowElement).style.background = "var(--surface-sunken)"; }} onMouseLeave={(e) => { (e.currentTarget as HTMLTableRowElement).style.background = "transparent"; }}>
                  <td style={{ padding: "13px 16px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{ width: 32, height: 32, borderRadius: 8, background: "linear-gradient(135deg, var(--petrol-700), var(--horizon-600))", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: "#fff", fontFamily: "var(--font-sans)", flexShrink: 0, letterSpacing: "0.02em" }}>
                        {initials(m.nom)}
                      </div>
                      <span style={{ fontSize: 14, fontWeight: 600, color: "var(--text-strong)", fontFamily: "var(--font-sans)" }}>{m.nom}</span>
                    </div>
                  </td>
                  <td style={{ padding: "13px 16px", fontSize: 13.5, color: "var(--text-body)", fontFamily: "var(--font-sans)" }}>{m.email}</td>
                  <td style={{ padding: "13px 16px" }}><RoleBadge role={m.role} /></td>
                  <td style={{ padding: "13px 16px", fontSize: 12.5, color: "var(--text-subtle)", fontFamily: "var(--font-sans)" }}>
                    {new Date(m.created_at).toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" })}
                  </td>
                  <td style={{ padding: "13px 16px", textAlign: "right" }}>
                    <button onClick={() => handleDelete(m.id)} disabled={deleting === m.id} style={{ padding: "5px 12px", borderRadius: 6, border: "1px solid var(--border-medium)", background: "transparent", color: "var(--negative-600)", fontSize: 12, fontWeight: 600, fontFamily: "var(--font-sans)", cursor: deleting === m.id ? "wait" : "pointer" }} onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "var(--negative-100)"; }} onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "transparent"; }}>
                      {deleting === m.id ? "…" : "Révoquer"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {inactiveMembers.length > 0 && (
        <div style={{ background: "var(--surface-card)", border: "1px solid var(--border-soft)", borderRadius: 12, overflow: "hidden", opacity: 0.65 }}>
          <div style={{ padding: "14px 20px", borderBottom: "1px solid var(--border-soft)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text-subtle)", fontFamily: "var(--font-sans)" }}>Accès révoqués</div>
            <div style={{ fontSize: 12, color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>{inactiveMembers.length}</div>
          </div>
          <div>
            {inactiveMembers.map((m) => (
              <div key={m.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "11px 16px", borderBottom: "1px solid var(--border-soft)" }}>
                <div style={{ width: 28, height: 28, borderRadius: 6, background: "var(--sand-200)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700, color: "var(--stone-400)", fontFamily: "var(--font-sans)", flexShrink: 0 }}>{initials(m.nom)}</div>
                <span style={{ fontSize: 13, color: "var(--text-muted)", fontFamily: "var(--font-sans)" }}>{m.nom}</span>
                <span style={{ fontSize: 12, color: "var(--text-subtle)", fontFamily: "var(--font-sans)" }}>{m.email}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function ComplexesView({ leads }: { leads: Lead[] }) {
  const router = useRouter();
  const [visible, setVisible] = useState<Set<string>>(() => new Set(leads.map((l) => l.id)));

  function handleDone(id: string) {
    setVisible((prev) => { const next = new Set(prev); next.delete(id); return next; });
    router.refresh();
  }

  const actifs = leads.filter((l) => visible.has(l.id));

  if (actifs.length === 0) {
    return (
      <div style={{ padding: "48px", textAlign: "center", color: "var(--text-muted)", fontSize: 14, fontFamily: "var(--font-sans)", background: "var(--surface-card)", borderRadius: 12, border: "1px solid var(--border-soft)" }}>
        Aucun cas complexe en attente
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {actifs.map((r) => (
        <ComplexeCard key={r.id} lead={r} onDone={() => handleDone(r.id)} />
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────
// Navigation
// ─────────────────────────────────────────────

type ViewId = "pilotage" | "pipeline" | "relances" | "complexes" | "equipe";

const NAV: Array<{ id: ViewId; label: string }> = [
  { id: "pilotage",  label: "Pilotage"      },
  { id: "pipeline",  label: "Pipeline"      },
  { id: "relances",  label: "Relances"      },
  { id: "complexes", label: "Cas complexes" },
  { id: "equipe",    label: "Équipe"        },
];

const VIEW_TITLES: Record<ViewId, [string, string]> = {
  pilotage:  ["Pilotage",          "Indicateurs clés du flux commercial"],
  pipeline:  ["Pipeline leads",    "Toutes les demandes et leur statut"],
  relances:  ["Relances",          "Relances planifiées et en attente"],
  complexes: ["Cas complexes",     "Demandes nécessitant une intervention"],
  equipe:    ["Gestion d'équipe",  "Créer et gérer les accès collaborateurs"],
};

// ─────────────────────────────────────────────
// Dashboard principal
// ─────────────────────────────────────────────

export function DashboardClient({ leads, kpis }: Props) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const initialView = (searchParams.get("view") as ViewId) ?? "pilotage";
  const [view, setView] = useState<ViewId>(initialView);
  const [filterStatut, setFilterStatut] = useState("tous");

  function navigateTo(v: ViewId) {
    setView(v);
    router.replace(v === "pilotage" ? "/dashboard" : `/dashboard?view=${v}`, { scroll: false });
  }

  const casComplexes = leads.filter((l) => l.statut === "complexe");
  const enRelance    = leads.filter((l) => ["devis_envoye", "relance_1", "relance_2"].includes(l.statut));
  const filteredLeads = filterStatut === "tous"
    ? leads
    : leads.filter((l) => filterStatut === "relance" ? l.statut.startsWith("relance") : l.statut === filterStatut);

  const [title, subtitle] = VIEW_TITLES[view];

  return (
    <div style={{ display: "flex", minHeight: "100dvh", background: "var(--surface-page)", position: "relative" }}>
      {/* Glow */}
      <div aria-hidden style={{ position: "fixed", inset: 0, zIndex: 0, backgroundImage: "radial-gradient(circle at center, #F0A062, transparent)", opacity: 0.06, mixBlendMode: "multiply", pointerEvents: "none" }} />

      {/* ── Sidebar ── */}
      <aside style={{ position: "sticky", zIndex: 1, top: 0, width: 236, flexShrink: 0, background: "var(--petrol-950)", padding: "20px 12px 20px", display: "flex", flexDirection: "column", height: "100dvh", borderRight: "1px solid rgba(195,219,227,0.08)" }}>
        {/* Logo */}
        <Link href="/" style={{ display: "block", textDecoration: "none", padding: "0 8px 19px" }}>
          <Image src="/neotravel-logo-light.svg" alt="NeoTravel" width={130} height={30} priority style={{ height: "auto", width: "auto", maxHeight: 30 }} />
        </Link>

        {/* Section label */}
        <div style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.14em", color: "rgba(147,190,205,0.4)", padding: "0 12px 10px", fontFamily: "var(--font-sans)" }}>Direction</div>

        {/* Nav */}
        <nav style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {NAV.map((n) => {
            const isActive = view === n.id;
            const badge = n.id === "relances" ? kpis.enRelance : n.id === "complexes" ? kpis.casComplexes : null;
            return (
              <button
                key={n.id}
                onClick={() => navigateTo(n.id)}
                style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%", padding: "9px 12px", borderRadius: 8, border: "none", cursor: "pointer", background: isActive ? "rgba(255,255,255,0.07)" : "transparent", color: isActive ? "#fff" : "rgba(169,194,203,0.6)", fontSize: 13.5, fontWeight: isActive ? 600 : 400, fontFamily: "var(--font-sans)", textAlign: "left", letterSpacing: isActive ? "0" : "-0.01em", transition: "background 0.12s, color 0.12s" }}
                onMouseEnter={(e) => { if (!isActive) (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.04)"; }}
                onMouseLeave={(e) => { if (!isActive) (e.currentTarget as HTMLButtonElement).style.background = "transparent"; }}
              >
                <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  {isActive && <span style={{ width: 2, height: 14, borderRadius: 1, background: "var(--dawn-400)", display: "inline-block", marginLeft: -4, flexShrink: 0 }} />}
                  {n.label}
                </span>
                {badge != null && badge > 0 && (
                  <span style={{ fontSize: 10, fontWeight: 700, fontFamily: "var(--font-mono)", background: "var(--dawn-500)", color: "var(--petrol-950)", padding: "2px 6px", borderRadius: 99, letterSpacing: "0.02em" }}>{badge}</span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Bottom user */}
        <div style={{ marginTop: "auto", padding: "12px 8px", borderTop: "1px solid rgba(195,219,227,0.08)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: "linear-gradient(135deg, var(--petrol-700), var(--horizon-600))", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: "#fff", fontFamily: "var(--font-sans)", flexShrink: 0 }}>D</div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: "#fff", fontFamily: "var(--font-sans)" }}>Direction</div>
              <div style={{ fontSize: 11, color: "rgba(169,194,203,0.5)", fontFamily: "var(--font-sans)" }}>NeoTravel</div>
            </div>
          </div>
        </div>
      </aside>

      {/* ── Main ── */}
      <main style={{ position: "relative", zIndex: 1, flex: 1, minWidth: 0, display: "flex", flexDirection: "column" }}>
        {/* Top bar */}
        <header style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px clamp(20px,3vw,36px)", borderBottom: "1px solid var(--border-soft)", background: "rgba(251,247,242,0.96)", backdropFilter: "blur(10px)", position: "sticky", top: 0, zIndex: 20 }}>
          <div>
            <h1 style={{ fontFamily: "var(--font-display)", fontSize: 24, fontWeight: 400, color: "var(--text-strong)", margin: "0 0 2px", letterSpacing: "-0.015em" }}>{title}</h1>
            <p style={{ fontSize: 13, color: "var(--text-muted)", margin: 0, fontFamily: "var(--font-sans)" }}>{subtitle}</p>
          </div>
          <div style={{ fontSize: 12.5, color: "var(--text-subtle)", fontFamily: "var(--font-sans)", background: "var(--surface-card)", border: "1px solid var(--border-soft)", borderRadius: 8, padding: "7px 13px", letterSpacing: "0.01em" }}>
            {new Date().toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}
          </div>
        </header>

        {/* Content */}
        <div style={{ padding: "clamp(20px,3vw,32px)", flex: 1 }}>

          {/* ── PILOTAGE — KPIs only ── */}
          {view === "pilotage" && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 12 }}>
              <StatCard label="Total leads"      value={String(kpis.totalLeads)}          caption="toutes demandes"        />
              <StatCard label="Devis envoyés"    value={String(kpis.devisEnvoyes)}         caption="flux actif"             variant="accent" />
              <StatCard label="Confirmés"        value={String(kpis.confirmes)}            caption="prestations validées"   />
              <StatCard label="En relance"       value={String(kpis.enRelance)}            caption="en attente de réponse"  />
              <StatCard label="Cas complexes"    value={String(kpis.casComplexes)}         caption="à traiter"              variant={kpis.casComplexes > 0 ? "warning" : "default"} />
              <StatCard label="Pipeline"         value={formatMontant(kpis.montantPipeline)} caption="montant TTC estimé"   />
            </div>
          )}

          {/* ── PIPELINE ── */}
          {view === "pipeline" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {[
                  ["tous",             "Tous"          ],
                  ["devis_envoye",     "Devis envoyé"  ],
                  ["relance",          "En relance"    ],
                  ["complexe",         "Complexes"     ],
                  ["confirme",         "Confirmés"     ],
                  ["accepte_prospect", "Acceptés"      ],
                  ["refuse",           "Refusés"       ],
                ].map(([id, label]) => (
                  <button
                    key={id}
                    onClick={() => setFilterStatut(id)}
                    style={{ fontSize: 13, fontWeight: filterStatut === id ? 600 : 400, fontFamily: "var(--font-sans)", padding: "7px 14px", borderRadius: 8, cursor: "pointer", background: filterStatut === id ? "var(--petrol-800)" : "var(--surface-card)", color: filterStatut === id ? "#fff" : "var(--text-body)", border: `1px solid ${filterStatut === id ? "transparent" : "var(--border-soft)"}`, transition: "all 0.12s" }}
                  >
                    {label}
                  </button>
                ))}
              </div>
              <div style={{ background: "var(--surface-card)", border: "1px solid var(--border-soft)", borderRadius: 12, overflow: "hidden" }}>
                <LeadTable leads={filteredLeads} showAction />
              </div>
            </div>
          )}

          {/* ── RELANCES ── */}
          {view === "relances" && (
            <div style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr", gap: 16, alignItems: "start" }}>
              <div style={{ background: "var(--surface-card)", border: "1px solid var(--border-soft)", borderRadius: 12, overflow: "hidden" }}>
                <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--border-soft)" }}>
                  <h2 style={{ fontFamily: "var(--font-display)", fontSize: 18, fontWeight: 400, color: "var(--text-strong)", margin: 0 }}>En attente de réponse</h2>
                </div>
                {enRelance.length === 0 ? (
                  <div style={{ padding: "32px", textAlign: "center", color: "var(--text-muted)", fontSize: 14, fontFamily: "var(--font-sans)" }}>Aucune relance en attente</div>
                ) : (
                  enRelance.map((r, i) => {
                    const devis = r.devis[0];
                    return (
                      <div key={r.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 20px", borderTop: i ? "1px solid var(--border-soft)" : "none" }}>
                        <div style={{ width: 40, height: 40, borderRadius: 8, background: "var(--horizon-50)", border: "1px solid var(--border-soft)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, fontFamily: "var(--font-mono)", color: "var(--horizon-600)", flexShrink: 0 }}>
                          {r.statut === "devis_envoye" ? "J+3" : "J+7"}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: 14, fontWeight: 600, color: "var(--text-strong)", fontFamily: "var(--font-sans)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{r.nom ?? r.email ?? "Prospect"}</div>
                          <div style={{ fontSize: 12, color: "var(--text-subtle)", marginTop: 2, fontFamily: "var(--font-sans)" }}>
                            {r.origine} → {r.destination} · {devis ? formatMontant(devis.montant_ttc) : "—"}
                          </div>
                          {r.telephone && <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 1, fontFamily: "var(--font-mono)" }}>{r.telephone}</div>}
                        </div>
                        <StatusBadge statut={r.statut} />
                      </div>
                    );
                  })
                )}
              </div>
              <div style={{ background: "var(--surface-sunken)", border: "1px solid var(--border-soft)", borderRadius: 12, padding: 20 }}>
                <h3 style={{ fontFamily: "var(--font-sans)", fontSize: 14, fontWeight: 700, color: "var(--text-strong)", margin: "0 0 14px", textTransform: "uppercase", letterSpacing: "0.06em" }}>Règles de relance</h3>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {[
                    { label: "Urgent",   detail: "J+2, puis J+5"              },
                    { label: "Standard", detail: "J+3, puis J+7"              },
                    { label: "Maximum",  detail: "2 relances, puis clôture auto" },
                  ].map((item) => (
                    <div key={item.label} style={{ display: "flex", justifyContent: "space-between", fontSize: 13, fontFamily: "var(--font-sans)", padding: "10px 0", borderBottom: "1px solid var(--border-soft)" }}>
                      <span style={{ fontWeight: 600, color: "var(--text-strong)" }}>{item.label}</span>
                      <span style={{ color: "var(--text-muted)" }}>{item.detail}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── CAS COMPLEXES ── */}
          {view === "complexes" && (
            <ComplexesView leads={casComplexes} />
          )}

          {/* ── ÉQUIPE ── */}
          {view === "equipe" && <EquipeView />}

        </div>
      </main>
    </div>
  );
}
