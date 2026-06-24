# UI Kit — Landing conversationnelle

La page d'accueil publique de NeoTravel. **La landing EST le chat** : pas de widget en coin, l'interface conversationnelle est au centre de la première impression.

## Narration en page unique
1. **Promesse** (`Hero` + `HeroChat`) — « Vous voyagez en groupe, on s'occupe de tout. » Le prospect parle, l'agent qualifie, un devis arrive. Fond dégradé d'aube avec halo en dérive lente.
2. **Montée en confiance** (`HowItWorks`) — la preuve du savoir-faire d'intermédiation en 3 temps : on qualifie → on mobilise → on sécurise.
3. **Preuve & valeurs** (`Proof`) — fond petrol premium ; expertise depuis 2010, valeurs « digitaliser sans déshumaniser ».
4. **Arrivée** (`FinalCTA`) — un appel à l'action unique, ressenti comme une évidence.

## Fichiers
- `index.html` — composition + révélation au défilement (IntersectionObserver) + défilement doux.
- `LandingChrome.jsx` — `LandingHeader`, `LandingFooter`.
- `HeroChat.jsx` — chat interactif scripté (`HeroChat`, `QuoteCard`) ; flow réel jour-2 (qualif → confirmation → coordonnées → devis).
- `Narrative.jsx` — `Hero`, `HowItWorks`, `Proof`, `FinalCTA`.
- `../_shared/Icon.jsx` — icônes Lucide.

## Comportement
- Le chat est jouable : cliquez une proposition ou tapez puis envoyez ; l'agent répond (indicateur de saisie) et la conversation aboutit à une carte devis.
- Tous les CTA ramènent en douceur vers le chat (un seul objectif).

Composants design system utilisés : `Button`, `Card`, `ChatBubble`, `SuggestionChip`, `Avatar`.
