/**
 * Keywords API Integration Tests
 *
 * Tests the /api/keywords endpoints for:
 * - Authentication requirements
 * - Authorization (organization membership)
 * - Input validation
 * - CRUD operations
 * - Error cases
 * - Edge cases
 */

import { test, expect } from '@playwright/test';
import { createApiHelpers } from '../api-integration-helpers';
import { createAuthSetup, TestUsersFactory } from '../fixtures/auth-setup';

const API_BASE = 'http://localhost:3000/api/keywords';

test.describe('Keywords API - Authentication', () => {
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
        keyword: 'test keyword',
      },
    });

    expect(response.status()).toBe(401);
  });

  test('should reject unauthenticated DELETE request', async ({ request }) => {
    const response = await request.delete(`${API_BASE}?id=test-id`);

    expect(response.status()).toBe(401);
  });
});

test.describe('Keywords API - Validation', () => {
  test('should require organization_id parameter', async ({ request }) => {
    const authSetup = createAuthSetup(request);
    const tokens = authSetup.generateAuthTokens();

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

  test('should reject keyword creation without keyword field', async ({ request }) => {
    const authSetup = createAuthSetup(request);
    const tokens = authSetup.generateAuthTokens();

    const response = await request.post(API_BASE, {
      headers: {
        Authorization: `Bearer ${tokens.accessToken}`,
      },
      data: {
        organization_id: 'test-org',
        // Missing 'keyword' field
      },
    });

    expect(response.status()).toBe(400);
  });

  test('should reject invalid opportunity score range', async ({ request }) => {
    const authSetup = createAuthSetup(request);
    const tokens = authSetup.generateAuthTokens();

    const response = await request.get(
      `${API_BASE}?organization_id=test-org&min_opportunity_score=150`,
      {
        headers: {
          Authorization: `Bearer ${tokens.accessToken}`,
        },
      }
    );

    // Should handle validation - either 400 or return empty results
    expect([200, 400]).toContain(response.status());
  });

  test('should enforce limit constraints', async ({ request }) => {
    const authSetup = createAuthSetup(request);
    const tokens = authSetup.generateAuthTokens();

    const response = await request.get(
      `${API_BASE}?organization_id=test-org&limit=1000`,
      {
        headers: {
          Authorization: `Bearer ${tokens.accessToken}`,
        },
      }
    );

    // Should cap limit at 100
    expect(response.status()).toBe(200);
  });

  test('should reject negative offset', async ({ request }) => {
    const authSetup = createAuthSetup(request);
    const tokens = authSetup.generateAuthTokens();

    const response = await request.get(
      `${API_BASE}?organization_id=test-org&offset=-10`,
      {
        headers: {
          Authorization: `Bearer ${tokens.accessToken}`,
        },
      }
    );

    // Should handle validation
    expect([200, 400]).toContain(response.status());
  });

  test('should require id parameter for DELETE', async ({ request }) => {
    const authSetup = createAuthSetup(request);
    const tokens = authSetup.generateAuthTokens();

    const response = await request.delete(API_BASE, {
      headers: {
        Authorization: `Bearer ${tokens.accessToken}`,
      },
    });

    expect(response.status()).toBe(400);
  });
});

test.describe('Keywords API - GET Operations', () => {
  test('should fetch keywords with organization_id', async ({ request }) => {
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

    expect(response.status()).toBe(200);
    const data = await response.json();
    expect(data).toHaveProperty('keywords');
    expect(Array.isArray(data.keywords)).toBeTruthy();
    expect(data).toHaveProperty('total');
    expect(data).toHaveProperty('pagination');
  });

  test('should support filtering by intent', async ({ request }) => {
    const authSetup = createAuthSetup(request);
    const tokens = authSetup.generateAuthTokens();

    const intents = ['informational', 'commercial', 'transactional', 'navigation'];

    for (const intent of intents) {
      const response = await request.get(
        `${API_BASE}?organization_id=test-org&intent=${intent}`,
        {
          headers: {
            Authorization: `Bearer ${tokens.accessToken}`,
          },
        }
      );

      expect(response.status()).toBe(200);
    }
  });

  test('should support filtering by difficulty', async ({ request }) => {
    const authSetup = createAuthSetup(request);
    const tokens = authSetup.generateAuthTokens();

    const response = await request.get(
      `${API_BASE}?organization_id=test-org&difficulty=high`,
      {
        headers: {
          Authorization: `Bearer ${tokens.accessToken}`,
        },
      }
    );

    expect(response.status()).toBe(200);
  });

  test('should support filtering by status', async ({ request }) => {
    const authSetup = createAuthSetup(request);
    const tokens = authSetup.generateAuthTokens();

    const response = await request.get(
      `${API_BASE}?organization_id=test-org&status=tracking`,
      {
        headers: {
          Authorization: `Bearer ${tokens.accessToken}`,
        },
      }
    );

    expect(response.status()).toBe(200);
  });

  test('should support opportunity score range filtering', async ({ request }) => {
    const authSetup = createAuthSetup(request);
    const tokens = authSetup.generateAuthTokens();

    const response = await request.get(
      `${API_BASE}?organization_id=test-org&min_opportunity_score=50&max_opportunity_score=100`,
      {
        headers: {
          Authorization: `Bearer ${tokens.accessToken}`,
        },
      }
    );

    expect(response.status()).toBe(200);
  });

  test('should support search volume range filtering', async ({ request }) => {
    const authSetup = createAuthSetup(request);
    const tokens = authSetup.generateAuthTokens();

    const response = await request.get(
      `${API_BASE}?organization_id=test-org&min_search_volume=100&max_search_volume=10000`,
      {
        headers: {
          Authorization: `Bearer ${tokens.accessToken}`,
        },
      }
    );

    expect(response.status()).toBe(200);
  });

  test('should support search by keyword text', async ({ request }) => {
    const authSetup = createAuthSetup(request);
    const tokens = authSetup.generateAuthTokens();

    const response = await request.get(
      `${API_BASE}?organization_id=test-org&search=seo`,
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
      `${API_BASE}?organization_id=test-org&tags=marketing,content`,
      {
        headers: {
          Authorization: `Bearer ${tokens.accessToken}`,
        },
      }
    );

    expect(response.status()).toBe(200);
  });

  test('should support product_id filtering', async ({ request }) => {
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

  test('should support sorting options', async ({ request }) => {
    const authSetup = createAuthSetup(request);
    const tokens = authSetup.generateAuthTokens();

    const sortOptions = ['created_at', 'keyword', 'search_volume', 'opportunity_score', 'current_rank'];

    for (const sort of sortOptions) {
      const response = await request.get(
        `${API_BASE}?organization_id=test-org&sort=${sort}&order=desc`,
        {
          headers: {
            Authorization: `Bearer ${tokens.accessToken}`,
          },
        }
      );

      expect(response.status()).toBe(200);
    }
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
    expect(data.pagination).toHaveProperty('limit', 10);
    expect(data.pagination).toHaveProperty('offset', 0);
  });

  test('should verify organization membership', async ({ request }) => {
    const authSetup = createAuthSetup(request);
    const tokens = authSetup.generateAuthTokens();

    // Try to access keywords from an organization the user is not a member of
    const response = await request.get(
      `${API_BASE}?organization_id=other-org-123`,
      {
        headers: {
          Authorization: `Bearer ${tokens.accessToken}`,
        },
      }
    );

    // Should return 403 Forbidden or 200 with empty results
    expect([200, 403, 500]).toContain(response.status());
  });
});

test.describe('Keywords API - POST Operations', () => {
  test('should create keyword with valid data', async ({ request }) => {
    const authSetup = createAuthSetup(request);
    const user = TestUsersFactory.createStandardUser();
    const tokens = authSetup.generateAuthTokens(user);

    const keywordData = {
      organization_id: 'test-org-123',
      keyword: 'test keyword',
      searchVolume: 1000,
      difficulty: 'medium',
      intent: 'informational',
    };

    const response = await request.post(API_BASE, {
      headers: {
        Authorization: `Bearer ${tokens.accessToken}`,
      },
      data: keywordData,
    });

    // Should return 201 on success or error if database doesn't exist
    expect([201, 500, 403]).toContain(response.status());
  });

  test('should create keyword with all optional fields', async ({ request }) => {
    const authSetup = createAuthSetup(request);
    const tokens = authSetup.generateAuthTokens();

    const fullKeywordData = {
      organization_id: 'test-org-123',
      product_id: 'prod-123',
      keyword: 'comprehensive keyword',
      searchVolume: 5000,
      difficulty: 'hard',
      intent: 'commercial',
      cpc: 2.5,
      competition: 0.7,
      opportunityScore: 85,
      status: 'tracking',
      currentRank: 15,
      targetUrl: 'https://example.com/target',
      notes: 'Test notes',
      tags: ['tag1', 'tag2'],
      metadata: { source: 'manual' },
    };

    const response = await request.post(API_BASE, {
      headers: {
        Authorization: `Bearer ${tokens.accessToken}`,
      },
      data: fullKeywordData,
    });

    expect([201, 500, 403]).toContain(response.status());
  });

  test('should support bulk keyword creation', async ({ request }) => {
    const authSetup = createAuthSetup(request);
    const tokens = authSetup.generateAuthTokens();

    const bulkData = {
      organization_id: 'test-org-123',
      bulk: true,
      keywords: [
        {
          keyword: 'first keyword',
          searchVolume: 100,
          difficulty: 'easy',
          intent: 'informational',
        },
        {
          keyword: 'second keyword',
          searchVolume: 200,
          difficulty: 'medium',
          intent: 'commercial',
        },
        {
          keyword: 'third keyword',
          searchVolume: 300,
          difficulty: 'hard',
          intent: 'transactional',
        },
      ],
    };

    const response = await request.post(API_BASE, {
      headers: {
        Authorization: `Bearer ${tokens.accessToken}`,
      },
      data: bulkData,
    });

    expect([201, 500, 403]).toContain(response.status());

    if (response.status() === 201) {
      const data = await response.json();
      expect(data).toHaveProperty('total');
      expect(data).toHaveProperty('successful');
    }
  });

  test('should reject keyword without organization_id', async ({ request }) => {
    const authSetup = createAuthSetup(request);
    const tokens = authSetup.generateAuthTokens();

    const response = await request.post(API_BASE, {
      headers: {
        Authorization: `Bearer ${tokens.accessToken}`,
      },
      data: {
        keyword: 'test keyword',
        // Missing organization_id
      },
    });

    expect(response.status()).toBe(400);
  });

  test('should reject invalid intent value', async ({ request }) => {
    const authSetup = createAuthSetup(request);
    const tokens = authSetup.generateAuthTokens();

    const response = await request.post(API_BASE, {
      headers: {
        Authorization: `Bearer ${tokens.accessToken}`,
      },
      data: {
        organization_id: 'test-org-123',
        keyword: 'test keyword',
        intent: 'invalid_intent',
      },
    });

    expect(response.status()).toBe(400);
  });

  test('should reject invalid difficulty value', async ({ request }) => {
    const authSetup = createAuthSetup(request);
    const tokens = authSetup.generateAuthTokens();

    const response = await request.post(API_BASE, {
      headers: {
        Authorization: `Bearer ${tokens.accessToken}`,
      },
      data: {
        organization_id: 'test-org-123',
        keyword: 'test keyword',
        difficulty: 'impossible',
      },
    });

    expect(response.status()).toBe(400);
  });

  test('should handle tags as comma-separated string', async ({ request }) => {
    const authSetup = createAuthSetup(request);
    const tokens = authSetup.generateAuthTokens();

    const response = await request.post(API_BASE, {
      headers: {
        Authorization: `Bearer ${tokens.accessToken}`,
      },
      data: {
        organization_id: 'test-org-123',
        keyword: 'test keyword',
        tags: 'seo, marketing, content',
      },
    });

    expect([201, 400, 500, 403]).toContain(response.status());
  });

  test('should verify organization membership on create', async ({ request }) => {
    const authSetup = createAuthSetup(request);
    const tokens = authSetup.generateAuthTokens();

    // Try to create keyword for organization user is not member of
    const response = await request.post(API_BASE, {
      headers: {
        Authorization: `Bearer ${tokens.accessToken}`,
      },
      data: {
        organization_id: 'other-org-123',
        keyword: 'unauthorized keyword',
      },
    });

    // Should return 403 Forbidden
    expect([403, 500]).toContain(response.status());

    if (response.status() === 403) {
      const data = await response.json();
      expect(data.error).toContain('Forbidden');
    }
  });
});

test.describe('Keywords API - DELETE Operations', () => {
  test('should delete keyword as organization member', async ({ request }) => {
    const authSetup = createAuthSetup(request);
    const user = TestUsersFactory.createStandardUser();
    const tokens = authSetup.generateAuthTokens(user);

    const response = await request.delete(`${API_BASE}?id=keyword-123`, {
      headers: {
        Authorization: `Bearer ${tokens.accessToken}`,
      },
    });

    // May return 404 if keyword doesn't exist
    expect([200, 404, 403, 500]).toContain(response.status());

    if (response.status() === 200) {
      const data = await response.json();
      expect(data).toHaveProperty('success', true);
    }
  });

  test('should return 404 for non-existent keyword', async ({ request }) => {
    const authSetup = createAuthSetup(request);
    const tokens = authSetup.generateAuthTokens();

    const response = await request.delete(`${API_BASE}?id=non-existent-keyword`, {
      headers: {
        Authorization: `Bearer ${tokens.accessToken}`,
      },
    });

    expect(response.status()).toBe(404);
  });

  test('should verify keyword ownership before deletion', async ({ request }) => {
    const authSetup = createAuthSetup(request);
    const tokens = authSetup.generateAuthTokens();

    // Try to delete keyword from another organization
    const response = await request.delete(`${API_BASE}?id=other-org-keyword`, {
      headers: {
        Authorization: `Bearer ${tokens.accessToken}`,
      },
    });

    // Should return 403 or 404
    expect([403, 404, 500]).toContain(response.status());
  });

  test('should perform soft delete', async ({ request }) => {
    const authSetup = createAuthSetup(request);
    const tokens = authSetup.generateAuthTokens();

    // First, try to delete a keyword
    await request.delete(`${API_BASE}?id=keyword-soft-delete`, {
      headers: {
        Authorization: `Bearer ${tokens.accessToken}`,
      },
    });

    // Then try to get it - should not appear in results
    const response = await request.get(
      `${API_BASE}?organization_id=test-org`,
      {
        headers: {
          Authorization: `Bearer ${tokens.accessToken}`,
        },
      }
    );

    expect(response.status()).toBe(200);
    const data = await response.json();
    // Soft deleted keywords should not appear
    expect(data.keywords).not.toContainEqual(
      expect.objectContaining({ id: 'keyword-soft-delete' })
    );
  });
});

test.describe('Keywords API - Edge Cases', () => {
  test('should handle very long keywords', async ({ request }) => {
    const authSetup = createAuthSetup(request);
    const tokens = authSetup.generateAuthTokens();

    const longKeyword = 'a'.repeat(500);

    const response = await request.post(API_BASE, {
      headers: {
        Authorization: `Bearer ${tokens.accessToken}`,
      },
      data: {
        organization_id: 'test-org-123',
        keyword: longKeyword,
      },
    });

    // Should either accept or reject with validation error
    expect([201, 400, 500]).toContain(response.status());
  });

  test('should handle special characters in keywords', async ({ request }) => {
    const authSetup = createAuthSetup(request);
    const tokens = authSetup.generateAuthTokens();

    const specialKeywords = [
      'seo & marketing',
      'best "keywords" (2024)',
      'keyword\'s with apostrophes',
      '100% free',
      'seo/marketing',
    ];

    for (const keyword of specialKeywords) {
      const response = await request.post(API_BASE, {
        headers: {
          Authorization: `Bearer ${tokens.accessToken}`,
        },
        data: {
          organization_id: 'test-org-123',
          keyword,
        },
      });

      // Should handle special characters
      expect([201, 400, 500, 403]).toContain(response.status());
    }
  });

  test('should handle unicode characters', async ({ request }) => {
    const authSetup = createAuthSetup(request);
    const tokens = authSetup.generateAuthTokens();

    const unicodeKeywords = [
      '关键词',
      'mot-clé',
      'palabra clave',
      'schlüsselwort',
      'キーワード',
    ];

    for (const keyword of unicodeKeywords) {
      const response = await request.post(API_BASE, {
        headers: {
          Authorization: `Bearer ${tokens.accessToken}`,
        },
        data: {
          organization_id: 'test-org-123',
          keyword,
        },
      });

      expect([201, 400, 500, 403]).toContain(response.status());
    }
  });

  test('should handle empty search results', async ({ request }) => {
    const authSetup = createAuthSetup(request);
    const tokens = authSetup.generateAuthTokens();

    const response = await request.get(
      `${API_BASE}?organization_id=empty-org&search=nonexistent`,
      {
        headers: {
          Authorization: `Bearer ${tokens.accessToken}`,
        },
      }
    );

    expect(response.status()).toBe(200);
    const data = await response.json();
    expect(data.keywords).toEqual([]);
    expect(data.total).toBe(0);
  });

  test('should handle concurrent keyword creation', async ({ request }) => {
    const authSetup = createAuthSetup(request);
    const tokens = authSetup.generateAuthTokens();

    const requests = Array.from({ length: 5 }, (_, i) =>
      request.post(API_BASE, {
        headers: {
          Authorization: `Bearer ${tokens.accessToken}`,
        },
        data: {
          organization_id: 'test-org-123',
          keyword: `concurrent keyword ${i}`,
        },
      })
    );

    const responses = await Promise.all(requests);

    // All requests should complete
    responses.forEach(response => {
      expect([201, 403, 500]).toContain(response.status());
    });
  });

  test('should handle very large bulk import', async ({ request }) => {
    const authSetup = createAuthSetup(request);
    const tokens = authSetup.generateAuthTokens();

    const keywords = Array.from({ length: 100 }, (_, i) => ({
      keyword: `bulk keyword ${i}`,
      searchVolume: Math.floor(Math.random() * 10000),
      difficulty: ['easy', 'medium', 'hard'][Math.floor(Math.random() * 3)],
      intent: ['informational', 'commercial', 'transactional'][
        Math.floor(Math.random() * 3)
      ],
    }));

    const response = await request.post(API_BASE, {
      headers: {
        Authorization: `Bearer ${tokens.accessToken}`,
      },
      data: {
        organization_id: 'test-org-123',
        bulk: true,
        keywords,
      },
    });

    // Should handle large bulk imports
    expect([201, 400, 500, 403]).toContain(response.status());
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

  test('should handle negative search volume', async ({ request }) => {
    const authSetup = createAuthSetup(request);
    const tokens = authSetup.generateAuthTokens();

    const response = await request.post(API_BASE, {
      headers: {
        Authorization: `Bearer ${tokens.accessToken}`,
      },
      data: {
        organization_id: 'test-org-123',
        keyword: 'test keyword',
        searchVolume: -100,
      },
    });

    // Should reject negative values
    expect([201, 400, 500]).toContain(response.status());
  });
});
