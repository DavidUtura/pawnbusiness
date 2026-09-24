"use client";

import Image from "next/image";
import type { ProductParticle as ProductType } from "./universe.types";
import CometTrail from "./CometTrail";

interface Props {
  product: ProductType;
  parallax: { x: number; y: number };
  /** Mobile / tablet: simplified trail */
  compact?: boolean;
}

/**
 * A single product traveling through the cosmic background like a comet.
 * Motion is pure CSS (transform + opacity keyframes) — no React state per frame.
 * The wrapper carries the travel animation, an inner layer applies parallax so
 * the two transforms never conflict.
 */
export default function ProductMeteor({ product, parallax, compact = false }: Props) {
  const {
    asset,
    size,
    opacity,
    rotation,
    mode,
    startX,
    startY,
    travelX,
    travelY,
    duration,
    delay,
    glow,
    depth,
    rim,
    blur = 0,
    hasTrail,
    trailLength,
    trailBlur,
    trailIntensity,
    flameCore,
    tailTip,
  } = product;

  const width = Math.round(size * asset.aspect);
  const height = size;

  const animationName =
    mode === "meteor" ? "meteorTravel" : mode === "reentry" ? "meteorReentry" : "floatDrift";

  return (
    <div
      className="absolute will-change-transform"
      style={{
        left: `${startX}%`,
        top: `${startY}%`,
        filter: blur > 0 ? `blur(${blur}px)` : undefined,
        animation: `${animationName} ${duration}s linear ${delay}s infinite`,
        animationPlayState: "var(--meteor-play, running)",
        // @ts-expect-error CSS custom props consumed by keyframes
        "--tx": `${travelX}vw`,
        "--ty": `${travelY}vh`,
        "--rot": `${rotation}deg`,
        "--op": opacity,
      }}
    >
      <div
        className="relative"
        style={{
          width,
          height,
          opacity,
          // Rim light + atmospheric glow integrated into the dark scene.
          // --glow-boost is written by ProductMeteorLayer's rAF loop (pointer proximity).
          filter: `drop-shadow(0 10px 22px rgba(0,0,0,0.45)) drop-shadow(0 0 calc(14px + var(--glow-boost, 0) * 26px) ${rim}) brightness(calc(0.92 + var(--glow-boost, 0) * 0.25))`,
          transition: "filter 0.45s ease-out",
        }}
      >
        {/* Comet flame / plasma trail — tapered, inherits travel direction */}
        {hasTrail && !compact ? (
          <CometTrail
            length={trailLength}
            blur={trailBlur}
            intensity={trailIntensity}
            tailTip={tailTip}
            direction={product.direction}
            size={Math.max(width, height)}
          />
        ) : null}

        {/* Minimal mobile trail: single soft warm streak */}
        {hasTrail && compact ? (
          <span
            aria-hidden="true"
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              width: trailLength * 0.6,
              height: 4,
              borderRadius: 9999,
              transform: `translate(-100%, -50%) rotate(${(product.direction * 180) / Math.PI}deg)`,
              transformOrigin: "right center",
              background: `linear-gradient(to left, ${flameCore}, ${tailTip}00)`,
              filter: `blur(${Math.min(trailBlur, 10)}px)`,
              opacity: 0.25 * trailIntensity,
            }}
          />
        ) : null}

        {/* Re-entry energy burst */}
        {mode === "reentry" && (
          <span
            aria-hidden="true"
            className="absolute inset-0 rounded-full"
            style={{
              background: `radial-gradient(circle, ${glow}, transparent 70%)`,
              opacity: 0.08,
              filter: "blur(8px)",
              transform: "scale(1.4)",
            }}
          />
        )}

        {/* Product body — decorative, never interactive */}
        <Image
          src={asset.src}
          alt=""
          width={width}
          height={height}
          loading="lazy"
          draggable={false}
          style={{ pointerEvents: "none", position: "relative", zIndex: 1 }}
        />
      </div>
    </div>
  );
}
