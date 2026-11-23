"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FilterChips } from "@/components/ui/filter-chips";
import { DeadlineStrip } from "@/components/ui/deadline-strip";
import { SourceBadge, PriorityBadge } from "@/components/ui/badge";
import { ProgressRing } from "@/components/ui/progress-ring";
import { ProgressBar } from "@/components/ui/progress-bar";
import {
  Search,
  CheckCircle2,
  Clock,
  Layers,
  Sparkles,
  ArrowRight,
  SlidersHorizontal,
  BookmarkPlus,
  Scale,
} from "lucide-react";
import { Opportunity, INITIAL_OPPORTUNITIES, PERSONAS } from "@/lib/data/mock-db";
import { checkEligibility } from "@/lib/intelligence/eligibility";
import { calculateFitScore } from "@/lib/intelligence/fit-scorer";
import { assessReadiness } from "@/lib/intelligence/readiness";

export default function OpportunityRadarPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedDate, setSelectedDate] = useState("2026-11-25");
  const [compareList, setCompareList] = useState<string[]>([]);
  const student = PERSONAS.beginner;

  // Deadline strip days
  const deadlineDays = [
    { date: "2026-11-23", dayLabel: "Mon", dateNumber: 23 },
    { date: "2026-11-24", dayLabel: "Tue", dateNumber: 24, hasDeadline: true },
    { date: "2026-11-25", dayLabel: "Wed", dateNumber: 25, hasDeadline: true },
    { date: "2026-11-26", dayLabel: "Thu", dateNumber: 26 },
    { date: "2026-11-27", dayLabel: "Fri", dateNumber: 27, hasDeadline: true },
    { date: "2026-11-28", dayLabel: "Sat", dateNumber: 28 },
    { date: "2026-11-29", dayLabel: "Sun", dateNumber: 29 },
  ];

  // Process opportunities: hard eligibility + weighted fit + readiness
  const processedOpportunities = INITIAL_OPPORTUNITIES.map((opp) => {
    const eligibility = checkEligibility(student, opp);
    const fit = calculateFitScore(student, opp);
    const readiness = assessReadiness(student, opp);
    return {
      ...opp,
      eligibility,
      fit,
      readiness,
    };
  });

  // Filter based on search, category, and active status
  const filtered = processedOpportunities.filter((item) => {
    if (selectedCategory !== "all") {
      if (!item.type.toLowerCase().includes(selectedCategory.toLowerCase())) {
        return false;
      }
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = item.title.toLowerCase().includes(q);
      const matchOrg = item.organizer.toLowerCase().includes(q);
      const matchSkills = item.skills.some((s) => s.toLowerCase().includes(q));
      if (!matchTitle && !matchOrg && !matchSkills) return false;
    }
    return true;
  });

  // Sort: Eligible first, then descending fit score
  filtered.sort((a, b) => {
    if (a.eligibility.eligible && !b.eligibility.eligible) return -1;
    if (!a.eligibility.eligible && b.eligibility.eligible) return 1;
    return b.fit.total_score - a.fit.total_score;
  });

  const toggleCompare = (id: string) => {
    if (compareList.includes(id)) {
      setCompareList(compareList.filter((x) => x !== id));
    } else {
      if (compareList.length < 3) {
        setCompareList([...compareList, id]);
      } else {
        alert("You can compare up to 3 opportunities at a time.");
      }
    }
  };

  return (
    <div className="flex flex-col gap-6 py-2">
      {/* Radar Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#D3E57A]/30 text-[#1E1E22] dark:text-[#D3E57A] text-caption font-bold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            DECISION INTELLIGENCE
          </div>
          <h1 className="text-display font-light tracking-tight text-[#1E1E22] dark:text-white leading-[1.1]">
            Opportunity <span className="font-normal">Radar</span>
          </h1>
          <p className="text-small text-[#6B7280] dark:text-gray-400 mt-1">
            Explainable fit scores, hard eligibility verification, and readiness guidance.
          </p>
        </div>

        {compareList.length >= 2 && (
          <Link href={`/radar/compare?ids=${compareList.join(",")}`}>
            <Button variant="lime" size="md" label={`Compare (${compareList.length}) Selected`} className="gap-2 shadow-md">
              <Scale className="w-4 h-4" />
              Compare ({compareList.length}) Selected
            </Button>
          </Link>
        )}
      </div>

      {/* Search Pill Bar */}
      <div className="relative">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
          <Search className="w-5 h-5" strokeWidth={1.75} />
        </div>
        <input
          type="text"
          placeholder="Search by role, organizer, or skill (e.g. Python, AI Agents, Hackathon)..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full h-14 pl-12 pr-4 rounded-full text-body bg-white/80 dark:bg-[#1E1E24]/80 backdrop-blur-xl border border-white/60 dark:border-white/10 shadow-sm outline-none focus:ring-2 focus:ring-[#1E1E22]/10 dark:focus:ring-white/10"
        />
      </div>

      {/* Category Filter Chips */}
      <div>
        <FilterChips
          options={[
            { id: "all", label: "All Opportunities" },
            { id: "hackathon", label: "Hackathons", icon: Layers },
            { id: "fellowship", label: "Fellowships", icon: Sparkles },
            { id: "research", label: "Research", icon: SlidersHorizontal },
          ]}
          selectedId={selectedCategory}
          onChange={setSelectedCategory}
        />
      </div>

      {/* Deadline Strip */}
      <div className="p-4 rounded-[28px] glass-surface">
        <div className="flex items-center justify-between mb-2 px-1">
          <span className="text-caption font-bold text-[#6B7280] dark:text-gray-400 uppercase tracking-wider">
            Upcoming Deadlines This Week
          </span>
          <span className="text-caption text-gray-400">
            Selected: {selectedDate}
          </span>
        </div>
        <DeadlineStrip
          days={deadlineDays}
          selectedDate={selectedDate}
          onSelectDate={setSelectedDate}
        />
      </div>

      {/* Opportunity Cards List */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between px-1">
          <span className="text-small font-semibold text-[#6B7280] dark:text-gray-400">
            Showing {filtered.length} opportunities (Sorted by explainable fit)
          </span>
          <span className="text-caption text-gray-400">
            Strict hard eligibility applied
          </span>
        </div>

        {filtered.map((item) => {
          const isEligible = item.eligibility.eligible;
          const isSelectedForCompare = compareList.includes(item.id);

          return (
            <Card
              key={item.id}
              variant="glass"
              className={`p-6 sm:p-7 flex flex-col gap-5 transition-all ${
                !isEligible ? "opacity-70 bg-gray-50/50 dark:bg-black/20" : ""
              }`}
            >
              {/* Card Header Row: Source Badge, Type, Organizer, Compare Checkbox */}
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <SourceBadge status={item.source_status} />
                  <span className="px-3 py-1 rounded-full text-caption font-semibold bg-black/5 dark:bg-white/10 text-[#1E1E22] dark:text-gray-200">
                    {item.type}
                  </span>
                  <span className="text-caption text-[#6B7280] dark:text-gray-400 font-medium">
                    by {item.organizer}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => toggleCompare(item.id)}
                  className={`text-caption font-semibold px-3 py-1 rounded-full border transition-all btn-press ${
                    isSelectedForCompare
                      ? "bg-[#1E1E22] text-white border-[#1E1E22] dark:bg-white dark:text-[#1E1E22]"
                      : "bg-white/60 dark:bg-white/10 border-black/10 dark:border-white/10 text-gray-600 dark:text-gray-300"
                  }`}
                >
                  {isSelectedForCompare ? "✓ Added to Compare" : "+ Compare"}
                </button>
              </div>

              {/* Main Content Row: Fit Score Ring + Title & Meta */}
              <div className="grid grid-cols-1 md:grid-cols-[auto_1fr] items-start gap-5">
                {/* Fit Score Ring */}
                <div className="flex flex-col items-center gap-1.5 self-center md:self-start shrink-0">
                  <ProgressRing
                    progress={item.fit.total_score}
                    size={76}
                    strokeWidth={8}
                    textClassName="text-body font-bold"
                  />
                  <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-tight">
                    Fit Score
                  </span>
                </div>

                {/* Details */}
                <div className="flex flex-col gap-2 min-w-0">
                  <div className="flex items-baseline gap-2 flex-wrap">
                    <h3 className="text-h2 font-bold text-[#1E1E22] dark:text-white tracking-tight">
                      {item.title}
                    </h3>
                    {isEligible ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-caption font-bold bg-[#5BAE75]/15 text-[#2B7343] dark:text-[#78C991]">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Eligible
                      </span>
                    ) : (
                      <span className="px-2.5 py-0.5 rounded-full text-caption font-bold bg-[#E0605E]/15 text-[#9E2A28] dark:text-[#F38684]">
                        Ineligible for profile
                      </span>
                    )}
                  </div>

                  <p className="text-body text-[#6B7280] dark:text-gray-300">
                    {item.description}
                  </p>

                  {/* Meta chips row */}
                  <div className="flex flex-wrap items-center gap-3 text-caption text-[#6B7280] dark:text-gray-400 pt-1">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      Deadline: {new Date(item.deadline).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </span>
                    <span>·</span>
                    <span>Format: <strong className="text-[#1E1E22] dark:text-white capitalize">{item.format}</strong></span>
                    <span>·</span>
                    <span>Cost: <strong className="text-[#1E1E22] dark:text-white">{item.cost === 0 ? "Free" : `₹${item.cost}`}</strong></span>
                    <span>·</span>
                    <span>Level: <strong className="text-[#1E1E22] dark:text-white">{item.level}</strong></span>
                  </div>

                  {/* Readiness Bar */}
                  <div className="pt-2 max-w-md">
                    <ProgressBar
                      progress={item.readiness.readinessPercentage}
                      label={`Readiness: ${item.readiness.checklistRatio}`}
                    />
                  </div>
                </div>
              </div>

              {/* Footer Row: Explainable Reasons & Action Button */}
              <div className="pt-4 border-t border-black/5 dark:border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="text-small text-[#6B7280] dark:text-gray-400">
                  💡 <span className="font-semibold text-[#1E1E22] dark:text-gray-200">Why it fits:</span>{" "}
                  {item.fit.reasons[0]}
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <Link href={`/radar/${item.id}`}>
                    <Button variant="primary" size="md" label="See Plan & Receipt" className="gap-2">
                      See Plan & Receipt
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
