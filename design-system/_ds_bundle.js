/* @ds-bundle: {"format":3,"namespace":"NeoTravelDesignSystem_389d31","components":[{"name":"ChatBubble","sourcePath":"components/chat/ChatBubble.jsx"},{"name":"SuggestionChip","sourcePath":"components/chat/SuggestionChip.jsx"},{"name":"Avatar","sourcePath":"components/core/Avatar.jsx"},{"name":"Badge","sourcePath":"components/core/Badge.jsx"},{"name":"Button","sourcePath":"components/core/Button.jsx"},{"name":"Card","sourcePath":"components/core/Card.jsx"},{"name":"StatCard","sourcePath":"components/data/StatCard.jsx"},{"name":"LEAD_STATUSES","sourcePath":"components/data/StatusBadge.jsx"},{"name":"StatusBadge","sourcePath":"components/data/StatusBadge.jsx"},{"name":"Input","sourcePath":"components/forms/Input.jsx"},{"name":"Select","sourcePath":"components/forms/Select.jsx"}],"sourceHashes":{"components/chat/ChatBubble.jsx":"10b227e47f33","components/chat/SuggestionChip.jsx":"f6b284196a08","components/core/Avatar.jsx":"568d864f5a61","components/core/Badge.jsx":"28a7954fe96f","components/core/Button.jsx":"efbb725c596c","components/core/Card.jsx":"540c6b2c3022","components/data/StatCard.jsx":"8547d52b31b1","components/data/StatusBadge.jsx":"3656df504339","components/forms/Input.jsx":"109bfa5df528","components/forms/Select.jsx":"b872554cb46b","ui_kits/_shared/Icon.jsx":"b1e20bef3a98","ui_kits/console/ConsoleShell.jsx":"ee3e5575fe4d","ui_kits/console/DashboardViews.jsx":"1e730b5394c6","ui_kits/console/MatricesView.jsx":"f4a25c868275","ui_kits/landing/HeroChat.jsx":"b603996660a9","ui_kits/landing/LandingChrome.jsx":"d665342ee926","ui_kits/landing/Narrative.jsx":"98f7a257de5f"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.NeoTravelDesignSystem_389d31 = window.NeoTravelDesignSystem_389d31 || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/chat/ChatBubble.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * ChatBubble — bulle de conversation. L'agent IA (à gauche, avec
 * avatar) et le prospect (à droite, dégradé d'aube). Variante
 * "typing" pour l'indicateur de saisie.
 */
function ChatBubble({
  from = 'agent',
  children,
  name,
  typing = false,
  style = {},
  ...rest
}) {
  const isUser = from === 'user';
  if (typing) {
    return /*#__PURE__*/React.createElement("div", _extends({
      style: {
        display: 'flex',
        alignItems: 'flex-end',
        gap: 10,
        ...style
      }
    }, rest), /*#__PURE__*/React.createElement("div", {
      style: {
        background: 'var(--surface-raised)',
        border: '1px solid var(--border-soft)',
        borderRadius: '4px 18px 18px 18px',
        padding: '14px 18px',
        boxShadow: 'var(--shadow-sm)',
        display: 'inline-flex',
        gap: 5
      }
    }, [0, 1, 2].map(i => /*#__PURE__*/React.createElement("span", {
      key: i,
      style: {
        width: 7,
        height: 7,
        borderRadius: '50%',
        background: 'var(--horizon-400)',
        animation: `nt-bounce 1.1s var(--ease-soft) ${i * 0.15}s infinite`
      }
    }))), /*#__PURE__*/React.createElement("style", null, `@keyframes nt-bounce{0%,60%,100%{transform:translateY(0);opacity:.5}30%{transform:translateY(-5px);opacity:1}}`));
  }
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: isUser ? 'flex-end' : 'flex-start',
      gap: 4,
      maxWidth: '82%',
      alignSelf: isUser ? 'flex-end' : 'flex-start',
      ...style
    }
  }, rest), name && /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--weight-semibold) var(--text-micro)/1 var(--font-sans)',
      textTransform: 'uppercase',
      letterSpacing: 'var(--tracking-caps)',
      color: 'var(--text-subtle)',
      padding: '0 6px'
    }
  }, name), /*#__PURE__*/React.createElement("div", {
    style: {
      background: isUser ? 'linear-gradient(160deg, var(--dawn-300), var(--dawn-400))' : 'var(--surface-raised)',
      color: isUser ? 'var(--text-on-accent)' : 'var(--text-body)',
      border: isUser ? '1px solid transparent' : '1px solid var(--border-soft)',
      borderRadius: isUser ? '18px 4px 18px 18px' : '4px 18px 18px 18px',
      padding: '13px 18px',
      font: 'var(--weight-regular) var(--text-body)/1.55 var(--font-sans)',
      boxShadow: isUser ? 'var(--shadow-glow)' : 'var(--shadow-sm)'
    }
  }, children));
}
Object.assign(__ds_scope, { ChatBubble });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/chat/ChatBubble.jsx", error: String((e && e.message) || e) }); }

// components/chat/SuggestionChip.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * SuggestionChip — proposition cliquable sous le chat (sortie
 * scolaire, séminaire, événement…). Contour doux, survol chaud.
 */
function SuggestionChip({
  children,
  onClick,
  iconLeft = null,
  style = {},
  ...rest
}) {
  return /*#__PURE__*/React.createElement("button", _extends({
    type: "button",
    onClick: onClick,
    style: {
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
      ...style
    },
    onMouseEnter: e => {
      e.currentTarget.style.borderColor = 'var(--dawn-400)';
      e.currentTarget.style.background = 'var(--dawn-100)';
      e.currentTarget.style.color = 'var(--dawn-700)';
      e.currentTarget.style.transform = 'translateY(-1px)';
    },
    onMouseLeave: e => {
      e.currentTarget.style.borderColor = 'var(--border-medium)';
      e.currentTarget.style.background = 'var(--surface-raised)';
      e.currentTarget.style.color = 'var(--text-body)';
      e.currentTarget.style.transform = 'translateY(0)';
    }
  }, rest), iconLeft && /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex'
    }
  }, iconLeft), children);
}
Object.assign(__ds_scope, { SuggestionChip });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/chat/SuggestionChip.jsx", error: String((e && e.message) || e) }); }

// components/core/Avatar.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Avatar — initiales sur fond dégradé doux, ou image. Pour le
 * prospect, l'agent IA, les conseillers. Forme ronde.
 */
function Avatar({
  name = '',
  src = null,
  size = 40,
  tone = 'brand',
  icon = null,
  style = {},
  ...rest
}) {
  const initials = name.split(' ').filter(Boolean).slice(0, 2).map(w => w[0]).join('').toUpperCase();
  const tones = {
    brand: 'linear-gradient(150deg, var(--horizon-400), var(--horizon-600))',
    accent: 'linear-gradient(150deg, var(--dawn-400), var(--dawn-600))',
    petrol: 'linear-gradient(150deg, var(--petrol-700), var(--petrol-900))',
    neutral: 'linear-gradient(150deg, var(--stone-300), var(--stone-500))'
  };
  return /*#__PURE__*/React.createElement("span", _extends({
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: size,
      height: size,
      flex: `0 0 ${size}px`,
      borderRadius: '50%',
      background: src ? `center/cover no-repeat url(${src})` : tones[tone] || tones.brand,
      color: '#fff',
      font: `var(--weight-bold) ${Math.round(size * 0.38)}px/1 var(--font-sans)`,
      boxShadow: 'var(--shadow-xs), inset 0 0 0 1px rgba(255,255,255,0.18)',
      overflow: 'hidden',
      userSelect: 'none',
      ...style
    }
  }, rest), !src && (icon || initials));
}
Object.assign(__ds_scope, { Avatar });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Avatar.jsx", error: String((e && e.message) || e) }); }

// components/core/Badge.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Badge — petite étiquette d'information ou de comptage.
 * Pour les statuts de leads, préférer <StatusBadge>.
 */
function Badge({
  children,
  tone = 'neutral',
  variant = 'soft',
  style = {},
  ...rest
}) {
  const tones = {
    neutral: {
      soft: ['var(--surface-sunken)', 'var(--text-muted)'],
      solid: ['var(--stone-500)', '#fff']
    },
    brand: {
      soft: ['var(--horizon-100)', 'var(--horizon-700)'],
      solid: ['var(--brand)', '#fff']
    },
    accent: {
      soft: ['var(--dawn-100)', 'var(--dawn-700)'],
      solid: ['var(--dawn-500)', 'var(--text-on-accent)']
    },
    positive: {
      soft: ['var(--positive-100)', 'var(--positive-600)'],
      solid: ['var(--positive-500)', '#fff']
    },
    caution: {
      soft: ['var(--caution-100)', 'var(--caution-600)'],
      solid: ['var(--caution-500)', '#fff']
    },
    negative: {
      soft: ['var(--negative-100)', 'var(--negative-600)'],
      solid: ['var(--negative-500)', '#fff']
    }
  };
  const [bg, fg] = (tones[tone] || tones.neutral)[variant] || tones.neutral.soft;
  return /*#__PURE__*/React.createElement("span", _extends({
    style: {
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
      ...style
    }
  }, rest), children);
}
Object.assign(__ds_scope, { Badge });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Badge.jsx", error: String((e && e.message) || e) }); }

// components/core/Button.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Button — l'action, ressentie comme une évidence.
 * Variantes : primary (action principale unique), accent (l'appel
 * à l'action chaleureux), secondary, ghost, dark.
 */
function Button({
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
    sm: {
      padding: '0 16px',
      height: 38,
      font: '14px',
      radius: 'var(--radius-pill)',
      gap: 8
    },
    md: {
      padding: '0 22px',
      height: 46,
      font: '15px',
      radius: 'var(--radius-pill)',
      gap: 9
    },
    lg: {
      padding: '0 30px',
      height: 56,
      font: '17px',
      radius: 'var(--radius-pill)',
      gap: 11
    }
  };
  const s = sizes[size] || sizes.md;
  const variants = {
    primary: {
      background: 'var(--brand)',
      color: '#fff',
      border: '1px solid transparent',
      boxShadow: 'var(--shadow-sm)'
    },
    accent: {
      background: 'linear-gradient(170deg, var(--dawn-400), var(--dawn-600))',
      color: 'var(--text-on-accent)',
      border: '1px solid transparent',
      boxShadow: 'var(--shadow-glow)'
    },
    secondary: {
      background: 'var(--surface-raised)',
      color: 'var(--brand)',
      border: '1px solid var(--border-medium)',
      boxShadow: 'var(--shadow-xs)'
    },
    ghost: {
      background: 'transparent',
      color: 'var(--text-body)',
      border: '1px solid transparent',
      boxShadow: 'none'
    },
    dark: {
      background: 'var(--petrol-900)',
      color: 'var(--text-on-dark)',
      border: '1px solid transparent',
      boxShadow: 'var(--shadow-md)'
    }
  };
  const v = variants[variant] || variants.primary;
  return /*#__PURE__*/React.createElement("button", _extends({
    type: type,
    disabled: disabled,
    onClick: onClick,
    style: {
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
      ...style
    },
    onMouseEnter: e => {
      if (!disabled) e.currentTarget.style.transform = 'translateY(-1px)';
    },
    onMouseLeave: e => {
      e.currentTarget.style.transform = 'translateY(0)';
    },
    onMouseDown: e => {
      if (!disabled) e.currentTarget.style.transform = 'translateY(0.5px) scale(0.99)';
    },
    onMouseUp: e => {
      if (!disabled) e.currentTarget.style.transform = 'translateY(-1px)';
    }
  }, rest), iconLeft && /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      marginLeft: -2
    }
  }, iconLeft), children, iconRight && /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      marginRight: -2
    }
  }, iconRight));
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Button.jsx", error: String((e && e.message) || e) }); }

// components/core/Card.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Card — surface posée dans la lumière du matin. Blanc chaud,
 * coins généreux, ombre diffuse. Variante "glass" pour le verre
 * dépoli des espaces de transit.
 */
function Card({
  children,
  variant = 'raised',
  padding = 'lg',
  interactive = false,
  style = {},
  ...rest
}) {
  const pads = {
    none: 0,
    sm: 'var(--space-4)',
    md: 'var(--space-6)',
    lg: 'var(--space-8)'
  };
  const variants = {
    raised: {
      background: 'var(--surface-card)',
      border: '1px solid var(--border-soft)',
      boxShadow: 'var(--shadow-md)'
    },
    flat: {
      background: 'var(--surface-card)',
      border: '1px solid var(--border-soft)',
      boxShadow: 'none'
    },
    sunken: {
      background: 'var(--surface-sunken)',
      border: '1px solid var(--border-soft)',
      boxShadow: 'var(--shadow-inset)'
    },
    glass: {
      background: 'rgba(254, 252, 249, 0.62)',
      border: '1px solid rgba(255,255,255,0.6)',
      boxShadow: 'var(--shadow-lg)',
      backdropFilter: 'blur(var(--blur-md)) saturate(1.3)',
      WebkitBackdropFilter: 'blur(var(--blur-md)) saturate(1.3)'
    },
    dark: {
      background: 'var(--surface-dark-2)',
      border: '1px solid var(--border-on-dark)',
      boxShadow: 'var(--shadow-lg)',
      color: 'var(--text-on-dark)'
    }
  };
  const v = variants[variant] || variants.raised;
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      borderRadius: 'var(--radius-lg)',
      padding: pads[padding] ?? pads.lg,
      transition: 'transform var(--dur-base) var(--ease-glide), box-shadow var(--dur-base) var(--ease-glide)',
      ...v,
      ...style
    },
    onMouseEnter: interactive ? e => {
      e.currentTarget.style.transform = 'translateY(-3px)';
      e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
    } : undefined,
    onMouseLeave: interactive ? e => {
      e.currentTarget.style.transform = 'translateY(0)';
      e.currentTarget.style.boxShadow = v.boxShadow;
    } : undefined
  }, rest), children);
}
Object.assign(__ds_scope, { Card });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Card.jsx", error: String((e && e.message) || e) }); }

// components/data/StatCard.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * StatCard — tuile KPI du dashboard direction. Grand chiffre
 * tabulaire, libellé, tendance optionnelle.
 */
function StatCard({
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
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      position: 'relative',
      background: accent ? 'var(--gradient-sunrise)' : 'var(--surface-card)',
      border: `1px solid ${accent ? 'transparent' : 'var(--border-soft)'}`,
      borderRadius: 'var(--radius-lg)',
      padding: 'var(--space-6)',
      boxShadow: accent ? 'var(--shadow-glow)' : 'var(--shadow-sm)',
      overflow: 'hidden',
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 14
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--weight-semibold) var(--text-caption)/1.2 var(--font-sans)',
      textTransform: 'uppercase',
      letterSpacing: 'var(--tracking-caps)',
      color: accent ? 'var(--petrol-800)' : 'var(--text-muted)'
    }
  }, label), icon && /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      color: accent ? 'var(--petrol-700)' : 'var(--text-subtle)'
    }
  }, icon)), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'baseline',
      gap: 6
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--weight-medium) 40px/1 var(--font-display)',
      color: accent ? 'var(--petrol-950)' : 'var(--text-strong)',
      fontVariantNumeric: 'tabular-nums',
      letterSpacing: '-0.01em'
    }
  }, value), unit && /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--weight-semibold) 16px/1 var(--font-sans)',
      color: accent ? 'var(--petrol-800)' : 'var(--text-muted)'
    }
  }, unit)), (delta || caption) && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      marginTop: 12
    }
  }, delta && /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 3,
      font: 'var(--weight-bold) var(--text-caption)/1 var(--font-mono)',
      color: accent ? 'var(--petrol-900)' : deltaColor
    }
  }, arrow, " ", delta), caption && /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--weight-regular) var(--text-caption)/1.3 var(--font-sans)',
      color: accent ? 'var(--petrol-800)' : 'var(--text-subtle)'
    }
  }, caption)));
}
Object.assign(__ds_scope, { StatCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/data/StatCard.jsx", error: String((e && e.message) || e) }); }

// components/data/StatusBadge.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Mapping des statuts commerciaux NeoTravel vers couleur + libellé.
 * Source : machine d'état du parcours lead (jour-1 / jour-2).
 */
const LEAD_STATUSES = {
  nouveau: {
    label: 'Nouveau',
    tone: 'info'
  },
  incomplet: {
    label: 'Incomplet',
    tone: 'caution'
  },
  qualifie: {
    label: 'Qualifié',
    tone: 'brand'
  },
  devis_envoye: {
    label: 'Devis envoyé',
    tone: 'brand'
  },
  relance_1: {
    label: 'Relance 1',
    tone: 'caution'
  },
  relance_2: {
    label: 'Relance 2',
    tone: 'caution'
  },
  accepte_prospect: {
    label: 'Accepté',
    tone: 'positive'
  },
  confirme: {
    label: 'Confirmé',
    tone: 'positive'
  },
  refuse: {
    label: 'Refusé',
    tone: 'negative'
  },
  complexe: {
    label: 'Cas complexe',
    tone: 'accent'
  },
  cloture: {
    label: 'Clôturé',
    tone: 'neutral'
  }
};
const TONE_STYLES = {
  info: {
    bg: 'var(--horizon-100)',
    fg: 'var(--horizon-700)',
    dot: 'var(--horizon-500)'
  },
  brand: {
    bg: 'var(--horizon-100)',
    fg: 'var(--horizon-700)',
    dot: 'var(--brand)'
  },
  accent: {
    bg: 'var(--dawn-100)',
    fg: 'var(--dawn-700)',
    dot: 'var(--dawn-500)'
  },
  positive: {
    bg: 'var(--positive-100)',
    fg: 'var(--positive-600)',
    dot: 'var(--positive-500)'
  },
  caution: {
    bg: 'var(--caution-100)',
    fg: 'var(--caution-600)',
    dot: 'var(--caution-500)'
  },
  negative: {
    bg: 'var(--negative-100)',
    fg: 'var(--negative-600)',
    dot: 'var(--negative-500)'
  },
  neutral: {
    bg: 'var(--surface-sunken)',
    fg: 'var(--text-muted)',
    dot: 'var(--stone-400)'
  }
};

/**
 * StatusBadge — pilule de statut de lead, avec pastille colorée.
 * Passez `status` (clé) OU `tone` + `label` libres.
 */
function StatusBadge({
  status,
  label,
  tone,
  dot = true,
  style = {},
  ...rest
}) {
  const def = status ? LEAD_STATUSES[status] : null;
  const t = tone || def?.tone || 'neutral';
  const txt = label || def?.label || status || '—';
  const s = TONE_STYLES[t] || TONE_STYLES.neutral;
  return /*#__PURE__*/React.createElement("span", _extends({
    style: {
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
      ...style
    }
  }, rest), dot && /*#__PURE__*/React.createElement("span", {
    style: {
      width: 7,
      height: 7,
      borderRadius: '50%',
      background: s.dot,
      flex: '0 0 7px'
    }
  }), txt);
}
Object.assign(__ds_scope, { LEAD_STATUSES, StatusBadge });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/data/StatusBadge.jsx", error: String((e && e.message) || e) }); }

// components/forms/Input.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const {
  useState
} = React;
/**
 * Input — champ de saisie limpide. Label flottant optionnel,
 * focus avec anneau doux couleur horizon.
 */
function Input({
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
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 7,
      ...style
    }
  }, label && /*#__PURE__*/React.createElement("label", {
    htmlFor: fieldId,
    style: {
      font: 'var(--weight-semibold) var(--text-caption)/1.2 var(--font-sans)',
      color: 'var(--text-body)',
      letterSpacing: '0.01em'
    }
  }, label), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      background: disabled ? 'var(--surface-sunken)' : 'var(--surface-raised)',
      border: `1px solid ${error ? 'var(--negative-500)' : focused ? 'var(--horizon-400)' : 'var(--border-medium)'}`,
      borderRadius: 'var(--radius-md)',
      padding: '0 14px',
      height: 48,
      boxShadow: focused ? `0 0 0 4px ${error ? 'var(--negative-100)' : 'var(--ring)'}` : 'var(--shadow-xs)',
      transition: 'border-color var(--dur-fast) var(--ease-soft), box-shadow var(--dur-fast) var(--ease-soft)'
    }
  }, iconLeft && /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      color: 'var(--text-subtle)'
    }
  }, iconLeft), /*#__PURE__*/React.createElement("input", _extends({
    id: fieldId,
    type: type,
    value: value,
    defaultValue: defaultValue,
    placeholder: placeholder,
    disabled: disabled,
    onChange: onChange,
    onFocus: () => setFocused(true),
    onBlur: () => setFocused(false),
    style: {
      flex: 1,
      border: 'none',
      outline: 'none',
      background: 'transparent',
      font: 'var(--weight-regular) var(--text-body)/1.4 var(--font-sans)',
      color: 'var(--text-strong)',
      minWidth: 0
    }
  }, rest))), (hint || error) && /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--weight-regular) var(--text-caption)/1.4 var(--font-sans)',
      color: error ? 'var(--negative-600)' : 'var(--text-muted)'
    }
  }, error || hint));
}
Object.assign(__ds_scope, { Input });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Input.jsx", error: String((e && e.message) || e) }); }

// components/forms/Select.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const {
  useState
} = React;
/**
 * Select — liste déroulante native stylée. Même langage visuel
 * que Input. Pour les matrices, types de client, options.
 */
function Select({
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
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 7,
      ...style
    }
  }, label && /*#__PURE__*/React.createElement("label", {
    htmlFor: fieldId,
    style: {
      font: 'var(--weight-semibold) var(--text-caption)/1.2 var(--font-sans)',
      color: 'var(--text-body)',
      letterSpacing: '0.01em'
    }
  }, label), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
      background: disabled ? 'var(--surface-sunken)' : 'var(--surface-raised)',
      border: `1px solid ${error ? 'var(--negative-500)' : focused ? 'var(--horizon-400)' : 'var(--border-medium)'}`,
      borderRadius: 'var(--radius-md)',
      height: 48,
      boxShadow: focused ? `0 0 0 4px ${error ? 'var(--negative-100)' : 'var(--ring)'}` : 'var(--shadow-xs)',
      transition: 'border-color var(--dur-fast) var(--ease-soft), box-shadow var(--dur-fast) var(--ease-soft)'
    }
  }, /*#__PURE__*/React.createElement("select", _extends({
    id: fieldId,
    value: value,
    defaultValue: defaultValue,
    onChange: onChange,
    disabled: disabled,
    onFocus: () => setFocused(true),
    onBlur: () => setFocused(false),
    style: {
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
      borderRadius: 'var(--radius-md)'
    }
  }, rest), placeholder && /*#__PURE__*/React.createElement("option", {
    value: "",
    disabled: true
  }, placeholder), options.map(o => {
    const opt = typeof o === 'string' ? {
      value: o,
      label: o
    } : o;
    return /*#__PURE__*/React.createElement("option", {
      key: opt.value,
      value: opt.value
    }, opt.label);
  })), /*#__PURE__*/React.createElement("span", {
    "aria-hidden": true,
    style: {
      position: 'absolute',
      right: 14,
      color: 'var(--text-subtle)',
      pointerEvents: 'none',
      fontSize: 12
    }
  }, "\u25BE")), (hint || error) && /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--weight-regular) var(--text-caption)/1.4 var(--font-sans)',
      color: error ? 'var(--negative-600)' : 'var(--text-muted)'
    }
  }, error || hint));
}
Object.assign(__ds_scope, { Select });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Select.jsx", error: String((e && e.message) || e) }); }

// ui_kits/_shared/Icon.jsx
try { (() => {
/* NeoTravel — helper d'icône basé sur Lucide (chargé en UMD).
   Iconographie de marque : Lucide, trait fin (1.75), coins doux —
   en cohérence avec la signalétique calme des espaces de transit. */
const {
  useEffect,
  useRef
} = React;
function Icon({
  name,
  size = 20,
  color,
  strokeWidth = 1.75,
  style = {}
}) {
  const ref = useRef(null);
  useEffect(() => {
    const host = ref.current;
    if (!host || !window.lucide) return;
    host.innerHTML = '';
    const i = document.createElement('i');
    i.setAttribute('data-lucide', name);
    host.appendChild(i);
    try {
      window.lucide.createIcons({
        nameAttr: 'data-lucide',
        attrs: {
          'stroke-width': strokeWidth
        }
      });
    } catch (e) {/* noop */}
  }, [name, strokeWidth]);
  return /*#__PURE__*/React.createElement("span", {
    ref: ref,
    className: "nt-ico",
    style: {
      display: 'inline-flex',
      width: size,
      height: size,
      color: color || 'currentColor',
      flex: `0 0 ${size}px`,
      ...style
    }
  });
}
window.Icon = Icon;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/_shared/Icon.jsx", error: String((e && e.message) || e) }); }

// ui_kits/console/ConsoleShell.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/* NeoTravel — Console direction : ossature (rail latéral + barre supérieure) */
const {
  useState: useShellState
} = React;
function NavItem({
  icon,
  label,
  active,
  onClick,
  badge
}) {
  return /*#__PURE__*/React.createElement("button", {
    onClick: onClick,
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      width: '100%',
      padding: '11px 14px',
      borderRadius: 'var(--radius-md)',
      border: 'none',
      cursor: 'pointer',
      background: active ? 'rgba(255,255,255,0.08)' : 'transparent',
      color: active ? '#fff' : 'var(--text-on-dark-muted)',
      font: `var(--weight-${active ? 'semibold' : 'medium'}) 15px/1 var(--font-sans)`,
      textAlign: 'left',
      transition: 'background var(--dur-fast) var(--ease-soft), color var(--dur-fast) var(--ease-soft)',
      position: 'relative'
    },
    onMouseEnter: e => {
      if (!active) e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
    },
    onMouseLeave: e => {
      if (!active) e.currentTarget.style.background = 'transparent';
    }
  }, active && /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      left: -14,
      top: '50%',
      transform: 'translateY(-50%)',
      width: 3,
      height: 22,
      borderRadius: 3,
      background: 'var(--dawn-400)'
    }
  }), /*#__PURE__*/React.createElement(Icon, {
    name: icon,
    size: 19,
    color: active ? 'var(--dawn-400)' : 'currentColor'
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1
    }
  }, label), badge != null && /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--weight-bold) 11px/1 var(--font-mono)',
      background: 'var(--dawn-500)',
      color: 'var(--petrol-950)',
      padding: '3px 7px',
      borderRadius: 'var(--radius-pill)'
    }
  }, badge));
}
function ConsoleShell({
  view,
  setView,
  children
}) {
  const nav = [{
    id: 'pilotage',
    icon: 'gauge',
    label: 'Pilotage'
  }, {
    id: 'pipeline',
    icon: 'kanban',
    label: 'Pipeline leads'
  }, {
    id: 'relances',
    icon: 'bell',
    label: 'Relances',
    badge: 7
  }, {
    id: 'matrices',
    icon: 'sliders-horizontal',
    label: 'Matrices tarifaires'
  }];
  const titles = {
    pilotage: ['Pilotage', "Vue d'ensemble du flux commercial — temps réel"],
    pipeline: ['Pipeline leads', 'Toutes les demandes et leur statut'],
    relances: ['Relances', 'Relances planifiées et en attente'],
    matrices: ['Matrices tarifaires', 'Coefficients du moteur de devis — modifiables sans code']
  };
  const [t, sub] = titles[view] || titles.pilotage;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      minHeight: '100vh',
      background: 'var(--surface-page)'
    }
  }, /*#__PURE__*/React.createElement("aside", {
    style: {
      width: 248,
      flex: '0 0 248px',
      background: 'var(--gradient-dusk)',
      padding: '22px 18px',
      display: 'flex',
      flexDirection: 'column',
      position: 'sticky',
      top: 0,
      height: '100vh'
    },
    className: "nt-aside"
  }, /*#__PURE__*/React.createElement("a", {
    href: "../landing/index.html",
    style: {
      display: 'inline-block',
      marginBottom: 30
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: "../../assets/neotravel-logo-light.svg",
    alt: "NeoTravel",
    style: {
      height: 30
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--weight-semibold) 11px/1 var(--font-sans)',
      textTransform: 'uppercase',
      letterSpacing: 'var(--tracking-caps)',
      color: 'var(--horizon-300)',
      padding: '0 14px 12px'
    }
  }, "Direction"), /*#__PURE__*/React.createElement("nav", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 4
    }
  }, nav.map(n => /*#__PURE__*/React.createElement(NavItem, _extends({
    key: n.id
  }, n, {
    active: view === n.id,
    onClick: () => setView(n.id)
  })))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 'auto',
      display: 'flex',
      alignItems: 'center',
      gap: 11,
      padding: '12px 10px',
      borderTop: '1px solid var(--border-on-dark)'
    }
  }, /*#__PURE__*/React.createElement(Avatar, {
    name: "Julien Le Viavant",
    tone: "accent",
    size: 38
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--weight-semibold) 14px/1.2 var(--font-sans)',
      color: '#fff',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis'
    }
  }, "Julien Le Viavant"), /*#__PURE__*/React.createElement("div", {
    style: {
      font: '12px/1 var(--font-sans)',
      color: 'var(--text-on-dark-muted)'
    }
  }, "G\xE9rant")))), /*#__PURE__*/React.createElement("main", {
    style: {
      flex: 1,
      minWidth: 0,
      display: 'flex',
      flexDirection: 'column'
    }
  }, /*#__PURE__*/React.createElement("header", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '22px clamp(20px,3vw,40px)',
      borderBottom: '1px solid var(--border-soft)',
      background: 'rgba(251,247,242,0.8)',
      backdropFilter: 'blur(10px)',
      position: 'sticky',
      top: 0,
      zIndex: 20
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h1", {
    style: {
      font: 'var(--weight-medium) 28px/1.1 var(--font-display)',
      color: 'var(--text-strong)',
      margin: '0 0 3px'
    }
  }, t), /*#__PURE__*/React.createElement("p", {
    style: {
      font: '14px/1.3 var(--font-sans)',
      color: 'var(--text-muted)',
      margin: 0
    }
  }, sub)), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      padding: '8px 14px',
      background: 'var(--surface-card)',
      border: '1px solid var(--border-soft)',
      borderRadius: 'var(--radius-pill)',
      font: '13px/1 var(--font-sans)',
      color: 'var(--text-muted)'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "calendar",
    size: 15,
    color: "var(--text-subtle)"
  }), " 24 juin 2026"), /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    size: "sm",
    iconLeft: /*#__PURE__*/React.createElement(Icon, {
      name: "download",
      size: 15,
      color: "#fff"
    })
  }, "Exporter"))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 'clamp(20px,3vw,36px)',
      flex: 1
    }
  }, children)));
}
window.ConsoleShell = ConsoleShell;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/console/ConsoleShell.jsx", error: String((e && e.message) || e) }); }

// ui_kits/console/DashboardViews.jsx
try { (() => {
/* NeoTravel — Console : vues Pilotage, Pipeline, Relances */

const NT_LEADS = [{
  id: 'DV-0418',
  client: 'Lycée Camille Sée',
  type: 'Collectivité',
  trajet: 'Paris → Bordeaux',
  pax: 48,
  statut: 'devis_envoye',
  montant: '3 840 €',
  urgence: 'Normal',
  date: 'il y a 12 min'
}, {
  id: 'DV-0417',
  client: 'AS Montreuil Hand',
  type: 'Association',
  trajet: 'Montreuil → Lille',
  pax: 58,
  statut: 'accepte_prospect',
  montant: '4 210 €',
  urgence: 'Urgent',
  date: 'il y a 40 min'
}, {
  id: 'DV-0416',
  client: 'Cabinet Vallant',
  type: 'Entreprise',
  trajet: 'Lyon → Annecy',
  pax: 32,
  statut: 'relance_1',
  montant: '2 180 €',
  urgence: 'Normal',
  date: 'il y a 2 h'
}, {
  id: 'DV-0415',
  client: 'Mairie de Sèvres',
  type: 'Collectivité',
  trajet: 'Sèvres → Le Touquet',
  pax: 92,
  statut: 'complexe',
  montant: '—',
  urgence: 'Prioritaire',
  date: 'il y a 3 h'
}, {
  id: 'DV-0414',
  client: 'Famille Berthier',
  type: 'Particulier',
  trajet: 'Nantes → La Baule',
  pax: 14,
  statut: 'confirme',
  montant: '1 290 €',
  urgence: 'Normal',
  date: 'il y a 5 h'
}, {
  id: 'DV-0413',
  client: 'Séminaire NovaTech',
  type: 'Entreprise',
  trajet: 'Paris → Deauville',
  pax: 53,
  statut: 'relance_2',
  montant: '3 460 €',
  urgence: 'Normal',
  date: 'hier'
}, {
  id: 'DV-0412',
  client: 'Collège J. Ferry',
  type: 'Collectivité',
  trajet: 'Rennes → Saint-Malo',
  pax: 44,
  statut: 'refuse',
  montant: '1 020 €',
  urgence: 'Normal',
  date: 'hier'
}, {
  id: 'DV-0411',
  client: 'Amicale des Aînés',
  type: 'Association',
  trajet: 'Tours → Chambord',
  pax: 22,
  statut: 'incomplet',
  montant: '—',
  urgence: 'Normal',
  date: 'hier'
}];
function Th({
  children,
  style
}) {
  return /*#__PURE__*/React.createElement("th", {
    style: {
      textAlign: 'left',
      font: 'var(--weight-semibold) 11.5px/1 var(--font-sans)',
      textTransform: 'uppercase',
      letterSpacing: '0.08em',
      color: 'var(--text-subtle)',
      padding: '0 16px 12px',
      whiteSpace: 'nowrap',
      ...style
    }
  }, children);
}
function Td({
  children,
  style
}) {
  return /*#__PURE__*/React.createElement("td", {
    style: {
      padding: '15px 16px',
      font: '14.5px/1.3 var(--font-sans)',
      color: 'var(--text-body)',
      borderTop: '1px solid var(--border-soft)',
      ...style
    }
  }, children);
}
function LeadTable({
  rows
}) {
  return /*#__PURE__*/React.createElement(Card, {
    padding: "none",
    style: {
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      overflowX: 'auto'
    }
  }, /*#__PURE__*/React.createElement("table", {
    style: {
      width: '100%',
      borderCollapse: 'collapse',
      minWidth: 760
    }
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", {
    style: {
      background: 'var(--surface-sunken)'
    }
  }, /*#__PURE__*/React.createElement(Th, {
    style: {
      paddingTop: 14
    }
  }, "Devis"), /*#__PURE__*/React.createElement(Th, null, "Client"), /*#__PURE__*/React.createElement(Th, null, "Trajet"), /*#__PURE__*/React.createElement(Th, null, "Pax"), /*#__PURE__*/React.createElement(Th, null, "Statut"), /*#__PURE__*/React.createElement(Th, null, "Urgence"), /*#__PURE__*/React.createElement(Th, {
    style: {
      textAlign: 'right'
    }
  }, "Montant TTC"))), /*#__PURE__*/React.createElement("tbody", null, rows.map(r => /*#__PURE__*/React.createElement("tr", {
    key: r.id,
    style: {
      transition: 'background var(--dur-fast)'
    },
    onMouseEnter: e => e.currentTarget.style.background = 'var(--surface-sunken)',
    onMouseLeave: e => e.currentTarget.style.background = 'transparent'
  }, /*#__PURE__*/React.createElement(Td, {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 13,
      color: 'var(--text-muted)'
    }
  }, r.id), /*#__PURE__*/React.createElement(Td, null, /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--weight-semibold) 14.5px/1.2 var(--font-sans)',
      color: 'var(--text-strong)'
    }
  }, r.client), /*#__PURE__*/React.createElement("div", {
    style: {
      font: '12.5px/1 var(--font-sans)',
      color: 'var(--text-subtle)',
      marginTop: 3
    }
  }, r.type, " \xB7 ", r.date)), /*#__PURE__*/React.createElement(Td, {
    style: {
      whiteSpace: 'nowrap'
    }
  }, r.trajet), /*#__PURE__*/React.createElement(Td, {
    style: {
      fontFamily: 'var(--font-mono)'
    }
  }, r.pax), /*#__PURE__*/React.createElement(Td, null, /*#__PURE__*/React.createElement(StatusBadge, {
    status: r.statut
  })), /*#__PURE__*/React.createElement(Td, null, /*#__PURE__*/React.createElement("span", {
    style: {
      color: r.urgence === 'Prioritaire' ? 'var(--urgent-600)' : r.urgence === 'Urgent' ? 'var(--caution-600)' : 'var(--text-muted)',
      fontWeight: r.urgence === 'Normal' ? 400 : 600,
      fontSize: 13.5
    }
  }, r.urgence)), /*#__PURE__*/React.createElement(Td, {
    style: {
      textAlign: 'right',
      fontFamily: 'var(--font-mono)',
      fontWeight: 600,
      color: 'var(--text-strong)'
    }
  }, r.montant)))))));
}
function Pilotage() {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 28
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(4,1fr)',
      gap: 18
    },
    className: "nt-kpis"
  }, /*#__PURE__*/React.createElement(StatCard, {
    label: "Leads aujourd'hui",
    value: "62",
    accent: true,
    caption: "objectif 60 / jour",
    icon: /*#__PURE__*/React.createElement(Icon, {
      name: "inbox",
      size: 18,
      color: "var(--petrol-800)"
    })
  }), /*#__PURE__*/React.createElement(StatCard, {
    label: "Devis envoy\xE9s",
    value: "48",
    delta: "9 %",
    deltaDir: "up",
    caption: "cette semaine"
  }), /*#__PURE__*/React.createElement(StatCard, {
    label: "Taux de conversion",
    value: "34",
    unit: "%",
    delta: "6 pts",
    deltaDir: "up",
    caption: "vs. mois dernier"
  }), /*#__PURE__*/React.createElement(StatCard, {
    label: "D\xE9lai moy. \u2192 devis",
    value: "4,2",
    unit: "min",
    delta: "1,1 min",
    deltaDir: "down",
    caption: "plus rapide"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr 1fr',
      gap: 18
    },
    className: "nt-kpis"
  }, /*#__PURE__*/React.createElement(StatCard, {
    label: "Relances en attente",
    value: "7",
    caption: "J+2 / J+3 / J+7",
    icon: /*#__PURE__*/React.createElement(Icon, {
      name: "bell",
      size: 18,
      color: "var(--text-subtle)"
    })
  }), /*#__PURE__*/React.createElement(StatCard, {
    label: "Demandes urgentes",
    value: "3",
    caption: "< 48h",
    icon: /*#__PURE__*/React.createElement(Icon, {
      name: "zap",
      size: 18,
      color: "var(--text-subtle)"
    })
  }), /*#__PURE__*/React.createElement(StatCard, {
    label: "Cas complexes (HITL)",
    value: "2",
    caption: "\xE0 reprendre",
    icon: /*#__PURE__*/React.createElement(Icon, {
      name: "user-cog",
      size: 18,
      color: "var(--text-subtle)"
    })
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 14
    }
  }, /*#__PURE__*/React.createElement("h2", {
    style: {
      font: 'var(--weight-medium) 21px/1.2 var(--font-display)',
      color: 'var(--text-strong)',
      margin: 0
    }
  }, "Demandes r\xE9centes"), /*#__PURE__*/React.createElement(Button, {
    variant: "ghost",
    size: "sm",
    iconRight: /*#__PURE__*/React.createElement(Icon, {
      name: "arrow-right",
      size: 15
    })
  }, "Tout le pipeline")), /*#__PURE__*/React.createElement(LeadTable, {
    rows: NT_LEADS.slice(0, 5)
  })));
}
function Pipeline() {
  const [filter, setFilter] = React.useState('tous');
  const filters = [['tous', 'Tous'], ['devis_envoye', 'Devis envoyé'], ['relance_1', 'En relance'], ['complexe', 'Cas complexes'], ['confirme', 'Confirmés']];
  const rows = filter === 'tous' ? NT_LEADS : NT_LEADS.filter(r => r.statut === filter || filter === 'relance_1' && r.statut.startsWith('relance'));
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 18
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 8,
      flexWrap: 'wrap'
    }
  }, filters.map(([id, l]) => /*#__PURE__*/React.createElement("button", {
    key: id,
    onClick: () => setFilter(id),
    style: {
      font: `var(--weight-${filter === id ? 'semibold' : 'medium'}) 13.5px/1 var(--font-sans)`,
      padding: '9px 16px',
      borderRadius: 'var(--radius-pill)',
      cursor: 'pointer',
      background: filter === id ? 'var(--brand)' : 'var(--surface-card)',
      color: filter === id ? '#fff' : 'var(--text-body)',
      border: `1px solid ${filter === id ? 'transparent' : 'var(--border-medium)'}`
    }
  }, l))), /*#__PURE__*/React.createElement(LeadTable, {
    rows: rows
  }));
}
function Relances() {
  const data = [{
    client: 'Cabinet Vallant',
    devis: 'DV-0416',
    type: 'J+3',
    quand: "Aujourd'hui · 14:00",
    statut: 'relance_1'
  }, {
    client: 'Séminaire NovaTech',
    devis: 'DV-0413',
    type: 'J+7',
    quand: 'Demain · 10:00',
    statut: 'relance_2'
  }, {
    client: 'Collège Pasteur',
    devis: 'DV-0409',
    type: 'J+2',
    quand: 'Aujourd\'hui · 17:30',
    statut: 'devis_envoye'
  }];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1.5fr 1fr',
      gap: 20,
      alignItems: 'start'
    },
    className: "nt-proof-grid"
  }, /*#__PURE__*/React.createElement(Card, {
    padding: "none",
    style: {
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '18px 22px',
      borderBottom: '1px solid var(--border-soft)'
    }
  }, /*#__PURE__*/React.createElement("h2", {
    style: {
      font: 'var(--weight-medium) 19px/1.2 var(--font-display)',
      color: 'var(--text-strong)',
      margin: 0
    }
  }, "Relances planifi\xE9es")), data.map((d, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 14,
      padding: '16px 22px',
      borderTop: i ? '1px solid var(--border-soft)' : 'none'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 42,
      height: 42,
      borderRadius: 'var(--radius-sm)',
      background: 'var(--dawn-100)',
      color: 'var(--dawn-700)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      font: 'var(--weight-bold) 13px/1 var(--font-mono)',
      flex: '0 0 42px'
    }
  }, d.type), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--weight-semibold) 15px/1.2 var(--font-sans)',
      color: 'var(--text-strong)'
    }
  }, d.client), /*#__PURE__*/React.createElement("div", {
    style: {
      font: '13px/1 var(--font-sans)',
      color: 'var(--text-subtle)',
      marginTop: 3
    }
  }, d.devis, " \xB7 ", d.quand)), /*#__PURE__*/React.createElement(StatusBadge, {
    status: d.statut
  })))), /*#__PURE__*/React.createElement(Card, {
    variant: "sunken"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      marginBottom: 14
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "info",
    size: 18,
    color: "var(--brand)"
  }), /*#__PURE__*/React.createElement("h3", {
    style: {
      font: 'var(--weight-semibold) 16px/1.2 var(--font-sans)',
      color: 'var(--text-strong)',
      margin: 0
    }
  }, "R\xE8gles de relance")), /*#__PURE__*/React.createElement("ul", {
    style: {
      margin: 0,
      padding: 0,
      listStyle: 'none',
      display: 'flex',
      flexDirection: 'column',
      gap: 12,
      font: '14px/1.5 var(--font-sans)',
      color: 'var(--text-body)'
    }
  }, /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("strong", null, "Urgent"), " \u2014 J+2, puis J+5"), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("strong", null, "Standard"), " \u2014 J+3, puis J+7"), /*#__PURE__*/React.createElement("li", {
    style: {
      color: 'var(--text-muted)'
    }
  }, "Max 2 relances. Au-del\xE0 : cl\xF4ture \u2014 la persistance excessive nuit \xE0 l'image de NeoTravel."))));
}
window.Pilotage = Pilotage;
window.Pipeline = Pipeline;
window.Relances = Relances;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/console/DashboardViews.jsx", error: String((e && e.message) || e) }); }

// ui_kits/console/MatricesView.jsx
try { (() => {
/* NeoTravel — Console : admin des matrices tarifaires (moteur calculer_devis) */
const {
  useState: useMatState
} = React;
const NT_MATRICES = [{
  key: 'saison',
  icon: 'sun-snow',
  titre: 'Saisonnalité',
  desc: 'Coefficient appliqué selon le mois de départ',
  cols: ['Niveau', 'Mois', 'Coefficient'],
  rows: [['Basse', 'Nov · Jan · Fév · Août', '-7 %'], ['Moyenne', 'Déc · Oct · Sep', '0 %'], ['Haute', 'Mars · Avr · Juil', '+10 %'], ['Très haute', 'Mai · Juin', '+15 %']]
}, {
  key: 'urgence',
  icon: 'timer',
  titre: 'Urgence',
  desc: 'Écart entre date de demande et date de départ',
  cols: ['Code', 'Écart', 'Coefficient'],
  rows: [['DD_PRIORITAIRE', '< 48 h', '+10 %'], ['DD_URGENT', '2 à 7 jours', '+5 %'], ['DD_NORMAL', '7 j à 3 mois', '-5 %'], ['DD_3MOISETPLUS', '> 3 mois', '-10 %']]
}, {
  key: 'capacite',
  icon: 'users',
  titre: 'Capacité',
  desc: 'Coefficient selon le nombre de passagers',
  cols: ['Passagers', 'Tranche', 'Coefficient'],
  rows: [['≤ 19', 'Minibus / petit groupe', '-5 %'], ['20 – 53', 'Autocar standard', '0 %'], ['54 – 63', 'Grande capacité', '+15 %'], ['64 – 67', 'Très grande capacité', '+20 %'], ['68 – 85', 'Multi-configuration', '+40 %']]
}, {
  key: 'options',
  icon: 'plus-circle',
  titre: 'Suppléments & options',
  desc: 'Montants fixes ajoutés ligne par ligne',
  cols: ['Option', 'Base', 'Tarif'],
  rows: [['Guide / accompagnateur', 'par jour', '+80 €'], ['Nuit chauffeur', 'par nuit', '+120 €'], ['Péages inclus', 'forfait trajet', 'variable'], ['TVA', 'sur HT', '10 %'], ['Marge commerciale', 'avant envoi', '+15 %']]
}];
function MatrixCard({
  m,
  editing,
  onEdit,
  onSave
}) {
  return /*#__PURE__*/React.createElement(Card, {
    padding: "none",
    style: {
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 13,
      padding: '18px 22px',
      borderBottom: '1px solid var(--border-soft)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 40,
      height: 40,
      borderRadius: 'var(--radius-sm)',
      background: 'var(--surface-brand-soft)',
      color: 'var(--brand)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flex: '0 0 40px'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: m.icon,
    size: 20
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("h3", {
    style: {
      font: 'var(--weight-semibold) 17px/1.2 var(--font-sans)',
      color: 'var(--text-strong)',
      margin: 0
    }
  }, m.titre), /*#__PURE__*/React.createElement("p", {
    style: {
      font: '13px/1.3 var(--font-sans)',
      color: 'var(--text-muted)',
      margin: '3px 0 0'
    }
  }, m.desc)), /*#__PURE__*/React.createElement(Button, {
    variant: editing ? 'primary' : 'secondary',
    size: "sm",
    iconLeft: /*#__PURE__*/React.createElement(Icon, {
      name: editing ? 'check' : 'pencil',
      size: 14,
      color: editing ? '#fff' : 'var(--brand)'
    }),
    onClick: editing ? onSave : onEdit
  }, editing ? 'Enregistrer' : 'Modifier')), /*#__PURE__*/React.createElement("table", {
    style: {
      width: '100%',
      borderCollapse: 'collapse'
    }
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", {
    style: {
      background: 'var(--surface-sunken)'
    }
  }, m.cols.map((c, i) => /*#__PURE__*/React.createElement("th", {
    key: c,
    style: {
      textAlign: i === m.cols.length - 1 ? 'right' : 'left',
      font: 'var(--weight-semibold) 11px/1 var(--font-sans)',
      textTransform: 'uppercase',
      letterSpacing: '0.07em',
      color: 'var(--text-subtle)',
      padding: '11px 22px'
    }
  }, c)))), /*#__PURE__*/React.createElement("tbody", null, m.rows.map((r, ri) => /*#__PURE__*/React.createElement("tr", {
    key: ri
  }, r.map((cell, ci) => {
    const last = ci === r.length - 1;
    return /*#__PURE__*/React.createElement("td", {
      key: ci,
      style: {
        padding: last ? '11px 22px' : '11px 22px',
        borderTop: '1px solid var(--border-soft)',
        textAlign: last ? 'right' : 'left',
        font: `${ci === 0 ? 'var(--weight-semibold)' : 'var(--weight-regular)'} 14px/1.3 var(--font-sans)`,
        color: ci === 0 ? 'var(--text-strong)' : 'var(--text-body)',
        fontFamily: last || ci === 0 && m.key === 'urgence' ? 'var(--font-mono)' : 'var(--font-sans)'
      }
    }, last && editing ? /*#__PURE__*/React.createElement("input", {
      defaultValue: cell,
      style: {
        width: 92,
        textAlign: 'right',
        border: '1px solid var(--horizon-400)',
        borderRadius: 'var(--radius-xs)',
        padding: '6px 10px',
        font: 'var(--weight-semibold) 13px/1 var(--font-mono)',
        color: 'var(--brand)',
        background: 'var(--horizon-50)',
        outline: 'none'
      }
    }) : /*#__PURE__*/React.createElement("span", {
      style: {
        color: last ? String(cell).startsWith('-') ? 'var(--positive-600)' : String(cell).startsWith('+') ? 'var(--dawn-700)' : 'var(--text-strong)' : 'inherit',
        fontWeight: last ? 600 : undefined
      }
    }, cell));
  }))))));
}
function Matrices() {
  const [editing, setEditing] = useMatState(null);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 20
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'flex-start',
      gap: 12,
      padding: '16px 20px',
      background: 'var(--surface-brand-soft)',
      border: '1px solid var(--border-brand)',
      borderRadius: 'var(--radius-md)'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "shield-check",
    size: 20,
    color: "var(--brand)",
    style: {
      marginTop: 2
    }
  }), /*#__PURE__*/React.createElement("p", {
    style: {
      font: '14.5px/1.55 var(--font-sans)',
      color: 'var(--petrol-800)',
      margin: 0
    }
  }, "Ces coefficients alimentent ", /*#__PURE__*/React.createElement("strong", null, "calculer_devis()"), " \u2014 un moteur d\xE9terministe, jamais le mod\xE8le IA. Toute modification s'applique aux nouveaux devis et reste trac\xE9e. Deux demandes identiques produiront toujours le m\xEAme prix.")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 20
    },
    className: "nt-mat-grid"
  }, NT_MATRICES.map(m => /*#__PURE__*/React.createElement(MatrixCard, {
    key: m.key,
    m: m,
    editing: editing === m.key,
    onEdit: () => setEditing(m.key),
    onSave: () => setEditing(null)
  }))));
}
window.Matrices = Matrices;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/console/MatricesView.jsx", error: String((e && e.message) || e) }); }

// ui_kits/landing/HeroChat.jsx
try { (() => {
/* NeoTravel — Landing : héros conversationnel (la landing EST le chat) */
const {
  useState: useHS,
  useRef: useHRef,
  useEffect: useHEffect
} = React;

// Script de démonstration — fondé sur le flow conversationnel réel (jour-2)
const NT_SCRIPT = [{
  user: "Sortie scolaire — 48 élèves, Paris → Bordeaux le 14 juillet, retour le 16.",
  agent: "Parfait, je récapitule : 48 passagers, Paris → Bordeaux, départ le 14 juillet, retour le 16. Souhaitez-vous un accompagnateur à bord ?",
  chips: ["Oui, avec un guide", "Non merci"]
}, {
  user: "Oui, avec un guide.",
  agent: "Noté. Pour vous envoyer le devis détaillé, j'ai besoin de votre email et d'un numéro de téléphone.",
  chips: ["marie.dupont@ecole.fr · 06 12 34 56 78"]
}, {
  user: "marie.dupont@ecole.fr · 06 12 34 56 78",
  agent: "Votre devis est prêt. Je viens de l'envoyer par email — notre équipe reste disponible pour tout ajustement.",
  quote: true
}];
function QuoteCard() {
  const lines = [['Trajet aller-retour · 1 040 km', '2 980 €'], ['Coefficient saison (haute, juillet)', '+10 %'], ['Accompagnateur (3 j)', '+240 €']];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 8,
      background: 'var(--surface-card)',
      border: '1px solid var(--border-soft)',
      borderRadius: 'var(--radius-md)',
      boxShadow: 'var(--shadow-sm)',
      overflow: 'hidden',
      maxWidth: 380
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 9,
      padding: '12px 16px',
      borderBottom: '1px solid var(--border-soft)',
      background: 'var(--surface-sunken)'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "file-text",
    size: 17,
    color: "var(--brand)"
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--weight-semibold) 14px/1 var(--font-sans)',
      color: 'var(--text-strong)'
    }
  }, "Devis NeoTravel \u2014 DV-2026-0418")), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '6px 16px'
    }
  }, lines.map(([l, v]) => /*#__PURE__*/React.createElement("div", {
    key: l,
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      gap: 16,
      padding: '8px 0',
      borderBottom: '1px dashed var(--border-soft)',
      font: '13.5px/1.3 var(--font-sans)',
      color: 'var(--text-body)'
    }
  }, /*#__PURE__*/React.createElement("span", null, l), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-mono)',
      color: 'var(--text-muted)'
    }
  }, v))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'baseline',
      padding: '12px 0 14px'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--weight-semibold) 14px/1 var(--font-sans)',
      color: 'var(--text-strong)'
    }
  }, "Total TTC ", /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--text-subtle)',
      fontWeight: 400
    }
  }, "(TVA 10 %)")), /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--weight-medium) 26px/1 var(--font-display)',
      color: 'var(--brand)',
      fontVariantNumeric: 'tabular-nums'
    }
  }, "3 840 \u20AC"))));
}
function HeroChat({
  onReachQuote
}) {
  const [messages, setMessages] = useHS([{
    from: 'agent',
    text: "Bonjour ! Décrivez-moi votre besoin de transport et je vous prépare un devis en quelques minutes."
  }]);
  const [step, setStep] = useHS(0);
  const [typing, setTyping] = useHS(false);
  const [input, setInput] = useHS('');
  const [showQuote, setShowQuote] = useHS(false);
  const scrollRef = useHRef(null);
  const startChips = ['Sortie scolaire', 'Séminaire', 'Événement', 'Autre'];
  useHEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, typing, showQuote]);
  function advance(userText) {
    if (step >= NT_SCRIPT.length || typing) return;
    const turn = NT_SCRIPT[step];
    const said = userText || turn.user;
    setMessages(m => [...m, {
      from: 'user',
      text: said
    }]);
    setInput('');
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      setMessages(m => [...m, {
        from: 'agent',
        text: turn.agent
      }]);
      if (turn.quote) {
        setShowQuote(true);
        onReachQuote && onReachQuote();
      }
      setStep(s => s + 1);
    }, 1300);
  }
  const currentChips = step === 0 ? startChips : NT_SCRIPT[step] && !typing ? NT_SCRIPT[step].chips : null;
  const done = step >= NT_SCRIPT.length;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'rgba(254,252,249,0.74)',
      backdropFilter: 'blur(var(--blur-lg)) saturate(1.3)',
      WebkitBackdropFilter: 'blur(var(--blur-lg)) saturate(1.3)',
      border: '1px solid rgba(255,255,255,0.7)',
      borderRadius: 'var(--radius-2xl)',
      boxShadow: 'var(--shadow-xl)',
      padding: 14,
      width: '100%',
      maxWidth: 600,
      display: 'flex',
      flexDirection: 'column'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 11,
      padding: '8px 10px 14px'
    }
  }, /*#__PURE__*/React.createElement(Avatar, {
    name: "N",
    tone: "accent",
    size: 38,
    icon: /*#__PURE__*/React.createElement(Icon, {
      name: "sparkles",
      size: 18,
      color: "#fff"
    })
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--weight-semibold) 15px/1.2 var(--font-sans)',
      color: 'var(--text-strong)'
    }
  }, "Assistant NeoTravel"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      font: '12.5px/1 var(--font-sans)',
      color: 'var(--positive-600)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 7,
      height: 7,
      borderRadius: '50%',
      background: 'var(--positive-500)'
    }
  }), " En ligne \xB7 r\xE9ponse imm\xE9diate"))), /*#__PURE__*/React.createElement("div", {
    ref: scrollRef,
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 12,
      padding: '4px 8px',
      maxHeight: 330,
      minHeight: 230,
      overflowY: 'auto'
    }
  }, messages.map((m, i) => /*#__PURE__*/React.createElement(ChatBubble, {
    key: i,
    from: m.from
  }, m.text)), showQuote && /*#__PURE__*/React.createElement("div", {
    style: {
      alignSelf: 'flex-start'
    }
  }, /*#__PURE__*/React.createElement(QuoteCard, null)), typing && /*#__PURE__*/React.createElement(ChatBubble, {
    from: "agent",
    typing: true
  }), currentChips && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 8,
      flexWrap: 'wrap',
      marginTop: 2
    }
  }, currentChips.map(c => /*#__PURE__*/React.createElement(SuggestionChip, {
    key: c,
    onClick: () => advance(step === 0 ? null : c)
  }, c)))), /*#__PURE__*/React.createElement("form", {
    onSubmit: e => {
      e.preventDefault();
      if (!done) advance(input.trim() || null);
    },
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      marginTop: 12,
      padding: 6,
      background: 'var(--surface-raised)',
      border: '1px solid var(--border-medium)',
      borderRadius: 'var(--radius-pill)',
      boxShadow: 'var(--shadow-xs)'
    }
  }, /*#__PURE__*/React.createElement("input", {
    value: input,
    onChange: e => setInput(e.target.value),
    disabled: done,
    placeholder: done ? 'Devis envoyé — merci !' : 'Écrivez votre besoin…',
    style: {
      flex: 1,
      border: 'none',
      outline: 'none',
      background: 'transparent',
      font: '15px/1.4 var(--font-sans)',
      color: 'var(--text-strong)',
      padding: '8px 12px'
    }
  }), /*#__PURE__*/React.createElement("button", {
    type: "submit",
    disabled: done,
    "aria-label": "Envoyer",
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: 42,
      height: 42,
      borderRadius: '50%',
      border: 'none',
      background: done ? 'var(--stone-300)' : 'var(--brand)',
      color: '#fff',
      cursor: done ? 'default' : 'pointer',
      flex: '0 0 42px',
      transition: 'background var(--dur-base) var(--ease-soft)'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: done ? 'check' : 'arrow-up',
    size: 19,
    color: "#fff"
  }))));
}
window.HeroChat = HeroChat;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/landing/HeroChat.jsx", error: String((e && e.message) || e) }); }

// ui_kits/landing/LandingChrome.jsx
try { (() => {
/* NeoTravel — Landing : en-tête & pied de page */
const {
  useState: useStateChrome
} = React;
function LandingHeader({
  onCTA
}) {
  return /*#__PURE__*/React.createElement("header", {
    style: {
      position: 'sticky',
      top: 0,
      zIndex: 50,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '15px clamp(20px, 5vw, 56px)',
      background: 'rgba(14,42,56,0.55)',
      backdropFilter: 'blur(var(--blur-md)) saturate(1.2)',
      WebkitBackdropFilter: 'blur(var(--blur-md)) saturate(1.2)',
      borderBottom: '1px solid var(--border-on-dark)'
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: "../../assets/neotravel-logo-light.svg",
    alt: "NeoTravel",
    style: {
      height: 32
    }
  }), /*#__PURE__*/React.createElement("nav", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 'clamp(14px,2.4vw,30px)'
    }
  }, ['Notre métier', 'Comment ça marche', 'Nos garanties'].map(l => /*#__PURE__*/React.createElement("a", {
    key: l,
    href: "#",
    onClick: e => e.preventDefault(),
    style: {
      font: 'var(--weight-medium) 15px/1 var(--font-sans)',
      color: 'var(--text-on-dark-muted)',
      textDecoration: 'none',
      display: 'none'
    },
    className: "nt-navlink"
  }, l)), /*#__PURE__*/React.createElement("a", {
    href: "../console/index.html",
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 7,
      font: 'var(--weight-semibold) 14px/1 var(--font-sans)',
      color: 'var(--horizon-200)',
      textDecoration: 'none',
      padding: '8px 14px',
      borderRadius: 'var(--radius-pill)',
      border: '1px solid var(--border-on-dark)'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "layout-dashboard",
    size: 16,
    color: "var(--horizon-300)"
  }), " Espace direction"), /*#__PURE__*/React.createElement(Button, {
    variant: "accent",
    size: "sm",
    onClick: onCTA
  }, "Demander un devis")), /*#__PURE__*/React.createElement("style", null, `@media(min-width:980px){.nt-navlink{display:inline-flex !important}.nt-navlink:hover{color:#fff !important}}`));
}
function LandingFooter() {
  const cols = [{
    h: 'NeoTravel',
    items: ['Notre métier', "L'intermédiation", 'Mot du président', 'Depuis 2010']
  }, {
    h: 'Transports',
    items: ['Sorties scolaires', 'Séminaires', 'Événements', 'Tourisme de groupe']
  }, {
    h: 'Ressources',
    items: ['Questions fréquentes', 'Nous contacter', 'Espace direction']
  }];
  return /*#__PURE__*/React.createElement("footer", {
    style: {
      background: 'var(--gradient-dusk)',
      color: 'var(--text-on-dark)',
      padding: 'clamp(48px,7vw,80px) clamp(20px,5vw,56px) 36px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 'var(--content-max)',
      margin: '0 auto',
      display: 'grid',
      gridTemplateColumns: '1.4fr 1fr 1fr 1fr',
      gap: 40
    },
    className: "nt-foot-grid"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("img", {
    src: "../../assets/neotravel-logo-light.svg",
    alt: "NeoTravel",
    style: {
      height: 34,
      marginBottom: 18
    }
  }), /*#__PURE__*/React.createElement("p", {
    style: {
      font: 'var(--weight-regular) 15px/1.6 var(--font-sans)',
      color: 'var(--text-on-dark-muted)',
      maxWidth: 280,
      margin: 0
    }
  }, "Transport de personnes en groupe. Nous qualifions, nous mobilisons le bon partenaire, nous s\xE9curisons \u2014 de bout en bout.")), cols.map(c => /*#__PURE__*/React.createElement("div", {
    key: c.h
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--weight-semibold) 12px/1 var(--font-sans)',
      textTransform: 'uppercase',
      letterSpacing: 'var(--tracking-caps)',
      color: 'var(--horizon-300)',
      marginBottom: 16
    }
  }, c.h), /*#__PURE__*/React.createElement("ul", {
    style: {
      listStyle: 'none',
      padding: 0,
      margin: 0,
      display: 'flex',
      flexDirection: 'column',
      gap: 11
    }
  }, c.items.map(it => /*#__PURE__*/React.createElement("li", {
    key: it
  }, /*#__PURE__*/React.createElement("a", {
    href: "#",
    onClick: e => e.preventDefault(),
    style: {
      font: 'var(--weight-regular) 14.5px/1 var(--font-sans)',
      color: 'var(--text-on-dark-muted)',
      textDecoration: 'none'
    }
  }, it))))))), /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 'var(--content-max)',
      margin: '40px auto 0',
      paddingTop: 24,
      borderTop: '1px solid var(--border-on-dark)',
      display: 'flex',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      gap: 12,
      font: 'var(--weight-regular) 13px/1 var(--font-sans)',
      color: 'var(--text-on-dark-muted)'
    }
  }, /*#__PURE__*/React.createElement("span", null, "\xA9 2010\u20132026 NeoTravel \u2014 Plateforme d'interm\xE9diation transport de groupe"), /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      gap: 20
    }
  }, /*#__PURE__*/React.createElement("a", {
    href: "#",
    onClick: e => e.preventDefault(),
    style: {
      color: 'inherit',
      textDecoration: 'none'
    }
  }, "Mentions l\xE9gales"), /*#__PURE__*/React.createElement("a", {
    href: "#",
    onClick: e => e.preventDefault(),
    style: {
      color: 'inherit',
      textDecoration: 'none'
    }
  }, "Confidentialit\xE9"))), /*#__PURE__*/React.createElement("style", null, `@media(max-width:860px){.nt-foot-grid{grid-template-columns:1fr 1fr !important}}`));
}
window.LandingHeader = LandingHeader;
window.LandingFooter = LandingFooter;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/landing/LandingChrome.jsx", error: String((e && e.message) || e) }); }

// ui_kits/landing/Narrative.jsx
try { (() => {
/* NeoTravel — Landing : narration en page unique
   Promesse → montée en confiance (preuve du savoir-faire) → arrivée sur le CTA unique */

function Hero({
  onCTA
}) {
  return /*#__PURE__*/React.createElement("section", {
    style: {
      position: 'relative',
      overflow: 'hidden',
      background: 'var(--gradient-dusk)',
      padding: 'clamp(118px,15vh,176px) clamp(20px,5vw,56px) clamp(72px,9vw,120px)',
      textAlign: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", {
    "aria-hidden": true,
    className: "nt-arc"
  }), /*#__PURE__*/React.createElement("div", {
    "aria-hidden": true,
    className: "nt-bloom"
  }), /*#__PURE__*/React.createElement("div", {
    "aria-hidden": true,
    className: "nt-beam"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      maxWidth: 880,
      margin: '0 auto',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 8,
      padding: '7px 15px',
      borderRadius: 'var(--radius-pill)',
      background: 'rgba(255,255,255,0.06)',
      border: '1px solid var(--border-on-dark)',
      marginBottom: 28,
      backdropFilter: 'blur(6px)'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "shield-check",
    size: 15,
    color: "var(--dawn-400)"
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--weight-semibold) 12.5px/1 var(--font-sans)',
      letterSpacing: '0.03em',
      color: 'var(--horizon-200)'
    }
  }, "Interm\xE9diaire transport de groupe \xB7 depuis 2010")), /*#__PURE__*/React.createElement("h1", {
    style: {
      font: 'var(--weight-medium) clamp(40px,6vw,76px)/1.04 var(--font-display)',
      letterSpacing: 'var(--tracking-tight)',
      color: '#fff',
      margin: '0 0 22px',
      textWrap: 'balance'
    }
  }, "Vous voyagez en groupe.", /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--dawn-400)',
      fontStyle: 'italic',
      fontWeight: 400
    }
  }, "On s'occupe de tout.")), /*#__PURE__*/React.createElement("p", {
    style: {
      font: 'var(--weight-regular) clamp(17px,1.6vw,21px)/1.6 var(--font-sans)',
      color: 'var(--text-on-dark-muted)',
      maxWidth: 560,
      margin: '0 0 36px'
    }
  }, "D\xE9crivez votre trajet en quelques mots. On qualifie le besoin, on mobilise le bon autocariste, on n\xE9gocie les conditions \u2014 et votre devis arrive en quelques minutes."), /*#__PURE__*/React.createElement("div", {
    style: {
      width: '100%',
      maxWidth: 620,
      display: 'flex',
      justifyContent: 'center'
    }
  }, /*#__PURE__*/React.createElement(HeroChat, {
    onReachQuote: () => {}
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 18,
      flexWrap: 'wrap',
      justifyContent: 'center',
      marginTop: 26,
      font: '14px/1.4 var(--font-sans)',
      color: 'var(--text-on-dark-muted)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "clock",
    size: 16,
    color: "var(--horizon-300)"
  }), " R\xE9ponse en moins de 5 minutes"), /*#__PURE__*/React.createElement("span", {
    style: {
      width: 4,
      height: 4,
      borderRadius: '50%',
      background: 'var(--horizon-400)'
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "check",
    size: 16,
    color: "var(--horizon-300)"
  }), " Sans engagement"))), /*#__PURE__*/React.createElement("style", null, `
        .nt-arc{position:absolute;left:50%;top:64px;width:min(2200px,210vw);height:min(2200px,210vw);transform:translateX(-50%);border-radius:50%;border:1.5px solid rgba(246,184,132,0.5);background:radial-gradient(50% 50% at 50% 50%, rgba(46,99,120,0.22), transparent 66%);box-shadow:0 0 90px 8px rgba(240,160,98,0.20), inset 0 0 160px rgba(94,155,176,0.12);pointer-events:none}
        .nt-bloom{position:absolute;left:50%;top:8px;width:min(640px,90vw);height:340px;transform:translateX(-50%);background:radial-gradient(50% 60% at 50% 45%, rgba(250,208,172,0.55), rgba(240,160,98,0.22) 38%, transparent 72%);filter:blur(26px);pointer-events:none;animation:nt-pulse 7s var(--ease-soft) infinite alternate}
        .nt-beam{position:absolute;left:50%;top:0;width:2px;height:96px;transform:translateX(-50%);background:linear-gradient(to top, rgba(250,208,172,0.8), transparent);filter:blur(0.5px);pointer-events:none}
        @keyframes nt-pulse{from{opacity:.7;transform:translateX(-50%) scale(1)}to{opacity:1;transform:translateX(-50%) scale(1.07)}}
        @media (prefers-reduced-motion:reduce){.nt-bloom{animation:none}}
      `));
}
function HowItWorks() {
  const steps = [{
    ic: 'message-circle',
    t: 'On qualifie',
    d: "Vous décrivez votre besoin en langage naturel. On clarifie chaque détail — trajet, dates, passagers, options — sans formulaire interminable."
  }, {
    ic: 'route',
    t: 'On mobilise',
    d: "On identifie le bon partenaire autocariste dans notre réseau, on vérifie sa disponibilité et on négocie les meilleures conditions pour vous."
  }, {
    ic: 'shield-check',
    t: 'On sécurise',
    d: "On verrouille la prestation de bout en bout : conditions, logistique, imprévus. Vous n'avez plus qu'à monter à bord."
  }];
  return /*#__PURE__*/React.createElement("section", {
    style: {
      background: 'var(--surface-page)',
      padding: 'clamp(64px,8vw,110px) clamp(20px,5vw,56px)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 'var(--content-max)',
      margin: '0 auto'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: 'center',
      maxWidth: 680,
      margin: '0 auto 56px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "nt-eyebrow",
    style: {
      marginBottom: 14
    }
  }, "Un travail d'orchestration invisible"), /*#__PURE__*/React.createElement("h2", {
    style: {
      font: 'var(--weight-medium) clamp(30px,3.6vw,46px)/1.1 var(--font-display)',
      letterSpacing: 'var(--tracking-snug)',
      color: 'var(--text-strong)',
      margin: '0 0 16px',
      textWrap: 'balance'
    }
  }, "La complexit\xE9, absorb\xE9e en coulisses"), /*#__PURE__*/React.createElement("p", {
    style: {
      font: '18px/1.6 var(--font-sans)',
      color: 'var(--text-muted)',
      margin: 0
    }
  }, "Nous ne poss\xE9dons pas de flotte. Notre valeur, c'est de transformer une demande en une prestation fiable \u2014 en trois temps, sans accroc.")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3,1fr)',
      gap: 24
    },
    className: "nt-steps"
  }, steps.map((s, i) => /*#__PURE__*/React.createElement(Card, {
    key: s.t,
    interactive: true,
    style: {
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: 56,
      height: 56,
      borderRadius: 'var(--radius-md)',
      background: 'var(--gradient-sunrise)',
      marginBottom: 22,
      boxShadow: 'var(--shadow-glow)'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: s.ic,
    size: 26,
    color: "var(--petrol-900)",
    strokeWidth: 1.6
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--weight-bold) 13px/1 var(--font-mono)',
      color: 'var(--accent-hover)',
      marginBottom: 10
    }
  }, "0", i + 1), /*#__PURE__*/React.createElement("h3", {
    style: {
      font: 'var(--weight-semibold) 22px/1.2 var(--font-display)',
      color: 'var(--text-strong)',
      margin: '0 0 12px'
    }
  }, s.t), /*#__PURE__*/React.createElement("p", {
    style: {
      font: '15.5px/1.62 var(--font-sans)',
      color: 'var(--text-muted)',
      margin: 0
    }
  }, s.d))))), /*#__PURE__*/React.createElement("style", null, `@media(max-width:860px){.nt-steps{grid-template-columns:1fr !important}}`));
}
function Proof() {
  const stats = [['16 ans', "d'expertise de l'intermédiation"], ['Couverture', 'nationale & internationale'], ['Réseau', 'de partenaires autocaristes vérifiés']];
  const values = [['heart-handshake', 'Conseil humain', "Pour les cas complexes, un conseiller reprend la main — avec tout le contexte."], ['gauge', 'Réactivité', "Le flux ne sature plus : chaque demande est traitée, aucune opportunité perdue."], ['eye', 'Transparence', "Des règles de prix claires et auditables. Deux demandes identiques, le même devis."]];
  return /*#__PURE__*/React.createElement("section", {
    style: {
      position: 'relative',
      overflow: 'hidden',
      background: 'var(--gradient-dusk)',
      color: 'var(--text-on-dark)',
      padding: 'clamp(64px,8vw,110px) clamp(20px,5vw,56px)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    "aria-hidden": true,
    style: {
      position: 'absolute',
      inset: 'auto -10% -40% 30%',
      height: '70%',
      background: 'var(--gradient-sunrise)',
      opacity: 0.18,
      filter: 'blur(60px)',
      pointerEvents: 'none'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      maxWidth: 'var(--content-max)',
      margin: '0 auto'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 'clamp(32px,5vw,72px)',
      alignItems: 'center',
      marginBottom: 64
    },
    className: "nt-proof-grid"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "nt-eyebrow",
    style: {
      color: 'var(--horizon-300)',
      marginBottom: 14
    }
  }, "Digitaliser sans d\xE9shumaniser"), /*#__PURE__*/React.createElement("h2", {
    style: {
      font: 'var(--weight-medium) clamp(30px,3.6vw,46px)/1.1 var(--font-display)',
      letterSpacing: 'var(--tracking-snug)',
      color: '#fff',
      margin: '0 0 18px',
      textWrap: 'balance'
    }
  }, "La confiance tranquille d'un groupe entre de bonnes mains"), /*#__PURE__*/React.createElement("p", {
    style: {
      font: '18px/1.65 var(--font-sans)',
      color: 'var(--text-on-dark-muted)',
      margin: 0
    }
  }, "Notre m\xE9tier n'est pas de vendre un trajet. C'est de comprendre un besoin, s\xE9curiser une solution et coordonner des partenaires fiables \u2014 pour une exp\xE9rience simple, claire et rassurante.")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 16
    }
  }, stats.map(([n, l]) => /*#__PURE__*/React.createElement("div", {
    key: l,
    style: {
      display: 'flex',
      alignItems: 'baseline',
      gap: 18,
      padding: '16px 0',
      borderBottom: '1px solid var(--border-on-dark)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--weight-medium) clamp(26px,3vw,34px)/1 var(--font-display)',
      color: 'var(--dawn-400)',
      minWidth: 150
    }
  }, n), /*#__PURE__*/React.createElement("span", {
    style: {
      font: '16px/1.4 var(--font-sans)',
      color: 'var(--text-on-dark)'
    }
  }, l))))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3,1fr)',
      gap: 20
    },
    className: "nt-values"
  }, values.map(([ic, t, d]) => /*#__PURE__*/React.createElement("div", {
    key: t,
    style: {
      background: 'rgba(255,255,255,0.04)',
      border: '1px solid var(--border-on-dark)',
      borderRadius: 'var(--radius-lg)',
      padding: 'var(--space-6)'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: ic,
    size: 24,
    color: "var(--horizon-300)"
  }), /*#__PURE__*/React.createElement("h3", {
    style: {
      font: 'var(--weight-semibold) 19px/1.2 var(--font-sans)',
      color: '#fff',
      margin: '16px 0 8px'
    }
  }, t), /*#__PURE__*/React.createElement("p", {
    style: {
      font: '14.5px/1.6 var(--font-sans)',
      color: 'var(--text-on-dark-muted)',
      margin: 0
    }
  }, d))))), /*#__PURE__*/React.createElement("style", null, `@media(max-width:860px){.nt-proof-grid,.nt-values{grid-template-columns:1fr !important}}`));
}
function FinalCTA({
  onCTA
}) {
  return /*#__PURE__*/React.createElement("section", {
    style: {
      position: 'relative',
      overflow: 'hidden',
      background: 'var(--gradient-sunrise)',
      padding: 'clamp(72px,9vw,128px) clamp(20px,5vw,56px)',
      textAlign: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      maxWidth: 720,
      margin: '0 auto'
    }
  }, /*#__PURE__*/React.createElement("h2", {
    style: {
      font: 'var(--weight-medium) clamp(34px,4.6vw,60px)/1.06 var(--font-display)',
      letterSpacing: 'var(--tracking-tight)',
      color: 'var(--petrol-950)',
      margin: '0 0 20px',
      textWrap: 'balance'
    }
  }, "Pr\xEAt \xE0 confier votre trajet ?"), /*#__PURE__*/React.createElement("p", {
    style: {
      font: '19px/1.6 var(--font-sans)',
      color: 'var(--petrol-800)',
      margin: '0 0 36px',
      maxWidth: 520,
      marginLeft: 'auto',
      marginRight: 'auto'
    }
  }, "Une conversation suffit. D\xE9crivez votre besoin, recevez un devis clair \u2014 et laissez-nous orchestrer le reste."), /*#__PURE__*/React.createElement(Button, {
    variant: "dark",
    size: "lg",
    iconRight: /*#__PURE__*/React.createElement(Icon, {
      name: "arrow-right",
      size: 20
    }),
    onClick: onCTA
  }, "Demander mon devis"), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 22,
      font: '14px/1.4 var(--font-sans)',
      color: 'var(--petrol-700)',
      display: 'inline-flex',
      alignItems: 'center',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "check",
    size: 16
  }), " Sans engagement \xB7 r\xE9ponse sous 5 minutes")));
}
window.Hero = Hero;
window.HowItWorks = HowItWorks;
window.Proof = Proof;
window.FinalCTA = FinalCTA;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/landing/Narrative.jsx", error: String((e && e.message) || e) }); }

__ds_ns.ChatBubble = __ds_scope.ChatBubble;

__ds_ns.SuggestionChip = __ds_scope.SuggestionChip;

__ds_ns.Avatar = __ds_scope.Avatar;

__ds_ns.Badge = __ds_scope.Badge;

__ds_ns.Button = __ds_scope.Button;

__ds_ns.Card = __ds_scope.Card;

__ds_ns.StatCard = __ds_scope.StatCard;

__ds_ns.LEAD_STATUSES = __ds_scope.LEAD_STATUSES;

__ds_ns.StatusBadge = __ds_scope.StatusBadge;

__ds_ns.Input = __ds_scope.Input;

__ds_ns.Select = __ds_scope.Select;

})();
