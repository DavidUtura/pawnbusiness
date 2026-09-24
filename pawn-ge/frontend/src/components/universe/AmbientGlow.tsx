"use client";

/**
 * AmbientGlow — large, very low-opacity radial gradients that give the cosmic
 * environment atmospheric light and subtly differentiate vertical regions of
 * the page without breaking the single-universe visual language.
 *
 * PERFORMANCE: previously each pool used a live filter: blur(60–80px) over
 * half-viewport-sized areas. A radial gradient is already soft, so the blur was
 * visually redundant but forced expensive one-time (and on resize/scroll,
 * repeated) rasterization of enormous blurred layers. The blurs are removed;
 * the gradient stops are widened to match the previous falloff.
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
          background: "radial-gradient(closest-side, rgba(91,140,255,0.08), rgba(91,140,255,0.03) 55%, transparent 78%)",
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
          background: "radial-gradient(closest-side, rgba(139,108,255,0.065), rgba(139,108,255,0.025) 55%, transparent 78%)",
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
          background: "radial-gradient(closest-side, rgba(95,212,255,0.045), rgba(95,212,255,0.018) 55%, transparent 78%)",
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
          background: "radial-gradient(closest-side, rgba(255,95,162,0.032), rgba(255,95,162,0.014) 55%, transparent 78%)",
        }}
      />
    </div>
  );
}
