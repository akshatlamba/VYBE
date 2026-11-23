import React, { forwardRef } from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "lime" | "ghost" | "round-icon-black" | "round-icon-white";
  size?: "sm" | "md" | "lg" | "icon";
  fullWidth?: boolean;
  label?: string;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      fullWidth = false,
      disabled,
      label,
      children,
      style,
      ...props
    },
    ref
  ) => {
    const isPrimaryPill = variant === "primary" || variant === "round-icon-black";

    const baseClasses =
      "inline-flex items-center justify-center font-medium transition-all duration-200 outline-none select-none btn-press disabled:opacity-50 disabled:pointer-events-none focus-visible:ring-2 focus-visible:ring-[#1E1E22] focus-visible:ring-offset-2 dark:focus-visible:ring-white";

    const variantClasses = {
      // Primary pill button: Uses --btn-primary-bg & --btn-primary-fg tokens with .btn-primary-theme
      primary:
        "btn-primary-theme hover:opacity-90 active:scale-95 shadow-md border border-white/10",
      // Secondary white pill
      secondary:
        "bg-white/90 text-[#1E1E22] hover:bg-white active:bg-gray-50 border border-black/5 shadow-sm dark:bg-white/10 dark:text-white dark:border-white/10 dark:hover:bg-white/15",
      // Lime accent button
      lime:
        "bg-[#D3E57A] text-[#1E1E22] hover:bg-[#C5DA62] active:bg-[#B7CC54] font-semibold shadow-sm",
      // Ghost button
      ghost:
        "bg-transparent text-[#1E1E22] hover:bg-black/5 active:bg-black/10 dark:text-white dark:hover:bg-white/10",
      // Round icon button (primary filled)
      "round-icon-black":
        "btn-primary-theme hover:opacity-90 active:scale-95 shadow-md rounded-full w-11 h-11 min-w-[44px] min-h-[44px] p-0 flex items-center justify-center",
      // Round icon button (white for notifications / actions)
      "round-icon-white":
        "bg-white/95 text-[#1E1E22] hover:bg-white active:scale-95 shadow-sm border border-black/5 rounded-full w-11 h-11 min-w-[44px] min-h-[44px] p-0 flex items-center justify-center dark:bg-white/10 dark:text-white dark:border-white/10",
    };

    const sizeClasses = {
      sm: "h-9 px-4 text-small rounded-full min-h-[36px]",
      md: "h-12 px-6 text-body rounded-full min-h-[44px]",
      lg: "h-14 px-8 text-body font-semibold rounded-full min-h-[48px]",
      icon: "w-11 h-11 p-0 rounded-full min-w-[44px] min-h-[44px]",
    };

    const isRoundIcon =
      variant === "round-icon-black" || variant === "round-icon-white";

    const primaryInlineStyle: React.CSSProperties = isPrimaryPill
      ? {
          backgroundColor: "var(--btn-primary-bg)",
          color: "var(--btn-primary-fg)",
        }
      : {};

    const content = children ?? label;

    return (
      <button
        ref={ref}
        disabled={disabled}
        aria-label={props["aria-label"] || (typeof content === "string" ? content : label)}
        style={{ ...primaryInlineStyle, ...style }}
        className={cn(
          baseClasses,
          variantClasses[variant],
          !isRoundIcon && sizeClasses[size],
          fullWidth && "w-full",
          className
        )}
        {...props}
      >
        {content}
      </button>
    );
  }
);

Button.displayName = "Button";
