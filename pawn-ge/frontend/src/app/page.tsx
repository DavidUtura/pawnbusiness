'use client';

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import OrbitalHeader from "@/components/header/OrbitalHeader";
import CategoryObservatory from "@/components/categories/CategoryObservatory";

const shopMenu = [
  { title: "Smartphones", items: ["iPhone", "Samsung", "Google"] },
  { title: "Laptops", items: ["MacBook", "Lenovo", "Windows"] },
  { title: "Gaming", items: ["PlayStation", "Xbox", "Nintendo"] },
];

const categories = [
  { name: "iPhone", emoji: "📱" },
  { name: "MacBook", emoji: "💻" },
  { name: "Samsung", emoji: "📱" },
  { name: "PlayStation", emoji: "🎮" },
  { name: "Cameras", emoji: "📷" },
  { name: "Apple Watch", emoji: "⌚" },
  { name: "AirPods", emoji: "🎧" },
  { name: "Laptops", emoji: "💻" },
];

const featuredSellers = [
  { name: "Lombard Elite", rating: 4.8, products: 124 },
  { name: "Pawn House", rating: 4.7, products: 89 },
];

const products = [
  { id: 1, brand: "Apple", name: "iPhone 15 Pro", specs: "256GB", price: 1390, offers: 6, emoji: "📱" },
  { id: 2, brand: "Apple", name: "MacBook Air M2", specs: "256GB SSD", price: 1850, offers: 4, emoji: "💻" },
  { id: 3, brand: "Sony", name: "PlayStation 5", specs: "Disc Edition", price: 1250, offers: 3, emoji: "🎮" },
  { id: 4, brand: "Samsung", name: "Galaxy S24 Ultra", specs: "256GB", price: 1699, offers: 5, emoji: "📱" },
];

const offers = [
  { lombard: "Lombard A", price: 1390 },
  { lombard: "Lombard B", price: 1450 },
  { lombard: "Lombard C", price: 1490 },
];

const steps = [
  { number: "01", title: "Search", description: "Find the device you want." },
  { number: "02", title: "Compare", description: "Compare offers from different pawn shops." },
  { number: "03", title: "Buy", description: "Reserve, pick up or get it delivered." },
];

const searchSuggestions = ["iPhone 15", "iPhone 15 Pro", "iPhone 15 Pro Max"];

const marketItems = [
  "iPhone 15 Pro ↓ ₾80",
  "MacBook Air added",
  "PS5 — 4 new offers",
  "Samsung S24 ↓ ₾120",
  "AirPods Pro 2 added",
  "Apple Watch ↓ ₾45",
];

const geoCities = [
  { name: "Tbilisi", devices: 1248, shops: 42, top: "72%", left: "72%", size: "lg" },
  { name: "Batumi", devices: 182, shops: 8, top: "80%", left: "18%", size: "md" },
  { name: "Kutaisi", devices: 214, shops: 11, top: "58%", left: "34%", size: "md" },
  { name: "Rustavi", devices: 96, shops: 5, top: "58%", left: "78%", size: "sm" },
  { name: "Zugdidi", devices: 48, shops: 3, top: "38%", left: "22%", size: "sm" },
];

export default function Home() {
  const [scrolled, setScrolled] = useState(false);
  const [openMenu, setOpenMenu] = useState<null | "shop" | "categories" | "lombards">(null);
  const [hoveredCategory, setHoveredCategory] = useState<string | null>("iPhone");
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [cursor, setCursor] = useState({ x: -600, y: -600 });
  const headerRef = useRef<HTMLElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useReveal();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onMove = (e: MouseEvent) => setCursor({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (headerRef.current && !headerRef.current.contains(e.target as Node)) setOpenMenu(null);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const openWithDelay = (menu: "shop" | "categories" | "lombards") => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpenMenu(menu);
  };

  const closeWithDelay = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setOpenMenu(null), 150);
  };

  const activeCategory = categories.find((c) => c.name === hoveredCategory);

  const filtered = query
    ? searchSuggestions.filter((s) => s.toLowerCase().includes(query.toLowerCase()))
    : searchSuggestions;

  return (
    <div className="relative min-h-screen overflow-x-hidden text-[#F5F7FA]">
      {/* The global cosmic environment is mounted once at layout level.
          Page content sits above it via this z-index wrapper. */}
      <div className="relative z-10">
        {/* Orbital Header Component */}
        <OrbitalHeader
          scrolled={scrolled}
          openMenu={openMenu}
          setOpenMenu={setOpenMenu}
          hoveredCategory={hoveredCategory}
          setHoveredCategory={setHoveredCategory}
          mobileOpen={mobileOpen}
          setMobileOpen={setMobileOpen}
          cursor={cursor}
        />

        {/* Hero Section - Dark Cosmic Environment */}
        <section className="relative overflow-hidden">
          <div className="relative z-10 max-w-[1320px] mx-auto px-6 pt-20 pb-20 md:pt-28 md:pb-28">
            <div className="max-w-3xl mx-auto text-center">
              <div className="animate-fade-in-up">
                <p className="text-xs font-semibold tracking-[0.2em] text-[#5B8CFF] uppercase mb-6">Second-hand tech marketplace</p>

                <h1 className="hero-headline text-white mb-6">
                  Find it.
                  <br />
                  Compare it.
                  <br />
                  <span className="grad-text">Buy it.</span>
                </h1>

                <p className="text-lg text-[#C9D0DB] max-w-xl mx-auto mb-8">
                  Discover phones, laptops, gaming consoles and more from pawn shops across Georgia.
                </p>

                <div className="relative max-w-[560px] mx-auto mb-5 text-left">
                  <div className="search-pill flex items-center rounded-[26px] pl-6 pr-2 h-[64px]">
                    <input
                      type="text"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      onFocus={() => setSearchOpen(true)}
                      onBlur={() => setTimeout(() => setSearchOpen(false), 150)}
                      placeholder="Search iPhone, MacBook, PlayStation..."
                      className="flex-1 bg-transparent text-base text-[#F5F7FA] focus:outline-none placeholder-[#7F8999]"
                    />
                    <span className="flex items-center justify-center w-12 h-12 text-white rounded-[18px]" style={{ background: "linear-gradient(135deg, #5B8CFF, #8B6CFF)" }}>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </span>
                  </div>

                  {searchOpen && (
                    <div className="absolute left-0 right-0 top-[calc(100%+10px)] z-40 rounded-2xl border border-white/10 shadow-soft p-5 animate-dropdown backdrop-blur-xl" style={{ background: "rgba(8,13,22,0.92)" }}>
                      <p className="text-xs font-semibold tracking-[0.15em] text-[#7F8999] uppercase mb-4">
                        {query ? "Products" : "Search products"}
                      </p>
                      <div className="space-y-1">
                        {filtered.length > 0 ? (
                          filtered.map((s) => (
                            <Link key={s} href={`/products?q=${encodeURIComponent(s)}`} className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/5 transition-colors">
                              <span className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: "linear-gradient(135deg, rgba(91,140,255,0.15), rgba(139,108,255,0.15))" }}>📱</span>
                              <span className="text-[15px] text-[#F5F7FA]">{s}</span>
                            </Link>
                          ))
                        ) : (
                          <p className="px-3 py-2 text-sm text-[#7F8999]">No matches</p>
                        )}
                      </div>
                      <div className="mt-4 pt-4 border-t border-white/10">
                        <p className="text-xs font-medium text-[#5B8CFF]">12 offers available</p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex flex-wrap items-center justify-center gap-2 text-sm">
                  <span className="text-[#C9D0DB] mr-1">Popular:</span>
                  {["iPhone 15", "MacBook", "PS5", "Samsung", "AirPods"].map((item) => (
                    <Link key={item} href={`/products?q=${encodeURIComponent(item)}`} className="tag-pop px-3 py-1.5 rounded-full text-[#C9D0DB] hover:text-[#5B8CFF] transition-colors">
                      {item}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Live market strip - dark cosmic */}
        <div className="group/strip overflow-hidden backdrop-blur-sm" style={{ background: "linear-gradient(90deg, rgba(8,13,22,0.55), rgba(11,18,32,0.4), rgba(8,13,22,0.55))" }}>
          <div className="marquee-mask">
            <div className="flex w-max animate-marquee group-hover/strip:[animation-play-state:paused] items-center gap-10 py-3.5 text-sm">
              <span className="flex items-center gap-2 shrink-0">
                <span className="w-1.5 h-1.5 rounded-full bg-[#5B8CFF] animate-pulse" />
                <span className="text-xs font-semibold tracking-[0.15em] text-white uppercase">Live market</span>
              </span>
              {[...marketItems, ...marketItems].map((item, i) => (
                <span key={i} className="flex items-center gap-2 whitespace-nowrap">
                  <span className="text-[#F5F7FA] hover:text-[#5B8CFF] transition-colors cursor-default">{item}</span>
                  <span className="text-[#3a4a5a]">·</span>
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Category Observatory Component */}
        <CategoryObservatory
          hoveredCategory={hoveredCategory}
          setHoveredCategory={setHoveredCategory}
        />

        {/* Products - Dark glass cards on cosmic background */}
        <section className="reveal relative max-w-[1320px] mx-auto px-6 py-20 md:py-28">
          <div className="pointer-events-none absolute -top-20 right-0 w-[380px] h-[380px] rounded-full opacity-15" style={{ background: "radial-gradient(circle, #5B8CFF, transparent 70%)", filter: "blur(80px)" }} />
          <div className="flex items-end justify-between mb-10">
            <h2 className="section-heading text-[#F5F7FA]">Popular right now</h2>
            <Link href="/products" className="hidden md:flex items-center gap-1 text-sm font-medium text-[#5B8CFF]">
              View all
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product, i) => (
              <Link key={product.id} href="/products" style={{ transitionDelay: `${i * 60}ms` }} className="reveal product-card group rounded-[26px] overflow-hidden">
                <div className="relative">
                  <div className="aspect-square flex items-center justify-center product-image">
                    <span className="text-9xl drop-shadow-[0_20px_30px_rgba(0,0,0,0.4)]">{product.emoji}</span>
                  </div>
                  <span className="absolute top-4 right-4 p-2 text-[#7F8999] hover:text-[#5B8CFF] transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </span>
                </div>
                <div className="p-5">
                  <p className="text-xs text-[#7F8999] mb-1">{product.brand}</p>
                  <h3 className="font-semibold text-[#F5F7FA]">{product.name}</h3>
                  <p className="text-sm text-[#7F8999] mb-4">{product.specs}</p>
                  <div className="flex items-center justify-between">
                    <span className="product-price text-xl font-bold text-[#F5F7FA] transition-colors">₾{product.price.toLocaleString()}</span>
                    <span className="text-sm font-medium text-[#5B8CFF]">
                      {product.offers} offers
                      <span className="inline-block ml-1 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all">→</span>
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Dark comparison - cosmic control panel */}
        <section className="reveal relative overflow-hidden" style={{ background: "linear-gradient(135deg, rgba(8,13,22,0.6), rgba(11,18,32,0.45) 55%, rgba(5,7,11,0.6))" }}>
          <div className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full opacity-20" style={{ background: "radial-gradient(circle, rgba(91,140,255,0.25), transparent 65%)", filter: "blur(90px)" }} />
          <div className="relative max-w-[1320px] mx-auto px-6 py-20 md:py-28">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className="section-heading text-[#F5F7FA] mb-4">
                  One product.
                  <br />
                  Multiple offers.
                </h2>
                <p className="text-[#C9D0DB] max-w-sm">Compare prices from different pawn shops and choose the best one for you.</p>
              </div>

              <div className="rounded-[30px] border border-white/10 p-8 backdrop-blur-sm" style={{ background: "rgba(255,255,255,0.03)" }}>
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 rounded-xl flex items-center justify-center" style={{ background: "rgba(91,140,255,0.12)" }}>
                    <span className="text-2xl">📱</span>
                  </div>
                  <div>
                    <p className="font-semibold text-white">iPhone 15 Pro</p>
                    <p className="text-sm text-[#9fb0a8]">256GB</p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3 mb-6">
                  {offers.map((offer, i) => (
                    <div key={offer.lombard} className={`rounded-2xl border p-4 text-center transition-all hover:-translate-y-1 ${i === 0 ? "border-[#5B8CFF] bg-[#5B8CFF]/10" : "border-white/10 hover:border-white/25"}`}>
                      <p className={`text-lg font-bold ${i === 0 ? "text-[#5B8CFF]" : "text-white"}`}>₾{offer.price.toLocaleString()}</p>
                      <p className="text-[11px] text-[#7F8999] mt-1">{offer.lombard}</p>
                      {i === 0 && <p className="text-[10px] font-semibold text-[#5B8CFF] mt-1 tracking-wide">BEST PRICE</p>}
                    </div>
                  ))}
                </div>

                <Link
                  href="/products"
                  className="group inline-flex items-center gap-2 px-6 py-3 text-[#F5F7FA] font-semibold rounded-xl transition-transform hover:scale-[1.03]"
                  style={{ background: "linear-gradient(135deg, #5B8CFF, #8B6CFF)" }}
                >
                  Compare all
                  <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Georgia map - Dark cosmic Lombard discovery */}
        <section className="reveal relative overflow-hidden" style={{ background: "linear-gradient(180deg, rgba(8,13,22,0.55), rgba(11,18,32,0.4) 60%, rgba(5,7,11,0.6))" }}>
          <div className="blob blob-b" style={{ width: 480, height: 480, top: "10%", left: "-8%", background: "#5B8CFF", opacity: 0.08 }} />
          <div className="blob blob-c" style={{ width: 420, height: 420, bottom: "-10%", right: "-6%", background: "#8B6CFF", opacity: 0.08 }} />

          <div className="relative max-w-[1320px] mx-auto px-6 py-20 md:py-28">
            <div className="mb-10">
              <h2 className="section-heading text-[#F5F7FA]">Find Lombards Near You</h2>
              <p className="text-[#7F8999] mt-2">Explore pawn shops across Georgia, compare sellers, and discover what they have available.</p>
            </div>

            <div className="grid lg:grid-cols-[1.2fr_1fr] gap-10 items-center">
              <div className="relative rounded-[32px_44px_36px_28px] border border-white/10 min-h-[420px] overflow-hidden" style={{ background: "rgba(8,13,22,0.55)" }}>
                <svg viewBox="0 0 400 300" className="absolute inset-0 w-full h-full p-10" fill="none" stroke="#3a4a5a" strokeWidth="1.5">
                  <path d="M60 40 L180 25 L250 55 L300 50 L345 85 L330 140 L360 175 L335 225 L270 250 L210 235 L150 265 L95 240 L70 195 L45 160 L50 110 Z" />
                </svg>

                {geoCities.map((city) => {
                  const dot = city.size === "lg" ? "w-4 h-4" : city.size === "md" ? "w-3 h-3" : "w-2.5 h-2.5";
                  return (
                    <Link key={city.name} href={`/products?city=${city.name.toLowerCase()}`} className="group absolute" style={{ top: city.top, left: city.left }}>
                      <span className={`map-point block ${dot} rounded-full`} style={{ background: "linear-gradient(135deg, #5B8CFF, #8B6CFF)" }} />
                      <span className="absolute left-1/2 -translate-x-1/2 mt-3 hidden group-hover:block animate-rise">
                        <span className="block text-white text-xs rounded-xl px-3 py-2 whitespace-nowrap shadow-lg" style={{ background: "linear-gradient(135deg, #080D16, #0B1220)" }}>
                          <span className="block font-semibold">{city.name}</span>
                          <span className="block text-[#5B8CFF] mt-0.5">{city.devices.toLocaleString()} devices · {city.shops} lombards</span>
                          <span className="block text-[#7F8999] mt-1">Explore {city.name} →</span>
                        </span>
                      </span>
                    </Link>
                  );
                })}
              </div>

              <div className="rounded-[30px] p-8 border border-white/10 backdrop-blur-sm" style={{ background: "rgba(8,13,22,0.7)" }}>
                <div className="flex items-center gap-2 mb-6">
                  <span className="w-2 h-2 rounded-full bg-[#5B8CFF] animate-pulse" />
                  <span className="text-xs font-semibold tracking-[0.15em] text-[#5B8CFF] uppercase">Lombards near you</span>
                </div>
                <ul className="space-y-1">
                  {geoCities.map((city) => (
                    <li key={city.name}>
                      <Link href={`/products?city=${city.name.toLowerCase()}`} className="group flex items-center justify-between py-3 border-b border-white/10 last:border-0">
                        <span className="text-white font-medium group-hover:text-[#5B8CFF] transition-colors">{city.name}</span>
                        <span className="text-sm text-[#7F8999]">
                          {city.devices.toLocaleString()} devices
                          <span className="inline-block ml-2 text-[#5B8CFF] opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* How it works - dark cosmic path */}
        <section id="how-it-works" className="reveal" style={{ background: "linear-gradient(180deg, #080D16, #0B1220 55%, #05070B)" }}>
          <div className="max-w-[1320px] mx-auto px-6 py-20 md:py-28">
            <h2 className="section-heading text-[#F5F7FA] mb-16 text-center">Buying second-hand tech, simplified.</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-4xl mx-auto">
              {steps.map((step) => (
                <div key={step.number} className="group relative">
                  <span className="block text-7xl md:text-8xl font-bold text-[#3a4a5a] group-hover:text-[#5B8CFF] transition-colors mb-3">{step.number}</span>
                  <h3 className="text-xl font-semibold text-[#F5F7FA] uppercase tracking-wide mb-2 group-hover:-translate-y-0.5 transition-transform">{step.title}</h3>
                  <p className="text-[#7F8999]">{step.description}</p>
                  <span className="mt-4 block h-px w-0 bg-[#5B8CFF] group-hover:w-14 transition-all duration-300" />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* For Lombards - dark cosmic */}
        <section className="reveal relative overflow-hidden" style={{ background: "linear-gradient(135deg, rgba(8,13,22,0.55), rgba(11,18,32,0.4) 55%, rgba(5,7,11,0.6))" }}>
          <div className="pointer-events-none absolute inset-0" style={{ background: "radial-gradient(50% 60% at 78% 30%, rgba(91,140,255,0.15), transparent 70%)" }} />
          <div className="relative max-w-[1320px] mx-auto px-6 py-20 md:py-28">
            <div className="max-w-2xl">
              <h2 className="section-heading text-white mb-6">
                Your inventory.
                <br />
                Online.
              </h2>
              <p className="text-[#C9D0DB] text-lg mb-10 max-w-md">Put your pawn shop inventory in front of more customers with Pawn.ge.</p>
              <Link
                href="/partner/register"
                className="group inline-flex items-center gap-2 px-8 py-4 text-[#F5F7FA] font-semibold rounded-xl transition-transform hover:scale-[1.04]"
                style={{ background: "linear-gradient(135deg, #5B8CFF, #8B6CFF)" }}
              >
                Become a Lombard Partner
                <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </div>
        </section>

        {/* Footer - dark cosmic */}
        <footer style={{ background: "linear-gradient(180deg, rgba(5,7,11,0.72), rgba(8,13,22,0.6))" }}>
          <div className="footer-line" />
          <div className="max-w-[1320px] mx-auto px-6 py-16">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
              <div className="col-span-2 md:col-span-1">
                <h3 className="text-xl font-bold text-white">Pawn.ge</h3>
              </div>

              {[
                { title: "Marketplace", links: [["Products", "/products"], ["Lombards", "/lombards"], ["How it works", "#how-it-works"]] },
                { title: "Business", links: [["For Lombards", "/partner/register"], ["Partner with us", "/partner/register"]] },
                { title: "Support", links: [["Contact", "#"], ["Terms", "#"], ["Privacy", "#"]] },
              ].map((col) => (
                <div key={col.title}>
                  <h4 className="font-semibold text-white mb-4">{col.title}</h4>
                  <ul className="space-y-3 text-sm">
                    {col.links.map(([label, href]) => (
                      <li key={label}>
                        <Link href={href} className="group inline-flex items-center gap-1 text-[#7F8999] hover:text-[#5B8CFF] transition-colors">
                          {label}
                          <span className="opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all">→</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <div className="pt-8 border-t border-white/10">
              <p className="text-sm text-[#7F8999]">© 2026 Pawn.ge</p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

function Chevron({ open }: { open: boolean }) {
  return (
    <svg className={`w-3.5 h-3.5 transition-transform duration-200 ${open ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
  );
}

function Mega({ children, onEnter, onLeave }: { children: React.ReactNode; onEnter: () => void; onLeave: () => void }) {
  return (
    <div
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      className="animate-dropdown absolute left-0 right-0 top-[calc(100%+10px)] z-40 border border-white/10 rounded-2xl shadow-[0_28px_70px_rgba(0,0,0,0.45)] p-7 backdrop-blur-xl"
      style={{ background: "linear-gradient(135deg, rgba(8,13,22,0.94), rgba(11,18,32,0.9) 60%, rgba(8,13,22,0.94))" }}
    >
      {children}
    </div>
  );
}

function useReveal() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );

    const els = document.querySelectorAll(".reveal");
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
}