
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Star, AlertTriangle } from 'lucide-react';
import { foodPricesData } from '@/data/foodPrices';

const WeeklyHighlights = () => {
  // Calculate some mock highlights based on existing data
  const getHighlights = () => {
    const prices = foodPricesData.map(item => item.price);
    const maxPrice = Math.max(...prices);
    const minPrice = Math.min(...prices);
    
    const mostExpensive = foodPricesData.find(item => item.price === maxPrice);
    const cheapest = foodPricesData.find(item => item.price === minPrice);
    
    return {
      mostExpensive,
      cheapest,
      avgPrice: (prices.reduce((a, b) => a + b, 0) / prices.length).toFixed(2),
      totalItems: foodPricesData.length
    };
  };

  const highlights = getHighlights();

  const weeklyData = [
    {
      title: "Biggest Price Increase",
      item: "Beef (Premium)",
      change: "+15.2%",
      icon: TrendingUp,
      color: "text-red-600",
      description: "Significant increase due to supply constraints"
    },
    {
      title: "Best Value This Week",
      item: highlights.cheapest?.name || "Rice",
      change: `KSh ${highlights.cheapest?.price || 50}`,
      icon: Star,
      color: "text-green-600",
      description: "Excellent quality at competitive price"
    },
    {
      title: "Price Drop Alert",
      item: "Tomatoes",
      change: "-8.5%",
      icon: TrendingDown,
      color: "text-green-600",
      description: "Seasonal harvest driving prices down"
    },
    {
      title: "Supply Warning",
      item: "Cooking Oil",
      change: "Low Stock",
      icon: AlertTriangle,
      color: "text-orange-600",
      description: "Limited availability across counties"
    }
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Average Price</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">KSh {highlights.avgPrice}</div>
            <p className="text-xs text-gray-500">Across all items</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Most Expensive</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">KSh {highlights.mostExpensive?.price}</div>
            <p className="text-xs text-gray-500">{highlights.mostExpensive?.name}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Best Deal</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">KSh {highlights.cheapest?.price}</div>
            <p className="text-xs text-gray-500">{highlights.cheapest?.name}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{highlights.totalItems}</div>
            <p className="text-xs text-gray-500">Tracked products</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {weeklyData.map((item, index) => {
          const IconComponent = item.icon;
          return (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{item.title}</CardTitle>
                  <IconComponent className={`h-6 w-6 ${item.color}`} />
                </div>
                <CardDescription>{item.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <span className="font-semibold">{item.item}</span>
                  <span className={`font-bold ${item.color}`}>{item.change}</span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default WeeklyHighlights;
