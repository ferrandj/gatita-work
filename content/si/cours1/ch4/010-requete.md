---
id: si-c1-ch4-l1
title: C’est quoi une requête ?
summary: Une question posée à la base, en trois temps : le besoin, le SQL, la réponse.
---

::: cours Une question posée à la base
ref: 77 | Chap. 4 · I. Les requêtes : syntaxe de base | Une requête (en anglais, query) est une question posée

Une **requête** (en anglais *query*) est une **question posée à une base de données** sur les informations qu’elle contient : chercher des informations, ou agir dessus (ajouter, supprimer, modifier).

Le langage pour écrire ces questions s’appelle **SQL** (*Structured Query Language*).
:::

::: cours Le raisonnement en trois temps
ref: 77 | Chap. 4 · I. Les requêtes : syntaxe de base | raisonnement en trois temps

Toute requête se construit en trois temps :

1. **Exprimer le besoin** : « Quels sont les professeurs de l’Intec qui habitent hors de Paris ? »
2. **L’écrire en SQL** :
```sql
SELECT NomProf, PrenomProf, Ville
FROM PROFESSEUR
WHERE Ville <> "Paris";
```
3. **Obtenir la réponse** : un tableau avec Bambou Ken (Nanterre), Marlaud Christian (Noisy-le-Sec), Moreau Charles (Neuilly).

> À l’examen, l’étape la plus importante est la **2** : traduire le besoin en SQL.
:::

::: cours Les trois mots de base
ref: 78 | Chap. 4 · I. Les requêtes : syntaxe de base | Les règles de bases reposent sur les instructions

Une requête simple repose sur trois mots-clés :

- **SELECT** suivi des colonnes (rubriques) **à afficher** ;
- **FROM** suivi de la (ou des) **table(s)** concernée(s) ;
- **WHERE** (pas toujours présent) pour les **conditions** (restrictions).

Et on termine par un **;**
:::

::: qcm si-c1-ch4-e1
ref: 78 | Chap. 4 · I. Les requêtes : syntaxe de base | le mot FROM permettant d’indiquer
niveau: 1
== question
Dans une requête, quel mot-clé indique **la table** où chercher ?
== choix
- [ ] SELECT
- [x] FROM
- [ ] WHERE
- [ ] TABLE
== explication
Le mot **FROM** indique la (ou les) table(s) concernée(s). SELECT liste les colonnes à afficher, WHERE les conditions.
:::

::: ordre si-c1-ch4-e2
ref: 77 | Chap. 4 · I. Les requêtes : syntaxe de base | WHERE Ville<> "Paris"
niveau: 1
== question
Remets dans l’ordre la requête qui affiche les professeurs habitant hors de Paris.
== ordre
SELECT
NomProf, PrenomProf, Ville
FROM
PROFESSEUR
WHERE
Ville <> "Paris"
;
== explication
Toujours dans cet ordre : **SELECT** (quoi afficher) → **FROM** (dans quelle table) → **WHERE** (à quelle condition) → **;**
:::

::: qcm si-c1-ch4-e3
ref: 81 | Chap. 4 · I. C. Le WHERE — opérateurs de comparaison | différent
niveau: 1
== question
Que signifie l’opérateur `<>` dans `WHERE Ville <> "Paris"` ?
== choix
- [ ] égal à
- [x] différent de
- [ ] inférieur à
- [ ] contient
== explication
`<>` veut dire **différent**. La requête garde les professeurs dont la ville n’est pas Paris.
:::

::: sql si-c1-ch4-e4
ref: 77 | Chap. 4 · I. Les requêtes : syntaxe de base | Programmer grâce au langage SQL
niveau: 1
base: profs
== question
À toi ! Écris la requête du cours : nom, prénom et ville des professeurs qui habitent **hors de Paris**.
== solution
SELECT NomProf, PrenomProf, Ville
FROM PROFESSEUR
WHERE Ville <> "Paris";
== indice
SELECT … FROM PROFESSEUR WHERE …
== explication
On affiche 3 colonnes (SELECT), depuis PROFESSEUR (FROM), en gardant les lignes où la ville est différente de Paris (WHERE).
:::
