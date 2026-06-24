import React from 'react';

/**
 * Button — l'action, ressentie comme une évidence.
 * Variantes : primary (action principale unique), accent (l'appel
 * à l'action chaleureux), secondary, ghost, dark.
 */
export function Button({
  children,
  variant = 'primary',
  size = 'md',
  iconLeft = null,
  iconRight = null,
  fullWidth = false,
  disabled = false,
  type = 'button',
  onClick,
  style = {},
  ...rest
}) {
  const sizes = {
    sm: { padding: '0 16px', height: 38, font: '14px', radius: 'var(--radius-pill)', gap: 8 },
    md: { padding: '0 22px', height: 46, font: '15px', radius: 'var(--radius-pill)', gap: 9 },
    lg: { padding: '0 30px', height: 56, font: '17px', radius: 'var(--radius-pill)', gap: 11 },
  };
  const s = sizes[size] || sizes.md;

  const variants = {
    primary: {
      background: 'var(--brand)',
      color: '#fff',
      border: '1px solid transparent',
      boxShadow: 'var(--shadow-sm)',
    },
    accent: {
      background: 'linear-gradient(170deg, var(--dawn-400), var(--dawn-600))',
      color: 'var(--text-on-accent)',
      border: '1px solid transparent',
      boxShadow: 'var(--shadow-glow)',
    },
    secondary: {
      background: 'var(--surface-raised)',
      color: 'var(--brand)',
      border: '1px solid var(--border-medium)',
      boxShadow: 'var(--shadow-xs)',
    },
    ghost: {
      background: 'transparent',
      color: 'var(--text-body)',
      border: '1px solid transparent',
      boxShadow: 'none',
    },
    dark: {
      background: 'var(--petrol-900)',
      color: 'var(--text-on-dark)',
      border: '1px solid transparent',
      boxShadow: 'var(--shadow-md)',
    },
  };
  const v = variants[variant] || variants.primary;

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: s.gap,
        height: s.height,
        padding: s.padding,
        width: fullWidth ? '100%' : 'auto',
        font: `var(--weight-semibold) ${s.font}/1 var(--font-sans)`,
        letterSpacing: '0.005em',
        borderRadius: s.radius,
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        transition: 'transform var(--dur-fast) var(--ease-glide), box-shadow var(--dur-base) var(--ease-glide), background var(--dur-base) var(--ease-soft)',
        whiteSpace: 'nowrap',
        ...v,
        ...style,
      }}
      onMouseEnter={(e) => { if (!disabled) e.currentTarget.style.transform = 'translateY(-1px)'; }}
      onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; }}
      onMouseDown={(e) => { if (!disabled) e.currentTarget.style.transform = 'translateY(0.5px) scale(0.99)'; }}
      onMouseUp={(e) => { if (!disabled) e.currentTarget.style.transform = 'translateY(-1px)'; }}
      {...rest}
    >
      {iconLeft && <span style={{ display: 'inline-flex', marginLeft: -2 }}>{iconLeft}</span>}
      {children}
      {iconRight && <span style={{ display: 'inline-flex', marginRight: -2 }}>{iconRight}</span>}
    </button>
  );
}
