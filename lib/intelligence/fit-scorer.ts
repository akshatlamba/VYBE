import { Opportunity, StudentProfile } from "../data/mock-db";
import { DESIGN_ASSUMPTION_WEIGHTS } from "./weights.config";

export interface FitBreakdown {
  interests_score: number;
  goals_score: number;
  budget_score: number;
  schedule_score: number;
  format_score: number;
  level_score: number;
  total_score: number;
  reasons: string[];
}

/**
 * Deterministic Weighted Fit Engine
 * Computes an explainable 0 - 100 score with visible reasons
 */
export function calculateFitScore(
  student: StudentProfile,
  opportunity: Opportunity
): FitBreakdown {
  const reasons: string[] = [];
  const weights = DESIGN_ASSUMPTION_WEIGHTS;

  // 1. Interests Match (30%)
  // Check exact and substring overlap between student interests/skills and opportunity skills/description
  const studentTags = [
    ...student.interests.map((i) => i.toLowerCase()),
    ...student.skills.map((s) => s.name.toLowerCase()),
  ];
  const oppSkills = opportunity.skills.map((s) => s.toLowerCase());

  let matchedInterests = 0;
  for (const s of oppSkills) {
    if (studentTags.some((tag) => tag.includes(s) || s.includes(tag))) {
      matchedInterests++;
    }
  }

  // Also check if opportunity description or title touches student interests
  const oppText = `${opportunity.title} ${opportunity.description} ${opportunity.type}`.toLowerCase();
  for (const tag of studentTags) {
    if (oppText.includes(tag)) {
      matchedInterests++;
    }
  }

  const interestsRatio = Math.min(1.0, Math.max(0.4, (matchedInterests / Math.max(2, oppSkills.length)) * 0.8 + 0.3));
  const interestsScore = Math.round(interestsRatio * 100 * weights.interests);

  if (matchedInterests > 0) {
    reasons.push(`Matches ${matchedInterests} of your verified skills or focus interests (${oppSkills.slice(0, 2).join(", ")}).`);
  } else {
    reasons.push("Offers exposure to complementary skills beyond your current primary stack.");
  }

  // 2. Goals Alignment (25%)
  let goalRatio = 0.5;
  if (student.primary_goal === "internship" && (opportunity.type === "Internship" || opportunity.type === "Fellowship" || opportunity.type === "Hackathon")) {
    goalRatio = 1.0;
    reasons.push("Directly reinforces your internship preparation roadmap.");
  } else if (student.primary_goal === "startup" && (opportunity.type === "Fellowship" || opportunity.type === "Hackathon")) {
    goalRatio = 1.0;
    reasons.push("Strong alignment with startup incubation and founder prototyping.");
  } else if (student.primary_goal === "research" && (opportunity.type === "Research Program" || opportunity.type === "Conference")) {
    goalRatio = 1.0;
    reasons.push("Direct match for academic publication and lab research goals.");
  } else if (student.primary_goal === "hackathon" && opportunity.type === "Hackathon") {
    goalRatio = 1.0;
    reasons.push("Directly matches your competitive hackathon timeline.");
  } else {
    goalRatio = 0.6;
    reasons.push("Contributes broadly to your overall career and portfolio development.");
  }
  const goalsScore = Math.round(goalRatio * 100 * weights.goals);

  // 3. Budget Feasibility (15%)
  let budgetRatio = 1.0;
  if (opportunity.cost === 0) {
    budgetRatio = 1.0;
    reasons.push("Zero registration fee (100% free participation).");
  } else if (opportunity.cost <= student.budget_max * 0.5) {
    budgetRatio = 0.9;
    reasons.push(`Cost of ₹${opportunity.cost} is comfortably within your ₹${student.budget_max} budget.`);
  } else if (opportunity.cost <= student.budget_max) {
    budgetRatio = 0.7;
    reasons.push(`Cost of ₹${opportunity.cost} falls within your budget limit.`);
  } else {
    budgetRatio = 0.0;
  }
  const budgetScore = Math.round(budgetRatio * 100 * weights.budget);

  // 4. Schedule Feasibility (15%)
  let scheduleRatio = 0.85;
  if (student.availability.includes("Part-time") || student.availability.includes("Weekends")) {
    if (opportunity.format === "online" || opportunity.dates.includes("Dec") || opportunity.dates.includes("Jan")) {
      scheduleRatio = 0.95;
      reasons.push("Flexible timeline accommodates your part-time / weekend availability.");
    }
  } else {
    scheduleRatio = 1.0;
    reasons.push("Schedule matches your full-time availability window.");
  }
  const scheduleScore = Math.round(scheduleRatio * 100 * weights.schedule);

  // 5. Format Match (10%)
  let formatRatio = 0.7;
  if (student.preferred_format === "any" || student.preferred_format === opportunity.format) {
    formatRatio = 1.0;
    reasons.push(`Matches your preferred ${opportunity.format} format.`);
  } else if (opportunity.format === "hybrid") {
    formatRatio = 0.85;
    reasons.push("Hybrid format offers flexible virtual participation.");
  } else {
    formatRatio = 0.6;
  }
  const formatScore = Math.round(formatRatio * 100 * weights.format);

  // 6. Level Match (5%)
  let levelRatio = 0.8;
  if (opportunity.level === "All Levels" || opportunity.level.toLowerCase() === student.skills[0]?.level?.toLowerCase()) {
    levelRatio = 1.0;
  } else {
    levelRatio = 0.6;
  }
  const levelScore = Math.round(levelRatio * 100 * weights.level);

  const totalScore = Math.min(
    100,
    Math.round(
      interestsScore + goalsScore + budgetScore + scheduleScore + formatScore + levelScore
    )
  );

  return {
    interests_score: interestsScore,
    goals_score: goalsScore,
    budget_score: budgetScore,
    schedule_score: scheduleScore,
    format_score: formatScore,
    level_score: levelScore,
    total_score: totalScore,
    reasons,
  };
}
