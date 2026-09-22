"use client";

import Image from "next/image";
import type { ProductVisual } from "./hero.types";

interface Props {
  product: ProductVisual & { blur?: number };
  parallax: { x: number; y: number };
}

export default function ProductParticle({ product, parallax }: Props) {
  const { asset, size, opacity, rotation, meteor, startX, startY, travelX, travelY, duration, delay, glow, depth, blur = 0 } = product;

  const px = parallax.x * depth;
  const py = parallax.y * depth;
  const width = Math.round(size * asset.aspect);
  const height = size;

  return (
    <div
      className="absolute will-change-transform"
      style={{
        left: `${startX}%`,
        top: `${startY}%`,
        opacity,
        filter: blur > 0 ? `blur(${blur}px)` : undefined,
        animation: meteor
          ? `meteorTravel ${duration}s linear ${delay}s infinite`
          : `floatDrift ${duration}s ease-in-out ${delay}s infinite`,
        // @ts-expect-error CSS custom props for keyframes
        "--tx": `${travelX}vw`,
        "--ty": `${travelY}vh`,
        "--rot": `${rotation}deg`,
        "--px": `${px}px`,
        "--py": `${py}px`,
      }}
    >
      {meteor && (
        <span
          aria-hidden="true"
          className="absolute top-1/2 left-1/2 -translate-y-1/2 rounded-full"
          style={{
            width: width * 1.6,
            height: 3,
            background: `linear-gradient(90deg, transparent, ${glow})`,
            opacity: 0.16,
            transform: `translate(-100%, -50%) rotate(${(product.direction * 180) / Math.PI}deg)`,
            transformOrigin: "right center",
          }}
        />
      )}
      <div
        className="transition-transform duration-200 hover:scale-110"
        style={{
          width,
          height,
          filter: `drop-shadow(0 12px 24px rgba(0,0,0,0.35)) drop-shadow(0 0 18px ${glow}33)`,
        }}
      >
        <Image src={asset.src} alt={asset.alt} width={width} height={height} loading="lazy" draggable={false} />
      </div>
    </div>
  );
}