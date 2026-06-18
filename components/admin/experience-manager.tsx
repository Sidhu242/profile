'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Experience } from '@/lib/types';
import { Plus, Trash2, Save, Briefcase } from 'lucide-react';

const empty = (): Partial<Experience> => ({
  role: '', company: '', duration: '', description: '', location: '', is_current: false, sort_order: 0,
});

export default function ExperienceManager() {
  const [items, setItems] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Partial<Experience> | null>(null);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    const { data } = await supabase.from('experience').select('*').order('sort_order').order('start_date', { ascending: false });
    setItems(data || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const save = async () => {
    if (!editing) return;
    setSaving(true);
    const { id, created_at, ...rest } = editing as Experience;
    if (id) {
      await supabase.from('experience').update({ ...rest, updated_at: new Date().toISOString() }).eq('id', id);
    } else {
      await supabase.from('experience').insert([rest]);
    }
    setSaving(false);
    setEditing(null);
    load();
  };

  const remove = async (id: string) => {
    if (!confirm('Delete this experience entry?')) return;
    await supabase.from('experience').delete().eq('id', id);
    load();
  };

  if (loading) return <div className="flex items-center justify-center h-40"><div className="w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin" /></div>;

  return (
    <div className="max-w-2xl space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold text-foreground">Experience</h2>
        <button onClick={() => setEditing(empty())} className="flex items-center gap-2 px-3 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors">
          <Plus size={15} /> Add Experience
        </button>
      </div>

      {editing !== null && (
        <div className="bg-card border border-primary/30 rounded-xl p-5 space-y-4">
          <h3 className="text-sm font-semibold text-foreground">{(editing as Experience).id ? 'Edit' : 'New'} Experience</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">Role / Title</label>
              <input type="text" value={editing.role || ''} onChange={(e) => setEditing((p) => ({ ...p, role: e.target.value }))} className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary transition-colors" />
            </div>
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">Company</label>
              <input type="text" value={editing.company || ''} onChange={(e) => setEditing((p) => ({ ...p, company: e.target.value }))} className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary transition-colors" />
            </div>
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">Duration (e.g. Jan 2023 – Present)</label>
              <input type="text" value={editing.duration || ''} onChange={(e) => setEditing((p) => ({ ...p, duration: e.target.value }))} className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary transition-colors" />
            </div>
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">Location</label>
              <input type="text" value={editing.location || ''} onChange={(e) => setEditing((p) => ({ ...p, location: e.target.value }))} className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary transition-colors" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1">Description</label>
            <textarea rows={3} value={editing.description || ''} onChange={(e) => setEditing((p) => ({ ...p, description: e.target.value }))} className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg resize-none focus:outline-none focus:ring-1 focus:ring-primary transition-colors" />
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={editing.is_current || false} onChange={(e) => setEditing((p) => ({ ...p, is_current: e.target.checked }))} className="accent-primary" />
            <span className="text-sm text-foreground">Currently working here</span>
          </label>
          <div className="flex gap-2">
            <button onClick={save} disabled={saving} className="flex items-center gap-1.5 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-60">
              <Save size={14} />{saving ? 'Saving...' : 'Save'}
            </button>
            <button onClick={() => setEditing(null)} className="px-4 py-2 border border-border rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">Cancel</button>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {items.length === 0 && <p className="text-muted-foreground text-sm text-center py-8 bg-card border border-border rounded-xl">No experience entries yet.</p>}
        {items.map((item) => (
          <div key={item.id} className="flex items-start gap-3 bg-card border border-border rounded-xl p-4 hover:border-primary/30 transition-colors">
            <div className="w-9 h-9 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
              <Briefcase size={16} className="text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="text-sm font-semibold text-foreground">{item.role}</p>
                {item.is_current && <span className="text-xs bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 px-1.5 py-0.5 rounded-full">Current</span>}
              </div>
              <p className="text-xs text-primary">{item.company}</p>
              {item.duration && <p className="text-xs text-muted-foreground mt-0.5">{item.duration}</p>}
            </div>
            <div className="flex gap-1 shrink-0">
              <button onClick={() => setEditing(item)} className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"><Save size={13} /></button>
              <button onClick={() => remove(item.id)} className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"><Trash2 size={13} /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
