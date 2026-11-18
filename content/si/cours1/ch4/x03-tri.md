---
type: exercices
---

<!-- Banque : ORDER BY (cours p. 88, application 14 V p. 98-99) -->

::: sql si-c1-ch4-b-tri-01
ref: 88 | Chap. 4 · II. E. Le tri | Il est possible d’ordonner les listes de réponses
niveau: 1
base: ladore
ordonne: oui
== question
Articles (**Libelle, PV_TTC**) du **moins cher au plus cher**.
== solution
SELECT Libelle, PV_TTC FROM Article ORDER BY PV_TTC;
== explication
Tri croissant : c’est le tri par défaut (ASC facultatif).
:::

::: sql si-c1-ch4-b-tri-02
ref: 99 | Chap. 4 · Application no 14 — V. B. | DESC est obligatoire puisque, par défaut, le tri est ASC
niveau: 1
base: ladore
ordonne: oui
== question
Clients (**Nom, Date_Creation**) du **plus récent au plus ancien**.
== solution
SELECT Nom, Date_Creation FROM Client ORDER BY Date_Creation DESC;
== explication
Plus récent d’abord = date la plus grande d’abord = décroissant (DESC).
:::

::: sql si-c1-ch4-b-tri-03
ref: 99 | Chap. 4 · Application no 14 — V. A. | Le tri s’effectue d’abord sur le nom, puis sur le prénom
niveau: 2
base: ladore
ordonne: oui
== question
Clients (**Ville, Nom**) triés **par ville**, puis **par nom** dans chaque ville (ordre alphabétique).
== solution
SELECT Ville, Nom FROM Client ORDER BY Ville, Nom;
== explication
Le tri se fait d’abord sur la première colonne citée, puis sur la suivante.
:::

::: sql si-c1-ch4-b-tri-04
ref: 88 | Chap. 4 · II. E. Le tri | ORDER BY attribut1 ASC, attribut2 DESC
niveau: 2
base: ladore
ordonne: oui
== question
Articles (**Marque, Libelle, PV_TTC**) triés par **marque** (A→Z), puis du **plus cher au moins cher** dans chaque marque.
== solution
SELECT Marque, Libelle, PV_TTC FROM Article ORDER BY Marque ASC, PV_TTC DESC;
== explication
Chaque colonne du ORDER BY a son propre sens : ASC pour la marque, DESC pour le prix.
:::

::: sql si-c1-ch4-b-tri-05
ref: 88 | Chap. 4 · II. E. Le tri | Il est possible d’ordonner les listes de réponses
niveau: 2
base: ladore
ordonne: oui
== question
Articles **de plus de 1 000 €** (**Libelle, PV_TTC**), du plus cher au moins cher.
== solution
SELECT Libelle, PV_TTC FROM Article WHERE PV_TTC > 1000 ORDER BY PV_TTC DESC;
== explication
WHERE d’abord, ORDER BY à la fin.
:::

::: sql si-c1-ch4-b-tri-06
ref: 99 | Chap. 4 · Application no 14 — V. A. | Le tri s’effectue d’abord sur le nom, puis sur le prénom
niveau: 1
base: etudiants
ordonne: oui
== question
Étudiants (**Nom, Prenom**) par ordre alphabétique de nom.
== solution
SELECT Nom, Prenom FROM ETUDIANT ORDER BY Nom;
== explication
Ordre alphabétique = croissant.
:::

::: sql si-c1-ch4-b-tri-07
ref: 99 | Chap. 4 · Application no 14 — V. B. | DESC est obligatoire puisque, par défaut, le tri est ASC
niveau: 1
base: etudiants
ordonne: oui
== question
Lignes de PASSER (**Code, NumDev, Note**) de la **meilleure note à la moins bonne**.
== solution
SELECT Code, NumDev, Note FROM PASSER ORDER BY Note DESC;
== explication
Meilleure d’abord = décroissant.
:::

::: sql si-c1-ch4-b-tri-08
ref: 88 | Chap. 4 · II. E. Le tri | Il est possible d’ordonner les listes de réponses
niveau: 2
base: basile
ordonne: oui
== question
BASILE : missions (**intitule, tarifHoraire**) du **mieux payé** au **moins bien payé**.
== solution
SELECT intitule, tarifHoraire FROM MISSION ORDER BY tarifHoraire DESC;
== explication
Du plus grand au plus petit : DESC.
:::

::: sql si-c1-ch4-b-tri-09
ref: 99 | Chap. 4 · Application no 14 — V. C. | Une date est un nombre de jours depuis le 1er janvier 1900
niveau: 1
base: employes
ordonne: oui
== question
Employés (**Nom, DateEmbauche**) par **ancienneté** (du plus ancien au plus récent).
== solution
SELECT Nom, DateEmbauche FROM Employes ORDER BY DateEmbauche ASC;
== explication
La date la plus ancienne est la plus petite : tri croissant.
:::

::: sql si-c1-ch4-b-tri-10
ref: 88 | Chap. 4 · II. E. Le tri | Il est possible d’ordonner les listes de réponses
niveau: 2
base: appels
ordonne: oui
== question
Appels (**NumAppel, DateAppel, Heure**) triés par date puis par heure.
== solution
SELECT NumAppel, DateAppel, Heure FROM APPEL ORDER BY DateAppel, Heure;
== explication
Deux critères : d’abord la date, puis l’heure à date égale.
:::

::: qcm si-c1-ch4-b-tri-11
ref: 88 | Chap. 4 · II. E. Le tri | Par défaut, un tri sera toujours croissant
niveau: 1
== question
Sans ASC ni DESC, `ORDER BY Nom` trie…
== choix
- [x] par ordre croissant (A→Z)
- [ ] par ordre décroissant (Z→A)
- [ ] au hasard
- [ ] dans l’ordre de saisie
== explication
Par défaut, un tri est toujours croissant.
:::

::: qcm si-c1-ch4-b-tri-12
ref: 88 | Chap. 4 · II. E. Le tri | Il est possible d’ordonner les listes de réponses
niveau: 1
== question
Où se place ORDER BY dans une requête ?
== choix
- [ ] Juste après SELECT
- [ ] Entre FROM et WHERE
- [x] À la fin
- [ ] Avant le SELECT
== explication
ORDER BY est la dernière clause (après WHERE, GROUP BY et HAVING).
:::

::: qcm si-c1-ch4-b-tri-13
ref: 99 | Chap. 4 · Application no 14 — V. A. | Le tri s’effectue d’abord sur le nom, puis sur le prénom
niveau: 2
== question
`ORDER BY Nom, Prenom` : que se passe-t-il pour deux clients qui ont le **même nom** ?
== choix
- [x] Ils sont départagés par leur prénom
- [ ] Un seul est affiché
- [ ] Ils sont départagés au hasard
- [ ] Erreur
== explication
Le tri s’applique d’abord sur le nom, puis sur le prénom (de gauche à droite).
:::

::: ordre si-c1-ch4-b-tri-14
ref: 88 | Chap. 4 · II. E. Le tri | ORDER BY attribut1 ASC, attribut2 DESC
niveau: 1
== question
Remets dans l’ordre : les clients de Lyon par ordre alphabétique.
== ordre
SELECT
Nom
FROM
Client
WHERE
Ville = "Lyon"
ORDER BY
Nom
;
== explication
SELECT → FROM → WHERE → ORDER BY.
:::

::: trous si-c1-ch4-b-tri-15
ref: 99 | Chap. 4 · Application no 14 — V. B. | DESC est obligatoire puisque, par défaut, le tri est ASC
niveau: 1
== question
Complète : les articles du plus cher au moins cher.
== texte
SELECT Libelle FROM Article {0} PV_TTC {1};
== reponses
ORDER BY
DESC
== intrus
GROUP BY
ASC
== explication
Décroissant : DESC, obligatoire.
:::
