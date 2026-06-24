# NeoTravel — Design System « Aube »

Système de design de **NeoTravel**, plateforme d'intermédiation spécialisée dans le **transport de personnes en groupe** (particuliers, associations, collectivités, entreprises), fondée en 2010.

NeoTravel ne possède pas de flotte. Sa valeur : **qualifier** le besoin, **mobiliser** le bon partenaire autocariste, **négocier** les conditions et **sécuriser** la prestation de bout en bout. Le produit phare est une solution qui automatise le cycle commercial — captation conversationnelle, qualification, tarification déterministe, devis, relances, pilotage — *sans déshumaniser* (l'humain garde les cas complexes, la négociation, la relation).

Le système porte une émotion précise : **la tranquillité de celui qui délègue un problème complexe à un expert**. Atmosphère d'un hall de gare baigné de lumière au petit matin, d'un lever de soleil vu depuis la route, d'un horizon qui se fond du sol au ciel.

## Surfaces produit
- **Landing conversationnelle** — page d'accueil publique ; *la landing EST le chat*. → `ui_kits/landing/`
- **Console direction** — dashboard de pilotage + pipeline + relances + admin des matrices tarifaires. → `ui_kits/console/`

## Sources fournies (cadrage de la mission)
Stockées dans `uploads/` — ne pas supposer que le lecteur y a accès, conservées pour référence :
- `uploads/jour-1-cadrage.md` — dossier de cadrage (diagnostic, process AS-IS/TO-BE, ERD, matrices tarifaires, KPIs, stack Next.js/Supabase/n8n).
- `uploads/jour-2-parcours.md` — parcours client de bout en bout, machine d'état des statuts, flow conversationnel de l'agent, golden dataset.
- `uploads/2-faq-neotravel-v3.pdf` — FAQ pédagogique (25 questions de cadrage).
- `uploads/5-Mot_du_president_Neotravel...pdf` — mot du président Julien Le Viavant (modèle, frictions, valeurs).

> Aucun codebase ni Figma n'a été fourni : l'identité visuelle a été **créée** à partir du brief atmosphérique. Voir CAVEATS en bas.

---

## CONTENT FUNDAMENTALS — comment NeoTravel écrit

**Langue :** français, exclusivement. Accents et typographie française soignés.

**Voix & adresse :** on s'adresse au client en **« vous »** ; NeoTravel parle en **« nous / on »** (« on s'occupe de tout », « on qualifie, on mobilise, on sécurise »). Le « on » est volontaire — chaleureux, proche, jamais corporate.

**Ton :** assuré ET accueillant. On affirme l'expertise **sans arrogance**. Calme, rassurant, fluide. Jamais d'urgence agressive, jamais de jargon asséné au prospect. Le message unique sous-jacent : *la confiance tranquille d'un groupe entre de bonnes mains, du premier contact jusqu'à l'arrivée*.

**Casse :** phrases en casse normale. Capitales réservées aux surtitres/labels courts (« NOTRE MÉTIER ») avec interlettrage large. Pas de Title Case à l'anglaise. Titres en sérif, parfois un fragment en *italique* pour l'accent éditorial (« *On s'occupe de tout.* »).

**Style de phrase :** court, limpide, qui respire. Rythmes ternaires (« qualifier, mobiliser, sécuriser » ; « simple, claire et rassurante »). Le tiret cadratin (—) structure la respiration. Verbes d'action à la 1ʳᵉ personne du pluriel.

**Émotion d'abord, preuve ensuite :** on pose la promesse, puis on prouve le savoir-faire. L'appel à l'action est une **évidence**, pas une sollicitation (« Prêt à confier votre trajet ? », « Demander mon devis »).

**Vocabulaire métier (à respecter) :** *intermédiation, autocariste, qualification, devis, relance, cas complexe (HITL), matrices tarifaires, coefficient, de bout en bout*. Codes de statut techniques (`DD_PRIORITAIRE`, `devis_envoye`) en interne (console) seulement — jamais montrés au prospect.

**Côté console (interne) :** plus direct, dense, informatif. Libellés courts, chiffres tabulaires, statuts explicites. On garde la clarté, on abandonne le lyrisme.

**Emoji :** aucun. Jamais. L'iconographie porte le rôle d'accent visuel.

**Exemples**
- Accroche agent : « Bonjour ! Décrivez-moi votre besoin de transport et je vous prépare un devis en quelques minutes. »
- Promesse : « Vous voyagez en groupe. *On s'occupe de tout.* »
- Preuve : « Notre métier n'est pas de vendre un trajet. C'est de comprendre un besoin, sécuriser une solution et coordonner des partenaires fiables. »
- Escalade : « Votre demande sort de notre périmètre standard. Un conseiller NeoTravel vous recontactera sous 24h. »

---

## VISUAL FOUNDATIONS

**Concept directeur — « Aube ».** La couleur crée la profondeur et le mouvement ; chaque transition chromatique raconte le déplacement et la continuité. On puise dans le raffinement des espaces de transit haut de gamme : fluides, signalétique impeccable, sans friction.

### Couleurs
- **Horizon** (bleu petrol serein) — primaire de marque, signalétique, confiance. `--brand = #2C6378`.
- **Aube** (apricot / golden hour) — accent chaleureux, réservé à l'appel à l'action et aux halos. `--accent = #F0A062`.
- **Petrol** (encre bleu-nuit) — texte (`#0E2A38`) et surfaces sombres premium.
- **Sable & pierre** (neutres chauds) — fond de page `#FBF7F2` (marbre au petit matin), cartes en blanc chaud `#FEFCF9`.
- **États** — positif (sauge `#3E9A77`), attention (ambre `#D9943F`), négatif (terracotta `#C4624E`), urgent (corail `#D55A48`). Tous en versions soft/solid.
- Voir `tokens/colors.css`. Toujours référencer les **alias sémantiques** (`--text-body`, `--surface-card`, `--brand`, `--accent`…), pas les valeurs brutes.

### Typographie
- **Display : Spectral** (sérif) — titres assurés et accueillants, qui respirent. Poids medium ; italique pour l'accent.
- **Texte : Hanken Grotesk** (sans humaniste) — corps limpide, interligne ample (1.6), longueur de ligne ≤ 64ch.
- **Données : JetBrains Mono** — chiffres tabulaires (KPIs, montants, coefficients, codes statut, références devis).
- Échelle généreuse : hero jusqu'à 72px ; corps 17–19px ; jamais sous 13px à l'écran. Voir `tokens/typography.css`.

### Arrière-plans
Les **dégradés signature** sont le cœur visuel :
- `--gradient-dawn` — ciel serein → bande chaude → lueur au sol (héros, sections claires).
- `--gradient-sunrise` — radial chaud (halos, CTA, tuile KPI mise en avant, icônes).
- `--gradient-dusk` — petrol profond (footer, rail console, sections « preuve »).
Pas d'images photo intégrées par défaut (aucune fournie) ; des emplacements (`image-slot`) peuvent être ajoutés. Halos en **dérive lente** (14s) pour suggérer l'avancée. Pas de motifs répétés, pas de texture grain.

### Mouvement
- Easing : `--ease-glide` (cubic-bezier(.22,1,.36,1), sortie longue et douce) pour entrées/CTA ; `--ease-soft` pour les états.
- Durées : fast 180ms · base 320ms · slow 560ms. Dégradés en dérive 14s.
- Le mouvement **suggère l'avancée, jamais la rupture** : fondus + légères translations vers le haut à la révélation (IntersectionObserver), micro-lévitation des cartes au survol. `prefers-reduced-motion` respecté (tout passe à 0ms).

### États interactifs
- **Survol** : élévation douce (translateY -1 à -3px) + ombre renforcée ; les puces de suggestion se réchauffent (passent à l'aube). Liens : couleur brand.
- **Pressé** : léger enfoncement + micro-réduction d'échelle (0.99). Jamais de changement brutal.
- **Focus** : anneau doux 4px couleur horizon (`--ring`), rouge en cas d'erreur.

### Bordures, rayons, ombres
- **Rayons généreux et doux** : champs/cartes `--radius-md` (14px) à `--radius-lg` (20px), boutons & badges en pilule. L'accueil passe par la rondeur.
- **Bordures** discrètes, chaudes (`--border-soft = #EBE3D7`).
- **Ombres diffuses, teintées petrol**, jamais dures — lumière de petit matin. `--shadow-glow` (lueur d'aube) réservé à l'accent.
- **Transparence & flou** : verre dépoli (`backdrop-filter`) pour l'en-tête flottant et le panneau de chat posé sur le dégradé — référence aux espaces de transit. À utiliser sur fond coloré uniquement.

### Cartes
Blanc chaud, coins `--radius-lg`, bordure soft + ombre `--shadow-md` ; variantes `glass` (sur dégradé), `dark` (petrol), `sunken` (creusée). Lévitation au survol si `interactive`.

### Règles de mise en page
- En-tête public **collant** et translucide (flou). Rail console collant pleine hauteur.
- Largeur de contenu max 1200px ; prose étroite 760px.
- Un seul bouton **accent** par vue.

---

## ICONOGRAPHY

- **Set : [Lucide](https://lucide.dev)** (chargé en UMD, épinglé `lucide@0.460.0`). Trait fin (`stroke-width: 1.75`), coins doux, géométrie ouverte — en cohérence avec la signalétique calme et premium des espaces de transit.
- **Helper :** `ui_kits/_shared/Icon.jsx` expose `<Icon name="route" size={20} color="…" strokeWidth={1.75} />`. Le CSS `.nt-ico svg{width:100%;height:100%}` permet de dimensionner par le conteneur.
- **Icônes courantes :** `sparkles` (agent IA), `route` / `map-pin` (trajet), `users` (passagers/capacité), `calendar` (dates), `shield-check` (sécuriser/garde-fou), `message-circle` (qualifier), `gauge` (pilotage), `bell` (relances), `sliders-horizontal` (matrices), `arrow-right` / `arrow-up` (action), `clock` / `timer` (délais), `sun-snow` (saison), `file-text` (devis).
- **SVG de marque** dans `assets/` (logo, marque, version claire) — voir ci-dessous.
- **Emoji :** jamais. **Caractères unicode comme icônes :** seulement le chevron `▾` du Select natif et `→` ponctuel. Sinon, toujours Lucide.

> Substitution éventuelle : si un projet consommateur ne peut charger Lucide via CDN, remplacer par un set équivalent (même graisse de trait) — Feather ou Phosphor (light).

---

## INDEX / MANIFESTE

**Racine**
- `styles.css` — point d'entrée global (uniquement des `@import`). Les consommateurs lient ce seul fichier.
- `readme.md` — ce guide. `SKILL.md` — invocation en tant qu'Agent Skill.

**Tokens** (`tokens/`)
- `fonts.css` (familles + import Google Fonts), `colors.css`, `typography.css`, `spacing.css`, `effects.css` (dégradés, ombres, flou, mouvement).

**Composants** (`components/`) — primitives React, importables via `window.NeoTravelDesignSystem_389d31`
- `core/` — **Button** (primary · accent · secondary · ghost · dark), **Card** (raised · flat · sunken · glass · dark), **Badge**, **Avatar**.
- `forms/` — **Input**, **Select**.
- `chat/` — **ChatBubble** (agent/prospect/typing), **SuggestionChip**.
- `data/` — **StatusBadge** (+ `LEAD_STATUSES`, machine d'état complète), **StatCard** (tuile KPI).

**UI kits** (`ui_kits/`)
- `landing/` — landing conversationnelle (showpiece). `index.html` + `LandingChrome`, `HeroChat`, `Narrative`.
- `console/` — console direction. `index.html` + `ConsoleShell`, `DashboardViews`, `MatricesView`.
- `_shared/Icon.jsx` — helper d'icône Lucide partagé.

**Spécimens** (`guidelines/`) — cartes de l'onglet Design System : Couleurs (×4), Typographie (×3), Espacement (×2), Marque (×3).

**Assets** (`assets/`) — `neotravel-logo.svg`, `neotravel-logo-light.svg`, `neotravel-mark.svg`.

---

## CAVEATS
- **Polices :** aucun fichier de police n'ayant été fourni, **Spectral / Hanken Grotesk / JetBrains Mono** sont chargées depuis **Google Fonts** (via `@import` dans `tokens/fonts.css`) plutôt qu'auto-hébergées. Ce ne sont pas des substitutions — ce sont les polices retenues pour l'identité — mais le compilateur ne détecte pas de `@font-face` local. → *Si vous souhaitez auto-héberger, fournissez-moi les binaires (woff2) et j'écrirai les `@font-face`.*
- **Identité créée, non recréée :** sans codebase ni Figma, le langage visuel (« Aube ») est une proposition à partir du brief atmosphérique. → *Dites-moi si la direction chromatique/typographique vous parle, ou si vous voulez explorer une autre piste.*
- **Logo :** marque « soleil levant sur la route » conçue comme proposition. → *Si NeoTravel a déjà un logo officiel, envoyez-le et je l'intègre.*
- **Images :** aucune photographie intégrée (aucune fournie). Les fonds reposent sur les dégradés. → *Fournissez des visuels (gare, autocar, route au lever du jour) si vous en voulez.*
- **Iconographie :** Lucide via CDN (voir ci-dessus).
