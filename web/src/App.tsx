import type { ReactNode } from 'react';
import { useRoute, href, type Route } from './lib/route';
import { findChapter, findCourse, locate } from './content';
import { useApp } from './state/app';
import { ChapterView, CourseView, Home, LessonView, NotFound, RandomSession, SingleExercise, SubjectView } from './components/Views';
import { PdfViewer } from './components/PdfViewer';
import { Celebration, Trophies } from './components/Trophies';
import { Settings } from './components/Settings';

export function App(): ReactNode {
  const r = useRoute();
  const { status, run, defs, data, pdf, closePdf } = useApp();
  const up = parentOf(r);
  const got = defs.filter((d) => data.ach[d.id]).length;
  let page: ReactNode;
  switch (r.name) {
    case 'home': page = <Home />; break;
    case 'subject': page = <SubjectView id={r.id} />; break;
    case 'course': page = <CourseView id={r.id} />; break;
    case 'chapter': page = <ChapterView id={r.id} tab={r.tab} />; break;
    case 'lesson': page = <LessonView id={r.id} />; break;
    case 'exercise': page = <SingleExercise id={r.id} />; break;
    case 'random': page = <RandomSession key={r.scope + r.seed} scope={r.scope} seed={r.seed} />; break;
    case 'pdf': page = <PdfViewer course={r.course} page={r.page} q={r.q} />; break;
    case 'trophies': page = <Trophies />; break;
    case 'settings': page = <Settings />; break;
    default: page = <NotFound />;
  }
  return (
    <div className={'wrap' + (r.name === 'pdf' ? ' wide' : '')}>
      <header className="top">
        {up && <a className="nav-btn back" href={up.to} aria-label={'Retour : ' + up.label}>← <span>{up.label}</span></a>}
        <a className="brand" href={href.home()}>
          <img src="icon.svg" alt="" width="40" height="40" />
          <span>Gatita</span>
        </a>
        <nav className="top-nav">
          {run >= 3 && <span className="run" title="Bonnes réponses d’affilée">🔥 {run}</span>}
          <span className={'pill ' + status} title={status === 'offline' ? 'Serveur injoignable : tout est gardé sur cet appareil et sera envoyé plus tard' : status === 'saving' ? 'Enregistrement…' : 'Enregistré sur le serveur'}>
            {status === 'offline' ? 'hors ligne' : status === 'saving' ? '…' : '✓'}
          </span>
          <a href={href.trophies()} className="nav-btn" aria-label="Succès">🏆 <small>{got}</small></a>
          <a href={href.settings()} className="nav-btn" aria-label="Réglages">⚙️</a>
        </nav>
      </header>
      <main>{page}</main>
      {pdf && (
        <div className="pdf-overlay" role="dialog" aria-modal="true" aria-label="Le cours">
          <div className="wrap wide"><PdfViewer course={pdf.course} page={pdf.page} q={pdf.q || ''} onClose={closePdf} /></div>
        </div>
      )}
      <Celebration />
    </div>
  );
}

/** The screen "above" the current one, for the ← button of the header (always the same, whatever the history). */
function parentOf(r: Route): { to: string; label: string } | null {
  switch (r.name) {
    case 'home': return null;
    case 'subject': case 'trophies': case 'settings': return { to: href.home(), label: 'Accueil' };
    case 'course': { const f = findCourse(r.id); return f ? { to: href.subject(f.subject.id), label: f.subject.short } : { to: href.home(), label: 'Accueil' }; }
    case 'chapter': { const f = findChapter(r.id); return f ? { to: href.course(f.course.id), label: `Cours ${f.course.num}` } : { to: href.home(), label: 'Accueil' }; }
    case 'lesson': { const f = locate(r.id); return f ? { to: href.chapter(f.chapter.id), label: `Chap. ${f.chapter.num}` } : { to: href.home(), label: 'Accueil' }; }
    case 'exercise': { const f = locate(r.id); return f ? { to: href.chapter(f.chapter.id, true), label: `Chap. ${f.chapter.num}` } : { to: href.home(), label: 'Accueil' }; }
    case 'random': {
      const s = findChapter(r.scope); if (s) return { to: href.chapter(s.chapter.id), label: `Chap. ${s.chapter.num}` };
      const c = findCourse(r.scope); if (c) return { to: href.course(c.course.id), label: `Cours ${c.course.num}` };
      return { to: href.home(), label: 'Accueil' };
    }
    case 'pdf': { const f = findCourse(r.course); return f ? { to: href.course(f.course.id), label: `Cours ${f.course.num}` } : { to: href.home(), label: 'Accueil' }; }
  }
}
