import { M } from "./markup";
import type { Day, ExamTask, Review, Lesson, FormulaGroup } from "../types";

const LF = (x: string) => '<div class="lf">' + x + '</div>';
const LX = (x: string) => '<div class="lx"><b>Beispiel</b>' + x + '</div>';
const LK = (x: string) => '<div class="lk"><b>Merke</b>' + x + '</div>';
const CODE = (x: string) => '<pre class="code">' + x + '</pre>';
const TAB = (head: string[], rows: (string | number)[][]) => '<div class="lw"><table class="lta"><tr>' + head.map(h => "<th>" + h + "</th>").join("") + "</tr>" + rows.map(r => "<tr>" + r.map(c => "<td>" + c + "</td>").join("") + "</tr>").join("") + "</table></div>";

function svgPerceptron(bias: boolean) {
  const node = (x: number, y: number, t: string, cls = "la") => '<circle class="' + cls + '" cx="' + x + '" cy="' + y + '" r="15"/><text class="lt" x="' + x + '" y="' + (y + 4) + '" text-anchor="middle">' + t + '</text>';
  const edge = (y: number, w: string, ty: number) => '<line class="lh" x1="55" y1="' + y + '" x2="186" y2="95"/><text class="lbt" x="105" y="' + ty + '">' + w + '</text>';
  let s = '<svg class="lfig" viewBox="0 0 360 180" role="img" aria-label="Perzeptron mit Eingängen, Gewichten, Summe und Ausgabe">';
  if (bias) s += edge(30, "w₀", 50) + node(40, 30, "1");
  s += edge(85, "w₁", 84) + node(40, 85, "x₁") + edge(140, "w₂", 128) + node(40, 140, "x₂");
  s += '<circle class="lc" cx="210" cy="95" r="24" fill="none"/><text class="lt" x="210" y="100" text-anchor="middle">z</text>';
  s += '<line class="lh" x1="234" y1="95" x2="262" y2="95"/><rect class="la" x="262" y="78" width="58" height="34" rx="8"/><text class="lt" x="291" y="99" text-anchor="middle">' + (bias ? "H(z)" : "z ≥ θ ?") + '</text>';
  s += '<line class="lh" x1="320" y1="95" x2="345" y2="95"/><text class="lt" x="350" y="99">y</text>';
  s += '<text x="210" y="138" text-anchor="middle">' + (bias ? "z = w₀ + w₁x₁ + w₂x₂" : "z = w₁x₁ + w₂x₂") + '</text></svg>';
  return s;
}

function svgLine() {
  const X = (v: number) => 40 + v * 50, Y = (v: number) => 170 - v * 40;
  let s = '<svg class="lfig" viewBox="0 0 330 200" role="img" aria-label="Trenngerade y = −0,5x + 1,5 mit Punkten beider Klassen">';
  s += '<line class="la" x1="40" y1="170" x2="320" y2="170"/><line class="la" x1="40" y1="10" x2="40" y2="170"/><text x="322" y="174">x</text><text x="30" y="14">y</text>';
  for (let i = 1; i <= 5; i++) s += '<text x="' + X(i) + '" y="185" text-anchor="middle">' + i + '</text>';
  for (let i = 1; i <= 3; i++) s += '<text x="30" y="' + (Y(i) + 4) + '" text-anchor="end">' + i + '</text>';
  s += '<line class="lc" x1="' + X(0) + '" y1="' + Y(1.5) + '" x2="' + X(3) + '" y2="' + Y(0) + '"/>';
  [[3, 2], [4, 1.5], [2, 2.5], [4.5, 3]].forEach(([a, b]) => { s += '<circle class="ld" cx="' + X(a) + '" cy="' + Y(b) + '" r="5"/>'; });
  [[0.5, 0.4], [1, 0.3], [0.3, 1], [1.5, 0.2]].forEach(([a, b]) => { s += '<circle cx="' + X(a) + '" cy="' + Y(b) + '" r="5" style="fill:var(--warm)"/>'; });
  s += '<text class="lgt" x="52" y="22">Klasse 0 (z &lt; 0)</text><text class="lbt" x="200" y="22">Klasse 1 (z ≥ 0)</text><text class="lt" x="198" y="163">y = −0,5x + 1,5</text></svg>';
  return s;
}

function svgXor() {
  const X = (v: number) => 60 + v * 120, Y = (v: number) => 150 - v * 110;
  let s = '<svg class="lfig lfig-s" viewBox="0 0 240 190" role="img" aria-label="XOR: die Punkte mit Ausgabe 1 liegen diagonal gegenüber">';
  s += '<line class="la" x1="40" y1="150" x2="210" y2="150"/><line class="la" x1="60" y1="20" x2="60" y2="170"/><text x="212" y="154">x₁</text><text x="48" y="18">x₂</text>';
  [[0, 0, 0], [1, 1, 0], [0, 1, 1], [1, 0, 1]].forEach(([a, b, c]) => { s += '<circle cx="' + X(a) + '" cy="' + Y(b) + '" r="8" style="fill:' + (c ? "var(--accent)" : "var(--warm)") + '"/><text class="lt" x="' + (X(a) + 13) + '" y="' + (Y(b) - 10) + '">' + c + '</text>'; });
  s += '<text x="60" y="182">0</text><text x="180" y="182">1</text></svg>';
  return s;
}

function svgMlp() {
  const node = (x: number, y: number, t: string, cls = "la") => '<circle class="' + cls + '" cx="' + x + '" cy="' + y + '" r="16" fill="none"/><text class="lt" x="' + x + '" y="' + (y + 4) + '" text-anchor="middle">' + t + '</text>';
  const ln = (x1: number, y1: number, x2: number, y2: number) => '<line class="lh" x1="' + x1 + '" y1="' + y1 + '" x2="' + x2 + '" y2="' + y2 + '"/>';
  let s = '<svg class="lfig" viewBox="0 0 360 200" role="img" aria-label="Mehrschichtiges Netz mit zwei Eingängen, zwei verdeckten Neuronen und einem Ausgang">';
  [[60, 70], [60, 140]].forEach(([x, y]) => { s += ln(x + 16, y, 164, 70) + ln(x + 16, y, 164, 140); });
  s += ln(76, 22, 164, 70) + ln(76, 22, 164, 140) + ln(196, 70, 284, 105) + ln(196, 140, 284, 105) + ln(196, 22, 284, 105);
  s += node(60, 22, "1") + node(60, 70, "x₁") + node(60, 140, "x₂") + node(180, 22, "1") + node(180, 70, "h₁", "lc") + node(180, 140, "h₂", "lc") + node(300, 105, "ŷ", "lc");
  s += '<text x="60" y="185" text-anchor="middle">Eingabe</text><text x="180" y="185" text-anchor="middle">verdeckte Schicht</text><text x="300" y="185" text-anchor="middle">Ausgabe</text></svg>';
  return s;
}

function svgAct() {
  const plot = (ox: number, name: string, f: (z: number) => number) => {
    let d = "";
    for (let z = -3; z <= 3.001; z += 0.05) { const y = f(z); d += (d ? "L" : "M") + (ox + 50 + z * 15).toFixed(1) + " " + (95 - y * 50).toFixed(1); }
    return '<line class="la" x1="' + ox + '" y1="95" x2="' + (ox + 100) + '" y2="95"/><line class="la" x1="' + (ox + 50) + '" y1="35" x2="' + (ox + 50) + '" y2="105"/><path class="lc" d="' + d + '"/><text class="lt" x="' + (ox + 50) + '" y="125" text-anchor="middle">' + name + '</text>';
  };
  return '<svg class="lfig" viewBox="0 0 360 135" role="img" aria-label="Graphen von Heaviside, ReLU und Sigmoid">' + plot(10, "Heaviside", z => z >= 0 ? 1 : 0) + plot(130, "ReLU", z => Math.max(0, z) * 0.4) + plot(250, "Sigmoid", z => 1 / (1 + Math.exp(-z))) + '</svg>';
}

export const INF_DAYS: Day[] = [
 { n: 1, date: "", wd: "", title: "KI und die drei Lernarten", short: "Was ist KI, wie lernt sie",
   goal: "Du kannst die drei Arten des maschinellen Lernens erklären, bei jeder Anwendung begründen, welche passt, und ein KI-Verfahren ohne Lernen beschreiben.",
   blocks: [
    ["20", "skript", "<b>Was ist KI?</b> Lies oben „Was ist KI überhaupt?“. Danach erklärst du deinem Partner in einem Satz den Unterschied zwischen klassischer KI und maschinellem Lernen."],
    ["25", "skript", "<b>Die drei Lernarten.</b> Überwacht, unüberwacht, bestärkend. Merk dir zu jeder ein eigenes Beispiel, das nicht in der Erklärung steht."],
    ["15", "skript", "<b>Symbolisch und subsymbolisch.</b> Wo steckt das Wissen: in lesbaren Regeln oder in Zahlen?"],
    ["15", "skript", "<b>KI ohne Lernen.</b> Minimax beim Tic-Tac-Toe. Das kommt im Abi als „Nennen Sie ein Verfahren, das nicht auf maschinellem Lernen basiert“."],
    ["30", "ueben", "<b>Übungen</b> unten. Bei den Abi-Fragen erst selbst zwei Sätze schreiben, dann mit der Musterlösung vergleichen."],
    ["10", "test", "<b>Selbsttest.</b> Partner nennt eine Anwendung (Spurhalteassistent, Netflix-Empfehlungen, Schachcomputer), du sagst Lernart und Begründung."]
   ],
   notes: [["tip", "So bekommst du hier die Punkte", "Im Abi reicht nicht „überwacht“. Es gibt die Punkte erst für die <b>Begründung</b>: „weil die Trainingsdaten schon die richtigen Antworten (Labels) enthalten“."]],
   vids: [], links: [["Begriffe und Formeln", "#formeln"]],
   checks: ["Die drei Lernarten nennen und jeweils mit Beispiel erklären", "Bei einer Anwendung die passende Lernart begründet auswählen", "Symbolische und subsymbolische KI unterscheiden", "Ein KI-Verfahren ohne maschinelles Lernen beschreiben (z. B. Minimax)"],
   groups: ["Lernarten", "Symbolisch oder subsymbolisch", "KI ohne Lernen", "Abi-Fragen"],
   core: { b: [0, 1, 3, 4, 5], c: [0, 1, 3] },
   ex: [
    { t: "mc", g: "Lernarten", k: true, q: "Ein Programm bekommt 10 000 Fotos. Auf jedem steht schon „Katze“ oder „Hund“. Danach soll es neue Fotos einordnen. Welche Lernart ist das?", o: ["Überwachtes Lernen", "Unüberwachtes Lernen", "Bestärkendes Lernen", "Gar kein maschinelles Lernen"], a: 0, s: "Die Trainingsdaten haben schon die richtige Antwort (das Label „Katze“ oder „Hund“). Lernen mit Labels heißt überwacht." },
    { t: "mc", g: "Lernarten", k: true, q: "Ein Online-Shop will seine Kunden in Gruppen mit ähnlichem Kaufverhalten einteilen. Welche Gruppen es gibt, weiß vorher niemand.", o: ["Unüberwachtes Lernen", "Überwachtes Lernen", "Bestärkendes Lernen", "Minimax"], a: 0, s: "Es gibt keine richtigen Antworten in den Daten, das Programm soll selbst Muster und Gruppen finden. Das ist unüberwacht, zum Beispiel mit k-Means." },
    { t: "mc", g: "Lernarten", k: true, q: "Ein Roboter lernt laufen. Fällt er um, bekommt er Minuspunkte, kommt er vorwärts, Pluspunkte.", o: ["Bestärkendes Lernen", "Überwachtes Lernen", "Unüberwachtes Lernen", "Symbolische KI"], a: 0, s: "Er probiert Aktionen aus und bekommt dafür Belohnung oder Strafe. Lernen durch Belohnung heißt bestärkendes Lernen (Reinforcement Learning)." },
    { t: "mc", g: "Lernarten", k: true, q: "Ein Spamfilter soll E-Mails in „Spam“ und „Kein Spam“ sortieren. Es gibt viele E-Mails, die schon von Hand sortiert wurden.", o: ["Überwacht, weil die sortierten E-Mails die richtigen Antworten enthalten", "Unüberwacht, weil es zwei Gruppen gibt", "Bestärkend, weil Spam bestraft wird", "Gar kein Lernen, weil es Regeln sind"], a: 0, s: "Die von Hand sortierten E-Mails sind Trainingsdaten mit Labels. Damit lernt das Programm überwacht." },
    { t: "mc", g: "Lernarten", q: "Eine KI soll Pong spielen. Trifft sie den Ball, gibt es einen Punkt, verfehlt sie ihn, verliert sie einen.", o: ["Bestärkendes Lernen", "Überwachtes Lernen", "Unüberwachtes Lernen", "Entscheidungsbaum"], a: 0, s: "Niemand sagt der KI vorher den richtigen Schlägerzug. Sie lernt aus den Punkten, also aus Belohnung und Strafe: bestärkendes Lernen." },
    { t: "mc", g: "Lernarten", k: true, q: "Was sind „Labels“?", o: ["Die richtigen Antworten zu den Trainingsdaten", "Die Namen der Neuronen", "Die Gewichte im Netz", "Die Lernrate"], a: 0, s: "Ein Label ist die gewünschte Ausgabe, z. B. „Spam“ zu einer E-Mail. Nur beim überwachten Lernen gibt es Labels." },
    { t: "mc", g: "Lernarten", q: "Welche Aussage über unüberwachtes Lernen stimmt?", o: ["Die Daten enthalten keine richtigen Antworten", "Es gibt für jede Aktion eine Belohnung", "Ein Lehrer korrigiert jede Ausgabe", "Es funktioniert nur mit Bildern"], a: 0, s: "Unüberwacht heißt: keine Labels. Das Verfahren sucht selbst nach Ähnlichkeiten." },
    { t: "mc", g: "Symbolisch oder subsymbolisch", q: "Ein Expertensystem arbeitet mit Regeln wie „WENN Fieber UND Husten, DANN Grippe“. Was ist das?", o: ["Symbolische KI", "Subsymbolische KI", "Unüberwachtes Lernen", "Ein neuronales Netz"], a: 0, s: "Das Wissen steht als lesbare Regel da, mit Symbolen wie „Fieber“. Das ist symbolische KI." },
    { t: "mc", g: "Symbolisch oder subsymbolisch", k: true, q: "Wo steckt das Wissen bei einem neuronalen Netz?", o: ["In Zahlen (den Gewichten), die man nicht direkt lesen kann", "In lesbaren WENN-DANN-Regeln", "In einer Tabelle mit allen Antworten", "Gar nicht, es rät"], a: 0, s: "Ein neuronales Netz speichert alles in Gewichten. Man kann nicht hineinschauen und eine Regel ablesen. Deshalb heißt es subsymbolisch." },
    { t: "mc", g: "Symbolisch oder subsymbolisch", q: "Was bedeutet „hybride KI“?", o: ["Sie kombiniert lesbare Regeln mit einem lernenden Verfahren", "Sie läuft auf zwei Computern", "Sie lernt überwacht und unüberwacht gleichzeitig", "Sie hat zwei Ausgabeneuronen"], a: 0, s: "Hybrid heißt gemischt: symbolische Regeln plus subsymbolisches Lernen, zum Beispiel ein Netz erkennt Schilder, Regeln entscheiden, was das Auto tut." },
    { t: "mc", g: "KI ohne Lernen", k: true, q: "Welches Verfahren ist KI, aber kein maschinelles Lernen?", o: ["Minimax beim Tic-Tac-Toe", "Ein neuronales Netz", "k-Means", "Ein Entscheidungsbaum, der aus Daten gelernt wird"], a: 0, s: "Minimax probiert alle Züge durch und bewertet sie. Es lernt nichts aus Daten, es sucht nur." },
    { t: "mc", g: "KI ohne Lernen", q: "Wovon geht Minimax beim Gegner aus?", o: ["Dass er immer seinen besten Zug macht", "Dass er zufällig spielt", "Dass er immer verliert", "Dass er dieselben Züge wiederholt"], a: 0, s: "Minimax nimmt an, dass der Gegner optimal spielt. Darum wählt man den Zug, bei dem der schlechteste Ausgang noch am besten ist." },
    { t: "rev", g: "Abi-Fragen", k: true, q: "Nenne drei grundlegende Arten des maschinellen Lernens und beschreibe kurz, worin sie sich unterscheiden.", s: "<b>Überwachtes Lernen:</b> Die Trainingsdaten enthalten die richtigen Antworten (Labels), das Modell lernt die Zuordnung Eingabe → Antwort. <b>Unüberwachtes Lernen:</b> Keine Labels, das Verfahren findet selbst Gruppen oder Muster. <b>Bestärkendes Lernen:</b> Ein Agent handelt in einer Umgebung und lernt aus Belohnung und Strafe." },
    { t: "rev", g: "Abi-Fragen", k: true, q: "Eine KI soll Bilder von Verkehrsschildern erkennen. Es gibt 50 000 Bilder, bei jedem ist das Schild angegeben. Welche Lernart passt am besten? Begründe.", s: "Überwachtes Lernen, weil zu jedem Bild die richtige Antwort (welches Schild) bekannt ist. Das Modell kann seine Ausgabe mit dem Label vergleichen und seine Gewichte danach verbessern." },
    { t: "rev", g: "Abi-Fragen", q: "Nenne ein KI-Verfahren, das nicht auf maschinellem Lernen basiert, und beschreibe kurz, wie es funktioniert.", s: "Minimax bei Zwei-Personen-Spielen: Es baut den Spielbaum mit allen möglichen Zügen auf, bewertet die Endstellungen (Sieg +1, Niederlage −1, Unentschieden 0) und rechnet von unten nach oben. Der Spieler am Zug nimmt das Maximum, der Gegner das Minimum. So findet es den besten Zug, ohne aus Daten zu lernen." }
   ] },
 { n: 2, date: "", wd: "", title: "Das Perzeptron", short: "Aufbau, Summe, Schwellwert",
   goal: "Du kannst ein Perzeptron zeichnen, für gegebene Eingaben die Summe z und die Ausgabe y ausrechnen und UND und ODER als Perzeptron bauen.",
   blocks: [
    ["20", "skript", "<b>Aufbau.</b> Eingänge, Gewichte, Summe, Schwellwert, Ausgabe. Zeichne das Bild aus der Erklärung einmal ab und beschrifte es ohne Vorlage."],
    ["25", "skript", "<b>Rechnen in drei Schritten.</b> Malnehmen, zusammenzählen, vergleichen. Rechne das Beispiel aus der Erklärung selbst nach."],
    ["20", "skript", "<b>UND und ODER.</b> Für beide eine Wahrheitstabelle mit z und y aufschreiben."],
    ["15", "skript", "<b>Gewichte deuten.</b> Was heißt ein großes, kleines oder negatives Gewicht?"],
    ["30", "ueben", "<b>Übungen</b> unten, zuerst „Summe und Ausgabe“."],
    ["10", "test", "<b>Selbsttest.</b> Partner gibt dir drei Eingaben, zwei Gewichte und einen Schwellwert vor. Du rechnest y im Kopf aus."]
   ],
   notes: [["warn", "Häufigster Fehler", "Bei z = θ ist die Ausgabe <b>1</b>, denn die Bedingung heißt z ≥ θ (größer <b>oder gleich</b>)."]],
   vids: [], links: [["Formeln", "#formeln"]],
   checks: ["Ein Perzeptron zeichnen und alle Teile benennen", "z und y für gegebene Werte ausrechnen", "UND und ODER als Perzeptron mit Gewichten und Schwellwert angeben", "Erklären, was ein großes oder negatives Gewicht bewirkt"],
   groups: ["Summe und Ausgabe", "UND und ODER", "Gewichte deuten"],
   core: { b: [0, 1, 2, 4, 5], c: [0, 1, 2] },
   ex: [
    { t: "num", g: "Summe und Ausgabe", k: true, q: "Eingaben x₁ = 1, x₂ = 1, Gewichte w₁ = 0,4 und w₂ = 0,3. Wie groß ist z?", a: 0.7, s: "z = 0,4·1 + 0,3·1 = 0,7" },
    { t: "num", g: "Summe und Ausgabe", k: true, q: "Gleiches Perzeptron, Schwellwert θ = 0,8. Was gibt es aus (0 oder 1)?", a: 0, s: "z = 0,7 ist kleiner als θ = 0,8, also y = 0." },
    { t: "num", g: "Summe und Ausgabe", k: true, q: "Drei Eingänge: x = (1, 0, 1), Gewichte w = (0,5; −0,2; 0,3). Wie groß ist z?", a: 0.8, s: "z = 0,5·1 + (−0,2)·0 + 0,3·1 = 0,8. Der mittlere Eingang ist 0 und zählt deshalb nicht." },
    { t: "num", g: "Summe und Ausgabe", q: "x₁ = 2, x₂ = −1, w₁ = 0,5, w₂ = 1,5. Wie groß ist z?", a: -0.5, s: "z = 0,5·2 + 1,5·(−1) = 1 − 1,5 = −0,5" },
    { t: "num", g: "Summe und Ausgabe", q: "Gleiches Perzeptron mit θ = 0. Ausgabe y?", a: 0, s: "z = −0,5 < 0, also y = 0." },
    { t: "num", g: "Summe und Ausgabe", k: true, q: "x₁ = 1, x₂ = 0, w₁ = 0,6, w₂ = 0,4, θ = 0,6. Ausgabe y?", a: 1, s: "z = 0,6. Weil z ≥ θ gilt (gleich zählt mit), ist y = 1." },
    { t: "mc", g: "UND und ODER", k: true, q: "Welches Perzeptron mit zwei Eingängen (0 oder 1) berechnet UND?", o: ["w₁ = w₂ = 1, θ = 1,5", "w₁ = w₂ = 1, θ = 0,5", "w₁ = w₂ = 1, θ = 3", "w₁ = 1, w₂ = 0, θ = 1"], a: 0, s: "Nur bei (1, 1) ist z = 2 ≥ 1,5. Bei (1, 0) und (0, 1) ist z = 1 < 1,5. Genau das ist UND." },
    { t: "mc", g: "UND und ODER", k: true, q: "Welches Perzeptron berechnet ODER?", o: ["w₁ = w₂ = 1, θ = 0,5", "w₁ = w₂ = 1, θ = 1,5", "w₁ = w₂ = 1, θ = 2,5", "w₁ = w₂ = −1, θ = 0"], a: 0, s: "Schon ein Eingang mit 1 gibt z = 1 ≥ 0,5. Nur bei (0, 0) ist z = 0 < 0,5. Das ist ODER." },
    { t: "num", g: "UND und ODER", q: "Gewichte w₁ = 3 und w₂ = 2. Welcher ist der größte ganzzahlige Schwellwert θ, mit dem das Perzeptron UND berechnet?", a: 5, s: "z(1,0) = 3, z(0,1) = 2, z(1,1) = 5. Für UND muss nur (1,1) durchkommen: 3 < θ ≤ 5. Größte ganze Zahl: θ = 5." },
    { t: "num", g: "UND und ODER", k: true, q: "Club-Beispiel aus dem Unterricht: x₁ = 1, wenn über 18, x₂ = 1 bei Mitgliedsausweis, w₁ = 2, w₂ = 1, θ = 2. Eine 17-Jährige mit Ausweis kommt. Wie groß ist z?", a: 1, s: "x₁ = 0, x₂ = 1, also z = 2·0 + 1·1 = 1. Weil 1 < 2, bleibt sie draußen." },
    { t: "mc", g: "UND und ODER", q: "Wer kommt im Club-Beispiel (w₁ = 2, w₂ = 1, θ = 2) hinein?", o: ["Jeder über 18, egal ob mit Ausweis", "Nur wer über 18 ist und einen Ausweis hat", "Jeder mit Ausweis", "Niemand"], a: 0, s: "Über 18 allein gibt schon z = 2 ≥ 2. Der Ausweis allein gibt nur 1. Also entscheidet nur das Alter." },
    { t: "mc", g: "Gewichte deuten", k: true, q: "Ein Eingang hat das Gewicht −2. Was bedeutet das?", o: ["Ist dieser Eingang 1, spricht das stark gegen die Ausgabe 1", "Dieser Eingang wird ignoriert", "Das Perzeptron gibt dann −2 aus", "Der Schwellwert wird verdoppelt"], a: 0, s: "Ein negatives Gewicht zieht die Summe nach unten. Der Eingang „hemmt“ also die Ausgabe 1, und je größer der Betrag, desto stärker." },
    { t: "mc", g: "Gewichte deuten", q: "Bei einem Perzeptron für „Regenschirm mitnehmen“ ist w(Regen) = 3 und w(Wind) = 0,5. Was sagt das?", o: ["Regen ist viel wichtiger für die Entscheidung als Wind", "Wind ist wichtiger", "Beide sind gleich wichtig", "Das Perzeptron rechnet falsch"], a: 0, s: "Je größer das Gewicht, desto mehr zählt der Eingang. Regen trägt sechsmal so viel zur Summe bei wie Wind." },
    { t: "rev", g: "Gewichte deuten", q: "Erkläre in drei Sätzen, wie ein Perzeptron aus seinen Eingaben eine Entscheidung macht.", s: "Jede Eingabe wird mit ihrem Gewicht multipliziert. Alle Produkte werden zur Summe z addiert. Ist z mindestens so groß wie der Schwellwert θ, gibt das Perzeptron 1 aus, sonst 0." }
   ] },
 { n: 3, date: "", wd: "", title: "Bias und Trenngerade", short: "Bias, Trenngerade, XOR",
   goal: "Du kannst mit Bias und Heaviside-Funktion rechnen, aus den Gewichten die Trenngerade y = m·x + b aufstellen und erklären, warum ein Perzeptron XOR nicht kann.",
   blocks: [
    ["20", "skript", "<b>Vom Schwellwert zum Bias.</b> Warum w₀ = −θ ist und der Bias-Eingang immer 1 ist."],
    ["30", "skript", "<b>Trenngerade.</b> z = 0 setzen und nach y umstellen. Das ist eine typische Abi-Aufgabe mit festen Punkten."],
    ["15", "skript", "<b>Lineare Separierbarkeit.</b> Was heißt das, und wie zeichnest du es?"],
    ["15", "skript", "<b>XOR.</b> Vier Punkte zeichnen und zeigen, dass keine Gerade passt."],
    ["30", "ueben", "<b>Übungen</b> unten."],
    ["10", "test", "<b>Selbsttest.</b> Partner gibt w₀, w₁, w₂ vor. Du stellst die Trenngerade auf und sagst, auf welcher Seite Klasse 1 liegt."]
   ],
   notes: [["warn", "Vorzeichenfalle", "Die Steigung ist m = <b>−</b>w₁/w₂ und der Achsenabschnitt b = <b>−</b>w₀/w₂. Das Minus vergessen kostet in fast jeder Arbeit Punkte."]],
   vids: [], links: [["Formeln", "#formeln"]],
   checks: ["Mit Bias und Heaviside-Funktion z und y ausrechnen", "Aus w₀, w₁, w₂ die Trenngerade y = m·x + b aufstellen", "Lineare Separierbarkeit erklären und skizzieren", "Begründen, warum ein einzelnes Perzeptron XOR nicht lösen kann", "Erklären, was passiert, wenn der Bias 0 ist"],
   groups: ["Bias", "Trenngerade", "Separierbarkeit und XOR"],
   core: { b: [0, 1, 3, 4, 5], c: [0, 1, 3] },
   ex: [
    { t: "num", g: "Bias", k: true, q: "w₀ = −1,5, w₁ = 1, w₂ = 1, Eingaben (1, 1). Wie groß ist z?", a: 0.5, s: "z = −1,5·1 + 1·1 + 1·1 = 0,5. Der Bias-Eingang ist immer 1." },
    { t: "num", g: "Bias", k: true, q: "Gleiches Perzeptron, Heaviside-Funktion. Was ist H(z)?", a: 1, s: "z = 0,5 ≥ 0, also H(z) = 1." },
    { t: "num", g: "Bias", k: true, q: "w₀ = 0,3, w₁ = −0,6, w₂ = 0,5, Eingaben x₁ = 1, x₂ = 0,4. Wie groß ist z?", a: -0.1, s: "z = 0,3 + (−0,6)·1 + 0,5·0,4 = 0,3 − 0,6 + 0,2 = −0,1" },
    { t: "num", g: "Bias", q: "Gleiches Perzeptron. Was ist H(z)?", a: 0, s: "z = −0,1 < 0, also H(z) = 0." },
    { t: "num", g: "Bias", k: true, q: "Ein Perzeptron hat den Schwellwert θ = 0,7. Welches Biasgewicht w₀ macht dasselbe?", a: -0.7, s: "z ≥ θ heißt dasselbe wie z − θ ≥ 0. Also w₀ = −θ = −0,7." },
    { t: "num", g: "Bias", q: "Wie groß ist H(0)?", a: 1, s: "Die Heaviside-Funktion ist 1 für z ≥ 0. Bei genau 0 ist sie also 1." },
    { t: "num", g: "Trenngerade", k: true, q: "w₀ = −3, w₁ = 1, w₂ = 2. Stelle die Trenngerade y = m·x + b auf. Wie groß ist m?", a: -0.5, s: "z = 0 setzen: −3 + x + 2y = 0, also 2y = −x + 3 und y = −0,5x + 1,5. Damit m = −0,5." },
    { t: "num", g: "Trenngerade", k: true, q: "Gleiches Perzeptron. Wie groß ist b?", a: 1.5, s: "b = −w₀/w₂ = −(−3)/2 = 1,5" },
    { t: "mc", g: "Trenngerade", q: "Gleiches Perzeptron (w₀ = −3, w₁ = 1, w₂ = 2). In welche Klasse fällt der Punkt (4 | 1)?", o: ["Klasse 1, weil z = 3 ≥ 0", "Klasse 0, weil der Punkt unter der Geraden liegt", "Klasse 0, weil z negativ ist", "Er liegt genau auf der Geraden"], a: 0, s: "z = −3 + 4 + 2·1 = 3 ≥ 0, also Klasse 1. Zum Prüfen immer den Punkt in z einsetzen." },
    { t: "num", g: "Trenngerade", k: true, q: "w₀ = 1, w₁ = 2, w₂ = −1. Wie groß ist die Steigung m der Trenngeraden?", a: 2, s: "1 + 2x − y = 0, also y = 2x + 1. m = −w₁/w₂ = −2/(−1) = 2. Hier hebt das negative w₂ das Minus auf." },
    { t: "num", g: "Trenngerade", q: "w₀ = 2, w₁ = −1, w₂ = 2. Wie groß ist der Achsenabschnitt b?", a: -1, s: "2 − x + 2y = 0, also y = 0,5x − 1. b = −w₀/w₂ = −2/2 = −1." },
    { t: "mc", g: "Separierbarkeit und XOR", k: true, q: "Welche Funktion kann ein einzelnes Perzeptron NICHT berechnen?", o: ["XOR", "UND", "ODER", "NICHT"], a: 0, s: "Bei XOR liegen die beiden 1-Punkte (0|1) und (1|0) diagonal gegenüber. Keine Gerade trennt sie von (0|0) und (1|1)." },
    { t: "mc", g: "Separierbarkeit und XOR", k: true, q: "Was bedeutet „linear separierbar“?", o: ["Die beiden Klassen lassen sich durch eine Gerade trennen", "Die Punkte liegen auf einer Geraden", "Das Netz hat genau eine Schicht", "Die Gewichte sind alle positiv"], a: 0, s: "Linear separierbar heißt: Eine Gerade (bei mehr Eingängen eine Ebene) trennt Klasse 0 und Klasse 1 vollständig. Nur dann kann ein einzelnes Perzeptron die Daten richtig einteilen." },
    { t: "mc", g: "Separierbarkeit und XOR", q: "Aussage: „Hat ein Perzeptron das Biasgewicht 0, kann es keine Daten mehr linear trennen.“ Stimmt das?", o: ["Nein, es trennt weiter, aber die Trenngerade muss durch den Ursprung gehen", "Ja, ohne Bias gibt es keine Gerade", "Ja, dann ist die Ausgabe immer 0", "Nein, der Bias hat gar keinen Einfluss"], a: 0, s: "Mit w₀ = 0 wird b = −w₀/w₂ = 0. Die Gerade geht also durch (0|0). Daten, die sich mit so einer Geraden trennen lassen, schafft es weiterhin. Die Aussage ist falsch." },
    { t: "rev", g: "Separierbarkeit und XOR", k: true, q: "Erkläre, warum ein einzelnes Perzeptron das XOR-Problem nicht lösen kann, und was man stattdessen braucht.", s: "Ein Perzeptron trennt die Eingaben mit einer Geraden. Bei XOR sind (0|1) und (1|0) Klasse 1, (0|0) und (1|1) Klasse 0. Die 1-Punkte liegen diagonal, keine Gerade trennt sie. XOR ist also nicht linear separierbar. Man braucht ein mehrschichtiges Netz mit einer verdeckten Schicht, das mehrere Geraden kombiniert." }
   ] },
 { n: 4, date: "", wd: "", title: "Die Lernregel", short: "Wie ein Perzeptron lernt",
   goal: "Du kannst einen Lernschritt der Perzeptron-Lernregel komplett durchrechnen und erklären, wann das Lernen aufhört.",
   blocks: [
    ["20", "skript", "<b>Idee.</b> Lernen heißt: Gewichte so verschieben, dass der Fehler kleiner wird."],
    ["30", "skript", "<b>Die Lernregel.</b> Δwᵢ = α·(y − ŷ)·xᵢ. Rechne das vorgerechnete Beispiel aus der Erklärung Zeile für Zeile nach."],
    ["15", "skript", "<b>Lernrate und Epochen.</b> Was passiert bei großer und kleiner Lernrate, und wann ist Schluss?"],
    ["35", "ueben", "<b>Übungen</b> unten. Den kompletten Lernschritt (Übung 4.5 bis 4.8) unbedingt ohne Lösung schaffen."],
    ["10", "test", "<b>Selbsttest.</b> Algorithmus auf ein leeres Blatt schreiben: Startwerte, Schleife, Fehler, Update, Abbruch."]
   ],
   notes: [["warn", "Reihenfolge", "Erst ŷ mit den <b>alten</b> Gewichten ausrechnen, dann alle Gewichte gleichzeitig ändern. Nicht w₁ ändern und mit dem neuen w₁ weiterrechnen."]],
   vids: [], links: [["Formeln", "#formeln"]],
   checks: ["Den Fehler e = y − ŷ bestimmen", "Δwᵢ und die neuen Gewichte für einen Lernschritt ausrechnen", "Den Lernalgorithmus mit Startwerten, Schleife und Abbruch aufschreiben", "Erklären, was die Lernrate bewirkt", "Erklären, warum das Lernen bei XOR nie endet"],
   groups: ["Fehler und Änderung", "Ein ganzer Lernschritt", "Verstehen"],
   core: { b: [0, 1, 3, 4], c: [0, 1, 2] },
   ex: [
    { t: "num", g: "Fehler und Änderung", k: true, q: "Die richtige Antwort ist y = 1, das Perzeptron gibt ŷ = 0 aus. Wie groß ist der Fehler e = y − ŷ?", a: 1, s: "e = 1 − 0 = 1. Das Perzeptron war zu „vorsichtig“, die Gewichte müssen größer werden." },
    { t: "num", g: "Fehler und Änderung", k: true, q: "Lernrate α = 0,1, Fehler e = 1, Eingabe x₁ = 0,5. Wie groß ist Δw₁?", a: 0.05, s: "Δw₁ = α·e·x₁ = 0,1 · 1 · 0,5 = 0,05" },
    { t: "num", g: "Fehler und Änderung", k: true, q: "Vorher war w₁ = 0,3. Wie groß ist w₁ nach dem Update mit Δw₁ = 0,05?", a: 0.35, s: "w₁ := w₁ + Δw₁ = 0,3 + 0,05 = 0,35" },
    { t: "num", g: "Fehler und Änderung", q: "α = 0,1 und e = 1. Wie groß ist die Änderung des Biasgewichts Δw₀?", a: 0.1, s: "Der Bias-Eingang ist immer 1, also Δw₀ = α·e·1 = 0,1." },
    { t: "num", g: "Ein ganzer Lernschritt", k: true, q: "w₀ = 0,2, w₁ = −0,4, w₂ = 0,1, Eingabe (1, 1), richtige Antwort y = 1, α = 0,2. Was gibt das Perzeptron vor dem Lernen aus (ŷ)?", a: 0, s: "z = 0,2 − 0,4 + 0,1 = −0,1 < 0, also ŷ = 0. Das ist falsch, denn y = 1." },
    { t: "num", g: "Ein ganzer Lernschritt", k: true, q: "Gleiche Situation. Wie groß ist das neue w₁?", a: -0.2, s: "e = 1 − 0 = 1. Δw₁ = 0,2 · 1 · 1 = 0,2. Neues w₁ = −0,4 + 0,2 = −0,2." },
    { t: "num", g: "Ein ganzer Lernschritt", k: true, q: "Gleiche Situation. Wie groß ist das neue w₀?", a: 0.4, s: "Δw₀ = 0,2 · 1 = 0,2. Neues w₀ = 0,2 + 0,2 = 0,4." },
    { t: "num", g: "Ein ganzer Lernschritt", q: "Gleiche Situation. Wie groß ist das neue w₂?", a: 0.3, s: "Δw₂ = 0,2 · 1 · 1 = 0,2. Neues w₂ = 0,1 + 0,2 = 0,3. Probe: z = 0,4 − 0,2 + 0,3 = 0,5, jetzt kommt 1 heraus." },
    { t: "num", g: "Ein ganzer Lernschritt", k: true, q: "y = 0, ŷ = 1, α = 0,5, x₂ = 1, altes w₂ = 0,8. Wie groß ist das neue w₂?", a: 0.3, s: "e = 0 − 1 = −1. Δw₂ = 0,5 · (−1) · 1 = −0,5. Neues w₂ = 0,8 − 0,5 = 0,3." },
    { t: "num", g: "Ein ganzer Lernschritt", q: "y = 0, ŷ = 1, α = 0,5, aber x₁ = 0 und altes w₁ = 0,6. Wie groß ist das neue w₁?", a: 0.6, s: "Δw₁ = 0,5 · (−1) · 0 = 0. Ein Eingang, der 0 war, hat nichts zum Fehler beigetragen, deshalb bleibt w₁ = 0,6." },
    { t: "mc", g: "Verstehen", k: true, q: "Was passiert, wenn das Perzeptron schon richtig liegt (ŷ = y)?", o: ["Die Gewichte bleiben gleich", "Alle Gewichte werden auf 0 gesetzt", "Die Lernrate wird größer", "Die Gewichte werden verdoppelt"], a: 0, s: "Dann ist y − ŷ = 0 und damit jede Änderung Δwᵢ = 0." },
    { t: "mc", g: "Verstehen", q: "Was passiert bei einer sehr großen Lernrate α?", o: ["Die Gewichte springen stark hin und her, das Lernen wird unruhig", "Das Netz lernt immer schneller und besser", "Die Ausgabe wird größer als 1", "Nichts, α ist egal"], a: 0, s: "Große Schritte schießen leicht über das Ziel hinaus. Kleine Schritte sind sicherer, brauchen aber mehr Epochen." },
    { t: "mc", g: "Verstehen", k: true, q: "Wann hört der Lernalgorithmus des Perzeptrons auf?", o: ["Wenn in einer ganzen Epoche kein Fehler mehr passiert", "Nach genau einem Beispiel", "Wenn alle Gewichte positiv sind", "Wenn die Lernrate 0 ist"], a: 0, s: "Eine Epoche ist ein Durchgang durch alle Trainingsdaten. Gibt es darin keinen Fehler mehr, ändert sich nichts mehr und man kann aufhören." },
    { t: "mc", g: "Verstehen", q: "Man trainiert ein einzelnes Perzeptron mit den XOR-Daten. Was passiert?", o: ["Es hört nie auf, weil immer mindestens ein Punkt falsch bleibt", "Es lernt XOR nach einigen Epochen", "Es lernt XOR sofort", "Es stürzt ab"], a: 0, s: "XOR ist nicht linear separierbar. Es gibt keine Gewichte, die alle vier Punkte richtig machen, deshalb kommt die Schleife nie zur Ruhe." },
    { t: "rev", g: "Verstehen", k: true, q: "Schreibe den Lernalgorithmus des Perzeptrons in Stichpunkten auf.", s: "1. Alle Gewichte auf einen Startwert setzen, z. B. wᵢ := 0. 2. Für jedes Trainingsbeispiel (x, y): ŷ = H(w₀ + w₁x₁ + … + wₙxₙ) berechnen, Fehler e = y − ŷ, Δwᵢ = α·e·xᵢ und Δw₀ = α·e, dann wᵢ := wᵢ + Δwᵢ. 3. Schritt 2 wiederholen, bis eine ganze Epoche ohne Fehler durchläuft." }
   ] },
 { n: 5, date: "", wd: "", title: "Mehrschichtige Netze", short: "ReLU, Sigmoid, Softmax",
   goal: "Du kannst ReLU, Sigmoid und Softmax ausrechnen und ein mehrschichtiges Netz Schritt für Schritt von den Eingaben bis zur Ausgabe durchrechnen.",
   blocks: [
    ["15", "skript", "<b>Warum mehrere Schichten?</b> Zusammenhang mit XOR, Eingabe, verdeckte Schicht, Ausgabe."],
    ["25", "skript", "<b>Aktivierungsfunktionen.</b> Heaviside, ReLU, Sigmoid, Softmax. Zu jeder einmal drei Werte selbst ausrechnen."],
    ["30", "skript", "<b>Ein Netz durchrechnen.</b> Das Beispiel aus der Erklärung mit Taschenrechner nachrechnen."],
    ["15", "skript", "<b>XOR mit zwei Schichten.</b> Wie zwei Perzeptronen plus ein drittes XOR schaffen."],
    ["30", "ueben", "<b>Übungen</b> unten. Für Sigmoid und Softmax brauchst du die eˣ-Taste."],
    ["10", "test", "<b>Selbsttest.</b> Partner zeichnet ein Netz mit 2-2-1 Neuronen und Zahlen. Du rechnest die Ausgabe aus."]
   ],
   notes: [["tip", "Taschenrechner", "e⁻ᶻ tippst du als e^(−z). Beim Rechner hier auf der Seite: e^(-0,3). Für σ(z) dann 1 ÷ (1 + e^(−z))."]],
   vids: [], links: [["Formeln", "#formeln"]],
   checks: ["Den Aufbau eines mehrschichtigen Netzes erklären", "ReLU, Sigmoid und Softmax für gegebene Werte ausrechnen", "Ein Netz mit verdeckter Schicht Schritt für Schritt durchrechnen", "Begründen, wann man welche Aktivierungsfunktion nimmt", "Erklären, warum eine verdeckte Schicht nicht automatisch jedes Problem löst"],
   groups: ["Aktivierungsfunktionen", "Softmax", "Netz durchrechnen", "Verstehen"],
   core: { b: [0, 1, 2, 4, 5], c: [0, 1, 2] },
   ex: [
    { t: "num", g: "Aktivierungsfunktionen", k: true, q: "Wie groß ist ReLU(−1,2)?", a: 0, s: "ReLU(z) = max(0, z). Negative Werte werden zu 0." },
    { t: "num", g: "Aktivierungsfunktionen", k: true, q: "Wie groß ist ReLU(0,7)?", a: 0.7, s: "Positive Werte bleiben, wie sie sind: ReLU(0,7) = 0,7." },
    { t: "num", g: "Aktivierungsfunktionen", k: true, q: "Wie groß ist σ(0)?", a: 0.5, s: "σ(0) = 1/(1 + e⁰) = 1/(1 + 1) = 0,5" },
    { t: "num", g: "Aktivierungsfunktionen", k: true, q: "Wie groß ist σ(1)? (auf drei Nachkommastellen)", a: 0.731, s: "e⁻¹ ≈ 0,368. σ(1) = 1/(1 + 0,368) = 1/1,368 ≈ 0,731" },
    { t: "num", g: "Aktivierungsfunktionen", q: "Wie groß ist σ(−2)? (auf drei Nachkommastellen)", a: 0.119, s: "e² ≈ 7,389. σ(−2) = 1/(1 + 7,389) ≈ 0,119" },
    { t: "mc", g: "Aktivierungsfunktionen", q: "Zwischen welchen Werten liegt die Sigmoid-Funktion?", o: ["Zwischen 0 und 1", "Zwischen −1 und 1", "Zwischen 0 und unendlich", "Sie ist nur 0 oder 1"], a: 0, s: "σ(z) nähert sich für große z der 1 und für sehr negative z der 0, erreicht beides aber nie. Im Gegensatz zu Heaviside gibt sie Zwischenwerte." },
    { t: "num", g: "Softmax", k: true, q: "Zwei Ausgabeneuronen mit z₁ = 1 und z₂ = 3. Wie groß ist die Softmax-Aktivierung des zweiten Neurons? (zwei Nachkommastellen)", a: 0.88, s: "e¹ ≈ 2,718, e³ ≈ 20,086, Summe 22,804. softmax(z₂) = 20,086/22,804 ≈ 0,88" },
    { t: "num", g: "Softmax", q: "Gleiche Werte. Wie groß ist die Softmax-Aktivierung des ersten Neurons?", a: 0.12, s: "2,718/22,804 ≈ 0,12. Probe: 0,12 + 0,88 = 1." },
    { t: "num", g: "Softmax", k: true, q: "Drei Neuronen haben alle z = 0. Wie groß ist die Softmax-Aktivierung von jedem?", a: 0.3333, s: "e⁰ = 1 für alle, Summe 3. Jedes bekommt 1/3 ≈ 0,33." },
    { t: "mc", g: "Softmax", k: true, q: "Was gilt immer für die Softmax-Werte einer Schicht?", o: ["Sie ergeben zusammen 1", "Sie sind alle gleich", "Sie sind alle größer als 1", "Der größte ist immer 1"], a: 0, s: "Jeder Wert wird durch die Summe aller e-Werte geteilt. Deshalb ist die Summe genau 1, und man kann die Werte als Wahrscheinlichkeiten lesen." },
    { t: "num", g: "Netz durchrechnen", k: true, q: "Eingaben x₁ = 1, x₂ = 0,5. Verdecktes Neuron h₁: Bias 0,2, Gewichte 0,4 (von x₁) und −0,6 (von x₂), Aktivierung ReLU. Wie groß ist z von h₁?", a: 0.3, s: "z = 0,2 + 0,4·1 + (−0,6)·0,5 = 0,2 + 0,4 − 0,3 = 0,3" },
    { t: "num", g: "Netz durchrechnen", q: "Verdecktes Neuron h₂: Bias −0,5, Gewichte 0,3 und 0,8, ReLU. Gleiche Eingaben. Wie groß ist die Aktivierung von h₂?", a: 0.2, s: "z = −0,5 + 0,3·1 + 0,8·0,5 = 0,2. ReLU(0,2) = 0,2." },
    { t: "num", g: "Netz durchrechnen", k: true, q: "Ausgabeneuron: Bias 0,1, Gewicht 1,0 von h₁ und −0,5 von h₂. Mit a(h₁) = 0,3 und a(h₂) = 0,2: Wie groß ist z am Ausgang?", a: 0.3, s: "z = 0,1 + 1,0·0,3 + (−0,5)·0,2 = 0,1 + 0,3 − 0,1 = 0,3" },
    { t: "num", g: "Netz durchrechnen", k: true, q: "Der Ausgang benutzt Sigmoid. Wie groß ist die Ausgabe ŷ = σ(0,3)? (drei Nachkommastellen)", a: 0.574, s: "e⁻⁰·³ ≈ 0,741. σ(0,3) = 1/1,741 ≈ 0,574" },
    { t: "mc", g: "Verstehen", k: true, q: "Ein Netz soll Bilder in drei Klassen einordnen (Hund, Katze, Vogel). Welche Aktivierung nimmt man am Ausgang?", o: ["Softmax", "ReLU", "Heaviside", "Gar keine"], a: 0, s: "Softmax macht aus den drei Ausgängen Wahrscheinlichkeiten, die zusammen 1 ergeben. Die größte ist die erkannte Klasse." },
    { t: "mc", g: "Verstehen", q: "Kann ein Netz mit einer verdeckten Schicht XOR lösen?", o: ["Ja, die verdeckte Schicht kombiniert zwei Trenngeraden", "Nein, XOR geht nie", "Nur mit Softmax", "Nur wenn alle Gewichte 1 sind"], a: 0, s: "Zum Beispiel h₁ = ODER, h₂ = UND und am Ausgang „h₁ und nicht h₂“. Das ist genau XOR." },
    { t: "rev", g: "Verstehen", q: "Nimm Stellung: „Sobald ein neuronales Netz eine verdeckte Schicht hat, kann es automatisch jedes Klassifikationsproblem fehlerfrei lösen.“", s: "Die Aussage ist falsch. Eine verdeckte Schicht macht nicht-lineare Trennungen wie XOR möglich. Ob das Netz ein Problem wirklich löst, hängt aber von genug Neuronen, guten Trainingsdaten und erfolgreichem Training ab. Außerdem kann es die Trainingsdaten auswendig lernen und bei neuen Daten Fehler machen. „Automatisch“ und „fehlerfrei“ stimmen also nicht." }
   ] },
 { n: 6, date: "", wd: "", title: "Pseudocode und Abi-Training", short: "Operationen schreiben",
   goal: "Du kannst die typischen Operationen (vorhersage, berechneNettoinput, vorhersageReLU, softmaxAlle) in Pseudocode schreiben und weißt, wie du die Punkte bei einer Abi-Aufgabe zu neuronalen Netzen holst.",
   blocks: [
    ["15", "skript", "<b>Pseudocode-Regeln.</b> Wie eine Operation mit Parametern, Datentypen und Rückgabe aussieht."],
    ["25", "skript", "<b>vorhersage und vorhersageReLU.</b> Eine Formel, ein Vergleich, eine Rückgabe."],
    ["25", "skript", "<b>Listen: berechneNettoinput und softmaxAlle.</b> Schleife über alle Werte, Summe, zweite Schleife."],
    ["15", "skript", "<b>Abi-Rezept.</b> Die Checkliste aus der Erklärung einmal durchgehen."],
    ["30", "ueben", "<b>Übungen</b> unten. Die Code-Aufgaben auf Papier schreiben und erst dann aufklappen."],
    ["10", "test", "<b>Selbsttest.</b> softmaxAlle ohne Vorlage aufschreiben."]
   ],
   notes: [["tip", "Punkte im Code", "Im Abi gibt es Teilpunkte für die richtige Kopfzeile (Name, Parameter mit Typen, Rückgabetyp), für die richtige Formel und für die Rückgabe. Fang deshalb immer mit der Kopfzeile an."]],
   vids: [], links: [["Zur Probeklausur", "#klausur"]],
   checks: ["Eine Operation mit Parametern, Typen und Rückgabe aufschreiben", "vorhersage mit Heaviside in Pseudocode schreiben", "berechneNettoinput mit einer Schleife über Listen schreiben", "softmaxAlle mit zwei Schleifen schreiben", "Einen Pseudocode Zeile für Zeile durchgehen und das Ergebnis angeben"],
   groups: ["Code lesen", "Code schreiben"],
   core: { b: [0, 1, 2, 3, 4, 5], c: [0, 1, 2, 4] },
   ex: [
    { t: "num", g: "Code lesen", k: true, q: "Was gibt vorhersage(1, 0, −0,5, 1, 1) zurück? (Parameter: input1, input2, w0, w1, w2, Heaviside)", a: 1, s: "z = −0,5 + 1·1 + 1·0 = 0,5 ≥ 0, also Rückgabe 1." },
    { t: "num", g: "Code lesen", k: true, q: "Was gibt berechneNettoinput([1, 2], [0,5; −0,25], 0,1) zurück? (inputs, gewichte, bias)", a: 0.1, s: "Summe = 1·0,5 + 2·(−0,25) = 0,5 − 0,5 = 0. Dazu der Bias: 0 + 0,1 = 0,1." },
    { t: "num", g: "Code lesen", q: "Was gibt vorhersageReLU(2, 1, −1, 0,5, −1) zurück? (input1, input2, w0, w1, w2)", a: 0, s: "z = −1 + 0,5·2 + (−1)·1 = −1. ReLU(−1) = 0." },
    { t: "num", g: "Code lesen", q: "softmaxAlle([0, 0]) gibt eine Liste zurück. Wie groß ist der erste Wert?", a: 0.5, s: "e⁰ = 1 für beide, Summe 2. Jeder Wert ist 1/2 = 0,5." },
    { t: "mc", g: "Code lesen", k: true, q: "In einer Lösung steht für die Heaviside-Funktion „WENN z > 0 DANN RÜCKGABE 1“. Was ist falsch?", o: ["Bei z = 0 muss auch 1 herauskommen, also z >= 0", "Nichts, das stimmt", "Es muss z < 0 heißen", "Die Rückgabe muss 0 sein"], a: 0, s: "H(z) = 1 für z ≥ 0. Mit > würde z = 0 fälschlich 0 ergeben." },
    { t: "mc", g: "Code lesen", q: "Was berechnet die erste Schleife in softmaxAlle?", o: ["Die Summe aller e^z", "Den größten Wert", "Die Summe aller z", "Die Länge der Liste"], a: 0, s: "Für den Nenner von Softmax braucht man Σ e^(zᵢ). Erst danach kann jeder Wert durch diese Summe geteilt werden." },
    { t: "rev", g: "Code schreiben", k: true, q: "Schreibe die Operation vorhersage(input1: FKZ, input2: FKZ, w0: FKZ, w1: FKZ, w2: FKZ): GZ, die die Ausgabe eines Perzeptrons mit Heaviside-Funktion berechnet.", s: CODE("OPERATION vorhersage(input1: FKZ, input2: FKZ, w0: FKZ, w1: FKZ, w2: FKZ): GZ\n  z := w0 + w1 * input1 + w2 * input2\n  WENN z >= 0 DANN\n    RÜCKGABE 1\n  SONST\n    RÜCKGABE 0\n  ENDE WENN\nENDE OPERATION") },
    { t: "rev", g: "Code schreiben", k: true, q: "Schreibe berechneNettoinput(inputs: Liste<FKZ>, gewichte: Liste<FKZ>, bias: FKZ): FKZ, die das Skalarprodukt berechnet und den Bias addiert.", s: CODE("OPERATION berechneNettoinput(inputs: Liste<FKZ>, gewichte: Liste<FKZ>, bias: FKZ): FKZ\n  summe := 0\n  FÜR i := 0 BIS länge(inputs) - 1\n    summe := summe + inputs[i] * gewichte[i]\n  ENDE FÜR\n  RÜCKGABE summe + bias\nENDE OPERATION") },
    { t: "rev", g: "Code schreiben", q: "Schreibe vorhersageReLU(input1: FKZ, input2: FKZ, w0: FKZ, w1: FKZ, w2: FKZ): FKZ.", s: CODE("OPERATION vorhersageReLU(input1: FKZ, input2: FKZ, w0: FKZ, w1: FKZ, w2: FKZ): FKZ\n  z := w0 + w1 * input1 + w2 * input2\n  WENN z > 0 DANN\n    RÜCKGABE z\n  SONST\n    RÜCKGABE 0\n  ENDE WENN\nENDE OPERATION") + "<p>Kürzer geht auch RÜCKGABE max(0, z).</p>" },
    { t: "rev", g: "Code schreiben", k: true, q: "Schreibe softmaxAlle(werte: Liste<FKZ>): Liste<FKZ>. Beispiel: softmaxAlle([−2; 1,3; 0; −1; 0,4]) = [0,02; 0,551; 0,15; 0,055; 0,224].", s: CODE("OPERATION softmaxAlle(werte: Liste<FKZ>): Liste<FKZ>\n  summe := 0\n  FÜR JEDES z IN werte\n    summe := summe + exp(z)\n  ENDE FÜR\n  ergebnis := neue Liste<FKZ>\n  FÜR JEDES z IN werte\n    ergebnis.hinzufügen(exp(z) / summe)\n  ENDE FÜR\n  RÜCKGABE ergebnis\nENDE OPERATION") }
   ] }
];

export const INF_LESSONS: Record<number, Lesson[]> = {
 1: [
  { t: "Was ist KI überhaupt?", k: true, h:
   "<p>Künstliche Intelligenz (KI) heißt: Ein Computer löst eine Aufgabe, für die ein Mensch nachdenken müsste, zum Beispiel ein Spiel gewinnen, ein Bild erkennen oder Spam aussortieren.</p>" +
   "<p>Es gibt dafür zwei große Wege:</p><ol><li><b>Klassische KI:</b> Der Mensch schreibt das Wissen als Regeln hin oder das Programm sucht systematisch alle Möglichkeiten durch (Minimax, Breitensuche, A*).</li><li><b>Maschinelles Lernen (ML):</b> Niemand schreibt die Regeln. Das Programm lernt sie selbst aus vielen Beispielen.</li></ol>" +
   LK("Jedes maschinelle Lernen ist KI, aber nicht jede KI lernt. Minimax ist KI ohne Lernen.") },
  { t: "Die drei Arten des maschinellen Lernens", g: "Lernarten", k: true, h:
   "<p>Die Frage ist immer: <b>Was steht in den Trainingsdaten?</b></p>" +
   TAB(["Lernart", "Was in den Daten steht", "Ziel", "Beispiel"], [["<b>Überwacht</b> (supervised)", "Eingabe <b>und</b> richtige Antwort (Label)", "neue Eingaben richtig zuordnen", "Spamfilter, Bilderkennung"], ["<b>Unüberwacht</b> (unsupervised)", "nur Eingaben, keine Antworten", "selbst Gruppen oder Muster finden", "Kundengruppen, k-Means"], ["<b>Bestärkend</b> (reinforcement)", "keine Daten vorab, nur Belohnung oder Strafe für Aktionen", "eine gute Strategie finden", "Pong, Roboter laufen lassen"]]) +
   LX("<p>Eine KI soll Hunde und Katzen unterscheiden. Hat jedes Foto schon den Namen „Hund“ oder „Katze“, ist es <b>überwacht</b>. Hat man nur Fotos ohne Namen und will sehen, welche ähnlich sind, ist es <b>unüberwacht</b>.</p>") +
   LK("Labels da → überwacht. Keine Labels → unüberwacht. Belohnung für Handlungen → bestärkend.") },
  { t: "Symbolisch, subsymbolisch, hybrid", g: "Symbolisch oder subsymbolisch", h:
   "<p><b>Symbolisch</b> heißt, das Wissen steht in lesbaren Zeichen da, zum Beispiel als Regel „WENN Fieber UND Husten, DANN Grippe“. Man kann nachlesen, warum die KI so entschieden hat.</p>" +
   "<p><b>Subsymbolisch</b> heißt, das Wissen steckt in vielen Zahlen, den Gewichten eines neuronalen Netzes. Es gibt keine Regel, die man ablesen kann. Das Netz ist eine Art Blackbox.</p>" +
   "<p><b>Hybrid</b> heißt, beides wird kombiniert: Ein Netz erkennt zum Beispiel ein Stoppschild, und eine feste Regel sorgt dafür, dass das Auto bremst.</p>" +
   LK("Neuronale Netze sind subsymbolisch. Expertensysteme und Entscheidungsregeln sind symbolisch.") },
  { t: "KI ohne maschinelles Lernen", g: "KI ohne Lernen", k: true, h:
   "<p>Im Abi kommt oft: „Nennen Sie ein KI-Verfahren, das nicht auf maschinellem Lernen basiert.“ Die sicherste Antwort ist <b>Minimax</b>.</p>" +
   "<ol><li>Das Programm baut einen Baum mit allen möglichen Zügen, zum Beispiel beim Tic-Tac-Toe.</li><li>Die Endstellungen werden bewertet: Sieg +1, Unentschieden 0, Niederlage −1.</li><li>Von unten nach oben wird gerechnet: Bin ich am Zug, nehme ich das <b>Maximum</b>. Ist der Gegner am Zug, rechnet man mit dem <b>Minimum</b>, weil er seinen besten Zug macht.</li></ol>" +
   "<p>Andere Beispiele sind Breitensuche, Tiefensuche, A* bei der Wegsuche und Expertensysteme mit festen Regeln.</p>" +
   LK("Minimax lernt nichts. Es sucht und bewertet. Deshalb ist es KI ohne ML.") },
  { t: "So schreibst du die Antwort im Abi", g: "Abi-Fragen", k: true, h:
   "<p>Bei „Welche Lernart ist am besten geeignet?“ gibt es die Punkte für die Begründung. Nimm diese Vorlage:</p>" +
   LF("„… ist geeignet, weil die Trainingsdaten …“") +
   LX("<p><b>Pong:</b> „Bestärkendes Lernen ist am besten geeignet, weil es keine Beispiele mit dem richtigen Schlägerzug gibt. Die KI probiert Bewegungen aus und lernt aus der Belohnung (Punkt bei Treffer) und der Strafe (Punktverlust bei Fehlschlag).“</p>") +
   LK("Immer zwei Teile: Lernart nennen und mit den Daten oder der Belohnung begründen.") }
 ],
 2: [
  { t: "Ein Perzeptron ist eine kleine Entscheidungsmaschine", g: "Summe und Ausgabe", k: true, h:
   "<p>Ein Perzeptron ist das einfachste künstliche Neuron. Es bekommt Zahlen hinein und sagt am Ende <b>Ja (1)</b> oder <b>Nein (0)</b>.</p>" + svgPerceptron(false) +
   TAB(["Teil", "Zeichen", "Bedeutung"], [["Eingaben", "x₁, x₂, …", "die Informationen, meist 0 oder 1"], ["Gewichte", "w₁, w₂, …", "wie wichtig jede Eingabe ist"], ["Nettoinput", "z", "die gewichtete Summe"], ["Schwellwert", "θ", "ab hier sagt das Perzeptron Ja"], ["Ausgabe", "y", "1 oder 0"]]) +
   LK("Gewichte machen eine Eingabe wichtig oder unwichtig, der Schwellwert entscheidet, ab wann es Ja heißt.") },
  { t: "Rechnen in drei Schritten", g: "Summe und Ausgabe", k: true, h:
   "<ol><li><b>Malnehmen:</b> jede Eingabe mit ihrem Gewicht.</li><li><b>Zusammenzählen:</b> " + M("z = w₁·x₁ + w₂·x₂") + "</li><li><b>Vergleichen:</b> Ist " + M("z ≥ θ") + ", dann " + M("y = 1") + ", sonst " + M("y = 0") + ".</li></ol>" +
   LX("<p>x₁ = 1, x₂ = 0, w₁ = 0,6, w₂ = 0,4, θ = 0,5</p><p>z = 0,6·1 + 0,4·0 = 0,6. Weil 0,6 ≥ 0,5, ist y = 1.</p>") +
   LK("„Größer oder gleich“: Bei z = θ kommt 1 heraus.") },
  { t: "UND und ODER als Perzeptron", g: "UND und ODER", k: true, h:
   "<p>Mit w₁ = w₂ = 1 ist z einfach die Anzahl der Einsen. Der Schwellwert entscheidet, wie viele Einsen nötig sind.</p>" +
   TAB(["x₁", "x₂", "z", "UND (θ = 1,5)", "ODER (θ = 0,5)"], [[0, 0, 0, 0, 0], [0, 1, 1, 0, 1], [1, 0, 1, 0, 1], [1, 1, 2, 1, 1]]) +
   "<p>Für UND muss θ zwischen 1 und 2 liegen (1 &lt; θ ≤ 2), für ODER zwischen 0 und 1 (0 &lt; θ ≤ 1).</p>" +
   LK("UND: θ so wählen, dass nur zwei Einsen reichen. ODER: schon eine Eins muss reichen.") },
  { t: "Das Club-Beispiel aus dem Unterricht", g: "UND und ODER", h:
   "<p>x₁ = 1, wenn die Person über 18 ist, x₂ = 1 bei Mitgliedsausweis. w₁ = 2, w₂ = 1, θ = 2.</p>" +
   TAB(["über 18", "Ausweis", "z = 2x₁ + x₂", "Einlass"], [[0, 0, 0, "nein"], [0, 1, 1, "nein"], [1, 0, 2, "ja"], [1, 1, 3, "ja"]]) +
   "<p>Weil das Alter allein schon θ erreicht, entscheidet hier nur das Alter. Der Ausweis bringt nur etwas, wenn man den Schwellwert auf 3 erhöht. Dann braucht man beides, und es wird ein UND.</p>" },
  { t: "Gewichte verstehen", g: "Gewichte deuten", h:
   "<ul><li><b>Großes Gewicht:</b> Diese Eingabe zählt viel.</li><li><b>Gewicht nahe 0:</b> Diese Eingabe ist fast egal.</li><li><b>Negatives Gewicht:</b> Diese Eingabe spricht gegen ein Ja, sie „hemmt“.</li></ul>" +
   LX("<p>„Fahrrad fahren?“ mit x₁ = Sonne (w₁ = 2) und x₂ = Regen (w₂ = −3), θ = 1. Sonne allein gibt z = 2, also Ja. Sonne und Regen gibt z = 2 − 3 = −1, also Nein.</p>") }
 ],
 3: [
  { t: "Vom Schwellwert zum Bias", g: "Bias", k: true, h:
   "<p>Statt mit θ zu vergleichen, bringt man θ auf die andere Seite: " + M("z ≥ θ") + " ist dasselbe wie " + M("z − θ ≥ 0") + ".</p>" +
   "<p>Das −θ wird als eigenes Gewicht <b>w₀</b> geschrieben, und es bekommt einen Eingang, der <b>immer 1</b> ist. Dieses w₀ heißt <b>Bias</b>.</p>" + svgPerceptron(true) +
   LF("z = w₀·1 + w₁·x₁ + w₂·x₂ &nbsp;&nbsp; y = H(z)") +
   "<p>Die <b>Heaviside-Funktion</b> H macht daraus 0 oder 1: " + M("H(z) = 1") + " für " + M("z ≥ 0") + ", sonst 0.</p>" +
   LX("<p>θ = 1,5 wird zu w₀ = −1,5. Mit w₁ = w₂ = 1 und Eingabe (1, 1): z = −1,5 + 1 + 1 = 0,5 ≥ 0, also y = 1. Das ist wieder UND.</p>") +
   LK("w₀ = −θ. Der Bias-Eingang ist immer 1.") },
  { t: "Die Trenngerade", g: "Trenngerade", k: true, h:
   "<p>Bei zwei Eingängen kann man jede Eingabe als Punkt (x | y) zeichnen. Die Grenze zwischen Ja und Nein liegt genau dort, wo <b>z = 0</b> ist.</p>" +
   LF("w₀ + w₁·x + w₂·y = 0 &nbsp; ⇒ &nbsp; y = −(w₁/w₂)·x − w₀/w₂") +
   LX("<p>w₀ = −3, w₁ = 1, w₂ = 2</p><ol><li>z = 0 setzen: −3 + x + 2y = 0</li><li>2y allein: 2y = −x + 3</li><li>durch 2: y = −0,5x + 1,5</li></ol><p>Also m = −0,5 und b = 1,5.</p>") + svgLine() +
   LK("m = −w₁/w₂ und b = −w₀/w₂. Beide mit Minus.") },
  { t: "Welche Seite ist Klasse 1?", g: "Trenngerade", h:
   "<p>Setz einfach einen Punkt in z ein. Ist z ≥ 0, liegt er auf der Seite von Klasse 1.</p>" +
   LX("<p>Für w₀ = −3, w₁ = 1, w₂ = 2 und den Punkt (0 | 0): z = −3 &lt; 0, also Klasse 0. Der Ursprung liegt unter der Geraden, also ist oberhalb Klasse 1.</p>") },
  { t: "Linear separierbar", g: "Separierbarkeit und XOR", k: true, h:
   "<p>Daten heißen <b>linear separierbar</b>, wenn man die beiden Klassen mit <b>einer Geraden</b> trennen kann. Bei drei Eingängen ist es eine Ebene.</p>" +
   "<p>Ein einzelnes Perzeptron kann genau solche Daten richtig einteilen, mehr nicht. Für die Skizze im Abi: Koordinatensystem, etwa fünf Punkte einer Klasse unten links, fünf der anderen oben rechts, eine Gerade dazwischen.</p>" +
   LK("Ein Perzeptron = eine Gerade.") },
  { t: "Das XOR-Problem", g: "Separierbarkeit und XOR", k: true, h:
   "<p>XOR (exklusives ODER) gibt 1 aus, wenn <b>genau einer</b> der Eingänge 1 ist.</p>" +
   TAB(["x₁", "x₂", "XOR"], [[0, 0, 0], [0, 1, 1], [1, 0, 1], [1, 1, 0]]) + svgXor() +
   "<p>Die beiden 1-Punkte liegen diagonal gegenüber. Egal wie man eine Gerade legt, immer liegt ein falscher Punkt auf der falschen Seite. XOR ist <b>nicht linear separierbar</b>.</p>" +
   LK("Lösung: ein mehrschichtiges Netz mit verdeckter Schicht, das mehrere Geraden kombiniert (Tag 5).") },
  { t: "Was passiert ohne Bias?", g: "Separierbarkeit und XOR", h:
   "<p>Mit w₀ = 0 wird b = −w₀/w₂ = 0. Die Trenngerade geht dann immer durch den Ursprung (0 | 0).</p>" +
   "<p>Das Perzeptron kann also weiterhin trennen, aber nur mit Geraden durch den Ursprung. Die Aussage „ohne Bias keine Trennung“ ist deshalb falsch. Richtig ist: Ohne Bias ist es eingeschränkt.</p>" }
 ],
 4: [
  { t: "Lernen heißt Gewichte verschieben", g: "Fehler und Änderung", k: true, h:
   "<p>Am Anfang sind die Gewichte zufällig oder 0. Das Perzeptron rät also. Beim Lernen bekommt es Beispiele mit der richtigen Antwort y und vergleicht sie mit seiner eigenen Ausgabe <b>ŷ</b> (sprich „y Dach“).</p>" +
   TAB(["Fall", "Fehler e = y − ŷ", "Was passiert"], [["richtig", "0", "nichts"], ["y = 1, ŷ = 0", "+1", "Gewichte der aktiven Eingänge werden größer"], ["y = 0, ŷ = 1", "−1", "Gewichte der aktiven Eingänge werden kleiner"]]) +
   LK("Nur bei Fehlern wird etwas geändert, und nur bei Eingängen, die nicht 0 waren.") },
  { t: "Die Lernregel", g: "Fehler und Änderung", k: true, h:
   LF("Δwᵢ = α·(y − ŷ)·xᵢ &nbsp;&nbsp; Δw₀ = α·(y − ŷ) &nbsp;&nbsp; wᵢ := wᵢ + Δwᵢ") +
   "<p><b>α</b> ist die Lernrate, eine kleine Zahl wie 0,1. Sie bestimmt, wie groß die Schritte sind.</p>" +
   "<p>Der ganze Algorithmus aus dem Unterricht:</p><ol><li>Alle Gewichte auf 0 setzen.</li><li>Für jedes Beispiel (x, y): ŷ ausrechnen, Δwᵢ ausrechnen, Gewichte ändern.</li><li>Schritt 2 wiederholen, bis eine ganze Runde (Epoche) ohne Fehler durchläuft.</li></ol>" },
  { t: "Ein Lernschritt vorgerechnet", g: "Ein ganzer Lernschritt", k: true, h:
   LX("<p>w₀ = 0,2, w₁ = −0,4, w₂ = 0,1, Eingabe (1, 1), richtige Antwort y = 1, α = 0,2</p><ol><li><b>Ausgabe:</b> z = 0,2 − 0,4 + 0,1 = −0,1, also ŷ = 0</li><li><b>Fehler:</b> e = 1 − 0 = 1</li><li><b>Änderungen:</b> Δw₀ = 0,2·1 = 0,2, Δw₁ = 0,2·1·1 = 0,2, Δw₂ = 0,2·1·1 = 0,2</li><li><b>Neu:</b> w₀ = 0,4, w₁ = −0,2, w₂ = 0,3</li><li><b>Probe:</b> z = 0,4 − 0,2 + 0,3 = 0,5, jetzt kommt 1 heraus</li></ol>") +
   LK("Erst ŷ mit den alten Gewichten, dann alle Gewichte auf einmal ändern.") },
  { t: "Lernrate und Epochen", g: "Verstehen", h:
   "<ul><li><b>Große Lernrate:</b> große Sprünge, schnell, aber unruhig. Die Gewichte können über das Ziel schießen.</li><li><b>Kleine Lernrate:</b> kleine, sichere Schritte, braucht aber viele Epochen.</li><li><b>Epoche:</b> ein Durchgang durch alle Trainingsdaten.</li></ul>" +
   "<p>Sind die Daten linear separierbar, findet das Perzeptron sicher Gewichte ohne Fehler und hört auf. Bei XOR gibt es solche Gewichte nicht, die Schleife läuft endlos. Deshalb setzt man in der Praxis zusätzlich eine maximale Zahl an Epochen.</p>" }
 ],
 5: [
  { t: "Warum mehrere Schichten?", k: true, h:
   "<p>Ein Perzeptron zieht eine Gerade. Für XOR braucht man zwei Geraden. Also nimmt man mehrere Neuronen hintereinander:</p>" + svgMlp() +
   "<ul><li><b>Eingabeschicht:</b> die x-Werte</li><li><b>Verdeckte Schicht</b> (hidden layer): rechnet Zwischenergebnisse</li><li><b>Ausgabeschicht:</b> das Ergebnis ŷ</li></ul>" +
   "<p>Die Schreibweise aus dem Unterricht für Schicht l:</p>" + LF("a⁽¹⁾ = x &nbsp;&nbsp; z⁽ˡ⁾ = W⁽ˡ⁻¹⁾·a⁽ˡ⁻¹⁾ + b⁽ˡ⁻¹⁾ &nbsp;&nbsp; a⁽ˡ⁾ = g(z⁽ˡ⁾) &nbsp;&nbsp; ŷ = a⁽ᴸ⁾") +
   LK("Jedes Neuron rechnet wie ein Perzeptron: Bias plus gewichtete Summe, dann Aktivierungsfunktion.") },
  { t: "Die vier Aktivierungsfunktionen", g: "Aktivierungsfunktionen", k: true, h:
   svgAct() +
   TAB(["Funktion", "Formel", "Werte", "Wofür"], [["Heaviside", "H(z) = 1 für z ≥ 0, sonst 0", "nur 0 oder 1", "einfaches Perzeptron"], ["ReLU", "ReLU(z) = max(0, z)", "0 bis unendlich", "verdeckte Schichten"], ["Sigmoid", "σ(z) = 1 / (1 + e⁻ᶻ)", "zwischen 0 und 1", "Ausgang für Ja/Nein mit Wahrscheinlichkeit"], ["Softmax", "e^(z_k) / Σ e^(zᵢ)", "zwischen 0 und 1, Summe 1", "Ausgang bei mehreren Klassen"]]) +
   LX("<p>ReLU(−2) = 0, ReLU(1,5) = 1,5. σ(0) = 0,5, σ(1) ≈ 0,731, σ(−1) ≈ 0,269.</p>") +
   LK("ReLU: negativ wird 0. Sigmoid bei 0 ist genau 0,5.") },
  { t: "Ein Netz Schritt für Schritt", g: "Netz durchrechnen", k: true, h:
   LX("<p>Eingaben x₁ = 1, x₂ = 0,5</p><ol><li><b>h₁</b> (Bias 0,2, Gewichte 0,4 und −0,6, ReLU): z = 0,2 + 0,4 − 0,3 = 0,3, a = 0,3</li><li><b>h₂</b> (Bias −0,5, Gewichte 0,3 und 0,8, ReLU): z = −0,5 + 0,3 + 0,4 = 0,2, a = 0,2</li><li><b>Ausgang</b> (Bias 0,1, Gewichte 1,0 und −0,5, Sigmoid): z = 0,1 + 0,3 − 0,1 = 0,3</li><li>ŷ = σ(0,3) = 1/(1 + e⁻⁰·³) ≈ 0,574</li></ol>") +
   LK("Immer Schicht für Schicht. Die Ausgaben einer Schicht sind die Eingaben der nächsten.") },
  { t: "Softmax: aus Zahlen werden Wahrscheinlichkeiten", g: "Softmax", k: true, h:
   LF("softmax(z_k) = e^(z_k) / (e^(z₁) + e^(z₂) + … + e^(zₙ))") +
   LX("<p>z₁ = 2, z₂ = 0</p><ol><li>e² ≈ 7,389 und e⁰ = 1</li><li>Summe: 8,389</li><li>softmax(z₁) = 7,389/8,389 ≈ 0,88, softmax(z₂) = 1/8,389 ≈ 0,12</li></ol><p>Probe: 0,88 + 0,12 = 1. Das Netz ist zu 88 % sicher, dass es Klasse 1 ist.</p>") +
   LK("Durch die Summe der e-Werte teilen, nicht durch die Summe der z-Werte.") },
  { t: "XOR mit zwei Schichten", g: "Verstehen", h:
   "<p>h₁ rechnet ODER (w₀ = −0,5, w₁ = w₂ = 1), h₂ rechnet UND (w₀ = −1,5, w₁ = w₂ = 1). Der Ausgang rechnet „h₁ und nicht h₂“ mit w₀ = −0,5, Gewicht 1 von h₁ und −1 von h₂, alle mit Heaviside.</p>" +
   TAB(["x₁", "x₂", "h₁ (ODER)", "h₂ (UND)", "z am Ausgang", "ŷ"], [[0, 0, 0, 0, "−0,5", 0], [0, 1, 1, 0, "0,5", 1], [1, 0, 1, 0, "0,5", 1], [1, 1, 1, 1, "−0,5", 0]]) +
   LK("Zwei Geraden in der verdeckten Schicht, eine Entscheidung am Ausgang: Das ist XOR.") },
  { t: "Löst eine verdeckte Schicht alles?", g: "Verstehen", h:
   "<p>Nein. Eine verdeckte Schicht macht nicht-lineare Trennungen möglich. Ob es klappt, hängt aber ab von</p><ul><li>genug Neuronen,</li><li>guten und genug Trainingsdaten,</li><li>erfolgreichem Training.</li></ul><p>Außerdem kann ein Netz die Trainingsdaten auswendig lernen und bei neuen Daten falsch liegen (Überanpassung). „Automatisch fehlerfrei“ stimmt also nicht.</p>" }
 ],
 6: [
  { t: "Pseudocode-Regeln", k: true, h:
   "<p>So sieht eine Operation im Abi aus:</p>" + CODE("OPERATION name(param1: FKZ, param2: GZ): Rückgabetyp\n  variable := wert\n  WENN bedingung DANN\n    …\n  SONST\n    …\n  ENDE WENN\n  FÜR i := 0 BIS länge(liste) - 1\n    …\n  ENDE FÜR\n  RÜCKGABE ergebnis\nENDE OPERATION") +
   TAB(["Zeichen", "Bedeutung"], [["FKZ", "Fließkommazahl (z. B. 0,5)"], ["GZ", "Ganzzahl (z. B. 1)"], ["Liste&lt;FKZ&gt;", "Liste von Kommazahlen"], [":=", "Zuweisung"], ["exp(z)", "eᶻ"]]) +
   LK("Kopfzeile zuerst: Name, Parameter mit Typ, Rückgabetyp. Dafür gibt es schon Punkte.") },
  { t: "vorhersage mit Heaviside", g: "Code schreiben", k: true, h:
   CODE("OPERATION vorhersage(input1: FKZ, input2: FKZ, w0: FKZ, w1: FKZ, w2: FKZ): GZ\n  z := w0 + w1 * input1 + w2 * input2\n  WENN z >= 0 DANN\n    RÜCKGABE 1\n  SONST\n    RÜCKGABE 0\n  ENDE WENN\nENDE OPERATION") +
   "<p>In Python sähe das so aus:</p>" + CODE("def vorhersage(input1, input2, w0, w1, w2):\n    z = w0 + w1 * input1 + w2 * input2\n    return 1 if z >= 0 else 0") +
   LK(">= und nicht >, weil H(0) = 1 ist.") },
  { t: "berechneNettoinput mit Listen", g: "Code schreiben", k: true, h:
   "<p>Bei beliebig vielen Eingängen braucht man eine Schleife. Man nimmt immer die Eingabe und das Gewicht mit demselben Index.</p>" +
   CODE("OPERATION berechneNettoinput(inputs: Liste<FKZ>, gewichte: Liste<FKZ>, bias: FKZ): FKZ\n  summe := 0\n  FÜR i := 0 BIS länge(inputs) - 1\n    summe := summe + inputs[i] * gewichte[i]\n  ENDE FÜR\n  RÜCKGABE summe + bias\nENDE OPERATION") +
   LX("<p>berechneNettoinput([1, 2], [0,5; −0,25], 0,1): summe = 0,5 − 0,5 = 0, Rückgabe 0 + 0,1 = 0,1.</p>") },
  { t: "softmaxAlle", g: "Code schreiben", k: true, h:
   "<p>Zwei Schleifen: In der ersten wird die Summe aller eᶻ gebildet, in der zweiten wird jeder Wert durch diese Summe geteilt.</p>" +
   CODE("OPERATION softmaxAlle(werte: Liste<FKZ>): Liste<FKZ>\n  summe := 0\n  FÜR JEDES z IN werte\n    summe := summe + exp(z)\n  ENDE FÜR\n  ergebnis := neue Liste<FKZ>\n  FÜR JEDES z IN werte\n    ergebnis.hinzufügen(exp(z) / summe)\n  ENDE FÜR\n  RÜCKGABE ergebnis\nENDE OPERATION") +
   LK("Die Summe muss fertig sein, bevor du teilst. Deshalb zwei getrennte Schleifen.") },
  { t: "Das Abi-Rezept für neuronale Netze", k: true, h:
   "<ol><li><b>Lernart:</b> nennen und mit den Daten begründen.</li><li><b>Perzeptron ausrechnen:</b> z mit Bias hinschreiben, Zahlen einsetzen, H(z) angeben.</li><li><b>Mehrschichtig:</b> erst alle verdeckten Neuronen (z und Aktivierung), dann der Ausgang. Zwischenergebnisse hinschreiben, dafür gibt es Teilpunkte.</li><li><b>Trenngerade:</b> z = 0 setzen, nach y umstellen, m und b angeben.</li><li><b>Softmax:</b> alle e-Werte, Summe, teilen, Probe mit Summe 1.</li><li><b>Stellung nehmen:</b> „Die Aussage ist falsch/richtig, weil …“ plus ein Beispiel.</li><li><b>Pseudocode:</b> Kopfzeile, Formel, Rückgabe.</li></ol>" +
   LK("Rechenweg mit Formel aufschreiben. Eine nackte Zahl gibt kaum Punkte.") }
 ]
};

export const INF_REVIEW: Record<number, Review> = {
 1: { points: ["Überwacht: Daten mit Labels. Unüberwacht: keine Labels, Gruppen finden. Bestärkend: Belohnung und Strafe.", "Neuronale Netze sind subsymbolisch, Regeln sind symbolisch.", "Minimax ist KI ohne maschinelles Lernen."], q: [
  { t: "mc", q: "Eine KI sortiert Röntgenbilder, bei denen Ärzte schon „krank“ oder „gesund“ eingetragen haben. Lernart?", o: ["Überwacht", "Unüberwacht", "Bestärkend", "Minimax"], a: 0, s: "Die Einträge der Ärzte sind Labels, also überwacht." },
  { t: "mc", q: "Eine KI lernt Schach, indem sie gegen sich selbst spielt und für Siege belohnt wird. Lernart?", o: ["Bestärkend", "Überwacht", "Unüberwacht", "Symbolisch"], a: 0, s: "Sie lernt aus Belohnung für ihre Züge, das ist bestärkendes Lernen." },
  { t: "mc", q: "Welches Verfahren lernt nicht aus Daten?", o: ["Minimax", "Perzeptron", "k-Means", "Neuronales Netz"], a: 0, s: "Minimax sucht nur und bewertet, es lernt nichts." }
 ] },
 2: { points: ["z = w₁·x₁ + w₂·x₂, dann y = 1, wenn z ≥ θ.", "Bei z = θ kommt 1 heraus.", "UND: θ zwischen 1 und 2, ODER: θ zwischen 0 und 1 (bei Gewichten 1)."], q: [
  { t: "num", q: "x = (1, 1), w₁ = 0,5, w₂ = 0,25. Wie groß ist z?", a: 0.75, s: "z = 0,5 + 0,25 = 0,75" },
  { t: "num", q: "Gleiches Perzeptron mit θ = 0,75. Ausgabe y?", a: 1, s: "z = θ, und weil „größer oder gleich“ gilt, ist y = 1." },
  { t: "mc", q: "w₁ = w₂ = 1. Welcher Schwellwert ergibt ODER?", o: ["θ = 1", "θ = 1,5", "θ = 2,5", "θ = 3"], a: 0, s: "Mit θ = 1 reicht schon eine Eins (z = 1 ≥ 1)." }
 ] },
 3: { points: ["Bias w₀ = −θ, der Bias-Eingang ist immer 1.", "Trenngerade: y = −(w₁/w₂)·x − w₀/w₂.", "XOR ist nicht linear separierbar."], q: [
  { t: "num", q: "w₀ = −2, w₁ = 1, w₂ = 4. Wie groß ist die Steigung m der Trenngeraden?", a: -0.25, s: "m = −w₁/w₂ = −1/4 = −0,25" },
  { t: "num", q: "Gleiches Perzeptron. Wie groß ist b?", a: 0.5, s: "b = −w₀/w₂ = 2/4 = 0,5" },
  { t: "mc", q: "Warum kann ein Perzeptron XOR nicht?", o: ["Die Klassen sind nicht durch eine Gerade trennbar", "Es fehlt der Bias", "Die Lernrate ist zu klein", "XOR braucht Softmax"], a: 0, s: "Ein Perzeptron zieht nur eine Gerade, XOR bräuchte zwei." }
 ] },
 4: { points: ["e = y − ŷ.", "Δwᵢ = α·e·xᵢ und Δw₀ = α·e.", "Schluss, wenn eine Epoche ohne Fehler durchläuft."], q: [
  { t: "num", q: "α = 0,5, y = 1, ŷ = 0, x₁ = 1, altes w₁ = −0,2. Neues w₁?", a: 0.3, s: "Δw₁ = 0,5·1·1 = 0,5, also w₁ = −0,2 + 0,5 = 0,3." },
  { t: "num", q: "α = 0,1, y = 0, ŷ = 1. Wie groß ist Δw₀?", a: -0.1, s: "e = −1, Δw₀ = 0,1·(−1) = −0,1." },
  { t: "mc", q: "ŷ = y. Was passiert mit den Gewichten?", o: ["Sie bleiben gleich", "Sie werden größer", "Sie werden kleiner", "Sie werden 0"], a: 0, s: "Der Fehler ist 0, also ist jede Änderung 0." }
 ] },
 5: { points: ["ReLU(z) = max(0, z), σ(z) = 1/(1 + e⁻ᶻ).", "Softmax: eᶻ durch die Summe aller eᶻ, Summe 1.", "Schicht für Schicht rechnen."], q: [
  { t: "num", q: "ReLU(−0,4) = ?", a: 0, s: "Negativ wird 0." },
  { t: "num", q: "σ(−1) auf drei Nachkommastellen?", a: 0.269, s: "1/(1 + e) = 1/3,718 ≈ 0,269" },
  { t: "num", q: "z₁ = 0, z₂ = 0. Softmax des ersten Neurons?", a: 0.5, s: "Beide e⁰ = 1, Summe 2, also 0,5." }
 ] },
 6: { points: ["Kopfzeile: OPERATION name(param: Typ): Rückgabetyp.", "Heaviside im Code: WENN z >= 0.", "softmaxAlle: erst Summe, dann teilen."], q: [
  { t: "num", q: "vorhersage(0, 1, 0,5, 1, −1) mit Heaviside. Rückgabe?", a: 0, s: "z = 0,5 + 0 − 1 = −0,5 < 0, also 0." },
  { t: "num", q: "berechneNettoinput([2, 1], [0,5; 0,5], −1) = ?", a: 0.5, s: "1 + 0,5 − 1 = 0,5" },
  { t: "mc", q: "Welcher Rückgabetyp passt zu vorhersage mit Heaviside?", o: ["GZ", "Liste<FKZ>", "Text", "Liste<GZ>"], a: 0, s: "Es kommt 0 oder 1 heraus, also eine Ganzzahl." }
 ] }
};

export const INF_TIPS: Record<string, string> = {
 "1.0": "Steht bei jedem Foto schon die richtige Antwort dabei?", "1.1": "Weiß jemand vorher, welche Gruppen es gibt?", "1.2": "Woher weiß der Roboter, ob er es gut gemacht hat?", "1.3": "Die von Hand sortierten E-Mails sind Beispiele mit Antwort.", "1.4": "Gibt es vorher fertige Beispiele, oder nur Punkte fürs Treffen?",
 "1.5": "Englisch „label“ heißt Etikett. Was klebt man auf die Trainingsdaten?", "1.6": "Un-überwacht: Es fehlt der „Lehrer“ mit den Antworten.", "1.7": "Kann man das Wissen als Satz lesen?", "1.8": "Was ändert sich beim Training eines Netzes?", "1.9": "Hybrid heißt gemischt.",
 "1.10": "Welches Verfahren probiert nur Züge durch, ohne Trainingsdaten?", "1.11": "Min steht für den Gegner.", "1.12": "Pro Lernart: Was ist in den Daten, was ist das Ziel?", "1.13": "Gibt es zu jedem Bild die richtige Antwort?", "1.14": "Denk an Tic-Tac-Toe und den Spielbaum.",
 "2.0": "Jede Eingabe mal ihr Gewicht, dann addieren.", "2.1": "Vergleiche z mit θ.", "2.2": "Der mittlere Eingang ist 0.", "2.3": "Achtung, x₂ ist negativ.", "2.4": "Ist −0,5 mindestens 0?",
 "2.5": "Größer oder gleich.", "2.6": "Bei UND darf nur (1, 1) durchkommen. Wie groß ist z dort, und bei (1, 0)?", "2.7": "Bei ODER muss schon eine Eins reichen.", "2.8": "Rechne z für (1,0), (0,1) und (1,1) aus. Nur (1,1) darf θ erreichen.", "2.9": "Unter 18 heißt x₁ = 0.",
 "2.10": "Wie groß ist z, wenn nur x₁ = 1 ist?", "2.11": "Ein negatives Gewicht zieht z nach unten.", "2.12": "Vergleiche die Größe der Gewichte.", "2.13": "Malnehmen, zusammenzählen, vergleichen.",
 "3.0": "Bias-Eingang ist 1: z = w₀ + w₁·x₁ + w₂·x₂", "3.1": "H(z) ist 1, wenn z ≥ 0.", "3.2": "0,5 · 0,4 = 0,2", "3.3": "Ist −0,1 mindestens 0?", "3.4": "w₀ = −θ",
 "3.5": "Schau in die Definition: z ≥ 0.", "3.6": "z = 0 setzen und nach y umstellen.", "3.7": "b = −w₀/w₂", "3.8": "Setz x = 4 und y = 1 in z ein.", "3.9": "m = −w₁/w₂, und w₂ ist negativ.",
 "3.10": "Umstellen: 2y = x − 2", "3.11": "Zeichne die vier Punkte und versuch eine Gerade.", "3.12": "Eine Gerade, zwei Seiten.", "3.13": "Was wird aus b, wenn w₀ = 0 ist?", "3.14": "Wo liegen die 1-Punkte bei XOR?",
 "4.0": "e = y − ŷ", "4.1": "Δw₁ = α·e·x₁", "4.2": "Altes Gewicht plus Änderung.", "4.3": "Der Bias-Eingang ist 1.", "4.4": "Erst z mit den alten Gewichten.",
 "4.5": "e = 1, x₁ = 1, α = 0,2", "4.6": "Δw₀ = α·e", "4.7": "x₂ = 1 wie x₁.", "4.8": "Hier ist e = 0 − 1 = −1.", "4.9": "Was ist α·e·0?",
 "4.10": "y − ŷ = 0", "4.11": "Große Schritte schießen über das Ziel.", "4.12": "Was ist eine Epoche?", "4.13": "Ist XOR linear separierbar?", "4.14": "Startwerte, Schleife, Fehler, Update, Abbruch.",
 "5.0": "max(0, z)", "5.1": "Positive Werte bleiben.", "5.2": "e⁰ = 1", "5.3": "e^(−1) ≈ 0,368", "5.4": "e^(2) ≈ 7,389",
 "5.5": "Was passiert für sehr große und sehr kleine z?", "5.6": "e¹ und e³ ausrechnen, dann e³ durch die Summe.", "5.7": "e¹ durch die Summe.", "5.8": "Alle e⁰ sind 1.", "5.9": "Man teilt jeden Wert durch die Summe aller.",
 "5.10": "Bias + 0,4·1 + (−0,6)·0,5", "5.11": "Bias + 0,3·1 + 0,8·0,5, dann ReLU.", "5.12": "Bias + 1,0·0,3 + (−0,5)·0,2", "5.13": "1/(1 + e^(−0,3))", "5.14": "Mehrere Klassen, Summe 1.",
 "5.15": "Denk an ODER und UND in der verdeckten Schicht.", "5.16": "Was braucht ein Netz außer einer Schicht noch zum Lernen?",
 "6.0": "z = w0 + w1·input1 + w2·input2", "6.1": "Erst Produkte addieren, dann Bias dazu.", "6.2": "z ausrechnen, dann max(0, z).", "6.3": "Alle e⁰ sind 1.", "6.4": "Was ist H(0)?",
 "6.5": "Was steht im Nenner der Softmax-Formel?", "6.6": "Kopfzeile, z, WENN, zwei Rückgaben.", "6.7": "summe := 0, dann Schleife über alle i.", "6.8": "Wie vorhersage, aber Rückgabe z oder 0.", "6.9": "Erste Schleife Summe, zweite Schleife teilen."
};

export const INF_REVIEW_TIPS: Record<string, string> = {
 "1.0": "Wer hat die Antworten eingetragen?", "1.1": "Woraus lernt die KI hier?", "1.2": "Welches Verfahren sucht nur?",
 "2.0": "0,5 + 0,25", "2.1": "Gleich zählt mit.", "2.2": "Eine Eins muss reichen.",
 "3.0": "m = −w₁/w₂", "3.1": "b = −w₀/w₂", "3.2": "Wie viele Geraden kann ein Perzeptron ziehen?",
 "4.0": "Δw₁ = α·e·x₁", "4.1": "e = 0 − 1", "4.2": "Der Fehler ist 0.",
 "5.0": "max(0, z)", "5.1": "e¹ ≈ 2,718", "5.2": "Beide gleich groß.",
 "6.0": "0,5 − 1", "6.1": "2·0,5 + 1·0,5 − 1", "6.2": "0 oder 1"
};

export const INF_EXAM: ExamTask[] = [
 { n: 1, title: "Grundlagen KI", p: 6, q: "a) Nennen Sie drei Arten des maschinellen Lernens und beschreiben Sie kurz, worin sie sich unterscheiden.<br>b) Eine Handy-App soll Gesichter auf Fotos erkennen. Es gibt 20 000 Fotos, bei denen schon angegeben ist, wer darauf ist. Welche Lernart ist geeignet? Begründen Sie.<br>c) Nennen Sie ein KI-Verfahren ohne maschinelles Lernen und beschreiben Sie kurz, wie es funktioniert.", s: "a) Überwacht: Daten mit Labels, Zuordnung lernen. Unüberwacht: keine Labels, Gruppen finden. Bestärkend: Belohnung und Strafe für Aktionen (je 1 P).<br>b) Überwacht, weil zu jedem Foto die richtige Antwort bekannt ist (2 P).<br>c) Minimax: Spielbaum, Endstellungen bewerten, abwechselnd Maximum und Minimum (1 P)." },
 { n: 2, title: "XOR und Separierbarkeit", p: 6, q: "a) Erklären Sie, warum ein einzelnes Perzeptron XOR nicht berechnen kann. Welches geometrische Problem liegt vor?<br>b) Wie wird das Problem gelöst? Welche Erweiterung der Architektur ist nötig?<br>c) Nehmen Sie Stellung: „Ein Perzeptron mit dem Biasgewicht 0 kann keine Daten mehr trennen.“", s: "a) Die Ausgaben 1 liegen bei (0|1) und (1|0) diagonal, keine Gerade trennt sie von (0|0) und (1|1): nicht linear separierbar (2 P).<br>b) Mehrschichtiges Netz mit verdeckter Schicht, das mehrere Trenngeraden kombiniert, z. B. ODER und UND (2 P).<br>c) Falsch. Mit w₀ = 0 geht die Trenngerade durch den Ursprung, Trennung ist also weiter möglich, nur eingeschränkt (2 P)." },
 { n: 3, title: "Perzeptron berechnen", p: 4, q: "Ein Perzeptron mit Heaviside-Funktion hat w₀ = −0,2, w₁ = 0,7, w₂ = −0,4. Eingaben: x₁ = 1, x₂ = 1,5. Berechnen Sie z und H(z).", s: "z = −0,2 + 0,7·1 + (−0,4)·1,5 = −0,2 + 0,7 − 0,6 = −0,1 (3 P). H(−0,1) = 0 (1 P)." },
 { n: 4, title: "Mehrschichtiges Perzeptron", p: 7, q: "Eingaben x₁ = 1, x₂ = 0,5. Verdeckte Schicht mit ReLU: Neuron 1 hat Bias 0,4 und Gewichte −0,5 (von x₁) und 0,6 (von x₂). Neuron 2 hat Bias −0,2 und Gewichte 0,8 und 0,3. Ausgabeneuron mit Sigmoid: Bias −0,3, Gewicht 0,5 von Neuron 1 und 0,4 von Neuron 2. Berechnen Sie schrittweise die Ausgabe.", s: "Neuron 1: z = 0,4 − 0,5 + 0,3 = 0,2, ReLU = 0,2 (2 P).<br>Neuron 2: z = −0,2 + 0,8 + 0,15 = 0,75, ReLU = 0,75 (2 P).<br>Ausgang: z = −0,3 + 0,5·0,2 + 0,4·0,75 = −0,3 + 0,1 + 0,3 = 0,1 (2 P). σ(0,1) = 1/(1 + e⁻⁰·¹) ≈ 0,525 (1 P)." },
 { n: 5, title: "Trenngerade", p: 4, q: "Ein Perzeptron klassifiziert Punkte (x | y) mit w₀ = −1, w₁ = 3, w₂ = 2. Bestimmen Sie die Trenngerade in der Form y = m·x + b und geben Sie an, in welche Klasse der Punkt (1 | 1) fällt.", s: "−1 + 3x + 2y = 0, also 2y = −3x + 1 und y = −1,5x + 0,5 (3 P). Punkt (1|1): z = −1 + 3 + 2 = 4 ≥ 0, Klasse 1 (1 P)." },
 { n: 6, title: "Softmax", p: 4, q: "Drei Ausgabeneuronen haben die Nettoinputs z₁ = 0,5, z₂ = 1,5 und z₃ = −1. Berechnen Sie die Softmax-Aktivierungen auf zwei Nachkommastellen. (e^0,5 ≈ 1,65; e^1,5 ≈ 4,48; e^−1 ≈ 0,37)", s: "Summe 1,65 + 4,48 + 0,37 = 6,50 (1 P). softmax(z₁) ≈ 0,25, softmax(z₂) ≈ 0,69, softmax(z₃) ≈ 0,06 (3 P). Probe: Summe 1." },
 { n: 7, title: "Lernregel", p: 4, q: "Ein Perzeptron mit Heaviside-Funktion hat w₀ = 0,1, w₁ = −0,5, w₂ = 0,3. Trainingsbeispiel: x₁ = 1, x₂ = 0, richtige Ausgabe y = 1. Lernrate α = 0,25. Führen Sie einen Lernschritt durch.", s: "z = 0,1 − 0,5 + 0 = −0,4, also ŷ = 0, e = 1 (1 P).<br>Δw₀ = 0,25, Δw₁ = 0,25·1·1 = 0,25, Δw₂ = 0,25·1·0 = 0 (2 P).<br>Neu: w₀ = 0,35, w₁ = −0,25, w₂ = 0,3 (1 P)." },
 { n: 8, title: "Pseudocode", p: 5, q: "a) Implementieren Sie vorhersageReLU(input1: FKZ, input2: FKZ, w0: FKZ, w1: FKZ, w2: FKZ): FKZ.<br>b) Implementieren Sie berechneNettoinput(inputs: Liste&lt;FKZ&gt;, gewichte: Liste&lt;FKZ&gt;, bias: FKZ): FKZ.", s: "a) z := w0 + w1 * input1 + w2 * input2; WENN z > 0 DANN RÜCKGABE z SONST RÜCKGABE 0 (2 P).<br>b) summe := 0; FÜR i := 0 BIS länge(inputs) − 1: summe := summe + inputs[i] * gewichte[i]; RÜCKGABE summe + bias (3 P)." }
];

export const INF_EXAM_TIPS: Record<string, string> = {
 1: "a) Pro Lernart: was in den Daten steht. b) Gibt es Labels? c) Spielbaum.",
 2: "a) Zeichne die vier Punkte. c) Was wird aus b = −w₀/w₂?",
 3: "Bias-Eingang 1 nicht vergessen. 0,4 · 1,5 = 0,6.",
 4: "Erst beide verdeckten Neuronen mit ReLU, dann den Ausgang mit Sigmoid.",
 5: "z = 0 setzen, nach y umstellen. Den Punkt in z einsetzen.",
 6: "Alle drei e-Werte addieren, dann jeden durch die Summe teilen.",
 7: "Erst ŷ mit den alten Gewichten. x₂ = 0 heißt Δw₂ = 0.",
 8: "Kopfzeile, Formel, Rückgabe. Bei b) eine Schleife über i."
};

export const INF_FORMULAS: FormulaGroup[] = [
 ["Perzeptron", [["Nettoinput", "z = w₁·x₁ + w₂·x₂ + … + wₙ·xₙ"], ["Mit Schwellwert", "y = 1, wenn z ≥ θ, sonst 0"], ["Mit Bias (x₀ = 1)", "z = w₀ + w₁·x₁ + … + wₙ·xₙ, y = H(z)"], ["Bias und Schwellwert", "w₀ = −θ"]]],
 ["Trenngerade", [["Grenze (z = 0)", "w₀ + w₁·x + w₂·y = 0"], ["Umgestellt", "y = −(w₁/w₂)·x − w₀/w₂"], ["Steigung", "m = −w₁/w₂"], ["Achsenabschnitt", "b = −w₀/w₂"]]],
 ["Aktivierungsfunktionen", [["Heaviside", "H(z) = 1 für z ≥ 0, sonst 0"], ["ReLU", "ReLU(z) = max(0, z)"], ["Sigmoid", "σ(z) = 1 / (1 + e⁻ᶻ)"], ["Softmax", "e^(z_k) / Σ e^(zᵢ)"]]],
 ["Lernregel", [["Fehler", "e = y − ŷ"], ["Gewichte", "Δwᵢ = α·(y − ŷ)·xᵢ"], ["Bias", "Δw₀ = α·(y − ŷ)"], ["Update", "wᵢ := wᵢ + Δwᵢ"]]],
 ["Mehrschichtiges Netz", [["Eingabe", "a⁽¹⁾ = x"], ["Rohinput", "z⁽ˡ⁾ = W⁽ˡ⁻¹⁾·a⁽ˡ⁻¹⁾ + b⁽ˡ⁻¹⁾"], ["Aktivierung", "a⁽ˡ⁾ = g(z⁽ˡ⁾)"], ["Ausgabe", "ŷ = a⁽ᴸ⁾"]]]
];

export const INF_SYMBOLS: [string, string][] = [["xᵢ", "Eingabe"], ["wᵢ", "Gewicht"], ["w₀, b", "Bias (Eingang immer 1)"], ["θ", "Schwellwert"], ["z", "Nettoinput, Rohinput"], ["a", "Aktivierung (Ausgabe eines Neurons)"], ["ŷ", "Ausgabe des Netzes"], ["y", "richtige Antwort (Label)"], ["α", "Lernrate"], ["Epoche", "ein Durchgang durch alle Trainingsdaten"], ["FKZ, GZ", "Fließkommazahl, Ganzzahl"]];

export const INF_KILLERS: string[] = ["H(0) = 1, nicht 0", "Bias vergessen oder nicht mit 1 multipliziert", "Minus bei m = −w₁/w₂ oder b = −w₀/w₂ vergessen", "ReLU einer negativen Zahl ist 0", "Softmax durch die Summe der z-Werte statt der e-Werte geteilt", "In der Lernregel ŷ − y statt y − ŷ", "Lernart genannt, aber nicht begründet", "Im Pseudocode > statt >= bei Heaviside"];
