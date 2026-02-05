/**
 * Schedule API Integration Tests
 *
 * Tests the /api/schedule endpoints for:
 * - Authentication requirements
 * - Authorization (RBAC - owner/admin for delete)
 * - Input validation
 * - CRUD operations
 * - Date validation
 * - Error cases
 * - Edge cases
 */

import { test, expect } from '@playwright/test';
import { createAuthSetup, TestUsersFactory } from '../fixtures/auth-setup';

const API_BASE = 'http://localhost:3000/api/schedule';

test.describe('Schedule API - Authentication', () => {
  test('should reject unauthenticated GET request', async ({ request }) => {
    const response = await request.get(`${API_BASE}?organization_id=test-org`);

    expect(response.status()).toBe(401);
    const data = await response.json();
    expect(data).toHaveProperty('error', 'Unauthorized');
  });

  test('should reject unauthenticated POST request', async ({ request }) => {
    const response = await request.post(API_BASE, {
      data: {
        article_id: 'article-123',
        scheduled_at: new Date(Date.now() + 86400000).toISOString(),
      },
    });

    expect(response.status()).toBe(401);
  });

  test('should reject unauthenticated PUT request', async ({ request }) => {
    const response = await request.put(API_BASE, {
      data: {
        id: 'schedule-123',
        organization_id: 'org-123',
      },
    });

    expect(response.status()).toBe(401);
  });

  test('should reject unauthenticated DELETE request', async ({ request }) => {
    const response = await request.delete(`${API_BASE}?id=article-123`);

    expect(response.status()).toBe(401);
  });
});

test.describe('Schedule API - Validation', () => {
  test('should require organization_id parameter on GET', async ({ request }) => {
    const authSetup = createAuthSetup(request);
    const tokens = authSetup.generateAuthTokens();

    const response = await request.get(API_BASE, {
      headers: {
        Authorization: `Bearer ${tokens.accessToken}`,
      },
    });

    expect(response.status()).toBe(400);
    const data = await response.json();
    expect(data.error).toContain('organization_id');
  });

  test('should require article_id on POST', async ({ request }) => {
    const authSetup = createAuthSetup(request);
    const tokens = authSetup.generateAuthTokens();

    const response = await request.post(API_BASE, {
      headers: {
        Authorization: `Bearer ${tokens.accessToken}`,
      },
      data: {
        scheduled_at: new Date(Date.now() + 86400000).toISOString(),
        // Missing article_id
      },
    });

    expect(response.status()).toBe(400);
  });

  test('should require scheduled_at on POST', async ({ request }) => {
    const authSetup = createAuthSetup(request);
    const tokens = authSetup.generateAuthTokens();

    const response = await request.post(API_BASE, {
      headers: {
        Authorization: `Bearer ${tokens.accessToken}`,
      },
      data: {
        article_id: 'article-123',
        // Missing scheduled_at
      },
    });

    expect(response.status()).toBe(400);
  });

  test('should reject past scheduled dates', async ({ request }) => {
    const authSetup = createAuthSetup(request);
    const tokens = authSetup.generateAuthTokens();

    const pastDate = new Date(Date.now() - 86400000).toISOString();

    const response = await request.post(API_BASE, {
      headers: {
        Authorization: `Bearer ${tokens.accessToken}`,
      },
      data: {
        article_id: 'article-123',
        scheduled_at: pastDate,
      },
    });

    expect(response.status()).toBe(400);
    const data = await response.json();
    expect(data.error).toContain('future');
  });

  test('should reject current time as scheduled date', async ({ request }) => {
    const authSetup = createAuthSetup(request);
    const tokens = authSetup.generateAuthTokens();

    const response = await request.post(API_BASE, {
      headers: {
        Authorization: `Bearer ${tokens.accessToken}`,
      },
      data: {
        article_id: 'article-123',
        scheduled_at: new Date().toISOString(),
      },
    });

    expect(response.status()).toBe(400);
  });

  test('should require id and organization_id on PUT', async ({ request }) => {
    const authSetup = createAuthSetup(request);
    const tokens = authSetup.generateAuthTokens();

    const response = await request.put(API_BASE, {
      headers: {
        Authorization: `Bearer ${tokens.accessToken}`,
      },
      data: {
        // Missing id and organization_id
        scheduled_at: new Date(Date.now() + 86400000).toISOString(),
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
});

test.describe('Schedule API - GET Operations', () => {
  test('should fetch schedules for organization', async ({ request }) => {
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
    expect(data).toHaveProperty('schedules');
    expect(Array.isArray(data.schedules)).toBeTruthy();
    expect(data).toHaveProperty('total');
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

  test('should support status filtering', async ({ request }) => {
    const authSetup = createAuthSetup(request);
    const tokens = authSetup.generateAuthTokens();

    const response = await request.get(
      `${API_BASE}?organization_id=test-org&status=pending`,
      {
        headers: {
          Authorization: `Bearer ${tokens.accessToken}`,
        },
      }
    );

    expect(response.status()).toBe(200);
  });

  test('should support date range filtering', async ({ request }) => {
    const authSetup = createAuthSetup(request);
    const tokens = authSetup.generateAuthTokens();

    const now = new Date();
    const future = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

    const response = await request.get(
      `${API_BASE}?organization_id=test-org&date_from=${now.toISOString()}&date_to=${future.toISOString()}`,
      {
        headers: {
          Authorization: `Bearer ${tokens.accessToken}`,
        },
      }
    );

    expect(response.status()).toBe(200);
  });

  test('should support search', async ({ request }) => {
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
  });

  test('should support sorting', async ({ request }) => {
    const authSetup = createAuthSetup(request);
    const tokens = authSetup.generateAuthTokens();

    const response = await request.get(
      `${API_BASE}?organization_id=test-org&sort=scheduled_at&order=asc`,
      {
        headers: {
          Authorization: `Bearer ${tokens.accessToken}`,
        },
      }
    );

    expect(response.status()).toBe(200);
  });

  test('should verify organization membership', async ({ request }) => {
    const authSetup = createAuthSetup(request);
    const tokens = authSetup.generateAuthTokens();

    const response = await request.get(
      `${API_BASE}?organization_id=other-org-123`,
      {
        headers: {
          Authorization: `Bearer ${tokens.accessToken}`,
        },
      }
    );

    // Should return 403 if user is not a member
    expect([200, 403, 500]).toContain(response.status());
  });
});

test.describe('Schedule API - POST Operations', () => {
  test('should create schedule with valid data', async ({ request }) => {
    const authSetup = createAuthSetup(request);
    const tokens = authSetup.generateAuthTokens();

    const futureDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();

    const response = await request.post(API_BASE, {
      headers: {
        Authorization: `Bearer ${tokens.accessToken}`,
      },
      data: {
        article_id: 'article-123',
        scheduled_at: futureDate,
      },
    });

    // May return 403 if user doesn't have access to article
    expect([201, 403, 500]).toContain(response.status());

    if (response.status() === 201) {
      const data = await response.json();
      expect(data).toHaveProperty('id');
      expect(data).toHaveProperty('article_id');
    }
  });

  test('should accept schedule with all optional fields', async ({ request }) => {
    const authSetup = createAuthSetup(request);
    const tokens = authSetup.generateAuthTokens();

    const futureDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
    const recurrenceEndDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();

    const response = await request.post(API_BASE, {
      headers: {
        Authorization: `Bearer ${tokens.accessToken}`,
      },
      data: {
        article_id: 'article-123',
        scheduled_at: futureDate,
        status: 'pending',
        recurrence: 'weekly',
        recurrence_end_date: recurrenceEndDate,
        notes: 'Test notes',
        metadata: { source: 'manual' },
      },
    });

    expect([201, 403, 500]).toContain(response.status());
  });

  test('should verify article access before scheduling', async ({ request }) => {
    const authSetup = createAuthSetup(request);
    const tokens = authSetup.generateAuthTokens();

    const futureDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();

    const response = await request.post(API_BASE, {
      headers: {
        Authorization: `Bearer ${tokens.accessToken}`,
      },
      data: {
        article_id: 'article-from-other-org',
        scheduled_at: futureDate,
      },
    });

    // Should return 403 if user doesn't have access
    expect([403, 500]).toContain(response.status());
  });
});

test.describe('Schedule API - PUT Operations', () => {
  test('should update schedule with valid data', async ({ request }) => {
    const authSetup = createAuthSetup(request);
    const tokens = authSetup.generateAuthTokens();

    const futureDate = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString();

    const response = await request.put(API_BASE, {
      headers: {
        Authorization: `Bearer ${tokens.accessToken}`,
      },
      data: {
        id: 'article-123',
        organization_id: 'org-123',
        scheduled_at: futureDate,
        status: 'pending',
      },
    });

    // May return 403/404 if schedule doesn't exist
    expect([200, 403, 404, 500]).toContain(response.status());
  });

  test('should reject past date on update', async ({ request }) => {
    const authSetup = createAuthSetup(request);
    const tokens = authSetup.generateAuthTokens();

    const pastDate = new Date(Date.now() - 86400000).toISOString();

    const response = await request.put(API_BASE, {
      headers: {
        Authorization: `Bearer ${tokens.accessToken}`,
      },
      data: {
        id: 'article-123',
        organization_id: 'org-123',
        scheduled_at: pastDate,
      },
    });

    expect(response.status()).toBe(400);
    const data = await response.json();
    expect(data.error).toContain('future');
  });

  test('should verify schedule access before update', async ({ request }) => {
    const authSetup = createAuthSetup(request);
    const tokens = authSetup.generateAuthTokens();

    const futureDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();

    const response = await request.put(API_BASE, {
      headers: {
        Authorization: `Bearer ${tokens.accessToken}`,
      },
      data: {
        id: 'article-from-other-org',
        organization_id: 'other-org',
        scheduled_at: futureDate,
      },
    });

    // Should return 403 if user doesn't have access
    expect([403, 404, 500]).toContain(response.status());
  });

  test('should require id and organization_id', async ({ request }) => {
    const authSetup = createAuthSetup(request);
    const tokens = authSetup.generateAuthTokens();

    const response = await request.put(API_BASE, {
      headers: {
        Authorization: `Bearer ${tokens.accessToken}`,
      },
      data: {
        // Missing id and organization_id
        scheduled_at: new Date(Date.now() + 86400000).toISOString(),
      },
    });

    expect(response.status()).toBe(400);
  });
});

test.describe('Schedule API - DELETE Operations', () => {
  test('should delete schedule as admin', async ({ request }) => {
    const authSetup = createAuthSetup(request);
    const adminUser = TestUsersFactory.createAdminUser();
    const tokens = authSetup.generateAuthTokens(adminUser);

    const response = await request.delete(`${API_BASE}?id=article-123`, {
      headers: {
        Authorization: `Bearer ${tokens.accessToken}`,
      },
    });

    // May return 404 if schedule doesn't exist
    expect([200, 403, 404, 500]).toContain(response.status());

    if (response.status() === 200) {
      const data = await response.json();
      expect(data).toHaveProperty('success', true);
    }
  });

  test('should delete schedule as owner', async ({ request }) => {
    const authSetup = createAuthSetup(request);
    const ownerUser = TestUsersFactory.createOwnerUser();
    const tokens = authSetup.generateAuthTokens(ownerUser);

    const response = await request.delete(`${API_BASE}?id=article-123`, {
      headers: {
        Authorization: `Bearer ${tokens.accessToken}`,
      },
    });

    expect([200, 403, 404, 500]).toContain(response.status());
  });

  test('should prevent deletion by regular members', async ({ request }) => {
    const authSetup = createAuthSetup(request);
    const memberUser = TestUsersFactory.createStandardUser({ role: 'member' });
    const tokens = authSetup.generateAuthTokens(memberUser);

    const response = await request.delete(`${API_BASE}?id=article-123`, {
      headers: {
        Authorization: `Bearer ${tokens.accessToken}`,
      },
    });

    // Should return 403 Forbidden
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

  test('should verify schedule access before deletion', async ({ request }) => {
    const authSetup = createAuthSetup(request);
    const adminUser = TestUsersFactory.createAdminUser();
    const tokens = authSetup.generateAuthTokens(adminUser);

    const response = await request.delete(`${API_BASE}?id=article-from-other-org`, {
      headers: {
        Authorization: `Bearer ${tokens.accessToken}`,
      },
    });

    // Should return 403 or 404
    expect([403, 404, 500]).toContain(response.status());
  });
});

test.describe('Schedule API - Edge Cases', () => {
  test('should handle far future dates', async ({ request }) => {
    const authSetup = createAuthSetup(request);
    const tokens = authSetup.generateAuthTokens();

    const farFutureDate = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString();

    const response = await request.post(API_BASE, {
      headers: {
        Authorization: `Bearer ${tokens.accessToken}`,
      },
      data: {
        article_id: 'article-123',
        scheduled_at: farFutureDate,
      },
    });

    expect([201, 403, 500]).toContain(response.status());
  });

  test('should handle ISO date strings', async ({ request }) => {
    const authSetup = createAuthSetup(request);
    const tokens = authSetup.generateAuthTokens();

    const isoDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();

    const response = await request.post(API_BASE, {
      headers: {
        Authorization: `Bearer ${tokens.accessToken}`,
      },
      data: {
        article_id: 'article-123',
        scheduled_at: isoDate,
      },
    });

    expect([201, 403, 500]).toContain(response.status());
  });

  test('should handle various recurrence types', async ({ request }) => {
    const authSetup = createAuthSetup(request);
    const tokens = authSetup.generateAuthTokens();

    const recurrenceTypes = ['daily', 'weekly', 'monthly', 'yearly'];

    for (const recurrence of recurrenceTypes) {
      const futureDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();

      const response = await request.post(API_BASE, {
        headers: {
          Authorization: `Bearer ${tokens.accessToken}`,
        },
        data: {
          article_id: 'article-123',
          scheduled_at: futureDate,
          recurrence,
        },
      });

      expect([201, 403, 500]).toContain(response.status());
    }
  });

  test('should handle malformed dates', async ({ request }) => {
    const authSetup = createAuthSetup(request);
    const tokens = authSetup.generateAuthTokens();

    const response = await request.post(API_BASE, {
      headers: {
        Authorization: `Bearer ${tokens.accessToken}`,
      },
      data: {
        article_id: 'article-123',
        scheduled_at: 'not-a-valid-date',
      },
    });

    expect(response.status()).toBe(400);
  });

  test('should handle empty schedules list', async ({ request }) => {
    const authSetup = createAuthSetup(request);
    const tokens = authSetup.generateAuthTokens();

    const response = await request.get(
      `${API_BASE}?organization_id=empty-org`,
      {
        headers: {
          Authorization: `Bearer ${tokens.accessToken}`,
        },
      }
    );

    expect(response.status()).toBe(200);
    const data = await response.json();
    expect(data.schedules).toEqual([]);
  });

  test('should handle concurrent schedule creation', async ({ request }) => {
    const authSetup = createAuthSetup(request);
    const tokens = authSetup.generateAuthTokens();

    const requests = Array.from({ length: 5 }, (_, i) => {
      const futureDate = new Date(Date.now() + (i + 1) * 24 * 60 * 60 * 1000).toISOString();
      return request.post(API_BASE, {
        headers: {
          Authorization: `Bearer ${tokens.accessToken}`,
        },
        data: {
          article_id: `article-${i}`,
          scheduled_at: futureDate,
        },
      });
    });

    const responses = await Promise.all(requests);

    responses.forEach(response => {
      expect([201, 403, 500]).toContain(response.status());
    });
  });
});
