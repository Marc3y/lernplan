import type { Day, ExamTask, Review, Lesson, CourseMeta } from "../types";

const LF = (x: string) => '<div class="lf">' + x + '</div>';
const LX = (x: string) => '<div class="lx"><b>Beispiel</b>' + x + '</div>';
const LK = (x: string) => '<div class="lk"><b>Merke</b>' + x + '</div>';
const TAB = (head: string[], rows: (string | number)[][]) => '<div class="lw"><table class="lta"><tr>' + head.map(h => "<th>" + h + "</th>").join("") + "</tr>" + rows.map(r => "<tr>" + r.map(c => "<td>" + c + "</td>").join("") + "</tr>").join("") + "</table></div>";
const V = (...c: (string | number)[]) => '<span class="cv">' + c.map(x => "<span>" + String(x).replace(/^-/, "−") + "</span>").join("") + "</span>";

const vk = (s: string) => s.replace(/\{([^{}]+)\}/g, (_, x) => '<span class="vk">' + x + '</span>');
function deep<T>(o: T): T {
  if (typeof o === "string") return vk(o) as T;
  if (Array.isArray(o)) return o.map(deep) as T;
  if (o && typeof o === "object") { const r: Record<string, unknown> = {}; for (const k in o) r[k] = deep((o as Record<string, unknown>)[k]); return r as T; }
  return o;
}

function svgAxes() {
  return '<svg class="lfig lfig-s" viewBox="0 0 240 200" role="img" aria-label="Räumliches Koordinatensystem mit dem Punkt P(2|3|4)">' +
    '<line class="la" x1="80" y1="140" x2="225" y2="140"/><line class="la" x1="80" y1="140" x2="80" y2="15"/><line class="la" x1="80" y1="140" x2="15" y2="195"/>' +
    '<text class="lt" x="222" y="132">x₂</text><text class="lt" x="88" y="20">x₃</text><text class="lt" x="20" y="182">x₁</text>' +
    '<path class="lh" stroke-dasharray="4 3" fill="none" d="M80 140 L56 160 L131 160 L155 140 M131 160 L131 85"/>' +
    '<circle class="ld" cx="131" cy="85" r="5"/><text class="lt" x="138" y="82">P(2|3|4)</text></svg>';
}

function svgLines() {
  const box = '<rect class="la" x="20" y="10" width="80" height="30" rx="2"/>';
  const lab = (x: number, t: string) => '<text class="lt" x="' + x + '" y="60">' + t + '</text>';
  return '<svg class="lfig" viewBox="0 0 370 120" role="img" aria-label="Die vier Lagen zweier Geraden">' +
    box + '<line class="lc" x1="12" y1="30" x2="108" y2="16"/><line class="lb" stroke-dasharray="5 4" x1="12" y1="30" x2="108" y2="16"/>' + lab(28, "identisch") +
    '<g transform="translate(90 0)">' + box + '<line class="lc" x1="12" y1="22" x2="108" y2="12"/><line class="lb" x1="12" y1="38" x2="108" y2="28"/>' + lab(32, "parallel") + '</g>' +
    '<g transform="translate(180 0)">' + box + '<line class="lc" x1="12" y1="15" x2="108" y2="38"/><line class="lb" x1="12" y1="38" x2="108" y2="15"/>' + lab(24, "schneiden") + '</g>' +
    '<g transform="translate(270 0)">' + box + '<line class="lc" x1="12" y1="12" x2="108" y2="22"/><line class="lb" stroke-dasharray="5 4" x1="14" y1="40" x2="100" y2="30"/>' + lab(22, "windschief") + '</g>' +
    '<text x="20" y="92">gleiche Richtung</text><text x="200" y="92">verschiedene Richtung</text><text x="20" y="108">(u⃗, v⃗ Vielfache)</text><text x="200" y="108">(u⃗, v⃗ keine Vielfachen)</text></svg>';
}

function svgLot() {
  return '<svg class="lfig lfig-s" viewBox="0 0 260 140" role="img" aria-label="Abstand eines Punktes Q von einer Geraden g über den Lotfußpunkt F">' +
    '<line class="lc" x1="10" y1="120" x2="250" y2="60"/><text class="lt" x="236" y="50">g</text>' +
    '<line class="lh" stroke-dasharray="4 3" x1="125" y1="21" x2="145" y2="86"/>' +
    '<circle class="ld" cx="145" cy="86" r="4"/><text class="lt" x="148" y="108">F</text>' +
    '<circle cx="125" cy="21" r="5" style="fill:var(--warm)"/><text class="lgt" x="134" y="20">Q</text>' +
    '<text class="lt" x="116" y="58">d</text><path class="la" d="M140 72 L149 70 L151 79"/></svg>';
}

export const MAT_DAYS: Day[] = deep<Day[]>([
 { n: 1, date: "", wd: "", title: "Grundlagen auffrischen", short: "Punkte, Vektoren, LGS",
   goal: "Du kannst Punkte im Raum lesen, Verbindungsvektoren und Mittelpunkte ausrechnen, ein LGS mit Probe lösen und den Taschenrechner für Winkel richtig einstellen.",
   blocks: [
    ["10", "basic", "<b>Koordinatensystem im Raum.</b> Welche Achse ist wo, und welche Koordinate ist in welcher Ebene 0?"],
    ["15", "basic", "<b>Vektoren rechnen.</b> Verbindungsvektor {AB} = {OB} − {OA}, addieren, mit einer Zahl malnehmen, Mittelpunkt."],
    ["15", "basic", "<b>LGS mit 3 Gleichungen und 2 Unbekannten.</b> Das brauchst du bei Punktprobe und Lagebeziehung."],
    ["5", "basic", "<b>Taschenrechner auf DEG.</b> Winkel kommen in Grad heraus."],
    ["20", "ueben", "<b>Übungen</b> unten."],
    ["5", "test", "<b>Selbsttest.</b> Partner nennt zwei Punkte, du sagst den Verbindungsvektor im Kopf."]
   ],
   notes: [["warn", "Wichtig für morgen", "Für die Winkel muss der Taschenrechner auf <b>DEG</b> stehen, nicht auf RAD wie bei Physik."], ["tip", "Schreibweise wie in der Merkhilfe", "Alle Buchstaben auf dieser Seite sind wie in eurer Merkhilfe (Seite 10 und 11): Vektoren mit Pfeil, Gerade g: {x} = {p} + r · {u}, zweite Gerade h: {x} = {q} + s · {v}, Winkel zwischen Vektoren φ, Schnittwinkel α."]],
   vids: [], links: [["Formeln", "#formeln"]],
   checks: ["Punkte im Raum und die Koordinatenebenen erkennen", "Verbindungsvektor {AB} = {OB} − {OA} ausrechnen", "Vektoren addieren, mit einer Zahl malnehmen, Mittelpunkt mit {OM} = ½({OA} + {OB}) bestimmen", "Ein LGS mit drei Gleichungen lösen und mit der dritten prüfen", "arccos auf dem Taschenrechner in Grad ausrechnen"],
   groups: ["Punkte und Ebenen", "Vektoren rechnen", "LGS", "Taschenrechner"],
   core: { b: [0, 1, 2, 3, 4], c: [0, 1, 3, 4] },
   ex: [
    { t: "mc", g: "Punkte und Ebenen", k: true, q: "Welcher Punkt liegt in der x₁x₂-Ebene?", o: ["(3|−1|0)", "(0|−1|3)", "(3|0|−1)", "(1|1|1)"], a: 0, s: "In der x₁x₂-Ebene ist x₃ = 0." },
    { t: "mc", g: "Punkte und Ebenen", q: "Welcher Punkt liegt auf der x₃-Achse?", o: ["(0|0|5)", "(5|0|0)", "(0|5|0)", "(5|5|0)"], a: 0, s: "Auf der x₃-Achse sind x₁ und x₂ beide 0." },
    { t: "mc", g: "Punkte und Ebenen", k: true, q: "Gesucht ist ein Punkt, der in der x₁x₂-Ebene und in der x₁x₃-Ebene liegt, aber nicht in der x₂x₃-Ebene. Welcher passt?", o: ["(4|0|0)", "(0|4|0)", "(0|0|4)", "(4|4|0)"], a: 0, s: "x₁x₂-Ebene: x₃ = 0. x₁x₃-Ebene: x₂ = 0. Nicht in der x₂x₃-Ebene heißt x₁ ≠ 0. Also (4|0|0), ein Punkt auf der x₁-Achse." },
    { t: "num", g: "Vektoren rechnen", k: true, q: "A(1|2|3), B(4|0|5). Wie groß ist die erste Koordinate von {AB}?", a: 3, s: "{AB} = {OB} − {OA} = " + V(3, -2, 2) + ". Erste Koordinate b₁ − a₁ = 4 − 1 = 3." },
    { t: "num", g: "Vektoren rechnen", k: true, q: "Gleiche Punkte. Wie groß ist die zweite Koordinate von {AB}?", a: -2, s: "b₂ − a₂ = 0 − 2 = −2. Immer Spitze (B) minus Fuß (A)." },
    { t: "num", g: "Vektoren rechnen", k: true, q: "Berechne 2 · " + V(1, -2, 3) + " + " + V(0, 4, -1) + ". Wie groß ist die dritte Koordinate?", a: 5, s: "2 · " + V(1, -2, 3) + " = " + V(2, -4, 6) + ". Plus " + V(0, 4, -1) + " ergibt " + V(2, 0, 5) + "." },
    { t: "num", g: "Vektoren rechnen", q: "Mittelpunkt M von A(2|4|−2) und B(6|0|4). Wie groß ist die dritte Koordinate von M?", a: 1, s: "{OM} = ½({OA} + {OB}) = ½ · " + V(8, 4, 2) + " = " + V(4, 2, 1) + ", also M(4|2|1)." },
    { t: "num", g: "Vektoren rechnen", q: "Ein Quader hat die Ecken A(1|2|0), B(5|2|0) und D(1|8|0). C liegt gegenüber von A. Wie groß ist die zweite Koordinate von C?", a: 8, s: "{OC} = {OB} + {AD} = " + V(5, 2, 0) + " + " + V(0, 6, 0) + " = " + V(5, 8, 0) + ", also C(5|8|0)." },
    { t: "num", g: "LGS", k: true, q: "Löse: I r − s = 2, II r + s = 6. Wie groß ist r?", a: 4, s: "I + II: 2r = 8, also r = 4. Dann s = 2." },
    { t: "num", g: "LGS", k: true, q: "Gleiches LGS. Wie groß ist s?", a: 2, s: "Aus II: s = 6 − r = 2." },
    { t: "mc", g: "LGS", k: true, q: "Gleiches LGS mit dritter Gleichung III 2r − 3s = 2. Was sagt die Probe?", o: ["Stimmt (8 − 6 = 2), das LGS hat die Lösung r = 4, s = 2", "Stimmt nicht, das LGS hat keine Lösung", "Man braucht die dritte Gleichung nicht", "r und s müssen neu berechnet werden"], a: 0, s: "Einsetzen: 2 · 4 − 3 · 2 = 2. Wahre Aussage, also passt die Lösung zu allen drei Gleichungen." },
    { t: "num", g: "Taschenrechner", k: true, q: "Wie groß ist arccos(0,5) in Grad?", a: 60, s: "cos(60°) = 0,5. Im Taschenrechner: SHIFT cos 0,5 im Modus DEG." },
    { t: "num", g: "Taschenrechner", k: true, q: "Wie groß ist √(2² + (−1)² + 2²)?", a: 3, s: "√(4 + 1 + 4) = √9 = 3. Minus ins Quadrat ist plus." },
    { t: "mc", g: "Taschenrechner", q: "Dein Taschenrechner zeigt für arccos(0,5) den Wert 1,047. Was ist los?", o: ["Er steht auf RAD statt DEG", "Die Rechnung ist falsch", "Man muss noch mit 2 malnehmen", "Das ist richtig so"], a: 0, s: "1,047 ist π/3, also der Winkel im Bogenmaß. In der Vektorgeometrie willst du Grad: auf DEG umstellen." }
   ] },
 { n: 2, date: "", wd: "", title: "Skalarprodukt, Länge, Winkel", short: "6.1 Grundlagen",
   goal: "Du kannst Betrag, Länge einer Strecke, Skalarprodukt und den Winkel φ zwischen zwei Vektoren ausrechnen und Orthogonalität und Kollinearität prüfen.",
   blocks: [
    ["10", "skript", "<b>Betrag und Länge einer Strecke.</b> |{a}| = √(a₁² + a₂² + a₃²)."],
    ["10", "skript", "<b>Skalarprodukt.</b> {a} · {b} = a₁b₁ + a₂b₂ + a₃b₃, es kommt eine Zahl heraus."],
    ["15", "skript", "<b>Winkel φ.</b> cos(φ) = ({a} · {b}) / (|{a}| · |{b}|), dann arccos in DEG."],
    ["10", "skript", "<b>Orthogonal und kollinear.</b> {a} ⊥ {b} ⇔ {a} · {b} = 0, kollinear bei {a} = c · {b} mit demselben c in allen Zeilen."],
    ["25", "ueben", "<b>Übungen</b> unten."],
    ["5", "test", "<b>Selbsttest.</b> Winkel zwischen (1|0|1) und (0|1|1) ohne Hilfe."]
   ],
   notes: [["warn", "Nachrechnen im Heft", "Im Unterrichtsbeispiel mit {a} = (2|6|4) und {b} = (4|4|6) steht ≈ 20,7°. Dort wurde |{b}| = 8 eingesetzt, richtig ist |{b}| = √68 ≈ 8,25 und damit φ ≈ 24,8°."]],
   vids: [], links: [["Formeln", "#formeln"]],
   checks: ["Betrag |{a}| und Länge |{AB}| einer Strecke berechnen", "Skalarprodukt {a} · {b} ausrechnen", "Winkel φ zwischen zwei Vektoren berechnen", "Orthogonalität prüfen: {a} ⊥ {b} ⇔ {a} · {b} = 0", "Kollinearität prüfen ({a} = c · {b})"],
   groups: ["Länge und Abstand", "Skalarprodukt und Winkel", "Orthogonal und kollinear"],
   core: { b: [0, 1, 2, 3, 4], c: [0, 1, 2, 3, 4] },
   ex: [
    { t: "num", g: "Länge und Abstand", k: true, q: "Wie lang ist {a} = " + V(2, -1, 2) + "?", a: 3, s: "|{a}| = √(2² + (−1)² + 2²) = √9 = 3" },
    { t: "num", g: "Länge und Abstand", k: true, q: "Abstand von A(3|−5|1) zum Ursprung O(0|0|0)? (zwei Nachkommastellen)", a: 5.92, s: "|{OA}| = √(9 + 25 + 1) = √35 ≈ 5,92" },
    { t: "num", g: "Länge und Abstand", k: true, q: "Länge der Strecke AB mit A(3|−5|1) und B(7|2|1)? (zwei Nachkommastellen)", a: 8.06, s: "|{AB}| = √((7 − 3)² + (2 + 5)² + (1 − 1)²) = √(16 + 49 + 0) = √65 ≈ 8,06" },
    { t: "num", g: "Länge und Abstand", q: "Wie lang ist die Strecke AB mit A(1|2|3) und B(4|0|5)? (zwei Nachkommastellen)", a: 4.12, s: "{AB} = " + V(3, -2, 2) + ", |{AB}| = √(9 + 4 + 4) = √17 ≈ 4,12" },
    { t: "num", g: "Skalarprodukt und Winkel", k: true, q: "Berechne " + V(2, 6, 4) + " · " + V(4, 4, 6) + ".", a: 56, s: "a₁b₁ + a₂b₂ + a₃b₃ = 2 · 4 + 6 · 4 + 4 · 6 = 8 + 24 + 24 = 56" },
    { t: "num", g: "Skalarprodukt und Winkel", k: true, q: "Winkel φ zwischen {a} = " + V(1, 2) + " und {b} = " + V(3, 1) + " in Grad?", a: 45, s: "{a} · {b} = 3 + 2 = 5, |{a}| = √5, |{b}| = √10. cos(φ) = 5/(√5 · √10) ≈ 0,707, φ = 45°." },
    { t: "num", g: "Skalarprodukt und Winkel", k: true, q: "Winkel φ zwischen " + V(1, 0, 1) + " und " + V(0, 1, 1) + " in Grad?", a: 60, s: "{a} · {b} = 0 + 0 + 1 = 1, |{a}| = |{b}| = √2. cos(φ) = 1/2, φ = 60°." },
    { t: "num", g: "Skalarprodukt und Winkel", q: "Winkel φ zwischen " + V(2, 6, 4) + " und " + V(4, 4, 6) + " in Grad? (eine Nachkommastelle)", a: 24.8, s: "{a} · {b} = 56, |{a}| = √56 ≈ 7,48, |{b}| = √68 ≈ 8,25. cos(φ) = 56/(√56 · √68) ≈ 0,907, φ ≈ 24,8°." },
    { t: "num", g: "Skalarprodukt und Winkel", q: "Winkel φ zwischen " + V(2, 1, -2) + " und " + V(1, 2, 2) + " in Grad?", a: 90, s: "{a} · {b} = 2 + 2 − 4 = 0. cos(φ) = 0, also φ = 90°." },
    { t: "mc", g: "Orthogonal und kollinear", k: true, q: "Welche beiden Vektoren stehen senkrecht aufeinander?", o: [V(-2, 1, -2) + " und " + V(3, 8, 1), V(1, -2, 3) + " und " + V(-1, 2, 3), V(1, 1, 1) + " und " + V(1, 1, 0), V(2, 0, 1) + " und " + V(1, 0, 2)], a: 0, s: "−2 · 3 + 1 · 8 + (−2) · 1 = −6 + 8 − 2 = 0. {a} · {b} = 0 heißt {a} ⊥ {b}." },
    { t: "num", g: "Orthogonal und kollinear", k: true, q: "Für welches k stehen " + V(1, "k", 2) + " und " + V(3, 1, -2) + " senkrecht aufeinander?", a: 1, s: "3 + k − 4 = 0, also k = 1." },
    { t: "num", g: "Orthogonal und kollinear", k: true, q: V(2, -1, 4) + " = c · " + V(4, -2, 8) + ". Wie groß ist c?", a: 0.5, s: "Zeile I: 2 = 4c → c = ½. Zeile II: −1 = −2c → c = ½. Zeile III: 4 = 8c → c = ½. Überall gleich, also kollinear mit c = 0,5." },
    { t: "mc", g: "Orthogonal und kollinear", q: "Sind " + V(1, 2, 3) + " und " + V(2, 4, 5) + " kollinear?", o: ["Nein, aus I und II folgt c = 2, aus III aber c = 2,5", "Ja, weil die ersten zwei Zeilen passen", "Ja, weil alle Zahlen positiv sind", "Nein, weil das Skalarprodukt nicht 0 ist"], a: 0, s: "Kollinear nur, wenn c in allen drei Zeilen gleich ist. Hier nicht." },
    { t: "rev", g: "Orthogonal und kollinear", q: "Warum kann man im gezeichneten 3D-Koordinatensystem keine Längen von Vektoren ablesen?", s: "Weil die x₁-Achse schräg und verkürzt gezeichnet wird. Die Zeichnung verzerrt Längen und Winkel. Deshalb rechnet man Längen immer mit dem Betrag aus." }
   ] },
 { n: 3, date: "", wd: "", title: "Geraden im Raum", short: "6.2 Parametergleichung",
   goal: "Du kannst die Gleichung einer Geraden durch zwei Punkte aufstellen, Punkte auf ihr berechnen und mit der Punktprobe prüfen, ob ein Punkt auf ihr liegt.",
   blocks: [
    ["15", "skript", "<b>Parameterform.</b> g: {x} = {p} + r · {u} mit Stützvektor {p} und Richtungsvektor {u}."],
    ["10", "skript", "<b>Punkte auf der Geraden.</b> Einfach ein r einsetzen."],
    ["15", "skript", "<b>Punktprobe.</b> Punkt gleich Gerade setzen, drei Zeilen, dreimal dasselbe r?"],
    ["20", "ueben", "<b>Übungen</b> unten."],
    ["5", "test", "<b>Selbsttest.</b> Gerade durch zwei Punkte aufstellen, die dein Partner nennt."]
   ],
   notes: [["tip", "Punktprobe", "Erst wenn alle <b>drei</b> Zeilen dasselbe r geben, liegt der Punkt auf der Geraden. Ein Widerspruch reicht für „liegt nicht drauf“."]],
   vids: [], links: [["Formeln", "#formeln"]],
   checks: ["Geradengleichung g: {x} = {p} + r · {u} durch zwei Punkte aufstellen", "Stützvektor {p} und Richtungsvektor {u} benennen", "Punkte auf der Geraden über r berechnen", "Punktprobe durchführen und begründen", "Eine zweite Gleichung derselben Geraden angeben"],
   groups: ["Gleichung aufstellen", "Punktprobe"],
   core: { b: [0, 1, 2, 3, 4], c: [0, 1, 2, 3] },
   ex: [
    { t: "num", g: "Gleichung aufstellen", k: true, q: "Gerade g durch P(2|4|3) und Q(3|6|2), Richtungsvektor {u} = {PQ}. Wie groß ist die dritte Koordinate von {u}?", a: -1, s: "{PQ} = {OQ} − {OP} = " + V(1, 2, -1) + ". g: {x} = " + V(2, 4, 3) + " + r · " + V(1, 2, -1) + "." },
    { t: "num", g: "Gleichung aufstellen", k: true, q: "Gleiche Gerade. Welchen Punkt erhältst du für r = 2? Gib die zweite Koordinate an.", a: 8, s: V(2, 4, 3) + " + 2 · " + V(1, 2, -1) + " = " + V(4, 8, 1) + "." },
    { t: "num", g: "Gleichung aufstellen", q: "Gleiche Gerade, r = −1. Wie groß ist die dritte Koordinate?", a: 4, s: V(2, 4, 3) + " − " + V(1, 2, -1) + " = " + V(1, 2, 4) + "." },
    { t: "mc", g: "Gleichung aufstellen", k: true, q: "Was ist bei g: {x} = {p} + r · {u} der Stützvektor?", o: ["{p} = {OP}, der Ortsvektor eines Punktes P auf der Geraden", "{u}, die Richtung der Geraden", "r, der Parameter", "Der Abstand zum Ursprung"], a: 0, s: "Der Stützvektor {p} = {OP} zeigt vom Ursprung zu einem Punkt der Geraden. {u} gibt die Richtung an, r ∈ ℝ ist eine beliebige Zahl." },
    { t: "mc", g: "Gleichung aufstellen", q: "Welche Gleichung beschreibt dieselbe Gerade wie g: {x} = " + V(2, 4, 3) + " + r · " + V(1, 2, -1) + "?", o: ["{x} = " + V(3, 6, 2) + " + s · " + V(-2, -4, 2), "{x} = " + V(3, 6, 2) + " + s · " + V(2, 4, 2), "{x} = " + V(1, 2, -1) + " + s · " + V(2, 4, 3), "{x} = " + V(2, 4, 3) + " + s · " + V(1, 2, 1)], a: 0, s: "(3|6|2) liegt auf g (r = 1), und (−2|−4|2) = −2 · (1|2|−1) ist ein Vielfaches des Richtungsvektors." },
    { t: "num", g: "Punktprobe", k: true, q: "Liegt P(5|10|0) auf g: {x} = " + V(2, 4, 3) + " + r · " + V(1, 2, -1) + "? Gib das r an.", a: 3, s: "I 5 = 2 + r → r = 3. II 10 = 4 + 2r → r = 3. III 0 = 3 − r → r = 3. Dreimal gleich, P liegt auf g." },
    { t: "mc", g: "Punktprobe", k: true, q: "Liegt B(4|8|2) auf g: {x} = " + V(2, 4, 3) + " + r · " + V(1, 2, -1) + "?", o: ["Nein: I und II geben r = 2, III gibt r = 1", "Ja, weil I und II passen", "Ja, für r = 2", "Kann man nicht sagen"], a: 0, s: "I 4 = 2 + r → r = 2. II 8 = 4 + 2r → r = 2. III 2 = 3 − r → r = 1. Widerspruch, B liegt nicht auf g." },
    { t: "mc", g: "Punktprobe", q: "Liegt A(1|2|1) auf g: {x} = " + V(2, 4, 3) + " + r · " + V(1, 2, -1) + "?", o: ["Nein: I und II geben r = −1, III gibt r = 2", "Ja, für r = −1", "Ja, für r = 2", "Ja, weil alle Koordinaten positiv sind"], a: 0, s: "I 1 = 2 + r → r = −1. II 2 = 4 + 2r → r = −1. III 1 = 3 − r → r = 2. Widerspruch." },
    { t: "num", g: "Punktprobe", q: "g: {x} = " + V(2, -1, 0) + " + r · " + V(0, 2, 1) + ", A(2|1|1). Gib das r an, für das A herauskommt.", a: 1, s: "I 2 = 2 (immer wahr). II 1 = −1 + 2r → r = 1. III 1 = 0 + r → r = 1. A liegt auf g." },
    { t: "rev", g: "Punktprobe", k: true, q: "Schreib die Punktprobe für P(5|10|0) und g: {x} = " + V(2, 4, 3) + " + r · " + V(1, 2, -1) + " sauber auf, so wie in der Arbeit.", s: "Ansatz: " + V(5, 10, 0) + " = " + V(2, 4, 3) + " + r · " + V(1, 2, -1) + ".<br>I 5 = 2 + r ⇒ r = 3<br>II 10 = 4 + 2r ⇒ r = 3<br>III 0 = 3 − r ⇒ r = 3<br>Alle drei Gleichungen liefern r = 3, also liegt P auf g." }
   ] },
 { n: 4, date: "", wd: "", title: "Lage zweier Geraden", short: "6.3 Lagebeziehungen",
   goal: "Du kannst für zwei Geraden entscheiden, ob sie identisch, parallel, schneidend oder windschief sind, und den Schnittpunkt berechnen.",
   blocks: [
    ["10", "skript", "<b>Die vier Fälle.</b> Bild und Merkmale."],
    ["10", "skript", "<b>Entscheidungsbaum.</b> Erst {u} und {v} vergleichen, dann Punktprobe oder LGS."],
    ["20", "skript", "<b>Schnittpunkt berechnen.</b> LGS aus zwei Zeilen nach r und s lösen, mit der dritten prüfen, einsetzen."],
    ["25", "ueben", "<b>Übungen</b> unten."],
    ["5", "test", "<b>Selbsttest.</b> Den Entscheidungsbaum ohne Vorlage aufmalen."]
   ],
   notes: [["tip", "So gibt es Punkte", "Immer zuerst hinschreiben, ob {u} und {v} Vielfache voneinander sind. Am Ende ein Satz wie „Die Geraden schneiden sich im Punkt S(3|2|2).“"]],
   vids: [], links: [["Formeln", "#formeln"]],
   checks: ["Die vier Lagen zweier Geraden nennen und erklären", "Den Entscheidungsbaum anwenden", "Bei kollinearen {u} und {v} zwischen identisch und parallel unterscheiden", "Mit einem LGS in r und s den Schnittpunkt berechnen", "Windschief erkennen und begründen"],
   groups: ["Gleiche Richtung", "Verschiedene Richtung"],
   core: { b: [0, 1, 2, 3, 4], c: [0, 1, 2, 3, 4] },
   ex: [
    { t: "mc", g: "Gleiche Richtung", k: true, q: "g: {x} = " + V(1, 2, 3) + " + r · " + V(2, 4, 1) + ", h: {x} = " + V(3, 6, 4) + " + s · " + V(4, 8, 2) + ". Wie liegen sie?", o: ["Identisch", "Parallel", "Schneidend", "Windschief"], a: 0, s: "{v} = (4|8|2) = 2 · (2|4|1) = 2 · {u}, also gleiche Richtung. Punktprobe (3|6|4) auf g: I 3 = 1 + 2r → r = 1, II 6 = 2 + 4r → r = 1, III 4 = 3 + r → r = 1. Liegt drauf, also identisch." },
    { t: "mc", g: "Gleiche Richtung", k: true, q: "g: {x} = " + V(1, 2, 3) + " + r · " + V(2, 4, 1) + ", h: {x} = " + V(3, 6, 5) + " + s · " + V(4, 8, 2) + ". Wie liegen sie?", o: ["Parallel", "Identisch", "Schneidend", "Windschief"], a: 0, s: "Gleiche Richtung. Punktprobe (3|6|5): I und II geben r = 1, III 5 = 3 + r → r = 2. Widerspruch, also parallel." },
    { t: "num", g: "Gleiche Richtung", q: "Gleiche Geraden wie eben. Welches k gilt in {v} = k · {u}, also " + V(4, 8, 2) + " = k · " + V(2, 4, 1) + "?", a: 2, s: "4 = 2k, 8 = 4k, 2 = k: überall k = 2." },
    { t: "num", g: "Verschiedene Richtung", k: true, q: "g: {x} = " + V(1, 2, 0) + " + r · " + V(1, 0, 1) + ", h: {x} = " + V(4, 1, 1) + " + s · " + V(-1, 1, 1) + ". Löse das LGS. Wie groß ist s?", a: 1, s: "I 1 + r = 4 − s. II 2 = 1 + s → s = 1. III r = 1 + s → r = 2. Probe mit I: 3 = 3, stimmt." },
    { t: "num", g: "Verschiedene Richtung", k: true, q: "Gleiche Geraden. Wie groß ist die erste Koordinate des Schnittpunkts S?", a: 3, s: "r = 2 in g: (1|2|0) + 2 · (1|0|1) = (3|2|2)." },
    { t: "mc", g: "Verschiedene Richtung", k: true, q: "g: {x} = " + V(1, 2, 0) + " + r · " + V(1, 0, 1) + ", h: {x} = " + V(4, 1, 2) + " + s · " + V(-1, 1, 1) + ". Wie liegen sie?", o: ["Windschief", "Schneidend", "Parallel", "Identisch"], a: 0, s: "Keine Vielfachen. II 2 = 1 + s → s = 1. III r = 2 + s → r = 3. Probe I: 1 + 3 = 4 − 1, also 4 = 3, falsch. Kein Schnittpunkt und nicht parallel: windschief." },
    { t: "num", g: "Verschiedene Richtung", k: true, q: "g: {x} = " + V(0, 1, 2) + " + r · " + V(2, 1, 0) + ", h: {x} = " + V(4, 0, 5) + " + s · " + V(0, 1, -1) + ". Wie groß ist r?", a: 2, s: "I 2r = 4 → r = 2. II 1 + r = s → s = 3. III 2 = 5 − s → s = 3. Passt." },
    { t: "num", g: "Verschiedene Richtung", q: "Gleiche Geraden. Wie groß ist die zweite Koordinate des Schnittpunkts?", a: 3, s: "r = 2 in g: (4|3|2)." },
    { t: "num", g: "Verschiedene Richtung", q: "Aufgabe aus dem Buch (S. 229/2a): g: {x} = " + V(1, 7, 9) + " + r · " + V(0, 1, 2) + ", h: {x} = " + V(3, 5, 5) + " + s · " + V(1, 1, 2) + ". Zweite Koordinate des Schnittpunkts?", a: 3, s: "I 1 = 3 + s → s = −2. II 7 + r = 5 + s → r = −4. III 9 + 2r = 5 + 2s → 1 = 1, stimmt. S = (1|3|1)." },
    { t: "mc", g: "Verschiedene Richtung", q: "Zwei Zeilen des LGS haben eine Lösung, aber die Probe mit der dritten ergibt eine falsche Aussage. {u} und {v} sind keine Vielfachen. Was heißt das?", o: ["Die Geraden sind windschief", "Die Geraden schneiden sich", "Die Geraden sind parallel", "Man hat sich verrechnet"], a: 0, s: "Keine gemeinsame Lösung aller drei Gleichungen heißt kein Schnittpunkt. Bei verschiedenen Richtungen ist das windschief." },
    { t: "rev", g: "Verschiedene Richtung", k: true, q: "Zeichne den Entscheidungsbaum für die Lage zweier Geraden g: {x} = {p} + r · {u} und h: {x} = {q} + s · {v}.", s: "1. Sind {u} und {v} Vielfache voneinander (kollinear)?<br>Ja → Punktprobe: Liegt der Stützpunkt Q von h auf g? Ja → identisch, nein → parallel.<br>Nein → LGS g = h: Gibt es eine Lösung (auch Probe mit der dritten Zeile)? Ja → schneiden sich (Schnittpunkt durch Einsetzen), nein → windschief." }
   ] },
 { n: 5, date: "", wd: "", title: "Winkel und Abstand", short: "6.4 und 6.5",
   goal: "Du kannst den Schnittwinkel α einer Geraden mit einer Koordinatenebene und den Abstand d eines Punktes von einer Geraden mit dem Lotfußpunkt berechnen.",
   blocks: [
    ["15", "skript", "<b>Schnittwinkel mit Koordinatenebene.</b> Unterrichtsweg mit {u'} und Kontrolle mit der Merkhilfe-Formel sin(α)."],
    ["25", "skript", "<b>Abstand Punkt–Gerade.</b> Die vier Schritte mit Lotfußpunkt."],
    ["10", "skript", "<b>Abstand paralleler Geraden.</b> Einen Punkt nehmen, Abstand zur anderen Geraden."],
    ["25", "ueben", "<b>Übungen</b> unten."],
    ["5", "test", "<b>Selbsttest.</b> Die vier Schritte für den Abstand auswendig aufsagen."]
   ],
   notes: [["warn", "Fehler im Heft bei 6.5", "Im Beispiel Q(3|−2|5) steht d ≈ 5,2. Dort wurde r in {QX} eingesetzt (das ist schon der Vektor von Q zu F) und dann nochmal Q abgezogen. Richtig ist {QF} = (−4/7 | 1/7 | 2/7) und d = √21/7 ≈ 0,65."], ["tip", "Merkhilfe Seite 11", "Dort steht für Gerade und Ebene sin(α) = |{u} · {n}| / (|{u}| · |{n}|). Für die Koordinatenebenen ist {n} einfach ein Achsenvektor, z. B. {n} = (0|0|1) für die x₁x₂-Ebene. Damit kannst du jeden Winkel aus dem Unterricht in Sekunden kontrollieren."]],
   vids: [], links: [["Formeln", "#formeln"]],
   checks: ["Den Schnittwinkel α einer Geraden mit jeder Koordinatenebene berechnen", "Wissen, welche Koordinate bei welcher Ebene 0 wird bzw. welches {n} dazugehört", "Den Lotfußpunkt mit {QX} · {u} = 0 bestimmen", "Den Abstand d Punkt–Gerade berechnen", "Den Abstand paralleler Geraden auf Punkt–Gerade zurückführen"],
   groups: ["Winkel mit Koordinatenebene", "Abstand Punkt–Gerade"],
   core: { b: [0, 1, 3, 4], c: [0, 1, 2, 3] },
   ex: [
    { t: "num", g: "Winkel mit Koordinatenebene", k: true, q: "g: {x} = " + V(-2, 1, 6) + " + r · " + V(2, 1, -3) + ". Schnittwinkel α mit der x₁x₂-Ebene in Grad? (eine Nachkommastelle)", a: 53.3, s: "x₁x₂-Ebene: x₃ = 0, also {u'} = (2|1|0). cos(α) = |4 + 1 + 0| / (√14 · √5) = 5/√70 ≈ 0,598. α ≈ 53,3°.<br>Kontrolle Merkhilfe: {n} = (0|0|1), sin(α) = |−3| / √14 ≈ 0,802, α ≈ 53,3°." },
    { t: "num", g: "Winkel mit Koordinatenebene", k: true, q: "Gleiche Gerade. Schnittwinkel α mit der x₁x₃-Ebene? (eine Nachkommastelle)", a: 15.5, s: "x₁x₃-Ebene: x₂ = 0, {u'} = (2|0|−3). cos(α) = 13/(√14 · √13) ≈ 0,964. α ≈ 15,5°.<br>Kontrolle: {n} = (0|1|0), sin(α) = 1/√14 ≈ 0,267, α ≈ 15,5°." },
    { t: "num", g: "Winkel mit Koordinatenebene", k: true, q: "Richtungsvektor {u} = " + V(1, 1, 1) + ". Schnittwinkel α mit der x₁x₂-Ebene? (eine Nachkommastelle)", a: 35.3, s: "{u'} = (1|1|0). cos(α) = 2/(√3 · √2) ≈ 0,816. α ≈ 35,3°.<br>Kontrolle: sin(α) = 1/√3 ≈ 0,577, α ≈ 35,3°." },
    { t: "num", g: "Winkel mit Koordinatenebene", q: "Richtungsvektor {u} = " + V(0, 3, 4) + ". Schnittwinkel α mit der x₁x₂-Ebene? (eine Nachkommastelle)", a: 53.1, s: "{u'} = (0|3|0). cos(α) = 9/(5 · 3) = 0,6. α ≈ 53,1°.<br>Kontrolle: sin(α) = 4/5 = 0,8, α ≈ 53,1°." },
    { t: "mc", g: "Winkel mit Koordinatenebene", k: true, q: "Welche Koordinate setzt du im Richtungsvektor auf 0, wenn der Winkel mit der x₂x₃-Ebene gesucht ist?", o: ["x₁", "x₂", "x₃", "Keine"], a: 0, s: "Die x₂x₃-Ebene ist die Ebene mit x₁ = 0. Ihr Normalenvektor ist {n} = (1|0|0)." },
    { t: "mc", g: "Winkel mit Koordinatenebene", q: "Der Richtungsvektor ist {u} = " + V(3, -1, 0) + ". Welchen Winkel α hat die Gerade mit der x₁x₂-Ebene?", o: ["0°, sie verläuft parallel dazu", "90°", "45°", "Kann man nicht sagen"], a: 0, s: "x₃ ist schon 0, also ist {u'} = {u} und cos(α) = 1, α = 0°. Mit der Merkhilfe: {u} · {n} = 0, also sin(α) = 0." },
    { t: "num", g: "Abstand Punkt–Gerade", k: true, q: "Q(5|1|4), g: {x} = " + V(1, 0, 2) + " + r · " + V(1, 1, 0) + ". Bestimme r für den Lotfußpunkt.", a: 2.5, s: "{QX} = (r − 4 | r − 1 | −2). {QX} · {u} = (r − 4) + (r − 1) + 0 = 2r − 5 = 0, also r = 2,5." },
    { t: "num", g: "Abstand Punkt–Gerade", k: true, q: "Gleiche Aufgabe. Wie groß ist der Abstand d? (zwei Nachkommastellen)", a: 2.92, s: "F(3,5|2,5|2). {QF} = (−1,5|1,5|−2). d = |{QF}| = √(2,25 + 2,25 + 4) = √8,5 ≈ 2,92." },
    { t: "num", g: "Abstand Punkt–Gerade", q: "Beispiel aus dem Unterricht, richtig gerechnet: Q(3|−2|5), g: {x} = " + V(1, 1, 1) + " + r · " + V(1, -2, 3) + ". Abstand d? (zwei Nachkommastellen)", a: 0.65, s: "{QX} = (r − 2 | 3 − 2r | 3r − 4). {QX} · {u} = 14r − 20 = 0 → r = 10/7. {QF} = (−4/7 | 1/7 | 2/7), d = √21/7 ≈ 0,65." },
    { t: "num", g: "Abstand Punkt–Gerade", k: true, q: "Q(6|1|3), g: {x} = " + V(1, 0, 2) + " + r · " + V(2, 1, -2) + ". Abstand d? (zwei Nachkommastellen)", a: 4.24, s: "{QX} = (2r − 5 | r − 1 | −1 − 2r). {QX} · {u} = 9r − 9 = 0 → r = 1, F(3|1|0). {QF} = (−3|0|−3), d = √18 ≈ 4,24." },
    { t: "mc", g: "Abstand Punkt–Gerade", k: true, q: "Warum gilt beim Lotfußpunkt F die Bedingung {QF} · {u} = 0?", o: ["Weil der kürzeste Weg senkrecht auf der Geraden steht", "Weil F auf der Geraden liegt", "Weil Q der Ursprung ist", "Weil der Abstand 0 sein soll"], a: 0, s: "Der kürzeste Weg von Q zur Geraden ist das Lot. {QF} ⊥ {u} ⇔ {QF} · {u} = 0." },
    { t: "rev", g: "Abstand Punkt–Gerade", q: "Wie bestimmst du den Abstand zweier paralleler Geraden g und h?", s: "Einen Punkt von h nehmen, zum Beispiel den Stützpunkt Q mit {OQ} = {q}, und dessen Abstand zur Geraden g mit dem Lotfußpunkt-Verfahren berechnen. Bei parallelen Geraden ist der Abstand überall gleich." }
   ] },
 { n: 6, date: "", wd: "", title: "Modellieren mit Geraden", short: "6.6 Anwendungen",
   goal: "Du kannst Sachaufgaben (Schatten, Flugbahn, U-Boot, Körper) mit Geraden lösen: Spurpunkt, Weglänge und Volumen.",
   blocks: [
    ["15", "skript", "<b>Spurpunkt.</b> Wo trifft eine Gerade eine Koordinatenebene?"],
    ["15", "skript", "<b>Schatten.</b> Lichtstrahl als Gerade, Schattenpunkt als Spurpunkt."],
    ["10", "skript", "<b>Längen und Volumen.</b> Strecke = Betrag, Pyramide V = ⅓ · G · h."],
    ["25", "ueben", "<b>Übungen</b> unten."],
    ["5", "test", "<b>Selbsttest.</b> Erklären, warum der Schattenpunkt ein Spurpunkt ist."]
   ],
   notes: [["tip", "Sachaufgaben", "Erst den Text in Mathe übersetzen: Was ist der Punkt (Stützvektor {p}), was die Richtung ({u}), welche Ebene ist der Boden oder die Wasseroberfläche? Danach ist es eine normale Spurpunkt-Aufgabe."]],
   vids: [], links: [["Zur Probeklausur", "#klausur"]],
   checks: ["Den Spurpunkt einer Geraden mit einer Koordinatenebene berechnen", "Den Schatten eines Punktes bei parallelem Licht berechnen", "Den Schatten bei einer punktförmigen Lichtquelle berechnen", "Weglängen über den Betrag berechnen", "Das Volumen einer Pyramide berechnen"],
   groups: ["Spurpunkt und Schatten", "Länge und Volumen"],
   core: { b: [0, 1, 2, 3, 4], c: [0, 1, 3, 4] },
   ex: [
    { t: "num", g: "Spurpunkt und Schatten", k: true, q: "g: {x} = " + V(2, 4, 3) + " + r · " + V(1, 2, -1) + ". In welchem Punkt trifft g die x₁x₂-Ebene? Gib die zweite Koordinate an.", a: 10, s: "x₃ = 0: 3 − r = 0 → r = 3. Einsetzen: (5|10|0)." },
    { t: "num", g: "Spurpunkt und Schatten", k: true, q: "Aus dem Unterricht: Spitze S(2|2|6), Licht in Richtung " + V(2, 4, -3) + ". Schattenpunkt auf der x₁x₂-Ebene, erste Koordinate?", a: 6, s: "Lichtgerade {x} = (2|2|6) + r · (2|4|−3). x₃ = 0: 6 − 3r = 0 → r = 2. S'(6|10|0)." },
    { t: "num", g: "Spurpunkt und Schatten", k: true, q: "Punkt S(1|2|4), Licht in Richtung " + V(1, 1, -2) + ". Schattenpunkt auf dem Boden (x₁x₂-Ebene), erste Koordinate?", a: 3, s: "4 − 2r = 0 → r = 2. S'(3|4|0)." },
    { t: "num", g: "Spurpunkt und Schatten", q: "Lampe im Punkt P(0|12|2), Ecke G(5|8|4). Der Schatten fällt auf die Wand x₂ = 0. Bei welchem r trifft der Strahl {x} = {OP} + r · {PG} die Wand?", a: 3, s: "{PG} = (5|−4|2). x₂ = 0: 12 − 4r = 0 → r = 3. Schatten (15|0|8)." },
    { t: "num", g: "Spurpunkt und Schatten", k: true, q: "U-Boot in A(10|20|−30), Richtung pro Minute {u} = " + V(-2, -4, 3) + ", Wasseroberfläche x₃ = 0. Nach wie vielen Minuten taucht es auf?", a: 10, s: "{x} = (10|20|−30) + r · (−2|−4|3). −30 + 3r = 0 → r = 10, also nach 10 Minuten. Auftauchpunkt (−10|−20|0)." },
    { t: "num", g: "Länge und Volumen", k: true, q: "Gleiches U-Boot. Wie lang ist der Weg bis zum Auftauchpunkt? (zwei Nachkommastellen)", a: 53.85, s: "Weg = 10 · |{u}| = 10 · √(4 + 16 + 9) = 10 · √29 ≈ 53,85." },
    { t: "num", g: "Länge und Volumen", q: "Drohne startet in A(2|1|0) und fliegt pro Minute um {u} = " + V(3, 4, 1) + ". Wie viele Einheiten ist sie geflogen, wenn sie die Höhe x₃ = 5 erreicht? (zwei Nachkommastellen)", a: 25.5, s: "x₃ = r = 5. Weg = 5 · |{u}| = 5 · √(9 + 16 + 1) = 5 · √26 ≈ 25,50." },
    { t: "num", g: "Länge und Volumen", k: true, q: "Pyramide mit quadratischer Grundfläche A(0|0|0), B(4|0|0), C(4|4|0), D(0|4|0) und Spitze S(2|2|6). Volumen?", a: 32, s: "G = |{AB}| · |{AD}| = 4 · 4 = 16. h = 6 (x₃ der Spitze). V = ⅓ · 16 · 6 = 32." },
    { t: "num", g: "Länge und Volumen", q: "Pyramide mit rechteckiger Grundfläche 3 × 5 in der x₁x₂-Ebene und Spitze in Höhe 6. Volumen?", a: 30, s: "V = ⅓ · 15 · 6 = 30." },
    { t: "num", g: "Länge und Volumen", k: true, q: "B(5|2|0). Wie weit ist B von der x₁x₃-Ebene entfernt?", a: 2, s: "Der Abstand zur x₁x₃-Ebene ist der Betrag von x₂, also 2." },
    { t: "rev", g: "Länge und Volumen", k: true, q: "Schreib das Rezept für eine Schattenaufgabe bei parallelem Licht auf.", s: "1. Lichtgerade {x} = {p} + r · {u} aufstellen: Punkt des Gegenstands als Stützvektor {p}, Lichtrichtung als Richtungsvektor {u}.<br>2. Ebene des Schattens festlegen, z. B. Boden x₃ = 0.<br>3. Passende Koordinate der Geraden gleich 0 setzen, r ausrechnen.<br>4. r einsetzen, das ist der Schattenpunkt.<br>Bei einer Lampe als Punkt P: Gerade {x} = {OP} + r · {PG} durch Lampe und Gegenstandspunkt G." }
   ] }
]);

export const MAT_LESSONS: Record<number, Lesson[]> = deep<Record<number, Lesson[]>>({
 1: [
  { t: "Das Koordinatensystem im Raum", g: "Punkte und Ebenen", k: true, h:
   "<p>Im Raum gibt es drei Achsen: <b>x₁</b> kommt schräg auf dich zu, <b>x₂</b> geht nach rechts, <b>x₃</b> nach oben. Ein Punkt hat drei Koordinaten, zum Beispiel P(2|3|4).</p>" + svgAxes() +
   TAB(["Ebene", "Bedingung", "Beispiel"], [["x₁x₂-Ebene (Boden)", "x₃ = 0", "(3|−1|0)"], ["x₁x₃-Ebene", "x₂ = 0", "(3|0|−1)"], ["x₂x₃-Ebene", "x₁ = 0", "(0|−1|3)"]]) +
   LK("Die Ebene heißt nach den zwei Achsen, die drin liegen. Die fehlende Koordinate ist 0.") },
  { t: "Vektoren und Verbindungsvektor", g: "Vektoren rechnen", k: true, h:
   "<p>Ein Vektor ist ein Pfeil mit Richtung und Länge. Man schreibt ihn mit Pfeil, also {a}, und als Spalte " + V("a₁", "a₂", "a₃") + ", z. B. " + V(3, -2, 2) + ".</p>" +
   "<p>Der <b>Ortsvektor</b> {OA} geht vom Ursprung O zum Punkt A und hat dieselben Zahlen wie A.</p>" +
   LF("{AB} = {OB} − {OA} = " + V("b₁ − a₁", "b₂ − a₂", "b₃ − a₃") + " &nbsp;&nbsp; (Spitze minus Fuß)") +
   LX("<p>A(1|2|3), B(4|0|5): {AB} = " + V("4 − 1", "0 − 2", "5 − 3") + " = " + V(3, -2, 2) + "</p>") },
  { t: "Mit Vektoren rechnen", g: "Vektoren rechnen", k: true, h:
   "<p>Alles geht Zeile für Zeile:</p><ul><li><b>Addieren:</b> " + V(1, 2, 3) + " + " + V(4, 0, -1) + " = " + V(5, 2, 2) + "</li><li><b>Mit Zahl malnehmen:</b> 3 · " + V(1, -2, 0) + " = " + V(3, -6, 0) + "</li><li><b>Mittelpunkt M einer Strecke AB</b> (Merkhilfe): {OM} = ½({OA} + {OB})</li></ul>" +
   LX("<p>Quader mit A(1|2|0), B(5|2|0), D(1|8|0): {OC} = {OB} + {AD} = " + V(5, 2, 0) + " + " + V(0, 6, 0) + " = " + V(5, 8, 0) + ", also C(5|8|0). Die Kante {AD} wird an B angehängt.</p>") },
  { t: "LGS mit drei Gleichungen und zwei Unbekannten", g: "LGS", k: true, h:
   "<p>Bei Punktprobe und Lagebeziehung entstehen drei Gleichungen (eine pro Koordinate), aber nur die Unbekannten r und s.</p><ol><li>Zwei Gleichungen nehmen und r und s ausrechnen.</li><li>Mit der dritten Gleichung die <b>Probe</b> machen.</li><li>Wahre Aussage (z. B. 2 = 2): Lösung passt. Falsche Aussage (z. B. 4 = 3): keine gemeinsame Lösung.</li></ol>" +
   LX("<p>I r − s = 2, II r + s = 6, III 2r − 3s = 2</p><p>I + II: 2r = 8 → r = 4, s = 2. Probe III: 8 − 6 = 2, stimmt.</p>") +
   LK("Ohne Probe mit der dritten Gleichung ist die Rechnung nicht fertig.") },
  { t: "Taschenrechner für morgen", g: "Taschenrechner", k: true, h:
   "<ul><li>Modus <b>DEG</b> für Winkel in Grad. Prüfe: arccos(0,5) muss 60 ergeben.</li><li>arccos ist SHIFT + cos, arcsin ist SHIFT + sin.</li><li>Wurzel aus der ganzen Summe: √(4 + 1 + 4), nicht √4 + 1 + 4.</li><li>Negative Zahlen beim Quadrieren in Klammern: (−1)² = 1.</li></ul>" }
 ],
 2: [
  { t: "Betrag und Länge einer Strecke", g: "Länge und Abstand", k: true, h:
   LF("Betrag: |{a}| = √(a₁² + a₂² + a₃²)") +
   LF("Länge der Strecke AB: |{AB}| = √((b₁ − a₁)² + (b₂ − a₂)² + (b₃ − a₃)²)") +
   LX("<p>A(3|−5|1), B(7|2|1): {AB} = " + V(4, 7, 0) + ", |{AB}| = √(16 + 49 + 0) = √65 ≈ 8,06</p>") +
   "<p>Steht auch in der Merkhilfe: der <b>Einheitsvektor</b> {a₀} = {a} / |{a}| hat dieselbe Richtung wie {a} und die Länge 1.</p>" +
   LK("Im gezeichneten 3D-Bild kann man keine Längen ablesen, weil die x₁-Achse verzerrt ist. Immer rechnen.") },
  { t: "Das Skalarprodukt", g: "Skalarprodukt und Winkel", k: true, h:
   "<p>Zeilen malnehmen, alles addieren. Heraus kommt <b>eine Zahl</b>, kein Vektor.</p>" +
   LF("{a} · {b} = " + V("a₁", "a₂", "a₃") + " · " + V("b₁", "b₂", "b₃") + " = a₁b₁ + a₂b₂ + a₃b₃") +
   LX("<p>" + V(2, 6, 4) + " · " + V(4, 4, 6) + " = 8 + 24 + 24 = 56</p>") },
  { t: "Winkel φ zwischen zwei Vektoren", g: "Skalarprodukt und Winkel", k: true, h:
   LF("cos(φ) = ({a} · {b}) / (|{a}| · |{b}|) &nbsp;&nbsp; 0° ≤ φ ≤ 180°") +
   LX("<p>{a} = " + V(1, 2) + ", {b} = " + V(3, 1) + " (Beispiel aus dem Unterricht)</p><ol><li>{a} · {b} = 3 + 2 = 5</li><li>|{a}| = √5, |{b}| = √10</li><li>φ = arccos(5/(√5 · √10)) = 45°</li></ol>") +
   LK("In der Merkhilfe heißt der Winkel zwischen zwei Vektoren φ. Taschenrechner auf DEG.") },
  { t: "Orthogonal und kollinear", g: "Orthogonal und kollinear", k: true, h:
   "<p><b>Orthogonalität</b> (Merkhilfe): {a} ⊥ {b} ⇔ {a} · {b} = 0, weil cos(90°) = 0.</p>" +
   LX("<p>" + V(-2, 1, -2) + " · " + V(3, 8, 1) + " = −6 + 8 − 2 = 0, also senkrecht.</p>") +
   "<p><b>Kollinear</b> (Vielfache voneinander, gleiche oder entgegengesetzte Richtung): {a} = c · {b} mit <b>demselben c in allen drei Zeilen</b>.</p>" +
   LX("<p>" + V(2, -1, 4) + " = c · " + V(4, -2, 8) + ": I c = ½, II c = ½, III c = ½. Kollinear.</p>") +
   LK("Orthogonal: Skalarprodukt 0. Kollinear: überall dasselbe c.") }
 ],
 3: [
  { t: "Die Parametergleichung einer Geraden", g: "Gleichung aufstellen", k: true, h:
   LF("g: {x} = {p} + r · {u} &nbsp;&nbsp; mit r ∈ ℝ") +
   TAB(["Teil", "Bedeutung"], [["{p} = {OP} (Stützvektor)", "Ortsvektor eines Punktes P auf der Geraden"], ["{u} (Richtungsvektor)", "Richtung der Geraden"], ["r (Parameter)", "beliebige Zahl, jedes r ergibt einen Punkt"]]) +
   LX("<p>Gerade durch P(2|4|3) und Q(3|6|2): {u} = {PQ} = " + V(1, 2, -1) + "</p><p>g: {x} = " + V(2, 4, 3) + " + r · " + V(1, 2, -1) + "</p>") +
   LK("Durch zwei Punkte A und B: g: {x} = {OA} + r · {AB}. Eine zweite Gerade heißt in der Merkhilfe h: {x} = {q} + s · {v}.") },
  { t: "Punkte auf der Geraden", g: "Gleichung aufstellen", h:
   "<p>Setz eine Zahl für r ein. r = 0 gibt den Stützpunkt, r = 1 den zweiten Punkt, r = 2 noch einen Schritt weiter.</p>" +
   LX("<p>r = 2: " + V(2, 4, 3) + " + 2 · " + V(1, 2, -1) + " = (4|8|1)</p>") +
   "<p>Eine Gerade hat viele Gleichungen: Jeder Punkt auf ihr kann Stützpunkt sein, jedes Vielfache von {u} Richtungsvektor.</p>" },
  { t: "Die Punktprobe", g: "Punktprobe", k: true, h:
   "<p>Frage: Liegt ein Punkt auf der Geraden? Setz den Punkt gleich die Gerade und rechne jede Zeile nach r aus.</p>" +
   LX("<p>Liegt B(4|8|2) auf g: {x} = " + V(2, 4, 3) + " + r · " + V(1, 2, -1) + "?</p><p>I 4 = 2 + r → r = 2<br>II 8 = 4 + 2r → r = 2<br>III 2 = 3 − r → r = 1</p><p>Verschiedene r, also liegt B <b>nicht</b> auf g.</p>") +
   LK("Dreimal dasselbe r: Punkt liegt drauf. Sonst nicht.") }
 ],
 4: [
  { t: "Die vier möglichen Lagen", g: "Gleiche Richtung", k: true, h:
   "<p>g: {x} = {p} + r · {u} und h: {x} = {q} + s · {v}, so wie in der Merkhilfe.</p>" + svgLines() +
   TAB(["Lage", "{u} und {v}", "gemeinsame Punkte"], [["identisch", "Vielfache (kollinear)", "unendlich viele"], ["parallel", "Vielfache (kollinear)", "keine"], ["schneidend", "keine Vielfachen", "genau einer"], ["windschief", "keine Vielfachen", "keine"]]) +
   LK("Windschief gibt es nur im Raum: Die Geraden laufen aneinander vorbei, wie eine Brücke über eine Straße.") },
  { t: "Der Entscheidungsbaum", g: "Verschiedene Richtung", k: true, h:
   "<ol><li><b>Sind {u} und {v} Vielfache voneinander?</b></li><li>Ja → <b>Punktprobe</b>: Liegt der Stützpunkt Q von h auf g? Ja → identisch. Nein → parallel.</li><li>Nein → <b>LGS</b> g = h nach r und s lösen. Lösbar (auch Probe mit der dritten Zeile) → schneiden, Schnittpunkt durch Einsetzen. Nicht lösbar → windschief.</li></ol>" },
  { t: "Schnittpunkt berechnen", g: "Verschiedene Richtung", k: true, h:
   LX("<p>g: {x} = " + V(1, 2, 0) + " + r · " + V(1, 0, 1) + ", h: {x} = " + V(4, 1, 1) + " + s · " + V(-1, 1, 1) + "</p><ol><li>Keine Vielfachen (I: 1 = −c, II: 0 = c, Widerspruch).</li><li>LGS: I 1 + r = 4 − s, II 2 = 1 + s, III r = 1 + s</li><li>II: s = 1. III: r = 2. Probe I: 3 = 3, stimmt.</li><li>r = 2 in g: S(3|2|2).</li></ol>") +
   LK("Zum Schluss den Schnittpunkt mit r in g <b>und</b> zur Kontrolle mit s in h ausrechnen. Beides muss gleich sein.") },
  { t: "Windschief erkennen", g: "Verschiedene Richtung", h:
   LX("<p>g: {x} = " + V(1, 2, 0) + " + r · " + V(1, 0, 1) + ", h: {x} = " + V(4, 1, 2) + " + s · " + V(-1, 1, 1) + "</p><p>II: 2 = 1 + s → s = 1. III: r = 2 + s → r = 3. Probe I: 1 + 3 = 4 − 1, also 4 = 3, falsch.</p><p>Keine Vielfachen und kein Schnittpunkt: windschief.</p>") }
 ],
 5: [
  { t: "Schnittwinkel mit einer Koordinatenebene", g: "Winkel mit Koordinatenebene", k: true, h:
   "<p>Methode aus dem Unterricht: Man nimmt den Richtungsvektor {u} und eine Kopie {u'}, bei der die Koordinate der Ebene auf 0 gesetzt ist. Das ist die Richtung des „Schattens“ der Geraden in der Ebene.</p>" +
   LF("cos(α) = |{u} · {u'}| / (|{u}| · |{u'}|)") +
   "<p>In der <b>Merkhilfe</b> steht dafür die Formel mit dem Normalenvektor {n} der Ebene. Beide Wege geben denselben Winkel α:</p>" +
   LF("sin(α) = |{u} · {n}| / (|{u}| · |{n}|) &nbsp;&nbsp; 0° ≤ α ≤ 90°") +
   TAB(["Ebene", "auf 0 setzen", "{n}"], [["x₁x₂", "x₃", "(0|0|1)"], ["x₁x₃", "x₂", "(0|1|0)"], ["x₂x₃", "x₁", "(1|0|0)"]]) +
   LX("<p>{u} = " + V(2, 1, -3) + ", x₁x₂-Ebene: {u'} = " + V(2, 1, 0) + "</p><p>cos(α) = |4 + 1 + 0| / (√14 · √5) = 5/√70 ≈ 0,598 → α ≈ 53,3°</p><p>Kontrolle: sin(α) = |−3| / (√14 · 1) ≈ 0,802 → α ≈ 53,3°</p>") +
   LK("Der Betrag im Zähler sorgt dafür, dass α zwischen 0° und 90° liegt. Bei sin also SHIFT sin, bei cos SHIFT cos.") },
  { t: "Abstand eines Punktes von einer Geraden", g: "Abstand Punkt–Gerade", k: true, h:
   svgLot() +
   "<p>Der Abstand d ist die Länge des Lots von Q auf g. Der Punkt, wo das Lot die Gerade trifft, heißt <b>Lotfußpunkt F</b>.</p><ol><li>Allgemeiner Punkt X der Geraden: {OX} = {p} + r · {u}</li><li>Verbindungsvektor {QX} = {OX} − {OQ} (enthält r)</li><li>Bedingung {QX} · {u} = 0 → r ausrechnen</li><li>r in {QX} einsetzen, das ist {QF}. Abstand d = |{QF}|</li></ol>" +
   LX("<p>Q(5|1|4), g: {x} = " + V(1, 0, 2) + " + r · " + V(1, 1, 0) + "</p><ol><li>{QX} = " + V("1 + r − 5", "r − 1", "2 − 4") + " = " + V("r − 4", "r − 1", -2) + "</li><li>{QX} · {u} = (r − 4) + (r − 1) + 0 = 2r − 5 = 0 → r = 2,5</li><li>{QF} = " + V("−1,5", "1,5", -2) + ", F(3,5|2,5|2)</li><li>d = √(2,25 + 2,25 + 4) = √8,5 ≈ 2,92</li></ol>") +
   LK("Nach dem Einsetzen von r in {QX} hast du schon den Vektor {QF}. Nicht nochmal Q abziehen.") },
  { t: "Abstand paralleler Geraden", g: "Abstand Punkt–Gerade", h:
   "<p>Bei parallelen Geraden ist der Abstand überall gleich. Nimm den Stützpunkt Q von h ({OQ} = {q}) und berechne wie oben seinen Abstand zu g.</p>" }
 ],
 6: [
  { t: "Spurpunkte", g: "Spurpunkt und Schatten", k: true, h:
   "<p>Ein Spurpunkt ist der Punkt, an dem eine Gerade eine Koordinatenebene trifft.</p><ol><li>Koordinate der Ebene in der Geradengleichung gleich 0 setzen.</li><li>r ausrechnen.</li><li>r einsetzen.</li></ol>" +
   LX("<p>g: {x} = " + V(2, 4, 3) + " + r · " + V(1, 2, -1) + ", Spurpunkt mit der x₁x₂-Ebene: 3 − r = 0 → r = 3 → (5|10|0)</p>") },
  { t: "Schattenwurf", g: "Spurpunkt und Schatten", k: true, h:
   "<p><b>Paralleles Licht (Sonne):</b> Lichtgerade durch den Punkt des Gegenstands mit der Lichtrichtung als Richtungsvektor {u}. Der Schatten ist der Spurpunkt mit dem Boden.</p>" +
   LX("<p>Aus dem Unterricht: Spitze S(2|2|6), Licht " + V(2, 4, -3) + "</p><p>g: {x} = " + V(2, 2, 6) + " + r · " + V(2, 4, -3) + ". x₃ = 0: 6 − 3r = 0 → r = 2. S'(6|10|0)</p>") +
   "<p><b>Lampe als Punkt P:</b> Gerade {x} = {OP} + r · {PG} durch P und den Gegenstandspunkt G. Danach wieder Spurpunkt mit der Wand oder dem Boden.</p>" +
   LK("Schattenpunkt = Spurpunkt der Lichtgeraden.") },
  { t: "Weglängen, Zeiten und Volumen", g: "Länge und Volumen", k: true, h:
   "<ul><li><b>Weglänge</b> von A nach P: |{AP}|. Bewegt sich etwas pro Minute um {u}, ist der Weg nach r Minuten r · |{u}|.</li><li><b>Abstand zu einer Koordinatenebene:</b> der Betrag der fehlenden Koordinate. B(5|2|0) hat zur x₁x₃-Ebene den Abstand 2.</li><li><b>Pyramide:</b> V = ⅓ · G · h. Liegt die Grundfläche im Boden, ist h die x₃-Koordinate der Spitze.</li><li><b>Quader:</b> V = Länge · Breite · Höhe, die Kanten als Beträge.</li></ul>" +
   LX("<p>U-Boot in A(10|20|−30), pro Minute {u} = " + V(-2, -4, 3) + ". Auftauchen: −30 + 3r = 0 → r = 10. Punkt (−10|−20|0). Weg: 10 · √29 ≈ 53,85.</p>") }
 ]
});

export const MAT_REVIEW: Record<number, Review> = deep<Record<number, Review>>({
 1: { points: ["{AB} = {OB} − {OA} (Spitze minus Fuß), Mittelpunkt {OM} = ½({OA} + {OB}).", "x₁x₂-Ebene: x₃ = 0, x₁x₃: x₂ = 0, x₂x₃: x₁ = 0.", "LGS: zwei Gleichungen lösen, mit der dritten prüfen. Taschenrechner auf DEG."], q: [
  { t: "num", q: "A(2|0|−1), B(5|4|−1). Zweite Koordinate von {AB}?", a: 4, s: "b₂ − a₂ = 4 − 0 = 4" },
  { t: "mc", q: "Welcher Punkt liegt in der x₂x₃-Ebene?", o: ["(0|2|5)", "(2|0|5)", "(2|5|0)", "(1|1|1)"], a: 0, s: "x₂x₃-Ebene: x₁ = 0." },
  { t: "num", q: "arccos(0) in Grad?", a: 90, s: "cos(90°) = 0." }
 ] },
 2: { points: ["|{a}| = √(a₁² + a₂² + a₃²).", "cos(φ) = ({a} · {b}) / (|{a}| · |{b}|), 0° ≤ φ ≤ 180°.", "{a} ⊥ {b} ⇔ {a} · {b} = 0. Kollinear: {a} = c · {b} mit gleichem c."], q: [
  { t: "num", q: "Länge von " + V(1, 2, 2) + "?", a: 3, s: "√(1 + 4 + 4) = 3" },
  { t: "num", q: V(1, 2, 3) + " · " + V(2, 0, -1) + " = ?", a: -1, s: "2 + 0 − 3 = −1" },
  { t: "mc", q: "{a} · {b} = 0 bedeutet …", o: ["{a} ⊥ {b}, die Vektoren stehen senkrecht", "Die Vektoren sind gleich", "Die Vektoren sind kollinear", "Ein Vektor ist 0"], a: 0, s: "cos(90°) = 0." }
 ] },
 3: { points: ["g: {x} = {p} + r · {u} mit r ∈ ℝ.", "Durch A und B: {x} = {OA} + r · {AB}.", "Punktprobe: dreimal dasselbe r?"], q: [
  { t: "num", q: "g durch A(1|1|1) und B(3|0|2). Erste Koordinate des Richtungsvektors {u} = {AB}?", a: 2, s: "{AB} = (2|−1|1)" },
  { t: "num", q: "Gleiche Gerade, r = 2. Dritte Koordinate des Punkts?", a: 3, s: "1 + 2 · 1 = 3, Punkt (5|−1|3)." },
  { t: "mc", q: "Punktprobe: I r = 2, II r = 2, III r = 5. Ergebnis?", o: ["Liegt nicht drauf", "Liegt drauf", "Liegt drauf für r = 2", "Unentscheidbar"], a: 0, s: "Nicht überall dasselbe r." }
 ] },
 4: { points: ["{u}, {v} Vielfache → Punktprobe → identisch oder parallel.", "Keine Vielfachen → LGS in r und s → schneiden oder windschief.", "Probe mit der dritten Gleichung nicht vergessen."], q: [
  { t: "mc", q: "{u} und {v} sind Vielfache, der Stützpunkt von h liegt nicht auf g. Lage?", o: ["Parallel", "Identisch", "Windschief", "Schneidend"], a: 0, s: "Gleiche Richtung, aber verschoben." },
  { t: "mc", q: "Keine Vielfachen, LGS ohne Lösung. Lage?", o: ["Windschief", "Parallel", "Schneidend", "Identisch"], a: 0, s: "Kein Schnittpunkt, verschiedene Richtungen." },
  { t: "num", q: "Das LGS ergibt r = 1 bei g: {x} = " + V(0, 1, 2) + " + r · " + V(3, 0, 1) + ". Erste Koordinate des Schnittpunkts?", a: 3, s: "0 + 1 · 3 = 3" }
 ] },
 5: { points: ["Winkel mit Ebene: cos(α) = |{u} · {u'}| / (|{u}| · |{u'}|) oder Merkhilfe sin(α) = |{u} · {n}| / (|{u}| · |{n}|).", "Abstand: {QX} · {u} = 0 → r → {QF} → d = |{QF}|.", "Nach dem Einsetzen von r ist {QX} schon {QF}."], q: [
  { t: "mc", q: "Winkel mit der x₁x₃-Ebene: welche Koordinate auf 0?", o: ["x₂", "x₁", "x₃", "keine"], a: 0, s: "x₁x₃-Ebene heißt x₂ = 0." },
  { t: "num", q: "{QX} = (r − 1 | 2r | 3), {u} = (1|2|0). r aus {QX} · {u} = 0?", a: 0.2, s: "(r − 1) + 4r = 5r − 1 = 0 → r = 0,2" },
  { t: "num", q: "{QF} = (2|−1|2). Abstand d?", a: 3, s: "√(4 + 1 + 4) = 3" }
 ] },
 6: { points: ["Spurpunkt: Koordinate der Ebene = 0, r ausrechnen, einsetzen.", "Schatten = Spurpunkt der Lichtgeraden.", "Weglänge = r · |{u}|, Pyramide V = ⅓ · G · h."], q: [
  { t: "num", q: "g: {x} = (1|1|4) + r · (1|0|−2). Bei welchem r trifft g den Boden (x₃ = 0)?", a: 2, s: "4 − 2r = 0 → r = 2" },
  { t: "num", q: "Pyramide: G = 9, h = 4. Volumen?", a: 12, s: "⅓ · 9 · 4 = 12" },
  { t: "num", q: "Pro Minute {u} = (2|1|2), 3 Minuten. Weg?", a: 9, s: "3 · √(4 + 1 + 4) = 3 · 3 = 9" }
 ] }
});

export const MAT_TIPS: Record<string, string> = deep<Record<string, string>>({
 "1.0": "Welche Koordinate ist in der x₁x₂-Ebene 0?", "1.1": "Auf einer Achse sind die anderen zwei Koordinaten 0.", "1.2": "Zwei Ebenen heißt zwei Nullen, aber x₁ darf nicht 0 sein.", "1.3": "{OB} − {OA}, erste Zeile: 4 − 1.", "1.4": "Zweite Zeile: 0 − 2.",
 "1.5": "Erst mal 2, dann Zeile für Zeile addieren.", "1.6": "{OM} = ½({OA} + {OB})", "1.7": "{OC} = {OB} + {AD}, und {AD} = {OD} − {OA}.", "1.8": "Addiere I und II.", "1.9": "r einsetzen in II.",
 "1.10": "r = 4 und s = 2 in III einsetzen.", "1.11": "Bei welchem Winkel ist cos = 0,5?", "1.12": "Erst alle Quadrate addieren, dann die Wurzel.", "1.13": "1,047 = π/3.",
 "2.0": "Quadrate addieren, Wurzel ziehen.", "2.1": "√(3² + (−5)² + 1²)", "2.2": "√((b₁ − a₁)² + (b₂ − a₂)² + (b₃ − a₃)²)", "2.3": "{AB} = (3|−2|2).", "2.4": "Zeilen malnehmen, addieren.",
 "2.5": "{a} · {b}, |{a}|, |{b}|, dann arccos.", "2.6": "{a} · {b} = 1, beide Längen √2.", "2.7": "|{b}| = √(16 + 16 + 36) = √68, nicht 8.", "2.8": "Erst das Skalarprodukt.", "2.9": "Bei welchem Paar ist das Skalarprodukt 0?",
 "2.10": "Skalarprodukt mit k aufschreiben und = 0 setzen.", "2.11": "Jede Zeile einzeln nach c auflösen.", "2.12": "c aus jeder Zeile ausrechnen und vergleichen.", "2.13": "Schau dir die x₁-Achse in der Zeichnung an.",
 "3.0": "{u} = {OQ} − {OP}.", "3.1": "{p} + 2 · {u}", "3.2": "{p} − {u}", "3.3": "Wer zeigt auf einen Punkt der Geraden?", "3.4": "Liegt der neue Stützpunkt auf g, und ist die Richtung ein Vielfaches?",
 "3.5": "Jede Zeile nach r auflösen.", "3.6": "Dritte Zeile: 2 = 3 − r.", "3.7": "Dritte Zeile: 1 = 3 − r.", "3.8": "Die erste Zeile ist immer wahr, nimm II.", "3.9": "Ansatz, drei Zeilen, Satz.",
 "4.0": "Vielfache? Dann Punktprobe mit (3|6|4).", "4.1": "Punktprobe mit (3|6|5), dritte Zeile beachten.", "4.2": "4 durch 2.", "4.3": "Die zweite Zeile hat nur s.", "4.4": "r = 2 in g einsetzen.",
 "4.5": "II und III lösen, dann Probe mit I.", "4.6": "Die erste Zeile hat nur r.", "4.7": "r = 2 in g.", "4.8": "Die erste Zeile hat nur s.", "4.9": "Keine Lösung aller drei Gleichungen.",
 "4.10": "Erste Frage: Sind {u} und {v} Vielfache?",
 "5.0": "x₃ in {u} auf 0 setzen. Oder: sin(α) mit {n} = (0|0|1).", "5.1": "x₂ in {u} auf 0 setzen. Oder: {n} = (0|1|0).", "5.2": "{u'} = (1|1|0).", "5.3": "{u'} = (0|3|0), |{u}| = 5.", "5.4": "Welche Achse liegt nicht in der Ebene?",
 "5.5": "{u'} ist gleich {u}.", "5.6": "{QX} = {OX} − {OQ}, dann mal {u}.", "5.7": "{QF} = {OF} − {OQ}, dann Betrag.", "5.8": "{QX} · {u} = 14r − 20.", "5.9": "{QX} · {u} = 9r − 9.",
 "5.10": "Was ist der kürzeste Weg zu einer Geraden?", "5.11": "Parallele Geraden haben überall denselben Abstand.",
 "6.0": "x₃ = 0 setzen.", "6.1": "6 − 3r = 0.", "6.2": "4 − 2r = 0.", "6.3": "Richtung {PG} = {OG} − {OP} = (5|−4|2).", "6.4": "−30 + 3r = 0.",
 "6.5": "10 · |{u}|", "6.6": "r = 5, dann 5 · |{u}|.", "6.7": "V = ⅓ · G · h", "6.8": "G = 15.", "6.9": "Welche Koordinate fehlt in der x₁x₃-Ebene?",
 "6.10": "Lichtgerade, Ebene, Koordinate = 0, einsetzen."
});

export const MAT_REVIEW_TIPS: Record<string, string> = deep<Record<string, string>>({
 "1.0": "4 − 0", "1.1": "x₁ = 0", "1.2": "Wo ist cos = 0?",
 "2.0": "√9", "2.1": "1 · 2 + 2 · 0 + 3 · (−1)", "2.2": "cos(90°)",
 "3.0": "{OB} − {OA}", "3.1": "Dritte Zeile: 1 + 2 · 1", "3.2": "Dreimal gleich?",
 "4.0": "Gleiche Richtung, kein gemeinsamer Punkt.", "4.1": "Verschiedene Richtung, kein Punkt.", "4.2": "0 + 1 · 3",
 "5.0": "x₁x₃ ohne x₂", "5.1": "(r − 1) + 2 · 2r", "5.2": "√(4 + 1 + 4)",
 "6.0": "4 − 2r = 0", "6.1": "⅓ · 9 · 4", "6.2": "|{u}| = 3"
});

export const MAT_EXAM: ExamTask[] = deep<ExamTask[]>([
 { n: 1, title: "Dreieck", p: 7, q: "Gegeben sind A(1|0|2), B(3|1|0) und C(2|2|4).<br>a) Berechnen Sie die Vektoren {AB} und {AC} und ihre Längen.<br>b) Zeigen Sie, dass das Dreieck ABC bei A einen rechten Winkel hat.<br>c) Berechnen Sie den Flächeninhalt des Dreiecks.", s: "a) {AB} = (2|1|−2), |{AB}| = 3. {AC} = (1|2|2), |{AC}| = 3 (3 P).<br>b) {AB} · {AC} = 2 + 2 − 4 = 0, also {AB} ⊥ {AC} und rechter Winkel bei A (2 P).<br>c) A = ½ · 3 · 3 = 4,5 (2 P)." },
 { n: 2, title: "Gerade und Punktprobe", p: 6, q: "a) Stellen Sie eine Gleichung der Geraden g durch A(1|0|2) und B(3|1|0) auf.<br>b) Prüfen Sie, ob P(7|3|−4) und Q(5|2|1) auf g liegen.", s: "a) g: {x} = (1|0|2) + r · (2|1|−2) (2 P).<br>b) P: I 7 = 1 + 2r → r = 3, II 3 = r → r = 3, III −4 = 2 − 2r → r = 3. P liegt auf g (2 P).<br>Q: I r = 2, II r = 2, III 1 = 2 − 2r → r = 0,5. Q liegt nicht auf g (2 P)." },
 { n: 3, title: "Lagebeziehungen", p: 9, q: "g: {x} = (1|0|2) + r · (2|1|−2), h: {x} = (3|−1|−2) + s · (0|1|1), k: {x} = (0|0|0) + t · (−4|−2|4).<br>a) Untersuchen Sie die Lage von g und h. Berechnen Sie gegebenenfalls den Schnittpunkt.<br>b) Untersuchen Sie die Lage von g und k.", s: "a) Keine Vielfachen. LGS: I 1 + 2r = 3 → r = 1. II r = −1 + s → s = 2. III 2 − 2r = −2 + s → 0 = 0, stimmt. Schnittpunkt S(3|1|0) (5 P).<br>b) (−4|−2|4) = −2 · (2|1|−2), Vielfache. Punktprobe (0|0|0) auf g: I r = −0,5, II r = 0. Widerspruch, also parallel (4 P)." },
 { n: 4, title: "Schnittwinkel", p: 5, q: "Berechnen Sie den Schnittwinkel α der Geraden g: {x} = (1|0|2) + r · (2|1|−2) mit der x₁x₂-Ebene.", s: "{u'} = (2|1|0). cos(α) = |4 + 1 + 0| / (3 · √5) ≈ 0,745 (3 P). α ≈ 41,8° (2 P).<br>Kontrolle mit der Merkhilfe: {n} = (0|0|1), sin(α) = |−2| / 3 ≈ 0,667, α ≈ 41,8°." },
 { n: 5, title: "Abstand Punkt–Gerade", p: 8, q: "Berechnen Sie den Abstand des Punktes Q(6|1|3) von der Geraden g: {x} = (1|0|2) + r · (2|1|−2) und geben Sie den Lotfußpunkt an.", s: "{QX} = (2r − 5 | r − 1 | −1 − 2r) (2 P). {QX} · {u} = 9r − 9 = 0 → r = 1 (3 P). F(3|1|0), {QF} = (−3|0|−3) (1 P). d = √18 ≈ 4,24 (2 P)." },
 { n: 6, title: "Heißluftballon", p: 10, q: "Ein Ballon schwebt im Punkt B(4|6|8) (Einheit 10 m). Die Sonne scheint in Richtung (1|−2|−4). Der Boden ist die x₁x₂-Ebene.<br>a) Berechnen Sie den Schattenpunkt des Ballons auf dem Boden.<br>b) Wie weit ist der Ballon von seinem Schatten entfernt (in Metern)?<br>c) Ein Vogel fliegt auf der Geraden h: {x} = (0|0|8) + s · (1|1|0). Trifft er den Ballon?", s: "a) {x} = (4|6|8) + r · (1|−2|−4). 8 − 4r = 0 → r = 2. Schatten (6|2|0) (4 P).<br>b) |(2|−4|−8)| = √84 ≈ 9,17, also etwa 91,7 m (3 P).<br>c) Punktprobe B auf h: I s = 4, II s = 6. Widerspruch, er trifft den Ballon nicht (3 P)." }
]);

export const MAT_EXAM_TIPS: Record<string, string> = deep<Record<string, string>>({
 1: "b) Skalarprodukt {AB} · {AC}. c) Rechtwinklig: ½ · Kathete · Kathete.",
 2: "a) Richtungsvektor {AB}. b) Drei Zeilen, dreimal dasselbe r?",
 3: "Erst prüfen, ob die Richtungsvektoren Vielfache sind. a) Die erste Zeile hat nur r. b) Faktor −2.",
 4: "x₃ in {u} auf 0 setzen, oder sin(α) mit {n} = (0|0|1).",
 5: "{QX} aufstellen, {QX} · {u} = 0.",
 6: "a) x₃ = 0. b) Betrag von B zum Schatten, mal 10. c) Punktprobe."
});

export const MAT_META: CourseMeta = deep<CourseMeta>({
 brand: "Vektorgeometrie",
 label: "Mathe",
 word: "Teil",
 unitsLabel: "Lernteile",
 eyebrow: "Mathe · Vektorgeometrie 6 bis 6.6 · Arbeit am Donnerstag, 12.11.",
 topic: "in der Vektorarbeit.",
 intro: "6 Lernteile für heute Abend, aufgebaut auf eurem OneNote „MgAN 2025_2026“, Abschnitt I Analysis, Seiten 6 bis 6.6. Teil 1 frischt alles auf, was du dafür brauchst. Alle Formeln und Buchstaben sind wie in eurer Merkhilfe. Gute Note dauert etwa 3 Stunden, 15 Punkte etwa 5. Morgen früh nur noch Formeln und Fehlerheft.",
 goal15: "Alles: jede Erklärung, alle Übungen, Sonderfälle wie Abstand paralleler Geraden und Schatten mit Lampe. Etwa 5 Stunden.",
 goalGut: "Nur das, was sicher drankommt: Grundlagen, Winkel, Gerade, Punktprobe, Lage, Abstand, Schatten. Etwa 3 Stunden.",
 how: "Jeder Teil beginnt mit „Erst verstehen“: kurze Erklärungen mit Rechenbeispiel. Danach Übungen direkt hier, eine Checkliste „Du kannst …“ und drei Wiederholungsfragen. Zum Schluss die Probeklausur. Ab 90 % bist du bereit. Taschenrechner auf DEG!",
 navExam: "60 min, " + MAT_EXAM.reduce((a, t) => a + t.p, 0) + " Punkte",
 examMins: 60,
 examEyebrow: "Wie in der Arbeit",
 examLede: "Nur Taschenrechner (DEG) und Merkhilfe, keine Unterlagen. Alle Themen von 6.1 bis 6.6 mit neuen Zahlen. Erst nach dem Timer die Lösungen aufklappen und Punkte eintragen.",
 beforeExam: "Vor der Arbeit",
 formulasEyebrow: "Alles für morgen auf einer Seite",
 formulasTitle: "Formeln und Verfahren",
 formulasLede: "Gleiche Formeln und Buchstaben wie in der Merkhilfe (Seite 10 und 11), dazu die Rezepte aus 6.1 bis 6.6. Die Teile mit „nur BOS“ in der Merkhilfe (Vektorprodukt, Ebenen in Normalenform) braucht ihr nicht.",
 formulasNav: "Formeln und Rezepte",
 symbols: [["{a}, {b}", "Vektoren (mit Pfeil)"], ["{OA}", "Ortsvektor von A"], ["{AB}", "Vektor von A nach B: {OB} − {OA}"], ["|{a}|", "Betrag, Länge des Vektors"], ["{a₀}", "Einheitsvektor, Länge 1"], ["{a} · {b}", "Skalarprodukt (eine Zahl)"], ["{p} = {OP}", "Stützvektor von g"], ["{u}", "Richtungsvektor von g"], ["{q}, {v}", "Stütz- und Richtungsvektor von h"], ["{n}", "Normalenvektor (steht senkrecht)"], ["r, s", "Parameter von g und h (r, s ∈ ℝ)"], ["φ", "Winkel zwischen zwei Vektoren, 0° ≤ φ ≤ 180°"], ["α", "Schnittwinkel, 0° ≤ α ≤ 90°"], ["F, d", "Lotfußpunkt, Abstand"]],
 formulas: [
  ["Vektoren (Merkhilfe S. 10)", [["Betrag", "|{a}| = √(a₁² + a₂² + a₃²)"], ["Einheitsvektor", "{a₀} = {a} / |{a}|"], ["Verbindungsvektor", "{AB} = {OB} − {OA}"], ["Länge der Strecke AB", "|{AB}| = √((b₁ − a₁)² + (b₂ − a₂)² + (b₃ − a₃)²)"], ["Mittelpunkt M von AB", "{OM} = ½({OA} + {OB})"]]],
  ["Skalarprodukt und Winkel (S. 10)", [["Skalarprodukt", "{a} · {b} = a₁b₁ + a₂b₂ + a₃b₃"], ["Winkel φ", "cos(φ) = ({a} · {b}) / (|{a}| · |{b}|), 0° ≤ φ ≤ 180°"], ["Orthogonalität", "{a} ⊥ {b} ⇔ {a} · {b} = 0"], ["Kollinear", "{a} = c · {b} (gleiches c in allen Zeilen)"]]],
  ["Geraden (S. 11)", [["Parameterform", "g: {x} = {p} + r · {u} mit r ∈ ℝ"], ["Zweite Gerade", "h: {x} = {q} + s · {v}"], ["Durch A und B", "{x} = {OA} + r · {AB}"], ["Punktprobe", "Punkt = Gerade, dreimal dasselbe r?"], ["Spurpunkt", "Koordinate der Ebene = 0, r einsetzen"]]],
  ["Lage zweier Geraden", [["{u}, {v} Vielfache, Punkt drauf", "identisch"], ["{u}, {v} Vielfache, Punkt nicht drauf", "parallel"], ["keine Vielfachen, LGS lösbar", "schneidend"], ["keine Vielfachen, LGS unlösbar", "windschief"]]],
  ["Winkel (S. 11)", [["Zwei Geraden", "cos(α) = |{u₁} · {u₂}| / (|{u₁}| · |{u₂}|)"], ["Gerade und Ebene", "sin(α) = |{u} · {n}| / (|{u}| · |{n}|)"], ["{n} der Koordinatenebenen", "x₁x₂: (0|0|1), x₁x₃: (0|1|0), x₂x₃: (1|0|0)"], ["Unterrichtsweg", "Koordinate in {u} auf 0 → {u'}, cos(α) = |{u} · {u'}| / (|{u}| · |{u'}|)"]]],
  ["Abstand Punkt–Gerade", [["1. Allgemeiner Punkt", "{OX} = {p} + r · {u}"], ["2. Verbindung", "{QX} = {OX} − {OQ}"], ["3. Lot", "{QX} · {u} = 0 → r"], ["4. Abstand", "d = |{QF}| (r in {QX} einsetzen)"]]],
  ["Modellieren", [["Schatten (Sonne)", "{x} = {p} + r · Lichtrichtung, Boden x₃ = 0"], ["Schatten (Lampe P)", "{x} = {OP} + r · {PG}, dann Wand oder Boden = 0"], ["Weglänge", "r · |{u}| bzw. |{AP}|"], ["Pyramide", "V = ⅓ · G · h"]]]
 ],
 killers: ["Taschenrechner auf RAD statt DEG", "Verbindungsvektor {OA} − {OB} statt {OB} − {OA}", "Kollinearität nur in zwei Zeilen geprüft", "LGS ohne Probe mit der dritten Gleichung", "Punktprobe nach zwei Zeilen abgebrochen", "Beim Abstand nach dem Einsetzen von r nochmal Q abgezogen", "Bei Winkel mit Ebene die falsche Koordinate auf 0 gesetzt oder sin und cos vertauscht", "Wurzel beim Betrag vergessen oder nur einzelne Zahlen gewurzelt", "Kein Antwortsatz (z. B. „Die Geraden sind windschief.“)"],
 rulesHtml: '<div class="dayhead"><span class="eyebrow">Für heute Abend</span><h1>Spielregeln</h1></div>' +
  '<section class="card"><ul class="stack" style="padding-left:20px;margin:0">' +
  '<li><b>Reihenfolge:</b> Teil 1 bis 6 der Reihe nach, dann die Probeklausur. Bei „Gute Note“ etwa 25 bis 35 Minuten pro Teil.</li>' +
  '<li><b>Merkhilfe daneben legen.</b> Alle Buchstaben hier sind wie dort: {x} = {p} + r · {u}, h mit s und {v}, φ zwischen Vektoren, α bei Schnittwinkeln.</li>' +
  '<li><b>Auf Papier rechnen</b>, nicht im Kopf. In der Arbeit gibt es Punkte für Ansatz und Zwischenschritte.</li>' +
  '<li><b>Fehlerheft:</b> Jeden Fehler mit einem Satz eintragen. Morgen früh liest du nur Fehlerheft und Formeln.</li>' +
  '<li><b>Schlaf:</b> Lieber um 23 Uhr aufhören und ausgeschlafen sein als bis 2 Uhr weiterlernen.</li></ul></section>' +
  '<div class="note warn"><b>Taschenrechner</b>Vor der Arbeit auf DEG stellen und mit arccos(0,5) = 60 prüfen.</div>' +
  '<div class="note tip"><b>So gibt es volle Punkte</b>Ansatz hinschreiben (z. B. „Punktprobe:“), alle drei Zeilen rechnen, Ergebnis als Satz: „P liegt auf g.“, „Die Geraden schneiden sich in S(3|2|2).“, „Der Abstand beträgt etwa 2,92 LE.“</div>' +
  '<section class="card stack"><h2>Zwei Fehler in den Unterrichtsnotizen</h2><ul style="padding-left:20px;margin:0" class="stack"><li><b>6.1 Winkel:</b> Bei {a} = (2|6|4), {b} = (4|4|6) ist |{b}| = √68 ≈ 8,25, nicht 8. Der Winkel ist φ ≈ 24,8°, nicht 20,7°.</li><li><b>6.5 Abstand:</b> Bei Q(3|−2|5) ist d = √21/7 ≈ 0,65, nicht 5,2. Nach dem Einsetzen von r in {QX} hat man schon {QF}.</li></ul></section>' +
  '<p style="color:var(--muted);font-size:14px">Grundlage: OneNote „MgAN 2025_2026-Notizbuch“, Abschnitt I Analysis: 6. Vektorgeometrie (6.1 Grundlagen), 6.2 Geraden im Raum, 6.3 Gegenseitige Lage von Geraden, 6.4 Schnittwinkel zwischen Gerade und Koordinatenebene, 6.5 Abstand zwischen Punkt und Gerade, 6.6 Modellieren mit Geraden. Schreibweise nach der Merkhilfe Mathematik BW, Version 2.0, Seite 10 und 11.</p>',
 ai: "Du bist ein geduldiger Mathe-Nachhilfelehrer für einen Schüler im Technischen Gymnasium in Baden-Württemberg. Er schreibt morgen (Donnerstag) eine Arbeit über Vektorgeometrie (Kapitel 6 bis 6.6) und darf die Merkhilfe Mathematik BW benutzen.\n\n" +
  "Regeln für deine Antworten:\n- Antworte auf Deutsch, in Du-Form, freundlich und direkt.\n- Erkläre einfach und Schritt für Schritt, mit konkreten Zahlen.\n- Schreibe Vektoren als Zeilen in Klammern wie (2|1|−3), Punkte als P(2|1|−3), niemals LaTeX und keine Dollarzeichen. Vektornamen schreibst du als Vektor a, Vektor AB, Vektor OA.\n- Halte dich kurz (meist unter 180 Wörtern), außer er bittet um mehr.\n- Bittet er um einen Tipp, gib nur den nächsten Schritt.\n- Winkel immer in Grad, erinnere an den DEG-Modus.\n- Benutze genau die Buchstaben der Merkhilfe: Gerade g: x = p + r·u (Stützvektor p = OP, Richtungsvektor u, Parameter r), zweite Gerade h: x = q + s·v, Normalenvektor n. Winkel zwischen zwei Vektoren heißt φ mit cos(φ) = a·b/(|a|·|b|), 0° ≤ φ ≤ 180°. Schnittwinkel heißen α mit 0° ≤ α ≤ 90°: zwei Geraden cos(α) = |u1·u2|/(|u1|·|u2|), Gerade und Ebene sin(α) = |u·n|/(|u|·|n|). Mittelpunkt OM = ½(OA + OB). Orthogonalität: a ⊥ b ⇔ a·b = 0.\n- Verfahren wie im Unterricht: Verbindungsvektor AB = OB − OA; kollinear bei a = c·b; Punktprobe mit drei Zeilen; Lage zweier Geraden mit Entscheidungsbaum (Vielfache → Punktprobe → identisch/parallel, sonst LGS in r und s → schneidend/windschief); Schnittwinkel mit Koordinatenebene über u' (Koordinate der Ebene auf 0 gesetzt) und cos(α) = |u·u'|/(|u|·|u'|), zur Kontrolle sin-Formel mit n = (0|0|1) usw.; Abstand Punkt–Gerade über Lotfußpunkt mit QX·u = 0; Spurpunkte und Schattenwurf; Volumen Pyramide ⅓·G·h.\n- Vektorprodukt und Ebenen in Normalenform sind in der Merkhilfe nur für BOS und kommen nicht dran.\n- Wenn er dich abfragen will, stelle eine Frage nach der anderen.",
 tutor: "Vektorgeometrie",
 sugs: ["Erklär mir die Punktprobe, als wäre ich in der 9. Klasse.", "Wie entscheide ich, ob zwei Geraden windschief sind?", "Gib mir eine neue Aufgabe zum Abstand Punkt–Gerade mit Lösung zum Aufklappen.", "Frag mich die Formeln aus der Merkhilfe ab, eine Frage nach der anderen."],
 errExample: "„Verbindungsvektor OA − OB statt OB − OA gerechnet“"
});
