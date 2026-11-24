
"use client";

import React from "react";
import { Plus, Bell, Sun, GraduationCap } from "lucide-react";

const glassStyle: React.CSSProperties = {
  borderRadius: "999px",
  padding: "10px",
  cursor: "pointer",
};

export default function TestGlassPage() {
  return (
    <div className="p-12 min-h-screen bg-gradient-to-tr from-[#FAD8C6] via-[#F6C9DD] to-[#D9C9F5] flex flex-col gap-8 items-center justify-center">
      <h1 className="text-2xl font-bold">
        Header Controls Glass Test
      </h1>

      <div className="flex items-center gap-2.5 p-4 rounded-3xl bg-white/20 backdrop-blur-md">
        <div
          className="liquid-glass flex items-center gap-1.5 text-xs font-semibold text-[#1E1E22]"
          style={{ ...glassStyle, padding: "6px 14px" }}
        >
          <GraduationCap className="w-3.5 h-3.5" />
          <span>Student</span>
        </div>

        <div className="liquid-glass" style={glassStyle}>
          <Sun className="w-4 h-4 text-[#1E1E22]" />
        </div>

        <div className="liquid-glass" style={glassStyle}>
          <div className="w-5 h-5 flex items-center justify-center bg-[#1E1E22] text-white rounded-full">
            <Plus className="w-4 h-4" />
          </div>
        </div>

        <div className="liquid-glass" style={glassStyle}>
          <Bell className="w-4 h-4 text-[#1E1E22]" />
        </div>
      </div>
    </div>
  );
}
