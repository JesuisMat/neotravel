# NeoTravel — Dossier de cadrage
> Livrable 1 — a remettre le 24/06/2026 a 23h59
> Format : Markdown / export PDF ou Notion

---

## 1. Contexte & presentation de NeoTravel

NeoTravel est une PME fondee en 2010, specialisee dans le **transport de personnes en groupe** : particuliers, associations, collectivites, entreprises.

**Modele d'intermédiation :** NeoTravel ne possede pas de flotte propre. Sa valeur repose sur sa capacite a qualifier les besoins clients, mobiliser le bon partenaire autocariste, negocier les conditions et securiser la prestation de bout en bout.

```
Client --> NeoTravel --> Partenaire autocariste --> Prestation confirmee
         (qualifie)     (mobilise)
```

**Organisation interne :**

| Pole | Role |
|---|---|
| Commerciaux | Captation, qualification, tarification, devis, relation client |
| Agents de reservation | Identification partenaires, verification, confirmation, logistique |
| Direction commerciale | Pilotage du pipeline (actuellement sans donnees structurees) |

**Donnees cles :**
- ~60 leads entrants par jour
- Sources : formulaire web, campagnes Google Ads, SEO
- Campagnes publicitaires volontairement brideees faute de capacite operationnelle

---

## 2. Diagnostic — les frictions identifiees

> Le probleme de NeoTravel n'est pas l'acquisition. C'est la capacite a traiter ce qui arrive.

### Friction 1 — Priorisation commerciale biaisee

Les commerciaux, commissiones, favorisent naturellement les leads a fort potentiel apparent. Les leads a faible CA potentiel ou complexes a qualifier sont peu ou pas recontactes — alors qu'ils ont souvent ete acquis via des campagnes payantes.

**Consequence :** manque a gagner reel, investissements publicitaires partiellement gaspilles, inegalite de traitement invisible pour la direction.

### Friction 2 — Capacite operationnelle comme plafond de croissance

Sans automatisation, plus de leads = plus de pression sur les equipes, pas plus de CA. NeoTravel bride volontairement ses campagnes Ads pour ne pas saturer ses commerciaux.

**Consequence :** le potentiel commercial est plafonne artificiellement par la capacite manuelle de traitement.

### Tableau des frictions & impact

| Etape | Friction | Impact business | Priorite |
|---|---|---|---|
| Qualification | 60 leads/jour traites manuellement, certains ignores | Leads payants perdus | CRITIQUE |
| Priorisation | Favorise les gros dossiers, petits leads abandonnes | Manque a gagner invisible | CRITIQUE |
| Tarification | Grille appliquee a la main, risques d'erreur | Devis incoherents, temps gaspille | HAUTE |
| Generation devis | Redaction manuelle Word/Excel | Delai eleve, leads refroidis | HAUTE |
| Relances | Aleatoires selon disponibilite du commercial | Prospects non relances, CA perdu | HAUTE |
| Pilotage | Aucun dashboard, aucune donnee structuree | Direction pilote a l'aveugle | MOYENNE |
| Acquisition | Campagnes brideees volontairement | CA potentiel plafonne artificiellement | HAUTE |

---

## 3. Processus actuel (AS-IS)

```
1. Demande web
   Le prospect remplit un formulaire sur le site NeoTravel.

2. Reception et qualification manuelle
   Un commercial recoit la demande (email), l'analyse et evalue son potentiel.

3. Tarification sur grille interne
   Le commercial applique manuellement la grille tarifaire
   (distance, saison, passagers, options).

4. Generation manuelle du devis
   Devis redige dans Word ou Excel, exporte en PDF.

5. Envoi par email
   Le commercial envoie le devis au prospect.

6. Attente de reponse et relances
   Le prospect accepte, refuse, ou ne repond pas.
   Les relances dependent de la disponibilite du commercial.

7. Confirmation et reservation
   Si accepte : l'agent de reservation identifie un partenaire
   autocariste et coordonne la logistique.
```

---

## 4. Processus cible (TO-BE)

```
Prospect --> Landing conversationnelle (chat central)
               |
               v
         Agent IA (Vercel AI SDK)
         |-- Collecte les informations (sorties structurees Zod)
         |-- Detecte les champs manquants --> redemande
         |-- Qualifie (score completude, code urgence, complexite)
         |-- Appelle calculer_devis() avec les parametres
         |-- Genere le PDF (react-pdf)
         `-- Envoie l'email devis (Resend + React Email)
               |
               |---> Supabase (creation fiche demande, statut = devis_envoye)
               |
               |---> n8n (planifie relances J+2 / J+3 / J+7)
               |       |-- Poll /api/internal/leads/pending-followup
               |       `-- Resend (envoi email relance)
               |
               `---> [Si cas complexe] --> Notification commercial
                                           avec contexte enrichi (HITL)

Dashboard direction --> lecture Supabase en temps reel
  Volume leads | Devis envoyes | Taux conversion | Delais | Relances en attente
```

---

## 5. Acteurs & roles dans la solution cible

| Acteur | Role |
|---|---|
| Prospect | Interagit avec le chatbot, recoit le devis par email |
| Agent IA | Orchestre la conversation, collecte, qualifie, appelle les outils |
| `calculer_devis()` | Calcule le prix de facon deterministe — jamais le LLM |
| Supabase | Stocke toutes les donnees (CRM, devis, relances, matrices, logs) |
| n8n | Planifie et execute les relances, envoie les emails de suivi, notifie en interne |
| Commercial | Recoit les escalades (cas complexes) avec contexte complet — HITL |
| Direction | Consulte le dashboard de pilotage |

---

## 6. Perimetre MVP

### Ce qui est dans la semaine (IN)

1. Interface conversationnelle centrale (landing = le chat, pas un widget)
2. Collecte et structuration de la demande en BDD (Supabase)
3. Detection des informations manquantes par l'agent
4. Qualification automatique (score completude + code urgence)
5. `calculer_devis()` deterministe avec toutes les matrices
6. Generation PDF du devis (`@react-pdf/renderer`)
7. Envoi email devis au prospect (Resend + React Email)
8. Sequence de relances automatiques (J+2 urgent / J+3 + J+7 standard)
9. Mise a jour automatique des statuts a chaque etape
10. Escalade humaine (HITL) pour les cas complexes
11. Dashboard direction (volume, taux conversion, delais, relances en attente)
12. Page d'administration des matrices tarifaires (modifier coefficients sans toucher au code)

### Ce qui est hors perimetre (OUT)

- Gestion des partenaires autocaristes
- Systeme de paiement / acompte
- Gestion des contrats et CGV
- Interface agent de reservation
- Integration WhatsApp
- CRM analytique avance (historique client multi-annee)
- Authentification multi-roles avancee

---

## 7. Statuts commerciaux & machine d'etat

```
nouveau
  `--> incomplet         (infos manquantes detectees par l'agent)
         `--> qualifie   (donnees completes validees)
  `--> qualifie          (demande complete des la premiere interaction)
         `--> devis_envoye
               |--> relance_1    (J+2 si urgent / J+3 si standard)
               |      `--> relance_2  (J+7)
               |             `--> cloture  (max 2 relances sans reponse)
               |--> accepte_prospect   --> lien signe email --> /api/leads/decision
               |         |                Relances annulees (transaction atomique)
               |         v                Notification agent reservation
               |      confirme           [agent reservation : action manuelle dashboard]
               `--> refuse       --> lien signe email --> /api/leads/decision
                                    Email de courtoisie automatique + tracabilite
  `--> complexe          (HITL declenche, commercial notifie avec contexte)
         |--> devis_envoye  (commercial envoie un devis adapte manuellement)
         |--> refuse        (commercial cloture sans suite)
         `--> cloture       (commercial abandonne le dossier)
```

---

## 8. Architecture cible

```
+---------------------------------------------------------------+
|  FRONT — Next.js 15 App Router (Vercel)                       |
|  Tailwind CSS + shadcn/ui                                     |
|                                                               |
|  Pages :                                                      |
|  /         --> Landing conversationnelle (chat central)       |
|  /dashboard --> Vue direction (KPIs, pipeline, relances)      |
|  /admin     --> Gestion matrices tarifaires                   |
|                                                               |
|  API Routes :                                                 |
|  /api/chat                --> Route streamed (Vercel AI SDK)  |
|  /api/leads/[id]/decision --> Capture accepte_prospect/refuse |
|                               (lien signe depuis email devis) |
|  /api/internal/leads/     --> Polling endpoint pour n8n       |
|    pending-followup           GET : leads a relancer          |
|                               Auth : header x-internal-key    |
+-------------------------+-------------------------------------+
                          |
                          | Vercel AI SDK — streaming + tool calling
                          v
+---------------------------------------------------------------+
|  AGENT IA — Claude Haiku 4.5 (ou GPT-4o mini)                |
|  Temperature basse, sorties structurees Zod                   |
|                                                               |
|  Tools exposes :                                              |
|  |-- lookup_matrices()      --> SELECT Supabase               |
|  |-- calculer_devis()       --> TypeScript pur, zero LLM      |
|  |-- generer_pdf()          --> @react-pdf/renderer           |
|  |-- enregistrer_demande()  --> INSERT/UPDATE Supabase        |
|  |-- envoyer_email()        --> Resend + React Email          |
|  `-- escalader_humain()     --> notification HITL             |
+----------+----------------------------------------------------+
           |
    +------+------+
    v             v
+----------+   +--------------------------------------------------+
| Supabase |   | n8n Cloud (Free) — back-office nurturing         |
| Free     |   |                                                  |
|          |   | Schedule Trigger (toutes les heures)             |
| CLIENTS  |   | --> HTTP GET /api/internal/leads/pending-followup|
| DEMANDES |   |     [header x-internal-key]                      |
| DEVIS    |   |     Reponse : [{id, statut, urgence,             |
| MATRICES |   |       nb_relances, prochaine_relance, email}]    |
| RELANCES |   | --> Loop Over Items                              |
| LOGS     |   |     IF prochaine_relance <= now() : TRUE/FALSE   |
+----------+   | --> [TRUE] Envoyer email relance (Resend)        |
               | --> [TRUE] HTTP POST /api/internal/leads/        |
               |            [id]/relance-sent                     |
               |            (mise a jour statut + prochaine_rel.) |
               | --> Notification interne si cas urgent           |
               +--------------------------------------------------+
```

**Separation des responsabilites :**
- **Code (Next.js)** : logique metier stable, garde-fous, filtrage, calcul, PDF, agent — versionne, teste, auditable. n8n ne touche jamais directement Supabase.
- **n8n** : orchestration operationnelle pure (quand relancer, qui notifier) — modifiable par les equipes NeoTravel sans intervention developpeur, sans acces BDD direct.

**Pourquoi un polling endpoint plutot que n8n -> Supabase direct ?**
- n8n n'a pas besoin des credentials Supabase : surface d'attaque reduite
- La logique de filtrage (quels leads sont eligibles a une relance) reste dans le code TypeScript : auditable, testable avec Jest
- L'endpoint est testable independamment (curl, Postman) sans toucher n8n
- Si la BDD change, n8n ne bouge pas

**Securite de l'endpoint interne :**
- Header `x-internal-key: <secret>` verifie cote Next.js (variable d'env `INTERNAL_API_KEY`)
- L'endpoint ne repond qu'aux requetes avec la cle valide — retourne 401 sinon
- Ne pas exposer cet endpoint via le domaine public si possible (Vercel middleware)

---

## 9. Stack technique justifiee

| Brique | Techno | Justification |
|---|---|---|
| Framework | Next.js 15 (App Router) | Stack maitrisee, API routes, streaming natif |
| Style | Tailwind CSS + shadcn/ui | Rapid UI, composants dashboard prets (tables, badges, cards) |
| Agent IA | Vercel AI SDK | Tool calling natif, streaming, garde-fou litteral dans le code |
| Modele LLM | Haiku 4.5 ou GPT-4o mini | A confirmer selon provider credits — ~0.15-0.25$/M tokens |
| Validation schema | Zod | Sorties structurees fiables et typees, integre au SDK |
| BDD / CRM | Supabase PostgreSQL (Free) | Relationnel, RLS, temps reel, dashboard custom possible |
| Calcul devis | `calculer_devis()` TypeScript pur | Deterministe, isole, teste avant toute connexion IA |
| PDF | `@react-pdf/renderer` | Server-side dans Next.js, pas de probleme Vercel/Chrome |
| Email | Resend + React Email | Templates JSX dans le repo, 3000 emails/mois gratuits |
| Relances / notifs | n8n Cloud (Free) | Low-code, modifiable par NeoTravel sans dev ; poll l'API Next.js, ne touche pas Supabase directement |
| Deploiement | Vercel (Free) | Natif Next.js, CI/CD integre |
| Securite endpoint interne | `x-internal-key` header | Variable d'env `INTERNAL_API_KEY`, bloque toute requete non autorisee |

**Budget mensuel estime :**

| Service | Cout |
|---|---|
| Vercel | 0 EUR |
| Supabase Free | 0 EUR |
| Resend | 0 EUR (< 3000 emails/mois) |
| n8n Cloud Free | 0 EUR |
| Credits LLM | 15 EUR (alloues par groupe) |
| **Total** | **~15 EUR/mois** |

Largement en dessous du plafond de 1000 EUR/mois attendu pour une PME.

**Justification Option B vs Option A :**
> n8n comme orchestrateur principal (Option A) ajoute une couche d'abstraction visuelle sans valeur ajoutee pour la logique metier. On prefere que le garde-fou soit literalement dans le code TypeScript — auditable, versionnable, testable avec Jest. n8n reste pertinent en back-office pour les workflows operationnels (relances, notifications) que les equipes NeoTravel peuvent modifier sans intervention developpeur.

---

## 9b. Contrat API interne — n8n <-> Next.js

n8n ne se connecte jamais directement a Supabase. Il passe par deux endpoints internes Next.js, securises par un header `x-internal-key`.

### GET /api/internal/leads/pending-followup

Appele par n8n toutes les heures (Schedule Trigger).

**Logique cote Next.js (dans le code, pas dans n8n) :**
- Filtre les demandes avec `statut IN (devis_envoye, relance_1, relance_2)`
- Filtre `prochaine_relance IS NOT NULL AND prochaine_relance <= now()`
- Exclut les demandes avec `statut IN (accepte_prospect, confirme, refuse, cloture, complexe)`

**Reponse 200 :**
```json
[
  {
    "id": "uuid",
    "statut": "devis_envoye",
    "urgence_code": "DD_NORMAL",
    "nb_relances": 0,
    "prochaine_relance": "2026-06-27T10:00:00Z",
    "client": {
      "email": "prospect@example.com",
      "nom": "Dupont",
      "prenom": "Marie"
    },
    "devis": {
      "id": "uuid",
      "prix_ttc": 3840,
      "pdf_url": "https://..."
    }
  }
]
```

**Reponse 200 liste vide `[]` :** aucun lead a traiter — n8n stoppe le workflow sans erreur.
**Reponse 401 :** cle manquante ou invalide.

### POST /api/internal/leads/[id]/relance-sent

Appele par n8n apres chaque email de relance envoye avec succes.

**Body :**
```json
{ "type_relance": "J3" }
```

**Logique cote Next.js :**
- Update `RELANCES.statut = 'envoyee'` et `RELANCES.date_envoi = now()` pour `(devis_id, type_relance)`
- Update `DEMANDES.statut` : `devis_envoye` → `relance_1`, ou `relance_1` → `relance_2`
- Calcule et set `DEVIS.prochaine_relance` pour la relance suivante (ou null si max atteint)
- Si `nb_relances >= 2` : set `DEMANDES.statut = 'cloture'`, `DEVIS.prochaine_relance = null`
- Insert dans LOGS

**Reponse 200 :** `{ "statut": "relance_1", "prochaine_relance": "2026-07-01T10:00:00Z" }`
**Reponse 404 :** lead introuvable.
**Reponse 409 :** relance deja envoyee (idempotence — UNIQUE constraint).

### Workflow n8n complet

```
Schedule Trigger (toutes les heures)
    |
    v
HTTP GET /api/internal/leads/pending-followup
  [x-internal-key: {{$env.INTERNAL_API_KEY}}]
    |
    v
IF liste vide ? --> Stop (aucune erreur)
    |
    v
Loop Over Items
    |
    v
Envoyer email relance via Resend
  (template selon statut : devis_envoye ou relance_1)
    |
    v
HTTP POST /api/internal/leads/[id]/relance-sent
  [x-internal-key: {{$env.INTERNAL_API_KEY}}]
  Body : { "type_relance": "J3" }
    |
    v
IF statut reponse = 'cloture' --> notifier commercial (email interne)
```

---

## 10. Modele de donnees (ERD)

### CLIENTS
```
id              UUID PK
nom             TEXT NOT NULL
societe         TEXT
email           TEXT UNIQUE NOT NULL
telephone       TEXT
type_client     ENUM (particulier, association, collectivite, entreprise)
date_creation   TIMESTAMP DEFAULT now()
```

### DEMANDES
```
id                UUID PK
client_id         FK --> CLIENTS
statut            ENUM (nouveau, incomplet, qualifie, devis_envoye,
                        relance_1, relance_2, accepte_prospect, confirme,
                        refuse, complexe, cloture)
-- accepte_prospect : intention capturee via lien signe email (automatique)
-- confirme         : prestation confirmee par agent reservation (manuel dashboard)
date_demande      TIMESTAMP DEFAULT now()
depart            TEXT NOT NULL
destination       TEXT NOT NULL
date_depart       DATE NOT NULL
date_retour       DATE
nb_passagers      INTEGER NOT NULL
type_trajet       TEXT
urgence_code      ENUM (DD_PRIORITAIRE, DD_URGENT, DD_NORMAL, DD_3MOISETPLUS)
commentaire       TEXT
score_completude  INTEGER CHECK (score >= 0 AND score <= 100)
commercial_id     FK --> USERS (nullable — renseigne si escalade HITL)
```

### DEVIS
```
id                UUID PK
demande_id        FK --> DEMANDES
statut            ENUM (brouillon, envoye, accepte_prospect, confirme, refuse, expire)
token_decision    TEXT UNIQUE  -- token signe inclus dans les liens email J'accepte/Je refuse
prix_ht           DECIMAL(10,2) NOT NULL
tva               DECIMAL(10,2) NOT NULL
prix_ttc          DECIMAL(10,2) NOT NULL
marge_commerciale DECIMAL(10,2) NOT NULL
lignes_calcul     JSONB  -- [{ libelle, montant }]
coefficients      JSONB  -- [{ type, code, valeur }]
pdf_url           TEXT
date_envoi        TIMESTAMP
nb_relances       INTEGER DEFAULT 0
prochaine_relance TIMESTAMP
```

### MATRICES *(donnees de reference — editables via page admin)*
```
id          UUID PK
type        ENUM (saisonnalite, urgence, capacite, option)
code        TEXT NOT NULL
label       TEXT NOT NULL
valeur      DECIMAL(8,4) NOT NULL  -- coefficient ou montant fixe
date_debut  DATE
date_fin    DATE
```

### RELANCES
```
id              UUID PK
devis_id        FK --> DEVIS
type_relance    ENUM (J2, J3, J7)
date_planifiee  TIMESTAMP NOT NULL
date_envoi      TIMESTAMP
statut          ENUM (planifiee, envoyee, annulee)
UNIQUE(devis_id, type_relance)  -- idempotence : une seule relance de chaque type par devis
```
-- Annulation : quand DEMANDES.statut passe a accepte_prospect ou refuse,
-- une transaction atomique set toutes les RELANCES.statut = 'annulee' pour ce devis_id
-- et set DEVIS.prochaine_relance = null en meme temps.

### LOGS *(bonus — observabilite)*
```
id          UUID PK
demande_id  FK --> DEMANDES (nullable)
action      TEXT NOT NULL
payload     JSONB
tokens_in   INTEGER
tokens_out  INTEGER
cout_eur    DECIMAL(8,6)
latence_ms  INTEGER
ts          TIMESTAMP DEFAULT now()
```

---

## 11. Matrices de tarification

Ces regles sont implementees dans `calculer_devis()` — aucun appel LLM.

### Coefficient Saisonnalite
| Niveau | Mois | Coefficient |
|---|---|---|
| Basse | Novembre, Janvier, Fevrier, Aout | -7% |
| Moyenne | Decembre, Octobre, Septembre | 0% |
| Haute | Mars, Avril, Juillet | +10% |
| Tres haute | Mai, Juin | +15% |

### Ponderation Urgence (date demande vs date depart)
| Code | Ecart | Coefficient |
|---|---|---|
| DD_PRIORITAIRE | < 48h | +10% |
| DD_URGENT | 2 a 7 jours | +5% |
| DD_NORMAL | 7 jours a 3 mois | -5% |
| DD_3MOISETPLUS | > 3 mois | -10% |

### Ponderation Capacite
| Passagers | Coefficient |
|---|---|
| <= 19 | -5% |
| > 19 et <= 53 | 0% |
| > 53 et <= 63 | +15% |
| > 63 et <= 67 | +20% |
| > 67 et <= 85 | +40% |

### Supplements & Options
| Option | Tarif |
|---|---|
| Guide / accompagnateur | +80 EUR / jour |
| Nuit chauffeur | +120 EUR / nuit |
| Peages inclus | Forfait selon trajet |
| TVA | 10% |
| Marge commerciale | +15% appliques avant envoi au client |

### Signature de `calculer_devis()`
```typescript
// Aucun appel LLM dans cette fonction — zero, jamais
calculer_devis(params: {
  nb_passagers: number
  date_depart: Date
  date_demande: Date
  date_retour?: Date               // duree de prestation = date_retour - date_depart (min 1 jour)
  distance_km: number
  type_vehicule: string
  options: Array<'guide' | 'nuit_chauffeur' | 'peages'>
}) -> {
  prix_ht: number
  tva: number
  prix_ttc: number
  marge: number
  lignes: { libelle: string; montant: number }[]
  coefficients: { type: string; code: string; valeur: number }[]
  devise: 'EUR'
}
```

**Calcul des options facturees a la duree (guide, nuit chauffeur) :**
Le nombre d'unites se base sur la **duree de la prestation** (`date_retour - date_depart`, minimum 1 jour si `date_retour` absent). Les options forfaitaires (peages) restent un montant fixe quelle que soit la duree.

**Cas limites a tester impefrativement :**
- 0 passager ou > 85 passagers
- Date de depart dans le passe
- Date depart = date demande (urgence extreme)
- Combinaison d'options multiples
- Tous les niveaux de saisonnalite
- Chaque tranche de capacite

---

## 12. Scenarios de demonstration

| # | Scenario | Ce qu'il demontre |
|---|---|---|
| 1 | Demande simple et complete | Flux nominal de bout en bout : chat --> devis --> email |
| 2 | Demande incomplete | Detection infos manquantes, agent qui redemande |
| 3 | Demande urgente | DD_PRIORITAIRE, majoration, notification interne |
| 4 | Devis sans reponse | Relances J+2 / J+3 / J+7 declenchees automatiquement |
| 5 | Devis accepte | Prospect clique lien signe --> statut accepte_prospect, relances annulees, notification agent ; agent confirme manuellement --> statut confirme |
| 6 | Devis refuse | Prospect clique lien signe --> statut refuse, email de courtoisie automatique, tracabilite conservee |
| 7 | Cas complexe | Escalade HITL, commercial notifie avec contexte enrichi |

> Pour la demo : configurer les delais n8n a 2 minutes. Documenter la configuration reelle (J+2/J+3/J+7) dans le code.

---

## 13. Points d'attention IA (livret technique)

### Garde-fou deterministe
Le prix transite toujours par `calculer_devis()`. Jamais par le raisonnement libre du LLM. Un devis est un engagement commercial — il doit etre reproductible et auditable.

### Hallucinations
L'agent ne repond que sur la base des donnees en base (lookup). Regle : pas de source = pas de reponse. Il ne peut pas inventer une zone desservie, une remise ou une disponibilite.

### Sorties structurees
Toutes les extractions de parametres passent par un schema Zod defini une fois. Chaque champ est valide avant appel de `calculer_devis()`. Si invalide → l'agent redemande.

### Human In The Loop (HITL)
Cas declencheurs : montant > seuil a definir, score de certitude faible, trajet atypique, donnees incoherentes. Le commercial recoit le contexte complet de la conversation.

### Prompt injection
Le calcul deterministe protege le systeme : aucune phrase du prospect ne peut modifier le prix. Les messages utilisateur sont balises et traites comme donnees non fiables.

### RGPD
Donnees fictives uniquement pendant le prototype. Emails uniquement vers adresses de test. Minimisation : on ne collecte que ce qui est necessaire au devis.

### Idempotence
Une relance ne doit jamais etre envoyee deux fois. L'idempotence est garantie a deux niveaux : (1) la contrainte `UNIQUE(devis_id, type_relance)` en BDD empeche un double enregistrement, (2) l'endpoint `/api/internal/leads/[id]/relance-sent` retourne 409 si la relance est deja marquee `envoyee` — n8n traite ce 409 comme un succes silencieux, pas une erreur.

---

## 14. Risques & limites

| Risque | Probabilite | Impact | Mitigation |
|---|---|---|---|
| Provider credits LLM non confirme | Haute | Bloquant | Clarifier aupres du formateur aujourd'hui |
| Supabase Free mis en veille | Moyenne | Demo bloquee | Pinger la base la veille de la soutenance |
| `calculer_devis()` non fiable avant J5 | Faible | Critique | Construire et tester en isolation des J4 |
| Relances non declenchees en demo | Moyenne | Haut | Tester avec delai 2 min des J5 |
| Donnees personnelles en production | Faible | Legal | Prospects fictifs uniquement |
| Depassement budget stack | Tres faible | Faible | ~15 EUR/mois, tres large marge |

---

## 15. KPIs de succes

| Indicateur | Valeur cible | Mesure |
|---|---|---|
| Leads traites automatiquement | > 80% des demandes simples | Statut pipeline Supabase |
| Delai demande --> devis envoye | < 5 minutes | date_demande vs date_envoi |
| Taux de completion chatbot | > 70% | Demandes qualifiees / demandes initiees |
| Fiabilite `calculer_devis()` | 100% sur jeu de tests | Tests automatises (Jest) |
| Relances declenchees | 100% des devis sans reponse | Logs n8n |
| Cout IA par devis | < 0.01 EUR | Logs tokens Supabase |

---

## 16. Roadmap 3 phases

### Phase 1 — Structurer (MVP semaine)
Captation, qualification, `calculer_devis()`, devis PDF, email, relances, dashboard basique.

### Phase 2 — Automatiser (post-MVP)
Scoring avance des leads, segmentation automatique par type client, personnalisation des emails selon profil, amelioration du dashboard avec filtres.

### Phase 3 — IA avancee (evolution)
Suggestions tarifaires basees sur l'historique, detection d'intentions d'annulation, assistant interne pour les agents de reservation.

---

## 17. Questions ouvertes

- [ ] **BLOQUANT** — Sur quel provider sont les 15 EUR de credits IA ? (Anthropic / OpenAI / OpenRouter) → conditionne le SDK a brancher
- [ ] Le formateur valide-t-il l'Option B (Vercel AI SDK) au follow-up J3 ?
- [ ] Donnees de pricing completes disponibles ? (lien mentionne dans le brief)
- [ ] Format exact du Livrable 1 : PDF ou Notion ?
- [ ] Quels sont les membres de l'equipe et la repartition des roles ?

---

## 18. Planning semaine

| Jour | Objectif | Livrable |
|---|---|---|
| J1 — 22/06 | Comprendre le probleme, cadrer, decisions techniques | Ce document |
| J2 — 23/06 | Modele de donnees final, scenarios conversation, backlog | ERD + backlog priorise |
| J3 — 24/06 | Architecture finale, wireframes, stack validee par formateur | **Livrable 1 remis a 23h59** |
| J4 — 25/06 | `calculer_devis()` code et teste — rien d'autre | Tool + jeu de tests complet |
| J5 — 26/06 | Agent connecte aux outils, premier flux bout en bout | Pipeline fonctionnel |
| J6 — 29/06 | Landing, chatbot integre, relances, dashboard, deploiement | **Livrables 2 & 3 remis a 23h59** |
| J7 — 30/06 | Repetition pitch, scenarios demo, Q&R | Support soutenance remis a 23h59 |
| J8 — 01/07 | **Soutenance** | Demo live + pitch + Q&R |

---

*Document redige le 23 juin 2026 — Groupe NeoTravel*
