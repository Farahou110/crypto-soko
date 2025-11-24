import React, { useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useRealtimePrices } from '@/hooks/useRealtimePrices';

const WeeklyHighlights = () => {
  const { prices } = useRealtimePrices();

  const highlights = useMemo(() => {
    if (!prices || prices.length === 0) {
      return { mostExpensive: null, cheapest: null, avgPrice: '0.00', totalItems: 0 };
    }
    const numericPrices = prices.map(p => (typeof p.price === 'string' ? parseFloat(p.price) : (p.price ?? 0)));
    const maxPrice = Math.max(...numericPrices);
    const minPrice = Math.min(...numericPrices);

    const mostExpensive = prices.find(p => (typeof p.price === 'string' ? parseFloat(p.price) : p.price) === maxPrice);
    const cheapest = prices.find(p => (typeof p.price === 'string' ? parseFloat(p.price) : p.price) === minPrice);

    const avgPrice = (numericPrices.reduce((a, b) => a + b, 0) / numericPrices.length).toFixed(2);

    return {
      mostExpensive,
      cheapest,
      avgPrice,
      totalItems: prices.length
    };
  }, [prices]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Weekly Highlights</CardTitle>
        <CardDescription>Top changes and summaries from the last 7 days</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 border rounded">
            <h3 className="font-semibold text-sm">Most Expensive</h3>
            <p className="text-lg font-bold">{highlights.mostExpensive?.commodities?.name ?? '—'}</p>
            <p className="text-sm text-muted-foreground">
              KES {(highlights.mostExpensive ? (typeof highlights.mostExpensive.price === 'string' ? parseFloat(highlights.mostExpensive.price) : highlights.mostExpensive.price) : '—')}
            </p>
          </div>

          <div className="p-4 border rounded">
            <h3 className="font-semibold text-sm">Cheapest</h3>
            <p className="text-lg font-bold">{highlights.cheapest?.commodities?.name ?? '—'}</p>
            <p className="text-sm text-muted-foreground">
              KES {(highlights.cheapest ? (typeof highlights.cheapest.price === 'string' ? parseFloat(highlights.cheapest.price) : highlights.cheapest.price) : '—')}
            </p>
          </div>

          <div className="p-4 border rounded">
            <h3 className="font-semibold text-sm">Average Price</h3>
            <p className="text-lg font-bold">KES {highlights.avgPrice}</p>
            <p className="text-sm text-muted-foreground">Across {highlights.totalItems} items</p>
          </div>

          <div className="p-4 border rounded">
            <h3 className="font-semibold text-sm">Alerts</h3>
            <p className="text-lg font-bold">No critical alerts</p>
            <p className="text-sm text-muted-foreground">Monitor notifications for price spikes</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WeeklyHighlights;