"use client";

import { useEffect, useRef, useState } from "react";
import AmbientParticles from "./AmbientParticles";
import CursorGlow from "./CursorGlow";
import ProductParticle from "./ProductParticle";
import { heroMotionConfig } from "./hero.config";
import { getBreakpoint, useProductMotion } from "./useProductMotion";

interface Props {
  seed?: number;
}

export default function ProductMeteorBackground({ seed = 42 }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [breakpoint, setBreakpoint] = useState<keyof typeof heroMotionConfig>("desktop");
  const [parallax, setParallax] = useState({ x: 0, y: 0 });
  const [cursor, setCursor] = useState({ x: -500, y: -500 });
  const [reducedMotion, setReducedMotion] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
  const raf = useRef<number>(0);
  const target = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    const update = () => setBreakpoint(getBreakpoint(window.innerWidth));
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  // Smooth parallax (rAF, no per-frame React state for particles)
  useEffect(() => {
    const loop = () => {
      setParallax((prev) => {
        const nx = prev.x + (target.current.x - prev.x) * 0.08;
        const ny = prev.y + (target.current.y - prev.y) * 0.08;
        if (Math.abs(nx - prev.x) < 0.01 && Math.abs(ny - prev.y) < 0.01) return prev;
        return { x: nx, y: ny };
      });
      raf.current = requestAnimationFrame(loop);
    };
    raf.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf.current);
  }, []);

  const cfg = heroMotionConfig[breakpoint];
  const products = useProductMotion({ count: reducedMotion ? 3 : cfg.count, meteorRatio: reducedMotion ? 0 : cfg.meteorRatio, seed });

  const onMouseMove = (e: React.MouseEvent) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    target.current = { x: px * cfg.maxParallax, y: py * cfg.maxParallax };
    setCursor({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={onMouseMove}
      className="product-meteor-bg absolute inset-0 overflow-hidden"
      aria-hidden="true"
    >
      {/* Layer 1 — atmospheric gradients */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 20% 20%, rgba(53,201,154,.14), transparent 34%), radial-gradient(circle at 80% 35%, rgba(78,159,154,.12), transparent 32%), radial-gradient(circle at 55% 90%, rgba(184,176,217,.09), transparent 30%), linear-gradient(135deg, #0D1713 0%, #10221B 48%, #15221E 100%)",
        }}
      />

      {/* Layer 2 — ambient dust */}
      {!reducedMotion && <AmbientParticles count={breakpoint === "mobile" ? 12 : 28} />}

      {/* Layers 3–5 — product objects */}
      {products.map((p) => (
        <ProductParticle key={p.id} product={p} parallax={reducedMotion ? { x: 0, y: 0 } : parallax} />
      ))}

      {/* Layer 7 — cursor light */}
      {!reducedMotion && breakpoint !== "mobile" && <CursorGlow x={cursor.x} y={cursor.y} />}
    </div>
  );
}