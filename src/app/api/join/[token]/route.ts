import {
  backendFetch,
  forwardJSON,
  invalidOrigin,
  validInviteToken,
} from "@/lib/api/server";
import { sessionToken } from "@/lib/auth/session";
type Context = { params: Promise<{ token: string }> };
export async function GET(_request: Request, context: Context) {
  const { token } = await context.params;
  if (!validInviteToken(token))
    return Response.json({ error: "Not found" }, { status: 404 });
  const result = await backendFetch(`couple-invites/${token}`, {});
  return forwardJSON(result);
}
export async function POST(request: Request, context: Context) {
  const { token } = await context.params;
  if (!validInviteToken(token))
    return Response.json({ error: "Not found" }, { status: 404 });
  if (invalidOrigin(request))
    return Response.json({ error: "Invalid origin" }, { status: 403 });
  const session = await sessionToken();
  if (!session)
    return Response.json({ error: "Sign in required" }, { status: 401 });
  const result = await backendFetch(`couple-invites/${token}/accept`, {
    method: "POST",
    headers: { Authorization: `Bearer ${session}` },
  });
  return forwardJSON(result);
}
