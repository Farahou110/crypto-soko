import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

type AlertRow = {
  id: string;
  user_id: string;
  commodity_id: string;
  county_id?: string | null;
  alert_type: string;
  threshold_price?: number | null;
  is_active?: boolean | null;
  created_at?: string | null;
  commodities?: { id?: string; name?: string } | null;
  counties?: { id?: string; name?: string } | null;
};

export default function PriceAlerts() {
  const [alerts, setAlerts] = useState<AlertRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({ commodity_id: '', alert_type: 'price_threshold', threshold_price: '' });

  const fetchAlerts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('price_alerts')
        .select('id, user_id, commodity_id, county_id, alert_type, threshold_price, is_active, created_at, commodities(id, name), counties(id, name)')
        .order('created_at', { ascending: false });
      if (error) throw error;
      setAlerts(data ?? []);
    } catch (err) {
      console.error('Error loading alerts', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAlerts(); }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.commodity_id) return;
    setCreating(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        console.error('User not authenticated');
        setCreating(false);
        return;
      }
      const payload = {
        commodity_id: form.commodity_id,
        alert_type: form.alert_type,
        threshold_price: form.threshold_price ? parseFloat(form.threshold_price) : null,
        is_active: true,
        user_id: user.id
      };
      const { data, error } = await supabase.from('price_alerts').insert(payload).select().single();
      if (error) throw error;
      setAlerts(prev => [data, ...prev]);
      setForm({ commodity_id: '', alert_type: 'price_threshold', threshold_price: '' });
    } catch (err) {
      console.error('Error creating alert', err);
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase.from('price_alerts').delete().eq('id', id);
      if (error) throw error;
      setAlerts(prev => prev.filter(a => a.id !== id));
    } catch (err) {
      console.error('Error deleting alert', err);
    }
  };

  const toggleActive = async (id: string, current: boolean | null | undefined) => {
    try {
      const { data, error } = await supabase.from('price_alerts').update({ is_active: !current }).eq('id', id).select().single();
      if (error) throw error;
      setAlerts(prev => prev.map(a => (a.id === id ? data : a)));
    } catch (err) {
      console.error('Error toggling alert', err);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Price Alerts</CardTitle>
        <CardDescription>Tracked price alerts</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleCreate} className="flex gap-2 mb-4">
          <Input placeholder="Commodity ID" value={form.commodity_id} onChange={(e) => setForm({ ...form, commodity_id: e.target.value })} />
          <Select value={form.alert_type} onValueChange={(v) => setForm({ ...form, alert_type: v })}>
            <SelectTrigger className="w-[180px]"><SelectValue/></SelectTrigger>
            <SelectContent>
              <SelectItem value="price_threshold">Price threshold</SelectItem>
              <SelectItem value="price_increase">Price increase</SelectItem>
              <SelectItem value="price_decrease">Price decrease</SelectItem>
            </SelectContent>
          </Select>
          <Input placeholder="Threshold" value={form.threshold_price} onChange={(e) => setForm({ ...form, threshold_price: e.target.value })} />
          <Button type="submit" disabled={creating}>{creating ? 'Adding...' : 'Add'}</Button>
        </form>

        {loading ? (
          <p className="text-sm text-muted-foreground">Loading alerts…</p>
        ) : alerts.length === 0 ? (
          <p className="text-sm text-muted-foreground">No alerts yet.</p>
        ) : (
          <ul className="space-y-2">
            {alerts.map(a => (
              <li key={a.id} className="p-2 border rounded flex justify-between items-center">
                <div>
                  <div className="font-medium">{a.commodities?.name ?? a.commodity_id}</div>
                  <div className="text-sm text-muted-foreground">{a.alert_type} {a.threshold_price ? `@ KES ${a.threshold_price}` : ''}</div>
                  <div className="text-xs text-gray-500">{a.counties?.name ?? 'All counties'}</div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => toggleActive(a.id, a.is_active)}>{a.is_active ? 'Disable' : 'Enable'}</Button>
                  <Button variant="destructive" onClick={() => handleDelete(a.id)}>Delete</Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}