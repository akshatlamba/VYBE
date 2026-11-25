"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  X,
  Sparkles,
  ExternalLink,
  Bookmark,
  BookmarkCheck,
  CheckCircle2,
  CalendarDays,
  MapPin,
  Building2,
  School,
  Rocket,
  Plus,
  ArrowRight,
  TrendingUp,
} from "lucide-react";
import { GlobeMarker } from "@/lib/data/world-graph-data";

interface MarkerDetailModalProps {
  marker: GlobeMarker | null;
  onClose: () => void;
  onSave?: (markerId: string) => void;
  isSaved?: boolean;
}

export function MarkerDetailModal({
  marker,
  onClose,
  onSave,
  isSaved = false,
}: MarkerDetailModalProps) {
  const [taskAdded, setTaskAdded] = useState(false);
  const [savedLocal, setSavedLocal] = useState(isSaved);

  if (!marker) return null;

  const handleAddTask = () => {
    try {
      const existing = localStorage.getItem("vybe-tracker-tasks");
      const tasks = existing ? JSON.parse(existing) : [];
      tasks.push({
        id: `task-${Date.now()}`,
        title: marker.studentAction,
        category: marker.category,
        source: `World Graph: ${marker.title}`,
        status: "todo",
        created_at: new Date().toISOString(),
      });
      localStorage.setItem("vybe-tracker-tasks", JSON.stringify(tasks));
      setTaskAdded(true);
    } catch {
      setTaskAdded(true);
    }
  };

  const handleToggleSave = () => {
    setSavedLocal(!savedLocal);
    if (onSave) onSave(marker.id);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 dark:bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
    >
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-[28px] border border-black/10 bg-white text-[#1E1E22] shadow-2xl p-6 sm:p-8 flex flex-col gap-6 dark:border-white/20 dark:bg-[#121324] dark:text-white">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 z-20 flex h-9 w-9 items-center justify-center rounded-full border border-black/10 bg-black/5 text-gray-700 transition hover:bg-black/10 hover:text-black dark:border-white/10 dark:bg-white/10 dark:text-gray-200 dark:hover:bg-white/20 dark:hover:text-white"
          aria-label="Close modal"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Header: Category, Location, Match */}
        <div className="pr-10">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span
              className="rounded-full px-3 py-1 text-xs font-black uppercase tracking-wider"
              style={{ backgroundColor: `${marker.color}25`, color: marker.color }}
            >
              {marker.category}
            </span>
            <span className="flex items-center gap-1 text-xs font-semibold text-gray-600 bg-black/5 px-2.5 py-1 rounded-full border border-black/10 dark:text-gray-400 dark:bg-white/5 dark:border-white/10">
              <MapPin className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
              {marker.location}
            </span>
            <span className="flex items-center gap-1 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-700 border border-emerald-500/20 dark:bg-emerald-500/15 dark:text-emerald-400">
              <Sparkles className="h-3.5 w-3.5" />
              {marker.relevanceScore}% Relevance Match
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-[#1E1E22] dark:text-white leading-tight">
            {marker.title}
          </h2>

          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
            {marker.headline}
          </p>
        </div>

        {/* 1. What Happened */}
        <div className="rounded-2xl border border-black/10 bg-black/[0.02] p-4 sm:p-5 dark:border-white/10 dark:bg-white/[0.03]">
          <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 mb-2">
            1. What Happened
          </h3>
          <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
            {marker.summary}
          </p>
          <div className="mt-3 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 pt-2 border-t border-black/5 dark:border-white/5">
            <span>Source: <strong className="text-[#1E1E22] dark:text-white">{marker.sourceName}</strong></span>
            {marker.sourceUrl && (
              <a
                href={marker.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-indigo-600 hover:underline dark:text-indigo-400"
              >
                Visit official release
                <ExternalLink className="h-3 w-3" />
              </a>
            )}
          </div>
        </div>

        {/* 2. Why It Matters to You (Student Differentiator) */}
        <div className="rounded-2xl border border-emerald-500/30 bg-emerald-50/70 p-4 sm:p-5 dark:border-emerald-500/25 dark:bg-emerald-950/20">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="h-4 w-4 text-emerald-700 dark:text-[#D3E57A]" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-[#D3E57A]">
              2. Why It Matters To You
            </h3>
          </div>
          <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed font-medium">
            {marker.whyItMatters}
          </p>
        </div>

        {/* 3. Connected Intelligence (Institutions, Startups, Universities) */}
        <div className="rounded-2xl border border-black/10 bg-black/[0.02] p-4 sm:p-5 dark:border-white/10 dark:bg-white/[0.03]">
          <h3 className="text-xs font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400 mb-3">
            3. Connected Ecosystem & Intelligence
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="rounded-xl border border-sky-500/20 bg-sky-50 p-3 dark:border-sky-400/20 dark:bg-sky-950/30">
              <span className="flex items-center gap-1 text-[11px] font-bold text-sky-700 dark:text-sky-300 mb-1.5">
                <Building2 className="h-3.5 w-3.5" />
                Research Hubs
              </span>
              <ul className="text-xs text-slate-700 dark:text-slate-300 space-y-1">
                {marker.connectedNodes.researchInstitutions.map((inst) => (
                  <li key={inst} className="truncate">• {inst}</li>
                ))}
              </ul>
            </div>

            <div className="rounded-xl border border-amber-500/20 bg-amber-50 p-3 dark:border-amber-400/20 dark:bg-amber-950/30">
              <span className="flex items-center gap-1 text-[11px] font-bold text-amber-700 dark:text-amber-300 mb-1.5">
                <School className="h-3.5 w-3.5" />
                Universities
              </span>
              <ul className="text-xs text-slate-700 dark:text-slate-300 space-y-1">
                {marker.connectedNodes.universities.map((uni) => (
                  <li key={uni} className="truncate">• {uni}</li>
                ))}
              </ul>
            </div>

            <div className="rounded-xl border border-emerald-500/20 bg-emerald-50 p-3 dark:border-emerald-400/20 dark:bg-emerald-950/30">
              <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-700 dark:text-emerald-300 mb-1.5">
                <Rocket className="h-3.5 w-3.5" />
                Startups & Labs
              </span>
              <ul className="text-xs text-slate-700 dark:text-slate-300 space-y-1">
                {marker.connectedNodes.startups.map((s) => (
                  <li key={s} className="truncate">• {s}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* 4. Skills to Build */}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">
            Related In-Demand Skills
          </h3>
          <div className="flex flex-wrap gap-1.5">
            {marker.relatedSkills.map((skill) => (
              <span
                key={skill}
                className="rounded-lg border border-black/10 bg-black/5 px-2.5 py-1 text-xs font-semibold text-slate-700 dark:border-white/10 dark:bg-white/5 dark:text-slate-200"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* 5. Take Action (Bottom Action Hub) */}
        <div className="pt-4 border-t border-black/10 dark:border-white/10 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={handleToggleSave}
              className="flex items-center gap-1.5 rounded-xl border border-black/15 bg-black/5 px-3 py-2 text-xs font-semibold text-[#1E1E22] transition hover:bg-black/10 dark:border-white/15 dark:bg-white/5 dark:text-white dark:hover:bg-white/10"
            >
              {savedLocal ? (
                <>
                  <BookmarkCheck className="h-4 w-4 text-emerald-600 dark:text-[#D3E57A]" />
                  <span>Saved</span>
                </>
              ) : (
                <>
                  <Bookmark className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                  <span>Save Marker</span>
                </>
              )}
            </button>

            <button
              onClick={handleAddTask}
              disabled={taskAdded}
              className={`flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-bold transition ${
                taskAdded
                  ? "bg-emerald-500/15 text-emerald-700 border border-emerald-500/30 dark:bg-emerald-500/20 dark:text-emerald-300"
                  : "border border-black/15 bg-black/5 text-[#1E1E22] hover:bg-black/10 dark:border-white/15 dark:bg-white/10 dark:text-white dark:hover:bg-white/20 active:scale-95"
              }`}
            >
              {taskAdded ? (
                <>
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                  <span>Added to Tracker</span>
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4" />
                  <span>Add Action to Tracker</span>
                </>
              )}
            </button>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href={`/pulse?prompt=${encodeURIComponent(`Explain ${marker.title} and how it connects to my learning journey.`)}`}
              className="flex items-center gap-1.5 rounded-xl bg-[#D3E57A] px-4 py-2 text-xs font-extrabold text-[#1E1E22] transition hover:bg-[#c3d56a] active:scale-95 shadow-md"
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>Ask PULSE AI</span>
            </Link>

            <Link
              href="/radar"
              className="flex items-center gap-1.5 rounded-xl border border-indigo-600/30 bg-indigo-50 px-3.5 py-2 text-xs font-bold text-indigo-700 transition hover:bg-indigo-100 dark:border-indigo-500/40 dark:bg-indigo-600/30 dark:text-indigo-200 dark:hover:bg-indigo-600/50"
            >
              <span>Explore Opportunities</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
