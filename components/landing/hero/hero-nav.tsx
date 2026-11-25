"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { VybeSymbol } from "@/components/ui/vybe-logo";

const NAV_LINKS = [
  { label: "Radar", href: "#radar" },
  { label: "PULSE", href: "#pulse" },
  { label: "Passport", href: "#passport" },
  { label: "World Graph", href: "#world-graph" },
  { label: "Community", href: "#community" },
];

export function HeroNav() {
  const [mounted, setMounted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <nav className="w-full relative z-40 select-none">
      {/* ============================================================ */}
      {/* 1PX TOP HAIRLINE ANIMATED LEFT-TO-RIGHT                      */}
      {/* ============================================================ */}
      <div
        className="absolute top-0 left-0 right-0 h-[1px] bg-white/[0.14] origin-left transition-transform duration-1000 ease-out pointer-events-none"
        style={{
          transform: mounted ? "scaleX(1)" : "scaleX(0)",
        }}
        aria-hidden="true"
      />

      {/* Main Nav Container */}
      <div
        className={`max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-14 h-20 sm:h-24 flex items-center justify-between transition-all duration-700 ease-out ${
          mounted ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-3"
        }`}
      >
        {/* ============================================================ */}
        {/* BRAND WORDMARK (LEFT)                                        */}
        {/* Thin, wide-tracked uppercase sans-serif                      */}
        {/* ============================================================ */}
        <Link
          href="/"
          className="flex items-center gap-2.5 group focus:outline-none"
        >
          <VybeSymbol size={22} className="group-hover:scale-105 transition-transform" />
          <span className="text-[12px] sm:text-[13px] font-medium tracking-[0.34em] text-white/95 uppercase font-sans group-hover:text-white transition-colors">
            VYBE
          </span>
        </Link>

        {/* ============================================================ */}
        {/* 5 CENTERED TEXT LINKS (DESKTOP)                              */}
        {/* ============================================================ */}
        <div className="hidden md:flex items-center gap-8 lg:gap-11">
          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-[12px] font-medium tracking-[0.09em] text-white/60 hover:text-white transition-colors duration-200 uppercase font-sans"
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* ============================================================ */}
        {/* OUTLINED PILL CTA (RIGHT)                                    */}
        {/* Outlined glass pill with circular white arrow button         */}
        {/* ============================================================ */}
        <div className="hidden sm:flex items-center gap-3">
          <Link
            href="/login"
            className="group flex items-center gap-2.5 pl-4 pr-1.5 py-1.5 rounded-full border border-white/20 hover:border-white/45 bg-white/[0.03] hover:bg-white/[0.07] backdrop-blur-md transition-all duration-200"
          >
            <span className="text-[12px] font-semibold text-white tracking-wide pl-1">
              Launch Portal
            </span>
            <div className="w-7 h-7 rounded-full bg-white flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform duration-200 shadow-sm">
              <ArrowUpRight className="w-4 h-4 text-black stroke-[2.2]" />
            </div>
          </Link>
        </div>

        {/* Mobile Hamburger Button */}
        <div className="flex md:hidden items-center">
          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-label="Toggle Navigation Menu"
            className="p-2 rounded-xl text-white/70 hover:text-white hover:bg-white/10 transition-colors"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* ============================================================ */}
      {/* MOBILE GLASS OVERLAY MENU                                    */}
      {/* ============================================================ */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-x-4 top-24 rounded-3xl bg-[#0D0E14]/95 backdrop-blur-2xl border border-white/10 p-6 shadow-2xl flex flex-col gap-4 z-50">
          <div className="flex flex-col gap-3 py-2 border-b border-white/10">
            {NAV_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-sm font-semibold tracking-wide text-white/80 hover:text-white py-2"
              >
                {link.label}
              </a>
            ))}
          </div>

          <Link
            href="/login"
            onClick={() => setMobileMenuOpen(false)}
            className="w-full flex items-center justify-between px-5 py-3 rounded-full bg-[#7C3AED] text-white font-bold text-sm shadow-[0_0_25px_rgba(124,58,237,0.4)]"
          >
            <span>Launch Portal</span>
            <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center">
              <ArrowUpRight className="w-3.5 h-3.5 text-black" />
            </div>
          </Link>
        </div>
      )}
    </nav>
  );
}

export default HeroNav;
