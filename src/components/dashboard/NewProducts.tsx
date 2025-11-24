import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';

type Commodity = {
  id: string;
  name: string;
  unit?: string;
  created_at?: string | null;
  description?: string | null;
};

const NewProducts = () => {
  const [items, setItems] = useState<Commodity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('commodities')
          .select('id, name, unit, created_at, description')
          .order('created_at', { ascending: false })
          .limit(8);

        if (error) throw error;
        if (mounted) setItems(data ?? []);
      } catch (err) {
        console.error('Error loading new products', err);
      } finally {
        setLoading(false);
      }
    }
    load();
    return () => { mounted = false; };
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>New Products</CardTitle>
        <CardDescription>Recently added items to the marketplace</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <p className="text-sm text-muted-foreground">Loading new products…</p>
        ) : items.length === 0 ? (
          <p className="text-sm text-muted-foreground">No new products found</p>
        ) : (
          <ul className="space-y-3">
            {items.map(item => (
              <li key={item.id} className="p-2 border rounded">
                <div className="font-semibold">{item.name}</div>
                <div className="text-sm text-muted-foreground">{item.unit ?? 'unit'}</div>
                <div className="text-xs text-gray-500">{item.created_at ? new Date(item.created_at).toLocaleDateString() : ''}</div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
};

export default NewProducts;