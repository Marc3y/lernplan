# Lernplan Schwingungen

Lernseite für die Physikklausur (Kapitel 13 Schwingungen), gebaut mit Next.js. Live unter https://physik.marcey.net.

## Starten

```bash
npm install
npm run dev
```

Produktion:

```bash
npm run build
npm start
```

Die Seite läuft dann auf http://127.0.0.1:3002.

## Aufbau

- `app/` – Layout, Seite und die API-Routen unter `app/api`
- `components/` – Grundgerüst der Seite
- `lib/app.js` – Logik im Browser (Plan, Übungen, Fortschritt, Taschenrechner, KI-Tutor, Benachrichtigungen)
- `lib/data/` – Lerntage, Erklärungen, Tipps, Probeklausur und Formeln
- `lib/server/` – Konten, Speicher, Live-Updates und Gemini-Anbindung

## Konfiguration (`.env`)

```
GEMINI_API_KEY=...
GEMINI_MODELS=gemini-3.5-flash,gemini-3-flash-preview,gemini-3.5-flash-lite,gemini-3.1-flash-lite
MARCUS_PASSWORD=...
YOUSSEF_PASSWORD=...
```

Ohne `GEMINI_API_KEY` läuft alles außer dem KI-Tutor.

## Konten

- Marcus und Youssef sind feste Konten, ihre Passwörter kommen aus `.env`.
- Gäste legen über „Mit Benutzername anmelden“ ein eigenes Konto an.
- Fortschritt, Konten und Benachrichtigungen liegen als JSON in `data/`.
