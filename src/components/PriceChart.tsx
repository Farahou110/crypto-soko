
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { TrendingUp, TrendingDown, Calendar, MapPin, BarChart3, Activity, Building2, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface PriceSource {
  name: string;
  price: number;
  lastUpdated: string;
  reliability: 'high' | 'medium' | 'low';
  url?: string;
}

interface FoodItem {
  name: string;
  englishName: string;
  currentPrice: number;
  previousPrice: number;
  county: string;
  unit: string;
  category: string;
  sources: PriceSource[];
}

interface PriceChartProps {
  item: FoodItem | null;
  isOpen: boolean;
  onClose: () => void;
}

const PriceChart: React.FC<PriceChartProps> = ({ item, isOpen, onClose }) => {

  if (!item) return null;

  // Generate more realistic historical data with volatility
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
        // More realistic price variations with market volatility
        const baseProgress = (days - i) / days;
        const basePrice = previousPrice + (currentPrice - previousPrice) * baseProgress;
        const volatility = priceRange * 0.12;
        const randomVariation = (Math.random() - 0.5) * volatility;
        const weeklyPattern = Math.sin((i / 7) * Math.PI) * (priceRange * 0.03);
        
        price = Math.max(0, basePrice + randomVariation + weeklyPattern);
      }
      
      // Generate volume and market activity data
      const volume = Math.floor(Math.random() * 1000) + 200;
      const activity = Math.floor(Math.random() * 50) + 10;
      
      data.push({
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        price: parseFloat(price.toFixed(2)),
        volume: volume,
        activity: activity,
        fullDate: date.toLocaleDateString('en-US', { 
          weekday: 'long', 
          month: 'long', 
          day: 'numeric',
          year: 'numeric'
        }),
        dayOfWeek: date.toLocaleDateString('en-US', { weekday: 'short' })
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
    volume: {
      label: "Market Volume",
      color: "#3b82f6",
    },
  };

  const minPrice = Math.min(...chartData.map(d => d.price));
  const maxPrice = Math.max(...chartData.map(d => d.price));
  const priceRange = maxPrice - minPrice;
  const yAxisMin = Math.max(0, minPrice - priceRange * 0.05);
  const yAxisMax = maxPrice + priceRange * 0.05;

  const priceChange = item.currentPrice - item.previousPrice;
  const priceChangePercent = ((priceChange / item.previousPrice) * 100);
  const isPositive = priceChange >= 0;

  // Calculate additional metrics
  const avgPrice = (chartData.reduce((sum, d) => sum + d.price, 0) / chartData.length);
  const volatility = Math.sqrt(chartData.reduce((sum, d) => sum + Math.pow(d.price - avgPrice, 2), 0) / chartData.length);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        className="max-w-[90vw] w-[90vw] max-h-[90vh] overflow-y-auto bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 border-0 shadow-2xl"
      >
        <DialogHeader className="space-y-4 pb-6">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <DialogTitle className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
                {item.name}
              </DialogTitle>
              <p className="text-xl text-gray-600 dark:text-gray-300 font-medium">{item.englishName}</p>
            </div>
            <div className="text-right space-y-2">
              <div className="text-3xl font-bold text-gray-900 dark:text-white">
                KSh {item.currentPrice.toFixed(2)}
              </div>
              <Badge variant={isPositive ? "destructive" : "default"} className={`text-sm font-semibold ${
                isPositive ? 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300' : 
                'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
              }`}>
                {isPositive ? <TrendingUp className="h-4 w-4 mr-1" /> : <TrendingDown className="h-4 w-4 mr-1" />}
                {isPositive ? '+' : ''}{priceChangePercent.toFixed(1)}%
              </Badge>
            </div>
          </div>
          
          <div className="flex items-center gap-6 text-sm text-gray-600 dark:text-gray-400">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              <span className="font-medium">{item.county} County</span>
            </div>
            <div className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              <span>Per {item.unit}</span>
            </div>
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4" />
              <span className="capitalize">{item.category}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>Last 30 Days</span>
            </div>
          </div>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Main Price Chart */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-lg">
            <div className="mb-4">
              <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2 flex items-center gap-2">
                <Activity className="h-5 w-5 text-emerald-600" />
                Price Movement Analysis
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Daily price tracking with market volatility indicators
              </p>
            </div>
            
            <ChartContainer config={chartConfig} className="h-[40vh] min-h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart 
                  data={chartData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                >
                  <defs>
                    <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                      <stop offset="50%" stopColor="#10b981" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0.05}/>
                    </linearGradient>
                    <linearGradient id="priceGradientDark" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#34d399" stopOpacity={0.3}/>
                      <stop offset="50%" stopColor="#34d399" stopOpacity={0.15}/>
                      <stop offset="95%" stopColor="#34d399" stopOpacity={0.05}/>
                    </linearGradient>
                  </defs>
                  
                  <CartesianGrid 
                    strokeDasharray="3 3" 
                    stroke="#e5e7eb" 
                    className="dark:stroke-gray-600"
                    opacity={0.5}
                  />
                  
                  <XAxis 
                    dataKey="date" 
                    fontSize={12}
                    tickLine={false}
                    axisLine={{ stroke: '#d1d5db', strokeWidth: 1 }}
                    tick={{ fill: '#6b7280' }}
                    className="dark:fill-gray-400"
                    angle={-45}
                    textAnchor="end"
                    height={60}
                    interval={Math.ceil(chartData.length / 8)}
                  />
                  
                  <YAxis 
                    fontSize={12}
                    tickLine={false}
                    axisLine={{ stroke: '#d1d5db', strokeWidth: 1 }}
                    tick={{ fill: '#6b7280' }}
                    className="dark:fill-gray-400"
                    domain={[yAxisMin, yAxisMax]}
                    tickFormatter={(value) => `${value.toFixed(0)}`}
                  />
                  
                  <ChartTooltip 
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        const value = payload[0].value;
                        const price = typeof value === 'number' ? value : parseFloat(value?.toString() || '0');
                        return (
                          <div className="bg-white dark:bg-gray-800 p-4 border border-gray-200 dark:border-gray-600 rounded-lg shadow-xl">
                            <p className="font-bold text-gray-800 dark:text-white text-lg mb-2">{data.fullDate}</p>
                            <div className="space-y-1">
                              <p className="text-emerald-600 dark:text-emerald-400 font-bold text-xl">
                                KSh {price.toFixed(2)} per {item.unit}
                              </p>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                Volume: {data.volume} units
                              </p>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                Activity: {data.activity} trades
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                                {data.dayOfWeek} trading session
                              </p>
                            </div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  
                  <Area 
                    type="monotone" 
                    dataKey="price" 
                    stroke="#10b981" 
                    strokeWidth={3}
                    fill="url(#priceGradient)"
                    className="dark:fill-[url(#priceGradientDark)]"
                    dot={{ 
                      fill: "#10b981", 
                      strokeWidth: 2, 
                      r: 4,
                      stroke: "#ffffff",
                      className: "dark:stroke-gray-800"
                    }}
                    activeDot={{ 
                      r: 8, 
                      stroke: "#10b981",
                      strokeWidth: 3,
                      fill: "#ffffff",
                      className: "dark:fill-gray-800 shadow-lg"
                    }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>
          
          {/* Enhanced Statistics Grid */}
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
            <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-900/20 dark:to-emerald-800/20 p-4 rounded-xl border border-emerald-200 dark:border-emerald-700">
              <p className="text-emerald-700 dark:text-emerald-300 font-medium text-sm">Current Price</p>
              <p className="font-bold text-2xl text-emerald-800 dark:text-emerald-200">KSh {item.currentPrice.toFixed(2)}</p>
            </div>
            
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 p-4 rounded-xl border border-blue-200 dark:border-blue-700">
              <p className="text-blue-700 dark:text-blue-300 font-medium text-sm">Previous Price</p>
              <p className="font-bold text-2xl text-blue-800 dark:text-blue-200">KSh {item.previousPrice.toFixed(2)}</p>
            </div>
            
            <div className={`bg-gradient-to-br p-4 rounded-xl border ${
              isPositive 
                ? 'from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 border-red-200 dark:border-red-700' 
                : 'from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green-200 dark:border-green-700'
            }`}>
              <p className={`font-medium text-sm ${
                isPositive ? 'text-red-700 dark:text-red-300' : 'text-green-700 dark:text-green-300'
              }`}>Price Change</p>
              <p className={`font-bold text-2xl ${
                isPositive ? 'text-red-800 dark:text-red-200' : 'text-green-800 dark:text-green-200'
              }`}>
                {isPositive ? '+' : ''}{priceChangePercent.toFixed(1)}%
              </p>
            </div>
            
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 p-4 rounded-xl border border-purple-200 dark:border-purple-700">
              <p className="text-purple-700 dark:text-purple-300 font-medium text-sm">Average Price</p>
              <p className="font-bold text-2xl text-purple-800 dark:text-purple-200">KSh {avgPrice.toFixed(2)}</p>
            </div>
            
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 p-4 rounded-xl border border-orange-200 dark:border-orange-700">
              <p className="text-orange-700 dark:text-orange-300 font-medium text-sm">Volatility</p>
              <p className="font-bold text-2xl text-orange-800 dark:text-orange-200">±{volatility.toFixed(1)}</p>
            </div>
            
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800/50 dark:to-gray-700/50 p-4 rounded-xl border border-gray-200 dark:border-gray-600">
              <p className="text-gray-700 dark:text-gray-300 font-medium text-sm capitalize">Category</p>
              <p className="font-bold text-2xl text-gray-800 dark:text-gray-200 capitalize">{item.category}</p>
            </div>
          </div>

          {/* Price Sources Section */}
          <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
                <Building2 className="h-5 w-5 text-blue-600" />
                Price Sources
              </CardTitle>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Verified retailers and vendors reporting this price
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {item.sources.map((source, index) => (
                  <div 
                    key={index}
                    className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-lg transition-shadow bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-750"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Building2 className="h-4 w-4 text-blue-600" />
                        {source.url ? (
                          <a 
                            href={source.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="font-semibold text-blue-600 dark:text-blue-400 text-sm hover:underline"
                          >
                            {source.name}
                          </a>
                        ) : (
                          <h4 className="font-semibold text-gray-800 dark:text-white text-sm">
                            {source.name}
                          </h4>
                        )}
                      </div>
                      <Badge 
                        variant={source.reliability === 'high' ? 'default' : 'secondary'}
                        className={`text-xs ${
                          source.reliability === 'high' 
                            ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' 
                            : source.reliability === 'medium'
                            ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300'
                            : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                        }`}
                      >
                        {source.reliability}
                      </Badge>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-600 dark:text-gray-400">Price</span>
                        <span className="font-bold text-lg text-emerald-600 dark:text-emerald-400">
                          KSh {source.price.toFixed(2)}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                        <Clock className="h-3 w-3" />
                        <span>Updated {source.lastUpdated}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PriceChart;
