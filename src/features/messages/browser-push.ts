import { getApps, initializeApp } from "@firebase/app";
import {
  getMessaging,
  isSupported,
  onMessage,
  onRegistered,
  register,
} from "@firebase/messaging";
import { api } from "@/lib/api/client";
import type { WebPushConfig } from "@/lib/firebase/web-config";
import { refreshInboxStatus } from "./inbox-updates";

const accountKey = "thedate:web-push-account";
const installationKey = "thedate:web-push-installation";
let pending: { userId: string; operation: Promise<void> } | undefined;
let stopMessages: (() => void) | undefined;

export function pushAvailable() {
  return (
    typeof window !== "undefined" &&
    "Notification" in window &&
    "serviceWorker" in navigator &&
    "PushManager" in window
  );
}

export function browserPushEnabled(userId: string) {
  return (
    pushAvailable() &&
    Notification.permission === "granted" &&
    localStorage.getItem(accountKey) === userId
  );
}

export async function connectBrowserPush(
  userId: string,
  wedding: boolean,
): Promise<void> {
  if (pending && pending.userId !== userId) {
    await pending.operation.catch(() => {});
    return connectBrowserPush(userId, wedding);
  }
  pending ??= {
    userId,
    operation: connect(userId, wedding).finally(() => {
      pending = undefined;
    }),
  };
  return pending.operation;
}

async function connect(userId: string, wedding: boolean) {
  if (!(await isSupported())) throw new Error("Web push unavailable");
  const { vapidKey, ...config } = await api<WebPushConfig>(
    "/api/browser-push-config",
  );
  const name = "studio-push";
  const app =
    getApps().find((candidate) => candidate.name === name) ??
    initializeApp(config, name);
  const messaging = getMessaging(app);
  await navigator.serviceWorker.register("/firebase-messaging-sw.js");
  const worker = await navigator.serviceWorker.ready;
  const installationId =
    localStorage.getItem(installationKey) ?? crypto.randomUUID();
  localStorage.setItem(installationKey, installationId);
  let fid = "";
  const stop = onRegistered(messaging, (value) => {
    fid = value;
  });
  try {
    await register(messaging, { vapidKey, serviceWorkerRegistration: worker });
  } finally {
    stop();
  }
  if (!fid) throw new Error("Firebase registration unavailable");
  await api("/api/backend/devices", "POST", {
    installationId,
    fid,
    platform: "web",
    userId,
  });
  localStorage.setItem(accountKey, userId);

  stopMessages?.();
  stopMessages = onMessage(messaging, (payload) => {
    refreshInboxStatus();
    const eventId = payload.data?.eventId;
    if (payload.data?.screen !== "messages" || !eventId || document.hidden)
      return;
    const path = `/manager/${encodeURIComponent(eventId)}`;
    const viewingInbox =
      location.pathname === path &&
      new URLSearchParams(location.search).get("tab") === "messages";
    if (!viewingInbox) {
      // FCM displays background alerts. Keep the same click behavior in foreground.
      void worker
        .showNotification(payload.notification?.title || "Nuevo mensaje", {
          body: payload.notification?.body,
          tag: `messages-${eventId}`,
          icon: wedding ? "/wedding-icon.png" : "/event-icon.png",
          data: { studioPath: `${path}?tab=messages` },
        })
        .catch(() => {});
    }
  });
}
