import { backendFetch } from "@/lib/api/server";
import { sessionToken } from "@/lib/auth/session";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string; key: string }> },
) {
  const { id, key } = await params;
  if (
    !/^(?:demo-(?:wedding|general)-)?[0-9a-f-]{36}$/.test(id) ||
    !/^[0-9a-f-]{36}\.(?:jpg|png|webp)$/.test(key)
  ) {
    return new Response(null, { status: 404 });
  }
  const token = await sessionToken();
  if (!token) return new Response(null, { status: 401 });
  const result = await backendFetch(`events/${id}/photos/${key}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!result) return new Response(null, { status: 502 });
  if (!result.ok) return new Response(null, { status: result.status });
  return new Response(result.body, {
    status: 200,
    headers: {
      "Content-Type":
        result.headers.get("Content-Type") ?? "application/octet-stream",
      "Cache-Control": "private, no-store",
    },
  });
}
