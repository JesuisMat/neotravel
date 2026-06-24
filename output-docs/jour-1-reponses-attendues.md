# NeoTravel — Jour 1 · Reponses aux 5 questions attendues
> A remettre en fin de journee du 22 juin 2026

---

## Question 1 — Quel est le processus etudie ?

Le **cycle commercial de NeoTravel**, de la captation du prospect jusqu'a la confirmation de la prestation.

Plus precisement : comment une demande de transport en groupe entre dans l'entreprise, comment elle est qualifiee, tarifee, transformee en devis, envoyee au prospect, relancee si besoin, et finalement acceptee ou refusee.

NeoTravel est un intermediaire (pas de flotte propre). Sa valeur repose entierement sur la qualite et la rapidite de ce cycle commercial. C'est donc le processus central de l'entreprise — et celui qui souffre le plus aujourd'hui.

---

## Question 2 — Qui sont les acteurs impliques ?

| Acteur | Role dans le processus |
|---|---|
| **Prospect** | Exprime un besoin de transport, remplit le formulaire web |
| **Commercial NeoTravel** | Recoit la demande, la qualifie, estime le tarif, envoie le devis, relance le prospect |
| **Agent de reservation** | Intervient apres acceptation : trouve le partenaire autocariste, coordonne la logistique |
| **Direction commerciale** | Pilote le pipeline et les performances (actuellement sans donnees structurees) |
| **Partenaires autocaristes** | Executent la prestation une fois la reservation confirmee (hors perimetre du prototype) |

---

## Question 3 — Quelles sont les etapes du parcours ?

Le parcours actuel comporte 7 etapes, toutes manuelles :

```
1. Demande web
   Le prospect remplit un formulaire sur le site NeoTravel.

2. Reception et qualification manuelle
   Un commercial recoit la demande par email ou CRM, l'analyse et evalue son potentiel.

3. Tarification sur grille interne
   Le commercial applique manuellement la grille tarifaire (distance, saison, passagers, options).

4. Generation manuelle du devis
   Le devis est redige dans Word ou Excel et exporte en PDF.

5. Envoi par email
   Le commercial envoie le devis au prospect.

6. Attente de reponse et relance
   Le prospect accepte, refuse, ou ne repond pas.
   Les relances dependent de la disponibilite du commercial — donc tres aleatoires.

7. Confirmation et reservation
   Si le devis est accepte, l'agent de reservation prend la main :
   il identifie un partenaire autocariste disponible et coordonne la logistique.
```

---

## Question 4 — Ou se trouvent les irritants ?

| Etape | Irritant | Consequence concrete |
|---|---|---|
| Qualification | 60 leads/jour traites manuellement, certains ignores | Leads payants (Google Ads) perdus sans reponse |
| Priorisation | Les commerciaux favorisent les gros dossiers | Inegalite de traitement, manque a gagner invisible |
| Tarification | Grille appliquee a la main, risques d'erreur | Devis incohherents, temps commercial gaspille |
| Generation devis | Redaction manuelle dans Word | Delai eleve entre demande et envoi, leads refroidis |
| Relances | Aleatoires selon la charge du commercial | Prospects oublies, CA perdu |
| Pilotage | Aucun dashboard, aucune donnee structuree | La direction pilote a l'aveugle |
| Acquisition | Campagnes Ads volontairement brideees | Le CA potentiel est plafonne artificiellement |

**L'irritant le plus profond :** NeoTravel bride ses propres campagnes publicitaires parce que le traitement manuel ne suit pas. Ce n'est pas un probleme d'acquisition — c'est un probleme de capacite operationnelle.

---

## Question 5 — Quelles taches semblent repetitives ou automatisables ?

| Tache | Repetitive ? | Automatisable ? | Remarque |
|---|---|---|---|
| Collecte et structuration de la demande | Oui, 60x/jour | Oui, 100% | Chatbot ou formulaire intelligent |
| Detection des informations manquantes | Oui | Oui, 100% | Agent IA avec sorties structurees |
| Qualification (completude, urgence) | Oui | Oui, ~80% | Regles definies, pas de jugement complexe |
| **Calcul du prix** | Oui | Oui, 100% — **JAMAIS par l'IA** | Moteur de regles deterministe `calculer_devis()` |
| Generation du PDF devis | Oui | Oui, 100% | Template code, genere automatiquement |
| Envoi email du devis | Oui | Oui, 100% | Resend / Brevo |
| Relances (J+2, J+3, J+7) | Oui | Oui, 100% | n8n scheduler |
| Mise a jour des statuts | Oui | Oui, 100% | Automatique a chaque action |
| Cas complexes / negociation | Non | Non — human-in-the-loop | Le commercial reste necessaire |
| Identification du partenaire autocariste | Non | Non — hors perimetre MVP | Trop dependant du reseau et du contexte |

**La tache la plus critique a automatiser en premier : `calculer_devis()`.**
C'est le coeur fiable du systeme. Elle doit etre construite et testee en isolation, sans aucun appel au LLM, avant de connecter quoi que ce soit d'autre.

---

*Reponses produites le 22 juin 2026 — Groupe NeoTravel*
