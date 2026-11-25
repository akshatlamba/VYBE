"use client";

import React, { useEffect, useState } from "react";

export function HeadlineReveal() {
  const [mounted, setMounted] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    // Check reduced motion
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setPrefersReducedMotion(reduced);

    // Trigger reveal sequence at t=0.4s
    const timer = setTimeout(() => {
      setMounted(true);
    }, 400);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative z-20 flex flex-col items-center justify-center text-center select-none w-full px-2 sm:px-4">
      <h1 className="flex flex-col items-center tracking-tight text-white font-sans text-[clamp(26px,5.2vw,86px)] leading-[1.1] sm:leading-[1.12]">
        {/* ============================================================ */}
        {/* LINE 1 (Staggered Left of Center)                            */}
        {/* "Turning Signals" with "Signals" in bold true italic         */}
        {/* ============================================================ */}
        <div className="overflow-hidden py-1 sm:py-1.5 md:-translate-x-12 lg:-translate-x-16">
          <div
            className={`flex items-baseline gap-[0.25em] whitespace-nowrap transition-transform duration-[1100ms] ${
              prefersReducedMotion
                ? "translate-y-0"
                : mounted
                ? "translate-y-0"
                : "translate-y-[115%]"
            }`}
            style={{
              transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)", // expo-out curve
              transitionDelay: prefersReducedMotion ? "0ms" : "50ms",
            }}
          >
            <span className="font-light text-white/95">Turning</span>
            <span className="font-extrabold italic text-white tracking-normal drop-shadow-[0_0_35px_rgba(255,255,255,0.2)]">
              Signals
            </span>
          </div>
        </div>

        {/* ============================================================ */}
        {/* LINE 2 (Staggered Offset Right of Center)                     */}
        {/* "Into Actions That Matter" with "Actions" in bold true italic*/}
        {/* ============================================================ */}
        <div className="overflow-hidden py-1 sm:py-1.5 md:translate-x-12 lg:translate-x-16">
          <div
            className={`flex items-baseline gap-[0.25em] whitespace-nowrap transition-transform duration-[1150ms] ${
              prefersReducedMotion
                ? "translate-y-0"
                : mounted
                ? "translate-y-0"
                : "translate-y-[115%]"
            }`}
            style={{
              transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)", // expo-out curve
              transitionDelay: prefersReducedMotion ? "0ms" : "220ms", // staggered +0.17s after line 1
            }}
          >
            <span className="font-light text-white/95">Into</span>
            <span className="font-extrabold italic text-white tracking-normal drop-shadow-[0_0_35px_rgba(255,255,255,0.2)]">
              Actions
            </span>
            <span className="font-light text-white/95">That Matter</span>
          </div>
        </div>
      </h1>
    </div>
  );
}

export default HeadlineReveal;
