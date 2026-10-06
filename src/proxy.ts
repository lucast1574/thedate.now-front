import { NextResponse, type NextRequest } from "next/server";
import { safeReferral } from "@/lib/auth/continuation";
import { invitationHost } from "@/lib/events/domains";
import {
  allowedInvitationPath,
  invitationTarget,
} from "@/lib/events/invitation-runtime";
export function proxy(request: NextRequest) {
  const target = invitationTarget();
  const personal = /^\/(?:rsvp|join|api\/(?:rsvp|join))\//.test(
    request.nextUrl.pathname,
  );
  const next = () => {
    const response = NextResponse.next();
    const ref = safeReferral(request.nextUrl.searchParams.get("ref"));
    if (!target && ref && !request.cookies.get("thedate_referral"))
      response.cookies.set("thedate_referral", ref, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 30 * 86400,
      });
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
