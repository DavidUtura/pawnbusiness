"use client";

import Image from "next/image";
import type { ProductParticle as ProductParticleType } from "./universe.types";

interface Props {
  particle: ProductParticleType & { blur?: number };
  parallax: { x: number; y: number };
}

export default function ProductParticle({ particle, parallax }: Props) {
  const { asset, size, opacity, rotation, mode, startX, startY, travelX, travelY, duration, delay, glow, depth, blur = 0 } = particle;

  const px = parallax.x * depth;
  const py = parallax.y * depth;
  const width = Math.round(size * asset.aspect);
  const height = size;

  // Get animation name based on mode
  const animationName = mode === "meteor" 
    ? "meteorTravel" 
    : mode === "reentry"
      ? "meteorReentry"
      : "floatDrift";

  return (
    <div
      className="absolute will-change-transform"
      style={{
        left: `${startX}%`,
        top: `${startY}%`,
        opacity,
        filter: blur > 0 ? `blur(${blur}px)` : undefined,
        animation: `${animationName} ${duration}s linear ${delay}s infinite`,
        // @ts-expect-error CSS custom props for keyframes
        "--tx": `${travelX}vw`,
        "--ty": `${travelY}vh`,
        "--rot": `${rotation}deg`,
        "--px": `${px}px`,
        "--py": `${py}px`,
      }}
    >
      {/* Meteor trail effect */}
      {mode === "meteor" && (
        <>
          {/* Primary trail - cool white to blue gradient */}
          <span
            aria-hidden="true"
            className="absolute top-1/2 left-1/2 -translate-y-1/2 rounded-full"
            style={{
              width: width * 2,
              height: 4,
              background: `linear-gradient(90deg, transparent, rgba(245,247,250,0.3), ${glow})`,
              opacity: 0.2,
              transform: `translate(-100%, -50%) rotate(${particle.direction}rad)`,
              transformOrigin: "right center",
              filter: "blur(2px)",
            }}
          />
          {/* Secondary particles - small sparks */}
          <span
            aria-hidden="true"
            className="absolute top-1/2 left-1/2 rounded-full"
            style={{
              width: 2,
              height: 2,
              background: glow,
              opacity: 0.15,
              transform: `translate(-120%, 20%) rotate(${particle.direction}rad)`,
              boxShadow: `0 0 8px ${glow}`,
            }}
          />
        </>
      )}
      
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
      
      {/* Product image */}
      <div
        className="transition-transform duration-200 hover:scale-110"
        style={{
          width,
          height,
          filter: `drop-shadow(0 12px 24px rgba(0,0,0,0.4)) drop-shadow(0 0 16px ${glow}22)`,
        }}
      >
        <Image 
          src={asset.src} 
          alt={asset.alt} 
          width={width} 
          height={height} 
          loading="lazy" 
          draggable={false}
          style={{ pointerEvents: "none" }}
        />
      </div>
    </div>
  );
}
