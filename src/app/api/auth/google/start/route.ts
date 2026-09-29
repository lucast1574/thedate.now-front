import { randomBytes } from "node:crypto";
import { cookies } from "next/headers";

function callbackFor(request: Request) {
  const host = request.headers.get("host")?.toLowerCase().split(":")[0];
  if (host === "studio.save.thedate.now" || host === "crea.thedate.now") return `https://${host}/api/auth/google/callback`;
  return process.env.NODE_ENV === "development" ? process.env.GOOGLE_REDIRECT_URI : undefined;
}

export async function GET(request: Request) {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const redirectUri = callbackFor(request);
  if (!clientId || !redirectUri) return Response.json({ error: "Google sign-in is not configured" }, { status: 503 });
  const state = randomBytes(32).toString("hex");
  (await cookies()).set("thedate_google_state", state, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/api/auth/google", maxAge: 600 });
  const url = new URL("https://accounts.google.com/o/oauth2/v2/auth");
  url.searchParams.set("client_id", clientId);
  url.searchParams.set("redirect_uri", redirectUri);
  url.searchParams.set("response_type", "code");
  url.searchParams.set("scope", "openid email profile");
  url.searchParams.set("state", state);
  return Response.redirect(url, 302);
}
