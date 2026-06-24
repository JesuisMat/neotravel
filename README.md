# NeoTravel

Repo du projet NeoTravel — Epitech.

## Structure

```
neo-travel-repo/
├── app/              # Application Next.js (App Router)
├── public/           # Assets statiques
├── design-system/    # Design system NeoTravel (tokens, composants, guidelines)
├── docs/             # Documentation métier et technique
└── output-docs/      # Docs générées (cadrage, parcours)
```

## Lancer le projet

```bash
npm install
npm run dev
```

L'app tourne sur [http://localhost:3000](http://localhost:3000).

## Stack

- **Next.js 15** — App Router
- **TypeScript**
- **Tailwind CSS**

## Déploiement sur Vercel

1. Importer le repo sur [vercel.com](https://vercel.com)
2. Vercel détecte automatiquement Next.js — aucune config supplémentaire
3. Définir les variables d'environnement dans **Settings > Environment Variables** si besoin
4. Chaque push sur `main` déclenche un déploiement automatique
