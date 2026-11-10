import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { applicationProduct } from "@/lib/products/application";
import { googleEnabled } from "@/lib/auth/google";
import ProfilePage from "./profile-page";
import DeleteAccountPage from "./delete-account-page";

export default async function AccountEntry({
  deletion = false,
  status = "",
}: {
  deletion?: boolean;
  status?: string;
}) {
  const host = ((await headers()).get("host") ?? "").split(":")[0];
  if (
    process.env.NODE_ENV === "production" &&
    !["crea.thedate.now", "studio.save.thedate.now"].includes(host)
  )
    notFound();
  const props = {
    wedding: applicationProduct(host) === "wedding",
    googleEnabled: googleEnabled(host),
  };
  return deletion ? (
    <DeleteAccountPage {...props} status={status} />
  ) : (
    <ProfilePage {...props} />
  );
}
