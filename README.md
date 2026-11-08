# lernplan

Lernseite für unsere Physikklausur über Schwingungen (Kapitel 13). Läuft auf https://physik.marcey.net

Drin sind ein Plan für 10 Lerntage mit Übungen, Erklärungen und Videos, eine Probeklausur, die Formeln, ein Fehlerheft, ein Taschenrechner und ein KI-Tutor über Gemini. Man kann sich einloggen und sieht dann auch, wie weit die anderen sind.

Gebaut mit Next.js und TypeScript. Gespeichert wird alles als JSON im Ordner `data/`.

Für die `.env`:

```
GEMINI_API_KEY=
GEMINI_MODELS=gemini-3.5-flash,gemini-3-flash-preview,gemini-3.5-flash-lite,gemini-3.1-flash-lite
MARCUS_PASSWORD=
YOUSSEF_PASSWORD=
```

Ohne Gemini-Key geht alles außer dem KI-Tutor.
