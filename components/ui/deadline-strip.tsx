import React from "react";
import { cn } from "@/lib/utils";

export interface DayItem {
  date: string; // ISO date string or YYYY-MM-DD
  dayLabel: string; // e.g. "Mon"
  dateNumber: number | string; // e.g. 12
  hasDeadline?: boolean;
}

interface DeadlineStripProps {
  days: DayItem[];
  selectedDate: string;
  onSelectDate: (date: string) => void;
  className?: string;
}

export function DeadlineStrip({
  days,
  selectedDate,
  onSelectDate,
  className,
}: DeadlineStripProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-2.5 overflow-x-auto no-scrollbar py-2",
        className
      )}
    >
      {days.map((item) => {
        const isSelected = item.date === selectedDate;
        return (
          <button
            key={item.date}
            onClick={() => onSelectDate(item.date)}
            className={cn(
              "flex flex-col items-center justify-between w-14 py-3.5 px-1 rounded-[24px] transition-all duration-200 btn-press shrink-0 outline-none select-none relative",
              isSelected
                ? "bg-[#1E1E22] text-white shadow-md dark:bg-white dark:text-[#1E1E22]"
                : "bg-white/80 dark:bg-white/10 text-[#1E1E22] dark:text-white hover:bg-white dark:hover:bg-white/15 border border-black/5 dark:border-white/10"
            )}
          >
            <span
              className={cn(
                "text-caption font-medium tracking-tight",
                isSelected
                  ? "text-white/80 dark:text-[#1E1E22]/80"
                  : "text-[#6B7280] dark:text-gray-400"
              )}
            >
              {item.dayLabel}
            </span>

            <div
              className={cn(
                "w-9 h-9 rounded-full flex items-center justify-center font-bold text-body mt-2 transition-all",
                isSelected
                  ? "bg-white/20 dark:bg-black/10 text-white dark:text-[#1E1E22]"
                  : "text-[#1E1E22] dark:text-white"
              )}
            >
              {item.dateNumber}
            </div>

            {item.hasDeadline && (
              <span
                className={cn(
                  "w-1.5 h-1.5 rounded-full mt-1.5",
                  isSelected ? "bg-[#D3E57A]" : "bg-[#E0605E]"
                )}
              />
            )}
          </button>
        );
      })}
    </div>
  );
}
