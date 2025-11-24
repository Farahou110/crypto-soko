import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export type RealtimePriceRow = {
  id: string;
  price: string | number;
  commodity_id: string;
  county_id: string | null;
  seller_id?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
  commodities?: {
    id?: string;
    name?: string;
    unit?: string;
    description?: string | null;
  } | null;
  counties?: {
    id?: string;
    name?: string;
  } | null;
};

export function useRealtimePrices() {
  const [prices, setPrices] = useState<RealtimePriceRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let mounted = true;

    async function load() {
      try {
        setLoading(true);
        const { data, error: fetchError } = await supabase
          .from('prices')
          .select(`
            id, price, commodity_id, county_id, seller_id, created_at, updated_at,
            commodities(id, name, unit),
            counties(id, name)
          `)
          .order('created_at', { ascending: false });

        if (fetchError) throw fetchError;
        if (mounted) setPrices(data ?? []);
      } catch (err: any) {
        if (mounted) setError(err);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    load();

    const channel = supabase
      .channel('public:prices')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'prices' }, (payload: any) => {
        const newRow = payload.new ?? payload.record ?? payload.new_record;
        const oldRow = payload.old ?? payload.old_record;
        const ev = (payload.eventType || payload.event) as string | undefined;

        setPrices(prev => {
          if (!newRow && !oldRow) return prev;
          // INSERT
          if (ev === 'INSERT' || payload.event === 'INSERT') {
            return [newRow, ...prev];
          }
          // UPDATE
          if (ev === 'UPDATE' || payload.event === 'UPDATE') {
            return prev.map(p => (p.id === newRow.id ? newRow : p));
          }
          // DELETE
          if (ev === 'DELETE' || payload.event === 'DELETE') {
            return prev.filter(p => p.id !== (oldRow?.id ?? payload.old?.id));
          }
          // fallback: replace by id when newRow has id
          if (newRow?.id) {
            return prev.map(p => (p.id === newRow.id ? newRow : p));
          }
          return prev;
        });
      })
      .subscribe();

    return () => {
      mounted = false;
      supabase.removeChannel(channel);
    };
  }, []);

  return { prices, loading, error };
}