---
type: exercices
---

::: qcm si-c1-ch3-x1
ref: 58 | Chap. 3 · I. B. Les anomalies d’une base | toute mise à jour ne sera qu’unique
niveau: 2
== question
`PRODUIT(CodeProduit, Libelle, Prix, #CodeFourn)` et `FOURNISSEUR(CodeFourn, NomFourn, Rue, Ville, CodePostal, Telephone)` : dans quelle table change-t-on le téléphone de la Fnac ?
== choix
- [ ] Dans PRODUIT, sur chaque ligne de produit Fnac
- [x] Dans FOURNISSEUR, une seule fois
- [ ] Dans les deux tables
== explication
Avec deux tables, toute mise à jour est **unique** : le téléphone n’est stocké qu’à un seul endroit, dans FOURNISSEUR. C’est l’intérêt de séparer les tables (plus d’anomalie de mise à jour).
:::

::: qcm si-c1-ch3-x2
ref: 57 | Chap. 3 · I. B. Les anomalies d’une base | Il y a donc anomalie de suppression
niveau: 2
== question
Dans la table unique PRODUIT/FOURNISSEUR du cours, effacer le produit P002 fait perdre les renseignements sur Darty. Quelle anomalie est-ce ?
== choix
- [ ] Anomalie d’insertion
- [x] Anomalie de suppression
- [ ] Anomalie de confusion
- [ ] Anomalie d’espace
== explication
La suppression de certaines données entraîne la perte d’autres données non concernées : c’est l’**anomalie de suppression**.
:::

::: qcm si-c1-ch3-x3
ref: 56 | Chap. 3 · I. A. Remarque | On peut ainsi identifier les quatre éléments clés du MRD
niveau: 1
== question
Comment appelle-t-on aussi une **table** dans le modèle relationnel ?
== choix
- [ ] Un attribut
- [x] Une relation
- [ ] Une clé
- [ ] Une requête
== explication
La table est aussi appelée relation : elle contient un ensemble de données homogènes.
:::

::: qcm si-c1-ch3-x4
ref: 56 | Chap. 3 · I. A. Remarque | On peut ainsi identifier les quatre éléments clés du MRD
niveau: 1
== question
Dans `SEJOUR(CodeSejour, NbrMaxi, Prix, DateDepart, Duree, #CodeDestination)`, quelle est la **clé primaire** ?
== choix
- [x] CodeSejour
- [ ] CodeDestination
- [ ] Prix
- [ ] DateDepart
== explication
La clé primaire est le premier attribut, celui qui identifie chaque séjour. #CodeDestination est une clé étrangère.
:::

::: qcm si-c1-ch3-x5
ref: 56 | Chap. 3 · I. A. Remarque | Elle est repérée par le symbole #
niveau: 1
== question
Dans `RESERVER(#NumClient, #CodeSejour, DateReservation, NbPersonnes, TauxRemise)`, combien de **clés étrangères** ?
== choix
- [ ] 0
- [ ] 1
- [x] 2
- [ ] 5
== explication
Deux attributs sont précédés de # : NumClient et CodeSejour. Ensemble, ils forment aussi la clé primaire de RESERVER.
:::

::: qcm si-c1-ch3-x6
ref: 60 | Chap. 3 · II. A. 2. La structure père-fils | un père a plusieurs fils, mais un fils n’a qu’un seul père
niveau: 2
== question
Un client peut passer plusieurs commandes, une commande appartient à un seul client. Où met-on la clé étrangère ?
== choix
- [ ] #NumCommande dans CLIENT
- [x] #NumClient dans COMMANDE
- [ ] Dans une nouvelle table de lien
- [ ] Nulle part
== explication
Lien père-fils : la clé du père (CLIENT) va dans la table fils (COMMANDE).
:::

::: qcm si-c1-ch3-x7
ref: 62 | Chap. 3 · II. A. 3. La relation plusieurs à plusieurs | FOURNIR(#CodeA, #CodeF)
niveau: 2
== question
Dans `FOURNIR(#CodeA, #CodeF)`, quelle est la clé primaire ?
== choix
- [ ] CodeA seul
- [ ] CodeF seul
- [x] Le couple (CodeA, CodeF)
- [ ] Il n’y en a pas
== explication
La clé primaire est issue du regroupement des clés des tables concernées, qui sont aussi clés étrangères.
:::

::: qcm si-c1-ch3-x8
ref: 60 | Chap. 3 · II. A. 1. La table | Chaque occurrence d’une table doit être repérée de façon unique
niveau: 1
== question
Que faut-il ajouter à chaque table repérée, pour éviter toute confusion ?
== choix
- [x] Un identifiant (clé primaire)
- [ ] Une clé étrangère
- [ ] Un attribut calculé
- [ ] Un index
== explication
Chaque occurrence doit être repérée de façon unique par un identifiant, qui correspond à la clé primaire.
:::

::: trous si-c1-ch3-x9
ref: 57 | Chap. 3 · I. B. Les anomalies d’une base | correspondre à la notion d’anomalie
niveau: 1
== question
Complète avec l’anomalie correspondante.
== texte
Supprimer un produit fait perdre son fournisseur : anomalie de {0}. On doit modifier un téléphone sur plusieurs lignes : anomalie de {1}. On ne peut pas créer un fournisseur sans produit : anomalie d’{2}.
== reponses
suppression
mise à jour
insertion
== intrus
espace
confusion
== explication
Ce sont trois des cinq anomalies décrites par le cours.
:::
