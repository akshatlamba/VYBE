
"use client";

import React from "react";
import { cn } from "@/lib/utils";

export interface LiquidGlassHeroProps {
  children: React.ReactNode;
  displacementScale?: number;
  blurAmount?: number;
  saturation?: number;
  aberrationIntensity?: number;
  elasticity?: number;
  cornerRadius?: number;
  overLight?: boolean;
  className?: string;
  containerClassName?: string;
  padding?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
  isDarkFeature?: boolean;
}

export function LiquidGlassHero({
  children,
  cornerRadius = 999,
  className,
  containerClassName,
  padding = "0px",
  style,
  onClick,
  isDarkFeature = false,
}: LiquidGlassHeroProps) {
  return (
    <div
      className={cn(
        "transition-all",
        isDarkFeature ? "dark-liquid-glass" : "liquid-glass",
        className,
        containerClassName
      )}
      style={{
        borderRadius: `${cornerRadius}px`,
        padding,
        ...style,
      }}
      onClick={onClick}
    >
      {children}
    </div>
  );
}

export default LiquidGlassHero;
