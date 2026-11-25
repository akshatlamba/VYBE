"use client";

import React, { useState, useEffect } from "react";
import {
  Shield,
  Sparkles,
  Layout,
  PenTool,
  Plus,
  X,
  Code2,
  Terminal,
  Cpu,
  Palette,
  Check,
  Trash2,
} from "lucide-react";

export interface ToolItem {
  id: string;
  name: string;
  shortName: string;
  color: string;
  bgColor: string;
  glowColor: string;
  isCustomSvg?: boolean;
  svgType?: "figma" | "vscode" | "react" | "python";
}

export interface SkillItem {
  id: string;
  title: string;
  subtitle: string;
  iconType: "shield" | "sparkles" | "layout" | "pentool" | "code" | "cpu";
}

const DEFAULT_TOOLS: ToolItem[] = [
  {
    id: "tool-ps",
    name: "Photoshop",
    shortName: "Ps",
    color: "#31A8FF",
    bgColor: "#001E36",
    glowColor: "rgba(49, 168, 255, 0.35)",
  },
  {
    id: "tool-ai",
    name: "Illustrator",
    shortName: "Ai",
    color: "#FF9A00",
    bgColor: "#330000",
    glowColor: "rgba(255, 154, 0, 0.35)",
  },
  {
    id: "tool-figma",
    name: "Figma",
    shortName: "Figma",
    color: "#A259FF",
    bgColor: "#181822",
    glowColor: "rgba(162, 89, 255, 0.35)",
    isCustomSvg: true,
    svgType: "figma",
  },
  {
    id: "tool-ae",
    name: "After Effects",
    shortName: "Ae",
    color: "#9999FF",
    bgColor: "#00005B",
    glowColor: "rgba(153, 153, 255, 0.35)",
  },
  {
    id: "tool-vscode",
    name: "VS Code",
    shortName: "VS",
    color: "#007ACC",
    bgColor: "#001E33",
    glowColor: "rgba(0, 122, 204, 0.35)",
  },
  {
    id: "tool-python",
    name: "Python",
    shortName: "Py",
    color: "#4B8BBE",
    bgColor: "#0F2027",
    glowColor: "rgba(75, 139, 190, 0.35)",
  },
];

const DEFAULT_SKILLS: SkillItem[] = [
  {
    id: "skill-branding",
    title: "Branding",
    subtitle: "Identity & Strategy",
    iconType: "shield",
  },
  {
    id: "skill-logo",
    title: "Logo Design",
    subtitle: "Minimal & Iconic",
    iconType: "sparkles",
  },
  {
    id: "skill-uiux",
    title: "UI/UX Design",
    subtitle: "Web & Mobile",
    iconType: "layout",
  },
  {
    id: "skill-illustration",
    title: "Illustration",
    subtitle: "Vector & Digital",
    iconType: "pentool",
  },
];

export function SkillsToolsSection() {
  const [tools, setTools] = useState<ToolItem[]>(DEFAULT_TOOLS);
  const [skills, setSkills] = useState<SkillItem[]>(DEFAULT_SKILLS);

  // Modals for adding new tools / skills
  const [showAddTool, setShowAddTool] = useState(false);
  const [newToolName, setNewToolName] = useState("");
  const [newToolShort, setNewToolShort] = useState("");
  const [newToolColor, setNewToolColor] = useState("#D3E57A");

  const [showAddSkill, setShowAddSkill] = useState(false);
  const [newSkillTitle, setNewSkillTitle] = useState("");
  const [newSkillSubtitle, setNewSkillSubtitle] = useState("");
  const [newSkillIcon, setNewSkillIcon] = useState<SkillItem["iconType"]>("shield");

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const savedTools = localStorage.getItem("vybe_profile_tools");
      if (savedTools) {
        setTools(JSON.parse(savedTools));
      }
      const savedSkills = localStorage.getItem("vybe_profile_skills");
      if (savedSkills) {
        setSkills(JSON.parse(savedSkills));
      }
    } catch {}
  }, []);

  const saveTools = (updated: ToolItem[]) => {
    setTools(updated);
    try {
      localStorage.setItem("vybe_profile_tools", JSON.stringify(updated));
    } catch {}
  };

  const saveSkills = (updated: SkillItem[]) => {
    setSkills(updated);
    try {
      localStorage.setItem("vybe_profile_skills", JSON.stringify(updated));
    } catch {}
  };

  const handleAddTool = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newToolName.trim()) return;
    const short = (newToolShort.trim() || newToolName.slice(0, 2)).toUpperCase();
    const newTool: ToolItem = {
      id: `tool-${Date.now()}`,
      name: newToolName.trim(),
      shortName: short,
      color: newToolColor,
      bgColor: "#14141E",
      glowColor: `${newToolColor}55`,
    };
    const updated = [...tools, newTool];
    saveTools(updated);
    setNewToolName("");
    setNewToolShort("");
    setShowAddTool(false);
  };

  const handleRemoveTool = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = tools.filter((t) => t.id !== id);
    saveTools(updated);
  };

  const handleAddSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSkillTitle.trim()) return;
    const newSkill: SkillItem = {
      id: `skill-${Date.now()}`,
      title: newSkillTitle.trim(),
      subtitle: newSkillSubtitle.trim() || "Core Discipline",
      iconType: newSkillIcon,
    };
    const updated = [...skills, newSkill];
    saveSkills(updated);
    setNewSkillTitle("");
    setNewSkillSubtitle("");
    setShowAddSkill(false);
  };

  const handleRemoveSkill = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = skills.filter((s) => s.id !== id);
    saveSkills(updated);
  };

  const renderSkillIcon = (type: SkillItem["iconType"]) => {
    switch (type) {
      case "shield":
        return <Shield className="w-5 h-5 text-[#C084FC] stroke-[2.2]" />;
      case "sparkles":
        return <Sparkles className="w-5 h-5 text-[#C084FC] stroke-[2.2]" />;
      case "layout":
        return <Layout className="w-5 h-5 text-[#C084FC] stroke-[2.2]" />;
      case "pentool":
        return <PenTool className="w-5 h-5 text-[#C084FC] stroke-[2.2]" />;
      case "code":
        return <Code2 className="w-5 h-5 text-[#C084FC] stroke-[2.2]" />;
      case "cpu":
        return <Cpu className="w-5 h-5 text-[#C084FC] stroke-[2.2]" />;
      default:
        return <Sparkles className="w-5 h-5 text-[#C084FC] stroke-[2.2]" />;
    }
  };

  return (
    <div className="rounded-[28px] p-6 sm:p-8 bg-white/80 dark:bg-[#0D0D14]/90 backdrop-blur-2xl border border-black/5 dark:border-white/10 shadow-[0_12px_40px_rgba(0,0,0,0.06)] dark:shadow-[0_20px_50px_rgba(5,5,12,0.7)] flex flex-col gap-7 transition-all">
      {/* =========================================================================
          1. HEADER: Pink dot with gradient vertical trail
          ========================================================================= */}
      <div className="flex items-start gap-3.5">
        <div className="flex flex-col items-center shrink-0">
          <span className="w-3 h-3 rounded-full bg-[#EC4899] shadow-[0_0_12px_#EC4899] mt-1.5" />
          <div className="w-[1.5px] h-9 bg-gradient-to-b from-[#EC4899] via-[#EC4899]/50 to-transparent mt-1" />
        </div>
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-[#1E1E22] dark:text-white tracking-tight leading-none">
            Skills &amp; Tools
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-gray-400 mt-1.5 font-medium leading-relaxed max-w-md">
            The technologies and creative tools I use to bring ideas to life.
          </p>
        </div>
      </div>

      {/* =========================================================================
          2. TOOLS I USE
          ========================================================================= */}
      <div className="flex flex-col gap-3.5">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-extrabold text-slate-900 dark:text-white tracking-tight">
            Tools I Use
          </h3>
          <button
            type="button"
            onClick={() => setShowAddTool(true)}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-purple-600 dark:text-[#D9C9F5] hover:text-purple-800 dark:hover:text-white transition-colors cursor-pointer select-none"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Add Tool</span>
          </button>
        </div>

        {/* Horizontal row / wrap of tools matching screenshot */}
        <div className="flex items-center gap-3 sm:gap-4 overflow-x-auto pb-2 pt-1 scrollbar-thin">
          {tools.map((tool) => {
            return (
              <div
                key={tool.id}
                className="group relative flex flex-col items-center gap-2 cursor-pointer transition-all duration-300 hover:-translate-y-1 shrink-0"
              >
                {/* Delete button on hover */}
                <button
                  type="button"
                  onClick={(e) => handleRemoveTool(tool.id, e)}
                  title={`Remove ${tool.name}`}
                  className="absolute -top-1.5 -right-1.5 z-10 w-5 h-5 rounded-full bg-rose-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
                >
                  <X className="w-3 h-3 stroke-[2.5]" />
                </button>

                {/* Squircle App Card */}
                <div
                  className="w-18 h-18 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center transition-all duration-300 relative overflow-hidden"
                  style={{
                    backgroundColor: tool.bgColor,
                    boxShadow: `0 0 25px -4px ${tool.glowColor}`,
                    border: `1.5px solid ${tool.color}55`,
                  }}
                >
                  {/* Subtle inner reflection gradient */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-black/20 via-transparent to-white/10 pointer-events-none" />

                  {tool.isCustomSvg && tool.svgType === "figma" ? (
                    /* Official 5-part Figma SVG */
                    <svg
                      className="w-8 h-8 sm:w-9 sm:h-9 drop-shadow-md"
                      viewBox="0 0 38 57"
                      fill="none"
                    >
                      <path
                        d="M19 28.5C19 23.2533 23.2533 19 28.5 19C33.7467 19 38 23.2533 38 28.5C38 33.7467 33.7467 38 28.5 38C23.2533 38 19 33.7467 19 28.5Z"
                        fill="#1ABCFE"
                      />
                      <path
                        d="M0 47.5C0 42.2533 4.25329 38 9.5 38H19V47.5C19 52.7467 14.7467 57 9.5 57C4.25329 57 0 52.7467 0 47.5Z"
                        fill="#0ACF83"
                      />
                      <path
                        d="M19 0V19H28.5C33.7467 19 38 14.7467 38 9.5C38 4.25329 33.7467 0 28.5 0H19Z"
                        fill="#FF7262"
                      />
                      <path
                        d="M0 9.5C0 14.7467 4.25329 19 9.5 19H19V0H9.5C4.25329 0 0 4.25329 0 9.5Z"
                        fill="#F24E1E"
                      />
                      <path
                        d="M0 28.5C0 33.7467 4.25329 38 9.5 38H19V19H9.5C4.25329 19 0 23.2533 0 28.5Z"
                        fill="#A259FF"
                      />
                    </svg>
                  ) : (
                    /* App Monogram Text Icon (Ps, Ai, Ae, etc.) */
                    <span
                      className="font-black text-2xl sm:text-[26px] tracking-tight select-none"
                      style={{ color: tool.color }}
                    >
                      {tool.shortName}
                    </span>
                  )}
                </div>

                {/* Tool Name Label */}
                <span className="text-[11px] sm:text-xs font-bold text-slate-700 dark:text-gray-300 text-center truncate max-w-[84px] group-hover:text-black dark:group-hover:text-white transition-colors">
                  {tool.name}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* =========================================================================
          3. CORE SKILLS
          ========================================================================= */}
      <div className="flex flex-col gap-3.5">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-extrabold text-slate-900 dark:text-white tracking-tight">
            Core Skills
          </h3>
          <button
            type="button"
            onClick={() => setShowAddSkill(true)}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-purple-600 dark:text-[#D9C9F5] hover:text-purple-800 dark:hover:text-white transition-colors cursor-pointer select-none"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Add Skill</span>
          </button>
        </div>

        {/* 2-Column Responsive Pill Grid from Screenshot */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-3.5">
          {skills.map((skill) => {
            return (
              <div
                key={skill.id}
                className="group relative p-3.5 sm:p-4 rounded-2xl bg-slate-50/80 hover:bg-slate-100/90 dark:bg-[#151522]/90 dark:hover:bg-[#1A1A2A] border border-slate-200/90 dark:border-[#2D2A4A] hover:border-purple-300 dark:hover:border-[#7C3AED]/50 transition-all duration-200 flex items-center justify-between gap-3 shadow-xs hover:shadow-md cursor-pointer"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  {/* Purple Glowing Squircle Icon Container */}
                  <div className="w-11 h-11 rounded-xl bg-purple-100 dark:bg-[#201C38] border border-purple-200 dark:border-[#5B4096]/60 flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(168,85,247,0.18)] group-hover:shadow-[0_0_20px_rgba(168,85,247,0.35)] transition-all">
                    {renderSkillIcon(skill.iconType)}
                  </div>

                  {/* Title & Subtitle */}
                  <div className="flex flex-col min-w-0">
                    <h4 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white tracking-tight leading-snug truncate">
                      {skill.title}
                    </h4>
                    <span className="text-xs text-slate-500 dark:text-[#9CA3AF] font-medium leading-none mt-1 truncate">
                      {skill.subtitle}
                    </span>
                  </div>
                </div>

                {/* Delete button on hover */}
                <button
                  type="button"
                  onClick={(e) => handleRemoveSkill(skill.id, e)}
                  title={`Remove ${skill.title}`}
                  className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 transition-all"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* =========================================================================
          MODAL: ADD NEW TOOL
          ========================================================================= */}
      {showAddTool && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-150">
          <div className="w-full max-w-sm rounded-3xl p-6 bg-white dark:bg-[#161622] border border-slate-200 dark:border-white/15 shadow-2xl flex flex-col gap-4 text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-white/10">
              <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
                Add Tool to Profile
              </h3>
              <button
                type="button"
                onClick={() => setShowAddTool(false)}
                className="p-1 rounded-full text-slate-400 hover:text-black dark:hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddTool} className="flex flex-col gap-3.5">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 dark:text-gray-300 uppercase tracking-wider mb-1">
                  Tool Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Blender, Docker, PyTorch"
                  value={newToolName}
                  onChange={(e) => setNewToolName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-300 dark:border-white/10 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-gray-500 outline-none focus:border-purple-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 dark:text-gray-300 uppercase tracking-wider mb-1">
                    Short Monogram
                  </label>
                  <input
                    type="text"
                    maxLength={3}
                    placeholder="e.g. Bl, Dk, Pt"
                    value={newToolShort}
                    onChange={(e) => setNewToolShort(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-300 dark:border-white/10 text-slate-900 dark:text-white placeholder-slate-400 outline-none focus:border-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 dark:text-gray-300 uppercase tracking-wider mb-1">
                    Brand Color
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={newToolColor}
                      onChange={(e) => setNewToolColor(e.target.value)}
                      className="w-9 h-9 rounded-lg border-0 bg-transparent cursor-pointer p-0"
                    />
                    <span className="font-mono text-[11px] text-slate-700 dark:text-gray-300">
                      {newToolColor}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200 dark:border-white/10">
                <button
                  type="button"
                  onClick={() => setShowAddTool(false)}
                  className="px-4 py-2 rounded-full font-bold text-slate-600 dark:text-gray-300 hover:text-black dark:hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-full font-black bg-[#D3E57A] text-[#1A2E05] hover:brightness-105 shadow-sm transition-all"
                >
                  Save Tool
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL: ADD NEW SKILL
          ========================================================================= */}
      {showAddSkill && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-150">
          <div className="w-full max-w-sm rounded-3xl p-6 bg-white dark:bg-[#161622] border border-slate-200 dark:border-white/15 shadow-2xl flex flex-col gap-4 text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-white/10">
              <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
                Add Core Skill
              </h3>
              <button
                type="button"
                onClick={() => setShowAddSkill(false)}
                className="p-1 rounded-full text-slate-400 hover:text-black dark:hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddSkill} className="flex flex-col gap-3.5">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 dark:text-gray-300 uppercase tracking-wider mb-1">
                  Skill Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. AI Agent Design, Product Strategy"
                  value={newSkillTitle}
                  onChange={(e) => setNewSkillTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-300 dark:border-white/10 text-slate-900 dark:text-white placeholder-slate-400 outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 dark:text-gray-300 uppercase tracking-wider mb-1">
                  Subtitle / Sub-disciplines
                </label>
                <input
                  type="text"
                  placeholder="e.g. Prompt Engineering & RAG"
                  value={newSkillSubtitle}
                  onChange={(e) => setNewSkillSubtitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-300 dark:border-white/10 text-slate-900 dark:text-white placeholder-slate-400 outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 dark:text-gray-300 uppercase tracking-wider mb-1">
                  Icon Style
                </label>
                <div className="grid grid-cols-6 gap-2">
                  {(
                    [
                      { id: "shield", icon: Shield },
                      { id: "sparkles", icon: Sparkles },
                      { id: "layout", icon: Layout },
                      { id: "pentool", icon: PenTool },
                      { id: "code", icon: Code2 },
                      { id: "cpu", icon: Cpu },
                    ] as const
                  ).map((it) => {
                    const Icon = it.icon;
                    const isSelected = newSkillIcon === it.id;
                    return (
                      <button
                        key={it.id}
                        type="button"
                        onClick={() => setNewSkillIcon(it.id)}
                        className={`p-2 rounded-xl border flex items-center justify-center transition-all ${
                          isSelected
                            ? "bg-purple-600 text-white border-purple-600 shadow-md scale-105"
                            : "bg-slate-100 dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-600 dark:text-gray-300 hover:bg-slate-200"
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200 dark:border-white/10">
                <button
                  type="button"
                  onClick={() => setShowAddSkill(false)}
                  className="px-4 py-2 rounded-full font-bold text-slate-600 dark:text-gray-300 hover:text-black dark:hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-full font-black bg-[#D3E57A] text-[#1A2E05] hover:brightness-105 shadow-sm transition-all"
                >
                  Save Skill
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default SkillsToolsSection;
