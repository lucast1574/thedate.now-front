import { sessionToken } from "@/lib/auth/session";
import { backendFetch, invalidOrigin } from "@/lib/api/server";
async function proxy(request: Request, method: "GET" | "POST") {
  if (method === "POST" && invalidOrigin(request))
    return Response.json({ error: "Invalid origin" }, { status: 403 });
  const token = await sessionToken();
  if (!token)
    return Response.json({ error: "Sign in required" }, { status: 401 });
  if (
    method === "POST" &&
    Number(request.headers.get("content-length") || 0) > 2 * 1024 * 1024
  )
    return Response.json({ error: "Photo is too large" }, { status: 413 });
  let body: ArrayBuffer | undefined;
  if (method === "POST") {
    const reader = request.body?.getReader();
    const chunks: Uint8Array[] = [];
    let size = 0;
    if (reader) {
      while (true) {
        const part = await reader.read();
        if (part.done) break;
        size += part.value.length;
        if (size > 2 * 1024 * 1024) {
          await reader.cancel();
          return Response.json(
            { error: "Photo is too large" },
            { status: 413 },
          );
        }
        chunks.push(part.value);
      }
    }
    const bytes = new Uint8Array(size);
    let offset = 0;
    for (const chunk of chunks) {
      bytes.set(chunk, offset);
      offset += chunk.length;
    }
    body = bytes.buffer;
  }
  const result = await backendFetch("profile/avatar", {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      ...(method === "POST"
        ? { "Content-Type": request.headers.get("content-type") || "" }
        : {}),
    },
    body,
  });
  if (!result)
    return Response.json(
      { error: "Profile service is unavailable" },
      { status: 503 },
    );
  return new Response(result.body, {
    status: result.status,
    headers: {
      "Content-Type": result.headers.get("content-type") || "application/json",
      "Cache-Control": "private, no-store",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
export function GET(request: Request) {
  return proxy(request, "GET");
}
export function POST(request: Request) {
  return proxy(request, "POST");
}
