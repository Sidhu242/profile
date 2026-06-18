import { supabase } from '@/lib/supabase';
import Navbar from '@/components/navbar';
import HeroSection from '@/components/hero-section';
import AboutSection from '@/components/about-section';
import EducationSection from '@/components/education-section';
import dynamic from 'next/dynamic';
const SkillsSection = dynamic(() => import('@/components/skills-section'), { ssr: false });
import ProjectsSection from '@/components/projects-section';
import CertificationsSection from '@/components/certifications-section';
import ExperienceSection from '@/components/experience-section';
import ResumeSection from '@/components/resume-section';
import ContactSection from '@/components/contact-section';
import Footer from '@/components/footer';
import VisitorCounter from '@/components/visitor-counter';

async function getPortfolioData() {
  const [
    { data: profiles },
    { data: education },
    { data: projects },
    { data: certificates },
    { data: experience },
    { data: resumes },
  ] = await Promise.all([
    supabase.from('profiles').select('*').limit(1),
    supabase.from('education').select('*').order('sort_order').order('start_date', { ascending: false }),
    supabase.from('projects').select('*').order('sort_order').order('project_date', { ascending: false }),
    supabase.from('certificates').select('*').order('sort_order').order('issue_date', { ascending: false }),
    supabase.from('experience').select('*').order('sort_order').order('start_date', { ascending: false }),
    supabase.from('resume').select('*').eq('is_active', true).order('uploaded_at', { ascending: false }).limit(1),
  ]);

  return {
    profile: profiles?.[0] ?? null,
    education: education ?? [],
    projects: projects ?? [],
    certificates: certificates ?? [],
    experience: experience ?? [],
    resume: resumes?.[0] ?? null,
  };
}

export default async function Home() {
  const data = await getPortfolioData();

  return (
    <main className="min-h-screen bg-background">
      <VisitorCounter />
      <Navbar />
      <HeroSection profile={data.profile} />
      <AboutSection profile={data.profile} />
      <EducationSection education={data.education} />
      <SkillsSection />
      <ProjectsSection projects={data.projects} />
      <CertificationsSection certificates={data.certificates} />
      <ExperienceSection experience={data.experience} />
      <ResumeSection resume={data.resume} />
      <ContactSection profile={data.profile} />
      <Footer profile={data.profile} />
    </main>
  );
}
