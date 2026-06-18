'use client';

import { useState, useMemo, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, ChevronDown } from 'lucide-react';
import skills, { SkillItem, skillCategories } from '@/lib/skill-data';
import SectionHeader from './section-header';
import type { IconType } from 'react-icons';

function FallbackIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2L2 7l10 5 10-5-10-5z" />
      <path d="M2 17l10 5 10-5" />
      <path d="M2 12l10 5 10-5" />
    </svg>
  );
}

function SkillIcon({ icon: Icon }: { icon?: IconType }) {
  if (!Icon) return <FallbackIcon />;
  return <Icon size={16} />;
}

function Popover({ skill, onClose }: { skill: SkillItem; onClose: () => void }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [onClose]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.95, y: 6 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: 6 }}
      transition={{ duration: 0.15, ease: 'easeOut' }}
      className="absolute z-50 top-[calc(100%+6px)] left-0 w-60 bg-popover border border-border rounded-xl shadow-xl p-4 space-y-2"
    >
      <div className="flex items-start justify-between gap-2">
        <p className="text-sm font-semibold text-foreground leading-snug">{skill.name}</p>
        <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors shrink-0 mt-0.5">
          <X size={13} />
        </button>
      </div>
      <p className="text-xs text-muted-foreground leading-relaxed">{skill.description}</p>
    </motion.div>
  );
}

function SkillCard({ skill }: { skill: SkillItem }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <motion.button
        onClick={() => setOpen((v) => !v)}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        transition={{ duration: 0.15, ease: 'easeOut' }}
        className={`w-full flex items-center gap-2.5 bg-card border rounded-xl px-3.5 py-3 text-left hover:border-primary/40 hover:shadow-md hover:shadow-primary/5 transition-[border-color,box-shadow] duration-150 ${
          open ? 'border-primary/50 shadow-md shadow-primary/10' : 'border-border'
        }`}
      >
        <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
          <SkillIcon icon={skill.icon} />
        </div>
        <span className="text-sm font-medium text-foreground leading-tight line-clamp-2 min-w-0">{skill.name}</span>
      </motion.button>

      <AnimatePresence>
        {open && <Popover skill={skill} onClose={() => setOpen(false)} />}
      </AnimatePresence>
    </div>
  );
}

function CategorySection({
  category,
  skills,
  collapsed,
  onToggle,
}: {
  category: string;
  skills: SkillItem[];
  collapsed: boolean;
  onToggle: () => void;
}) {
  return (
    <div>
      <button
        onClick={onToggle}
        className="w-full flex items-center gap-2 mb-3 text-left group"
      >
        <div className="flex-1 flex items-center gap-2">
          <h3 className="text-sm font-semibold text-foreground">{category}</h3>
          <span className="text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded-full tabular-nums">{skills.length}</span>
        </div>
        <motion.div animate={{ rotate: collapsed ? 0 : 180 }} transition={{ duration: 0.18 }}>
          <ChevronDown size={14} className="text-muted-foreground" />
        </motion.div>
      </button>

      <AnimatePresence initial={false}>
        {!collapsed && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
            className="overflow-visible"
          >
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 pb-5">
              {skills.map((skill) => (
                <SkillCard key={skill.id} skill={skill} />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function SkillsSection() {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});

  const toggleCollapse = (cat: string) =>
    setCollapsed((prev) => ({ ...prev, [cat]: !prev[cat] }));

  const filteredByCategory = useMemo(() => {
    const q = search.toLowerCase().trim();
    return skillCategories
      .filter((cat) => activeCategory === 'all' || cat === activeCategory)
      .map((cat) => ({
        category: cat,
        skills: skills.filter(
          (s) =>
            s.category === cat &&
            (!q || s.name.toLowerCase().includes(q) || s.description.toLowerCase().includes(q))
        ),
      }))
      .filter((g) => g.skills.length > 0);
  }, [search, activeCategory]);

  return (
    <section id="skills" className="section-padding bg-muted/30">
      <div className="container-max">
        <SectionHeader
          label="Skills"
          title="Technical Expertise"
          description="A comprehensive overview of my technical skills across all domains."
        />

        {/* Controls */}
        <div className="mt-8 flex flex-col gap-4">
          <div className="relative max-w-sm">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search skills..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-9 py-2.5 text-sm bg-card border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-colors"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <X size={13} />
              </button>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setActiveCategory('all')}
              className={`px-3 py-1.5 text-xs rounded-lg font-medium transition-all duration-150 ${
                activeCategory === 'all'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-card border border-border text-muted-foreground hover:text-foreground hover:border-primary/30'
              }`}
            >
              All ({skills.length})
            </button>
            {skillCategories.map((cat) => {
              const count = skills.filter((s) => s.category === cat).length;
              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-3 py-1.5 text-xs rounded-lg font-medium transition-all duration-150 ${
                    activeCategory === cat
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-card border border-border text-muted-foreground hover:text-foreground hover:border-primary/30'
                  }`}
                >
                  {cat} ({count})
                </button>
              );
            })}
          </div>
        </div>

        {/* Categories */}
        <div className="mt-6 space-y-1">
          {filteredByCategory.length > 0 ? (
            filteredByCategory.map(({ category, skills: catSkills }) => (
              <CategorySection
                key={category}
                category={category}
                skills={catSkills}
                collapsed={collapsed[category] || false}
                onToggle={() => toggleCollapse(category)}
              />
            ))
          ) : (
            <div className="text-center py-16 bg-card border border-border rounded-xl">
              <p className="text-muted-foreground text-sm">No skills match your search.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
