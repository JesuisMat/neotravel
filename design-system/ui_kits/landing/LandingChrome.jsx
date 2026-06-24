/* NeoTravel — Landing : en-tête & pied de page */
const { useState: useStateChrome } = React;

function LandingHeader({ onCTA }) {
  return (
    <header style={{
      position: 'sticky', top: 0, zIndex: 50,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '15px clamp(20px, 5vw, 56px)',
      background: 'rgba(14,42,56,0.55)',
      backdropFilter: 'blur(var(--blur-md)) saturate(1.2)',
      WebkitBackdropFilter: 'blur(var(--blur-md)) saturate(1.2)',
      borderBottom: '1px solid var(--border-on-dark)',
    }}>
      <img src="../../assets/neotravel-logo-light.svg" alt="NeoTravel" style={{ height: 32 }} />
      <nav style={{ display: 'flex', alignItems: 'center', gap: 'clamp(14px,2.4vw,30px)' }}>
        {['Notre métier', 'Comment ça marche', 'Nos garanties'].map((l) => (
          <a key={l} href="#" onClick={(e) => e.preventDefault()} style={{
            font: 'var(--weight-medium) 15px/1 var(--font-sans)', color: 'var(--text-on-dark-muted)',
            textDecoration: 'none', display: 'none',
          }} className="nt-navlink">{l}</a>
        ))}
        <a href="../console/index.html" style={{
          display: 'inline-flex', alignItems: 'center', gap: 7,
          font: 'var(--weight-semibold) 14px/1 var(--font-sans)', color: 'var(--horizon-200)',
          textDecoration: 'none', padding: '8px 14px', borderRadius: 'var(--radius-pill)',
          border: '1px solid var(--border-on-dark)',
        }}>
          <Icon name="layout-dashboard" size={16} color="var(--horizon-300)" /> Espace direction
        </a>
        <Button variant="accent" size="sm" onClick={onCTA}>Demander un devis</Button>
      </nav>
      <style>{`@media(min-width:980px){.nt-navlink{display:inline-flex !important}.nt-navlink:hover{color:#fff !important}}`}</style>
    </header>
  );
}

function LandingFooter() {
  const cols = [
    { h: 'NeoTravel', items: ['Notre métier', "L'intermédiation", 'Mot du président', 'Depuis 2010'] },
    { h: 'Transports', items: ['Sorties scolaires', 'Séminaires', 'Événements', 'Tourisme de groupe'] },
    { h: 'Ressources', items: ['Questions fréquentes', 'Nous contacter', 'Espace direction'] },
  ];
  return (
    <footer style={{ background: 'var(--gradient-dusk)', color: 'var(--text-on-dark)', padding: 'clamp(48px,7vw,80px) clamp(20px,5vw,56px) 36px' }}>
      <div style={{ maxWidth: 'var(--content-max)', margin: '0 auto', display: 'grid', gridTemplateColumns: '1.4fr 1fr 1fr 1fr', gap: 40 }} className="nt-foot-grid">
        <div>
          <img src="../../assets/neotravel-logo-light.svg" alt="NeoTravel" style={{ height: 34, marginBottom: 18 }} />
          <p style={{ font: 'var(--weight-regular) 15px/1.6 var(--font-sans)', color: 'var(--text-on-dark-muted)', maxWidth: 280, margin: 0 }}>
            Transport de personnes en groupe. Nous qualifions, nous mobilisons le bon partenaire, nous sécurisons — de bout en bout.
          </p>
        </div>
        {cols.map((c) => (
          <div key={c.h}>
            <div style={{ font: 'var(--weight-semibold) 12px/1 var(--font-sans)', textTransform: 'uppercase', letterSpacing: 'var(--tracking-caps)', color: 'var(--horizon-300)', marginBottom: 16 }}>{c.h}</div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 11 }}>
              {c.items.map((it) => <li key={it}><a href="#" onClick={(e) => e.preventDefault()} style={{ font: 'var(--weight-regular) 14.5px/1 var(--font-sans)', color: 'var(--text-on-dark-muted)', textDecoration: 'none' }}>{it}</a></li>)}
            </ul>
          </div>
        ))}
      </div>
      <div style={{ maxWidth: 'var(--content-max)', margin: '40px auto 0', paddingTop: 24, borderTop: '1px solid var(--border-on-dark)', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, font: 'var(--weight-regular) 13px/1 var(--font-sans)', color: 'var(--text-on-dark-muted)' }}>
        <span>© 2010–2026 NeoTravel — Plateforme d'intermédiation transport de groupe</span>
        <span style={{ display: 'inline-flex', gap: 20 }}><a href="#" onClick={(e)=>e.preventDefault()} style={{color:'inherit',textDecoration:'none'}}>Mentions légales</a><a href="#" onClick={(e)=>e.preventDefault()} style={{color:'inherit',textDecoration:'none'}}>Confidentialité</a></span>
      </div>
      <style>{`@media(max-width:860px){.nt-foot-grid{grid-template-columns:1fr 1fr !important}}`}</style>
    </footer>
  );
}

window.LandingHeader = LandingHeader;
window.LandingFooter = LandingFooter;
