-- ==============================================================================
-- VYBE 2.0: Comprehensive Sample Seed Data
-- 14 Opportunities · 6 World Signals · 3 Personas · Tasks · Applications · Outcomes
-- ==============================================================================

-- 1. INSTITUTION
INSERT INTO institutions (id, name, domain, location) VALUES
('a0000000-0000-0000-0000-000000000001', 'SRM University Delhi-NCR, Sonepat', 'srmuniversity.ac.in', 'Delhi-NCR, India'),
('a0000000-0000-0000-0000-000000000002', 'Indian Institute of Technology Delhi', 'iitd.ac.in', 'New Delhi, India');

-- 2. THREE PROFILES (STUDENT PERSONAS)
-- Persona 1: Beginner wanting an internship
INSERT INTO profiles (id, role, name, email, institution_id, academic_year, department, location, budget_max, availability, preferred_format, is_sample) VALUES
('b0000000-0000-0000-0000-000000000001', 'student', 'Aarav Patel', 'aarav.beginner@srmuniversity.ac.in', 'a0000000-0000-0000-0000-000000000001', '2nd Year', 'Computer Science', 'Delhi-NCR', 1000.00, 'Part-time (5-10 hrs/wk)', 'online', true);

-- Persona 2: Business-minded wanting a startup
INSERT INTO profiles (id, role, name, email, institution_id, academic_year, department, location, budget_max, availability, preferred_format, is_sample) VALUES
('b0000000-0000-0000-0000-000000000002', 'student', 'Riya Sen', 'riya.startup@srmuniversity.ac.in', 'a0000000-0000-0000-0000-000000000001', '3rd Year', 'Business', 'Delhi-NCR', 5000.00, 'Weekends only', 'hybrid', true);

-- Persona 3: Advanced wanting research
INSERT INTO profiles (id, role, name, email, institution_id, academic_year, department, location, budget_max, availability, preferred_format, is_sample) VALUES
('b0000000-0000-0000-0000-000000000003', 'student', 'Kabir Mehta', 'kabir.research@srmuniversity.ac.in', 'a0000000-0000-0000-0000-000000000001', '4th Year', 'Computer Science', 'Delhi-NCR', 10000.00, 'Full-time', 'any', true);

-- Additional staff and admin profiles
INSERT INTO profiles (id, role, name, email, institution_id, academic_year, department, location, is_sample) VALUES
('b0000000-0000-0000-0000-000000000004', 'staff', 'Dr. Anand Prakash', 'staff.anand@srmuniversity.ac.in', 'a0000000-0000-0000-0000-000000000001', 'Faculty', 'Computer Science', 'Delhi-NCR', true),
('b0000000-0000-0000-0000-000000000005', 'admin', 'Ashutosh Singh', 'admin.ashutosh@vybe.app', 'a0000000-0000-0000-0000-000000000001', 'Alum', 'Platform Admin', 'Delhi-NCR', true);

-- 3. STUDENT SKILLS & INTERESTS
-- Aarav: Beginner Python
INSERT INTO student_skills (student_id, skill_name, level) VALUES
('b0000000-0000-0000-0000-000000000001', 'Python', 'Beginner'),
('b0000000-0000-0000-0000-000000000001', 'HTML/CSS', 'Beginner'),
('b0000000-0000-0000-0000-000000000001', 'Git', 'Beginner');

INSERT INTO student_interests (student_id, interest_name) VALUES
('b0000000-0000-0000-0000-000000000001', 'Web Development'),
('b0000000-0000-0000-0000-000000000001', 'AI Agents'),
('b0000000-0000-0000-0000-000000000001', 'Internships');

INSERT INTO student_goals (student_id, primary_goal, target_timeline) VALUES
('b0000000-0000-0000-0000-000000000001', 'internship', 'Summer 2027');

-- Riya: Business & Startup
INSERT INTO student_skills (student_id, skill_name, level) VALUES
('b0000000-0000-0000-0000-000000000002', 'Product Management', 'Intermediate'),
('b0000000-0000-0000-0000-000000000002', 'Figma', 'Intermediate'),
('b0000000-0000-0000-0000-000000000002', 'Pitching', 'Advanced');

INSERT INTO student_interests (student_id, interest_name) VALUES
('b0000000-0000-0000-0000-000000000002', 'Startups'),
('b0000000-0000-0000-0000-000000000002', 'Venture Capital'),
('b0000000-0000-0000-0000-000000000002', 'AI Products');

INSERT INTO student_goals (student_id, primary_goal, target_timeline) VALUES
('b0000000-0000-0000-0000-000000000002', 'startup', 'Next 6 months');

-- Kabir: Advanced Research
INSERT INTO student_skills (student_id, skill_name, level) VALUES
('b0000000-0000-0000-0000-000000000003', 'PyTorch', 'Advanced'),
('b0000000-0000-0000-0000-000000000003', 'Machine Learning', 'Advanced'),
('b0000000-0000-0000-0000-000000000003', 'Distributed Systems', 'Intermediate');

INSERT INTO student_interests (student_id, interest_name) VALUES
('b0000000-0000-0000-0000-000000000003', 'LLM Architectures'),
('b0000000-0000-0000-0000-000000000003', 'Research Labs'),
('b0000000-0000-0000-0000-000000000003', 'Open Source AI');

INSERT INTO student_goals (student_id, primary_goal, target_timeline) VALUES
('b0000000-0000-0000-0000-000000000003', 'research', 'End of academic year');

-- 4. SIX WORLD SIGNALS (GLOBAL TRENDS)
INSERT INTO world_signals (id, title, summary, source_name, source_url, published_at, tags) VALUES
('c0000000-0000-0000-0000-000000000001', 'AI agents start appearing inside everyday apps', 'Autonomous multi-step agents are transitioning from research labs into developer tools and enterprise workspaces, creating massive demand for agent-building skill sets.', 'MIT Tech Review', 'https://technologyreview.com/signals/ai-agents', NOW() - INTERVAL '2 days', ARRAY['AI Agents', 'Automation', 'Python']),
('c0000000-0000-0000-0000-000000000002', 'Small Language Models run on-device and at the edge', 'Efficiency breakthroughs allow 1B to 3B parameter models to run directly on consumer laptops and phones with zero cloud latency.', 'VentureBeat AI', 'https://venturebeat.com/slm-edge-computing', NOW() - INTERVAL '5 days', ARRAY['SLM', 'Edge AI', 'Mobile']),
('c0000000-0000-0000-0000-000000000003', 'Venture funding pivots toward vertical AI agents and workflow automation', 'Early-stage investors are prioritizing specialized industry agents with measurable ROI over generic consumer chat tools.', 'TechCrunch', 'https://techcrunch.com/vertical-ai-funding', NOW() - INTERVAL '7 days', ARRAY['Startups', 'Venture Capital', 'Product']),
('c0000000-0000-0000-0000-000000000004', 'Open-source scientific discovery acceleration through foundational models', 'Global labs publish standardized benchmark suites evaluating reasoning capabilities on biochemical and mathematical synthesis.', 'Nature Machine Intelligence', 'https://nature.com/articles/science-fm-benchmarks', NOW() - INTERVAL '10 days', ARRAY['Research', 'PyTorch', 'Science']),
('c0000000-0000-0000-0000-000000000005', 'Spatial computing and multimodal web experiences expand', 'WebXR and hardware advancements make 3D spatial user interfaces commercially viable in education and engineering simulation.', 'Wired', 'https://wired.com/spatial-web-education', NOW() - INTERVAL '14 days', ARRAY['WebXR', 'Design', 'Front End']),
('c0000000-0000-0000-0000-000000000006', 'Zero-trust cloud infrastructure becomes mandatory in student engineering programs', 'Global security compliance standards lead universities and internships to evaluate security posture from day one.', 'Cloud Security Alliance', 'https://cloudsecurity.org/zero-trust-curriculum', NOW() - INTERVAL '18 days', ARRAY['Security', 'DevOps', 'Cloud']);

-- 5. 14 OPPORTUNITIES (CURATED SAMPLE CATALOGUE)
INSERT INTO opportunities (id, title, organizer, type, source_url, source_status, dates, deadline, cost, format, location, level, eligibility, description, preparation_checklist, status, last_checked_at) VALUES
('d0000000-0000-0000-0000-000000000001', 'Smart India Hackathon 2026', 'Ministry of Education & AICTE', 'Hackathon', 'https://sih.gov.in', 'sourced', 'Dec 15 - Dec 17, 2026', NOW() + INTERVAL '12 days', 0.00, 'hybrid', 'New Delhi & Virtual', 'All Levels', '{"academic_years": ["1st Year", "2nd Year", "3rd Year", "4th Year"], "departments": ["Computer Science", "Engineering", "Design", "Business"], "mandatory_criteria": ["Valid College ID", "Team of 6 students with at least 1 female member"]}'::jsonb, 'Nationwide initiative providing students a platform to solve pressing challenges of ministries, departments, and leading industries.', '[{"task": "Form certified 6-member team", "done": true}, {"task": "Select problem statement from PS portal", "done": true}, {"task": "Submit PPT design prototype", "done": false}, {"task": "Mentor validation review", "done": false}]'::jsonb, 'active', NOW()),

('d0000000-0000-0000-0000-000000000002', 'Google Summer of Code 2027', 'Google Open Source', 'Fellowship', 'https://summerofcode.withgoogle.com', 'sourced', 'May 1 - Aug 30, 2027', NOW() + INTERVAL '45 days', 0.00, 'online', 'Remote / Global', 'Intermediate', '{"academic_years": ["1st Year", "2nd Year", "3rd Year", "4th Year", "Postgraduate"], "departments": ["Computer Science", "Engineering"], "mandatory_criteria": ["Eligible to work in home country", "Active GitHub profile"]}'::jsonb, 'Global online program focused on bringing new contributors into open source software development.', '[{"task": "Explore participating mentoring organizations", "done": true}, {"task": "Submit 2 PRs to target repository", "done": false}, {"task": "Draft proposal document", "done": false}]'::jsonb, 'active', NOW()),

('d0000000-0000-0000-0000-000000000003', 'Prasunex Innovathon 2026: Round 3 Code Storm', 'Prasunex Consortium', 'Hackathon', 'https://prasunex.org/innovathon', 'sourced', 'Nov 28 - Nov 30, 2026', NOW() + INTERVAL '4 days', 0.00, 'hybrid', 'Delhi-NCR & Virtual', 'All Levels', '{"academic_years": ["1st Year", "2nd Year", "3rd Year", "4th Year"], "departments": ["Computer Science", "Engineering", "Business", "Design"], "mandatory_criteria": ["Round 2 shortlisting qualified"]}'::jsonb, 'High-intensity prototype round where shortlisted teams present full-stack web platforms and live architecture demonstrations.', '[{"task": "Finalize implementation plan and schema", "done": true}, {"task": "Verify responsive design system on 390px, 820px, 1280px", "done": true}, {"task": "Rehearse live product loop", "done": false}]'::jsonb, 'active', NOW()),

('d0000000-0000-0000-0000-000000000004', 'Microsoft AI for Good Student Fellowship', 'Microsoft Philanthropies', 'Fellowship', 'https://microsoft.com/ai-for-good-fellowship', 'sourced', 'Jan 15 - Apr 15, 2027', NOW() + INTERVAL '20 days', 0.00, 'online', 'Remote', 'Intermediate', '{"academic_years": ["2nd Year", "3rd Year", "4th Year"], "departments": ["Computer Science", "Data Science"], "mandatory_criteria": ["Prior project in Python or Azure AI"]}'::jsonb, 'Empowering university students to solve sustainability and accessibility challenges using cloud AI tooling.', '[{"task": "Complete Azure AI fundamentals module", "done": true}, {"task": "Prepare case study summary", "done": false}]'::jsonb, 'active', NOW()),

('d0000000-0000-0000-0000-000000000005', 'Antler India Campus Fellowship', 'Antler Global', 'Fellowship', 'https://antler.co/india-campus', 'sourced', 'Feb 1 - May 30, 2027', NOW() + INTERVAL '18 days', 0.00, 'hybrid', 'Bangalore & Hybrid', 'All Levels', '{"academic_years": ["3rd Year", "4th Year", "Postgraduate"], "departments": ["Computer Science", "Business", "Design"], "mandatory_criteria": ["Aspiring founder with an early hypothesis"]}'::jsonb, 'An exclusive pre-idea fellowship for ambitious student founders to build high-scale technology startups.', '[{"task": "Draft 1-page problem statement canvas", "done": true}, {"task": "Conduct 5 customer discovery interviews", "done": false}, {"task": "Record 2-minute founder pitch video", "done": false}]'::jsonb, 'active', NOW()),

('d0000000-0000-0000-0000-000000000006', 'IISc Bangalore Summer Research Internship (SRIP)', 'Indian Institute of Science', 'Research Program', 'https://iisc.ac.in/srip-2027', 'sourced', 'May 15 - Jul 15, 2027', NOW() + INTERVAL '35 days', 0.00, 'onsite', 'Bangalore, India', 'Advanced', '{"academic_years": ["3rd Year", "4th Year"], "departments": ["Computer Science", "Electrical", "Data Science"], "mandatory_criteria": ["Minimum 8.0 CGPA", "Proficiency in Python/C++"]}'::jsonb, 'Work alongside top faculty members on frontier artificial intelligence, distributed systems, and quantum algorithms.', '[{"task": "Obtain recommendation letter from HOD", "done": false}, {"task": "Submit research statement of purpose", "done": false}, {"task": "Share GitHub portfolio of numerical projects", "done": false}]'::jsonb, 'active', NOW()),

('d0000000-0000-0000-0000-000000000007', 'Kaggle Student Grandmaster Incubator', 'Kaggle & Google', 'Research Program', 'https://kaggle.com/student-incubator', 'sourced', 'Jan 10 - Mar 25, 2027', NOW() + INTERVAL '16 days', 0.00, 'online', 'Remote', 'Intermediate', '{"academic_years": ["1st Year", "2nd Year", "3rd Year", "4th Year"], "departments": ["Computer Science", "Data Science"], "mandatory_criteria": ["Rank of Kaggle Expert or 3 public notebooks"]}'::jsonb, 'Mentorship track pairing university data science students with Kaggle Grandmasters on live competitive modeling competitions.', '[{"task": "Publish reproducible EDA notebook", "done": true}, {"task": "Form cross-university competition pair", "done": false}]'::jsonb, 'active', NOW()),

('d0000000-0000-0000-0000-000000000008', 'ETHIndia 2026 Hackathon', 'Devfolio & Ethereum Foundation', 'Hackathon', 'https://ethindia.co', 'sourced', 'Dec 8 - Dec 10, 2026', NOW() + INTERVAL '9 days', 0.00, 'onsite', 'Bangalore, India', 'Intermediate', '{"academic_years": ["1st Year", "2nd Year", "3rd Year", "4th Year"], "departments": ["Computer Science", "Engineering"], "mandatory_criteria": ["Approved Devfolio hacker profile"]}'::jsonb, 'Asias largest Web3 hackathon bringing together over 2000 engineers, designers, and researchers to build decentralized applications.', '[{"task": "Complete Solidity syntax basics", "done": true}, {"task": "Prepare MetaMask testnet deployment wallet", "done": false}]'::jsonb, 'active', NOW()),

('d0000000-0000-0000-0000-000000000009', 'Y Combinator Student Founder Pitch Days', 'Y Combinator', 'Fellowship', 'https://ycombinator.com/students', 'sourced', 'Mar 1 - Mar 3, 2027', NOW() + INTERVAL '50 days', 0.00, 'online', 'Remote', 'All Levels', '{"academic_years": ["2nd Year", "3rd Year", "4th Year"], "departments": ["Business", "Computer Science", "Design"], "mandatory_criteria": ["Working MVP or demonstrable prototype"]}'::jsonb, 'Fast-track pitch session for university student builders directly in front of YC partners.', '[{"task": "Deploy functional demo on custom domain", "done": false}, {"task": "Collect first 10 active student user logs", "done": false}]'::jsonb, 'active', NOW()),

('d0000000-0000-0000-0000-000000000010', 'Stanford High-Performance Computing Workshop', 'Stanford University', 'Conference', 'https://hpc.stanford.edu/workshop-2027', 'unverified', 'Apr 10 - Apr 12, 2027', NOW() + INTERVAL '40 days', 2500.00, 'online', 'Virtual', 'Advanced', '{"academic_years": ["3rd Year", "4th Year", "Postgraduate"], "departments": ["Computer Science"], "mandatory_criteria": ["Knowledge of C/CUDA and Linux kernel"]}'::jsonb, 'Intensive 3-day deep dive into GPU kernel optimizations, distributed training pipelines, and InfiniBand fabrics.', '[{"task": "Review CUDA programming handbook", "done": false}]'::jsonb, 'active', NOW()),

('d0000000-0000-0000-0000-000000000011', 'Unstop National Management League 2026', 'Unstop & IIM Calcutta', 'Hackathon', 'https://unstop.com/management-league', 'sourced', 'Dec 20 - Dec 22, 2026', NOW() + INTERVAL '14 days', 0.00, 'online', 'Remote', 'All Levels', '{"academic_years": ["1st Year", "2nd Year", "3rd Year", "4th Year"], "departments": ["Business", "Design", "Economics"], "mandatory_criteria": ["College enrollment certificate"]}'::jsonb, 'Nationwide case-study competition solving marketing, operations, and growth roadmaps for Fortune 500 brands.', '[{"task": "Review financial model deck", "done": true}, {"task": "Build 10-slide strategy pitch", "done": false}]'::jsonb, 'active', NOW()),

('d0000000-0000-0000-0000-000000000012', 'CERN OpenLab Summer Student Programme', 'CERN', 'Research Program', 'https://openlab.cern/summer-student-programme', 'sourced', 'Jun 1 - Jul 31, 2027', NOW() + INTERVAL '60 days', 0.00, 'onsite', 'Geneva, Switzerland', 'Advanced', '{"academic_years": ["3rd Year", "4th Year"], "departments": ["Computer Science", "Engineering", "Data Science"], "mandatory_criteria": ["Minimum 3 years university study completed by June", "Fluent English"]}'::jsonb, 'Two-month internship at the European Organization for Nuclear Research working with peta-scale physics compute grids.', '[{"task": "Prepare academic transcript", "done": true}, {"task": "Secure 2 academic recommendation letters", "done": false}]'::jsonb, 'active', NOW()),

('d0000000-0000-0000-0000-000000000013', 'Delhi Regional Web Development Camp', 'Delhi Student Developers', 'Hackathon', 'https://delhidevs.org/camp', 'stale', 'Nov 10 - Nov 12, 2026', NOW() - INTERVAL '10 days', 200.00, 'onsite', 'Delhi-NCR', 'Beginner', '{"academic_years": ["1st Year", "2nd Year"], "departments": ["Computer Science"], "mandatory_criteria": ["None"]}'::jsonb, 'A student-led local meetup and coding sprint for beginners to build their first personal websites.', '[{"task": "Install VS Code and Node.js", "done": true}]'::jsonb, 'expired', NOW() - INTERVAL '20 days'),

('d0000000-0000-0000-0000-000000000014', 'Fetch-A-Thon 3.0 Masters Union', 'Masters Union School of Business', 'Hackathon', 'https://unstop.com/fetch-a-thon', 'sourced', 'Nov 1 - Nov 3, 2026', NOW() - INTERVAL '20 days', 0.00, 'hybrid', 'Gurugram & Virtual', 'All Levels', '{"academic_years": ["1st Year", "2nd Year", "3rd Year", "4th Year"], "departments": ["Computer Science", "Business"], "mandatory_criteria": ["Team participation verified"]}'::jsonb, 'Fintech and AI innovation hackathon focused on autonomous execution and financial technology solutions.', '[{"task": "Submitted MVP", "done": true}]'::jsonb, 'expired', NOW() - INTERVAL '25 days');

-- 6. OPPORTUNITY SKILLS TAGS
INSERT INTO opportunity_skills (opportunity_id, skill_name, is_prerequisite) VALUES
('d0000000-0000-0000-0000-000000000001', 'Python', false),
('d0000000-0000-0000-0000-000000000001', 'Web Development', false),
('d0000000-0000-0000-0000-000000000001', 'System Design', false),
('d0000000-0000-0000-0000-000000000002', 'Git', true),
('d0000000-0000-0000-0000-000000000002', 'Python', false),
('d0000000-0000-0000-0000-000000000003', 'Next.js', true),
('d0000000-0000-0000-0000-000000000003', 'TypeScript', true),
('d0000000-0000-0000-0000-000000000003', 'Tailwind CSS', false),
('d0000000-0000-0000-0000-000000000004', 'Python', true),
('d0000000-0000-0000-0000-000000000004', 'AI Agents', false),
('d0000000-0000-0000-0000-000000000005', 'Product Management', true),
('d0000000-0000-0000-0000-000000000005', 'Pitching', true),
('d0000000-0000-0000-0000-000000000006', 'PyTorch', true),
('d0000000-0000-0000-0000-000000000006', 'Distributed Systems', false);
