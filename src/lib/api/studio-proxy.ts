import { type Translator, spanishTranslator } from "@/lib/i18n/translator";
import "server-only";
import { cookies } from "next/headers";
import { sessionToken, clearSession, sessionOptions } from "@/lib/auth/session";
import { browserInstallationCookie } from "@/lib/auth/browser-installation";
import { backendFetch, forwardJSON, invalidOrigin } from "./server";
import { readRequestText, RequestBodyTooLarge } from "./request-body";
const allowedPath =
  /^(?:profile(?:\/professional)?|support\/tickets|events(?:\/[a-z0-9-]+(?:\/(?:wishlist(?:\/(?:metadata|reservations\/[a-zA-Z0-9-]+))?|guests(?:\/(?:import|[a-z0-9-]+))?|seating|activate|checkout|publish|deployment|delivery(?:\/retry)?|send-invitations|couple-invitations|couple-accounts|collaborators(?:\/[a-z0-9-]+)?|design(?:\/publish)?))?)?|maps\/resolve|templates|affiliates(?:\/(?:join|withdrawals))?|admin\/(?:support\/tickets(?:\/[a-z0-9-]+)?|overview|users(?:\/[a-z0-9-]+\/(?:role|events|withdrawals\/[a-z0-9-]+))?|withdrawals|events\/[a-z0-9-]+\/courtesy))$/;

export async function proxyStudio(
  request: Request,
  path: string[],
  method: "GET" | "POST" | "PATCH" | "DELETE",
  i18n: Translator = spanishTranslator,
) {
  const joined = path.join("/");
  const inboxPath =
    /^events\/[a-z0-9-]+\/(?:conversations(?:\/[a-z0-9-]+(?:\/history)?)?|guest-payments)$/;
  const deviceRegistration = joined === "devices" && method === "POST";
  const deviceRemoval =
    method === "DELETE" && /^devices\/[a-f0-9-]{36}$/.test(joined);
  if (
    !allowedPath.test(joined) &&
    !inboxPath.test(joined) &&
    !deviceRegistration &&
    !deviceRemoval
  )
    return Response.json({ error: i18n("Not found") }, { status: 404 });
  if (method !== "GET" && invalidOrigin(request))
    return Response.json({ error: i18n("Invalid origin") }, { status: 403 });
  const token = await sessionToken();
  if (!token)
    return Response.json({ error: i18n("Sign in required") }, { status: 401 });
  let body: string | undefined;
  if (method !== "GET" && method !== "DELETE") {
    try {
      body = await readRequestText(
        request,
        joined === "support/tickets" ? 5 * 1024 * 1024 : 1024 * 1024,
      );
    } catch (error) {
      return Response.json(
        {
          error:
            error instanceof RequestBodyTooLarge
              ? i18n("El reporte supera el tamaño permitido.")
              : i18n("No se pudo leer la solicitud."),
        },
        { status: error instanceof RequestBodyTooLarge ? 413 : 400 },
      );
    }
  }
  const params = new URL(request.url).searchParams;
  const scope = params.get("scope");
  const query =
    inboxPath.test(joined) && method === "GET" && params.has("before")
      ? `?${new URLSearchParams({ before: params.get("before") || "" })}`
      : method === "GET" &&
          joined.endsWith("/conversations") &&
          inboxPath.test(joined) &&
          params.get("summary") === "unread"
        ? "?summary=unread"
        : joined.includes("support/tickets")
          ? new URL(request.url).search
          : joined === "admin/users" && params.has("email")
            ? `?${new URLSearchParams({ email: params.get("email") || "" })}`
            : joined === "events" &&
                (scope === "organization" || scope === "sharing")
              ? `?scope=${scope}`
              : "";
  const result = await backendFetch(joined + query, {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      ...(body ? { "Content-Type": "application/json" } : {}),
    },
    body,
  });
  const response = forwardJSON(result);
  if (deviceRegistration && result?.ok && body) {
    const data = JSON.parse(body) as {
      installationId: string;
      platform: string;
    };
    if (data.platform === "web") {
      (await cookies()).set(browserInstallationCookie, data.installationId, {
        ...sessionOptions,
        maxAge: 30 * 86400,
      });
    }
  }
  if (
    result?.status === 401 ||
    (joined === "profile" && method === "DELETE" && result?.ok)
  )
    await clearSession();
  response.headers.set("Cache-Control", "private, no-store");
  return response;
}
