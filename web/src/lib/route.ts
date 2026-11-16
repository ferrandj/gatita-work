import { useEffect, useState } from 'react';

/** Hash routes, so the app works from any folder (reverse proxy sub-path) and the back button just works. */
export type Route =
  | { name: 'home' } | { name: 'subject'; id: string } | { name: 'course'; id: string }
  | { name: 'chapter'; id: string; tab: 'lessons' | 'exercises' } | { name: 'lesson'; id: string }
  | { name: 'exercise'; id: string } | { name: 'random'; scope: string; seed: string }
  | { name: 'pdf'; course: string; page: number; q: string } | { name: 'trophies' } | { name: 'settings' };

export function parseRoute(hash: string): Route {
  const [path, query = ''] = hash.replace(/^#\/?/, '').split('?');
  const qs = new URLSearchParams(query);
  const p = path.split('/').map(decodeURIComponent);
  switch (p[0]) {
    case 's': return { name: 'subject', id: p[1] || '' };
    case 'c': return { name: 'course', id: p[1] || '' };
    case 'ch': return { name: 'chapter', id: p[1] || '', tab: qs.get('t') === 'ex' ? 'exercises' : 'lessons' };
    case 'l': return { name: 'lesson', id: p[1] || '' };
    case 'x': return { name: 'exercise', id: p[1] || '' };
    case 'r': return { name: 'random', scope: p[1] || 'all', seed: qs.get('n') || '' };
    case 'pdf': return { name: 'pdf', course: p[1] || '', page: Math.max(1, Number(p[2]) || 1), q: qs.get('q') || '' };
    case 'succes': return { name: 'trophies' };
    case 'reglages': return { name: 'settings' };
    default: return { name: 'home' };
  }
}

export const href = {
  home: (): string => '#/',
  subject: (id: string): string => `#/s/${id}`,
  course: (id: string): string => `#/c/${id}`,
  chapter: (id: string, ex = false): string => `#/ch/${id}${ex ? '?t=ex' : ''}`,
  lesson: (id: string): string => `#/l/${id}`,
  exercise: (id: string): string => `#/x/${id}`,
  random: (scope: string): string => `#/r/${scope}?n=${Date.now().toString(36)}`,
  pdf: (course: string, page: number, q?: string): string => `#/pdf/${course}/${page}${q ? '?q=' + encodeURIComponent(q) : ''}`,
  trophies: (): string => '#/succes',
  settings: (): string => '#/reglages'
};

export function useRoute(): Route {
  const [r, setR] = useState(() => parseRoute(location.hash));
  useEffect(() => {
    const on = (): void => { setR(parseRoute(location.hash)); window.scrollTo(0, 0); };
    window.addEventListener('hashchange', on);
    return () => window.removeEventListener('hashchange', on);
  }, []);
  return r;
}

export const go = (h: string): void => { location.hash = h; };
