# Outrank.so - Complete API & Backend Analysis

**Analysis Date:** 2026-01-02
**Analyst:** Automated Network Traffic Interception
**Target:** https://www.outrank.so

---

## Executive Summary

Outrank.so is a Next.js-based SEO automation platform built with Supabase as the backend. The application uses a hybrid architecture combining:

- **Frontend:** Next.js (React App Router)
- **Backend:** Supabase (PostgreSQL + Auth + Storage)
- **API Style:** REST API via Supabase PostgREST
- **Authentication:** Supabase Auth (JWT-based session management)
- **Analytics:** PostHog, Mixpanel, Google Analytics, Plausible
- **Customer Support:** Crisp Chat

---

## 1. API Endpoint Inventory

### Primary API Base URL

```
https://api.outrank.so
```

### Authenticated REST API Endpoints

#### 1.1 Authentication & User Management

**GET** `/auth/v1/user`

- **Purpose:** Get current authenticated user details
- **Auth Required:** Yes (Bearer token/JWT)
- **Response:** User profile data
- **Status:** 200 (Success)
- **Example:**

```bash
curl -X GET https://api.outrank.so/auth/v1/user \
  -H "Authorization: Bearer <token>" \
  -H "apikey: <public-anon-key>"
```

#### 1.2 Product & Subscription Management

**GET** `/rest/v1/products`

- **Purpose:** Retrieve product information
- **Query Parameters:**
  - `select`: Fields to select (e.g., `*`)
  - `id`: Product ID filter (e.g., `eq.01b7e908-19ae-4ba6-830f-6dc2dbc784e6`)
  - `limit`: Maximum records (default: 1)
- **Example Request:**

```
GET /rest/v1/products?select=*&id=eq.01b7e908-19ae-4ba6-830f-6dc2dbc784e6&limit=1
```

- **Response:** Product configuration data
- **Status Code:** 200

**GET** `/rest/v1/backlink_credits`

- **Purpose:** Retrieve backlink credit balance
- **Query Parameters:**
  - `select`: Fields to select (e.g., `credit_balance`)
  - `product_id`: Product ID filter
- **Example:**

```
GET /rest/v1/backlink_credits?select=credit_balance&product_id=eq.01b7e908-19ae-4ba6-830f-6dc2dbc784e6
```

- **Response:** Credit balance information

**GET** `/rest/v1/article_addon_subscriptions`

- **Purpose:** Retrieve article addon subscription status
- **Query Parameters:**
  - `select`: Fields (e.g., `*`)
  - `product_id`: Filter by product
  - `status`: Filter by status (e.g., `eq.active`)
  - `order`: Sort order (e.g., `created_at.desc`)
  - `limit`: Max records
- **Example:**

```
GET /rest/v1/article_addon_subscriptions?select=*&product_id=eq.01b7e908-19ae-4ba6-830f-6dc2dbc784e6&status=eq.active&order=created_at.desc&limit=1
```

**GET** `/rest/v1/seo_tools_subscriptions`

- **Purpose:** Retrieve SEO tools subscription status
- **Query Parameters:**
  - `organization_id`: Organization filter
  - `status`: Filter by status (e.g., `in.(active,trialing,past_due)`)
  - `product_id`: Product filter
- **Example:**

```
GET /rest/v1/seo_tools_subscriptions?select=*&organization_id=eq.d20b6f8e-bfbc-4b4b-b665-bd7ce863392b&status=in.(active,trialing,past_due)&product_id=eq.01b7e908-19ae-4ba6-830f-6dc2dbc784e6
```

#### 1.3 Content & Keywords

**GET** `/rest/v1/scheduled_keywords`

- **Purpose:** Retrieve scheduled content keywords
- **Query Parameters:**
  - `select`: Fields (e.g., `*`)
  - `product_id`: Product filter
  - `created_by_super_admin`: Filter (e.g., `neq.true`)
  - `order`: Complex sorting (e.g., `utc_scheduled_date.asc,search_volume.desc,difficulty.desc,id.asc`)
- **Example:**

```
GET /rest/v1/scheduled_keywords?select=*&product_id=eq.01b7e908-19ae-4ba6-830f-6dc2dbc784e6&created_by_super_admin=neq.true&order=utc_scheduled_date.asc%2Csearch_volume.desc%2Cdifficulty.desc%2Cid.asc
```

- **Response:** Array of scheduled keywords with metadata

**GET** `/rest/v1/output_settings_presets`

- **Purpose:** Retrieve output configuration presets
- **Query Parameters:**
  - `select`: Fields
  - `product_id`: Product filter
- **Example:**

```
GET /rest/v1/output_settings_presets?select=*&product_id=eq.01b7e908-19ae-4ba6-830f-6dc2dbc784e6
```

#### 1.4 Integrations

**GET** `/rest/v1/search_console_connections`

- **Purpose:** Check Google Search Console integration status
- **Query Parameters:**
  - `select`: Fields (e.g., `id`)
  - `product_id`: Product filter
  - `limit`: Max records
- **Example:**

```
GET /rest/v1/search_console_connections?select=id&product_id=eq.01b7e908-19ae-4ba6-830f-6dc2dbc784e6&limit=1
```

### Next.js App Router Endpoints (Server-Side Rendering)

#### Frontend API Routes

**GET** `/api/subscription/status`

- **Purpose:** Check subscription status
- **Query Parameters:**
  - `organizationId`: Organization UUID
  - `productId`: Product UUID (optional)
- **Example:**

```
GET /api/subscription/status?organizationId=d20b6f8e-bfbc-4b4b-b665-bd7ce863392b
GET /api/subscription/status?organizationId=d20b6f8e-bfbc-4b4b-b665-bd7ce863392b&productId=01b7e908-19ae-4ba6-830f-6dc2dbc784e6
```

- **Status Code:** 404 (Not Found - likely deprecated or requires additional auth)
- **Note:** Called multiple times across pages

#### Dashboard Pages (RSC - React Server Components)

All dashboard pages use Next.js App Router with `_rsc` parameter for server component streaming:

```
GET /dashboard/scheduler?_rsc=<hash>
GET /dashboard/articles?_rsc=<hash>
GET /dashboard/backlinks?_rsc=<hash>
GET /dashboard/linking?_rsc=<hash>
GET /dashboard/integrations?_rsc=<hash>
GET /dashboard/integrations/new?_rsc=<hash>
GET /dashboard/settings/general/business?_rsc=<hash>
GET /dashboard/settings/articles/preferences?_rsc=<hash>
GET /dashboard/profile/access?_rsc=<hash>
GET /dashboard/invoices?_rsc=<hash>
GET /dashboard/seo-tools/subscribe?_rsc=<hash>
GET /dashboard/managed-service?_rsc=<hash>
GET /dashboard/directory-submission?_rsc=<hash>
```

---

## 2. Authentication Mechanism

### 2.1 Authentication Flow

**Provider:** Supabase Auth
**Type:** JWT (JSON Web Token) based session management

#### Authentication Storage (Client-Side)

**LocalStorage Keys:**

```javascript
{
  // Supabase session tokens (blocked from browser access)
  "sb-<project-id>-auth-token": "JWT tokens",
  "sb-<project-id>-auth-token-code-verifier": "PKCE code verifier",

  // Application state
  "current_product_id": "01b7e908-19ae-4ba6-830f-6dc2dbc784e6",
  "outrank_setup_data": "{\"website\":\"https://www.sywebs.nl\",...}",

  // Analytics identifiers
  "mp_f829b9eb2fac3401cc8ab25f083d4c6c_mixpanel": "{...}",
  "ph_phc_X8Ubg6jtaI0JGIWkn6gYkQcMhqQqEXtfIxWH0PPnSfw_posthog": "{...}"
}
```

#### Auth Headers

All authenticated requests to Supabase include:

```http
Authorization: Bearer <jwt-token>
apikey: <supabase-anon-key>
Content-Type: application/json
```

#### Session Validation Flow

1. **Initial Load:** App checks `localStorage` for auth tokens
2. **Token Validation:** Calls `/auth/v1/user` to validate session
3. **Product Context:** Retrieves `current_product_id` from localStorage
4. **Page Access:** Loads RSC (React Server Components) for dashboard pages

---

## 3. Database Schema Inference

### 3.1 Core Tables

Based on API responses, the following database tables exist:

#### `products`

```sql
Columns:
  - id: UUID (primary key)
  - organization_id: UUID
  - created_at: timestamp
  - updated_at: timestamp
  - ... (other product configuration fields)
```

#### `scheduled_keywords`

```sql
Columns:
  - id: UUID (primary key)
  - product_id: UUID (foreign key)
  - keyword: text
  - utc_scheduled_date: timestamp
  - search_volume: integer
  - difficulty: integer
  - created_by_super_admin: boolean
  - created_at: timestamp
  - updated_at: timestamp
```

#### `backlink_credits`

```sql
Columns:
  - product_id: UUID (foreign key)
  - credit_balance: integer
```

#### `article_addon_subscriptions`

```sql
Columns:
  - id: UUID (primary key)
  - product_id: UUID (foreign key)
  - status: text (active, canceled, trialing, past_due)
  - created_at: timestamp
  - ... (subscription details)
```

#### `seo_tools_subscriptions`

```sql
Columns:
  - id: UUID (primary key)
  - organization_id: UUID (foreign key)
  - product_id: UUID (foreign key)
  - status: text
  - ... (subscription details)
```

#### `output_settings_presets`

```sql
Columns:
  - id: UUID (primary key)
  - product_id: UUID (foreign key)
  - ... (preset configuration)
```

#### `search_console_connections`

```sql
Columns:
  - id: UUID (primary key)
  - product_id: UUID (foreign key)
  - ... (connection details)
```

### 3.2 Relationships

```
organizations (1) ───< (N) products (1) ───< (N) scheduled_keywords
                   │                      │
                   │                      └──< (N) backlink_credits
                   │
                   └──< (N) seo_tools_subscriptions
                   └──< (N) article_addon_subscriptions
                   └──< (N) output_settings_presets
                   └──< (N) search_console_connections
```

---

## 4. API Request/Response Patterns

### 4.1 PostgREST Query Pattern

All Supabase API calls follow PostgREST syntax:

**Filtering:**

```
?column_name=eq.value              # Equals
?column_name=neq.value             # Not equals
?column_name=in.(value1,value2)    # In list
```

**Sorting:**

```
?order=column_name.asc             # Ascending
?order=column_name.desc            # Descending
?order=col1.asc,col2.desc          # Multiple
```

**Pagination:**

```
?limit=10                          # Limit rows
?offset=20                         # Skip rows
```

**Selection:**

```
?select=*                          # All columns
?select=col1,col2                  # Specific columns
```

### 4.2 Response Format

**Success Response (200):**

```json
{
  "data": [
    {
      "id": "uuid",
      "created_at": "2024-01-01T00:00:00Z",
      ...
    }
  ],
  "status": 200,
  "statusText": "OK"
}
```

**Error Response (4xx/5xx):**

```json
{
  "error": "Error message",
  "status": 400,
  "statusText": "Bad Request"
}
```

---

## 5. Third-Party Integrations

### 5.1 Analytics & Tracking

**PostHog Analytics**

```
Endpoint: https://eu.i.posthog.com
Paths:
  - /i/v0/e/ (events)
  - /s/ (session recording)
Method: POST
Data: Compression gzip-js
```

**Mixpanel Analytics**

```
Endpoint: https://api-js.mixpanel.com
Paths:
  - /track/ (event tracking)
  - /engage/ (user engagement)
Method: POST
```

**Google Analytics 4**

```
Endpoint: https://region1.google-analytics.com
Path: /g/collect
Measurement ID: G-F7WDEEYCJV
Method: POST
```

**Plausible Analytics**

```
Endpoint: https://plausible.io
Path: /api/event
Method: POST
```

**Facebook Pixel**

```
Endpoint: https://connect.facebook.net
Script: /en_US/fbevents.js
```

**Webflow (Attribution)**

```
Endpoint: https://r.wdfl.co
Script: /rw.js
```

### 5.2 Customer Support

**Crisp Chat**

```
Website ID: 423aaeff-d9ff-4e30-ae32-3f30474dbd97
Endpoint: https://client.crisp.chat
Features:
  - Live chat widget
  - Session management
  - Localization (nl.json detected)
```

---

## 6. Frontend Architecture

### 6.1 Tech Stack

- **Framework:** Next.js (App Router)
- **UI Library:** React 18+
- **Rendering:** Server Components (RSC) + Client Components
- **State Management:** React Context + Zustand (likely)
- **Styling:** CSS Modules or Tailwind CSS
- **Build Tool:** Webpack (Next.js内置)

### 6.2 Key Frontend Features

**Route Structure:**

```
/                                   # Landing page
/dashboard                          # Dashboard layout
  /scheduler                        # Content planner
  /articles                         # Articles management
  /backlinks                        # Backlink exchange
  /linking                          # Linking configuration
  /integrations                     # Integrations hub
    /new                            # Add integration
  /settings
    /general/business               # Business settings
    /articles/preferences           # Article preferences
  /profile/access                   # User access
  /invoices                         # Billing invoices
  /seo-tools/subscribe              # SEO tools subscription
  /managed-service                  # Managed service
  /directory-submission             # Directory submission
```

**Client-Side Storage:**

```javascript
localStorage:
  - current_product_id: "01b7e908-19ae-4ba6-830f-6dc2dbc784e6"
  - outrank_setup_data: "{website, businessData, currentProductId}"
  - theme: "\"light\""
  - sidebar-section-articles: "true"
  - sidebar-section-add-ons: "true"
  - topicsLastReferenceTime: "1767340567986"

// Analytics data
  - mp_<id>_mixpanel: "{distinct_id, $device_id, $user_id,...}"
  - ph_phc_<id>_posthog: "{distinct_id, $sesid, $device_id,...}"
```

---

## 7. Identified API Features

### 7.1 Core Features

1. **Keyword Management**
   - Schedule keywords for content creation
   - Import keyword lists
   - Generate keywords via AI
   - Track keyword metrics (search volume, difficulty)

2. **Content Automation**
   - Auto-generate articles based on keywords
   - Configure output presets
   - Schedule content publication
   - Manage article addons

3. **Backlink Management**
   - Backlink exchange network
   - Directory submission service
   - Backlink credit system

4. **SEO Tools**
   - Search Console integration
   - SEO analysis tools
   - Managed service options

5. **Billing & Subscriptions**
   - Stripe integration (implied)
   - Subscription management
   - Invoice tracking
   - Credit-based pricing

### 7.2 User Management

- Organization-based multi-tenancy
- Role-based access control
- Product-level isolation
- Team collaboration features

---

## 8. Security Observations

### 8.1 Authentication Security

✅ **Strengths:**

- JWT-based authentication (industry standard)
- Supabase Auth (mature, secure)
- HTTPS only
- PKCE flow for OAuth

⚠️ **Potential Concerns:**

- Tokens stored in localStorage (XSS vulnerable)
- No observable CSRF protection
- API keys exposed in client-side code

### 8.2 Data Access Patterns

- Row Level Security (RLS) likely enforced by Supabase
- Product-based data isolation
- Organization-based scoping
- No raw SQL injection risk (PostgREST)

---

## 9. Rate Limiting & Performance

### 9.1 Observations

- No explicit rate limit headers observed
- Multiple parallel requests allowed
- RSC (React Server Components) for performance
- Static asset caching via Next.js
- CDN distribution (likely Vercel)

### 9.2 Performance Metrics

From performance API:

```
API Response Times:
  - /auth/v1/user: ~181ms
  - /rest/v1/*: ~20-700ms
  - /api/subscription/status: ~250-400ms
  - RSC pages: ~150-400ms

Static Assets:
  - JS bundles: ~50-70 chunks
  - Chunk sizes: ~1KB-200KB
  - Total page weight: ~2-3MB
```

---

## 10. Missing/Undiscovered Endpoints

The following endpoints likely exist but weren't captured:

### 10.1 Content Generation

```
POST   /api/generate-article
POST   /api/generate-keywords
POST   /api/optimize-content
```

### 10.2 Backlink Operations

```
POST   /api/backlinks/exchange
GET    /api/backlinks/opportunities
POST   /api/backlinks/submit
```

### 10.3 Integrations

```
POST   /api/integrations/connect
DELETE /api/integrations/disconnect
GET    /api/integrations/status
```

### 10.4 Billing

```
POST   /api/subscription/upgrade
POST   /api/subscription/cancel
GET    /api/usage/current
```

### 10.5 User Management

```
PUT    /api/user/profile
POST   /api/user/invite
DELETE /api/user/revoke
```

---

## 11. Development Recommendations

### 11.1 For Building Similar Features

**Backend Stack:**

- Supabase for rapid development
- PostgREST for auto-generated APIs
- Row Level Security for data isolation

**Frontend Stack:**

- Next.js App Router for performance
- React Server Components for reduced JS
- Supabase JS client for auth

**Architecture Patterns:**

```
Client (Next.js) → Supabase Client → Supabase Auth → PostgreSQL
                                              ↓
                                      PostgREST API
```

### 11.2 API Design Best Practices Observed

1. **Consistent naming:** kebab-case for URLs
2. **RESTful patterns:** Proper HTTP methods
3. **Query filtering:** PostgREST syntax
4. **Pagination:** limit/offset parameters
5. **Error handling:** JSON error responses
6. **Versioning:** `/rest/v1/` path structure

---

## 12. Network Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                         User Browser                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ Next.js App  │  │  Analytics   │  │ Crisp Chat   │      │
│  │  (RSC + CSR) │  │  (PostHog)   │  │  (Support)   │      │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘      │
└─────────┼──────────────────┼──────────────────┼─────────────┘
          │                  │                  │
          │                  │                  │
┌─────────┼──────────────────┼──────────────────┼─────────────┐
│         ▼                  ▼                  ▼              │
│  ┌────────────────────────────────────────────────────┐     │
│  │          Next.js Server (Vercel Edge)              │     │
│  │  - Route Handlers (/api/*)                         │     │
│  │  - React Server Components                         │     │
│  │  - Static Asset Serving                            │     │
│  └──────────────────┬─────────────────────────────────┘     │
│                     │                                        │
│  ┌──────────────────┴─────────────────────────────────┐     │
│  │              Supabase Project                      │     │
│  │  ┌────────────┐  ┌─────────────┐  ┌────────────┐  │     │
│  │  │   Auth     │  │  PostgREST  │  │  Database  │  │     │
│  │  │  Service   │  │    API      │  │ PostgreSQL │  │     │
│  │  └────────────┘  └──────┬──────┘  └──────┬─────┘  │     │
│  │                        │                  │          │     │
│  │                        │                  │          │     │
│  │  ┌─────────────────────┴──────────────────┤          │     │
│  │  │         Row Level Security (RLS)       │          │     │
│  │  └────────────────────────────────────────┘          │     │
│  └─────────────────────────────────────────────────────┘     │
└─────────────────────────────────────────────────────────────┘
```

---

## 13. Key Findings Summary

### Architecture

- **Next.js 14+** with App Router
- **Supabase** for complete backend (auth + database + API)
- **PostgreSQL** with PostgREST auto-generated APIs
- **React Server Components** for performance

### API Style

- RESTful via Supabase PostgREST
- JWT authentication
- Organization + Product based multi-tenancy
- Real-time subscriptions (likely via Supabase Realtime)

### Data Model

- Organization → Product → Resources
- Credit-based system for backlinks
- Scheduled content generation
- Multiple addon subscriptions

### Analytics & Monitoring

- 4 analytics platforms (PostHog, Mixpanel, GA4, Plausible)
- Session recording enabled
- Performance tracking

### Security

- JWT-based auth
- Row Level Security
- HTTPS only
- Potential XSS risk (localStorage tokens)

---

## 14. API Testing Examples

### Test Authenticated Request

```bash
# Get current user
curl -X GET \
  'https://api.outrank.so/auth/v1/user' \
  -H 'Authorization: Bearer YOUR_JWT_TOKEN' \
  -H 'apikey: YOUR_SUPABASE_ANON_KEY'

# Get scheduled keywords
curl -X GET \
  'https://api.outrank.so/rest/v1/scheduled_keywords?select=*&product_id=eq.01b7e908-19ae-4ba6-830f-6dc2dbc784e6' \
  -H 'Authorization: Bearer YOUR_JWT_TOKEN' \
  -H 'apikey: YOUR_SUPABASE_ANON_KEY'
```

---

## 15. Conclusion

Outrank.so is a modern, well-architected SEO automation platform built on:

1. **Next.js 14+** - Server-first React framework
2. **Supabase** - Backend-as-a-Service platform
3. **PostgreSQL** - Relational database
4. **PostgREST** - Auto-generated REST API

The API follows REST conventions with PostgREST query syntax, uses JWT-based authentication, and implements organization-based multi-tenancy. The frontend leverages React Server Components for optimal performance.

**Key Technical Decisions:**

- Supabase for rapid backend development
- Next.js App Router for modern React patterns
- Credit-based pricing model
- Multiple subscription tiers
- Heavy analytics integration for product insights

---

**End of Analysis**
