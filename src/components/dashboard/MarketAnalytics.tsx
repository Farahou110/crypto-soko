
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { PieChart, Pie, Cell, ResponsiveContainer, AreaChart, Area, XAxis, YAxis } from 'recharts';
import { ShoppingCart, TrendingUp, Users, MapPin } from 'lucide-react';

const MarketAnalytics = () => {
  const categoryData = [
    { name: 'Grains', value: 35, color: '#10b981' },
    { name: 'Vegetables', value: 25, color: '#f59e0b' },
    { name: 'Proteins', value: 20, color: '#ef4444' },
    { name: 'Dairy', value: 12, color: '#8b5cf6' },
    { name: 'Others', value: 8, color: '#6b7280' }
  ];

  const demandData = [
    { week: 'W1', demand: 420 },
    { week: 'W2', demand: 380 },
    { week: 'W3', demand: 450 },
    { week: 'W4', demand: 520 },
    { week: 'W5', demand: 485 },
    { week: 'W6', demand: 610 }
  ];

  const topCounties = [
    { county: 'Nairobi', transactions: 1250, growth: '+12%' },
    { county: 'Mombasa', transactions: 890, growth: '+8%' },
    { county: 'Kisumu', transactions: 650, growth: '+15%' },
    { county: 'Nakuru', transactions: 580, growth: '+6%' },
    { county: 'Eldoret', transactions: 420, growth: '+9%' }
  ];

  const marketMetrics = [
    {
      title: 'Total Products',
      value: '1,247',
      change: '+23',
      icon: ShoppingCart,
      color: 'text-blue-600'
    },
    {
      title: 'Active Counties',
      value: '47',
      change: '+2',
      icon: MapPin,
      color: 'text-green-600'
    },
    {
      title: 'Price Queries',
      value: '15,420',
      change: '+1,250',
      icon: TrendingUp,
      color: 'text-purple-600'
    },
    {
      title: 'Users',
      value: '8,965',
      change: '+452',
      icon: Users,
      color: 'text-orange-600'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {marketMetrics.map((metric, index) => {
          const IconComponent = metric.icon;
          return (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{metric.title}</CardTitle>
                <IconComponent className={`h-4 w-4 ${metric.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metric.value}</div>
                <p className="text-xs text-green-600">
                  {metric.change} from last month
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Product Categories</CardTitle>
            <CardDescription>
              Distribution of products by category
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={{}} className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <ChartTooltip content={<ChartTooltipContent />} />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
            <div className="grid grid-cols-2 gap-2 mt-4">
              {categoryData.map((item, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <div 
                    className="w-3 h-3 rounded" 
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm">{item.name} ({item.value}%)</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Market Demand Trend</CardTitle>
            <CardDescription>
              Weekly search and inquiry volume
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={{ demand: { label: 'Demand', color: '#10b981' } }} className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={demandData}>
                  <XAxis dataKey="week" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Area
                    type="monotone"
                    dataKey="demand"
                    stroke="#10b981"
                    fill="#10b981"
                    fillOpacity={0.3}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Top Performing Counties</CardTitle>
          <CardDescription>
            Counties with highest market activity
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {topCounties.map((county, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-semibold text-emerald-600">
                      {index + 1}
                    </span>
                  </div>
                  <div>
                    <p className="font-semibold">{county.county}</p>
                    <p className="text-sm text-gray-600">
                      {county.transactions} transactions
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-green-600 font-semibold">
                    {county.growth}
                  </span>
                  <p className="text-xs text-gray-500">growth</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MarketAnalytics;
