import React from "react";
import { cn } from "@/lib/utils";
import { Check, ShieldCheck, Link2, UserCheck, AlertTriangle, X } from "lucide-react";
import { getSkillMeta, SkillBadge } from "@/components/ui/skill-badge";

export { SkillBadge, getSkillMeta };

export type PriorityLevel = "low" | "medium" | "high";
export type SourceStatus = "sourced" | "unverified" | "stale";
export type VerificationState = "self_reported" | "link_supported" | "verified";

interface PriorityBadgeProps {
  priority: PriorityLevel;
  className?: string;
}

export function PriorityBadge({ priority, className }: PriorityBadgeProps) {
  const configs = {
    low: {
      label: "Low Priority",
      bg: "bg-[#5BAE75]/10 text-[#2B7343] border-[#5BAE75]/30 dark:text-[#78C991]",
      dot: "bg-[#5BAE75]",
    },
    medium: {
      label: "Medium Priority",
      bg: "bg-[#E7A23C]/10 text-[#9C610F] border-[#E7A23C]/30 dark:text-[#F3BA62]",
      dot: "bg-[#E7A23C]",
    },
    high: {
      label: "High Priority",
      bg: "bg-[#E0605E]/10 text-[#9E2A28] border-[#E0605E]/30 dark:text-[#F38684]",
      dot: "bg-[#E0605E]",
    },
  };

  const c = configs[priority] || configs.medium;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-caption font-semibold border",
        c.bg,
        className
      )}
    >
      <span className={cn("w-2 h-2 rounded-full shrink-0", c.dot)} />
      {c.label}
    </span>
  );
}

interface SourceBadgeProps {
  status: SourceStatus;
  className?: string;
}

export function SourceBadge({ status, className }: SourceBadgeProps) {
  if (status === "sourced") {
    return (
      <span
        className={cn(
          "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-caption font-semibold bg-[#5BAE75]/10 text-[#2B7343] border border-[#5BAE75]/30 dark:text-[#78C991]",
          className
        )}
      >
        <Check className="w-3.5 h-3.5 stroke-[2]" />
        Sourced
      </span>
    );
  }
  if (status === "stale") {
    return (
      <span
        className={cn(
          "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-caption font-semibold bg-[#E7A23C]/10 text-[#9C610F] border border-[#E7A23C]/30 dark:text-[#F3BA62]",
          className
        )}
      >
        <AlertTriangle className="w-3.5 h-3.5 stroke-[2]" />
        Needs Check
      </span>
    );
  }
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-caption font-semibold bg-gray-100 dark:bg-white/10 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-white/10",
        className
      )}
    >
      Unverified
    </span>
  );
}

interface VerificationBadgeProps {
  state: VerificationState;
  className?: string;
}

export function VerificationBadge({ state, className }: VerificationBadgeProps) {
  if (state === "verified") {
    return (
      <span
        className={cn(
          "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-caption font-semibold bg-[#D3E57A]/25 text-[#4D5A12] border border-[#D3E57A]/60 dark:text-[#D3E57A]",
          className
        )}
      >
        <ShieldCheck className="w-3.5 h-3.5 stroke-[2]" />
        Verified
      </span>
    );
  }
  if (state === "link_supported") {
    return (
      <span
        className={cn(
          "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-caption font-semibold bg-[#2F6BFF]/10 text-[#2F6BFF] border border-[#2F6BFF]/30 dark:text-[#6FA0FF]",
          className
        )}
      >
        <Link2 className="w-3.5 h-3.5 stroke-[2]" />
        Link-supported
      </span>
    );
  }
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-caption font-semibold bg-gray-100 dark:bg-white/10 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-white/10",
        className
      )}
    >
      <UserCheck className="w-3.5 h-3.5 stroke-[2]" />
      Self-reported
    </span>
  );
}

interface SkillTagProps {
  label: string;
  onRemove?: () => void;
  className?: string;
  showIcon?: boolean;
}

export function SkillTag({ label, onRemove, className, showIcon = true }: SkillTagProps) {
  const meta = getSkillMeta(label);

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-caption font-medium bg-[#D9C9F5]/40 text-[#45366E] border border-[#D9C9F5] dark:bg-[#D9C9F5]/20 dark:text-[#E2D5FC] dark:border-[#D9C9F5]/30 shadow-sm",
        className
      )}
    >
      {showIcon && (
        <span className={cn("flex items-center justify-center shrink-0 rounded-full p-0.5", meta.iconBg)}>
          {meta.icon}
        </span>
      )}
      <span>{label}</span>
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          className="hover:opacity-70 focus:outline-none ml-0.5"
          aria-label={`Remove ${label}`}
        >
          <X className="w-3 h-3 stroke-[2]" />
        </button>
      )}
    </span>
  );
}

interface StatusBadgeProps {
  label: string;
  variant?: "lime" | "charcoal" | "info" | "neutral";
  className?: string;
}

export function StatusBadge({ label, variant = "neutral", className }: StatusBadgeProps) {
  const styles = {
    lime: "bg-[#D3E57A] text-[#1E1E22] font-semibold",
    charcoal: "bg-[#1E1E22] text-white",
    info: "bg-[#2F6BFF]/15 text-[#2F6BFF] font-semibold dark:text-[#6FA0FF]",
    neutral: "bg-white/80 dark:bg-white/10 text-[#1E1E22] dark:text-white border border-black/5 dark:border-white/10",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center px-3 py-1 rounded-full text-caption font-medium",
        styles[variant],
        className
      )}
    >
      {label}
    </span>
  );
}
