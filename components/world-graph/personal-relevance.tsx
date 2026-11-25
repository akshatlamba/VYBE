"use client";

import React from "react";
import { Star, Info, Check, ArrowRight } from "lucide-react";
import Link from "next/link";
import { GlobeMarker } from "@/lib/data/world-graph-data";

interface PersonalRelevanceProps {
  activeMarker?: GlobeMarker | null;
  className?: string;
}

export function PersonalRelevance({ activeMarker, className = "" }: PersonalRelevanceProps) {
  const relevance = activeMarker ? activeMarker.relevanceScore : 92;

  // Calculate SVG circular arc values
  const radius = 34;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (relevance / 100) * circumference;

  return (
    <div
      className={`rounded-[24px] border border-black/10 bg-white/85 p-4 sm:p-5 backdrop-blur-2xl shadow-sm dark:border-white/10 dark:bg-[#161626]/85 dark:shadow-xl flex flex-col justify-between ${className}`}
    >
      <div className="flex items-center justify-between pb-2 border-b border-black/5 dark:border-white/10">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-pink-500/15 text-pink-600 dark:text-pink-400">
            <Star className="h-4 w-4" />
          </div>
          <h3 className="text-sm font-bold text-[#1E1E22] dark:text-white tracking-tight">
            Your Relevance
          </h3>
        </div>
        <button
          title="Calculated from your skills, goals and DNA profile"
          className="text-[#5E5B63] hover:text-[#1E1E22] dark:text-gray-400 dark:hover:text-white transition-colors"
        >
          <Info className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Ring and Checkmarks Area */}
      <div className="my-2 flex items-center justify-between gap-4">
        {/* Circular Progress Ring */}
        <div className="relative flex h-24 w-24 shrink-0 items-center justify-center">
          <svg className="h-full w-full -rotate-90 transform" viewBox="0 0 88 88">
            {/* Background Track */}
            <circle
              cx="44"
              cy="44"
              r={radius}
              stroke="currentColor"
              className="text-black/10 dark:text-[#1E293B]"
              strokeWidth="6"
              fill="transparent"
            />
            {/* Foreground Cyan/Neon Arc */}
            <circle
              cx="44"
              cy="44"
              r={radius}
              stroke="url(#rel-grad)"
              strokeWidth="6"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="transparent"
              className="transition-all duration-700 ease-out"
            />
            <defs>
              <linearGradient id="rel-grad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#38BDF8" />
                <stop offset="100%" stopColor="#06B6D4" />
              </linearGradient>
            </defs>
          </svg>

          {/* Center Text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="text-base font-extrabold text-[#1E1E22] dark:text-white leading-none">
              {relevance}%
            </span>
            <span className="text-[9px] font-semibold text-[#5E5B63] dark:text-gray-400 mt-0.5">
              Relevant
            </span>
          </div>
        </div>

        {/* Dynamic Skill/Goal alignment checks */}
        <div className="flex flex-col gap-2 min-w-0 flex-1">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#2E2C34] dark:text-slate-200">
            <div className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400">
              <Check className="h-2.5 w-2.5" strokeWidth={3} />
            </div>
            <span className="truncate">{activeMarker?.category || "AI & Tech"}</span>
          </div>

          <div className="flex items-center gap-2 text-xs font-semibold text-[#2E2C34] dark:text-slate-200">
            <div className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400">
              <Check className="h-2.5 w-2.5" strokeWidth={3} />
            </div>
            <span className="truncate">Research Hubs</span>
          </div>

          <div className="flex items-center gap-2 text-xs font-semibold text-[#2E2C34] dark:text-slate-200">
            <div className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400">
              <Check className="h-2.5 w-2.5" strokeWidth={3} />
            </div>
            <span className="truncate">Career Growth</span>
          </div>
        </div>
      </div>

      {/* Bottom Button */}
      <Link
        href="/radar"
        className="mt-1 flex w-full items-center justify-center gap-1.5 rounded-xl border border-indigo-500/30 bg-indigo-50 py-2 text-xs font-bold text-indigo-700 backdrop-blur-md transition hover:bg-indigo-100 active:scale-98 shadow-sm dark:border-indigo-500/30 dark:bg-indigo-600/20 dark:text-indigo-300 dark:hover:bg-indigo-600/40"
      >
        <span>Explore Personalized View</span>
        <ArrowRight className="h-3.5 w-3.5" />
      </Link>
    </div>
  );
}
