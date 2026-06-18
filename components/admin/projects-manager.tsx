'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Project, MetricItem } from '@/lib/types';
import { Plus, Trash2, Save, FolderOpen, Star } from 'lucide-react';

const empty = (): Partial<Project> => ({
  title: '', description: '', cover_image_url: '', technologies: [],
  github_url: '', live_url: '', featured: false, sort_order: 0,
  problem_statement: '', solution: '', features: [],
  challenges: '', key_learnings: '', project_status: 'Completed', metrics: [],
});

export default function ProjectsManager() {
  const [items, setItems] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Partial<Project> | null>(null);
  const [saving, setSaving] = useState(false);
  const [techInput, setTechInput] = useState('');
  const [featureInput, setFeatureInput] = useState('');
  const [metricLabel, setMetricLabel] = useState('');
  const [metricValue, setMetricValue] = useState('');

  const load = async () => {
    const { data } = await supabase.from('projects').select('*').order('sort_order').order('project_date', { ascending: false });
    setItems(data || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const save = async () => {
    if (!editing) return;
    setSaving(true);
    const { id, created_at, ...rest } = editing as Project;
    // Ensure metrics is proper JSON
    const payload = { ...rest, metrics: rest.metrics || [] };
    if (id) {
      await supabase.from('projects').update({ ...payload, updated_at: new Date().toISOString() }).eq('id', id);
    } else {
      await supabase.from('projects').insert([payload]);
    }
    setSaving(false);
    setEditing(null);
    load();
  };

  const remove = async (id: string) => {
    if (!confirm('Delete this project?')) return;
    await supabase.from('projects').delete().eq('id', id);
    load();
  };

  const addTech = () => {
    if (!techInput.trim()) return;
    setEditing((p) => ({ ...p, technologies: [...(p?.technologies || []), techInput.trim()] }));
    setTechInput('');
  };

  const addFeature = () => {
    if (!featureInput.trim()) return;
    setEditing((p) => ({ ...p, features: [...(p?.features || []), featureInput.trim()] }));
    setFeatureInput('');
  };

  const addMetric = () => {
    if (!metricLabel.trim() || !metricValue.trim()) return;
    const newMetric: MetricItem = { label: metricLabel.trim(), value: metricValue.trim() };
    setEditing((p) => ({ ...p, metrics: [...(p?.metrics || []), newMetric] }));
    setMetricLabel('');
    setMetricValue('');
  };

  const removeMetric = (idx: number) => {
    setEditing((p) => ({ ...p, metrics: (p?.metrics || []).filter((_, i) => i !== idx) }));
  };

  if (loading) return <div className="flex items-center justify-center h-40"><div className="w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin" /></div>;

  const inputField = (label: string, key: string, type = 'text', placeholder = '') => (
    <div>
      <label className="block text-xs font-medium text-muted-foreground mb-1">{label}</label>
      <input
        type={type}
        value={(editing as any)?.[key] || ''}
        onChange={(e) => setEditing((p) => ({ ...p, [key]: e.target.value }))}
        placeholder={placeholder}
        className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary transition-colors"
      />
    </div>
  );

  const textArea = (label: string, key: string, rows = 3, placeholder = '') => (
    <div>
      <label className="block text-xs font-medium text-muted-foreground mb-1">{label}</label>
      <textarea
        rows={rows}
        value={(editing as any)?.[key] || ''}
        onChange={(e) => setEditing((p) => ({ ...p, [key]: e.target.value }))}
        placeholder={placeholder}
        className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg resize-none focus:outline-none focus:ring-1 focus:ring-primary transition-colors"
      />
    </div>
  );

  return (
    <div className="max-w-2xl space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold text-foreground">Projects</h2>
        <button onClick={() => { setEditing(empty()); setTechInput(''); setFeatureInput(''); }} className="flex items-center gap-2 px-3 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors">
          <Plus size={15} /> Add Project
        </button>
      </div>

      {editing !== null && (
        <div className="bg-card border border-primary/30 rounded-xl p-5 space-y-5">
          <h3 className="text-sm font-semibold text-foreground">{(editing as Project).id ? 'Edit' : 'New'} Project</h3>

          {/* Basic Info */}
          <div className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {inputField('Title', 'title', 'text', 'Project title')}
              {inputField('Project Status', 'project_status', 'text', 'e.g. Completed, In Progress')}
            </div>
            {textArea('Description', 'description', 3, 'What this project does')}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {inputField('Cover Image URL', 'cover_image_url', 'url')}
              {inputField('Project Date', 'project_date', 'date')}
              {inputField('GitHub URL', 'github_url', 'url')}
              {inputField('Live URL', 'live_url', 'url')}
            </div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={editing.featured || false} onChange={(e) => setEditing((p) => ({ ...p, featured: e.target.checked }))} className="accent-primary" />
              <span className="text-sm text-foreground">Featured</span>
            </label>
          </div>

          {/* Detailed Content */}
          <div className="border-t border-border pt-4 space-y-3">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Detailed Content (shown in expanded view)</p>
            {textArea('Problem Statement', 'problem_statement', 3, 'What problem does this solve?')}
            {textArea('Solution Implemented', 'solution', 3, 'How does this project solve it?')}
            {textArea('Challenges Faced', 'challenges', 2, 'What obstacles did you encounter?')}
            {textArea('Key Learnings', 'key_learnings', 2, 'What did you learn from this project?')}
          </div>

          {/* Features */}
          <div className="border-t border-border pt-4">
            <label className="block text-xs font-medium text-muted-foreground mb-2">Features</label>
            <div className="flex gap-2 mb-2">
              <input type="text" value={featureInput} onChange={(e) => setFeatureInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())} placeholder="e.g. User authentication, Dark mode" className="flex-1 px-3 py-2 text-sm bg-background border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary transition-colors" />
              <button onClick={addFeature} className="px-3 py-2 bg-muted text-foreground rounded-lg text-sm hover:bg-muted/80 transition-colors">Add</button>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {(editing.features || []).map((f, i) => (
                <span key={i} className="flex items-center gap-1 px-2 py-0.5 bg-primary/10 text-primary border border-primary/20 rounded-full text-xs">
                  {f}<button onClick={() => setEditing((p) => ({ ...p, features: p?.features?.filter((_, j) => j !== i) }))} className="hover:text-destructive">&times;</button>
                </span>
              ))}
            </div>
          </div>

          {/* Technologies */}
          <div className="border-t border-border pt-4">
            <label className="block text-xs font-medium text-muted-foreground mb-2">Technologies</label>
            <div className="flex gap-2 mb-2">
              <input type="text" value={techInput} onChange={(e) => setTechInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTech())} placeholder="e.g. Python, React" className="flex-1 px-3 py-2 text-sm bg-background border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary transition-colors" />
              <button onClick={addTech} className="px-3 py-2 bg-muted text-foreground rounded-lg text-sm hover:bg-muted/80 transition-colors">Add</button>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {(editing.technologies || []).map((t, i) => (
                <span key={i} className="flex items-center gap-1 px-2 py-0.5 bg-primary/10 text-primary border border-primary/20 rounded-full text-xs">
                  {t}<button onClick={() => setEditing((p) => ({ ...p, technologies: p?.technologies?.filter((_, j) => j !== i) }))} className="hover:text-destructive">&times;</button>
                </span>
              ))}
            </div>
          </div>

          {/* Metrics */}
          <div className="border-t border-border pt-4">
            <label className="block text-xs font-medium text-muted-foreground mb-2">Key Metrics</label>
            <div className="flex gap-2 mb-2">
              <input type="text" value={metricLabel} onChange={(e) => setMetricLabel(e.target.value)} placeholder="Label (e.g. Users)" className="flex-1 px-3 py-2 text-sm bg-background border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary transition-colors" />
              <input type="text" value={metricValue} onChange={(e) => setMetricValue(e.target.value)} placeholder="Value (e.g. 10K+)" className="w-28 px-3 py-2 text-sm bg-background border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary transition-colors" />
              <button onClick={addMetric} className="px-3 py-2 bg-muted text-foreground rounded-lg text-sm hover:bg-muted/80 transition-colors">Add</button>
            </div>
            {(editing.metrics || []).length > 0 && (
              <div className="space-y-1.5">
                {(editing.metrics || []).map((m, i) => (
                  <div key={i} className="flex items-center justify-between bg-background border border-border rounded-lg px-3 py-2 text-sm">
                    <span className="text-muted-foreground">{m.label}</span>
                    <span className="font-semibold text-primary">{m.value}</span>
                    <button onClick={() => removeMetric(i)} className="text-muted-foreground hover:text-destructive transition-colors">&times;</button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-2">
            <button onClick={save} disabled={saving} className="flex items-center gap-1.5 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-60">
              <Save size={14} />{saving ? 'Saving...' : 'Save'}
            </button>
            <button onClick={() => setEditing(null)} className="px-4 py-2 border border-border rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">Cancel</button>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {items.length === 0 && <p className="text-muted-foreground text-sm text-center py-8 bg-card border border-border rounded-xl">No projects yet.</p>}
        {items.map((item) => (
          <div key={item.id} className="flex items-start gap-3 bg-card border border-border rounded-xl p-4 hover:border-primary/30 transition-colors">
            <div className="w-9 h-9 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
              <FolderOpen size={16} className="text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="text-sm font-semibold text-foreground truncate">{item.title}</p>
                {item.featured && <Star size={12} className="text-primary fill-primary shrink-0" />}
              </div>
              <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">{item.description}</p>
              <div className="flex flex-wrap gap-1 mt-1.5">
                <span className="text-xs px-1.5 py-0.5 bg-muted rounded text-muted-foreground">{item.project_status || 'Completed'}</span>
                {item.technologies?.slice(0, 3).map((t) => <span key={t} className="text-xs px-1.5 py-0.5 bg-muted rounded text-muted-foreground">{t}</span>)}
              </div>
            </div>
            <div className="flex gap-1 shrink-0">
              <button onClick={() => { setEditing(item); setTechInput(''); setFeatureInput(''); }} className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"><Save size={13} /></button>
              <button onClick={() => remove(item.id)} className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"><Trash2 size={13} /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
