import { useState, useMemo } from 'react';
import Header from '@/components/Header';
import SearchBar from '@/components/SearchBar';
import CountyFilter from '@/components/CountyFilter';
import FoodPriceCard from '@/components/FoodPriceCard';
import { useRealtimePrices } from '@/hooks/useRealtimePrices';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useState as useStateForEffects, useEffect } from 'react';

interface FoodItem {
  name: string;
  englishName: string;
  currentPrice: number;
  previousPrice: number;
  county: string;
  unit: string;
  category: string;
  priceHistory?: Array<{ date: string; price: number }>;
}

const Index = () => {
  const { prices, loading, error } = useRealtimePrices();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCounty, setSelectedCounty] = useState<string>('');
  const [selectedItem, setSelectedItem] = useState<FoodItem | null>(null);
  const [counties, setCounties] = useStateForEffects<any[]>([]);

  useEffect(() => {
    fetchCounties();
  }, []);

  const fetchCounties = async () => {
    try {
      const { data, error } = await supabase
        .from('counties')
        .select('id, name')
        .order('name');

      if (!error && data) {
        setCounties(data);
      }
    } catch (err) {
      console.error('Error fetching counties:', err);
    }
  };

  const foodItems: FoodItem[] = useMemo(() => {
    const items = new Map<string, FoodItem>();

    prices.forEach((price: any) => {
      const commodityName = price.commodities?.name || 'Unknown';
      const countyName = price.counties?.name || 'Unknown';
      const key = `${commodityName}-${countyName}`;

      if (!items.has(key)) {
        items.set(key, {
          name: commodityName,
          englishName: commodityName,
          currentPrice: Number(price.price) || 0,
          previousPrice: Number(price.price) || 0,
          county: countyName,
          unit: price.commodities?.unit || 'kg',
          category: price.commodities?.category || 'general',
          priceHistory: [
            {
              date: new Date(price.created_at).toLocaleDateString(),
              price: Number(price.price) || 0,
            },
          ],
        });
      } else {
        const item = items.get(key)!;
        item.priceHistory = item.priceHistory || [];
        item.priceHistory.push({
          date: new Date(price.created_at).toLocaleDateString(),
          price: Number(price.price) || 0,
        });
      }
    });

    return Array.from(items.values());
  }, [prices]);

  const filteredItems = useMemo(() => {
    return foodItems.filter((item) => {
      const matchesSearch =
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.englishName.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCounty = !selectedCounty || item.county === selectedCounty;
      return matchesSearch && matchesCounty;
    });
  }, [foodItems, searchTerm, selectedCounty]);

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-orange-50">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <Card className="border-red-200 bg-red-50">
            <CardHeader>
              <CardTitle className="text-red-800">Error Loading Prices</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-red-700">Failed to load price data. Please try again later.</p>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-orange-50">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Food Price Tracker</h1>
          <p className="text-lg text-gray-600">
            Compare prices across Kenya counties and track market trends
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
          <div className="lg:col-span-2">
            <SearchBar searchTerm={searchTerm} onSearchChange={setSearchTerm} />
          </div>
          <div className="lg:col-span-2">
            <CountyFilter counties={counties} selectedCounty={selectedCounty} onCountyChange={setSelectedCounty} />
          </div>
        </div>

        {loading ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-gray-500">Loading prices...</p>
            </CardContent>
          </Card>
        ) : filteredItems.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-gray-500">No prices found matching your search.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item, index) => (
              <div
                key={`${item.name}-${item.county}-${index}`}
                onClick={() => setSelectedItem(item)}
              >
                <FoodPriceCard
                  item={item}
                  onClick={() => setSelectedItem(item)}
                />
              </div>
            ))}
          </div>
        )}
      </main>

      {selectedItem && (
        <Dialog open={!!selectedItem} onOpenChange={(open) => !open && setSelectedItem(null)}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{selectedItem.name}</DialogTitle>
              <DialogDescription>
                {selectedItem.county} • {selectedItem.unit}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-gray-600">Current Price</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold text-gray-800">
                      KSh {selectedItem.currentPrice.toFixed(2)}
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-gray-600">Previous Price</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold text-gray-600">
                      KSh {selectedItem.previousPrice.toFixed(2)}
                    </p>
                  </CardContent>
                </Card>
              </div>

              {selectedItem.priceHistory && selectedItem.priceHistory.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Price History</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={selectedItem.priceHistory}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line
                          type="monotone"
                          dataKey="price"
                          stroke="#10b981"
                          dot={{ fill: '#10b981', r: 4 }}
                          name="Price (KSh)"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              )}

              <Button onClick={() => setSelectedItem(null)} className="w-full">
                Close
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default Index;
