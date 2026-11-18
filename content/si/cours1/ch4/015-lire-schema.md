---
id: si-c1-ch4-l1b
title: Lire le schéma avant d’écrire
summary: Repérer les tables, les colonnes et les liens d’une base, et écrire TABLE.colonne.
---

::: cours Toujours partir du schéma
ref: 94 | Chap. 4 · Application no 14 — Cas LADORÉ | Son activité a été modélisée au travers du MRD suivant

Avant d’écrire une requête, on regarde le **schéma relationnel** de la base. Exemple du cas LADORÉ (application 14) :

```
CLIENT(NumClient, Titre, Nom, Prenom, Adresse, CP, Ville, Date_Creation)
FACTURE(NumFacture, Date_Facture, #NumClient)
LIGNE(#NumFacture, #NumArticle, Quantite)
ARTICLE(NumArticle, Libelle, PV_TTC, Marque, #CodeFam)
```

On y lit :

- les **tables** (CLIENT, FACTURE…) : ce qu’on mettra dans le **FROM** ;
- leurs **colonnes** : ce qu’on mettra dans le **SELECT** et le **WHERE** ;
- les **clés étrangères** (#) : les liens qui serviront aux **jointures**.
:::

::: cours Où est l’information ?
ref: 92 | Chap. 4 · II. G. Récapitulatif | Identification des tables nécessaires

Pour chaque information demandée, on se pose la question : **dans quelle table est-elle ?**

- le nom d’un client → CLIENT ;
- la date d’une facture → FACTURE ;
- le prix d’un article → ARTICLE ;
- la quantité achetée → LIGNE.

C’est l’étape 3 de la méthode du cours : identifier les tables nécessaires, **directement** ou **pour faire le lien** entre d’autres tables.
:::

::: cours Le point : TABLE.colonne
ref: 80 | Chap. 4 · I. B. Le FROM — règles d’écriture | SELECT table1.attribut1, table2.attribut2

On peut écrire une colonne avec le nom de sa table devant, séparés par un **point** :

```sql
SELECT Client.Nom, Client.Prenom
FROM Client;
```

`Client.Nom` se lit « la colonne Nom de la table Client ».

- avec **une seule table**, le préfixe est facultatif ;
- avec **plusieurs tables**, il devient **obligatoire** quand une colonne existe dans deux tables (par ex. NumClient est dans CLIENT **et** dans FACTURE).
:::

::: qcm si-c1-ch4-l1b-e1
ref: 94 | Chap. 4 · Application no 14 — Cas LADORÉ | Son activité a été modélisée au travers du MRD suivant
niveau: 1
== question
Dans le cas LADORÉ, dans quelle table trouve-t-on la **date d’une facture** ?
== choix
- [ ] CLIENT
- [x] FACTURE
- [ ] LIGNE
- [ ] ARTICLE
== explication
FACTURE(NumFacture, **Date_Facture**, #NumClient) : la date est une colonne de FACTURE.
:::

::: qcm si-c1-ch4-l1b-e2
ref: 94 | Chap. 4 · Application no 14 — Cas LADORÉ | Son activité a été modélisée au travers du MRD suivant
niveau: 1
== question
Dans quelle table trouve-t-on la **quantité** d’un article vendu sur une facture ?
== choix
- [ ] FACTURE
- [ ] ARTICLE
- [x] LIGNE
- [ ] CLIENT
== explication
La quantité dépend à la fois de la facture **et** de l’article : elle est dans LIGNE(#NumFacture, #NumArticle, Quantite).
:::

::: qcm si-c1-ch4-l1b-e3
ref: 80 | Chap. 4 · I. B. Le FROM — règles d’écriture | SELECT table1.attribut1, table2.attribut2
niveau: 1
== question
Que signifie `Article.PV_TTC` ?
== choix
- [ ] Le prix multiplié par l’article
- [x] La colonne PV_TTC de la table Article
- [ ] La table PV_TTC de la base Article
- [ ] Une erreur de syntaxe
== explication
Le point sépare le nom de la **table** et le nom de la **colonne** : TABLE.colonne.
:::

::: qcm si-c1-ch4-l1b-e4
ref: 94 | Chap. 4 · Application no 14 — Cas LADORÉ | Son activité a été modélisée au travers du MRD suivant
niveau: 2
== question
Pour afficher le **nom des clients** et la **date de leurs factures**, quelles tables faut-il dans le FROM ?
== choix
- [ ] CLIENT seulement
- [x] CLIENT et FACTURE
- [ ] CLIENT, FACTURE et LIGNE
- [ ] FACTURE seulement
== explication
Le nom est dans CLIENT, la date dans FACTURE ; les deux tables sont reliées directement par #NumClient. Pas besoin de LIGNE.
:::

::: qcm si-c1-ch4-l1b-e5
ref: 92 | Chap. 4 · II. G. Récapitulatif | Identification des tables nécessaires
niveau: 2
== question
On veut le **nom des clients** qui ont acheté l’article **« Sangles cuir »**. Quelles tables faut-il ?
== choix
- [ ] CLIENT et ARTICLE
- [ ] CLIENT, FACTURE et ARTICLE
- [x] CLIENT, FACTURE, LIGNE et ARTICLE
- [ ] LIGNE et ARTICLE
== explication
CLIENT et ARTICLE n’ont pas de colonne commune : il faut passer par les tables qui font le lien, FACTURE (#NumClient) puis LIGNE (#NumFacture, #NumArticle). On ajoute des tables **pour permettre le lien**.
:::

::: trous si-c1-ch4-l1b-e6
ref: 80 | Chap. 4 · I. B. Le FROM — règles d’écriture | SELECT table1.attribut1, table2.attribut2
niveau: 1
== question
Complète pour afficher le nom et la ville des clients en préfixant par la table.
== texte
SELECT {0}.Nom, {1}.Ville FROM {2};
== reponses
Client
Client
Client
== intrus
Facture
Article
== explication
Le préfixe est le nom de la table qui contient la colonne : ici Client, partout.
:::
