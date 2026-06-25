# NeoTravel — Prompts images GPT Image 2.0

> Générés pour enrichir visuellement le site NeoTravel.
> Injecter dans les sections correspondantes via `<img>` ou `next/image`.
> Format recommandé : WebP, ratio 16:9 (1600x900) sauf mention contraire.

## Design System "Aube" — Référence couleur pour les prompts

Toutes les images doivent s'intégrer dans la palette suivante. Chaque prompt inclut une section **Color grading directive** qui ancre les teintes dans le design system.

| Token | Valeur | Rôle dans les images |
|---|---|---|
| `--petrol-950` | `#060F14` | Fond hero, overlay sombre |
| `--petrol-800` | `#0E2A38` | Bleu-vert profond dominant |
| `--petrol-700` | `#163F56` | Ombres, profondeur |
| `--horizon-500` | `#3A7B92` | Bleu horizon, reflets eau/ciel |
| `--horizon-300` | `#93BEC5` | Lumière froide, brume |
| `--dawn-400`    | `#F0A062` | Or chaud, soleil levant — accent principal |
| `--dawn-300`    | `#F6B884` | Lumière ambrée douce |
| `--sand-50`     | `#FAFAF8` | Blanc chaud, surfaces neutres |

**Philosophie visuelle :** contraste dramatique entre le bleu-pétrole profond (nuit/aube) et l'or chaud (lever de soleil/lumière). Aucun violet, aucun bleu vif ou néon. Cinématographique, éditorial, premium transport français.

---

## 1. Hero background — Autocar sur route au lever du soleil

**Section :** Hero landing (background panoramique sous-jacent au chat widget)
**Ratio :** 21:9 (2100x900)
**Usage :** background-image semi-transparent avec overlay `rgba(6,15,20,0.68)` (--petrol-950)

```
Ultra-wide cinematic photograph of a French highway at early dawn. A modern coach bus silhouette seen from behind, driving toward a glowing horizon. Long exposure road light trails in warm amber (#F0A062) and pale ivory white. Sky gradient: deep ink-petrol blue (#060F14) at the very top, transitioning through a rich teal-blue (#0E2A38) in the mid sky, then horizon blue (#3A7B92) near the treeline, then warm amber-gold (#F6B884) just above the horizon line, finally coral-orange at the sun point. Low angle shot, slight mist over dark asphalt reflecting the amber light. No people visible. Shot on medium format, slight grain, editorial travel photography feel. Premium French transport brand. No purple, no neon, no artificial glow. --ar 21:9 --style raw
```

---

## 2. Section "Comment ça marche" — Carte routière manuscrite

**Section :** How it works (background ou illustration colonne gauche)
**Ratio :** 4:3 (1200x900)
**Usage :** illustration editoriale dans la carte de l'étape "On mobilise"

```
Overhead flat-lay photograph of an elegant vintage French road atlas open to a detailed map of France. A thin antique compass with a dark teal (#163F56) face lies beside it. A few handwritten route annotations in fine pencil. Warm morning light entering from a window, casting long soft shadows on ecru (#FAFAF8) paper. Paper texture, ivory and sand tones (#F6B884 warm light accent). Ink lines in deep petrol (#0E2A38). Editorial magazine style, Wallpaper* magazine aesthetics. Premium French travel brand mood. No people. No digital elements. Muted, restrained, refined. --ar 4:3
```

---

## 3. Section "Preuve / Confiance" — Groupe dans un autocar premium

**Section :** Trust section (grande image côté droit ou background)
**Ratio :** 3:2 (1200x800)
**Usage :** image principale de la section confiance

```
Inside a modern premium coach bus, wide-angle shot looking down the aisle toward the passengers. Charcoal grey fabric recline seats, subtle reading lights in warm amber (#F0A062) glow, large panoramic windows showing blurred French countryside bathed in golden hour light. A handful of adult professionals, relaxed, some reading, some looking out the window. No faces clearly visible. Color grading: interior dominated by deep petrol-teal shadow (#0E2A38) with amber accent light pools; exterior through windows appears as soft horizon blue (#3A7B92) and golden haze. Cinematic medium format photograph, editorial travel photography, no stock-photo feel, premium and human, no bright interiors. --ar 3:2 --style raw
```

---

## 4. Chat widget — Illustration agent IA

**Section :** Chat widget avatar ou illustration accompagnatrice
**Ratio :** 1:1 (400x400)
**Usage :** illustration minimaliste pour accompagner le chat

```
Ultra-minimal flat vector illustration on a pure ivory-white (#FAFAF8) background. A single speech bubble silhouette in deep petrol (#0E2A38) with a hairline inner stroke in horizon blue (#3A7B92). Inside the bubble, a tiny blinking cursor mark in warm amber (#F0A062). No decorative elements, no text, no shadows except a subtle 1px drop shadow in petrol at 8% opacity. Extreme Swiss design discipline. Single focal element centered with generous negative space. Premium tech brand mark. No gradients, no glows, no rounded corporate shapes. --ar 1:1 --style raw
```

---

## 5. Section CTA final — Route en perspective avec lumière

**Section :** CTA final (background de la section dawn/amber)
**Ratio :** 16:9 (1600x900)
**Usage :** background subtil sous overlay `rgba(246,184,132,0.72)` (--dawn-300)

```
Cinematic aerial photograph of a perfectly straight French RN highway cutting through vast golden wheat fields at late afternoon, 4 km straight shot toward a sun barely visible at the horizon. Color grade: sky in warm amber (#F0A062) and pale ivory (#FAFAF8), fields in dusty ochre and dry gold, road surface in cool ash-grey with warm light reflections. Slight atmospheric haze in the distance. Very slight film grain. No vehicles, no people. Pure landscape. Shot on a drone at 120m altitude, looking straight along the road axis. Editorial landscape photography, Magnum Photos aesthetic. Deeply warm, saturated amber light. No petrol blue in this image — the image is deliberately the warm counterpoint to the hero. --ar 16:9 --style raw
```

---

## 6. Dashboard — Fond texture neutre

**Section :** Dashboard sidebar ou zones vides
**Ratio :** 1:1 (400x400)
**Usage :** subtle background texture pattern, très discret

```
Extreme close-up macro photograph of fine linen fabric texture, woven in natural ivory and warm sand tones. Tight weave visible, very soft focus on the fibers. Subtle cool-to-warm color shift: the weave's shadows carry a faint deep petrol (#0E2A38) undertone, while the highlight threads catch a delicate warm amber (#F6B884) glow like low morning light grazing the surface. Background tone anchored in ivory (#FAFAF8). Minimal, refined, tactile, premium. No patterns, no logos, no objects. Shot on medium format macro lens, diffuse overhead light. Used as a subtle repeating background texture for a high-end web dashboard. --ar 1:1 --style raw
```

---

## Notes d'implémentation

- Tous les backgrounds devraient avoir un **overlay CSS** pour garantir la lisibilité :
  - Hero : `rgba(10,32,41,0.68)`
  - CTA final : `rgba(246,184,132,0.72)` (dawn-400)
  - Preuve/Confiance : `rgba(14,42,56,0.55)` (petrol-900)
- Compresser en WebP qualité 85 avant mise en production
- Précharger les images hero avec `priority` Next.js
- Alt text descriptifs obligatoires pour accessibilité
