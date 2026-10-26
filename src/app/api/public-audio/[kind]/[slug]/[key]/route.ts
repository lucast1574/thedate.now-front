import { backendFetch } from "@/lib/api/server";
import { invitationFromHost } from "@/lib/events/domains";
import { invitationTarget } from "@/lib/events/invitation-runtime";
import { audioResponse, validAudioKey } from "@/lib/api/audio";
export async function GET(
  request: Request,
  { params }: { params: Promise<{ kind: string; slug: string; key: string }> },
) {
  const { kind, slug, key } = await params;
  const target = invitationFromHost(
    `${slug}.${kind === "wedding" ? "save." : ""}thedate.now`,
  );
  const pinned = invitationTarget();
  if (
    !target ||
    target.kind !== kind ||
    !validAudioKey(key) ||
    (pinned && (pinned.kind !== kind || pinned.slug !== slug))
  )
    return new Response("Not found", { status: 404 });
  const headers: Record<string, string> = {};
  if (request.headers.has("range"))
    headers.Range = request.headers.get("range")!;
  return audioResponse(
    await backendFetch(`public/events/${kind}/${slug}/audio/${key}`, {
      headers,
    }),
  );
}
