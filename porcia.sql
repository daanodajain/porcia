-- =====================================================
-- PORCIA LUXURY FASHION - COMPLETE DATABASE SCHEMA
-- Generated from Backend Entities (Source of Truth)
-- PostgreSQL 18+
-- =====================================================

BEGIN;

-- =====================================================
-- MODULE 01: AUTHENTICATION & AUTHORIZATION
-- =====================================================

-- ROLES TABLE
CREATE TABLE roles
(
    id              BIGSERIAL PRIMARY KEY,
    name            VARCHAR(100) NOT NULL UNIQUE,
    description     VARCHAR(255),
    created_by      BIGINT,
    updated_by      BIGINT,
    is_deleted      BOOLEAN NOT NULL DEFAULT FALSE,
    is_active       BOOLEAN NOT NULL DEFAULT TRUE,
    created_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_roles_name ON roles(name);

-- PERMISSIONS TABLE
CREATE TABLE permissions
(
    id              BIGSERIAL PRIMARY KEY,
    permission_key  VARCHAR(150) NOT NULL UNIQUE,
    created_by      BIGINT,
    updated_by      BIGINT,
    is_deleted      BOOLEAN NOT NULL DEFAULT FALSE,
    is_active       BOOLEAN NOT NULL DEFAULT TRUE,
    created_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_permissions_key ON permissions(permission_key);

-- ADMIN USERS TABLE
CREATE TABLE admin_users
(
    id              BIGSERIAL PRIMARY KEY,
    role_id         BIGINT NOT NULL,
    first_name      VARCHAR(100) NOT NULL,
    last_name       VARCHAR(100),
    email           VARCHAR(255) NOT NULL UNIQUE,
    phone           VARCHAR(20),
    password_hash   VARCHAR(255) NOT NULL,
    profile_image   TEXT,
    last_login      TIMESTAMP,
    is_locked       BOOLEAN DEFAULT FALSE,
    is_active       BOOLEAN NOT NULL DEFAULT TRUE,
    is_deleted      BOOLEAN NOT NULL DEFAULT FALSE,
    created_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_admin_role
        FOREIGN KEY(role_id)
        REFERENCES roles(id)
);

CREATE INDEX idx_admin_email ON admin_users(email);
CREATE INDEX idx_admin_role ON admin_users(role_id);

-- CUSTOMERS TABLE
CREATE TABLE customers
(
    id              BIGSERIAL PRIMARY KEY,
    first_name      VARCHAR(100) NOT NULL,
    last_name       VARCHAR(100),
    email           VARCHAR(255) UNIQUE,
    phone           VARCHAR(20) NOT NULL UNIQUE,
    password_hash   VARCHAR(255),
    date_of_birth   DATE,
    gender          VARCHAR(20),
    email_verified  BOOLEAN DEFAULT FALSE,
    phone_verified  BOOLEAN DEFAULT FALSE,
    is_active       BOOLEAN NOT NULL DEFAULT TRUE,
    is_deleted      BOOLEAN NOT NULL DEFAULT FALSE,
    created_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_customer_email ON customers(email);
CREATE INDEX idx_customer_phone ON customers(phone);

-- CUSTOMER ADDRESSES TABLE
CREATE TABLE customer_addresses
(
    id              BIGSERIAL PRIMARY KEY,
    customer_id     BIGINT NOT NULL,
    address_line_1  VARCHAR(255) NOT NULL,
    address_line_2  VARCHAR(255),
    city            VARCHAR(100) NOT NULL,
    state           VARCHAR(100),
    postal_code     VARCHAR(20),
    country         VARCHAR(100) NOT NULL,
    full_name       VARCHAR(200),
    phone           VARCHAR(20),
    is_default      BOOLEAN NOT NULL DEFAULT FALSE,
    address_type    VARCHAR(20) DEFAULT 'SHIPPING',
    is_active       BOOLEAN NOT NULL DEFAULT TRUE,
    is_deleted      BOOLEAN NOT NULL DEFAULT FALSE,
    created_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_address_customer
        FOREIGN KEY(customer_id)
        REFERENCES customers(id)
        ON DELETE CASCADE
);

CREATE INDEX idx_customer_address_customer ON customer_addresses(customer_id);

-- REFRESH TOKENS TABLE
CREATE TABLE refresh_tokens
(
    id              BIGSERIAL PRIMARY KEY,
    subject         VARCHAR(255) NOT NULL,
    token           VARCHAR(512) NOT NULL,
    expires_at      TIMESTAMP NOT NULL,
    revoked         BOOLEAN NOT NULL DEFAULT FALSE,
    created_by      BIGINT,
    updated_by      BIGINT,
    is_deleted      BOOLEAN NOT NULL DEFAULT FALSE,
    is_active       BOOLEAN NOT NULL DEFAULT TRUE,
    created_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_refresh_token ON refresh_tokens(token);
CREATE INDEX idx_refresh_expires ON refresh_tokens(expires_at);

-- BLACKLIST TOKENS TABLE
CREATE TABLE blacklist_tokens
(
    id              BIGSERIAL PRIMARY KEY,
    token           VARCHAR(512) NOT NULL UNIQUE,
    expires_at      TIMESTAMP NOT NULL,
    created_by      BIGINT,
    updated_by      BIGINT,
    is_deleted      BOOLEAN NOT NULL DEFAULT FALSE,
    is_active       BOOLEAN NOT NULL DEFAULT TRUE,
    created_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_blacklist_token ON blacklist_tokens(token);
CREATE INDEX idx_blacklist_expires ON blacklist_tokens(expires_at);

-- =====================================================
-- MODULE 02: CMS (CONTENT MANAGEMENT)
-- =====================================================

-- MEDIA LIBRARY TABLE
CREATE TABLE media
(
    id              BIGSERIAL PRIMARY KEY,
    file_name       VARCHAR(255) NOT NULL,
    original_name   VARCHAR(255),
    file_type       VARCHAR(50),
    file_extension  VARCHAR(20),
    mime_type       VARCHAR(100),
    file_size       BIGINT,
    width           INTEGER,
    height          INTEGER,
    alt_text        VARCHAR(255),
    title           VARCHAR(255),
    storage_path    TEXT NOT NULL,
    created_by      BIGINT,
    is_active       BOOLEAN NOT NULL DEFAULT TRUE,
    is_deleted      BOOLEAN NOT NULL DEFAULT FALSE,
    created_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_media_type ON media(file_type);

-- PAGES TABLE
CREATE TABLE pages
(
    id              BIGSERIAL PRIMARY KEY,
    title           VARCHAR(200) NOT NULL,
    slug            VARCHAR(200) NOT NULL UNIQUE,
    meta_title      VARCHAR(255),
    meta_description TEXT,
    meta_keywords   TEXT,
    page_type       VARCHAR(50) NOT NULL,
    is_homepage     BOOLEAN,
    status          VARCHAR(20),
    display_order   INTEGER,
    created_by      BIGINT,
    updated_by      BIGINT,
    is_active       BOOLEAN NOT NULL DEFAULT TRUE,
    is_deleted      BOOLEAN NOT NULL DEFAULT FALSE,
    created_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_pages_created_by
        FOREIGN KEY(created_by)
        REFERENCES admin_users(id),

    CONSTRAINT fk_pages_updated_by
        FOREIGN KEY(updated_by)
        REFERENCES admin_users(id)
);

CREATE INDEX idx_pages_slug ON pages(slug);
CREATE INDEX idx_pages_status ON pages(status);

-- PAGE SECTIONS TABLE (for dynamic page sections)
CREATE TABLE page_sections
(
    id                  BIGSERIAL PRIMARY KEY,
    page_id             BIGINT NOT NULL,
    section_key         VARCHAR(100) NOT NULL,
    title               VARCHAR(255),
    subtitle            TEXT,
    description         TEXT,
    button_text         VARCHAR(150),
    button_link         VARCHAR(255),
    background_image    TEXT,
    background_video    TEXT,
    json_data           TEXT,
    display_order       INTEGER,
    is_visible          BOOLEAN,
    is_active           BOOLEAN NOT NULL DEFAULT TRUE,
    is_deleted          BOOLEAN NOT NULL DEFAULT FALSE,
    created_at          TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at          TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_page_section
        FOREIGN KEY(page_id)
        REFERENCES pages(id)
        ON DELETE CASCADE
);

CREATE INDEX idx_page_sections_page ON page_sections(page_id);

-- HOME SECTIONS TABLE (separate from page_sections for homepage specific sections)
CREATE TABLE home_sections
(
    id              BIGSERIAL PRIMARY KEY,
    section_key     VARCHAR(100) NOT NULL UNIQUE,
    title           VARCHAR(255),
    subtitle        TEXT,
    display_order   INTEGER,
    is_visible      BOOLEAN,
    is_active       BOOLEAN NOT NULL DEFAULT TRUE,
    is_deleted      BOOLEAN NOT NULL DEFAULT FALSE,
    created_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_home_sections_key ON home_sections(section_key);

-- BANNERS TABLE
CREATE TABLE banners
(
    id              BIGSERIAL PRIMARY KEY,
    title           VARCHAR(255),
    subtitle        TEXT,
    image_id        BIGINT,
    mobile_image_id BIGINT,
    button_text     VARCHAR(150),
    button_link     VARCHAR(255),
    banner_position VARCHAR(100),
    display_order   INTEGER,
    start_date      TIMESTAMP,
    end_date        TIMESTAMP,
    is_active       BOOLEAN NOT NULL DEFAULT TRUE,
    is_deleted      BOOLEAN NOT NULL DEFAULT FALSE,
    created_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_banner_image
        FOREIGN KEY(image_id)
        REFERENCES media(id),

    CONSTRAINT fk_banner_mobile
        FOREIGN KEY(mobile_image_id)
        REFERENCES media(id)
);

CREATE INDEX idx_banner_position ON banners(banner_position);

-- BLOG CATEGORIES TABLE
CREATE TABLE blog_categories
(
    id              BIGSERIAL PRIMARY KEY,
    name            VARCHAR(255) NOT NULL UNIQUE,
    slug            VARCHAR(255) NOT NULL UNIQUE,
    is_active       BOOLEAN NOT NULL DEFAULT TRUE,
    is_deleted      BOOLEAN NOT NULL DEFAULT FALSE,
    created_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_blog_categories_slug ON blog_categories(slug);

-- BLOGS TABLE (used by both CMS and Marketing modules)
CREATE TABLE blogs
(
    id                  BIGSERIAL PRIMARY KEY,
    category_id         BIGINT,
    author_id           BIGINT,
    title               VARCHAR(255) NOT NULL,
    slug                VARCHAR(255) NOT NULL UNIQUE,
    short_description   TEXT,
    content             TEXT,
    featured_image      TEXT,
    banner_image        TEXT,
    meta_title          TEXT,
    meta_description    TEXT,
    meta_keywords       TEXT,
    total_views         BIGINT,
    is_featured         BOOLEAN,
    status              VARCHAR(30) DEFAULT 'DRAFT',
    published_at        TIMESTAMP,
    is_active           BOOLEAN NOT NULL DEFAULT TRUE,
    is_deleted          BOOLEAN NOT NULL DEFAULT FALSE,
    created_at          TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at          TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_blogs_category
        FOREIGN KEY(category_id)
        REFERENCES blog_categories(id),

    CONSTRAINT fk_blogs_author
        FOREIGN KEY(author_id)
        REFERENCES admin_users(id)
);

CREATE INDEX idx_blogs_slug ON blogs(slug);
CREATE INDEX idx_blogs_status ON blogs(status);
CREATE INDEX idx_blogs_category ON blogs(category_id);

-- LOOKBOOKS TABLE
CREATE TABLE lookbooks
(
    id              BIGSERIAL PRIMARY KEY,
    title           VARCHAR(255),
    slug            VARCHAR(255) UNIQUE,
    description     TEXT,
    cover_image     TEXT,
    season          VARCHAR(100),
    lookbook_year   INTEGER,
    status          VARCHAR(30),
    display_order   INTEGER DEFAULT 0,
    is_active       BOOLEAN NOT NULL DEFAULT TRUE,
    is_deleted      BOOLEAN NOT NULL DEFAULT FALSE,
    created_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_lookbooks_slug ON lookbooks(slug);

-- TESTIMONIALS TABLE
CREATE TABLE testimonials
(
    id              BIGSERIAL PRIMARY KEY,
    customer_name   VARCHAR(150),
    designation     VARCHAR(150),
    company         VARCHAR(150),
    profile_image   TEXT,
    rating          SMALLINT,
    testimonial     TEXT NOT NULL,
    display_order   INTEGER,
    is_featured     BOOLEAN,
    is_active       BOOLEAN NOT NULL DEFAULT TRUE,
    is_deleted      BOOLEAN NOT NULL DEFAULT FALSE,
    created_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- FAQ CATEGORIES TABLE
CREATE TABLE faq_categories
(
    id              BIGSERIAL PRIMARY KEY,
    name            VARCHAR(150) NOT NULL UNIQUE,
    display_order   INTEGER,
    is_active       BOOLEAN NOT NULL DEFAULT TRUE,
    is_deleted      BOOLEAN NOT NULL DEFAULT FALSE,
    created_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- FAQS TABLE
CREATE TABLE faqs
(
    id              BIGSERIAL PRIMARY KEY,
    category_id     BIGINT,
    question        TEXT NOT NULL,
    answer          TEXT NOT NULL,
    display_order   INTEGER,
    is_active       BOOLEAN NOT NULL DEFAULT TRUE,
    is_deleted      BOOLEAN NOT NULL DEFAULT FALSE,
    created_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_faqs_category
        FOREIGN KEY(category_id)
        REFERENCES faq_categories(id)
);

CREATE INDEX idx_faqs_category ON faqs(category_id);

-- =====================================================
-- MODULE 03: PRODUCT CATALOG
-- =====================================================

-- CATEGORIES TABLE
CREATE TABLE categories
(
    id              BIGSERIAL PRIMARY KEY,
    name            VARCHAR(255) NOT NULL UNIQUE,
    slug            VARCHAR(255) NOT NULL UNIQUE,
    description     TEXT,
    is_active       BOOLEAN NOT NULL DEFAULT TRUE,
    is_deleted      BOOLEAN NOT NULL DEFAULT FALSE,
    created_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_categories_slug ON categories(slug);

-- BRANDS TABLE
CREATE TABLE brands
(
    id              BIGSERIAL PRIMARY KEY,
    name            VARCHAR(255) NOT NULL UNIQUE,
    slug            VARCHAR(255) NOT NULL UNIQUE,
    description     TEXT,
    logo            TEXT,
    is_active       BOOLEAN NOT NULL DEFAULT TRUE,
    is_deleted      BOOLEAN NOT NULL DEFAULT FALSE,
    created_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_brands_slug ON brands(slug);

-- COLLECTIONS TABLE
CREATE TABLE collections
(
    id              BIGSERIAL PRIMARY KEY,
    name            VARCHAR(255) NOT NULL UNIQUE,
    slug            VARCHAR(255) NOT NULL UNIQUE,
    description     TEXT,
    is_active       BOOLEAN NOT NULL DEFAULT TRUE,
    is_deleted      BOOLEAN NOT NULL DEFAULT FALSE,
    created_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_collections_slug ON collections(slug);

-- PRODUCTS TABLE
CREATE TABLE products
(
    id                      BIGSERIAL PRIMARY KEY,
    category_id             BIGINT NOT NULL,
    brand_id                BIGINT NOT NULL,
    collection_id           BIGINT,
    name                    VARCHAR(255) NOT NULL,
    slug                    VARCHAR(255) NOT NULL UNIQUE,
    sku                     VARCHAR(100) NOT NULL UNIQUE,
    barcode                 VARCHAR(100),
    short_description       TEXT,
    description             TEXT,
    mrp                     DECIMAL(12,2) NOT NULL,
    selling_price           DECIMAL(12,2) NOT NULL,
    cost_price              DECIMAL(12,2),
    tax_percentage          DECIMAL(5,2),
    stock_quantity          INTEGER DEFAULT 0,
    min_stock               INTEGER,
    max_order_quantity      INTEGER,
    weight                  DECIMAL(10,2),
    length                  DECIMAL(10,2),
    width                   DECIMAL(10,2),
    height                  DECIMAL(10,2),
    material                VARCHAR(150),
    fabric                  VARCHAR(150),
    fit                     VARCHAR(100),
    sleeve                  VARCHAR(100),
    neck                    VARCHAR(100),
    pattern                 VARCHAR(100),
    occasion                VARCHAR(100),
    country_of_origin       VARCHAR(150),
    hsn_code                VARCHAR(50),
    gst_code                VARCHAR(50),
    seo_title               TEXT,
    seo_description         TEXT,
    seo_keywords            TEXT,
    is_featured             BOOLEAN DEFAULT FALSE,
    is_best_seller          BOOLEAN DEFAULT FALSE,
    is_new_arrival          BOOLEAN DEFAULT FALSE,
    is_trending             BOOLEAN DEFAULT FALSE,
    is_sale                 BOOLEAN DEFAULT FALSE,
    is_recommended          BOOLEAN DEFAULT FALSE,
    is_luxury               BOOLEAN DEFAULT FALSE,
    is_returnable           BOOLEAN DEFAULT TRUE,
    is_exchangeable         BOOLEAN DEFAULT TRUE,
    is_cod_available        BOOLEAN DEFAULT TRUE,
    average_rating          DECIMAL(3,2),
    total_reviews           INTEGER,
    status                  VARCHAR(30),
    published_at            TIMESTAMP,
    display_order           INTEGER,
    total_views             BIGINT,
    total_sales             BIGINT,
    created_by              BIGINT,
    updated_by              BIGINT,
    is_active               BOOLEAN DEFAULT TRUE,
    is_deleted              BOOLEAN DEFAULT FALSE,
    created_at              TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at              TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_product_category
        FOREIGN KEY(category_id)
        REFERENCES categories(id),

    CONSTRAINT fk_product_brand
        FOREIGN KEY(brand_id)
        REFERENCES brands(id),

    CONSTRAINT fk_product_collection
        FOREIGN KEY(collection_id)
        REFERENCES collections(id),

    CONSTRAINT fk_product_created_by
        FOREIGN KEY(created_by)
        REFERENCES admin_users(id),

    CONSTRAINT fk_product_updated_by
        FOREIGN KEY(updated_by)
        REFERENCES admin_users(id)
);

CREATE INDEX idx_products_slug ON products(slug);
CREATE INDEX idx_products_sku ON products(sku);
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_brand ON products(brand_id);
CREATE INDEX idx_products_collection ON products(collection_id);
CREATE INDEX idx_products_status ON products(status);

-- PRODUCT VARIANTS TABLE
CREATE TABLE product_variants
(
    id              BIGSERIAL PRIMARY KEY,
    product_id      BIGINT NOT NULL,
    sku             VARCHAR(255) NOT NULL UNIQUE,
    price           DECIMAL(12,2),
    quantity        INTEGER NOT NULL,
    color           VARCHAR(100),
    product_size    VARCHAR(100),
    is_active       BOOLEAN NOT NULL DEFAULT TRUE,
    is_deleted      BOOLEAN NOT NULL DEFAULT FALSE,
    created_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_variant_product
        FOREIGN KEY(product_id)
        REFERENCES products(id)
        ON DELETE CASCADE
);

CREATE INDEX idx_product_variants_product ON product_variants(product_id);
CREATE INDEX idx_product_variants_sku ON product_variants(sku);

-- PRODUCT IMAGES TABLE
CREATE TABLE product_images
(
    id              BIGSERIAL PRIMARY KEY,
    product_id      BIGINT NOT NULL,
    url             TEXT NOT NULL,
    alt_text        TEXT,
    is_active       BOOLEAN NOT NULL DEFAULT TRUE,
    is_deleted      BOOLEAN NOT NULL DEFAULT FALSE,
    created_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_product_image
        FOREIGN KEY(product_id)
        REFERENCES products(id)
        ON DELETE CASCADE
);

CREATE INDEX idx_product_images_product ON product_images(product_id);

-- =====================================================
-- MODULE 04: CART & CHECKOUT
-- =====================================================

-- CARTS TABLE
CREATE TABLE carts
(
    id                  BIGSERIAL PRIMARY KEY,
    customer_id         BIGINT,
    session_id          UUID,
    coupon_code         VARCHAR(100),
    discount_amount     DECIMAL(12,2) DEFAULT 0,
    shipping_charge     DECIMAL(12,2) DEFAULT 0,
    subtotal            DECIMAL(12,2) DEFAULT 0,
    grand_total         DECIMAL(12,2) DEFAULT 0,
    status              VARCHAR(30),
    is_active           BOOLEAN NOT NULL DEFAULT TRUE,
    is_deleted          BOOLEAN NOT NULL DEFAULT FALSE,
    created_at          TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at          TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_cart_customer
        FOREIGN KEY(customer_id)
        REFERENCES customers(id)
);

CREATE INDEX idx_carts_customer ON carts(customer_id);
CREATE INDEX idx_carts_session ON carts(session_id);

-- CART ITEMS TABLE
CREATE TABLE cart_items
(
    id              BIGSERIAL PRIMARY KEY,
    cart_id         BIGINT NOT NULL,
    product_id      BIGINT NOT NULL,
    variant_id      BIGINT,
    quantity        INTEGER NOT NULL,
    unit_price      DECIMAL(12,2) NOT NULL,
    total_price     DECIMAL(12,2) NOT NULL,
    is_active       BOOLEAN NOT NULL DEFAULT TRUE,
    is_deleted      BOOLEAN NOT NULL DEFAULT FALSE,
    created_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_cart_item_cart
        FOREIGN KEY(cart_id)
        REFERENCES carts(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_cart_item_product
        FOREIGN KEY(product_id)
        REFERENCES products(id),

    CONSTRAINT fk_cart_item_variant
        FOREIGN KEY(variant_id)
        REFERENCES product_variants(id)
);

CREATE INDEX idx_cart_items_cart ON cart_items(cart_id);
CREATE INDEX idx_cart_items_product ON cart_items(product_id);

-- =====================================================
-- MODULE 05: ORDERS & PAYMENTS
-- =====================================================

-- ORDERS TABLE
CREATE TABLE orders
(
    id                      BIGSERIAL PRIMARY KEY,
    order_number            VARCHAR(100) NOT NULL UNIQUE,
    customer_id             BIGINT NOT NULL,
    billing_address_id      BIGINT,
    shipping_address_id     BIGINT,
    payment_method          VARCHAR(50),
    payment_status          VARCHAR(30) DEFAULT 'PENDING',
    order_status            VARCHAR(30) DEFAULT 'PENDING',
    currency                VARCHAR(10) DEFAULT 'INR',
    subtotal                DECIMAL(12,2),
    discount_amount         DECIMAL(12,2),
    coupon_code             VARCHAR(100),
    shipping_charge         DECIMAL(12,2),
    tax_amount              DECIMAL(12,2),
    grand_total             DECIMAL(12,2),
    customer_note           TEXT,
    is_active               BOOLEAN NOT NULL DEFAULT TRUE,
    is_deleted              BOOLEAN NOT NULL DEFAULT FALSE,
    created_at              TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at              TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_order_customer
        FOREIGN KEY(customer_id)
        REFERENCES customers(id),

    CONSTRAINT fk_order_billing_address
        FOREIGN KEY(billing_address_id)
        REFERENCES customer_addresses(id),

    CONSTRAINT fk_order_shipping_address
        FOREIGN KEY(shipping_address_id)
        REFERENCES customer_addresses(id)
);

CREATE INDEX idx_orders_number ON orders(order_number);
CREATE INDEX idx_orders_customer ON orders(customer_id);
CREATE INDEX idx_orders_status ON orders(order_status);

-- ORDER ITEMS TABLE
CREATE TABLE order_items
(
    id              BIGSERIAL PRIMARY KEY,
    order_id        BIGINT NOT NULL,
    product_id      BIGINT NOT NULL,
    variant_id      BIGINT,
    product_name    VARCHAR(255),
    sku             VARCHAR(100),
    quantity        INTEGER NOT NULL,
    unit_price      DECIMAL(12,2),
    total_price     DECIMAL(12,2),
    is_active       BOOLEAN NOT NULL DEFAULT TRUE,
    is_deleted      BOOLEAN NOT NULL DEFAULT FALSE,
    created_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_order_item_order
        FOREIGN KEY(order_id)
        REFERENCES orders(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_order_item_product
        FOREIGN KEY(product_id)
        REFERENCES products(id),

    CONSTRAINT fk_order_item_variant
        FOREIGN KEY(variant_id)
        REFERENCES product_variants(id)
);

CREATE INDEX idx_order_items_order ON order_items(order_id);

-- ORDER STATUS HISTORY TABLE
CREATE TABLE order_status_history
(
    id              BIGSERIAL PRIMARY KEY,
    order_id        BIGINT NOT NULL,
    status          VARCHAR(50) NOT NULL,
    remarks         TEXT,
    changed_by      BIGINT,
    is_active       BOOLEAN NOT NULL DEFAULT TRUE,
    is_deleted      BOOLEAN NOT NULL DEFAULT FALSE,
    created_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_order_status_order
        FOREIGN KEY(order_id)
        REFERENCES orders(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_order_status_changed_by
        FOREIGN KEY(changed_by)
        REFERENCES admin_users(id)
);

CREATE INDEX idx_order_status_order ON order_status_history(order_id);

-- PAYMENTS TABLE
CREATE TABLE payments
(
    id                          BIGSERIAL PRIMARY KEY,
    order_id                    BIGINT NOT NULL,
    payment_gateway             VARCHAR(100),
    gateway_transaction_id      VARCHAR(255),
    gateway_order_id            VARCHAR(255),
    payment_reference           VARCHAR(255),
    amount                      DECIMAL(12,2) NOT NULL,
    currency                    VARCHAR(10) DEFAULT 'INR',
    payment_status              VARCHAR(30) DEFAULT 'PENDING',
    paid_at                     TIMESTAMP,
    is_active                   BOOLEAN NOT NULL DEFAULT TRUE,
    is_deleted                  BOOLEAN NOT NULL DEFAULT FALSE,
    created_at                  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at                  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_payment_order
        FOREIGN KEY(order_id)
        REFERENCES orders(id)
        ON DELETE CASCADE
);

CREATE INDEX idx_payments_order ON payments(order_id);
CREATE INDEX idx_payments_status ON payments(payment_status);

-- =====================================================
-- MODULE 06: SHIPMENTS
-- =====================================================

-- SHIPMENTS TABLE
CREATE TABLE shipments
(
    id                  BIGSERIAL PRIMARY KEY,
    order_id            BIGINT NOT NULL,
    courier_name        VARCHAR(150),
    tracking_number     VARCHAR(255),
    shipped_at          TIMESTAMP,
    delivered_at        TIMESTAMP,
    shipping_status     VARCHAR(50) DEFAULT 'PENDING',
    is_active           BOOLEAN NOT NULL DEFAULT TRUE,
    is_deleted          BOOLEAN NOT NULL DEFAULT FALSE,
    created_at          TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at          TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_shipment_order
        FOREIGN KEY(order_id)
        REFERENCES orders(id)
        ON DELETE CASCADE
);

CREATE INDEX idx_shipments_order ON shipments(order_id);
CREATE INDEX idx_shipments_status ON shipments(shipping_status);

COMMIT;

-- =====================================================
-- CMS BASE ENTITY COMPATIBILITY REPAIR
-- Run this section on existing databases created before
-- CMS tables had BaseEntity audit columns.
-- =====================================================

BEGIN;

ALTER TABLE media ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE;
ALTER TABLE media ADD COLUMN IF NOT EXISTS is_deleted BOOLEAN DEFAULT FALSE;
ALTER TABLE media ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE media ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;

UPDATE media
SET is_active = COALESCE(is_active, TRUE),
    is_deleted = COALESCE(is_deleted, FALSE),
    created_at = COALESCE(created_at, CURRENT_TIMESTAMP),
    updated_at = COALESCE(updated_at, CURRENT_TIMESTAMP);

ALTER TABLE media ALTER COLUMN is_active SET DEFAULT TRUE;
ALTER TABLE media ALTER COLUMN is_active SET NOT NULL;
ALTER TABLE media ALTER COLUMN is_deleted SET DEFAULT FALSE;
ALTER TABLE media ALTER COLUMN is_deleted SET NOT NULL;
ALTER TABLE media ALTER COLUMN created_at SET DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE media ALTER COLUMN created_at SET NOT NULL;
ALTER TABLE media ALTER COLUMN updated_at SET DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE media ALTER COLUMN updated_at SET NOT NULL;

ALTER TABLE pages ADD COLUMN IF NOT EXISTS content TEXT;
ALTER TABLE pages ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE;
ALTER TABLE pages ADD COLUMN IF NOT EXISTS is_deleted BOOLEAN DEFAULT FALSE;
ALTER TABLE pages ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE pages ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;

UPDATE pages
SET is_active = COALESCE(is_active, TRUE),
    is_deleted = COALESCE(is_deleted, FALSE),
    created_at = COALESCE(created_at, CURRENT_TIMESTAMP),
    updated_at = COALESCE(updated_at, CURRENT_TIMESTAMP);

ALTER TABLE pages ALTER COLUMN is_active SET DEFAULT TRUE;
ALTER TABLE pages ALTER COLUMN is_active SET NOT NULL;
ALTER TABLE pages ALTER COLUMN is_deleted SET DEFAULT FALSE;
ALTER TABLE pages ALTER COLUMN is_deleted SET NOT NULL;
ALTER TABLE pages ALTER COLUMN created_at SET DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE pages ALTER COLUMN created_at SET NOT NULL;
ALTER TABLE pages ALTER COLUMN updated_at SET DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE pages ALTER COLUMN updated_at SET NOT NULL;

ALTER TABLE page_sections ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE;
ALTER TABLE page_sections ADD COLUMN IF NOT EXISTS is_deleted BOOLEAN DEFAULT FALSE;
ALTER TABLE page_sections ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE page_sections ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;

UPDATE page_sections
SET is_active = COALESCE(is_active, TRUE),
    is_deleted = COALESCE(is_deleted, FALSE),
    created_at = COALESCE(created_at, CURRENT_TIMESTAMP),
    updated_at = COALESCE(updated_at, CURRENT_TIMESTAMP);

ALTER TABLE page_sections ALTER COLUMN is_active SET DEFAULT TRUE;
ALTER TABLE page_sections ALTER COLUMN is_active SET NOT NULL;
ALTER TABLE page_sections ALTER COLUMN is_deleted SET DEFAULT FALSE;
ALTER TABLE page_sections ALTER COLUMN is_deleted SET NOT NULL;
ALTER TABLE page_sections ALTER COLUMN created_at SET DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE page_sections ALTER COLUMN created_at SET NOT NULL;
ALTER TABLE page_sections ALTER COLUMN updated_at SET DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE page_sections ALTER COLUMN updated_at SET NOT NULL;

ALTER TABLE home_sections ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE;
ALTER TABLE home_sections ADD COLUMN IF NOT EXISTS is_deleted BOOLEAN DEFAULT FALSE;
ALTER TABLE home_sections ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE home_sections ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;

UPDATE home_sections
SET is_active = COALESCE(is_active, TRUE),
    is_deleted = COALESCE(is_deleted, FALSE),
    created_at = COALESCE(created_at, CURRENT_TIMESTAMP),
    updated_at = COALESCE(updated_at, CURRENT_TIMESTAMP);

ALTER TABLE home_sections ALTER COLUMN is_active SET DEFAULT TRUE;
ALTER TABLE home_sections ALTER COLUMN is_active SET NOT NULL;
ALTER TABLE home_sections ALTER COLUMN is_deleted SET DEFAULT FALSE;
ALTER TABLE home_sections ALTER COLUMN is_deleted SET NOT NULL;
ALTER TABLE home_sections ALTER COLUMN created_at SET DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE home_sections ALTER COLUMN created_at SET NOT NULL;
ALTER TABLE home_sections ALTER COLUMN updated_at SET DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE home_sections ALTER COLUMN updated_at SET NOT NULL;

ALTER TABLE banners ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE;
ALTER TABLE banners ADD COLUMN IF NOT EXISTS is_deleted BOOLEAN DEFAULT FALSE;
ALTER TABLE banners ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE banners ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;

UPDATE banners
SET is_active = COALESCE(is_active, TRUE),
    is_deleted = COALESCE(is_deleted, FALSE),
    created_at = COALESCE(created_at, CURRENT_TIMESTAMP),
    updated_at = COALESCE(updated_at, CURRENT_TIMESTAMP);

ALTER TABLE banners ALTER COLUMN is_active SET DEFAULT TRUE;
ALTER TABLE banners ALTER COLUMN is_active SET NOT NULL;
ALTER TABLE banners ALTER COLUMN is_deleted SET DEFAULT FALSE;
ALTER TABLE banners ALTER COLUMN is_deleted SET NOT NULL;
ALTER TABLE banners ALTER COLUMN created_at SET DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE banners ALTER COLUMN created_at SET NOT NULL;
ALTER TABLE banners ALTER COLUMN updated_at SET DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE banners ALTER COLUMN updated_at SET NOT NULL;

ALTER TABLE testimonials ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE;
ALTER TABLE testimonials ADD COLUMN IF NOT EXISTS is_deleted BOOLEAN DEFAULT FALSE;
ALTER TABLE testimonials ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE testimonials ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;

UPDATE testimonials
SET is_active = COALESCE(is_active, TRUE),
    is_deleted = COALESCE(is_deleted, FALSE),
    created_at = COALESCE(created_at, CURRENT_TIMESTAMP),
    updated_at = COALESCE(updated_at, CURRENT_TIMESTAMP);

ALTER TABLE testimonials ALTER COLUMN is_active SET DEFAULT TRUE;
ALTER TABLE testimonials ALTER COLUMN is_active SET NOT NULL;
ALTER TABLE testimonials ALTER COLUMN is_deleted SET DEFAULT FALSE;
ALTER TABLE testimonials ALTER COLUMN is_deleted SET NOT NULL;
ALTER TABLE testimonials ALTER COLUMN created_at SET DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE testimonials ALTER COLUMN created_at SET NOT NULL;
ALTER TABLE testimonials ALTER COLUMN updated_at SET DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE testimonials ALTER COLUMN updated_at SET NOT NULL;

ALTER TABLE lookbooks ADD COLUMN IF NOT EXISTS display_order INTEGER DEFAULT 0;
ALTER TABLE lookbooks ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE;
ALTER TABLE lookbooks ADD COLUMN IF NOT EXISTS is_deleted BOOLEAN DEFAULT FALSE;
ALTER TABLE lookbooks ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE lookbooks ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;

UPDATE lookbooks
SET display_order = COALESCE(display_order, 0),
    is_active = COALESCE(is_active, TRUE),
    is_deleted = COALESCE(is_deleted, FALSE),
    created_at = COALESCE(created_at, CURRENT_TIMESTAMP),
    updated_at = COALESCE(updated_at, CURRENT_TIMESTAMP);

ALTER TABLE lookbooks ALTER COLUMN display_order SET DEFAULT 0;
ALTER TABLE lookbooks ALTER COLUMN is_active SET DEFAULT TRUE;
ALTER TABLE lookbooks ALTER COLUMN is_active SET NOT NULL;
ALTER TABLE lookbooks ALTER COLUMN is_deleted SET DEFAULT FALSE;
ALTER TABLE lookbooks ALTER COLUMN is_deleted SET NOT NULL;
ALTER TABLE lookbooks ALTER COLUMN created_at SET DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE lookbooks ALTER COLUMN created_at SET NOT NULL;
ALTER TABLE lookbooks ALTER COLUMN updated_at SET DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE lookbooks ALTER COLUMN updated_at SET NOT NULL;

ALTER TABLE faq_categories ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE;
ALTER TABLE faq_categories ADD COLUMN IF NOT EXISTS is_deleted BOOLEAN DEFAULT FALSE;
ALTER TABLE faq_categories ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE faq_categories ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;

UPDATE faq_categories
SET is_active = COALESCE(is_active, TRUE),
    is_deleted = COALESCE(is_deleted, FALSE),
    created_at = COALESCE(created_at, CURRENT_TIMESTAMP),
    updated_at = COALESCE(updated_at, CURRENT_TIMESTAMP);

ALTER TABLE faq_categories ALTER COLUMN is_active SET DEFAULT TRUE;
ALTER TABLE faq_categories ALTER COLUMN is_active SET NOT NULL;
ALTER TABLE faq_categories ALTER COLUMN is_deleted SET DEFAULT FALSE;
ALTER TABLE faq_categories ALTER COLUMN is_deleted SET NOT NULL;
ALTER TABLE faq_categories ALTER COLUMN created_at SET DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE faq_categories ALTER COLUMN created_at SET NOT NULL;
ALTER TABLE faq_categories ALTER COLUMN updated_at SET DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE faq_categories ALTER COLUMN updated_at SET NOT NULL;

ALTER TABLE faqs ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE;
ALTER TABLE faqs ADD COLUMN IF NOT EXISTS is_deleted BOOLEAN DEFAULT FALSE;
ALTER TABLE faqs ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE faqs ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;

UPDATE faqs
SET is_active = COALESCE(is_active, TRUE),
    is_deleted = COALESCE(is_deleted, FALSE),
    created_at = COALESCE(created_at, CURRENT_TIMESTAMP),
    updated_at = COALESCE(updated_at, CURRENT_TIMESTAMP);

ALTER TABLE faqs ALTER COLUMN is_active SET DEFAULT TRUE;
ALTER TABLE faqs ALTER COLUMN is_active SET NOT NULL;
ALTER TABLE faqs ALTER COLUMN is_deleted SET DEFAULT FALSE;
ALTER TABLE faqs ALTER COLUMN is_deleted SET NOT NULL;
ALTER TABLE faqs ALTER COLUMN created_at SET DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE faqs ALTER COLUMN created_at SET NOT NULL;
ALTER TABLE faqs ALTER COLUMN updated_at SET DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE faqs ALTER COLUMN updated_at SET NOT NULL;

CREATE INDEX IF NOT EXISTS idx_media_created_at ON media(created_at);
CREATE INDEX IF NOT EXISTS idx_pages_created_at ON pages(created_at);
CREATE INDEX IF NOT EXISTS idx_page_sections_page_order ON page_sections(page_id, display_order);
CREATE INDEX IF NOT EXISTS idx_home_sections_display_order ON home_sections(display_order);
CREATE INDEX IF NOT EXISTS idx_banners_created_at ON banners(created_at);
CREATE INDEX IF NOT EXISTS idx_testimonials_created_at ON testimonials(created_at);
CREATE INDEX IF NOT EXISTS idx_lookbooks_created_at ON lookbooks(created_at);
CREATE INDEX IF NOT EXISTS idx_faq_categories_display_order ON faq_categories(display_order);
CREATE INDEX IF NOT EXISTS idx_faqs_display_order ON faqs(display_order);

COMMIT;

-- Pages content column (added for CMS page bodies)
ALTER TABLE pages ADD COLUMN IF NOT EXISTS content TEXT;

-- =====================================================
-- PORCIA MIGRATION: New modules
-- Run after porcia.sql
-- =====================================================

BEGIN;

-- COUPONS TABLE
CREATE TABLE IF NOT EXISTS coupons (
    id              BIGSERIAL PRIMARY KEY,
    code            VARCHAR(100) NOT NULL UNIQUE,
    discount_type   VARCHAR(50) NOT NULL,
    discount_value  DECIMAL(12,2) NOT NULL,
    min_order_amount DECIMAL(12,2),
    max_discount_amount DECIMAL(12,2),
    usage_limit     INTEGER,
    used_count      INTEGER DEFAULT 0,
    expires_at      TIMESTAMP,
    description     TEXT,
    is_active       BOOLEAN NOT NULL DEFAULT TRUE,
    is_deleted      BOOLEAN NOT NULL DEFAULT FALSE,
    created_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_coupons_code ON coupons(code);

-- REVIEWS TABLE
CREATE TABLE IF NOT EXISTS reviews (
    id          BIGSERIAL PRIMARY KEY,
    product_id  BIGINT NOT NULL,
    customer_id BIGINT NOT NULL,
    rating      INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
    comment     TEXT,
    status      VARCHAR(30) DEFAULT 'PENDING',
    is_active   BOOLEAN NOT NULL DEFAULT TRUE,
    is_deleted  BOOLEAN NOT NULL DEFAULT FALSE,
    created_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_review_product FOREIGN KEY(product_id) REFERENCES products(id),
    CONSTRAINT fk_review_customer FOREIGN KEY(customer_id) REFERENCES customers(id)
);

CREATE INDEX IF NOT EXISTS idx_reviews_product ON reviews(product_id);
CREATE INDEX IF NOT EXISTS idx_reviews_status ON reviews(status);

-- WISHLISTS TABLE
CREATE TABLE IF NOT EXISTS wishlists (
    id          BIGSERIAL PRIMARY KEY,
    customer_id BIGINT NOT NULL,
    product_id  BIGINT NOT NULL,
    is_active   BOOLEAN NOT NULL DEFAULT TRUE,
    is_deleted  BOOLEAN NOT NULL DEFAULT FALSE,
    created_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_wishlist_customer FOREIGN KEY(customer_id) REFERENCES customers(id),
    CONSTRAINT fk_wishlist_product FOREIGN KEY(product_id) REFERENCES products(id),
    CONSTRAINT uq_wishlist UNIQUE(customer_id, product_id)
);

CREATE INDEX IF NOT EXISTS idx_wishlists_customer ON wishlists(customer_id);

-- APP SETTINGS TABLE
CREATE TABLE IF NOT EXISTS app_settings (
    id              BIGSERIAL PRIMARY KEY,
    setting_key     VARCHAR(150) NOT NULL UNIQUE,
    setting_value   TEXT,
    setting_group   VARCHAR(100),
    is_sensitive    BOOLEAN DEFAULT FALSE,
    description     VARCHAR(255),
    is_active       BOOLEAN NOT NULL DEFAULT TRUE,
    is_deleted      BOOLEAN NOT NULL DEFAULT FALSE,
    created_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_settings_key ON app_settings(setting_key);
CREATE INDEX IF NOT EXISTS idx_settings_group ON app_settings(setting_group);

-- Seed default settings (Razorpay + Store)
INSERT INTO app_settings (setting_key, setting_value, setting_group, is_sensitive, description)
VALUES
    ('razorpay.key_id',       '',     'payment', FALSE, 'Razorpay Key ID (public)'),
    ('razorpay.key_secret',   '',     'payment', TRUE,  'Razorpay Key Secret (keep private)'),
    ('razorpay.webhook_secret','',    'payment', TRUE,  'Razorpay Webhook Secret'),
    ('razorpay.enabled',      'false','payment', FALSE, 'Enable Razorpay payments'),
    ('store.name',            'Porcia','general',FALSE, 'Store display name'),
    ('store.currency',        'EUR',  'general', FALSE, 'Default currency code'),
    ('store.support_email',   '',     'general', FALSE, 'Customer support email'),
    ('store.free_shipping_threshold','0','general',FALSE,'Free shipping above this amount (0 = disabled)'),
    ('smtp.host',             '',     'email',   FALSE, 'SMTP host'),
    ('smtp.port',             '587',  'email',   FALSE, 'SMTP port'),
    ('smtp.username',         '',     'email',   FALSE, 'SMTP username'),
    ('smtp.password',         '',     'email',   TRUE,  'SMTP password'),
    ('smtp.from_email',       '',     'email',   FALSE, 'From email address')
ON CONFLICT (setting_key) DO NOTHING;

-- Seed all roles used in @Secured annotations
INSERT INTO roles (name, description)
VALUES
    ('SUPER_ADMIN',      'Full system access'),
    ('ADMIN',            'General admin access'),
    ('ORDER_MANAGER',    'Manage orders and shipments'),
    ('PRODUCT_MANAGER',  'Manage products and inventory'),
    ('CONTENT_MANAGER',  'Manage CMS content and blogs')
ON CONFLICT (name) DO NOTHING;

COMMIT;


-- =====================================================
-- DEFAULT SUPER ADMIN USER
-- =====================================================
BEGIN;

INSERT INTO roles (id, name, created_by, updated_by, is_deleted, is_active, created_at, updated_at)
VALUES (1, 'ADMIN', NULL, NULL, FALSE, TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT (id) DO NOTHING;

INSERT INTO roles (id, name, created_by, updated_by, is_deleted, is_active, created_at, updated_at)
VALUES (2, 'SUPER_ADMIN', NULL, NULL, FALSE, TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT (id) DO NOTHING;

INSERT INTO admin_users (
    id, role_id, first_name, last_name, email, phone, password_hash,
    profile_image, last_login, is_locked, is_active, is_deleted, created_at, updated_at
)
VALUES (
    1, 2, 'Super', 'Admin', 'admin@porcia.com', '+919876543210',
    '$2a$10$3JZlrpRK.5iTgblq4g2AtuDzbTCsTiRrHLRHgO2LEap/kku2.V1Ve',
    NULL, NULL, FALSE, TRUE, FALSE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
)
ON CONFLICT (id) DO UPDATE SET password_hash = EXCLUDED.password_hash;

SELECT setval('roles_id_seq', GREATEST((SELECT MAX(id) FROM roles), 2), true);
SELECT setval('admin_users_id_seq', GREATEST((SELECT MAX(id) FROM admin_users), 1), true);

-- Seed a 'home' page row so admin-built extra sections
-- (GET /public/pages/home/sections) have a page to attach to.
INSERT INTO pages (
    id, title, slug, page_type, is_homepage, status,
    display_order, is_active, is_deleted, created_at, updated_at
)
VALUES (
    1, 'Home', 'home', 'HOME', TRUE, 'PUBLISHED',
    0, TRUE, FALSE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
)
ON CONFLICT (id) DO NOTHING;

SELECT setval('pages_id_seq', GREATEST((SELECT MAX(id) FROM pages), 1), true);

COMMIT;
