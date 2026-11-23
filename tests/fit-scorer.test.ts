import { describe, it, expect } from "vitest";
import { calculateFitScore } from "../lib/intelligence/fit-scorer";
import { PERSONAS, INITIAL_OPPORTUNITIES } from "../lib/data/mock-db";
import { DESIGN_ASSUMPTION_WEIGHTS } from "../lib/intelligence/weights.config";

describe("Deterministic Fit Scorer", () => {
  const aarav = PERSONAS.beginner;
  const riya = PERSONAS.startup;

  it("calculates weighted fit matching configured design assumptions sum to 1.0", () => {
    const totalWeights = Object.values(DESIGN_ASSUMPTION_WEIGHTS).reduce((a, b) => a + b, 0);
    expect(totalWeights).toBeCloseTo(1.0, 5);
  });

  it("computes high fit for opportunity directly matching skills and goals", () => {
    const opp = INITIAL_OPPORTUNITIES.find((o) => o.id === "opp-001")!; // SIH 2026: Python, Web Dev, Internship focus
    const fit = calculateFitScore(aarav, opp);

    expect(fit.total_score).toBeGreaterThanOrEqual(80);
    expect(fit.goals_score).toBeGreaterThan(0);
    expect(fit.interests_score).toBeGreaterThan(0);
    expect(fit.reasons.length).toBeGreaterThan(0);
  });

  it("produces differentiated fit scores across beginner vs startup personas", () => {
    const antler = INITIAL_OPPORTUNITIES.find((o) => o.id === "opp-005")!; // Startup fellowship
    const fitAarav = calculateFitScore(aarav, antler);
    const fitRiya = calculateFitScore(riya, antler);

    expect(fitRiya.goals_score).toBeGreaterThanOrEqual(fitAarav.goals_score);
    expect(fitRiya.total_score).toBeGreaterThanOrEqual(fitAarav.total_score);
  });
});
