import { headers } from "next/headers";
import { notFound } from "next/navigation";
import ProfilePage from "@/features/account/profile-page";
export default async function Page() {
  const host = ((await headers()).get("host") ?? "").split(":")[0];
  if (
    process.env.NODE_ENV === "production" &&
    !["crea.thedate.now", "studio.save.thedate.now"].includes(host)
  )
    notFound();
  return (
    <ProfilePage
      wedding={host === "studio.save.thedate.now"}
      googleEnabled={Boolean(
        process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET,
      )}
    />
  );
}
