import { useEffect, useMemo, useState, type ReactNode } from 'react';
import type { Exercise as Ex, FillEx, OrderEx, QcmEx, SqlEx } from '../content/types';
import { getDb } from '../content';
import { Md } from '../lib/md';
import { rng, shuffle } from '../lib/pick';
import { recordAttempt } from '../lib/progress';
import { grade, preview, type RunError, type RunResult, type Table } from '../lib/sqlrun';
import { useApp } from '../state/app';
import { RefLink } from './common';

export interface Outcome { ok: boolean; firstTry: boolean }

const LEVEL = ['', 'Découverte', 'Application', 'Type examen'];
const KIND: Record<Ex['type'], string> = { qcm: 'QCM', order: 'Remets dans l’ordre', fill: 'Texte à trous', sql: 'Requête à écrire', open: 'Exercice corrigé' };

/** One exercise: question, answer widget, check, correction with the link to the course. */
export function Exercise({ ex, course, onNext, nextLabel = 'Continuer' }: { ex: Ex; course: string; onNext?: (o: Outcome) => void; nextLabel?: string }): ReactNode {
  const { update, answered } = useApp();
  const [result, setResult] = useState<null | { ok: boolean; why?: string }>(null);
  const [tries, setTries] = useState(0);
  const [reveal, setReveal] = useState(false);
  const [firstOk, setFirstOk] = useState<boolean | null>(null);

  useEffect(() => { setResult(null); setTries(0); setReveal(false); setFirstOk(null); }, [ex.id]);

  const submit = (ok: boolean, why?: string): void => {
    update((d) => recordAttempt(d, ex.id, ok));
    answered(ok);
    if (firstOk === null) setFirstOk(ok);
    setTries((t) => t + 1);
    setResult({ ok, why });
    if (ok) setReveal(true);
  };
  const retry = (): void => setResult(null);
  const done = result?.ok || reveal;

  return (
    <article className={'ex' + (result ? (result.ok ? ' is-ok' : ' is-ko') : '')} aria-labelledby={'q-' + ex.id}>
      <div className="ex-tags">
        <span className="tag">{KIND[ex.type]}</span>
        {ex.level && <span className={'tag lv' + ex.level}>{LEVEL[ex.level]}</span>}
      </div>
      <div id={'q-' + ex.id} className="ex-q"><Md src={ex.q} /></div>

      {ex.type === 'qcm' && <Qcm ex={ex} locked={!!result} onCheck={submit} />}
      {ex.type === 'order' && <Order ex={ex} locked={!!result} onCheck={submit} />}
      {ex.type === 'fill' && <Fill ex={ex} locked={!!result} onCheck={submit} />}
      {ex.type === 'sql' && <Sql ex={ex} locked={!!result} onCheck={submit} />}
      {ex.type === 'open' && !reveal && (
        <div className="ex-actions">
          <textarea className="code" rows={5} placeholder="Écris ta réponse ici (ou sur papier), puis compare avec le corrigé." spellCheck={false} autoCapitalize="off" />
          <button type="button" className="btn" onClick={() => setReveal(true)}>Voir le corrigé</button>
        </div>
      )}

      {result && (
        <div className={'feedback ' + (result.ok ? 'ok' : 'ko')} role="status">
          <b>{result.ok ? (tries === 1 ? '✅ Bravo, c’est juste !' : '✅ C’est juste !') : '❌ Pas tout à fait.'}</b>
          {!result.ok && result.why && <p>{result.why}</p>}
          {!result.ok && !reveal && (
            <div className="row">
              <button type="button" className="btn" onClick={retry}>Réessayer</button>
              <button type="button" className="btn ghost" onClick={() => setReveal(true)}>Voir la correction</button>
            </div>
          )}
        </div>
      )}

      {reveal && (
        <div className="correction">
          {(ex.type === 'sql' || ex.type === 'open') && (<><h4>Corrigé</h4><pre className="sql"><code>{ex.solution}</code></pre></>)}
          {ex.type === 'order' && (<><h4>Bon ordre</h4><pre className="sql"><code>{ex.tokens.join(' ')}</code></pre></>)}
          {ex.type === 'fill' && (<><h4>Réponses</h4><p>{ex.answer.join(' · ')}</p></>)}
          {ex.type === 'qcm' && (<><h4>Bonne(s) réponse(s)</h4><ul>{(Array.isArray(ex.answer) ? ex.answer : [ex.answer]).map((i) => <li key={i}>{ex.choices[i]}</li>)}</ul></>)}
          <Md src={ex.explain} className="explain" />
          <RefLink r={ex.ref} course={course} />
          {ex.type === 'open' && !result && (
            <div className="row selfcheck">
              <span>Ta réponse était…</span>
              <button type="button" className="btn ok" onClick={() => submit(true)}>Juste 👍</button>
              <button type="button" className="btn ghost" onClick={() => submit(false)}>Pas encore 🤔</button>
            </div>
          )}
        </div>
      )}

      {done && onNext && (ex.type !== 'open' || result) && (
        <div className="row end"><button type="button" className="btn big" onClick={() => onNext({ ok: !!result?.ok, firstTry: !!firstOk })}>{nextLabel} →</button></div>
      )}
    </article>
  );
}

function Qcm({ ex, locked, onCheck }: { ex: QcmEx; locked: boolean; onCheck: (ok: boolean, why?: string) => void }): ReactNode {
  const multi = Array.isArray(ex.answer);
  const right = new Set(multi ? ex.answer as number[] : [ex.answer as number]);
  const [sel, setSel] = useState<Set<number>>(new Set());
  useEffect(() => setSel(new Set()), [ex.id]);
  const toggle = (i: number): void => {
    if (locked) return;
    setSel((s) => { const n = new Set(multi ? s : []); if (n.has(i)) n.delete(i); else n.add(i); return n; });
  };
  const check = (): void => {
    const ok = sel.size === right.size && [...sel].every((i) => right.has(i));
    onCheck(ok, ok ? undefined : multi ? 'Il faut cocher toutes les bonnes réponses, et seulement elles.' : undefined);
  };
  return (
    <div className="qcm" role={multi ? 'group' : 'radiogroup'}>
      {multi && <p className="hint">Plusieurs réponses possibles.</p>}
      {ex.choices.map((c, i) => (
        <button key={i} type="button" role={multi ? 'checkbox' : 'radio'} aria-checked={sel.has(i)}
          className={'choice' + (sel.has(i) ? ' on' : '') + (locked && right.has(i) ? ' right' : '') + (locked && sel.has(i) && !right.has(i) ? ' wrong' : '')}
          onClick={() => toggle(i)} disabled={locked}>
          <span className="box" aria-hidden="true">{multi ? (sel.has(i) ? '☑' : '☐') : (sel.has(i) ? '●' : '○')}</span>
          <Md src={c} className="inline" />
        </button>
      ))}
      {!locked && <button type="button" className="btn" disabled={!sel.size} onClick={check}>Vérifier</button>}
    </div>
  );
}

function Order({ ex, locked, onCheck }: { ex: OrderEx; locked: boolean; onCheck: (ok: boolean, why?: string) => void }): ReactNode {
  const pool = useMemo(() => {
    const all = [...ex.tokens, ...(ex.extra || [])].map((t, i) => ({ t, i }));
    let s = shuffle(all, rng(ex.id));
    if (s.every((x, k) => x.i === k)) s = [...s.slice(1), s[0]];
    return s;
  }, [ex]);
  const [picked, setPicked] = useState<number[]>([]);
  useEffect(() => setPicked([]), [ex.id]);
  const words = picked.map((i) => pool.find((p) => p.i === i)!.t);
  const check = (): void => {
    const ok = [ex.tokens, ...(ex.alt || [])].some((seq) => seq.length === words.length && seq.every((w, k) => w === words[k]));
    onCheck(ok, ok ? undefined : 'L’ordre n’est pas le bon' + (ex.extra?.length ? ' (attention : certains morceaux sont des intrus).' : '.'));
  };
  return (
    <div className="order">
      <div className="order-line" aria-label="Ta réponse">
        {words.length ? picked.map((_i, k) => (
          <button key={k} type="button" className="chip on" disabled={locked} onClick={() => setPicked((p) => p.filter((_, j) => j !== k))}>{words[k]}</button>
        )) : <span className="hint">Touche les morceaux dans le bon ordre…</span>}
      </div>
      <div className="order-pool">
        {pool.map((p) => (
          <button key={p.i} type="button" className="chip" disabled={locked || picked.includes(p.i)} onClick={() => setPicked((l) => [...l, p.i])}>{p.t}</button>
        ))}
      </div>
      {!locked && (
        <div className="row">
          <button type="button" className="btn" disabled={picked.length < ex.tokens.length} onClick={check}>Vérifier</button>
          <button type="button" className="btn ghost" disabled={!picked.length} onClick={() => setPicked([])}>Recommencer</button>
        </div>
      )}
    </div>
  );
}

function Fill({ ex, locked, onCheck }: { ex: FillEx; locked: boolean; onCheck: (ok: boolean, why?: string) => void }): ReactNode {
  const bank = useMemo(() => shuffle(ex.bank, rng(ex.id)), [ex]);
  const [vals, setVals] = useState<string[]>(() => ex.answer.map(() => ''));
  useEffect(() => setVals(ex.answer.map(() => '')), [ex]);
  const parts = ex.text.split(/(\{\d+\})/);
  const check = (): void => {
    const wrong = ex.answer.map((a, i) => (vals[i] === a ? 0 : 1)).reduce((n: number, v) => n + v, 0);
    onCheck(!wrong, wrong ? `${wrong} trou(s) mal rempli(s).` : undefined);
  };
  return (
    <div className="fill">
      <p className="fill-text">
        {parts.map((p, k) => {
          const m = /^\{(\d+)\}$/.exec(p);
          if (!m) return <span key={k}>{p}</span>;
          const i = Number(m[1]);
          const bad = locked && vals[i] !== ex.answer[i];
          return (
            <select key={k} className={'hole' + (bad ? ' wrong' : locked ? ' right' : '')} value={vals[i]} disabled={locked}
              aria-label={`Trou ${i + 1}`} onChange={(e) => setVals((v) => v.map((x, j) => (j === i ? e.target.value : x)))}>
              <option value="">…</option>
              {bank.map((w) => <option key={w} value={w}>{w}</option>)}
            </select>
          );
        })}
      </p>
      {!locked && <button type="button" className="btn" disabled={vals.some((v) => !v)} onClick={check}>Vérifier</button>}
    </div>
  );
}

export function ResultTable({ t, max = 50 }: { t: Table; max?: number }): ReactNode {
  if (!t.columns.length) return <p className="hint">(aucune colonne)</p>;
  return (
    <div className="tbl result">
      <table>
        <thead><tr>{t.columns.map((c, i) => <th key={i}>{c}</th>)}</tr></thead>
        <tbody>
          {t.rows.slice(0, max).map((r, i) => <tr key={i}>{r.map((v, j) => <td key={j}>{v === null ? <i className="null">NULL</i> : String(v)}</td>)}</tr>)}
        </tbody>
      </table>
      <small className="hint">{t.rows.length} ligne(s){t.rows.length > max ? ` (${max} premières affichées)` : ''}</small>
    </div>
  );
}

function Sql({ ex, locked, onCheck }: { ex: SqlEx; locked: boolean; onCheck: (ok: boolean, why?: string) => void }): ReactNode {
  const [text, setText] = useState('');
  const [busy, setBusy] = useState(false);
  const [out, setOut] = useState<RunResult | RunError | null>(null);
  const [expected, setExpected] = useState<Table | null>(null);
  const [hint, setHint] = useState(false);
  const db = getDb(ex.db);
  useEffect(() => { setText(''); setOut(null); setExpected(null); setHint(false); }, [ex.id]);

  const run = async (): Promise<void> => {
    setBusy(true);
    try { setOut(await preview(ex.db, text)); } catch (e) { setOut({ ok: false, error: String(e) }); }
    setBusy(false);
  };
  const check = async (): Promise<void> => {
    setBusy(true);
    try {
      const g = await grade(ex, text);
      setOut(g.mine);
      setExpected(g.verdict.ok ? null : g.expected);
      onCheck(g.verdict.ok, g.verdict.ok ? undefined : g.verdict.why);
    } catch (e) { setOut({ ok: false, error: String(e) }); }
    setBusy(false);
  };
  return (
    <div className="sqlex">
      {db && (
        <details className="schema">
          <summary>🗄️ Base « {db.title} » — voir les tables</summary>
          <pre>{db.schema}</pre>
          {db.note && <p className="hint">{db.note}</p>}
          <p className="hint">Structure tirée du cours (p. {db.ref.page}) ; les lignes sont des exemples pour s’entraîner.</p>
        </details>
      )}
      <textarea className="code" rows={6} value={text} onChange={(e) => setText(e.target.value)} disabled={locked}
        placeholder="SELECT …" spellCheck={false} autoCapitalize="off" autoCorrect="off" aria-label="Ta requête SQL"
        onKeyDown={(e) => { if ((e.ctrlKey || e.metaKey) && e.key === 'Enter' && !locked && text.trim()) void check(); }} />
      <div className="row">
        {!locked && <button type="button" className="btn" disabled={busy || !text.trim()} onClick={() => void check()}>Vérifier</button>}
        <button type="button" className="btn ghost" disabled={busy || !text.trim()} onClick={() => void run()}>▶ Exécuter</button>
        {ex.hint && !locked && <button type="button" className="btn ghost" onClick={() => setHint((h) => !h)}>💡 Indice</button>}
      </div>
      {hint && ex.hint && <p className="note">💡 {ex.hint}</p>}
      {out && !out.ok && <p className="err">⚠️ {out.error}</p>}
      {out && out.ok && out.table && (<div><h4>Ton résultat</h4><ResultTable t={out.table} /></div>)}
      {out && out.ok && !out.table && <p className="hint">Requête exécutée : {out.changed} ligne(s) modifiée(s).</p>}
      {expected && locked && (<details><summary>Voir le résultat attendu</summary><ResultTable t={expected} /></details>)}
    </div>
  );
}
