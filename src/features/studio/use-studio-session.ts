"use client";
import { useEffect, useState } from "react";
import { api } from "@/lib/api/client";
import { studioURL } from "@/lib/events/domains";
import type { AccountFields, AuthMode, Kind, User } from "@/lib/events/types";

function belongsToPortal(user: User, portal: Kind) {
  if (user.portals?.includes(portal)) return true;
  return portal === "wedding"
    ? user.role !== "organizer"
    : user.role === "organizer" || user.role === "admin";
}

export function useStudioSession(
  portal: Kind,
  onError: (message: string) => void,
) {
  const [user, setUser] = useState<User | null>(null);
  const otherPortal = studioURL(portal === "wedding" ? "general" : "wedding");
  useEffect(() => {
    let active = true;
    api<User>("/api/session")
      .then(async (current) => {
        if (!active) return;
        if (belongsToPortal(current, portal)) setUser(current);
        else {
          await api("/api/session", "DELETE");
          if (active)
            onError(
              `Esta cuenta pertenece al otro espacio. Entra desde ${otherPortal}.`,
            );
        }
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, [portal, otherPortal, onError]);

  async function signIn(fields: AccountFields, mode: AuthMode) {
    const result = await api<{ user: User }>("/api/session", "POST", {
      ...fields,
      role: portal === "wedding" ? "planner" : "organizer",
      action: mode,
    });
    if (!belongsToPortal(result.user, portal)) {
      await api("/api/session", "DELETE");
      throw new Error(
        `Esta cuenta pertenece al otro espacio. Entra desde ${otherPortal}.`,
      );
    }
    setUser(result.user);
    return result.user;
  }
  async function signOut() {
    await api("/api/session", "DELETE");
    setUser(null);
  }
  return { user, signIn, signOut };
}
