import { db, authName } from "@/lib/server/store";
import { json } from "@/lib/server/http";

export const dynamic = "force-dynamic";

export function GET(req) {
  if (!authName(req)) return json(401, { error: "Bitte anmelden" });
  return json(200, { people: Object.keys(db.users) });
}
