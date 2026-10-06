"use client";
import { useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import Brand from "@/components/brand";
import AuthPanel from "@/features/studio/auth-panel";
import { api } from "@/lib/api/client";
import type { User } from "@/lib/events/types";
export default function AccountShell({
  wedding,
  googleEnabled,
  admin = false,
  children,
}: {
  wedding: boolean;
  googleEnabled: boolean;
  admin?: boolean;
  children: (user: User) => ReactNode;
}) {
  const [user, setUser] = useState<User | null>(null),
    [loading, setLoading] = useState(true),
    [busy, setBusy] = useState(false),
    [error, setError] = useState("");
  useEffect(() => {
    let active = true;
    api<User>("/api/session")
      .then((u) => {
        if (active) setUser(u);
      })
      .catch(() => {})
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);
  return (
    <main className={`office ${wedding ? "office-wedding" : "office-general"}`}>
      <header className="office-header">
        <Link href="/">
          <Brand wedding={wedding} />
        </Link>
        <nav>
          <Link href="/">Mis eventos</Link>
          {user?.role === "admin" && <Link href="/admin">Administración</Link>}
          <Link href="/affiliates">Afiliados</Link>
        </nav>
      </header>
      {loading ? (
        <p className="account-loading">Cargando tu cuenta…</p>
      ) : !user ? (
        <AuthPanel
          wedding={wedding}
          googleEnabled={googleEnabled}
          busy={busy}
          error={error}
          googleNext={admin ? "/admin" : "/affiliates"}
          onClearError={() => setError("")}
          onSignIn={async (fields, mode) => {
            setBusy(true);
            try {
              const result = await api<{ user: User }>("/api/session", "POST", {
                ...fields,
                action: mode,
                role: wedding ? "planner" : "organizer",
              });
              setUser(result.user);
            } catch (e) {
              setError((e as Error).message);
            } finally {
              setBusy(false);
            }
          }}
        />
      ) : admin && user.role !== "admin" ? (
        <section className="account-content">
          <h1>Acceso reservado.</h1>
          <p>Este panel requiere una cuenta administradora verificada.</p>
          <Link href="/">Volver a mis eventos</Link>
        </section>
      ) : (
        children(user)
      )}
    </main>
  );
}
