-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.categories (
  id integer NOT NULL DEFAULT nextval('categories_id_seq'::regclass),
  name text NOT NULL,
  name_en text NOT NULL,
  display_order integer DEFAULT 0,
  is_active boolean DEFAULT true,
  CONSTRAINT categories_pkey PRIMARY KEY (id)
);
CREATE TABLE public.menu_items (
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
  CONSTRAINT menu_items_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.categories(id)
);
CREATE TABLE public.order_items (
  id integer NOT NULL DEFAULT nextval('order_items_id_seq'::regclass),
  order_id integer,
  menu_item_id integer,
  quantity integer NOT NULL DEFAULT 1,
  unit_price numeric NOT NULL,
  total_price numeric NOT NULL,
  special_instructions text,
  CONSTRAINT order_items_pkey PRIMARY KEY (id),
  CONSTRAINT order_items_menu_item_id_fkey FOREIGN KEY (menu_item_id) REFERENCES public.menu_items(id),
  CONSTRAINT order_items_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.orders(id)
);
CREATE TABLE public.orders (
  id integer NOT NULL DEFAULT nextval('orders_id_seq'::regclass),
  order_number text NOT NULL UNIQUE,
  customer_name text NOT NULL,
  customer_phone text NOT NULL,
  customer_email text,
  delivery_address text,
  order_type text NOT NULL,
  status text NOT NULL DEFAULT 'pending'::text,
  subtotal numeric NOT NULL,
  delivery_fee numeric DEFAULT 0,
  total_amount numeric NOT NULL,
  payment_method text DEFAULT 'cash'::text,
  special_instructions text,
  created_at timestamp without time zone DEFAULT now(),
  updated_at timestamp without time zone DEFAULT now(),
  CONSTRAINT orders_pkey PRIMARY KEY (id)
);
CREATE TABLE public.printers (
  id text NOT NULL,
  name text NOT NULL,
  type text NOT NULL CHECK (type = ANY (ARRAY['network'::text, 'bluetooth'::text])),
  address text NOT NULL,
  port integer,
  is_default boolean DEFAULT false,
  is_active boolean DEFAULT true,
  capabilities jsonb DEFAULT '{}'::jsonb,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamp without time zone DEFAULT now(),
  updated_at timestamp without time zone DEFAULT now(),
  CONSTRAINT printers_pkey PRIMARY KEY (id)
);
CREATE TABLE public.restaurant_settings (
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
  CONSTRAINT restaurant_settings_pkey PRIMARY KEY (id)
);
CREATE TABLE public.session (
  sid character varying NOT NULL,
  sess json NOT NULL,
  expire timestamp without time zone NOT NULL,
  CONSTRAINT session_pkey PRIMARY KEY (sid)
);
CREATE TABLE public.toppings (
  id integer NOT NULL DEFAULT nextval('toppings_id_seq'::regclass),
  name text NOT NULL,
  name_en text NOT NULL,
  name_ar text,
  price numeric NOT NULL DEFAULT 0.00,
  is_active boolean DEFAULT true,
  display_order integer DEFAULT 0,
  category text NOT NULL DEFAULT 'pizza'::text,
  type text NOT NULL DEFAULT 'topping'::text,
  is_required boolean DEFAULT false,
  created_at timestamp without time zone DEFAULT now(),
  CONSTRAINT toppings_pkey PRIMARY KEY (id)
);
CREATE TABLE public.users (
  id integer NOT NULL DEFAULT nextval('users_id_seq'::regclass),
  email text NOT NULL UNIQUE,
  password text NOT NULL,
  role text NOT NULL DEFAULT 'admin'::text,
  is_active boolean DEFAULT true,
  created_at timestamp without time zone DEFAULT now(),
  last_login timestamp without time zone,
  CONSTRAINT users_pkey PRIMARY KEY (id)
);