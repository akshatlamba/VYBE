"use client";

import React, { useState, useEffect, useId } from "react";
import { cn } from "@/lib/utils";

export interface ProgressRingProps {
  progress: number; // 0 to 100
  size?: number; // diameter in px (e.g. 144, 150, 160)
  trackWidth?: number; // stroke width of background ring in viewBox (default 24)
  arcWidth?: number; // stroke width of green arc in viewBox (default 14)
  trackColor?: string; // solid opaque color of track (default #FFFFFF)
  fillColor?: string; // color of green arc (default #D4E57A)
  knobColor?: string; // fill of end knob (default #E8E8E8)
  knobStrokeColor?: string; // ring around end knob (default #9CB34A)
  showText?: boolean;
  className?: string;
  textClassName?: string;
  // Legacy compatibility props for other callers
  strokeWidth?: number;
}

/**
 * Circular Progress Ring with Solid White Track, Centered Green Arc,
 * and Liquid Drop End Knob positioned with trigonometry.
 */
export function ProgressRing({
  progress,
  size = 144,
  trackWidth = 24,
  arcWidth = 14,
  trackColor,
  fillColor = "#D4E57A",
  knobColor,
  knobStrokeColor,
  showText = true,
  className,
  textClassName,
  strokeWidth,
}: ProgressRingProps) {
  const filterId = useId().replace(/:/g, "_");
  const clampedProgress = Math.min(100, Math.max(0, progress));

  // If a legacy caller passes strokeWidth (e.g. size 58, strokeWidth 5), adapt track/arc proportionally
  const effectiveTrackWidth = strokeWidth ? Math.round(strokeWidth * 2.4) : trackWidth;
  const effectiveArcWidth = strokeWidth ? Math.round(strokeWidth * 1.4) : arcWidth;

  // Centerline geometry in 200x200 viewBox
  const cx = 100;
  const cy = 100;
  const r = 75;
  const circumference = 2 * Math.PI * r;

  // Animate progress on mount (800ms ease-out) in sync with arc and knob
  const [animatedProgress, setAnimatedProgress] = useState(0);

  useEffect(() => {
    // If user prefers reduced motion, set directly without animation
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      setAnimatedProgress(clampedProgress);
      return;
    }

    let startTimestamp: number | null = null;
    const duration = 800; // 800ms ease-out
    const target = clampedProgress;
    let rafId: number;

    function easeOutCubic(t: number): number {
      return 1 - Math.pow(1 - t, 3);
    }

    function step(timestamp: number) {
      if (!startTimestamp) startTimestamp = timestamp;
      const elapsed = timestamp - startTimestamp;
      const factor = Math.min(1, elapsed / duration);
      const eased = easeOutCubic(factor);

      setAnimatedProgress(target * eased);

      if (factor < 1) {
        rafId = requestAnimationFrame(step);
      }
    }

    rafId = requestAnimationFrame(step);

    return () => {
      cancelAnimationFrame(rafId);
    };
  }, [clampedProgress]);

  // Dashoffset calculation (clockwise from 12 o'clock, 0 = full, circumference = empty)
  const strokeDashoffset = circumference - (animatedProgress / 100) * circumference;

  // Trigonometric End Knob position (moves in sync with animatedProgress)
  // angle = (progress / 100) * 360 - 90 in degrees
  const angleDeg = (animatedProgress / 100) * 360 - 90;
  const angleRad = (angleDeg * Math.PI) / 180;
  const knobX = cx + r * Math.cos(angleRad);
  const knobY = cy + r * Math.sin(angleRad);
  const knobRadius = 7.5; // diameter 15px, sits right over the 14px green arc tip

  // Percentage number: ~28-30px, "%" sign: ~55% of number size
  const fontSizePx = Math.max(16, Math.round(size * 0.20)); // 29px for size=144, 30px for size=150
  const percentSizePx = Math.max(10, Math.round(fontSizePx * 0.55)); // 55% of number size

  return (
    <div
      className={cn("relative inline-flex items-center justify-center shrink-0 select-none", className)}
      style={{ width: size, height: size }}
      role="progressbar"
      aria-valuenow={Math.round(clampedProgress)}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <svg
        viewBox="0 0 200 200"
        className="w-full h-full overflow-visible"
        fill="none"
      >
        <defs>
          {/* Subtle soft shadow ONLY on the knob: 0 2px 4px rgba(0,0,0,0.25) */}
          <filter id={`knob-shadow-${filterId}`} x="-60%" y="-60%" width="220%" height="220%">
            <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#000000" floodOpacity="0.25" />
          </filter>
        </defs>

        {/* 1. TRACK: Solid light gray in light mode, solid white (#FFFFFF) in dark mode, fully opaque 360° circle, thick stroke, no glow */}
        <circle
          cx={cx}
          cy={cy}
          r={r}
          stroke={trackColor}
          className={cn(!trackColor && "stroke-slate-200 dark:stroke-white transition-colors")}
          strokeWidth={effectiveTrackWidth}
          fill="none"
        />

        {/* 2. PROGRESS ARC: Sits inside white track, lime green (#D4E57A), thinner stroke, round caps, no glow */}
        <circle
          cx={cx}
          cy={cy}
          r={r}
          stroke={fillColor}
          strokeWidth={effectiveArcWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          fill="none"
          transform={`rotate(-90 ${cx} ${cy})`}
        />

        {/* 3. END KNOB: Liquid drop at the tip of the green arc with subtle shadow, hidden at 0% */}
        {animatedProgress > 0 && (
          <circle
            cx={knobX}
            cy={knobY}
            r={knobRadius}
            fill={knobColor || undefined}
            stroke={knobStrokeColor || undefined}
            className={cn(
              !knobColor && "fill-white dark:fill-[#E8E8E8]",
              !knobStrokeColor && "stroke-[#84CC16] dark:stroke-[#9CB34A]"
            )}
            strokeWidth={2}
            filter={`url(#knob-shadow-${filterId})`}
          />
        )}
      </svg>

      {/* 4. CENTER TEXT: Semi-bold percentage (28-30px), smaller 55% sign, dark in light mode & white in dark mode */}
      {showText && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="flex items-baseline justify-center">
            <span
              className={cn("font-bold text-[#1E1E22] dark:text-white tracking-tight leading-none", textClassName)}
              style={{ fontSize: `${fontSizePx}px` }}
            >
              {Math.round(animatedProgress)}
            </span>
            <span
              className={cn("font-bold text-[#1E1E22]/70 dark:text-white/90 leading-none ml-0.5", textClassName)}
              style={{ fontSize: `${percentSizePx}px` }}
            >
              %
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProgressRing;
