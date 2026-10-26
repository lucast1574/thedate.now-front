import { googleEnabled } from "@/lib/auth/google";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import AdminPage from "@/features/account/admin-page";
export default async function Page() {
  const host = ((await headers()).get("host") ?? "").split(":")[0];
  if (
    process.env.NODE_ENV === "production" &&
    !["crea.thedate.now", "studio.save.thedate.now"].includes(host)
  )
    notFound();
  return (
    <AdminPage
      wedding={host === "studio.save.thedate.now"}
      googleEnabled={googleEnabled(host)}
    />
  );
}
