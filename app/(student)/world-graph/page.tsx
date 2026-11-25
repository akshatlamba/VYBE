"use client";

import React, { useState, useMemo } from "react";
import {
  Orbit,
  Search,
  Sparkles,
  Calendar,
  Globe2,
  ChevronDown,
  Filter,
} from "lucide-react";
import { InteractiveGlobe } from "@/components/world-graph/interactive-globe";
import { TrendingTopicsPanel } from "@/components/world-graph/trending-topics";
import { KeyInsightsPanel } from "@/components/world-graph/key-insights";
import { RelatedOpportunitiesPanel } from "@/components/world-graph/related-opportunities";
import { ActivityHeatmap } from "@/components/world-graph/activity-heatmap";
import { ConnectedIntelligence } from "@/components/world-graph/connected-intelligence";
import { PersonalRelevance } from "@/components/world-graph/personal-relevance";
import { MarkerDetailModal } from "@/components/world-graph/marker-detail-modal";
import {
  WORLD_GRAPH_MARKERS,
  GlobeMarker,
  TrendingTopic,
} from "@/lib/data/world-graph-data";

const CATEGORIES = [
  "All",
  "AI & Tech",
  "Research",
  "Business",
  "Education",
  "Global Events",
  "Sustainability",
];

const TIME_RANGES = ["Last 7 Days", "Last 30 Days", "Last 90 Days", "All Time"];
const SCOPES = ["Worldwide", "India & South Asia", "North America", "Europe", "Asia-Pacific"];

export default function WorldGraphPage() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedTimeRange, setSelectedTimeRange] = useState("Last 30 Days");
  const [selectedScope, setSelectedScope] = useState("Worldwide");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeMarker, setActiveMarker] = useState<GlobeMarker | null>(null);
  const [detailModalMarker, setDetailModalMarker] = useState<GlobeMarker | null>(null);
  const [savedMarkerIds, setSavedMarkerIds] = useState<string[]>([]);

  // Filter markers based on category and search query
  const filteredMarkers = useMemo(() => {
    return WORLD_GRAPH_MARKERS.filter((marker) => {
      const matchesCategory =
        selectedCategory === "All" || marker.category === selectedCategory;
      const matchesSearch =
        !searchQuery.trim() ||
        marker.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        marker.headline.toLowerCase().includes(searchQuery.toLowerCase()) ||
        marker.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
        marker.category.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  const handleToggleSave = (markerId: string) => {
    setSavedMarkerIds((prev) =>
      prev.includes(markerId) ? prev.filter((id) => id !== markerId) : [...prev, markerId]
    );
  };

  const handleSelectTrendingTopic = (topic: TrendingTopic) => {
    // Find closest marker for this topic
    const match = WORLD_GRAPH_MARKERS.find(
      (m) => m.category === topic.category || m.title.toLowerCase().includes(topic.name.toLowerCase())
    );
    if (match) {
      setActiveMarker(match);
    }
  };

  return (
    <main className="flex flex-col gap-6 py-2 pb-12 text-[#1E1E22] dark:text-white">
      {/* Top Header & Navigation Bar */}
      <div className="flex flex-col gap-4">
        {/* Top Search & Filter Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Search Input with Ctrl + K hint */}
          <div className="relative flex-1 min-w-[260px] max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 dark:text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search countries, topics, or developments... (Ctrl + K)"
              className="w-full rounded-full border border-black/10 bg-white/70 py-2.5 pl-10 pr-4 text-xs text-[#1E1E22] placeholder-gray-500 shadow-sm backdrop-blur-xl outline-none transition focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:border-white/10 dark:bg-[#151628]/80 dark:text-white dark:placeholder-gray-400 dark:shadow-inner"
            />
          </div>

          {/* Time & Scope Dropdown Pills */}
          <div className="flex items-center gap-2">
            <div className="relative">
              <select
                value={selectedTimeRange}
                onChange={(e) => setSelectedTimeRange(e.target.value)}
                className="appearance-none cursor-pointer rounded-full border border-black/10 bg-white/80 px-4 py-2 pr-8 text-xs font-semibold text-[#2D2A32] shadow-sm backdrop-blur-xl outline-none transition hover:border-black/20 dark:border-white/10 dark:bg-[#161626]/90 dark:text-slate-200 dark:hover:border-white/20"
              >
                {TIME_RANGES.map((t) => (
                  <option key={t} value={t} className="bg-white text-black dark:bg-[#121324] dark:text-white">
                    {t}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-500 dark:text-gray-400" />
            </div>

            <div className="relative">
              <select
                value={selectedScope}
                onChange={(e) => setSelectedScope(e.target.value)}
                className="appearance-none cursor-pointer rounded-full border border-black/10 bg-white/80 px-4 py-2 pr-8 text-xs font-semibold text-[#2D2A32] shadow-sm backdrop-blur-xl outline-none transition hover:border-black/20 dark:border-white/10 dark:bg-[#161626]/90 dark:text-slate-200 dark:hover:border-white/20"
              >
                {SCOPES.map((s) => (
                  <option key={s} value={s} className="bg-white text-black dark:bg-[#121324] dark:text-white">
                    {s}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-500 dark:text-gray-400" />
            </div>
          </div>
        </div>

        {/* Title Bar & Category Filters Row */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pt-1">
          {/* Title & Badge */}
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-indigo-500/20 bg-indigo-50 shadow-sm dark:border-indigo-500/30 dark:bg-gradient-to-br dark:from-indigo-500/20 dark:to-purple-500/30 dark:shadow-[0_0_16px_rgba(99,102,241,0.35)]">
              <Orbit className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black tracking-tight text-[#1E1E22] dark:text-white">
                  World Graph
                </h1>
                <span className="flex items-center gap-1 rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-extrabold text-emerald-700 border border-emerald-500/20 dark:bg-emerald-500/20 dark:text-emerald-400 dark:border-emerald-500/30">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Live
                </span>
              </div>
              <p className="text-xs text-[#5E5B63] dark:text-gray-400 font-medium">
                Explore global developments and their connections
              </p>
            </div>
          </div>

          {/* Horizontal Category Pill Filter Buttons */}
          <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto py-1">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all duration-200 outline-none ${
                  selectedCategory === cat
                    ? "bg-indigo-600 text-white shadow-md scale-105"
                    : "border border-black/10 bg-white/70 text-[#4B5563] shadow-sm hover:bg-white hover:text-[#1E1E22] dark:border-white/10 dark:bg-white/5 dark:text-gray-300 dark:hover:bg-white/10 dark:hover:text-white"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Central Viewport: 3D Interactive Earth (60%) + Right Stacked Intelligence (40%) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 min-h-[540px] items-stretch">
        {/* Central 3D Interactive Earth Globe (Occupies ~60% of viewport width) */}
        <div className="lg:col-span-8 relative rounded-[28px] border border-white/10 bg-gradient-to-b from-[#0E0F1E] to-[#080914] overflow-hidden shadow-2xl flex flex-col">
          <InteractiveGlobe
            markers={filteredMarkers}
            selectedMarkerId={activeMarker?.id}
            onSelectMarker={(m) => setActiveMarker(m)}
            onOpenDetails={(m) => setDetailModalMarker(m)}
            filteredCategory={selectedCategory}
            className="flex-1 w-full h-full"
          />
        </div>

        {/* Right Stacked Intelligence Panels */}
        <div className="lg:col-span-4 flex flex-col gap-4 justify-between">
          <TrendingTopicsPanel
            onSelectTopic={handleSelectTrendingTopic}
            className="flex-1"
          />
          <KeyInsightsPanel
            onExplore={() => {
              const starship = WORLD_GRAPH_MARKERS.find((m) => m.id === "m-003");
              if (starship) setDetailModalMarker(starship);
            }}
          />
          <RelatedOpportunitiesPanel />
        </div>
      </div>

      {/* Bottom 3 Intelligence Panels Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <ActivityHeatmap />
        <ConnectedIntelligence
          activeMarker={activeMarker}
          onOpenNetworkModal={() => {
            if (activeMarker) setDetailModalMarker(activeMarker);
          }}
        />
        <PersonalRelevance activeMarker={activeMarker} />
      </div>

      {/* Comprehensive Intelligence Detail Modal */}
      {detailModalMarker && (
        <MarkerDetailModal
          marker={detailModalMarker}
          onClose={() => setDetailModalMarker(null)}
          onSave={handleToggleSave}
          isSaved={savedMarkerIds.includes(detailModalMarker.id)}
        />
      )}
    </main>
  );
}
