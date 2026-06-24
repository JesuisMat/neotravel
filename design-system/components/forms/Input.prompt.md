**Input · Select** — champs de formulaire (devis, coordonnées, admin matrices).

```jsx
<Input label="Email" type="email" placeholder="vous@exemple.fr" hint="Pour recevoir le devis" />
<Select label="Type de client" options={['Particulier','Association','Collectivité','Entreprise']} />
```

Hauteur 48px, coins `--radius-md`, focus = anneau doux horizon (rouge si `error`). `Input` accepte `iconLeft`, `hint`, `error`. `Select` accepte `options` (string[] ou `{value,label}[]`) et `placeholder`.
