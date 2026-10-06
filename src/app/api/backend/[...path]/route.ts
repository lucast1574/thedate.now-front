import { proxyStudio } from "@/lib/api/studio-proxy";
export async function DELETE(request: Request, context: Context) {
  return proxyStudio(request, (await context.params).path, "DELETE");
}
type Context = { params: Promise<{ path: string[] }> };
export async function GET(request: Request, context: Context) {
  return proxyStudio(request, (await context.params).path, "GET");
}
export async function POST(request: Request, context: Context) {
  return proxyStudio(request, (await context.params).path, "POST");
}
export async function PATCH(request: Request, context: Context) {
  return proxyStudio(request, (await context.params).path, "PATCH");
}
