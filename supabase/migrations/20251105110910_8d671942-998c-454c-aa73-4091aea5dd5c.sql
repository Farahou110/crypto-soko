-- Create enum for user roles
CREATE TYPE public.app_role AS ENUM ('admin', 'seller', 'buyer');

-- Create profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  role app_role NOT NULL DEFAULT 'buyer',
  location TEXT,
  phone TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create user_roles table for role management
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  UNIQUE(user_id, role)
);

-- Create counties table
CREATE TABLE public.counties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create categories table
CREATE TABLE public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create commodities table
CREATE TABLE public.commodities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  category_id UUID REFERENCES public.categories(id) ON DELETE CASCADE,
  description TEXT,
  unit TEXT NOT NULL DEFAULT 'kg',
  image_url TEXT,
  is_new BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create prices table for price tracking
CREATE TABLE public.prices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  commodity_id UUID REFERENCES public.commodities(id) ON DELETE CASCADE NOT NULL,
  county_id UUID REFERENCES public.counties(id) ON DELETE CASCADE NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  seller_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create price alerts table
CREATE TABLE public.price_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  commodity_id UUID REFERENCES public.commodities(id) ON DELETE CASCADE NOT NULL,
  county_id UUID REFERENCES public.counties(id) ON DELETE CASCADE,
  alert_type TEXT CHECK (alert_type IN ('price_increase', 'price_decrease', 'new_product', 'price_threshold')) NOT NULL,
  threshold_price DECIMAL(10,2),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create notifications table
CREATE TABLE public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT CHECK (type IN ('price_alert', 'market_update', 'new_product', 'system')) NOT NULL,
  is_read BOOLEAN DEFAULT false,
  related_commodity_id UUID REFERENCES public.commodities(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create sales records table for sellers
CREATE TABLE public.sales_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  seller_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  commodity_id UUID REFERENCES public.commodities(id) ON DELETE CASCADE NOT NULL,
  quantity DECIMAL(10,2) NOT NULL,
  unit_price DECIMAL(10,2) NOT NULL,
  total_amount DECIMAL(10,2) NOT NULL,
  sale_date DATE NOT NULL DEFAULT CURRENT_DATE,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create inventory table for sellers
CREATE TABLE public.inventory (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  seller_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  commodity_id UUID REFERENCES public.commodities(id) ON DELETE CASCADE NOT NULL,
  quantity DECIMAL(10,2) NOT NULL DEFAULT 0,
  unit TEXT NOT NULL DEFAULT 'kg',
  last_updated TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(seller_id, commodity_id)
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.counties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.commodities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.price_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sales_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- RLS Policies for profiles
CREATE POLICY "Users can view all profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- RLS Policies for user_roles
CREATE POLICY "Users can view their own roles" ON public.user_roles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins can manage roles" ON public.user_roles FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for counties (public read, admin write)
CREATE POLICY "Anyone can view counties" ON public.counties FOR SELECT USING (true);
CREATE POLICY "Admins can manage counties" ON public.counties FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for categories (public read, admin write)
CREATE POLICY "Anyone can view categories" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Admins can manage categories" ON public.categories FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for commodities (public read, admin/seller write)
CREATE POLICY "Anyone can view commodities" ON public.commodities FOR SELECT USING (true);
CREATE POLICY "Admins can manage commodities" ON public.commodities FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for prices (public read, authenticated write)
CREATE POLICY "Anyone can view prices" ON public.prices FOR SELECT USING (true);
CREATE POLICY "Sellers can add prices" ON public.prices FOR INSERT WITH CHECK (auth.uid() = seller_id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Sellers can update own prices" ON public.prices FOR UPDATE USING (auth.uid() = seller_id OR public.has_role(auth.uid(), 'admin'));

-- RLS Policies for price_alerts
CREATE POLICY "Users can view own alerts" ON public.price_alerts FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own alerts" ON public.price_alerts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own alerts" ON public.price_alerts FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own alerts" ON public.price_alerts FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for notifications
CREATE POLICY "Users can view own notifications" ON public.notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own notifications" ON public.notifications FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Admins can create notifications" ON public.notifications FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for sales_records
CREATE POLICY "Sellers can view own sales" ON public.sales_records FOR SELECT USING (auth.uid() = seller_id);
CREATE POLICY "Sellers can create own sales" ON public.sales_records FOR INSERT WITH CHECK (auth.uid() = seller_id);
CREATE POLICY "Sellers can update own sales" ON public.sales_records FOR UPDATE USING (auth.uid() = seller_id);
CREATE POLICY "Sellers can delete own sales" ON public.sales_records FOR DELETE USING (auth.uid() = seller_id);

-- RLS Policies for inventory
CREATE POLICY "Sellers can view own inventory" ON public.inventory FOR SELECT USING (auth.uid() = seller_id);
CREATE POLICY "Sellers can manage own inventory" ON public.inventory FOR ALL USING (auth.uid() = seller_id);

-- Create function to automatically create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE PLPGSQL
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'User'),
    NEW.email,
    COALESCE((NEW.raw_user_meta_data->>'role')::app_role, 'buyer')
  );
  
  -- Insert into user_roles
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, COALESCE((NEW.raw_user_meta_data->>'role')::app_role, 'buyer'));
  
  RETURN NEW;
END;
$$;

-- Create trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER
LANGUAGE PLPGSQL
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- Create triggers for updated_at
CREATE TRIGGER profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER commodities_updated_at BEFORE UPDATE ON public.commodities FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER prices_updated_at BEFORE UPDATE ON public.prices FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Enable realtime for important tables
ALTER PUBLICATION supabase_realtime ADD TABLE public.prices;
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;
ALTER PUBLICATION supabase_realtime ADD TABLE public.commodities;