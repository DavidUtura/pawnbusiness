"use client";

import { memo, useEffect, useRef } from "react";
import { useUniverseMotion } from "./useUniverseMotion";
import ProductMeteor from "./ProductMeteor";

const MeteorItem = memo(ProductMeteor);

interface Props {
  productCount: number;
  meteorCount: number;
  seed: number;
  reducedMotion: boolean;
  compact: boolean;
}

/**
 * Owns the moving electronics and their animation lifecycle.
 * Performance strategy:
 *  - Product motion itself is pure CSS (transform/opacity keyframes) handled by
 *    the compositor — zero main-thread work while idle.
 *  - This component runs NO continuous rAF loop. Mouse parallax and
 *    pointer-proximity glow are event-driven: mousemove only records values and
 *    schedules at most ONE throttled rAF tick (~20 fps), which self-cancels
 *    once the smoothing settles or the pointer leaves the viewport.
 *  - getBoundingClientRect is avoided entirely; meteor positions are computed
 *    analytically from the same CSS keyframe math (cheap, no forced layout).
 *  - Everything freezes when the tab is hidden (--meteor-play: paused) and the
 *    layer pauses via IntersectionObserver when scrolled out of view.
 */
function ProductMeteorLayerBase({
  productCount,
  meteorCount,
  seed,
  reducedMotion,
  compact,
}: Props) {
  const products = useUniverseMotion({
    productCount: reducedMotion ? Math.max(2, Math.floor(productCount * 0.35)) : productCount,
    meteorCount: reducedMotion ? 0 : meteorCount,
    seed: seed + 1,
  });

  const rootRef = useRef<HTMLDivElement>(null);
  const nodeRefs = useRef<(HTMLDivElement | null)[]>([]);
  // Page-load timestamp: CSS animation-delay starts each meteor's cycle at
  // (pageLoad + delay), so we replicate that phase analytically.
  const pageLoad = useRef(typeof performance !== "undefined" ? performance.now() : 0);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const target = { x: 0, y: 0 }; // desired parallax offset (px)
    const current = { x: 0, y: 0 }; // smoothed parallax offset (px)
    const pointer = { x: -9999, y: -9999, speed: 0 };
    let raf = 0;
    let lastTick = 0;
    let running = false; // pointer interaction active?
    let visible = true; // layer inside viewport?
    let settledFrames = 0;
    const TICK_MS = 50; // throttle parallax/glow updates to ~20 fps

    const applyParallax = () => {
      const nodes = nodeRefs.current;
      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];
        if (!node) continue;
        const depth = products[i]?.depth ?? 0.5;
        node.style.setProperty("--px", (current.x * depth).toFixed(2) + "px");
        node.style.setProperty("--py", (current.y * depth).toFixed(2) + "px");
      }
    };

    /** Analytic meteor center (no getBoundingClientRect → no forced layout). */
    const meteorCenter = (i: number) => {
      const p = products[i];
      if (!p) return null;
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const elapsed =
        (((performance.now() - pageLoad.current) / 1000 - p.delay) % p.duration + p.duration) %
        p.duration;
      const t = elapsed / p.duration;
      let txPct: number;
      let tyPct: number;
      let op = 1;
      if (p.mode === "meteor") {
        txPct = p.travelX * t;
        tyPct = p.travelY * t;
        op = t < 0.06 ? t / 0.06 : t > 0.92 ? (1 - t) / 0.08 : 1;
      } else if (p.mode === "reentry") {
        txPct = p.travelX * t;
        tyPct = p.travelY * t;
        op = t < 0.2 ? t / 0.2 : t > 0.8 ? (1 - t) / 0.2 : 1;
      } else {
        const s = (1 - Math.cos(t * Math.PI * 2)) / 2;
        txPct = p.travelX * 0.12 * s;
        tyPct = p.travelY * 0.12 * s;
      }
      if (op <= 0.02) return null; // faded out — skip glow work
      return {
        x: ((p.startX + txPct) / 100) * vw + current.x * p.depth,
        y: ((p.startY + tyPct) / 100) * vh + current.y * p.depth,
      };
    };

    const updateGlow = () => {
      const pSpeed = pointer.speed;
      const nodes = nodeRefs.current;
      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];
        if (!node) continue;
        if (!products[i]?.hasTrail) continue;
        const c = meteorCenter(i);
        let boost = 0;
        if (c) {
          const dx = pointer.x - c.x;
          const dy = pointer.y - c.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const prox = Math.max(0, 1 - dist / 280);
          boost = prox * 0.35 + Math.min(pSpeed / 45, 1) * prox * 0.25;
        }
        node.style.setProperty("--glow-boost", boost.toFixed(3));
      }
    };

    const step = (now: number) => {
      raf = 0;
      if (!visible || document.hidden) return; // resume via events below
      // Throttle to ~20 fps: decorative motion does not need 60 Hz JS.
      if (now - lastTick < TICK_MS) {
        raf = requestAnimationFrame(step);
        return;
      }
      lastTick = now;

      const dx = target.x - current.x;
      const dy = target.y - current.y;
      current.x += dx * 0.15;
      current.y += dy * 0.15;
      pointer.speed *= 0.85; // decay fast-pointer trail boost

      applyParallax();
      updateGlow();

      const settled =
        Math.abs(target.x - current.x) < 0.05 &&
        Math.abs(target.y - current.y) < 0.05 &&
        pointer.speed < 0.5;
      if (settled) settledFrames++;
      else settledFrames = 0;

      // Keep looping while the pointer is around; stop shortly after it stops
      // interacting so an idle page has ZERO JavaScript animation work.
      if (running && settledFrames < 6) {
        raf = requestAnimationFrame(step);
      }
    };

    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(step);
    };

    const onMove = (e: MouseEvent) => {
      if (reducedMotion) return;
      const w = window.innerWidth || 1;
      const h = window.innerHeight || 1;
      target.x = (e.clientX / w - 0.5) * 2 * 8; // max ~8px
      target.y = (e.clientY / h - 0.5) * 2 * 8;
      pointer.speed = Math.min(60, Math.hypot(e.movementX || 0, e.movementY || 0) * 2);
      pointer.x = e.clientX;
      pointer.y = e.clientY;
      running = true;
      settledFrames = 0;
      schedule();
    };

    const onLeave = () => {
      // Pointer left the page: glide back to neutral, then stop the loop.
      running = false;
      settledFrames = 0;
      target.x = 0;
      target.y = 0;
      pointer.x = -9999;
      pointer.y = -9999;
      pointer.speed = 0;
      schedule();
    };

    const onVisibility = () => {
      const hidden = document.hidden;
      root.style.setProperty("--meteor-play", hidden ? "paused" : "running");
      if (!hidden && running) schedule();
    };

    // Viewport-based pausing: freeze all CSS animations while the cosmic layer
    // is fully off-screen (fixed layer ⇒ effectively only matters for hidden
    // tabs/zero-height viewports, but keeps the contract explicit).
    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        root.style.setProperty(
          "--meteor-play",
          !visible || document.hidden ? "paused" : "running"
        );
        if (visible && running) schedule();
      },
      { threshold: 0 }
    );
    io.observe(root);

    window.addEventListener("mousemove", onMove, { passive: true });
    document.documentElement.addEventListener("mouseleave", onLeave);
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      document.documentElement.removeEventListener("mouseleave", onLeave);
      document.removeEventListener("visibilitychange", onVisibility);
      io.disconnect();
    };
  }, [products, reducedMotion]);

  return (
    <div
      ref={rootRef}
      className="absolute inset-0 overflow-hidden"
      aria-hidden="true"
      style={{ ["--meteor-play" as string]: "running" }}
    >
      {products.map((p, i) => (
        <div
          key={p.id}
          ref={(el) => {
            nodeRefs.current[i] = el;
          }}
          className="absolute inset-0"
          style={{ transform: "translate3d(var(--px, 0px), var(--py, 0px), 0)" }}
        >
          <MeteorItem product={p} parallax={{ x: 0, y: 0 }} compact={compact} />
        </div>
      ))}
    </div>
  );
}

const ProductMeteorLayer = memo(ProductMeteorLayerBase);
export default ProductMeteorLayer;
