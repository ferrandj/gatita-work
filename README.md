# Gatita 🐱📖

Application auto-hébergée pour **réviser ses cours pas à pas** : leçons courtes tirées du cours, exercices corrigés
(QCM, requêtes SQL à taper et corrigées automatiquement, morceaux à remettre dans l’ordre, textes à trous, exercices
corrigés), le **PDF du cours consultable dans l’app** (ouvert à la bonne page, passage surligné), et des **succès** avec
une petite musique.

- Matière → cours → chapitre → leçons ou exercices, ou **exercices au hasard** (chapitre, cours, matière ou tout).
- Chaque explication, exercice et correction a un lien 📖 vers l’endroit exact du cours.
- Contenu actuel : *Système d’information de gestion (UE 118), cours 1*, partie **SQL** pour débutant
  (chapitres 3, 4 et 5) : 29 leçons, 363 exercices dont 219 requêtes SQL.
- Installable sur Android comme une application (PWA), fonctionne hors ligne, progression enregistrée sur le NAS.

Serveur en **Rust** (axum, aucune base externe), interface React, requêtes SQL exécutées dans le navigateur (SQLite
WebAssembly), PDF affiché par pdf.js. Une seule petite image Docker, un seul dossier de données.

## Installation sur le NAS

1. Créer le dossier de données, par ex. `/volume1/docker/gatita/data`.
2. Utiliser [`docker-compose.yml`](docker-compose.yml) (aucun secret dedans) : Synology *Container Manager → Projet →
   Créer* et coller le fichier, ou en SSH `docker compose up -d`. Adapter le port (`10458`) et le chemin si besoin.
3. Ouvrir `http://<adresse-du-nas>:10458`, puis *Réglages → PDF des cours → Envoyer le PDF du cours* (une seule fois).

Mise à jour : `docker compose pull && docker compose up -d`.

> **Premier téléchargement depuis GHCR** : les paquets publiés par GitHub Actions sont privés au départ. Soit rendre
> le paquet public (GitHub → profil → *Packages* → `gatita-work` → *Package settings* → *Change visibility*), soit
> `docker login ghcr.io` sur le NAS avec un jeton `read:packages`.

### Sur Android

L’installation comme application demande **HTTPS** (reverse proxy du NAS, Tailscale…) : ouvrir l’adresse dans Chrome,
menu ⋮ → *Ajouter à l’écran d’accueil* / *Installer l’application*.

## Le dossier `data/`

```
data/
  state.json        la progression (exercices, leçons, succès, réglages)
  backups/          copies automatiques (au plus une par minute pendant les révisions, 60 dernières + une par jour)
  pdf/si-c1.pdf     le PDF de chaque cours (jamais publié, reste sur le NAS)
  content/          (facultatif) leçons et exercices en plus, même format que content/
```

La progression ne fait que grandir ; le serveur **fusionne** ce que chaque appareil envoie (téléphone et ordinateur
peuvent être utilisés tour à tour, même hors ligne) sans jamais rien perdre. Un `state.json` illisible est mis de
côté et la dernière sauvegarde valide est rechargée.

## Ajouter des cours et des exercices

Tout le contenu est en fichiers texte : voir **[CONTENT.md](CONTENT.md)**.

## Développement

```bash
cd web && npm ci && npm test        # format du contenu, solutions SQL, bibliothèques
cd server && cargo test             # stockage, fusion, API
cd web && npm run build && cd ../server && DATA_DIR=../data PUBLIC_DIR=../web/dist CONTENT_DIR=../content cargo run
```

Chaque push sur la branche par défaut qui passe les tests publie une release et une image multi-architecture
(`linux/amd64`, `linux/arm64`) sur `ghcr.io/ferrandj/gatita-work` (même chaîne que *planner*).

## Droits

Le PDF et le contenu du cours appartiennent à leurs auteurs (Cnam-Intec) : le PDF n’est **jamais** dans ce dépôt ni
dans l’image, il reste dans le dossier `data/` du NAS. Les leçons de `content/` sont des reformulations courtes qui
renvoient au cours.
