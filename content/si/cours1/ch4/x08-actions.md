---
type: exercices
---

<!-- Banque : requêtes d’action DELETE, INSERT, UPDATE (cours p. 92-93, application 14 IX p. 104-105) -->

::: sql si-c1-ch4-b-act-01
ref: 92 | Chap. 4 · III. A. Requête suppression : DELETE | Cette instruction permet la suppression
niveau: 1
base: ladore
== question
Supprime l’article **P-006**.
== solution
DELETE FROM Article WHERE NumArticle = "P-006";
== verification
SELECT NumArticle FROM Article ORDER BY NumArticle;
== explication
DELETE FROM table WHERE condition : la condition cible la ligne par sa clé.
:::

::: sql si-c1-ch4-b-act-02
ref: 92 | Chap. 4 · III. A. Requête suppression : DELETE | Cette instruction permet la suppression
niveau: 1
base: ladore
== question
Supprime tous les articles de la marque **Arnold**.
== solution
DELETE FROM Article WHERE Marque = "Arnold";
== verification
SELECT NumArticle FROM Article ORDER BY NumArticle;
== explication
Une condition qui peut viser plusieurs lignes.
:::

::: sql si-c1-ch4-b-act-03
ref: 92 | Chap. 4 · III. A. Requête suppression : DELETE | Cette instruction permet la suppression
niveau: 1
base: ladore
== question
Supprime les factures établies **avant le 01/01/2019**.
== solution
DELETE FROM Facture WHERE Date_Facture < #01/01/2019#;
== verification
SELECT NumFacture FROM Facture ORDER BY NumFacture;
== explication
Condition sur une date.
:::

::: sql si-c1-ch4-b-act-04
ref: 93 | Chap. 4 · III. attention | ne figure qu’une seule table
niveau: 3
base: ladore
== question
Supprime les articles qui n’ont **jamais été vendus**.
== solution
DELETE FROM Article WHERE NumArticle NOT IN (SELECT NumArticle FROM LIGNE);
== verification
SELECT NumArticle FROM Article ORDER BY NumArticle;
== explication
On n’agit que sur une table : la condition sur LIGNE passe par une sous-requête.
:::

::: sql si-c1-ch4-b-act-05
ref: 93 | Chap. 4 · III. B. Requête ajout : INSERT | Insertion d’une seule ligne
niveau: 1
base: ladore
== question
Ajoute le client **9**, **Mme Blanc Julie**, 2 rue Neuve, **31000 Toulouse**, créé le **2025-01-15**.
== solution
INSERT INTO Client (NumClient, Titre, Nom, Prenom, Adresse, CP, Ville, Date_Creation)
VALUES (9, "Mme", "Blanc", "Julie", "2 rue Neuve", "31000", "Toulouse", #15/01/2025#);
== verification
SELECT * FROM Client ORDER BY NumClient;
== explication
Les valeurs dans le même ordre que les colonnes ; textes entre guillemets (le CP aussi), date entre dièses.
:::

::: sql si-c1-ch4-b-act-06
ref: 93 | Chap. 4 · III. B. Requête ajout : INSERT | Insertion d’une seule ligne
niveau: 1
base: ladore
== question
Ajoute la famille **PAR**, libellé **Partitions**.
== solution
INSERT INTO Famille (CodeFam, LibelleFam) VALUES ("PAR", "Partitions");
== verification
SELECT * FROM Famille ORDER BY CodeFam;
== explication
INSERT INTO table (colonnes) VALUES (valeurs).
:::

::: sql si-c1-ch4-b-act-07
ref: 93 | Chap. 4 · III. B. Requête ajout : INSERT | Insertion d’une seule ligne
niveau: 2
base: ladore
== question
Sur la facture **1011**, ajoute la ligne : article **E-011**, quantité **2**.
== solution
INSERT INTO LIGNE (NumFacture, NumArticle, Quantite) VALUES (1011, "E-011", 2);
== verification
SELECT * FROM LIGNE ORDER BY NumFacture, NumArticle;
== explication
Une ligne de facture = une ligne de la table LIGNE.
:::

::: sql si-c1-ch4-b-act-08
ref: 93 | Chap. 4 · III. C. Requête mise à jour : UPDATE | Cette instruction permet la mise à jour
niveau: 1
base: ladore
== question
Le client **5** déménage à **Lyon**, code postal **69001**. Mets à jour sa ville et son CP.
== solution
UPDATE Client SET Ville = "Lyon", CP = "69001" WHERE NumClient = 5;
== verification
SELECT NumClient, CP, Ville FROM Client ORDER BY NumClient;
== explication
On peut modifier plusieurs colonnes dans un même SET, séparées par des virgules.
:::

::: sql si-c1-ch4-b-act-09
ref: 93 | Chap. 4 · III. C. Requête mise à jour : UPDATE | Cette instruction permet la mise à jour
niveau: 2
base: ladore
== question
Augmente de **10 %** le prix de tous les articles de la famille **BAN**.
== solution
UPDATE Article SET PV_TTC = PV_TTC * 1.1 WHERE CodeFam = "BAN";
== verification
SELECT NumArticle, PV_TTC FROM Article ORDER BY NumArticle;
== explication
+10 % = × 1,1 (tape 1.1).
:::

::: sql si-c1-ch4-b-act-10
ref: 93 | Chap. 4 · III. C. Requête mise à jour : UPDATE | Cette instruction permet la mise à jour
niveau: 2
base: ladore
== question
Baisse de **5 €** le prix des articles de marque **Hohner** qui coûtent **moins de 100 €**.
== solution
UPDATE Article SET PV_TTC = PV_TTC - 5 WHERE Marque = "Hohner" AND PV_TTC < 100;
== verification
SELECT NumArticle, PV_TTC FROM Article ORDER BY NumArticle;
== explication
SET avec un calcul, WHERE avec deux conditions.
:::

::: sql si-c1-ch4-b-act-11
ref: 93 | Chap. 4 · III. attention | ne figure qu’une seule table
niveau: 3
base: ladore
== question
Augmente de **5 %** le prix des articles **jamais vendus**.
== solution
UPDATE Article SET PV_TTC = PV_TTC * 1.05 WHERE NumArticle NOT IN (SELECT NumArticle FROM LIGNE);
== verification
SELECT NumArticle, PV_TTC FROM Article ORDER BY NumArticle;
== explication
La condition porte sur une autre table : sous-requête obligatoire dans un UPDATE.
:::

::: sql si-c1-ch4-b-act-12
ref: 92 | Chap. 4 · III. A. Requête suppression : DELETE | Cette instruction permet la suppression
niveau: 1
base: basile
== question
BASILE : supprime toutes les propositions refusées (Reponse = **"N"**).
== solution
DELETE FROM PROPOSER WHERE Reponse = "N";
== verification
SELECT IdMission, NumCand FROM PROPOSER ORDER BY IdMission, NumCand;
== explication
DELETE avec une condition simple.
:::

::: sql si-c1-ch4-b-act-13
ref: 93 | Chap. 4 · III. B. Requête ajout : INSERT | Insertion d’une seule ligne
niveau: 2
base: basile
== question
BASILE : le candidat **56730** ajoute le domaine **6** (Garde-enfants) à ses préférences.
== solution
INSERT INTO PREFERER (NumCand, NumDom) VALUES (56730, 6);
== verification
SELECT * FROM PREFERER ORDER BY NumCand, NumDom;
== explication
Une préférence = une ligne de la table de lien PREFERER.
:::

::: sql si-c1-ch4-b-act-14
ref: 93 | Chap. 4 · III. C. Requête mise à jour : UPDATE | Cette instruction permet la mise à jour
niveau: 2
base: basile
== question
BASILE : le candidat **56728** refuse (« **N** ») la proposition de mission **1244**.
== solution
UPDATE PROPOSER SET Reponse = "N" WHERE IdMission = 1244 AND NumCand = 56728;
== verification
SELECT IdMission, NumCand, Reponse FROM PROPOSER ORDER BY IdMission, NumCand;
== explication
La proposition est identifiée par ses deux clés (IdMission et NumCand).
:::

::: sql si-c1-ch4-b-act-15
ref: 93 | Chap. 4 · III. C. Requête mise à jour : UPDATE | Cette instruction permet la mise à jour
niveau: 2
base: basile
== question
BASILE : augmente de **0,50 €** le tarif horaire de toutes les missions du recruteur **1444**.
== solution
UPDATE MISSION SET tarifHoraire = tarifHoraire + 0.5 WHERE CodeRec = 1444;
== verification
SELECT IdMission, tarifHoraire FROM MISSION ORDER BY IdMission;
== explication
0,50 s’écrit 0.5.
:::

::: sql si-c1-ch4-b-act-16
ref: 93 | Chap. 4 · III. B. 2. Insertion à l’aide de sous-requêtes | Ajout à une table d’une série d’enregistrements
niveau: 3
base: employes
== question
Crée la table **Anciens** (EmployeID INT PRIMARY KEY, Nom VARCHAR(100)), puis copie-y les employés embauchés **avant 2021**.
== solution
CREATE TABLE Anciens (EmployeID INT PRIMARY KEY, Nom VARCHAR(100));
INSERT INTO Anciens (EmployeID, Nom)
SELECT EmployeID, Nom FROM Employes WHERE DateEmbauche < #01/01/2021#;
== verification
SELECT * FROM Anciens ORDER BY EmployeID;
== explication
INSERT INTO … suivi d’un SELECT : ajout d’une série d’enregistrements provenant d’une autre table.
:::

::: sql si-c1-ch4-b-act-17
ref: 92 | Chap. 4 · III. A. Requête suppression : DELETE | Cette instruction permet la suppression
niveau: 1
base: employes
== question
Supprime l’employé numéro **3**.
== solution
DELETE FROM Employes WHERE EmployeID = 3;
== verification
SELECT EmployeID FROM Employes ORDER BY EmployeID;
== explication
Ciblage par la clé primaire.
:::

::: qcm si-c1-ch4-b-act-18
ref: 92 | Chap. 4 · III. A. Requête suppression : DELETE | Cette instruction permet la suppression
niveau: 1
== question
Que fait `DELETE FROM Client;` (sans WHERE) ?
== choix
- [ ] Rien
- [ ] Supprime la table Client
- [x] Supprime toutes les lignes de Client
- [ ] Supprime la première ligne
== explication
Sans condition, toutes les lignes sont supprimées (la table reste).
:::

::: qcm si-c1-ch4-b-act-19
ref: 93 | Chap. 4 · III. attention | ne figure qu’une seule table
niveau: 2
== question
Combien de tables peut-on citer **après** UPDATE (ou DELETE FROM, INSERT INTO) ?
== choix
- [x] Une seule
- [ ] Deux
- [ ] Autant qu’on veut
- [ ] Aucune
== explication
On ne peut agir que sur une table à la fois ; une autre table ne peut apparaître que dans une sous-requête.
:::

::: qcm si-c1-ch4-b-act-20
ref: 105 | Chap. 4 · Application no 14 — IX. C. 1. | augmenter de 5 % le prix TTC des articles
niveau: 1
== question
Pour **baisser** un prix de **20 %**, on écrit…
== choix
- [ ] `SET PV_TTC = PV_TTC - 20`
- [ ] `SET PV_TTC = PV_TTC * 1.2`
- [x] `SET PV_TTC = PV_TTC * 0.8`
- [ ] `SET PV_TTC = 20 %`
== explication
−20 % = × (1 − 20/100) = × 0,8. `- 20` retirerait 20 €.
:::

::: qcm si-c1-ch4-b-act-21
ref: 105 | Chap. 4 · Application no 14 — IX. B. 2. | Il faut décomposer en deux requêtes successives
niveau: 2
== question
Pour **archiver puis supprimer** des factures, dans quel ordre exécuter les requêtes ?
== choix
- [x] D’abord INSERT INTO … SELECT (archiver), puis DELETE
- [ ] D’abord DELETE, puis INSERT
- [ ] Une seule requête UPDATE suffit
- [ ] L’ordre n’a pas d’importance
== explication
On archive d’abord ; si on supprimait d’abord, il n’y aurait plus rien à copier.
:::

::: ordre si-c1-ch4-b-act-22
ref: 93 | Chap. 4 · III. C. Requête mise à jour : UPDATE | Cette instruction permet la mise à jour
niveau: 1
== question
Remets dans l’ordre : augmenter de 2 % les articles à plus de 7 €.
== ordre
UPDATE
Article
SET
PV_TTC = PV_TTC * 1.02
WHERE
PV_TTC > 7
;
== explication
UPDATE table SET colonne = expression WHERE condition.
:::

::: ordre si-c1-ch4-b-act-23
ref: 93 | Chap. 4 · III. B. Requête ajout : INSERT | Insertion d’une seule ligne
niveau: 1
== question
Remets dans l’ordre : ajouter une famille.
== ordre
INSERT INTO
Famille
(CodeFam, LibelleFam)
VALUES
("PAR", "Partitions")
;
== explication
INSERT INTO table (colonnes) VALUES (valeurs).
:::

::: trous si-c1-ch4-b-act-24
ref: 92 | Chap. 4 · III. A. Requête suppression : DELETE | Cette instruction permet la suppression
niveau: 1
== question
Complète : supprimer les clients de Bordeaux.
== texte
{0} {1} Client {2} Ville = "Bordeaux";
== reponses
DELETE
FROM
WHERE
== intrus
SELECT
SET
== explication
DELETE FROM table WHERE condition.
:::
