"use client";
import AccountShell from "./account-shell";
import AffiliateDashboard from "./affiliate-dashboard";
export default function AffiliatePage({
  wedding,
  googleEnabled,
}: {
  wedding: boolean;
  googleEnabled: boolean;
}) {
  return (
    <AccountShell wedding={wedding} googleEnabled={googleEnabled}>
      {(user) => <AffiliateDashboard user={user} wedding={wedding} />}
    </AccountShell>
  );
}
