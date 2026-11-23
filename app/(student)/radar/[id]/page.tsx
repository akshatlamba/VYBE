"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SourceBadge, PriorityBadge, SkillTag } from "@/components/ui/badge";
import { ProgressRing } from "@/components/ui/progress-ring";
import { ProgressBar } from "@/components/ui/progress-bar";
import { TimelineItem } from "@/components/ui/timeline-item";
import { QRCodeSVG } from "qrcode.react";
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  ExternalLink,
  ShieldCheck,
  Calendar,
  Sparkles,
  Layers,
  FileText,
  AlertCircle,
  BookmarkPlus,
  Printer,
} from "lucide-react";
import { getOpportunityById, PERSONAS } from "@/lib/data/mock-db";
import { checkEligibility } from "@/lib/intelligence/eligibility";
import { calculateFitScore } from "@/lib/intelligence/fit-scorer";
import { assessReadiness } from "@/lib/intelligence/readiness";

export default function OpportunityDetailPage() {
  const params = useParams();
  const router = useRouter();
  const oppId = params.id as string;
  const opp = getOpportunityById(oppId);
  const student = PERSONAS.beginner;

  const [addedToTracker, setAddedToTracker] = useState(false);
  const [showReceiptModal, setShowReceiptModal] = useState(false);

  if (!opp) {
    return (
      <div className="py-16 text-center">
        <h2 className="text-h2 font-bold mb-3">Opportunity Not Found</h2>
        <Link href="/radar">
          <Button variant="primary" label="Back to Radar">Back to Radar</Button>
        </Link>
      </div>
    );
  }

  const eligibility = checkEligibility(student, opp);
  const fit = calculateFitScore(student, opp);
  const readiness = assessReadiness(student, opp);

  const handleAddToTracker = async () => {
    try {
      await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          opportunity_id: opp.id,
          stage: "preparing",
          notes: "Added from Opportunity Radar detail view.",
        }),
      });
      setAddedToTracker(true);
      setTimeout(() => {
        router.push("/tracker");
      }, 1000);
    } catch {
      setAddedToTracker(true);
    }
  };

  return (
    <div className="flex flex-col gap-8 py-4">
      {/* Back button & Action Row */}
      <div className="flex items-center justify-between">
        <Link
          href="/radar"
          className="inline-flex items-center gap-2 text-small font-semibold text-[#6B7280] dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Radar
        </Link>

        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            label="Print Receipt"
            onClick={() => window.print()}
            className="gap-1.5 hidden sm:inline-flex"
          >
            <Printer className="w-4 h-4" />
            Print Receipt
          </Button>
          <Button
            variant="primary"
            size="md"
            label={addedToTracker ? "Added to Tracker" : "Track This Opportunity"}
            onClick={handleAddToTracker}
            disabled={addedToTracker}
            className="gap-2 shadow-md"
          >
            <BookmarkPlus className="w-4 h-4" />
            {addedToTracker ? "Added to Tracker!" : "Add to Tracker"}
          </Button>
        </div>
      </div>

      {/* Hero Header Card */}
      <Card variant="glass" className="p-6 sm:p-8 flex flex-col gap-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <SourceBadge status={opp.source_status} />
            <span className="px-3 py-1 rounded-full text-caption font-semibold bg-black/5 dark:bg-white/10 text-[#1E1E22] dark:text-gray-200">
              {opp.type}
            </span>
            <span className="text-caption text-[#6B7280] dark:text-gray-400">
              Verified by {opp.organizer}
            </span>
          </div>

          <div className="text-caption text-gray-500">
            Last checked: {new Date(opp.last_checked_at).toLocaleDateString()}
          </div>
        </div>

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex flex-col gap-2 max-w-2xl">
            <h1 className="text-display font-light tracking-tight text-[#1E1E22] dark:text-white leading-tight">
              {opp.title}
            </h1>
            <p className="text-body text-[#6B7280] dark:text-gray-300">
              {opp.description}
            </p>
            <div className="flex items-center gap-2 pt-1 text-small font-semibold text-[#2F6BFF]">
              <a
                href={opp.source_url}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline inline-flex items-center gap-1.5"
              >
                Official Source Portal
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Fit Score & Status Ring */}
          <div className="flex items-center gap-6 p-4 rounded-[24px] bg-white/60 dark:bg-black/20 border border-white/60 dark:border-white/10 shrink-0 self-start lg:self-center">
            <div className="flex flex-col items-center">
              <ProgressRing
                progress={fit.total_score}
                size={84}
                strokeWidth={9}
                textClassName="text-h3 font-bold"
              />
              <span className="text-[11px] font-bold text-gray-500 mt-1 uppercase">
                Fit Score
              </span>
            </div>
            <div className="flex flex-col gap-1.5">
              <div className="text-caption font-bold text-gray-400 uppercase">
                Verdict
              </div>
              <span className="px-3 py-1 rounded-full text-caption font-bold bg-[#5BAE75]/15 text-[#2B7343] dark:text-[#78C991] w-fit">
                {eligibility.eligible ? "Eligible" : "Ineligible"}
              </span>
              <span className="text-caption text-[#6B7280] dark:text-gray-400">
                Readiness: {readiness.readinessPercentage}%
              </span>
            </div>
          </div>
        </div>
      </Card>

      {/* Two Column Layout: Left Details, Right Opportunity Receipt */}
      <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-8">
        <div className="flex flex-col gap-8">
          {/* 1. Fit Breakdown with Reasons */}
          <Card className="flex flex-col gap-5">
            <div className="flex items-center justify-between border-b border-black/5 dark:border-white/5 pb-3">
              <h2 className="text-h2 font-semibold tracking-tight text-[#1E1E22] dark:text-white">
                Explainable Fit Breakdown
              </h2>
              <span className="text-caption text-[#6B7280] dark:text-gray-400 font-mono">
                Formula: Configurable Design Assumptions
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {[
                { label: "Interests (30%)", score: fit.interests_score, max: 30 },
                { label: "Career Goals (25%)", score: fit.goals_score, max: 25 },
                { label: "Budget (15%)", score: fit.budget_score, max: 15 },
                { label: "Schedule (15%)", score: fit.schedule_score, max: 15 },
                { label: "Format (10%)", score: fit.format_score, max: 10 },
                { label: "Level (5%)", score: fit.level_score, max: 5 },
              ].map((item) => (
                <div key={item.label} className="p-3 rounded-2xl bg-white/60 dark:bg-white/5 border border-black/5 dark:border-white/10">
                  <span className="text-[11px] font-semibold text-gray-500 block truncate">
                    {item.label}
                  </span>
                  <div className="text-h3 font-bold text-[#1E1E22] dark:text-white mt-0.5">
                    {item.score} / {item.max}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-col gap-2 pt-2">
              <h4 className="text-small font-bold text-[#1E1E22] dark:text-white">
                Explicit Matching Reasons:
              </h4>
              <ul className="list-disc list-inside text-small text-[#6B7280] dark:text-gray-300 space-y-1">
                {fit.reasons.map((r, idx) => (
                  <li key={idx}>{r}</li>
                ))}
              </ul>
            </div>
          </Card>

          {/* 2. Hard Eligibility Check Results */}
          <Card className="flex flex-col gap-4">
            <h2 className="text-h2 font-semibold tracking-tight text-[#1E1E22] dark:text-white">
              Hard Eligibility Check
            </h2>
            <div className="flex flex-col gap-2.5">
              {eligibility.passedChecks.map((check, idx) => (
                <div key={idx} className="flex items-center gap-2.5 text-small text-[#2B7343] dark:text-[#78C991]">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{check}</span>
                </div>
              ))}
              {eligibility.failedChecks.map((fail, idx) => (
                <div key={idx} className="flex items-center gap-2.5 text-small text-[#9E2A28] dark:text-[#F38684]">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{fail}</span>
                </div>
              ))}
            </div>
          </Card>

          {/* 3. Skill Gaps (Lilac Chips) */}
          <Card className="flex flex-col gap-4">
            <h2 className="text-h2 font-semibold tracking-tight text-[#1E1E22] dark:text-white">
              Required Skills & Identified Gaps
            </h2>
            <div className="flex flex-wrap gap-2.5">
              {opp.skills.map((skill) => {
                const hasSkill = student.skills.some((s) => s.name.toLowerCase() === skill.toLowerCase());
                return (
                  <span
                    key={skill}
                    className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-small font-medium border ${
                      hasSkill
                        ? "bg-[#5BAE75]/15 text-[#2B7343] border-[#5BAE75]/30 dark:text-[#78C991]"
                        : "bg-[#D9C9F5]/40 text-[#45366E] border-[#D9C9F5] dark:bg-[#D9C9F5]/20 dark:text-[#E2D5FC]"
                    }`}
                  >
                    {hasSkill ? <CheckCircle2 className="w-3.5 h-3.5" /> : <span>✦</span>}
                    <span>{skill}</span>
                    <span className="text-[11px] opacity-75">
                      {hasSkill ? "(Acquired)" : "(Skill Gap)"}
                    </span>
                  </span>
                );
              })}
            </div>
          </Card>

          {/* 4. Readiness Checklist as a Timeline */}
          <Card className="flex flex-col gap-5">
            <div className="flex items-center justify-between">
              <h2 className="text-h2 font-semibold tracking-tight text-[#1E1E22] dark:text-white">
                Readiness Action Timeline
              </h2>
              <span className="text-small font-bold text-[#5BAE75]">
                {readiness.checklistRatio}
              </span>
            </div>

            <div className="flex flex-col">
              {opp.preparation_checklist.map((item, idx) => (
                <TimelineItem
                  key={idx}
                  time={`Step ${idx + 1}`}
                  isLast={idx === opp.preparation_checklist.length - 1}
                  dotColor={item.done ? "bg-[#5BAE75]" : "bg-gray-300 dark:bg-white/20"}
                >
                  <div className="p-4 rounded-2xl bg-white/70 dark:bg-white/5 border border-black/5 dark:border-white/10 flex items-center justify-between">
                    <span className="text-body font-semibold text-[#1E1E22] dark:text-white">
                      {item.task}
                    </span>
                    <span
                      className={`text-caption font-bold px-2.5 py-1 rounded-full ${
                        item.done
                          ? "bg-[#5BAE75]/20 text-[#2B7343] dark:text-[#78C991]"
                          : "bg-gray-100 dark:bg-white/10 text-gray-500"
                      }`}
                    >
                      {item.done ? "Completed" : "Pending"}
                    </span>
                  </div>
                </TimelineItem>
              ))}
            </div>
          </Card>
        </div>

        {/* Right Column: OPPORTUNITY RECEIPT */}
        <div className="flex flex-col gap-4">
          <div className="sticky top-6">
            <div className="p-6 sm:p-7 rounded-[28px] bg-white dark:bg-[#1E1E24] shadow-xl border border-black/10 dark:border-white/10 text-[#1E1E22] dark:text-white flex flex-col gap-5 relative overflow-hidden">
              {/* Receipt Header */}
              <div className="border-b border-dashed border-gray-300 dark:border-gray-700 pb-4 text-center">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1E1E22] text-white text-caption font-bold mb-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#D3E57A]" />
                  OPPORTUNITY RECEIPT
                </div>
                <h3 className="text-h3 font-bold tracking-tight">
                  Verification Proof
                </h3>
                <div className="text-[11px] font-mono text-gray-500 mt-1">
                  REF-2026-{opp.id.toUpperCase().replace("-", "")}
                </div>
              </div>

              {/* Receipt QR Code & Metadata */}
              <div className="flex justify-center py-2">
                <div className="p-3 bg-white rounded-2xl shadow-xs ring-1 ring-black/5">
                  <QRCodeSVG
                    value={`https://vybe.app/receipt/${opp.id}?student=${student.id}`}
                    size={130}
                    level="M"
                  />
                </div>
              </div>

              {/* Receipt Ledger Table */}
              <div className="flex flex-col gap-2.5 text-small border-y border-dashed border-gray-300 dark:border-gray-700 py-4">
                <div className="flex justify-between">
                  <span className="text-gray-500">Student:</span>
                  <span className="font-semibold">{student.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Department:</span>
                  <span className="font-semibold">{student.department}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Academic Year:</span>
                  <span className="font-semibold">{student.academic_year}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Eligibility Status:</span>
                  <span className="font-bold text-[#5BAE75]">
                    {eligibility.eligible ? "VERIFIED ELIGIBLE" : "RESTRICTED"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Fit Index:</span>
                  <span className="font-bold">{fit.total_score} / 100</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Fee Required:</span>
                  <span className="font-bold">{opp.cost === 0 ? "₹0.00 (Free)" : `₹${opp.cost}.00`}</span>
                </div>
              </div>

              {/* Receipt Footer */}
              <div
                suppressHydrationWarning
                className="text-[11px] text-gray-500 text-center leading-tight"
              >
                Generated deterministically by VYBE 2.0 Intelligence Layer.
                Verification reference: 2026-11-23-PRASUNEX-SIH
              </div>

              <Button
                variant="primary"
                fullWidth
                size="lg"
                label={addedToTracker ? "Added to Tracker" : "Track This Opportunity"}
                onClick={handleAddToTracker}
                disabled={addedToTracker}
              >
                {addedToTracker ? "Added to Tracker" : "Track This Opportunity"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
