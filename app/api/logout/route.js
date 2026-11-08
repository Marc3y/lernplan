import { bearer, endSession } from "@/lib/server/store";
import { json } from "@/lib/server/http";

export const dynamic = "force-dynamic";

export function POST(req) {
  endSession(bearer(req));
  return json(200, { ok: true });
}
