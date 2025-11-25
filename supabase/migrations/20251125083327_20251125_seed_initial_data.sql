/*
  # Seed initial data for food price tracker

  1. New Data
    - Add 10 Kenyan counties
    - Add 6 food categories (cereals, vegetables, fruits, dairy, proteins, legumes)
    - Add sample commodities from each category
    - Add sample prices for demonstration

  2. Notes
    - Uses INSERT...ON CONFLICT to avoid duplicates when rerunning
    - Default county is Nairobi for all sample prices
    - Categories and commodities are linked properly
*/

-- Insert counties
INSERT INTO public.counties (id, name) VALUES
  (gen_random_uuid(), 'Nairobi'),
  (gen_random_uuid(), 'Mombasa'),
  (gen_random_uuid(), 'Kisumu'),
  (gen_random_uuid(), 'Nakuru'),
  (gen_random_uuid(), 'Eldoret'),
  (gen_random_uuid(), 'Nyeri'),
  (gen_random_uuid(), 'Machakos'),
  (gen_random_uuid(), 'Meru'),
  (gen_random_uuid(), 'Thika'),
  (gen_random_uuid(), 'Kitale')
ON CONFLICT (name) DO NOTHING;

-- Insert categories
INSERT INTO public.categories (id, name, description) VALUES
  (gen_random_uuid(), 'cereals', 'Grains and cereal products'),
  (gen_random_uuid(), 'vegetables', 'Fresh vegetables'),
  (gen_random_uuid(), 'fruits', 'Fresh fruits'),
  (gen_random_uuid(), 'dairy', 'Dairy products'),
  (gen_random_uuid(), 'proteins', 'Meat and protein sources'),
  (gen_random_uuid(), 'legumes', 'Beans and pulses')
ON CONFLICT (name) DO NOTHING;

-- Insert commodities
INSERT INTO public.commodities (id, name, unit, category_id, description)
VALUES
  (gen_random_uuid(), 'Maize Meal', 'kg', (SELECT id FROM public.categories WHERE name = 'cereals' LIMIT 1), 'Ground maize flour'),
  (gen_random_uuid(), 'Millet', 'kg', (SELECT id FROM public.categories WHERE name = 'cereals' LIMIT 1), 'Millet grain'),
  (gen_random_uuid(), 'Rice', 'kg', (SELECT id FROM public.categories WHERE name = 'cereals' LIMIT 1), 'White rice'),
  (gen_random_uuid(), 'Tomatoes', 'kg', (SELECT id FROM public.categories WHERE name = 'vegetables' LIMIT 1), 'Fresh tomatoes'),
  (gen_random_uuid(), 'Onions', 'kg', (SELECT id FROM public.categories WHERE name = 'vegetables' LIMIT 1), 'Yellow onions'),
  (gen_random_uuid(), 'Cabbages', 'kg', (SELECT id FROM public.categories WHERE name = 'vegetables' LIMIT 1), 'Fresh cabbages'),
  (gen_random_uuid(), 'Bananas', 'kg', (SELECT id FROM public.categories WHERE name = 'fruits' LIMIT 1), 'Fresh bananas'),
  (gen_random_uuid(), 'Oranges', 'kg', (SELECT id FROM public.categories WHERE name = 'fruits' LIMIT 1), 'Fresh oranges'),
  (gen_random_uuid(), 'Milk', 'liter', (SELECT id FROM public.categories WHERE name = 'dairy' LIMIT 1), 'Fresh milk'),
  (gen_random_uuid(), 'Eggs', 'dozen', (SELECT id FROM public.categories WHERE name = 'dairy' LIMIT 1), 'Chicken eggs'),
  (gen_random_uuid(), 'Chicken', 'kg', (SELECT id FROM public.categories WHERE name = 'proteins' LIMIT 1), 'Fresh chicken meat'),
  (gen_random_uuid(), 'Beans', 'kg', (SELECT id FROM public.categories WHERE name = 'legumes' LIMIT 1), 'Dried beans')
ON CONFLICT DO NOTHING;

-- Insert sample prices
INSERT INTO public.prices (id, commodity_id, county_id, price)
VALUES
  (gen_random_uuid(), (SELECT id FROM public.commodities WHERE name = 'Maize Meal' LIMIT 1), (SELECT id FROM public.counties WHERE name = 'Nairobi' LIMIT 1), 45.00),
  (gen_random_uuid(), (SELECT id FROM public.commodities WHERE name = 'Rice' LIMIT 1), (SELECT id FROM public.counties WHERE name = 'Nairobi' LIMIT 1), 120.00),
  (gen_random_uuid(), (SELECT id FROM public.commodities WHERE name = 'Tomatoes' LIMIT 1), (SELECT id FROM public.counties WHERE name = 'Nairobi' LIMIT 1), 80.00),
  (gen_random_uuid(), (SELECT id FROM public.commodities WHERE name = 'Onions' LIMIT 1), (SELECT id FROM public.counties WHERE name = 'Nairobi' LIMIT 1), 60.00),
  (gen_random_uuid(), (SELECT id FROM public.commodities WHERE name = 'Bananas' LIMIT 1), (SELECT id FROM public.counties WHERE name = 'Nairobi' LIMIT 1), 50.00),
  (gen_random_uuid(), (SELECT id FROM public.commodities WHERE name = 'Milk' LIMIT 1), (SELECT id FROM public.counties WHERE name = 'Nairobi' LIMIT 1), 65.00),
  (gen_random_uuid(), (SELECT id FROM public.commodities WHERE name = 'Eggs' LIMIT 1), (SELECT id FROM public.counties WHERE name = 'Nairobi' LIMIT 1), 420.00),
  (gen_random_uuid(), (SELECT id FROM public.commodities WHERE name = 'Chicken' LIMIT 1), (SELECT id FROM public.counties WHERE name = 'Nairobi' LIMIT 1), 380.00),
  (gen_random_uuid(), (SELECT id FROM public.commodities WHERE name = 'Beans' LIMIT 1), (SELECT id FROM public.counties WHERE name = 'Nairobi' LIMIT 1), 100.00),
  (gen_random_uuid(), (SELECT id FROM public.commodities WHERE name = 'Maize Meal' LIMIT 1), (SELECT id FROM public.counties WHERE name = 'Mombasa' LIMIT 1), 48.00),
  (gen_random_uuid(), (SELECT id FROM public.commodities WHERE name = 'Rice' LIMIT 1), (SELECT id FROM public.counties WHERE name = 'Mombasa' LIMIT 1), 125.00),
  (gen_random_uuid(), (SELECT id FROM public.commodities WHERE name = 'Tomatoes' LIMIT 1), (SELECT id FROM public.counties WHERE name = 'Mombasa' LIMIT 1), 85.00)
ON CONFLICT DO NOTHING;
