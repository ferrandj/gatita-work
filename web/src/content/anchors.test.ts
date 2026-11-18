/**
 * Checks that every quoted anchor really is on the page it points to. Needs the course PDF, which is never committed:
 *   GATITA_PDF=/path/to/cours1.pdf npx vitest run src/content/anchors.test.ts
 */
import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { allLessons, allExercises } from './index';
import { loadRepoContent } from '../test/content';
import { findAnchor } from '../lib/pdfmatch';
import type { Ref } from './types';

const PDF = process.env.GATITA_PDF;

describe.skipIf(!PDF)('anchors in the course PDF', () => {
  loadRepoContent();
  const refs: { id: string; ref: Ref }[] = [];
  for (const l of allLessons()) l.steps.forEach((s, i) => { if (s.kind === 'learn') refs.push({ id: `${l.id}#${i}`, ref: s.ref }); });
  for (const e of allExercises()) refs.push({ id: e.id, ref: e.ref });

  it('finds every anchor on its page', async () => {
    const pdfjs = await import('pdfjs-dist/legacy/build/pdf.mjs');
    const doc = await pdfjs.getDocument({ data: new Uint8Array(readFileSync(PDF as string)) }).promise;
    const cache = new Map<number, { str: string }[]>();
    const missing: string[] = [];
    for (const { id, ref } of refs) {
      if (!ref.anchor) continue;
      if (!cache.has(ref.page)) {
        const page = await doc.getPage(ref.page);
        const tc = await page.getTextContent();
        cache.set(ref.page, tc.items.filter((it) => 'str' in it) as { str: string }[]);
      }
      if (!findAnchor(cache.get(ref.page)!, ref.anchor).length) missing.push(`${id} p.${ref.page}: ${ref.anchor}`);
    }
    expect(missing).toEqual([]);
  }, 120000);
});
