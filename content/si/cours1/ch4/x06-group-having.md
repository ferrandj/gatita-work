---
type: exercices
---

<!-- Banque : GROUP BY et HAVING (cours p. 87-88, application 14 VII. B et C p. 101-103) -->

::: sql si-c1-ch4-b-grp-01
ref: 88 | Chap. 4 · II. D. Le regroupement — règles d’écriture | Toutes les colonnes projetées
niveau: 1
base: ladore
== question
Nombre de clients **par ville** (**Ville** et le nombre).
== solution
SELECT Ville, COUNT(*) AS Nb FROM Client GROUP BY Ville;
== explication
Ville est projetée à côté de COUNT : elle va dans le GROUP BY.
:::

::: sql si-c1-ch4-b-grp-02
ref: 88 | Chap. 4 · II. D. Le regroupement — règles d’écriture | Toutes les colonnes projetées
niveau: 1
base: ladore
== question
Nombre d’articles **par marque** (**Marque** et le nombre).
== solution
SELECT Marque, COUNT(*) FROM Article GROUP BY Marque;
== explication
Un résultat par marque.
:::

::: sql si-c1-ch4-b-grp-03
ref: 88 | Chap. 4 · II. D. Le regroupement — règles d’écriture | Toutes les colonnes projetées
niveau: 2
base: ladore
== question
**Prix moyen** des articles **par famille** (**CodeFam** et la moyenne).
== solution
SELECT CodeFam, AVG(PV_TTC) AS Prix_moyen FROM Article GROUP BY CodeFam;
== explication
« Par famille » → GROUP BY CodeFam.
:::

::: sql si-c1-ch4-b-grp-04
ref: 101 | Chap. 4 · Application no 14 — VII. B. Remarque | On peut repérer la nécessité de cette clause
niveau: 2
base: ladore
== question
**Quantité totale vendue** par article (**NumArticle** et la somme des quantités).
== solution
SELECT NumArticle, SUM(Quantite) AS Total FROM LIGNE GROUP BY NumArticle;
== explication
Un agrégat (SUM) **par** type d’enregistrement (article) → GROUP BY.
:::

::: sql si-c1-ch4-b-grp-05
ref: 102 | Chap. 4 · Application no 14 — VII. B. 2. | Quel est le montant total par facture
niveau: 2
base: ladore
== question
**Nombre de lignes** (articles différents) par facture : **NumFacture** et le nombre.
== solution
SELECT NumFacture, COUNT(*) AS Nb_lignes FROM LIGNE GROUP BY NumFacture;
== explication
COUNT(*) par NumFacture.
:::

::: sql si-c1-ch4-b-grp-06
ref: 101 | Chap. 4 · Application no 14 — VII. B. 1. | Quel est le nombre de factures par client
niveau: 2
base: ladore
== question
**Nom** de chaque client et **nombre de ses factures** (seulement les clients qui en ont).
== solution
SELECT Client.NumClient, Client.Nom, COUNT(*) AS Nb
FROM Client, Facture
WHERE Client.NumClient = Facture.NumClient
GROUP BY Client.NumClient, Client.Nom;
== explication
Toutes les colonnes projetées à côté du COUNT (NumClient, Nom) sont dans le GROUP BY. (Ici l’appli demande aussi NumClient, pour distinguer deux clients homonymes.)
:::

::: sql si-c1-ch4-b-grp-07
ref: 102 | Chap. 4 · Application no 14 — VII. B. 2. | Quel est le montant total par facture
niveau: 3
base: ladore
== question
**Chiffre d’affaires TTC par client** : **NumClient, Nom** et le total (PV_TTC × Quantite).
== solution
SELECT Client.NumClient, Client.Nom, SUM(Article.PV_TTC * LIGNE.Quantite) AS CA
FROM Client, Facture, LIGNE, Article
WHERE Client.NumClient = Facture.NumClient
AND Facture.NumFacture = LIGNE.NumFacture
AND LIGNE.NumArticle = Article.NumArticle
GROUP BY Client.NumClient, Client.Nom;
== explication
4 tables → 3 jointures, puis SUM du calcul, regroupé par client.
:::

::: sql si-c1-ch4-b-grp-08
ref: 88 | Chap. 4 · II. D. Le regroupement — règles d’écriture | Toutes les colonnes projetées
niveau: 2
base: ladore
== question
Nombre de factures **par année** : **YEAR(Date_Facture)** et le nombre.
== solution
SELECT YEAR(Date_Facture), COUNT(*) FROM Facture GROUP BY YEAR(Date_Facture);
== explication
On peut regrouper sur un calcul : il faut alors le répéter dans le GROUP BY.
:::

::: sql si-c1-ch4-b-grp-09
ref: 88 | Chap. 4 · II. D. Le regroupement | Il faut pour cela utiliser l’instruction HAVING
niveau: 2
base: ladore
== question
Villes (**Ville** et nombre de clients) qui comptent **au moins 2 clients**.
== solution
SELECT Ville, COUNT(*) FROM Client GROUP BY Ville HAVING COUNT(*) >= 2;
== explication
La condition porte sur un résultat de COUNT : HAVING, juste après le GROUP BY.
:::

::: sql si-c1-ch4-b-grp-10
ref: 88 | Chap. 4 · II. D. Le regroupement | Le HAVING concerne la fonction
niveau: 2
base: ladore
== question
Marques (**Marque**, prix moyen) dont le **prix moyen** dépasse **1 000 €**.
== solution
SELECT Marque, AVG(PV_TTC) FROM Article GROUP BY Marque HAVING AVG(PV_TTC) > 1000;
== explication
Condition sur une fonction (AVG) → HAVING.
:::

::: sql si-c1-ch4-b-grp-11
ref: 102 | Chap. 4 · Application no 14 — VII. C. 1. | Il est possible d’utiliser l’alias du champ calculé
niveau: 2
base: ladore
== question
Articles (**NumArticle**, quantité totale) vendus en **plus de 2 exemplaires** au total. Utilise l’alias **Total** dans le HAVING.
== solution
SELECT NumArticle, SUM(Quantite) AS Total FROM LIGNE GROUP BY NumArticle HAVING Total > 2;
== explication
Le cours montre qu’on peut reprendre l’alias du champ calculé dans le HAVING.
:::

::: sql si-c1-ch4-b-grp-12
ref: 102 | Chap. 4 · Application no 14 — VII. C. 2. | ayant acheté plusieurs fois
niveau: 3
base: ladore
== question
Clients (**NumClient, Nom**, nombre de factures) ayant **plusieurs factures** (toutes années).
== solution
SELECT Client.NumClient, Client.Nom, COUNT(*)
FROM Client, Facture
WHERE Client.NumClient = Facture.NumClient
GROUP BY Client.NumClient, Client.Nom
HAVING COUNT(*) > 1;
== explication
« Plusieurs » = le numéro figure plusieurs fois dans FACTURE : COUNT(*) > 1 dans HAVING.
:::

::: sql si-c1-ch4-b-grp-13
ref: 88 | Chap. 4 · II. D. Le regroupement | Il faut pour cela utiliser l’instruction HAVING
niveau: 3
base: ladore
== question
Factures (**NumFacture**, total TTC) de **2019** dont le total TTC est **inférieur à 1 000 €**.
== solution
SELECT Facture.NumFacture, SUM(Article.PV_TTC * LIGNE.Quantite) AS Total
FROM Facture, LIGNE, Article
WHERE Facture.NumFacture = LIGNE.NumFacture
AND LIGNE.NumArticle = Article.NumArticle
AND YEAR(Facture.Date_Facture) = 2019
GROUP BY Facture.NumFacture
HAVING SUM(Article.PV_TTC * LIGNE.Quantite) < 1000;
== explication
L’année (condition sur les lignes) va dans WHERE ; le total (condition sur une fonction) dans HAVING.
:::

::: sql si-c1-ch4-b-grp-14
ref: 88 | Chap. 4 · II. D. Le regroupement — règles d’écriture | Toutes les colonnes projetées
niveau: 2
base: etudiants
== question
**Moyenne par devoir** : **NumDev** et la moyenne des notes.
== solution
SELECT NumDev, AVG(Note) FROM PASSER GROUP BY NumDev;
== explication
« Par devoir » → GROUP BY NumDev.
:::

::: sql si-c1-ch4-b-grp-15
ref: 88 | Chap. 4 · II. D. Le regroupement — règles d’écriture | Toutes les colonnes projetées
niveau: 2
base: etudiants
== question
**Moyenne par étudiant** : **Nom** et moyenne de ses notes (jointure ETUDIANT–PASSER). Affiche aussi le Code en premier.
== solution
SELECT ETUDIANT.Code, ETUDIANT.Nom, AVG(PASSER.Note)
FROM ETUDIANT, PASSER
WHERE ETUDIANT.Code = PASSER.Code
GROUP BY ETUDIANT.Code, ETUDIANT.Nom;
== explication
Code et Nom projetés à côté de AVG → dans le GROUP BY.
:::

::: sql si-c1-ch4-b-grp-16
ref: 88 | Chap. 4 · II. D. Le regroupement | Il faut pour cela utiliser l’instruction HAVING
niveau: 3
base: etudiants
== question
Étudiants (**Code, Nom**, moyenne) dont la **moyenne est au moins 12**.
== solution
SELECT ETUDIANT.Code, ETUDIANT.Nom, AVG(PASSER.Note)
FROM ETUDIANT, PASSER
WHERE ETUDIANT.Code = PASSER.Code
GROUP BY ETUDIANT.Code, ETUDIANT.Nom
HAVING AVG(PASSER.Note) >= 12;
== explication
Condition sur la moyenne (fonction) → HAVING.
:::

::: sql si-c1-ch4-b-grp-17
ref: 88 | Chap. 4 · II. D. Le regroupement — règles d’écriture | Toutes les colonnes projetées
niveau: 2
base: appels
== question
Nombre d’appels **par technicien** : **NumTech** et le nombre.
== solution
SELECT NumTech, COUNT(*) FROM APPEL GROUP BY NumTech;
== explication
GROUP BY sur la clé étrangère NumTech.
:::

::: sql si-c1-ch4-b-grp-18
ref: 88 | Chap. 4 · II. D. Le regroupement — règles d’écriture | Toutes les colonnes projetées
niveau: 3
base: appels
== question
Nombre d’appels **par logiciel** avec son **nom** : **NomLog** et le nombre.
== solution
SELECT LOGICIEL.NomLog, COUNT(*)
FROM APPEL, LOGICIEL
WHERE APPEL.CodeLog = LOGICIEL.CodeLog
GROUP BY LOGICIEL.NomLog;
== explication
Jointure pour obtenir le nom, puis regroupement sur ce nom.
:::

::: sql si-c1-ch4-b-grp-19
ref: 88 | Chap. 4 · II. D. Le regroupement | Il faut pour cela utiliser l’instruction HAVING
niveau: 2
base: basile
== question
BASILE : domaines (**NumDom**, nombre de candidats) préférés par **au moins 2 candidats** (table PREFERER).
== solution
SELECT NumDom, COUNT(*) FROM PREFERER GROUP BY NumDom HAVING COUNT(*) >= 2;
== explication
GROUP BY NumDom, puis HAVING sur le COUNT.
:::

::: sql si-c1-ch4-b-grp-20
ref: 88 | Chap. 4 · II. D. Le regroupement — règles d’écriture | Toutes les colonnes projetées
niveau: 2
base: basile
== question
BASILE : nombre de missions **par recruteur** : **CodeRec** et le nombre.
== solution
SELECT CodeRec, COUNT(*) FROM MISSION GROUP BY CodeRec;
== explication
Un résultat par recruteur.
:::

::: sql si-c1-ch4-b-grp-21
ref: 88 | Chap. 4 · II. D. Le regroupement — règles d’écriture | Toutes les colonnes projetées
niveau: 3
base: basile
== question
BASILE : **raisonSociale** de chaque recruteur et **tarif horaire moyen** de ses missions.
== solution
SELECT RECRUTEUR.raisonSociale, AVG(MISSION.tarifHoraire)
FROM RECRUTEUR, MISSION
WHERE RECRUTEUR.CodeRec = MISSION.CodeRec
GROUP BY RECRUTEUR.raisonSociale;
== explication
Jointure, AVG, regroupement sur la raison sociale projetée.
:::

::: sql si-c1-ch4-b-grp-22
ref: 88 | Chap. 4 · II. D. Le regroupement | Il faut pour cela utiliser l’instruction HAVING
niveau: 3
base: basile
== question
BASILE : candidats (**NumCand**, nombre de propositions reçues) ayant reçu **plus d’une** proposition.
== solution
SELECT NumCand, COUNT(*) FROM PROPOSER GROUP BY NumCand HAVING COUNT(*) > 1;
== explication
Compter par candidat, garder ceux dont le compte dépasse 1.
:::

::: qcm si-c1-ch4-b-grp-23
ref: 101 | Chap. 4 · Application no 14 — VII. B. Remarque | On peut repérer la nécessité de cette clause
niveau: 1
== question
Quand faut-il un **GROUP BY** ?
== choix
- [ ] Dès qu’il y a deux tables
- [x] Dès qu’il y a un calcul (agrégat) à faire **par** type d’enregistrement
- [ ] Dès qu’il y a un WHERE
- [ ] Dès qu’on veut trier
== explication
On repère la nécessité de GROUP BY dès qu’il y a un agrégat à calculer **par** quelque chose.
:::

::: qcm si-c1-ch4-b-grp-24
ref: 88 | Chap. 4 · II. D. Le regroupement — règles d’écriture | Toutes les colonnes projetées
niveau: 2
== question
Cette requête est-elle correcte ? `SELECT Ville, Nom, COUNT(*) FROM Client GROUP BY Ville;`
== choix
- [ ] Oui
- [x] Non : Nom est projeté mais absent du GROUP BY
- [ ] Non : COUNT(*) doit être dans le GROUP BY
- [ ] Non : il manque un HAVING
== explication
Toutes les colonnes projetées doivent figurer dans le GROUP BY, mis à part les fonctions.
:::

::: qcm si-c1-ch4-b-grp-25
ref: 88 | Chap. 4 · II. D. Le regroupement | Il faut pour cela utiliser l’instruction HAVING
niveau: 2
== question
`… WHERE COUNT(*) > 1 …` : pourquoi est-ce faux ?
== choix
- [x] Une condition sur une fonction de regroupement se met dans HAVING
- [ ] COUNT n’existe pas
- [ ] Il faudrait `>= 1`
- [ ] WHERE doit être après GROUP BY
== explication
HAVING exprime les restrictions sur les éléments fournis par le GROUP BY ; il concerne la fonction.
:::

::: qcm si-c1-ch4-b-grp-26
ref: 88 | Chap. 4 · II. D. Le regroupement | Il faut pour cela utiliser l’instruction HAVING
niveau: 1
== question
Où se place HAVING ?
== choix
- [ ] Avant le WHERE
- [ ] Juste après SELECT
- [x] Immédiatement après le GROUP BY
- [ ] Après ORDER BY
== explication
HAVING suit immédiatement le GROUP BY.
:::

::: ordre si-c1-ch4-b-grp-27
ref: 88 | Chap. 4 · II. D. Le regroupement — règles d’écriture | GROUP BY attribut3, attribut2
niveau: 2
== question
Remets dans l’ordre : villes ayant plus de 1 client.
== ordre
SELECT
Ville, COUNT(*)
FROM
Client
GROUP BY
Ville
HAVING
COUNT(*) > 1
;
== explication
GROUP BY puis HAVING.
:::

::: ordre si-c1-ch4-b-grp-28
ref: 88 | Chap. 4 · II. D. Le regroupement | Il faut pour cela utiliser l’instruction HAVING
niveau: 3
== question
Remets dans l’ordre : par marque, le prix moyen des articles de plus de 50 €, seulement si la moyenne dépasse 1 000, de la plus chère à la moins chère.
== ordre
SELECT
Marque, AVG(PV_TTC) AS Moy
FROM
Article
WHERE
PV_TTC > 50
GROUP BY
Marque
HAVING
AVG(PV_TTC) > 1000
ORDER BY
Moy DESC
;
== explication
L’ordre complet : SELECT → FROM → WHERE → GROUP BY → HAVING → ORDER BY.
:::

::: trous si-c1-ch4-b-grp-29
ref: 88 | Chap. 4 · II. D. Le regroupement | Le HAVING concerne la fonction
niveau: 2
== question
Complète : nombre de factures par client, seulement ceux qui en ont plus de 2.
== texte
SELECT NumClient, COUNT(*) FROM Facture {0} NumClient {1} COUNT(*) > 2;
== reponses
GROUP BY
HAVING
== intrus
WHERE
ORDER BY
== explication
Regroupement puis restriction sur la fonction.
:::

::: corrige si-c1-ch4-b-grp-30
ref: 87 | Chap. 4 · II. D. Le regroupement | combien de personnes préfèrent telle couleur
niveau: 2
== question
Exemple du cours : « combien de personnes préfèrent telle couleur, regroupées par couleur ? ». Avec une table PERSONNE(NumPers, Nom, Couleur), écris la requête.
== solution
SELECT Couleur, COUNT(*) AS Nb
FROM PERSONNE
GROUP BY Couleur;
== explication
Un comptage **par** couleur : COUNT(*) et GROUP BY Couleur.
:::
