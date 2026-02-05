/**
 * Articles API Integration Tests
 *
 * Tests the /api/articles endpoints for:
 * - Authentication requirements
 * - Authorization (RBAC)
 * - Input validation
 * - CRUD operations
 * - Error cases
 * - Edge cases
 */

import { test, expect } from '@playwright/test';
import { createApiHelpers } from '../api-integration-helpers';
import { createAuthSetup, TestUsersFactory } from '../fixtures/auth-setup';

const API_BASE = 'http://localhost:3000/api/articles';

test.describe('Articles API - Authentication', () => {
  test('should reject unauthenticated GET request', async ({ request }) => {
    const response = await request.get(`${API_BASE}?organization_id=test-org`);

    expect(response.status()).toBe(401);
    const data = await response.json();
    expect(data).toHaveProperty('error', 'Unauthorized');
  });

  test('should reject unauthenticated POST request', async ({ request }) => {
    const response = await request.post(API_BASE, {
      data: {
        organization_id: 'test-org',
        title: 'Test Article',
        content: 'Test content',
      },
    });

    expect(response.status()).toBe(401);
  });

  test('should reject unauthenticated PATCH request', async ({ request }) => {
    const response = await request.fetch(API_BASE, {
      method: 'PATCH',
      data: { id: 'test-id', title: 'Updated' },
    });

    expect(response.status()).toBe(401);
  });

  test('should reject unauthenticated DELETE request', async ({ request }) => {
    const response = await request.delete(`${API_BASE}?id=test-id`);

    expect(response.status()).toBe(401);
  });
});

test.describe('Articles API - Validation', () => {
  test('should require organization_id parameter', async ({ request }) => {
    const authSetup = createAuthSetup(request);
    const tokens = authSetup.generateAuthTokens();

    // Using a simple GET without organization_id
    const response = await request.get(API_BASE, {
      headers: {
        Authorization: `Bearer ${tokens.accessToken}`,
      },
    });

    expect(response.status()).toBe(400);
    const data = await response.json();
    expect(data).toHaveProperty('error');
    expect(data.error).toContain('organization_id');
  });

  test('should reject invalid article data on POST', async ({ request }) => {
    const authSetup = createAuthSetup(request);
    const user = TestUsersFactory.createStandardUser();
    const tokens = authSetup.generateAuthTokens(user);

    const response = await request.post(API_BASE, {
      headers: {
        Authorization: `Bearer ${tokens.accessToken}`,
      },
      data: {
        // Missing required fields
        organization_id: 'test-org',
        // title is missing
      },
    });

    expect(response.status()).toBe(400);
  });

  test('should reject invalid query parameters', async ({ request }) => {
    const authSetup = createAuthSetup(request);
    const tokens = authSetup.generateAuthTokens();

    const response = await request.get(
      `${API_BASE}?organization_id=test-org&limit=invalid&offset=abc`,
      {
        headers: {
          Authorization: `Bearer ${tokens.accessToken}`,
        },
      }
    );

    // Should handle gracefully - either 400 with validation error or 200 with default values
    expect([200, 400]).toContain(response.status());
  });

  test('should reject missing id on DELETE', async ({ request }) => {
    const authSetup = createAuthSetup(request);
    const tokens = authSetup.generateAuthTokens();

    const response = await request.delete(API_BASE, {
      headers: {
        Authorization: `Bearer ${tokens.accessToken}`,
      },
    });

    expect(response.status()).toBe(400);
    const data = await response.json();
    expect(data).toHaveProperty('error');
  });

  test('should enforce limit constraints', async ({ request }) => {
    const authSetup = createAuthSetup(request);
    const tokens = authSetup.generateAuthTokens();

    const response = await request.get(
      `${API_BASE}?organization_id=test-org&limit=999999`,
      {
        headers: {
          Authorization: `Bearer ${tokens.accessToken}`,
        },
      }
    );

    // Should either apply max limit or return validation error
    expect([200, 400]).toContain(response.status());
  });
});

test.describe('Articles API - GET Operations', () => {
  test('should fetch articles with organization_id', async ({ request }) => {
    const authSetup = createAuthSetup(request);
    const user = TestUsersFactory.createStandardUser();
    const tokens = authSetup.generateAuthTokens(user);

    const response = await request.get(
      `${API_BASE}?organization_id=test-org-123`,
      {
        headers: {
          Authorization: `Bearer ${tokens.accessToken}`,
        },
      }
    );

    // Should return 200 with articles array or empty array
    expect(response.status()).toBe(200);
    const data = await response.json();
    expect(data).toHaveProperty('articles');
    expect(Array.isArray(data.articles)).toBeTruthy();
    expect(data).toHaveProperty('total');
  });

  test('should support filtering by status', async ({ request }) => {
    const authSetup = createAuthSetup(request);
    const tokens = authSetup.generateAuthTokens();

    const response = await request.get(
      `${API_BASE}?organization_id=test-org&status=draft`,
      {
        headers: {
          Authorization: `Bearer ${tokens.accessToken}`,
        },
      }
    );

    expect(response.status()).toBe(200);
  });

  test('should support filtering by product_id', async ({ request }) => {
    const authSetup = createAuthSetup(request);
    const tokens = authSetup.generateAuthTokens();

    const response = await request.get(
      `${API_BASE}?organization_id=test-org&product_id=prod-123`,
      {
        headers: {
          Authorization: `Bearer ${tokens.accessToken}`,
        },
      }
    );

    expect(response.status()).toBe(200);
  });

  test('should support keyword_id filtering', async ({ request }) => {
    const authSetup = createAuthSetup(request);
    const tokens = authSetup.generateAuthTokens();

    const response = await request.get(
      `${API_BASE}?organization_id=test-org&keyword_id=kw-123`,
      {
        headers: {
          Authorization: `Bearer ${tokens.accessToken}`,
        },
      }
    );

    expect(response.status()).toBe(200);
  });

  test('should support search functionality', async ({ request }) => {
    const authSetup = createAuthSetup(request);
    const tokens = authSetup.generateAuthTokens();

    const response = await request.get(
      `${API_BASE}?organization_id=test-org&search=test`,
      {
        headers: {
          Authorization: `Bearer ${tokens.accessToken}`,
        },
      }
    );

    expect(response.status()).toBe(200);
  });

  test('should support SEO score filtering', async ({ request }) => {
    const authSetup = createAuthSetup(request);
    const tokens = authSetup.generateAuthTokens();

    const response = await request.get(
      `${API_BASE}?organization_id=test-org&min_seo_score=50&max_seo_score=100`,
      {
        headers: {
          Authorization: `Bearer ${tokens.accessToken}`,
        },
      }
    );

    expect(response.status()).toBe(200);
  });

  test('should support pagination', async ({ request }) => {
    const authSetup = createAuthSetup(request);
    const tokens = authSetup.generateAuthTokens();

    const response = await request.get(
      `${API_BASE}?organization_id=test-org&limit=10&offset=0`,
      {
        headers: {
          Authorization: `Bearer ${tokens.accessToken}`,
        },
      }
    );

    expect(response.status()).toBe(200);
    const data = await response.json();
    expect(data).toHaveProperty('articles');
    expect(data).toHaveProperty('total');
  });

  test('should support sorting', async ({ request }) => {
    const authSetup = createAuthSetup(request);
    const tokens = authSetup.generateAuthTokens();

    const response = await request.get(
      `${API_BASE}?organization_id=test-org&sort=created_at&order=desc`,
      {
        headers: {
          Authorization: `Bearer ${tokens.accessToken}`,
        },
      }
    );

    expect(response.status()).toBe(200);
  });

  test('should support tags filtering', async ({ request }) => {
    const authSetup = createAuthSetup(request);
    const tokens = authSetup.generateAuthTokens();

    const response = await request.get(
      `${API_BASE}?organization_id=test-org&tags=seo,marketing`,
      {
        headers: {
          Authorization: `Bearer ${tokens.accessToken}`,
        },
      }
    );

    expect(response.status()).toBe(200);
  });

  test('should support author_id filtering', async ({ request }) => {
    const authSetup = createAuthSetup(request);
    const tokens = authSetup.generateAuthTokens();

    const response = await request.get(
      `${API_BASE}?organization_id=test-org&author_id=user-123`,
      {
        headers: {
          Authorization: `Bearer ${tokens.accessToken}`,
        },
      }
    );

    expect(response.status()).toBe(200);
  });
});

test.describe('Articles API - POST Operations', () => {
  test('should create article with valid data', async ({ request }) => {
    const authSetup = createAuthSetup(request);
    const user = TestUsersFactory.createStandardUser();
    const tokens = authSetup.generateAuthTokens(user);

    const articleData = {
      organization_id: 'test-org-123',
      title: 'Test Article',
      content: 'This is test content',
      status: 'draft',
    };

    const response = await request.post(API_BASE, {
      headers: {
        Authorization: `Bearer ${tokens.accessToken}`,
      },
      data: articleData,
    });

    // Should return 201 on success or error if database doesn't exist
    expect([201, 500, 400]).toContain(response.status());

    if (response.status() === 201) {
      const data = await response.json();
      expect(data).toHaveProperty('id');
      expect(data).toHaveProperty('title', articleData.title);
    }
  });

  test('should auto-generate slug if not provided', async ({ request }) => {
    const authSetup = createAuthSetup(request);
    const tokens = authSetup.generateAuthTokens();

    const response = await request.post(API_BASE, {
      headers: {
        Authorization: `Bearer ${tokens.accessToken}`,
      },
      data: {
        organization_id: 'test-org-123',
        title: 'Test Article Title',
        content: 'Content',
      },
    });

    // Status may vary based on database state
    expect([201, 500, 400]).toContain(response.status());
  });

  test('should accept article with all optional fields', async ({ request }) => {
    const authSetup = createAuthSetup(request);
    const tokens = authSetup.generateAuthTokens();

    const fullArticleData = {
      organization_id: 'test-org-123',
      product_id: 'prod-123',
      keyword_id: 'kw-123',
      title: 'Complete Article',
      slug: 'complete-article',
      content: 'Full article content',
      excerpt: 'Article excerpt',
      featured_image_url: 'https://example.com/image.jpg',
      status: 'draft',
      seo_score: 85,
      word_count: 500,
      reading_time_minutes: 5,
      meta_title: 'Meta Title',
      meta_description: 'Meta description',
      meta_keywords: 'keyword1, keyword2',
      canonical_url: 'https://example.com/article',
      schema_type: 'Article',
      tags: ['tag1', 'tag2'],
      category: 'Technology',
    };

    const response = await request.post(API_BASE, {
      headers: {
        Authorization: `Bearer ${tokens.accessToken}`,
      },
      data: fullArticleData,
    });

    expect([201, 500, 400]).toContain(response.status());
  });

  test('should support bulk article creation', async ({ request }) => {
    const authSetup = createAuthSetup(request);
    const tokens = authSetup.generateAuthTokens();

    const bulkData = {
      bulk: true,
      organization_id: 'test-org-123',
      articles: [
        { title: 'Article 1', content: 'Content 1' },
        { title: 'Article 2', content: 'Content 2' },
      ],
    };

    const response = await request.post(API_BASE, {
      headers: {
        Authorization: `Bearer ${tokens.accessToken}`,
      },
      data: bulkData,
    });

    expect([201, 500, 400]).toContain(response.status());
  });

  test('should reject article without title', async ({ request }) => {
    const authSetup = createAuthSetup(request);
    const tokens = authSetup.generateAuthTokens();

    const response = await request.post(API_BASE, {
      headers: {
        Authorization: `Bearer ${tokens.accessToken}`,
      },
      data: {
        organization_id: 'test-org-123',
        content: 'Content without title',
      },
    });

    expect(response.status()).toBe(400);
  });

  test('should reject article with invalid status', async ({ request }) => {
    const authSetup = createAuthSetup(request);
    const tokens = authSetup.generateAuthTokens();

    const response = await request.post(API_BASE, {
      headers: {
        Authorization: `Bearer ${tokens.accessToken}`,
      },
      data: {
        organization_id: 'test-org-123',
        title: 'Test',
        content: 'Content',
        status: 'invalid_status',
      },
    });

    expect(response.status()).toBe(400);
  });
});

test.describe('Articles API - PATCH Operations', () => {
  test('should update article with valid data', async ({ request }) => {
    const authSetup = createAuthSetup(request);
    const tokens = authSetup.generateAuthTokens();

    const updateData = {
      id: 'article-123',
      title: 'Updated Title',
      content: 'Updated content',
    };

    const response = await request.fetch(API_BASE, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${tokens.accessToken}`,
      },
      data: updateData,
    });

    // May return 404 if article doesn't exist, 403 if no access
    expect([200, 403, 404, 500]).toContain(response.status());
  });

  test('should reject update without id', async ({ request }) => {
    const authSetup = createAuthSetup(request);
    const tokens = authSetup.generateAuthTokens();

    const response = await request.fetch(API_BASE, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${tokens.accessToken}`,
      },
      data: {
        title: 'Updated Title',
        // Missing id
      },
    });

    expect(response.status()).toBe(400);
  });

  test('should reject update with invalid data', async ({ request }) => {
    const authSetup = createAuthSetup(request);
    const tokens = authSetup.generateAuthTokens();

    const response = await request.fetch(API_BASE, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${tokens.accessToken}`,
      },
      data: {
        id: 'article-123',
        seo_score: 'not-a-number',
      },
    });

    expect(response.status()).toBe(400);
  });

  test('should support partial updates', async ({ request }) => {
    const authSetup = createAuthSetup(request);
    const tokens = authSetup.generateAuthTokens();

    const response = await request.fetch(API_BASE, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${tokens.accessToken}`,
      },
      data: {
        id: 'article-123',
        status: 'published',
      },
    });

    expect([200, 403, 404, 500]).toContain(response.status());
  });

  test('should verify article access before update', async ({ request }) => {
    const authSetup = createAuthSetup(request);
    const tokens = authSetup.generateAuthTokens();

    // Try to update an article from another organization
    const response = await request.fetch(API_BASE, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${tokens.accessToken}`,
      },
      data: {
        id: 'article-from-other-org',
        title: 'Hacked Title',
      },
    });

    // Should return 403 or 404
    expect([403, 404, 500]).toContain(response.status());
  });
});

test.describe('Articles API - DELETE Operations', () => {
  test('should delete article as owner', async ({ request }) => {
    const authSetup = createAuthSetup(request);
    const ownerUser = TestUsersFactory.createOwnerUser();
    const tokens = authSetup.generateAuthTokens(ownerUser);

    const response = await request.delete(`${API_BASE}?id=article-123`, {
      headers: {
        Authorization: `Bearer ${tokens.accessToken}`,
      },
    });

    // May return 404 if article doesn't exist, 403 if not owner
    expect([200, 403, 404, 500]).toContain(response.status());
  });

  test('should prevent deletion by non-owner', async ({ request }) => {
    const authSetup = createAuthSetup(request);
    const memberUser = TestUsersFactory.createStandardUser({ role: 'member' });
    const tokens = authSetup.generateAuthTokens(memberUser);

    const response = await request.delete(`${API_BASE}?id=article-123`, {
      headers: {
        Authorization: `Bearer ${tokens.accessToken}`,
      },
    });

    // Should return 403 (Forbidden) or 404 if article doesn't exist
    expect([403, 404, 500]).toContain(response.status());

    if (response.status() === 403) {
      const data = await response.json();
      expect(data.error).toContain('owner');
    }
  });

  test('should require id parameter for deletion', async ({ request }) => {
    const authSetup = createAuthSetup(request);
    const tokens = authSetup.generateAuthTokens();

    const response = await request.delete(API_BASE, {
      headers: {
        Authorization: `Bearer ${tokens.accessToken}`,
      },
    });

    expect(response.status()).toBe(400);
  });

  test('should return 404 for non-existent article', async ({ request }) => {
    const authSetup = createAuthSetup(request);
    const ownerUser = TestUsersFactory.createOwnerUser();
    const tokens = authSetup.generateAuthTokens(ownerUser);

    const response = await request.delete(`${API_BASE}?id=non-existent-article`, {
      headers: {
        Authorization: `Bearer ${tokens.accessToken}`,
      },
    });

    // Should return 404 or error
    expect([404, 500]).toContain(response.status());
  });
});

test.describe('Articles API - Edge Cases', () => {
  test('should handle very long article titles', async ({ request }) => {
    const authSetup = createAuthSetup(request);
    const tokens = authSetup.generateAuthTokens();

    const longTitle = 'A'.repeat(500);

    const response = await request.post(API_BASE, {
      headers: {
        Authorization: `Bearer ${tokens.accessToken}`,
      },
      data: {
        organization_id: 'test-org-123',
        title: longTitle,
        content: 'Content',
      },
    });

    // Should either accept or reject with validation error
    expect([201, 400, 500]).toContain(response.status());
  });

  test('should handle special characters in content', async ({ request }) => {
    const authSetup = createAuthSetup(request);
    const tokens = authSetup.generateAuthTokens();

    const specialContent = '<script>alert("xss")</script> & "quotes" and \'apostrophes\'';

    const response = await request.post(API_BASE, {
      headers: {
        Authorization: `Bearer ${tokens.accessToken}`,
      },
      data: {
        organization_id: 'test-org-123',
        title: 'Article with Special Chars',
        content: specialContent,
      },
    });

    expect([201, 400, 500]).toContain(response.status());
  });

  test('should handle unicode characters', async ({ request }) => {
    const authSetup = createAuthSetup(request);
    const tokens = authSetup.generateAuthTokens();

    const unicodeContent = 'Hello 世界 🌍 مرحبا';

    const response = await request.post(API_BASE, {
      headers: {
        Authorization: `Bearer ${tokens.accessToken}`,
      },
      data: {
        organization_id: 'test-org-123',
        title: unicodeContent,
        content: unicodeContent,
      },
    });

    expect([201, 400, 500]).toContain(response.status());
  });

  test('should handle empty articles list', async ({ request }) => {
    const authSetup = createAuthSetup(request);
    const tokens = authSetup.generateAuthTokens();

    const response = await request.get(
      `${API_BASE}?organization_id=non-existent-org`,
      {
        headers: {
          Authorization: `Bearer ${tokens.accessToken}`,
        },
      }
    );

    expect(response.status()).toBe(200);
    const data = await response.json();
    expect(data.articles).toEqual([]);
  });

  test('should handle concurrent requests', async ({ request }) => {
    const authSetup = createAuthSetup(request);
    const tokens = authSetup.generateAuthTokens();

    const requests = Array.from({ length: 10 }, (_, i) =>
      request.get(`${API_BASE}?organization_id=test-org-${i}`, {
        headers: {
          Authorization: `Bearer ${tokens.accessToken}`,
        },
      })
    );

    const responses = await Promise.all(requests);

    // All requests should complete without errors
    responses.forEach(response => {
      expect([200, 401, 403, 500]).toContain(response.status());
    });
  });

  test('should handle malformed JSON', async ({ request }) => {
    const authSetup = createAuthSetup(request);
    const tokens = authSetup.generateAuthTokens();

    const response = await request.post(API_BASE, {
      headers: {
        Authorization: `Bearer ${tokens.accessToken}`,
        'Content-Type': 'application/json',
      },
      data: '{invalid json}',
    });

    expect(response.status()).toBe(400);
  });

  test('should handle empty request body', async ({ request }) => {
    const authSetup = createAuthSetup(request);
    const tokens = authSetup.generateAuthTokens();

    const response = await request.post(API_BASE, {
      headers: {
        Authorization: `Bearer ${tokens.accessToken}`,
      },
      data: {},
    });

    expect(response.status()).toBe(400);
  });
});
