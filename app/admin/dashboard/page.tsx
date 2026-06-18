'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import {
  LogOut, User, GraduationCap, Code, FolderOpen, Award,
  Briefcase, FileText, MessageSquare, Eye, Plus, Trash2, Edit3,
  BarChart3, Users, Mail, TrendingUp, CheckCircle
} from 'lucide-react';
import ProfileForm from '@/components/admin/profile-form';
import EducationManager from '@/components/admin/education-manager';
import SkillsManager from '@/components/admin/skills-manager';
import ProjectsManager from '@/components/admin/projects-manager';
import CertificatesManager from '@/components/admin/certificates-manager';
import ExperienceManager from '@/components/admin/experience-manager';
import ResumeManager from '@/components/admin/resume-manager';
import ContactsManager from '@/components/admin/contacts-manager';

type Tab = 'dashboard' | 'profile' | 'education' | 'skills' | 'projects' | 'certificates' | 'experience' | 'resume' | 'contacts';

const tabs = [
  { id: 'dashboard' as Tab, label: 'Dashboard', icon: BarChart3 },
  { id: 'profile' as Tab, label: 'Profile', icon: User },
  { id: 'education' as Tab, label: 'Education', icon: GraduationCap },
  { id: 'skills' as Tab, label: 'Skills', icon: Code },
  { id: 'projects' as Tab, label: 'Projects', icon: FolderOpen },
  { id: 'certificates' as Tab, label: 'Certificates', icon: Award },
  { id: 'experience' as Tab, label: 'Experience', icon: Briefcase },
  { id: 'resume' as Tab, label: 'Resume', icon: FileText },
  { id: 'contacts' as Tab, label: 'Contacts', icon: MessageSquare },
];

interface Stats {
  visitors: number;
  projects: number;
  skills: number;
  messages: number;
  unreadMessages: number;
}

export default function DashboardPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [stats, setStats] = useState<Stats>({ visitors: 0, projects: 0, skills: 0, messages: 0, unreadMessages: 0 });
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        router.replace('/admin');
      } else {
        setCheckingAuth(false);
        loadStats();
      }
    });
  }, [router]);

  const loadStats = async () => {
    const [
      { count: visitors },
      { count: projects },
      { count: skills },
      { count: messages },
      { count: unread },
    ] = await Promise.all([
      supabase.from('visitors').select('*', { count: 'exact', head: true }),
      supabase.from('projects').select('*', { count: 'exact', head: true }),
      supabase.from('skills').select('*', { count: 'exact', head: true }),
      supabase.from('contacts').select('*', { count: 'exact', head: true }),
      supabase.from('contacts').select('*', { count: 'exact', head: true }).eq('is_read', false),
    ]);

    setStats({
      visitors: visitors ?? 0,
      projects: projects ?? 0,
      skills: skills ?? 0,
      messages: messages ?? 0,
      unreadMessages: unread ?? 0,
    });
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/admin');
  };

  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  const statCards = [
    { label: 'Total Visitors', value: stats.visitors, icon: TrendingUp, color: 'text-sky-500', bg: 'bg-sky-500/10' },
    { label: 'Projects', value: stats.projects, icon: FolderOpen, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
    { label: 'Skills', value: stats.skills, icon: Code, color: 'text-amber-500', bg: 'bg-amber-500/10' },
    { label: 'Messages', value: stats.messages, icon: Mail, color: 'text-rose-500', bg: 'bg-rose-500/10', badge: stats.unreadMessages > 0 ? stats.unreadMessages : undefined },
  ];

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-60 bg-card border-r border-border flex flex-col
        transition-transform duration-300 lg:translate-x-0 lg:static lg:z-auto
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex items-center gap-2 px-4 py-5 border-b border-border">
          <span className="text-base font-bold text-foreground">
            <span className="text-primary">&lt;</span>Admin<span className="text-primary">/&gt;</span>
          </span>
        </div>

        <nav className="flex-1 px-2 py-3 space-y-0.5 overflow-y-auto">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => { setActiveTab(id); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                activeTab === id
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
            >
              <Icon size={16} />
              {label}
              {id === 'contacts' && stats.unreadMessages > 0 && (
                <span className="ml-auto bg-rose-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-semibold">
                  {stats.unreadMessages}
                </span>
              )}
            </button>
          ))}
        </nav>

        <div className="p-3 border-t border-border">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all duration-200"
          >
            <LogOut size={16} />
            Sign Out
          </button>
          <a
            href="/"
            target="_blank"
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-all duration-200 mt-0.5"
          >
            <Eye size={16} />
            View Portfolio
          </a>
        </div>
      </aside>

      {/* Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="bg-card border-b border-border px-4 sm:px-6 h-14 flex items-center justify-between shrink-0">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 rounded-lg text-muted-foreground hover:bg-muted transition-colors"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
          <h1 className="text-sm font-semibold text-foreground capitalize">
            {activeTab === 'dashboard' ? 'Dashboard Overview' : activeTab}
          </h1>
          <div className="w-8" />
        </header>

        {/* Content */}
        <main className="flex-1 overflow-auto p-4 sm:p-6">
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {statCards.map(({ label, value, icon: Icon, color, bg, badge }) => (
                  <div key={label} className="bg-card border border-border rounded-xl p-4 hover:border-primary/30 transition-colors">
                    <div className="flex items-start justify-between mb-3">
                      <div className={`w-9 h-9 ${bg} rounded-lg flex items-center justify-center`}>
                        <Icon size={16} className={color} />
                      </div>
                      {badge !== undefined && (
                        <span className="text-xs bg-rose-500 text-white px-1.5 py-0.5 rounded-full font-semibold">
                          {badge} new
                        </span>
                      )}
                    </div>
                    <p className="text-2xl font-bold text-foreground">{value.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
                  </div>
                ))}
              </div>

              <div className="bg-card border border-border rounded-xl p-5">
                <h2 className="text-sm font-semibold text-foreground mb-4">Quick Actions</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                  {[
                    { label: 'Edit Profile', tab: 'profile' as Tab, icon: User },
                    { label: 'Add Project', tab: 'projects' as Tab, icon: Plus },
                    { label: 'Add Skill', tab: 'skills' as Tab, icon: Code },
                    { label: 'View Messages', tab: 'contacts' as Tab, icon: MessageSquare },
                  ].map(({ label, tab, icon: Icon }) => (
                    <button
                      key={label}
                      onClick={() => setActiveTab(tab)}
                      className="flex items-center gap-2 p-3 rounded-lg border border-border text-sm text-muted-foreground hover:text-foreground hover:border-primary/30 hover:bg-primary/5 transition-all duration-200"
                    >
                      <Icon size={15} className="text-primary" />
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'profile' && <ProfileForm />}
          {activeTab === 'education' && <EducationManager />}
          {activeTab === 'skills' && <SkillsManager />}
          {activeTab === 'projects' && <ProjectsManager />}
          {activeTab === 'certificates' && <CertificatesManager />}
          {activeTab === 'experience' && <ExperienceManager />}
          {activeTab === 'resume' && <ResumeManager />}
          {activeTab === 'contacts' && <ContactsManager />}
        </main>
      </div>
    </div>
  );
}
