import React, { forwardRef } from "react";
import { cn } from "@/lib/utils";
import { ChevronDown, LucideIcon } from "lucide-react";

export interface Option {
  value: string;
  label: string;
}

export interface SelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: Option[];
  error?: string;
  icon?: LucideIcon;
  helperText?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, options, error, icon: Icon, helperText, id, ...props }, ref) => {
    const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

    return (
      <div className="w-full flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={selectId}
            className="text-small font-medium text-[#6B7280] dark:text-gray-300 ml-1 select-none"
          >
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {Icon && (
            <div className="absolute left-4 pointer-events-none text-[#6B7280] dark:text-gray-400">
              <Icon className="w-4 h-4" strokeWidth={1.75} />
            </div>
          )}
          <select
            id={selectId}
            ref={ref}
            className={cn(
              "w-full h-12 px-5 pr-10 rounded-full text-body text-[#1E1E22] dark:text-white appearance-none cursor-pointer",
              "bg-white/95 dark:bg-[#222228] border border-black/5 dark:border-white/10",
              "shadow-xs outline-none transition-all duration-200",
              "focus:border-[#1E1E22] focus:ring-2 focus:ring-[#1E1E22]/10 dark:focus:border-white dark:focus:ring-white/10",
              Icon && "pl-11",
              error && "border-[#E0605E]",
              className
            )}
            {...props}
          >
            {options.map((opt) => (
              <option key={opt.value} value={opt.value} className="bg-white dark:bg-[#222228] text-[#1E1E22] dark:text-white">
                {opt.label}
              </option>
            ))}
          </select>
          <div className="absolute right-4 pointer-events-none text-gray-500">
            <ChevronDown className="w-4 h-4 stroke-[2]" />
          </div>
        </div>
        {error ? (
          <span className="text-caption text-[#E0605E] ml-2 font-medium">{error}</span>
        ) : helperText ? (
          <span className="text-caption text-gray-500 ml-2">{helperText}</span>
        ) : null}
      </div>
    );
  }
);

Select.displayName = "Select";
