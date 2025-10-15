/*
  # Add light theme structure to restaurant_config

  1. Update existing theme JSON to include light mode structure
  2. Ensure all existing configurations have both light and dark theme objects
  3. Maintain backward compatibility with legacy theme fields

  This migration adds the missing light theme structure that matches
  the dark theme structure already present in the database.
*/

-- Update the existing restaurant config to add light theme structure
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
  }'::jsonb
)
WHERE theme IS NOT NULL;

-- Add a comment to document the theme structure
COMMENT ON COLUMN restaurant_config.theme IS 'Theme configuration with light and dark mode support. Contains legacy fields (primary, secondary, etc.) and new light/dark objects with complete CSS custom property definitions for Tailwind CSS theming.';

-- Create a function to validate theme structure (optional, for future use)
CREATE OR REPLACE FUNCTION validate_theme_structure(theme_json jsonb)
RETURNS boolean AS $$
BEGIN
  -- Check if theme has required legacy fields
  IF NOT (
    theme_json ? 'primary' AND
    theme_json ? 'secondary' AND
    theme_json ? 'accent' AND
    theme_json ? 'background' AND
    theme_json ? 'foreground'
  ) THEN
    RETURN false;
  END IF;
  
  -- Check if theme has light and dark objects
  IF NOT (
    theme_json ? 'light' AND
    theme_json ? 'dark'
  ) THEN
    RETURN false;
  END IF;
  
  -- Check if light theme has required fields
  IF NOT (
    theme_json->'light' ? 'background' AND
    theme_json->'light' ? 'foreground' AND
    theme_json->'light' ? 'card' AND
    theme_json->'light' ? 'primary' AND
    theme_json->'light' ? 'border'
  ) THEN
    RETURN false;
  END IF;
  
  -- Check if dark theme has required fields
  IF NOT (
    theme_json->'dark' ? 'background' AND
    theme_json->'dark' ? 'foreground' AND
    theme_json->'dark' ? 'card' AND
    theme_json->'dark' ? 'primary' AND
    theme_json->'dark' ? 'border'
  ) THEN
    RETURN false;
  END IF;
  
  RETURN true;
END;
$$ LANGUAGE plpgsql;

-- Add a check constraint to ensure theme structure is valid (optional)
-- ALTER TABLE restaurant_config 
-- ADD CONSTRAINT valid_theme_structure 
-- CHECK (validate_theme_structure(theme));

-- Update the updated_at timestamp for affected rows
UPDATE restaurant_config 
SET updated_at = now() 
WHERE theme IS NOT NULL;