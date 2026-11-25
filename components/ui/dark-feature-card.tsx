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
  stats: [StatItem, StatItem, StatItem] | StatItem[];
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
        "rounded-[28px] sm:rounded-[32px] p-6 sm:p-7 md:p-8 flex flex-col justify-between",
        "bg-[#202026] text-white",
        "border border-white/[0.08]",
        "shadow-[0_16px_40px_-10px_rgba(0,0,0,0.35)]",
        className
      )}
    >
      {/* Header Row: Title & Streak Chip */}
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
          {title}
        </h3>
        {streakDays > 0 && (
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/[0.06] border border-white/10 text-caption font-semibold text-white/90 shadow-xs">
            <Flame className="w-3.5 h-3.5 text-[#F87171] fill-[#F87171]" />
            <span>{streakDays}-Day Streak</span>
          </div>
        )}
      </div>

      {/* Main Content: Lime Progress Ring + 3 Stats */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 sm:gap-10 my-1">
        {/* Left: Lime Progress Ring */}
        <div className="flex items-center justify-center shrink-0">
          <ProgressRing
            progress={computedProgress}
            size={116}
            trackWidth={16}
            arcWidth={14}
            trackColor="rgba(255, 255, 255, 0.12)"
            fillColor="#D4E866"
            hideKnob
            textClassName="text-white text-2xl font-bold"
          />
        </div>

        {/* Right: 3 Stats Stacked Vertically */}
        <div className="flex flex-col gap-3.5 justify-center w-full sm:w-auto">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div key={idx} className="flex items-center gap-3.5">
                <div className="w-8 h-8 rounded-full bg-white/[0.07] border border-white/10 flex items-center justify-center text-white/80 shrink-0">
                  <Icon className="w-4 h-4 stroke-[2]" />
                </div>
                <div className="flex items-baseline gap-2 min-w-0">
                  <span className="text-base sm:text-lg font-bold text-white tracking-tight">
                    {stat.value}
                  </span>
                  <span className="text-sm text-white/70 font-normal truncate">
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
        <div className="pt-5 mt-5 border-t border-white/[0.08] flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-col gap-1.5 flex-1 min-w-0">
            <span className="text-[10px] sm:text-[11px] font-bold tracking-widest text-white/45 uppercase">
              Up Next
            </span>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 flex-wrap">
              {upNextTasks.slice(0, 2).map((t) => (
                <div
                  key={t.id}
                  className="inline-flex items-center gap-2 text-xs sm:text-sm font-medium text-white/90"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#D3E57A] shrink-0" />
                  <span className="truncate max-w-[280px]">{t.title}</span>
                  <span className="text-xs text-white/50 font-normal shrink-0">({t.due})</span>
                </div>
              ))}
            </div>
          </div>

          <Link href="/tracker" className="shrink-0 w-full sm:w-auto">
            <button
              onClick={onStartTask}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-[#D4E866] hover:bg-[#c5da62] active:scale-95 text-[#1E1E22] text-xs sm:text-sm font-bold transition-all shadow-sm cursor-pointer"
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
