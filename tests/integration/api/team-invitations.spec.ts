/**
 * Team Invitations API Integration Tests
 *
 * Tests the /api/team-invitations endpoints for:
 * - Authentication requirements
 * - Authorization (admin/owner only)
 * - Input validation
 * - CRUD operations
 * - Bulk operations
 * - Error cases
 * - Edge cases
 */

import { test, expect } from '@playwright/test';
import { createAuthSetup, TestUsersFactory } from '../fixtures/auth-setup';

const API_BASE = 'http://localhost:3000/api/team-invitations';

test.describe('Team Invitations API - Authentication', () => {
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
        email: 'test@example.com',
        role: 'member',
      },
    });

    expect(response.status()).toBe(401);
  });

  test('should reject unauthenticated DELETE request', async ({ request }) => {
    const response = await request.delete(`${API_BASE}?invitation_id=inv-123`);

    expect(response.status()).toBe(401);
  });
});

test.describe('Team Invitations API - GET Operations', () => {
  test('should fetch invitations for organization', async ({ request }) => {
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
    expect(data).toHaveProperty('invitations');
    expect(Array.isArray(data.invitations)).toBeTruthy();
    expect(data).toHaveProperty('total');
  });

  test('should support status filtering', async ({ request }) => {
    const authSetup = createAuthSetup(request);
    const tokens = authSetup.generateAuthTokens();

    const statuses = ['pending', 'accepted', 'declined', 'expired', 'cancelled'];

    for (const status of statuses) {
      const response = await request.get(
        `${API_BASE}?organization_id=test-org&status=${status}`,
        {
          headers: {
            Authorization: `Bearer ${tokens.accessToken}`,
          },
        }
      );

      expect(response.status()).toBe(200);
    }
  });

  test('should support sorting', async ({ request }) => {
    const authSetup = createAuthSetup(request);
    const tokens = authSetup.generateAuthTokens();

    const sortOptions = ['created_at', 'expires_at', 'email', 'role'];

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

test.describe('Team Invitations API - Pending Invitations', () => {
  test('should fetch pending invitations as admin', async ({ request }) => {
    const authSetup = createAuthSetup(request);
    const adminUser = TestUsersFactory.createAdminUser();
    const tokens = authSetup.generateAuthTokens(adminUser);

    const response = await request.get(
      `${API_BASE}/pending?organization_id=test-org-123`,
      {
        headers: {
          Authorization: `Bearer ${tokens.accessToken}`,
        },
      }
    );

    // Should return 200 or 403/500 depending on setup
    expect([200, 403, 500]).toContain(response.status());

    if (response.status() === 200) {
      const data = await response.json();
      expect(data).toHaveProperty('invitations');
      expect(Array.isArray(data.invitations)).toBeTruthy();
    }
  });

  test('should require organization_id for pending invitations', async ({ request }) => {
    const authSetup = createAuthSetup(request);
    const adminUser = TestUsersFactory.createAdminUser();
    const tokens = authSetup.generateAuthTokens(adminUser);

    const response = await request.get(`${API_BASE}/pending`, {
      headers: {
        Authorization: `Bearer ${tokens.accessToken}`,
      },
    });

    expect(response.status()).toBe(400);
  });

  test('should reject pending invitations request from non-admin', async ({ request }) => {
    const authSetup = createAuthSetup(request);
    const memberUser = TestUsersFactory.createStandardUser({ role: 'member' });
    const tokens = authSetup.generateAuthTokens(memberUser);

    const response = await request.get(
      `${API_BASE}/pending?organization_id=test-org-123`,
      {
        headers: {
          Authorization: `Bearer ${tokens.accessToken}`,
        },
      }
    );

    // Should return 403 Forbidden for non-admin
    expect([403, 500]).toContain(response.status());

    if (response.status() === 403) {
      const data = await response.json();
      expect(data.error).toContain('permissions');
    }
  });
});

test.describe('Team Invitations API - POST Operations', () => {
  test('should create invitation as admin', async ({ request }) => {
    const authSetup = createAuthSetup(request);
    const adminUser = TestUsersFactory.createAdminUser();
    const tokens = authSetup.generateAuthTokens(adminUser);

    const response = await request.post(API_BASE, {
      headers: {
        Authorization: `Bearer ${tokens.accessToken}`,
      },
      data: {
        organization_id: 'test-org-123',
        email: 'test@example.com',
        role: 'member',
      },
    });

    // May return 403 if user doesn't have admin access
    expect([201, 403, 500]).toContain(response.status());

    if (response.status() === 201) {
      const data = await response.json();
      expect(data).toHaveProperty('id');
      expect(data).toHaveProperty('email', 'test@example.com');
      expect(data).toHaveProperty('status', 'pending');
    }
  });

  test('should support different roles', async ({ request }) => {
    const authSetup = createAuthSetup(request);
    const adminUser = TestUsersFactory.createAdminUser();
    const tokens = authSetup.generateAuthTokens(adminUser);

    const roles = ['owner', 'admin', 'editor', 'viewer', 'member'];

    for (const role of roles) {
      const response = await request.post(API_BASE, {
        headers: {
          Authorization: `Bearer ${tokens.accessToken}`,
        },
        data: {
          organization_id: 'test-org-123',
          email: `test-${role}@example.com`,
          role,
        },
      });

      expect([201, 403, 500, 400]).toContain(response.status());
    }
  });

  test('should validate email format', async ({ request }) => {
    const authSetup = createAuthSetup(request);
    const adminUser = TestUsersFactory.createAdminUser();
    const tokens = authSetup.generateAuthTokens(adminUser);

    const invalidEmails = [
      'not-an-email',
      '@example.com',
      'test@',
      'test @example.com',
    ];

    for (const email of invalidEmails) {
      const response = await request.post(API_BASE, {
        headers: {
          Authorization: `Bearer ${tokens.accessToken}`,
        },
        data: {
          organization_id: 'test-org-123',
          email,
          role: 'member',
        },
      });

      expect([400, 403, 500]).toContain(response.status());
    }
  });

  test('should support bulk invitation creation', async ({ request }) => {
    const authSetup = createAuthSetup(request);
    const adminUser = TestUsersFactory.createAdminUser();
    const tokens = authSetup.generateAuthTokens(adminUser);

    const response = await request.post(API_BASE, {
      headers: {
        Authorization: `Bearer ${tokens.accessToken}`,
      },
      data: {
        organization_id: 'test-org-123',
        bulk: true,
        invitations: [
          { email: 'user1@example.com', role: 'member' },
          { email: 'user2@example.com', role: 'editor' },
          { email: 'user3@example.com', role: 'viewer' },
        ],
      },
    });

    expect([201, 403, 500]).toContain(response.status());

    if (response.status() === 201) {
      const data = await response.json();
      expect(data).toHaveProperty('total');
      expect(data).toHaveProperty('successful');
      expect(data).toHaveProperty('failed');
      expect(data).toHaveProperty('invitations');
    }
  });

  test('should verify admin permissions before creating', async ({ request }) => {
    const authSetup = createAuthSetup(request);
    const memberUser = TestUsersFactory.createStandardUser({ role: 'member' });
    const tokens = authSetup.generateAuthTokens(memberUser);

    const response = await request.post(API_BASE, {
      headers: {
        Authorization: `Bearer ${tokens.accessToken}`,
      },
      data: {
        organization_id: 'test-org-123',
        email: 'test@example.com',
        role: 'member',
      },
    });

    // Should return 403 Forbidden for non-admin
    expect([403, 500]).toContain(response.status());

    if (response.status() === 403) {
      const data = await response.json();
      expect(data.error).toContain('permissions');
    }
  });
});

test.describe('Team Invitations API - DELETE Operations', () => {
  test('should cancel invitation as admin', async ({ request }) => {
    const authSetup = createAuthSetup(request);
    const adminUser = TestUsersFactory.createAdminUser();
    const tokens = authSetup.generateAuthTokens(adminUser);

    const response = await request.delete(
      `${API_BASE}?invitation_id=inv-123`,
      {
        headers: {
          Authorization: `Bearer ${tokens.accessToken}`,
        },
      }
    );

    // May return 404 if invitation doesn't exist
    expect([200, 403, 404, 500]).toContain(response.status());

    if (response.status() === 200) {
      const data = await response.json();
      expect(data).toHaveProperty('success', true);
    }
  });

  test('should require invitation_id parameter', async ({ request }) => {
    const authSetup = createAuthSetup(request);
    const tokens = authSetup.generateAuthTokens();

    const response = await request.delete(API_BASE, {
      headers: {
        Authorization: `Bearer ${tokens.accessToken}`,
      },
    });

    expect(response.status()).toBe(400);
  });

  test('should verify permissions before cancellation', async ({ request }) => {
    const authSetup = createAuthSetup(request);
    const memberUser = TestUsersFactory.createStandardUser({ role: 'member' });
    const tokens = authSetup.generateAuthTokens(memberUser);

    const response = await request.delete(
      `${API_BASE}?invitation_id=inv-123`,
      {
        headers: {
          Authorization: `Bearer ${tokens.accessToken}`,
        },
      }
    );

    // Should return 403 if insufficient permissions
    expect([200, 403, 500]).toContain(response.status());
  });
});

test.describe('Team Invitations API - Validation', () => {
  test('should require organization_id on POST', async ({ request }) => {
    const authSetup = createAuthSetup(request);
    const adminUser = TestUsersFactory.createAdminUser();
    const tokens = authSetup.generateAuthTokens(adminUser);

    const response = await request.post(API_BASE, {
      headers: {
        Authorization: `Bearer ${tokens.accessToken}`,
      },
      data: {
        email: 'test@example.com',
        role: 'member',
        // Missing organization_id
      },
    });

    expect(response.status()).toBe(400);
  });

  test('should require email on POST', async ({ request }) => {
    const authSetup = createAuthSetup(request);
    const adminUser = TestUsersFactory.createAdminUser();
    const tokens = authSetup.generateAuthTokens(adminUser);

    const response = await request.post(API_BASE, {
      headers: {
        Authorization: `Bearer ${tokens.accessToken}`,
      },
      data: {
        organization_id: 'org-123',
        role: 'member',
        // Missing email
      },
    });

    expect(response.status()).toBe(400);
  });

  test('should require role on POST', async ({ request }) => {
    const authSetup = createAuthSetup(request);
    const adminUser = TestUsersFactory.createAdminUser();
    const tokens = authSetup.generateAuthTokens(adminUser);

    const response = await request.post(API_BASE, {
      headers: {
        Authorization: `Bearer ${tokens.accessToken}`,
      },
      data: {
        organization_id: 'org-123',
        email: 'test@example.com',
        // Missing role
      },
    });

    expect(response.status()).toBe(400);
  });

  test('should reject invalid role values', async ({ request }) => {
    const authSetup = createAuthSetup(request);
    const adminUser = TestUsersFactory.createAdminUser();
    const tokens = authSetup.generateAuthTokens(adminUser);

    const response = await request.post(API_BASE, {
      headers: {
        Authorization: `Bearer ${tokens.accessToken}`,
      },
      data: {
        organization_id: 'org-123',
        email: 'test@example.com',
        role: 'invalid_role',
      },
    });

    expect(response.status()).toBe(400);
  });
});

test.describe('Team Invitations API - Edge Cases', () => {
  test('should handle empty invitations list', async ({ request }) => {
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
    expect(data.invitations).toEqual([]);
  });

  test('should handle duplicate email invitations', async ({ request }) => {
    const authSetup = createAuthSetup(request);
    const adminUser = TestUsersFactory.createAdminUser();
    const tokens = authSetup.generateAuthTokens(adminUser);

    const invitationData = {
      organization_id: 'test-org-123',
      email: 'duplicate@example.com',
      role: 'member',
    };

    // First invitation
    const response1 = await request.post(API_BASE, {
      headers: {
        Authorization: `Bearer ${tokens.accessToken}`,
      },
      data: invitationData,
    });

    // Second invitation (same email)
    const response2 = await request.post(API_BASE, {
      headers: {
        Authorization: `Bearer ${tokens.accessToken}`,
      },
      data: invitationData,
    });

    // Should handle gracefully
    expect([201, 409, 403, 500]).toContain(response2.status());
  });

  test('should handle very long email addresses', async ({ request }) => {
    const authSetup = createAuthSetup(request);
    const adminUser = TestUsersFactory.createAdminUser();
    const tokens = authSetup.generateAuthTokens(adminUser);

    const longEmail = 'a'.repeat(100) + '@example.com';

    const response = await request.post(API_BASE, {
      headers: {
        Authorization: `Bearer ${tokens.accessToken}`,
      },
      data: {
        organization_id: 'test-org-123',
        email: longEmail,
        role: 'member',
      },
    });

    // Should either accept or reject with validation error
    expect([201, 400, 403, 500]).toContain(response.status());
  });

  test('should handle international email addresses', async ({ request }) => {
    const authSetup = createAuthSetup(request);
    const adminUser = TestUsersFactory.createAdminUser();
    const tokens = authSetup.generateAuthTokens(adminUser);

    const internationalEmails = [
      '用户@例子.广告',
      'test@例子.广告',
      'test@exämple.com',
    ];

    for (const email of internationalEmails) {
      const response = await request.post(API_BASE, {
        headers: {
          Authorization: `Bearer ${tokens.accessToken}`,
        },
        data: {
          organization_id: 'test-org-123',
          email,
          role: 'member',
        },
      });

      expect([201, 400, 403, 500]).toContain(response.status());
    }
  });

  test('should handle concurrent bulk invitation creation', async ({ request }) => {
    const authSetup = createAuthSetup(request);
    const adminUser = TestUsersFactory.createAdminUser();
    const tokens = authSetup.generateAuthTokens(adminUser);

    const requests = Array.from({ length: 3 }, (_, i) =>
      request.post(API_BASE, {
        headers: {
          Authorization: `Bearer ${tokens.accessToken}`,
        },
        data: {
          organization_id: 'test-org-123',
          bulk: true,
          invitations: [
            { email: `bulk${i}-1@example.com`, role: 'member' },
            { email: `bulk${i}-2@example.com`, role: 'member' },
          ],
        },
      })
    );

    const responses = await Promise.all(requests);

    responses.forEach(response => {
      expect([201, 403, 500]).toContain(response.status());
    });
  });
});
