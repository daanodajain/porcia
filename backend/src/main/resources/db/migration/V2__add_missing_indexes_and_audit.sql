-- V2__add_missing_indexes_and_audit.sql
-- Ensure CMS tables expose BaseEntity columns before indexes reference them.
ALTER TABLE banners ADD COLUMN IF NOT EXISTS is_active BOOLEAN NOT NULL DEFAULT TRUE;
ALTER TABLE banners ADD COLUMN IF NOT EXISTS is_deleted BOOLEAN NOT NULL DEFAULT FALSE;
ALTER TABLE banners ADD COLUMN IF NOT EXISTS created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE banners ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP;

ALTER TABLE testimonials ADD COLUMN IF NOT EXISTS is_active BOOLEAN NOT NULL DEFAULT TRUE;
ALTER TABLE testimonials ADD COLUMN IF NOT EXISTS is_deleted BOOLEAN NOT NULL DEFAULT FALSE;
ALTER TABLE testimonials ADD COLUMN IF NOT EXISTS created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE testimonials ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP;

ALTER TABLE lookbooks ADD COLUMN IF NOT EXISTS display_order INTEGER DEFAULT 0;
ALTER TABLE lookbooks ADD COLUMN IF NOT EXISTS is_active BOOLEAN NOT NULL DEFAULT TRUE;
ALTER TABLE lookbooks ADD COLUMN IF NOT EXISTS is_deleted BOOLEAN NOT NULL DEFAULT FALSE;
ALTER TABLE lookbooks ADD COLUMN IF NOT EXISTS created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE lookbooks ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- Add indexes on frequently searched fields
CREATE INDEX IF NOT EXISTS idx_customers_email ON customers(email);
CREATE INDEX IF NOT EXISTS idx_customers_phone ON customers(phone);
CREATE INDEX IF NOT EXISTS idx_customers_created_at ON customers(created_at);

CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
CREATE INDEX IF NOT EXISTS idx_products_category_id ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_brand_id ON products(brand_id);
CREATE INDEX IF NOT EXISTS idx_products_created_at ON products(created_at);

CREATE INDEX IF NOT EXISTS idx_orders_customer_id ON orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(order_status);

CREATE INDEX IF NOT EXISTS idx_blogs_slug ON blogs(slug);
CREATE INDEX IF NOT EXISTS idx_blogs_created_at ON blogs(created_at);

CREATE INDEX IF NOT EXISTS idx_banners_display_order ON banners(display_order);
CREATE INDEX IF NOT EXISTS idx_banners_is_active ON banners(is_active);

CREATE INDEX IF NOT EXISTS idx_testimonials_created_at ON testimonials(created_at);

CREATE INDEX IF NOT EXISTS idx_lookbooks_display_order ON lookbooks(display_order);
CREATE INDEX IF NOT EXISTS idx_lookbooks_is_active ON lookbooks(is_active);

-- Add audit columns if not exist
ALTER TABLE customers ADD COLUMN IF NOT EXISTS created_by VARCHAR(255);
ALTER TABLE customers ADD COLUMN IF NOT EXISTS updated_by VARCHAR(255);
ALTER TABLE customers ADD COLUMN IF NOT EXISTS is_deleted BOOLEAN DEFAULT FALSE;

ALTER TABLE products ADD COLUMN IF NOT EXISTS created_by VARCHAR(255);
ALTER TABLE products ADD COLUMN IF NOT EXISTS updated_by VARCHAR(255);
ALTER TABLE products ADD COLUMN IF NOT EXISTS is_deleted BOOLEAN DEFAULT FALSE;

ALTER TABLE orders ADD COLUMN IF NOT EXISTS created_by VARCHAR(255);
ALTER TABLE orders ADD COLUMN IF NOT EXISTS updated_by VARCHAR(255);
ALTER TABLE orders ADD COLUMN IF NOT EXISTS is_deleted BOOLEAN DEFAULT FALSE;

ALTER TABLE blogs ADD COLUMN IF NOT EXISTS created_by VARCHAR(255);
ALTER TABLE blogs ADD COLUMN IF NOT EXISTS updated_by VARCHAR(255);
ALTER TABLE blogs ADD COLUMN IF NOT EXISTS is_deleted BOOLEAN DEFAULT FALSE;

ALTER TABLE banners ADD COLUMN IF NOT EXISTS created_by VARCHAR(255);
ALTER TABLE banners ADD COLUMN IF NOT EXISTS updated_by VARCHAR(255);
ALTER TABLE banners ADD COLUMN IF NOT EXISTS is_deleted BOOLEAN DEFAULT FALSE;

ALTER TABLE testimonials ADD COLUMN IF NOT EXISTS created_by VARCHAR(255);
ALTER TABLE testimonials ADD COLUMN IF NOT EXISTS updated_by VARCHAR(255);
ALTER TABLE testimonials ADD COLUMN IF NOT EXISTS is_deleted BOOLEAN DEFAULT FALSE;

ALTER TABLE lookbooks ADD COLUMN IF NOT EXISTS created_by VARCHAR(255);
ALTER TABLE lookbooks ADD COLUMN IF NOT EXISTS updated_by VARCHAR(255);
ALTER TABLE lookbooks ADD COLUMN IF NOT EXISTS is_deleted BOOLEAN DEFAULT FALSE;

-- Add compression flag for media
ALTER TABLE media ADD COLUMN IF NOT EXISTS is_compressed BOOLEAN DEFAULT FALSE;

-- Create audit log table
CREATE TABLE IF NOT EXISTS audit_logs (
  id BIGSERIAL PRIMARY KEY,
  entity_type VARCHAR(255) NOT NULL,
  entity_id BIGINT NOT NULL,
  action VARCHAR(50) NOT NULL,
  user_id BIGINT,
  user_email VARCHAR(255),
  changes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_audit_logs_entity ON audit_logs(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at);
