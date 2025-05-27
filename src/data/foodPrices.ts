
export interface FoodItem {
  name: string;
  englishName: string;
  currentPrice: number;
  previousPrice: number;
  county: string;
  unit: string;
  category: string;
}

export const foodPricesData: FoodItem[] = [
  // Grains
  { name: 'Mahindi', englishName: 'Maize', currentPrice: 85.50, previousPrice: 80.00, county: 'Nairobi', unit: 'kg', category: 'grains' },
  { name: 'Mahindi', englishName: 'Maize', currentPrice: 75.00, previousPrice: 78.50, county: 'Nakuru', unit: 'kg', category: 'grains' },
  { name: 'Mchele', englishName: 'Rice', currentPrice: 145.00, previousPrice: 140.00, county: 'Mombasa', unit: 'kg', category: 'grains' },
  { name: 'Mchele', englishName: 'Rice', currentPrice: 150.00, previousPrice: 145.00, county: 'Nairobi', unit: 'kg', category: 'grains' },
  { name: 'Ngano', englishName: 'Wheat Flour', currentPrice: 120.00, previousPrice: 115.00, county: 'Eldoret', unit: 'kg', category: 'grains' },
  
  // Vegetables
  { name: 'Nyanya', englishName: 'Tomatoes', currentPrice: 60.00, previousPrice: 65.00, county: 'Nairobi', unit: 'kg', category: 'vegetables' },
  { name: 'Nyanya', englishName: 'Tomatoes', currentPrice: 45.00, previousPrice: 50.00, county: 'Meru', unit: 'kg', category: 'vegetables' },
  { name: 'Vitunguu', englishName: 'Onions', currentPrice: 70.00, previousPrice: 68.00, county: 'Kisumu', unit: 'kg', category: 'vegetables' },
  { name: 'Kabeji', englishName: 'Cabbage', currentPrice: 35.00, previousPrice: 40.00, county: 'Nyeri', unit: 'piece', category: 'vegetables' },
  { name: 'Karoti', englishName: 'Carrots', currentPrice: 80.00, previousPrice: 75.00, county: 'Nakuru', unit: 'kg', category: 'vegetables' },
  
  // Fruits
  { name: 'Ndizi', englishName: 'Bananas', currentPrice: 90.00, previousPrice: 85.00, county: 'Mombasa', unit: 'bunch', category: 'fruits' },
  { name: 'Machungwa', englishName: 'Oranges', currentPrice: 120.00, previousPrice: 125.00, county: 'Machakos', unit: 'kg', category: 'fruits' },
  { name: 'Maembe', englishName: 'Mangoes', currentPrice: 150.00, previousPrice: 140.00, county: 'Mombasa', unit: 'kg', category: 'fruits' },
  { name: 'Mapapai', englishName: 'Papaya', currentPrice: 80.00, previousPrice: 85.00, county: 'Kisumu', unit: 'kg', category: 'fruits' },
  
  // Dairy
  { name: 'Maziwa', englishName: 'Milk', currentPrice: 55.00, previousPrice: 52.00, county: 'Nakuru', unit: 'liter', category: 'dairy' },
  { name: 'Maziwa', englishName: 'Milk', currentPrice: 60.00, previousPrice: 58.00, county: 'Nairobi', unit: 'liter', category: 'dairy' },
  { name: 'Jibini', englishName: 'Cheese', currentPrice: 450.00, previousPrice: 430.00, county: 'Nairobi', unit: 'kg', category: 'dairy' },
  
  // Proteins
  { name: 'Nyama ya Ng\'ombe', englishName: 'Beef', currentPrice: 650.00, previousPrice: 620.00, county: 'Nairobi', unit: 'kg', category: 'proteins' },
  { name: 'Nyama ya Kuku', englishName: 'Chicken', currentPrice: 320.00, previousPrice: 310.00, county: 'Thika', unit: 'kg', category: 'proteins' },
  { name: 'Samaki', englishName: 'Fish', currentPrice: 400.00, previousPrice: 380.00, county: 'Mombasa', unit: 'kg', category: 'proteins' },
  { name: 'Maharagwe', englishName: 'Beans', currentPrice: 160.00, previousPrice: 155.00, county: 'Kitale', unit: 'kg', category: 'proteins' },
  { name: 'Dengu', englishName: 'Green Grams', currentPrice: 180.00, previousPrice: 175.00, county: 'Machakos', unit: 'kg', category: 'proteins' },
  
  // Additional items across more counties
  { name: 'Mahindi', englishName: 'Maize', currentPrice: 72.00, previousPrice: 75.00, county: 'Kitale', unit: 'kg', category: 'grains' },
  { name: 'Vitunguu', englishName: 'Onions', currentPrice: 65.00, previousPrice: 70.00, county: 'Meru', unit: 'kg', category: 'vegetables' },
  { name: 'Nyanya', englishName: 'Tomatoes', currentPrice: 55.00, previousPrice: 60.00, county: 'Eldoret', unit: 'kg', category: 'vegetables' },
  { name: 'Maziwa', englishName: 'Milk', currentPrice: 50.00, previousPrice: 48.00, county: 'Nyeri', unit: 'liter', category: 'dairy' },
  { name: 'Ndizi', englishName: 'Bananas', currentPrice: 80.00, previousPrice: 85.00, county: 'Kisumu', unit: 'bunch', category: 'fruits' },
];
