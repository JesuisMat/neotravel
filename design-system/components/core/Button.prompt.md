**Button** — l'action principale d'un écran, en forme de pilule, avec une transition glissée et un état pressé doux ; à utiliser pour tout déclencheur d'action (CTA, envoi, validation).

```jsx
<Button variant="accent" size="lg" iconRight={<span>→</span>}>Demander mon devis</Button>
```

Variantes : `primary` (bleu horizon, action standard), `accent` (dégradé d'aube + lueur, pour l'appel à l'action unique et désirable), `secondary` (contour, action de second plan), `ghost` (texte seul), `dark` (petrol, sur fond clair).
Tailles : `sm` / `md` / `lg`. Props : `iconLeft`, `iconRight`, `fullWidth`, `disabled`.
Règle de marque : un seul bouton `accent` par vue — l'évidence, pas la sollicitation.
