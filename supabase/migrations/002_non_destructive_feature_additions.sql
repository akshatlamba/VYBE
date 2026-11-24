-- ==============================================================================
-- VYBE Migration 002: Non-Destructive Feature Additions
-- Target Environment: PostgreSQL / Supabase
--
-- PURPOSE:
-- Adds optional metadata columns for:
-- 1. Supabase Auth user mapping (auth_user_id)
-- 2. Structured Student DNA parameters (academic year, department, budget, etc.)
-- 3. Application Tracker workflow stages on event_watchlist
-- 4. Proof-of-Growth verification state on projects & evidence
--
-- CRITICAL SAFETY RULES:
-- - ALL statements use `ADD COLUMN IF NOT EXISTS`.
-- - ZERO tables dropped or recreated.
-- - ZERO existing integer IDs altered.
-- - Compatible with all 9 existing tables and existing student records.
-- - DO NOT run automatically in production. Apply via Supabase SQL Editor manually.
-- ==============================================================================

-- 1. Map Supabase Auth (UUID string) to existing integer Student record
ALTER TABLE students 
ADD COLUMN IF NOT EXISTS auth_user_id VARCHAR(64);

CREATE INDEX IF NOT EXISTS idx_students_auth_user_id ON students(auth_user_id);

-- 2. Structured Student DNA parameters on student_profiles
ALTER TABLE student_profiles 
ADD COLUMN IF NOT EXISTS academic_year VARCHAR(50);

ALTER TABLE student_profiles 
ADD COLUMN IF NOT EXISTS department VARCHAR(100);

ALTER TABLE student_profiles 
ADD COLUMN IF NOT EXISTS location VARCHAR(150);

ALTER TABLE student_profiles 
ADD COLUMN IF NOT EXISTS availability VARCHAR(100);

ALTER TABLE student_profiles 
ADD COLUMN IF NOT EXISTS budget_max INTEGER DEFAULT 0;

ALTER TABLE student_profiles 
ADD COLUMN IF NOT EXISTS preferred_format VARCHAR(50) DEFAULT 'any';

ALTER TABLE student_profiles 
ADD COLUMN IF NOT EXISTS interests TEXT;

-- 3. Action Tracker stages on event_watchlist
-- Valid stages: 'saved', 'preparing', 'applied', 'done', 'attended', 'withdrawn'
ALTER TABLE event_watchlist 
ADD COLUMN IF NOT EXISTS stage VARCHAR(30) DEFAULT 'saved';

ALTER TABLE event_watchlist 
ADD COLUMN IF NOT EXISTS notes TEXT;

-- 4. Growth Passport honest verification status
-- Valid states: 'self_reported', 'link_supported', 'verified'
ALTER TABLE projects 
ADD COLUMN IF NOT EXISTS verification_status VARCHAR(30) DEFAULT 'self_reported';

ALTER TABLE project_evidence 
ADD COLUMN IF NOT EXISTS verification_status VARCHAR(30) DEFAULT 'link_supported';
