"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

export function StatsCounter() {
  const [mounted, setMounted] = useState(false);
  const [stat1, setStat1] = useState("000+");
  const [stat2, setStat2] = useState("000%");

  useEffect(() => {
    // Reveal at t=0.9s
    const timer = setTimeout(() => {
      setMounted(true);
    }, 900);

    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReducedMotion) {
      setStat1("50+");
      setStat2("100%");
      return () => clearTimeout(timer);
    }

    // Ease-out counter from 1.0s to 3.0s (duration: 2000ms)
    const countTimer = setTimeout(() => {
      const target1 = 50;
      const target2 = 100;
      const duration = 2000;
      const startTime = performance.now();

      const updateCounter = (now: number) => {
        const elapsed = now - startTime;
        const progress = Math.min(1.0, elapsed / duration);
        // Easing curve (ease-out-cubic)
        const ease = 1 - Math.pow(1 - progress, 3);

        const current1 = Math.round(target1 * ease);
        const current2 = Math.round(target2 * ease);

        // Zero-padding during count: e.g. "042+" and "085%" landing on "50+" and "100%"
        const pad1 = current1 < 10 ? `00${current1}` : current1 < 100 ? `0${current1}` : `${current1}`;
        const pad2 = current2 < 10 ? `00${current2}` : current2 < 100 ? `0${current2}` : `${current2}`;

        if (progress < 1.0) {
          setStat1(`${pad1}+`);
          setStat2(`${pad2}%`);
          requestAnimationFrame(updateCounter);
        } else {
          setStat1("50+");
          setStat2("100%");
        }
      };

      requestAnimationFrame(updateCounter);
    }, 1000);

    return () => {
      clearTimeout(timer);
      clearTimeout(countTimer);
    };
  }, []);

  return (
    <div
      className={`w-full max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-14 flex flex-col md:flex-row md:items-end justify-between gap-10 md:gap-8 pb-10 sm:pb-14 transition-all duration-1000 ease-out z-20 ${
        mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
      }`}
    >
      {/* ============================================================ */}
      {/* BOTTOM-LEFT: MUTED PARAGRAPH & SOFT VIOLET CTA PILL          */}
      {/* ============================================================ */}
      <div className="flex flex-col items-start gap-5 max-w-[380px]">
        <p className="text-[13px] sm:text-[14px] leading-relaxed text-white/60 font-normal">
          We empower students with AI intelligence that turns global hackathons, research grants,
          and skills into verified career outcomes.
        </p>

        <Link
          href="/login"
          className="group inline-flex items-center gap-2.5 px-6 py-3 rounded-full bg-[#7C3AED] hover:bg-[#6D28D9] active:scale-95 text-white text-[13px] font-semibold tracking-wide shadow-[0_0_28px_rgba(124,58,237,0.45)] hover:shadow-[0_0_36px_rgba(124,58,237,0.65)] transition-all duration-200"
        >
          <span>Explore Opportunities</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>

      {/* ============================================================ */}
      {/* BOTTOM-RIGHT: 3 STATS WITH ZERO-PADDED COUNT UP              */}
      {/* Large number + tiny 2-line label beside it                   */}
      {/* ============================================================ */}
      <div className="grid grid-cols-3 gap-3 sm:gap-8 lg:gap-14 w-full md:w-auto self-start md:self-end">
        {/* Stat 1 */}
        <div className="flex items-center gap-2 sm:gap-3">
          <span className="text-xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white font-mono">
            {stat1}
          </span>
          <div className="flex flex-col text-[9px] sm:text-[10px] leading-[11px] sm:leading-[13px] text-white/50 uppercase tracking-wider font-sans font-semibold">
            <span>Verified</span>
            <span>Signals</span>
          </div>
        </div>

        {/* Stat 2 */}
        <div className="flex items-center gap-2 sm:gap-3">
          <span className="text-xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white font-mono">
            {stat2}
          </span>
          <div className="flex flex-col text-[9px] sm:text-[10px] leading-[11px] sm:leading-[13px] text-white/50 uppercase tracking-wider font-sans font-semibold">
            <span>Source</span>
            <span>Freshness</span>
          </div>
        </div>

        {/* Stat 3 (Static) */}
        <div className="flex items-center gap-2 sm:gap-3">
          <span className="text-xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white font-mono">
            24/7
          </span>
          <div className="flex flex-col text-[9px] sm:text-[10px] leading-[11px] sm:leading-[13px] text-white/50 uppercase tracking-wider font-sans font-semibold">
            <span>PULSE AI</span>
            <span>Active</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StatsCounter;
