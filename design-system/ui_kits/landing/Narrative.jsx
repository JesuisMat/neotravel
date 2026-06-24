/* NeoTravel — Landing : narration en page unique
   Promesse → montée en confiance (preuve du savoir-faire) → arrivée sur le CTA unique */

function Hero({ onCTA }) {
  return (
    <section style={{ position: 'relative', overflow: 'hidden', background: 'var(--gradient-dusk)', padding: 'clamp(118px,15vh,176px) clamp(20px,5vw,56px) clamp(72px,9vw,120px)', textAlign: 'center' }}>
      {/* arc d'horizon lumineux — le soleil crête la ligne */}
      <div aria-hidden className="nt-arc" />
      <div aria-hidden className="nt-bloom" />
      <div aria-hidden className="nt-beam" />

      <div style={{ position: 'relative', maxWidth: 880, margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '7px 15px', borderRadius: 'var(--radius-pill)', background: 'rgba(255,255,255,0.06)', border: '1px solid var(--border-on-dark)', marginBottom: 28, backdropFilter: 'blur(6px)' }}>
          <Icon name="shield-check" size={15} color="var(--dawn-400)" />
          <span style={{ font: 'var(--weight-semibold) 12.5px/1 var(--font-sans)', letterSpacing: '0.03em', color: 'var(--horizon-200)' }}>Intermédiaire transport de groupe · depuis 2010</span>
        </div>
        <h1 style={{ font: 'var(--weight-medium) clamp(40px,6vw,76px)/1.04 var(--font-display)', letterSpacing: 'var(--tracking-tight)', color: '#fff', margin: '0 0 22px', textWrap: 'balance' }}>
          Vous voyagez en groupe.<br /><span style={{ color: 'var(--dawn-400)', fontStyle: 'italic', fontWeight: 400 }}>On s'occupe de tout.</span>
        </h1>
        <p style={{ font: 'var(--weight-regular) clamp(17px,1.6vw,21px)/1.6 var(--font-sans)', color: 'var(--text-on-dark-muted)', maxWidth: 560, margin: '0 0 36px' }}>
          Décrivez votre trajet en quelques mots. On qualifie le besoin, on mobilise le bon autocariste, on négocie les conditions — et votre devis arrive en quelques minutes.
        </p>
        <div style={{ width: '100%', maxWidth: 620, display: 'flex', justifyContent: 'center' }}>
          <HeroChat onReachQuote={() => {}} />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 18, flexWrap: 'wrap', justifyContent: 'center', marginTop: 26, font: '14px/1.4 var(--font-sans)', color: 'var(--text-on-dark-muted)' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}><Icon name="clock" size={16} color="var(--horizon-300)" /> Réponse en moins de 5 minutes</span>
          <span style={{ width: 4, height: 4, borderRadius: '50%', background: 'var(--horizon-400)' }} />
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}><Icon name="check" size={16} color="var(--horizon-300)" /> Sans engagement</span>
        </div>
      </div>
      <style>{`
        .nt-arc{position:absolute;left:50%;top:64px;width:min(2200px,210vw);height:min(2200px,210vw);transform:translateX(-50%);border-radius:50%;border:1.5px solid rgba(246,184,132,0.5);background:radial-gradient(50% 50% at 50% 50%, rgba(46,99,120,0.22), transparent 66%);box-shadow:0 0 90px 8px rgba(240,160,98,0.20), inset 0 0 160px rgba(94,155,176,0.12);pointer-events:none}
        .nt-bloom{position:absolute;left:50%;top:8px;width:min(640px,90vw);height:340px;transform:translateX(-50%);background:radial-gradient(50% 60% at 50% 45%, rgba(250,208,172,0.55), rgba(240,160,98,0.22) 38%, transparent 72%);filter:blur(26px);pointer-events:none;animation:nt-pulse 7s var(--ease-soft) infinite alternate}
        .nt-beam{position:absolute;left:50%;top:0;width:2px;height:96px;transform:translateX(-50%);background:linear-gradient(to top, rgba(250,208,172,0.8), transparent);filter:blur(0.5px);pointer-events:none}
        @keyframes nt-pulse{from{opacity:.7;transform:translateX(-50%) scale(1)}to{opacity:1;transform:translateX(-50%) scale(1.07)}}
        @media (prefers-reduced-motion:reduce){.nt-bloom{animation:none}}
      `}</style>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    { ic: 'message-circle', t: 'On qualifie', d: "Vous décrivez votre besoin en langage naturel. On clarifie chaque détail — trajet, dates, passagers, options — sans formulaire interminable." },
    { ic: 'route', t: 'On mobilise', d: "On identifie le bon partenaire autocariste dans notre réseau, on vérifie sa disponibilité et on négocie les meilleures conditions pour vous." },
    { ic: 'shield-check', t: 'On sécurise', d: "On verrouille la prestation de bout en bout : conditions, logistique, imprévus. Vous n'avez plus qu'à monter à bord." },
  ];
  return (
    <section style={{ background: 'var(--surface-page)', padding: 'clamp(64px,8vw,110px) clamp(20px,5vw,56px)' }}>
      <div style={{ maxWidth: 'var(--content-max)', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', maxWidth: 680, margin: '0 auto 56px' }}>
          <div className="nt-eyebrow" style={{ marginBottom: 14 }}>Un travail d'orchestration invisible</div>
          <h2 style={{ font: 'var(--weight-medium) clamp(30px,3.6vw,46px)/1.1 var(--font-display)', letterSpacing: 'var(--tracking-snug)', color: 'var(--text-strong)', margin: '0 0 16px', textWrap: 'balance' }}>
            La complexité, absorbée en coulisses
          </h2>
          <p style={{ font: '18px/1.6 var(--font-sans)', color: 'var(--text-muted)', margin: 0 }}>
            Nous ne possédons pas de flotte. Notre valeur, c'est de transformer une demande en une prestation fiable — en trois temps, sans accroc.
          </p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 24 }} className="nt-steps">
          {steps.map((s, i) => (
            <Card key={s.t} interactive style={{ position: 'relative' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 56, height: 56, borderRadius: 'var(--radius-md)', background: 'var(--gradient-sunrise)', marginBottom: 22, boxShadow: 'var(--shadow-glow)' }}>
                <Icon name={s.ic} size={26} color="var(--petrol-900)" strokeWidth={1.6} />
              </div>
              <div style={{ font: 'var(--weight-bold) 13px/1 var(--font-mono)', color: 'var(--accent-hover)', marginBottom: 10 }}>0{i + 1}</div>
              <h3 style={{ font: 'var(--weight-semibold) 22px/1.2 var(--font-display)', color: 'var(--text-strong)', margin: '0 0 12px' }}>{s.t}</h3>
              <p style={{ font: '15.5px/1.62 var(--font-sans)', color: 'var(--text-muted)', margin: 0 }}>{s.d}</p>
            </Card>
          ))}
        </div>
      </div>
      <style>{`@media(max-width:860px){.nt-steps{grid-template-columns:1fr !important}}`}</style>
    </section>
  );
}

function Proof() {
  const stats = [
    ['16 ans', "d'expertise de l'intermédiation"],
    ['Couverture', 'nationale & internationale'],
    ['Réseau', 'de partenaires autocaristes vérifiés'],
  ];
  const values = [
    ['heart-handshake', 'Conseil humain', "Pour les cas complexes, un conseiller reprend la main — avec tout le contexte."],
    ['gauge', 'Réactivité', "Le flux ne sature plus : chaque demande est traitée, aucune opportunité perdue."],
    ['eye', 'Transparence', "Des règles de prix claires et auditables. Deux demandes identiques, le même devis."],
  ];
  return (
    <section style={{ position: 'relative', overflow: 'hidden', background: 'var(--gradient-dusk)', color: 'var(--text-on-dark)', padding: 'clamp(64px,8vw,110px) clamp(20px,5vw,56px)' }}>
      <div aria-hidden style={{ position: 'absolute', inset: 'auto -10% -40% 30%', height: '70%', background: 'var(--gradient-sunrise)', opacity: 0.18, filter: 'blur(60px)', pointerEvents: 'none' }} />
      <div style={{ position: 'relative', maxWidth: 'var(--content-max)', margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'clamp(32px,5vw,72px)', alignItems: 'center', marginBottom: 64 }} className="nt-proof-grid">
          <div>
            <div className="nt-eyebrow" style={{ color: 'var(--horizon-300)', marginBottom: 14 }}>Digitaliser sans déshumaniser</div>
            <h2 style={{ font: 'var(--weight-medium) clamp(30px,3.6vw,46px)/1.1 var(--font-display)', letterSpacing: 'var(--tracking-snug)', color: '#fff', margin: '0 0 18px', textWrap: 'balance' }}>
              La confiance tranquille d'un groupe entre de bonnes mains
            </h2>
            <p style={{ font: '18px/1.65 var(--font-sans)', color: 'var(--text-on-dark-muted)', margin: 0 }}>
              Notre métier n'est pas de vendre un trajet. C'est de comprendre un besoin, sécuriser une solution et coordonner des partenaires fiables — pour une expérience simple, claire et rassurante.
            </p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {stats.map(([n, l]) => (
              <div key={l} style={{ display: 'flex', alignItems: 'baseline', gap: 18, padding: '16px 0', borderBottom: '1px solid var(--border-on-dark)' }}>
                <span style={{ font: 'var(--weight-medium) clamp(26px,3vw,34px)/1 var(--font-display)', color: 'var(--dawn-400)', minWidth: 150 }}>{n}</span>
                <span style={{ font: '16px/1.4 var(--font-sans)', color: 'var(--text-on-dark)' }}>{l}</span>
              </div>
            ))}
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 20 }} className="nt-values">
          {values.map(([ic, t, d]) => (
            <div key={t} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border-on-dark)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-6)' }}>
              <Icon name={ic} size={24} color="var(--horizon-300)" />
              <h3 style={{ font: 'var(--weight-semibold) 19px/1.2 var(--font-sans)', color: '#fff', margin: '16px 0 8px' }}>{t}</h3>
              <p style={{ font: '14.5px/1.6 var(--font-sans)', color: 'var(--text-on-dark-muted)', margin: 0 }}>{d}</p>
            </div>
          ))}
        </div>
      </div>
      <style>{`@media(max-width:860px){.nt-proof-grid,.nt-values{grid-template-columns:1fr !important}}`}</style>
    </section>
  );
}

function FinalCTA({ onCTA }) {
  return (
    <section style={{ position: 'relative', overflow: 'hidden', background: 'var(--gradient-sunrise)', padding: 'clamp(72px,9vw,128px) clamp(20px,5vw,56px)', textAlign: 'center' }}>
      <div style={{ position: 'relative', maxWidth: 720, margin: '0 auto' }}>
        <h2 style={{ font: 'var(--weight-medium) clamp(34px,4.6vw,60px)/1.06 var(--font-display)', letterSpacing: 'var(--tracking-tight)', color: 'var(--petrol-950)', margin: '0 0 20px', textWrap: 'balance' }}>
          Prêt à confier votre trajet ?
        </h2>
        <p style={{ font: '19px/1.6 var(--font-sans)', color: 'var(--petrol-800)', margin: '0 0 36px', maxWidth: 520, marginLeft: 'auto', marginRight: 'auto' }}>
          Une conversation suffit. Décrivez votre besoin, recevez un devis clair — et laissez-nous orchestrer le reste.
        </p>
        <Button variant="dark" size="lg" iconRight={<Icon name="arrow-right" size={20} />} onClick={onCTA}>Demander mon devis</Button>
        <div style={{ marginTop: 22, font: '14px/1.4 var(--font-sans)', color: 'var(--petrol-700)', display: 'inline-flex', alignItems: 'center', gap: 8 }}>
          <Icon name="check" size={16} /> Sans engagement · réponse sous 5 minutes
        </div>
      </div>
    </section>
  );
}

window.Hero = Hero;
window.HowItWorks = HowItWorks;
window.Proof = Proof;
window.FinalCTA = FinalCTA;
