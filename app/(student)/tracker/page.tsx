"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PillTabs } from "@/components/ui/pill-tabs";
import { PriorityBadge, StatusBadge } from "@/components/ui/badge";
import { ProgressRing } from "@/components/ui/progress-ring";
import { TimelineItem } from "@/components/ui/timeline-item";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Calendar,
  CheckCircle2,
  Clock,
  Plus,
  KanbanSquare,
  Sparkles,
  ArrowRight,
  ChevronRight,
  ExternalLink,
} from "lucide-react";
import { APPLICATIONS_STORE, Application } from "@/lib/data/mock-db";

export default function TrackerPage() {
  const [activeTab, setActiveTab] = useState<string>("preparing");
  const [apps, setApps] = useState<Application[]>(APPLICATIONS_STORE);

  // Tab counts
  const savedCount = apps.filter((a) => a.stage === "saved").length;
  const preparingCount = apps.filter((a) => a.stage === "preparing").length;
  const appliedCount = apps.filter((a) => a.stage === "applied").length;
  const doneCount = apps.filter((a) => a.stage === "done" || a.stage === "attended").length;

  const tabs = [
    { id: "saved", label: "Saved", count: savedCount },
    { id: "preparing", label: "Preparing", count: preparingCount },
    { id: "applied", label: "Applied", count: appliedCount },
    { id: "done", label: "Done", count: doneCount },
  ];

  const handleToggleTask = (appId: string, taskId: string) => {
    setApps((prev) =>
      prev.map((a) => {
        if (a.id !== appId) return a;
        return {
          ...a,
          tasks: a.tasks.map((t) => (t.id === taskId ? { ...t, completed: !t.completed } : t)),
        };
      })
    );
  };

  const handleStageChange = async (appId: string, newStage: Application["stage"]) => {
    setApps((prev) =>
      prev.map((a) => (a.id === appId ? { ...a, stage: newStage } : a))
    );
    try {
      await fetch("/api/applications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: appId, stage: newStage }),
      });
    } catch {
      // Handled
    }
  };

  // Filter for active tab
  const activeApps = apps.filter((a) => {
    if (activeTab === "done") return a.stage === "done" || a.stage === "attended";
    return a.stage === activeTab;
  });

  return (
    <div className="flex flex-col gap-6 py-2">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#D3E57A]/30 text-[#1E1E22] dark:text-[#D3E57A] text-caption font-bold mb-2">
            <KanbanSquare className="w-3.5 h-3.5" />
            ACTION TRACKER
          </div>
          <h1 className="text-display font-light tracking-tight text-[#1E1E22] dark:text-white leading-tight">
            Action <span className="font-normal">Tracker</span>
          </h1>
          <p className="text-small text-[#6B7280] dark:text-gray-400 mt-1">
            Deadlines, preparation tasks, team formation, and outcome continuity.
          </p>
        </div>

        <Link href="/radar">
          <Button variant="secondary" size="md" label="Discover More Opportunities" className="gap-2">
            + Discover More Opportunities
          </Button>
        </Link>
      </div>

      {/* Pill Tabs with Counts (Lime active tab with white count circle) */}
      <PillTabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

      {/* DESKTOP KANBAN VIEW (>=1024px) */}
      <div className="hidden lg:grid grid-cols-4 gap-4 pt-2">
        {(["saved", "preparing", "applied", "done"] as const).map((colStage) => {
          const colApps = apps.filter((a) => {
            if (colStage === "done") return a.stage === "done" || a.stage === "attended";
            return a.stage === colStage;
          });

          return (
            <div key={colStage} className="flex flex-col gap-3">
              <div className="flex items-center justify-between p-2 rounded-2xl bg-black/5 dark:bg-white/5 px-4">
                <span className="font-bold text-small text-[#1E1E22] dark:text-white capitalize">
                  {colStage}
                </span>
                <span className="w-6 h-6 rounded-full bg-white dark:bg-black/40 text-[11px] font-bold flex items-center justify-center">
                  {colApps.length}
                </span>
              </div>

              <div className="flex flex-col gap-3">
                {colApps.map((app) => (
                  <Card key={app.id} variant="glass" className="p-4 flex flex-col gap-3">
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-caption font-bold text-gray-500 uppercase">
                        {app.opportunity?.type || "Opportunity"}
                      </span>
                      <span className="text-caption font-bold text-[#5BAE75]">
                        {app.fit_score}% Fit
                      </span>
                    </div>

                    <h4 className="text-body font-bold text-[#1E1E22] dark:text-white leading-snug">
                      {app.opportunity?.title || "Prasunex Innovathon"}
                    </h4>

                    {/* Tasks checklist */}
                    {app.tasks && app.tasks.length > 0 && (
                      <div className="flex flex-col gap-1.5 pt-2 border-t border-black/5 dark:border-white/5">
                        <span className="text-[11px] font-bold text-gray-400 uppercase">
                          Action Checklist
                        </span>
                        {app.tasks.slice(0, 3).map((task) => (
                          <label
                            key={task.id}
                            className="flex items-center gap-2 cursor-pointer select-none text-caption text-[#1E1E22] dark:text-gray-300"
                          >
                            <input
                              type="checkbox"
                              checked={task.completed}
                              onChange={() => handleToggleTask(app.id, task.id)}
                              className="w-3.5 h-3.5 rounded accent-[#1E1E22]"
                            />
                            <span className={task.completed ? "line-through text-gray-400" : ""}>
                              {task.title}
                            </span>
                          </label>
                        ))}
                      </div>
                    )}

                    <div className="pt-2 flex items-center justify-between border-t border-black/5 dark:border-white/5">
                      <select
                        value={app.stage}
                        onChange={(e) => handleStageChange(app.id, e.target.value as any)}
                        className="text-caption bg-transparent font-semibold text-gray-500 outline-none cursor-pointer"
                      >
                        <option value="saved">Move to Saved</option>
                        <option value="preparing">Move to Preparing</option>
                        <option value="applied">Move to Applied</option>
                        <option value="done">Move to Done</option>
                      </select>

                      <Link href={`/radar/${app.opportunity_id}`}>
                        <Button variant="ghost" size="sm" className="p-1 h-7">
                          <ChevronRight className="w-4 h-4" />
                        </Button>
                      </Link>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* MOBILE & TABLET TIMELINE VIEW (<1024px) */}
      <div className="lg:hidden flex flex-col gap-4">
        {activeApps.length === 0 ? (
          <div className="p-8 text-center text-gray-500 rounded-[28px] glass-surface">
            No opportunities in this stage. Discover more from Opportunity Radar!
          </div>
        ) : (
          activeApps.map((app) => (
            <Card key={app.id} variant="glass" className="p-6 flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <span className="text-caption font-semibold text-gray-500 uppercase">
                  {app.opportunity?.organizer || "Organizer"}
                </span>
                <span className="px-3 py-0.5 rounded-full text-caption font-bold bg-[#D3E57A] text-[#1E1E22]">
                  {app.fit_score}% Fit
                </span>
              </div>

              <div>
                <h3 className="text-h3 font-bold text-[#1E1E22] dark:text-white">
                  {app.opportunity?.title || "Prasunex Innovathon 2026"}
                </h3>
                <p className="text-small text-gray-500 mt-1">
                  {app.notes}
                </p>
              </div>

              {/* Tasks Timeline */}
              <div className="flex flex-col gap-2 pt-2 border-t border-black/5 dark:border-white/5">
                <span className="text-caption font-bold text-gray-400 uppercase">
                  Preparation Tasks
                </span>
                {app.tasks.map((task) => (
                  <div
                    key={task.id}
                    className="p-3 rounded-xl bg-white/70 dark:bg-white/5 flex items-center justify-between"
                  >
                    <label className="flex items-center gap-2.5 cursor-pointer text-small">
                      <input
                        type="checkbox"
                        checked={task.completed}
                        onChange={() => handleToggleTask(app.id, task.id)}
                        className="w-4 h-4 rounded accent-[#1E1E22]"
                      />
                      <span className={task.completed ? "line-through text-gray-400" : "font-medium"}>
                        {task.title}
                      </span>
                    </label>
                    <PriorityBadge priority={task.priority} />
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-black/5 dark:border-white/5">
                <select
                  value={app.stage}
                  onChange={(e) => handleStageChange(app.id, e.target.value as any)}
                  className="text-small bg-transparent font-semibold text-[#1E1E22] dark:text-white outline-none cursor-pointer"
                >
                  <option value="saved">Stage: Saved</option>
                  <option value="preparing">Stage: Preparing</option>
                  <option value="applied">Stage: Applied</option>
                  <option value="done">Stage: Done</option>
                </select>

                <Link href={`/radar/${app.opportunity_id}`}>
                  <Button variant="primary" size="sm" label="View Receipt">
                    View Receipt
                  </Button>
                </Link>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
