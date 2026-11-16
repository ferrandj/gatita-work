# Écrire des leçons et des exercices

Rien n’est codé en dur dans l’application : tout le contenu est lu au démarrage depuis des **fichiers texte**.

- les fichiers du dossier [`content/`](content/) de ce dépôt sont fournis avec l’image Docker ;
- les fichiers que tu poses dans le dossier **`data/content/`** du NAS s’y **ajoutent** (même chemin = remplace le fichier fourni). Pas besoin de reconstruire quoi que ce soit : *Réglages → Recharger le contenu*.

Les erreurs de format sont listées dans *Réglages → Contenu des cours* (fichier, ligne, problème). Dans le dépôt, `npm test` (dossier `web/`) vérifie aussi que **chaque solution SQL s’exécute** sur sa base et que chaque identifiant est unique. Avec le PDF du cours, `GATITA_PDF=chemin/du/cours.pdf npx vitest run src/content/anchors.test.ts` vérifie que chaque passage cité existe bien à la page indiquée.

## Arborescence

```
content/
  si/                              une matière
    subject.md                     id, title, short, color, icon, order
    cours1/                        un cours
      course.md                    id, num, title, pdf  (pdf = nom du fichier data/pdf/<pdf>.pdf)
      bases/ladore.sql             une base d’exemple pour les requêtes à taper
      ch4/                         un chapitre
        chapter.md                 id, num, title, page (1re page du chapitre), soon: oui (chapitre pas encore rédigé)
        010-requete.md             une leçon par fichier (ordre = ordre alphabétique des noms)
        x01-select.md              une banque d’exercices (en-tête « type: exercices »)
```

Les en-têtes sont entre deux lignes `---` :

```
---
id: si-c1-ch4-l2
title: SELECT : choisir les colonnes
summary: Projection, *, DISTINCT pour enlever les doublons, AS pour renommer.
---
```

## Les blocs

Une leçon (ou une banque) est une suite de blocs `::: type identifiant` … `:::`.
Juste sous la première ligne viennent les champs (`ref`, `niveau`, `base`, `ordonne`), puis des sections `== nom`.

### La référence au cours (obligatoire partout)

```
ref: 79 | Chap. 4 · I. A. Le SELECT | L’instruction SELECT permet la projection
```

1. le **numéro de page** imprimé dans le livre (c’est aussi la page du PDF) ;
2. le nom de la partie, affiché dans le lien 📖 ;
3. (conseillé) quelques **mots recopiés exactement** de la page : le lecteur PDF les surligne.

### Explication de cours

```
::: cours Le titre de l’explication
ref: 79 | Chap. 4 · I. A. Le SELECT | L’instruction SELECT permet la projection

Texte en **Markdown simple** : paragraphes, listes « - » et « 1. », `code`,
blocs ``` pour le SQL, tableaux | a | b |, et « > » pour une remarque.
:::
```

### QCM (une ou plusieurs bonnes réponses)

```
::: qcm si-c1-ch4-e1
ref: 78 | Chap. 4 · I. | le mot FROM permettant d’indiquer
niveau: 1
== question
Quel mot-clé indique la table ?
== choix
- [ ] SELECT
- [x] FROM
== explication
FROM indique la ou les tables.
:::
```

### Requête à taper (corrigée automatiquement)

```
::: sql si-c1-ch4-e9
ref: 96 | Application 14 — III. D. | WHERE Article.PV_TTC>1000
niveau: 1
base: ladore
ordonne: oui                (seulement si l’ordre des lignes compte : ORDER BY demandé)
== question
Articles de plus de 1 000 €.
== solution
SELECT NumArticle, Libelle, PV_TTC FROM Article WHERE PV_TTC > 1000;
== verification              (seulement pour INSERT / UPDATE / DELETE / CREATE : ce qu’on compare après)
SELECT * FROM Article ORDER BY NumArticle;
== indice                    (facultatif)
Un nombre s’écrit sans guillemets.
== explication
…
:::
```

La requête de l’élève et la solution sont exécutées sur deux copies neuves de la base ; les **résultats** sont comparés (mêmes colonnes dans le même ordre, mêmes lignes). L’écriture du cours est acceptée : dates `#01/09/2019#`, textes entre `"…"`, `LIKE "Etui*"`, `[Ligne facture]`, `Facture.#NumClient`, `YEAR()`, `MONTH()`, `NOW()`.

### Remettre dans l’ordre

```
::: ordre si-c1-ch4-e2
ref: …
== question
Remets la requête dans l’ordre.
== ordre                      (un morceau par ligne, dans le BON ordre : l’appli les mélange)
SELECT
Nom
FROM
Client
;
== intrus                     (facultatif : morceaux en trop)
WHERE
== explication
…
:::
```

### Texte à trous

```
::: trous si-c1-ch4-e8
ref: …
== question
Complète.
== texte
SELECT {0} Ville {1} Villes FROM Client;
== reponses
DISTINCT
AS
== intrus
WHERE
== explication
…
:::
```

### Exercice corrigé (auto-évaluation)

```
::: corrige si-c1-ch4-x9
ref: …
== question
Écris la requête…
== solution
SELECT …
== explication
…
:::
```

## Bases d’exemple (`bases/*.sql`)

Un script SQL (SQLite) précédé d’un en-tête en commentaires :

```
-- title: Cas LADORÉ (application no 14)
-- ref: 94 | Application no 14 — Cas LADORÉ
-- note: (facultatif) remarque affichée sous le schéma
-- schema:
--   CLIENT(NumClient, Nom, …)
--   FACTURE(NumFacture, Date_Facture, #NumClient)
CREATE TABLE …;
INSERT INTO …;
```

La **structure** doit être celle du cours ; les lignes peuvent être inventées pour s’entraîner (l’appli le dit à l’élève).

## Règles de rédaction

- Tout doit venir du cours : chaque explication et chaque exercice a sa `ref`, la correction cite le passage.
- Quand le corrigé du cours contient une coquille, on donne la version correcte **et** on signale la coquille dans l’explication.
- Les identifiants sont uniques et ne changent plus une fois publiés (la progression y est attachée).
- Niveaux : 1 = découverte, 2 = application, 3 = type examen.
