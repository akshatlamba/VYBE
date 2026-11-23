import React from "react";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

export interface FilterOption {
  id: string;
  label: string;
  icon?: LucideIcon;
}

interface FilterChipsProps {
  options: FilterOption[];
  selectedId: string;
  onChange: (id: string) => void;
  className?: string;
}

export function FilterChips({
  options,
  selectedId,
  onChange,
  className,
}: FilterChipsProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-2 overflow-x-auto no-scrollbar py-1",
        className
      )}
    >
      {options.map((option) => {
        const isSelected = option.id === selectedId;
        const Icon = option.icon;
        return (
          <button
            key={option.id}
            onClick={() => onChange(option.id)}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-full text-small font-medium transition-all duration-200 btn-press shrink-0 outline-none select-none",
              isSelected
                ? "bg-[#1E1E22] text-white shadow-sm dark:bg-white dark:text-[#1E1E22]"
                : "bg-white/80 dark:bg-white/10 text-[#1E1E22] dark:text-white hover:bg-white dark:hover:bg-white/15 border border-black/5 dark:border-white/10"
            )}
          >
            {Icon && <Icon className="w-4 h-4" strokeWidth={1.75} />}
            <span>{option.label}</span>
          </button>
        );
      })}
    </div>
  );
}
