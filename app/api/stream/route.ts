import { db, authName, type StreamClient } from "@/lib/server/store";
import { json } from "@/lib/server/http";

export const dynamic = "force-dynamic";

export function GET(req: Request) {
  const me = authName(req);
  if (!me) return json(401, { error: "Bitte anmelden" });
  const enc = new TextEncoder();
  let client: StreamClient;
  const stream = new ReadableStream({
    start(controller) {
      client = {
        who: me,
        send(msg) {
          try {
            controller.enqueue(enc.encode(msg));
          } catch {
            db.streams.delete(client);
          }
        },
      };
      client.send("retry: 4000\n\n");
      db.streams.add(client);
      req.signal.addEventListener("abort", () => {
        db.streams.delete(client);
        try {
          controller.close();
        } catch {}
      });
    },
    cancel() {
      db.streams.delete(client);
    },
  });
  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-store",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
    },
  });
}
