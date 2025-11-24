import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import Header from '@/components/Header';
import { Plus, Edit, Trash2, Package, ArrowLeft } from 'lucide-react';

interface InventoryItem {
  id: string;
  commodity_id: string;
  quantity: number;
  unit: string;
  last_updated: string;
  commodities?: { name: string };
}

interface Commodity {
  id: string;
  name: string;
  unit: string;
}

const Inventory = () => {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [commodities, setCommodities] = useState<Commodity[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
  const [formData, setFormData] = useState({ commodity_id: '', quantity: '', unit: 'kg' });
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    checkAuth();
    fetchInventory();
    fetchCommodities();
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate('/auth');
    }
  };

  const fetchInventory = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('inventory')
        .select(`
          *,
          commodities ( name )
        `)
        .eq('seller_id', (await supabase.auth.getUser()).data.user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setInventory(data || []);
    } catch (error: any) {
      toast({ title: 'Error fetching inventory', description: error.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const fetchCommodities = async () => {
    try {
      const { data, error } = await supabase
        .from('commodities')
        .select('id, name, unit')
        .order('name');

      if (error) throw error;
      setCommodities(data || []);
    } catch (error: any) {
      toast({ title: 'Error fetching commodities', description: error.message, variant: 'destructive' });
    }
  };

  const openAdd = () => {
    setEditingItem(null);
    setFormData({ commodity_id: '', quantity: '', unit: 'kg' });
    setDialogOpen(true);
  };

  const openEdit = (item: InventoryItem) => {
    setEditingItem(item);
    setFormData({ commodity_id: item.commodity_id, quantity: String(item.quantity), unit: item.unit });
    setDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return toast({ title: 'Not authenticated', variant: 'destructive' });

      if (editingItem) {
        const { error } = await supabase.from('inventory').update({ quantity: parseFloat(formData.quantity), unit: formData.unit }).eq('id', editingItem.id);
        if (error) throw error;
        toast({ title: 'Inventory updated' });
      } else {
        const payload = { commodity_id: formData.commodity_id, quantity: parseFloat(formData.quantity), unit: formData.unit, seller_id: user.id };
        const { error } = await supabase.from('inventory').insert(payload);
        if (error) throw error;
        toast({ title: 'Inventory added' });
      }

      setDialogOpen(false);
      fetchInventory();
    } catch (err: any) {
      toast({ title: 'Error saving inventory', description: err.message, variant: 'destructive' });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase.from('inventory').delete().eq('id', id);
      if (error) throw error;
      toast({ title: 'Deleted' });
      fetchInventory();
    } catch (err: any) {
      toast({ title: 'Error deleting', description: err.message, variant: 'destructive' });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          <Link to="/">
            <Button variant="outline" className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </Link>

          <Card>
            <CardHeader>
              <CardTitle>Your Inventory</CardTitle>
              <CardDescription>Manage your current stock</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center mb-4">
                <div />
                <Button onClick={openAdd}><Plus className="mr-2"/>Add Item</Button>
              </div>

              {loading ? (
                <p>Loading…</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Item</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>Unit</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {inventory.map(i => (
                      <TableRow key={i.id}>
                        <TableCell>{i.commodities?.name ?? i.commodity_id}</TableCell>
                        <TableCell>{i.quantity}</TableCell>
                        <TableCell>{i.unit}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button variant="outline" onClick={() => openEdit(i)}><Edit/></Button>
                            <Button variant="destructive" onClick={() => handleDelete(i.id)}><Trash2/></Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}

            </CardContent>
          </Card>

        </div>
      </main>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingItem ? 'Edit Inventory' : 'Add Inventory'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <Label>Commodity</Label>
              <Select value={formData.commodity_id} onValueChange={(v) => setFormData({ ...formData, commodity_id: v })}>
                <SelectTrigger className="w-full"><SelectValue placeholder="Select commodity"/></SelectTrigger>
                <SelectContent>
                  {commodities.map(c => (
                    <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Quantity</Label>
              <Input value={formData.quantity} onChange={(e) => setFormData({ ...formData, quantity: e.target.value })} />
            </div>

            <div>
              <Label>Unit</Label>
              <Input value={formData.unit} onChange={(e) => setFormData({ ...formData, unit: e.target.value })} />
            </div>

            <div className="flex gap-2 justify-end">
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
              <Button type="submit">Save</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Inventory;