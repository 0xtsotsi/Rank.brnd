# Outrank.so - Architecture Diagrams

**Visual documentation of system architecture and data flow**

---

## 1. High-Level System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        USER BROWSER                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐        │
│  │   React 18+  │  │  Supabase    │  │  Analytics   │        │
│  │   Components │  │    Client    │  │    SDKs      │        │
│  │              │  │              │  │              │        │
│  │ - Server     │  │ - Auth       │  │ - PostHog    │        │
│  │ - Client     │  │ - Database   │  │ - Mixpanel   │        │
│  │ - Shared     │  │ - Storage    │  │ - GA4        │        │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘        │
│         │                  │                  │                 │
│         └──────────────────┴──────────────────┘                 │
│                            │                                    │
└────────────────────────────┼────────────────────────────────────┘
                             │ HTTPS
                             │
┌────────────────────────────┴────────────────────────────────────┐
│                    NEXT.JS SERVER LAYER                          │
│  ┌────────────────────────────────────────────────────────┐    │
│  │             Vercel Edge Network (CDN)                   │    │
│  │  - Global distribution                                 │    │
│  │  - Edge functions                                      │    │
│  │  - Static asset caching                                │    │
│  └────────────────────────────────────────────────────────┘    │
│                             │                                    │
│  ┌────────────────────────────────────────────────────────┐    │
│  │         Next.js App Router (Server-Side)               │    │
│  │                                                          │    │
│  │  ┌──────────────┐  ┌──────────────┐  ┌─────────────┐  │    │
│  │  │ Route Handlers│  │   RSC Pages  │  │ Middleware  │  │    │
│  │  │              │  │              │  │             │  │    │
│  │  │ /api/*       │  │ /dashboard/* │  │ Auth guard  │  │    │
│  │  │              │  │              │  │ RLS check   │  │    │
│  │  └──────┬───────┘  └──────┬───────┘  └──────┬──────┘  │    │
│  │         │                  │                  │          │    │
│  └─────────┼──────────────────┼──────────────────┼──────────┘    │
│            │                  │                  │                │
└────────────┼──────────────────┼──────────────────┼────────────────┘
             │                  │                  │
             │                  │                  │
┌────────────┴──────────────────┴──────────────────┴────────────┐
│                    SUPABASE CLOUD PLATFORM                     │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              API GATEWAY / PostgREST                  │   │
│  │  - Auto-generated REST API                           │   │
│  │  - JWT validation                                    │   │
│  │  - Request routing                                   │   │
│  └────────┬────────┬────────┬────────┬────────┬────────┘   │
│           │        │        │        │        │              │
│  ┌────────┴──┐ ┌───┴──┐ ┌───┴──┐ ┌───┴──┐ ┌───┴──────┐    │
│  │   Auth    │ │  DB  │ │Storage│ │Realtime│ │  Edge    │    │
│  │ Service   │ │      │ │       │ │        │ │Functions  │    │
│  │           │ │      │ │       │ │        │ │          │    │
│  │ - JWT     │ │PostgreSQL│ │Files │ │Webhooks│ │  Logic  │    │
│  │ - OAuth   │ │       │ │       │ │        │ │          │    │
│  │ - RLS     │ │       │ │       │ │        │ │          │    │
│  └───────────┘ └──────┘ └───────┘ └────────┘ └──────────┘    │
│         │            │                                 │        │
│         └────────────┴─────────────────────────────────┘        │
│                        │                                        │
│  ┌─────────────────────┴─────────────────────────────────┐    │
│  │              POSTGRESQL DATABASE (AWS)                │    │
│  │                                                        │    │
│  │  ┌────────────┐  ┌────────────┐  ┌────────────┐      │    │
│  │  │  public    │  │   auth     │  │  storage   │      │    │
│  │  │  schema    │  │  schema    │  │  schema    │      │    │
│  │  │            │  │            │  │            │      │    │
│  │  │ - products │  │ - users    │  │ - files    │      │    │
│  │  │ - keywords │  │ - sessions │  │ - buckets  │      │    │
│  │  │ - articles │  │ - refresh  │  │            │      │    │
│  │  │ - backlinks│  │            │  │            │      │    │
│  │  └────────────┘  └────────────┘  └────────────┘      │    │
│  │                                                        │    │
│  │  Row Level Security (RLS) Policies Enforced           │    │
│  └────────────────────────────────────────────────────────┘    │
└──────────────────────────────────────────────────────────────┘
```

---

## 2. Authentication Flow

```
┌─────────┐                                              ┌─────────────┐
│  USER   │                                              │ SUPABASE    │
└────┬────┘                                              └──────┬──────┘
     │                                                          │
     │ 1. Enter email/password                                 │
     ├──────────────────────────────────────────────────────────>│
     │   POST /auth/v1/token?grant_type=password               │
     │                                                          │
     │                                                          │
     │ 2. Validate credentials                                  │
     │<──────────────────────────────────────────────────────────┤
     │   { access_token, refresh_token, user }                  │
     │                                                          │
     │ 3. Store tokens in localStorage                          │
     │    (Warning: XSS vulnerable!)                            │
     │                                                          │
     │ 4. Include token in requests                             │
     ├──────────────────────────────────────────────────────────>│
     │   Authorization: Bearer <token>                          │
     │                                                          │
     │ 5. Token validated on every request                      │
     │<──────────────────────────────────────────────────────────┤
     │   { data or error }                                      │
     │                                                          │
     │ 6. Token expires (1 hour)                                │
     │                                                          │
     │ 7. Auto-refresh with refresh_token                       │
     ├──────────────────────────────────────────────────────────>│
     │   POST /auth/v1/token?grant_type=refresh_token           │
     │                                                          │
     │ 8. New access_token returned                             │
     │<──────────────────────────────────────────────────────────┤
     │                                                          │
     └──┐  Repeat for each request                              │
        │                                                       │
```

---

## 3. Data Access Flow

```
┌──────────┐                          ┌──────────────┐
│ CLIENT   │                          │  SUPABASE    │
└────┬─────┘                          └──────┬───────┘
     │                                       │
     │ 1. Request: GET /rest/v1/keywords      │
     │    Headers:                            │
     │      Authorization: Bearer <jwt>       │
     │      apikey: <anon_key>                │
     ├───────────────────────────────────────>│
     │                                        │
     │                                        │ 2. Verify JWT
     │                                        │    - Decode token
     │                                        │    - Check expiration
     │                                        │    - Extract user_id
     │                                        │
     │                                        │ 3. Query database
     │                                        │    SELECT * FROM keywords
     │                                        │    WHERE product_id = UUID
     │                                        │
     │                                        │ 4. Apply RLS policies
     │                                        │    CHECK (user has access)
     │                                        │
     │ 5. Return data or error               │
     │<───────────────────────────────────────┤
     │    { data: [...], error: null }        │
     │                                        │
     └──┐                                    │
        │  Repeat for subsequent queries      │
```

---

## 4. Database Schema Relationships

```
┌────────────────────────────────────────────────────────────────────┐
│                          ORGANIZATIONS                             │
│  ┌──────────────────────────────────────────────────────────────┐ │
│  │  id (PK)                                                     │ │
│  │  name                                                        │ │
│  │  slug                                                        │ │
│  │  created_at                                                  │ │
│  └──────────────────────────────────────────────────────────────┘ │
└───────────────────────────────┬───────────────────────────────────┘
                                │ 1:N
                                ↓
┌────────────────────────────────────────────────────────────────────┐
│                            PRODUCTS                                │
│  ┌──────────────────────────────────────────────────────────────┐ │
│  │  id (PK)                                                     │ │
│  │  organization_id (FK) ←─────────────────────────────────┐    │ │
│  │  name                                                   │    │
│  │  website                                                │    │
│  │  status                                                 │    │
│  └──────────────────────────────────────────────────────────────┘ │
└───┬────────────────────────────────────────────────────────┬──────┘
    │                                                           │
    │ 1:N                                                       │ 1:N
    ↓                                                           ↓
┌───────────────────────┐                           ┌───────────────────────┐
│   SCHEDULED_KEYWORDS  │                           │   ARTICLE_ADDON_     │
│  ┌─────────────────┐  │                           │   SUBSCRIPTIONS      │
│  │ id (PK)         │  │                           ┌─────────────────┐   │
│  │ product_id (FK) │  │                           │ id (PK)         │   │
│  │ keyword         │  │                           │ product_id (FK) │   │
│  │ search_volume   │  │                           │ status          │   │
│  │ difficulty      │  │                           │ stripe_sub_id   │   │
│  │ scheduled_date  │  │                           └─────────────────┘   │
│  │ status          │  │                           ┌─────────────────┐   │
│  └─────────────────┘  │                           │   SEO_TOOLS_     │   │
│         │             │                           │   SUBSCRIPTIONS  │   │
│         │ 1:N         │                           ┌─────────────────┐   │
│         ↓             │                           │ id (PK)         │   │
│  ┌─────────────────┐  │                           │ organization_id│   │
│  │    ARTICLES     │  │                           │ product_id (FK) │   │
│  │  ┌───────────┐  │  │                           │ status          │   │
│  │  │id (PK)    │  │  │                           └─────────────────┘   │
│  │  │keyword_id │  │  │                           ┌─────────────────┐   │
│  │  │title      │  │  │                           │ BACKLINK_CREDITS│   │
│  │  │content    │  │  │                           ┌─────────────────┐   │
│  │  │status     │  │  │                           │ product_id (FK) │   │
│  │  └───────────┘  │  │                           │ credit_balance  │   │
│  └─────────────────┘  │                           └─────────────────┘   │
└───────────────────────┘                           ┌─────────────────┐   │
                                                     │OUTPUT_PRESETS  │   │
                                                     ┌─────────────────┐   │
                                                     │ product_id (FK) │   │
                                                     │ preset_config   │   │
                                                     └─────────────────┘   │
                                                     ┌─────────────────┐   │
                                                     │SEARCH_CONSOLE_  │   │
                                                     │CONNECTIONS      │   │
                                                     ┌─────────────────┐   │
                                                     │ product_id (FK) │   │
                                                     │ access_token    │   │
                                                     └─────────────────┘   │
                                                     ┌─────────────────┐   │
                                                     │  INTEGRATIONS   │   │
                                                     ┌─────────────────┐   │
                                                     │ product_id (FK) │   │
                                                     │ config (JSONB)  │   │
                                                     └─────────────────┘   │
                                                     ┌─────────────────┐   │
                                                     │   BACKLINKS     │   │
                                                     ┌─────────────────┐   │
                                                     │ product_id (FK) │   │
                                                     │ source_url      │   │
                                                     │ target_url      │   │
                                                     └─────────────────┘   │
                                                     ┌─────────────────┐   │
                                                     │   INVOICES      │   │
                                                     ┌─────────────────┐   │
                                                     │ organization_id│   │
                                                     │ product_id (FK) │   │
                                                     │ stripe_invoice │   │
                                                     └─────────────────┘   │
└────────────────────────────────────────────────────────────────────┘
```

---

## 5. Request/Response Flow

```
┌────────┐                     ┌──────────┐                  ┌────────────┐
│ Browser│                     │ Next.js  │                  │ Supabase   │
└───┬────┘                     └────┬─────┘                  └─────┬──────┘
    │                               │                              │
    │ 1. User navigates to /dashboard/scheduler
    ├───────────────────────────────────────┐                     │
    │                                       │                     │
    │                              2. Server checks auth          │
    │                                       ├────────────────────>│
    │                              3. Validate JWT               │
    │                                       │<────────────────────┤
    │                              4. Get RSC (React Server      │
    │                                 Component)                 │
    │                                       │                     │
    │                              5. Query data from Supabase   │
    │                                       ├────────────────────>│
    │                              6. Apply RLS                   │
    │                                       │<────────────────────┤
    │                              7. Return keywords data       │
    │                                       │                     │
    │ 8. Render HTML + RSC payload         │                     │
    │<──────────────────────────────────────┘                     │
    │                                                              │
    │ 9. Browser renders HTML                                     │
    │ 10. Hydrate React components                                │
    │                                                              │
    │ 11. Client-side fetch for updates                           │
    ├───────────────────────────────────────┐                     │
    │                                       │                     │
    │                                       ├────────────────────>│
    │                                       │<────────────────────┤
    │<──────────────────────────────────────┘                     │
    │                                                              │
    └──→ Repeat for subsequent interactions                        │
```

---

## 6. Real-time Data Flow (Supabase Realtime)

```
┌──────────┐                    ┌──────────────┐              ┌────────────┐
│  Client  │                    │ Supabase     │              │ PostgreSQL │
└────┬─────┘                    └──────┬───────┘              └─────┬──────┘
     │                                 │                             │
     │ 1. Subscribe to changes          │                             │
     │    supabase                       │                             │
     │      .channel('keywords')         │                             │
     │      .on('postgres_changes', ...) │                             │
     ├─────────────────────────────────>│                             │
     │                                  │                             │
     │                                  │ 2. Listen to PostgreSQL     │
     │                                  │    NOTIFY events             │
     │                                  ├────────────────────────────>│
     │                                  │                             │
     │ 3. Another client updates data   │                             │
     ├─────────────────────────────────>│                             │
     │                                  │                             │
     │                                  │ 4. Execute UPDATE           │
     │                                  ├────────────────────────────>│
     │                                  │                             │
     │                                  │ 5. Broadcast changes        │
     │                                  │    to all subscribers       │
     │ 6. Receive real-time update      │                             │
     │<─────────────────────────────────┤                             │
     │                                  │                             │
     │ 7. UI updates automatically      │                             │
     │    (no refresh needed)           │                             │
```

---

## 7. Security Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                      SECURITY LAYERS                             │
│                                                                 │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │  LAYER 1: CLIENT-SIDE                                     │ │
│  │  ┌─────────────────────────────────────────────────────┐  │ │
│  │  │ • JWT stored in localStorage (⚠️ XSS vulnerable)    │  │ │
│  │  │ • Supabase Client SDK                                │  │ │
│  │  │ • Token refresh logic                                │  │ │
│  │  │ • Request/response headers                           │  │ │
│  │  └─────────────────────────────────────────────────────┘  │ │
│  └───────────────────────────────────────────────────────────┘ │
│                            ↓                                   │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │  LAYER 2: NEXT.JS SERVER                                  │ │
│  │  ┌─────────────────────────────────────────────────────┐  │ │
│  │  │ • Middleware auth validation                        │  │ │
│  │  │ • Route protection                                   │  │ │
│  │  │ • Environment variable checks                        │  │ │
│  │  │ • CORS configuration                                 │  │ │
│  │  └─────────────────────────────────────────────────────┘  │ │
│  └───────────────────────────────────────────────────────────┘ │
│                            ↓                                   │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │  LAYER 3: SUPABASE API GATEWAY                           │ │
│  │  ┌─────────────────────────────────────────────────────┐  │ │
│  │  │ • JWT validation (signature, expiration)             │  │ │
│  │  │ • Request routing                                    │  │ │
│  │  │ • API key verification                               │  │ │
│  │  │ • Rate limiting (tier-based)                         │  │ │
│  │  └─────────────────────────────────────────────────────┘  │ │
│  └───────────────────────────────────────────────────────────┘ │
│                            ↓                                   │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │  LAYER 4: ROW LEVEL SECURITY (RLS)                       │ │
│  │  ┌─────────────────────────────────────────────────────┐  │ │
│  │  │ • Policy: Users can only access their org data      │  │ │
│  │  │ • Policy: Service role has full access               │  │ │
│  │  │ • Enforced at database level                         │  │ │
│  │  │ • Cannot be bypassed                                 │  │ │
│  │  └─────────────────────────────────────────────────────┘  │ │
│  └───────────────────────────────────────────────────────────┘ │
│                            ↓                                   │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │  LAYER 5: DATABASE CONSTRAINTS                           │ │
│  │  ┌─────────────────────────────────────────────────────┐  │ │
│  │  │ • Foreign key constraints                            │  │ │
│  │  │ • Unique constraints                                 │  │ │
│  │  │ • Not null constraints                               │  │ │
│  │  │ • Check constraints                                  │  │ │
│  │  └─────────────────────────────────────────────────────┘  │ │
│  └───────────────────────────────────────────────────────────┘ │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 8. Multi-Tenancy Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                     MULTI-TENANT DESIGN                          │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                   ORGANIZATION A                        │   │
│  │  ┌────────────┐  ┌────────────┐  ┌────────────┐       │   │
│  │  │ Product 1  │  │ Product 2  │  │ Product 3  │       │   │
│  │  │            │  │            │  │            │       │   │
│  │  │ Keywords   │  │ Keywords   │  │ Keywords   │       │   │
│  │  │ Articles   │  │ Articles   │  │ Articles   │       │   │
│  │  │ Backlinks  │  │ Backlinks  │  │ Backlinks  │       │   │
│  │  └────────────┘  └────────────┘  └────────────┘       │   │
│  │                                                     Isolation │
│  └─────────────────────────────────────────────────────────┘   │
│                           │                                    │
│                           │ RLS Policies                       │
│                           │ (Data Isolation)                   │
│                           │                                    │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                   ORGANIZATION B                        │   │
│  │  ┌────────────┐  ┌────────────┐  ┌────────────┐       │   │
│  │  │ Product 1  │  │ Product 2  │  │ Product 3  │       │   │
│  │  │            │  │            │  │            │       │   │
│  │  │ Keywords   │  │ Keywords   │  │ Keywords   │       │   │
│  │  │ Articles   │  │ Articles   │  │ Articles   │       │   │
│  │  │ Backlinks  │  │ Backlinks  │  │ Backlinks  │       │   │
│  │  └────────────┘  └────────────┘  └────────────┘       │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  RLS Policy Example:                                            │
│  CREATE POLICY "Organization isolation"                         │
│  ON scheduled_keywords                                           │
│  FOR SELECT                                                      │
│  USING (                                                         │
│    product_id IN (                                              │
│      SELECT id FROM products                                     │
│      WHERE organization_id IN (                                 │
│        SELECT organization_id FROM profiles                      │
│        WHERE id = auth.uid()                                    │
│      )                                                           │
│    )                                                             │
│  );                                                              │
└─────────────────────────────────────────────────────────────────┘
```

---

## 9. API Request Lifecycle

```
┌─────────────────────────────────────────────────────────────────┐
│                    REQUEST LIFECYCLE                             │
│                                                                 │
│  CLIENT                                      SUPABASE           │
│    │                                           │                │
│    │ 1. Prepare Request                        │                │
│    │    - Add JWT token to headers              │                │
│    │    - Add API key                           │                │
│    │    - Set Content-Type                      │                │
│    │                                           │                │
│    ├──────────────────────────────────────────>│                │
│    │                                           │                │
│    │                              2. PostgREST receives         │
│    │                                           │                │
│    │                              3. Parse query parameters     │
│    │                              - select, filter, order       │
│    │                                           │                │
│    │                              4. Build SQL query            │
│    │                              SELECT * FROM keywords        │
│    │                              WHERE product_id = UUID       │
│    │                              ORDER BY created_at DESC      │
│    │                                           │                │
│    │                              5. Validate JWT               │
│    │                              - Decode token                │
│    │                              - Check signature             │
│    │                              - Extract user_id             │
│    │                                           │                │
│    │                              6. Execute SQL with RLS       │
│    │                              - Apply policies              │
│    │                              - Filter rows                 │
│    │                                           │                │
│    │                              7. Format response            │
│    │                              - JSON array                  │
│    │                              - Add headers                 │
│    │                              - Set status code             │
│    │                                           │                │
│    │<──────────────────────────────────────────┤                │
│    │                                           │                │
│    │ 8. Process Response                       │                │
│    │    - Parse JSON                            │                │
│    │    - Handle errors                         │                │
│    │    - Update UI                             │                │
│    │                                           │                │
└─────────────────────────────────────────────────────────────────┘
```

---

## 10. Error Handling Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                     ERROR HANDLING                               │
│                                                                 │
│  400 Bad Request                                                │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ • Invalid JSON payload                                   │   │
│  │ • Missing required fields                                │   │
│  │ • Invalid query parameters                               │   │
│  │ Response: {"message": "Invalid request"}                  │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  401 Unauthorized                                              │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ • Missing or invalid JWT token                           │   │
│  │ • Expired token                                          │   │
│  │ • Malformed token                                        │   │
│  │ Response: {"message": "Invalid API key"}                 │   │
│  │ Action: Redirect to login or refresh token              │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  403 Forbidden                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ • RLS policy violation                                   │   │
│  │ • Insufficient permissions                               │   │
│  │ • Trying to access other org's data                      │   │
│  │ Response: {"message": "RLS policy violation"}             │   │
│  │ Action: Show "access denied" error                       │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  404 Not Found                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ • Resource doesn't exist                                │   │
│  │ • Invalid ID                                            │   │
│  │ Response: {"message": "Results contain 0 rows"}          │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  409 Conflict                                                  │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ • Duplicate unique constraint                            │   │
│  │ • Concurrent update conflict                             │   │
│  │ Response: {"code": "23505", "message": "duplicate key"}  │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  422 Unprocessable Entity                                      │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ • Validation error                                       │   │
│  │ • Constraint violation                                   │   │
│  │ Response: {"message": "Validation failed"}                │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  429 Too Many Requests                                          │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ • Rate limit exceeded                                    │   │
│  │ Response: Retry-After header                             │   │
│  │ Action: Exponential backoff and retry                    │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  500 Server Error                                               │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ • Database error                                         │   │
│  │ • Internal server error                                  │   │
│  │ Response: {"message": "Internal server error"}            │   │
│  │ Action: Show error message, report to support            │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 11. Caching Strategy

```
┌─────────────────────────────────────────────────────────────────┐
│                      CACHING LAYERS                              │
│                                                                 │
│  Browser Cache                                                   │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ • Static assets (JS, CSS, images)                       │   │
│  │ • Cache-Control: public, max-age=31536000, immutable    │   │
│  └─────────────────────────────────────────────────────────┘   │
│                           ↓                                     │
│  Vercel Edge CDN (Next.js)                                      │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ • Static pages                                          │   │
│  │ • Image optimization                                    │   │
│  │ • Geographically distributed                            │   │
│  └─────────────────────────────────────────────────────────┘   │
│                           ↓                                     │
│  React Cache (Client-side)                                     │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ • SWR (stale-while-revalidate)                          │   │
│  │ • React Query / Supabase cache                          │   │
│  │ • Local state management                                │   │
│  └─────────────────────────────────────────────────────────┘   │
│                           ↓                                     │
│  Supabase Cache                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ • Query result caching                                   │   │
│  │ • Connection pooling (PgBouncer)                         │   │
│  │ • Read replicas (if enabled)                             │   │
│  └─────────────────────────────────────────────────────────┘   │
│                           ↓                                     │
│  PostgreSQL Cache                                                │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ • Query plan cache                                      │   │
│  │ • Shared buffers                                        │   │
│  │ • Table statistics                                      │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

**End of Architecture Diagrams**
