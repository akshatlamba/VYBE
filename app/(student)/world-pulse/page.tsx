"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  Activity,
  ArrowUpRight,
  Bookmark,
  BookmarkCheck,
  CalendarDays,
  CheckCircle2,
  Clock3,
  ExternalLink,
  Globe2,
  Search,
  Sparkles,
  TrendingUp,
  X,
  MessageSquare,
} from "lucide-react";
import { SignalDiscussionModal } from "@/components/community/signal-discussion-modal";

type Signal = {
  id: string;
  title: string;
  summary: string;
  source_name: string;
  source_url: string;
  published_at: string;
  tags: string[];
  category: string;
  source_status?: string;
  is_sample?: boolean;
  difficulty?: string;
};

const CATEGORIES = [
  "All",
  "AI",
  "Web Development",
  "Hardware",
  "Research",
  "Technology",
];

const CATEGORY_STYLES: Record<string, string> = {
  AI: "bg-violet-100 text-violet-700 dark:bg-violet-500/15 dark:text-violet-300",
  "Web Development":
    "bg-sky-100 text-sky-700 dark:bg-sky-500/15 dark:text-sky-300",
  Hardware:
    "bg-orange-100 text-orange-700 dark:bg-orange-500/15 dark:text-orange-300",
  Research:
    "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300",
};

export default function WorldPulsePage() {
  const [signals, setSignals] = useState<Signal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [saved, setSaved] = useState<string[]>([]);
  const [showSavedOnly, setShowSavedOnly] = useState(false);
  const [discussionSignal, setDiscussionSignal] = useState<{ id: string; title: string } | null>(null);

  useEffect(() => {
    try {
      const existing = localStorage.getItem("vybe-world-pulse-saved");
      if (existing) setSaved(JSON.parse(existing));
    } catch {
      setSaved([]);
    }

    async function loadSignals() {
      try {
        const response = await fetch("/api/signals", { cache: "no-store" });
        if (!response.ok) throw new Error("Unable to load World Pulse.");
        const result = await response.json();
        if (!result.success || !Array.isArray(result.data)) {
          throw new Error("The signal service returned an unexpected response.");
        }
        setSignals(result.data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Something went wrong."
        );
      } finally {
        setLoading(false);
      }
    }

    loadSignals();
  }, []);

  const toggleSave = (id: string) => {
    setSaved((previous) => {
      const next = previous.includes(id)
        ? previous.filter((item) => item !== id)
        : [...previous, id];

      try {
        localStorage.setItem("vybe-world-pulse-saved", JSON.stringify(next));
      } catch {
        // Saving remains available for this session.
      }
      return next;
    });
  };

  const filteredSignals = useMemo(() => {
    return signals.filter((signal) => {
      const matchesCategory =
        category === "All" ||
        category === "Technology" ||
        signal.category?.toLowerCase() === category.toLowerCase();

      const text = [
        signal.title,
        signal.summary,
        signal.source_name,
        ...(signal.tags || []),
      ]
        .join(" ")
        .toLowerCase();

      const matchesQuery = text.includes(query.toLowerCase());
      const matchesSaved = !showSavedOnly || saved.includes(signal.id);

      return matchesCategory && matchesQuery && matchesSaved;
    });
  }, [signals, category, query, showSavedOnly, saved]);

  const formatDate = (value: string) => {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "Date unavailable";
    return date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <main className="flex flex-col gap-7 py-2">
      <section className="relative overflow-hidden rounded-[30px] border border-white/60 dark:border-white/10 bg-gradient-to-br from-[#25232E] via-[#343047] to-[#55445E] p-7 md:p-10 text-white shadow-xl">
        <div className="absolute -right-16 -top-24 h-72 w-72 rounded-full bg-[#D3E57A]/15 blur-3xl" />
        <div className="absolute right-28 bottom-[-100px] h-56 w-56 rounded-full bg-purple-300/20 blur-3xl" />

        <div className="relative z-10 max-w-3xl">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-semibold backdrop-blur-xl">
            <Activity className="h-3.5 w-3.5 text-[#D3E57A]" />
            YOUR WINDOW TO WHAT'S NEXT
          </div>

          <h1 className="text-3xl md:text-5xl font-semibold tracking-tight leading-tight">
            The world moves.
            <br />
            <span className="text-[#D3E57A]">You move with it.</span>
          </h1>

          <p className="mt-4 max-w-2xl text-sm md:text-base leading-relaxed text-white/75">
            Discover technology shifts, emerging skills and research.
            Understand what matters, then turn it into your next action.
          </p>

          <div className="mt-7 flex flex-wrap gap-3">
            <Link
              href="/pulse"
              className="inline-flex items-center gap-2 rounded-full bg-[#D3E57A] px-5 py-3 text-sm font-bold text-[#24252A] transition hover:scale-[1.03]"
            >
              <Sparkles className="h-4 w-4" />
              Ask PULSE to explain
              <ArrowUpRight className="h-4 w-4" />
            </Link>

            <a
              href="#signals"
              className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-5 py-3 text-sm font-semibold backdrop-blur-lg transition hover:bg-white/20"
            >
              Explore signals
              <TrendingUp className="h-4 w-4" />
            </a>
          </div>
        </div>

        <div className="relative z-10 mt-9 grid grid-cols-2 gap-3 md:max-w-md">
          <div className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur-xl">
            <Globe2 className="mb-2 h-5 w-5 text-[#D3E57A]" />
            <p className="text-2xl font-semibold">{signals.length}</p>
            <p className="text-xs text-white/65">Available signals</p>
          </div>
          <div className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur-xl">
            <Bookmark className="mb-2 h-5 w-5 text-[#D3E57A]" />
            <p className="text-2xl font-semibold">{saved.length}</p>
            <p className="text-xs text-white/65">Your saved signals</p>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-3 md:grid-cols-3">
        {[
          {
            icon: Globe2,
            title: "Discover",
            description: "Explore developments across technology and research.",
          },
          {
            icon: Sparkles,
            title: "Understand",
            description: "Ask PULSE why a development matters to your goals.",
          },
          {
            icon: TrendingUp,
            title: "Take action",
            description: "Turn useful knowledge into skills and projects.",
          },
        ].map((item) => (
          <div
            key={item.title}
            className="liquid-glass rounded-2xl p-5"
          >
            <item.icon className="mb-3 h-5 w-5 text-[#8C8A5B] dark:text-[#D3E57A]" />
            <h2 className="font-semibold text-[#1E1E22] dark:text-white">
              {item.title}
            </h2>
            <p className="mt-1 text-sm text-[#66636D] dark:text-gray-400">
              {item.description}
            </p>
          </div>
        ))}
      </section>

      <section id="signals" className="flex flex-col gap-5">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[#D3E57A]" />
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#77736D] dark:text-gray-400">
                Signal intelligence
              </p>
            </div>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-[#1E1E22] dark:text-white">
              Explore World Pulse
            </h2>
            <p className="mt-1 text-sm text-[#77736D] dark:text-gray-400">
              Find developments worth your attention.
            </p>
          </div>

          <button
            onClick={() => setShowSavedOnly((value) => !value)}
            className={`inline-flex items-center gap-2 self-start rounded-full border px-4 py-2 text-sm font-semibold transition ${
              showSavedOnly
                ? "border-[#A8B75F] bg-[#D3E57A]/30 text-[#49551C]"
                : "border-black/10 bg-white/60 text-[#4B4850] dark:border-white/10 dark:bg-white/5 dark:text-white"
            }`}
          >
            {showSavedOnly ? (
              <BookmarkCheck className="h-4 w-4" />
            ) : (
              <Bookmark className="h-4 w-4" />
            )}
            {showSavedOnly ? "Showing saved" : "Saved signals"}
          </button>
        </div>

        <div className="flex flex-col gap-3 md:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search AI, skills, research, sources..."
              className="w-full rounded-full border border-black/10 bg-white/70 py-3 pl-11 pr-4 text-sm outline-none backdrop-blur-xl transition focus:border-[#AAB968] dark:border-white/10 dark:bg-white/5 dark:text-white"
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
                aria-label="Clear search"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((item) => (
            <button
              key={item}
              onClick={() => setCategory(item)}
              className={`rounded-full px-4 py-2 text-xs font-semibold transition ${
                category === item
                  ? "bg-[#25232E] text-white shadow-md dark:bg-[#D3E57A] dark:text-[#25232E]"
                  : "border border-black/10 bg-white/60 text-[#5E5B63] hover:bg-white dark:border-white/10 dark:bg-white/5 dark:text-gray-300"
              }`}
            >
              {item}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="grid gap-4 md:grid-cols-2">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="h-64 animate-pulse rounded-3xl border border-white/50 bg-white/50 dark:border-white/10 dark:bg-white/5"
              />
            ))}
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/30 dark:text-red-300">
            {error}
            <button
              onClick={() => window.location.reload()}
              className="ml-2 font-bold underline"
            >
              Retry
            </button>
          </div>
        ) : filteredSignals.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-black/15 p-10 text-center dark:border-white/15">
            <Search className="mx-auto mb-3 h-7 w-7 text-gray-400" />
            <p className="font-semibold text-[#33313A] dark:text-white">
              No matching signals
            </p>
            <p className="mt-1 text-sm text-gray-500">
              Try another category or search term.
            </p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {filteredSignals.map((signal) => {
              const isSaved = saved.includes(signal.id);
              const style =
                CATEGORY_STYLES[signal.category] ||
                "bg-gray-100 text-gray-700 dark:bg-white/10 dark:text-gray-300";

              return (
                <article
                  key={signal.id}
                  className="group flex flex-col rounded-3xl border border-white/70 bg-white/70 p-5 shadow-sm backdrop-blur-2xl transition duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-white/10 dark:bg-[#202027]/75"
                >
                  <div className="flex items-start justify-between gap-3">
                    <span className={`rounded-full px-3 py-1 text-[11px] font-bold ${style}`}>
                      {signal.category || "Technology"}
                    </span>
                    <button
                      onClick={() => toggleSave(signal.id)}
                      className="rounded-full border border-black/10 p-2 transition hover:bg-[#D3E57A]/30 dark:border-white/10"
                      aria-label={isSaved ? "Unsave signal" : "Save signal"}
                    >
                      {isSaved ? (
                        <BookmarkCheck className="h-4 w-4 text-[#80913E]" />
                      ) : (
                        <Bookmark className="h-4 w-4 text-gray-500 dark:text-gray-300" />
                      )}
                    </button>
                  </div>

                  <h3 className="mt-4 text-lg font-bold leading-snug tracking-tight text-[#222129] dark:text-white">
                    {signal.title}
                  </h3>

                  <p className="mt-3 flex-1 text-sm leading-relaxed text-[#65616B] dark:text-gray-400">
                    {signal.summary}
                  </p>

                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {(signal.tags || []).map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full bg-black/[0.045] px-2.5 py-1 text-[10px] font-medium text-gray-600 dark:bg-white/[0.07] dark:text-gray-300"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="mt-5 border-t border-black/5 pt-4 dark:border-white/10">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="min-w-0">
                        <p className="truncate text-xs font-bold text-[#35323B] dark:text-gray-200">
                          {signal.source_name || "Source not specified"}
                        </p>
                        <p className="mt-1 flex items-center gap-1 text-[11px] text-gray-500">
                          <CalendarDays className="h-3 w-3" />
                          {formatDate(signal.published_at)}
                        </p>
                      </div>
                      <span className="rounded-full bg-amber-100 px-2.5 py-1 text-[10px] font-semibold text-amber-800 dark:bg-amber-500/10 dark:text-amber-300">
                        Curated · verification pending
                      </span>
                    </div>

                    <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <Link
                          href={`/pulse?signal_id=${encodeURIComponent(signal.id)}`}
                          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#565D30] hover:underline dark:text-[#D3E57A]"
                        >
                          <Sparkles className="h-3.5 w-3.5" />
                          Understand with PULSE
                        </Link>

                        <button
                          type="button"
                          onClick={() => setDiscussionSignal({ id: signal.id, title: signal.title })}
                          className="inline-flex items-center gap-1 text-xs font-semibold text-gray-600 hover:text-black dark:text-gray-300 dark:hover:text-white"
                        >
                          <MessageSquare className="h-3 w-3" />
                          Discuss
                        </button>
                      </div>

                      {signal.source_url ? (
                        <a
                          href={signal.source_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-xs font-semibold text-gray-500 hover:text-[#68743A] dark:text-gray-400 dark:hover:text-[#D3E57A]"
                        >
                          Visit source
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      ) : (
                        <span className="text-xs text-gray-400">
                          Source link unavailable
                        </span>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      <section className="rounded-3xl border border-[#D3E57A]/40 bg-gradient-to-r from-[#EAF0C9]/70 to-[#F7E7E2]/80 p-6 dark:from-[#333927] dark:to-[#382D36]">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-[#747D43] dark:text-[#D3E57A]">
              From information to execution
            </p>
            <h3 className="mt-2 text-xl font-semibold text-[#292832] dark:text-white">
              Don't just follow the future. Prepare for it.
            </h3>
            <p className="mt-1 text-sm text-[#6D6970] dark:text-gray-300">
              Let PULSE translate a signal into a practical learning and project plan.
            </p>
          </div>
          <Link
            href="/pulse"
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-[#25232E] px-5 py-3 text-sm font-bold text-white transition hover:scale-[1.03] dark:bg-[#D3E57A] dark:text-[#25232E]"
          >
            Build my action plan
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* Signal Discussion Layer */}
      {discussionSignal && (
        <SignalDiscussionModal
          signalId={discussionSignal.id}
          signalTitle={discussionSignal.title}
          isOpen={!!discussionSignal}
          onClose={() => setDiscussionSignal(null)}
        />
      )}
    </main>
  );
}