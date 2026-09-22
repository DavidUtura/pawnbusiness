"use client";

export default function CursorGlow({ x, y }: { x: number; y: number }) {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0"
      style={{
        background: `radial-gradient(circle 220px at ${x}px ${y}px, rgba(53,201,154,0.10), transparent 70%)`,
      }}
    />
  );
}