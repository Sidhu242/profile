'use client';

import { useState, useCallback } from 'react';
import { ExternalLink, Github, Search, Star, Calendar, ChevronRight, Lightbulb, Target, Zap, BookOpen, TrendingUp } from 'lucide-react';
import { Project, MetricItem } from '@/lib/types';
import SectionHeader from './section-header';
import Modal, { ModalCloseButton } from '@/components/ui/modal';
import Image from 'next/image';
import dynamic from 'next/dynamic';

interface ProjectsSectionProps {
  projects: Project[];
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    'Completed': 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
    'In Progress': 'bg-amber-500/10 text-amber-500 border-amber-500/20',
    'Archived': 'bg-secondary/50 text-muted-foreground border-border',
  };
  return (
    <span className={`text-xs font-medium px-2.5 py-1 rounded-full border ${styles[status] || styles['Completed']}`}>
      {status}
    </span>
  );
}

function MetricCard({ metric }: { metric: MetricItem }) {
  return (
    <div className="bg-background border border-border rounded-xl p-4 text-center hover:border-primary/30 transition-colors duration-200">
      <p className="text-xl font-bold text-primary mb-0.5">{metric.value}</p>
      <p className="text-xs text-muted-foreground">{metric.label}</p>
    </div>
  );
}

function ProjectCard({ project, onClick }: { project: Project; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="w-full text-left group bg-card border border-border rounded-xl overflow-hidden hover:border-primary/40 hover:-translate-y-1.5 transition-all duration-300 shadow-sm hover:shadow-xl hover:shadow-primary/5"
    >
      <div className="relative h-48 bg-muted overflow-hidden">
        {project.cover_image_url ? (
          <Image
            src={project.cover_image_url}
            alt={project.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-700"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/5 to-primary/10">
            <span className="text-5xl font-bold text-primary/15">{project.title.charAt(0)}</span>
          </div>
        )}
        {project.featured && (
          <div className="absolute top-3 right-3 flex items-center gap-1 bg-primary text-primary-foreground text-xs font-medium px-2 py-1 rounded-full">
            <Star size={10} fill="currentColor" />
            Featured
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
          <span className="flex items-center gap-1 text-xs text-white bg-white/20 backdrop-blur-sm px-2.5 py-1 rounded-full">
            View Details <ChevronRight size={12} />
          </span>
        </div>
      </div>

      <div className="p-5">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="text-base font-semibold text-foreground leading-tight group-hover:text-primary transition-colors duration-200">{project.title}</h3>
          {project.project_date && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground shrink-0">
              <Calendar size={10} />
              {new Date(project.project_date).getFullYear()}
            </div>
          )}
        </div>

        <p className="text-muted-foreground text-sm leading-relaxed mb-4 line-clamp-2">
          {project.description}
        </p>

        {project.technologies && project.technologies.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {project.technologies.slice(0, 4).map((tech) => (
              <span key={tech} className="text-xs px-2 py-0.5 bg-primary/10 text-primary border border-primary/20 rounded-full font-medium">
                {tech}
              </span>
            ))}
            {project.technologies.length > 4 && (
              <span className="text-xs px-2 py-0.5 bg-muted text-muted-foreground rounded-full">
                +{project.technologies.length - 4}
              </span>
            )}
          </div>
        )}
      </div>
    </button>
  );
}

function ProjectModal({ project, open, onClose }: { project: Project | null; open: boolean; onClose: () => void }) {
  if (!project) return null;

  return (
    <Modal open={open} onClose={onClose} maxWidth="max-w-[1100px]">
      <div className="overflow-y-auto" style={{ maxHeight: '90vh' }}>
        {/* Top: Cover Image */}
        {project.cover_image_url && (
          <div className="relative w-full h-56 sm:h-72 bg-muted">
            <Image
              src={project.cover_image_url}
              alt={project.title}
              fill
              className="object-cover"
              sizes="1100px"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-card via-card/20 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
              <div className="flex items-center gap-3 mb-2">
                <StatusBadge status={project.project_status || 'Completed'} />
                {project.featured && (
                  <span className="flex items-center gap-1 text-xs text-primary font-medium">
                    <Star size={12} fill="currentColor" /> Featured
                  </span>
                )}
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground">{project.title}</h2>
            </div>
          </div>
        )}

        {!project.cover_image_url && (
          <div className="p-6 sm:p-8 border-b border-border">
            <div className="flex items-center gap-3 mb-2">
              <StatusBadge status={project.project_status || 'Completed'} />
              {project.featured && (
                <span className="flex items-center gap-1 text-xs text-primary font-medium">
                  <Star size={12} fill="currentColor" /> Featured
                </span>
              )}
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground">{project.title}</h2>
          </div>
        )}

        {/* Body Content */}
        <div className="p-6 sm:p-8 space-y-8">
          {/* Description */}
          <div>
            <p className="text-muted-foreground leading-relaxed text-base">{project.description}</p>
          </div>

          {/* Metrics */}
          {project.metrics && project.metrics.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp size={16} className="text-primary" />
                <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">Key Metrics</h3>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {project.metrics.map((metric, i) => (
                  <MetricCard key={i} metric={metric} />
                ))}
              </div>
            </div>
          )}

          {/* Problem & Solution */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {project.problem_statement && (
              <div className="bg-background border border-border rounded-xl p-5">
                <div className="flex items-center gap-2 mb-3">
                  <Target size={16} className="text-primary" />
                  <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">Problem</h3>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">{project.problem_statement}</p>
              </div>
            )}
            {project.solution && (
              <div className="bg-background border border-border rounded-xl p-5">
                <div className="flex items-center gap-2 mb-3">
                  <Lightbulb size={16} className="text-primary" />
                  <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">Solution</h3>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">{project.solution}</p>
              </div>
            )}
          </div>

          {/* Features */}
          {project.features && project.features.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Zap size={16} className="text-primary" />
                <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">Features</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {project.features.map((feature, i) => (
                  <div key={i} className="flex items-start gap-2.5 p-3 bg-background border border-border rounded-lg">
                    <span className="w-1.5 h-1.5 bg-primary rounded-full mt-1.5 shrink-0" />
                    <span className="text-sm text-muted-foreground">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Challenges & Learnings */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {project.challenges && (
              <div className="bg-background border border-border rounded-xl p-5">
                <div className="flex items-center gap-2 mb-3">
                  <Zap size={16} className="text-amber-500" />
                  <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">Challenges</h3>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">{project.challenges}</p>
              </div>
            )}
            {project.key_learnings && (
              <div className="bg-background border border-border rounded-xl p-5">
                <div className="flex items-center gap-2 mb-3">
                  <BookOpen size={16} className="text-emerald-500" />
                  <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">Key Learnings</h3>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">{project.key_learnings}</p>
              </div>
            )}
          </div>

          {/* Technologies */}
          {project.technologies && project.technologies.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Code size={16} className="text-primary" />
                <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">Technologies Used</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {project.technologies.map((tech) => (
                  <span key={tech} className="px-3 py-1.5 text-sm bg-primary/10 text-primary border border-primary/20 rounded-full font-medium">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Timeline */}
          {project.project_date && (
            <div className="flex items-center gap-3 text-sm text-muted-foreground pt-2 border-t border-border">
              <Calendar size={14} className="text-primary" />
              <span>
                {new Date(project.project_date).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </span>
            </div>
          )}
        </div>

        {/* Bottom: Action buttons */}
        <div className="sticky bottom-0 border-t border-border bg-card/95 backdrop-blur-sm p-4 sm:p-6 flex flex-wrap gap-3">
          {project.live_url && (
            <a
              href={project.live_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-all duration-200 hover:-translate-y-0.5 shadow-lg shadow-primary/20"
            >
              <ExternalLink size={15} />
              View Live
            </a>
          )}
          {project.github_url && (
            <a
              href={project.github_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-5 py-2.5 border border-border text-foreground rounded-lg text-sm font-medium hover:bg-muted hover:border-primary/30 transition-all duration-200 hover:-translate-y-0.5"
            >
              <Github size={15} />
              View Code
            </a>
          )}
          <div className="flex-1" />
          <ModalCloseButton onClose={onClose} />
        </div>
      </div>
    </Modal>
  );
}

// Inline icon component to avoid extra import
function Code({ size, className }: { size: number; className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" />
    </svg>
  );
}

export default function ProjectsSection({ projects }: ProjectsSectionProps) {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'featured'>('all');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const filtered = projects.filter((project) => {
    const matchesSearch =
      !search ||
      project.title.toLowerCase().includes(search.toLowerCase()) ||
      project.description.toLowerCase().includes(search.toLowerCase()) ||
      project.technologies.some((t) => t.toLowerCase().includes(search.toLowerCase()));
    const matchesFilter = filter === 'all' || project.featured;
    return matchesSearch && matchesFilter;
  });

  if (!projects.length) return null;

  return (
    <section id="projects" className="section-padding bg-muted/30">
      <div className="container-max">
        <SectionHeader
          label="Projects"
          title="Things I've Built"
          description="A collection of projects that demonstrate my skills and passion for building things."
        />

        <div className="mt-8 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search projects..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm bg-card border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-colors"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 text-sm rounded-lg font-medium transition-all duration-200 ${
                filter === 'all'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-card border border-border text-muted-foreground hover:text-foreground hover:border-primary/30'
              }`}
            >
              All ({projects.length})
            </button>
            <button
              onClick={() => setFilter('featured')}
              className={`px-4 py-2 text-sm rounded-lg font-medium transition-all duration-200 flex items-center gap-1.5 ${
                filter === 'featured'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-card border border-border text-muted-foreground hover:text-foreground hover:border-primary/30'
              }`}
            >
              <Star size={12} />
              Featured
            </button>
          </div>
        </div>

        {filtered.length > 0 ? (
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                onClick={() => setSelectedProject(project)}
              />
            ))}
          </div>
        ) : (
          <div className="mt-12 text-center py-16 bg-card border border-border rounded-xl">
            <p className="text-muted-foreground">No projects match your search.</p>
          </div>
        )}
      </div>

      <ProjectModal
        project={selectedProject}
        open={!!selectedProject}
        onClose={() => setSelectedProject(null)}
      />
    </section>
  );
}
