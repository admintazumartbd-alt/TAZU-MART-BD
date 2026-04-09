-- Supabase Schema for Tazu Mart BD

-- 1. Users Table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  name TEXT,
  email TEXT,
  phone TEXT,
  address TEXT,
  image TEXT,
  role TEXT DEFAULT 'CUSTOMER',
  loginMethod TEXT,
  createdAt TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  lastLogin TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status TEXT DEFAULT 'ACTIVE'
);

-- 2. Categories Table
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  nameBn TEXT,
  image TEXT,
  banner TEXT,
  slug TEXT UNIQUE NOT NULL,
  subcategories JSONB DEFAULT '[]'::jsonb,
  "order" INTEGER DEFAULT 0,
  status TEXT DEFAULT 'ACTIVE',
  updatedAt TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Products Table
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  nameBn TEXT,
  price NUMERIC NOT NULL,
  oldPrice NUMERIC,
  buyingPrice NUMERIC,
  discount NUMERIC,
  image TEXT,
  images TEXT[] DEFAULT '{}',
  category TEXT,
  subcategories TEXT[] DEFAULT '{}',
  brand TEXT,
  seoDescription TEXT,
  description TEXT,
  weightVolume TEXT,
  colors JSONB DEFAULT '[]'::jsonb,
  status TEXT DEFAULT 'ACTIVE',
  condition TEXT DEFAULT 'New',
  videoLink TEXT,
  sku TEXT,
  stock INTEGER DEFAULT 0,
  unitName TEXT DEFAULT 'pcs',
  stockAlert INTEGER DEFAULT 5,
  specifications JSONB DEFAULT '{}'::jsonb,
  rating NUMERIC DEFAULT 0,
  reviews INTEGER DEFAULT 0,
  soldCount INTEGER DEFAULT 0,
  isNewArrival BOOLEAN DEFAULT false,
  isBestSelling BOOLEAN DEFAULT false,
  isOfferProduct BOOLEAN DEFAULT false,
  isNew BOOLEAN DEFAULT true,
  isBestSeller BOOLEAN DEFAULT false,
  show_in_home BOOLEAN DEFAULT true,
  is_featured BOOLEAN DEFAULT false,
  is_deleted BOOLEAN DEFAULT false,
  deletedAt TIMESTAMP WITH TIME ZONE,
  createdAt TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updatedAt TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  deliveryCharges JSONB DEFAULT '{"dhaka": 60, "others": 120}'::jsonb,
  titleSize TEXT,
  titleWeight TEXT,
  descriptionSize TEXT,
  descriptionWeight TEXT
);

-- 4. Menus Table
CREATE TABLE IF NOT EXISTS menus (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  status TEXT DEFAULT 'ACTIVE',
  "order" INTEGER DEFAULT 0,
  icon TEXT
);

-- 5. Settings Table
CREATE TABLE IF NOT EXISTS settings (
  id TEXT PRIMARY KEY,
  data JSONB DEFAULT '{}'::jsonb,
  updatedAt TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Orders Table
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  orderNumber TEXT UNIQUE NOT NULL,
  userId UUID REFERENCES auth.users(id),
  customer JSONB NOT NULL,
  items JSONB NOT NULL,
  subtotal NUMERIC NOT NULL,
  deliveryFee NUMERIC NOT NULL,
  total NUMERIC NOT NULL,
  profit NUMERIC,
  status TEXT DEFAULT 'PENDING',
  paymentMethod TEXT DEFAULT 'COD',
  paymentStatus TEXT DEFAULT 'PENDING',
  courierName TEXT,
  trackingId TEXT,
  courierStatus TEXT,
  parcelLocation TEXT,
  currentHub TEXT,
  estimatedDelivery TEXT,
  deviceIp TEXT,
  userAgent TEXT,
  createdAt TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updatedAt TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. Activities Table
CREATE TABLE IF NOT EXISTS activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  userId UUID REFERENCES auth.users(id),
  userName TEXT,
  type TEXT NOT NULL,
  method TEXT,
  deviceType TEXT,
  ipAddress TEXT,
  location TEXT,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. Abandoned Carts Table
CREATE TABLE IF NOT EXISTS abandoned_carts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  userId UUID REFERENCES auth.users(id),
  customerName TEXT,
  phone TEXT,
  email TEXT,
  items JSONB NOT NULL,
  total NUMERIC NOT NULL,
  cartTime TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  reminderSent BOOLEAN DEFAULT false,
  reminderCount INTEGER DEFAULT 0,
  status TEXT DEFAULT 'ABANDONED'
);

-- 9. Customers Table
CREATE TABLE IF NOT EXISTS customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT UNIQUE NOT NULL,
  address TEXT,
  profileImage TEXT,
  totalOrders INTEGER DEFAULT 0,
  totalSpending NUMERIC DEFAULT 0,
  cancelledOrders INTEGER DEFAULT 0,
  returnedOrders INTEGER DEFAULT 0,
  pendingOrders INTEGER DEFAULT 0,
  deliveredOrders INTEGER DEFAULT 0,
  orderHistory TEXT[] DEFAULT '{}',
  loginLogs JSONB DEFAULT '[]'::jsonb,
  fraudScore INTEGER DEFAULT 0,
  createdAt TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  lastLogin TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 10. Hosting Table
CREATE TABLE IF NOT EXISTS hosting (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  userId UUID REFERENCES auth.users(id),
  isCustom BOOLEAN DEFAULT false,
  hostingType TEXT DEFAULT 'FREE',
  planName TEXT,
  providerName TEXT,
  serverIp TEXT,
  port TEXT,
  rootDirectory TEXT,
  cpanelUrl TEXT,
  cpanelUser TEXT,
  cpanelPass TEXT,
  ftpHost TEXT,
  ftpUser TEXT,
  ftpPass TEXT,
  dbHost TEXT,
  dbName TEXT,
  dbUser TEXT,
  dbPass TEXT,
  sslStatus BOOLEAN DEFAULT false,
  storageLimit INTEGER DEFAULT 100,
  bandwidthLimit TEXT DEFAULT 'LIMITED',
  subdomain TEXT,
  status TEXT DEFAULT 'PENDING',
  createdAt TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 11. Domains Table
CREATE TABLE IF NOT EXISTS domains (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  userId UUID REFERENCES auth.users(id),
  domainName TEXT UNIQUE NOT NULL,
  subdomain TEXT,
  dnsType TEXT,
  nameserver1 TEXT,
  nameserver2 TEXT,
  aRecordIp TEXT,
  cname TEXT,
  ttl TEXT,
  redirectDomain TEXT,
  forceHttps BOOLEAN DEFAULT true,
  txtRecord TEXT,
  mxRecord TEXT,
  status TEXT DEFAULT 'PENDING',
  createdAt TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 12. Upgrades Table
CREATE TABLE IF NOT EXISTS upgrades (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  userId UUID REFERENCES auth.users(id),
  plan TEXT NOT NULL,
  paymentStatus TEXT DEFAULT 'PENDING',
  amount NUMERIC NOT NULL,
  expiryDate TIMESTAMP WITH TIME ZONE,
  createdAt TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 13. Domain Hosting Map Table
CREATE TABLE IF NOT EXISTS domain_hosting_map (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  domainId UUID REFERENCES domains(id),
  hostingId UUID REFERENCES hosting(id),
  linked TEXT DEFAULT 'NO'
);

-- 14. Pages Table
CREATE TABLE IF NOT EXISTS pages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  content TEXT,
  bannerImage TEXT,
  seoTitle TEXT,
  metaDescription TEXT,
  status TEXT DEFAULT 'DRAFT',
  createdAt TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 15. Offers Table
CREATE TABLE IF NOT EXISTS offers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  type TEXT NOT NULL,
  couponCode TEXT,
  expiryDate TIMESTAMP WITH TIME ZONE,
  bannerImage TEXT,
  status TEXT DEFAULT 'DRAFT'
);

-- Enable RLS and basic policies
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE menus ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- 1. Products Policies
CREATE POLICY "Allow public read access on products" ON products FOR SELECT USING (status = 'ACTIVE' AND is_deleted = false);
CREATE POLICY "Allow admin all access on products" ON products FOR ALL USING (
  EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role = 'ADMIN')
);

-- 2. Categories Policies
CREATE POLICY "Allow public read access on categories" ON categories FOR SELECT USING (status = 'ACTIVE');
CREATE POLICY "Allow admin all access on categories" ON categories FOR ALL USING (
  EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role = 'ADMIN')
);

-- 3. Menus Policies
CREATE POLICY "Allow public read access on menus" ON menus FOR SELECT USING (status = 'ACTIVE');
CREATE POLICY "Allow admin all access on menus" ON menus FOR ALL USING (
  EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role = 'ADMIN')
);

-- 4. Settings Policies
CREATE POLICY "Allow public read access on settings" ON settings FOR SELECT USING (true);
CREATE POLICY "Allow admin all access on settings" ON settings FOR ALL USING (
  EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role = 'ADMIN')
);

-- 5. Orders Policies
CREATE POLICY "Allow users to read their own orders" ON orders FOR SELECT USING (userId = auth.uid());
CREATE POLICY "Allow users to create their own orders" ON orders FOR INSERT WITH CHECK (true); -- Allow guest checkout
CREATE POLICY "Allow admin all access on orders" ON orders FOR ALL USING (
  EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role = 'ADMIN')
);

-- 6. Users Policies
CREATE POLICY "Allow users to read their own profile" ON users FOR SELECT USING (id = auth.uid());
CREATE POLICY "Allow users to update their own profile" ON users FOR UPDATE USING (id = auth.uid());
CREATE POLICY "Allow admin all access on users" ON users FOR ALL USING (
  EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role = 'ADMIN')
);
