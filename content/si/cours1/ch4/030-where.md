---
id: si-c1-ch4-l3
title: WHERE : filtrer les lignes
summary: Comparer (=, <, >, <>…), combiner avec AND / OR, écrire du texte entre guillemets.
---

::: cours WHERE garde certaines lignes
ref: 80 | Chap. 4 · I. C. Le WHERE | La clause WHERE exprime la restriction

**WHERE** fait une **restriction** : il ne garde que les lignes qui remplissent la condition. Il se place **après le FROM**.

```sql
SELECT attribut1, attribut2
FROM table
WHERE condition de sélection;
```

SELECT réduit les **colonnes**, WHERE réduit les **lignes**.
:::

::: cours Les opérateurs de comparaison
ref: 81 | Chap. 4 · I. C. Le WHERE — règles d’écriture | opérateurs de comparaison

| Opérateur | Sens |
|---|---|
| = | égal |
| < | inférieur |
| > | supérieur |
| <= | inférieur ou égal |
| >= | supérieur ou égal |
| <> | différent |

Un **texte** se met entre guillemets (`"Paris"`), un **nombre** s’écrit tel quel (`1000`).
:::

::: sql si-c1-ch4-e9
ref: 96 | Chap. 4 · Application no 14 — III. D. | WHERE Article.PV_TTC>1000
niveau: 1
base: ladore
== question
Liste des produits (**NumArticle, Libelle, PV_TTC**) dont le prix de vente TTC est **supérieur à 1 000 €**.
== solution
SELECT Article.NumArticle, Article.Libelle, Article.PV_TTC
FROM Article
WHERE Article.PV_TTC > 1000;
== explication
Le prix est un nombre : on l’écrit sans guillemets, et sans espace ni symbole € (`1000`).
:::

::: sql si-c1-ch4-e10
ref: 95 | Chap. 4 · Application no 14 — III. A. | Un code postal est un champ alphanumérique
niveau: 1
base: ladore
== question
Liste des clients (**Nom, Prenom**) habitant le Xe arrondissement de Paris (**CP = 75010**).
== solution
SELECT Client.Nom, Client.Prenom
FROM Client
WHERE Client.CP = "75010";
== indice
Un code postal est un texte : entre guillemets.
== explication
Le cours rappelle qu’**un code postal est un champ alphanumérique** (du texte) : on écrit `"75010"` entre guillemets. Le corrigé utilise `LIKE "75010"`, qui donne ici le même résultat que `=`.
:::

::: cours AND et OR
ref: 95 | Chap. 4 · Application no 14 — III. C. | le OR est donc impératif

On combine plusieurs conditions avec les opérateurs logiques :

- **AND** (et) : **toutes** les conditions doivent être vraies ;
- **OR** (ou) : **au moins une** doit être vraie ;
- **NOT** (pas) : inverse une condition.

Piège classique du cours : « les clients habitant Paris **ou** Lyon ». Un client ne peut pas habiter Paris **et** Lyon en même temps, donc `AND` ne renverrait **rien** : **le OR est impératif**.

```sql
WHERE Client.Ville = "Paris"
OR Client.Ville = "Lyon";
```
:::

::: qcm si-c1-ch4-e11
ref: 95 | Chap. 4 · Application no 14 — III. C. | Un client ne peut pas habiter en même temps Lyon et Paris
niveau: 1
== question
On veut les clients qui habitent **Paris ou Lyon**. Que renvoie `WHERE Ville = "Paris" AND Ville = "Lyon"` ?
== choix
- [ ] Les clients de Paris et ceux de Lyon
- [x] Aucune ligne
- [ ] Uniquement les clients de Paris
- [ ] Une erreur
== explication
AND exige que les deux conditions soient vraies **sur la même ligne** : impossible d’habiter les deux villes. Il faut **OR**.
:::

::: sql si-c1-ch4-e12
ref: 95 | Chap. 4 · Application no 14 — III. C. | Liste des clients (Nom, Prenom) habitant Paris ou Lyon
niveau: 1
base: ladore
== question
Liste des clients (**Nom, Prenom, Ville**) habitant **Paris ou Lyon**.
== solution
SELECT Client.Nom, Client.Prenom, Client.Ville
FROM Client
WHERE Client.Ville = "Paris"
OR Client.Ville = "Lyon";
== explication
Deux conditions dont une seule doit être vraie : **OR**.
:::

::: sql si-c1-ch4-e13
ref: 80 | Chap. 4 · I. B. Le FROM | liées par l’opérateur AND pour indiquer que toutes les conditions
niveau: 2
base: ladore
== question
Articles (**NumArticle, Libelle, PV_TTC**) de la marque **Hohner** qui coûtent **moins de 1 500 €**.
== solution
SELECT NumArticle, Libelle, PV_TTC
FROM Article
WHERE Marque = "Hohner"
AND PV_TTC < 1500;
== explication
Les deux conditions doivent être vraies en même temps : **AND**.
:::
