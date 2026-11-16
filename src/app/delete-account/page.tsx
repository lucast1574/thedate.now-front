import { getTranslator } from "@/lib/i18n/server";
import AccountEntry from "@/features/account/account-entry";
export async function generateMetadata() {
  const i18n = await getTranslator();
  return {
    title: i18n("Eliminar cuenta"),
  };
}
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;
  return <AccountEntry deletion status={status} />;
}
