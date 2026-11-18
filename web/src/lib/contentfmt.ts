import type { Chapter, Course, Exercise, Lesson, Ref, Step, Subject } from '../content/types';
import type { SampleDb } from '../content/types';

/**
 * Reads the course content from plain text files (see CONTENT.md at the root of the repository).
 *
 *   content/<matière>/subject.md                 front matter: id, title, short, color, icon, order
 *   content/<matière>/<cours>/course.md          front matter: id, num, title, pdf
 *   content/<matière>/<cours>/bases/<id>.sql     sample database (header lines "-- title:", "-- ref:", "-- note:", "-- schema:")
 *   content/<matière>/<cours>/<chapitre>/chapter.md   front matter: id, num, title, page, soon
 *   content/<matière>/<cours>/<chapitre>/*.md    one lesson per file (front matter id, title, summary),
 *                                                or a bank of exercises (front matter "type: exercices")
 *
 * Inside a lesson or a bank, blocks:
 *   ::: cours Titre de l’explication        ::: qcm <id>       ::: sql <id>      ::: ordre <id>    ::: trous <id>   ::: corrige <id>
 *   ref: 79 | I. A. Le SELECT | texte exact de la page
 *   <markdown>                              champs (ref, niveau, base, ordonne), puis sections "== question", "== choix"…
 *   :::                                     :::
 */

export interface ParseError { file: string; line: number; message: string }
export type Files = Record<string, string>;

interface Raw { meta: Record<string, string>; body: string; bodyLine: number }

function frontMatter(text: string): Raw {
  const lines = text.replace(/\r/g, '').split('\n');
  const meta: Record<string, string> = {};
  if (lines[0]?.trim() !== '---') return { meta, body: lines.join('\n'), bodyLine: 1 };
  let i = 1;
  for (; i < lines.length && lines[i].trim() !== '---'; i++) {
    const m = /^([\w-]+)\s*:\s*(.*)$/.exec(lines[i]);
    if (m) meta[m[1].toLowerCase()] = m[2].trim();
  }
  return { meta, body: lines.slice(i + 1).join('\n'), bodyLine: i + 2 };
}

export function parseRef(v: string): Ref | null {
  const [p, section = '', anchor = ''] = v.split('|').map((s) => s.trim());
  const page = Number(p.replace(/^p\.?\s*/i, ''));
  if (!Number.isInteger(page) || page < 1) return null;
  return { page, section, ...(anchor ? { anchor } : {}) };
}

const TYPES: Record<string, Exercise['type'] | 'cours'> = {
  cours: 'cours', qcm: 'qcm', sql: 'sql', ordre: 'order', order: 'order', trous: 'fill', fill: 'fill', corrige: 'open', 'corrigé': 'open', open: 'open'
};

interface Block { kind: Exercise['type'] | 'cours'; arg: string; fields: Record<string, string>; sections: Record<string, string>; body: string; line: number }

/** Splits a file body into ::: blocks. */
function blocks(body: string, firstLine: number, file: string, errors: ParseError[]): Block[] {
  const lines = body.split('\n');
  const out: Block[] = [];
  let i = 0;
  while (i < lines.length) {
    const head = /^:::\s*(\S+)\s*(.*)$/.exec(lines[i]);
    if (!head) {
      if (lines[i].trim() && !lines[i].trim().startsWith('<!--')) errors.push({ file, line: firstLine + i, message: 'Texte hors d’un bloc ::: (ignoré)' });
      i++;
      continue;
    }
    const start = i;
    const kind = TYPES[head[1].toLowerCase()];
    const inner: string[] = [];
    i++;
    while (i < lines.length && lines[i].trim() !== ':::') inner.push(lines[i++]);
    if (i >= lines.length) errors.push({ file, line: firstLine + start, message: 'Bloc ::: non fermé' });
    i++;
    if (!kind) { errors.push({ file, line: firstLine + start, message: `Type de bloc inconnu « ${head[1]} »` }); continue; }
    // fields: "key: value" lines at the top
    const fields: Record<string, string> = {};
    let j = 0;
    const FIELD = /^(ref|niveau|base|ordonne)\s*:\s*(.*)$/i;
    while (j < inner.length && FIELD.test(inner[j])) {
      const m = FIELD.exec(inner[j]) as RegExpExecArray;
      fields[m[1].toLowerCase()] = m[2].trim();
      j++;
    }
    const rest = inner.slice(j);
    const sections: Record<string, string> = {};
    let cur: string | null = null, buf: string[] = [];
    const flush = (): void => { if (cur) sections[cur] = buf.join('\n').trim(); };
    const free: string[] = [];
    for (const l of rest) {
      const s = /^==\s*(.+?)\s*$/.exec(l);
      if (s) { flush(); cur = s[1].toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, ''); buf = []; continue; }
      if (cur) buf.push(l); else free.push(l);
    }
    flush();
    out.push({ kind, arg: head[2].trim(), fields, sections, body: free.join('\n').trim(), line: firstLine + start });
  }
  return out;
}

const lines = (s = ''): string[] => s.split('\n').map((l) => l.replace(/^\s*[-*]\s+/, '').trim()).filter(Boolean);

function toExercise(b: Block, file: string, errors: ParseError[]): Exercise | null {
  const err = (message: string): null => { errors.push({ file, line: b.line, message: `${b.arg || '(sans id)'} : ${message}` }); return null; };
  const id = b.arg;
  if (!/^[\w-]+$/.test(id)) return err('identifiant manquant ou invalide (lettres, chiffres, - et _)');
  const ref = b.fields.ref ? parseRef(b.fields.ref) : null;
  if (!ref) return err('ref manquante ou invalide (ex. « ref: 79 | I. A. Le SELECT | texte de la page »)');
  const q = b.sections.question || b.body;
  if (!q) return err('== question manquante');
  const explain = b.sections.explication || '';
  if (!explain) return err('== explication manquante');
  const lv = Number(b.fields.niveau);
  const base = { id, q, explain, ref, ...(lv >= 1 && lv <= 3 ? { level: lv as 1 | 2 | 3 } : {}) };
  switch (b.kind) {
    case 'qcm': {
      const raw = (b.sections.choix || '').split('\n').filter((l) => /^\s*-\s*\[[ xX]\]/.test(l));
      if (raw.length < 2) return err('il faut au moins 2 choix « - [ ] … » / « - [x] … »');
      const choices = raw.map((l) => l.replace(/^\s*-\s*\[[ xX]\]\s*/, ''));
      const good = raw.map((l, i) => (/\[[xX]\]/.test(l) ? i : -1)).filter((i) => i >= 0);
      if (!good.length) return err('aucune bonne réponse cochée [x]');
      return { ...base, type: 'qcm', choices, answer: good.length === 1 ? good[0] : good };
    }
    case 'order': {
      const tokens = lines(b.sections.ordre || b.sections.morceaux);
      if (tokens.length < 2) return err('== ordre : au moins 2 morceaux, un par ligne');
      const extra = lines(b.sections.intrus);
      return { ...base, type: 'order', tokens, ...(extra.length ? { extra } : {}) };
    }
    case 'fill': {
      const text = b.sections.texte || '';
      const answer = lines(b.sections.reponses);
      const holes = (text.match(/\{\d+\}/g) || []).length;
      if (!holes || holes !== answer.length) return err(`== texte a ${holes} trou(s) {0}, {1}… mais == reponses en donne ${answer.length}`);
      const bank = [...new Set([...answer, ...lines(b.sections.intrus)])];
      return { ...base, type: 'fill', text, answer, bank };
    }
    case 'sql': {
      const solution = b.sections.solution || '';
      if (!solution) return err('== solution manquante');
      if (!b.fields.base) return err('base manquante (ex. « base: ladore »)');
      return {
        ...base, type: 'sql', db: b.fields.base, solution,
        ...(b.sections.verification ? { check: b.sections.verification } : {}),
        ...(/^(oui|yes|true|1)$/i.test(b.fields.ordonne || '') ? { ordered: true } : {}),
        ...(b.sections.indice ? { hint: b.sections.indice } : {})
      };
    }
    case 'open': {
      const solution = b.sections.solution || '';
      if (!solution) return err('== solution manquante');
      return { ...base, type: 'open', solution };
    }
    default: return null;
  }
}

function parseLessonFile(file: string, text: string, errors: ParseError[]): { lesson?: Lesson; bank?: Exercise[]; order: string } {
  const { meta, body, bodyLine } = frontMatter(text);
  const bs = blocks(body, bodyLine, file, errors);
  const steps: Step[] = [];
  for (const b of bs) {
    if (b.kind === 'cours') {
      const ref = b.fields.ref ? parseRef(b.fields.ref) : null;
      if (!ref) { errors.push({ file, line: b.line, message: `cours « ${b.arg} » : ref manquante ou invalide` }); continue; }
      if (!b.body) { errors.push({ file, line: b.line, message: `cours « ${b.arg} » : texte vide` }); continue; }
      steps.push({ kind: 'learn', title: b.arg || 'À retenir', body: b.body, ref });
    } else {
      const ex = toExercise(b, file, errors);
      if (ex) steps.push({ kind: 'ex', ex });
    }
  }
  const order = meta.ordre || file;
  if ((meta.type || '').toLowerCase().startsWith('exercice')) {
    return { bank: steps.flatMap((s) => (s.kind === 'ex' ? [s.ex] : [])), order };
  }
  if (!meta.id || !meta.title) { errors.push({ file, line: 1, message: 'leçon : il faut « id » et « title » dans l’en-tête ---' }); return { order }; }
  return { lesson: { id: meta.id, title: meta.title, summary: meta.summary || '', steps }, order };
}

export function parseDb(file: string, text: string, errors: ParseError[]): SampleDb | null {
  const id = (file.split('/').pop() || '').replace(/\.sql$/, '');
  const head: Record<string, string> = {};
  const schema: string[] = [];
  let inSchema = false;
  for (const l of text.replace(/\r/g, '').split('\n')) {
    if (!l.startsWith('--')) { if (l.trim()) break; continue; }
    const c = l.replace(/^--\s?/, '');
    const m = /^(title|ref|note|schema)\s*:\s*(.*)$/i.exec(c);
    if (m) { inSchema = m[1].toLowerCase() === 'schema'; if (!inSchema) head[m[1].toLowerCase()] = m[2].trim(); else if (m[2].trim()) schema.push(m[2].trim()); continue; }
    if (inSchema && c.trim()) schema.push(c.trim());
  }
  const ref = head.ref ? parseRef(head.ref) : null;
  if (!ref) { errors.push({ file, line: 1, message: 'base : ligne « -- ref: page | section » manquante' }); return null; }
  return { id, title: head.title || id, ref: { page: ref.page, section: ref.section }, schema: schema.join('\n'), ...(head.note ? { note: head.note } : {}), sql: text };
}

export interface Content { subjects: Subject[]; dbs: Record<string, SampleDb>; errors: ParseError[] }

const num = (v: string | undefined, d = 0): number => (Number.isFinite(Number(v)) && v !== undefined && v !== '' ? Number(v) : d);
const yes = (v?: string): boolean => /^(oui|yes|true|1)$/i.test(v || '');

/** Builds the whole tree (matières → cours → chapitres → leçons/exercices) from the files. */
export function parseContent(files: Files): Content {
  const errors: ParseError[] = [];
  const dbs: Record<string, SampleDb> = {};
  const paths = Object.keys(files).sort((a, b) => a.localeCompare(b, 'fr', { numeric: true }));
  const dirOf = (p: string): string => p.split('/').slice(0, -1).join('/');
  const subjects: (Subject & { order: number; dir: string })[] = [];
  const courses: (Course & { dir: string })[] = [];
  const chapters: (Chapter & { dir: string })[] = [];

  for (const p of paths) {
    const name = p.split('/').pop() as string;
    if (name === 'subject.md') {
      const { meta } = frontMatter(files[p]);
      if (!meta.id || !meta.title) { errors.push({ file: p, line: 1, message: 'matière : il faut id et title' }); continue; }
      subjects.push({ id: meta.id, title: meta.title, short: meta.short || meta.title, color: meta.color || '#7B4FE0', icon: meta.icon || '📚', courses: [], order: num(meta.order, 99), dir: dirOf(p) });
    } else if (name === 'course.md') {
      const { meta } = frontMatter(files[p]);
      if (!meta.id || !meta.title) { errors.push({ file: p, line: 1, message: 'cours : il faut id et title' }); continue; }
      courses.push({ id: meta.id, num: num(meta.num, 1), title: meta.title, pdf: meta.pdf || meta.id, chapters: [], dir: dirOf(p) });
    } else if (name === 'chapter.md') {
      const { meta } = frontMatter(files[p]);
      if (!meta.id || !meta.title) { errors.push({ file: p, line: 1, message: 'chapitre : il faut id et title' }); continue; }
      chapters.push({ id: meta.id, num: num(meta.num, 1), title: meta.title, page: num(meta.page, 1), lessons: [], exercises: [], ...(yes(meta.soon) ? { soon: true } : {}), dir: dirOf(p) });
    } else if (name.endsWith('.sql')) {
      const db = parseDb(p, files[p], errors);
      if (db) dbs[db.id] = db;
    }
  }
  for (const p of paths) {
    const name = p.split('/').pop() as string;
    if (!name.endsWith('.md') || ['subject.md', 'course.md', 'chapter.md'].includes(name) || name.toUpperCase() === 'README.MD') continue;
    const ch = chapters.find((c) => c.dir === dirOf(p));
    if (!ch) { errors.push({ file: p, line: 1, message: 'fichier hors d’un dossier de chapitre (il manque chapter.md ?)' }); continue; }
    const r = parseLessonFile(p, files[p], errors);
    if (r.lesson) ch.lessons.push(r.lesson);
    if (r.bank) ch.exercises.push(...r.bank);
  }
  const strip = <T extends { dir: string }>(x: T): Omit<T, 'dir'> => { const { dir: _d, ...rest } = x; return rest; };
  for (const ch of chapters) {
    const co = courses.find((c) => ch.dir.startsWith(c.dir + '/'));
    if (co) co.chapters.push(strip(ch) as Chapter);
    else errors.push({ file: ch.dir + '/chapter.md', line: 1, message: 'chapitre hors d’un dossier de cours (course.md ?)' });
  }
  for (const co of courses) {
    co.chapters.sort((a, b) => a.num - b.num);
    const su = subjects.find((s) => co.dir.startsWith(s.dir + '/'));
    if (su) su.courses.push(strip(co) as Course);
    else errors.push({ file: co.dir + '/course.md', line: 1, message: 'cours hors d’un dossier de matière (subject.md ?)' });
  }
  subjects.sort((a, b) => a.order - b.order);
  for (const s of subjects) s.courses.sort((a, b) => a.num - b.num);

  // ids must be unique, and SQL exercises must name an existing base
  const seen = new Map<string, string>();
  for (const s of subjects) for (const c of s.courses) for (const ch of c.chapters) {
    const all: { id: string; what: string }[] = [...ch.lessons.map((l) => ({ id: l.id, what: 'leçon' })),
      ...[...ch.lessons.flatMap((l) => l.steps.flatMap((st) => (st.kind === 'ex' ? [st.ex] : []))), ...ch.exercises].map((e) => ({ id: e.id, what: 'exercice' }))];
    for (const x of all) {
      if (seen.has(x.id)) errors.push({ file: ch.id, line: 0, message: `identifiant en double : ${x.id}` });
      seen.set(x.id, x.what);
    }
    for (const e of [...ch.lessons.flatMap((l) => l.steps.flatMap((st) => (st.kind === 'ex' ? [st.ex] : []))), ...ch.exercises]) {
      if (e.type === 'sql' && !dbs[e.db]) errors.push({ file: ch.id, line: 0, message: `${e.id} : base « ${e.db} » introuvable` });
    }
  }
  return { subjects: subjects.map(({ dir: _d, order: _o, ...s }) => s), dbs, errors };
}
