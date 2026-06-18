'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Resume } from '@/lib/types';
import { FileText, Save, Trash2, Download, Plus } from 'lucide-react';

export default function ResumeManager() {
  const [items, setItems] = useState<Resume[]>([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState({ file_url: '', file_name: '' });
  const [saving, setSaving] = useState(false);

  const load = async () => {
    const { data } = await supabase.from('resume').select('*').order('uploaded_at', { ascending: false });
    setItems(data || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const save = async () => {
    if (!form.file_url) return;
    setSaving(true);
    await supabase.from('resume').update({ is_active: false }).eq('is_active', true);
    await supabase.from('resume').insert([{ ...form, is_active: true, uploaded_at: new Date().toISOString() }]);
    setSaving(false);
    setAdding(false);
    setForm({ file_url: '', file_name: '' });
    load();
  };

  const remove = async (id: string) => {
    if (!confirm('Delete this resume?')) return;
    await supabase.from('resume').delete().eq('id', id);
    load();
  };

  const setActive = async (id: string) => {
    await supabase.from('resume').update({ is_active: false }).neq('id', id);
    await supabase.from('resume').update({ is_active: true }).eq('id', id);
    load();
  };

  if (loading) return <div className="flex items-center justify-center h-40"><div className="w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin" /></div>;

  return (
    <div className="max-w-2xl space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold text-foreground">Resume</h2>
        <button onClick={() => setAdding(true)} className="flex items-center gap-2 px-3 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors">
          <Plus size={15} /> Add Resume
        </button>
      </div>

      <div className="bg-card border border-border rounded-xl p-5">
        <p className="text-xs text-muted-foreground mb-4">
          Upload your resume to a cloud storage (Google Drive, Dropbox, etc.) and paste the public URL here. The active resume will be shown on your portfolio.
        </p>

        {adding && (
          <div className="border border-primary/30 rounded-xl p-4 space-y-3 mb-4">
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">Resume File URL *</label>
              <input type="url" value={form.file_url} onChange={(e) => setForm((f) => ({ ...f, file_url: e.target.value }))} placeholder="https://drive.google.com/..." className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary transition-colors" />
            </div>
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">File Name</label>
              <input type="text" value={form.file_name} onChange={(e) => setForm((f) => ({ ...f, file_name: e.target.value }))} placeholder="e.g. John_Doe_Resume.pdf" className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary transition-colors" />
            </div>
            <div className="flex gap-2">
              <button onClick={save} disabled={saving || !form.file_url} className="flex items-center gap-1.5 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-60">
                <Save size={14} />{saving ? 'Saving...' : 'Save & Set Active'}
              </button>
              <button onClick={() => setAdding(false)} className="px-4 py-2 border border-border rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">Cancel</button>
            </div>
          </div>
        )}

        <div className="space-y-3">
          {items.length === 0 && <p className="text-muted-foreground text-sm text-center py-6">No resume uploaded yet.</p>}
          {items.map((item) => (
            <div key={item.id} className={`flex items-center gap-3 rounded-xl p-3 border transition-colors ${item.is_active ? 'border-primary/40 bg-primary/5' : 'border-border bg-background'}`}>
              <div className="w-9 h-9 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
                <FileText size={16} className="text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium text-foreground truncate">{item.file_name || 'Resume.pdf'}</p>
                  {item.is_active && <span className="text-xs bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 px-1.5 py-0.5 rounded-full shrink-0">Active</span>}
                </div>
                <p className="text-xs text-muted-foreground">{new Date(item.uploaded_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
              </div>
              <div className="flex gap-1.5 shrink-0">
                <a href={item.file_url} target="_blank" rel="noopener noreferrer" className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"><Download size={13} /></a>
                {!item.is_active && <button onClick={() => setActive(item.id)} className="px-2.5 py-1.5 rounded-lg text-xs text-primary hover:bg-primary/10 transition-colors">Set Active</button>}
                <button onClick={() => remove(item.id)} className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"><Trash2 size={13} /></button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
