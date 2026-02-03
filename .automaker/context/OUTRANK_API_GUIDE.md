# Outrank.so - API Interaction Guide

**Complete guide to working with Outrank.so's Supabase-backed API**

---

## Table of Contents

1. [Authentication](#authentication)
2. [API Base URLs](#api-base-urls)
3. [PostgREST Query Syntax](#postgrest-query-syntax)
4. [Common API Patterns](#common-api-patterns)
5. [Error Handling](#error-handling)
6. [Rate Limiting](#rate-limiting)
7. [Code Examples](#code-examples)
8. [Webhook Integration](#webhook-integration)

---

## 1. Authentication

### 1.1 Get Auth Token

**Via Supabase Client (JavaScript/TypeScript):**

```javascript
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://api.outrank.so',
  'YOUR_SUPABASE_ANON_KEY'
);

// Sign in
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'password',
});

// Get session token
const token = data.session.access_token;
```

**Via REST API:**

```bash
curl -X POST 'https://api.outrank.so/auth/v1/token?grant_type=password' \
  -H 'Content-Type: application/json' \
  -H 'apikey: YOUR_SUPABASE_ANON_KEY' \
  -d '{
    "email": "user@example.com",
    "password": "password",
    "gotrue_meta_security": {}
  }'
```

**Response:**

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer",
  "expires_in": 3600,
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    ...
  }
}
```

### 1.2 Use Auth Token

All authenticated requests require:

```bash
curl -X GET 'https://api.outrank.so/rest/v1/products' \
  -H 'Authorization: Bearer YOUR_ACCESS_TOKEN' \
  -H 'apikey: YOUR_SUPABASE_ANON_KEY' \
  -H 'Content-Type: application/json'
```

### 1.3 Refresh Token

```bash
curl -X POST 'https://api.outrank.so/auth/v1/token?grant_type=refresh_token' \
  -H 'Content-Type: application/json' \
  -H 'apikey: YOUR_SUPABASE_ANON_KEY' \
  -d '{
    "refresh_token": "YOUR_REFRESH_TOKEN"
  }'
```

---

## 2. API Base URLs

```
Production:  https://api.outrank.so
Frontend:    https://www.outrank.so
Auth:        https://api.outrank.so/auth/v1
REST API:    https://api.outrank.so/rest/v1
Storage:     https://api.outrank.so/storage/v1
```

---

## 3. PostgREST Query Syntax

Outrank.so uses Supabase PostgREST, which provides a powerful query syntax via URL parameters.

### 3.1 Selection (SELECT)

**Select all columns:**

```http
GET /rest/v1/products?select=*
```

**Select specific columns:**

```http
GET /rest/v1/products?select=id,name,website
```

**Select nested relationships:**

```http
GET /rest/v1/products?select=*,organization(name)
```

**Select with rename:**

```http
GET /rest/v1/products?select=id,name:website
```

### 3.2 Filtering (WHERE)

**Equals:**

```http
GET /rest/v1/products?id=eq.01b7e908-19ae-4ba6-830f-6dc2dbc784e6
```

**Not equals:**

```http
GET /rest/v1/scheduled_keywords?created_by_super_admin=neq.true
```

**In list:**

```http
GET /rest/v1/products?status=in.(active,canceled,trialing)
```

**Greater than / Less than:**

```http
GET /rest/v1/articles?word_count=gt.500
GET /rest/v1/scheduled_keywords?difficulty=lte.30
```

**Text search (ILIKE):**

```http
GET /rest/v1/scheduled_keywords?keyword=ilike.*seo*
```

**AND logic (multiple filters):**

```http
GET /rest/v1/products?organization_id=eq.uuid&status=eq.active
```

**OR logic:**

```http
GET /rest/v1/products?or=(status.eq.active,status.eq.trialing)
```

### 3.3 Sorting (ORDER BY)

**Ascending:**

```http
GET /rest/v1/scheduled_keywords?order=created_at.asc
```

**Descending:**

```http
GET /rest/v1/scheduled_keywords?order=created_at.desc
```

**Multiple sorts:**

```http
GET /rest/v1/scheduled_keywords?order=utc_scheduled_date.asc,search_volume.desc
```

**Nulls first/last:**

```http
GET /rest/v1/articles?order=published_at.nullslast
```

### 3.4 Pagination

**Limit rows:**

```http
GET /rest/v1/scheduled_keywords?limit=10
```

**Offset rows:**

```http
GET /rest/v1/scheduled_keywords?limit=10&offset=20
```

**Pagination range (HTTP headers):**

```bash
curl -X GET 'https://api.outrank.so/rest/v1/articles' \
  -H 'Range-Unit: items' \
  -H 'Range: 0-9'
```

### 3.5 Full Text Search

**If using PostgreSQL full-text search:**

```http
GET /rest/v1/articles?select=*&textSearchContent=seo
```

---

## 4. Common API Patterns

### 4.1 CRUD Operations

**Create (POST):**

```bash
curl -X POST 'https://api.outrank.so/rest/v1/scheduled_keywords' \
  -H 'Authorization: Bearer TOKEN' \
  -H 'apikey: ANON_KEY' \
  -H 'Content-Type: application/json' \
  -d '{
    "product_id": "01b7e908-19ae-4ba6-830f-6dc2dbc784e6",
    "keyword": "best seo tools 2024",
    "search_volume": 1000,
    "difficulty": 45,
    "utc_scheduled_date": "2024-01-15T10:00:00Z"
  }'
```

**Read (GET):**

```bash
curl -X GET 'https://api.outrank.so/rest/v1/scheduled_keywords?select=*&product_id=eq.UUID' \
  -H 'Authorization: Bearer TOKEN' \
  -H 'apikey: ANON_KEY'
```

**Update (PATCH):**

```bash
curl -X PATCH 'https://api.outrank.so/rest/v1/scheduled_keywords?id=eq.UUID' \
  -H 'Authorization: Bearer TOKEN' \
  -H 'apikey: ANON_KEY' \
  -H 'Content-Type: application/json' \
  -d '{
    "status": "published"
  }'
```

**Delete (DELETE):**

```bash
curl -X DELETE 'https://api.outrank.so/rest/v1/scheduled_keywords?id=eq.UUID' \
  -H 'Authorization: Bearer TOKEN' \
  -H 'apikey: ANON_KEY'
```

### 4.2 Bulk Operations

**Bulk Insert:**

```bash
curl -X POST 'https://api.outrank.so/rest/v1/scheduled_keywords' \
  -H 'Authorization: Bearer TOKEN' \
  -H 'apikey: ANON_KEY' \
  -H 'Content-Type: application/json' \
  -H 'Prefer: return=representation' \
  -d '[
    {"product_id": "UUID", "keyword": "keyword 1"},
    {"product_id": "UUID", "keyword": "keyword 2"},
    {"product_id": "UUID", "keyword": "keyword 3"}
  ]'
```

**Bulk Update:**

```bash
curl -X PATCH 'https://api.outrank.so/rest/v1/scheduled_keywords?product_id=eq.UUID' \
  -H 'Authorization: Bearer TOKEN' \
  -H 'apikey: ANON_KEY' \
  -H 'Content-Type: application/json' \
  -d '{
    "status": "canceled"
  }'
```

### 4.3 Aggregations

**Count:**

```bash
curl -X GET 'https://api.outrank.so/rest/v1/scheduled_keywords?product_id=eq.UUID&select=*&head=true' \
  -H 'Authorization: Bearer TOKEN' \
  -H 'apikey: ANON_KEY' \
  -H 'Prefer: count=exact'
```

**Response Header:**

```
Content-Range: */25
```

---

## 5. Error Handling

### 5.1 HTTP Status Codes

```
200 OK                  - Success
201 Created             - Resource created
204 No Content          - Success (no response body)
400 Bad Request         - Invalid request
401 Unauthorized        - Missing/invalid auth
403 Forbidden           - Insufficient permissions
404 Not Found           - Resource not found
409 Conflict            - Resource conflict
422 Unprocessable Entity - Validation error
500 Server Error        - Backend error
```

### 5.2 Error Response Format

```json
{
  "code": "PGRST116",
  "details": "Results contain 0 rows",
  "hint": null,
  "message": "JSON object requested, multiple (or no) rows returned"
}
```

### 5.3 Common Errors

**Auth Error:**

```json
{
  "message": "Invalid API key",
  "code": "API_KEY_INVALID"
}
```

**RLS (Row Level Security) Error:**

```json
{
  "code": "42501",
  "details": null,
  "hint": null,
  "message": "new row violates row-level security policy"
}
```

**Validation Error:**

```json
{
  "code": "23505",
  "details": "Key (id)=(abc) already exists.",
  "message": "duplicate key value violates unique constraint"
}
```

### 5.4 Error Handling in Code

**JavaScript:**

```javascript
async function fetchWithRetry(url, options, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url, options);

      if (!response.ok) {
        const error = await response.json();

        // Handle specific errors
        if (response.status === 401) {
          // Refresh token and retry
          await refreshAuthToken();
          continue;
        }

        if (response.status === 409) {
          // Conflict - handle duplicate
          throw new Error('Resource already exists');
        }

        throw new Error(error.message || 'Request failed');
      }

      return await response.json();
    } catch (error) {
      if (i === retries - 1) throw error;
      await sleep(1000 * (i + 1)); // Exponential backoff
    }
  }
}
```

---

## 6. Rate Limiting

### 6.1 Supabase Limits

**Free Tier:**

- 50,000 API requests/month
- 500 concurrent requests
- 50MB database size

**Pro Tier:**

- 100,000 API requests/month
- 200 concurrent requests
- 1GB database size

**Team Tier:**

- 500,000 API requests/month
- 200 concurrent requests
- 8GB database size

### 6.2 Rate Limit Headers

```http
# Response Headers
RateLimit-Limit: 1000
RateLimit-Remaining: 999
RateLimit-Reset: 1640000000
```

### 6.3 Best Practices

```javascript
// Implement exponential backoff
async function rateLimitedFetch(url, options) {
  let retries = 0;
  const maxRetries = 5;

  while (retries < maxRetries) {
    const response = await fetch(url, options);

    if (response.status === 429) {
      // Too Many Requests
      const retryAfter = response.headers.get('Retry-After') || 5;
      await sleep(retryAfter * 1000 * (retries + 1));
      retries++;
      continue;
    }

    return response;
  }

  throw new Error('Max retries exceeded');
}
```

---

## 7. Code Examples

### 7.1 JavaScript/TypeScript (Fetch)

```typescript
interface ScheduledKeyword {
  id: string;
  product_id: string;
  keyword: string;
  search_volume: number;
  difficulty: number;
  utc_scheduled_date: string;
  status: string;
  created_at: string;
}

class OutrankAPI {
  private baseUrl = 'https://api.outrank.so';
  private anonKey = 'YOUR_SUPABASE_ANON_KEY';
  private accessToken: string | null = null;

  async authenticate(email: string, password: string) {
    const response = await fetch(
      `${this.baseUrl}/auth/v1/token?grant_type=password`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          apikey: this.anonKey,
        },
        body: JSON.stringify({ email, password }),
      }
    );

    const data = await response.json();
    this.accessToken = data.access_token;
    return data;
  }

  async getScheduledKeywords(productId: string): Promise<ScheduledKeyword[]> {
    const response = await fetch(
      `${this.baseUrl}/rest/v1/scheduled_keywords?product_id=eq.${productId}&order=utc_scheduled_date.asc`,
      {
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
          apikey: this.anonKey,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }

    return await response.json();
  }

  async createKeyword(keyword: Partial<ScheduledKeyword>) {
    const response = await fetch(`${this.baseUrl}/rest/v1/scheduled_keywords`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
        apikey: this.anonKey,
        'Content-Type': 'application/json',
        Prefer: 'return=representation',
      },
      body: JSON.stringify(keyword),
    });

    return await response.json();
  }

  async updateKeywordStatus(id: string, status: string) {
    const response = await fetch(
      `${this.baseUrl}/rest/v1/scheduled_keywords?id=eq.${id}`,
      {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
          apikey: this.anonKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      }
    );

    return await response.json();
  }
}

// Usage
const api = new OutrankAPI();
await api.authenticate('user@example.com', 'password');
const keywords = await api.getScheduledKeywords('PRODUCT_UUID');
console.log(keywords);
```

### 7.2 Python (requests)

```python
import requests
from typing import List, Optional

class OutrankAPI:
    def __init__(self):
        self.base_url = "https://api.outrank.so"
        self.anon_key = "YOUR_SUPABASE_ANON_KEY"
        self.access_token: Optional[str] = None

    def authenticate(self, email: str, password: str):
        """Authenticate and store access token"""
        response = requests.post(
            f"{self.base_url}/auth/v1/token?grant_type=password",
            headers={
                "Content-Type": "application/json",
                "apikey": self.anon_key
            },
            json={
                "email": email,
                "password": password
            }
        )
        response.raise_for_status()
        data = response.json()
        self.access_token = data["access_token"]
        return data

    def get_headers(self) -> dict:
        """Get request headers with auth"""
        return {
            "Authorization": f"Bearer {self.access_token}",
            "apikey": self.anon_key,
            "Content-Type": "application/json"
        }

    def get_scheduled_keywords(self, product_id: str) -> List[dict]:
        """Get all scheduled keywords for a product"""
        response = requests.get(
            f"{self.base_url}/rest/v1/scheduled_keywords",
            params={
                "product_id": f"eq.{product_id}",
                "order": "utc_scheduled_date.asc"
            },
            headers=self.get_headers()
        )
        response.raise_for_status()
        return response.json()

    def create_keyword(self, keyword_data: dict) -> dict:
        """Create a new scheduled keyword"""
        response = requests.post(
            f"{self.base_url}/rest/v1/scheduled_keywords",
            headers={
                **self.get_headers(),
                "Prefer": "return=representation"
            },
            json=keyword_data
        )
        response.raise_for_status()
        return response.json()

    def update_keyword(self, keyword_id: str, updates: dict) -> dict:
        """Update a keyword"""
        response = requests.patch(
            f"{self.base_url}/rest/v1/scheduled_keywords",
            params={"id": f"eq.{keyword_id}"},
            headers=self.get_headers(),
            json=updates
        )
        response.raise_for_status()
        return response.json()

    def delete_keyword(self, keyword_id: str):
        """Delete a keyword"""
        response = requests.delete(
            f"{self.base_url}/rest/v1/scheduled_keywords",
            params={"id": f"eq.{keyword_id}"},
            headers=self.get_headers()
        )
        response.raise_for_status()
        return response.status_code == 204

# Usage
api = OutrankAPI()
api.authenticate("user@example.com", "password")
keywords = api.get_scheduled_keywords("PRODUCT_UUID")
print(f"Found {len(keywords)} keywords")
```

### 7.3 cURL Examples

```bash
# Set variables
API_URL="https://api.outrank.so"
ANON_KEY="your_anon_key"
ACCESS_TOKEN="your_access_token"
PRODUCT_ID="01b7e908-19ae-4ba6-830f-6dc2dbc784e6"

# Get all products
curl -X GET "${API_URL}/rest/v1/products?select=*&organization_id=eq.UUID" \
  -H "Authorization: Bearer ${ACCESS_TOKEN}" \
  -H "apikey: ${ANON_KEY}"

# Get pending keywords
curl -X GET "${API_URL}/rest/v1/scheduled_keywords?product_id=eq.${PRODUCT_ID}&status=eq.pending&order=created_at.desc&limit=10" \
  -H "Authorization: Bearer ${ACCESS_TOKEN}" \
  -H "apikey: ${ANON_KEY}"

# Create keyword
curl -X POST "${API_URL}/rest/v1/scheduled_keywords" \
  -H "Authorization: Bearer ${ACCESS_TOKEN}" \
  -H "apikey: ${ANON_KEY}" \
  -H "Content-Type: application/json" \
  -H "Prefer: return=representation" \
  -d '{
    "product_id": "'${PRODUCT_ID}'",
    "keyword": "best seo practices 2024",
    "search_volume": 1500,
    "difficulty": 35
  }'

# Update keyword
curl -X PATCH "${API_URL}/rest/v1/scheduled_keywords?id=eq.KEYWORD_UUID" \
  -H "Authorization: Bearer ${ACCESS_TOKEN}" \
  -H "apikey: ${ANON_KEY}" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "published",
    "published_at": "2024-01-15T10:00:00Z"
  }'

# Delete keyword
curl -X DELETE "${API_URL}/rest/v1/scheduled_keywords?id=eq.KEYWORD_UUID" \
  -H "Authorization: Bearer ${ACCESS_TOKEN}" \
  -H "apikey: ${ANON_KEY}"

# Count keywords
curl -X GET "${API_URL}/rest/v1/scheduled_keywords?product_id=eq.${PRODUCT_ID}" \
  -H "Authorization: Bearer ${ACCESS_TOKEN}" \
  -H "apikey: ${ANON_KEY}" \
  -H "Prefer: count=exact"
```

---

## 8. Webhook Integration

While not directly observed in the network traffic, Outrank.so likely uses webhooks for:

### 8.1 Stripe Webhooks (Billing)

```javascript
// Example Next.js API route for handling Stripe webhooks
// /api/webhooks/stripe

export async function POST(request: Request) {
  const payload = await request.text()
  const sig = request.headers.get('stripe-signature')

  let event

  try {
    event = stripe.webhooks.constructEvent(
      payload,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    )
  } catch (err) {
    return Response.json({ error: err.message }, { status: 400 })
  }

  // Handle events
  switch (event.type) {
    case 'checkout.session.completed':
      // Update subscription status
      await updateSubscription(event.data.object)
      break

    case 'invoice.paid':
      // Add credits or extend subscription
      await handlePaymentSuccess(event.data.object)
      break

    case 'customer.subscription.deleted':
      // Cancel subscription
      await cancelSubscription(event.data.object)
      break
  }

  return Response.json({ received: true })
}
```

### 8.2 Custom Webhooks

**Register webhook:**

```bash
curl -X POST 'https://api.outrank.so/rest/v1/webhooks' \
  -H 'Authorization: Bearer TOKEN' \
  -H 'apikey: ANON_KEY' \
  -H 'Content-Type: application/json' \
  -d '{
    "product_id": "UUID",
    "url": "https://your-app.com/webhooks",
    "events": ["article.published", "keyword.scheduled"]
  }'
```

---

## 9. Advanced Patterns

### 9.1 Real-time Subscriptions

```javascript
// Subscribe to keyword changes
const channel = supabase
  .channel('keywords-updates')
  .on(
    'postgres_changes',
    {
      event: '*', // INSERT, UPDATE, DELETE
      schema: 'public',
      table: 'scheduled_keywords',
      filter: 'product_id=eq.UUID',
    },
    (payload) => {
      console.log('Change:', payload);
    }
  )
  .subscribe();
```

### 9.2 Storage API

```javascript
// Upload file (e.g., generated article)
const { data, error } = await supabase.storage
  .from('articles')
  .upload(`${productId}/${articleId}.md`, fileContent);

// Get public URL
const {
  data: { publicUrl },
} = supabase.storage
  .from('articles')
  .getPublicUrl(`${productId}/${articleId}.md`);
```

### 9.3 RPC (Remote Procedure Call)

```javascript
// Call custom PostgreSQL function
const { data, error } = await supabase.rpc('generate_article', {
  p_keyword_id: 'UUID',
  p_preset_id: 'UUID',
});
```

---

## 10. Testing & Debugging

### 10.1 Test with Postman

```json
{
  "name": "Outrank API",
  "request": {
    "auth": {
      "type": "bearer",
      "bearer": [
        {
          "key": "token",
          "value": "{{access_token}}",
          "type": "string"
        }
      ]
    },
    "header": [
      {
        "key": "apikey",
        "value": "{{anon_key}}"
      },
      {
        "key": "Content-Type",
        "value": "application/json"
      }
    ]
  }
}
```

### 10.2 Debug Queries

```javascript
// Enable query logging
supabase = createClient(url, key, {
  db: { schema: 'public' },
  global: {
    headers: { 'x-my-custom-header': 'value' },
    fetch: (...args) => {
      console.log('Supabase fetch:', args);
      return fetch(...args);
    },
  },
});
```

### 10.3 Check Performance

```bash
# Enable query timing
curl -X GET 'https://api.outrank.so/rest/v1/products?select=*' \
  -H 'Prefer: tx=commit' \
  -H 'Authorization: Bearer TOKEN' \
  -v
```

---

## 11. Best Practices

### 11.1 Security

✅ **DO:**

- Store tokens securely (httpOnly cookies or secure storage)
- Use environment variables for API keys
- Validate all input data
- Implement proper RLS policies
- Use HTTPS only

❌ **DON'T:**

- Expose service role key in client code
- Store tokens in localStorage (XSS risk)
- Bypass RLS policies
- Ignore error messages

### 11.2 Performance

✅ **DO:**

- Use specific column selection
- Implement pagination
- Cache frequently accessed data
- Use indexes on foreign keys
- Batch requests when possible

❌ **DON'T:**

- Select all columns unnecessarily
- Fetch huge datasets at once
- Make multiple sequential requests
- Ignore rate limits
- Disable caching

### 11.3 Data Consistency

✅ **DO:**

- Use transactions for multi-table operations
- Implement optimistic locking
- Handle concurrent updates
- Validate business logic
- Use database constraints

❌ **DON'T:**

- Assume requests succeed
- Ignore conflicts
- Skip validation
- Race conditions

---

## 12. Troubleshooting

### Common Issues

**"JWT expired"**

```javascript
// Refresh token automatically
supabase.auth.onAuthStateChange((event, session) => {
  if (event === 'TOKEN_REFRESHED') {
    console.log('Token refreshed', session);
  }
});
```

**"429 Too Many Requests"**

```javascript
// Implement backoff
await new Promise((resolve) => setTimeout(resolve, 2000));
```

**"RLS policy violation"**

```sql
-- Check RLS policies
SELECT * FROM pg_policies WHERE tablename = 'scheduled_keywords';
```

**"Connection timeout"**

```javascript
// Increase timeout
const supabase = createClient(url, key, {
  global: {
    fetch: (url, options) => {
      return fetch(url, { ...options, timeout: 30000 });
    },
  },
});
```

---

**End of API Interaction Guide**
