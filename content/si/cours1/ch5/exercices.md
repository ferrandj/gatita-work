---
type: exercices
---

::: qcm si-c1-ch5-x1
ref: 113 | Chap. 5 · I. C. 2. Remarque | Pour ne pas perdre sa crédibilité
niveau: 2
== question
Pourquoi un comptable doit-il éviter de présenter Access comme un véritable SGBD face à des informaticiens ?
== choix
- [ ] Parce qu’Access est gratuit
- [x] Pour ne pas perdre sa crédibilité, et juger correctement les offres de prestataires basées sur Access
- [ ] Parce qu’Access ne fait pas de requêtes
- [ ] Parce qu’Access est interdit en entreprise
== explication
Le comptable peut participer à des projets informatiques et choisir des prestataires : **pour ne pas perdre sa crédibilité**, il ne doit pas présenter Access comme un véritable SGBD.
:::

::: qcm si-c1-ch5-x2
ref: 115 | Chap. 5 · I. E. 1. CSV | Il s’agit d’un format de fichier texte qui utilise une virgule
niveau: 2
== question
Quel format d’échange utilise une **virgule** pour séparer les valeurs, une ligne par enregistrement ?
== choix
- [ ] JSON
- [ ] XML
- [x] CSV
- [ ] SQL
== explication
CSV (*Comma-Separated Values*) : fichier texte, une ligne par enregistrement, valeurs séparées par des virgules.
:::

::: qcm si-c1-ch5-x3
ref: 109 | Chap. 5 · I. A. 2. Les différents types de bases de données | Base de données relationnelle
niveau: 1
== question
Quel type de base de données est utilisé pour les **données de gestion** ?
== choix
- [ ] Hiérarchique
- [ ] Réseau
- [x] Relationnelle
- [ ] Big Data
== explication
Les bases relationnelles (tables liées par des clés étrangères) sont utilisées pour les données de gestion.
:::

::: qcm si-c1-ch5-x4
ref: 109 | Chap. 5 · I. A. 2. Les différents types de bases de données | Base de données hiérarchique
niveau: 2
== question
Les dossiers et fichiers d’un disque (un dossier contient des fichiers et des dossiers) sont un exemple de base…
== choix
- [x] hiérarchique
- [ ] réseau
- [ ] relationnelle
- [ ] Big Data
== explication
Structure arborescente où chaque élément a un seul parent : base hiérarchique.
:::

::: qcm si-c1-ch5-x5
ref: 109 | Chap. 5 · I. A. 2. Les différents types de bases de données | Base de données réseau
niveau: 2
== question
Le routage d’un GPS repose sur une base…
== choix
- [ ] hiérarchique
- [x] réseau
- [ ] relationnelle
- [ ] CSV
== explication
Chaque point peut être lié à plusieurs autres : base réseau.
:::

::: qcm si-c1-ch5-x6
ref: 111 | Chap. 5 · I. B. 3. Intégrité des données | intégrité référentielle
niveau: 2
== question
« S’assurer que les relations entre les tables restent valides » s’appelle…
== choix
- [x] l’intégrité référentielle
- [ ] l’indexation
- [ ] la sécurité
- [ ] le partitionnement
== explication
L’intégrité référentielle fait partie de l’intégrité des données d’un SGBDR.
:::

::: qcm si-c1-ch5-x7
ref: 114 | Chap. 5 · I. D. 2. Types de chaînes de caractères | Un type de données à longueur fixe
niveau: 1
== question
Quel type est un texte de **longueur fixe**, complété par des espaces ?
== choix
- [x] CHAR
- [ ] VARCHAR
- [ ] TEXT
- [ ] DATE
== explication
CHAR = longueur fixe ; VARCHAR = longueur variable.
:::

::: qcm si-c1-ch5-x8
ref: 114 | Chap. 5 · I. D. 3. Types date et heure | Combine date et heure
niveau: 1
== question
Quel type combine **date et heure** ?
== choix
- [ ] DATE
- [ ] TIME
- [x] DATETIME
- [ ] BOOLEAN
== explication
DATETIME combine date et heure en un seul type.
:::

::: qcm si-c1-ch5-x9
ref: 115 | Chap. 5 · I. D. 4. Types booléens | Le type BOOLEAN stocke une valeur vraie ou fausse
niveau: 1
== question
Pour une colonne **oui/non** (ex. « client fidèle »), quel type ?
== choix
- [x] BOOLEAN
- [ ] DECIMAL
- [ ] BLOB
- [ ] TIME
== explication
BOOLEAN stocke une valeur vraie ou fausse.
:::

::: sql si-c1-ch5-x10
ref: 117 | Chap. 5 · II. B. 1. CREATE TABLE | La commande CREATE TABLE est utilisée pour créer
niveau: 2
base: employes
== question
Crée la table **Services** avec **CodeService** (INT, clé primaire) et **Libelle** (VARCHAR(50)), puis ajoute le service **1, "Comptabilité"**.
== solution
CREATE TABLE Services (CodeService INT PRIMARY KEY, Libelle VARCHAR(50));
INSERT INTO Services (CodeService, Libelle) VALUES (1, "Comptabilité");
== verification
SELECT * FROM Services;
== explication
CREATE TABLE avec types et PRIMARY KEY, puis un INSERT pour vérifier.
:::

::: sql si-c1-ch5-x11
ref: 119 | Chap. 5 · II. B. 4. TRUNCATE TABLE | La commande TRUNCATE TABLE est utilisée pour supprimer toutes les lignes
niveau: 2
base: employes
== question
Vide la table **Employes** de toutes ses lignes en **gardant** la table. Dans l’appli (SQLite), TRUNCATE n’existe pas : écris l’équivalent avec DELETE.
== solution
DELETE FROM Employes;
== verification
SELECT COUNT(*) FROM Employes;
== explication
TRUNCATE TABLE Employes vide la table (plus rapidement) ; DELETE FROM sans WHERE donne le même résultat.
:::

::: sql si-c1-ch5-x12
ref: 118 | Chap. 5 · II. B. 3. CREATE VIEW | La commande CREATE VIEW est utilisée pour créer une vue
niveau: 3
base: ladore
== question
LADORÉ : crée la vue **ArticlesChers** (NumArticle, Libelle, PV_TTC des articles à plus de 2 000 €).
== solution
CREATE VIEW ArticlesChers AS SELECT NumArticle, Libelle, PV_TTC FROM Article WHERE PV_TTC > 2000;
== verification
SELECT * FROM ArticlesChers ORDER BY NumArticle;
== explication
Une vue est une table virtuelle basée sur le résultat d’une requête.
:::

::: ordre si-c1-ch5-x13
ref: 118 | Chap. 5 · II. B. 2. CREATE INDEX | La commande CREATE INDEX est utilisée pour créer un index
niveau: 1
== question
Remets dans l’ordre : créer un index sur le nom des employés.
== ordre
CREATE INDEX
idx_nom
ON
Employes
(Nom)
== explication
CREATE INDEX nom_index ON table (colonne).
:::
