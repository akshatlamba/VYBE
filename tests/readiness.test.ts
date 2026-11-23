import { describe, it, expect } from "vitest";
import { assessReadiness } from "../lib/intelligence/readiness";
import { PERSONAS, INITIAL_OPPORTUNITIES } from "../lib/data/mock-db";

describe("Deterministic Readiness Assessment Engine", () => {
  const aarav = PERSONAS.beginner;

  it("evaluates preparation checklist and missing skills independently of eligibility", () => {
    const sih = INITIAL_OPPORTUNITIES.find((o) => o.id === "opp-001")!;
    const readiness = assessReadiness(aarav, sih);

    expect(readiness.checklistRatio).toBe("2 of 4 complete");
    expect(readiness.readinessPercentage).toBeGreaterThan(0);
    expect(readiness.readinessPercentage).toBeLessThanOrEqual(100);
    expect(readiness.summaryLine).toBe("Readiness: 2 of 4 complete");
  });

  it("identifies specific missing skills as skillsToStrengthen", () => {
    const opp = INITIAL_OPPORTUNITIES.find((o) => o.id === "opp-008")!; // ETHIndia requires Solidity, Web3
    const readiness = assessReadiness(aarav, opp);

    expect(readiness.skillsToStrengthen).toContain("Solidity");
  });
});
