---
id: si-c1-ch3-l3
title: Lire un schéma relationnel
summary: Repérer qui est relié à qui : lien « père-fils » et table de lien « plusieurs à plusieurs ».
---

::: cours Le lien père-fils (hiérarchique)
ref: 60 | Chap. 3 · II. A. 2. La structure père-fils | un père a plusieurs fils, mais un fils n’a qu’un seul père

C’est le lien le plus fréquent : **un père a plusieurs fils, mais un fils n’a qu’un seul père**.

Exemple du cours : un client peut passer plusieurs commandes, mais une commande appartient à un seul client.

Dans le schéma, ce lien devient une **clé étrangère dans la table « fils »** :

```
CLIENT(NumClient, DenominationClient, TelClient…)
APPEL(NumAppel, DateAppel, HeureAppel, #NumClient, #NumTechnicien, #CodeLogiciel)
```

Un appel est passé par **un** client : APPEL contient donc #NumClient.
:::

::: cours Le lien plusieurs à plusieurs
ref: 62 | Chap. 3 · II. A. 3. La relation plusieurs à plusieurs | FOURNIR(#CodeA, #CodeF)

Parfois, le lien va dans les deux sens : un aliment peut être fourni par plusieurs fournisseurs, **et** un fournisseur peut fournir plusieurs aliments.

On crée alors **une nouvelle table de lien**, souvent nommée par un verbe, dont la clé primaire regroupe les clés des deux tables :

```
ALIMENT(CodeA, Libelle)
FOURNISSEUR(CodeF, Nom, …)
FOURNIR(#CodeA, #CodeF)
```

Dans FOURNIR, CodeA et CodeF sont à la fois **clé primaire** (ensemble) et **clés étrangères**.
:::

::: qcm si-c1-ch3-e6
ref: 61 | Chap. 3 · II. A. 2. Application no 2 — Approche textuelle | APPEL(NumAppel, DateAppel, HeureAppel
niveau: 2
== question
`APPEL(NumAppel, DateAppel, HeureAppel, #NumClient, #NumTechnicien, #CodeLogiciel)` — combien de tables sont reliées à APPEL par une clé étrangère ?
== choix
- [ ] 1
- [ ] 2
- [x] 3
- [ ] 4
== explication
Trois clés étrangères (#NumClient, #NumTechnicien, #CodeLogiciel) : APPEL est relié à CLIENT, TECHNICIEN et LOGICIEL.
:::

::: qcm si-c1-ch3-e7
ref: 61 | Chap. 3 · II. A. 3. La relation plusieurs à plusieurs | il est nécessaire de créer une nouvelle table
niveau: 2
== question
Un auteur peut écrire plusieurs livres et un livre peut être écrit par plusieurs auteurs. Comment le représenter ?
== choix
- [ ] Mettre #CodeAuteur dans LIVRE
- [ ] Mettre #CodeLivre dans AUTEUR
- [x] Créer une table de lien ECRIRE(#CodeAuteur, #CodeLivre)
- [ ] Mettre tous les auteurs dans une seule colonne
== explication
C’est un lien **non hiérarchique** (plusieurs à plusieurs) : il faut **créer une nouvelle table** dont la clé primaire regroupe les clés des tables concernées.
:::
