"use client";

import { useState } from "react";
import Link from "next/link";
import { api } from "@/lib/api/client";

type ApplicationStatus =
  | "DRAFT"
  | "PENDING"
  | "MORE_INFORMATION_REQUIRED"
  | "APPROVED"
  | "REJECTED";

const categories = [
  "iPhone",
  "Samsung",
  "MacBook",
  "Laptop",
  "PlayStation",
  "Apple Watch",
  "Camera",
  "Other",
];

const steps = ["Account", "Business", "Review"];

export default function PartnerRegisterPage() {
  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [status] = useState<ApplicationStatus>("PENDING");
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    displayName: "",
    legalName: "",
    taxId: "",
    contactName: "",
    website: "",
    branchCount: "1",
    address: "",
    workingHours: "",
    delivery: false,
    pickup: true,
    selectedCategories: [] as string[],
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const update = (key: keyof typeof form, value: string | boolean) =>
    setForm((f) => ({ ...f, [key]: value }));

  const toggleCategory = (cat: string) =>
    setForm((f) => ({
      ...f,
      selectedCategories: f.selectedCategories.includes(cat)
        ? f.selectedCategories.filter((c) => c !== cat)
        : [...f.selectedCategories, cat],
    }));

  const validateStep = (): boolean => {
    const e: Record<string, string> = {};
    if (step === 0) {
      if (!form.firstName.trim()) e.firstName = "First name is required";
      if (!form.email.trim() || !/^\S+@\S+\.\S+$/.test(form.email))
        e.email = "Valid email is required";
      if (!form.phone.trim()) e.phone = "Phone is required";
      if (form.password.length < 8)
        e.password = "Password must be at least 8 characters";
      if (form.password !== form.confirmPassword)
        e.confirmPassword = "Passwords do not match";
    }
    if (step === 1) {
      if (!form.displayName.trim())
        e.displayName = "Display name is required";
      if (!form.legalName.trim()) e.legalName = "Legal name is required";
      if (!form.address.trim()) e.address = "Address is required";
      if (form.selectedCategories.length === 0)
        e.categories = "Select at least one product category";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const next = () => {
    if (!validateStep()) return;
    setStep((s) => Math.min(s + 1, steps.length - 1));
  };
  const back = () => setStep((s) => Math.max(s - 1, 0));

  const submit = async () => {
    if (!validateStep()) return;
    setSubmitting(true);
    setSubmitError(null);
    try {
      // Step 1 — create the partner account (CUSTOMER role, no seller privileges yet).
      await api.register({
        firstName: form.firstName,
        lastName: form.lastName || undefined,
        email: form.email,
        phoneNumber: form.phone,
        password: form.password,
      });
      // Step 2 — sign in so the application is tied to an authenticated identity.
      await api.login(form.email, form.password);
      // Step 3 — submit the Lombard application against the real backend.
      await api.submitPartnerApplication({
        displayName: form.displayName,
        legalName: form.legalName,
        taxId: form.taxId || null,
        contactName: form.contactName || `${form.firstName} ${form.lastName}`.trim(),
        phone: form.phone,
        email: form.email,
        website: form.website || null,
        branchCount: Number(form.branchCount) || 1,
        categories: form.selectedCategories,
        address: form.address,
        workingHours: form.workingHours || null,
        deliveryAvailable: form.delivery,
        pickupAvailable: form.pickup,
      });
      setSubmitted(true);
    } catch (err) {
      setSubmitError(
        err instanceof Error ? err.message : "Submission failed. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const inputCls =
    "w-full rounded-xl bg-white/[.045] border border-white/10 px-4 py-3 text-[#F5F7FA] placeholder-[#7F8999] outline-none focus:border-[#5B8CFF]/60 focus:shadow-[0_0_0_3px_rgba(91,140,255,.12)] transition";
  const labelCls = "block text-xs font-medium uppercase tracking-wider text-[#7F8999] mb-1.5";

  if (submitted) {
    return (
      <main className="relative min-h-screen text-[#F5F7FA]">
        <div className="relative z-10 max-w-xl mx-auto px-6 pt-40 pb-32 text-center">
          <div
            className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-6"
            style={{ background: "linear-gradient(135deg,#5B8CFF,#8B6CFF)" }}
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold mb-3">Application submitted</h1>
          <p className="text-[#C7CED9] mb-2">
            Your partner application status is{" "}
            <span className="font-semibold text-[#5B8CFF]">
              {status.replace(/_/g, " ")}
            </span>
            .
          </p>
          <p className="text-sm text-[#7F8999] mb-8">
            Our verification team will review your submission. You will receive
            Lombard Admin access only after approval. Seller privileges are not
            granted before verification.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium border border-white/10 hover:border-[#5B8CFF]/50 transition"
          >
            Return to marketplace
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="relative min-h-screen text-[#F5F7FA]">
      <div className="relative z-10 max-w-2xl mx-auto px-6 pt-32 pb-24">
        <div className="text-center mb-10">
          <p className="text-xs uppercase tracking-[0.24em] text-[#8B6CFF] mb-3">
            Pawn.ge Partner Program
          </p>
          <h1 className="text-4xl font-bold mb-3">Become a Lombard Partner</h1>
          <p className="text-[#C7CED9]">
            Join the product universe. List your inventory, reach buyers across
            Georgia and measure sales generated through Pawn.ge.
          </p>
        </div>

        {/* Stepper */}
        <ol className="flex items-center justify-center gap-4 mb-10" aria-label="Progress">
          {steps.map((label, i) => (
            <li key={label} className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => i < step && setStep(i)}
                className={`flex items-center gap-2 text-sm ${
                  i === step
                    ? "text-white"
                    : i < step
                    ? "text-[#5B8CFF]"
                    : "text-[#7F8999]"
                }`}
                aria-current={i === step ? "step" : undefined}
              >
                <span
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs border ${
                    i <= step
                      ? "border-transparent text-white"
                      : "border-white/15"
                  }`}
                  style={
                    i <= step
                      ? { background: "linear-gradient(135deg,#5B8CFF,#8B6CFF)" }
                      : undefined
                  }
                >
                  {i + 1}
                </span>
                {label}
              </button>
              {i < steps.length - 1 && (
                <span className="w-10 h-px bg-white/10 hidden sm:block" />
              )}
            </li>
          ))}
        </ol>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (step < steps.length - 1) next();
            else submit();
          }}
          className="rounded-3xl border border-white/[.08] p-6 sm:p-8"
          style={{
            background: "rgba(9,13,23,.72)",
            backdropFilter: "blur(24px)",
          }}
          noValidate
        >
          {step === 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>First name *</label>
                <input className={inputCls} value={form.firstName} onChange={(e) => update("firstName", e.target.value)} autoComplete="given-name" />
                {errors.firstName && <p className="text-xs text-[#FF7B8A] mt-1">{errors.firstName}</p>}
              </div>
              <div>
                <label className={labelCls}>Last name</label>
                <input className={inputCls} value={form.lastName} onChange={(e) => update("lastName", e.target.value)} autoComplete="family-name" />
              </div>
              <div className="sm:col-span-2">
                <label className={labelCls}>Email *</label>
                <input type="email" className={inputCls} value={form.email} onChange={(e) => update("email", e.target.value)} autoComplete="email" />
                {errors.email && <p className="text-xs text-[#FF7B8A] mt-1">{errors.email}</p>}
              </div>
              <div>
                <label className={labelCls}>Phone *</label>
                <input type="tel" className={inputCls} value={form.phone} onChange={(e) => update("phone", e.target.value)} autoComplete="tel" />
                {errors.phone && <p className="text-xs text-[#FF7B8A] mt-1">{errors.phone}</p>}
              </div>
              <div>
                <label className={labelCls}>Branches</label>
                <select className={inputCls} value={form.branchCount} onChange={(e) => update("branchCount", e.target.value)}>
                  {[1, 2, 3, 4, 5].map((n) => (
                    <option key={n} value={n} className="bg-[#0A1020]">{n}{n === 5 ? "+" : ""}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelCls}>Password *</label>
                <input type="password" className={inputCls} value={form.password} onChange={(e) => update("password", e.target.value)} autoComplete="new-password" />
                {errors.password && <p className="text-xs text-[#FF7B8A] mt-1">{errors.password}</p>}
              </div>
              <div>
                <label className={labelCls}>Confirm password *</label>
                <input type="password" className={inputCls} value={form.confirmPassword} onChange={(e) => update("confirmPassword", e.target.value)} autoComplete="new-password" />
                {errors.confirmPassword && <p className="text-xs text-[#FF7B8A] mt-1">{errors.confirmPassword}</p>}
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Business / display name *</label>
                <input className={inputCls} value={form.displayName} onChange={(e) => update("displayName", e.target.value)} placeholder="e.g. Liberty Pawn" />
                {errors.displayName && <p className="text-xs text-[#FF7B8A] mt-1">{errors.displayName}</p>}
              </div>
              <div>
                <label className={labelCls}>Legal name *</label>
                <input className={inputCls} value={form.legalName} onChange={(e) => update("legalName", e.target.value)} />
                {errors.legalName && <p className="text-xs text-[#FF7B8A] mt-1">{errors.legalName}</p>}
              </div>
              <div>
                <label className={labelCls}>Identification / tax ID</label>
                <input className={inputCls} value={form.taxId} onChange={(e) => update("taxId", e.target.value)} />
              </div>
              <div>
                <label className={labelCls}>Primary contact person</label>
                <input className={inputCls} value={form.contactName} onChange={(e) => update("contactName", e.target.value)} />
              </div>
              <div className="sm:col-span-2">
                <label className={labelCls}>Website / social link</label>
                <input className={inputCls} value={form.website} onChange={(e) => update("website", e.target.value)} />
              </div>
              <div className="sm:col-span-2">
                <label className={labelCls}>Address *</label>
                <input className={inputCls} value={form.address} onChange={(e) => update("address", e.target.value)} placeholder="City, street, number" />
                {errors.address && <p className="text-xs text-[#FF7B8A] mt-1">{errors.address}</p>}
              </div>
              <div className="sm:col-span-2">
                <label className={labelCls}>Working hours</label>
                <input className={inputCls} value={form.workingHours} onChange={(e) => update("workingHours", e.target.value)} placeholder="Mon–Sat 10:00–20:00" />
              </div>
              <div className="sm:col-span-2">
                <span className={labelCls}>Product categories *</span>
                <div className="flex flex-wrap gap-2">
                  {categories.map((cat) => {
                    const active = form.selectedCategories.includes(cat);
                    return (
                      <button
                        type="button"
                        key={cat}
                        onClick={() => toggleCategory(cat)}
                        aria-pressed={active}
                        className={`px-3 py-1.5 rounded-full text-sm border transition ${
                          active
                            ? "border-transparent text-white"
                            : "border-white/10 text-[#C7CED9] hover:border-[#5B8CFF]/40"
                        }`}
                        style={active ? { background: "linear-gradient(135deg,#5B8CFF,#8B6CFF)" } : undefined}
                      >
                        {cat}
                      </button>
                    );
                  })}
                </div>
                {errors.categories && <p className="text-xs text-[#FF7B8A] mt-1">{errors.categories}</p>}
              </div>
              <label className="flex items-center gap-2 text-sm text-[#C7CED9]">
                <input type="checkbox" checked={form.pickup} onChange={(e) => update("pickup", e.target.checked)} className="accent-[#5B8CFF]" />
                Pickup available
              </label>
              <label className="flex items-center gap-2 text-sm text-[#C7CED9]">
                <input type="checkbox" checked={form.delivery} onChange={(e) => update("delivery", e.target.checked)} className="accent-[#5B8CFF]" />
                Delivery available
              </label>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-5">
              <h2 className="text-lg font-semibold">Review your application</h2>
              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3 text-sm">
                {[
                  ["Applicant", `${form.firstName} ${form.lastName}`.trim() || "—"],
                  ["Email", form.email || "—"],
                  ["Phone", form.phone || "—"],
                  ["Business", form.displayName || "—"],
                  ["Legal name", form.legalName || "—"],
                  ["Address", form.address || "—"],
                  ["Categories", form.selectedCategories.join(", ") || "—"],
                  ["Services", [form.pickup && "Pickup", form.delivery && "Delivery"].filter(Boolean).join(", ") || "—"],
                ].map(([k, v]) => (
                  <div key={k as string}>
                    <dt className="text-[#7F8999] text-xs uppercase tracking-wider">{k}</dt>
                    <dd className="text-[#F5F7FA] mt-0.5">{v}</dd>
                  </div>
                ))}
              </dl>
              <p className="text-xs text-[#7F8999] leading-relaxed">
                After submission your application enters PENDING_VERIFICATION
                status. A platform administrator reviews verification data
                before Lombard Admin access is granted. This information is
                used solely for marketplace trust and legal compliance.
              </p>
              {submitError && (
                <div
                  role="alert"
                  className="rounded-xl border border-[#FF7B8A]/30 bg-[#FF7B8A]/10 px-4 py-3 text-sm text-[#FFB4BF]"
                >
                  {submitError}
                </div>
              )}
            </div>
          )}

          <div className="flex items-center justify-between mt-8 pt-6 border-t border-white/[.07]">
            {step > 0 ? (
              <button type="button" onClick={back} className="px-4 py-2 text-sm text-[#C7CED9] hover:text-white transition">
                ← Back
              </button>
            ) : (
              <span />
            )}
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white transition-transform hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0"
              style={{
                background: "linear-gradient(135deg,#5B8CFF,#8B6CFF)",
                boxShadow: "0 8px 30px rgba(91,140,255,.18)",
              }}
            >
              {submitting
                ? "Submitting…"
                : step < steps.length - 1
                  ? "Continue"
                  : "Submit application"}
            </button>
          </div>
        </form>

        <p className="text-center text-xs text-[#7F8999] mt-6">
          Already a partner?{" "}
          <Link href="/login" className="text-[#5B8CFF] hover:underline">Sign in</Link>
          {" · "}
          <Link href="/" className="text-[#5B8CFF] hover:underline">Back to marketplace</Link>
        </p>
      </div>
    </main>
  );
}
