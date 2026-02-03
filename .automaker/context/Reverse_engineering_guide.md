# Reverse Engineering Guide for Rank.brnd

This guide provides the complete reverse engineering methodology used to analyze the live Outrank.so application. Agents building this clone should reference these techniques when analyzing similar applications.

## Live Application Analysis Techniques

### 1. Navigation & Site Mapping

**Tools Used**: Claude-in-Chrome browser automation

**Methodology**:

1. Navigate to https://www.outrank.so/ while authenticated
2. Systematically click through every navigation element
3. Document all URL patterns and routes discovered
4. Map page hierarchy and relationships
5. Identify authentication requirements per page

**Key Discoveries**:

- 20+ unique pages discovered
- URL pattern: `/dashboard/{feature}` for main features
- URL pattern: `/dashboard/settings/{category}/{subsection}` for settings
- Multi-product architecture with domain-based switching

**For Future RE**: Use this systematic approach to map any SaaS application's navigation structure.

### 2. UI Component Analysis

**Tools Used**: Vision MCP for screenshot analysis, browser DevTools

**Methodology**:

1. Take full-page screenshots of each major section
2. Use Vision MCP to analyze components at pixel level
3. Extract design tokens (colors, spacing, typography)
4. Document component hierarchies and props
5. Map responsive breakpoints

**Key Discoveries**:

- Complete design system documented (colors, typography, spacing)
- 12 major component types with specifications
- Interactive states (hover, focus, active, disabled, loading, error)
- Responsive patterns with breakpoints

**Design Tokens Extracted**:

```css
/* Colors */
--primary:
  #4f46e5 (Indigo-600) --success: #10b981 (Emerald-500) --warning: #f59e0b
    (Amber-500) --error: #ef4444 (Red-500) --info: #3b82f6 (Blue-500)
    /* Typography */ --font-sans: Inter --font-mono: JetBrains Mono
    --scale: 12px,
  13px, 14px, 16px, 18px, 20px, 24px /* Spacing */ --base-unit: 4px --scale: 4,
  8, 12, 16, 24, 32,
  48px /* Shadows */ --subtle: 0 1px 2px rgba(0, 0, 0, 0.05) --medium: 0 4px 6px
    rgba(0, 0, 0, 0.08) --large: 0 10px 15px rgba(0, 0, 0, 0.1);
```

### 3. Feature Discovery & User Journey Mapping

**Tools Used**: Browser automation, systematic testing

**Methodology**:

1. Click every button and link
2. Test all forms and inputs
3. Trigger all modals and dialogs
4. Document complete user workflows
5. Map feature dependencies

**Key Discoveries**:

- 50+ features fully documented
- 30+ user stories with acceptance criteria
- 3 major user journey maps created
- Features categorized by priority (Must/Should/Nice)

**Feature Categories**:

1. **Core Content Features**: Content Planner, Article Management, Settings
2. **SEO & Linking**: Keyword Research, Backlink Exchange, Linking Config
3. **Advanced Features**: Free Tools Builder, Human Curation, Integrations
4. **Account Management**: Team, Billing, Invoices

### 4. API & Backend Analysis

**Tools Used**: Chrome DevTools Network panel, Claude-in-Chrome network monitoring

**Methodology**:

1. Open browser DevTools Network tab
2. Monitor all requests while interacting with features
3. Document endpoints, methods, headers, payloads
4. Capture authentication flow
5. Infer database operations from responses

**Key Discoveries**:

- 25+ API endpoints documented
- Technology stack: Next.js 14+, Supabase, PostgREST
- Authentication: JWT via Supabase Auth
- Database: 13 tables with multi-tenant architecture
- Third-party integrations: 7 services identified

**Technology Stack Identified**:

```yaml
Frontend:
  Framework: Next.js 14+ (React Server Components)
  Styling: Tailwind CSS
  State: React Context + Server Components

Backend:
  Database: Supabase (PostgreSQL)
  API: PostgREST (auto-generated REST)
  Auth: Supabase Auth (JWT)

Infrastructure:
  Hosting: Vercel
  Storage: AWS
  Analytics: PostHog, Mixpanel, GA4
```

### 5. Database Schema Inference

**Tools Used**: API response analysis, UI inspection

**Methodology**:

1. Analyze list/detail views to identify entities
2. Study form fields to understand properties
3. Examine filter/sort options for metadata
4. Map relationships from data displays
5. Document CRUD operations

**Key Discoveries**:

- 13 database tables fully specified
- Multi-tenant architecture with Organization → Products → Resources
- Row Level Security (RLS) implemented
- Complete entity relationships documented

**Core Entities**:

```
Organization (multi-tenant root)
├── Products (websites being optimized)
│   ├── Keywords (target search terms)
│   ├── Articles (AI-generated content)
│   ├── Backlinks (exchange marketplace)
│   └── Integrations (CMS connections)
└── Subscription (billing management)
```

### 6. Content & Data Structure Analysis

**Tools Used**: API response inspection, UI component analysis

**Methodology**:

1. Capture actual API responses for each resource
2. Document JSON schemas
3. Infer validation rules from UI constraints
4. Map business logic from observable behavior
5. Identify state management patterns

**Key Discoveries**:

- Complete TypeScript interfaces for all entities
- SEO scoring algorithm reverse-engineered
- Keyword research automation logic documented
- Backlink quality assessment formula identified
- Content generation pipeline mapped

**Business Logic Discovered**:

- **SEO Scoring**: Keyword density, readability, length, heading structure
- **Keyword Research**: Search volume, difficulty, competition analysis
- **Backlink Exchange**: Credit-based system with domain authority matching
- **Content Generation**: GPT-4 based with brand voice learning

### 7. Competitive Intelligence

**Tools Used**: Exa MCP web search, market research

**Methodology**:

1. Research major SEO platform competitors
2. Analyze feature gaps and opportunities
3. Identify market trends for 2025
4. Document pricing models
5. Find technical implementation examples

**Key Discoveries**:

- 15+ competitors analyzed
- Market shifting to AI agents and GEO optimization
- Outrank.so positioned as "all-in-one automation"
- Pricing gap: $99/mo vs. market average $140-200/mo
- No competitor has full autonomous agent orchestration

**Market Trends for 2025**:

1. **GEO (Generative Engine Optimization)** - Optimizing for AI answers
2. **Autonomous AI Agents** - End-to-end workflow execution
3. **AEO (Answer Engine Optimization)** - Voice/AI assistant optimization
4. **Video SEO** - Short-form content prioritization
5. **Social-Search Integration** - Social posts in SERPs

## Security Considerations

### Identified Vulnerabilities

**⚠️ WARNING** - Security Issue Found in Outrank.so:

- JWT tokens stored in localStorage (XSS vulnerable)
- **Recommendation**: Use httpOnly cookies instead

### Best Practices for Clone Implementation

```typescript
// ❌ DON'T DO THIS (What Outrank.so does)
localStorage.setItem('token', jwt);

// ✅ DO THIS (Secure approach)
// Set httpOnly cookie via server
response.cookies.set('token', jwt, {
  httpOnly: true,
  secure: true,
  sameSite: 'strict',
  path: '/',
});
```

## Data Architecture Patterns

### Multi-Tenancy Model

Outrank.so uses **organization-based multi-tenancy**:

```sql
-- All tables reference organization
CREATE TABLE products (
  id UUID PRIMARY KEY,
  organization_id UUID REFERENCES organizations(id),
  name TEXT,
  domain_url TEXT,
  created_at TIMESTAMPTZ
);

-- Row Level Security
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

CREATE POLICY tenant_isolation ON products
  USING (organization_id = current_setting('app.organization_id')::UUID);
```

### State Management Approach

**Client State**:

- User session, UI preferences, form data
- Stored in React Context or Zustand

**Server State**:

- All content data (articles, keywords, backlinks)
- Fetched via API, cached with React Query/SWR

**Real-time Updates**:

- Websockets for live collaboration (if implemented)
- Polling as fallback

## API Integration Patterns

### Third-Party Services

**Content Generation APIs**:

- OpenAI GPT-4 (primary)
- Anthropic Claude (alternative)
- DALL-E 3 (image generation)

**SEO Data APIs**:

- DataForSEO (keywords, rankings)
- SerpAPI or SerpStack (SERP analysis)
- Ahrefs API (backlink data, optional)

**CMS Integrations**:

- WordPress REST API
- Webflow API
- Shopify API
- Notion API
- 11+ other platforms

## Performance Optimization Strategies

### Caching Strategy

```
1. Client-side: React Query with 5-minute stale time
2. Server-side: Vercel Edge Config for static assets
3. Database: Supabase materialized views for analytics
4. API: Response caching with 1-minute TTL for lists
```

### Load Optimization

```
1. Code splitting by route
2. Lazy loading for heavy components
3. Image optimization (Next.js Image component)
4. Font optimization (next/font)
5. Bundle size monitoring
```

## Tools & Technologies Summary

### For Reverse Engineering

| Tool                 | Purpose                       | Cost                  |
| -------------------- | ----------------------------- | --------------------- |
| **Claude-in-Chrome** | Browser automation            | Free (with extension) |
| **Vision MCP**       | Screenshot analysis           | Free                  |
| **Chrome DevTools**  | Network, component inspection | Built-in              |
| **Exa MCP**          | Web research                  | Free tier available   |
| **Postman**          | API testing                   | Free tier available   |

### For Building the Clone

| Tool             | Purpose            | Why This Choice                        |
| ---------------- | ------------------ | -------------------------------------- |
| **Next.js 14**   | Frontend framework | RSC, great DX, Vercel integration      |
| **PostgreSQL**   | Database           | Robust, ACID compliant, great for SaaS |
| **Drizzle ORM**  | Database toolkit   | Type-safe, fast, lightweight           |
| **Supabase**     | Backend platform   | Auth, storage, real-time built-in      |
| **Tailwind CSS** | Styling            | Rapid development, consistent design   |
| **shadcn/ui**    | Component library  | Accessible, customizable, modern       |
| **Clerk**        | Authentication     | Drop-in auth, multiple providers       |
| **Stripe**       | Payments           | Industry standard, flexible            |

## Best Practices for Implementation

### 1. Start with Authentication

- Implement Clerk or Supabase Auth first
- Set up RLS policies immediately
- Test user session management
- Secure all API routes

### 2. Build Core Entities First

- Organizations → Products → Resources hierarchy
- Get CRUD working for one entity (e.g., Articles)
- Pattern can be replicated for others

### 3. Implement API Layer

- Use tRPC or Next.js Route Handlers
- TypeScript for type safety
- Zod for runtime validation
- OpenAPI spec for documentation

### 4. UI Component Library

- Build from shadcn/ui base
- Customize with design tokens
- Document component props
- Storybook for component development

### 5. Testing Strategy

- Unit tests for business logic
- Integration tests for API
- E2E tests with Playwright
- Visual regression tests

## Key Learnings from Outrank.so Analysis

### What Works Well

✅ **All-in-one automation** - True end-to-end workflow
✅ **Backlink exchange** - Unique community-based approach
✅ **Brand voice learning** - Adapts to user's content
✅ **Multi-platform publishing** - 15+ CMS integrations

### What Could Be Better

⚠️ **Security** - localStorage JWT storage (vulnerable)
⚠️ **Price** - $99/mo is high for entry
⚠️ **Quality consistency** - Occasional factual errors
⚠️ **Real-time scoring** - Missing content scoring during editing
⚠️ **Team collaboration** - Limited features for agencies

### Opportunities for Improvement

🚀 **AI agent orchestration** - No competitor has fully autonomous workflows
🚀 **GEO optimization** - Early mover advantage for AI search
🚀 **Lower price point** - $29-49/mo could capture market
🚀 **Quality assurance** - Fact-checking layer could differentiate
🚀 **Developer API** - No public API (enterprise opportunity)

---

**Document Version**: 1.0
**Last Updated**: January 2, 2026
**Analysis Based On**: Live Outrank.so application (logged-in state)
**Research Methods**: Browser automation, network analysis, UI inspection, competitive intelligence

This guide provides everything needed to understand how Outrank.so works and how to build a competitive clone with modern best practices.
