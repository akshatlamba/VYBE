"use client";

import React, { useState } from "react";
import { Flame, TrendingUp, ArrowUpRight, Zap } from "lucide-react";
import { TrendingTopic, TRENDING_GLOBAL_TOPICS } from "@/lib/data/world-graph-data";

interface TrendingTopicsPanelProps {
  topics?: TrendingTopic[];
  onSelectTopic?: (topic: TrendingTopic) => void;
  className?: string;
}

export function TrendingTopicsPanel({
  topics = TRENDING_GLOBAL_TOPICS,
  onSelectTopic,
  className = "",
}: TrendingTopicsPanelProps) {
  const [hoveredTopicId, setHoveredTopicId] = useState<string | null>(null);

  return (
    <div
      className={`rounded-[24px] border border-black/10 bg-white/85 p-4 sm:p-5 backdrop-blur-2xl shadow-sm dark:border-white/10 dark:bg-[#161626]/85 dark:shadow-xl flex flex-col justify-between ${className}`}
    >
      {/* Header with Live Pulse Indicator */}
      <div className="flex items-center justify-between pb-3.5 border-b border-black/5 dark:border-white/10">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl border border-orange-500/30 bg-orange-500/15 text-orange-500 shadow-[0_0_14px_rgba(249,115,22,0.25)] dark:bg-orange-500/20 dark:text-orange-400">
            <Flame className="h-4.5 w-4.5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-[#1E1E22] dark:text-white tracking-tight">
                Trending Global Topics
              </h3>
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500" />
              </span>
            </div>
            <p className="text-[10px] text-[#5E5B63] dark:text-gray-400 font-medium">
              Ranked by real-time intelligence velocity
            </p>
          </div>
        </div>

        <button className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors">
          <span>View all</span>
          <ArrowUpRight className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Ranked Trending List */}
      <div className="my-2 flex flex-col gap-1.5">
        {topics.map((topic, index) => {
          const rankNum = topic.rank ?? index + 1;
          const isHovered = hoveredTopicId === topic.id;

          // Compute SVG Area Sparkline coordinates
          const w = 42;
          const h = 20;
          const pts = topic.sparkline.map((val, i) => {
            const x = (i / (topic.sparkline.length - 1)) * w;
            const y = h - 2 - (val / 100) * (h - 4);
            return { x, y };
          });

          const linePoints = pts.map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ");
          const areaPoints = `0,${h} ${linePoints} ${w},${h}`;
          const lastPoint = pts[pts.length - 1];

          return (
            <div
              key={topic.id}
              onClick={() => onSelectTopic && onSelectTopic(topic)}
              onMouseEnter={() => setHoveredTopicId(topic.id)}
              onMouseLeave={() => setHoveredTopicId(null)}
              className={`group flex items-center justify-between p-2 rounded-xl border transition-all duration-200 cursor-pointer ${
                isHovered
                  ? "border-black/10 bg-black/[0.04] shadow-sm -translate-y-0.5 dark:border-white/15 dark:bg-white/[0.06]"
                  : "border-transparent bg-black/[0.015] hover:border-black/10 hover:bg-black/[0.03] dark:bg-white/[0.02] dark:hover:border-white/10 dark:hover:bg-white/[0.04]"
              }`}
            >
              {/* Left Side: Rank Badge + Dot + Topic Title & Subtitle */}
              <div className="flex items-center gap-2 min-w-0 flex-1 pr-1.5">
                {/* Rank Badge */}
                <div
                  className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border text-[9px] font-black transition-colors ${
                    rankNum === 1
                      ? "border-amber-400/40 bg-amber-400/15 text-amber-600 dark:text-amber-300 shadow-[0_0_8px_rgba(251,191,36,0.25)]"
                      : rankNum === 2
                      ? "border-emerald-400/40 bg-emerald-400/15 text-emerald-600 dark:text-emerald-300"
                      : rankNum === 3
                      ? "border-sky-400/40 bg-sky-400/15 text-sky-600 dark:text-sky-300"
                      : "border-black/10 bg-black/[0.04] text-gray-700 dark:border-white/10 dark:bg-white/[0.04] dark:text-gray-400 group-hover:text-black dark:group-hover:text-gray-200"
                  }`}
                >
                  0{rankNum}
                </div>

                {/* Glowing Pulse Dot */}
                <span
                  className="h-1.5 w-1.5 rounded-full shrink-0 shadow-sm"
                  style={{
                    backgroundColor: topic.color,
                    boxShadow: `0 0 8px ${topic.color}`,
                  }}
                />

                {/* Topic Title & Signals Subtitle */}
                <div className="flex flex-col min-w-0">
                  <span className="truncate text-xs sm:text-[13px] font-bold text-[#1E1E22] group-hover:text-indigo-600 dark:text-slate-100 dark:group-hover:text-white transition-colors leading-tight">
                    {topic.name}
                  </span>
                  <span className="truncate text-[10px] font-medium text-[#6B7280] dark:text-gray-400">
                    {topic.volume || "400+ signals"} · {topic.category}
                  </span>
                </div>
              </div>

              {/* Right Side: Filled Area Sparkline + Percentage Pill */}
              <div className="flex items-center gap-2 shrink-0">
                {/* Mini SVG Filled Area Sparkline */}
                <div className="relative h-5 w-10 shrink-0 overflow-visible">
                  <svg width={w} height={h} className="overflow-visible">
                    <defs>
                      <linearGradient id={`grad-${topic.id}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={topic.color} stopOpacity="0.45" />
                        <stop offset="100%" stopColor={topic.color} stopOpacity="0.0" />
                      </linearGradient>
                    </defs>

                    {/* Gradient Fill under curve */}
                    <polygon
                      points={areaPoints}
                      fill={`url(#grad-${topic.id})`}
                    />

                    {/* Sparkline curve stroke */}
                    <polyline
                      fill="none"
                      stroke={topic.color}
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      points={linePoints}
                    />

                    {/* Endpoint glowing pulse circle */}
                    <circle
                      cx={lastPoint.x}
                      cy={lastPoint.y}
                      r="2.5"
                      fill={topic.color}
                      stroke="#FFFFFF"
                      strokeWidth="1.2"
                    />
                  </svg>
                </div>

                {/* Percentage Growth Frosted Pill */}
                <div className="flex items-center gap-1 rounded-full border border-emerald-500/25 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-extrabold text-emerald-600 dark:text-emerald-400 shrink-0 shadow-sm">
                  <TrendingUp className="h-2.5 w-2.5" strokeWidth={2.5} />
                  <span>{topic.change}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Micro Status Footer */}
      <div className="pt-2 border-t border-black/5 dark:border-white/[0.06] flex items-center justify-between text-[10px] text-[#6B7280] dark:text-gray-400">
        <span className="flex items-center gap-1 font-semibold text-[#374151] dark:text-gray-300">
          <Zap className="h-3 w-3 text-amber-500 dark:text-amber-400" />
          Live Velocity Feed
        </span>
        <span>Updated 2m ago</span>
      </div>
    </div>
  );
}
