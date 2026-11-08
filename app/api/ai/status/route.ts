import { geminiKey } from "@/lib/server/gemini";
import { json } from "@/lib/server/http";

export const dynamic = "force-dynamic";

export function GET() {
  return json(200, { enabled: !!geminiKey() });
}
