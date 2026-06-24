/* NeoTravel — Console : admin des matrices tarifaires (moteur calculer_devis) */
const { useState: useMatState } = React;

const NT_MATRICES = [
  {
    key: 'saison', icon: 'sun-snow', titre: 'Saisonnalité', desc: 'Coefficient appliqué selon le mois de départ',
    cols: ['Niveau', 'Mois', 'Coefficient'],
    rows: [
      ['Basse', 'Nov · Jan · Fév · Août', '-7 %'],
      ['Moyenne', 'Déc · Oct · Sep', '0 %'],
      ['Haute', 'Mars · Avr · Juil', '+10 %'],
      ['Très haute', 'Mai · Juin', '+15 %'],
    ],
  },
  {
    key: 'urgence', icon: 'timer', titre: 'Urgence', desc: 'Écart entre date de demande et date de départ',
    cols: ['Code', 'Écart', 'Coefficient'],
    rows: [
      ['DD_PRIORITAIRE', '< 48 h', '+10 %'],
      ['DD_URGENT', '2 à 7 jours', '+5 %'],
      ['DD_NORMAL', '7 j à 3 mois', '-5 %'],
      ['DD_3MOISETPLUS', '> 3 mois', '-10 %'],
    ],
  },
  {
    key: 'capacite', icon: 'users', titre: 'Capacité', desc: 'Coefficient selon le nombre de passagers',
    cols: ['Passagers', 'Tranche', 'Coefficient'],
    rows: [
      ['≤ 19', 'Minibus / petit groupe', '-5 %'],
      ['20 – 53', 'Autocar standard', '0 %'],
      ['54 – 63', 'Grande capacité', '+15 %'],
      ['64 – 67', 'Très grande capacité', '+20 %'],
      ['68 – 85', 'Multi-configuration', '+40 %'],
    ],
  },
  {
    key: 'options', icon: 'plus-circle', titre: 'Suppléments & options', desc: 'Montants fixes ajoutés ligne par ligne',
    cols: ['Option', 'Base', 'Tarif'],
    rows: [
      ['Guide / accompagnateur', 'par jour', '+80 €'],
      ['Nuit chauffeur', 'par nuit', '+120 €'],
      ['Péages inclus', 'forfait trajet', 'variable'],
      ['TVA', 'sur HT', '10 %'],
      ['Marge commerciale', 'avant envoi', '+15 %'],
    ],
  },
];

function MatrixCard({ m, editing, onEdit, onSave }) {
  return (
    <Card padding="none" style={{ overflow: 'hidden' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 13, padding: '18px 22px', borderBottom: '1px solid var(--border-soft)' }}>
        <div style={{ width: 40, height: 40, borderRadius: 'var(--radius-sm)', background: 'var(--surface-brand-soft)', color: 'var(--brand)', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: '0 0 40px' }}>
          <Icon name={m.icon} size={20} />
        </div>
        <div style={{ flex: 1 }}>
          <h3 style={{ font: 'var(--weight-semibold) 17px/1.2 var(--font-sans)', color: 'var(--text-strong)', margin: 0 }}>{m.titre}</h3>
          <p style={{ font: '13px/1.3 var(--font-sans)', color: 'var(--text-muted)', margin: '3px 0 0' }}>{m.desc}</p>
        </div>
        <Button variant={editing ? 'primary' : 'secondary'} size="sm" iconLeft={<Icon name={editing ? 'check' : 'pencil'} size={14} color={editing ? '#fff' : 'var(--brand)'} />} onClick={editing ? onSave : onEdit}>
          {editing ? 'Enregistrer' : 'Modifier'}
        </Button>
      </div>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead><tr style={{ background: 'var(--surface-sunken)' }}>
          {m.cols.map((c, i) => <th key={c} style={{ textAlign: i === m.cols.length - 1 ? 'right' : 'left', font: 'var(--weight-semibold) 11px/1 var(--font-sans)', textTransform: 'uppercase', letterSpacing: '0.07em', color: 'var(--text-subtle)', padding: '11px 22px' }}>{c}</th>)}
        </tr></thead>
        <tbody>
          {m.rows.map((r, ri) => (
            <tr key={ri}>
              {r.map((cell, ci) => {
                const last = ci === r.length - 1;
                return (
                  <td key={ci} style={{ padding: last ? '11px 22px' : '11px 22px', borderTop: '1px solid var(--border-soft)', textAlign: last ? 'right' : 'left', font: `${ci === 0 ? 'var(--weight-semibold)' : 'var(--weight-regular)'} 14px/1.3 var(--font-sans)`, color: ci === 0 ? 'var(--text-strong)' : 'var(--text-body)', fontFamily: (last || (ci===0 && m.key==='urgence')) ? 'var(--font-mono)' : 'var(--font-sans)' }}>
                    {last && editing ? (
                      <input defaultValue={cell} style={{ width: 92, textAlign: 'right', border: '1px solid var(--horizon-400)', borderRadius: 'var(--radius-xs)', padding: '6px 10px', font: 'var(--weight-semibold) 13px/1 var(--font-mono)', color: 'var(--brand)', background: 'var(--horizon-50)', outline: 'none' }} />
                    ) : (
                      <span style={{ color: last ? (String(cell).startsWith('-') ? 'var(--positive-600)' : String(cell).startsWith('+') ? 'var(--dawn-700)' : 'var(--text-strong)') : 'inherit', fontWeight: last ? 600 : undefined }}>{cell}</span>
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  );
}

function Matrices() {
  const [editing, setEditing] = useMatState(null);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: '16px 20px', background: 'var(--surface-brand-soft)', border: '1px solid var(--border-brand)', borderRadius: 'var(--radius-md)' }}>
        <Icon name="shield-check" size={20} color="var(--brand)" style={{ marginTop: 2 }} />
        <p style={{ font: '14.5px/1.55 var(--font-sans)', color: 'var(--petrol-800)', margin: 0 }}>
          Ces coefficients alimentent <strong>calculer_devis()</strong> — un moteur déterministe, jamais le modèle IA. Toute modification s'applique aux nouveaux devis et reste tracée. Deux demandes identiques produiront toujours le même prix.
        </p>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }} className="nt-mat-grid">
        {NT_MATRICES.map((m) => (
          <MatrixCard key={m.key} m={m} editing={editing === m.key} onEdit={() => setEditing(m.key)} onSave={() => setEditing(null)} />
        ))}
      </div>
    </div>
  );
}

window.Matrices = Matrices;
