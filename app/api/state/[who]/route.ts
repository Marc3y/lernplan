import { db, authName, saveState, addEvents, broadcast } from "@/lib/server/store";
import { json, readBody, handle, limited, clientIp } from "@/lib/server/http";

export const dynamic = "force-dynamic";

type Ctx = { params: Promise<{ who: string }> };

export const PUT = handle<Ctx>(async (req, { params }) => {
  const me = authName(req);
  if (!me) return json(401, { error: "Bitte anmelden" });
  const { who } = await params;
  if (decodeURIComponent(who) !== me) return json(403, { error: "Das ist nicht dein Konto" });
  if (limited("put:" + clientIp(req), 120, 60000)) return json(429, { error: "Zu viele Anfragen" });
  const body = await readBody<{ state?: unknown; ts?: unknown; events?: unknown }>(req);
  if (typeof body.state !== "string" || typeof body.ts !== "number") return json(400, { error: "state und ts erwartet" });
  try {
    JSON.parse(body.state);
  } catch {
    return json(400, { error: "state ist kein JSON" });
  }
  const prev = db.state[me];
  if (prev && prev.ts > body.ts) return json(409, { error: "neuerer Stand vorhanden", ts: prev.ts });
  saveState(me, { state: body.state, ts: body.ts });
  if (Array.isArray(body.events) && body.events.length) addEvents(me, body.events);
  broadcast("state", { who: me, ts: body.ts });
  return json(200, { ok: true });
});
