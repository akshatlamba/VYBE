// ==============================================================================
// VYBE Mock & Seed Database
// Full in-memory persistence layer with exact PostgreSQL schema parity
// ==============================================================================

export interface StudentSkill {
  name: string;
  level: "Beginner" | "Intermediate" | "Advanced";
}

export interface StudentProfile {
  id: string;
  role: "student" | "staff" | "admin";
  name: string;
  email: string;
  institution_id: string;
  institution_name: string;
  academic_year: string;
  department: string;
  location: string;
  budget_max: number;
  availability: string;
  preferred_format: "online" | "onsite" | "hybrid" | "any";
  skills: StudentSkill[];
  interests: string[];
  primary_goal: "internship" | "startup" | "research" | "hackathon";
  sharing_prefs: {
    public_passport: boolean;
    show_email: boolean;
    share_aggregates: boolean;
  };
  is_sample: boolean;
}

export interface Opportunity {
  id: string;
  title: string;
  organizer: string;
  type: "Hackathon" | "Internship" | "Research Program" | "Fellowship" | "Conference";
  source_url: string;
  source_status: "sourced" | "unverified" | "stale";
  dates: string;
  deadline: string; // ISO String
  cost: number;
  format: "online" | "onsite" | "hybrid";
  location: string;
  level: "Beginner" | "Intermediate" | "Advanced" | "All Levels";
  eligibility: {
    academic_years: string[];
    departments: string[];
    mandatory_criteria: string[];
  };
  description: string;
  preparation_checklist: { task: string; done: boolean }[];
  skills: string[];
  status: "active" | "expired" | "draft";
  last_checked_at: string;
  is_sample: boolean;
}

export interface WorldSignal {
  id: string;
  title: string;
  summary: string;
  source_name: string;
  source_url: string;
  published_at: string;
  tags: string[];
  is_sample: boolean;
}

export interface ApplicationTask {
  id: string;
  application_id: string;
  title: string;
  due_date: string;
  priority: "low" | "medium" | "high";
  completed: boolean;
}

export interface Application {
  id: string;
  student_id: string;
  opportunity_id: string;
  opportunity?: Opportunity;
  stage: "saved" | "preparing" | "applied" | "attended" | "done" | "withdrawn";
  notes?: string;
  fit_score: number;
  fit_breakdown: {
    interests_score: number;
    goals_score: number;
    budget_score: number;
    schedule_score: number;
    format_score: number;
    level_score: number;
    reasons: string[];
  };
  readiness_snapshot: {
    prerequisites_met: boolean;
    skills_to_strengthen: string[];
    checklist_completion_ratio: string;
    readiness_percentage: number;
  };
  tasks: ApplicationTask[];
  created_at: string;
  updated_at: string;
}

export interface GrowthOutcome {
  id: string;
  student_id: string;
  opportunity_id?: string;
  title: string;
  participation: string;
  reflection: string;
  skills_gained: string[];
  verification: "self_reported" | "link_supported" | "verified";
  evidence_url?: string;
  created_at: string;
}

// ------------------------------------------------------------------------------
// 3 PRE-CONFIGURED PERSONAS
// ------------------------------------------------------------------------------
export const PERSONAS: Record<string, StudentProfile> = {
  beginner: {
    id: "persona-beginner-001",
    role: "student",
    name: "Aarav Patel",
    email: "aarav.beginner@srmuniversity.ac.in",
    institution_id: "inst-001",
    institution_name: "SRM University Delhi-NCR, Sonepat",
    academic_year: "2nd Year",
    department: "Computer Science",
    location: "Delhi-NCR",
    budget_max: 1000,
    availability: "Part-time (5-10 hrs/wk)",
    preferred_format: "online",
    skills: [
      { name: "Python", level: "Beginner" },
      { name: "HTML/CSS", level: "Beginner" },
      { name: "Git", level: "Beginner" },
    ],
    interests: ["Web Development", "AI Agents", "Internships"],
    primary_goal: "internship",
    sharing_prefs: {
      public_passport: true,
      show_email: false,
      share_aggregates: true,
    },
    is_sample: true,
  },
  startup: {
    id: "persona-startup-002",
    role: "student",
    name: "Riya Sen",
    email: "riya.startup@srmuniversity.ac.in",
    institution_id: "inst-001",
    institution_name: "SRM University Delhi-NCR, Sonepat",
    academic_year: "3rd Year",
    department: "Business",
    location: "Delhi-NCR",
    budget_max: 5000,
    availability: "Weekends only",
    preferred_format: "hybrid",
    skills: [
      { name: "Product Management", level: "Intermediate" },
      { name: "Figma", level: "Intermediate" },
      { name: "Pitching", level: "Advanced" },
    ],
    interests: ["Startups", "Venture Capital", "AI Products"],
    primary_goal: "startup",
    sharing_prefs: {
      public_passport: true,
      show_email: false,
      share_aggregates: true,
    },
    is_sample: true,
  },
  research: {
    id: "persona-research-003",
    role: "student",
    name: "Kabir Mehta",
    email: "kabir.research@srmuniversity.ac.in",
    institution_id: "inst-001",
    institution_name: "SRM University Delhi-NCR, Sonepat",
    academic_year: "4th Year",
    department: "Computer Science",
    location: "Delhi-NCR",
    budget_max: 10000,
    availability: "Full-time",
    preferred_format: "any",
    skills: [
      { name: "PyTorch", level: "Advanced" },
      { name: "Machine Learning", level: "Advanced" },
      { name: "Distributed Systems", level: "Intermediate" },
    ],
    interests: ["LLM Architectures", "Research Labs", "Open Source AI"],
    primary_goal: "research",
    sharing_prefs: {
      public_passport: true,
      show_email: false,
      share_aggregates: true,
    },
    is_sample: true,
  },
};

// ------------------------------------------------------------------------------
// 6 WORLD SIGNALS
// ------------------------------------------------------------------------------
export const INITIAL_SIGNALS: WorldSignal[] = [
  {
    id: "sig-001",
    title: "AI agents start appearing inside everyday apps",
    summary:
      "Autonomous multi-step agents are transitioning from research labs into developer tools and enterprise workspaces, creating massive demand for agent-building skill sets.",
    source_name: "MIT Tech Review",
    source_url: "https://technologyreview.com/signals/ai-agents",
    published_at: "2026-11-21T09:00:00Z",
    tags: ["AI Agents", "Automation", "Python"],
    is_sample: true,
  },
  {
    id: "sig-002",
    title: "Small Language Models run on-device and at the edge",
    summary:
      "Efficiency breakthroughs allow 1B to 3B parameter models to run directly on consumer laptops and phones with zero cloud latency and strict data privacy.",
    source_name: "VentureBeat AI",
    source_url: "https://venturebeat.com/slm-edge-computing",
    published_at: "2026-11-18T14:30:00Z",
    tags: ["SLM", "Edge AI", "Mobile"],
    is_sample: true,
  },
  {
    id: "sig-003",
    title: "Venture funding pivots toward vertical AI agents and workflow automation",
    summary:
      "Early-stage investors are prioritizing specialized industry agents with measurable ROI over generic consumer chat tools.",
    source_name: "TechCrunch",
    source_url: "https://techcrunch.com/vertical-ai-funding",
    published_at: "2026-11-16T11:15:00Z",
    tags: ["Startups", "Venture Capital", "Product"],
    is_sample: true,
  },
  {
    id: "sig-004",
    title: "Open-source scientific discovery acceleration through foundational models",
    summary:
      "Global research consortia standardize benchmarks evaluating multi-step reasoning capabilities on biochemical and mathematical synthesis.",
    source_name: "Nature Machine Intelligence",
    source_url: "https://nature.com/articles/science-fm-benchmarks",
    published_at: "2026-11-13T08:45:00Z",
    tags: ["Research", "PyTorch", "Science"],
    is_sample: true,
  },
  {
    id: "sig-005",
    title: "Spatial computing and multimodal web experiences expand",
    summary:
      "WebXR standard adoption makes 3D spatial user interfaces commercially viable in interactive education and simulation engines.",
    source_name: "Wired",
    source_url: "https://wired.com/spatial-web-education",
    published_at: "2026-11-09T16:00:00Z",
    tags: ["WebXR", "Design", "Front End"],
    is_sample: true,
  },
  {
    id: "sig-006",
    title: "Zero-trust cloud infrastructure becomes mandatory in student engineering programs",
    summary:
      "Security compliance requirements prompt top engineering institutions to evaluate cryptographic identity and least-privilege architecture from day one.",
    source_name: "Cloud Security Alliance",
    source_url: "https://cloudsecurity.org/zero-trust-curriculum",
    published_at: "2026-11-05T10:00:00Z",
    tags: ["Security", "DevOps", "Cloud"],
    is_sample: true,
  },
];

// ------------------------------------------------------------------------------
// 14 CURATED SAMPLE OPPORTUNITIES
// ------------------------------------------------------------------------------
export const INITIAL_OPPORTUNITIES: Opportunity[] = [
  {
    id: "opp-001",
    title: "Smart India Hackathon 2026",
    organizer: "Ministry of Education & AICTE",
    type: "Hackathon",
    source_url: "https://sih.gov.in",
    source_status: "sourced",
    dates: "Dec 15 - Dec 17, 2026",
    deadline: "2026-12-05T23:59:59Z",
    cost: 0,
    format: "hybrid",
    location: "New Delhi & Virtual",
    level: "All Levels",
    eligibility: {
      academic_years: ["1st Year", "2nd Year", "3rd Year", "4th Year"],
      departments: ["Computer Science", "Engineering", "Design", "Business"],
      mandatory_criteria: [
        "Valid College ID",
        "Team of 6 students with at least 1 female member",
      ],
    },
    description:
      "Nationwide initiative providing students a platform to solve pressing challenges of ministries, departments, and leading industries.",
    preparation_checklist: [
      { task: "Form certified 6-member team", done: true },
      { task: "Select problem statement from PS portal", done: true },
      { task: "Submit PPT design prototype", done: false },
      { task: "Mentor validation review", done: false },
    ],
    skills: ["Python", "Web Development", "System Design"],
    status: "active",
    last_checked_at: "2026-11-23T08:00:00Z",
    is_sample: true,
  },
  {
    id: "opp-002",
    title: "Google Summer of Code 2027",
    organizer: "Google Open Source",
    type: "Fellowship",
    source_url: "https://summerofcode.withgoogle.com",
    source_status: "sourced",
    dates: "May 1 - Aug 30, 2027",
    deadline: "2027-01-15T23:59:59Z",
    cost: 0,
    format: "online",
    location: "Remote / Global",
    level: "Intermediate",
    eligibility: {
      academic_years: ["1st Year", "2nd Year", "3rd Year", "4th Year", "Postgraduate"],
      departments: ["Computer Science", "Engineering"],
      mandatory_criteria: ["Eligible to work in home country", "Active GitHub profile"],
    },
    description:
      "Global online program focused on bringing new contributors into open source software development communities.",
    preparation_checklist: [
      { task: "Explore participating mentoring organizations", done: true },
      { task: "Submit 2 PRs to target repository", done: false },
      { task: "Draft proposal document", done: false },
    ],
    skills: ["Git", "Python", "Open Source"],
    status: "active",
    last_checked_at: "2026-11-22T12:00:00Z",
    is_sample: true,
  },
  {
    id: "opp-003",
    title: "Prasunex Innovathon 2026: Round 3 Code Storm",
    organizer: "Prasunex Consortium",
    type: "Hackathon",
    source_url: "https://prasunex.org/innovathon",
    source_status: "sourced",
    dates: "Nov 28 - Nov 30, 2026",
    deadline: "2026-11-27T18:00:00Z",
    cost: 0,
    format: "hybrid",
    location: "Delhi-NCR & Virtual",
    level: "All Levels",
    eligibility: {
      academic_years: ["1st Year", "2nd Year", "3rd Year", "4th Year"],
      departments: ["Computer Science", "Engineering", "Business", "Design"],
      mandatory_criteria: ["Round 2 shortlisting qualified"],
    },
    description:
      "High-intensity prototype round where shortlisted teams present full-stack web platforms and live architecture demonstrations.",
    preparation_checklist: [
      { task: "Finalize implementation plan and schema", done: true },
      { task: "Verify responsive design system on 390px, 820px, 1280px", done: true },
      { task: "Rehearse live product loop", done: true },
    ],
    skills: ["Next.js", "TypeScript", "Tailwind CSS"],
    status: "active",
    last_checked_at: "2026-11-23T15:00:00Z",
    is_sample: true,
  },
  {
    id: "opp-004",
    title: "Microsoft AI for Good Student Fellowship",
    organizer: "Microsoft Philanthropies",
    type: "Fellowship",
    source_url: "https://microsoft.com/ai-for-good-fellowship",
    source_status: "sourced",
    dates: "Jan 15 - Apr 15, 2027",
    deadline: "2026-12-18T23:59:59Z",
    cost: 0,
    format: "online",
    location: "Remote",
    level: "Intermediate",
    eligibility: {
      academic_years: ["2nd Year", "3rd Year", "4th Year"],
      departments: ["Computer Science", "Data Science"],
      mandatory_criteria: ["Prior project in Python or Azure AI"],
    },
    description:
      "Empowering university students to solve sustainability and accessibility challenges using cloud AI tooling.",
    preparation_checklist: [
      { task: "Complete Azure AI fundamentals module", done: true },
      { task: "Prepare case study summary", done: false },
    ],
    skills: ["Python", "AI Agents", "Cloud Computing"],
    status: "active",
    last_checked_at: "2026-11-20T10:00:00Z",
    is_sample: true,
  },
  {
    id: "opp-005",
    title: "Antler India Campus Fellowship",
    organizer: "Antler Global",
    type: "Fellowship",
    source_url: "https://antler.co/india-campus",
    source_status: "sourced",
    dates: "Feb 1 - May 30, 2027",
    deadline: "2026-12-20T23:59:59Z",
    cost: 0,
    format: "hybrid",
    location: "Bangalore & Hybrid",
    level: "All Levels",
    eligibility: {
      academic_years: ["3rd Year", "4th Year", "Postgraduate"],
      departments: ["Computer Science", "Business", "Design"],
      mandatory_criteria: ["Aspiring founder with an early hypothesis"],
    },
    description:
      "An exclusive pre-idea fellowship for ambitious student founders to build high-scale technology startups.",
    preparation_checklist: [
      { task: "Draft 1-page problem statement canvas", done: true },
      { task: "Conduct 5 customer discovery interviews", done: false },
      { task: "Record 2-minute founder pitch video", done: false },
    ],
    skills: ["Product Management", "Pitching", "Market Research"],
    status: "active",
    last_checked_at: "2026-11-21T18:00:00Z",
    is_sample: true,
  },
  {
    id: "opp-006",
    title: "IISc Bangalore Summer Research Internship (SRIP)",
    organizer: "Indian Institute of Science",
    type: "Research Program",
    source_url: "https://iisc.ac.in/srip-2027",
    source_status: "sourced",
    dates: "May 15 - Jul 15, 2027",
    deadline: "2027-01-05T23:59:59Z",
    cost: 0,
    format: "onsite",
    location: "Bangalore, India",
    level: "Advanced",
    eligibility: {
      academic_years: ["3rd Year", "4th Year"],
      departments: ["Computer Science", "Electrical", "Data Science"],
      mandatory_criteria: ["Minimum 8.0 CGPA", "Proficiency in Python/C++"],
    },
    description:
      "Work alongside top faculty members on frontier artificial intelligence, distributed systems, and quantum algorithms.",
    preparation_checklist: [
      { task: "Obtain recommendation letter from HOD", done: false },
      { task: "Submit research statement of purpose", done: false },
      { task: "Share GitHub portfolio of numerical projects", done: false },
    ],
    skills: ["PyTorch", "Distributed Systems", "Mathematical Modeling"],
    status: "active",
    last_checked_at: "2026-11-19T14:00:00Z",
    is_sample: true,
  },
  {
    id: "opp-007",
    title: "Kaggle Student Grandmaster Incubator",
    organizer: "Kaggle & Google",
    type: "Research Program",
    source_url: "https://kaggle.com/student-incubator",
    source_status: "sourced",
    dates: "Jan 10 - Mar 25, 2027",
    deadline: "2026-12-15T23:59:59Z",
    cost: 0,
    format: "online",
    location: "Remote",
    level: "Intermediate",
    eligibility: {
      academic_years: ["1st Year", "2nd Year", "3rd Year", "4th Year"],
      departments: ["Computer Science", "Data Science"],
      mandatory_criteria: ["Rank of Kaggle Expert or 3 public notebooks"],
    },
    description:
      "Mentorship track pairing university data science students with Kaggle Grandmasters on live competitive modeling competitions.",
    preparation_checklist: [
      { task: "Publish reproducible EDA notebook", done: true },
      { task: "Form cross-university competition pair", done: false },
    ],
    skills: ["Python", "Machine Learning", "Data Analysis"],
    status: "active",
    last_checked_at: "2026-11-22T09:00:00Z",
    is_sample: true,
  },
  {
    id: "opp-008",
    title: "ETHIndia 2026 Hackathon",
    organizer: "Devfolio & Ethereum Foundation",
    type: "Hackathon",
    source_url: "https://ethindia.co",
    source_status: "sourced",
    dates: "Dec 8 - Dec 10, 2026",
    deadline: "2026-12-01T23:59:59Z",
    cost: 0,
    format: "onsite",
    location: "Bangalore, India",
    level: "Intermediate",
    eligibility: {
      academic_years: ["1st Year", "2nd Year", "3rd Year", "4th Year"],
      departments: ["Computer Science", "Engineering"],
      mandatory_criteria: ["Approved Devfolio hacker profile"],
    },
    description:
      "Asia's largest Web3 hackathon bringing together over 2,000 engineers, designers, and researchers to build decentralized applications.",
    preparation_checklist: [
      { task: "Complete Solidity syntax basics", done: true },
      { task: "Prepare testnet deployment wallet", done: false },
    ],
    skills: ["Solidity", "Web3", "JavaScript"],
    status: "active",
    last_checked_at: "2026-11-20T16:00:00Z",
    is_sample: true,
  },
  {
    id: "opp-009",
    title: "Y Combinator Student Founder Pitch Days",
    organizer: "Y Combinator",
    type: "Fellowship",
    source_url: "https://ycombinator.com/students",
    source_status: "sourced",
    dates: "Mar 1 - Mar 3, 2027",
    deadline: "2027-01-20T23:59:59Z",
    cost: 0,
    format: "online",
    location: "Remote",
    level: "All Levels",
    eligibility: {
      academic_years: ["2nd Year", "3rd Year", "4th Year"],
      departments: ["Business", "Computer Science", "Design"],
      mandatory_criteria: ["Working MVP or demonstrable prototype"],
    },
    description:
      "Fast-track pitch session for university student builders directly in front of YC partners.",
    preparation_checklist: [
      { task: "Deploy functional demo on custom domain", done: false },
      { task: "Collect first 10 active student user logs", done: false },
    ],
    skills: ["Product Management", "Pitching", "Growth"],
    status: "active",
    last_checked_at: "2026-11-18T10:00:00Z",
    is_sample: true,
  },
  {
    id: "opp-010",
    title: "Stanford High-Performance Computing Workshop",
    organizer: "Stanford University",
    type: "Conference",
    source_url: "https://hpc.stanford.edu/workshop-2027",
    source_status: "unverified",
    dates: "Apr 10 - Apr 12, 2027",
    deadline: "2027-02-15T23:59:59Z",
    cost: 2500,
    format: "online",
    location: "Virtual",
    level: "Advanced",
    eligibility: {
      academic_years: ["3rd Year", "4th Year", "Postgraduate"],
      departments: ["Computer Science"],
      mandatory_criteria: ["Knowledge of C/CUDA and Linux kernel"],
    },
    description:
      "Intensive 3-day deep dive into GPU kernel optimizations, distributed training pipelines, and InfiniBand fabrics.",
    preparation_checklist: [
      { task: "Review CUDA programming handbook", done: false },
    ],
    skills: ["C++", "CUDA", "Distributed Systems"],
    status: "active",
    last_checked_at: "2026-11-15T11:00:00Z",
    is_sample: true,
  },
  {
    id: "opp-011",
    title: "Unstop National Management League 2026",
    organizer: "Unstop & IIM Calcutta",
    type: "Hackathon",
    source_url: "https://unstop.com/management-league",
    source_status: "sourced",
    dates: "Dec 20 - Dec 22, 2026",
    deadline: "2026-12-10T23:59:59Z",
    cost: 0,
    format: "online",
    location: "Remote",
    level: "All Levels",
    eligibility: {
      academic_years: ["1st Year", "2nd Year", "3rd Year", "4th Year"],
      departments: ["Business", "Design", "Economics"],
      mandatory_criteria: ["College enrollment certificate"],
    },
    description:
      "Nationwide case-study competition solving marketing, operations, and growth roadmaps for Fortune 500 brands.",
    preparation_checklist: [
      { task: "Review financial model deck", done: true },
      { task: "Build 10-slide strategy pitch", done: false },
    ],
    skills: ["Market Research", "Product Management", "Pitching"],
    status: "active",
    last_checked_at: "2026-11-21T14:00:00Z",
    is_sample: true,
  },
  {
    id: "opp-012",
    title: "CERN OpenLab Summer Student Programme",
    organizer: "CERN",
    type: "Research Program",
    source_url: "https://openlab.cern/summer-student-programme",
    source_status: "sourced",
    dates: "Jun 1 - Jul 31, 2027",
    deadline: "2027-01-31T23:59:59Z",
    cost: 0,
    format: "onsite",
    location: "Geneva, Switzerland",
    level: "Advanced",
    eligibility: {
      academic_years: ["3rd Year", "4th Year"],
      departments: ["Computer Science", "Engineering", "Data Science"],
      mandatory_criteria: [
        "Minimum 3 years university study completed by June",
        "Fluent English",
      ],
    },
    description:
      "Two-month internship at the European Organization for Nuclear Research working with peta-scale physics compute grids.",
    preparation_checklist: [
      { task: "Prepare academic transcript", done: true },
      { task: "Secure 2 academic recommendation letters", done: false },
    ],
    skills: ["Distributed Systems", "C++", "Linux"],
    status: "active",
    last_checked_at: "2026-11-20T09:30:00Z",
    is_sample: true,
  },
  {
    id: "opp-013",
    title: "Delhi Regional Web Development Camp",
    organizer: "Delhi Student Developers",
    type: "Hackathon",
    source_url: "https://delhidevs.org/camp",
    source_status: "stale",
    dates: "Nov 10 - Nov 12, 2026",
    deadline: "2026-11-05T23:59:59Z",
    cost: 200,
    format: "onsite",
    location: "Delhi-NCR",
    level: "Beginner",
    eligibility: {
      academic_years: ["1st Year", "2nd Year"],
      departments: ["Computer Science"],
      mandatory_criteria: ["None"],
    },
    description:
      "A student-led local meetup and coding sprint for beginners to build their first personal websites.",
    preparation_checklist: [{ task: "Install VS Code and Node.js", done: true }],
    skills: ["HTML/CSS", "JavaScript"],
    status: "expired",
    last_checked_at: "2026-11-01T10:00:00Z",
    is_sample: true,
  },
  {
    id: "opp-014",
    title: "Fetch-A-Thon 3.0 Masters Union",
    organizer: "Masters Union School of Business",
    type: "Hackathon",
    source_url: "https://unstop.com/fetch-a-thon",
    source_status: "sourced",
    dates: "Nov 1 - Nov 3, 2026",
    deadline: "2026-10-28T23:59:59Z",
    cost: 0,
    format: "hybrid",
    location: "Gurugram & Virtual",
    level: "All Levels",
    eligibility: {
      academic_years: ["1st Year", "2nd Year", "3rd Year", "4th Year"],
      departments: ["Computer Science", "Business"],
      mandatory_criteria: ["Team participation verified"],
    },
    description:
      "Fintech and AI innovation hackathon focused on autonomous execution and financial technology solutions.",
    preparation_checklist: [{ task: "Submitted MVP", done: true }],
    skills: ["AI Agents", "Python", "Fintech"],
    status: "expired",
    last_checked_at: "2026-10-25T12:00:00Z",
    is_sample: true,
  },
];

// ------------------------------------------------------------------------------
// INITIAL USER APPLICATIONS & TASKS
// ------------------------------------------------------------------------------
export let APPLICATIONS_STORE: Application[] = [
  {
    id: "app-user-001",
    student_id: "persona-beginner-001",
    opportunity_id: "opp-003",
    stage: "preparing",
    notes: "Shortlisted for Round 3. Focus on responsive design system showcase and Playwright test.",
    fit_score: 94,
    fit_breakdown: {
      interests_score: 30,
      goals_score: 25,
      budget_score: 15,
      schedule_score: 14,
      format_score: 10,
      level_score: 5,
      reasons: [
        "100% matched interests in web development and full-stack architecture.",
        "Aligns with your primary internship and project portfolio goal.",
        "Free participation well within your budget limit.",
        "Allowed department: Computer Science (2nd Year).",
      ],
    },
    readiness_snapshot: {
      prerequisites_met: true,
      skills_to_strengthen: ["TypeScript"],
      checklist_completion_ratio: "2 of 3 complete",
      readiness_percentage: 67,
    },
    tasks: [
      {
        id: "task-001",
        application_id: "app-user-001",
        title: "Finalize implementation plan & schema",
        due_date: "2026-11-24",
        priority: "high",
        completed: true,
      },
      {
        id: "task-002",
        application_id: "app-user-001",
        title: "Verify responsive design system on 390px, 820px, 1280px",
        due_date: "2026-11-25",
        priority: "high",
        completed: true,
      },
      {
        id: "task-003",
        application_id: "app-user-001",
        title: "Rehearse live end-to-end product loop",
        due_date: "2026-11-27",
        priority: "medium",
        completed: false,
      },
    ],
    created_at: "2026-11-20T10:00:00Z",
    updated_at: "2026-11-23T14:00:00Z",
  },
  {
    id: "app-user-002",
    student_id: "persona-beginner-001",
    opportunity_id: "opp-001",
    stage: "saved",
    notes: "Looking for team members for Smart India Hackathon.",
    fit_score: 88,
    fit_breakdown: {
      interests_score: 28,
      goals_score: 22,
      budget_score: 15,
      schedule_score: 13,
      format_score: 10,
      level_score: 5,
      reasons: [
        "Nationwide visibility aligns with internship preparation.",
        "Department matches Computer Science.",
        "Zero registration cost.",
      ],
    },
    readiness_snapshot: {
      prerequisites_met: true,
      skills_to_strengthen: ["System Design"],
      checklist_completion_ratio: "2 of 4 complete",
      readiness_percentage: 50,
    },
    tasks: [
      {
        id: "task-004",
        application_id: "app-user-002",
        title: "Finalize problem statement selection",
        due_date: "2026-11-28",
        priority: "high",
        completed: false,
      },
      {
        id: "task-005",
        application_id: "app-user-002",
        title: "Draft 5-slide PPT architecture proposal",
        due_date: "2026-12-01",
        priority: "medium",
        completed: false,
      },
    ],
    created_at: "2026-11-21T12:00:00Z",
    updated_at: "2026-11-22T08:00:00Z",
  },
];

// ------------------------------------------------------------------------------
// INITIAL GROWTH OUTCOMES (GROWTH PASSPORT)
// ------------------------------------------------------------------------------
export let OUTCOMES_STORE: GrowthOutcome[] = [
  {
    id: "out-001",
    student_id: "persona-beginner-001",
    opportunity_id: "opp-014",
    title: "Fetch-A-Thon 3.0 Participation & Fintech MVP",
    participation: "Finalist Team",
    reflection:
      "Collaborated with team CODE STORM on building an intelligent fintech dashboard. Gained solid experience with Next.js, responsive layouts, and REST API integration.",
    skills_gained: ["Next.js", "REST APIs", "Fintech Basics", "Team Collaboration"],
    verification: "verified",
    evidence_url: "https://erpsrm.com/certificate/fetch-a-thon-3-0",
    created_at: "2026-11-04T12:00:00Z",
  },
  {
    id: "out-002",
    student_id: "persona-beginner-001",
    title: "Autonomous Python Slack Assistant",
    participation: "Solo Builder",
    reflection:
      "Built a small agent bot that pulls daily tech news using Beautiful Soup and posts summaries into our college group. Learned regex, async requests, and prompt crafting.",
    skills_gained: ["Python", "Web Scraping", "Asyncio", "AI Agents"],
    verification: "link_supported",
    evidence_url: "https://github.com/ashutosh-code/slack-agent-bot",
    created_at: "2026-11-12T16:00:00Z",
  },
  {
    id: "out-003",
    student_id: "persona-beginner-001",
    title: "Completed Harvard CS50 Web Development Modules",
    participation: "Coursework",
    reflection:
      "Finished SQLite and Django routing assignments. Strengthened foundational understanding of database schemas and HTTP verbs.",
    skills_gained: ["SQL", "HTTP Standards", "Python"],
    verification: "self_reported",
    created_at: "2026-11-18T10:00:00Z",
  },
];

// Helper functions for state mutations
export function getStudentProfile(idOrPersona?: string): StudentProfile {
  if (idOrPersona && PERSONAS[idOrPersona]) {
    return PERSONAS[idOrPersona];
  }
  // Default to Aarav (Beginner)
  return PERSONAS.beginner;
}

export function getAllOpportunities(): Opportunity[] {
  return INITIAL_OPPORTUNITIES;
}

export function getOpportunityById(id: string): Opportunity | undefined {
  return INITIAL_OPPORTUNITIES.find((o) => o.id === id);
}

export function getWorldSignals(): WorldSignal[] {
  return INITIAL_SIGNALS;
}

export function getApplicationsByStudent(studentId: string): Application[] {
  return APPLICATIONS_STORE.filter((a) => a.student_id === studentId).map((a) => ({
    ...a,
    opportunity: INITIAL_OPPORTUNITIES.find((o) => o.id === a.opportunity_id),
  }));
}

export function addApplication(app: Application) {
  const existingIdx = APPLICATIONS_STORE.findIndex(
    (a) => a.student_id === app.student_id && a.opportunity_id === app.opportunity_id
  );
  if (existingIdx >= 0) {
    APPLICATIONS_STORE[existingIdx] = { ...APPLICATIONS_STORE[existingIdx], ...app };
  } else {
    APPLICATIONS_STORE.push(app);
  }
  return app;
}

export function updateApplicationStage(
  id: string,
  stage: Application["stage"]
) {
  const app = APPLICATIONS_STORE.find((a) => a.id === id);
  if (app) {
    app.stage = stage;
    app.updated_at = new Date().toISOString();
  }
  return app;
}

export function getOutcomesByStudent(studentId: string): GrowthOutcome[] {
  return OUTCOMES_STORE.filter((o) => o.student_id === studentId);
}

export function addOutcome(outcome: GrowthOutcome) {
  OUTCOMES_STORE.unshift(outcome);
  return outcome;
}
