'use client';

import { Download, FileText, Calendar } from 'lucide-react';
import { Resume } from '@/lib/types';
import SectionHeader from './section-header';

interface ResumeSectionProps {
  resume: Resume | null;
}

export default function ResumeSection({ resume }: ResumeSectionProps) {
  return (
    <section id="resume" className="section-padding">
      <div className="container-max">
        <SectionHeader
          label="Resume"
          title="My Resume"
          description="Download my resume to learn more about my skills and experience."
        />

        <div className="mt-10 flex justify-center">
          <div className="w-full max-w-md bg-card border border-border rounded-xl p-8 text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-5">
              <FileText size={28} className="text-primary" />
            </div>

            <h3 className="text-lg font-semibold text-foreground mb-1">
              {resume?.file_name || 'Resume.pdf'}
            </h3>

            {resume?.uploaded_at && (
              <div className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground mb-6">
                <Calendar size={12} />
                Last updated:{' '}
                {new Date(resume.uploaded_at).toLocaleDateString('en-US', {
                  month: 'long',
                  year: 'numeric',
                })}
              </div>
            )}

            {!resume?.uploaded_at && (
              <p className="text-sm text-muted-foreground mb-6">
                Resume available upon request.
              </p>
            )}

            {resume?.file_url ? (
              <a
                href={resume.file_url}
                download
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-primary text-primary-foreground rounded-lg font-medium text-sm hover:bg-primary/90 transition-all duration-200 hover:-translate-y-0.5 shadow-lg shadow-primary/20"
              >
                <Download size={16} />
                Download Resume
              </a>
            ) : (
              <button
                disabled
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-muted text-muted-foreground rounded-lg font-medium text-sm cursor-not-allowed"
              >
                <Download size={16} />
                Not Available Yet
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
