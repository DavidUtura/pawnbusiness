export type ProductCategory = "phone" | "laptop" | "console" | "watch" | "camera" | "audio";

export interface ProductAsset {
  id: string;
  src: string;
  alt: string;
  category: ProductCategory;
  /** Intrinsic aspect ratio (width / height) for sizing */
  aspect: number;
}

export interface ProductVisual {
  id: string;
  asset: ProductAsset;
  /** 0 = far, 1 = near */
  depth: number;
  /** Rendered size in px (before depth scale) */
  size: number;
  /** Final opacity */
  opacity: number;
  /** Travel direction in radians */
  direction: number;
  /** Crossing duration in seconds */
  duration: number;
  /** Spawn delay in seconds */
  delay: number;
  /** Rotation in degrees */
  rotation: number;
  /** True for meteor (travels across), false for floater (drifts) */
  meteor: boolean;
  /** Horizontal start position in % of container width */
  startX: number;
  /** Vertical start position in % of container height */
  startY: number;
  /** Horizontal travel distance in % of container width */
  travelX: number;
  /** Vertical travel distance in % of container height */
  travelY: number;
  /** Glow accent color */
  glow: string;
}

export interface MotionConfig {
  count: number;
  meteorRatio: number;
  maxParallax: number;
}