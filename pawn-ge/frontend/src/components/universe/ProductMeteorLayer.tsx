"use client";

import { useEffect, useRef } from "react";
import { useUniverseMotion } from "./useUniverseMotion";
import ProductMeteor from "./ProductMeteor";

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
 *  - Parallax + pointer-proximity glow are written directly to DOM nodes via
 *    refs in a single rAF loop — React never re-renders per frame.
 *  - The whole layer pauses when the tab is hidden (rAF stops naturally and we
 *    freeze CSS animations via animation-play-state).
 */
export default function ProductMeteorLayer({
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
  const target = useRef({ x: 0, y: 0 }); // smoothed parallax origin
  const current = useRef({ x: 0, y: 0 });
  const pointer = useRef({ x: -9999, y: -9999, speed: 0 });
  const centers = useRef<{ x: number; y: number }[]>([]);
  const frame = useRef(0);
  const paused = useRef(false);

  useEffect(() => {
    if (reducedMotion) return;
    let raf = 0;

    const loop = () => {
      frame.current++;
      const cur = current.current;
      const tgt = target.current;
      cur.x += (tgt.x - cur.x) * 0.06;
      cur.y += (tgt.y - cur.y) * 0.06;

      const pSpeed = pointer.current.speed;
      pointer.current.speed *= 0.92; // decay fast-pointer trail boost

      const nodes = nodeRefs.current;
      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];
        if (!node) continue;
        const p = products[i];
        if (!p) continue;

        // Depth-weighted mouse parallax (a few px only)
        node.style.setProperty("--px", `${(cur.x * p.depth).toFixed(2)}px`);
        node.style.setProperty("--py", `${(cur.y * p.depth).toFixed(2)}px`);

        // Pointer proximity: subtly brighten nearby meteors using the
        // element's last-known viewport center (read once per spawn cycle is
        // not needed — we sample lazily every ~30 frames to stay cheap).
        if (p.hasTrail) {
          if (frame.current % 30 === i % 30) {
            const r = node.getBoundingClientRect();
            centers.current[i] = { x: r.left + r.width / 2, y: r.top + r.height / 2 };
          }
          const c = centers.current[i];
          if (c) {
            const dist = Math.hypot(pointer.current.x - c.x, pointer.current.y - c.y);
            const prox = Math.max(0, 1 - dist / 280);
            const boost = prox * 0.35 + Math.min(pSpeed / 45, 1) * prox * 0.25;
            node.style.setProperty("--glow-boost", boost.toFixed(3));
          }
        }
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    const onMove = (e: MouseEvent) => {
      const w = window.innerWidth || 1;
      const h = window.innerHeight || 1;
      target.current = {
        x: (e.clientX / w - 0.5) * 2 * 8, // max ~8px
        y: (e.clientY / h - 0.5) * 2 * 8,
      };
      pointer.current.speed = Math.min(
        60,
        Math.hypot(e.movementX || 0, e.movementY || 0) * 2
      );
      pointer.current.x = e.clientX;
      pointer.current.y = e.clientY;
    };
    window.addEventListener("mousemove", onMove, { passive: true });

    const onVisibility = () => {
      paused.current = document.hidden;
      const el = rootRef.current;
      if (el) {
        el.style.setProperty(
          "--meteor-play",
          document.hidden ? "paused" : "running"
        );
      }
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("visibilitychange", onVisibility);
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
          <ProductMeteor product={p} parallax={{ x: 0, y: 0 }} compact={compact} />
        </div>
      ))}
    </div>
  );
}
