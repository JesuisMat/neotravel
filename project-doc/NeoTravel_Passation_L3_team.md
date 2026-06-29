# NeoTravel

## · Documentation de passation ·
## · Procédure équipes NeoTravel ·

*Livrable L3 — remis le 29/06/2026*

*Groupe 21 — Léna Pedelahore, Juliette Brisard, Alan Teurroc, Matthieu Baric*

---

## Table des matières

1. [Ce que l'outil fait pour vous](#1-ce-que-loutil-fait-pour-vous)
2. [Accéder au dashboard](#2-accéder-au-dashboard)
3. [Statuts des leads : ce qu'ils signifient](#3-statuts-des-leads--ce-quils-signifient)
4. [Traiter un cas complexe (escalade HITL)](#4-traiter-un-cas-complexe-escalade-hitl)
5. [Traiter les demandes de rappel](#5-traiter-les-demandes-de-rappel)
6. [Envoyer un devis depuis le dashboard](#6-envoyer-un-devis-depuis-le-dashboard)
7. [Confirmer une prestation (agent de réservation)](#7-confirmer-une-prestation-agent-de-réservation)
8. [Séquence de relances automatiques](#8-séquence-de-relances-automatiques)
9. [Questions fréquentes](#9-questions-fréquentes)
10. [Contacts et ressources](#10-contacts-et-ressources)

---

## 1. Ce que l'outil fait pour vous

Depuis la mise en place du système NeoTravel, voici ce qui se passe **automatiquement** pour chaque nouvelle demande :

| Étape | Qui agit | Ce qui se passe |
|---|---|---|
| Prospect arrive sur le site | Agent IA | Il engage la conversation, pose les questions, collecte toutes les infos du voyage |
| Données complètes collectées | Système | Le devis est calculé automatiquement selon les matrices tarifaires — zéro intervention humaine |
| Devis calculé | Système | Un PDF est généré et envoyé au prospect par email en moins de 3 minutes |
| Sans réponse à J+3 (standard) ou J+2 (urgent) | Système (n8n) | Une relance par email est envoyée automatiquement |
| Toujours sans réponse à J+7 (standard) ou J+5 (urgent) | Système (n8n) | Deuxième relance envoyée |
| 2 relances sans réponse | Système | Dossier clôturé |
| Prospect accepte via l'email | Prospect | Clic sur "J'accepte" → statut mis à jour, relances annulées, vous êtes notifié |
| Prospect refuse via l'email | Prospect | Clic sur "Je refuse" → statut mis à jour, aucune relance future |
| Prospect veut être rappelé | Prospect | Clic sur "Je souhaite être rappelé" → dossier escaladé vers vous automatiquement |
| Cas complexe détecté | Agent IA | Escalade vers le commercial avec tout le contexte de la conversation |

**Ce que vous n'avez plus à faire :** répondre aux demandes simples, calculer les prix, générer les PDFs, envoyer les devis, planifier les relances.

**Ce sur quoi vous vous concentrez :** les cas complexes, les prospects qui ont besoin d'un contact humain, la confirmation des prestations avec les partenaires autocaristes.

---

## 2. Accéder au dashboard

### URL

Le dashboard est accessible à l'adresse : **[URL à compléter après déploiement]/dashboard**

Aucune installation requise. Un navigateur web suffit.

### Ce que vous voyez

Le dashboard s'organise en trois vues :

#### Vue Pipeline

Liste de tous les leads avec leur statut, urgence, trajet et montant. Vous pouvez cliquer sur n'importe quel lead pour voir le détail complet : conversation, devis calculé, historique des actions.

#### Vue Pilotage

Indicateurs clés de performance :

| Indicateur | Ce que ça signifie |
|---|---|
| Total leads | Nombre de demandes reçues sur la période |
| Devis envoyés | Nombre de devis générés et envoyés automatiquement |
| Confirmés | Prestations confirmées avec un partenaire |
| Taux de conversion | Pourcentage de devis aboutissant à une confirmation |
| Qualif. automatique | Part des demandes traitées sans intervention humaine |
| Panier moyen | Montant TTC moyen des devis envoyés |
| Pipeline actif | Somme des montants des devis en attente de réponse |

#### Vue Cas complexes

Deux sous-onglets :
- **En attente** : dossiers avec `statut = complexe` qui attendent votre intervention
- **Historique** : tous les dossiers qui sont passés par une escalade (traités ou clôturés)

### Filtre par mois

En haut du dashboard, un sélecteur vous permet de filtrer par mois. Tous les indicateurs et listes se mettent à jour instantanément.

---

## 3. Statuts des leads : ce qu'ils signifient

| Statut | Ce qui s'est passé | Action à faire ? |
|---|---|---|
| **Nouveau** | Prospect vient d'arriver sur le site | Rien — l'agent gère |
| **En qualification** | L'agent collecte les informations manquantes | Rien — l'agent gère |
| **Complet** | Toutes les infos sont collectées, devis en cours | Rien — automatique |
| **Devis envoyé** | Le prospect a reçu son devis par email | Rien — les relances sont planifiées |
| **Relance 1** | Première relance envoyée sans réponse | Surveiller — option d'appel si dossier important |
| **Relance 2** | Deuxième relance envoyée | Appel possible si dossier à fort enjeu |
| **Accepté** | Le prospect a cliqué "J'accepte" dans l'email | **Transmettre à l'agent de réservation** |
| **Confirmé** | Agent de réservation a confirmé avec le partenaire | Prestation en cours — rien de plus |
| **Refusé** | Le prospect a décliné | Rien — dossier tracé, opt-out enregistré |
| **Complexe** | Escalade déclenchée (agent ou prospect) | **INTERVENTION REQUISE** — voir §4 et §5 |
| **Clôturé** | 2 relances sans réponse, ou clôturé manuellement | Rien |

---

## 4. Traiter un cas complexe (escalade HITL)

Quand l'agent détecte un cas qu'il ne peut pas traiter seul, il vous envoie un **email de notification** et le dossier passe en statut **Complexe**.

### Vous recevez un email de notification

L'email contient :
- La **raison de l'escalade** (montant élevé, > 85 passagers, dates incohérentes, trajet atypique, etc.)
- Le **contexte de la conversation** : ce que le prospect a dit, ce que l'agent a compris
- Les **coordonnées du prospect** : nom, email, téléphone
- Le **trajet demandé** et le montant estimé si calculé
- Un **lien direct vers le dossier** dans le dashboard

### Comment traiter le dossier

1. Ouvrir le dossier dans le dashboard (lien dans l'email ou via la vue "Cas complexes")
2. Lire la conversation pour comprendre la situation
3. Contacter le prospect directement (email ou téléphone)
4. Depuis le dashboard, vous pouvez :
   - **Envoyer un devis adapté** via le formulaire intégré (voir §6)
   - **Clôturer le dossier** si le prospect n'est finalement pas intéressé
   - **Marquer comme refusé** si vous avez un retour négatif

### Raisons d'escalade les plus fréquentes

| Cas | Raison | Ce qu'il faut faire |
|---|---|---|
| Montant > 15 000 € TTC | Engagement commercial trop important pour être validé sans humain | Valider le devis calculé, ajuster si besoin, envoyer via dashboard |
| Plus de 85 passagers | Hors plage de la grille tarifaire | Évaluer le besoin, proposer un prix manuellement via le formulaire |
| Trajet hors France / international | Pas de règle tarifaire applicable | Évaluer au cas par cas avec les partenaires |
| Données incohérentes | Dates contradictoires, infos incomplètes | Recontacter le prospect pour clarifier |
| Demande de négociation | Le prospect a demandé à parler à un commercial | Appel ou email commercial |
| Score complétude faible | L'agent n'a pas réussi à collecter toutes les infos | Reprendre la qualification directement |

---

## 5. Traiter les demandes de rappel

Quand un prospect clique sur **"Je souhaite être rappelé"** dans un email de devis, le dossier passe automatiquement en statut **Complexe** avec la mention `rappel_demande`.

Vous recevez une **notification par email** avec :
- Le nom et coordonnées du prospect
- Le trajet concerné
- Le montant du devis qui lui a été envoyé
- Le message : "Le prospect souhaite être rappelé — questions en attente avant décision"

### Ce qu'il faut faire

1. Appeler ou écrire au prospect **dans les meilleurs délais**
2. Clarifier ses questions (prix, logistique, disponibilité, etc.)
3. Depuis le dashboard, selon le résultat :
   - **Envoyer un devis modifié** si le prix doit être ajusté
   - **Marquer comme accepté** si le prospect confirme oralement
   - **Marquer comme refusé** si le prospect ne souhaite pas aller plus loin

> **Note :** les relances automatiques sont désactivées dès que le prospect demande à être rappelé. Vous gérez la suite manuellement.

---

## 6. Envoyer un devis depuis le dashboard

Pour les dossiers en statut **Complexe**, vous pouvez envoyer un devis directement depuis le dashboard, sans passer par le chat.

### Accès

1. Ouvrir le dossier dans la vue "Cas complexes"
2. Cliquer sur **"Envoyer un devis"**

### Formulaire à remplir

| Champ | Obligatoire | Notes |
|---|---|---|
| Email du prospect | Oui | Pré-rempli depuis la demande |
| Nom du prospect | Non | Pré-rempli si disponible |
| Téléphone | Non | Pré-rempli si disponible |
| Ville de départ | Oui | Pré-remplie depuis la conversation |
| Destination | Oui | Pré-remplie depuis la conversation |
| Date de départ | Oui | Format JJ/MM/AAAA |
| Heure de départ | Non | Format HH:MM |
| Date de retour | Non | Si aller/retour |
| Heure de retour | Non | |
| Nombre de passagers | Oui | 1 à 85 — au-delà, traitement entièrement manuel |
| Options | Non | Guide (80€/jour), Nuit chauffeur (120€/nuit), Péages (90€ forfait) |
| Niveau d'urgence | Oui | Standard / Urgent / Très urgent |

### Ce qui se passe après envoi

- Le devis est calculé selon les mêmes matrices tarifaires que l'agent
- Un PDF est généré et envoyé au prospect par email
- Le dossier passe en statut **Devis envoyé**
- Le prospect reçoit les liens signés (accepter / refuser / rappel)

> **Seuil automatique :** si le montant TTC calculé dépasse 15 000 €, le système bloque l'envoi automatique. Vous devez traiter ce cas entièrement manuellement (devis Word/Excel comme avant).

---

## 7. Confirmer une prestation (agent de réservation)

Quand un prospect accepte un devis (clic sur "J'accepte" dans l'email), le dossier passe en statut **Accepté** et vous recevez une notification.

### Ce que ça signifie

L'acceptation du prospect est une **intention**. NeoTravel étant intermédiaire, vous devez encore identifier et confirmer un partenaire autocariste disponible avant que la prestation soit garantie.

### Étapes

1. Recevoir la notification (email) : "Prospect a accepté le devis"
2. Identifier un partenaire autocariste disponible pour le trajet
3. Confirmer les conditions avec le partenaire
4. Dans le dashboard, ouvrir le dossier et cliquer sur **"Confirmer la prestation"**
5. Le statut passe à **Confirmé** — le dossier est soldé côté système

> **Important :** ne jamais confirmer sans avoir vérifié la disponibilité d'un partenaire. Le statut "Confirmé" signifie que NeoTravel a un engagement ferme vis-à-vis du prospect.

---

## 8. Séquence de relances automatiques

Le système envoie automatiquement jusqu'à 2 relances par devis. Voici les délais exacts :

| Type de demande | Relance 1 | Relance 2 | Clôture |
|---|---|---|---|
| Standard (départ > 30 jours) | J+3 après l'envoi du devis | J+7 après l'envoi du devis | Après relance 2 sans réponse |
| Urgent (départ dans 14 à 30 jours) | J+2 après l'envoi du devis | J+5 après l'envoi du devis | Après relance 2 sans réponse |
| Prioritaire (départ < 14 jours) | J+2 après l'envoi du devis | J+5 après l'envoi du devis | Après relance 2 sans réponse |

### Les relances sont automatiquement annulées si

- Le prospect clique "J'accepte" dans n'importe quel email
- Le prospect clique "Je refuse" dans n'importe quel email
- Le prospect clique "Je souhaite être rappelé" (dossier passe en manuel)
- Vous mettez à jour le statut manuellement depuis le dashboard

> Maximum 2 relances par devis. Au-delà, le dossier est clôturé. La persistance excessive nuit à l'image de NeoTravel.

---

## 9. Questions fréquentes

### Un prospect dit qu'il n'a pas reçu son devis

1. Vérifier dans le dashboard que le dossier est bien au statut **Devis envoyé**
2. Si oui : demander au prospect de vérifier ses spams — l'email vient de `onboarding@coble.fr`
3. Si le statut est bloqué en **En qualification** : contacter l'équipe technique (le calcul a peut-être échoué)
4. Si nécessaire : utiliser le formulaire dashboard (§6) pour renvoyer un devis manuellement

### Je veux recontacter un prospect avant la relance automatique

Le système n'empêche pas d'agir en parallèle. Vous pouvez appeler ou écrire au prospect à tout moment. Si vous avez un retour positif, mettez à jour le statut manuellement dans le dashboard pour annuler les relances automatiques.

### Un prospect a accepté par téléphone mais le statut est toujours "Devis envoyé"

Dans le dashboard, ouvrir le dossier et utiliser l'action **"Marquer comme accepté"**. Les relances automatiques sont alors annulées et vous recevez les instructions pour la suite (confirmation partenaire).

### Je veux voir tous les devis acceptés du mois

Dans le dashboard, sélectionner le mois souhaité via le filtre en haut, puis filtrer la liste par statut = **Accepté** ou **Confirmé**.

### L'agent a mal compris une demande

1. Ouvrir le dossier — vous voyez la conversation complète
2. Si la demande est récupérable : passer le statut en **Complexe** et contacter le prospect directement
3. Signaler le cas à l'équipe technique (voir §10) pour améliorer le comportement de l'agent

### Un prospect demande une remise ou à négocier le prix

L'agent ne peut pas négocier — il escalade automatiquement. Vous recevez la notification et traitez directement avec le prospect. Si vous accordez une remise, envoyez un devis ajusté depuis le dashboard en modifiant les paramètres du trajet pour obtenir le prix souhaité (ajustement possible via le champ urgence notamment).

### Comment voir le coût des conversations IA ?

Les données de consommation sont stockées dans les logs (table `logs` dans Supabase, champs `tokens_input`, `tokens_output`). L'objectif est de rester sous 0,01 EUR par devis. Contacter l'équipe technique pour un export.

### Le dashboard n'affiche pas les dernières demandes

Le dashboard se charge au chargement de la page. Rafraîchir la page (F5 ou Ctrl+R) pour voir les données les plus récentes.

---

## 10. Contacts et ressources

| Qui contacter | Pour quoi | Comment |
|---|---|---|
| **Équipe technique (développeurs)** | Bug, problème technique, modification du comportement de l'agent | Email / Slack [à compléter] |
| **Admin n8n** | Modifier les délais de relance, voir les logs des envois | app.n8n.cloud — identifiants équipe |
| **Admin Supabase** | Accès direct à la base de données, exports | app.supabase.com — identifiants équipe |
| **Admin Resend** | Problèmes d'envoi d'emails, statistiques de délivrabilité | app.resend.com — identifiants équipe |
| **Admin Vercel** | Redéploiement, variables d'environnement, logs d'erreur | vercel.com — identifiants équipe |

### Identifiants

Les identifiants de chaque service sont conservés par [responsable à désigner]. Ne pas partager les clés API par email ou messagerie non sécurisée.

---

*Document produit le 29/06/2026 — Groupe NeoTravel (Groupe 21)*

*Ce guide s'adresse aux commerciaux, agents de réservation et à la direction de NeoTravel. Pour la documentation technique, voir [`NeoTravel_L3_Passation.md`](./NeoTravel_L3_Passation.md).*
