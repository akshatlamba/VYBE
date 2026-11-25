"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Radar, ArrowUpRight, Sparkles, Clock, ShieldCheck, CheckCircle2 } from "lucide-react";
import { INITIAL_OPPORTUNITIES } from "@/lib/data/mock-db";

export function OpportunityRadarPreview() {
  const [filter, setFilter] = useState("all");

  const opportunities = INITIAL_OPPORTUNITIES.slice(0, 3);

  return (
    <section id="radar" className="w-full py-24 sm:py-32 px-6 sm:px-10 lg:px-14 max-w-[1440px] mx-auto text-white">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16 border-b border-white/[0.08] pb-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.05] border border-white/10 text-xs font-semibold text-[#D3E57A] mb-3">
            <Radar className="w-3.5 h-3.5 animate-spin text-[#D3E57A]" />
            <span>OPPORTUNITY RADAR</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
            Curated Signals. Zero Noise.
          </h2>
          <p className="text-sm sm:text-base text-white/60 mt-2 max-w-xl">
            Autonomous opportunity crawlers scan verified national repositories, hackathons, and research grants daily.
          </p>
        </div>

        <Link
          href="/radar"
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-[#D3E57A] hover:underline self-start md:self-end"
        >
          <span>View Full Radar Grid</span>
          <ArrowUpRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Grid of Glass Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
        {opportunities.map((opp) => (
          <div
            key={opp.id}
            className="group relative rounded-[28px] bg-[#12131C]/80 backdrop-blur-2xl border border-white/[0.08] hover:border-[#D3E57A]/50 p-6 sm:p-7 flex flex-col justify-between transition-all duration-300 hover:shadow-[0_12px_40px_rgba(211,229,122,0.18)]"
          >
            {/* Top Badges */}
            <div className="flex items-center justify-between mb-4">
              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#D3E57A]/15 border border-[#D3E57A]/30 text-[#D3E57A] uppercase tracking-wider">
                {opp.type}
              </span>

              <span className="flex items-center gap-1.5 text-[11px] text-white/50 font-mono">
                <Clock className="w-3.5 h-3.5" />
                {new Date(opp.deadline).toLocaleDateString()}
              </span>
            </div>

            {/* Content */}
            <div className="mb-6">
              <h3 className="text-lg sm:text-xl font-bold text-white group-hover:text-[#D3E57A] transition-colors leading-snug">
                {opp.title}
              </h3>
              <p className="text-xs text-white/60 mt-1">Organized by {opp.organizer}</p>
              <p className="text-xs text-slate-300 mt-3 line-clamp-2 leading-relaxed">
                {opp.description}
              </p>
            </div>

            {/* Bottom Actions */}
            <div className="pt-4 border-t border-white/[0.06] flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-[11px] text-[#A7F3D0] font-medium">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#5BAE75]" />
                <span>Verified Fresh</span>
              </div>

              <Link
                href="/radar"
                className="p-2 rounded-xl bg-white/[0.05] group-hover:bg-[#D3E57A] group-hover:text-black text-white transition-all"
              >
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default OpportunityRadarPreview;
