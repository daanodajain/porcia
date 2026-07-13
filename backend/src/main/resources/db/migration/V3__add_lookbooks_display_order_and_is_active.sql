-- V3__add_lookbooks_display_order_and_is_active.sql
-- Add missing columns to lookbooks table for proper sorting and visibility control

ALTER TABLE lookbooks ADD COLUMN IF NOT EXISTS display_order INTEGER DEFAULT 0;
ALTER TABLE lookbooks ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE;

-- Create index for efficient sorting
CREATE INDEX IF NOT EXISTS idx_lookbooks_display_order ON lookbooks(display_order);
CREATE INDEX IF NOT EXISTS idx_lookbooks_is_active ON lookbooks(is_active);
