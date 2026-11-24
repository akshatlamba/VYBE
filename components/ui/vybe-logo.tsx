import React from "react";

interface VybeSymbolProps {
  size?: number | string;
  className?: string;
}

/**
 * Official VYBE "V" Symbol
 * Featuring the signature royal blue to cyan left wing,
 * luminous cyan apex pivot, and radiant lilac to deep violet right wing.
 */
export function VybeSymbol({ size = 32, className = "" }: VybeSymbolProps) {
  const pixelSize = typeof size === "number" ? `${size}px` : size;

  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ width: pixelSize, height: pixelSize }}
      className={`shrink-0 select-none ${className}`}
      aria-label="VYBE Emblem"
    >
      <defs>
        {/* Left Arm: Deep Electric Blue into Radiant Cyan */}
        <linearGradient id="vybe-sym-blue" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#4F46E5" />
          <stop offset="25%" stopColor="#3B82F6" />
          <stop offset="65%" stopColor="#0EA5E9" />
          <stop offset="100%" stopColor="#38BDF8" />
        </linearGradient>

        {/* Apex Highlight: Luminous Cyan */}
        <linearGradient id="vybe-sym-cyan" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#38BDF8" />
          <stop offset="100%" stopColor="#22D3EE" />
        </linearGradient>

        {/* Right Arm: Soft Lilac to Electric Purple */}
        <linearGradient id="vybe-sym-purple" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#E9D5FF" />
          <stop offset="35%" stopColor="#C084FC" />
          <stop offset="70%" stopColor="#9333EA" />
          <stop offset="100%" stopColor="#7C3AED" />
        </linearGradient>

        <filter id="vybe-sym-glow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="1.5" stdDeviation="3.5" floodColor="#7C3AED" floodOpacity="0.3" />
          <feDropShadow dx="0" dy="1" stdDeviation="5" floodColor="#38BDF8" floodOpacity="0.25" />
        </filter>
      </defs>

      <g filter="url(#vybe-sym-glow)">
        {/* Left Arm Capsule */}
        <rect
          x="20"
          y="12"
          width="21"
          height="68"
          rx="10.5"
          transform="rotate(-23 30.5 46)"
          fill="url(#vybe-sym-blue)"
        />

        {/* Cyan Rounded Apex Pivot */}
        <circle
          cx="49.5"
          cy="76.5"
          r="10.5"
          fill="url(#vybe-sym-cyan)"
        />

        {/* Right Arm Capsule */}
        <rect
          x="59"
          y="12"
          width="21"
          height="60"
          rx="10.5"
          transform="rotate(23 69.5 42)"
          fill="url(#vybe-sym-purple)"
        />
      </g>
    </svg>
  );
}

interface VybeLogoProps {
  size?: number | string;
  showText?: boolean;
  subtitle?: string;
  className?: string;
  textClassName?: string;
}

/**
 * Official VYBE Full Brand Logo
 * Combines the stylized "V" emblem with the bold "VYBE" wordmark.
 */
export function VybeLogo({
  size = 36,
  showText = true,
  subtitle,
  className = "",
  textClassName = "",
}: VybeLogoProps) {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <VybeSymbol size={size} />
      {showText && (
        <div className="flex flex-col leading-none">
          <span
            className={`font-black tracking-tight text-white font-sans ${
              textClassName || "text-lg sm:text-xl"
            }`}
          >
            VYBE
          </span>
          {subtitle && (
            <span className="text-[10px] text-slate-400 font-semibold tracking-wider uppercase mt-0.5">
              {subtitle}
            </span>
          )}
        </div>
      )}
    </div>
  );
}

export default VybeLogo;
