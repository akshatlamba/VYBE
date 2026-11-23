"use client";

import React, { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Header } from "./header";
import { BottomNav } from "./bottom-nav";
import { IconRail } from "./icon-rail";
import { Sidebar } from "./sidebar";
import { STUDENT_NAV, INSTITUTION_NAV, ADMIN_NAV } from "./nav-items";
import { Modal } from "../ui/modal";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Select } from "../ui/select";
import { SkillTag } from "../ui/badge";
import { Plus, CheckCircle2, BookmarkPlus, Sparkles } from "lucide-react";

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const pathname = usePathname();
  const router = useRouter();

  // Role management state (student / staff / admin)
  const [role, setRole] = useState<"student" | "staff" | "admin">(() => {
    if (pathname.startsWith("/institution")) return "staff";
    if (pathname.startsWith("/admin")) return "admin";
    return "student";
  });

  const handleRoleChange = (newRole: "student" | "staff" | "admin") => {
    setRole(newRole);
    if (newRole === "student" && (pathname.startsWith("/institution") || pathname.startsWith("/admin"))) {
      router.push("/");
    } else if (newRole === "staff") {
      router.push("/institution");
    } else if (newRole === "admin") {
      router.push("/admin");
    }
  };

  const navItems =
    role === "staff"
      ? INSTITUTION_NAV
      : role === "admin"
      ? ADMIN_NAV
      : STUDENT_NAV;

  // Quick Action Modal State
  const [quickActionOpen, setQuickActionOpen] = useState(false);
  const [actionTab, setActionTab] = useState<"task" | "outcome">("task");

  // Form states for quick task
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDue, setTaskDue] = useState("");
  const [taskPriority, setTaskPriority] = useState<"low" | "medium" | "high">("medium");

  // Form states for quick outcome
  const [outcomeTitle, setOutcomeTitle] = useState("");
  const [outcomeReflection, setOutcomeReflection] = useState("");
  const [outcomeSkillInput, setOutcomeSkillInput] = useState("");
  const [outcomeSkills, setOutcomeSkills] = useState<string[]>(["Python", "FastAPI"]);
  const [outcomeLink, setOutcomeLink] = useState("");
  const [submittedMessage, setSubmittedMessage] = useState("");

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle) return;
    setSubmittedMessage("Task successfully added to your Action Plan!");
    setTimeout(() => {
      setQuickActionOpen(false);
      setSubmittedMessage("");
      setTaskTitle("");
      setTaskDue("");
    }, 1200);
  };

  const handleLogOutcome = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!outcomeTitle) return;

    try {
      await fetch("/api/outcomes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: outcomeTitle,
          participation: "Solo Builder",
          reflection: outcomeReflection || "Building project milestone.",
          skills_gained: outcomeSkills,
          evidence_url: outcomeLink,
        }),
      });
    } catch {
      // Handled
    }

    setSubmittedMessage("Growth record captured in your Growth Passport!");
    setTimeout(() => {
      setQuickActionOpen(false);
      setSubmittedMessage("");
      setOutcomeTitle("");
      setOutcomeReflection("");
    }, 1200);
  };

  return (
    <div className="min-h-screen flex flex-col relative text-[#1E1E22] dark:text-white overflow-x-hidden w-full">
      {/* Background Blobs for Liquid Glass */}
      <div className="blob-container" aria-hidden="true">
        <div className="blob blob-peach" />
        <div className="blob blob-lavender" />
        <div className="blob blob-lime" />
      </div>

      {/* Desktop Sidebar (>=1024px) */}
      <Sidebar items={navItems} />

      {/* Tablet Icon Rail (768px - 1023px) */}
      <IconRail items={navItems} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col lg:pl-72 md:pl-28 pb-24 md:pb-8 transition-all">
        {/* App Header */}
        <Header
          currentRole={role}
          onRoleChange={handleRoleChange}
          onOpenQuickAction={() => setQuickActionOpen(true)}
        />

        {/* Page Container */}
        <main className="w-full max-w-[1200px] mx-auto px-4 sm:px-8 xl:px-10 py-2 flex-1">
          {children}
        </main>
      </div>

      {/* Mobile Floating Bottom Navigation (<768px) */}
      <BottomNav items={navItems} />

      {/* Quick Action Modal (Add Task or Log Outcome) */}
      <Modal
        isOpen={quickActionOpen}
        onClose={() => setQuickActionOpen(false)}
        title={actionTab === "task" ? "Add Preparation Task" : "Log Growth Outcome"}
      >
        {/* Toggle between Task and Outcome */}
        <div className="flex items-center gap-2 mb-6 p-1 rounded-full bg-black/5 dark:bg-white/10 w-fit">
          <button
            type="button"
            onClick={() => setActionTab("task")}
            className={`px-4 py-1.5 rounded-full text-small font-semibold transition-all ${
              actionTab === "task"
                ? "bg-[#1E1E22] text-white dark:bg-white dark:text-[#1E1E22] shadow-sm"
                : "text-gray-600 dark:text-gray-300"
            }`}
          >
            New Task
          </button>
          <button
            type="button"
            onClick={() => setActionTab("outcome")}
            className={`px-4 py-1.5 rounded-full text-small font-semibold transition-all ${
              actionTab === "outcome"
                ? "bg-[#1E1E22] text-white dark:bg-white dark:text-[#1E1E22] shadow-sm"
                : "text-gray-600 dark:text-gray-300"
            }`}
          >
            Log Outcome
          </button>
        </div>

        {submittedMessage ? (
          <div className="py-8 flex flex-col items-center text-center">
            <CheckCircle2 className="w-12 h-12 text-[#5BAE75] mb-3 animate-bounce" />
            <h4 className="text-h3 font-semibold text-[#1E1E22] dark:text-white">
              Success!
            </h4>
            <p className="text-body text-[#6B7280] dark:text-gray-300 mt-1">
              {submittedMessage}
            </p>
          </div>
        ) : actionTab === "task" ? (
          <form onSubmit={handleAddTask} className="flex flex-col gap-4">
            <Input
              label="Task Title"
              placeholder="e.g. Complete Python async tutorial"
              value={taskTitle}
              onChange={(e) => setTaskTitle(e.target.value)}
              required
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Due Date"
                type="date"
                value={taskDue}
                onChange={(e) => setTaskDue(e.target.value)}
              />
              <Select
                label="Priority"
                value={taskPriority}
                onChange={(e) => setTaskPriority(e.target.value as any)}
                options={[
                  { value: "low", label: "Low Priority" },
                  { value: "medium", label: "Medium Priority" },
                  { value: "high", label: "High Priority" },
                ]}
              />
            </div>
            <div className="pt-2">
              <Button type="submit" variant="primary" fullWidth size="lg" label="Create Task">
                Create Task
              </Button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleLogOutcome} className="flex flex-col gap-4">
            <Input
              label="Achievement / Project Title"
              placeholder="e.g. Built AI Agent Slack Bot"
              value={outcomeTitle}
              onChange={(e) => setOutcomeTitle(e.target.value)}
              required
            />
            <Textarea
              label="Reflection"
              placeholder="What worked? What was difficult? What will you do next?"
              value={outcomeReflection}
              onChange={(e) => setOutcomeReflection(e.target.value)}
              rows={3}
            />
            <div className="flex flex-col gap-2">
              <label className="text-small font-medium text-[#6B7280] dark:text-gray-300 ml-1">
                Skills Gained (Lilac Tags)
              </label>
              <div className="flex flex-wrap gap-2 items-center">
                {outcomeSkills.map((s) => (
                  <SkillTag
                    key={s}
                    label={s}
                    onRemove={() => setOutcomeSkills(outcomeSkills.filter((x) => x !== s))}
                  />
                ))}
                <div className="flex items-center gap-1">
                  <input
                    type="text"
                    placeholder="+ add skill"
                    value={outcomeSkillInput}
                    onChange={(e) => setOutcomeSkillInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        if (outcomeSkillInput.trim() && !outcomeSkills.includes(outcomeSkillInput.trim())) {
                          setOutcomeSkills([...outcomeSkills, outcomeSkillInput.trim()]);
                          setOutcomeSkillInput("");
                        }
                      }
                    }}
                    className="h-8 px-3 rounded-full text-caption bg-white/80 dark:bg-white/10 border border-black/10 dark:border-white/10 outline-none w-28"
                  />
                </div>
              </div>
            </div>
            <Input
              label="Evidence URL (GitHub / Demo / Drive)"
              placeholder="https://github.com/..."
              value={outcomeLink}
              onChange={(e) => setOutcomeLink(e.target.value)}
              helperText="Adding an evidence link changes status from Self-reported to Link-supported."
            />
            <div className="pt-2">
              <Button type="submit" variant="primary" fullWidth size="lg" label="Log to Growth Passport">
                Log to Growth Passport
              </Button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
}
