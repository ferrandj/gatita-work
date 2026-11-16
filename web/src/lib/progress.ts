/** The learner's progress. It only ever grows, which lets the server merge two devices without losing anything. */

export interface Attempt { ok: number; ko: number; last: 'ok' | 'ko'; at: string }
export interface LessonDone { done: string; perfect?: number; best?: number }
export interface Prefs { sound: boolean; theme: 'auto' | 'light' | 'dark' }

export interface Data {
  attempts: Record<string, Attempt>;
  lessons: Record<string, LessonDone>;
  /** achievement id -> day it was unlocked (never removed) */
  ach: Record<string, string>;
  /** day (YYYY-MM-DD) -> number of answers given that day */
  days: Record<string, number>;
  counters: { pdf: number; random: number; bestRun: number };
  prefs: Prefs;
}

export const emptyData = (): Data => ({
  attempts: {}, lessons: {}, ach: {}, days: {},
  counters: { pdf: 0, random: 0, bestRun: 0 },
  prefs: { sound: true, theme: 'auto' }
});

const obj = (v: unknown): Record<string, unknown> => (v && typeof v === 'object' && !Array.isArray(v) ? v as Record<string, unknown> : {});

/** Accepts anything (an old or partial save) and returns a complete Data object. */
export function normalize(raw: unknown): Data {
  const r = obj(raw), d = emptyData();
  const c = obj(r.counters), p = obj(r.prefs);
  return {
    attempts: obj(r.attempts) as Data['attempts'],
    lessons: obj(r.lessons) as Data['lessons'],
    ach: obj(r.ach) as Data['ach'],
    days: obj(r.days) as Data['days'],
    counters: {
      pdf: Number(c.pdf) || 0, random: Number(c.random) || 0, bestRun: Number(c.bestRun) || 0
    },
    prefs: {
      sound: typeof p.sound === 'boolean' ? p.sound : d.prefs.sound,
      theme: p.theme === 'light' || p.theme === 'dark' ? p.theme : 'auto'
    }
  };
}

/** Same rules as the server (server/src/merge.rs): keys from both sides, numbers keep the max, prefs: incoming wins. */
export function mergeData(a: unknown, b: unknown, depth = 0): unknown {
  if (a && b && typeof a === 'object' && typeof b === 'object' && !Array.isArray(a) && !Array.isArray(b)) {
    const out: Record<string, unknown> = { ...(a as Record<string, unknown>) };
    for (const [k, v] of Object.entries(b as Record<string, unknown>)) {
      out[k] = k in out && !(depth === 0 && k === 'prefs') ? mergeData(out[k], v, depth + 1) : v;
    }
    return out;
  }
  if (typeof a === 'number' && typeof b === 'number') return Math.max(a, b);
  if (b === null || b === undefined) return a;
  return b;
}

const pad = (n: number): string => String(n).padStart(2, '0');
export const dayOf = (d: Date = new Date()): string => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

export function recordAttempt(d: Data, id: string, ok: boolean, now: Date = new Date()): void {
  const a = d.attempts[id] || { ok: 0, ko: 0, last: 'ko', at: '' };
  if (ok) a.ok++; else a.ko++;
  a.last = ok ? 'ok' : 'ko';
  a.at = now.toISOString();
  d.attempts[id] = a;
  const day = dayOf(now);
  d.days[day] = (d.days[day] || 0) + 1;
}

export const solved = (d: Data, id: string): boolean => (d.attempts[id]?.ok || 0) > 0;

/** Longest chain of consecutive days with at least one answer, and the chain still running (today or yesterday). */
export function dayStreaks(days: string[], today: string): { best: number; current: number } {
  const ts = [...new Set(days)].sort().map((s) => Date.UTC(+s.slice(0, 4), +s.slice(5, 7) - 1, +s.slice(8, 10)) / 864e5);
  let best = 0, len = 0, prev: number | null = null;
  for (const t of ts) {
    len = prev !== null && t - prev === 1 ? len + 1 : 1;
    best = Math.max(best, len);
    prev = t;
  }
  const t0 = Date.UTC(+today.slice(0, 4), +today.slice(5, 7) - 1, +today.slice(8, 10)) / 864e5;
  const current = prev !== null && t0 - prev <= 1 ? len : 0;
  return { best, current };
}
