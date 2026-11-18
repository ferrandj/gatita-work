---
id: si-c1-ch4-l8
title: LEFT JOIN et RIGHT JOIN
summary: Garder toutes les lignes d’une table, même sans correspondance (et repérer les NULL).
---

::: cours LEFT JOIN : priorité à gauche
ref: 84 | Chap. 4 · II. A. 2. b. LEFT JOIN : la priorité à gauche | On récupère toute la table de gauche

**LEFT JOIN** récupère **toute la table de gauche** (celle du FROM), même les lignes **sans correspondance** dans la table de droite.

```sql
SELECT Nom, Prenom, NumDev
FROM ETUDIANT
LEFT JOIN PASSER
ON ETUDIANT.Code = PASSER.Code;
```

Les étudiants qui n’ont passé **aucun** devoir apparaissent quand même, avec **NULL** dans la colonne NumDev.
:::

::: sql si-c1-ch4-e31
ref: 84 | Chap. 4 · II. A. 2. b. LEFT JOIN | établir la liste des étudiants, qu’ils aient ou non passé les devoirs
niveau: 2
base: etudiants
== question
Liste des étudiants (**Nom, Prenom, NumDev**), **qu’ils aient ou non** passé les devoirs.
== solution
SELECT Nom, Prenom, NumDev
FROM ETUDIANT
LEFT JOIN PASSER
ON ETUDIANT.Code = PASSER.Code;
== explication
LEFT JOIN garde tous les étudiants ; ceux sans devoir ont NULL dans NumDev.
:::

::: cours Seulement ceux qui n’ont rien
ref: 85 | Chap. 4 · II. A. 2. b. LEFT JOIN | WHERE PASSER.code IS NULL

En ajoutant `WHERE … IS NULL` sur la table de droite, on garde **uniquement** les lignes de gauche **sans correspondance** :

```sql
SELECT Nom, Prenom
FROM ETUDIANT
LEFT JOIN PASSER
ON ETUDIANT.Code = PASSER.Code
WHERE PASSER.Code IS NULL;
```

→ les étudiants qui n’ont passé **aucun** devoir. (Le cours écrit `WHERE ETUDIANT` à la 2e ligne : c’est bien `FROM ETUDIANT`.)
:::

::: sql si-c1-ch4-e32
ref: 85 | Chap. 4 · II. A. 2. b. LEFT JOIN | WHERE PASSER.code IS NULL
niveau: 3
base: etudiants
== question
Avec LEFT JOIN : **Nom, Prenom** des étudiants qui n’ont passé **aucun** devoir.
== solution
SELECT Nom, Prenom
FROM ETUDIANT
LEFT JOIN PASSER
ON ETUDIANT.Code = PASSER.Code
WHERE PASSER.Code IS NULL;
== explication
LEFT JOIN garde tout ETUDIANT, puis `PASSER.Code IS NULL` ne garde que ceux sans correspondance.
:::

::: cours RIGHT JOIN : le miroir
ref: 85 | Chap. 4 · II. A. 2. c. RIGHT JOIN | A RIGHT JOIN B est l’image miroir de B LEFT JOIN A

**RIGHT JOIN** rend prioritaire la table **de droite**. `A RIGHT JOIN B` est l’**image miroir** de `B LEFT JOIN A`.

Pour transformer un RIGHT JOIN en LEFT JOIN :
1. **inverser l’ordre des tables** ;
2. **remplacer RIGHT par LEFT**.

Le cours conseille de n’utiliser **que INNER et LEFT** : plus **lisible** (la table principale d’abord), plus **standard**, et plus simple quand on **enchaîne** plusieurs jointures.
:::

::: qcm si-c1-ch4-e33
ref: 85 | Chap. 4 · II. A. 2. c. RIGHT JOIN | inverser l’ordre des tables
niveau: 2
== question
`FROM VENDEURS RIGHT JOIN SECTEURS ON …` donne le même résultat que…
== choix
- [ ] FROM VENDEURS LEFT JOIN SECTEURS ON …
- [x] FROM SECTEURS LEFT JOIN VENDEURS ON …
- [ ] FROM SECTEURS INNER JOIN VENDEURS ON …
- [ ] FROM SECTEURS RIGHT JOIN VENDEURS ON …
== explication
On inverse l’ordre des tables **et** on change RIGHT en LEFT.
:::

::: sql si-c1-ch4-e34
ref: 86 | Chap. 4 · II. A. 2. c. RIGHT JOIN | La table prioritaire SECTEURS apparaît ainsi plus clairement
niveau: 2
base: ventes
== question
Affiche **tous les secteurs** (**nom_zone**) avec le **nom** du vendeur correspondant, qu’il y ait ou non des vendeurs. Colonnes : **nom, nom_zone**. Utilise **LEFT JOIN**.
== solution
SELECT VENDEURS.nom, SECTEURS.nom_zone
FROM SECTEURS
LEFT JOIN VENDEURS ON SECTEURS.id_secteur = VENDEURS.secteur_id;
== explication
La table prioritaire SECTEURS est écrite en premier : LEFT JOIN garde tous les secteurs, même « Est » qui n’a aucun vendeur (nom = NULL).
:::
