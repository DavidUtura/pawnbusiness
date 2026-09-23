import Link from "next/link";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { fetchMe } from "@/lib/api/server";
import ReviewButtons from "./review-buttons";

/**
 * Super Admin — Partner Applications review area.
 * Server-side role check: only SUPER_ADMIN may view. (The API remains the
 * authoritative security boundary; this is early rejection for UX.)
 */
export default async function SuperAdminApplicationsPage() {
  const h = await headers();
  const me = await fetchMe(h);
  if (!me) redirect("/login");
  if (me.role !== "SUPER_ADMIN") redirect("/");

  let applications: Array<{
    id: number; status: string; displayName: string; legalName: string;
    contactName: string; phone: string; email: string; address: string;
    categories: string[]; submittedAt: string | null; reviewNotes: string | null;
  }> = [];
  try {
    const res = await fetch(`http://localhost:8080/api/v1/super-admin/applications`, {
      headers: { Authorization: h.get("authorization") ?? "" },
      cache: "no-store",
    });
    if (res.ok) applications = await res.json();
  } catch {
    // backend offline → render empty state
  }

  return (
    <main className="min-h-screen bg-[#04060A] text-[#F5F7FA]">
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[.2em] text-[#8B6CFF]">Super Admin</p>
            <h1 className="mt-1 text-2xl font-bold">Partner Applications</h1>
          </div>
          <Link href="/" className="text-sm text-[#7F8999] hover:text-white">← Back to marketplace</Link>
        </div>

        <div className="mt-8 rounded-2xl border border-white/[.08] bg-white/[.03] overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[#7F8999] border-b border-white/[.07]">
                <th className="px-5 py-3 font-medium">Lombard</th>
                <th className="px-5 py-3 font-medium">Contact</th>
                <th className="px-5 py-3 font-medium">Categories</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {applications.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-5 py-10 text-center text-[#7F8999]">
                    No applications yet.
                  </td>
                </tr>
              )}
              {applications.map((app) => (
                <tr key={app.id} className="border-b border-white/[.05] last:border-0">
                  <td className="px-5 py-4">
                    <div className="font-semibold">{app.displayName}</div>
                    <div className="text-xs text-[#7F8999]">{app.legalName} · {app.address}</div>
                  </td>
                  <td className="px-5 py-4 text-[#C7CED9]">
                    {app.contactName}<br />
                    <span className="text-xs text-[#7F8999]">{app.phone}</span>
                  </td>
                  <td className="px-5 py-4 text-[#C7CED9]">{app.categories?.join(", ")}</td>
                  <td className="px-5 py-4">
                    <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium ${
                      app.status === "APPROVED" ? "bg-[#5B8CFF]/15 text-[#BBD7FF]"
                      : app.status === "REJECTED" ? "bg-red-500/10 text-red-300"
                      : "bg-[#8B6CFF]/15 text-[#B9A7FF]"
                    }`}>{app.status}</span>
                  </td>
                  <td className="px-5 py-4">
                    <ReviewButtons id={app.id} disabled={app.status === "APPROVED" || app.status === "REJECTED"} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
