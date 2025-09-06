/*
  # Create restaurant configuration table

  1. New Tables
    - `restaurant_config`
      - `id` (uuid, primary key)
      - `name` (text, restaurant name in Finnish)
      - `name_en` (text, restaurant name in English)
      - `tagline` (text, tagline in Finnish)
      - `tagline_en` (text, tagline in English)
      - `description` (text, description in Finnish)
      - `description_en` (text, description in English)
      - `phone` (text, phone number)
      - `email` (text, email address)
      - `address` (jsonb, address object)
      - `social_media` (jsonb, social media links)
      - `hours` (jsonb, business hours configuration)
      - `services` (jsonb, available services)
      - `delivery_config` (jsonb, delivery zones and settings)
      - `theme` (jsonb, theme colors and branding)
      - `logo` (jsonb, logo configuration)
      - `about` (jsonb, about section content)
      - `hero` (jsonb, hero section configuration)
      - `is_active` (boolean, whether this config is active)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `restaurant_config` table
    - Add policy for public read access to active config
    - Add policy for authenticated admin write access

  3. Data
    - Insert default Pizzeria Antonio configuration
*/

CREATE TABLE IF NOT EXISTS restaurant_config (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  name_en text NOT NULL,
  tagline text NOT NULL,
  tagline_en text NOT NULL,
  description text NOT NULL,
  description_en text NOT NULL,
  phone text NOT NULL,
  email text NOT NULL,
  address jsonb NOT NULL DEFAULT '{}',
  social_media jsonb DEFAULT '{}',
  hours jsonb NOT NULL DEFAULT '{}',
  services jsonb NOT NULL DEFAULT '{}',
  delivery_config jsonb NOT NULL DEFAULT '{}',
  theme jsonb NOT NULL DEFAULT '{}',
  logo jsonb NOT NULL DEFAULT '{}',
  about jsonb NOT NULL DEFAULT '{}',
  hero jsonb NOT NULL DEFAULT '{}',
  is_active boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE restaurant_config ENABLE ROW LEVEL SECURITY;

-- Public can read active restaurant config
CREATE POLICY "Anyone can read active restaurant config"
  ON restaurant_config
  FOR SELECT
  USING (is_active = true);

-- Only authenticated admins can manage restaurant config
CREATE POLICY "Admin can manage restaurant config"
  ON restaurant_config
  FOR ALL
  USING (auth.is_admin());

-- Ensure only one active config at a time
CREATE OR REPLACE FUNCTION ensure_single_active_config()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.is_active = true THEN
    -- Set all other configs to inactive
    UPDATE restaurant_config SET is_active = false WHERE id != NEW.id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER ensure_single_active_config_trigger
  BEFORE INSERT OR UPDATE ON restaurant_config
  FOR EACH ROW EXECUTE FUNCTION ensure_single_active_config();

-- Auto-update updated_at timestamp
CREATE TRIGGER update_restaurant_config_updated_at
  BEFORE UPDATE ON restaurant_config
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert default Pizzeria Antonio configuration
INSERT INTO restaurant_config (
  name,
  name_en,
  tagline,
  tagline_en,
  description,
  description_en,
  phone,
  email,
  address,
  social_media,
  hours,
  services,
  delivery_config,
  theme,
  logo,
  about,
  hero,
  is_active
) VALUES (
  'Pizzeria Antonio',
  'Pizzeria Antonio',
  'Laadukkaita aterioita Lahden sydämessä',
  'Quality meals in the heart of Lahti',
  'Pizzeria Antoniossa tarjoamme laadukkaita aterioita ja kutsumme sinut maistamaan herkullisia ruokiamme.',
  'At Pizzeria Antonio we offer quality meals and invite you to taste our delicious food.',
  '+35835899089',
  'info@pizzeriaantonio.fi',
  '{
    "street": "Rauhankatu 19 c",
    "postalCode": "15110",
    "city": "Lahti",
    "country": "Finland"
  }',
  '{
    "facebook": "https://www.facebook.com/profile.php?id=61577964717473"
  }',
  '{
    "general": {
      "monday": {"open": "10:30", "close": "21:30", "closed": false},
      "tuesday": {"open": "10:30", "close": "21:30", "closed": false},
      "wednesday": {"open": "10:30", "close": "21:30", "closed": false},
      "thursday": {"open": "10:30", "close": "21:30", "closed": false},
      "friday": {"open": "10:30", "close": "22:00", "closed": false},
      "saturday": {"open": "10:30", "close": "05:30", "closed": false},
      "sunday": {"open": "10:30", "close": "21:30", "closed": false}
    },
    "pickup": {
      "monday": {"open": "10:30", "close": "21:30", "closed": false},
      "tuesday": {"open": "10:30", "close": "21:30", "closed": false},
      "wednesday": {"open": "10:30", "close": "21:30", "closed": false},
      "thursday": {"open": "10:30", "close": "21:30", "closed": false},
      "friday": {"open": "10:30", "close": "22:00", "closed": false},
      "saturday": {"open": "10:30", "close": "05:30", "closed": false},
      "sunday": {"open": "10:30", "close": "21:30", "closed": false}
    },
    "delivery": {
      "monday": {"open": "10:30", "close": "21:30", "closed": false},
      "tuesday": {"open": "10:30", "close": "21:30", "closed": false},
      "wednesday": {"open": "10:30", "close": "21:30", "closed": false},
      "thursday": {"open": "10:30", "close": "21:30", "closed": false},
      "friday": {"open": "10:30", "close": "22:00", "closed": false},
      "saturday": {"open": "10:30", "close": "05:30", "closed": false},
      "sunday": {"open": "10:30", "close": "21:30", "closed": false}
    }
  }',
  '{
    "hasLunchBuffet": false,
    "hasDelivery": true,
    "hasPickup": true,
    "hasDineIn": true,
    "lunchBuffetHours": null
  }',
  '{
    "zones": [
      {"maxDistance": 4, "fee": 0.00},
      {"maxDistance": 5, "fee": 4.00},
      {"maxDistance": 8, "fee": 7.00},
      {"maxDistance": 10, "fee": 10.00}
    ],
    "location": {
      "lat": 60.9832,
      "lng": 25.6608
    }
  }',
  '{
    "primary": "#8B4513",
    "secondary": "#FF8C00",
    "accent": "#F5E6D3",
    "success": "#16a34a",
    "warning": "#ea580c",
    "error": "#dc2626",
    "background": "#ffffff",
    "foreground": "#1f2937",
    "dark": {
      "background": "hsl(30, 10%, 8%)",
      "foreground": "hsl(0, 0%, 98%)",
      "card": "hsl(30, 8%, 12%)",
      "cardForeground": "hsl(0, 0%, 98%)",
      "popover": "hsl(30, 10%, 8%)",
      "popoverForeground": "hsl(0, 0%, 98%)",
      "primary": "#8B4513",
      "primaryForeground": "hsl(0, 0%, 98%)",
      "secondary": "hsl(30, 5%, 18%)",
      "secondaryForeground": "hsl(0, 0%, 98%)",
      "muted": "hsl(30, 5%, 15%)",
      "mutedForeground": "hsl(240, 5%, 64.9%)",
      "accent": "hsl(30, 5%, 18%)",
      "accentForeground": "hsl(0, 0%, 98%)",
      "destructive": "hsl(0, 62.8%, 30.6%)",
      "destructiveForeground": "hsl(0, 0%, 98%)",
      "border": "hsl(30, 5%, 18%)",
      "input": "hsl(30, 5%, 18%)",
      "ring": "hsl(240, 4.9%, 83.9%)"
    }
  }',
  '{
    "icon": "Pizza",
    "imageUrl": "https://foozu3.fi/pizzaadmin/web_admin_common/foodzone//logo/8minqduoo4o4c8kwgw.png",
    "showText": true,
    "backgroundColor": "#8B4513"
  }',
  '{
    "story": "Pizzeria Antoniossa tarjoamme laadukkaita aterioita ja kutsumme sinut maistamaan herkullisia ruokiamme.",
    "storyEn": "At Pizzeria Antonio we offer quality meals and invite you to taste our delicious food.",
    "mission": "Tarjoamme Lahdessa parhaita pizzoja, kebabeja ja muita herkullisia ruokia ystävällisessä palvelussa.",
    "missionEn": "We offer the best pizzas, kebabs and other delicious food in Lahti with friendly service.",
    "specialties": [
      {
        "title": "Premium Pizzat",
        "titleEn": "Premium Pizzas",
        "description": "Huippulaadukkaita pizzoja tuoreista aineksista",
        "descriptionEn": "Premium quality pizzas made from fresh ingredients",
        "icon": "Pizza"
      },
      {
        "title": "Kebabit",
        "titleEn": "Kebabs",
        "description": "Meheviä ja maukkaita kebabeja eri vaihtoehdoilla",
        "descriptionEn": "Juicy and tasty kebabs with different options",
        "icon": "UtensilsCrossed"
      },
      {
        "title": "Legendaariset Rullat",
        "titleEn": "Legendary Wraps",
        "description": "Kuuluisiksi tulleet rullat täynnä makua",
        "descriptionEn": "Famous wraps full of flavor",
        "icon": "ChefHat"
      },
      {
        "title": "Gyros Annokset",
        "titleEn": "Gyros Dishes",
        "description": "Perinteisiä kreikkalaisia gyros-annoksia",
        "descriptionEn": "Traditional Greek gyros dishes",
        "icon": "Heart"
      }
    ],
    "experience": "Laadukasta ruokaa Lahdessa",
    "experienceEn": "Quality food in Lahti"
  }',
  '{
    "backgroundImage": "https://images.unsplash.com/photo-1513104890138-7c749659a591?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80",
    "videoUrl": "https://videos.pexels.com/video-files/3752507/3752507-hd_1920_1080_24fps.mp4",
    "features": [
      {"title": "Premium pizzat", "titleEn": "Premium pizzas", "color": "#FF8C00"},
      {"title": "Nopea toimitus", "titleEn": "Fast delivery", "color": "#8B4513"},
      {"title": "Laadukkaita aterioita", "titleEn": "Quality meals", "color": "#F5E6D3"}
    ]
  }',
  true
) ON CONFLICT DO NOTHING;

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_restaurant_config_active ON restaurant_config(is_active) WHERE is_active = true;

-- Grant permissions
GRANT SELECT ON restaurant_config TO authenticated;
GRANT ALL ON restaurant_config TO service_role;