"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { PERSONAS, StudentProfile } from "@/lib/data/mock-db";

export interface UserSession {
  id: number;
  name: string;
  email: string;
  avatar_url?: string;
  academic_year: string;
  department: string;
  primary_goal: string;
  role: "student" | "staff" | "admin";
  onboarded: boolean;
}

export const DEMO_AVATARS = [
  { id: "avatar-1", src: "/avatars/avatar-1.svg", label: "Aarav (AI Builder)" },
  { id: "avatar-2", src: "/avatars/avatar-2.svg", label: "Riya (Founder)" },
  { id: "avatar-3", src: "/avatars/avatar-3.svg", label: "Kabir (Researcher)" },
  { id: "avatar-4", src: "/avatars/avatar-4.svg", label: "Priya (Data Lead)" },
  { id: "avatar-5", src: "/avatars/avatar-5.svg", label: "Dev (Cloud Eng)" },
  { id: "avatar-6", src: "/avatars/avatar-6.svg", label: "Ananya (Designer)" },
];

const DEFAULT_USER: UserSession = {
  id: 1,
  name: "Aarav Patel",
  email: "aarav.patel@srmuniversity.ac.in",
  avatar_url: "/avatars/avatar-1.svg",
  academic_year: "2nd Year",
  department: "Computer Science",
  primary_goal: "internship",
  role: "student",
  onboarded: true,
};

interface AuthContextType {
  user: UserSession;
  isAuthenticated: boolean;
  login: (email: string, name?: string, studentId?: number) => Promise<boolean>;
  logout: () => void;
  updateUser: (updates: Partial<UserSession>) => void;
  switchStudentContext: (studentId: number, name: string) => void;
}

const AuthContext = createContext<AuthContextType>({
  user: DEFAULT_USER,
  isAuthenticated: true,
  login: async () => true,
  logout: () => {},
  updateUser: () => {},
  switchStudentContext: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserSession>(DEFAULT_USER);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("vybe_user_session");
      if (stored) {
        setUser(JSON.parse(stored));
        setIsAuthenticated(true);
      }
    } catch {
      // Keep default
    }
  }, []);

  const login = async (email: string, name?: string, studentId?: number): Promise<boolean> => {
    const avatar =
      studentId === 2 || email.toLowerCase().includes("riya")
        ? "/avatars/avatar-2.svg"
        : studentId === 3 || email.toLowerCase().includes("kabir")
        ? "/avatars/avatar-3.svg"
        : "/avatars/avatar-1.svg";

    const newUser: UserSession = {
      ...DEFAULT_USER,
      id: studentId || (email.toLowerCase().includes("riya") ? 2 : 1),
      email,
      name: name || email.split("@")[0].replace(".", " "),
      avatar_url: avatar,
    };
    setUser(newUser);
    setIsAuthenticated(true);
    try {
      localStorage.setItem("vybe_user_session", JSON.stringify(newUser));
    } catch {}
    return true;
  };

  const logout = () => {
    setIsAuthenticated(false);
    try {
      localStorage.removeItem("vybe_user_session");
    } catch {}
  };

  const updateUser = (updates: Partial<UserSession>) => {
    setUser((prev) => {
      const updated = { ...prev, ...updates };
      try {
        localStorage.setItem("vybe_user_session", JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const switchStudentContext = (studentId: number, name: string, avatar_url?: string) => {
    const avatar =
      avatar_url ||
      (studentId === 2
        ? "/avatars/avatar-2.svg"
        : studentId === 3
        ? "/avatars/avatar-3.svg"
        : "/avatars/avatar-1.svg");
    updateUser({ id: studentId, name, avatar_url: avatar });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        login,
        logout,
        updateUser,
        switchStudentContext,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
