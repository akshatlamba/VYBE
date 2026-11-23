-- ==============================================================================
-- VYBE 2.0: Student Opportunity & Growth Intelligence Platform
-- PostgreSQL Schema & Row-Level Security (RLS) Policies
-- ==============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. INSTITUTIONS
CREATE TABLE institutions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    domain TEXT UNIQUE NOT NULL,
    location TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. USER PROFILES
CREATE TYPE user_role AS ENUM ('student', 'staff', 'admin');

CREATE TABLE profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    role user_role NOT NULL DEFAULT 'student',
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    institution_id UUID REFERENCES institutions(id) ON DELETE SET NULL,
    academic_year TEXT, -- '1st Year', '2nd Year', '3rd Year', '4th Year', 'Postgraduate'
    department TEXT, -- 'Computer Science', 'Data Science', 'Electrical', 'Business', 'Design'
    location TEXT, -- e.g. 'Delhi-NCR', 'Bangalore', 'Remote'
    budget_max NUMERIC(10, 2) DEFAULT 0.00,
    availability TEXT, -- 'Part-time (5-10 hrs/wk)', 'Full-time', 'Weekends only'
    preferred_format TEXT DEFAULT 'any', -- 'online', 'onsite', 'hybrid', 'any'
    sharing_prefs JSONB DEFAULT '{"public_passport": true, "show_email": false, "share_aggregates": true}'::jsonb,
    is_sample BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. SKILLS & INTERESTS CATALOGUES
CREATE TABLE skills_catalogue (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT UNIQUE NOT NULL,
    category TEXT NOT NULL -- 'Technical', 'Product', 'Design', 'Research'
);

CREATE TABLE interests_catalogue (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT UNIQUE NOT NULL,
    category TEXT NOT NULL
);

-- 4. STUDENT SKILLS & INTERESTS
CREATE TABLE student_skills (
    student_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    skill_name TEXT NOT NULL,
    level TEXT NOT NULL CHECK (level IN ('Beginner', 'Intermediate', 'Advanced')),
    PRIMARY KEY (student_id, skill_name)
);

CREATE TABLE student_interests (
    student_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    interest_name TEXT NOT NULL,
    PRIMARY KEY (student_id, interest_name)
);

-- 5. CAREER GOALS
CREATE TABLE student_goals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    primary_goal TEXT NOT NULL, -- 'internship', 'startup', 'research', 'hackathon'
    target_timeline TEXT, -- 'Next 3 months', 'This academic year'
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. OPPORTUNITIES CATALOGUE
CREATE TYPE source_status AS ENUM ('sourced', 'unverified', 'stale');
CREATE TYPE opportunity_status AS ENUM ('active', 'expired', 'draft');
CREATE TYPE opportunity_format AS ENUM ('online', 'onsite', 'hybrid');

CREATE TABLE opportunities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    organizer TEXT NOT NULL,
    type TEXT NOT NULL, -- 'Hackathon', 'Internship', 'Research Program', 'Fellowship', 'Conference'
    source_url TEXT NOT NULL,
    source_status source_status NOT NULL DEFAULT 'sourced',
    dates TEXT NOT NULL, -- e.g. 'Dec 15 - Dec 17, 2026'
    deadline TIMESTAMPTZ NOT NULL,
    cost NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    format opportunity_format NOT NULL DEFAULT 'online',
    location TEXT NOT NULL, -- 'Virtual / Remote' or city
    level TEXT NOT NULL DEFAULT 'All Levels', -- 'Beginner', 'Intermediate', 'Advanced', 'All Levels'
    eligibility JSONB NOT NULL DEFAULT '{}'::jsonb,
    -- JSON structure: {
    --   "academic_years": ["1st Year", "2nd Year", "3rd Year"],
    --   "departments": ["Computer Science", "Engineering"],
    --   "mandatory_criteria": ["Enrolled college student", "Valid student ID"]
    -- }
    description TEXT NOT NULL,
    preparation_checklist JSONB NOT NULL DEFAULT '[]'::jsonb,
    status opportunity_status NOT NULL DEFAULT 'active',
    last_checked_at TIMESTAMPTZ DEFAULT NOW(),
    is_sample BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE opportunity_skills (
    opportunity_id UUID REFERENCES opportunities(id) ON DELETE CASCADE,
    skill_name TEXT NOT NULL,
    is_prerequisite BOOLEAN DEFAULT false,
    PRIMARY KEY (opportunity_id, skill_name)
);

-- 7. WORLD SIGNALS (GLOBAL TRENDS)
CREATE TABLE world_signals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    summary TEXT NOT NULL,
    source_name TEXT NOT NULL,
    source_url TEXT NOT NULL,
    published_at TIMESTAMPTZ NOT NULL,
    tags TEXT[] DEFAULT ARRAY[]::TEXT[],
    is_sample BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. ACTION PLANS & ACTION STEPS
CREATE TABLE action_plans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    signal_id UUID REFERENCES world_signals(id) ON DELETE SET NULL,
    goal_context TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TYPE action_step_kind AS ENUM ('learn', 'build', 'apply');
CREATE TYPE action_step_status AS ENUM ('pending', 'in_progress', 'completed');

CREATE TABLE action_steps (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    plan_id UUID REFERENCES action_plans(id) ON DELETE CASCADE,
    student_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    kind action_step_kind NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    opportunity_id UUID REFERENCES opportunities(id) ON DELETE SET NULL,
    status action_step_status NOT NULL DEFAULT 'pending',
    order_index INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. APPLICATIONS (OPPORTUNITY TRACKER)
CREATE TYPE application_stage AS ENUM ('saved', 'preparing', 'applied', 'attended', 'done', 'withdrawn');

CREATE TABLE applications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    opportunity_id UUID REFERENCES opportunities(id) ON DELETE CASCADE,
    stage application_stage NOT NULL DEFAULT 'saved',
    notes TEXT,
    fit_score INT NOT NULL DEFAULT 0,
    fit_breakdown JSONB NOT NULL DEFAULT '{}'::jsonb,
    readiness_snapshot JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(student_id, opportunity_id)
);

-- 10. PREPARATION TASKS
CREATE TYPE task_priority AS ENUM ('low', 'medium', 'high');

CREATE TABLE tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    application_id UUID REFERENCES applications(id) ON DELETE CASCADE,
    student_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    due_date DATE,
    priority task_priority NOT NULL DEFAULT 'medium',
    completed BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. OUTCOMES & EVIDENCE (GROWTH PASSPORT)
CREATE TYPE verification_state AS ENUM ('self_reported', 'link_supported', 'verified');

CREATE TABLE outcomes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    opportunity_id UUID REFERENCES opportunities(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    participation TEXT NOT NULL, -- e.g. 'Participant', 'Finalist', 'Winner', 'Research Author'
    reflection TEXT,
    skills_gained TEXT[] DEFAULT ARRAY[]::TEXT[],
    verification verification_state NOT NULL DEFAULT 'self_reported',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE evidence (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    outcome_id UUID REFERENCES outcomes(id) ON DELETE CASCADE,
    link_url TEXT,
    storage_path TEXT,
    verified_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. PULSE CONVERSATIONS & MESSAGES
CREATE TABLE pulse_conversations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    signal_id UUID REFERENCES world_signals(id) ON DELETE SET NULL,
    persona_tag TEXT, -- 'beginner_internship', 'business_startup', 'advanced_research'
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE pulse_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    conversation_id UUID REFERENCES pulse_conversations(id) ON DELETE CASCADE,
    sender TEXT NOT NULL CHECK (sender IN ('user', 'pulse')),
    content TEXT NOT NULL,
    action_proposals JSONB DEFAULT '[]'::jsonb,
    why_this TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 13. AUDIT & ACTIVITY EVENTS
CREATE TABLE audit_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID,
    event_type TEXT NOT NULL,
    details JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_interests ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE action_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE action_steps ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE outcomes ENABLE ROW LEVEL SECURITY;
ALTER TABLE evidence ENABLE ROW LEVEL SECURITY;
ALTER TABLE pulse_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE pulse_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE opportunities ENABLE ROW LEVEL SECURITY;
ALTER TABLE world_signals ENABLE ROW LEVEL SECURITY;

-- Opportunities & Signals: Read-only for all authenticated & public
CREATE POLICY "Public opportunities view" ON opportunities FOR SELECT USING (true);
CREATE POLICY "Public world signals view" ON world_signals FOR SELECT USING (true);

-- Student data: Strict student isolation
CREATE POLICY "Students manage own profile" ON profiles
    FOR ALL USING (auth.uid() = id);

CREATE POLICY "Students manage own skills" ON student_skills
    FOR ALL USING (auth.uid() = student_id);

CREATE POLICY "Students manage own interests" ON student_interests
    FOR ALL USING (auth.uid() = student_id);

CREATE POLICY "Students manage own goals" ON student_goals
    FOR ALL USING (auth.uid() = student_id);

CREATE POLICY "Students manage own applications" ON applications
    FOR ALL USING (auth.uid() = student_id);

CREATE POLICY "Students manage own tasks" ON tasks
    FOR ALL USING (auth.uid() = student_id);

CREATE POLICY "Students manage own outcomes" ON outcomes
    FOR ALL USING (auth.uid() = student_id);

CREATE POLICY "Students manage own pulse chats" ON pulse_conversations
    FOR ALL USING (auth.uid() = student_id);

-- ==============================================================================
-- INSTITUTION AGGREGATE SECURITY-DEFINER FUNCTION (PRIVACY RULE: COHORT >= 5)
-- ==============================================================================

CREATE OR REPLACE FUNCTION get_institution_aggregates(p_institution_id UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_total_students INT;
    v_result JSONB;
BEGIN
    -- Check total students in institution
    SELECT COUNT(*) INTO v_total_students
    FROM profiles
    WHERE institution_id = p_institution_id;

    -- Privacy Guardrail: Suppress cohort smaller than 5
    IF v_total_students < 5 THEN
        RETURN jsonb_build_object(
            'suppressed', true,
            'message', 'Cohort size is under 5. Aggregate metrics suppressed to preserve student privacy.'
        );
    END IF;

    SELECT jsonb_build_object(
        'suppressed', false,
        'total_students', v_total_students,
        'application_stages', (
            SELECT jsonb_object_agg(stage, count)
            FROM (
                SELECT a.stage, COUNT(*) as count
                FROM applications a
                JOIN profiles p ON a.student_id = p.id
                WHERE p.institution_id = p_institution_id
                GROUP BY a.stage
            ) s
        ),
        'top_skill_gaps', (
            SELECT jsonb_agg(jsonb_build_object('skill', skill_name, 'demand_count', count))
            FROM (
                SELECT os.skill_name, COUNT(*) as count
                FROM opportunity_skills os
                JOIN applications a ON a.opportunity_id = os.opportunity_id
                JOIN profiles p ON a.student_id = p.id
                WHERE p.institution_id = p_institution_id
                GROUP BY os.skill_name
                ORDER BY count DESC
                LIMIT 5
            ) g
        )
    ) INTO v_result;

    RETURN v_result;
END;
$$;
