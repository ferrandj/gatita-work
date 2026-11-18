import { describe, expect, it } from 'vitest';
import { allExercises, allLessons, getSubjects } from './index';
import { loadRepoContent } from '../test/content';
import { grade, openDb, runScript } from '../lib/sqlrun';
import type { SqlEx } from './types';

describe('course content', () => {
  const content = loadRepoContent();

  it('reads every content file without error', () => {
    expect(content.errors).toEqual([]);
  });

  const exs = allExercises();

  it('has unique ids', () => {
    const ids = [...exs.map((e) => e.id), ...allLessons().map((l) => l.id)];
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('points every explanation and exercise to a page of the course', () => {
    for (const l of allLessons()) for (const s of l.steps) {
      const ref = s.kind === 'learn' ? s.ref : s.ex.ref;
      expect(ref.page, l.id).toBeGreaterThan(0);
      expect(ref.page, l.id).toBeLessThanOrEqual(140);
      expect(ref.section.length, l.id).toBeGreaterThan(3);
    }
    for (const e of exs) expect(e.ref.page, e.id).toBeGreaterThan(0);
  });

  it('has consistent multiple choice, fill and order exercises', () => {
    for (const e of exs) {
      if (e.type === 'qcm') {
        const a = Array.isArray(e.answer) ? e.answer : [e.answer];
        for (const i of a) expect(i, e.id).toBeLessThan(e.choices.length);
      }
      if (e.type === 'fill') {
        expect((e.text.match(/\{\d+\}/g) || []).length, e.id).toBe(e.answer.length);
        for (const w of e.answer) expect(e.bank, e.id).toContain(w);
      }
      if (e.type === 'order') expect(e.tokens.length, e.id).toBeGreaterThan(2);
    }
  });

  const sqlEx = exs.filter((e): e is SqlEx => e.type === 'sql');
  it.each(sqlEx.map((e) => [e.id, e] as const))('solution of %s runs and is graded right', async (_id, e) => {
    const db = await openDb(e.db);
    const r = runScript(db, e.solution);
    db.close();
    expect(r.ok ? 'ok' : r.error).toBe('ok');
    if (r.ok && !e.check) expect(r.table?.rows.length, e.id + ' returns no row').toBeGreaterThan(0);
    const g = await grade(e, e.solution);
    expect(g.verdict.ok).toBe(true);
  });

  it('lists the SQL chapter with lessons', () => {
    const c1 = getSubjects()[0].courses[0];
    expect(c1.chapters.find((c) => c.num === 4)?.lessons.length).toBeGreaterThan(10);
  });
});
