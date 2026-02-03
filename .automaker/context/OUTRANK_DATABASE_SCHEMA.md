# Outrank.so - Inferred Database Schema

**Based on API traffic analysis**

---

## Complete Schema Documentation

### 1. Organizations Table

```sql
CREATE TABLE organizations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Example ID: d20b6f8e-bfbc-4b4b-b665-bd7ce863392b
```

### 2. Products Table

```sql
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  website TEXT,
  description TEXT,
  status TEXT DEFAULT 'active', -- active, canceled, suspended
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Example ID: 01b7e908-19ae-4ba6-830f-6dc2dbc784e6
CREATE INDEX idx_products_organization ON products(organization_id);
CREATE INDEX idx_products_status ON products(status);
```

### 3. Scheduled Keywords Table

```sql
CREATE TABLE scheduled_keywords (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  keyword TEXT NOT NULL,
  utc_scheduled_date TIMESTAMP WITH TIME ZONE,
  search_volume INTEGER,
  difficulty INTEGER, -- 0-100 SEO difficulty score
  status TEXT DEFAULT 'pending', -- pending, generating, published, failed
  created_by_super_admin BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_scheduled_keywords_product ON scheduled_keywords(product_id);
CREATE INDEX idx_scheduled_keywords_date ON scheduled_keywords(utc_scheduled_date);
CREATE INDEX idx_scheduled_keywords_status ON scheduled_keywords(status);
```

### 4. Backlink Credits Table

```sql
CREATE TABLE backlink_credits (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  credit_balance INTEGER DEFAULT 0,
  total_purchased INTEGER DEFAULT 0,
  total_used INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(product_id)
);
```

### 5. Article Addon Subscriptions Table

```sql
CREATE TABLE article_addon_subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  stripe_subscription_id TEXT,
  status TEXT DEFAULT 'active', -- active, canceled, trialing, past_due, incomplete
  plan_id TEXT,
  articles_per_month INTEGER DEFAULT 0,
  current_usage INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_article_addons_product ON article_addon_subscriptions(product_id);
CREATE INDEX idx_article_addons_status ON article_addon_subscriptions(status);
```

### 6. SEO Tools Subscriptions Table

```sql
CREATE TABLE seo_tools_subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  stripe_subscription_id TEXT,
  status TEXT, -- active, trialing, past_due
  plan_type TEXT, -- basic, pro, enterprise
  features JSONB, -- Feature flags and limits
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_seo_subscriptions_org ON seo_tools_subscriptions(organization_id);
CREATE INDEX idx_seo_subscriptions_product ON seo_tools_subscriptions(product_id);
```

### 7. Output Settings Presets Table

```sql
CREATE TABLE output_settings_presets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  preset_config JSONB NOT NULL, -- Tone, style, length, etc.
  is_default BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_output_presets_product ON output_settings_presets(product_id);
```

### 8. Search Console Connections Table

```sql
CREATE TABLE search_console_connections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  site_url TEXT NOT NULL,
  access_token TEXT,
  refresh_token TEXT,
  token_expires_at TIMESTAMP WITH TIME ZONE,
  connection_status TEXT DEFAULT 'active', -- active, expired, error
  last_sync_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(product_id, site_url)
);

CREATE INDEX idx_search_console_product ON search_console_connections(product_id);
```

### 9. Articles Table (Inferred)

```sql
CREATE TABLE articles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  scheduled_keyword_id UUID REFERENCES scheduled_keywords(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  slug TEXT,
  content TEXT,
  status TEXT DEFAULT 'draft', -- draft, generating, reviewing, published, failed
  published_url TEXT,
  word_count INTEGER,
  seo_score INTEGER,
  generated_at TIMESTAMP WITH TIME ZONE,
  published_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_articles_product ON articles(product_id);
CREATE INDEX idx_articles_keyword ON articles(scheduled_keyword_id);
CREATE INDEX idx_articles_status ON articles(status);
CREATE INDEX idx_articles_published ON articles(published_at);
```

### 10. Backlinks Table (Inferred)

```sql
CREATE TABLE backlinks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  source_url TEXT NOT NULL,
  target_url TEXT NOT NULL,
  anchor_text TEXT,
  link_type TEXT, -- exchange, directory, manual
  status TEXT DEFAULT 'pending', -- pending, active, rejected, expired
  domain_authority INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  acquired_at TIMESTAMP WITH TIME ZONE,
  expires_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_backlinks_product ON backlinks(product_id);
CREATE INDEX idx_backlinks_status ON backlinks(status);
CREATE INDEX idx_backlinks_target ON backlinks(target_url);
```

### 11. Integrations Table (Inferred)

```sql
CREATE TABLE integrations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  integration_type TEXT NOT NULL, -- search_console, analytics, cms, etc.
  provider TEXT NOT NULL, -- google, wordpress, shopify, etc.
  config JSONB NOT NULL, -- Connection credentials and settings
  status TEXT DEFAULT 'active', -- active, inactive, error
  last_sync_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_integrations_product ON integrations(product_id);
CREATE INDEX idx_integrations_type ON integrations(integration_type);
```

### 12. Invoices Table (Inferred)

```sql
CREATE TABLE invoices (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  stripe_invoice_id TEXT UNIQUE,
  amount_due INTEGER, -- in cents
  amount_paid INTEGER,
  currency TEXT DEFAULT 'usd',
  status TEXT, -- draft, open, paid, void, uncollectible
  due_date TIMESTAMP WITH TIME ZONE,
  paid_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_invoices_org ON invoices(organization_id);
CREATE INDEX idx_invoices_product ON invoices(product_id);
CREATE INDEX idx_invoices_status ON invoices(status);
```

### 13. Users Table (Supabase Auth)

```sql
-- This is managed by Supabase Auth
-- auth.users schema (provided by Supabase):
CREATE TYPE auth.uid AS UUID;
CREATE TABLE auth.users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT,
  encrypted_password TEXT,
  email_confirmed_at TIMESTAMP WITH TIME ZONE,
  invited_at TIMESTAMP WITH TIME ZONE,
  confirmation_token TEXT,
  recovery_token TEXT,
  email_change_token_new TEXT,
  email_change_token_current TEXT,
  last_sign_in_at TIMESTAMP WITH TIME ZONE,
  raw_app_meta_data JSONB,
  raw_user_meta_data JSONB,
  is_super_admin BOOLEAN,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Custom user profiles (public schema)
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  organization_id UUID REFERENCES organizations(id),
  full_name TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'member', -- owner, admin, member, viewer
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_profiles_org ON profiles(organization_id);
CREATE INDEX idx_profiles_role ON profiles(role);
```

---

## Row Level Security (RLS) Policies

### Enable RLS

```sql
ALTER TABLE scheduled_keywords ENABLE ROW LEVEL SECURITY;
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE backlinks ENABLE ROW LEVEL SECURITY;
-- ... enable on all tables
```

### Example RLS Policies

```sql
-- Users can only access their organization's data
CREATE POLICY "Users can view own organization keywords"
ON scheduled_keywords
FOR SELECT
USING (
  product_id IN (
    SELECT id FROM products
    WHERE organization_id IN (
      SELECT organization_id FROM profiles
      WHERE id = auth.uid()
    )
  )
);

-- Service role can do anything
CREATE POLICY "Service role has full access"
ON scheduled_keywords
TO SERVICE_ROLE
USING (true);
```

---

## Relationships Diagram (ERD)

```
┌─────────────────────┐
│   organizations     │
│  - id (PK)          │
│  - name             │
│  - slug             │
└──────────┬──────────┘
           │ 1
           │
           │ N
┌──────────┴──────────┐     ┌──────────────────────┐
│      products       │     │      profiles        │
│  - id (PK)          │────>│  - id (PK)           │
│  - organization_id  │     │  - organization_id   │
│  - name             │     │  - user_id           │
│  - website          │     │  - role              │
└──────────┬──────────┘     └──────────────────────┘
           │
           ├──────────────────────────────────────┐
           │                                      │
           │ N                                    │ N
┌──────────┴──────────┐              ┌────────────┴─────────────┐
│  scheduled_keywords │              │ seo_tools_subscriptions  │
│  - id (PK)          │              │  - id (PK)               │
│  - product_id       │              │  - organization_id       │
│  - keyword          │              │  - product_id            │
│  - search_volume    │              │  - status                │
│  - difficulty       │              └──────────────────────────┘
└──────────┬──────────┘
           │ 1
           │
           │ N
┌──────────┴──────────┐
│      articles       │
│  - id (PK)          │
│  - keyword_id       │
│  - title            │
│  - content          │
│  - status           │
└─────────────────────┘

Other relationships:
products 1─N backlink_credits
products 1─N article_addon_subscriptions
products 1─N output_settings_presets
products 1─N search_console_connections
products 1─N integrations
products 1─N backlinks
organizations 1─N invoices
```

---

## Data Access Patterns

### 1. Organization Scoped Queries

```sql
-- Get all products for user's organization
SELECT * FROM products
WHERE organization_id IN (
  SELECT organization_id FROM profiles
  WHERE id = auth.uid()
);
```

### 2. Product Scoped Queries

```sql
-- Get scheduled keywords for product
SELECT * FROM scheduled_keywords
WHERE product_id = $1
ORDER BY utc_scheduled_date ASC;
```

### 3. Multi-Table Joins

```sql
-- Get keywords with article status
SELECT
  sk.keyword,
  sk.search_volume,
  sk.difficulty,
  a.status as article_status,
  a.title as article_title
FROM scheduled_keywords sk
LEFT JOIN articles a ON a.scheduled_keyword_id = sk.id
WHERE sk.product_id = $1;
```

---

## Indexing Strategy

### High-Read Tables

```sql
-- Scheduled keywords (frequently queried for dashboard)
CREATE INDEX idx_sk_product_date ON scheduled_keywords(product_id, utc_scheduled_date);
CREATE INDEX idx_sk_status ON scheduled_keywords(status) WHERE status != 'published';

-- Articles (dashboard and listing)
CREATE INDEX idx_articles_product_status ON articles(product_id, status);
CREATE INDEX idx_articles_published_date ON articles(published_at DESC);

-- Backlinks (exchange and monitoring)
CREATE INDEX idx_backlinks_product_status ON backlinks(product_id, status);
```

### Composite Indexes

```sql
-- Complex filtering
CREATE INDEX idx_sk_product_status_date ON scheduled_keywords(product_id, status, utc_scheduled_date);
CREATE INDEX idx_articles_product_published ON articles(product_id, published_at DESC) WHERE status = 'published';
```

---

## Performance Considerations

### 1. Query Optimization

- Use `EXPLAIN ANALYZE` on slow queries
- Add indexes for foreign keys
- Use `SELECT` with specific columns vs `SELECT *`
- Implement pagination with `limit` and `offset`

### 2. Data Archiving

```sql
-- Archive old published articles
CREATE TABLE articles_archive AS
SELECT * FROM articles
WHERE status = 'published'
AND published_at < NOW() - INTERVAL '1 year';

-- Delete archived data from main table
DELETE FROM articles
WHERE id IN (SELECT id FROM articles_archive);
```

### 3. Connection Pooling

- Supabase provides PgBouncer
- Use transaction mode for multi-statement transactions
- Use statement mode for individual queries

---

## Migration Strategy

### Initial Setup

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create custom types
CREATE TYPE user_role AS ENUM ('owner', 'admin', 'member', 'viewer');
CREATE TYPE article_status AS ENUM ('draft', 'generating', 'reviewing', 'published', 'failed');
CREATE TYPE backlink_status AS ENUM ('pending', 'active', 'rejected', 'expired');
CREATE TYPE subscription_status AS ENUM ('active', 'trialing', 'past_due', 'canceled', 'incomplete');

-- Create functions for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';
```

### Triggers

```sql
-- Auto-update updated_at
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_keywords_updated_at BEFORE UPDATE ON scheduled_keywords
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

---

## Backup & Recovery

### Supabase Features

- Daily automated backups (retention: 30 days)
- Point-in-time recovery (PITR)
- Database replication (read replicas)

### Custom Backup Strategy

```sql
-- Export schema
pg_dump --schema-only --no-owner --no-privileges

-- Export data
pg_dump --data-only --no-owner --no-privileges

-- Export specific tables
pg_dump -t scheduled_keywords -t articles
```

---

**End of Database Schema Documentation**
