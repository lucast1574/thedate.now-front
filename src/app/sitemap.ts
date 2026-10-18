import type { MetadataRoute } from "next";
import { publicOrigin } from "@/features/marketing/public-origin";
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const origin = await publicOrigin();
  return origin ? [{ url: `${origin}/` }] : [];
}
