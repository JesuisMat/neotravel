---
name: neotravel-design
description: Use this skill to generate well-branded interfaces and assets for NeoTravel, either for production or throwaway prototypes/mocks/etc. Contains essential design guidelines, colors, type, fonts, assets, and UI kit components for prototyping.
user-invocable: true
---

Read the README.md file within this skill, and explore the other available files.

If creating visual artifacts (slides, mocks, throwaway prototypes, etc), copy assets out and create static HTML files for the user to view. If working on production code, you can copy assets and read the rules here to become an expert in designing with this brand.

If the user invokes this skill without any other guidance, ask them what they want to build or design, ask some questions, and act as an expert designer who outputs HTML artifacts _or_ production code, depending on the need.

## NeoTravel en bref
Plateforme d'intermédiation transport de groupe (depuis 2010). Émotion à traduire : la **tranquillité de celui qui délègue un problème complexe à un expert**. Atmosphère « Aube » — hall de gare au petit matin, lever de soleil sur la route, horizon qui se fond du sol au ciel.

## Où regarder
- `readme.md` — guide complet : contexte, fondamentaux de contenu (FR, « vous »/« on »), fondations visuelles, iconographie, manifeste.
- `styles.css` + `tokens/` — couleurs, typographie, espacement, effets (dégradés signature, mouvement). Lier `styles.css` ; référencer les alias sémantiques.
- `components/` — primitives React (Button, Card, Badge, Avatar, Input, Select, ChatBubble, SuggestionChip, StatusBadge, StatCard).
- `ui_kits/landing/` — landing conversationnelle (la landing EST le chat). `ui_kits/console/` — console direction (pilotage, pipeline, relances, matrices).
- `assets/` — logos SVG (clair, sombre, marque).

## Réflexes de marque
- Français soigné ; « vous » au client, « nous/on » pour NeoTravel ; ton assuré et accueillant, sans arrogance ; aucun emoji.
- Couleur : horizon (bleu petrol) primaire, aube (apricot) en accent rare ; neutres chauds ; dégradés signature pour la profondeur.
- Type : Spectral (titres), Hanken Grotesk (corps), JetBrains Mono (données).
- Mouvement doux qui suggère l'avancée (ease-glide), jamais la rupture ; un seul CTA accent par vue.
- Icônes : Lucide, trait 1.75. Coins généreux, ombres diffuses teintées petrol.
