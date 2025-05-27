
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Header from '@/components/Header';
import WeeklyHighlights from '@/components/dashboard/WeeklyHighlights';
import NewProducts from '@/components/dashboard/NewProducts';
import PriceTrends from '@/components/dashboard/PriceTrends';
import MarketAnalytics from '@/components/dashboard/MarketAnalytics';
import PriceAlerts from '@/components/dashboard/PriceAlerts';

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-orange-50">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Food Market Dashboard</h1>
          <p className="text-lg text-gray-600">
            Monitor market trends, track price changes, and discover new products
          </p>
        </div>

        <Tabs defaultValue="highlights" className="w-full">
          <TabsList className="grid w-full grid-cols-5 mb-8">
            <TabsTrigger value="highlights">Weekly Highlights</TabsTrigger>
            <TabsTrigger value="trends">Price Trends</TabsTrigger>
            <TabsTrigger value="new-products">New Products</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="alerts">Price Alerts</TabsTrigger>
          </TabsList>

          <TabsContent value="highlights">
            <WeeklyHighlights />
          </TabsContent>

          <TabsContent value="trends">
            <PriceTrends />
          </TabsContent>

          <TabsContent value="new-products">
            <NewProducts />
          </TabsContent>

          <TabsContent value="analytics">
            <MarketAnalytics />
          </TabsContent>

          <TabsContent value="alerts">
            <PriceAlerts />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Dashboard;
