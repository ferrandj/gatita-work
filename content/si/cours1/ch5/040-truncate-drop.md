---
id: si-c1-ch5-l4
title: Vider, supprimer, sauvegarder une table
summary: TRUNCATE TABLE, DROP TABLE et INSERT … SELECT.
---

::: cours TRUNCATE ou DROP ?
ref: 119 | Chap. 5 · II. B. 4. TRUNCATE TABLE | La commande TRUNCATE TABLE est utilisée pour supprimer toutes les lignes

- **TRUNCATE TABLE Employes** : supprime **toutes les lignes** mais **garde la table** (sa structure peut recevoir de nouvelles données). Plus rapide que de supprimer les lignes une par une.
- **DROP TABLE Employes** : supprime **la table elle-même**, définitivement, avec ses colonnes et ses données.
:::

::: qcm si-c1-ch5-e9
ref: 119 | Chap. 5 · II. B. 4. TRUNCATE TABLE | mais préserve la structure
niveau: 1
== question
On veut **vider** la table Employes mais **garder sa structure**. Quelle commande ?
== choix
- [ ] DROP TABLE Employes
- [x] TRUNCATE TABLE Employes
- [ ] DELETE TABLE Employes
- [ ] CREATE TABLE Employes
== explication
TRUNCATE supprime toutes les données **mais préserve la structure** ; DROP supprime la table entière.
:::

::: cours Sauvegarder avec INSERT … SELECT
ref: 120 | Chap. 5 · II. B. 6. Combinaison INSERT et SELECT | Sauvegarde des données avec un INSERT combiné avec un SELECT

Pour copier une table dans une autre (copie de sécurité, archive) : un **INSERT** suivi immédiatement d’un **SELECT** (les structures doivent être compatibles).

```sql
INSERT INTO EmployesSauvegarde(EmployeID, Nom, Email, DateEmbauche)
SELECT EmployeID, Nom, Email, DateEmbauche FROM Employes;
```

Un **WHERE** dans le SELECT limite les lignes recopiées. La restauration est la commande « miroir ».
:::

::: sql si-c1-ch5-e10
ref: 120 | Chap. 5 · II. B. 6. Combinaison INSERT et SELECT | seuls les employés embauchés à partir du 1er juin 2020
niveau: 3
base: employes
== question
Crée la table **EmployesSauvegarde** (même structure que Employes), puis copie-y les employés embauchés **à partir du 1er juin 2020**.
== solution
CREATE TABLE EmployesSauvegarde (EmployeID INT PRIMARY KEY, Nom VARCHAR(100), Email VARCHAR(100), DateEmbauche DATE);
INSERT INTO EmployesSauvegarde(EmployeID, Nom, Email, DateEmbauche)
SELECT EmployeID, Nom, Email, DateEmbauche
FROM Employes
WHERE DateEmbauche >= '2020-06-01';
== verification
SELECT * FROM EmployesSauvegarde ORDER BY EmployeID;
== indice
Deux requêtes séparées par ; : CREATE TABLE … puis INSERT INTO … SELECT … WHERE …
== explication
D’abord la table de sauvegarde (CREATE TABLE), puis l’INSERT combiné à un SELECT avec un WHERE pour limiter les lignes.
:::

::: trous si-c1-ch5-e11
ref: 119 | Chap. 5 · II. B. 5. DROP TABLE | La commande DROP TABLE est utilisée pour supprimer une table
niveau: 1
== question
Complète.
== texte
{0} TABLE supprime la table et toutes ses données ; {1} TABLE vide la table mais la garde ; CREATE {2} crée une table virtuelle.
== reponses
DROP
TRUNCATE
VIEW
== intrus
INDEX
DELETE
== explication
DROP = suppression définitive de la table ; TRUNCATE = on vide les lignes ; VIEW = table virtuelle.
:::
