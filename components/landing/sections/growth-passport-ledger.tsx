"use client";

import React from "react";
import Link from "next/link";
import { ShieldCheck, CheckCircle2, GitBranch, Award, Lock, ExternalLink } from "lucide-react";

export function GrowthPassportLedger() {
  return (
    <section id="passport" className="w-full py-24 sm:py-32 px-6 sm:px-10 lg:px-14 max-w-[1440px] mx-auto text-white">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16 border-b border-white/[0.08] pb-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.05] border border-white/10 text-xs font-semibold text-[#5BAE75] mb-3">
            <ShieldCheck className="w-3.5 h-3.5 text-[#5BAE75]" />
            <span>HONEST VERIFICATION ARCHITECTURE</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
            Proof, Not Claims. The Growth Passport.
          </h2>
          <p className="text-sm sm:text-base text-white/60 mt-2 max-w-xl">
            A dynamic, tamper-proof student record backed by cryptographic hashes, GitHub commits, and college faculty attestations.
          </p>
        </div>

        <Link
          href="/passport"
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-[#D3E57A] hover:underline self-start md:self-end"
        >
          <span>Explore Passport Architecture</span>
          <ExternalLink className="w-4 h-4" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
        {/* Tier 1 */}
        <div className="rounded-[28px] bg-[#12131C]/80 backdrop-blur-2xl border border-white/[0.08] p-7 flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center mb-5">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            </div>
            <h3 className="text-xl font-bold text-white">Tier 1: Institutional Attestation</h3>
            <p className="text-xs text-white/60 mt-2 leading-relaxed">
              Cryptographically signed by college deans, faculty mentors, or hackathon organizers. Zero resume inflation.
            </p>
          </div>
          <div className="mt-6 pt-4 border-t border-white/[0.06] text-[11px] font-mono text-emerald-400">
            ✓ Tamper-proof hash ledger
          </div>
        </div>

        {/* Tier 2 */}
        <div className="rounded-[28px] bg-[#12131C]/80 backdrop-blur-2xl border border-white/[0.08] p-7 flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-2xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center mb-5">
              <GitBranch className="w-5 h-5 text-cyan-400" />
            </div>
            <h3 className="text-xl font-bold text-white">Tier 2: Link-Supported Evidence</h3>
            <p className="text-xs text-white/60 mt-2 leading-relaxed">
              Direct verification via merged GitHub pull requests, production demo URLs, and published research DOI links.
            </p>
          </div>
          <div className="mt-6 pt-4 border-t border-white/[0.06] text-[11px] font-mono text-cyan-400">
            ✓ Automated commit crawler
          </div>
        </div>

        {/* Tier 3 */}
        <div className="rounded-[28px] bg-[#12131C]/80 backdrop-blur-2xl border border-white/[0.08] p-7 flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-2xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center mb-5">
              <Award className="w-5 h-5 text-purple-400" />
            </div>
            <h3 className="text-xl font-bold text-white">Tier 3: Student Reflection</h3>
            <p className="text-xs text-white/60 mt-2 leading-relaxed">
              Self-logged learnings, team retrospectives, and documented engineering roadblocks overcome.
            </p>
          </div>
          <div className="mt-6 pt-4 border-t border-white/[0.06] text-[11px] font-mono text-purple-400">
            ✓ Verified skill taxonomy
          </div>
        </div>
      </div>
    </section>
  );
}

export default GrowthPassportLedger;
