"use client";
import { useTranslator } from "@/lib/i18n/react";
import { type Translator, spanishTranslator } from "@/lib/i18n/translator";

import { useCallback, useEffect, useState } from "react";
import { api } from "@/lib/api/client";
import type { User } from "@/lib/events/types";
import type { AdminData, Overview, Payout } from "@/lib/account/types";
import Alert from "@/components/alert";
import AdminRevenue from "./admin-revenue";
import AdminUsers from "./admin-users";
import AdminCourtesies from "./admin-courtesies";
import AdminPayouts from "./admin-payouts";
import SupportBoard from "@/features/support/support-board";
async function fetchAdmin(i18n: Translator = spanishTranslator) {
  const [overview, users, payouts] = await Promise.all([
    api<Overview>("/api/backend/admin/overview", undefined, undefined, i18n),
    api<User[]>("/api/backend/admin/users", undefined, undefined, i18n),
    api<Payout[]>("/api/backend/admin/withdrawals", undefined, undefined, i18n),
  ]);
  return { overview, users, payouts };
}
export default function AdminDashboard({
  user,
  wedding,
}: {
  user: User;
  wedding: boolean;
}) {
  const i18n = useTranslator();

  const [data, setData] = useState<AdminData | null>(null),
    [busy, setBusy] = useState(false),
    [error, setError] = useState(""),
    [notice, setNotice] = useState("");
  const load = useCallback(() => fetchAdmin(i18n).then(setData), [i18n]);
  useEffect(() => {
    let active = true;
    fetchAdmin(i18n)
      .then((d) => {
        if (active) setData(d);
      })
      .catch((e) => {
        if (active) setError(e.message);
      });
    return () => {
      active = false;
    };
  }, [i18n]);
  async function run(action: () => Promise<unknown>, message: string) {
    setBusy(true);
    setError("");
    setNotice("");
    try {
      await action();
      await load();
      setNotice(message);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <section className="account-content">
      <p className="office-kicker">{i18n("ADMINISTRACIÓN")}</p>
      <h1>{i18n("La mirada completa.")}</h1>
      <p className="office-lead">
        {i18n(
          "Ingresos, cuentas, reportes y afiliados de tu plataforma en un mismo panel.",
        )}
      </p>
      <Alert>{error}</Alert>
      <Alert variant="success">{notice}</Alert>
      <SupportBoard admin />
      {data ? (
        <>
          <AdminRevenue overview={data.overview} />
          <AdminCourtesies busy={busy} run={run} />
          <AdminUsers
            wedding={wedding}
            users={data.users}
            current={user}
            busy={busy}
            run={run}
          />
          <AdminPayouts rows={data.payouts} busy={busy} run={run} />
        </>
      ) : (
        !error && <p>{i18n("Cargando resumen…")}</p>
      )}
    </section>
  );
}
