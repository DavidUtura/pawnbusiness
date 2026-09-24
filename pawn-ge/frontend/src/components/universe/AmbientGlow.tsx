"use client";

/**
 * AmbientGlow — large, very low-opacity radial gradients that give the cosmic
 * environment atmospheric light and subtly differentiate vertical regions of
 * the page without breaking the single-universe visual language.
 */
export default function AmbientGlow() {
  return (
    <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
      {/* Upper atmosphere — indigo lift behind the hero */}
      <div
        className="absolute rounded-full"
        style={{
          width: "70vw",
          height: "55vh",
          left: "15%",
          top: "-20%",
          background: "radial-gradient(closest-side, rgba(91,140,255,0.10), transparent 70%)",
          filter: "blur(60px)",
          opacity: 0.8,
        }}
      />
      {/* Violet pool — mid page warmth */}
      <div
        className="absolute rounded-full"
        style={{
          width: "55vw",
          height: "45vh",
          right: "-12%",
          top: "35%",
          background: "radial-gradient(closest-side, rgba(139,108,255,0.08), transparent 70%)",
          filter: "blur(70px)",
        }}
      />
      {/* Cyan whisper — lower left */}
      <div
        className="absolute rounded-full"
        style={{
          width: "45vw",
          height: "40vh",
          left: "-10%",
          bottom: "-8%",
          background: "radial-gradient(closest-side, rgba(95,212,255,0.05), transparent 70%)",
          filter: "blur(70px)",
        }}
      />
      {/* Magenta hint near footer depth — extremely subtle */}
      <div
        className="absolute rounded-full"
        style={{
          width: "40vw",
          height: "30vh",
          right: "10%",
          bottom: "-6%",
          background: "radial-gradient(closest-side, rgba(255,95,162,0.035), transparent 70%)",
          filter: "blur(80px)",
        }}
      />
    </div>
  );
}
