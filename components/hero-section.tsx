'use client';

import { Download, Mail, FolderOpen, Github, Linkedin, MapPin } from 'lucide-react';
import { Profile } from '@/lib/types';
import Image from 'next/image';

interface HeroSectionProps {
  profile: Profile | null;
}

export default function HeroSection({ profile }: HeroSectionProps) {
  const scrollTo = (id: string) => {
    document.querySelector(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Background grid */}
      <div
        className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]"
        style={{
          backgroundImage: `linear-gradient(hsl(var(--border)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--border)) 1px, transparent 1px)`,
          backgroundSize: '48px 48px',
        }}
      />

      {/* Accent glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-primary/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 pt-28">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          {/* Text content */}
          <div className="flex-1 text-center lg:text-left">
            <div className="animate-fade-in">
              <span className="inline-block px-3 py-1 text-xs font-medium text-primary border border-primary/30 rounded-full mb-6 bg-primary/5">
                Available for work
              </span>
            </div>

            <h1 className="animate-fade-in animation-delay-100 text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground mb-4">
              {profile?.full_name || 'Your Name'}
            </h1>

            <p className="animate-fade-in animation-delay-200 text-xl sm:text-2xl font-medium text-primary mb-6">
              {profile?.title || 'Data Analyst & Web Developer'}
            </p>

            <p className="animate-fade-in animation-delay-300 text-base sm:text-lg text-muted-foreground max-w-xl mx-auto lg:mx-0 mb-4 leading-relaxed">
              {profile?.summary || 'Passionate about turning data into insights and building elegant web experiences that make a difference.'}
            </p>

            {profile?.location && (
              <div className="animate-fade-in animation-delay-400 flex items-center justify-center lg:justify-start gap-1.5 text-sm text-muted-foreground mb-8">
                <MapPin size={14} className="text-primary" />
                {profile.location}
              </div>
            )}

            <div className="animate-fade-in animation-delay-400 flex flex-wrap gap-3 justify-center lg:justify-start mb-8">
              <button
                onClick={() => scrollTo('#projects')}
                className="flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-lg font-medium text-sm hover:bg-primary/90 transition-all duration-200 hover:-translate-y-0.5 shadow-lg shadow-primary/20"
              >
                <FolderOpen size={16} />
                View Projects
              </button>
              <button
                onClick={() => scrollTo('#contact')}
                className="flex items-center gap-2 px-5 py-2.5 border border-border text-foreground rounded-lg font-medium text-sm hover:bg-muted hover:border-primary/50 transition-all duration-200 hover:-translate-y-0.5"
              >
                <Mail size={16} />
                Contact Me
              </button>
              {profile?.resume_url && (
                <a
                  href={profile.resume_url}
                  download
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-5 py-2.5 border border-border text-foreground rounded-lg font-medium text-sm hover:bg-muted hover:border-primary/50 transition-all duration-200 hover:-translate-y-0.5"
                >
                  <Download size={16} />
                  Resume
                </a>
              )}
            </div>

            {/* Social links */}
            <div className="animate-fade-in animation-delay-500 flex items-center gap-4 justify-center lg:justify-start">
              {profile?.github_url && (
                <a
                  href={profile.github_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-all duration-200"
                  aria-label="GitHub"
                >
                  <Github size={20} />
                </a>
              )}
              {profile?.linkedin_url && (
                <a
                  href={profile.linkedin_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-all duration-200"
                  aria-label="LinkedIn"
                >
                  <Linkedin size={20} />
                </a>
              )}
              {profile?.email && (
                <a
                  href={`mailto:${profile.email}`}
                  className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-all duration-200"
                  aria-label="Email"
                >
                  <Mail size={20} />
                </a>
              )}
            </div>
          </div>

          {/* Profile image */}
          <div className="animate-scale-in animation-delay-200 flex-shrink-0">
            <div className="relative w-56 h-56 sm:w-72 sm:h-72">
              {/* Ring decoration */}
              <div className="absolute inset-0 rounded-full border-2 border-primary/20 scale-110" />
              <div className="absolute inset-0 rounded-full border border-primary/10 scale-125" />

              <div className="w-full h-full rounded-full overflow-hidden bg-muted border-2 border-border shadow-2xl">
                {profile?.profile_image_url ? (
                  <Image
                    src={profile.profile_image_url}
                    alt={profile.full_name}
                    width={288}
                    height={288}
                    className="w-full h-full object-cover"
                    priority
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-muted">
                    <span className="text-6xl sm:text-8xl font-bold text-primary/30 select-none">
                      {(profile?.full_name || 'P').charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
              </div>

              {/* Status badge */}
              <div className="absolute bottom-2 right-2 flex items-center gap-1.5 bg-card border border-border rounded-full px-2.5 py-1 shadow-lg">
                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                <span className="text-xs text-muted-foreground font-medium">Open to work</span>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 opacity-40">
          <span className="text-xs text-muted-foreground">Scroll</span>
          <div className="w-px h-8 bg-border" />
        </div>
      </div>
    </section>
  );
}
