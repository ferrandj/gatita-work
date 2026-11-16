import type { ReactNode } from 'react';
import { useRoute, href } from './lib/route';
import { useApp } from './state/app';
import { ChapterView, CourseView, Home, LessonView, NotFound, RandomSession, SingleExercise, SubjectView } from './components/Views';
import { PdfViewer } from './components/PdfViewer';
import { Celebration, Trophies } from './components/Trophies';
import { Settings } from './components/Settings';

export function App(): ReactNode {
  const r = useRoute();
  const { status, run, defs, data } = useApp();
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
      <Celebration />
    </div>
  );
}
