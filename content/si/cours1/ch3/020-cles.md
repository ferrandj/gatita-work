---
id: si-c1-ch3-l2
title: Clé primaire et clé étrangère
summary: Ce qui identifie une ligne, et ce qui relie deux tables : indispensable pour les jointures.
---

::: cours Les quatre éléments du modèle relationnel
ref: 56 | Chap. 3 · I. A. Remarque | On peut ainsi identifier les quatre éléments clés du MRD

Le cours retient quatre éléments :

- la **table** (aussi appelée **relation**) : un ensemble de données homogènes ;
- les **attributs** : les données présentes dans la table ;
- la **clé primaire** : le **premier attribut** de la table, qui identifie **chaque ligne de façon unique**, **sans doublon** et **sans valeur nulle**. Elle est écrite en gras et soulignée ;
- la **clé étrangère** : la clé primaire d’une table **recopiée dans une autre table** pour faire le lien entre les deux. On la repère avec le symbole **#**.
:::

::: cours Un exemple
ref: 56 | Chap. 3 · I. A. Les formes de représentation | SEJOUR(CodeSejour

```
DESTINATION(CodeDestination, Libelle)
SEJOUR(CodeSejour, NbrMaxi, Prix, DateDepart, Duree, #CodeDestination)
```

- **CodeDestination** est la clé primaire de DESTINATION ;
- dans SEJOUR, **#CodeDestination** est une clé étrangère : elle dit vers quelle destination va chaque séjour.

C’est grâce à ce champ commun que l’on pourra « relier » les deux tables dans une requête (la **jointure**).
:::

::: qcm si-c1-ch3-e3
ref: 56 | Chap. 3 · I. A. Remarque | sans valeur nulle
niveau: 1
== question
Quelles sont les propriétés d’une **clé primaire** ? (plusieurs réponses)
== choix
- [x] Elle identifie chaque ligne de façon unique
- [ ] Elle peut contenir des doublons
- [x] Elle ne peut pas être vide (nulle)
- [ ] Elle est repérée par le symbole #
== explication
La clé primaire identifie chaque occurrence **de façon unique, sans doublon et sans valeur nulle**. Le # repère la **clé étrangère**.
:::

::: qcm si-c1-ch3-e4
ref: 56 | Chap. 3 · I. A. Remarque | Elle est repérée par le symbole #
niveau: 1
== question
`RESERVER(#NumClient, #CodeSejour, DateReservation, NbPersonnes, TauxRemise)` — que signifie le **#** devant NumClient ?
== choix
- [ ] NumClient est un nombre
- [x] NumClient est une clé étrangère qui vient de la table CLIENT
- [ ] NumClient est un attribut calculé
- [ ] NumClient est facultatif
== explication
Le # repère une **clé étrangère** : la clé primaire de CLIENT recopiée dans RESERVER pour faire le lien.
:::

::: trous si-c1-ch3-e5
ref: 56 | Chap. 3 · I. A. Remarque | pour permettre le lien entre les tables
niveau: 1
== question
Complète la phrase.
== texte
La clé {0} d’une table recopiée dans une autre table devient une clé {1} ; elle permet le {2} entre les tables.
== reponses
primaire
étrangère
lien
== intrus
calculée
doublon
== explication
La clé étrangère correspond à une clé primaire d’une table injectée dans une autre table **pour permettre le lien entre les tables**.
:::
