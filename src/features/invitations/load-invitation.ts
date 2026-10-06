import "server-only";
import { backendURL } from "@/lib/api/config";
import type { Kind, PublicEvent } from "@/lib/events/types";
export async function findEvent(
  kind: Kind,
  slug: string,
): Promise<PublicEvent | null> {
  const api = backendURL();
  try {
    const result = await fetch(`${api}/public/events/${kind}/${slug}`, {
      cache: "no-store",
    });
    return result.ok ? ((await result.json()) as PublicEvent) : null;
  } catch {
    return null;
  }
}
