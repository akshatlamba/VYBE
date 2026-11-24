// ==============================================================================
// VYBE Centralized Typed API Client
// Connects Next.js Frontend to FastAPI Backend with Type Safety & Graceful Fallbacks
// ==============================================================================

import { INITIAL_SIGNALS, INITIAL_OPPORTUNITIES, PERSONAS, OUTCOMES_STORE } from "../data/mock-db";

const FASTAPI_BASE_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "http://127.0.0.1:8000";

async function fetchWithTimeout(url: string, options: RequestInit = {}, timeoutMs: number = 6000): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    return res;
  } catch (err) {
    clearTimeout(timeoutId);
    throw err;
  }
}

export const api = {
  // ==========================================
  // STUDENT DNA & PROFILE
  // ==========================================
  students: {
    async getProfile(studentId: number = 1): Promise<{ success: boolean; data: any; is_live: boolean }> {
      try {
        const res = await fetchWithTimeout(`${FASTAPI_BASE_URL}/students/${studentId}/profile`, {
          headers: { "Content-Type": "application/json" },
        });
        if (res.ok) {
          const json = await res.json();
          return { success: true, data: json.profile || json, is_live: true };
        }
      } catch {
        // Fallback to active persona
      }
      return { success: true, data: PERSONAS.beginner, is_live: false };
    },

    async updateProfile(studentId: number = 1, profileData: any): Promise<{ success: boolean; data: any; is_live: boolean }> {
      try {
        const res = await fetchWithTimeout(`${FASTAPI_BASE_URL}/students/${studentId}/profile`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(profileData),
        });
        if (res.ok) {
          const json = await res.json();
          return { success: true, data: json.profile || json, is_live: true };
        }
      } catch {
        // Fallback update in-memory
      }
      Object.assign(PERSONAS.beginner, profileData);
      return { success: true, data: PERSONAS.beginner, is_live: false };
    },
  },

  // ==========================================
  // PULSE CONVERSATIONAL INTELLIGENCE
  // ==========================================
  pulse: {
    async ask(params: {
      student_id?: number | string;
      question: string;
      signal_id?: string;
      persona_id?: string;
      language?: string;
    }): Promise<{ success: boolean; data: any; is_live: boolean }> {
      // 1. Try FastAPI backend directly
      try {
        const res = await fetchWithTimeout(`${FASTAPI_BASE_URL}/pulse/ask`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            student_id: params.student_id || 1,
            question: params.question,
            signal_id: params.signal_id,
            persona_id: params.persona_id,
            language: params.language || "en",
          }),
        }, 8000);

        if (res.ok) {
          const json = await res.json();
          return { success: true, data: json, is_live: true };
        }
      } catch {
        // Fallback to Next.js API route proxy / mock AI provider
      }

      try {
        const res = await fetch("/api/pulse", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message: params.question,
            persona_id: params.persona_id || "beginner",
            signal_id: params.signal_id,
            language: params.language || "en",
          }),
        });
        const json = await res.json();
        return { success: json.success, data: json.data, is_live: false };
      } catch (err: any) {
        return {
          success: false,
          data: {
            content: "PULSE is momentarily reconnecting. Please check backend status.",
            why_this: "Connection temporary pause.",
            action_proposals: [],
            opportunity_ids: [],
          },
          is_live: false,
        };
      }
    },
  },

  // ==========================================
  // WORLD PULSE & WORLD-TO-ACTION
  // ==========================================
  worldPulse: {
    async getSignals(): Promise<{ success: boolean; data: any[]; is_live: boolean }> {
      try {
        const res = await fetchWithTimeout(`${FASTAPI_BASE_URL}/world-to-action/signals`);
        if (res.ok) {
          const json = await res.json();
          return { success: true, data: json.data || json, is_live: true };
        }
      } catch {
        // Fallback
      }
      return { success: true, data: INITIAL_SIGNALS, is_live: false };
    },

    async getWorldToAction(studentId: number = 1): Promise<{ success: boolean; data: any; is_live: boolean }> {
      try {
        const res = await fetchWithTimeout(`${FASTAPI_BASE_URL}/world-to-action/${studentId}`);
        if (res.ok) {
          const json = await res.json();
          return { success: true, data: json, is_live: true };
        }
      } catch {
        // Fallback
      }
      return {
        success: true,
        data: {
          student: PERSONAS.beginner,
          world_pulse: { recommended_trends: INITIAL_SIGNALS.slice(0, 3) },
          action_plan: [
            { kind: "learn", title: "Learn Python Async APIs" },
            { kind: "build", title: "Build small prototype agent" },
            { kind: "apply", title: "Participate in Smart India Hackathon" },
          ],
        },
        is_live: false,
      };
    },
  },

  // ==========================================
  // EVENTS & WATCHLIST & CALENDAR
  // ==========================================
  events: {
    async getAll(): Promise<{ success: boolean; data: any[]; is_live: boolean }> {
      try {
        const res = await fetchWithTimeout(`${FASTAPI_BASE_URL}/events/`);
        if (res.ok) {
          const json = await res.json();
          return { success: true, data: json, is_live: true };
        }
      } catch {}
      return { success: true, data: INITIAL_OPPORTUNITIES, is_live: false };
    },

    async getWatchlist(studentId: number = 1): Promise<{ success: boolean; data: any[]; is_live: boolean }> {
      try {
        const res = await fetchWithTimeout(`${FASTAPI_BASE_URL}/events/watchlist/${studentId}`);
        if (res.ok) {
          const json = await res.json();
          return { success: true, data: json, is_live: true };
        }
      } catch {}
      return { success: true, data: [], is_live: false };
    },

    async addToWatchlist(studentId: number, eventId: number, prefs?: any): Promise<{ success: boolean; data: any }> {
      try {
        const res = await fetchWithTimeout(`${FASTAPI_BASE_URL}/events/watchlist`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            student_id: studentId,
            event_id: eventId,
            ...(prefs || {}),
          }),
        });
        if (res.ok) {
          const json = await res.json();
          return { success: true, data: json };
        }
      } catch {}
      return { success: false, data: null };
    },

    async updateWatchlist(studentId: number, eventId: number, updates: any): Promise<{ success: boolean; data: any }> {
      try {
        const res = await fetchWithTimeout(`${FASTAPI_BASE_URL}/events/watchlist/${studentId}/${eventId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updates),
        });
        if (res.ok) {
          const json = await res.json();
          return { success: true, data: json };
        }
      } catch {}
      return { success: false, data: null };
    },

    getCalendarExportUrl(studentId: number = 1): string {
      return `${FASTAPI_BASE_URL}/events/calendar/${studentId}/export.ics`;
    },
  },

  // ==========================================
  // GROWTH PASSPORT (PROJECTS, EVIDENCE)
  // ==========================================
  passport: {
    async getProjects(studentId: number = 1): Promise<{ success: boolean; data: any[]; is_live: boolean }> {
      try {
        const res = await fetchWithTimeout(`${FASTAPI_BASE_URL}/growth-passport/projects/student/${studentId}`);
        if (res.ok) {
          const json = await res.json();
          return { success: true, data: json.projects || json, is_live: true };
        }
      } catch {}
      return { success: true, data: OUTCOMES_STORE as any, is_live: false };
    },

    async getSummary(studentId: number = 1): Promise<{ success: boolean; data: any; is_live: boolean }> {
      try {
        const res = await fetchWithTimeout(`${FASTAPI_BASE_URL}/growth-passport/summary/${studentId}`);
        if (res.ok) {
          const json = await res.json();
          return { success: true, data: json, is_live: true };
        }
      } catch {}
      return {
        success: true,
        data: {
          total_records: OUTCOMES_STORE.length,
          verified_count: OUTCOMES_STORE.filter((o) => o.verification === "verified").length,
          link_supported_count: OUTCOMES_STORE.filter((o) => o.verification === "link_supported").length,
          self_reported_count: OUTCOMES_STORE.filter((o) => o.verification === "self_reported").length,
          skills_gained: Array.from(new Set(OUTCOMES_STORE.flatMap((o) => o.skills_gained))),
        },
        is_live: false,
      };
    },

    async createProject(studentId: number, title: string, description?: string, category?: string): Promise<any> {
      try {
        const res = await fetchWithTimeout(`${FASTAPI_BASE_URL}/growth-passport/projects`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ student_id: studentId, title, description, category }),
        });
        if (res.ok) {
          return await res.json();
        }
      } catch {}
      return null;
    },

    async addEvidence(projectId: number, title: string, url: string, evidenceType: string = "github"): Promise<any> {
      try {
        const res = await fetchWithTimeout(`${FASTAPI_BASE_URL}/growth-passport/projects/${projectId}/evidence`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title, url, evidence_type: evidenceType }),
        });
        if (res.ok) {
          return await res.json();
        }
      } catch {}
      return null;
    },
  },

  // ==========================================
  // NOTIFICATIONS
  // ==========================================
  notifications: {
    async getNotifications(studentId: number = 1): Promise<{ success: boolean; data: any[]; unread: number; is_live: boolean }> {
      try {
        const res = await fetchWithTimeout(`${FASTAPI_BASE_URL}/notifications/${studentId}`);
        if (res.ok) {
          const json = await res.json();
          return {
            success: true,
            data: json.notifications || [],
            unread: json.unread || 0,
            is_live: true,
          };
        }
      } catch {}
      return {
        success: true,
        data: [
          {
            id: 1,
            title: "Deadline Approaching",
            message: "Smart India Hackathon 2026 registration closes in 4 days.",
            is_read: false,
            created_at: new Date().toISOString(),
          },
          {
            id: 2,
            title: "Global Signal Aligned",
            message: "Autonomous Coding Agents signal aligns with your Python & AI skills.",
            is_read: false,
            created_at: new Date(Date.now() - 86400000).toISOString(),
          },
        ],
        unread: 2,
        is_live: false,
      };
    },

    async markAsRead(notificationId: number, studentId: number = 1): Promise<boolean> {
      try {
        const res = await fetchWithTimeout(`${FASTAPI_BASE_URL}/notifications/${notificationId}/read?student_id=${studentId}`, {
          method: "PATCH",
        });
        return res.ok;
      } catch {
        return false;
      }
    },

    async markAllAsRead(studentId: number = 1): Promise<boolean> {
      try {
        const res = await fetchWithTimeout(`${FASTAPI_BASE_URL}/notifications/${studentId}/read-all`, {
          method: "PATCH",
        });
        return res.ok;
      } catch {
        return false;
      }
    },
  },
};
