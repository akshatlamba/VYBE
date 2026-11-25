"use client";

import React, { useState, useRef, useEffect } from "react";
import { useAuth } from "@/lib/auth/auth-context";
import {
  Hash,
  Volume2,
  Users,
  Search,
  Bell,
  Pin,
  Smile,
  PlusCircle,
  Send,
  Sparkles,
  PhoneCall,
  PhoneOff,
  Mic,
  MicOff,
  Headphones,
  Settings,
  ChevronDown,
  ShieldCheck,
  CheckCircle2,
  Share2,
  ExternalLink,
  MessageSquare,
  Radio,
  Flame,
  Award,
  Calendar,
  X,
  Code,
  Paperclip,
} from "lucide-react";

// ==========================================
// TYPES & DATA INTERFACES
// ==========================================

export interface ChannelMessage {
  id: string;
  authorName: string;
  authorRole: "mentor" | "builder" | "bot" | "alumni" | "student";
  authorRoleLabel?: string;
  avatarUrl?: string;
  initials: string;
  timestamp: string;
  content: string;
  isBot?: boolean;
  codeSnippet?: {
    language: string;
    code: string;
  };
  embed?: {
    type: "opportunity" | "signal" | "squad";
    title: string;
    subtitle: string;
    badgeText: string;
    details: string;
    actionLabel: string;
    actionHref?: string;
  };
  reactions: {
    emoji: string;
    count: number;
    userReacted?: boolean;
  }[];
}

interface Channel {
  id: string;
  name: string;
  category: string;
  type: "text" | "voice";
  unread?: number;
  topic?: string;
  activeSpeakers?: string[];
}

interface CommunityMember {
  id: string;
  name: string;
  role: "bot" | "student";
  roleLabel: string;
  status: string;
  avatarUrl?: string;
  initials: string;
  isOnline: boolean;
  isCurrentUser?: boolean;
}

// Initial Channels
const INITIAL_CHANNELS: Channel[] = [
  { id: "opportunities-intel", name: "opportunities-intel", category: "OPPORTUNITY & INTEL", type: "text", topic: "Discuss active hackathons, research grants, team formations & verified signals." },
  { id: "hackathon-squads", name: "hackathon-squads", category: "OPPORTUNITY & INTEL", type: "text", unread: 3, topic: "Find co-founders, teammates, frontend/backend leads for upcoming competitions." },
  { id: "research-grants", name: "research-grants", category: "OPPORTUNITY & INTEL", type: "text", topic: "Academic papers, ISM student fabrication grants, NSF & DST quantum initiatives." },
  { id: "build-in-public", name: "build-in-public", category: "OPPORTUNITY & INTEL", type: "text", topic: "Show off PRs, live demo deployments, benchmarks, and portfolio updates." },
  { id: "ask-mentors", name: "ask-mentors", category: "STUDY & SQUADS", type: "text", topic: "Direct guidance, pitch reviews, and technical AMA." },
  { id: "study-hall-lofi", name: "Study Hall (Lo-Fi)", category: "VOICE CHANNELS", type: "voice", activeSpeakers: ["Piyush", "Ashutosh", "Aashi"] },
  { id: "hackathon-war-room", name: "Hackathon War Room #1", category: "VOICE CHANNELS", type: "voice", activeSpeakers: ["Anugrah"] },
];

// Initial Messages Map by Channel ID featuring Akshat, Piyush, Ashutosh, Anugrah, Aashi
const INITIAL_MESSAGES: Record<string, ChannelMessage[]> = {
  "opportunities-intel": [
    {
      id: "msg-1",
      authorName: "Piyush",
      authorRole: "builder",
      authorRoleLabel: "FULLSTACK DEV",
      initials: "P",
      avatarUrl: "/avatars/avatar-1.svg",
      timestamp: "Today at 2:15 PM",
      content: "Smart India Hackathon 2026 problem statements are live! Akshat, Ashutosh and I were looking at the Smart Automation track. We need to lock in our problem statement before Friday.",
      reactions: [
        { emoji: "⚡", count: 8, userReacted: false },
        { emoji: "🚀", count: 6, userReacted: false },
      ],
    },
    {
      id: "msg-2",
      authorName: "PULSE Intelligence",
      authorRole: "bot",
      authorRoleLabel: "BOT",
      isBot: true,
      initials: "PI",
      timestamp: "Today at 2:48 PM",
      content: "⚡ **New Signal Verified**: India Semiconductor Mission expands student fabrication grants (₹450 Cr) across 80+ engineering colleges. Subsidized MPW tape-outs and VLSI EDA tool licenses are now accessible to SRM University squads.",
      embed: {
        type: "signal",
        title: "India Semiconductor Mission Student Fabrication Grants",
        subtitle: "MeitY & ISM Portal · Verified Government Signal",
        badgeText: "₹450 Cr Grant Pool",
        details: "Eligible for Electronics & Computer Science teams. Squads led by Akshat Lamba, Piyush, and Ashutosh match domain requirements.",
        actionLabel: "View Full Signal in Pulse",
        actionHref: "/world-pulse",
      },
      reactions: [
        { emoji: "🔥", count: 19, userReacted: true },
        { emoji: "🎯", count: 12, userReacted: false },
      ],
    },
    {
      id: "msg-3",
      authorName: "Ashutosh",
      authorRole: "builder",
      authorRoleLabel: "RESEARCH LEAD",
      initials: "A",
      avatarUrl: "/avatars/avatar-3.svg",
      timestamp: "Today at 3:10 PM",
      content: "We just finished benchmarking the sub-3B quantized model on our local Jetson Orin board. Zero cloud API calls and sub-40ms latency! Here is the setup snippet if anyone wants to run edge inferences for their project:",
      codeSnippet: {
        language: "python",
        code: `import torch\nfrom transformers import AutoModelForCausalLM, AutoTokenizer\n\n# Local quantized 3B checkpoint for edge deployment\nmodel = AutoModelForCausalLM.from_pretrained(\n    "meta-llama/Llama-3.2-3B-Instruct",\n    torch_dtype=torch.float16,\n    device_map="auto"\n)\nprint("Edge engine active without cloud latency.")`,
      },
      reactions: [
        { emoji: "💡", count: 14, userReacted: true },
        { emoji: "👀", count: 7, userReacted: false },
      ],
    },
    {
      id: "msg-4",
      authorName: "Aashi",
      authorRole: "student",
      authorRoleLabel: "UI/UX LEAD",
      initials: "A",
      avatarUrl: "/avatars/avatar-6.svg",
      timestamp: "Today at 3:34 PM",
      content: "I have updated the Figma design system with the liquid glass aesthetic and dark theme tokens. Piyush and Akshat, take a look at the component library before we integrate the frontend!",
      reactions: [
        { emoji: "🎨", count: 11, userReacted: false },
        { emoji: "🙌", count: 9, userReacted: true },
      ],
    },
  ],
  "hackathon-squads": [
    {
      id: "msg-squad-1",
      authorName: "Aashi",
      authorRole: "student",
      authorRoleLabel: "UI/UX LEAD",
      initials: "A",
      avatarUrl: "/avatars/avatar-6.svg",
      timestamp: "Today at 1:12 PM",
      content: "Hey team! I have completed the interactive prototype for our hackathon entry on Framer & Figma. Akshat Lamba, let's sync up on the API contracts so we can plug in the live inference feeds.",
      reactions: [
        { emoji: "🎨", count: 9, userReacted: false },
        { emoji: "🚀", count: 8, userReacted: true },
      ],
    },
    {
      id: "msg-squad-2",
      authorName: "Piyush",
      authorRole: "builder",
      authorRoleLabel: "FULLSTACK DEV",
      initials: "P",
      avatarUrl: "/avatars/avatar-1.svg",
      timestamp: "Today at 2:05 PM",
      content: "Team 'NeuralSync' update: Akshat Lamba (Architecture), Ashutosh (AI Models), Aashi (Design), Piyush (Fullstack). Anugrah is deploying our Docker container on the cloud testbed!",
      reactions: [
        { emoji: "🚀", count: 16, userReacted: true },
        { emoji: "🔥", count: 12, userReacted: false },
      ],
    },
  ],
  "research-grants": [
    {
      id: "msg-res-1",
      authorName: "Ashutosh",
      authorRole: "builder",
      authorRoleLabel: "RESEARCH LEAD",
      initials: "A",
      avatarUrl: "/avatars/avatar-3.svg",
      timestamp: "Yesterday at 6:40 PM",
      content: "Drafting our paper for the IEEE Student Paper Contest on Agentic Frameworks. Akshat, let's review the benchmark graphs for transformer memory reduction tonight.",
      reactions: [
        { emoji: "📄", count: 7, userReacted: false },
        { emoji: "💡", count: 8, userReacted: false },
      ],
    },
  ],
  "build-in-public": [
    {
      id: "msg-bip-1",
      authorName: "Anugrah",
      authorRole: "builder",
      authorRoleLabel: "CLOUD ENG",
      initials: "A",
      avatarUrl: "/avatars/avatar-5.svg",
      timestamp: "Today at 12:20 PM",
      content: "Shipped v0.9 of our student credentials verifier! Cryptographic proofs now verify in 12ms inside WebAssembly sandboxes without external auth server roundtrips. Demo test suite is all passing.",
      reactions: [
        { emoji: "🔥", count: 16, userReacted: true },
        { emoji: "🎉", count: 10, userReacted: false },
      ],
    },
  ],
  "ask-mentors": [
    {
      id: "msg-men-1",
      authorName: "Piyush",
      authorRole: "builder",
      authorRoleLabel: "FULLSTACK DEV",
      initials: "P",
      avatarUrl: "/avatars/avatar-1.svg",
      timestamp: "Today at 11:00 AM",
      content: "Office hours AMA: Drop your questions regarding pitching to hackathon judges, structuring multi-agent workflows, or deploying local SLM backends.",
      reactions: [
        { emoji: "🙌", count: 18, userReacted: true },
      ],
    },
  ],
};

export default function CommunityPage() {
  const { user } = useAuth();
  const currentUserName = user?.name || "Akshat Lamba";
  const currentUserInitials = currentUserName
    .split(" ")
    .filter(Boolean)
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() || "AL";

  const [activeChannelId, setActiveChannelId] = useState<string>("opportunities-intel");
  const [channels, setChannels] = useState<Channel[]>(INITIAL_CHANNELS);
  const [messagesMap, setMessagesMap] = useState<Record<string, ChannelMessage[]>>(INITIAL_MESSAGES);
  const [messageInput, setMessageInput] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [showMembers, setShowMembers] = useState<boolean>(true);
  const [connectedVoice, setConnectedVoice] = useState<string | null>(null);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isDeafened, setIsDeafened] = useState<boolean>(false);
  const [joinedSquadIds, setJoinedSquadIds] = useState<string[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeChannel = channels.find((c) => c.id === activeChannelId) || channels[0];
  const currentMessages = messagesMap[activeChannelId] || [];

  // Dedicated member list with Akshat Lamba (You), Piyush, Ashutosh, Anugrah, Aashi
  const membersList: CommunityMember[] = [
    { id: "mem-bot", name: "PULSE Intelligence", role: "bot", roleLabel: "BOT", status: "Indexing 12,400+ Global Signals", initials: "PI", isOnline: true },
    { id: "mem-akshat", name: currentUserName, role: "student", roleLabel: "YOU", status: "Building on VYBE Intelligence", avatarUrl: user?.avatar_url, initials: currentUserInitials, isOnline: true, isCurrentUser: true },
    { id: "mem-piyush", name: "Piyush", role: "student", roleLabel: "FULLSTACK DEV", status: "Building with Next.js 15 & FastAPI", avatarUrl: "/avatars/avatar-1.svg", initials: "P", isOnline: true },
    { id: "mem-ashutosh", name: "Ashutosh", role: "student", roleLabel: "RESEARCH LEAD", status: "Benchmarking Edge Quantization", avatarUrl: "/avatars/avatar-3.svg", initials: "A", isOnline: true },
    { id: "mem-anugrah", name: "Anugrah", role: "student", roleLabel: "CLOUD ENG", status: "Deploying Wasm Sandbox", avatarUrl: "/avatars/avatar-5.svg", initials: "A", isOnline: true },
    { id: "mem-aashi", name: "Aashi", role: "student", roleLabel: "UI/UX LEAD", status: "Figma Prototyping & Design Systems", avatarUrl: "/avatars/avatar-6.svg", initials: "A", isOnline: true },
  ];

  // Filter messages by search query if any
  const filteredMessages = searchQuery.trim()
    ? currentMessages.filter((m) =>
        m.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.authorName.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : currentMessages;

  // Auto scroll to bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messagesMap, activeChannelId]);

  // Handle Send Message
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageInput.trim()) return;

    const newMessage: ChannelMessage = {
      id: `msg-${Date.now()}`,
      authorName: currentUserName,
      authorRole: "builder",
      authorRoleLabel: "YOU",
      initials: currentUserInitials,
      avatarUrl: user?.avatar_url,
      timestamp: "Today at " + new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      content: messageInput.trim(),
      reactions: [],
    };

    setMessagesMap((prev) => ({
      ...prev,
      [activeChannelId]: [...(prev[activeChannelId] || []), newMessage],
    }));

    setMessageInput("");
  };

  // Toggle Reaction on message
  const handleToggleReaction = (messageId: string, emoji: string) => {
    setMessagesMap((prev) => {
      const channelMsgs = prev[activeChannelId] || [];
      const updated = channelMsgs.map((m) => {
        if (m.id !== messageId) return m;

        const existingReaction = m.reactions.find((r) => r.emoji === emoji);
        let updatedReactions;

        if (existingReaction) {
          if (existingReaction.userReacted) {
            updatedReactions = m.reactions
              .map((r) => (r.emoji === emoji ? { ...r, count: r.count - 1, userReacted: false } : r))
              .filter((r) => r.count > 0);
          } else {
            updatedReactions = m.reactions.map((r) =>
              r.emoji === emoji ? { ...r, count: r.count + 1, userReacted: true } : r
            );
          }
        } else {
          updatedReactions = [...m.reactions, { emoji, count: 1, userReacted: true }];
        }

        return { ...m, reactions: updatedReactions };
      });

      return { ...prev, [activeChannelId]: updated };
    });
  };

  // Add default quick reaction
  const handleAddQuickEmoji = (messageId: string, emoji: string) => {
    handleToggleReaction(messageId, emoji);
  };

  // Handle Channel Click
  const handleSelectChannel = (channel: Channel) => {
    if (channel.type === "voice") {
      setConnectedVoice(channel.name);
    } else {
      setActiveChannelId(channel.id);
      if (channel.unread) {
        setChannels((prev) =>
          prev.map((c) => (c.id === channel.id ? { ...c, unread: undefined } : c))
        );
      }
    }
  };

  // Channel Category Grouping
  const categories = Array.from(new Set(channels.map((c) => c.category)));

  return (
    <div className="w-full h-full min-h-0 flex-1 overflow-hidden flex flex-col">
      {/* Discord Window Shell - Viewport Fixed, Outer Never Scrolls */}
      <div className="flex-1 flex min-h-0 h-full overflow-hidden rounded-[24px] sm:rounded-[28px] border border-white/60 dark:border-white/10 shadow-2xl bg-white/70 dark:bg-[#1E1F22]/95 backdrop-blur-2xl">
        {/* ========================================================= */}
        {/* PANE 1: LEFT CHANNELS SIDEBAR (Discord Style) */}
        {/* ========================================================= */}
        <div className="w-64 sm:w-72 shrink-0 bg-[#F2F3F5]/85 dark:bg-[#2B2D31]/95 flex flex-col h-full min-h-0 overflow-hidden border-r border-black/5 dark:border-white/5 select-none">
          {/* Server Top Header */}
          <div className="h-14 px-4 border-b border-black/5 dark:border-white/10 flex items-center justify-between shadow-xs bg-white/40 dark:bg-[#1E1F22]/50 shrink-0">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#6366F1] to-[#F97316] flex items-center justify-center text-white font-black text-xs shadow-sm shrink-0">
                V
              </div>
              <div className="flex flex-col min-w-0">
                <span className="font-bold text-sm text-[#1E1E22] dark:text-white truncate flex items-center gap-1.5">
                  VYBE Campus Hub
                  <ShieldCheck className="w-3.5 h-3.5 text-[#D3E57A] shrink-0" />
                </span>
                <span className="text-[10px] text-green-600 dark:text-[#D3E57A] font-semibold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                  5 Members Online
                </span>
              </div>
            </div>
            <ChevronDown className="w-4 h-4 text-gray-400 shrink-0" />
          </div>

          {/* Channels Scroll Area - Self Contained Scroll */}
          <div className="flex-1 min-h-0 overflow-y-auto px-2 py-3 space-y-4 overscroll-contain">
            {categories.map((category) => {
              const catChannels = channels.filter((c) => c.category === category);
              return (
                <div key={category} className="space-y-0.5">
                  <div className="px-2 py-1 text-[11px] font-extrabold uppercase tracking-wider text-gray-500 dark:text-[#949BA4] flex items-center justify-between">
                    <span>{category}</span>
                    <PlusCircle className="w-3 h-3 text-gray-400 hover:text-white cursor-pointer transition-colors" />
                  </div>

                  {catChannels.map((channel) => {
                    const isSelected = channel.id === activeChannelId;
                    const isVoice = channel.type === "voice";
                    const isConnected = connectedVoice === channel.name;

                    return (
                      <div key={channel.id} className="space-y-1">
                        <button
                          onClick={() => handleSelectChannel(channel)}
                          className={`w-full group flex items-center justify-between px-2.5 py-1.5 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
                            isSelected && !isVoice
                              ? "bg-black/10 dark:bg-[#404249] text-[#1E1E22] dark:text-white shadow-xs"
                              : "text-gray-600 dark:text-[#949BA4] hover:bg-black/5 dark:hover:bg-[#35373C] hover:text-[#1E1E22] dark:hover:text-[#DBDEE1]"
                          }`}
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            {isVoice ? (
                              <Volume2
                                className={`w-4 h-4 shrink-0 ${
                                  isConnected ? "text-green-500 animate-pulse" : "text-gray-400 group-hover:text-white"
                                }`}
                              />
                            ) : (
                              <Hash className="w-4 h-4 text-gray-400 group-hover:text-white shrink-0" />
                            )}
                            <span className="truncate">{channel.name}</span>
                          </div>

                          {channel.unread && (
                            <span className="px-1.5 py-0.2 rounded-full bg-[#E0605E] text-white text-[10px] font-bold shadow-xs">
                              {channel.unread}
                            </span>
                          )}

                          {isVoice && isConnected && (
                            <span className="w-2 h-2 rounded-full bg-green-500" />
                          )}
                        </button>

                        {/* If Voice channel has active speakers */}
                        {isVoice && channel.activeSpeakers && channel.activeSpeakers.length > 0 && (
                          <div className="pl-6 pr-2 py-0.5 space-y-1">
                            {channel.activeSpeakers.map((speaker, idx) => (
                              <div
                                key={idx}
                                className="flex items-center gap-1.5 text-[11px] text-gray-500 dark:text-[#949BA4]"
                              >
                                <span className="w-1.5 h-1.5 rounded-full bg-green-500 shrink-0" />
                                <span className="truncate">{speaker}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>

          {/* Connected Voice Status Bar (Discord Style) */}
          {connectedVoice && (
            <div className="p-3 bg-green-500/10 dark:bg-[#1E1F22] border-t border-green-500/20 dark:border-white/5 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2 min-w-0">
                <Radio className="w-4 h-4 text-green-500 animate-pulse shrink-0" />
                <div className="flex flex-col min-w-0">
                  <span className="text-xs font-bold text-green-600 dark:text-green-400 truncate">
                    Voice Connected
                  </span>
                  <span className="text-[10px] text-gray-500 truncate">{connectedVoice} / 16ms</span>
                </div>
              </div>
              <button
                onClick={() => setConnectedVoice(null)}
                className="p-1.5 rounded-md hover:bg-black/10 dark:hover:bg-white/10 text-red-500 transition-colors"
                title="Disconnect Voice"
              >
                <PhoneOff className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Bottom Current User Bar (Discord Classic) */}
          <div className="h-14 px-3 bg-[#E3E5E8]/80 dark:bg-[#232428] border-t border-black/5 dark:border-white/10 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2 min-w-0">
              <div className="relative w-8 h-8 rounded-full bg-[#D3E57A] text-[#1E1E22] font-black text-xs flex items-center justify-center shrink-0 shadow-xs overflow-hidden">
                {user?.avatar_url ? (
                  <img src={user.avatar_url} alt={currentUserName} className="w-full h-full object-cover" />
                ) : (
                  currentUserInitials
                )}
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-green-500 border-2 border-white dark:border-[#232428]" />
              </div>

              <div className="flex flex-col min-w-0">
                <span className="font-bold text-xs text-[#1E1E22] dark:text-white truncate">
                  {currentUserName}
                </span>
                <span className="text-[10px] text-gray-500 dark:text-[#949BA4] truncate">
                  #2026 · Online
                </span>
              </div>
            </div>

            {/* Mic & Audio Quick Controls */}
            <div className="flex items-center gap-0.5 text-gray-500 dark:text-[#B5BAC1]">
              <button
                onClick={() => setIsMuted(!isMuted)}
                className={`p-1.5 rounded hover:bg-black/10 dark:hover:bg-white/10 transition-colors ${
                  isMuted ? "text-red-500" : ""
                }`}
                title={isMuted ? "Unmute" : "Mute"}
              >
                {isMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </button>
              <button
                onClick={() => setIsDeafened(!isDeafened)}
                className={`p-1.5 rounded hover:bg-black/10 dark:hover:bg-white/10 transition-colors ${
                  isDeafened ? "text-red-500" : ""
                }`}
                title={isDeafened ? "Undeafen" : "Deafen"}
              >
                <Headphones className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* PANE 2: MAIN CHAT & FEED AREA */}
        {/* ========================================================= */}
        <div className="flex-1 flex flex-col min-w-0 h-full min-h-0 bg-white/50 dark:bg-[#313338]/95 relative overflow-hidden">
          {/* Top Channel Header Bar */}
          <div className="h-14 px-4 border-b border-black/5 dark:border-white/10 flex items-center justify-between shadow-xs bg-white/70 dark:bg-[#313338] z-10 shrink-0">
            <div className="flex items-center gap-2.5 min-w-0 flex-1">
              <Hash className="w-5 h-5 text-gray-400 shrink-0" />
              <h2 className="text-base font-bold text-[#1E1E22] dark:text-white shrink-0">
                {activeChannel.name}
              </h2>
              {activeChannel.topic && (
                <>
                  <span className="text-gray-300 dark:text-gray-600 hidden lg:inline shrink-0">|</span>
                  <span className="text-xs text-gray-500 dark:text-[#949BA4] truncate hidden lg:inline max-w-md">
                    {activeChannel.topic}
                  </span>
                </>
              )}
            </div>

            {/* Header Right Actions */}
            <div className="flex items-center gap-2 shrink-0">
              {/* Channel Search Input */}
              <div className="relative hidden sm:block">
                <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search channel"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 pr-3 py-1 rounded-md text-xs bg-black/5 dark:bg-[#1E1F22] text-[#1E1E22] dark:text-white border-none outline-none focus:ring-1 focus:ring-[#D3E57A] w-36 lg:w-48 transition-all"
                />
              </div>

              <button
                className="p-1.5 rounded-md hover:bg-black/5 dark:hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                title="Notification Settings"
              >
                <Bell className="w-4 h-4" />
              </button>

              <button
                className="p-1.5 rounded-md hover:bg-black/5 dark:hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                title="Pinned Messages"
              >
                <Pin className="w-4 h-4" />
              </button>

              <button
                onClick={() => setShowMembers(!showMembers)}
                className={`p-1.5 rounded-md hover:bg-black/5 dark:hover:bg-white/10 transition-colors ${
                  showMembers ? "text-[#1E1E22] dark:text-white bg-black/5 dark:bg-white/10" : "text-gray-400"
                }`}
                title="Toggle Member List"
              >
                <Users className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Message Stream - Self Contained Scroll with overscroll containment */}
          <div className="flex-1 min-h-0 overflow-y-auto px-4 py-4 space-y-6 overscroll-contain">
            {/* Welcome banner at start of channel */}
            <div className="pt-4 pb-2 border-b border-black/5 dark:border-white/10">
              <div className="w-14 h-14 rounded-full bg-black/5 dark:bg-[#404249] flex items-center justify-center text-gray-400 dark:text-white mb-2">
                <Hash className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-[#1E1E22] dark:text-white">
                Welcome to #{activeChannel.name}!
              </h3>
              <p className="text-xs text-gray-500 dark:text-[#949BA4] mt-1">
                This is the start of the #{activeChannel.name} channel for VYBE Campus members.
              </p>
            </div>

            {/* Messages */}
            {filteredMessages.map((msg) => {
              return (
                <div key={msg.id} className="group flex gap-3.5 hover:bg-black/[0.02] dark:hover:bg-[#2E3035]/60 -mx-4 px-4 py-2 rounded-lg transition-colors">
                  {/* Author Avatar */}
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#FAD8C6] via-[#F6C9DD] to-[#D9C9F5] flex items-center justify-center text-[#1E1E22] font-black text-xs shrink-0 overflow-hidden shadow-xs mt-0.5">
                    {msg.avatarUrl ? (
                      <img src={msg.avatarUrl} alt={msg.authorName} className="w-full h-full object-cover" />
                    ) : (
                      msg.initials
                    )}
                  </div>

                  {/* Message Body */}
                  <div className="flex-1 min-w-0 flex flex-col gap-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-sm text-[#1E1E22] dark:text-white">
                        {msg.authorName}
                      </span>

                      {/* Discord Role Badge */}
                      {msg.authorRoleLabel && (
                        <span
                          className={`px-1.5 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wide ${
                            msg.isBot
                              ? "bg-[#5865F2] text-white"
                              : msg.authorRoleLabel === "YOU"
                              ? "bg-[#D3E57A] text-[#1E1E22]"
                              : msg.authorRoleLabel === "RESEARCH LEAD"
                              ? "bg-[#6366F1] text-white"
                              : msg.authorRoleLabel === "FULLSTACK DEV"
                              ? "bg-[#F97316] text-white"
                              : msg.authorRoleLabel === "UI/UX LEAD"
                              ? "bg-[#EC4899] text-white"
                              : "bg-black/10 dark:bg-white/10 text-gray-600 dark:text-gray-300"
                          }`}
                        >
                          {msg.authorRoleLabel}
                        </span>
                      )}

                      <span className="text-[11px] text-gray-400 dark:text-[#949BA4]">
                        {msg.timestamp}
                      </span>
                    </div>

                    {/* Content Text */}
                    <p className="text-sm text-[#313338] dark:text-[#DBDEE1] leading-relaxed whitespace-pre-line">
                      {msg.content}
                    </p>

                    {/* Code snippet embed if present */}
                    {msg.codeSnippet && (
                      <div className="mt-2 rounded-xl p-3 bg-[#1E1F22] text-[#DBDEE1] font-mono text-xs overflow-x-auto border border-white/10">
                        <div className="flex items-center justify-between text-[10px] text-gray-400 pb-1.5 mb-1.5 border-b border-white/10">
                          <span>{msg.codeSnippet.language.toUpperCase()}</span>
                          <Code className="w-3.5 h-3.5 text-gray-400" />
                        </div>
                        <pre>{msg.codeSnippet.code}</pre>
                      </div>
                    )}

                    {/* Rich Opportunity / Signal Embed Card */}
                    {msg.embed && (
                      <div className="mt-2.5 max-w-lg rounded-2xl p-4 bg-white/90 dark:bg-[#2B2D31] border-l-4 border-l-[#D3E57A] border border-black/5 dark:border-white/10 shadow-sm flex flex-col gap-2">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                            {msg.embed.subtitle}
                          </span>
                          <span className="px-2 py-0.5 rounded-full bg-[#D3E57A]/20 text-[#425008] dark:text-[#D3E57A] text-[10px] font-bold">
                            {msg.embed.badgeText}
                          </span>
                        </div>

                        <h4 className="font-bold text-sm text-[#1E1E22] dark:text-white">
                          {msg.embed.title}
                        </h4>

                        <p className="text-xs text-gray-600 dark:text-gray-300">
                          {msg.embed.details}
                        </p>

                        <div className="pt-2 flex items-center gap-2">
                          <button
                            onClick={() => {
                              if (!joinedSquadIds.includes(msg.id)) {
                                setJoinedSquadIds([...joinedSquadIds, msg.id]);
                              }
                            }}
                            className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all shadow-xs ${
                              joinedSquadIds.includes(msg.id)
                                ? "bg-green-600 text-white"
                                : "bg-[#D3E57A] hover:bg-[#c5da62] text-[#1E1E22]"
                            }`}
                          >
                            {joinedSquadIds.includes(msg.id) ? "✓ Squad Request Sent" : "Join Squad"}
                          </button>

                          {msg.embed.actionHref && (
                            <a
                              href={msg.embed.actionHref}
                              className="px-3 py-1.5 rounded-full bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/15 text-xs font-semibold text-[#1E1E22] dark:text-white flex items-center gap-1 transition-colors"
                            >
                              <span>{msg.embed.actionLabel}</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Reactions Bar */}
                    <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                      {msg.reactions.map((react, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleToggleReaction(msg.id, react.emoji)}
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                            react.userReacted
                              ? "bg-[#5865F2]/20 border border-[#5865F2]/50 text-[#5865F2] dark:text-white"
                              : "bg-black/5 dark:bg-[#2B2D31] hover:bg-black/10 dark:hover:bg-[#35373C] text-gray-600 dark:text-[#B5BAC1]"
                          }`}
                        >
                          <span>{react.emoji}</span>
                          <span>{react.count}</span>
                        </button>
                      ))}

                      {/* Quick Add Reaction Buttons on Hover */}
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 ml-1">
                        {["🚀", "🔥", "💡"].map((em) => (
                          <button
                            key={em}
                            onClick={() => handleAddQuickEmoji(msg.id, em)}
                            className="p-1 rounded hover:bg-black/10 dark:hover:bg-white/10 text-xs transition-colors"
                            title={`React with ${em}`}
                          >
                            {em}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* Discord Message Input Area */}
          <div className="p-4 bg-white/70 dark:bg-[#313338] border-t border-black/5 dark:border-white/10 shrink-0">
            <form
              onSubmit={handleSendMessage}
              className="flex items-center gap-2 bg-[#EBEDEF] dark:bg-[#383A40] rounded-xl px-4 py-2.5 focus-within:ring-2 focus-within:ring-[#D3E57A]/50 transition-all shadow-inner"
            >
              <button
                type="button"
                className="p-1 text-gray-400 hover:text-white transition-colors"
                title="Attach Code / File"
              >
                <PlusCircle className="w-5 h-5" />
              </button>

              <input
                type="text"
                placeholder={`Message #${activeChannel.name}... (Type @PULSE for AI assist)`}
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                className="flex-1 bg-transparent text-sm text-[#1E1E22] dark:text-white placeholder-gray-500 dark:placeholder-[#949BA4] outline-none"
              />

              <button
                type="button"
                className="p-1 text-gray-400 hover:text-yellow-400 transition-colors"
                title="Add Reaction"
                onClick={() => setMessageInput((prev) => prev + " 🚀")}
              >
                <Smile className="w-5 h-5" />
              </button>

              <button
                type="submit"
                disabled={!messageInput.trim()}
                className={`p-1.5 rounded-lg transition-all ${
                  messageInput.trim()
                    ? "bg-[#D3E57A] text-[#1E1E22] hover:bg-[#c5da62] shadow-xs cursor-pointer"
                    : "text-gray-400 opacity-50 cursor-not-allowed"
                }`}
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
            <div className="flex items-center justify-between text-[11px] text-gray-400 dark:text-[#949BA4] mt-1.5 px-1">
              <span>Tip: Mention <strong>@PULSE</strong> to summarize opportunities or generate squad requirements.</span>
              <span className="font-mono">Enter to send</span>
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* PANE 3: RIGHT MEMBERS LIST (Discord Categorized) */}
        {/* ========================================================= */}
        {showMembers && (
          <div className="w-56 lg:w-60 shrink-0 bg-[#F2F3F5]/85 dark:bg-[#2B2D31]/95 border-l border-black/5 dark:border-white/5 flex flex-col h-full min-h-0 select-none overflow-y-auto p-3 space-y-4 hidden md:flex overscroll-contain">
            {/* Group 1: PULSE Bot */}
            <div className="space-y-1">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-gray-500 dark:text-[#949BA4] px-2">
                PULSE AI BOTS — 1
              </span>
              <div className="flex items-center gap-2.5 px-2 py-1.5 rounded-lg hover:bg-black/5 dark:hover:bg-[#35373C] transition-colors cursor-pointer">
                <div className="relative w-8 h-8 rounded-full bg-gradient-to-tr from-[#6366F1] to-[#D3E57A] flex items-center justify-center text-white font-bold text-xs shrink-0">
                  <Sparkles className="w-4 h-4 text-white" />
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-green-500 border-2 border-white dark:border-[#2B2D31]" />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-xs font-bold text-[#1E1E22] dark:text-white truncate flex items-center gap-1">
                    PULSE Bot
                    <span className="px-1 py-0.2 rounded text-[8px] bg-[#5865F2] text-white font-black">
                      BOT
                    </span>
                  </span>
                  <span className="text-[10px] text-gray-400 truncate">Signal Engine Active</span>
                </div>
              </div>
            </div>

            {/* Group 2: Campus Squad (Akshat, Piyush, Ashutosh, Anugrah, Aashi) */}
            <div className="space-y-1">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-gray-500 dark:text-[#949BA4] px-2">
                CAMPUS SQUAD — 5
              </span>
              {membersList.filter((m) => m.role === "student").map((member) => (
                <div
                  key={member.id}
                  className="flex items-center gap-2.5 px-2 py-1.5 rounded-lg hover:bg-black/5 dark:hover:bg-[#35373C] transition-colors cursor-pointer"
                >
                  <div className="relative w-8 h-8 rounded-full bg-gradient-to-tr from-[#FAD8C6] via-[#F6C9DD] to-[#D9C9F5] flex items-center justify-center text-[#1E1E22] font-black text-xs shrink-0 overflow-hidden">
                    {member.avatarUrl ? (
                      <img src={member.avatarUrl} alt={member.name} className="w-full h-full object-cover" />
                    ) : (
                      member.initials
                    )}
                    <span
                      className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-white dark:border-[#2B2D31] ${
                        member.isOnline ? "bg-green-500" : "bg-gray-400"
                      }`}
                    />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className={`text-xs font-semibold truncate flex items-center gap-1 ${
                      member.isCurrentUser ? "text-[#1E1E22] dark:text-[#D3E57A] font-bold" : "text-[#1E1E22] dark:text-white"
                    }`}>
                      {member.name}
                      {member.isCurrentUser && (
                        <span className="px-1 py-0.2 rounded text-[8px] bg-[#D3E57A] text-[#1E1E22] font-black">
                          YOU
                        </span>
                      )}
                    </span>
                    <span className="text-[10px] text-gray-400 truncate">{member.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
