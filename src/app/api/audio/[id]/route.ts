import { backendFetch, forwardJSON, invalidOrigin } from "@/lib/api/server";
import { sessionToken } from "@/lib/auth/session";
import { validAudioEvent } from "@/lib/api/audio";
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  if (!validAudioEvent(id)) return new Response("Not found", { status: 404 });
  if (invalidOrigin(request))
    return new Response("Invalid origin", { status: 403 });
  const token = await sessionToken();
  if (!token) return new Response("Sign in required", { status: 401 });
  const reader = request.body?.getReader();
  if (!reader) return new Response("Choose an MP3", { status: 400 });
  const chunks: Uint8Array<ArrayBuffer>[] = [];
  let size = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > 10 * 1024 * 1024) {
        await reader.cancel();
        return Response.json(
          { error: "El MP3 debe pesar menos de 10 MB." },
          { status: 413 },
        );
      }
      chunks.push(new Uint8Array(value));
    }
  } finally {
    reader.releaseLock();
  }
  return forwardJSON(
    await backendFetch(`events/${id}/audio`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "audio/mpeg",
      },
      body: new Blob(chunks, { type: "audio/mpeg" }),
    }),
  );
}
