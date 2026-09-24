"use client";

import type { CSSProperties } from "react";
import { cometFlame } from "./comet.config";

interface CometTrailProps {
  /** Trail length in px (tapered, brightest near the product) */
  length: number;
  /** Blur radius in px for the atmospheric glow */
  blur: number;
  /** Overall intensity multiplier (0..1+) */
  intensity: number;
  /** Tail-tip color (violet / cyan / ice blue) */
  tailTip: string;
  /** Product travel direction in radians (screen space) */
  direction: number;
  /** Rendered product size in px — scales trail width & glow */
  size: number;
  /** True on mobile: drop sparks and secondary layers */
  compact?: boolean;
}

/**
 * Procedural comet flame / plasma trail.
 *
 * The trail is drawn pointing LEFT (opposite of +x) from its origin at the
 * product center, then rotated by `direction` so it always trails behind the
 * product along its travel vector. Layers (outer → inner):
 *   1. soft outer halo (radial, warm ember)
 *   2. wide tapered tail (orange → magenta → tail-tip, blurred)
 *   3. bright inner core (white-hot → amber, lightly blurred)
 *   4. detached ember sparks that fade out along the tail
 * Opacity/intensity are animated subtly via CSS keyframes so it feels organic.
 */
export default function CometTrail({
  length,
  blur,
  intensity,
  tailTip,
  direction,
  size,
  compact = false,
}: CometTrailProps) {
  const deg = (direction * 180) / Math.PI;
  const tailWidth = Math.max(6, size * 0.5);
  const coreWidth = Math.max(2.5, size * 0.16);
  const sparkCount = compact ? 0 : 3;

  const anchorStyle: CSSProperties = {
    position: "absolute",
    top: "50%",
    left: "50%",
    width: 0,
    height: 0,
    transform: `rotate(${deg}deg)`,
    transformOrigin: "center",
    pointerEvents: "none",
  };

  return (
    <div aria-hidden="true" style={anchorStyle}>
      {/* 1 · Soft outer glow behind the product */}
      <span
        className="comet-halo"
        style={{
          position: "absolute",
          top: -size * 0.75,
          left: -length * 0.55,
          width: length * 0.9 + size,
          height: size * 1.5,
          borderRadius: "9999px",
          background: `radial-gradient(closest-side, ${cometFlame.ember}, ${cometFlame.magenta}44 45%, transparent 75%)`,
          filter: `blur(${Math.min(blur * 1.6, 34)}px)`,
          opacity: 0.29 * intensity,
          transformOrigin: "right center",
          animation: "cometPulse 3.2s ease-in-out infinite alternate",
        }}
      />

      {/* 2 · Wide tapered tail — warm fire near the body, cooling toward the tip */}
      <span
        className="comet-tail"
        style={{
          position: "absolute",
          top: -tailWidth / 2,
          left: -length,
          width: length,
          height: tailWidth,
          borderRadius: "9999px",
          background: `linear-gradient(to left, ${cometFlame.hot}, ${cometFlame.ember} 30%, ${cometFlame.magenta} 62%, ${tailTip} 88%, transparent)`,
          clipPath: "polygon(0% 46%, 100% 0%, 100% 100%, 0% 54%)",
          filter: `blur(${blur}px)`,
          opacity: 0.4 * intensity,
          transformOrigin: "right center",
          animation: "cometFlicker 2.6s ease-in-out infinite alternate",
        }}
      />

      {/* 3 · Bright inner core immediately behind the product */}
      <span
        className="comet-core"
        style={{
          position: "absolute",
          top: -coreWidth / 2,
          left: -length * 0.55,
          width: length * 0.55,
          height: coreWidth,
          borderRadius: "9999px",
          background: `linear-gradient(to left, ${cometFlame.core}, ${cometFlame.hot} 45%, ${cometFlame.ember}00)`,
          filter: `blur(${Math.max(3, blur * 0.35)}px)`,
          opacity: 0.58 * intensity,
          transformOrigin: "right center",
          animation: "cometFlicker 1.9s ease-in-out 0.4s infinite alternate-reverse",
        }}
      />

      {/* Head glow hugging the product body */}
      <span
        style={{
          position: "absolute",
          top: -size * 0.45,
          left: -size * 0.3,
          width: size * 0.9,
          height: size * 0.9,
          borderRadius: "9999px",
          background: `radial-gradient(circle, ${cometFlame.core}CC, ${cometFlame.hot}55 45%, transparent 72%)`,
          filter: `blur(${Math.max(4, blur * 0.5)}px)`,
          opacity: 0.28 * intensity,
          pointerEvents: "none",
        }}
      />

      {/* 4 · Tiny ember sparks detaching from the trail and fading out */}
      {Array.from({ length: sparkCount }).map((_, i) => {
        const along = 0.3 + i * 0.28; // fraction of the tail
        const drift = (i % 2 === 0 ? 1 : -1) * (5 + i * 4);
        return (
          <span
            key={i}
            className="comet-spark"
            style={{
              position: "absolute",
              top: -drift,
              left: -length * along,
              width: 3 - i * 0.6,
              height: 3 - i * 0.6,
              borderRadius: "9999px",
              background: i === 0 ? cometFlame.core : cometFlame.hot,
              boxShadow: `0 0 8px ${i === 0 ? cometFlame.core : cometFlame.ember}`,
              opacity: 0.5 * intensity,
              animation: `cometSpark ${(2.2 + i * 0.7).toFixed(1)}s ease-out ${(i * 0.6).toFixed(1)}s infinite`,
            }}
          />
        );
      })}
    </div>
  );
}
