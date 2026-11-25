export interface GlobeMarker {
  id: string;
  title: string;
  headline: string;
  summary: string;
  category: "AI & Tech" | "Research" | "Business" | "Education" | "Global Events" | "Sustainability";
  location: string;
  country: string;
  lat: number;
  lng: number;
  relevanceScore: number;
  color: string;
  iconType: "chip" | "leaf" | "rocket" | "flask" | "atom" | "globe" | "briefcase";
  sourceName: string;
  sourceUrl: string;
  publishedAt: string;
  whyItMatters: string;
  studentAction: string;
  connectedNodes: {
    researchInstitutions: string[];
    universities: string[];
    startups: string[];
    opportunities: string[];
  };
  relatedSkills: string[];
  opportunityId?: string;
}

export interface TrendingTopic {
  id: string;
  name: string;
  change: string;
  category: string;
  color: string;
  sparkline: number[];
  primaryCoordinates: [number, number]; // [lat, lng]
  volume?: string;
  rank?: number;
}

export interface RegionActivity {
  id: string;
  region: string;
  activityLevel: number; // 0 to 100
  signalCount: number;
  trendingDomain: string;
}

export const WORLD_GRAPH_MARKERS: GlobeMarker[] = [
  {
    id: "m-001",
    title: "AI Breakthrough in US",
    headline: "New multimodal reasoning architecture achieves state-of-the-art inference efficiency.",
    summary:
      "Next-generation multimodal reasoning models combine vision, code synthesis, and multi-step planning with a 4x reduction in compute requirements.",
    category: "AI & Tech",
    location: "San Francisco, United States",
    country: "United States",
    lat: 37.7749,
    lng: -122.4194,
    relevanceScore: 94,
    color: "#A855F7", // Purple
    iconType: "chip",
    sourceName: "OpenAI & Stanford HAI",
    sourceUrl: "https://stanford.edu/hai/ai-index-2026",
    publishedAt: "2026-11-20T08:00:00Z",
    whyItMatters:
      "Shrinking inference latency allows engineers to run complex agentic loops locally. Familiarity with quantization and prompt distillation is now a high-value skill.",
    studentAction:
      "Build a local agent workflow with Python and test reasoning chains on consumer GPU hardware.",
    connectedNodes: {
      researchInstitutions: ["Stanford HAI", "MIT CSAIL", "Berkeley AI Research"],
      universities: ["Stanford University", "UC Berkeley", "Carnegie Mellon"],
      startups: ["Anthropic", "Groq", "Together AI", "Ollama"],
      opportunities: ["SIH Hackathon 2026", "Open-Source AI Fellowship", "NeurIPS Student Workshop"],
    },
    relatedSkills: ["PyTorch", "Model Quantization", "Agentic Systems", "FastAPI"],
    opportunityId: "opp-001",
  },
  {
    id: "m-002",
    title: "National Semiconductor Mission",
    headline: "India approves subsidized MPW tape-outs and EDA tool licenses across 80+ engineering institutions.",
    summary:
      "Under ISM Phase 2, student VLSI teams receive state-funded fabrication runs at SCL Mohali and commercial foundry access for RISC-V edge processors.",
    category: "Research",
    location: "Bengaluru, India",
    country: "India",
    lat: 12.9716,
    lng: 77.5946,
    relevanceScore: 91,
    color: "#EAB308", // Yellow / Gold
    iconType: "atom",
    sourceName: "MeitY & India Semiconductor Mission",
    sourceUrl: "https://meity.gov.in/semiconductors/student-grants-2026",
    publishedAt: "2026-11-14T14:30:00Z",
    whyItMatters:
      "Undergraduate tape-outs are now funded directly by government grants. Hardware design and Verilog verification skills offer rare competitive advantage.",
    studentAction:
      "Submit an ASIC or RISC-V accelerator proposal through your college VLSI lab to secure free fabrication.",
    connectedNodes: {
      researchInstitutions: ["SCL Mohali", "ISRO", "DRDO", "CeNSE IISc"],
      universities: ["IISc Bangalore", "IIT Madras", "IIT Bombay", "BITS Pilani"],
      startups: ["Mindgrove Tech", "InCore Semiconductors", "Morphing Machines"],
      opportunities: ["ISM Student Tapeout Grant", "RISC-V Global Contest", "Cadence Design Challenge"],
    },
    relatedSkills: ["Verilog", "RISC-V", "VLSI Physical Design", "Digital Logic"],
    opportunityId: "opp-002",
  },
  {
    id: "m-003",
    title: "Next-Gen Starship Launch",
    headline: "Deep space orbital refueling and heavy booster recovery test successful.",
    summary:
      "Autonomous trajectory correction algorithms and cryogenic prop management achieve full qualification for lunar payload transit.",
    category: "AI & Tech",
    location: "Starbase, Texas",
    country: "United States",
    lat: 25.9975,
    lng: -97.1557,
    relevanceScore: 88,
    color: "#F97316", // Orange
    iconType: "rocket",
    sourceName: "SpaceX & NASA Artemis",
    sourceUrl: "https://nasa.gov/missions/artemis",
    publishedAt: "2026-11-18T16:00:00Z",
    whyItMatters:
      "Rapid reduction in launch cost is creating an explosion of satellite IoT, orbital compute networks, and space-grade sensor development.",
    studentAction:
      "Explore orbital telemetry parsing and low-power telemetry protocols in CubeSat open repositories.",
    connectedNodes: {
      researchInstitutions: ["NASA JPL", "ESA", "ISRO", "SwRI"],
      universities: ["Purdue Aerospace", "Georgia Tech", "TU Delft", "IIST"],
      startups: ["SpaceX", "Rocket Lab", "Axiom Space", "Skyroot Aerospace"],
      opportunities: ["Space Technology Hackathon", "NASA Space Apps 2026", "CubeSat Student Challenge"],
    },
    relatedSkills: ["Embedded Systems", "Orbital Mechanics", "C++", "Telemetry Processing"],
    opportunityId: "opp-004",
  },
  {
    id: "m-004",
    title: "Nordic Clean Hydrogen Grid",
    headline: "Large-scale green hydrogen storage and algorithmic grid balancing activated across Scandinavia.",
    summary:
      "Integrated wind-to-hydrogen electrolyzers leverage machine learning forecast models to stabilize cross-border renewable power distribution.",
    category: "Sustainability",
    location: "Stockholm, Sweden",
    country: "Sweden",
    lat: 59.3293,
    lng: 18.0686,
    relevanceScore: 85,
    color: "#22C55E", // Green
    iconType: "leaf",
    sourceName: "Nordic Clean Energy Alliance",
    sourceUrl: "https://nordicenergy.org/hydrogen-grid",
    publishedAt: "2026-11-12T10:00:00Z",
    whyItMatters:
      "Clean-tech infrastructure is blending power systems engineering with real-time optimization and time-series forecasting.",
    studentAction:
      "Study time-series electricity grid datasets and train smart-grid load forecasting models.",
    connectedNodes: {
      researchInstitutions: ["KTH Energy Labs", "SINTEF", "Fraunhofer Institute"],
      universities: ["KTH Royal Institute", "Chalmers University", "DTU Denmark"],
      startups: ["H2 Green Steel", "Northvolt", "Vattenfall AI"],
      opportunities: ["EU Clean Tech Student Grant", "Climate Hackathon", "Nordic Energy Fellowship"],
    },
    relatedSkills: ["Time Series Forecasting", "Optimization Algorithms", "Smart Grid IoT", "Python"],
    opportunityId: "opp-005",
  },
  {
    id: "m-005",
    title: "Quantum Key Distribution Network",
    headline: "Commercial post-quantum cryptographic exchange standards deployed across Central Europe.",
    summary:
      "CERN and European telecommunication consortium establish 1,200 km entangled photon quantum repeater mesh for secure inter-bank data pipelines.",
    category: "Research",
    location: "Geneva / Zurich, Switzerland",
    country: "Switzerland",
    lat: 46.2044,
    lng: 6.1432,
    relevanceScore: 92,
    color: "#38BDF8", // Sky Blue
    iconType: "flask",
    sourceName: "CERN Quantum Technology Initiative",
    sourceUrl: "https://quantum.cern/qti-network-2026",
    publishedAt: "2026-11-05T09:00:00Z",
    whyItMatters:
      "Legacy RSA encryption will phase out in critical sectors by 2030. Understanding lattice-based cryptography and QKD protocols prepares you for security leadership.",
    studentAction:
      "Implement NIST-approved post-quantum algorithms (Kyber / Dilithium) in a web security test project.",
    connectedNodes: {
      researchInstitutions: ["CERN", "Max Planck Institute", "NIST"],
      universities: ["ETH Zurich", "EPFL", "Cambridge University", "TU Munich"],
      startups: ["ID Quantique", "Qunnect", "Terra Quantum"],
      opportunities: ["CERN Summer Student Programme", "Quantum Hackathon", "IBM Quantum Challenge"],
    },
    relatedSkills: ["Cryptography", "Qiskit", "C++", "Network Protocols"],
    opportunityId: "opp-006",
  },
  {
    id: "m-006",
    title: "Global EdTech AI Micro-Credentials",
    headline: "Association of Pacific Rim Universities formalizes verified AI project credentials across 24 countries.",
    summary:
      "Student project verification networks replace static resumes with cryptographic proof of code contributions, team leadership, and problem-solving.",
    category: "Education",
    location: "Singapore",
    country: "Singapore",
    lat: 1.3521,
    lng: 103.8198,
    relevanceScore: 89,
    color: "#EC4899", // Pink
    iconType: "globe",
    sourceName: "APRU Global Education Forum",
    sourceUrl: "https://apru.org/credentials-2026",
    publishedAt: "2026-10-29T11:00:00Z",
    whyItMatters:
      "Global employers are directly hiring students based on verifiable skill telemetry instead of generic college tier labels.",
    studentAction:
      "Keep your VYBE Growth Passport and GitHub repository proofs updated with peer-verified projects.",
    connectedNodes: {
      researchInstitutions: ["NUS Smart Nation Lab", "UNESCO ICT", "World Bank Education"],
      universities: ["NUS", "NTU", "Tsinghua", "University of Tokyo"],
      startups: ["Credly", "Kaggle", "Coursera AI", "HackerEarth"],
      opportunities: ["APRU Student Global Challenge", "Singapore EdTech Accelerator"],
    },
    relatedSkills: ["Git / GitHub", "Portfolio Craft", "Fullstack Engineering", "Technical Writing"],
    opportunityId: "opp-003",
  },
  {
    id: "m-007",
    title: "Bio-Computing & Agri-Genomics Hub",
    headline: "Latin America launches open genome database for drought-resistant crop breeding.",
    summary:
      "Machine learning models predict enzyme configurations to withstand changing precipitation patterns without genetic modification.",
    category: "Business",
    location: "São Paulo, Brazil",
    country: "Brazil",
    lat: -23.5505,
    lng: -46.6333,
    relevanceScore: 82,
    color: "#10B981", // Emerald
    iconType: "briefcase",
    sourceName: "Embrapa AgriTech Lab",
    sourceUrl: "https://embrapa.br/bio-ai",
    publishedAt: "2026-10-20T13:00:00Z",
    whyItMatters:
      "Computational biology is experiencing massive investment, hiring software engineers with data pipeline and simulation backgrounds.",
    studentAction:
      "Explore Biopython and AlphaFold open weight models on Google Colab or Kaggle.",
    connectedNodes: {
      researchInstitutions: ["Embrapa", "INPE", "FAPESP"],
      universities: ["University of São Paulo", "UNICAMP", "UBA Argentina"],
      startups: ["Granular Bio", "Agrosmart", "BovControl"],
      opportunities: ["Global AgriTech Challenge", "BioData Student Grant"],
    },
    relatedSkills: ["Biopython", "Data Pipelines", "SciPy", "Machine Learning"],
    opportunityId: "opp-007",
  },
  {
    id: "m-008",
    title: "Decentralized Solar & FinTech Grid",
    headline: "Sub-Saharan micro-grid operators integrate mobile-first AI billing and credit scoring.",
    summary:
      "Decentralized off-grid solar deployments use lightweight edge ML models to dynamically allocate power to rural clinics and community micro-businesses.",
    category: "Global Events",
    location: "Nairobi, Kenya",
    country: "Kenya",
    lat: -1.2921,
    lng: 36.8219,
    relevanceScore: 86,
    color: "#06B6D4", // Cyan
    iconType: "globe",
    sourceName: "African Clean Energy & FinTech Forum",
    sourceUrl: "https://techcabal.com/solar-fintech",
    publishedAt: "2026-10-14T07:30:00Z",
    whyItMatters:
      "Proves how frugal engineering and resilient offline-first architectures solve high-impact real-world problems.",
    studentAction:
      "Design an offline-first PWA or mobile app using local IndexedDB caching and sync adapters.",
    connectedNodes: {
      researchInstitutions: ["iHub Nairobi", "Strathmore Energy Lab", "African Development Bank"],
      universities: ["University of Nairobi", "Ashesi University", "Strathmore"],
      startups: ["M-KOPA", "Bboxx", "SunCulture"],
      opportunities: ["African Youth Innovation Fund", "UN SDG Student Hackathon"],
    },
    relatedSkills: ["Offline-first Architecture", "REST APIs", "IoT Microcontrollers", "Mobile UX"],
    opportunityId: "opp-008",
  },
];

export const TRENDING_GLOBAL_TOPICS: TrendingTopic[] = [
  {
    id: "t-1",
    rank: 1,
    name: "Artificial Intelligence",
    volume: "1,420 signals",
    change: "+24%",
    category: "AI & Tech",
    color: "#A855F7",
    sparkline: [20, 28, 35, 42, 58, 65, 82, 94],
    primaryCoordinates: [37.7749, -122.4194],
  },
  {
    id: "t-2",
    rank: 2,
    name: "Climate Action",
    volume: "890 signals",
    change: "+18%",
    category: "Sustainability",
    color: "#22C55E",
    sparkline: [30, 32, 40, 48, 55, 62, 70, 78],
    primaryCoordinates: [59.3293, 18.0686],
  },
  {
    id: "t-3",
    rank: 3,
    name: "Space Innovation",
    volume: "640 signals",
    change: "+16%",
    category: "AI & Tech",
    color: "#38BDF8",
    sparkline: [15, 22, 28, 35, 42, 50, 60, 68],
    primaryCoordinates: [25.9975, -97.1557],
  },
  {
    id: "t-4",
    rank: 4,
    name: "Quantum Computing",
    volume: "510 signals",
    change: "+14%",
    category: "Research",
    color: "#F97316",
    sparkline: [10, 18, 25, 30, 40, 48, 54, 62],
    primaryCoordinates: [46.2044, 6.1432],
  },
  {
    id: "t-5",
    rank: 5,
    name: "Global Education",
    volume: "430 signals",
    change: "+12%",
    category: "Education",
    color: "#EC4899",
    sparkline: [25, 30, 35, 40, 45, 52, 58, 64],
    primaryCoordinates: [1.3521, 103.8198],
  },
];

export const REGIONAL_ACTIVITIES: RegionActivity[] = [
  { id: "reg-na", region: "North America", activityLevel: 94, signalCount: 1420, trendingDomain: "AI & Autonomous Systems" },
  { id: "reg-eu", region: "Europe", activityLevel: 88, signalCount: 1180, trendingDomain: "Quantum & Clean Hydrogen" },
  { id: "reg-in", region: "India & South Asia", activityLevel: 92, signalCount: 1350, trendingDomain: "Semiconductors & DeepTech" },
  { id: "reg-ea", region: "East Asia", activityLevel: 90, signalCount: 1290, trendingDomain: "Robotics & Micro-Credentials" },
  { id: "reg-la", region: "Latin America", activityLevel: 68, signalCount: 640, trendingDomain: "Agri-Genomics & BioTech" },
  { id: "reg-af", region: "Sub-Saharan Africa", activityLevel: 72, signalCount: 710, trendingDomain: "Decentralized Solar & FinTech" },
];
