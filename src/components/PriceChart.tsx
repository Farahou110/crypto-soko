
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';

interface FoodItem {
  name: string;
  englishName: string;
  currentPrice: number;
  previousPrice: number;
  county: string;
  unit: string;
  category: string;
}

interface PriceChartProps {
  item: FoodItem | null;
  isOpen: boolean;
  onClose: () => void;
}

const PriceChart: React.FC<PriceChartProps> = ({ item, isOpen, onClose }) => {
  if (!item) return null;

  // Generate mock historical data for demonstration
  const generateHistoricalData = (currentPrice: number, previousPrice: number) => {
    const data = [];
    const days = 30;
    const priceRange = Math.abs(currentPrice - previousPrice);
    
    for (let i = days; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      
      let price;
      if (i === 0) {
        price = currentPrice;
      } else if (i === 7) {
        price = previousPrice;
      } else {
        // Generate realistic price variations
        const variation = (Math.random() - 0.5) * priceRange * 0.3;
        const basePrice = previousPrice + ((previousPrice - currentPrice) / days) * (days - i);
        price = Math.max(0, basePrice + variation);
      }
      
      data.push({
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        price: parseFloat(price.toFixed(2))
      });
    }
    
    return data;
  };

  const chartData = generateHistoricalData(item.currentPrice, item.previousPrice);
  
  const chartConfig = {
    price: {
      label: "Price (KSh)",
      color: "#10b981",
    },
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            {item.name} ({item.englishName}) - Price History
          </DialogTitle>
          <p className="text-sm text-gray-600">
            {item.county} • Current: KSh {item.currentPrice.toFixed(2)}/{item.unit}
          </p>
        </DialogHeader>
        
        <div className="h-96 w-full mt-4">
          <ChartContainer config={chartConfig}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="date" 
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis 
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `KSh ${value}`}
                />
                <ChartTooltip 
                  content={<ChartTooltipContent />}
                  formatter={(value: number) => [`KSh ${value.toFixed(2)}`, 'Price']}
                  labelFormatter={(label) => `Date: ${label}`}
                />
                <Line 
                  type="monotone" 
                  dataKey="price" 
                  stroke="var(--color-price)" 
                  strokeWidth={2}
                  dot={{ fill: "var(--color-price)", strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
        
        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <p className="text-gray-600">Current Price</p>
              <p className="font-semibold">KSh {item.currentPrice.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-gray-600">Previous Price</p>
              <p className="font-semibold">KSh {item.previousPrice.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-gray-600">Change</p>
              <p className={`font-semibold ${item.currentPrice > item.previousPrice ? 'text-red-500' : 'text-green-500'}`}>
                {item.currentPrice > item.previousPrice ? '+' : ''}
                {((item.currentPrice - item.previousPrice) / item.previousPrice * 100).toFixed(1)}%
              </p>
            </div>
            <div>
              <p className="text-gray-600">Category</p>
              <p className="font-semibold capitalize">{item.category}</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PriceChart;
