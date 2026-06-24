/* NeoTravel — Console direction : ossature (rail latéral + barre supérieure) */
const { useState: useShellState } = React;

function NavItem({ icon, label, active, onClick, badge }) {
  return (
    <button onClick={onClick} style={{
      display: 'flex', alignItems: 'center', gap: 12, width: '100%',
      padding: '11px 14px', borderRadius: 'var(--radius-md)', border: 'none', cursor: 'pointer',
      background: active ? 'rgba(255,255,255,0.08)' : 'transparent',
      color: active ? '#fff' : 'var(--text-on-dark-muted)',
      font: `var(--weight-${active ? 'semibold' : 'medium'}) 15px/1 var(--font-sans)`,
      textAlign: 'left', transition: 'background var(--dur-fast) var(--ease-soft), color var(--dur-fast) var(--ease-soft)',
      position: 'relative',
    }}
    onMouseEnter={(e)=>{ if(!active) e.currentTarget.style.background='rgba(255,255,255,0.04)'; }}
    onMouseLeave={(e)=>{ if(!active) e.currentTarget.style.background='transparent'; }}>
      {active && <span style={{ position: 'absolute', left: -14, top: '50%', transform: 'translateY(-50%)', width: 3, height: 22, borderRadius: 3, background: 'var(--dawn-400)' }} />}
      <Icon name={icon} size={19} color={active ? 'var(--dawn-400)' : 'currentColor'} />
      <span style={{ flex: 1 }}>{label}</span>
      {badge != null && <span style={{ font: 'var(--weight-bold) 11px/1 var(--font-mono)', background: 'var(--dawn-500)', color: 'var(--petrol-950)', padding: '3px 7px', borderRadius: 'var(--radius-pill)' }}>{badge}</span>}
    </button>
  );
}

function ConsoleShell({ view, setView, children }) {
  const nav = [
    { id: 'pilotage', icon: 'gauge', label: 'Pilotage' },
    { id: 'pipeline', icon: 'kanban', label: 'Pipeline leads' },
    { id: 'relances', icon: 'bell', label: 'Relances', badge: 7 },
    { id: 'matrices', icon: 'sliders-horizontal', label: 'Matrices tarifaires' },
  ];
  const titles = {
    pilotage: ['Pilotage', "Vue d'ensemble du flux commercial — temps réel"],
    pipeline: ['Pipeline leads', 'Toutes les demandes et leur statut'],
    relances: ['Relances', 'Relances planifiées et en attente'],
    matrices: ['Matrices tarifaires', 'Coefficients du moteur de devis — modifiables sans code'],
  };
  const [t, sub] = titles[view] || titles.pilotage;

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--surface-page)' }}>
      <aside style={{ width: 248, flex: '0 0 248px', background: 'var(--gradient-dusk)', padding: '22px 18px', display: 'flex', flexDirection: 'column', position: 'sticky', top: 0, height: '100vh' }} className="nt-aside">
        <a href="../landing/index.html" style={{ display: 'inline-block', marginBottom: 30 }}>
          <img src="../../assets/neotravel-logo-light.svg" alt="NeoTravel" style={{ height: 30 }} />
        </a>
        <div style={{ font: 'var(--weight-semibold) 11px/1 var(--font-sans)', textTransform: 'uppercase', letterSpacing: 'var(--tracking-caps)', color: 'var(--horizon-300)', padding: '0 14px 12px' }}>Direction</div>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {nav.map((n) => <NavItem key={n.id} {...n} active={view === n.id} onClick={() => setView(n.id)} />)}
        </nav>
        <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', gap: 11, padding: '12px 10px', borderTop: '1px solid var(--border-on-dark)' }}>
          <Avatar name="Julien Le Viavant" tone="accent" size={38} />
          <div style={{ minWidth: 0 }}>
            <div style={{ font: 'var(--weight-semibold) 14px/1.2 var(--font-sans)', color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Julien Le Viavant</div>
            <div style={{ font: '12px/1 var(--font-sans)', color: 'var(--text-on-dark-muted)' }}>Gérant</div>
          </div>
        </div>
      </aside>

      <main style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
        <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '22px clamp(20px,3vw,40px)', borderBottom: '1px solid var(--border-soft)', background: 'rgba(251,247,242,0.8)', backdropFilter: 'blur(10px)', position: 'sticky', top: 0, zIndex: 20 }}>
          <div>
            <h1 style={{ font: 'var(--weight-medium) 28px/1.1 var(--font-display)', color: 'var(--text-strong)', margin: '0 0 3px' }}>{t}</h1>
            <p style={{ font: '14px/1.3 var(--font-sans)', color: 'var(--text-muted)', margin: 0 }}>{sub}</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 14px', background: 'var(--surface-card)', border: '1px solid var(--border-soft)', borderRadius: 'var(--radius-pill)', font: '13px/1 var(--font-sans)', color: 'var(--text-muted)' }}>
              <Icon name="calendar" size={15} color="var(--text-subtle)" /> 24 juin 2026
            </div>
            <Button variant="primary" size="sm" iconLeft={<Icon name="download" size={15} color="#fff" />}>Exporter</Button>
          </div>
        </header>
        <div style={{ padding: 'clamp(20px,3vw,36px)', flex: 1 }}>{children}</div>
      </main>
    </div>
  );
}

window.ConsoleShell = ConsoleShell;
