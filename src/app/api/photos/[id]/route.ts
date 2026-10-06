import { backendFetch, forwardJSON, invalidOrigin } from "@/lib/api/server";
import { sessionToken } from "@/lib/auth/session";
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  if (!/^(?:demo-(?:wedding|general)-)?[0-9a-f-]{36}$/.test(id))
    return Response.json({ error: "Not found" }, { status: 404 });
  if (invalidOrigin(request))
    return Response.json({ error: "Invalid origin" }, { status: 403 });
  const token = await sessionToken();
  if (!token)
    return Response.json({ error: "Sign in required" }, { status: 401 });
  const data = await request.formData();
  const result = await backendFetch(`events/${id}/photos`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: data,
  });
  return forwardJSON(result);
}
