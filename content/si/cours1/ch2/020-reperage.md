---
id: si-c1-ch2-l2
title: Repérer les données (le dictionnaire)
summary: De la liste brute au dictionnaire des données : nom, type, nature, et ce qu’on élimine.
---

::: cours Les étapes du repérage
ref: 46 | Chap. 2 · II. Le repérage des données | Après avoir délimité le domaine d’étude

Le vrai travail commence par l’**étude des données** d’un **domaine d’étude**. Il faut :

1. **recenser** les documents et les flux d’informations ;
2. en tirer une **liste brute** de données ;
3. **épurer** cette liste pour obtenir le **dictionnaire des données**, document central de la modélisation.

On fait des allers-retours entre ces étapes : la démarche est **itérative**, pas séquentielle.
:::

::: cours Nom et type de chaque donnée
ref: 46 | Chap. 2 · II. A. 1. Propriété | « nomCli » et « datePremRV » sont des

Chaque donnée reçoit :

- un **nom mnémonique** (la « propriété ») : court mais lisible, **unique** dans le modèle (sauf clé recopiée). Ex. : `nomCli`, `datePremRV` ; le `_` peut séparer les mots ;
- un **type** :
  - **numérique** : pour les calculs ;
  - **chaîne** (alphanumérique) : textes et chiffres mêlés ;
  - **booléen** : seulement **Vrai** ou **Faux** (ex. : `Marié`) ;
  - **date**.

> Un **code postal** ou un **numéro de téléphone** est **alphanumérique**, pour garder les 0 à gauche (06…).
:::

::: qcm si-c1-ch2-l2-e1
ref: 47 | Chap. 2 · II. A. 2. Type — Remarque | sont de type alphanumérique afin de permettre l’affichage des 0 à gauche
niveau: 1
== question
De quel type est un numéro de téléphone ?
== choix
- [ ] Numérique
- [x] Alphanumérique (chaîne)
- [ ] Booléen
- [ ] Date
== explication
Les nombres de longueur fixe sont alphanumériques, pour afficher les 0 à gauche.
:::

::: qcm si-c1-ch2-l2-e2
ref: 47 | Chap. 2 · II. A. 2. Type | ce type de donnée ne peut prendre que les valeurs
niveau: 1
== question
La propriété « Marié » (oui/non) est de type…
== choix
- [ ] chaîne
- [ ] numérique
- [x] booléen
- [ ] date
== explication
Un booléen ne prend que Vrai ou Faux.
:::

::: cours La nature d’une donnée
ref: 47 | Chap. 2 · II. A. 3. Nature | La nature d’une donnée peut être

- **élémentaire** : saisie ;
- **calculée** : obtenue par une règle de calcul (ex. : un total) ;
- **concaténée** : plusieurs données élémentaires rassemblées (ex. : une adresse complète) ;
- **paramétrée** : information externe, constante (taux de TVA, date du jour) ;
- **conservée** : les données élémentaires sont toujours conservées ; certaines calculées aussi, pour l’**historique** (ex. : le montant HT de chaque facture, car les prix changent chaque année).
:::

::: qcm si-c1-ch2-l2-e3
ref: 47 | Chap. 2 · II. A. 3. Nature | paramétrée : c’est une information externe
niveau: 1
== question
Le taux de TVA est une donnée…
== choix
- [ ] élémentaire
- [ ] concaténée
- [x] paramétrée
- [ ] booléenne
== explication
Une information externe et constante au SI : donnée paramétrée.
:::

::: qcm si-c1-ch2-l2-e4
ref: 47 | Chap. 2 · II. A. 3. Nature | on veut garder pour chaque client le montant HT de chaque
niveau: 3
== question
Pourquoi conserver le montant HT de chaque facture alors qu’il est calculé ?
== choix
- [ ] Pour aller plus vite
- [x] Pour l’historique : les prix de vente changent chaque année
- [ ] Parce qu’un calcul est interdit
- [ ] Parce que c’est un paramètre
== explication
Les prix changent au 1er janvier : pour garder le bon montant de chaque facture, on conserve cette donnée calculée.
:::

::: cours Épurer : le dictionnaire des données
ref: 47 | Chap. 2 · II. B. Établissement du dictionnaire épuré | Il faut supprimer les synonymes

Pour passer de la liste brute au **dictionnaire des données** :

- supprimer les **synonymes** : une même donnée sous deux noms (Code_client sur la commande, Ref_client sur la facture ; « patient » et « malade ») ;
- éliminer les **polysèmes** : un même nom pour deux données différentes (Nom du client et Nom du fournisseur) → on précise : `Nom_client`, `Nom_fournisseur` ;
- **décomposer** les données concaténées : une adresse complète (civilité, nom, prénom, rue, code postal, ville) donne **six** données distinctes ;
- **exclure** les données **calculées** (ex. : l’âge, qu’on calcule à partir de la date de naissance) ;
- **isoler** les **paramètres** (taux de TVA, Smic…).

Seules les données **conservées** restent dans le dictionnaire.
:::

::: qcm si-c1-ch2-l2-e5
ref: 47 | Chap. 2 · II. B. Établissement du dictionnaire épuré | Il faut supprimer les synonymes
niveau: 1
== question
« Code_client » sur la commande et « Ref_client » sur la facture désignent la même chose. Ce sont des…
== choix
- [x] synonymes
- [ ] polysèmes
- [ ] paramètres
- [ ] données calculées
== explication
Une même donnée sous deux noms : synonymes, à supprimer.
:::

::: qcm si-c1-ch2-l2-e6
ref: 48 | Chap. 2 · II. B. Établissement du dictionnaire épuré | Il convient également d’éliminer les polysèmes
niveau: 1
== question
« Nom » pour le client et « Nom » pour le fournisseur : c’est un cas de…
== choix
- [ ] synonyme
- [x] polysème
- [ ] concaténation
- [ ] paramètre
== explication
Un même nom pour deux données différentes : polysème. On écrit Nom_client et Nom_fournisseur.
:::

::: qcm si-c1-ch2-l2-e7
ref: 48 | Chap. 2 · II. B. Établissement du dictionnaire épuré | on ne mentionne pas l’âge des clients
niveau: 2
== question
Pourquoi ne met-on pas l’**âge** des clients dans la base ?
== choix
- [ ] Parce que c’est une donnée privée
- [x] Parce qu’il se calcule à partir de la date de naissance
- [ ] Parce que c’est un booléen
- [ ] Parce que c’est un synonyme
== explication
Les données calculées sont exclues : il suffit de savoir faire le calcul.
:::

::: trous si-c1-ch2-l2-e8
ref: 48 | Chap. 2 · II. B. Établissement du dictionnaire épuré | Les données calculées et concaténées ainsi que les paramètres sont éliminés
niveau: 2
== question
Complète la règle du dictionnaire épuré.
== texte
Les données {0} et {1} ainsi que les {2} sont éliminés ; seules les données conservées figurent dans le dictionnaire.
== reponses
calculées
concaténées
paramètres
== intrus
élémentaires
clés
== explication
On élimine calculées, concaténées et paramètres.
:::
