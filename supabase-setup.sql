-- ============================================================
-- House of Fashion — Supabase Backend Setup
-- Run this in the Supabase SQL Editor (Dashboard > SQL Editor)
-- ============================================================

-- ──────────────────────────────────────────────────────────────
-- 0. EXTENSIONS
-- ──────────────────────────────────────────────────────────────
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ──────────────────────────────────────────────────────────────
-- 1. CATEGORIES
-- ──────────────────────────────────────────────────────────────
CREATE TABLE categories (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug          TEXT UNIQUE NOT NULL,
  name          TEXT NOT NULL,
  tagline       TEXT NOT NULL DEFAULT '',
  emoji         TEXT NOT NULL DEFAULT '📦',
  image_folder  TEXT NOT NULL,
  image_count   INT NOT NULL DEFAULT 15,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ──────────────────────────────────────────────────────────────
-- 2. PRODUCTS
-- ──────────────────────────────────────────────────────────────
CREATE TABLE products (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug          TEXT UNIQUE NOT NULL,
  name          TEXT NOT NULL,
  category_slug TEXT NOT NULL REFERENCES categories(slug) ON DELETE CASCADE,
  niche         TEXT NOT NULL,
  description   TEXT NOT NULL DEFAULT '',
  bullets       JSONB NOT NULL DEFAULT '[]',
  images        JSONB NOT NULL DEFAULT '[]',
  tiers         JSONB NOT NULL DEFAULT '[]',
  moq           INT NOT NULL DEFAULT 1,
  variants      JSONB NOT NULL DEFAULT '[]',
  rating        NUMERIC(3,1) NOT NULL DEFAULT 4.0,
  review_count  INT NOT NULL DEFAULT 0,
  stock         INT NOT NULL DEFAULT 0,
  is_new        BOOLEAN NOT NULL DEFAULT false,
  is_bestseller BOOLEAN NOT NULL DEFAULT false,
  tags          JSONB NOT NULL DEFAULT '[]',
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_products_category ON products(category_slug);
CREATE INDEX idx_products_slug     ON products(slug);

-- ──────────────────────────────────────────────────────────────
-- 3. ORDERS
-- ──────────────────────────────────────────────────────────────
CREATE TYPE order_status AS ENUM (
  'pending',
  'accepted',
  'shipped',
  'declined',
  'payment_received',
  'delivered',
  'closed'
);

CREATE TYPE payment_method AS ENUM ('easypaisa', 'cod');

CREATE TABLE orders (
  id              TEXT PRIMARY KEY,
  customer_name   TEXT NOT NULL,
  customer_phone  TEXT NOT NULL,
  customer_email  TEXT NOT NULL,
  payment_method  payment_method NOT NULL DEFAULT 'cod',
  receipt_url     TEXT,
  items           JSONB NOT NULL DEFAULT '[]',
  total           INT NOT NULL DEFAULT 0,
  shipping        INT NOT NULL DEFAULT 0,
  grand_total     INT NOT NULL DEFAULT 0,
  status          order_status NOT NULL DEFAULT 'pending',
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_orders_status    ON orders(status);
CREATE INDEX idx_orders_created   ON orders(created_at DESC);
CREATE INDEX idx_orders_customer  ON orders(customer_name);

-- ──────────────────────────────────────────────────────────────
-- 4. ANALYTICS — PAGE VIEWS
-- ──────────────────────────────────────────────────────────────
CREATE TABLE analytics_page_views (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  path        TEXT NOT NULL,
  visitor_id  TEXT NOT NULL,
  region      TEXT,
  city        TEXT,
  device      TEXT NOT NULL DEFAULT 'unknown',
  browser     TEXT NOT NULL DEFAULT 'unknown',
  viewed_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_analytics_path     ON analytics_page_views(path);
CREATE INDEX idx_analytics_visitor  ON analytics_page_views(visitor_id);
CREATE INDEX idx_analytics_date     ON analytics_page_views(viewed_at DESC);

-- ──────────────────────────────────────────────────────────────
-- 5. CONTACT MESSAGES
-- ──────────────────────────────────────────────────────────────
CREATE TABLE contact_messages (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name        TEXT NOT NULL,
  email       TEXT NOT NULL,
  subject     TEXT,
  message     TEXT NOT NULL,
  is_read     BOOLEAN NOT NULL DEFAULT false,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ──────────────────────────────────────────────────────────────
-- 6. USER WISHLIST (per authenticated user)
-- ──────────────────────────────────────────────────────────────
CREATE TABLE wishlist_items (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  product_slug TEXT NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, product_slug)
);

CREATE INDEX idx_wishlist_user ON wishlist_items(user_id);

-- ──────────────────────────────────────────────────────────────
-- 7. RECENTLY VIEWED (per authenticated user)
-- ──────────────────────────────────────────────────────────────
CREATE TABLE recently_viewed (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id       UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  product_slug  TEXT NOT NULL,
  viewed_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, product_slug)
);

CREATE INDEX idx_recently_viewed_user ON recently_viewed(user_id, viewed_at DESC);

-- ──────────────────────────────────────────────────────────────
-- 8. CART ITEMS (per authenticated user)
-- ──────────────────────────────────────────────────────────────
CREATE TABLE cart_items (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id       UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  product_slug  TEXT NOT NULL,
  variant_key   TEXT NOT NULL,
  variant_label TEXT NOT NULL DEFAULT '',
  qty           INT NOT NULL DEFAULT 1,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, product_slug, variant_key)
);

CREATE INDEX idx_cart_user ON cart_items(user_id);

-- ──────────────────────────────────────────────────────────────
-- 9. ADMIN USERS (profiles table linked to auth.users)
-- ──────────────────────────────────────────────────────────────
CREATE TABLE profiles (
  id          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name   TEXT,
  role        TEXT NOT NULL DEFAULT 'customer' CHECK (role IN ('admin', 'customer')),
  phone       TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ──────────────────────────────────────────────────────────────
-- 10. UPDATED_AT TRIGGER
-- ──────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_categories_updated
  BEFORE UPDATE ON categories
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_products_updated
  BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_orders_updated
  BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_cart_updated
  BEFORE UPDATE ON cart_items
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ──────────────────────────────────────────────────────────────
-- 11. ROW LEVEL SECURITY (RLS)
-- ──────────────────────────────────────────────────────────────

-- Categories & Products: public read, admin write
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products   ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Categories are viewable by everyone"
  ON categories FOR SELECT USING (true);

CREATE POLICY "Only admins can insert categories"
  ON categories FOR INSERT
  WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Only admins can update categories"
  ON categories FOR UPDATE
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Only admins can delete categories"
  ON categories FOR DELETE
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Products are viewable by everyone"
  ON products FOR SELECT USING (true);

CREATE POLICY "Only admins can insert products"
  ON products FOR INSERT
  WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Only admins can update products"
  ON products FOR UPDATE
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Only admins can delete products"
  ON products FOR DELETE
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Orders: admins see all, customers see own
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view all orders"
  ON orders FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Anyone can insert orders (checkout)"
  ON orders FOR INSERT WITH CHECK (true);

CREATE POLICY "Only admins can update orders"
  ON orders FOR UPDATE
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Analytics: public insert (tracking), admin read
ALTER TABLE analytics_page_views ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can track page views"
  ON analytics_page_views FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can read analytics"
  ON analytics_page_views FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Contact messages: anyone can send, admin reads
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit contact form"
  ON contact_messages FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can read contact messages"
  ON contact_messages FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Admins can update contact messages"
  ON contact_messages FOR UPDATE
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Wishlist: users manage their own
ALTER TABLE wishlist_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own wishlist"
  ON wishlist_items FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can add to own wishlist"
  ON wishlist_items FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can remove from own wishlist"
  ON wishlist_items FOR DELETE USING (auth.uid() = user_id);

-- Recently viewed: users manage their own
ALTER TABLE recently_viewed ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own recently viewed"
  ON recently_viewed FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can add recently viewed"
  ON recently_viewed FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own recently viewed"
  ON recently_viewed FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own recently viewed"
  ON recently_viewed FOR DELETE USING (auth.uid() = user_id);

-- Cart: users manage their own
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own cart"
  ON cart_items FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can add to own cart"
  ON cart_items FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own cart"
  ON cart_items FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete from own cart"
  ON cart_items FOR DELETE USING (auth.uid() = user_id);

-- Profiles: users see own, admins see all
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles"
  ON profiles FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- ──────────────────────────────────────────────────────────────
-- 12. AUTO-CREATE PROFILE ON SIGNUP
-- ──────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, full_name, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', ''),
    'customer'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ──────────────────────────────────────────────────────────────
-- 13. SEED: CATEGORIES (19 categories from the app)
-- ──────────────────────────────────────────────────────────────
INSERT INTO categories (slug, name, tagline, emoji, image_folder, image_count) VALUES
  ('perfumes',               'Perfumes & Fragrances',          'Scents that linger in the memory',                          '🌸', 'perfumes',               15),
  ('cushions',               'Cushions & Throw Pillows',       'Sink into softness',                                        '🛋️', 'cushions',               15),
  ('handbags',               'Handbags & Purses',              'Carry it with attitude',                                    '👜', 'handbags',               15),
  ('jewelry',                'Jewelry & Statement Pieces',     'Shine on your own terms',                                   '💎', 'jewelry',                15),
  ('sunglasses',             'Sunglasses & Eyewear',           'See the world in style',                                    '🕶️', 'sunglasses',             15),
  ('scarves',                'Scarves & Wraps',                'Drape yourself in luxury',                                  '🧣', 'scarves',                15),
  ('wallets',                'Wallets & Clutches',             'Small, sleek, essential',                                   '👛', 'wallets',                15),
  ('hair-accessories',       'Hair Accessories',               'Details that turn heads',                                   '🎀', 'hair-accessories',       15),
  ('watches',                'Watches & Wristwear',            'Time, worn beautifully',                                    '⌚', 'watches',                15),
  ('candles',                'Scented Candles',                'Set the mood, one flicker at a time',                       '🕯️', 'candles',                15),
  ('vases',                  'Decorative Vases',               'Sculptural pieces for every room',                          '🏺', 'vases',                  15),
  ('belts',                  'Belts',                          'Cinch it, finish the look',                                 '👗', 'belts',                  15),
  ('mens-shalwar-kameez',    'Men''s Shalwar Kameez',          'Classic stitched menswear, ready to wear',                  '🧵', 'mens-shalwar-kameez',    22),
  ('womens-lawn-suits',      'Women''s Lawn & Unstitched Suits','Unstitched 3-piece fabric, tailor it your way',             '🧶', 'womens-lawn-suits',      30),
  ('kids-traditional-wear',  'Kids'' Traditional Wear',        'Mini shalwar kameez and frocks, festival-ready',            '🧒', 'kids-traditional-wear',  29),
  ('kitchen-storage',        'Kitchen & Storage',              'Tidy jars, boxes and everyday kitchen finds',               '🥡', 'kitchen-storage',        15),
  ('stationery-desk',        'Stationery & Desk',              'Cute desk clutter you''ll actually use',                    '✏️', 'stationery-desk',        15),
  ('bathroom-accessories',   'Bathroom & Home Finds',          'Small household upgrades, Miniso-style',                    '🧴', 'bathroom-accessories',   15),
  ('bedsheets',              'Bedsheets & Bedding',            'Soft sets for a better night''s sleep',                     '🛏️', 'bedsheets',              15)
ON CONFLICT (slug) DO NOTHING;

-- ──────────────────────────────────────────────────────────────
-- 14. SEED: ADMIN USER
-- Register through Supabase Auth UI or API first, then run:
-- UPDATE profiles SET role = 'admin' WHERE id = '<the-user-uuid>';
-- ──────────────────────────────────────────────────────────────

-- ──────────────────────────────────────────────────────────────
-- 15. HELPFUL VIEWS
-- ──────────────────────────────────────────────────────────────

-- Quick analytics summary view
CREATE OR REPLACE VIEW analytics_summary AS
SELECT
  date_trunc('day', viewed_at)::DATE AS day,
  path,
  COUNT(*)                            AS views,
  COUNT(DISTINCT visitor_id)          AS unique_visitors
FROM analytics_page_views
WHERE viewed_at >= now() - INTERVAL '90 days'
GROUP BY 1, 2
ORDER BY 1 DESC, 3 DESC;

-- Products with their category name
CREATE OR REPLACE VIEW products_with_category AS
SELECT
  p.*,
  c.name  AS category_name,
  c.emoji AS category_emoji
FROM products p
JOIN categories c ON c.slug = p.category_slug;

-- Order stats
CREATE OR REPLACE VIEW order_stats AS
SELECT
  status,
  COUNT(*)                  AS order_count,
  SUM(grand_total)::BIGINT  AS total_revenue
FROM orders
GROUP BY status;

-- ──────────────────────────────────────────────────────────────
-- DONE ✅
-- ──────────────────────────────────────────────────────────────
-- Next steps:
-- 1. Register an admin account via Supabase Auth (Email + Password)
-- 2. Run: UPDATE profiles SET role = 'admin' WHERE id = '<admin-uuid>';
-- 3. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local
-- 4. Optionally run the "Generate Seed Products" function below
-- ──────────────────────────────────────────────────────────────
