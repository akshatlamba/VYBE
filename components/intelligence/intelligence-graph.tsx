"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Globe2,
  Sparkles,
  Compass,
  Layers,
  ArrowRight,
  TrendingUp,
  CheckCircle2,
  ExternalLink,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { INITIAL_SIGNALS, INITIAL_OPPORTUNITIES } from "@/lib/data/mock-db";

interface GraphNode {
  id: string;
  type: "signal" | "relevance" | "opportunity" | "skills" | "action";
  title: string;
  subtitle?: string;
  link?: string;
}

export function IntelligenceGraphViewer() {
  const [selectedSignalIndex, setSelectedSignalIndex] = useState(0);
  const activeSignal = INITIAL_SIGNALS[selectedSignalIndex];

  // Map concrete deterministic connections based on the signal
  const connections: Record<
    string,
    {
      personalRelevance: string;
      opportunity: (typeof INITIAL_OPPORTUNITIES)[0];
      skills: string[];
      action: string;
    }
  > = {
    "sig-001": {
      personalRelevance: "Demand for autonomous agents connects directly to college hackathons & early software roles.",
      opportunity: INITIAL_OPPORTUNITIES.find((o) => o.id === "opp-001") || INITIAL_OPPORTUNITIES[0],
      skills: ["Python", "Async APIs", "System Design"],
      action: "Build 1 small Slack/Discord bot demo before team hackathon registration.",
    },
    "sig-002": {
      personalRelevance: "On-device SLMs eliminate cloud costs, enabling consumer mobile and edge computing projects.",
      opportunity: INITIAL_OPPORTUNITIES.find((o) => o.id === "opp-006") || INITIAL_OPPORTUNITIES[1],
      skills: ["PyTorch", "Quantization", "Edge Computing"],
      action: "Benchmark 1B parameter model locally on laptop and draft research statement.",
    },
    "sig-003": {
      personalRelevance: "Vertical automation startups receive funding priority over generic consumer chat tools.",
      opportunity: INITIAL_OPPORTUNITIES.find((o) => o.id === "opp-005") || INITIAL_OPPORTUNITIES[4],
      skills: ["Product Discovery", "Pitching", "SaaS Economics"],
      action: "Map 1-page problem canvas and conduct 5 customer discovery interviews.",
    },
  };

  const currentConnection =
    connections[activeSignal.id] || connections["sig-001"];

  return (
    <Card className="p-4 sm:p-6 rounded-[24px] sm:rounded-[28px] bg-white/70 dark:bg-[#1C1C22]/80 backdrop-blur-xl border border-black/5 dark:border-white/10 flex flex-col gap-5 sm:gap-6 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#D3E57A]/30 text-[#1E1E22] dark:text-[#D3E57A] text-caption font-bold mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            VYBE INTELLIGENCE GRAPH
          </div>
          <h3 className="text-xl font-bold text-[#1E1E22] dark:text-white tracking-tight">
            Signal to Growth Pathway
          </h3>
          <p className="text-xs text-gray-500 mt-0.5">
            Connecting global shifts → personal context → opportunities → verified skills.
          </p>
        </div>

        {/* Signal Selector Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
          {INITIAL_SIGNALS.slice(0, 3).map((sig, idx) => (
            <button
              key={sig.id}
              onClick={() => setSelectedSignalIndex(idx)}
              className={`px-3 py-1.5 rounded-full text-caption font-bold transition-all shrink-0 cursor-pointer ${
                selectedSignalIndex === idx
                  ? "bg-[#1E1E22] text-white dark:bg-white dark:text-[#1E1E22] shadow-xs"
                  : "bg-black/[0.06] hover:bg-black/10 text-[#4B5563] dark:bg-white/10 dark:text-gray-200 dark:hover:bg-white/15 border border-black/5 dark:border-white/10"
              }`}
            >
              Signal {idx + 1}
            </button>
          ))}
        </div>
      </div>

      {/* Interactive Graph Pipeline */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-3 relative">
        {/* Step 1: Global Signal */}
        <div className="p-4 rounded-2xl bg-black/[0.03] dark:bg-white/[0.04] border border-black/5 dark:border-white/10 flex flex-col justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400 flex items-center gap-1 mb-1">
              <Globe2 className="w-3 h-3" /> 1. Global Signal
            </span>
            <h4 className="text-xs font-bold text-[#1E1E22] dark:text-white leading-snug">
              {activeSignal.title}
            </h4>
            <p className="text-[11px] text-gray-500 mt-1 line-clamp-2">
              {activeSignal.source_name}
            </p>
          </div>
          <Link
            href={`/world-pulse`}
            className="text-[10px] font-bold text-[#2F6BFF] hover:underline mt-3 inline-flex items-center gap-0.5"
          >
            World Pulse <ArrowRight className="w-2.5 h-2.5" />
          </Link>
        </div>

        {/* Step 2: Personal Relevance */}
        <div className="p-4 rounded-2xl bg-[#D3E57A]/15 border border-[#D3E57A]/30 flex flex-col justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#4A5418] dark:text-[#D3E57A] flex items-center gap-1 mb-1">
              <Sparkles className="w-3 h-3" /> 2. Personal Context
            </span>
            <p className="text-xs font-medium text-[#1E1E22] dark:text-gray-100 leading-snug">
              {currentConnection.personalRelevance}
            </p>
          </div>
          <Link
            href={`/pulse?signal_id=${activeSignal.id}`}
            className="text-[10px] font-bold text-[#4A5418] dark:text-[#D3E57A] hover:underline mt-3 inline-flex items-center gap-0.5"
          >
            Ask PULSE <ArrowRight className="w-2.5 h-2.5" />
          </Link>
        </div>

        {/* Step 3: Sourced Opportunity */}
        <div className="p-4 rounded-2xl bg-black/[0.03] dark:bg-white/[0.04] border border-black/5 dark:border-white/10 flex flex-col justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 flex items-center gap-1 mb-1">
              <Compass className="w-3 h-3" /> 3. Target Opportunity
            </span>
            <h4 className="text-xs font-bold text-[#1E1E22] dark:text-white leading-snug">
              {currentConnection.opportunity.title}
            </h4>
            <p className="text-[11px] text-gray-500 mt-1">
              {currentConnection.opportunity.organizer}
            </p>
          </div>
          <Link
            href={`/radar/${currentConnection.opportunity.id}`}
            className="text-[10px] font-bold text-[#2F6BFF] hover:underline mt-3 inline-flex items-center gap-0.5"
          >
            View Radar <ArrowRight className="w-2.5 h-2.5" />
          </Link>
        </div>

        {/* Step 4: Skills Needed */}
        <div className="p-4 rounded-2xl bg-black/[0.03] dark:bg-white/[0.04] border border-black/5 dark:border-white/10 flex flex-col justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400 flex items-center gap-1 mb-1">
              <Layers className="w-3 h-3" /> 4. Prerequisite Skills
            </span>
            <div className="flex flex-wrap gap-1 mt-1.5">
              {currentConnection.skills.map((skill) => (
                <span
                  key={skill}
                  className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#D9C9F5]/40 text-[#3D2D69] dark:text-[#E2D5FC]"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
          <Link
            href="/radar/compare"
            className="text-[10px] font-bold text-gray-500 hover:underline mt-3 inline-flex items-center gap-0.5"
          >
            Compare Skills <ArrowRight className="w-2.5 h-2.5" />
          </Link>
        </div>

        {/* Step 5: Immediate Action */}
        <div className="p-4 rounded-2xl bg-black/[0.03] dark:bg-white/[0.04] border border-black/5 dark:border-white/10 flex flex-col justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-1 mb-1">
              <CheckCircle2 className="w-3 h-3" /> 5. Immediate Action
            </span>
            <p className="text-xs font-medium text-[#1E1E22] dark:text-gray-100 leading-snug">
              {currentConnection.action}
            </p>
          </div>
          <Link
            href="/tracker"
            className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 hover:underline mt-3 inline-flex items-center gap-0.5"
          >
            Open Tracker <ArrowRight className="w-2.5 h-2.5" />
          </Link>
        </div>
      </div>
    </Card>
  );
}
