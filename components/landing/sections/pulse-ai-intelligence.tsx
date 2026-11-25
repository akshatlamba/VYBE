"use client";

import React from "react";
import Link from "next/link";
import { Sparkles, Bot, Zap, ArrowRight, Brain, Target, ShieldCheck } from "lucide-react";

export function PulseAiIntelligence() {
  return (
    <section id="pulse" className="w-full py-24 sm:py-32 px-6 sm:px-10 lg:px-14 max-w-[1440px] mx-auto text-white">
      <div className="rounded-[36px] bg-gradient-to-br from-[#13141F]/90 via-[#0E0F17]/90 to-[#0A0A10]/95 backdrop-blur-2xl border border-white/[0.1] p-8 sm:p-14 relative overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.5)]">
        {/* Glow orb */}
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-[#7C3AED]/20 rounded-full blur-[120px] pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Text */}
          <div className="lg:col-span-6 flex flex-col gap-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.05] border border-white/10 text-xs font-semibold text-[#D9C9F5] w-fit">
              <Sparkles className="w-3.5 h-3.5 text-[#D9C9F5]" />
              <span>PULSE AI ENGINE</span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight">
              AI That Understands Your Academic Trajectory
            </h2>

            <p className="text-sm sm:text-base text-white/60 leading-relaxed">
              PULSE goes beyond generic search. It reasons over your real coursework, past hackathons,
              and skills to score opportunity eligibility and auto-assemble high-performing squads.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex items-start gap-3">
                <Target className="w-5 h-5 text-[#D3E57A] shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">Semantic Fit Scorer</h4>
                  <p className="text-[11px] text-white/50 mt-1">Multi-vector analysis against prize requirements.</p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex items-start gap-3">
                <Brain className="w-5 h-5 text-[#D9C9F5] shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">Preparation Roadmaps</h4>
                  <p className="text-[11px] text-white/50 mt-1">Auto-generated sprint plans and checklists.</p>
                </div>
              </div>
            </div>

            <div className="pt-4">
              <Link
                href="/pulse"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/[0.08] hover:bg-white/[0.14] border border-white/15 text-xs font-bold text-white transition-all shadow-md group"
              >
                <span>Chat with PULSE Intelligence</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

          {/* Right Visual Mockup */}
          <div className="lg:col-span-6">
            <div className="rounded-3xl bg-black/60 border border-white/[0.1] p-6 shadow-2xl flex flex-col gap-4 font-mono text-xs">
              <div className="flex items-center justify-between border-b border-white/[0.08] pb-3 text-white/40">
                <span className="flex items-center gap-2">
                  <Bot className="w-4 h-4 text-[#D3E57A]" />
                  pulse_agent.ts
                </span>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full font-bold">
                  LIVE
                </span>
              </div>

              <div className="flex flex-col gap-3 py-2 text-slate-300">
                <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.05]">
                  <span className="text-[#D3E57A] font-bold">→ Query:</span> What hackathons match my Next.js and Web3 background?
                </div>
                <div className="p-3 rounded-xl bg-[#6366F1]/10 border border-[#6366F1]/20 text-slate-200">
                  <span className="text-[#D9C9F5] font-bold">★ PULSE:</span> Found 3 high-fit opportunities. SIH 2026 FinTech Track has a 94% fit score based on your SIH architecture diagram milestone.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default PulseAiIntelligence;
