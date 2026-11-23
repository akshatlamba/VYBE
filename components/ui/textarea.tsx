import React, { forwardRef } from "react";
import { cn } from "@/lib/utils";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, helperText, id, rows = 4, ...props }, ref) => {
    const textareaId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

    return (
      <div className="w-full flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={textareaId}
            className="text-small font-medium text-[#6B7280] dark:text-gray-300 ml-1 select-none"
          >
            {label}
          </label>
        )}
        <textarea
          id={textareaId}
          ref={ref}
          rows={rows}
          className={cn(
            "w-full p-4 rounded-[20px] text-body text-[#1E1E22] dark:text-white",
            "bg-white/95 dark:bg-[#222228] border border-black/5 dark:border-white/10",
            "shadow-xs placeholder:text-gray-400 dark:placeholder:text-gray-500",
            "outline-none transition-all duration-200 resize-none",
            "focus:border-[#1E1E22] focus:ring-2 focus:ring-[#1E1E22]/10 dark:focus:border-white dark:focus:ring-white/10",
            error && "border-[#E0605E] focus:border-[#E0605E]",
            className
          )}
          {...props}
        />
        {error ? (
          <span className="text-caption text-[#E0605E] ml-2 font-medium">{error}</span>
        ) : helperText ? (
          <span className="text-caption text-gray-500 ml-2">{helperText}</span>
        ) : null}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";
