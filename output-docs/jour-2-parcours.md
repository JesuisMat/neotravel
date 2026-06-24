# NeoTravel — Jour 2 · Parcours client & mecanique metier
> Livrable intermediaire — 23 juin 2026
> Contribue au **Livrable 1 (Dossier de cadrage)** a remettre le 24/06 a 23h59

---

## 1. Comment est traite un lead de bout en bout ?

Un lead NeoTravel suit un cycle de vie precis, de son arrivee sur la landing jusqu'a sa cloture (accepte, refuse ou abandonne). Voici le parcours complet dans la solution cible.

```
[1] ARRIVEE SUR LA LANDING
    Le prospect arrive sur la page conversationnelle.
    Il decrit son besoin en langage naturel dans le chat.
          |
          v
[2] COLLECTE PAR L'AGENT IA
    L'agent extrait les donnees en sorties structurees (Zod).
    Champs obligatoires : depart, destination, date depart,
    nb passagers, type client, email, telephone.
    Champs optionnels : date retour, commentaire, options.
          |
          v
[3] DETECTION DES INFORMATIONS MANQUANTES
    L'agent verifie le score de completude (0-100).
    Si incomplet --> redemande les champs manquants.
    Si complet   --> passe a la qualification.
          |
          v
[4] QUALIFICATION AUTOMATIQUE
    L'agent evalue :
    - Le code urgence (DD_PRIORITAIRE / DD_URGENT / DD_NORMAL / DD_3MOISETPLUS)
    - La complexite apparente (nb passagers, type trajet, options)
    - Le score de completude final
    Si cas complexe detecte --> escalade HITL immediate
    Sinon --> appel calculer_devis()
          |
          v
[5] CALCUL DU DEVIS (calculer_devis())
    Fonction TypeScript pure, deterministe, zero LLM.
    Applique les matrices : distance, saison, urgence,
    capacite, options, marge +15%, TVA 10%.
    Retourne : prix HT, TVA, prix TTC, lignes de detail.
          |
          v
[6] GENERATION PDF
    @react-pdf/renderer genere le devis formate
    avec logo, lignes de calcul, detail des coefficients.
    Stocke dans Supabase Storage. URL enregistree en BDD.
          |
          v
[7] ENVOI EMAIL AU PROSPECT
    Resend + React Email envoie le devis PDF au prospect.
    Statut BDD --> devis_envoye.
    Next.js calcule et ecrit prochaine_relance en BDD selon l'urgence.
    n8n poll /api/internal/leads/pending-followup toutes les heures.
          |
          v
[8] ATTENTE DE REPONSE
    Trois cas possibles :
    (A) Prospect clique "J'accepte" dans l'email de devis (lien signe)
    (B) Prospect clique "Je refuse" dans l'email de devis (lien signe)
    (C) Pas de reponse --> relances automatiques
          |
    +-----+-----+
    v     v     v
   [A]   [B]   [C]
    |     |     |
    v     v     v
[9A] ACCEPTE_PROSPECT  [9B] REFUSE           [9C] RELANCES
  Lien signe pointe      Lien signe pointe      J+2 si urgent
  /api/leads/[id]/       /api/leads/[id]/       J+3 si standard
  decision?status=       decision?status=       --> J+7 si tjrs sans rep
  accepte&token=xxx      refuse&token=xxx       --> cloture apres 2 relances
  |
  Statut BDD -->
  accepte_prospect
  Relances annulees
  (table RELANCES :
  statut --> annulee)
  |
  v
[10] NOTIFICATION AGENT RESERVATION
  Email interne : "Nouveau dossier accepte,
  a traiter pour confirmation partenaire"
  |
  v
[11] CONFIRMATION HUMAINE (agent reservation)
  Agent identifie partenaire autocariste
  Confirme disponibilite et prix final
  Met a jour statut dashboard --> confirme
  |
  v
[12] PRESTATION EN COURS / CONFIRMEE
  Coordination logistique
  Hors perimetre MVP
```

---

## 2. Statuts des leads — cycle de vie complet

### Machine d'etat

```
NOUVEAU
  |
  |--> INCOMPLET --------> [agent redemande infos]
  |        |
  |        v
  |     QUALIFIE
  |
  `--> QUALIFIE (si demande complete d'emblee)
           |
           v
       DEVIS_ENVOYE
           |
           |--> ACCEPTE_PROSPECT ---> [lien signe email --> /api/leads/decision]
           |         |                Relances annulees en BDD
           |         v                Notification agent reservation envoyee
           |     CONFIRME             [agent humain : partenaire identifie + confirme]
           |
           |--> REFUSE ----------> [lien signe email --> /api/leads/decision]
           |                       Email de courtoisie automatique, tracabilite
           |
           `--> [sans reponse]
                    |
                    v
                RELANCE_1 (J+2 si urgent / J+3 si standard)
                    |
                    |--> ACCEPTE_PROSPECT
                    |--> REFUSE
                    |
                    v
                RELANCE_2 (J+7)
                    |
                    |--> ACCEPTE_PROSPECT
                    |--> REFUSE
                    |
                    v
                CLOTURE (max 2 relances sans reponse)

A tout moment :
NOUVEAU / INCOMPLET / QUALIFIE --> COMPLEXE --> [traitement manuel commercial]
COMPLEXE --> DEVIS_ENVOYE (si le commercial decide d'envoyer un devis)
COMPLEXE --> REFUSE / CLOTURE (si commercial cloture sans suite)
```

### Description de chaque statut

| Statut | Declencheur | Action automatique |
|---|---|---|
| `nouveau` | Premiere interaction prospect sur le chat | Creation fiche en BDD |
| `incomplet` | Score completude < 100% | Agent redemande les champs manquants |
| `qualifie` | Tous les champs obligatoires collectes | Appel `calculer_devis()` |
| `devis_envoye` | Email envoye avec succes | Planification relance dans n8n |
| `relance_1` | J+2 (urgent) ou J+3 (standard) sans reponse | Email de relance automatique |
| `relance_2` | J+7 sans reponse apres relance_1 | Email de relance automatique |
| `accepte_prospect` | Prospect clique lien signe "J'accepte" dans l'email de devis | Annulation relances en BDD, notification agent reservation |
| `confirme` | Agent reservation confirme partenaire + disponibilite (action manuelle dashboard) | Dossier passe en prestation coordonnee |
| `refuse` | Prospect clique lien signe "Je refuse" dans l'email de devis | Email de courtoisie automatique, tracabilite |
| `complexe` | Criteres HITL atteints | Notification commercial avec contexte ; le commercial gere la suite (peut passer en devis_envoye, refuse ou cloture) |
| `cloture` | 2 relances sans reponse, ou commercial cloture manuellement | Aucune action supplementaire |

### Regles de relance

| Type de demande | Relance 1 | Relance 2 | Cloture |
|---|---|---|---|
| Urgente (DD_PRIORITAIRE / DD_URGENT) | J+2 | J+5 | J+5 sans reponse |
| Standard (DD_NORMAL / DD_3MOISETPLUS) | J+3 | J+7 | J+7 sans reponse |

Maximum 2 relances par devis. Au-dela, statut --> cloture. La persistance excessive nuit a l'image de NeoTravel.

---

## 3. Matrice des cas — Golden Dataset metier

La question centrale : **qu'est-ce qu'on automatise, et pourquoi ? Ou s'arrete l'automatisation ?**

### Cas simples — automatisation complete

| # | Cas | Donnees | Traitement |
|---|---|---|---|
| S1 | Demande complete, trajet standard | Toutes infos presentes, nb passagers standard (20-53), date normale | 100% automatise : qualif --> devis --> email |
| S2 | Demande incomplete | Champs manquants (ex: nb passagers oublie) | Agent redemande, puis automatise |
| S3 | Demande urgente (< 48h) | Date depart dans 2 jours | Automatise + coefficient DD_PRIORITAIRE + relance J+2 |
| S4 | Petit groupe (<= 19 pax) | Comite d'entreprise, 15 personnes | Automatise + coefficient capacite -5% |
| S5 | Grand groupe (54-63 pax) | Association sportive, 58 personnes | Automatise + coefficient capacite +15% |
| S6 | Devis accepte | Prospect clique lien signe "J'accepte" dans l'email devis | Statut --> accepte_prospect, relances annulees en BDD, notification email agent reservation ; puis agent confirme manuellement --> statut confirme |
| S7 | Devis refuse | Prospect clique lien signe "Je refuse" dans l'email devis | Email de courtoisie automatique, statut --> refuse, tracabilite conservee |
| S8 | Sans reponse apres devis | Aucune interaction 3 jours apres | Relances automatiques J+3 puis J+7 |
| S9 | Demande tres anticipee (> 3 mois) | Voyage scolaire planifie longtemps a l'avance | Automatise + coefficient DD_3MOISETPLUS -10% |
| S10 | Options multiples | Guide + nuit chauffeur + peages | Automatise, supplements ajoutes ligne par ligne |

### Cas complexes — escalade humaine (HITL)

Le point de bascule vers un commercial est declenche quand l'automatisation ne peut pas garantir la fiabilite ou la qualite de la relation client.

| # | Cas complexe | Critere de bascule | Ce que recoit le commercial |
|---|---|---|---|
| C1 | Montant devis > seuil eleve | prix_ttc > 15 000 EUR | Contexte complet + devis calcule pour validation avant envoi |
| C2 | Trajet atypique ou hors zone | Destination internationale ou zone non referencee | Alerte + demande identification partenaire manuel |
| C3 | Nombre de passagers hors plage | > 85 passagers (limite matrice) | Contexte + demande coordination multi-vehicules |
| C4 | Demande ambigue apres 3 echanges | Score completude toujours < 60% apres 3 relances agent | Reprise manuelle avec historique conversation |
| C5 | Dates incoherentes | Date retour < date depart, ou date depart passee | Signalement + demande clarification humaine |
| C6 | Client VIP ou historique sensible | Type client entreprise + historique negatif detecte | Prise en charge commerciale directe |
| C7 | Demande reglementaire specifique | Transport scolaire, normes PMR, licences speciales | Verification compliance par commercial |
| C8 | Tentative de manipulation | Prompt injection detectee, demande de remise non standard | Blocage automatique + alerte securite |

### Regle de decision HITL

```
SI (prix_ttc > 15000)
OU (nb_passagers > 85)
OU (destination hors zone)
OU (score_completude < 60 apres 3 echanges)
OU (dates incoherentes)
OU (injection detectee)
ALORS --> statut = complexe
         --> notifier commercial avec :
             - Resume conversation
             - Donnees collectees
             - Raison de l'escalade
             - Devis calcule si disponible
SINON --> continuer automatisation
```

---

## 4. Flow conversationnel de l'agent

### Structure generale du dialogue

```
TOUR 1 — ACCROCHE
Agent : "Bonjour ! Decrivez-moi votre besoin de transport
         et je vous prepare un devis en quelques minutes."
         [Suggestions : Sortie scolaire | Seminaire | Evenement | Autre]

         --> Le prospect s'exprime librement

TOUR 2 — EXTRACTION & VERIFICATION
Agent extrait en arriere-plan (sorties structurees Zod) :
  - depart, destination
  - date_depart, date_retour
  - nb_passagers
  - type_client
  - options mentionnees

Si champs manquants detectes :
Agent : "Merci ! Pour finaliser votre devis, j'ai besoin de
         quelques precisions : [liste des champs manquants]"

TOUR 3 — CONFIRMATION
Agent : "Voici ce que j'ai compris de votre demande :
         - Trajet : [depart] --> [destination]
         - Date : [date_depart]
         - Passagers : [nb_passagers]
         - Options : [liste]
         C'est bien ca ?"

Prospect confirme --> TOUR 4
Prospect corrige  --> Agent met a jour et reconfirme

TOUR 4 — COORDONNEES
Agent : "Parfait ! Pour vous envoyer le devis, j'ai besoin
         de votre email et d'un numero de telephone."

TOUR 5 — CALCUL & ANNONCE
[En arriere-plan : appel calculer_devis()]

Agent : "Votre devis est pret ! Je vous l'envoie par email
         a [email] dans quelques secondes.
         Montant estimé : [prix_ttc] EUR TTC."

TOUR 6 — EMAIL ENVOYE
Agent : "Le devis detaille vient de vous etre envoye par email.
         Notre equipe reste disponible si vous avez des questions.
         Bonne journee !"

[Si cas complexe a l'etape 4 ou 5]
Agent : "Votre demande necessite l'expertise de l'un de nos
         conseillers. Un commercial vous recontactera dans les
         24h avec une proposition personnalisee."
```

### Arbre de decision complet

```
Prospect s'exprime
       |
       v
Extraction donnees (Zod)
       |
       v
Score completude >= 80% ?
   |              |
  OUI            NON
   |              |
   v              v
Confirmation  Redemander
  prospect    champs manquants
   |              |
   v              `---------> (retour extraction)
Criteres HITL ?
   |         |
  OUI       NON
   |         |
   v         v
Escalade  Collecte coordonnees
commercial      |
                v
           calculer_devis()
                |
                v
           Generer PDF
                |
                v
           Envoyer email (Resend)
                |
                v
           Statut --> devis_envoye
                |
                v
           Next.js ecrit prochaine_relance
           n8n poll /api/internal/leads/pending-followup
```

### Exemples de formulations de l'agent

**Collecte initiale :**
> "Bonjour ! Je suis l'assistant NeoTravel. Decrivez-moi votre projet de transport — destination, nombre de personnes, date — et je vous prepare un devis immediatement."

**Champ manquant :**
> "J'ai bien note votre trajet Paris – Bordeaux pour le 14 juillet. Combien de personnes seront du voyage ?"

**Confirmation avant calcul :**
> "Parfait. Je recapitule : 48 personnes, Paris – Bordeaux, le 14 juillet, retour le 16 juillet, avec un guide. C'est correct ?"

**Annonce du devis :**
> "Votre devis est pret. Montant : 3 840 EUR TTC, detail inclus. Je vous l'envoie a [email] maintenant."

**Escalade humaine :**
> "Votre demande sort de notre perimetre standard. Un conseiller NeoTravel vous recontactera sous 24h pour vous proposer une solution sur mesure."

**Relance (email automatique J+3) :**
> "Bonjour [Prenom], suite a notre devis du [date], nous souhaitons savoir si vous avez eu l'occasion de l'examiner. Nous restons disponibles pour toute question ou ajustement."

---

## 5. Parcours complet de bout en bout

### Vue synthetique

```
+------------------+     +------------------+     +------------------+
|   CAPTATION      |     |  QUALIFICATION   |     |    TARIFICATION  |
|                  |     |                  |     |                  |
| Landing chat     |---->| Agent detecte    |---->| calculer_devis() |
| Prospect parle   |     | infos manquantes |     | Deterministe     |
| librement        |     | Score completude |     | Zero LLM         |
+------------------+     +------------------+     +------------------+
                                                          |
                                                          v
+------------------+     +------------------+     +------------------+
|    SUIVI         |     |    RELANCES      |     |    DEVIS         |
|                  |     |                  |     |                  |
| Dashboard dir.   |<----| n8n scheduler    |<----| PDF genere       |
| Statuts temps    |     | J+2/J+3/J+7      |     | Email Resend     |
| reel             |     | Max 2 relances   |     | Statut mis a jour|
+------------------+     +------------------+     +------------------+
         ^
         |
+------------------+
|   CAS COMPLEXE   |
|                  |
| HITL declenche   |
| Commercial       |
| notifie avec ctx |
+------------------+
```

### Chronologie type — cas nominal (demande simple)

| Temps | Evenement | Acteur | Systeme |
|---|---|---|---|
| T+0 | Prospect arrive sur la landing | Prospect | - |
| T+1 min | Echange conversationnel, collecte des infos | Agent IA | Vercel AI SDK |
| T+2 min | Donnees validees, calcul du devis | `calculer_devis()` | TypeScript |
| T+3 min | PDF genere, email envoye au prospect | Resend | Next.js |
| T+3 min | Fiche creee en BDD, statut = devis_envoye | Supabase | - |
| T+3 min | prochaine_relance calculee et ecrite en BDD (J+3) | Next.js | Supabase |
| J+3 | n8n poll l'endpoint, detecte le lead eligible, envoie relance | n8n | Resend + Next.js |
| J+3 | Statut --> relance_1, prochaine_relance --> J+7 | Next.js | Supabase |
| J+7 | n8n poll l'endpoint, 2e relance envoyee | n8n | Resend + Next.js |
| J+7 | Statut --> relance_2, puis cloture si toujours sans reponse | Next.js | Supabase |

### Chronologie type — cas complexe

| Temps | Evenement | Acteur |
|---|---|---|
| T+0 | Prospect arrive, decrit besoin > 85 pax | Prospect |
| T+1 min | Agent collecte les infos, detecte critere HITL | Agent IA |
| T+2 min | Escalade declenchee, commercial notifie par email | n8n + Resend |
| T+2 min | Statut = complexe en BDD | Supabase |
| T+2 min | Prospect informe : "conseiller vous recontacte sous 24h" | Agent IA |
| < J+1 | Commercial reprend le dossier avec contexte complet | Commercial |

---

## 6. Ce qu'on automatise vs ce que l'humain garde

| Tache | Automatise | Humain | Pourquoi |
|---|---|---|---|
| Collecte de la demande | Oui | - | Repetitif, structurable, 60x/jour |
| Detection infos manquantes | Oui | - | Regle simple, deterministe |
| Qualification basique | Oui | - | Criteres definis et stables |
| **Calcul du prix** | **Oui (code pur)** | **Jamais** | **Engagement commercial — doit etre auditable** |
| Generation PDF | Oui | - | Template fixe, zero creativite requise |
| Envoi email devis | Oui | - | Repetitif, instantane |
| Relances standard | Oui | - | Timing fixe, message standard |
| Mise a jour statuts | Oui | - | Declenchee par actions detectees |
| Dashboard pilotage | Oui (lecture) | - | Agregation donnees Supabase |
| Cas complexes | - | Oui | Jugement, negociation, contexte specifique |
| Deals > 15 000 EUR | Validation avant envoi | Oui | Risque commercial eleve |
| Trajets atypiques | - | Oui | Hors matrices, expertise partenaires |
| Relation client sensible | - | Oui | Empathie, fidelisation, historique |
| Choix partenaire autocariste | - | Oui | Expertise reseau, qualite variable |

**Principe directeur :**
> L'automatisation prend en charge tout ce qui est repetitif, previsible et structurable. L'humain intervient quand la decision requiert du jugement, de l'expertise ou engage NeoTravel sur un montant ou une qualite de service significatifs.

---

## 7. Synthese — questions du Jour 2

**Comment est traite un lead de bout en bout ?**
Arrivee sur la landing -> conversation avec l'agent -> collecte structuree -> qualification automatique -> `calculer_devis()` -> PDF -> email -> relances n8n -> suivi dashboard. Tout est automatise sur le chemin nominal. Le commercial intervient uniquement sur escalade HITL.

**Quels sont les cas complexes ?**
Montant > 15 000 EUR, > 85 passagers, trajet hors zone, demande ambigue persistante, dates incoherentes, client sensible, transport reglemente (scolaire, PMR). Ces cas declenchent une notification commerciale avec contexte enrichi.

**Qu'est-ce qu'on automatise ? Pourquoi ?**
Tout ce qui est repetitif, structurable et a volume eleve (60 leads/jour) : collecte, qualification, calcul, PDF, email, relances, statuts. Parce que la capacite humaine est le goulot d'etranglement actuel — pas la demande.

**Qu'est-ce qu'on n'automatise pas ? Pourquoi ?**
Le calcul du prix par le LLM (risque d'hallucination sur un engagement commercial), les cas complexes (jugement requis), la selection des partenaires (expertise reseau). Parce que digitaliser sans deshumaniser signifie garder l'humain la ou sa valeur est irreplacable.

---

## 8. Angles morts identifies et resolus (audit 24/06)

### AM1 — Declencheur ACCEPTE/REFUSE (resolu dans ce document)

**Probleme :** le statut `accepte` n'avait pas de mecanisme concret de capture. On ne savait pas comment le systeme apprenait que le prospect avait accepte ou refuse.

**Solution retenue :** liens signes dans l'email de devis, deux boutons "J'accepte" / "Je refuse" pointant vers `/api/leads/[id]/decision?token=xxx&status=accepte_prospect`. La route Next.js met a jour Supabase, annule les relances en BDD et envoie la notification interne a l'agent de reservation.

**Pourquoi pas une reponse email parsee ?** Fragile, non fiable, necessite un webhook Resend et un parsing NLP. Un lien signe est deterministe, simple et auditable.

### AM2 — Deux statuts au lieu d'un pour "acceptation" (resolu dans ce document)

**Probleme :** un seul statut `accepte` melangait deux realites distinctes : l'intention du prospect et la confirmation effective de la prestation.

**Solution retenue :** deux statuts distincts :
- `accepte_prospect` — capture automatique via lien signe, relances stoppees
- `confirme` — action manuelle de l'agent de reservation dans le dashboard, apres verification disponibilite partenaire

**Pourquoi ?** NeoTravel est intermediaire — il ne peut pas confirmer une prestation sans avoir identifie un partenaire autocariste disponible. L'"acceptation" du prospect ne cree qu'une intention, pas une prestation.

### AM3 — Sortie du statut COMPLEXE non definie (resolu dans ce document)

**Probleme :** la machine d'etat montrait `complexe --> [traitement manuel]` sans transition de sortie.

**Solution retenue :** trois sorties possibles depuis `complexe`, toutes declenchees par le commercial via le dashboard :
- `devis_envoye` (si le commercial calcule et envoie un devis adapte)
- `refuse` (si le prospect n'est finalement pas servi)
- `cloture` (si le commercial decide de ne pas donner suite)

### AM4 — Annulation relances : coherence DEVIS + RELANCES (a corriger dans jour-1-cadrage.md)

**Probleme :** deux endroits stockent l'etat des relances (champs `nb_relances` / `prochaine_relance` dans DEVIS, et table RELANCES avec statut). L'annulation sur `accepte_prospect` doit mettre les deux a jour de facon atomique.

**Action requise dans jour-1-cadrage.md :** documenter que la route `/api/leads/[id]/decision` fait une transaction Supabase qui update `DEMANDES.statut`, set `RELANCES.statut = 'annulee'` pour toutes les relances planifiees du devis, et set `DEVIS.prochaine_relance = null`.

### AM5 — `distance_km` dans `calculer_devis()` : source non definie (a clarifier)

**Probleme :** la signature de `calculer_devis()` prend un `distance_km` mais le flow conversationnel collecte `depart` et `destination` en texte libre.

**Pistes :** (a) table de distances de reference pour les trajets courants, (b) appel Google Maps Distance Matrix API au moment de la qualification, (c) estimation manuelle par le commercial pour les cas hors table. A decider avant de coder `calculer_devis()`.

### AM6 — Idempotence relances : contrainte UNIQUE manquante (a corriger dans jour-1-cadrage.md)

**Probleme :** la table RELANCES n'a pas de contrainte `UNIQUE(devis_id, type_relance)`. Un bug n8n pourrait creer deux relances de meme type pour le meme devis.

**Action requise :** ajouter `UNIQUE(devis_id, type_relance)` sur la table RELANCES dans le modele de donnees.

---

*Document redige le 23 juin 2026 — mis a jour le 24 juin 2026 (audit angles morts) — Groupe NeoTravel*
