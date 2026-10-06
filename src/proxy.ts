import { NextResponse, type NextRequest } from "next/server";
import { invitationHost } from "@/lib/events/domains";
import {
  allowedInvitationPath,
  invitationTarget,
} from "@/lib/events/invitation-runtime";
export function proxy(request: NextRequest) {
  const target = invitationTarget();
  const personal = /^\/(?:rsvp|api\/rsvp)\//.test(request.nextUrl.pathname);
  const next = () => {
    const response = NextResponse.next();
    if (personal) {
      response.headers.set("Cache-Control", "private, no-store");
      response.headers.set("Referrer-Policy", "no-referrer");
      response.headers.set("X-Robots-Tag", "noindex, nofollow");
    }
    return response;
  };
  if (!target) return next();
  const host = (request.headers.get("host") ?? "")
    .toLowerCase()
    .replace(/:\d+$/, "");
  if (
    host !== invitationHost(target.kind, target.slug) ||
    !allowedInvitationPath(request.nextUrl.pathname)
  )
    return new NextResponse("Not found", { status: 404 });
  return next();
}
