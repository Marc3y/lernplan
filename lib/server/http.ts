const MAX_BODY = 512 * 1024;

export class HttpError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

export function json(status: number, body: unknown) {
  return Response.json(body, { status, headers: { "Cache-Control": "no-store" } });
}

export async function readBody<T = Record<string, unknown>>(req: Request): Promise<T> {
  const len = Number(req.headers.get("content-length") || 0);
  if (len > MAX_BODY) throw new HttpError(413, "too large");
  const buf = Buffer.from(await req.arrayBuffer());
  if (buf.length > MAX_BODY) throw new HttpError(413, "too large");
  try {
    return JSON.parse(buf.toString("utf8") || "{}");
  } catch {
    throw new HttpError(400, "invalid json");
  }
}

type Handler<C> = (req: Request, ctx: C) => Promise<Response>;

export function handle<C = unknown>(fn: Handler<C>): Handler<C> {
  return async (req, ctx) => {
    try {
      return await fn(req, ctx);
    } catch (e) {
      if (!e.status) console.error(e);
      return json(e.status || 500, { error: e.status ? e.message : "Serverfehler" });
    }
  };
}

declare global {
  var lernplanHits: Map<string, number[]> | undefined;
  var lernplanHitsSweep: ReturnType<typeof setInterval> | undefined;
}

const hits = globalThis.lernplanHits || (globalThis.lernplanHits = new Map());
if (!globalThis.lernplanHitsSweep) {
  globalThis.lernplanHitsSweep = setInterval(() => {
    const now = Date.now();
    for (const [ip, l] of hits) if (!l.some(t => now - t < 60000)) hits.delete(ip);
  }, 60000);
  globalThis.lernplanHitsSweep.unref?.();
}

export function limited(key: string, max: number, windowMs: number) {
  const now = Date.now();
  const list = (hits.get(key) || []).filter(t => now - t < windowMs);
  list.push(now);
  hits.set(key, list);
  return list.length > max;
}

export function clientIp(req: Request) {
  return (req.headers.get("x-real-ip") || req.headers.get("x-forwarded-for") || "").split(",")[0].trim();
}
