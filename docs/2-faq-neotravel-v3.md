**`N E O T R A V E L  V 2  ·  K I T  P É D A G O G I Q U E`** 

## **FAQ intelligente** 

25 questions pour cadrer vos choix, éviter les contresens et construire une solution utile — pas une démonstration gadget. 

## **`Comprendre le métier avant de coder Automatiser un vrai process commercial`** 

## **`Rester fiable et maintenable`** 

## **Les thèmes abordés** 

Comprendre le projet · Périmètre fonctionnel · IA & tarification · 

Stack & pilotage · Livrables & démo · Pièges à éviter 

## **Comment utiliser** 

Avant de choisir vos outils, relisez les réponses liées au métier, au périmètre attendu, à la tarification et aux livrables. Ce document 

est un repère de cadrage. 

|**PRINCIPE CENTRAL**<br>**« Le sujet n'est pas de faire un simple chatbot — c'est d'automatiser les processus**<br>**commerciaux de Neotravel sans perdre la fiabilité métier ni la valeur humaine. »**<br>L'objectif n'est pas une démo gadget, mais une solution utile pour une PME. Une solution simple et robuste vaut mieux<br>qu'une solution ambitieuse mais instable.<br>ee|
|---|
|**AU PROGRAMME**|
|**01**<br>**02**<br>**03**|
|**Comprendre le projet**<br>**Périmètre fonctionnel**<br>**IA & tarification**|
|Les fondamentaux métier avant de coder<br>Ce que le prototype doit couvrir<br>Ce que l'IA peut — et ne doit pas — faire|
|**04**<br>**05**<br>**06**|
|**Stack & pilotage**<br>**Livrables & démo**<br>**Pièges à éviter**|
|Outils, architecture et budget<br>Ce qui sera attendu et évalué<br>Les erreurs classiques et comment les|
|éviter|



**`PIÈGE N°1 — À LIRE AVANT TOUT`** 

Commencer par l'IA avant d'avoir cadré le process. **Structurez d'abord — automatisez ensuite.** 

FAQ intelligente — page 1 / 6 

`INTERSTELLABS · ATELIER` 

## **Comprendre le projet** 

Questions clés avant toute décision technique. 

## **Quel est le vrai sujet du projet ?** 

Automatiser le **cycle commercial complet** : captation des prospects, qualification des demandes, tarification, création de devis, relances, suivi des statuts et pilotage. Le chatbot n'est qu'un moyen possible — pas l'objectif. 

## **Quel problème cherche-t-on à résoudre ?** 

Neotravel reçoit déjà un flux important de leads. Le problème n'est pas l'acquisition — c'est la **sous-exploitation du flux existant** : délais de traitement, relances manuelles, manque de visibilité et perte d'opportunités commerciales. 

## **Pourquoi l'automatisation est-elle importante ici ?** 

Elle permet de traiter davantage d'opportunités, de réduire les pertes de leads payants, d'accélérer les réponses et d'éviter que l'acquisition soit bridée par la charge opérationnelle. 

## **Quelle est la vraie valeur ajoutée de Neotravel ?** 

Comprendre le besoin, qualifier la demande, trouver le bon partenaire autocariste, négocier et sécuriser la prestation. **La solution digitale doit renforcer cette valeur, pas la remplacer.** 

## **Que signifie « digitaliser sans déshumaniser » ?** 

Automatiser les tâches répétitives (devis standard, relances, statuts), mais garder l'humain pour les cas complexes, la négociation et la relation client. L'objectif est de redonner du temps aux commerciaux sur les tâches à forte valeur. 

## **Par où commencer concrètement ?** 

Par la compréhension du processus actuel : comment une demande arrive, comment elle est traitée, où elle se perd. Avant de choisir vos outils, **cartographiez le process As-Is** — c'est le premier livrable attendu. 

## **`À RETENIR`** 

Avant de choisir vos outils, comprenez le métier, les frictions opérationnelles et la vraie valeur de Neotravel. 

`INTERSTELLABS · ATELIER` 

FAQ intelligente — page 2 / 6 

## **Périmètre fonctionnel** 

Ce que votre prototype doit réellement couvrir. 

## **Quelles fonctionnalités sont obligatoires ?** 

Interface de captation, base de données structurée, qualification de la demande, **moteur de tarification déterministe** , génération automatique de devis, logique de relance, suivi de statut et vue de pilotage. 

## **Peut-on faire uniquement un chatbot ?** 

Non. Un chatbot seul est insuffisant. Il doit être relié à un vrai process : base de données, calcul tarifaire, devis, emailing, statuts et pilotage. **Une interface conversationnelle sans chaîne métier complète ne répond pas au besoin.** 

## **Peut-on faire un formulaire à la place du chatbot ?** 

Oui, si vous le justifiez. Un formulaire peut être plus fiable pour collecter des données structurées. Un parcours hybride (formulaire pour les informations obligatoires + assistant pour clarifier) est aussi recevable. 

## **Quelles données faut-il collecter ?** 

Type de client, nom / société, email, téléphone, villes de départ et destination, dates, nombre de passagers, type de trajet, degré d'urgence, commentaire libre et statut de la demande. 

## **Quels statuts commerciaux prévoir ?** 

Nouveau lead → demande incomplète → demande qualifiée → devis envoyé → relance 1/2 → accepté → refusé → cas complexe transmis → clôturé. Ces statuts déclenchent les actions automatisées. 

## **À quelle fréquence relancer un prospect sans réponse ?** 

La fréquence dépend de l'urgence : une relance à **J+2 pour les demandes urgentes** , à J+3 et J+7 pour les demandes standard. Au-delà de 2 relances sans réponse, le statut passe à « clôturé » — la persistance excessive nuit à l'image de Neotravel. 

## **`À RETENIR`** 

Le bon prototype ne montre pas seulement une interface — il démontre **un flux commercial complet** , de la demande au suivi. 

`INTERSTELLABS · ATELIER` 

FAQ intelligente — page 3 / 6 

## **IA, tarification & fiabilité** 

Ce que l'IA peut faire… et ce qu'elle ne doit jamais faire. 

## **L'IA peut-elle calculer le prix ?** 

Non. Le tarif final doit venir d'un **moteur de règles déterministe** , documenté et testable — jamais du LLM. 

## **Pourquoi ne pas laisser l'IA calculer ?** 

Parce qu'un LLM peut halluciner. Un prix commercial doit être **fiable, reproductible et auditable** . Deux demandes identiques doivent produire le même résultat. 

## **À quoi sert alors l'IA dans le projet ?** 

À **reformuler** une demande en langage naturel, **détecter les informations manquantes** , résumer la demande, orienter un prospect, personnaliser certains messages et aider à prioriser les cas. Le LLM orchestre et dialogue — le code calcule. 

## **Quelle différence entre lookup, RAG et moteur de calcul ?** 

Le **lookup** récupère une valeur exacte dans une base (coefficient de saison). Le **RAG** retrouve une information documentaire pour enrichir une réponse. Le **moteur de calcul** applique des règles métier pour produire un résultat fiable (le prix). 

## **Qu'est-ce qu'un moteur de tarification déterministe ?** 

Un module — du code — qui applique toujours les mêmes règles aux mêmes entrées : **distance, passagers, saison, urgence, options, marge et arrondis** . Il s'appelle `calculer_devis()` , il est testé, et le LLM ne fait que l'invoquer avec des paramètres. 

## **Que doit contenir la documentation du pricing ?** 

Variables, règles, coefficients, cas limites, hypothèses, erreurs possibles et résultats des tests. La logique tarifaire doit rester lisible par un autre développeur ou un responsable métier. 

## **`POINT DE VIGILANCE`** 

L'IA peut assister le process commercial. Elle **ne doit pas inventer les prix** ni contourner les règles métier critiques. 

`INTERSTELLABS · ATELIER` 

FAQ intelligente — page 4 / 6 

## **Stack & pilotage** 

Choisir des outils utiles, cohérents et réalistes. 

## **Quelle stack utiliser ?** 

**Option A** — n8n comme orchestrateur (nœud AI Agent), front React/Next.js, données Airtable, emails Resend/Brevo. **Option B** — Vercel AI SDK dans le back Next.js, Supabase, n8n en back-office pour les relances. Les deux options sont valides si justifiées. 

## **Peut-on choisir d'autres outils ?** 

Oui, si vous les justifiez. Chaque outil doit servir une fonction claire : capter, stocker, automatiser, calculer, envoyer, suivre ou piloter. Évitez d'empiler des outils sans logique d'architecture. 

## **Pourquoi n8n est-il présent dans les deux options ?** 

Parce qu'il reste utile pour les **workflows métier** : relances planifiées, notifications, mises à jour de statut et appels API automatiques. Dans l'option B, le cerveau conversationnel est dans le code Next.js — n8n gère le back-office. 

## **Que doit contenir la vue de pilotage ?** 

Au minimum : nombre de leads reçus, devis générés / envoyés / acceptés / refusés, taux de conversion, relances en attente, demandes urgentes et délais moyens. **Elle doit aider à prendre des décisions, pas seulement afficher des données.** 

## **Comment gérer le budget outils ?** 

Restez réalistes : quelques centaines d'euros par mois au maximum pour un MVP. Mettez le coût en perspective avec les gains : leads mieux exploités, temps commercial libéré, relances automatisées. 

## **Comment tester les relances automatiques pendant la démo ?** 

Configurez un délai court ( **ex. 2 minutes** ) dans votre workflow n8n pour la démonstration. Documentez la configuration réelle (J+3, J+7) dans votre code. Le jury voudra voir une relance planifiée et déclenchée — pas seulement un workflow inactif. 

## **`À RETENIR`** 

Une bonne stack n'est pas celle qui a le plus d'outils — c'est celle qui rend le process **lisible, fiable, maintenable et rentable** pour une PME. 

`INTERSTELLABS · ATELIER` 

FAQ intelligente — page 5 / 6 

## **Livrables, démo & pièges** 

Ce qui sera attendu à la fin… et ce qu'il faut éviter dès le départ. 

## **Quels scénarios démontrer ?** 

Demande simple · demande incomplète · cas urgent ·Demande simple · demande incomplète · cas urgent · devis envoyé sans réponse · devis accepté · devis refusé ·devis accepté · devis refusé · **cas complexe transmis à** cas complexe transmis à **un humain** . Montrez aussi les cas limites et les erreurs. **un humain.** Montrez aussi les cas limites et les erreurs. 

## **Qu'est-ce qui sera le plus valorisé ?** 

La compréhension métier, la fiabilité du pricing, la cohérence de l'architecture, la qualité du flux automatisé et la **capacité à justifier les choix** . 

## **Mon front doit-il être hébergé en ligne ?** 

Oui pour le front (ex. Vercel — gratuit, trivial). Pour l'agent n8n en option A, un **tunnel local** ( `n8n start --tunnel` ou Cloudflare Tunnel) est accepté pendant la démo. Toute la stack hébergée en production = bonus. 

## **`L E S  P I È G E S  À  É V I T E R`** 

## **`PIÈGE 1 — LE PLUS COURANT`** 

Faire **seulement un chatbot** sans process réel derrière : base, calcul, devis, relance, statuts. Un chatbot seul ne répond pas au besoin. 

## **`PIÈGE 2 — LE PLUS DANGEREUX`** 

Laisser **l'IA calculer le prix** . Un LLM peut halluciner un tarif. Le calcul doit venir du code — chaque fois, identique, auditable. 

## **`PIÈGE 3 — LE PLUS FRÉQUENT EN DÉMO`** 

**Oublier les cas limites** : 0 passager, 95 passagers, dates incohérentes, hors zone. Une bonne démo montre ce qui se passe quand ça8 sort du chemin idéal. 

## **`PIÈGE 4`** 

**Sous-documenter** le projet : pricing sans tests, README absent, un seul commit la veille. La passation fait partie de la note. 

## **`MESSAGE FINAL`** 

Votre objectif n'est pas de faire une démo gadget — c'est de concevoir un **processus commercial automatisé, fiable et utile** . Une solution simple mais robuste vaut mieux qu'une solution ambitieuse mais instable. 

`INTERSTELLABS · ATELIER` 

FAQ intelligente — page 6 / 6 

