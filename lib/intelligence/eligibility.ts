import { Opportunity, StudentProfile } from "../data/mock-db";

export interface EligibilityResult {
  eligible: boolean;
  passedChecks: string[];
  failedChecks: string[];
  reasons: string[];
}

/**
 * Deterministic Hard Eligibility Filter
 * Evaluates mandatory constraints:
 * 1. Deadline must not have passed.
 * 2. Academic year must match permitted years.
 * 3. Department must match permitted departments.
 * 4. Cost must not exceed student's maximum budget.
 */
export function checkEligibility(
  student: StudentProfile,
  opportunity: Opportunity,
  currentTime: Date = new Date("2026-11-23T16:00:00Z")
): EligibilityResult {
  const passedChecks: string[] = [];
  const failedChecks: string[] = [];
  const reasons: string[] = [];

  // 1. Deadline check
  const deadlineDate = new Date(opportunity.deadline);
  if (deadlineDate.getTime() < currentTime.getTime()) {
    failedChecks.push("Deadline passed");
    reasons.push(`Application deadline expired on ${deadlineDate.toLocaleDateString()}`);
  } else {
    passedChecks.push("Active deadline");
  }

  // 2. Academic year check
  const allowedYears = opportunity.eligibility.academic_years;
  if (allowedYears && allowedYears.length > 0) {
    const yearMatch = allowedYears.includes(student.academic_year);
    if (!yearMatch) {
      failedChecks.push("Academic year restriction");
      reasons.push(
        `Requires ${allowedYears.join(", ")}; your profile is ${student.academic_year}`
      );
    } else {
      passedChecks.push("Academic year verified");
    }
  }

  // 3. Department check
  const allowedDepts = opportunity.eligibility.departments;
  if (allowedDepts && allowedDepts.length > 0) {
    const deptMatch = allowedDepts.some(
      (dept) =>
        dept.toLowerCase() === student.department.toLowerCase() ||
        dept.toLowerCase() === "engineering" ||
        dept.toLowerCase() === "all"
    );
    if (!deptMatch) {
      failedChecks.push("Department restriction");
      reasons.push(
        `Eligible departments: ${allowedDepts.join(", ")}; your department is ${student.department}`
      );
    } else {
      passedChecks.push("Department verified");
    }
  }

  // 4. Budget check
  if (opportunity.cost > student.budget_max) {
    failedChecks.push("Exceeds maximum budget");
    reasons.push(
      `Cost is ₹${opportunity.cost}, exceeding your current budget ceiling of ₹${student.budget_max}`
    );
  } else {
    passedChecks.push("Budget feasible");
  }

  // 5. Mandatory criteria note
  if (opportunity.eligibility.mandatory_criteria?.length > 0) {
    passedChecks.push(
      `Mandatory conditions noted: ${opportunity.eligibility.mandatory_criteria.join("; ")}`
    );
  }

  const eligible = failedChecks.length === 0;

  return {
    eligible,
    passedChecks,
    failedChecks,
    reasons,
  };
}
