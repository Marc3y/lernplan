const FIRST_TEXT_MS = Number(process.env.GEMINI_FIRST_TEXT_MS) || 12000;
const STREAM_IDLE_MS = 25000;
const MODEL_COOLDOWN_MS = 2 * 60 * 1000;

export const geminiKey = () => process.env.GEMINI_API_KEY || "";
const models = () =>
  (process.env.GEMINI_MODELS || "gemini-3.5-flash,gemini-3-flash-preview,gemini-3.5-flash-lite,gemini-3.1-flash-lite")
    .split(",")
    .map(m => m.trim())
    .filter(Boolean);
const base = () => process.env.GEMINI_BASE || "https://generativelanguage.googleapis.com/v1beta";

declare global {
  var lernplanModelsDown: Map<string, number> | undefined;
}

export interface Content {
  role: "user" | "model";
  parts: { text: string }[];
}

type OpenResult = { ok: true; stream: ReadableStream<Uint8Array> } | { ok: false; reason: string };

const downUntil = globalThis.lernplanModelsDown || (globalThis.lernplanModelsDown = new Map());

export function modelOrder() {
  const now = Date.now();
  const all = models();
  const up = all.filter(m => (downUntil.get(m) || 0) <= now);
  return up.length ? up : all;
}

export const markUp = (model: string) => downUntil.delete(model);
export const markDown = (model: string) => downUntil.set(model, Date.now() + MODEL_COOLDOWN_MS);

async function* textChunks(body: ReadableStream<Uint8Array>): AsyncGenerator<string, void> {
  const reader = body.getReader();
  const dec = new TextDecoder();
  let buf = "";
  try {
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      buf += dec.decode(value, { stream: true });
      let i;
      while ((i = buf.indexOf("\n")) >= 0) {
        const line = buf.slice(0, i).trim();
        buf = buf.slice(i + 1);
        if (!line.startsWith("data:")) continue;
        let text = "";
        try {
          const parts: { text?: string; thought?: boolean }[] = JSON.parse(line.slice(5)).candidates?.[0]?.content?.parts || [];
          text = parts.filter(p => !p.thought).map(p => p.text || "").join("");
        } catch {}
        if (text) yield text;
      }
    }
  } finally {
    reader.releaseLock();
  }
}

export async function openModel(model: string, contents: Content[], clientSignal: AbortSignal): Promise<OpenResult> {
  const ctl = new AbortController();
  const onGone = () => ctl.abort();
  clientSignal.addEventListener("abort", onGone);
  let timer = setTimeout(() => ctl.abort(), FIRST_TEXT_MS);
  const finish = () => {
    clearTimeout(timer);
    clientSignal.removeEventListener("abort", onGone);
  };
  try {
    const upstream = await fetch(`${base()}/models/${model}:streamGenerateContent?alt=sse`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-goog-api-key": geminiKey() },
      body: JSON.stringify({ contents, generationConfig: { temperature: 0.6, maxOutputTokens: 4096 } }),
      signal: ctl.signal,
    });
    if (!upstream.ok) {
      await upstream.body?.cancel().catch(() => {});
      finish();
      return { ok: false, reason: "HTTP " + upstream.status };
    }
    const chunks = textChunks(upstream.body);
    const first = await chunks.next();
    if (first.done) {
      finish();
      return { ok: false, reason: "leere Antwort" };
    }
    const stream = new ReadableStream({
      async start(controller) {
        const enc = new TextEncoder();
        controller.enqueue(enc.encode(first.value as string));
        try {
          for (;;) {
            clearTimeout(timer);
            timer = setTimeout(() => ctl.abort(), STREAM_IDLE_MS);
            const next = await chunks.next();
            if (next.done) break;
            controller.enqueue(enc.encode(next.value as string));
          }
        } catch {}
        finish();
        try {
          controller.close();
        } catch {}
      },
      cancel() {
        ctl.abort();
        finish();
      },
    });
    return { ok: true, stream };
  } catch (e) {
    finish();
    return { ok: false, reason: ctl.signal.aborted ? "Zeitlimit" : e.message };
  }
}
