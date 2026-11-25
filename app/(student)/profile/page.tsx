"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth, DEMO_AVATARS } from "@/lib/auth/auth-context";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Toggle } from "@/components/ui/checkbox";
import { SkillTag } from "@/components/ui/badge";
import { SkillsToolsSection } from "@/components/profile/skills-tools-section";
import { useTheme } from "@/lib/theme/theme-provider";
import { PERSONAS, StudentProfile } from "@/lib/data/mock-db";
import { api } from "@/lib/api/client";
import {
  User,
  Shield,
  Settings,
  Sparkles,
  Save,
  CheckCircle2,
  Trash2,
  Sun,
  Moon,
  Laptop,
} from "lucide-react";

export default function ProfileSettingsPage() {
  const router = useRouter();
  const { user, updateUser, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const [profile, setProfile] = useState<StudentProfile>(PERSONAS.beginner);

  const [name, setName] = useState(user?.name || profile.name);
  const [academicYear, setAcademicYear] = useState(user?.academic_year || profile.academic_year);
  const [department, setDepartment] = useState(user?.department || profile.department);
  const [budgetMax, setBudgetMax] = useState<number | string>(profile.budget_max);
  const [availability, setAvailability] = useState(profile.availability);
  const [publicPassport, setPublicPassport] = useState(profile.sharing_prefs.public_passport);
  const [shareAggregates, setShareAggregates] = useState(profile.sharing_prefs.share_aggregates);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  React.useEffect(() => {
    if (user?.name) setName(user.name);
    if (user?.academic_year) setAcademicYear(user.academic_year);
    if (user?.department) setDepartment(user.department);
  }, [user]);

  React.useEffect(() => {
    async function loadProfile() {
      const res = await api.students.getProfile(user?.id || 1);
      if (res.success && res.data) {
        if (!user?.name && res.data.name) setName(res.data.name);
        if (!user?.academic_year && res.data.academic_year) setAcademicYear(res.data.academic_year);
        if (!user?.department && res.data.department) setDepartment(res.data.department);
        if (res.data.budget_max !== undefined) setBudgetMax(res.data.budget_max);
        if (res.data.availability) setAvailability(res.data.availability);
        setProfile((prev) => ({
          ...prev,
          ...res.data,
          name: user?.name || res.data.name || prev.name,
          email: user?.email || res.data.email || prev.email,
        }));
      }
    }
    loadProfile();
  }, [user?.id, user?.name, user?.email]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const parsedBudget = budgetMax === "" ? 0 : Math.max(0, Number(budgetMax) || 0);
    try {
      await api.students.updateProfile(user?.id || 1, {
        name,
        academic_year: academicYear,
        department,
        budget_max: parsedBudget,
        availability,
      });
      updateUser({
        name,
        academic_year: academicYear,
        department,
      });
      setProfile((prev) => ({
        ...prev,
        name,
        academic_year: academicYear,
        department,
        budget_max: parsedBudget,
        availability,
      }));
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 2500);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex flex-col gap-8 py-2 max-w-4xl mx-auto w-full">
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#D3E57A]/30 text-[#1E1E22] dark:text-[#D3E57A] text-caption font-bold mb-2">
          <Settings className="w-3.5 h-3.5" />
          ACCOUNT & PRIVACY
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-display font-extrabold tracking-tight text-[#1E1E22] dark:text-white leading-tight">
          Profile & <span className="font-bold text-[#1E1E22] dark:text-[#D3E57A]">Settings</span>
        </h1>
        <p className="text-small sm:text-body text-[#4B5563] dark:text-gray-300 mt-1.5 font-medium">
          Manage your decision parameters, student privacy controls, and display preferences.
        </p>
      </div>

      <form onSubmit={handleSave} className="flex flex-col gap-6">
        {/* Profile Card */}
        <Card className="flex flex-col gap-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-black/5 dark:border-white/5 pb-5">
            <div className="flex items-center gap-3.5 min-w-0 flex-1">
              <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-[#FAD8C6] via-[#F6C9DD] to-[#D9C9F5] ring-2 ring-white/80 dark:ring-white/20 flex items-center justify-center font-bold text-h2 text-[#1E1E22] overflow-hidden shadow-sm shrink-0">
                {user.avatar_url ? (
                  <img src={user.avatar_url} alt={name} className="w-full h-full object-cover" />
                ) : (
                  name
                    .split(" ")
                    .filter(Boolean)
                    .map((n) => n[0])
                    .join("")
                    .slice(0, 2)
                    .toUpperCase()
                )}
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-xl font-extrabold text-[#1E1E22] dark:text-white tracking-tight">
                  {name}
                </h3>
                <span className="text-caption font-medium text-gray-500 dark:text-gray-400">
                  {profile.institution_name} · Student ID: SRMU-2026-{user?.id ? String(user.id).padStart(3, "0") : "918"}
                </span>
              </div>
            </div>

            {/* Demo Avatar Switcher */}
            <div className="flex flex-col gap-1.5 sm:items-end shrink-0">
              <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
                Choose Demo Avatar
              </span>
              <div className="flex items-center gap-2 flex-nowrap overflow-x-auto py-1">
                {DEMO_AVATARS.map((av) => {
                  const isSelected = (user.avatar_url || "/avatars/avatar-1.svg") === av.src;
                  return (
                    <button
                      key={av.id}
                      type="button"
                      onClick={() => updateUser({ avatar_url: av.src })}
                      className={`relative p-0.5 rounded-full border transition-all btn-press cursor-pointer ${
                        isSelected
                          ? "border-[#D3E57A] ring-2 ring-[#D3E57A] shadow-glow-lime scale-110"
                          : "border-black/10 dark:border-white/10 hover:border-black/30 dark:hover:border-white/30 opacity-70 hover:opacity-100"
                      }`}
                      title={av.label}
                    >
                      <img src={av.src} alt={av.label} className="w-8 h-8 rounded-full object-cover" />
                      {isSelected && (
                        <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-[#D3E57A] text-[#1E1E22] flex items-center justify-center text-[8px] font-black shadow-xs">
                          ✓
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <Input
              label="Email Address"
              value={user?.email || profile.email}
              disabled
              helperText="Managed by institutional single sign-on"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Academic Year"
              value={academicYear}
              onChange={(e) => setAcademicYear(e.target.value)}
              options={[
                { value: "1st Year", label: "1st Year" },
                { value: "2nd Year", label: "2nd Year" },
                { value: "3rd Year", label: "3rd Year" },
                { value: "4th Year", label: "4th Year" },
              ]}
            />
            <Select
              label="Department"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              options={[
                { value: "Computer Science", label: "Computer Science & Engineering" },
                { value: "Data Science", label: "Data Science & AI" },
                { value: "Business", label: "Business Administration" },
                { value: "Design", label: "Design & Media" },
              ]}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Maximum Budget (₹ INR)"
              type="number"
              min="0"
              step="500"
              placeholder="0"
              value={budgetMax}
              onFocus={(e) => {
                if (budgetMax === 0 || budgetMax === "0") {
                  e.target.select();
                }
              }}
              onChange={(e) => {
                const val = e.target.value;
                if (val === "") {
                  setBudgetMax("");
                } else {
                  // If the user types when 0 was present (e.g. "0100"), strip leading zeroes to become "100"
                  const cleaned = val.replace(/^0+(?=\d)/, "");
                  setBudgetMax(cleaned);
                }
              }}
              onBlur={() => {
                if (budgetMax === "") {
                  setBudgetMax(0);
                }
              }}
              helperText="Set to 0 if you are only looking for free opportunities."
            />
            <Select
              label="Availability"
              value={availability}
              onChange={(e) => setAvailability(e.target.value)}
              options={[
                { value: "Part-time (5-10 hrs/wk)", label: "Part-time (5-10 hrs/wk)" },
                { value: "Weekends only", label: "Weekends only" },
                { value: "Full-time", label: "Full-time" },
              ]}
            />
          </div>
        </Card>

        {/* Skills & Tools (Design, Creative & Tech Suite) */}
        <SkillsToolsSection />

        {/* Privacy & Sharing Controls */}
        <Card className="flex flex-col gap-5">
          <div className="border-b border-black/5 dark:border-white/5 pb-3">
            <h3 className="text-h3 font-bold text-[#1E1E22] dark:text-white">
              Student Privacy & Sharing Controls
            </h3>
            <p className="text-caption text-gray-500 mt-0.5">
              Control what is visible in your public Growth Passport.
            </p>
          </div>

          <div className="flex flex-col gap-4">
            <Toggle
              checked={publicPassport}
              onChange={setPublicPassport}
              label="Make Growth Passport verifiable via public share link"
            />
            <Toggle
              checked={shareAggregates}
              onChange={setShareAggregates}
              label="Contribute anonymized stage metrics to college aggregate insights (min cohort 5)"
            />
          </div>
        </Card>

        {/* Theme Settings */}
        <Card className="flex flex-col gap-4">
          <h3 className="text-h3 font-bold text-[#1E1E22] dark:text-white">
            Display Theme
          </h3>
          <div className="grid grid-cols-3 gap-3">
            {[
              { id: "light", label: "Light", icon: Sun },
              { id: "dark", label: "Dark", icon: Moon },
              { id: "system", label: "System", icon: Laptop },
            ].map((t) => {
              const Icon = t.icon;
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setTheme(t.id as any)}
                  className={`p-4 rounded-2xl flex flex-col items-center gap-2 border transition-all btn-press ${
                    theme === t.id
                      ? "bg-[#1E1E22] text-white border-[#1E1E22] dark:bg-white dark:text-[#1E1E22] shadow-sm"
                      : "bg-white/60 dark:bg-white/5 border-black/5 dark:border-white/10 text-gray-600 dark:text-gray-300"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-small font-semibold">{t.label}</span>
                </button>
              );
            })}
          </div>
        </Card>

        {/* Account & Session Management */}
        <Card className="flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-h3 font-bold text-[#1E1E22] dark:text-white">
                Account & Authentication
              </h3>
              <p className="text-caption text-gray-500 mt-0.5">
                Signed in as <strong className="text-[#1E1E22] dark:text-white">{user.name}</strong> ({user.email})
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Link href="/login">
                <Button variant="secondary" size="sm" label="Switch Account">
                  Switch Account
                </Button>
              </Link>
              <Button
                variant="ghost"
                size="sm"
                label="Sign Out"
                onClick={() => {
                  logout();
                  router.push("/login");
                }}
              >
                Sign Out
              </Button>
            </div>
          </div>
        </Card>

        <div className="flex items-center justify-between pt-2">
          {savedSuccess ? (
            <span className="inline-flex items-center gap-1.5 text-small font-bold text-[#5BAE75]">
              <CheckCircle2 className="w-4 h-4" />
              Settings updated successfully!
            </span>
          ) : <div />}

          <Button type="submit" variant="primary" size="lg" label="Save Profile Changes" className="gap-2 shadow-md">
            <Save className="w-4 h-4" />
            Save Profile Changes
          </Button>
        </div>
      </form>
    </div>
  );
}
