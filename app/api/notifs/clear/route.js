import { notifAction, clearAll } from "@/lib/server/notifs";

export const dynamic = "force-dynamic";

export const POST = notifAction(clearAll);
