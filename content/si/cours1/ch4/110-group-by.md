---
id: si-c1-ch4-l11
title: GROUP BY : regrouper
summary: Un calcul « par » quelque chose : par client, par facture…
---

::: cours Un résultat par groupe
ref: 101 | Chap. 4 · Application no 14 — VII. B. Remarque | On peut repérer la nécessité de cette clause

Sans GROUP BY, un agrégat donne **un seul** résultat pour toute la table. Avec **GROUP BY**, on obtient **un résultat par groupe**.

On repère le besoin d’un GROUP BY dès qu’il y a **un calcul (agrégat) à faire PAR type d’enregistrement** : « nombre de factures **par** client », « total **par** facture »…
:::

::: cours La règle d’or
ref: 88 | Chap. 4 · II. D. Le regroupement — règles d’écriture | Toutes les colonnes projetées

**Toutes les colonnes du SELECT doivent figurer dans le GROUP BY, sauf les fonctions de calcul.**

```sql
SELECT attribut3, attribut2, FONCTION(attribut1) AS alias1
FROM table1
GROUP BY attribut3, attribut2;
```

Exemple : nombre de factures par client

```sql
SELECT Client.NumClient, Client.Nom, Client.Prenom, Count(*) AS [Nb de factures par client]
FROM Client, Facture
WHERE Client.NumClient = Facture.NumClient
GROUP BY Client.NumClient, Client.Nom, Client.Prenom;
```
:::

::: qcm si-c1-ch4-e44
ref: 88 | Chap. 4 · II. D. Le regroupement — règles d’écriture | mis à part les fonctions
niveau: 1
== question
`SELECT Ville, Titre, COUNT(*) FROM Client GROUP BY …` — que faut-il mettre après GROUP BY ?
== choix
- [ ] Ville
- [ ] Titre
- [x] Ville, Titre
- [ ] Ville, Titre, COUNT(*)
== explication
Toutes les colonnes projetées doivent figurer dans le GROUP BY, **mis à part les fonctions**.
:::

::: sql si-c1-ch4-e45
ref: 101 | Chap. 4 · Application no 14 — VII. B. 1. | Quel est le nombre de factures par client
niveau: 2
base: ladore
== question
Nombre de factures **par client** : **NumClient, Nom, Prenom** et le nombre.
== solution
SELECT Client.NumClient, Client.Nom, Client.Prenom, Count(*) AS [Nb de factures par client]
FROM Client, Facture
WHERE Client.NumClient = Facture.NumClient
GROUP BY Client.NumClient, Client.Nom, Client.Prenom;
== explication
Tous les champs projetés à côté de l’agrégat (ici le COUNT) doivent figurer dans le GROUP BY.
:::

::: sql si-c1-ch4-e46
ref: 102 | Chap. 4 · Application no 14 — VII. B. 2. | Quel est le montant total par facture
niveau: 2
base: ladore
== question
Quel est le **montant total TTC par facture** ? (**NumFacture** et le total)
== solution
SELECT LIGNE.NumFacture, SUM(Article.PV_TTC * LIGNE.Quantite) AS [Total TTC]
FROM Article, LIGNE
WHERE Article.NumArticle = LIGNE.NumArticle
GROUP BY LIGNE.NumFacture;
== explication
« Par facture » → GROUP BY NumFacture ; le total = SUM(prix × quantité).
:::

::: ordre si-c1-ch4-e47
ref: 88 | Chap. 4 · II. D. Le regroupement — règles d’écriture | GROUP BY attribut3, attribut2;
niveau: 2
== question
Remets dans l’ordre : nombre de clients par ville.
== ordre
SELECT
Ville, COUNT(*) AS NbClients
FROM
Client
GROUP BY
Ville
;
== explication
Ville est projetée à côté de COUNT : elle doit être dans le GROUP BY.
:::
