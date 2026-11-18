import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { buildDefs, newlyMet, type Def, type Stats } from '../lib/achievements';
import { dayOf, type Data } from '../lib/progress';
import { play, vibrate } from '../lib/sound';
import type { Sync, SyncStatus } from '../lib/sync';

interface Toast { id: number; icon: string; title: string; body?: string }

interface AppCtx {
  data: Data;
  /** Changes the progress (the function edits a copy) and saves it. */
  update: (fn: (d: Data) => void) => void;
  status: SyncStatus;
  defs: Def[];
  stats: Stats;
  toast: (t: Omit<Toast, 'id'>) => void;
  /** Medals just unlocked, shown one by one with music. */
  celebrating: Def | null;
  dismissCelebration: () => void;
  /** Current run of right answers (this device only). */
  run: number;
  answered: (ok: boolean) => void;
  /** The course PDF shown over the current screen (so closing it comes back exactly where one was). */
  pdf: PdfView | null;
  openPdf: (v: PdfView) => void;
  closePdf: () => void;
}

export interface PdfView { course: string; page: number; q?: string }

const Ctx = createContext<AppCtx | null>(null);

export function useApp(): AppCtx {
  const c = useContext(Ctx);
  if (!c) throw new Error('useApp outside AppProvider');
  return c;
}

export function AppProvider({ boot, sync, children }: { boot: Data; sync: Sync; children: ReactNode }): ReactNode {
  const [data, setData] = useState<Data>(boot);
  const [status, setStatus] = useState<SyncStatus>(sync.status);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [queue, setQueue] = useState<Def[]>([]);
  const [run, setRun] = useState(0);
  const [pdf, setPdf] = useState<PdfView | null>(null);
  const pdfOpen = useRef(false);

  // The PDF is a step of the history: the phone's back gesture closes it instead of leaving the screen.
  useEffect(() => {
    const onPop = (): void => { if (pdfOpen.current) { pdfOpen.current = false; setPdf(null); } };
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);
  const openPdf = useCallback((v: PdfView) => {
    if (!pdfOpen.current) { history.pushState({ gatitaPdf: 1 }, '', location.href); pdfOpen.current = true; }
    setPdf(v);
  }, []);
  const closePdf = useCallback(() => { if (pdfOpen.current) history.back(); else setPdf(null); }, []);
  const dataRef = useRef(data);
  dataRef.current = data;

  useEffect(() => {
    sync.onStatus = setStatus;
    sync.onRemote = (d) => setData(d);
  }, [sync]);

  const update = useCallback((fn: (d: Data) => void) => {
    const next = structuredClone(dataRef.current);
    fn(next);
    dataRef.current = next;
    setData(next);
    sync.save(next);
  }, [sync]);

  const toast = useCallback((t: Omit<Toast, 'id'>) => {
    const id = Date.now() + Math.random();
    setToasts((l) => [...l, { ...t, id }]);
    setTimeout(() => setToasts((l) => l.filter((x) => x.id !== id)), 4500);
  }, []);

  const { defs, stats } = useMemo(() => buildDefs(data), [data]);

  // record new medals (for good) and celebrate them
  useEffect(() => {
    const fresh = newlyMet(defs, data);
    if (!fresh.length) return;
    const today = dayOf();
    update((d) => { for (const f of fresh) if (!d.ach[f.id]) d.ach[f.id] = today; });
    setQueue((q) => [...q, ...fresh]);
  }, [defs, data, update]);

  const celebrating = queue[0] || null;
  useEffect(() => {
    if (!celebrating) return;
    if (dataRef.current.prefs.sound) play('achievement');
    vibrate([80, 60, 80, 60, 200]);
  }, [celebrating]);

  const answered = useCallback((ok: boolean) => {
    if (dataRef.current.prefs.sound) play(ok ? 'right' : 'wrong');
    setRun((r) => {
      const next = ok ? r + 1 : 0;
      if (next > dataRef.current.counters.bestRun) update((d) => { d.counters.bestRun = Math.max(d.counters.bestRun, next); });
      return next;
    });
  }, [update]);

  // theme
  useEffect(() => {
    const t = data.prefs.theme;
    if (t === 'auto') document.documentElement.removeAttribute('data-theme');
    else document.documentElement.setAttribute('data-theme', t);
  }, [data.prefs.theme]);

  const value: AppCtx = {
    data, update, status, defs, stats, toast, celebrating,
    dismissCelebration: () => setQueue((q) => q.slice(1)), run, answered, pdf, openPdf, closePdf
  };
  return (
    <Ctx.Provider value={value}>
      {children}
      <div className="toasts" aria-live="polite">
        {toasts.map((t) => <div key={t.id} className="toast"><span>{t.icon}</span><div><b>{t.title}</b>{t.body && <small>{t.body}</small>}</div></div>)}
      </div>
    </Ctx.Provider>
  );
}
