import "server-only";
export function callbackFor(request: Request) {
  const host = request.headers.get("host")?.toLowerCase().split(":")[0];
  if (host === "studio.save.thedate.now" || host === "crea.thedate.now")
    return `https://${host}/api/auth/google/callback`;
  return process.env.NODE_ENV === "development"
    ? process.env.GOOGLE_REDIRECT_URI
    : undefined;
}
