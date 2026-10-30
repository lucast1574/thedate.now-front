import { publicGiftCatalog } from "@/lib/api/gift-catalog";
import { privateGiftJSON } from "@/lib/api/gift-scope";
export async function GET() {
  const data = await publicGiftCatalog();
  return data
    ? privateGiftJSON(data)
    : privateGiftJSON({ error: "Lista no disponible" }, 404);
}
