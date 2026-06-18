'use client';

import { Briefcase, Calendar, MapPin } from 'lucide-react';
import { Experience } from '@/lib/types';
import SectionHeader from './section-header';

interface ExperienceSectionProps {
  experience: Experience[];
}

export default function ExperienceSection({ experience }: ExperienceSectionProps) {
  if (!experience.length) return null;

  return (
    <section id="experience" className="section-padding bg-muted/30">
      <div className="container-max">
        <SectionHeader
          label="Experience"
          title="Work History"
          description="My professional journey and the roles that have shaped my career."
        />

        <div className="mt-12 max-w-3xl mx-auto space-y-6">
          {experience.map((exp, index) => (
            <div key={exp.id} className="relative flex gap-6 group">
              {/* Timeline line */}
              {index < experience.length - 1 && (
                <div className="absolute left-6 top-14 bottom-0 w-px bg-border" />
              )}

              {/* Icon */}
              <div className="flex-shrink-0 w-12 h-12 bg-primary/10 border border-primary/20 rounded-xl flex items-center justify-center z-10 group-hover:bg-primary/20 transition-colors duration-200">
                <Briefcase size={18} className="text-primary" />
              </div>

              {/* Content */}
              <div className="flex-1 bg-card border border-border rounded-xl p-5 hover:border-primary/30 hover:-translate-y-0.5 transition-all duration-200 shadow-sm">
                <div className="flex flex-wrap items-start justify-between gap-2 mb-1">
                  <h3 className="text-base font-semibold text-foreground">{exp.role}</h3>
                  <div className="flex flex-wrap gap-2">
                    {exp.is_current && (
                      <span className="text-xs bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 px-2 py-0.5 rounded-full font-medium">
                        Current
                      </span>
                    )}
                    {(exp.duration || exp.start_date) && (
                      <div className="flex items-center gap-1 text-xs text-muted-foreground bg-muted px-2.5 py-1 rounded-full">
                        <Calendar size={11} />
                        {exp.duration ||
                          `${exp.start_date ? new Date(exp.start_date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : ''} ${
                            exp.is_current ? '– Present' : exp.end_date ? `– ${new Date(exp.end_date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}` : ''
                          }`}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 mb-3">
                  <p className="text-primary font-medium text-sm">{exp.company}</p>
                  {exp.location && (
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <MapPin size={11} />
                      {exp.location}
                    </div>
                  )}
                </div>

                {exp.description && (
                  <p className="text-muted-foreground text-sm leading-relaxed">{exp.description}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
