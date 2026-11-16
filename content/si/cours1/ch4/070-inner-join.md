---
id: si-c1-ch4-l7
title: INNER JOIN (SQL 92)
summary: La nouvelle écriture des jointures, exigée à partir des examens 2027.
---

::: cours La réforme 2027
ref: 83 | Chap. 4 · II. A. 2. Version SQL 92 | La réforme du programme, qui prend effet à compter des examens de 2027

À partir des **examens 2027**, il faut savoir écrire les jointures avec des **mots-clés** : **INNER JOIN**, **LEFT JOIN** et **RIGHT JOIN**.

L’ancienne écriture reste comprise ; le cours montre les deux et les exercices vont progressivement vers la nouvelle.
:::

::: cours INNER JOIN … ON …
ref: 84 | Chap. 4 · II. A. 2. a. INNER JOIN | La syntaxe générale est la suivante

**INNER JOIN** est la jointure par défaut : elle renvoie les lignes qui ont une **correspondance dans les deux tables**.

```sql
SELECT …
FROM TABLEA
INNER JOIN TABLEB
ON TABLEA.Clé = TABLEB.Clé;
```

Comparaison sur l’exemple du cours (« quels étudiants ont passé les devoirs ? ») :

```sql
-- version antérieure
SELECT ETUDIANT.Code, Nom
FROM ETUDIANT, PASSER
WHERE ETUDIANT.Code = PASSER.Code;

-- version SQL 92
SELECT ETUDIANT.Code, Nom
FROM ETUDIANT
INNER JOIN PASSER
ON ETUDIANT.Code = PASSER.Code;
```

La condition de jointure quitte le WHERE et va dans le **ON**. Le WHERE ne garde que les vraies conditions.
:::

::: ordre si-c1-ch4-e28
ref: 84 | Chap. 4 · II. A. 2. a. INNER JOIN | INNER JOIN PASSER
niveau: 1
== question
Remets dans l’ordre la version SQL 92.
== ordre
SELECT
Nom
FROM
ETUDIANT
INNER JOIN
PASSER
ON
ETUDIANT.Code = PASSER.Code
;
== explication
FROM la première table, INNER JOIN la seconde, puis ON avec la condition de jointure.
:::

::: sql si-c1-ch4-e29
ref: 84 | Chap. 4 · II. A. 2. a. INNER JOIN | ON ETUDIANT.Code = PASSER.Code
niveau: 2
base: etudiants
== question
Avec **INNER JOIN** : affiche le **Nom** des étudiants et le **NumDev** de chaque devoir qu’ils ont passé.
== solution
SELECT Nom, NumDev
FROM ETUDIANT
INNER JOIN PASSER
ON ETUDIANT.Code = PASSER.Code;
== explication
INNER JOIN ne garde que les étudiants qui ont une correspondance dans PASSER (ceux qui ont passé un devoir).
:::

::: sql si-c1-ch4-e30
ref: 97 | Chap. 4 · Application no 14 — IV. B. | Liste des clients (Nom, prénom) ayant commandé au 1er semestre 2019
niveau: 2
base: ladore
== question
En **SQL 92** : clients (**Nom, Prenom**, sans doublon) ayant commandé au **1er semestre 2019** (du 01/01/2019 au 30/06/2019).
== solution
SELECT DISTINCT Client.Nom, Client.Prenom
FROM Client
INNER JOIN Facture ON Client.NumClient = Facture.NumClient
WHERE Facture.Date_Facture BETWEEN #01/01/2019# AND #30/06/2019#;
== explication
La jointure va dans le ON, la condition sur la date dans le WHERE. (Le corrigé du cours met la date dans le ON avec AND et laisse une virgule après CLIENT : le résultat d’un INNER JOIN est le même, mais la virgule est une coquille.)
:::
