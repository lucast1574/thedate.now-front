const api = process.env.API_INTERNAL_URL ?? process.env.NEXT_PUBLIC_API_URL ?? "https://api.thedate.now";
type Context = { params: Promise<{ token: string }> };
function validToken(token: string) { return /^[0-9a-f]{48}$/.test(token); }
export async function GET(_request: Request, context: Context) {
  const { token } = await context.params;
  if (!validToken(token)) return Response.json({ error: "Not found" }, { status: 404 });
  const result = await fetch(`${api}/public/rsvp/${token}`, { cache: "no-store" }).catch(() => null);
  if (!result) return Response.json({ error: "API unavailable" }, { status: 502 });
  return new Response(result.body, { status: result.status, headers: { "Content-Type": "application/json" } });
}
export async function POST(request: Request, context: Context) {
  const { token } = await context.params;
  if (!validToken(token)) return Response.json({ error: "Not found" }, { status: 404 });
  const origin = request.headers.get("origin");
  if (origin && new URL(origin).host !== request.headers.get("host")) return Response.json({ error: "Invalid origin" }, { status: 403 });
  const body = await request.text();
  const result = await fetch(`${api}/public/rsvp/${token}`, { method: "POST", headers: { "Content-Type": "application/json" }, body, cache: "no-store" }).catch(() => null);
  if (!result) return Response.json({ error: "API unavailable" }, { status: 502 });
  return new Response(result.body, { status: result.status, headers: { "Content-Type": "application/json" } });
}
