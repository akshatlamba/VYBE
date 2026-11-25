"use client";

import React from "react";
import Link from "next/link";
import { Users, MessageSquare, Headphones, ArrowRight, ShieldAlert, Sparkles } from "lucide-react";

export function CommunityHubShowcase() {
  return (
    <section id="community" className="w-full py-24 sm:py-32 px-6 sm:px-10 lg:px-14 max-w-[1440px] mx-auto text-white">
      <div className="rounded-[36px] bg-[#12131C]/90 backdrop-blur-2xl border border-white/[0.1] p-8 sm:p-14 flex flex-col md:flex-row items-center justify-between gap-10 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col gap-5 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.05] border border-white/10 text-xs font-semibold text-[#BAE6FD] w-fit">
            <Users className="w-3.5 h-3.5 text-[#BAE6FD]" />
            <span>CAMPUS STUDENT SQUADS</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Build in Public. Form Hackathon Squads in Minutes.
          </h2>

          <p className="text-sm sm:text-base text-white/60 leading-relaxed">
            Collaborate in Discord-style student study halls with live voice rooms, AI bots that summarize signals,
            and peer teams building hardware and software together.
          </p>

          <div className="flex items-center gap-4 pt-2">
            <Link
              href="/community"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#D3E57A] hover:bg-[#C5DA62] text-black font-bold text-xs shadow-[0_0_25px_rgba(211,229,122,0.35)] transition-all"
            >
              <span>Join Campus Community</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Squad Preview Pills */}
        <div className="flex flex-col gap-3 w-full max-w-sm">
          <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.08] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-bold text-white">#hackathon-squads</span>
            </div>
            <span className="text-[10px] font-mono text-white/40">48 builders</span>
          </div>

          <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.08] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Headphones className="w-3.5 h-3.5 text-[#D9C9F5]" />
              <span className="text-xs font-bold text-white">Study Hall (Lo-Fi)</span>
            </div>
            <span className="text-[10px] font-mono text-[#D9C9F5]">In Voice (6)</span>
          </div>

          <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.08] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Sparkles className="w-3.5 h-3.5 text-[#D3E57A]" />
              <span className="text-xs font-bold text-white">PULSE Bot</span>
            </div>
            <span className="text-[10px] font-mono text-emerald-400">Signal Engine Active</span>
          </div>
        </div>
      </div>
    </section>
  );
}

export default CommunityHubShowcase;
