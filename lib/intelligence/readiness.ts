import { Opportunity, StudentProfile } from "../data/mock-db";

export interface ReadinessAssessment {
  prerequisitesMet: boolean;
  skillsToStrengthen: string[];
  checklistRatio: string;
  readinessPercentage: number;
  preparationTimeline: string;
  checklist: { task: string; done: boolean }[];
  summaryLine: string;
}

/**
 * Deterministic Readiness Assessment Engine
 * Evaluates preparation state independently from hard eligibility
 */
export function assessReadiness(
  student: StudentProfile,
  opportunity: Opportunity
): ReadinessAssessment {
  const studentSkillNames = new Set(student.skills.map((s) => s.name.toLowerCase()));
  
  // 1. Identify skills to strengthen
  const skillsToStrengthen: string[] = [];
  for (const skill of opportunity.skills) {
    if (!studentSkillNames.has(skill.toLowerCase())) {
      skillsToStrengthen.push(skill);
    }
  }

  // 2. Checklist completion
  const checklist = opportunity.preparation_checklist || [];
  const completedCount = checklist.filter((item) => item.done).length;
  const totalCount = checklist.length;
  const checklistRatio = `${completedCount} of ${totalCount} complete`;

  // 3. Overall readiness percentage (checklist 60%, skills acquired 40%)
  const checklistWeight = totalCount > 0 ? (completedCount / totalCount) * 60 : 60;
  const skillsAcquired = opportunity.skills.length - skillsToStrengthen.length;
  const skillsWeight = opportunity.skills.length > 0
    ? (skillsAcquired / opportunity.skills.length) * 40
    : 40;
  const readinessPercentage = Math.round(checklistWeight + skillsWeight);

  const prerequisitesMet = completedCount > 0 || skillsToStrengthen.length <= 1;

  // 4. Time to prepare
  const diffDays = Math.ceil(
    (new Date(opportunity.deadline).getTime() - new Date("2026-11-23T16:00:00Z").getTime()) /
      (1000 * 60 * 60 * 24)
  );
  const preparationTimeline =
    diffDays > 0 ? `${diffDays} days remaining before application deadline` : "Deadline passed";

  const summaryLine = `Readiness: ${checklistRatio}`;

  return {
    prerequisitesMet,
    skillsToStrengthen,
    checklistRatio,
    readinessPercentage,
    preparationTimeline,
    checklist,
    summaryLine,
  };
}
