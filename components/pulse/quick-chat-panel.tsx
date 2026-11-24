"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth/auth-context";
import { Button } from "@/components/ui/button";
import {
  Sparkles,
  X,
  Send,
  Compass,
  ArrowRight,
  TrendingUp,
  Copy,
  Check,
  RotateCw,
  Plus,
} from "lucide-react";

interface QuickChatPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Message {
  id: string;
  sender: "user" | "pulse";
  content: string;
  why_this?: string;
  action_proposals?: any[];
  opportunity_ids?: string[];
  is_live_ai?: boolean;
  model_used?: string;
  timestamp: string;
}

export function QuickChatPanel({ isOpen, onClose }: QuickChatPanelProps) {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [addedTasks, setAddedTasks] = useState<string[]>([]);
  const panelRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize friendly, personalized greeting
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          id: "welcome",
          sender: "pulse",
          content: `Hi ${user.name.split(" ")[0]}! I'm PULSE, your student intelligence guide.\n\nAsk me anything about current tech trends, skill roadmaps, or recommended hackathons and internships.`,
          why_this: `Personalized for your ${user.academic_year || "current"} timeline and ${user.department || "studies"}.`,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    }
  }, [user.name, user.academic_year, user.department, messages.length]);

  // Outside click and Escape handlers
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (isOpen && panelRef.current && !panelRef.current.contains(e.target as Node)) {
        onClose();
      }
    }
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  // Scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleSend = async (textToSend?: string) => {
    const query = (textToSend || input).trim();
    if (!query || loading) return;

    setInput("");
    const userMsg: Message = {
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
          student_id: user.id,
          persona_id: user.primary_goal === "startup" ? "startup" : user.primary_goal === "research" ? "research" : "beginner",
        }),
      });
      const data = await res.json();
      if (data.success && data.data) {
        setMessages((prev) => [
          ...prev,
          {
            id: `pulse-${Date.now()}`,
            sender: "pulse",
            content: data.data.content,
            why_this: data.data.why_this,
            action_proposals: data.data.action_proposals,
            opportunity_ids: data.data.opportunity_ids,
            is_live_ai: data.data.is_live_ai,
            model_used: data.data.model_used,
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          },
        ]);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `pulse-err-${Date.now()}`,
          sender: "pulse",
          content: "I had trouble connecting to the intelligence server. You can try asking again.",
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/30 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        ref={panelRef}
        className="w-full max-w-md h-full bg-white dark:bg-[#1A1A1F] shadow-2xl flex flex-col border-l border-black/10 dark:border-white/10 animate-in slide-in-from-right duration-300"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-black/5 dark:border-white/10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#1E1E22] dark:bg-white text-[#D3E57A] dark:text-[#1E1E22] flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-[#1E1E22] dark:text-white leading-tight">
                PULSE Quick Assistant
              </h3>
              <p className="text-[11px] text-gray-500">Multilingual Student Intelligence</p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close assistant panel"
            className="p-1.5 rounded-full hover:bg-black/5 dark:hover:bg-white/10 text-gray-400 hover:text-black dark:hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-3">
          {messages.map((m) => {
            const isPulse = m.sender === "pulse";
            return (
              <div
                key={m.id}
                className={`flex flex-col ${isPulse ? "items-start" : "items-end"} gap-1`}
              >
                <div className="flex items-center gap-1.5 px-1">
                  <span className="text-[10px] font-bold text-gray-400">
                    {isPulse ? "PULSE" : "You"}
                  </span>
                  {isPulse && m.is_live_ai && (
                    <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-semibold">
                      Live AI
                    </span>
                  )}
                  <span className="text-[9px] text-gray-400">{m.timestamp}</span>
                </div>
                <div
                  className={`p-3.5 rounded-2xl text-xs leading-relaxed max-w-[90%] relative group ${
                    isPulse
                      ? "bg-black/5 dark:bg-white/5 text-[#1E1E22] dark:text-white border border-black/5 dark:border-white/10 rounded-tl-sm"
                      : "bg-[#1E1E22] text-white dark:bg-white dark:text-[#1E1E22] rounded-tr-sm"
                  }`}
                >
                  <p className="whitespace-pre-line">{m.content}</p>
                  {m.why_this && (
                    <p className="mt-2 pt-2 border-t border-black/5 dark:border-white/5 text-[11px] text-gray-500 dark:text-gray-400">
                      💡 {m.why_this}
                    </p>
                  )}
                  {isPulse && m.action_proposals && m.action_proposals.length > 0 && (
                    <div className="mt-3 pt-2.5 border-t border-black/10 dark:border-white/10 space-y-2">
                      <span className="text-[10px] font-black text-[#D3E57A] tracking-wider uppercase block">
                        Action Plan Steps
                      </span>
                      {m.action_proposals.map((prop: any, pIdx: number) => {
                        const isAdded = addedTasks.includes(prop.title);
                        return (
                          <div
                            key={pIdx}
                            className="flex items-center justify-between gap-2 p-2 rounded-xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10"
                          >
                            <span className="text-xs font-semibold text-black dark:text-white truncate">
                              {prop.title}
                            </span>
                            <button
                              type="button"
                              onClick={() =>
                                setAddedTasks((prev) =>
                                  prev.includes(prop.title)
                                    ? prev.filter((t) => t !== prop.title)
                                    : [...prev, prop.title]
                                )
                              }
                              className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold transition-all shrink-0 cursor-pointer ${
                                isAdded
                                  ? "bg-emerald-500/20 text-emerald-600 dark:text-emerald-300 border border-emerald-500/40"
                                  : "bg-[#D3E57A] text-[#0D0D12] hover:bg-[#c4d869] shadow-sm font-extrabold"
                              }`}
                            >
                              {isAdded ? (
                                <>
                                  <Check className="w-3 h-3 text-emerald-600 dark:text-emerald-300" />
                                  <span>Added</span>
                                </>
                              ) : (
                                <>
                                  <Plus className="w-3 h-3 text-[#0D0D12]" />
                                  <span>Add</span>
                                </>
                              )}
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  )}
                  {isPulse && (
                    <button
                      onClick={() => copyToClipboard(m.content, m.id)}
                      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 p-1 rounded bg-black/10 dark:bg-white/10 text-gray-500 transition-opacity"
                      title="Copy response"
                    >
                      {copiedId === m.id ? (
                        <Check className="w-3 h-3 text-emerald-500" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                    </button>
                  )}
                </div>
              </div>
            );
          })}

          {loading && (
            <div className="flex items-center gap-2 p-3 rounded-2xl bg-black/5 dark:bg-white/5 w-fit">
              <span className="w-1.5 h-1.5 rounded-full bg-[#1E1E22] dark:bg-white animate-ping" />
              <span className="text-xs text-gray-400">PULSE is analyzing your path...</span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Prompts */}
        <div className="p-2 border-t border-black/5 dark:border-white/5 flex gap-1.5 overflow-x-auto no-scrollbar">
          {[
            "Hackathons for 2nd Year?",
            "How does AI affect internships?",
            "Skill gaps in Python?",
          ].map((prompt) => (
            <button
              key={prompt}
              onClick={() => handleSend(prompt)}
              className="text-[11px] px-2.5 py-1 rounded-full bg-black/5 dark:bg-white/10 hover:bg-[#D3E57A]/30 text-gray-600 dark:text-gray-300 whitespace-nowrap transition-colors"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Input Composer */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="p-3 border-t border-black/5 dark:border-white/10 flex items-center gap-2"
        >
          <input
            type="text"
            placeholder="Ask in English, Hindi, Hinglish..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={loading}
            className="flex-1 px-4 py-2.5 rounded-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-xs outline-none focus:border-[#D3E57A] dark:text-white"
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="w-9 h-9 rounded-full bg-[#1E1E22] text-white dark:bg-white dark:text-[#1E1E22] flex items-center justify-center disabled:opacity-40 transition-opacity"
            aria-label="Send"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
}
