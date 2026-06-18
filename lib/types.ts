export interface Profile {
  id: string;
  full_name: string;
  title: string;
  summary: string;
  bio: string;
  location: string;
  university: string;
  education_level: string;
  career_objective: string;
  interests: string[];
  email: string;
  linkedin_url: string;
  github_url: string;
  twitter_url: string;
  profile_image_url: string;
  resume_url: string;
  created_at: string;
  updated_at: string;
}

export interface Education {
  id: string;
  degree: string;
  institution: string;
  duration: string;
  start_date: string | null;
  end_date: string | null;
  gpa: string;
  description: string;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface Skill {
  id: string;
  name: string;
  category: string;
  proficiency: number;
  icon: string;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  cover_image_url: string;
  technologies: string[];
  github_url: string;
  live_url: string;
  project_date: string | null;
  featured: boolean;
  sort_order: number;
  problem_statement: string;
  solution: string;
  features: string[];
  challenges: string;
  key_learnings: string;
  project_status: string;
  metrics: MetricItem[];
  created_at: string;
  updated_at: string;
}

export interface MetricItem {
  label: string;
  value: string;
}

export interface Certificate {
  id: string;
  name: string;
  issuer: string;
  issue_date: string | null;
  expiry_date: string | null;
  credential_url: string;
  credential_id: string;
  image_url: string;
  description: string;
  skills_gained: string[];
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface Experience {
  id: string;
  role: string;
  company: string;
  duration: string;
  start_date: string | null;
  end_date: string | null;
  is_current: boolean;
  description: string;
  location: string;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface Resume {
  id: string;
  file_url: string;
  file_name: string;
  uploaded_at: string;
  is_active: boolean;
  created_at: string;
}

export interface Contact {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  is_read: boolean;
  created_at: string;
}
