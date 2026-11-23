import React from "react";
import { cn } from "@/lib/utils";

interface ProgressRingProps {
  progress: number; // 0 to 100
  size?: number; // diameter in px
  strokeWidth?: number;
  trackColor?: string;
  fillColor?: string;
  className?: string;
  showText?: boolean;
  textClassName?: string;
}

export function ProgressRing({
  progress,
  size = 96,
  strokeWidth = 10,
  trackColor = "stroke-white/20 dark:stroke-white/10",
  fillColor = "stroke-[#D3E57A]",
  className,
  showText = true,
  textClassName,
}: ProgressRingProps) {
  const clampedProgress = Math.min(100, Math.max(0, progress));
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (clampedProgress / 100) * circumference;

  return (
    <div
      className={cn("relative inline-flex items-center justify-center", className)}
      style={{ width: size, height: size }}
      role="progressbar"
      aria-valuenow={clampedProgress}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          className={cn("transition-all duration-300", trackColor)}
          strokeWidth={strokeWidth}
          fill="none"
        />
        {/* Progress Arc */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          className={cn("transition-all duration-500 ease-out", fillColor)}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          fill="none"
        />
      </svg>
      {showText && (
        <span
          className={cn(
            "absolute font-semibold text-body tracking-tight select-none",
            textClassName
          )}
        >
          {Math.round(clampedProgress)}%
        </span>
      )}
    </div>
  );
}
