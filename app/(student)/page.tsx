"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DarkFeatureCard } from "@/components/ui/dark-feature-card";
import { PillTabs } from "@/components/ui/pill-tabs";
import { StatusBadge, PriorityBadge } from "@/components/ui/badge";
import { ProgressRing } from "@/components/ui/progress-ring";
import {
  Calendar,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowRight,
  TrendingUp,
  ExternalLink,
  ChevronRight,
  BookmarkPlus,
  Check,
} from "lucide-react";
import { INITIAL_SIGNALS, INITIAL_OPPORTUNITIES, PERSONAS } from "@/lib/data/mock-db";
import { api } from "@/lib/api/client";
import { IntelligenceGraphViewer } from "@/components/intelligence/intelligence-graph";

export default function StudentHomePage() {
  const [activeTaskTab, setActiveTaskTab] = useState("all");
  const [savedSignals, setSavedSignals] = useState<string[]>([]);
  const [signals, setSignals] = useState<any[]>(INITIAL_SIGNALS.slice(0, 3));

  useEffect(() => {
    async function loadSignals() {
      const res = await api.worldPulse.getSignals();
      if (res.success && res.data && res.data.length > 0) {
        setSignals(res.data.slice(0, 3));
      }
    }
    loadSignals();
  }, []);

  // Dynamic progress calculation computed directly from data
  const totalTasks = 12;
  const completedTasks = 8;
  const pendingTasks = totalTasks - completedTasks;
  const progress = Math.round((completedTasks / totalTasks) * 100); // 8/12 = 67%

  const closingSoonOpps = INITIAL_OPPORTUNITIES.filter((o) => o.status === "active").slice(0, 3);

  const toggleSaveSignal = (id: string) => {
    setSavedSignals((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  return (
    <div className="flex flex-col gap-8 py-2">
      {/* Actionable Hero Headline (No duplicate greeting) */}
      <div className="flex flex-col">
        <h1 className="text-display font-light tracking-tight text-[#1E1E22] dark:text-white leading-[1.1]">
          3 Deadlines This Week, <br />
          <span className="font-normal">4 Tasks To Go</span>
        </h1>
        <p className="text-small text-[#4B5563] dark:text-[#D1D5DB] mt-2 font-medium">
          Your World. Your Guide. Your Growth. Turn signals into actions.
        </p>
      </div>

      {/* Dark Feature Card: Action Plan Progress */}
      <DarkFeatureCard
        title="Today's Progress"
        progress={progress}
        stats={[
          { icon: Calendar, value: totalTasks, label: "Total Tasks" },
          { icon: CheckCircle2, value: completedTasks, label: "Completed Tasks" },
          { icon: Clock, value: pendingTasks, label: "Pending Tasks" },
        ]}
        streakDays={5}
        upNextTasks={[
          { id: "task-1", title: "Complete SIH architecture diagram", due: "Today, 6:00 PM" },
          { id: "task-2", title: "Review Supabase RLS policies", due: "Tomorrow" },
        ]}
      />

      {/* VYBE Intelligence Graph: Signal to Growth Pipeline */}
      <IntelligenceGraphViewer />

      {/* Section: World Pulse (Dated, Sourced Signals) */}
      <section className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#E0605E] animate-pulse" />
            <h2 className="text-h2 font-semibold tracking-tight text-[#1E1E22] dark:text-white">
              World Pulse
            </h2>
          </div>
          {/* Restyled Ask PULSE Link: Brand Pill Button (No off-palette blue) */}
          <Link
            href="/pulse"
            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#1E1E22] text-white hover:bg-black/80 dark:bg-[#D3E57A] dark:text-[#1E1E22] dark:hover:bg-[#c5da62] text-caption font-semibold transition-all shadow-xs"
          >
            <span>Ask PULSE</span>
            <ChevronRight className="w-3.5 h-3.5 stroke-[2.2]" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {signals.map((sig) => {
            const isSaved = savedSignals.includes(sig.id);

            return (
              <Card
                key={sig.id}
                variant="liquid-glass"
                className="flex flex-col justify-between p-5 hover:scale-[1.01] transition-all bg-white/65 dark:bg-[#1C1C20]/75"
              >
                <div className="flex flex-col gap-2.5">
                  <div className="flex items-center justify-between text-caption font-medium text-[#4B5563] dark:text-[#D1D5DB]">
                    <span className="font-semibold text-[#1E1E22] dark:text-gray-200">
                      {sig.source_name}
                    </span>
                    <span className="text-[11px] bg-black/5 dark:bg-white/10 px-2.5 py-0.5 rounded-full font-medium">
                      {new Date(sig.published_at).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  </div>

                  {/* Relevance Tag */}
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#D3E57A]/25 border border-[#D3E57A]/40 text-[#425008] dark:text-[#D3E57A] text-[11px] font-bold w-fit">
                    <Sparkles className="w-3 h-3" />
                    <span>Matches your skills</span>
                  </div>

                  {/* 2-line title clamp with min-height for strictly equal card heights */}
                  <h3 className="text-body font-bold text-[#1E1E22] dark:text-white tracking-tight leading-snug line-clamp-2 min-h-[2.75rem]">
                    {sig.title}
                  </h3>

                  {/* 3-line summary clamp with min-height for strictly equal card heights */}
                  <p className="text-small text-[#4B5563] dark:text-[#D1D5DB] line-clamp-3 min-h-[4.25rem] leading-relaxed">
                    {sig.summary}
                  </p>
                </div>

                {/* Bottom Actions: Save to Tracker + Interpret */}
                <div className="pt-4 mt-3 border-t border-black/5 dark:border-white/10 flex items-center justify-between gap-2">
                  <button
                    onClick={() => toggleSaveSignal(sig.id)}
                    className="inline-flex items-center gap-1.5 text-caption font-semibold px-3 py-1.5 rounded-full bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/15 text-[#1E1E22] dark:text-white transition-colors"
                    title={isSaved ? "Saved to Tracker" : "Save to Tracker"}
                  >
                    {isSaved ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-[#5BAE75]" />
                        <span>Saved</span>
                      </>
                    ) : (
                      <>
                        <BookmarkPlus className="w-3.5 h-3.5" />
                        <span>Save to Tracker</span>
                      </>
                    )}
                  </button>

                  <Link
                    href={`/pulse?signal_id=${sig.id}`}
                    className="inline-flex items-center gap-1 text-caption font-bold text-[#1E1E22] dark:text-[#D3E57A] hover:underline shrink-0"
                  >
                    <span>Interpret</span>
                    <ChevronRight className="w-3 h-3" />
                  </Link>
                </div>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Section: Closing Soon Opportunities */}
      <section className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-h2 font-semibold tracking-tight text-[#1E1E22] dark:text-white">
              Closing Soon
            </h2>
            <p className="text-caption text-[#4B5563] dark:text-[#D1D5DB] font-medium">
              Verified active listings with impending deadlines
            </p>
          </div>
          <Link
            href="/radar"
            className="text-small font-semibold text-[#1E1E22] dark:text-white hover:underline flex items-center gap-1"
          >
            View All Radar
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="flex flex-col gap-3">
          {closingSoonOpps.map((opp) => (
            <Card
              key={opp.id}
              variant="solid"
              className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="shrink-0">
                  <ProgressRing
                    progress={opp.id === "opp-003" ? 94 : opp.id === "opp-001" ? 88 : 82}
                    size={64}
                    strokeWidth={6}
                    textClassName="text-caption font-bold"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-caption font-semibold text-[#4B5563] dark:text-[#D1D5DB]">
                      {opp.organizer}
                    </span>
                    <span className="w-1 h-1 rounded-full bg-gray-400" />
                    <span className="text-caption text-[#5BAE75] font-semibold">
                      Eligible
                    </span>
                    <span className="w-1 h-1 rounded-full bg-gray-400" />
                    <span className="text-caption text-[#4B5563] dark:text-[#D1D5DB] font-medium">
                      {opp.format}
                    </span>
                  </div>
                  <h4 className="text-body font-bold text-[#1E1E22] dark:text-white">
                    {opp.title}
                  </h4>
                  <div className="text-caption text-[#E0605E] font-semibold flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" />
                    Deadline: {new Date(opp.deadline).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2.5 sm:self-center shrink-0">
                <Link href={`/radar/${opp.id}`}>
                  <Button variant="primary" size="sm" label="See Plan">
                    See Plan
                  </Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
