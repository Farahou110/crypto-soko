
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Plus, Star, MapPin } from 'lucide-react';

const NewProducts = () => {
  const newProducts = [
    {
      id: 1,
      name: "Organic Quinoa",
      englishName: "Quinoa",
      price: 450,
      county: "Nairobi",
      category: "Grains",
      addedDate: "2024-01-20",
      rating: 4.5,
      description: "Premium organic quinoa, rich in protein and fiber"
    },
    {
      id: 2,
      name: "Avocado Oil",
      englishName: "Avocado Oil",
      price: 380,
      county: "Meru",
      category: "Oils",
      addedDate: "2024-01-18",
      rating: 4.8,
      description: "Cold-pressed avocado oil, perfect for cooking"
    },
    {
      id: 3,
      name: "Sweet Potato Flour",
      englishName: "Sweet Potato Flour",
      price: 120,
      county: "Kisumu",
      category: "Flour",
      addedDate: "2024-01-15",
      rating: 4.3,
      description: "Gluten-free flour made from orange sweet potatoes"
    },
    {
      id: 4,
      name: "Chia Seeds",
      englishName: "Chia Seeds",
      price: 650,
      county: "Nakuru",
      category: "Seeds",
      addedDate: "2024-01-12",
      rating: 4.7,
      description: "Nutrient-dense superfood seeds"
    },
    {
      id: 5,
      name: "Coconut Milk",
      englishName: "Coconut Milk",
      price: 85,
      county: "Mombasa",
      category: "Dairy Alternative",
      addedDate: "2024-01-10",
      rating: 4.4,
      description: "Fresh coconut milk, no preservatives"
    },
    {
      id: 6,
      name: "Moringa Powder",
      englishName: "Moringa Powder",
      price: 320,
      county: "Machakos",
      category: "Supplements",
      addedDate: "2024-01-08",
      rating: 4.6,
      description: "Organic moringa leaf powder, vitamin-rich"
    }
  ];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">New Products</h2>
          <p className="text-gray-600">Recently added items to the marketplace</p>
        </div>
        <Button className="bg-emerald-600 hover:bg-emerald-700">
          <Plus className="h-4 w-4 mr-2" />
          Add Product
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {newProducts.map((product) => (
          <Card key={product.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{product.name}</CardTitle>
                  <CardDescription className="text-sm text-gray-500">
                    {product.englishName}
                  </CardDescription>
                </div>
                <Badge variant="secondary" className="bg-emerald-100 text-emerald-800">
                  New
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-2xl font-bold text-emerald-600">
                  KSh {product.price}
                </span>
                <div className="flex items-center space-x-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm text-gray-600">{product.rating}</span>
                </div>
              </div>
              
              <p className="text-sm text-gray-600">{product.description}</p>
              
              <div className="flex items-center justify-between text-sm text-gray-500">
                <div className="flex items-center space-x-1">
                  <MapPin className="h-3 w-3" />
                  <span>{product.county}</span>
                </div>
                <span>Added {formatDate(product.addedDate)}</span>
              </div>
              
              <Badge variant="outline" className="text-xs">
                {product.category}
              </Badge>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default NewProducts;
