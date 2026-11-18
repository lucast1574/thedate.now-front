import { cookies } from "next/headers";
import { safeReferral } from "@/lib/auth/continuation";
import { backendFetch, forwardJSON, invalidOrigin } from "@/lib/api/server";
import { sessionToken, setSession, clearSession } from "@/lib/auth/session";
import { browserInstallationCookie } from "@/lib/auth/browser-installation";

export async function POST(request: Request) {
  if (invalidOrigin(request))
    return Response.json({ error: "Invalid origin" }, { status: 403 });
  const input = await request.json().catch(() => null);
  if (!input || !["login", "register"].includes(input.action))
    return Response.json({ error: "Invalid request" }, { status: 400 });
  const { action, ...credentials } = input;
  const result = await backendFetch(`auth/${action}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      ...credentials,
      referralCode:
        action === "register"
          ? safeReferral((await cookies()).get("thedate_referral")?.value)
          : "",
    }),
  });
  if (!result)
    return Response.json({ error: "API unavailable" }, { status: 502 });
  const data = await result.json();
  if (!result.ok) return Response.json(data, { status: result.status });
  await setSession(data.token);
  return Response.json({ user: data.user });
}

export async function DELETE(request: Request) {
  if (invalidOrigin(request))
    return Response.json({ error: "Invalid origin" }, { status: 403 });
  const jar = await cookies();
  const id = jar.get(browserInstallationCookie)?.value;
  const token = await sessionToken();
  if (token && id && /^[a-f0-9-]{36}$/.test(id)) {
    const result = await backendFetch(`devices/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
      signal: AbortSignal.timeout(5000),
    });
    if (!result?.ok && result?.status !== 401)
      return Response.json(
        {
          error: "No pudimos desconectar las notificaciones. Intenta de nuevo.",
        },
        { status: 503 },
      );
  }
  jar.delete(browserInstallationCookie);
  await clearSession();
  return Response.json({ status: "signed_out" });
}

export async function GET() {
  const token = await sessionToken();
  if (!token)
    return Response.json({ error: "Sign in required" }, { status: 401 });
  const result = await backendFetch(`auth/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return forwardJSON(result);
}
