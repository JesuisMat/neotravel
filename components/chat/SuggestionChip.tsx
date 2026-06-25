"use client";

import React from "react";

interface SuggestionChipProps {
  children: React.ReactNode;
  onClick: () => void;
}

export function SuggestionChip({ children, onClick }: SuggestionChipProps) {
  return (
    <button
      onClick={onClick}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        padding: "8px 14px",
        borderRadius: 99,
        border: "1px solid var(--border-brand)",
        background: "var(--surface-brand-soft)",
        color: "var(--brand)",
        fontSize: 13.5,
        fontFamily: "var(--font-sans)",
        fontWeight: 500,
        cursor: "pointer",
        transition: "all 0.15s ease",
        whiteSpace: "nowrap",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLButtonElement).style.background = "var(--horizon-100)";
        (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--brand)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLButtonElement).style.background = "var(--surface-brand-soft)";
        (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--border-brand)";
      }}
    >
      {children}
    </button>
  );
}
