-- V5__seed_home_page.sql
-- Ensures a "Home" page row exists so the homepage shows up in the Pages
-- admin list and can have its own sections managed like any other page.

INSERT INTO pages (title, slug, page_type, is_homepage, status, display_order, is_active, is_deleted, created_at, updated_at)
SELECT 'Home', 'home', 'HOME', TRUE, 'PUBLISHED', 0, TRUE, FALSE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM pages WHERE slug = 'home');
