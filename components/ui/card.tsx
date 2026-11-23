import React, { forwardRef } from "react";
import { cn } from "@/lib/utils";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "glass" | "solid" | "subtle" | "liquid-glass";
  clickable?: boolean;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = "glass", clickable = false, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "rounded-[28px] p-6 transition-all duration-200 relative overflow-hidden",
          variant === "liquid-glass" && [
            "liquid-glass shadow-md",
          ],
          variant === "glass" && [
            "bg-white/70 dark:bg-[#1C1C20]/80",
            "backdrop-blur-[20px] backdrop-saturate-[140%]",
            "border border-white/60 dark:border-white/10",
            "shadow-[0_8px_30px_rgb(0,0,0,0.04)]",
            "before:absolute before:inset-x-0 before:top-0 before:h-[1px] before:bg-white/80 dark:before:bg-white/15",
          ],
          variant === "solid" && [
            "bg-white/95 dark:bg-[#222228]",
            "border border-black/[0.04] dark:border-white/10",
            "shadow-sm",
          ],
          variant === "subtle" && [
            "bg-white/40 dark:bg-white/[0.04]",
            "border border-white/40 dark:border-white/5",
          ],
          clickable && "cursor-pointer hover:shadow-md hover:scale-[1.01] active:scale-[0.99] btn-press",
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = "Card";
