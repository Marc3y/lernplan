import { authName } from "@/lib/server/store";
import { json, readBody, handle, limited, clientIp } from "@/lib/server/http";
import { geminiKey, modelOrder, openModel, markUp, markDown, type Content } from "@/lib/server/gemini";

interface Message {
  role?: string;
  content?: unknown;
}

export const dynamic = "force-dynamic";

function toContents(msgs: Message[]): Content[] {
  const contents: Content[] = [];
  for (const m of msgs) {
    const role: Content["role"] = m.role === "assistant" ? "model" : "user";
    const text = String(m.content || "").slice(0, 20000);
    const last = contents[contents.length - 1];
    if (last && last.role === role) last.parts[0].text += "\n\n" + text;
    else contents.push({ role, parts: [{ text }] });
  }
  return contents;
}

export const POST = handle(async req => {
  if (!authName(req)) return json(401, { code: "not_granted", error: "Bitte anmelden" });
  if (!geminiKey()) return json(503, { code: "not_configured", error: "GEMINI_API_KEY fehlt" });
  if (limited(clientIp(req), 20, 60000)) return json(429, { code: "rate_limited", error: "Zu viele Anfragen" });
  const body = await readBody<{ messages?: unknown }>(req);
  const msgs: Message[] = Array.isArray(body.messages) ? body.messages.slice(-24) : [];
  if (!msgs.length) return json(400, { code: "invalid_request", error: "messages fehlt" });
  const contents = toContents(msgs);

  for (const model of modelOrder()) {
    if (req.signal.aborted) return new Response(null, { status: 499 });
    const result = await openModel(model, contents, req.signal);
    if (result.ok === true) {
      markUp(model);
      return new Response(result.stream, {
        headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-store", "X-Accel-Buffering": "no" },
      });
    }
    if (req.signal.aborted) return new Response(null, { status: 499 });
    console.error("gemini", model, result.reason);
    markDown(model);
  }
  return json(503, { code: "busy", error: "Alle KI-Modelle sind gerade nicht erreichbar" });
});
