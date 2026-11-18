---
id: si-c1-ch4-l6b
title: Les alias de table
summary: Donner un petit nom à une table pour écrire les jointures plus vite.
---

::: cours Un petit nom pour une table
ref: 79 | Chap. 4 · I. B. Le FROM | Le nom d’une table peut toujours être remplacé par un alias

Le nom d’une table peut **toujours** être remplacé par un **alias**, écrit juste après elle dans le FROM. Cela fait **gagner du temps** quand il y a des jointures :

```sql
SELECT A.Libelle, LF.Quantite
FROM Article A, LIGNE LF
WHERE A.NumArticle = LF.NumArticle;
```

Ici `A` remplace `Article` et `LF` remplace `LIGNE` partout dans la requête.
:::

::: cours Quand c’est utile
ref: 98 | Chap. 4 · Application no 14 — IV. C. | Ici, il serait judicieux d’utiliser des alias pour les tables

Le cours le conseille dès que les noms de tables sont longs ou reviennent souvent : « il serait judicieux d’utiliser des alias pour les tables pour faciliter l’écriture et la lecture de la requête ».

Il ne faut pas confondre :

- l’alias de **colonne** : `PV_TTC / 1.2 AS PV_HT` (dans le SELECT, avec AS) ;
- l’alias de **table** : `FROM Article A` (dans le FROM).
:::

::: qcm si-c1-ch4-l6b-e1
ref: 79 | Chap. 4 · I. B. Le FROM | Le nom d’une table peut toujours être remplacé par un alias
niveau: 1
== question
Dans `FROM Client C, Facture F`, que représente `F` ?
== choix
- [ ] Une colonne de Client
- [x] Un alias (petit nom) de la table Facture
- [ ] Une valeur
- [ ] Une erreur
== explication
L’alias de table s’écrit juste après le nom de la table dans le FROM.
:::

::: sql si-c1-ch4-l6b-e2
ref: 98 | Chap. 4 · Application no 14 — IV. C. | Ici, il serait judicieux d’utiliser des alias pour les tables
niveau: 2
base: ladore
== question
Avec les alias **A** (Article) et **LF** (LIGNE) : affiche **NumFacture, NumArticle, Libelle, Quantite, PV_TTC** de chaque ligne de facture.
== solution
SELECT LF.NumFacture, LF.NumArticle, A.Libelle, LF.Quantite, A.PV_TTC
FROM Article A, LIGNE LF
WHERE A.NumArticle = LF.NumArticle;
== explication
Les alias raccourcissent l’écriture : `A.Libelle` au lieu de `Article.Libelle`.
:::

::: sql si-c1-ch4-l6b-e3
ref: 79 | Chap. 4 · I. B. Le FROM | Le nom d’une table peut toujours être remplacé par un alias
niveau: 2
base: ladore
== question
Avec les alias **C** et **F** : **Nom** du client et **NumFacture, Date_Facture** de chacune de ses factures.
== solution
SELECT C.Nom, F.NumFacture, F.Date_Facture
FROM Client C, Facture F
WHERE C.NumClient = F.NumClient;
== explication
`C` = Client, `F` = Facture ; la jointure s’écrit `C.NumClient = F.NumClient`.
:::

::: qcm si-c1-ch4-l6b-e4
ref: 79 | Chap. 4 · I. A. Le SELECT | L’instruction AS permet d’attribuer un nouveau nom
niveau: 2
== question
Dans `SELECT SUM(A.PV_TTC * LF.Quantite) AS CA_TTC FROM Article A, LIGNE LF …`, lesquels sont des alias de **table** ? (plusieurs réponses)
== choix
- [x] A
- [x] LF
- [ ] CA_TTC
- [ ] PV_TTC
== explication
A et LF sont des alias de tables (dans le FROM). CA_TTC est un alias de **colonne** (après AS).
:::
