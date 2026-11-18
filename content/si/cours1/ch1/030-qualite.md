---
id: si-c1-ch1-l3
title: La qualité de l’information
summary: GIGO, les qualités d’une bonne information et les 7 critères du cours.
---

::: cours Garbage In, Garbage Out
ref: 30 | Chap. 1 · I. B. Qualité de l’information | Garbage In, Garbage Out

En informatique, la qualité de l’information est **primordiale** : un traitement automatique détecte et corrige très mal les informations fausses.

**GIGO** (*Garbage In, Garbage Out*) : si les données sont **mauvaises en entrée**, le résultat sera **tout aussi mauvais**.

Piège : un ordinateur peut calculer avec 20 chiffres après la virgule sur des données fausses. Il ne faut pas confondre la **précision** du calcul avec la **validité** du résultat.
:::

::: cours Une bonne information est…
ref: 31 | Chap. 1 · I. B. Qualité de l’information | pertinente, c’est-à-dire qu’elle répond aux besoins

- **pertinente** : elle répond aux besoins de celui qui la reçoit ;
- **exacte** : elle rend compte de la réalité ;
- **précise** : elle ne laisse pas place à l’interprétation ;
- **intelligible** : compréhensible par son utilisateur ;
- **actuelle** : mise à jour ;
- **disponible** : accessible au bon moment et exploitable.

Elle peut aussi être exhaustive ou partielle, protégée ou publique.
:::

::: qcm si-c1-ch1-l3-e1
ref: 30 | Chap. 1 · I. B. Qualité de l’information | Garbage In, Garbage Out
niveau: 1
== question
Que veut dire **GIGO** ?
== choix
- [x] Si les données sont mauvaises en entrée, le résultat sera mauvais
- [ ] Plus on stocke de données, mieux c’est
- [ ] Un ordinateur ne se trompe jamais
- [ ] Il faut toujours deux sauvegardes
== explication
Garbage In, Garbage Out : des déchets en entrée donnent des déchets en sortie.
:::

::: qcm si-c1-ch1-l3-e2
ref: 31 | Chap. 1 · I. B. Qualité de l’information | actuelle, c’est-à-dire mise à jour
niveau: 1
== question
Un fichier clients avec des adresses d’il y a 10 ans manque surtout de quelle qualité ?
== choix
- [ ] Intelligible
- [x] Actuelle
- [ ] Pertinente
- [ ] Protégée
== explication
Actuelle = mise à jour.
:::

::: qcm si-c1-ch1-l3-e3
ref: 31 | Chap. 1 · I. B. Qualité de l’information | intelligible, c’est-à-dire compréhensible par son utilisateur
niveau: 1
== question
Un rapport rempli de sigles que le lecteur ne connaît pas manque de quelle qualité ?
== choix
- [x] Intelligible
- [ ] Exacte
- [ ] Disponible
- [ ] Actuelle
== explication
Intelligible = compréhensible par son utilisateur.
:::

::: trous si-c1-ch1-l3-e4
ref: 31 | Chap. 1 · I. B. Qualité de l’information | pertinente, c’est-à-dire qu’elle répond aux besoins
niveau: 1
== question
Associe chaque qualité à sa définition.
== texte
Répond aux besoins : {0} · Rend compte de la réalité : {1} · Accessible au bon moment : {2}
== reponses
pertinente
exacte
disponible
== intrus
précise
actuelle
== explication
Pertinente, exacte, disponible : trois des six qualités du cours.
:::

::: cours Les 7 critères de qualité
ref: 31 | Chap. 1 · I. B. Qualité de l’information | Sept critères peuvent être retenus

1. **Le coût** : il ne doit pas dépasser le bénéfice tiré de l’information (coûter 100 pour gagner 10 : valeur négative).
2. **La valeur** : la connaître permet de donner la bonne **priorité** ; fournir trop d’informations est aussi inefficace que trop peu.
3. **La capitalisation** : stocker durablement ; perdre une information encore utile est un gâchis.
4. **La validation** : une information **fausse** fait plus de dégâts que l’absence d’information ; on la valide à l’entrée ou avant usage.
5. **L’accessibilité** : une information inaccessible est inutilisable (et c’est pire que son absence).
6. **La protection** : les concurrents, et même certains salariés, ne doivent pas y accéder.
7. **L’historisation et la contextualisation** : dater l’information et noter les circonstances, sinon elle est inutilisable pour les analyses.
:::

::: cours L’exemple de Pearl Harbor
ref: 32 | Chap. 1 · I. B. Qualité de l’information | Un exemple historique permettra d’illustrer

Le cours illustre ces critères avec l’attaque de Pearl Harbor (7 décembre 1941) :

- **valeur** ignorée : un message annonçant l’entrée en guerre, décodé la veille, a été transmis par un canal **non prioritaire** et traité trop tard ;
- **validation** absente : des informations fausses disaient l’attaque impossible ;
- **accessibilité** : l’officier du radar n’avait pas accès aux mouvements des avions américains et a cru à une livraison ;
- **protection** : les lignes téléphoniques n’étaient ni coupées ni surveillées.
:::

::: qcm si-c1-ch1-l3-e5
ref: 31 | Chap. 1 · I. B. Qualité de l’information | Une information fausse peut créer beaucoup plus de dégâts
niveau: 2
== question
Selon le cours, qu’est-ce qui fait le plus de dégâts ?
== choix
- [x] Une information fausse
- [ ] L’absence d’une information pertinente
- [ ] Une information trop chère
== explication
Une information fausse peut créer beaucoup plus de dégâts que la simple absence de l’information : d’où le critère de validation.
:::

::: qcm si-c1-ch1-l3-e6
ref: 31 | Chap. 1 · I. B. Qualité de l’information | sa connaissance n’est pas souhaitable et sa valeur est négative
niveau: 2
== question
Une information coûte 100 et ne fait gagner que 10. Que dit le cours ?
== choix
- [ ] Il faut quand même l’acheter
- [x] Sa connaissance n’est pas souhaitable, sa valeur est négative
- [ ] Il faut la stocker deux fois
- [ ] Elle est forcément fausse
== explication
Critère du coût : il ne doit pas dépasser le bénéfice qu’on peut en retirer.
:::

::: qcm si-c1-ch1-l3-e7
ref: 32 | Chap. 1 · I. B. Qualité de l’information | Une information non datée et hors contexte
niveau: 2
== question
Une information non datée ne peut pas servir à des analyses historiques. Quel critère n’est pas respecté ?
== choix
- [ ] La protection
- [ ] Le coût
- [x] L’historisation et la contextualisation
- [ ] L’accessibilité
== explication
Il faut mémoriser la date et les circonstances avec l’information.
:::

::: qcm si-c1-ch1-l3-e8
ref: 33 | Chap. 1 · I. B. Qualité de l’information | Le radar de l’île a détecté l’approche des vagues d’avions japonais
niveau: 3
== question
À Pearl Harbor, l’officier du radar n’avait pas accès aux mouvements des avions américains. Quel critère est en cause ?
== choix
- [ ] La validation
- [x] L’accessibilité
- [ ] La capitalisation
- [ ] Le coût
== explication
Il existait des informations, mais l’officier n’y avait pas accès : critère d’accessibilité.
:::
