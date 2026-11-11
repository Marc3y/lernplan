export interface SubjectProgress {
  b: Record<string, boolean>;
  c: Record<string, boolean>;
  x: Record<string, string>;
  p: Record<string, number | string>;
  r: Record<string, boolean>;
  f: { d: string; t: string }[];
  mode?: string;
}

export interface Progress {
  b: Record<string, boolean>;
  c: Record<string, boolean>;
  x: Record<string, string>;
  p: Record<string, number | string>;
  r: Record<string, boolean>;
  f: { d: string; t: string }[];
  ts: number;
  inf?: SubjectProgress;
  mat?: SubjectProgress;
}

export type View = HTMLElement & { _render?: () => void; _renderPartner?: () => void };

export type Unit = [label: string, factor: number];

export type SolverVar = [key: string, label: string, units: Unit[], preset?: number];

export interface Solver {
  id: string;
  name: string;
  f: string;
  vars: SolverVar[];
  convert?: boolean;
  only?: string;
  solve?: Record<string, (v: Record<string, number>) => number>;
  how?: Record<string, string>;
}

export interface PersonRow {
  name: string;
  pct: number;
  got: number;
  exOk: number;
  exTot: number;
  ts: number;
  days: number[];
  rank: number;
}

export interface Notif {
  id: string;
  from: string;
  to: string;
  key: string;
  type: string;
  text: string;
  view: string;
  anchor: string;
  ts: number;
  read: boolean;
}

export type Video = [id: string, title: string, channel: string, duration: string];

export type Block = [minutes: string, tag: string, html: string];

export type Note = [kind: string, title: string, html: string];

export interface Exercise {
  t?: string;
  g?: string;
  q?: string;
  k?: boolean;
  a?: number;
  u?: string;
  o?: string[];
  s?: string;
  off?: boolean;
}

export interface Day {
  n: number;
  date: string;
  wd: string;
  title: string;
  short: string;
  goal: string;
  blocks: Block[];
  notes: Note[];
  vids: string[];
  links: [label: string, url: string][];
  checks: string[];
  groups: string[];
  ex: Exercise[];
  analog?: boolean;
  core?: { b?: number[]; c?: number[] };
  _groups?: { name: string; items: number[] }[];
  _no?: Record<number, number>;
  _mode?: string;
}

export interface ExamTask {
  n: number;
  title: string;
  p: number;
  q: string;
  s: string;
}

export interface Review {
  points: string[];
  q: Exercise[];
}

export interface Lesson {
  t: string;
  g?: string;
  h: string;
  k?: boolean;
}

export type FormulaGroup = [title: string, rows: [label: string, formula: string][]];

export interface CourseMeta {
  brand: string;
  label: string;
  word: string;
  unitsLabel: string;
  eyebrow: string;
  topic: string;
  intro: string;
  goal15: string;
  goalGut: string;
  how: string;
  navExam: string;
  examMins: number;
  examEyebrow: string;
  examLede: string;
  beforeExam: string;
  formulasEyebrow: string;
  formulasTitle: string;
  formulasLede: string;
  formulasNav: string;
  symbols: [string, string][];
  formulas: FormulaGroup[];
  killers: string[];
  rulesHtml: string;
  ai: string;
  tutor: string;
  sugs: string[];
  errExample: string;
}
