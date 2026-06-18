'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Certificate } from '@/lib/types';
import { Plus, Trash2, Save, Award } from 'lucide-react';

const empty = (): Partial<Certificate> => ({
  name: '', issuer: '', credential_url: '', credential_id: '', image_url: '',
  description: '', skills_gained: [], sort_order: 0,
});

export default function CertificatesManager() {
  const [items, setItems] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Partial<Certificate> | null>(null);
  const [saving, setSaving] = useState(false);
  const [skillInput, setSkillInput] = useState('');

  const load = async () => {
    const { data } = await supabase.from('certificates').select('*').order('sort_order').order('issue_date', { ascending: false });
    setItems(data || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const save = async () => {
    if (!editing) return;
    setSaving(true);
    const { id, created_at, ...rest } = editing as Certificate;
    if (id) {
      await supabase.from('certificates').update({ ...rest, updated_at: new Date().toISOString() }).eq('id', id);
    } else {
      await supabase.from('certificates').insert([rest]);
    }
    setSaving(false);
    setEditing(null);
    load();
  };

  const remove = async (id: string) => {
    if (!confirm('Delete this certificate?')) return;
    await supabase.from('certificates').delete().eq('id', id);
    load();
  };

  const addSkill = () => {
    if (!skillInput.trim()) return;
    setEditing((p) => ({ ...p, skills_gained: [...(p?.skills_gained || []), skillInput.trim()] }));
    setSkillInput('');
  };

  if (loading) return <div className="flex items-center justify-center h-40"><div className="w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin" /></div>;

  return (
    <div className="max-w-2xl space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold text-foreground">Certificates</h2>
        <button onClick={() => { setEditing(empty()); setSkillInput(''); }} className="flex items-center gap-2 px-3 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors">
          <Plus size={15} /> Add Certificate
        </button>
      </div>

      {editing !== null && (
        <div className="bg-card border border-primary/30 rounded-xl p-5 space-y-4">
          <h3 className="text-sm font-semibold text-foreground">{(editing as Certificate).id ? 'Edit' : 'New'} Certificate</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">Certificate Name</label>
              <input type="text" value={editing.name || ''} onChange={(e) => setEditing((p) => ({ ...p, name: e.target.value }))} className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary transition-colors" />
            </div>
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">Issuer</label>
              <input type="text" value={editing.issuer || ''} onChange={(e) => setEditing((p) => ({ ...p, issuer: e.target.value }))} className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary transition-colors" />
            </div>
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">Issue Date</label>
              <input type="date" value={editing.issue_date || ''} onChange={(e) => setEditing((p) => ({ ...p, issue_date: e.target.value }))} className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary transition-colors" />
            </div>
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">Expiry Date (optional)</label>
              <input type="date" value={editing.expiry_date || ''} onChange={(e) => setEditing((p) => ({ ...p, expiry_date: e.target.value }))} className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary transition-colors" />
            </div>
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">Credential URL</label>
              <input type="url" value={editing.credential_url || ''} onChange={(e) => setEditing((p) => ({ ...p, credential_url: e.target.value }))} className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary transition-colors" />
            </div>
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">Credential ID</label>
              <input type="text" value={editing.credential_id || ''} onChange={(e) => setEditing((p) => ({ ...p, credential_id: e.target.value }))} className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary transition-colors" />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-muted-foreground mb-1">Image URL</label>
              <input type="url" value={editing.image_url || ''} onChange={(e) => setEditing((p) => ({ ...p, image_url: e.target.value }))} className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary transition-colors" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1">Description</label>
            <textarea rows={3} value={editing.description || ''} onChange={(e) => setEditing((p) => ({ ...p, description: e.target.value }))} className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg resize-none focus:outline-none focus:ring-1 focus:ring-primary transition-colors" />
          </div>
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-2">Skills Gained</label>
            <div className="flex gap-2 mb-2">
              <input type="text" value={skillInput} onChange={(e) => setSkillInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())} placeholder="e.g. Data Analysis, Machine Learning" className="flex-1 px-3 py-2 text-sm bg-background border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary transition-colors" />
              <button onClick={addSkill} className="px-3 py-2 bg-muted text-foreground rounded-lg text-sm hover:bg-muted/80 transition-colors">Add</button>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {(editing.skills_gained || []).map((skill, i) => (
                <span key={i} className="flex items-center gap-1 px-2.5 py-1 bg-primary/10 text-primary border border-primary/20 rounded-full text-xs font-medium">
                  {skill}
                  <button onClick={() => setEditing((p) => ({ ...p, skills_gained: p?.skills_gained?.filter((_, j) => j !== i) }))} className="hover:text-destructive">&times;</button>
                </span>
              ))}
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={save} disabled={saving} className="flex items-center gap-1.5 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-60">
              <Save size={14} />{saving ? 'Saving...' : 'Save'}
            </button>
            <button onClick={() => setEditing(null)} className="px-4 py-2 border border-border rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">Cancel</button>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {items.length === 0 && <p className="text-muted-foreground text-sm text-center py-8 bg-card border border-border rounded-xl">No certificates yet.</p>}
        {items.map((item) => (
          <div key={item.id} className="flex items-start gap-3 bg-card border border-border rounded-xl p-4 hover:border-primary/30 transition-colors">
            <div className="w-9 h-9 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
              <Award size={16} className="text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-foreground">{item.name}</p>
              <p className="text-xs text-primary">{item.issuer}</p>
              {item.credential_id && <p className="text-xs text-muted-foreground mt-0.5">ID: {item.credential_id}</p>}
            </div>
            <div className="flex gap-1 shrink-0">
              <button onClick={() => { setEditing(item); setSkillInput(''); }} className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"><Save size={13} /></button>
              <button onClick={() => remove(item.id)} className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"><Trash2 size={13} /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
