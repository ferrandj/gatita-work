import { emptyData, mergeData, normalize, type Data } from './progress';

/**
 * Keeps the progress on the server (the NAS) with a copy in the browser.
 * - Every change is kept in localStorage at once, then sent to the server (0.5 s later, or when the tab is hidden).
 * - The server MERGES what it receives (it never loses progress), so the app can work offline and catch up later,
 *   and a phone and a computer can be used in turn.
 */

const CACHE = 'gatita.cache';
const PENDING = 'gatita.pending';
export const CLIENT_HEADER = { 'X-Gatita-Client': '1' };

export type SyncStatus = 'ok' | 'saving' | 'offline';

const read = (k: string): unknown => { try { const s = localStorage.getItem(k); return s ? JSON.parse(s) : null; } catch { return null; } };
const write = (k: string, v: unknown): void => { try { if (v === null) localStorage.removeItem(k); else localStorage.setItem(k, JSON.stringify(v)); } catch { /* storage full or blocked */ } };

export class Sync {
  private timer: ReturnType<typeof setTimeout> | null = null;
  private inflight = false;
  private again = false;
  status: SyncStatus = 'ok';
  onStatus: (s: SyncStatus) => void = () => undefined;
  onRemote: (d: Data) => void = () => undefined;

  constructor(private base = './api') {
    if (typeof window !== 'undefined') {
      window.addEventListener('online', () => this.flush());
      document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'hidden') this.flush(); });
      setInterval(() => { if (read(PENDING)) this.flush(); }, 15000);
    }
  }

  private set(s: SyncStatus): void { if (s !== this.status) { this.status = s; this.onStatus(s); } }

  /** Server state merged with whatever this device did not send yet. Never fails: offline, the local copy is used. */
  async load(): Promise<Data> {
    const pending = read(PENDING);
    const local = read(CACHE);
    try {
      const res = await fetch(this.base + '/state', { cache: 'no-store' });
      if (!res.ok) throw new Error(String(res.status));
      const body = await res.json() as { data: unknown };
      const data = normalize(pending ? mergeData(body.data, pending) : body.data);
      write(CACHE, data);
      if (pending) this.flush();
      return data;
    } catch {
      this.set('offline');
      return normalize(mergeData(local || emptyData(), pending || {}));
    }
  }

  /** Called after every change. */
  save(data: Data): void {
    write(CACHE, data);
    write(PENDING, mergeData(read(PENDING) || {}, data));
    if (this.timer) clearTimeout(this.timer);
    this.timer = setTimeout(() => this.flush(), 500);
  }

  async flush(): Promise<void> {
    if (this.timer) { clearTimeout(this.timer); this.timer = null; }
    const pending = read(PENDING);
    if (!pending) return;
    if (this.inflight) { this.again = true; return; }
    this.inflight = true;
    this.set('saving');
    try {
      const res = await fetch(this.base + '/state', {
        method: 'PUT', keepalive: true,
        headers: { 'Content-Type': 'application/json', ...CLIENT_HEADER },
        body: JSON.stringify({ data: pending })
      });
      if (!res.ok) throw new Error(String(res.status));
      const body = await res.json() as { data: unknown };
      // only forget what was sent if nothing new arrived meanwhile
      if (JSON.stringify(read(PENDING)) === JSON.stringify(pending)) write(PENDING, null);
      const merged = normalize(mergeData(body.data, read(PENDING) || {}));
      write(CACHE, merged);
      this.onRemote(merged);
      this.set('ok');
    } catch {
      this.set('offline');
    } finally {
      this.inflight = false;
      if (this.again) { this.again = false; void this.flush(); }
    }
  }
}
