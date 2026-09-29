import { cookies } from "next/headers";
const api = process.env.API_INTERNAL_URL ?? process.env.NEXT_PUBLIC_API_URL ?? "https://api.thedate.now";
export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!/^(?:demo-(?:wedding|general)-)?[0-9a-f-]{36}$/.test(id)) return Response.json({ error: "Not found" }, { status: 404 });
  const origin = request.headers.get("origin");
  if (origin && new URL(origin).host !== request.headers.get("host")) return Response.json({ error: "Invalid origin" }, { status: 403 });
  const token = (await cookies()).get("thedate_session")?.value;
  if (!token) return Response.json({ error: "Sign in required" }, { status: 401 });
  const data = await request.formData();
  const result = await fetch(`${api}/events/${id}/photos`, { method: "POST", headers: { Authorization: `Bearer ${token}` }, body: data, cache: "no-store" }).catch(() => null);
  if (!result) return Response.json({ error: "API unavailable" }, { status: 502 });
  return new Response(result.body, { status: result.status, headers: { "Content-Type": "application/json" } });
}
