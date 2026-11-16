---
id: si-c1-ch5-l1
title: SGBD, SGBDR et SQL
summary: Le logiciel qui gère la base, et pourquoi Access n’en est pas vraiment un.
---

::: cours Base de données et SGBDR
ref: 110 | Chap. 5 · I. B. Caractéristiques d’un SGBDR | Le système de gestion de base de données relationnelle

- Une **base de données** est un ensemble de données structurées.
- Un **SGBDR** (système de gestion de base de données **relationnelle**) est le logiciel qui organise et stocke ces données selon le **modèle relationnel** (des tables reliées par des clés).

C’est ce type de base qu’on utilise pour la gestion (facturation, comptabilité, stocks…).
:::

::: cours Les 5 éléments d’un SGBDR
ref: 110 | Chap. 5 · I. B. Caractéristiques d’un SGBDR | Il y a cinq éléments de base

1. **Modèle relationnel** : des tables (colonnes + lignes), des liens par clés ;
2. **SQL** : le langage **standard** pour créer, récupérer, modifier, supprimer les données ;
3. **Intégrité des données** : intégrité référentielle, contraintes (unicité, non-nullité), transactions ;
4. **Sécurité** : droits des utilisateurs (qui peut voir ou modifier quoi) ;
5. **Performances** : indexation, partitionnement, optimisation des requêtes.
:::

::: qcm si-c1-ch5-e1
ref: 110 | Chap. 5 · I. B. 2. Manipulation et interrogation avec SQL | est le langage standard pour interagir avec un
niveau: 1
== question
Quel est le langage standard pour interagir avec un SGBDR ?
== choix
- [ ] HTML
- [x] SQL
- [ ] JSON
- [ ] Python
== explication
Le langage **SQL** (*Structured Query Language*) est le langage standard pour interagir avec un SGBDR.
:::

::: cours Le cas Microsoft Access
ref: 113 | Chap. 5 · I. C. 2. Le cas du logiciel Microsoft Access | SQL non standard

Access est très utilisé en cours, mais Microsoft le qualifie lui-même de **système de gestion de fichiers** : petites bases, peu d’utilisateurs simultanés, transactions et sécurité limitées, tout dans un seul fichier.

Il parle un SQL un peu différent : **#** et **[ ]** au lieu de **'** et **"**. Pas grave : **les examens acceptent ces petites différences de syntaxe**.

C’est pour ça que tu vois dans le cours `#01/09/2019#` pour une date et `[Ligne facture]` pour un nom avec espace.
:::

::: qcm si-c1-ch5-e2
ref: 113 | Chap. 5 · I. C. 2. SQL non standard | Les cas le plus fréquemment rencontrés
niveau: 1
== question
Dans le SQL d’Access, quels séparateurs remplacent les ' et " du SQL standard ?
== choix
- [x] # et [
- [ ] ( et )
- [ ] { et }
- [ ] ; et :
== explication
Les cas les plus fréquents sont les séparateurs **#** et **[** d’Access, acceptés à l’examen.
:::

::: qcm si-c1-ch5-e3
ref: 112 | Chap. 5 · I. C. 1. Les leaders | SQLite est un SGBD relationnel léger
niveau: 2
== question
Quel SGBD relationnel léger est largement utilisé dans les applications mobiles ?
== choix
- [ ] Oracle Database
- [ ] IBM Db2
- [x] SQLite
- [ ] Microsoft SQL Server
== explication
SQLite est un SGBD relationnel léger utilisé par les applications des smartphones et tablettes. (C’est d’ailleurs lui qui exécute tes requêtes dans cette appli !)
:::
