/**
 * Course content model. Everything shown to the learner (explanations, exercises, answers) points to the exact place of
 * the course PDF it comes from (`Ref`), so it can always be checked against the book.
 */

/** A place in the course PDF. `page` is the page number printed in the book (it is also the page of the PDF file). */
export interface Ref {
  page: number;
  /** Human label of the part of the course, e.g. "I. A. Le SELECT". */
  section: string;
  /** A few words exactly as written on that page: the viewer highlights the line(s) containing them. */
  anchor?: string;
}

/** Name of a sample database (file content/<matière>/<cours>/bases/<id>.sql). */
export type DbId = string;

interface ExBase {
  id: string;
  /** The question / instruction. Mini-markdown (see lib/md.tsx). */
  q: string;
  /** Explanation shown with the correction. Mini-markdown. */
  explain: string;
  ref: Ref;
  /** 1 = découverte, 2 = application, 3 = examen */
  level?: 1 | 2 | 3;
}

/** Multiple choice: one or several right answers (`answer` is the index, or the list of indexes, of the right choices). */
export interface QcmEx extends ExBase { type: 'qcm'; choices: string[]; answer: number | number[] }

/** Put the pieces in the right order to build a query. `tokens` = the right order (plus optional `extra` distractors). */
export interface OrderEx extends ExBase { type: 'order'; tokens: string[]; extra?: string[]; alt?: string[][] }

/** Fill the blanks: `text` contains `{0}`, `{1}`… ; `bank` holds the words to choose from (right answers + distractors). */
export interface FillEx extends ExBase { type: 'fill'; text: string; answer: string[]; bank: string[] }

/** Type a query: it is run on a sample database and its result is compared with the result of `solution`. */
export interface SqlEx extends ExBase {
  type: 'sql';
  db: DbId;
  solution: string;
  /** For a query that changes the data (INSERT/UPDATE/DELETE): the query whose result must match after running it. */
  check?: string;
  /** The order of the rows matters (ORDER BY asked). */
  ordered?: boolean;
  hint?: string;
}

/** A worked exercise: the learner writes the answer on paper / in the box, then compares with the correction and says how it went. */
export interface OpenEx extends ExBase { type: 'open'; solution: string }

export type Exercise = QcmEx | OrderEx | FillEx | SqlEx | OpenEx;

export type Step = { kind: 'learn'; title: string; body: string; ref: Ref } | { kind: 'ex'; ex: Exercise };

export interface Lesson { id: string; title: string; summary: string; steps: Step[] }

export interface Chapter {
  id: string;
  num: number;
  title: string;
  /** first page of the chapter in the book */
  page: number;
  lessons: Lesson[];
  /** exercises outside the guided lessons (training, past-exam style) */
  exercises: Exercise[];
  /** chapters without content yet are listed but not clickable */
  soon?: boolean;
}

export interface Course { id: string; num: number; title: string; pdf: string; chapters: Chapter[] }

export interface Subject { id: string; title: string; short: string; color: string; icon: string; courses: Course[] }

/**
 * A sample database used to run the queries typed in the exercises. Its STRUCTURE is the one of the course; its ROWS
 * are invented for practice (unless the course gives some).
 */
export interface SampleDb { id: DbId; title: string; ref: { page: number; section: string }; schema: string; note?: string; sql: string }
