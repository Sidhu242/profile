'use client';

import { useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export default function VisitorCounter() {
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const record = async () => {
      try {
        await supabase.from('visitors').insert([{ page: window.location.pathname }]);
      } catch {
        // Supabase may be unavailable in preview — silently ignore
      }
    };
    record();
  }, []);

  return null;
}
