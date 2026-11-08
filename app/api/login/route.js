import { db, findUser, checkPw, newSession } from "@/lib/server/store";
import { json, readBody, handle, limited, clientIp } from "@/lib/server/http";

export const dynamic = "force-dynamic";

export const POST = handle(async req => {
  if (limited("auth:" + clientIp(req), 12, 60000)) return json(429, { error: "Zu viele Versuche. Warte eine Minute." });
  const body = await readBody(req);
  const pw = typeof body.password === "string" ? body.password : "";
  const name = findUser(body.name);
  if (!name || !checkPw(pw, db.users[name])) return json(401, { error: "Benutzername oder Passwort stimmt nicht." });
  return json(200, { name, token: newSession(name), main: !!db.users[name].main });
});
