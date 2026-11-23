"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NavItem } from "./nav-items";
import { cn } from "@/lib/utils";

interface BottomNavProps {
  items: NavItem[];
}

export function BottomNav({ items }: BottomNavProps) {
  const pathname = usePathname();

  return (
    <nav
      className="md:hidden fixed bottom-5 inset-x-4 z-40"
      aria-label="Mobile navigation"
    >
      <div
        className={cn(
          "liquid-glass rounded-full p-2 flex items-center justify-around",
          "shadow-lg"
        )}
      >
        {items.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/" && pathname.startsWith(item.href));
          const Icon = item.icon;

          return (
            <Link
              key={item.id}
              href={item.href}
              className={cn(
                "flex items-center gap-2 transition-all duration-200 btn-press outline-none",
                isActive
                  ? "bg-[#1E1E22] text-white px-4 py-2 rounded-full shadow-sm dark:bg-white dark:text-[#1E1E22]"
                  : "flex-col items-center justify-center p-2 text-[#6B7280] dark:text-gray-400 hover:text-[#1E1E22] dark:hover:text-white"
              )}
            >
              <Icon className="w-5 h-5 shrink-0" strokeWidth={isActive ? 2 : 1.75} />
              <span
                className={cn(
                  "text-[12px] font-medium leading-none",
                  !isActive && "text-[10px] mt-1"
                )}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
