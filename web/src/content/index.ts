import type { Chapter, Course, Exercise, Lesson, SampleDb, Subject } from './types';
import { parseContent, type Content, type Files, type ParseError } from '../lib/contentfmt';

/**
 * The content is NOT written in the code: it is read at start-up from the text files of the `content/` folder
 * (served by the server at /api/content, see CONTENT.md) and kept in this registry.
 */

let subjects: Subject[] = [];
let dbs: Record<string, SampleDb> = {};
let errors: ParseError[] = [];
const where = new Map<string, Located>();
const exById = new Map<string, Exercise>();
const lessonById = new Map<string, Lesson>();

export interface Located { subject: Subject; course: Course; chapter: Chapter }

export const lessonExercises = (l: Lesson): Exercise[] => l.steps.flatMap((s) => (s.kind === 'ex' ? [s.ex] : []));
export const chapterExercises = (c: Chapter): Exercise[] => [...c.lessons.flatMap(lessonExercises), ...c.exercises];
export const courseExercises = (c: Course): Exercise[] => c.chapters.flatMap(chapterExercises);
export const subjectExercises = (s: Subject): Exercise[] => s.courses.flatMap(courseExercises);

/** Installs parsed content. */
export function setContent(c: Content): void {
  subjects = c.subjects; dbs = c.dbs; errors = c.errors;
  where.clear(); exById.clear(); lessonById.clear();
  for (const subject of subjects) for (const course of subject.courses) for (const chapter of course.chapters) {
    for (const l of chapter.lessons) { lessonById.set(l.id, l); where.set(l.id, { subject, course, chapter }); }
    for (const e of chapterExercises(chapter)) { exById.set(e.id, e); where.set(e.id, { subject, course, chapter }); }
  }
}

/** Parses the content files and installs them. */
export function loadFiles(files: Files): Content {
  const c = parseContent(files);
  setContent(c);
  return c;
}

export const getSubjects = (): Subject[] => subjects;
export const getDb = (id: string): SampleDb | undefined => dbs[id];
export const contentErrors = (): ParseError[] => errors;
export const allExercises = (): Exercise[] => subjects.flatMap(subjectExercises);
export const allLessons = (): Lesson[] => subjects.flatMap((s) => s.courses.flatMap((c) => c.chapters.flatMap((ch) => ch.lessons)));
export const allChapters = (): Chapter[] => subjects.flatMap((s) => s.courses.flatMap((c) => c.chapters));

export const findExercise = (id: string): Exercise | undefined => exById.get(id);
export const findLesson = (id: string): Lesson | undefined => lessonById.get(id);
/** Subject, course and chapter of a lesson or exercise id. */
export const locate = (id: string): Located | undefined => where.get(id);
export const findSubject = (id: string): Subject | undefined => subjects.find((s) => s.id === id);
export const findCourse = (id: string): { subject: Subject; course: Course } | undefined => {
  for (const subject of subjects) { const course = subject.courses.find((c) => c.id === id); if (course) return { subject, course }; }
  return undefined;
};
export const findChapter = (id: string): Located | undefined => {
  for (const subject of subjects) for (const course of subject.courses) {
    const chapter = course.chapters.find((c) => c.id === id);
    if (chapter) return { subject, course, chapter };
  }
  return undefined;
};

const CACHE = 'gatita.content';

/** Downloads the content files from the server (a copy is kept for offline use). */
export async function fetchContent(base = './api'): Promise<Content> {
  let files: Files | null = null;
  try {
    const res = await fetch(base + '/content', { cache: 'no-store' });
    if (!res.ok) throw new Error(String(res.status));
    files = (await res.json() as { files: Files }).files;
    try { localStorage.setItem(CACHE, JSON.stringify(files)); } catch { /* storage full */ }
  } catch {
    try { files = JSON.parse(localStorage.getItem(CACHE) || 'null'); } catch { files = null; }
  }
  if (!files) throw new Error('Contenu des cours introuvable (serveur injoignable et pas de copie locale).');
  return loadFiles(files);
}
