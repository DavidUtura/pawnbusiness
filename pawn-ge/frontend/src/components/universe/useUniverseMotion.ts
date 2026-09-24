"use client";

import { useMemo } from "react";
import { productAssets, glowByCategory, motionTiming } from "./universe.config";
import {
  cometFlame,
  cometMotion,
  rimByCategory,
  trailByCategory,
  defaultTrailProfile,
} from "./comet.config";
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

const lerp = (min: number, max: number, t: number) => min + (max - min) * t;

function depthProps(depth: number) {
  // Far: small/dim/slow/blurred · Near: large/bright/faster/clear
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

    // Viewport ratio is only used to convert px travel into vw/vh units.
    // Read it once here (memoized) instead of per-particle window lookups.
    const vw = typeof window !== "undefined" ? window.innerWidth : 1440;
    const vh = typeof window !== "undefined" ? window.innerHeight : 900;

    for (let i = 0; i < productCount; i++) {
      const asset = pickAsset(rand, recent);
      recent.push(asset.id);
      if (recent.length > 4) recent.shift();

      const depth = 0.1 + rand() * 0.9;
      const { scale, opacity, blur } = depthProps(depth);

      // Determine motion mode — most products fall like comets
      const isMeteor = i < meteorCount;
      const mode: ProductParticle["mode"] = isMeteor
        ? "meteor"
        : depth > 0.7 && rand() > 0.5
          ? "reentry"
          : "float";

      // Travel direction in screen-space radians (trail is drawn opposite to it)
      let dirX = 0;
      let dirY = 0;
      let startX, startY, travelX, travelY, duration, rotation;

      if (isMeteor) {
        // Meteor: starts off-screen above, travels on varied diagonals.
        // Angle bands: steep diagonal, shallow diagonal, occasional curved entry.
        const band = rand();
        let angleDeg: number;
        if (band < 0.4) {
          angleDeg = 55 + rand() * 25; // steeper fall (down-right / down-left)
        } else if (band < 0.8) {
          angleDeg = 22 + rand() * 20; // shallow diagonal
        } else {
          angleDeg = 78 + rand() * 10; // near-vertical re-entry style
        }
        const sign = rand() > 0.5 ? 1 : -1;
        const angle = (angleDeg * Math.PI) / 180;
        dirX = Math.cos(angle) * sign;
        dirY = Math.sin(angle);

        startX = 10 + rand() * 80;
        startY = -18 - rand() * 20;
        // Convert the desired screen-space angle into a px displacement using
        // the real viewport ratio, so the comet trail aligns exactly with the
        // visible travel direction (1vw ≠ 1vh in px terms).
        const fallPx = (130 + rand() * 40) * (vh / 100); // vertical travel in px
        const dxPx = dirX * (fallPx / Math.max(0.2, Math.tan(angle)));
        const dyPx = dirY * fallPx;
        travelX = Number(((dxPx / vw) * 100).toFixed(1)); // emitted as vw units
        travelY = Number(((dyPx / vh) * 100).toFixed(1)); // emitted as vh units
        duration = lerp(cometMotion.fallDurationMin, cometMotion.fallDurationMax, rand());
        // Slower apparent movement for far products (depth parallax feel)
        duration *= lerp(1.35, 0.85, depth);
        rotation = Math.max(
          cometMotion.rotationMin,
          Math.min(cometMotion.rotationMax, lerp(cometMotion.rotationMin, cometMotion.rotationMax, rand()) * sign)
        );
      } else if (mode === "reentry") {
        const off = (rand() - 0.5) * 0.9; // lateral lean, radians from vertical
        dirX = Math.sin(off);
        dirY = Math.cos(off);
        startX = rand() * 100;
        startY = -20 - rand() * 10;
        travelY = 40 + rand() * 30;
        travelX = dirX * travelY * 0.6;
        duration = 3 + rand() * 4;
        rotation = (rand() - 0.5) * 15;
      } else {
        // Float: gentle drifting within viewport
        startX = 10 + rand() * 80;
        startY = 10 + rand() * 80;
        travelX = (rand() - 0.5) * 20;
        travelY = (rand() - 0.5) * 15;
        duration = motionTiming.driftMin / 1000 + rand() * ((motionTiming.driftMax - motionTiming.driftMin) / 1000);
        rotation = (rand() - 0.5) * 8;
      }

      const direction = Math.atan2(dirY, dirX);

      // Comet trail system — only for moving meteors/reentries
      const profile = trailByCategory[asset.category] ?? defaultTrailProfile;
      const hasTrail = isMeteor || mode === "reentry";
      const speedFactor = Math.min(1, 60 / Math.max(duration, 1) / 4 + 0.35); // faster → longer
      const trailLength = hasTrail
        ? Math.round(
            lerp(cometMotion.trailLengthMinPx, cometMotion.trailLengthMaxPx, rand()) *
              profile.length *
              lerp(0.6, 1.15, depth) *
              speedFactor
          )
        : 0;
      const trailBlur = Math.round(lerp(profile.blur[0], profile.blur[1], rand()));
      const trailIntensity =
        lerp(0.55, 1.0, depth) * profile.intensity * (mode === "reentry" ? 1.15 : 1);

      // Scale & opacity clamped to spec ranges
      const sizeScale = lerp(cometMotion.scaleMin, cometMotion.scaleMax, rand()) * lerp(0.65, 1.2, depth);
      const finalOpacity = Math.min(
        cometMotion.opacityMax,
        Math.max(cometMotion.opacityMin, opacity * lerp(0.55, 0.95, depth))
      );

      particles.push({
        // Stable key: asset + index (never Date.now(), which would churn keys)
        id: `${asset.id}-${i}`,
        asset,
        depth,
        size: Math.round((60 + rand() * 100) * sizeScale),
        opacity: finalOpacity,
        direction,
        duration,
        // Positive spawn delays stagger launches; floats keep negative phase offsets
        delay: hasTrail
          ? lerp(cometMotion.spawnDelayMin, cometMotion.spawnDelayMax, rand()) + i * 0.9
          : -(rand() * 15),
        rotation,
        mode,
        startX,
        startY,
        travelX,
        travelY,
        glow: glowByCategory[asset.category] ?? "#5B8CFF",
        ...(blur > 0 ? { blur } : {}),
        hasTrail,
        trailLength,
        trailBlur,
        trailIntensity,
        flameCore: cometFlame.core,
        tailTip: profile.tailTip,
        rim: rimByCategory[asset.category] ?? "#7E9BFF",
        sparks: hasTrail ? cometMotion.sparkCountDesktop : 0,
      });
    }

    return particles;
  }, [productCount, meteorCount, seed]);
}
