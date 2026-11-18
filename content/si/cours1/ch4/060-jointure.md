---
id: si-c1-ch4-l6
title: Les jointures (version classique)
summary: Interroger plusieurs tables : les citer dans le FROM et les relier dans le WHERE.
---

::: cours Pourquoi joindre ?
ref: 79 | Chap. 4 · I. B. Le FROM | La jointure permet de lier deux ou plusieurs tables

Souvent, les informations utiles sont dans **plusieurs tables** (le nom du client dans CLIENT, la date dans FACTURE…).

La **jointure** relie deux tables grâce à leur **champ commun** : en général la **clé primaire** d’une table et la **clé étrangère** de l’autre.

Sur une copie d’examen on écrit souvent le **#** devant la clé étrangère ; dans un vrai logiciel on ne l’écrit pas.
:::

::: cours La syntaxe classique
ref: 82 | Chap. 4 · II. A. 1. Version antérieure | TABLE1.Attribut = TABLE2.Attribut

Version « antérieure » (sans mot-clé spécial) : on met les tables dans le **FROM**, séparées par des virgules, et on écrit la jointure dans le **WHERE** :

```sql
SELECT DISTINCT Client.Nom, Client.Prenom
FROM Client, Facture
WHERE Client.NumClient = Facture.NumClient;
```

`TABLE1.Attribut = TABLE2.Attribut` : **deux tables différentes, mais le même attribut !**

Le point sert à dire de quelle table vient la colonne : `Client.NumClient`.
:::

::: sql si-c1-ch4-e24
ref: 97 | Chap. 4 · Application no 14 — IV. A. | Un client qui a commandé est un client dont le numéro figure dans la table Facture
niveau: 2
base: ladore
== question
Liste des clients (**Nom, Prenom**) **ayant commandé** (au moins une facture), sans doublon.
== solution
SELECT DISTINCT Client.Nom, Client.Prenom
FROM Client, Facture
WHERE Client.NumClient = Facture.NumClient;
== explication
Un client qui a commandé est un client dont le numéro figure dans FACTURE : on joint CLIENT et FACTURE. Un client avec plusieurs factures apparaîtrait plusieurs fois, d’où **DISTINCT**.
:::

::: cours Plus de deux tables
ref: 82 | Chap. 4 · II. A. 1. Version antérieure | une fois de moins que le nombre de tables

Une jointure n’associe que **deux** tables. Avec plus de tables, on répète la jointure : il en faut **une de moins que le nombre de tables**.

3 tables → 2 jointures, 4 tables → 3 jointures, reliées par **AND** :

```sql
SELECT Article.NumArticle, Article.Libelle, Client.Nom
FROM Client, Facture, LIGNE, Article
WHERE Client.NumClient = Facture.NumClient
AND Facture.NumFacture = LIGNE.NumFacture
AND LIGNE.NumArticle = Article.NumArticle;
```

Pour relier deux tables qui n’ont pas de champ commun, on passe par les tables intermédiaires.
:::

::: qcm si-c1-ch4-e25
ref: 82 | Chap. 4 · II. A. 1. Version antérieure | il faut répéter cette procédure autant de fois
niveau: 1
== question
Une requête utilise **4 tables** dans le FROM. Combien de conditions de jointure faut-il ?
== choix
- [ ] 2
- [x] 3
- [ ] 4
- [ ] 5
== explication
Il faut répéter la jointure **une fois de moins que le nombre de tables** : 4 − 1 = 3.
:::

::: sql si-c1-ch4-e26
ref: 82 | Chap. 4 · II. A. 1. Requête 1 | Quels sont les appels traités par le technicien Hugo Victor
niveau: 2
base: appels
== question
Quels sont les appels (**NumAppel**) traités par le technicien **Hugo Victor** (NomTech = Hugo, PrenomTech = Victor) le **04/04/2025** ?
== solution
SELECT NumAppel
FROM APPEL, TECHNICIEN
WHERE NomTech = "Hugo"
AND PrenomTech = "Victor"
AND DateAppel = #04/04/2025#
AND APPEL.NumTech = TECHNICIEN.NumTech;
== explication
Le nom du technicien est dans TECHNICIEN, l’appel dans APPEL : 2 tables, donc 1 jointure (`APPEL.NumTech = TECHNICIEN.NumTech`), plus les conditions. (Le cours écrit `SELECT NumAppel,` avec une virgule en trop : à ne pas recopier.)
:::

::: sql si-c1-ch4-e27
ref: 83 | Chap. 4 · II. A. 1. Requête 2 | Avec quels clients le technicien Jean Valjean
niveau: 2
base: appels
== question
Avec quels clients (**NumCli, DenomCli**) le technicien **Jean Valjean** a-t-il traité le **12/04/2025** ?
== solution
SELECT CLIENT.NumCli, DenomCli
FROM CLIENT, APPEL, TECHNICIEN
WHERE NomTech = "Valjean"
AND PrenomTech = "Jean"
AND DateAppel = #12/04/2025#
AND CLIENT.NumCli = APPEL.NumCli
AND APPEL.NumTech = TECHNICIEN.NumTech;
== indice
3 tables → 2 jointures. NumCli existe dans CLIENT et APPEL : précise CLIENT.NumCli.
== explication
CLIENT ↔ APPEL ↔ TECHNICIEN : APPEL fait le lien, donc 2 jointures. Comme NumCli existe dans deux tables, on écrit `CLIENT.NumCli` dans le SELECT. (La question du cours parle du 12/04/2019 mais sa requête utilise 2025 ; on garde 2025.)
:::
