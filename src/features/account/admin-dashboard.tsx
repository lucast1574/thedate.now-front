"use client";
import { useCallback, useEffect, useState } from "react";
import { api } from "@/lib/api/client";
import type { User, Event } from "@/lib/events/types";
import type { AdminData, Overview, Payout } from "@/lib/account/types";
import Alert from "@/components/alert";
import AdminRevenue from "./admin-revenue";
import AdminUsers from "./admin-users";
import AdminCourtesies from "./admin-courtesies";
import AdminPayouts from "./admin-payouts";
async function fetchAdmin() {
  const [overview, users, events, payouts] = await Promise.all([
    api<Overview>("/api/backend/admin/overview"),
    api<User[]>("/api/backend/admin/users"),
    api<Event[]>("/api/backend/events"),
    api<Payout[]>("/api/backend/admin/withdrawals"),
  ]);
  return { overview, users, events, payouts };
}
export default function AdminDashboard({ user }: { user: User }) {
  const [data, setData] = useState<AdminData | null>(null),
    [busy, setBusy] = useState(false),
    [error, setError] = useState(""),
    [notice, setNotice] = useState("");
  const load = useCallback(() => fetchAdmin().then(setData), []);
  useEffect(() => {
    let active = true;
    fetchAdmin()
      .then((d) => {
        if (active) setData(d);
      })
      .catch((e) => {
        if (active) setError(e.message);
      });
    return () => {
      active = false;
    };
  }, []);
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
      <p className="office-kicker">ADMINISTRACIÓN · AMBAS MARCAS</p>
      <h1>La mirada completa.</h1>
      <p className="office-lead">
        Ingresos, cuentas, cortesías y afiliados de The Date y Save the Date en
        un mismo panel.
      </p>
      <Alert>{error}</Alert>
      <Alert variant="success">{notice}</Alert>
      {data ? (
        <>
          <AdminRevenue overview={data.overview} />
          <AdminCourtesies events={data.events} busy={busy} run={run} />
          <AdminUsers users={data.users} current={user} busy={busy} run={run} />
          <AdminPayouts rows={data.payouts} busy={busy} run={run} />
        </>
      ) : (
        !error && <p>Cargando resumen…</p>
      )}
    </section>
  );
}
