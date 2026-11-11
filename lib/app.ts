import { KA, DAYS as PHYS_DAYS } from "./data/days";
import { EXAM as PHYS_EXAM, REVIEW as PHYS_REVIEW } from "./data/exam";
import { FORMULAS, SYMBOLS, ANALOG, KILLERS } from "./data/formulas";
import { LESSONS as PHYS_LESSONS } from "./data/lessons";
import { TIPS as PHYS_TIPS, REVIEW_TIPS as PHYS_REVIEW_TIPS, EXAM_TIPS as PHYS_EXAM_TIPS } from "./data/tips";
import { V } from "./data/videos";
import { INF_DAYS, INF_LESSONS, INF_REVIEW, INF_TIPS, INF_REVIEW_TIPS, INF_EXAM, INF_EXAM_TIPS, INF_FORMULAS, INF_SYMBOLS, INF_KILLERS } from "./data/informatik";
import { MAT_DAYS, MAT_LESSONS, MAT_REVIEW, MAT_TIPS, MAT_REVIEW_TIPS, MAT_EXAM, MAT_EXAM_TIPS, MAT_META } from "./data/mathe";
import type { Progress, SubjectProgress, View, Unit, Solver, PersonRow, Day, ExamTask, Review, Lesson, CourseMeta } from "./types";

const ON_CLAUDE = !!(window.claude && window.claude.use);
const SERVER = !ON_CLAUDE && /^https?:$/.test(location.protocol);
const PEOPLE = ["Marcus", "Youssef"];
const WHO_KEY = "schwingungen15.who";
const OLD_KEY = "schwingungen15.v1";
const keyFor = p => "schwingungen15.v2." + p;
const blankSub = (): SubjectProgress => ({ b: {}, c: {}, x: {}, p: {}, r: {}, f: [] });
const blank = (): Progress => ({ b: {}, c: {}, x: {}, p: {}, r: {}, f: [], ts: 0, inf: blankSub(), mat: blankSub() });
function fill(st): Progress {
  const out = Object.assign(blank(), st || {});
  out.inf = Object.assign(blankSub(), out.inf || {});
  out.mat = Object.assign(blankSub(), out.mat || {});
  return out;
}
const lsGet = k => { try { return localStorage.getItem(k); } catch (e) { return null; } };
const lsSet = (k, v) => { try { localStorage.setItem(k, v); } catch (e) {} };

type Subject = "phys" | "inf" | "mat";
type Course = "inf" | "mat";
const COURSES = {
  phys: { DAYS: PHYS_DAYS, EXAM: PHYS_EXAM, REVIEW: PHYS_REVIEW, LESSONS: PHYS_LESSONS, TIPS: PHYS_TIPS, REVIEW_TIPS: PHYS_REVIEW_TIPS, EXAM_TIPS: PHYS_EXAM_TIPS },
  inf: { DAYS: INF_DAYS, EXAM: INF_EXAM, REVIEW: INF_REVIEW, LESSONS: INF_LESSONS, TIPS: INF_TIPS, REVIEW_TIPS: INF_REVIEW_TIPS, EXAM_TIPS: INF_EXAM_TIPS },
  mat: { DAYS: MAT_DAYS, EXAM: MAT_EXAM, REVIEW: MAT_REVIEW, LESSONS: MAT_LESSONS, TIPS: MAT_TIPS, REVIEW_TIPS: MAT_REVIEW_TIPS, EXAM_TIPS: MAT_EXAM_TIPS },
};
const COURSE_KEYS: Course[] = ["inf", "mat"];
const SUBJ_KEY = "schwingungen15.subj";
let SUBJ: Subject = "phys";
let DAYS: Day[], EXAM: ExamTask[], REVIEW: Record<number, Review>, LESSONS: Record<number, Lesson[]>, TIPS: Record<string, string>, REVIEW_TIPS: Record<string, string>, EXAM_TIPS: Record<string, string>;
function useCourse(s: Subject) {
  SUBJ = s;
  ({ DAYS, EXAM, REVIEW, LESSONS, TIPS, REVIEW_TIPS, EXAM_TIPS } = COURSES[s]);
}
const savedSubj = lsGet(SUBJ_KEY);
useCourse(savedSubj === "inf" || savedSubj === "mat" ? savedSubj : "phys");
function loadLocal(p) {
  let raw = lsGet(keyFor(p));
  if (!raw && p === "Marcus") raw = lsGet(OLD_KEY);
  try { return raw ? fill(JSON.parse(raw)) : blank(); } catch (e) { return blank(); }
}
const AUTH_KEY = "schwingungen15.auth";
let auth = null;
try { auth = JSON.parse(lsGet(AUTH_KEY) || "null"); } catch (e) { auth = null; }
if (!auth || typeof auth.name !== "string" || typeof auth.token !== "string") auth = null;
let who = SERVER ? (auth ? auth.name : null) : lsGet(WHO_KEY);
if (!SERVER && !PEOPLE.includes(who)) who = null;
let S = who ? loadLocal(who) : blank();
const other = () => PEOPLE.includes(who) ? PEOPLE.find(p => p !== who) : null;
const sub = (st: Progress): SubjectProgress => SUBJ === "phys" ? st : st[SUBJ];
const mine = () => sub(S);
const modeOf = (st?: SubjectProgress) => SUBJ !== "phys" && (st || mine()).mode === "gut" ? "gut" : "15";
const MT = (): CourseMeta => META[SUBJ as Course];
const W = () => SUBJ === "phys" ? "Tag" : MT().word;
const shows = (d: Day, kind: "b" | "c", i: number, st?: SubjectProgress) => modeOf(st) !== "gut" || !d.core || (d.core[kind] || []).includes(i);
const exShown = (e, st?: SubjectProgress) => !e.off && (modeOf(st) !== "gut" || !!e.k);
const lessonShown = (l: Lesson) => modeOf() !== "gut" || !!l.k;
function apiFetch(url, opts) {
  opts = Object.assign({}, opts || {});
  opts.headers = Object.assign({}, opts.headers || {});
  if (auth) opts.headers.Authorization = "Bearer " + auth.token;
  return fetch(url, opts).then(r => { if (r.status === 401 && auth && !/api\/(login|register|ai)/.test(url)) authLost(); return r; });
}
const partner = {};
const PEOPLE_TOP = 5;
let serverPeople = [], peopleOpen = false;
let db = null, profilesCol = null, dbTimer = null, synced = false;
function pushRemote() {
  if (!who) return;
  const me = who, snap = JSON.stringify(S), ts = S.ts;
  clearTimeout(dbTimer);
  if (profilesCol) dbTimer = setTimeout(() => { profilesCol.doc(me).set({ state: snap, ts }).then(() => setSync(true)).catch(() => setSync(false)); }, 800);
  else if (SERVER) dbTimer = setTimeout(() => {
    const evs = me === who ? takeEvents() : [];
    apiFetch("api/state/" + encodeURIComponent(me), { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ state: snap, ts, events: evs }) })
      .then(r => { setSync(r.ok); if (!r.ok && r.status !== 409) requeue(evs); })
      .catch(() => { setSync(false); requeue(evs); });
  }, 1200);
}
let firstRemote = true;
function applyRemote(entries) {
  entries.forEach(({ id, st }) => {
    if (!st) return;
    st = fill(st);
    partner[id] = st;
    if (id === who && (st.ts || 0) > (S.ts || 0)) {
      S = st; lsSet(keyFor(who), JSON.stringify(S)); prevSnap = clone(S);
      const typing = document.activeElement && /INPUT|TEXTAREA/.test(document.activeElement.tagName);
      if (!typing) rebuildAll();
    }
  });
  if (firstRemote && who && S.ts && (!partner[who] || (partner[who].ts || 0) < S.ts)) pushRemote();
  firstRemote = false;
  setSync(true);
  refreshProgress();
  renderAccount();
  if (views.fehler && views.fehler._renderPartner) views.fehler._renderPartner();
}
function save() {
  if (!who) return;
  S.ts = Date.now();
  lsSet(keyFor(who), JSON.stringify(S));
  queueEvents();
  pushRemote();
  refreshProgress();
}
function setSync(on) {
  synced = on;
  const t = document.getElementById("acctSync"), dot = document.getElementById("acctDot");
  if (t) t.textContent = on ? "Synchronisiert: dein Stand ist auf jedem Gerät da, auf dem du " + (who || "du") + " auswählst." : "Gespeichert auf diesem Gerät.";
  if (dot) dot.classList.toggle("on", on);
}
function setWho(p) {
  if (!p) return;
  if (who && who !== p) lsSet(keyFor(who), JSON.stringify(S));
  who = p; if (!SERVER) lsSet(WHO_KEY, p);
  S = loadLocal(p);
  if (partner[p] && (partner[p].ts || 0) > (S.ts || 0)) { S = fill(partner[p]); lsSet(keyFor(p), JSON.stringify(S)); }
  renderAccount();
  rebuildAll();
  prevSnap = clone(S); pendingEv.clear();
  notifs = []; unread = 0; closeNc(); bellVisible(); renderBell(); loadNotifs(); connectStream();
}

function dayStats(d, st?: SubjectProgress) {
  st = st || mine();
  let tot = 0, got = 0;
  d.blocks.forEach((_, i) => { if (!shows(d, "b", i, st)) return; tot++; if (st.b[d.n + "." + i]) got++; });
  d.checks.forEach((_, i) => { if (!shows(d, "c", i, st)) return; tot++; if (st.c[d.n + "." + i]) got++; });
  d.ex.forEach((e, i) => { if (!exShown(e, st)) return; tot++; if (st.x[d.n + "." + i] === "ok") got++; });
  return { tot, got, pct: tot ? Math.round(got / tot * 100) : 0 };
}
function allStats(st?: SubjectProgress) {
  st = st || mine();
  let tot = 0, got = 0, exOk = 0, exTot = 0, ck = 0, ckTot = 0;
  DAYS.forEach(d => { const s = dayStats(d, st); tot += s.tot; got += s.got; d.ex.forEach((e, i) => { if (!exShown(e, st)) return; exTot++; if (st.x[d.n + "." + i] === "ok") exOk++; }); d.checks.forEach((_, i) => { if (!shows(d, "c", i, st)) return; ckTot++; if (st.c[d.n + "." + i]) ck++; }); });
  return { pct: tot ? Math.round(got / tot * 100) : 0, got, exOk, exTot, ck, ckTot };
}
const examMax = () => EXAM.reduce((a, t) => a + t.p, 0);
const examGoal = () => Math.ceil(examMax() * 0.9);
function examScore() { let s = 0, any = false; EXAM.forEach(t => { const v = parseFloat(String(mine().p[t.n])); if (!isNaN(v)) { s += Math.max(0, Math.min(t.p, v)); any = true; } }); return any ? s : null; }
function todayIdx() {
  const now = new Date(); const key = now.getFullYear() + "-" + String(now.getMonth() + 1).padStart(2, "0") + "-" + String(now.getDate()).padStart(2, "0");
  return DAYS.findIndex(d => d.date === key);
}
function daysLeft() { const now = new Date(); now.setHours(0, 0, 0, 0); return Math.round((KA.getTime() - now.getTime()) / 86400000); }

const el = <K extends keyof HTMLElementTagNameMap>(tag: K, cls?: string, html?: string | number): HTMLElementTagNameMap[K] => { const e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = String(html); return e; };
const TAGNAME = { basic: "Basics", skript: "Skript", ueben: "Üben", test: "Test" };
function waveSvg(seed) {
  const amp = 14 + (seed % 5) * 3, k = 2 + (seed % 3);
  let d = ""; for (let x = 0; x <= 320; x += 4) { const y = 70 + amp * Math.sin(x / 320 * Math.PI * 2 * k + seed); d += (x ? "L" : "M") + x + " " + y.toFixed(1); }
  let g = ""; for (let x = 40; x < 320; x += 40) g += '<line class="gd" x1="' + x + '" y1="0" x2="' + x + '" y2="140"/>';
  return '<svg viewBox="0 0 320 140" preserveAspectRatio="none" aria-hidden="true">' + g + '<line class="gd" x1="0" y1="70" x2="320" y2="70"/><path class="wave" d="' + d + '"/></svg>';
}
function parseNum(s) {
  if (s == null) return NaN;
  let t = String(s).trim().replace(/\s/g, "").replace(/[−–]/g, "-");
  t = t.replace(/(?:[·x×*])10\^?\(?(-?\d+)\)?/i, "e$1").replace(/(\d),(\d)/g, "$1.$2");
  t = t.replace(/[a-zA-Zµ²\/°]+$/, "");
  return Number(t);
}
function fmt(n) { return String(+n.toPrecision(4)).replace(".", ","); }

const acctBtn = document.getElementById("acctBtn"), acctMenu = document.getElementById("acctMenu"), picker = document.getElementById("picker");
function hueOf(name) { let h = 0; for (const ch of name) h = (h * 31 + ch.charCodeAt(0)) % 360; return h; }
function avStyle(p) { if (PEOPLE.includes(p)) return ""; const h = hueOf(p); return ' style="background:linear-gradient(145deg,hsl(' + h + ' 70% 55%),hsl(' + ((h + 40) % 360) + ' 70% 42%))"'; }
function avatar(p: string, cls?: string) { return '<span class="av ' + (cls || "") + (PEOPLE.includes(p) ? " av-" + p.toLowerCase() : " av-guest") + '"' + avStyle(p) + '>' + p[0].toUpperCase() + '</span>'; }
function personPct(p) { const st = p === who ? S : partner[p]; return st ? allStats(sub(st)).pct : null; }
function renderAccount() {
  const av = document.getElementById("acctAv");
  av.outerHTML = who ? avatar(who).replace('<span class="av ', '<span id="acctAv" class="av ') : '<span class="av" id="acctAv">?</span>';
  document.getElementById("acctName").textContent = who || "Anmelden";
  const list = document.getElementById("acctList"); list.innerHTML = "";
  const item = (html, cls, fn) => { const b = el("button", "acct-item " + (cls || "")); b.type = "button"; b.innerHTML = html; b.addEventListener("click", () => { closeMenu(); fn(); }); list.appendChild(b); return b; };
  if (who && !PEOPLE.includes(who)) {
    const pc = personPct(who);
    item(avatar(who) + '<span class="ai-t"><b>' + who + '</b><small>Gastkonto · ' + (pc == null ? "noch kein Stand" : pc + " % erledigt") + '</small></span><span class="ai-c" aria-hidden="true">✓</span>', "on", () => {});
  }
  PEOPLE.forEach(p => {
    const pc = personPct(p);
    item(avatar(p) + '<span class="ai-t"><b>' + p + '</b><small>' + (pc == null ? "Noch kein Stand" : pc + " % erledigt") + '</small></span><span class="ai-c" aria-hidden="true">' + (p === who ? "✓" : "") + '</span>', p === who ? "on" : "", () => { if (p !== who) showPicker(SERVER ? "pw" : "start", p); });
  });
  if (SERVER) {
    item('<span class="ai-ico" aria-hidden="true">@</span><span class="ai-t"><b>Mit Benutzername anmelden</b><small>Gastkonto anmelden oder erstellen</small></span><span></span>', "", () => showPicker("guest"));
    if (who) item('<span class="ai-ico out" aria-hidden="true">↩</span><span class="ai-t"><b>Abmelden</b><small>Auf diesem Gerät</small></span><span></span>', "danger", logout);
  }
  setSync(synced);
}
function openMenu() { renderAccount(); acctMenu.classList.add("open"); acctMenu.setAttribute("aria-hidden", "false"); acctBtn.setAttribute("aria-expanded", "true"); }
function closeMenu() { acctMenu.classList.remove("open"); acctMenu.setAttribute("aria-hidden", "true"); acctBtn.setAttribute("aria-expanded", "false"); }
acctBtn.addEventListener("click", ev => { ev.stopPropagation(); if (!who) { showPicker(); return; } acctMenu.classList.contains("open") ? closeMenu() : openMenu(); });
document.addEventListener("click", ev => { if (acctMenu.classList.contains("open") && !(ev.target as Element).closest(".acct")) closeMenu(); });
document.addEventListener("keydown", ev => { if (ev.key === "Escape") { closeMenu(); if (!picker.hidden && who) hidePicker(); } });

function hidePicker() { picker.classList.remove("open"); setTimeout(() => { if (!picker.classList.contains("open")) picker.hidden = true; }, 260); }
let guestMode = "login";
function showPicker(mode?: string, person?: string) {
  mode = mode || "start";
  const body = document.getElementById("pickBody");
  const close = who ? '<button class="x pick-x" type="button" id="pickClose" aria-label="Schließen">×</button>' : "";
  if (mode === "start") {
    body.innerHTML = close + '<svg class="picker-wave" viewBox="0 0 120 40" aria-hidden="true"><path d="M2 20 C 17 -4, 27 -4, 42 20 S 67 44, 82 20 S 107 -4, 118 20" fill="none" stroke-width="3" stroke-linecap="round"/></svg>' +
      '<h2 id="pickTitle">Wer lernt hier?</h2><p>Jeder hat seine eigenen Häkchen, Übungen, Punkte und sein eigenes Fehlerheft. Dieses Gerät bleibt angemeldet, oben rechts kannst du jederzeit wechseln.</p><div class="pick-row" id="pickRow"></div>' +
      (SERVER ? '<button class="pick-guest" type="button" id="pickGuest">Mit Benutzername anmelden</button>' : "");
    const row = body.querySelector("#pickRow");
    PEOPLE.forEach(p => {
      const b = el("button", "pick"); b.type = "button";
      b.innerHTML = avatar(p, "av-lg") + "<b>" + p + "</b><small>Ich bin " + p + "</small>";
      b.addEventListener("click", () => {
        if (SERVER) { showPicker("pw", p); return; }
        hidePicker(); setWho(p); toast("Hi " + p + ", dein Fortschritt wird ab jetzt für dich gespeichert.");
      });
      row.appendChild(b);
    });
    const g = body.querySelector("#pickGuest"); if (g) g.addEventListener("click", () => showPicker("guest"));
  } else if (mode === "pw") {
    body.innerHTML = close + avatar(person, "av-lg") + '<h2 id="pickTitle">Hi ' + person + '</h2><p>Gib dein Passwort ein. Auf diesem Gerät bleibst du danach angemeldet.</p>' +
      '<form class="pick-form" id="pickForm"><input type="password" id="pickPw" autocomplete="current-password" placeholder="Passwort" aria-label="Passwort für ' + person + '" inputmode="numeric"><p class="pick-err" id="pickErr" hidden></p><button class="cta" type="submit">Anmelden</button></form>' +
      '<button class="pick-back" type="button" id="pickBack">Zurück</button>';
    body.querySelector("#pickForm").addEventListener("submit", ev => { ev.preventDefault(); doAuth("login", person, body.querySelector<HTMLInputElement>("#pickPw").value); });
    body.querySelector("#pickBack").addEventListener("click", () => showPicker("start"));
    setTimeout(() => { const i = body.querySelector<HTMLInputElement>("#pickPw"); if (i) i.focus(); }, 80);
  } else {
    const reg = guestMode === "register";
    body.innerHTML = close + '<h2 id="pickTitle">' + (reg ? "Gastkonto erstellen" : "Mit Benutzername anmelden") + '</h2><p>' + (reg ? "Für alle, die den Lernplan auch machen wollen. Such dir einen Benutzernamen aus, den es noch nicht gibt." : "Für Gastkonten. Marcus und Youssef melden sich oben auf der Startseite an.") + '</p>' +
      '<div class="seg pick-seg"><button type="button" data-g="login" class="' + (reg ? "" : "on") + '">Anmelden</button><button type="button" data-g="register" class="' + (reg ? "on" : "") + '">Konto erstellen</button></div>' +
      '<form class="pick-form" id="pickForm"><input type="text" id="pickName" autocomplete="username" autocapitalize="off" spellcheck="false" placeholder="Benutzername" aria-label="Benutzername" maxlength="20">' +
      '<input type="password" id="pickPw" autocomplete="' + (reg ? "new-password" : "current-password") + '" placeholder="' + (reg ? "Passwort (mind. 4 Zeichen)" : "Passwort") + '" aria-label="Passwort">' +
      (reg ? '<input type="password" id="pickPw2" autocomplete="new-password" placeholder="Passwort wiederholen" aria-label="Passwort wiederholen">' : "") +
      '<p class="pick-err" id="pickErr" hidden></p><button class="cta" type="submit">' + (reg ? "Konto erstellen" : "Anmelden") + '</button></form>' +
      '<button class="pick-back" type="button" id="pickBack">Zurück zu Marcus und Youssef</button>';
    body.querySelectorAll<HTMLButtonElement>(".pick-seg button").forEach(b => b.addEventListener("click", () => { guestMode = b.dataset.g; showPicker("guest"); }));
    body.querySelector("#pickForm").addEventListener("submit", ev => {
      ev.preventDefault();
      const n = body.querySelector<HTMLInputElement>("#pickName").value.trim(), pw = body.querySelector<HTMLInputElement>("#pickPw").value;
      if (reg && pw !== body.querySelector<HTMLInputElement>("#pickPw2").value) return pickError("Die Passwörter sind nicht gleich.");
      doAuth(reg ? "register" : "login", n, pw);
    });
    body.querySelector("#pickBack").addEventListener("click", () => showPicker("start"));
    setTimeout(() => { const i = body.querySelector<HTMLInputElement>("#pickName"); if (i) i.focus(); }, 80);
  }
  const c = body.querySelector("#pickClose"); if (c) c.addEventListener("click", hidePicker);
  picker.hidden = false;
  requestAnimationFrame(() => picker.classList.add("open"));
}
function pickError(msg) { const e = document.getElementById("pickErr"); if (!e) return; e.textContent = msg; e.hidden = false; const f = document.getElementById("pickForm"); if (f) { f.classList.remove("shake"); void f.offsetWidth; f.classList.add("shake"); } }
async function doAuth(kind, name, password) {
  if (!name || !password) return pickError(kind === "register" ? "Benutzername und Passwort eingeben." : "Bitte das Passwort eingeben.");
  const btn = document.querySelector<HTMLButtonElement>("#pickForm .cta"); if (btn) btn.disabled = true;
  try {
    const r = await fetch("api/" + kind, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name, password }) });
    const j = await r.json().catch(() => ({}));
    if (!r.ok) { pickError(j.error || "Das hat nicht geklappt."); return; }
    if (auth && auth.token !== j.token) apiFetch("api/logout", { method: "POST" }).catch(() => {});
    auth = { name: j.name, token: j.token }; lsSet(AUTH_KEY, JSON.stringify(auth));
    hidePicker();
    setWho(j.name);
    pullState();
    toast(kind === "register" ? "Konto „" + j.name + "“ erstellt. Dein Fortschritt wird ab jetzt gespeichert." : "Hi " + j.name + ", du bist angemeldet.");
  } catch (e) { pickError("Keine Verbindung zum Server."); }
  finally { if (btn) btn.disabled = false; }
}
function signOutLocal() {
  if (who) lsSet(keyFor(who), JSON.stringify(S));
  auth = null; try { localStorage.removeItem(AUTH_KEY); } catch (e) {}
  who = null; S = blank();
  if (es) { es.close(); es = null; }
  notifs = []; unread = 0; closeNc(); bellVisible(); renderBell(); renderAccount(); rebuildAll(); prevSnap = clone(S); pendingEv.clear();
}
function logout() {
  apiFetch("api/logout", { method: "POST" }).catch(() => {});
  signOutLocal();
  toast("Abgemeldet.");
  showPicker("start");
}
let authLostShown = false;
function authLost() {
  if (authLostShown) return; authLostShown = true;
  signOutLocal();
  toast("Bitte melde dich neu an.", true);
  showPicker("start");
  setTimeout(() => { authLostShown = false; }, 3000);
}
let toastT: ReturnType<typeof setTimeout> | undefined;
function toast(msg: string, bad?: boolean) {
  const t = document.getElementById("toast");
  t.textContent = msg; t.classList.toggle("bad", !!bad); t.hidden = false;
  requestAnimationFrame(() => t.classList.add("show"));
  clearTimeout(toastT); toastT = setTimeout(() => { t.classList.remove("show"); setTimeout(() => { t.hidden = true; }, 300); }, bad ? 7000 : 2600);
}
window.addEventListener("error", ev => toast("Fehler: " + (ev.message || "unbekannt") + ". Lade die Seite neu und schick mir diese Meldung.", true));
window.addEventListener("unhandledrejection", ev => { const r = ev.reason; if (r && (r.code === "cancelled" || r.name === "AbortError")) return; });

function makeNav() {
  if (SUBJ !== "phys") return [["start", "Übersicht", "Ziel und Fortschritt"]].concat(DAYS.map(d => ["tag" + d.n, W() + " " + d.n, d.short])).concat([["klausur", "Probeklausur", MT().navExam], ["formeln", "Formeln", MT().formulasNav], ["fehler", "Fehlerheft", "Deine Fehler, ein Satz je Fehler"], ["regeln", "Spielregeln", "So holt ihr die Punkte"]]);
  return [["start", "Übersicht", "Countdown und Fortschritt"]].concat(DAYS.map(d => ["tag" + d.n, "Tag " + d.n, d.wd + " · " + d.short])).concat([["klausur", "Probeklausur", "90 min, 70 Punkte"], ["formeln", "Formeln", "Alles zum Auswendiglernen"], ["fehler", "Fehlerheft", "Deine Fehler, ein Satz je Fehler"], ["regeln", "Spielregeln", "So lernt ihr zu zweit"]]);
}
let NAV: string[][] = [];
const ICONS = { start: "M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z", klausur: "M12 7v5l3 2M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM9 1h6", formeln: "M15 4c-2.5 0-3 1.5-3.4 4L10 17c-.4 2.5-1 3.5-3 3.5M7.5 9.5h8M14 13l5 6M19 13l-5 6", fehler: "M5 4h11a3 3 0 0 1 3 3v13H8a3 3 0 0 1-3-3zM5 17a3 3 0 0 1 3-3h11M9 8h6", regeln: "M9 6h11M9 12h11M9 18h11M4 6h.01M4 12h.01M4 18h.01" };
function buildNav() {
  const rail = document.getElementById("rail"), strip = document.getElementById("strip");
  rail.innerHTML = ""; strip.innerHTML = "";
  const ti = todayIdx();
  const heads = SUBJ !== "phys" ? { 0: "Plan", 1: MT().unitsLabel, [DAYS.length + 1]: MT().beforeExam, [DAYS.length + 2]: "Werkzeuge" } : { 0: "Plan", 1: "Woche 1", 5: "Woche 2", 10: "Vor der Klausur", 11: "Werkzeuge" };
  NAV.forEach(([id, label, sub], i) => {
    if (heads[i]) rail.appendChild(el("div", "grp", heads[i]));
    const a = el("button", "nav"); a.type = "button"; a.dataset.go = id; a.dataset.id = id;
    const isDay = id.startsWith("tag");
    const ico = isDay ? '<svg class="ring" viewBox="0 0 24 24" aria-hidden="true"><circle class="rt" cx="12" cy="12" r="9"/><circle class="rf" cx="12" cy="12" r="9" pathLength="100" stroke-dasharray="100" stroke-dashoffset="100"/></svg>' : '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="' + ICONS[id] + '"/></svg>';
    a.innerHTML = ico + '<span class="lbl"><span>' + label + "</span><small>" + sub + "</small></span>" + (isDay ? '<span class="pct mono"></span>' : "");
    if (isDay && DAYS[+id.slice(3) - 1] && todayIdx() === +id.slice(3) - 1) a.classList.add("today");
    rail.appendChild(a);
    const c = el("button", "", isDay ? "T" + id.slice(3) : label); c.type = "button"; c.dataset.go = id; c.dataset.id = id; strip.appendChild(c);
  });
}
function refreshProgress() {
  DAYS.forEach(d => {
    const s = dayStats(d), a = document.querySelector('.rail .nav[data-id="tag' + d.n + '"]');
    if (a) { a.querySelector(".pct").textContent = s.pct + "%"; a.querySelector(".rf").setAttribute("stroke-dashoffset", String(100 - s.pct)); a.classList.toggle("done", s.pct === 100); }
    const dp = document.getElementById("dp" + d.n); if (dp) { dp.style.width = s.pct + "%"; document.getElementById("dpt" + d.n).textContent = s.got + " / " + s.tot + " erledigt · " + s.pct + " %"; }
  });
  const st = allStats(); amp = st.pct / 100;
  const set = (id, v) => { const e = document.getElementById(id); if (e) e.textContent = v; };
  set("stPct", st.pct + "%"); set("stEx", st.exOk + "/" + st.exTot); set("stCk", st.ck + "/" + st.ckTot);
  const es = examScore(); set("stExam", es == null ? "–" : Math.round(es / examMax() * 100) + "%");
  drawChart();
  const sc = document.getElementById("examTotal"); if (sc) { const v = examScore(); sc.textContent = (v == null ? 0 : v) + " / " + examMax(); const m = document.getElementById("examMsg"); if (m) m.textContent = v == null ? "Trag nach dem Korrigieren deine Punkte ein." : v >= examGoal() ? "Mindestens 90 %. Das ist 15-Punkte-Niveau." : "Noch " + (examGoal() - v) + " Punkte bis 90 %. Die Lücken stehen jetzt im Fehlerheft."; }
  refreshExCounts();
  refreshPartnerMarks();
}

const main = document.getElementById("main");
const views: Record<string, View> = {};

function viewStart() {
  if (SUBJ !== "phys") return viewStartCourse();
  const v = el("div", "view"); v.id = "v-start";
  const ti = todayIdx(), dl = daysLeft();
  let todayTxt;
  if (ti >= 0) todayTxt = 'Heute ist <b>Tag ' + DAYS[ti].n + ': ' + DAYS[ti].title + '</b>.';
  else if (dl === 15) todayTxt = 'Morgen geht es los mit Tag 1. Heute nur: Plan durchlesen, Spielregeln klären, Fehlerheft anlegen.';
  else if (dl > 15) todayTxt = 'Start ist am Dienstag, 20.10. Bis dahin: Plan lesen, Spielregeln klären, Fehlerheft anlegen.';
  else if (dl > 0) todayTxt = 'Heute ist kein Lerntag. Pause machen gehört zum Plan.';
  else todayTxt = 'Die Klausur ist geschrieben.';
  const go = ti >= 0 ? "tag" + DAYS[ti].n : (dl > 14 ? "tag1" : "formeln");
  v.innerHTML =
  '<div class="card hero">' +
    '<div class="eyebrow">Physik · Kapitel 13 · Klausur am Dienstag, 03.11.2026</div>' +
    '<h1 style="margin-top:8px">' + (who ? who + ", auf " : "Auf ") + '<em>15 Punkte</em> in zehn Lerntagen.</h1>' +
    '<p class="sub">10 Tage × 3 Stunden, aufgebaut auf eurem OneNote-Skript „13 Schwingungen“ (13.1 bis 13.6) und den Aufgabenseiten dort. Die Kurve unten wird größer, je mehr du erledigst.</p>' +
    '<canvas id="scope" aria-hidden="true"></canvas>' +
    '<div class="stats">' +
      '<div class="stat"><span class="v" id="stCd">' + Math.max(dl, 0) + '</span><span class="l">Tage bis zur Klausur</span></div>' +
      '<div class="stat"><span class="v" id="stPct">0%</span><span class="l">Gesamtfortschritt</span></div>' +
      '<div class="stat"><span class="v" id="stEx">0/0</span><span class="l">Übungen richtig</span></div>' +
      '<div class="stat"><span class="v" id="stExam">–</span><span class="l">Probeklausur</span></div>' +
    '</div>' +
    '<div class="row" style="margin-top:16px"><button type="button" class="cta" data-go="' + go + '">' + (ti >= 0 ? "Weiter mit Tag " + DAYS[ti].n : dl > 14 ? "Mit Tag 1 starten" : "Zu den Formeln") + '</button><span style="color:var(--muted)">' + todayTxt + '</span></div>' +
  '</div>' +
  '<section class="card" id="duo"><h2>Alle im Vergleich <span class="cnt" id="ppCnt"></span></h2><div id="ppBody"></div></section>' +
  '<section class="card"><h2>Fortschritt pro Tag <span class="cnt">Blöcke, Checklisten und Übungen · <span id="stCk"></span> Checkpunkte</span></h2>' +
    '<div class="chart-wrap"><svg id="chart" viewBox="0 0 640 230" role="img" aria-label="Fortschritt pro Lerntag in Prozent"></svg></div>' +
    '<div class="legend" id="legend"></div>' +
  '</section>' +
  '<section><h2>Kalender</h2><div class="cal" id="cal"></div></section>' +
  '<section class="card stack"><h2>Wie „100 % sicher“ funktioniert</h2><p>Sicherheit kommt nicht vom Gefühl „ich hab viel gelernt“, sondern von einem Beweis. Jeder Tag endet mit einer Checkliste „Du kannst …“. Ein Haken zählt nur, wenn du es <b>ohne Hilfe, ohne Skript und laut erklärt</b> kannst. Am Montag, 02.11., schreibst du die Probeklausur unter Echtbedingungen. Wenn alle Checklisten voll sind und die Probeklausur mindestens 90 % hat, gehst du entspannt in die Arbeit, weil du es schon gemacht hast.</p>' +
  '<p><span class="tag t-basic">Basics</span>Stoff aus Klasse 7–10 &nbsp; <span class="tag t-skript">Skript</span>euer Klausurstoff &nbsp; <span class="tag t-ueben">Üben</span>Aufgaben &nbsp; <span class="tag t-test">Test</span>Selbsttest ohne Hilfe</p></section>';
  const cal = v.querySelector("#cal");
  DAYS.forEach((d, i) => {
    const a = el("a", "", "<b>" + d.wd.split(" ")[0] + " " + d.wd.split(" ")[1] + "</b>" + d.short); a.dataset.go = "tag" + d.n; a.tabIndex = 0; a.setAttribute("role", "button"); cal.appendChild(a);
    if (i === 3) cal.appendChild(el("div", "we", "<b>Sa/So</b>24./25.10. frei"));
    if (i === 8) cal.appendChild(el("div", "we", "<b>Sa/So</b>31.10./01.11. frei"));
  });
  cal.appendChild(el("div", "ka", "<b>Di 03.11.</b>Klausur"));
  return v;
}

function drawChart() {
  const svg = document.getElementById("chart"); if (!svg) return;
  const W = 640, H = 230, L = 40, R = 10, T = 22, B = 46, ph = H - T - B, pw = W - L - R, bw = pw / DAYS.length;
  const op = other(), ps = op && partner[op] ? sub(partner[op]) : null;
  let h = "";
  [0, 25, 50, 75, 100].forEach(p => { const y = T + ph - ph * p / 100; h += '<line class="gl" x1="' + L + '" x2="' + (W - R) + '" y1="' + y + '" y2="' + y + '"/><text x="' + (L - 8) + '" y="' + (y + 4) + '" text-anchor="end">' + p + '</text>'; });
  const ti = todayIdx();
  DAYS.forEach((d, i) => {
    const s = dayStats(d), cx = L + i * bw + bw / 2;
    const bar = (pct, x, w, cls) => { const bh = ph * pct / 100; let o = '<rect class="bt" x="' + x + '" y="' + T + '" width="' + w + '" height="' + ph + '" rx="' + Math.min(4, w / 2) + '"/>'; if (bh > 0) o += '<rect class="' + cls + (pct === 100 ? " full" : "") + '" x="' + x + '" y="' + (T + ph - bh) + '" width="' + w + '" height="' + bh + '" rx="' + Math.min(4, w / 2) + '"/>'; return o; };
    if (ps) {
      const w = bw * 0.3, q = dayStats(d, ps);
      h += bar(s.pct, cx - w - 1.5, w, "b") + bar(q.pct, cx + 1.5, w, "b2");
      const top = Math.max(s.pct, q.pct);
      if (top) h += '<text class="val" x="' + cx + '" y="' + (T + ph - ph * top / 100 - 6) + '" text-anchor="middle">' + s.pct + "·" + q.pct + '</text>';
    } else {
      const w = bw * 0.6, bh = ph * s.pct / 100;
      h += bar(s.pct, cx - w / 2, w, "b");
      if (s.pct) h += '<text class="val" x="' + cx + '" y="' + (T + ph - bh - 6) + '" text-anchor="middle">' + s.pct + '%</text>';
    }
    h += '<text x="' + cx + '" y="' + (H - B + 18) + '" text-anchor="middle">T' + d.n + '</text><text x="' + cx + '" y="' + (H - B + 33) + '" text-anchor="middle">' + d.wd.slice(3, 9) + '</text>';
    if (i === ti) h += '<line class="tm" x1="' + cx + '" x2="' + cx + '" y1="' + (T - 14) + '" y2="' + (T + ph) + '"/><text class="tml" x="' + cx + '" y="' + (T - 16) + '" text-anchor="middle">heute</text>';
  });
  svg.innerHTML = h;
  const lg = document.getElementById("legend");
  if (lg) lg.innerHTML = '<span><i style="background:var(--accent)"></i>' + (who || "Du") + '</span>' + (ps ? '<span><i style="background:var(--indigo)"></i>' + op + '</span>' : '<span>' + (op ? op + " erscheint hier, sobald er seinen Stand gespeichert hat." : "") + '</span>') + '<span><i style="background:var(--good-fill)"></i>Tag komplett</span><span><i style="background:var(--warm)"></i>Heute</span>';
  renderPeople();
}

function personRow(p: string): PersonRow {
  const st = p === who ? S : partner[p];
  try {
    const s = sub(st || blank());
    const a = allStats(s);
    return { name: p, pct: a.pct, got: a.got, exOk: a.exOk, exTot: a.exTot, ts: st ? Number(st.ts) || 0 : 0, days: DAYS.map(d => dayStats(d, s).pct), rank: 0 };
  } catch (e) {
    return { name: p, pct: 0, got: 0, exOk: 0, exTot: 0, ts: 0, days: DAYS.map(() => 0), rank: 0 };
  }
}
function renderPeople() {
  const body = document.getElementById("ppBody");
  if (!body || !who) return;
  const names = [...new Set([who, ...PEOPLE.filter(p => partner[p]), ...serverPeople, ...Object.keys(partner)])];
  const rows = names.map(personRow).sort((a, b) => b.got - a.got || b.ts - a.ts || a.name.localeCompare(b.name));
  let rank = 0;
  rows.forEach((r, i) => { if (!i || r.got !== rows[i - 1].got) rank = i + 1; r.rank = rank; });
  const collapsible = rows.length > PEOPLE_TOP + 1;
  const shown = !collapsible || peopleOpen ? rows : rows.filter((r, i) => i < PEOPLE_TOP || r.name === who);
  const row = r => {
    const meta = !r.got ? "Noch nicht gestartet" : r.exOk + " von " + r.exTot + " Übungen" + (r.ts ? " · " + (r.name === who ? "zuletzt " : "") + relTime(r.ts) : "");
    const strip = r.days.map((pc, i) => '<span title="' + W() + ' ' + (i + 1) + ': ' + pc + ' %">' + (pc ? '<i class="' + (pc === 100 ? "full" : "") + '" style="width:' + pc + '%"></i>' : "") + '</span>').join("");
    return '<div class="pp-r' + (r.name === who ? " me" : "") + (r.got ? "" : " idle") + '"><span class="pp-n">' + (r.got ? r.rank : "–") + '</span>' + avatar(r.name) + '<div class="pp-m"><div class="pp-t"><b>' + r.name + (r.name === who ? ' <small>(du)</small>' : "") + '</b><span>' + r.pct + ' %</span></div><div class="pp-days" role="img" aria-label="' + r.pct + ' Prozent erledigt">' + strip + '</div><small>' + meta + '</small></div></div>';
  };
  const scroll = body.querySelector(".pp-list");
  const top = scroll ? scroll.scrollTop : 0;
  body.innerHTML = '<div class="pp-list' + (collapsible && peopleOpen ? " open" : "") + '">' + shown.map(row).join("") + '</div>' +
    (collapsible ? '<button type="button" class="btn ghost pp-more" aria-expanded="' + peopleOpen + '">' + (peopleOpen ? "Weniger anzeigen" : "Alle " + rows.length + " anzeigen") + '</button>' : "");
  body.querySelector(".pp-list").scrollTop = top;
  const more = body.querySelector(".pp-more");
  if (more) more.addEventListener("click", () => { peopleOpen = !peopleOpen; renderPeople(); const b = document.querySelector<HTMLButtonElement>("#ppBody .pp-more"); if (b) b.focus(); });
  document.getElementById("ppCnt").textContent = rows.length + (rows.length === 1 ? " Konto" : " Konten") + " · jeder Balken ist ein Lerntag";
}

function viewDay(d) {
  const v = el("div", "view"); v.id = "v-tag" + d.n;
  const head = el("div", "dayhead");
  const mins = d.blocks.reduce((a, b, i) => a + (shows(d, "b", i) ? +b[0] : 0), 0);
  head.innerHTML = '<div class="meta"><span class="eyebrow">' + W() + ' ' + d.n + ' von ' + DAYS.length + (SUBJ !== "phys" ? ' · ' + mins + ' Minuten' + (modeOf() === "gut" ? ' · Gute Note: nur das Wichtigste' : ' · 15 Punkte: alles') : ' · ' + d.wd + ' · 3 Stunden') + '</span></div><h1>' + d.title + '</h1><p class="lede"><b>Ziel:</b> ' + d.goal + '</p><div class="prog" style="margin-top:6px"><i id="dp' + d.n + '"></i></div><span class="mono" style="font-size:13px;color:var(--muted)" id="dpt' + d.n + '"></span>';
  const jump = el("button", "btn rev-jump", "Zur Wiederholung"); jump.type = "button"; jump.id = "revJump" + d.n;
  jump.addEventListener("click", () => { const t = document.getElementById("rev" + d.n); if (t) t.scrollIntoView({ block: "start", behavior: reduceMotion() ? "auto" : "smooth" }); });
  head.appendChild(jump);
  v.appendChild(head);
  v.appendChild(viewLessons(d));

  const sb = el("section"); sb.innerHTML = '<h2>Ablauf <span class="cnt">' + mins + ' min</span></h2>';
  const bl = el("div", "blocks");
  d.blocks.forEach((b, i) => {
    if (!shows(d, "b", i)) return;
    const k = d.n + "." + i, row = el("label", "blk" + (mine().b[k] ? " on" : "")); row.dataset.pk = "b:" + k;
    row.innerHTML = '<input type="checkbox" class="ck" id="b' + d.n + "_" + i + '"' + (mine().b[k] ? " checked" : "") + ' aria-label="Block erledigt"><span class="time">' + b[0] + ' min</span><span class="body"><span class="tag t-' + b[1] + '">' + TAGNAME[b[1]] + '</span>' + b[2] + '</span>';
    row.querySelector("input").addEventListener("change", e => { mine().b[k] = (e.target as HTMLInputElement).checked; row.classList.toggle("on", (e.target as HTMLInputElement).checked); save(); });
    bl.appendChild(row);
  });
  sb.appendChild(bl); v.appendChild(sb);

  d.notes.forEach(n => v.appendChild(el("div", "note " + n[0], "<b>" + n[1] + "</b>" + n[2])));
  if (d.analog) {
    const t = el("section", "card"); t.innerHTML = '<h2>Analogie Federpendel ↔ Schwingkreis</h2><div class="chart-wrap"><table class="ftable">' + ANALOG.map(r => '<tr><td>' + r[0] + '</td><td style="font-family:var(--f-math)">' + r[1] + '</td></tr>').join("") + '</table></div>'; v.appendChild(t);
  }

  if (d.vids.length || d.links.length) {
    const sv = el("section"); sv.innerHTML = '<h2>Videos und Links <span class="cnt">optional</span></h2>';
    if (d.vids.length) {
      const g = el("div", "vids");
      d.vids.forEach((key, i) => { const x = V[key]; const a = el("a", "vid"); a.href = "https://www.youtube.com/watch?v=" + x[0]; a.target = "_blank"; a.rel = "noopener";
        a.innerHTML = '<div class="scr">' + waveSvg(d.n * 7 + i) + '<span class="play"></span><span class="dur">' + x[3] + '</span></div><div class="tx"><span class="tt">' + x[1] + '</span><span class="ch">' + x[2] + ' · YouTube</span></div>'; g.appendChild(a); });
      sv.appendChild(g);
    }
    if (d.links.length) { const l = el("div", "links"); l.style.marginTop = "12px"; d.links.forEach(([t, u]) => { const a = el("a", "btn", t + " ↗"); if (u[0] !== "#") { a.href = u; a.target = "_blank"; a.rel = "noopener"; } else { a.dataset.go = u.slice(1); a.textContent = t + " →"; a.tabIndex = 0; a.setAttribute("role", "button"); } l.appendChild(a); }); sv.appendChild(l); }
    v.appendChild(sv);
  }

  if (d.ex.length) {
    const se = el("section"); se.innerHTML = '<h2>Übungen <span class="cnt">' + d.ex.filter(e => exShown(e)).length + ' Aufgaben, direkt hier lösen</span></h2>';
    const groups = exGroups(d);
    if (groups.length > 1) {
      const nav = el("div", "ex-nav");
      groups.forEach((g, gi) => { const b = el("button", "ex-chip"); b.type = "button"; b.innerHTML = '<span></span><small data-gc="' + d.n + "|" + gi + '"></small>'; b.firstChild.textContent = g.name; b.addEventListener("click", () => { const t = document.getElementById("exg" + d.n + "_" + gi); if (t) t.scrollIntoView({ block: "start", behavior: reduceMotion() ? "auto" : "smooth" }); }); nav.appendChild(b); });
      se.appendChild(nav);
    }
    groups.forEach((g, gi) => {
      const box = el("div", "ex-group"); box.id = "exg" + d.n + "_" + gi;
      if (groups.length > 1 || g.name) { const h = el("h3", "ex-gh", '<span></span><small data-gc="' + d.n + "|" + gi + '"></small>'); h.firstChild.textContent = g.name;
        const li = (LESSONS[d.n] || []).findIndex(l => l.g === g.name && lessonShown(l));
        if (li >= 0) { const lb = el("button", "les-btn", "Erklärung"); lb.type = "button"; lb.addEventListener("click", () => openLesson(d, li)); h.appendChild(lb); }
        box.appendChild(h); }
      const list = el("div", "exs"); g.items.forEach(i => list.appendChild(exCard(d, d.ex[i], i))); box.appendChild(list);
      se.appendChild(box);
    });
    v.appendChild(se);
  }

  const sc = el("section", "card"); sc.innerHTML = '<h2>Du kannst … <span class="cnt">nur abhaken, wenn es ohne Hilfe klappt</span></h2>';
  const cl = el("div", "checks");
  d.checks.forEach((c, i) => { if (!shows(d, "c", i)) return; const k = d.n + "." + i, lb = el("label", mine().c[k] ? "on" : ""); lb.dataset.pk = "c:" + k; lb.innerHTML = '<input type="checkbox" class="ck" id="c' + d.n + "_" + i + '"' + (mine().c[k] ? " checked" : "") + '><span>' + c.replace(/_max/g, "<sub>max</sub>") + '</span>';
    lb.querySelector("input").addEventListener("change", e => { mine().c[k] = (e.target as HTMLInputElement).checked; lb.classList.toggle("on", (e.target as HTMLInputElement).checked); save(); }); cl.appendChild(lb); });
  sc.appendChild(cl); v.appendChild(sc);

  v.appendChild(viewReview(d));
  if (reviewDone(d)) { jump.textContent = "Wiederholung geschafft ✓"; jump.classList.add("ok"); }

  const pg = el("div", "pager");
  pg.innerHTML = (d.n > 1 ? '<button type="button" class="btn" data-go="tag' + (d.n - 1) + '">← ' + W() + ' ' + (d.n - 1) + '</button>' : '<button type="button" class="btn" data-go="start">← Übersicht</button>') + (d.n < DAYS.length ? '<button type="button" class="btn" data-go="tag' + (d.n + 1) + '">' + W() + ' ' + (d.n + 1) + ' →</button>' : '<button type="button" class="btn" data-go="klausur">Zur Probeklausur →</button>');
  v.appendChild(pg);
  return v;
}

const TIP_ICON = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3.6 10.8c.7.6 1.1 1.3 1.1 2.2h5c0-.9.4-1.6 1.1-2.2A6 6 0 0 0 12 3z"/></svg>';
function tipControl(text) {
  const btn = el("button", "tip-btn", TIP_ICON); btn.type = "button"; btn.title = "Tipp anzeigen"; btn.setAttribute("aria-label", "Tipp anzeigen"); btn.setAttribute("aria-expanded", "false");
  const box = el("div", "tip-box", "<b>Tipp:</b> " + text); box.hidden = true;
  btn.addEventListener("click", () => { box.hidden = !box.hidden; const open = !box.hidden; btn.classList.toggle("on", open); btn.setAttribute("aria-expanded", open ? "true" : "false"); btn.setAttribute("aria-label", open ? "Tipp ausblenden" : "Tipp anzeigen"); btn.title = open ? "Tipp ausblenden" : "Tipp anzeigen"; });
  return { btn, box };
}
function viewLessons(d) {
  const list = LESSONS[d.n] || [];
  const sec = el("section", "lessons");
  sec.innerHTML = '<h2>Erst verstehen <span class="cnt">Thema antippen zum Öffnen. Damit brauchst du kein Video.</span></h2>';
  const box = el("div", "lesson-list");
  list.forEach((l, i) => {
    if (!lessonShown(l)) return;
    const det = el("details", "lesson"); det.id = "les" + d.n + "_" + i;
    det.innerHTML = '<summary><span></span><i aria-hidden="true"></i></summary><div class="lesson-body">' + l.h + '</div>';
    det.querySelector("summary span").textContent = l.t;
    box.appendChild(det);
  });
  sec.appendChild(box);
  return sec;
}
function openLesson(d, i) {
  const det = document.getElementById("les" + d.n + "_" + i) as HTMLDetailsElement | null; if (!det) return;
  det.open = true;
  det.scrollIntoView({ block: "start", behavior: reduceMotion() ? "auto" : "smooth" });
  det.classList.remove("flash"); void det.offsetWidth; det.classList.add("flash");
  setTimeout(() => det.classList.remove("flash"), 2600);
}
function reviewDone(d, st?: SubjectProgress) { const r = REVIEW[d.n]; st = st || mine(); return !!r && !!st.r && r.q.every((_, i) => st.r[d.n + "." + i]); }
function viewReview(d) {
  const r = REVIEW[d.n];
  const sec = el("section", "card rev"); sec.id = "rev" + d.n;
  sec.innerHTML = '<h2>Kurze Wiederholung <span class="cnt">etwa 2 Minuten</span></h2><p class="rev-sub">Sitzen die drei Fragen ohne Hilfe, kannst du weitermachen.</p><ul class="rev-pts">' + r.points.map(x => "<li>" + x + "</li>").join("") + '</ul>';
  const list = el("div", "rev-qs"); sec.appendChild(list);
  const status = el("div", "rev-status"); status.setAttribute("aria-live", "polite"); sec.appendChild(status);
  const update = () => {
    const ok = r.q.filter((_, i) => mine().r[d.n + "." + i]).length, done = ok === r.q.length;
    sec.classList.toggle("done", done);
    const next = d.n < DAYS.length ? '<button type="button" class="cta" data-go="tag' + (d.n + 1) + '">Weiter mit ' + W() + ' ' + (d.n + 1) + '</button>' : '<button type="button" class="cta" data-go="klausur">Zur Probeklausur</button>';
    status.innerHTML = done ? '<span><b>Alles sitzt.</b> Du kannst weitermachen.</span><div class="row">' + next + '<button type="button" class="btn ghost" data-rev-reset>Nochmal</button></div>' : '<span>' + ok + ' von ' + r.q.length + ' richtig.' + (ok ? " Mach die offenen Fragen noch fertig." : " Beantworte alle drei.") + '</span>';
    const b = document.getElementById("revJump" + d.n); if (b) { b.textContent = done ? "Wiederholung geschafft ✓" : "Zur Wiederholung"; b.classList.toggle("ok", done); }
  };
  const seed = str => { let h = 2166136261; for (const ch of str) { h ^= ch.charCodeAt(0); h = Math.imul(h, 16777619); } return h >>> 0; };
  const render = () => {
    list.innerHTML = "";
    r.q.forEach((q, i) => {
      const k = d.n + "." + i, c = el("div", "rev-q" + (mine().r[k] ? " ok" : ""));
      c.dataset.rev = k; c.innerHTML = '<div class="rev-t"><span class="n">' + (i + 1) + '</span><div class="qt">' + q.q + '</div></div>';
      const tip = tipControl(REVIEW_TIPS[k]); c.querySelector(".rev-t").appendChild(tip.btn); c.appendChild(tip.box);
      const fb = el("div", "fb"); fb.hidden = true;
      const win = () => { mine().r[k] = true; c.classList.add("ok"); fb.hidden = false; fb.className = "fb good"; fb.innerHTML = "<b>Richtig.</b> " + q.s; save(); update(); };
      if (q.t === "num") {
        const a = el("div", "ans"), inp = el("input"); inp.type = "text"; inp.inputMode = "decimal"; inp.autocomplete = "off"; inp.placeholder = "Ergebnis"; inp.id = "rq" + d.n + "_" + i;
        const btn = el("button", "cta", "Prüfen"); btn.type = "button"; a.appendChild(inp); if (q.u) a.appendChild(el("span", "unit", q.u)); a.appendChild(btn);
        const check = () => { const v = parseNum(inp.value); fb.hidden = false; if (isNaN(v)) { fb.className = "fb info"; fb.textContent = "Gib eine Zahl ein."; return; } if (Math.abs(v - q.a) <= Math.abs(q.a) * 0.02) win(); else { fb.className = "fb bad"; fb.innerHTML = "Noch nicht. Rechenweg: " + q.s; } };
        btn.addEventListener("click", check); inp.addEventListener("keydown", ev => { if (ev.key === "Enter") check(); });
        c.appendChild(a);
      } else {
        const o = el("div", "opts");
        q.o.map((_, j) => j).sort((x, y) => seed(k + "|" + x) - seed(k + "|" + y)).forEach(j => {
          const b = el("button", "opt", q.o[j]); b.type = "button"; b.dataset.j = String(j);
          b.addEventListener("click", () => { if (j === q.a) { b.classList.add("right"); win(); } else { b.classList.add("wrong"); fb.hidden = false; fb.className = "fb bad"; fb.textContent = "Nicht ganz. Versuch es nochmal."; } });
          o.appendChild(b);
        });
        c.appendChild(o);
      }
      c.appendChild(fb);
      if (mine().r[k]) { fb.hidden = false; fb.className = "fb good"; fb.innerHTML = "<b>Richtig.</b> " + q.s; }
      list.appendChild(c);
    });
    update();
  };
  sec.addEventListener("click", ev => { if ((ev.target as Element).closest("[data-rev-reset]")) { r.q.forEach((_, i) => { delete mine().r[d.n + "." + i]; }); save(); render(); } });
  render();
  return sec;
}
function exGroups(d) {
  if (d._groups && d._mode === modeOf()) return d._groups;
  d._mode = modeOf();
  const order = (d.groups || []).slice();
  d.ex.forEach(e => { if (!exShown(e)) return; const g = e.g || ""; if (!order.includes(g)) order.push(g); });
  const groups = order.map(name => ({ name, items: [] }));
  d.ex.forEach((e, i) => { if (exShown(e)) groups[order.indexOf(e.g || "")].items.push(i); });
  d._groups = groups.filter(g => g.items.length);
  d._no = {}; let c = 0; d._groups.forEach(g => g.items.forEach(i => { d._no[i] = ++c; }));
  return d._groups;
}
function exNo(d, i) { exGroups(d); return d.n + "." + d._no[i]; }
function refreshExCounts() {
  document.querySelectorAll<HTMLElement>("[data-gc]").forEach(node => {
    const [n, gi] = node.dataset.gc.split("|"); const d = DAYS[+n - 1]; const g = exGroups(d)[+gi]; if (!g) return;
    const ok = g.items.filter(i => mine().x[d.n + "." + i] === "ok").length;
    node.textContent = ok + "/" + g.items.length; node.classList.toggle("full", ok === g.items.length);
  });
}
function exCard(d, e, i) {
  const k = d.n + "." + i, c = el("div", "ex" + (mine().x[k] === "ok" ? " ok" : "")); c.dataset.pk = "x:" + k; c.id = "ex" + d.n + "_" + i;
  const plainQ = e.q.replace(/<[^>]+>/g, "");
  c.innerHTML = '<div class="q"><span class="n">' + exNo(d, i) + '</span><div class="qt">' + e.q + '</div></div>';
  const tip = tipControl(TIPS[k]); c.querySelector(".q").appendChild(tip.btn); c.appendChild(tip.box);
  const fb = el("div", "fb"); fb.hidden = true;
  const sol = el("div", "sol"); sol.hidden = true; sol.innerHTML = "<b>Lösung:</b> " + e.s;
  const tools = el("div", "row");
  const showBtn = el("button", "btn ghost", "Lösung zeigen"); showBtn.type = "button";
  const aiBtn = el("button", "btn ghost", "KI fragen"); aiBtn.type = "button";
  aiBtn.addEventListener("click", () => openAI("Ich hänge bei dieser Aufgabe (" + W() + " " + d.n + ", " + d.title + (e.g ? ", Thema " + e.g : "") + "): " + plainQ + " Gib mir zuerst nur einen Tipp, nicht die ganze Lösung."));
  showBtn.addEventListener("click", () => { sol.hidden = false; if (mine().x[k] !== "ok") { mine().x[k] = "shown"; save(); } });
  const mark = (ok) => { if (ok) { mine().x[k] = "ok"; c.classList.add("ok"); } save(); };

  if (e.t === "num") {
    const a = el("div", "ans");
    const inp = el("input"); inp.type = "text"; inp.id = "x" + d.n + "_" + i; inp.inputMode = "decimal"; inp.placeholder = "Ergebnis"; inp.autocomplete = "off";
    const btn = el("button", "cta", "Prüfen"); btn.type = "button";
    a.appendChild(inp); if (e.u) a.appendChild(el("span", "unit", e.u)); a.appendChild(btn);
    let tries = 0;
    const check = () => {
      const val = parseNum(inp.value); fb.hidden = false;
      if (isNaN(val)) { fb.className = "fb info"; fb.textContent = "Gib eine Zahl ein, z. B. 0,45 oder 2,2e-5."; return; }
      const ok = Math.abs(val - e.a) <= Math.max(Math.abs(e.a) * 0.02, 1e-12);
      tries++;
      if (ok) { fb.className = "fb good"; fb.innerHTML = "Richtig. " + (sol.hidden ? "" : ""); sol.hidden = false; mark(true); }
      else { fb.className = "fb bad"; fb.textContent = tries >= 2 ? "Noch nicht. Schau dir die Lösung an und rechne danach selbst nochmal." : "Noch nicht. Prüf die Einheiten und ob der Taschenrechner auf RAD steht."; if (tries >= 2) sol.hidden = false; }
    };
    btn.addEventListener("click", check); inp.addEventListener("keydown", ev => { if (ev.key === "Enter") check(); });
    c.appendChild(a);
  } else if (e.t === "mc") {
    const o = el("div", "opts");
    const seed = str => { let h = 2166136261; for (const ch of str) { h ^= ch.charCodeAt(0); h = Math.imul(h, 16777619); } return h >>> 0; };
    const order = e.o.map((_, j) => j).sort((x, y) => seed(k + "|" + x) - seed(k + "|" + y));
    order.forEach(j => { const t = e.o[j]; const b = el("button", "opt", t); b.type = "button"; b.dataset.j = String(j); b.addEventListener("click", () => {
      fb.hidden = false;
      if (j === e.a) { b.classList.add("right"); fb.className = "fb good"; fb.textContent = "Richtig."; sol.hidden = false; mark(true); }
      else { b.classList.add("wrong"); fb.className = "fb bad"; fb.textContent = "Nicht ganz. Versuch es nochmal."; }
    }); o.appendChild(b); });
    c.appendChild(o);
  } else if (e.t === "rev") {
    const r = el("div", "row");
    const done = el("label", "row"); done.style.gap = "8px"; done.style.cursor = "pointer";
    done.innerHTML = '<input type="checkbox" class="ck" id="x' + d.n + "_" + i + '"' + (mine().x[k] === "ok" ? " checked" : "") + '><span>Hab ich ohne Hilfe geschafft</span>';
    done.querySelector("input").addEventListener("change", ev => { if ((ev.target as HTMLInputElement).checked) mark(true); else { mine().x[k] = "shown"; c.classList.remove("ok"); save(); } });
    r.appendChild(done); c.appendChild(r);
  }
  if (mine().x[k] === "ok") { const b = el("span", "badge-ok", "✓ gelöst"); c.querySelector(".q").appendChild(b); b.style.marginLeft = "auto"; }
  tools.appendChild(showBtn); tools.appendChild(aiBtn);
  c.appendChild(fb); c.appendChild(sol); c.appendChild(tools);
  return c;
}

function viewExam() {
  const v = el("div", "view"); v.id = "v-klausur";
  const inf = SUBJ !== "phys", mins = inf ? MT().examMins : 90;
  v.innerHTML = '<div class="dayhead"><span class="eyebrow">' + (inf ? MT().examEyebrow + " · " + mins + " Minuten · " + examMax() + " Punkte" : "Montag, 02.11. · 90 Minuten · 70 Punkte") + '</span><h1>Probeklausur</h1><p class="lede">' + (inf ? MT().examLede : "Nur Taschenrechner, kein Skript, kein Handy. g = 9,81 m/s². Erst nach dem Timer die Lösungen aufklappen und Punkte eintragen.") + '</p></div>' +
    '<div class="card row" style="justify-content:space-between"><div class="stack" style="gap:2px"><span class="eyebrow">Timer</span><span class="timer" id="tmr">' + mins + ':00</span></div><div class="row"><button class="cta" id="tStart" type="button">Start</button><button class="btn" id="tReset" type="button">Zurücksetzen</button></div><div class="stack" style="gap:2px"><span class="eyebrow">Deine Punkte</span><span class="score" id="examTotal">0 / ' + examMax() + '</span><span id="examMsg" style="color:var(--muted);font-size:14px;max-width:32ch"></span></div></div>';
  EXAM.forEach(t => {
    const c = el("section", "card task");
    c.innerHTML = '<h3><span>' + t.n + '. ' + t.title + '</span><span class="pts"><label for="p' + t.n + '">Punkte</label><input type="text" inputmode="decimal" id="p' + t.n + '" value="' + (mine().p[t.n] != null ? mine().p[t.n] : "") + '"> / ' + t.p + '</span></h3><p>' + t.q + '</p>';
    const sol = el("div", "sol"); sol.hidden = true; sol.innerHTML = "<b>Lösung</b><br>" + t.s;
    const tip = tipControl(EXAM_TIPS[t.n]); c.querySelector("h3").appendChild(tip.btn); c.querySelector("h3").after(tip.box);
    const r = el("div", "row"); const b = el("button", "btn", "Lösung zeigen"); b.type = "button"; b.addEventListener("click", () => { sol.hidden = !sol.hidden; b.textContent = sol.hidden ? "Lösung zeigen" : "Lösung ausblenden"; });
    const ai = el("button", "btn ghost", "KI fragen"); ai.type = "button"; ai.addEventListener("click", () => openAI("Probeklausur Aufgabe " + t.n + " (" + t.title + "): " + t.q.replace(/<[^>]+>/g, " ") + " Erklär mir den Lösungsweg Schritt für Schritt."));
    r.appendChild(b); r.appendChild(ai); c.appendChild(r); c.appendChild(sol);
    c.querySelector("input").addEventListener("input", ev => { const val = (ev.target as HTMLInputElement).value.trim(); if (val === "") delete mine().p[t.n]; else mine().p[t.n] = String(parseNum(val) || 0); save(); });
    v.appendChild(c);
  });
  v.appendChild(el("p", "", '<span style="color:var(--muted)">Mindestens ' + examGoal() + ' von ' + examMax() + ' Punkten (90 %) = bereit für 15 Punkte.</span>'));
  let left = mins * 60, iv = null;
  const show = () => { const m = Math.floor(left / 60), s = left % 60; v.querySelector("#tmr").textContent = String(m).padStart(2, "0") + ":" + String(s).padStart(2, "0"); };
  v.querySelector("#tStart").addEventListener("click", ev => { if (iv) { clearInterval(iv); iv = null; (ev.target as HTMLElement).textContent = "Weiter"; } else { iv = setInterval(() => { left = Math.max(0, left - 1); show(); if (!left) { clearInterval(iv); iv = null; } }, 1000); (ev.target as HTMLElement).textContent = "Pause"; } });
  v.querySelector("#tReset").addEventListener("click", () => { clearInterval(iv); iv = null; left = mins * 60; show(); v.querySelector("#tStart").textContent = "Start"; });
  return v;
}

function viewFormulas() {
  if (SUBJ !== "phys") return viewFormulasCourse();
  const v = el("div", "view"); v.id = "v-formeln";
  v.innerHTML = '<div class="dayhead"><span class="eyebrow">Schreibweise wie in eurem Formelbuch</span><h1>Formeln</h1><p class="lede">Gleiche Buchstaben wie im Formelbuch, damit es in der Klausur keine Verwechslung gibt. Mit „Formeln abdecken“ werden die Formeln unscharf: erst selbst aufsagen, dann antippen zum Prüfen.</p></div><div class="row"><button class="cta" id="coverBtn" type="button">Formeln abdecken</button></div>';
  const g = el("div", "fgrid");
  FORMULAS.forEach(([t, rows]) => { const c = el("div", "card"); c.innerHTML = "<h3>" + t + '</h3><table class="ftable">' + rows.map(r => "<tr><td>" + r[0] + "</td><td>" + r[1] + "</td></tr>").join("") + "</table>"; g.appendChild(c); });
  const sy = el("div", "card"); sy.innerHTML = '<h3>Welcher Buchstabe ist was?</h3><table class="ftable sym">' + SYMBOLS.map(r => '<tr><td>' + r[0] + '</td><td>' + r[1] + '</td></tr>').join("") + '</table>'; g.insertBefore(sy, g.firstChild);
  const an = el("div", "card"); an.innerHTML = '<h3>Analogie Federpendel ↔ Schwingkreis</h3><table class="ftable">' + ANALOG.map(r => "<tr><td>" + r[0] + "</td><td>" + r[1] + "</td></tr>").join("") + "</table>"; g.appendChild(an);
  v.appendChild(g);
  v.appendChild(el("div", "note warn", "<b>Die 8 häufigsten Punktkiller</b><ul>" + KILLERS.map(k => "<li>" + k + "</li>").join("") + "</ul>"));
  v.querySelector("#coverBtn").addEventListener("click", ev => { const on = document.body.classList.toggle("cover"); (ev.target as HTMLElement).textContent = on ? "Formeln zeigen" : "Formeln abdecken"; v.querySelectorAll(".peek").forEach(x => x.classList.remove("peek")); });
  v.addEventListener("click", ev => { const td = (ev.target as Element).closest(".ftable td:last-child"); if (td && document.body.classList.contains("cover")) td.classList.toggle("peek"); });
  return v;
}

function viewErrors() {
  const v: View = el("div", "view"); v.id = "v-fehler";
  v.innerHTML = '<div class="dayhead"><span class="eyebrow">Vor der Klausur liest du nur noch das hier und die Formeln</span><h1>Fehlerheft</h1><p class="lede">Jeder Fehler mit einem Satz, z. B. ' + (SUBJ !== "phys" ? MT().errExample : "„Ich habe cm nicht in m umgerechnet“") + '. Wird gespeichert.</p></div>' +
    '<form class="fe-add" id="feForm"><input id="feIn" type="text" placeholder="Was ist schiefgegangen?" autocomplete="off"><button class="cta" type="submit">Eintragen</button></form><ul class="fe-list" id="feList"></ul>';
  const list = v.querySelector("#feList");
  const render = () => { list.innerHTML = ""; if (!mine().f.length) { list.appendChild(el("li", "", '<span class="d">–</span><span style="color:var(--muted)">Noch keine Einträge. Der erste kommt nach dem Selbsttest an ' + W() + ' 1.</span><span></span>')); return; }
    mine().f.slice().reverse().forEach((f, ri) => { const idx = mine().f.length - 1 - ri; const li = el("li"); li.appendChild(el("span", "d", f.d)); const t = el("span"); t.textContent = f.t; li.appendChild(t); const b = el("button", "", "Löschen"); b.type = "button"; b.addEventListener("click", () => { mine().f.splice(idx, 1); save(); render(); }); li.appendChild(b); list.appendChild(li); }); };
  v.querySelector("#feForm").addEventListener("submit", ev => { ev.preventDefault(); const i = v.querySelector<HTMLInputElement>("#feIn"); const t = i.value.trim(); if (!t) return; const now = new Date(); mine().f.push({ t, d: String(now.getDate()).padStart(2, "0") + "." + String(now.getMonth() + 1).padStart(2, "0") + "." }); i.value = ""; save(); render(); });
  v._render = render; render();
  const op = other();
  if (op) {
    const sec = el("section", "card"); sec.id = "partnerFe";
    sec.innerHTML = '<h2>Fehlerheft von ' + op + ' <span class="cnt">zum Mitlernen, nur lesen</span></h2><ul class="fe-list pfe"></ul>';
    v.appendChild(sec);
    const pl = sec.querySelector("ul");
    v._renderPartner = () => {
      pl.innerHTML = ""; const ps = partner[op] && sub(partner[op]);
      if (!ps || !ps.f.length) { pl.appendChild(el("li", "", '<span class="d">–</span><span style="color:var(--muted)">' + op + ' hat noch nichts eingetragen.</span><span></span>')); return; }
      ps.f.slice().reverse().forEach(f => { const li = el("li"); li.appendChild(el("span", "d", f.d)); const t = el("span"); t.textContent = f.t; li.appendChild(t); li.appendChild(el("span", "")); pl.appendChild(li); });
    };
    v._renderPartner();
  }
  return v;
}

function viewRules() {
  if (SUBJ !== "phys") return viewRulesCourse();
  const v = el("div", "view"); v.id = "v-regeln";
  v.innerHTML = '<div class="dayhead"><span class="eyebrow">Für euch zwei</span><h1>Spielregeln</h1></div>' +
  '<section class="card"><ul class="stack" style="padding-left:20px;margin:0">' +
  '<li><b>Handy weg</b> (anderer Raum). 3 h = 3 × 50 min + 2 × 10 min Pause + Puffer. Zeiten im Plan sind Richtwerte: Ist etwas schneller klar, geht es weiter, nicht künstlich üben.</li>' +
  '<li><b>Erklär-Regel:</b> Nach jedem Block erklärt einer dem anderen das Thema in 2 Minuten ohne Zettel. Der andere fragt „warum?“, bis einer hängt. Wo ihr hängt, ist eure Lücke. Abwechseln.</li>' +
  '<li><b>Aufgaben erst selbst</b>, dann Lösung. Lösung angucken und „ah ja, klar“ denken zählt nicht. Die Aufgabe am nächsten Tag nochmal ohne Lösung.</li>' +
  '<li><b>Fehlerheft:</b> Jeder Fehler mit einem Satz. Vor der Klausur liest du nur noch das Fehlerheft und das Formelblatt.</li>' +
  '<li><b>Taschenrechner:</b> Für alles mit sin/cos(ωt) muss er auf <b>RAD</b> stehen. Das kostet sonst die meisten Punkte.</li></ul></section>' +
  '<div class="note tip"><b>Lehrer beeindrucken</b>Nicht nur richtige Zahlen, sondern sauber aufschreiben: Gegeben – Gesucht – Ansatz (Formel) – umstellen – einsetzen mit Einheiten – Ergebnis mit Einheit und Antwortsatz. Bei Herleitungen jeden Schritt mit einem Wort begründen („Newton“, „Hooke“, „a = s̈“). Genau das trennt 12 von 15 Punkten.</div>' +
  '<section class="card stack"><h2>In der Klausur</h2><ul style="padding-left:20px;margin:0" class="stack">' +
  '<li>Erst alles einmal lesen, mit der leichtesten Aufgabe anfangen.</li><li>Taschenrechner auf RAD prüfen. Alle Größen sofort in SI umrechnen und hinschreiben.</li><li>Gegeben / Gesucht / Formel / Umstellen / Einsetzen mit Einheit / Antwortsatz.</li><li>Bei Herleitungen jeden Schritt mit einem Wort begründen.</li><li>Ergebnis-Check: Ist das realistisch? Ein Pendel mit T = 3000 s ist es nicht.</li><li>Hängst du: Meta-Rezept (Tag 7) oder Energiesatz probieren. Teilpunkte gibt es fürs Hinschreiben des Ansatzes.</li></ul></section>' +
  '<div class="note ok"><b>Wochenenden und die Tage vor der Klausur</b>Die Wochenenden (24./25.10. und 31.10./01.11.) sind frei. Sonntag, 01.11.: höchstens 30 Minuten Formelblatt und Fehlerheft, nichts Neues. Montag, 02.11.: Probeklausur. Dienstag, 03.11.: Klausur. Früh schlafen.</div>' +
  '<p style="color:var(--muted);font-size:14px">Grundlage: OneNote-Skript „Kapitel 13 Schwingungen“ (13.1 Beschreibung, 13.2 Drehbewegung, 13.3 DGL, 13.4.1–13.4.4 Beispiele, 13.5 Energie, 13.6 Erzwungene Schwingung) und die Aufgabenseiten im Abschnitt.</p>';
  return v;
}

function viewStartCourse() {
  const m = MT();
  const v = el("div", "view"); v.id = "v-start";
  const mode = modeOf(), next = DAYS.find(d => dayStats(d).pct < 100);
  const pick = mine().mode;
  v.innerHTML =
  '<div class="card hero">' +
    '<div class="eyebrow">' + m.eyebrow + '</div>' +
    '<h1 style="margin-top:8px">' + (who ? who + ", auf " : "Auf ") + (mode === "gut" ? '<em>eine gute Note</em>' : '<em>15 Punkte</em>') + ' ' + m.topic + '</h1>' +
    '<p class="sub">' + m.intro + '</p>' +
    '<canvas id="scope" aria-hidden="true"></canvas>' +
    '<div class="stats">' +
      '<div class="stat"><span class="v">' + DAYS.length + '</span><span class="l">' + m.unitsLabel + '</span></div>' +
      '<div class="stat"><span class="v" id="stPct">0%</span><span class="l">Gesamtfortschritt</span></div>' +
      '<div class="stat"><span class="v" id="stEx">0/0</span><span class="l">Übungen richtig</span></div>' +
      '<div class="stat"><span class="v" id="stExam">–</span><span class="l">Probeklausur</span></div>' +
    '</div>' +
    '<div class="row" style="margin-top:16px"><button type="button" class="cta" data-go="' + (next ? "tag" + next.n : "klausur") + '">' + (next ? (next.n === 1 && !dayStats(next).got ? "Mit " + m.word + " 1 starten" : "Weiter mit " + m.word + " " + next.n) : "Zur Probeklausur") + '</button><span style="color:var(--muted)">' + (next ? "Als Nächstes: <b>" + next.title + "</b>." : "Alles ist geschafft.") + '</span></div>' +
  '</div>' +
  '<section class="card"><h2>Dein Ziel <span class="cnt">' + (pick ? "jederzeit änderbar" : "such dir eins aus") + '</span></h2><div class="goal-pick">' +
    '<button type="button" class="goal-opt' + (mode === "15" ? " on" : "") + '" data-mode="15" aria-pressed="' + (mode === "15") + '"><b>15 Punkte</b><small>' + m.goal15 + '</small></button>' +
    '<button type="button" class="goal-opt' + (mode === "gut" ? " on" : "") + '" data-mode="gut" aria-pressed="' + (mode === "gut") + '"><b>Gute Note</b><small>' + m.goalGut + '</small></button>' +
  '</div></section>' +
  '<section class="card" id="duo"><h2>Alle im Vergleich <span class="cnt" id="ppCnt"></span></h2><div id="ppBody"></div></section>' +
  '<section class="card"><h2>Fortschritt pro ' + m.word + ' <span class="cnt">Blöcke, Checklisten und Übungen · <span id="stCk"></span> Checkpunkte</span></h2>' +
    '<div class="chart-wrap"><svg id="chart" viewBox="0 0 640 230" role="img" aria-label="Fortschritt pro Lerntag in Prozent"></svg></div>' +
    '<div class="legend" id="legend"></div>' +
  '</section>' +
  '<section class="card stack"><h2>So funktioniert es</h2><p>' + m.how + '</p>' +
  '<p><span class="tag t-skript">Skript</span>euer Unterrichtsstoff &nbsp; <span class="tag t-ueben">Üben</span>Aufgaben &nbsp; <span class="tag t-test">Test</span>Selbsttest ohne Hilfe</p></section>';
  v.querySelectorAll<HTMLButtonElement>(".goal-opt").forEach(b => b.addEventListener("click", () => setMode(b.dataset.mode)));
  return v;
}

function viewFormulasCourse() {
  const m = MT();
  const v = el("div", "view"); v.id = "v-formeln";
  v.innerHTML = '<div class="dayhead"><span class="eyebrow">' + m.formulasEyebrow + '</span><h1>' + m.formulasTitle + '</h1><p class="lede">' + m.formulasLede + ' Mit „Formeln abdecken“ werden die Formeln unscharf: erst selbst aufsagen, dann antippen zum Prüfen.</p></div><div class="row"><button class="cta" id="coverBtn" type="button">Formeln abdecken</button></div>';
  const g = el("div", "fgrid");
  const sy = el("div", "card"); sy.innerHTML = '<h3>Welches Zeichen ist was?</h3><table class="ftable sym">' + m.symbols.map(r => '<tr><td>' + r[0] + '</td><td>' + r[1] + '</td></tr>').join("") + '</table>'; g.appendChild(sy);
  m.formulas.forEach(([t, rows]) => { const c = el("div", "card"); c.innerHTML = "<h3>" + t + '</h3><table class="ftable">' + rows.map(r => "<tr><td>" + r[0] + "</td><td>" + r[1] + "</td></tr>").join("") + "</table>"; g.appendChild(c); });
  v.appendChild(g);
  v.appendChild(el("div", "note warn", "<b>Die " + m.killers.length + " häufigsten Punktkiller</b><ul>" + m.killers.map(k => "<li>" + k + "</li>").join("") + "</ul>"));
  v.querySelector("#coverBtn").addEventListener("click", ev => { const on = document.body.classList.toggle("cover"); (ev.target as HTMLElement).textContent = on ? "Formeln zeigen" : "Formeln abdecken"; v.querySelectorAll(".peek").forEach(x => x.classList.remove("peek")); });
  v.addEventListener("click", ev => { const td = (ev.target as Element).closest(".ftable td:last-child"); if (td && document.body.classList.contains("cover")) td.classList.toggle("peek"); });
  return v;
}

function viewRulesCourse() {
  const v = el("div", "view"); v.id = "v-regeln";
  v.innerHTML = MT().rulesHtml;
  return v;
}

let cur = null;
const VKEY = "schwingungen15.view";
const reduceMotion = () => matchMedia("(prefers-reduced-motion: reduce)").matches;
function initialView() {
  let id = "";
  try { id = (location.hash || "").slice(1); } catch (e) {}
  if (!NAV.some(n => n[0] === id)) { try { id = localStorage.getItem(VKEY) || ""; } catch (e) {} }
  return NAV.some(n => n[0] === id) ? id : "start";
}
function go(id) { if (NAV.some(n => n[0] === id)) route(id); }
document.addEventListener("click", ev => {
  const t = (ev.target as Element).closest<HTMLElement>("[data-go]");
  if (!t) return;
  ev.preventDefault();
  go(t.dataset.go);
});
document.addEventListener("keydown", ev => {
  if ((ev.key === "Enter" || ev.key === " ") && (ev.target as HTMLElement).matches?.('[data-go][role="button"]')) { ev.preventDefault(); go((ev.target as HTMLElement).dataset.go); }
});
function route(target) {
  let id = target || cur || "start";
  if (!NAV.some(n => n[0] === id)) id = "start";
  const changed = cur !== null && cur !== id;
  try { localStorage.setItem(VKEY, id); } catch (e) {}
  if (!views[id]) {
    let v;
    try {
      if (id === "start") v = viewStart();
      else if (id.startsWith("tag")) v = viewDay(DAYS[+id.slice(3) - 1]);
      else if (id === "klausur") v = viewExam();
      else if (id === "formeln") v = viewFormulas();
      else if (id === "fehler") v = viewErrors();
      else v = viewRules();
    } catch (e) {
      v = el("div", "view"); v.id = "v-" + id;
      v.appendChild(el("div", "note warn", "<b>Diese Seite konnte nicht geladen werden</b>" + String(e && e.message || e).replace(/</g, "&lt;")));
      toast("Fehler beim Öffnen: " + (e && e.message || e), true);
    }
    views[id] = v; main.appendChild(v);
  }
  Object.entries(views).forEach(([k, v]) => v.hidden = k !== id);
  document.querySelectorAll<HTMLElement>(".rail .nav, .strip button").forEach(a => { const on = a.dataset.id === id; a.classList.toggle("cur", on); if (on) a.setAttribute("aria-current", "page"); else a.removeAttribute("aria-current"); });
  const strip = document.getElementById("strip"), sc = strip.querySelector<HTMLElement>("button.cur");
  if (sc && strip.clientWidth) strip.scrollLeft = Math.max(0, sc.offsetLeft - strip.clientWidth / 2 + sc.offsetWidth / 2);
  if (changed) {
    try { window.scrollTo(0, 0); } catch (e) {}
    const v = views[id];
    try { if (v.animate) v.animate(reduceMotion() ? [{ opacity: 0 }, { opacity: 1 }] : [{ opacity: 0, transform: "translateY(8px)" }, { opacity: 1, transform: "none" }], { duration: reduceMotion() ? 160 : 340, easing: "cubic-bezier(0.22, 1, 0.36, 1)" }); } catch (e) {}
  }
  cur = id;
  const lab = NAV.find(n => n[0] === id);
  document.getElementById("aiCtx").textContent = id.startsWith("tag") ? lab[1] + ": " + DAYS[+id.slice(3) - 1].title : lab[1];
  if (id === "start") startScope(); else cancelAnimationFrame(scopeRAF);
  refreshProgress();
}
function rebuildAll() { const keep = cur; Object.values(views).forEach(v => v.remove()); for (const k in views) delete views[k]; cur = null; route(keep); }

let amp = 0, scopeRAF = 0;
function startScope() {
  const cv = document.getElementById("scope") as HTMLCanvasElement | null; if (!cv) return;
  cancelAnimationFrame(scopeRAF);
  const ctx = cv.getContext("2d"); const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  let shown = 0.06;
  const cs = getComputedStyle(document.documentElement);
  const col = { grid: cs.getPropertyValue("--grid"), trace: cs.getPropertyValue("--trace"), muted: cs.getPropertyValue("--muted"), mono: cs.getPropertyValue("--f-mono") };
  const frame = (t) => {
    const dpr = Math.min(window.devicePixelRatio || 1, 2), w = cv.clientWidth, h = cv.clientHeight;
    if (cv.width !== w * dpr) { cv.width = w * dpr; cv.height = h * dpr; }
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.clearRect(0, 0, w, h);
    ctx.strokeStyle = col.grid; ctx.lineWidth = 1;
    for (let x = 0; x < w; x += 40) { ctx.beginPath(); ctx.moveTo(x + .5, 0); ctx.lineTo(x + .5, h); ctx.stroke(); }
    for (let y = 0; y <= h; y += h / 4) { ctx.beginPath(); ctx.moveTo(0, y + .5); ctx.lineTo(w, y + .5); ctx.stroke(); }
    const target = Math.max(0.06, amp); shown += (target - shown) * 0.04;
    const A = shown * (h / 2 - 8), ph = reduce ? 0 : t / 900;
    ctx.strokeStyle = col.trace; ctx.lineWidth = 2.5; ctx.beginPath();
    for (let x = 0; x <= w; x += 2) { const y = h / 2 - A * Math.sin(x / w * Math.PI * 6 - ph); x ? ctx.lineTo(x, y) : ctx.moveTo(x, y); }
    ctx.stroke();
    ctx.fillStyle = col.muted; ctx.font = "11px " + col.mono;
    ctx.fillText((SUBJ !== "phys" ? "" : "s<sub>max</sub> = ") + Math.round(amp * 100) + " % erledigt", 8, 14);
    if (!cv.isConnected || views.start.hidden) return;
    if (!reduce || Math.abs(target - shown) > 0.002) scopeRAF = requestAnimationFrame(frame);
  };
  scopeRAF = requestAnimationFrame(frame);
}

const RULES = "Du bist ein geduldiger Physik-Nachhilfelehrer für einen Oberstufenschüler in Deutschland. Er schreibt am Dienstag, 03.11.2026, eine Klausur über Schwingungen (Kapitel 13) und will von 3 auf 15 Punkte. Seine Grundlagen sind schwach (Formeln umstellen, Einheiten, sin/cos, Ableiten).\n\n" +
 "Regeln für deine Antworten:\n- Antworte auf Deutsch, in Du-Form, freundlich und direkt.\n- Erkläre einfach und Schritt für Schritt, mit konkreten Zahlen, wenn es hilft.\n- Schreibe Formeln als normalen Text mit Unicode (ω, sₘₐₓ, √, ², s̈, π, φ₀, δ), niemals LaTeX und keine Dollarzeichen.\n- Halte dich kurz (meist unter 180 Wörtern), außer er bittet um mehr.\n- Bittet er um einen Tipp, gib nur den nächsten Schritt, nicht die ganze Lösung.\n- Benutze genau die Schreibweise aus seinem Formelbuch: Auslenkung (Elongation) s(t), Amplitude sₘₐₓ, Kreisfrequenz ω, Nullphasenwinkel φ₀, Federhärte bzw. Richtgröße D, Federspannkraft F_S = D·s, Kraftgesetz F(s) = −D·s, Gewichtskraft F_G = m·g, s(t) = sₘₐₓ·sin(ω·t + φ₀), v(t) = sₘₐₓ·ω·cos(ω·t + φ₀), a(t) = −sₘₐₓ·ω²·sin(ω·t + φ₀), DGL s̈ + (D/m)·s = 0, gedämpft: Abklingkoeffizient δ, s(t) = sₘₐₓ·e^(−δ·t)·cos(ω_D·t), ω_D = √(ω² − δ²), f = 1/T = n/t, ω = 2π·f. Nie sₘₐₓ, sₘₐₓ oder y für die Auslenkung verwenden.\n- Achte immer auf SI-Einheiten und erinnere daran, den Taschenrechner auf RAD zu stellen, wenn sin/cos(ωt) vorkommt.\n- Wenn er dich abfragen will, stelle eine Frage nach der anderen und warte auf seine Antwort.\n\n" +
 "Klausurstoff laut Skript: 13.1 Begriffe (Ruhelage, T, f, Elongation, Amplitude; Schwingung braucht rücktreibende Kraft + Trägheit). 13.2 Schwingung als Projektion der Kreisbewegung: s(t) = sₘₐₓ·sin(ω·t), v = sₘₐₓ·ω·cos(ω·t), a = −sₘₐₓ·ω²·sin(ω·t). 13.3 DGL Federpendel s̈ + (D/m)s = 0 mit Lösung ω = √(D/m), T = 2π√(m/D). 13.4.1 senkrechtes Federpendel (Ruhelage um s₀ = mg/D verschoben, T gleich). 13.4.2 Fadenpendel mit Kleinwinkelnäherung sin φ ≈ φ, T = 2π√(l/g), Pendeluhr im Aufzug mit g_eff = g ± a. Das Flüssigkeitspendel (13.4.3) kommt in der Arbeit nicht dran, erkläre es nur, wenn ausdrücklich danach gefragt wird. 13.4.4 elektrischer Schwingkreis, 4 Phasen, Lenz, T = 2π√(LC), E = ½CU² = ½LI². 13.5 Energie: E = ½·D·sₘₐₓ² = ½·m·vₘₐₓ². 13.6 gedämpfte und erzwungene Schwingung, Resonanz. Aufgaben im Unterricht: Bungeespringer, Kettenschwingung, Pendeluhr im Aufzug, Dorn-Bader S. 274–283.";
const RULES_INF = "Du bist ein geduldiger Informatik-Nachhilfelehrer für einen Schüler im Technischen Gymnasium in Baden-Württemberg. Er lernt für das Abitur 2027, Thema Künstliche Intelligenz, Schwerpunkt neuronale Netze.\n\n" +
 "Regeln für deine Antworten:\n- Antworte auf Deutsch, in Du-Form, freundlich und direkt.\n- Erkläre einfach und Schritt für Schritt, mit konkreten Zahlen, wenn es hilft.\n- Schreibe Formeln als normalen Text mit Unicode (w₀, x₁, θ, ŷ, α, σ, e⁻ᶻ, Σ), niemals LaTeX und keine Dollarzeichen.\n- Halte dich kurz (meist unter 180 Wörtern), außer er bittet um mehr.\n- Bittet er um einen Tipp, gib nur den nächsten Schritt, nicht die ganze Lösung.\n- Benutze die Schreibweise aus dem Unterricht: Eingaben xᵢ, Gewichte wᵢ, Bias w₀ mit Eingang 1, Schwellwert θ (w₀ = −θ), Nettoinput z = w₀ + w₁x₁ + … + wₙxₙ, Heaviside H(z) = 1 für z ≥ 0 sonst 0, ReLU(z) = max(0, z), Sigmoid σ(z) = 1/(1 + e⁻ᶻ), Softmax e^(z_k)/Σ e^(zᵢ), Trenngerade y = −(w₁/w₂)x − w₀/w₂, Lernregel Δwᵢ = α·(y − ŷ)·xᵢ, Δw₀ = α·(y − ŷ), wᵢ := wᵢ + Δwᵢ, mehrschichtig a⁽¹⁾ = x, z⁽ˡ⁾ = W⁽ˡ⁻¹⁾a⁽ˡ⁻¹⁾ + b⁽ˡ⁻¹⁾, a⁽ˡ⁾ = g(z⁽ˡ⁾), ŷ = a⁽ᴸ⁾.\n- Pseudocode im Stil des Abiturs: OPERATION name(param: FKZ): GZ, :=, WENN … DANN … SONST … ENDE WENN, FÜR … ENDE FÜR, RÜCKGABE, Liste<FKZ>, exp(z). Auf Wunsch auch Python.\n- Wenn er dich abfragen will, stelle eine Frage nach der anderen und warte auf seine Antwort.\n\n" +
 "Stoff laut Unterricht: Formen des maschinellen Lernens (überwacht, unüberwacht, bestärkend; symbolisch, subsymbolisch, hybrid), KI ohne Lernen (Minimax), Perzeptron als UND und ODER, Entscheidungsregel mit Schwellwert, Bias, lineare Separierbarkeit, Trenngerade, XOR-Problem, Lernregel, mehrschichtige Netze mit ReLU, Sigmoid und Softmax, Pseudocode-Operationen vorhersage, berechneNettoinput, vorhersageReLU und softmaxAlle.";
const INF_META: CourseMeta = {
  brand: "Neuronale Netze",
  label: "Informatik",
  word: "Tag",
  unitsLabel: "Lerntage",
  eyebrow: "Informatik · Künstliche Intelligenz · Neuronale Netze",
  topic: "bei neuronalen Netzen.",
  intro: INF_DAYS.length + " Lerntage, aufgebaut auf eurem OneNote-Abschnitt KI → Neuronale Netze, von „Perzeptron Einführung“ bis „Ü2 Ähnliche Abiaufgabe“. Die Kurve unten wird größer, je mehr du erledigst.",
  goal15: "Alles, richtig gründlich: jede Erklärung, alle Übungen, Sonderfälle und Code. So wie bei Physik.",
  goalGut: "Nur das Wichtigste, das sicher drankommt. Weniger Übungen, kürzere Tage, trotzdem alle Grundaufgaben aus dem Abi.",
  how: "Jeder Tag beginnt mit „Erst verstehen“: kurze Erklärungen mit Beispielen, sodass du kein Video brauchst. Danach kommen Übungen, die du direkt hier lösen kannst, und am Ende eine Checkliste „Du kannst …“. Ein Haken zählt nur, wenn du es <b>ohne Hilfe</b> kannst. Zum Schluss schreibst du die Probeklausur. Ab 90 % bist du bereit.",
  navExam: "60 min, " + INF_EXAM.reduce((a, t) => a + t.p, 0) + " Punkte",
  examMins: 60,
  examEyebrow: "Wie im Abi",
  examLede: "Nur Taschenrechner, keine Unterlagen. Aufgebaut wie die Beispielaufgaben aus dem Unterricht, aber mit neuen Zahlen. Erst nach dem Timer die Lösungen aufklappen und Punkte eintragen.",
  beforeExam: "Vor dem Abi",
  formulasEyebrow: "Schreibweise wie im Unterricht",
  formulasTitle: "Formeln und Begriffe",
  formulasLede: "Alles, was du für Perzeptron, Trenngerade, Lernregel und mehrschichtige Netze brauchst.",
  formulasNav: "Formeln und Begriffe",
  symbols: INF_SYMBOLS,
  formulas: INF_FORMULAS,
  killers: INF_KILLERS,
  rulesHtml: '<div class="dayhead"><span class="eyebrow">Für euch zwei</span><h1>Spielregeln</h1></div>' +
  '<section class="card"><ul class="stack" style="padding-left:20px;margin:0">' +
  '<li><b>Handy weg.</b> Ein Lerntag dauert je nach Ziel 1,5 bis 2 Stunden. Ist etwas schneller klar, geht es weiter.</li>' +
  '<li><b>Erklär-Regel:</b> Nach jeder Erklärung erklärt einer dem anderen das Thema in 2 Minuten ohne Zettel. Wo ihr hängt, ist eure Lücke.</li>' +
  '<li><b>Rechnen auf Papier:</b> z, Trenngerade und Lernschritt immer mit Formel und Zwischenschritten aufschreiben. Im Abi gibt es dafür Teilpunkte.</li>' +
  '<li><b>Code auf Papier:</b> Pseudocode erst selbst schreiben, dann mit der Lösung vergleichen. Im Abi gibt es keinen Computer.</li>' +
  '<li><b>Fehlerheft:</b> Jeder Fehler mit einem Satz. Vor dem Abi liest du nur noch das Fehlerheft und die Formeln.</li></ul></section>' +
  '<div class="note tip"><b>Lehrer beeindrucken</b>Bei „Begründen Sie“ und „Nehmen Sie Stellung“ immer drei Teile: Aussage richtig oder falsch, Grund, Beispiel. Bei Rechnungen erst die allgemeine Formel, dann eingesetzt, dann Ergebnis.</div>' +
  '<section class="card stack"><h2>Was im Abi 2027 drankommt</h2><p>Laut Eingrenzung in eurem Notizbuch (Aufgabe 4, Künstliche Intelligenz, 20 BE):</p><ul style="padding-left:20px;margin:0" class="stack"><li>BPE 13.1: Die Suche nach Problemlösungen, Spiele (Minimax)</li><li>BPE 13.2: Formen des maschinellen Lernens, Entscheidungsbaumlernen, k-Means-Clustering, <b>Neuronale Netze</b></li></ul><p>Dieser Plan deckt die neuronalen Netze und die Formen des maschinellen Lernens ab. Entscheidungsbäume, k-Means und die Suche stehen in eigenen Abschnitten im OneNote.</p></section>' +
  '<p style="color:var(--muted);font-size:14px">Grundlage: OneNote „25 TG12_3 IT, INF-Notizbuch“, Abschnitt KI, Unterabschnitt Neuronale Netze: Perzeptron Einführung, Perzeptron mit Bias, Perzeptron: Lernregel, Ü1 Perzeptron (Entscheidungsregel), Perzeptron: mehrere Schichten, Ü1 Beispielaufgabe Abi, Ü2 Ähnliche Abiaufgabe.</p>',
  ai: RULES_INF,
  tutor: "neuronale Netze",
  sugs: ["Erklär mir das Perzeptron, als wäre ich in der 9. Klasse.", "Warum kann ein Perzeptron XOR nicht?", "Gib mir eine neue Aufgabe zur Trenngeraden mit Lösung zum Aufklappen.", "Frag mich die Aktivierungsfunktionen ab, eine Frage nach der anderen."],
  errExample: "„Bei der Trenngeraden das Minus vergessen“"
};
const META: Record<Course, CourseMeta> = { inf: INF_META, mat: MAT_META };
let sample = null, turns = [], ctl = null, busy = false;
let aiOffText = "Der KI-Tutor läuft über Claude und funktioniert, wenn du die Seite in Claude geöffnet hast (claude.ai oder die Claude-App). Dafür brauchst du keinen API-Schlüssel. Beim ersten Frage-Klick fragt Claude einmal, ob die Seite deine Claude-Nutzung verwenden darf.";
async function serverSample(input, opts) {
  opts = opts || {};
  const messages = typeof input === "string" ? [{ role: "user", content: input }] : input;
  let r;
  try { r = await apiFetch("api/ai", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ messages }), signal: opts.signal }); }
  catch (e) { throw { code: e && e.name === "AbortError" ? "cancelled" : "upstream_error", message: String(e) }; }
  if (!r.ok) { let j: { code?: string; error?: string } = {}; try { j = await r.json(); } catch (e) {} throw { code: j.code || (r.status === 429 ? "rate_limited" : "upstream_error"), message: j.error || "" }; }
  const reader = r.body.getReader(), dec = new TextDecoder(); let text = "";
  try {
    for (;;) { const { done, value } = await reader.read(); if (done) break; const delta = dec.decode(value, { stream: true }); text += delta; if (opts.onText) opts.onText({ text, delta }); }
  } catch (e) { throw { code: e && e.name === "AbortError" ? "cancelled" : "upstream_error", message: String(e), text }; }
  if (!text.trim()) throw { code: "empty_completion", message: "" };
  return { text, truncated: false };
}
const drawer = document.getElementById("drawer"), msgs = document.getElementById("msgs"), input = document.getElementById("aiInput") as HTMLTextAreaElement;
function mdToHtml(s) {
  const esc = s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const lines = esc.split("\n"); let out = "", list = null;
  const inline = t => t.replace(/\*\*(.+?)\*\*/g, "<b>$1</b>").replace(/`([^`]+)`/g, "<code>$1</code>").replace(/(^|[^*])\*([^*\n]+)\*/g, "$1<i>$2</i>");
  lines.forEach(l => {
    const ul = l.match(/^\s*[-•*]\s+(.*)/), ol = l.match(/^\s*\d+[.)]\s+(.*)/);
    if (ul || ol) { const tag = ul ? "ul" : "ol"; if (list !== tag) { if (list) out += "</" + list + ">"; out += "<" + tag + ">"; list = tag; } out += "<li>" + inline((ul || ol)[1]) + "</li>"; return; }
    if (list) { out += "</" + list + ">"; list = null; }
    if (l.trim() === "") return;
    const h = l.match(/^#{1,4}\s+(.*)/); out += "<p>" + (h ? "<b>" + inline(h[1]) + "</b>" : inline(l)) + "</p>";
  });
  if (list) out += "</" + list + ">";
  return out;
}
function addMsg(role, html) { const m = el("div", "msg " + role); m.innerHTML = html; msgs.appendChild(m); msgs.scrollTop = msgs.scrollHeight; return m; }
function emptyState() {
  msgs.innerHTML = "";
  if (sample === null) { msgs.appendChild(el("div", "ai-off", aiOffText)); return; }
  addMsg("a", "<p>Hi" + (who ? " " + who : "") + "! Ich bin dein Tutor für " + (SUBJ !== "phys" ? MT().tutor : "Kapitel 13") + ". Frag mich alles, lass dir etwas einfacher erklären oder lass dich abfragen.</p>");
  const sg = el("div", "sugs");
  (SUBJ !== "phys" ? MT().sugs : ["Erklär mir die DGL vom Federpendel, als wäre ich in der 9. Klasse.", "Warum steht in F = −D·s ein Minus?", "Frag mich die Formeln von Tag 4 ab, eine Frage nach der anderen.", "Gib mir eine neue Übungsaufgabe zum Fadenpendel mit Lösung zum Aufklappen."]).forEach(t => { const b = el("button", "sug", t); b.type = "button"; b.addEventListener("click", () => send(t)); sg.appendChild(b); });
  msgs.appendChild(sg);
}
function openAI(prefill?: string) {
  drawer.classList.add("open"); drawer.setAttribute("aria-hidden", "false"); document.getElementById("fab").classList.add("away");
  syncPanels();
  if (!msgs.childElementCount) emptyState();
  if (prefill) send(prefill); else setTimeout(() => input.focus(), 50);
}
function isOpen() { return drawer.classList.contains("open"); }
function closeAI() { drawer.classList.remove("open"); drawer.setAttribute("aria-hidden", "true"); document.getElementById("fab").classList.remove("away"); if (ctl) ctl.abort(); syncPanels(); }
function syncPanels() {
  const ai = isOpen(), calc = typeof calcOpen === "function" && calcOpen();
  document.body.classList.toggle("both-open", ai && calc);
  const a = document.getElementById("aiCalcBtn"), c = document.getElementById("calcAiBtn");
  if (a) a.classList.toggle("on", calc);
  if (c) c.classList.toggle("on", ai);
}
const ERR = { busy: "Die KI ist gerade überlastet. Versuch es gleich nochmal.", not_granted: "Du hast die KI für diese Seite nicht erlaubt. Lade die Seite neu, um nochmal gefragt zu werden.", rate_limited: "Gerade zu viele Anfragen. Warte kurz und frag dann nochmal.", sampling_disabled: "Die KI ist für dein Konto gerade nicht verfügbar.", capability_disabled: "Die KI ist für diese Seite gerade abgeschaltet.", session_expired: "Deine Claude-Sitzung ist abgelaufen. Lade die Seite neu.", prompt_too_large: "Der Verlauf ist zu lang. Tipp auf „Neu“ und frag nochmal.", not_configured: "Die KI ist auf dem Server noch nicht eingerichtet.", empty_completion: "Die KI hat nichts geantwortet. Frag bitte nochmal anders." };
async function send(text) {
  text = (text || "").trim(); if (!text || busy) return;
  if (sample === null) { emptyState(); return; }
  const sg = msgs.querySelector(".sugs"); if (sg) sg.remove();
  addMsg("u", text.replace(/&/g, "&amp;").replace(/</g, "&lt;"));
  turns.push({ role: "user", content: text });
  if (turns.length > 16) turns = turns.slice(-16);
  while (turns.length && turns[0].role !== "user") turns.shift();
  const userBubble = msgs.lastElementChild;
  const bubble = addMsg("a", "<p style='color:var(--muted)'>Denkt nach …</p>");
  busy = true; document.getElementById("aiSend").textContent = "Stopp";
  const thisCtl = new AbortController(); ctl = thisCtl;
  let gotText = false, timedOut = false;
  const slowT = setTimeout(() => { if (!gotText) bubble.innerHTML = "<p style='color:var(--muted)'>Dauert gerade etwas länger, ich versuche es weiter …</p>"; }, 10000);
  const stopT = setTimeout(() => { if (!gotText) { timedOut = true; thisCtl.abort(); } }, 60000);
  const ctxLine = (who ? "Du sprichst mit " + who + ". " : "") + "Er schaut gerade auf: " + document.getElementById("aiCtx").textContent + ".";
  try {
    const { text: ans } = await sample([{ role: "user", content: (SUBJ !== "phys" ? MT().ai : RULES) + "\n\n" + ctxLine + "\n\nAb jetzt kommt das Gespräch." }].concat(turns), {
      cache: false, signal: thisCtl.signal, onText: ({ text }) => { gotText = true; bubble.innerHTML = mdToHtml(text); msgs.scrollTop = msgs.scrollHeight; }
    });
    bubble.innerHTML = mdToHtml(ans);
    turns.push({ role: "assistant", content: ans });
  } catch (e) {
    turns.pop();
    if (e && e.text) bubble.innerHTML = mdToHtml(e.text); else bubble.remove();
    if (timedOut || !e || e.code !== "cancelled") {
      const box = addMsg("err", "");
      box.textContent = timedOut ? ERR.busy : (ERR[e && e.code] || "Das hat nicht geklappt.");
      const again = el("button", "btn err-retry", "Nochmal senden"); again.type = "button";
      again.addEventListener("click", () => { if (busy) return; box.remove(); if (userBubble) userBubble.remove(); if (!(e && e.text)) bubble.remove(); send(text); });
      box.appendChild(again);
    }
  } finally { clearTimeout(slowT); clearTimeout(stopT); busy = false; if (ctl === thisCtl) ctl = null; document.getElementById("aiSend").textContent = "Senden"; }
}
document.getElementById("fab").addEventListener("click", () => openAI());
document.getElementById("aiClose").addEventListener("click", closeAI);
document.getElementById("aiClear").addEventListener("click", () => { if (ctl) ctl.abort(); turns = []; msgs.innerHTML = ""; emptyState(); });
document.getElementById("composer").addEventListener("submit", ev => { ev.preventDefault(); if (busy) { if (ctl) ctl.abort(); return; } const t = input.value; input.value = ""; input.style.height = ""; send(t); });
input.addEventListener("keydown", ev => { if (ev.key === "Enter" && !ev.shiftKey) { ev.preventDefault(); (document.getElementById("composer") as HTMLFormElement).requestSubmit(); } });
input.addEventListener("input", () => { input.style.height = "auto"; input.style.height = Math.min(input.scrollHeight, 140) + "px"; });
document.addEventListener("keydown", ev => { if (ev.key === "Escape" && isOpen()) closeAI(); });

const CALC_KEY = "schwingungen15.calc";
const calcPrefs = (() => { try { return Object.assign({ deg: false, hist: [], mode: "rechner", solver: "feder" }, JSON.parse(lsGet(CALC_KEY) || "{}")); } catch (e) { return { deg: false, hist: [], mode: "rechner", solver: "feder" }; } })();
const saveCalc = () => lsSet(CALC_KEY, JSON.stringify({ deg: calcPrefs.deg, hist: calcPrefs.hist.slice(-30), mode: calcPrefs.mode, solver: calcPrefs.solver }));
let calcAns = calcPrefs.hist.length ? calcPrefs.hist[calcPrefs.hist.length - 1].v : 0;

function calcTokens(src) {
  const out = []; let i = 0;
  const s = src.replace(/×|·/g, "*").replace(/÷|:/g, "/").replace(/−|–/g, "-").replace(/\s+/g, "");
  while (i < s.length) {
    const c = s[i];
    const num = s.slice(i).match(/^(\d+(?:[.,]\d*)?|[.,]\d+)/);
    if (num) { out.push({ t: "n", v: parseFloat(num[1].replace(",", ".")) }); i += num[1].length; continue; }
    const id = s.slice(i).match(/^(asin|acos|atan|sinh|sin|cos|tan|sqrt|ln|log|abs|Ans|pi|π|e|g)/);
    if (id) { out.push({ t: "id", v: id[1] }); i += id[1].length; continue; }
    if ("+-*/^()√²³!".includes(c)) { out.push({ t: "op", v: c }); i++; continue; }
    throw new Error("Unbekanntes Zeichen „" + c + "“");
  }
  return out;
}
const FUNCS = ["sin", "cos", "tan", "asin", "acos", "atan", "sqrt", "ln", "log", "abs"];
function calcEval(src) {
  const tk = calcTokens(src); let p = 0;
  const peek = () => tk[p], next = () => tk[p++];
  const isOp = (v) => peek() && peek().t === "op" && peek().v === v;
  const toRad = x => calcPrefs.deg ? x * Math.PI / 180 : x;
  const fromRad = x => calcPrefs.deg ? x * 180 / Math.PI : x;
  const startsPrimary = () => { const k = peek(); return k && (k.t === "n" || k.t === "id" || (k.t === "op" && (k.v === "(" || k.v === "√"))); };
  function expr() { let v = term(); while (isOp("+") || isOp("-")) { const o = next().v; const r = term(); v = o === "+" ? v + r : v - r; } return v; }
  function term() {
    let v = unary();
    for (;;) {
      if (isOp("*")) { next(); v *= unary(); }
      else if (isOp("/")) { next(); const r = unary(); v /= r; }
      else if (startsPrimary()) v *= power();
      else break;
    }
    return v;
  }
  function unary() { if (isOp("-")) { next(); return -unary(); } if (isOp("+")) { next(); return unary(); } return power(); }
  function power() { const b = postfix(); if (isOp("^")) { next(); return Math.pow(b, unary()); } return b; }
  function postfix() { let v = primary(); for (;;) { if (isOp("²")) { next(); v = v * v; } else if (isOp("³")) { next(); v = v * v * v; } else break; } return v; }
  function primary() {
    const k = next();
    if (!k) throw new Error("Unvollständig");
    if (k.t === "n") return k.v;
    if (k.t === "op" && k.v === "(") { const v = expr(); if (isOp(")")) next(); return v; }
    if (k.t === "op" && k.v === "√") return Math.sqrt(postfix());
    if (k.t === "id") {
      if (k.v === "π" || k.v === "pi") return Math.PI;
      if (k.v === "e") return Math.E;
      if (k.v === "g") return 9.81;
      if (k.v === "Ans") return calcAns;
      if (FUNCS.includes(k.v)) {
        const a = postfix();
        switch (k.v) {
          case "sin": return Math.sin(toRad(a));
          case "cos": return Math.cos(toRad(a));
          case "tan": return Math.tan(toRad(a));
          case "asin": return fromRad(Math.asin(a));
          case "acos": return fromRad(Math.acos(a));
          case "atan": return fromRad(Math.atan(a));
          case "sqrt": return Math.sqrt(a);
          case "ln": return Math.log(a);
          case "log": return Math.log10(a);
          case "abs": return Math.abs(a);
        }
      }
    }
    throw new Error("Unvollständig");
  }
  if (!tk.length) throw new Error("Leer");
  const v = expr();
  if (p < tk.length) throw new Error("Unvollständig");
  return v;
}
const SUP = { "-": "⁻", "0": "⁰", "1": "¹", "2": "²", "3": "³", "4": "⁴", "5": "⁵", "6": "⁶", "7": "⁷", "8": "⁸", "9": "⁹" };
function calcFmt(v) {
  if (!isFinite(v)) return isNaN(v) ? "nicht definiert" : (v > 0 ? "∞" : "−∞");
  if (Math.abs(v) < 1e-12) return "0";
  const a = Math.abs(v);
  if (a >= 1e6 || a < 1e-3) {
    const [m, ex] = v.toExponential(4).split("e");
    return String(+m).replace(".", ",").replace("-", "−") + " · 10" + String(+ex).split("").map(ch => SUP[ch] || ch).join("");
  }
  return String(+v.toPrecision(7)).replace(".", ",").replace("-", "−");
}

const U: Record<string, Unit[]> = {
  t: [["s", 1], ["ms", 1e-3]],
  m: [["kg", 1], ["g", 1e-3]],
  len: [["m", 1], ["cm", 1e-2], ["mm", 1e-3]],
  D: [["N/m", 1]],
  g: [["m/s²", 1]],
  C: [["F", 1], ["µF", 1e-6], ["nF", 1e-9]],
  L: [["H", 1], ["mH", 1e-3]],
  U: [["V", 1]],
  I: [["A", 1], ["mA", 1e-3]],
  E: [["J", 1], ["mJ", 1e-3]],
  w: [["1/s", 1]],
  f: [["Hz", 1]],
  v: [["m/s", 1]],
  a: [["m/s²", 1]],
  F: [["N", 1]],
  rho: [["kg/m³", 1]]
};
const PI2 = 4 * Math.PI * Math.PI;
const SOLVERS: Solver[] = [
  { id: "konv", name: "f, T und ω umrechnen", f: "f = 1/T,  ω = 2πf", convert: true,
    vars: [["T", "Periodendauer", U.t], ["f", "Frequenz", U.f], ["w", "Kreisfrequenz ω", U.w]] },
  { id: "feder", name: "Federpendel", f: "T = 2π√(m/D)",
    vars: [["T", "Periodendauer", U.t], ["m", "Masse", U.m], ["D", "Federhärte", U.D]],
    solve: { T: v => 2 * Math.PI * Math.sqrt(v.m / v.D), m: v => v.D * v.T * v.T / PI2, D: v => PI2 * v.m / (v.T * v.T) },
    how: { T: "T = 2π·√({m} / {D})", m: "m = {D}·({T})² / (4π²)", D: "D = 4π²·{m} / ({T})²" } },
  { id: "senk", name: "Senkrechtes Federpendel (D aus Dehnung)", f: "D = m·g / s₀",
    vars: [["D", "Federhärte", U.D], ["m", "Masse", U.m], ["s", "Dehnung s₀", U.len]],
    solve: { D: v => v.m * 9.81 / v.s, m: v => v.D * v.s / 9.81, s: v => v.m * 9.81 / v.D },
    how: { D: "D = {m}·9,81 m/s² / {s}", m: "m = {D}·{s} / 9,81 m/s²", s: "s₀ = {m}·9,81 m/s² / {D}" } },
  { id: "faden", name: "Fadenpendel", f: "T = 2π√(l/g)",
    vars: [["T", "Periodendauer", U.t], ["l", "Fadenlänge", U.len], ["g", "Ortsfaktor g (Aufzug: g ± a)", U.g, 9.81]],
    solve: { T: v => 2 * Math.PI * Math.sqrt(v.l / v.g), l: v => v.g * v.T * v.T / PI2, g: v => PI2 * v.l / (v.T * v.T) },
    how: { T: "T = 2π·√({l} / {g})", l: "l = {g}·({T})² / (4π²)", g: "g = 4π²·{l} / ({T})²" } },
  { id: "thomson", name: "Schwingkreis (Thomson)", f: "T = 2π√(L·C)",
    vars: [["T", "Periodendauer", U.t], ["L", "Induktivität", U.L], ["C", "Kapazität", U.C]],
    solve: { T: v => 2 * Math.PI * Math.sqrt(v.L * v.C), L: v => v.T * v.T / (PI2 * v.C), C: v => v.T * v.T / (PI2 * v.L) },
    how: { T: "T = 2π·√({L}·{C})", L: "L = ({T})² / (4π²·{C})", C: "C = ({T})² / (4π²·{L})" } },
  { id: "vmax", name: "Maximale Geschwindigkeit", f: "vₘₐₓ = sₘₐₓ·ω",
    vars: [["v", "vₘₐₓ", U.v], ["y", "Amplitude sₘₐₓ", U.len], ["w", "Kreisfrequenz ω", U.w]],
    solve: { v: v => v.y * v.w, y: v => v.v / v.w, w: v => v.v / v.y },
    how: { v: "vₘₐₓ = {y}·{w}", y: "sₘₐₓ = {v} / {w}", w: "ω = {v} / {y}" } },
  { id: "amax", name: "Maximale Beschleunigung", f: "aₘₐₓ = sₘₐₓ·ω²",
    vars: [["a", "aₘₐₓ", U.a], ["y", "Amplitude sₘₐₓ", U.len], ["w", "Kreisfrequenz ω", U.w]],
    solve: { a: v => v.y * v.w * v.w, y: v => v.a / (v.w * v.w), w: v => Math.sqrt(v.a / v.y) },
    how: { a: "aₘₐₓ = {y}·({w})²", y: "sₘₐₓ = {a} / ({w})²", w: "ω = √({a} / {y})" } },
  { id: "yt", name: "Auslenkung zur Zeit t", f: "s(t) = sₘₐₓ·sin(ω·t)", only: "y",
    vars: [["y", "Auslenkung s(t)", U.len], ["A", "Amplitude sₘₐₓ", U.len], ["w", "Kreisfrequenz ω", U.w], ["t", "Zeit t", U.t]],
    solve: { y: v => v.A * Math.sin(v.w * v.t) },
    how: { y: "s = {A}·sin({w}·{t})  (im Bogenmaß)" } },
  { id: "hooke", name: "Federspannkraft (Hooke)", f: "F_S = D·s",
    vars: [["F", "Federspannkraft F_S", U.F], ["D", "Federhärte D", U.D], ["s", "Dehnung s", U.len]],
    solve: { F: v => v.D * v.s, D: v => v.F / v.s, s: v => v.F / v.D },
    how: { F: "F = {D}·{s}", D: "D = {F} / {s}", s: "s = {F} / {D}" } },
  { id: "espann", name: "Spannenergie", f: "E = ½·D·s²",
    vars: [["E", "Energie", U.E], ["D", "Federhärte", U.D], ["s", "Auslenkung / Amplitude", U.len]],
    solve: { E: v => 0.5 * v.D * v.s * v.s, D: v => 2 * v.E / (v.s * v.s), s: v => Math.sqrt(2 * v.E / v.D) },
    how: { E: "E = ½·{D}·({s})²", D: "D = 2·{E} / ({s})²", s: "s = √(2·{E} / {D})" } },
  { id: "ekin", name: "Bewegungsenergie", f: "E = ½·m·v²",
    vars: [["E", "Energie", U.E], ["m", "Masse", U.m], ["v", "Geschwindigkeit", U.v]],
    solve: { E: v => 0.5 * v.m * v.v * v.v, m: v => 2 * v.E / (v.v * v.v), v: v => Math.sqrt(2 * v.E / v.m) },
    how: { E: "E = ½·{m}·({v})²", m: "m = 2·{E} / ({v})²", v: "v = √(2·{E} / {m})" } },
  { id: "epot", name: "Lageenergie", f: "E = m·g·h",
    vars: [["E", "Energie", U.E], ["m", "Masse", U.m], ["h", "Höhe", U.len]],
    solve: { E: v => v.m * 9.81 * v.h, m: v => v.E / (9.81 * v.h), h: v => v.E / (v.m * 9.81) },
    how: { E: "E = {m}·9,81 m/s²·{h}", m: "m = {E} / (9,81 m/s²·{h})", h: "h = {E} / ({m}·9,81 m/s²)" } },
  { id: "bungee", name: "Bungee: Energiesatz", f: "m·g·h = ½·D·s²",
    vars: [["m", "Masse", U.m], ["h", "Fallhöhe bis tiefster Punkt", U.len], ["D", "Federhärte Seil", U.D], ["s", "Seildehnung", U.len]],
    solve: { m: v => v.D * v.s * v.s / (2 * 9.81 * v.h), h: v => v.D * v.s * v.s / (2 * v.m * 9.81), D: v => 2 * v.m * 9.81 * v.h / (v.s * v.s), s: v => Math.sqrt(2 * v.m * 9.81 * v.h / v.D) },
    how: { m: "m = {D}·({s})² / (2·9,81 m/s²·{h})", h: "h = {D}·({s})² / (2·{m}·9,81 m/s²)", D: "D = 2·{m}·9,81 m/s²·{h} / ({s})²", s: "s = √(2·{m}·9,81 m/s²·{h} / {D})" } },
  { id: "ec", name: "Energie im Kondensator", f: "E = ½·C·U²",
    vars: [["E", "Energie", U.E], ["C", "Kapazität", U.C], ["U", "Spannung", U.U]],
    solve: { E: v => 0.5 * v.C * v.U * v.U, C: v => 2 * v.E / (v.U * v.U), U: v => Math.sqrt(2 * v.E / v.C) },
    how: { E: "E = ½·{C}·({U})²", C: "C = 2·{E} / ({U})²", U: "U = √(2·{E} / {C})" } },
  { id: "el", name: "Energie in der Spule", f: "E = ½·L·I²",
    vars: [["E", "Energie", U.E], ["L", "Induktivität", U.L], ["I", "Stromstärke", U.I]],
    solve: { E: v => 0.5 * v.L * v.I * v.I, L: v => 2 * v.E / (v.I * v.I), I: v => Math.sqrt(2 * v.E / v.L) },
    how: { E: "E = ½·{L}·({I})²", L: "L = 2·{E} / ({I})²", I: "I = √(2·{E} / {L})" } }
];

const calcFab = document.getElementById("calcFab"), calcPanel = document.getElementById("calcPanel");
function calcOpen() { return calcPanel.classList.contains("open"); }
function openCalc() {
  calcPanel.classList.add("open"); calcPanel.setAttribute("aria-hidden", "false"); calcFab.classList.add("away");
  syncPanels();
  renderCalc();
  if (calcPrefs.mode === "rechner" && !matchMedia("(pointer: coarse)").matches) setTimeout(() => document.getElementById("cIn").focus(), 60);
}
function closeCalc() { calcPanel.classList.remove("open"); calcPanel.setAttribute("aria-hidden", "true"); calcFab.classList.remove("away"); syncPanels(); }
calcFab.addEventListener("click", openCalc);
document.getElementById("aiCalcBtn").addEventListener("click", () => calcOpen() ? closeCalc() : openCalc());
document.getElementById("calcAiBtn").addEventListener("click", () => isOpen() ? closeAI() : openAI());
document.getElementById("calcClose").addEventListener("click", closeCalc);
document.addEventListener("keydown", ev => { if (ev.key === "Escape" && calcOpen()) closeCalc(); });

function renderCalc() {
  document.querySelectorAll<HTMLButtonElement>("#calcSeg button").forEach(b => { const on = b.dataset.mode === calcPrefs.mode; b.classList.toggle("on", on); b.setAttribute("aria-pressed", on ? "true" : "false"); });
  document.getElementById("cRechner").hidden = calcPrefs.mode !== "rechner";
  document.getElementById("cFormeln").hidden = calcPrefs.mode !== "formeln";
  document.getElementById("cAngle").textContent = calcPrefs.deg ? "DEG" : "RAD";
  document.getElementById("cAngle").classList.toggle("deg", calcPrefs.deg);
  renderHist(); preview();
  if (calcPrefs.mode === "formeln") renderSolver();
}
document.getElementById("calcSeg").addEventListener("click", ev => { const b = (ev.target as Element).closest<HTMLButtonElement>("button[data-mode]"); if (!b) return; calcPrefs.mode = b.dataset.mode; saveCalc(); renderCalc(); });
document.getElementById("cAngle").addEventListener("click", () => { calcPrefs.deg = !calcPrefs.deg; saveCalc(); renderCalc(); toast(calcPrefs.deg ? "Gradmaß (DEG): sin(90) = 1" : "Bogenmaß (RAD): für sin(ωt) immer RAD"); });

const cIn = document.getElementById("cIn") as HTMLInputElement, cPrev = document.getElementById("cPrev");
if (matchMedia("(pointer: coarse)").matches) cIn.setAttribute("inputmode", "none");
function preview() {
  const s = cIn.value.trim();
  if (!s) { cPrev.textContent = ""; cPrev.classList.remove("err"); return; }
  try { cPrev.textContent = "= " + calcFmt(calcEval(s)); cPrev.classList.remove("err"); }
  catch (e) { cPrev.textContent = e.message === "Unvollständig" || e.message === "Leer" ? "…" : e.message; cPrev.classList.toggle("err", !/Unvollständig|Leer/.test(e.message)); }
}
function renderHist() {
  const h = document.getElementById("cHist"); h.innerHTML = "";
  if (!calcPrefs.hist.length) { h.appendChild(el("div", "c-empty", "Tipp: 2π√(0,5/20) eingeben. Komma oder Punkt geht beides, „Ans“ ist das letzte Ergebnis.")); return; }
  calcPrefs.hist.slice(-8).forEach(it => {
    const r = el("button", "c-h"); r.type = "button"; r.title = "Ergebnis übernehmen";
    const q = el("span", "c-hq"); q.textContent = it.q; const a = el("span", "c-ha"); a.textContent = "= " + calcFmt(it.v);
    r.appendChild(q); r.appendChild(a);
    r.addEventListener("click", () => insertCalc(calcFmt(it.v).includes("10") ? "Ans" : calcFmt(it.v).replace("−", "-")));
    h.appendChild(r);
  });
  const clr = el("button", "c-clr", "Verlauf leeren"); clr.type = "button";
  clr.addEventListener("click", () => { calcPrefs.hist = []; saveCalc(); renderHist(); });
  h.appendChild(clr);
  h.scrollTop = h.scrollHeight;
}
function insertCalc(txt) {
  const a = cIn.selectionStart ?? cIn.value.length, b = cIn.selectionEnd ?? cIn.value.length;
  cIn.value = cIn.value.slice(0, a) + txt + cIn.value.slice(b);
  const pos = a + txt.length; try { cIn.setSelectionRange(pos, pos); } catch (e) {}
  preview();
}
function commitCalc() {
  const s = cIn.value.trim(); if (!s) return;
  try {
    const v = calcEval(s);
    calcAns = v; calcPrefs.hist.push({ q: s, v }); calcPrefs.hist = calcPrefs.hist.slice(-30); saveCalc();
    cIn.value = ""; renderHist(); preview();
    cPrev.textContent = "= " + calcFmt(v);
  } catch (e) { cPrev.textContent = e.message === "Leer" ? "" : "Ausdruck ist unvollständig"; cPrev.classList.add("err"); }
}
cIn.addEventListener("input", preview);
cIn.addEventListener("keydown", ev => { if (ev.key === "Enter") { ev.preventDefault(); commitCalc(); } });
document.getElementById("cKeys").addEventListener("click", ev => {
  const b = (ev.target as Element).closest("button"); if (!b) return;
  const k = b.dataset.k;
  if (k === "=") commitCalc();
  else if (k === "C") { cIn.value = ""; preview(); }
  else if (k === "del") { const a = cIn.selectionStart ?? cIn.value.length, z = cIn.selectionEnd ?? a; if (a !== z) { cIn.value = cIn.value.slice(0, a) + cIn.value.slice(z); try { cIn.setSelectionRange(a, a); } catch (e) {} } else if (a > 0) { cIn.value = cIn.value.slice(0, a - 1) + cIn.value.slice(a); try { cIn.setSelectionRange(a - 1, a - 1); } catch (e) {} } preview(); }
  else insertCalc(k);
  if (!matchMedia("(pointer: coarse)").matches) cIn.focus();
});

function renderSolver() {
  const sel = document.getElementById("sSel") as HTMLSelectElement;
  if (!sel.options.length) SOLVERS.forEach(s => { const o = document.createElement("option"); o.value = s.id; o.textContent = s.name; sel.appendChild(o); });
  const sv = SOLVERS.find(s => s.id === calcPrefs.solver) || SOLVERS[1];
  sel.value = sv.id;
  document.getElementById("sF").textContent = sv.f;
  document.getElementById("sHint").textContent = sv.convert ? "Trag genau einen Wert ein, die anderen zwei werden berechnet." : sv.only ? "Trag s<sub>max</sub>, ω und t ein. Rechnet im Bogenmaß." : "Lass genau ein Feld leer, das wird berechnet.";
  const box = document.getElementById("sVars"); box.innerHTML = "";
  sv.vars.forEach(([k, label, units, def]) => {
    const row = el("label", "s-row");
    const opts = units.map(([u], i) => '<option value="' + i + '">' + u + '</option>').join("");
    row.innerHTML = '<span class="s-l">' + label + '</span><span class="s-in"><input type="text" inputmode="decimal" autocomplete="off" data-k="' + k + '" placeholder="' + (sv.only && sv.only === k ? "wird berechnet" : "?") + '"' + (def != null ? ' value="' + String(def).replace(".", ",") + '"' : "") + '>' + (units.length > 1 ? '<select data-u="' + k + '" aria-label="Einheit">' + opts + '</select>' : '<span class="s-u">' + units[0][0] + '</span>') + '</span>';
    box.appendChild(row);
  });
  document.getElementById("sOut").hidden = true;
}
document.getElementById("sSel").addEventListener("change", ev => { calcPrefs.solver = (ev.target as HTMLSelectElement).value; saveCalc(); renderSolver(); });
document.getElementById("sReset").addEventListener("click", renderSolver);
document.getElementById("sVars").addEventListener("keydown", ev => { if (ev.key === "Enter") { ev.preventDefault(); runSolver(); } });
document.getElementById("sGo").addEventListener("click", runSolver);
function runSolver() {
  const sv = SOLVERS.find(s => s.id === calcPrefs.solver) || SOLVERS[1];
  const out = document.getElementById("sOut"), box = document.getElementById("sVars");
  const vals: Record<string, number> = {}, fac: Record<string, number> = {}, unit: Record<string, string> = {}, empty: string[] = [];
  let bad = null;
  sv.vars.forEach(([k, label, units]) => {
    const inp = box.querySelector<HTMLInputElement>('input[data-k="' + k + '"]'), us = box.querySelector<HTMLSelectElement>('select[data-u="' + k + '"]');
    const ui = us ? +us.value : 0; fac[k] = units[ui][1]; unit[k] = units[ui][0];
    const raw = inp.value.trim();
    if (!raw) { empty.push(k); return; }
    let n; try { n = calcEval(raw); } catch (e) { n = NaN; }
    if (!isFinite(n)) bad = label; else vals[k] = n * fac[k];
  });
  const show = (html, cls) => { out.hidden = false; out.className = "s-out " + (cls || ""); out.innerHTML = html; };
  if (bad) return show("„" + bad + "“ ist keine gültige Zahl.", "err");
  const siU = k => sv.vars.find(v => v[0] === k)[2][0][0];
  const fmtSI = k => calcFmt(vals[k]) + " " + siU(k);
  if (sv.convert) {
    if (empty.length !== 2) return show("Trag genau einen der drei Werte ein.", "err");
    const k = ["T", "f", "w"].find(x => !empty.includes(x));
    const f = k === "T" ? 1 / vals.T : k === "f" ? vals.f : vals.w / (2 * Math.PI);
    const r = { T: 1 / f, f, w: 2 * Math.PI * f };
    ["T", "f", "w"].forEach(x => { if (x !== k) box.querySelector<HTMLInputElement>('input[data-k="' + x + '"]').value = calcFmt(r[x] / fac[x]); });
    calcAns = r.w;
    return show("<b>T = " + calcFmt(r.T) + " s · f = " + calcFmt(r.f) + " Hz · ω = " + calcFmt(r.w) + " 1/s</b><span>f = 1/T, ω = 2π·f = 2π/T</span>", "ok");
  }
  const target = sv.only || (empty.length === 1 ? empty[0] : null);
  if (!target) return show(empty.length ? "Lass genau ein Feld leer. Gerade sind " + empty.length + " leer." : "Lass das Feld leer, das berechnet werden soll.", "err");
  if (sv.only && sv.vars.some(([k]) => k !== target && !(k in vals))) return show("Trag s<sub>max</sub>, ω und t ein.", "err");
  const res = sv.solve[target](vals);
  if (!isFinite(res)) return show("Mit diesen Werten geht die Rechnung nicht auf (z. B. Division durch 0 oder Wurzel aus negativer Zahl).", "err");
  const tInp = box.querySelector<HTMLInputElement>('input[data-k="' + target + '"]');
  tInp.value = calcFmt(res / fac[target]);
  calcAns = res;
  const tLabel = sv.vars.find(v => v[0] === target)[1];
  const filled = sv.how[target].replace(/\{(\w+)\}/g, (_, k) => fmtSI(k));
  show("<b>" + tLabel + " = " + calcFmt(res / fac[target]) + " " + unit[target] + (fac[target] !== 1 ? " = " + calcFmt(res) + " " + siU(target) : "") + "</b><span>Umgestellt und eingesetzt (in SI): " + filled.replace(/</g, "&lt;") + " = " + calcFmt(res) + " " + siU(target) + "</span><span class=\"s-ans\">Als „Ans“ im Rechner verfügbar.</span>", "ok");
}

const clone = o => JSON.parse(JSON.stringify(o));
let prevSnap = clone(S);
const pendingEv = new Map();
let notifs = [], unread = 0, es = null;
const plain = h => String(h).replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
const cut = (t, n) => t.length > n ? t.slice(0, n - 1).trimEnd() + "…" : t;
function blockTitle(d, i) { const m = d.blocks[i][2].match(/<b>(.*?)<\/b>/); return cut(plain(m ? m[1] : d.blocks[i][2]).replace(/[.:]$/, ""), 70); }
function examScoreOf(st) { let s = 0; EXAM.forEach(t => { const v = parseFloat(st.p[t.n]); if (!isNaN(v)) s += Math.max(0, Math.min(t.p, v)); }); return s; }
function diffEvents(a, b, kp = "", tp = "", vp = "") {
  const ev = [], me = who;
  DAYS.forEach(d => {
    d.blocks.forEach((_, i) => {
      const k = d.n + "." + i, was = !!a.b[k], now = !!b.b[k];
      if (now && !was) ev.push({ key: kp + "b:" + k, type: "block", text: tp + me + " hat in " + W() + " " + d.n + " „" + blockTitle(d, i) + "“ erledigt.", view: vp + "tag" + d.n, anchor: "b" + d.n + "_" + i });
      if (was && !now) ev.push({ key: kp + "b:" + k, remove: true });
    });
    d.checks.forEach((c, i) => {
      const k = d.n + "." + i, was = !!a.c[k], now = !!b.c[k];
      if (now && !was) ev.push({ key: kp + "c:" + k, type: "check", text: tp + me + " hat abgehakt: „" + cut(plain(c.replace(/_max/g, "max")), 90) + "“ (" + W() + " " + d.n + ")", view: vp + "tag" + d.n, anchor: "c" + d.n + "_" + i });
      if (was && !now) ev.push({ key: kp + "c:" + k, remove: true });
    });
    d.ex.forEach((e, i) => {
      if (e.off) return;
      const k = d.n + "." + i, was = a.x[k] === "ok", now = b.x[k] === "ok";
      if (now && !was) ev.push({ key: kp + "x:" + k, type: "exercise", text: tp + me + " hat Übung " + exNo(d, i) + " gelöst: „" + cut(plain(e.q), 70) + "“", view: vp + "tag" + d.n, anchor: "ex" + d.n + "_" + i });
      if (was && !now) ev.push({ key: kp + "x:" + k, remove: true });
    });
    const pa = dayStats(d, a).pct, pb = dayStats(d, b).pct;
    if (pb === 100 && pa < 100) ev.push({ key: kp + "day:" + d.n, type: "day", text: tp + me + " hat " + W() + " " + d.n + " („" + d.title + "“) komplett geschafft.", view: vp + "tag" + d.n, anchor: "" });
    if (pa === 100 && pb < 100) ev.push({ key: kp + "day:" + d.n, remove: true });
    const ra = reviewDone(d, a), rb = reviewDone(d, b);
    if (rb && !ra) ev.push({ key: kp + "rev:" + d.n, type: "check", text: tp + me + " hat die Wiederholung von " + W() + " " + d.n + " geschafft.", view: vp + "tag" + d.n, anchor: "rev" + d.n });
    if (ra && !rb) ev.push({ key: kp + "rev:" + d.n, remove: true });
  });
  const oa = allStats(a).pct, ob = allStats(b).pct;
  [25, 50, 75, 100].forEach(m => { if (ob >= m && oa < m) ev.push({ key: kp + "ms:" + m, type: "milestone", text: tp + me + " hat " + m + " % vom ganzen Lernplan geschafft.", view: vp + "start", anchor: "duo" }); });
  EXAM.forEach(t => {
    const va = a.p[t.n], vb = b.p[t.n];
    if (vb != null && vb !== va) ev.push({ key: kp + "p:" + t.n, type: "exam", text: tp + me + " hat in der Probeklausur bei Aufgabe " + t.n + " (" + t.title + ") " + String(vb).replace(".", ",") + " von " + t.p + " Punkten.", view: vp + "klausur", anchor: "p" + t.n });
  });
  const full = st => EXAM.every(t => st.p[t.n] != null);
  if (full(b) && (!full(a) || examScoreOf(a) !== examScoreOf(b))) {
    const sc = examScoreOf(b);
    ev.push({ key: kp + "exam", type: "examdone", text: tp + me + " hat die Probeklausur fertig korrigiert: " + String(sc).replace(".", ",") + " von 70 Punkten (" + Math.round(sc / 70 * 100) + " %).", view: vp + "klausur", anchor: "examTotal" });
  }
  const known = new Set(a.f.map(f => f.d + "|" + f.t));
  b.f.forEach(f => { if (!known.has(f.d + "|" + f.t)) ev.push({ key: kp + "f:" + cut(f.d + f.t, 70), type: "fehler", text: tp + me + " hat ins Fehlerheft geschrieben: „" + cut(f.t, 110) + "“", view: vp + "fehler", anchor: "partnerFe" }); });
  return ev;
}
function allEvents(a, b) {
  const keep = SUBJ;
  try {
    useCourse("phys");
    const ev = diffEvents(a, b);
    COURSE_KEYS.forEach(c => { useCourse(c); ev.push(...diffEvents(fill(a)[c], fill(b)[c], c[0], META[c].label + ": ", c + ":")); });
    return ev;
  } finally { useCourse(keep); }
}
function queueEvents() {
  if (SERVER && who) allEvents(prevSnap, S).forEach(e => pendingEv.set(e.key, e));
  prevSnap = clone(S);
}
function takeEvents() { const list = [...pendingEv.values()]; pendingEv.clear(); return list; }
function requeue(list) { list.forEach(e => { if (!pendingEv.has(e.key)) pendingEv.set(e.key, e); }); }

function pullState() {
  if (!auth) return Promise.resolve();
  apiFetch("api/people", { cache: "no-store" }).then(r => r.ok ? r.json() : null).then(j => { if (j && Array.isArray(j.people)) { serverPeople = j.people; renderPeople(); } }).catch(() => {});
  return apiFetch("api/state", { cache: "no-store" }).then(r => r.ok ? r.json() : Promise.reject(r.status)).then(all => {
    applyRemote(Object.keys(all).map(id => { let st = null; try { st = all[id] && all[id].state ? JSON.parse(all[id].state) : null; } catch (e) {} return { id, st }; }));
  }).catch(() => setSync(false));
}

const bellBtn = document.getElementById("bellBtn"), ncenter = document.getElementById("ncenter");
function bellVisible() { document.getElementById("bellWrap").hidden = !(SERVER && who); }
function renderBell() {
  const b = document.getElementById("bellBadge");
  b.hidden = !unread; b.textContent = unread > 9 ? "9+" : String(unread);
  bellBtn.classList.toggle("has", unread > 0);
  bellBtn.setAttribute("aria-label", unread ? unread + " ungelesene Benachrichtigungen" : "Benachrichtigungen");
}
async function loadNotifs() {
  if (!SERVER || !who) return;
  try {
    if (!auth) return;
    const r = await apiFetch("api/notifs", { cache: "no-store" });
    if (!r.ok) return;
    const j = await r.json();
    notifs = j.items || []; unread = j.unread || 0;
    renderBell(); if (ncOpen()) renderNc();
  } catch (e) {}
}
function relTime(ts) {
  const s = Math.round((Date.now() - ts) / 1000);
  if (s < 60) return "gerade eben";
  const m = Math.round(s / 60); if (m < 60) return "vor " + m + " Min.";
  const h = Math.round(m / 60); if (h < 24) return "vor " + h + " Std.";
  const d = Math.round(h / 24); return d === 1 ? "gestern" : "vor " + d + " Tagen";
}
const NICON = { block: "◷", check: "✓", exercise: "✎", day: "★", milestone: "▲", exam: "◎", examdone: "◎", fehler: "!" };
function ncOpen() { return ncenter.classList.contains("open"); }
function markRead(ids?: string[]) { apiFetch("api/notifs/read", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(ids ? { who, ids } : { who }) }).catch(() => {}); }
function openNc() {
  closeMenu();
  ncenter.classList.add("open"); ncenter.setAttribute("aria-hidden", "false"); bellBtn.setAttribute("aria-expanded", "true");
  renderNc();
  if (unread) { unread = 0; renderBell(); markRead(); }
  notifs.forEach(n => { n.read = true; });
}
function closeNc() { ncenter.classList.remove("open"); ncenter.setAttribute("aria-hidden", "true"); bellBtn.setAttribute("aria-expanded", "false"); }
function renderNc() {
  const list = document.getElementById("ncList"); list.innerHTML = "";
  if (!notifs.length) list.appendChild(el("p", "nc-empty", "Noch nichts Neues. Sobald " + (other() || "jemand anderes") + " etwas abhakt, eine Übung löst oder ins Fehlerheft schreibt, siehst du es hier."));
  notifs.forEach(n => {
    const b = el("button", "nc-i" + (n.read ? "" : " new")); b.type = "button";
    b.innerHTML = avatar(n.from) + '<span class="nc-t"><span class="nc-x"></span><small>' + relTime(n.ts) + " · " + (NICON[n.type] || "•") + '</small></span><span class="nc-dot" aria-hidden="true"></span>';
    b.querySelector(".nc-x").textContent = n.text;
    b.addEventListener("click", () => { closeNc(); openTarget(n); });
    list.appendChild(b);
  });
  const foot = document.getElementById("ncFoot"); foot.innerHTML = "";
  if ("Notification" in window) {
    if (Notification.permission === "default") {
      const a = el("button", "nc-perm", "Mitteilungen auf diesem Gerät aktivieren"); a.type = "button";
      a.addEventListener("click", () => { Notification.requestPermission().then(() => renderNc()); });
      foot.appendChild(a);
    } else foot.appendChild(el("span", "nc-note", Notification.permission === "granted" ? "Mitteilungen sind auf diesem Gerät an, auch wenn der Tab im Hintergrund ist." : "Mitteilungen sind im Browser blockiert. Das Center hier funktioniert trotzdem."));
  }
  document.getElementById("ncClear").hidden = !notifs.length;
}
bellBtn.addEventListener("click", ev => { ev.stopPropagation(); ncOpen() ? closeNc() : openNc(); });
document.getElementById("ncClear").addEventListener("click", () => {
  notifs = []; unread = 0; renderBell(); renderNc();
  apiFetch("api/notifs/clear", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ who }) }).catch(() => {});
});
document.addEventListener("click", ev => { if (ncOpen() && !(ev.target as Element).closest(".bell")) closeNc(); });
document.addEventListener("keydown", ev => { if (ev.key === "Escape" && ncOpen()) closeNc(); });

function openTarget(n) {
  const view = n.view || "start";
  const m = view.match(/^(inf|mat):(.*)$/);
  setSubject(m ? m[1] as Subject : "phys");
  go(m ? m[2] : view);
  requestAnimationFrame(() => requestAnimationFrame(() => {
    let t = n.anchor ? document.getElementById(n.anchor) : null;
    if (t) t = t.closest(".blk, .checks label, .ex, .task, section, .card") || t;
    if (!t) return;
    t.scrollIntoView({ block: "center", behavior: reduceMotion() ? "auto" : "smooth" });
    t.classList.remove("flash"); void t.offsetWidth; t.classList.add("flash");
    setTimeout(() => t.classList.remove("flash"), 2600);
  }));
}

let ntoastT: ReturnType<typeof setTimeout> | undefined;
function liveToast(n) {
  const t = document.getElementById("ntoast");
  t.innerHTML = avatar(n.from) + '<span class="nt-x"></span><span class="nt-go">Ansehen</span>';
  t.querySelector(".nt-x").textContent = n.text;
  t.onclick = () => { hideToast(); n.read = true; if (unread) { unread--; renderBell(); } markRead([n.id]); openTarget(n); };
  t.hidden = false; requestAnimationFrame(() => t.classList.add("show"));
  clearTimeout(ntoastT); ntoastT = setTimeout(hideToast, 7000);
  function hideToast() { clearTimeout(ntoastT); t.classList.remove("show"); setTimeout(() => { if (!t.classList.contains("show")) t.hidden = true; }, 320); }
}
function onNotif(n) {
  if (n.to !== who) return;
  notifs = notifs.filter(x => x.id !== n.id && !(x.key === n.key && x.from === n.from && !x.read));
  notifs.unshift(n);
  if (ncOpen()) { n.read = true; markRead([n.id]); renderNc(); }
  else { unread = notifs.filter(x => !x.read).length; renderBell(); liveToast(n); }
  if (document.hidden && "Notification" in window && Notification.permission === "granted") {
    try { const sn = new Notification("Lernplan · " + n.from, { body: n.text, tag: n.id }); sn.onclick = () => { window.focus(); n.read = true; markRead([n.id]); unread = notifs.filter(x => !x.read).length; renderBell(); openTarget(n); sn.close(); }; } catch (e) {}
  }
}
function connectStream() {
  if (es) { es.close(); es = null; }
  if (!SERVER || !who || !auth || !window.EventSource) return;
  es = new EventSource("api/stream?token=" + encodeURIComponent(auth.token));
  es.addEventListener("open", loadNotifs);
  es.addEventListener("notif", e => { try { onNotif(JSON.parse(e.data)); } catch (x) {} });
  es.addEventListener("retract", e => { try { const id = JSON.parse(e.data).id; notifs = notifs.filter(x => x.id !== id); unread = notifs.filter(x => !x.read).length; renderBell(); if (ncOpen()) renderNc(); } catch (x) {} });
  es.addEventListener("state", e => { try { const d = JSON.parse(e.data); if (d.who !== who || d.ts > (S.ts || 0)) pullState(); } catch (x) {} });
}
function refreshPartnerMarks() {
  const op = other(), ps = op && partner[op] && sub(partner[op]);
  document.querySelectorAll<HTMLElement>("[data-pk]").forEach(node => {
    const [t, k] = node.dataset.pk.split(":");
    const done = !!ps && (t === "b" ? !!ps.b[k] : t === "c" ? !!ps.c[k] : ps.x[k] === "ok");
    let m = node.querySelector<HTMLElement>(":scope > .pm");
    if (done && !m) { m = el("span", "pm av av-" + op.toLowerCase(), op[0]); m.title = op + " hat das schon erledigt"; node.appendChild(m); }
    else if (!done && m) m.remove();
  });
}

function renderSubject() {
  document.querySelectorAll<HTMLButtonElement>("#subjSeg button").forEach(b => { const on = b.dataset.subj === SUBJ; b.classList.toggle("on", on); b.setAttribute("aria-pressed", on ? "true" : "false"); });
  document.getElementById("brandTxt").textContent = SUBJ !== "phys" ? MT().brand : "Schwingungen · 15";
  document.getElementById("topChip").innerHTML = SUBJ !== "phys" ? 'Ziel: <b id="cdTop">' + (modeOf() === "gut" ? "Gute Note" : "15 Punkte") + '</b>' : 'Klausur in <b id="cdTop">' + Math.max(daysLeft(), 0) + ' Tagen</b>';
}
function setSubject(s: Subject) {
  if (s === SUBJ) return;
  useCourse(s);
  lsSet(SUBJ_KEY, s);
  NAV = makeNav();
  buildNav();
  renderSubject();
  rebuildAll();
}
function setMode(m: string) {
  if (SUBJ === "phys") return;
  mine().mode = m;
  save();
  renderSubject();
  buildNav();
  rebuildAll();
}
document.getElementById("subjSeg").addEventListener("click", ev => { const b = (ev.target as Element).closest<HTMLButtonElement>("button[data-subj]"); if (b) setSubject(b.dataset.subj as Subject); });
NAV = makeNav();
renderSubject();
buildNav();
renderAccount();
route(initialView());
if (!who) showPicker();
try { matchMedia("(prefers-color-scheme: dark)").addEventListener("change", () => { if (cur === "start") startScope(); }); } catch (e) {}

if (SERVER) {
  pullState();
  bellVisible(); loadNotifs(); connectStream();
  setInterval(() => { if (!document.hidden) pullState(); }, 30000);
  setInterval(() => { if (ncOpen()) renderNc(); }, 60000);
  document.addEventListener("visibilitychange", () => { if (!document.hidden) { pullState(); loadNotifs(); } });
  aiOffText = "Der KI-Tutor ist auf diesem Server noch nicht eingerichtet. Sobald ein Gemini-Schlüssel hinterlegt ist, kannst du hier Fragen stellen.";
  fetch("api/ai/status", { cache: "no-store" }).then(r => r.json()).then(j => { if (j && j.enabled) { sample = serverSample; if (isOpen()) emptyState(); } }).catch(() => {});
}
if (ON_CLAUDE) {
  window.claude.use("sample").then(s => { sample = s; if (isOpen()) emptyState(); }).catch(() => {});
  window.claude.use("db").then(d => {
    if (!d) return;
    db = d; profilesCol = d.collection("profiles");
    profilesCol.onSnapshot(snap => {
      applyRemote(snap.docs.map(doc => { let st = null; try { const data = doc.data(); st = data && data.state ? JSON.parse(data.state) : null; } catch (e) {} return { id: doc.id, st }; }));
    }, () => setSync(false));
  }).catch(() => {});
}
