"use client";

import React from "react";
import { HeroSection } from "./hero/hero-section";
import { OpportunityRadarPreview } from "./sections/opportunity-radar-preview";
import { PulseAiIntelligence } from "./sections/pulse-ai-intelligence";
import { GrowthPassportLedger } from "./sections/growth-passport-ledger";
import { CommunityHubShowcase } from "./sections/community-hub-showcase";
import { LandingFooter } from "./sections/landing-footer";

export function VybeLandingPage() {
  return (
    <div className="w-full min-h-screen bg-[#030305] text-white overflow-x-hidden selection:bg-[#7C3AED] selection:text-white">
      {/* 1. Hero Section (Edge-to-Edge Keyframe Match) */}
      <HeroSection />

      {/* 2. Below-the-Fold Glass Sections */}
      <main className="relative z-20 flex flex-col gap-12 sm:gap-16">
        <OpportunityRadarPreview />
        <PulseAiIntelligence />
        <GrowthPassportLedger />
        <CommunityHubShowcase />
      </main>

      {/* 3. Landing Page Footer */}
      <LandingFooter />
    </div>
  );
}

export default VybeLandingPage;
