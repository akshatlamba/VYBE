import { describe, it, expect } from "vitest";
import { checkEligibility } from "../lib/intelligence/eligibility";
import { PERSONAS, INITIAL_OPPORTUNITIES } from "../lib/data/mock-db";

describe("Deterministic Eligibility Engine", () => {
  const aarav = PERSONAS.beginner; // 2nd year CS, budget 1000

  it("approves eligible opportunity within student year, department, and budget", () => {
    const opp = INITIAL_OPPORTUNITIES.find((o) => o.id === "opp-001")!; // SIH 2026: 1st-4th yr CS, cost 0
    const result = checkEligibility(aarav, opp, new Date("2026-11-23T16:00:00Z"));
    expect(result.eligible).toBe(true);
    expect(result.failedChecks.length).toBe(0);
    expect(result.passedChecks).toContain("Active deadline");
    expect(result.passedChecks).toContain("Academic year verified");
    expect(result.passedChecks).toContain("Department verified");
  });

  it("rejects opportunity when application deadline has passed", () => {
    const expiredOpp = INITIAL_OPPORTUNITIES.find((o) => o.id === "opp-013")!; // Expired Nov 5, 2026
    const result = checkEligibility(aarav, expiredOpp, new Date("2026-11-23T16:00:00Z"));
    expect(result.eligible).toBe(false);
    expect(result.failedChecks).toContain("Deadline passed");
  });

  it("rejects opportunity when academic year is restricted", () => {
    const seniorOpp = INITIAL_OPPORTUNITIES.find((o) => o.id === "opp-005")!; // Antler: 3rd & 4th Year only
    const result = checkEligibility(aarav, seniorOpp, new Date("2026-11-23T16:00:00Z"));
    expect(result.eligible).toBe(false);
    expect(result.failedChecks).toContain("Academic year restriction");
  });

  it("rejects opportunity exceeding student maximum budget", () => {
    const costlyOpp = INITIAL_OPPORTUNITIES.find((o) => o.id === "opp-010")!; // Stanford HPC: Cost 2500 > Aarav budget 1000
    const result = checkEligibility(aarav, costlyOpp, new Date("2026-11-23T16:00:00Z"));
    expect(result.eligible).toBe(false);
    expect(result.failedChecks).toContain("Exceeds maximum budget");
  });
});
