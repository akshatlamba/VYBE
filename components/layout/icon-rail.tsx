"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NavItem } from "./nav-items";
import { cn } from "@/lib/utils";

interface IconRailProps {
  items: NavItem[];
}

export function IconRail({ items }: IconRailProps) {
  const pathname = usePathname();

  return (
    <aside
      className="hidden md:flex lg:hidden flex-col items-center py-6 px-3 rounded-[32px] glass-surface shadow-md bg-white/70 dark:bg-[#1C1C20]/80 backdrop-blur-2xl"
      style={{
        position: "fixed",
        top: "24px",
        left: "16px",
        width: "80px",
        height: "calc(100vh - 48px)",
        maxHeight: "calc(100vh - 48px)",
        overflowY: "auto",
        zIndex: 30,
      }}
      aria-label="Tablet navigation rail"
    >
      <div className="flex flex-col items-center gap-4 w-full">
        {items.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/" && pathname.startsWith(item.href));
          const Icon = item.icon;

          return (
            <Link
              key={item.id}
              href={item.href}
              title={item.label}
              className={cn(
                "w-12 h-12 rounded-full flex flex-col items-center justify-center transition-all duration-200 btn-press outline-none",
                isActive
                  ? "bg-[#1E1E22] text-white shadow-md dark:bg-white dark:text-[#1E1E22]"
                  : "text-[#6B7280] dark:text-gray-400 hover:bg-black/5 dark:hover:bg-white/10"
              )}
            >
              <Icon className="w-5 h-5" strokeWidth={isActive ? 2 : 1.75} />
            </Link>
          );
        })}
      </div>
    </aside>
  );
}
