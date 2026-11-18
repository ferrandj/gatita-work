---
id: si-c1-ch4-l10
title: Les agrégats : COUNT, SUM, AVG, MIN, MAX
summary: Compter, additionner, faire une moyenne, trouver le plus petit ou le plus grand.
---

::: cours Cinq fonctions toutes prêtes
ref: 87 | Chap. 4 · II. C. Les agrégats | On parle à ce sujet d’agrégats

| Fonction | Rôle |
|---|---|
| **COUNT(…)** | compte le nombre d’enregistrements (de lignes) |
| **SUM(…)** | fait la somme (attribut **numérique**) |
| **AVG(…)** | calcule la moyenne (attribut **numérique**) |
| **MIN(…)** | la plus petite valeur (nombre, date…) |
| **MAX(…)** | la plus grande valeur |

```sql
SELECT Count(*) AS Nb_Clients
FROM Client;
```

Le résultat est **une seule ligne** (tant qu’il n’y a pas de GROUP BY).
:::

::: sql si-c1-ch4-e38
ref: 99 | Chap. 4 · Application no 14 — VII. A. 1. | Combien y a-t-il de clients dans la base
niveau: 1
base: ladore
== question
Combien y a-t-il de **clients** dans la base ? (alias **Nb_Clients**)
== solution
SELECT Count(*) AS Nb_Clients
FROM Client;
== explication
COUNT(*) compte les lignes de la table.
:::

::: sql si-c1-ch4-e39
ref: 100 | Chap. 4 · Application no 14 — VII. A. 3. | Combien de factures ont été établies en janvier 2019
niveau: 2
base: ladore
== question
Combien de factures ont été établies en **janvier 2019** ? (alias **Nb_Facture**)
== solution
SELECT Count(*) AS Nb_Facture
FROM Facture
WHERE Date_Facture BETWEEN #01/01/2019# AND #31/01/2019#;
== explication
Le WHERE filtre d’abord les factures de janvier 2019, puis COUNT les compte. Variante : `MONTH(Date_Facture) = 1 AND YEAR(Date_Facture) = 2019`.
:::

::: cours Piège : « combien » ≠ toujours COUNT
ref: 100 | Chap. 4 · Application no 14 — VII. A. 4. | Attention à la question « combien » qui peut être un piège

« Combien d’**articles** ont été vendus ? » : si une ligne de facture contient 3 pochettes, ça fait **3** articles, pas 1.

Il faut donc **additionner les quantités** :

```sql
SELECT SUM(LIGNE.Quantite) AS [Nombre total d’articles vendus]
FROM LIGNE;
```

COUNT compte des **lignes**, SUM additionne des **valeurs**.
:::

::: qcm si-c1-ch4-e40
ref: 100 | Chap. 4 · Application no 14 — VII. A. 4. | il faut faire la somme des quantités vendues
niveau: 2
== question
« Combien d’articles ont été vendus ? » Quelle requête répond correctement ?
== choix
- [ ] SELECT COUNT(*) FROM LIGNE;
- [x] SELECT SUM(Quantite) FROM LIGNE;
- [ ] SELECT COUNT(NumArticle) FROM Article;
- [ ] SELECT MAX(Quantite) FROM LIGNE;
== explication
Il faut faire **la somme des quantités vendues** : COUNT(*) compterait les lignes de facture, pas les articles.
:::

::: sql si-c1-ch4-e41
ref: 100 | Chap. 4 · Application no 14 — VII. A. 5. | Quel est le chiffre d’affaires TTC
niveau: 2
base: ladore
== question
Quel est le **chiffre d’affaires TTC** total ? (alias **CA_TTC** = somme de PV_TTC × Quantite)
== solution
SELECT SUM(A.PV_TTC * LF.Quantite) AS CA_TTC
FROM Article A, LIGNE LF
WHERE A.NumArticle = LF.NumArticle;
== indice
SUM d’un calcul, avec la jointure Article–LIGNE.
== explication
L’argument de SUM est ici le résultat du calcul PV_TTC × Quantite. `Article A` donne l’alias A à la table (plus court à écrire).
:::

::: sql si-c1-ch4-e42
ref: 101 | Chap. 4 · Application no 14 — VII. A. 8. | Quelle est la fourchette de prix des articles
niveau: 1
base: ladore
== question
Quelle est la **fourchette de prix** des articles ? Affiche le prix le plus bas puis le plus haut.
== solution
SELECT MIN(Article.PV_TTC) AS [PV le plus bas], MAX(Article.PV_TTC) AS [PV le plus haut]
FROM Article;
== explication
Plusieurs calculs peuvent être faits en même temps dans le même SELECT.
:::

::: sql si-c1-ch4-e43
ref: 101 | Chap. 4 · Application no 14 — VII. A. 6. | Il faut sélectionner les articles dont le numéro ne commence pas par MO
niveau: 2
base: ladore
== question
Combien d’articles ont été vendus **hors main-d’œuvre** ? (les numéros de main-d’œuvre commencent par **MO**)
== solution
SELECT SUM(LIGNE.Quantite) AS [Nombre total d’articles vendus hors MO]
FROM LIGNE
WHERE NumArticle NOT LIKE "MO*";
== explication
`NOT LIKE "MO*"` : on garde les articles dont le numéro **ne commence pas** par MO, puis on additionne les quantités.
:::
