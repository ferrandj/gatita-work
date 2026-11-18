---
id: si-c1-ch2-l1
title: Représenter une base de données
summary: Modèle, approche conceptuelle (Merise, UML) et approche relationnelle (MRD) avec ses variantes.
---

::: cours Un modèle, c’est la réalité simplifiée
ref: 39 | Chap. 2 · Introduction | Un modèle est une représentation simplifiée de la réalité

Avant d’utiliser un ordinateur, on **schématise** les liens entre les données : c’est la **modélisation**. Un **modèle** est une représentation **simplifiée** de la réalité, qui facilite la communication.

On part de l’observation de la réalité (**approche ascendante**), en trois phases :

1. le **repérage** des données ;
2. la détermination des **liens** entre les données ;
3. le recours à un **formalisme** de présentation.
:::

::: cours Base de données et formalismes
ref: 39 | Chap. 2 · I. Les différentes façons de représenter une base | Une base de données est un ensemble organisé d’informations sur des supports

Une **base de données** est un ensemble **organisé** d’informations sur des supports (numériques aujourd’hui, mais des fiches papier peuvent suffire). Sa valeur tient à sa **structure**.

Deux grands formalismes :

- **conceptuel** : une représentation **pour les humains**, indépendante de la mise en œuvre, qu’on peut discuter et corriger ;
- **relationnel** : une représentation **prête à être installée** dans un logiciel, compréhensible par une **machine**.
:::

::: qcm si-c1-ch2-l1-e1
ref: 39 | Chap. 2 · Introduction | le repérage des données
niveau: 1
== question
Quelle est la **première** phase de l’approche ascendante ?
== choix
- [x] Le repérage des données
- [ ] Le recours à un formalisme
- [ ] La détermination des liens
- [ ] L’installation du logiciel
== explication
Repérage des données, puis liens entre les données, puis formalisme.
:::

::: ordre si-c1-ch2-l1-e2
ref: 39 | Chap. 2 · Introduction | sur trois phases fondamentales
niveau: 1
== question
Remets dans l’ordre les trois phases de l’approche ascendante.
== ordre
Repérage des données
Liens entre les données
Formalisme de présentation
== explication
On observe d’abord, puis on relie, puis on présente.
:::

::: qcm si-c1-ch2-l1-e3
ref: 40 | Chap. 2 · I. Les différentes façons de représenter une base | le formalisme relationnel : son objectif est de disposer
niveau: 1
== question
Quel formalisme est compréhensible par une **machine**, prêt à être installé dans un logiciel ?
== choix
- [ ] Le formalisme conceptuel
- [x] Le formalisme relationnel
- [ ] Le dessin libre
== explication
Le relationnel est prêt à être implémenté ; le conceptuel est fait pour être discuté entre humains.
:::

::: cours L’approche conceptuelle : Merise (entité-association)
ref: 41 | Chap. 2 · I. A. 1. Merise | Cette approche est aussi intitulée modèle ENTITÉ-ASSOCIATION

Merise, ou modèle **entité-association**, repose sur trois concepts :

- les **entités** : les blocs principaux de la base (ex. : AVION, AÉROPORT, MOUVEMENT) ;
- les **associations** : les liens entre ces blocs ;
- les **cardinalités** : elles précisent la nature des associations, et distinguent :
  - l’association **hiérarchique** : un lien direct et unique (un vol part d’**un seul** aéroport) ;
  - l’association **non hiérarchique** : des liens multiples (un pilote fait plusieurs vols, un vol a plusieurs pilotes).

Depuis la réforme de 2020, l’approche conceptuelle est **en retrait** : le cours ne la garde que pour aider à comprendre.
:::

::: qcm si-c1-ch2-l1-e4
ref: 41 | Chap. 2 · I. A. 1. Merise | Cette approche est aussi intitulée modèle ENTITÉ-ASSOCIATION
niveau: 1
== question
Quels sont les trois concepts clés du modèle entité-association ? (plusieurs réponses)
== choix
- [x] Les entités
- [x] Les associations
- [x] Les cardinalités
- [ ] Les requêtes
== explication
Entités, associations, cardinalités.
:::

::: qcm si-c1-ch2-l1-e5
ref: 41 | Chap. 2 · I. A. 1. Merise | Une association non hiérarchique traduit des liens multiples
niveau: 2
== question
Un pilote réalise plusieurs vols et un vol est réalisé par plusieurs pilotes. C’est une association…
== choix
- [ ] hiérarchique
- [x] non hiérarchique
- [ ] impossible
== explication
Des liens multiples dans les deux sens : association non hiérarchique (elle deviendra une table de lien dans le MRD).
:::

::: cours L’approche UML : diagramme de classe
ref: 41 | Chap. 2 · I. A. 2. L’approche UML | L’approche UML (Unified Modeling Language)

**UML** (*Unified Modeling Language*) est une méthode normalisée, utilisée partout ; elle pourrait servir de support à l’examen. On y dessine un **diagramme de classe**.

Différences avec Merise :

- **pas de verbes** pour nommer les associations (sauf si c’est utile) ;
- les cardinalités sont **simples** (`1`) ou **doubles** (`0..*`) ; une seule cardinalité = le **maximum** ;
- elles se lisent **dans l’ordre inverse** de Merise.
:::

::: qcm si-c1-ch2-l1-e6
ref: 42 | Chap. 2 · I. A. 2. L’approche UML | la cardinalité se lit en inversant l’ordre avec l’approche Merise
niveau: 2
== question
Par rapport à Merise, les cardinalités UML…
== choix
- [ ] se lisent dans le même sens
- [x] se lisent dans l’ordre inverse
- [ ] n’existent pas
- [ ] s’écrivent avec des verbes
== explication
La cardinalité se lit en inversant l’ordre avec l’approche Merise.
:::

::: cours L’approche relationnelle (MRD)
ref: 43 | Chap. 2 · I. B. L’approche logico-relationnelle | On parlera alors de modèle logique de données (MLD)

Le **modèle logique de données (MLD)** représente la base sous une forme compréhensible par un ordinateur. Comme les SGBD sont liés au modèle **relationnel**, on parle aussi de **modèle relationnel de données (MRD)**.

Les associations deviennent des **clés étrangères** : des clés primaires recopiées pour relier les blocs, appelés **tables**.

Trois variantes de présentation :

- **textuelle** : `AVION(id, modele, …)` puis « Clé primaire : id », « Clés étrangères : idAvion en référence à id de AVION » ;
- **Merise** (celle du cours) : la **clé primaire en premier**, en gras et soulignée, des noms explicites (idType, pas id), les **clés étrangères en fin de liste, précédées de #** ;
- **graphique** : des blocs reliés avec PK (*primary key*) et clés étrangères mises en valeur.
:::

::: qcm si-c1-ch2-l1-e7
ref: 43 | Chap. 2 · I. B. L’approche logico-relationnelle | les clés étrangères, qui correspondent à des clés primaires
niveau: 1
== question
Dans un MRD, comment sont transcrites les associations ?
== choix
- [ ] Par des verbes
- [x] Par des clés étrangères
- [ ] Par des cardinalités
- [ ] Par des couleurs
== explication
Les associations sont transcrites par des clés étrangères (des clés primaires recopiées).
:::

::: qcm si-c1-ch2-l1-e8
ref: 45 | Chap. 2 · I. B. 2. Une variante Merise — méthodologie | Les clés étrangères apparaissent en fin de liste
niveau: 1
== question
Dans la variante Merise du MRD, où sont les clés étrangères ?
== choix
- [ ] En premier, soulignées
- [x] En fin de liste, précédées de #
- [ ] Dans une table à part
- [ ] Elles n’apparaissent pas
== explication
Clé primaire en premier (gras, souligné), clés étrangères en fin de liste avec #.
:::

::: qcm si-c1-ch2-l1-e9
ref: 45 | Chap. 2 · I. B. 2. Une variante Merise — méthodologie | idType pour typeretard, et non plus seulement id
niveau: 2
== question
Pourquoi nommer la clé de TYPERETARD **idType** plutôt que **id** ?
== choix
- [x] Pour un nom explicite qui évite toute confusion
- [ ] Parce que « id » est interdit
- [ ] Pour que la clé soit plus courte
== explication
Des noms suffisamment explicites évitent la confusion quand la clé est recopiée ailleurs.
:::
