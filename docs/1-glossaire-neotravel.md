**`N E O T R A V E L  V 2  ·  A N T I - S È C H E`** 

## **Glossaire IA** 

Les termes qui reviennent dans le projet, en une ligne chacun. De quoi parler le même langage dans l'équipe. 

## **`LES BASES DU LLM`** 

**LLM (Large Language Model)** — modèle qui prédit le token suivant ; génère du texte plausible, sans vérifier les faits ni « comprendre ». 

**Token** — unité de texte (≈ ¾ de mot) que le modèle lit et génère ; on mesure le contexte et le coût en tokens. **Inférence** — le fait d'exécuter le modèle pour produire une réponse (par opposition à l'entraînement). 

**Fenêtre de contexte** — quantité maximale de tokens que le modèle « voit » d'un coup (prompt + historique + réponse) ; elle est finie. **Température** — réglage de l'aléatoire des réponses : basse = stable et factuel (extraction), haute = créatif et variable. **Embedding (vecteur)** — représentation numérique d'un texte qui capture son sens ; base de la recherche sémantique. 

## **`PROMPT & CONTEXTE`** 

**Prompt** — le texte fourni au modèle pour guider sa réponse. 

**Prompt système** — instructions de cadrage (rôle, règles, ton, garde-fous) valables sur toute la conversation. 

**Prompt engineering** — l'art de formuler des prompts clairs et efficaces (consignes, exemples, format attendu). 

**Context engineering** — choisir précisément ce qu'on met (et ce qu'on retire) du contexte, pour maximiser la qualité au moindre coût. **Few-shot** — donner quelques exemples dans le prompt pour montrer le comportement ou le format attendu. 

## **`AGENTS & OUTILS`** 

**Agent (IA)** — système où le LLM mène une tâche en plusieurs étapes et décide d'appeler des outils pour agir. 

**Orchestration** — la logique qui enchaîne conversation, appels d'outils et réponses (dans n8n ou dans le code via le SDK). 

**Tool / function calling** — le modèle déclenche une fonction (ex. `calculer_devis()` ) avec des paramètres structurés ; c'est le code qui s'exécute. 

**Sorties structurées** — forcer la réponse à respecter un schéma (JSON) pour obtenir des données fiables et typées. 

**JSON Schema** — description formelle de la structure attendue d'une réponse (champs, types, champs obligatoires). **Mémoire (de session)** — ce que l'agent retient d'un tour de conversation à l'autre (souvent via un identifiant de session). **Streaming** — affichage de la réponse au fil de sa génération (token par token), pour une expérience fluide. 

**MCP (Model Context Protocol)** — protocole standard pour connecter un agent à des outils et des données externes. 

`INTERSTELLABS · ATELIER` 

Glossaire IA — page 1 / 2 

## **`G L O S S A I R E  I A  ·  S U I T E`** 

## **`CONNAISSANCE & DONNÉES`** 

**RAG (Retrieval-Augmented Generation)** — aller chercher des extraits pertinents dans une base avant de répondre, pour ancrer la réponse sur des sources. 

**Recherche sémantique** — retrouver une information par le sens (via embeddings) plutôt que par mots-clés exacts. 

**Vector store (base vectorielle)** — base qui stocke des embeddings pour la recherche sémantique (ex. `pgvector` ). **Grounding (ancrage)** — fonder les réponses sur des données vérifiées plutôt que sur la « mémoire » du modèle. 

**Lookup déterministe** — lecture exacte d'une valeur en base (≠ recherche sémantique) ; utilisé pour lire les règles de prix. 

## **`FIABILITÉ, SÉCURITÉ & EXPLOITATION`** 

**Hallucination** — réponse fluide et plausible, mais fausse ou inventée. 

**Garde-fou (guardrail)** — règle ou mécanisme qui empêche un comportement indésirable (ex. le prix vient toujours du code). **Déterministe / non-déterministe** — code : même entrée → même sortie ; LLM : sorties variables pour la même entrée. **Human In The Loop (HITL)** — insérer une validation humaine aux étapes critiques (cas sensibles, échec d'outil). 

**Prompt injection** — attaque où un texte malveillant détourne l'agent ; risque n°1 du classement OWASP des applications LLM. **Observabilité / tracing** — tracer ce que fait l'agent (prompts, outils, tokens, coût, latence) pour déboguer et maîtriser les coûts. **Évaluation (evals)** — mesurer la qualité d'un système non-déterministe (jeu de cas, jugement humain ou « LLM-as-judge »). **Golden dataset** — jeu de cas de référence (entrées + sorties attendues) servant de base aux tests. 

**Idempotence** — propriété d'une action qui, rejouée, ne produit pas d'effet en double (ex. une relance n'est pas envoyée deux fois). 

## **`LA STACK DU PROJET`** 

**Vibe coding** — développer en pilotant un assistant IA (Cursor, Claude Code) qui génère et édite le code. 

**n8n** — outil d'automatisation par workflows ; son nœud « AI Agent » peut orchestrer l'agent. 

**Vercel AI SDK** — bibliothèque TypeScript pour coder un agent (streaming, tool calling) dans Next.js. **Webhook** — URL qui reçoit un événement déclencheur (ex. nouvelle demande) pour lancer un workflow. 

Glossaire IA — page 2 / 2 · voir aussi le livret « Points d'attention » 

`INTERSTELLABS · ATELIER` 

