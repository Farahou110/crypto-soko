
import React from 'react';
import { TrendingUp, MapPin } from 'lucide-react';

const Header = () => {
  return (
    <header className="bg-white shadow-lg border-b border-gray-200">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-r from-emerald-500 to-orange-500 p-2 rounded-lg">
              <TrendingUp className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Chakula Bei</h1>
              <p className="text-sm text-gray-600">Food Price Tracker</p>
            </div>
          </div>
          <div className="flex items-center space-x-2 text-gray-600">
            <MapPin className="h-4 w-4" />
            <span className="text-sm">Kenya Counties</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
