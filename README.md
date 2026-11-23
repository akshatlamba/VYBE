# VYBE: Student Opportunity & Growth Platform

> **"Your World. Your Guide. Your Growth."**  
> *Built for Prasunex Innovathon 2026 by Team CODE STORM (Piyush, Aashi, Akshat, Anugrah, Ashutosh).*

VYBE is a full-stack student opportunity and decision-intelligence platform built as an installable Progressive Web App (PWA). Rather than acting as another passive listings directory or open-ended chatbot, VYBE connects real-world opportunities to structured preparation and verified student growth.

---

## 🌟 The Core Loop & Student Journey

```
World Pulse  ───>  PULSE (Guide)  ───>  Action Plan  ───>  Growth Passport
    ▲                                                             │
    └────────────────── Progress Feeds Next Signal ───────────────┘
```

1. **Profile**: 4-step onboarding captures goals, verified skills, academic year, department, budget ceiling, and availability.
2. **Discover (Opportunity Radar)**: Curated opportunities scored with deterministic matching and transparent reason breakdowns.
3. **Check Eligibility**: Hard filters strictly exclude opportunities the student cannot apply for (deadline, department, year, budget).
4. **Identify Skill Gaps**: Missing prerequisite competencies are made visible as lilac chips.
5. **Prepare & Track**: Personalized action plan with checklist timelines, Kanban board, and deadlines.
6. **Apply & Record**: Verifiable Opportunity Receipt with QR code; outcomes captured in the portable Growth Passport.

---

## 🎨 Visual Design System (From Design Reference)

Adapted directly from the provided design reference:
- **Pastel Mesh Background**: Peach (`#FAD8C6`), pink (`#F6C9DD`), lavender (`#D9C9F5`) cascading into clean off-white (`#F8F7FB`).
- **Glass Surfaces**: Translucent white surfaces (~65% opacity), 20px backdrop blur, `1px` subtle top highlight border, soft depth shadow, and `28px` rounded corners (`rounded-[28px]`).
- **Signature Dark Feature Card**: Charcoal `#26262B` surface featuring a bright lime `#D3E57A` progress ring on a translucent track, vertical divider, and 3 icon stats.
- **Controls & Filters**:
  - Primary button: Solid black/charcoal pill (`rounded-full bg-[#1E1E22] text-white`).
  - Active filter pill: Solid black pill with white text.
  - Status tabs: Lime `#D3E57A` background with white count circle when active; white with grey count circle when inactive.
  - Date & deadline strip: Tall rounded pill columns (weekday over circular date badge), selected = solid black.
- **Responsive Navigation**:
  - **Mobile (<768px)**: Floating glass bottom bar with active black pill.
  - **Tablet (768px - 1023px)**: Glass icon rail.
  - **Desktop (>=1024px)**: Glass sidebar with matching active pill styling.
  - **Universal Shell**: Shared across Student, Institution Staff, and Admin views with one-click perspective switching.
- **Living Showcase**: Visit `/design-system` to explore every token, component, and state in both Light and Dark themes.

---

## 🧠 Deterministic Recommendation Engine (No Hallucinations)

Matching logic is 100% deterministic and unit-tested:

1. **Hard Eligibility**:
   - Application deadline active?
   - Student academic year in permitted cohort?
   - Student department permitted?
   - Cost $\le$ student budget ceiling?
   - *Ineligible opportunities are strictly excluded from recommendations.*
2. **Weighted Fit with Visible Reasons** (`lib/intelligence/weights.config.ts`):
   - **Interests Match**: 30%
   - **Career Goals Alignment**: 25%
   - **Budget Feasibility**: 15%
   - **Schedule Feasibility**: 15%
   - **Format Match (Online/Hybrid/Onsite)**: 10%
   - **Level Fit**: 5%
3. **Readiness Analysis (Separated from Eligibility)**:
   - Prerequisites verified vs missing skills to strengthen.
   - Preparation checklist completion ratio (e.g. *"Readiness: 3 of 4 preparation items complete"*).
   - Time remaining until submission deadline.

---

## 🤖 Safe AI Boundaries & Pluggable Provider

- **Zero-Key Out-of-the-Box**: Runs instantly with a zero-dependency Mock AI Provider.
- **Persona Context Awareness**: The same global trend produces 3 tailored roadmaps:
  - *Beginner wanting an internship*: Learn Python async, build 1 small agent bot, join SIH team.
  - *Business-minded wanting a startup*: Validate vertical agent economics, map problem canvas, pitch to Antler.
  - *Advanced wanting research*: Reproduce edge SLM benchmarks, optimize PyTorch kernel, target IISc SRIP.
- **Strict Guardrails**: AI never touches eligibility checks, rankings, or status changes. All AI endpoints are rate-limited.

---

## 🛡️ Trust, Verification & Privacy Architecture

- **Opportunity Radar**: Every opportunity is explicitly marked `Sourced` (with official link and last-checked timestamp) or `Unverified`. Stale listings are automatically flagged.
- **Growth Passport**: Three honest evidence tiers (never labels unverified records as verified):
  - `Self-reported`: Student reflections and self-logged progress.
  - `Link-supported`: Public repository, demo URL, or publication attachment.
  - `Verified`: Organizer or institutional certification with cryptographic verification hash.
- **Institution Privacy**: Staff analytics strictly suppress any filtered cohort smaller than **5 students** to protect student anonymity. No individual student identities are ever exposed to staff.
- **Demoware Honesty**: All prototype seed data clearly displays the `Sample Prototype Data` badge.

---

## 🚀 Setup & Execution

### Prerequisites
- Node.js 18+ (tested on Node v24)
- npm 9+

### 1. Installation
```bash
git clone <repo-url>
cd VYBEE
npm install
```

### 2. Environment Configuration
```bash
cp .env.example .env.local
```
*(Supabase credentials and AI API keys are optional. The app falls back to the in-memory repository and mock intelligence provider automatically).*

### 3. Running Locally
```bash
npm run dev
```
Open `http://localhost:3000` (or `http://localhost:3001` if port 3000 is occupied).

### 4. Running Unit Tests (Vitest)
```bash
npm test
```
Runs the 9 deterministic unit tests for Eligibility, Weighted Fit, and Readiness.

### 5. Running End-to-End User Journey (Playwright)
```bash
npm run test:e2e
```
Executes the complete journey from 4-step onboarding → Opportunity Radar → Opportunity Receipt → Tracker → Logging Outcome → Growth Passport.

---

## 🗄️ Database Migrations & Seeds

- **SQL Schema with RLS**: `supabase/migrations/001_initial_schema.sql`
- **Seed Data (14 Opportunities, 6 Signals, 3 Personas)**: `supabase/seed.sql`

---

## 👥 Prasunex Innovathon Round 3 — Team Code Storm

- **Ashutosh Singh** — UI/UX Design & Architecture
- **Piyush** — Backend Developer & Technical Pitch
- **Aashi** — Frontend Developer & Pitch
- **Akshat** — Frontend Developer
- **Anugrah** — Database Developer
