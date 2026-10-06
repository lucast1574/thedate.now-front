import { headers } from "next/headers";
import { notFound } from "next/navigation";
import ManagerPage from "@/features/manager/manager-page";
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
  return <ManagerPage id={(await params).id} />;
}
