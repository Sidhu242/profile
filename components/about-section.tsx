'use client';

import { MapPin, GraduationCap, Target, Sparkles } from 'lucide-react';
import { Profile } from '@/lib/types';
import SectionHeader from './section-header';

interface AboutSectionProps {
  profile: Profile | null;
}

export default function AboutSection({ profile }: AboutSectionProps) {
  if (!profile) return null;

  const infoItems = [
    { icon: GraduationCap, label: 'Education', value: profile.education_level || profile.university },
    { icon: MapPin, label: 'Location', value: profile.location },
    { icon: Target, label: 'University', value: profile.university },
  ].filter((item) => item.value);

  return (
    <section id="about" className="section-padding">
      <div className="container-max">
        <SectionHeader
          label="About Me"
          title="A bit about who I am"
          description="Get to know my background, goals, and what drives me every day."
        />

        <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Left: Bio and objective */}
          <div className="space-y-6">
            {(profile.bio || profile.summary) && (
              <div className="bg-card border border-border rounded-xl p-6">
                <p className="text-muted-foreground leading-relaxed text-base">
                  {profile.bio || profile.summary}
                </p>
              </div>
            )}

            {profile.career_objective && (
              <div className="bg-card border border-border rounded-xl p-6">
                <div className="flex items-center gap-2 mb-3">
                  <Target size={16} className="text-primary" />
                  <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">Career Objective</h3>
                </div>
                <p className="text-muted-foreground leading-relaxed text-sm">
                  {profile.career_objective}
                </p>
              </div>
            )}
          </div>

          {/* Right: Info cards + interests */}
          <div className="space-y-4">
            {infoItems.map(({ icon: Icon, label, value }) => (
              <div
                key={label}
                className="flex items-center gap-4 bg-card border border-border rounded-xl p-4 hover:border-primary/30 transition-colors duration-200"
              >
                <div className="flex-shrink-0 w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Icon size={18} className="text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">{label}</p>
                  <p className="text-foreground font-medium text-sm mt-0.5">{value}</p>
                </div>
              </div>
            ))}

            {profile.interests && profile.interests.length > 0 && (
              <div className="bg-card border border-border rounded-xl p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles size={16} className="text-primary" />
                  <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Interests</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {profile.interests.map((interest) => (
                    <span
                      key={interest}
                      className="px-2.5 py-1 text-xs bg-primary/10 text-primary border border-primary/20 rounded-full font-medium"
                    >
                      {interest}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
