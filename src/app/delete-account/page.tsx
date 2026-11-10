import AccountEntry from "@/features/account/account-entry";
export const metadata = { title: "Eliminar cuenta" };
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;
  return <AccountEntry deletion status={status} />;
}
