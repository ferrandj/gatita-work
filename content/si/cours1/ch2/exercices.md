---
type: exercices
---

::: qcm si-c1-ch2-x1
ref: 39 | Chap. 2 · Introduction | On parle ainsi
niveau: 1
== question
Partir de l’observation de la réalité pour aboutir à un modèle, c’est l’approche…
== choix
- [x] ascendante
- [ ] descendante
- [ ] relationnelle
- [ ] UML
== explication
On parle d’approche ascendante pour cette conversion de la réalité en modèle.
:::

::: qcm si-c1-ch2-x2
ref: 39 | Chap. 2 · I. Les différentes façons de représenter une base | une base de données peut très bien reposer sur
niveau: 1
== question
Une base de données peut-elle être sur papier ?
== choix
- [x] Oui, des fiches papier peuvent constituer une base
- [ ] Non, elle est forcément numérique
== explication
Une base est un ensemble organisé d’informations sur des supports, même des fiches papier.
:::

::: qcm si-c1-ch2-x3
ref: 41 | Chap. 2 · I. A. 1. Merise | L’ensemble des associations de cet exemple sont hiérarchiques
niveau: 2
== question
« Un vol part d’un et un seul aéroport. » L’association est…
== choix
- [x] hiérarchique
- [ ] non hiérarchique
== explication
Un lien direct et unique : hiérarchique (un minimum et un maximum de 1).
:::

::: qcm si-c1-ch2-x4
ref: 41 | Chap. 2 · I. A. 1. Merise | La réforme de 2020 a abouti à mettre en retrait
niveau: 2
== question
Depuis la réforme de 2020, l’approche conceptuelle (Merise)…
== choix
- [ ] est la seule attendue
- [x] est en retrait, gardée pour aider à comprendre
- [ ] est interdite
== explication
Le cours ne la conserve que pour faciliter la compréhension des schémas.
:::

::: qcm si-c1-ch2-x5
ref: 42 | Chap. 2 · I. A. 2. L’approche UML | Lorsqu’il y a une seule cardinalité, c’est nécessairement le maximum
niveau: 2
== question
En UML, une seule cardinalité notée « 1 » indique…
== choix
- [ ] le minimum
- [x] le maximum
- [ ] une erreur
== explication
Avec une seule cardinalité, c’est nécessairement le maximum.
:::

::: qcm si-c1-ch2-x6
ref: 43 | Chap. 2 · I. B. L’approche logico-relationnelle | on parle indiffé
niveau: 1
== question
MLD et MRD désignent…
== choix
- [x] la même chose (modèle logique / relationnel de données)
- [ ] deux modèles opposés
- [ ] un logiciel et un langage
== explication
Les SGBD étant liés au modèle relationnel, on parle indifféremment de MLD ou de MRD.
:::

::: qcm si-c1-ch2-x7
ref: 46 | Chap. 2 · II. Le repérage des données | La démarche est plus itérative
niveau: 2
== question
La démarche de repérage des données est plutôt…
== choix
- [x] itérative (allers-retours)
- [ ] strictement séquentielle
- [ ] aléatoire
== explication
Les va-et-vient entre les étapes sont constants.
:::

::: qcm si-c1-ch2-x8
ref: 46 | Chap. 2 · II. Le repérage des données | Il ne peut apparaître plusieurs fois qu’en cas de clé recopiée
niveau: 2
== question
Un même nom de propriété peut-il apparaître plusieurs fois dans le modèle ?
== choix
- [ ] Oui, librement
- [x] Seulement s’il s’agit d’une clé recopiée
- [ ] Jamais
== explication
Le nom doit être unique, sauf en cas de clé recopiée (clé étrangère).
:::

::: qcm si-c1-ch2-x9
ref: 47 | Chap. 2 · II. A. 3. Nature | concaténée : une donnée concaténée provient d’autres données
niveau: 1
== question
Une adresse complète dans un seul champ est une donnée…
== choix
- [ ] élémentaire
- [x] concaténée
- [ ] paramétrée
- [ ] booléenne
== explication
Elle rassemble plusieurs données élémentaires : il faudra la décomposer.
:::

::: qcm si-c1-ch2-x10
ref: 48 | Chap. 2 · II. B. Établissement du dictionnaire épuré | contient
niveau: 2
== question
Un bloc « civilité, nom, prénom, rue, code postal, ville » écrit d’un seul tenant contient combien de données à séparer ?
== choix
- [ ] 1
- [ ] 3
- [x] 6
- [ ] 4
== explication
Civilité, nom, prénom, adresse, code postal, ville : six informations distinctes.
:::

::: qcm si-c1-ch2-x11
ref: 48 | Chap. 2 · II. B. Établissement du dictionnaire épuré | le patient et le malade désignent la même personne
niveau: 1
== question
Dans un cabinet médical, « patient » et « malade » sont…
== choix
- [x] des synonymes
- [ ] des polysèmes
- [ ] des paramètres
== explication
Deux noms pour la même chose : synonymes.
:::

::: trous si-c1-ch2-x12
ref: 49 | Chap. 2 · III. A. Les dépendances fonctionnelles | S est la source de la dépendance et
niveau: 1
== question
Complète.
== texte
Dans S → B, S est la {0} et B est le {1}. Connaissant S, on déduit une et une {2} valeur de B.
== reponses
source
but
seule
== intrus
cible
plusieurs
== explication
S → B : source et but, une et une seule valeur.
:::

::: qcm si-c1-ch2-x13
ref: 50 | Chap. 2 · III. B. 1. L’obtention de la liste | D’autres données, comme les noms, peuvent être utilisées
niveau: 2
== question
Pourquoi préférer un numéro de salarié au nom pour identifier les salariés ?
== choix
- [x] À cause du risque de doublon sur les noms
- [ ] Parce qu’un nom est trop long
- [ ] Parce qu’un nom est un booléen
== explication
Même faible, le risque de doublon existe : on recourt à un code ou un numéro.
:::

::: qcm si-c1-ch2-x14
ref: 51 | Chap. 2 · III. B. 1. L’obtention de la liste | si des données devaient rester, ce serait la preuve d’un
niveau: 2
== question
Après l’étape 3, il reste des données non placées. Qu’est-ce que cela signifie ?
== choix
- [ ] Rien de grave
- [x] Le travail est incomplet
- [ ] Ce sont des paramètres, forcément
== explication
Toutes les données du dictionnaire doivent être prises en compte ; sinon, travail incomplet.
:::

::: qcm si-c1-ch2-x15
ref: 51 | Chap. 2 · III. B. 2. La structure d’accès théorique (SAT) | la matrice des dépendances fonc
niveau: 2
== question
Pourquoi préférer la SAT à la matrice des dépendances fonctionnelles à l’examen ?
== choix
- [x] La matrice est lourde ; la SAT est plus efficace
- [ ] La matrice est interdite
- [ ] La SAT est plus précise mathématiquement
== explication
La matrice est lourde à mettre en œuvre ; la recherche d’efficacité pousse vers la SAT.
:::

::: corrige si-c1-ch2-x16
ref: 50 | Chap. 2 · III. B. 1. L’obtention de la liste | repose sur quatre étapes
niveau: 3
== question
Une médiathèque a ces données : NumAdherent, NomAdherent, VilleAdherent, CodeLivre, TitreLivre, DateEmprunt (un adhérent emprunte plusieurs livres, un livre est emprunté par plusieurs adhérents, à des dates différentes). Donne les données sources, les buts et la DF multiple.
== solution
Sources : NumAdherent, CodeLivre.
NumAdherent → NomAdherent, VilleAdherent
CodeLivre → TitreLivre
DF multiple : (NumAdherent, CodeLivre) → DateEmprunt
== explication
Même démarche que l’exemple des chaudières : sources (Num/Code), buts, puis la donnée qui reste dépend des deux sources (DF multiple). Elle deviendra la table de lien EMPRUNTER(#NumAdherent, #CodeLivre, DateEmprunt).
:::
