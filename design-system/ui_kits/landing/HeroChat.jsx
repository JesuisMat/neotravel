/* NeoTravel — Landing : héros conversationnel (la landing EST le chat) */
const { useState: useHS, useRef: useHRef, useEffect: useHEffect } = React;

// Script de démonstration — fondé sur le flow conversationnel réel (jour-2)
const NT_SCRIPT = [
  {
    user: "Sortie scolaire — 48 élèves, Paris → Bordeaux le 14 juillet, retour le 16.",
    agent: "Parfait, je récapitule : 48 passagers, Paris → Bordeaux, départ le 14 juillet, retour le 16. Souhaitez-vous un accompagnateur à bord ?",
    chips: ["Oui, avec un guide", "Non merci"],
  },
  {
    user: "Oui, avec un guide.",
    agent: "Noté. Pour vous envoyer le devis détaillé, j'ai besoin de votre email et d'un numéro de téléphone.",
    chips: ["marie.dupont@ecole.fr · 06 12 34 56 78"],
  },
  {
    user: "marie.dupont@ecole.fr · 06 12 34 56 78",
    agent: "Votre devis est prêt. Je viens de l'envoyer par email — notre équipe reste disponible pour tout ajustement.",
    quote: true,
  },
];

function QuoteCard() {
  const lines = [
    ['Trajet aller-retour · 1 040 km', '2 980 €'],
    ['Coefficient saison (haute, juillet)', '+10 %'],
    ['Accompagnateur (3 j)', '+240 €'],
  ];
  return (
    <div style={{ marginTop: 8, background: 'var(--surface-card)', border: '1px solid var(--border-soft)', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-sm)', overflow: 'hidden', maxWidth: 380 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '12px 16px', borderBottom: '1px solid var(--border-soft)', background: 'var(--surface-sunken)' }}>
        <Icon name="file-text" size={17} color="var(--brand)" />
        <span style={{ font: 'var(--weight-semibold) 14px/1 var(--font-sans)', color: 'var(--text-strong)' }}>Devis NeoTravel — DV-2026-0418</span>
      </div>
      <div style={{ padding: '6px 16px' }}>
        {lines.map(([l, v]) => (
          <div key={l} style={{ display: 'flex', justifyContent: 'space-between', gap: 16, padding: '8px 0', borderBottom: '1px dashed var(--border-soft)', font: '13.5px/1.3 var(--font-sans)', color: 'var(--text-body)' }}>
            <span>{l}</span><span style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>{v}</span>
          </div>
        ))}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', padding: '12px 0 14px' }}>
          <span style={{ font: 'var(--weight-semibold) 14px/1 var(--font-sans)', color: 'var(--text-strong)' }}>Total TTC <span style={{ color: 'var(--text-subtle)', fontWeight: 400 }}>(TVA 10 %)</span></span>
          <span style={{ font: 'var(--weight-medium) 26px/1 var(--font-display)', color: 'var(--brand)', fontVariantNumeric: 'tabular-nums' }}>3 840 €</span>
        </div>
      </div>
    </div>
  );
}

function HeroChat({ onReachQuote }) {
  const [messages, setMessages] = useHS([
    { from: 'agent', text: "Bonjour ! Décrivez-moi votre besoin de transport et je vous prépare un devis en quelques minutes." },
  ]);
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
    setMessages((m) => [...m, { from: 'user', text: said }]);
    setInput('');
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      setMessages((m) => [...m, { from: 'agent', text: turn.agent }]);
      if (turn.quote) { setShowQuote(true); onReachQuote && onReachQuote(); }
      setStep((s) => s + 1);
    }, 1300);
  }

  const currentChips = step === 0 ? startChips : (NT_SCRIPT[step] && !typing ? NT_SCRIPT[step].chips : null);
  const done = step >= NT_SCRIPT.length;

  return (
    <div style={{
      background: 'rgba(254,252,249,0.74)',
      backdropFilter: 'blur(var(--blur-lg)) saturate(1.3)',
      WebkitBackdropFilter: 'blur(var(--blur-lg)) saturate(1.3)',
      border: '1px solid rgba(255,255,255,0.7)',
      borderRadius: 'var(--radius-2xl)',
      boxShadow: 'var(--shadow-xl)',
      padding: 14,
      width: '100%',
      maxWidth: 600,
      display: 'flex', flexDirection: 'column',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 11, padding: '8px 10px 14px' }}>
        <Avatar name="N" tone="accent" size={38} icon={<Icon name="sparkles" size={18} color="#fff" />} />
        <div>
          <div style={{ font: 'var(--weight-semibold) 15px/1.2 var(--font-sans)', color: 'var(--text-strong)' }}>Assistant NeoTravel</div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, font: '12.5px/1 var(--font-sans)', color: 'var(--positive-600)' }}>
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--positive-500)' }} /> En ligne · réponse immédiate
          </div>
        </div>
      </div>

      <div ref={scrollRef} style={{ display: 'flex', flexDirection: 'column', gap: 12, padding: '4px 8px', maxHeight: 330, minHeight: 230, overflowY: 'auto' }}>
        {messages.map((m, i) => (
          <ChatBubble key={i} from={m.from}>{m.text}</ChatBubble>
        ))}
        {showQuote && <div style={{ alignSelf: 'flex-start' }}><QuoteCard /></div>}
        {typing && <ChatBubble from="agent" typing />}

        {currentChips && (
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 2 }}>
            {currentChips.map((c) => <SuggestionChip key={c} onClick={() => advance(step === 0 ? null : c)}>{c}</SuggestionChip>)}
          </div>
        )}
      </div>

      <form
        onSubmit={(e) => { e.preventDefault(); if (!done) advance(input.trim() || null); }}
        style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 12, padding: 6, background: 'var(--surface-raised)', border: '1px solid var(--border-medium)', borderRadius: 'var(--radius-pill)', boxShadow: 'var(--shadow-xs)' }}
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={done}
          placeholder={done ? 'Devis envoyé — merci !' : 'Écrivez votre besoin…'}
          style={{ flex: 1, border: 'none', outline: 'none', background: 'transparent', font: '15px/1.4 var(--font-sans)', color: 'var(--text-strong)', padding: '8px 12px' }}
        />
        <button type="submit" disabled={done} aria-label="Envoyer" style={{
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 42, height: 42, borderRadius: '50%', border: 'none',
          background: done ? 'var(--stone-300)' : 'var(--brand)', color: '#fff', cursor: done ? 'default' : 'pointer', flex: '0 0 42px',
          transition: 'background var(--dur-base) var(--ease-soft)',
        }}>
          <Icon name={done ? 'check' : 'arrow-up'} size={19} color="#fff" />
        </button>
      </form>
    </div>
  );
}

window.HeroChat = HeroChat;
