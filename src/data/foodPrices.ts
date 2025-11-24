// This file previously contained extensive mock data.
// Keep a small fallback to avoid import errors; real data now comes from Supabase.
export type PriceSource = {
  name: string;
  price: number;
  lastUpdated?: string;
  reliability?: 'high' | 'medium' | 'low';
  url?: string;
};

export type FoodItem = {
  id?: string;
  name: string;
  englishName?: string;
  currentPrice: number;
  previousPrice?: number;
  county: string;
  unit?: string;
  category?: string;
  sources?: PriceSource[];
};

// Empty fallback array — production UI uses Supabase queries instead.
export const foodPricesData: FoodItem[] = [];