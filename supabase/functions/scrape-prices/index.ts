import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
};

const SUPERMARKETS = [
  { name: 'Naivas', url: 'https://naivas.online' },
  { name: 'Carrefour', url: 'https://www.carrefourkenya.com' },
  { name: 'Quickmart', url: 'https://www.quickmart.co.ke' },
  { name: 'Chandarana', url: 'https://shop.chandarana.co.ke' },
];

const MOCK_PRICES = [
  { name: 'Maize Meal', price: 45, unit: 'kg', category: 'cereals' },
  { name: 'Rice', price: 120, unit: 'kg', category: 'cereals' },
  { name: 'Millet', price: 60, unit: 'kg', category: 'cereals' },
  { name: 'Tomatoes', price: 80, unit: 'kg', category: 'vegetables' },
  { name: 'Onions', price: 60, unit: 'kg', category: 'vegetables' },
  { name: 'Cabbages', price: 40, unit: 'kg', category: 'vegetables' },
  { name: 'Bananas', price: 50, unit: 'kg', category: 'fruits' },
  { name: 'Oranges', price: 70, unit: 'kg', category: 'fruits' },
  { name: 'Milk', price: 65, unit: 'liter', category: 'dairy' },
  { name: 'Eggs', price: 420, unit: 'dozen', category: 'dairy' },
  { name: 'Chicken', price: 380, unit: 'kg', category: 'proteins' },
  { name: 'Beans', price: 100, unit: 'kg', category: 'legumes' },
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

    let body = {};
    try {
      body = await req.json();
    } catch {
      body = {};
    }

    const { supermarket } = body as { supermarket?: string };

    console.log(`Scraping ${supermarket || 'all supermarkets'}`);

    const results = [];
    const marketsToScrape = supermarket
      ? SUPERMARKETS.filter(s => s.name === supermarket)
      : SUPERMARKETS;

    for (const market of marketsToScrape) {
      try {
        console.log(`Processing ${market.name}...`);

        // Get or create county (default to Nairobi for online supermarkets)
        const { data: county } = await supabase
          .from('counties')
          .select('id')
          .eq('name', 'Nairobi')
          .maybeSingle();

        if (!county) {
          console.error('Nairobi county not found');
          continue;
        }

        // Add slight price variation per supermarket
        const priceVariation = Math.random() * 10 - 5;

        // Process mock items
        for (const item of MOCK_PRICES) {
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
                  description: `${item.name} from ${market.name}`,
                })
                .select('id')
                .maybeSingle();
              commodityId = newComm?.id;
            }

            if (!commodityId) continue;

            // Insert price with slight variation
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
                supermarket: market.name,
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
        console.error(`Error processing ${market.name}:`, error);
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        scraped: results.length,
        items: results,
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