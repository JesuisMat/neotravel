import React from 'react';

/**
 * StatCard — tuile KPI du dashboard direction. Grand chiffre
 * tabulaire, libellé, tendance optionnelle.
 */
export function StatCard({
  label,
  value,
  unit = '',
  delta = null,
  deltaDir = 'up',
  caption = '',
  accent = false,
  icon = null,
  style = {},
  ...rest
}) {
  const deltaColor = deltaDir === 'down' ? 'var(--negative-600)' : 'var(--positive-600)';
  const arrow = deltaDir === 'down' ? '↓' : '↑';

  return (
    <div
      style={{
        position: 'relative',
        background: accent ? 'var(--gradient-sunrise)' : 'var(--surface-card)',
        border: `1px solid ${accent ? 'transparent' : 'var(--border-soft)'}`,
        borderRadius: 'var(--radius-lg)',
        padding: 'var(--space-6)',
        boxShadow: accent ? 'var(--shadow-glow)' : 'var(--shadow-sm)',
        overflow: 'hidden',
        ...style,
      }}
      {...rest}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
        <span style={{ font: 'var(--weight-semibold) var(--text-caption)/1.2 var(--font-sans)', textTransform: 'uppercase', letterSpacing: 'var(--tracking-caps)', color: accent ? 'var(--petrol-800)' : 'var(--text-muted)' }}>
          {label}
        </span>
        {icon && <span style={{ display: 'inline-flex', color: accent ? 'var(--petrol-700)' : 'var(--text-subtle)' }}>{icon}</span>}
      </div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
        <span style={{ font: 'var(--weight-medium) 40px/1 var(--font-display)', color: accent ? 'var(--petrol-950)' : 'var(--text-strong)', fontVariantNumeric: 'tabular-nums', letterSpacing: '-0.01em' }}>
          {value}
        </span>
        {unit && <span style={{ font: 'var(--weight-semibold) 16px/1 var(--font-sans)', color: accent ? 'var(--petrol-800)' : 'var(--text-muted)' }}>{unit}</span>}
      </div>
      {(delta || caption) && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 12 }}>
          {delta && (
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3, font: 'var(--weight-bold) var(--text-caption)/1 var(--font-mono)', color: accent ? 'var(--petrol-900)' : deltaColor }}>
              {arrow} {delta}
            </span>
          )}
          {caption && <span style={{ font: 'var(--weight-regular) var(--text-caption)/1.3 var(--font-sans)', color: accent ? 'var(--petrol-800)' : 'var(--text-subtle)' }}>{caption}</span>}
        </div>
      )}
    </div>
  );
}
