"use client";

import React, { useState, useEffect } from "react";
import LiquidGlass from "liquid-glass-react";
import { Plus, Bell, Sun, GraduationCap } from "lucide-react";

export default function TestGlassPage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <div>Mounting...</div>;

  return (
    <div className="p-12 min-h-screen bg-gradient-to-tr from-[#FAD8C6] via-[#F6C9DD] to-[#D9C9F5] flex flex-col gap-8 items-center justify-center">
      <h1 className="text-2xl font-bold">Header Controls Glass Test (Overlays Absolute)</h1>
      
      <div className="flex items-center gap-2.5 p-4 rounded-3xl bg-white/20 backdrop-blur-md">
        {/* Helper class container */}
        <div className="relative inline-block [&>div:not(.glass-main)]:!absolute [&>div:not(.glass-main)]:!inset-0 [&>div:not(.glass-main)]:!w-full [&>div:not(.glass-main)]:!h-full [&>div:not(.glass-main)]:!top-0 [&>div:not(.glass-main)]:!left-0 [&>div:not(.glass-main)]:!transform-none [&>span]:!absolute [&>span]:!inset-0 [&>span]:!w-full [&>span]:!h-full [&>span]:!top-0 [&>span]:!left-0 [&>span]:!transform-none">
          <LiquidGlass
            className="glass-main"
            displacementScale={64}
            blurAmount={0.08}
            saturation={135}
            aberrationIntensity={2}
            elasticity={0.28}
            cornerRadius={999}
            padding="6px 14px"
            overLight={true}
          >
            <div className="flex items-center gap-1.5 text-xs font-semibold text-[#1E1E22]">
              <GraduationCap className="w-3.5 h-3.5" />
              <span>Student</span>
            </div>
          </LiquidGlass>
        </div>

        {/* 2. Theme Toggle */}
        <div className="relative inline-block [&>div:not(.glass-main)]:!absolute [&>div:not(.glass-main)]:!inset-0 [&>div:not(.glass-main)]:!w-full [&>div:not(.glass-main)]:!h-full [&>div:not(.glass-main)]:!top-0 [&>div:not(.glass-main)]:!left-0 [&>div:not(.glass-main)]:!transform-none [&>span]:!absolute [&>span]:!inset-0 [&>span]:!w-full [&>span]:!h-full [&>span]:!top-0 [&>span]:!left-0 [&>span]:!transform-none">
          <LiquidGlass
            className="glass-main"
            displacementScale={64}
            blurAmount={0.08}
            saturation={135}
            aberrationIntensity={2}
            elasticity={0.28}
            cornerRadius={999}
            padding="10px"
            overLight={true}
          >
            <Sun className="w-4 h-4 text-[#1E1E22]" />
          </LiquidGlass>
        </div>

        {/* 3. + Button */}
        <div className="relative inline-block [&>div:not(.glass-main)]:!absolute [&>div:not(.glass-main)]:!inset-0 [&>div:not(.glass-main)]:!w-full [&>div:not(.glass-main)]:!h-full [&>div:not(.glass-main)]:!top-0 [&>div:not(.glass-main)]:!left-0 [&>div:not(.glass-main)]:!transform-none [&>span]:!absolute [&>span]:!inset-0 [&>span]:!w-full [&>span]:!h-full [&>span]:!top-0 [&>span]:!left-0 [&>span]:!transform-none">
          <LiquidGlass
            className="glass-main"
            displacementScale={64}
            blurAmount={0.08}
            saturation={135}
            aberrationIntensity={2}
            elasticity={0.28}
            cornerRadius={999}
            padding="10px"
            overLight={true}
          >
            <div className="w-5 h-5 flex items-center justify-center bg-[#1E1E22] text-white rounded-full">
              <Plus className="w-4 h-4" />
            </div>
          </LiquidGlass>
        </div>

        {/* 4. Bell Button */}
        <div className="relative inline-block [&>div:not(.glass-main)]:!absolute [&>div:not(.glass-main)]:!inset-0 [&>div:not(.glass-main)]:!w-full [&>div:not(.glass-main)]:!h-full [&>div:not(.glass-main)]:!top-0 [&>div:not(.glass-main)]:!left-0 [&>div:not(.glass-main)]:!transform-none [&>span]:!absolute [&>span]:!inset-0 [&>span]:!w-full [&>span]:!h-full [&>span]:!top-0 [&>span]:!left-0 [&>span]:!transform-none">
          <LiquidGlass
            className="glass-main"
            displacementScale={64}
            blurAmount={0.08}
            saturation={135}
            aberrationIntensity={2}
            elasticity={0.28}
            cornerRadius={999}
            padding="10px"
            overLight={true}
          >
            <Bell className="w-4 h-4 text-[#1E1E22]" />
          </LiquidGlass>
        </div>
      </div>
    </div>
  );
}
