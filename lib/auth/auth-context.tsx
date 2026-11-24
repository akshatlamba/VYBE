"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { PERSONAS, StudentProfile } from "@/lib/data/mock-db";

export interface UserSession {
  id: number;
  name: string;
  email: string;
  academic_year: string;
  department: string;
  primary_goal: string;
  role: "student" | "staff" | "admin";
  onboarded: boolean;
}

const DEFAULT_USER: UserSession = {
  id: 1,
  name: "Aarav Patel",
  email: "aarav.patel@srmuniversity.ac.in",
  academic_year: "2nd Year",
  department: "Computer Science",
  primary_goal: "internship",
  role: "student",
  onboarded: true,
};

interface AuthContextType {
  user: UserSession;
  isAuthenticated: boolean;
  login: (email: string, name?: string) => Promise<boolean>;
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

  const login = async (email: string, name?: string): Promise<boolean> => {
    const newUser: UserSession = {
      ...DEFAULT_USER,
      email,
      name: name || email.split("@")[0].replace(".", " "),
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

  const switchStudentContext = (studentId: number, name: string) => {
    updateUser({ id: studentId, name });
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
