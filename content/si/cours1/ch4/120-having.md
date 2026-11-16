---
id: si-c1-ch4-l12
title: HAVING : filtrer les groupes
summary: Une condition sur un résultat de calcul (SUM, COUNT…) après le GROUP BY.
---

::: cours WHERE ou HAVING ?
ref: 88 | Chap. 4 · II. D. Le regroupement | Il faut pour cela utiliser l’instruction HAVING

- **WHERE** filtre les **lignes**, avant le regroupement ;
- **HAVING** filtre les **groupes**, avec une condition sur la **fonction** (SUM, COUNT…). Il se place **juste après le GROUP BY**.

```sql
SELECT attribut3, attribut2, FONCTION(attribut1) AS alias1
FROM table1
GROUP BY attribut3, attribut2
HAVING condition;
```

On peut reprendre l’**alias** du calcul dans le HAVING.
:::

::: sql si-c1-ch4-e48
ref: 102 | Chap. 4 · Application no 14 — VII. C. 1. | Liste des factures ayant un total TTC supérieur à 1 500
niveau: 2
base: ladore
== question
Liste des factures (**NumFacture**, total TTC) ayant un **total TTC supérieur à 1 500 €**.
== solution
SELECT LIGNE.NumFacture, SUM(Article.PV_TTC * LIGNE.Quantite) AS [Total TTC]
FROM Article, LIGNE
WHERE Article.NumArticle = LIGNE.NumArticle
GROUP BY LIGNE.NumFacture
HAVING SUM(Article.PV_TTC * LIGNE.Quantite) > 1500;
== explication
La condition porte sur le total (une fonction) : elle va dans **HAVING**, pas dans WHERE.
:::

::: sql si-c1-ch4-e49
ref: 102 | Chap. 4 · Application no 14 — VII. C. 2. | ayant acheté plusieurs fois
niveau: 3
base: ladore
== question
Clients (**NumClient, Nom, Prenom** et nombre de factures) ayant acheté **plusieurs fois** au cours de l’année **2019**.
== solution
SELECT Client.NumClient, Client.Nom, Client.Prenom, Count(*) AS [Nb de factures par client]
FROM Client, Facture
WHERE Client.NumClient = Facture.NumClient
AND YEAR(Date_Facture) = 2019
GROUP BY Client.NumClient, Client.Nom, Client.Prenom
HAVING Count(*) > 1;
== indice
« Plusieurs fois » = son numéro figure plusieurs fois dans FACTURE → COUNT(*) > 1.
== explication
Un client qui a acheté plusieurs fois est un client dont le numéro figure plusieurs fois dans FACTURE : on compte par client (GROUP BY) et on garde ceux dont COUNT(*) > 1 (HAVING). L’année 2019 est une condition sur les lignes : WHERE.
:::

::: qcm si-c1-ch4-e50
ref: 88 | Chap. 4 · II. D. Le regroupement | Le HAVING concerne la fonction
niveau: 2
== question
Dans « les clients ayant **plus de 2 factures** en **2019** », où vont les deux conditions ?
== choix
- [ ] Les deux dans WHERE
- [ ] Les deux dans HAVING
- [x] 2019 dans WHERE, COUNT(*) > 2 dans HAVING
- [ ] COUNT(*) > 2 dans WHERE, 2019 dans HAVING
== explication
L’année porte sur chaque ligne (WHERE). Le nombre de factures est un résultat de fonction sur le groupe (HAVING).
:::
