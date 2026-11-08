import type { FormulaGroup } from "../types";

export const FORMULAS: FormulaGroup[] = [
 ["Beschreibende Größen", [["Periodendauer", "T = 1/f"], ["Frequenz (n Perioden in der Zeit t)", "f = n/t"], ["Kreisfrequenz", "ω = 2π·f = 2π/T"]]],
 ["Harmonische Schwingung", [["Kraftgesetz", "F(s) = −D·s"], ["Auslenkung (Elongation)", "s(t) = s<sub>max</sub>·sin(ω·t + φ₀)"], ["Geschwindigkeit", "v(t) = s<sub>max</sub>·ω·cos(ω·t + φ₀)"], ["Beschleunigung", "a(t) = −s<sub>max</sub>·ω²·sin(ω·t + φ₀) = −ω²·s"], ["Maximalwerte", "v<sub>max</sub> = s<sub>max</sub>·ω,  a<sub>max</sub> = s<sub>max</sub>·ω²"], ["Ohne Nullphasenwinkel (φ₀ = 0)", "s(t) = s<sub>max</sub>·sin(ω·t)"]]],
 ["Differenzialgleichung", [["Ungedämpft", "s̈(t) + (D/m)·s(t) = 0"], ["Andere Schreibweise", "d²s/dt² + (D/m)·s = 0"], ["Allgemein", "s̈ + ω²·s = 0"]]],
 ["Gedämpfte Schwingung (schwach)", [["Auslenkung", "s(t) = s<sub>max</sub>·e<sup>−δ·t</sup>·cos(ω<sub>D</sub>·t)"], ["Kreisfrequenz gedämpft", "ω<sub>D</sub> = √(ω² − δ²)"], ["DGL", "s̈ + 2δ·ṡ + (D/m)·s = 0"]]],
 ["Periodendauer von Pendeln", [["Federpendel", "T = 2π·√(m/D)"], ["Fadenpendel (Kleinwinkelnäherung)", "T = 2π·√(l/g)"], ["Federpendel: Kreisfrequenz", "ω = √(D/m)"], ["Senkrechtes Federpendel", "s₀ = m·g/D, T unverändert"]]],
 ["Fadenpendel genauer", [["Rückstellkraft", "F = −m·g·sin φ ≈ −(m·g/l)·s"], ["DGL", "s̈ + (g/l)·s = 0"], ["Pendeluhr im Aufzug", "g<sub>eff</sub> = g ± a"]]],
 ["Kräfte", [["Grundgleichung (Newton 2)", "F = m·a"], ["Gewichtskraft", "F<sub>G</sub> = m·g"], ["Federspannkraft (Hooke)", "F<sub>S</sub> = D·s"], ["Auftriebskraft", "F<sub>A</sub> = ρ·g·V"], ["Dichte", "ρ = m/V"], ["Schweredruck", "p = ρ·g·h"]]],
 ["Gleichförmige Kreisbewegung", [["Winkelgeschwindigkeit", "ω = Δφ/Δt = 2π/T = 2π·f"], ["Bahngeschwindigkeit", "v = ω·r"], ["Radialbeschleunigung", "a<sub>r</sub> = v²/r = ω²·r"]]],
 ["Energie", [["Bewegungsenergie", "E = ½·m·v²"], ["Lageenergie", "E = F<sub>G</sub>·h = m·g·h"], ["Spannenergie", "E = ½·D·s²"], ["Energieerhaltung", "E<sub>ges</sub> = E₁ + E₂ + … = konstant"], ["Gesamtenergie Schwingung", "E = ½·D·s<sub>max</sub>² = ½·m·v<sub>max</sub>²"]]],
 ["Elektrischer Schwingkreis", [["Thomson", "T = 2π·√(L·C)"], ["Eigenfrequenz", "f = 1/(2π·√(L·C))"], ["Ladung", "Q = C·U"], ["Energie", "E = ½·C·U² = ½·L·I²"]]]
];

export const SYMBOLS: [string, string][] = [["s", "Auslenkung, Elongation (bei Federn auch Dehnung)"], ["s<sub>max</sub>", "Amplitude (größte Auslenkung)"], ["v, a", "Geschwindigkeit, Beschleunigung"], ["T", "Periodendauer"], ["f", "Frequenz"], ["n", "Anzahl der Perioden"], ["t", "Zeit"], ["ω", "Kreisfrequenz bzw. Winkelgeschwindigkeit"], ["φ₀", "Nullphasenwinkel"], ["D", "Richtgröße, Federhärte"], ["m", "Masse"], ["g", "Fallbeschleunigung (Ortsfaktor), 9,81 m/s²"], ["l", "Pendellänge"], ["δ", "Abklingkoeffizient"], ["ω<sub>D</sub>", "Kreisfrequenz der gedämpften Schwingung"], ["F<sub>G</sub>, F<sub>S</sub>", "Gewichtskraft, Federspannkraft"], ["ρ, V, A", "Dichte, Volumen, Querschnittsfläche"], ["E", "Energie"], ["L, C", "Induktivität, Kapazität"], ["Q, U, I", "Ladung, Spannung, Stromstärke"]];

export const ANALOG: [string, string][] = [["Auslenkung s", "Ladung Q"], ["Geschwindigkeit v = ṡ", "Stromstärke I = Q̇"], ["Masse m (Trägheit)", "Induktivität L"], ["Federhärte D", "1/C"], ["Spannenergie ½·D·s²", "E-Feld-Energie ½·C·U²"], ["Bewegungsenergie ½·m·v²", "B-Feld-Energie ½·L·I²"], ["T = 2π√(m/D)", "T = 2π√(LC)"]];

export const KILLERS: string[] = ["Taschenrechner auf DEG statt RAD", "g, cm, µF, mH nicht in kg, m, F, H umgerechnet", "ω und f verwechselt (Faktor 2π)", "√(D/m) und √(m/D) vertauscht. Check: mehr Masse → langsamer → T größer", "Minus in F = −Ds vergessen oder nicht erklärt", "Behauptet, beim Fadenpendel hänge T von der Masse ab", "Ergebnis ohne Einheit oder ohne Antwortsatz", "Herleitung ohne Begründung der Schritte"];
