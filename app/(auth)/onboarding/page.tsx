"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { SkillTag } from "@/components/ui/badge";
import { ProgressBar } from "@/components/ui/progress-bar";
import { Sparkles, ArrowRight, ArrowLeft, CheckCircle2, Target, BookOpen, Clock, Wallet, SkipForward } from "lucide-react";
import { useAuth } from "@/lib/auth/auth-context";

export default function OnboardingPage() {
  const router = useRouter();
  const { user, updateUser } = useAuth();
  const [step, setStep] = useState(1);

  // Step 1: Goals & Interests
  const [primaryGoal, setPrimaryGoal] = useState<"internship" | "startup" | "research" | "hackathon">("internship");
  const [interests, setInterests] = useState<string[]>(["AI Agents", "Web Development", "Python"]);
  const [interestInput, setInterestInput] = useState("");

  // Step 2: Skills & Level
  const [skills, setSkills] = useState<{ name: string; level: "Beginner" | "Intermediate" | "Advanced" }[]>([
    { name: "Python", level: "Beginner" },
    { name: "HTML/CSS", level: "Beginner" },
    { name: "Git", level: "Beginner" },
  ]);
  const [skillInput, setSkillInput] = useState("");
  const [skillLevel, setSkillLevel] = useState<"Beginner" | "Intermediate" | "Advanced">("Beginner");

  // Step 3: Academic Details
  const [academicYear, setAcademicYear] = useState("2nd Year");
  const [department, setDepartment] = useState("Computer Science");
  const [institution, setInstitution] = useState("SRM University Delhi-NCR");
  const [location, setLocation] = useState("Delhi-NCR");

  // Step 4: Budget & Availability
  const [budgetMax, setBudgetMax] = useState(1000);
  const [availability, setAvailability] = useState("Part-time (5-10 hrs/wk)");
  const [preferredFormat, setPreferredFormat] = useState<"online" | "onsite" | "hybrid" | "any">("online");

  const [saving, setSaving] = useState(false);

  const addInterest = (e: React.FormEvent) => {
    e.preventDefault();
    if (interestInput.trim() && !interests.includes(interestInput.trim())) {
      setInterests([...interests, interestInput.trim()]);
      setInterestInput("");
    }
  };

  const addSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (skillInput.trim() && !skills.some((s) => s.name.toLowerCase() === skillInput.trim().toLowerCase())) {
      setSkills([...skills, { name: skillInput.trim(), level: skillLevel }]);
      setSkillInput("");
    }
  };

  const handleFinish = async () => {
    setSaving(true);
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
          budget_max: Number(budgetMax),
          availability,
          preferred_format: preferredFormat,
          skills,
          interests,
          primary_goal: primaryGoal,
          sharing_prefs: {
            public_passport: true,
            show_email: false,
            share_aggregates: true,
          },
        }),
      });
      router.push("/");
    } catch {
      router.push("/");
    }
  };

  const handleSkip = () => {
    if (step < 4) {
      setStep(step + 1);
    } else {
      handleFinish();
    }
  };

  return (
    <div className="max-w-xl mx-auto py-8">
      {/* Step Progress Indicator */}
      <div className="mb-6">
        <div className="flex items-center justify-between text-caption font-semibold text-[#6B7280] dark:text-gray-400 mb-2">
          <span>STEP {step} OF 4</span>
          <span>{step * 25}% COMPLETE</span>
        </div>
        <ProgressBar progress={step * 25} showPercentage={false} />
      </div>

      <Card className="flex flex-col gap-6 p-6 sm:p-8">
        {step === 1 && (
          <div className="flex flex-col gap-5">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#D3E57A]/30 text-[#1E1E22] dark:text-[#D3E57A] text-caption font-bold mb-2">
                <Target className="w-3.5 h-3.5" />
                GOALS & INTERESTS
              </div>
              <h2 className="text-h1 font-light tracking-tight text-[#1E1E22] dark:text-white">
                What are you aiming for?
              </h2>
              <p className="text-small text-[#6B7280] dark:text-gray-400 mt-1">
                VYBE uses your core ambition to rank relevant hackathons, fellowships, and internships.
              </p>
            </div>

            {/* Goal Choice Pills */}
            <div className="flex flex-col gap-2">
              <label className="text-small font-medium text-[#6B7280] dark:text-gray-300">
                Primary Career Goal
              </label>
              <div className="grid grid-cols-2 gap-2.5">
                {[
                  { id: "internship", label: "Land an Internship" },
                  { id: "startup", label: "Build a Startup" },
                  { id: "research", label: "Academic Research" },
                  { id: "hackathon", label: "Win Hackathons" },
                ].map((g) => (
                  <button
                    key={g.id}
                    type="button"
                    onClick={() => setPrimaryGoal(g.id as any)}
                    className={`p-3.5 rounded-[18px] text-small font-semibold text-left transition-all btn-press border ${
                      primaryGoal === g.id
                        ? "bg-[#1E1E22] text-white border-[#1E1E22] dark:bg-white dark:text-[#1E1E22] shadow-sm"
                        : "bg-white/70 dark:bg-white/5 border-black/5 dark:border-white/10 text-[#1E1E22] dark:text-gray-200"
                    }`}
                  >
                    {g.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Interests Chips */}
            <div className="flex flex-col gap-2">
              <label className="text-small font-medium text-[#6B7280] dark:text-gray-300">
                Your Focus Interests
              </label>
              <div className="flex flex-wrap gap-2 mb-2">
                {interests.map((item) => (
                  <SkillTag
                    key={item}
                    label={item}
                    onRemove={() => setInterests(interests.filter((i) => i !== item))}
                  />
                ))}
              </div>
              <form onSubmit={addInterest} className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. Distributed Systems, FinTech"
                  value={interestInput}
                  onChange={(e) => setInterestInput(e.target.value)}
                  className="h-11 px-4 rounded-full text-small bg-white/95 dark:bg-[#222228] border border-black/5 dark:border-white/10 outline-none flex-1"
                />
                <Button type="submit" variant="secondary" size="sm" label="Add">
                  Add
                </Button>
              </form>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="flex flex-col gap-5">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#D3E57A]/30 text-[#1E1E22] dark:text-[#D3E57A] text-caption font-bold mb-2">
                <BookOpen className="w-3.5 h-3.5" />
                SKILLS & PROFICIENCY
              </div>
              <h2 className="text-h1 font-light tracking-tight text-[#1E1E22] dark:text-white">
                What are your core skills?
              </h2>
              <p className="text-small text-[#6B7280] dark:text-gray-400 mt-1">
                We compare these against prerequisite skill lists to reveal your exact readiness gaps.
              </p>
            </div>

            <div className="flex flex-wrap gap-2 mb-2">
              {skills.map((s) => (
                <span
                  key={s.name}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-caption font-medium bg-[#D9C9F5]/30 text-[#45366E] dark:bg-[#D9C9F5]/20 dark:text-[#E2D5FC] border border-[#D9C9F5]/50"
                >
                  <span>{s.name}</span>
                  <span className="text-[10px] opacity-75 font-bold">({s.level})</span>
                  <button
                    type="button"
                    onClick={() => setSkills(skills.filter((x) => x.name !== s.name))}
                    className="ml-1 text-gray-500 hover:text-black dark:hover:text-white"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>

            <form onSubmit={addSkill} className="grid grid-cols-1 sm:grid-cols-[1fr_130px_auto] gap-2 items-center">
              <input
                type="text"
                placeholder="Skill name (e.g. Next.js)"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                className="h-11 px-4 rounded-full text-small bg-white/95 dark:bg-[#222228] border border-black/5 dark:border-white/10 outline-none"
              />
              <select
                value={skillLevel}
                onChange={(e) => setSkillLevel(e.target.value as any)}
                className="h-11 px-3 rounded-full text-small bg-white/95 dark:bg-[#222228] border border-black/5 dark:border-white/10 outline-none"
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
              <Button type="submit" variant="secondary" size="sm" label="Add">
                Add
              </Button>
            </form>
          </div>
        )}

        {step === 3 && (
          <div className="flex flex-col gap-5">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#D3E57A]/30 text-[#1E1E22] dark:text-[#D3E57A] text-caption font-bold mb-2">
                <Sparkles className="w-3.5 h-3.5" />
                ACADEMICS & CAMPUS
              </div>
              <h2 className="text-h1 font-light tracking-tight text-[#1E1E22] dark:text-white">
                Academic Standing
              </h2>
              <p className="text-small text-[#6B7280] dark:text-gray-400 mt-1">
                Hard eligibility criteria require verified department and academic year parameters.
              </p>
            </div>

            <Select
              label="Academic Year"
              value={academicYear}
              onChange={(e) => setAcademicYear(e.target.value)}
              options={[
                { value: "1st Year", label: "1st Year (Freshman)" },
                { value: "2nd Year", label: "2nd Year (Sophomore)" },
                { value: "3rd Year", label: "3rd Year (Junior)" },
                { value: "4th Year", label: "4th Year (Senior)" },
                { value: "Postgraduate", label: "Postgraduate (Masters/PhD)" },
              ]}
            />

            <Select
              label="Department / Major Discipline"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              options={[
                { value: "Computer Science", label: "Engineering: Computer Science & AI" },
                { value: "Electrical", label: "Engineering: Electrical & Electronics" },
                { value: "Mechanical", label: "Engineering: Mechanical & Robotics" },
                { value: "Sciences", label: "Natural Sciences & Physics / Biotech" },
                { value: "Economics", label: "Economics & Finance" },
                { value: "Business", label: "Business Administration & Management" },
                { value: "Design", label: "Design: UX/UI & Creative Media" },
                { value: "Law", label: "Law & Public Policy" },
                { value: "Humanities", label: "Psychology & Humanities" },
                { value: "Healthcare", label: "Medicine & Health Sciences" },
              ]}
            />

            <Input
              label="Institution / University (Optional)"
              value={institution}
              onChange={(e) => setInstitution(e.target.value)}
              placeholder="e.g. SRM University, Delhi University, IIT Delhi"
            />

            <Input
              label="Campus Location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. Delhi-NCR, Bangalore"
            />
          </div>
        )}

        {step === 4 && (
          <div className="flex flex-col gap-5">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#D3E57A]/30 text-[#1E1E22] dark:text-[#D3E57A] text-caption font-bold mb-2">
                <Wallet className="w-3.5 h-3.5" />
                BUDGET & AVAILABILITY
              </div>
              <h2 className="text-h1 font-light tracking-tight text-[#1E1E22] dark:text-white">
                Logistics & Availability
              </h2>
              <p className="text-small text-[#6B7280] dark:text-gray-400 mt-1">
                Ensures we exclude paid events outside your budget and recommend workable schedules.
              </p>
            </div>

            <Input
              label="Maximum Budget (₹ INR)"
              type="number"
              value={budgetMax}
              onChange={(e) => setBudgetMax(Number(e.target.value))}
              helperText="Set to 0 if you only want 100% free opportunities."
            />

            <Select
              label="Weekly Availability"
              value={availability}
              onChange={(e) => setAvailability(e.target.value)}
              options={[
                { value: "Part-time (5-10 hrs/wk)", label: "Part-time (5-10 hrs/week)" },
                { value: "Weekends only", label: "Weekends only" },
                { value: "Full-time", label: "Full-time (Vacations / Gap)" },
              ]}
            />

            <Select
              label="Preferred Format"
              value={preferredFormat}
              onChange={(e) => setPreferredFormat(e.target.value as any)}
              options={[
                { value: "online", label: "Online / Virtual only" },
                { value: "hybrid", label: "Hybrid" },
                { value: "onsite", label: "Onsite" },
                { value: "any", label: "Any format" },
              ]}
            />
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between pt-4 border-t border-black/5 dark:border-white/5">
          <div className="flex items-center gap-2">
            {step > 1 && (
              <Button
                type="button"
                variant="secondary"
                label="Back"
                onClick={() => setStep(step - 1)}
                className="gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </Button>
            )}
            <button
              type="button"
              onClick={handleSkip}
              className="text-xs font-semibold text-gray-500 hover:text-[#1E1E22] dark:hover:text-white px-3 py-2 rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
            >
              Skip
            </button>
          </div>

          {step < 4 ? (
            <Button
              type="button"
              variant="primary"
              label="Next Step"
              onClick={() => setStep(step + 1)}
              className="gap-2 ml-auto"
            >
              Next Step
              <ArrowRight className="w-4 h-4" />
            </Button>
          ) : (
            <Button
              type="button"
              variant="primary"
              label={saving ? "Configuring..." : "Complete Setup"}
              onClick={handleFinish}
              disabled={saving}
              className="gap-2 ml-auto bg-[#D3E57A] text-[#1E1E22] hover:bg-[#C5DA62]"
            >
              <CheckCircle2 className="w-4 h-4" />
              {saving ? "Configuring..." : "Complete Setup"}
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
}
