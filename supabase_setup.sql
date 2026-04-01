-- Run this in Supabase SQL Editor to create the products table

CREATE TABLE IF NOT EXISTS products (
  id BIGSERIAL PRIMARY KEY,
  asin TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  price DECIMAL(10,2),
  price_display TEXT,
  rating DECIMAL(3,2),
  num_reviews INTEGER DEFAULT 0,
  image TEXT,
  affiliate_link TEXT NOT NULL,
  category TEXT NOT NULL,
  rank INTEGER,
  features TEXT[],
  description TEXT,
  video_url TEXT,
  added_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (allow public read, authenticated write)
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read products (public landing page)
CREATE POLICY "Public read" ON products FOR SELECT USING (true);

-- Allow service role to insert/update (our API)
CREATE POLICY "Service insert" ON products FOR INSERT WITH CHECK (true);
CREATE POLICY "Service update" ON products FOR UPDATE USING (true);

-- Seed with sample data (optional, delete if you want to start empty)
INSERT INTO products (asin, title, price, price_display, rating, num_reviews, image, affiliate_link, category, rank)
VALUES 
  ('B09B8V1LZ3', 'Echo Dot (5th Gen) - Smart Speaker with Alexa', 27.99, '$27.99', 4.7, 384521, 'https://m.media-amazon.com/images/I/518cRYanpbL._AC_SL1000_.jpg', 'https://www.amazon.com/dp/B09B8V1LZ3?tag=bluediamon09a-20', 'electronics', 1),
  ('B0C5KNH2KG', 'Stanley Quencher H2.0 FlowState Tumbler 40 oz', 35.00, '$35.00', 4.6, 96234, 'https://m.media-amazon.com/images/I/71GOLS9pJEL._AC_SL1500_.jpg', 'https://www.amazon.com/dp/B0C5KNH2KG?tag=bluediamon09a-20', 'home', 2),
  ('B0CXKYTPFC', 'Ring Indoor Cam (2nd Gen) - 1080p HD Security Camera', 29.99, '$29.99', 4.4, 15623, 'https://m.media-amazon.com/images/I/51TjJOTfslL._AC_SL1000_.jpg', 'https://www.amazon.com/dp/B0CXKYTPFC?tag=bluediamon09a-20', 'electronics', 3)
ON CONFLICT (asin) DO NOTHING;
