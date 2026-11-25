"use client";

import React from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { VybeSymbol } from "@/components/ui/vybe-logo";

export function LandingFooter() {
  return (
    <footer className="w-full border-t border-white/[0.08] bg-[#030305] text-white py-16 px-6 sm:px-10 lg:px-14">
      <div className="max-w-[1440px] mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-10">
        {/* Brand */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2.5">
            <VybeSymbol size={26} />
            <span className="text-base font-extrabold tracking-tight text-white">VYBE</span>
          </div>
          <p className="text-xs text-white/50 max-w-sm">
            Student Opportunity & Growth Intelligence Platform. From signals into actions.
          </p>
        </div>

        {/* Links */}
        <div className="flex flex-wrap items-center gap-6 sm:gap-10 text-xs font-semibold text-white/60">
          <Link href="/radar" className="hover:text-white transition-colors">
            Radar
          </Link>
          <Link href="/pulse" className="hover:text-white transition-colors">
            PULSE AI
          </Link>
          <Link href="/passport" className="hover:text-white transition-colors">
            Passport
          </Link>
          <Link href="/community" className="hover:text-white transition-colors">
            Community
          </Link>
          <Link href="/admin" className="hover:text-[#D3E57A] transition-colors flex items-center gap-1">
            Admin Console
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Copyright */}
        <div className="text-[11px] text-white/40 font-mono">
          © {new Date().getFullYear()} VYBE Intelligence Layer. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

export default LandingFooter;
