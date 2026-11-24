"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useTheme } from "@/lib/theme/theme-provider";
import { Button } from "../ui/button";
import { LiquidGlassHero } from "../ui/liquid-glass-hero";
import { Plus, Bell, Sun, Moon, Laptop, ShieldCheck, GraduationCap, Building2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { api } from "@/lib/api/client";

interface HeaderProps {
  currentRole: "student" | "staff" | "admin";
  onRoleChange: (role: "student" | "staff" | "admin") => void;
  onOpenQuickAction?: () => void;
  userName?: string;
  studentId?: number;
}

export function Header({
  currentRole,
  onRoleChange,
  onOpenQuickAction,
  userName = "Aarav Patel",
  studentId = 1,
}: HeaderProps) {
  const { theme, setTheme } = useTheme();
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [showNotif, setShowNotif] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);

  const roleMenuRef = useRef<HTMLDivElement>(null);
  const notifMenuRef = useRef<HTMLDivElement>(null);

  // Close menus on outside click or Escape
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (roleMenuRef.current && !roleMenuRef.current.contains(e.target as Node)) {
        setShowRoleMenu(false);
      }
      if (notifMenuRef.current && !notifMenuRef.current.contains(e.target as Node)) {
        setShowNotif(false);
      }
    }

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setShowRoleMenu(false);
        setShowNotif(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  useEffect(() => {
    async function loadNotifications() {
      const res = await api.notifications.getNotifications(studentId);
      if (res.success) {
        setNotifications(res.data);
        setUnreadCount(res.unread);
      }
    }
    loadNotifications();
  }, [studentId]);

  const handleMarkAllRead = async () => {
    await api.notifications.markAllAsRead(studentId);
    setUnreadCount(0);
    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
  };

  // Time-aware greeting
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good Morning" : hour < 18 ? "Good Afternoon" : "Good Evening";

  const nextTheme = theme === "light" ? "dark" : theme === "dark" ? "system" : "light";
  const ThemeIcon = theme === "dark" ? Moon : theme === "light" ? Sun : Laptop;

  return (
    <header className="w-full max-w-[1200px] mx-auto flex items-center justify-between py-4 px-4 sm:px-8 xl:px-10 z-20">
      {/* Left: Avatar + Greeting */}
      <Link href="/profile" className="flex items-center gap-2.5 sm:gap-3 group outline-none min-w-0">
        <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full ring-2 ring-white/80 dark:ring-white/20 bg-gradient-to-tr from-[#FAD8C6] via-[#F6C9DD] to-[#D9C9F5] flex items-center justify-center font-bold text-body text-[#1E1E22] shadow-sm shrink-0">
          {userName
            .split(" ")
            .map((n) => n[0])
            .join("")
            .slice(0, 2)}
        </div>
        <div className="flex flex-col text-left truncate">
          <span
            suppressHydrationWarning
            className="text-caption font-medium text-[#4B5563] dark:text-[#D1D5DB] leading-tight truncate"
          >
            {greeting}
          </span>
          <span className="text-small sm:text-body font-semibold text-[#1E1E22] dark:text-white group-hover:text-[#2F6BFF] transition-colors leading-snug truncate max-w-[100px] sm:max-w-none">
            {userName}
          </span>
        </div>
      </Link>

      {/* Center: Sample data notice with liquid-glass */}
      <div className="hidden md:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full liquid-glass text-[11px] font-semibold text-[#1E1E22] dark:text-gray-200 select-none shadow-xs">
        <span className="w-1.5 h-1.5 rounded-full bg-[#D3E57A]" />
        Sample Prototype Data
      </div>

      {/* Right Controls: Role switcher, Theme toggle, Round Black Add, Round White Bell */}
      <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
        {/* Role Switcher Pill */}
        <div className="relative" ref={roleMenuRef}>
          <LiquidGlassHero
            cornerRadius={999}
            displacementScale={64}
            blurAmount={0.08}
            saturation={135}
            aberrationIntensity={2}
            elasticity={0.28}
            overLight={theme === "light"}
            onClick={() => setShowRoleMenu(!showRoleMenu)}
            className="cursor-pointer btn-press"
          >
            <div
              className="flex items-center gap-1.5 px-2.5 sm:px-3.5 py-1.5 text-caption font-semibold text-[#1E1E22] dark:text-white select-none"
              title="Switch demo role"
            >
              {currentRole === "student" && <GraduationCap className="w-3.5 h-3.5" />}
              {currentRole === "staff" && <Building2 className="w-3.5 h-3.5" />}
              {currentRole === "admin" && <ShieldCheck className="w-3.5 h-3.5" />}
              <span className="capitalize hidden sm:inline">{currentRole}</span>
            </div>
          </LiquidGlassHero>

          {showRoleMenu && (
            <div className="absolute right-0 mt-2 w-44 rounded-2xl liquid-glass bg-white/95 dark:bg-[#1E1E24]/95 p-1.5 shadow-xl border border-white/60 dark:border-white/10 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="text-[10px] font-bold text-gray-400 px-3 py-1 uppercase tracking-wider">
                Switch Perspective
              </div>
              <button
                onClick={() => {
                  onRoleChange("student");
                  setShowRoleMenu(false);
                }}
                className={cn(
                  "w-full flex items-center gap-2 px-3 py-2 rounded-xl text-small font-medium text-left",
                  currentRole === "student"
                    ? "bg-[#1E1E22] text-white dark:bg-white dark:text-[#1E1E22]"
                    : "hover:bg-black/5 dark:hover:bg-white/10 text-gray-700 dark:text-gray-300"
                )}
              >
                <GraduationCap className="w-4 h-4" />
                <span>Student</span>
              </button>
              <button
                onClick={() => {
                  onRoleChange("staff");
                  setShowRoleMenu(false);
                }}
                className={cn(
                  "w-full flex items-center gap-2 px-3 py-2 rounded-xl text-small font-medium text-left",
                  currentRole === "staff"
                    ? "bg-[#1E1E22] text-white dark:bg-white dark:text-[#1E1E22]"
                    : "hover:bg-black/5 dark:hover:bg-white/10 text-gray-700 dark:text-gray-300"
                )}
              >
                <Building2 className="w-4 h-4" />
                <span>Institution Staff</span>
              </button>
              <button
                onClick={() => {
                  onRoleChange("admin");
                  setShowRoleMenu(false);
                }}
                className={cn(
                  "w-full flex items-center gap-2 px-3 py-2 rounded-xl text-small font-medium text-left",
                  currentRole === "admin"
                    ? "bg-[#1E1E22] text-white dark:bg-white dark:text-[#1E1E22]"
                    : "hover:bg-black/5 dark:hover:bg-white/10 text-gray-700 dark:text-gray-300"
                )}
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Admin</span>
              </button>
            </div>
          )}
        </div>

        {/* Theme Toggle */}
        <LiquidGlassHero
          cornerRadius={999}
          displacementScale={64}
          blurAmount={0.08}
          saturation={135}
          aberrationIntensity={2}
          elasticity={0.28}
          overLight={theme === "light"}
          onClick={() => setTheme(nextTheme)}
          className="cursor-pointer btn-press"
        >
          <div
            className="w-10 h-10 flex items-center justify-center text-[#1E1E22] dark:text-white transition-all"
            title={`Theme: ${theme}. Click to change.`}
            aria-label="Toggle color theme"
          >
            <ThemeIcon className="w-4 h-4" strokeWidth={1.75} />
          </div>
        </LiquidGlassHero>

        {/* Round Black Add Button */}
        <LiquidGlassHero
          cornerRadius={999}
          displacementScale={64}
          blurAmount={0.08}
          saturation={135}
          aberrationIntensity={2}
          elasticity={0.28}
          overLight={theme === "light"}
          onClick={onOpenQuickAction}
          className="cursor-pointer btn-press"
        >
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center bg-[#1E1E22] text-white dark:bg-white dark:text-[#1E1E22] shadow-sm"
            aria-label="Quick Add Task or Log Outcome"
            title="Quick Add Action"
          >
            <Plus className="w-5 h-5 stroke-[2.2]" />
          </div>
        </LiquidGlassHero>

        {/* Round White Notification Button */}
        <div className="relative" ref={notifMenuRef}>
          <LiquidGlassHero
            cornerRadius={999}
            displacementScale={64}
            blurAmount={0.08}
            saturation={135}
            aberrationIntensity={2}
            elasticity={0.28}
            overLight={theme === "light"}
            onClick={() => setShowNotif(!showNotif)}
            className="cursor-pointer btn-press"
          >
            <div
              className="w-10 h-10 flex items-center justify-center text-[#1E1E22] dark:text-white relative"
              aria-label="View notifications"
              title="Notifications"
            >
              <Bell className="w-5 h-5 stroke-[1.8]" />
              {unreadCount > 0 && (
                <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-[#E0605E]" />
              )}
            </div>
          </LiquidGlassHero>

          {showNotif && (
            <div className="absolute right-0 mt-2 w-80 rounded-2xl glass-surface bg-white/95 dark:bg-[#1E1E24]/95 p-4 shadow-xl border border-white/60 dark:border-white/10 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between mb-3 pb-2 border-b border-black/5 dark:border-white/5">
                <span className="text-small font-bold text-[#1E1E22] dark:text-white">
                  Notifications {unreadCount > 0 ? `(${unreadCount})` : ""}
                </span>
                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllRead}
                    className="text-[11px] text-[#2F6BFF] font-semibold cursor-pointer hover:underline"
                  >
                    Mark read
                  </button>
                )}
              </div>
              <div className="flex flex-col gap-2.5 max-h-60 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="text-caption text-gray-400 text-center py-4">
                    No new notifications.
                  </div>
                ) : (
                  notifications.map((notif) => (
                    <div
                      key={notif.id}
                      className={cn(
                        "text-caption p-2.5 rounded-xl transition-colors",
                        notif.is_read
                          ? "bg-black/[0.02] dark:bg-white/[0.02] text-gray-500"
                          : "bg-black/5 dark:bg-white/5 text-[#1E1E22] dark:text-white font-medium"
                      )}
                    >
                      <div className="font-semibold text-[#1E1E22] dark:text-white flex items-center justify-between">
                        <span>{notif.title}</span>
                        {!notif.is_read && (
                          <span className="w-1.5 h-1.5 rounded-full bg-[#2F6BFF]" />
                        )}
                      </div>
                      <div className="text-[#6B7280] dark:text-gray-400 mt-0.5 leading-snug">
                        {notif.message}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
