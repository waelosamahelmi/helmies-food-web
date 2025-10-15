-- Manual Migration Instructions
-- 
-- Run this SQL in your Supabase SQL Editor to add light theme structure
-- to existing restaurant configurations.

-- Step 1: Check current theme structure
SELECT id, name, theme FROM restaurant_config WHERE is_active = true;

-- Step 2: Add light theme structure to existing config
UPDATE restaurant_config 
SET theme = jsonb_set(
  theme,
  '{light}',
  '{
    "background": "hsl(0, 0%, 100%)",
    "foreground": "hsl(222.2, 84%, 4.9%)",
    "card": "hsl(0, 0%, 100%)",
    "cardForeground": "hsl(222.2, 84%, 4.9%)",
    "popover": "hsl(0, 0%, 100%)",
    "popoverForeground": "hsl(222.2, 84%, 4.9%)",
    "primary": "#8B4513",
    "primaryForeground": "hsl(0, 0%, 98%)",
    "secondary": "hsl(210, 40%, 96%)",
    "secondaryForeground": "hsl(222.2, 84%, 4.9%)",
    "muted": "hsl(210, 40%, 96%)",
    "mutedForeground": "hsl(215.4, 16.3%, 46.9%)",
    "accent": "#FF8C00",
    "accentForeground": "hsl(0, 0%, 98%)",
    "destructive": "hsl(0, 84.2%, 60.2%)",
    "destructiveForeground": "hsl(0, 0%, 98%)",
    "border": "hsl(214.3, 31.8%, 91.4%)",
    "input": "hsl(214.3, 31.8%, 91.4%)",
    "ring": "#8B4513"
  }'::jsonb,
  updated_at = now()
)
WHERE theme IS NOT NULL;

-- Step 3: Verify the update
SELECT id, name, 
       theme->'light' as light_theme,
       theme->'dark' as dark_theme
FROM restaurant_config 
WHERE is_active = true;

-- Optional: Add validation function
CREATE OR REPLACE FUNCTION validate_theme_structure(theme_json jsonb)
RETURNS boolean AS $$
BEGIN
  -- Check if theme has required legacy fields and light/dark objects
  RETURN (
    theme_json ? 'primary' AND
    theme_json ? 'light' AND
    theme_json ? 'dark' AND
    theme_json->'light' ? 'background' AND
    theme_json->'dark' ? 'background'
  );
END;
$$ LANGUAGE plpgsql;

-- Test the validation function
SELECT id, name, validate_theme_structure(theme) as is_valid_theme
FROM restaurant_config;