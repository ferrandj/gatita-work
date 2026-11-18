---
id: si-c1-ch4-l14b
title: Du résultat à la requête
summary: Retrouver le besoin et la requête à partir d’un tableau de résultat (exercice fréquent à l’examen).
---

::: cours Le chemin inverse
ref: 78 | Chap. 4 · I. attention | reconstituer la nature du

À l’examen, on te demande parfois l’inverse : à partir d’un **résultat** de requête, reconstituer **le besoin** et **la requête SQL**.

La méthode :

1. les **colonnes** du résultat → le **SELECT** ;
2. ce que les lignes ont **en commun** (même ville, prix élevés…) → le **WHERE** ;
3. des lignes **regroupées** avec un total ou un nombre → **GROUP BY** + agrégat ;
4. des lignes **rangées** dans un ordre → **ORDER BY**.
:::

::: qcm si-c1-ch4-l14b-e1
ref: 77 | Chap. 4 · I. Les requêtes : syntaxe de base | raisonnement en trois temps
niveau: 2
== question
Résultat obtenu sur la table PROFESSEUR :

| NomProf | PrenomProf | Ville |
|---|---|---|
| Bambou | Ken | Nanterre |
| Marlaud | Christian | Noisy-le-Sec |
| Moreau | Charles | Neuilly |

Quel était le besoin ?
== choix
- [ ] Tous les professeurs
- [x] Les professeurs qui habitent hors de Paris
- [ ] Les professeurs qui habitent Paris
- [ ] Les professeurs triés par ville
== explication
C’est l’exemple du cours : `WHERE Ville <> "Paris"`.
:::

::: qcm si-c1-ch4-l14b-e2
ref: 87 | Chap. 4 · II. C. Les agrégats | On parle à ce sujet d’agrégats
niveau: 2
== question
Résultat : **une seule ligne**, une seule colonne `Nb_Clients` = 8. Quelle requête ?
== choix
- [ ] `SELECT NumClient FROM Client;`
- [x] `SELECT COUNT(*) AS Nb_Clients FROM Client;`
- [ ] `SELECT SUM(NumClient) AS Nb_Clients FROM Client;`
- [ ] `SELECT DISTINCT Nb_Clients FROM Client;`
== explication
Un seul nombre qui **compte** des lignes : COUNT(*), avec l’alias Nb_Clients.
:::

::: qcm si-c1-ch4-l14b-e3
ref: 88 | Chap. 4 · II. D. Le regroupement — règles d’écriture | Toutes les colonnes projetées
niveau: 3
== question
Résultat :

| Ville | NbClients |
|---|---|
| Lyon | 2 |
| Paris | 3 |
| … | … |

Quelle clause est forcément présente ?
== choix
- [ ] ORDER BY Ville DESC
- [x] GROUP BY Ville
- [ ] HAVING COUNT(*) > 1
- [ ] WHERE Ville = "Paris"
== explication
Un nombre **par ville** : regroupement sur Ville, donc GROUP BY Ville (avec COUNT(*)).
:::

::: qcm si-c1-ch4-l14b-e4
ref: 99 | Chap. 4 · Application no 14 — V. B. | DESC est obligatoire puisque, par défaut, le tri est ASC
niveau: 2
== question
Résultat : les articles avec leur prix, du plus cher (4 100) au moins cher (5). Qu’y a-t-il à la fin de la requête ?
== choix
- [ ] ORDER BY PV_TTC
- [ ] ORDER BY PV_TTC ASC
- [x] ORDER BY PV_TTC DESC
- [ ] GROUP BY PV_TTC
== explication
Du plus grand au plus petit = décroissant : DESC est obligatoire.
:::

::: qcm si-c1-ch4-l14b-e5
ref: 84 | Chap. 4 · II. A. 2. b. LEFT JOIN | On récupère toute la table de gauche
niveau: 3
== question
Résultat : tous les étudiants avec le numéro des devoirs passés ; certains ont **NULL** dans NumDev. Quelle jointure a été utilisée ?
== choix
- [ ] INNER JOIN
- [x] LEFT JOIN (ETUDIANT à gauche)
- [ ] Aucune
- [ ] une sous-requête NOT IN
== explication
Des lignes **sans correspondance** apparaissent avec NULL : c’est un LEFT JOIN qui garde toute la table de gauche.
:::
