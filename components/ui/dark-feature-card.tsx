import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { ProgressRing } from "./progress-ring";
import { LucideIcon, Flame, ArrowRight, CheckCircle2 } from "lucide-react";

export interface StatItem {
  icon: LucideIcon;
  value: string | number;
  label: string;
}

export interface UpNextTask {
  id: string;
  title: string;
  due: string;
}

interface DarkFeatureCardProps {
  title?: string;
  progress: number; // 0-100 computed from data
  stats: [StatItem, StatItem, StatItem];
  upNextTasks?: UpNextTask[];
  streakDays?: number;
  onStartTask?: () => void;
  className?: string;
}

export function DarkFeatureCard({
  title = "Today's Progress",
  progress,
  stats,
  upNextTasks = [
    { id: "task-1", title: "Complete SIH architecture diagram", due: "Today, 6:00 PM" },
    { id: "task-2", title: "Review Supabase RLS policies", due: "Tomorrow" },
  ],
  streakDays = 5,
  onStartTask,
  className,
}: DarkFeatureCardProps) {
  // Ensure progress is clamped and identical for ring & display
  const computedProgress = Math.round(Math.min(100, Math.max(0, progress)));

  return (
    <div
      className={cn(
        "dark-liquid-glass p-6 md:p-8 flex flex-col gap-6",
        className
      )}
    >
      {/* Header Row: Title & Streak Chip */}
      <div className="flex items-center justify-between">
        <h3 className="text-body font-semibold text-white tracking-tight">
          {title}
        </h3>
        {streakDays > 0 && (
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-caption font-bold text-white shadow-xs">
            <Flame className="w-3.5 h-3.5 text-[#E0605E]" />
            <span>{streakDays}-Day Streak</span>
          </div>
        )}
      </div>

      {/* Main Content: Lime Progress Ring + 3 Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-[auto_1px_1fr] items-center gap-6 sm:gap-7">
        {/* Left: Lime Progress Ring with Glow */}
        <div className="flex items-center justify-center sm:justify-start">
          <ProgressRing
            progress={computedProgress}
            size={104}
            strokeWidth={10}
            trackColor="stroke-white/15"
            fillColor="stroke-[#D3E57A]"
            className="lime-glow"
            textClassName="text-h3 font-bold text-white tracking-tight"
          />
        </div>

        {/* Vertical divider */}
        <div className="hidden sm:block w-[1px] h-24 bg-white/10 self-center" />

        {/* Right: 3 Pluralized Stats */}
        <div className="flex flex-col gap-3.5 justify-center">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div key={idx} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white shrink-0">
                  <Icon className="w-4 h-4" strokeWidth={2} />
                </div>
                <div className="flex items-baseline gap-2 min-w-0">
                  <span className="text-body font-bold text-white tracking-tight">
                    {stat.value}
                  </span>
                  <span className="text-caption text-gray-200 font-medium truncate">
                    {stat.label}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Up Next List & Primary CTA */}
      {upNextTasks.length > 0 && (
        <div className="pt-4 border-t border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-col gap-2 flex-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
              Up Next
            </span>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 flex-wrap">
              {upNextTasks.slice(0, 2).map((t) => (
                <div
                  key={t.id}
                  className="inline-flex items-center gap-2 text-caption font-medium text-white/90"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#D3E57A] shrink-0" />
                  <span className="truncate max-w-[220px]">{t.title}</span>
                  <span className="text-[11px] text-gray-400">({t.due})</span>
                </div>
              ))}
            </div>
          </div>

          <Link href="/tracker" className="shrink-0">
            <button
              onClick={onStartTask}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#D3E57A] text-[#1E1E22] hover:bg-[#c5da62] active:scale-95 text-small font-bold transition-all shadow-sm"
            >
              <span>Start next task</span>
              <ArrowRight className="w-4 h-4 stroke-[2.2]" />
            </button>
          </Link>
        </div>
      )}
    </div>
  );
}
