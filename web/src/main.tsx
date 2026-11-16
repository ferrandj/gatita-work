import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App';
import { fetchContent } from './content';
import { Sync } from './lib/sync';
import { primeAudioOnFirstTouch } from './lib/sound';
import { AppProvider } from './state/app';
import './styles/app.css';

const root = createRoot(document.getElementById('root')!);
const sync = new Sync();
primeAudioOnFirstTouch();

Promise.all([fetchContent(), sync.load()]).then(
  ([, data]) => root.render(<StrictMode><AppProvider boot={data} sync={sync}><App /></AppProvider></StrictMode>),
  (e) => root.render(
    <div className="wrap"><div className="panel"><h1>Gatita</h1><p>{String(e.message || e)}</p><button type="button" className="btn" onClick={() => location.reload()}>Réessayer</button></div></div>
  )
);

// Makes the app installable on Android (and desktop Chrome) and able to open without the server. Needs HTTPS (or localhost).
if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => { navigator.serviceWorker.register('./sw.js').catch(() => undefined); });
}
