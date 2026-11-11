import type { Day, ExamTask, Review, Lesson, CourseMeta } from "../types";

const LF = (x: string) => '<div class="lf">' + x + '</div>';
const LX = (x: string) => '<div class="lx"><b>Beispiel</b>' + x + '</div>';
const LK = (x: string) => '<div class="lk"><b>Merke</b>' + x + '</div>';
const TAB = (head: string[], rows: (string | number)[][]) => '<div class="lw"><table class="lta"><tr>' + head.map(h => "<th>" + h + "</th>").join("") + "</tr>" + rows.map(r => "<tr>" + r.map(c => "<td>" + c + "</td>").join("") + "</tr>").join("") + "</table></div>";
const V = (...c: (string | number)[]) => '<span class="cv">' + c.map(x => "<span>" + String(x).replace(/^-/, "−") + "</span>").join("") + "</span>";

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
    '<text x="20" y="92">gleiche Richtung</text><text x="200" y="92">verschiedene Richtung</text><text x="20" y="108">(u, v kollinear)</text><text x="200" y="108">(u, v nicht kollinear)</text></svg>';
}

function svgLot() {
  return '<svg class="lfig lfig-s" viewBox="0 0 260 140" role="img" aria-label="Abstand eines Punktes Q von einer Geraden g über den Lotfußpunkt F">' +
    '<line class="lc" x1="10" y1="120" x2="250" y2="60"/><text class="lt" x="236" y="50">g</text>' +
    '<line class="lh" stroke-dasharray="4 3" x1="125" y1="21" x2="145" y2="86"/>' +
    '<circle class="ld" cx="145" cy="86" r="4"/><text class="lt" x="148" y="108">F</text>' +
    '<circle cx="125" cy="21" r="5" style="fill:var(--warm)"/><text class="lgt" x="134" y="20">Q</text>' +
    '<text class="lt" x="116" y="58">d</text><path class="la" d="M140 72 L149 70 L151 79"/></svg>';
}

export const MAT_DAYS: Day[] = [
 { n: 1, date: "", wd: "", title: "Grundlagen auffrischen", short: "Punkte, Vektoren, LGS",
   goal: "Du kannst Punkte im Raum lesen, Verbindungsvektoren und Mittelpunkte ausrechnen, ein LGS mit Probe lösen und den Taschenrechner für Winkel richtig einstellen.",
   blocks: [
    ["10", "basic", "<b>Koordinatensystem im Raum.</b> Welche Achse ist wo, und welche Koordinate ist in welcher Ebene 0?"],
    ["15", "basic", "<b>Vektoren rechnen.</b> Verbindungsvektor „Spitze minus Fuß“, addieren, mit einer Zahl malnehmen, Mittelpunkt."],
    ["15", "basic", "<b>LGS mit 3 Gleichungen und 2 Unbekannten.</b> Das brauchst du bei Punktprobe und Lagebeziehung."],
    ["5", "basic", "<b>Taschenrechner auf DEG.</b> Winkel kommen in Grad heraus."],
    ["20", "ueben", "<b>Übungen</b> unten."],
    ["5", "test", "<b>Selbsttest.</b> Partner nennt zwei Punkte, du sagst den Verbindungsvektor im Kopf."]
   ],
   notes: [["warn", "Wichtig für morgen", "Für die Winkel muss der Taschenrechner auf <b>DEG</b> stehen, nicht auf RAD wie bei Physik."]],
   vids: [], links: [["Formeln", "#formeln"]],
   checks: ["Punkte im Raum und die Koordinatenebenen erkennen", "Verbindungsvektor AB = B − A ausrechnen", "Vektoren addieren, mit einer Zahl malnehmen, Mittelpunkt bestimmen", "Ein LGS mit drei Gleichungen lösen und mit der dritten prüfen", "arccos auf dem Taschenrechner in Grad ausrechnen"],
   groups: ["Punkte und Ebenen", "Vektoren rechnen", "LGS", "Taschenrechner"],
   core: { b: [0, 1, 2, 3, 4], c: [0, 1, 3, 4] },
   ex: [
    { t: "mc", g: "Punkte und Ebenen", k: true, q: "Welcher Punkt liegt in der x₁x₂-Ebene?", o: ["(3|−1|0)", "(0|−1|3)", "(3|0|−1)", "(1|1|1)"], a: 0, s: "In der x₁x₂-Ebene ist x₃ = 0." },
    { t: "mc", g: "Punkte und Ebenen", q: "Welcher Punkt liegt auf der x₃-Achse?", o: ["(0|0|5)", "(5|0|0)", "(0|5|0)", "(5|5|0)"], a: 0, s: "Auf der x₃-Achse sind x₁ und x₂ beide 0." },
    { t: "mc", g: "Punkte und Ebenen", k: true, q: "Gesucht ist ein Punkt, der in der x₁x₂-Ebene und in der x₁x₃-Ebene liegt, aber nicht in der x₂x₃-Ebene. Welcher passt?", o: ["(4|0|0)", "(0|4|0)", "(0|0|4)", "(4|4|0)"], a: 0, s: "x₁x₂-Ebene: x₃ = 0. x₁x₃-Ebene: x₂ = 0. Nicht in der x₂x₃-Ebene heißt x₁ ≠ 0. Also (4|0|0), ein Punkt auf der x₁-Achse." },
    { t: "num", g: "Vektoren rechnen", k: true, q: "A(1|2|3), B(4|0|5). Wie groß ist die erste Koordinate von AB?", a: 3, s: "AB = B − A = " + V(3, -2, 2) + ". Erste Koordinate 4 − 1 = 3." },
    { t: "num", g: "Vektoren rechnen", k: true, q: "Gleiche Punkte. Wie groß ist die zweite Koordinate von AB?", a: -2, s: "0 − 2 = −2. Immer Spitze (B) minus Fuß (A)." },
    { t: "num", g: "Vektoren rechnen", k: true, q: "Berechne 2·" + V(1, -2, 3) + " + " + V(0, 4, -1) + ". Wie groß ist die dritte Koordinate?", a: 5, s: "2·" + V(1, -2, 3) + " = " + V(2, -4, 6) + ". Plus " + V(0, 4, -1) + " ergibt " + V(2, 0, 5) + "." },
    { t: "num", g: "Vektoren rechnen", q: "Mittelpunkt M von A(2|4|−2) und B(6|0|4). Wie groß ist die dritte Koordinate von M?", a: 1, s: "M = ½·(A + B) = ½·" + V(8, 4, 2) + " = (4|2|1)." },
    { t: "num", g: "Vektoren rechnen", q: "Ein Quader hat die Ecken A(1|2|0), B(5|2|0) und D(1|8|0). C liegt gegenüber von A. Wie groß ist die zweite Koordinate von C?", a: 8, s: "C = B + AD = " + V(5, 2, 0) + " + " + V(0, 6, 0) + " = (5|8|0)." },
    { t: "num", g: "LGS", k: true, q: "Löse: I s − t = 2, II s + t = 6. Wie groß ist s?", a: 4, s: "I + II: 2s = 8, also s = 4. Dann t = 2." },
    { t: "num", g: "LGS", k: true, q: "Gleiches LGS. Wie groß ist t?", a: 2, s: "Aus II: t = 6 − s = 2." },
    { t: "mc", g: "LGS", k: true, q: "Gleiches LGS mit dritter Gleichung III 2s − 3t = 2. Was sagt die Probe?", o: ["Stimmt (8 − 6 = 2), das LGS hat die Lösung s = 4, t = 2", "Stimmt nicht, das LGS hat keine Lösung", "Man braucht die dritte Gleichung nicht", "s und t müssen neu berechnet werden"], a: 0, s: "Einsetzen: 2·4 − 3·2 = 2. Wahre Aussage, also passt die Lösung zu allen drei Gleichungen." },
    { t: "num", g: "Taschenrechner", k: true, q: "Wie groß ist arccos(0,5) in Grad?", a: 60, s: "cos(60°) = 0,5. Im Taschenrechner: SHIFT cos 0,5 im Modus DEG." },
    { t: "num", g: "Taschenrechner", k: true, q: "Wie groß ist √(2² + (−1)² + 2²)?", a: 3, s: "√(4 + 1 + 4) = √9 = 3. Minus ins Quadrat ist plus." },
    { t: "mc", g: "Taschenrechner", q: "Dein Taschenrechner zeigt für arccos(0,5) den Wert 1,047. Was ist los?", o: ["Er steht auf RAD statt DEG", "Die Rechnung ist falsch", "Man muss noch mit 2 malnehmen", "Das ist richtig so"], a: 0, s: "1,047 ist π/3, also der Winkel im Bogenmaß. In der Vektorgeometrie willst du Grad: auf DEG umstellen." }
   ] },
 { n: 2, date: "", wd: "", title: "Skalarprodukt, Länge, Winkel", short: "6.1 Grundlagen",
   goal: "Du kannst Länge, Abstand zweier Punkte, Skalarprodukt und Winkel zwischen zwei Vektoren ausrechnen und Orthogonalität und Kollinearität prüfen.",
   blocks: [
    ["10", "skript", "<b>Betrag und Abstand.</b> Länge eines Vektors mit Pythagoras in 3D."],
    ["10", "skript", "<b>Skalarprodukt.</b> Komponenten malnehmen, alles addieren, es kommt eine Zahl heraus."],
    ["15", "skript", "<b>Winkel.</b> cos α = (a·b)/(|a|·|b|), dann arccos in DEG."],
    ["10", "skript", "<b>Orthogonal und kollinear.</b> Skalarprodukt 0 bzw. a = c·b mit demselben c in allen Zeilen."],
    ["25", "ueben", "<b>Übungen</b> unten."],
    ["5", "test", "<b>Selbsttest.</b> Winkel zwischen (1|0|1) und (0|1|1) ohne Hilfe."]
   ],
   notes: [["warn", "Nachrechnen im Heft", "Im Unterrichtsbeispiel mit a = (2|6|4) und b = (4|4|6) steht α ≈ 20,7°. Dort wurde |b| = 8 eingesetzt, richtig ist |b| = √68 ≈ 8,25 und damit α ≈ 24,8°."]],
   vids: [], links: [["Formeln", "#formeln"]],
   checks: ["Betrag eines Vektors und Abstand zweier Punkte berechnen", "Skalarprodukt ausrechnen", "Winkel zwischen zwei Vektoren berechnen", "Orthogonalität mit dem Skalarprodukt prüfen", "Kollinearität prüfen (a = c·b)"],
   groups: ["Länge und Abstand", "Skalarprodukt und Winkel", "Orthogonal und kollinear"],
   core: { b: [0, 1, 2, 3, 4], c: [0, 1, 2, 3, 4] },
   ex: [
    { t: "num", g: "Länge und Abstand", k: true, q: "Wie lang ist " + V(2, -1, 2) + "?", a: 3, s: "|a| = √(2² + (−1)² + 2²) = √9 = 3" },
    { t: "num", g: "Länge und Abstand", k: true, q: "Abstand von A(3|−5|1) zum Ursprung O(0|0|0)? (zwei Nachkommastellen)", a: 5.92, s: "|OA| = √(9 + 25 + 1) = √35 ≈ 5,92" },
    { t: "num", g: "Länge und Abstand", k: true, q: "Abstand von A(3|−5|1) zu B(7|2|1)? (zwei Nachkommastellen)", a: 8.06, s: "AB = " + V(4, 7, 0) + ", |AB| = √(16 + 49 + 0) = √65 ≈ 8,06" },
    { t: "num", g: "Länge und Abstand", q: "Wie lang ist AB mit A(1|2|3) und B(4|0|5)? (zwei Nachkommastellen)", a: 4.12, s: "AB = " + V(3, -2, 2) + ", |AB| = √(9 + 4 + 4) = √17 ≈ 4,12" },
    { t: "num", g: "Skalarprodukt und Winkel", k: true, q: "Berechne " + V(2, 6, 4) + " · " + V(4, 4, 6) + ".", a: 56, s: "2·4 + 6·4 + 4·6 = 8 + 24 + 24 = 56" },
    { t: "num", g: "Skalarprodukt und Winkel", k: true, q: "Winkel zwischen " + V(1, 2) + " und " + V(3, 1) + " in Grad?", a: 45, s: "a·b = 3 + 2 = 5, |a| = √5, |b| = √10. cos α = 5/(√5·√10) ≈ 0,707, α = 45°." },
    { t: "num", g: "Skalarprodukt und Winkel", k: true, q: "Winkel zwischen " + V(1, 0, 1) + " und " + V(0, 1, 1) + " in Grad?", a: 60, s: "a·b = 0 + 0 + 1 = 1, |a| = |b| = √2. cos α = 1/2, α = 60°." },
    { t: "num", g: "Skalarprodukt und Winkel", q: "Winkel zwischen " + V(2, 6, 4) + " und " + V(4, 4, 6) + " in Grad? (eine Nachkommastelle)", a: 24.8, s: "a·b = 56, |a| = √56 ≈ 7,48, |b| = √68 ≈ 8,25. cos α = 56/(√56·√68) ≈ 0,907, α ≈ 24,8°." },
    { t: "num", g: "Skalarprodukt und Winkel", q: "Winkel zwischen " + V(2, 1, -2) + " und " + V(1, 2, 2) + " in Grad?", a: 90, s: "a·b = 2 + 2 − 4 = 0. cos α = 0, also α = 90°." },
    { t: "mc", g: "Orthogonal und kollinear", k: true, q: "Welche beiden Vektoren stehen senkrecht aufeinander?", o: [V(-2, 1, -2) + " und " + V(3, 8, 1), V(1, -2, 3) + " und " + V(-1, 2, 3), V(1, 1, 1) + " und " + V(1, 1, 0), V(2, 0, 1) + " und " + V(1, 0, 2)], a: 0, s: "−2·3 + 1·8 + (−2)·1 = −6 + 8 − 2 = 0. Skalarprodukt 0 heißt orthogonal." },
    { t: "num", g: "Orthogonal und kollinear", k: true, q: "Für welches k stehen " + V(1, "k", 2) + " und " + V(3, 1, -2) + " senkrecht aufeinander?", a: 1, s: "3 + k − 4 = 0, also k = 1." },
    { t: "num", g: "Orthogonal und kollinear", k: true, q: V(2, -1, 4) + " = c · " + V(4, -2, 8) + ". Wie groß ist c?", a: 0.5, s: "Zeile I: 2 = 4c → c = ½. Zeile II: −1 = −2c → c = ½. Zeile III: 4 = 8c → c = ½. Überall gleich, also kollinear mit c = 0,5." },
    { t: "mc", g: "Orthogonal und kollinear", q: "Sind " + V(1, 2, 3) + " und " + V(2, 4, 5) + " kollinear?", o: ["Nein, aus I und II folgt c = 2, aus III aber c = 2,5", "Ja, weil die ersten zwei Zeilen passen", "Ja, weil alle Zahlen positiv sind", "Nein, weil das Skalarprodukt nicht 0 ist"], a: 0, s: "Kollinear nur, wenn c in allen drei Zeilen gleich ist. Hier nicht." },
    { t: "rev", g: "Orthogonal und kollinear", q: "Warum kann man im gezeichneten 3D-Koordinatensystem keine Längen von Vektoren ablesen?", s: "Weil die x₁-Achse schräg und verkürzt gezeichnet wird. Die Zeichnung verzerrt Längen und Winkel. Deshalb rechnet man Längen immer mit dem Betrag aus." }
   ] },
 { n: 3, date: "", wd: "", title: "Geraden im Raum", short: "6.2 Parametergleichung",
   goal: "Du kannst die Gleichung einer Geraden durch zwei Punkte aufstellen, Punkte auf ihr berechnen und mit der Punktprobe prüfen, ob ein Punkt auf ihr liegt.",
   blocks: [
    ["15", "skript", "<b>Parametergleichung.</b> Stützvektor plus t mal Richtungsvektor."],
    ["10", "skript", "<b>Punkte auf der Geraden.</b> Einfach ein t einsetzen."],
    ["15", "skript", "<b>Punktprobe.</b> Punkt gleich Gerade setzen, drei Zeilen, dreimal dasselbe t?"],
    ["20", "ueben", "<b>Übungen</b> unten."],
    ["5", "test", "<b>Selbsttest.</b> Gerade durch zwei Punkte aufstellen, die dein Partner nennt."]
   ],
   notes: [["tip", "Punktprobe", "Erst wenn alle <b>drei</b> Zeilen dasselbe t geben, liegt der Punkt auf der Geraden. Ein Widerspruch reicht für „liegt nicht drauf“."]],
   vids: [], links: [["Formeln", "#formeln"]],
   checks: ["Geradengleichung durch zwei Punkte aufstellen", "Stütz- und Richtungsvektor benennen", "Punkte auf der Geraden über t berechnen", "Punktprobe durchführen und begründen", "Eine zweite Gleichung derselben Geraden angeben"],
   groups: ["Gleichung aufstellen", "Punktprobe"],
   core: { b: [0, 1, 2, 3, 4], c: [0, 1, 2, 3] },
   ex: [
    { t: "num", g: "Gleichung aufstellen", k: true, q: "Gerade g durch P(2|4|3) und Q(3|6|2), Richtungsvektor u = PQ. Wie groß ist die dritte Koordinate von u?", a: -1, s: "PQ = Q − P = " + V(1, 2, -1) + ". g: x = " + V(2, 4, 3) + " + t·" + V(1, 2, -1) + "." },
    { t: "num", g: "Gleichung aufstellen", k: true, q: "Gleiche Gerade. Welchen Punkt erhältst du für t = 2? Gib die zweite Koordinate an.", a: 8, s: V(2, 4, 3) + " + 2·" + V(1, 2, -1) + " = " + V(4, 8, 1) + "." },
    { t: "num", g: "Gleichung aufstellen", q: "Gleiche Gerade, t = −1. Wie groß ist die dritte Koordinate?", a: 4, s: V(2, 4, 3) + " − " + V(1, 2, -1) + " = " + V(1, 2, 4) + "." },
    { t: "mc", g: "Gleichung aufstellen", k: true, q: "Was ist bei g: x = p + t·u der Stützvektor?", o: ["p, der Ortsvektor eines Punktes auf der Geraden", "u, die Richtung der Geraden", "t, der Parameter", "Der Abstand zum Ursprung"], a: 0, s: "Der Stützvektor zeigt vom Ursprung zu einem Punkt der Geraden. u gibt die Richtung an, t ist eine beliebige Zahl." },
    { t: "mc", g: "Gleichung aufstellen", q: "Welche Gleichung beschreibt dieselbe Gerade wie g: x = " + V(2, 4, 3) + " + t·" + V(1, 2, -1) + "?", o: ["x = " + V(3, 6, 2) + " + s·" + V(-2, -4, 2), "x = " + V(3, 6, 2) + " + s·" + V(2, 4, 2), "x = " + V(1, 2, -1) + " + s·" + V(2, 4, 3), "x = " + V(2, 4, 3) + " + s·" + V(1, 2, 1)], a: 0, s: "(3|6|2) liegt auf g (t = 1), und (−2|−4|2) = −2·(1|2|−1) ist kollinear zum Richtungsvektor." },
    { t: "num", g: "Punktprobe", k: true, q: "Liegt P(5|10|0) auf g: x = " + V(2, 4, 3) + " + t·" + V(1, 2, -1) + "? Gib das t an.", a: 3, s: "I 5 = 2 + t → t = 3. II 10 = 4 + 2t → t = 3. III 0 = 3 − t → t = 3. Dreimal gleich, P liegt auf g." },
    { t: "mc", g: "Punktprobe", k: true, q: "Liegt B(4|8|2) auf g: x = " + V(2, 4, 3) + " + t·" + V(1, 2, -1) + "?", o: ["Nein: I und II geben t = 2, III gibt t = 1", "Ja, weil I und II passen", "Ja, für t = 2", "Kann man nicht sagen"], a: 0, s: "I 4 = 2 + t → t = 2. II 8 = 4 + 2t → t = 2. III 2 = 3 − t → t = 1. Widerspruch, B liegt nicht auf g." },
    { t: "mc", g: "Punktprobe", q: "Liegt A(1|2|1) auf g: x = " + V(2, 4, 3) + " + t·" + V(1, 2, -1) + "?", o: ["Nein: I und II geben t = −1, III gibt t = 2", "Ja, für t = −1", "Ja, für t = 2", "Ja, weil alle Koordinaten positiv sind"], a: 0, s: "I 1 = 2 + t → t = −1. II 2 = 4 + 2t → t = −1. III 1 = 3 − t → t = 2. Widerspruch." },
    { t: "num", g: "Punktprobe", q: "g: x = " + V(2, -1, 0) + " + t·" + V(0, 2, 1) + ", A(2|1|1). Gib das t an, für das A herauskommt.", a: 1, s: "I 2 = 2 (immer wahr). II 1 = −1 + 2t → t = 1. III 1 = 0 + t → t = 1. A liegt auf g." },
    { t: "rev", g: "Punktprobe", k: true, q: "Schreib die Punktprobe für P(5|10|0) und g: x = " + V(2, 4, 3) + " + t·" + V(1, 2, -1) + " sauber auf, so wie in der Arbeit.", s: "Ansatz: " + V(5, 10, 0) + " = " + V(2, 4, 3) + " + t·" + V(1, 2, -1) + ".<br>I 5 = 2 + t ⇒ t = 3<br>II 10 = 4 + 2t ⇒ t = 3<br>III 0 = 3 − t ⇒ t = 3<br>Alle drei Gleichungen liefern t = 3, also liegt P auf g." }
   ] },
 { n: 4, date: "", wd: "", title: "Lage zweier Geraden", short: "6.3 Lagebeziehungen",
   goal: "Du kannst für zwei Geraden entscheiden, ob sie identisch, parallel, schneidend oder windschief sind, und den Schnittpunkt berechnen.",
   blocks: [
    ["10", "skript", "<b>Die vier Fälle.</b> Bild und Merkmale."],
    ["10", "skript", "<b>Entscheidungsbaum.</b> Erst Richtungsvektoren, dann Punktprobe oder LGS."],
    ["20", "skript", "<b>Schnittpunkt berechnen.</b> LGS aus zwei Zeilen lösen, mit der dritten prüfen, einsetzen."],
    ["25", "ueben", "<b>Übungen</b> unten."],
    ["5", "test", "<b>Selbsttest.</b> Den Entscheidungsbaum ohne Vorlage aufmalen."]
   ],
   notes: [["tip", "So gibt es Punkte", "Immer zuerst hinschreiben, ob die Richtungsvektoren kollinear sind. Am Ende ein Satz wie „Die Geraden schneiden sich im Punkt S(3|2|2).“"]],
   vids: [], links: [["Formeln", "#formeln"]],
   checks: ["Die vier Lagen zweier Geraden nennen und erklären", "Den Entscheidungsbaum anwenden", "Bei kollinearen Richtungen zwischen identisch und parallel unterscheiden", "Mit einem LGS den Schnittpunkt berechnen", "Windschief erkennen und begründen"],
   groups: ["Gleiche Richtung", "Verschiedene Richtung"],
   core: { b: [0, 1, 2, 3, 4], c: [0, 1, 2, 3, 4] },
   ex: [
    { t: "mc", g: "Gleiche Richtung", k: true, q: "g: x = " + V(1, 2, 3) + " + s·" + V(2, 4, 1) + ", h: x = " + V(3, 6, 4) + " + t·" + V(4, 8, 2) + ". Wie liegen sie?", o: ["Identisch", "Parallel", "Schneidend", "Windschief"], a: 0, s: "(4|8|2) = 2·(2|4|1), also gleiche Richtung. Punktprobe (3|6|4) auf g: I s = 1, II s = 1, III 4 = 3 + s → s = 1. Liegt drauf, also identisch." },
    { t: "mc", g: "Gleiche Richtung", k: true, q: "g: x = " + V(1, 2, 3) + " + s·" + V(2, 4, 1) + ", h: x = " + V(3, 6, 5) + " + t·" + V(4, 8, 2) + ". Wie liegen sie?", o: ["Parallel", "Identisch", "Schneidend", "Windschief"], a: 0, s: "Gleiche Richtung. Punktprobe (3|6|5): I und II geben s = 1, III 5 = 3 + s → s = 2. Widerspruch, also parallel." },
    { t: "num", g: "Gleiche Richtung", q: "Gleiche Geraden wie eben. Welches k gilt in " + V(4, 8, 2) + " = k·" + V(2, 4, 1) + "?", a: 2, s: "4 = 2k, 8 = 4k, 2 = k: überall k = 2." },
    { t: "num", g: "Verschiedene Richtung", k: true, q: "g: x = " + V(1, 2, 0) + " + s·" + V(1, 0, 1) + ", h: x = " + V(4, 1, 1) + " + t·" + V(-1, 1, 1) + ". Löse das LGS. Wie groß ist t?", a: 1, s: "I 1 + s = 4 − t. II 2 = 1 + t → t = 1. III s = 1 + t → s = 2. Probe mit I: 3 = 3, stimmt." },
    { t: "num", g: "Verschiedene Richtung", k: true, q: "Gleiche Geraden. Wie groß ist die erste Koordinate des Schnittpunkts S?", a: 3, s: "s = 2 in g: (1|2|0) + 2·(1|0|1) = (3|2|2)." },
    { t: "mc", g: "Verschiedene Richtung", k: true, q: "g: x = " + V(1, 2, 0) + " + s·" + V(1, 0, 1) + ", h: x = " + V(4, 1, 2) + " + t·" + V(-1, 1, 1) + ". Wie liegen sie?", o: ["Windschief", "Schneidend", "Parallel", "Identisch"], a: 0, s: "Nicht kollinear. II 2 = 1 + t → t = 1. III s = 2 + t → s = 3. Probe I: 1 + 3 = 4 − 1, also 4 = 3, falsch. Kein Schnittpunkt und nicht parallel: windschief." },
    { t: "num", g: "Verschiedene Richtung", k: true, q: "g: x = " + V(0, 1, 2) + " + s·" + V(2, 1, 0) + ", h: x = " + V(4, 0, 5) + " + t·" + V(0, 1, -1) + ". Wie groß ist s?", a: 2, s: "I 2s = 4 → s = 2. II 1 + s = t → t = 3. III 2 = 5 − t → t = 3. Passt." },
    { t: "num", g: "Verschiedene Richtung", q: "Gleiche Geraden. Wie groß ist die zweite Koordinate des Schnittpunkts?", a: 3, s: "s = 2 in g: (4|3|2)." },
    { t: "num", g: "Verschiedene Richtung", q: "Aufgabe aus dem Buch (S. 229/2a): g: x = " + V(1, 7, 9) + " + s·" + V(0, 1, 2) + ", h: x = " + V(3, 5, 5) + " + t·" + V(1, 1, 2) + ". Zweite Koordinate des Schnittpunkts?", a: 3, s: "I 1 = 3 + t → t = −2. II 7 + s = 5 + t → s = −4. III 9 + 2s = 5 + 2t → 1 = 1, stimmt. S = (1|3|1)." },
    { t: "mc", g: "Verschiedene Richtung", q: "Zwei Zeilen des LGS haben eine Lösung, aber die Probe mit der dritten ergibt eine falsche Aussage. Die Richtungen sind nicht kollinear. Was heißt das?", o: ["Die Geraden sind windschief", "Die Geraden schneiden sich", "Die Geraden sind parallel", "Man hat sich verrechnet"], a: 0, s: "Keine gemeinsame Lösung aller drei Gleichungen heißt kein Schnittpunkt. Bei nicht kollinearen Richtungen ist das windschief." },
    { t: "rev", g: "Verschiedene Richtung", k: true, q: "Zeichne den Entscheidungsbaum für die Lage zweier Geraden.", s: "1. Sind die Richtungsvektoren kollinear?<br>Ja → Punktprobe: Liegt der Stützpunkt von h auf g? Ja → identisch, nein → parallel.<br>Nein → LGS g = h: Gibt es eine Lösung (auch Probe mit der dritten Zeile)? Ja → schneiden sich (Schnittpunkt durch Einsetzen), nein → windschief." }
   ] },
 { n: 5, date: "", wd: "", title: "Winkel und Abstand", short: "6.4 und 6.5",
   goal: "Du kannst den Schnittwinkel einer Geraden mit einer Koordinatenebene und den Abstand eines Punktes von einer Geraden mit dem Lotfußpunkt berechnen.",
   blocks: [
    ["15", "skript", "<b>Schnittwinkel mit Koordinatenebene.</b> Richtungsvektor und seine „Schattenversion“ in der Ebene."],
    ["25", "skript", "<b>Abstand Punkt–Gerade.</b> Die vier Schritte mit Lotfußpunkt."],
    ["10", "skript", "<b>Abstand paralleler Geraden.</b> Einen Punkt nehmen, Abstand zur anderen Geraden."],
    ["25", "ueben", "<b>Übungen</b> unten."],
    ["5", "test", "<b>Selbsttest.</b> Die vier Schritte für den Abstand auswendig aufsagen."]
   ],
   notes: [["warn", "Fehler im Heft bei 6.5", "Im Beispiel Q(3|−2|5) steht d ≈ 5,2. Dort wurde t in QX eingesetzt (das ist schon der Vektor von Q zu F) und dann nochmal Q abgezogen. Richtig ist QF = (−4/7 | 1/7 | 2/7) und d = √21/7 ≈ 0,65."]],
   vids: [], links: [["Formeln", "#formeln"]],
   checks: ["Den Schnittwinkel einer Geraden mit jeder Koordinatenebene berechnen", "Wissen, welche Koordinate bei welcher Ebene 0 wird", "Den Lotfußpunkt mit QX · u = 0 bestimmen", "Den Abstand Punkt–Gerade berechnen", "Den Abstand paralleler Geraden auf Punkt–Gerade zurückführen"],
   groups: ["Winkel mit Koordinatenebene", "Abstand Punkt–Gerade"],
   core: { b: [0, 1, 3, 4], c: [0, 1, 2, 3] },
   ex: [
    { t: "num", g: "Winkel mit Koordinatenebene", k: true, q: "g: x = " + V(-2, 1, 6) + " + s·" + V(2, 1, -3) + ". Schnittwinkel mit der x₁x₂-Ebene in Grad? (eine Nachkommastelle)", a: 53.3, s: "x₁x₂-Ebene: x₃ = 0, also u' = (2|1|0). cos α = |4 + 1 + 0| / (√14·√5) = 5/√70 ≈ 0,598. α ≈ 53,3°." },
    { t: "num", g: "Winkel mit Koordinatenebene", k: true, q: "Gleiche Gerade. Schnittwinkel mit der x₁x₃-Ebene? (eine Nachkommastelle)", a: 15.5, s: "x₁x₃-Ebene: x₂ = 0, u' = (2|0|−3). cos α = 13/(√14·√13) ≈ 0,964. α ≈ 15,5°." },
    { t: "num", g: "Winkel mit Koordinatenebene", k: true, q: "Richtungsvektor " + V(1, 1, 1) + ". Schnittwinkel mit der x₁x₂-Ebene? (eine Nachkommastelle)", a: 35.3, s: "u' = (1|1|0). cos α = 2/(√3·√2) ≈ 0,816. α ≈ 35,3°." },
    { t: "num", g: "Winkel mit Koordinatenebene", q: "Richtungsvektor " + V(0, 3, 4) + ". Schnittwinkel mit der x₁x₂-Ebene? (eine Nachkommastelle)", a: 53.1, s: "u' = (0|3|0). cos α = 9/(5·3) = 0,6. α ≈ 53,1°." },
    { t: "mc", g: "Winkel mit Koordinatenebene", k: true, q: "Welche Koordinate setzt du im Richtungsvektor auf 0, wenn der Winkel mit der x₂x₃-Ebene gesucht ist?", o: ["x₁", "x₂", "x₃", "Keine"], a: 0, s: "Die x₂x₃-Ebene ist die Ebene mit x₁ = 0." },
    { t: "mc", g: "Winkel mit Koordinatenebene", q: "Der Richtungsvektor ist " + V(3, -1, 0) + ". Welchen Winkel hat die Gerade mit der x₁x₂-Ebene?", o: ["0°, sie verläuft parallel dazu", "90°", "45°", "Kann man nicht sagen"], a: 0, s: "x₃ ist schon 0, also ist u' = u und cos α = 1, α = 0°." },
    { t: "num", g: "Abstand Punkt–Gerade", k: true, q: "Q(5|1|4), g: x = " + V(1, 0, 2) + " + t·" + V(1, 1, 0) + ". Bestimme t für den Lotfußpunkt.", a: 2.5, s: "QX = (t − 4 | t − 1 | −2). QX · u = (t − 4) + (t − 1) + 0 = 2t − 5 = 0, also t = 2,5." },
    { t: "num", g: "Abstand Punkt–Gerade", k: true, q: "Gleiche Aufgabe. Wie groß ist der Abstand d? (zwei Nachkommastellen)", a: 2.92, s: "F = (3,5|2,5|2). QF = (−1,5|1,5|−2). d = √(2,25 + 2,25 + 4) = √8,5 ≈ 2,92." },
    { t: "num", g: "Abstand Punkt–Gerade", q: "Beispiel aus dem Unterricht, richtig gerechnet: Q(3|−2|5), g: x = " + V(1, 1, 1) + " + t·" + V(1, -2, 3) + ". Abstand d? (zwei Nachkommastellen)", a: 0.65, s: "QX = (t − 2 | 3 − 2t | 3t − 4). QX · u = 14t − 20 = 0 → t = 10/7. QF = (−4/7 | 1/7 | 2/7), d = √21/7 ≈ 0,65." },
    { t: "num", g: "Abstand Punkt–Gerade", k: true, q: "Q(6|1|3), g: x = " + V(1, 0, 2) + " + t·" + V(2, 1, -2) + ". Abstand d? (zwei Nachkommastellen)", a: 4.24, s: "QX = (2t − 5 | t − 1 | −1 − 2t). QX · u = 9t − 9 = 0 → t = 1, F = (3|1|0). QF = (−3|0|−3), d = √18 ≈ 4,24." },
    { t: "mc", g: "Abstand Punkt–Gerade", k: true, q: "Warum gilt beim Lotfußpunkt F die Bedingung QF · u = 0?", o: ["Weil der kürzeste Weg senkrecht auf der Geraden steht", "Weil F auf der Geraden liegt", "Weil Q der Ursprung ist", "Weil der Abstand 0 sein soll"], a: 0, s: "Der kürzeste Weg von Q zur Geraden ist das Lot. Senkrecht heißt Skalarprodukt 0." },
    { t: "rev", g: "Abstand Punkt–Gerade", q: "Wie bestimmst du den Abstand zweier paralleler Geraden g und h?", s: "Einen Punkt von h nehmen, zum Beispiel den Stützpunkt, und dessen Abstand zur Geraden g mit dem Lotfußpunkt-Verfahren berechnen. Bei parallelen Geraden ist der Abstand überall gleich." }
   ] },
 { n: 6, date: "", wd: "", title: "Modellieren mit Geraden", short: "6.6 Anwendungen",
   goal: "Du kannst Sachaufgaben (Schatten, Flugbahn, U-Boot, Körper) mit Geraden lösen: Spurpunkt, Weglänge und Volumen.",
   blocks: [
    ["15", "skript", "<b>Spurpunkt.</b> Wo trifft eine Gerade eine Koordinatenebene?"],
    ["15", "skript", "<b>Schatten.</b> Lichtstrahl als Gerade, Schattenpunkt als Spurpunkt."],
    ["10", "skript", "<b>Längen und Volumen.</b> Strecke = Betrag, Pyramide V = ⅓·G·h."],
    ["25", "ueben", "<b>Übungen</b> unten."],
    ["5", "test", "<b>Selbsttest.</b> Erklären, warum der Schattenpunkt ein Spurpunkt ist."]
   ],
   notes: [["tip", "Sachaufgaben", "Erst den Text in Mathe übersetzen: Was ist der Punkt, was die Richtung, welche Ebene ist der Boden oder die Wasseroberfläche? Danach ist es eine normale Spurpunkt-Aufgabe."]],
   vids: [], links: [["Zur Probeklausur", "#klausur"]],
   checks: ["Den Spurpunkt einer Geraden mit einer Koordinatenebene berechnen", "Den Schatten eines Punktes bei parallelem Licht berechnen", "Den Schatten bei einer punktförmigen Lichtquelle berechnen", "Weglängen über den Betrag berechnen", "Das Volumen einer Pyramide berechnen"],
   groups: ["Spurpunkt und Schatten", "Länge und Volumen"],
   core: { b: [0, 1, 2, 3, 4], c: [0, 1, 3, 4] },
   ex: [
    { t: "num", g: "Spurpunkt und Schatten", k: true, q: "g: x = " + V(2, 4, 3) + " + t·" + V(1, 2, -1) + ". In welchem Punkt trifft g die x₁x₂-Ebene? Gib die zweite Koordinate an.", a: 10, s: "x₃ = 0: 3 − t = 0 → t = 3. Einsetzen: (5|10|0)." },
    { t: "num", g: "Spurpunkt und Schatten", k: true, q: "Aus dem Unterricht: Spitze S(2|2|6), Licht in Richtung " + V(2, 4, -3) + ". Schattenpunkt auf der x₁x₂-Ebene, erste Koordinate?", a: 6, s: "Lichtgerade x = (2|2|6) + t·(2|4|−3). x₃ = 0: 6 − 3t = 0 → t = 2. S' = (6|10|0)." },
    { t: "num", g: "Spurpunkt und Schatten", k: true, q: "Punkt S(1|2|4), Licht in Richtung " + V(1, 1, -2) + ". Schattenpunkt auf dem Boden (x₁x₂-Ebene), erste Koordinate?", a: 3, s: "4 − 2t = 0 → t = 2. S' = (3|4|0)." },
    { t: "num", g: "Spurpunkt und Schatten", q: "Lampe im Punkt P(0|12|2), Ecke G(5|8|4). Der Schatten fällt auf die Wand x₂ = 0. Bei welchem t trifft der Strahl x = OP + t·PG die Wand?", a: 3, s: "PG = (5|−4|2). x₂ = 0: 12 − 4t = 0 → t = 3. Schatten (15|0|8)." },
    { t: "num", g: "Spurpunkt und Schatten", k: true, q: "U-Boot in A(10|20|−30), Richtung pro Minute " + V(-2, -4, 3) + ", Wasseroberfläche x₃ = 0. Nach wie vielen Minuten taucht es auf?", a: 10, s: "−30 + 3t = 0 → t = 10. Auftauchpunkt (−10|−20|0)." },
    { t: "num", g: "Länge und Volumen", k: true, q: "Gleiches U-Boot. Wie lang ist der Weg bis zum Auftauchpunkt? (zwei Nachkommastellen)", a: 53.85, s: "Weg = 10·|u| = 10·√(4 + 16 + 9) = 10·√29 ≈ 53,85." },
    { t: "num", g: "Länge und Volumen", q: "Drohne startet in A(2|1|0) und fliegt pro Minute um " + V(3, 4, 1) + ". Wie viele Einheiten ist sie geflogen, wenn sie die Höhe x₃ = 5 erreicht? (zwei Nachkommastellen)", a: 25.5, s: "x₃ = t = 5. Weg = 5·√(9 + 16 + 1) = 5·√26 ≈ 25,50." },
    { t: "num", g: "Länge und Volumen", k: true, q: "Pyramide mit quadratischer Grundfläche A(0|0|0), B(4|0|0), C(4|4|0), D(0|4|0) und Spitze S(2|2|6). Volumen?", a: 32, s: "G = |AB|·|AD| = 4·4 = 16. h = 6 (x₃ der Spitze). V = ⅓·16·6 = 32." },
    { t: "num", g: "Länge und Volumen", q: "Pyramide mit rechteckiger Grundfläche 3 × 5 in der x₁x₂-Ebene und Spitze in Höhe 6. Volumen?", a: 30, s: "V = ⅓·15·6 = 30." },
    { t: "num", g: "Länge und Volumen", k: true, q: "B(5|2|0). Wie weit ist B von der x₁x₃-Ebene entfernt?", a: 2, s: "Der Abstand zur x₁x₃-Ebene ist der Betrag von x₂, also 2." },
    { t: "rev", g: "Länge und Volumen", k: true, q: "Schreib das Rezept für eine Schattenaufgabe bei parallelem Licht auf.", s: "1. Lichtgerade aufstellen: Punkt des Gegenstands als Stützvektor, Lichtrichtung als Richtungsvektor.<br>2. Ebene des Schattens festlegen, z. B. Boden x₃ = 0.<br>3. Passende Koordinate der Geraden gleich 0 setzen, t ausrechnen.<br>4. t einsetzen, das ist der Schattenpunkt.<br>Bei einer Lampe als Punkt: Gerade durch Lampe und Gegenstandspunkt." }
   ] }
];

export const MAT_LESSONS: Record<number, Lesson[]> = {
 1: [
  { t: "Das Koordinatensystem im Raum", g: "Punkte und Ebenen", k: true, h:
   "<p>Im Raum gibt es drei Achsen: <b>x₁</b> kommt schräg auf dich zu, <b>x₂</b> geht nach rechts, <b>x₃</b> nach oben. Ein Punkt hat drei Koordinaten, zum Beispiel P(2|3|4).</p>" + svgAxes() +
   TAB(["Ebene", "Bedingung", "Beispiel"], [["x₁x₂-Ebene (Boden)", "x₃ = 0", "(3|−1|0)"], ["x₁x₃-Ebene", "x₂ = 0", "(3|0|−1)"], ["x₂x₃-Ebene", "x₁ = 0", "(0|−1|3)"]]) +
   LK("Die Ebene heißt nach den zwei Achsen, die drin liegen. Die fehlende Koordinate ist 0.") },
  { t: "Vektoren und Verbindungsvektor", g: "Vektoren rechnen", k: true, h:
   "<p>Ein Vektor ist ein Pfeil mit Richtung und Länge. Man schreibt ihn als Spalte, z. B. " + V(3, -2, 2) + ".</p>" +
   LF("AB = B − A &nbsp;&nbsp; (Spitze minus Fuß)") +
   LX("<p>A(1|2|3), B(4|0|5): AB = " + V("4 − 1", "0 − 2", "5 − 3") + " = " + V(3, -2, 2) + "</p>") +
   "<p>Der <b>Ortsvektor</b> eines Punktes geht vom Ursprung zum Punkt: OP hat dieselben Zahlen wie P.</p>" },
  { t: "Mit Vektoren rechnen", g: "Vektoren rechnen", k: true, h:
   "<p>Alles geht Zeile für Zeile:</p><ul><li><b>Addieren:</b> " + V(1, 2, 3) + " + " + V(4, 0, -1) + " = " + V(5, 2, 2) + "</li><li><b>Mit Zahl malnehmen:</b> 3·" + V(1, -2, 0) + " = " + V(3, -6, 0) + "</li><li><b>Mittelpunkt:</b> M = ½·(A + B)</li></ul>" +
   LX("<p>Quader mit A(1|2|0), B(5|2|0), D(1|8|0): C = B + AD = " + V(5, 2, 0) + " + " + V(0, 6, 0) + " = (5|8|0). Die Kante AD wird an B angehängt.</p>") },
  { t: "LGS mit drei Gleichungen und zwei Unbekannten", g: "LGS", k: true, h:
   "<p>Bei Punktprobe und Lagebeziehung entstehen drei Gleichungen (eine pro Koordinate), aber nur ein oder zwei Unbekannte.</p><ol><li>Zwei Gleichungen nehmen und s und t ausrechnen.</li><li>Mit der dritten Gleichung die <b>Probe</b> machen.</li><li>Wahre Aussage (z. B. 2 = 2): Lösung passt. Falsche Aussage (z. B. 4 = 3): keine gemeinsame Lösung.</li></ol>" +
   LX("<p>I s − t = 2, II s + t = 6, III 2s − 3t = 2</p><p>I + II: 2s = 8 → s = 4, t = 2. Probe III: 8 − 6 = 2, stimmt.</p>") +
   LK("Ohne Probe mit der dritten Gleichung ist die Rechnung nicht fertig.") },
  { t: "Taschenrechner für morgen", g: "Taschenrechner", k: true, h:
   "<ul><li>Modus <b>DEG</b> für Winkel in Grad. Prüfe: arccos(0,5) muss 60 ergeben.</li><li>arccos ist SHIFT + cos.</li><li>Wurzel aus der ganzen Summe: √(4 + 1 + 4), nicht √4 + 1 + 4.</li><li>Negative Zahlen beim Quadrieren in Klammern: (−1)² = 1.</li></ul>" }
 ],
 2: [
  { t: "Länge eines Vektors und Abstand zweier Punkte", g: "Länge und Abstand", k: true, h:
   LF("|a| = √(a₁² + a₂² + a₃²) &nbsp;&nbsp; d(A, B) = |AB|") +
   LX("<p>A(3|−5|1), B(7|2|1): AB = " + V(4, 7, 0) + ", |AB| = √(16 + 49 + 0) = √65 ≈ 8,06</p>") +
   LK("Im gezeichneten 3D-Bild kann man keine Längen ablesen, weil die x₁-Achse verzerrt ist. Immer rechnen.") },
  { t: "Das Skalarprodukt", g: "Skalarprodukt und Winkel", k: true, h:
   "<p>Zeilen malnehmen, alles addieren. Heraus kommt <b>eine Zahl</b>, kein Vektor.</p>" +
   LF(V("a₁", "a₂", "a₃") + " · " + V("b₁", "b₂", "b₃") + " = a₁b₁ + a₂b₂ + a₃b₃") +
   LX("<p>" + V(2, 6, 4) + " · " + V(4, 4, 6) + " = 8 + 24 + 24 = 56</p>") },
  { t: "Winkel zwischen zwei Vektoren", g: "Skalarprodukt und Winkel", k: true, h:
   LF("cos α = (a · b) / (|a| · |b|) &nbsp;&nbsp; α = arccos(…)") +
   LX("<p>a = " + V(1, 2) + ", b = " + V(3, 1) + " (Beispiel aus dem Unterricht)</p><ol><li>a · b = 3 + 2 = 5</li><li>|a| = √5, |b| = √10</li><li>α = arccos(5/(√5·√10)) = 45°</li></ol>") +
   LK("0° ≤ α ≤ 180°. Taschenrechner auf DEG.") },
  { t: "Orthogonal und kollinear", g: "Orthogonal und kollinear", k: true, h:
   "<p><b>Orthogonal</b> (senkrecht): Das Skalarprodukt ist 0, weil cos 90° = 0.</p>" +
   LX("<p>" + V(-2, 1, -2) + " · " + V(3, 8, 1) + " = −6 + 8 − 2 = 0, also senkrecht.</p>") +
   "<p><b>Kollinear</b> (gleiche oder entgegengesetzte Richtung): a = c · b mit <b>demselben c in allen drei Zeilen</b>.</p>" +
   LX("<p>" + V(2, -1, 4) + " = c · " + V(4, -2, 8) + ": I c = ½, II c = ½, III c = ½. Kollinear.</p>") +
   LK("Orthogonal: Skalarprodukt 0. Kollinear: überall dasselbe c.") }
 ],
 3: [
  { t: "Die Parametergleichung einer Geraden", g: "Gleichung aufstellen", k: true, h:
   LF("g: x = p + t · u") +
   TAB(["Teil", "Bedeutung"], [["p (Stützvektor)", "Ortsvektor eines Punktes auf der Geraden"], ["u (Richtungsvektor)", "Richtung der Geraden"], ["t (Parameter)", "beliebige Zahl, jedes t ergibt einen Punkt"]]) +
   LX("<p>Gerade durch P(2|4|3) und Q(3|6|2): u = PQ = " + V(1, 2, -1) + "</p><p>g: x = " + V(2, 4, 3) + " + t · " + V(1, 2, -1) + "</p>") +
   LK("Durch zwei Punkte A und B: x = OA + t · AB.") },
  { t: "Punkte auf der Geraden", g: "Gleichung aufstellen", h:
   "<p>Setz eine Zahl für t ein. t = 0 gibt den Stützpunkt, t = 1 den zweiten Punkt, t = 2 noch einen Schritt weiter.</p>" +
   LX("<p>t = 2: " + V(2, 4, 3) + " + 2 · " + V(1, 2, -1) + " = (4|8|1)</p>") +
   "<p>Eine Gerade hat viele Gleichungen: Jeder Punkt auf ihr kann Stützpunkt sein, jedes Vielfache von u Richtungsvektor.</p>" },
  { t: "Die Punktprobe", g: "Punktprobe", k: true, h:
   "<p>Frage: Liegt ein Punkt auf der Geraden? Setz den Punkt gleich die Gerade und rechne jede Zeile nach t aus.</p>" +
   LX("<p>Liegt B(4|8|2) auf g: x = " + V(2, 4, 3) + " + t · " + V(1, 2, -1) + "?</p><p>I 4 = 2 + t → t = 2<br>II 8 = 4 + 2t → t = 2<br>III 2 = 3 − t → t = 1</p><p>Verschiedene t, also liegt B <b>nicht</b> auf g.</p>") +
   LK("Dreimal dasselbe t: Punkt liegt drauf. Sonst nicht.") }
 ],
 4: [
  { t: "Die vier möglichen Lagen", g: "Gleiche Richtung", k: true, h:
   svgLines() +
   TAB(["Lage", "Richtungsvektoren", "gemeinsame Punkte"], [["identisch", "kollinear", "unendlich viele"], ["parallel", "kollinear", "keine"], ["schneidend", "nicht kollinear", "genau einer"], ["windschief", "nicht kollinear", "keine"]]) +
   LK("Windschief gibt es nur im Raum: Die Geraden laufen aneinander vorbei, wie eine Brücke über eine Straße.") },
  { t: "Der Entscheidungsbaum", g: "Verschiedene Richtung", k: true, h:
   "<ol><li><b>Sind u und v kollinear?</b></li><li>Ja → <b>Punktprobe</b>: Liegt der Stützpunkt von h auf g? Ja → identisch. Nein → parallel.</li><li>Nein → <b>LGS</b> g = h lösen. Lösbar (auch Probe mit der dritten Zeile) → schneiden, Schnittpunkt durch Einsetzen. Nicht lösbar → windschief.</li></ol>" },
  { t: "Schnittpunkt berechnen", g: "Verschiedene Richtung", k: true, h:
   LX("<p>g: x = " + V(1, 2, 0) + " + s · " + V(1, 0, 1) + ", h: x = " + V(4, 1, 1) + " + t · " + V(-1, 1, 1) + "</p><ol><li>Nicht kollinear (I: 1 = −c, II: 0 = c, Widerspruch).</li><li>LGS: I 1 + s = 4 − t, II 2 = 1 + t, III s = 1 + t</li><li>II: t = 1. III: s = 2. Probe I: 3 = 3, stimmt.</li><li>s = 2 in g: S(3|2|2).</li></ol>") +
   LK("Zum Schluss den Schnittpunkt mit s in g <b>und</b> zur Kontrolle mit t in h ausrechnen. Beides muss gleich sein.") },
  { t: "Windschief erkennen", g: "Verschiedene Richtung", h:
   LX("<p>g: x = " + V(1, 2, 0) + " + s · " + V(1, 0, 1) + ", h: x = " + V(4, 1, 2) + " + t · " + V(-1, 1, 1) + "</p><p>II: 2 = 1 + t → t = 1. III: s = 2 + t → s = 3. Probe I: 1 + 3 = 4 − 1, also 4 = 3, falsch.</p><p>Nicht kollinear und kein Schnittpunkt: windschief.</p>") }
 ],
 5: [
  { t: "Schnittwinkel mit einer Koordinatenebene", g: "Winkel mit Koordinatenebene", k: true, h:
   "<p>Methode aus dem Unterricht: Man nimmt den Richtungsvektor u und eine Kopie u', bei der die Koordinate der Ebene auf 0 gesetzt ist. Das ist die Richtung des „Schattens“ der Geraden in der Ebene.</p>" +
   LF("cos α = |u · u'| / (|u| · |u'|)") +
   TAB(["Ebene", "auf 0 setzen"], [["x₁x₂", "x₃"], ["x₁x₃", "x₂"], ["x₂x₃", "x₁"]]) +
   LX("<p>u = " + V(2, 1, -3) + ", x₁x₂-Ebene: u' = " + V(2, 1, 0) + "</p><p>cos α = |4 + 1 + 0| / (√14 · √5) = 5/√70 ≈ 0,598 → α ≈ 53,3°</p>") +
   LK("Der Betrag im Zähler sorgt dafür, dass der Winkel zwischen 0° und 90° liegt.") },
  { t: "Abstand eines Punktes von einer Geraden", g: "Abstand Punkt–Gerade", k: true, h:
   svgLot() +
   "<p>Der Abstand ist die Länge des Lots von Q auf g. Der Punkt, wo das Lot die Gerade trifft, heißt <b>Lotfußpunkt F</b>.</p><ol><li>Allgemeiner Punkt X der Geraden: OX = p + t · u</li><li>Verbindungsvektor QX = OX − OQ (enthält t)</li><li>Bedingung QX · u = 0 → t ausrechnen</li><li>t in QX einsetzen, das ist QF. Abstand d = |QF|</li></ol>" +
   LX("<p>Q(5|1|4), g: x = " + V(1, 0, 2) + " + t · " + V(1, 1, 0) + "</p><ol><li>QX = " + V("1 + t − 5", "t − 1", "2 − 4") + " = " + V("t − 4", "t − 1", -2) + "</li><li>QX · u = (t − 4) + (t − 1) + 0 = 2t − 5 = 0 → t = 2,5</li><li>QF = " + V("−1,5", "1,5", -2) + ", F = (3,5|2,5|2)</li><li>d = √(2,25 + 2,25 + 4) = √8,5 ≈ 2,92</li></ol>") +
   LK("Nach dem Einsetzen von t in QX hast du schon den Vektor QF. Nicht nochmal Q abziehen.") },
  { t: "Abstand paralleler Geraden", g: "Abstand Punkt–Gerade", h:
   "<p>Bei parallelen Geraden ist der Abstand überall gleich. Nimm den Stützpunkt von h als Q und berechne wie oben seinen Abstand zu g.</p>" }
 ],
 6: [
  { t: "Spurpunkte", g: "Spurpunkt und Schatten", k: true, h:
   "<p>Ein Spurpunkt ist der Punkt, an dem eine Gerade eine Koordinatenebene trifft.</p><ol><li>Koordinate der Ebene in der Geradengleichung gleich 0 setzen.</li><li>t ausrechnen.</li><li>t einsetzen.</li></ol>" +
   LX("<p>g: x = " + V(2, 4, 3) + " + t · " + V(1, 2, -1) + ", Spurpunkt mit der x₁x₂-Ebene: 3 − t = 0 → t = 3 → (5|10|0)</p>") },
  { t: "Schattenwurf", g: "Spurpunkt und Schatten", k: true, h:
   "<p><b>Paralleles Licht (Sonne):</b> Lichtgerade durch den Punkt des Gegenstands mit der Lichtrichtung als Richtungsvektor. Der Schatten ist der Spurpunkt mit dem Boden.</p>" +
   LX("<p>Aus dem Unterricht: Spitze S(2|2|6), Licht " + V(2, 4, -3) + "</p><p>g: x = " + V(2, 2, 6) + " + t · " + V(2, 4, -3) + ". x₃ = 0: 6 − 3t = 0 → t = 2. S' = (6|10|0)</p>") +
   "<p><b>Lampe als Punkt P:</b> Gerade durch P und den Gegenstandspunkt G, also Richtung PG. Danach wieder Spurpunkt mit der Wand oder dem Boden.</p>" +
   LK("Schattenpunkt = Spurpunkt der Lichtgeraden.") },
  { t: "Weglängen, Zeiten und Volumen", g: "Länge und Volumen", k: true, h:
   "<ul><li><b>Weglänge</b> von A nach P: |AP|. Bewegt sich etwas pro Minute um u, ist der Weg nach t Minuten t · |u|.</li><li><b>Abstand zu einer Koordinatenebene:</b> der Betrag der fehlenden Koordinate. B(5|2|0) hat zur x₁x₃-Ebene den Abstand 2.</li><li><b>Pyramide:</b> V = ⅓ · G · h. Liegt die Grundfläche im Boden, ist h die x₃-Koordinate der Spitze.</li><li><b>Quader:</b> V = Länge · Breite · Höhe, die Kanten als Beträge.</li></ul>" +
   LX("<p>U-Boot in A(10|20|−30), pro Minute " + V(-2, -4, 3) + ". Auftauchen: −30 + 3t = 0 → t = 10. Punkt (−10|−20|0). Weg: 10 · √29 ≈ 53,85.</p>") }
 ]
};

export const MAT_REVIEW: Record<number, Review> = {
 1: { points: ["AB = B − A (Spitze minus Fuß).", "x₁x₂-Ebene: x₃ = 0, x₁x₃: x₂ = 0, x₂x₃: x₁ = 0.", "LGS: zwei Gleichungen lösen, mit der dritten prüfen. Taschenrechner auf DEG."], q: [
  { t: "num", q: "A(2|0|−1), B(5|4|−1). Zweite Koordinate von AB?", a: 4, s: "4 − 0 = 4" },
  { t: "mc", q: "Welcher Punkt liegt in der x₂x₃-Ebene?", o: ["(0|2|5)", "(2|0|5)", "(2|5|0)", "(1|1|1)"], a: 0, s: "x₂x₃-Ebene: x₁ = 0." },
  { t: "num", q: "arccos(0) in Grad?", a: 90, s: "cos 90° = 0." }
 ] },
 2: { points: ["|a| = √(a₁² + a₂² + a₃²).", "cos α = (a · b)/(|a| · |b|).", "Orthogonal: a · b = 0. Kollinear: a = c · b mit gleichem c."], q: [
  { t: "num", q: "Länge von " + V(1, 2, 2) + "?", a: 3, s: "√(1 + 4 + 4) = 3" },
  { t: "num", q: V(1, 2, 3) + " · " + V(2, 0, -1) + " = ?", a: -1, s: "2 + 0 − 3 = −1" },
  { t: "mc", q: "Skalarprodukt 0 bedeutet …", o: ["Die Vektoren stehen senkrecht", "Die Vektoren sind gleich", "Die Vektoren sind kollinear", "Ein Vektor ist 0"], a: 0, s: "cos 90° = 0." }
 ] },
 3: { points: ["g: x = p + t · u.", "Durch A und B: x = OA + t · AB.", "Punktprobe: dreimal dasselbe t?"], q: [
  { t: "num", q: "g durch A(1|1|1) und B(3|0|2). Erste Koordinate des Richtungsvektors?", a: 2, s: "AB = (2|−1|1)" },
  { t: "num", q: "Gleiche Gerade, t = 2. Dritte Koordinate des Punkts?", a: 3, s: "1 + 2 · 1 = 3, Punkt (5|−1|3)." },
  { t: "mc", q: "Punktprobe: I t = 2, II t = 2, III t = 5. Ergebnis?", o: ["Liegt nicht drauf", "Liegt drauf", "Liegt drauf für t = 2", "Unentscheidbar"], a: 0, s: "Nicht überall dasselbe t." }
 ] },
 4: { points: ["Kollinear → Punktprobe → identisch oder parallel.", "Nicht kollinear → LGS → schneiden oder windschief.", "Probe mit der dritten Gleichung nicht vergessen."], q: [
  { t: "mc", q: "Richtungen kollinear, Stützpunkt von h liegt nicht auf g. Lage?", o: ["Parallel", "Identisch", "Windschief", "Schneidend"], a: 0, s: "Gleiche Richtung, aber verschoben." },
  { t: "mc", q: "Nicht kollinear, LGS ohne Lösung. Lage?", o: ["Windschief", "Parallel", "Schneidend", "Identisch"], a: 0, s: "Kein Schnittpunkt, verschiedene Richtungen." },
  { t: "num", q: "Das LGS ergibt s = 1 bei g: x = " + V(0, 1, 2) + " + s · " + V(3, 0, 1) + ". Erste Koordinate des Schnittpunkts?", a: 3, s: "0 + 1 · 3 = 3" }
 ] },
 5: { points: ["Winkel mit Ebene: Koordinate in u auf 0 → u', cos α = |u · u'|/(|u| · |u'|).", "Abstand: QX · u = 0 → t → QF → |QF|.", "Nach dem Einsetzen von t ist QX schon QF."], q: [
  { t: "mc", q: "Winkel mit der x₁x₃-Ebene: welche Koordinate auf 0?", o: ["x₂", "x₁", "x₃", "keine"], a: 0, s: "x₁x₃-Ebene heißt x₂ = 0." },
  { t: "num", q: "QX = (t − 1 | 2t | 3), u = (1|2|0). t aus QX · u = 0?", a: 0.2, s: "(t − 1) + 4t = 5t − 1 = 0 → t = 0,2" },
  { t: "num", q: "QF = (2|−1|2). Abstand?", a: 3, s: "√(4 + 1 + 4) = 3" }
 ] },
 6: { points: ["Spurpunkt: Koordinate der Ebene = 0, t ausrechnen, einsetzen.", "Schatten = Spurpunkt der Lichtgeraden.", "Weglänge = t · |u|, Pyramide V = ⅓ · G · h."], q: [
  { t: "num", q: "g: x = (1|1|4) + t · (1|0|−2). Bei welchem t trifft g den Boden (x₃ = 0)?", a: 2, s: "4 − 2t = 0 → t = 2" },
  { t: "num", q: "Pyramide: G = 9, h = 4. Volumen?", a: 12, s: "⅓ · 9 · 4 = 12" },
  { t: "num", q: "Pro Minute (2|1|2), 3 Minuten. Weg?", a: 9, s: "3 · √(4 + 1 + 4) = 3 · 3 = 9" }
 ] }
};

export const MAT_TIPS: Record<string, string> = {
 "1.0": "Welche Koordinate ist in der x₁x₂-Ebene 0?", "1.1": "Auf einer Achse sind die anderen zwei Koordinaten 0.", "1.2": "Zwei Ebenen heißt zwei Nullen, aber x₁ darf nicht 0 sein.", "1.3": "B − A, erste Zeile: 4 − 1.", "1.4": "Zweite Zeile: 0 − 2.",
 "1.5": "Erst mal 2, dann Zeile für Zeile addieren.", "1.6": "Beide Punkte addieren, dann halbieren.", "1.7": "C = B + AD, und AD = D − A.", "1.8": "Addiere I und II.", "1.9": "s einsetzen in II.",
 "1.10": "s = 4 und t = 2 in III einsetzen.", "1.11": "Bei welchem Winkel ist cos = 0,5?", "1.12": "Erst alle Quadrate addieren, dann die Wurzel.", "1.13": "1,047 = π/3.",
 "2.0": "Quadrate addieren, Wurzel ziehen.", "2.1": "√(3² + (−5)² + 1²)", "2.2": "Erst AB = B − A, dann Betrag.", "2.3": "AB = (3|−2|2).", "2.4": "Zeilen malnehmen, addieren.",
 "2.5": "a · b, |a|, |b|, dann arccos.", "2.6": "a · b = 1, beide Längen √2.", "2.7": "|b| = √(16 + 16 + 36) = √68, nicht 8.", "2.8": "Erst das Skalarprodukt.", "2.9": "Bei welchem Paar ist das Skalarprodukt 0?",
 "2.10": "Skalarprodukt mit k aufschreiben und = 0 setzen.", "2.11": "Jede Zeile einzeln nach c auflösen.", "2.12": "c aus jeder Zeile ausrechnen und vergleichen.", "2.13": "Schau dir die x₁-Achse in der Zeichnung an.",
 "3.0": "u = Q − P.", "3.1": "p + 2 · u", "3.2": "p − u", "3.3": "Wer zeigt auf einen Punkt der Geraden?", "3.4": "Liegt der neue Stützpunkt auf g, und ist die Richtung ein Vielfaches?",
 "3.5": "Jede Zeile nach t auflösen.", "3.6": "Dritte Zeile: 2 = 3 − t.", "3.7": "Dritte Zeile: 1 = 3 − t.", "3.8": "Die erste Zeile ist immer wahr, nimm II.", "3.9": "Ansatz, drei Zeilen, Satz.",
 "4.0": "Kollinear? Dann Punktprobe mit (3|6|4).", "4.1": "Punktprobe mit (3|6|5), dritte Zeile beachten.", "4.2": "4 durch 2.", "4.3": "Die zweite Zeile hat nur t.", "4.4": "s = 2 in g einsetzen.",
 "4.5": "II und III lösen, dann Probe mit I.", "4.6": "Die erste Zeile hat nur s.", "4.7": "s = 2 in g.", "4.8": "Die erste Zeile hat nur t.", "4.9": "Keine Lösung aller drei Gleichungen.",
 "4.10": "Erste Frage: Richtungsvektoren kollinear?",
 "5.0": "x₃ in u auf 0 setzen.", "5.1": "x₂ in u auf 0 setzen.", "5.2": "u' = (1|1|0).", "5.3": "u' = (0|3|0), |u| = 5.", "5.4": "Welche Achse liegt nicht in der Ebene?",
 "5.5": "u' ist gleich u.", "5.6": "QX = OX − OQ, dann mal u.", "5.7": "QF = F − Q, dann Betrag.", "5.8": "QX · u = 14t − 20.", "5.9": "QX · u = 9t − 9.",
 "5.10": "Was ist der kürzeste Weg zu einer Geraden?", "5.11": "Parallele Geraden haben überall denselben Abstand.",
 "6.0": "x₃ = 0 setzen.", "6.1": "6 − 3t = 0.", "6.2": "4 − 2t = 0.", "6.3": "Richtung PG = G − P = (5|−4|2).", "6.4": "−30 + 3t = 0.",
 "6.5": "10 · |u|", "6.6": "t = 5, dann 5 · |u|.", "6.7": "V = ⅓ · G · h", "6.8": "G = 15.", "6.9": "Welche Koordinate fehlt in der x₁x₃-Ebene?",
 "6.10": "Lichtgerade, Ebene, Koordinate = 0, einsetzen."
};

export const MAT_REVIEW_TIPS: Record<string, string> = {
 "1.0": "4 − 0", "1.1": "x₁ = 0", "1.2": "Wo ist cos = 0?",
 "2.0": "√9", "2.1": "1·2 + 2·0 + 3·(−1)", "2.2": "cos 90°",
 "3.0": "B − A", "3.1": "Dritte Zeile: 1 + 2 · 1", "3.2": "Dreimal gleich?",
 "4.0": "Gleiche Richtung, kein gemeinsamer Punkt.", "4.1": "Verschiedene Richtung, kein Punkt.", "4.2": "0 + 1 · 3",
 "5.0": "x₁x₃ ohne x₂", "5.1": "(t − 1) + 2 · 2t", "5.2": "√(4 + 1 + 4)",
 "6.0": "4 − 2t = 0", "6.1": "⅓ · 9 · 4", "6.2": "|u| = 3"
};

export const MAT_EXAM: ExamTask[] = [
 { n: 1, title: "Dreieck", p: 7, q: "Gegeben sind A(1|0|2), B(3|1|0) und C(2|2|4).<br>a) Berechnen Sie die Vektoren AB und AC und ihre Längen.<br>b) Zeigen Sie, dass das Dreieck ABC bei A einen rechten Winkel hat.<br>c) Berechnen Sie den Flächeninhalt des Dreiecks.", s: "a) AB = (2|1|−2), |AB| = 3. AC = (1|2|2), |AC| = 3 (3 P).<br>b) AB · AC = 2 + 2 − 4 = 0, also senkrecht bei A (2 P).<br>c) A = ½ · 3 · 3 = 4,5 (2 P)." },
 { n: 2, title: "Gerade und Punktprobe", p: 6, q: "a) Stellen Sie eine Gleichung der Geraden g durch A(1|0|2) und B(3|1|0) auf.<br>b) Prüfen Sie, ob P(7|3|−4) und Q(5|2|1) auf g liegen.", s: "a) g: x = (1|0|2) + t · (2|1|−2) (2 P).<br>b) P: I 7 = 1 + 2t → t = 3, II 3 = t → t = 3, III −4 = 2 − 2t → t = 3. P liegt auf g (2 P).<br>Q: I t = 2, II t = 2, III 1 = 2 − 2t → t = 0,5. Q liegt nicht auf g (2 P)." },
 { n: 3, title: "Lagebeziehungen", p: 9, q: "g: x = (1|0|2) + t · (2|1|−2), h: x = (3|−1|−2) + s · (0|1|1), k: x = (0|0|0) + r · (−4|−2|4).<br>a) Untersuchen Sie die Lage von g und h. Berechnen Sie gegebenenfalls den Schnittpunkt.<br>b) Untersuchen Sie die Lage von g und k.", s: "a) Nicht kollinear. LGS: I 1 + 2t = 3 → t = 1. II t = −1 + s → s = 2. III 2 − 2t = −2 + s → 0 = 0, stimmt. Schnittpunkt S(3|1|0) (5 P).<br>b) (−4|−2|4) = −2 · (2|1|−2), kollinear. Punktprobe (0|0|0) auf g: I t = −0,5, II t = 0. Widerspruch, also parallel (4 P)." },
 { n: 4, title: "Schnittwinkel", p: 5, q: "Berechnen Sie den Schnittwinkel der Geraden g: x = (1|0|2) + t · (2|1|−2) mit der x₁x₂-Ebene.", s: "u' = (2|1|0). cos α = |4 + 1 + 0| / (3 · √5) ≈ 0,745 (3 P). α ≈ 41,8° (2 P)." },
 { n: 5, title: "Abstand Punkt–Gerade", p: 8, q: "Berechnen Sie den Abstand des Punktes Q(6|1|3) von der Geraden g: x = (1|0|2) + t · (2|1|−2) und geben Sie den Lotfußpunkt an.", s: "QX = (2t − 5 | t − 1 | −1 − 2t) (2 P). QX · u = 9t − 9 = 0 → t = 1 (3 P). F(3|1|0), QF = (−3|0|−3) (1 P). d = √18 ≈ 4,24 (2 P)." },
 { n: 6, title: "Heißluftballon", p: 10, q: "Ein Ballon schwebt im Punkt B(4|6|8) (Einheit 10 m). Die Sonne scheint in Richtung (1|−2|−4). Der Boden ist die x₁x₂-Ebene.<br>a) Berechnen Sie den Schattenpunkt des Ballons auf dem Boden.<br>b) Wie weit ist der Ballon von seinem Schatten entfernt (in Metern)?<br>c) Ein Vogel fliegt auf der Geraden v: x = (0|0|8) + r · (1|1|0). Trifft er den Ballon?", s: "a) x = (4|6|8) + t · (1|−2|−4). 8 − 4t = 0 → t = 2. Schatten (6|2|0) (4 P).<br>b) |(2|−4|−8)| = √84 ≈ 9,17, also etwa 91,7 m (3 P).<br>c) Punktprobe B auf v: I r = 4, II r = 6. Widerspruch, er trifft den Ballon nicht (3 P)." }
];

export const MAT_EXAM_TIPS: Record<string, string> = {
 1: "b) Skalarprodukt AB · AC. c) Rechtwinklig: ½ · Kathete · Kathete.",
 2: "a) Richtungsvektor AB. b) Drei Zeilen, dreimal dasselbe t?",
 3: "Erst kollinear prüfen. a) Die erste Zeile hat nur t. b) Faktor −2.",
 4: "x₃ in u auf 0 setzen.",
 5: "QX aufstellen, QX · u = 0.",
 6: "a) x₃ = 0. b) Betrag von B zum Schatten, mal 10. c) Punktprobe."
};

export const MAT_META: CourseMeta = {
 brand: "Vektorgeometrie",
 label: "Mathe",
 word: "Teil",
 unitsLabel: "Lernteile",
 eyebrow: "Mathe · Vektorgeometrie 6 bis 6.6 · Arbeit am Donnerstag, 12.11.",
 topic: "in der Vektorarbeit.",
 intro: "6 Lernteile für heute Abend, aufgebaut auf eurem OneNote „MgAN 2025_2026“, Abschnitt I Analysis, Seiten 6 bis 6.6. Teil 1 frischt alles auf, was du dafür brauchst. Gute Note dauert etwa 3 Stunden, 15 Punkte etwa 5. Morgen früh nur noch Formeln und Fehlerheft.",
 goal15: "Alles: jede Erklärung, alle Übungen, Sonderfälle wie Abstand paralleler Geraden und Schatten mit Lampe. Etwa 5 Stunden.",
 goalGut: "Nur das, was sicher drankommt: Grundlagen, Winkel, Gerade, Punktprobe, Lage, Abstand, Schatten. Etwa 3 Stunden.",
 how: "Jeder Teil beginnt mit „Erst verstehen“: kurze Erklärungen mit Rechenbeispiel. Danach Übungen direkt hier, eine Checkliste „Du kannst …“ und drei Wiederholungsfragen. Zum Schluss die Probeklausur. Ab 90 % bist du bereit. Taschenrechner auf DEG!",
 navExam: "60 min, " + MAT_EXAM.reduce((a, t) => a + t.p, 0) + " Punkte",
 examMins: 60,
 examEyebrow: "Wie in der Arbeit",
 examLede: "Nur Taschenrechner (DEG), keine Unterlagen. Alle Themen von 6.1 bis 6.6 mit neuen Zahlen. Erst nach dem Timer die Lösungen aufklappen und Punkte eintragen.",
 beforeExam: "Vor der Arbeit",
 formulasEyebrow: "Alles für morgen auf einer Seite",
 formulasTitle: "Formeln und Verfahren",
 formulasLede: "Die Formeln und Rezepte aus 6.1 bis 6.6.",
 formulasNav: "Formeln und Rezepte",
 symbols: [["AB", "Verbindungsvektor von A nach B (B − A)"], ["|a|", "Betrag, Länge des Vektors"], ["a · b", "Skalarprodukt (eine Zahl)"], ["p", "Stützvektor der Geraden"], ["u", "Richtungsvektor der Geraden"], ["t, s, r", "Parameter"], ["F", "Lotfußpunkt"], ["d", "Abstand"], ["α", "Winkel (Taschenrechner DEG)"]],
 formulas: [
  ["Vektoren", [["Verbindungsvektor", "AB = B − A"], ["Länge", "|a| = √(a₁² + a₂² + a₃²)"], ["Abstand zweier Punkte", "d = |AB|"], ["Mittelpunkt", "M = ½ · (A + B)"]]],
  ["Skalarprodukt und Winkel", [["Skalarprodukt", "a · b = a₁b₁ + a₂b₂ + a₃b₃"], ["Winkel", "cos α = (a · b) / (|a| · |b|)"], ["Orthogonal", "a · b = 0"], ["Kollinear", "a = c · b (gleiches c in allen Zeilen)"]]],
  ["Geraden", [["Parameterform", "g: x = p + t · u"], ["Durch A und B", "x = OA + t · AB"], ["Punktprobe", "Punkt = Gerade, dreimal dasselbe t?"], ["Spurpunkt", "Koordinate der Ebene = 0, t einsetzen"]]],
  ["Lage zweier Geraden", [["kollinear, Punkt drauf", "identisch"], ["kollinear, Punkt nicht drauf", "parallel"], ["nicht kollinear, LGS lösbar", "schneidend"], ["nicht kollinear, LGS unlösbar", "windschief"]]],
  ["Winkel mit Koordinatenebene", [["x₁x₂-Ebene", "x₃ in u auf 0 → u'"], ["x₁x₃-Ebene", "x₂ in u auf 0 → u'"], ["x₂x₃-Ebene", "x₁ in u auf 0 → u'"], ["Winkel", "cos α = |u · u'| / (|u| · |u'|)"]]],
  ["Abstand Punkt–Gerade", [["1. Allgemeiner Punkt", "OX = p + t · u"], ["2. Verbindung", "QX = OX − OQ"], ["3. Lot", "QX · u = 0 → t"], ["4. Abstand", "d = |QF| (t in QX einsetzen)"]]],
  ["Modellieren", [["Schatten (Sonne)", "Punkt + t · Lichtrichtung, Boden x₃ = 0"], ["Schatten (Lampe P)", "P + t · PG, dann Wand oder Boden = 0"], ["Weglänge", "t · |u| bzw. |AP|"], ["Pyramide", "V = ⅓ · G · h"]]]
 ],
 killers: ["Taschenrechner auf RAD statt DEG", "Verbindungsvektor A − B statt B − A", "Kollinearität nur in zwei Zeilen geprüft", "LGS ohne Probe mit der dritten Gleichung", "Punktprobe nach zwei Zeilen abgebrochen", "Beim Abstand nach dem Einsetzen von t nochmal Q abgezogen", "Bei Winkel mit Ebene die falsche Koordinate auf 0 gesetzt", "Wurzel beim Betrag vergessen oder nur einzelne Zahlen gewurzelt", "Kein Antwortsatz (z. B. „Die Geraden sind windschief.“)"],
 rulesHtml: '<div class="dayhead"><span class="eyebrow">Für heute Abend</span><h1>Spielregeln</h1></div>' +
  '<section class="card"><ul class="stack" style="padding-left:20px;margin:0">' +
  '<li><b>Reihenfolge:</b> Teil 1 bis 6 der Reihe nach, dann die Probeklausur. Bei „Gute Note“ etwa 25 bis 35 Minuten pro Teil.</li>' +
  '<li><b>Auf Papier rechnen</b>, nicht im Kopf. In der Arbeit gibt es Punkte für Ansatz und Zwischenschritte.</li>' +
  '<li><b>Fehlerheft:</b> Jeden Fehler mit einem Satz eintragen. Morgen früh liest du nur Fehlerheft und Formeln.</li>' +
  '<li><b>Schlaf:</b> Lieber um 23 Uhr aufhören und ausgeschlafen sein als bis 2 Uhr weiterlernen.</li></ul></section>' +
  '<div class="note warn"><b>Taschenrechner</b>Vor der Arbeit auf DEG stellen und mit arccos(0,5) = 60 prüfen.</div>' +
  '<div class="note tip"><b>So gibt es volle Punkte</b>Ansatz hinschreiben (z. B. „Punktprobe:“), alle drei Zeilen rechnen, Ergebnis als Satz: „P liegt auf g.“, „Die Geraden schneiden sich in S(3|2|2).“, „Der Abstand beträgt etwa 2,92 LE.“</div>' +
  '<section class="card stack"><h2>Zwei Fehler in den Unterrichtsnotizen</h2><ul style="padding-left:20px;margin:0" class="stack"><li><b>6.1 Winkel:</b> Bei a = (2|6|4), b = (4|4|6) ist |b| = √68 ≈ 8,25, nicht 8. Der Winkel ist ≈ 24,8°, nicht 20,7°.</li><li><b>6.5 Abstand:</b> Bei Q(3|−2|5) ist d = √21/7 ≈ 0,65, nicht 5,2. Nach dem Einsetzen von t in QX hat man schon QF.</li></ul></section>' +
  '<p style="color:var(--muted);font-size:14px">Grundlage: OneNote „MgAN 2025_2026-Notizbuch“, Abschnitt I Analysis: 6. Vektorgeometrie (6.1 Grundlagen), 6.2 Geraden im Raum, 6.3 Gegenseitige Lage von Geraden, 6.4 Schnittwinkel zwischen Gerade und Koordinatenebene, 6.5 Abstand zwischen Punkt und Gerade, 6.6 Modellieren mit Geraden.</p>',
 ai: "Du bist ein geduldiger Mathe-Nachhilfelehrer für einen Schüler im Technischen Gymnasium in Baden-Württemberg. Er schreibt morgen (Donnerstag) eine Arbeit über Vektorgeometrie (Kapitel 6 bis 6.6).\n\n" +
  "Regeln für deine Antworten:\n- Antworte auf Deutsch, in Du-Form, freundlich und direkt.\n- Erkläre einfach und Schritt für Schritt, mit konkreten Zahlen.\n- Schreibe Vektoren als Zeilen in Klammern wie (2|1|−3), Punkte als P(2|1|−3), niemals LaTeX und keine Dollarzeichen.\n- Halte dich kurz (meist unter 180 Wörtern), außer er bittet um mehr.\n- Bittet er um einen Tipp, gib nur den nächsten Schritt.\n- Winkel immer in Grad, erinnere an den DEG-Modus.\n- Verfahren wie im Unterricht: Verbindungsvektor AB = B − A; Betrag mit Pythagoras; cos α = a·b/(|a|·|b|); orthogonal bei a·b = 0; kollinear bei a = c·b; Gerade x = p + t·u; Punktprobe mit drei Zeilen; Lage zweier Geraden mit Entscheidungsbaum (kollinear → Punktprobe → identisch/parallel, sonst LGS → schneidend/windschief); Schnittwinkel mit Koordinatenebene über u' (Koordinate der Ebene auf 0 gesetzt) und cos α = |u·u'|/(|u|·|u'|); Abstand Punkt–Gerade über Lotfußpunkt mit QX·u = 0; Spurpunkte und Schattenwurf; Volumen Pyramide ⅓·G·h.\n- Wenn er dich abfragen will, stelle eine Frage nach der anderen.",
 tutor: "Vektorgeometrie",
 sugs: ["Erklär mir die Punktprobe, als wäre ich in der 9. Klasse.", "Wie entscheide ich, ob zwei Geraden windschief sind?", "Gib mir eine neue Aufgabe zum Abstand Punkt–Gerade mit Lösung zum Aufklappen.", "Frag mich die Formeln für morgen ab, eine Frage nach der anderen."],
 errExample: "„Verbindungsvektor A − B statt B − A gerechnet“"
};
