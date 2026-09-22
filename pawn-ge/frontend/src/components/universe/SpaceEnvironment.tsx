"use client";

import { useEffect, useRef, useState } from "react";
import { useStarField } from "./useStarField";
import { useUniverseMotion } from "./useUniverseMotion";
import { universeMotionConfig, universeColors } from "./universe.config";
import StarField from "./StarField";
import NebulaLayer from "./NebulaLayer";
import ProductParticle from "./ProductParticle";

interface Props {
  seed?: number;
}

export default function SpaceEnvironment({ seed = 42 }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [breakpoint, setBreakpoint] = useState<keyof typeof universeMotionConfig>("desktop");
  const [parallax, setParallax] = useState({ x: 0, y: 0 });
  const [reducedMotion, setReducedMotion] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
  
  const raf = useRef<number>(0);
  const target = useRef({ x: 0, y: 0 });

  // Detect reduced motion preference
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  // Detect breakpoint
  useEffect(() => {
    const update = () => {
      const width = window.innerWidth;
      if (width >= 1440) setBreakpoint("desktop");
      else if (width >= 768) setBreakpoint("tablet");
      else setBreakpoint("mobile");
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  // Smooth parallax with rAF
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

  // Mouse move handler for parallax
  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;
      const px = (e.clientX - rect.left) / rect.width - 0.5;
      const py = (e.clientY - rect.top) / rect.height - 0.5;
      target.current = { x: px * universeMotionConfig[breakpoint].maxParallax, y: py * universeMotionConfig[breakpoint].maxParallax };
    };
    
    window.addEventListener("mousemove", onMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMouseMove);
  }, [breakpoint]);

  const cfg = universeMotionConfig[breakpoint];
  const stars = useStarField(reducedMotion ? Math.floor(cfg.starCount * 0.3) : cfg.starCount, seed);
  const products = useUniverseMotion({
    productCount: reducedMotion ? Math.floor(cfg.productCount * 0.2) : cfg.productCount,
    meteorCount: reducedMotion ? 0 : cfg.meteorCount,
    seed: seed + 1,
  });

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 overflow-hidden"
      aria-hidden="true"
      style={{
        background: `linear-gradient(135deg, ${universeColors.spaceBlack} 0%, ${universeColors.deepSpace} 45%, ${universeColors.midnightNavy} 100%)`,
      }}
    >
      {/* Layer 1: Base space gradient (via inline style above) */}
      
      {/* Layer 2: Nebula clouds */}
      <NebulaLayer />
      
      {/* Layer 3: Star field */}
      <StarField stars={stars} />
      
      {/* Layer 4-6: Product particles at different depths */}
      {products.map((p) => (
        <ProductParticle 
          key={p.id} 
          particle={p} 
          parallax={reducedMotion ? { x: 0, y: 0 } : parallax} 
        />
      ))}
    </div>
  );
}
