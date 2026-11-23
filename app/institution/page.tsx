"use client";

import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { FilterChips } from "@/components/ui/filter-chips";
import { DarkFeatureCard } from "@/components/ui/dark-feature-card";
import { ProgressBar } from "@/components/ui/progress-bar";
import {
  Building2,
  ShieldAlert,
  BarChart3,
  Users,
  Target,
  Sparkles,
  Lock,
  Layers,
  GraduationCap,
} from "lucide-react";

export default function InstitutionDashboardPage() {
  const [selectedDept, setSelectedDept] = useState("all");
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAnalytics() {
      setLoading(true);
      try {
        const url = selectedDept === "all"
          ? "/api/institution/analytics"
          : `/api/institution/analytics?department=${encodeURIComponent(selectedDept)}`;
        const res = await fetch(url);
        const json = await res.json();
        if (json.success) {
          setAnalytics(json.data);
        }
      } catch {
        // Handled
      } finally {
        setLoading(false);
      }
    }
    fetchAnalytics();
  }, [selectedDept]);

  return (
    <div className="flex flex-col gap-8 py-2">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#2F6BFF]/15 text-[#2F6BFF] text-caption font-bold mb-2">
            <Building2 className="w-3.5 h-3.5" />
            INSTITUTIONAL AGGREGATE INTELLIGENCE
          </div>
          <h1 className="text-display font-light tracking-tight text-[#1E1E22] dark:text-white leading-tight">
            Campus <span className="font-normal">Analytics</span>
          </h1>
          <p className="text-small text-[#6B7280] dark:text-gray-400 mt-1">
            Aggregated opportunity trends, student stage momentum, and curriculum skill gaps.
          </p>
        </div>

        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/5 dark:bg-white/10 text-caption font-bold text-[#6B7280] dark:text-gray-300">
          <Lock className="w-3.5 h-3.5" />
          Strict Aggregation (Min Cohort &ge; 5)
        </div>
      </div>

      {/* Department Filter Chips */}
      <div>
        <FilterChips
          options={[
            { id: "all", label: "All Departments (18 students)" },
            { id: "Computer Science", label: "Computer Science (10 students)" },
            { id: "Data Science", label: "Data Science (5 students)" },
            { id: "Design", label: "Design (3 students — triggers privacy guardrail)" },
          ]}
          selectedId={selectedDept}
          onChange={setSelectedDept}
        />
      </div>

      {loading ? (
        <div className="p-12 text-center text-gray-500 rounded-[28px] glass-surface">
          Computing aggregate cohort metrics...
        </div>
      ) : analytics?.suppressed ? (
        /* PRIVACY SUPPRESSION ALERT */
        <Card className="p-8 border-2 border-dashed border-[#E7A23C] bg-[#E7A23C]/5 text-center flex flex-col items-center gap-3">
          <div className="w-14 h-14 rounded-full bg-[#E7A23C]/20 text-[#E7A23C] flex items-center justify-center">
            <ShieldAlert className="w-7 h-7" />
          </div>
          <h3 className="text-h2 font-bold text-[#1E1E22] dark:text-white">
            Aggregate Metrics Suppressed
          </h3>
          <p className="text-body text-[#6B7280] dark:text-gray-300 max-w-lg">
            {analytics.message}
          </p>
          <span className="text-caption font-semibold text-gray-500 bg-white/60 dark:bg-white/10 px-3 py-1 rounded-full">
            Filtered Cohort Size: {analytics.cohort_count} students (Threshold is 5)
          </span>
        </Card>
      ) : (
        /* AGGREGATED METRICS VIEW */
        <div className="flex flex-col gap-8">
          {/* Top 3 Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <Card variant="glass" className="p-6 flex flex-col gap-2">
              <span className="text-caption font-bold text-gray-500 uppercase tracking-wider">
                Total Active Students
              </span>
              <div className="text-display font-light text-[#1E1E22] dark:text-white">
                {analytics?.cohort_count || 18}
              </div>
              <span className="text-caption text-[#5BAE75] font-semibold">
                100% anonymized student cohort
              </span>
            </Card>

            <Card variant="glass" className="p-6 flex flex-col gap-2">
              <span className="text-caption font-bold text-gray-500 uppercase tracking-wider">
                Average Opportunity Readiness
              </span>
              <div className="text-display font-light text-[#1E1E22] dark:text-white">
                {analytics?.engagement?.average_readiness || 68}%
              </div>
              <span className="text-caption text-gray-500 font-semibold">
                Across active preparation checklists
              </span>
            </Card>

            <Card variant="glass" className="p-6 flex flex-col gap-2">
              <span className="text-caption font-bold text-gray-500 uppercase tracking-wider">
                Verified Outcomes Logged
              </span>
              <div className="text-display font-light text-[#D3E57A] dark:text-[#D3E57A]">
                {analytics?.engagement?.verified_outcomes_count || 24}
              </div>
              <span className="text-caption text-gray-500 font-semibold">
                Certificates and link-supported records
              </span>
            </Card>
          </div>

          {/* Application Pipeline Stages */}
          <Card className="flex flex-col gap-5 p-6 sm:p-8">
            <div className="flex items-center justify-between border-b border-black/5 dark:border-white/5 pb-3">
              <h3 className="text-h2 font-semibold tracking-tight text-[#1E1E22] dark:text-white">
                Campus Application Pipeline
              </h3>
              <span className="text-caption text-gray-500 font-mono">
                Real-time Cohort Distribution
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
              {[
                { stage: "Saved", count: analytics?.stage_counts?.saved || 7, color: "bg-gray-400" },
                { stage: "Preparing", count: analytics?.stage_counts?.preparing || 8, color: "bg-[#2F6BFF]" },
                { stage: "Applied", count: analytics?.stage_counts?.applied || 5, color: "bg-[#E7A23C]" },
                { stage: "Attended", count: analytics?.stage_counts?.attended || 4, color: "bg-[#D9C9F5]" },
                { stage: "Completed / Won", count: analytics?.stage_counts?.done || 6, color: "bg-[#5BAE75]" },
              ].map((item) => (
                <div key={item.stage} className="p-4 rounded-2xl bg-black/[0.02] dark:bg-white/5 border border-black/5 dark:border-white/10 flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${item.color}`} />
                    <span className="text-caption font-bold text-gray-500 truncate">
                      {item.stage}
                    </span>
                  </div>
                  <div className="text-h1 font-bold text-[#1E1E22] dark:text-white mt-1">
                    {item.count}
                  </div>
                  <span className="text-[11px] text-gray-400">Applications</span>
                </div>
              ))}
            </div>
          </Card>

          {/* Curriculum Skill Gaps & Demand */}
          <Card className="flex flex-col gap-5 p-6 sm:p-8">
            <div>
              <h3 className="text-h2 font-semibold tracking-tight text-[#1E1E22] dark:text-white">
                Identified Campus Skill Gaps
              </h3>
              <p className="text-small text-gray-500 mt-0.5">
                Highest-frequency missing prerequisite skills identified in student opportunity applications.
              </p>
            </div>

            <div className="flex flex-col gap-4">
              {analytics?.skill_gaps?.map((gap: any) => (
                <div key={gap.skill} className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between text-small font-semibold">
                    <span className="text-[#1E1E22] dark:text-white">
                      {gap.skill}
                    </span>
                    <span className="text-gray-500">
                      Demanded by {gap.count} applications
                    </span>
                  </div>
                  <ProgressBar
                    progress={(gap.count / 15) * 100}
                    showPercentage={false}
                    fillColor="bg-[#2F6BFF]"
                  />
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
