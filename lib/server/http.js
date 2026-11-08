const MAX_BODY = 512 * 1024;

export class HttpError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

export function json(status, body) {
  return Response.json(body, { status, headers: { "Cache-Control": "no-store" } });
}

export async function readBody(req) {
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

export function handle(fn) {
  return async (req, ctx) => {
    try {
      return await fn(req, ctx);
    } catch (e) {
      if (!e.status) console.error(e);
      return json(e.status || 500, { error: e.status ? e.message : "Serverfehler" });
    }
  };
}

const hits = globalThis.lernplanHits || (globalThis.lernplanHits = new Map());
if (!globalThis.lernplanHitsSweep) {
  globalThis.lernplanHitsSweep = setInterval(() => {
    const now = Date.now();
    for (const [ip, l] of hits) if (!l.some(t => now - t < 60000)) hits.delete(ip);
  }, 60000);
  globalThis.lernplanHitsSweep.unref?.();
}

export function limited(key, max, windowMs) {
  const now = Date.now();
  const list = (hits.get(key) || []).filter(t => now - t < windowMs);
  list.push(now);
  hits.set(key, list);
  return list.length > max;
}

export function clientIp(req) {
  return (req.headers.get("x-real-ip") || req.headers.get("x-forwarded-for") || "").split(",")[0].trim();
}
