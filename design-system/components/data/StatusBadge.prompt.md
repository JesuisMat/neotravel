**StatusBadge · StatCard** — pilotage et suivi du pipeline commercial.

```jsx
<StatusBadge status="devis_envoye" />
<StatusBadge status="complexe" />
<StatCard label="Taux de conversion" value="34" unit="%" delta="6 pts" deltaDir="up" caption="vs. mois dernier" />
<StatCard label="Leads aujourd'hui" value="62" accent />
```

`StatusBadge` connaît toute la machine d'état (`nouveau, incomplet, qualifie, devis_envoye, relance_1, relance_2, accepte_prospect, confirme, refuse, complexe, cloture`) — passez juste `status`. Couleurs : brand=qualif/devis, caution=incomplet/relances, positive=accepté/confirmé, negative=refusé, accent=complexe, neutral=clôturé.
`StatCard` : grand chiffre sérif tabulaire ; `accent` applique le dégradé d'aube (réservez-le au KPI le plus important).
