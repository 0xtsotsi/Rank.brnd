# Outrank.so - API Endpoints Quick Reference

**All discovered endpoints from network traffic analysis**

---

## Auth Endpoints

### Authentication

```
POST   /auth/v1/token?grant_type=password
       Login with email/password

POST   /auth/v1/token?grant_type=refresh_token
       Refresh access token

GET    /auth/v1/user
       Get current user profile

POST   /auth/v1/logout
       Logout current session

POST   /auth/v1/recover
       Request password reset

POST   /auth/v1/verify
       Verify email address
```

---

## REST API Endpoints (PostgREST)

### Products

```
GET    /rest/v1/products
       Query products
       Params: select, id, organization_id, limit
       Example: ?select=*&id=eq.UUID&limit=1

POST   /rest/v1/products
       Create product

PATCH  /rest/v1/products?id=eq.UUID
       Update product

DELETE /rest/v1/products?id=eq.UUID
       Delete product
```

### Scheduled Keywords

```
GET    /rest/v1/scheduled_keywords
       Query scheduled keywords
       Params: select, product_id, created_by_super_admin, order
       Example: ?select=*&product_id=eq.UUID&order=utc_scheduled_date.asc

POST   /rest/v1/scheduled_keywords
       Create scheduled keyword

PATCH  /rest/v1/scheduled_keywords?id=eq.UUID
       Update keyword status

DELETE /rest/v1/scheduled_keywords?id=eq.UUID
       Delete keyword
```

### Articles

```
GET    /rest/v1/articles
       Query articles (inferred)
       Params: select, product_id, status, order

POST   /rest/v1/articles
       Create article

PATCH  /rest/v1/articles?id=eq.UUID
       Update article

DELETE /rest/v1/articles?id=eq.UUID
       Delete article
```

### Backlink Credits

```
GET    /rest/v1/backlink_credits
       Query credit balance
       Params: select, product_id
       Example: ?select=credit_balance&product_id=eq.UUID

PATCH  /rest/v1/backlink_credits?product_id=eq.UUID
       Update credit balance
```

### Article Addon Subscriptions

```
GET    /rest/v1/article_addon_subscriptions
       Query article subscriptions
       Params: select, product_id, status, order
       Example: ?select=*&product_id=eq.UUID&status=eq.active&order=created_at.desc

POST   /rest/v1/article_addon_subscriptions
       Create addon subscription

PATCH  /rest/v1/article_addon_subscriptions?id=eq.UUID
       Update subscription
```

### SEO Tools Subscriptions

```
GET    /rest/v1/seo_tools_subscriptions
       Query SEO subscriptions
       Params: select, organization_id, status, product_id
       Example: ?select=*&organization_id=eq.UUID&status=in.(active,trialing,past_due)

POST   /rest/v1/seo_tools_subscriptions
       Create SEO subscription

PATCH  /rest/v1/seo_tools_subscriptions?id=eq.UUID
       Update subscription
```

### Output Settings Presets

```
GET    /rest/v1/output_settings_presets
       Query output presets
       Params: select, product_id
       Example: ?select=*&product_id=eq.UUID

POST   /rest/v1/output_settings_presets
       Create preset

PATCH  /rest/v1/output_settings_presets?id=eq.UUID
       Update preset

DELETE /rest/v1/output_settings_presets?id=eq.UUID
       Delete preset
```

### Search Console Connections

```
GET    /rest/v1/search_console_connections
       Query GSC connections
       Params: select, product_id
       Example: ?select=id&product_id=eq.UUID&limit=1

POST   /rest/v1/search_console_connections
       Create connection

PATCH  /rest/v1/search_console_connections?id=eq.UUID
       Update connection

DELETE /rest/v1/search_console_connections?id=eq.UUID
       Delete connection
```

### Backlinks (Inferred)

```
GET    /rest/v1/backlinks
       Query backlinks
       Params: select, product_id, status

POST   /rest/v1/backlinks
       Create backlink

PATCH  /rest/v1/backlinks?id=eq.UUID
       Update backlink status

DELETE /rest/v1/backlinks?id=eq.UUID
       Delete backlink
```

### Integrations (Inferred)

```
GET    /rest/v1/integrations
       Query integrations
       Params: select, product_id, integration_type

POST   /rest/v1/integrations
       Create integration

PATCH  /rest/v1/integrations?id=eq.UUID
       Update integration

DELETE /rest/v1/integrations?id=eq.UUID
       Delete integration
```

### Invoices (Inferred)

```
GET    /rest/v1/invoices
       Query invoices
       Params: select, organization_id, product_id, status
```

---

## Next.js Frontend API Routes

### Subscription Status

```
GET    /api/subscription/status
       Check subscription status
       Params: organizationId, productId
       Example: ?organizationId=UUID&productId=UUID
       Status: 404 (possibly deprecated)
```

### Likely Exists (Not Captured)

```
POST   /api/generate-article
       Generate article via AI

POST   /api/generate-keywords
       Generate keywords via AI

POST   /api/keywords/import
       Import keyword list

POST   /api/backlinks/exchange
       Request backlink exchange

POST   /api/integrations/connect
       Connect external service

POST   /api/webhooks/stripe
       Handle Stripe webhooks
```

---

## Dashboard Routes (Next.js App Router)

All dashboard routes support RSC (React Server Components):

```
GET    /dashboard/scheduler
       Content planner / keyword scheduler

GET    /dashboard/articles
       Articles management

GET    /dashboard/backlinks
       Backlink exchange

GET    /dashboard/linking
       Internal linking configuration

GET    /dashboard/integrations
       Integrations hub

GET    /dashboard/integrations/new
       Add new integration

GET    /dashboard/settings/general/business
       Business settings

GET    /dashboard/settings/articles/preferences
       Article generation preferences

GET    /dashboard/profile/access
       User access management

GET    /dashboard/invoices
       Billing invoices

GET    /dashboard/seo-tools/subscribe
       SEO tools subscription

GET    /dashboard/managed-service
       Managed service page

GET    /dashboard/directory-submission
       Directory submission service
```

Each returns React Server Component with `?_rsc=<hash>` parameter.

---

## Third-Party Services

### Analytics

```
POST   https://eu.i.posthog.com/i/v0/e/
       PostHog events

POST   https://eu.i.posthog.com/s/
       PostHog session recording

POST   https://api-js.mixpanel.com/track/
       Mixpanel event tracking

POST   https://api-js.mixpanel.com/engage/
       Mixpanel user engagement

POST   https://region1.google-analytics.com/g/collect
       Google Analytics 4

POST   https://plausible.io/api/event
       Plausible analytics

GET    https://www.googletagmanager.com/gtag/js
       Google Tag Manager
```

### Customer Support

```
GET    https://client.crisp.chat/settings/website/WEBSITE_ID
       Crisp chat configuration

GET    https://client.crisp.chat/static/javascripts/client_default.js
       Crisp chat widget
```

### Other

```
GET    https://connect.facebook.net/en_US/fbevents.js
       Facebook Pixel

GET    https://r.wdfl.co/rw.js
       Webflow attribution
```

---

## PostgREST Query Syntax Reference

### Selection

```
?select=*                    All columns
?select=id,name              Specific columns
?select=*,organization(*)    With relationships
```

### Filtering

```
?col=eq.value                Equals
?col=neq.value               Not equals
?col=gt.value                Greater than
?col=gte.value               Greater or equal
?col=lt.value                Less than
?col=lte.value               Less or equal
?col=in.(val1,val2)          In list
?col=cs.{value}              Contains (JSON)
?col=cd.{value}              Contained by (JSON)
?col=like.*pattern*          LIKE (case sensitive)
?col=ilike.*pattern*         ILIKE (case insensitive)
```

### Sorting

```
?order=col.asc               Ascending
?order=col.desc              Descending
?order=col1,col2             Multiple columns
?order=col.nullsfirst        Nulls first
?order=col.nullslast         Nulls last
```

### Pagination

```
?limit=10                    Limit rows
?offset=20                   Skip rows
Range: 0-9 header            Pagination range
```

### Boolean Logic

```
?and=(col1.eq.val1,col2.eq.val2)         AND
?or=(col1.eq.val1,col2.eq.val2)          OR
?not=(col.eq.val)                        NOT
```

### Full Text Search

```
?textsearchcol=fts.keyword                Full text search
```

---

## Request/Response Headers

### Request Headers

```
Authorization: Bearer <jwt_token>         Auth token (required)
apikey: <supabase_anon_key>              API key (required)
Content-Type: application/json           For POST/PATCH
Prefer: return=representation            Return created/updated rows
Prefer: count=exact                      Include count in response
Range-Unit: items                        For pagination
Range: 0-9                               Pagination range
```

### Response Headers

```
Content-Range: */25                      Total count
Content-Location: /rest/v1/table?id=eq.UUID  Location header
X-Total-Count: 25                        Total rows (deprecated)
RateLimit-Limit: 1000                    Rate limit
RateLimit-Remaining: 999                 Remaining requests
RateLimit-Reset: 1640000000              Reset timestamp
```

---

## HTTP Methods Reference

```
GET    Retrieve resources
       Status: 200 (success), 206 (partial)

POST   Create resource
       Status: 201 (created), 202 (accepted)

PATCH  Update resource (partial)
       Status: 200 (updated), 204 (no content)

PUT    Update resource (replace)
       Status: 200 (updated), 204 (no content)

DELETE Delete resource
       Status: 200 (deleted), 204 (no content)

HEAD   Get headers only
       Status: 200

OPTIONS Get allowed methods
       Status: 204
```

---

## Status Codes Reference

```
2xx Success
  200 OK                  Request succeeded
  201 Created             Resource created
  202 Accepted            Request accepted (async)
  204 No Content          Success (no response body)
  206 Partial Content     Partial range response

4xx Client Error
  400 Bad Request         Invalid request
  401 Unauthorized        Missing/invalid auth
  403 Forbidden           Insufficient permissions
  404 Not Found           Resource not found
  405 Method Not Allowed  Invalid HTTP method
  409 Conflict            Resource conflict
  422 Unprocessable       Validation error
  429 Too Many Requests   Rate limit exceeded

5xx Server Error
  500 Internal Error      Server error
  501 Not Implemented     Feature not implemented
  503 Service Unavailable Temporarily down
```

---

## Common Query Patterns

### Get Product Details

```bash
GET /rest/v1/products?select=*&id=eq.PRODUCT_UUID&limit=1
```

### Get Pending Keywords

```bash
GET /rest/v1/scheduled_keywords?select=*&product_id=eq.UUID&status=eq.pending&order=created_at.desc
```

### Get Keywords with Pagination

```bash
GET /rest/v1/scheduled_keywords?product_id=eq.UUID&order=created_at.desc&limit=10&offset=20
```

### Count Keywords

```bash
GET /rest/v1/scheduled_keywords?product_id=eq.UUID
Header: Prefer: count=exact
```

### Create Keyword

```bash
POST /rest/v1/scheduled_keywords
{
  "product_id": "UUID",
  "keyword": "example keyword",
  "search_volume": 1000,
  "difficulty": 45
}
Header: Prefer: return=representation
```

### Update Status

```bash
PATCH /rest/v1/scheduled_keywords?id=eq.KEYWORD_UUID
{
  "status": "published"
}
```

### Bulk Update

```bash
PATCH /rest/v1/scheduled_keywords?product_id=eq.UUID&status=eq.pending
{
  "status": "canceled"
}
```

### Delete Resource

```bash
DELETE /rest/v1/scheduled_keywords?id=eq.KEYWORD_UUID
```

---

## Environment Variables

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://api.outrank.so
NEXT_PUBLIC_SUPABASE_ANON_KEY=<public_anon_key>
SUPABASE_SERVICE_ROLE_KEY=<service_role_key>

# App
NEXT_PUBLIC_APP_URL=https://www.outrank.so

# Analytics
NEXT_PUBLIC_POSTHOG_KEY=<posthog_key>
NEXT_PUBLIC_GA_ID=G-F7WDEEYCJV
NEXT_PUBLIC_MIXPANEL_TOKEN=<mixpanel_token>

# Stripe
STRIPE_SECRET_KEY=<stripe_secret>
STRIPE_WEBHOOK_SECRET=<webhook_secret>
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=<stripe_public>
```

---

## Rate Limits

```
Free Tier:
  - 50,000 requests/month
  - 500 concurrent requests
  - 50MB database

Pro Tier:
  - 100,000 requests/month
  - 200 concurrent requests
  - 1GB database

Team Tier:
  - 500,000 requests/month
  - 200 concurrent requests
  - 8GB database
```

---

## SDK Examples

### JavaScript/TypeScript

```typescript
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Query
const { data } = await supabase
  .from('scheduled_keywords')
  .select('*')
  .eq('product_id', productId)
  .order('created_at', { ascending: false });

// Insert
const { data } = await supabase
  .from('scheduled_keywords')
  .insert([{ keyword: 'example' }])
  .select();

// Update
const { data } = await supabase
  .from('scheduled_keywords')
  .update({ status: 'published' })
  .eq('id', keywordId);

// Delete
const { error } = await supabase
  .from('scheduled_keywords')
  .delete()
  .eq('id', keywordId);

// Real-time
const channel = supabase
  .channel('keywords')
  .on(
    'postgres_changes',
    {
      event: '*',
      schema: 'public',
      table: 'scheduled_keywords',
    },
    (payload) => console.log(payload)
  )
  .subscribe();
```

### Python

```python
import supabase

client = supabase.create_client(url, key)

# Query
response = client.table('scheduled_keywords')\
    .select('*')\
    .eq('product_id', product_id)\
    .order('created_at', desc=True)\
    .execute()

# Insert
response = client.table('scheduled_keywords')\
    .insert({'keyword': 'example'})\
    .execute()

# Update
response = client.table('scheduled_keywords')\
    .update({'status': 'published'})\
    .eq('id', keyword_id)\
    .execute()

# Delete
response = client.table('scheduled_keywords')\
    .delete()\
    .eq('id', keyword_id)\
    .execute()
```

---

## Quick cURL Templates

```bash
# Variables
API_URL="https://api.outrank.so"
TOKEN="your_access_token"
ANON_KEY="your_anon_key"

# GET Request
curl -X GET "${API_URL}/rest/v1/TABLE?select=*&col=eq.val" \
  -H "Authorization: Bearer ${TOKEN}" \
  -H "apikey: ${ANON_KEY}"

# POST Request
curl -X POST "${API_URL}/rest/v1/TABLE" \
  -H "Authorization: Bearer ${TOKEN}" \
  -H "apikey: ${ANON_KEY}" \
  -H "Content-Type: application/json" \
  -H "Prefer: return=representation" \
  -d '{"col1": "val1", "col2": "val2"}'

# PATCH Request
curl -X PATCH "${API_URL}/rest/v1/TABLE?id=eq.UUID" \
  -H "Authorization: Bearer ${TOKEN}" \
  -H "apikey: ${ANON_KEY}" \
  -H "Content-Type: application/json" \
  -d '{"col": "new_val"}'

# DELETE Request
curl -X DELETE "${API_URL}/rest/v1/TABLE?id=eq.UUID" \
  -H "Authorization: Bearer ${TOKEN}" \
  -H "apikey: ${ANON_KEY}"
```

---

**End of Quick Reference**
