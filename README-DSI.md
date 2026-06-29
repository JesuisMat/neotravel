# NeoTravel — Documentation Technique (Passation DSI)

## Vue d'ensemble

NeoTravel est un agent IA de devis de transport en groupe (autocars/minibus), déployé sur Vercel. Il capture les besoins clients via un chat conversationnel, génère un devis PDF signé, l'envoie par email Resend, et expose un dashboard commercial de suivi.

---

## Stack technique

| Couche | Technologie | Version |
|---|---|---|
| Framework | Next.js (App Router) | 16.x |
| Langage | TypeScript | 5.x |
| Base de données | Supabase (PostgreSQL + Auth) | — |
| IA / LLM | Vercel AI SDK + Anthropic Claude via AI Gateway | — |
| Email | Resend | — |
| PDF | @react-pdf/renderer | — |
| Déploiement | Vercel | — |

---

## Variables d'environnement requises

Toutes à configurer dans Vercel (Settings → Environment Variables) et dans `.env.local` en dev.

| Variable | Description | Obligatoire |
|---|---|---|
| `AI_GATEWAY_API_KEY` | Clé Vercel AI Gateway (accès Claude) | Oui |
| `NEXT_PUBLIC_SUPABASE_URL` | URL du projet Supabase | Oui |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Clé publique Supabase (anon) | Oui |
| `SUPABASE_SERVICE_ROLE_KEY` | Clé service role Supabase (admin) | Oui |
| `RESEND_API_KEY` | Clé API Resend pour l'envoi d'emails | Oui |
| `EMAIL_FROM` | Adresse expéditeur (ex: `NeoTravel <devis@neotravel.fr>`) | Oui |
| `EMAIL_COMMERCIAL` | Adresse email du commercial pour les alertes | Oui |
| `NEXT_PUBLIC_APP_URL` | URL publique de l'app (ex: `https://neotravel.vercel.app`) | Oui |
| `INTERNAL_API_KEY` | Secret pour sécuriser les routes internes (`/api/internal/*`, `/api/email/*`) | Oui |
| `N8N_WEBHOOK_URL` | URL webhook n8n pour les automatisations (optionnel) | Non |

---

## Architecture des routes API

```
app/api/
├── chat/route.ts                         # Endpoint principal du chat agent IA
├── equipe/route.ts                       # CRUD membres d'équipe (GET/POST/DELETE)
├── devis/
│   ├── calculate/route.ts                # Calcul devis à la demande (usage interne)
│   └── sample/route.ts                   # Devis exemple pour tests
├── dashboard/
│   └── devis/pdf/route.ts                # Génération PDF devis (dashboard)
├── email/
│   ├── send-devis/route.ts               # Envoi email devis prospect
│   └── notify-commercial/route.ts        # Notification email commercial (HITL, acceptation)
├── leads/
│   └── [id]/
│       ├── decision/route.ts             # Traitement réponse prospect (accepte/refuse/rappel)
│       ├── update-statut/route.ts        # Mise à jour statut lead
│       └── send-relance/route.ts         # Envoi email relance manuelle
└── internal/
    └── leads/
        ├── pending-followup/route.ts     # Leads en attente de relance (cron)
        └── [id]/
            ├── send-followup/route.ts    # Envoi relance automatique
            └── send-relance/route.ts     # Relance manuelle (dashboard)
```

Toutes les routes `/api/email/*` et `/api/internal/*` sont protégées par le header `x-internal-secret: $INTERNAL_API_KEY`.

---

## Base de données Supabase

### Tables principales

**`demandes`** — une ligne par demande de devis reçue
- `id` (uuid, PK)
- `nom`, `email`, `telephone` — coordonnées prospect
- `type_client` — `particulier | entreprise | association | scolaire`
- `nom_entreprise` — nom société/établissement (si B2B)
- `origine`, `destination`, `date_depart`, `date_retour`
- `nb_passagers`, `distance_km`, `type_vehicule`
- `urgence` — `standard | urgent | tres_urgent`
- `statut` — voir cycle de vie ci-dessous
- `score_completude`, `nb_echanges`, `notes`, `options` (jsonb)

**`devis`** — un devis par demande (peut être recalculé)
- `id` (uuid, PK)
- `demande_id` (FK → demandes)
- `montant_ht`, `montant_tva`, `montant_ttc`
- `lignes` (jsonb) — détail des lignes de calcul (usage interne)
- `parametres_calcul` (jsonb) — snapshot des paramètres au moment du calcul
- `decision` — `null | accepte | refuse`
- `decision_token` — token signé pour les liens email
- `email_envoye_at`, `decision_at`
- `prochaine_relance`, `nb_relances`

**`team_members`** — équipe NeoTravel (accès dashboard)
- `id`, `user_id` (FK → auth.users), `email`, `nom`
- `role` — `admin | commercial | direction`
- `actif` (boolean)

**`logs`** — traçabilité de toutes les actions
- `demande_id`, `action`, `source` (`agent | user | system`), `metadata` (jsonb)

**`relances`** — historique des relances envoyées

### Cycle de vie d'une demande (statut)

```
nouveau → en_qualification → complet → devis_envoye
                                    ↓
                              relance_1 → relance_2
                                    ↓
                        accepte_prospect → confirme
                              refuse
                              complexe  (HITL)
                              cloture
```

---

## Flux de l'agent IA

Le modèle utilisé est **Claude Haiku 4.5** via Vercel AI Gateway (coût réduit, latence faible).

**Séquence normale :**
1. Prospect décrit son besoin → le LLM extrait silencieusement les champs
2. LLM collecte les coordonnées (email requis, téléphone fortement recommandé)
3. LLM appelle `calculer_et_enregistrer_devis` → crée demande + devis en base
4. LLM appelle immédiatement `envoyer_devis_email` → PDF généré + email Resend
5. Prospect reçoit l'email avec 3 CTA : accepter / être rappelé / refuser

**Séquence HITL (escalade commerciale) :**
- Déclenché si : > 85 passagers, > 15 000 € TTC, cas ambigus, hors France, PMR, scolaire réglementé
- LLM appelle `escalader_hitl` → email commercial envoyé + statut `complexe`

**Outils disponibles :**
- `calculer_et_enregistrer_devis` — calcul prix + persistance Supabase
- `envoyer_devis_email` — envoi email + PDF via Resend
- `escalader_hitl` — notification commerciale + changement statut
- `sauvegarder_contexte` — persistance intermédiaire en cours de conversation

---

## Calcul du prix

Fichier : `lib/devis/calculer-devis.ts` — fonction pure et déterministe, **aucun appel LLM**.

**Ordre de calcul :**
1. Base distance : forfait table ≤ 180 km, sinon `km × 2 × 2,5 €/km`
2. Aller/retour : base × 2 si `date_retour` présente
3. Coefficients multiplicatifs (saison, urgence, capacité)
4. Options (guide, nuit chauffeur, péages)
5. Sous-total HT
6. Marge commerciale 15 %
7. Prix HT = sous-total + marge
8. TVA 10 % → Prix TTC

Les lignes "marge", "ajustements coefficients" et "TVA" ne sont **jamais affichées** au prospect dans le PDF — uniquement les lignes de prestation.

---

## Dashboard

Accès : `/acces` → login Supabase Auth → `/dashboard`

Vues disponibles via `?view=` :
- `pilotage` — KPIs et graphiques
- `pipeline` — liste des leads avec filtres
- `relances` — leads en attente de relance
- `complexes` — cas HITL à traiter
- `equipe` — gestion des membres

### Créer un accès utilisateur

Via le dashboard (vue Équipe) ou directement via la route `POST /api/equipe` :
```json
{
  "email": "prenom.nom@neotravel.fr",
  "nom": "Prénom Nom",
  "role": "commercial",
  "password": "MotDePasse123!"
}
```
Cela crée simultanément le compte Supabase Auth et la ligne `team_members`.

---

## Déploiement

### Prérequis
- Compte Vercel lié au repository GitHub
- Projet Supabase configuré (toutes les migrations appliquées)
- Domaine Resend vérifié pour `EMAIL_FROM`

### Procédure de déploiement

```bash
# 1. Vérifier que les tests passent localement
npm run build

# 2. Pousser sur la branche main
git push origin main
# → déclenche automatiquement un déploiement Vercel

# 3. Vérifier les variables d'env sur Vercel
# Settings → Environment Variables → vérifier toutes les vars du tableau ci-dessus

# 4. Vérifier les logs Vercel post-déploiement
# Deployments → [dernier déploiement] → Functions logs
```

### Variables critiques à ne pas oublier en prod
- `NEXT_PUBLIC_APP_URL` doit pointer vers l'URL de prod (pas localhost)
- `INTERNAL_API_KEY` doit être un secret fort (min 32 caractères)

---

## Sécurité

- Les routes `/api/email/*` et `/api/internal/*` vérifient le header `x-internal-secret`
- Les liens email (accepte/refuse/rappel) sont protégés par un `decision_token` signé par Supabase
- Les clés Supabase `service_role` ne doivent jamais être exposées côté client
- Supabase RLS (Row Level Security) activé sur toutes les tables

---

## Points d'attention opérationnels

| Sujet | Détail |
|---|---|
| Devis non envoyé | Si l'agent calcule mais n'envoie pas l'email, vérifier les logs `/api/email/send-devis` dans Vercel. Cause probable : timeout ou erreur Resend silencieuse dans le tool. |
| Distance inconnue | Si la paire origine/destination n'est pas dans la table de distances, la distance est estimée à 200 km. Vérifier `lib/devis/distances.ts` pour ajouter des paires. |
| Passagers > 85 | Toujours escaladé en HITL — ne jamais calculer automatiquement au-delà. |
| HITL sans email | Si le prospect ne donne pas d'email, l'escalade sauvegarde quand même la demande avec les infos disponibles. |
| Relances automatiques | Les relances sont calculées à J+3 (standard) ou J+2 (urgent). Elles sont déclenchées via `/api/internal/leads/pending-followup` — à brancher sur un cron Vercel ou n8n. |

---

## Contacts projet

- Chef de projet technique : Matthieu Baric
- Repository : ce repo GitHub
- Supabase dashboard : [console Supabase du projet]
- Vercel dashboard : [console Vercel du projet]
