---
id: si-c1-ch4-l2
title: SELECT : choisir les colonnes
summary: Projection, *, DISTINCT pour enlever les doublons, AS pour renommer.
---

::: cours SELECT garde certaines colonnes
ref: 79 | Chap. 4 · I. A. Le SELECT | L’instruction SELECT permet la projection

**SELECT** fait une **projection** : il réduit le nombre de colonnes pour ne garder que celles qui répondent au besoin.

```sql
SELECT attribut1, attribut2
FROM table;
```

Les colonnes sont séparées par des **virgules**.
:::

::: cours L’étoile * : toutes les colonnes
ref: 94 | Chap. 4 · Application no 14 — II. Requêtes projection | signifie que tous les champs de la table article sont projetés

Pour afficher **toutes** les colonnes d’une table, on écrit `*` :

```sql
SELECT *
FROM Article;
```

On peut aussi préfixer par le nom de la table : `SELECT Article.*`.
:::

::: sql si-c1-ch4-e5
ref: 94 | Chap. 4 · Application no 14 — II. A. | Liste de tous les produits
niveau: 1
base: ladore
== question
Cas LADORÉ : affiche **tous les champs** de tous les articles.
== solution
SELECT * FROM Article;
== explication
`*` projette tous les champs de la table. Comme il n’y a qu’une table dans le FROM, `SELECT *` et `SELECT Article.*` reviennent au même.
:::

::: sql si-c1-ch4-e6
ref: 95 | Chap. 4 · Application no 14 — II. B. | Liste de tous les clients (Nom, Prenom, CP)
niveau: 1
base: ladore
== question
Liste de tous les clients : affiche **Nom, Prenom, CP** (dans cet ordre).
== solution
SELECT Client.Nom, Client.Prenom, Client.CP
FROM Client;
== explication
On cite les colonnes voulues, séparées par des virgules. Le préfixe `Client.` est facultatif quand il n’y a qu’une table.
:::

::: cours DISTINCT : supprimer les doublons
ref: 79 | Chap. 4 · I. A. Le SELECT | Si l’on souhaite éliminer les doublons

Si une même valeur apparaît plusieurs fois, **DISTINCT** ne la garde qu’une fois :

```sql
SELECT DISTINCT Facture.NumClient
FROM Facture;
```

Exemple du cours : un même client peut avoir **plusieurs factures** (NumClient est une clé étrangère dans FACTURE). Sans DISTINCT, son numéro apparaîtrait plusieurs fois.
:::

::: sql si-c1-ch4-e7
ref: 95 | Chap. 4 · Application no 14 — II. C. | il faut utiliser la clause DISTINCT pour supprimer les doublons
niveau: 1
base: ladore
== question
Affiche la liste des **numéros de clients** ayant au moins une facture, **sans doublon**.
== solution
SELECT DISTINCT Facture.NumClient
FROM Facture;
== explication
Un même numéro de client pouvant figurer plusieurs fois dans FACTURE (car clé étrangère), il faut **DISTINCT** pour supprimer les doublons.
:::

::: cours AS : donner un autre nom (alias)
ref: 79 | Chap. 4 · I. A. Le SELECT | L’instruction AS permet d’attribuer un nouveau nom

**AS** donne un nouveau nom à une colonne affichée : c’est un **alias**.

```sql
SELECT DISTINCT attribut2 AS Alias1
FROM table;
```

Si l’alias contient des espaces, on le met entre crochets : `AS [Nb de factures]`.
:::

::: trous si-c1-ch4-e8
ref: 79 | Chap. 4 · I. A. Le SELECT | SELECT DISTINCT attribut2 AS Alias1
niveau: 1
== question
Complète pour afficher les villes des clients, sans doublon, sous le titre « Villes ».
== texte
SELECT {0} Ville {1} Villes {2} Client;
== reponses
DISTINCT
AS
FROM
== intrus
WHERE
ALL
== explication
**DISTINCT** enlève les doublons, **AS** donne l’alias, **FROM** indique la table.
:::
