import { invitationTarget } from "@/lib/events/invitation-runtime";
import {
  backendFetch,
  forwardJSON,
  invalidOrigin,
  validInviteToken,
} from "@/lib/api/server";
type Context = { params: Promise<{ token: string }> };
export async function GET(_request: Request, context: Context) {
  const { token } = await context.params;
  if (!validInviteToken(token))
    return Response.json({ error: "Not found" }, { status: 404 });
  const result = await backendFetch(`public/rsvp/${token}`, {});
  const pinned = invitationTarget();
  if (pinned && result?.ok) {
    const details = await result.clone().json();
    if (
      details.kind !== pinned.kind ||
      details.slug !== pinned.slug ||
      details.event?.id !== pinned.eventId
    )
      return Response.json({ error: "Not found" }, { status: 404 });
  }
  return forwardJSON(result);
}
export async function POST(request: Request, context: Context) {
  const { token } = await context.params;
  if (!validInviteToken(token))
    return Response.json({ error: "Not found" }, { status: 404 });
  if (invalidOrigin(request))
    return Response.json({ error: "Invalid origin" }, { status: 403 });
  const pinned = invitationTarget();
  if (pinned) {
    const details = await backendFetch(`public/rsvp/${token}`);
    if (!details?.ok)
      return Response.json({ error: "Not found" }, { status: 404 });
    const data = await details.json();
    if (
      data.kind !== pinned.kind ||
      data.slug !== pinned.slug ||
      data.event?.id !== pinned.eventId
    )
      return Response.json({ error: "Not found" }, { status: 404 });
  }
  const body = await request.text();
  const result = await backendFetch(`public/rsvp/${token}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
  });
  return forwardJSON(result);
}
