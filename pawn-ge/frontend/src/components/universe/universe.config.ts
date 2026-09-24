// Universe color system - dark space palette
export const universeColors = {
  // Base backgrounds
  spaceBlack: "#05070B",
  deepSpace: "#080D16",
  midnightNavy: "#0B1220",
  
  // Nebula colors
  deepIndigo: "#15152B",
  nebulaViolet: "#211B38",
  
  // Accents
  electricBlue: "#5B8CFF",
  electricViolet: "#8B6CFF",
  coolWhite: "#F5F7FA",
  softWhite: "#C9D0DB",
  iceBlue: "#BBD7FF",
  
  // Optional residual green (micro-accent only)
  residualGreen: "#35C99A",
};

// Product visual categories
export type ProductVisualCategory =
  | "phone"
  | "laptop"
  | "gaming"
  | "watch"
  | "camera"
  | "audio";

export interface ProductAsset {
  id: string;
  src: string;
  alt: string;
  category: ProductVisualCategory;
  /** Intrinsic aspect ratio (width / height) */
  aspect: number;
}

// Product assets with transparent PNGs/SVGs
export const productAssets: ProductAsset[] = [
  { id: "iphone", src: "/products/iphone.svg", alt: "iPhone", category: "phone", aspect: 0.5 },
  { id: "samsung", src: "/products/samsung.svg", alt: "Samsung Galaxy", category: "phone", aspect: 0.5 },
  { id: "macbook", src: "/products/macbook.svg", alt: "MacBook", category: "laptop", aspect: 1.6 },
  { id: "ps5", src: "/products/ps5.svg", alt: "PlayStation 5", category: "gaming", aspect: 0.8 },
  { id: "watch", src: "/products/watch.svg", alt: "Apple Watch", category: "watch", aspect: 0.6 },
  { id: "airpods", src: "/products/airpods.svg", alt: "AirPods", category: "audio", aspect: 1.14 },
  { id: "camera", src: "/products/camera.svg", alt: "Camera", category: "camera", aspect: 1.43 },
  { id: "headphones", src: "/products/headphones.svg", alt: "Headphones", category: "audio", aspect: 1.12 },
];

// Glow color by category - using blue/violet instead of green
export const glowByCategory: Record<ProductVisualCategory, string> = {
  phone: "#5B8CFF",
  laptop: "#8B6CFF",
  gaming: "#5B8CFF",
  watch: "#8B6CFF",
  camera: "#BBD7FF",
  audio: "#5B8CFF",
};

// Motion configuration per breakpoint
export interface MotionConfig {
  productCount: number;
  meteorCount: number;
  starCount: number;
  maxParallax: number;
}

export const universeMotionConfig: Record<"desktop" | "tablet" | "mobile", MotionConfig> = {
  desktop: {
    productCount: 10,
    meteorCount: 2,
    starCount: 45,
    maxParallax: 20,
  },
  tablet: {
    productCount: 7,
    meteorCount: 1,
    starCount: 28,
    maxParallax: 12,
  },
  mobile: {
    productCount: 4,
    meteorCount: 0,
    starCount: 16,
    maxParallax: 5,
  },
};

// Animation timing
export const motionTiming = {
  meteorDurationMin: 5,
  meteorDurationMax: 12,
  nebulaCycle: 45000, // ms
  driftMin: 8000,
  driftMax: 18000,
  starTwinkleMin: 2.5,
  starTwinkleMax: 7,
};
