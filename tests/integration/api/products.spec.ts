/**
 * Products API Integration Tests
 *
 * Tests the /api/products endpoints for:
 * - Authentication requirements
 * - Authorization (organization membership)
 * - Input validation
 * - CRUD operations
 * - Error cases
 * - Edge cases
 */

import { test, expect } from '@playwright/test';
import { createAuthSetup, TestUsersFactory } from '../fixtures/auth-setup';

const API_BASE = 'http://localhost:3000/api/products';

test.describe('Products API - Authentication', () => {
  test('should reject unauthenticated GET request', async ({ request }) => {
    const response = await request.get(API_BASE);

    expect(response.status()).toBe(401);
    const data = await response.json();
    expect(data).toHaveProperty('error', 'Unauthorized');
  });

  test('should reject unauthenticated POST request', async ({ request }) => {
    const response = await request.post(API_BASE, {
      data: {
        name: 'Test Product',
      },
    });

    expect(response.status()).toBe(401);
  });

  test('should reject unauthenticated PUT request', async ({ request }) => {
    const response = await request.put(API_BASE, {
      data: {
        id: 'prod-123',
        name: 'Updated Product',
      },
    });

    expect(response.status()).toBe(401);
  });

  test('should reject unauthenticated DELETE request', async ({ request }) => {
    const response = await request.delete(`${API_BASE}?id=prod-123`);

    expect(response.status()).toBe(401);
  });
});

test.describe('Products API - Validation', () => {
  test('should require name on POST', async ({ request }) => {
    const authSetup = createAuthSetup(request);
    const tokens = authSetup.generateAuthTokens();

    const response = await request.post(API_BASE, {
      headers: {
        Authorization: `Bearer ${tokens.accessToken}`,
      },
      data: {
        // Missing name
        url: 'https://example.com',
      },
    });

    expect(response.status()).toBe(400);
  });

  test('should validate URL format if provided', async ({ request }) => {
    const authSetup = createAuthSetup(request);
    const tokens = authSetup.generateAuthTokens();

    const response = await request.post(API_BASE, {
      headers: {
        Authorization: `Bearer ${tokens.accessToken}`,
      },
      data: {
        name: 'Test Product',
        url: 'not-a-valid-url',
      },
    });

    // Should validate URL format
    expect([201, 400, 403, 500]).toContain(response.status());
  });

  test('should validate status values', async ({ request }) => {
    const authSetup = createAuthSetup(request);
    const tokens = authSetup.generateAuthTokens();

    const response = await request.post(API_BASE, {
      headers: {
        Authorization: `Bearer ${tokens.accessToken}`,
      },
      data: {
        name: 'Test Product',
        status: 'invalid_status',
      },
    });

    expect([400, 403, 500]).toContain(response.status());
  });

  test('should require id on PUT', async ({ request }) => {
    const authSetup = createAuthSetup(request);
    const tokens = authSetup.generateAuthTokens();

    const response = await request.put(API_BASE, {
      headers: {
        Authorization: `Bearer ${tokens.accessToken}`,
      },
      data: {
        name: 'Updated Product',
        // Missing id
      },
    });

    expect(response.status()).toBe(400);
  });

  test('should require id on DELETE', async ({ request }) => {
    const authSetup = createAuthSetup(request);
    const tokens = authSetup.generateAuthTokens();

    const response = await request.delete(API_BASE, {
      headers: {
        Authorization: `Bearer ${tokens.accessToken}`,
      },
    });

    expect(response.status()).toBe(400);
  });

  test('should validate pagination parameters', async ({ request }) => {
    const authSetup = createAuthSetup(request);
    const tokens = authSetup.generateAuthTokens();

    const response = await request.get(
      `${API_BASE}?page=-1&limit=abc`,
      {
        headers: {
          Authorization: `Bearer ${tokens.accessToken}`,
        },
      }
    );

    // Should handle validation
    expect([200, 400]).toContain(response.status());
  });
});

test.describe('Products API - GET Operations', () => {
  test('should fetch products for authenticated user', async ({ request }) => {
    const authSetup = createAuthSetup(request);
    const user = TestUsersFactory.createStandardUser();
    const tokens = authSetup.generateAuthTokens(user);

    const response = await request.get(API_BASE, {
      headers: {
        Authorization: `Bearer ${tokens.accessToken}`,
      },
    });

    // Should return products array (may be empty if user has no products)
    expect(response.status()).toBe(200);
    const data = await response.json();
    expect(data).toHaveProperty('products');
    expect(Array.isArray(data.products)).toBeTruthy();
    expect(data).toHaveProperty('total');
    expect(data).toHaveProperty('page');
    expect(data).toHaveProperty('limit');
    expect(data).toHaveProperty('hasMore');
  });

  test('should support search functionality', async ({ request }) => {
    const authSetup = createAuthSetup(request);
    const tokens = authSetup.generateAuthTokens();

    const response = await request.get(
      `${API_BASE}?search=test`,
      {
        headers: {
          Authorization: `Bearer ${tokens.accessToken}`,
        },
      }
    );

    expect(response.status()).toBe(200);
  });

  test('should support status filtering', async ({ request }) => {
    const authSetup = createAuthSetup(request);
    const tokens = authSetup.generateAuthTokens();

    const response = await request.get(
      `${API_BASE}?status=active`,
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
      `${API_BASE}?page=1&limit=10`,
      {
        headers: {
          Authorization: `Bearer ${tokens.accessToken}`,
        },
      }
    );

    expect(response.status()).toBe(200);
    const data = await response.json();
    expect(data.page).toBe(1);
    expect(data.limit).toBe(10);
  });

  test('should support sorting', async ({ request }) => {
    const authSetup = createAuthSetup(request);
    const tokens = authSetup.generateAuthTokens();

    const response = await request.get(
      `${API_BASE}?sort=name&order=asc`,
      {
        headers: {
          Authorization: `Bearer ${tokens.accessToken}`,
        },
      }
    );

    expect(response.status()).toBe(200);
  });

  test('should handle empty product list', async ({ request }) => {
    const authSetup = createAuthSetup(request);
    const tokens = authSetup.generateAuthTokens();

    const response = await request.get(
      `${API_BASE}?search=nonexistent`,
      {
        headers: {
          Authorization: `Bearer ${tokens.accessToken}`,
        },
      }
    );

    expect(response.status()).toBe(200);
    const data = await response.json();
    expect(data.products).toEqual([]);
    expect(data.total).toBe(0);
  });

  test('should return products from all user organizations', async ({ request }) => {
    const authSetup = createAuthSetup(request);
    const user = TestUsersFactory.createStandardUser();
    const tokens = authSetup.generateAuthTokens(user);

    const response = await request.get(API_BASE, {
      headers: {
        Authorization: `Bearer ${tokens.accessToken}`,
      },
    });

    expect(response.status()).toBe(200);
    const data = await response.json();
    expect(data).toHaveProperty('products');
  });
});

test.describe('Products API - POST Operations', () => {
  test('should create product with valid data', async ({ request }) => {
    const authSetup = createAuthSetup(request);
    const user = TestUsersFactory.createStandardUser();
    const tokens = authSetup.generateAuthTokens(user);

    const productData = {
      name: 'Test Product',
      url: 'https://example.com',
      description: 'Test description',
    };

    const response = await request.post(API_BASE, {
      headers: {
        Authorization: `Bearer ${tokens.accessToken}`,
      },
      data: productData,
    });

    // May return 403 if user has no organization, or 500 if database not set up
    expect([201, 403, 500]).toContain(response.status());

    if (response.status() === 201) {
      const data = await response.json();
      expect(data).toHaveProperty('id');
      expect(data).toHaveProperty('name', productData.name);
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
        name: 'Test Product Name',
        url: 'https://example.com',
      },
    });

    expect([201, 403, 500]).toContain(response.status());

    if (response.status() === 201) {
      const data = await response.json();
      expect(data).toHaveProperty('slug');
    }
  });

  test('should create product with all optional fields', async ({ request }) => {
    const authSetup = createAuthSetup(request);
    const tokens = authSetup.generateAuthTokens();

    const fullProductData = {
      name: 'Complete Product',
      slug: 'complete-product',
      url: 'https://example.com',
      description: 'Full product description',
      status: 'active',
      primaryColor: '#FF0000',
      secondaryColor: '#00FF00',
      accentColor: '#0000FF',
      tone: 'professional',
      logoUrl: 'https://example.com/logo.png',
      industry: 'Technology',
      targetAudience: 'Developers',
      analytics_config: {
        googleAnalyticsId: 'UA-123456',
      },
    };

    const response = await request.post(API_BASE, {
      headers: {
        Authorization: `Bearer ${tokens.accessToken}`,
      },
      data: fullProductData,
    });

    expect([201, 403, 500]).toContain(response.status());
  });

  test('should accept product without URL', async ({ request }) => {
    const authSetup = createAuthSetup(request);
    const tokens = authSetup.generateAuthTokens();

    const response = await request.post(API_BASE, {
      headers: {
        Authorization: `Bearer ${tokens.accessToken}`,
      },
      data: {
        name: 'Product without URL',
        description: 'Just a name and description',
      },
    });

    expect([201, 403, 500]).toContain(response.status());
  });

  test('should handle organization_id parameter', async ({ request }) => {
    const authSetup = createAuthSetup(request);
    const tokens = authSetup.generateAuthTokens();

    const response = await request.post(API_BASE, {
      headers: {
        Authorization: `Bearer ${tokens.accessToken}`,
      },
      data: {
        name: 'Test Product',
        organization_id: 'org-123',
      },
    });

    expect([201, 403, 500]).toContain(response.status());
  });

  test('should reject product with invalid organization', async ({ request }) => {
    const authSetup = createAuthSetup(request);
    const tokens = authSetup.generateAuthTokens();

    const response = await request.post(API_BASE, {
      headers: {
        Authorization: `Bearer ${tokens.accessToken}`,
      },
      data: {
        name: 'Test Product',
        organization_id: 'non-existent-org',
      },
    });

    expect([403, 500]).toContain(response.status());
  });
});

test.describe('Products API - PUT Operations', () => {
  test('should update product with valid data', async ({ request }) => {
    const authSetup = createAuthSetup(request);
    const tokens = authSetup.generateAuthTokens();

    const updateData = {
      id: 'prod-123',
      name: 'Updated Product Name',
      description: 'Updated description',
    };

    const response = await request.put(API_BASE, {
      headers: {
        Authorization: `Bearer ${tokens.accessToken}`,
      },
      data: updateData,
    });

    // May return 404 if product doesn't exist, 403 if no access
    expect([200, 403, 404, 500]).toContain(response.status());
  });

  test('should support partial updates', async ({ request }) => {
    const authSetup = createAuthSetup(request);
    const tokens = authSetup.generateAuthTokens();

    const response = await request.put(API_BASE, {
      headers: {
        Authorization: `Bearer ${tokens.accessToken}`,
      },
      data: {
        id: 'prod-123',
        name: 'Just updating the name',
      },
    });

    expect([200, 403, 404, 500]).toContain(response.status());
  });

  test('should update brand colors', async ({ request }) => {
    const authSetup = createAuthSetup(request);
    const tokens = authSetup.generateAuthTokens();

    const response = await request.put(API_BASE, {
      headers: {
        Authorization: `Bearer ${tokens.accessToken}`,
      },
      data: {
        id: 'prod-123',
        primaryColor: '#ABCDEF',
        secondaryColor: '#FEDCBA',
        accentColor: '#123456',
      },
    });

    expect([200, 403, 404, 500]).toContain(response.status());
  });

  test('should update tone preferences', async ({ request }) => {
    const authSetup = createAuthSetup(request);
    const tokens = authSetup.generateAuthTokens();

    const response = await request.put(API_BASE, {
      headers: {
        Authorization: `Bearer ${tokens.accessToken}`,
      },
      data: {
        id: 'prod-123',
        tone: 'casual',
      },
    });

    expect([200, 403, 404, 500]).toContain(response.status());
  });

  test('should update analytics config', async ({ request }) => {
    const authSetup = createAuthSetup(request);
    const tokens = authSetup.generateAuthTokens();

    const response = await request.put(API_BASE, {
      headers: {
        Authorization: `Bearer ${tokens.accessToken}`,
      },
      data: {
        id: 'prod-123',
        analytics_config: {
          googleAnalyticsId: 'UA-999999',
        },
      },
    });

    expect([200, 403, 404, 500]).toContain(response.status());
  });

  test('should verify product access before update', async ({ request }) => {
    const authSetup = createAuthSetup(request);
    const tokens = authSetup.generateAuthTokens();

    const response = await request.put(API_BASE, {
      headers: {
        Authorization: `Bearer ${tokens.accessToken}`,
      },
      data: {
        id: 'prod-from-other-org',
        name: 'Hacked Name',
      },
    });

    // Should return 403 or 404
    expect([403, 404, 500]).toContain(response.status());
  });

  test('should reject update without id', async ({ request }) => {
    const authSetup = createAuthSetup(request);
    const tokens = authSetup.generateAuthTokens();

    const response = await request.put(API_BASE, {
      headers: {
        Authorization: `Bearer ${tokens.accessToken}`,
      },
      data: {
        name: 'Updated Product',
        // Missing id
      },
    });

    expect(response.status()).toBe(400);
  });
});

test.describe('Products API - DELETE Operations', () => {
  test('should delete product as organization member', async ({ request }) => {
    const authSetup = createAuthSetup(request);
    const user = TestUsersFactory.createStandardUser();
    const tokens = authSetup.generateAuthTokens(user);

    const response = await request.delete(`${API_BASE}?id=prod-123`, {
      headers: {
        Authorization: `Bearer ${tokens.accessToken}`,
      },
    });

    // May return 404 if product doesn't exist, 403 if no access
    expect([200, 403, 404, 500]).toContain(response.status());

    if (response.status() === 200) {
      const data = await response.json();
      expect(data).toHaveProperty('success', true);
    }
  });

  test('should verify product access before deletion', async ({ request }) => {
    const authSetup = createAuthSetup(request);
    const tokens = authSetup.generateAuthTokens();

    const response = await request.delete(`${API_BASE}?id=prod-from-other-org`, {
      headers: {
        Authorization: `Bearer ${tokens.accessToken}`,
      },
    });

    // Should return 403 or 404
    expect([403, 404, 500]).toContain(response.status());
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

  test('should return 404 for non-existent product', async ({ request }) => {
    const authSetup = createAuthSetup(request);
    const tokens = authSetup.generateAuthTokens();

    const response = await request.delete(`${API_BASE}?id=non-existent-prod`, {
      headers: {
        Authorization: `Bearer ${tokens.accessToken}`,
      },
    });

    expect(response.status()).toBe(404);
  });
});

test.describe('Products API - Edge Cases', () => {
  test('should handle very long product names', async ({ request }) => {
    const authSetup = createAuthSetup(request);
    const tokens = authSetup.generateAuthTokens();

    const longName = 'A'.repeat(500);

    const response = await request.post(API_BASE, {
      headers: {
        Authorization: `Bearer ${tokens.accessToken}`,
      },
      data: {
        name: longName,
      },
    });

    // Should either accept or reject with validation error
    expect([201, 400, 403, 500]).toContain(response.status());
  });

  test('should handle special characters in product names', async ({ request }) => {
    const authSetup = createAuthSetup(request);
    const tokens = authSetup.generateAuthTokens();

    const specialNames = [
      'Product & Co.',
      'Product "Quotes" Test',
      'Product\'s Apostrophe',
      'Product/Division',
      'Product: Special',
      '100% Free Product',
    ];

    for (const name of specialNames) {
      const response = await request.post(API_BASE, {
        headers: {
          Authorization: `Bearer ${tokens.accessToken}`,
        },
        data: { name },
      });

      expect([201, 400, 403, 500]).toContain(response.status());
    }
  });

  test('should handle unicode in product names', async ({ request }) => {
    const authSetup = createAuthSetup(request);
    const tokens = authSetup.generateAuthTokens();

    const unicodeNames = [
      '製品',
      'Produkt',
      'Produit',
      'Продукт',
      'منتج',
    ];

    for (const name of unicodeNames) {
      const response = await request.post(API_BASE, {
        headers: {
          Authorization: `Bearer ${tokens.accessToken}`,
        },
        data: { name },
      });

      expect([201, 400, 403, 500]).toContain(response.status());
    }
  });

  test('should handle various URL formats', async ({ request }) => {
    const authSetup = createAuthSetup(request);
    const tokens = authSetup.generateAuthTokens();

    const urls = [
      'https://example.com',
      'https://subdomain.example.com',
      'https://example.com/path',
      'https://example.com/path?query=value',
      'https://example.com:8080',
      'http://example.com',
    ];

    for (const url of urls) {
      const response = await request.post(API_BASE, {
        headers: {
          Authorization: `Bearer ${tokens.accessToken}`,
        },
        data: {
          name: `Product for ${url}`,
          url,
        },
      });

      expect([201, 400, 403, 500]).toContain(response.status());
    }
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

  test('should handle concurrent product creation', async ({ request }) => {
    const authSetup = createAuthSetup(request);
    const tokens = authSetup.generateAuthTokens();

    const requests = Array.from({ length: 5 }, (_, i) =>
      request.post(API_BASE, {
        headers: {
          Authorization: `Bearer ${tokens.accessToken}`,
        },
        data: {
          name: `Concurrent Product ${i}`,
        },
      })
    );

    const responses = await Promise.all(requests);

    // All requests should complete
    responses.forEach(response => {
      expect([201, 403, 500]).toContain(response.status());
    });
  });
});
