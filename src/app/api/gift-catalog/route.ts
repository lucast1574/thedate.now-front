import { getTranslator } from "@/lib/i18n/server";
import { publicGiftCatalog } from "@/lib/api/gift-catalog";
import { privateGiftJSON } from "@/lib/api/gift-scope";
export async function GET() {
  const i18n = await getTranslator();

  const data = await publicGiftCatalog();
  return data
    ? privateGiftJSON(data)
    : privateGiftJSON({ error: i18n("Lista no disponible") }, 404);
}
