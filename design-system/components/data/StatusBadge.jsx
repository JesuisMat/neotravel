import React from 'react';

/**
 * Mapping des statuts commerciaux NeoTravel vers couleur + libellé.
 * Source : machine d'état du parcours lead (jour-1 / jour-2).
 */
export const LEAD_STATUSES = {
  nouveau:          { label: 'Nouveau',           tone: 'info' },
  incomplet:        { label: 'Incomplet',         tone: 'caution' },
  qualifie:         { label: 'Qualifié',          tone: 'brand' },
  devis_envoye:     { label: 'Devis envoyé',      tone: 'brand' },
  relance_1:        { label: 'Relance 1',         tone: 'caution' },
  relance_2:        { label: 'Relance 2',         tone: 'caution' },
  accepte_prospect: { label: 'Accepté',           tone: 'positive' },
  confirme:         { label: 'Confirmé',          tone: 'positive' },
  refuse:           { label: 'Refusé',            tone: 'negative' },
  complexe:         { label: 'Cas complexe',      tone: 'accent' },
  cloture:          { label: 'Clôturé',           tone: 'neutral' },
};

const TONE_STYLES = {
  info:     { bg: 'var(--horizon-100)',  fg: 'var(--horizon-700)',  dot: 'var(--horizon-500)' },
  brand:    { bg: 'var(--horizon-100)',  fg: 'var(--horizon-700)',  dot: 'var(--brand)' },
  accent:   { bg: 'var(--dawn-100)',     fg: 'var(--dawn-700)',     dot: 'var(--dawn-500)' },
  positive: { bg: 'var(--positive-100)', fg: 'var(--positive-600)', dot: 'var(--positive-500)' },
  caution:  { bg: 'var(--caution-100)',  fg: 'var(--caution-600)',  dot: 'var(--caution-500)' },
  negative: { bg: 'var(--negative-100)', fg: 'var(--negative-600)', dot: 'var(--negative-500)' },
  neutral:  { bg: 'var(--surface-sunken)', fg: 'var(--text-muted)', dot: 'var(--stone-400)' },
};

/**
 * StatusBadge — pilule de statut de lead, avec pastille colorée.
 * Passez `status` (clé) OU `tone` + `label` libres.
 */
export function StatusBadge({ status, label, tone, dot = true, style = {}, ...rest }) {
  const def = status ? LEAD_STATUSES[status] : null;
  const t = tone || def?.tone || 'neutral';
  const txt = label || def?.label || status || '—';
  const s = TONE_STYLES[t] || TONE_STYLES.neutral;

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 7,
        background: s.bg,
        color: s.fg,
        font: 'var(--weight-semibold) var(--text-caption)/1 var(--font-sans)',
        letterSpacing: '0.01em',
        padding: '6px 12px 6px 10px',
        borderRadius: 'var(--radius-pill)',
        whiteSpace: 'nowrap',
        ...style,
      }}
      {...rest}
    >
      {dot && <span style={{ width: 7, height: 7, borderRadius: '50%', background: s.dot, flex: '0 0 7px' }} />}
      {txt}
    </span>
  );
}
