import { headers } from "next/headers";
import { notFound } from "next/navigation";
import EditorPage from "@/features/designer/editor-page";
import { invitationTarget } from "@/lib/events/invitation-runtime";
export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const host = ((await headers()).get("host") ?? "")
    .toLowerCase()
    .replace(/:\d+$/, "")
    .replace(/\.$/, "");
  if (
    invitationTarget() ||
    ![
      "crea.thedate.now",
      "studio.save.thedate.now",
      "localhost",
      "127.0.0.1",
    ].includes(host)
  )
    notFound();
  return <EditorPage id={(await params).id} />;
}
