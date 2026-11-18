---
id: si-c1-ch4-l3b
title: Écrire les valeurs, et NOT
summary: Texte entre guillemets, nombre tel quel, date entre dièses ; inverser une condition avec NOT.
---

::: cours Texte, nombre, date : trois écritures
ref: 95 | Chap. 4 · Application no 14 — III. A. | Un code postal est un champ alphanumérique

Dans une condition, la **valeur** s’écrit différemment selon son type :

| Type | Écriture | Exemple |
|---|---|---|
| texte | entre guillemets | `Ville = "Paris"` |
| nombre | tel quel | `PV_TTC > 1000` |
| date | entre dièses (#) | `Date_Facture >= #01/09/2019#` |

Attention : un **code postal** est du **texte** (champ alphanumérique), même s’il ne contient que des chiffres : `CP = "75010"`.
:::

::: cours Les dates
ref: 96 | Chap. 4 · Application no 14 — III. E. | Les champs de type date sont entourés de dièses ou de guillemets

Les champs de type date sont entourés de **dièses** (ou de guillemets) : `#01/09/2019#` = le 1er septembre 2019 (jour/mois/année).

On compare les dates comme des nombres : **plus petit = plus ancien**, **plus grand = plus récent**.

- `< #01/01/2019#` : avant le 1er janvier 2019 ;
- `>= #01/01/2019#` : le 1er janvier 2019 ou après.
:::

::: cours NOT : le contraire
ref: 81 | Chap. 4 · I. C. Le WHERE — règles d’écriture | opérateurs logiques

Parmi les **opérateurs logiques** du WHERE, le cours cite **AND** (et), **OR** (ou) et **NOT** (pas).

NOT inverse une condition. On le rencontre surtout dans :

- **NOT LIKE** : « ne ressemble pas à » (`NumArticle NOT LIKE "MO*"`) ;
- **IS NOT NULL** : « n’est pas vide » ;
- **NOT IN** : « n’est pas dans la liste » (sous-requêtes, vu plus loin).
:::

::: qcm si-c1-ch4-l3b-e1
ref: 95 | Chap. 4 · Application no 14 — III. A. | Un code postal est un champ alphanumérique
niveau: 1
== question
Quelle écriture est correcte pour le code postal 69002 ?
== choix
- [ ] `CP = 69002`
- [x] `CP = "69002"`
- [ ] `CP = #69002#`
- [ ] `CP = [69002]`
== explication
Un code postal est un champ **alphanumérique** (du texte) : entre guillemets.
:::

::: qcm si-c1-ch4-l3b-e2
ref: 96 | Chap. 4 · Application no 14 — III. E. | Les champs de type date sont entourés de dièses ou de guillemets
niveau: 1
== question
Comment écrire la date du **15 mars 2019** dans une condition (écriture du cours) ?
== choix
- [ ] `"15 mars 2019"`
- [x] `#15/03/2019#`
- [ ] `15/03/2019`
- [ ] `[15/03/2019]`
== explication
Les dates sont entourées de **dièses** : `#15/03/2019#`.
:::

::: qcm si-c1-ch4-l3b-e3
ref: 96 | Chap. 4 · Application no 14 — III. E. | Les champs de type date sont entourés de dièses ou de guillemets
niveau: 2
== question
`WHERE Date_Facture < #01/01/2019#` garde les factures…
== choix
- [x] établies avant le 1er janvier 2019
- [ ] établies après le 1er janvier 2019
- [ ] établies le 1er janvier 2019
- [ ] de l’année 2019
== explication
Plus petit = plus ancien : `<` garde les dates **antérieures** au 1er janvier 2019 (ce jour-là exclu).
:::

::: sql si-c1-ch4-l3b-e4
ref: 101 | Chap. 4 · Application no 14 — VII. A. 6. | Il faut sélectionner les articles dont le numéro ne commence pas par MO
niveau: 2
base: ladore
== question
Affiche **NumArticle, Libelle** des articles qui **ne sont pas** de la main-d’œuvre (leur numéro **ne commence pas** par MO).
== solution
SELECT NumArticle, Libelle
FROM Article
WHERE NumArticle NOT LIKE "MO*";
== explication
`NOT LIKE "MO*"` garde tout ce qui ne commence pas par MO.
:::

::: sql si-c1-ch4-l3b-e5
ref: 81 | Chap. 4 · I. C. Le WHERE — règles d’écriture | est nul ou est non nul
niveau: 1
base: basile
== question
BASILE : affiche **NumCand, nom** des candidats qui **ont** le permis (la colonne permis **n’est pas vide**).
== solution
SELECT NumCand, nom
FROM CANDIDAT
WHERE permis IS NOT NULL;
== explication
« N’est pas vide » se traduit par **IS NOT NULL**.
:::

::: trous si-c1-ch4-l3b-e6
ref: 95 | Chap. 4 · Application no 14 — III. A. | Un code postal est un champ alphanumérique
niveau: 1
== question
Complète avec la bonne écriture de chaque valeur.
== texte
WHERE Ville = {0} AND PV_TTC > {1} AND Date_Facture >= {2}
== reponses
"Lyon"
500
#01/01/2019#
== intrus
Lyon
"500"
01/01/2019
== explication
Texte entre guillemets, nombre tel quel, date entre dièses.
:::
