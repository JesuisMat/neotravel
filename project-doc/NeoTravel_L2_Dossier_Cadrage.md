# NeoTravel — Dossier de cadrage

## · Livrable L2 ·

*Remis le 29/06/2026*

*Groupe 21 — Léna Pedelahore, Juliette Brisard, Alan Teurroc, Matthieu Baric*

---

## 1. Contexte & présentation de NeoTravel

NeoTravel est une PME spécialisée dans le **transport de personnes en groupe** : entreprises, associations, établissements scolaires, collectivités. Elle opère depuis 2010 comme **intermédiaire** : NeoTravel ne possède pas de flotte propre. Sa valeur repose entièrement sur sa capacité à qualifier les besoins clients, mobiliser le bon partenaire autocariste, négocier les conditions et sécuriser la prestation de bout en bout.

```
Client ──► NeoTravel ──► Partenaire autocariste ──► Prestation confirmée
          (qualifie)      (mobilise)
```

**Organisation interne :**

| Pôle | Rôle |
|---|---|
| Commerciaux | Captation, qualification, tarification, devis, relation client |
| Agents de réservation | Identification partenaires, vérification, confirmation, logistique |
| Direction commerciale | Pilotage du pipeline (actuellement sans données structurées) |

**Données clés :**
- ~60 leads entrants par jour
- Sources : formulaire web, campagnes Google Ads, SEO
- Campagnes publicitaires volontairement bridées faute de capacité opérationnelle

---

## 2. Diagnostic — les frictions identifiées

> Le problème de NeoTravel n'est pas l'acquisition. C'est la capacité à traiter ce qui arrive.

### Les 7 frictions du processus actuel

| Étape | Friction | Impact business | Priorité |
|---|---|---|---|
| Qualification | 60 leads/jour traités manuellement, certains ignorés | Leads payants perdus | CRITIQUE |
| Priorisation | Commerciaux favorisent les gros dossiers | Manque à gagner invisible | CRITIQUE |
| Tarification | Grille appliquée à la main, risques d'erreur | Devis incohérents, temps gaspillé | HAUTE |
| Génération devis | Rédaction manuelle Word/Excel | Délai élevé, leads refroidis | HAUTE |
| Relances | Aléatoires selon disponibilité du commercial | Prospects non relancés, CA perdu | HAUTE |
| Pilotage | Aucun dashboard, aucune donnée structurée | Direction pilote à l'aveugle | MOYENNE |
| Acquisition | Campagnes bridées volontairement | CA potentiel plafonné artificiellement | HAUTE |

**L'irritant racine :** NeoTravel bride ses propres campagnes publicitaires parce que le traitement manuel ne suit pas. Ce n'est pas un problème d'acquisition — c'est un problème de capacité opérationnelle.

---

## 3. Processus actuel (AS-IS)

```
1. Demande web
   Le prospect remplit un formulaire sur le site NeoTravel.

2. Réception et qualification manuelle
   Un commercial reçoit la demande (email), l'analyse et évalue son potentiel.

3. Tarification sur grille interne
   Le commercial applique manuellement la grille tarifaire
   (distance, saison, passagers, options).

4. Génération manuelle du devis
   Devis rédigé dans Word ou Excel, exporté en PDF.

5. Envoi par email
   Le commercial envoie le devis au prospect.

6. Attente de réponse et relances
   Le prospect accepte, refuse, ou ne répond pas.
   Les relances dépendent de la disponibilité du commercial — très aléatoires.

7. Confirmation et réservation
   Si accepté : l'agent de réservation identifie un partenaire autocariste
   et coordonne la logistique.
```

---

## 4. Processus cible (TO-BE)

```
Prospect ──► Landing conversationnelle (chat central)
               │
               ▼
         Agent IA (Claude Haiku 4.5 via Vercel AI SDK)
         ├── Collecte les informations (sorties structurées Zod)
         ├── Détecte les champs manquants → redemande naturellement
         ├── Qualifie (score complétude, code urgence, complexité)
         ├── Appelle calculer_devis() avec les paramètres validés
         ├── Génère le PDF (react-pdf, server-side)
         └── Envoie l'email devis (Resend + React Email)
               │
               ├──► Supabase (création fiche demande, statut = devis_envoye)
               │
               ├──► n8n (webhook déclenché à l'envoi)
               │     ├── Wait 72h (standard) ou 48h (urgent)
               │     ├── GET /api/internal/leads/:id/status [vérif éligibilité]
               │     ├── IF éligible → envoie email relance 1
               │     ├── Wait 72h supplémentaire
               │     ├── GET /api/internal/leads/:id/status [re-vérif]
               │     └── IF éligible → envoie email relance 2
               │
               └──► [Si cas complexe] → Notification commercial
                                        avec contexte enrichi (HITL)

Dashboard direction → lecture Supabase en temps réel
  Volume leads | Dévis envoyés | Taux conversion | Pipeline | Cas complexes
```

---

## 5. Acteurs & rôles dans la solution cible

| Acteur | Rôle |
|---|---|
| Prospect | Interagit avec le chatbot, reçoit le devis par email, prend sa décision via liens signés |
| Agent IA (Claude Haiku 4.5) | Orchestre la conversation, collecte, qualifie, appelle les outils |
| `calculer_devis()` | Calcule le prix de façon déterministe — jamais le LLM |
| Supabase | Stocke toutes les données (demandes, devis, logs) |
| n8n | Workflow de relances : déclenché par webhook, vérifie le statut, envoie les emails |
| Commercial | Reçoit les escalades (cas complexes) avec contexte complet — HITL |
| Direction | Consulte le dashboard de pilotage |

---

## 6. Périmètre MVP

### Ce qui est livré (IN)

1. Interface conversationnelle centrale (landing = le chat, pas un widget)
2. Collecte et structuration de la demande en BDD (Supabase)
3. Détection des informations manquantes par l'agent
4. Qualification automatique (score complétude + code urgence)
5. `calculer_devis()` déterministe avec toutes les matrices
6. Table de distances réelle (378 paires, 28 villes françaises, depuis CSV officiel)
7. Génération PDF du devis (`@react-pdf/renderer`)
8. Envoi email devis au prospect (Resend + React Email, design HTML qualité)
9. Séquence de relances automatiques via n8n (J+3/J+7 standard, J+2 urgent)
10. Vérification de statut entre chaque relance (éligibilité avant envoi)
11. Mise à jour automatique des statuts à chaque étape
12. Escalade humaine (HITL) pour les cas complexes avec notification enrichie
13. Dashboard direction (KPIs, pipeline, entonnoir, cas complexes, filtre par mois)
14. Décisions prospect via liens signés (accepte / refuse / rappel)

### Ce qui est hors périmètre (OUT)

- Gestion des partenaires autocaristes
- Système de paiement / acompte
- Gestion des contrats et CGV
- Interface agent de réservation
- Intégration WhatsApp
- CRM analytique avancé (historique client multi-année)
- Authentification multi-rôles avancée
- Page d'administration des matrices tarifaires (prévu, non livré sur MVP)

---

## 7. Statuts commerciaux & machine d'état

```
nouveau
  └──► en_qualification   (collecte en cours, champs manquants détectés)
             │
             ▼
          complet          (tous champs obligatoires collectés)
             │
             ▼
       devis_envoye        (email envoyé + n8n webhook déclenché)
             │
             ├──► accepte_prospect   ← lien signé email (/api/leads/[id]/decision?status=accepte)
             │         │               Relances stoppées (prochaine_relance=null)
             │         │               Notification commercial
             │         ▼
             │      confirme          [action manuelle agent réservation dans dashboard]
             │
             ├──► refuse             ← lien signé email (?status=refuse)
             │                          opt_out logué, prochaine_relance=null
             │
             ├──► complexe           ← lien signé email (?status=rappel)
             │                          origine_demande=rappel_demande
             │                          Notification commercial
             │
             └──► [sans réponse]
                      │
                      ▼
                  relance_1           (J+2 urgent / J+3 standard via n8n)
                      │
                      ├──► accepte_prospect / refuse / complexe
                      │
                      └──► relance_2  (J+7 standard / J+5 urgent via n8n)
                                │
                                └──► cloture (max 2 relances sans réponse)

À tout moment :
nouveau / en_qualification / complet ──► complexe  (critères HITL atteints)
complexe ──► devis_envoye    (commercial envoie un devis via dashboard)
complexe ──► refuse / cloture (commercial clôture sans suite)
```

**Note importante :** les leads issus d'une escalade HITL (`origine_demande = complexe_hitl`) et les leads repassés en rappel (`rappel_demande`) sont **explicitement exclus** du workflow n8n automatique à tous les niveaux.

---

## 8. Architecture technique

```
┌──────────────────────────────────────────────────────────────┐
│  FRONT — Next.js (App Router) hébergé sur Vercel             │
│                                                              │
│  Pages :                                                     │
│  /         → Landing conversationnelle (chat central)        │
│  /dashboard → Vue direction (KPIs, pipeline, cas complexes)  │
│  /acces     → Page d'accès protégée                         │
│                                                              │
│  API Routes :                                                │
│  POST /api/chat                   → Route streamed (agent)   │
│  GET  /api/leads/[id]/decision    → Capture liens signés     │
│  GET  /api/internal/leads/[id]/status       → Statut pour n8n│
│  GET  /api/internal/leads/pending-followup  → Polling n8n   │
│  POST /api/dashboard/leads/[id]/send-devis  → HITL devis    │
│  POST /api/dashboard/leads/[id]/confirm     → Confirmation   │
└─────────────────────┬────────────────────────────────────────┘
                      │ Vercel AI SDK — streaming + tool calling
                      ▼
┌──────────────────────────────────────────────────────────────┐
│  AGENT IA — Claude Haiku 4.5 (claude-haiku-4-5-20251001)    │
│  Via Vercel AI Gateway — température 0.3 — max 10 steps     │
│                                                              │
│  Tools exposés :                                            │
│  ├── calculer_et_enregistrer_devis()  → calcul + INSERT BDD │
│  ├── envoyer_devis_email()            → Resend + PDF         │
│  ├── escalader_hitl()                 → INSERT demande HITL  │
│  └── sauvegarder_contexte()           → UPDATE contexte      │
└────────────────┬─────────────────────┬───────────────────────┘
                 │                     │
          ┌──────┴──────┐    ┌──────────┴───────────────────────┐
          │  Supabase   │    │  n8n Cloud — workflow relances    │
          │  PostgreSQL │    │                                   │
          │             │    │  Déclencheur : webhook POST       │
          │  demandes   │    │  (envoyé à chaque devis_envoye)   │
          │  devis      │    │                                   │
          │  relances   │    │  Wait 48h / 72h                   │
          │  logs       │    │  → GET /api/internal/leads/:id/   │
          │             │    │       status [x-n8n-secret]       │
          └─────────────┘    │  IF eligible → Send email relance │
                             │  Wait 72h                         │
                             │  → GET status (re-vérif)          │
                             │  IF eligible → Send email relance 2│
                             └──────────────────────────────────-─┘
```

**Séparation des responsabilités :**
- **Code (Next.js)** : logique métier stable, garde-fous, filtrage des leads éligibles, calcul, PDF, agent — versionné, auditable
- **n8n** : orchestration opérationnelle pure (timing des relances, envoi emails) — modifiable sans intervention développeur

---

## 9. Stack technique justifiée

| Brique | Techno | Justification |
|---|---|---|
| Framework | Next.js (App Router) | Stack maîtrisée, API routes, streaming natif |
| Style | Tailwind CSS + tokens custom | Rapid UI, design system cohérent |
| Agent IA | Vercel AI SDK (`streamText`, tool calling) | Tool calling natif, streaming, stopWhen guard |
| Modèle LLM | Claude Haiku 4.5 (`claude-haiku-4-5-20251001`) | Rapide, économique, suffisant pour collecte/qualification |
| Gateway LLM | Vercel AI Gateway | Proxy sécurisé, une seule clé API |
| Validation schema | Zod | Sorties structurées fiables et typées, intégré au SDK |
| BDD / CRM | Supabase PostgreSQL | Relationnel, RLS, service role pour admin, typed client |
| Calcul devis | `calculer_devis()` TypeScript pur | Déterministe, isolé, zéro LLM, 100% auditable |
| Distance | Table statique 378 paires / 28 villes | Depuis CSV routier officiel, fallback estimation |
| PDF | `@react-pdf/renderer` | Server-side dans Next.js, pas de dépendance Chrome |
| Email | Resend + React Email | Templates JSX dans le repo, 3 000 emails/mois gratuits |
| Relances / notifs | n8n Cloud | Webhook-driven, vérifie statut avant envoi, HITL exclu |
| Déploiement | Vercel | Natif Next.js, CI/CD intégré |
| Sécurité endpoints internes | Header `x-n8n-secret` | Variable d'env `INTERNAL_API_KEY`, 401 sinon |

**Budget mensuel réel :**

| Service | Coût |
|---|---|
| Vercel | 0 EUR |
| Supabase Free | 0 EUR |
| Resend | 0 EUR (< 3 000 emails/mois) |
| n8n Cloud Free | 0 EUR |
| Crédits LLM (Vercel AI Gateway) | ~15 EUR alloués |
| **Total** | **~15 EUR/mois** |

---

## 10. Contrat API interne — n8n ↔ Next.js

n8n ne se connecte jamais directement à Supabase. Deux endpoints internes sécurisés :

### GET /api/internal/leads/:id/status

Appelé par n8n avant chaque email de relance (après le Wait node).

**Auth :** header `x-n8n-secret: <INTERNAL_API_KEY>`

**Réponse 200 — lead éligible :**
```json
{ "eligible": true, "statut": "devis_envoye", "id": "uuid", "email": "...", "nom": "..." }
```

**Réponse 200 — lead non éligible :**
```json
{ "eligible": false, "statut": "refuse", "raison": "opt_out — prospect a refusé", "id": "uuid" }
```

Statuts bloquants : `accepte_prospect`, `confirme`, `refuse`, `cloture`, `complexe`

### GET /api/internal/leads/pending-followup

Endpoint alternatif (polling toutes les heures) — retourne les leads avec `prochaine_relance <= now()`.

**Garde-fous intégrés :**
- Filtre `statut IN (devis_envoye, relance_1)` uniquement
- Exclut explicitement `origine_demande IN (complexe_hitl, rappel_demande)`
- `prochaine_relance IS NOT NULL AND prochaine_relance <= now()`

### Workflow n8n complet (implémenté)

```
Webhook POST (déclenché par Next.js à l'envoi du devis)
    │  Payload: demande_id, devis_id, email, prenom, nom, origine,
    │           destination, date_depart, prix_ttc, decision_token,
    │           accept_url, refuse_url, rappel_url, status_url
    ▼
Wait 48h (urgent) ou 72h (standard)
    ▼
HTTP GET /api/internal/leads/:id/status
    [header: x-n8n-secret]
    ▼
IF {{ $json.eligible }} = true
    ├── TRUE  → Send Email Relance 1 (template HTML n8n-relance-1.html)
    │           Wait 72h
    │           HTTP GET status (re-vérif)
    │           IF eligible → Send Email Relance 2 (n8n-relance-2.html)
    └── FALSE → Stop (prospect a répondu ou clôturé)
```

---

## 11. Modèle de données réel (Supabase)

### Table `demandes`

| Colonne | Type | Description |
|---|---|---|
| `id` | UUID PK | Identifiant unique |
| `created_at` / `updated_at` | TIMESTAMP | Horodatages automatiques |
| `nom` | TEXT | Nom complet du prospect |
| `email` | TEXT | Email de contact |
| `telephone` | TEXT | Téléphone (peut valoir "non communiqué") |
| `type_client` | TEXT | particulier / entreprise / association / scolaire |
| `nom_entreprise` | TEXT | Nom de l'organisation si B2B |
| `origine` | TEXT | Ville de départ |
| `destination` | TEXT | Ville d'arrivée |
| `date_depart` | DATE | Date de départ (YYYY-MM-DD) |
| `heure_depart` | TEXT | Heure de départ souhaitée (HH:MM) |
| `date_retour` | DATE | Date de retour si aller/retour |
| `heure_retour` | TEXT | Heure de retour souhaitée |
| `nb_passagers` | INTEGER | Nombre total de passagers |
| `urgence` | TEXT | standard / urgent / tres_urgent |
| `origine_demande` | TEXT | standard / complexe_hitl / rappel_demande |
| `statut` | TEXT | Machine d'état (voir §7) |
| `score_completude` | INTEGER | 0-100 |
| `notes` | TEXT | Commentaires du prospect |
| `contexte_chat` | JSONB | Historique conversation pour HITL |
| `nb_echanges` | INTEGER | Nombre de tours de conversation |

### Table `devis`

| Colonne | Type | Description |
|---|---|---|
| `id` | UUID PK | Identifiant unique |
| `demande_id` | FK → demandes | Lien vers la demande |
| `montant_ht` | DECIMAL | Prix hors taxe |
| `tva_rate` | DECIMAL | Taux TVA (0.1) |
| `montant_tva` | DECIMAL | Montant TVA |
| `montant_ttc` | DECIMAL | Prix TTC final |
| `lignes` | JSONB | Décomposition du calcul |
| `parametres_calcul` | JSONB | Paramètres + coefficients appliqués |
| `decision_token` | TEXT UNIQUE | Token signé pour liens email |
| `decision` | TEXT | accepte / refuse / null |
| `decision_at` | TIMESTAMP | Date de la décision |
| `email_envoye_at` | TIMESTAMP | Date d'envoi de l'email |
| `nb_relances` | INTEGER | Compteur de relances (0/1/2) |
| `prochaine_relance` | TIMESTAMP | Prochaine relance planifiée (null si stoppée) |

### Table `relances`

| Colonne | Type | Description |
|---|---|---|
| `id` | UUID PK | Identifiant |
| `devis_id` | FK → devis | Lien devis |
| `demande_id` | FK → demandes | Lien demande |
| `type_relance` | TEXT | relance_1 / relance_2 / cloture |
| `statut` | TEXT | envoye / ouvert / erreur |
| `date_envoi` | TIMESTAMP | Date d'envoi réelle |
| `email_dest` | TEXT | Email destinataire |
| `metadata` | JSONB | Données complémentaires |

### Table `logs`

| Colonne | Type | Description |
|---|---|---|
| `id` | UUID PK | Identifiant |
| `demande_id` | FK → demandes (nullable) | Lien demande |
| `action` | TEXT | Action loguée (ex: devis_envoye, opt_out_email, decision_accepte) |
| `source` | TEXT | agent / n8n / system / user |
| `metadata` | JSONB | Données contextuelles de l'action |
| `tokens_input` / `tokens_output` | INTEGER | Consommation LLM si applicable |
| `erreur` | TEXT | Message d'erreur si applicable |
| `duree_ms` | INTEGER | Durée d'exécution |

---

## 12. Matrices de tarification

Ces règles sont implémentées dans `calculer_devis()` — aucun appel LLM, jamais.

### Formule de base (transfert simple, aller)

| Distance | Formule |
|---|---|
| ≤ 180 km | Forfait selon grille (tranche arrondie à la dizaine supérieure) |
| > 180 km | (km × 2) × 2,5 € / km parcouru |

**Grille forfaitaire (extrait) :**

| km | € | km | € |
|---|---|---|---|
| 10 | 250 | 100 | 580 |
| 30 | 250 | 120 | 660 |
| 50 | 350 | 150 | 780 |
| 80 | 500 | 180 | 900 |

**Aller/Retour :** `base_simple × 2`

### Coefficient Saisonnalité

| Niveau | Mois | Coefficient |
|---|---|---|
| Basse | Novembre, Janvier, Février, Août | −7% |
| Moyenne | Décembre, Octobre, Septembre | 0% |
| Haute | Mars, Avril, Juillet | +10% |
| Très haute | Mai, Juin | +15% |

### Pondération Urgence (date demande vs date départ)

| Code | Écart | Coefficient |
|---|---|---|
| `DD_PRIORITAIRE` | ≤ 14 jours | +10% |
| `DD_URGENT` | 14 à 30 jours | +5% |
| `DD_NORMAL` | 30 à 90 jours | −5% |
| `DD_3MOISETPLUS` | > 90 jours | −10% |

### Pondération Capacité

| Tranche passagers | Coefficient |
|---|---|
| 1 à 19 | −5% |
| 20 à 53 | 0% |
| 54 à 63 | +15% |
| 64 à 67 | +20% |
| 68 à 85 | +40% |
| > 85 | Escalade HITL obligatoire |

### Suppléments & Options

| Option | Tarif |
|---|---|
| Guide / accompagnateur | +80 € / jour de prestation |
| Nuit chauffeur | +120 € / nuit |
| Péages inclus | +90 € (forfait) |

### Ordre de calcul

```
1. Base transfert simple = forfait table (≤ 180 km) ou (km×2)×2,5 (> 180 km)
2. Aller/Retour = base_simple × 2 si date_retour présente
3. Application des coefficients (saison + urgence + capacité) sur la base
4. Ajout des options (montants fixes × unités)
5. Sous-total HT
6. Marge commerciale (15%) sur le sous-total HT
7. Prix HT = sous-total HT + marge
8. TVA (10%) sur le prix HT
9. Prix TTC = prix HT + TVA
```

Tous les montants sont arrondis à 2 décimales (stabilité comptable).

### Véhicules disponibles

| Passagers | Véhicule |
|---|---|
| 1–19 | Minibus (≤ 19 pax) |
| 20–53 | Autocar standard (≤ 53 pax) |
| 54–63 | Grand autocar (≤ 63 pax) |
| 64–67 | Autocar XL (≤ 67 pax) |
| 68–85 | Autocar double (≤ 85 pax) |

---

## 13. Table de distances

**378 paires routières réelles** couvrant 28 villes françaises, compilées depuis le CSV officiel fourni en début de projet (`project-doc/distance-ville.csv`).

Villes couvertes : Amiens, Angers, Biarritz, Bordeaux, Brest, Calais, Cherbourg, Clermont-Ferrand, Dijon, Grenoble, Le Havre, Lille, Lyon, Marseille, Montpellier, Nancy, Nantes, Nice, Paris, Perpignan, Reims, Rennes, Rouen, Saint-Étienne, Strasbourg, Toulouse, Tours, Vichy.

**Lookup :** normalisation minuscules + suppression accents/tirets → clé symétrique `"ville_a|ville_b"`.

**Fallback :** si la paire n'est pas dans la table → estimation géographique (distance vol d'oiseau × 1,25) avec flag `distance_estimee: true` signalé au prospect.

---

## 14. Flow conversationnel de l'agent

### Structure du dialogue (6 étapes)

```
ÉTAPE 1 — ACCUEIL
Agent : "Bonjour ! Décrivez-moi votre besoin de transport
         et je vous prépare un devis en quelques minutes."

ÉTAPE 2 — EXTRACTION & QUALIFICATION
Extraction silencieuse en sorties structurées Zod :
  Obligatoires : origine, destination, date_depart, heure_depart, nb_passagers
  Optionnels   : date_retour, heure_retour, options, notes, type_client

Règle passagers : compter TOUS les voyageurs y compris l'interlocuteur
  "31 collègues" → 32 passagers (31 + la personne qui parle)

ÉTAPE 3 — CONFIRMATION
Récapitulatif complet → validation prospect avant calcul

ÉTAPE 4 — COORDONNÉES
Email (requis) + téléphone (recommandé, "non communiqué" si refus)

ÉTAPE 5 — CALCUL & ENVOI
[appel calculer_et_enregistrer_devis()]
[appel envoyer_devis_email()]
Annonce: montant TTC uniquement — JAMAIS les lignes de calcul, coefficients, marge

ÉTAPE 6 — CONFIRMATION ENVOI
"Le devis détaillé vient de vous être envoyé à [email].
 Vous pourrez l'accepter, le refuser, ou demander à être rappelé."
```

### Critères de déclenchement HITL

**Demande explicite du prospect (priorité absolue) :**
- Demande de parler à un humain / commercial / conseiller
- Demande de rappel urgent

**Critères techniques :**
- `nb_passagers > 85`
- Devis calculé > 15 000 € TTC
- Score complétude < 60% après 3 échanges
- Dates incohérentes (retour avant départ, départ dans le passé)
- Destination hors France métropolitaine
- Transport réglementé (scolaire, PMR, normes spéciales)
- Tentative de manipulation / injection de prompt

---

## 15. Séquence email complète

| # | Email | Émetteur | Timing | Variables clés |
|---|---|---|---|---|
| 1 | Devis initial (PDF joint) | App Next.js via Resend | À l'envoi du devis | nom, trajet, prix TTC, accept_url, refuse_url, rappel_url |
| 2 | Relance 1 | n8n via Send Email node | J+2 urgent / J+3 standard | prenom, origine, destination, date_depart, prix_ttc |
| 3 | Relance 2 | n8n via Send Email node | J+5 urgent / J+7 standard | Idem + ton plus direct, mention d'arrêt des sollicitations |

**Templates disponibles :**
- `lib/email/templates/devis-template.tsx` — email devis (React Email)
- `lib/email/templates/n8n-relance-1.html` — relance 1 (HTML pur, variables n8n)
- `lib/email/templates/n8n-relance-2.html` — relance 2 (HTML pur, variables n8n)

---

## 16. Points d'attention IA

### Garde-fou déterministe
Le prix transite toujours par `calculer_devis()`. Jamais par le raisonnement libre du LLM. Un devis est un engagement commercial — il doit être reproductible et auditable.

### Sorties structurées
Toutes les extractions de paramètres passent par un schema Zod défini statiquement. Chaque champ est validé avant appel de `calculer_devis()`. Si invalide → l'agent redemande.

### HITL (Human In The Loop)
L'agent déclenche `escalader_hitl()` immédiatement dès qu'un critère est détecté. Le commercial reçoit : raison d'escalade, résumé de la conversation, contact complet, trajet, estimation prix si calculée, lien vers le dossier dans le dashboard.

### Protection RGPD
- Leads HITL exclus des workflows automatiques (n8n ne les voit jamais)
- Leads avec `opt_out: true` (refus) exclut toute relance future
- Champ `prochaine_relance = null` est la sentinelle : tant qu'il est null, aucune relance n'est possible

### Idempotence des décisions
La route `/api/leads/[id]/decision` vérifie `devis.decision` avant traitement. Une décision déjà enregistrée (`accepte` / `refuse`) retourne une page informative sans modification de la BDD.

---

## 17. Cas de démonstration

| # | Scénario | Ce qu'il démontre |
|---|---|---|
| 1 | Demande simple et complète | Flux nominal de bout en bout : chat → devis → email < 3 min |
| 2 | Demande incomplète | Détection infos manquantes, agent qui redemande naturellement |
| 3 | Demande urgente (< 14 jours) | DD_PRIORITAIRE, majoration +10% |
| 4 | Devis sans réponse | Relances J+2 / J+3 / J+7 déclenchées via n8n |
| 5 | Devis accepté | Prospect clique lien signé → statut accepte_prospect, notification commercial |
| 6 | Devis refusé | Prospect clique lien signé → statut refuse, opt_out logué |
| 7 | Demande de rappel | Prospect clique "Je souhaite être rappelé" → complexe + rappel_demande |
| 8 | Cas complexe (> 85 pax) | Escalade HITL, commercial notifié avec contexte enrichi |
| 9 | Dashboard direction | KPIs temps réel, pipeline, entonnoir, filtre par mois |

---

## 18. Risques & limites

| Risque | Probabilité | Impact | Mitigation |
|---|---|---|---|
| n8n webhook-test vs webhook-prod | Haute | Relances silencieuses en prod | Configurer `N8N_WEBHOOK_URL` avec URL prod avant mise en ligne |
| Supabase Free mis en veille | Moyenne | Démo bloquée | Pinger la base la veille de la soutenance |
| Trajet hors table de distances | Moyenne | Estimation approximative | Flag `distance_estimee: true` signalé au prospect + commercial peut corriger |
| Données personnelles | Faible | Légal | Prospects fictifs en démo uniquement |
| Dépassement budget stack | Très faible | Faible | ~15 EUR/mois, très large marge |

---

## 19. KPIs de succès

| Indicateur | Valeur cible | Mesure |
|---|---|---|
| Leads traités automatiquement | > 80% des demandes simples | Ratio `statut != complexe` |
| Délai demande → devis envoyé | < 3 minutes | `created_at` vs `email_envoye_at` |
| Fiabilité `calculer_devis()` | 100% sur jeu de tests | Tests Jest |
| Relances déclenchées | 100% des devis sans réponse | Logs n8n + Supabase |
| Coût IA par conversation | < 0.01 EUR | `tokens_input + tokens_output` dans logs |
| Taux conversion (dashboard) | Mesurable dès J1 | `confirmes / total_leads` |

---

*Document produit le 29/06/2026 — Groupe NeoTravel (Groupe 21)*
