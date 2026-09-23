import { getAccessToken, setTokens, clearTokens } from "@/lib/auth/session";

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080";

async function request<T>(
  path: string,
  options: RequestInit = {},
  retry = true
): Promise<T> {
  const token = getAccessToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });

  if (res.status === 401 && retry) {
    // Attempt one silent refresh then retry.
    const refreshed = await tryRefresh();
    if (refreshed) return request<T>(path, options, false);
    clearTokens();
  }
  if (res.status === 204) return undefined as T;
  if (!res.ok) {
    const body = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(body.error ?? `Request failed (${res.status})`);
  }
  return res.json();
}

async function tryRefresh(): Promise<boolean> {
  try {
    const refreshToken =
      typeof window !== "undefined"
        ? window.localStorage.getItem("pawn_refresh_token")
        : null;
    if (!refreshToken) return false;
    const res = await fetch(`${API_BASE}/api/v1/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    });
    if (!res.ok) return false;
    const data = await res.json();
    setTokens(data.accessToken, data.refreshToken);
    return true;
  } catch {
    return false;
  }
}

export const api = {
  login: (email: string, password: string) =>
    request<{ accessToken: string; refreshToken: string; role: string; lombardId: number | null }>(
      "/api/v1/auth/login",
      { method: "POST", body: JSON.stringify({ email, password }) }
    ),

  register: (payload: {
    email: string;
    password: string;
    firstName: string;
    lastName?: string;
    phoneNumber: string;
  }) =>
    request<{ accessToken: string; refreshToken: string; role: string }>(
      "/api/v1/auth/register",
      { method: "POST", body: JSON.stringify(payload) }
    ),

  me: () => request<import("@/lib/auth/session").SessionUser>("/api/v1/auth/me"),

  logout: () =>
    request<void>("/api/v1/auth/logout", { method: "POST" }).finally(clearTokens),

  submitPartnerApplication: (payload: unknown) =>
    request("/api/v1/partner/applications", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  getMyApplication: () => request("/api/v1/partner/application"),
};
