**ChatBubble · SuggestionChip** — l'interface conversationnelle, cœur de la landing NeoTravel (la landing *est* le chat).

```jsx
<ChatBubble from="agent" name="Assistant NeoTravel">Décrivez-moi votre besoin de transport…</ChatBubble>
<ChatBubble from="user">48 personnes, Paris → Bordeaux, le 14 juillet</ChatBubble>
<ChatBubble from="agent" typing />
<SuggestionChip onClick={…}>Sortie scolaire</SuggestionChip>
```

`ChatBubble` : `from="agent"` (gauche, blanc, queue haut-gauche) ou `from="user"` (droite, dégradé d'aube + lueur). `typing` affiche les trois points animés. `name` met un surtitre.
`SuggestionChip` : pilule de contour qui se réchauffe au survol — pour les accroches sous le premier message de l'agent.
