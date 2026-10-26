import { googleEnabled } from "@/lib/auth/google";
import { headers } from "next/headers";
import Join from "@/features/couples/join";
export default async function Page({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const host = (await headers()).get("host") ?? "";
  return <Join token={token} googleEnabled={googleEnabled(host)} />;
}
