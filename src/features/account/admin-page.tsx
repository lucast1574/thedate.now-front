"use client";
import AccountShell from "./account-shell";
import AdminDashboard from "./admin-dashboard";
export default function AdminPage({
  wedding,
  googleEnabled,
}: {
  wedding: boolean;
  googleEnabled: boolean;
}) {
  return (
    <AccountShell wedding={wedding} googleEnabled={googleEnabled} admin>
      {(user) => <AdminDashboard user={user} />}
    </AccountShell>
  );
}
