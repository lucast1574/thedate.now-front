import { authorizedWebPushConfig } from "@/lib/firebase/web-config";

export async function GET() {
  const { config, status } = await authorizedWebPushConfig();
  if (!config)
    return Response.json({ error: "Notifications unavailable" }, { status });
  return Response.json(config, {
    headers: { "Cache-Control": "private, no-store" },
  });
}
