import { browserPushWorker } from "@/lib/firebase/browser-worker";
import { authorizedWebPushConfig } from "@/lib/firebase/web-config";
import { configuredProduct } from "@/lib/products/application";

export async function GET() {
  if (!configuredProduct()) return new Response(null, { status: 404 });
  const { config, status } = await authorizedWebPushConfig();
  if (!config) return new Response(null, { status });
  return browserPushWorker(config);
}
