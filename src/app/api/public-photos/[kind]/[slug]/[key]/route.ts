import { backendFetch } from "@/lib/api/server";
import { invitationFromHost } from "@/lib/events/domains";
import { invitationTarget } from "@/lib/events/invitation-runtime";
type Context = { params: Promise<{ kind: string; slug: string; key: string }> };
export async function GET(_request: Request, context: Context) {
  const { kind, slug, key } = await context.params;
  const target = invitationFromHost(
    `${slug}.${kind === "wedding" ? "save." : ""}thedate.now`,
  );
  const pinned = invitationTarget();
  if (
    !target ||
    target.kind !== kind ||
    !/^[a-z0-9.-]+$/.test(key) ||
    (pinned && (pinned.kind !== kind || pinned.slug !== slug))
  )
    return new Response("Not found", { status: 404 });
  const result = await backendFetch(
    `public/events/${kind}/${slug}/photos/${key}`,
  );
  if (!result) return new Response("API unavailable", { status: 502 });
  return new Response(result.body, {
    status: result.status,
    headers: {
      "Content-Type":
        result.headers.get("Content-Type") ?? "application/octet-stream",
      "Cache-Control": result.ok ? "public, max-age=300" : "no-store",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
