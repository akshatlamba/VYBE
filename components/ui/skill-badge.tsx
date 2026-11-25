"use client";

import React from "react";
import {
  Code2,
  Terminal,
  Database,
  Globe,
  Bot,
  Zap,
  Users,
  Coins,
  Network,
  Sparkles,
  Layers,
  Brain,
  Cpu,
  Search,
  FileCode,
  Boxes,
  GitBranch,
  Lightbulb,
  Palette,
  ShieldCheck,
  TrendingUp,
  Briefcase,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

// Custom SVG Logos for popular brands/frameworks
const NextJsIcon = ({ className = "w-3.5 h-3.5 shrink-0" }: { className?: string }) => (
  <svg viewBox="0 0 180 180" className={className} fill="none">
    <circle cx="90" cy="90" r="90" fill="#000000" />
    <path
      d="M149.5 157.4L69.1 54H54v72h12.1V69.4l73.9 95.4c3.3-2.2 6.5-4.7 9.5-7.4z"
      fill="white"
    />
    <rect x="115" y="54" width="12" height="72" fill="white" />
  </svg>
);

const PythonIcon = ({ className = "w-3.5 h-3.5 shrink-0" }: { className?: string }) => (
  <svg viewBox="0 0 110 110" className={className} fill="none">
    <path
      d="M53.6 3C29.6 3 31.1 13.4 31.1 13.4L31.2 24.2H54.2V27.4H22.1C22.1 27.4 3 25.2 3 49.3C3 73.4 19.8 72.1 19.8 72.1H28V61.3C28 61.3 27.6 48.3 40.8 48.3H63.9C63.9 48.3 75.9 48.6 75.9 36.8V13.8C75.9 13.8 78 3 53.6 3ZM42.5 10.3C45.3 10.3 47.6 12.6 47.6 15.4C47.6 18.2 45.3 20.5 42.5 20.5C39.7 20.5 37.4 18.2 37.4 15.4C37.4 12.6 39.7 10.3 42.5 10.3Z"
      fill="#387EB8"
    />
    <path
      d="M56.4 107C80.4 107 78.9 96.6 78.9 96.6L78.8 85.8H55.8V82.6H87.9C87.9 82.6 107 84.8 107 60.7C107 36.6 90.2 37.9 90.2 37.9H82V48.7C82 48.7 82.4 61.7 69.2 61.7H46.1C46.1 61.7 34.1 61.4 34.1 73.2V96.2C34.1 96.2 32 107 56.4 107ZM67.5 99.7C64.7 99.7 62.4 97.4 62.4 94.6C62.4 91.8 64.7 89.5 67.5 89.5C70.3 89.5 72.6 91.8 72.6 94.6C72.6 97.4 70.3 99.7 67.5 99.7Z"
      fill="#FFE873"
    />
  </svg>
);

const ReactIcon = ({ className = "w-3.5 h-3.5 shrink-0" }: { className?: string }) => (
  <svg viewBox="-11.5 -10.23174 23 20.46348" className={className} fill="none">
    <circle cx="0" cy="0" r="2.05" fill="#61DAFB" />
    <g stroke="#61DAFB" strokeWidth="1" fill="none">
      <ellipse rx="11" ry="4.2" />
      <ellipse rx="11" ry="4.2" transform="rotate(60)" />
      <ellipse rx="11" ry="4.2" transform="rotate(120)" />
    </g>
  </svg>
);

const FigmaIcon = ({ className = "w-3.5 h-3.5 shrink-0" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 38 57" fill="none">
    <path d="M19 28.5C19 23.2533 23.2533 19 28.5 19C33.7467 19 38 23.2533 38 28.5C38 33.7467 33.7467 38 28.5 38C23.2533 38 19 33.7467 19 28.5Z" fill="#1ABCFE" />
    <path d="M0 47.5C0 42.2533 4.25329 38 9.5 38H19V47.5C19 52.7467 14.7467 57 9.5 57C4.25329 57 0 52.7467 0 47.5Z" fill="#0ACF83" />
    <path d="M19 0V19H28.5C33.7467 19 38 14.7467 38 9.5C38 4.25329 33.7467 0 28.5 0H19Z" fill="#FF7262" />
    <path d="M0 9.5C0 14.7467 4.25329 19 9.5 19H19V0H9.5C4.25329 0 0 4.25329 0 9.5Z" fill="#F24E1E" />
    <path d="M0 28.5C0 33.7467 4.25329 38 9.5 38H19V19H9.5C4.25329 19 0 23.2533 0 28.5Z" fill="#A259FF" />
  </svg>
);

export interface SkillMeta {
  icon: React.ReactNode;
  iconBg?: string;
  badgeStyle?: string;
}

export function getSkillMeta(skillName: string): SkillMeta {
  const norm = skillName.trim().toLowerCase();

  // Next.js
  if (norm.includes("next.js") || norm.includes("nextjs") || norm === "next") {
    return {
      icon: <NextJsIcon className="w-3.5 h-3.5 shrink-0" />,
      iconBg: "bg-black/40",
      badgeStyle: "hover:border-white/40",
    };
  }

  // Python
  if (norm.includes("python") || norm === "py") {
    return {
      icon: <PythonIcon className="w-3.5 h-3.5 shrink-0" />,
      iconBg: "bg-[#387EB8]/20",
      badgeStyle: "hover:border-[#387EB8]/40",
    };
  }

  // React
  if (norm.includes("react")) {
    return {
      icon: <ReactIcon className="w-3.5 h-3.5 shrink-0" />,
      iconBg: "bg-[#61DAFB]/20",
      badgeStyle: "hover:border-[#61DAFB]/40",
    };
  }

  // Figma
  if (norm.includes("figma")) {
    return {
      icon: <FigmaIcon className="w-3.5 h-3.5 shrink-0" />,
      iconBg: "bg-[#A259FF]/20",
      badgeStyle: "hover:border-[#A259FF]/40",
    };
  }

  // REST APIs / API
  if (norm.includes("rest") || norm.includes("api") || norm.includes("graphql") || norm.includes("endpoints")) {
    return {
      icon: <Network className="w-3.5 h-3.5 text-sky-400 shrink-0 stroke-[2.2]" />,
      iconBg: "bg-sky-500/15",
      badgeStyle: "hover:border-sky-500/40",
    };
  }

  // Fintech / Finance
  if (norm.includes("fintech") || norm.includes("finance") || norm.includes("payment") || norm.includes("crypto") || norm.includes("banking")) {
    return {
      icon: <Coins className="w-3.5 h-3.5 text-emerald-400 shrink-0 stroke-[2.2]" />,
      iconBg: "bg-emerald-500/15",
      badgeStyle: "hover:border-emerald-500/40",
    };
  }

  // Team Collaboration / Soft Skills
  if (norm.includes("team") || norm.includes("collab") || norm.includes("leadership") || norm.includes("communication")) {
    return {
      icon: <Users className="w-3.5 h-3.5 text-pink-400 shrink-0 stroke-[2.2]" />,
      iconBg: "bg-pink-500/15",
      badgeStyle: "hover:border-pink-500/40",
    };
  }

  // Web Scraping / Crawling
  if (norm.includes("scrap") || norm.includes("crawl") || norm.includes("beautiful soup") || norm.includes("selenium")) {
    return {
      icon: <Search className="w-3.5 h-3.5 text-amber-400 shrink-0 stroke-[2.2]" />,
      iconBg: "bg-amber-500/15",
      badgeStyle: "hover:border-amber-500/40",
    };
  }

  // Asyncio / Concurrency / Performance
  if (norm.includes("async") || norm.includes("concurrent") || norm.includes("threading") || norm.includes("optimization")) {
    return {
      icon: <Zap className="w-3.5 h-3.5 text-yellow-300 shrink-0 stroke-[2.2]" />,
      iconBg: "bg-yellow-400/15",
      badgeStyle: "hover:border-yellow-400/40",
    };
  }

  // AI Agents / AI / LLMs / GenAI
  if (norm.includes("ai agent") || norm.includes("agent") || norm.includes("llm") || norm.includes("prompt") || norm === "ai") {
    return {
      icon: <Bot className="w-3.5 h-3.5 text-purple-400 shrink-0 stroke-[2.2]" />,
      iconBg: "bg-purple-500/15",
      badgeStyle: "hover:border-purple-500/40",
    };
  }

  // Machine Learning / Deep Learning / PyTorch
  if (norm.includes("machine learning") || norm.includes("pytorch") || norm.includes("deep learning") || norm.includes("tensorflow") || norm.includes("nlp") || norm.includes("computer vision")) {
    return {
      icon: <Brain className="w-3.5 h-3.5 text-rose-400 shrink-0 stroke-[2.2]" />,
      iconBg: "bg-rose-500/15",
      badgeStyle: "hover:border-rose-500/40",
    };
  }

  // SQL / Database / MongoDB / Postgres
  if (norm.includes("sql") || norm.includes("db") || norm.includes("database") || norm.includes("postgres") || norm.includes("mongo") || norm.includes("redis")) {
    return {
      icon: <Database className="w-3.5 h-3.5 text-blue-400 shrink-0 stroke-[2.2]" />,
      iconBg: "bg-blue-500/15",
      badgeStyle: "hover:border-blue-500/40",
    };
  }

  // HTTP Standards / Web / Networking
  if (norm.includes("http") || norm.includes("web") || norm.includes("network") || norm.includes("dns")) {
    return {
      icon: <Globe className="w-3.5 h-3.5 text-teal-400 shrink-0 stroke-[2.2]" />,
      iconBg: "bg-teal-500/15",
      badgeStyle: "hover:border-teal-500/40",
    };
  }

  // TypeScript / JavaScript
  if (norm.includes("typescript") || norm.includes("javascript") || norm === "ts" || norm === "js") {
    return {
      icon: <FileCode className="w-3.5 h-3.5 text-blue-400 shrink-0 stroke-[2.2]" />,
      iconBg: "bg-blue-500/15",
      badgeStyle: "hover:border-blue-500/40",
    };
  }

  // Docker / Kubernetes / DevOps
  if (norm.includes("docker") || norm.includes("k8s") || norm.includes("kubernetes") || norm.includes("container") || norm.includes("devops") || norm.includes("ci/cd")) {
    return {
      icon: <Boxes className="w-3.5 h-3.5 text-sky-400 shrink-0 stroke-[2.2]" />,
      iconBg: "bg-sky-500/15",
      badgeStyle: "hover:border-sky-500/40",
    };
  }

  // Git / GitHub
  if (norm.includes("git") || norm.includes("github") || norm.includes("version control")) {
    return {
      icon: <GitBranch className="w-3.5 h-3.5 text-orange-400 shrink-0 stroke-[2.2]" />,
      iconBg: "bg-orange-500/15",
      badgeStyle: "hover:border-orange-500/40",
    };
  }

  // UI/UX / Design
  if (norm.includes("design") || norm.includes("ui/ux") || norm.includes("ui") || norm.includes("ux") || norm.includes("branding")) {
    return {
      icon: <Palette className="w-3.5 h-3.5 text-fuchsia-400 shrink-0 stroke-[2.2]" />,
      iconBg: "bg-fuchsia-500/15",
      badgeStyle: "hover:border-fuchsia-500/40",
    };
  }

  // Product Management / Business / Pitching
  if (norm.includes("product") || norm.includes("pitch") || norm.includes("market") || norm.includes("strategy") || norm.includes("business")) {
    return {
      icon: <TrendingUp className="w-3.5 h-3.5 text-emerald-400 shrink-0 stroke-[2.2]" />,
      iconBg: "bg-emerald-500/15",
      badgeStyle: "hover:border-emerald-500/40",
    };
  }

  // Problem Solving / Algorithms
  if (norm.includes("problem") || norm.includes("dsa") || norm.includes("algorithm") || norm.includes("data structures")) {
    return {
      icon: <Lightbulb className="w-3.5 h-3.5 text-amber-300 shrink-0 stroke-[2.2]" />,
      iconBg: "bg-amber-400/15",
      badgeStyle: "hover:border-amber-400/40",
    };
  }

  // Cybersecurity
  if (norm.includes("security") || norm.includes("cyber") || norm.includes("auth") || norm.includes("cryptography")) {
    return {
      icon: <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0 stroke-[2.2]" />,
      iconBg: "bg-emerald-500/15",
      badgeStyle: "hover:border-emerald-500/40",
    };
  }

  // Distributed Systems / Architecture
  if (norm.includes("distributed") || norm.includes("architecture") || norm.includes("cloud") || norm.includes("microservices")) {
    return {
      icon: <Layers className="w-3.5 h-3.5 text-indigo-400 shrink-0 stroke-[2.2]" />,
      iconBg: "bg-indigo-500/15",
      badgeStyle: "hover:border-indigo-500/40",
    };
  }

  // Mathematical / Numerical
  if (norm.includes("math") || norm.includes("quant") || norm.includes("statistics")) {
    return {
      icon: <Cpu className="w-3.5 h-3.5 text-cyan-400 shrink-0 stroke-[2.2]" />,
      iconBg: "bg-cyan-500/15",
      badgeStyle: "hover:border-cyan-500/40",
    };
  }

  // Default fallback for any custom skill
  return {
    icon: <Sparkles className="w-3.5 h-3.5 text-[#D3E57A] shrink-0 stroke-[2.2]" />,
    iconBg: "bg-[#D3E57A]/15",
    badgeStyle: "hover:border-[#D3E57A]/40",
  };
}

export interface SkillBadgeProps {
  name: string;
  size?: "sm" | "md" | "lg";
  variant?: "dark-card" | "tag" | "glass";
  onRemove?: () => void;
  className?: string;
}

export function SkillBadge({
  name,
  size = "md",
  variant = "dark-card",
  onRemove,
  className,
}: SkillBadgeProps) {
  const meta = getSkillMeta(name);

  // Variant styling
  const variantStyles = {
    // Specially tuned for the dark passport card (matching the user's uploaded request)
    "dark-card":
      "bg-white/[0.08] text-white/90 border border-white/15 hover:bg-white/[0.12] hover:text-white shadow-sm hover:scale-[1.02] active:scale-[0.98]",
    tag:
      "bg-[#D9C9F5]/30 text-[#45366E] border border-[#D9C9F5] dark:bg-[#D9C9F5]/20 dark:text-[#E2D5FC] dark:border-[#D9C9F5]/30",
    glass:
      "bg-black/5 text-[#1E1E22] border border-black/10 hover:bg-black/10 dark:bg-white/5 dark:text-slate-200 dark:border-white/10 dark:hover:bg-white/10",
  };

  const sizeStyles = {
    sm: "px-2.5 py-1 text-[11px] gap-1.5",
    md: "px-3 py-1.5 text-caption font-semibold gap-2",
    lg: "px-4 py-2 text-small font-bold gap-2.5",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full transition-all duration-200 select-none backdrop-blur-md",
        sizeStyles[size],
        variantStyles[variant],
        meta.badgeStyle,
        className
      )}
    >
      <span className={cn("flex items-center justify-center shrink-0 rounded-full p-0.5", meta.iconBg)}>
        {meta.icon}
      </span>
      <span className="truncate tracking-tight">{name}</span>
      {onRemove && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="hover:opacity-75 focus:outline-none ml-0.5 p-0.5 text-current"
          aria-label={`Remove ${name}`}
        >
          <X className="w-3 h-3 stroke-[2.2]" />
        </button>
      )}
    </span>
  );
}
