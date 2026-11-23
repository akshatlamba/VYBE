import React from "react";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

interface CheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: React.ReactNode;
  disabled?: boolean;
  className?: string;
}

export function Checkbox({
  checked,
  onChange,
  label,
  disabled = false,
  className,
}: CheckboxProps) {
  return (
    <label
      className={cn(
        "inline-flex items-center gap-3 cursor-pointer select-none",
        disabled && "opacity-50 pointer-events-none",
        className
      )}
    >
      <button
        type="button"
        role="checkbox"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className={cn(
          "w-6 h-6 rounded-[8px] flex items-center justify-center transition-all duration-200 outline-none btn-press",
          checked
            ? "bg-[#1E1E22] text-white dark:bg-white dark:text-[#1E1E22] shadow-xs"
            : "bg-white/90 dark:bg-white/10 border border-black/15 dark:border-white/20 hover:border-black/30"
        )}
      >
        {checked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
      </button>
      {label && (
        <span className="text-body text-[#1E1E22] dark:text-white font-medium">
          {label}
        </span>
      )}
    </label>
  );
}

interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: React.ReactNode;
  disabled?: boolean;
  className?: string;
}

export function Toggle({
  checked,
  onChange,
  label,
  disabled = false,
  className,
}: ToggleProps) {
  return (
    <label
      className={cn(
        "inline-flex items-center justify-between gap-3 cursor-pointer select-none w-full",
        disabled && "opacity-50 pointer-events-none",
        className
      )}
    >
      {label && (
        <span className="text-body text-[#1E1E22] dark:text-white font-medium">
          {label}
        </span>
      )}
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className={cn(
          "w-12 h-7 rounded-full p-0.5 transition-colors duration-200 outline-none relative",
          checked
            ? "bg-[#1E1E22] dark:bg-[#D3E57A]"
            : "bg-gray-200 dark:bg-white/20"
        )}
      >
        <div
          className={cn(
            "w-6 h-6 rounded-full bg-white transition-transform duration-200 shadow-sm",
            checked && "translate-x-5 dark:bg-[#1E1E22]"
          )}
        />
      </button>
    </label>
  );
}
