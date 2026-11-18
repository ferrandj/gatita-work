import { describe, expect, it } from 'vitest';
import { parseContent, parseRef } from './contentfmt';

const base = {
  'm/subject.md': '---\nid: m\ntitle: Matière\n---\n',
  'm/c/course.md': '---\nid: m-c\nnum: 1\ntitle: Cours\npdf: m-c\n---\n',
  'm/c/bases/b.sql': '-- title: Base\n-- ref: 10 | Section\n-- schema:\n--   T(a)\nCREATE TABLE T(a INT);\n',
  'm/c/ch1/chapter.md': '---\nid: m-c-ch1\nnum: 1\ntitle: Chapitre\npage: 5\n---\n'
};

describe('content format', () => {
  it('parses refs', () => {
    expect(parseRef('79 | I. A | le texte')).toEqual({ page: 79, section: 'I. A', anchor: 'le texte' });
    expect(parseRef('p.12 | X')).toEqual({ page: 12, section: 'X' });
    expect(parseRef('abc')).toBeNull();
  });

  it('builds the tree with every kind of block', () => {
    const c = parseContent({ ...base, 'm/c/ch1/01-l.md': `---
id: l1
title: Leçon
summary: Résumé
---

::: cours Une notion
ref: 5 | I | texte

Du **texte**.
:::

::: qcm q1
ref: 5 | I
niveau: 1
== question
Question ?
== choix
- [ ] non
- [x] oui
== explication
Parce que.
:::

::: ordre o1
ref: 5 | I
== question
Remets
== ordre
SELECT
a
FROM
T
== intrus
WHERE
== explication
Ok
:::

::: trous t1
ref: 6 | I
== question
Complète
== texte
{0} a {1} T
== reponses
SELECT
FROM
== intrus
WHERE
== explication
Ok
:::

::: sql s1
ref: 6 | I
base: b
ordonne: oui
== question
Affiche a
== solution
SELECT a FROM T;
== verification
SELECT 1;
== indice
SELECT…
== explication
Ok
:::

::: corrige c1
ref: 7 | I
== question
Écris
== solution
SELECT a FROM T;
== explication
Ok
:::
`, 'm/c/ch1/exercices.md': '---\ntype: exercices\n---\n\n::: qcm x1\nref: 8 | II\n== question\nQ\n== choix\n- [x] a\n- [x] b\n- [ ] c\n== explication\nE\n:::\n' });
    expect(c.errors).toEqual([]);
    const ch = c.subjects[0].courses[0].chapters[0];
    expect(ch.lessons[0].steps.map((s) => (s.kind === 'learn' ? 'learn' : s.ex.type))).toEqual(['learn', 'qcm', 'order', 'fill', 'sql', 'open']);
    const [, qcm, order, fill, sql] = ch.lessons[0].steps;
    expect(qcm.kind === 'ex' && qcm.ex.type === 'qcm' && qcm.ex.answer).toBe(1);
    expect(order.kind === 'ex' && order.ex.type === 'order' && order.ex.extra).toEqual(['WHERE']);
    expect(fill.kind === 'ex' && fill.ex.type === 'fill' && fill.ex.bank).toEqual(['SELECT', 'FROM', 'WHERE']);
    expect(sql.kind === 'ex' && sql.ex.type === 'sql' && sql.ex.ordered).toBe(true);
    expect(ch.exercises[0].type === 'qcm' && ch.exercises[0].answer).toEqual([0, 1]);
    expect(c.dbs.b.schema).toBe('T(a)');
  });

  it('reports mistakes with the file and line', () => {
    const c = parseContent({ ...base, 'm/c/ch1/01-l.md': '---\nid: l1\ntitle: L\n---\n\n::: qcm q1\n== question\nQ\n:::\n\n::: sql s1\nref: 3 | X\n== question\nQ\n== solution\nSELECT 1\n== explication\nE\n:::\n\n::: bidule\n:::\n' });
    const msgs = c.errors.map((e) => `${e.file}:${e.line} ${e.message}`).join('\n');
    expect(msgs).toMatch(/01-l\.md:6 q1 : ref manquante/);
    expect(msgs).toMatch(/s1 : base manquante/);
    expect(msgs).toMatch(/Type de bloc inconnu/);
  });

  it('detects duplicate ids and unknown bases', () => {
    const ex = '::: sql s1\nref: 3 | X\nbase: nope\n== question\nQ\n== solution\nSELECT 1\n== explication\nE\n:::\n';
    const c = parseContent({ ...base, 'm/c/ch1/01-l.md': '---\nid: l1\ntitle: L\n---\n' + ex, 'm/c/ch1/02-l.md': '---\nid: l2\ntitle: L\n---\n' + ex });
    const msgs = c.errors.map((e) => e.message).join('\n');
    expect(msgs).toMatch(/en double : s1/);
    expect(msgs).toMatch(/base « nope » introuvable/);
  });
});
