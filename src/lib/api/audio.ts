import "server-only";
export function audioResponse(result: Response | null, privateAudio = false) {
  if (!result) return new Response("Audio unavailable", { status: 502 });
  const headers = new Headers({
    "Content-Type": "audio/mpeg",
    "X-Content-Type-Options": "nosniff",
    "Cache-Control":
      privateAudio || !result.ok ? "private, no-store" : "public, max-age=300",
  });
  for (const name of ["Content-Length", "Content-Range", "Accept-Ranges"]) {
    const value = result.headers.get(name);
    if (value) headers.set(name, value);
  }
  return new Response(result.body, { status: result.status, headers });
}
export const validAudioKey = (key: string) => /^[a-f0-9-]{36}\.mp3$/.test(key);
export const validAudioEvent = (id: string) =>
  /^(?:demo-(?:wedding|general)-)?[a-f0-9-]{36}$/.test(id);
