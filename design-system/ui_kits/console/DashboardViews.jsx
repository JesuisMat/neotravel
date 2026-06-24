/* NeoTravel — Console : vues Pilotage, Pipeline, Relances */

const NT_LEADS = [
  { id: 'DV-0418', client: 'Lycée Camille Sée', type: 'Collectivité', trajet: 'Paris → Bordeaux', pax: 48, statut: 'devis_envoye', montant: '3 840 €', urgence: 'Normal', date: 'il y a 12 min' },
  { id: 'DV-0417', client: 'AS Montreuil Hand', type: 'Association', trajet: 'Montreuil → Lille', pax: 58, statut: 'accepte_prospect', montant: '4 210 €', urgence: 'Urgent', date: 'il y a 40 min' },
  { id: 'DV-0416', client: 'Cabinet Vallant', type: 'Entreprise', trajet: 'Lyon → Annecy', pax: 32, statut: 'relance_1', montant: '2 180 €', urgence: 'Normal', date: 'il y a 2 h' },
  { id: 'DV-0415', client: 'Mairie de Sèvres', type: 'Collectivité', trajet: 'Sèvres → Le Touquet', pax: 92, statut: 'complexe', montant: '—', urgence: 'Prioritaire', date: 'il y a 3 h' },
  { id: 'DV-0414', client: 'Famille Berthier', type: 'Particulier', trajet: 'Nantes → La Baule', pax: 14, statut: 'confirme', montant: '1 290 €', urgence: 'Normal', date: 'il y a 5 h' },
  { id: 'DV-0413', client: 'Séminaire NovaTech', type: 'Entreprise', trajet: 'Paris → Deauville', pax: 53, statut: 'relance_2', montant: '3 460 €', urgence: 'Normal', date: 'hier' },
  { id: 'DV-0412', client: 'Collège J. Ferry', type: 'Collectivité', trajet: 'Rennes → Saint-Malo', pax: 44, statut: 'refuse', montant: '1 020 €', urgence: 'Normal', date: 'hier' },
  { id: 'DV-0411', client: 'Amicale des Aînés', type: 'Association', trajet: 'Tours → Chambord', pax: 22, statut: 'incomplet', montant: '—', urgence: 'Normal', date: 'hier' },
];

function Th({ children, style }) {
  return <th style={{ textAlign: 'left', font: 'var(--weight-semibold) 11.5px/1 var(--font-sans)', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-subtle)', padding: '0 16px 12px', whiteSpace: 'nowrap', ...style }}>{children}</th>;
}
function Td({ children, style }) {
  return <td style={{ padding: '15px 16px', font: '14.5px/1.3 var(--font-sans)', color: 'var(--text-body)', borderTop: '1px solid var(--border-soft)', ...style }}>{children}</td>;
}

function LeadTable({ rows }) {
  return (
    <Card padding="none" style={{ overflow: 'hidden' }}>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 760 }}>
          <thead><tr style={{ background: 'var(--surface-sunken)' }}>
            <Th style={{ paddingTop: 14 }}>Devis</Th><Th>Client</Th><Th>Trajet</Th><Th>Pax</Th><Th>Statut</Th><Th>Urgence</Th><Th style={{ textAlign: 'right' }}>Montant TTC</Th>
          </tr></thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id} style={{ transition: 'background var(--dur-fast)' }} onMouseEnter={(e)=>e.currentTarget.style.background='var(--surface-sunken)'} onMouseLeave={(e)=>e.currentTarget.style.background='transparent'}>
                <Td style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--text-muted)' }}>{r.id}</Td>
                <Td><div style={{ font: 'var(--weight-semibold) 14.5px/1.2 var(--font-sans)', color: 'var(--text-strong)' }}>{r.client}</div><div style={{ font: '12.5px/1 var(--font-sans)', color: 'var(--text-subtle)', marginTop: 3 }}>{r.type} · {r.date}</div></Td>
                <Td style={{ whiteSpace: 'nowrap' }}>{r.trajet}</Td>
                <Td style={{ fontFamily: 'var(--font-mono)' }}>{r.pax}</Td>
                <Td><StatusBadge status={r.statut} /></Td>
                <Td><span style={{ color: r.urgence === 'Prioritaire' ? 'var(--urgent-600)' : r.urgence === 'Urgent' ? 'var(--caution-600)' : 'var(--text-muted)', fontWeight: r.urgence === 'Normal' ? 400 : 600, fontSize: 13.5 }}>{r.urgence}</span></Td>
                <Td style={{ textAlign: 'right', fontFamily: 'var(--font-mono)', fontWeight: 600, color: 'var(--text-strong)' }}>{r.montant}</Td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

function Pilotage() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 18 }} className="nt-kpis">
        <StatCard label="Leads aujourd'hui" value="62" accent caption="objectif 60 / jour" icon={<Icon name="inbox" size={18} color="var(--petrol-800)" />} />
        <StatCard label="Devis envoyés" value="48" delta="9 %" deltaDir="up" caption="cette semaine" />
        <StatCard label="Taux de conversion" value="34" unit="%" delta="6 pts" deltaDir="up" caption="vs. mois dernier" />
        <StatCard label="Délai moy. → devis" value="4,2" unit="min" delta="1,1 min" deltaDir="down" caption="plus rapide" />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 18 }} className="nt-kpis">
        <StatCard label="Relances en attente" value="7" caption="J+2 / J+3 / J+7" icon={<Icon name="bell" size={18} color="var(--text-subtle)" />} />
        <StatCard label="Demandes urgentes" value="3" caption="< 48h" icon={<Icon name="zap" size={18} color="var(--text-subtle)" />} />
        <StatCard label="Cas complexes (HITL)" value="2" caption="à reprendre" icon={<Icon name="user-cog" size={18} color="var(--text-subtle)" />} />
      </div>
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
          <h2 style={{ font: 'var(--weight-medium) 21px/1.2 var(--font-display)', color: 'var(--text-strong)', margin: 0 }}>Demandes récentes</h2>
          <Button variant="ghost" size="sm" iconRight={<Icon name="arrow-right" size={15} />}>Tout le pipeline</Button>
        </div>
        <LeadTable rows={NT_LEADS.slice(0, 5)} />
      </div>
    </div>
  );
}

function Pipeline() {
  const [filter, setFilter] = React.useState('tous');
  const filters = [['tous', 'Tous'], ['devis_envoye', 'Devis envoyé'], ['relance_1', 'En relance'], ['complexe', 'Cas complexes'], ['confirme', 'Confirmés']];
  const rows = filter === 'tous' ? NT_LEADS : NT_LEADS.filter((r) => r.statut === filter || (filter === 'relance_1' && r.statut.startsWith('relance')));
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        {filters.map(([id, l]) => (
          <button key={id} onClick={() => setFilter(id)} style={{
            font: `var(--weight-${filter === id ? 'semibold' : 'medium'}) 13.5px/1 var(--font-sans)`,
            padding: '9px 16px', borderRadius: 'var(--radius-pill)', cursor: 'pointer',
            background: filter === id ? 'var(--brand)' : 'var(--surface-card)',
            color: filter === id ? '#fff' : 'var(--text-body)',
            border: `1px solid ${filter === id ? 'transparent' : 'var(--border-medium)'}`,
          }}>{l}</button>
        ))}
      </div>
      <LeadTable rows={rows} />
    </div>
  );
}

function Relances() {
  const data = [
    { client: 'Cabinet Vallant', devis: 'DV-0416', type: 'J+3', quand: "Aujourd'hui · 14:00", statut: 'relance_1' },
    { client: 'Séminaire NovaTech', devis: 'DV-0413', type: 'J+7', quand: 'Demain · 10:00', statut: 'relance_2' },
    { client: 'Collège Pasteur', devis: 'DV-0409', type: 'J+2', quand: 'Aujourd\'hui · 17:30', statut: 'devis_envoye' },
  ];
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 20, alignItems: 'start' }} className="nt-proof-grid">
      <Card padding="none" style={{ overflow: 'hidden' }}>
        <div style={{ padding: '18px 22px', borderBottom: '1px solid var(--border-soft)' }}>
          <h2 style={{ font: 'var(--weight-medium) 19px/1.2 var(--font-display)', color: 'var(--text-strong)', margin: 0 }}>Relances planifiées</h2>
        </div>
        {data.map((d, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '16px 22px', borderTop: i ? '1px solid var(--border-soft)' : 'none' }}>
            <div style={{ width: 42, height: 42, borderRadius: 'var(--radius-sm)', background: 'var(--dawn-100)', color: 'var(--dawn-700)', display: 'flex', alignItems: 'center', justifyContent: 'center', font: 'var(--weight-bold) 13px/1 var(--font-mono)', flex: '0 0 42px' }}>{d.type}</div>
            <div style={{ flex: 1 }}>
              <div style={{ font: 'var(--weight-semibold) 15px/1.2 var(--font-sans)', color: 'var(--text-strong)' }}>{d.client}</div>
              <div style={{ font: '13px/1 var(--font-sans)', color: 'var(--text-subtle)', marginTop: 3 }}>{d.devis} · {d.quand}</div>
            </div>
            <StatusBadge status={d.statut} />
          </div>
        ))}
      </Card>
      <Card variant="sunken">
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
          <Icon name="info" size={18} color="var(--brand)" />
          <h3 style={{ font: 'var(--weight-semibold) 16px/1.2 var(--font-sans)', color: 'var(--text-strong)', margin: 0 }}>Règles de relance</h3>
        </div>
        <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 12, font: '14px/1.5 var(--font-sans)', color: 'var(--text-body)' }}>
          <li><strong>Urgent</strong> — J+2, puis J+5</li>
          <li><strong>Standard</strong> — J+3, puis J+7</li>
          <li style={{ color: 'var(--text-muted)' }}>Max 2 relances. Au-delà : clôture — la persistance excessive nuit à l'image de NeoTravel.</li>
        </ul>
      </Card>
    </div>
  );
}

window.Pilotage = Pilotage;
window.Pipeline = Pipeline;
window.Relances = Relances;
