import { cookies } from "next/headers";

const api = process.env.API_INTERNAL_URL ?? process.env.NEXT_PUBLIC_API_URL ?? "https://api.thedate.now";

export async function POST(request: Request) {
  const origin = request.headers.get("origin");
  if (origin && new URL(origin).host !== request.headers.get("host")) return Response.json({ error: "Invalid origin" }, { status: 403 });
  const input = await request.json().catch(() => null);
  if (!input || !["login", "register"].includes(input.action)) return Response.json({ error: "Invalid request" }, { status: 400 });
  const { action, ...credentials } = input;
  const result = await fetch(`${api}/auth/${action}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(credentials), cache: "no-store" }).catch(() => null);
  if (!result) return Response.json({ error: "API unavailable" }, { status: 502 });
  const data = await result.json();
  if (!result.ok) return Response.json(data, { status: result.status });
  (await cookies()).set("thedate_session", data.token, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", maxAge: 60 * 60 * 24 });
  return Response.json({ user: data.user });
}

export async function DELETE() { (await cookies()).delete("thedate_session"); return Response.json({ status: "signed_out" }); }

export async function GET() {
  const token = (await cookies()).get("thedate_session")?.value;
  if (!token) return Response.json({ error: "Sign in required" }, { status: 401 });
  const result = await fetch(`${api}/auth/me`, { headers: { Authorization: `Bearer ${token}` }, cache: "no-store" }).catch(() => null);
  if (!result) return Response.json({ error: "API unavailable" }, { status: 502 });
  return new Response(result.body, { status: result.status, headers: { "Content-Type": "application/json" } });
}
