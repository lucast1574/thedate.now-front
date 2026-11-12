import "server-only";
import { backendFetch } from "@/lib/api/server";
import type { PublicEvent } from "@/lib/events/types";
import { visibleInvitationSection } from "@/lib/events/section-visibility";

export async function sharePhotos(event: PublicEvent) {
  const section = event.sections?.find((s) =>
    visibleInvitationSection(s, event),
  );
  const canvas = section?.canvas;
  const keys = [
    ...new Set([
      ...(!canvas?.backgroundOverride
        ? [canvas?.backgroundImage?.photoKey || event.backgroundImage?.photoKey]
        : []),
      ...(canvas?.elements
        .filter((item) => item.type === "image")
        .map((item) => item.photoKey) || []),
      section?.photoKey,
      event.photoKeys?.[0],
    ]),
  ]
    .filter(
      (key): key is string =>
        !!key && /^[a-z0-9.-]+$/.test(key) && event.photoKeys.includes(key),
    )
    .slice(0, 8);
  const photos = await Promise.all(
    keys.map(async (key) => {
      try {
        const response = await backendFetch(
          `public/events/${event.kind}/${event.slug}/photos/${key}`,
          { signal: AbortSignal.timeout(8000) },
        );
        const type = response?.headers.get("content-type")?.split(";")[0];
        if (!response?.ok || !type || !/^image\/(png|jpeg|webp)$/.test(type))
          return null;
        const bytes = await response.arrayBuffer();
        if (bytes.byteLength > 10 * 1024 * 1024) return null;
        return [
          key,
          `data:${type};base64,${Buffer.from(bytes).toString("base64")}`,
        ] as const;
      } catch {
        return null;
      }
    }),
  );
  return Object.fromEntries(photos.filter((photo) => photo !== null));
}
