import { useMemo, useState, type ReactNode } from 'react';
import {
  chapterExercises, courseExercises, findChapter, findCourse, findExercise, findLesson, findSubject, getSubjects, lessonExercises,
  locate, subjectExercises, allExercises
} from '../content';
import type { Exercise as Ex, Lesson } from '../content/types';
import { Md } from '../lib/md';
import { pickRandom } from '../lib/pick';
import { solved } from '../lib/progress';
import { go, href } from '../lib/route';
import { play } from '../lib/sound';
import { useApp } from '../state/app';
import { Bar, Crumbs, RefLink } from './common';
import { Exercise, type Outcome } from './Exercise';

const count = (exs: Ex[], ok: (id: string) => boolean): number => exs.filter((e) => ok(e.id)).length;

function RandomButton({ scope, label = 'Exercices au hasard' }: { scope: string; label?: string }): ReactNode {
  return <a className="btn rnd" href={href.random(scope)}>🎲 {label}</a>;
}

export function Home(): ReactNode {
  const { data, stats } = useApp();
  const ok = (id: string): boolean => solved(data, id);
  return (
    <div className="stack">
      <section className="hero">
        <div>
          <h1>Coucou ! 🐾</h1>
          <p>Choisis une matière, ou laisse le hasard choisir pour toi.</p>
        </div>
        <div className="hero-stats">
          <div><b>{stats.lessonsDone}</b><small>/ {stats.lessonsTotal} leçons</small></div>
          <div><b>{stats.solved}</b><small>/ {stats.exTotal} exercices</small></div>
          <div><b>🔥 {stats.currentDays}</b><small>jour(s) de suite</small></div>
        </div>
      </section>
      <RandomButton scope="all" label="Exercices au hasard (toutes matières)" />
      <div className="cards">
        {getSubjects().map((s) => {
          const exs = subjectExercises(s);
          return (
            <a key={s.id} className="card" href={href.subject(s.id)} style={{ '--c': s.color } as React.CSSProperties}>
              <span className="card-icon" aria-hidden="true">{s.icon}</span>
              <div className="card-body">
                <h2>{s.title}</h2>
                <small>{s.courses.length} cours · {exs.length} exercices</small>
                <Bar value={count(exs, ok)} max={exs.length} label={'Progression ' + s.title} />
              </div>
            </a>
          );
        })}
      </div>
    </div>
  );
}

export function SubjectView({ id }: { id: string }): ReactNode {
  const { data } = useApp();
  const s = findSubject(id);
  if (!s) return <NotFound />;
  return (
    <div className="stack">
      <Crumbs items={[{ label: 'Accueil', to: href.home() }, { label: s.title }]} />
      <h1>{s.icon} {s.title}</h1>
      <RandomButton scope={s.id} label="Exercices au hasard dans la matière" />
      <div className="cards">
        {s.courses.map((c) => {
          const exs = courseExercises(c);
          return (
            <a key={c.id} className="card" href={href.course(c.id)} style={{ '--c': s.color } as React.CSSProperties}>
              <span className="card-icon num" aria-hidden="true">{c.num}</span>
              <div className="card-body">
                <h2>Cours {c.num} — {c.title}</h2>
                <small>{c.chapters.filter((x) => !x.soon).length} chapitre(s) disponibles · {exs.length} exercices</small>
                <Bar value={count(exs, (e) => solved(data, e))} max={exs.length} label={'Progression cours ' + c.num} />
              </div>
            </a>
          );
        })}
      </div>
    </div>
  );
}

export function CourseView({ id }: { id: string }): ReactNode {
  const { data } = useApp();
  const f = findCourse(id);
  if (!f) return <NotFound />;
  const { subject: s, course: c } = f;
  return (
    <div className="stack">
      <Crumbs items={[{ label: 'Accueil', to: href.home() }, { label: s.short, to: href.subject(s.id) }, { label: `Cours ${c.num}` }]} />
      <h1>Cours {c.num} — {c.title}</h1>
      <div className="row">
        <RandomButton scope={c.id} label="Au hasard dans ce cours" />
        <a className="btn ghost" href={href.pdf(c.pdf, 3)}>📖 Ouvrir le cours (PDF)</a>
      </div>
      <ol className="chapters">
        {c.chapters.map((ch) => {
          const exs = chapterExercises(ch);
          const done = ch.lessons.filter((l) => data.lessons[l.id]).length;
          if (ch.soon) return (
            <li key={ch.id} className="chapter soon"><span className="ch-num">{ch.num}</span><div><b>{ch.title}</b><small>Bientôt · p. {ch.page}</small></div></li>
          );
          return (
            <li key={ch.id}>
              <a className="chapter" href={href.chapter(ch.id)}>
                <span className="ch-num">{ch.num}</span>
                <div>
                  <b>{ch.title}</b>
                  <small>{ch.lessons.length} leçons ({done} finies) · {exs.length} exercices ({count(exs, (e) => solved(data, e))} réussis)</small>
                  <Bar value={done} max={ch.lessons.length} label={'Leçons du chapitre ' + ch.num} />
                </div>
              </a>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

export function ChapterView({ id, tab }: { id: string; tab: 'lessons' | 'exercises' }): ReactNode {
  const { data } = useApp();
  const f = findChapter(id);
  const [filter, setFilter] = useState<'all' | 'todo' | 'ko'>('all');
  if (!f) return <NotFound />;
  const { subject: s, course: c, chapter: ch } = f;
  const exs = chapterExercises(ch);
  const shown = exs.filter((e) => filter === 'all' || (filter === 'todo' ? !solved(data, e.id) : data.attempts[e.id]?.last === 'ko'));
  return (
    <div className="stack">
      <Crumbs items={[{ label: 'Accueil', to: href.home() }, { label: s.short, to: href.subject(s.id) }, { label: `Cours ${c.num}`, to: href.course(c.id) }, { label: `Chap. ${ch.num}` }]} />
      <h1>Chapitre {ch.num} — {ch.title}</h1>
      <div className="row">
        <RandomButton scope={ch.id} label="Au hasard dans ce chapitre" />
        <a className="btn ghost" href={href.pdf(c.pdf, ch.page)}>📖 Le chapitre dans le cours (p. {ch.page})</a>
      </div>
      <div className="tabs" role="tablist">
        <a role="tab" aria-selected={tab === 'lessons'} href={href.chapter(ch.id)}>📘 Leçons ({ch.lessons.length})</a>
        <a role="tab" aria-selected={tab === 'exercises'} href={href.chapter(ch.id, true)}>✏️ Exercices ({exs.length})</a>
      </div>
      {tab === 'lessons' ? (
        <ol className="lessons">
          {ch.lessons.map((l, i) => {
            const d = data.lessons[l.id];
            const lex = lessonExercises(l);
            return (
              <li key={l.id}>
                <a className={'lesson' + (d ? ' done' : '')} href={href.lesson(l.id)}>
                  <span className="l-num">{d ? (d.perfect ? '⭐' : '✓') : i + 1}</span>
                  <div><b>{l.title}</b><small>{l.summary}</small><small className="meta">{l.steps.length - lex.length} explication(s) · {lex.length} exercice(s)</small></div>
                </a>
              </li>
            );
          })}
        </ol>
      ) : (
        <>
          <div className="seg" role="group" aria-label="Filtrer">
            {([['all', 'Tous'], ['todo', 'Pas encore réussis'], ['ko', 'Ratés la dernière fois']] as const).map(([k, l]) => (
              <button key={k} type="button" aria-pressed={filter === k} onClick={() => setFilter(k)}>{l}</button>
            ))}
          </div>
          <ul className="exlist">
            {shown.map((e) => {
              const a = data.attempts[e.id];
              return (
                <li key={e.id}><a href={href.exercise(e.id)}>
                  <span className={'dot ' + (a ? (a.ok ? 'ok' : 'ko') : '')} aria-label={a ? (a.ok ? 'réussi' : 'raté') : 'pas fait'} />
                  <span className="exlist-q">{plain(e.q)}</span>
                  <span className="tag">{e.type === 'sql' ? 'SQL' : e.type === 'qcm' ? 'QCM' : e.type === 'order' ? 'Ordre' : e.type === 'fill' ? 'Trous' : 'Corrigé'}</span>
                </a></li>
              );
            })}
            {!shown.length && <li className="hint">Rien ici 🎉</li>}
          </ul>
        </>
      )}
    </div>
  );
}

const plain = (md: string): string => md.replace(/[*`]/g, '').replace(/\n+/g, ' ').slice(0, 140);

export function LessonView({ id }: { id: string }): ReactNode {
  const l = findLesson(id);
  const where = locate(id);
  if (!l || !where) return <NotFound />;
  return <LessonPlayer key={l.id} lesson={l} />;
}

function LessonPlayer({ lesson }: { lesson: Lesson }): ReactNode {
  const { update, data } = useApp();
  const where = locate(lesson.id)!;
  const [i, setI] = useState(0);
  const [errors, setErrors] = useState(0);
  const [finished, setFinished] = useState(false);
  const step = lesson.steps[i];
  const course = where.course.id;
  const total = lesson.steps.length;
  const idx = where.chapter.lessons.findIndex((x) => x.id === lesson.id);
  const nextLesson = where.chapter.lessons[idx + 1];

  const next = (o?: Outcome): void => {
    const errs = errors + (o && !o.firstTry ? 1 : 0);
    if (o && !o.firstTry) setErrors(errs);
    if (i + 1 < total) { setI(i + 1); window.scrollTo(0, 0); return; }
    const exs = lessonExercises(lesson).length;
    update((d) => {
      const prev = d.lessons[lesson.id];
      d.lessons[lesson.id] = { done: prev?.done || new Date().toISOString(), ...(prev?.perfect || (errs === 0 && exs > 0) ? { perfect: 1 } : {}), best: Math.max(prev?.best || 0, exs - errs) };
    });
    if (data.prefs.sound) play('done');
    setFinished(true);
    window.scrollTo(0, 0);
  };

  const crumbs = <Crumbs items={[{ label: `Chap. ${where.chapter.num}`, to: href.chapter(where.chapter.id) }, { label: lesson.title }]} />;
  if (finished) {
    const exs = lessonExercises(lesson).length;
    return (
      <div className="stack">
        {crumbs}
        <section className="finish">
          <div className="big-emoji" aria-hidden="true">{errors === 0 ? '🌟' : '🎉'}</div>
          <h1>Leçon terminée !</h1>
          <p>{exs ? (errors === 0 ? 'Sans aucune erreur, bravo !' : `${exs - errors} / ${exs} exercice(s) réussi(s) du premier coup.`) : 'Bien lu !'}</p>
          <div className="row center">
            {nextLesson && <a className="btn big" href={href.lesson(nextLesson.id)}>Leçon suivante : {nextLesson.title} →</a>}
            <a className="btn ghost" href={href.chapter(where.chapter.id)}>Retour au chapitre</a>
            <button type="button" className="btn ghost" onClick={() => { setI(0); setErrors(0); setFinished(false); }}>Recommencer</button>
          </div>
        </section>
      </div>
    );
  }
  return (
    <div className="stack">
      {crumbs}
      <header className="lesson-head">
        <h1>{lesson.title}</h1>
        <div className="steps-bar"><Bar value={i + 1} max={total} label="Avancement dans la leçon" /><small>{i + 1} / {total}</small></div>
      </header>
      {step.kind === 'learn' ? (
        <article className="learn">
          <h2>{step.title}</h2>
          <Md src={step.body} />
          <RefLink r={step.ref} course={course} />
          <div className="row end">
            {i > 0 && <button type="button" className="btn ghost" onClick={() => setI(i - 1)}>← Retour</button>}
            <button type="button" className="btn big" onClick={() => next()}>{i + 1 < total ? 'J’ai compris →' : 'Terminer'}</button>
          </div>
        </article>
      ) : (
        <Exercise key={step.ex.id} ex={step.ex} course={course} onNext={next} nextLabel={i + 1 < total ? 'Continuer' : 'Terminer'} />
      )}
    </div>
  );
}

export function SingleExercise({ id }: { id: string }): ReactNode {
  const e = findExercise(id);
  const where = locate(id);
  if (!e || !where) return <NotFound />;
  const list = chapterExercises(where.chapter);
  const k = list.findIndex((x) => x.id === id);
  const nextEx = list[k + 1];
  return (
    <div className="stack">
      <Crumbs items={[{ label: `Chap. ${where.chapter.num}`, to: href.chapter(where.chapter.id, true) }, { label: `Exercice ${k + 1} / ${list.length}` }]} />
      <Exercise key={e.id} ex={e} course={where.course.id} onNext={() => go(nextEx ? href.exercise(nextEx.id) : href.chapter(where.chapter.id, true))}
        nextLabel={nextEx ? 'Exercice suivant' : 'Retour à la liste'} />
    </div>
  );
}

const SESSION = 10;

export function RandomSession({ scope, seed }: { scope: string; seed: string }): ReactNode {
  const { data, update } = useApp();
  const [k, setK] = useState(0);
  const [score, setScore] = useState(0);
  const [over, setOver] = useState(false);
  const { pool, label } = useMemo(() => {
    if (scope === 'all') return { pool: allExercises(), label: 'Toutes les matières' };
    const s = findSubject(scope); if (s) return { pool: subjectExercises(s), label: s.title };
    const c = findCourse(scope); if (c) return { pool: courseExercises(c.course), label: `Cours ${c.course.num} — ${c.course.title}` };
    const ch = findChapter(scope); if (ch) return { pool: chapterExercises(ch.chapter), label: `Chapitre ${ch.chapter.num} — ${ch.chapter.title}` };
    return { pool: [], label: '' };
  }, [scope]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const picks = useMemo(() => pickRandom(pool, data, SESSION, seed || scope), [pool, seed]);
  if (!pool.length) return <NotFound />;
  const e = picks[k];
  const where = e && locate(e.id);
  const next = (o: Outcome): void => {
    if (o.ok && o.firstTry) setScore((s) => s + 1);
    if (k + 1 < picks.length) { setK(k + 1); window.scrollTo(0, 0); }
    else { setOver(true); update((d) => { d.counters.random++; }); if (data.prefs.sound) play('done'); }
  };
  if (over) return (
    <section className="finish">
      <div className="big-emoji" aria-hidden="true">🎲</div>
      <h1>Série terminée</h1>
      <p>{score} / {picks.length} du premier coup.</p>
      <div className="row center">
        <a className="btn big" href={href.random(scope)}>Nouvelle série</a>
        <a className="btn ghost" href={href.home()}>Accueil</a>
      </div>
    </section>
  );
  return (
    <div className="stack">
      <header className="lesson-head">
        <p className="eyebrow">🎲 Au hasard · {label}</p>
        <div className="steps-bar"><Bar value={k + 1} max={picks.length} label="Avancement de la série" /><small>{k + 1} / {picks.length}</small></div>
        {where && <small className="hint">Cours {where.course.num} · Chap. {where.chapter.num} — {where.chapter.title}</small>}
      </header>
      {e && where && <Exercise key={e.id + k} ex={e} course={where.course.id} onNext={next} nextLabel={k + 1 < picks.length ? 'Question suivante' : 'Voir mon score'} />}
    </div>
  );
}

export function NotFound(): ReactNode {
  return <div className="stack"><h1>Introuvable 🙀</h1><p><a href={href.home()}>Retour à l’accueil</a></p></div>;
}

export { Md };
