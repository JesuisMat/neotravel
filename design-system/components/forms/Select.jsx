import React, { useState } from 'react';

/**
 * Select — liste déroulante native stylée. Même langage visuel
 * que Input. Pour les matrices, types de client, options.
 */
export function Select({
  label,
  hint,
  error,
  value,
  defaultValue,
  onChange,
  options = [],
  placeholder = 'Sélectionner…',
  disabled = false,
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
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        background: disabled ? 'var(--surface-sunken)' : 'var(--surface-raised)',
        border: `1px solid ${error ? 'var(--negative-500)' : focused ? 'var(--horizon-400)' : 'var(--border-medium)'}`,
        borderRadius: 'var(--radius-md)',
        height: 48,
        boxShadow: focused ? `0 0 0 4px ${error ? 'var(--negative-100)' : 'var(--ring)'}` : 'var(--shadow-xs)',
        transition: 'border-color var(--dur-fast) var(--ease-soft), box-shadow var(--dur-fast) var(--ease-soft)',
      }}>
        <select
          id={fieldId}
          value={value}
          defaultValue={defaultValue}
          onChange={onChange}
          disabled={disabled}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={{
            flex: 1,
            appearance: 'none',
            WebkitAppearance: 'none',
            border: 'none',
            outline: 'none',
            background: 'transparent',
            font: 'var(--weight-regular) var(--text-body)/1.4 var(--font-sans)',
            color: 'var(--text-strong)',
            padding: '0 38px 0 14px',
            height: '100%',
            cursor: disabled ? 'not-allowed' : 'pointer',
            borderRadius: 'var(--radius-md)',
          }}
          {...rest}
        >
          {placeholder && <option value="" disabled>{placeholder}</option>}
          {options.map((o) => {
            const opt = typeof o === 'string' ? { value: o, label: o } : o;
            return <option key={opt.value} value={opt.value}>{opt.label}</option>;
          })}
        </select>
        <span aria-hidden style={{ position: 'absolute', right: 14, color: 'var(--text-subtle)', pointerEvents: 'none', fontSize: 12 }}>▾</span>
      </div>
      {(hint || error) && (
        <span style={{ font: 'var(--weight-regular) var(--text-caption)/1.4 var(--font-sans)', color: error ? 'var(--negative-600)' : 'var(--text-muted)' }}>
          {error || hint}
        </span>
      )}
    </div>
  );
}
