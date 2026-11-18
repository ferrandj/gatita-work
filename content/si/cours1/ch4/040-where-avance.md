---
id: si-c1-ch4-l4
title: WHERE : dates, intervalles, LIKE, NULL
summary: BETWEEN … AND …, les dates entre #, LIKE avec *, IS NULL.
---

::: cours Les dates
ref: 96 | Chap. 4 · Application no 14 — III. E. | Les champs de type date sont entourés de dièses ou de guillemets

Dans le cours, une date s’écrit **entre dièses** (ou entre guillemets) :

```sql
SELECT Client.*
FROM Client
WHERE Client.Date_Creation >= #01/09/2019#;
```

`>= #01/09/2019#` veut dire « le 1er septembre 2019 ou après ».

> Dans l’appli, tu peux écrire les dates comme le cours (`#01/09/2019#`, jour/mois/année).
:::

::: sql si-c1-ch4-e14
ref: 96 | Chap. 4 · Application no 14 — III. E. | Liste des nouveaux clients depuis le 1er septembre 2019
niveau: 1
base: ladore
== question
Liste des **nouveaux clients** (tous les champs) depuis le **1er septembre 2019** (inclus).
== solution
SELECT Client.*
FROM Client
WHERE Client.Date_Creation >= #01/09/2019#;
== explication
`>=` inclut le 1er septembre. La date s’écrit entre dièses.
:::

::: cours BETWEEN … AND … : un intervalle
ref: 96 | Chap. 4 · Application no 14 — III. F. | Liste des factures (NumFacture, NumClient) établies en octobre 2019

**BETWEEN valeur1 AND valeur2** garde les valeurs comprises entre les deux (bornes **incluses**).

Les factures d’octobre 2019, trois façons équivalentes d’après le cours :

```sql
WHERE Date_Facture BETWEEN #01/10/2019# AND #31/10/2019#
```
```sql
WHERE Date_Facture >= #01/10/2019# AND Date_Facture <= #31/10/2019#
```
```sql
WHERE MONTH(Date_Facture) = 10 AND YEAR(Date_Facture) = 2019
```

MONTH() donne le mois d’une date, YEAR() son année. (Le corrigé du cours écrit ces dates à l’anglo-saxonne, mois/jour : `'10/1/2019'`.)
:::

::: sql si-c1-ch4-e15
ref: 96 | Chap. 4 · Application no 14 — III. F. | BETWEEN
niveau: 2
base: ladore
== question
Liste des factures (**NumFacture, NumClient**) établies en **octobre 2019**.
== solution
SELECT Facture.NumFacture, Facture.NumClient
FROM Facture
WHERE Facture.Date_Facture BETWEEN #01/10/2019# AND #31/10/2019#;
== explication
BETWEEN avec le premier et le dernier jour du mois, ou bien `MONTH(...) = 10 AND YEAR(...) = 2019`.
:::

::: cours LIKE et l’étoile *
ref: 96 | Chap. 4 · Application no 14 — III. G. | l’asté-

**LIKE** compare un texte à un **modèle**. Dans le modèle, l’**astérisque `*`** remplace **n’importe quelle suite de caractères** :

- `LIKE "Etui*"` : les libellés qui **commencent** par « Etui » ;
- `LIKE "*soprani*"` : les libellés qui **contiennent** « soprani ».

(En SQL standard, l’étoile s’écrit `%` ; l’appli accepte les deux.)
:::

::: sql si-c1-ch4-e16
ref: 96 | Chap. 4 · Application no 14 — III. G. | LIKE "Etui*"
niveau: 1
base: ladore
== question
Liste des **étuis** (**NumArticle, Libelle, PV_TTC**) : leur libellé **commence par « Etui »**.
== solution
SELECT Article.NumArticle, Article.Libelle, Article.PV_TTC
FROM Article
WHERE Article.Libelle LIKE "Etui*";
== explication
`LIKE "Etui*"` : « Etui » suivi de n’importe quoi.
:::

::: qcm si-c1-ch4-e17
ref: 97 | Chap. 4 · Application no 14 — III. H. | permet de sélectionner tous les libellés qui contiennent
niveau: 1
== question
Quel modèle sélectionne les libellés qui **contiennent** « Soprani » (n’importe où) ?
== choix
- [ ] LIKE "Soprani*"
- [ ] LIKE "*Soprani"
- [x] LIKE "*Soprani*"
- [ ] LIKE "Soprani"
== explication
Une étoile **de chaque côté** : n’importe quoi avant, « Soprani », n’importe quoi après.
:::

::: sql si-c1-ch4-e18
ref: 97 | Chap. 4 · Application no 14 — III. H. | LIKE "*soprani*"
niveau: 1
base: ladore
== question
Liste des articles (**NumArticle, Libelle, PV_TTC**) dont le libellé **comprend « Soprani »**.
== solution
SELECT Article.NumArticle, Article.Libelle, Article.PV_TTC
FROM Article
WHERE Article.Libelle LIKE "*soprani*";
== explication
LIKE ne fait pas la différence entre majuscules et minuscules ici : `"*soprani*"` trouve aussi « Soprani ».
:::

::: cours IS NULL : la case vide
ref: 107 | Chap. 4 · Exercice 2 Association réflexive — corrigé | WHERE NumAtelier IS NULL

Une case **vide** vaut **NULL**. On ne la teste pas avec `=` mais avec :

- **IS NULL** : la case est vide ;
- **IS NOT NULL** : la case est remplie.

Exemple du cours : un salarié administratif n’a pas d’atelier, sa clé étrangère NumAtelier est vide :

```sql
SELECT *
FROM Personnel
WHERE NumAtelier IS NULL;
```
:::

::: sql si-c1-ch4-e19
ref: 130 | Exercices autocorrigés · Exercice 3 — corrigé 5 | IS NULL
niveau: 2
base: basile
== question
BASILE : quelles propositions (**IdMission, NumCand**) n’ont **pas encore eu de réponse** (Reponse vide) ?
== solution
SELECT IdMission, NumCand
FROM PROPOSER
WHERE Reponse IS NULL;
== explication
Une réponse absente est une case vide : on teste **IS NULL** (et pas `= ""`).
:::
