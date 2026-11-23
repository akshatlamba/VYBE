"use client";

import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SourceBadge } from "@/components/ui/badge";
import { ProgressRing } from "@/components/ui/progress-ring";
import { ArrowLeft, CheckCircle2, Clock, Scale } from "lucide-react";
import { getOpportunityById, PERSONAS } from "@/lib/data/mock-db";
import { checkEligibility } from "@/lib/intelligence/eligibility";
import { calculateFitScore } from "@/lib/intelligence/fit-scorer";
import { assessReadiness } from "@/lib/intelligence/readiness";

function CompareContent() {
  const searchParams = useSearchParams();
  const idsParam = searchParams.get("ids") || "opp-001,opp-003";
  const student = PERSONAS.beginner;

  const ids = idsParam.split(",").map((s) => s.trim()).filter(Boolean);
  const opportunities = ids
    .map((id) => getOpportunityById(id))
    .filter((o): o is NonNullable<typeof o> => o !== undefined);

  if (opportunities.length < 2) {
    return (
      <div className="py-12 text-center flex flex-col items-center">
        <h2 className="text-h2 font-bold mb-3">Compare Requires at Least 2 Items</h2>
        <p className="text-body text-gray-500 mb-6">
          Please select opportunities from Opportunity Radar to compare side-by-side.
        </p>
        <Link href="/radar">
          <Button variant="primary" label="Back to Opportunity Radar">Back to Opportunity Radar</Button>
        </Link>
      </div>
    );
  }

  const compared = opportunities.map((opp) => ({
    ...opp,
    eligibility: checkEligibility(student, opp),
    fit: calculateFitScore(student, opp),
    readiness: assessReadiness(student, opp),
  }));

  return (
    <div className="flex flex-col gap-6 py-2">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Link
          href="/radar"
          className="inline-flex items-center gap-2 text-small font-semibold text-[#6B7280] dark:text-gray-300 hover:text-black dark:hover:text-white"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Radar
        </Link>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#D3E57A]/30 text-[#1E1E22] dark:text-[#D3E57A] text-caption font-bold">
          <Scale className="w-3.5 h-3.5" />
          SIDE-BY-SIDE MATRIX
        </div>
      </div>

      <div>
        <h1 className="text-display font-light tracking-tight text-[#1E1E22] dark:text-white leading-tight">
          Compare <span className="font-normal">Opportunities</span>
        </h1>
        <p className="text-small text-[#6B7280] dark:text-gray-400 mt-1">
          Evaluating {compared.length} opportunities on identical decision criteria for {student.name}.
        </p>
      </div>

      {/* Comparison Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {compared.map((item) => (
          <Card key={item.id} variant="glass" className="p-6 flex flex-col gap-5 justify-between">
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <SourceBadge status={item.source_status} />
                <span className="text-caption font-bold text-gray-500">{item.type}</span>
              </div>

              <div>
                <h3 className="text-h3 font-bold text-[#1E1E22] dark:text-white leading-snug">
                  {item.title}
                </h3>
                <span className="text-caption text-gray-500">by {item.organizer}</span>
              </div>

              {/* Progress Ring */}
              <div className="flex items-center justify-center py-2">
                <ProgressRing
                  progress={item.fit.total_score}
                  size={84}
                  strokeWidth={9}
                  textClassName="text-h3 font-bold"
                />
              </div>

              {/* Identical Attributes Comparison */}
              <div className="flex flex-col gap-2.5 text-small border-t border-black/5 dark:border-white/5 pt-4">
                <div className="flex justify-between py-1 border-b border-black/5 dark:border-white/5">
                  <span className="text-gray-500">Eligibility:</span>
                  <span className="font-bold text-[#5BAE75]">
                    {item.eligibility.eligible ? "Eligible" : "Ineligible"}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-black/5 dark:border-white/5">
                  <span className="text-gray-500">Readiness:</span>
                  <span className="font-semibold">{item.readiness.checklistRatio}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-black/5 dark:border-white/5">
                  <span className="text-gray-500">Cost:</span>
                  <span className="font-semibold">{item.cost === 0 ? "Free" : `₹${item.cost}`}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-black/5 dark:border-white/5">
                  <span className="text-gray-500">Format:</span>
                  <span className="font-semibold capitalize">{item.format}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-black/5 dark:border-white/5">
                  <span className="text-gray-500">Deadline:</span>
                  <span className="font-semibold">{new Date(item.deadline).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-black/5 dark:border-white/5">
                  <span className="text-gray-500">Level:</span>
                  <span className="font-semibold">{item.level}</span>
                </div>
              </div>

              {/* Skills */}
              <div className="flex flex-col gap-1.5">
                <span className="text-caption font-bold text-gray-500">Primary Skills:</span>
                <div className="flex flex-wrap gap-1.5">
                  {item.skills.map((s) => (
                    <span
                      key={s}
                      className="px-2.5 py-0.5 rounded-full text-caption bg-[#D9C9F5]/30 text-[#45366E] dark:text-[#E2D5FC]"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-black/5 dark:border-white/5">
              <Link href={`/radar/${item.id}`} className="w-full block">
                <Button variant="primary" fullWidth size="md" label="See Full Plan & Receipt">
                  See Full Plan & Receipt
                </Button>
              </Link>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default function ComparePage() {
  return (
    <Suspense fallback={<div className="p-8">Loading comparison...</div>}>
      <CompareContent />
    </Suspense>
  );
}
