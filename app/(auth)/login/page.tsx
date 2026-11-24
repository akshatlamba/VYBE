"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth/auth-context";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Sparkles, Eye, EyeOff, ArrowRight } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please fill in both email and password.");
      return;
    }

    setLoading(true);
    try {
      await login(email);
      router.push("/");
    } catch {
      setError("Unable to sign in. Please verify your details.");
    } finally {
      setLoading(false);
    }
  };

  const handleDemoSignIn = async (demoEmail: string, demoName: string) => {
    setLoading(true);
    await login(demoEmail, demoName);
    router.push("/");
  };

  return (
    <div className="w-full max-w-md p-8 rounded-[32px] liquid-glass shadow-2xl border border-white/60 dark:border-white/10 bg-white/80 dark:bg-[#1E1E24]/85 backdrop-blur-2xl">
      <div className="flex flex-col items-center text-center mb-8">
        <div className="w-12 h-12 rounded-2xl bg-[#1E1E22] dark:bg-white flex items-center justify-center text-[#D3E57A] dark:text-[#1E1E22] font-black text-2xl shadow-md mb-3">
          V
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-[#1E1E22] dark:text-white">
          Welcome to VYBE
        </h1>
        <p className="text-xs text-[#6B7280] dark:text-gray-400 mt-1">
          Your World. Your Guide. Your Growth.
        </p>
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs font-medium">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input
          label="Email Address"
          type="email"
          placeholder="student@university.edu"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
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
            label={loading ? "Signing in..." : "Sign In"}
          >
            {loading ? "Signing in..." : "Sign In"}
          </Button>
        </div>
      </form>

      <div className="mt-6 pt-6 border-t border-black/5 dark:border-white/5 flex flex-col gap-3">
        <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider text-center">
          Or Quick Demo Login
        </span>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => handleDemoSignIn("aarav.patel@srm.edu.in", "Aarav Patel")}
            className="p-2.5 rounded-xl border border-black/10 dark:border-white/10 text-xs font-semibold hover:bg-black/5 dark:hover:bg-white/5 transition-all text-left"
          >
            <p className="font-bold text-[#1E1E22] dark:text-white">Aarav Patel</p>
            <p className="text-[10px] text-gray-400">CS & AI (2nd Year)</p>
          </button>
          <button
            type="button"
            onClick={() => handleDemoSignIn("riya.sen@srm.edu.in", "Riya Sen")}
            className="p-2.5 rounded-xl border border-black/10 dark:border-white/10 text-xs font-semibold hover:bg-black/5 dark:hover:bg-white/5 transition-all text-left"
          >
            <p className="font-bold text-[#1E1E22] dark:text-white">Riya Sen</p>
            <p className="text-[10px] text-gray-400">Business & Tech</p>
          </button>
        </div>
      </div>

      <div className="mt-6 text-center text-xs text-gray-500">
        Don&apos;t have an account?{" "}
        <Link href="/register" className="font-semibold text-[#1E1E22] dark:text-[#D3E57A] underline">
          Register here
        </Link>
      </div>
    </div>
  );
}
