"use client";

import React, { useEffect } from "react";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  className?: string;
  maxWidth?: "sm" | "md" | "lg" | "xl";
}

export function Modal({
  isOpen,
  onClose,
  title,
  children,
  className,
  maxWidth = "md",
}: ModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const maxWidthClasses = {
    sm: "sm:max-w-md",
    md: "sm:max-w-lg",
    lg: "sm:max-w-2xl",
    xl: "sm:max-w-3xl",
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Sheet / Dialog Surface */}
      <div
        className={cn(
          "relative w-full z-10 overflow-hidden",
          // Mobile bottom sheet with slide up
          "rounded-t-[32px] sm:rounded-[28px] max-h-[90vh] flex flex-col",
          // Glass surface styling
          "bg-white/95 dark:bg-[#1E1E24]/95 backdrop-blur-2xl border-t sm:border border-white/60 dark:border-white/10 shadow-2xl",
          maxWidthClasses[maxWidth],
          className
        )}
      >
        {/* Mobile handle indicator */}
        <div className="sm:hidden w-12 h-1.5 bg-gray-300 dark:bg-white/20 rounded-full mx-auto mt-3 mb-1" />

        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 pt-4 pb-3 border-b border-black/5 dark:border-white/5">
          {title ? (
            <h2 className="text-h3 font-semibold text-[#1E1E22] dark:text-white tracking-tight">
              {title}
            </h2>
          ) : <div />}
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-gray-100 dark:bg-white/10 hover:bg-gray-200 dark:hover:bg-white/20 flex items-center justify-center text-[#1E1E22] dark:text-white transition-all btn-press"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5 stroke-[2]" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto">{children}</div>
      </div>
    </div>
  );
}
