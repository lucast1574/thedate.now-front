import { invitationTarget } from "@/lib/events/invitation-runtime";
export const dynamic = "force-dynamic";
export function GET() {
  const target = invitationTarget();
  if (!target) return Response.json({ error: "Not found" }, { status: 404 });
  return Response.json(
    { eventId: target.eventId },
    { headers: { "Cache-Control": "no-store" } },
  );
}
