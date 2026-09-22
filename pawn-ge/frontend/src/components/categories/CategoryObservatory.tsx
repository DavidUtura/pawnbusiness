'use client';

import { useState, useEffect } from 'react';
import NextLink from 'next/link';

const categoryData = [
  {
    id: 'iphone',
    name: 'iPhone',
    index: '01',
    accent: '#5B8CFF',
    emoji: '📱',
    priceFrom: 1390,
    activeOffers: 24,
    lombardCount: 12,
  },
  {
    id: 'macbook',
    name: 'MacBook',
    index: '02',
    accent: '#7FA2D6',
    emoji: '💻',
    priceFrom: 1850,
    activeOffers: 18,
    lombardCount: 9,
  },
  {
    id: 'samsung',
    name: 'Samsung',
    index: '03',
    accent: '#55D6E8',
    emoji: '📱',
    priceFrom: 1299,
    activeOffers: 21,
    lombardCount: 11,
  },
  {
    id: 'playstation',
    name: 'PlayStation',
    index: '04',
    accent: '#8B6CFF',
    emoji: '🎮',
    priceFrom: 1250,
    activeOffers: 15,
    lombardCount: 8,
  },
  {
    id: 'cameras',
    name: 'Cameras',
    index: '05',
    accent: '#E7D7C4',
    emoji: '📷',
    priceFrom: 890,
    activeOffers: 12,
    lombardCount: 6,
  },
  {
    id: 'apple-watch',
    name: 'Apple Watch',
    index: '06',
    accent: '#B9A7FF',
    emoji: '⌚',
    priceFrom: 590,
    activeOffers: 19,
    lombardCount: 10,
  },
  {
    id: 'airpods',
    name: 'AirPods',
    index: '07',
    accent: '#BBD7FF',
    emoji: '🎧',
    priceFrom: 390,
    activeOffers: 28,
    lombardCount: 14,
  },
  {
    id: 'laptops',
    name: 'Laptops',
    index: '08',
    accent: '#7F8999',
    emoji: '💻',
    priceFrom: 750,
    activeOffers: 32,
    lombardCount: 15,
  },
];

interface CategoryObservatoryProps {
  hoveredCategory: string | null;
  setHoveredCategory: (cat: string | null) => void;
}

export default function CategoryObservatory({
  hoveredCategory,
  setHoveredCategory,
}: CategoryObservatoryProps) {
  const [activeId, setActiveId] = useState('iphone');
  const [direction, setDirection] = useState<'next' | 'previous' | 'none'>('none');
  const [isTransitioning, setIsTransitioning] = useState(false);

  const activeCategory = categoryData.find((c) => c.id === activeId);

  const handleCategorySelect = (id: string) => {
    if (isTransitioning || id === activeId) return;

    const currentIndex = categoryData.findIndex((c) => c.id === activeId);
    const newIndex = categoryData.findIndex((c) => c.id === id);
    setDirection(newIndex > currentIndex ? 'next' : 'previous');
    setIsTransitioning(true);

    setTimeout(() => {
      setActiveId(id);
      setHoveredCategory(id);
      setIsTransitioning(false);
      setDirection('none');
    }, 300);
  };

  // Keyboard navigation
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
        e.preventDefault();
        const currentIndex = categoryData.findIndex((c) => c.id === activeId);
        const nextIndex = (currentIndex + 1) % categoryData.length;
        handleCategorySelect(categoryData[nextIndex].id);
      } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
        e.preventDefault();
        const currentIndex = categoryData.findIndex((c) => c.id === activeId);
        const prevIndex = (currentIndex - 1 + categoryData.length) % categoryData.length;
        handleCategorySelect(categoryData[prevIndex].id);
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [activeId, isTransitioning]);

  return (
    <section className="relative py-20 md:py-28 overflow-hidden">
      {/* Ambient background glow per category */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full opacity-20 transition-colors duration-500"
        style={{
          background: `radial-gradient(circle, ${activeCategory?.accent || '#5B8CFF'}, transparent 70%)`,
          filter: 'blur(100px)',
        }}
      />

      <div className="relative z-10 max-w-[1320px] mx-auto px-6">
        {/* Section header */}
        <div className="mb-12">
          <p className="text-xs font-semibold tracking-[0.2em] text-[#5B8CFF] uppercase mb-4">
            Category Observatory
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Explore product universes
          </h2>
          <p className="text-[#C7CED9] max-w-2xl">
            Each category is a constellation of offers from Lombards across Georgia.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8 lg:gap-12">
          {/* Category Rail */}
          <nav className="space-y-1" role="tablist" aria-label="Product categories">
            {categoryData.map((category) => {
              const isActive = category.id === activeId;
              return (
                <button
                  key={category.id}
                  role="tab"
                  aria-selected={isActive}
                  aria-controls={`panel-${category.id}`}
                  onClick={() => handleCategorySelect(category.id)}
                  onMouseEnter={() => setHoveredCategory(category.name)}
                  className={`group w-full flex items-center justify-between px-4 py-3.5 rounded-xl text-left transition-all duration-200 ${
                    isActive
                      ? 'bg-white/5 text-white'
                      : 'text-[#7F8999] hover:text-[#C7CED9] hover:bg-white/[0.03]'
                  }`}
                  style={{
                    borderLeft: isActive ? `2px solid ${category.accent}` : '2px solid transparent',
                  }}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`text-xs font-semibold tracking-[0.15em] transition-colors ${
                        isActive ? 'text-[#5B8CFF]' : 'text-[#7F8999]'
                      }`}
                    >
                      {category.index}
                    </span>
                    <span className="text-[15px] font-medium">{category.name}</span>
                  </div>
                  <span
                    className={`opacity-0 transition-all duration-200 ${
                      isActive ? 'opacity-100 translate-x-0' : 'group-hover:opacity-70'
                    }`}
                  >
                    →
                  </span>
                </button>
              );
            })}
          </nav>

          {/* Product Stage */}
          <div
            id={`panel-${activeId}`}
            role="tabpanel"
            aria-labelledby={activeId}
            className="relative rounded-[30px] border border-white/10 backdrop-blur-sm overflow-hidden min-h-[420px]"
            style={{
              background: `radial-gradient(60% 60% at 50% 45%, rgba(91,140,255,0.07), rgba(8,13,22,0.7) 70%)`,
              boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.03), 0 30px 100px rgba(0,0,0,0.28)',
            }}
          >
            {/* Orbit ring */}
            <div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] h-[340px] rounded-full opacity-10 animate-spin-slow"
              style={{
                border: `1px solid ${activeCategory?.accent || '#5B8CFF'}`,
              }}
            />

            {/* Constellation decoration */}
            <div className="absolute inset-0 opacity-15">
              <svg viewBox="0 0 500 400" className="w-full h-full">
                <circle cx="120" cy="100" r="2" fill={activeCategory?.accent} />
                <circle cx="250" cy="140" r="1.5" fill={activeCategory?.accent} />
                <circle cx="380" cy="120" r="2" fill={activeCategory?.accent} />
                <circle cx="180" cy="240" r="1.5" fill={activeCategory?.accent} />
                <circle cx="320" cy="280" r="2" fill={activeCategory?.accent} />
                <line
                  x1="120"
                  y1="100"
                  x2="250"
                  y2="140"
                  stroke={activeCategory?.accent || '#5B8CFF'}
                  strokeWidth="0.5"
                  opacity="0.3"
                />
                <line
                  x1="250"
                  y1="140"
                  x2="380"
                  y2="120"
                  stroke={activeCategory?.accent || '#5B8CFF'}
                  strokeWidth="0.5"
                  opacity="0.3"
                />
                <line
                  x1="380"
                  y1="120"
                  x2="320"
                  y2="280"
                  stroke={activeCategory?.accent || '#5B8CFF'}
                  strokeWidth="0.5"
                  opacity="0.3"
                />
                <line
                  x1="320"
                  y1="280"
                  x2="180"
                  y2="240"
                  stroke={activeCategory?.accent || '#5B8CFF'}
                  strokeWidth="0.5"
                  opacity="0.3"
                />
              </svg>
            </div>

            {/* Product display */}
            <div className="relative h-full flex items-center justify-center p-8">
              <div
                key={activeId}
                className={`transition-all duration-300 ${
                  isTransitioning
                    ? direction === 'next'
                      ? 'opacity-0 scale-94 translate-x-[-8px]'
                      : 'opacity-0 scale-94 translate-x-[8px]'
                    : 'opacity-100 scale-100 translate-x-0'
                }`}
              >
                <span
                  className="text-[160px] md:text-[200px] block"
                  style={{
                    filter: `drop-shadow(0 0 60px ${activeCategory?.accent}40)`,
                    animation: 'float 6s ease-in-out infinite',
                  }}
                >
                  {activeCategory?.emoji}
                </span>
              </div>

              {/* Secondary silhouette */}
              <div
                className="absolute top-1/4 right-1/4 text-[80px] opacity-20"
                style={{
                  animation: 'float 8s ease-in-out infinite reverse',
                }}
              >
                {activeCategory?.emoji}
              </div>
            </div>

            {/* Marketplace metadata */}
            <div className="absolute bottom-6 left-6 right-6">
              <div
                className={`transition-all duration-300 ${
                  isTransitioning ? 'opacity-0 translate-y-2' : 'opacity-100 translate-y-0'
                }`}
              >
                <h3 className="text-2xl font-bold text-white mb-2">{activeCategory?.name}</h3>
                <div className="flex flex-wrap gap-4 text-sm">
                  <div>
                    <span className="text-[#7F8999]">From </span>
                    <span className="text-white font-semibold">{activeCategory?.priceFrom} ₾</span>
                  </div>
                  <div>
                    <span className="text-[#7F8999]">{activeCategory?.activeOffers} </span>
                    <span className="text-[#C7CED9]">active offers</span>
                  </div>
                  <div>
                    <span className="text-[#7F8999]">{activeCategory?.lombardCount} </span>
                    <span className="text-[#C7CED9]">Lombards</span>
                  </div>
                </div>
                <NextLink
                  href={`/products?category=${activeId}`}
                  className="inline-flex items-center gap-2 mt-4 text-[#5B8CFF] font-medium group"
                >
                  Explore {activeCategory?.name}
                  <span className="transition-transform group-hover:translate-x-1">→</span>
                </NextLink>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
