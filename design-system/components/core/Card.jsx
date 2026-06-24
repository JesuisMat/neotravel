import React from 'react';

/**
 * Card — surface posée dans la lumière du matin. Blanc chaud,
 * coins généreux, ombre diffuse. Variante "glass" pour le verre
 * dépoli des espaces de transit.
 */
export function Card({
  children,
  variant = 'raised',
  padding = 'lg',
  interactive = false,
  style = {},
  ...rest
}) {
  const pads = { none: 0, sm: 'var(--space-4)', md: 'var(--space-6)', lg: 'var(--space-8)' };

  const variants = {
    raised: {
      background: 'var(--surface-card)',
      border: '1px solid var(--border-soft)',
      boxShadow: 'var(--shadow-md)',
    },
    flat: {
      background: 'var(--surface-card)',
      border: '1px solid var(--border-soft)',
      boxShadow: 'none',
    },
    sunken: {
      background: 'var(--surface-sunken)',
      border: '1px solid var(--border-soft)',
      boxShadow: 'var(--shadow-inset)',
    },
    glass: {
      background: 'rgba(254, 252, 249, 0.62)',
      border: '1px solid rgba(255,255,255,0.6)',
      boxShadow: 'var(--shadow-lg)',
      backdropFilter: 'blur(var(--blur-md)) saturate(1.3)',
      WebkitBackdropFilter: 'blur(var(--blur-md)) saturate(1.3)',
    },
    dark: {
      background: 'var(--surface-dark-2)',
      border: '1px solid var(--border-on-dark)',
      boxShadow: 'var(--shadow-lg)',
      color: 'var(--text-on-dark)',
    },
  };
  const v = variants[variant] || variants.raised;

  return (
    <div
      style={{
        borderRadius: 'var(--radius-lg)',
        padding: pads[padding] ?? pads.lg,
        transition: 'transform var(--dur-base) var(--ease-glide), box-shadow var(--dur-base) var(--ease-glide)',
        ...v,
        ...style,
      }}
      onMouseEnter={interactive ? (e) => {
        e.currentTarget.style.transform = 'translateY(-3px)';
        e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
      } : undefined}
      onMouseLeave={interactive ? (e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = v.boxShadow;
      } : undefined}
      {...rest}
    >
      {children}
    </div>
  );
}
