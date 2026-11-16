---
id: si-c1-ch5-l3
title: Créer : CREATE TABLE, INDEX, VIEW
summary: Les commandes SQL qui créent la structure de la base.
---

::: cours CREATE TABLE
ref: 117 | Chap. 5 · II. B. 1. CREATE TABLE | La commande CREATE TABLE est utilisée pour créer

On donne le nom de la table, puis chaque colonne avec son **type**, et on précise la **clé primaire** avec **PRIMARY KEY** :

```sql
CREATE TABLE Employes
(
  EmployeID INT PRIMARY KEY,
  Nom VARCHAR(100),
  Email VARCHAR(100),
  DateEmbauche DATE
)
```
:::

::: ordre si-c1-ch5-e6
ref: 118 | Chap. 5 · II. B. 1. CREATE TABLE | La ou les propriétés de la clé primaire sont indiquées
niveau: 1
== question
Remets dans l’ordre la création de la table Employes.
== ordre
CREATE TABLE
Employes
(
EmployeID INT PRIMARY KEY,
Nom VARCHAR(100),
DateEmbauche DATE
)
== explication
CREATE TABLE nom ( colonne type, … ) avec PRIMARY KEY sur la clé primaire.
:::

::: cours CREATE INDEX et CREATE VIEW
ref: 118 | Chap. 5 · II. B. 2. CREATE INDEX | La commande CREATE INDEX est utilisée pour créer un index

- **CREATE INDEX** crée un index sur une ou plusieurs colonnes : les **recherches et tris** sur ces colonnes deviennent beaucoup plus rapides.
```sql
CREATE INDEX idx_nom
ON Employes (Nom)
```
- **CREATE VIEW** crée une **vue** : une **table virtuelle** basée sur le résultat d’une requête, utilisable ensuite comme une table.
```sql
CREATE VIEW VueEmployes2024
AS SELECT EmployeID, Nom, Email
FROM Employes
WHERE DateEmbauche >= '2024-01-01'
```
:::

::: sql si-c1-ch5-e7
ref: 119 | Chap. 5 · II. B. 3. CREATE VIEW | Cette vue peut être utilisée comme une table ordi
niveau: 2
base: employes
== question
Crée la vue **VueEmployes2024** (EmployeID, Nom, Email des employés embauchés à partir du 1er janvier 2024).
== solution
CREATE VIEW VueEmployes2024
AS SELECT EmployeID, Nom, Email
FROM Employes
WHERE DateEmbauche >= '2024-01-01';
== verification
SELECT * FROM VueEmployes2024 ORDER BY EmployeID;
== explication
CREATE VIEW nom AS SELECT … : la vue s’utilise ensuite comme une table ordinaire.
:::

::: qcm si-c1-ch5-e8
ref: 118 | Chap. 5 · II. B. 2. CREATE INDEX | ce qui améliore drastiquement la vitesse
niveau: 1
== question
À quoi sert un **index** ?
== choix
- [ ] À supprimer les doublons
- [x] À accélérer les recherches et les tris sur une colonne
- [ ] À sauvegarder la table
- [ ] À définir la clé étrangère
== explication
Un index améliore **drastiquement la vitesse des opérations de recherche et de tri** sur ces colonnes.
:::
