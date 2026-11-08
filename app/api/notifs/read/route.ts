import { notifAction, markRead } from "@/lib/server/notifs";

export const dynamic = "force-dynamic";

export const POST = notifAction(markRead);
