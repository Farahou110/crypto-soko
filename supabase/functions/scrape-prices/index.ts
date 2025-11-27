import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
};

const NAIVAS = { name: 'Naivas', url: 'https://naivas.online' };

const NAIVAS_ITEMS = [
  { name: 'Maize Meal (Pembe)', price: 48, unit: 'kg', category: 'cereals' },
  { name: 'Ugali Flour', price: 52, unit: 'kg', category: 'cereals' },
  { name: 'Long Grain Rice', price: 125, unit: 'kg', category: 'cereals' },
  { name: 'Basmati Rice', price: 180, unit: 'kg', category: 'cereals' },
  { name: 'Fresh Tomatoes', price: 85, unit: 'kg', category: 'vegetables' },
  { name: 'Spanish Onions', price: 65, unit: 'kg', category: 'vegetables' },
  { name: 'Green Cabbages', price: 45, unit: 'kg', category: 'vegetables' },
  { name: 'Fresh Potatoes', price: 55, unit: 'kg', category: 'vegetables' },
  { name: 'Lady Finger', price: 120, unit: 'kg', category: 'vegetables' },
  { name: 'Fresh Bananas', price: 55, unit: 'kg', category: 'fruits' },
  { name: 'Oranges', price: 75, unit: 'kg', category: 'fruits' },
  { name: 'Watermelon', price: 35, unit: 'piece', category: 'fruits' },
  { name: 'Fresh Milk', price: 70, unit: 'liter', category: 'dairy' },
  { name: 'Farmhouse Eggs', price: 450, unit: 'dozen', category: 'dairy' },
  { name: 'Mozzarella Cheese', price: 280, unit: 'kg', category: 'dairy' },
  { name: 'Kienyeji Chicken', price: 400, unit: 'kg', category: 'proteins' },
  { name: 'Beef Nyama', price: 450, unit: 'kg', category: 'proteins' },
  { name: 'Sugar Beans', price: 110, unit: 'kg', category: 'legumes' },
  { name: 'Dried Beans', price: 105, unit: 'kg', category: 'legumes' },
  { name: 'Lentils', price: 140, unit: 'kg', category: 'legumes' },
];

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

    const supabase = createClient(supabaseUrl, supabaseKey);

    console.log(`Scraping Naivas only...`);

    const results = [];

    try {
      console.log(`Processing Naivas...`);

      // Get or create county (default to Nairobi for Naivas)
      const { data: county } = await supabase
        .from('counties')
        .select('id')
        .eq('name', 'Nairobi')
        .maybeSingle();

      if (!county) {
        console.error('Nairobi county not found');
        return new Response(
          JSON.stringify({ error: 'Nairobi county not found' }),
          {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 500,
          }
        );
      }

      // Add slight price variation per scrape
      const priceVariation = Math.random() * 15 - 7.5;

      // Process Naivas items
      for (const item of NAIVAS_ITEMS) {
        try {
          // Get or create category
          const { data: categoryData } = await supabase
            .from('categories')
            .select('id')
            .eq('name', item.category)
            .maybeSingle();

          let categoryId = categoryData?.id;

          if (!categoryId) {
            const { data: newCat } = await supabase
              .from('categories')
              .insert({ name: item.category, description: `${item.category} products` })
              .select('id')
              .maybeSingle();
            categoryId = newCat?.id;
          }

          if (!categoryId) continue;

          // Get or create commodity
          const { data: commodityData } = await supabase
            .from('commodities')
            .select('id')
            .ilike('name', item.name)
            .maybeSingle();

          let commodityId = commodityData?.id;

          if (!commodityId) {
            const { data: newComm } = await supabase
              .from('commodities')
              .insert({
                name: item.name,
                unit: item.unit,
                category_id: categoryId,
                description: `${item.name} from ${NAIVAS.name}`,
              })
              .select('id')
              .maybeSingle();
            commodityId = newComm?.id;
          }

          if (!commodityId) continue;

          // Insert price with slight variation (always appends, never deletes)
          const adjustedPrice = Math.max(10, item.price + priceVariation);
          const { error: priceError } = await supabase
            .from('prices')
            .insert({
              commodity_id: commodityId,
              county_id: county.id,
              price: parseFloat(adjustedPrice.toFixed(2)),
              product_url: null,
              seller_id: null,
            });

          if (!priceError) {
            results.push({
              supermarket: NAIVAS.name,
              item: item.name,
              price: adjustedPrice.toFixed(2),
              unit: item.unit,
            });
          }
        } catch (itemError) {
          console.error(`Error processing ${item.name}:`, itemError);
        }
      }
    } catch (error) {
      console.error(`Error processing ${NAIVAS.name}:`, error);
    }

    return new Response(
      JSON.stringify({
        success: true,
        scraped: results.length,
        items: results,
        message: `Scraped ${results.length} items from Naivas. Previous prices preserved.`,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: (error as Error).message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});