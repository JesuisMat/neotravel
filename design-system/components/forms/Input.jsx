import React, { useState } from 'react';

/**
 * Input — champ de saisie limpide. Label flottant optionnel,
 * focus avec anneau doux couleur horizon.
 */
export function Input({
  label,
  hint,
  error,
  iconLeft = null,
  type = 'text',
  value,
  defaultValue,
  placeholder,
  disabled = false,
  onChange,
  id,
  style = {},
  ...rest
}) {
  const [focused, setFocused] = useState(false);
  const fieldId = id || (label ? `nt-${label.replace(/\s+/g, '-').toLowerCase()}` : undefined);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 7, ...style }}>
      {label && (
        <label htmlFor={fieldId} style={{ font: 'var(--weight-semibold) var(--text-caption)/1.2 var(--font-sans)', color: 'var(--text-body)', letterSpacing: '0.01em' }}>
          {label}
        </label>
      )}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        background: disabled ? 'var(--surface-sunken)' : 'var(--surface-raised)',
        border: `1px solid ${error ? 'var(--negative-500)' : focused ? 'var(--horizon-400)' : 'var(--border-medium)'}`,
        borderRadius: 'var(--radius-md)',
        padding: '0 14px',
        height: 48,
        boxShadow: focused ? `0 0 0 4px ${error ? 'var(--negative-100)' : 'var(--ring)'}` : 'var(--shadow-xs)',
        transition: 'border-color var(--dur-fast) var(--ease-soft), box-shadow var(--dur-fast) var(--ease-soft)',
      }}>
        {iconLeft && <span style={{ display: 'inline-flex', color: 'var(--text-subtle)' }}>{iconLeft}</span>}
        <input
          id={fieldId}
          type={type}
          value={value}
          defaultValue={defaultValue}
          placeholder={placeholder}
          disabled={disabled}
          onChange={onChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={{
            flex: 1,
            border: 'none',
            outline: 'none',
            background: 'transparent',
            font: 'var(--weight-regular) var(--text-body)/1.4 var(--font-sans)',
            color: 'var(--text-strong)',
            minWidth: 0,
          }}
          {...rest}
        />
      </div>
      {(hint || error) && (
        <span style={{ font: 'var(--weight-regular) var(--text-caption)/1.4 var(--font-sans)', color: error ? 'var(--negative-600)' : 'var(--text-muted)' }}>
          {error || hint}
        </span>
      )}
    </div>
  );
}
