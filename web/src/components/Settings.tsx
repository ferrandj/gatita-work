import { useEffect, useState, type ReactNode } from 'react';
import { contentErrors, getSubjects } from '../content';
import { CLIENT_HEADER } from '../lib/sync';
import { useApp } from '../state/app';
import { PdfUpload } from './PdfViewer';
import { play } from '../lib/sound';

export function Settings(): ReactNode {
  const { data, update } = useApp();
  const [pdfs, setPdfs] = useState<Record<string, { size: number }>>({});
  const [version, setVersion] = useState('');
  const refresh = (): void => { fetch('./api/courses').then((r) => r.json()).then((j) => setPdfs(j.pdf || {}), () => undefined); };
  useEffect(() => {
    refresh();
    fetch('./api/version').then((r) => r.json()).then((j) => setVersion(j.version), () => undefined);
  }, []);
  const errors = contentErrors();
  const courses = getSubjects().flatMap((s) => s.courses.map((c) => ({ s, c })));

  const exportData = (): void => {
    const blob = new Blob([JSON.stringify({ data }, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `gatita-progression-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
  };

  return (
    <div className="stack">
      <h1>⚙️ Réglages</h1>
      <section className="panel">
        <h2>Son et affichage</h2>
        <label className="switch"><input type="checkbox" checked={data.prefs.sound} onChange={(e) => update((d) => { d.prefs.sound = e.target.checked; })} /> Sons (musique des succès, bonne / mauvaise réponse)</label>
        <button type="button" className="btn ghost" onClick={() => play('achievement')}>🎵 Écouter la musique des succès</button>
        <div className="seg" role="group" aria-label="Thème">
          {(['auto', 'light', 'dark'] as const).map((t) => (
            <button key={t} type="button" aria-pressed={data.prefs.theme === t} onClick={() => update((d) => { d.prefs.theme = t; })}>{t === 'auto' ? 'Auto' : t === 'light' ? 'Clair' : 'Sombre'}</button>
          ))}
        </div>
      </section>

      <section className="panel">
        <h2>PDF des cours</h2>
        <p className="hint">Le PDF reste sur ton NAS (dossier <code>data/pdf/</code>), il n’est jamais publié.</p>
        <ul className="plain">
          {courses.map(({ s, c }) => (
            <li key={c.id}>
              <b>{s.short} · Cours {c.num}</b> — {pdfs[c.pdf] ? `✅ présent (${(pdfs[c.pdf].size / 1048576).toFixed(1)} Mo)` : '❌ absent'}
              <div><PdfUpload course={c.pdf} onDone={refresh} /></div>
            </li>
          ))}
        </ul>
      </section>

      <section className="panel">
        <h2>Contenu des cours</h2>
        <p>Les leçons et exercices sont lus dans des fichiers texte : ceux fournis avec l’app, plus ceux que tu ajoutes dans le dossier <code>data/content/</code> du NAS (même chemin = remplace le fichier fourni). Le format est décrit dans <code>CONTENT.md</code>.</p>
        {errors.length ? (
          <>
            <p className="err">⚠️ {errors.length} problème(s) dans les fichiers :</p>
            <ul className="errors">{errors.map((e, i) => <li key={i}><code>{e.file}{e.line ? ':' + e.line : ''}</code> — {e.message}</li>)}</ul>
          </>
        ) : <p>✅ Tous les fichiers sont valides.</p>}
        <button type="button" className="btn ghost" onClick={() => location.reload()}>Recharger le contenu</button>
      </section>

      <section className="panel">
        <h2>Ma progression</h2>
        <p className="hint">Elle est enregistrée sur le serveur (avec des sauvegardes automatiques dans <code>data/backups/</code>).</p>
        <div className="row">
          <button type="button" className="btn ghost" onClick={exportData}>💾 Exporter</button>
          <label className="btn ghost">📂 Importer (remplace)
            <input type="file" accept="application/json" hidden onChange={async (e) => {
              const f = e.target.files?.[0];
              if (!f || !confirm('Remplacer la progression par ce fichier ? (une sauvegarde de l’actuelle est faite avant)')) return;
              const res = await fetch('./api/state/import', { method: 'POST', headers: { 'Content-Type': 'application/json', ...CLIENT_HEADER }, body: await f.text() });
              if (res.ok) { localStorage.removeItem('gatita.pending'); localStorage.removeItem('gatita.cache'); location.reload(); } else alert('Import refusé : ' + await res.text());
            }} />
          </label>
        </div>
      </section>
      <p className="hint">Gatita {version}</p>
    </div>
  );
}
