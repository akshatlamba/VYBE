import React from "react";
import { cn } from "@/lib/utils";

interface ProgressBarProps {
  progress: number; // 0 to 100
  label?: string;
  showPercentage?: boolean;
  className?: string;
  fillColor?: string;
}

export function ProgressBar({
  progress,
  label,
  showPercentage = true,
  className,
  fillColor = "bg-[#D3E57A]",
}: ProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, progress));

  return (
    <div className={cn("w-full flex flex-col gap-1.5", className)}>
      {(label || showPercentage) && (
        <div className="flex items-center justify-between text-caption font-semibold text-[#6B7280] dark:text-gray-300">
          {label && <span>{label}</span>}
          {showPercentage && <span className="ml-auto">{Math.round(clamped)}%</span>}
        </div>
      )}
      <div
        className="w-full h-2.5 bg-black/10 dark:bg-white/10 rounded-full overflow-hidden p-0.5"
        role="progressbar"
        aria-valuenow={clamped}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className={cn("h-full rounded-full transition-all duration-500 ease-out", fillColor)}
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  );
}
