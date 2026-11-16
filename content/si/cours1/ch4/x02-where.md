---
type: exercices
---

<!-- Banque : WHERE (cours p. 80-81, application 14 III p. 95-97) -->

::: sql si-c1-ch4-b-whr-01
ref: 80 | Chap. 4 · I. C. Le WHERE | La clause WHERE exprime la restriction
niveau: 1
base: ladore
== question
Clients (**Nom, Prenom**) qui habitent **Lyon**.
== solution
SELECT Nom, Prenom FROM Client WHERE Ville = "Lyon";
== explication
Le texte se compare entre guillemets avec `=`.
:::

::: sql si-c1-ch4-b-whr-02
ref: 81 | Chap. 4 · I. C. Le WHERE — règles d’écriture | opérateurs de comparaison
niveau: 1
base: ladore
== question
Articles (**Libelle, PV_TTC**) qui coûtent **moins de 100 €**.
== solution
SELECT Libelle, PV_TTC FROM Article WHERE PV_TTC < 100;
== explication
`<` = inférieur (strictement).
:::

::: sql si-c1-ch4-b-whr-03
ref: 81 | Chap. 4 · I. C. Le WHERE — règles d’écriture | opérateurs de comparaison
niveau: 1
base: ladore
== question
Articles (**Libelle, PV_TTC**) qui coûtent **au moins 1 450 €** (1 450 inclus).
== solution
SELECT Libelle, PV_TTC FROM Article WHERE PV_TTC >= 1450;
== explication
« Au moins » = supérieur **ou égal** : `>=`.
:::

::: sql si-c1-ch4-b-whr-04
ref: 81 | Chap. 4 · I. C. Le WHERE — règles d’écriture | opérateurs de comparaison
niveau: 1
base: ladore
== question
Articles (**NumArticle, Libelle**) qui **ne sont pas** de la marque **Ladoré**.
== solution
SELECT NumArticle, Libelle FROM Article WHERE Marque <> "Ladoré";
== explication
`<>` = différent.
:::

::: sql si-c1-ch4-b-whr-05
ref: 81 | Chap. 4 · I. C. Le WHERE — règles d’écriture | opérateurs de comparaison
niveau: 1
base: ladore
== question
Lignes de facture (**NumFacture, NumArticle, Quantite**) où la quantité est **supérieure à 1**.
== solution
SELECT NumFacture, NumArticle, Quantite FROM LIGNE WHERE Quantite > 1;
== explication
`>` = strictement supérieur.
:::

::: sql si-c1-ch4-b-whr-06
ref: 80 | Chap. 4 · I. B. Le FROM | liées par l’opérateur AND pour indiquer que toutes les conditions
niveau: 1
base: ladore
== question
Clients (**Nom, Prenom**) de **Paris** dont le titre est **Mme**.
== solution
SELECT Nom, Prenom FROM Client WHERE Ville = "Paris" AND Titre = "Mme";
== explication
Les deux conditions doivent être vraies : AND.
:::

::: sql si-c1-ch4-b-whr-07
ref: 95 | Chap. 4 · Application no 14 — III. C. | le OR est donc impératif
niveau: 1
base: ladore
== question
Articles (**Libelle, Marque**) de marque **Hohner** ou **Soprani**.
== solution
SELECT Libelle, Marque FROM Article WHERE Marque = "Hohner" OR Marque = "Soprani";
== explication
Un article n’a qu’une marque : il faut OR, AND ne renverrait rien.
:::

::: sql si-c1-ch4-b-whr-08
ref: 80 | Chap. 4 · I. B. Le FROM | liées par l’opérateur AND pour indiquer que toutes les conditions
niveau: 2
base: ladore
== question
Articles (**Libelle, PV_TTC**) de la famille **ACS** (accessoires) qui coûtent **plus de 50 €**.
== solution
SELECT Libelle, PV_TTC FROM Article WHERE CodeFam = "ACS" AND PV_TTC > 50;
== explication
Deux conditions simultanées : AND.
:::

::: sql si-c1-ch4-b-whr-09
ref: 96 | Chap. 4 · Application no 14 — III. F. | BETWEEN
niveau: 1
base: ladore
== question
Articles (**Libelle, PV_TTC**) dont le prix est **entre 50 et 200 €** (bornes incluses).
== solution
SELECT Libelle, PV_TTC FROM Article WHERE PV_TTC BETWEEN 50 AND 200;
== explication
BETWEEN valeur1 AND valeur2 inclut les deux bornes.
:::

::: sql si-c1-ch4-b-whr-10
ref: 96 | Chap. 4 · Application no 14 — III. F. | BETWEEN
niveau: 2
base: ladore
== question
Factures (**NumFacture, Date_Facture**) du **1er trimestre 2019** (du 01/01/2019 au 31/03/2019).
== solution
SELECT NumFacture, Date_Facture FROM Facture WHERE Date_Facture BETWEEN #01/01/2019# AND #31/03/2019#;
== explication
BETWEEN avec deux dates entre dièses.
:::

::: sql si-c1-ch4-b-whr-11
ref: 96 | Chap. 4 · Application no 14 — III. F. | Ici, le format de date est à l’anglo-saxonne
niveau: 2
base: ladore
== question
Factures (**NumFacture**) de l’année **2020**, en utilisant **YEAR()**.
== solution
SELECT NumFacture FROM Facture WHERE YEAR(Date_Facture) = 2020;
== explication
YEAR(date) renvoie l’année : on la compare à 2020. Le cours utilise aussi MONTH() pour le mois.
:::

::: sql si-c1-ch4-b-whr-12
ref: 96 | Chap. 4 · Application no 14 — III. F. | Ici, le format de date est à l’anglo-saxonne
niveau: 2
base: ladore
== question
Factures (**NumFacture, NumClient**) de **juillet 2019** avec **MONTH()** et **YEAR()**.
== solution
SELECT NumFacture, NumClient FROM Facture WHERE MONTH(Date_Facture) = 7 AND YEAR(Date_Facture) = 2019;
== explication
Mois = 7 **et** année = 2019 : deux conditions reliées par AND.
:::

::: sql si-c1-ch4-b-whr-13
ref: 96 | Chap. 4 · Application no 14 — III. E. | Les champs de type date sont entourés de dièses ou de guillemets
niveau: 1
base: ladore
== question
Clients (**Nom, Date_Creation**) créés **avant le 1er janvier 2017**.
== solution
SELECT Nom, Date_Creation FROM Client WHERE Date_Creation < #01/01/2017#;
== explication
Avant = plus petit : `<`.
:::

::: sql si-c1-ch4-b-whr-14
ref: 96 | Chap. 4 · Application no 14 — III. G. | LIKE "Etui*"
niveau: 1
base: ladore
== question
Articles (**NumArticle, Libelle**) dont le libellé **commence par « Accordéon »**.
== solution
SELECT NumArticle, Libelle FROM Article WHERE Libelle LIKE "Accordéon*";
== explication
L’étoile à la fin : « Accordéon » suivi de n’importe quoi.
:::

::: sql si-c1-ch4-b-whr-15
ref: 97 | Chap. 4 · Application no 14 — III. H. | permet de sélectionner tous les libellés qui contiennent
niveau: 1
base: ladore
== question
Articles (**NumArticle, Libelle**) dont le libellé **contient « ladoréon »**.
== solution
SELECT NumArticle, Libelle FROM Article WHERE Libelle LIKE "*ladoréon*";
== explication
Une étoile de chaque côté = « contient ».
:::

::: sql si-c1-ch4-b-whr-16
ref: 96 | Chap. 4 · Application no 14 — III. G. | LIKE "Etui*"
niveau: 1
base: ladore
== question
Clients (**Nom, CP**) dont le code postal **commence par 75** (Paris).
== solution
SELECT Nom, CP FROM Client WHERE CP LIKE "75*";
== explication
Le CP est du texte : LIKE "75*" = commence par 75.
:::

::: sql si-c1-ch4-b-whr-17
ref: 97 | Chap. 4 · Application no 14 — III. H. | permet de sélectionner tous les libellés qui contiennent
niveau: 2
base: basile
== question
BASILE : candidats (**NumCand, nom, courriel**) dont l’adresse mail **contient « live »**.
== solution
SELECT NumCand, nom, courriel FROM CANDIDAT WHERE courriel LIKE "*live*";
== explication
« Contient » : étoiles avant et après.
:::

::: sql si-c1-ch4-b-whr-18
ref: 81 | Chap. 4 · I. C. Le WHERE — règles d’écriture | est nul ou est non nul
niveau: 1
base: basile
== question
BASILE : candidats (**NumCand, nom**) **sans permis** (la colonne permis est vide).
== solution
SELECT NumCand, nom FROM CANDIDAT WHERE permis IS NULL;
== explication
Une case vide se teste avec IS NULL.
:::

::: sql si-c1-ch4-b-whr-19
ref: 81 | Chap. 4 · I. C. Le WHERE — règles d’écriture | est nul ou est non nul
niveau: 1
base: jaimelire
== question
JaimeLire : adhérents (**NumAdh, PrenAdh, NomAdh**) qui **n’ont pas de parent** inscrit (NumAdhParent vide).
== solution
SELECT NumAdh, PrenAdh, NomAdh FROM ADHERENT WHERE NumAdhParent IS NULL;
== explication
Clé étrangère vide → IS NULL.
:::

::: sql si-c1-ch4-b-whr-20
ref: 81 | Chap. 4 · I. C. Le WHERE — règles d’écriture | est nul ou est non nul
niveau: 1
base: basile
== question
BASILE : propositions (**IdMission, NumCand, Reponse**) qui **ont** reçu une réponse.
== solution
SELECT IdMission, NumCand, Reponse FROM PROPOSER WHERE Reponse IS NOT NULL;
== explication
Case remplie → IS NOT NULL.
:::

::: sql si-c1-ch4-b-whr-21
ref: 80 | Chap. 4 · I. C. Le WHERE | La clause WHERE exprime la restriction
niveau: 1
base: basile
== question
BASILE : missions (**IdMission, intitule, tarifHoraire**) payées **plus de 12 €** de l’heure.
== solution
SELECT IdMission, intitule, tarifHoraire FROM MISSION WHERE tarifHoraire > 12;
== explication
Comparaison d’un nombre.
:::

::: sql si-c1-ch4-b-whr-22
ref: 80 | Chap. 4 · I. B. Le FROM | liées par l’opérateur AND pour indiquer que toutes les conditions
niveau: 2
base: basile
== question
BASILE : candidates (**NumCand, nom, prenom**) de sexe **F** qui ont le **permis B**.
== solution
SELECT NumCand, nom, prenom FROM CANDIDAT WHERE sexe = "F" AND permis = "B";
== explication
Deux conditions vraies en même temps : AND.
:::

::: sql si-c1-ch4-b-whr-23
ref: 95 | Chap. 4 · Application no 14 — III. C. | le OR est donc impératif
niveau: 2
base: basile
== question
BASILE : candidats (**NumCand, nom, ville**) qui habitent **PARIS** ou **SOCHAUX**.
== solution
SELECT NumCand, nom, ville FROM CANDIDAT WHERE ville = "PARIS" OR ville = "SOCHAUX";
== explication
Une seule ville par candidat : OR.
:::

::: sql si-c1-ch4-b-whr-24
ref: 96 | Chap. 4 · Application no 14 — III. E. | Les champs de type date sont entourés de dièses ou de guillemets
niveau: 2
base: basile
== question
BASILE : missions (**IdMission, intitule, dateDepot**) déposées **à partir du 01/01/2019**.
== solution
SELECT IdMission, intitule, dateDepot FROM MISSION WHERE dateDepot >= #01/01/2019#;
== explication
« À partir de » inclut le jour : `>=`.
:::

::: sql si-c1-ch4-b-whr-25
ref: 82 | Chap. 4 · II. A. 1. Requête 1 | Quels sont les appels traités par le technicien Hugo Victor
niveau: 1
base: appels
== question
Appels (**NumAppel, Heure**) du **12/04/2025**.
== solution
SELECT NumAppel, Heure FROM APPEL WHERE DateAppel = #12/04/2025#;
== explication
Une date précise : `=` avec la date entre dièses.
:::

::: sql si-c1-ch4-b-whr-26
ref: 80 | Chap. 4 · I. B. Le FROM | liées par l’opérateur AND pour indiquer que toutes les conditions
niveau: 2
base: appels
== question
Appels (**NumAppel**) concernant le logiciel **STK** traités par le technicien numéro **2**.
== solution
SELECT NumAppel FROM APPEL WHERE CodeLog = "STK" AND NumTech = 2;
== explication
Deux conditions : AND. NumTech est un nombre, CodeLog un texte.
:::

::: sql si-c1-ch4-b-whr-27
ref: 81 | Chap. 4 · I. C. Le WHERE — règles d’écriture | opérateurs de comparaison
niveau: 1
base: etudiants
== question
Lignes de PASSER (**Code, NumDev, Note**) avec une note **au moins égale à 14**.
== solution
SELECT Code, NumDev, Note FROM PASSER WHERE Note >= 14;
== explication
« Au moins égale » : `>=` (comme dans l’exemple du cours « Note >= 14 »).
:::

::: sql si-c1-ch4-b-whr-28
ref: 81 | Chap. 4 · I. C. Le WHERE — règles d’écriture | opérateurs de comparaison
niveau: 1
base: etudiants
== question
Lignes de PASSER (**Code, NumDev, Note**) avec une note **strictement inférieure à 10**.
== solution
SELECT Code, NumDev, Note FROM PASSER WHERE Note < 10;
== explication
`<` exclut 10.
:::

::: sql si-c1-ch4-b-whr-29
ref: 96 | Chap. 4 · Application no 14 — III. F. | BETWEEN
niveau: 2
base: employes
== question
Employés (**Nom, DateEmbauche**) embauchés **entre le 01/01/2020 et le 31/12/2023**.
== solution
SELECT Nom, DateEmbauche FROM Employes WHERE DateEmbauche BETWEEN #01/01/2020# AND #31/12/2023#;
== explication
Intervalle de dates : BETWEEN … AND …
:::

::: qcm si-c1-ch4-b-whr-30
ref: 80 | Chap. 4 · I. C. Le WHERE | La clause WHERE exprime la restriction
niveau: 1
== question
La **restriction** (WHERE) réduit…
== choix
- [ ] le nombre de colonnes
- [x] le nombre de lignes
- [ ] le nombre de tables
- [ ] le nombre de requêtes
== explication
WHERE garde seulement les lignes qui vérifient la condition.
:::

::: qcm si-c1-ch4-b-whr-31
ref: 96 | Chap. 4 · Application no 14 — III. F. | BETWEEN
niveau: 1
== question
`PV_TTC BETWEEN 100 AND 200` garde-t-il un article à **200 €** ?
== choix
- [x] Oui, les bornes sont incluses
- [ ] Non, les bornes sont exclues
- [ ] Seulement s’il est en promotion
== explication
BETWEEN … AND … inclut les deux bornes (équivalent à `>= 100 AND <= 200`, comme le montre le cours avec les dates).
:::

::: qcm si-c1-ch4-b-whr-32
ref: 96 | Chap. 4 · Application no 14 — III. G. | LIKE "Etui*"
niveau: 1
== question
Lequel de ces libellés est trouvé par `LIKE "Etui*"` ?
== choix
- [x] Etui rigide accordéon
- [ ] Grand étui
- [ ] Accordéon avec étui
- [ ] Ladoréon
== explication
`"Etui*"` = **commence par** « Etui ».
:::

::: qcm si-c1-ch4-b-whr-33
ref: 81 | Chap. 4 · I. C. Le WHERE — règles d’écriture | est nul ou est non nul
niveau: 1
== question
Pour trouver les lignes où la colonne **Reponse est vide**, on écrit…
== choix
- [ ] `Reponse = NULL`
- [ ] `Reponse = ""`
- [x] `Reponse IS NULL`
- [ ] `Reponse NOT`
== explication
Une case vide (NULL) se teste avec **IS NULL**, jamais avec `=`.
:::

::: qcm si-c1-ch4-b-whr-34
ref: 95 | Chap. 4 · Application no 14 — III. C. | le OR est donc impératif
niveau: 2
== question
« Les articles de la famille INL **et** ceux de la famille ACC » se traduit par…
== choix
- [ ] `CodeFam = "INL" AND CodeFam = "ACC"`
- [x] `CodeFam = "INL" OR CodeFam = "ACC"`
- [ ] `CodeFam = "INL, ACC"`
- [ ] `CodeFam BETWEEN "INL" AND "ACC"`
== explication
Piège du français : « et » dans la phrase, mais un article n’a qu’une famille. Chaque ligne doit vérifier **l’une ou l’autre** condition : OR.
:::

::: trous si-c1-ch4-b-whr-35
ref: 81 | Chap. 4 · I. C. Le WHERE — règles d’écriture | opérateurs de comparaison
niveau: 1
== question
Associe chaque opérateur à son sens : « supérieur ou égal », « différent », « inférieur ».
== texte
supérieur ou égal : {0} · différent : {1} · inférieur : {2}
== reponses
>=
<>
<
== intrus
=>
!=
<=
== explication
Les opérateurs du cours : =, <, >, <=, >=, <>.
:::

::: ordre si-c1-ch4-b-whr-36
ref: 96 | Chap. 4 · Application no 14 — III. F. | BETWEEN
niveau: 1
== question
Remets dans l’ordre : articles dont le prix est entre 50 et 200 €.
== ordre
SELECT
Libelle
FROM
Article
WHERE
PV_TTC
BETWEEN
50
AND
200
;
== explication
BETWEEN valeur1 AND valeur2.
:::

::: ordre si-c1-ch4-b-whr-37
ref: 96 | Chap. 4 · Application no 14 — III. G. | LIKE "Etui*"
niveau: 1
== question
Remets dans l’ordre : les libellés qui commencent par « Etui ». Un morceau est un intrus.
== ordre
SELECT
Libelle
FROM
Article
WHERE
Libelle LIKE "Etui*"
;
== intrus
Libelle = "Etui*"
== explication
Avec une étoile, il faut **LIKE**, pas `=`.
:::

::: corrige si-c1-ch4-b-whr-38
ref: 78 | Chap. 4 · I. Les requêtes : syntaxe de base | Voici une requête permettant d’établir une liste d’étudiants
niveau: 2
== question
Sur la table ETUDIANT(CodeEtud, Nom, Prenom, NumTel, Sexe, Ville), écris la restriction : étudiantes (Sexe = F) habitant **Paris**. Affiche Nom, Prenom, NumTel.
== solution
SELECT Nom, Prenom, NumTel
FROM ETUDIANT
WHERE Sexe = "F"
AND Ville = "Paris";
== explication
C’est une partie de l’exemple du cours (p. 78) : les restrictions ciblent le besoin, reliées par AND.
:::
