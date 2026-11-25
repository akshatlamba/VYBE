"use client";

import React from "react";
import Link from "next/link";
import { Briefcase, ArrowRight } from "lucide-react";

interface RelatedOpportunitiesPanelProps {
  onOpenOpportunity?: () => void;
  className?: string;
}

export function RelatedOpportunitiesPanel({
  onOpenOpportunity,
  className = "",
}: RelatedOpportunitiesPanelProps) {
  return (
    <div
      className={`rounded-[24px] border border-black/10 bg-white/85 p-4 sm:p-5 backdrop-blur-2xl shadow-sm dark:border-white/10 dark:bg-[#161626]/85 dark:shadow-xl flex flex-col justify-between ${className}`}
    >
      <div className="flex items-center justify-between pb-2.5 border-b border-black/5 dark:border-white/10">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-pink-500/15 text-pink-600 dark:text-pink-400">
            <Briefcase className="h-4 w-4" />
          </div>
          <h3 className="text-sm font-bold text-[#1E1E22] dark:text-white tracking-tight">
            Related Opportunities
          </h3>
        </div>
        <Link
          href="/radar"
          className="text-xs font-semibold text-[#5E5B63] hover:text-[#1E1E22] dark:text-gray-400 dark:hover:text-white transition-colors"
        >
          View all →
        </Link>
      </div>

      <div className="mt-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          {/* Opportunity Image (Astronaut / Tech Icon) */}
          <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl border border-black/10 dark:border-white/15 bg-slate-900 shadow-md">
            <img
              src="/space_hackathon.jpg"
              alt="Space Technology Hackathon"
              className="h-full w-full object-cover transition-transform duration-300 hover:scale-110"
            />
          </div>

          <div className="flex flex-col min-w-0">
            <h4 className="text-xs sm:text-sm font-bold text-[#1E1E22] dark:text-white truncate">
              Space Technology Hackathon
            </h4>
            <div className="mt-1.5 flex items-center gap-2">
              <span className="rounded-md bg-indigo-50 text-indigo-700 dark:bg-indigo-500/25 dark:text-indigo-300 px-2 py-0.5 text-[10px] font-extrabold uppercase">
                Hackathon
              </span>
              <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                ₹50,000 Pool
              </span>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <Link
          href="/radar"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-black/5 text-[#1E1E22] hover:bg-black/10 dark:bg-white/10 dark:text-white dark:hover:bg-white/20 transition active:scale-95"
          title="Explore opportunity"
        >
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
