import "server-only";
import { cookies } from "next/headers";
export const SESSION_COOKIE = "thedate_session";
export const sessionOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
  maxAge: 60 * 60 * 24,
};
export async function sessionToken() {
  return (await cookies()).get(SESSION_COOKIE)?.value;
}
export async function setSession(token: string) {
  (await cookies()).set(SESSION_COOKIE, token, sessionOptions);
}
export async function clearSession() {
  (await cookies()).delete(SESSION_COOKIE);
}
