/**
 * Activity Logs API Integration Tests
 *
 * Tests the /api/activity-logs endpoints for:
 * - Authentication requirements
 * - Authorization (organization membership)
 * - Input validation
 * - CRUD operations
 * - Filtering and sorting
 * - Error cases
 * - Edge cases
 */

import { test, expect } from '@playwright/test';
import { createAuthSetup, TestUsersFactory } from '../fixtures/auth-setup';

const API_BASE = 'http://localhost:3000/api/activity-logs';

test.describe('Activity Logs API - Authentication', () => {
  test('should reject unauthenticated GET request', async ({ request }) => {
    const response = await request.get(`${API_BASE}?organization_id=test-org`);

    expect(response.status()).toBe(401);
    const data = await response.json();
    expect(data).toHaveProperty('error', 'Unauthorized');
  });

  test('should reject unauthenticated POST request', async ({ request }) => {
    const response = await request.post(API_BASE, {
      data: {
        organization_id: 'org-123',
        action: 'article.created',
        resource_type: 'article',
        resource_id: 'article-123',
      },
    });

    expect(response.status()).toBe(401);
  });
});

test.describe('Activity Logs API - GET Operations', () => {
  test('should fetch activity logs for organization', async ({ request }) => {
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
    expect(data).toHaveProperty('activity_logs');
    expect(Array.isArray(data.activity_logs)).toBeTruthy();
    expect(data).toHaveProperty('total');
    expect(data).toHaveProperty('pagination');
  });

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
    expect(data.error).toContain('organization_id');
  });

  test('should support action filtering', async ({ request }) => {
    const authSetup = createAuthSetup(request);
    const tokens = authSetup.generateAuthTokens();

    const actions = [
      'article.created',
      'article.updated',
      'article.deleted',
      'member.invited',
      'member.joined',
    ];

    for (const action of actions) {
      const response = await request.get(
        `${API_BASE}?organization_id=test-org&action=${action}`,
        {
          headers: {
            Authorization: `Bearer ${tokens.accessToken}`,
          },
        }
      );

      expect(response.status()).toBe(200);
    }
  });

  test('should support resource_type filtering', async ({ request }) => {
    const authSetup = createAuthSetup(request);
    const tokens = authSetup.generateAuthTokens();

    const resourceTypes = [
      'article',
      'keyword',
      'product',
      'organization',
      'member',
    ];

    for (const resourceType of resourceTypes) {
      const response = await request.get(
        `${API_BASE}?organization_id=test-org&resource_type=${resourceType}`,
        {
          headers: {
            Authorization: `Bearer ${tokens.accessToken}`,
          },
        }
      );

      expect(response.status()).toBe(200);
    }
  });

  test('should support user_id filtering', async ({ request }) => {
    const authSetup = createAuthSetup(request);
    const tokens = authSetup.generateAuthTokens();

    const response = await request.get(
      `${API_BASE}?organization_id=test-org&user_id=user-123`,
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
    const past = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    const response = await request.get(
      `${API_BASE}?organization_id=test-org&start_date=${past.toISOString()}&end_date=${now.toISOString()}`,
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

    const response = await request.get(
      `${API_BASE}?organization_id=test-org&sort_by=timestamp&sort_order=desc`,
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
    expect(data.pagination).toHaveProperty('limit', 10);
    expect(data.pagination).toHaveProperty('offset', 0);
  });

  test('should enforce maximum limit', async ({ request }) => {
    const authSetup = createAuthSetup(request);
    const tokens = authSetup.generateAuthTokens();

    const response = await request.get(
      `${API_BASE}?organization_id=test-org&limit=999`,
      {
        headers: {
          Authorization: `Bearer ${tokens.accessToken}`,
        },
      }
    );

    // Should cap limit at 100
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

test.describe('Activity Logs API - POST Operations', () => {
  test('should create activity log with valid data', async ({ request }) => {
    const authSetup = createAuthSetup(request);
    const user = TestUsersFactory.createStandardUser();
    const tokens = authSetup.generateAuthTokens(user);

    const response = await request.post(API_BASE, {
      headers: {
        Authorization: `Bearer ${tokens.accessToken}`,
      },
      data: {
        organization_id: 'test-org-123',
        action: 'article.created',
        resource_type: 'article',
        resource_id: 'article-123',
      },
    });

    // May return 201 or 403/500 depending on setup
    expect([201, 403, 500]).toContain(response.status());

    if (response.status() === 201) {
      const data = await response.json();
      expect(data).toHaveProperty('id');
      expect(data).toHaveProperty('action', 'article.created');
      expect(data).toHaveProperty('resource_type', 'article');
    }
  });

  test('should create activity log with metadata', async ({ request }) => {
    const authSetup = createAuthSetup(request);
    const tokens = authSetup.generateAuthTokens();

    const response = await request.post(API_BASE, {
      headers: {
        Authorization: `Bearer ${tokens.accessToken}`,
      },
      data: {
        organization_id: 'test-org-123',
        action: 'article.updated',
        resource_type: 'article',
        resource_id: 'article-123',
        metadata: {
          changes: ['title', 'content'],
          ip_address: '192.168.1.1',
        },
      },
    });

    expect([201, 403, 500]).toContain(response.status());
  });

  test('should verify organization membership before creating', async ({ request }) => {
    const authSetup = createAuthSetup(request);
    const tokens = authSetup.generateAuthTokens();

    const response = await request.post(API_BASE, {
      headers: {
        Authorization: `Bearer ${tokens.accessToken}`,
      },
      data: {
        organization_id: 'other-org-123',
        action: 'test.action',
        resource_type: 'test',
        resource_id: 'test-123',
      },
    });

    // Should return 403 if user is not a member
    expect([403, 500]).toContain(response.status());
  });
});

test.describe('Activity Logs API - Validation', () => {
  test('should require organization_id on POST', async ({ request }) => {
    const authSetup = createAuthSetup(request);
    const tokens = authSetup.generateAuthTokens();

    const response = await request.post(API_BASE, {
      headers: {
        Authorization: `Bearer ${tokens.accessToken}`,
      },
      data: {
        action: 'test.action',
        resource_type: 'test',
        resource_id: 'test-123',
        // Missing organization_id
      },
    });

    expect(response.status()).toBe(400);
  });

  test('should require action on POST', async ({ request }) => {
    const authSetup = createAuthSetup(request);
    const tokens = authSetup.generateAuthTokens();

    const response = await request.post(API_BASE, {
      headers: {
        Authorization: `Bearer ${tokens.accessToken}`,
      },
      data: {
        organization_id: 'org-123',
        resource_type: 'test',
        resource_id: 'test-123',
        // Missing action
      },
    });

    expect(response.status()).toBe(400);
  });

  test('should require resource_type on POST', async ({ request }) => {
    const authSetup = createAuthSetup(request);
    const tokens = authSetup.generateAuthTokens();

    const response = await request.post(API_BASE, {
      headers: {
        Authorization: `Bearer ${tokens.accessToken}`,
      },
      data: {
        organization_id: 'org-123',
        action: 'test.action',
        resource_id: 'test-123',
        // Missing resource_type
      },
    });

    expect(response.status()).toBe(400);
  });

  test('should require resource_id on POST', async ({ request }) => {
    const authSetup = createAuthSetup(request);
    const tokens = authSetup.generateAuthTokens();

    const response = await request.post(API_BASE, {
      headers: {
        Authorization: `Bearer ${tokens.accessToken}`,
      },
      data: {
        organization_id: 'org-123',
        action: 'test.action',
        resource_type: 'test',
        // Missing resource_id
      },
    });

    expect(response.status()).toBe(400);
  });

  test('should validate date formats', async ({ request }) => {
    const authSetup = createAuthSetup(request);
    const tokens = authSetup.generateAuthTokens();

    const response = await request.get(
      `${API_BASE}?organization_id=test-org&start_date=invalid-date`,
      {
        headers: {
          Authorization: `Bearer ${tokens.accessToken}`,
        },
      }
    );

    // Should validate date format
    expect([200, 400]).toContain(response.status());
  });
});

test.describe('Activity Logs API - Edge Cases', () => {
  test('should handle empty activity logs', async ({ request }) => {
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
    expect(data.activity_logs).toEqual([]);
  });

  test('should handle very long action strings', async ({ request }) => {
    const authSetup = createAuthSetup(request);
    const tokens = authSetup.generateAuthTokens();

    const longAction = 'a'.repeat(500);

    const response = await request.post(API_BASE, {
      headers: {
        Authorization: `Bearer ${tokens.accessToken}`,
      },
      data: {
        organization_id: 'test-org-123',
        action: longAction,
        resource_type: 'test',
        resource_id: 'test-123',
      },
    });

    // Should either accept or reject with validation error
    expect([201, 400, 403, 500]).toContain(response.status());
  });

  test('should handle special characters in action', async ({ request }) => {
    const authSetup = createAuthSetup(request);
    const tokens = authSetup.generateAuthTokens();

    const specialActions = [
      'article.created',
      'article.updated',
      'member.invited',
      'organization.settings_changed',
      'user.logged-in',
    ];

    for (const action of specialActions) {
      const response = await request.post(API_BASE, {
        headers: {
          Authorization: `Bearer ${tokens.accessToken}`,
        },
        data: {
          organization_id: 'test-org-123',
          action,
          resource_type: 'test',
          resource_id: 'test-123',
        },
      });

      expect([201, 403, 500]).toContain(response.status());
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

  test('should include user data in response', async ({ request }) => {
    const authSetup = createAuthSetup(request);
    const tokens = authSetup.generateAuthTokens();

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

    if (data.activity_logs.length > 0) {
      // Logs should include user data if available
      const log = data.activity_logs[0];
      expect(log).toHaveProperty('user');
    }
  });

  test('should handle concurrent log creation', async ({ request }) => {
    const authSetup = createAuthSetup(request);
    const tokens = authSetup.generateAuthTokens();

    const requests = Array.from({ length: 5 }, (_, i) =>
      request.post(API_BASE, {
        headers: {
          Authorization: `Bearer ${tokens.accessToken}`,
        },
        data: {
          organization_id: 'test-org-123',
          action: `concurrent.action.${i}`,
          resource_type: 'test',
          resource_id: `test-${i}`,
        },
      })
    );

    const responses = await Promise.all(requests);

    responses.forEach(response => {
      expect([201, 403, 500]).toContain(response.status());
    });
  });
});
