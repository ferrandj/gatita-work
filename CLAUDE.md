# Règles du projet Gatita

## Confidentialité : le dépôt est PUBLIC

Les cours viennent d’un PDF fourni par l’utilisatrice. Rien ne doit permettre de relier ce dépôt à elle, à son école ou à
son diplôme. Ne JAMAIS écrire, dans aucun fichier, commit, message de commit, nom de branche, release ou image :

- le nom, prénom, l’adresse mail ou tout identifiant de l’élève qui figure en filigrane du PDF ;
- le nom de l’école ou de l’organisme qui publie le cours, ni son site, ni ses sigles ;
- le nom ou le sigle du diplôme et de l’examen, ni le code ou le numéro de l’unité d’enseignement ;
- le nom des auteurs du cours, ni le nom du fichier PDF d’origine.

À la place, utiliser des mots neutres : « l’école », « le cours », « l’examen », « la matière ».
Le PDF lui-même ne va jamais dans le dépôt ni dans l’image : il reste dans `data/pdf/` sur le NAS (`*.pdf` est ignoré par git).

Avant chaque commit qui touche `content/` ou la documentation : chercher ces termes (sans les écrire dans le dépôt) dans
les fichiers modifiés et dans le message de commit.

## Contenu

Le contenu (leçons, exercices, bases d’exemple) est en fichiers texte dans `content/`, format décrit dans `CONTENT.md`.
Tout doit venir du cours, avec une `ref` (page, partie, passage exact). Vérifier avec `cd web && npm test`, et avec le PDF :
`GATITA_PDF=chemin/du/cours.pdf npx vitest run src/content/anchors.test.ts --environment node`.
