import { MAIN_USERS, NAME_RE, findUser, createUser, newSession, broadcast } from "@/lib/server/store";
import { json, readBody, handle, limited, clientIp } from "@/lib/server/http";

export const dynamic = "force-dynamic";

export const POST = handle(async req => {
  if (limited("auth:" + clientIp(req), 12, 60000)) return json(429, { error: "Zu viele Versuche. Warte eine Minute." });
  const body = await readBody(req);
  const pw = typeof body.password === "string" ? body.password : "";
  const name = String(body.name || "").trim();
  if (!NAME_RE.test(name)) return json(400, { error: "Benutzername: 3–20 Zeichen, nur Buchstaben, Zahlen, Punkt, Minus oder Unterstrich." });
  const taken = findUser(name) || Object.keys(MAIN_USERS).some(n => n.toLowerCase() === name.toLowerCase());
  if (taken) return json(409, { error: "Diesen Benutzernamen gibt es schon." });
  if (pw.length < 4 || pw.length > 100) return json(400, { error: "Das Passwort braucht mindestens 4 Zeichen." });
  createUser(name, pw);
  broadcast("state", { who: name, ts: 0 });
  return json(200, { name, token: newSession(name), main: false });
});
