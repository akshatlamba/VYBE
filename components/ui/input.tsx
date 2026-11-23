import React, { forwardRef } from "react";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: LucideIcon;
  helperText?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, icon: Icon, helperText, id, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

    return (
      <div className="w-full flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={inputId}
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
          <input
            id={inputId}
            ref={ref}
            className={cn(
              "w-full h-12 px-5 rounded-full text-body text-[#1E1E22] dark:text-white",
              "bg-white/95 dark:bg-[#222228] border border-black/5 dark:border-white/10",
              "shadow-xs placeholder:text-gray-400 dark:placeholder:text-gray-500",
              "outline-none transition-all duration-200",
              "focus:border-[#1E1E22] focus:ring-2 focus:ring-[#1E1E22]/10 dark:focus:border-white dark:focus:ring-white/10",
              Icon && "pl-11",
              error && "border-[#E0605E] focus:border-[#E0605E] focus:ring-[#E0605E]/10",
              className
            )}
            {...props}
          />
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

Input.displayName = "Input";
