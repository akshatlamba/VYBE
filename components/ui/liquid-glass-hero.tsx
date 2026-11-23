"use client";

import React, { useState, useEffect } from "react";
import LiquidGlass from "liquid-glass-react";
import { cn } from "@/lib/utils";

export interface LiquidGlassHeroProps {
  children: React.ReactNode;
  displacementScale?: number;
  blurAmount?: number;
  saturation?: number;
  aberrationIntensity?: number;
  elasticity?: number;
  cornerRadius?: number;
  overLight?: boolean;
  className?: string;
  containerClassName?: string;
  padding?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
  isDarkFeature?: boolean;
}

export function LiquidGlassHero({
  children,
  displacementScale = 64,
  blurAmount = 0.08,
  saturation = 135,
  aberrationIntensity = 2,
  elasticity = 0.28,
  cornerRadius = 999,
  overLight = false,
  className,
  containerClassName,
  padding = "0px",
  style,
  onClick,
  isDarkFeature = false,
}: LiquidGlassHeroProps) {
  const [mounted, setMounted] = useState(false);
  const [isChromium, setIsChromium] = useState(false);
  const [isTouchOrReducedMotion, setIsTouchOrReducedMotion] = useState(false);

  useEffect(() => {
    setMounted(true);

    if (typeof window !== "undefined") {
      const ua = navigator.userAgent;
      const isSafari = /Safari/.test(ua) && !/Chrome|Chromium|CriOS/.test(ua);
      const isFirefox = /Firefox|FxiOS/.test(ua);
      const hasChromium = !isSafari && !isFirefox && (/Chrome|Chromium|CriOS/.test(ua) || !!(window as any).chrome);
      setIsChromium(hasChromium);

      const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const isTouch = "ontouchstart" in window || (navigator.maxTouchPoints && navigator.maxTouchPoints > 0);
      setIsTouchOrReducedMotion(prefersReducedMotion || Boolean(isTouch));
    }
  }, []);

  // SSR or non-Chromium fallback (Safari, Firefox, etc.)
  if (!mounted || !isChromium) {
    return (
      <div
        className={cn(
          isDarkFeature ? "dark-liquid-glass" : "liquid-glass",
          "transition-all",
          className,
          containerClassName
        )}
        style={{
          borderRadius: `${cornerRadius}px`,
          ...style,
        }}
        onClick={onClick}
      >
        {children}
      </div>
    );
  }

  // Active elasticity: disable on touch or reduced motion for performance
  const activeElasticity = isTouchOrReducedMotion ? 0 : elasticity;

  return (
    <div
      className={cn(
        "relative inline-block liquid-glass-hero-wrapper",
        // Normalize the 4 helper overlay layers so they do not distort flexbox flow
        "[&>div:not(.glass-main)]:!absolute [&>div:not(.glass-main)]:!inset-0 [&>div:not(.glass-main)]:!w-full [&>div:not(.glass-main)]:!h-full [&>div:not(.glass-main)]:!top-0 [&>div:not(.glass-main)]:!left-0 [&>div:not(.glass-main)]:!transform-none",
        "[&>span]:!absolute [&>span]:!inset-0 [&>span]:!w-full [&>span]:!h-full [&>span]:!top-0 [&>span]:!left-0 [&>span]:!transform-none",
        isDarkFeature && "[&_.glass]:!bg-[#1A1A22]/85 [&_.glass]:!border-white/20",
        containerClassName
      )}
    >
      <LiquidGlass
        className={cn("glass-main", className)}
        displacementScale={displacementScale}
        blurAmount={blurAmount}
        saturation={saturation}
        aberrationIntensity={aberrationIntensity}
        elasticity={activeElasticity}
        cornerRadius={cornerRadius}
        overLight={overLight}
        padding={padding}
        style={style}
        onClick={onClick}
      >
        {children}
      </LiquidGlass>
    </div>
  );
}

export default LiquidGlassHero;
