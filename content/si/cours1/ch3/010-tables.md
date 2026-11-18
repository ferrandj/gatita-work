---
id: si-c1-ch3-l1
title: Une base de données, ce sont des tables
summary: Table, ligne, colonne (attribut) : le vocabulaire de base avant d’écrire la moindre requête.
---

::: cours Des tableaux qui rangent les données
ref: 110 | Chap. 5 · I. B. 1. Modèle de données relationnel | Les données sont organisées en tables

Dans une base de données **relationnelle**, les données sont rangées dans des **tables**, c’est-à-dire des tableaux.

- chaque **colonne** représente une catégorie de données (le nom, la ville…) ;
- chaque **ligne** représente un **enregistrement** (un client, une facture…).

Les liens entre les tables sont faits avec des **clés** (on y arrive juste après).
:::

::: cours En extension ou en intention
ref: 55 | Chap. 3 · I. A. Les formes de représentation | en extension ou en intention

On peut montrer une table de deux façons :

- **en extension** : la structure **et** le contenu (les lignes), comme un vrai tableau ;
- **en intention** : seulement le nom de la table et ses colonnes, sur une ligne. C’est la forme préférée par le cours.

```
CLIENT(NumClient, Nom, Prenom, Rue, CodePostal, Ville, AdresseCourriel)
```

Ici, **CLIENT** est la table et ce qu’il y a entre parenthèses sont ses **attributs** (ses colonnes).
:::

::: qcm si-c1-ch3-e1
ref: 110 | Chap. 5 · I. B. 1. Modèle de données relationnel | chaque ligne représente un enregistrement unique
niveau: 1
== question
Dans une table, que représente **une ligne** ?
== choix
- [ ] Une catégorie de données (par ex. la ville)
- [x] Un enregistrement (par ex. un client précis)
- [ ] Le nom de la table
- [ ] Une requête
== explication
Chaque colonne est une catégorie de données, chaque **ligne** est un **enregistrement** unique.
:::

::: qcm si-c1-ch3-e2
ref: 56 | Chap. 3 · I. A. Les formes de représentation | On préférera la représentation en intention
niveau: 1
== question
`DESTINATION(CodeDestination, Libelle)` : cette écriture est une représentation…
== choix
- [ ] en extension
- [x] en intention
- [ ] en SQL
== explication
On ne voit que le nom de la table et ses attributs, sans les lignes : c’est la représentation **en intention**.
:::
