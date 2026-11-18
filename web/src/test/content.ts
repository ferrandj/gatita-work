import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { loadFiles } from '../content';
import type { Content, Files } from '../lib/contentfmt';

export const CONTENT_DIR = join(__dirname, '../../../content');

export function readContentDir(dir = CONTENT_DIR): Files {
  const files: Files = {};
  const walk = (d: string): void => {
    for (const n of readdirSync(d)) {
      const p = join(d, n);
      if (statSync(p).isDirectory()) walk(p);
      else if (/\.(md|sql)$/.test(n)) files[relative(dir, p)] = readFileSync(p, 'utf8');
    }
  };
  walk(dir);
  return files;
}

let loaded: Content | null = null;
/** Loads the real content of the repository into the registry (once). */
export function loadRepoContent(): Content {
  loaded = loaded || loadFiles(readContentDir());
  return loaded;
}
