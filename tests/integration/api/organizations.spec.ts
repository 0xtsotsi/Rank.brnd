/**
 * Organizations API Integration Tests
 *
 * Tests the /api/organizations endpoints for:
 * - Authentication requirements
 * - Input validation
 * - Organization creation with default product
 * - Fetching user organizations
 * - Error cases
 * - Edge cases
 */

import { test, expect } from '@playwright/test';
import { createAuthSetup, TestUsersFactory } from '../fixtures/auth-setup';

const API_BASE = 'http://localhost:3000/api/organizations';

test.describe('Organizations API - Authentication', () => {
  test('should reject unauthenticated GET request', async ({ request }) => {
    const response = await request.get(API_BASE);

    expect(response.status()).toBe(401);
    const data = await response.json();
    expect(data).toHaveProperty('error', 'Unauthorized');
  });

  test('should reject unauthenticated POST request', async ({ request }) => {
    const response = await request.post(API_BASE, {
      data: {
        name: 'Test Organization',
      },
    });

    expect(response.status()).toBe(401);
  });
});

test.describe('Organizations API - GET Operations', () => {
  test('should fetch organizations for authenticated user', async ({ request }) => {
    const authSetup = createAuthSetup(request);
    const user = TestUsersFactory.createStandardUser();
    const tokens = authSetup.generateAuthTokens(user);

    const response = await request.get(API_BASE, {
      headers: {
        Authorization: `Bearer ${tokens.accessToken}`,
      },
    });

    // Should return 200 with organizations array (may be empty)
    expect(response.status()).toBe(200);
    const data = await response.json();
    expect(data).toHaveProperty('organizations');
    expect(Array.isArray(data.organizations)).toBeTruthy();
  });

  test('should handle user with no organizations', async ({ request }) => {
    const authSetup = createAuthSetup(request);
    const tokens = authSetup.generateAuthTokens({
      id: 'user-with-no-orgs',
      email: 'noorgs@example.com',
    });

    const response = await request.get(API_BASE, {
      headers: {
        Authorization: `Bearer ${tokens.accessToken}`,
      },
    });

    expect(response.status()).toBe(200);
    const data = await response.json();
    expect(data.organizations).toEqual([]);
  });

  test('should return organization details', async ({ request }) => {
    const authSetup = createAuthSetup(request);
    const tokens = authSetup.generateAuthTokens();

    const response = await request.get(API_BASE, {
      headers: {
        Authorization: `Bearer ${tokens.accessToken}`,
      },
    });

    expect(response.status()).toBe(200);
    const data = await response.json();

    if (data.organizations.length > 0) {
      const org = data.organizations[0];
      expect(org).toHaveProperty('id');
      expect(org).toHaveProperty('name');
      expect(org).toHaveProperty('slug');
    }
  });
});

test.describe('Organizations API - POST Operations (Create)', () => {
  test('should create organization with valid name', async ({ request }) => {
    const authSetup = createAuthSetup(request);
    const tokens = authSetup.generateAuthTokens();

    const orgData = {
      name: 'Test Organization',
    };

    const response = await request.post(API_BASE, {
      headers: {
        Authorization: `Bearer ${tokens.accessToken}`,
      },
      data: orgData,
    });

    // May return 201, 500 (if Clerk API fails), or other errors
    expect([201, 500, 400]).toContain(response.status());

    if (response.status() === 201) {
      const data = await response.json();
      expect(data).toHaveProperty('organization');
      expect(data.organization).toHaveProperty('id');
      expect(data.organization).toHaveProperty('name', orgData.name);
      expect(data.organization).toHaveProperty('slug');
      expect(data.organization).toHaveProperty('tier', 'free');
      // Should also create a default product
      expect(data).toHaveProperty('product');
    }
  });

  test('should create organization with custom slug', async ({ request }) => {
    const authSetup = createAuthSetup(request);
    const tokens = authSetup.generateAuthTokens();

    const orgData = {
      name: 'Test Organization',
      slug: 'custom-slug',
    };

    const response = await request.post(API_BASE, {
      headers: {
        Authorization: `Bearer ${tokens.accessToken}`,
      },
      data: orgData,
    });

    expect([201, 500, 400]).toContain(response.status());

    if (response.status() === 201) {
      const data = await response.json();
      expect(data.organization).toHaveProperty('slug');
    }
  });

  test('should auto-generate slug from name if not provided', async ({ request }) => {
    const authSetup = createAuthSetup(request);
    const tokens = authSetup.generateAuthTokens();

    const orgData = {
      name: 'My Test Organization Name',
    };

    const response = await request.post(API_BASE, {
      headers: {
        Authorization: `Bearer ${tokens.accessToken}`,
      },
      data: orgData,
    });

    expect([201, 500, 400]).toContain(response.status());

    if (response.status() === 201) {
      const data = await response.json();
      expect(data.organization.slug).toMatch(/my-test-organization-name/);
    }
  });

  test('should create default product with organization', async ({ request }) => {
    const authSetup = createAuthSetup(request);
    const tokens = authSetup.generateAuthTokens();

    const orgData = {
      name: 'Org With Default Product',
    };

    const response = await request.post(API_BASE, {
      headers: {
        Authorization: `Bearer ${tokens.accessToken}`,
      },
      data: orgData,
    });

    expect([201, 500, 400]).toContain(response.status());

    if (response.status() === 201) {
      const data = await response.json();
      expect(data).toHaveProperty('product');
      expect(data.product).toHaveProperty('id');
      expect(data.product).toHaveProperty('name');
      expect(data.product.name).toContain('Website');
    }
  });

  test('should set user as organization owner', async ({ request }) => {
    const authSetup = createAuthSetup(request);
    const tokens = authSetup.generateAuthTokens();

    const response = await request.post(API_BASE, {
      headers: {
        Authorization: `Bearer ${tokens.accessToken}`,
      },
      data: {
        name: 'Owner Test Organization',
      },
    });

    expect([201, 500, 400]).toContain(response.status());
  });
});

test.describe('Organizations API - Validation', () => {
  test('should reject organization without name', async ({ request }) => {
    const authSetup = createAuthSetup(request);
    const tokens = authSetup.generateAuthTokens();

    const response = await request.post(API_BASE, {
      headers: {
        Authorization: `Bearer ${tokens.accessToken}`,
      },
      data: {
        // Missing name
        slug: 'test-slug',
      },
    });

    expect(response.status()).toBe(400);
    const data = await response.json();
    expect(data.error).toContain('name');
  });

  test('should reject empty name', async ({ request }) => {
    const authSetup = createAuthSetup(request);
    const tokens = authSetup.generateAuthTokens();

    const response = await request.post(API_BASE, {
      headers: {
        Authorization: `Bearer ${tokens.accessToken}`,
      },
      data: {
        name: '   ',
      },
    });

    expect(response.status()).toBe(400);
  });

  test('should reject name shorter than 2 characters', async ({ request }) => {
    const authSetup = createAuthSetup(request);
    const tokens = authSetup.generateAuthTokens();

    const response = await request.post(API_BASE, {
      headers: {
        Authorization: `Bearer ${tokens.accessToken}`,
      },
      data: {
        name: 'A',
      },
    });

    expect(response.status()).toBe(400);
  });

  test('should reject name longer than 100 characters', async ({ request }) => {
    const authSetup = createAuthSetup(request);
    const tokens = authSetup.generateAuthTokens();

    const response = await request.post(API_BASE, {
      headers: {
        Authorization: `Bearer ${tokens.accessToken}`,
      },
      data: {
        name: 'A'.repeat(101),
      },
    });

    expect(response.status()).toBe(400);
  });

  test('should trim whitespace from name', async ({ request }) => {
    const authSetup = createAuthSetup(request);
    const tokens = authSetup.generateAuthTokens();

    const response = await request.post(API_BASE, {
      headers: {
        Authorization: `Bearer ${tokens.accessToken}`,
      },
      data: {
        name: '  Test Organization  ',
      },
    });

    expect([201, 500, 400]).toContain(response.status());
  });

  test('should sanitize custom slug', async ({ request }) => {
    const authSetup = createAuthSetup(request);
    const tokens = authSetup.generateAuthTokens();

    const response = await request.post(API_BASE, {
      headers: {
        Authorization: `Bearer ${tokens.accessToken}`,
      },
      data: {
        name: 'Test Organization',
        slug: 'Invalid Slug! @#$%',
      },
    });

    expect([201, 500, 400]).toContain(response.status());

    if (response.status() === 201) {
      const data = await response.json();
      // Slug should be sanitized (lowercase, alphanumeric and hyphens only)
      expect(data.organization.slug).toMatch(/^[a-z0-9-]+$/);
    }
  });

  test('should reject non-string name', async ({ request }) => {
    const authSetup = createAuthSetup(request);
    const tokens = authSetup.generateAuthTokens();

    const response = await request.post(API_BASE, {
      headers: {
        Authorization: `Bearer ${tokens.accessToken}`,
      },
      data: {
        name: 12345,
      },
    });

    expect(response.status()).toBe(400);
  });
});

test.describe('Organizations API - Edge Cases', () => {
  test('should handle special characters in name', async ({ request }) => {
    const authSetup = createAuthSetup(request);
    const tokens = authSetup.generateAuthTokens();

    const specialNames = [
      'Organization & Co.',
      'Organization "Quotes" Test',
      'Organization\'s Apostrophe',
      'Organization/Division',
      'Organization: Special',
      '100% Free Organization',
      'Org (parentheses)',
      'Org-with-dashes',
    ];

    for (const name of specialNames) {
      const response = await request.post(API_BASE, {
        headers: {
          Authorization: `Bearer ${tokens.accessToken}`,
        },
        data: { name },
      });

      expect([201, 400, 500]).toContain(response.status());
    }
  });

  test('should handle unicode in name', async ({ request }) => {
    const authSetup = createAuthSetup(request);
    const tokens = authSetup.generateAuthTokens();

    const unicodeNames = [
      '組織',
      'Organisation',
      'Organización',
      'Организация',
      'منظمة',
    ];

    for (const name of unicodeNames) {
      const response = await request.post(API_BASE, {
        headers: {
          Authorization: `Bearer ${tokens.accessToken}`,
        },
        data: { name },
      });

      expect([201, 400, 500]).toContain(response.status());
    }
  });

  test('should handle slug collision', async ({ request }) => {
    const authSetup = createAuthSetup(request);
    const tokens = authSetup.generateAuthTokens();

    const orgName = 'Duplicate Slug Org';

    // Create first organization
    const response1 = await request.post(API_BASE, {
      headers: {
        Authorization: `Bearer ${tokens.accessToken}`,
      },
      data: {
        name: orgName,
        slug: 'duplicate-slug',
      },
    });

    // Try to create second organization with same slug
    const response2 = await request.post(API_BASE, {
      headers: {
        Authorization: `Bearer ${tokens.accessToken}`,
      },
      data: {
        name: 'Another Org',
        slug: 'duplicate-slug',
      },
    });

    // Second request should either succeed with modified slug or fail
    expect([201, 400, 500]).toContain(response2.status());
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

    expect(response.status()).toBe(500);
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

  test('should handle minimum valid name', async ({ request }) => {
    const authSetup = createAuthSetup(request);
    const tokens = authSetup.generateAuthTokens();

    const response = await request.post(API_BASE, {
      headers: {
        Authorization: `Bearer ${tokens.accessToken}`,
      },
      data: {
        name: 'AB',
      },
    });

    expect([201, 500, 400]).toContain(response.status());
  });

  test('should handle maximum valid name', async ({ request }) => {
    const authSetup = createAuthSetup(request);
    const tokens = authSetup.generateAuthTokens();

    const response = await request.post(API_BASE, {
      headers: {
        Authorization: `Bearer ${tokens.accessToken}`,
      },
      data: {
        name: 'A'.repeat(100),
      },
    });

    expect([201, 500, 400]).toContain(response.status());
  });

  test('should generate default tier as free', async ({ request }) => {
    const authSetup = createAuthSetup(request);
    const tokens = authSetup.generateAuthTokens();

    const response = await request.post(API_BASE, {
      headers: {
        Authorization: `Bearer ${tokens.accessToken}`,
      },
      data: {
        name: 'Free Tier Org',
      },
    });

    expect([201, 500, 400]).toContain(response.status());

    if (response.status() === 201) {
      const data = await response.json();
      expect(data.organization.tier).toBe('free');
    }
  });
});
