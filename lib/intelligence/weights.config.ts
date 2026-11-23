// ==============================================================================
// VYBE Recommendation Weights Configuration
// DESIGN ASSUMPTIONS: Configurable matching parameters.
// As defined in VYBE 2.0 Round 2 & Round 3 specifications, these weights are
// explicit design assumptions subject to pilot tuning and student validation.
// ==============================================================================

export interface RecommendationWeights {
  interests: number; // 30%
  goals: number; // 25%
  budget: number; // 15%
  schedule: number; // 15%
  format: number; // 10%
  level: number; // 5%
}

export const DESIGN_ASSUMPTION_WEIGHTS: RecommendationWeights = {
  interests: 0.30,
  goals: 0.25,
  budget: 0.15,
  schedule: 0.15,
  format: 0.10,
  level: 0.05,
};

export const WEIGHT_LABELS = {
  interests: "Interests & Domain Fit (30%)",
  goals: "Career Aspirations & Target Goal (25%)",
  budget: "Cost & Financial Feasibility (15%)",
  schedule: "Availability & Workload Alignment (15%)",
  format: "Mode Preference [Online/Hybrid/Onsite] (10%)",
  level: "Experience & Seniority Tier (5%)",
};
