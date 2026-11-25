"use client";

import React from "react";
import { Lightbulb, ArrowRight } from "lucide-react";
import { GlobeMarker } from "@/lib/data/world-graph-data";

interface KeyInsightsPanelProps {
  onExplore?: () => void;
  className?: string;
}

export function KeyInsightsPanel({ onExplore, className = "" }: KeyInsightsPanelProps) {
  return (
    <div
      className={`rounded-[24px] border border-black/10 bg-white/85 p-4 sm:p-5 backdrop-blur-2xl shadow-sm dark:border-white/10 dark:bg-[#161626]/85 dark:shadow-xl flex flex-col justify-between ${className}`}
    >
      <div className="flex items-center gap-2 pb-2.5 border-b border-black/5 dark:border-white/10">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-sky-500/15 text-sky-600 dark:text-sky-400">
          <Lightbulb className="h-4 w-4" />
        </div>
        <h3 className="text-sm font-bold text-[#1E1E22] dark:text-white tracking-tight">
          Key Insights
        </h3>
      </div>

      <div className="mt-3 flex items-center gap-3.5">
        {/* Cover image (SpaceX / Deep Tech Rocket) */}
        <div className="relative h-16 w-16 sm:h-20 sm:w-20 shrink-0 overflow-hidden rounded-xl border border-black/10 dark:border-white/15 bg-slate-900 shadow-md">
          <img
            src="/spacex_starship.jpg"
            alt="SpaceX Starship launch"
            className="h-full w-full object-cover transition-transform duration-300 hover:scale-110"
          />
        </div>

        {/* Content & Action */}
        <div className="flex flex-1 flex-col justify-between min-w-0">
          <div>
            <h4 className="text-xs sm:text-sm font-bold text-[#1E1E22] dark:text-white leading-tight truncate">
              SpaceX launches next-gen Starship
            </h4>
            <p className="mt-1 text-[11px] text-[#5E5B63] dark:text-gray-400 line-clamp-2 leading-relaxed">
              Pushing the boundaries of deep-space exploration and orbital compute.
            </p>
          </div>

          <div className="mt-2 flex items-center justify-end">
            <button
              onClick={onExplore}
              className="inline-flex items-center gap-1 text-xs font-bold text-sky-600 hover:text-sky-700 dark:text-sky-400 dark:hover:text-sky-300 transition-colors"
            >
              Explore
              <ArrowRight className="h-3 w-3" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
