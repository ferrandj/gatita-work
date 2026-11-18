---
type: exercices
---

<!-- Banque : attributs calculés (p. 86, application 14 VI p. 99) et agrégats (p. 87, application 14 VII. A p. 99-101) -->

::: sql si-c1-ch4-b-agg-01
ref: 86 | Chap. 4 · II. B. Les attributs calculés | Le langage SQL autorise au niveau de l’affichage des attributs tous les calculs
niveau: 1
base: ladore
== question
Affiche **Libelle** et le prix TTC **augmenté de 10 €** (alias **Nouveau_prix**).
== solution
SELECT Libelle, PV_TTC + 10 AS Nouveau_prix FROM Article;
== explication
On peut calculer directement dans le SELECT, et nommer le calcul avec AS.
:::

::: sql si-c1-ch4-b-agg-02
ref: 86 | Chap. 4 · II. B. Les attributs calculés | Le langage SQL autorise au niveau de l’affichage des attributs tous les calculs
niveau: 1
base: ladore
== question
Affiche **Libelle**, **PV_TTC** et le prix **TTC soldé de 10 %** (alias **Prix_solde** = PV_TTC × 0.9).
== solution
SELECT Libelle, PV_TTC, PV_TTC * 0.9 AS Prix_solde FROM Article;
== explication
−10 % = × 0,9 (tape `0.9`).
:::

::: sql si-c1-ch4-b-agg-03
ref: 99 | Chap. 4 · Application no 14 — VI. A. | connaître le prix de vente HT
niveau: 2
base: ladore
== question
Affiche **Libelle** et le **montant de TVA** de chaque article (alias **TVA**), TVA à 20 % : TVA = PV_TTC − PV_TTC / 1.2.
== solution
SELECT Libelle, PV_TTC - PV_TTC / 1.2 AS TVA FROM Article;
== explication
Calcul entre une colonne et des nombres ; TTC = HT × 1,2.
:::

::: sql si-c1-ch4-b-agg-04
ref: 86 | Chap. 4 · II. B. Les attributs calculés | Illustration sans l’alias
niveau: 2
base: ladore
== question
Articles (**Libelle**, prix **HT** = PV_TTC / 1.2) dont le prix **HT** dépasse **1 000 €**.
== solution
SELECT Libelle, PV_TTC / 1.2 AS PV_HT FROM Article WHERE PV_TTC / 1.2 > 1000;
== explication
Le cours montre qu’on peut répéter le calcul dans le WHERE (« illustration sans l’alias »).
:::

::: sql si-c1-ch4-b-agg-05
ref: 99 | Chap. 4 · Application no 14 — VI. B. | AS Montant_LC
niveau: 2
base: ladore
== question
Pour la facture **1003** : **Libelle**, **Quantite** et montant de chaque ligne (**Montant** = PV_TTC × Quantite).
== solution
SELECT Article.Libelle, LIGNE.Quantite, Article.PV_TTC * LIGNE.Quantite AS Montant
FROM Article, LIGNE
WHERE Article.NumArticle = LIGNE.NumArticle
AND LIGNE.NumFacture = 1003;
== explication
Calcul entre deux colonnes de deux tables jointes, puis restriction sur la facture.
:::

::: sql si-c1-ch4-b-agg-06
ref: 99 | Chap. 4 · Application no 14 — VII. A. 1. | Combien y a-t-il de clients dans la base
niveau: 1
base: ladore
== question
Combien y a-t-il d’**articles** dans la base ?
== solution
SELECT COUNT(*) AS Nb_Articles FROM Article;
== explication
COUNT(*) compte les lignes.
:::

::: sql si-c1-ch4-b-agg-07
ref: 100 | Chap. 4 · Application no 14 — VII. A. 2. | Combien de factures ont été établies
niveau: 1
base: ladore
== question
Combien de factures ont été établies **en 2019** ?
== solution
SELECT COUNT(*) AS Nb_Facture FROM Facture WHERE YEAR(Date_Facture) = 2019;
== explication
Le WHERE filtre d’abord, COUNT compte ensuite les lignes restantes.
:::

::: sql si-c1-ch4-b-agg-08
ref: 99 | Chap. 4 · Application no 14 — VII. A. 1. | Combien y a-t-il de clients dans la base
niveau: 1
base: ladore
== question
Combien de clients habitent **Paris** ?
== solution
SELECT COUNT(*) AS Nb FROM Client WHERE Ville = "Paris";
== explication
WHERE puis COUNT(*).
:::

::: sql si-c1-ch4-b-agg-09
ref: 100 | Chap. 4 · Application no 14 — VII. A. 4. | Attention à la question « combien » qui peut être un piège
niveau: 2
base: ladore
== question
Combien de **pochettes de chiffons** (article **P-005**) ont été vendues au total ?
== solution
SELECT SUM(Quantite) AS Total FROM LIGNE WHERE NumArticle = "P-005";
== explication
« Combien d’articles » : somme des quantités, pas nombre de lignes.
:::

::: sql si-c1-ch4-b-agg-10
ref: 101 | Chap. 4 · Application no 14 — VII. A. 7. | Quel est le prix du produit le moins cher
niveau: 1
base: ladore
== question
Quel est le prix du produit **le plus cher** ?
== solution
SELECT MAX(PV_TTC) AS PV_max FROM Article;
== explication
MAX extrait la plus grande valeur.
:::

::: sql si-c1-ch4-b-agg-11
ref: 87 | Chap. 4 · II. C. Les agrégats | On parle à ce sujet d’agrégats
niveau: 1
base: ladore
== question
Quelle est la **date de la première facture** (la plus ancienne) ?
== solution
SELECT MIN(Date_Facture) AS Premiere FROM Facture;
== explication
MIN marche aussi sur les dates : la plus ancienne est la plus petite.
:::

::: sql si-c1-ch4-b-agg-12
ref: 101 | Chap. 4 · Application no 14 — VII. A. 9. | Quel est le montant moyen de prix de vente des articles
niveau: 1
base: ladore
== question
Prix moyen (**AVG**) des articles de la famille **INL**.
== solution
SELECT AVG(PV_TTC) AS Moyenne FROM Article WHERE CodeFam = "INL";
== explication
AVG calcule la moyenne d’un attribut numérique, après le filtre du WHERE.
:::

::: sql si-c1-ch4-b-agg-13
ref: 100 | Chap. 4 · Application no 14 — VII. A. 5. | Quel est le chiffre d’affaires TTC
niveau: 3
base: ladore
== question
**Chiffre d’affaires TTC** réalisé en **2019** (somme de PV_TTC × Quantite).
== solution
SELECT SUM(Article.PV_TTC * LIGNE.Quantite) AS CA_2019
FROM Article, LIGNE, Facture
WHERE Article.NumArticle = LIGNE.NumArticle
AND LIGNE.NumFacture = Facture.NumFacture
AND YEAR(Facture.Date_Facture) = 2019;
== explication
La date est dans FACTURE : il faut 3 tables (2 jointures), puis SUM du calcul.
:::

::: sql si-c1-ch4-b-agg-14
ref: 101 | Chap. 4 · Application no 14 — VII. A. 8. | Ici, on constate que plusieurs calculs peuvent être effectués simultanément
niveau: 2
base: etudiants
== question
Note **la plus basse**, **la plus haute** et **moyenne** de toutes les copies (table PASSER), dans cet ordre.
== solution
SELECT MIN(Note), MAX(Note), AVG(Note) FROM PASSER;
== explication
Plusieurs agrégats peuvent être calculés en même temps.
:::

::: sql si-c1-ch4-b-agg-15
ref: 99 | Chap. 4 · Application no 14 — VII. A. 1. | Combien y a-t-il de clients dans la base
niveau: 1
base: etudiants
== question
Combien de copies ont une note **inférieure à 10** ?
== solution
SELECT COUNT(*) FROM PASSER WHERE Note < 10;
== explication
WHERE puis COUNT(*).
:::

::: sql si-c1-ch4-b-agg-16
ref: 87 | Chap. 4 · II. C. Les agrégats | On parle à ce sujet d’agrégats
niveau: 2
base: basile
== question
BASILE : **taille totale** (Mo) de tous les fichiers stockés.
== solution
SELECT SUM(TailleMemoire) AS Total_Mo FROM FICHIER;
== explication
SUM additionne un attribut numérique.
:::

::: sql si-c1-ch4-b-agg-17
ref: 87 | Chap. 4 · II. C. Les agrégats | On parle à ce sujet d’agrégats
niveau: 2
base: basile
== question
BASILE : **tarif horaire moyen** des missions du domaine **Restauration** (NumDom = 2).
== solution
SELECT AVG(tarifHoraire) FROM MISSION WHERE NumDom = 2;
== explication
Moyenne après filtre.
:::

::: sql si-c1-ch4-b-agg-18
ref: 87 | Chap. 4 · II. C. Les agrégats | On parle à ce sujet d’agrégats
niveau: 2
base: basile
== question
BASILE : **combien** de propositions attendent encore une réponse ?
== solution
SELECT COUNT(*) FROM PROPOSER WHERE Reponse IS NULL;
== explication
COUNT(*) des lignes dont la réponse est vide.
:::

::: sql si-c1-ch4-b-agg-19
ref: 87 | Chap. 4 · II. C. Les agrégats | On parle à ce sujet d’agrégats
niveau: 1
base: appels
== question
Combien d’appels ont eu lieu le **04/04/2025** ?
== solution
SELECT COUNT(*) FROM APPEL WHERE DateAppel = #04/04/2025#;
== explication
WHERE sur la date, puis COUNT(*).
:::

::: sql si-c1-ch4-b-agg-20
ref: 87 | Chap. 4 · II. C. Les agrégats | On parle à ce sujet d’agrégats
niveau: 1
base: employes
== question
Date d’embauche du **dernier** employé embauché (la plus récente).
== solution
SELECT MAX(DateEmbauche) FROM Employes;
== explication
La date la plus récente est la plus grande : MAX.
:::

::: qcm si-c1-ch4-b-agg-21
ref: 87 | Chap. 4 · II. C. Les agrégats | On parle à ce sujet d’agrégats
niveau: 1
== question
Quelle fonction calcule une **moyenne** ?
== choix
- [ ] SUM
- [ ] COUNT
- [x] AVG
- [ ] MAX
== explication
AVG (average) calcule la moyenne, uniquement pour des attributs numériques.
:::

::: qcm si-c1-ch4-b-agg-22
ref: 87 | Chap. 4 · II. C. Les agrégats | On parle à ce sujet d’agrégats
niveau: 1
== question
Sur quels types d’attributs **MIN** et **MAX** fonctionnent-ils ? 
== choix
- [ ] Seulement les nombres
- [x] Les nombres et aussi les autres types (ex. : des dates)
- [ ] Seulement les dates
- [ ] Seulement le texte
== explication
MIN extrait la plus petite valeur d’une liste, que l’attribut soit numérique ou non (ex. : des dates de naissance) ; MAX de même.
:::

::: qcm si-c1-ch4-b-agg-23
ref: 100 | Chap. 4 · Application no 14 — VII. A. 4. | L’argument de la fonction SUM est obligatoirement un champ numérique
niveau: 1
== question
Laquelle de ces écritures est **incorrecte** ?
== choix
- [ ] `SUM(Quantite)`
- [ ] `SUM(PV_TTC * Quantite)`
- [x] `SUM(Libelle)`
- [ ] `COUNT(*)`
== explication
L’argument de SUM est obligatoirement un champ numérique : Libelle est du texte.
:::

::: qcm si-c1-ch4-b-agg-24
ref: 100 | Chap. 4 · Application no 14 — VII. A. 4. | Attention à la question « combien » qui peut être un piège
niveau: 2
== question
Une facture contient 2 lignes : 3 pochettes et 1 huile. « Combien d’articles » sur cette facture ?
== choix
- [ ] 2 (COUNT des lignes)
- [x] 4 (SUM des quantités)
- [ ] 1
- [ ] 3
== explication
On additionne les quantités : 3 + 1 = 4. COUNT(*) donnerait 2 (le nombre de lignes).
:::

::: qcm si-c1-ch4-b-agg-25
ref: 86 | Chap. 4 · II. B. Les attributs calculés | les données calculées ne
niveau: 2
== question
Pourquoi ne stocke-t-on pas le **montant TTC** d’une ligne de facture dans la base ?
== choix
- [ ] Parce que c’est interdit par la loi
- [x] Parce qu’on peut le retrouver par un calcul dans la requête
- [ ] Parce que SQL ne gère pas les montants
- [ ] Parce qu’il change tous les jours
== explication
Les données calculées ne doivent pas apparaître dans une base : on les retrouve par le calcul (prix × quantité).
:::

::: trous si-c1-ch4-b-agg-26
ref: 87 | Chap. 4 · II. C. Les agrégats | On parle à ce sujet d’agrégats
niveau: 1
== question
Associe chaque besoin à sa fonction.
== texte
compter des lignes : {0} · additionner : {1} · plus petite valeur : {2} · moyenne : {3}
== reponses
COUNT
SUM
MIN
AVG
== intrus
MAX
TOTAL
== explication
COUNT, SUM, MIN, MAX, AVG : les cinq agrégats du cours.
:::

::: ordre si-c1-ch4-b-agg-27
ref: 100 | Chap. 4 · Application no 14 — VII. A. 3. | Combien de factures ont été établies en janvier 2019
niveau: 1
== question
Remets dans l’ordre : le nombre de factures de 2019.
== ordre
SELECT
COUNT(*) AS Nb
FROM
Facture
WHERE
YEAR(Date_Facture) = 2019
;
== explication
L’agrégat est dans le SELECT, la restriction dans le WHERE.
:::
