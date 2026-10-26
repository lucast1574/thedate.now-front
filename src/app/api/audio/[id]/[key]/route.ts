import { backendFetch } from "@/lib/api/server";
import { sessionToken } from "@/lib/auth/session";
import { audioResponse, validAudioEvent, validAudioKey } from "@/lib/api/audio";
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string; key: string }> },
) {
  const { id, key } = await params;
  if (!validAudioEvent(id) || !validAudioKey(key))
    return new Response("Not found", { status: 404 });
  const token = await sessionToken();
  if (!token) return new Response("Sign in required", { status: 401 });
  const headers: Record<string, string> = { Authorization: `Bearer ${token}` };
  if (request.headers.has("range"))
    headers.Range = request.headers.get("range")!;
  return audioResponse(
    await backendFetch(`events/${id}/audio/${key}`, { headers }),
    true,
  );
}
