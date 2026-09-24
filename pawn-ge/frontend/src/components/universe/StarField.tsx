"use client";

import type { Star } from "./universe.types";

interface Props {
  stars: Star[];
  /** Reduced motion: static stars, no twinkle */
  reduced?: boolean;
}

export default function StarField({ stars, reduced = false }: Props) {
  return (
    <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
      {stars.map((star) => (
        <span
          key={star.id}
          className="absolute rounded-full bg-white"
          style={{
            left: `${star.left}%`,
            top: `${star.top}%`,
            width: star.size,
            height: star.size,
            opacity: star.opacity,
            animation: reduced ? undefined : `starTwinkle ${star.duration}s ease-in-out ${star.delay}s infinite`,
            boxShadow: star.type === "bright" ? "0 0 6px rgba(255,255,255,0.4)" : undefined,
          }}
        />
      ))}
    </div>
  );
}
