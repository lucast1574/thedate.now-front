import { headers } from "next/headers";
import { notFound } from "next/navigation";
import AffiliatePage from "@/features/account/affiliate-page";
export default async function Page() {
  const host = ((await headers()).get("host") ?? "").split(":")[0];
  if (
    process.env.NODE_ENV === "production" &&
    !["crea.thedate.now", "studio.save.thedate.now"].includes(host)
  )
    notFound();
  return (
    <AffiliatePage
      wedding={host === "studio.save.thedate.now"}
      googleEnabled={Boolean(
        process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET,
      )}
    />
  );
}
