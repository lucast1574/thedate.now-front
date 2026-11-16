import { getTranslator } from "@/lib/i18n/server";
import { safeContinuation, safeReferral } from "@/lib/auth/continuation";
import { callbackFor, googleConfig } from "@/lib/auth/google";
import { setSession } from "@/lib/auth/session";
import { backendFetch } from "@/lib/api/server";
import { cookies } from "next/headers";

export async function GET(request: Request) {
  const i18n = await getTranslator();

  const redirectUri = callbackFor(request);
  const { clientId, clientSecret } = googleConfig(
    request.headers.get("host") ?? "",
  );
  const home = new URL(redirectUri || request.url).origin;
  const fail = (reason: string) =>
    Response.redirect(`${home}/?authError=${encodeURIComponent(reason)}`, 302);
  if (!redirectUri || !clientId || !clientSecret)
    return fail(i18n("Google no está configurado"));
  const url = new URL(request.url);
  const cookiesStore = await cookies();
  const expected = cookiesStore.get("thedate_google_state")?.value;
  const next = safeContinuation(cookiesStore.get("thedate_google_next")?.value);
  for (const name of ["thedate_google_state", "thedate_google_next"])
    cookiesStore.set(name, "", {
      path: "/api/auth/google",
      maxAge: 0,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });
  if (
    !expected ||
    url.searchParams.get("state") !== expected ||
    !url.searchParams.get("code")
  )
    return fail(i18n("Inicio de sesión cancelado o vencido"));
  const tokens = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code: url.searchParams.get("code")!,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: redirectUri,
      grant_type: "authorization_code",
    }),
    cache: "no-store",
  }).catch(() => null);
  if (!tokens?.ok)
    return fail(i18n("No se pudo completar el acceso con Google"));
  const data = await tokens.json();
  if (typeof data.id_token !== "string")
    return fail(i18n("Google no entregó una identidad válida"));
  const portal = new URL(redirectUri).hostname.startsWith("studio.save.")
    ? "wedding"
    : "general";
  const result = await backendFetch(`auth/google`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      idToken: data.id_token,
      portal,
      referralCode: safeReferral(cookiesStore.get("thedate_referral")?.value),
    }),
    cache: "no-store",
  }).catch(() => null);
  if (!result?.ok) return fail(i18n("No se pudo iniciar sesión"));
  const account = await result.json();
  await setSession(account.token);
  return Response.redirect(`${home}${next}`, 302);
}
