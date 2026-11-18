import "server-only";
import { backendFetch, bearer } from "@/lib/api/server";
import { sessionToken } from "@/lib/auth/session";

function webPushConfig() {
  const apiKey = process.env.FIREBASE_WEB_API_KEY;
  const appId = process.env.FIREBASE_WEB_APP_ID;
  const messagingSenderId = process.env.FIREBASE_WEB_SENDER_ID;
  const projectId = process.env.FIREBASE_WEB_PROJECT_ID;
  const vapidKey = process.env.FIREBASE_WEB_VAPID_KEY;
  if (!apiKey || !appId || !messagingSenderId || !projectId || !vapidKey)
    return null;
  return { apiKey, appId, messagingSenderId, projectId, vapidKey };
}

export type WebPushConfig = NonNullable<ReturnType<typeof webPushConfig>>;

export async function authorizedWebPushConfig() {
  const token = await sessionToken();
  if (!token) return { status: 401 } as const;
  const account = await backendFetch("auth/me", { headers: bearer(token) });
  if (!account?.ok) return { status: account?.status === 401 ? 401 : 503 };
  const config = webPushConfig();
  if (!config) return { status: 503 } as const;
  return { config, status: 200 } as const;
}
