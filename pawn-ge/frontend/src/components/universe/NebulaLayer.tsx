import { universeColors } from "./universe.config";

/**
 * NebulaLayer — static atmospheric clouds.
 *
 * PERFORMANCE: these are huge blur(80–120px) layers. Animating their transform
 * forced the browser to re-rasterize multi-hundred-pixel blurs across ~half the
 * viewport every single frame — a major CPU sink. They now render once as
 * static gradients (visually near-identical at 5–8% opacity) and use pre-blurred
 * radial-gradient falloffs instead of live CSS blur filters, so the compositor
 * never has to rasterize a blur at all.
 */
export default function NebulaLayer() {
  return (
    <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
      {/* Nebula cloud 1 - blue */}
      <div
        className="absolute rounded-full"
        style={{
          width: "50vw",
          height: "35vw",
          left: "-10%",
          top: "10%",
          background: `radial-gradient(closest-side, ${universeColors.electricBlue}12, ${universeColors.electricBlue}08 45%, transparent 72%)`,
          opacity: 0.9,
        }}
      />

      {/* Nebula cloud 2 - violet */}
      <div
        className="absolute rounded-full"
        style={{
          width: "45vw",
          height: "30vw",
          right: "-5%",
          top: "25%",
          background: `radial-gradient(closest-side, ${universeColors.electricViolet}10, ${universeColors.electricViolet}07 45%, transparent 72%)`,
          opacity: 0.9,
        }}
      />

      {/* Nebula cloud 3 - indigo depth */}
      <div
        className="absolute rounded-full"
        style={{
          width: "40vw",
          height: "28vw",
          left: "30%",
          bottom: "15%",
          background: `radial-gradient(closest-side, ${universeColors.deepIndigo}26, ${universeColors.deepIndigo}14 45%, transparent 72%)`,
          opacity: 0.95,
        }}
      />

      {/* Nebula cloud 4 - subtle violet cloud */}
      <div
        className="absolute rounded-full"
        style={{
          width: "55vw",
          height: "38vw",
          right: "15%",
          bottom: "-10%",
          background: `radial-gradient(closest-side, ${universeColors.nebulaViolet}1a, ${universeColors.nebulaViolet}0d 45%, transparent 72%)`,
          opacity: 0.9,
        }}
      />
    </div>
  );
}
