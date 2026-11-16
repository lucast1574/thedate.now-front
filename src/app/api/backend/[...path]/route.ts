import { getTranslator } from "@/lib/i18n/server";
import { proxyStudio } from "@/lib/api/studio-proxy";
export async function DELETE(request: Request, context: Context) {
  const i18n = await getTranslator();

  return proxyStudio(request, (await context.params).path, "DELETE", i18n);
}
type Context = { params: Promise<{ path: string[] }> };
export async function GET(request: Request, context: Context) {
  const i18n = await getTranslator();

  return proxyStudio(request, (await context.params).path, "GET", i18n);
}
export async function POST(request: Request, context: Context) {
  const i18n = await getTranslator();

  return proxyStudio(request, (await context.params).path, "POST", i18n);
}
export async function PATCH(request: Request, context: Context) {
  const i18n = await getTranslator();

  return proxyStudio(request, (await context.params).path, "PATCH", i18n);
}
