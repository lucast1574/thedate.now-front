import { giftCatalogTarget, publicGiftCatalog } from "@/lib/api/gift-catalog";
import { backendFetch } from "@/lib/api/server";
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ gift: string }> },
) {
  const { gift } = await params,
    target = await giftCatalogTarget();
  if (
    !target ||
    !/^[a-zA-Z0-9-]{1,64}$/.test(gift) ||
    !(await publicGiftCatalog())
  )
    return new Response(null, { status: 404 });
  const result = await backendFetch(
    `public/events/${target.kind}/${target.slug}/wishlist/images/${gift}`,
  );
  if (!result?.ok) return new Response(null, { status: 404 });
  return new Response(result.body, {
    headers: {
      "Content-Type": result.headers.get("Content-Type") || "image/jpeg",
      "X-Content-Type-Options": "nosniff",
      "Cache-Control": "public, max-age=300",
      "Referrer-Policy": "no-referrer",
    },
  });
}
