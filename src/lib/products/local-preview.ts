export function localPreviewHost(host: string) {
  return process.env.NODE_ENV === "development" && host.endsWith(".localhost");
}
