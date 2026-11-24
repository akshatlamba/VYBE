"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { NavItem } from "./nav-items";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth/auth-context";
import { VybeSymbol } from "../ui/vybe-logo";
import {
  Menu,
  X,
  Compass,
  Sparkles,
  KanbanSquare,
  Award,
  Globe2,
  CalendarDays,
  User,
  ChevronRight,
  Palette,
  Home,
  LogOut,
} from "lucide-react";

interface BottomNavProps {
  items: NavItem[];
}

export function BottomNav({ items }: BottomNavProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useAuth();
  const [drawerOpen, setDrawerOpen] = useState(false);

  // If there are more than 5 items, optimize for 5 primary tabs + slide-up drawer
  const isLargeNav = items.length > 5;

  // Key primary tab IDs for quick student navigation
  const PRIMARY_IDS = ["home", "radar", "pulse", "tracker"];

  // Partition items
  const primaryItems = isLargeNav
    ? items.filter((item) => PRIMARY_IDS.includes(item.id))
    : items;

  const secondaryItems = isLargeNav
    ? items.filter((item) => !PRIMARY_IDS.includes(item.id))
    : [];

  // Check if current page is in secondary items
  const activeSecondaryItem = secondaryItems.find((item) =>
    pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href))
  );

  return (
    <>
      {/* Mobile Slide-Up Navigation Sheet ("More" Drawer) */}
      {drawerOpen && (
        <div
          className="md:hidden fixed inset-0 z-50 flex flex-col justify-end animate-in fade-in duration-200"
          role="dialog"
          aria-modal="true"
          aria-label="All Navigation Destinations"
        >
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/45 backdrop-blur-sm"
            onClick={() => setDrawerOpen(false)}
          />

          {/* Drawer Sheet */}
          <div className="relative z-10 w-full max-h-[85vh] rounded-t-[32px] liquid-glass bg-white/95 dark:bg-[#1C1C24]/95 border-t border-white/60 dark:border-white/10 p-5 pb-8 shadow-2xl flex flex-col gap-4 animate-in slide-in-from-bottom-6 duration-200">
            {/* Grab handle */}
            <div className="w-12 h-1 bg-black/15 dark:bg-white/20 rounded-full mx-auto" />

            {/* Header */}
            <div className="flex items-center justify-between pb-2 border-b border-black/5 dark:border-white/5">
              <div className="flex items-center gap-2.5">
                <VybeSymbol size={28} />
                <div>
                  <h3 className="text-h3 font-bold text-[#1E1E22] dark:text-white">
                    Explore VYBE
                  </h3>
                  <p className="text-caption text-gray-500">
                    All opportunities, schedules, and proofs in one place
                  </p>
                </div>
              </div>
              <button
                onClick={() => setDrawerOpen(false)}
                className="w-9 h-9 rounded-full bg-black/5 dark:bg-white/10 flex items-center justify-center text-[#1E1E22] dark:text-white active:scale-95 transition-all"
                aria-label="Close navigation sheet"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Destinations List */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 overflow-y-auto max-h-[55vh] py-1">
              {items.map((item) => {
                const isActive =
                  pathname === item.href ||
                  (item.href !== "/" && pathname.startsWith(item.href));
                const Icon = item.icon;

                return (
                  <Link
                    key={item.id}
                    href={item.href}
                    onClick={() => setDrawerOpen(false)}
                    className={cn(
                      "flex items-center justify-between p-3.5 rounded-2xl transition-all border outline-none active:scale-[0.98]",
                      isActive
                        ? "bg-[#1E1E22] text-white border-[#1E1E22] dark:bg-white dark:text-[#1E1E22] dark:border-white shadow-sm"
                        : "bg-black/[0.02] dark:bg-white/[0.04] border-black/5 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/10 text-[#1E1E22] dark:text-gray-100"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={cn(
                          "w-9 h-9 rounded-xl flex items-center justify-center shrink-0",
                          isActive
                            ? "bg-white/20 dark:bg-black/10 text-white dark:text-[#1E1E22]"
                            : "bg-[#D3E57A]/30 text-[#364205] dark:text-[#D3E57A]"
                        )}
                      >
                        <Icon className="w-4 h-4" strokeWidth={2} />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-small font-bold leading-tight">
                          {item.label}
                        </span>
                        <span
                          className={cn(
                            "text-[11px] leading-tight mt-0.5",
                            isActive ? "opacity-80" : "text-gray-500 dark:text-gray-400"
                          )}
                        >
                          {item.id === "home" && "Dashboard overview"}
                          {item.id === "world-pulse" && "Global market signals"}
                          {item.id === "calendar" && "Deadlines & personal schedule"}
                          {item.id === "radar" && "Deterministic opportunity matching"}
                          {item.id === "pulse" && "AI contextual decision guide"}
                          {item.id === "tracker" && "Action plan & kanban board"}
                          {item.id === "passport" && "Verifiable proof-of-growth"}
                          {item.id === "analytics" && "Institution cohort insights"}
                          {item.id === "catalogue" && "Opportunity ingestion queue"}
                          {item.id === "student-view" && "Return to student dashboard"}
                        </span>
                      </div>
                    </div>
                    <ChevronRight
                      className={cn(
                        "w-4 h-4 shrink-0",
                        isActive ? "opacity-90" : "text-gray-400"
                      )}
                    />
                  </Link>
                );
              })}

              {/* Extra Utility Links */}
              <Link
                href="/profile"
                onClick={() => setDrawerOpen(false)}
                className="flex items-center justify-between p-3.5 rounded-2xl bg-black/[0.02] dark:bg-white/[0.04] border border-black/5 dark:border-white/10 text-[#1E1E22] dark:text-gray-100 active:scale-[0.98]"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-purple-500/20 text-purple-700 dark:text-purple-300 flex items-center justify-center shrink-0">
                    <User className="w-4 h-4" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-small font-bold leading-tight">Student Profile</span>
                    <span className="text-[11px] text-gray-500 mt-0.5">Skills, goals & cohort</span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </Link>

              <Link
                href="/login"
                onClick={() => setDrawerOpen(false)}
                className="flex items-center justify-between p-3.5 rounded-2xl bg-black/[0.02] dark:bg-white/[0.04] border border-black/5 dark:border-white/10 text-[#1E1E22] dark:text-gray-100 active:scale-[0.98]"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 flex items-center justify-center shrink-0">
                    <User className="w-4 h-4" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-small font-bold leading-tight">Sign In / Switch Student</span>
                    <span className="text-[11px] text-gray-500 mt-0.5">Access login & demo accounts</span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </Link>

              <button
                type="button"
                onClick={() => {
                  setDrawerOpen(false);
                  logout();
                  router.push("/login");
                }}
                className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-red-500/10 dark:bg-red-500/20 border border-red-500/20 text-red-600 dark:text-red-400 active:scale-[0.98] transition"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-red-500/20 flex items-center justify-center shrink-0">
                    <LogOut className="w-4 h-4 text-red-500" />
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="text-small font-bold leading-tight">Sign Out</span>
                    <span className="text-[11px] text-red-500/70 mt-0.5">End session and return to login</span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-red-400" />
              </button>

              <Link
                href="/design-system"
                onClick={() => setDrawerOpen(false)}
                className="flex items-center justify-between p-3.5 rounded-2xl bg-black/[0.02] dark:bg-white/[0.04] border border-black/5 dark:border-white/10 text-[#1E1E22] dark:text-gray-100 active:scale-[0.98]"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-700 dark:text-amber-300 flex items-center justify-center shrink-0">
                    <Palette className="w-4 h-4" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-small font-bold leading-tight">Design System</span>
                    <span className="text-[11px] text-gray-500 mt-0.5">Tokens & components showcase</span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Floating Bottom Navigation Bar */}
      <nav
        className="md:hidden fixed bottom-[max(0.75rem,env(safe-area-inset-bottom,0.75rem))] inset-x-3 sm:inset-x-6 z-40 max-w-lg mx-auto"
        aria-label="Mobile navigation"
      >
        <div
          className={cn(
            "liquid-glass rounded-full p-1.5 flex items-center justify-around",
            "shadow-xl border border-white/60 dark:border-white/10 backdrop-blur-2xl"
          )}
        >
          {primaryItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/" && pathname.startsWith(item.href));
            const Icon = item.icon;

            return (
              <Link
                key={item.id}
                href={item.href}
                className={cn(
                  "flex items-center justify-center transition-all duration-200 outline-none select-none active:scale-95",
                  isActive
                    ? "bg-[#1E1E22] text-white px-3.5 py-1.5 rounded-full shadow-sm dark:bg-white dark:text-[#1E1E22] gap-1.5"
                    : "flex-col p-1.5 min-w-[48px] text-[#6B7280] dark:text-gray-400 hover:text-[#1E1E22] dark:hover:text-white"
                )}
                aria-current={isActive ? "page" : undefined}
              >
                <Icon
                  className={cn(
                    "w-5 h-5 shrink-0 transition-transform",
                    isActive ? "stroke-[2.2]" : "stroke-[1.75]"
                  )}
                />
                <span
                  className={cn(
                    "font-semibold leading-none",
                    isActive
                      ? "text-[12px] inline"
                      : "text-[10px] mt-1 tracking-tight"
                  )}
                >
                  {item.label}
                </span>
              </Link>
            );
          })}

          {/* 5th Slot: Dynamic Secondary Tab or "More" Menu Toggle */}
          {isLargeNav && (
            activeSecondaryItem ? (
              // If user is actively on one of the secondary pages (e.g. Calendar, Passport, World Pulse)
              <button
                type="button"
                onClick={() => setDrawerOpen(true)}
                className="flex items-center gap-1.5 bg-[#1E1E22] text-white px-3.5 py-1.5 rounded-full shadow-sm dark:bg-white dark:text-[#1E1E22] transition-all duration-200 outline-none select-none active:scale-95"
                title="Tap to see more destinations"
              >
                {React.createElement(activeSecondaryItem.icon, {
                  className: "w-5 h-5 shrink-0 stroke-[2.2]",
                })}
                <span className="text-[12px] font-semibold leading-none">
                  {activeSecondaryItem.label}
                </span>
              </button>
            ) : (
              // If user is on a primary page, show "More" button with slide-up trigger
              <button
                type="button"
                onClick={() => setDrawerOpen(true)}
                className="flex flex-col items-center justify-center p-1.5 min-w-[48px] text-[#6B7280] dark:text-gray-400 hover:text-[#1E1E22] dark:hover:text-white transition-all duration-200 outline-none select-none active:scale-95"
                aria-label="Open more menu"
              >
                <div className="relative">
                  <Menu className="w-5 h-5 shrink-0 stroke-[1.75]" />
                  <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-[#D3E57A]" />
                </div>
                <span className="text-[10px] font-semibold mt-1 tracking-tight leading-none">
                  More
                </span>
              </button>
            )
          )}
        </div>
      </nav>
    </>
  );
}
