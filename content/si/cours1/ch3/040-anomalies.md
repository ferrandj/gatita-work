---
id: si-c1-ch3-l4
title: Pourquoi plusieurs tables ? (anomalies et formes normales)
summary: Les 5 anomalies d’une base mal construite et les 3 règles de normalisation.
---

::: cours Une base mal construite
ref: 57 | Chap. 3 · I. B. Les anomalies d’une base | correspondre à la notion d’anomalie

Une base mal construite présente des défauts, appelés **anomalies**. Il y en a cinq :

- **insertion** : impossible d’ajouter une donnée sans en ajouter une autre, pourtant indépendante ;
- **mise à jour** : une modification doit être **répétée** plusieurs fois ;
- **suppression** : supprimer une donnée fait **perdre** d’autres données non concernées ;
- **espace** : la place mémoire n’est pas minimisée ;
- **confusion** : on ne peut pas distinguer des éléments pourtant différents.
:::

::: cours L’exemple du cours
ref: 57 | Chap. 3 · I. B. Les anomalies d’une base | la pire base de données qui

Une seule table mélange produits **et** fournisseurs : (CodeProduit, Libelle, Prix, NomFourn, Rue, Ville, CodePostal, Telephone).

- impossible d’ajouter un fournisseur sans produit → **insertion** ;
- effacer le produit P002 fait perdre Darty → **suppression** ;
- changer le téléphone de la Fnac oblige à modifier chaque ligne Fnac → **mise à jour** ;
- deux « Darty » à deux adresses : lequel est lequel ? → **confusion** ;
- 200 lignes × 8 colonnes = 1 600 emplacements → **espace**.

La solution : **deux tables**, PRODUIT(…, #CodeFourn) et FOURNISSEUR(CodeFourn, …). On passe à 920 emplacements et toutes les anomalies disparaissent.
:::

::: cours Les trois formes normales
ref: 59 | Chap. 3 · I. C. La normalisation du MRD | trois règles cumulatives et hiérarchisées

Trois règles **cumulatives** (chacune suppose la précédente) :

1. **1re forme normale** : tous les attributs sont **décomposés** : ni attribut **calculé**, ni attribut **composite** ;
2. **2e forme normale** : chaque attribut dépend de **toute** la clé primaire (pas d’une partie seulement) ;
3. **3e forme normale** : chaque attribut dépend **directement** de la clé primaire (pas par l’intermédiaire d’un autre attribut).

C’est aussi pourquoi un SELECT **calcule** les totaux au lieu de les stocker.
:::

::: qcm si-c1-ch3-l4-e1
ref: 57 | Chap. 3 · I. B. Les anomalies d’une base | Il y a donc anomalie de mise à jour
niveau: 1
== question
Changer le téléphone de la Fnac oblige à modifier la ligne 1 **puis** la ligne 3. Quelle anomalie ?
== choix
- [ ] Insertion
- [x] Mise à jour
- [ ] Confusion
- [ ] Espace
== explication
La même modification doit être répétée : anomalie de mise à jour.
:::

::: qcm si-c1-ch3-l4-e2
ref: 57 | Chap. 3 · I. B. Les anomalies d’une base | Il y a anomalie de confusion
niveau: 1
== question
On ne sait pas si « Darty » désigne celui de Nanterre ou celui de Versailles. Quelle anomalie ?
== choix
- [ ] Suppression
- [ ] Espace
- [x] Confusion
- [ ] Insertion
== explication
Impossible de distinguer des éléments différents : anomalie de confusion. Un code fournisseur unique la supprime.
:::

::: qcm si-c1-ch3-l4-e3
ref: 59 | Chap. 3 · I. C. La normalisation du MRD | ACHETER(#NumCli, #CodeProd, LibelleProd, Quantite) n’est pas en deuxième forme
niveau: 2
== question
`ACHETER(#NumCli, #CodeProd, LibelleProd, Quantite)` n’est pas en 2e forme normale. Pourquoi ?
== choix
- [ ] Quantite est calculée
- [x] LibelleProd ne dépend que de CodeProd, une partie de la clé
- [ ] Il manque un identifiant
- [ ] NumCli est une clé étrangère
== explication
En 2FN, chaque attribut dépend de la **totalité** de la clé. LibelleProd doit aller dans PRODUIT.
:::

::: qcm si-c1-ch3-l4-e4
ref: 59 | Chap. 3 · I. C. La normalisation du MRD | mais seulement indirect, par transitivité
niveau: 3
== question
`CLIENT(CodeCli, Nom, Prenom, #CodeZone, #CodeRegion)` : chaque zone est dans une seule région. Quelle forme normale n’est pas respectée ?
== choix
- [ ] 1re
- [ ] 2e
- [x] 3e : CodeRegion dépend de la zone, pas directement du client
- [ ] Toutes sont respectées
== explication
CodeRegion ne traduit qu’un lien indirect (par transitivité) : il ne doit pas apparaître, la zone suffit pour retrouver la région.
:::

::: qcm si-c1-ch3-l4-e5
ref: 59 | Chap. 3 · I. C. La normalisation du MRD | Ne doivent pas apparaître ni attributs calculés, ni attributs composites
niveau: 2
== question
Une table FACTURE contient une colonne **TotalTTC** (somme des lignes). Quelle règle est enfreinte ?
== choix
- [x] 1re forme normale : attribut calculé
- [ ] 2e forme normale
- [ ] 3e forme normale
- [ ] Aucune
== explication
En 1FN il ne doit apparaître ni attributs calculés ni attributs composites ; le total se calcule avec SUM.
:::
