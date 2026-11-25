"use client";

import React, { useState } from "react";
import { Share2, ArrowRight, Building2, School, Rocket, Sparkles } from "lucide-react";
import { GlobeMarker } from "@/lib/data/world-graph-data";

interface ConnectedIntelligenceProps {
  activeMarker?: GlobeMarker | null;
  onOpenNetworkModal?: (nodeType: string) => void;
  className?: string;
}

export function ConnectedIntelligence({
  activeMarker,
  onOpenNetworkModal,
  className = "",
}: ConnectedIntelligenceProps) {
  const [selectedCluster, setSelectedCluster] = useState<string | null>(null);

  const centerTopic = activeMarker?.category === "AI & Tech" ? "AI" : activeMarker?.category || "AI";

  return (
    <div
      className={`rounded-[24px] border border-black/10 bg-white/85 p-4 sm:p-5 backdrop-blur-2xl shadow-sm dark:border-white/10 dark:bg-[#161626]/85 dark:shadow-xl flex flex-col justify-between ${className}`}
    >
      <div className="flex items-center justify-between pb-2 border-b border-black/5 dark:border-white/10">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-purple-500/15 text-purple-600 dark:text-purple-400">
            <Share2 className="h-4 w-4" />
          </div>
          <h3 className="text-sm font-bold text-[#1E1E22] dark:text-white tracking-tight">
            Connected Intelligence
          </h3>
        </div>
        <button
          onClick={() => onOpenNetworkModal && onOpenNetworkModal(centerTopic)}
          className="text-xs font-semibold text-[#5E5B63] hover:text-[#1E1E22] dark:text-gray-400 dark:hover:text-white transition-colors"
        >
          Explore →
        </button>
      </div>

      {/* Interactive Radial Graph Visualizer */}
      <div className="relative my-2 h-36 sm:h-40 w-full flex items-center justify-center overflow-hidden">
        {/* SVG Glowing Connector Lines */}
        <svg className="absolute inset-0 h-full w-full pointer-events-none">
          {/* Center to Top-Left (Research Institutions) */}
          <line
            x1="50%"
            y1="50%"
            x2="22%"
            y2="24%"
            stroke="#38BDF8"
            strokeWidth="2"
            strokeDasharray="4 2"
            className="opacity-75"
          />
          {/* Center to Top-Right (Startups) */}
          <line
            x1="50%"
            y1="50%"
            x2="78%"
            y2="24%"
            stroke="#22C55E"
            strokeWidth="2"
            strokeDasharray="4 2"
            className="opacity-75"
          />
          {/* Center to Bottom-Left (Universities) */}
          <line
            x1="50%"
            y1="50%"
            x2="22%"
            y2="76%"
            stroke="#F59E0B"
            strokeWidth="2"
            strokeDasharray="4 2"
            className="opacity-75"
          />
          {/* Center to Bottom-Right (Opportunities) */}
          <line
            x1="50%"
            y1="50%"
            x2="78%"
            y2="76%"
            stroke="#EC4899"
            strokeWidth="2"
            strokeDasharray="4 2"
            className="opacity-75"
          />
        </svg>

        {/* Top-Left Node: Research Institutions */}
        <button
          onClick={() => {
            setSelectedCluster("research");
            if (onOpenNetworkModal) onOpenNetworkModal("research");
          }}
          className="absolute top-1 left-2 sm:left-4 z-10 flex items-center gap-1.5 rounded-full border border-sky-400/40 bg-sky-950/70 px-2.5 py-1 text-[10px] font-bold text-sky-200 backdrop-blur-md transition hover:scale-105 active:scale-95 shadow-[0_0_12px_rgba(56,189,248,0.3)]"
        >
          <Building2 className="h-3 w-3 text-sky-400" />
          <span>Research</span>
        </button>

        {/* Top-Right Node: Startups */}
        <button
          onClick={() => {
            setSelectedCluster("startups");
            if (onOpenNetworkModal) onOpenNetworkModal("startups");
          }}
          className="absolute top-1 right-2 sm:right-4 z-10 flex items-center gap-1.5 rounded-full border border-emerald-400/40 bg-emerald-950/70 px-2.5 py-1 text-[10px] font-bold text-emerald-200 backdrop-blur-md transition hover:scale-105 active:scale-95 shadow-[0_0_12px_rgba(34,197,94,0.3)]"
        >
          <Rocket className="h-3 w-3 text-emerald-400" />
          <span>Startups</span>
        </button>

        {/* Central Hub Node (AI / Focus Topic) */}
        <div className="relative z-20 flex h-14 w-14 items-center justify-center rounded-full border-2 border-purple-400 bg-gradient-to-br from-[#2D124D] to-[#120824] shadow-[0_0_24px_rgba(168,85,247,0.6)]">
          <span className="text-xs font-black uppercase text-white tracking-wider">
            {centerTopic}
          </span>
          <span className="absolute -inset-1 rounded-full border border-purple-400/30 animate-ping pointer-events-none" />
        </div>

        {/* Bottom-Left Node: Universities */}
        <button
          onClick={() => {
            setSelectedCluster("universities");
            if (onOpenNetworkModal) onOpenNetworkModal("universities");
          }}
          className="absolute bottom-1 left-2 sm:left-4 z-10 flex items-center gap-1.5 rounded-full border border-amber-400/40 bg-amber-950/70 px-2.5 py-1 text-[10px] font-bold text-amber-200 backdrop-blur-md transition hover:scale-105 active:scale-95 shadow-[0_0_12px_rgba(245,158,11,0.3)]"
        >
          <School className="h-3 w-3 text-amber-400" />
          <span>Universities</span>
        </button>

        {/* Bottom-Right Node: Opportunities */}
        <button
          onClick={() => {
            setSelectedCluster("opportunities");
            if (onOpenNetworkModal) onOpenNetworkModal("opportunities");
          }}
          className="absolute bottom-1 right-2 sm:right-4 z-10 flex items-center gap-1.5 rounded-full border border-pink-400/40 bg-pink-950/70 px-2.5 py-1 text-[10px] font-bold text-pink-200 backdrop-blur-md transition hover:scale-105 active:scale-95 shadow-[0_0_12px_rgba(236,72,153,0.3)]"
        >
          <Sparkles className="h-3 w-3 text-pink-400" />
          <span>Opportunities</span>
        </button>
      </div>

      {/* Bottom context label */}
      <p className="text-center text-[10px] text-[#5E5B63] dark:text-gray-400 truncate">
        {activeMarker
          ? `${activeMarker.connectedNodes.universities.length + activeMarker.connectedNodes.startups.length} connected ecosystem entities`
          : "Click nodes to explore network relationships"}
      </p>
    </div>
  );
}
