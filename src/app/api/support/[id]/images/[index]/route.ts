import { sessionToken } from "@/lib/auth/session";
import { backendFetch, bearer } from "@/lib/api/server";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string; index: string }> },
) {
  const { id, index } = await params;
  if (!/^[a-z0-9-]{1,80}$/.test(id) || !/^[0-2]$/.test(index))
    return new Response("Not found", { status: 404 });
  const token = await sessionToken();
  if (!token) return new Response("Sign in required", { status: 401 });
  const result = await backendFetch(`support/tickets/${id}/images/${index}`, {
    headers: bearer(token),
  });
  if (!result) return new Response("API unavailable", { status: 502 });
  return new Response(result.body, {
    status: result.status,
    headers: {
      "Content-Type":
        result.headers.get("Content-Type") ?? "application/octet-stream",
      "Cache-Control": "private, no-store",
      "X-Content-Type-Options": "nosniff",
      "Content-Security-Policy": "default-src 'none'; sandbox",
    },
  });
}
