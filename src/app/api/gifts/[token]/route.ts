import { getTranslator } from "@/lib/i18n/server";
import { scopedWishlist, privateGiftJSON } from "@/lib/api/gift-scope";
import { backendFetch, forwardJSON, invalidOrigin } from "@/lib/api/server";
import { readRequestText } from "@/lib/api/request-body";
type Context = { params: Promise<{ token: string }> };
export async function GET(_request: Request, { params }: Context) {
  const i18n = await getTranslator();

  const { token } = await params;
  const data = await scopedWishlist(token);
  return data
    ? privateGiftJSON(data)
    : privateGiftJSON(
        { error: i18n("Lista o código de invitado no disponible.") },
        404,
      );
}
export async function POST(request: Request, { params }: Context) {
  const i18n = await getTranslator();

  if (invalidOrigin(request))
    return privateGiftJSON({ error: i18n("Origen inválido") }, 403);
  const { token } = await params;
  if (!(await scopedWishlist(token)))
    return privateGiftJSON({ error: i18n("Lista no disponible") }, 404);
  let body: string;
  try {
    body = await readRequestText(request, 4096);
  } catch {
    return privateGiftJSON({ error: i18n("Solicitud demasiado grande") }, 413);
  }
  const result = await backendFetch(`public/wishlist/${token}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
  });
  const response = forwardJSON(result);
  response.headers.set("Cache-Control", "private, no-store");
  return response;
}
