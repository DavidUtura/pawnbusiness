import { useMemo } from "react";
import { glowByCategory, heroMotionConfig, productAssets } from "./hero.config";
import type { MotionConfig, ProductVisual } from "./hero.types";

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
  // Far: small/dim/slow · Near: large/bright/fast
  const scale = 0.35 + depth * 1.0;
  const opacity = 0.2 + depth * 0.75;
  const blur = depth < 0.35 ? 1 : depth < 0.7 ? 0.5 : 0;
  return { scale, opacity, blur };
}

export function getBreakpoint(width: number): keyof typeof heroMotionConfig {
  if (width >= 1440) return "desktop";
  if (width >= 1024) return "desktop";
  if (width >= 768) return "tablet";
  return "mobile";
}

export function useProductMotion(opts: {
  count: MotionConfig["count"];
  meteorRatio: MotionConfig["meteorRatio"];
  seed?: number;
}): ProductVisual[] {
  const { count, meteorRatio, seed = 42 } = opts;

  return useMemo(() => {
    const rand = mulberry32(seed);
    const recent: string[] = [];
    const visuals: ProductVisual[] = [];
    const meteorCount = Math.round(count * meteorRatio);

    for (let i = 0; i < count; i++) {
      const asset = pickAsset(rand, recent);
      recent.push(asset.id);
      if (recent.length > 3) recent.shift();

      const depth = 0.15 + rand() * 0.85;
      const { scale, opacity, blur } = depthProps(depth);
      const meteor = i < meteorCount;

      // Diagonal travel: start off one edge, end off the opposite edge
      const angle = (Math.PI / 4) * (0.7 + rand() * 0.6) * (rand() > 0.5 ? 1 : -1);
      const startX = -20 + rand() * 140;
      const startY = meteor ? -25 - rand() * 10 : 10 + rand() * 80;
      const travelX = Math.cos(angle) * (60 + rand() * 60) * (angle > 0 ? 1 : -1);
      const travelY = meteor ? 120 + rand() * 40 : 8 + rand() * 14;

      visuals.push({
        id: `${asset.id}-${i}`,
        asset,
        depth,
        size: Math.round((70 + rand() * 90) * scale),
        opacity: Math.min(0.95, opacity),
        direction: angle,
        duration: meteor ? 6 + rand() * 6 : 10 + rand() * 8,
        delay: -(rand() * 12),
        rotation: (rand() - 0.5) * 24,
        meteor,
        startX,
        startY,
        travelX,
        travelY,
        glow: glowByCategory[asset.category] ?? "#35C99A",
        // blur applied via style in particle
        ...(blur > 0 ? { blur } : {}),
      } as ProductVisual & { blur?: number });
    }

    return visuals;
  }, [count, meteorRatio, seed]);
}