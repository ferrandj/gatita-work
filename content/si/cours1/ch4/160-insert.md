---
id: si-c1-ch4-l16
title: Ajouter : INSERT INTO
summary: Ajouter une ligne, ou recopier des lignes venant d’une autre table.
---

::: cours Ajouter une ligne
ref: 93 | Chap. 4 · III. B. Requête ajout : INSERT | Insertion d’une seule ligne

```sql
INSERT INTO nom de la table (nomcolonne1, nomcolonne2, …)
VALUES (valeur1, valeur2, …);
```

Les valeurs sont dans le **même ordre** que les colonnes. Texte entre guillemets, nombres tels quels.
:::

::: sql si-c1-ch4-e61
ref: 104 | Chap. 4 · Application no 14 — IX. B. 1. | Ajouter l’article OV-35
niveau: 1
base: ladore
== question
Ajoute l’article **OV-35**, libellé **HOHNER Pia Noir**, prix TTC **1500**, marque **Hohner**, code famille **OV**.
== solution
INSERT INTO Article (NumArticle, Libelle, PV_TTC, Marque, CodeFam)
VALUES ("OV-35", "HOHNER Pia Noir", 1500, "Hohner", "OV");
== verification
SELECT * FROM Article ORDER BY NumArticle;
== explication
Le cours écrit `INSERT INTO Article (*)` et des valeurs sans guillemets ; dans un logiciel il faut lister les colonnes (ou ne rien mettre) et mettre les textes entre guillemets.
:::

::: cours Recopier des lignes (archiver)
ref: 93 | Chap. 4 · III. B. 2. Insertion à l’aide de sous-requêtes | Ajout à une table d’une série d’enregistrements

On peut ajouter **plusieurs lignes d’un coup** en les prenant dans une autre table, avec un SELECT :

```sql
INSERT INTO nom de la table (nomcolonne1, nomcolonne2, …)
(SELECT expression1, expression2 … FROM tablesource WHERE …);
```

Très utile pour **archiver** une table avant de la nettoyer : d’abord INSERT … SELECT vers l’archive, **puis** DELETE dans la table d’origine (deux requêtes successives).
:::

::: corrige si-c1-ch4-e62
ref: 105 | Chap. 4 · Application no 14 — IX. B. 2. | Il faut décomposer en deux requêtes successives
niveau: 3
== question
Chaque année, les factures de plus de 3 ans sont archivées dans **Archive_factures** (NumFacture, NumClient, Date_Facture) puis supprimées de FACTURE. Écris les **deux** requêtes.
== solution
INSERT INTO Archive_factures (NumFacture, NumClient, Date_Facture)
(SELECT NumFacture, NumClient, Date_Facture FROM FACTURE
 WHERE YEAR(Date_Facture) < YEAR(NOW()) - 3);

DELETE FROM FACTURE
WHERE YEAR(Date_Facture) < YEAR(NOW()) - 3;
== explication
Il faut décomposer en deux requêtes successives : l’une pour archiver, l’autre pour supprimer les mêmes enregistrements (même condition). (Le corrigé du cours écrit `Facture.*` et une parenthèse en trop dans le DELETE.)
:::
