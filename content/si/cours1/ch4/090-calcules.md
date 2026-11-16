---
id: si-c1-ch4-l9
title: Les attributs calculés
summary: Faire des calculs dans le SELECT (+ − × ÷) et les nommer avec un alias.
---

::: cours Calculer dans le SELECT
ref: 86 | Chap. 4 · II. B. Les attributs calculés | Le langage SQL autorise au niveau de l’affichage des attributs tous les calculs

On peut faire **tous les calculs arithmétiques** au moment de l’affichage : `+`, `-`, `*` (multiplier), `/` (diviser), entre une colonne et un nombre ou entre colonnes.

C’est pour ça qu’une donnée **calculée** n’a pas à être stockée dans la base : on la retrouve par le calcul.

Dès qu’on fait un calcul, on lui donne un **alias** avec AS :

```sql
SELECT NumArticle, Libelle, PV_TTC / 1.2 AS [PV HT]
FROM Article;
```

> Le cours écrit les décimales avec une virgule (`1,2`) comme sur papier. Dans un logiciel, et dans l’appli, on tape un **point** : `1.2`.
:::

::: sql si-c1-ch4-e35
ref: 99 | Chap. 4 · Application no 14 — VI. A. | connaître le prix de vente HT
niveau: 2
base: ladore
== question
Affiche **NumArticle, Libelle** et le **prix de vente HT** (alias **PV_HT**) des articles, la TVA étant de **20 %**. (PV_TTC = PV_HT × 1,2)
== solution
SELECT Article.NumArticle, Article.Libelle, Article.PV_TTC / 1.2 AS PV_HT
FROM Article;
== indice
HT = TTC ÷ 1.2 (avec un point).
== explication
TTC = HT × 1,2 donc HT = TTC ÷ 1,2. On tape `1.2` avec un point.
:::

::: sql si-c1-ch4-e36
ref: 99 | Chap. 4 · Application no 14 — VI. B. | AS Montant_LC
niveau: 2
base: ladore
== question
Montant de chaque ligne de facture : **NumFacture, NumArticle, Quantite, PV_TTC** et **Montant_LC** = PV_TTC × Quantite.
== solution
SELECT LIGNE.NumFacture, LIGNE.NumArticle, LIGNE.Quantite, Article.PV_TTC, Article.PV_TTC * LIGNE.Quantite AS Montant_LC
FROM Article, LIGNE
WHERE Article.NumArticle = LIGNE.NumArticle;
== explication
Le prix est dans ARTICLE, la quantité dans LIGNE : jointure, puis calcul entre deux colonnes.
:::

::: qcm si-c1-ch4-e37
ref: 86 | Chap. 4 · II. B. Les attributs calculés | il est préférable de lui associer un alias
niveau: 1
== question
Pourquoi le cours conseille-t-il de donner un **alias** à un calcul ?
== choix
- [ ] C’est obligatoire, sinon erreur
- [x] Pour pouvoir réutiliser facilement le calcul dans la requête (et lire le résultat)
- [ ] Pour que le calcul soit plus rapide
- [ ] Pour stocker le résultat dans la base
== explication
L’alias est un nom de variable qui **facilite la réutilisation éventuelle du calcul dans la requête**.
:::
