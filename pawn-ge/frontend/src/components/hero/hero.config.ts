import type { MotionConfig, ProductAsset } from "./hero.types";

export const productAssets: ProductAsset[] = [
  { id: "iphone", src: "/products/iphone.svg", alt: "iPhone", category: "phone", aspect: 0.5 },
  { id: "samsung", src: "/products/samsung.svg", alt: "Samsung Galaxy", category: "phone", aspect: 0.5 },
  { id: "macbook", src: "/products/macbook.svg", alt: "MacBook", category: "laptop", aspect: 1.6 },
  { id: "ps5", src: "/products/ps5.svg", alt: "PlayStation 5", category: "console", aspect: 0.8 },
  { id: "watch", src: "/products/watch.svg", alt: "Apple Watch", category: "watch", aspect: 0.6 },
  { id: "airpods", src: "/products/airpods.svg", alt: "AirPods", category: "audio", aspect: 1.14 },
  { id: "camera", src: "/products/camera.svg", alt: "Camera", category: "camera", aspect: 1.43 },
  { id: "headphones", src: "/products/headphones.svg", alt: "Headphones", category: "audio", aspect: 1.12 },
];

export const heroMotionConfig: Record<"desktop" | "tablet" | "mobile", MotionConfig> = {
  desktop: { count: 14, meteorRatio: 0.3, maxParallax: 20 },
  tablet: { count: 9, meteorRatio: 0.2, maxParallax: 12 },
  mobile: { count: 5, meteorRatio: 0.1, maxParallax: 6 },
};

export const heroColors = {
  glow: "#35C99A",
  teal: "#4E9F9A",
  lilac: "#B8B0D9",
};

export const glowByCategory: Record<string, string> = {
  phone: "#35C99A",
  laptop: "#4E9F9A",
  console: "#B8B0D9",
  watch: "#83C9AD",
  camera: "#E7BFAE",
  audio: "#6FB3D9",
};