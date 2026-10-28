import "server-only";
import { sessionToken } from "@/lib/auth/session";
import { backendFetch, forwardJSON, invalidOrigin } from "./server";
import { readRequestText, RequestBodyTooLarge } from "./request-body";
const allowedPath =
  /^(?:profile(?:\/professional)?|support\/tickets|events(?:\/[a-z0-9-]+(?:\/(?:wishlist(?:\/(?:metadata|reservations\/[a-zA-Z0-9-]+))?|guests(?:\/import)?|seating|activate|checkout|publish|deployment|delivery|send-invitations|couple-invitations|couple-accounts|collaborators(?:\/[a-z0-9-]+)?|design))?)?|maps\/resolve|templates|affiliates(?:\/(?:join|withdrawals))?|admin\/(?:support\/tickets(?:\/[a-z0-9-]+)?|overview|users(?:\/[a-z0-9-]+\/(?:role|withdrawals\/[a-z0-9-]+))?|withdrawals|events\/[a-z0-9-]+\/courtesy))$/;

export async function proxyStudio(
  request: Request,
  path: string[],
  method: "GET" | "POST" | "PATCH" | "DELETE",
) {
  const joined = path.join("/");
  if (!allowedPath.test(joined))
    return Response.json({ error: "Not found" }, { status: 404 });
  if (method !== "GET" && invalidOrigin(request))
    return Response.json({ error: "Invalid origin" }, { status: 403 });
  const token = await sessionToken();
  if (!token)
    return Response.json({ error: "Sign in required" }, { status: 401 });
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
              ? "El reporte supera el tamaño permitido."
              : "No se pudo leer la solicitud.",
        },
        { status: error instanceof RequestBodyTooLarge ? 413 : 400 },
      );
    }
  }
  const query = joined.includes("support/tickets")
    ? new URL(request.url).search
    : joined === "events" &&
        new URL(request.url).searchParams.get("scope") === "organization"
      ? "?scope=organization"
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
  response.headers.set("Cache-Control", "private, no-store");
  return response;
}
