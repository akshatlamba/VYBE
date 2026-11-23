import React from "react";
import { cn } from "@/lib/utils";

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "pill" | "card" | "text" | "circle";
}

export function Skeleton({
  className,
  variant = "text",
  ...props
}: SkeletonProps) {
  const variantStyles = {
    pill: "h-9 rounded-full",
    card: "h-40 rounded-[28px]",
    text: "h-4 rounded-md",
    circle: "rounded-full aspect-square",
  };

  return (
    <div
      className={cn(
        "skeleton-shimmer bg-black/5 dark:bg-white/5",
        variantStyles[variant],
        className
      )}
      {...props}
    />
  );
}
