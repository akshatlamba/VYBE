"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { NavItem } from "./nav-items";
import { LiquidGlassHero } from "../ui/liquid-glass-hero";
import { cn } from "@/lib/utils";
import { Palette, Sparkles, Flame, CheckCircle, MessageSquare, LogOut } from "lucide-react";
import { useAuth } from "@/lib/auth/auth-context";
import { VybeSymbol } from "../ui/vybe-logo";

interface SidebarProps {
  items: NavItem[];
  onOpenQuickPulse?: () => void;
}

export function Sidebar({ items, onOpenQuickPulse }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const isDev = process.env.NODE_ENV === "development";

  return (
    <aside
      className="hidden lg:flex flex-col justify-between p-6 rounded-[32px] liquid-glass sidebar-fixed shadow-lg"
      style={{
        position: "fixed",
        top: "24px",
        left: "24px",
        width: "256px",
        height: "calc(100vh - 48px)",
        maxHeight: "calc(100vh - 48px)",
        overflowY: "auto",
        overflowX: "hidden",
        zIndex: 30,
      }}
      aria-label="Desktop sidebar navigation"
    >
      <div className="flex flex-col gap-6">
        {/* Brand Header */}
        <div className="flex items-center gap-3 px-2">
          <VybeSymbol size={40} className="drop-shadow-md" />
          <div className="flex flex-col">
            <span className="font-extrabold text-h3 tracking-tight text-[#1E1E22] dark:text-white leading-tight">
              VYBE
            </span>
            <span className="text-[11px] text-[#4B5563] dark:text-[#D1D5DB] font-semibold tracking-tight leading-none">
              Intelligence Layer
            </span>
          </div>
        </div>

        {/* Navigation List with Liquid Motion */}
        <nav className="flex flex-col gap-1.5" aria-label="Main navigation">
          {items.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/" && pathname.startsWith(item.href));
            const Icon = item.icon;

            if (isActive) {
              return (
                <Link key={item.id} href={item.href} className="outline-none block w-full">
                  <LiquidGlassHero
                    cornerRadius={999}
                    displacementScale={64}
                    blurAmount={0.08}
                    saturation={135}
                    aberrationIntensity={2}
                    elasticity={0.28}
                    overLight={false}
                    className="w-full"
                    containerClassName="w-full block"
                  >
                    <div className="flex items-center gap-3.5 px-4 py-3 rounded-full text-small font-semibold bg-[#1E1E22] text-white shadow-md dark:bg-white dark:text-[#1E1E22] scale-[1.02] transition-transform select-none w-full">
                      <Icon className="w-5 h-5 shrink-0" strokeWidth={2} />
                      <span>{item.label}</span>
                      {item.badge && (
                        <span className="ml-auto bg-[#D3E57A] text-[#1E1E22] text-[11px] font-bold px-2 py-0.5 rounded-full">
                          {item.badge}
                        </span>
                      )}
                    </div>
                  </LiquidGlassHero>
                </Link>
              );
            }

            return (
              <Link
                key={item.id}
                href={item.href}
                className="relative flex items-center gap-3.5 px-4 py-3 rounded-full text-small font-semibold text-[#4B5563] dark:text-gray-300 hover:bg-black/5 dark:hover:bg-white/10 hover:text-[#1E1E22] dark:hover:text-white transition-all duration-300 ease-out btn-press outline-none"
              >
                <Icon className="w-5 h-5 shrink-0" strokeWidth={1.75} />
                <span>{item.label}</span>
                {item.badge && (
                  <span className="ml-auto bg-[#D3E57A] text-[#1E1E22] text-[11px] font-bold px-2 py-0.5 rounded-full">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Middle/Bottom: Profile Completion & Streak Mini-Widget */}
      <div className="flex flex-col gap-4">
        <Link
          href="/passport"
          className="group block p-3.5 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 hover:border-black/10 dark:hover:border-white/20 transition-all duration-200"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5 text-caption font-bold text-[#1E1E22] dark:text-white">
              <Sparkles className="w-3.5 h-3.5 text-[#D3E57A]" />
              <span>Profile Power</span>
            </div>
            <span className="text-[11px] font-bold text-[#1E1E22] dark:text-[#D3E57A]">
              85%
            </span>
          </div>

          {/* Progress bar */}
          <div className="w-full h-1.5 bg-black/10 dark:bg-white/10 rounded-full overflow-hidden mb-2.5">
            <div
              className="h-full bg-[#D3E57A] rounded-full transition-all duration-500"
              style={{ width: "85%" }}
            />
          </div>

          <div className="flex items-center justify-between text-[11px]">
            <span className="text-[#4B5563] dark:text-gray-400">
              Growth Passport
            </span>
            <span className="inline-flex items-center gap-1 font-semibold text-[#1E1E22] dark:text-gray-200">
              <Flame className="w-3 h-3 text-[#E0605E]" /> 5d streak
            </span>
          </div>
        </Link>

        {/* User Account & Sign Out Strip */}
        <div className="flex items-center justify-between p-2.5 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10">
          <Link href="/profile" className="flex items-center gap-2.5 min-w-0 group" title="View Profile">
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#FAD8C6] via-[#F6C9DD] to-[#D9C9F5] ring-1 ring-white/60 dark:ring-white/20 flex items-center justify-center font-bold text-[11px] text-[#1E1E22] shrink-0 overflow-hidden shadow-xs">
              {user.avatar_url ? (
                <img src={user.avatar_url} alt={user.name} className="w-full h-full object-cover" />
              ) : (
                user.name ? user.name.split(" ").map((n) => n[0]).join("").slice(0, 2) : "ST"
              )}
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-bold text-[#1E1E22] dark:text-white truncate group-hover:text-[#2F6BFF] transition-colors leading-tight">
                {user.name || "Student"}
              </span>
              <span className="text-[10px] text-gray-500 dark:text-gray-400 capitalize truncate leading-tight">
                {user.role || "student"}
              </span>
            </div>
          </Link>
          <button
            type="button"
            onClick={() => {
              logout();
              router.push("/login");
            }}
            className="p-1.5 rounded-xl hover:bg-red-500/10 text-gray-400 hover:text-red-500 transition-colors btn-press"
            title="Sign Out"
            aria-label="Sign Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>

        {/* Footer info & Dev-only Design System Link */}
        <div className="flex flex-col gap-1.5 pt-3 border-t border-black/5 dark:border-white/5">
          {isDev && (
            <Link
              href="/design-system"
              className={cn(
                "flex items-center gap-2.5 px-3 py-1.5 rounded-full text-caption font-medium transition-all duration-200",
                pathname === "/design-system"
                  ? "bg-[#1E1E22] text-white dark:bg-white dark:text-[#1E1E22]"
                  : "text-[#6B7280] dark:text-gray-400 hover:bg-black/5 dark:hover:bg-white/10"
              )}
            >
              <Palette className="w-3.5 h-3.5 shrink-0 text-[#2F6BFF]" />
              <span>Design System (Dev)</span>
            </Link>
          )}
          <div className="px-2 text-[11px] text-[#9CA3AF] dark:text-gray-500 leading-tight">
            VYBE Intelligence Layer · v2.0
          </div>
        </div>
      </div>
    </aside>
  );
}
