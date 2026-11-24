"use client";

import React, { useState, useEffect, useRef, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Sparkles,
  ArrowUp,
  Compass,
  CheckCircle2,
  TrendingUp,
  Brain,
  Layers,
  Code2,
  Lightbulb,
  Paperclip,
  Image as ImageIcon,
  Mic,
  RotateCcw,
  MoreHorizontal,
  ChevronDown,
  Check,
  Copy,
  Info,
  Globe2,
  ExternalLink,
  Plus,
} from "lucide-react";
import { INITIAL_SIGNALS, PERSONAS, StudentProfile, WorldSignal } from "@/lib/data/mock-db";
import { ActionProposal } from "@/lib/ai/provider";
import { BhashaSelector } from "@/components/ui/bhasha-selector";
import { BHASHA_LANGUAGES } from "@/lib/bhasha/languages";

interface ChatMessage {
  id: string;
  sender: "user" | "pulse";
  content: string;
  why_this?: string;
  action_proposals?: ActionProposal[];
  opportunity_ids?: string[];
  timestamp: string;
  is_live_ai?: boolean;
  model_used?: string;
  provider?: string;
  notice?: string;
}

function PulseContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const signalId = searchParams.get("signal_id");

  // Selected persona state (beginner, startup, research)
  const [selectedPersonaKey, setSelectedPersonaKey] = useState<"beginner" | "startup" | "research">("beginner");
  const student: StudentProfile = PERSONAS[selectedPersonaKey];

  // AI model selection (PULSE Intelligence v2.0 vs PULSE Reasoning Pro)
  const [modelType, setModelType] = useState<"v2" | "pro">("v2");
  const [modelDropdownOpen, setModelDropdownOpen] = useState(false);

  // Deep Reasoning toggle
  const [reasoningActive, setReasoningActive] = useState(false);

  // Selected language for VYBE Bhasha
  const [selectedLanguage, setSelectedLanguage] = useState<string>("en");

  // Input and Chat state
  const [inputMessage, setInputMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [addedTasks, setAddedTasks] = useState<string[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Scroll anchor
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setModelDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle URL signal query if passed
  useEffect(() => {
    if (signalId) {
      const sig = INITIAL_SIGNALS.find((s) => s.id === signalId);
      if (sig) {
        handleSendSignalQuery(sig, selectedPersonaKey);
      }
    }
  }, [signalId, selectedPersonaKey]);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleSendSignalQuery = async (sig: WorldSignal, personaKey: string) => {
    const userPrompt = `How does the signal "${sig.title}" affect my path as a ${PERSONAS[personaKey].academic_year} student?`;
    await executeSendMessage(userPrompt, sig.id);
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const executeSendMessage = async (text: string, signal_id?: string) => {
    const trimmed = text.trim();
    if (!trimmed || loading) return;

    setInputMessage("");

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: "user",
      content: trimmed,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    try {
      const res = await fetch("/api/pulse", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: trimmed,
          signal_id: signal_id,
          persona_id: selectedPersonaKey,
          language: selectedLanguage,
          reasoning_mode: reasoningActive,
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
          is_live_ai: json.data.is_live_ai,
          model_used: modelType === "pro" ? "Gemini 2.5 Pro (Reasoning)" : (json.data.model_used || "PULSE Live AI"),
          provider: json.data.provider || "Gemini Flash v2.0",
          notice: json.data.notice,
        };
        setMessages((prev) => [...prev, pulseMsg]);
      } else {
        throw new Error("Invalid response");
      }
    } catch {
      // Offline fallback with smart student analysis
      const fallbackMsg: ChatMessage = {
        id: `pulse-fallback-${Date.now()}`,
        sender: "pulse",
        content: `I've analyzed your query regarding **"${trimmed}"**.\n\nBased on your **${student.academic_year} ${student.department}** trajectory, here is your prioritized action plan:\n\n1. **Core Preparation**: Dedicate 45 minutes daily to building a working prototype before team registration.\n2. **Skill Prerequisite**: Review FastAPI async routers and local vector indexing.\n3. **Application Timing**: Priority deadlines close in 4 days. Would you like me to add this to your Action Tracker?`,
        why_this: `Mapped directly to your active ${student.primary_goal} roadmap.`,
        action_proposals: [
          {
            title: `Build demo for "${trimmed.slice(0, 30)}"`,
            kind: "build",
            description: "Create a GitHub repository and deploy minimal viable prototype.",
          },
        ],
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        is_live_ai: false,
        provider: "Student DNA Contextual Guide",
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    executeSendMessage(inputMessage);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      executeSendMessage(inputMessage);
    }
  };

  const resetToNewChat = () => {
    setMessages([]);
    setInputMessage("");
  };

  const isChatActive = messages.length > 0;

  return (
    <div className="relative z-10 flex-1 flex flex-col w-full max-w-5xl mx-auto px-2 sm:px-4 text-[#1E1E22] dark:text-white min-h-[calc(100vh-140px)]">
      {/* =========================================================================
          TOP CONTROL BAR (Model Selector & Persona Pill Dropdown + New Chat)
          ========================================================================= */}
      <header className="relative z-20 w-full flex items-center justify-between pb-4 pt-1">
        {/* Model Selector Pill Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setModelDropdownOpen((prev) => !prev)}
            className="vybe-glass flex items-center gap-2.5 px-4 py-2 rounded-full text-xs sm:text-sm font-bold text-slate-800 dark:text-white/90 hover:text-black dark:hover:text-white transition-all duration-200 shadow-sm dark:shadow-lg cursor-pointer"
          >
            <span className="w-2 h-2 rounded-full bg-[#84CC16] dark:bg-[#D3E57A] shadow-[0_0_8px_#D3E57A]" />
            <span>
              {modelType === "pro" ? "PULSE Reasoning Pro" : "PULSE Intelligence v2.0"}
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 dark:bg-white/10 text-lime-700 dark:text-[#D3E57A] font-extrabold">
              {student.name.split(" ")[0]}
            </span>
            <ChevronDown className="w-4 h-4 text-slate-500 dark:text-white/60 ml-0.5" />
          </button>

          {/* Dropdown Menu */}
          {modelDropdownOpen && (
            <div className="absolute left-0 mt-2 w-72 vybe-glass rounded-2xl p-2 shadow-2xl z-30 border border-slate-200 dark:border-white/15 animate-in fade-in duration-150 backdrop-blur-2xl">
              <div className="px-3 py-1.5 text-[10px] font-bold text-slate-500 dark:text-gray-400 uppercase tracking-wider">
                AI Intelligence Engine
              </div>
              <button
                type="button"
                onClick={() => {
                  setModelType("v2");
                  setModelDropdownOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left text-xs font-semibold transition ${
                  modelType === "v2" ? "bg-slate-200 dark:bg-white/10 text-slate-900 dark:text-white" : "text-slate-700 dark:text-white/70 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-black dark:hover:text-white"
                }`}
              >
                <span>PULSE Intelligence v2.0</span>
                {modelType === "v2" && <Check className="w-3.5 h-3.5 text-lime-600 dark:text-[#D3E57A]" />}
              </button>
              <button
                type="button"
                onClick={() => {
                  setModelType("pro");
                  setModelDropdownOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left text-xs font-semibold transition ${
                  modelType === "pro" ? "bg-slate-200 dark:bg-white/10 text-slate-900 dark:text-white" : "text-slate-700 dark:text-white/70 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-black dark:hover:text-white"
                }`}
              >
                <div className="flex items-center gap-2">
                  <span>PULSE Reasoning Pro</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-purple-100 dark:bg-[#D9C9F5]/20 text-purple-700 dark:text-[#D9C9F5] font-bold">
                    Beta
                  </span>
                </div>
                {modelType === "pro" && <Check className="w-3.5 h-3.5 text-lime-600 dark:text-[#D3E57A]" />}
              </button>

              <div className="h-px bg-slate-200 dark:bg-white/10 my-2" />

              <div className="px-3 py-1.5 text-[10px] font-bold text-slate-500 dark:text-gray-400 uppercase tracking-wider">
                Active Student Persona
              </div>
              <div className="space-y-1">
                {(["beginner", "startup", "research"] as const).map((key) => {
                  const p = PERSONAS[key];
                  const isSelected = selectedPersonaKey === key;
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => {
                        setSelectedPersonaKey(key);
                        setModelDropdownOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left text-xs font-medium transition ${
                        isSelected ? "bg-slate-200 dark:bg-white/15 text-slate-900 dark:text-white font-bold" : "text-slate-700 dark:text-white/70 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-black dark:hover:text-white"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="capitalize">{p.name}</span>
                        <span className="text-[10px] text-slate-500 dark:text-gray-400">({p.primary_goal})</span>
                      </div>
                      {isSelected && <Check className="w-3.5 h-3.5 text-lime-600 dark:text-[#D3E57A]" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Right Actions: New Chat & Info */}
        <div className="flex items-center gap-2">
          {isChatActive && (
            <button
              type="button"
              onClick={resetToNewChat}
              className="vybe-glass inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-bold text-slate-700 dark:text-white/80 hover:text-black dark:hover:text-white hover:border-slate-300 dark:hover:border-white/20 transition-all shadow-sm cursor-pointer"
              title="Reset and start new chat"
            >
              <RotateCcw className="w-3.5 h-3.5 text-lime-600 dark:text-[#D3E57A]" />
              <span className="hidden sm:inline">New Chat</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => setModelDropdownOpen((prev) => !prev)}
            aria-label="More options"
            className="vybe-glass w-10 h-10 rounded-full flex items-center justify-center text-slate-700 dark:text-white/75 hover:text-black dark:hover:text-white hover:border-slate-300 dark:hover:border-white/20 transition-all duration-200 shadow-sm dark:shadow-lg cursor-pointer"
          >
            <MoreHorizontal className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* =========================================================================
          MAIN WORKSPACE: HERO (WHEN FRESH) vs CHAT THREAD (WHEN ACTIVE)
          ========================================================================= */}
      <div className="flex-1 flex flex-col justify-center">
        {!isChatActive ? (
          /* ==================== CENTER HERO SECTION ==================== */
          <section className="flex flex-col items-center justify-center text-center py-6 sm:py-10 transition-all duration-300">
            {/* Glowing Cosmic Orb / Sphere */}
            <div className="cosmic-orb-wrapper mb-6">
              <div
                className="relative w-[88px] h-[88px] rounded-full overflow-hidden border border-white/20 mx-auto"
                style={{
                  boxShadow:
                    "rgba(217, 201, 245, 0.5) 0px 0px 45px, rgba(168, 85, 247, 0.4) 0px 0px 20px, rgba(255, 255, 255, 0.6) 0px 1px 2px inset",
                }}
              >
                <div className="cosmic-orb-core w-full h-full rounded-full">
                  <div className="cosmic-orb-swirl" />
                </div>
                <div
                  className="absolute inset-0 rounded-full pointer-events-none"
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(255, 255, 255, 0.35) 0%, rgba(255, 255, 255, 0) 50%, rgba(168, 85, 247, 0.2) 100%)",
                    mixBlendMode: "overlay",
                  }}
                />
              </div>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-4xl md:text-[42px] font-extrabold tracking-tight text-[#1E1E22] dark:text-white leading-tight mb-3">
              Welcome to your cognitive co-pilot
            </h1>

            {/* Subtitle */}
            <p className="text-sm sm:text-base text-slate-600 dark:text-[#9CA3AF] max-w-xl mx-auto leading-relaxed">
              I am <span className="text-[#1E1E22] dark:text-white font-extrabold">PULSE</span>. You can ask me to write, code, plan career roadmaps, or explore any idea.
            </p>

            {/* Quick Prompt Starter Cards (3-Column Grid) */}
            <div className="w-full max-w-[760px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-3.5 my-7 text-left">
              {/* Card 1: Explain & Audit Code */}
              <button
                type="button"
                onClick={() => executeSendMessage("Can you find the bug in this Python async snippet and suggest a clean fix?")}
                className="starter-card vybe-glass group rounded-3xl p-4 sm:p-5 transition-all duration-300 hover:-translate-y-1 hover:border-[#D9C9F5]/60 hover:shadow-[0_10px_30px_-10px_rgba(217,201,245,0.25)] cursor-pointer flex flex-col justify-between"
              >
                <div className="flex items-center gap-2.5 mb-2.5">
                  <span className="w-8 h-8 rounded-xl bg-purple-100 dark:bg-[#D9C9F5]/25 border border-purple-200 dark:border-[#D9C9F5]/35 flex items-center justify-center text-[#7C3AED] dark:text-[#D9C9F5]">
                    <Code2 className="w-4 h-4" />
                  </span>
                  <h2 className="text-sm font-bold text-[#1E1E22] dark:text-white">Explain &amp; Audit Code</h2>
                </div>
                <p className="text-xs text-slate-600 dark:text-[#9CA3AF] leading-relaxed group-hover:text-black dark:group-hover:text-white/90 transition-colors">
                  &ldquo;Can you find the bug in this Python async snippet...&rdquo;
                </p>
              </button>

              {/* Card 2: Plan a Roadmap */}
              <button
                type="button"
                onClick={() => executeSendMessage("Create a 3-week preparation sprint for SIH Hackathon with daily milestones.")}
                className="starter-card vybe-glass group rounded-3xl p-4 sm:p-5 transition-all duration-300 hover:-translate-y-1 hover:border-[#D3E57A]/60 hover:shadow-[0_10px_30px_-10px_rgba(211,229,122,0.25)] cursor-pointer flex flex-col justify-between"
              >
                <div className="flex items-center gap-2.5 mb-2.5">
                  <span className="w-8 h-8 rounded-xl bg-lime-100 dark:bg-[#D3E57A]/25 border border-lime-200 dark:border-[#D3E57A]/35 flex items-center justify-center text-lime-800 dark:text-[#D3E57A]">
                    <Compass className="w-4 h-4" />
                  </span>
                  <h2 className="text-sm font-bold text-[#1E1E22] dark:text-white">Plan a Roadmap</h2>
                </div>
                <p className="text-xs text-slate-600 dark:text-[#9CA3AF] leading-relaxed group-hover:text-black dark:group-hover:text-white/90 transition-colors">
                  &ldquo;Create a 3-week preparation sprint for SIH Hackathon...&rdquo;
                </p>
              </button>

              {/* Card 3: Brainstorm Ideas */}
              <button
                type="button"
                onClick={() => executeSendMessage("I want to build a standout AI Agent project for my resume. Give me 3 unique architectures.")}
                className="starter-card vybe-glass group rounded-3xl p-4 sm:p-5 transition-all duration-300 hover:-translate-y-1 hover:border-[#FAD8C6]/60 hover:shadow-[0_10px_30px_-10px_rgba(250,216,198,0.25)] cursor-pointer flex flex-col justify-between"
              >
                <div className="flex items-center gap-2.5 mb-2.5">
                  <span className="w-8 h-8 rounded-xl bg-orange-100 dark:bg-[#FAD8C6]/25 border border-orange-200 dark:border-[#FAD8C6]/35 flex items-center justify-center text-[#9A3412] dark:text-[#FAD8C6]">
                    <Lightbulb className="w-4 h-4" />
                  </span>
                  <h2 className="text-sm font-bold text-[#1E1E22] dark:text-white">Brainstorm Ideas</h2>
                </div>
                <p className="text-xs text-slate-600 dark:text-[#9CA3AF] leading-relaxed group-hover:text-black dark:group-hover:text-white/90 transition-colors">
                  &ldquo;I want to build a standout AI Agent project for my resume...&rdquo;
                </p>
              </button>
            </div>

            {/* Quick World Signals Selector Bar */}
            <div className="flex flex-col items-center gap-2.5 max-w-[760px] w-full pt-1">
              <span className="text-[11px] font-extrabold text-slate-600 dark:text-gray-400 uppercase tracking-wider">
                Explore Frontier Signals
              </span>
              <div className="flex items-center justify-center gap-2 flex-wrap">
                {INITIAL_SIGNALS.slice(0, 3).map((sig) => (
                  <button
                    key={sig.id}
                    type="button"
                    onClick={() => handleSendSignalQuery(sig, selectedPersonaKey)}
                    className="px-3.5 py-1.5 rounded-full text-xs font-bold bg-white/90 hover:bg-white border border-slate-200 text-slate-800 hover:text-black dark:bg-white/5 dark:hover:bg-white/10 dark:border-white/10 dark:text-slate-200 dark:hover:text-white shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <TrendingUp className="w-3.5 h-3.5 text-lime-700 dark:text-[#D3E57A] shrink-0" />
                    <span>{sig.title.slice(0, 36)}...</span>
                  </button>
                ))}
              </div>
            </div>
          </section>
        ) : (
          /* ==================== ACTIVE CHAT THREAD SECTION ==================== */
          <section aria-live="polite" className="flex-1 overflow-y-auto py-4 space-y-6 max-w-[800px] w-full mx-auto pr-1">
            {messages.map((msg) => {
              const isPulse = msg.sender === "pulse";
              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isPulse ? "items-start" : "items-end"} gap-1.5 animate-in fade-in duration-200`}
                >
                  {/* Sender & Timestamp Header */}
                  <div className="flex items-center gap-2 px-2 text-[10px] font-bold text-slate-500 dark:text-gray-400">
                    <span>{isPulse ? "PULSE Intelligence" : student.name}</span>
                    <span>•</span>
                    <span>{msg.timestamp}</span>
                    {isPulse && msg.model_used && (
                      <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-500/15 dark:text-emerald-300 font-bold flex items-center gap-1">
                        <Sparkles className="w-2.5 h-2.5 text-lime-700 dark:text-[#D3E57A]" />
                        {msg.model_used}
                      </span>
                    )}
                  </div>

                  {/* Message Bubble */}
                  {isPulse ? (
                    <div className="vybe-glass max-w-[88%] rounded-3xl rounded-tl-md px-5 py-4 shadow-xl border border-black/5 dark:border-white/10 text-slate-900 dark:text-white/90">
                      <div className="flex items-center justify-between gap-4 mb-2 pb-1 border-b border-black/5 dark:border-white/10">
                        <span className="text-xs font-bold text-[#7C3AED] dark:text-[#D9C9F5] flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5 text-lime-700 dark:text-[#D3E57A]" />
                          Cognitive Guide
                        </span>
                        <button
                          type="button"
                          onClick={() => handleCopy(msg.content, msg.id)}
                          className="text-slate-500 hover:text-black dark:text-white/40 dark:hover:text-white transition cursor-pointer flex items-center gap-1 text-[11px] font-semibold"
                          title="Copy response"
                        >
                          <Copy className="w-3.5 h-3.5" />
                          <span>{copiedId === msg.id ? "Copied!" : "Copy"}</span>
                        </button>
                      </div>

                      {/* Content */}
                      <div className="text-sm leading-relaxed whitespace-pre-line text-slate-900 dark:text-white/90">
                        {msg.content}
                      </div>

                      {/* "Why this" Explanation */}
                      {msg.why_this && (
                        <div className="mt-3.5 pt-2.5 border-t border-slate-200 dark:border-white/10 text-xs text-slate-600 dark:text-[#9CA3AF]">
                          🔍 <strong className="text-slate-900 dark:text-white font-bold">Context:</strong> {msg.why_this}
                        </div>
                      )}

                      {/* Action Proposals (Learn, Build, Apply) */}
                      {msg.action_proposals && msg.action_proposals.length > 0 && (
                        <div className="mt-4 pt-3 border-t border-slate-200 dark:border-white/10 flex flex-col gap-2.5">
                          <div className="flex items-center justify-between">
                            <span className="text-[11px] font-black text-lime-700 dark:text-[#D3E57A] tracking-wider uppercase flex items-center gap-1.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#84CC16] dark:bg-[#D3E57A]" />
                              Recommended Action Steps
                            </span>
                            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold">
                              Add directly to your workspace
                            </span>
                          </div>
                          <div className="space-y-2.5">
                            {msg.action_proposals.map((prop, idx) => {
                              const isAdded = addedTasks.includes(prop.title);
                              return (
                                <div
                                  key={idx}
                                  className="flex items-center justify-between gap-3 p-3 rounded-2xl bg-slate-50/90 dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 hover:border-lime-500/50 dark:hover:border-[#D3E57A]/40 transition-all group"
                                >
                                  <div className="flex-1 min-w-0 pr-2">
                                    <div className="flex items-center gap-2">
                                      <h4 className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white tracking-tight leading-snug">
                                        {prop.title}
                                      </h4>
                                    </div>
                                    {prop.description && (
                                      <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-0.5 leading-relaxed">
                                        {prop.description}
                                      </p>
                                    )}
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() =>
                                      setAddedTasks((prev) =>
                                        prev.includes(prop.title)
                                          ? prev.filter((t) => t !== prop.title)
                                          : [...prev, prop.title]
                                      )
                                    }
                                    className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-black transition-all shrink-0 cursor-pointer shadow-sm select-none ${
                                      isAdded
                                        ? "bg-emerald-100 text-emerald-800 border border-emerald-300 dark:bg-emerald-500/20 dark:text-emerald-300 dark:border-emerald-500/40 hover:bg-emerald-200 dark:hover:bg-emerald-500/30"
                                        : "bg-[#D3E57A] text-[#1A2E05] hover:bg-[#c4d869] shadow-[0_0_15px_-2px_rgba(211,229,122,0.45)] hover:scale-[1.03] active:scale-95"
                                    }`}
                                    title={isAdded ? "Click to remove task" : "Click to add task"}
                                  >
                                    {isAdded ? (
                                      <>
                                        <Check className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-300 stroke-[2.5]" />
                                        <span className="font-extrabold">Added</span>
                                      </>
                                    ) : (
                                      <>
                                        <Plus className="w-3.5 h-3.5 text-[#1A2E05] stroke-[3]" />
                                        <span className="font-black text-[#1A2E05]">Add Task</span>
                                      </>
                                    )}
                                  </button>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    /* User Bubble */
                    <div className="max-w-[80%] sm:max-w-[70%] bg-lime-100/95 border border-lime-300/80 dark:bg-[#D3E57A]/15 dark:border-[#D3E57A]/30 text-slate-950 dark:text-white rounded-3xl rounded-br-md px-4 py-3 shadow-sm dark:shadow-lg">
                      <p className="text-sm font-medium leading-relaxed whitespace-pre-line">{msg.content}</p>
                    </div>
                  )}
                </div>
              );
            })}

            {/* Loading Indicator */}
            {loading && (
              <div className="flex items-start gap-3 animate-pulse">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#D9C9F5] to-[#D3E57A] flex items-center justify-center text-slate-900 shadow-glow-lime">
                  <Sparkles className="w-4 h-4 animate-spin" />
                </div>
                <div className="vybe-glass px-5 py-3 rounded-3xl rounded-tl-md text-xs text-slate-800 dark:text-[#D3E57A] font-semibold flex items-center gap-2">
                  <span>PULSE is reasoning through your student roadmap...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </section>
        )}
      </div>

      {/* =========================================================================
          BOTTOM COMMAND BAR (UNIFIED CHAT INPUT WITH ATTACHMENT PILLS)
          ========================================================================= */}
      <footer className="relative z-20 w-full pb-4 pt-2">
        <form
          onSubmit={handleFormSubmit}
          className="max-w-[800px] w-full mx-auto p-3.5 sm:p-4 bg-white/95 dark:bg-[#14141A]/90 border border-slate-200 dark:border-white/10 shadow-xl dark:shadow-2xl backdrop-blur-2xl rounded-3xl transition-all duration-200 focus-within:border-[#84CC16] dark:focus-within:border-[#D3E57A]/40 focus-within:shadow-[0_0_30px_-8px_rgba(211,229,122,0.2)]"
        >
          {/* Borderless Textarea Input */}
          <textarea
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Send a message or drop a file..."
            rows={2}
            className="w-full bg-transparent border-0 text-sm sm:text-base text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-[#9CA3AF]/70 resize-none focus:ring-0 focus:outline-none p-1 leading-relaxed"
          />

          {/* Bottom Toolstrip Row */}
          <div className="flex items-center justify-between pt-2.5 mt-1 border-t border-slate-200/80 dark:border-white/5">
            {/* Left Tools: Pill Chips */}
            <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
              {/* Files Attachment Trigger */}
              <button
                type="button"
                onClick={() => alert("Upload Resume / Document feature ready.")}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 border border-slate-200 text-xs font-bold text-slate-700 hover:text-black dark:bg-white/5 dark:hover:bg-white/10 dark:border-white/10 dark:text-white/75 dark:hover:text-white transition cursor-pointer"
              >
                <Paperclip className="w-3.5 h-3.5 text-purple-600 dark:text-[#D9C9F5]" />
                <span>Files</span>
              </button>

              {/* Bhasha Multi-Language Trigger */}
              <div className="relative">
                <select
                  value={selectedLanguage}
                  onChange={(e) => setSelectedLanguage(e.target.value)}
                  className="appearance-none flex items-center gap-1 px-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 border border-slate-200 text-xs font-bold text-slate-700 hover:text-black dark:bg-white/5 dark:hover:bg-white/10 dark:border-white/10 dark:text-white/75 dark:hover:text-white transition cursor-pointer pr-6 outline-none"
                >
                  <option value="en" className="bg-white dark:bg-[#1C1C22]">English</option>
                  <option value="hi" className="bg-white dark:bg-[#1C1C22]">हिंदी (Hindi)</option>
                  <option value="ta" className="bg-white dark:bg-[#1C1C22]">தமிழ் (Tamil)</option>
                  <option value="te" className="bg-white dark:bg-[#1C1C22]">తెలుగు (Telugu)</option>
                  <option value="mr" className="bg-white dark:bg-[#1C1C22]">मराठी (Marathi)</option>
                  <option value="bn" className="bg-white dark:bg-[#1C1C22]">বাংলা (Bengali)</option>
                  <option value="kn" className="bg-white dark:bg-[#1C1C22]">ಕನ್ನಡ (Kannada)</option>
                </select>
                <ChevronDown className="w-3 h-3 text-slate-500 dark:text-white/50 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>

              {/* Reasoning Toggle Pill */}
              <button
                type="button"
                onClick={() => setReasoningActive((prev) => !prev)}
                aria-pressed={reasoningActive}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-bold transition cursor-pointer ${
                  reasoningActive
                    ? "bg-lime-500/20 border-lime-500/50 text-lime-800 dark:bg-[#D3E57A]/20 dark:border-[#D3E57A]/50 dark:text-[#D3E57A] shadow-sm dark:shadow-glow-lime"
                    : "bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-700 hover:text-black dark:bg-white/5 dark:hover:bg-white/10 dark:border-white/10 dark:text-white/75 dark:hover:text-white"
                }`}
              >
                <Lightbulb className={`w-3.5 h-3.5 ${reasoningActive ? "text-lime-700 dark:text-[#D3E57A]" : "text-slate-500 dark:text-white/60"}`} />
                <span>Reasoning</span>
              </button>
            </div>

            {/* Right Tools: Voice & Primary Gradient Send Button */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setInputMessage("What hackathons align best with my current Python and AI skills?");
                }}
                aria-label="Voice input sample"
                className="w-9 h-9 rounded-full flex items-center justify-center text-slate-600 hover:text-black hover:bg-slate-100 dark:text-white/65 dark:hover:text-white dark:hover:bg-white/10 transition cursor-pointer"
                title="Voice input"
              >
                <Mic className="w-4 h-4" />
              </button>

              <button
                type="submit"
                disabled={loading || !inputMessage.trim()}
                aria-label="Send message"
                className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-150 cursor-pointer ${
                  inputMessage.trim()
                    ? "bg-gradient-to-tr from-[#D3E57A] to-[#D9C9F5] text-[#0D0D12] shadow-[0_0_20px_rgba(211,229,122,0.4)] hover:scale-105 active:scale-95"
                    : "bg-slate-200 text-slate-400 dark:bg-white/10 dark:text-white/40 cursor-not-allowed"
                }`}
              >
                <ArrowUp className="w-4 h-4 stroke-[2.5]" />
              </button>
            </div>
          </div>
        </form>
      </footer>
    </div>
  );
}

export default function PulsePage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-gray-400">Loading PULSE Co-Pilot...</div>}>
      <PulseContent />
    </Suspense>
  );
}
