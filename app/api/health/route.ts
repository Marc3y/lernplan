import { json } from "@/lib/server/http";

export const dynamic = "force-dynamic";

export function GET() {
  return json(200, { ok: true });
}
