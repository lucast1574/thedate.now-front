import "server-only";
export function backendURL(product?: string) {
  const base = (
    process.env.API_INTERNAL_URL ??
    process.env.NEXT_PUBLIC_API_URL ??
    "https://api.thedate.now"
  ).replace(/\/$/, "");
  const pinned = base.match(/\/products\/(general|wedding)$/)?.[1];
  if (pinned) {
    if (product && product !== pinned)
      throw new Error("The API belongs to another product");
    return base;
  }
  if (process.env.API_PRODUCT_ISOLATION !== "true") return base;
  if (product !== "general" && product !== "wedding")
    throw new Error("A product is required for the isolated API");
  return `${base}/products/${product}`;
}
