import { cookies } from "next/headers";

const api = process.env.API_INTERNAL_URL ?? process.env.NEXT_PUBLIC_API_URL ?? "https://api.thedate.now";
const safe = /^events(?:\/[0-9a-f-]+(?:\/(?:guests|checkout|publish|send-invitations))?)?$/;

async function proxy(request: Request, path: string[], method: "GET" | "POST" | "PATCH") {
  const joined = path.join("/");
  if (!safe.test(joined)) return Response.json({ error: "Not found" }, { status: 404 });
  const origin = request.headers.get("origin");
  if (method !== "GET" && origin && new URL(origin).host !== request.headers.get("host")) return Response.json({ error: "Invalid origin" }, { status: 403 });
  const token = (await cookies()).get("thedate_session")?.value;
  if (!token) return Response.json({ error: "Sign in required" }, { status: 401 });
  const body = method === "GET" ? undefined : await request.text();
  const result = await fetch(`${api}/${joined}`, { method, headers: { Authorization: `Bearer ${token}`, ...(body ? { "Content-Type": "application/json" } : {}) }, body, cache: "no-store" }).catch(() => null);
  if (!result) return Response.json({ error: "API unavailable" }, { status: 502 });
  return new Response(result.body, { status: result.status, headers: { "Content-Type": "application/json" } });
}

type Context = { params: Promise<{ path: string[] }> };
export async function GET(request: Request, context: Context) { return proxy(request, (await context.params).path, "GET"); }
export async function POST(request: Request, context: Context) { return proxy(request, (await context.params).path, "POST"); }
export async function PATCH(request: Request, context: Context) { return proxy(request, (await context.params).path, "PATCH"); }
