"use client";
import { useEffect, useState } from "react";
import { api } from "@/lib/api/client";
import type { AccountFields, AuthMode, Kind, User } from "@/lib/events/types";
export function useStudioSession(
  portal: Kind,
  _onError: (message: string) => void,
) {
  const [user, setUser] = useState<User | null>(null);
  useEffect(() => {
    let active = true;
    api<User>("/api/session")
      .then((u) => {
        if (active) setUser(u);
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);
  async function signIn(fields: AccountFields, mode: AuthMode) {
    const result = await api<{ user: User }>("/api/session", "POST", {
      ...fields,
      role: portal === "wedding" ? "planner" : "organizer",
      action: mode,
    });
    setUser(result.user);
    return result.user;
  }
  async function signOut() {
    await api("/api/session", "DELETE");
    setUser(null);
  }
  return { user, signIn, signOut };
}
