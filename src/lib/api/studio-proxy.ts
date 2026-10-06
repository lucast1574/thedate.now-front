import "server-only";
import { sessionToken } from "@/lib/auth/session";
import { backendFetch, forwardJSON, invalidOrigin } from "./server";
const allowedPath =
  /^(?:events(?:\/[a-z0-9-]+(?:\/(?:guests(?:\/import)?|seating|checkout|publish|deployment|send-invitations|couple-invitations|couple-accounts|collaborators(?:\/[a-z0-9-]+)?|design))?)?|maps\/resolve|templates|affiliates(?:\/(?:join|withdrawals))?|admin\/(?:overview|users(?:\/[a-z0-9-]+\/(?:role|withdrawals\/[a-z0-9-]+))?|withdrawals|events\/[a-z0-9-]+\/courtesy))$/;

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
  const body =
    method === "GET" || method === "DELETE" ? undefined : await request.text();
  const result = await backendFetch(joined, {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      ...(body ? { "Content-Type": "application/json" } : {}),
    },
    body,
  });
  return forwardJSON(result);
}
