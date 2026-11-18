---
type: exercices
---

::: sql si-c1-ch4-x1
ref: 129 | Exercices autocorrigés · Exercice 3 — corrigé 1 | Quelles sont les offres de missions (identifiant et intitulé) concernant la restauration
niveau: 2
base: basile
== question
BASILE · Q1. Quelles sont les offres de missions (**IdMission, intitule**) concernant la **restauration** ?
== solution
SELECT IdMission, intitule
FROM MISSION, DOMAINE
WHERE libelle = "Restauration"
AND MISSION.NumDom = DOMAINE.NumDom;
== explication
Le nom du domaine est dans DOMAINE (colonne **libelle**), la mission dans MISSION : une jointure sur NumDom. (Le corrigé du cours écrit `Intitule = "Restauration"` : c’est le **libelle** du domaine qu’il faut tester.)
:::

::: sql si-c1-ch4-x2
ref: 129 | Exercices autocorrigés · Exercice 3 — corrigé 2 | Quel est le nombre de missions proposées par candidat
niveau: 2
base: basile
== question
BASILE · Q2. Nombre de missions proposées **par candidat** : affiche **Nombre, NumCand, nom, prenom**.
== solution
SELECT COUNT(IdMission) AS Nombre, CANDIDAT.NumCand, nom, prenom
FROM PROPOSER, CANDIDAT
WHERE PROPOSER.NumCand = CANDIDAT.NumCand
GROUP BY CANDIDAT.NumCand, nom, prenom;
== explication
« Par candidat » → GROUP BY sur les colonnes du candidat ; COUNT compte ses propositions. (Le corrigé écrit `FROM PROPOSITION` : la table s’appelle PROPOSER.)
:::

::: sql si-c1-ch4-x3
ref: 129 | Exercices autocorrigés · Exercice 3 — corrigé 3 | susceptibles
niveau: 3
base: basile
== question
BASILE · Q3. Candidats (**NumCand, nom, prenom, numPortable**) susceptibles d’être intéressés par l’offre **16787**, car son domaine fait partie de leurs préférences.
== solution
SELECT CANDIDAT.NumCand, nom, prenom, numPortable
FROM CANDIDAT, PREFERER, MISSION
WHERE IdMission = 16787
AND CANDIDAT.NumCand = PREFERER.NumCand
AND PREFERER.NumDom = MISSION.NumDom;
== explication
On relie CANDIDAT → PREFERER (ses domaines préférés) → MISSION (le domaine de l’offre). Le corrigé du cours passe aussi par DOMAINE, ce qui donne le même résultat. (Il écrit « Telephone » : la colonne est numPortable.)
:::

::: sql si-c1-ch4-x4
ref: 129 | Exercices autocorrigés · Exercice 3 — corrigé 4 | Le recours aux alias est facultatif
niveau: 3
base: basile
ordonne: oui
== question
BASILE · Q4. Pour chaque candidat (**NumCand, nom**) : le **nombre de fichiers** et le **total de mémoire** (Mo), triés du plus gros au plus petit, **seulement si** le total dépasse **50 Mo**.
== solution
SELECT CANDIDAT.NumCand, CANDIDAT.nom, COUNT(NumFic) AS nombre, SUM(TailleMemoire) AS memoire
FROM FICHIER, CANDIDAT
WHERE FICHIER.NumCand = CANDIDAT.NumCand
GROUP BY CANDIDAT.NumCand, CANDIDAT.nom
HAVING SUM(TailleMemoire) > 50
ORDER BY memoire DESC;
== explication
GROUP BY par candidat, HAVING sur le total (fonction), ORDER BY … DESC à la fin. Les alias facilitent l’écriture des restrictions. Attention : FICHIER a aussi une colonne Nom (le nom du fichier), il faut donc écrire CANDIDAT.nom.
:::

::: sql si-c1-ch4-x5
ref: 130 | Exercices autocorrigés · Exercice 3 — corrigé 5 | On traduit l’écart d’une semaine de cette façon
niveau: 3
base: basile
== question
BASILE · Q5. On est le **15/05/2019**. Propositions (**IdMission, DateProposition**) de **plus d’une semaine** et **sans réponse**.
== solution
SELECT IdMission, DateProposition
FROM PROPOSER
WHERE DateProposition < #08/05/2019#
AND Reponse IS NULL;
== explication
Plus d’une semaine avant le 15/05 → avant le 08/05/2019. Sans réponse → IS NULL. (Le corrigé joint aussi MISSION, ce qui n’est pas nécessaire ici.)
:::

::: sql si-c1-ch4-x6
ref: 130 | Exercices autocorrigés · Exercice 3 — corrigé 6 | TempsTrajetMax >60
niveau: 3
base: basile
== question
BASILE · Q6. Candidats (**NumCand, nom, prenom**) qui acceptent un temps de trajet **supérieur à 1 heure** (tempsTrajetMax en minutes) et intéressés par le **nettoyage**.
== solution
SELECT CANDIDAT.NumCand, nom, prenom
FROM CANDIDAT, DOMAINE, PREFERER
WHERE tempsTrajetMax > 60
AND libelle = "Nettoyage"
AND CANDIDAT.NumCand = PREFERER.NumCand
AND PREFERER.NumDom = DOMAINE.NumDom;
== explication
1 heure = 60 minutes. Le domaine préféré passe par PREFERER puis DOMAINE (2 jointures pour 3 tables).
:::

::: sql si-c1-ch4-x7
ref: 130 | Exercices autocorrigés · Exercice 3 — corrigé 7 | WHERE CodeRec NOT IN
niveau: 3
base: basile
== question
BASILE · Q7. Recruteurs (**CodeRec, raisonSociale, nomResp**) qui **n’ont pas** proposé d’offres **depuis le 01/01/2019**.
== solution
SELECT CodeRec, raisonSociale, nomResp
FROM RECRUTEUR
WHERE CodeRec NOT IN (SELECT CodeRec
  FROM MISSION
  WHERE dateDepot > #01/01/2019#);
== explication
Une absence → sous-requête avec NOT IN : on retire ceux qui ont déposé une mission depuis le 01/01/2019.
:::

::: sql si-c1-ch4-x8
ref: 130 | Exercices autocorrigés · Exercice 3 — corrigé 8 | UPDATE PROPOSER SET reponse
niveau: 2
base: basile
== question
BASILE · Q8. Pour la proposition de mission **1244**, le candidat **5766** vient d’indiquer qu’il est **intéressé** (réponse « O »). Traduis cette modification.
== solution
UPDATE PROPOSER SET Reponse = "O"
WHERE NumCand = 5766
AND IdMission = 1244;
== verification
SELECT IdMission, NumCand, Reponse FROM PROPOSER ORDER BY IdMission, NumCand;
== explication
Une modification → UPDATE … SET … WHERE, en ciblant la proposition par ses deux clés.
:::

::: corrige si-c1-ch4-x9
ref: 107 | Chap. 4 · Exercice 2 Association réflexive — corrigé | WHERE NumAtelier IS NOT NULL
niveau: 2
== question
Exercice 2 (association réflexive). Les personnels administratifs n’ont pas d’atelier : leur clé étrangère **NumAtelier** est vide. Écris la requête qui liste **tout le personnel** (tous les champs) **affecté dans un atelier**.
== solution
SELECT *
FROM Personnel
WHERE NumAtelier IS NOT NULL;
== explication
Un personnel d’atelier a sa clé étrangère NumAtelier renseignée : IS NOT NULL. Pour les administratifs, ce serait IS NULL.
:::

::: corrige si-c1-ch4-x10
ref: 107 | Chap. 4 · Exercice 2 Association réflexive — corrigé | la difficulté porte sur le choix de la jointure
niveau: 3
== question
Exercice 2. Liste des **responsables d’atelier** (Titre, Nom, Prénom) **par ordre alphabétique**. ATELIER contient la clé étrangère **#NumMatricule** de son responsable.
== solution
SELECT Titre, Nom, Prenom
FROM PERSONNEL, ATELIER
WHERE Personnel.NumMatricule = Atelier.NumMatricule
ORDER BY Nom, Prenom;
== explication
La difficulté porte sur le choix de la jointure : c’est la clé étrangère **NumMatricule dans ATELIER** qui désigne le responsable, la jointure se fait donc sur ce champ (et pas sur NumAtelier).
:::

::: corrige si-c1-ch4-x11
ref: 107 | Chap. 4 · Exercice 2 Association réflexive — corrigé | Nombre total d’heures travaillées en octobre 2019
niveau: 3
== question
Exercice 2. **Nombre total d’heures** travaillées en « **octobre 2019** ». Les heures (H_mens) sont dans TRAVAILLER(#NumMatricule, #NumMois, H_mens), le nom du mois dans MOIS(NumMois, Nom_Mois…).
== solution
SELECT SUM(H_mens) AS [nombre total d’heures travaillées en octobre 2019]
FROM Travailler, Mois
WHERE Travailler.NumMois = Mois.NumMois
AND Nom_Mois = "octobre 2019";
== explication
Un total → SUM ; la condition sur le mois demande la jointure TRAVAILLER–MOIS.
:::

::: qcm si-c1-ch4-x12
ref: 78 | Chap. 4 · I. attention | reconstituer la nature du
niveau: 2
== question
À partir d’un **résultat** de requête, le candidat doit parfois…
== choix
- [ ] recopier le résultat
- [x] reconstituer le besoin en information et la syntaxe SQL associée
- [ ] calculer la moyenne
- [ ] dessiner le MCD
== explication
Parfois, à partir d’un résultat concret de requête, le candidat doit **reconstituer la nature du besoin** et la syntaxe SQL.
:::

::: sql si-c1-ch4-x13
ref: 101 | Chap. 4 · Application no 14 — VII. A. 9. | Quel est le montant moyen de prix de vente des articles
niveau: 2
base: ladore
== question
Quel est le **prix moyen** des articles ? (alias **PV_moyen**)
== solution
SELECT AVG(Article.PV_TTC) AS PV_moyen
FROM Article;
== explication
AVG calcule la moyenne d’un attribut numérique.
:::

::: sql si-c1-ch4-x14
ref: 98 | Chap. 4 · Application no 14 — IV. D. | achetés par les clients
niveau: 3
base: ladore
== question
Articles achetés par les clients : **NumArticle, Libelle, Quantite, PV_TTC, Nom, Prenom, CP** (4 tables).
== solution
SELECT Article.NumArticle, Article.Libelle, LIGNE.Quantite, Article.PV_TTC, Client.Nom, Client.Prenom, Client.CP
FROM Client, Facture, LIGNE, Article
WHERE Client.NumClient = Facture.NumClient
AND Facture.NumFacture = LIGNE.NumFacture
AND LIGNE.NumArticle = Article.NumArticle;
== explication
4 tables → 3 jointures : CLIENT–FACTURE, FACTURE–LIGNE, LIGNE–ARTICLE.
:::

::: sql si-c1-ch4-x15
ref: 103 | Chap. 4 · Application no 14 — VIII. B. | qui n’ont rien acheté depuis 3 ans
niveau: 3
base: ladore
== question
Clients (**NumClient, Nom, Prenom**) qui n’ont **rien acheté depuis le 01/01/2020** (aucune facture après cette date).
== solution
SELECT NumClient, Nom, Prenom
FROM Client
WHERE NumClient NOT IN (SELECT Facture.NumClient
  FROM Facture
  WHERE Date_Facture > #01/01/2020#);
== explication
On enlève de la table CLIENT ceux qui ont acheté depuis le 01/01/2020 (résultat de la sous-requête). Le cours fait la même chose avec « depuis 3 ans » : `YEAR(Date_Facture) > YEAR(NOW()) - 3`.
:::
