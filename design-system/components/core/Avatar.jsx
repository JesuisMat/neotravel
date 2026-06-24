import React from 'react';

/**
 * Avatar — initiales sur fond dégradé doux, ou image. Pour le
 * prospect, l'agent IA, les conseillers. Forme ronde.
 */
export function Avatar({ name = '', src = null, size = 40, tone = 'brand', icon = null, style = {}, ...rest }) {
  const initials = name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase();

  const tones = {
    brand:  'linear-gradient(150deg, var(--horizon-400), var(--horizon-600))',
    accent: 'linear-gradient(150deg, var(--dawn-400), var(--dawn-600))',
    petrol: 'linear-gradient(150deg, var(--petrol-700), var(--petrol-900))',
    neutral:'linear-gradient(150deg, var(--stone-300), var(--stone-500))',
  };

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: size,
        height: size,
        flex: `0 0 ${size}px`,
        borderRadius: '50%',
        background: src ? `center/cover no-repeat url(${src})` : (tones[tone] || tones.brand),
        color: '#fff',
        font: `var(--weight-bold) ${Math.round(size * 0.38)}px/1 var(--font-sans)`,
        boxShadow: 'var(--shadow-xs), inset 0 0 0 1px rgba(255,255,255,0.18)',
        overflow: 'hidden',
        userSelect: 'none',
        ...style,
      }}
      {...rest}
    >
      {!src && (icon || initials)}
    </span>
  );
}
