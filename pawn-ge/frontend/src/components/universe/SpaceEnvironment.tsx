"use client";

import { useEffect, useState } from "react";
import { useStarField } from "./useStarField";
import { universeMotionConfig, universeColors } from "./universe.config";
import StarField from "./StarField";
import NebulaLayer from "./NebulaLayer";
import AmbientGlow from "./AmbientGlow";
import ProductMeteorLayer from "./ProductMeteorLayer";

interface Props {
  seed?: number;
}

/**
 * CosmicBackground — one global fixed visual environment used at layout/page
 * level. All functional UI sits above it (content wrappers use z-index), and
 * the whole layer is pointer-events: none so it never blocks clicks, scrolling
 * or keyboard navigation.
 */
export default function SpaceEnvironment({ seed = 42 }: Props) {
  const [breakpoint, setBreakpoint] = useState<keyof typeof universeMotionConfig>("desktop");
  const [reducedMotion, setReducedMotion] = useState(false);

  // Detect reduced motion preference
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    setReducedMotion(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  // Detect breakpoint (debounced via rAF so resize storms don't thrash React)
  useEffect(() => {
    let raf = 0;
    const read = () => {
      raf = 0;
      const width = window.innerWidth;
      const next: keyof typeof universeMotionConfig =
        width >= 1440 ? "desktop" : width >= 768 ? "tablet" : "mobile";
      setBreakpoint((prev) => (prev === next ? prev : next));
    };
    const update = () => {
      if (!raf) raf = requestAnimationFrame(read);
    };
    read();
    window.addEventListener("resize", update, { passive: true });
    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("resize", update);
    };
  }, []);

  // Idle-time rendering guard: when nobody scrolls/moves the pointer for ~1s,
  // mark <body> idle so CSS can stop re-compositing the static page content
  // behind the animated background. Any interaction clears it immediately.
  useEffect(() => {
    if (reducedMotion) return;
    let timer: ReturnType<typeof setTimeout> | null = null;
    const wake = () => {
      document.body.classList.remove("cosmic-idle");
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => document.body.classList.add("cosmic-idle"), 1000);
    };
    wake();
    window.addEventListener("scroll", wake, { passive: true });
    window.addEventListener("mousemove", wake, { passive: true });
    window.addEventListener("touchstart", wake, { passive: true });
    return () => {
      if (timer) clearTimeout(timer);
      document.body.classList.remove("cosmic-idle");
      window.removeEventListener("scroll", wake);
      window.removeEventListener("mousemove", wake);
      window.removeEventListener("touchstart", wake);
    };
  }, [reducedMotion]);

  const cfg = universeMotionConfig[breakpoint];
  // Reduced motion → static / very slow star field only, no meteors
  const stars = useStarField(reducedMotion ? Math.floor(cfg.starCount * 0.3) : cfg.starCount, seed);

  return (
    <div
      className="cosmic-background fixed inset-0 overflow-hidden"
      aria-hidden="true"
      style={{
        background: `
          radial-gradient(120% 90% at 50% -10%, rgba(21,21,43,0.55), transparent 60%),
          linear-gradient(135deg, ${universeColors.spaceBlack} 0%, ${universeColors.deepSpace} 45%, ${universeColors.midnightNavy} 100%)`,
      }}
    >
      {/* Layer 1: Nebula clouds */}
      <NebulaLayer />

      {/* Layer 2: Ambient atmospheric glow (section-differentiating radials) */}
      <AmbientGlow />

      {/* Layer 3: Star field */}
      <StarField stars={stars} reduced={reducedMotion} />

      {/* Layer 4: Moving electronics — product comets with plasma trails */}
      <ProductMeteorLayer
        productCount={cfg.productCount}
        meteorCount={cfg.meteorCount}
        seed={seed}
        reducedMotion={reducedMotion}
        compact={breakpoint === "mobile"}
      />

      {/* Layer 5: Hero focus mask — keeps density lower behind headline/search,
          subtly richer toward edges/corners via a soft central vignette hole */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(58% 42% at 50% 26%, rgba(5,7,11,0.55), rgba(5,7,11,0.22) 55%, transparent 75%)",
        }}
      />
    </div>
  );
}
