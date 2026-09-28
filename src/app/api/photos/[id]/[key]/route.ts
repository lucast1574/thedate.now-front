import { cookies } from "next/headers";

const api = process.env.API_INTERNAL_URL ?? process.env.NEXT_PUBLIC_API_URL ?? "https://api.thedate.now";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string; key: string }> }) {
  const { id, key } = await params;
  if (!/^[0-9a-f-]{36}$/.test(id) || !/^[0-9a-f-]{36}\.(?:jpg|png|webp)$/.test(key)) {
    return new Response(null, { status: 404 });
  }
  const token = (await cookies()).get("thedate_session")?.value;
  if (!token) return new Response(null, { status: 401 });
  const result = await fetch(`${api}/events/${id}/photos/${key}`, {
    headers: { Authorization: `Bearer ${token}` }, cache: "no-store",
  }).catch(() => null);
  if (!result) return new Response(null, { status: 502 });
  if (!result.ok) return new Response(null, { status: result.status });
  return new Response(result.body, {
    status: 200,
    headers: { "Content-Type": result.headers.get("Content-Type") ?? "application/octet-stream", "Cache-Control": "private, no-store" },
  });
}
