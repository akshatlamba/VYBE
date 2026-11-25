"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Database,
  ShieldCheck,
  TrendingUp,
  Radio,
  Lock,
  Cpu,
  Webhook,
  Search,
  Bell,
  Moon,
  Sun,
  Users,
  CheckCircle2,
  Activity,
  Flame,
  Sparkles,
  ExternalLink,
  ChevronRight,
  Filter,
  Check,
  Eye,
  X,
  LogOut,
  GraduationCap,
  Sparkle,
  Layers,
  ArrowUpRight,
  FileCheck,
  GitBranch,
} from "lucide-react";
import { INITIAL_OPPORTUNITIES, OUTCOMES_STORE, Opportunity, GrowthOutcome } from "@/lib/data/mock-db";
import { useAuth } from "@/lib/auth/auth-context";

interface UrgentQueueItem {
  id: string;
  studentName: string;
  avatarSeed: string;
  achievementTitle: string;
  evidenceType: "GitHub / Demo" | "Cryptographic Certificate" | "College Certified";
  evidenceUrl: string;
  status: "pending" | "verified";
  timestamp: string;
}

const INITIAL_URGENT_QUEUE: UrgentQueueItem[] = [
  {
    id: "uq-1",
    studentName: "Akshat Lamba",
    avatarSeed: "AL",
    achievementTitle: "Smart India Hackathon 2026 Winner (FinTech Track)",
    evidenceType: "Cryptographic Certificate",
    evidenceUrl: "https://cert.sih2026.gov.in/verify/VYBE-SIH-9921",
    status: "pending",
    timestamp: "12m ago",
  },
  {
    id: "uq-2",
    studentName: "Piyush",
    avatarSeed: "P",
    achievementTitle: "IIT Bombay Techfest Autonomous Drone Swarm System",
    evidenceType: "GitHub / Demo",
    evidenceUrl: "https://github.com/piyush-labs/autonomous-swarm",
    status: "pending",
    timestamp: "34m ago",
  },
  {
    id: "uq-3",
    studentName: "Ashutosh",
    avatarSeed: "AS",
    achievementTitle: "DST Quantum Computing Algorithm Benchmark (Qiskit)",
    evidenceType: "College Certified",
    evidenceUrl: "https://dst.gov.in/endorsed/quantum/sr-2026-88",
    status: "pending",
    timestamp: "1h ago",
  },
  {
    id: "uq-4",
    studentName: "Aashi",
    avatarSeed: "AA",
    achievementTitle: "Rust WebAssembly AST Parser Merged PR",
    evidenceType: "GitHub / Demo",
    evidenceUrl: "https://github.com/bytecodealliance/wasmtime/pull/8834",
    status: "pending",
    timestamp: "2h ago",
  },
];

export default function AdminPortalPage() {
  const router = useRouter();
  const { user } = useAuth();

  // Navigation sub-view state
  const [activeMenu, setActiveMenu] = useState<
    "overview" | "catalogue" | "verification" | "analytics" | "pulse" | "audit" | "settings"
  >("overview");

  // State stores
  const [catalogue, setCatalogue] = useState<Opportunity[]>(INITIAL_OPPORTUNITIES);
  const [outcomesQueue, setOutcomesQueue] = useState<GrowthOutcome[]>(OUTCOMES_STORE);
  const [urgentQueue, setUrgentQueue] = useState<UrgentQueueItem[]>(INITIAL_URGENT_QUEUE);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [inspectedItem, setInspectedItem] = useState<UrgentQueueItem | null>(null);
  const [notificationCount, setNotificationCount] = useState(3);
  const [isThemeDark, setIsThemeDark] = useState(true);

  useEffect(() => {
    async function loadAdminData() {
      try {
        const res = await fetch("/api/admin/users");
        const json = await res.json();
        if (json.success && json.data.audit_logs) {
          setAuditLogs(json.data.audit_logs);
        }
      } catch {
        // Fallback demo audit logs
        setAuditLogs([
          {
            action: "Ingestion Trigger",
            details: "Crawled 42 new hackathons from Devpost & Unstop",
            actor: "PULSE-Crawler-01",
            target: "catalogue_db",
            timestamp: new Date().toISOString(),
          },
          {
            action: "Cryptographic Attestation",
            details: "SIH 2026 verified for Akshat Lamba",
            actor: "Admin (Jack Hunter)",
            target: "outcomes_store",
            timestamp: new Date(Date.now() - 3600000).toISOString(),
          },
        ]);
      }
    }
    loadAdminData();
  }, []);

  const handleApproveUrgent = (id: string) => {
    setUrgentQueue((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: "verified" } : item))
    );
  };

  const handleVerifyOutcome = async (outcomeId: string) => {
    setOutcomesQueue((prev) =>
      prev.map((o) => (o.id === outcomeId ? { ...o, verification: "verified" } : o))
    );
    try {
      await fetch("/api/admin/verification", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ outcome_id: outcomeId, verification: "verified" }),
      });
    } catch {
      // Handled
    }
  };

  const handleToggleStale = (oppId: string) => {
    setCatalogue((prev) =>
      prev.map((o) => {
        if (o.id !== oppId) return o;
        const nextStatus = o.source_status === "stale" ? "sourced" : "stale";
        return { ...o, source_status: nextStatus, last_checked_at: new Date().toISOString() };
      })
    );
  };

  const filteredCatalogue = catalogue.filter(
    (opp) =>
      opp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      opp.organizer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      opp.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#0B0C10] text-slate-100 font-sans relative selection:bg-[#D3E57A] selection:text-[#12131C] flex overflow-x-hidden">
      {/* ============================================================ */}
      {/* WEBSITE THEME AMBIENT LIGHTING & LIQUID GLASS FLARES         */}
      {/* (VYBE Lime #D3E57A, Lilac #D9C9F5, Peach #FAD8C6, Sky #BAE6FD)*/}
      {/* ============================================================ */}
      <div
        className="fixed top-[-100px] right-[8%] w-[650px] h-[650px] rounded-full bg-gradient-to-br from-[#D3E57A]/16 via-[#D9C9F5]/14 to-transparent blur-[160px] pointer-events-none -z-0"
        aria-hidden="true"
      />
      <div
        className="fixed bottom-[5%] left-[12%] w-[550px] h-[550px] rounded-full bg-gradient-to-tr from-[#D9C9F5]/14 via-[#FAD8C6]/12 to-transparent blur-[160px] pointer-events-none -z-0"
        aria-hidden="true"
      />
      <div
        className="fixed top-[40%] right-[35%] w-[450px] h-[450px] rounded-full bg-[#BAE6FD]/06 blur-[180px] pointer-events-none -z-0"
        aria-hidden="true"
      />

      {/* ============================================================ */}
      {/* 1. LEFT FLOATING SIDEBAR (OBSIDIAN GLASS, 260px)              */}
      {/* ============================================================ */}
      <aside className="w-[270px] shrink-0 p-4 hidden lg:flex flex-col h-screen sticky top-0 z-30">
        <div className="bg-[#12131C]/80 backdrop-blur-2xl border border-white/[0.08] rounded-[28px] p-5 flex flex-col justify-between h-full shadow-[0_12px_40px_rgba(0,0,0,0.55)] relative overflow-hidden">
          {/* Subtle inner theme flare in sidebar */}
          <div className="absolute -top-12 -left-12 w-32 h-32 bg-[#D3E57A]/10 rounded-full blur-2xl pointer-events-none" />

          {/* Top Section */}
          <div className="flex flex-col">
            {/* Brand Logo & Tag */}
            <div className="flex items-center gap-3 px-1 pt-1 pb-4 border-b border-white/[0.06]">
              {/* Glowing circular orbital icon in VYBE website theme colors */}
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#D3E57A] via-[#D9C9F5] to-[#BAE6FD] p-[1.5px] shadow-[0_0_22px_rgba(211,229,122,0.35)] shrink-0 flex items-center justify-center">
                <div className="w-full h-full bg-[#0E1017] rounded-[14px] flex items-center justify-center">
                  <div className="w-4 h-4 rounded-full border-2 border-[#D3E57A] border-t-transparent animate-spin" />
                </div>
              </div>

              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-[18px] tracking-tight text-white">VYBE</span>
                  <span className="px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-[#D3E57A]/15 border border-[#D3E57A]/30 text-[#D3E57A]">
                    ADMIN
                  </span>
                </div>
                <span className="text-[10px] text-[#94A3B8] font-medium tracking-wide">
                  Intelligence Layer
                </span>
              </div>
            </div>

            {/* Section: MENU */}
            <div className="mt-6 flex flex-col gap-1.5">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#94A3B8]/70 px-3 mb-1">
                MENU
              </span>

              {/* Active: Dashboard / Overview (Rendered in VYBE Theme Lime & Lilac) */}
              <button
                type="button"
                onClick={() => setActiveMenu("overview")}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-[13px] font-bold transition-all ${
                  activeMenu === "overview"
                    ? "bg-gradient-to-r from-[#D3E57A] via-[#A7F3D0] to-[#D9C9F5] text-[#12131C] shadow-[0_4px_22px_rgba(211,229,122,0.35)] scale-[1.01]"
                    : "text-white/60 hover:text-white hover:bg-white/[0.05]"
                }`}
              >
                <LayoutDashboard className="w-4 h-4 shrink-0" />
                <span>Dashboard / Overview</span>
              </button>

              {/* Catalogue Freshness */}
              <button
                type="button"
                onClick={() => setActiveMenu("catalogue")}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-[13px] font-medium transition-all ${
                  activeMenu === "catalogue"
                    ? "bg-gradient-to-r from-[#D3E57A] via-[#A7F3D0] to-[#D9C9F5] text-[#12131C] font-bold shadow-[0_4px_22px_rgba(211,229,122,0.35)]"
                    : "text-white/60 hover:text-white hover:bg-white/[0.05]"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Database className="w-4 h-4 shrink-0" />
                  <span>Catalogue Freshness</span>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/10 text-white/80">
                  {catalogue.length}
                </span>
              </button>

              {/* Verification Queue */}
              <button
                type="button"
                onClick={() => setActiveMenu("verification")}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-[13px] font-medium transition-all ${
                  activeMenu === "verification"
                    ? "bg-gradient-to-r from-[#D3E57A] via-[#A7F3D0] to-[#D9C9F5] text-[#12131C] font-bold shadow-[0_4px_22px_rgba(211,229,122,0.35)]"
                    : "text-white/60 hover:text-white hover:bg-white/[0.05]"
                }`}
              >
                <div className="flex items-center gap-3">
                  <ShieldCheck className="w-4 h-4 shrink-0" />
                  <span>Verification Queue</span>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#D3E57A]/20 border border-[#D3E57A]/35 text-[#D3E57A]">
                  {urgentQueue.filter((q) => q.status === "pending").length}
                </span>
              </button>

              {/* Campus & User Analytics */}
              <button
                type="button"
                onClick={() => setActiveMenu("analytics")}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-[13px] font-medium transition-all ${
                  activeMenu === "analytics"
                    ? "bg-gradient-to-r from-[#D3E57A] via-[#A7F3D0] to-[#D9C9F5] text-[#12131C] font-bold shadow-[0_4px_22px_rgba(211,229,122,0.35)]"
                    : "text-white/60 hover:text-white hover:bg-white/[0.05]"
                }`}
              >
                <TrendingUp className="w-4 h-4 shrink-0" />
                <span>Campus & Analytics</span>
              </button>

              {/* PULSE AI Signals */}
              <button
                type="button"
                onClick={() => setActiveMenu("pulse")}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-[13px] font-medium transition-all ${
                  activeMenu === "pulse"
                    ? "bg-gradient-to-r from-[#D3E57A] via-[#A7F3D0] to-[#D9C9F5] text-[#12131C] font-bold shadow-[0_4px_22px_rgba(211,229,122,0.35)]"
                    : "text-white/60 hover:text-white hover:bg-white/[0.05]"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Radio className="w-4 h-4 shrink-0 text-[#BAE6FD]" />
                  <span>PULSE AI Signals</span>
                </div>
                <span className="w-2 h-2 rounded-full bg-[#D3E57A] animate-pulse" />
              </button>

              {/* Audit & Security */}
              <button
                type="button"
                onClick={() => setActiveMenu("audit")}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-[13px] font-medium transition-all ${
                  activeMenu === "audit"
                    ? "bg-gradient-to-r from-[#D3E57A] via-[#A7F3D0] to-[#D9C9F5] text-[#12131C] font-bold shadow-[0_4px_22px_rgba(211,229,122,0.35)]"
                    : "text-white/60 hover:text-white hover:bg-white/[0.05]"
                }`}
              >
                <Lock className="w-4 h-4 shrink-0" />
                <span>Audit & Security</span>
              </button>
            </div>

            {/* Section: SYSTEM */}
            <div className="mt-6 flex flex-col gap-1.5">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#94A3B8]/70 px-3 mb-1">
                SYSTEM
              </span>

              <button
                type="button"
                onClick={() => setActiveMenu("settings")}
                className="w-full flex items-center gap-3 px-3.5 py-2 rounded-2xl text-[13px] font-medium text-white/60 hover:text-white hover:bg-white/[0.05] transition-all"
              >
                <Cpu className="w-4 h-4 shrink-0" />
                <span>AI Pipeline Settings</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveMenu("settings")}
                className="w-full flex items-center gap-3 px-3.5 py-2 rounded-2xl text-[13px] font-medium text-white/60 hover:text-white hover:bg-white/[0.05] transition-all"
              >
                <Webhook className="w-4 h-4 shrink-0" />
                <span>API Integrations</span>
              </button>
            </div>
          </div>

          {/* Bottom Section: Profile & Exit */}
          <div className="pt-4 border-t border-white/[0.06] flex flex-col gap-3">
            <div className="flex items-center justify-between p-2 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full ring-1 ring-[#D3E57A]/50 bg-gradient-to-tr from-[#D3E57A] to-[#D9C9F5] flex items-center justify-center font-bold text-xs text-[#12131C]">
                  JH
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-white leading-tight">Jack Hunter</span>
                  <span className="text-[10px] text-[#D3E57A] flex items-center gap-1 font-semibold">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#D3E57A] animate-pulse" />
                    Super Admin
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => router.push("/")}
                title="Exit to Student Platform"
                className="p-1.5 rounded-xl hover:bg-white/10 text-white/60 hover:text-[#D3E57A] transition-all"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* ============================================================ */}
      {/* 2. MAIN DASHBOARD CONTENT AREA                                */}
      {/* ============================================================ */}
      <main className="flex-1 min-w-0 p-4 lg:p-6 lg:pl-2 flex flex-col gap-6 z-10 max-w-[1600px]">
        {/* ============================================================ */}
        {/* 2.1 TOP FLOATING HEADER BAR                                  */}
        {/* ============================================================ */}
        <header className="bg-[#12131C]/80 backdrop-blur-2xl border border-white/[0.08] rounded-[24px] px-5 sm:px-6 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-[0_8px_32px_rgba(0,0,0,0.35)]">
          {/* Left Title */}
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-white flex items-center gap-2">
              Admin Operations Console
            </h1>
            <p className="text-xs text-[#94A3B8] mt-0.5">
              Real-time health of opportunity crawlers, verification queue, and student signals
            </p>
          </div>

          {/* Center Search Pill */}
          <div className="relative flex items-center w-full max-w-sm sm:max-w-md xl:max-w-lg">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
            <input
              type="text"
              placeholder="Search students, signals, or opportunities..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/[0.04] border border-white/[0.08] hover:border-white/[0.15] focus:border-[#D3E57A]/50 focus:ring-1 focus:ring-[#D3E57A]/50 rounded-full pl-10 pr-20 py-2 text-xs text-white placeholder:text-slate-400 focus:outline-none transition-all"
            />
            <span className="px-2 py-0.5 rounded-md bg-white/[0.08] border border-white/[0.1] text-[10px] font-mono text-slate-300 absolute right-3 pointer-events-none">
              Ctrl + K
            </span>
          </div>

          {/* Right Controls */}
          <div className="flex items-center gap-3 self-end md:self-center">
            {/* Pill-shaped theme toggle */}
            <div className="bg-gradient-to-r from-[#D3E57A]/20 via-[#D9C9F5]/20 to-[#BAE6FD]/20 border border-white/[0.12] rounded-full p-1 flex items-center gap-1">
              <button
                type="button"
                onClick={() => setIsThemeDark(true)}
                title="Obsidian Dark Frost Theme"
                className={`p-1.5 rounded-full transition-all ${
                  isThemeDark ? "bg-[#181A25] text-[#D3E57A] shadow-sm" : "text-slate-400 hover:text-white"
                }`}
              >
                <Moon className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setIsThemeDark(false)}
                title="Light Theme"
                className={`p-1.5 rounded-full transition-all ${
                  !isThemeDark ? "bg-white text-[#12131C] shadow-sm" : "text-slate-400 hover:text-white"
                }`}
              >
                <Sun className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Notification Bell with theme dot */}
            <button
              type="button"
              className="relative p-2.5 rounded-full bg-white/[0.04] border border-white/[0.08] hover:bg-white/[0.08] text-slate-300 hover:text-white transition-all"
            >
              <Bell className="w-4 h-4" />
              {notificationCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#D3E57A] ring-2 ring-[#0B0C10]" />
              )}
            </button>

            {/* Switch to Student Portal Pill */}
            <button
              type="button"
              onClick={() => router.push("/")}
              className="px-3 py-1.5 rounded-full bg-white/[0.05] hover:bg-white/[0.1] hover:border-[#D3E57A]/40 border border-white/[0.12] text-xs font-semibold text-white flex items-center gap-1.5 transition-all shadow-sm group"
            >
              <GraduationCap className="w-3.5 h-3.5 text-[#D3E57A]" />
              <span>Student View</span>
              <ArrowUpRight className="w-3 h-3 text-slate-400 group-hover:text-[#D3E57A] transition-colors" />
            </button>
          </div>
        </header>

        {/* ============================================================ */}
        {/* VIEW 1: DASHBOARD / OVERVIEW                                 */}
        {/* ============================================================ */}
        {activeMenu === "overview" && (
          <div className="flex flex-col gap-6">
            {/* ============================================================ */}
            {/* 3. METRIC KPI CARDS (TOP GRID, 4 COLUMNS)                    */}
            {/* THE COLOUR EFFECT ON STATS REVEALS ON CURSOR HOVER!          */}
            {/* IN VYBE THEME WEBSITE COLOURS:                               */}
            {/* Card 1: Lime (#D3E57A)                                       */}
            {/* Card 2: Lilac (#D9C9F5)                                      */}
            {/* Card 3: Sky (#BAE6FD / #38BDF8)                              */}
            {/* Card 4: Peach (#FAD8C6 / #FBBF24)                            */}
            {/* ============================================================ */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-5">
              {/* ------------------------------------------------------------ */}
              {/* Card 1: Total Active Students (VYBE Lime Theme Hover)        */}
              {/* ------------------------------------------------------------ */}
              <div className="relative overflow-hidden rounded-[26px] bg-[#12131C]/80 backdrop-blur-2xl border border-white/[0.08] hover:border-[#D3E57A]/50 p-5 shadow-lg hover:shadow-[0_12px_40px_rgba(211,229,122,0.22)] flex flex-col justify-between group transition-all duration-300 cursor-pointer">
                {/* Luminous Lime Color Aura that illuminates on hover */}
                <div className="absolute -right-6 -bottom-6 w-40 h-40 bg-gradient-to-br from-[#D3E57A]/25 via-[#86EFAC]/15 to-transparent rounded-full blur-2xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                <div className="flex items-center justify-between relative z-10">
                  {/* Icon Container: neutral when idle, lights up in Lime on hover */}
                  <div className="w-10 h-10 rounded-2xl bg-white/[0.05] border border-white/[0.08] group-hover:border-[#D3E57A]/50 group-hover:bg-[#D3E57A]/15 group-hover:shadow-[0_0_20px_rgba(211,229,122,0.4)] flex items-center justify-center transition-all duration-300">
                    <Users className="w-5 h-5 text-slate-300 group-hover:text-[#D3E57A] transition-colors" />
                  </div>

                  {/* Status Badge: illuminates on hover */}
                  <span className="px-2.5 py-1 rounded-full bg-white/[0.05] border border-white/[0.08] group-hover:bg-[#D3E57A]/20 group-hover:border-[#D3E57A]/40 text-slate-400 group-hover:text-[#D3E57A] text-[11px] font-bold flex items-center gap-1 transition-all duration-300">
                    +14% this week
                  </span>
                </div>

                <div className="mt-4 relative z-10">
                  <div className="text-3xl font-extrabold tracking-tight text-white group-hover:text-[#F4F9DE] transition-colors">
                    18,450
                  </div>
                  <div className="text-xs font-medium text-[#94A3B8] mt-0.5">Total Active Students</div>
                </div>
              </div>

              {/* ------------------------------------------------------------ */}
              {/* Card 2: Verified Growth Outcomes (VYBE Lilac Theme Hover)    */}
              {/* ------------------------------------------------------------ */}
              <div className="relative overflow-hidden rounded-[26px] bg-[#12131C]/80 backdrop-blur-2xl border border-white/[0.08] hover:border-[#D9C9F5]/50 p-5 shadow-lg hover:shadow-[0_12px_40px_rgba(217,201,245,0.22)] flex flex-col justify-between group transition-all duration-300 cursor-pointer">
                {/* Luminous Lilac Color Aura that illuminates on hover */}
                <div className="absolute -right-6 -bottom-6 w-40 h-40 bg-gradient-to-br from-[#D9C9F5]/25 via-[#818CF8]/15 to-transparent rounded-full blur-2xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                <div className="flex items-center justify-between gap-2 relative z-10">
                  {/* Icon Container: neutral when idle, lights up in Lilac on hover */}
                  <div className="w-10 h-10 rounded-2xl bg-white/[0.05] border border-white/[0.08] group-hover:border-[#D9C9F5]/50 group-hover:bg-[#D9C9F5]/15 group-hover:shadow-[0_0_20px_rgba(217,201,245,0.4)] flex items-center justify-center shrink-0 transition-all duration-300">
                    <ShieldCheck className="w-5 h-5 text-slate-300 group-hover:text-[#D9C9F5] transition-colors" />
                  </div>

                  {/* Status Badge: illuminates on hover */}
                  <span className="px-2.5 py-1 rounded-full bg-white/[0.05] border border-white/[0.08] group-hover:bg-[#D9C9F5]/20 group-hover:border-[#D9C9F5]/40 text-slate-400 group-hover:text-[#D9C9F5] text-[10.5px] font-bold whitespace-nowrap transition-all duration-300">
                    +28% campus verified
                  </span>
                </div>

                <div className="mt-4 relative z-10">
                  <div className="text-3xl font-extrabold tracking-tight text-white group-hover:text-[#F6F1FD] transition-colors">
                    9,210
                  </div>
                  <div className="text-xs font-medium text-[#94A3B8] mt-0.5">Verified Growth Outcomes</div>
                </div>
              </div>

              {/* ------------------------------------------------------------ */}
              {/* Card 3: Opportunities Crawled (VYBE Sky Theme Hover)         */}
              {/* ------------------------------------------------------------ */}
              <div className="relative overflow-hidden rounded-[26px] bg-[#12131C]/80 backdrop-blur-2xl border border-white/[0.08] hover:border-[#38BDF8]/50 p-5 shadow-lg hover:shadow-[0_12px_40px_rgba(56,189,248,0.22)] flex flex-col justify-between group transition-all duration-300 cursor-pointer">
                {/* Luminous Sky Cyan Color Aura that illuminates on hover */}
                <div className="absolute -right-6 -bottom-6 w-40 h-40 bg-gradient-to-br from-[#38BDF8]/25 via-[#6366F1]/15 to-transparent rounded-full blur-2xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                <div className="flex items-center justify-between relative z-10">
                  {/* Icon Container: neutral when idle, lights up in Sky on hover */}
                  <div className="w-10 h-10 rounded-2xl bg-white/[0.05] border border-white/[0.08] group-hover:border-[#38BDF8]/50 group-hover:bg-[#38BDF8]/15 group-hover:shadow-[0_0_20px_rgba(56,189,248,0.4)] flex items-center justify-center transition-all duration-300">
                    <Database className="w-5 h-5 text-slate-300 group-hover:text-[#38BDF8] transition-colors" />
                  </div>

                  {/* Status Badge: illuminates on hover */}
                  <span className="px-2.5 py-1 rounded-full bg-white/[0.05] border border-white/[0.08] group-hover:bg-[#38BDF8]/20 group-hover:border-[#38BDF8]/40 text-slate-400 group-hover:text-[#38BDF8] text-[11px] font-bold flex items-center gap-1.5 transition-all duration-300">
                    <span className="w-2 h-2 rounded-full bg-slate-400 group-hover:bg-[#38BDF8] group-hover:animate-pulse transition-colors" />
                    98.4% source freshness
                  </span>
                </div>

                <div className="mt-4 relative z-10">
                  <div className="text-3xl font-extrabold tracking-tight text-white group-hover:text-[#E0F2FE] transition-colors">
                    1,420
                  </div>
                  <div className="text-xs font-medium text-[#94A3B8] mt-0.5">Opportunities Crawled</div>
                </div>
              </div>

              {/* ------------------------------------------------------------ */}
              {/* Card 4: PULSE AI Queries Today (VYBE Peach Theme Hover)      */}
              {/* ------------------------------------------------------------ */}
              <div className="relative overflow-hidden rounded-[26px] bg-[#12131C]/80 backdrop-blur-2xl border border-white/[0.08] hover:border-[#FAD8C6]/50 p-5 shadow-lg hover:shadow-[0_12px_40px_rgba(250,216,198,0.22)] flex flex-col justify-between group transition-all duration-300 cursor-pointer">
                {/* Luminous Peach / Golden Aura that illuminates on hover */}
                <div className="absolute -right-6 -bottom-6 w-40 h-40 bg-gradient-to-br from-[#FAD8C6]/30 via-[#FBBF24]/20 to-transparent rounded-full blur-2xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                <div className="flex items-center justify-between relative z-10">
                  {/* Icon Container: neutral when idle, lights up in Peach on hover */}
                  <div className="w-10 h-10 rounded-2xl bg-white/[0.05] border border-white/[0.08] group-hover:border-[#FAD8C6]/50 group-hover:bg-[#FAD8C6]/15 group-hover:shadow-[0_0_20px_rgba(250,216,198,0.4)] flex items-center justify-center transition-all duration-300">
                    <Sparkles className="w-5 h-5 text-slate-300 group-hover:text-[#FAD8C6] transition-colors" />
                  </div>

                  {/* Status Badge: illuminates on hover */}
                  <span className="px-2.5 py-1 rounded-full bg-white/[0.05] border border-white/[0.08] group-hover:bg-[#FAD8C6]/20 group-hover:border-[#FAD8C6]/40 text-slate-400 group-hover:text-[#FAD8C6] text-[11px] font-bold flex items-center gap-1 transition-all duration-300">
                    <Flame className="w-3 h-3 text-slate-400 group-hover:text-[#FAD8C6] transition-colors" />
                    +42% velocity
                  </span>
                </div>

                <div className="mt-4 relative z-10">
                  <div className="text-3xl font-extrabold tracking-tight text-white group-hover:text-[#FFF7ED] transition-colors">
                    34,890
                  </div>
                  <div className="text-xs font-medium text-[#94A3B8] mt-0.5">PULSE AI Queries Today</div>
                </div>
              </div>
            </div>

            {/* ============================================================ */}
            {/* 4. CENTRAL CHARTS & OPERATIONS GRID (2 COLUMNS)              */}
            {/* IN VYBE THEME WEBSITE COLOURS                                */}
            {/* ============================================================ */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
              {/* ------------------------------------------------------------ */}
              {/* LEFT COLUMN (lg:col-span-6)                                  */}
              {/* ------------------------------------------------------------ */}
              <div className="lg:col-span-6 flex flex-col gap-5">
                {/* CARD 1: AI Signal Processing & Crawl Success Rate */}
                <div className="bg-[#12131C]/80 backdrop-blur-2xl border border-white/[0.08] rounded-[28px] p-6 shadow-xl relative overflow-hidden flex flex-col justify-between">
                  {/* Subtle corner aura in theme lime */}
                  <div className="absolute top-0 right-0 w-44 h-44 bg-gradient-to-b from-[#D3E57A]/08 to-transparent rounded-full blur-2xl pointer-events-none" />

                  {/* Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 rounded-xl bg-white/[0.04] border border-white/[0.08]">
                        <Activity className="w-4 h-4 text-[#D3E57A]" />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-white tracking-tight">
                          AI Signal Processing & Crawl Success Rate
                        </h3>
                        <p className="text-[11px] text-[#94A3B8]">
                          Crawler health across 4 major opportunity streams
                        </p>
                      </div>
                    </div>

                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#D3E57A]/10 border border-[#D3E57A]/25 text-[#D3E57A]">
                      Global Index: 88.5%
                    </span>
                  </div>

                  {/* Segmented bar chart in VYBE Theme colors */}
                  <div className="pt-4 pb-2">
                    <div className="relative h-48 flex items-end justify-between px-3 sm:px-6 border-b border-white/[0.08]">
                      {/* Horizontal guideline markers */}
                      <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-20">
                        <div className="border-b border-dashed border-white text-[10px] text-right pr-1">100</div>
                        <div className="border-b border-dashed border-white text-[10px] text-right pr-1">75</div>
                        <div className="border-b border-dashed border-white text-[10px] text-right pr-1">50</div>
                        <div className="border-b border-dashed border-white text-[10px] text-right pr-1">25</div>
                        <div className="border-b border-dashed border-white text-[10px] text-right pr-1">0</div>
                      </div>

                      {/* Bar 1: Hackathons (Leading category - glowing 3D VYBE Lime/Lilac rounded bar) */}
                      <div className="flex flex-col items-center gap-2 z-10 group cursor-pointer">
                        <div className="h-40 w-16 sm:w-20 rounded-2xl bg-gradient-to-t from-[#6366F1] via-[#D9C9F5] to-[#D3E57A] shadow-[0_0_35px_rgba(211,229,122,0.45)] border-t-2 border-[#D3E57A] relative flex flex-col justify-between items-center py-2 transition-all duration-300 group-hover:scale-[1.04] group-hover:shadow-[0_0_45px_rgba(211,229,122,0.65)]">
                          {/* Inner glowing highlight cap in Lime */}
                          <div className="w-8 h-1 rounded-full bg-white/95 shadow-sm" />
                          <span className="text-xs font-black text-[#12131C] drop-shadow-sm px-1.5 py-0.5 rounded-md bg-white/75">
                            94%
                          </span>
                        </div>
                        <span className="text-[11px] font-bold text-white group-hover:text-[#D3E57A] transition-colors">
                          Hackathons
                        </span>
                      </div>

                      {/* Bar 2: Research Grants (VYBE Lilac Hover) */}
                      <div className="flex flex-col items-center gap-2 z-10 group cursor-pointer">
                        <div className="h-32 w-16 sm:w-20 rounded-2xl bg-white/[0.05] border border-white/[0.1] group-hover:border-[#D9C9F5]/50 group-hover:bg-[#D9C9F5]/10 group-hover:shadow-[0_0_25px_rgba(217,201,245,0.35)] relative flex flex-col justify-between items-center py-2 transition-all duration-300 group-hover:scale-[1.04]">
                          <div className="w-8 h-1 rounded-full bg-white/40 group-hover:bg-[#D9C9F5]" />
                          <span className="text-xs font-bold text-slate-300 group-hover:text-[#D9C9F5]">82%</span>
                        </div>
                        <span className="text-[11px] font-medium text-slate-400 group-hover:text-[#D9C9F5] transition-colors">
                          Research
                        </span>
                      </div>

                      {/* Bar 3: Internships (VYBE Sky Hover) */}
                      <div className="flex flex-col items-center gap-2 z-10 group cursor-pointer">
                        <div className="h-28 w-16 sm:w-20 rounded-2xl bg-white/[0.04] border border-white/[0.08] group-hover:border-[#38BDF8]/50 group-hover:bg-[#38BDF8]/10 group-hover:shadow-[0_0_25px_rgba(56,189,248,0.35)] relative flex flex-col justify-between items-center py-2 transition-all duration-300 group-hover:scale-[1.04]">
                          <div className="w-8 h-1 rounded-full bg-white/30 group-hover:bg-[#38BDF8]" />
                          <span className="text-xs font-bold text-slate-400 group-hover:text-[#38BDF8]">76%</span>
                        </div>
                        <span className="text-[11px] font-medium text-slate-400 group-hover:text-[#38BDF8] transition-colors">
                          Internships
                        </span>
                      </div>

                      {/* Bar 4: Fellowships (VYBE Peach Hover) */}
                      <div className="flex flex-col items-center gap-2 z-10 group cursor-pointer">
                        <div className="h-24 w-16 sm:w-20 rounded-2xl bg-white/[0.03] border border-white/[0.06] group-hover:border-[#FAD8C6]/50 group-hover:bg-[#FAD8C6]/10 group-hover:shadow-[0_0_25px_rgba(250,216,198,0.35)] relative flex flex-col justify-between items-center py-2 transition-all duration-300 group-hover:scale-[1.04]">
                          <div className="w-8 h-1 rounded-full bg-white/20 group-hover:bg-[#FAD8C6]" />
                          <span className="text-xs font-bold text-slate-400 group-hover:text-[#FAD8C6]">68%</span>
                        </div>
                        <span className="text-[11px] font-medium text-slate-400 group-hover:text-[#FAD8C6] transition-colors">
                          Fellowships
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* CARD 2: Campus Verification Velocity (Column histogram with glowing active pillar) */}
                <div className="bg-[#12131C]/80 backdrop-blur-2xl border border-white/[0.08] rounded-[28px] p-6 shadow-xl relative overflow-hidden flex flex-col justify-between">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 rounded-xl bg-white/[0.04] border border-white/[0.08]">
                        <TrendingUp className="w-4 h-4 text-[#D3E57A]" />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-white tracking-tight">
                          Campus Verification Velocity
                        </h3>
                        <p className="text-[11px] text-[#94A3B8]">
                          Hourly credential verification throughput
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs font-extrabold text-[#D3E57A] flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-[#D3E57A] animate-pulse" />
                        Peak: 8,400 verifications/hr
                      </span>
                    </div>
                  </div>

                  {/* Histogram */}
                  <div className="pt-2">
                    <div className="relative h-36 flex items-end justify-between gap-1.5 sm:gap-2 px-1 border-b border-white/[0.08]">
                      {[
                        { hour: "02:00", h: "35%", active: false },
                        { hour: "04:00", h: "20%", active: false },
                        { hour: "06:00", h: "28%", active: false },
                        { hour: "08:00", h: "48%", active: false },
                        { hour: "10:00", h: "62%", active: false },
                        { hour: "12:00", h: "75%", active: false },
                        { hour: "14:00", h: "70%", active: false },
                        { hour: "16:00", h: "92%", active: true }, // ACTIVE GLOWING PILLAR IN VYBE LIME
                        { hour: "18:00", h: "65%", active: false },
                        { hour: "20:00", h: "52%", active: false },
                        { hour: "22:00", h: "40%", active: false },
                        { hour: "24:00", h: "30%", active: false },
                      ].map((item, idx) => (
                        <div key={idx} className="flex-1 flex flex-col items-center h-full justify-end group cursor-pointer">
                          {item.active ? (
                            // Glowing active VYBE Lime pillar
                            <div
                              style={{ height: item.h }}
                              className="w-full max-w-[28px] rounded-t-xl bg-gradient-to-t from-[#6366F1] via-[#D9C9F5] to-[#D3E57A] shadow-[0_0_25px_rgba(211,229,122,0.65)] relative flex items-start justify-center pt-1 transition-all duration-300 group-hover:brightness-110"
                            >
                              <div className="w-2 h-2 rounded-full bg-white shadow-md ring-2 ring-[#D3E57A]" />
                            </div>
                          ) : (
                            <div
                              style={{ height: item.h }}
                              className="w-full max-w-[28px] rounded-t-xl bg-white/[0.04] group-hover:bg-[#D3E57A]/30 group-hover:shadow-[0_0_12px_rgba(211,229,122,0.2)] transition-all duration-200"
                            />
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Time labels */}
                    <div className="flex justify-between text-[10px] text-[#94A3B8] font-mono mt-2 px-1">
                      <span>02:00</span>
                      <span>08:00</span>
                      <span className="text-[#D3E57A] font-bold">16:00 (Peak)</span>
                      <span>20:00</span>
                      <span>24:00</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* ------------------------------------------------------------ */}
              {/* RIGHT COLUMN (lg:col-span-6)                                 */}
              {/* ------------------------------------------------------------ */}
              <div className="lg:col-span-6 flex flex-col gap-5">
                {/* CARD 3: Student Engagement & Decision Velocity */}
                <div className="bg-[#12131C]/80 backdrop-blur-2xl border border-white/[0.08] rounded-[28px] p-6 shadow-xl relative overflow-hidden flex flex-col justify-between">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 rounded-xl bg-white/[0.04] border border-white/[0.08]">
                        <Flame className="w-4 h-4 text-[#D3E57A]" />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-white tracking-tight">
                          Student Engagement & Decision Velocity
                        </h3>
                        <p className="text-[11px] text-[#94A3B8]">
                          Daily active student sessions vs action triggers
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1.5 text-[11px] text-[#D3E57A] font-semibold">
                        <span className="w-2.5 h-1 rounded-full bg-[#D3E57A]" />
                        Active Sessions
                      </span>
                      <span className="flex items-center gap-1.5 text-[11px] text-white/70">
                        <span className="w-2.5 h-1 rounded-full bg-white" />
                        Decisions Made
                      </span>
                    </div>
                  </div>

                  {/* Dual-spline SVG chart with VYBE Theme Lime & Lilac curve */}
                  <div className="relative pt-2">
                    <svg viewBox="0 0 500 160" className="w-full h-44 overflow-visible">
                      <defs>
                        {/* Lime theme glow filter */}
                        <filter id="glowLime" x="-20%" y="-20%" width="140%" height="140%">
                          <feGaussianBlur stdDeviation="3.5" result="blur" />
                          <feComposite in="SourceGraphic" in2="blur" operator="over" />
                        </filter>

                        {/* VYBE Theme Gradient (Lilac -> Lime) */}
                        <linearGradient id="vybeThemeGrad" x1="0" y1="0" x2="1" y2="0">
                          <stop offset="0%" stopColor="#818CF8" />
                          <stop offset="50%" stopColor="#D9C9F5" />
                          <stop offset="100%" stopColor="#D3E57A" />
                        </linearGradient>

                        {/* Area gradient in Lime */}
                        <linearGradient id="vybeWaveFill" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#D3E57A" stopOpacity="0.22" />
                          <stop offset="100%" stopColor="#D3E57A" stopOpacity="0.0" />
                        </linearGradient>
                      </defs>

                      {/* Dotted horizontal guides */}
                      <line x1="0" y1="30" x2="500" y2="30" stroke="rgba(255,255,255,0.08)" strokeDasharray="4 4" />
                      <line x1="0" y1="80" x2="500" y2="80" stroke="rgba(255,255,255,0.08)" strokeDasharray="4 4" />
                      <line x1="0" y1="130" x2="500" y2="130" stroke="rgba(255,255,255,0.08)" strokeDasharray="4 4" />

                      {/* Area Fill for Spline 1 */}
                      <path
                        d="M 10 120 Q 70 40 140 90 T 260 50 T 380 75 T 490 35 L 490 150 L 10 150 Z"
                        fill="url(#vybeWaveFill)"
                      />

                      {/* Spline 1: VYBE Theme glowing bezier curve in Lime & Lilac */}
                      <path
                        d="M 10 120 Q 70 40 140 90 T 260 50 T 380 75 T 490 35"
                        fill="none"
                        stroke="url(#vybeThemeGrad)"
                        strokeWidth="3.5"
                        strokeLinecap="round"
                        filter="url(#glowLime)"
                      />

                      {/* Spline 2: Soft crisp white curve */}
                      <path
                        d="M 10 135 Q 80 110 150 125 T 270 95 T 390 110 T 490 80"
                        fill="none"
                        stroke="rgba(255, 255, 255, 0.75)"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />

                      {/* Highlight Points on Curve in Theme Lime and Lilac */}
                      <circle cx="260" cy="50" r="4.5" fill="#D3E57A" stroke="#FFFFFF" strokeWidth="2" />
                      <circle cx="490" cy="35" r="5" fill="#FFFFFF" stroke="#D3E57A" strokeWidth="2.5" />
                    </svg>

                    <div className="flex justify-between text-[11px] text-[#94A3B8] font-mono pt-1">
                      <span>Mon</span>
                      <span>Tue</span>
                      <span>Wed</span>
                      <span>Thu</span>
                      <span>Fri</span>
                      <span className="text-[#D3E57A] font-bold">Today (+14.2k)</span>
                    </div>
                  </div>
                </div>

                {/* CARD 4: Urgent Verification Queue (Glassmorphic mini-table with real data) */}
                <div className="bg-[#12131C]/80 backdrop-blur-2xl border border-white/[0.08] rounded-[28px] p-6 shadow-xl flex flex-col justify-between">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 rounded-xl bg-white/[0.04] border border-white/[0.08]">
                        <ShieldCheck className="w-4 h-4 text-[#D3E57A]" />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-white tracking-tight">
                          Urgent Verification Queue
                        </h3>
                        <p className="text-[11px] text-[#94A3B8]">
                          Credentials requiring immediate cryptographic endorsement
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setActiveMenu("verification")}
                      className="text-xs font-semibold text-[#D3E57A] hover:underline flex items-center gap-1 transition-colors"
                    >
                      <span>View All ({urgentQueue.length})</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Glassmorphic mini-table */}
                  <div className="flex flex-col divide-y divide-white/[0.06]">
                    {urgentQueue.map((item) => (
                      <div
                        key={item.id}
                        className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 group hover:bg-white/[0.02] px-2 rounded-2xl transition-colors"
                      >
                        <div className="flex items-start gap-3">
                          {/* Student Avatar */}
                          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#D3E57A]/30 to-[#D9C9F5]/30 border border-white/[0.1] flex items-center justify-center text-xs font-bold text-white shrink-0 mt-0.5">
                            {item.avatarSeed}
                          </div>

                          <div className="flex flex-col">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-white group-hover:text-[#D3E57A] transition-colors">
                                {item.studentName}
                              </span>
                              <span className="text-[10px] text-slate-400 font-mono">
                                • {item.timestamp}
                              </span>
                            </div>

                            <span className="text-xs text-slate-300 font-medium line-clamp-1">
                              {item.achievementTitle}
                            </span>

                            <div className="flex items-center gap-2 mt-1">
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-white/[0.05] border border-white/[0.08] text-slate-300 flex items-center gap-1">
                                {item.evidenceType.includes("GitHub") ? (
                                  <GitBranch className="w-3 h-3 text-[#BAE6FD]" />
                                ) : (
                                  <FileCheck className="w-3 h-3 text-[#D3E57A]" />
                                )}
                                {item.evidenceType}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                          <button
                            type="button"
                            onClick={() => setInspectedItem(item)}
                            className="px-3 py-1.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] hover:border-[#D3E57A]/40 border border-white/[0.08] text-[11px] font-medium text-slate-300 hover:text-white transition-all flex items-center gap-1"
                          >
                            <Eye className="w-3.5 h-3.5 text-slate-400" />
                            <span>Inspect</span>
                          </button>

                          {item.status === "verified" ? (
                            <span className="px-3 py-1.5 rounded-xl bg-[#D3E57A]/20 text-[#D3E57A] border border-[#D3E57A]/35 text-[11px] font-bold flex items-center gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              Approved
                            </span>
                          ) : (
                            <button
                              type="button"
                              onClick={() => handleApproveUrgent(item.id)}
                              className="px-3.5 py-1.5 rounded-xl bg-[#D3E57A] hover:bg-[#C5DA62] text-[#12131C] text-[11px] font-bold shadow-[0_0_15px_rgba(211,229,122,0.35)] transition-all flex items-center gap-1"
                            >
                              <Check className="w-3.5 h-3.5" />
                              <span>Approve</span>
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* VIEW 2: CATALOGUE FRESHNESS                                  */}
        {/* ============================================================ */}
        {activeMenu === "catalogue" && (
          <div className="flex flex-col gap-5">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-white">Opportunities Catalogue & Freshness</h2>
                <p className="text-xs text-[#94A3B8]">
                  Automated scraping pipelines, source confidence levels, and stale detection
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400 font-mono">
                  {filteredCatalogue.length} opportunities indexed
                </span>
              </div>
            </div>

            {/* Desktop Table */}
            <div className="overflow-hidden rounded-[24px] bg-[#12131C]/80 backdrop-blur-2xl border border-white/[0.08] shadow-xl">
              <table className="w-full text-left text-xs">
                <thead className="bg-white/[0.03] text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-white/[0.06]">
                  <tr>
                    <th className="p-4 pl-6">Title & Organizer</th>
                    <th className="p-4">Stream</th>
                    <th className="p-4">Status & Freshness</th>
                    <th className="p-4">Deadline</th>
                    <th className="p-4">Last Verified</th>
                    <th className="p-4 pr-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.04]">
                  {filteredCatalogue.map((opp) => {
                    const isExpired = new Date(opp.deadline).getTime() < Date.now();
                    return (
                      <tr key={opp.id} className="hover:bg-white/[0.02] transition-colors">
                        <td className="p-4 pl-6">
                          <div className="font-bold text-white text-sm">{opp.title}</div>
                          <div className="text-[11px] text-slate-400">{opp.organizer}</div>
                        </td>
                        <td className="p-4 font-semibold text-slate-300">{opp.type}</td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                opp.source_status === "stale"
                                  ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                                  : "bg-[#D3E57A]/20 text-[#D3E57A] border border-[#D3E57A]/35"
                              }`}
                            >
                              {opp.source_status === "stale" ? "Stale Signal" : "Active Feed"}
                            </span>
                            {isExpired && (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#E0605E]/20 text-[#E0605E]">
                                Expired
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="p-4 text-slate-300 font-mono">
                          {new Date(opp.deadline).toLocaleDateString()}
                        </td>
                        <td className="p-4 text-slate-400 font-mono">
                          {new Date(opp.last_checked_at).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </td>
                        <td className="p-4 pr-6 text-right">
                          <button
                            type="button"
                            onClick={() => handleToggleStale(opp.id)}
                            className="px-3 py-1.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.08] hover:border-[#D3E57A]/40 text-xs font-semibold text-slate-200 transition-all"
                          >
                            {opp.source_status === "stale" ? "Mark Sourced" : "Flag Stale"}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* VIEW 3: FULL VERIFICATION QUEUE                              */}
        {/* ============================================================ */}
        {activeMenu === "verification" && (
          <div className="flex flex-col gap-5">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-white">Student Verification Review Queue</h2>
                <p className="text-xs text-[#94A3B8]">
                  Audit and attest academic achievements, hackathon wins, and open source commits
                </p>
              </div>

              <span className="text-xs text-slate-400 font-mono">
                {outcomesQueue.filter((o) => o.verification !== "verified").length} pending review
              </span>
            </div>

            <div className="flex flex-col gap-4">
              {outcomesQueue.map((item) => (
                <div
                  key={item.id}
                  className="rounded-[24px] bg-[#12131C]/80 backdrop-blur-2xl border border-white/[0.08] p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-lg hover:border-white/[0.15] transition-all"
                >
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2.5">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          item.verification === "verified"
                            ? "bg-[#D3E57A]/20 text-[#D3E57A] border border-[#D3E57A]/35"
                            : "bg-[#D9C9F5]/20 text-[#D9C9F5] border border-[#D9C9F5]/35"
                        }`}
                      >
                        {item.verification === "verified" ? "Verified" : "Pending Review"}
                      </span>
                      <span className="text-xs font-semibold text-slate-400">
                        Role: {item.participation}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-white">{item.title}</h3>
                    <p className="text-xs text-slate-400 italic max-w-xl">
                      &ldquo;{item.reflection}&rdquo;
                    </p>

                    {item.evidence_url && (
                      <a
                        href={item.evidence_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-[#D3E57A] hover:underline font-semibold inline-flex items-center gap-1.5"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        Attached Evidence ({item.evidence_url})
                      </a>
                    )}
                  </div>

                  <div className="flex items-center gap-2 self-start sm:self-center shrink-0">
                    {item.verification === "verified" ? (
                      <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#D3E57A] px-3 py-1.5 rounded-xl bg-[#D3E57A]/15 border border-[#D3E57A]/30">
                        <CheckCircle2 className="w-4 h-4" />
                        Approved
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleVerifyOutcome(item.id)}
                        className="px-4 py-2 rounded-xl bg-[#D3E57A] hover:bg-[#C5DA62] text-[#12131C] text-xs font-bold shadow-[0_0_20px_rgba(211,229,122,0.35)] transition-all flex items-center gap-1.5"
                      >
                        <ShieldCheck className="w-4 h-4" />
                        Approve & Verify
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* VIEW 4: AUDIT TRAIL                                          */}
        {/* ============================================================ */}
        {activeMenu === "audit" && (
          <div className="rounded-[28px] bg-[#12131C]/80 backdrop-blur-2xl border border-white/[0.08] p-6 sm:p-8 shadow-xl flex flex-col gap-5">
            <div>
              <h2 className="text-xl font-bold text-white">Immutable System Audit Trail</h2>
              <p className="text-xs text-[#94A3B8]">
                Cryptographic log of all admin actions, student verifications, and crawler syncs
              </p>
            </div>

            <div className="flex flex-col divide-y divide-white/[0.06]">
              {auditLogs.map((log, idx) => (
                <div
                  key={idx}
                  className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                >
                  <div className="flex flex-col">
                    <span className="font-bold text-xs text-white">
                      {log.action} ·{" "}
                      <span className="font-normal text-slate-300">{log.details}</span>
                    </span>
                    <span className="text-[11px] text-slate-400 mt-0.5">
                      Actor: {log.actor} (Target: {log.target})
                    </span>
                  </div>
                  <span className="text-[11px] font-mono text-slate-400">
                    {new Date(log.timestamp).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* VIEW 5: PULSE & AI SETTINGS                                  */}
        {/* ============================================================ */}
        {(activeMenu === "pulse" || activeMenu === "settings" || activeMenu === "analytics") && (
          <div className="rounded-[28px] bg-[#12131C]/80 backdrop-blur-2xl border border-white/[0.08] p-6 sm:p-8 shadow-xl flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-white">PULSE AI Pipeline & Integration Mesh</h2>
                <p className="text-xs text-[#94A3B8]">
                  Configure crawler schedules, LLM vector embeddings, and campus API webhooks
                </p>
              </div>

              <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#D3E57A]/15 text-[#D3E57A] border border-[#D3E57A]/30 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#D3E57A] animate-pulse" />
                Pipeline Active
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex flex-col gap-2">
                <span className="text-xs font-bold text-white">Crawler Heartbeat</span>
                <span className="text-xl font-extrabold text-[#D3E57A]">Every 15 mins</span>
                <span className="text-[11px] text-slate-400">Targeting 48 verified student portals</span>
              </div>
              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex flex-col gap-2">
                <span className="text-xs font-bold text-white">Vector Embedding Model</span>
                <span className="text-xl font-extrabold text-[#D9C9F5]">Gemini 1.5 Pro</span>
                <span className="text-[11px] text-slate-400">Opportunity semantic matching</span>
              </div>
              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex flex-col gap-2">
                <span className="text-xs font-bold text-white">Campus Endpoints</span>
                <span className="text-xl font-extrabold text-[#BAE6FD]">24 Active Hubs</span>
                <span className="text-[11px] text-slate-400">SRM, IITs, DST portals online</span>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* ============================================================ */}
      {/* 5. INSPECTION MODAL (FOR VERIFICATION QUEUE ITEMS)            */}
      {/* ============================================================ */}
      {inspectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
          <div className="w-full max-w-lg rounded-[28px] bg-[#12131C] border border-white/[0.12] p-6 shadow-2xl relative flex flex-col gap-5">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-[#D3E57A]/15 border border-[#D3E57A]/30 text-[#D3E57A]">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Evidence Inspection Packet</h3>
                  <p className="text-xs text-slate-400">Verification Ledger #VYBE-{inspectedItem.id}</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setInspectedItem(null)}
                className="p-1.5 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex flex-col gap-3 text-xs">
              <div className="flex justify-between py-2 border-b border-white/[0.04]">
                <span className="text-slate-400">Student Name:</span>
                <span className="font-bold text-white">{inspectedItem.studentName}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-white/[0.04]">
                <span className="text-slate-400">Achievement:</span>
                <span className="font-semibold text-white max-w-xs text-right">
                  {inspectedItem.achievementTitle}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-white/[0.04]">
                <span className="text-slate-400">Evidence Modality:</span>
                <span className="font-mono text-[#D3E57A]">{inspectedItem.evidenceType}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-white/[0.04]">
                <span className="text-slate-400">Verification Target:</span>
                <a
                  href={inspectedItem.evidenceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#D3E57A] hover:underline font-mono inline-flex items-center gap-1"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  View Cryptographic Proof
                </a>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setInspectedItem(null)}
                className="px-4 py-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-xs font-semibold text-slate-300 transition-all"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  handleApproveUrgent(inspectedItem.id);
                  setInspectedItem(null);
                }}
                className="px-4 py-2 rounded-xl bg-[#D3E57A] hover:bg-[#C5DA62] text-[#12131C] text-xs font-bold shadow-[0_0_20px_rgba(211,229,122,0.35)] transition-all flex items-center gap-1.5"
              >
                <Check className="w-4 h-4" />
                Endorse & Verify
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
