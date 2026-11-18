/**
 * The course writes SQL the way Microsoft Access reads it (page 113: « ses séparateurs # et [ utilisés à la place des ' et " du
 * SQL standard », accepted at the exam). The sample databases run on SQLite, so a query typed "like in the course" is
 * translated first:
 *   #01/09/2019#  -> '2019-09-01'     (dates between # are day/month/year in the course)
 *   "Paris"       -> 'Paris'          (text between double quotes)
 *   LIKE "Etui*"  -> LIKE 'Etui%'     (* = any text, ? = one character, in a LIKE pattern)
 *   Facture.#NumClient -> Facture.NumClient   (the # that marks a foreign key on paper)
 *   “ ” « »       -> "                (quotes from a phone keyboard)
 * [Table name] stays as it is: SQLite understands it.
 */

const DATE_FR = /^\s*(\d{1,2})\/(\d{1,2})\/(\d{4})\s*$/;
const DATE_ISO = /^\s*(\d{4})-(\d{2})-(\d{2})\s*$/;

function isoOf(text: string): string | null {
  let m = DATE_FR.exec(text);
  if (m) return `${m[3]}-${m[2].padStart(2, '0')}-${m[1].padStart(2, '0')}`;
  m = DATE_ISO.exec(text);
  if (m) return `${m[1]}-${m[2]}-${m[3]}`;
  return null;
}

const quote = (s: string): string => "'" + s.replace(/'/g, "''") + "'";

export function normalizeSql(input: string): string {
  const src = input.replace(/[“”«»]/g, '"').replace(/ /g, ' ').replace(/[‘’]/g, (c, i, s: string) => {
    // a typographic apostrophe inside a word (l’année) stays; one used as a quote becomes a quote
    const prev = s[i - 1] || ' ', next = s[i + 1] || ' ';
    return /\p{L}/u.test(prev) && /\p{L}/u.test(next) ? c : "'";
  });
  let out = '';
  let i = 0;
  let lastWord = '';
  const push = (s: string, word?: string): void => { out += s; if (word !== undefined) lastWord = word; };
  while (i < src.length) {
    const c = src[i];
    if (c === "'" || c === '"') {
      let j = i + 1, text = '';
      while (j < src.length) {
        if (src[j] === c && src[j + 1] === c) { text += c; j += 2; continue; }
        if (src[j] === c) break;
        text += src[j++];
      }
      const isLike = lastWord === 'LIKE';
      const value = isLike ? text.replace(/\*/g, '%').replace(/\?/g, '_') : text;
      push(quote(value), 'STRING');
      i = j + 1;
      continue;
    }
    if (c === '[') {
      const j = src.indexOf(']', i);
      const end = j < 0 ? src.length : j + 1;
      push(src.slice(i, end), 'IDENT');
      i = end;
      continue;
    }
    if (c === '#') {
      const j = src.indexOf('#', i + 1);
      const iso = j > 0 ? isoOf(src.slice(i + 1, j)) : null;
      if (iso) { push(quote(iso), 'STRING'); i = j + 1; continue; }
      i++; // foreign-key marker: dropped
      continue;
    }
    if (c === '-' && src[i + 1] === '-') { // comment until end of line
      const j = src.indexOf('\n', i);
      const end = j < 0 ? src.length : j;
      push(src.slice(i, end));
      i = end;
      continue;
    }
    if (/[\p{L}_]/u.test(c)) {
      let j = i;
      while (j < src.length && /[\p{L}\p{N}_]/u.test(src[j])) j++;
      const w = src.slice(i, j);
      push(w, w.toUpperCase());
      i = j;
      continue;
    }
    if (/\s/.test(c)) { push(c); i++; continue; }
    push(c, c);
    i++;
  }
  return out;
}

/** Splits a script into statements (on ; outside quotes and brackets), dropping empty ones. */
export function splitStatements(sql: string): string[] {
  const parts: string[] = [];
  let cur = '', q: string | null = null;
  for (const ch of sql) {
    if (q) { cur += ch; if (ch === q) q = null; continue; }
    if (ch === "'" || ch === '"') q = ch;
    else if (ch === '[') q = ']';
    if (ch === ';') { if (cur.trim()) parts.push(cur.trim()); cur = ''; continue; }
    cur += ch;
  }
  if (cur.trim()) parts.push(cur.trim());
  return parts;
}

/** First keyword of a statement, upper-cased (SELECT, INSERT, UPDATE…). */
export const verbOf = (stmt: string): string => (/^\s*\(?\s*([A-Za-z]+)/.exec(stmt)?.[1] || '').toUpperCase();
