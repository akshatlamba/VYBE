"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Plus,
  Clock,
  BookOpen,
  Trash2,
  Pencil,
  X,
  RefreshCw,
  Download,
  Sparkles,
  LayoutGrid,
  Calendar,
  BarChart2,
  HelpCircle,
  Cpu,
  Terminal,
  Palette,
  Brain,
  Users,
  Search,
  PlusCircle,
  MapPin,
  CheckCircle2,
} from "lucide-react";
import { useAuth } from "@/lib/auth/auth-context";
import { VybeSymbol } from "@/components/ui/vybe-logo";

const API =
  process.env.NEXT_PUBLIC_BACKEND_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "http://127.0.0.1:8000";

type Entry = {
  id: number;
  student_id: number;
  title: string;
  description?: string | null;
  category: string;
  start_at: string;
  end_at?: string | null;
  all_day: boolean;
  venue?: string;
  color_theme?: "lime" | "lilac" | "peach" | "sky" | "coral";
};

type Opportunity = {
  id: number;
  title: string;
  category?: string;
  start_at: string;
  end_at?: string | null;
  venue?: string;
  organizer?: string;
};

// Initial featured prototype schedule matching Stitch layout
const INITIAL_TIMETABLE_EVENTS: Entry[] = [
  {
    id: 101,
    student_id: 1,
    title: "SIH Hackathon Sprint",
    category: "Hackathons",
    start_at: "2026-01-20T08:00:00",
    end_at: "2026-01-20T08:45:00",
    all_day: false,
    venue: "Room 4B",
    color_theme: "lilac",
    description: "Rapid prototyping and team sprint for Smart India Hackathon internal demo.",
  },
  {
    id: 102,
    student_id: 1,
    title: "AI Agent System Design",
    category: "Study Sprints",
    start_at: "2026-01-20T08:15:00",
    end_at: "2026-01-20T09:30:00",
    all_day: false,
    venue: "Discord Voice",
    color_theme: "lime",
    description: "Designing agentic feedback loops and tool-call routers with team.",
  },
  {
    id: 103,
    student_id: 1,
    title: "FastAPI Core & Database Optimization Review",
    category: "Cohort Tasks",
    start_at: "2026-01-20T10:00:00",
    end_at: "2026-01-20T11:30:00",
    all_day: false,
    venue: "Innovation Pod 02",
    color_theme: "peach",
    description: "Deep dive into async SQL connection pooling and cache invalidation strategies.",
  },
  {
    id: 104,
    student_id: 1,
    title: "UI/UX Mentorship Sync",
    category: "Study Sprints",
    start_at: "2026-01-20T10:45:00",
    end_at: "2026-01-20T12:00:00",
    all_day: false,
    venue: "Google Meet",
    color_theme: "sky",
    description: "Reviewing modern glassmorphic interface and student dashboard hierarchy.",
  },
  {
    id: 105,
    student_id: 1,
    title: "ML Model Training Session & Hyperparameter Tuning",
    category: "Cohort Tasks",
    start_at: "2026-01-20T13:30:00",
    end_at: "2026-01-20T15:00:00",
    all_day: false,
    venue: "AWS Cluster GPU-04",
    color_theme: "coral",
    description: "Distributed fine-tuning evaluation run on student benchmark dataset.",
  },
  {
    id: 106,
    student_id: 1,
    title: "Founders Cohort Demo Day Dry Run",
    category: "Hackathons",
    start_at: "2026-01-20T15:30:00",
    end_at: "2026-01-20T17:00:00",
    all_day: false,
    venue: "Main Auditorium & Zoom",
    color_theme: "lime",
    description: "Pitch practice with incubation mentors and seed investors.",
  },
];

const pad = (n: number) => String(n).padStart(2, "0");

function dateKey(date: Date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

function toLocalInput(value?: string | null) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(
    date.getHours()
  )}:${pad(date.getMinutes())}`;
}

const emptyForm: {
  title: string;
  description: string;
  category: string;
  venue: string;
  start_at: string;
  end_at: string;
  all_day: boolean;
  color_theme: "lime" | "lilac" | "peach" | "sky" | "coral";
} = {
  title: "",
  description: "",
  category: "Hackathons",
  venue: "Room 4B",
  start_at: "",
  end_at: "",
  all_day: false,
  color_theme: "lime",
};

export default function CalendarPage() {
  const { user } = useAuth();
  const studentId = user.id || 1;

  // View switch: "Month" | "Week" | "Day"
  const [viewMode, setViewMode] = useState<"Month" | "Week" | "Day">("Week");

  // Selected date anchor (Defaulting to January 2026 anchor or current date)
  const [selectedDate, setSelectedDate] = useState("2026-01-20");

  // Active Month state
  const [currentMonth, setCurrentMonth] = useState(() => new Date(2026, 0, 1));

  // Search filter
  const [searchQuery, setSearchQuery] = useState("");

  // Category filter checkboxes
  const [filterHackathons, setFilterHackathons] = useState(true);
  const [filterCohortTasks, setFilterCohortTasks] = useState(true);
  const [filterStudySprints, setFilterStudySprints] = useState(true);

  // Data states
  const [entries, setEntries] = useState<Entry[]>(INITIAL_TIMETABLE_EVENTS);
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(false);
  const [live, setLive] = useState(true);
  const [error, setError] = useState("");

  // Modal form states
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  // Spotlight card state
  const [spotlightDismissed, setSpotlightDismissed] = useState(false);

  // Load calendar events from backend if available
  const loadCalendar = useCallback(async () => {
    try {
      setLoading(true);
      const [entryRes, oppRes] = await Promise.all([
        fetch(`${API}/calendar/${studentId}`, { cache: "no-store" }).catch(() => null),
        fetch(`${API}/events/calendar/${studentId}`, { cache: "no-store" }).catch(() => null),
      ]);

      if (entryRes && entryRes.ok) {
        const data = await entryRes.json();
        if (Array.isArray(data) && data.length > 0) {
          // Merge with initial rich events
          const mapped = data.map((d: any) => ({
            ...d,
            venue: d.venue || "Campus Hub",
            color_theme: d.color_theme || "lilac",
          }));
          setEntries([...INITIAL_TIMETABLE_EVENTS, ...mapped]);
        }
      }

      if (oppRes && oppRes.ok) {
        const oppData = await oppRes.json();
        if (Array.isArray(oppData)) {
          setOpportunities(oppData);
        }
      }
      setLive(true);
    } catch {
      setLive(false);
    } finally {
      setLoading(false);
    }
  }, [studentId]);

  useEffect(() => {
    loadCalendar();
  }, [loadCalendar]);

  // Active week days based on selected date
  const weekDays = useMemo(() => {
    const curr = new Date(selectedDate);
    const dayOfWeek = curr.getDay(); // 0 is Sunday, 1 is Monday...
    // Start week on Monday
    const diff = curr.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
    const monday = new Date(curr.setDate(diff));

    return [1, 2, 3, 4, 5, 6].map((i) => {
      const d = new Date(monday);
      d.setDate(monday.getDate() + (i - 1));
      const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
      return {
        dateStr: dateKey(d),
        dayName: dayNames[d.getDay()],
        dayNum: d.getDate(),
        month: d.getMonth(),
        year: d.getFullYear(),
        isToday: dateKey(d) === selectedDate,
      };
    });
  }, [selectedDate]);

  // Mini calendar 7x5 matrix for January 2026
  const miniCalendarDays = useMemo(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const startingDay = firstDay.getDay(); // 0 is Sun

    // Adjust for Monday start: Mon=0, Tue=1, ..., Sun=6
    const adjustedStart = (startingDay + 6) % 7;
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrevMonth = new Date(year, month, 0).getDate();

    const days = [];
    // Prev month days
    for (let i = adjustedStart - 1; i >= 0; i--) {
      days.push({
        num: daysInPrevMonth - i,
        isCurrentMonth: false,
        key: `${year}-${pad(month)}-${pad(daysInPrevMonth - i)}`,
      });
    }
    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({
        num: i,
        isCurrentMonth: true,
        key: `${year}-${pad(month + 1)}-${pad(i)}`,
      });
    }
    // Next month padding up to 35 or 42
    const total = days.length > 35 ? 42 : 35;
    const remaining = total - days.length;
    for (let i = 1; i <= remaining; i++) {
      days.push({
        num: i,
        isCurrentMonth: false,
        key: `${year}-${pad(month + 2)}-${pad(i)}`,
      });
    }
    return days;
  }, [currentMonth]);

  // Filtered entries
  const filteredEntries = useMemo(() => {
    return entries.filter((e) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        if (
          !e.title.toLowerCase().includes(q) &&
          !e.category.toLowerCase().includes(q) &&
          !(e.venue || "").toLowerCase().includes(q)
        ) {
          return false;
        }
      }
      if (e.category === "Hackathons" && !filterHackathons) return false;
      if (e.category === "Cohort Tasks" && !filterCohortTasks) return false;
      if (e.category === "Study Sprints" && !filterStudySprints) return false;
      return true;
    });
  }, [entries, searchQuery, filterHackathons, filterCohortTasks, filterStudySprints]);

  // Handle open modal
  function openAddModal(timeHint?: string) {
    setEditingId(null);
    setForm({
      ...emptyForm,
      start_at: timeHint ? `${selectedDate}T${timeHint}` : `${selectedDate}T10:00`,
      end_at: timeHint ? `${selectedDate}T11:00` : `${selectedDate}T11:30`,
    });
    setShowModal(true);
  }

  function openEditModal(entry: Entry) {
    setEditingId(entry.id);
    setForm({
      title: entry.title,
      description: entry.description || "",
      category: entry.category,
      venue: entry.venue || "Room 4B",
      start_at: toLocalInput(entry.start_at),
      end_at: toLocalInput(entry.end_at),
      all_day: entry.all_day,
      color_theme: entry.color_theme || "lime",
    });
    setShowModal(true);
  }

  // Handle save
  async function handleSaveEvent(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title.trim()) return;

    setSaving(true);
    const newEntry: Entry = {
      id: editingId || Date.now(),
      student_id: studentId,
      title: form.title.trim(),
      description: form.description,
      category: form.category,
      venue: form.venue,
      start_at: new Date(form.start_at).toISOString(),
      end_at: form.end_at ? new Date(form.end_at).toISOString() : null,
      all_day: form.all_day,
      color_theme: form.color_theme,
    };

    try {
      if (editingId) {
        setEntries((prev) => prev.map((item) => (item.id === editingId ? newEntry : item)));
      } else {
        setEntries((prev) => [...prev, newEntry]);
      }

      // Sync with backend if available
      const url = editingId ? `${API}/calendar/${studentId}/${editingId}` : `${API}/calendar/${studentId}`;
      await fetch(url, {
        method: editingId ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newEntry),
      }).catch(() => null);

      setShowModal(false);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  }

  // Handle delete
  async function handleDeleteEvent(id: number) {
    setEntries((prev) => prev.filter((item) => item.id !== id));
    setShowModal(false);
    await fetch(`${API}/calendar/${studentId}/${id}`, { method: "DELETE" }).catch(() => null);
  }

  return (
    <div className="flex flex-col gap-6 py-2 w-full text-slate-800 dark:text-slate-100 selection:bg-[#D3E57A] selection:text-black">
      {/* =========================================================================
          1. TOP CALENDAR CONTROLS & HEADER
          ========================================================================= */}
      <header className="w-full glass-card rounded-3xl p-4 sm:p-5 px-5 sm:px-7 flex flex-wrap items-center justify-between gap-4 shadow-xl">
        {/* Left: Brand / Title & Search Pill */}
        <div className="flex items-center gap-4 sm:gap-6 flex-1 min-w-[280px]">
          <div className="flex items-center gap-3">
            <VybeSymbol size={38} className="shrink-0 drop-shadow-md" />
            <div className="flex flex-col">
              <span className="font-extrabold text-lg sm:text-xl tracking-wider text-[#1E1E22] dark:text-white leading-none">
                CALENDAR
              </span>
              <span className="text-[11px] font-semibold text-gray-500 dark:text-gray-400 mt-1 uppercase tracking-wider flex items-center gap-1.5">
                <span className={`w-2 h-2 rounded-full ${live ? "bg-emerald-400 animate-pulse" : "bg-amber-400"}`} />
                {live ? "Live Sync Active" : "Local Prototype"}
              </span>
            </div>
          </div>

          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search events, deadlines, teams..."
              className="w-full pl-10 pr-12 py-2.5 rounded-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-xs sm:text-sm text-[#1E1E22] dark:text-white placeholder-slate-400 focus:outline-none focus:border-[#D3E57A] focus:bg-black/[0.08] dark:focus:bg-white/10 transition-all"
            />
            <div className="hidden md:flex absolute inset-y-0 right-0 pr-3 items-center">
              <kbd className="px-2 py-0.5 text-[10px] font-semibold text-slate-500 dark:text-slate-400 bg-black/5 dark:bg-white/10 rounded-md border border-black/10 dark:border-white/10">
                ⌘K
              </kbd>
            </div>
          </div>
        </div>

        {/* Right: Actions & Student Profile Badge */}
        <div className="flex items-center gap-3 sm:gap-4 ml-auto">
          {/* Quick Refresh & iCal Export */}
          <button
            onClick={loadCalendar}
            title="Refresh Schedule"
            className="p-2.5 rounded-full bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 border border-black/10 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:text-black dark:hover:text-white transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>

          <a
            href={`${API}/events/calendar/${studentId}/export.ics`}
            download="vybe-schedule.ics"
            title="Export iCalendar (.ics)"
            className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full glass-pill text-xs font-bold text-[#1E1E22] dark:text-[#D3E57A] hover:bg-black/5 dark:hover:bg-white/10 transition-all"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export .ics</span>
          </a>

          <div className="h-7 w-px bg-black/10 dark:bg-white/10 hidden sm:block" />

          {/* Student Profile Pill */}
          <div className="flex items-center gap-2.5 pl-2 pr-3 py-1 rounded-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10">
            <div className="relative">
              <img
                src={user.avatar_url || "/avatars/avatar-1.svg"}
                alt={user.name}
                className="w-8 h-8 rounded-full object-cover ring-2 ring-[#D3E57A]"
              />
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-white dark:ring-[#0D0D12]" />
            </div>
            <div className="hidden sm:flex flex-col text-left">
              <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">Hello,</span>
              <span className="text-xs font-bold text-[#1E1E22] dark:text-white -mt-0.5">{user.name.split(" ")[0]}</span>
            </div>
          </div>
        </div>
      </header>

      {/* =========================================================================
          2. MAIN DASHBOARD CONTAINER (2 COLUMNS: LEFT ASIDE & RIGHT SCHEDULE BOARD)
          ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start w-full">
        {/* =========================================================================
            SECTION A: LEFT CONTROL & AGENDA COLUMN (col-span-12 lg:col-span-4 xl:col-span-3)
            ========================================================================= */}
        <aside className="col-span-12 lg:col-span-4 xl:col-span-3 flex flex-col gap-5">
          <div className="w-full flex gap-3 sm:gap-4">
            {/* Far-Left Vertical Rail */}
            <div className="glass-card rounded-3xl p-2.5 flex flex-col items-center justify-between gap-6 py-4 shadow-lg shrink-0">
              {/* Top View Selector Buttons */}
              <div className="flex flex-col items-center gap-3">
                <button
                  type="button"
                  onClick={() => setViewMode("Month")}
                  className={`w-10 h-10 sm:w-11 sm:h-11 rounded-2xl flex items-center justify-center transition-all ${
                    viewMode === "Month"
                      ? "bg-[#D9C9F5] text-[#1E1B4B] shadow-glow-lilac scale-105 font-bold"
                      : "bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-300 hover:text-black dark:hover:text-white hover:bg-slate-200 dark:hover:bg-white/10"
                  }`}
                  title="Month Matrix View"
                >
                  <LayoutGrid className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode("Week")}
                  className={`w-10 h-10 sm:w-11 sm:h-11 rounded-2xl flex items-center justify-center transition-all ${
                    viewMode === "Week"
                      ? "bg-[#D3E57A] text-[#1A2E05] border border-[#A3B838] dark:border-[#D3E57A] shadow-glow-lime scale-105 font-bold"
                      : "bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-300 hover:text-black dark:hover:text-white hover:bg-slate-200 dark:hover:bg-white/10"
                  }`}
                  title="Week Timetable View"
                >
                  <Calendar className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode("Day")}
                  className={`w-10 h-10 sm:w-11 sm:h-11 rounded-2xl flex items-center justify-center transition-all ${
                    viewMode === "Day"
                      ? "bg-[#FAD8C6] text-[#7C2D12] shadow-glow-peach scale-105 font-bold"
                      : "bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-300 hover:text-black dark:hover:text-white hover:bg-slate-200 dark:hover:bg-white/10"
                  }`}
                  title="Day Agenda View"
                >
                  <BarChart2 className="w-5 h-5" />
                </button>
              </div>

              {/* Avatar Stack for Study Group & Teams */}
              <div className="flex flex-col items-center gap-2.5 my-auto">
                <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest -rotate-90 py-2">
                  Teams
                </span>
                <img
                  src="/avatars/avatar-1.svg"
                  alt="Sarah T."
                  title="Sarah T. (SIH Lead)"
                  className="w-8 h-8 rounded-full ring-2 ring-brand-peach object-cover hover:scale-110 transition-transform cursor-pointer"
                />
                <img
                  src="/avatars/avatar-2.svg"
                  alt="Devon M."
                  title="Devon M. (AI Core)"
                  className="w-8 h-8 rounded-full ring-2 ring-brand-lime object-cover hover:scale-110 transition-transform cursor-pointer"
                />
                <img
                  src="/avatars/avatar-3.svg"
                  alt="Maya K."
                  title="Maya K. (UI/UX)"
                  className="w-8 h-8 rounded-full ring-2 ring-brand-lilac object-cover hover:scale-110 transition-transform cursor-pointer"
                />
                <img
                  src="/avatars/avatar-4.svg"
                  alt="Liam R."
                  title="Liam R. (FastAPI)"
                  className="w-8 h-8 rounded-full ring-2 ring-brand-coral object-cover hover:scale-110 transition-transform cursor-pointer"
                />
                <button
                  type="button"
                  onClick={() => openAddModal()}
                  className="w-8 h-8 rounded-full border border-dashed border-slate-300 dark:border-white/30 text-slate-600 dark:text-slate-300 hover:text-lime-700 dark:hover:text-brand-lime hover:border-lime-500 dark:hover:border-brand-lime flex items-center justify-center transition-colors mt-1"
                  title="Add Cohort Collaborator"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {/* Bottom Quick Help Link */}
              <button
                type="button"
                onClick={() => alert("Calendar Shortcuts: Use [⌘K] to search, [Today] to reset dates.")}
                className="w-10 h-10 rounded-2xl bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400 hover:text-black dark:hover:text-white transition-colors flex items-center justify-center"
                title="Calendar Keyboard Shortcuts & Guide"
              >
                <HelpCircle className="w-5 h-5" />
              </button>
            </div>

            {/* Main Left Cards Stack */}
            <div className="flex-1 flex flex-col gap-4">
              {/* Mini Month Calendar Widget */}
              <div className="glass-card rounded-3xl p-4 sm:p-5 shadow-lg">
                <div className="flex items-center justify-between mb-3.5">
                  <h3 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white">
                    {currentMonth.toLocaleDateString("en-IN", { month: "long", year: "numeric" })}
                  </h3>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => setCurrentMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1))}
                      className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-white/10 text-slate-600 dark:text-slate-400 hover:text-black dark:hover:text-white transition-colors"
                      title="Previous Month"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setCurrentMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1))}
                      className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-white/10 text-slate-600 dark:text-slate-400 hover:text-black dark:hover:text-white transition-colors"
                      title="Next Month"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Weekday Header (Mo - Su) */}
                <div className="grid grid-cols-7 text-center text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-2">
                  <span>Mo</span>
                  <span>Tu</span>
                  <span>We</span>
                  <span>Th</span>
                  <span>Fr</span>
                  <span className="text-orange-600 dark:text-brand-peach/90">Sa</span>
                  <span className="text-orange-600 dark:text-brand-peach/90">Su</span>
                </div>

                {/* 7x5 Date Grid */}
                <div className="grid grid-cols-7 gap-y-1 text-center text-xs font-semibold text-slate-700 dark:text-slate-300">
                  {miniCalendarDays.map((d, idx) => {
                    const isSelected = selectedDate === d.key;
                    // Stitch highlights: Day 20 in lilac and Day 24 in lime
                    const isSpecialLilac = d.num === 20 && d.isCurrentMonth;
                    const isSpecialLime = d.num === 24 && d.isCurrentMonth;

                    return (
                      <button
                        key={`${d.key}-${idx}`}
                        type="button"
                        onClick={() => setSelectedDate(d.key)}
                        className={`py-1 rounded-lg text-xs font-semibold transition-all ${
                          !d.isCurrentMonth ? "text-slate-400 dark:text-slate-600" : ""
                        } ${
                          isSelected
                            ? "bg-slate-900 text-white dark:bg-white dark:text-[#0D0D12] font-black shadow-md scale-105"
                            : isSpecialLilac
                            ? "bg-[#D9C9F5] text-[#1E1B4B] font-black shadow-glow-lilac scale-105"
                            : isSpecialLime
                            ? "bg-[#D3E57A] text-[#1A2E05] font-black shadow-glow-lime scale-105"
                            : d.isCurrentMonth
                            ? "text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/10 cursor-pointer"
                            : ""
                        }`}
                      >
                        {d.num}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Checklist / Active Layer Filters Accordion */}
              <div className="glass-card rounded-3xl p-4 sm:p-5 shadow-lg">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-extrabold text-xs sm:text-sm text-slate-900 dark:text-white">Active Filters</span>
                  <span className="text-[10px] font-bold text-slate-500 dark:text-gray-400 uppercase tracking-wider">Show/Hide</span>
                </div>
                <div className="space-y-2.5">
                  <label className="flex items-center gap-3 text-xs text-slate-700 dark:text-slate-300 hover:text-black dark:hover:text-white cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={filterHackathons}
                      onChange={(e) => setFilterHackathons(e.target.checked)}
                      className="w-4 h-4 rounded-md accent-[#84CC16] bg-slate-100 dark:bg-white/5 border-slate-300 dark:border-white/20"
                    />
                    <span className="font-semibold">Hackathon Deadlines</span>
                    <span className="ml-auto w-2 h-2 rounded-full bg-[#84CC16] dark:bg-brand-lime" />
                  </label>
                  <label className="flex items-center gap-3 text-xs text-slate-700 dark:text-slate-300 hover:text-black dark:hover:text-white cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={filterCohortTasks}
                      onChange={(e) => setFilterCohortTasks(e.target.checked)}
                      className="w-4 h-4 rounded-md accent-[#EA580C] bg-slate-100 dark:bg-white/5 border-slate-300 dark:border-white/20"
                    />
                    <span className="font-semibold">Cohort Tasks</span>
                    <span className="ml-auto w-2 h-2 rounded-full bg-[#EA580C] dark:bg-brand-peach" />
                  </label>
                  <label className="flex items-center gap-3 text-xs text-slate-700 dark:text-slate-300 hover:text-black dark:hover:text-white cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={filterStudySprints}
                      onChange={(e) => setFilterStudySprints(e.target.checked)}
                      className="w-4 h-4 rounded-md accent-[#7C3AED] bg-slate-100 dark:bg-white/5 border-slate-300 dark:border-white/20"
                    />
                    <span className="font-semibold">Study Sprints</span>
                    <span className="ml-auto w-2 h-2 rounded-full bg-[#7C3AED] dark:bg-brand-lilac" />
                  </label>
                </div>
              </div>

              {/* Categories Progress Section */}
              <div className="glass-card rounded-3xl p-4 sm:p-5 shadow-lg">
                <div className="flex items-center justify-between mb-3.5">
                  <span className="font-extrabold text-xs sm:text-sm text-slate-900 dark:text-white">Categories</span>
                  <span className="text-[10px] font-bold text-slate-500 dark:text-gray-400">Weekly Target</span>
                </div>
                <div className="space-y-3.5">
                  {/* Hackathons (Lime) */}
                  <div>
                    <div className="flex justify-between items-center text-xs mb-1.5">
                      <span className="flex items-center gap-2 text-slate-800 dark:text-slate-200 font-semibold">
                        <span className="w-2 h-2 rounded-full bg-[#84CC16] dark:bg-brand-lime" />
                        Hackathons
                      </span>
                      <span className="font-bold text-lime-700 dark:text-brand-lime">78%</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-200 dark:bg-white/10 rounded-full overflow-hidden">
                      <div className="bg-[#84CC16] dark:bg-brand-lime h-full rounded-full shadow-glow-lime transition-all" style={{ width: "78%" }} />
                    </div>
                  </div>
                  {/* Personal Projects (Peach) */}
                  <div>
                    <div className="flex justify-between items-center text-xs mb-1.5">
                      <span className="flex items-center gap-2 text-slate-800 dark:text-slate-200 font-semibold">
                        <span className="w-2 h-2 rounded-full bg-[#EA580C] dark:bg-brand-peach" />
                        Personal Projects
                      </span>
                      <span className="font-bold text-orange-700 dark:text-brand-peach">45%</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-200 dark:bg-white/10 rounded-full overflow-hidden">
                      <div className="bg-[#EA580C] dark:bg-brand-peach h-full rounded-full shadow-glow-peach transition-all" style={{ width: "45%" }} />
                    </div>
                  </div>
                  {/* Academic Prep (Lilac) */}
                  <div>
                    <div className="flex justify-between items-center text-xs mb-1.5">
                      <span className="flex items-center gap-2 text-slate-800 dark:text-slate-200 font-semibold">
                        <span className="w-2 h-2 rounded-full bg-[#7C3AED] dark:bg-brand-lilac" />
                        Academic Prep
                      </span>
                      <span className="font-bold text-purple-700 dark:text-brand-lilac">90%</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-200 dark:bg-white/10 rounded-full overflow-hidden">
                      <div className="bg-[#7C3AED] dark:bg-brand-lilac h-full rounded-full shadow-glow-lilac transition-all" style={{ width: "90%" }} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Upcoming Event Spotlight Card (Bottom of left panel) */}
              {!spotlightDismissed && (
                <div className="relative overflow-hidden glass-card rounded-3xl p-4 sm:p-5 border border-purple-200 dark:border-brand-lilac/30 shadow-sm dark:shadow-glow-lilac">
                  <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full bg-brand-lilac/20 blur-2xl pointer-events-none" />
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-xs font-bold text-slate-600 dark:text-slate-400">12:00 - 13:30</span>
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-orange-100 text-orange-800 border border-orange-200 dark:bg-brand-peach/20 dark:text-brand-peach dark:border-brand-peach/30">
                      <Clock className="w-3 h-3" /> 14 min remaining
                    </span>
                  </div>
                  <h4 className="font-extrabold text-xs sm:text-sm text-slate-900 dark:text-white mb-3 pr-6 leading-snug">
                    Meet Dev Team at Tech Innovation Lab
                  </h4>
                  <div className="flex items-center justify-between pt-1">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setSpotlightDismissed(true)}
                        className="px-3 py-1.5 rounded-full text-xs font-bold glass-pill text-slate-700 dark:text-slate-300 hover:text-black dark:hover:text-white transition-all"
                      >
                        Later
                      </button>
                      <button
                        type="button"
                        onClick={() => openEditModal(INITIAL_TIMETABLE_EVENTS[0])}
                        className="px-3.5 py-1.5 rounded-full text-xs font-black bg-[#D9C9F5] text-[#1E1B4B] shadow-glow-lilac hover:brightness-105 transition-all cursor-pointer"
                      >
                        Details
                      </button>
                    </div>
                    <div className="w-9 h-9 rounded-xl bg-purple-100 dark:bg-white/10 border border-purple-200 dark:border-white/15 flex items-center justify-center text-purple-700 dark:text-brand-lilac">
                      <BookOpen className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </aside>

        {/* =========================================================================
            SECTION B: RIGHT MAIN TIMETABLE & WEEK SCHEDULE BOARD (col-span-12 lg:col-span-8 xl:col-span-9)
            ========================================================================= */}
        <section className="col-span-12 lg:col-span-8 xl:col-span-9 glass-card rounded-3xl p-4 sm:p-6 shadow-2xl flex flex-col gap-5 min-h-[750px]">
          {/* Top Control Strip */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-white/10">
            {/* Left: Month, Year, Today & Chevrons */}
            <div className="flex items-center gap-2.5 sm:gap-3 flex-wrap">
              <h2 className="font-extrabold text-lg sm:text-2xl text-slate-900 dark:text-white tracking-tight">
                January 2026
              </h2>
              <button
                type="button"
                onClick={() => setSelectedDate("2026-01-20")}
                className="px-3 py-1 rounded-full text-xs font-bold glass-pill text-slate-700 dark:text-slate-200 hover:text-black dark:hover:text-white border-slate-200 dark:border-white/10"
              >
                Today
              </button>
              <div className="flex items-center gap-1 bg-slate-100 dark:bg-white/5 p-1 rounded-full border border-slate-200 dark:border-white/10">
                <button
                  type="button"
                  onClick={() => {
                    const d = new Date(selectedDate);
                    d.setDate(d.getDate() - 7);
                    setSelectedDate(dateKey(d));
                  }}
                  className="p-1 rounded-full hover:bg-slate-200 dark:hover:bg-white/10 text-slate-600 dark:text-slate-300 hover:text-black dark:hover:text-white transition-colors"
                  title="Previous Week"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const d = new Date(selectedDate);
                    d.setDate(d.getDate() + 7);
                    setSelectedDate(dateKey(d));
                  }}
                  className="p-1 rounded-full hover:bg-slate-200 dark:hover:bg-white/10 text-slate-600 dark:text-slate-300 hover:text-black dark:hover:text-white transition-colors"
                  title="Next Week"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
              <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-white/10 hidden sm:inline-block">
                GMT+5:30
              </span>
            </div>

            {/* Right: View Switcher & Primary + Add Event CTA */}
            <div className="flex items-center gap-3 flex-wrap">
              {/* Segmented Switcher */}
              <div className="flex items-center p-1 rounded-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => setViewMode("Month")}
                  className={`px-3 py-1.5 rounded-full transition-all cursor-pointer ${
                    viewMode === "Month"
                      ? "bg-[#D3E57A] text-[#1A2E05] font-black shadow-glow-lime"
                      : "text-slate-600 dark:text-slate-300 hover:text-black dark:hover:text-white"
                  }`}
                >
                  Month
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode("Week")}
                  className={`px-3.5 py-1.5 rounded-full transition-all cursor-pointer ${
                    viewMode === "Week"
                      ? "bg-[#D3E57A] text-[#1A2E05] font-black shadow-glow-lime"
                      : "text-slate-600 dark:text-slate-300 hover:text-black dark:hover:text-white"
                  }`}
                >
                  Week
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode("Day")}
                  className={`px-3 py-1.5 rounded-full transition-all cursor-pointer ${
                    viewMode === "Day"
                      ? "bg-[#D3E57A] text-[#1A2E05] font-black shadow-glow-lime"
                      : "text-slate-600 dark:text-slate-300 hover:text-black dark:hover:text-white"
                  }`}
                >
                  Day
                </button>
              </div>

              {/* Add Event CTA */}
              <button
                type="button"
                onClick={() => openAddModal()}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-[#D3E57A] to-[#D9C9F5] text-[#0D0D12] font-black text-xs sm:text-sm shadow-glow-lime hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
              >
                <PlusCircle className="w-4 h-4 text-[#0D0D12]" />
                <span>+ Add Event</span>
              </button>
            </div>
          </div>

          {/* Weekday Strip (Tue 18 to Sun 23) */}
          <div className="grid grid-cols-6 gap-2 sm:gap-3">
            {weekDays.map((wd) => {
              const isSelected = wd.dateStr === selectedDate;
              return (
                <div
                  key={wd.dateStr}
                  onClick={() => setSelectedDate(wd.dateStr)}
                  className={`flex flex-col items-center py-2.5 px-1 rounded-2xl cursor-pointer group transition-all ${
                    isSelected
                      ? "bg-gradient-to-b from-[#84CC16]/20 to-[#84CC16]/5 border-2 border-[#84CC16] dark:border-brand-lime shadow-sm"
                      : "bg-slate-100/80 hover:bg-slate-100 border border-slate-200 dark:bg-white/5 dark:hover:bg-white/10 dark:border-white/10"
                  }`}
                >
                  <span
                    className={`text-[11px] font-extrabold uppercase tracking-wider ${
                      isSelected ? "text-lime-700 dark:text-brand-lime" : "text-slate-500 dark:text-slate-400"
                    }`}
                  >
                    {wd.dayName}
                  </span>
                  <span
                    className={`font-black text-lg sm:text-2xl mt-0.5 group-hover:scale-110 transition-transform ${
                      isSelected ? "text-slate-900 dark:text-white" : "text-slate-800 dark:text-slate-200"
                    }`}
                  >
                    {wd.dayNum}
                  </span>
                  <span
                    className={`w-1.5 h-1.5 rounded-full mt-1 ${
                      isSelected
                        ? "bg-[#84CC16] dark:bg-brand-lime shadow-glow-lime"
                        : wd.dayNum % 2 === 0
                        ? "bg-[#7C3AED] dark:bg-brand-lilac"
                        : "bg-transparent"
                    }`}
                  />
                </div>
              );
            })}
          </div>

          {/* =========================================================================
              VIEW MODE CONDITIONAL DISPLAY (WEEK / MONTH / DAY)
              ========================================================================= */}
          {viewMode === "Week" && (
            /* 2D Timetable Hourly Matrix (Week View) */
            <div className="flex-1 overflow-x-auto overflow-y-auto pr-1">
              <div className="min-w-[650px] flex flex-col gap-4">
                {/* Slot 1: 08:00 AM */}
                <div className="flex gap-4 items-start group">
                  <div className="w-16 text-right shrink-0 pt-1 text-xs font-mono font-bold text-slate-500 dark:text-slate-400">
                    08:00 AM
                  </div>
                  <div className="flex-1 grid grid-cols-3 gap-3 min-h-[90px] border-t border-slate-200 dark:border-white/10 pt-2">
                    {/* Event Card 1 (Lilac Theme) */}
                    <div
                      onClick={() => openEditModal(INITIAL_TIMETABLE_EVENTS[0])}
                      className="p-3.5 rounded-2xl bg-purple-100/95 dark:bg-gradient-to-br dark:from-[#8B5CF6]/30 dark:via-[#7C3AED]/20 dark:to-[#6D28D9]/30 border border-purple-200 dark:border-[#D9C9F5]/40 shadow-sm dark:shadow-glow-lilac hover:-translate-y-1 transition-all cursor-pointer flex flex-col justify-between"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-purple-200/90 dark:bg-white/15 text-purple-950 dark:text-[#D9C9F5] border border-purple-300 dark:border-white/10">
                          08:00 - 08:45
                        </span>
                        <Sparkles className="w-3.5 h-3.5 text-purple-700 dark:text-[#D9C9F5]" />
                      </div>
                      <h5 className="font-extrabold text-xs sm:text-sm mt-1.5 text-purple-950 dark:text-white leading-snug">
                        SIH Hackathon Sprint
                      </h5>
                      <div className="flex items-center justify-between mt-2 pt-1 border-t border-purple-200 dark:border-white/10">
                        <div className="flex -space-x-1.5">
                          <img
                            src="/avatars/avatar-1.svg"
                            alt="u1"
                            className="w-5 h-5 rounded-full ring-1 ring-purple-300 dark:ring-white/30 object-cover"
                          />
                          <img
                            src="/avatars/avatar-2.svg"
                            alt="u2"
                            className="w-5 h-5 rounded-full ring-1 ring-purple-300 dark:ring-white/30 object-cover"
                          />
                        </div>
                        <span className="text-[10px] font-black text-purple-950 dark:text-[#D9C9F5]">Room 4B</span>
                      </div>
                    </div>

                    {/* Event Card 2 (Soft Lime Theme) */}
                    <div
                      onClick={() => openEditModal(INITIAL_TIMETABLE_EVENTS[1])}
                      className="p-3.5 rounded-2xl bg-lime-100/95 dark:bg-gradient-to-br dark:from-[#84CC16]/30 dark:via-[#4D7C0F]/20 dark:to-[#365314]/30 border border-lime-300 dark:border-[#D3E57A]/40 shadow-sm dark:shadow-glow-lime hover:-translate-y-1 transition-all cursor-pointer flex flex-col justify-between"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-lime-200/90 dark:bg-white/15 text-lime-950 dark:text-[#D3E57A] border border-lime-300 dark:border-white/10">
                          08:15 - 09:30
                        </span>
                        <Cpu className="w-3.5 h-3.5 text-lime-800 dark:text-[#D3E57A]" />
                      </div>
                      <h5 className="font-extrabold text-xs sm:text-sm mt-1.5 text-lime-950 dark:text-white leading-snug">
                        AI Agent System Design
                      </h5>
                      <div className="flex items-center justify-between mt-2 pt-1 border-t border-lime-200 dark:border-white/10">
                        <div className="flex -space-x-1.5">
                          <img
                            src="/avatars/avatar-3.svg"
                            alt="u3"
                            className="w-5 h-5 rounded-full ring-1 ring-lime-300 dark:ring-white/30 object-cover"
                          />
                          <span className="w-5 h-5 rounded-full bg-lime-200 dark:bg-white/20 text-[9px] font-black flex items-center justify-center text-lime-950 dark:text-white">
                            +3
                          </span>
                        </div>
                        <span className="text-[10px] font-black text-lime-950 dark:text-[#D3E57A]">Discord Voice</span>
                      </div>
                    </div>

                    {/* Empty Dashed Quick Add Slot */}
                    <button
                      type="button"
                      onClick={() => openAddModal("08:00")}
                      className="rounded-2xl border border-dashed border-slate-300 dark:border-white/20 hover:border-lime-600 dark:hover:border-[#D3E57A]/70 hover:bg-lime-500/10 dark:hover:bg-[#D3E57A]/5 transition-all flex flex-col items-center justify-center gap-1 text-slate-600 dark:text-slate-300 hover:text-lime-800 dark:hover:text-[#D3E57A] group/btn p-3 cursor-pointer"
                    >
                      <div className="w-7 h-7 rounded-full bg-slate-100 dark:bg-white/5 flex items-center justify-center group-hover/btn:bg-[#D3E57A] group-hover/btn:text-[#0D0D12] transition-colors">
                        <Plus className="w-4 h-4" />
                      </div>
                      <span className="text-[11px] font-bold">Quick Slot</span>
                    </button>
                  </div>
                </div>

                {/* Slot 2: 10:00 AM */}
                <div className="flex gap-4 items-start group">
                  <div className="w-16 text-right shrink-0 pt-1 text-xs font-mono font-bold text-slate-500 dark:text-slate-400">
                    10:00 AM
                  </div>
                  <div className="flex-1 grid grid-cols-3 gap-3 min-h-[95px] border-t border-slate-200 dark:border-white/10 pt-2">
                    {/* Peach Theme Card (Span 2 cols) */}
                    <div
                      onClick={() => openEditModal(INITIAL_TIMETABLE_EVENTS[2])}
                      className="col-span-2 p-3.5 rounded-2xl bg-orange-100/95 dark:bg-gradient-to-br dark:from-[#EA580C]/25 dark:via-[#C2410C]/20 dark:to-[#7C2D12]/25 border border-orange-200 dark:border-[#FAD8C6]/40 shadow-sm dark:shadow-glow-peach hover:-translate-y-1 transition-all cursor-pointer flex flex-col justify-between"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-orange-200/90 dark:bg-white/15 text-orange-950 dark:text-[#FAD8C6] border border-orange-300 dark:border-white/10">
                            10:00 - 11:30
                          </span>
                          <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-rose-100 dark:bg-rose-500/25 text-rose-800 dark:text-rose-200 border border-rose-300 dark:border-rose-500/30">
                            Priority Review
                          </span>
                        </div>
                        <Terminal className="w-3.5 h-3.5 text-orange-800 dark:text-[#FAD8C6]" />
                      </div>
                      <h5 className="font-extrabold text-xs sm:text-sm mt-1.5 text-orange-950 dark:text-white leading-snug">
                        FastAPI Core &amp; Database Optimization Review
                      </h5>
                      <div className="flex items-center justify-between mt-2 pt-1 border-t border-orange-200 dark:border-white/10">
                        <div className="flex items-center gap-2">
                          <div className="flex -space-x-1.5">
                            <img
                              src="/avatars/avatar-4.svg"
                              alt="u4"
                              className="w-5 h-5 rounded-full ring-1 ring-orange-300 dark:ring-white/30 object-cover"
                            />
                            <img
                              src="/avatars/avatar-5.svg"
                              alt="u5"
                              className="w-5 h-5 rounded-full ring-1 ring-orange-300 dark:ring-white/30 object-cover"
                            />
                            <img
                              src="/avatars/avatar-6.svg"
                              alt="u6"
                              className="w-5 h-5 rounded-full ring-1 ring-orange-300 dark:ring-white/30 object-cover"
                            />
                          </div>
                          <span className="text-[11px] font-bold text-orange-950 dark:text-slate-200">
                            Akshat + Lead Engineers
                          </span>
                        </div>
                        <span className="text-[10px] font-black text-orange-950 dark:text-[#FAD8C6]">Innovation Pod 02</span>
                      </div>
                    </div>

                    {/* Light Blue / Sky Card */}
                    <div
                      onClick={() => openEditModal(INITIAL_TIMETABLE_EVENTS[3])}
                      className="p-3.5 rounded-2xl bg-sky-100/95 dark:bg-gradient-to-br dark:from-[#0284C7]/30 dark:via-[#0369A1]/20 dark:to-[#0C4A6E]/30 border border-sky-200 dark:border-[#BAE6FD]/40 shadow-sm hover:-translate-y-1 transition-all cursor-pointer flex flex-col justify-between"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-sky-200/90 dark:bg-white/15 text-sky-950 dark:text-[#BAE6FD] border border-sky-300 dark:border-white/10">
                          10:45 - 12:00
                        </span>
                        <Palette className="w-3.5 h-3.5 text-sky-800 dark:text-[#BAE6FD]" />
                      </div>
                      <h5 className="font-extrabold text-xs sm:text-sm mt-1.5 text-sky-950 dark:text-white leading-snug">
                        UI/UX Mentorship Sync
                      </h5>
                      <div className="flex items-center justify-between mt-2 pt-1 border-t border-sky-200 dark:border-white/10">
                        <div className="flex -space-x-1.5">
                          <img
                            src="/avatars/avatar-1.svg"
                            alt="u7"
                            className="w-5 h-5 rounded-full ring-1 ring-sky-300 dark:ring-white/30 object-cover"
                          />
                        </div>
                        <span className="text-[10px] font-black text-sky-950 dark:text-[#BAE6FD]">Google Meet</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Slot 3: 01:00 PM */}
                <div className="flex gap-4 items-start group">
                  <div className="w-16 text-right shrink-0 pt-1 text-xs font-mono font-bold text-slate-500 dark:text-slate-400">
                    01:00 PM
                  </div>
                  <div className="flex-1 grid grid-cols-3 gap-3 min-h-[90px] border-t border-slate-200 dark:border-white/10 pt-2">
                    {/* Empty Add Slot */}
                    <button
                      type="button"
                      onClick={() => openAddModal("13:00")}
                      className="rounded-2xl border border-dashed border-slate-300 dark:border-white/20 hover:border-purple-600 dark:hover:border-[#D9C9F5]/70 hover:bg-purple-500/10 dark:hover:bg-[#D9C9F5]/5 transition-all flex flex-col items-center justify-center gap-1 text-slate-600 dark:text-slate-300 hover:text-purple-800 dark:hover:text-[#D9C9F5] group/btn p-3 cursor-pointer"
                    >
                      <div className="w-7 h-7 rounded-full bg-slate-100 dark:bg-white/5 flex items-center justify-center group-hover/btn:bg-[#D9C9F5] group-hover/btn:text-[#0D0D12] transition-colors">
                        <Plus className="w-4 h-4" />
                      </div>
                      <span className="text-[11px] font-bold">Free Time Slot</span>
                    </button>

                    {/* Coral Theme Card */}
                    <div
                      onClick={() => openEditModal(INITIAL_TIMETABLE_EVENTS[4])}
                      className="col-span-2 p-3.5 rounded-2xl bg-rose-100/95 dark:bg-gradient-to-br dark:from-[#E11D48]/30 dark:via-[#BE123C]/20 dark:to-[#881337]/30 border border-rose-200 dark:border-[#F6C9DD]/40 shadow-sm hover:-translate-y-1 transition-all cursor-pointer flex flex-col justify-between"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-rose-200/90 dark:bg-white/15 text-rose-950 dark:text-[#F6C9DD] border border-rose-300 dark:border-white/10">
                          01:30 - 03:00
                        </span>
                        <Brain className="w-3.5 h-3.5 text-rose-800 dark:text-[#F6C9DD]" />
                      </div>
                      <h5 className="font-extrabold text-xs sm:text-sm mt-1.5 text-rose-950 dark:text-white leading-snug">
                        ML Model Training Session &amp; Hyperparameter Tuning
                      </h5>
                      <div className="flex items-center justify-between mt-2 pt-1 border-t border-rose-200 dark:border-white/10">
                        <div className="flex -space-x-1.5">
                          <img
                            src="/avatars/avatar-2.svg"
                            alt="u8"
                            className="w-5 h-5 rounded-full ring-1 ring-rose-300 dark:ring-white/30 object-cover"
                          />
                          <img
                            src="/avatars/avatar-3.svg"
                            alt="u9"
                            className="w-5 h-5 rounded-full ring-1 ring-rose-300 dark:ring-white/30 object-cover"
                          />
                        </div>
                        <span className="text-[10px] font-black text-rose-950 dark:text-[#F6C9DD]">AWS Cluster GPU-04</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Slot 4: 03:30 PM */}
                <div className="flex gap-4 items-start group">
                  <div className="w-16 text-right shrink-0 pt-1 text-xs font-mono font-bold text-slate-500 dark:text-slate-400">
                    03:30 PM
                  </div>
                  <div className="flex-1 grid grid-cols-3 gap-3 min-h-[90px] border-t border-slate-200 dark:border-white/10 pt-2">
                    {/* Soft Lime Theme Card */}
                    <div
                      onClick={() => openEditModal(INITIAL_TIMETABLE_EVENTS[5])}
                      className="col-span-2 p-3.5 rounded-2xl bg-lime-100/95 dark:bg-gradient-to-br dark:from-[#84CC16]/30 dark:via-[#4D7C0F]/20 dark:to-[#365314]/30 border border-lime-300 dark:border-[#D3E57A]/40 shadow-sm dark:shadow-glow-lime hover:-translate-y-1 transition-all cursor-pointer flex flex-col justify-between"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-lime-200/90 dark:bg-white/15 text-lime-950 dark:text-[#D3E57A] border border-lime-300 dark:border-white/10">
                          03:30 - 05:00
                        </span>
                        <Users className="w-3.5 h-3.5 text-lime-800 dark:text-[#D3E57A]" />
                      </div>
                      <h5 className="font-extrabold text-xs sm:text-sm mt-1.5 text-lime-950 dark:text-white leading-snug">
                        Founders Cohort Demo Day Dry Run
                      </h5>
                      <div className="flex items-center justify-between mt-2 pt-1 border-t border-lime-200 dark:border-white/10">
                        <div className="flex -space-x-1.5">
                          <img
                            src="/avatars/avatar-4.svg"
                            alt="u10"
                            className="w-5 h-5 rounded-full ring-1 ring-lime-300 dark:ring-white/30 object-cover"
                          />
                          <img
                            src="/avatars/avatar-5.svg"
                            alt="u11"
                            className="w-5 h-5 rounded-full ring-1 ring-lime-300 dark:ring-white/30 object-cover"
                          />
                          <span className="w-5 h-5 rounded-full bg-lime-200 dark:bg-white/20 text-[9px] font-black flex items-center justify-center text-lime-950 dark:text-white">
                            +5
                          </span>
                        </div>
                        <span className="text-[10px] font-black text-lime-950 dark:text-[#D3E57A]">Main Auditorium &amp; Zoom</span>
                      </div>
                    </div>

                    {/* Empty Add Slot */}
                    <button
                      type="button"
                      onClick={() => openAddModal("15:30")}
                      className="rounded-2xl border border-dashed border-slate-300 dark:border-white/20 hover:border-orange-500 dark:hover:border-[#FAD8C6]/70 hover:bg-orange-500/10 dark:hover:bg-[#FAD8C6]/5 transition-all flex flex-col items-center justify-center gap-1 text-slate-600 dark:text-slate-300 hover:text-orange-800 dark:hover:text-[#FAD8C6] group/btn p-3 cursor-pointer"
                    >
                      <div className="w-7 h-7 rounded-full bg-slate-100 dark:bg-white/5 flex items-center justify-center group-hover/btn:bg-[#FAD8C6] group-hover/btn:text-[#0D0D12] transition-colors">
                        <Plus className="w-4 h-4" />
                      </div>
                      <span className="text-[11px] font-bold">Add Session</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {viewMode === "Month" && (
            /* Month View Matrix */
            <div className="flex flex-col gap-3">
              <div className="grid grid-cols-7 text-center text-xs font-bold text-slate-500 dark:text-gray-400 py-1 border-b border-slate-200 dark:border-white/10">
                <span>Mon</span>
                <span>Tue</span>
                <span>Wed</span>
                <span>Thu</span>
                <span>Fri</span>
                <span className="text-orange-600 dark:text-brand-peach">Sat</span>
                <span className="text-orange-600 dark:text-brand-peach">Sun</span>
              </div>
              <div className="grid grid-cols-7 gap-2">
                {miniCalendarDays.slice(0, 35).map((d, idx) => {
                  const dayEvents = filteredEntries.filter(
                    (e) => e.start_at.slice(0, 10) === d.key
                  );
                  const isSelected = selectedDate === d.key;

                  return (
                    <div
                      key={idx}
                      onClick={() => {
                        setSelectedDate(d.key);
                        setViewMode("Week");
                      }}
                      className={`min-h-[90px] p-2 rounded-2xl border flex flex-col justify-between cursor-pointer transition-all ${
                        isSelected
                          ? "bg-brand-lime/15 border-[#84CC16] dark:border-brand-lime shadow-sm"
                          : d.isCurrentMonth
                          ? "bg-slate-50/80 dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 border-slate-200 dark:border-white/10"
                          : "bg-slate-50/40 dark:bg-white/[0.02] border-slate-200/50 dark:border-white/5 opacity-50"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-900 dark:text-white">{d.num}</span>
                        {dayEvents.length > 0 && (
                          <span className="w-2 h-2 rounded-full bg-[#84CC16] dark:bg-brand-lime shadow-glow-lime" />
                        )}
                      </div>
                      <div className="space-y-1 mt-1">
                        {dayEvents.slice(0, 2).map((ev) => (
                          <div
                            key={ev.id}
                            className="truncate text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-200 dark:bg-black/40 text-slate-900 dark:text-slate-200 border border-slate-300 dark:border-white/10"
                          >
                            {ev.title}
                          </div>
                        ))}
                        {dayEvents.length > 2 && (
                          <span className="text-[9px] text-lime-700 dark:text-brand-lime font-bold">
                            +{dayEvents.length - 2} more
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {viewMode === "Day" && (
            /* Day View Agenda */
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between py-2 border-b border-slate-200 dark:border-white/10">
                <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                  Agenda for {new Date(selectedDate).toLocaleDateString("en-IN", { weekday: "long", month: "short", day: "numeric", year: "numeric" })}
                </h3>
                <button
                  type="button"
                  onClick={() => openAddModal()}
                  className="px-3.5 py-1.5 rounded-full text-xs font-black bg-[#D3E57A] text-[#1A2E05] shadow-glow-lime hover:scale-105 transition-all"
                >
                  + Add Event
                </button>
              </div>

              <div className="space-y-3">
                {filteredEntries.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => openEditModal(item)}
                    className="p-4 rounded-2xl bg-slate-50/80 hover:bg-slate-100 dark:bg-white/5 dark:hover:bg-white/10 border border-slate-200 dark:border-white/10 cursor-pointer flex items-center justify-between transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-brand-lilac/20 text-purple-700 dark:text-brand-lilac border border-purple-200 dark:border-brand-lilac/30 flex items-center justify-center font-bold">
                        <Calendar className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">{item.title}</h4>
                        <p className="text-xs text-slate-500 dark:text-gray-400 mt-0.5 flex items-center gap-2">
                          <span>{item.start_at.slice(11, 16)} - {item.end_at ? item.end_at.slice(11, 16) : "Flexible"}</span>
                          <span>•</span>
                          <span className="text-lime-700 dark:text-brand-lime font-bold">{item.venue || "Campus"}</span>
                        </p>
                      </div>
                    </div>
                    <span className="text-xs px-2.5 py-1 rounded-full font-bold bg-slate-200 dark:bg-white/10 text-slate-800 dark:text-slate-200">
                      {item.category}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>
      </div>

      {/* =========================================================================
          3. EVENT EDIT / ADD MODAL
          ========================================================================= */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-200">
          <div className="w-full max-w-md glass-card rounded-3xl p-6 border border-slate-200 dark:border-white/20 shadow-2xl flex flex-col gap-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-white/10">
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                {editingId ? "Edit Event / Session" : "Schedule New Event"}
              </h3>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="p-1 rounded-full text-slate-500 hover:text-black dark:text-gray-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEvent} className="flex flex-col gap-4 text-xs">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-gray-400 mb-1">
                  Event Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. SIH Hackathon Sprint"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-300 dark:border-white/10 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-gray-500 focus:outline-none focus:border-[#84CC16]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-gray-400 mb-1">
                    Category
                  </label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-100 dark:bg-[#1C1C22] border border-slate-300 dark:border-white/10 text-slate-900 dark:text-white outline-none cursor-pointer"
                  >
                    <option value="Hackathons">Hackathons</option>
                    <option value="Cohort Tasks">Cohort Tasks</option>
                    <option value="Study Sprints">Study Sprints</option>
                    <option value="Academic Prep">Academic Prep</option>
                    <option value="Personal Projects">Personal Projects</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-gray-400 mb-1">
                    Venue / Channel
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Room 4B / Meet"
                    value={form.venue}
                    onChange={(e) => setForm({ ...form, venue: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-300 dark:border-white/10 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-gray-500 focus:outline-none focus:border-[#84CC16]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-gray-400 mb-1">
                    Start Time
                  </label>
                  <input
                    type="datetime-local"
                    required
                    value={form.start_at}
                    onChange={(e) => setForm({ ...form, start_at: e.target.value })}
                    className="w-full px-2.5 py-2 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-300 dark:border-white/10 text-slate-900 dark:text-white outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-gray-400 mb-1">
                    End Time
                  </label>
                  <input
                    type="datetime-local"
                    value={form.end_at}
                    onChange={(e) => setForm({ ...form, end_at: e.target.value })}
                    className="w-full px-2.5 py-2 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-300 dark:border-white/10 text-slate-900 dark:text-white outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-gray-400 mb-1">
                  Description / Milestone Goal
                </label>
                <textarea
                  rows={2}
                  placeholder="Notes, agenda, or link..."
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-300 dark:border-white/10 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-gray-500 focus:outline-none focus:border-[#84CC16] resize-none"
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                {editingId ? (
                  <button
                    type="button"
                    onClick={() => handleDeleteEvent(editingId)}
                    className="px-3 py-2 rounded-xl text-xs font-bold text-rose-500 hover:bg-rose-500/10 transition-colors flex items-center gap-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete</span>
                  </button>
                ) : (
                  <div />
                )}

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 rounded-full text-xs font-bold glass-pill text-slate-700 dark:text-gray-300 hover:text-black dark:hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-5 py-2 rounded-full text-xs font-black bg-[#D3E57A] text-[#1A2E05] shadow-glow-lime hover:brightness-105 transition-all"
                  >
                    {saving ? "Saving..." : editingId ? "Update Event" : "Create Event"}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
