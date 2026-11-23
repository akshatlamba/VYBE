import React from "react";
import { cn } from "@/lib/utils";

interface TimelineItemProps {
  time: string;
  isLast?: boolean;
  children: React.ReactNode;
  className?: string;
  dotColor?: string;
}

export function TimelineItem({
  time,
  isLast = false,
  children,
  className,
  dotColor = "bg-[#1E1E22] dark:bg-[#D3E57A]",
}: TimelineItemProps) {
  return (
    <div className={cn("grid grid-cols-[64px_24px_1fr] sm:grid-cols-[80px_28px_1fr] gap-2 items-start relative", className)}>
      {/* Time on left */}
      <div className="text-right pt-4">
        <span className="text-small font-semibold text-[#1E1E22] dark:text-white tracking-tight">
          {time}
        </span>
      </div>

      {/* Vertical Line with Node */}
      <div className="flex flex-col items-center h-full relative pt-5">
        <div className={cn("w-3 h-3 rounded-full shrink-0 ring-4 ring-white/60 dark:ring-black/40 z-10", dotColor)} />
        {!isLast && (
          <div className="w-[1.5px] bg-black/10 dark:bg-white/10 flex-1 my-1" />
        )}
      </div>

      {/* Content card on right */}
      <div className="pb-6">
        {children}
      </div>
    </div>
  );
}
