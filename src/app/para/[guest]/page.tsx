import PersonalInvitation from "@/features/invitations/personal-invitation";
import { personalToken } from "@/lib/events/personal-links";
export const metadata = { robots: { index: false, follow: false } };
export default async function Page({
  params,
}: {
  params: Promise<{ guest: string }>;
}) {
  const { guest } = await params;
  return <PersonalInvitation token={personalToken(guest)} />;
}
