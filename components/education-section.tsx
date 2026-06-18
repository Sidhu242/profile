'use client';

import { GraduationCap, Calendar } from 'lucide-react';
import { Education } from '@/lib/types';
import SectionHeader from './section-header';

interface EducationSectionProps {
  education: Education[];
}

export default function EducationSection({ education }: EducationSectionProps) {
  if (!education.length) return null;

  return (
    <section id="education" className="section-padding bg-muted/30">
      <div className="container-max">
        <SectionHeader
          label="Education"
          title="Academic Background"
          description="My educational journey and the institutions that shaped my knowledge."
        />

        <div className="mt-12 max-w-3xl mx-auto space-y-6">
          {education.map((edu, index) => (
            <div
              key={edu.id}
              className="relative flex gap-6 group"
            >
              {/* Timeline line */}
              {index < education.length - 1 && (
                <div className="absolute left-6 top-14 bottom-0 w-px bg-border" />
              )}

              {/* Icon */}
              <div className="flex-shrink-0 w-12 h-12 bg-primary/10 border border-primary/20 rounded-xl flex items-center justify-center group-hover:bg-primary/20 transition-colors duration-200 z-10">
                <GraduationCap size={20} className="text-primary" />
              </div>

              {/* Content */}
              <div className="flex-1 bg-card border border-border rounded-xl p-5 hover:border-primary/30 transition-all duration-200 hover:-translate-y-0.5 shadow-sm">
                <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                  <h3 className="text-base font-semibold text-foreground">{edu.degree}</h3>
                  {(edu.duration || edu.start_date) && (
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground bg-muted px-2.5 py-1 rounded-full">
                      <Calendar size={12} />
                      {edu.duration || (edu.start_date ? new Date(edu.start_date).getFullYear() : '')}
                      {edu.end_date ? ` – ${new Date(edu.end_date).getFullYear()}` : ''}
                    </div>
                  )}
                </div>

                <p className="text-primary font-medium text-sm mb-1">{edu.institution}</p>

                {edu.gpa && (
                  <span className="inline-block text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded mb-2">
                    GPA / Marks: {edu.gpa}
                  </span>
                )}

                {edu.description && (
                  <p className="text-muted-foreground text-sm leading-relaxed mt-2">{edu.description}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
