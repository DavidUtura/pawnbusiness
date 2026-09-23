"use server";

import { setSessionCookies } from "@/lib/auth/cookies";
import { config } from "@/lib/api/server";

export type LoginResult =
  | { ok: true; role: string }
  | { ok: false; error: string };

/**
 * Server-side login: calls the auth API and mirrors tokens into httpOnly
 * cookies (used by server components / actions) while returning the tokens
 * so the client can keep its localStorage session store in sync.
 */
export async function loginAction(
  email: string,
  password: string,
): Promise<LoginResult & { accessToken?: string; refreshToken?: string }> {
  try {
    const res = await fetch(`${config.api.baseUrl}/api/v1/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
      cache: "no-store",
    });
    if (!res.ok) {
      const body = await res.json().catch(() => null);
      return { ok: false, error: body?.error ?? "Sign in failed." };
    }
    const data = await res.json();
    await setSessionCookies(data.accessToken, data.refreshToken);
    return {
      ok: true,
      role: data.role,
      accessToken: data.accessToken,
      refreshToken: data.refreshToken,
    };
  } catch {
    return { ok: false, error: "Backend unavailable." };
  }
}
