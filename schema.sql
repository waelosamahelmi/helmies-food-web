-- Helmie's Food Web Database Schema
-- This schema creates all necessary tables, sequences, and relationships for the restaurant system

-- Create sequences first (required for auto-incrementing IDs)
CREATE SEQUENCE IF NOT EXISTS public.categories_id_seq;
CREATE SEQUENCE IF NOT EXISTS public.menu_items_id_seq;
CREATE SEQUENCE IF NOT EXISTS public.orders_id_seq;
CREATE SEQUENCE IF NOT EXISTS public.order_items_id_seq;
CREATE SEQUENCE IF NOT EXISTS public.restaurant_settings_id_seq;
CREATE SEQUENCE IF NOT EXISTS public.toppings_id_seq;
CREATE SEQUENCE IF NOT EXISTS public.users_id_seq;

-- Create tables in dependency order

-- 1. Users table (no dependencies)
CREATE TABLE IF NOT EXISTS public.users (
  id integer NOT NULL DEFAULT nextval('users_id_seq'::regclass),
  email text NOT NULL UNIQUE,
  password text NOT NULL,
  role text NOT NULL DEFAULT 'admin'::text,
  is_active boolean DEFAULT true,
  created_at timestamp without time zone DEFAULT now(),
  last_login timestamp without time zone,
  CONSTRAINT users_pkey PRIMARY KEY (id)
);

-- 2. Categories table (no dependencies)
CREATE TABLE IF NOT EXISTS public.categories (
  id integer NOT NULL DEFAULT nextval('categories_id_seq'::regclass),
  name text NOT NULL,
  name_en text NOT NULL,
  display_order integer DEFAULT 0,
  is_active boolean DEFAULT true,
  CONSTRAINT categories_pkey PRIMARY KEY (id)
);

-- 3. Menu items table (depends on categories)
CREATE TABLE IF NOT EXISTS public.menu_items (
  id integer NOT NULL DEFAULT nextval('menu_items_id_seq'::regclass),
  category_id integer,
  name text NOT NULL,
  name_en text NOT NULL,
  description text,
  description_en text,
  price numeric NOT NULL,
  image_url text,
  is_vegetarian boolean DEFAULT false,
  is_vegan boolean DEFAULT false,
  is_gluten_free boolean DEFAULT false,
  display_order integer DEFAULT 0,
  is_available boolean DEFAULT true,
  offer_price numeric,
  offer_percentage integer,
  offer_start_date timestamp without time zone,
  offer_end_date timestamp without time zone,
  CONSTRAINT menu_items_pkey PRIMARY KEY (id),
  CONSTRAINT menu_items_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.categories(id) ON DELETE SET NULL
);

-- 4. Orders table (no dependencies on other main tables)
CREATE TABLE IF NOT EXISTS public.orders (
  id integer NOT NULL DEFAULT nextval('orders_id_seq'::regclass),
  order_number text NOT NULL UNIQUE,
  customer_name text NOT NULL,
  customer_phone text NOT NULL,
  customer_email text,
  delivery_address text,
  order_type text NOT NULL CHECK (order_type IN ('delivery', 'pickup', 'dine-in')),
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'preparing', 'ready', 'delivered', 'cancelled')),
  subtotal numeric NOT NULL CHECK (subtotal >= 0),
  delivery_fee numeric DEFAULT 0 CHECK (delivery_fee >= 0),
  total_amount numeric NOT NULL CHECK (total_amount >= 0),
  payment_method text DEFAULT 'cash' CHECK (payment_method IN ('cash', 'card', 'online')),
  special_instructions text,
  created_at timestamp without time zone DEFAULT now(),
  updated_at timestamp without time zone DEFAULT now(),
  CONSTRAINT orders_pkey PRIMARY KEY (id)
);

-- 5. Order items table (depends on orders and menu_items)
CREATE TABLE IF NOT EXISTS public.order_items (
  id integer NOT NULL DEFAULT nextval('order_items_id_seq'::regclass),
  order_id integer NOT NULL,
  menu_item_id integer NOT NULL,
  quantity integer NOT NULL DEFAULT 1 CHECK (quantity > 0),
  unit_price numeric NOT NULL CHECK (unit_price >= 0),
  total_price numeric NOT NULL CHECK (total_price >= 0),
  special_instructions text,
  CONSTRAINT order_items_pkey PRIMARY KEY (id),
  CONSTRAINT order_items_menu_item_id_fkey FOREIGN KEY (menu_item_id) REFERENCES public.menu_items(id) ON DELETE RESTRICT,
  CONSTRAINT order_items_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.orders(id) ON DELETE CASCADE
);

-- 6. Printers table (no dependencies)
CREATE TABLE IF NOT EXISTS public.printers (
  id text NOT NULL,
  name text NOT NULL,
  type text NOT NULL CHECK (type IN ('network', 'bluetooth')),
  address text NOT NULL,
  port integer,
  is_default boolean DEFAULT false,
  is_active boolean DEFAULT true,
  capabilities jsonb DEFAULT '{}',
  metadata jsonb DEFAULT '{}',
  created_at timestamp without time zone DEFAULT now(),
  updated_at timestamp without time zone DEFAULT now(),
  CONSTRAINT printers_pkey PRIMARY KEY (id)
);

-- 7. Restaurant settings table (with optional printer reference)
CREATE TABLE IF NOT EXISTS public.restaurant_settings (
  id integer NOT NULL DEFAULT nextval('restaurant_settings_id_seq'::regclass),
  is_open boolean DEFAULT true,
  opening_hours text NOT NULL,
  pickup_hours text NOT NULL,
  delivery_hours text NOT NULL,
  lunch_buffet_hours text NOT NULL,
  special_message text,
  updated_at timestamp without time zone NOT NULL DEFAULT now(),
  default_printer_id text,
  printer_auto_reconnect boolean DEFAULT true,
  printer_tab_sticky boolean DEFAULT true,
  CONSTRAINT restaurant_settings_pkey PRIMARY KEY (id),
  CONSTRAINT restaurant_settings_default_printer_fkey FOREIGN KEY (default_printer_id) REFERENCES public.printers(id) ON DELETE SET NULL
);

-- 8. Session table (for session management)
CREATE TABLE IF NOT EXISTS public.session (
  sid character varying NOT NULL,
  sess json NOT NULL,
  expire timestamp without time zone NOT NULL,
  CONSTRAINT session_pkey PRIMARY KEY (sid)
);

-- 9. Toppings table (no dependencies)
CREATE TABLE IF NOT EXISTS public.toppings (
  id integer NOT NULL DEFAULT nextval('toppings_id_seq'::regclass),
  name text NOT NULL,
  name_en text NOT NULL,
  name_ar text,
  price numeric NOT NULL DEFAULT 0.00 CHECK (price >= 0),
  is_active boolean DEFAULT true,
  display_order integer DEFAULT 0,
  category text NOT NULL DEFAULT 'pizza',
  type text NOT NULL DEFAULT 'topping',
  is_required boolean DEFAULT false,
  created_at timestamp without time zone DEFAULT now(),
  CONSTRAINT toppings_pkey PRIMARY KEY (id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_categories_display_order ON public.categories(display_order);
CREATE INDEX IF NOT EXISTS idx_categories_is_active ON public.categories(is_active);

CREATE INDEX IF NOT EXISTS idx_menu_items_category_id ON public.menu_items(category_id);
CREATE INDEX IF NOT EXISTS idx_menu_items_is_available ON public.menu_items(is_available);
CREATE INDEX IF NOT EXISTS idx_menu_items_display_order ON public.menu_items(display_order);
CREATE INDEX IF NOT EXISTS idx_menu_items_offer_dates ON public.menu_items(offer_start_date, offer_end_date);

CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_order_type ON public.orders(order_type);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON public.orders(created_at);
CREATE INDEX IF NOT EXISTS idx_orders_customer_phone ON public.orders(customer_phone);

CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON public.order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_menu_item_id ON public.order_items(menu_item_id);

CREATE INDEX IF NOT EXISTS idx_toppings_category ON public.toppings(category);
CREATE INDEX IF NOT EXISTS idx_toppings_is_active ON public.toppings(is_active);
CREATE INDEX IF NOT EXISTS idx_toppings_display_order ON public.toppings(display_order);

CREATE INDEX IF NOT EXISTS idx_printers_is_active ON public.printers(is_active);
CREATE INDEX IF NOT EXISTS idx_printers_is_default ON public.printers(is_default);

CREATE INDEX IF NOT EXISTS idx_session_expire ON public.session(expire);

-- Set sequence ownership to ensure proper cleanup
ALTER SEQUENCE public.categories_id_seq OWNED BY public.categories.id;
ALTER SEQUENCE public.menu_items_id_seq OWNED BY public.menu_items.id;
ALTER SEQUENCE public.orders_id_seq OWNED BY public.orders.id;
ALTER SEQUENCE public.order_items_id_seq OWNED BY public.order_items.id;
ALTER SEQUENCE public.restaurant_settings_id_seq OWNED BY public.restaurant_settings.id;
ALTER SEQUENCE public.toppings_id_seq OWNED BY public.toppings.id;
ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;

-- Create a trigger function to automatically update the updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for tables that have updated_at columns
CREATE TRIGGER update_orders_updated_at 
    BEFORE UPDATE ON public.orders 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_restaurant_settings_updated_at 
    BEFORE UPDATE ON public.restaurant_settings 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_printers_updated_at 
    BEFORE UPDATE ON public.printers 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Ensure only one default printer exists
CREATE OR REPLACE FUNCTION ensure_single_default_printer()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.is_default = true THEN
        -- Set all other printers to not default
        UPDATE public.printers SET is_default = false WHERE id != NEW.id;
    END IF;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER ensure_single_default_printer_trigger
    BEFORE INSERT OR UPDATE ON public.printers
    FOR EACH ROW EXECUTE FUNCTION ensure_single_default_printer();

-- Comments for documentation
COMMENT ON TABLE public.categories IS 'Food categories (e.g., Pizza, Pasta, Drinks)';
COMMENT ON TABLE public.menu_items IS 'Individual menu items with pricing and availability';
COMMENT ON TABLE public.orders IS 'Customer orders with delivery/pickup information';
COMMENT ON TABLE public.order_items IS 'Individual items within an order';
COMMENT ON TABLE public.toppings IS 'Available toppings/add-ons for menu items';
COMMENT ON TABLE public.printers IS 'Thermal printers for order receipts';
COMMENT ON TABLE public.restaurant_settings IS 'Restaurant operational settings and hours';
COMMENT ON TABLE public.users IS 'Admin users for restaurant management';
COMMENT ON TABLE public.session IS 'User session storage';

-- Insert default restaurant settings
INSERT INTO public.restaurant_settings (
    is_open, 
    opening_hours, 
    pickup_hours, 
    delivery_hours, 
    lunch_buffet_hours,
    special_message
) VALUES (
    true,
    '11:00-23:00',
    '11:00-23:00', 
    '11:00-22:30',
    '11:30-15:00',
    'Welcome to Helmie''s Food!'
) ON CONFLICT DO NOTHING;

-- Enable Row Level Security (RLS) on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.printers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.restaurant_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.toppings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.session ENABLE ROW LEVEL SECURITY;

-- Helper function to check if user is authenticated admin
CREATE OR REPLACE FUNCTION auth.is_admin()
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.users 
    WHERE email = auth.email() 
    AND role = 'admin' 
    AND is_active = true
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Helper function to get current user ID
CREATE OR REPLACE FUNCTION auth.current_user_id()
RETURNS integer AS $$
BEGIN
  RETURN (
    SELECT id FROM public.users 
    WHERE email = auth.email() 
    AND is_active = true
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ==========================================
-- RLS POLICIES FOR USERS TABLE
-- ==========================================

-- Users can only be managed by admins
CREATE POLICY "Admin can manage all users" ON public.users
  FOR ALL USING (auth.is_admin());

-- Allow users to view their own profile
CREATE POLICY "Users can view own profile" ON public.users
  FOR SELECT USING (auth.email() = email);

-- ==========================================
-- RLS POLICIES FOR CATEGORIES TABLE
-- ==========================================

-- Anyone can view active categories (for menu display)
CREATE POLICY "Anyone can view active categories" ON public.categories
  FOR SELECT USING (is_active = true);

-- Only admins can manage categories
CREATE POLICY "Admin can manage categories" ON public.categories
  FOR ALL USING (auth.is_admin());

-- ==========================================
-- RLS POLICIES FOR MENU_ITEMS TABLE
-- ==========================================

-- Anyone can view available menu items
CREATE POLICY "Anyone can view available menu items" ON public.menu_items
  FOR SELECT USING (is_available = true);

-- Only admins can manage menu items
CREATE POLICY "Admin can manage menu items" ON public.menu_items
  FOR ALL USING (auth.is_admin());

-- ==========================================
-- RLS POLICIES FOR TOPPINGS TABLE
-- ==========================================

-- Anyone can view active toppings
CREATE POLICY "Anyone can view active toppings" ON public.toppings
  FOR SELECT USING (is_active = true);

-- Only admins can manage toppings
CREATE POLICY "Admin can manage toppings" ON public.toppings
  FOR ALL USING (auth.is_admin());

-- ==========================================
-- RLS POLICIES FOR ORDERS TABLE
-- ==========================================

-- Customers can create their own orders
CREATE POLICY "Anyone can create orders" ON public.orders
  FOR INSERT WITH CHECK (true);

-- Customers can view their own orders (by phone number)
CREATE POLICY "Customers can view own orders" ON public.orders
  FOR SELECT USING (
    customer_phone = current_setting('request.header.customer-phone', true) OR
    customer_email = current_setting('request.header.customer-email', true)
  );

-- Admins can view and manage all orders
CREATE POLICY "Admin can manage all orders" ON public.orders
  FOR ALL USING (auth.is_admin());

-- Allow updates for order status changes (with restrictions)
CREATE POLICY "Limited order updates" ON public.orders
  FOR UPDATE USING (
    auth.is_admin() OR 
    (status IN ('pending', 'confirmed') AND customer_phone = current_setting('request.header.customer-phone', true))
  );

-- ==========================================
-- RLS POLICIES FOR ORDER_ITEMS TABLE
-- ==========================================

-- Anyone can insert order items (when creating an order)
CREATE POLICY "Anyone can create order items" ON public.order_items
  FOR INSERT WITH CHECK (true);

-- Customers can view their own order items
CREATE POLICY "Customers can view own order items" ON public.order_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.orders 
      WHERE id = order_id 
      AND (
        customer_phone = current_setting('request.header.customer-phone', true) OR
        customer_email = current_setting('request.header.customer-email', true)
      )
    )
  );

-- Admins can manage all order items
CREATE POLICY "Admin can manage all order items" ON public.order_items
  FOR ALL USING (auth.is_admin());

-- ==========================================
-- RLS POLICIES FOR RESTAURANT_SETTINGS TABLE
-- ==========================================

-- Anyone can view restaurant settings (for business hours, status)
CREATE POLICY "Anyone can view restaurant settings" ON public.restaurant_settings
  FOR SELECT USING (true);

-- Only admins can modify restaurant settings
CREATE POLICY "Admin can manage restaurant settings" ON public.restaurant_settings
  FOR ALL USING (auth.is_admin());

-- ==========================================
-- RLS POLICIES FOR PRINTERS TABLE
-- ==========================================

-- Only admins can manage printers
CREATE POLICY "Admin can manage printers" ON public.printers
  FOR ALL USING (auth.is_admin());

-- ==========================================
-- RLS POLICIES FOR SESSION TABLE
-- ==========================================

-- Users can only access their own sessions
CREATE POLICY "Users can manage own sessions" ON public.session
  FOR ALL USING (
    sid = current_setting('request.header.session-id', true) OR
    auth.is_admin()
  );

-- ==========================================
-- GRANT PERMISSIONS
-- ==========================================

-- Grant usage on sequences to authenticated users
GRANT USAGE ON SEQUENCE public.categories_id_seq TO authenticated;
GRANT USAGE ON SEQUENCE public.menu_items_id_seq TO authenticated;
GRANT USAGE ON SEQUENCE public.orders_id_seq TO authenticated;
GRANT USAGE ON SEQUENCE public.order_items_id_seq TO authenticated;
GRANT USAGE ON SEQUENCE public.restaurant_settings_id_seq TO authenticated;
GRANT USAGE ON SEQUENCE public.toppings_id_seq TO authenticated;
GRANT USAGE ON SEQUENCE public.users_id_seq TO authenticated;

-- Grant table permissions to authenticated users
GRANT SELECT ON public.categories TO authenticated;
GRANT SELECT ON public.menu_items TO authenticated;
GRANT SELECT ON public.toppings TO authenticated;
GRANT SELECT ON public.restaurant_settings TO authenticated;

-- Grant insert/select permissions for orders (customers need to create orders)
GRANT INSERT, SELECT, UPDATE ON public.orders TO authenticated;
GRANT INSERT, SELECT ON public.order_items TO authenticated;

-- Grant all permissions to service_role (for admin operations)
GRANT ALL ON ALL TABLES IN SCHEMA public TO service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO service_role;

-- Grant permissions for session management
GRANT ALL ON public.session TO authenticated;
GRANT ALL ON public.users TO authenticated;