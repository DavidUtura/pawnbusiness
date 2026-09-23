"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { reviewApplication } from "./review-action";

/**
 * Client-side review actions for partner applications.
 * Calls the backend POST /api/v1/super-admin/applications/{id}/review
 * through a server action that forwards the httpOnly session cookie token.
 * The Spring Security layer remains the authoritative authorization boundary.
 */
export default function ReviewButtons({ id, disabled }: { id: number; disabled?: boolean }) {
  const router = useRouter();
  const [busy, setBusy] = useState<null | "approve" | "reject">(null);
  const [error, setError] = useState<string | null>(null);

  async function act(kind: "approve" | "reject") {
    if (disabled || busy) return;
    setBusy(kind);
    setError(null);
    try {
      const result = await reviewApplication(id, kind === "approve" ? "APPROVED" : "REJECTED");
      if (!result.ok) throw new Error(result.error);
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setBusy(null);
    }
  }

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => act("approve")}
          disabled={disabled || busy !== null}
          className="rounded-lg border border-[#5B8CFF]/30 bg-[#5B8CFF]/10 px-3 py-1.5 text-xs font-medium text-[#BBD7FF] transition hover:bg-[#5B8CFF]/20 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {busy === "approve" ? "Approving…" : "Approve"}
        </button>
        <button
          type="button"
          onClick={() => act("reject")}
          disabled={disabled || busy !== null}
          className="rounded-lg border border-red-400/25 bg-red-500/10 px-3 py-1.5 text-xs font-medium text-red-300 transition hover:bg-red-500/20 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {busy === "reject" ? "Rejecting…" : "Reject"}
        </button>
      </div>
      {error && <span className="text-[11px] text-red-400">{error}</span>}
    </div>
  );
}
