---
type: exercices
---

<!-- Banque : jointures (version antérieure p. 79-83, INNER JOIN p. 83-84, LEFT/RIGHT JOIN p. 84-86, application 14 IV p. 97-98) -->

::: sql si-c1-ch4-b-jn-01
ref: 82 | Chap. 4 · II. A. 1. Version antérieure | TABLE1.Attribut = TABLE2.Attribut
niveau: 1
base: ladore
== question
Pour chaque facture : **NumFacture**, **Date_Facture** et **Nom** du client (version antérieure, jointure dans le WHERE).
== solution
SELECT Facture.NumFacture, Facture.Date_Facture, Client.Nom
FROM Facture, Client
WHERE Facture.NumClient = Client.NumClient;
== explication
2 tables → 1 jointure sur le champ commun NumClient.
:::

::: sql si-c1-ch4-b-jn-02
ref: 84 | Chap. 4 · II. A. 2. a. INNER JOIN | La syntaxe générale est la suivante
niveau: 1
base: ladore
== question
Même chose en **SQL 92** (INNER JOIN … ON) : **NumFacture, Date_Facture, Nom**.
== solution
SELECT Facture.NumFacture, Facture.Date_Facture, Client.Nom
FROM Facture
INNER JOIN Client ON Facture.NumClient = Client.NumClient;
== explication
La condition de jointure passe dans le ON.
:::

::: sql si-c1-ch4-b-jn-03
ref: 82 | Chap. 4 · II. A. 1. Version antérieure | TABLE1.Attribut = TABLE2.Attribut
niveau: 2
base: ladore
== question
Factures (**NumFacture, Date_Facture**) des clients qui habitent **Paris**.
== solution
SELECT Facture.NumFacture, Facture.Date_Facture
FROM Facture, Client
WHERE Facture.NumClient = Client.NumClient
AND Client.Ville = "Paris";
== explication
La ville est dans CLIENT, la facture dans FACTURE : jointure + condition, reliées par AND.
:::

::: sql si-c1-ch4-b-jn-04
ref: 84 | Chap. 4 · II. A. 2. a. INNER JOIN | La syntaxe générale est la suivante
niveau: 2
base: ladore
== question
En **SQL 92** : articles (**Libelle**) et **LibelleFam** de leur famille.
== solution
SELECT Article.Libelle, Famille.LibelleFam
FROM Article
INNER JOIN Famille ON Article.CodeFam = Famille.CodeFam;
== explication
Le libellé de famille est dans FAMILLE ; lien par CodeFam.
:::

::: sql si-c1-ch4-b-jn-05
ref: 82 | Chap. 4 · II. A. 1. Version antérieure | TABLE1.Attribut = TABLE2.Attribut
niveau: 2
base: ladore
== question
Articles (**NumArticle, Libelle**) de la famille dont le libellé est **« Accessoires »**.
== solution
SELECT Article.NumArticle, Article.Libelle
FROM Article, Famille
WHERE Article.CodeFam = Famille.CodeFam
AND Famille.LibelleFam = "Accessoires";
== explication
On ne connaît que le **libellé** de la famille : il faut joindre FAMILLE pour le tester.
:::

::: sql si-c1-ch4-b-jn-06
ref: 82 | Chap. 4 · II. A. 1. Version antérieure | une fois de moins que le nombre de tables
niveau: 2
base: ladore
== question
Pour chaque ligne de facture : **NumFacture, Date_Facture, Libelle, Quantite** (3 tables).
== solution
SELECT Facture.NumFacture, Facture.Date_Facture, Article.Libelle, LIGNE.Quantite
FROM Facture, LIGNE, Article
WHERE Facture.NumFacture = LIGNE.NumFacture
AND LIGNE.NumArticle = Article.NumArticle;
== explication
3 tables → 2 jointures ; LIGNE fait le lien entre FACTURE et ARTICLE.
:::

::: sql si-c1-ch4-b-jn-07
ref: 84 | Chap. 4 · II. A. 2. a. INNER JOIN | La syntaxe générale est la suivante
niveau: 3
base: ladore
== question
En **SQL 92** (deux INNER JOIN) : **Nom** du client et **Libelle** de chaque article qu’il a acheté (4 tables).
== solution
SELECT Client.Nom, Article.Libelle
FROM Client
INNER JOIN Facture ON Client.NumClient = Facture.NumClient
INNER JOIN LIGNE ON Facture.NumFacture = LIGNE.NumFacture
INNER JOIN Article ON LIGNE.NumArticle = Article.NumArticle;
== explication
On enchaîne un INNER JOIN … ON … par table ajoutée : 4 tables → 3 jointures.
:::

::: sql si-c1-ch4-b-jn-08
ref: 97 | Chap. 4 · Application no 14 — IV. A. | Un client qui a commandé est un client dont le numéro figure dans la table Facture
niveau: 3
base: ladore
== question
**Noms** des clients (sans doublon) qui ont acheté un article de marque **Hohner**.
== solution
SELECT DISTINCT Client.Nom
FROM Client, Facture, LIGNE, Article
WHERE Client.NumClient = Facture.NumClient
AND Facture.NumFacture = LIGNE.NumFacture
AND LIGNE.NumArticle = Article.NumArticle
AND Article.Marque = "Hohner";
== explication
La marque est dans ARTICLE, le nom dans CLIENT : on traverse FACTURE et LIGNE. DISTINCT car un client peut avoir acheté plusieurs articles Hohner.
:::

::: sql si-c1-ch4-b-jn-09
ref: 82 | Chap. 4 · II. A. 1. Version antérieure | TABLE1.Attribut = TABLE2.Attribut
niveau: 2
base: appels
== question
Pour chaque appel : **NumAppel**, **DenomCli** du client et **NomLog** du logiciel.
== solution
SELECT APPEL.NumAppel, CLIENT.DenomCli, LOGICIEL.NomLog
FROM APPEL, CLIENT, LOGICIEL
WHERE APPEL.NumCli = CLIENT.NumCli
AND APPEL.CodeLog = LOGICIEL.CodeLog;
== explication
APPEL contient les deux clés étrangères : 3 tables, 2 jointures, toutes partant d’APPEL.
:::

::: sql si-c1-ch4-b-jn-10
ref: 82 | Chap. 4 · II. A. 1. Version antérieure | TABLE1.Attribut = TABLE2.Attribut
niveau: 2
base: appels
== question
Appels (**NumAppel, DateAppel**) concernant le logiciel nommé **« StockPro »**.
== solution
SELECT APPEL.NumAppel, APPEL.DateAppel
FROM APPEL, LOGICIEL
WHERE APPEL.CodeLog = LOGICIEL.CodeLog
AND LOGICIEL.NomLog = "StockPro";
== explication
Le nom du logiciel est dans LOGICIEL : jointure sur CodeLog.
:::

::: sql si-c1-ch4-b-jn-11
ref: 84 | Chap. 4 · II. A. 2. a. INNER JOIN | La syntaxe générale est la suivante
niveau: 2
base: appels
== question
En **SQL 92** : techniciens (**NomTech, PrenomTech**, sans doublon) ayant traité un appel du client **« Fleurs & Co »**.
== solution
SELECT DISTINCT TECHNICIEN.NomTech, TECHNICIEN.PrenomTech
FROM TECHNICIEN
INNER JOIN APPEL ON TECHNICIEN.NumTech = APPEL.NumTech
INNER JOIN CLIENT ON APPEL.NumCli = CLIENT.NumCli
WHERE CLIENT.DenomCli = "Fleurs & Co";
== explication
Jointures dans les ON, condition sur le client dans le WHERE.
:::

::: sql si-c1-ch4-b-jn-12
ref: 84 | Chap. 4 · II. A. 2. a. INNER JOIN | La syntaxe générale est la suivante
niveau: 2
base: etudiants
== question
**Nom** des étudiants et **Note** obtenue au devoir **numéro 1** (INNER JOIN).
== solution
SELECT ETUDIANT.Nom, PASSER.Note
FROM ETUDIANT
INNER JOIN PASSER ON ETUDIANT.Code = PASSER.Code
WHERE PASSER.NumDev = 1;
== explication
INNER JOIN entre ETUDIANT et PASSER, puis restriction sur le devoir.
:::

::: sql si-c1-ch4-b-jn-13
ref: 82 | Chap. 4 · II. A. 1. Version antérieure | une fois de moins que le nombre de tables
niveau: 3
base: etudiants
== question
**Nom**, **Note** et **Date** du devoir, pour toutes les copies (3 tables).
== solution
SELECT ETUDIANT.Nom, PASSER.Note, DEVOIR.Date
FROM ETUDIANT, PASSER, DEVOIR
WHERE ETUDIANT.Code = PASSER.Code
AND PASSER.NumDev = DEVOIR.NumDev;
== explication
PASSER est la table de lien entre ETUDIANT et DEVOIR : 2 jointures.
:::

::: sql si-c1-ch4-b-jn-14
ref: 84 | Chap. 4 · II. A. 2. b. LEFT JOIN | On récupère toute la table de gauche
niveau: 2
base: ladore
== question
**Tous** les clients (**Nom**) avec le **NumFacture** de leurs factures, **y compris** ceux qui n’en ont aucune (LEFT JOIN).
== solution
SELECT Client.Nom, Facture.NumFacture
FROM Client
LEFT JOIN Facture ON Client.NumClient = Facture.NumClient;
== explication
LEFT JOIN garde toute la table de gauche (CLIENT) ; les clients sans facture ont NULL.
:::

::: sql si-c1-ch4-b-jn-15
ref: 85 | Chap. 4 · II. A. 2. b. LEFT JOIN | WHERE PASSER.code IS NULL
niveau: 3
base: ladore
== question
Avec LEFT JOIN : clients (**Nom, Prenom**) qui n’ont **aucune** facture.
== solution
SELECT Client.Nom, Client.Prenom
FROM Client
LEFT JOIN Facture ON Client.NumClient = Facture.NumClient
WHERE Facture.NumClient IS NULL;
== explication
LEFT JOIN + `IS NULL` sur la table de droite = seulement les lignes de gauche sans correspondance.
:::

::: sql si-c1-ch4-b-jn-16
ref: 85 | Chap. 4 · II. A. 2. b. LEFT JOIN | WHERE PASSER.code IS NULL
niveau: 3
base: ladore
== question
Avec LEFT JOIN : articles (**NumArticle, Libelle**) qui n’ont **jamais été vendus** (absents de LIGNE).
== solution
SELECT Article.NumArticle, Article.Libelle
FROM Article
LEFT JOIN LIGNE ON Article.NumArticle = LIGNE.NumArticle
WHERE LIGNE.NumArticle IS NULL;
== explication
Même schéma : toute la table de gauche, puis on ne garde que les NULL à droite.
:::

::: sql si-c1-ch4-b-jn-17
ref: 86 | Chap. 4 · II. A. 2. c. RIGHT JOIN | La table prioritaire SECTEURS apparaît ainsi plus clairement
niveau: 3
base: ventes
== question
Avec LEFT JOIN : secteurs (**nom_zone**) qui n’ont **aucun** vendeur.
== solution
SELECT SECTEURS.nom_zone
FROM SECTEURS
LEFT JOIN VENDEURS ON SECTEURS.id_secteur = VENDEURS.secteur_id
WHERE VENDEURS.secteur_id IS NULL;
== explication
SECTEURS en premier (table prioritaire), puis IS NULL pour garder ceux sans vendeur.
:::

::: sql si-c1-ch4-b-jn-18
ref: 84 | Chap. 4 · II. A. 2. b. LEFT JOIN | On récupère toute la table de gauche
niveau: 2
base: appels
== question
**Tous** les techniciens (**NomTech**) avec le **NumAppel** de leurs appels, même ceux sans appel.
== solution
SELECT TECHNICIEN.NomTech, APPEL.NumAppel
FROM TECHNICIEN
LEFT JOIN APPEL ON TECHNICIEN.NumTech = APPEL.NumTech;
== explication
LEFT JOIN avec TECHNICIEN à gauche.
:::

::: sql si-c1-ch4-b-jn-19
ref: 84 | Chap. 4 · II. A. 2. a. INNER JOIN | La syntaxe générale est la suivante
niveau: 2
base: basile
== question
BASILE (SQL 92) : missions (**intitule**) et **raisonSociale** du recruteur qui les propose.
== solution
SELECT MISSION.intitule, RECRUTEUR.raisonSociale
FROM MISSION
INNER JOIN RECRUTEUR ON MISSION.CodeRec = RECRUTEUR.CodeRec;
== explication
MISSION contient la clé étrangère CodeRec.
:::

::: sql si-c1-ch4-b-jn-20
ref: 82 | Chap. 4 · II. A. 1. Version antérieure | TABLE1.Attribut = TABLE2.Attribut
niveau: 2
base: basile
== question
BASILE : candidats (**nom, prenom**) qui ont **accepté** une proposition (Reponse = "O").
== solution
SELECT CANDIDAT.nom, CANDIDAT.prenom
FROM CANDIDAT, PROPOSER
WHERE CANDIDAT.NumCand = PROPOSER.NumCand
AND PROPOSER.Reponse = "O";
== explication
La réponse est dans PROPOSER, le nom dans CANDIDAT.
:::

::: sql si-c1-ch4-b-jn-21
ref: 82 | Chap. 4 · II. A. 1. Version antérieure | une fois de moins que le nombre de tables
niveau: 3
base: basile
== question
BASILE : candidats (**nom**) et **libelle** de chacun de leurs domaines préférés (3 tables).
== solution
SELECT CANDIDAT.nom, DOMAINE.libelle
FROM CANDIDAT, PREFERER, DOMAINE
WHERE CANDIDAT.NumCand = PREFERER.NumCand
AND PREFERER.NumDom = DOMAINE.NumDom;
== explication
PREFERER est la table de lien (plusieurs à plusieurs) : 2 jointures.
:::

::: sql si-c1-ch4-b-jn-22
ref: 82 | Chap. 4 · II. A. 1. Version antérieure | une fois de moins que le nombre de tables
niveau: 3
base: basile
== question
BASILE : missions (**IdMission, intitule**) proposées par un recruteur de **PARIS** dans le domaine **« Hôtellerie »**.
== solution
SELECT MISSION.IdMission, MISSION.intitule
FROM MISSION, RECRUTEUR, DOMAINE
WHERE MISSION.CodeRec = RECRUTEUR.CodeRec
AND MISSION.NumDom = DOMAINE.NumDom
AND RECRUTEUR.ville = "PARIS"
AND DOMAINE.libelle = "Hôtellerie";
== explication
2 jointures (vers RECRUTEUR et DOMAINE) + 2 conditions.
:::

::: sql si-c1-ch4-b-jn-23
ref: 90 | Chap. 4 · Application no 13 — Bibliothèque JaimeLire | Le bibliothécaire de JaimeLire souhaite connaître les liens de parenté
niveau: 3
base: jaimelire
== question
JaimeLire : prénom de chaque **enfant** (**PrenAdh**) et prénom de son **parent**. Indice : la table est jointe **avec elle-même**, avec deux alias E (enfant) et P (parent).
== solution
SELECT E.PrenAdh, P.PrenAdh
FROM ADHERENT E, ADHERENT P
WHERE E.NumAdhParent = P.NumAdh;
== explication
Association réflexive : la clé étrangère NumAdhParent pointe vers la même table. Les alias de table permettent d’utiliser ADHERENT deux fois.
:::

::: qcm si-c1-ch4-b-jn-24
ref: 82 | Chap. 4 · II. A. 1. Version antérieure | TABLE1.Attribut = TABLE2.Attribut
niveau: 1
== question
Quelle condition de jointure est correcte entre CLIENT et COMMANDE ?
== choix
- [x] `CLIENT.CodeCli = COMMANDE.CodeCli`
- [ ] `CLIENT.CodeCli = CLIENT.CodeCli`
- [ ] `CLIENT.Nom = COMMANDE.CodeCli`
- [ ] `CLIENT = COMMANDE`
== explication
Deux tables différentes, mais le **même attribut** !
:::

::: qcm si-c1-ch4-b-jn-25
ref: 83 | Chap. 4 · II. A. 2. Version SQL 92 | INNER JOIN est la jointure par défaut
niveau: 1
== question
Que renvoie un **INNER JOIN** ?
== choix
- [x] Les lignes qui ont une correspondance dans les deux tables
- [ ] Toutes les lignes de la table de gauche
- [ ] Toutes les lignes de la table de droite
- [ ] Toutes les lignes des deux tables
== explication
INNER JOIN est la jointure par défaut : uniquement les correspondances.
:::

::: qcm si-c1-ch4-b-jn-26
ref: 84 | Chap. 4 · II. A. 2. b. LEFT JOIN | verront l’attribut NULL apparaître
niveau: 2
== question
Avec `ETUDIANT LEFT JOIN PASSER`, que voit-on dans NumDev pour un étudiant qui n’a passé aucun devoir ?
== choix
- [ ] 0
- [x] NULL
- [ ] Il n’apparaît pas
- [ ] Une erreur
== explication
Les étudiants sans devoir verront l’attribut NULL apparaître dans la colonne correspondante.
:::

::: qcm si-c1-ch4-b-jn-27
ref: 86 | Chap. 4 · II. A. 2. c. RIGHT JOIN | Il est pertinent de ne recourir exclusivement qu’à l’instruction INNER ou LEFT
niveau: 2
== question
Quelles raisons le cours donne-t-il pour **éviter RIGHT JOIN** ? (plusieurs réponses)
== choix
- [x] La lisibilité
- [x] La standardisation
- [x] Le chaînage de plusieurs jointures
- [ ] RIGHT JOIN est interdit à l’examen
== explication
Trois raisons : lisibilité, standardisation, chaînage. Il n’est pas interdit, mais LEFT JOIN suffit toujours.
:::

::: qcm si-c1-ch4-b-jn-28
ref: 83 | Chap. 4 · II. A. 2. Version SQL 92 | La réforme du programme, qui prend effet à compter des examens de 2027
niveau: 1
== question
À partir de quand la syntaxe INNER JOIN / LEFT JOIN est-elle exigée ?
== choix
- [ ] Elle ne l’est pas
- [x] À partir des examens 2027
- [ ] Depuis 2019
- [ ] Seulement en DSCG
== explication
La réforme du programme prend effet à compter des examens de 2027.
:::

::: ordre si-c1-ch4-b-jn-29
ref: 84 | Chap. 4 · II. A. 2. a. INNER JOIN | La syntaxe générale est la suivante
niveau: 1
== question
Remets dans l’ordre : nom du client de chaque facture (SQL 92).
== ordre
SELECT
Nom, NumFacture
FROM
Client
INNER JOIN
Facture
ON
Client.NumClient = Facture.NumClient
;
== explication
FROM table A INNER JOIN table B ON condition.
:::

::: ordre si-c1-ch4-b-jn-30
ref: 82 | Chap. 4 · II. A. 1. Version antérieure | TABLE1.Attribut = TABLE2.Attribut
niveau: 2
== question
Remets dans l’ordre (version antérieure). Un morceau est un intrus.
== ordre
SELECT
Nom, NumFacture
FROM
Client, Facture
WHERE
Client.NumClient = Facture.NumClient
;
== intrus
ON
== explication
Dans la version antérieure, la jointure est dans le WHERE ; ON n’existe qu’avec JOIN.
:::

::: trous si-c1-ch4-b-jn-31
ref: 85 | Chap. 4 · II. A. 2. c. RIGHT JOIN | inverser l’ordre des tables
niveau: 2
== question
Transforme `FROM A RIGHT JOIN B ON …` en LEFT JOIN.
== texte
FROM {0} {1} JOIN {2} ON …
== reponses
B
LEFT
A
== intrus
RIGHT
INNER
== explication
On inverse l’ordre des tables et on remplace RIGHT par LEFT.
:::

::: corrige si-c1-ch4-b-jn-32
ref: 80 | Chap. 4 · I. B. Le FROM | La jointure a pour but d’exprimer le lien entre la table ETUDIANT
niveau: 3
== question
Réécris en **SQL 92** la requête du cours :
```sql
SELECT Nom, Prenom, NumTel
FROM ETUDIANT, INSCRIRE, UE
WHERE Sexe = "F" AND Note >= 14 AND Ville = "Paris"
AND LibelleUE = "Système d’information de gestion"
AND ETUDIANT.CodeEtud = INSCRIRE.CodeEtud
AND INSCRIRE.CodeUE = UE.CodeUE;
```
== solution
SELECT Nom, Prenom, NumTel
FROM ETUDIANT
INNER JOIN INSCRIRE ON ETUDIANT.CodeEtud = INSCRIRE.CodeEtud
INNER JOIN UE ON INSCRIRE.CodeUE = UE.CodeUE
WHERE Sexe = "F" AND Note >= 14 AND Ville = "Paris"
AND LibelleUE = "Système d’information de gestion";
== explication
Les deux jointures quittent le WHERE pour des INNER JOIN … ON ; le WHERE garde les vraies restrictions.
:::
