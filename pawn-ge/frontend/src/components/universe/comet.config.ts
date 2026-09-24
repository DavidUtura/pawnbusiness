// Comet-trail configuration: warm plasma flame palette + per-product trail tuning.
// The fire tones are used ONLY for the comet trails; everything else stays cosmic blue/violet.

export const cometFlame = {
  core: "#FFE9C4", // white-hot plasma core (nearest the product)
  hot: "#FFB347", // amber inner flame
  ember: "#FF7A2F", // orange outer flame
  magenta: "#FF5FA2", // soft magenta mid-tail transition
  violet: "#8B6CFF", // violet tail tip
  cyan: "#5FD4FF", // cyan tail tip (alternative)
} as const;

export type TrailTone = "cool" | "long" | "lens" | "twin" | "thin";

export interface TrailProfile {
  /** Trail length multiplier applied to the base length (velocity/depth scaled) */
  length: number;
  /** Blur radius range in px [min, max] */
  blur: [number, number];
  /** Base opacity multiplier for the whole trail system */
  intensity: number;
  /** Tail-tip color blended after the warm flame zone */
  tailTip: string;
  /** Product-specific silhouette treatment */
  tone: TrailTone;
}

// Per-category comet treatment (spec section 9)
export const trailByCategory: Record<string, TrailProfile> = {
  phone: {
    // slim silhouette, blue-violet rim glow
    length: 1.0,
    blur: [10, 20],
    intensity: 1.0,
    tailTip: "#8B6CFF",
    tone: "cool",
  },
  laptop: {
    // subtle edge reflection, slightly longer horizontal trail
    length: 1.45,
    blur: [12, 24],
    intensity: 0.95,
    tailTip: "#5B8CFF",
    tone: "long",
  },
  gaming: {
    // stronger silhouette, cool blue/purple glow
    length: 1.1,
    blur: [14, 28],
    intensity: 1.05,
    tailTip: "#5B8CFF",
    tone: "cool",
  },
  camera: {
    // larger silhouette with circular lens glow
    length: 1.0,
    blur: [12, 26],
    intensity: 1.0,
    tailTip: "#BBD7FF",
    tone: "lens",
  },
  audio: {
    // AirPods / headphones: short concentrated trail
    length: 0.6,
    blur: [8, 14],
    intensity: 0.9,
    tailTip: "#5FD4FF",
    tone: "twin",
  },
  watch: {
    // compact object, thin bright trail
    length: 0.75,
    blur: [8, 12],
    intensity: 1.1,
    tailTip: "#8B6CFF",
    tone: "thin",
  },
};

export const defaultTrailProfile: TrailProfile = {
  length: 1.0,
  blur: [10, 20],
  intensity: 1.0,
  tailTip: "#8B6CFF",
  tone: "cool",
};

// Rim-light colors per category (soft atmospheric edge glow on the product body)
export const rimByCategory: Record<string, string> = {
  phone: "#7E9BFF",
  laptop: "#9C86FF",
  gaming: "#6F8CFF",
  camera: "#CFE3FF",
  audio: "#7FB8FF",
  watch: "#A98FFF",
};

// Motion parameter ranges (spec section 7)
export const cometMotion = {
  fallDurationMin: 7, // seconds
  fallDurationMax: 18,
  rotationMin: -25, // degrees
  rotationMax: 25,
  scaleMin: 0.55,
  scaleMax: 1.15,
  opacityMin: 0.12,
  opacityMax: 0.75,
  trailLengthMinPx: 40,
  trailLengthMaxPx: 180,
  spawnDelayMin: 0.4, // seconds
  spawnDelayMax: 2.5,
  sparkCountDesktop: 4,
  sparkCountMobile: 2,
} as const;
