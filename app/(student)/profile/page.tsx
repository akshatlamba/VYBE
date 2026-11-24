"use client";

import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Toggle } from "@/components/ui/checkbox";
import { SkillTag } from "@/components/ui/badge";
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
  const { theme, setTheme } = useTheme();
  const [profile, setProfile] = useState<StudentProfile>(PERSONAS.beginner);

  const [name, setName] = useState(profile.name);
  const [academicYear, setAcademicYear] = useState(profile.academic_year);
  const [department, setDepartment] = useState(profile.department);
  const [budgetMax, setBudgetMax] = useState(profile.budget_max);
  const [availability, setAvailability] = useState(profile.availability);
  const [publicPassport, setPublicPassport] = useState(profile.sharing_prefs.public_passport);
  const [shareAggregates, setShareAggregates] = useState(profile.sharing_prefs.share_aggregates);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  React.useEffect(() => {
    async function loadProfile() {
      const res = await api.students.getProfile(1);
      if (res.success && res.data) {
        if (res.data.name) setName(res.data.name);
        if (res.data.academic_year) setAcademicYear(res.data.academic_year);
        if (res.data.department) setDepartment(res.data.department);
        if (res.data.budget_max !== undefined) setBudgetMax(Number(res.data.budget_max));
        if (res.data.availability) setAvailability(res.data.availability);
        setProfile((prev) => ({ ...prev, ...res.data }));
      }
    }
    loadProfile();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.students.updateProfile(1, {
        name,
        academic_year: academicYear,
        department,
        budget_max: budgetMax,
        availability,
      });
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 2500);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex flex-col gap-8 py-2 max-w-3xl mx-auto">
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#D3E57A]/30 text-[#1E1E22] dark:text-[#D3E57A] text-caption font-bold mb-2">
          <Settings className="w-3.5 h-3.5" />
          ACCOUNT & PRIVACY
        </div>
        <h1 className="text-display font-light tracking-tight text-[#1E1E22] dark:text-white leading-tight">
          Profile & <span className="font-normal">Settings</span>
        </h1>
        <p className="text-small text-[#6B7280] dark:text-gray-400 mt-1">
          Manage your decision parameters, student privacy controls, and display preferences.
        </p>
      </div>

      <form onSubmit={handleSave} className="flex flex-col gap-6">
        {/* Profile Card */}
        <Card className="flex flex-col gap-5">
          <div className="flex items-center gap-3 border-b border-black/5 dark:border-white/5 pb-4">
            <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-[#FAD8C6] via-[#F6C9DD] to-[#D9C9F5] flex items-center justify-center font-bold text-h3 text-[#1E1E22]">
              {name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
            </div>
            <div>
              <h3 className="text-h3 font-bold text-[#1E1E22] dark:text-white">
                {name}
              </h3>
              <span className="text-caption text-gray-500">
                {profile.institution_name} · Student ID: SRMU-2026-918
              </span>
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
              value={profile.email}
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
              value={budgetMax}
              onChange={(e) => setBudgetMax(Number(e.target.value))}
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
