import type { Database, SqlJsStatic, SqlValue } from 'sql.js';
import { getDb } from '../content';
import type { DbId, SqlEx } from '../content/types';
import { normalizeSql, splitStatements, verbOf } from './sqlnorm';

/** Runs the queries of the exercises on the sample databases, in the browser (SQLite compiled to WebAssembly). */

let engine: Promise<SqlJsStatic> | null = null;
let loader: () => Promise<SqlJsStatic> = async () => {
  const [{ default: init }, { default: wasmUrl }] = await Promise.all([
    import('sql.js'),
    import('sql.js/dist/sql-wasm-browser.wasm?url')
  ]);
  return init({ locateFile: () => wasmUrl });
};

/** Tests run in Node, where sql.js finds its own WebAssembly file. */
export function setSqlLoader(l: () => Promise<SqlJsStatic>): void { loader = l; engine = null; }

export function sqlEngine(): Promise<SqlJsStatic> {
  engine = engine || loader().catch((e) => { engine = null; throw e; });
  return engine;
}

const pad = (n: number): string => String(n).padStart(2, '0');
const today = (): string => { const d = new Date(); return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`; };
const part = (v: unknown, from: number, len: number): number | null => {
  if (typeof v !== 'string' || v.length < from + len) return null;
  const n = Number(v.slice(from, from + len));
  return Number.isFinite(n) ? n : null;
};

export async function openDb(id: DbId): Promise<Database> {
  const SQL = await sqlEngine();
  const db = new SQL.Database();
  // Functions the course uses (Access): YEAR(), MONTH(), DAY(), NOW(), DATE()
  db.create_function('YEAR', (v: unknown) => part(v, 0, 4));
  db.create_function('MONTH', (v: unknown) => part(v, 5, 2));
  db.create_function('DAY', (v: unknown) => part(v, 8, 2));
  db.create_function('NOW', () => today());
  const src = getDb(id);
  if (!src) throw new Error('Base inconnue : ' + id);
  db.run(src.sql);
  return db;
}

export interface Table { columns: string[]; rows: SqlValue[][] }
export interface RunResult { ok: true; table: Table | null; changed: number; verb: string }
export interface RunError { ok: false; error: string }

/** Translates SQLite's messages into something a beginner can act on. */
export function explainError(msg: string): string {
  const m = msg.replace(/^Error: /, '');
  let r: RegExpExecArray | null;
  if ((r = /no such column: (.+)/.exec(m))) return `La colonne ${r[1]} n’existe pas (vérifie l’orthographe, ou la table qui la contient dans le FROM).`;
  if ((r = /no such table: (.+)/.exec(m))) return `La table ${r[1]} n’existe pas dans cette base.`;
  if ((r = /ambiguous column name: (.+)/.exec(m))) return `La colonne ${r[1]} existe dans plusieurs tables du FROM : précise laquelle (TABLE.${r[1]}).`;
  if ((r = /near "(.+?)": syntax error/.exec(m))) return `Erreur de syntaxe près de « ${r[1]} ».`;
  if (/incomplete input/.test(m)) return 'La requête est incomplète (parenthèse ou guillemet non fermé ?).';
  if (/misuse of aggregate/.test(m)) return 'Fonction d’agrégat mal placée : une condition sur SUM, COUNT… se met dans HAVING, pas dans WHERE.';
  if (/a GROUP BY clause is required/.test(m)) return 'Il manque un GROUP BY.';
  return m;
}

/** Runs a script (one or several statements) and returns the result of the last SELECT, if any. */
export function runScript(db: Database, sql: string): RunResult | RunError {
  const stmts = splitStatements(normalizeSql(sql));
  if (!stmts.length) return { ok: false, error: 'La requête est vide.' };
  let table: Table | null = null, changed = 0, verb = '';
  try {
    for (const s of stmts) {
      verb = verbOf(s);
      const res = db.exec(s);
      if (res.length) table = { columns: res[res.length - 1].columns, rows: res[res.length - 1].values };
      else if (verb === 'SELECT' || verb === 'WITH') table = { columns: [], rows: [] };
      changed += db.getRowsModified();
    }
  } catch (e) {
    return { ok: false, error: explainError(String((e as Error).message || e)) };
  }
  return { ok: true, table, changed, verb };
}

const norm = (v: SqlValue): string | number | null => {
  if (v === null || v === undefined) return null;
  if (typeof v === 'number') return Math.round(v * 1e6) / 1e6;
  if (v instanceof Uint8Array) return `[${v.length} octets]`;
  const s = String(v).trim();
  // numbers stored as text compare as numbers
  return s !== '' && /^-?\d+(\.\d+)?$/.test(s) ? Number(s) : s;
};

const keyOf = (row: SqlValue[]): string => JSON.stringify(row.map(norm));

export type Verdict = { ok: true; note?: string } | { ok: false; why: string };

/** Compares the learner's result with the expected one (same columns in the same order, same rows; row order only if asked). */
export function compareTables(got: Table | null, want: Table, ordered: boolean): Verdict {
  if (!got) return { ok: false, why: 'Ta requête ne renvoie pas de tableau : il faut un SELECT.' };
  if (got.columns.length !== want.columns.length) {
    return { ok: false, why: `Ta requête affiche ${got.columns.length} colonne(s), il en faut ${want.columns.length} (${want.columns.join(', ')}).` };
  }
  if (got.rows.length !== want.rows.length) {
    return { ok: false, why: `Ta requête renvoie ${got.rows.length} ligne(s), le bon résultat en a ${want.rows.length}.` };
  }
  const g = got.rows.map(keyOf), w = want.rows.map(keyOf);
  const sameSet = [...g].sort().join('\n') === [...w].sort().join('\n');
  if (!sameSet) {
    // maybe only the columns are in another order
    const gs = got.rows.map((r) => JSON.stringify(r.map(norm).map(String).sort())).sort().join('\n');
    const ws = want.rows.map((r) => JSON.stringify(r.map(norm).map(String).sort())).sort().join('\n');
    if (gs === ws) return { ok: false, why: 'Les bonnes valeurs sont là, mais les colonnes ne sont pas dans l’ordre demandé.' };
    return { ok: false, why: 'Le nombre de lignes est bon mais leur contenu est différent : vérifie les conditions et les colonnes.' };
  }
  if (ordered && g.join('\n') !== w.join('\n')) return { ok: false, why: 'Les bonnes lignes sont là, mais pas dans le bon ordre (ORDER BY ?).' };
  return { ok: true };
}

export interface Graded { verdict: Verdict; mine: RunResult | RunError; expected: Table | null }

/** Runs the learner's query and the solution on two fresh copies of the database and compares the results. */
export async function grade(ex: SqlEx, answer: string): Promise<Graded> {
  const [mineDb, refDb] = await Promise.all([openDb(ex.db), openDb(ex.db)]);
  try {
    const mine = runScript(mineDb, answer);
    const ref = runScript(refDb, ex.solution);
    if (!ref.ok) throw new Error('solution invalide pour ' + ex.id + ' : ' + ref.error);
    let expected = ref.table;
    let got: Table | null = mine.ok ? mine.table : null;
    if (ex.check) {
      const c = runScript(refDb, ex.check);
      expected = c.ok ? c.table : null;
      if (mine.ok) {
        const mc = runScript(mineDb, ex.check);
        got = mc.ok ? mc.table : null;
      }
    }
    if (!mine.ok) return { verdict: { ok: false, why: mine.error }, mine, expected };
    if (ex.check && mine.verb === 'SELECT') return { verdict: { ok: false, why: 'Ici il faut modifier la table (requête d’action), pas seulement l’afficher.' }, mine, expected };
    return { verdict: compareTables(got, expected as Table, !!ex.ordered), mine, expected };
  } finally {
    mineDb.close();
    refDb.close();
  }
}

/** Runs a query just to show its result (button « Exécuter »). */
export async function preview(db: DbId, sql: string): Promise<RunResult | RunError> {
  const d = await openDb(db);
  try { return runScript(d, sql); } finally { d.close(); }
}
