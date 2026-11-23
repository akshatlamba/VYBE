import React from "react";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";
import { Button } from "./button";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "rounded-[28px] p-8 text-center flex flex-col items-center justify-center border border-dashed border-black/10 dark:border-white/10 bg-white/40 dark:bg-white/[0.02]",
        className
      )}
    >
      <div className="w-14 h-14 rounded-full bg-[#D3E57A]/30 text-[#1E1E22] dark:text-[#D3E57A] flex items-center justify-center mb-4">
        <Icon className="w-6 h-6 stroke-[1.75]" />
      </div>
      <h3 className="text-h3 font-semibold text-[#1E1E22] dark:text-white mb-2">
        {title}
      </h3>
      <p className="text-body text-[#6B7280] dark:text-gray-400 max-w-sm mb-6">
        {description}
      </p>
      {actionLabel && onAction && (
        <Button onClick={onAction} variant="primary" size="sm" label={actionLabel}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
