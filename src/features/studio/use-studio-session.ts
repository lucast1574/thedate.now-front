"use client";
import { useTranslator } from "@/lib/i18n/react";

import { useEffect, useState } from "react";
import { api } from "@/lib/api/client";
import type { AccountFields, AuthMode, Kind, User } from "@/lib/events/types";
export function useStudioSession(
  _portal: Kind,
  _onError: (message: string) => void,
) {
  const i18n = useTranslator();

  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  useEffect(() => {
    let active = true;
    api<User>("/api/session", undefined, undefined, i18n)
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
  }, [i18n]);
  async function signIn(fields: AccountFields, mode: AuthMode) {
    const result = await api<{ user: User }>(
      "/api/session",
      "POST",
      {
        ...fields,
        role: "user",
        action: mode,
      },
      i18n,
    );
    setUser(result.user);
    return result.user;
  }
  async function signOut() {
    await api("/api/session", "DELETE", undefined, i18n);
    setUser(null);
  }
  return { user, setUser, loading, signIn, signOut };
}
