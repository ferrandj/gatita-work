---
id: si-c1-ch2-l3
title: Les dépendances fonctionnelles et la SAT
summary: Relier les données (S → B), trouver les données sources, construire la structure d’accès théorique.
---

::: cours La dépendance fonctionnelle
ref: 49 | Chap. 2 · III. A. Les dépendances fonctionnelles | Il y a dépendance fonctionnelle entre une donnée S et une donnée B

Il y a **dépendance fonctionnelle (DF)** entre une donnée **S** et une donnée **B** si, **connaissant une valeur de S, on en déduit une et une seule valeur de B**.

S est la **source**, B le **but**. On note **S → B**.

Exemple du cours : connaissant la référence d’un modèle de vaisselle (REF.MODEL), on connaît à coup sûr ses dimensions, sa contenance, sa couleur : `REF.MODEL → CM`, `REF.MODEL → LITRE`…
:::

::: cours Transitive ou multiple
ref: 49 | Chap. 2 · III. A. Les dépendances fonctionnelles | Une dépendance fonctionnelle peut être transitive

- **transitive** : code postal → département → région. Seules les DF **directes** sont utiles, les autres se retrouvent par transitivité ;
- **multiple** : il faut **plusieurs** sources pour obtenir le but. Ex. : le **classement** d’un club dépend du **club** et de l’**année** : (Club, Année) → Classement.
:::

::: qcm si-c1-ch2-l3-e1
ref: 49 | Chap. 2 · III. A. Les dépendances fonctionnelles | on en déduit une et une seule valeur de B
niveau: 1
== question
NumClient → NomClient signifie…
== choix
- [x] connaissant un numéro de client, on connaît un et un seul nom
- [ ] connaissant un nom, on connaît un seul numéro
- [ ] le nom est calculé à partir du numéro
- [ ] le numéro et le nom sont des synonymes
== explication
S → B : une valeur de la source donne une et une seule valeur du but.
:::

::: qcm si-c1-ch2-l3-e2
ref: 50 | Chap. 2 · III. A. Les dépendances fonctionnelles | il peut y avoir des dépendances fonctionnelles multiples
niveau: 2
== question
Le classement d’un club dépend du club **et** de l’année. C’est une dépendance…
== choix
- [ ] transitive
- [x] multiple
- [ ] simple
- [ ] impossible
== explication
Plusieurs sources sont nécessaires : (Club, Année) → Classement.
:::

::: qcm si-c1-ch2-l3-e3
ref: 50 | Chap. 2 · III. A. Les dépendances fonctionnelles | Seules les dépendances fonctionnelles directes sont utiles
niveau: 2
== question
Code postal → département et département → région. Faut-il écrire code postal → région ?
== choix
- [ ] Oui, toujours
- [x] Non : c’est une DF transitive, on la retrouve par transitivité
- [ ] Oui, c’est une DF multiple
== explication
Seules les DF directes sont utiles.
:::

::: cours Les 4 étapes pour obtenir la liste des DF
ref: 50 | Chap. 2 · III. B. 1. L’obtention de la liste | repose sur quatre étapes

1. **Rechercher les données sources** : uniques, sans doublon, jamais vides. On les repère à leur nom : CodeXXX, NumXXX, Matricule, Référence, Identifiant ;
2. **Repérer les données buts** de chaque source ;
3. **Repérer les DF multiples** pour les données qui restent ;
4. **Chercher les DF entre les données sources** elles-mêmes (ex. : NumContrat → NumClient, car un contrat appartient à un seul client).

Si une donnée du dictionnaire reste sans place, le travail est **incomplet**.

> Le **code postal n’est jamais un identifiant** ; le téléphone non plus, en général (certaines personnes n’en ont pas).
:::

::: qcm si-c1-ch2-l3-e4
ref: 50 | Chap. 2 · III. B. 1. L’obtention de la liste | Étape 1 : recherche des données sources
niveau: 1
== question
Laquelle est très probablement une **donnée source** ?
== choix
- [x] NumContrat
- [ ] DateContrat
- [ ] Ville
- [ ] Marque
== explication
Les données sources sont souvent des CodeXXX, NumXXX, Matricule, Référence, Identifiant.
:::

::: qcm si-c1-ch2-l3-e5
ref: 51 | Chap. 2 · III. B. 1. L’obtention de la liste | le code postal n’est jamais un identifiant
niveau: 1
== question
Le code postal peut-il servir d’identifiant ?
== choix
- [ ] Oui, il est unique
- [x] Non, jamais
- [ ] Seulement à Paris
== explication
Le code postal n’est jamais un identifiant : plusieurs clients ont le même.
:::

::: ordre si-c1-ch2-l3-e6
ref: 50 | Chap. 2 · III. B. 1. L’obtention de la liste | repose sur quatre étapes
niveau: 2
== question
Remets dans l’ordre les 4 étapes.
== ordre
Rechercher les données sources
Repérer les données buts
Repérer les DF multiples
Chercher les DF entre données sources
== explication
Sources, buts, DF multiples, puis DF entre sources.
:::

::: cours La structure d’accès théorique (SAT)
ref: 51 | Chap. 2 · III. B. 2. La structure d’accès théorique (SAT) | La SAT est une représentation dans l’espace

La **SAT** représente la liste des DF **dans l’espace** :

- les **données sources** dans des **cartouches** ;
- les **données buts** en dessous ;
- des **flèches** entre les sources (ex. : COMMANDE → CLIENT : une commande est passée par un seul client).

Elle donne une vue d’ensemble et fait apparaître les liens manquants. À l’examen, on l’utilise comme **point final** de la modélisation.

> Toutes les données du dictionnaire doivent se retrouver sur la SAT, et aucune (sauf les paramètres) ne doit rester isolée.
:::

::: qcm si-c1-ch2-l3-e7
ref: 54 | Chap. 2 · III. C. L’illustration d’ensemble — à retenir | Toutes les données du dictionnaire doivent se retrouver sur SAT
niveau: 2
== question
Sur une SAT, une donnée peut-elle rester isolée des autres ?
== choix
- [ ] Oui, c’est fréquent
- [x] Non, sauf les paramètres
- [ ] Seulement les données sources
== explication
Toutes les données doivent figurer sur la SAT, et aucune (sauf paramètres) ne doit être isolée.
:::

::: cours L’exemple des chaudières
ref: 52 | Chap. 2 · III. C. L’illustration d’ensemble | Chaque client d’une société spécialisée dans la maintenance

Une société de maintenance de chaudières suit ses clients sur une fiche (contrat, chaudières, visites).

- on **exclut** le Total (donnée calculée) ;
- **sources** : NumClient, NumContrat, NumChaudiere, NumVisite ;
- **buts** : NumClient → Civil, Nom, Prenom, Rue, CodePostal, Ville ; NumContrat → DateContrat ; NumChaudiere → Marque, Modele ; NumVisite → DateVisite, MontantMainOeuvre, MontantPieces, TauxMoyen ;
- **Nombre** reste : il dépend du contrat **et** de la chaudière → **DF multiple** (NumContrat, NumChaudiere) → Nombre ;
- **entre sources** : NumContrat → NumClient (un contrat, un seul client), NumVisite → NumContrat (une visite, un seul contrat).
:::

::: qcm si-c1-ch2-l3-e8
ref: 53 | Chap. 2 · III. C. L’illustration d’ensemble | la donnée Nombre est liée à une dépendance fonc
niveau: 3
== question
Dans l’exemple des chaudières, pourquoi « Nombre » n’est-il pas un but de NumContrat seul ?
== choix
- [ ] Parce que c’est une donnée calculée
- [x] Parce qu’un contrat concerne plusieurs chaudières : il faut le contrat ET la chaudière
- [ ] Parce que c’est un paramètre
- [ ] Parce que c’est un booléen
== explication
Un contrat → plusieurs nombres (un par chaudière) : c’est une DF multiple (NumContrat, NumChaudiere) → Nombre.
:::

::: qcm si-c1-ch2-l3-e9
ref: 53 | Chap. 2 · III. C. L’illustration d’ensemble | Un contrat est nécessairement lié à un et un seul client
niveau: 2
== question
Quelle DF entre données sources est juste ?
== choix
- [x] NumContrat → NumClient
- [ ] NumClient → NumContrat
- [ ] NumChaudiere → NumVisite
- [ ] NumClient → NumVisite
== explication
Un contrat est lié à un et un seul client ; un client peut avoir plusieurs contrats.
:::
