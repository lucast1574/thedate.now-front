import { scopedWishlist } from "@/lib/api/gift-scope";
import { backendFetch } from "@/lib/api/server";
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ token: string; gift: string }> },
) {
  const { token, gift } = await params;
  if (!/^[a-zA-Z0-9-]{1,64}$/.test(gift) || !(await scopedWishlist(token)))
    return new Response(null, { status: 404 });
  const result = await backendFetch(`public/wishlist/${token}/images/${gift}`);
  if (!result?.ok) return new Response(null, { status: 404 });
  return new Response(result.body, {
    headers: {
      "Content-Type": result.headers.get("Content-Type") || "image/jpeg",
      "X-Content-Type-Options": "nosniff",
      "Cache-Control": "private, max-age=300",
      "Referrer-Policy": "no-referrer",
    },
  });
}
