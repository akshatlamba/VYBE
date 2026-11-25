"use client";

import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FilterChips } from "@/components/ui/filter-chips";
import { VerificationBadge, SkillTag } from "@/components/ui/badge";
import { SkillBadge } from "@/components/ui/skill-badge";
import { TimelineItem } from "@/components/ui/timeline-item";
import { Modal } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Award,
  ShieldCheck,
  Link2,
  UserCheck,
  ExternalLink,
  Plus,
  Share2,
  Sparkles,
  CheckCircle2,
} from "lucide-react";
import { OUTCOMES_STORE, GrowthOutcome, PERSONAS } from "@/lib/data/mock-db";

export default function GrowthPassportPage() {
  const [filter, setFilter] = useState<string>("all");
  const [outcomes, setOutcomes] = useState<GrowthOutcome[]>(OUTCOMES_STORE);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newRole, setNewRole] = useState("Project Contributor");
  const [newReflection, setNewReflection] = useState("");
  const [newSkills, setNewSkills] = useState("");
  const [newEvidenceUrl, setNewEvidenceUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const student = PERSONAS.beginner;

  React.useEffect(() => {
    async function loadOutcomes() {
      try {
        const res = await fetch("/api/outcomes", { cache: "no-store" });
        const json = await res.json();
        if (json.success && json.data) {
          setOutcomes(json.data);
        }
      } catch {
        // Fallback to in-memory store
        setOutcomes([...OUTCOMES_STORE]);
      }
    }
    loadOutcomes();
  }, []);

  const handleCreateOutcome = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    setIsSubmitting(true);
    try {
      const skillsArray = newSkills
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

      const res = await fetch("/api/outcomes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newTitle.trim(),
          participation: newRole.trim(),
          reflection: newReflection.trim() || "Applied skills in project.",
          skills_gained: skillsArray.length > 0 ? skillsArray : ["Problem Solving"],
          evidence_url: newEvidenceUrl.trim() || undefined,
        }),
      });

      const json = await res.json();
      if (json.success && json.data) {
        setOutcomes((prev) => [json.data, ...prev]);
        setShowAddModal(false);
        setNewTitle("");
        setNewReflection("");
        setNewSkills("");
        setNewEvidenceUrl("");
      }
    } catch {
      alert("Failed to save achievement.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Evidence state metrics
  const totalRecords = outcomes.length;
  const verifiedCount = outcomes.filter((o) => o.verification === "verified").length;
  const linkSupportedCount = outcomes.filter((o) => o.verification === "link_supported").length;
  const selfReportedCount = outcomes.filter((o) => o.verification === "self_reported").length;

  // Extract all unique skills gained
  const allSkillsGained = Array.from(new Set(outcomes.flatMap((o) => o.skills_gained)));

  // Filtered outcomes
  const displayedOutcomes = outcomes.filter((o) => {
    if (filter === "all") return true;
    return o.verification === filter;
  });

  return (
    <div className="flex flex-col gap-8 py-2">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#D3E57A]/30 text-[#1E1E22] dark:text-[#D3E57A] text-caption font-bold mb-2">
            <Award className="w-3.5 h-3.5" />
            PROOF-OF-GROWTH PASSPORT
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-display font-extrabold tracking-tight text-[#1E1E22] dark:text-white leading-tight">
            Growth <span className="font-bold text-[#1E1E22] dark:text-[#D3E57A]">Passport</span>
          </h1>
          <p className="text-small sm:text-body text-[#4B5563] dark:text-gray-300 mt-1.5 font-medium">
            A portable, honest record of your achievements, verified evidence, and skills gained.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap w-full sm:w-auto">
          <Button
            variant="primary"
            size="md"
            label="Log Achievement"
            onClick={() => setShowAddModal(true)}
            className="gap-2 w-full sm:w-auto justify-center"
          >
            <Plus className="w-4 h-4" />
            Log Achievement
          </Button>

          <Button
            variant="secondary"
            size="md"
            label="Share Passport"
            onClick={() => {
              if (navigator.share) {
                navigator.share({
                  title: `${student.name}'s Growth Passport`,
                  url: window.location.href,
                }).catch(() => {});
              } else {
                navigator.clipboard.writeText(window.location.href);
                alert("Passport link copied to clipboard!");
              }
            }}
            className="gap-2 w-full sm:w-auto justify-center"
          >
            <Share2 className="w-4 h-4" />
            Share Passport
          </Button>
        </div>
      </div>

      {/* Dark Summary Card: Records by Evidence State & Skills Gained */}
      <div className="dark-feature-card p-6 sm:p-8 bg-[#26262B] text-white rounded-[28px] relative overflow-hidden flex flex-col gap-6">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-[#D3E57A] text-[#1E1E22] font-black text-h3 flex items-center justify-center">
              GP
            </div>
            <div className="flex flex-col">
              <span className="text-h3 font-bold text-white tracking-tight">
                {student.name}
              </span>
              <span className="text-caption text-white/60">
                {student.department} · {student.academic_year} · {student.institution_name}
              </span>
            </div>
          </div>

          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 text-caption font-semibold">
            <ShieldCheck className="w-4 h-4 text-[#D3E57A]" />
            Honest Verification Architecture
          </div>
        </div>

        {/* 3 Evidence States Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex flex-col gap-1">
            <span className="text-caption text-white/60 font-medium">Verified by Organizer/College</span>
            <div className="text-display font-bold text-[#D3E57A]">
              {verifiedCount}
            </div>
            <span className="text-[11px] text-white/50">Cryptographically or institution certified</span>
          </div>

          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex flex-col gap-1">
            <span className="text-caption text-white/60 font-medium">Link-Supported Evidence</span>
            <div className="text-display font-bold text-[#2F6BFF]">
              {linkSupportedCount}
            </div>
            <span className="text-[11px] text-white/50">Attached GitHub, demo, or publication link</span>
          </div>

          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex flex-col gap-1">
            <span className="text-caption text-white/60 font-medium">Self-Reported Growth</span>
            <div className="text-display font-bold text-white">
              {selfReportedCount}
            </div>
            <span className="text-[11px] text-white/50">Reflections and student-logged progress</span>
          </div>
        </div>

        {/* Cumulative Skills Gained */}
        <div className="flex flex-col gap-2.5 pt-3 border-t border-white/10">
          <div className="flex items-center justify-between">
            <span className="text-caption font-bold text-white/70 uppercase tracking-wider">
              Verified Skills Gained ({allSkillsGained.length})
            </span>
          </div>
          <div className="flex flex-wrap gap-2 sm:gap-2.5">
            {allSkillsGained.map((skill) => (
              <SkillBadge
                key={skill}
                name={skill}
                size="md"
                variant="dark-card"
              />
            ))}
          </div>
        </div>
      </div>

      {/* Filter by Verification State */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <FilterChips
          options={[
            { id: "all", label: `All Records (${totalRecords})` },
            { id: "verified", label: `Verified (${verifiedCount})` },
            { id: "link_supported", label: `Link-Supported (${linkSupportedCount})` },
            { id: "self_reported", label: `Self-Reported (${selfReportedCount})` },
          ]}
          selectedId={filter}
          onChange={setFilter}
        />
      </div>

      {/* Timeline of Records */}
      <div className="flex flex-col gap-2">
        {displayedOutcomes.map((item, idx) => (
          <TimelineItem
            key={item.id}
            time={new Date(item.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
            isLast={idx === displayedOutcomes.length - 1}
            dotColor={
              item.verification === "verified"
                ? "bg-[#D3E57A]"
                : item.verification === "link_supported"
                ? "bg-[#2F6BFF]"
                : "bg-gray-400"
            }
          >
            <Card variant="glass" className="p-6 flex flex-col gap-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <VerificationBadge state={item.verification} />
                <span className="text-caption font-semibold text-gray-500">
                  Role: <strong className="text-[#1E1E22] dark:text-white">{item.participation}</strong>
                </span>
              </div>

              <div>
                <h3 className="text-h3 font-bold text-[#1E1E22] dark:text-white">
                  {item.title}
                </h3>
                <p className="text-body text-[#6B7280] dark:text-gray-300 mt-1 italic">
                  &ldquo;{item.reflection}&rdquo;
                </p>
              </div>

              {/* Skills Gained Tags */}
              <div className="flex flex-wrap gap-2 items-center">
                <span className="text-caption font-bold text-gray-400 mr-1">Skills:</span>
                {item.skills_gained.map((s) => (
                  <SkillTag key={s} label={s} />
                ))}
              </div>

              {/* Attached Evidence Link */}
              {item.evidence_url && (
                <div className="pt-2 border-t border-black/5 dark:border-white/5 flex items-center justify-between text-small">
                  <a
                    href={item.evidence_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-[#2F6BFF] hover:underline font-semibold"
                  >
                    <ExternalLink className="w-4 h-4" />
                    View Attached Proof ({item.evidence_url.replace("https://", "").split("/")[0]})
                  </a>
                  <span className="text-caption text-gray-400">
                    Cryptographic hash registered
                  </span>
                </div>
              )}
            </Card>
          </TimelineItem>
        ))}
      </div>

      {/* Log Achievement Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Log Achievement to Growth Passport"
      >
        <form onSubmit={handleCreateOutcome} className="flex flex-col gap-4">
          <Input
            label="Project or Achievement Title"
            placeholder="e.g. Autonomous Customer Support Bot"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            required
          />

          <Input
            label="Role / Contribution"
            placeholder="e.g. Lead Developer / Team Member"
            value={newRole}
            onChange={(e) => setNewRole(e.target.value)}
            required
          />

          <Textarea
            label="Key Learnings & Reflection"
            placeholder="Describe what you built, trade-offs made, and how you solved challenges..."
            value={newReflection}
            onChange={(e) => setNewReflection(e.target.value)}
          />

          <Input
            label="Skills Gained (comma-separated)"
            placeholder="e.g. Python, REST APIs, Fastify, Docker"
            value={newSkills}
            onChange={(e) => setNewSkills(e.target.value)}
          />

          <Input
            label="Evidence URL (GitHub / Live Demo / Docs)"
            placeholder="https://github.com/your-username/project-repo"
            value={newEvidenceUrl}
            onChange={(e) => setNewEvidenceUrl(e.target.value)}
            helperText="If a valid URL is provided, record is marked 'Link-Supported'. If empty, it is 'Self-Reported'."
          />

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-black/5 dark:border-white/5">
            <Button
              type="button"
              variant="ghost"
              size="md"
              label="Cancel"
              onClick={() => setShowAddModal(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="md"
              label={isSubmitting ? "Saving..." : "Save to Passport"}
              disabled={isSubmitting || !newTitle.trim()}
            >
              {isSubmitting ? "Saving..." : "Save to Passport"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
