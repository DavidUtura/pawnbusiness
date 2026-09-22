"use client";

import { useMemo } from "react";
import type { Star } from "./universe.types";

function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function useStarField(count: number, seed: number = 7): Star[] {
  return useMemo(() => {
    const rand = mulberry32(seed);
    const stars: Star[] = [];

    for (let i = 0; i < count; i++) {
      const r = rand();
      
      // Star type distribution: 70% micro, 25% small, 5% bright
      let type: Star["type"] = "micro";
      let size = 1 + rand() * 1.2;
      let opacity = 0.1 + rand() * 0.2;
      
      if (r > 0.95) {
        type = "bright";
        size = 2.5 + rand() * 1.5;
        opacity = 0.4 + rand() * 0.25;
      } else if (r > 0.7) {
        type = "small";
        size = 1.2 + rand() * 0.8;
        opacity = 0.2 + rand() * 0.2;
      }

      stars.push({
        id: i,
        left: rand() * 100,
        top: rand() * 100,
        size,
        opacity,
        duration: 2.5 + rand() * 4.5, // 2.5-7s twinkle
        delay: -(rand() * 5),
        type,
      });
    }

    return stars;
  }, [count, seed]);
}
