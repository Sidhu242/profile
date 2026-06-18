'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Education } from '@/lib/types';
import { Plus, Trash2, Save, GraduationCap } from 'lucide-react';

const empty = (): Partial<Education> => ({
  degree: '', institution: '', duration: '', gpa: '', description: '', sort_order: 0,
});

export default function EducationManager() {
  const [items, setItems] = useState<Education[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Partial<Education> | null>(null);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    const { data } = await supabase.from('education').select('*').order('sort_order');
    setItems(data || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const save = async () => {
    if (!editing) return;
    setSaving(true);
    const { id, created_at, ...rest } = editing as Education;
    if (id) {
      await supabase.from('education').update({ ...rest, updated_at: new Date().toISOString() }).eq('id', id);
    } else {
      await supabase.from('education').insert([rest]);
    }
    setSaving(false);
    setEditing(null);
    load();
  };

  const remove = async (id: string) => {
    if (!confirm('Delete this education entry?')) return;
    await supabase.from('education').delete().eq('id', id);
    load();
  };

  if (loading) return <div className="flex items-center justify-center h-40"><div className="w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin" /></div>;

  return (
    <div className="max-w-2xl space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold text-foreground">Education</h2>
        <button
          onClick={() => setEditing(empty())}
          className="flex items-center gap-2 px-3 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
        >
          <Plus size={15} /> Add Education
        </button>
      </div>

      {editing !== null && (
        <div className="bg-card border border-primary/30 rounded-xl p-5 space-y-4">
          <h3 className="text-sm font-semibold text-foreground">{(editing as Education).id ? 'Edit' : 'New'} Education</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              ['Degree / Certificate', 'degree'],
              ['Institution', 'institution'],
              ['Duration (e.g. 2020–2024)', 'duration'],
              ['GPA / Marks', 'gpa'],
            ].map(([label, key]) => (
              <div key={key}>
                <label className="block text-xs font-medium text-muted-foreground mb-1">{label}</label>
                <input
                  type="text"
                  value={(editing as any)[key] || ''}
                  onChange={(e) => setEditing((p) => ({ ...p, [key]: e.target.value }))}
                  className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-colors"
                />
              </div>
            ))}
          </div>
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1">Description</label>
            <textarea
              rows={3}
              value={editing.description || ''}
              onChange={(e) => setEditing((p) => ({ ...p, description: e.target.value }))}
              className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg resize-none focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-colors"
            />
          </div>
          <div className="flex gap-2">
            <button onClick={save} disabled={saving} className="flex items-center gap-1.5 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-60">
              <Save size={14} />{saving ? 'Saving...' : 'Save'}
            </button>
            <button onClick={() => setEditing(null)} className="px-4 py-2 border border-border rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {items.length === 0 && <p className="text-muted-foreground text-sm text-center py-8 bg-card border border-border rounded-xl">No education entries yet. Add one above.</p>}
        {items.map((item) => (
          <div key={item.id} className="flex items-start gap-3 bg-card border border-border rounded-xl p-4 hover:border-primary/30 transition-colors">
            <div className="w-9 h-9 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
              <GraduationCap size={16} className="text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-foreground">{item.degree}</p>
              <p className="text-xs text-primary">{item.institution}</p>
              {item.duration && <p className="text-xs text-muted-foreground mt-0.5">{item.duration}</p>}
            </div>
            <div className="flex gap-1.5 shrink-0">
              <button onClick={() => setEditing(item)} className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
                <Save size={14} />
              </button>
              <button onClick={() => remove(item.id)} className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors">
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
