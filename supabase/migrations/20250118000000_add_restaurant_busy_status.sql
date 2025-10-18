-- Add busy status to restaurant_settings table
-- This allows the restaurant to temporarily pause orders when too busy

-- Add the is_busy column to restaurant_settings
ALTER TABLE restaurant_settings
ADD COLUMN IF NOT EXISTS is_busy BOOLEAN DEFAULT false;

-- Add a comment explaining the column
COMMENT ON COLUMN restaurant_settings.is_busy IS 'Indicates if restaurant is temporarily too busy to accept orders';

-- Update existing rows to set default value
UPDATE restaurant_settings
SET is_busy = false
WHERE is_busy IS NULL;
