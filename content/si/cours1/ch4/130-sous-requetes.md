---
id: si-c1-ch4-l13
title: Les sous-requêtes (IN, NOT IN)
summary: Une requête dans une requête : indispensable pour trouver « ceux qui n’ont PAS… ».
---

::: cours Une requête dans le WHERE
ref: 89 | Chap. 4 · II. F. Les requêtes imbriquées ou sous-requêtes | Une requête imbriquée consiste à inclure une requête dans une autre requête

Une **sous-requête** (ou requête imbriquée) est une requête placée **dans le WHERE** d’une autre, comme valeur d’une condition.

```sql
SELECT attribut1, attribut2
FROM table
WHERE attribut IN (SELECT attribut FROM … WHERE …);
```

- **IN** : la valeur est **dans** la liste renvoyée ;
- **NOT IN** : elle n’y est **pas** ;
- ou un opérateur (=, <, >…) si la sous-requête renvoie une seule valeur.

> La sous-requête ne doit renvoyer **qu’un seul champ** (une seule colonne).
:::

::: cours Trouver une absence
ref: 90 | Chap. 4 · II. F. Les requêtes imbriquées | Pour résoudre la question posée, seule une requête imbriquée est pertinente

« Quels étudiants n’ont **pas** rendu de devoir depuis le 01/01/2025 ? »

Piège : `WHERE Date < #01/01/2025#` donne ceux qui ont rendu un devoir **avant**, ce qui ne dit rien sur **après** !

La bonne méthode, en deux temps :
1. une sous-requête liste ceux qui **ont** rendu un devoir depuis le 01/01/2025 (l’inverse de ce qu’on veut) ;
2. la requête principale garde ceux qui **ne sont pas** dans cette liste (**NOT IN**).

```sql
SELECT Nom, Prenom
FROM ETUDIANT
WHERE Code NOT IN (SELECT PASSER.Code
                   FROM PASSER, DEVOIR
                   WHERE PASSER.NumDev = DEVOIR.NumDev
                   AND DEVOIR.Date > #01/01/2025#);
```

(Dans le cours, la condition de date est écrite après la parenthèse : elle doit être **dans** la sous-requête, comme ici.)
:::

::: qcm si-c1-ch4-e51
ref: 89 | Chap. 4 · II. F. Version 2 (fausse) | ce qui ne conditionne en rien le fait qu’ils aient rendu un devoir après
niveau: 2
== question
Pourquoi `WHERE Date < #01/01/2025#` ne donne-t-il **pas** les étudiants qui n’ont rien rendu depuis le 01/01/2025 ?
== choix
- [ ] Parce que la date est mal écrite
- [x] Parce qu’un étudiant qui a rendu un devoir avant peut aussi en avoir rendu un après
- [ ] Parce qu’il faudrait > au lieu de <
- [ ] Parce qu’il manque DISTINCT
== explication
Avoir rendu un devoir avant le 01/01/2025 **ne conditionne en rien** le fait d’en avoir rendu un après. Il faut une sous-requête avec NOT IN.
:::

::: sql si-c1-ch4-e52
ref: 90 | Chap. 4 · II. F. Les requêtes imbriquées | WHERE Code NOT IN
niveau: 3
base: etudiants
== question
**Nom, Prenom** des étudiants qui **n’ont pas** rendu de devoir **depuis le 01/01/2025**.
== solution
SELECT Nom, Prenom
FROM ETUDIANT
WHERE Code NOT IN (SELECT PASSER.Code
  FROM PASSER, DEVOIR
  WHERE PASSER.NumDev = DEVOIR.NumDev
  AND DEVOIR.Date > #01/01/2025#);
== indice
Sous-requête : les codes des étudiants qui ONT rendu un devoir depuis le 01/01/2025. Puis NOT IN.
== explication
La sous-requête renvoie les codes de ceux qui ont rendu un devoir depuis le 01/01/2025 ; NOT IN garde les autres.
:::

::: sql si-c1-ch4-e53
ref: 90 | Chap. 4 · Application no 13 — Bibliothèque JaimeLire | Ici, le IN est obligatoire
niveau: 2
base: jaimelire
== question
JaimeLire : **prénom et nom** (PrenAdh, NomAdh) des adhérents qui sont **parents** (leur numéro apparaît comme NumAdhParent).
== solution
SELECT PrenAdh, NomAdh
FROM ADHERENT
WHERE NumAdh IN (SELECT DISTINCT NumAdhParent
  FROM ADHERENT);
== explication
La sous-requête renvoie les NumAdhParent sans doublon. La requête principale garde les adhérents dont le NumAdh est **dans** cette liste. **IN** est obligatoire car la sous-requête peut renvoyer plusieurs valeurs.
:::

::: sql si-c1-ch4-e54
ref: 103 | Chap. 4 · Application no 14 — VIII. A. | Liste des articles (NumArticle, Libelle, PV_TTC) non vendus en 2019
niveau: 3
base: ladore
== question
Liste des articles (**NumArticle, Libelle, PV_TTC**) **non vendus en 2019**.
== solution
SELECT Article.NumArticle, Article.Libelle, Article.PV_TTC
FROM Article
WHERE Article.NumArticle NOT IN (SELECT LIGNE.NumArticle
  FROM LIGNE, Facture
  WHERE LIGNE.NumFacture = Facture.NumFacture
  AND YEAR(Date_Facture) = 2019);
== explication
On enlève de l’ensemble des articles ceux qui sont dans la sous-requête (les articles facturés en 2019).
:::

::: cours Comparer à un MAX ou un MIN
ref: 104 | Chap. 4 · Application no 14 — VIII. C. | Il faut ici comparer le prix de tous les articles avec le prix le plus grand

Quand la sous-requête renvoie **une seule valeur** (un MAX, un MIN…), on compare avec **=** :

```sql
SELECT NumArticle, Libelle, PV_TTC
FROM Article
WHERE PV_TTC = (SELECT MAX(PV_TTC) FROM Article);
```

→ les articles les plus chers (il peut y en avoir **plusieurs** au même prix maximal).
:::

::: sql si-c1-ch4-e55
ref: 104 | Chap. 4 · Application no 14 — VIII. D. | Liste des articles (NumArticle, Libelle et PV_TTC) les moins chers
niveau: 2
base: ladore
== question
Liste des articles (**NumArticle, Libelle, PV_TTC**) **les moins chers**.
== solution
SELECT NumArticle, Libelle, PV_TTC
FROM Article
WHERE PV_TTC = (SELECT MIN(PV_TTC)
  FROM Article);
== explication
On compare le prix de chaque article au plus petit prix (résultat de la sous-requête).
:::

::: qcm si-c1-ch4-e56
ref: 90 | Chap. 4 · II. F. attention | Le résultat de la requête imbriquée ne doit comporter qu’un seul champ
niveau: 1
== question
Combien de **colonnes** une sous-requête utilisée avec IN doit-elle renvoyer ?
== choix
- [x] Une seule
- [ ] Deux
- [ ] Autant que la requête principale
- [ ] Peu importe
== explication
Le résultat de la requête imbriquée **ne doit comporter qu’un seul champ**.
:::
