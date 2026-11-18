---
type: exercices
---

<!-- Banque : sous-requêtes IN / NOT IN / = (cours p. 89-90, application 14 VIII p. 103-104) -->

::: sql si-c1-ch4-b-sub-01
ref: 89 | Chap. 4 · II. F. Les requêtes imbriquées ou sous-requêtes | Une requête imbriquée consiste à inclure une requête dans une autre requête
niveau: 2
base: ladore
== question
Avec une **sous-requête IN** : clients (**Nom, Prenom**) qui ont **au moins une facture**.
== solution
SELECT Nom, Prenom FROM Client
WHERE NumClient IN (SELECT NumClient FROM Facture);
== explication
La sous-requête renvoie la liste des NumClient présents dans FACTURE ; IN garde les clients de cette liste.
:::

::: sql si-c1-ch4-b-sub-02
ref: 89 | Chap. 4 · II. F. Les requêtes imbriquées ou sous-requêtes | repérer les absences de comporte
niveau: 2
base: ladore
== question
Avec **NOT IN** : clients (**Nom, Prenom**) qui n’ont **aucune facture**.
== solution
SELECT Nom, Prenom FROM Client
WHERE NumClient NOT IN (SELECT NumClient FROM Facture);
== explication
Les sous-requêtes permettent de repérer les **absences** : on retire ceux qui sont dans FACTURE.
:::

::: sql si-c1-ch4-b-sub-03
ref: 103 | Chap. 4 · Application no 14 — VIII. A. | Liste des articles (NumArticle, Libelle, PV_TTC) non vendus en 2019
niveau: 2
base: ladore
== question
Articles (**NumArticle, Libelle**) **jamais vendus** (absents de LIGNE).
== solution
SELECT NumArticle, Libelle FROM Article
WHERE NumArticle NOT IN (SELECT NumArticle FROM LIGNE);
== explication
NOT IN : les articles dont le numéro ne figure pas dans la liste des articles vendus.
:::

::: sql si-c1-ch4-b-sub-04
ref: 89 | Chap. 4 · II. F. Les requêtes imbriquées ou sous-requêtes | Une requête imbriquée consiste à inclure une requête dans une autre requête
niveau: 2
base: ladore
== question
Articles (**NumArticle, Libelle**) vendus **au moins une fois en 2020**.
== solution
SELECT NumArticle, Libelle FROM Article
WHERE NumArticle IN (SELECT LIGNE.NumArticle FROM LIGNE, Facture
  WHERE LIGNE.NumFacture = Facture.NumFacture
  AND YEAR(Facture.Date_Facture) = 2020);
== explication
La sous-requête (avec sa propre jointure) liste les articles facturés en 2020.
:::

::: sql si-c1-ch4-b-sub-05
ref: 104 | Chap. 4 · Application no 14 — VIII. C. | Il faut ici comparer le prix de tous les articles avec le prix le plus grand
niveau: 2
base: ladore
== question
Article(s) **le(s) plus cher(s)** : **NumArticle, Libelle, PV_TTC**.
== solution
SELECT NumArticle, Libelle, PV_TTC FROM Article
WHERE PV_TTC = (SELECT MAX(PV_TTC) FROM Article);
== explication
La sous-requête renvoie une seule valeur (le MAX) : on compare avec `=`.
:::

::: sql si-c1-ch4-b-sub-06
ref: 104 | Chap. 4 · Application no 14 — VIII. C. | Il faut ici comparer le prix de tous les articles avec le prix le plus grand
niveau: 3
base: ladore
== question
Articles (**Libelle, PV_TTC**) **plus chers que la moyenne** des articles.
== solution
SELECT Libelle, PV_TTC FROM Article
WHERE PV_TTC > (SELECT AVG(PV_TTC) FROM Article);
== explication
Sous-requête à une valeur (AVG) avec l’opérateur `>`.
:::

::: sql si-c1-ch4-b-sub-07
ref: 104 | Chap. 4 · Application no 14 — VIII. C. | Il faut ici comparer le prix de tous les articles avec le prix le plus grand
niveau: 2
base: ladore
== question
Client(s) **le(s) plus récent(s)** (date de création maximale) : **Nom, Date_Creation**.
== solution
SELECT Nom, Date_Creation FROM Client
WHERE Date_Creation = (SELECT MAX(Date_Creation) FROM Client);
== explication
Comparer chaque date à la date maximale.
:::

::: sql si-c1-ch4-b-sub-08
ref: 103 | Chap. 4 · Application no 14 — VIII. B. | qui n’ont rien acheté depuis 3 ans
niveau: 3
base: ladore
== question
Clients (**Nom**) qui n’ont **rien acheté en 2019**.
== solution
SELECT Nom FROM Client
WHERE NumClient NOT IN (SELECT NumClient FROM Facture WHERE YEAR(Date_Facture) = 2019);
== explication
Ceux qui ont acheté en 2019 sont dans la sous-requête ; NOT IN garde les autres (y compris ceux qui n’ont jamais acheté).
:::

::: sql si-c1-ch4-b-sub-09
ref: 89 | Chap. 4 · II. F. Les requêtes imbriquées ou sous-requêtes | repérer les absences de comporte
niveau: 3
base: ladore
== question
Clients (**Nom**) qui n’ont **jamais acheté** d’article de la famille **ACC** (accordéons).
== solution
SELECT Nom FROM Client
WHERE NumClient NOT IN (SELECT Facture.NumClient FROM Facture, LIGNE, Article
  WHERE Facture.NumFacture = LIGNE.NumFacture
  AND LIGNE.NumArticle = Article.NumArticle
  AND Article.CodeFam = "ACC");
== explication
Une absence de comportement → NOT IN ; la sous-requête liste ceux qui **ont** acheté un accordéon.
:::

::: sql si-c1-ch4-b-sub-10
ref: 90 | Chap. 4 · II. F. Les requêtes imbriquées | Pour résoudre la question posée, seule une requête imbriquée est pertinente
niveau: 3
base: etudiants
== question
Étudiants (**Nom, Prenom**) qui n’ont **pas** passé le devoir **numéro 2**.
== solution
SELECT Nom, Prenom FROM ETUDIANT
WHERE Code NOT IN (SELECT Code FROM PASSER WHERE NumDev = 2);
== explication
La sous-requête liste ceux qui ont passé le devoir 2 ; NOT IN garde les autres.
:::

::: sql si-c1-ch4-b-sub-11
ref: 104 | Chap. 4 · Application no 14 — VIII. D. | Il faut ici comparer le prix de tous les articles avec le prix le plus petit
niveau: 2
base: etudiants
== question
Copie(s) avec **la meilleure note** : **Code, NumDev, Note**.
== solution
SELECT Code, NumDev, Note FROM PASSER
WHERE Note = (SELECT MAX(Note) FROM PASSER);
== explication
Comparaison à la valeur maximale renvoyée par la sous-requête.
:::

::: sql si-c1-ch4-b-sub-12
ref: 89 | Chap. 4 · II. F. Les requêtes imbriquées ou sous-requêtes | Une requête imbriquée consiste à inclure une requête dans une autre requête
niveau: 2
base: appels
== question
Clients (**DenomCli**) qui ont appelé pour le logiciel **PAI**.
== solution
SELECT DenomCli FROM CLIENT
WHERE NumCli IN (SELECT NumCli FROM APPEL WHERE CodeLog = "PAI");
== explication
IN avec une sous-requête filtrée.
:::

::: sql si-c1-ch4-b-sub-13
ref: 89 | Chap. 4 · II. F. Les requêtes imbriquées ou sous-requêtes | repérer les absences de comporte
niveau: 2
base: appels
== question
Logiciels (**NomLog**) pour lesquels il n’y a eu **aucun appel le 12/04/2025**.
== solution
SELECT NomLog FROM LOGICIEL
WHERE CodeLog NOT IN (SELECT CodeLog FROM APPEL WHERE DateAppel = #12/04/2025#);
== explication
NOT IN : on retire les logiciels appelés ce jour-là.
:::

::: sql si-c1-ch4-b-sub-14
ref: 90 | Chap. 4 · Application no 13 — Bibliothèque JaimeLire | Ici, le IN est obligatoire
niveau: 3
base: jaimelire
== question
JaimeLire : adhérents (**PrenAdh, NomAdh**) qui **ne sont parents de personne**.
== solution
SELECT PrenAdh, NomAdh FROM ADHERENT
WHERE NumAdh NOT IN (SELECT NumAdhParent FROM ADHERENT WHERE NumAdhParent IS NOT NULL);
== explication
NOT IN sur la liste des parents. On exclut les NULL de la sous-requête : avec une valeur NULL dans la liste, NOT IN ne renverrait rien en SQL.
:::

::: sql si-c1-ch4-b-sub-15
ref: 130 | Exercices autocorrigés · Exercice 3 — corrigé 7 | WHERE CodeRec NOT IN
niveau: 2
base: basile
== question
BASILE : recruteurs (**raisonSociale**) qui n’ont **aucune** mission.
== solution
SELECT raisonSociale FROM RECRUTEUR
WHERE CodeRec NOT IN (SELECT CodeRec FROM MISSION);
== explication
Absence → NOT IN.
:::

::: sql si-c1-ch4-b-sub-16
ref: 89 | Chap. 4 · II. F. Les requêtes imbriquées ou sous-requêtes | repérer les absences de comporte
niveau: 2
base: basile
== question
BASILE : candidats (**NumCand, nom**) qui n’ont reçu **aucune proposition**.
== solution
SELECT NumCand, nom FROM CANDIDAT
WHERE NumCand NOT IN (SELECT NumCand FROM PROPOSER);
== explication
On retire ceux qui figurent dans PROPOSER.
:::

::: sql si-c1-ch4-b-sub-17
ref: 89 | Chap. 4 · II. F. Les requêtes imbriquées ou sous-requêtes | Une requête imbriquée consiste à inclure une requête dans une autre requête
niveau: 3
base: basile
== question
BASILE : domaines (**libelle**) choisis comme préférence par **au moins un** candidat.
== solution
SELECT libelle FROM DOMAINE
WHERE NumDom IN (SELECT NumDom FROM PREFERER);
== explication
IN sur la liste des domaines présents dans PREFERER (pas besoin de DISTINCT avec IN).
:::

::: sql si-c1-ch4-b-sub-18
ref: 104 | Chap. 4 · Application no 14 — VIII. C. | Il faut ici comparer le prix de tous les articles avec le prix le plus grand
niveau: 2
base: basile
== question
BASILE : mission(s) (**intitule, tarifHoraire**) **la/les mieux payée(s)**.
== solution
SELECT intitule, tarifHoraire FROM MISSION
WHERE tarifHoraire = (SELECT MAX(tarifHoraire) FROM MISSION);
== explication
Comparaison au maximum.
:::

::: sql si-c1-ch4-b-sub-19
ref: 89 | Chap. 4 · II. F. Les requêtes imbriquées ou sous-requêtes | repérer les absences de comporte
niveau: 2
base: ventes
== question
Avec NOT IN : secteurs (**nom_zone**) sans aucun vendeur.
== solution
SELECT nom_zone FROM SECTEURS
WHERE id_secteur NOT IN (SELECT secteur_id FROM VENDEURS);
== explication
Même besoin que le LEFT JOIN … IS NULL, écrit avec une sous-requête.
:::

::: qcm si-c1-ch4-b-sub-20
ref: 89 | Chap. 4 · II. F. Les requêtes imbriquées ou sous-requêtes | Une requête imbriquée consiste à inclure une requête dans une autre requête
niveau: 1
== question
Où se place une sous-requête dans le cours ?
== choix
- [ ] Dans le SELECT
- [ ] Dans le FROM
- [x] Dans la clause WHERE, comme valeur d’une condition
- [ ] Après le ORDER BY
== explication
Une requête imbriquée est incluse comme valeur d’une condition dans une clause WHERE.
:::

::: qcm si-c1-ch4-b-sub-21
ref: 90 | Chap. 4 · Application no 13 — Bibliothèque JaimeLire | Ici, le IN est obligatoire
niveau: 2
== question
Quand peut-on utiliser `=` au lieu de `IN` devant une sous-requête ?
== choix
- [ ] Toujours
- [x] Quand la sous-requête renvoie une seule valeur (ex. un MAX)
- [ ] Jamais
- [ ] Quand il y a un ORDER BY
== explication
IN est obligatoire si la sous-requête peut renvoyer plusieurs occurrences ; avec une valeur unique (MAX, MIN…), `=` convient.
:::

::: qcm si-c1-ch4-b-sub-22
ref: 89 | Chap. 4 · II. F. Les requêtes imbriquées ou sous-requêtes | repérer les absences de comporte
niveau: 2
== question
Les sous-requêtes avec NOT IN sont particulièrement utiles pour…
== choix
- [ ] trier
- [x] repérer des absences (ceux qui n’ont PAS fait quelque chose)
- [ ] calculer des moyennes
- [ ] renommer des colonnes
== explication
Elles permettent de repérer les absences de comportement, qui par définition n’apparaissent pas dans les enregistrements.
:::

::: qcm si-c1-ch4-b-sub-23
ref: 90 | Chap. 4 · II. F. attention | Le résultat de la requête imbriquée ne doit comporter qu’un seul champ
niveau: 2
== question
Laquelle de ces sous-requêtes est **incorrecte** derrière `WHERE NumClient IN (…)` ?
== choix
- [ ] `SELECT NumClient FROM Facture`
- [x] `SELECT NumClient, Date_Facture FROM Facture`
- [ ] `SELECT NumClient FROM Facture WHERE YEAR(Date_Facture) = 2019`
- [ ] `SELECT DISTINCT NumClient FROM Facture`
== explication
Le résultat de la requête imbriquée ne doit comporter qu’un seul champ.
:::

::: ordre si-c1-ch4-b-sub-24
ref: 90 | Chap. 4 · II. F. Les requêtes imbriquées | Pour résoudre la question posée, seule une requête imbriquée est pertinente
niveau: 2
== question
Remets dans l’ordre : les clients sans facture.
== ordre
SELECT Nom
FROM Client
WHERE NumClient
NOT IN
(SELECT NumClient
FROM Facture)
;
== explication
La sous-requête entre parenthèses fournit la liste à exclure.
:::

::: trous si-c1-ch4-b-sub-25
ref: 104 | Chap. 4 · Application no 14 — VIII. D. | Il faut ici comparer le prix de tous les articles avec le prix le plus petit
niveau: 1
== question
Complète : les articles les moins chers.
== texte
SELECT Libelle FROM Article WHERE PV_TTC = (SELECT {0}(PV_TTC) {1} Article);
== reponses
MIN
FROM
== intrus
MAX
WHERE
COUNT
== explication
On compare chaque prix au plus petit prix (MIN).
:::

::: corrige si-c1-ch4-b-sub-26
ref: 89 | Chap. 4 · II. F. Version 1 (fausse) | Cette requête contient la liste des étudiants qui ont rendu un devoir
niveau: 3
== question
Un camarade propose, pour « les étudiants qui n’ont PAS rendu de devoir depuis le 01/01/2025 » :
```sql
SELECT Nom, Prenom FROM ETUDIANT, PASSER, DEVOIR
WHERE ETUDIANT.Code = PASSER.Code AND PASSER.NumDev = DEVOIR.NumDev
AND DEVOIR.Date > #01/01/2025#;
```
Que renvoie-t-elle vraiment ? Corrige-la.
== solution
Elle renvoie ceux qui ONT rendu un devoir depuis le 01/01/2025 (le contraire du besoin).
SELECT Nom, Prenom FROM ETUDIANT
WHERE Code NOT IN (SELECT PASSER.Code FROM PASSER, DEVOIR
  WHERE PASSER.NumDev = DEVOIR.NumDev
  AND DEVOIR.Date > #01/01/2025#);
== explication
C’est la « version 1 (fausse) » du cours : seule une requête imbriquée avec NOT IN répond à une question d’absence.
:::
