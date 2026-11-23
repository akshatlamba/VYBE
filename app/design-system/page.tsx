"use client";

import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DarkFeatureCard } from "@/components/ui/dark-feature-card";
import { ProgressRing } from "@/components/ui/progress-ring";
import { ProgressBar } from "@/components/ui/progress-bar";
import { PillTabs } from "@/components/ui/pill-tabs";
import { FilterChips } from "@/components/ui/filter-chips";
import { DeadlineStrip } from "@/components/ui/deadline-strip";
import {
  PriorityBadge,
  SourceBadge,
  VerificationBadge,
  SkillTag,
  StatusBadge,
} from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Checkbox, Toggle } from "@/components/ui/checkbox";
import { AvatarStack } from "@/components/ui/avatar-stack";
import { TimelineItem } from "@/components/ui/timeline-item";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import { useTheme } from "@/lib/theme/theme-provider";
import {
  Calendar,
  CheckCircle2,
  Clock,
  Sparkles,
  Search,
  Plus,
  Bell,
  Layers,
  ArrowRight,
  Folder,
} from "lucide-react";

export default function DesignSystemPage() {
  const { theme, setTheme, resolvedTheme } = useTheme();

  // Component state playgrounds
  const [activeTab, setActiveTab] = useState("all");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [selectedDate, setSelectedDate] = useState("2026-11-25");
  const [checkboxVal, setCheckboxVal] = useState(true);
  const [toggleVal, setToggleVal] = useState(true);
  const [skills, setSkills] = useState(["React", "TypeScript", "Python", "System Design"]);

  const sampleDays = [
    { date: "2026-11-23", dayLabel: "Mon", dateNumber: 23 },
    { date: "2026-11-24", dayLabel: "Tue", dateNumber: 24, hasDeadline: true },
    { date: "2026-11-25", dayLabel: "Wed", dateNumber: 25, hasDeadline: true },
    { date: "2026-11-26", dayLabel: "Thu", dateNumber: 26 },
    { date: "2026-11-27", dayLabel: "Fri", dateNumber: 27 },
    { date: "2026-11-28", dayLabel: "Sat", dateNumber: 28 },
  ];

  return (
    <div className="flex flex-col gap-12 py-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-black/5 dark:border-white/10">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D3E57A]/30 text-[#1E1E22] dark:text-[#D3E57A] text-caption font-bold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            LIVING DESIGN SYSTEM
          </div>
          <h1 className="text-display font-light tracking-tight text-[#1E1E22] dark:text-white leading-tight">
            Tokens & Components
          </h1>
          <p className="text-body text-[#6B7280] dark:text-gray-400 mt-2 max-w-2xl">
            Soft, glassy, premium design language adapted from the visual reference.
            Tokens, accessibility standards, and reusable building blocks for VYBE.
          </p>
        </div>

        {/* Quick Theme Switcher */}
        <div className="flex items-center gap-2 bg-white/80 dark:bg-white/10 p-1.5 rounded-full border border-black/5 dark:border-white/10 shadow-xs">
          <button
            onClick={() => setTheme("light")}
            className={`px-3 py-1 rounded-full text-caption font-semibold transition-all ${
              theme === "light"
                ? "bg-[#1E1E22] text-white dark:bg-white dark:text-[#1E1E22] shadow-xs"
                : "text-gray-600 dark:text-gray-300"
            }`}
          >
            Light
          </button>
          <button
            onClick={() => setTheme("dark")}
            className={`px-3 py-1 rounded-full text-caption font-semibold transition-all ${
              theme === "dark"
                ? "bg-[#1E1E22] text-white dark:bg-white dark:text-[#1E1E22] shadow-xs"
                : "text-gray-600 dark:text-gray-300"
            }`}
          >
            Dark
          </button>
          <button
            onClick={() => setTheme("system")}
            className={`px-3 py-1 rounded-full text-caption font-semibold transition-all ${
              theme === "system"
                ? "bg-[#1E1E22] text-white dark:bg-white dark:text-[#1E1E22] shadow-xs"
                : "text-gray-600 dark:text-gray-300"
            }`}
          >
            System
          </button>
        </div>
      </div>

      {/* SECTION 1: COLOR PALETTE TOKENS */}
      <section className="flex flex-col gap-4">
        <h2 className="text-h2 font-semibold tracking-tight text-[#1E1E22] dark:text-white">
          1. Color Palette Tokens
        </h2>
        <p className="text-small text-[#6B7280] dark:text-gray-400">
          Sampled from the reference image: soft pastel mesh accents paired with deep ink and charcoal surfaces.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {[
            { name: "Peach Accent", hex: "#FAD8C6", role: "Mesh Top-Left", text: "#1E1E22" },
            { name: "Pink Accent", hex: "#F6C9DD", role: "Mesh Middle", text: "#1E1E22" },
            { name: "Lilac Accent", hex: "#D9C9F5", role: "Mesh Right / Skill Chips", text: "#1E1E22" },
            { name: "Lime Accent", hex: "#D3E57A", role: "Progress Ring / Active Tab", text: "#1E1E22" },
            { name: "Deep Ink", hex: "#1E1E22", role: "Text / Primary Controls", text: "#FFFFFF" },
            { name: "Charcoal", hex: "#26262B", role: "Feature Cards / Avatars", text: "#FFFFFF" },
            { name: "Info Blue", hex: "#2F6BFF", role: "Action / Sourced Links", text: "#FFFFFF" },
            { name: "Success Green", hex: "#5BAE75", role: "Eligibility & Low Priority", text: "#FFFFFF" },
            { name: "Warning Amber", hex: "#E7A23C", role: "Medium Priority / Stale", text: "#FFFFFF" },
            { name: "Danger Red", hex: "#E0605E", role: "High Priority / Expiry", text: "#FFFFFF" },
          ].map((c) => (
            <div
              key={c.name}
              className="p-4 rounded-[20px] glass-surface flex flex-col justify-between h-28 shadow-xs border border-white/60 dark:border-white/10"
              style={{ backgroundColor: `${c.hex}33` }}
            >
              <div className="flex items-center justify-between">
                <span
                  className="w-5 h-5 rounded-full ring-2 ring-white/80 shadow-xs"
                  style={{ backgroundColor: c.hex }}
                />
                <span className="text-[11px] font-mono font-bold text-[#1E1E22] dark:text-white">
                  {c.hex}
                </span>
              </div>
              <div>
                <div className="text-small font-bold text-[#1E1E22] dark:text-white">
                  {c.name}
                </div>
                <div className="text-[11px] text-[#6B7280] dark:text-gray-400">
                  {c.role}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 2: TYPOGRAPHY SCALE */}
      <section className="flex flex-col gap-4">
        <h2 className="text-h2 font-semibold tracking-tight text-[#1E1E22] dark:text-white">
          2. Typography Scale (Plus Jakarta Sans)
        </h2>
        <Card className="flex flex-col gap-6">
          <div className="flex flex-col md:flex-row md:items-baseline justify-between border-b border-black/5 dark:border-white/5 pb-4">
            <span className="text-[11px] font-mono text-[#6B7280] dark:text-gray-400 w-32">
              Display 40/44 (300-400)
            </span>
            <span className="text-display font-light tracking-tight text-[#1E1E22] dark:text-white">
              Let&apos;s Make Today Productive
            </span>
          </div>

          <div className="flex flex-col md:flex-row md:items-baseline justify-between border-b border-black/5 dark:border-white/5 pb-4">
            <span className="text-[11px] font-mono text-[#6B7280] dark:text-gray-400 w-32">
              H1 32/38 (Bold)
            </span>
            <span className="text-h1 font-bold tracking-tight text-[#1E1E22] dark:text-white">
              Opportunity Radar
            </span>
          </div>

          <div className="flex flex-col md:flex-row md:items-baseline justify-between border-b border-black/5 dark:border-white/5 pb-4">
            <span className="text-[11px] font-mono text-[#6B7280] dark:text-gray-400 w-32">
              H2 24/30 (Semibold)
            </span>
            <span className="text-h2 font-semibold tracking-tight text-[#1E1E22] dark:text-white">
              Today&apos;s Action Plan
            </span>
          </div>

          <div className="flex flex-col md:flex-row md:items-baseline justify-between border-b border-black/5 dark:border-white/5 pb-4">
            <span className="text-[11px] font-mono text-[#6B7280] dark:text-gray-400 w-32">
              H3 18/24 (Medium)
            </span>
            <span className="text-h3 font-medium text-[#1E1E22] dark:text-white">
              Growth Intelligence & Readiness Analysis
            </span>
          </div>

          <div className="flex flex-col md:flex-row md:items-baseline justify-between border-b border-black/5 dark:border-white/5 pb-4">
            <span className="text-[11px] font-mono text-[#6B7280] dark:text-gray-400 w-32">
              Body 16/24 (Regular)
            </span>
            <span className="text-body text-[#1E1E22] dark:text-gray-200">
              VYBE turns fragmented student discovery into structured, measurable career progression.
            </span>
          </div>

          <div className="flex flex-col md:flex-row md:items-baseline justify-between">
            <span className="text-[11px] font-mono text-[#6B7280] dark:text-gray-400 w-32">
              Caption 12/16 (Semibold)
            </span>
            <span className="text-caption font-semibold text-[#6B7280] dark:text-gray-400 uppercase tracking-wider">
              PREREQUISITE MET · ELIGIBLE · DEADLINE IN 4 DAYS
            </span>
          </div>
        </Card>
      </section>

      {/* SECTION 3: DARK FEATURE CARD */}
      <section className="flex flex-col gap-4">
        <h2 className="text-h2 font-semibold tracking-tight text-[#1E1E22] dark:text-white">
          3. Dark Feature Card & Progress Ring
        </h2>
        <p className="text-small text-[#6B7280] dark:text-gray-400">
          The signature charcoal feature card with a lime progress ring on a white track, vertical divider, and 3 stat icon chips.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <DarkFeatureCard
            title="Today's Progress"
            progress={72}
            stats={[
              { icon: Calendar, value: 12, label: "Total Task" },
              { icon: CheckCircle2, value: 8, label: "Completed Task" },
              { icon: Clock, value: 4, label: "Pending Task" },
            ]}
          />

          <Card className="flex flex-col justify-between">
            <h3 className="text-h3 font-semibold text-[#1E1E22] dark:text-white">
              Standalone Progress Rings
            </h3>
            <div className="flex items-center justify-around py-4">
              <ProgressRing progress={35} size={72} strokeWidth={8} />
              <ProgressRing progress={72} size={96} strokeWidth={10} />
              <ProgressRing progress={95} size={110} strokeWidth={11} />
            </div>
            <ProgressBar progress={72} label="Action Plan Completion" />
          </Card>
        </div>
      </section>

      {/* SECTION 4: BUTTONS & CONTROLS */}
      <section className="flex flex-col gap-4">
        <h2 className="text-h2 font-semibold tracking-tight text-[#1E1E22] dark:text-white">
          4. Buttons & Interactive Controls
        </h2>
        <Card className="flex flex-col gap-6">
          <div className="flex flex-wrap items-center gap-4">
            <Button variant="primary" label="Primary Pill">Primary Pill</Button>
            <Button variant="secondary" label="Secondary White Pill">Secondary White Pill</Button>
            <Button variant="lime" label="Lime Accent">Lime Accent</Button>
            <Button variant="ghost" label="Ghost Button">Ghost Button</Button>
            <Button variant="round-icon-black" label="Add" aria-label="Add">
              <Plus className="w-5 h-5 stroke-[2.2]" />
            </Button>
            <Button variant="round-icon-white" label="Notifications" aria-label="Notifications">
              <Bell className="w-5 h-5 stroke-[1.8]" />
            </Button>
          </div>

          <div className="border-t border-black/5 dark:border-white/5 pt-4">
            <h4 className="text-small font-semibold text-[#6B7280] dark:text-gray-400 mb-3">
              Button Sizes
            </h4>
            <div className="flex flex-wrap items-center gap-4">
              <Button size="sm" label="Small (36px)">Small (36px)</Button>
              <Button size="md" label="Medium (44px)">Medium (44px)</Button>
              <Button size="lg" label="Large (48px+)">Large (48px+)</Button>
            </div>
          </div>
        </Card>
      </section>

      {/* SECTION 5: PILLS, TABS & DEADLINE STRIP */}
      <section className="flex flex-col gap-4">
        <h2 className="text-h2 font-semibold tracking-tight text-[#1E1E22] dark:text-white">
          5. Filter Chips, Pill Tabs & Deadline Strip
        </h2>
        <Card className="flex flex-col gap-6">
          {/* Status Tabs with Count */}
          <div>
            <h4 className="text-small font-semibold text-[#6B7280] dark:text-gray-400 mb-2">
              Status Pill Tabs (Active is Lime with White Count Circle)
            </h4>
            <PillTabs
              tabs={[
                { id: "all", label: "To Do", count: 4 },
                { id: "in_progress", label: "In Progress", count: 2 },
                { id: "in_review", label: "In Review", count: 3 },
                { id: "completed", label: "Done", count: 7 },
              ]}
              activeTab={activeTab}
              onChange={setActiveTab}
            />
          </div>

          {/* Filter Chips */}
          <div className="border-t border-black/5 dark:border-white/5 pt-4">
            <h4 className="text-small font-semibold text-[#6B7280] dark:text-gray-400 mb-2">
              Category Filter Chips (Active is Black Pill)
            </h4>
            <FilterChips
              options={[
                { id: "all", label: "All Categories" },
                { id: "hackathons", label: "Hackathons", icon: Layers },
                { id: "internships", label: "Internships", icon: Folder },
                { id: "research", label: "Research", icon: Sparkles },
              ]}
              selectedId={selectedFilter}
              onChange={setSelectedFilter}
            />
          </div>

          {/* Deadline Strip */}
          <div className="border-t border-black/5 dark:border-white/5 pt-4">
            <h4 className="text-small font-semibold text-[#6B7280] dark:text-gray-400 mb-2">
              Date & Deadline Strip (Tall Pill Columns, Selected is Black)
            </h4>
            <DeadlineStrip
              days={sampleDays}
              selectedDate={selectedDate}
              onSelectDate={setSelectedDate}
            />
          </div>
        </Card>
      </section>

      {/* SECTION 6: BADGES & LABELS */}
      <section className="flex flex-col gap-4">
        <h2 className="text-h2 font-semibold tracking-tight text-[#1E1E22] dark:text-white">
          6. Badges & Evidence States
        </h2>
        <Card className="flex flex-col gap-6">
          {/* Priority Badges */}
          <div>
            <h4 className="text-small font-semibold text-[#6B7280] dark:text-gray-400 mb-2">
              Priority Badges (Tinted Outlines with Dot)
            </h4>
            <div className="flex flex-wrap gap-3">
              <PriorityBadge priority="low" />
              <PriorityBadge priority="medium" />
              <PriorityBadge priority="high" />
            </div>
          </div>

          {/* Source Status Badges */}
          <div className="border-t border-black/5 dark:border-white/5 pt-4">
            <h4 className="text-small font-semibold text-[#6B7280] dark:text-gray-400 mb-2">
              Opportunity Radar Source Status
            </h4>
            <div className="flex flex-wrap gap-3">
              <SourceBadge status="sourced" />
              <SourceBadge status="unverified" />
              <SourceBadge status="stale" />
            </div>
          </div>

          {/* Growth Passport Verification States */}
          <div className="border-t border-black/5 dark:border-white/5 pt-4">
            <h4 className="text-small font-semibold text-[#6B7280] dark:text-gray-400 mb-2">
              Growth Passport Verification Levels
            </h4>
            <div className="flex flex-wrap gap-3">
              <VerificationBadge state="self_reported" />
              <VerificationBadge state="link_supported" />
              <VerificationBadge state="verified" />
            </div>
          </div>

          {/* Lilac Skill Tags */}
          <div className="border-t border-black/5 dark:border-white/5 pt-4">
            <h4 className="text-small font-semibold text-[#6B7280] dark:text-gray-400 mb-2">
              Lilac Removable Skill Chips
            </h4>
            <div className="flex flex-wrap gap-2">
              {skills.map((s) => (
                <SkillTag
                  key={s}
                  label={s}
                  onRemove={() => setSkills(skills.filter((x) => x !== s))}
                />
              ))}
            </div>
          </div>
        </Card>
      </section>

      {/* SECTION 7: FORM CONTROLS */}
      <section className="flex flex-col gap-4">
        <h2 className="text-h2 font-semibold tracking-tight text-[#1E1E22] dark:text-white">
          7. Form Controls (Reference UI Standard)
        </h2>
        <Card className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Task Title"
            placeholder="Finish landing page design"
            defaultValue="Design Landing page"
          />

          <Select
            label="Project Category"
            icon={Folder}
            options={[
              { value: "web", label: "Website Redesign" },
              { value: "ai", label: "AI Agent Experiment" },
              { value: "hackathon", label: "Prasunex 2026" },
            ]}
          />

          <div className="md:col-span-2">
            <Textarea
              label="Description"
              placeholder="Design the new landing page for the student intelligence platform..."
              defaultValue="Design the new landing page for the product launch."
              rows={3}
            />
          </div>

          <div className="flex flex-col gap-4">
            <h4 className="text-small font-semibold text-[#6B7280] dark:text-gray-400">
              Checkbox & Toggle
            </h4>
            <Checkbox
              checked={checkboxVal}
              onChange={setCheckboxVal}
              label="Make outcome public in Growth Passport"
            />
            <Toggle
              checked={toggleVal}
              onChange={setToggleVal}
              label="Receive deadline reminder emails"
            />
          </div>

          <div className="flex items-end">
            <Button variant="primary" fullWidth size="lg" label="Full-Width Submit Button">
              Full-Width Submit Button
            </Button>
          </div>
        </Card>
      </section>

      {/* SECTION 8: TIMELINE & AVATAR STACK */}
      <section className="flex flex-col gap-4">
        <h2 className="text-h2 font-semibold tracking-tight text-[#1E1E22] dark:text-white">
          8. Timeline List & Avatar Stack
        </h2>
        <Card className="flex flex-col gap-4">
          <TimelineItem time="9:00 AM">
            <Card variant="solid" className="p-4 flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-h3 font-semibold text-[#1E1E22] dark:text-white">
                  Meeting with Client
                </span>
                <span className="px-3 py-1 rounded-full text-caption font-bold bg-[#2F6BFF] text-white">
                  Meet
                </span>
              </div>
              <p className="text-small text-[#6B7280] dark:text-gray-400">
                Client meeting to review project progress, align on goals, and plan upcoming tasks.
              </p>
              <div className="flex items-center justify-between pt-2">
                <AvatarStack
                  avatars={[
                    { id: "1", name: "Ashutosh Singh" },
                    { id: "2", name: "Piyush Sharma" },
                    { id: "3", name: "Aashi Verma" },
                    { id: "4", name: "Akshat Jain" },
                    { id: "5", name: "Anugrah Roy" },
                  ]}
                  max={3}
                />
                <span className="text-caption text-gray-500">SRM Team</span>
              </div>
            </Card>
          </TimelineItem>

          <TimelineItem time="11:00 AM" isLast>
            <Card variant="solid" className="p-4 flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-h3 font-semibold text-[#1E1E22] dark:text-white">
                  Opportunity Receipt Generation
                </span>
                <StatusBadge label="In Progress" variant="lime" />
              </div>
              <p className="text-small text-[#6B7280] dark:text-gray-400">
                Verifying hard eligibility rules and computing readiness breakdown.
              </p>
              <div className="flex items-center justify-between pt-2">
                <AvatarStack
                  avatars={[
                    { id: "1", name: "Ashutosh Singh" },
                    { id: "2", name: "Piyush Sharma" },
                  ]}
                  max={2}
                />
              </div>
            </Card>
          </TimelineItem>
        </Card>
      </section>

      {/* SECTION 9: EMPTY STATE & SKELETON */}
      <section className="flex flex-col gap-4">
        <h2 className="text-h2 font-semibold tracking-tight text-[#1E1E22] dark:text-white">
          9. Skeletons & Empty State
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="flex flex-col gap-4">
            <h4 className="text-small font-semibold text-[#6B7280] dark:text-gray-400 mb-2">
              Loading Shimmer Skeletons
            </h4>
            <Skeleton variant="pill" className="w-1/2" />
            <Skeleton variant="card" />
            <Skeleton variant="text" />
            <Skeleton variant="text" className="w-4/5" />
          </Card>

          <EmptyState
            icon={Search}
            title="No Applications Yet"
            description="Explore Opportunity Radar to discover hackathons, research programs, and internships matching your profile."
            actionLabel="Discover Opportunities"
            onAction={() => alert("Navigate to Opportunity Radar")}
          />
        </div>
      </section>
    </div>
  );
}
