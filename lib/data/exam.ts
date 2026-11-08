import { M } from "./markup";
import type { ExamTask, Review } from "../types";

export const EXAM: ExamTask[] = [
 { n: 1, title: "Federpendel", p: 12, q: "Ein Körper der Masse 200 g hängt an einer Feder mit D = 50 N/m und schwingt mit der Amplitude 5 cm.<br>a) Berechne ω, T und f. b) Berechne v<sub>max</sub> und a<sub>max</sub>. c) Berechne die Schwingungsenergie. d) Wie ändert sich T, wenn die Masse vervierfacht wird? Begründe ohne Rechnung.",
   s: "a) ω = √(50/0,2) = 15,8 s⁻¹; T = 2π/ω = 0,397 s; f = 2,52 Hz<br>b) v<sub>max</sub> = 0,05 · 15,8 = 0,79 m/s; a<sub>max</sub> = 0,05 · 250 = 12,5 m/s²<br>c) E = ½ · 50 · 0,05² = 0,0625 J (Kontrolle: ½ · 0,2 · 0,79² ≈ 0,0625 J)<br>d) T ~ √m, √4 = 2 → T verdoppelt sich." },
 { n: 2, title: "Herleitung", p: 10, q: "Stelle die Differentialgleichung des horizontalen Federpendels auf (jeden Schritt begründen) und zeige mit dem Ansatz " + M("s(t) = s<sub>max</sub>·cos(ωt)") + ", dass sie für " + M("ω = √(D/m)") + " gelöst wird.",
   s: "Hooke F = −Ds (Minus: Kraft zur Ruhelage) · Newton F = ma · a = s̈ → m s̈ = −Ds → s̈ + (D/m)s = 0.<br>Ansatz: ṡ = −s<sub>max</sub>·ω·sin(ωt), s̈ = −s<sub>max</sub>·ω²·cos(ωt). Einsetzen: −s<sub>max</sub>·ω²·cos(ωt) + (D/m)·s<sub>max</sub>·cos(ωt) = 0 → s<sub>max</sub>·cos(ωt)·(D/m − ω²) = 0. Nullprodukt, gilt für alle t → ω² = D/m → ω = √(D/m)." },
 { n: 3, title: "Schwingungsgleichung", p: 8, q: "Gegeben ist " + M("s(t) = 0,03 m · sin(4π s⁻¹ · t)") + ".<br>a) Gib s<sub>max</sub>, ω, f und T an. b) Berechne s(0,1 s). c) Gib v(t) an. d) Zu welchen Zeitpunkten in der ersten Periode ist die Geschwindigkeit maximal?",
   s: "a) s<sub>max</sub> = 3 cm, ω = 4π s⁻¹ ≈ 12,6 s⁻¹, f = 2 Hz, T = 0,5 s<br>b) s = 0,03 · sin(0,4π) = 0,0285 m (RAD!)<br>c) v(t) = 0,03 · 4π · cos(4πt) ≈ 0,377 m/s · cos(4πt)<br>d) |v| maximal in den Nulldurchgängen: t = 0; 0,25 s; 0,5 s" },
 { n: 4, title: "Fadenpendel", p: 10, q: "a) Berechne die Länge eines Sekundenpendels (T = 2,0 s). b) Welche Periodendauer hätte es auf dem Mond (g = 1,62 m/s²)? c) Die Pendeluhr hängt in einem Aufzug, der mit 2 m/s² nach oben beschleunigt. Geht die Uhr vor oder nach? Berechne T. d) Warum ist das Fadenpendel nur für kleine Winkel harmonisch?",
   s: "a) l = gT²/(4π²) = 9,81 · 4 / 39,48 = 0,994 m<br>b) T = 2π√(0,994/1,62) = 4,92 s<br>c) g<sub>eff</sub> = 11,81 m/s² → T = 2π√(0,994/11,81) = 1,82 s < 2 s → die Uhr geht vor.<br>d) F = −mg sin(s/l) ist nicht proportional zu s. Nur für kleine Winkel gilt sin φ ≈ φ → F ≈ −(mg/l)s." },
 { n: 5, title: "Senkrechtes Federpendel", p: 6, q: "Hängt man 400 g an eine Feder, dehnt sie sich um 8 cm. a) Berechne D. b) Berechne T. c) Erkläre, warum die Gewichtskraft T nicht beeinflusst.",
   s: "a) D = mg/s₀ = 3,924/0,08 = 49,1 N/m<br>b) T = 2π√(0,4/49,1) = 0,567 s (oder 2π√(s₀/g))<br>c) mg = Ds₀ kürzt sich heraus, es bleibt F = −Ds. Nur die Ruhelage wird verschoben." },
 { n: 6, title: "Bungee", p: 8, q: "Ein Springer (70 kg) springt an einem 20 m langen Seil. Der tiefste Punkt liegt 50 m unter der Absprungstelle. Seil wie ideale Feder, keine Reibung.<br>a) Berechne D des Seils. b) Wo liegt die Ruhelage? c) Mit welcher Periodendauer wippt er am Ende nach?",
   s: "a) Energiesatz vom Absprung bis zum tiefsten Punkt: mg · 50 m = ½D · (30 m)² → D = 2 · 70 · 9,81 · 50 / 900 = 76,3 N/m<br>b) s₀ = mg/D = 686,7/76,3 = 9,0 m Dehnung → Ruhelage 29 m unter dem Absprung<br>c) T = 2π√(70/76,3) = 6,0 s" },
 { n: 7, title: "Schwingkreis", p: 10, q: "C = 10 µF, L = 0,1 H, der Kondensator wird auf 12 V geladen.<br>a) Berechne T und f. b) Berechne die Energie und die maximale Stromstärke. c) Beschreibe die 4 Phasen einer Periode inkl. Energie. d) Warum hört die Schwingung in echt irgendwann auf?",
   s: "a) T = 2π√(0,1 · 10⁻⁵) = 2π · 10⁻³ s = 6,28 ms; f = 159 Hz<br>b) E = ½ · 10⁻⁵ · 144 = 7,2 · 10⁻⁴ J; I<sub>max</sub> = √(2E/L) = √0,0144 = 0,12 A<br>c) Geladen → Entladung, Strom steigt → C leer, Spule treibt Strom weiter (Lenz) → umgekehrt geladen. Energie wechselt zwischen E-Feld und B-Feld.<br>d) Der ohmsche Widerstand wandelt Energie in Wärme um → gedämpft." },
 { n: 8, title: "Verständnis", p: 6, q: "a) Nenne die zwei Bedingungen für eine Schwingung. b) Wann ist eine Schwingung harmonisch? c) Erkläre Resonanz an einem Beispiel.",
   s: "a) Rücktreibende Kraft und Trägheit.<br>b) Wenn F = −D·s (proportional zur Auslenkung und entgegengesetzt) → sinusförmig.<br>c) Erregerfrequenz ≈ Eigenfrequenz → Amplitude sehr groß (Schaukel anschubsen, Brücke, Weinglas)." }
];

export const REVIEW: Record<number, Review> = {
 1: { points: ["Immer zuerst in SI umrechnen: g → kg, cm → m, ms → s, µ = 10⁻⁶.", "Umstellen mit Wurzel: durch 2π teilen, quadrieren, auflösen.", "F<sub>G</sub> = m·g, F = m·a und F<sub>S</sub> = D·s sitzen."], q: [
  { t: "num", q: "Rechne 40 cm in Meter um.", a: 0.4, u: "m", s: "40 · 10⁻² m = 0,4 m" },
  { t: "mc", q: "Stelle " + M("T = 2π·√(l/g)") + " nach l um.", o: [M("l = g·T²/(4π²)"), M("l = 4π²·g/T²"), M("l = T²/(4π²·g)"), M("l = g·T/(2π)")], a: 0, s: "Durch 2π teilen, quadrieren, mit g malnehmen." },
  { t: "num", q: "Wie groß ist die Gewichtskraft auf 2 kg?", a: 19.62, u: "N", s: "F<sub>G</sub> = m·g = 2 · 9,81 = 19,62 N" } ] },
 2: { points: ["360° = 2π, Taschenrechner bei sin(ω·t) immer auf RAD.", "ω = 2π·f = 2π/T und f = 1/T.", "Vor dem sin steht die Amplitude, im sin steckt die Periode."], q: [
  { t: "num", q: "Rechne 180° ins Bogenmaß um.", a: 3.1416, u: "rad", s: "180° = π ≈ 3,14 rad" },
  { t: "num", q: "f = 2 Hz. Wie groß ist ω?", a: 12.566, u: "1/s", s: "ω = 2π·f = 4π ≈ 12,57 s⁻¹" },
  { t: "mc", q: "Was gilt für " + M("y = 2·sin(3x)") + "?", o: ["Amplitude 2, Periode 2π/3", "Amplitude 3, Periode 2π/2", "Amplitude 2, Periode 3", "Amplitude 6, Periode 2π"], a: 0, s: "Faktor vor sin = Amplitude, Periode = 2π/3." } ] },
 3: { points: ["Schwingung braucht rücktreibende Kraft und Trägheit.", M("s(t) = s<sub>max</sub>·sin(ω·t)") + ", " + M("v(t) = s<sub>max</sub>·ω·cos(ω·t)") + ", " + M("a(t) = −s<sub>max</sub>·ω²·sin(ω·t)") + ".", "Ruhelage: v maximal, a = 0. Umkehrpunkt: v = 0, a maximal."], q: [
  { t: "mc", q: "Was gilt im Umkehrpunkt?", o: ["v = 0, a maximal", "v maximal, a = 0", "v und a maximal", "v und a null"], a: 0, s: "Dort steht der Körper kurz still und wird am stärksten zurückgezogen." },
  { t: "num", q: M("s<sub>max</sub> = 0,1 m") + ", " + M("ω = 5 s⁻¹") + ". Wie groß ist " + M("v<sub>max</sub>") + "?", a: 0.5, u: "m/s", s: "v<sub>max</sub> = s<sub>max</sub>·ω = 0,1 · 5 = 0,5 m/s" },
  { t: "mc", q: "Was ist die Ableitung von " + M("s<sub>max</sub>·sin(ω·t)") + "?", o: [M("s<sub>max</sub>·ω·cos(ω·t)"), M("s<sub>max</sub>·cos(ω·t)"), M("−s<sub>max</sub>·ω·sin(ω·t)"), M("−s<sub>max</sub>·ω²·cos(ω·t)")], a: 0, s: "Äußere Ableitung cos, Kettenregel liefert ω." } ] },
 4: { points: ["Drei Schritte: F = −D·s, F = m·a, a = s̈.", "Ergebnis: " + M("s̈ + (D/m)·s = 0") + ".", "Einsetzen des Ansatzes liefert " + M("ω = √(D/m)") + " und " + M("T = 2π·√(m/D)") + "."], q: [
  { t: "mc", q: "Welche ist die DGL des Federpendels?", o: [M("s̈ + (D/m)·s = 0"), M("s̈ − (D/m)·s = 0"), M("ṡ + (D/m)·s = 0"), M("s̈ + (m/D)·s = 0")], a: 0, s: "−D·s = m·s̈, dann durch m teilen." },
  { t: "num", q: "m = 1 kg, D = 100 N/m. Wie groß ist ω?", a: 10, u: "1/s", s: "ω = √(100/1) = 10 s⁻¹" },
  { t: "mc", q: "Die Masse wird vervierfacht. Was passiert mit T?", o: ["T verdoppelt sich", "T vervierfacht sich", "T halbiert sich", "T bleibt gleich"], a: 0, s: "T hängt von √m ab, und √4 = 2." } ] },
 5: { points: ["Senkrecht: g verschiebt nur die Ruhelage um " + M("s₀ = m·g/D") + ", T bleibt gleich.", "Umkehrpunkt: nur Spannenergie. Ruhelage: nur Bewegungsenergie.", M("E = ½·D·s<sub>max</sub>² = ½·m·v<sub>max</sub>²") + "."], q: [
  { t: "mc", q: "Was bewirkt die Gravitation beim senkrechten Federpendel?", o: ["Sie verschiebt nur die Ruhelage", "Sie macht T größer", "Sie macht T kleiner", "Sie verhindert die Schwingung"], a: 0, s: "m·g = D·s₀ kürzt sich heraus, übrig bleibt F = −D·s." },
  { t: "num", q: "D = 100 N/m, " + M("s<sub>max</sub> = 0,2 m") + ". Wie groß ist die Schwingungsenergie?", a: 2, u: "J", s: "E = ½ · 100 · 0,2² = 2 J" },
  { t: "num", q: "E = 2 J, m = 1 kg. Wie groß ist " + M("v<sub>max</sub>") + "?", a: 2, u: "m/s", s: "v<sub>max</sub> = √(2E/m) = √4 = 2 m/s" } ] },
 6: { points: ["Rückstellkraft: " + M("F = −m·g·sin φ") + ".", "Für kleine Winkel gilt " + M("sin φ ≈ φ") + ", dann ist das Pendel harmonisch.", M("T = 2π·√(l/g)") + " hängt nicht von m ab. Im Aufzug zählt " + M("g<sub>eff</sub> = g ± a") + "."], q: [
  { t: "num", q: "l = 1 m. Wie groß ist T?", a: 2.006, u: "s", s: "T = 2π·√(1/9,81) ≈ 2,01 s" },
  { t: "mc", q: "Die Pendelmasse wird verdoppelt. Was passiert mit T?", o: ["T bleibt gleich", "T verdoppelt sich", "T wird um √2 größer", "T halbiert sich"], a: 0, s: "In T = 2π·√(l/g) kommt m nicht vor." },
  { t: "mc", q: "Der Aufzug beschleunigt nach oben. Was macht die Pendeluhr?", o: ["T wird kleiner, die Uhr geht vor", "T wird größer, die Uhr geht nach", "Nichts ändert sich", "Das Pendel bleibt stehen"], a: 0, s: "g<sub>eff</sub> = g + a wird größer, also wird T kleiner." } ] },
 7: { points: ["Meta-Rezept: F = −(etwas)·s finden. Das „etwas“ ist D. Dann " + M("T = 2π·√(m/D)") + ".", "Beispiel Fadenpendel: " + M("D = m·g/l") + ", daraus folgt " + M("T = 2π·√(l/g)") + ".", "Bungee: Energiesatz vom Absprung bis zum tiefsten Punkt."], q: [
  { t: "mc", q: "Wie findest du D bei einem neuen System?", o: ["Rückstellkraft als F = −(etwas)·s schreiben, das „etwas“ ist D", "Die Amplitude messen", "T = 2π·√(m/D) auswendig einsetzen", "Die Energie durch die Masse teilen"], a: 0, s: "Steht die Kraft in dieser Form da, kannst du D direkt ablesen." },
  { t: "num", q: "F = −12 N/m · s, m = 0,3 kg. Wie groß ist T?", a: 0.9935, u: "s", s: "D = 12 N/m, also T = 2π·√(0,3/12) ≈ 0,99 s" },
  { t: "mc", q: "Welcher Ansatz gilt für den tiefsten Punkt beim Bungee?", o: [M("m·g·h = ½·D·s²"), M("m·g = ½·D·s"), M("½·m·v² = D·s"), M("m·g·h = D·s")], a: 0, s: "Lageenergie wird komplett zu Spannenergie im Seil." } ] },
 8: { points: ["Vier Phasen: geladen → Entladung → Spule treibt den Strom weiter (Lenz) → umgekehrt geladen.", "Thomson: " + M("T = 2π·√(L·C)") + ".", "Energie pendelt: " + M("E = ½·C·U² = ½·L·I²") + "."], q: [
  { t: "num", q: "L = 1 H, C = 1 µF. Wie groß ist T in Millisekunden?", a: 6.283, u: "ms", s: "T = 2π·√(10⁻⁶) s = 2π · 10⁻³ s ≈ 6,28 ms" },
  { t: "mc", q: "Der Kondensator ist gerade leer. Wo steckt die Energie?", o: ["Im Magnetfeld der Spule", "Im elektrischen Feld", "In der Spannungsquelle", "Sie ist weg"], a: 0, s: "Der Strom ist jetzt maximal, also auch das Magnetfeld." },
  { t: "mc", q: "Welche Größe entspricht der Masse m beim Federpendel?", o: ["Induktivität L", "Kapazität C", "Ladung Q", "Spannung U"], a: 0, s: "Die Spule ist träge wie die Masse." } ] },
 9: { points: ["Dämpfung: Die Amplitude fällt mit " + M("e<sup>−δ·t</sup>") + ".", M("ω<sub>D</sub> = √(ω² − δ²)") + " ist etwas kleiner als ω.", "Resonanz: Erregerfrequenz ≈ Eigenfrequenz, die Amplitude wird sehr groß."], q: [
  { t: "mc", q: "Wann tritt Resonanz auf?", o: ["Erregerfrequenz ≈ Eigenfrequenz", "Bei sehr großer Dämpfung", "Bei sehr kleiner Masse", "Bei sehr hoher Erregerfrequenz"], a: 0, s: "Dann kommt die Energie immer im richtigen Moment." },
  { t: "num", q: "ω = 5 s⁻¹, δ = 3 s⁻¹. Wie groß ist " + M("ω<sub>D</sub>") + "?", a: 4, u: "1/s", s: "ω<sub>D</sub> = √(25 − 9) = 4 s⁻¹" },
  { t: "mc", q: "δ wird größer. Was passiert?", o: ["Die Amplitude fällt schneller ab", "Die Amplitude wächst", "Die Schwingung wird ungedämpft", "T wird null"], a: 0, s: "δ ist der Abklingkoeffizient." } ] },
 10: { points: ["Mindestens 63 von 70 Punkten in der Probeklausur.", "In der Klausur: RAD prüfen, alles in SI, Einheit und Antwortsatz.", "Bei Herleitungen jeden Schritt mit einem Wort begründen."], q: [
  { t: "mc", q: "Welcher Modus gehört zu sin(ω·t)?", o: ["RAD", "DEG", "GRAD", "egal"], a: 0, s: "ω·t ist im Bogenmaß." },
  { t: "mc", q: "Wie lautet die Periodendauer des Federpendels?", o: [M("T = 2π·√(m/D)"), M("T = 2π·√(D/m)"), M("T = 2π·√(l/g)"), M("T = 2π·√(L·C)")], a: 0, s: "Mehr Masse heißt langsamer, also steht m oben." },
  { t: "num", q: "f = 2 Hz. Wie groß ist T?", a: 0.5, u: "s", s: "T = 1/f = 0,5 s" } ] }
};
