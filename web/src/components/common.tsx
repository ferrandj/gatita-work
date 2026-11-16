import type { ReactNode } from 'react';
import type { Ref } from '../content/types';
import { locate, findCourse } from '../content';
import { href } from '../lib/route';
import { useApp } from '../state/app';
import { METALS, type Def } from '../lib/achievements';

/** "📖 Cours 1 · p. 79 · I. A. Le SELECT": opens the PDF of the course at that page, the quoted text highlighted. */
export function RefLink({ r, course, compact }: { r: Ref; course: string; compact?: boolean }): ReactNode {
  const { update } = useApp();
  const c = findCourse(course)?.course;
  return (
    <a className="ref" href={href.pdf(course, r.page, r.anchor)} onClick={() => update((d) => { d.counters.pdf++; })}
      title="Ouvrir le cours à ce passage">
      <span aria-hidden="true">📖</span>
      <span>{compact ? '' : `Cours ${c?.num ?? ''} · `}p. {r.page} · {r.section}</span>
    </a>
  );
}

/** Course id of a lesson / exercise id (for the 📖 links). */
export const courseOf = (id: string): string => locate(id)?.course.id || '';

export function Crumbs({ items }: { items: { label: string; to?: string }[] }): ReactNode {
  return (
    <nav className="crumbs" aria-label="Fil d’Ariane">
      {items.map((it, i) => (
        <span key={i}>{i > 0 && <span className="sep" aria-hidden="true">›</span>}{it.to ? <a href={it.to}>{it.label}</a> : <span aria-current="page">{it.label}</span>}</span>
      ))}
    </nav>
  );
}

export function Bar({ value, max, label }: { value: number; max: number; label: string }): ReactNode {
  const pct = max ? Math.round((value / max) * 100) : 0;
  return (
    <div className="bar" role="progressbar" aria-label={label} aria-valuemin={0} aria-valuemax={max} aria-valuenow={value}>
      <i style={{ width: pct + '%' }} />
    </div>
  );
}

const METAL = [
  ['#B0753A', '#E3A869', '#7A4A1C'],
  ['#8E9AA6', '#DCE3EA', '#5C6670'],
  ['#C99A06', '#FFE07A', '#8A6500'],
  ['#6FA3B8', '#D6F1FA', '#3E6A7A'],
  ['#7C5CFA', '#E9D5FF', '#4C1D95']
];

/** A medal: metal ring by rank (bronze → diamant), the family icon and the tier number. */
export function Medal({ def, locked, size = 64 }: { def: Def; locked?: boolean; size?: number }): ReactNode {
  const [dark, light, ink] = locked ? ['#B9B4C7', '#E7E3EF', '#8A849A'] : METAL[def.rank];
  const id = `g${def.id.replace(/[^a-z0-9]/gi, '')}${locked ? 'l' : ''}`;
  return (
    <svg className="medal" viewBox="0 0 64 64" width={size} height={size} aria-hidden="true">
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor={light} /><stop offset="1" stopColor={dark} /></linearGradient>
      </defs>
      <path d="M20 2h10l-4 16h-10zM44 2h-10l4 16h10z" fill={locked ? '#CFCADB' : def.color} />
      <circle cx="32" cy="38" r="23" fill={`url(#${id})`} stroke={ink} strokeWidth="2" />
      <circle cx="32" cy="38" r="17" fill="none" stroke={ink} strokeOpacity=".35" strokeWidth="1.5" strokeDasharray="2 2.5" />
      <text x="32" y="38" textAnchor="middle" fontSize="15" dominantBaseline="middle" opacity={locked ? 0.35 : 1}>{def.icon}</text>
      <text x="32" y="55" textAnchor="middle" fontSize="8.5" fontWeight="700" fill={ink}>{def.label}</text>
    </svg>
  );
}

export const metalName = (rank: number): string => METALS[rank] || '';
