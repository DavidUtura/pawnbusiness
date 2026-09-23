'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { getAccessToken, decodeRole } from '@/lib/auth/session';

/** Role-aware admin links. Hidden for customers — hiding is UX only; the API enforces access. */
function AdminNavLinks() {
  const [role, setRole] = useState<string | null>(null);
  useEffect(() => {
    setRole(decodeRole(getAccessToken()));
  }, []);
  if (role === 'LOMBARD_ADMIN' || role === 'LOMBARD_EMPLOYEE') {
    return (
      <Link href="/admin/dashboard" className="hidden sm:block px-3 py-2 text-sm font-medium text-[#BBD7FF] hover:text-white transition-colors">
        Lombard Admin
      </Link>
    );
  }
  if (role === 'SUPER_ADMIN') {
    return (
      <Link href="/super-admin/applications" className="hidden sm:block px-3 py-2 text-sm font-medium text-[#BBD7FF] hover:text-white transition-colors">
        Super Admin
      </Link>
    );
  }
  return null;
}

const shopMenu = [
  { title: 'Smartphones', items: ['iPhone', 'Samsung', 'Google'] },
  { title: 'Laptops', items: ['MacBook', 'Lenovo', 'Windows'] },
  { title: 'Gaming', items: ['PlayStation', 'Xbox', 'Nintendo'] },
];

const categories = [
  { name: 'iPhone', emoji: '📱' },
  { name: 'MacBook', emoji: '💻' },
  { name: 'Samsung', emoji: '📱' },
  { name: 'PlayStation', emoji: '🎮' },
  { name: 'Cameras', emoji: '📷' },
  { name: 'Apple Watch', emoji: '⌚' },
  { name: 'AirPods', emoji: '🎧' },
  { name: 'Laptops', emoji: '💻' },
];

const featuredSellers = [
  { name: 'Lombard Elite', rating: 4.8, products: 124 },
  { name: 'Pawn House', rating: 4.7, products: 89 },
];

interface OrbitalHeaderProps {
  scrolled: boolean;
  openMenu: null | 'shop' | 'categories' | 'lombards';
  setOpenMenu: (menu: null | 'shop' | 'categories' | 'lombards') => void;
  hoveredCategory: string | null;
  setHoveredCategory: (cat: string | null) => void;
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
  cursor: { x: number; y: number };
}

export default function OrbitalHeader({
  scrolled,
  openMenu,
  setOpenMenu,
  hoveredCategory,
  setHoveredCategory,
  mobileOpen,
  setMobileOpen,
  cursor,
}: OrbitalHeaderProps) {
  const headerRef = useRef<HTMLDivElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (headerRef.current && !headerRef.current.contains(e.target as Node)) {
        setOpenMenu(null);
      }
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, [setOpenMenu]);

  const openWithDelay = (menu: 'shop' | 'categories' | 'lombards') => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpenMenu(menu);
  };

  const closeWithDelay = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setOpenMenu(null), 150);
  };

  const activeCategory = categories.find((c) => c.name === hoveredCategory);

  return (
    <header className="sticky top-0 z-50 px-4 pt-4">
      <div
        ref={headerRef}
        className="header-float mx-auto max-w-[1320px] rounded-[26px] border border-white/10 backdrop-blur-[26px] transition-all duration-300"
        style={{
          background: `linear-gradient(135deg, rgba(8,12,20,0.88), rgba(12,16,28,0.72))`,
          boxShadow: scrolled
            ? '0 18px 60px rgba(0,0,0,0.36), inset 0 1px 0 rgba(255,255,255,0.035)'
            : '0 20px 70px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.035)',
        }}
      >
        {/* Cursor-reactive light */}
        <div
          className="pointer-events-none absolute inset-0 rounded-[26px] overflow-hidden"
          style={{
            background: `radial-gradient(240px circle at ${cursor.x - (headerRef.current?.getBoundingClientRect().left || 0)}px ${cursor.y - (headerRef.current?.getBoundingClientRect().top || 0)}px, rgba(91,140,255,0.10), transparent 65%)`,
            opacity: 0.6,
          }}
        />

        <div
          className={`relative flex items-center justify-between px-6 transition-all ${scrolled ? 'h-[66px]' : 'h-[78px]'}`}
        >
          {/* Logo */}
          <Link
            href="/"
            className="relative z-10 text-xl font-bold text-white tracking-tight hover:text-[#F5F7FA]/95 transition-colors"
          >
            pawn.ge
          </Link>

          {/* Navigation */}
          <nav className="hidden lg:flex items-center gap-1 relative z-10">
            {(['Shop', 'Categories', 'Lombards'] as const).map((label) => {
              const key = label.toLowerCase() as 'shop' | 'categories' | 'lombards';
              return (
                <div
                  key={key}
                  className="relative"
                  onMouseEnter={() => openWithDelay(key)}
                  onMouseLeave={closeWithDelay}
                >
                  <button
                    className={`group relative px-3 py-2 text-sm font-medium transition-colors ${
                      openMenu === key ? 'text-[#5B8CFF]' : 'text-[#C7CED9] hover:text-white'
                    }`}
                  >
                    <span className="flex items-center gap-1">
                      {label}
                      <Chevron open={openMenu === key} />
                    </span>
                    {/* Animated indicator */}
                    <span
                      className={`absolute left-1/2 bottom-0 h-[1px] -translate-x-1/2 transition-all duration-200 ${
                        openMenu === key ? 'w-6 bg-gradient-to-r from-[#5B8CFF] to-[#8B6CFF]' : 'w-0 bg-gradient-to-r from-[#5B8CFF] to-[#8B6CFF]'
                      } group-hover:w-6`}
                    />
                  </button>
                </div>
              );
            })}

            <a
              href="#how-it-works"
              className="group relative px-3 py-2 text-sm font-medium text-[#C7CED9] hover:text-white transition-colors"
            >
              How it works
              <span className="absolute left-1/2 bottom-0 h-[1px] w-0 -translate-x-1/2 bg-gradient-to-r from-[#5B8CFF] to-[#8B6CFF] transition-all duration-200 group-hover:w-6" />
            </a>
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-2 relative z-10">
            {/* Favorites */}
            <button
              className="hidden sm:flex items-center justify-center w-9 h-9 text-[#7F8999] hover:text-[#5B8CFF] transition-colors"
              aria-label="Favorites"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
            </button>

            {/* Admin entry — only visible to Lombard/Super Admin sessions (UX only; API is the real gate) */}
            <AdminNavLinks />

            {/* Sign in */}
            <Link
              href="/login"
              className="hidden sm:block px-3 py-2 text-sm font-medium text-[#7F8999] hover:text-white transition-colors"
            >
              Sign in
            </Link>

            {/* Become a Lombard Partner CTA */}
            <Link
              href="/partner/register"
              className="group hidden md:inline-flex items-center gap-1.5 px-4 py-2 text-white text-sm font-medium rounded-xl transition-transform hover:scale-[1.04]"
              style={{
                background: 'linear-gradient(135deg, #5B8CFF, #8B6CFF)',
                boxShadow: '0 8px 30px rgba(91,140,255,0.16)',
              }}
            >
              <span>Become a Lombard Partner</span>
              <svg
                className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </Link>

            {/* Mobile menu button */}
            <button
              className="lg:hidden p-2 text-white"
              aria-label="Menu"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d={mobileOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'}
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="lg:hidden animate-slide-down border-t border-white/10 px-5 py-4 relative z-20">
            <div className="flex flex-col gap-1 text-sm font-medium text-[#C7CED9]">
              {[
                ['Shop', '/products'],
                ['Categories', '/products'],
                ['Lombards', '/lombards'],
                ['Sign in', '/account'],
              ].map(([label, href]) => (
                <Link
                  key={label}
                  href={href}
                  className="py-2 hover:text-white transition-colors"
                  onClick={() => setMobileOpen(false)}
                >
                  {label}
                </Link>
              ))}
              <a
                href="#how-it-works"
                className="py-2 hover:text-white transition-colors"
                onClick={() => setMobileOpen(false)}
              >
                How it works
              </a>
              <Link
                href="/partner/register"
                className="mt-2 inline-flex justify-center px-4 py-2.5 text-white rounded-xl"
                style={{ background: 'linear-gradient(135deg, #5B8CFF, #8B6CFF)' }}
                onClick={() => setMobileOpen(false)}
              >
                Become a Lombard Partner
              </Link>
            </div>
          </div>
        )}

        {/* Mega Menu - Shop */}
        {openMenu === 'shop' && (
          <MegaDropdown onEnter={() => openWithDelay('shop')} onLeave={closeWithDelay}>
            <div className="grid grid-cols-3 gap-8">
              {shopMenu.map((col) => (
                <div key={col.title}>
                  <p className="text-xs font-semibold tracking-[0.18em] text-[#7F8999] uppercase mb-4">
                    {col.title}
                  </p>
                  <ul className="space-y-3">
                    {col.items.map((item) => (
                      <li key={item}>
                        <Link
                          href={`/products?q=${item.toLowerCase()}`}
                          className="text-[15px] text-[#C7CED9] hover:text-[#5B8CFF] transition-colors flex items-center gap-2 group"
                        >
                          {item}
                          <span className="opacity-0 group-hover:opacity-100 transition-opacity text-[#5B8CFF]">→</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            <div className="mt-8 pt-5 border-t border-white/10">
              <Link
                href="/products"
                className="inline-flex items-center gap-1 text-sm font-medium text-[#5B8CFF] hover:text-[#8B6CFF] transition-colors"
              >
                View all products
                <span className="transition-transform group-hover:translate-x-1">→</span>
              </Link>
            </div>
          </MegaDropdown>
        )}

        {/* Mega Menu - Categories */}
        {openMenu === 'categories' && (
          <MegaDropdown onEnter={() => openWithDelay('categories')} onLeave={closeWithDelay}>
            <div className="grid grid-cols-[220px_1fr] gap-8">
              <ul className="space-y-1">
                {categories.map((cat) => (
                  <li key={cat.name}>
                    <Link
                      href={`/products?category=${cat.name.toLowerCase()}`}
                      onMouseEnter={() => setHoveredCategory(cat.name)}
                      className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-[15px] transition-all ${
                        hoveredCategory === cat.name
                          ? 'bg-white/5 text-[#5B8CFF] font-medium'
                          : 'text-[#C7CED9] hover:bg-white/5 hover:text-white'
                      }`}
                    >
                      {cat.name}
                      <span className="text-xs opacity-60 group-hover:opacity-100 transition-opacity">→</span>
                    </Link>
                  </li>
                ))}
              </ul>

              <div
                className="relative rounded-2xl border border-white/10 flex items-center justify-center min-h-[300px] overflow-hidden backdrop-blur-sm"
                style={{
                  background: `radial-gradient(60% 60% at 50% 40%, rgba(91,140,255,0.08), rgba(8,13,22,0.7) 70%)`,
                }}
              >
                {/* Subtle constellation decoration */}
                <div className="absolute inset-0 opacity-20">
                  <svg viewBox="0 0 400 300" className="w-full h-full">
                    <circle cx="80" cy="60" r="1.5" fill="#5B8CFF" />
                    <circle cx="150" cy="100" r="1" fill="#8B6CFF" />
                    <circle cx="220" cy="80" r="1.5" fill="#5B8CFF" />
                    <circle cx="280" cy="140" r="1" fill="#8B6CFF" />
                    <circle cx="180" cy="180" r="1.5" fill="#5B8CFF" />
                    <line x1="80" y1="60" x2="150" y2="100" stroke="rgba(91,140,255,0.15)" strokeWidth="0.5" />
                    <line x1="150" y1="100" x2="220" y2="80" stroke="rgba(91,140,255,0.15)" strokeWidth="0.5" />
                    <line x1="220" y1="80" x2="280" y2="140" stroke="rgba(91,140,255,0.15)" strokeWidth="0.5" />
                    <line x1="280" y1="140" x2="180" y2="180" stroke="rgba(91,140,255,0.15)" strokeWidth="0.5" />
                  </svg>
                </div>

                <span
                  key={activeCategory?.name}
                  className="text-[130px] animate-fade-in transition-all duration-300"
                  style={{ filter: 'drop-shadow(0 0 40px rgba(91,140,255,0.15))' }}
                >
                  {activeCategory?.emoji ?? '📱'}
                </span>
                <div className="absolute bottom-5 left-5">
                  <p className="text-lg font-semibold text-white">{activeCategory?.name ?? 'iPhone'}</p>
                  <p className="text-xs text-[#5B8CFF] font-medium">24 offers available</p>
                </div>
              </div>
            </div>
          </MegaDropdown>
        )}

        {/* Mega Menu - Lombards */}
        {openMenu === 'lombards' && (
          <MegaDropdown onEnter={() => openWithDelay('lombards')} onLeave={closeWithDelay}>
            <p className="text-xs font-semibold tracking-[0.18em] text-[#7F8999] uppercase mb-4">
              Featured sellers
            </p>
            <div className="grid grid-cols-2 gap-3">
              {featuredSellers.map((seller) => (
                <Link
                  key={seller.name}
                  href="/lombards"
                  className="flex items-center gap-3 p-3 rounded-xl border border-white/10 hover:border-[#5B8CFF]/50 transition-colors group"
                >
                  <span
                    className="w-10 h-10 rounded-full flex items-center justify-center font-semibold text-white transition-transform group-hover:scale-105"
                    style={{ background: 'linear-gradient(135deg, #5B8CFF, #8B6CFF)' }}
                  >
                    {seller.name.charAt(0)}
                  </span>
                  <span>
                    <span className="block text-sm font-medium text-white">{seller.name}</span>
                    <span className="block text-xs text-[#7F8999]">
                      ★ {seller.rating} · {seller.products} products
                    </span>
                  </span>
                </Link>
              ))}
            </div>
            <div className="mt-5 pt-4 border-t border-white/10">
              <Link
                href="/lombards"
                className="inline-flex items-center gap-1 text-sm font-medium text-[#5B8CFF] hover:text-[#8B6CFF] transition-colors"
              >
                View all lombards
                <span className="transition-transform group-hover:translate-x-1">→</span>
              </Link>
            </div>
          </MegaDropdown>
        )}
      </div>
    </header>
  );
}

// Chevron component
function Chevron({ open }: { open: boolean }) {
  return (
    <svg
      className={`w-3.5 h-3.5 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
  );
}

// Mega Dropdown wrapper
function MegaDropdown({
  children,
  onEnter,
  onLeave,
}: {
  children: React.ReactNode;
  onEnter: () => void;
  onLeave: () => void;
}) {
  return (
    <div
      className="absolute top-full left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-[1280px] mt-2 animate-dropdown"
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
    >
      <div
        className="rounded-[22px] border border-white/10 p-8 shadow-[0_30px_100px_rgba(0,0,0,0.48)] backdrop-blur-[30px]"
        style={{
          background: `linear-gradient(135deg, rgba(9,13,23,0.96), rgba(14,17,34,0.92))`,
        }}
      >
        {children}
      </div>
    </div>
  );
}
