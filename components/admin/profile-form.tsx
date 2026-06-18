'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Profile } from '@/lib/types';
import { Save, CheckCircle } from 'lucide-react';

export default function ProfileForm() {
  const [profile, setProfile] = useState<Partial<Profile>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [interestInput, setInterestInput] = useState('');

  useEffect(() => {
    supabase.from('profiles').select('*').limit(1).then(({ data }) => {
      if (data?.[0]) setProfile(data[0]);
      setLoading(false);
    });
  }, []);

  const handleSave = async () => {
    setSaving(true);
    const { id, created_at, ...rest } = profile as Profile;

    if (id) {
      await supabase.from('profiles').update({ ...rest, updated_at: new Date().toISOString() }).eq('id', id);
    } else {
      await supabase.from('profiles').insert([rest]);
    }

    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const addInterest = () => {
    if (!interestInput.trim()) return;
    setProfile((p) => ({ ...p, interests: [...(p.interests || []), interestInput.trim()] }));
    setInterestInput('');
  };

  const removeInterest = (idx: number) => {
    setProfile((p) => ({ ...p, interests: (p.interests || []).filter((_, i) => i !== idx) }));
  };

  if (loading) return <div className="flex items-center justify-center h-40"><div className="w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin" /></div>;

  const field = (label: string, key: keyof Profile, type = 'text', placeholder = '') => (
    <div>
      <label className="block text-xs font-medium text-muted-foreground mb-1.5">{label}</label>
      <input
        type={type}
        value={(profile[key] as string) || ''}
        onChange={(e) => setProfile((p) => ({ ...p, [key]: e.target.value }))}
        placeholder={placeholder}
        className="w-full px-3 py-2.5 text-sm bg-background border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-colors"
      />
    </div>
  );

  const textarea = (label: string, key: keyof Profile, placeholder = '', rows = 3) => (
    <div>
      <label className="block text-xs font-medium text-muted-foreground mb-1.5">{label}</label>
      <textarea
        rows={rows}
        value={(profile[key] as string) || ''}
        onChange={(e) => setProfile((p) => ({ ...p, [key]: e.target.value }))}
        placeholder={placeholder}
        className="w-full px-3 py-2.5 text-sm bg-background border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-colors resize-none"
      />
    </div>
  );

  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold text-foreground">Edit Profile</h2>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-all disabled:opacity-60"
        >
          {saved ? <CheckCircle size={15} /> : <Save size={15} />}
          {saved ? 'Saved!' : saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      <div className="bg-card border border-border rounded-xl p-5 space-y-4">
        <h3 className="text-sm font-semibold text-foreground pb-2 border-b border-border">Basic Info</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {field('Full Name', 'full_name', 'text', 'Your full name')}
          {field('Professional Title', 'title', 'text', 'e.g. Data Analyst & Developer')}
        </div>
        {textarea('Summary (Hero)', 'summary', 'Short tagline shown in the hero section', 2)}
        {textarea('Bio (About)', 'bio', 'Detailed bio shown in the About section', 4)}
        {textarea('Career Objective', 'career_objective', 'Your career goals and objectives', 3)}
      </div>

      <div className="bg-card border border-border rounded-xl p-5 space-y-4">
        <h3 className="text-sm font-semibold text-foreground pb-2 border-b border-border">Education & Location</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {field('University', 'university', 'text', 'University name')}
          {field('Education Level', 'education_level', 'text', "e.g. Bachelor's in Computer Science")}
          {field('Location', 'location', 'text', 'City, Country')}
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl p-5 space-y-4">
        <h3 className="text-sm font-semibold text-foreground pb-2 border-b border-border">Social Links</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {field('Email', 'email', 'email', 'your@email.com')}
          {field('GitHub URL', 'github_url', 'url', 'https://github.com/username')}
          {field('LinkedIn URL', 'linkedin_url', 'url', 'https://linkedin.com/in/username')}
          {field('Twitter URL', 'twitter_url', 'url', 'https://twitter.com/username')}
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl p-5 space-y-4">
        <h3 className="text-sm font-semibold text-foreground pb-2 border-b border-border">Media</h3>
        {field('Profile Image URL', 'profile_image_url', 'url', 'https://...')}
      </div>

      <div className="bg-card border border-border rounded-xl p-5 space-y-4">
        <h3 className="text-sm font-semibold text-foreground pb-2 border-b border-border">Interests</h3>
        <div className="flex gap-2">
          <input
            type="text"
            value={interestInput}
            onChange={(e) => setInterestInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addInterest())}
            placeholder="Add an interest and press Enter"
            className="flex-1 px-3 py-2.5 text-sm bg-background border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-colors"
          />
          <button
            onClick={addInterest}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
          >
            Add
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {(profile.interests || []).map((interest, idx) => (
            <span key={idx} className="flex items-center gap-1.5 px-2.5 py-1 bg-primary/10 text-primary border border-primary/20 rounded-full text-xs font-medium">
              {interest}
              <button onClick={() => removeInterest(idx)} className="hover:text-destructive transition-colors">&times;</button>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
