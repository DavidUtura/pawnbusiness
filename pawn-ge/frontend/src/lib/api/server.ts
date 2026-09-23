export const config = {
  api: {
    baseUrl: process.env.API_URL ?? "http://localhost:8080",
  },
};

/** Server-side fetch with the request's Authorization header forwarded. */
async function serverFetch<T>(path: string, headers: Headers, init: RequestInit = {}): Promise<Response> {
  const auth = headers.get("authorization");
  return fetch(`${config.api.baseUrl}${path}`, {
    ...init,
    cache: "no-store",
    headers: {
      "Content-Type": "application/json",
      ...(auth ? { Authorization: auth } : {}),
    },
  });
}

export async function fetchMe(headers: Headers): Promise<{
  id: number; email: string; firstName: string; lastName?: string;
  role: string; lombardId?: number | null; applicationStatus?: string | null;
} | null> {
  try {
    const res = await serverFetch("/api/v1/auth/me", headers);
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

export { serverFetch };
