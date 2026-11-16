---
id: si-c1-ch5-l2
title: Les types de données
summary: INTEGER, DECIMAL, VARCHAR, DATE… : chaque colonne a un type.
---

::: cours Les principaux types
ref: 114 | Chap. 5 · I. D. Les types de données gérées par le SGBD | Voici une liste des principaux

| Type | Pour quoi |
|---|---|
| **INTEGER** (INT…) | nombre entier |
| **DECIMAL** | nombre à virgule fixe, précis : idéal pour les **montants** |
| **FLOAT / DOUBLE** | nombre à virgule flottante (très grand ou très petit) |
| **CHAR** | texte de longueur **fixe** (complété par des espaces) |
| **VARCHAR(40)** | texte de longueur **variable**, 40 caractères maximum |
| **TEXT** | long texte |
| **DATE / TIME / DATETIME** | date, heure, les deux |
| **BOOLEAN** | vrai ou faux |
:::

::: qcm si-c1-ch5-e4
ref: 114 | Chap. 5 · I. D. 1. Types numériques | utile pour les montants financiers
niveau: 1
== question
Quel type convient le mieux à un **montant financier** ?
== choix
- [ ] VARCHAR
- [x] DECIMAL
- [ ] BOOLEAN
- [ ] TIME
== explication
DECIMAL : nombres à virgule fixe, utile pour les montants financiers où **la précision est cruciale**.
:::

::: qcm si-c1-ch5-e5
ref: 114 | Chap. 5 · I. D. 2. Types de chaînes de caractères | VARCHAR(40) peut stocker jusqu’à
niveau: 1
== question
`VARCHAR(40)` peut stocker…
== choix
- [ ] exactement 40 caractères
- [x] jusqu’à 40 caractères
- [ ] un nombre jusqu’à 40
- [ ] 40 lignes
== explication
VARCHAR est à longueur **variable** : il utilise seulement la place nécessaire, **jusqu’à** la limite (40).
:::
