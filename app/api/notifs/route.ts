import { db, authName } from "@/lib/server/store";
import { json } from "@/lib/server/http";

export const dynamic = "force-dynamic";

export function GET(req: Request) {
  const me = authName(req);
  if (!me) return json(401, { error: "Bitte anmelden" });
  const items = db.events.filter(e => e.to === me).slice(-120).reverse();
  return json(200, { items, unread: items.filter(e => !e.read).length });
}
