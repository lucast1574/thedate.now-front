import "server-only";
import { backendURL } from "./config";
export async function backendFetch(path: string, init: RequestInit = {}) {
  return fetch(`${backendURL()}/${path}`, { ...init, cache: "no-store" }).catch(
    () => null,
  );
}
export function forwardJSON(result: Response | null) {
  if (!result)
    return Response.json({ error: "API unavailable" }, { status: 502 });
  return new Response(result.body, {
    status: result.status,
    headers: { "Content-Type": "application/json" },
  });
}
export function invalidOrigin(request: Request) {
  const origin = request.headers.get("origin");
  if (!origin) return false;
  try {
    return new URL(origin).host !== request.headers.get("host");
  } catch {
    return true;
  }
}
export function validInviteToken(token: string) {
  return /^[0-9a-f]{48}$/.test(token);
}
export function bearer(token: string) {
  return { Authorization: `Bearer ${token}` };
}
