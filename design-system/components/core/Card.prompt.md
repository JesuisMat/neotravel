**Card · Badge · Avatar** — primitives de surface et d'identité.

```jsx
<Card variant="glass" padding="lg" interactive>…</Card>
<Badge tone="accent" variant="soft">12 en attente</Badge>
<Avatar name="Marie Dupont" tone="brand" size={44} />
```

`Card` : variantes `raised` (défaut), `flat`, `sunken`, `glass` (verre dépoli sur dégradé), `dark`. `padding` none/sm/md/lg, `interactive` lève au survol.
`Badge` : `tone` neutral/brand/accent/positive/caution/negative × `variant` soft/solid.
`Avatar` : initiales auto depuis `name`, ou `src` image, ou `icon` ; `tone` brand/accent/petrol/neutral.
