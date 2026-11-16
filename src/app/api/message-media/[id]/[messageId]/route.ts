import { backendFetch } from "@/lib/api/server";
import { sessionToken } from "@/lib/auth/session";
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string; messageId: string }> },
) {
  const { id, messageId } = await params;
  if (!/^[0-9a-f-]{36}$/.test(id) || !/^[a-f0-9]{64}$/.test(messageId))
    return new Response(null, { status: 404 });
  const token = await sessionToken();
  if (!token) return new Response(null, { status: 401 });
  const response = await backendFetch(
    `events/${id}/messages/${messageId}/media`,
    { headers: { Authorization: `Bearer ${token}` } },
  );
  if (!response) return new Response(null, { status: 502 });
  if (!response.ok) return new Response(null, { status: response.status });
  return new Response(response.body, {
    headers: {
      "Content-Type":
        response.headers.get("Content-Type") || "application/octet-stream",
      "Cache-Control": "private, no-store",
      "X-Content-Type-Options": "nosniff",
      "Content-Disposition": 'inline; filename="adjunto"',
    },
  });
}
