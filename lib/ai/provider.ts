// ==============================================================================
// Pluggable AI Service Provider for PULSE
// Supports Mock Fallback (zero API key needed) and external LLMs (e.g. Gemini)
// Strict Guardrails: AI never touches eligibility or ranking!
// ==============================================================================

import { StudentProfile, WorldSignal, Opportunity } from "../data/mock-db";

export interface ActionProposal {
  kind: "learn" | "build" | "apply";
  title: string;
  description: string;
  opportunity_id?: string;
}

export interface PulseResponse {
  content: string;
  why_this: string;
  action_proposals: ActionProposal[];
  opportunity_ids: string[];
}

export interface AIProvider {
  generatePulseGuidance(
    message: string,
    student: StudentProfile,
    signal?: WorldSignal,
    recentOpportunities?: Opportunity[]
  ): Promise<PulseResponse>;
}

// ------------------------------------------------------------------------------
// MOCK PROVIDER (DEFAULT: 100% RELIABLE, ZERO API KEY REQUIRED)
// Evaluates the exact persona context as specified in Round 3 Pitch:
// - Beginner wanting an internship
// - Business-minded wanting a startup
// - Advanced wanting research
// ------------------------------------------------------------------------------
export class MockAIProvider implements AIProvider {
  async generatePulseGuidance(
    message: string,
    student: StudentProfile,
    signal?: WorldSignal,
    recentOpportunities?: Opportunity[]
  ): Promise<PulseResponse> {
    const isStartup = student.primary_goal === "startup" || student.department === "Business";
    const isResearch = student.primary_goal === "research" || student.academic_year.includes("4th");

    if (isStartup) {
      return {
        content: `Analyzing this through a venture and founder lens for ${student.name}:

1. **Map the Trend to Market Demand**: Vertical automation and agentic workflows create high-margin opportunities for student-led startups.
2. **Draft a 1-Page Problem Canvas**: Define a specific operational pain point (e.g. university administration or student recruitment).
3. **Founder Pitch Validation**: Prepare a 2-minute pitch for the Antler India Campus Fellowship or Y Combinator Student Founders Days.`,
        why_this:
          "Matched to your business focus, 3rd year timeline, and primary goal of launching a startup.",
        action_proposals: [
          {
            kind: "learn",
            title: "Study Vertical Agent Unit Economics",
            description: "Review current market valuation multiples and B2B SaaS retention benchmarks.",
          },
          {
            kind: "build",
            title: "Map Problem Canvas & 5 User Interviews",
            description: "Validate customer willingness-to-pay before writing code.",
          },
          {
            kind: "apply",
            title: "Pitch to Antler India Campus Fellowship",
            description: "Submit early-stage founder hypothesis by Dec 20 deadline.",
            opportunity_id: "opp-005",
          },
        ],
        opportunity_ids: ["opp-005", "opp-009", "opp-011"],
      };
    }

    if (isResearch) {
      return {
        content: `Analyzing this for frontier technical depth for ${student.name}:

1. **Reproduce Benchmark Architecture**: Explore recent open-source small language models and benchmark their mathematical reasoning speed on consumer hardware.
2. **Implement Optimized Kernel**: Write a PyTorch / CUDA module optimizing token throughput on local GPUs.
3. **Target Lab Mentorship**: Prepare research statement of purpose for IISc Bangalore Summer Research Internship (SRIP) or CERN OpenLab.`,
        why_this:
          "Matched to your 4th Year Computer Science background, PyTorch expertise, and research lab publication goal.",
        action_proposals: [
          {
            kind: "learn",
            title: "Read Nature Benchmark Paper on Scientific Models",
            description: "Analyze attention mechanisms and distributed synthesis evaluation.",
          },
          {
            kind: "build",
            title: "Reproduce 1B Parameter Edge SLM Benchmark",
            description: "Measure latency and memory footprints under quantified 4-bit weights.",
          },
          {
            kind: "apply",
            title: "Submit Statement of Purpose to IISc SRIP 2027",
            description: "Frontier machine learning research track under department faculty.",
            opportunity_id: "opp-006",
          },
        ],
        opportunity_ids: ["opp-006", "opp-010", "opp-012"],
      };
    }

    // Default: Beginner wanting an internship (e.g. Aarav Patel)
    return {
      content: `A simple, confidence-building path for a beginner, built around your internship goal:

1. **Learn Fundamentals**: Strengthen Python and asynchronous API calling.
2. **Build a Small Real Project**: Build a small autonomous Slack bot or web assistant you can demo on GitHub.
3. **Explore Beginner Hackathons**: Try Smart India Hackathon 2026 or Prasunex Innovathon to apply your skills in a team setting.`,
      why_this:
        "Matched to your 2nd Year Computer Science profile, Python beginner level, and summer internship goal.",
      action_proposals: [
        {
          kind: "learn",
          title: "Master Python Async & REST APIs",
          description: "Learn how to call endpoints and process structured JSON payloads.",
        },
        {
          kind: "build",
          title: "Build 1 Small Agent Project with GitHub README",
          description: "Create an autonomous news aggregator or Discord bot you can demo.",
        },
        {
          kind: "apply",
          title: "Join Smart India Hackathon 2026 Team",
          description: "Free participation with certified college team.",
          opportunity_id: "opp-001",
        },
      ],
      opportunity_ids: ["opp-001", "opp-003", "opp-002"],
    };
  }
}

// Factory to resolve configured provider
export function getAIProvider(): AIProvider {
  return new MockAIProvider();
}
