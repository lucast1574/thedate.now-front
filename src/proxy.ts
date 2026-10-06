import { NextResponse, type NextRequest } from "next/server";
import { invitationHost } from "@/lib/events/domains";
import {
  allowedInvitationPath,
  invitationTarget,
} from "@/lib/events/invitation-runtime";
export function proxy(request: NextRequest) {
  const target = invitationTarget();
  if (!target) return NextResponse.next();
  const host = (request.headers.get("host") ?? "")
    .toLowerCase()
    .replace(/:\d+$/, "");
  if (
    host !== invitationHost(target.kind, target.slug) ||
    !allowedInvitationPath(request.nextUrl.pathname)
  )
    return new NextResponse("Not found", { status: 404 });
  return NextResponse.next();
}
