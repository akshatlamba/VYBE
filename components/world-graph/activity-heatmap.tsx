"use client";

import React, { useState } from "react";
import { BarChart2, ArrowRight } from "lucide-react";
import { REGIONAL_ACTIVITIES, RegionActivity } from "@/lib/data/world-graph-data";

interface ActivityHeatmapProps {
  onSelectRegion?: (region: RegionActivity) => void;
  className?: string;
}

export function ActivityHeatmap({ onSelectRegion, className = "" }: ActivityHeatmapProps) {
  const [activeRegion, setActiveRegion] = useState<RegionActivity>(REGIONAL_ACTIVITIES[0]);

  return (
    <div
      className={`rounded-[24px] border border-black/10 bg-white/85 p-4 sm:p-5 backdrop-blur-2xl shadow-sm dark:border-white/10 dark:bg-[#161626]/85 dark:shadow-xl flex flex-col justify-between ${className}`}
    >
      <div className="flex items-center justify-between pb-2 border-b border-black/5 dark:border-white/10">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-500/15 text-indigo-600 dark:text-indigo-400">
            <BarChart2 className="h-4 w-4" />
          </div>
          <h3 className="text-sm font-bold text-[#1E1E22] dark:text-white tracking-tight">
            Global Activity by Region
          </h3>
        </div>
        <button className="text-xs font-semibold text-[#5E5B63] hover:text-[#1E1E22] dark:text-gray-400 dark:hover:text-white transition-colors">
          View details →
        </button>
      </div>

      {/* Stylized World Silhouette with glowing regional intensity */}
      <div className="my-2 relative h-28 sm:h-32 w-full overflow-hidden rounded-xl bg-[#0E0E1B]/80 p-2 flex items-center justify-center">
        <svg
          viewBox="0 0 600 280"
          className="w-full h-full opacity-90 drop-shadow-[0_0_12px_rgba(129,140,248,0.4)]"
        >
          {/* North America */}
          <path
            d="M 50 40 Q 90 30 140 50 L 160 90 L 130 130 L 90 120 L 50 80 Z"
            fill="url(#na-grad)"
            className="cursor-pointer hover:opacity-100 transition-opacity"
            onClick={() => {
              const reg = REGIONAL_ACTIVITIES.find((r) => r.id === "reg-na");
              if (reg) {
                setActiveRegion(reg);
                if (onSelectRegion) onSelectRegion(reg);
              }
            }}
          />
          {/* South America */}
          <path
            d="M 130 140 Q 160 150 170 190 L 150 240 L 130 220 L 120 160 Z"
            fill="url(#sa-grad)"
            className="cursor-pointer hover:opacity-100 transition-opacity"
            onClick={() => {
              const reg = REGIONAL_ACTIVITIES.find((r) => r.id === "reg-la");
              if (reg) {
                setActiveRegion(reg);
                if (onSelectRegion) onSelectRegion(reg);
              }
            }}
          />
          {/* Europe */}
          <path
            d="M 260 40 Q 300 35 320 60 L 300 90 L 260 80 Z"
            fill="url(#eu-grad)"
            className="cursor-pointer hover:opacity-100 transition-opacity"
            onClick={() => {
              const reg = REGIONAL_ACTIVITIES.find((r) => r.id === "reg-eu");
              if (reg) {
                setActiveRegion(reg);
                if (onSelectRegion) onSelectRegion(reg);
              }
            }}
          />
          {/* Africa */}
          <path
            d="M 260 100 Q 310 95 320 140 L 300 190 L 270 180 L 250 130 Z"
            fill="url(#af-grad)"
            className="cursor-pointer hover:opacity-100 transition-opacity"
            onClick={() => {
              const reg = REGIONAL_ACTIVITIES.find((r) => r.id === "reg-af");
              if (reg) {
                setActiveRegion(reg);
                if (onSelectRegion) onSelectRegion(reg);
              }
            }}
          />
          {/* Asia & India */}
          <path
            d="M 330 40 Q 420 30 460 70 L 440 130 L 380 150 L 340 100 Z"
            fill="url(#asia-grad)"
            className="cursor-pointer hover:opacity-100 transition-opacity"
            onClick={() => {
              const reg = REGIONAL_ACTIVITIES.find((r) => r.id === "reg-in");
              if (reg) {
                setActiveRegion(reg);
                if (onSelectRegion) onSelectRegion(reg);
              }
            }}
          />
          {/* Oceania */}
          <path
            d="M 440 170 Q 490 170 480 210 L 440 220 Z"
            fill="url(#oc-grad)"
            className="cursor-pointer hover:opacity-100 transition-opacity"
          />

          {/* Activity Glow Gradients */}
          <defs>
            <linearGradient id="na-grad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#818CF8" stopOpacity="0.85" />
              <stop offset="100%" stopColor="#C084FC" stopOpacity="0.95" />
            </linearGradient>
            <linearGradient id="sa-grad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#4F46E5" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#7C3AED" stopOpacity="0.7" />
            </linearGradient>
            <linearGradient id="eu-grad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#6366F1" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#A855F7" stopOpacity="0.9" />
            </linearGradient>
            <linearGradient id="af-grad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.65" />
              <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0.75" />
            </linearGradient>
            <linearGradient id="asia-grad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#A855F7" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#EC4899" stopOpacity="0.95" />
            </linearGradient>
            <linearGradient id="oc-grad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#6366F1" stopOpacity="0.7" />
            </linearGradient>
          </defs>
        </svg>

        {/* Floating Active Region Info */}
        <div className="absolute bottom-2 left-2 rounded-lg bg-black/70 px-2.5 py-1 text-[10px] text-white backdrop-blur-md border border-white/10 flex items-center gap-2">
          <span className="font-bold">{activeRegion.region}:</span>
          <span className="text-indigo-300 font-extrabold">{activeRegion.signalCount} signals</span>
        </div>
      </div>

      {/* Heatmap Gradient Legend */}
      <div className="flex items-center justify-between text-[10px] font-semibold text-gray-400 pt-1">
        <span className="flex items-center gap-1">
          <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
          Low Activity
        </span>
        <div className="h-1.5 w-24 sm:w-32 rounded-full bg-gradient-to-r from-cyan-500 via-indigo-500 to-fuchsia-500 shadow-inner" />
        <span className="flex items-center gap-1">
          High Activity
          <span className="h-1.5 w-1.5 rounded-full bg-fuchsia-400" />
        </span>
      </div>
    </div>
  );
}
