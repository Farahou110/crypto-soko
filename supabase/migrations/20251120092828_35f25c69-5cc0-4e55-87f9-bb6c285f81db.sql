-- Add product_url column to prices table to store specific product URLs
ALTER TABLE public.prices ADD COLUMN IF NOT EXISTS product_url TEXT;

-- Add index for better query performance
CREATE INDEX IF NOT EXISTS idx_prices_product_url ON public.prices(product_url);