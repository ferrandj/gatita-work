---
id: si-c1-ch4-l17
title: Modifier : UPDATE
summary: Changer la valeur d’un ou plusieurs champs (hausse de prix, réponse…).
---

::: cours UPDATE … SET … WHERE …
ref: 93 | Chap. 4 · III. C. Requête mise à jour : UPDATE | Cette instruction permet la mise à jour

```sql
UPDATE nom de la table
SET nom colonne = expression
WHERE condition;
```

L’expression peut utiliser l’ancienne valeur :

- augmenter de 5 % : `SET PV_TTC = PV_TTC * 1.05` (1 + 5/100 = 1,05) ;
- baisser de 20 € : `SET PV_TTC = PV_TTC - 20`.

> Le corrigé du cours écrit `*1,051` pour +5 % : c’est une coquille, sa propre note de bas de page donne bien **1,05**.
:::

::: sql si-c1-ch4-e63
ref: 105 | Chap. 4 · Application no 14 — IX. C. 1. | augmenter de 5 % le prix TTC des articles
niveau: 2
base: ladore
== question
Augmente de **5 %** le prix TTC des articles qui valent **moins de 7 €**.
== solution
UPDATE Article
SET PV_TTC = PV_TTC * 1.05
WHERE PV_TTC < 7;
== verification
SELECT NumArticle, PV_TTC FROM Article ORDER BY NumArticle;
== explication
+5 % = × 1,05 (tape 1.05). Le WHERE limite la hausse aux articles à moins de 7 €.
:::

::: sql si-c1-ch4-e64
ref: 105 | Chap. 4 · Application no 14 — IX. C. 3. | diminuer de 20
niveau: 1
base: ladore
== question
Diminue de **20 €** le prix TTC des articles qui coûtent **plus de 2 000 €**.
== solution
UPDATE Article
SET PV_TTC = PV_TTC - 20
WHERE PV_TTC > 2000;
== verification
SELECT NumArticle, PV_TTC FROM Article ORDER BY NumArticle;
== explication
La nouvelle valeur se calcule à partir de l’ancienne : `PV_TTC - 20`.
:::

::: sql si-c1-ch4-e65
ref: 105 | Chap. 4 · Application no 14 — IX. C. 2. | Il est nécessaire de recourir à une sous-requête pour connaître les articles vendus
niveau: 3
base: ladore
== question
Augmente de **2 %** le prix TTC des articles qui valent **plus de 7 €** et qui ont été **vendus en 2019**.
== solution
UPDATE Article
SET PV_TTC = PV_TTC * 1.02
WHERE PV_TTC > 7
AND NumArticle IN (SELECT LIGNE.NumArticle
  FROM LIGNE, Facture
  WHERE LIGNE.NumFacture = Facture.NumFacture
  AND YEAR(Date_Facture) = 2019);
== verification
SELECT NumArticle, PV_TTC FROM Article ORDER BY NumArticle;
== indice
« vendus en 2019 » demande les tables LIGNE et FACTURE : sous-requête avec IN.
== explication
UPDATE n’agit que sur ARTICLE : savoir si l’article a été vendu demande d’autres tables, donc une **sous-requête** (IN).
:::

::: trous si-c1-ch4-e66
ref: 92 | Chap. 4 · II. G. Récapitulatif — Mise à jour | Mise à jour
niveau: 1
== question
Complète les requêtes d’action.
== texte
{0} FROM Client WHERE … ; {1} INTO Article VALUES (…) ; {2} Article {3} PV_TTC = PV_TTC * 1.02 WHERE … ;
== reponses
DELETE
INSERT
UPDATE
SET
== intrus
SELECT
DROP
== explication
DELETE FROM pour supprimer, INSERT INTO … VALUES pour ajouter, UPDATE … SET pour modifier.
:::
