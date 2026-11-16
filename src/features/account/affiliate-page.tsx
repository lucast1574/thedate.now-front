"use client";
import { useTranslator } from "@/lib/i18n/react";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import type { User } from "@/lib/events/types";
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
      {(user) => <AffiliateAccess user={user} wedding={wedding} />}
    </AccountShell>
  );
}

function AffiliateAccess({ user, wedding }: { user: User; wedding: boolean }) {
  const i18n = useTranslator();

  const router = useRouter();
  const allowed = user.role === (wedding ? "planner" : "organizer");
  useEffect(() => {
    if (!allowed) router.replace("/");
  }, [allowed, router]);
  return allowed ? (
    <AffiliateDashboard user={user} wedding={wedding} />
  ) : (
    <p className="account-loading">{i18n("Volviendo a tus invitaciones…")}</p>
  );
}
