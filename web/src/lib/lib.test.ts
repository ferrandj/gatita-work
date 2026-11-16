import { describe, expect, it } from 'vitest';
import { normalizeSql, splitStatements } from './sqlnorm';
import { compareTables } from './sqlrun';
import { dayStreaks, emptyData, mergeData, normalize, recordAttempt } from './progress';
import { pickRandom } from './pick';
import { findAnchor } from './pdfmatch';
import { parseBlocks } from './md';
import type { Exercise } from '../content/types';

describe('course-style SQL', () => {
  it('translates dates, quotes, LIKE stars and foreign-key marks', () => {
    expect(normalizeSql('WHERE d >= #01/09/2019# AND v = "Paris"')).toBe("WHERE d >= '2019-09-01' AND v = 'Paris'");
    expect(normalizeSql('WHERE l LIKE "*soprani*" AND x = "a*"')).toBe("WHERE l LIKE '%soprani%' AND x = 'a*'");
    expect(normalizeSql('WHERE Client.NumClient=Facture.#NumClient')).toBe('WHERE Client.NumClient=Facture.NumClient');
    expect(normalizeSql('SELECT [Ligne facture].Q AS [Nb d’articles]')).toBe('SELECT [Ligne facture].Q AS [Nb d’articles]');
    expect(normalizeSql('WHERE n = “O”')).toBe("WHERE n = 'O'");
    expect(normalizeSql("WHERE n = 'l''été'")).toBe("WHERE n = 'l''été'");
  });
  it('splits statements outside quotes', () => {
    expect(splitStatements("SELECT 'a;b'; DELETE FROM T;")).toEqual(["SELECT 'a;b'", 'DELETE FROM T']);
  });
  it('compares results without caring about row order unless asked', () => {
    const want = { columns: ['a'], rows: [[1], [2]] };
    expect(compareTables({ columns: ['x'], rows: [[2], [1]] }, want, false).ok).toBe(true);
    expect(compareTables({ columns: ['x'], rows: [[2], [1]] }, want, true).ok).toBe(false);
    expect(compareTables({ columns: ['x'], rows: [[1]] }, want, false).ok).toBe(false);
    expect(compareTables({ columns: ['x', 'y'], rows: [[1, 2]] }, { columns: ['a', 'b'], rows: [[2, 1]] }, false)).toMatchObject({ ok: false, why: expect.stringMatching(/ordre demandé/) });
  });
});

describe('progress', () => {
  it('merges like the server: union of keys, max of counters, prefs replaced', () => {
    const a = { attempts: { x: { ok: 2, ko: 0 } }, prefs: { sound: true, theme: 'dark' } };
    const b = { attempts: { x: { ok: 1, ko: 1 }, y: { ok: 1 } }, prefs: { sound: false } };
    expect(mergeData(a, b)).toEqual({ attempts: { x: { ok: 2, ko: 1 }, y: { ok: 1 } }, prefs: { sound: false } });
  });
  it('normalizes partial data', () => {
    const d = normalize({ prefs: { sound: false } });
    expect(d.prefs).toEqual({ sound: false, theme: 'auto' });
    expect(d.counters.bestRun).toBe(0);
  });
  it('records attempts and days', () => {
    const d = emptyData();
    recordAttempt(d, 'e', false, new Date(2026, 0, 2));
    recordAttempt(d, 'e', true, new Date(2026, 0, 2));
    expect(d.attempts.e).toMatchObject({ ok: 1, ko: 1, last: 'ok' });
    expect(d.days['2026-01-02']).toBe(2);
  });
  it('computes day streaks', () => {
    expect(dayStreaks(['2026-01-01', '2026-01-02', '2026-01-03', '2026-01-10'], '2026-01-11')).toEqual({ best: 3, current: 1 });
    expect(dayStreaks(['2026-01-01'], '2026-01-05')).toEqual({ best: 1, current: 0 });
  });
});

describe('random pick', () => {
  const pool = Array.from({ length: 30 }, (_, i) => ({ id: 'e' + i }) as Exercise);
  it('is stable for a seed and returns distinct exercises', () => {
    const a = pickRandom(pool, emptyData(), 10, 's1').map((e) => e.id);
    expect(pickRandom(pool, emptyData(), 10, 's1').map((e) => e.id)).toEqual(a);
    expect(new Set(a).size).toBe(10);
  });
});

describe('pdf anchors and markdown', () => {
  it('finds a sentence split across pieces, ignoring spaces, case and accents', () => {
    const pieces = [{ str: 'L’instruction SELECT permet la pro' }, { str: 'jection qui réduit' }, { str: 'autre' }];
    expect(findAnchor(pieces, "l'instruction select permet la projection")).toEqual([0, 1]);
    expect(findAnchor(pieces, 'absent')).toEqual([]);
  });
  it('parses blocks', () => {
    expect(parseBlocks('Texte\n\n- a\n- b\n\n```\nSELECT 1\n```\n\n| A | B |\n|---|---|\n| 1 | 2 |\n\n> note').map((b) => b.t))
      .toEqual(['p', 'ul', 'code', 'table', 'note']);
  });
});
