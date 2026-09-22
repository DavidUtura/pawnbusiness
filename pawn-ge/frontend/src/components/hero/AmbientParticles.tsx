"use client";

import { useMemo } from "react";

function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export default function AmbientParticles({ count = 28 }: { count?: number }) {
  const dots = useMemo(() => {
    const rand = mulberry32(7);
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      left: rand() * 100,
      top: rand() * 100,
      size: 1 + rand() * 2,
      opacity: 0.08 + rand() * 0.14,
      duration: 9 + rand() * 9,
      delay: -(rand() * 12),
    }));
  }, [count]);

  return (
    <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
      {dots.map((d) => (
        <span
          key={d.id}
          className="absolute rounded-full bg-[#35C99A]"
          style={{
            left: `${d.left}%`,
            top: `${d.top}%`,
            width: d.size,
            height: d.size,
            opacity: d.opacity,
            animation: `floatDrift ${d.duration}s ease-in-out ${d.delay}s infinite`,
          }}
        />
      ))}
    </div>
  );
}