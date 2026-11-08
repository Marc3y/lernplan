import { db, authName, saveEvents } from "./store";

type Apply = (me: string, ids: Set<string> | null) => void;
import { json, readBody, handle } from "./http";

export function notifAction(apply: Apply) {
  return handle(async req => {
    const me = authName(req);
    if (!me) return json(401, { error: "Bitte anmelden" });
    const body = await readBody<{ ids?: unknown }>(req);
    const ids = Array.isArray(body.ids) ? new Set(body.ids.map(String)) : null;
    apply(me, ids);
    saveEvents();
    return json(200, { ok: true });
  });
}

export const markRead: Apply = (me, ids) =>
  db.events.forEach(e => {
    if (e.to === me && (!ids || ids.has(e.id))) e.read = true;
  });

export const clearAll: Apply = me => {
  db.events = db.events.filter(e => e.to !== me);
};
