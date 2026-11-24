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
        "rounded-[28px] p-6 md:p-8 flex flex-col gap-6",
        "bg-white/80 dark:bg-[#1A1A22]/85 backdrop-blur-2xl",
        "border border-white/60 dark:border-white/10",
        "shadow-[0_8px_32px_rgba(120,90,180,0.12)] dark:shadow-[0_16px_40px_-10px_rgba(10,10,16,0.55)]",
        className
      )}
    >
      {/* Header Row: Title & Streak Chip */}
      <div className="flex items-center justify-between">
        <h3 className="text-h3 font-extrabold text-[#1E1E22] dark:text-white tracking-tight">
          {title}
        </h3>
        {streakDays > 0 && (
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/5 dark:bg-white/10 border border-black/5 dark:border-white/15 text-caption font-bold text-[#1E1E22] dark:text-white shadow-xs">
            <Flame className="w-3.5 h-3.5 text-[#E0605E]" />
            <span>{streakDays}-Day Streak</span>
          </div>
        )}
      </div>

      {/* Main Content: Lime Progress Ring + 3 Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-[auto_1px_1fr] items-center gap-6 sm:gap-7">
        {/* Left: Lime Progress Ring */}
        <div className="flex items-center justify-center sm:justify-start">
          <ProgressRing
            progress={computedProgress}
            size={144}
          />
        </div>

        {/* Vertical divider */}
        <div className="hidden sm:block w-[1px] h-24 bg-black/10 dark:bg-white/10 self-center" />

        {/* Right: 3 Pluralized Stats */}
        <div className="grid grid-cols-3 gap-2 sm:flex sm:flex-col sm:gap-3.5 justify-center">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div
                key={idx}
                className="flex flex-col sm:flex-row items-center sm:items-center text-center sm:text-left gap-1.5 sm:gap-3 p-2.5 sm:p-0 rounded-2xl sm:rounded-none bg-black/[0.03] sm:bg-transparent dark:bg-white/5 dark:sm:bg-transparent border border-black/5 sm:border-0 dark:border-white/5 dark:sm:border-0"
              >
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-black/5 dark:bg-white/10 flex items-center justify-center text-[#1E1E22] dark:text-white shrink-0">
                  <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" strokeWidth={2.2} />
                </div>
                <div className="flex flex-col sm:flex-row sm:items-baseline sm:gap-2 min-w-0">
                  <span className="text-xl sm:text-2xl font-black text-[#1E1E22] dark:text-white tracking-tight">
                    {stat.value}
                  </span>
                  <span className="text-[11px] sm:text-caption text-[#4B5563] dark:text-gray-300 font-bold truncate max-w-full">
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
        <div className="pt-4 border-t border-black/5 dark:border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-col gap-2 flex-1">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#6B7280] dark:text-gray-400">
              Up Next
            </span>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 flex-wrap">
              {upNextTasks.slice(0, 2).map((t) => (
                <div
                  key={t.id}
                  className="inline-flex items-center gap-2 text-caption font-bold text-[#1E1E22] dark:text-white"
                >
                  <span className="w-2 h-2 rounded-full bg-[#D3E57A] shrink-0" />
                  <span className="truncate max-w-[220px]">{t.title}</span>
                  <span className="text-[11px] text-[#6B7280] dark:text-gray-400 font-medium">({t.due})</span>
                </div>
              ))}
            </div>
          </div>

          <Link href="/tracker" className="shrink-0 w-full sm:w-auto">
            <button
              onClick={onStartTask}
              className="w-full sm:w-auto justify-center inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#D3E57A] text-[#1E1E22] hover:bg-[#c5da62] active:scale-95 text-small font-black transition-all shadow-sm cursor-pointer"
            >
              <span>Start next task</span>
              <ArrowRight className="w-4 h-4 stroke-[2.5]" />
            </button>
          </Link>
        </div>
      )}
    </div>
  );
}
