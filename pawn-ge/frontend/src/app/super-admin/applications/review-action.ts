"use server";

import { cookies } from "next/headers";
import { config } from "@/lib/api/server";

type ActionResult = { ok: true } | { ok: false; error: string };

/**
 * Server Action used by ReviewButtons. Forwards the caller's bearer token
 * (cookie set at login) to the Super Admin review endpoint. The backend
 * remains the authoritative security boundary (SUPER_ADMIN only).
 */
export async function reviewApplication(
  id: number,
  decision: "APPROVED" | "REJECTED",
): Promise<ActionResult> {
  const store = await cookies();
  const token = store.get("pawn_access_token")?.value;
  if (!token) return { ok: false, error: "Not signed in." };

  try {
    const res = await fetch(
      `${config.api.baseUrl}/api/v1/super-admin/applications/${id}/review`,
      {
        method: "POST",
        cache: "no-store",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ decision }),
      },
    );
    if (!res.ok) {
      const body = await res.json().catch(() => null);
      return {
        ok: false,
        error: body?.error ?? `Request failed (${res.status}).`,
      };
    }
    return { ok: true };
  } catch {
    return { ok: false, error: "Backend unavailable." };
  }
}
