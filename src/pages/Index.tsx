
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import FoodPriceCard from '@/components/FoodPriceCard';
import CountyFilter from '@/components/CountyFilter';
import SearchBar from '@/components/SearchBar';
import PriceChart from '@/components/PriceChart';
import { Button } from '@/components/ui/button';
import { BarChart3, TrendingUp } from 'lucide-react';
import { foodPricesData, FoodItem } from '@/data/foodPrices';

const Index = () => {
  const [selectedCounty, setSelectedCounty] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedItem, setSelectedItem] = useState<FoodItem | null>(null);
  const [isChartOpen, setIsChartOpen] = useState(false);

  const filteredData = foodPricesData.filter(item => {
    const matchesCounty = selectedCounty === 'All' || item.county === selectedCounty;
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.englishName.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCounty && matchesSearch;
  });

  const handleItemClick = (item: FoodItem) => {
    setSelectedItem(item);
    setIsChartOpen(true);
  };

  const handleCloseChart = () => {
    setIsChartOpen(false);
    setSelectedItem(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-orange-50">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Commodity Price Tracker
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-6">
            Compare food prices across different counties in real-time. Track price changes and find the best deals in your area.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/dashboard">
              <Button className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3">
                <BarChart3 className="h-5 w-5 mr-2" />
                View Dashboard
              </Button>
            </Link>
            <Button variant="outline" className="px-6 py-3">
              <TrendingUp className="h-5 w-5 mr-2" />
              Market Trends
            </Button>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1">
            <SearchBar searchTerm={searchTerm} onSearchChange={setSearchTerm} />
          </div>
          <div className="md:w-64">
            <CountyFilter selectedCounty={selectedCounty} onCountyChange={setSelectedCounty} />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredData.map((item) => (
            <FoodPriceCard 
              key={`${item.name}-${item.county}`} 
              item={item} 
              onClick={() => handleItemClick(item)}
            />
          ))}
        </div>

        {filteredData.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No food items found matching your criteria.</p>
          </div>
        )}

        <PriceChart 
          item={selectedItem}
          isOpen={isChartOpen}
          onClose={handleCloseChart}
        />
      </main>
    </div>
  );
};

export default Index;
