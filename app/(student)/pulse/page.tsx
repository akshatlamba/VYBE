"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ProgressRing } from "@/components/ui/progress-ring";
import {
  Sparkles,
  Send,
  ArrowRight,
  BookmarkPlus,
  Compass,
  CheckCircle2,
  TrendingUp,
  Brain,
  Layers,
  GraduationCap,
  Building2,
  BookOpen,
} from "lucide-react";
import { INITIAL_SIGNALS, PERSONAS, StudentProfile, WorldSignal } from "@/lib/data/mock-db";
import { ActionProposal } from "@/lib/ai/provider";

interface ChatMessage {
  id: string;
  sender: "user" | "pulse";
  content: string;
  why_this?: string;
  action_proposals?: ActionProposal[];
  opportunity_ids?: string[];
  timestamp: string;
}

function PulseContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const signalId = searchParams.get("signal_id");

  // Selected persona state (switches between beginner, startup, research)
  const [selectedPersonaKey, setSelectedPersonaKey] = useState<"beginner" | "startup" | "research">("beginner");
  const student: StudentProfile = PERSONAS[selectedPersonaKey];

  const [inputMessage, setInputMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [addedTasks, setAddedTasks] = useState<string[]>([]);

  // Default initial message based on persona
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  useEffect(() => {
    // Initial welcome message tailored to persona
    const initialWelcome: ChatMessage = {
      id: "welcome-1",
      sender: "pulse",
      content: `Welcome to **PULSE**, ${student.name}. I am your growth decision intelligence guide.

I analyze global signals and student opportunities through your personal context (${student.academic_year} ${student.department}, focusing on **${student.primary_goal}**).`,
      why_this: `Configured for ${student.name} (${selectedPersonaKey} track).`,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    if (signalId) {
      const sig = INITIAL_SIGNALS.find((s) => s.id === signalId);
      if (sig) {
        handleSendSignalQuery(sig, selectedPersonaKey);
        return;
      }
    }

    setMessages([initialWelcome]);
  }, [selectedPersonaKey, signalId]);

  const handleSendSignalQuery = async (sig: WorldSignal, personaKey: string) => {
    setLoading(true);
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: "user",
      content: `How does the signal "${sig.title}" affect my path as a ${PERSONAS[personaKey].academic_year} student?`,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);

    try {
      const res = await fetch("/api/pulse", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMsg.content,
          signal_id: sig.id,
          persona_id: personaKey,
        }),
      });
      const json = await res.json();
      if (json.success && json.data) {
        const pulseMsg: ChatMessage = {
          id: `pulse-${Date.now()}`,
          sender: "pulse",
          content: json.data.content,
          why_this: json.data.why_this,
          action_proposals: json.data.action_proposals,
          opportunity_ids: json.data.opportunity_ids,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        };
        setMessages((prev) => [...prev, pulseMsg]);
      }
    } catch {
      // Handled
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || loading) return;

    const query = inputMessage.trim();
    setInputMessage("");

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: "user",
      content: query,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    try {
      const res = await fetch("/api/pulse", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: query,
          persona_id: selectedPersonaKey,
        }),
      });
      const json = await res.json();
      if (json.success && json.data) {
        const pulseMsg: ChatMessage = {
          id: `pulse-${Date.now()}`,
          sender: "pulse",
          content: json.data.content,
          why_this: json.data.why_this,
          action_proposals: json.data.action_proposals,
          opportunity_ids: json.data.opportunity_ids,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        };
        setMessages((prev) => [...prev, pulseMsg]);
      }
    } catch {
      // Handled
    } finally {
      setLoading(false);
    }
  };

  const handleAddToActionPlan = (title: string) => {
    setAddedTasks((prev) => [...prev, title]);
  };

  return (
    <div className="flex flex-col gap-6 py-2 max-w-4xl mx-auto">
      {/* Header with Persona Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-black/5 dark:border-white/5">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#D3E57A]/30 text-[#1E1E22] dark:text-[#D3E57A] text-caption font-bold mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            PULSE CONVERSATIONAL INTELLIGENCE
          </div>
          <h1 className="text-display font-light tracking-tight text-[#1E1E22] dark:text-white leading-tight">
            Ask <span className="font-normal">PULSE</span>
          </h1>
          <p className="text-small text-[#6B7280] dark:text-gray-400">
            From knowing what&apos;s changing in the world to knowing what to do next.
          </p>
        </div>

        {/* 3 Seeded Personas Toggle */}
        <div className="flex flex-col gap-1 sm:items-end">
          <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
            Test Seeded Persona
          </span>
          <div className="flex items-center gap-1 bg-white/80 dark:bg-white/10 p-1 rounded-full border border-black/5 dark:border-white/10">
            <button
              onClick={() => setSelectedPersonaKey("beginner")}
              className={`px-3 py-1 rounded-full text-caption font-semibold transition-all ${
                selectedPersonaKey === "beginner"
                  ? "bg-[#1E1E22] text-white dark:bg-white dark:text-[#1E1E22] shadow-xs"
                  : "text-gray-600 dark:text-gray-300"
              }`}
            >
              Beginner (Internship)
            </button>
            <button
              onClick={() => setSelectedPersonaKey("startup")}
              className={`px-3 py-1 rounded-full text-caption font-semibold transition-all ${
                selectedPersonaKey === "startup"
                  ? "bg-[#1E1E22] text-white dark:bg-white dark:text-[#1E1E22] shadow-xs"
                  : "text-gray-600 dark:text-gray-300"
              }`}
            >
              Startup (Business)
            </button>
            <button
              onClick={() => setSelectedPersonaKey("research")}
              className={`px-3 py-1 rounded-full text-caption font-semibold transition-all ${
                selectedPersonaKey === "research"
                  ? "bg-[#1E1E22] text-white dark:bg-white dark:text-[#1E1E22] shadow-xs"
                  : "text-gray-600 dark:text-gray-300"
              }`}
            >
              Research (Advanced)
            </button>
          </div>
        </div>
      </div>

      {/* World Signals Strip: Click to Analyze */}
      <div className="flex flex-col gap-2">
        <span className="text-caption font-bold text-gray-500 uppercase tracking-wider px-1">
          Select Global Signal to Analyze
        </span>
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
          {INITIAL_SIGNALS.map((sig) => (
            <button
              key={sig.id}
              onClick={() => handleSendSignalQuery(sig, selectedPersonaKey)}
              className="px-4 py-2 rounded-full text-caption font-medium bg-white/80 dark:bg-white/10 text-[#1E1E22] dark:text-white border border-black/5 dark:border-white/10 hover:bg-[#D3E57A]/20 transition-all btn-press shrink-0 flex items-center gap-2"
            >
              <TrendingUp className="w-3.5 h-3.5 text-[#2F6BFF]" />
              <span className="truncate max-w-[220px]">{sig.title}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Chat Messages Log */}
      <div className="flex flex-col gap-6 min-h-[400px]">
        {messages.map((msg) => {
          const isPulse = msg.sender === "pulse";
          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isPulse ? "items-start" : "items-end"} gap-2`}
            >
              <div className="flex items-center gap-2 px-2">
                <span className="text-[11px] font-bold text-gray-400">
                  {isPulse ? "PULSE Guide" : student.name}
                </span>
                <span className="text-[10px] text-gray-400">{msg.timestamp}</span>
              </div>

              <div
                className={`p-6 rounded-[28px] max-w-2xl text-body shadow-sm ${
                  isPulse
                    ? "glass-surface bg-white/85 dark:bg-[#1E1E24]/85 text-[#1E1E22] dark:text-white border border-white/60 dark:border-white/10"
                    : "bg-[#1E1E22] text-white dark:bg-white dark:text-[#1E1E22] rounded-br-sm"
                }`}
              >
                <div className="whitespace-pre-line leading-relaxed">
                  {msg.content}
                </div>

                {/* "Why this" Line */}
                {msg.why_this && (
                  <div className="mt-4 pt-3 border-t border-black/5 dark:border-white/10 text-small text-[#6B7280] dark:text-gray-300 font-medium">
                    🔍 <strong className="text-[#1E1E22] dark:text-white">Why this:</strong>{" "}
                    {msg.why_this}
                  </div>
                )}

                {/* Concrete Next Steps (Learn, Build, Apply) */}
                {msg.action_proposals && msg.action_proposals.length > 0 && (
                  <div className="mt-5 flex flex-col gap-3">
                    <span className="text-caption font-bold text-gray-400 uppercase tracking-wider">
                      Proposed Next Steps (Action Plan)
                    </span>
                    <div className="flex flex-col gap-2">
                      {msg.action_proposals.map((prop, idx) => {
                        const isAdded = addedTasks.includes(prop.title);
                        return (
                          <div
                            key={idx}
                            className="p-3.5 rounded-2xl bg-black/[0.03] dark:bg-white/5 border border-black/5 dark:border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                          >
                            <div className="flex items-start gap-2.5">
                              <span
                                className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase shrink-0 mt-0.5 ${
                                  prop.kind === "learn"
                                    ? "bg-[#D9C9F5]/50 text-[#3D2D69]"
                                    : prop.kind === "build"
                                    ? "bg-[#FAD8C6] text-[#784323]"
                                    : "bg-[#D3E57A] text-[#4A5418]"
                                }`}
                              >
                                {prop.kind}
                              </span>
                              <div className="flex flex-col">
                                <span className="font-semibold text-small">
                                  {prop.title}
                                </span>
                                <span className="text-caption text-gray-500">
                                  {prop.description}
                                </span>
                              </div>
                            </div>

                            <button
                              type="button"
                              onClick={() => handleAddToActionPlan(prop.title)}
                              disabled={isAdded}
                              className={`px-3 py-1.5 rounded-full text-caption font-semibold transition-all btn-press shrink-0 ${
                                isAdded
                                  ? "bg-[#5BAE75]/20 text-[#2B7343] dark:text-[#78C991]"
                                  : "bg-[#1E1E22] text-white hover:bg-black dark:bg-white dark:text-[#1E1E22]"
                              }`}
                            >
                              {isAdded ? "✓ Added to Plan" : "+ Add to Action Plan"}
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* "See opportunities" Button */}
                {msg.opportunity_ids && msg.opportunity_ids.length > 0 && (
                  <div className="mt-4 pt-3 flex items-center justify-end">
                    <Link href="/radar">
                      <Button variant="secondary" size="sm" label="See Matched Opportunities" className="gap-1.5">
                        <Compass className="w-4 h-4 text-[#2F6BFF]" />
                        See Matched Opportunities
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {loading && (
          <div className="flex items-center gap-2 p-4 rounded-2xl glass-surface w-fit">
            <span className="w-2 h-2 rounded-full bg-[#1E1E22] dark:bg-white animate-ping" />
            <span className="text-small text-gray-500">PULSE is contextualizing guidance...</span>
          </div>
        )}
      </div>

      {/* Input Form */}
      <form onSubmit={handleSendMessage} className="sticky bottom-6 mt-4">
        <div className="flex items-center gap-2 p-2 rounded-full glass-surface bg-white/90 dark:bg-[#1E1E24]/90 backdrop-blur-2xl border border-white/60 dark:border-white/10 shadow-lg">
          <input
            type="text"
            placeholder="Ask PULSE anything about skills, projects, or next steps..."
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            disabled={loading}
            className="flex-1 h-12 px-5 bg-transparent outline-none text-body text-[#1E1E22] dark:text-white placeholder:text-gray-400"
          />
          <Button
            type="submit"
            variant="round-icon-black"
            disabled={!inputMessage.trim() || loading}
            label="Send"
            aria-label="Send message to PULSE"
          >
            <Send className="w-4 h-4 stroke-[2]" />
          </Button>
        </div>
      </form>
    </div>
  );
}

export default function PulsePage() {
  return (
    <Suspense fallback={<div className="p-8">Loading PULSE guide...</div>}>
      <PulseContent />
    </Suspense>
  );
}
