
export interface PriceSource {
  name: string;
  price: number;
  lastUpdated: string;
  reliability: 'high' | 'medium' | 'low';
  url?: string;
}

export interface FoodItem {
  name: string;
  englishName: string;
  currentPrice: number;
  previousPrice: number;
  county: string;
  unit: string;
  category: string;
  sources: PriceSource[];
}

export const foodPricesData: FoodItem[] = [
  // Grains
  { name: 'Mahindi', englishName: 'Maize', currentPrice: 85.50, previousPrice: 80.00, county: 'Nairobi', unit: 'kg', category: 'grains', sources: [
    { name: 'Naivas Supermarket', price: 87.00, lastUpdated: '2 hours ago', reliability: 'high', url: 'https://naivas.online' },
    { name: 'Carrefour', price: 85.50, lastUpdated: '5 hours ago', reliability: 'high', url: 'https://carrefourkenya.com' },
    { name: 'Quickmart', price: 84.00, lastUpdated: '1 day ago', reliability: 'medium', url: 'https://quickmart.co.ke' }
  ]},
  { name: 'Mahindi', englishName: 'Maize', currentPrice: 73.50, previousPrice: 78.50, county: 'Nakuru', unit: 'kg', category: 'grains', sources: [
    { name: 'Local Market', price: 73.50, lastUpdated: '6 hours ago', reliability: 'medium' }
  ]},
  { name: 'Mchele', englishName: 'Rice', currentPrice: 145.00, previousPrice: 140.00, county: 'Mombasa', unit: 'kg', category: 'grains', sources: [
    { name: 'Naivas Supermarket', price: 145.00, lastUpdated: '1 hour ago', reliability: 'high', url: 'https://naivas.online' },
    { name: 'Chandarana', price: 147.00, lastUpdated: '4 hours ago', reliability: 'high', url: 'https://chandarana.co.ke' },
    { name: 'Jumia', price: 142.00, lastUpdated: '1 day ago', reliability: 'medium', url: 'https://jumia.co.ke' }
  ]},
  { name: 'Mchele', englishName: 'Rice', currentPrice: 150.00, previousPrice: 145.00, county: 'Nairobi', unit: 'kg', category: 'grains', sources: [
    { name: 'Carrefour', price: 150.00, lastUpdated: '2 hours ago', reliability: 'high', url: 'https://carrefourkenya.com' },
    { name: 'Naivas Supermarket', price: 149.50, lastUpdated: '3 hours ago', reliability: 'high', url: 'https://naivas.online' },
    { name: 'Quickmart', price: 151.00, lastUpdated: '5 hours ago', reliability: 'medium', url: 'https://quickmart.co.ke' }
  ]},
  { name: 'Ngano', englishName: 'Wheat Flour', currentPrice: 120.00, previousPrice: 115.00, county: 'Eldoret', unit: 'kg', category: 'grains', sources: [
    { name: 'Naivas Supermarket', price: 120.00, lastUpdated: '4 hours ago', reliability: 'high', url: 'https://naivas.online' }
  ]},
  
  // Vegetables
  { name: 'Nyanya', englishName: 'Tomatoes', currentPrice: 60.00, previousPrice: 65.00, county: 'Nairobi', unit: 'kg', category: 'vegetables', sources: [
    { name: 'Zucchini', price: 62.00, lastUpdated: '1 hour ago', reliability: 'high' },
    { name: 'Carrefour', price: 60.00, lastUpdated: '3 hours ago', reliability: 'high' },
    { name: 'Wakulima Market', price: 58.00, lastUpdated: '5 hours ago', reliability: 'medium' }
  ]},
  { name: 'Nyanya', englishName: 'Tomatoes', currentPrice: 45.00, previousPrice: 50.00, county: 'Meru', unit: 'kg', category: 'vegetables', sources: [
    { name: 'Local Market', price: 45.00, lastUpdated: '2 hours ago', reliability: 'high' },
    { name: 'Farmers Cooperative', price: 43.50, lastUpdated: '6 hours ago', reliability: 'medium' }
  ]},
  { name: 'Vitunguu', englishName: 'Onions', currentPrice: 72.00, previousPrice: 68.00, county: 'Kisumu', unit: 'kg', category: 'vegetables', sources: [
    { name: 'Naivas Supermarket', price: 72.00, lastUpdated: '4 hours ago', reliability: 'high' }
  ]},
  { name: 'Kabeji', englishName: 'Cabbage', currentPrice: 35.00, previousPrice: 40.00, county: 'Nyeri', unit: 'piece', category: 'vegetables', sources: [
    { name: 'Local Market', price: 35.00, lastUpdated: '1 hour ago', reliability: 'high' },
    { name: 'Quickmart', price: 38.00, lastUpdated: '8 hours ago', reliability: 'medium' }
  ]},
  { name: 'Karoti', englishName: 'Carrots', currentPrice: 80.00, previousPrice: 75.00, county: 'Nakuru', unit: 'kg', category: 'vegetables', sources: [
    { name: 'Naivas Supermarket', price: 80.00, lastUpdated: '2 hours ago', reliability: 'high' },
    { name: 'Carrefour', price: 82.00, lastUpdated: '5 hours ago', reliability: 'high' }
  ]},
  
  // Fruits
  { name: 'Ndizi', englishName: 'Bananas', currentPrice: 90.00, previousPrice: 85.00, county: 'Mombasa', unit: 'bunch', category: 'fruits', sources: [
    { name: 'Naivas Supermarket', price: 90.00, lastUpdated: '1 hour ago', reliability: 'high' },
    { name: 'Chandarana', price: 92.00, lastUpdated: '4 hours ago', reliability: 'high' },
    { name: 'Local Market', price: 88.00, lastUpdated: '6 hours ago', reliability: 'medium' }
  ]},
  { name: 'Machungwa', englishName: 'Oranges', currentPrice: 118.00, previousPrice: 125.00, county: 'Machakos', unit: 'kg', category: 'fruits', sources: [
    { name: 'Farmers Market', price: 118.00, lastUpdated: '1 day ago', reliability: 'medium' }
  ]},
  { name: 'Maembe', englishName: 'Mangoes', currentPrice: 150.00, previousPrice: 140.00, county: 'Mombasa', unit: 'kg', category: 'fruits', sources: [
    { name: 'Naivas Supermarket', price: 150.00, lastUpdated: '2 hours ago', reliability: 'high' },
    { name: 'Local Vendors', price: 145.00, lastUpdated: '5 hours ago', reliability: 'medium' }
  ]},
  { name: 'Mapapai', englishName: 'Papaya', currentPrice: 78.00, previousPrice: 85.00, county: 'Kisumu', unit: 'kg', category: 'fruits', sources: [
    { name: 'Local Market', price: 78.00, lastUpdated: '8 hours ago', reliability: 'medium' }
  ]},
  
  // Dairy
  { name: 'Maziwa', englishName: 'Milk', currentPrice: 55.00, previousPrice: 52.00, county: 'Nakuru', unit: 'liter', category: 'dairy', sources: [
    { name: 'Brookside', price: 55.00, lastUpdated: '1 hour ago', reliability: 'high' },
    { name: 'New KCC', price: 54.00, lastUpdated: '3 hours ago', reliability: 'high' },
    { name: 'Naivas Supermarket', price: 56.00, lastUpdated: '2 hours ago', reliability: 'high' }
  ]},
  { name: 'Maziwa', englishName: 'Milk', currentPrice: 60.00, previousPrice: 58.00, county: 'Nairobi', unit: 'liter', category: 'dairy', sources: [
    { name: 'Carrefour', price: 60.00, lastUpdated: '2 hours ago', reliability: 'high' },
    { name: 'Naivas Supermarket', price: 59.50, lastUpdated: '3 hours ago', reliability: 'high' },
    { name: 'Quickmart', price: 61.00, lastUpdated: '4 hours ago', reliability: 'medium' }
  ]},
  { name: 'Jibini', englishName: 'Cheese', currentPrice: 450.00, previousPrice: 430.00, county: 'Nairobi', unit: 'kg', category: 'dairy', sources: [
    { name: 'Carrefour', price: 450.00, lastUpdated: '1 hour ago', reliability: 'high' },
    { name: 'Naivas Supermarket', price: 455.00, lastUpdated: '5 hours ago', reliability: 'high' },
    { name: 'Jumia', price: 440.00, lastUpdated: '1 day ago', reliability: 'medium' }
  ]},
  
  // Proteins
  { name: 'Nyama ya Ng\'ombe', englishName: 'Beef', currentPrice: 650.00, previousPrice: 620.00, county: 'Nairobi', unit: 'kg', category: 'proteins', sources: [
    { name: 'Carrefour Butchery', price: 650.00, lastUpdated: '2 hours ago', reliability: 'high' },
    { name: 'Naivas Butchery', price: 655.00, lastUpdated: '4 hours ago', reliability: 'high' },
    { name: 'Local Butchery', price: 640.00, lastUpdated: '6 hours ago', reliability: 'medium' }
  ]},
  { name: 'Nyama ya Kuku', englishName: 'Chicken', currentPrice: 320.00, previousPrice: 310.00, county: 'Thika', unit: 'kg', category: 'proteins', sources: [
    { name: 'Kenchic', price: 320.00, lastUpdated: '1 hour ago', reliability: 'high' },
    { name: 'Naivas Supermarket', price: 325.00, lastUpdated: '3 hours ago', reliability: 'high' }
  ]},
  { name: 'Samaki', englishName: 'Fish', currentPrice: 400.00, previousPrice: 380.00, county: 'Mombasa', unit: 'kg', category: 'proteins', sources: [
    { name: 'Fish Market', price: 400.00, lastUpdated: '1 hour ago', reliability: 'high' },
    { name: 'Naivas Supermarket', price: 410.00, lastUpdated: '4 hours ago', reliability: 'high' },
    { name: 'Local Vendors', price: 390.00, lastUpdated: '6 hours ago', reliability: 'medium' }
  ]},
  { name: 'Maharagwe', englishName: 'Beans', currentPrice: 158.00, previousPrice: 155.00, county: 'Kitale', unit: 'kg', category: 'proteins', sources: [
    { name: 'Farmers Cooperative', price: 158.00, lastUpdated: '1 day ago', reliability: 'medium' }
  ]},
  { name: 'Dengu', englishName: 'Green Grams', currentPrice: 180.00, previousPrice: 175.00, county: 'Machakos', unit: 'kg', category: 'proteins', sources: [
    { name: 'Naivas Supermarket', price: 180.00, lastUpdated: '2 hours ago', reliability: 'high' },
    { name: 'Local Market', price: 175.00, lastUpdated: '8 hours ago', reliability: 'medium' }
  ]},
  
  // Additional items across more counties
  { name: 'Mahindi', englishName: 'Maize', currentPrice: 72.00, previousPrice: 75.00, county: 'Kitale', unit: 'kg', category: 'grains', sources: [
    { name: 'Farmers Cooperative', price: 72.00, lastUpdated: '3 hours ago', reliability: 'high' }
  ]},
  { name: 'Vitunguu', englishName: 'Onions', currentPrice: 65.00, previousPrice: 70.00, county: 'Meru', unit: 'kg', category: 'vegetables', sources: [
    { name: 'Local Market', price: 65.00, lastUpdated: '2 hours ago', reliability: 'high' }
  ]},
  { name: 'Nyanya', englishName: 'Tomatoes', currentPrice: 55.00, previousPrice: 60.00, county: 'Eldoret', unit: 'kg', category: 'vegetables', sources: [
    { name: 'Naivas Supermarket', price: 55.00, lastUpdated: '1 hour ago', reliability: 'high' },
    { name: 'Local Vendors', price: 53.00, lastUpdated: '5 hours ago', reliability: 'medium' }
  ]},
  { name: 'Maziwa', englishName: 'Milk', currentPrice: 50.00, previousPrice: 48.00, county: 'Nyeri', unit: 'liter', category: 'dairy', sources: [
    { name: 'New KCC', price: 50.00, lastUpdated: '2 hours ago', reliability: 'high' },
    { name: 'Brookside', price: 51.00, lastUpdated: '4 hours ago', reliability: 'high' }
  ]},
  { name: 'Ndizi', englishName: 'Bananas', currentPrice: 78.00, previousPrice: 85.00, county: 'Kisumu', unit: 'bunch', category: 'fruits', sources: [
    { name: 'Local Market', price: 78.00, lastUpdated: '1 day ago', reliability: 'medium' }
  ]},
];
