**N E O T R A V E L  · B R I E F  É T U D I A N T S** 

## **Brief de démarrage** 

Comment attaquer la semaine, étape par étape. À lire avant d'écrire la moindre ligne de code : l'ordre dans lequel vous construisez compte autant que ce que vous construisez. 

**Durée** : 1 semaine **Équipe** : 3 à 4 personnes **Méthode** : Agile **Réf.** : Fiche projet **Format** : Prototype + doc 

**A L ' O B J E C T I F  D U  B R I E F** 

Ce document sert de mode d'emploi de lancement. Il ne remplace pas la fiche projet : il indique dans quel ordre lire les ressources, quelles décisions prendre avant de coder, comment organiser le groupe et comment produire un prototype cohérent. 

**Votre mission** : automatiser le processus commercial de NeoTravel, de la captation du lead au devis, puis à l'envoi, aux relances et au pilotage. 

## **B L A C H A Î N E  À  D É M O N T R E R** 

## **1** 

## **Entrée lead** 

Landing, chatbot ou formulaire. Le prospect exprime son besoin et les données sont structurées. 

**2 3 4** 

## **Qualification** 

## **Devis** 

## **Suivi** 

Demande complète ou Calcul déterministe via incomplète, urgence, `calculer_devis()` , complexité, statut et priorité génération d'une commerciale. proposition ou d'un PDF. 

Envoi, relances, pipeline, dashboard et reprise humaine pour les cas sensibles. 

## **R È G L E  D E  C A D R A G E** 

Un prototype qui couvre toute la chaîne de façon simple vaut mieux qu'une seule brique parfaite. La cohérence du parcours prime sur la sophistication d'un maillon. 

Brief de démarrage · page 1 / 9 

**B R I E F  D E  D É M A R R A G E  · R E S S O U R C E S** 

## **A Q U O I  L I R E ,  D A N S  Q U E L O R D R E** 

Ne lisez pas les annexes au hasard. Utilisez-les comme un parcours de cadrage : métier d'abord, architecture ensuite, code seulement après. 

**==> picture [506 x 409] intentionally omitted <==**

**----- Start of picture text -----**<br>
1 Présentation complète MÉTIER<br>Comprendre le contexte, les frictions, le périmètre fonctionnel, les livrables, le planning, le barème et<br>les attentes de soutenance.<br>2 Glossaire IA MÉTIER<br>Aligner le vocabulaire de l'équipe : chatbot, agent IA, workflow, tool, moteur de règles, scoring,<br>human-in-the-loop.<br>3 Mot du président MÉTIER<br>Identifier les irritants réels, la vision direction, les tâches à forte valeur humaine et les arbitrages<br>métier à préserver.<br>4 Règles de pricing CRITIQUE<br>Documenter les matrices tarifaires : distance, saison, urgence, capacité et options. Base obligatoire<br>du moteur de devis.<br>5 Fiche stack TECHNIQUE<br>Choisir entre une option n8n/Airtable ou une option Next/Supabase. Tout outil alternatif doit être<br>justifié et validé.<br>6 Livret technique AVANT IA<br>Consulter avant de connecter l'IA : prompts, garde-fous, logs, tests, human-in-the-loop et séparation<br>agent/outils.<br>7 FAQ + notation VALIDATION<br>Vérifier les limites du périmètre, les attendus exacts et les critères d'évaluation avant de verrouiller le<br>MVP.<br>**----- End of picture text -----**<br>


## **R É F L E X E** 

Avant chaque choix important, demandez-vous : est-ce que cette décision aide NeoTravel à mieux traiter ses leads, plus vite, avec plus de traçabilité et sans affaiblir la relation humaine ? 

Brief de démarrage · page 2 / 9 

**B R I E F  D E  D É M A R R A G E  · G L O S S A I R E  I A** 

## **A À  Q U O I  S E R T  L E  G L O S S A I R E  ?** 

Le glossaire IA n'est pas une annexe secondaire : c'est le **référentiel commun de vocabulaire** du projet. Il sert à éviter les confusions entre chatbot, agent IA, workflow, moteur de règles, scoring, automatisation et validation humaine. 

Un vocabulaire flou produit souvent une architecture floue. Utilisez-le pour formuler correctement vos choix dans le dossier de cadrage, la documentation et la soutenance. 

## **B Q U A N D  L ' U T I L I S E R  ?** 

**Aligner le vocabulaire avant le cadrage** — Lire le glossaire avant de rédiger le diagnostic. Vérifier les différences entre chatbot, agent IA, workflow automatisé, IA générative, moteur de règles, human-in-the-loop et sortie structurée. 

**Contrôler les termes de l'architecture** — Relire le glossaire pendant la conception : ce que vous appelez agent, tool, workflow, scoring, qualification ou automatisation doit être précis dans le dossier de cadrage. 

**Préparer la soutenance** — Utiliser le glossaire pour expliquer simplement ce que l'IA fait, ce qu'elle ne fait pas, ce qui est automatisé, ce qui reste validé par un humain et pourquoi le pricing est déterministe. 

**C T E R M E S  À  V É R I F I E R Chatbot ≠ agent IA IA générative ≠ moteur de règles** Un chatbot discute. Un agent orchestre des actions et appelle L'IA formule et assiste ; le moteur de règles calcule de des outils. manière stable. 

**Qualification ≠ validation Workflow ≠ décision métier** Qualifier une demande ne signifie pas valider un prix ou une Un workflow exécute des étapes ; les décisions sensibles offre engageante. doivent être encadrées. 

## **E R R E U R  À  É V I T E R** 

Ne dites jamais « l'IA calcule le prix ». Formulation attendue : l'agent collecte les informations, lit les règles applicables et appelle le tool `calculer_devis()` , qui calcule le prix de manière déterministe. 

Brief de démarrage · page 3 / 9 

**B R I E F  D E  D É M A R R A G E  · A R C H I T E C T U R E** 

## **A L ' A R C H I T E C T U R E  C I B L E** 

Un agent reçoit la demande via le chatbot, mène la conversation, puis appelle des outils pour agir. **Point clé : l'agent décide quoi faire, mais ce sont les outils qui exécutent.** 

**==> picture [471 x 218] intentionally omitted <==**

**----- Start of picture text -----**<br>
Landing web + chatbot<br>↓<br>AGENT IA — orchestrateur<br>n8n ou Vercel AI SDK selon l'option<br>a<br>↓<br>Lookup règles calculer_devis() Générer le devis CRM Planifier relance<br>Airtable / Supabase code déterministe PDF Airtable / Supabase n8n<br>↓<br>SOCLE DE DONNÉES  — Airtable ou Supabase : demandes, matrices, devis, relances, logs<br>PILOTAGE  — Dashboard direction<br>**----- End of picture text -----**<br>


## **B L I R E  L E S  R È G L E S  ≠ C A L C U L E R** 

## **À  G R AV E R** 

L'agent peut lire les bonnes règles par lookup direct en base. Il peut décider quel outil appeler et dans quel ordre. Mais **le calcul du prix est toujours fait par** **`calculer_devis()` , jamais par le raisonnement libre du LLM.** 

## **Ce que l'agent fait** 

Conversation, collecte, reformulation, détection des champs manquants, choix du prochain outil, email de relance. 

## **Ce que les outils font** 

Calcul du prix, génération PDF, écriture CRM, mise à jour statut, planification relance, logs. 

Brief de démarrage · page 4 / 9 

**B R I E F  D E  D É M A R R A G E  · M I S E  E N R O U T E** 

## **A L E  S E T U P,  AVA N T  TO U T  C O D E** 

**1** 

**Vérifiez vos quotas et crédits** sur tous les services : LLM (crédit fourni), n8n, chatbot, email, génération PDF. Un service à court de crédit en milieu de semaine peut bloquer toute la démo. 

- **2 Créez le socle de données** : Airtable ou Supabase, avec au minimum Demandes, Matrices, Devis, Relances. Ajoutez Logs et Clients si vous pouvez. 

**3 Initialisez le repo** : README, variables d'environnement, structure projet, premier commit et premier déploiement à vide. 

- **4 Choisissez l'orchestrateur** : n8n + AI Agent ou Vercel AI SDK. n8n reste utile pour les relances dans les deux cas. 

**5** 

- **Cadrage Agile** : backlog priorisé, rôles, journal de décisions, risques connus et périmètre MVP. 

## **B M O D È L E  D E  D O N N É E S  M I N I M U M** 

## **Demandes** 

Prospect, trajet, date, passagers, statut, urgence, score de complétude. 

## **Matrices** 

Tarifs véhicule, saisonnalité, urgence, capacité, options, TVA. 

## **Devis** 

Montants HT/TTC, lignes de calcul, statut, PDF, date d'envoi, prochaine relance, nb de relances. 

## **Clients** 

Coordonnées, historique, type de client, consentement minimal. 

## **Logs BONUS** 

Actions agent, appels outils, erreurs, coûts tokens, validations. 

## **D É F I N I T I O N  D E  P R Ê T** 

Vous êtes prêts à coder quand vous savez quelles données entrent, où elles sont stockées, quel statut change à chaque étape, et quel outil exécute chaque action. 

Brief de démarrage · page 5 / 9 

**B R I E F  D E  D É M A R R A G E  · P R I C I N G** 

## **A L A P I È C E  C R I T I Q U E  —  L E  TO O L D E  P R I C I N G** 

C'est le **cœur fiable** du système. Construisez-le et testez-le en premier, isolé de l'IA. Une fois sûr, vous l'exposez comme outil que l'agent appelle. 

```
# Un contrat clair, déterministe, testé
calculer_devis(params) ->
// entrée
 params = { nb_passagers, date_depart, date_demande,
            distance_km, type_vehicule, options[] }
// traitement : applique les matrices
// saison, urgence, capacité, options, TVA
// AUCUN appel au LLM
// sortie
 -> { prix_ht, tva, prix_ttc,
      lignes: [ { libelle, montant }, ... ],
      coefficients: [ ... ], devise: "EUR" }
```

## **B M AT R I C E S  À  I M P L É M E N T E R** 

|**BLOC**|**VARIABLES À PRENDRE EN COMPTE**|**ATTENDU**|
|---|---|---|
|**Distance**|Distance en km, prix/km, prix minimum|Déterminer la base de calcul|
|**Saison**|Basse, moyenne, haute, très haute|Appliquer le coefficient documenté|
|**Urgence**|Date demande vs date départ|Majoration ou réduction selon anticipation|
|**Capacité**|Tranche de passagers|Adapter le coefficient au volume|
|**Options**|Guide, nuit chauffeur, péages, TVA|Ajouter les lignes détaillées du devis|



## **T E S T S  C O N S E I L L É S** 

Cas simple, demande urgente, hors zone, 0 passager, date incohérente, dépassement nombre limite passagers, option nuit chauffeur. 

## **S O R T I E  AT T E N D U E** 

Prix total + détail du calcul. Le commercial doit pouvoir expliquer le devis et auditer chaque coefficient. 

Brief de démarrage · page 6 / 9 

**B R I E F  D E  D É M A R R A G E  · D É R O U L É** 

## **A P L A N  D E  L A S E M A I N E** 

**==> picture [506 x 455] intentionally omitted <==**

**----- Start of picture text -----**<br>
Setup technique et cadrage<br>J1<br>Quotas, repo, déploiement à vide, base de données, rôles, backlog, journal de décisions, lecture du glossaire IA.<br>Comprendre avant de coder<br>J2<br>Contexte, frictions, parcours actuel, matrice des problèmes, première cartographie As-Is / To-Be.<br>Architecture et modèle de données REMISE L1<br>J3<br>Stack, tables, statuts, règles de validation humaine, scénarios conversationnels, scénarios de démo et vocabulaire<br>technique vérifié avec le glossaire.<br>Le cœur fiable d'abord<br>J4<br>calculer_devis()  codé et testé, lookup pricing opérationnel. Rien d'autre tant que ce n'est pas solide.<br>L'agent prend vie<br>J5<br>Agent connecté à ses outils : lookup règles, calcul, devis PDF, CRM, relances. Premier flux de bout en bout.<br>WE Week-end · 27–28 tampon<br>Tampon de finition possible mais non imposé — pas de nouvelle séance. À utiliser uniquement pour ajuster le périmètre<br>avant la remise du lundi soir.<br>J6 Expérience & automatisation REMISES L2 & L3 · 29/06 au soir<br>Landing ou interface prospect, chatbot intégré, relances, emails de test, dashboard et déploiement en ligne (optionnel :<br>bonus).<br>Préparation de la restitution<br>J7<br>Répétition du pitch, scénario de démo, répartition de parole, Q&R, limites, arbitrages techniques et vocabulaire stabilisé<br>avec le glossaire. Support de soutenance dû le 30/06 au soir.<br>Soutenance · 01/07<br>J8<br>**----- End of picture text -----**<br>


Présentation, démonstration, questions-réponses et justification des arbitrages. 

Brief de démarrage · page 7 / 9 

**B R I E F  D E  D É M A R R A G E  · L I V R A B L E S** 

## **A C E  Q U I  D O I T  Ê T R E  R E N D U** 

## **Livrable 1 — Dossier de cadrage** 

- ✓ Diagnostic NeoTravel et frictions prioritaires. 

- ✓ Matrices de priorisation problèmes / solutions. 

- ✓ Cartographie As-Is / To-Be. 

- ✓ Architecture, modèle de données, stack justifiée et vocabulaire aligné avec le glossaire. 

## **Livrable 2 — Prototype + artefacts** 

   - ✓ Repo Git propre, README, variables d'environnement. 

   - ✓ Tool `calculer_devis()` + tests. 

   - ✓ Workflows n8n ou code agent. 

   - ✓ Prompt système documenté. 

   - ✓ Dashboard et relances configurées ou simulées. 

- ✓ Périmètre MVP, KPIs, risques, limites. 

## **Livrable 3 — Documentation de passation** 

- ✓ Procédure repreneur technique. 

- ✓ Procédure équipe NeoTravel, avec termes clés expliqués simplement. 

- ✓ Comment modifier pricing, emails, statuts et relances. 

## **Soutenance — Moment de preuve** 

   - ✓ Pitch clair, démo live, Q&R. 

   - ✓ Chaque membre prend la parole. 

   - ✓ Parcours complet démontré. 

   - ✓ Limites et arbitrages assumés. 

- ✓ Backlog P1/P2/P3 et prochaines évolutions. 

## **B D E F I N I T I O N  O F  D O N E** 

## **L E  M I N I M U M  Q U I  D O I T  F O N C T I O N N E R** 

Un prospect exprime une demande ; le système crée une fiche CRM ; qualifie la demande ; détecte les informations manquantes ; calcule un devis ; génère une proposition ; prépare ou envoie un email de test ; programme une relance ; met à jour le pipeline ; alimente un dashboard. 

Brief de démarrage · page 8 / 9 

**B R I E F  D E  D É M A R R A G E  · D É M O  & P I È G E S** 

**A S C É N A R I O S  D E  D É M O N S T R AT I O N** 

## **1. Demande simple complète** 

Le lead est qualifié, le devis est calculé, la proposition est générée et le pipeline se met à jour. 

## **2. Demande incomplète** 

Le système détecte les champs manquants et demande un complément avant devis. 

## **3. Demande urgente** 

Priorité élevée, notification interne et éventuelle majoration ou validation humaine. 

## **4. Devis sans réponse** 

Urgent : J+2. Standard : J+3 et J+7. Maximum 2 relances, puis clôturé. 

## **5. Devis accepté** 

Statut gagné, arrêt des relances, transmission à l'équipe réservation. 

## **6. Devis refusé** 

Statut mis à jour, email de courtoisie, traçabilité conservée. 

## **7. Cas complexe** 

Le système refuse l'automatisation totale et transfère à un humain avec le contexte. 

## **B C O N S E I L S  &  P I È G E S  À  É V I T E R** 

- ✓ **Pricing déterministe avant l'IA.** Si le calcul n'est pas fiable, l'agent posé dessus ne le sera jamais. 

- ✓ **Commitez souvent.** Le déploiement en ligne est optionnel et constitue un bonus. 

- ✓ **Soignez les cas limites.** Demande incomplète, dates absurdes, trajet hors zone, trop de passagers. 

- **! Ne laissez jamais le prix transiter par le raisonnement du LLM.** Uniquement par le tool. 

- **! Ne stockez que le nécessaire.** Données personnelles fictives ou minimales, emails vers adresses de test. **! Ne faites pas un CRM analytique complet.** Une vue Airtable ou une page dashboard simple suffit. 

1 **[1]** 'I **C R I T È R E  U LT I M E[1] ' 1** 1 'I La soutenance doit prouver que vous avez compris le métier, construit un flux complet, sécurisé le pricing et rendu la **[1]** 1 **[1]** ' I' solution reprenable. **[1]** 

Brief de démarrage · page 9 / 9 

