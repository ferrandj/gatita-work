import { useState, type ReactNode } from 'react';
import type { Def } from '../lib/achievements';
import { useApp } from '../state/app';
import { Bar, Medal, metalName } from './common';

export function Trophies(): ReactNode {
  const { defs, data, stats } = useApp();
  const [sel, setSel] = useState<string | null>(null);
  const got = defs.filter((d) => data.ach[d.id]).length;
  const fams = new Map<string, Def[]>();
  defs.forEach((d) => fams.set(d.family, [...(fams.get(d.family) || []), d]));
  const chosen = defs.find((d) => d.id === sel);
  return (
    <div className="stack">
      <h1>🏆 Succès</h1>
      <section className="ach-sum">
        <div className="ach-big"><b>{got}</b> / {defs.length} médailles</div>
        <Bar value={got} max={defs.length} label="Succès débloqués" />
        <small>🔥 {stats.currentDays} jour(s) de suite · record {stats.bestDays} · meilleure série de bonnes réponses : {stats.bestRun}</small>
      </section>
      {chosen && (
        <aside className="ach-detail" aria-live="polite">
          <Medal def={chosen} locked={!data.ach[chosen.id]} size={96} />
          <div>
            <h2>{chosen.title}</h2>
            <p>{chosen.desc}</p>
            <p className="hint">{data.ach[chosen.id] ? `✅ Débloqué le ${new Date(data.ach[chosen.id]).toLocaleDateString('fr-FR')} · ${metalName(chosen.rank)}` : `🔒 ${Math.min(chosen.value, chosen.n)} / ${chosen.n}`}</p>
          </div>
          <button type="button" className="btn ghost" onClick={() => setSel(null)}>Fermer</button>
        </aside>
      )}
      <div className="ach-fams">
        {[...fams.values()].map((tiers) => (
          <article key={tiers[0].family} className="ach-fam">
            <div className="ach-ft"><b>{tiers[0].icon} {tiers[0].famName}</b><small>{tiers.filter((d) => data.ach[d.id]).length}/{tiers.length}</small></div>
            <div className="ach-tiers">
              {tiers.map((d) => (
                <button key={d.id} type="button" className={'ach-b' + (data.ach[d.id] ? ' on' : '')} aria-pressed={sel === d.id}
                  aria-label={d.title + (data.ach[d.id] ? ' — débloqué' : ' — verrouillé')} title={d.title} onClick={() => setSel(sel === d.id ? null : d.id)}>
                  <Medal def={d} locked={!data.ach[d.id]} size={54} />
                </button>
              ))}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

/** Full-screen celebration of a medal just unlocked (the music is played by the app state). */
export function Celebration(): ReactNode {
  const { celebrating: d, dismissCelebration } = useApp();
  if (!d) return null;
  return (
    <div className="celebrate" role="dialog" aria-modal="true" aria-labelledby="cel-title" onClick={dismissCelebration}>
      <div className="confetti" aria-hidden="true">{Array.from({ length: 28 }, (_, i) => <i key={i} style={{ '--i': i } as React.CSSProperties} />)}</div>
      <div className="cel-card" onClick={(e) => e.stopPropagation()}>
        <p className="eyebrow">Succès débloqué !</p>
        <div className="cel-medal"><Medal def={d} size={140} /></div>
        <h2 id="cel-title">{d.title}</h2>
        <p>{d.desc}</p>
        <p className="hint">Médaille {metalName(d.rank)}</p>
        <button type="button" className="btn big" autoFocus onClick={dismissCelebration}>Miaou ! 🐾</button>
      </div>
    </div>
  );
}
