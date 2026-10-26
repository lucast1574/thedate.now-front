import "server-only";
export function googleConfig(host: string) {
  const name = host.toLowerCase().split(":")[0].replace(/\.$/, "");
  const prefix =
    name === "studio.save.thedate.now"
      ? "GOOGLE_WEDDING"
      : name === "crea.thedate.now"
        ? "GOOGLE_GENERAL"
        : "";
  const separated = Boolean(
    process.env.GOOGLE_WEDDING_CLIENT_ID ||
    process.env.GOOGLE_GENERAL_CLIENT_ID,
  );
  if (!prefix) return { clientId: undefined, clientSecret: undefined };
  return {
    clientId: separated
      ? process.env[`${prefix}_CLIENT_ID`]
      : process.env.GOOGLE_CLIENT_ID,
    clientSecret: separated
      ? process.env[`${prefix}_CLIENT_SECRET`]
      : process.env.GOOGLE_CLIENT_SECRET,
  };
}
export function googleEnabled(host: string) {
  const config = googleConfig(host);
  return Boolean(config.clientId && config.clientSecret);
}
export function callbackFor(request: Request) {
  const host = request.headers.get("host")?.toLowerCase().split(":")[0];
  if (host === "studio.save.thedate.now" || host === "crea.thedate.now")
    return `https://${host}/api/auth/google/callback`;
  return process.env.NODE_ENV === "development"
    ? process.env.GOOGLE_REDIRECT_URI
    : undefined;
}
