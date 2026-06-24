import React from 'react';

/**
 * SuggestionChip — proposition cliquable sous le chat (sortie
 * scolaire, séminaire, événement…). Contour doux, survol chaud.
 */
export function SuggestionChip({ children, onClick, iconLeft = null, style = {}, ...rest }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 8,
        background: 'var(--surface-raised)',
        color: 'var(--text-body)',
        border: '1px solid var(--border-medium)',
        borderRadius: 'var(--radius-pill)',
        padding: '9px 16px',
        font: 'var(--weight-medium) var(--text-body-s)/1 var(--font-sans)',
        cursor: 'pointer',
        boxShadow: 'var(--shadow-xs)',
        transition: 'all var(--dur-fast) var(--ease-glide)',
        ...style,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = 'var(--dawn-400)';
        e.currentTarget.style.background = 'var(--dawn-100)';
        e.currentTarget.style.color = 'var(--dawn-700)';
        e.currentTarget.style.transform = 'translateY(-1px)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = 'var(--border-medium)';
        e.currentTarget.style.background = 'var(--surface-raised)';
        e.currentTarget.style.color = 'var(--text-body)';
        e.currentTarget.style.transform = 'translateY(0)';
      }}
      {...rest}
    >
      {iconLeft && <span style={{ display: 'inline-flex' }}>{iconLeft}</span>}
      {children}
    </button>
  );
}
