import "server-only";
export function backendURL() {
  return (
    process.env.API_INTERNAL_URL ??
    process.env.NEXT_PUBLIC_API_URL ??
    "https://api.thedate.now"
  );
}
