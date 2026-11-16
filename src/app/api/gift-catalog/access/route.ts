import { getTranslator } from "@/lib/i18n/server";
import { giftCatalogTarget, publicGiftCatalog } from "@/lib/api/gift-catalog";
import { backendFetch, forwardJSON, invalidOrigin } from "@/lib/api/server";
import { readRequestText } from "@/lib/api/request-body";
export async function POST(request: Request) {
  const i18n = await getTranslator();

  if (invalidOrigin(request))
    return Response.json({ error: i18n("Origen inválido") }, { status: 403 });
  const target = await giftCatalogTarget();
  if (!target || !(await publicGiftCatalog()))
    return Response.json(
      { error: i18n("Lista no disponible") },
      { status: 404 },
    );
  let body: string;
  try {
    body = await readRequestText(request, 4096);
  } catch {
    return Response.json(
      { error: i18n("Solicitud demasiado grande") },
      { status: 413 },
    );
  }
  const result = await backendFetch(
    `public/events/${target.kind}/${target.slug}/wishlist/access`,
    { method: "POST", headers: { "Content-Type": "application/json" }, body },
  );
  const response = forwardJSON(result);
  response.headers.set("Cache-Control", "private, no-store");
  return response;
}
