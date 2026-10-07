"use client";
import AccountShell from "./account-shell";
import ProfileForm from "./profile-form";
export default function ProfilePage({
  wedding,
  googleEnabled,
}: {
  wedding: boolean;
  googleEnabled: boolean;
}) {
  return (
    <AccountShell
      wedding={wedding}
      googleEnabled={googleEnabled}
      active="profile"
    >
      {(user, update) => <ProfileForm user={user} onSaved={update} />}
    </AccountShell>
  );
}
