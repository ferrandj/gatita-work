/**
 * Finds a short sentence of the course on a PDF page, so the viewer can highlight it.
 * The text of a PDF page comes in pieces (lines, words, sometimes letters), so the comparison ignores spaces, case,
 * accents, typographic quotes and line-break hyphens.
 */

export interface TextPiece { str: string }

const fold = (s: string): string =>
  s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()
    .replace(/[’‘`´]/g, "'").replace(/[“”«»]/g, '"').replace(/[­​]/g, '');

const keep = (ch: string, dropHyphens: boolean): boolean => !/\s/.test(ch) && !(dropHyphens && ch === '-');

/** Indexes of the pieces that contain the anchor (empty when it is not on the page). */
export function findAnchor(pieces: TextPiece[], anchor: string): number[] {
  for (const dropHyphens of [false, true]) {
    let hay = '';
    const owner: number[] = [];
    pieces.forEach((p, i) => {
      for (const ch of fold(p.str)) if (keep(ch, dropHyphens)) { hay += ch; owner.push(i); }
    });
    const needle = [...fold(anchor)].filter((ch) => keep(ch, dropHyphens)).join('');
    if (!needle) return [];
    const at = hay.indexOf(needle);
    if (at >= 0) return [...new Set(owner.slice(at, at + needle.length))];
  }
  return [];
}
