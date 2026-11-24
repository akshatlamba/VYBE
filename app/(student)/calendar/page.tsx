"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  CalendarDays, ChevronLeft, ChevronRight, Plus, Clock,
  BookOpen, GraduationCap, BriefcaseBusiness, User, Trash2,
  Pencil, X, RefreshCw, Download, Sparkles
} from "lucide-react";
import { useAuth } from "@/lib/auth/auth-context";

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
  reminder_enabled: boolean;
  reminder_minutes_before: number;
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

const categories = [
  { name: "Study", color: "bg-blue-500" },
  { name: "Assignment", color: "bg-violet-500" },
  { name: "Exam", color: "bg-rose-500" },
  { name: "Personal", color: "bg-amber-500" },
  { name: "Other", color: "bg-emerald-500" },
];

const pad = (n: number) => String(n).padStart(2, "0");

function dateKey(date: Date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

function toLocalInput(value?: string | null) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function sameDay(a: string, b: string) {
  return dateKey(new Date(a)) === b;
}

function formatTime(value: string) {
  return new Date(value).toLocaleTimeString("en-IN", {
    hour: "numeric",
    minute: "2-digit",
  });
}

function categoryColor(category: string) {
  return categories.find((item) => item.name === category)?.color || "bg-slate-500";
}

const emptyForm = {
  title: "",
  description: "",
  category: "Study",
  start_at: "",
  end_at: "",
  all_day: false,
  reminder_enabled: false,
  reminder_minutes_before: 30,
};

export default function CalendarPage() {
  const { user } = useAuth();
  const studentId = user.id || 1;

  const [month, setMonth] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });
  const [selectedDate, setSelectedDate] = useState(dateKey(new Date()));
  const [entries, setEntries] = useState<Entry[]>([]);
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [live, setLive] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [filter, setFilter] = useState("All");

  const loadCalendar = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const [entryResponse, eventResponse] = await Promise.all([
        fetch(`${API}/calendar/${studentId}`, { cache: "no-store" }),
        fetch(`${API}/events/calendar/${studentId}`, { cache: "no-store" }),
      ]);

      if (!entryResponse.ok) {
        throw new Error(`Personal calendar API returned ${entryResponse.status}.`);
      }

      const personalData = await entryResponse.json();
      setEntries(Array.isArray(personalData) ? personalData : []);

      if (eventResponse.ok) {
        const eventData = await eventResponse.json();
        setOpportunities(Array.isArray(eventData) ? eventData : []);
      } else {
        setOpportunities([]);
      }

      setLive(true);
    } catch (err) {
      setLive(false);
      setError(
        err instanceof Error
          ? err.message
          : "Could not connect to the calendar backend."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCalendar();
  }, [loadCalendar]);

  const calendarDays = useMemo(() => {
    const first = new Date(month.getFullYear(), month.getMonth(), 1);
    const start = new Date(first);
    start.setDate(first.getDate() - first.getDay());

    return Array.from({ length: 42 }, (_, index) => {
      const day = new Date(start);
      day.setDate(start.getDate() + index);
      return day;
    });
  }, [month]);

  const selectedEntries = entries
    .filter((entry) => sameDay(entry.start_at, selectedDate))
    .filter((entry) => filter === "All" || entry.category === filter)
    .sort((a, b) => a.start_at.localeCompare(b.start_at));

  const selectedOpportunities = opportunities
    .filter((event) => sameDay(event.start_at, selectedDate))
    .sort((a, b) => a.start_at.localeCompare(b.start_at));

  function openNewForm() {
    setEditingId(null);
    setForm({
      ...emptyForm,
      start_at: `${selectedDate}T09:00`,
      end_at: `${selectedDate}T10:00`,
    });
    setShowForm(true);
  }

  function openEditForm(entry: Entry) {
    setEditingId(entry.id);
    setForm({
      title: entry.title,
      description: entry.description || "",
      category: entry.category,
      start_at: toLocalInput(entry.start_at),
      end_at: toLocalInput(entry.end_at),
      all_day: entry.all_day,
      reminder_enabled: entry.reminder_enabled,
      reminder_minutes_before: entry.reminder_minutes_before,
    });
    setShowForm(true);
  }

  async function saveEntry(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title.trim() || !form.start_at) return;

    setSaving(true);
    setError("");

    try {
      const payload = {
        ...form,
        title: form.title.trim(),
        start_at: new Date(form.start_at).toISOString(),
        end_at: form.end_at ? new Date(form.end_at).toISOString() : null,
      };

      const url = editingId
        ? `${API}/calendar/${studentId}/${editingId}`
        : `${API}/calendar/${studentId}`;

      const response = await fetch(url, {
        method: editingId ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        throw new Error(body.detail || `Save failed (${response.status}).`);
      }

      setShowForm(false);
      await loadCalendar();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save this event.");
    } finally {
      setSaving(false);
    }
  }

  async function deleteEntry(id: number) {
    if (!window.confirm("Delete this calendar event?")) return;

    try {
      const response = await fetch(`${API}/calendar/${studentId}/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Could not delete this event.");
      await loadCalendar();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Delete failed.");
    }
  }

  function changeMonth(offset: number) {
    setMonth((current) => new Date(current.getFullYear(), current.getMonth() + offset, 1));
  }

  function goToday() {
    const today = new Date();
    setMonth(new Date(today.getFullYear(), today.getMonth(), 1));
    setSelectedDate(dateKey(today));
  }

  const monthLabel = month.toLocaleDateString("en-IN", {
    month: "long",
    year: "numeric",
  });

  return (
    <div className="flex flex-col gap-6 py-2">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#D3E57A]/30 text-[#1E1E22] dark:text-[#D3E57A] text-caption font-bold mb-2">
            <CalendarDays className="w-3.5 h-3.5" />
            YOUR SCHEDULE
          </div>
          <h1 className="text-display font-light tracking-tight text-[#1E1E22] dark:text-white leading-tight">
            Personal <span className="font-normal">Calendar</span>
          </h1>
          <p className="text-small text-[#6B7280] dark:text-gray-400 mt-1">
            Your classes, deadlines, study plans and saved opportunities in one place.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button onClick={loadCalendar} className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-black/10 dark:border-white/10 text-caption font-semibold hover:bg-black/5 dark:hover:bg-white/10">
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </button>
          <button onClick={openNewForm} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#D3E57A] text-[#1E1E22] text-caption font-bold hover:brightness-95">
            <Plus className="w-4 h-4" />
            Add event
          </button>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-black/5 dark:border-white/10 bg-white/60 dark:bg-white/[0.04] px-4 py-3">
        <div className="flex items-center gap-2 text-caption">
          <span className={`w-2.5 h-2.5 rounded-full ${live ? "bg-emerald-500" : "bg-amber-500"}`} />
          <span className="text-[#6B7280] dark:text-gray-300">
            {live ? "Connected to VYBE Calendar" : "Calendar connection needs attention"}
          </span>
        </div>
        <a
          href={`${API}/events/calendar/${studentId}/export.ics`}
          className="inline-flex items-center gap-1.5 text-caption font-semibold text-[#667A26] dark:text-[#D3E57A]"
        >
          <Download className="w-3.5 h-3.5" />
          Export Radar events (.ics)
        </a>
      </div>

      {error && (
        <div className="rounded-2xl border border-rose-300/50 bg-rose-50 dark:bg-rose-950/20 px-4 py-3 text-sm text-rose-700 dark:text-rose-300">
          {error}
          <p className="text-xs mt-1 opacity-80">
            Your existing data has not been replaced. Check that the backend and calendar database table are ready.
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-[1.5fr_0.8fr] gap-5">
        <section className="rounded-[28px] border border-black/5 dark:border-white/10 bg-white/75 dark:bg-white/[0.045] p-4 sm:p-6 shadow-sm">
          <div className="flex items-center justify-between gap-3 mb-6">
            <div>
              <h2 className="text-xl font-semibold text-[#1E1E22] dark:text-white">{monthLabel}</h2>
              <p className="text-xs text-gray-500 mt-1">Select a date to view your schedule</p>
            </div>
            <div className="flex items-center gap-1">
              <button onClick={goToday} className="px-3 py-2 rounded-full text-xs font-semibold border border-black/10 dark:border-white/10">Today</button>
              <button onClick={() => changeMonth(-1)} aria-label="Previous month" className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10"><ChevronLeft className="w-5 h-5" /></button>
              <button onClick={() => changeMonth(1)} aria-label="Next month" className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10"><ChevronRight className="w-5 h-5" /></button>
            </div>
          </div>

          <div className="grid grid-cols-7 mb-2">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div key={day} className="text-center text-[11px] font-bold uppercase tracking-wide text-gray-400 py-2">{day}</div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {calendarDays.map((day) => {
              const key = dateKey(day);
              const inMonth = day.getMonth() === month.getMonth();
              const isSelected = key === selectedDate;
              const isToday = key === dateKey(new Date());
              const personalCount = entries.filter((entry) => sameDay(entry.start_at, key)).length;
              const opportunityCount = opportunities.filter((event) => sameDay(event.start_at, key)).length;

              return (
                <button
                  key={key}
                  onClick={() => setSelectedDate(key)}
                  className={`min-h-[65px] sm:min-h-[82px] rounded-xl sm:rounded-2xl flex flex-col items-center justify-start pt-2 gap-1 transition-all border ${
                    isSelected
                      ? "bg-[#D3E57A]/35 border-[#A8BD4D] dark:bg-[#D3E57A]/15"
                      : "border-transparent hover:bg-black/[0.035] dark:hover:bg-white/[0.06]"
                  } ${!inMonth ? "opacity-30" : ""}`}
                >
                  <span className={`w-7 h-7 flex items-center justify-center rounded-full text-xs font-semibold ${
                    isToday ? "bg-[#1E1E22] text-white dark:bg-white dark:text-black" :
                    isSelected ? "text-[#1E1E22] dark:text-[#D3E57A]" :
                    "text-[#333] dark:text-gray-200"
                  }`}>{day.getDate()}</span>
                  <span className="flex items-center gap-1">
                    {personalCount > 0 && <span className="w-1.5 h-1.5 rounded-full bg-[#A3B84B]" />}
                    {opportunityCount > 0 && <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />}
                  </span>
                  {(personalCount + opportunityCount) > 0 && (
                    <span className="text-[9px] text-gray-400">{personalCount + opportunityCount} items</span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="flex flex-wrap gap-4 mt-5 pt-4 border-t border-black/5 dark:border-white/10 text-xs text-gray-500">
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#A3B84B]" /> Personal events</span>
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-blue-500" /> Radar opportunities</span>
          </div>
        </section>

        <section className="rounded-[28px] border border-black/5 dark:border-white/10 bg-white/75 dark:bg-white/[0.045] p-4 sm:p-5 shadow-sm">
          <div className="flex items-start justify-between gap-3 mb-4">
            <div>
              <p className="text-[10px] font-bold tracking-[0.15em] text-gray-400 uppercase">Daily agenda</p>
              <h2 className="text-lg font-semibold text-[#1E1E22] dark:text-white mt-1">
                {new Date(`${selectedDate}T12:00:00`).toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" })}
              </h2>
            </div>
            <button onClick={openNewForm} aria-label="Add event" className="p-2 rounded-xl bg-[#D3E57A]/40 text-[#52651D] dark:text-[#D3E57A]"><Plus className="w-5 h-5" /></button>
          </div>

          <div className="flex flex-wrap gap-1.5 mb-4">
            {["All", ...categories.map((item) => item.name)].map((item) => (
              <button key={item} onClick={() => setFilter(item)} className={`px-2.5 py-1.5 rounded-full text-[10px] font-semibold ${filter === item ? "bg-[#1E1E22] text-white dark:bg-white dark:text-black" : "bg-black/5 dark:bg-white/10 text-gray-500"}`}>
                {item}
              </button>
            ))}
          </div>

          <div className="space-y-3 max-h-[520px] overflow-y-auto pr-1">
            {selectedEntries.map((entry) => (
              <div key={`personal-${entry.id}`} className="rounded-2xl border border-black/5 dark:border-white/10 p-3">
                <div className="flex items-start gap-3">
                  <div className={`w-1 self-stretch min-h-12 rounded-full ${categoryColor(entry.category)}`} />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5 text-[10px] text-gray-400 mb-1">
                      <Clock className="w-3 h-3" />
                      {entry.all_day ? "All day" : formatTime(entry.start_at)}
                      {entry.end_at && !entry.all_day ? ` – ${formatTime(entry.end_at)}` : ""}
                    </div>
                    <h3 className="text-sm font-semibold text-[#1E1E22] dark:text-white break-words">{entry.title}</h3>
                    <p className="text-[10px] text-gray-400 mt-1">{entry.category}</p>
                    {entry.description && <p className="text-xs text-gray-500 mt-2 whitespace-pre-wrap">{entry.description}</p>}
                    <div className="flex gap-2 mt-3">
                      <button onClick={() => openEditForm(entry)} className="inline-flex items-center gap-1 text-[10px] font-semibold text-gray-500"><Pencil className="w-3 h-3" /> Edit</button>
                      <button onClick={() => deleteEntry(entry.id)} className="inline-flex items-center gap-1 text-[10px] font-semibold text-rose-500"><Trash2 className="w-3 h-3" /> Delete</button>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {selectedOpportunities.map((event) => (
              <div key={`opportunity-${event.id}`} className="rounded-2xl border border-blue-200/60 dark:border-blue-400/20 bg-blue-50/50 dark:bg-blue-950/10 p-3">
                <div className="flex items-center gap-1.5 text-[10px] text-blue-600 dark:text-blue-300 mb-1">
                  <Sparkles className="w-3 h-3" /> RADAR OPPORTUNITY
                </div>
                <h3 className="text-sm font-semibold text-[#1E1E22] dark:text-white">{event.title}</h3>
                <p className="text-[10px] text-gray-500 mt-1">{formatTime(event.start_at)}{event.venue ? ` · ${event.venue}` : ""}</p>
              </div>
            ))}

            {!loading && selectedEntries.length === 0 && selectedOpportunities.length === 0 && (
              <div className="py-12 text-center">
                <CalendarDays className="w-8 h-8 mx-auto text-gray-300 mb-3" />
                <p className="text-sm font-semibold text-gray-500">Nothing scheduled yet</p>
                <p className="text-xs text-gray-400 mt-1">Add a task, class or deadline to this day.</p>
                <button onClick={openNewForm} className="mt-4 text-xs font-bold text-[#667A26] dark:text-[#D3E57A]">+ Add your first event</button>
              </div>
            )}
          </div>
        </section>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Personal events", value: entries.length, icon: CalendarDays },
          { label: "Study plans", value: entries.filter((e) => e.category === "Study").length, icon: BookOpen },
          { label: "Exams", value: entries.filter((e) => e.category === "Exam").length, icon: GraduationCap },
          { label: "Radar events", value: opportunities.length, icon: BriefcaseBusiness },
        ].map((stat) => (
          <div key={stat.label} className="rounded-2xl border border-black/5 dark:border-white/10 bg-white/60 dark:bg-white/[0.04] p-4">
            <stat.icon className="w-4 h-4 text-gray-400 mb-3" />
            <p className="text-2xl font-semibold text-[#1E1E22] dark:text-white">{stat.value}</p>
            <p className="text-[10px] text-gray-500 mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {showForm && (
        <div className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4" onMouseDown={(e) => { if (e.target === e.currentTarget) setShowForm(false); }}>
          <form onSubmit={saveEntry} className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-[28px] bg-white dark:bg-[#191A1D] border border-black/10 dark:border-white/10 p-5 sm:p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-5">
              <div>
                <p className="text-[10px] font-bold tracking-widest text-gray-400 uppercase">Personal calendar</p>
                <h2 className="text-xl font-semibold text-[#1E1E22] dark:text-white mt-1">{editingId ? "Edit event" : "Create an event"}</h2>
              </div>
              <button type="button" onClick={() => setShowForm(false)} className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10"><X className="w-5 h-5" /></button>
            </div>

            <div className="space-y-4">
              <label className="block">
                <span className="text-xs font-semibold text-gray-500">Event title *</span>
                <input required minLength={2} maxLength={200} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="e.g. Data Structures assignment" className="mt-1 w-full rounded-xl border border-black/10 dark:border-white/10 bg-black/[0.02] dark:bg-white/[0.05] px-3 py-3 text-sm outline-none focus:ring-2 focus:ring-[#D3E57A]" />
              </label>

              <label className="block">
                <span className="text-xs font-semibold text-gray-500">Category</span>
                <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="mt-1 w-full rounded-xl border border-black/10 dark:border-white/10 bg-white dark:bg-[#25262A] px-3 py-3 text-sm">
                  {categories.map((item) => <option key={item.name}>{item.name}</option>)}
                </select>
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <label className="block">
                  <span className="text-xs font-semibold text-gray-500">Start *</span>
                  <input required type="datetime-local" value={form.start_at} onChange={(e) => setForm({ ...form, start_at: e.target.value })} className="mt-1 w-full min-w-0 rounded-xl border border-black/10 dark:border-white/10 bg-white dark:bg-[#25262A] px-2 py-3 text-xs" />
                </label>
                <label className="block">
                  <span className="text-xs font-semibold text-gray-500">End</span>
                  <input type="datetime-local" value={form.end_at} onChange={(e) => setForm({ ...form, end_at: e.target.value })} className="mt-1 w-full min-w-0 rounded-xl border border-black/10 dark:border-white/10 bg-white dark:bg-[#25262A] px-2 py-3 text-xs" />
                </label>
              </div>

              <label className="block">
                <span className="text-xs font-semibold text-gray-500">Description</span>
                <textarea rows={3} maxLength={5000} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Add notes or details..." className="mt-1 w-full rounded-xl border border-black/10 dark:border-white/10 bg-black/[0.02] dark:bg-white/[0.05] px-3 py-3 text-sm outline-none" />
              </label>

              <label className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-300">
                <input type="checkbox" checked={form.all_day} onChange={(e) => setForm({ ...form, all_day: e.target.checked })} />
                All-day event
              </label>

              <div className="rounded-xl bg-black/[0.03] dark:bg-white/[0.04] p-3 space-y-3">
                <label className="flex items-center gap-2 text-xs font-semibold text-gray-600 dark:text-gray-300">
                  <input type="checkbox" checked={form.reminder_enabled} onChange={(e) => setForm({ ...form, reminder_enabled: e.target.checked })} />
                  Set a reminder preference
                </label>
                {form.reminder_enabled && (
                  <select value={form.reminder_minutes_before} onChange={(e) => setForm({ ...form, reminder_minutes_before: Number(e.target.value) })} className="w-full rounded-xl border border-black/10 dark:border-white/10 bg-white dark:bg-[#25262A] px-3 py-2 text-xs">
                    <option value={0}>At event time</option>
                    <option value={10}>10 minutes before</option>
                    <option value={30}>30 minutes before</option>
                    <option value={60}>1 hour before</option>
                    <option value={1440}>1 day before</option>
                  </select>
                )}
                <p className="text-[10px] text-gray-400">Reminder preferences are saved. Automatic delivery for personal calendar reminders is not connected yet.</p>
              </div>
            </div>

            <div className="flex gap-2 mt-6">
              <button type="button" onClick={() => setShowForm(false)} className="flex-1 rounded-full border border-black/10 dark:border-white/10 py-3 text-sm font-semibold">Cancel</button>
              <button disabled={saving} type="submit" className="flex-1 rounded-full bg-[#D3E57A] text-[#1E1E22] py-3 text-sm font-bold disabled:opacity-50">{saving ? "Saving..." : editingId ? "Save changes" : "Create event"}</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
