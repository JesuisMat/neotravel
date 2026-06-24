import React from 'react';

/**
 * ChatBubble — bulle de conversation. L'agent IA (à gauche, avec
 * avatar) et le prospect (à droite, dégradé d'aube). Variante
 * "typing" pour l'indicateur de saisie.
 */
export function ChatBubble({ from = 'agent', children, name, typing = false, style = {}, ...rest }) {
  const isUser = from === 'user';

  if (typing) {
    return (
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 10, ...style }} {...rest}>
        <div style={{
          background: 'var(--surface-raised)',
          border: '1px solid var(--border-soft)',
          borderRadius: '4px 18px 18px 18px',
          padding: '14px 18px',
          boxShadow: 'var(--shadow-sm)',
          display: 'inline-flex',
          gap: 5,
        }}>
          {[0, 1, 2].map((i) => (
            <span key={i} style={{
              width: 7, height: 7, borderRadius: '50%', background: 'var(--horizon-400)',
              animation: `nt-bounce 1.1s var(--ease-soft) ${i * 0.15}s infinite`,
            }} />
          ))}
        </div>
        <style>{`@keyframes nt-bounce{0%,60%,100%{transform:translateY(0);opacity:.5}30%{transform:translateY(-5px);opacity:1}}`}</style>
      </div>
    );
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: isUser ? 'flex-end' : 'flex-start',
        gap: 4,
        maxWidth: '82%',
        alignSelf: isUser ? 'flex-end' : 'flex-start',
        ...style,
      }}
      {...rest}
    >
      {name && (
        <span style={{ font: 'var(--weight-semibold) var(--text-micro)/1 var(--font-sans)', textTransform: 'uppercase', letterSpacing: 'var(--tracking-caps)', color: 'var(--text-subtle)', padding: '0 6px' }}>
          {name}
        </span>
      )}
      <div style={{
        background: isUser ? 'linear-gradient(160deg, var(--dawn-300), var(--dawn-400))' : 'var(--surface-raised)',
        color: isUser ? 'var(--text-on-accent)' : 'var(--text-body)',
        border: isUser ? '1px solid transparent' : '1px solid var(--border-soft)',
        borderRadius: isUser ? '18px 4px 18px 18px' : '4px 18px 18px 18px',
        padding: '13px 18px',
        font: 'var(--weight-regular) var(--text-body)/1.55 var(--font-sans)',
        boxShadow: isUser ? 'var(--shadow-glow)' : 'var(--shadow-sm)',
      }}>
        {children}
      </div>
    </div>
  );
}
