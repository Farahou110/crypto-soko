
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { TrendingUp, TrendingDown } from 'lucide-react';

const PriceTrends = () => {
  const priceData = [
    { month: 'Jan', rice: 65, maize: 45, beans: 120, tomatoes: 80 },
    { month: 'Feb', rice: 68, maize: 48, beans: 115, tomatoes: 75 },
    { month: 'Mar', rice: 70, maize: 50, beans: 125, tomatoes: 85 },
    { month: 'Apr', rice: 72, maize: 52, beans: 130, tomatoes: 90 },
    { month: 'May', rice: 75, maize: 55, beans: 135, tomatoes: 88 },
    { month: 'Jun', rice: 73, maize: 53, beans: 128, tomatoes: 82 }
  ];

  const countyPrices = [
    { county: 'Nairobi', avgPrice: 145 },
    { county: 'Mombasa', avgPrice: 138 },
    { county: 'Kisumu', avgPrice: 125 },
    { county: 'Nakuru', avgPrice: 118 },
    { county: 'Eldoret', avgPrice: 115 },
    { county: 'Nyeri', avgPrice: 132 }
  ];

  const chartConfig = {
    rice: { label: 'Rice', color: '#10b981' },
    maize: { label: 'Maize', color: '#f59e0b' },
    beans: { label: 'Beans', color: '#ef4444' },
    tomatoes: { label: 'Tomatoes', color: '#8b5cf6' }
  };

  const priceChanges = [
    { item: 'Rice', change: '+8.2%', trend: 'up', price: 'KSh 75' },
    { item: 'Maize', change: '+6.5%', trend: 'up', price: 'KSh 55' },
    { item: 'Beans', change: '+12.1%', trend: 'up', price: 'KSh 135' },
    { item: 'Tomatoes', change: '-3.2%', trend: 'down', price: 'KSh 82' }
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Price Trends (6 Months)</CardTitle>
            <CardDescription>
              Track price changes over time for key food items
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={priceData}>
                  <XAxis dataKey="month" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line 
                    type="monotone" 
                    dataKey="rice" 
                    stroke={chartConfig.rice.color} 
                    strokeWidth={2}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="maize" 
                    stroke={chartConfig.maize.color} 
                    strokeWidth={2}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="beans" 
                    stroke={chartConfig.beans.color} 
                    strokeWidth={2}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="tomatoes" 
                    stroke={chartConfig.tomatoes.color} 
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Average Prices by County</CardTitle>
            <CardDescription>
              Compare average food prices across different counties
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={{ avgPrice: { label: 'Average Price', color: '#10b981' } }} className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={countyPrices}>
                  <XAxis dataKey="county" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="avgPrice" fill="#10b981" />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Monthly Price Changes</CardTitle>
          <CardDescription>
            Latest month-over-month price changes for key items
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {priceChanges.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <p className="font-semibold">{item.item}</p>
                  <p className="text-sm text-gray-600">{item.price}</p>
                </div>
                <div className="flex items-center space-x-2">
                  {item.trend === 'up' ? (
                    <TrendingUp className="h-4 w-4 text-red-500" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-green-500" />
                  )}
                  <span className={`font-semibold ${
                    item.trend === 'up' ? 'text-red-500' : 'text-green-500'
                  }`}>
                    {item.change}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PriceTrends;
