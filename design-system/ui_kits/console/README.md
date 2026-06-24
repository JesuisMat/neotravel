# UI Kit — Console direction

L'espace interne de NeoTravel : la direction pilote le flux commercial, les équipes gèrent les relances et les matrices tarifaires. Sobre, dense, lisible — au service de la décision.

## Vues (rail latéral)
- **Pilotage** (`Pilotage`) — KPIs du dossier de cadrage : leads du jour, devis envoyés, taux de conversion, délai moyen → devis, relances en attente, demandes urgentes, cas complexes. Table des demandes récentes.
- **Pipeline leads** (`Pipeline`) — toutes les demandes, filtrables par statut. `StatusBadge` couvre la machine d'état complète.
- **Relances** (`Relances`) — relances planifiées (J+2 / J+3 / J+7) et rappel des règles métier.
- **Matrices tarifaires** (`Matrices`) — édition des coefficients du moteur `calculer_devis()` : saisonnalité, urgence, capacité, suppléments. Valeurs réelles du dossier de cadrage. Bandeau rappelant le garde-fou déterministe.

## Fichiers
- `index.html` — routeur de vues + ossature.
- `ConsoleShell.jsx` — `ConsoleShell` (rail latéral petrol + barre supérieure).
- `DashboardViews.jsx` — `Pilotage`, `Pipeline`, `Relances`, `LeadTable`, jeu de données `NT_LEADS`.
- `MatricesView.jsx` — `Matrices`, `MatrixCard`, matrices `NT_MATRICES`.

Composants design system utilisés : `StatCard`, `StatusBadge`, `Card`, `Button`, `Avatar`.

> Données fictives uniquement (RGPD — prototype).
