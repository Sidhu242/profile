'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Contact } from '@/lib/types';
import { Mail, Trash2, CheckCircle, Clock } from 'lucide-react';

export default function ContactsManager() {
  const [items, setItems] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Contact | null>(null);

  const load = async () => {
    const { data } = await supabase.from('contacts').select('*').order('created_at', { ascending: false });
    setItems(data || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const markRead = async (id: string) => {
    await supabase.from('contacts').update({ is_read: true }).eq('id', id);
    setItems((prev) => prev.map((c) => c.id === id ? { ...c, is_read: true } : c));
    if (selected?.id === id) setSelected((s) => s ? { ...s, is_read: true } : s);
  };

  const remove = async (id: string) => {
    if (!confirm('Delete this message?')) return;
    await supabase.from('contacts').delete().eq('id', id);
    if (selected?.id === id) setSelected(null);
    load();
  };

  const openMessage = (contact: Contact) => {
    setSelected(contact);
    if (!contact.is_read) markRead(contact.id);
  };

  if (loading) return <div className="flex items-center justify-center h-40"><div className="w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin" /></div>;

  const unread = items.filter((c) => !c.is_read).length;

  return (
    <div className="max-w-4xl">
      <div className="flex items-center gap-3 mb-4">
        <h2 className="text-base font-semibold text-foreground">Contact Messages</h2>
        {unread > 0 && (
          <span className="text-xs bg-rose-500 text-white px-2 py-0.5 rounded-full font-semibold">{unread} unread</span>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        {/* Message list */}
        <div className="lg:col-span-2 space-y-2">
          {items.length === 0 && <p className="text-muted-foreground text-sm text-center py-8 bg-card border border-border rounded-xl">No messages yet.</p>}
          {items.map((contact) => (
            <button
              key={contact.id}
              onClick={() => openMessage(contact)}
              className={`w-full text-left rounded-xl p-3 border transition-all duration-200 ${
                selected?.id === contact.id
                  ? 'border-primary/50 bg-primary/5'
                  : 'border-border bg-card hover:border-primary/30 hover:bg-muted/50'
              }`}
            >
              <div className="flex items-start gap-2">
                <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${contact.is_read ? 'bg-transparent' : 'bg-primary'}`} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1 mb-0.5">
                    <p className={`text-sm truncate ${contact.is_read ? 'text-muted-foreground' : 'text-foreground font-semibold'}`}>{contact.name}</p>
                    <p className="text-xs text-muted-foreground shrink-0">{new Date(contact.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p>
                  </div>
                  <p className="text-xs text-muted-foreground truncate">{contact.subject || contact.message}</p>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Message detail */}
        <div className="lg:col-span-3">
          {selected ? (
            <div className="bg-card border border-border rounded-xl p-5 space-y-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-base font-semibold text-foreground">{selected.subject || 'No Subject'}</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">From {selected.name} &lt;{selected.email}&gt;</p>
                </div>
                <div className="flex gap-1.5 shrink-0">
                  {!selected.is_read && (
                    <button onClick={() => markRead(selected.id)} className="p-1.5 rounded-lg text-muted-foreground hover:text-emerald-500 hover:bg-emerald-500/10 transition-colors" title="Mark as read">
                      <CheckCircle size={15} />
                    </button>
                  )}
                  <button onClick={() => remove(selected.id)} className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors">
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-3 text-xs text-muted-foreground border-t border-border pt-3">
                <div className="flex items-center gap-1">
                  <Clock size={12} />
                  {new Date(selected.created_at).toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                </div>
                <div className="flex items-center gap-1">
                  {selected.is_read ? <CheckCircle size={12} className="text-emerald-500" /> : <div className="w-2 h-2 bg-primary rounded-full" />}
                  {selected.is_read ? 'Read' : 'Unread'}
                </div>
              </div>

              <div className="bg-background rounded-lg p-4 text-sm text-foreground leading-relaxed whitespace-pre-wrap border border-border">
                {selected.message}
              </div>

              <a
                href={`mailto:${selected.email}?subject=Re: ${selected.subject || 'Your message'}`}
                className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
              >
                <Mail size={14} />
                Reply via Email
              </a>
            </div>
          ) : (
            <div className="bg-card border border-border rounded-xl p-8 text-center h-full flex items-center justify-center">
              <div>
                <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mx-auto mb-3">
                  <Mail size={20} className="text-muted-foreground" />
                </div>
                <p className="text-muted-foreground text-sm">Select a message to read</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
