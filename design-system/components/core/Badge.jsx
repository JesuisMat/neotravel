import React from 'react';

/**
 * Badge — petite étiquette d'information ou de comptage.
 * Pour les statuts de leads, préférer <StatusBadge>.
 */
export function Badge({ children, tone = 'neutral', variant = 'soft', style = {}, ...rest }) {
  const tones = {
    neutral: { soft: ['var(--surface-sunken)', 'var(--text-muted)'], solid: ['var(--stone-500)', '#fff'] },
    brand:   { soft: ['var(--horizon-100)', 'var(--horizon-700)'], solid: ['var(--brand)', '#fff'] },
    accent:  { soft: ['var(--dawn-100)', 'var(--dawn-700)'], solid: ['var(--dawn-500)', 'var(--text-on-accent)'] },
    positive:{ soft: ['var(--positive-100)', 'var(--positive-600)'], solid: ['var(--positive-500)', '#fff'] },
    caution: { soft: ['var(--caution-100)', 'var(--caution-600)'], solid: ['var(--caution-500)', '#fff'] },
    negative:{ soft: ['var(--negative-100)', 'var(--negative-600)'], solid: ['var(--negative-500)', '#fff'] },
  };
  const [bg, fg] = (tones[tone] || tones.neutral)[variant] || (tones.neutral).soft;

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        background: bg,
        color: fg,
        font: 'var(--weight-semibold) var(--text-micro)/1 var(--font-sans)',
        letterSpacing: '0.03em',
        padding: '5px 10px',
        borderRadius: 'var(--radius-pill)',
        whiteSpace: 'nowrap',
        ...style,
      }}
      {...rest}
    >
      {children}
    </span>
  );
}
