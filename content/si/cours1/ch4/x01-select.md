---
type: exercices
---

<!-- Banque : SELECT, *, DISTINCT, AS (cours p. 79, application 14 II p. 94-95) -->

::: sql si-c1-ch4-b-sel-01
ref: 79 | Chap. 4 · I. A. Le SELECT | L’instruction SELECT permet la projection
niveau: 1
base: ladore
== question
Affiche le **Libelle** et le **PV_TTC** de tous les articles.
== solution
SELECT Libelle, PV_TTC FROM Article;
== explication
Deux colonnes, séparées par une virgule, depuis une seule table. Pas de WHERE : toutes les lignes.
:::

::: sql si-c1-ch4-b-sel-02
ref: 79 | Chap. 4 · I. A. Le SELECT | L’instruction SELECT permet la projection
niveau: 1
base: ladore
== question
Affiche **Nom, Prenom, Ville** de tous les clients.
== solution
SELECT Nom, Prenom, Ville FROM Client;
== explication
La projection garde seulement les colonnes demandées, dans l’ordre demandé.
:::

::: sql si-c1-ch4-b-sel-03
ref: 94 | Chap. 4 · Application no 14 — II. A. | signifie que tous les champs de la table article sont projetés
niveau: 1
base: ladore
== question
Affiche **tous les champs** de la table FACTURE.
== solution
SELECT * FROM Facture;
== explication
`*` projette tous les champs de la table.
:::

::: sql si-c1-ch4-b-sel-04
ref: 79 | Chap. 4 · I. A. Le SELECT | Si l’on souhaite éliminer les doublons
niveau: 1
base: ladore
== question
Affiche la liste des **villes** des clients, **sans doublon**.
== solution
SELECT DISTINCT Ville FROM Client;
== explication
Plusieurs clients habitent la même ville : DISTINCT ne garde chaque ville qu’une fois.
:::

::: sql si-c1-ch4-b-sel-05
ref: 79 | Chap. 4 · I. A. Le SELECT | Si l’on souhaite éliminer les doublons
niveau: 1
base: ladore
== question
Affiche les **marques** d’articles, sans doublon.
== solution
SELECT DISTINCT Marque FROM Article;
== explication
DISTINCT supprime les doublons : chaque marque n’apparaît qu’une fois.
:::

::: sql si-c1-ch4-b-sel-06
ref: 79 | Chap. 4 · I. A. Le SELECT | L’instruction AS permet d’attribuer un nouveau nom
niveau: 1
base: ladore
== question
Affiche le **Libelle** des articles sous le titre (alias) **Produit**.
== solution
SELECT Libelle AS Produit FROM Article;
== explication
AS donne un nouveau nom à la colonne affichée : c’est un alias. (L’appli compare les valeurs, mais prends l’habitude d’écrire l’alias demandé.)
:::

::: sql si-c1-ch4-b-sel-07
ref: 95 | Chap. 4 · Application no 14 — II. C. | il faut utiliser la clause DISTINCT pour supprimer les doublons
niveau: 2
base: ladore
== question
Affiche les **numéros d’articles** qui apparaissent dans au moins une ligne de facture (table LIGNE), **sans doublon**.
== solution
SELECT DISTINCT NumArticle FROM LIGNE;
== explication
NumArticle est une clé étrangère dans LIGNE : un même article peut y figurer plusieurs fois, d’où DISTINCT.
:::

::: sql si-c1-ch4-b-sel-08
ref: 79 | Chap. 4 · I. A. Le SELECT | L’instruction SELECT permet la projection
niveau: 1
base: profs
== question
Affiche le **nom** et le **prénom** de tous les professeurs.
== solution
SELECT NomProf, PrenomProf FROM PROFESSEUR;
== explication
Simple projection de deux colonnes.
:::

::: sql si-c1-ch4-b-sel-09
ref: 79 | Chap. 4 · I. A. Le SELECT | Si l’on souhaite éliminer les doublons
niveau: 1
base: profs
== question
Dans quelles **villes** habitent les professeurs ? (chaque ville une seule fois)
== solution
SELECT DISTINCT Ville FROM PROFESSEUR;
== explication
Trois professeurs habitent Paris : sans DISTINCT, Paris apparaîtrait trois fois.
:::

::: sql si-c1-ch4-b-sel-10
ref: 79 | Chap. 4 · I. A. Le SELECT | L’instruction SELECT permet la projection
niveau: 1
base: basile
== question
BASILE : affiche le **libelle** de tous les domaines.
== solution
SELECT libelle FROM DOMAINE;
== explication
Une colonne, une table, pas de condition.
:::

::: sql si-c1-ch4-b-sel-11
ref: 79 | Chap. 4 · I. A. Le SELECT | L’instruction SELECT permet la projection
niveau: 1
base: basile
== question
BASILE : affiche **raisonSociale** et **ville** de tous les recruteurs.
== solution
SELECT raisonSociale, ville FROM RECRUTEUR;
== explication
Projection de deux colonnes de RECRUTEUR.
:::

::: sql si-c1-ch4-b-sel-12
ref: 79 | Chap. 4 · I. A. Le SELECT | Si l’on souhaite éliminer les doublons
niveau: 2
base: basile
== question
BASILE : quels **candidats** (NumCand) ont reçu au moins une proposition ? Sans doublon.
== solution
SELECT DISTINCT NumCand FROM PROPOSER;
== explication
Un candidat peut recevoir plusieurs propositions : son numéro apparaît plusieurs fois dans PROPOSER, d’où DISTINCT.
:::

::: sql si-c1-ch4-b-sel-13
ref: 79 | Chap. 4 · I. A. Le SELECT | Si l’on souhaite éliminer les doublons
niveau: 2
base: appels
== question
Quels **logiciels** (CodeLog) ont fait l’objet d’au moins un appel ? Sans doublon.
== solution
SELECT DISTINCT CodeLog FROM APPEL;
== explication
CodeLog est une clé étrangère dans APPEL : DISTINCT enlève les répétitions.
:::

::: sql si-c1-ch4-b-sel-14
ref: 79 | Chap. 4 · I. A. Le SELECT | L’instruction SELECT permet la projection
niveau: 1
base: etudiants
== question
Affiche **Nom** et **Prenom** de tous les étudiants.
== solution
SELECT Nom, Prenom FROM ETUDIANT;
== explication
Projection de deux colonnes.
:::

::: sql si-c1-ch4-b-sel-15
ref: 79 | Chap. 4 · I. A. Le SELECT | L’instruction AS permet d’attribuer un nouveau nom
niveau: 1
base: appels
== question
Affiche **NomTech** sous l’alias **Technicien** et **PrenomTech** sous l’alias **Prenom**.
== solution
SELECT NomTech AS Technicien, PrenomTech AS Prenom FROM TECHNICIEN;
== explication
Chaque colonne peut recevoir son propre alias avec AS.
:::

::: qcm si-c1-ch4-b-sel-16
ref: 79 | Chap. 4 · I. A. Le SELECT | L’instruction SELECT permet la projection
niveau: 1
== question
La **projection** (SELECT) réduit…
== choix
- [x] le nombre de colonnes
- [ ] le nombre de lignes
- [ ] le nombre de tables
- [ ] la taille de la base
== explication
La projection réduit le nombre de **colonnes** d’une relation. C’est la restriction (WHERE) qui réduit les lignes.
:::

::: qcm si-c1-ch4-b-sel-17
ref: 79 | Chap. 4 · I. A. Le SELECT | Si l’on souhaite éliminer les doublons
niveau: 1
== question
À quoi sert **DISTINCT** ?
== choix
- [ ] À trier le résultat
- [x] À éliminer les doublons
- [ ] À renommer une colonne
- [ ] À compter les lignes
== explication
DISTINCT élimine les doublons du résultat.
:::

::: qcm si-c1-ch4-b-sel-18
ref: 79 | Chap. 4 · I. A. Le SELECT | L’instruction AS permet d’attribuer un nouveau nom
niveau: 1
== question
Dans `SELECT Nom AS Client FROM CLIENT;`, « Client » est…
== choix
- [ ] une table
- [x] un alias : le nouveau nom de la colonne affichée
- [ ] une condition
- [ ] une valeur
== explication
AS attribue un nouveau nom à l’attribut projeté : on parle d’alias.
:::

::: qcm si-c1-ch4-b-sel-19
ref: 94 | Chap. 4 · Application no 14 — II. A. | signifie que tous les champs de la table article sont projetés
niveau: 1
== question
Que fait `SELECT * FROM Article;` ?
== choix
- [ ] Compte les articles
- [x] Affiche tous les champs de tous les articles
- [ ] Affiche les articles en double
- [ ] Supprime les articles
== explication
`*` signifie que tous les champs de la table sont projetés ; sans WHERE, toutes les lignes sont gardées.
:::

::: ordre si-c1-ch4-b-sel-20
ref: 79 | Chap. 4 · I. A. Le SELECT | SELECT DISTINCT attribut2 AS Alias1
niveau: 1
== question
Remets dans l’ordre : les marques sans doublon, sous le titre Marques.
== ordre
SELECT
DISTINCT
Marque
AS Marques
FROM
Article
;
== explication
DISTINCT se place juste après SELECT, l’alias juste après la colonne.
:::

::: ordre si-c1-ch4-b-sel-21
ref: 79 | Chap. 4 · I. A. Le SELECT | L’instruction SELECT permet la projection
niveau: 1
== question
Remets dans l’ordre (attention, il y a un intrus).
== ordre
SELECT
Nom, Prenom
FROM
Client
;
== intrus
WHERE
== explication
Pas de condition demandée : pas de WHERE.
:::

::: trous si-c1-ch4-b-sel-22
ref: 79 | Chap. 4 · I. A. Le SELECT | L’instruction SELECT permet la projection
niveau: 1
== question
Complète la requête qui affiche toutes les colonnes de la table FACTURE.
== texte
{0} {1} {2} Facture;
== reponses
SELECT
*
FROM
== intrus
WHERE
DISTINCT
== explication
`SELECT * FROM Facture;`
:::

::: corrige si-c1-ch4-b-sel-23
ref: 95 | Chap. 4 · Application no 14 — II. C. | il faut utiliser la clause DISTINCT pour supprimer les doublons
niveau: 2
== question
Explique en une phrase pourquoi `SELECT NumClient FROM Facture;` peut afficher plusieurs fois le même numéro, et corrige la requête.
== solution
NumClient est une clé étrangère dans FACTURE : un client qui a plusieurs factures y figure plusieurs fois.
SELECT DISTINCT NumClient FROM Facture;
== explication
Une clé étrangère peut se répéter (un père a plusieurs fils) ; DISTINCT supprime les doublons.
:::
