// Copies the files pdf.js loads at run time (fonts, character maps, image decoders) next to the app.
import { cpSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
const here = dirname(fileURLToPath(import.meta.url));
const src = join(here, '../node_modules/pdfjs-dist');
const out = join(here, '../public/pdfjs');
mkdirSync(out, { recursive: true });
for (const d of ['standard_fonts', 'cmaps', 'wasm']) cpSync(join(src, d), join(out, d), { recursive: true });
