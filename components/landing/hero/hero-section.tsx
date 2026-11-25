"use client";

import React, { useRef } from "react";
import dynamic from "next/dynamic";
import { HeroNav } from "./hero-nav";
import { AmbientLightBeams } from "./ambient-light-beams";
import { HeadlineReveal } from "./headline-reveal";
import { StatsCounter } from "./stats-counter";
import { CustomCursor } from "./custom-cursor";

// Dynamic import for Three.js canvas to ensure 100% SSR safety
const PointCloudSphere = dynamic(() => import("./point-cloud-sphere"), {
  ssr: false,
  loading: () => <div className="w-full h-full" />,
});

export function HeroSection() {
  const heroRef = useRef<HTMLDivElement>(null);

  return (
    <section
      ref={heroRef}
      className="relative w-full min-h-screen bg-[#030305] text-white flex flex-col justify-between overflow-hidden vybe-hero-cursor-area select-none"
    >
      {/* 1. Ambient Lighting (Violet cone + mirrored V-beam + Ghost "VYBE" wordmark) */}
      <AmbientLightBeams />

      {/* 2. Top Nav with 1px animated hairline */}
      <HeroNav />

      {/* 3. Center Stage (Point-Cloud Sphere + Staggered Headline ON TOP) */}
      <div className="relative flex-1 flex items-center justify-center w-full my-auto py-12 sm:py-16">
        {/* Three.js GPU Point-Cloud Sphere (Centred, diameter ~28% hero width) */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-auto z-10">
          <div className="w-[340px] sm:w-[420px] md:w-[480px] lg:w-[540px] aspect-square flex items-center justify-center">
            <PointCloudSphere className="w-full h-full" />
          </div>
        </div>

        {/* Staggered 2-Line Headline (Renders ON TOP of the sphere at z-20) */}
        <div className="relative z-20 pointer-events-none w-full max-w-5xl mx-auto">
          <HeadlineReveal />
        </div>
      </div>

      {/* 4. Bottom Row (Paragraph & Violet CTA on left, 3 counting stats on right) */}
      <StatsCounter />

      {/* 5. Custom Lerped SVG Pointer Cursor */}
      <CustomCursor containerRef={heroRef} />
    </section>
  );
}

export default HeroSection;
