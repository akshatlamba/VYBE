"use client";

import React from "react";
import { Sparkles, X, MessageSquare, Bot } from "lucide-react";

interface FloatingPulseButtonProps {
  isOpen: boolean;
  onToggle: () => void;
}

export function FloatingPulseButton({ isOpen, onToggle }: FloatingPulseButtonProps) {
  return (
    <aside
      aria-label="Quick PULSE Assistant"
      className="fixed right-6 bottom-24 md:right-12 lg:right-16 md:bottom-8 z-40 select-none print:hidden pointer-events-auto"
    >
      <div className="relative group">
        {/* Subtle Ambient Pulse Wave Animation */}
        {!isOpen && (
          <span
            className="absolute -inset-1 rounded-full bg-[#D3E57A]/25 blur-md animate-pulse pointer-events-none group-hover:bg-[#D3E57A]/40 transition-all duration-300"
            aria-hidden="true"
          />
        )}

        {/* Floating Action Button */}
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={isOpen}
          aria-controls="quick-pulse-panel"
          aria-label={isOpen ? "Close Quick PULSE Assistant" : "Open Quick PULSE AI Assistant"}
          title={isOpen ? "Close Assistant" : "Ask Quick PULSE Assistant"}
          className={`relative flex items-center justify-center transition-all duration-300 ease-out btn-press cursor-pointer shadow-xl rounded-full ${
            isOpen
              ? "w-12 h-12 sm:w-13 sm:h-13 bg-[#1E1E24] text-white border border-white/20 shadow-lg"
              : "w-12 h-12 sm:w-13 sm:h-13 bg-[#17171C]/90 hover:bg-[#1E1E24] dark:bg-[#17171C]/90 dark:hover:bg-[#202028] text-white border border-white/15 hover:border-[#D3E57A]/60 shadow-glow-lime backdrop-blur-xl"
          }`}
        >
          {/* Inner Glowing Ring */}
          <div className="absolute inset-0 rounded-full border border-white/10 pointer-events-none" />

          {/* Icon state toggle */}
          {isOpen ? (
            <X className="w-5 h-5 text-gray-300 transition-transform duration-200 rotate-0 hover:rotate-90" />
          ) : (
            <div className="relative flex items-center justify-center">
              {/* Sleek Custom Pulse Icon with Glowing Lime Accent */}
              <div className="relative">
                <Sparkles className="w-5 h-5 sm:w-5.5 sm:h-5.5 text-[#D3E57A] fill-[#D3E57A]/20 transition-transform duration-300 group-hover:scale-110 drop-shadow-[0_0_8px_rgba(211,229,122,0.6)]" />
              </div>

              {/* Live Online Pulse Dot in top-right */}
              <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#D3E57A] opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#D3E57A] ring-2 ring-[#17171C]" />
              </span>
            </div>
          )}
        </button>

        {/* Desktop Tooltip / Pill Badge on Hover (Positioned on top to avoid horizontal text interference) */}
        {!isOpen && (
          <div
            role="tooltip"
            className="hidden md:flex items-center gap-1.5 absolute bottom-full left-1/2 -translate-x-1/2 mb-2.5 px-3 py-1.5 rounded-full liquid-glass bg-[#1E1E24]/95 text-white text-caption font-bold tracking-tight shadow-xl border border-white/10 opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none whitespace-nowrap translate-y-1 group-hover:translate-y-0"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#D3E57A] fill-current" />
            <span>Quick PULSE</span>
          </div>
        )}
      </div>
    </aside>
  );
}
