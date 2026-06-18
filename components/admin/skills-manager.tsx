'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Skill } from '@/lib/types';
import { Plus, Trash2, Save, Code } from 'lucide-react';

const empty = (): Partial<Skill> => ({
  name: '', category: 'Data Analytics', proficiency: 75, sort_order: 0,
});

const categories = ['Data Analytics', 'Web Development', 'Database', 'Tools', 'Other'];

export default function SkillsManager() {
  const [items, setItems] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Partial<Skill> | null>(null);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    const { data } = await supabase.from('skills').select('*').order('sort_order').order('category');
    setItems(data || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const save = async () => {
    if (!editing) return;
    setSaving(true);
    const { id, created_at, ...rest } = editing as Skill;
    if (id) {
      await supabase.from('skills').update({ ...rest, updated_at: new Date().toISOString() }).eq('id', id);
    } else {
      await supabase.from('skills').insert([rest]);
    }
    setSaving(false);
    setEditing(null);
    load();
  };

  const remove = async (id: string) => {
    if (!confirm('Delete this skill?')) return;
    await supabase.from('skills').delete().eq('id', id);
    load();
  };

  if (loading) return <div className="flex items-center justify-center h-40"><div className="w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin" /></div>;

  const grouped = items.reduce<Record<string, Skill[]>>((acc, s) => {
    if (!acc[s.category]) acc[s.category] = [];
    acc[s.category].push(s);
    return acc;
  }, {});

  return (
    <div className="max-w-2xl space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold text-foreground">Skills</h2>
        <button onClick={() => setEditing(empty())} className="flex items-center gap-2 px-3 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors">
          <Plus size={15} /> Add Skill
        </button>
      </div>

      {editing !== null && (
        <div className="bg-card border border-primary/30 rounded-xl p-5 space-y-4">
          <h3 className="text-sm font-semibold text-foreground">{(editing as Skill).id ? 'Edit' : 'New'} Skill</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">Skill Name</label>
              <input type="text" value={editing.name || ''} onChange={(e) => setEditing((p) => ({ ...p, name: e.target.value }))} className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary transition-colors" />
            </div>
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">Category</label>
              <select value={editing.category || ''} onChange={(e) => setEditing((p) => ({ ...p, category: e.target.value }))} className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary transition-colors">
                {categories.map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-2">Proficiency: {editing.proficiency}%</label>
            <input type="range" min={10} max={100} value={editing.proficiency || 75} onChange={(e) => setEditing((p) => ({ ...p, proficiency: Number(e.target.value) }))} className="w-full accent-primary" />
          </div>
          <div className="flex gap-2">
            <button onClick={save} disabled={saving} className="flex items-center gap-1.5 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-60">
              <Save size={14} />{saving ? 'Saving...' : 'Save'}
            </button>
            <button onClick={() => setEditing(null)} className="px-4 py-2 border border-border rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">Cancel</button>
          </div>
        </div>
      )}

      <div className="space-y-5">
        {Object.keys(grouped).length === 0 && <p className="text-muted-foreground text-sm text-center py-8 bg-card border border-border rounded-xl">No skills yet.</p>}
        {Object.entries(grouped).map(([cat, skills]) => (
          <div key={cat}>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">{cat}</p>
            <div className="space-y-2">
              {skills.map((item) => (
                <div key={item.id} className="flex items-center gap-3 bg-card border border-border rounded-xl p-3 hover:border-primary/30 transition-colors">
                  <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
                    <Code size={14} className="text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm font-medium text-foreground">{item.name}</p>
                      <span className="text-xs text-primary font-semibold">{item.proficiency}%</span>
                    </div>
                    <div className="h-1 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-primary rounded-full" style={{ width: `${item.proficiency}%` }} />
                    </div>
                  </div>
                  <div className="flex gap-1 shrink-0">
                    <button onClick={() => setEditing(item)} className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"><Save size={13} /></button>
                    <button onClick={() => remove(item.id)} className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"><Trash2 size={13} /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
