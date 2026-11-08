import { db, authName } from "@/lib/server/store";
import { json } from "@/lib/server/http";

export const dynamic = "force-dynamic";

export function GET(req) {
  const name = authName(req);
  if (!name) return json(401, { error: "nicht angemeldet" });
  return json(200, { name, main: !!db.users[name].main });
}
