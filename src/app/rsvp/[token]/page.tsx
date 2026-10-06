import PersonalInvitation from "@/features/invitations/personal-invitation";
export const metadata = { robots: { index: false, follow: false } };
export default async function Page({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  return <PersonalInvitation token={token} />;
}
