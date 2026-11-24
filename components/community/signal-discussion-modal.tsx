"use client";

import React, { useState, useEffect } from "react";
import { MessageSquare, ThumbsUp, Flag, Send, X, AlertCircle, CheckCircle } from "lucide-react";
import { useAuth } from "@/lib/auth/auth-context";

interface DiscussionModalProps {
  signalId: string;
  signalTitle: string;
  isOpen: boolean;
  onClose: () => void;
}

interface Post {
  id: number;
  student_id: number;
  author_name: string;
  content: string;
  helpful_count: number;
  comment_count: number;
  created_at: string;
}

export function SignalDiscussionModal({
  signalId,
  signalTitle,
  isOpen,
  onClose,
}: DiscussionModalProps) {
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [newContent, setNewContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [reportedPostId, setReportedPostId] = useState<number | null>(null);
  const [reportReason, setReportReason] = useState("spam");
  const [reportSuccess, setReportSuccess] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    async function loadDiscussions() {
      setLoading(true);
      try {
        const res = await fetch(`http://127.0.0.1:8000/community/posts?signal_id=${signalId}`);
        if (res.ok) {
          const data = await res.json();
          if (data.success && Array.isArray(data.data)) {
            setPosts(data.data);
          }
        } else {
          // Fallback mock discussions for signal
          setPosts([
            {
              id: 1,
              student_id: 1,
              author_name: "Aarav Patel",
              content: "This breakthrough directly impacts how we build agent workflows. Anyone trying out local SLM quantization with PyTorch?",
              helpful_count: 4,
              comment_count: 2,
              created_at: new Date(Date.now() - 3600000 * 4).toISOString(),
            },
            {
              id: 2,
              student_id: 2,
              author_name: "Riya Sen",
              content: "From a startup angle, edge latency reduction means we can offer zero-data-leakage enterprise demos without running massive cloud GPU clusters.",
              helpful_count: 6,
              comment_count: 1,
              created_at: new Date(Date.now() - 3600000 * 8).toISOString(),
            },
          ]);
        }
      } catch {
        setPosts([
          {
            id: 1,
            student_id: 1,
            author_name: "Aarav Patel",
            content: "This signal is super relevant for upcoming hackathons. We can incorporate this into our SIH architecture diagram.",
            helpful_count: 3,
            comment_count: 1,
            created_at: new Date().toISOString(),
          },
        ]);
      } finally {
        setLoading(false);
      }
    }
    loadDiscussions();
  }, [isOpen, signalId]);

  const handlePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newContent.trim() || submitting) return;

    setSubmitting(true);
    try {
      const res = await fetch("http://127.0.0.1:8000/community/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          student_id: user.id || 1,
          signal_id: signalId,
          content: newContent.trim(),
          post_type: "discussion",
        }),
      });
      if (res.ok) {
        const json = await res.json();
        setPosts([json.data, ...posts]);
        setNewContent("");
      } else {
        // Optimistic append
        const newPost: Post = {
          id: Date.now(),
          student_id: user.id || 1,
          author_name: user.name || "Student",
          content: newContent.trim(),
          helpful_count: 0,
          comment_count: 0,
          created_at: new Date().toISOString(),
        };
        setPosts([newPost, ...posts]);
        setNewContent("");
      }
    } catch {
      const newPost: Post = {
        id: Date.now(),
        student_id: user.id || 1,
        author_name: user.name || "Student",
        content: newContent.trim(),
        helpful_count: 0,
        comment_count: 0,
        created_at: new Date().toISOString(),
      };
      setPosts([newPost, ...posts]);
      setNewContent("");
    } finally {
      setSubmitting(false);
    }
  };

  const handleVote = async (postId: number) => {
    try {
      await fetch(`http://127.0.0.1:8000/community/posts/${postId}/vote`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ student_id: user.id || 1 }),
      });
    } catch {}
    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId ? { ...p, helpful_count: p.helpful_count + 1 } : p
      )
    );
  };

  const handleReport = async (postId: number) => {
    try {
      await fetch("http://127.0.0.1:8000/community/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reporter_student_id: user.id || 1,
          target_type: "post",
          target_id: postId,
          reason: reportReason,
        }),
      });
    } catch {}
    setReportSuccess(true);
    setTimeout(() => {
      setReportedPostId(null);
      setReportSuccess(false);
    }, 1500);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-2xl max-h-[85vh] bg-white dark:bg-[#1E1E24] rounded-[28px] border border-black/10 dark:border-white/10 shadow-2xl flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="p-5 border-b border-black/5 dark:border-white/10 flex items-start justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#D3E57A]/25 text-[#425008] dark:text-[#D3E57A] text-[11px] font-bold mb-1">
              <MessageSquare className="w-3 h-3" />
              Community Discussion
            </div>
            <h3 className="font-bold text-base text-[#1E1E22] dark:text-white line-clamp-1">
              {signalTitle}
            </h3>
          </div>
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="p-1.5 rounded-full hover:bg-black/5 dark:hover:bg-white/10 text-gray-400 hover:text-black dark:hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Discussions Feed */}
        <div className="flex-1 p-5 overflow-y-auto flex flex-col gap-3">
          {loading ? (
            <p className="text-xs text-gray-400 text-center py-8">Loading discussions...</p>
          ) : posts.length === 0 ? (
            <div className="text-center py-10">
              <MessageSquare className="w-8 h-8 text-gray-300 mx-auto mb-2" />
              <p className="text-xs font-semibold text-gray-500">No discussions yet</p>
              <p className="text-[11px] text-gray-400">Be the first to share your take on this signal.</p>
            </div>
          ) : (
            posts.map((post) => (
              <div
                key={post.id}
                className="p-4 rounded-2xl bg-black/[0.02] dark:bg-white/[0.03] border border-black/5 dark:border-white/5 flex flex-col gap-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-[#D3E57A] text-[#1E1E22] flex items-center justify-center font-bold text-[10px]">
                      {post.author_name[0]}
                    </div>
                    <span className="text-xs font-semibold text-[#1E1E22] dark:text-white">
                      {post.author_name}
                    </span>
                    <span className="text-[10px] text-gray-400">
                      {new Date(post.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>
                  <button
                    onClick={() => setReportedPostId(post.id)}
                    className="text-gray-400 hover:text-rose-500 text-[11px] flex items-center gap-1"
                    title="Report"
                  >
                    <Flag className="w-3 h-3" />
                  </button>
                </div>

                <p className="text-xs text-gray-700 dark:text-gray-200 leading-relaxed">
                  {post.content}
                </p>

                <div className="flex items-center gap-3 pt-2 mt-1 border-t border-black/5 dark:border-white/5">
                  <button
                    onClick={() => handleVote(post.id)}
                    className="inline-flex items-center gap-1 text-[11px] text-gray-500 hover:text-[#1E1E22] dark:hover:text-[#D3E57A] transition-colors"
                  >
                    <ThumbsUp className="w-3 h-3" />
                    <span>Helpful ({post.helpful_count})</span>
                  </button>
                </div>

                {/* Inline Report Dialog */}
                {reportedPostId === post.id && (
                  <div className="mt-2 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs">
                    {reportSuccess ? (
                      <p className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                        <CheckCircle className="w-3.5 h-3.5" /> Report submitted for moderation review.
                      </p>
                    ) : (
                      <div className="flex flex-col gap-2">
                        <p className="font-semibold text-rose-700 dark:text-rose-300">
                          Report this comment:
                        </p>
                        <select
                          value={reportReason}
                          onChange={(e) => setReportReason(e.target.value)}
                          className="px-2 py-1 rounded-lg bg-white dark:bg-black/20 text-xs border border-black/10 dark:border-white/10"
                        >
                          <option value="spam">Spam / Advertising</option>
                          <option value="misinformation">Misinformation</option>
                          <option value="harassment">Harassment or Abuse</option>
                          <option value="inappropriate">Inappropriate content</option>
                        </select>
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => handleReport(post.id)}
                            className="px-3 py-1 rounded-full bg-rose-600 text-white font-semibold text-[11px]"
                          >
                            Submit Report
                          </button>
                          <button
                            type="button"
                            onClick={() => setReportedPostId(null)}
                            className="px-3 py-1 rounded-full text-gray-500 text-[11px]"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Post Form */}
        <form onSubmit={handlePost} className="p-4 border-t border-black/5 dark:border-white/10 flex gap-2">
          <input
            type="text"
            placeholder="Share your perspective or ask the student community..."
            value={newContent}
            onChange={(e) => setNewContent(e.target.value)}
            minLength={5}
            maxLength={1000}
            required
            className="flex-1 px-4 py-2.5 rounded-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-xs outline-none focus:border-[#D3E57A] dark:text-white"
          />
          <button
            type="submit"
            disabled={newContent.trim().length < 5 || submitting}
            className="px-5 py-2.5 rounded-full bg-[#1E1E22] text-white dark:bg-white dark:text-[#1E1E22] text-xs font-semibold disabled:opacity-40 flex items-center gap-1.5 transition-opacity"
          >
            <Send className="w-3.5 h-3.5" />
            Post
          </button>
        </form>
      </div>
    </div>
  );
}
