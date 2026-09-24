import type { ProductAsset, ProductVisualCategory } from "./universe.config";

export type ProductMotionMode = "float" | "meteor" | "orbit" | "reentry";

export interface ProductParticle {
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
  /** Animation duration in seconds */
  duration: number;
  /** Spawn delay in seconds */
  delay: number;
  /** Rotation in degrees */
  rotation: number;
  /** Motion mode */
  mode: ProductMotionMode;
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
  /** Optional blur for depth */
  blur?: number;
  /** Comet trail length in px (0 for non-meteor products) */
  trailLength: number;
  /** Trail blur radius in px */
  trailBlur: number;
  /** Trail intensity multiplier (depth + per-product tuning) */
  trailIntensity: number;
  /** Warm flame core color */
  flameCore: string;
  /** Tail-tip color (violet / cyan / ice blue) */
  tailTip: string;
  /** Rim-light color around the product body */
  rim: string;
  /** Number of detached ember sparks behind the trail */
  sparks: number;
  /** Whether this meteor should render its comet trail */
  hasTrail: boolean;
}

export interface Star {
  id: number;
  left: number;
  top: number;
  size: number;
  opacity: number;
  duration: number;
  delay: number;
  type: "micro" | "small" | "bright";
}

export interface NebulaCloud {
  id: number;
  left: number;
  top: number;
  width: number;
  height: number;
  color: string;
  opacity: number;
  duration: number;
  delay: number;
}
