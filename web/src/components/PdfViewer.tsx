import { useEffect, useRef, useState, type ReactNode } from 'react';
import type { PDFDocumentProxy } from 'pdfjs-dist';
import { findCourse } from '../content';
import { findAnchor } from '../lib/pdfmatch';
import { goBack, href, replace } from '../lib/route';
import { CLIENT_HEADER } from '../lib/sync';

/**
 * The course PDF, inside the app (Android Chrome cannot show a PDF in a page by itself, so pdf.js draws it).
 * Opens at the page of the link and highlights the quoted sentence.
 */

type Pdfjs = typeof import('pdfjs-dist');
let lib: Promise<Pdfjs> | null = null;
const docs = new Map<string, Promise<PDFDocumentProxy>>();

function pdfjs(): Promise<Pdfjs> {
  lib = lib || Promise.all([import('pdfjs-dist'), import('pdfjs-dist/build/pdf.worker.min.mjs?url')]).then(([m, w]) => {
    m.GlobalWorkerOptions.workerSrc = w.default;
    return m;
  });
  return lib;
}

const assets = new URL('pdfjs/', document.baseURI).href;

function open(course: string): Promise<PDFDocumentProxy> {
  let p = docs.get(course);
  if (!p) {
    p = pdfjs().then((m) => m.getDocument({
      url: `./api/courses/${course}/pdf`,
      standardFontDataUrl: assets + 'standard_fonts/', cMapUrl: assets + 'cmaps/', cMapPacked: true, wasmUrl: assets + 'wasm/'
    }).promise);
    p.catch(() => docs.delete(course));
    docs.set(course, p);
  }
  return p;
}

export function forgetPdf(course: string): void { docs.delete(course); }

interface Box { left: number; top: number; width: number; height: number }

/**
 * `onClose` set: shown over the current screen (✕ Fermer comes back exactly where one was).
 * Without it: the #/pdf/… screen itself (direct link); then turning pages does not pile up in the history.
 */
export function PdfViewer({ course, page: startPage, q: startQ, onClose }: { course: string; page: number; q: string; onClose?: () => void }): ReactNode {
  const c = findCourse(course);
  const [page, setPage] = useState(startPage);
  const [q, setQ] = useState(startQ);
  useEffect(() => { setPage(startPage); setQ(startQ); }, [startPage, startQ]);
  const firstHl = useRef<HTMLSpanElement>(null);
  const [doc, setDoc] = useState<PDFDocumentProxy | null>(null);
  const [state, setState] = useState<'loading' | 'missing' | 'error' | 'ok'>('loading');
  const [zoom, setZoom] = useState(1);
  const [boxes, setBoxes] = useState<Box[]>([]);
  const [found, setFound] = useState<boolean | null>(null);
  const [goto, setGoto] = useState(String(page));
  const canvas = useRef<HTMLCanvasElement>(null);
  const wrap = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let live = true;
    setState('loading');
    open(course).then((d) => { if (live) { setDoc(d); setState('ok'); } }, (e: { name?: string; status?: number }) => {
      if (!live) return;
      setState(e?.name === 'MissingPDFException' || e?.name === 'ResponseException' || e?.status === 404 ? 'missing' : 'error');
    });
    return () => { live = false; };
  }, [course]);

  useEffect(() => setGoto(String(page)), [page]);

  useEffect(() => {
    if (!doc || !canvas.current || !wrap.current) return;
    let cancelled = false;
    let task: { cancel: () => void; promise: Promise<void> } | null = null;
    (async () => {
      const m = await pdfjs();
      const p = await doc.getPage(Math.min(page, doc.numPages));
      const base = p.getViewport({ scale: 1 });
      const width = Math.min(wrap.current!.clientWidth, 1100);
      const scale = (width / base.width) * zoom;
      const vp = p.getViewport({ scale });
      const ratio = window.devicePixelRatio || 1;
      const cv = canvas.current!;
      cv.width = Math.floor(vp.width * ratio);
      cv.height = Math.floor(vp.height * ratio);
      cv.style.width = Math.floor(vp.width) + 'px';
      cv.style.height = Math.floor(vp.height) + 'px';
      const ctx = cv.getContext('2d')!;
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
      task = p.render({ canvasContext: ctx, canvas: cv, viewport: vp });
      await task.promise;
      if (cancelled) return;
      if (!q) { setBoxes([]); setFound(null); return; }
      const tc = await p.getTextContent();
      const items = tc.items.filter((it): it is typeof it & { str: string; transform: number[]; width: number; height: number } => 'str' in it);
      const hit = findAnchor(items, q);
      setFound(hit.length > 0);
      setBoxes(hit.map((i) => {
        const it = items[i];
        const t = m.Util.transform(vp.transform, it.transform);
        const h = Math.hypot(t[2], t[3]);
        return { left: t[4] - 3, top: t[5] - h - 2, width: it.width * scale + 6, height: h * 1.3 + 4 };
      }));
      if (hit.length) setTimeout(() => firstHl.current?.scrollIntoView({ block: 'center', behavior: 'smooth' }), 60);
    })().catch(() => undefined);
    return () => { cancelled = true; task?.cancel(); };
  }, [doc, page, zoom, q]);

  const n = doc?.numPages || 0;
  const to = (p: number): void => {
    const target = Math.max(1, Math.min(n || p, p));
    setQ('');
    setPage(target);
    if (!onClose) replace(href.pdf(course, target));
    window.scrollTo(0, 0);
    wrap.current?.closest('.pdf-overlay')?.scrollTo(0, 0);
  };
  const close = (): void => (onClose ? onClose() : goBack(href.course(course)));
  return (
    <div className="pdf">
      <div className="pdf-bar">
        <button type="button" className="btn" onClick={close}>{onClose ? '✕ Fermer' : '← Retour'}</button>
        <b className="pdf-title">{c ? `Cours ${c.course.num} — ${c.course.title}` : course}</b>
        <div className="pdf-nav">
          <button type="button" className="btn ghost" disabled={page <= 1} onClick={() => to(page - 1)} aria-label="Page précédente">‹</button>
          <form onSubmit={(e) => { e.preventDefault(); to(Number(goto) || 1); }}>
            <input aria-label="Page" inputMode="numeric" value={goto} onChange={(e) => setGoto(e.target.value)} size={3} /> / {n || '…'}
          </form>
          <button type="button" className="btn ghost" disabled={!!n && page >= n} onClick={() => to(page + 1)} aria-label="Page suivante">›</button>
          <button type="button" className="btn ghost" onClick={() => setZoom((z) => Math.max(0.6, z - 0.2))} aria-label="Dézoomer">−</button>
          <button type="button" className="btn ghost" onClick={() => setZoom((z) => Math.min(3, z + 0.2))} aria-label="Zoomer">+</button>
          <button type="button" className="btn ghost" onClick={() => to(3)}>Sommaire</button>
        </div>
      </div>
      {q && found === false && <p className="hint">Passage cité : « {q} »</p>}
      {state === 'missing' && <PdfMissing course={course} />}
      {state === 'error' && <p className="err">Impossible d’ouvrir le PDF. Réessaie plus tard.</p>}
      {state === 'loading' && <p className="hint">Chargement du cours…</p>}
      <div className="pdf-page" ref={wrap} hidden={state !== 'ok'}>
        <div className="pdf-sheet">
          <canvas ref={canvas} />
          {boxes.map((b, i) => <span key={i} ref={i === 0 ? firstHl : undefined} className="pdf-hl" style={{ left: b.left, top: b.top, width: b.width, height: b.height }} />)}
        </div>
      </div>
    </div>
  );
}

export function PdfUpload({ course, onDone }: { course: string; onDone?: () => void }): ReactNode {
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState('');
  return (
    <label className="btn">
      {busy ? 'Envoi…' : '📤 Envoyer le PDF du cours'}
      <input type="file" accept="application/pdf,.pdf" hidden disabled={busy} onChange={async (e) => {
        const f = e.target.files?.[0];
        if (!f) return;
        setBusy(true); setMsg('');
        try {
          const res = await fetch(`./api/courses/${course}/pdf`, { method: 'PUT', headers: { 'Content-Type': 'application/pdf', ...CLIENT_HEADER }, body: f });
          if (!res.ok) throw new Error(await res.text());
          forgetPdf(course);
          setMsg('✅ PDF enregistré sur le serveur.');
          onDone?.();
        } catch (err) { setMsg('❌ ' + String((err as Error).message || err)); }
        setBusy(false);
      }} />
      {msg && <span className="hint"> {msg}</span>}
    </label>
  );
}

function PdfMissing({ course }: { course: string }): ReactNode {
  return (
    <div className="panel">
      <h2>Le PDF de ce cours n’est pas encore sur le serveur</h2>
      <p>Envoie-le une fois (il est gardé dans le dossier <code>data/pdf/{course}.pdf</code> du NAS) :</p>
      <PdfUpload course={course} onDone={() => location.reload()} />
    </div>
  );
}
