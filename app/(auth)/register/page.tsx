"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth/auth-context";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { Eye, EyeOff } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [department, setDepartment] = useState("Computer Science");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name || !email || !password) {
      setError("Please fill in all required fields.");
      return;
    }

    setLoading(true);
    try {
      await login(email, name);
      router.push("/onboarding");
    } catch {
      setError("Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md p-8 rounded-[32px] liquid-glass shadow-2xl border border-white/60 dark:border-white/10 bg-white/80 dark:bg-[#1E1E24]/85 backdrop-blur-2xl">
      <div className="flex flex-col items-center text-center mb-6">
        <div className="w-12 h-12 rounded-2xl bg-[#1E1E22] dark:bg-white flex items-center justify-center text-[#D3E57A] dark:text-[#1E1E22] font-black text-2xl shadow-md mb-3">
          V
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-[#1E1E22] dark:text-white">
          Create VYBE Account
        </h1>
        <p className="text-xs text-[#6B7280] dark:text-gray-400 mt-1">
          Discover opportunities and build your verified student profile.
        </p>
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs font-medium">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
        <Input
          label="Full Name"
          placeholder="e.g. Aarav Patel"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <Input
          label="College / Student Email"
          type="email"
          placeholder="student@university.edu"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <Select
          label="Academic Discipline"
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
          options={[
            { value: "Computer Science", label: "Computer Science & Engineering" },
            { value: "Electrical", label: "Electrical & Electronics" },
            { value: "Mechanical", label: "Mechanical Engineering" },
            { value: "Business", label: "Business & Commerce" },
            { value: "Design", label: "Design & Creative Fields" },
            { value: "Sciences", label: "Natural Sciences & Research" },
            { value: "Humanities", label: "Arts & Humanities" },
            { value: "Healthcare", label: "Medical & Healthcare" },
            { value: "Law", label: "Law & Public Policy" },
          ]}
        />

        <div className="relative">
          <Input
            label="Password"
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-9 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>

        <div className="pt-2">
          <Button
            type="submit"
            variant="primary"
            fullWidth
            size="lg"
            disabled={loading}
            label={loading ? "Creating account..." : "Start Onboarding"}
          >
            {loading ? "Creating account..." : "Start Onboarding"}
          </Button>
        </div>
      </form>

      <div className="mt-6 text-center text-xs text-gray-500">
        Already have an account?{" "}
        <Link href="/login" className="font-semibold text-[#1E1E22] dark:text-[#D3E57A] underline">
          Sign In
        </Link>
      </div>
    </div>
  );
}
