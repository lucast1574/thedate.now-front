import "server-only";
import { backendURL } from "./config";
import { headers } from "next/headers";
import { invitationFromHost } from "@/lib/events/domains";
async function requestProduct() {
  if (process.env.INVITATION_KIND) return process.env.INVITATION_KIND;
  const host = ((await headers()).get("host") ?? "")
    .toLowerCase()
    .split(":")[0];
  if (["studio.save.thedate.now", "save.thedate.now"].includes(host))
    return "wedding";
  if (
    ["crea.thedate.now", "thedate.now", "backoffice.thedate.now"].includes(host)
  )
    return "general";
  return invitationFromHost(host)?.kind;
}
export async function backendFetch(path: string, init: RequestInit = {}) {
  const product =
    process.env.API_PRODUCT_ISOLATION === "true"
      ? await requestProduct()
      : undefined;
  return fetch(`${backendURL(product)}/${path}`, {
    ...init,
    cache: "no-store",
  }).catch(() => null);
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
