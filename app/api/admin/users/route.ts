import { NextResponse } from "next/server";
import { PERSONAS } from "@/lib/data/mock-db";

export async function GET() {
  const users = [
    {
      id: PERSONAS.beginner.id,
      name: PERSONAS.beginner.name,
      email: PERSONAS.beginner.email,
      role: "student",
      academic_year: PERSONAS.beginner.academic_year,
      department: PERSONAS.beginner.department,
    },
    {
      id: PERSONAS.startup.id,
      name: PERSONAS.startup.name,
      email: PERSONAS.startup.email,
      role: "student",
      academic_year: PERSONAS.startup.academic_year,
      department: PERSONAS.startup.department,
    },
    {
      id: PERSONAS.research.id,
      name: PERSONAS.research.name,
      email: PERSONAS.research.email,
      role: "student",
      academic_year: PERSONAS.research.academic_year,
      department: PERSONAS.research.department,
    },
    {
      id: "user-staff-001",
      name: "Dr. Anand Prakash",
      email: "staff.anand@srmuniversity.ac.in",
      role: "staff",
      academic_year: "Faculty",
      department: "Computer Science",
    },
    {
      id: "user-admin-001",
      name: "Ashutosh Singh",
      email: "admin.ashutosh@vybe.app",
      role: "admin",
      academic_year: "Lead",
      department: "Platform Admin",
    },
  ];

  const auditLogs = [
    {
      timestamp: "2026-11-23T15:30:00Z",
      action: "VERIFICATION_REVIEW",
      actor: "admin.ashutosh@vybe.app",
      target: "out-001",
      details: "Approved certificate link as Verified",
    },
    {
      timestamp: "2026-11-23T12:00:00Z",
      action: "CATALOGUE_FRESHNESS_CHECK",
      actor: "system_cron",
      target: "opp-013",
      details: "Flagged Delhi Regional Camp as Expired",
    },
    {
      timestamp: "2026-11-22T09:15:00Z",
      action: "OPPORTUNITY_INGESTION",
      actor: "admin.ashutosh@vybe.app",
      target: "opp-003",
      details: "Published Prasunex Innovathon Round 3 details",
    },
  ];

  return NextResponse.json({
    success: true,
    data: {
      users,
      audit_logs: auditLogs,
    },
  });
}
