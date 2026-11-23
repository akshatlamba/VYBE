import React from "react";
import { cn } from "@/lib/utils";

export interface TabItem {
  id: string;
  label: string;
  count?: number;
}

interface PillTabsProps {
  tabs: TabItem[];
  activeTab: string;
  onChange: (id: string) => void;
  className?: string;
}

export function PillTabs({ tabs, activeTab, onChange, className }: PillTabsProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-2 overflow-x-auto no-scrollbar py-1",
        className
      )}
      role="tablist"
    >
      {tabs.map((tab) => {
        const isActive = tab.id === activeTab;
        return (
          <button
            key={tab.id}
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(tab.id)}
            className={cn(
              "flex items-center gap-2.5 px-4 py-2 rounded-full text-small font-medium transition-all duration-200 btn-press shrink-0 outline-none select-none",
              isActive
                ? "bg-[#D3E57A] text-[#1E1E22] shadow-sm font-semibold"
                : "bg-white/80 dark:bg-white/10 text-[#1E1E22] dark:text-white hover:bg-white dark:hover:bg-white/15 border border-black/5 dark:border-white/10"
            )}
          >
            {tab.count !== undefined && (
              <span
                className={cn(
                  "w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0",
                  isActive
                    ? "bg-white text-[#1E1E22] shadow-xs"
                    : "bg-[#EAEAEA] dark:bg-white/20 text-[#6B7280] dark:text-gray-300"
                )}
              >
                {tab.count}
              </span>
            )}
            <span>{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
}
