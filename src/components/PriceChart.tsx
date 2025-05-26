
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
        price: parseFloat(price.toFixed(2)),
        fullDate: date.toLocaleDateString('en-US', { 
          weekday: 'short', 
          month: 'short', 
          day: 'numeric' 
        })
      });
    }
    
    return data;
  };

  const chartData = generateHistoricalData(item.currentPrice, item.previousPrice);
  
  const chartConfig = {
    price: {
      label: `Price (KSh per ${item.unit})`,
      color: "#10b981",
    },
  };

  const minPrice = Math.min(...chartData.map(d => d.price));
  const maxPrice = Math.max(...chartData.map(d => d.price));
  const priceRange = maxPrice - minPrice;
  const yAxisMin = Math.max(0, minPrice - priceRange * 0.1);
  const yAxisMax = maxPrice + priceRange * 0.1;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[85vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-800">
            {item.name} ({item.englishName})
          </DialogTitle>
          <div className="flex items-center justify-between mt-2">
            <p className="text-sm text-gray-600 font-medium">
              {item.county} County • Current Price: KSh {item.currentPrice.toFixed(2)} per {item.unit}
            </p>
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
              item.currentPrice > item.previousPrice 
                ? 'bg-red-100 text-red-700' 
                : item.currentPrice < item.previousPrice 
                ? 'bg-green-100 text-green-700' 
                : 'bg-gray-100 text-gray-700'
            }`}>
              {item.currentPrice > item.previousPrice ? '↗' : item.currentPrice < item.previousPrice ? '↘' : '→'} 
              {' '}30-Day Trend
            </span>
          </div>
        </DialogHeader>
        
        <div className="h-[400px] w-full mt-6 bg-gradient-to-br from-gray-50 to-white p-4 rounded-lg border">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-700 mb-1">Price History (Last 30 Days)</h3>
            <p className="text-sm text-gray-500">Track price changes over time in {item.county}</p>
          </div>
          
          <ChartContainer config={chartConfig}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart 
                data={chartData}
                margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
              >
                <defs>
                  <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.05}/>
                  </linearGradient>
                </defs>
                
                <CartesianGrid 
                  strokeDasharray="3 3" 
                  stroke="#e5e7eb" 
                  opacity={0.7}
                />
                
                <XAxis 
                  dataKey="date" 
                  fontSize={11}
                  tickLine={false}
                  axisLine={{ stroke: '#d1d5db', strokeWidth: 1 }}
                  tick={{ fill: '#6b7280' }}
                  angle={-45}
                  textAnchor="end"
                  height={60}
                  interval={Math.ceil(chartData.length / 8)}
                  label={{ 
                    value: 'Date', 
                    position: 'insideBottom', 
                    offset: -5,
                    style: { textAnchor: 'middle', fill: '#374151', fontSize: '12px', fontWeight: 'bold' }
                  }}
                />
                
                <YAxis 
                  fontSize={11}
                  tickLine={false}
                  axisLine={{ stroke: '#d1d5db', strokeWidth: 1 }}
                  tick={{ fill: '#6b7280' }}
                  domain={[yAxisMin, yAxisMax]}
                  tickFormatter={(value) => `${value.toFixed(0)}`}
                  label={{ 
                    value: `Price (KSh per ${item.unit})`, 
                    angle: -90, 
                    position: 'insideLeft',
                    style: { textAnchor: 'middle', fill: '#374151', fontSize: '12px', fontWeight: 'bold' }
                  }}
                />
                
                <ChartTooltip 
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      const value = payload[0].value;
                      const price = typeof value === 'number' ? value : parseFloat(value?.toString() || '0');
                      return (
                        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
                          <p className="font-semibold text-gray-800">{data.fullDate}</p>
                          <p className="text-emerald-600 font-bold">
                            KSh {price.toFixed(2)} per {item.unit}
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                
                <Line 
                  type="monotone" 
                  dataKey="price" 
                  stroke="#10b981" 
                  strokeWidth={3}
                  dot={{ 
                    fill: "#10b981", 
                    strokeWidth: 2, 
                    r: 4,
                    stroke: "#ffffff"
                  }}
                  activeDot={{ 
                    r: 6, 
                    stroke: "#10b981",
                    strokeWidth: 2,
                    fill: "#ffffff"
                  }}
                  fill="url(#priceGradient)"
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
        
        <div className="mt-6 p-4 bg-gradient-to-r from-emerald-50 to-blue-50 rounded-lg border border-emerald-100">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="text-center">
              <p className="text-gray-600 font-medium">Current Price</p>
              <p className="font-bold text-lg text-emerald-600">KSh {item.currentPrice.toFixed(2)}</p>
            </div>
            <div className="text-center">
              <p className="text-gray-600 font-medium">Previous Price</p>
              <p className="font-bold text-lg text-gray-700">KSh {item.previousPrice.toFixed(2)}</p>
            </div>
            <div className="text-center">
              <p className="text-gray-600 font-medium">Price Change</p>
              <p className={`font-bold text-lg ${
                item.currentPrice > item.previousPrice ? 'text-red-500' : 
                item.currentPrice < item.previousPrice ? 'text-green-500' : 'text-gray-500'
              }`}>
                {item.currentPrice > item.previousPrice ? '+' : ''}
                {((item.currentPrice - item.previousPrice) / item.previousPrice * 100).toFixed(1)}%
              </p>
            </div>
            <div className="text-center">
              <p className="text-gray-600 font-medium">Category</p>
              <p className="font-bold text-lg text-gray-700 capitalize">{item.category}</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PriceChart;
