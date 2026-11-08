import fs from "fs";
import path from "path";
import crypto from "crypto";

const DATA_DIR = path.join(process.cwd(), "data");
const STATE_FILE = path.join(DATA_DIR, "state.json");
const EVENTS_FILE = path.join(DATA_DIR, "events.json");
const USERS_FILE = path.join(DATA_DIR, "users.json");
const SESSIONS_FILE = path.join(DATA_DIR, "sessions.json");
const MAX_EVENTS = 600;
const DEDUPE_MS = 15 * 60 * 1000;

export interface User {
  salt: string;
  hash: string;
  main: boolean;
  created: number;
}

export interface Session {
  name: string;
  ts: number;
}

export interface StateEntry {
  state: string;
  ts: number;
}

export interface Event {
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

export interface EventInput {
  key?: unknown;
  type?: unknown;
  text?: unknown;
  view?: unknown;
  anchor?: unknown;
  remove?: boolean;
}

export interface StreamClient {
  who: string;
  send(msg: string): void;
}

interface Db {
  state: Record<string, StateEntry>;
  events: Event[];
  users: Record<string, User>;
  sessions: Record<string, Session>;
  streams: Set<StreamClient>;
}

declare global {
  var lernplanDb: Db | undefined;
}

export const MAIN_USERS: Record<string, string> = { Marcus: "MARCUS_PASSWORD", Youssef: "YOUSSEF_PASSWORD" };
export const NAME_RE = /^[A-Za-zÄÖÜäöüß0-9_.-]{3,20}$/;

function readJson<T>(file: string, fallback: T): T {
  try {
    return JSON.parse(fs.readFileSync(file, "utf8"));
  } catch {
    return fallback;
  }
}

function writeJson(file: string, data: unknown) {
  const tmp = file + ".tmp";
  fs.writeFileSync(tmp, JSON.stringify(data));
  fs.renameSync(tmp, file);
}

function hashPw(pw: string, salt: string) {
  return crypto.scryptSync(String(pw), salt, 32).toString("hex");
}

export function checkPw(pw: string, u: User | undefined) {
  if (!u) return false;
  const a = Buffer.from(hashPw(pw, u.salt), "hex");
  const b = Buffer.from(u.hash, "hex");
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

function load(): Db {
  fs.mkdirSync(DATA_DIR, { recursive: true });
  const db: Db = {
    state: readJson(STATE_FILE, {}),
    events: readJson(EVENTS_FILE, []),
    users: readJson(USERS_FILE, {}),
    sessions: readJson(SESSIONS_FILE, {}),
    streams: new Set(),
  };
  let changed = false;
  for (const [name, envKey] of Object.entries(MAIN_USERS)) {
    const pw = process.env[envKey];
    if (pw && !checkPw(pw, db.users[name])) {
      setPw(db, name, pw, true);
      changed = true;
    }
  }
  if (changed) writeJson(USERS_FILE, db.users);
  const ping = setInterval(() => {
    for (const c of db.streams) c.send(": ping\n\n");
  }, 25000);
  ping.unref?.();
  return db;
}

function setPw(db: Db, name: string, pw: string, main: boolean) {
  const salt = crypto.randomBytes(16).toString("hex");
  const prev = db.users[name];
  db.users[name] = { ...prev, salt, hash: hashPw(pw, salt), main: !!main, created: prev?.created || Date.now() };
}

export const db = globalThis.lernplanDb || (globalThis.lernplanDb = load());

export function findUser(name: unknown) {
  const low = String(name || "").trim().toLowerCase();
  return Object.keys(db.users).find(n => n.toLowerCase() === low) || null;
}

export function createUser(name: string, pw: string) {
  setPw(db, name, pw, false);
  writeJson(USERS_FILE, db.users);
}

export function newSession(name: string) {
  const token = crypto.randomBytes(24).toString("base64url");
  db.sessions[token] = { name, ts: Date.now() };
  writeJson(SESSIONS_FILE, db.sessions);
  return token;
}

export function bearer(req: Request) {
  const h = req.headers.get("authorization") || "";
  return h.startsWith("Bearer ") ? h.slice(7) : "";
}

export function endSession(token: string) {
  if (!token || !db.sessions[token]) return;
  delete db.sessions[token];
  writeJson(SESSIONS_FILE, db.sessions);
}

export function authName(req: Request): string | null {
  const token = bearer(req) || new URL(req.url).searchParams.get("token") || "";
  const s = token && db.sessions[token];
  return s && db.users[s.name] ? s.name : null;
}

export function saveState(who: string, entry: StateEntry) {
  db.state[who] = entry;
  writeJson(STATE_FILE, db.state);
}

export function saveEvents() {
  const cap = MAX_EVENTS * Math.max(1, Object.keys(db.users).length - 1);
  if (db.events.length > cap) db.events = db.events.slice(-cap);
  writeJson(EVENTS_FILE, db.events);
}

export function broadcast(type: string, data: unknown, onlyWho?: string) {
  const msg = `event: ${type}\ndata: ${JSON.stringify(data)}\n\n`;
  for (const c of db.streams) if (!onlyWho || c.who === onlyWho) c.send(msg);
}

const str = (v: unknown, max: number) => (typeof v === "string" ? v.slice(0, max) : "");

export function addEvents(from: string, list: EventInput[]) {
  const recipients = Object.keys(db.users).filter(n => n !== from);
  const now = Date.now();
  let changed = false;
  for (const raw of list.slice(0, 40)) {
    if (!raw || typeof raw !== "object") continue;
    const key = str(raw.key, 80);
    if (!key) continue;
    for (const to of recipients) {
      const idx = db.events.findIndex(e => e.from === from && e.to === to && e.key === key && now - e.ts < DEDUPE_MS);
      if (raw.remove) {
        if (idx >= 0 && !db.events[idx].read) {
          const [gone] = db.events.splice(idx, 1);
          changed = true;
          broadcast("retract", { id: gone.id }, to);
        }
        continue;
      }
      const ev: Event = {
        id: now.toString(36) + crypto.randomBytes(4).toString("hex"),
        from,
        to,
        key,
        type: str(raw.type, 20),
        text: str(raw.text, 300),
        view: str(raw.view, 20),
        anchor: str(raw.anchor, 40),
        ts: now,
        read: false,
      };
      if (idx >= 0) db.events.splice(idx, 1);
      db.events.push(ev);
      changed = true;
      broadcast("notif", ev, to);
    }
  }
  if (changed) saveEvents();
}
