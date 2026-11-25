"use client";

import React, { useEffect, useState } from "react";

export function AmbientLightBeams() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Eased fade-in for ambient lighting
    const timer = setTimeout(() => setMounted(true), 50);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden select-none z-0">
      {/* ============================================================ */}
      {/* 1. TOP-LEFT SOFT VIOLET/INDIGO LIGHT CONE                    */}
      {/* Sweeps in from top-left corner spreading diagonally down-right*/}
      {/* ============================================================ */}
      <div
        className={`absolute -top-32 -left-20 w-[80vw] max-w-[950px] h-[95vh] max-h-[850px] transition-all duration-[1400ms] ease-out ${
          mounted ? "opacity-100 scale-100 translate-x-0" : "opacity-0 scale-90 -translate-x-12 -translate-y-12"
        }`}
        style={{
          background:
            "radial-gradient(ellipse at 15% 10%, rgba(99, 102, 241, 0.32) 0%, rgba(124, 58, 237, 0.22) 28%, rgba(79, 70, 229, 0.12) 50%, transparent 75%)",
          filter: "blur(60px)",
          transform: "rotate(-12deg)",
        }}
        aria-hidden="true"
      />

      {/* Secondary soft violet directional sweep */}
      <div
        className={`absolute top-0 left-0 w-[60vw] max-w-[700px] h-[80vh] transition-opacity duration-[1800ms] ease-out ${
          mounted ? "opacity-80" : "opacity-0"
        }`}
        style={{
          background:
            "linear-gradient(135deg, rgba(124, 58, 237, 0.25) 0%, rgba(99, 102, 241, 0.14) 35%, transparent 68%)",
          filter: "blur(75px)",
        }}
        aria-hidden="true"
      />

      {/* ============================================================ */}
      {/* 2. DELIBERATE ADDITION: MIRRORED AMBER BEAM (FORMING "V")    */}
      {/* Controlled by CSS variable --enable-vybe-v-beam              */}
      {/* ============================================================ */}
      <div
        className={`absolute -top-28 -right-20 w-[60vw] max-w-[750px] h-[85vh] transition-all duration-[1600ms] ease-out ${
          mounted ? "opacity-100 scale-100 translate-x-0" : "opacity-0 scale-90 translate-x-12 -translate-y-12"
        }`}
        style={{
          opacity: "var(--enable-vybe-v-beam, 1)",
          background:
            "radial-gradient(ellipse at 85% 10%, rgba(251, 191, 36, 0.15) 0%, rgba(245, 158, 11, 0.08) 32%, transparent 70%)",
          filter: "blur(70px)",
          transform: "rotate(12deg)",
        }}
        aria-hidden="true"
      />

      {/* ============================================================ */}
      {/* 3. HUGE GHOST BRAND WORDMARK ("VYBE")                        */}
      {/* Sits at 4-6% opacity behind headline, wider than viewport    */}
      {/* ============================================================ */}
      <div
        className={`absolute inset-x-0 top-[26%] sm:top-[28%] flex items-center justify-center pointer-events-none select-none transition-opacity duration-[1200ms] ease-out ${
          mounted ? "opacity-100" : "opacity-0"
        }`}
        aria-hidden="true"
      >
        <span
          className="font-black text-[23vw] tracking-[0.16em] uppercase whitespace-nowrap text-white"
          style={{
            opacity: 0.048, // Precise 4.8% opacity matching reference images
            letterSpacing: "0.18em",
            userSelect: "none",
            transform: "translateY(-5%) scaleY(0.96)",
          }}
        >
          VYBE
        </span>
      </div>
    </div>
  );
}

export default AmbientLightBeams;
