---
id: si-c1-ch4-l15
title: Supprimer : DELETE
summary: Effacer des lignes d’une table selon une condition.
---

::: cours DELETE FROM … WHERE …
ref: 92 | Chap. 4 · III. A. Requête suppression : DELETE | Cette instruction permet la suppression

Les **requêtes d’action** modifient les données. **DELETE** supprime une ou plusieurs lignes selon un critère :

```sql
DELETE FROM nom de la table
WHERE condition;
```

⚠️ Sans WHERE, **toutes** les lignes sont supprimées.
:::

::: sql si-c1-ch4-e59
ref: 104 | Chap. 4 · Application no 14 — IX. A. 1. | Supprimer l’article 2756
niveau: 1
base: ladore
== question
Supprime l’article **B-110** de la table ARTICLE.
== solution
DELETE FROM ARTICLE
WHERE NumArticle = "B-110";
== verification
SELECT NumArticle FROM ARTICLE ORDER BY NumArticle;
== explication
On cible la ligne par sa clé primaire. (Dans le cours, l’exemple supprime l’article 2756.)
:::

::: cours Une seule table à la fois
ref: 93 | Chap. 4 · III. attention | ne figure qu’une seule table

Après DELETE FROM, INSERT INTO ou UPDATE, il n’y a **qu’une seule table** : on n’agit que sur une table à la fois.

Si la condition a besoin d’une **autre table**, il faut **une sous-requête** :

```sql
DELETE FROM CLIENT
WHERE NumClient NOT IN (SELECT Facture.NumClient
                        FROM Facture
                        WHERE YEAR(Date_Facture) > YEAR(NOW()) - 10);
```

→ supprime les clients qui n’ont rien acheté depuis 10 ans.
:::

::: sql si-c1-ch4-e60
ref: 104 | Chap. 4 · Application no 14 — IX. A. 2. | Supprimer tous les clients qui n’ont rien acheté depuis 10 ans
niveau: 3
base: ladore
== question
Supprime tous les clients qui n’ont **aucune facture depuis le 01/01/2019** (dates après le 01/01/2019).
== solution
DELETE FROM CLIENT
WHERE NumClient NOT IN (SELECT Facture.NumClient
  FROM Facture
  WHERE Date_Facture > #01/01/2019#);
== verification
SELECT NumClient FROM CLIENT ORDER BY NumClient;
== indice
La condition porte sur FACTURE : sous-requête avec NOT IN.
== explication
On ne peut agir que sur une table : la condition sur FACTURE passe par une sous-requête. (Le cours utilise `YEAR(NOW())-10` ; ici une date fixe pour que le résultat ne change pas avec le temps.)
:::
