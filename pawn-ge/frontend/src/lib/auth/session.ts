// Minimal client-side token store for the Pawn.ge SPA areas.
// The real authorization decisions are enforced server-side (Spring Security);
// this only supports UX (route hiding / header links).

export type SessionUser = {
  id: number;
  email: string;
  firstName: string;
  lastName?: string;
  role: "CUSTOMER" | "LOMBARD_ADMIN" | "LOMBARD_EMPLOYEE" | "SUPER_ADMIN";
  lombardId?: number | null;
  applicationStatus?: string | null;
};

const TOKEN_KEY = "pawn_access_token";
const REFRESH_KEY = "pawn_refresh_token";

export function getAccessToken(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(TOKEN_KEY);
}

export function getRefreshToken(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(REFRESH_KEY);
}

export function setTokens(access: string, refresh: string) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(TOKEN_KEY, access);
  window.localStorage.setItem(REFRESH_KEY, refresh);
}

export function clearTokens() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(TOKEN_KEY);
  window.localStorage.removeItem(REFRESH_KEY);
}

/** Decode JWT payload without verification (UI hints only). */
export function decodeRole(token: string | null): string | null {
  if (!token) return null;
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.role ?? null;
  } catch {
    return null;
  }
}

export function isAdminSession(): boolean {
  const role = decodeRole(getAccessToken());
  return role === "LOMBARD_ADMIN" || role === "LOMBARD_EMPLOYEE" || role === "SUPER_ADMIN";
}
