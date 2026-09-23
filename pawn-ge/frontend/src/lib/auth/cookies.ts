import { cookies } from "next/headers";

const ACCESS_COOKIE = "pawn_access_token";
const REFRESH_COOKIE = "pawn_refresh_token";
const MAX_AGE = 60 * 60 * 24; // 24h — backend tokens are short-lived; client refreshes silently.

/** Mirror JWT tokens into httpOnly cookies so server components / actions can use them. */
export async function setSessionCookies(access: string, refresh: string) {
  const store = await cookies();
  store.set(ACCESS_COOKIE, access, { httpOnly: true, sameSite: "lax", path: "/", maxAge: MAX_AGE });
  store.set(REFRESH_COOKIE, refresh, { httpOnly: true, sameSite: "lax", path: "/", maxAge: MAX_AGE });
}

export async function clearSessionCookies() {
  const store = await cookies();
  store.delete(ACCESS_COOKIE);
  store.delete(REFRESH_COOKIE);
}

export const SESSION_COOKIES = { ACCESS_COOKIE, REFRESH_COOKIE };
