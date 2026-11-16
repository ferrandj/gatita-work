/** Sounds: a short tune when an achievement is unlocked, a "ding" for a right answer. Best effort: a browser may refuse until the first tap. */

let ctx: AudioContext | null = null;

function audio(): AudioContext | null {
  try {
    const A = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!A) return null;
    ctx = ctx || new A();
    if (ctx.state === 'suspended') void ctx.resume().catch(() => undefined);
    return ctx;
  } catch { return null; }
}

/** Browsers only allow sound after a first tap or key: wake the audio up then. */
export function primeAudioOnFirstTouch(): void {
  const on = (): void => { audio(); window.removeEventListener('pointerdown', on); window.removeEventListener('keydown', on); };
  window.addEventListener('pointerdown', on);
  window.addEventListener('keydown', on);
}

type Note = [freq: number, at: number, len: number, type?: OscillatorType, vol?: number];

const C5 = 523.25, D5 = 587.33, E5 = 659.25, G5 = 783.99, A5 = 880, C6 = 1046.5, E6 = 1318.5, G4 = 392, C4 = 261.63, E4 = 329.63;

const TUNES: Record<string, Note[]> = {
  // a little fanfare: rising arpeggio, a trill, then a bright chord
  achievement: [
    [C5, 0, 0.13], [E5, 0.12, 0.13], [G5, 0.24, 0.13], [C6, 0.36, 0.22],
    [A5, 0.6, 0.1], [C6, 0.7, 0.1], [A5, 0.8, 0.1], [C6, 0.9, 0.12],
    [C5, 1.08, 0.9, 'triangle', 0.22], [E5, 1.08, 0.9, 'triangle', 0.2], [G5, 1.08, 0.9, 'triangle', 0.2], [C6, 1.08, 0.9, 'sine', 0.28], [E6, 1.2, 0.7, 'sine', 0.12],
    [C4, 1.08, 0.9, 'triangle', 0.25], [G4, 1.08, 0.9, 'triangle', 0.15]
  ],
  right: [[E5, 0, 0.1], [A5, 0.09, 0.22]],
  wrong: [[E4, 0, 0.14, 'triangle', 0.22], [C4, 0.13, 0.26, 'triangle', 0.22]],
  done: [[C5, 0, 0.12], [D5, 0.11, 0.12], [E5, 0.22, 0.12], [G5, 0.33, 0.35]]
};

export type Tune = keyof typeof TUNES;

export function play(tune: Tune): void {
  const c = audio();
  if (!c) return;
  const t0 = c.currentTime + 0.03;
  const master = c.createGain();
  master.gain.value = 0.6;
  master.connect(c.destination);
  for (const [freq, at, len, type = 'sine', vol = 0.32] of TUNES[tune]) {
    const o = c.createOscillator(), g = c.createGain();
    o.type = type; o.frequency.value = freq;
    g.gain.setValueAtTime(0.0001, t0 + at);
    g.gain.exponentialRampToValueAtTime(vol, t0 + at + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + at + len);
    o.connect(g); g.connect(master);
    o.start(t0 + at); o.stop(t0 + at + len + 0.05);
  }
}

export function vibrate(pattern: number[] = [60, 40, 120]): void {
  try { navigator.vibrate?.(pattern); } catch { /* not supported */ }
}
