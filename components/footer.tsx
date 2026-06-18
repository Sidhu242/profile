'use client';

import { Github, Linkedin, Mail, Twitter } from 'lucide-react';
import { Profile } from '@/lib/types';

interface FooterProps {
  profile: Profile | null;
}

export default function Footer({ profile }: FooterProps) {
  const year = new Date().getFullYear();

  const navLinks = [
    { label: 'About', href: '#about' },
    { label: 'Skills', href: '#skills' },
    { label: 'Projects', href: '#projects' },
    { label: 'Contact', href: '#contact' },
  ];

  const socialLinks = [
    { icon: Github, href: profile?.github_url, label: 'GitHub' },
    { icon: Linkedin, href: profile?.linkedin_url, label: 'LinkedIn' },
    { icon: Mail, href: profile?.email ? `mailto:${profile.email}` : undefined, label: 'Email' },
    { icon: Twitter, href: profile?.twitter_url, label: 'Twitter' },
  ].filter((l) => l.href);

  const handleNav = (href: string) => {
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer className="border-t border-border bg-card">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col items-center gap-6">
          {/* Brand */}
          <a
            href="#hero"
            onClick={(e) => { e.preventDefault(); handleNav('#hero'); }}
            className="text-lg font-bold tracking-tight hover:text-primary transition-colors"
          >
            <span className="text-primary">&lt;</span>Portfolio<span className="text-primary">/&gt;</span>
          </a>

          {/* Nav links */}
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2">
            {navLinks.map((link) => (
              <button
                key={link.href}
                onClick={() => handleNav(link.href)}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                {link.label}
              </button>
            ))}
          </div>

          {/* Social icons */}
          <div className="flex items-center gap-3">
            {socialLinks.map(({ icon: Icon, href, label }) => (
              <a
                key={label}
                href={href}
                target={label !== 'Email' ? '_blank' : undefined}
                rel="noopener noreferrer"
                aria-label={label}
                className="w-9 h-9 flex items-center justify-center rounded-lg border border-border text-muted-foreground hover:text-foreground hover:border-primary/40 hover:bg-primary/5 transition-all duration-200"
              >
                <Icon size={16} />
              </a>
            ))}
          </div>

          {/* Copyright */}
          <p className="text-xs text-muted-foreground text-center">
            &copy; {year} {profile?.full_name || 'Portfolio'}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
