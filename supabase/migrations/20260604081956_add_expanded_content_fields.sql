/*
  # Add expanded content fields for projects and certificates

  ## Changes

  ### projects table
  - Add `problem_statement` (text) - Problem the project solves
  - Add `solution` (text) - Solution implemented
  - Add `features` (text[]) - Key features list
  - Add `challenges` (text) - Challenges faced
  - Add `key_learnings` (text) - Key learnings from the project
  - Add `project_status` (text) - Status badge (e.g. 'Completed', 'In Progress')
  - Add `metrics` (jsonb) - Key metrics/achievements

  ### certificates table
  - Add `credential_id` (text) - Credential ID
  - Add `description` (text) - Certificate description
  - Add `skills_gained` (text[]) - Skills gained from certification
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'projects' AND column_name = 'problem_statement'
  ) THEN
    ALTER TABLE projects ADD COLUMN problem_statement text DEFAULT '';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'projects' AND column_name = 'solution'
  ) THEN
    ALTER TABLE projects ADD COLUMN solution text DEFAULT '';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'projects' AND column_name = 'features'
  ) THEN
    ALTER TABLE projects ADD COLUMN features text[] DEFAULT '{}';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'projects' AND column_name = 'challenges'
  ) THEN
    ALTER TABLE projects ADD COLUMN challenges text DEFAULT '';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'projects' AND column_name = 'key_learnings'
  ) THEN
    ALTER TABLE projects ADD COLUMN key_learnings text DEFAULT '';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'projects' AND column_name = 'project_status'
  ) THEN
    ALTER TABLE projects ADD COLUMN project_status text DEFAULT 'Completed';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'projects' AND column_name = 'metrics'
  ) THEN
    ALTER TABLE projects ADD COLUMN metrics jsonb DEFAULT '[]';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'certificates' AND column_name = 'credential_id'
  ) THEN
    ALTER TABLE certificates ADD COLUMN credential_id text DEFAULT '';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'certificates' AND column_name = 'description'
  ) THEN
    ALTER TABLE certificates ADD COLUMN description text DEFAULT '';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'certificates' AND column_name = 'skills_gained'
  ) THEN
    ALTER TABLE certificates ADD COLUMN skills_gained text[] DEFAULT '{}';
  END IF;
END $$;
