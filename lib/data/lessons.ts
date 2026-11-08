import { M } from "./markup";
import type { Lesson } from "../types";

function svgSine() {
  let d = "";
  for (let x = 0; x <= 300; x += 3) d += (x ? "L" : "M") + (30 + x) + " " + (75 - 50 * Math.sin(x / 250 * Math.PI * 2)).toFixed(1);
  return '<svg class="lfig" viewBox="0 0 360 160" role="img" aria-label="Sinuskurve mit Amplitude und Periodendauer"><line class="la" x1="30" y1="75" x2="345" y2="75"/><line class="la" x1="30" y1="12" x2="30" y2="140"/><text x="348" y="79">t</text><text x="18" y="18">s</text><path class="lc" d="' + d + '"/><line class="lh" x1="92.5" y1="75" x2="92.5" y2="25"/><text class="lt" x="98" y="56">s<tspan dy="3" font-size="9">max</tspan></text><text x="62" y="16">Umkehrpunkt: v = 0</text><text x="160" y="66">Ruhelage: v maximal</text><line class="lh" x1="30" y1="148" x2="280" y2="148"/><line class="lh" x1="30" y1="143" x2="30" y2="153"/><line class="lh" x1="280" y1="143" x2="280" y2="153"/><text class="lt" x="148" y="143">T</text></svg>';
}

function svgCircle() {
  return '<svg class="lfig lfig-s" viewBox="0 0 220 200" role="img" aria-label="Einheitskreis: sin α ist die Höhe, cos α die Breite"><circle class="la" cx="100" cy="100" r="70" fill="none"/><line class="la" x1="15" y1="100" x2="190" y2="100"/><line class="la" x1="100" y1="15" x2="100" y2="185"/><line class="lc" x1="100" y1="100" x2="145" y2="46.4"/><line class="lg" x1="145" y1="46.4" x2="145" y2="100"/><line class="lb" x1="100" y1="100" x2="145" y2="100"/><circle class="ld" cx="145" cy="46.4" r="4"/><path class="lh" fill="none" d="M120 100 A20 20 0 0 0 112.9 84.7"/><text x="124" y="94">α</text><text x="108" y="66">1</text><text class="lgt" x="170" y="72">sin α</text><text class="lbt" x="104" y="116">cos α</text></svg>';
}

function svgPendulum() {
  const arrow = (x1, y1, x2, y2, cls) => { const a = Math.atan2(y2 - y1, x2 - x1), s = 7; return '<line class="' + cls + '" x1="' + x1 + '" y1="' + y1 + '" x2="' + x2 + '" y2="' + y2 + '"/><path class="' + cls + '" fill="none" d="M' + (x2 - s * Math.cos(a - 0.5)).toFixed(1) + ' ' + (y2 - s * Math.sin(a - 0.5)).toFixed(1) + 'L' + x2 + ' ' + y2 + 'L' + (x2 - s * Math.cos(a + 0.5)).toFixed(1) + ' ' + (y2 - s * Math.sin(a + 0.5)).toFixed(1) + '"/>'; };
  return '<svg class="lfig" viewBox="0 0 300 215" role="img" aria-label="Fadenpendel mit Zerlegung der Gewichtskraft"><line class="la" x1="85" y1="15" x2="175" y2="15"/><line class="lh" stroke-dasharray="4 4" x1="130" y1="15" x2="130" y2="150"/><line class="la" x1="130" y1="15" x2="184.9" y2="132.8"/><circle class="ld" cx="184.9" cy="132.8" r="6"/>' + arrow(184.9, 132.8, 184.9, 192.8, "lb") + arrow(184.9, 132.8, 161.9, 143.5, "lg") + '<text x="136" y="50">φ</text><text x="166" y="72">l</text><text class="lbt" x="192" y="185">F<tspan dy="3" font-size="9">G</tspan><tspan dy="-3"> = m·g</tspan></text><text class="lgt" x="20" y="162">zieht zurück:</text><text class="lgt" x="20" y="178">m·g·sin φ</text></svg>';
}

const LF = x => '<div class="lf">' + x + '</div>';

const LX = (x) => '<div class="lx"><b>Beispiel</b>' + x + '</div>';

const LK = (x) => '<div class="lk"><b>Merke</b>' + x + '</div>';

export const LESSONS: Record<number, Lesson[]> = {
 1: [
  { t: "Einheiten und Zehnerpotenzen", g: "Einheiten und Zehnerpotenzen", h:
   "<p>Physik-Formeln funktionieren nur mit den Grundeinheiten: <b>kg, m, s</b>. Wer cm oder g einsetzt, bekommt falsche Ergebnisse, auch wenn die Formel stimmt. Rechne deshalb immer zuerst um.</p>" +
   '<div class="lw"><table class="lta"><tr><th>Vorsilbe</th><th>bedeutet</th><th>Beispiel</th></tr><tr><td>k (kilo)</td><td>· 10³ (mal 1000)</td><td>2 kJ = 2000 J</td></tr><tr><td>c (zenti)</td><td>· 10⁻² (durch 100)</td><td>8 cm = 0,08 m</td></tr><tr><td>m (milli)</td><td>· 10⁻³ (durch 1000)</td><td>40 ms = 0,04 s</td></tr><tr><td>µ (mikro)</td><td>· 10⁻⁶</td><td>30 µF = 3 · 10⁻⁵ F</td></tr><tr><td>n (nano)</td><td>· 10⁻⁹</td><td>5 nF = 5 · 10⁻⁹ F</td></tr></table></div>' +
   "<p><b>Die Masse ist der Sonderfall:</b> Die Grundeinheit ist kg, also rechnest du Gramm durch 1000: 720 g = 0,72 kg.</p>" +
   "<p><b>Zehnerpotenzen:</b> Der Exponent sagt, um wie viele Stellen das Komma wandert. Negativ heißt nach links, positiv nach rechts. So ist 3,5 · 10⁻² = 0,035. Beim Malnehmen addierst du die Exponenten: 10² · 10⁻⁵ = 10⁻³.</p>" +
   "<p><b>Geschwindigkeit:</b> Von km/h nach m/s teilst du durch 3,6, also 36 km/h = 10 m/s.</p>" +
   LK("Vor jeder Rechnung: Sind alle Werte in kg, m, s, F, H?") },
  { t: "Formeln umstellen", g: "Formeln umstellen", h:
   "<p>Eine Formel ist wie eine Waage: Was du auf einer Seite machst, machst du auch auf der anderen. Ziel ist, dass die gesuchte Größe allein steht.</p>" +
   "<p>Geh dabei <b>von außen nach innen</b> vor und mach alles mit der Gegenrechnung rückgängig: Mal wird zu geteilt, Plus zu Minus, Wurzel zu Quadrat und Quadrat zu Wurzel.</p>" +
   LX("<p>Stelle " + M("T = 2π·√(m/D)") + " nach m um:</p><ol><li>Das 2π steht außen, also durch 2π teilen: " + M("T/(2π) = √(m/D)") + "</li><li>Wurzel loswerden, also quadrieren: " + M("T²/(4π²) = m/D") + "</li><li>Das D stört noch, also mal D: " + M("m = D·T²/(4π²)") + "</li></ol><p>Mit T = 2 s und D = 10 N/m: m = 10 · 4 / 39,48 ≈ 1,01 kg.</p>") +
   "<p><b>Steht die Gesuchte im Nenner</b>, wie D bei " + M("T²/(4π²) = m/D") + ", nimmst du erst mal D und teilst dann durch den Rest: " + M("D = 4π²·m/T²") + ".</p>" +
   LK("Probe mit gesundem Verstand: Mehr Masse macht das Pendel langsamer. In der Formel muss T also größer werden, wenn m größer wird.") },
  { t: "Taschenrechner richtig benutzen", g: "Taschenrechner", h:
   "<p>Drei Dinge verhindern hier die meisten Fehler:</p><ol><li><b>Modus:</b> Für sin(ω·t) und cos(ω·t) muss der Rechner auf <b>RAD</b> stehen. Teste es: sin(π/2) muss 1 ergeben.</li><li><b>Klammern:</b> Alles unter einer Wurzel oder in einem Nenner gehört zusammen. Tippe also 1 / (2π·√(…)) mit Klammern.</li><li><b>Zehnerpotenzen:</b> 3 · 10⁻⁶ tippst du als 3, EXP (oder ×10ˣ), −6.</li></ol>" +
   LX("<p>" + M("2π·√(2/50)") + ": Erst 2/50 = 0,04, Wurzel = 0,2, mal 2π ≈ 1,257.</p>") +
   LK("Wenn etwas komisch aussieht, rechne Schritt für Schritt von innen nach außen nach.") },
  { t: "Kräfte: F = m·a, Gewichtskraft, Hooke", g: "Kraft: F = m·g, F = m·a, Hooke", h:
   "<p>Eine Kraft ändert die Bewegung eines Körpers oder verformt ihn. Ihre Einheit ist Newton: 1 N = 1 kg·m/s². Du brauchst drei Formeln (Formelbuch S. 17):</p>" +
   '<div class="lw"><table class="lta"><tr><th>Formel</th><th>Was sie sagt</th><th>Beispiel</th></tr><tr><td class="m">F = m·a</td><td>Kraft beschleunigt eine Masse</td><td>4 kg, 2 m/s² → 8 N</td></tr><tr><td class="m">F<sub>G</sub> = m·g</td><td>Die Erde zieht an jeder Masse, g = 9,81 m/s²</td><td>3 kg → 29,43 N</td></tr><tr><td class="m">F<sub>S</sub> = D·s</td><td>Je weiter gedehnt, desto stärker zieht die Feder</td><td>100 N/m, 5 cm → 5 N</td></tr></table></div>' +
   "<p><b>D ist die Federhärte.</b> D = 100 N/m heißt: Für 1 m Dehnung bräuchte man 100 N. Großes D bedeutet eine harte Feder.</p>" +
   "<p><b>Kräftegleichgewicht:</b> Hängt ein Körper ruhig an einer Feder, heben sich beide Kräfte auf. Daraus folgt " + M("m·g = D·s") + ". Mit dieser Gleichung bestimmst du D aus der Dehnung.</p>" +
   LK("Die Dehnung s immer in Metern einsetzen, die Masse immer in kg.") }
 ],
 2: [
  { t: "Bogenmaß: Winkel ohne Grad", g: "Bogenmaß", h:
   "<p>Statt in Grad kann man einen Winkel als <b>Länge des Bogens</b> auf einem Kreis mit Radius 1 angeben. Der ganze Kreisumfang ist 2π, also sind 360° = 2π. Die Einheit heißt rad.</p>" +
   '<div class="lw"><table class="lta"><tr><th>Grad</th><td>30°</td><td>45°</td><td>60°</td><td>90°</td><td>180°</td><td>360°</td></tr><tr><th>Bogenmaß</th><td>π/6</td><td>π/4</td><td>π/3</td><td>π/2</td><td>π</td><td>2π</td></tr><tr><th>als Zahl</th><td>0,52</td><td>0,79</td><td>1,05</td><td>1,57</td><td>3,14</td><td>6,28</td></tr></table></div>' +
   LF("x = α · π/180°  &nbsp;&nbsp;und&nbsp;&nbsp;  α = x · 180°/π") +
   LX("<p>150° = 150 · π/180 ≈ 2,62 rad. Umgekehrt: 2 rad = 2 · 180°/π ≈ 114,6°.</p>") +
   LK("Bei Schwingungen ist ω·t ein Winkel im Bogenmaß. Deshalb gehört der Rechner auf RAD.") },
  { t: "Sinus und Kosinus", g: "Sinus und Kosinus", h:
   "<p><b>Im rechtwinkligen Dreieck:</b></p>" + LF("sin α = Gegenkathete / Hypotenuse<br>cos α = Ankathete / Hypotenuse") +
   LX("<p>Hypotenuse 20 cm, α = 30°: Gegenkathete = 20 · sin 30° = 20 · 0,5 = 10 cm.</p>") +
   "<p><b>Am Einheitskreis</b> wird es anschaulich. Ein Punkt läuft auf einem Kreis mit Radius 1. <b>sin α ist seine Höhe, cos α seine Breite</b>:</p>" + svgCircle() +
   '<div class="lw"><table class="lta"><tr><th>α</th><td>0</td><td>π/2</td><td>π</td><td>3π/2</td><td>2π</td></tr><tr><th>sin α</th><td>0</td><td>1</td><td>0</td><td>−1</td><td>0</td></tr><tr><th>cos α</th><td>1</td><td>0</td><td>−1</td><td>0</td><td>1</td></tr></table></div>' +
   "<p>Stell dir den Punkt beim Laufen vor: Bei π/2 ist er ganz oben, also sin = 1. Bei π ist er ganz links, also cos = −1. Die Tabelle musst du nicht auswendig lernen.</p>" +
   "<p>Nach Pythagoras gilt außerdem " + M("sin²α + cos²α = 1") + ".</p>" },
  { t: "Sinus-Graphen lesen", g: "Graphen lesen", h:
   "<p>Läuft der Punkt immer weiter im Kreis und du zeichnest seine Höhe über der Zeit, entsteht die Sinuskurve. Sie wiederholt sich immer wieder.</p>" + svgSine() +
   LF("y = a · sin(b · x)") +
   "<ul><li><b>a</b> vor dem sin ist die <b>Amplitude</b>: wie hoch die Kurve ausschlägt.</li><li><b>b</b> im sin bestimmt die <b>Periode</b>: 2π/b. Größeres b heißt: Die Kurve wird zusammengedrückt.</li></ul>" +
   LX("<p>y = 4·sin(2x): Amplitude 4, Periode 2π/2 = π.</p>") +
   "<p><b>sin</b> startet bei x = 0 auf der Mittellinie und hat Nullstellen bei 0, π, 2π. <b>cos</b> ist dieselbe Kurve, startet aber oben.</p>" +
   "<p>Bei Schwingungen ist es genau das Gleiche, nur mit anderen Buchstaben: In " + M("s(t) = s<sub>max</sub>·sin(ω·t)") + " ist s<sub>max</sub> die Amplitude und " + M("T = 2π/ω") + " die Periode.</p>" },
  { t: "Kreisbewegung: T, f und ω", g: "Kreisbewegung: f, T, ω", h:
   "<p>Drei Größen beschreiben, wie schnell sich etwas wiederholt. Sie sagen alle dasselbe, nur anders:</p>" +
   '<ul><li><b>T, Periodendauer:</b> Sekunden für eine Runde.</li><li><b>f, Frequenz:</b> Runden pro Sekunde, Einheit Hz. ' + M("f = 1/T = n/t") + ', dabei ist n die Anzahl der Runden in der Zeit t.</li><li><b>ω, Kreisfrequenz:</b> Winkel pro Sekunde, Einheit 1/s. ' + M("ω = Δφ/Δt = 2π/T = 2π·f") + '.</li></ul>' +
   LX("<p>10 Umdrehungen in 5 s: f = 10/5 = 2 Hz. T = 1/2 = 0,5 s. ω = 2π · 2 ≈ 12,57 s⁻¹.</p><p>Die Bahngeschwindigkeit eines Punkts mit r = 0,5 m ist " + M("v = ω·r") + " ≈ 6,28 m/s.</p>") +
   LK("Eine Größe gegeben heißt: Du kennst alle drei. Beachte den Faktor 2π zwischen ω und f.") }
 ],
 3: [
  { t: "Was ist eine Schwingung?", g: "Begriffe", h:
   "<p>Eine Schwingung ist eine Bewegung, die sich regelmäßig um eine <b>Ruhelage</b> wiederholt, zum Beispiel ein Gewicht an einer Feder.</p>" +
   "<p><b>Warum hört es nicht einfach in der Mitte auf?</b> Dafür braucht es zwei Dinge:</p><ol><li><b>Rücktreibende Kraft:</b> Zieht man das Gewicht weg, zieht die Feder es zurück zur Ruhelage.</li><li><b>Trägheit:</b> In der Ruhelage ist das Gewicht gerade am schnellsten und saust darüber hinaus. Dann bremst die Feder es ab und zieht es wieder zurück.</li></ol>" + svgSine() +
   '<div class="lw"><table class="lta"><tr><th>Größe</th><th>Bedeutung</th></tr><tr><td class="m">s(t)</td><td>Auslenkung (Elongation): wie weit der Körper jetzt gerade von der Ruhelage weg ist</td></tr><tr><td class="m">s<sub>max</sub></td><td>Amplitude: die größte Auslenkung</td></tr><tr><td class="m">T</td><td>Periodendauer: Zeit für einmal hin und zurück</td></tr><tr><td class="m">f</td><td>Frequenz: Schwingungen pro Sekunde</td></tr><tr><td class="m">φ₀</td><td>Nullphasenwinkel: verschiebt den Startpunkt, oft ist φ₀ = 0</td></tr></table></div>' +
   "<p><b>Harmonisch</b> heißt eine Schwingung, wenn sie genau wie eine Sinuskurve verläuft. Das passiert, wenn " + M("F = −D·s") + " gilt: Die Kraft ist proportional zur Auslenkung, und das Minus zeigt, dass sie immer zurück zur Ruhelage wirkt.</p>" },
  { t: "Warum steht da ein Sinus?", h:
   "<p>Stell dir eine Scheibe vor, auf der ein Korken sitzt, und daneben ein Federpendel. Dreht sich die Scheibe und du schaust von der Seite, bewegt sich der Schatten des Korkens exakt wie die Kugel an der Feder.</p>" +
   "<p>Eine Schwingung ist also eine <b>Kreisbewegung von der Seite gesehen</b>. Die Höhe eines Punkts auf dem Kreis ist:</p>" + LF("s = r · sin α") +
   "<p>Der Radius r entspricht der Amplitude s<sub>max</sub>. Der Winkel wächst gleichmäßig mit der Zeit: α = ω·t. Zusammen ergibt das:</p>" + LF("s(t) = s<sub>max</sub> · sin(ω·t)") +
   "<p>Darum heißt ω auch bei Schwingungen Kreisfrequenz, obwohl sich gar nichts dreht.</p>" },
  { t: "Ableiten: von s zu v und a", g: "Ableiten", h:
   "<p>Die Ableitung sagt, <b>wie schnell sich etwas ändert</b>. Ändert sich der Ort, ist das die Geschwindigkeit. Ändert sich die Geschwindigkeit, ist das die Beschleunigung. Die Punkte bedeuten „nach der Zeit abgeleitet“:</p>" +
   LF("v = ṡ &nbsp;&nbsp;&nbsp; a = v̇ = s̈") +
   "<p>Du brauchst nur zwei Regeln:</p><ul><li>(sin x)' = cos x und (cos x)' = −sin x</li><li><b>Kettenregel:</b> Steht im sin noch etwas, kommt dessen Ableitung als Faktor nach vorne. Die Ableitung von ω·t ist ω.</li></ul>" +
   LX("<p>s = 3·sin(2t)</p><p>Erste Ableitung: ṡ = 3 · 2 · cos(2t) = 6·cos(2t)</p><p>Zweite Ableitung: s̈ = −6 · 2 · sin(2t) = −12·sin(2t)</p>") +
   LK("Jede Ableitung bringt einen Faktor ω. Reihenfolge: sin → cos → −sin.") },
  { t: "s, v und a berechnen", g: "s, v und a berechnen", h:
   "<p>Aus dem Ableiten entstehen die drei Bewegungsgleichungen (Formelbuch S. 24):</p>" +
   LF("s(t) = s<sub>max</sub>·sin(ω·t)<br>v(t) = s<sub>max</sub>·ω·cos(ω·t)<br>a(t) = −s<sub>max</sub>·ω²·sin(ω·t)") +
   "<p>Weil sin und cos höchstens 1 werden, kannst du die Größtwerte direkt ablesen:</p>" + LF("v<sub>max</sub> = s<sub>max</sub>·ω &nbsp;&nbsp;&nbsp; a<sub>max</sub> = s<sub>max</sub>·ω²") +
   '<div class="lw"><table class="lta"><tr><th>Ort</th><th>s</th><th>v</th><th>a</th></tr><tr><td>Umkehrpunkt</td><td>maximal</td><td>0 (steht kurz still)</td><td>maximal</td></tr><tr><td>Ruhelage</td><td>0</td><td>maximal</td><td>0 (keine Kraft)</td></tr></table></div>' +
   LX("<p>s(t) = 0,02 m · sin(10 s⁻¹ · t). Du liest ab: s<sub>max</sub> = 0,02 m und ω = 10 s⁻¹.</p><ul><li>f = ω/(2π) ≈ 1,59 Hz, T = 2π/ω ≈ 0,628 s</li><li>v<sub>max</sub> = 0,02 · 10 = 0,2 m/s</li><li>a<sub>max</sub> = 0,02 · 100 = 2 m/s²</li><li>s(0,1 s) = 0,02 · sin(1) ≈ 0,0168 m (RAD!)</li></ul>") +
   LK("Wegen a = −ω²·s zeigt die Beschleunigung immer entgegen der Auslenkung, also zurück zur Ruhelage.") }
 ],
 4: [
  { t: "Die DGL aufstellen", g: "Die DGL", h:
   "<p>Eine normale Gleichung sucht eine Zahl. Eine <b>Differentialgleichung (DGL)</b> sucht eine Funktion, hier die Bewegung s(t). In ihr kommen die Funktion und ihre Ableitungen zusammen vor.</p>" +
   "<p>Du stellst sie immer mit denselben drei Schritten auf:</p><ol><li><b>Hooke:</b> Die Feder zieht zurück: " + M("F = −D·s") + ". Das Minus heißt: Die Kraft wirkt gegen die Auslenkung.</li><li><b>Newton:</b> Eine Kraft beschleunigt die Masse: " + M("F = m·a") + ".</li><li><b>a = s̈:</b> Die Beschleunigung ist die zweite Ableitung des Orts.</li></ol>" +
   "<p>Beides gleichsetzen, alles auf eine Seite bringen und durch m teilen:</p>" + LF("m·s̈ = −D·s &nbsp;→&nbsp; s̈ + (D/m)·s = 0") +
   "<p>Die Formel steht im Formelbuch auf S. 24. Bei „Leite her“ gibt es die Punkte aber für diese Schritte mit ihren Begründungen.</p>" +
   LK("Aus einer DGL liest du ω direkt ab, denn die Zahl vor dem s ist ω². Bei s̈ + 49·s = 0 ist ω = 7 s⁻¹.") },
  { t: "Die DGL lösen", g: "Die DGL", h:
   "<p>Gesucht ist eine Funktion, die zweimal abgeleitet wieder sich selbst ergibt, nur mit einem Minus davor. Das können sin und cos. Man nimmt deshalb einen <b>Ansatz</b> und prüft, ob er passt.</p>" +
   "<ol><li><b>Ansatz:</b> " + M("s = s<sub>max</sub>·sin(ω·t)") + "</li><li><b>Zweimal ableiten:</b> " + M("s̈ = −s<sub>max</sub>·ω²·sin(ω·t)") + "</li><li><b>In die DGL einsetzen:</b> " + M("−s<sub>max</sub>·ω²·sin(ω·t) + (D/m)·s<sub>max</sub>·sin(ω·t) = 0") + "</li><li><b>Ausklammern:</b> " + M("s<sub>max</sub>·sin(ω·t)·(D/m − ω²) = 0") + "</li><li><b>Nullprodukt:</b> Das muss zu jeder Zeit gelten, also muss die Klammer null sein: " + M("ω² = D/m") + "</li></ol>" +
   "<p>Damit ist gezeigt, dass der Ansatz die DGL löst, und du bekommst nebenbei das Ergebnis:</p>" + LF("ω = √(D/m) &nbsp;&nbsp;&nbsp; T = 2π/ω = 2π·√(m/D)") +
   LK("Mit dem Kosinus-Ansatz läuft es genauso. Nur steht dann überall cos statt sin.") },
  { t: "Federpendel rechnen", g: "Federpendel rechnen", h:
   LF("T = 2π·√(m/D) &nbsp;&nbsp;&nbsp; ω = √(D/m) &nbsp;&nbsp;&nbsp; f = 1/T") +
   LX("<p>m = 2 kg, D = 50 N/m: ω = √25 = 5 s⁻¹, T = 2π/5 ≈ 1,26 s, f ≈ 0,80 Hz.</p>") +
   "<p><b>„Was passiert, wenn …“-Fragen</b> beantwortest du ohne Rechnen:</p>" +
   '<div class="lw"><table class="lta"><tr><th>Änderung</th><th>Folge für T</th><th>Warum</th></tr><tr><td>m vervierfacht</td><td>T verdoppelt</td><td>m steht in der Wurzel oben, √4 = 2</td></tr><tr><td>D vervierfacht</td><td>T halbiert</td><td>D steht in der Wurzel unten</td></tr><tr><td>Amplitude verdoppelt</td><td>T bleibt gleich</td><td>s<sub>max</sub> kommt in der Formel nicht vor</td></tr></table></div>' +
   "<p>Ist T gegeben und m oder D gesucht, stellst du um, wie an Tag 1 gezeigt.</p>" }
 ],
 5: [
  { t: "Senkrechtes Federpendel", g: "Senkrechtes Federpendel", h:
   "<p>Hängt die Feder senkrecht, zieht zusätzlich die Schwerkraft. Ändert das die Schwingung? Überraschenderweise nicht.</p>" +
   "<p>Die Masse dehnt die Feder zuerst um " + M("s₀") + ", dort entsteht die <b>neue Ruhelage</b>. Dort gilt Kräftegleichgewicht:</p>" + LF("m·g = D·s₀") +
   "<p>Schwingt der Körper um diese neue Ruhelage, wirken " + M("m·g") + " nach unten und " + M("D·(s + s₀)") + " nach oben. Setzt du das zusammen, kürzt sich " + M("m·g") + " mit " + M("D·s₀") + " weg, und übrig bleibt wieder " + M("F = −D·s") + ".</p>" +
   LK("Die Schwerkraft verschiebt nur die Ruhelage. T = 2π·√(m/D) bleibt gleich, auch auf dem Mond.") +
   LX("<p>300 g dehnen eine Feder um 3 cm:</p><ul><li>D = m·g/s₀ = 0,3 · 9,81 / 0,03 = 98,1 N/m</li><li>T = 2π·√(0,3/98,1) ≈ 0,35 s</li></ul><p>Abkürzung: Aus D = m·g/s₀ folgt " + M("T = 2π·√(s₀/g)") + ". Die Masse brauchst du dafür gar nicht.</p>") },
  { t: "Energie bei Schwingungen", g: "Energie", h:
   "<p>Bei einer Schwingung geht keine Energie verloren, ohne Reibung wechselt sie nur die Form (Formelbuch S. 21–22):</p>" +
   '<div class="lw"><table class="lta"><tr><th>Energieform</th><th>Formel</th><th>Steckt in …</th></tr><tr><td>Bewegungsenergie</td><td class="m">E = ½·m·v²</td><td>der Bewegung</td></tr><tr><td>Spannenergie</td><td class="m">E = ½·D·s²</td><td>der gedehnten Feder</td></tr><tr><td>Lageenergie</td><td class="m">E = m·g·h</td><td>der Höhe</td></tr></table></div>' +
   "<p>Beim Federpendel pendelt die Energie hin und her:</p><ul><li><b>Umkehrpunkt:</b> v = 0, die ganze Energie steckt in der Feder.</li><li><b>Ruhelage:</b> Feder entspannt, die ganze Energie ist Bewegung.</li></ul>" +
   "<p>Darum darfst du die Größtwerte gleichsetzen:</p>" + LF("E = ½·D·s<sub>max</sub>² = ½·m·v<sub>max</sub>²") +
   LX("<p>D = 50 N/m, s<sub>max</sub> = 0,2 m, m = 2 kg:</p><ul><li>E = ½ · 50 · 0,04 = 1 J</li><li>½ · 2 · v<sub>max</sub>² = 1 J, also v<sub>max</sub> = 1 m/s</li></ul>") +
   "<p><b>Zwischendrin</b> ist beides gleichzeitig da: " + M("E = ½·D·s² + ½·m·v²") + ". Bei halber Auslenkung ist die Spannenergie wegen des Quadrats nur noch ¼ der Gesamtenergie, der Rest ist Bewegungsenergie.</p>" +
   "<p><b>Beim Fallen</b> gilt ebenso " + M("m·g·h = ½·m·v²") + ". Die Masse kürzt sich, also " + M("v = √(2·g·h)") + ". Aus 3,2 m Höhe sind das etwa 7,9 m/s.</p>" +
   LK("Mit Reibung nimmt die Gesamtenergie ab, sie wird zu Wärme. Deshalb wird eine echte Schwingung immer kleiner.") }
 ],
 6: [
  { t: "Fadenpendel rechnen", g: "Fadenpendel rechnen", h:
   "<p>Beim Fadenpendel zieht die Schwerkraft die Kugel zurück. Du zerlegst die Gewichtskraft in zwei Teile. Der Teil entlang des Fadens spannt nur den Faden. Der Teil quer dazu zieht die Kugel zurück:</p>" + svgPendulum() +
   LF("F = −m·g·sin φ") +
   "<p>Für kleine Winkel gilt " + M("sin φ ≈ φ") + ", und φ ist im Bogenmaß " + M("s/l") + ". Damit wird die Kraft zu:</p>" + LF("F = −(m·g/l)·s") +
   "<p>Das sieht aus wie " + M("F = −D·s") + " mit " + M("D = m·g/l") + ". Setzt du das in die Formel vom Federpendel ein, kürzt sich die Masse:</p>" + LF("T = 2π·√(l/g)") +
   LX("<p>l = 2 m: T = 2π·√(2/9,81) ≈ 2,84 s.</p><p>Pendel gesucht, das 15-mal in 30 s schwingt: f = n/t = 0,5 Hz, also T = 2 s, also l = g·T²/(4π²) ≈ 0,99 m.</p>") +
   LK("T hängt nicht von der Masse ab, nur von der Länge und von g. Vierfache Länge heißt doppeltes T.") },
  { t: "Pendeluhr im Aufzug", g: "Pendeluhr im Aufzug", h:
   "<p>In einem beschleunigten Aufzug fühlt sich die Schwerkraft anders an. Beschleunigt er nach oben, wirst du schwerer. Beschleunigt er nach unten, wirst du leichter. Für das Pendel zählt dieses <b>effektive g</b>:</p>" + LF("T = 2π·√(l/g<sub>eff</sub>)") +
   '<div class="lw"><table class="lta"><tr><th>Aufzug</th><th>g<sub>eff</sub></th><th>T</th><th>Uhr</th></tr><tr><td>beschleunigt nach oben</td><td class="m">g + a</td><td>kleiner</td><td>geht vor</td></tr><tr><td>beschleunigt nach unten</td><td class="m">g − a</td><td>größer</td><td>geht nach</td></tr><tr><td>konstante Geschwindigkeit</td><td class="m">g</td><td>gleich</td><td>geht richtig</td></tr><tr><td>freier Fall</td><td class="m">0</td><td>–</td><td>Pendel schwingt nicht</td></tr></table></div>' +
   LX("<p>l = 1 m, Aufzug beschleunigt mit 1,19 m/s² nach oben: g<sub>eff</sub> = 11 m/s², T = 2π·√(1/11) ≈ 1,89 s. Das ist weniger als die normalen 2,01 s.</p>") +
   LK("Es zählt nur die Beschleunigung, nicht die Fahrtrichtung. Bei konstantem Tempo ändert sich nichts.") },
  { t: "Warum nur für kleine Winkel?", g: "Verständnis", h:
   "<p>Harmonisch ist eine Schwingung nur, wenn die Kraft proportional zur Auslenkung ist. Beim Fadenpendel steht aber ein Sinus in der Kraft, und ein Sinus ist nicht proportional.</p>" +
   "<p>Für kleine Winkel sind sin φ und φ im Bogenmaß aber fast gleich:</p>" +
   '<div class="lw"><table class="lta"><tr><th>Winkel</th><th>φ in rad</th><th>sin φ</th></tr><tr><td>10°</td><td>0,1745</td><td>0,1736 (fast gleich)</td></tr><tr><td>45°</td><td>0,7854</td><td>0,7071 (deutlich anders)</td></tr></table></div>' +
   "<p>Bis etwa 10° passt die Näherung also gut. Deshalb steht im Formelbuch beim Fadenpendel auch „in Kleinwinkelnäherung“.</p>" +
   LF("s̈ + (g/l)·s = 0") +
   "<p>So sieht die DGL mit Näherung aus. Sie hat dieselbe Form wie beim Federpendel, und du liest ab: " + M("ω = √(g/l)") + ".</p>" }
 ],
 7: [
  { t: "Das Meta-Rezept", g: "Meta-Rezept", h:
   "<p>Mit diesem Rezept bekommst du die Periodendauer von fast jedem Pendel, auch wenn du es noch nie gesehen hast:</p>" +
   "<ol><li>Auslenkung s einführen.</li><li>Rücktreibende Kraft aufschreiben, in der Form " + M("F = −(etwas)·s") + ".</li><li>Das „etwas“ ist D.</li><li>Bewegte Masse m bestimmen.</li><li>Einsetzen: " + M("T = 2π·√(m/D)") + ".</li></ol>" +
   LX("<p><b>Direkt gegeben:</b> F = −20 N/m · s und m = 0,8 kg. Also D = 20 N/m und T = 2π·√(0,8/20) ≈ 1,26 s.</p><p><b>Fadenpendel:</b> F = −(m·g/l)·s, also D = m·g/l. Einsetzen ergibt T = 2π·√(l/g).</p><p><b>Holzklotz im Wasser:</b> Taucht er um s tiefer ein, kommt die Auftriebskraft " + M("F<sub>A</sub> = ρ·g·V") + " mit V = A·s dazu. Also F = −(ρ·g·A)·s und D = ρ·g·A.</p>") +
   LK("Findest du die Form F = −(etwas)·s, ist die Schwingung automatisch harmonisch.") },
  { t: "Bungee-Sprung", g: "Bungee", h:
   "<p>Ein Bungee-Sprung läuft in zwei Teilen ab. Erst fällt der Springer frei, bis das Seil gespannt ist. Dann wirkt das Seil wie eine Feder.</p>" +
   "<p><b>Der Energiesatz vom Absprung bis zum tiefsten Punkt</b> ist der Schlüssel, denn an beiden Stellen ist v = 0:</p>" + LF("m·g·h = ½·D·s²") +
   "<p>Achtung, das sind zwei verschiedene Strecken: <b>h ist die ganze Fallhöhe</b>, <b>s nur die Dehnung des Seils</b>, also h minus Seillänge.</p>" +
   LX("<p>60 kg, Seil 10 m, tiefster Punkt 30 m unter dem Absprung, also h = 30 m und s = 20 m:</p><ul><li>D = 2·m·g·h/s² = 2 · 60 · 9,81 · 30 / 400 ≈ 88,3 N/m</li><li>Ruhelage: s₀ = m·g/D ≈ 6,67 m Dehnung, also etwa 16,67 m unter dem Absprung</li><li>Nachwippen: T = 2π·√(60/88,3) ≈ 5,18 s</li></ul>") +
   "<p><b>Ist D gegeben und die Tiefe gesucht,</b> setzt du h = Seillänge + s ein. Das ergibt eine quadratische Gleichung für s, die du mit der Mitternachtsformel löst. Zur Lösung addierst du am Ende die Seillänge.</p>" }
 ],
 8: [
  { t: "Kondensator und Spule", h:
   "<p>Ein Schwingkreis besteht aus zwei Bauteilen, die Energie speichern:</p>" +
   '<div class="lw"><table class="lta"><tr><th></th><th>Kondensator</th><th>Spule</th></tr><tr><th>Speichert</th><td>Ladung Q, im elektrischen Feld</td><td>Energie im Magnetfeld, solange Strom fließt</td></tr><tr><th>Kenngröße</th><td>Kapazität C in Farad</td><td>Induktivität L in Henry</td></tr><tr><th>Formeln</th><td class="m">Q = C·U, E = ½·C·U²</td><td class="m">E = ½·L·I²</td></tr></table></div>' +
   "<p><b>Lenzsche Regel:</b> Eine Spule wehrt sich gegen jede Änderung des Stroms. Will der Strom schwächer werden, erzeugt sie selbst eine Spannung und hält ihn am Laufen. Sie ist damit „träge“, genau wie eine Masse.</p>" +
   LK("µF und mH vor dem Rechnen in F und H umrechnen.") },
  { t: "Die 4 Phasen im Schwingkreis", g: "Verständnis", h:
   "<p>Die Energie wandert zwischen Kondensator und Spule hin und her, genau wie beim Federpendel zwischen Feder und Bewegung:</p>" +
   '<div class="lw"><table class="lta"><tr><th>Phase</th><th>Was passiert</th><th>Energie steckt …</th><th>Beim Federpendel</th></tr><tr><td>1</td><td>Kondensator voll, noch kein Strom</td><td>im E-Feld</td><td>Umkehrpunkt</td></tr><tr><td>2</td><td>Kondensator entlädt sich, Strom steigt</td><td>wechselt zur Spule</td><td>Weg zur Ruhelage</td></tr><tr><td>3</td><td>Kondensator leer, Strom maximal, die Spule treibt ihn weiter (Lenz)</td><td>im B-Feld</td><td>Ruhelage</td></tr><tr><td>4</td><td>Kondensator lädt sich umgekehrt auf, dann läuft alles rückwärts</td><td>wechselt zum Kondensator</td><td>Weg zum anderen Umkehrpunkt</td></tr></table></div>' +
   "<p>Dieselbe Rolle haben im Vergleich: Masse m entspricht L, Federhärte D entspricht 1/C, Auslenkung s entspricht Q, Geschwindigkeit v entspricht I.</p>" +
   LK("In der Realität hat der Draht einen Widerstand. Der wandelt Energie in Wärme um, deshalb wird die Schwingung gedämpft.") },
  { t: "Thomson-Formel", g: "Thomson-Formel", h:
   LF("T = 2π·√(L·C) &nbsp;&nbsp;&nbsp; f = 1/(2π·√(L·C))") +
   "<p>Größeres L oder größeres C machen die Schwingung langsamer. Vervierfachst du eines davon, verdoppelt sich T und f halbiert sich.</p>" +
   LX("<p>L = 0,5 H, C = 8 µF = 8 · 10⁻⁶ F:</p><ul><li>L·C = 4 · 10⁻⁶, die Wurzel davon ist 2 · 10⁻³</li><li>T = 2π · 2 · 10⁻³ s ≈ 0,01257 s = 12,57 ms</li><li>f = 1/T ≈ 79,6 Hz</li></ul>") +
   "<p>Soll bei gegebenem f ein Bauteil bestimmt werden, stellst du um: " + M("C = 1/(4π²·f²·L)") + ".</p>" },
  { t: "Energie im Schwingkreis", g: "Energie im Schwingkreis", h:
   "<p>Die ganze Energie steckt abwechselnd im Kondensator und in der Spule. Darum darfst du die Größtwerte gleichsetzen:</p>" + LF("E = ½·C·U<sub>max</sub>² = ½·L·I<sub>max</sub>²") +
   LX("<p>C = 4 µF wird auf 50 V geladen, L = 0,1 H:</p><ul><li>Q = C·U = 4 · 10⁻⁶ · 50 = 2 · 10⁻⁴ C</li><li>E = ½ · 4 · 10⁻⁶ · 2500 = 0,005 J</li><li>I<sub>max</sub> = √(2E/L) = √(0,01/0,1) ≈ 0,316 A</li></ul>") }
 ],
 9: [
  { t: "Dämpfung", g: "Dämpfung", h:
   "<p>In Wirklichkeit geht durch Reibung oder Widerstand Energie verloren. Die Schwingung wird dadurch immer kleiner, schwingt aber im Takt fast gleich weiter. Das Formelbuch (S. 24) beschreibt das so:</p>" +
   LF("s(t) = s<sub>max</sub>·e<sup>−δ·t</sup>·cos(ω<sub>D</sub>·t) &nbsp;&nbsp; ω<sub>D</sub> = √(ω² − δ²)") +
   "<ul><li><b>Der e-Teil</b> ist die schrumpfende Amplitude: " + M("s<sub>max</sub>·e<sup>−δ·t</sup>") + "</li><li><b>δ, der Abklingkoeffizient,</b> sagt, wie schnell sie schrumpft. Großes δ heißt: schnell.</li><li><b>ω<sub>D</sub></b> ist etwas kleiner als ω. Gedämpft schwingt es etwas langsamer.</li></ul>" +
   LX("<p>s<sub>max</sub> = 20 cm, δ = 0,1 s⁻¹: Nach 10 s ist die Amplitude 20 · e⁻¹ ≈ 7,36 cm.</p><p>ω = 13 s⁻¹, δ = 5 s⁻¹: ω<sub>D</sub> = √(169 − 25) = 12 s⁻¹.</p>") +
   "<p>Die DGL bekommt einen Zusatz, der die Reibung beschreibt: " + M("s̈ + 2δ·ṡ + (D/m)·s = 0") + ".</p>" },
  { t: "Erzwungene Schwingung und Resonanz", g: "Resonanz", h:
   "<p>Lässt du ein System einfach los, schwingt es mit seiner <b>Eigenfrequenz</b> f₀. Beim Federpendel ist das " + M("f₀ = (1/(2π))·√(D/m)") + ". Regst du es von außen dauernd an, schwingt es mit der Frequenz des Erregers. Das heißt <b>erzwungene Schwingung</b>.</p>" +
   '<div class="lw"><table class="lta"><tr><th>Erregerfrequenz</th><th>Amplitude</th></tr><tr><td>viel kleiner als f₀</td><td>klein, das System folgt einfach mit</td></tr><tr><td>ungefähr f₀ (<b>Resonanz</b>)</td><td>sehr groß</td></tr><tr><td>viel größer als f₀</td><td>sehr klein, das System kommt nicht hinterher</td></tr></table></div>' +
   "<p><b>Beispiel Schaukel:</b> Schubst du immer im richtigen Moment, also im Takt der Schaukel, wird sie immer höher. Bei jeder Schwingung kommt Energie dazu.</p>" +
   "<p>Bei einer Brücke oder einem Weinglas kann das so stark werden, dass etwas kaputtgeht: die <b>Resonanzkatastrophe</b>. Starke Dämpfung macht die Resonanzkurve flacher und die Spitze niedriger, deshalb haben Autos Stoßdämpfer.</p>" +
   LX("<p>m = 0,5 kg, D = 50 N/m: ω = 10 s⁻¹, also f₀ ≈ 1,59 Hz. Resonanz gibt es bei einem Erreger mit etwa 1,59 Hz.</p>") }
 ],
 10: [
  { t: "Welche Formel wann?", g: "Gemischte Wiederholung", h:
   '<div class="lw"><table class="lta"><tr><th>In der Aufgabe steht …</th><th>Dann nimm …</th></tr><tr><td>Feder, Masse</td><td class="m">T = 2π·√(m/D)</td></tr><tr><td>Faden, Länge</td><td class="m">T = 2π·√(l/g)</td></tr><tr><td>Spule, Kondensator</td><td class="m">T = 2π·√(L·C)</td></tr><tr><td>Masse hängt, Feder dehnt sich</td><td class="m">m·g = D·s₀</td></tr><tr><td>Funktion s(t) gegeben</td><td>s<sub>max</sub> und ω ablesen, dann v<sub>max</sub> = s<sub>max</sub>·ω</td></tr><tr><td>schnellste Stelle, Energie</td><td class="m">½·D·s<sub>max</sub>² = ½·m·v<sub>max</sub>²</td></tr><tr><td>fällt, tiefster Punkt, Seil</td><td class="m">m·g·h = ½·D·s²</td></tr><tr><td>beschleunigter Aufzug</td><td class="m">g<sub>eff</sub> = g ± a</td></tr><tr><td>„Zeige“, „Leite her“</td><td>Hooke, Newton, a = s̈, Ansatz, Nullprodukt</td></tr></table></div>' },
  { t: "So holst du die Punkte", h:
   "<p>Schreib jede Rechenaufgabe in derselben Reihenfolge auf:</p><ol><li><b>Gegeben:</b> alle Werte, sofort in SI.</li><li><b>Gesucht:</b> die Größe.</li><li><b>Ansatz:</b> die Formel hinschreiben. Dafür gibt es schon Punkte.</li><li><b>Umstellen,</b> dann erst Zahlen einsetzen.</li><li><b>Ergebnis</b> mit Einheit und kurzem Antwortsatz.</li></ol>" +
   "<p>Bei einer Herleitung begründest du jeden Schritt mit einem Wort, etwa „Hooke“, „Newton“ oder „Nullprodukt“.</p>" +
   LK("Vor dem Rechnen: Rechner auf RAD. Danach: Ist das Ergebnis realistisch? Ein Pendel mit T = 3000 s ist es nicht.") }
 ]
};
