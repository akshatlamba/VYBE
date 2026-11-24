"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Target,
  BookOpen,
  GraduationCap,
  Sliders,
  Briefcase,
  Rocket,
  Microscope,
  Trophy,
  Check,
  Plus,
  X,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  CheckCircle2,
  School,
  Bookmark,
  MapPin,
  ChevronDown,
  LogOut,
} from "lucide-react";
import { useAuth } from "@/lib/auth/auth-context";
import { VybeSymbol } from "@/components/ui/vybe-logo";

interface SkillItem {
  name: string;
  tier: 1 | 2 | 3;
}

export default function OnboardingPage() {
  const router = useRouter();
  const { user, updateUser, logout } = useAuth();
  const [step, setStep] = useState<number>(1);
  const [saving, setSaving] = useState(false);

  // Step 1: Goals & Interests
  const [primaryGoal, setPrimaryGoal] = useState<"internship" | "startup" | "research" | "hackathon">("internship");
  const [interests, setInterests] = useState<string[]>(["AI Agents", "Web Development", "Python"]);
  const [interestInput, setInterestInput] = useState("");

  // Step 2: Skills & Proficiency
  const [skills, setSkills] = useState<SkillItem[]>([
    { name: "TypeScript / React", tier: 2 },
    { name: "PyTorch / Machine Learning", tier: 1 },
    { name: "PostgreSQL & DB Architecture", tier: 3 },
  ]);
  const [customSkillInput, setCustomSkillInput] = useState("");

  // Step 3: Academic DNA
  const [academicYear, setAcademicYear] = useState("3rd Year");
  const [institution, setInstitution] = useState("Indian Institute of Technology, Bombay");
  const [department, setDepartment] = useState("Computer Science & Eng.");
  const [location, setLocation] = useState("Mumbai / Remote");

  // Step 4: Feasibility & Boundaries
  const [budgetMode, setBudgetMode] = useState<"free" | "custom">("free");
  const [budgetMax, setBudgetMax] = useState<number>(2500);
  const [availability, setAvailability] = useState<"Light" | "Part-time" | "Intensive">("Part-time");
  const [preferredFormat, setPreferredFormat] = useState<"online" | "hybrid" | "onsite">("online");

  // Handlers for Interests
  const addInterest = (text: string) => {
    const trimmed = text.trim();
    if (trimmed && !interests.some((i) => i.toLowerCase() === trimmed.toLowerCase())) {
      setInterests([...interests, trimmed]);
    }
  };

  const removeInterest = (item: string) => {
    setInterests(interests.filter((i) => i !== item));
  };

  // Handlers for Skills
  const cycleSkillTier = (index: number) => {
    setSkills((prev) =>
      prev.map((s, i) => {
        if (i !== index) return s;
        const nextTier = s.tier >= 3 ? 1 : ((s.tier + 1) as 1 | 2 | 3);
        return { ...s, tier: nextTier };
      })
    );
  };

  const removeSkill = (index: number) => {
    setSkills(skills.filter((_, i) => i !== index));
  };

  const addSkill = (name: string, tier: 1 | 2 | 3) => {
    const trimmed = name.trim();
    if (trimmed && !skills.some((s) => s.name.toLowerCase() === trimmed.toLowerCase())) {
      setSkills([...skills, { name: trimmed, tier }]);
    }
  };

  const getTierBadgeProps = (tier: 1 | 2 | 3) => {
    switch (tier) {
      case 1:
        return {
          label: "Beginner 🌱",
          className: "bg-[#D3E57A]/20 text-[#D3E57A] border-[#D3E57A]/40",
          dotClass: "bg-[#D3E57A] shadow-glow-lime",
        };
      case 2:
        return {
          label: "Intermediate ⚡",
          className: "bg-[#D9C9F5]/20 text-[#D9C9F5] border-[#D9C9F5]/40",
          dotClass: "bg-[#D9C9F5] shadow-glow-lilac",
        };
      case 3:
      default:
        return {
          label: "Advanced 🚀",
          className: "bg-purple-400/20 text-purple-300 border-purple-400/40",
          dotClass: "bg-purple-400",
        };
    }
  };

  const handleNext = async () => {
    if (step < 4) {
      setStep(step + 1);
    } else if (step === 4) {
      await handleComplete();
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleComplete = async () => {
    setSaving(true);
    const mappedSkills = skills.map((s) => ({
      name: s.name,
      level: s.tier === 1 ? ("Beginner" as const) : s.tier === 2 ? ("Intermediate" as const) : ("Advanced" as const),
    }));

    updateUser({
      academic_year: academicYear,
      department,
      primary_goal: primaryGoal,
      onboarded: true,
    });

    try {
      await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: user.name || "Student",
          academic_year: academicYear,
          department,
          institution_name: institution,
          location,
          budget_max: budgetMode === "free" ? 0 : Number(budgetMax),
          availability:
            availability === "Light"
              ? "Light (2-5 hrs/wk)"
              : availability === "Part-time"
              ? "Part-time (5-10 hrs/wk)"
              : "Intensive (15+ hrs/wk)",
          preferred_format: preferredFormat,
          skills: mappedSkills,
          interests,
          primary_goal: primaryGoal,
          sharing_prefs: {
            public_passport: true,
            show_email: false,
            share_aggregates: true,
          },
        }),
      });
    } catch {
      // Continue even if network error
    } finally {
      setSaving(false);
      setStep(5);
    }
  };

  return (
    <div className="bg-[#0D0D12] text-white min-h-screen relative flex items-center justify-center p-3 sm:p-6 overflow-x-hidden selection:bg-[#D3E57A] selection:text-black font-sans">
      {/* Ambient Drifting Pastel Blur Blobs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0" aria-hidden="true">
        {/* Peach Blob */}
        <div className="ambient-blob-1 absolute -top-24 -left-20 w-[380px] h-[380px] rounded-full bg-[#FAD8C6] opacity-20 blur-[110px]" />
        {/* Pink Blob */}
        <div className="ambient-blob-2 absolute top-1/3 -right-28 w-[420px] h-[420px] rounded-full bg-[#F6C9DD] opacity-25 blur-[120px]" />
        {/* Lavender Blob */}
        <div className="ambient-blob-3 absolute -bottom-32 left-1/4 w-[450px] h-[450px] rounded-full bg-[#D9C9F5] opacity-25 blur-[130px]" />
        {/* Subtle lime accent highlight in corner */}
        <div className="absolute bottom-10 right-10 w-[260px] h-[260px] rounded-full bg-[#D3E57A] opacity-10 blur-[100px]" />
      </div>

      {/* Main Standalone Centered Glass Card (max-w-[620px]) */}
      <div className="relative z-10 w-full max-w-[620px] glass-surface rounded-[28px] p-5 sm:p-8 my-auto transition-all duration-300">
        {/* Top Header Inside Card */}
        <header className="flex flex-col items-center mb-6 relative">
          {/* Sign Out Button */}
          <button
            type="button"
            onClick={() => {
              logout();
              router.push("/login");
            }}
            className="absolute right-0 top-0 text-[11px] font-semibold text-white/50 hover:text-white flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 transition btn-press cursor-pointer"
            title="Sign out and return to login"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Sign Out</span>
          </button>

          {/* Official VYBE Brand Icon */}
          <div className="flex items-center gap-3 mb-5">
            <VybeSymbol size={36} className="drop-shadow-lg" />
            <div className="flex flex-col">
              <span className="text-sm font-extrabold tracking-widest text-white leading-none">VYBE</span>
              <span className="text-[10px] uppercase font-semibold tracking-wider text-white/40 mt-0.5">
                Decision Intelligence
              </span>
            </div>
          </div>

          {/* Step Progress Subtext */}
          <div className="w-full flex items-center justify-between text-[11px] font-bold tracking-wider text-white/50 mb-2.5 uppercase">
            <span className="text-white/80">
              {step <= 4 ? `STEP ${step} OF 4` : "ONBOARDING COMPLETE"}
            </span>
            <span className="text-[#D3E57A] tracking-widest">
              {step <= 4 ? `${step * 25}% COMPLETE` : "100% COMPLETE"}
            </span>
          </div>

          {/* Segmented 4-Step Pill Bar with smooth lime glowing fill */}
          <div className="w-full grid grid-cols-4 gap-2 h-1.5 bg-white/5 p-0.5 rounded-full overflow-hidden border border-white/10">
            {[1, 2, 3, 4].map((segIndex) => {
              const isFilled = step >= segIndex || step === 5;
              return (
                <div
                  key={segIndex}
                  className={`h-full rounded-full transition-all duration-300 ${
                    isFilled
                      ? "bg-[#D3E57A] shadow-glow-lime"
                      : "bg-white/10"
                  }`}
                />
              );
            })}
          </div>
        </header>

        {/* STEP CONTENTS CONTAINER */}
        <main className="min-h-[410px]">
          {/* ==================== STEP 1: GOALS & INTERESTS ==================== */}
          {step === 1 && (
            <section className="animate-in fade-in duration-300">
              {/* Pill Tag */}
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#D3E57A]/15 border border-[#D3E57A]/30 text-[#D3E57A] text-[11px] font-bold tracking-wider uppercase mb-3">
                <Target className="w-3.5 h-3.5" />
                <span>GOALS & INTERESTS</span>
              </div>

              {/* Headline & Subtitle */}
              <h1 className="text-2xl sm:text-[28px] font-bold text-white tracking-tight leading-snug">
                What are you aiming for?
              </h1>
              <p className="text-xs sm:text-sm text-white/60 mt-1 mb-5 leading-relaxed">
                VYBE uses your core ambition to rank relevant hackathons, fellowships, and internships.
              </p>

              {/* Primary Goal Cards (2x2 Grid) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                {/* Goal 1: Internship */}
                <button
                  type="button"
                  onClick={() => setPrimaryGoal("internship")}
                  className={`cursor-pointer p-4 rounded-2xl text-left transition-all duration-200 flex items-center gap-3.5 group ${
                    primaryGoal === "internship"
                      ? "bg-white text-zinc-950 ring-2 ring-[#D3E57A] shadow-glow-lime scale-[1.01]"
                      : "bg-[#1C1C22]/80 hover:bg-white/10 text-white border border-white/10"
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold transition ${
                      primaryGoal === "internship"
                        ? "bg-zinc-900/10 text-zinc-950"
                        : "bg-white/5 border border-white/10 text-white/80 group-hover:text-[#D3E57A]"
                    }`}
                  >
                    <Briefcase className="w-5 h-5" />
                  </div>
                  <div>
                    <div
                      className={`font-bold text-sm tracking-tight ${
                        primaryGoal === "internship" ? "text-zinc-950" : "text-white"
                      }`}
                    >
                      Land an Internship
                    </div>
                    <div
                      className={`text-[11px] ${
                        primaryGoal === "internship" ? "text-zinc-700" : "text-white/50"
                      }`}
                    >
                      Top tech & finance roles
                    </div>
                  </div>
                  {primaryGoal === "internship" && (
                    <div className="ml-auto text-[#D3E57A] bg-zinc-950 rounded-full p-0.5">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                  )}
                </button>

                {/* Goal 2: Build a Startup */}
                <button
                  type="button"
                  onClick={() => setPrimaryGoal("startup")}
                  className={`cursor-pointer p-4 rounded-2xl text-left transition-all duration-200 flex items-center gap-3.5 group ${
                    primaryGoal === "startup"
                      ? "bg-white text-zinc-950 ring-2 ring-[#D3E57A] shadow-glow-lime scale-[1.01]"
                      : "bg-[#1C1C22]/80 hover:bg-white/10 text-white border border-white/10"
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold transition ${
                      primaryGoal === "startup"
                        ? "bg-zinc-900/10 text-zinc-950"
                        : "bg-white/5 border border-white/10 text-white/80 group-hover:text-[#D3E57A]"
                    }`}
                  >
                    <Rocket className="w-5 h-5" />
                  </div>
                  <div>
                    <div
                      className={`font-bold text-sm tracking-tight ${
                        primaryGoal === "startup" ? "text-zinc-950" : "text-white"
                      }`}
                    >
                      Build a Startup
                    </div>
                    <div
                      className={`text-[11px] ${
                        primaryGoal === "startup" ? "text-zinc-700" : "text-white/50"
                      }`}
                    >
                      Incubators & angel grants
                    </div>
                  </div>
                  {primaryGoal === "startup" && (
                    <div className="ml-auto text-[#D3E57A] bg-zinc-950 rounded-full p-0.5">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                  )}
                </button>

                {/* Goal 3: Academic Research */}
                <button
                  type="button"
                  onClick={() => setPrimaryGoal("research")}
                  className={`cursor-pointer p-4 rounded-2xl text-left transition-all duration-200 flex items-center gap-3.5 group ${
                    primaryGoal === "research"
                      ? "bg-white text-zinc-950 ring-2 ring-[#D3E57A] shadow-glow-lime scale-[1.01]"
                      : "bg-[#1C1C22]/80 hover:bg-white/10 text-white border border-white/10"
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold transition ${
                      primaryGoal === "research"
                        ? "bg-zinc-900/10 text-zinc-950"
                        : "bg-white/5 border border-white/10 text-white/80 group-hover:text-[#D3E57A]"
                    }`}
                  >
                    <Microscope className="w-5 h-5" />
                  </div>
                  <div>
                    <div
                      className={`font-bold text-sm tracking-tight ${
                        primaryGoal === "research" ? "text-zinc-950" : "text-white"
                      }`}
                    >
                      Academic Research
                    </div>
                    <div
                      className={`text-[11px] ${
                        primaryGoal === "research" ? "text-zinc-700" : "text-white/50"
                      }`}
                    >
                      Labs, papers & PhD track
                    </div>
                  </div>
                  {primaryGoal === "research" && (
                    <div className="ml-auto text-[#D3E57A] bg-zinc-950 rounded-full p-0.5">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                  )}
                </button>

                {/* Goal 4: Win Hackathons */}
                <button
                  type="button"
                  onClick={() => setPrimaryGoal("hackathon")}
                  className={`cursor-pointer p-4 rounded-2xl text-left transition-all duration-200 flex items-center gap-3.5 group ${
                    primaryGoal === "hackathon"
                      ? "bg-white text-zinc-950 ring-2 ring-[#D3E57A] shadow-glow-lime scale-[1.01]"
                      : "bg-[#1C1C22]/80 hover:bg-white/10 text-white border border-white/10"
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold transition ${
                      primaryGoal === "hackathon"
                        ? "bg-zinc-900/10 text-zinc-950"
                        : "bg-white/5 border border-white/10 text-white/80 group-hover:text-[#D3E57A]"
                    }`}
                  >
                    <Trophy className="w-5 h-5" />
                  </div>
                  <div>
                    <div
                      className={`font-bold text-sm tracking-tight ${
                        primaryGoal === "hackathon" ? "text-zinc-950" : "text-white"
                      }`}
                    >
                      Win Hackathons
                    </div>
                    <div
                      className={`text-[11px] ${
                        primaryGoal === "hackathon" ? "text-zinc-700" : "text-white/50"
                      }`}
                    >
                      Global bounties & prizes
                    </div>
                  </div>
                  {primaryGoal === "hackathon" && (
                    <div className="ml-auto text-[#D3E57A] bg-zinc-950 rounded-full p-0.5">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                  )}
                </button>
              </div>

              {/* Focus Interests Section */}
              <div className="mt-4 pt-4 border-t border-white/10">
                <div className="flex items-center justify-between mb-2.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-white/70">
                    Focus Interests
                  </label>
                  <span className="text-[11px] text-white/40">Select or add tags</span>
                </div>

                {/* Existing Active Removable Chips */}
                <div className="flex flex-wrap gap-2 mb-3">
                  {interests.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-white/10 border border-white/15 text-white hover:border-white/30 transition"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeInterest(tag)}
                        className="text-white/40 hover:text-white transition"
                        aria-label={`Remove ${tag}`}
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>

                {/* Pill input field with + Add button */}
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (interestInput.trim()) {
                      addInterest(interestInput);
                      setInterestInput("");
                    }
                  }}
                  className="flex items-center gap-2 mb-2.5"
                >
                  <div className="relative flex-1">
                    <input
                      type="text"
                      value={interestInput}
                      onChange={(e) => setInterestInput(e.target.value)}
                      placeholder="Type custom interest (e.g. LLMs, Distributed Systems)..."
                      className="w-full glass-input rounded-full px-4 py-2 text-xs text-white placeholder-white/40 outline-none transition"
                    />
                  </div>
                  <button
                    type="submit"
                    className="btn-press px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 text-xs font-semibold text-white flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Add
                  </button>
                </form>

                {/* Quick-suggest popular tags */}
                <div className="flex items-center gap-2 text-[11px] text-white/50 flex-wrap">
                  <span className="text-white/40">Popular:</span>
                  {["FinTech", "System Design", "Robotics"].map((popularTag) => (
                    <button
                      key={popularTag}
                      type="button"
                      onClick={() => addInterest(popularTag)}
                      className="px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10 hover:border-[#D3E57A] hover:text-[#D3E57A] transition"
                    >
                      + {popularTag}
                    </button>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* ==================== STEP 2: CORE SKILLS & PROFICIENCY ==================== */}
          {step === 2 && (
            <section className="animate-in fade-in duration-300">
              {/* Pill Tag */}
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#D9C9F5]/15 border border-[#D9C9F5]/30 text-[#D9C9F5] text-[11px] font-bold tracking-wider uppercase mb-3">
                <BookOpen className="w-3.5 h-3.5" />
                <span>SKILLS & PROFICIENCY</span>
              </div>

              {/* Headline & Subtitle */}
              <h1 className="text-2xl sm:text-[28px] font-bold text-white tracking-tight leading-snug">
                What are your core skills?
              </h1>
              <p className="text-xs sm:text-sm text-white/60 mt-1 mb-5 leading-relaxed">
                We compare your verified competencies against opportunity prerequisites to uncover readiness gaps.
              </p>

              {/* Skill Rows with 3-tier Level Toggle */}
              <div className="space-y-3 mb-6">
                <div className="text-xs font-semibold uppercase tracking-wider text-white/60">
                  Your Active Stack (Click badge to cycle tier)
                </div>

                <div className="flex flex-col gap-2.5">
                  {skills.map((skill, index) => {
                    const badge = getTierBadgeProps(skill.tier);
                    return (
                      <div
                        key={skill.name}
                        className="flex items-center justify-between p-3 rounded-2xl bg-[#1C1C22]/80 border border-white/10 hover:border-[#D9C9F5]/40 transition"
                      >
                        <div className="flex items-center gap-2.5">
                          <span className={`w-2 h-2 rounded-full ${badge.dotClass}`} />
                          <span className="text-sm font-semibold text-white">{skill.name}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => cycleSkillTier(index)}
                            className={`px-3 py-1 rounded-full text-xs font-bold border hover:scale-105 transition cursor-pointer ${badge.className}`}
                            title="Click to cycle between Beginner, Intermediate, and Advanced"
                          >
                            {badge.label}
                          </button>
                          <button
                            type="button"
                            onClick={() => removeSkill(index)}
                            className="text-white/30 hover:text-white/80 p-1"
                            aria-label={`Remove skill ${skill.name}`}
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Add Custom Skill Form */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (customSkillInput.trim()) {
                    addSkill(customSkillInput, 1);
                    setCustomSkillInput("");
                  }
                }}
                className="flex items-center gap-2 mb-4"
              >
                <input
                  type="text"
                  value={customSkillInput}
                  onChange={(e) => setCustomSkillInput(e.target.value)}
                  placeholder="Add another skill (e.g. Next.js, Rust, AWS)..."
                  className="flex-1 glass-input rounded-full px-4 py-2 text-xs text-white placeholder-white/40 outline-none transition"
                />
                <button
                  type="submit"
                  className="btn-press px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 text-xs font-semibold text-white flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add Skill
                </button>
              </form>

              {/* Quick-add skill suggestions based on chosen goal */}
              <div className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/10">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] uppercase tracking-wider text-[#D9C9F5] font-bold flex items-center gap-1">
                    <Sparkles className="w-3 h-3" /> Recommended for your Goal
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {[
                    { name: "FastAPI / REST", tier: 1 as const, display: "+ FastAPI" },
                    { name: "Docker / K8s", tier: 2 as const, display: "+ Docker" },
                    { name: "Data Structures & Algo", tier: 3 as const, display: "+ DSA" },
                    { name: "Figma & UI Systems", tier: 1 as const, display: "+ UI Design" },
                  ].map((sugg) => (
                    <button
                      key={sugg.name}
                      type="button"
                      onClick={() => addSkill(sugg.name, sugg.tier)}
                      className="px-2.5 py-1 rounded-full bg-white/5 hover:bg-[#D9C9F5]/20 border border-white/10 text-xs text-white/80 hover:text-[#D9C9F5] hover:border-[#D9C9F5]/40 transition"
                    >
                      {sugg.display}
                    </button>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* ==================== STEP 3: ACADEMIC DNA ==================== */}
          {step === 3 && (
            <section className="animate-in fade-in duration-300">
              {/* Pill Tag */}
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-400/15 border border-sky-400/30 text-sky-300 text-[11px] font-bold tracking-wider uppercase mb-3">
                <GraduationCap className="w-3.5 h-3.5" />
                <span>ACADEMIC COHORT</span>
              </div>

              {/* Headline & Subtitle */}
              <h1 className="text-2xl sm:text-[28px] font-bold text-white tracking-tight leading-snug">
                Your Academic DNA
              </h1>
              <p className="text-xs sm:text-sm text-white/60 mt-1 mb-5 leading-relaxed">
                Unlock campus-exclusive grants, cohort-restricted hackathons, and local meetups.
              </p>

              {/* Academic Form Inputs */}
              <div className="space-y-4">
                {/* Academic Year (Pill Selection Group) */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-white/70 mb-2">
                    Current Standing
                  </label>
                  <div className="grid grid-cols-3 sm:grid-cols-5 gap-1.5">
                    {["1st Year", "2nd Year", "3rd Year", "Final Yr", "Postgrad"].map((year) => {
                      const isSelected = academicYear === year;
                      return (
                        <button
                          key={year}
                          type="button"
                          onClick={() => setAcademicYear(year)}
                          className={`py-2 px-2 rounded-xl text-xs font-medium transition ${
                            year === "Postgrad" ? "col-span-2 sm:col-span-1" : ""
                          } ${
                            isSelected
                              ? "bg-sky-400 text-zinc-950 font-semibold border border-sky-300 shadow-[0_0_15px_rgba(56,189,248,0.4)]"
                              : "bg-white/5 border border-white/10 text-white/80 hover:border-sky-400 hover:text-white"
                          }`}
                        >
                          {year}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* University Name with Auto-Suggest Dropdown styling */}
                <div className="relative">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-white/70 mb-1.5">
                    University / College
                  </label>
                  <div className="relative">
                    <School className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" />
                    <input
                      type="text"
                      value={institution}
                      onChange={(e) => setInstitution(e.target.value)}
                      placeholder="e.g. Indian Institute of Technology, Bombay"
                      className="w-full glass-input rounded-2xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-white/40 outline-none"
                    />
                  </div>
                </div>

                {/* Department & Location (2-column on desktop) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-white/70 mb-1.5">
                      Department / Major
                    </label>
                    <div className="relative">
                      <Bookmark className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" />
                      <select
                        value={department}
                        onChange={(e) => setDepartment(e.target.value)}
                        className="w-full glass-input rounded-2xl pl-10 pr-8 py-2.5 text-xs text-white outline-none appearance-none cursor-pointer bg-[#181820]"
                      >
                        <option value="Computer Science & Eng.">Computer Science & Eng.</option>
                        <option value="Electrical & Electronics">Electrical & Electronics</option>
                        <option value="Data Science & AI">Data Science & AI</option>
                        <option value="Mechanical & Mechatronics">Mechanical & Mechatronics</option>
                        <option value="Business / Finance">Business / Finance</option>
                        <option value="Design & Human Computer Interaction">Design & HCI</option>
                      </select>
                      <ChevronDown className="w-4 h-4 absolute right-3.5 top-1/2 -translate-y-1/2 text-white/40 pointer-events-none" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-white/70 mb-1.5">
                      Location / City
                    </label>
                    <div className="relative">
                      <MapPin className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" />
                      <input
                        type="text"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        placeholder="e.g. Mumbai / Remote"
                        className="w-full glass-input rounded-2xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-white/40 outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* ==================== STEP 4: PRACTICAL BOUNDARIES ==================== */}
          {step === 4 && (
            <section className="animate-in fade-in duration-300">
              {/* Pill Tag */}
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#D3E57A]/15 border border-[#D3E57A]/30 text-[#D3E57A] text-[11px] font-bold tracking-wider uppercase mb-3">
                <Sliders className="w-3.5 h-3.5" />
                <span>FEASIBILITY & BOUNDARIES</span>
              </div>

              {/* Headline & Subtitle */}
              <h1 className="text-2xl sm:text-[28px] font-bold text-white tracking-tight leading-snug">
                Set Practical Boundaries
              </h1>
              <p className="text-xs sm:text-sm text-white/60 mt-1 mb-5 leading-relaxed">
                Ensure recommended opportunities align strictly with your budget, bandwidth, and location format.
              </p>

              <div className="space-y-4">
                {/* 1. Interactive Budget Ceiling */}
                <div className="p-3.5 rounded-2xl bg-[#1C1C22]/80 border border-white/10">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold uppercase tracking-wider text-white/70">
                      Application / Travel Budget
                    </span>
                    <span className="text-xs font-bold text-[#D3E57A]">
                      {budgetMode === "free"
                        ? "Free Opportunities Only"
                        : budgetMax >= 10000
                        ? "No Upper Budget Limit"
                        : `Up to ₹${Number(budgetMax).toLocaleString("en-IN")}`}
                    </span>
                  </div>

                  {/* Dual Quick Toggle */}
                  <div className="grid grid-cols-2 gap-2 mb-3">
                    <button
                      type="button"
                      onClick={() => setBudgetMode("free")}
                      className={`py-1.5 px-3 rounded-xl text-xs font-bold transition ${
                        budgetMode === "free"
                          ? "bg-white text-zinc-950 border border-white shadow-sm"
                          : "bg-white/5 border border-white/10 text-white/70 hover:text-white"
                      }`}
                    >
                      Free Only (100%)
                    </button>
                    <button
                      type="button"
                      onClick={() => setBudgetMode("custom")}
                      className={`py-1.5 px-3 rounded-xl text-xs font-medium transition ${
                        budgetMode === "custom"
                          ? "bg-white text-zinc-950 border border-white font-bold shadow-sm"
                          : "bg-white/5 border border-white/10 text-white/70 hover:text-white"
                      }`}
                    >
                      Set Ceiling (₹)
                    </button>
                  </div>

                  {/* Dynamic Slider */}
                  {budgetMode === "custom" && (
                    <div className="pt-1">
                      <div className="flex items-center justify-between text-[11px] text-white/40 mb-1">
                        <span>₹500</span>
                        <span>₹5,000</span>
                        <span>No Limit (₹10,000+)</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="10000"
                        step="500"
                        value={budgetMax}
                        onChange={(e) => setBudgetMax(Number(e.target.value))}
                        className="vybe-range w-full cursor-pointer"
                      />
                    </div>
                  )}
                </div>

                {/* 2. Weekly Availability (Segmented Pills) */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-white/70 mb-2">
                    Weekly Availability
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {[
                      { key: "Light" as const, title: "Light", desc: "2 - 5 hrs / week" },
                      { key: "Part-time" as const, title: "Part-time", desc: "5 - 10 hrs / week" },
                      { key: "Intensive" as const, title: "Intensive", desc: "15+ hrs / week" },
                    ].map((item) => {
                      const isSelected = availability === item.key;
                      return (
                        <button
                          key={item.key}
                          type="button"
                          onClick={() => setAvailability(item.key)}
                          className={`p-3 rounded-2xl text-left transition ${
                            isSelected
                              ? "bg-white text-zinc-950 ring-2 ring-[#D3E57A] shadow-glow-lime"
                              : "bg-white/5 border border-white/10 hover:border-white/30"
                          }`}
                        >
                          <div
                            className={`text-xs font-bold ${
                              isSelected ? "text-zinc-950" : "text-white"
                            }`}
                          >
                            {item.title}
                          </div>
                          <div
                            className={`text-[11px] ${
                              isSelected ? "text-zinc-700" : "text-white/50"
                            }`}
                          >
                            {item.desc}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 3. Preferred Format (3-way Toggle) */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-white/70 mb-2">
                    Preferred Format
                  </label>
                  <div className="grid grid-cols-3 gap-1.5 p-1 rounded-2xl bg-black/40 border border-white/10">
                    {[
                      { key: "online" as const, label: "Online / Remote" },
                      { key: "hybrid" as const, label: "Hybrid" },
                      { key: "onsite" as const, label: "On-site" },
                    ].map((item) => {
                      const isSelected = preferredFormat === item.key;
                      return (
                        <button
                          key={item.key}
                          type="button"
                          onClick={() => setPreferredFormat(item.key)}
                          className={`py-2 rounded-xl text-xs transition ${
                            isSelected
                              ? "font-bold bg-white/15 text-white border border-white/20"
                              : "font-medium text-white/60 hover:text-white"
                          }`}
                        >
                          {item.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* ==================== COMPLETION STATE SCREEN (STEP 5) ==================== */}
          {step === 5 && (
            <section className="text-center py-6 animate-in fade-in zoom-in-95 duration-400">
              <div className="w-16 h-16 rounded-3xl bg-[#D3E57A]/20 border border-[#D3E57A]/40 text-[#D3E57A] flex items-center justify-center mx-auto mb-4 shadow-glow-lime">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#D3E57A]/15 border border-[#D3E57A]/30 text-[#D3E57A] text-[11px] font-bold tracking-wider uppercase mb-3">
                <span>DNA PROFILE SYNCHRONIZED</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight leading-snug mb-2">
                Ready to supercharge your trajectory.
              </h1>
              <p className="text-xs sm:text-sm text-white/60 max-w-md mx-auto mb-6">
                VYBE AI has indexed 1,280+ opportunities tailored to your {institution} {department} background,{" "}
                {skills.slice(0, 2).map((s) => s.name).join(", ")} stack, and {primaryGoal} ambitions.
              </p>

              {/* Stats pill showcase */}
              <div className="grid grid-cols-3 gap-2.5 max-w-md mx-auto mb-6">
                <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
                  <div className="text-lg font-extrabold text-[#D3E57A]">42</div>
                  <div className="text-[10px] uppercase text-white/50 font-semibold">Matched Roles</div>
                </div>
                <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
                  <div className="text-lg font-extrabold text-[#D9C9F5]">88%</div>
                  <div className="text-[10px] uppercase text-white/50 font-semibold">Skill Readiness</div>
                </div>
                <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
                  <div className="text-lg font-extrabold text-white">
                    {budgetMode === "free" ? "₹0" : `₹${Number(budgetMax).toLocaleString("en-IN")}`}
                  </div>
                  <div className="text-[10px] uppercase text-white/50 font-semibold">App Fees</div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => router.push("/")}
                  className="btn-press w-full sm:w-auto px-7 py-3 rounded-full bg-[#D3E57A] text-zinc-950 font-bold text-xs sm:text-sm tracking-wide shadow-glow-lime hover:bg-[#c6d86b] transition flex items-center justify-center gap-2"
                >
                  <span>Launch Decision Engine</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="btn-press w-full sm:w-auto px-5 py-3 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-semibold text-white inline-flex items-center justify-center gap-2 transition"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Edit Profile Preferences
                </button>
              </div>
            </section>
          )}
        </main>

        {/* Card Footer Navigation (Only visible for steps 1-4) */}
        {step <= 4 && (
          <footer className="mt-8 pt-5 border-t border-white/10 flex items-center justify-between">
            {/* Left: Skip for now / Back button */}
            <div className="flex items-center gap-3">
              {step > 1 && (
                <button
                  type="button"
                  onClick={handleBack}
                  className="btn-press text-xs font-medium text-white/50 hover:text-white transition flex items-center gap-1"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  Back
                </button>
              )}
              {step < 4 && (
                <button
                  type="button"
                  onClick={() => setStep(step + 1)}
                  className="text-xs font-medium text-white/40 hover:text-white/70 transition"
                >
                  Skip for now
                </button>
              )}
            </div>

            {/* Right: Solid high-contrast pill button */}
            <button
              type="button"
              disabled={saving}
              onClick={handleNext}
              className={`btn-press px-6 py-3 rounded-full font-bold text-xs sm:text-sm tracking-wide shadow-lg flex items-center gap-2 transition ${
                step === 4
                  ? "bg-[#D3E57A] text-zinc-950 hover:bg-[#c6d86b] shadow-glow-lime border border-[#D3E57A]"
                  : "bg-white text-zinc-950 hover:bg-zinc-100 border border-white"
              }`}
            >
              <span>{saving ? "Saving DNA..." : step === 4 ? "Complete DNA Profile ✨" : "Next Step"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </footer>
        )}
      </div>
    </div>
  );
}
