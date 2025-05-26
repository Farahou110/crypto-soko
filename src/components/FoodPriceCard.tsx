
import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FoodItem {
  name: string;
  englishName: string;
  currentPrice: number;
  previousPrice: number;
  county: string;
  unit: string;
  category: string;
}

interface FoodPriceCardProps {
  item: FoodItem;
}

const FoodPriceCard: React.FC<FoodPriceCardProps> = ({ item }) => {
  const priceChange = item.currentPrice - item.previousPrice;
  const percentageChange = ((priceChange / item.previousPrice) * 100);
  
  const getTrendIcon = () => {
    if (priceChange > 0) return <TrendingUp className="h-4 w-4" />;
    if (priceChange < 0) return <TrendingDown className="h-4 w-4" />;
    return <Minus className="h-4 w-4" />;
  };

  const getTrendColor = () => {
    if (priceChange > 0) return 'text-red-500';
    if (priceChange < 0) return 'text-green-500';
    return 'text-gray-500';
  };

  const getCategoryColor = () => {
    switch (item.category) {
      case 'grains': return 'bg-amber-100 text-amber-800';
      case 'vegetables': return 'bg-green-100 text-green-800';
      case 'fruits': return 'bg-orange-100 text-orange-800';
      case 'dairy': return 'bg-blue-100 text-blue-800';
      case 'proteins': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden group hover:scale-105">
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-xl font-bold text-gray-800 mb-1">{item.name}</h3>
            <p className="text-sm text-gray-500">{item.englishName}</p>
          </div>
          <span className={cn("px-2 py-1 rounded-full text-xs font-medium", getCategoryColor())}>
            {item.category}
          </span>
        </div>

        <div className="mb-4">
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-bold text-gray-800">
              KSh {item.currentPrice.toFixed(2)}
            </span>
            <span className="text-sm text-gray-500">/{item.unit}</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-gray-600">
            <span className="text-sm">{item.county}</span>
          </div>
          <div className={cn("flex items-center space-x-1", getTrendColor())}>
            {getTrendIcon()}
            <span className="text-sm font-medium">
              {priceChange !== 0 ? `${priceChange > 0 ? '+' : ''}${percentageChange.toFixed(1)}%` : '0%'}
            </span>
          </div>
        </div>

        <div className="mt-3 pt-3 border-t border-gray-100">
          <div className="flex justify-between text-xs text-gray-500">
            <span>Previous: KSh {item.previousPrice.toFixed(2)}</span>
            <span>Change: KSh {priceChange.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FoodPriceCard;
