"use client";
import { useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import ProductAlternative from "@/features/studio/product-alternative";
import StudioHeader from "@/features/studio/studio-header";
import WorkspaceSidebar from "@/features/studio/workspace-sidebar";
import AuthPanel from "@/features/studio/auth-panel";
import { api } from "@/lib/api/client";
import type { User } from "@/lib/events/types";
export default function AccountShell({
  eventId,
  next,
  wedding,
  googleEnabled,
  admin = false,
  children,
  active = admin ? "admin" : "affiliates",
}: {
  eventId?: string;
  next?: string;
  wedding: boolean;
  googleEnabled: boolean;
  admin?: boolean;
  children: (
    user: User,
    update: (user: User) => void,
    signOut: () => Promise<void>,
  ) => ReactNode;
  active?:
    | "admin"
    | "profile"
    | "affiliates"
    | "support"
    | "guests"
    | "tables"
    | "gifts";
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
    <main
      className={`office ${user ? "workspace" : ""} ${wedding ? "office-wedding" : "office-general"}`}
    >
      {user ? (
        <WorkspaceSidebar
          wedding={wedding}
          user={user}
          active={active}
          eventId={eventId}
        />
      ) : (
        <StudioHeader wedding={wedding} />
      )}
      <div className={user ? "workspace-content" : ""}>
        {loading ? (
          <p className="account-loading">Cargando tu cuenta…</p>
        ) : !user ? (
          <AuthPanel
            wedding={wedding}
            googleEnabled={googleEnabled}
            busy={busy}
            error={error}
            googleNext={next || `/${active}`}
            onClearError={() => setError("")}
            onSignIn={async (fields, mode) => {
              setBusy(true);
              try {
                const result = await api<{ user: User }>(
                  "/api/session",
                  "POST",
                  {
                    ...fields,
                    action: mode,
                    role: wedding ? "planner" : "organizer",
                  },
                );
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
          children(user, setUser, async () => {
            await api("/api/session", "DELETE");
            setUser(null);
          })
        )}
        {user && <ProductAlternative wedding={wedding} footer />}
      </div>
    </main>
  );
}
