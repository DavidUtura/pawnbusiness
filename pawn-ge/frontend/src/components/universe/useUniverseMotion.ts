"use client";

import { useMemo } from "react";
import { productAssets, glowByCategory, motionTiming } from "./universe.config";
import type { ProductParticle } from "./universe.types";

function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function pickAsset(rand: () => number, recent: string[]) {
  const pool = productAssets.filter((a) => !recent.includes(a.id));
  const list = pool.length > 0 ? pool : productAssets;
  return list[Math.floor(rand() * list.length)];
}

function depthProps(depth: number) {
  // Far: small/dim/slow/blurred · Near: large/bright/fast/clear
  const scale = 0.3 + depth * 0.7;
  const opacity = 0.15 + depth * 0.8;
  const blur = depth < 0.35 ? 1.5 : depth < 0.7 ? 0.5 : 0;
  return { scale, opacity, blur };
}

export function useUniverseMotion(opts: {
  productCount: number;
  meteorCount: number;
  seed?: number;
}): ProductParticle[] {
  const { productCount, meteorCount, seed = 42 } = opts;

  return useMemo(() => {
    const rand = mulberry32(seed);
    const recent: string[] = [];
    const particles: ProductParticle[] = [];

    for (let i = 0; i < productCount; i++) {
      const asset = pickAsset(rand, recent);
      recent.push(asset.id);
      if (recent.length > 4) recent.shift();

      const depth = 0.1 + rand() * 0.9;
      const { scale, opacity, blur } = depthProps(depth);
      
      // Determine motion mode
      const isMeteor = i < meteorCount;
      const mode: ProductParticle["mode"] = isMeteor 
        ? "meteor" 
        : depth > 0.7 
          ? "reentry" 
          : "float";

      // Diagonal travel for meteors, gentle drift for floaters
      let startX, startY, travelX, travelY, duration, rotation;
      
      if (isMeteor) {
        // Meteor: starts off-screen, travels diagonally across viewport
        const angle = (Math.PI / 4) * (0.6 + rand() * 0.8) * (rand() > 0.5 ? 1 : -1);
        startX = -20 + rand() * 140;
        startY = -30 - rand() * 15;
        travelX = Math.cos(angle) * (70 + rand() * 50) * (angle > 0 ? 1 : -1);
        travelY = 130 + rand() * 40;
        duration = motionTiming.meteorDurationMin + rand() * (motionTiming.meteorDurationMax - motionTiming.meteorDurationMin);
        rotation = (rand() - 0.5) * 20;
      } else if (mode === "reentry") {
        // Re-entry: shorter, more dramatic entry
        startX = rand() * 100;
        startY = -20 - rand() * 10;
        travelX = (rand() - 0.5) * 30;
        travelY = 40 + rand() * 30;
        duration = 3 + rand() * 4;
        rotation = (rand() - 0.5) * 15;
      } else {
        // Float: gentle drifting within viewport
        startX = 10 + rand() * 80;
        startY = 10 + rand() * 80;
        travelX = (rand() - 0.5) * 20;
        travelY = (rand() - 0.5) * 15;
        duration = motionTiming.driftMin + rand() * (motionTiming.driftMax - motionTiming.driftMin);
        rotation = (rand() - 0.5) * 8;
      }

      particles.push({
        id: `${asset.id}-${i}-${Date.now()}`,
        asset,
        depth,
        size: Math.round((60 + rand() * 100) * scale),
        opacity: Math.min(0.95, opacity),
        direction: isMeteor ? (Math.PI / 4) * (rand() > 0.5 ? 1 : -1) : 0,
        duration,
        delay: -(rand() * 15),
        rotation,
        mode,
        startX,
        startY,
        travelX,
        travelY,
        glow: glowByCategory[asset.category] ?? "#5B8CFF",
        ...(blur > 0 ? { blur } : {}),
      });
    }

    return particles;
  }, [productCount, meteorCount, seed]);
}
