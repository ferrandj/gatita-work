import type { Exercise } from '../content/types';
import type { Data } from './progress';

/** Small seeded random generator, so a random session keeps the same questions when the page is reloaded. */
export function rng(seed: string): () => number {
  let h = 2166136261;
  for (const c of seed) h = Math.imul(h ^ c.charCodeAt(0), 16777619);
  return () => {
    h += 0x6d2b79f5;
    let t = h;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function shuffle<T>(list: T[], rand: () => number): T[] {
  const a = [...list];
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rand() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
}

/**
 * Picks `n` exercises at random, favouring the ones never solved and the ones failed last time
 * (weight 3 for "never tried", 4 for "failed last time", 1 for "already solved").
 */
export function pickRandom(pool: Exercise[], d: Data, n: number, seed: string): Exercise[] {
  const rand = rng(seed);
  const weight = (e: Exercise): number => {
    const a = d.attempts[e.id];
    if (!a) return 3;
    return a.last === 'ko' ? 4 : 1;
  };
  const keyed = pool.map((e) => ({ e, k: Math.pow(rand(), 1 / weight(e)) }));
  keyed.sort((a, b) => b.k - a.k);
  return keyed.slice(0, n).map((x) => x.e);
}
