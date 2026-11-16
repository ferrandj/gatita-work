---
id: si-c1-ch4-l14
title: La méthode pour une requête complexe
summary: Les 5 étapes du cours et l’ordre des clauses.
---

::: cours Les 5 étapes
ref: 92 | Chap. 4 · II. G. Récapitulatif | La démarche de réalisation d’une requête complexe

Pour une requête complexe, le cours propose d’avancer par étapes :

1. les attributs à afficher → **SELECT** ;
2. les attributs des conditions → **WHERE** ;
3. les tables nécessaires (directement, ou pour faire le lien) → **FROM** ;
4. les **jointures** s’il y a plusieurs tables ;
5. les **regroupements** et les **tris**.

Et l’ordre d’écriture : **SELECT → FROM → (JOIN … ON) → WHERE → GROUP BY → HAVING → ORDER BY**.

> En DCG/DGC, pas d’aide-mémoire SQL à l’examen : il faut connaître la syntaxe par cœur.
:::

::: ordre si-c1-ch4-e57
ref: 88 | Chap. 4 · II. D. et E. | qui suit immédiatement le GROUP
niveau: 2
== question
Remets les clauses dans l’ordre d’écriture.
== ordre
SELECT
FROM
WHERE
GROUP BY
HAVING
ORDER BY
== explication
SELECT → FROM → WHERE → GROUP BY → HAVING (juste après le GROUP BY) → ORDER BY (à la fin).
:::

::: qcm si-c1-ch4-e58
ref: 91 | Chap. 4 · II. G. Récapitulatif | mais pas en DCG/DGC
niveau: 1
== question
L’épreuve de SQL en DCG/DGC est considérée comme difficile parce que…
== choix
- [ ] Il faut écrire les requêtes sur ordinateur
- [x] L’élève ne dispose pas d’aide-mémoire sur la syntaxe SQL
- [ ] Il faut connaître Oracle
- [ ] Les requêtes sont en anglais
== explication
Dans de nombreux examens l’élève a un aide-mémoire, **mais pas en DCG/DGC** : il faut avoir intériorisé la syntaxe.
:::

::: cours Un exemple complet, étape par étape
ref: 129 | Exercices autocorrigés · Exercice 3 — corrigé 4 | Le recours aux alias est facultatif

Besoin (BASILE, question 4) : « pour chaque candidat (identifiant et nom), le **nombre de fichiers** et le **total de mémoire**, du plus gros au plus petit, **seulement si** le total dépasse 50 Mo ».

1. **SELECT** : NumCand, nom, COUNT(NumFic), SUM(TailleMemoire) ;
2. **WHERE** : pas de condition sur les lignes ici (la condition « > 50 Mo » porte sur un **total**) ;
3. **FROM** : CANDIDAT (le nom) et FICHIER (les fichiers) ;
4. **jointure** : `FICHIER.NumCand = CANDIDAT.NumCand` ;
5. **regroupement et tri** : « pour chaque candidat » → GROUP BY ; « total > 50 » → HAVING ; « du plus gros au plus petit » → ORDER BY … DESC.

```sql
SELECT CANDIDAT.NumCand, CANDIDAT.nom, COUNT(NumFic) AS nombre, SUM(TailleMemoire) AS memoire
FROM FICHIER, CANDIDAT
WHERE FICHIER.NumCand = CANDIDAT.NumCand
GROUP BY CANDIDAT.NumCand, CANDIDAT.nom
HAVING SUM(TailleMemoire) > 50
ORDER BY memoire DESC;
```
:::

::: qcm si-c1-ch4-l14-e3
ref: 92 | Chap. 4 · II. G. Récapitulatif | La démarche de réalisation d’une requête complexe
niveau: 2
== question
Dans la méthode du cours, à quelle étape décide-t-on des tables du **FROM** ?
== choix
- [ ] Étape 1, en premier
- [x] Étape 3, après avoir repéré les attributs du SELECT et du WHERE
- [ ] Étape 5, à la fin
- [ ] On ne choisit pas, on met toutes les tables
== explication
On repère d’abord les attributs (SELECT puis WHERE), **puis** les tables qui les contiennent ou qui font le lien (étape 3), puis les jointures (étape 4).
:::
