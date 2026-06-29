# NeoTravel

## · Documentation de passation ·
## · Procédure repreneur ·

*Livrable L3 — remis le 29/06/2026*

*Groupe 21 — Léna Pedelahore, Juliette Brisard, Alan Teurroc, Matthieu Baric*

---

## Table des matières

1. [Vue d'ensemble du système](#1-vue-densemble-du-système)
2. [Installation et lancement en local](#2-installation-et-lancement-en-local)
3. [Structure du projet](#3-structure-du-projet)
4. [L'agent IA](#4-lagent-ia)
5. [calculer_devis() — la fonction critique](#5-calculer_devis--la-fonction-critique)
6. [Table de distances](#6-table-de-distances)
7. [Base de données Supabase](#7-base-de-données-supabase)
8. [API Routes — référence complète](#8-api-routes--référence-complète)
9. [Emails — templates et envoi](#9-emails--templates-et-envoi)
10. [n8n — workflow de relances](#10-n8n--workflow-de-relances)
11. [Dashboard direction](#11-dashboard-direction)
12. [Machine d'état des leads](#12-machine-détat-des-leads)
13. [Déploiement](#13-déploiement)
14. [Tests et validation](#14-tests-et-validation)
15. [Sécurité](#15-sécurité)
16. [Angles morts et points d'attention](#16-angles-morts-et-points-dattention)

---

## 1. Vue d'ensemble du système

### Architecture générale

Le système repose sur quatre briques qui communiquent entre elles. **n8n ne touche jamais directement Supabase** — c'est une règle architecturale fondamentale.

| Brique | Technologie | Rôle |
|---|---|---|
| Frontend + Agent IA | Next.js (App Router) / Vercel AI SDK | Interface conversationnelle, orchestration agent, API routes |
| Base de données / CRM | Supabase (PostgreSQL) | Stockage demandes, devis, relances, logs |
| Workflow relances | n8n Cloud | Timing des relances, envoi emails de suivi. Ne touche pas Supabase directement. |
| Envoi emails | Resend + React Email | Devis PDF et relances. Templates dans le repo (React et HTML). |

### Ce que le code fait vs ce que n8n fait

**Dans le code (Next.js) — logique métier stable :**
- `calculer_devis()` : fonction déterministe pure, zéro LLM, zéro appel réseau
- Génération PDF (`@react-pdf/renderer`)
- Agent IA : collecte, qualification, escalade HITL
- Envoi email devis initial (Resend)
- Vérification d'éligibilité relance (`/api/internal/leads/:id/status`)
- Mise à jour des statuts et logs
- Dashboard direction

**Dans n8n — logique opérationnelle modifiable sans code :**
- Timing des relances (Wait nodes)
- Envoi des emails de relance 1 et 2
- Condition IF avant envoi (vérifie le statut)

### Flux nominal de bout en bout

```
T+0 min   Prospect arrive sur la landing
T+1 min   Conversation avec l'agent IA (collecte info)
T+2 min   calculer_devis() → résultat + PDF généré
T+3 min   Email devis envoyé → statut = devis_envoye
T+3 min   n8n webhook déclenché → Wait 72h (standard) ou 48h (urgent)
J+3       n8n vérifie éligibilité → envoie email relance 1 si eligible
J+7       n8n vérifie éligibilité → envoie email relance 2 si eligible
```

---

## 2. Installation et lancement en local

### Prérequis

- Node.js 20 ou supérieur
- Compte Supabase (gratuit)
- Compte Resend (gratuit)
- Compte n8n Cloud (gratuit) OU n8n en local
- Compte Vercel AI Gateway (pour l'accès à Claude Haiku)

### Cloner et installer

```bash
git clone [URL du repo]
cd neo-travel-repo
npm install
```

### Variables d'environnement

Créer un fichier `.env.local` à la racine :

```env
# LLM — Vercel AI Gateway
AI_GATEWAY_API_KEY=vck_...
AI_GATEWAY_URL=https://ai-gateway.vercel.sh

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://[project-id].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...
SUPABASE_SERVICE_ROLE_KEY=eyJ...

# Resend (emails devis + relances)
RESEND_API_KEY=re_...

# Sécurité endpoints internes n8n
INTERNAL_API_KEY=neotravel_internal_2026   # À changer en production

# App URL (pour les liens dans les emails)
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Emails
EMAIL_FROM=onboarding@coble.fr
EMAIL_COMMERCIAL=commercial@neotravel.fr

# n8n
N8N_WEBHOOK_URL=https://[instance].n8n.cloud/webhook-test/[id]
# En production : remplacer webhook-test par webhook
```

### Lancer en développement

```bash
npm run dev
# Application disponible sur http://localhost:3000
```

### Lancer les tests

```bash
npm run test
npm run test -- --coverage
```

---

## 3. Structure du projet

```
neo-travel-repo/
│
├── app/
│   ├── page.tsx                          # Landing conversationnelle (chat)
│   ├── layout.tsx                        # Layout global + fonts
│   ├── acces/page.tsx                    # Page d'accès protégée
│   ├── dashboard/
│   │   ├── page.tsx                      # Dashboard direction (Server Component)
│   │   ├── DashboardClient.tsx           # Dashboard (Client Component, KPIs + pipeline)
│   │   └── equipe/page.tsx               # Page équipe
│   └── api/
│       ├── chat/route.ts                 # ★ Route principale agent IA (streamText)
│       ├── leads/[id]/
│       │   └── decision/route.ts         # ★ Capture liens signés (accepte/refuse/rappel)
│       ├── dashboard/
│       │   ├── leads/[id]/
│       │   │   ├── send-devis/route.ts   # ★ Envoi devis HITL par commercial
│       │   │   ├── update-statut/route.ts # Mise à jour statut depuis dashboard
│       │   │   └── confirm/route.ts      # Confirmation agent réservation
│       │   └── devis/pdf/route.ts        # Génération PDF à la demande
│       ├── email/
│       │   ├── send-devis/route.ts       # Envoi email direct (non utilisé en prod)
│       │   └── notify-commercial/route.ts # Notification commercial HITL
│       ├── internal/
│       │   └── leads/
│       │       ├── [id]/
│       │       │   ├── status/route.ts   # ★ Statut pour n8n (avant relance)
│       │       │   ├── send-relance/route.ts  # Envoi relance depuis interne
│       │       │   └── send-followup/route.ts # Followup interne
│       │       └── pending-followup/route.ts  # ★ Polling leads éligibles pour n8n
│       └── devis/
│           ├── calculate/route.ts        # Calcul devis à la demande (dev/test)
│           └── sample/route.ts           # Sample devis (dev/test)
│
├── lib/
│   ├── agent/
│   │   ├── tools.ts                      # ★ Outils disponibles pour l'agent (Zod + Supabase)
│   │   └── system-prompt.ts              # ★ Prompt système de l'agent
│   ├── devis/
│   │   ├── calculer-devis.ts             # ★ Fonction déterministe core
│   │   ├── matrices.ts                   # ★ Toutes les matrices tarifaires + forfaits km
│   │   ├── regles.ts                     # ★ Fonctions de détermination (urgence, saison, capacité)
│   │   ├── distances.ts                  # ★ Table 378 paires + estimerDistance()
│   │   ├── types.ts                      # Types TypeScript (CalculerDevisParams, ResultatDevis...)
│   │   ├── schema.ts                     # Schéma Zod du devis
│   │   └── index.ts                      # Export barrel
│   ├── email/
│   │   ├── send-devis.ts                 # ★ sendDevisEmail() + notifyCommercial() + sendRelanceEmail()
│   │   └── templates/
│   │       ├── devis-template.tsx        # Template email devis (React Email)
│   │       ├── n8n-relance-1.html        # ★ Template relance 1 (HTML pur, variables n8n)
│   │       └── n8n-relance-2.html        # ★ Template relance 2 (HTML pur, variables n8n)
│   ├── n8n/
│   │   └── trigger-webhook.ts            # ★ triggerN8nWorkflow() — déclenche le webhook n8n
│   ├── pdf/
│   │   └── generate-devis.ts             # Génération PDF (@react-pdf/renderer)
│   └── supabase/
│       ├── client.ts                     # Client Supabase (côté navigateur)
│       ├── server.ts                     # createAdminClient() (service role, côté serveur)
│       └── types.ts                      # Types TypeScript générés depuis Supabase
│
├── project-doc/
│   ├── jour-1-cadrage.md                 # Dossier de cadrage initial
│   ├── jour-1-reponses-attendues.md      # Réponses aux 5 questions du Jour 1
│   ├── jour-2-parcours.md                # Parcours client et machine d'état
│   ├── regle_calcul_quote.md             # Règles tarifaires officielles (source)
│   ├── distance-ville.csv                # CSV source des distances routières
│   ├── NeoTravel_L2_Dossier_Cadrage.md   # Livrable L2 (ce dossier enrichi)
│   └── NeoTravel_L3_Passation.md         # Livrable L3 (ce document)
│
├── __tests__/                            # Tests Jest (calculer_devis, distances, regles)
├── CLAUDE.md → @AGENTS.md               # Instructions pour l'agent IA dev
└── AGENTS.md                            # Instructions projet
```

Les fichiers marqués ★ sont les plus critiques à comprendre en premier.

---

## 4. L'agent IA

### Modèle et configuration

- **Modèle :** `claude-haiku-4-5-20251001` (Claude Haiku 4.5)
- **Provider :** Vercel AI Gateway (`@ai-sdk/gateway`)
- **SDK :** Vercel AI SDK (`streamText`)
- **Température :** 0.3 (réponses cohérentes, peu créatives)
- **Max steps :** 10 (garde-fou anti-boucle)
- **Runtime :** Node.js (pas Edge — `@react-pdf/renderer` est incompatible Edge)
- **Max duration :** 60 secondes

### Où modifier le comportement de l'agent

**Prompt système :** `lib/agent/system-prompt.ts` — variable `SYSTEM_PROMPT`

C'est un texte simple structuré en sections :
- Flux conversationnel (6 étapes)
- Règles HITL (critères d'escalade)
- Règles absolues
- Tableau véhicules / options / ton

**Attention :** toute modification du prompt doit être testée sur les scénarios de démo (§17 du L2) avant mise en production.

**Contexte temporel :** la route `/api/chat/route.ts` injecte automatiquement la date/heure courante (Europe/Paris) dans le prompt à chaque requête — l'agent peut ainsi détecter les dates passées et calculer les codes urgence.

### Outils disponibles pour l'agent

Définis dans `lib/agent/tools.ts` :

| Outil | Déclenchement | Ce qu'il fait |
|---|---|---|
| `calculer_et_enregistrer_devis` | Quand toutes les infos sont collectées et validées | Calcule le devis, INSERT dans Supabase (demande + devis), retourne les IDs |
| `envoyer_devis_email` | Immédiatement après `calculer_et_enregistrer_devis` | Envoie l'email (PDF joint), met à jour `email_envoye_at`, déclenche le webhook n8n, INSERT log |
| `escalader_hitl` | Dès qu'un critère HITL est détecté | INSERT demande en statut `complexe`, envoie notification commerciale |
| `sauvegarder_contexte` | Périodiquement pendant la conversation | UPDATE contexte_chat en BDD (sauvegarde partielle) |

### Séquence outil obligatoire

```
1. calculer_et_enregistrer_devis()    ← retourne: demande_id, devis_id, decision_token, prix_ttc, lignes, coefficients
2. IMMÉDIATEMENT: envoyer_devis_email() ← utilise tous les champs retournés par l'étape 1
```

L'agent ne doit pas laisser passer d'échange intermédiaire entre ces deux appels. C'est une règle explicite dans le prompt système.

### Déclenchement du webhook n8n

Le webhook n8n est déclenché dans `toolEnvoyerDevis` (dans `lib/agent/tools.ts`) **après** l'envoi de l'email, uniquement si `origine_demande != complexe_hitl` et `origin_demande != rappel_demande`.

La fonction `triggerN8nWorkflow()` (`lib/n8n/trigger-webhook.ts`) :
- Est non-bloquante : une erreur réseau ne fait pas échouer l'envoi du devis
- Filtre silencieusement les leads HITL
- Construit les URLs signées (`accept_url`, `refuse_url`, `rappel_url`, `status_url`)
- Log les erreurs en `console.error`

---

## 5. calculer_devis() — la fonction critique

`lib/devis/calculer-devis.ts`

### Ce que c'est

Fonction TypeScript **pure** et **déterministe**. Zéro appel LLM. Zéro appel réseau. Zéro effet de bord.

Un devis est un engagement commercial : il doit être reproductible et auditable. C'est pourquoi le calcul du prix ne passe jamais par le raisonnement du LLM.

### Signature

```typescript
calculer_devis(params: {
  nb_passagers: number        // 1 à 85 — au-delà, erreur → escalade HITL
  date_depart: string | Date  // Format YYYY-MM-DD ou objet Date
  date_demande?: string | Date // Défaut = maintenant (pour code urgence)
  date_retour?: string | Date  // Si présent → aller/retour (base × 2)
  distance_km: number         // Fourni par estimerDistance()
  type_vehicule: TypeVehicule // Inféré depuis nb_passagers
  options?: ('guide' | 'nuit_chauffeur' | 'peages')[]
}) → ResultatDevis
```

### Valeurs de retour (`ResultatDevis`)

```typescript
{
  base_km: { libelle: string; montant: number }
  coefficients: { type: string; code: string; valeur: number }[]
  options: { libelle: string; montant: number; nb_unites: number }[]
  sous_total_ht: number
  marge: { libelle: string; montant: number }
  prix_ht: number
  tva: { libelle: string; montant: number }
  prix_ttc: number
  urgence_code: 'DD_PRIORITAIRE' | 'DD_URGENT' | 'DD_NORMAL' | 'DD_3MOISETPLUS'
  saison_niveau: 'basse' | 'moyenne' | 'haute' | 'tres_haute'
  devise: 'EUR'
  lignes: { libelle: string; montant: number }[]  // Décomposition complète pour le PDF
}
```

### Erreurs levées

| Condition | Erreur |
|---|---|
| `nb_passagers <= 0` | "Le nombre de passagers doit être strictement positif." |
| `nb_passagers > 85` | "Nombre de passagers (...) supérieur au maximum géré (85). Cas complexe : escalade HITL requise." |
| `distance_km <= 0` | "La distance doit être strictement positive." |
| `date_depart` invalide | "La date de départ est invalide." |
| `date_depart < date_demande` | "La date de départ ne peut pas être antérieure à la date de demande." |
| `type_vehicule` inconnu | "Type de véhicule inconnu : ..." |

### Modifier les matrices tarifaires

Les matrices sont dans `lib/devis/matrices.ts`. C'est **le seul fichier à modifier** si les tarifs changent.

Structure :
- `FORFAIT_KM` — grille forfaitaire ≤ 180 km (tableau de tranches)
- `calculerBaseDistance()` — logique de lookup (ne pas toucher)
- `MATRICE_SAISONNALITE` — 4 niveaux, coefficients
- `MATRICE_URGENCE` — 4 codes, écarts en heures, coefficients
- `MATRICE_CAPACITE` — 5 tranches passagers, coefficients
- `MATRICE_OPTIONS` — guide / nuit_chauffeur / péages, tarifs
- `TAUX_TVA` = 0.1 (10%)
- `TAUX_MARGE_COMMERCIALE` = 0.15 (15%)
- `MAX_PASSAGERS` = 85

**Ne jamais toucher à `calculer-devis.ts` pour ajuster les prix.** Modifier uniquement `matrices.ts`.

### Inférence du type de véhicule

```typescript
// Dans lib/agent/tools.ts et app/api/dashboard/leads/[id]/send-devis/route.ts
function inferTypeVehicule(nb: number): TypeVehicule {
  if (nb <= 19) return "minibus_19";
  if (nb <= 53) return "autocar_53";
  if (nb <= 63) return "autocar_63";
  if (nb <= 67) return "autocar_67";
  return "autocar_85";
}
```

---

## 6. Table de distances

`lib/devis/distances.ts`

### Description

Table statique de **378 paires routières réelles** entre **28 villes françaises**, compilée depuis le CSV officiel fourni (`project-doc/distance-ville.csv`).

### Fonction principale

```typescript
estimerDistance(origine: string, destination: string): { km: number; estime: boolean }
```

- Normalise les noms (minuscules, sans accents, tirets → espaces)
- Cherche dans la table symétrique (`"ville_a|ville_b"`)
- Cherche avec des **aliases** (ex: "saint-etienne" → "saint etienne", "clermont" → "clermont ferrand")
- Si non trouvé : estimation géographique (haversine × 1.25) avec `estime: true`

### Comportement en cas de distance estimée

- L'agent signale : "La distance a été estimée à [X] km — notre équipe affinera si nécessaire."
- Le commercial peut corriger via le formulaire HITL du dashboard
- Le flag `distance_estimee` est stocké dans `parametres_calcul` du devis

### Ajouter une nouvelle ville

1. Ajouter les entrées dans la constante `TABLE` (format `"ville_a|ville_b": km`)
2. Ajouter les aliases si nécessaire dans la constante `ALIASES`
3. La table est symétrique : pas besoin d'ajouter dans les deux sens (le lookup fait les deux)

---

## 7. Base de données Supabase

### Connexion

Deux clients disponibles dans `lib/supabase/` :

| Client | Fichier | Usage |
|---|---|---|
| Anonyme | `client.ts` | Côté navigateur uniquement (lecture limitée par RLS) |
| Admin | `server.ts` — `createAdminClient()` | Côté serveur uniquement, toutes les API routes — accès total |

**Règle absolue :** `SUPABASE_SERVICE_ROLE_KEY` ne doit jamais être exposée côté client.

### Tables principales

#### `demandes`

Cœur du CRM. Contient toutes les informations sur le prospect et sa demande.

Champs critiques pour la machine d'état :
- `statut` — voir §12 pour tous les statuts possibles
- `origine_demande` — `standard` / `complexe_hitl` / `rappel_demande` (garde-fou n8n)
- `score_completude` — 0 à 100 (100 = tous les champs remplis)
- `contexte_chat` — JSONB, historique de la conversation stocké pour HITL

#### `devis`

Un enregistrement par devis envoyé (une demande peut avoir plusieurs devis — HITL notamment).

Champs critiques :
- `decision_token` — UUID unique, inclus dans tous les liens email signés
- `decision` — `accepte` / `refuse` / `null` (null = en attente)
- `prochaine_relance` — timestamp de la prochaine relance planifiée. **`null` = aucune relance possible**, quelle qu'en soit la raison (refus, acceptation, rappel, escalade)
- `nb_relances` — compteur (0/1/2), utilisé pour savoir si on est en relance_1 ou relance_2
- `email_envoye_at` — timestamp d'envoi de l'email initial

#### `relances`

Historique de toutes les relances envoyées.

#### `logs`

Traçabilité complète de toutes les actions. Actions loguées :
- `devis_envoye` (source: agent)
- `devis_complexe_envoye` (source: user — commercial via dashboard)
- `escalade_hitl` (source: agent)
- `decision_accepte` (source: user — prospect via lien signé)
- `opt_out_email` (source: user — prospect via lien refus)
- `decision_rappel` → complexe (source: user — prospect via lien rappel)

### Row Level Security (RLS)

Le RLS est activé. La clé `ANON_KEY` (côté client) n'a accès qu'en lecture aux données nécessaires. Toutes les écritures se font via `createAdminClient()` (service role) côté serveur.

### Transactions atomiques

La route `/api/leads/[id]/decision` tente d'abord une RPC `traiter_decision_devis` (transaction atomique côté Supabase). Si la RPC n'est pas disponible, elle exécute les updates en séquence (fallback). En production, préférer la RPC.

---

## 8. API Routes — référence complète

### Routes publiques (accessibles sans auth)

#### `POST /api/chat`

Route principale de l'agent IA. Reçoit les messages du prospect et retourne un stream.

```json
Body: { "messages": [{ "role": "user", "content": "..." }, ...] }
```

Retourne : `UIMessageStreamResponse` (Vercel AI SDK)

#### `GET /api/leads/[id]/decision`

Capture la décision du prospect via lien signé depuis l'email.

```
?token=[decision_token]&status=accepte|refuse|rappel
```

Retourne une page HTML de confirmation (pas de JSON).

Comportement :
- `accepte` → statut = `accepte_prospect`, `decision = "accepte"`, notification commercial
- `refuse` → statut = `refuse`, `decision = "refuse"`, `prochaine_relance = null`, log `opt_out_email`
- `rappel` → statut = `complexe`, `origine_demande = "rappel_demande"`, `prochaine_relance = null`, notification commercial

### Routes internes (protégées par `x-n8n-secret`)

#### `GET /api/internal/leads/[id]/status`

Vérifié par n8n avant chaque email de relance.

**Header requis :** `x-n8n-secret: [INTERNAL_API_KEY]`

```json
// Réponse 200 — éligible
{ "eligible": true, "statut": "devis_envoye", "id": "...", "email": "...", "nom": "..." }

// Réponse 200 — non éligible
{ "eligible": false, "statut": "refuse", "raison": "opt_out — prospect a refusé", "id": "..." }

// Réponse 401
{ "error": "Unauthorized" }
```

Statuts bloquants (eligible = false) : `accepte_prospect`, `confirme`, `refuse`, `cloture`, `complexe`

#### `GET /api/internal/leads/pending-followup`

Polling alternatif pour n8n (toutes les heures si configuré).

**Header requis :** `x-n8n-secret: [INTERNAL_API_KEY]`

Retourne un tableau plat de leads avec `prochaine_relance <= now()`.

Garde-fous intégrés dans la query :
- `statut IN ('devis_envoye', 'relance_1')` uniquement
- `origine_demande NOT IN ('complexe_hitl', 'rappel_demande')`
- `prochaine_relance IS NOT NULL`

### Routes dashboard (protégées par `x-internal-secret`)

#### `POST /api/dashboard/leads/[id]/send-devis`

Envoi d'un devis HITL par le commercial depuis le dashboard.

Requis : demande avec `statut = complexe`.

**Important :** cette route ne déclenche PAS le webhook n8n (les cas HITL sont exclus du workflow automatique).

Body : tous les champs du devis (origine, destination, date_depart, nb_passagers, options, etc.)

Seuil de sécurité : si `prix_ttc > 15 000 €` → retourne 422, traitement manuel requis.

#### `POST /api/dashboard/leads/[id]/confirm`

Confirmation par l'agent de réservation. Passe le statut de `accepte_prospect` à `confirme`.

#### `POST /api/dashboard/leads/[id]/update-statut`

Mise à jour manuelle du statut depuis le dashboard.

---

## 9. Emails — templates et envoi

### Architecture email

Toutes les fonctions d'envoi sont dans `lib/email/send-devis.ts`.

| Fonction | Usage |
|---|---|
| `sendDevisEmail()` | Email devis initial + PDF joint (prospect) |
| `notifyCommercial()` | Notification HITL au commercial |
| `sendRelanceEmail()` | Relance depuis Next.js (non utilisé par n8n — n8n gère ses propres emails) |

### Email devis initial

Template : `lib/email/templates/devis-template.tsx` (React Email + JSX)

Design : fond `#f8f7f4`, carte blanche, header `#1a1a2e` (navy), accent `#c8a97e` (or).

Contenu :
- Header NeoTravel + titre
- Carte trajet (origine → destination + date départ)
- Montant TTC en gros
- 3 boutons : "J'accepte ce devis", "Je souhaite être rappelé", "Je ne suis pas intéressé"
- Footer discret

Le PDF est joint en pièce jointe si `lignes` et `prix_ht` sont disponibles.

**Variables `from` et `to` :**
- `EMAIL_FROM` (env) → expéditeur (ex: `onboarding@coble.fr`)
- `EMAIL_COMMERCIAL` (env) → destinataire des notifications HITL
- Destinataire prospect : `params.email`

### Templates relances n8n

Fichiers HTML purs dans `lib/email/templates/` avec variables n8n (`{{ $json.body.prenom }}`).

| Variable n8n | Champ email |
|---|---|
| `{{ $json.body.prenom }}` | Prénom (premier mot du nom) |
| `{{ $json.body.origine }}` | Ville de départ |
| `{{ $json.body.destination }}` | Destination |
| `{{ $json.body.date_depart }}` | Date de départ |
| `{{ $json.body.prix_ttc }}` | Montant TTC (en €) |
| `{{ $json.body.accept_url }}` | Lien "J'accepte" |
| `{{ $json.body.refuse_url }}` | Lien "Je refuse" |
| `{{ $json.body.rappel_url }}` | Lien "Je souhaite être rappelé" |

**Relance 1** (`n8n-relance-1.html`) : ton doux, "votre devis est toujours disponible".

**Relance 2** (`n8n-relance-2.html`) : ton plus direct, "dernière occasion", mention explicite que c'est le dernier message.

---

## 10. n8n — workflow de relances

### Accès

Se connecter sur `app.n8n.cloud` avec les identifiants de l'équipe.

### Architecture du workflow

Le workflow est déclenché par **webhook** (pas par polling Schedule). À chaque envoi de devis standard, `triggerN8nWorkflow()` envoie un POST au webhook n8n avec toutes les données nécessaires.

```
[Webhook Trigger]
    │  Reçoit: demande_id, devis_id, email, prenom, nom, origine,
    │          destination, date_depart, prix_ttc, decision_token,
    │          accept_url, refuse_url, rappel_url, status_url
    ▼
[Wait Node] — 48h (urgent) ou 72h (standard)
    │  Note: Pour la démo → réduire à 2 minutes
    ▼
[HTTP Request Node] — GET status
    │  URL: {{ $json.body.status_url }}
    │  Header: x-n8n-secret = [INTERNAL_API_KEY]
    ▼
[IF Node] — {{ $json.eligible }} === true
    ├── TRUE  →
    │         [Send Email] — template n8n-relance-1.html
    │         from: EMAIL_FROM via Resend (ou SMTP direct)
    │         [Wait Node] — 72h (ou 2 min en démo)
    │         [HTTP Request Node] — GET status (re-vérif)
    │         [IF Node] — eligible
    │         ├── TRUE  → [Send Email] — n8n-relance-2.html
    │         └── FALSE → Stop
    └── FALSE → Stop
```

### URL du webhook

En développement : utiliser l'URL `webhook-test` (n8n doit être en mode "test" — listening actif).

En production : utiliser l'URL `webhook` (workflow activé dans n8n).

```env
# Local
N8N_WEBHOOK_URL=https://[instance].n8n.cloud/webhook-test/[uuid]

# Production
N8N_WEBHOOK_URL=https://[instance].n8n.cloud/webhook/[uuid]
```

### Modifier les délais de relance

Dans chaque Wait Node, changer la durée. Sauvegarder et activer. **Aucune modification de code nécessaire.**

**Configuration démo :** 2 minutes.
**Configuration production :** 48h (urgent) / 72h (standard) pour la relance 1, puis 72h pour la relance 2.

### Leads exclus du workflow n8n

Les leads suivants ne reçoivent **jamais** de webhook n8n :
- `origine_demande = complexe_hitl` (cas HITL initial)
- `origine_demande = rappel_demande` (prospect a cliqué "Je veux être rappelé")

Cette exclusion est garantie à deux niveaux :
1. Dans `triggerN8nWorkflow()` : vérification avant envoi du webhook
2. Dans `/api/internal/leads/pending-followup` : garde-fou SQL dans la query

---

## 11. Dashboard direction

### Accès

URL : `/dashboard`

Protection : la page vérifie une variable de session simple (à renforcer en production si nécessaire).

### Vues disponibles

| Onglet | Description |
|---|---|
| **Pipeline** | Liste de tous les leads avec statut, filtres, actions rapides |
| **Pilotage** | KPIs globaux, entonnoir de conversion, graphiques |
| **Cas complexes** | Sous-onglets "En attente" et "Historique HITL" |

### Filtre par mois

En-tête du dashboard : `<select>` permettant de filtrer tous les leads par mois (`YYYY-MM`). Les KPIs, graphiques et listes sont tous recalculés localement en JavaScript depuis les données déjà chargées.

### KPIs calculés

À partir des leads filtrés par mois :

| KPI | Calcul |
|---|---|
| Taux conversion | `confirmes / total_leads × 100` |
| Qualif. automatique | `(total - leads_hitl) / total × 100` |
| Panier moyen | Somme des montants TTC / nombre de devis envoyés |
| Pipeline actif | Somme des montants TTC des leads en cours (devis_envoye, relance_1, relance_2) |

### Actions depuis le dashboard

- Voir le détail d'un lead (modal ou page dédiée)
- Pour les cas complexes : formulaire d'envoi de devis (`send-devis/route.ts`)
- Confirmation après acceptation (`confirm/route.ts`)
- Mise à jour manuelle du statut (`update-statut/route.ts`)

### Données chargées

Le Server Component `app/dashboard/page.tsx` effectue une requête Supabase unique qui charge tous les leads avec leurs devis. Le Client Component `DashboardClient.tsx` filtre et calcule localement. Pas de requête API côté client — optimisation perf.

---

## 12. Machine d'état des leads

### Tous les statuts

| Statut | Déclencheur | Relances auto possibles |
|---|---|---|
| `nouveau` | Première interaction prospect | Non |
| `en_qualification` | Agent collecte les infos | Non |
| `complet` | Toutes les infos collectées | Non |
| `devis_envoye` | Email envoyé avec succès | **Oui** — prochaine_relance définie |
| `relance_1` | Première relance envoyée par n8n | **Oui** — prochaine_relance mis à jour |
| `relance_2` | Deuxième relance envoyée | Non (cloture à venir) |
| `accepte_prospect` | Prospect clique "J'accepte" dans l'email | Non — prochaine_relance = null |
| `confirme` | Agent réservation confirme manuellement | Non |
| `refuse` | Prospect clique "Je refuse" | Non — prochaine_relance = null, opt_out logué |
| `complexe` | Critère HITL atteint OU prospect clique "Rappel" | Non — prochaine_relance = null |
| `cloture` | 2 relances sans réponse, ou commercial clôture | Non |

### Règle sentinelle : `prochaine_relance`

`NULL` sur le champ `prochaine_relance` est la sentinelle universelle. Tant que ce champ est NULL, aucune relance automatique n'est possible, quelle que soit la raison.

Il est mis à NULL dans les cas suivants :
- Acceptation prospect (lien signé)
- Refus prospect (lien signé)
- Demande de rappel (lien signé)
- Escalade HITL initiale

### Transitions depuis `complexe`

Uniquement via le dashboard (action commerciale) :
- → `devis_envoye` : commercial envoie un devis adapté via `send-devis/route.ts`
- → `refuse` : commercial clôture sans suite
- → `cloture` : commercial abandonne le dossier

---

## 13. Déploiement

### Déploiement sur Vercel

```bash
git push origin main
# Vercel détecte le push et redéploie automatiquement
```

### Variables d'environnement à configurer sur Vercel

Dans Settings > Environment Variables :

```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
SUPABASE_SERVICE_ROLE_KEY
AI_GATEWAY_API_KEY
AI_GATEWAY_URL
RESEND_API_KEY
EMAIL_FROM
EMAIL_COMMERCIAL
N8N_WEBHOOK_URL          ← URL prod (webhook/, pas webhook-test/)
INTERNAL_API_KEY
NEXT_PUBLIC_APP_URL      ← URL de production (ex: https://neotravel.vercel.app)
```

### Checklist post-déploiement

1. Ouvrir l'URL de production
2. Démarrer une conversation et aller jusqu'à l'envoi du devis
3. Vérifier que l'email de devis arrive (avec PDF)
4. Vérifier dans Supabase que le lead est créé avec `statut = devis_envoye`
5. Vérifier dans n8n que le webhook a bien été reçu (logs du workflow)
6. Tester les liens signés (accepte / refuse / rappel) depuis l'email
7. Vérifier le dashboard direction : lead visible avec bon statut

### Points de vigilance

- **`N8N_WEBHOOK_URL`** : en local, utiliser `webhook-test`. En production, utiliser `webhook` (workflow actif dans n8n). C'est la source de panne la plus fréquente.
- **`NEXT_PUBLIC_APP_URL`** : sans slash final. Si mal configuré, les liens signés dans les emails seront cassés.
- **Supabase Free** : le projet se met en veille après 1 semaine d'inactivité. Pinger la base la veille de la soutenance.

---

## 14. Tests et validation

### Lancer les tests

```bash
npm run test
npm run test -- --coverage
```

### Scénarios de test impératifs pour `calculer_devis()`

| Scénario | Données | Résultat attendu |
|---|---|---|
| Cas nominal | 50 pax, Paris→Lyon (476 km), date dans 5 semaines, mai | Base: 2380€, saison +15%, urgence -5%, capacité 0% |
| Court trajet forfait | 20 pax, 80 km, date dans 3 semaines, juin | Forfait 500€, saison +15%, urgence -5%, capacité 0% |
| DD_PRIORITAIRE | Date départ dans 10 jours | Coefficient urgence +10% |
| DD_URGENT | Date départ dans 20 jours | Coefficient urgence +5% |
| DD_NORMAL | Date départ dans 45 jours | Coefficient urgence -5% |
| DD_3MOISETPLUS | Date départ dans 4 mois | Coefficient urgence -10% |
| Basse saison | Départ en janvier | Coefficient saisonnalité -7% |
| Saison très haute | Départ en juin | Coefficient saisonnalité +15% |
| Petit groupe | 12 passagers | Coefficient capacité -5% |
| Grand groupe (seuil) | 63 passagers | Coefficient capacité +15% |
| Grand groupe XL | 70 passagers | Coefficient capacité +40% |
| Aller/Retour | date_retour présente | base × 2 |
| Options multiples | guide + nuit_chauffeur | Suppléments additionnés ligne par ligne |
| 0 passager | nb_passagers = 0 | Erreur levée |
| Plus de 85 passagers | nb_passagers = 90 | Erreur "Escalade HITL requise" |
| Date dans le passé | date_depart < aujourd'hui | Erreur levée |
| Arrondi comptable | Montant à 2+ décimales | Arrondi à 2 décimales |

### Test des endpoints internes

```bash
# Test status endpoint
curl -H "x-n8n-secret: neotravel_internal_2026" \
  http://localhost:3000/api/internal/leads/[id]/status

# Test pending-followup
curl -H "x-n8n-secret: neotravel_internal_2026" \
  http://localhost:3000/api/internal/leads/pending-followup
```

---

## 15. Sécurité

### Points critiques

#### Clé de sécurité endpoints internes

`INTERNAL_API_KEY` (en `.env.local` : `neotravel_internal_2026`) protège les routes `/api/internal/*`.

**En production : changer cette valeur par un secret fort.** La valeur actuelle est un placeholder de développement.

Les routes retournent 401 si le header `x-n8n-secret` est absent ou invalide.

#### Tokens de décision

`decision_token` est un UUID généré automatiquement par Supabase à l'INSERT du devis. Il est unique par devis (contrainte `UNIQUE` en base) et non devinable.

Ce token est inclus dans tous les liens email (`accept_url`, `refuse_url`, `rappel_url`). La route `/api/leads/[id]/decision` vérifie :
1. Le token correspond bien au `demande_id` dans l'URL
2. La décision n'a pas déjà été enregistrée (idempotence)

#### Service role key

`SUPABASE_SERVICE_ROLE_KEY` ne doit jamais être exposée côté client. Elle n'est utilisée que dans `lib/supabase/server.ts` via `createAdminClient()`, appelé uniquement dans les API routes (côté serveur).

#### Prompt injection

Le prompt système interdit explicitement à l'agent d'inventer des prix ou de répondre à des demandes de manipulation. En cas d'injection détectée → escalade HITL immédiate.

### Ce qui n'est pas implémenté (à ajouter en production)

- Authentification robuste du dashboard (actuellement protection simple)
- Rate limiting sur `/api/chat` (limiter les requêtes par IP)
- CSRF protection sur les routes de décision
- Logs des tentatives d'accès non autorisées aux endpoints internes

---

## 16. Angles morts et points d'attention

### AM1 — Webhook URL prod vs test

Le webhook n8n en local utilise `webhook-test` (n8n doit être en mode écoute active). En production, le workflow doit être activé et l'URL doit être `webhook`. C'est la cause la plus fréquente de relances qui ne partent pas.

### AM2 — Leads HITL dans les relances auto

**Résolu.** Deux niveaux de garde-fous :
1. `triggerN8nWorkflow()` filtre avant envoi webhook
2. `/api/internal/leads/pending-followup` exclut via SQL

**Ne jamais retirer ces deux garde-fous** — les leads HITL et rappel doivent toujours rester en traitement manuel.

### AM3 — prochaine_relance mal configurée

Si un lead a `prochaine_relance` non null alors qu'il est dans un statut terminal (refuse, complexe), il peut apparaître dans le polling `/pending-followup`. **Résolu** par les garde-fous SQL + mise à null systématique lors des transitions.

En cas de doute, vérifier en base :
```sql
-- Leads avec anomalie potentielle
SELECT id, statut, origine_demande
FROM demandes d
JOIN devis dv ON dv.demande_id = d.id
WHERE d.statut IN ('refuse', 'complexe', 'accepte_prospect', 'confirme', 'cloture')
AND dv.prochaine_relance IS NOT NULL;
```

### AM4 — Distance hors table

Si l'origine ou la destination n'est pas dans les 28 villes de la table, la distance est estimée (`estime: true`). L'agent le signale au prospect. Le commercial peut corriger via le formulaire HITL du dashboard.

Pour les cas fréquents hors table, ajouter les paires dans `distances.ts`.

### AM5 — Supabase RPC `traiter_decision_devis`

La route `/api/leads/[id]/decision` tente d'abord une RPC pour atomicité. Si la RPC n'est pas configurée en base, elle utilise un fallback séquentiel. Pour une vraie atomicité en production, créer la RPC :

```sql
CREATE OR REPLACE FUNCTION traiter_decision_devis(
  p_demande_id UUID,
  p_devis_id UUID,
  p_decision TEXT,       -- 'accepte' | 'refuse' | null
  p_statut_demande TEXT  -- 'accepte_prospect' | 'refuse' | 'complexe'
) RETURNS void LANGUAGE plpgsql AS $$
BEGIN
  UPDATE demandes SET statut = p_statut_demande WHERE id = p_demande_id;
  IF p_decision IS NOT NULL THEN
    UPDATE devis
    SET decision = p_decision, decision_at = now(), prochaine_relance = null
    WHERE id = p_devis_id;
  ELSE
    UPDATE devis SET prochaine_relance = null WHERE id = p_devis_id;
  END IF;
END;
$$;
```

### AM6 — Seuil de 15 000 € TTC

Le seuil HITL pour le montant est vérifiable à deux endroits :
1. Dans `lib/agent/system-prompt.ts` (règle pour l'agent)
2. Dans `app/api/dashboard/leads/[id]/send-devis/route.ts` (vérification serveur côté dashboard)

Si ce seuil change, le mettre à jour dans les deux endroits.

---

*Document produit le 29/06/2026 — Groupe NeoTravel (Groupe 21)*

*Basé sur l'analyse du MVP déployé. Toutes les références de code correspondent à l'état du dépôt au 29/06/2026.*
