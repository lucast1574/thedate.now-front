import { backendFetch, bearer } from "@/lib/api/server";
import { sessionToken } from "@/lib/auth/session";
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string; gift: string }> },
) {
  const { id, gift } = await params,
    token = await sessionToken();
  if (!token || !/^[a-zA-Z0-9-]{1,64}$/.test(gift) || !/^[a-z0-9-]+$/.test(id))
    return new Response(null, { status: 404 });
  const result = await backendFetch(`events/${id}/wishlist/images/${gift}`, {
    headers: bearer(token),
  });
  if (!result?.ok) return new Response(null, { status: 404 });
  return new Response(result.body, {
    headers: {
      "Content-Type": result.headers.get("Content-Type") || "image/jpeg",
      "X-Content-Type-Options": "nosniff",
      "Cache-Control": "private, max-age=300",
      "Referrer-Policy": "no-referrer",
    },
  });
}
