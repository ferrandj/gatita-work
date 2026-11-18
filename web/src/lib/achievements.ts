import { allExercises, allLessons, allChapters, chapterExercises } from '../content';
import { dayOf, dayStreaks, solved, type Data } from './progress';

/**
 * Achievements ("succès"). Each family has tiers; each tier is a medal whose metal grows with the tier.
 * Unlocking is permanent: the day is saved in `data.ach` and nothing ever removes it.
 */

export interface Stats {
  lessonsDone: number; lessonsTotal: number; perfect: number;
  solved: number; exTotal: number; sqlSolved: number; sqlTotal: number;
  chaptersMastered: number; chaptersTotal: number;
  bestRun: number; bestDays: number; currentDays: number;
  random: number; pdf: number; answers: number;
}

export function computeStats(d: Data, today = dayOf()): Stats {
  const exs = allExercises(), lessons = allLessons();
  const chapters = allChapters().filter((c) => !c.soon && chapterExercises(c).length);
  const sql = exs.filter((e) => e.type === 'sql');
  const ds = dayStreaks(Object.keys(d.days), today);
  return {
    lessonsDone: lessons.filter((l) => d.lessons[l.id]).length, lessonsTotal: lessons.length,
    perfect: lessons.filter((l) => d.lessons[l.id]?.perfect).length,
    solved: exs.filter((e) => solved(d, e.id)).length, exTotal: exs.length,
    sqlSolved: sql.filter((e) => solved(d, e.id)).length, sqlTotal: sql.length,
    chaptersMastered: chapters.filter((c) => chapterExercises(c).every((e) => solved(d, e.id))).length, chaptersTotal: chapters.length,
    bestRun: d.counters.bestRun, bestDays: ds.best, currentDays: ds.current,
    random: d.counters.random, pdf: d.counters.pdf,
    answers: Object.values(d.days).reduce((n, v) => n + v, 0)
  };
}

export interface Def {
  id: string; family: string; famName: string; icon: string; color: string;
  n: number; value: number; rank: number; label: string; title: string; desc: string; met: boolean;
}

const LADDER = [1, 2, 3, 5, 7, 10, 15, 20, 25, 30, 40, 50, 75, 100, 150, 200];
/** 1, 2, 3, 5, 7, 10… up to `max`, ending exactly on it ("tout fait"). */
export function ladder(max: number, from: number[] = LADDER): number[] {
  if (max < 1) return [];
  const t = from.filter((n) => n < max);
  t.push(max);
  return t;
}
/** Metal of tier i out of count: the last tier is always the top one (0 bronze … 4 diamant). */
export const rankOf = (i: number, count: number): number => (count <= 1 ? 2 : Math.round((i * 4) / (count - 1)));

interface Family { key: string; name: string; icon: string; color: string; tiers: number[]; value: number; title: (n: number, last: boolean) => string; desc: (n: number) => string; label?: (n: number) => string }

export function buildDefs(d: Data): { defs: Def[]; stats: Stats } {
  const s = computeStats(d);
  const fams: Family[] = [
    { key: 'lessons', name: 'Leçons terminées', icon: '📘', color: '#7B4FE0', tiers: ladder(s.lessonsTotal), value: s.lessonsDone,
      title: (n, last) => (last ? 'Toutes les leçons !' : n === 1 ? 'Première leçon' : `${n} leçons`), desc: (n) => `Termine ${n} leçon(s) du parcours.` },
    { key: 'perfect', name: 'Sans faute', icon: '⭐', color: '#E0A100', tiers: [1, 3, 5, 10, 15], value: s.perfect,
      title: (n) => (n === 1 ? 'Leçon parfaite' : `${n} leçons parfaites`), desc: (n) => `Termine ${n} leçon(s) sans aucune erreur.` },
    { key: 'solved', name: 'Exercices réussis', icon: '✅', color: '#1E8A4C', tiers: ladder(s.exTotal, [1, 5, 10, 25, 50, 75, 100, 150]), value: s.solved,
      title: (n, last) => (last ? 'Tous les exercices !' : n === 1 ? 'Premier exercice réussi' : `${n} exercices réussis`), desc: (n) => `Réussis ${n} exercice(s) différent(s).` },
    { key: 'sql', name: 'Requêtes SQL', icon: '🐱‍💻', color: '#0F7C8C', tiers: ladder(s.sqlTotal, [1, 3, 5, 10, 20, 30, 45]), value: s.sqlSolved,
      title: (n, last) => (last ? 'Reine du SQL' : n === 1 ? 'Première requête juste' : `${n} requêtes justes`), desc: (n) => `Écris ${n} requête(s) SQL qui donnent le bon résultat.` },
    { key: 'run', name: 'Sans se tromper', icon: '🔥', color: '#E8692A', tiers: [3, 5, 10, 15, 25, 40], value: s.bestRun,
      title: (n) => `${n} bonnes réponses d’affilée`, desc: (n) => `Enchaîne ${n} bonnes réponses sans erreur.` },
    { key: 'days', name: 'Régularité', icon: '📅', color: '#C2255C', tiers: [2, 3, 5, 7, 14, 21, 30], value: s.bestDays,
      title: (n) => `${n} jours de suite`, desc: (n) => `Révise ${n} jours d’affilée (au moins une réponse par jour).`, label: (n) => n + 'j' },
    { key: 'chapters', name: 'Chapitres maîtrisés', icon: '🏆', color: '#9A6200', tiers: ladder(s.chaptersTotal), value: s.chaptersMastered,
      title: (n, last) => (last ? 'Cours maîtrisé' : n === 1 ? 'Premier chapitre maîtrisé' : `${n} chapitres maîtrisés`), desc: () => 'Réussis tous les exercices d’un chapitre.' },
    { key: 'random', name: 'Au hasard', icon: '🎲', color: '#5B6BD6', tiers: [1, 3, 5, 10, 25], value: s.random,
      title: (n) => (n === 1 ? 'Première série au hasard' : `${n} séries au hasard`), desc: (n) => `Termine ${n} série(s) d’exercices au hasard.` },
    { key: 'pdf', name: 'Retour au livre', icon: '📖', color: '#6B4F2A', tiers: [1, 5, 10, 25, 50], value: s.pdf,
      title: (n) => (n === 1 ? 'Première visite du cours' : `${n} visites du cours`), desc: (n) => `Ouvre ${n} fois le passage du cours (lien 📖).` }
  ];
  const defs: Def[] = [];
  for (const f of fams) f.tiers.forEach((n, i) => defs.push({
    id: `${f.key}:${n}`, family: f.key, famName: f.name, icon: f.icon, color: f.color, n, value: f.value,
    rank: rankOf(i, f.tiers.length), label: f.label ? f.label(n) : String(n),
    title: f.title(n, i === f.tiers.length - 1 && f.tiers.length > 1 && ['lessons', 'solved', 'sql', 'chapters'].includes(f.key)),
    desc: f.desc(n), met: f.value >= n
  }));
  return { defs, stats: s };
}

/** Achievements met now and not yet recorded. */
export const newlyMet = (defs: Def[], d: Data): Def[] => defs.filter((x) => x.met && !d.ach[x.id]);

export const METALS = ['Bronze', 'Argent', 'Or', 'Platine', 'Diamant'];
