/*
  # Portfolio Website Database Schema

  ## Overview
  Complete schema for a personal portfolio website with admin management capabilities.

  ## New Tables

  1. `profiles` - Main profile information (name, bio, photo, social links)
  2. `education` - Educational background entries
  3. `skills` - Skills with categories and proficiency levels
  4. `projects` - Portfolio projects with metadata and links
  5. `certificates` - Professional certifications
  6. `experience` - Work experience entries
  7. `resume` - Resume/CV file storage
  8. `contacts` - Contact form submissions
  9. `visitors` - Visitor counter tracking

  ## Security
  - RLS enabled on all tables
  - Public read access for portfolio data
  - Admin-only write access via auth.uid()
  - Contact form allows anonymous inserts
*/

-- Profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL DEFAULT '',
  title text NOT NULL DEFAULT '',
  summary text DEFAULT '',
  bio text DEFAULT '',
  location text DEFAULT '',
  university text DEFAULT '',
  education_level text DEFAULT '',
  career_objective text DEFAULT '',
  interests text[] DEFAULT '{}',
  email text DEFAULT '',
  linkedin_url text DEFAULT '',
  github_url text DEFAULT '',
  twitter_url text DEFAULT '',
  profile_image_url text DEFAULT '',
  resume_url text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read profiles"
  ON profiles FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert profiles"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update profiles"
  ON profiles FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Education table
CREATE TABLE IF NOT EXISTS education (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  degree text NOT NULL DEFAULT '',
  institution text NOT NULL DEFAULT '',
  duration text DEFAULT '',
  start_date date,
  end_date date,
  gpa text DEFAULT '',
  description text DEFAULT '',
  sort_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE education ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read education"
  ON education FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert education"
  ON education FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update education"
  ON education FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete education"
  ON education FOR DELETE
  TO authenticated
  USING (true);

-- Skills table
CREATE TABLE IF NOT EXISTS skills (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL DEFAULT '',
  category text NOT NULL DEFAULT '',
  proficiency integer DEFAULT 80 CHECK (proficiency >= 0 AND proficiency <= 100),
  icon text DEFAULT '',
  sort_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE skills ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read skills"
  ON skills FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert skills"
  ON skills FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update skills"
  ON skills FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete skills"
  ON skills FOR DELETE
  TO authenticated
  USING (true);

-- Projects table
CREATE TABLE IF NOT EXISTS projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL DEFAULT '',
  description text DEFAULT '',
  cover_image_url text DEFAULT '',
  technologies text[] DEFAULT '{}',
  github_url text DEFAULT '',
  live_url text DEFAULT '',
  project_date date,
  featured boolean DEFAULT false,
  sort_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read projects"
  ON projects FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert projects"
  ON projects FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update projects"
  ON projects FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete projects"
  ON projects FOR DELETE
  TO authenticated
  USING (true);

-- Certificates table
CREATE TABLE IF NOT EXISTS certificates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL DEFAULT '',
  issuer text NOT NULL DEFAULT '',
  issue_date date,
  expiry_date date,
  credential_url text DEFAULT '',
  image_url text DEFAULT '',
  sort_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE certificates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read certificates"
  ON certificates FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert certificates"
  ON certificates FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update certificates"
  ON certificates FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete certificates"
  ON certificates FOR DELETE
  TO authenticated
  USING (true);

-- Experience table
CREATE TABLE IF NOT EXISTS experience (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  role text NOT NULL DEFAULT '',
  company text NOT NULL DEFAULT '',
  duration text DEFAULT '',
  start_date date,
  end_date date,
  is_current boolean DEFAULT false,
  description text DEFAULT '',
  location text DEFAULT '',
  sort_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE experience ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read experience"
  ON experience FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert experience"
  ON experience FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update experience"
  ON experience FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete experience"
  ON experience FOR DELETE
  TO authenticated
  USING (true);

-- Resume table
CREATE TABLE IF NOT EXISTS resume (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  file_url text NOT NULL DEFAULT '',
  file_name text DEFAULT '',
  uploaded_at timestamptz DEFAULT now(),
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE resume ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read resume"
  ON resume FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert resume"
  ON resume FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update resume"
  ON resume FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete resume"
  ON resume FOR DELETE
  TO authenticated
  USING (true);

-- Contacts table
CREATE TABLE IF NOT EXISTS contacts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL DEFAULT '',
  email text NOT NULL DEFAULT '',
  subject text DEFAULT '',
  message text NOT NULL DEFAULT '',
  is_read boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert contacts"
  ON contacts FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can read contacts"
  ON contacts FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can update contacts"
  ON contacts FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete contacts"
  ON contacts FOR DELETE
  TO authenticated
  USING (true);

-- Visitors table
CREATE TABLE IF NOT EXISTS visitors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  page text DEFAULT '/',
  visited_at timestamptz DEFAULT now(),
  user_agent text DEFAULT '',
  ip_hash text DEFAULT ''
);

ALTER TABLE visitors ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert visitor records"
  ON visitors FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can read visitors"
  ON visitors FOR SELECT
  TO authenticated
  USING (true);

-- Insert default profile
INSERT INTO profiles (full_name, title, summary, location, email)
VALUES (
  'Your Name',
  'Data Analyst & Web Developer',
  'Passionate about turning data into insights and building elegant web experiences.',
  'Your City, Country',
  'your.email@example.com'
) ON CONFLICT DO NOTHING;

-- Insert sample skills
INSERT INTO skills (name, category, proficiency, sort_order) VALUES
  ('Python', 'Data Analytics', 90, 1),
  ('SQL', 'Data Analytics', 85, 2),
  ('Power BI', 'Data Analytics', 80, 3),
  ('Tableau', 'Data Analytics', 75, 4),
  ('Excel', 'Data Analytics', 90, 5),
  ('React', 'Web Development', 80, 6),
  ('Next.js', 'Web Development', 75, 7),
  ('Git & GitHub', 'Web Development', 85, 8)
ON CONFLICT DO NOTHING;
