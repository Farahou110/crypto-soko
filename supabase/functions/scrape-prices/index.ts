import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',};

const SUPERMARKETS = [
  { name: 'Naivas', url: 'https://naivas.online' },
  { name: 'Carrefour', url: 'https://www.carrefourkenya.com' },
  { name: 'Quickmart', url: 'https://www.quickmart.co.ke' },
  { name: 'Chandarana', url: 'https://shop.chandarana.co.ke' },
];

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const lovableApiKey = Deno.env.get('LOVABLE_API_KEY');
    
    if (!lovableApiKey) {
      throw new Error('LOVABLE_API_KEY not configured');
    }

    const supabase = createClient(supabaseUrl, supabaseKey);
    
    const { supermarket, category } = await req.json();
    
    console.log(`Scraping ${supermarket || 'all supermarkets'} for ${category || 'all categories'}`);
    
    const results = [];
    const marketsToScrape = supermarket 
      ? SUPERMARKETS.filter(s => s.name === supermarket)
      : SUPERMARKETS;

    for (const market of marketsToScrape) {
      try {
        // Fetch the website content
        console.log(`Fetching ${market.name}...`);
        const response = await fetch(market.url);
        const html = await response.text();
        
        // Use AI to extract price data from HTML
        const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${lovableApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'google/gemini-2.5-flash',
            messages: [
              {
                role: 'system',
                content: `You are a price extraction assistant. Extract food commodity prices from HTML content. 
                Return ONLY a JSON array of items with this structure:
                [{"name": "item name", "price": number, "unit": "kg/liter/piece", "category": "cereals/vegetables/fruits/dairy/meat/other", "product_url": "full URL to the specific product page"}]
                Focus on staple foods and common groceries. Extract the complete product URL for each item. If no prices found, return empty array.`
              },
              {
                role: 'user',
                content: `Extract prices from this ${market.name} page. HTML snippet (first 8000 chars): ${html.substring(0, 8000)}`
              }
            ],
            tools: [{
              type: "function",
              function: {
                name: "extract_prices",
                description: "Extract commodity prices from supermarket HTML",
                parameters: {
                  type: "object",
                  properties: {
                    items: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          name: { type: "string" },
                          price: { type: "number" },
                          unit: { type: "string" },
                          category: { type: "string" },
                          product_url: { type: "string" }
                        },
                        required: ["name", "price", "unit", "category", "product_url"]
                      }
                    }
                  },
                  required: ["items"]
                }
              }
            }],
            tool_choice: { type: "function", function: { name: "extract_prices" } }
          }),
        });

        if (!aiResponse.ok) {
          console.error(`AI request failed: ${aiResponse.status}`);
          continue;
        }

        const aiData = await aiResponse.json();
        const toolCall = aiData.choices?.[0]?.message?.tool_calls?.[0];
        
        if (!toolCall) {
          console.log(`No prices extracted from ${market.name}`);
          continue;
        }

        const extractedItems = JSON.parse(toolCall.function.arguments).items;
        console.log(`Extracted ${extractedItems.length} items from ${market.name}`);

        // Get or create county (default to Nairobi for online supermarkets)
        const { data: county } = await supabase
          .from('counties')
          .select('id')
          .eq('name', 'Nairobi')
          .single();

        if (!county) {
          console.error('Nairobi county not found');
          continue;
        }

        // Process each extracted item
        for (const item of extractedItems) {
          // Get or create category
          const { data: categoryData, error: catError } = await supabase
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
              .single();
            categoryId = newCat?.id;
          }

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
                description: `${item.name} from ${market.name}`
              })
              .select('id')
              .single();
            commodityId = newComm?.id;
          }

          // Insert price
          if (commodityId) {
            const { error: priceError } = await supabase
              .from('prices')
              .insert({
                commodity_id: commodityId,
                county_id: county.id,
                price: item.price,
                product_url: item.product_url || null,
                seller_id: null // System-generated prices
              });

            if (!priceError) {
              results.push({
                supermarket: market.name,
                item: item.name,
                price: item.price,
                unit: item.unit
              });
            }
          }
        }
      } catch (error) {
        console.error(`Error scraping ${market.name}:`, error);
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        scraped: results.length,
        items: results 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );
  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
});