import { cookies } from "next/headers";

const api = process.env.API_INTERNAL_URL ?? "https://api.thedate.now";

export async function GET(request: Request) {
  const host = request.headers.get("host")?.toLowerCase().split(":")[0];
  const redirectUri = host === "studio.save.thedate.now" || host === "crea.thedate.now" ? `https://${host}/api/auth/google/callback` : process.env.NODE_ENV === "development" ? process.env.GOOGLE_REDIRECT_URI : undefined;
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const home = new URL(redirectUri || request.url).origin;
  const fail = (reason: string) => Response.redirect(`${home}/?authError=${encodeURIComponent(reason)}`, 302);
  if (!redirectUri || !clientId || !clientSecret) return fail("Google no está configurado");
  const url = new URL(request.url);
  const cookiesStore = await cookies();
  const expected = cookiesStore.get("thedate_google_state")?.value;
  cookiesStore.delete("thedate_google_state");
  if (!expected || url.searchParams.get("state") !== expected || !url.searchParams.get("code")) return fail("Inicio de sesión cancelado o vencido");
  const tokens = await fetch("https://oauth2.googleapis.com/token", { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" }, body: new URLSearchParams({ code: url.searchParams.get("code")!, client_id: clientId, client_secret: clientSecret, redirect_uri: redirectUri, grant_type: "authorization_code" }), cache: "no-store" }).catch(() => null);
  if (!tokens?.ok) return fail("No se pudo completar el acceso con Google");
  const data = await tokens.json();
  if (typeof data.id_token !== "string") return fail("Google no entregó una identidad válida");
  const portal = new URL(redirectUri).hostname.startsWith("studio.save.") ? "wedding" : "general";
  const result = await fetch(`${api}/auth/google`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ idToken: data.id_token, portal }), cache: "no-store" }).catch(() => null);
  if (!result?.ok) return fail("No se pudo iniciar sesión");
  const account = await result.json();
  cookiesStore.set("thedate_session", account.token, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", maxAge: 60 * 60 * 24 });
  return Response.redirect(`${home}/`, 302);
}
