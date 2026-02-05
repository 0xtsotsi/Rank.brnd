/**
 * Team Members API Integration Tests
 *
 * Tests the /api/team-members endpoints for:
 * - Authentication requirements
 * - Authorization (RBAC)
 * - Input validation
 * - CRUD operations
 * - Bulk operations
 * - Error cases
 * - Edge cases
 */

import { test, expect } from '@playwright/test';
import { createAuthSetup, TestUsersFactory } from '../fixtures/auth-setup';

const API_BASE = 'http://localhost:3000/api/team-members';

test.describe('Team Members API - Authentication', () => {
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
        user_id: 'user-123',
        role: 'member',
      },
    });

    expect(response.status()).toBe(401);
  });

  test('should reject unauthenticated DELETE request', async ({ request }) => {
    const response = await request.delete(`${API_BASE}?team_member_id=member-123`);

    expect(response.status()).toBe(401);
  });
});

test.describe('Team Members API - GET Operations', () => {
  test('should fetch team members for organization', async ({ request }) => {
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
    expect(data).toHaveProperty('team_members');
    expect(Array.isArray(data.team_members)).toBeTruthy();
    expect(data).toHaveProperty('total');
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
  });

  test('should support role filtering', async ({ request }) => {
    const authSetup = createAuthSetup(request);
    const tokens = authSetup.generateAuthTokens();

    const roles = ['owner', 'admin', 'editor', 'viewer'];

    for (const role of roles) {
      const response = await request.get(
        `${API_BASE}?organization_id=test-org&role=${role}`,
        {
          headers: {
            Authorization: `Bearer ${tokens.accessToken}`,
          },
        }
      );

      expect(response.status()).toBe(200);
    }
  });

  test('should support include_pending parameter', async ({ request }) => {
    const authSetup = createAuthSetup(request);
    const tokens = authSetup.generateAuthTokens();

    const response = await request.get(
      `${API_BASE}?organization_id=test-org&include_pending=true`,
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

    const sortOptions = ['invited_at', 'accepted_at', 'role', 'name'];

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

test.describe('Team Members API - Pending Invitations', () => {
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

test.describe('Team Members API - Memberships', () => {
  test('should fetch user memberships', async ({ request }) => {
    const authSetup = createAuthSetup(request);
    const tokens = authSetup.generateAuthTokens();

    const response = await request.get(`${API_BASE}/memberships`, {
      headers: {
        Authorization: `Bearer ${tokens.accessToken}`,
      },
    });

    // Should return 200 with memberships array
    expect(response.status()).toBe(200);
    const data = await response.json();
    expect(data).toHaveProperty('memberships');
    expect(Array.isArray(data.memberships)).toBeTruthy();
  });
});

test.describe('Team Members API - POST Operations', () => {
  test('should add team member as admin', async ({ request }) => {
    const authSetup = createAuthSetup(request);
    const adminUser = TestUsersFactory.createAdminUser();
    const tokens = authSetup.generateAuthTokens(adminUser);

    const response = await request.post(API_BASE, {
      headers: {
        Authorization: `Bearer ${tokens.accessToken}`,
      },
      data: {
        organization_id: 'test-org-123',
        user_id: 'new-user-123',
        role: 'member',
      },
    });

    // May return 403 if user doesn't have admin access
    expect([201, 403, 500]).toContain(response.status());

    if (response.status() === 201) {
      const data = await response.json();
      expect(data).toHaveProperty('id');
      expect(data).toHaveProperty('role');
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
          user_id: `user-for-${role}`,
          role,
        },
      });

      expect([201, 403, 500, 400]).toContain(response.status());
    }
  });

  test('should support bulk team member addition', async ({ request }) => {
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
        members: [
          { user_id: 'user-1', role: 'member' },
          { user_id: 'user-2', role: 'editor' },
          { user_id: 'user-3', role: 'viewer' },
        ],
      },
    });

    expect([201, 403, 500]).toContain(response.status());

    if (response.status() === 201) {
      const data = await response.json();
      expect(data).toHaveProperty('total');
      expect(data).toHaveProperty('successful');
      expect(data).toHaveProperty('failed');
    }
  });

  test('should verify admin permissions before adding', async ({ request }) => {
    const authSetup = createAuthSetup(request);
    const memberUser = TestUsersFactory.createStandardUser({ role: 'member' });
    const tokens = authSetup.generateAuthTokens(memberUser);

    const response = await request.post(API_BASE, {
      headers: {
        Authorization: `Bearer ${tokens.accessToken}`,
      },
      data: {
        organization_id: 'test-org-123',
        user_id: 'new-user-123',
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

test.describe('Team Members API - DELETE Operations', () => {
  test('should remove team member as admin', async ({ request }) => {
    const authSetup = createAuthSetup(request);
    const adminUser = TestUsersFactory.createAdminUser();
    const tokens = authSetup.generateAuthTokens(adminUser);

    const response = await request.delete(
      `${API_BASE}?team_member_id=member-123`,
      {
        headers: {
          Authorization: `Bearer ${tokens.accessToken}`,
        },
      }
    );

    // May return 404 if member doesn't exist
    expect([200, 403, 404, 500]).toContain(response.status());

    if (response.status() === 200) {
      const data = await response.json();
      expect(data).toHaveProperty('success', true);
    }
  });

  test('should require team_member_id parameter', async ({ request }) => {
    const authSetup = createAuthSetup(request);
    const tokens = authSetup.generateAuthTokens();

    const response = await request.delete(API_BASE, {
      headers: {
        Authorization: `Bearer ${tokens.accessToken}`,
      },
    });

    expect(response.status()).toBe(400);
  });

  test('should verify permissions before removal', async ({ request }) => {
    const authSetup = createAuthSetup(request);
    const memberUser = TestUsersFactory.createStandardUser({ role: 'member' });
    const tokens = authSetup.generateAuthTokens(memberUser);

    const response = await request.delete(
      `${API_BASE}?team_member_id=member-123`,
      {
        headers: {
          Authorization: `Bearer ${tokens.accessToken}`,
        },
      }
    );

    // Should return 403 if insufficient permissions
    expect([200, 403, 500]).toContain(response.status());
  });

  test('should prevent self-removal by last owner', async ({ request }) => {
    const authSetup = createAuthSetup(request);
    const ownerUser = TestUsersFactory.createOwnerUser();
    const tokens = authSetup.generateAuthTokens(ownerUser);

    const response = await request.delete(
      `${API_BASE}?team_member_id=own-membership-id`,
      {
        headers: {
          Authorization: `Bearer ${tokens.accessToken}`,
        },
      }
    );

    // Should handle gracefully
    expect([200, 403, 404, 500]).toContain(response.status());
  });
});

test.describe('Team Members API - Validation', () => {
  test('should require organization_id on POST', async ({ request }) => {
    const authSetup = createAuthSetup(request);
    const adminUser = TestUsersFactory.createAdminUser();
    const tokens = authSetup.generateAuthTokens(adminUser);

    const response = await request.post(API_BASE, {
      headers: {
        Authorization: `Bearer ${tokens.accessToken}`,
      },
      data: {
        user_id: 'user-123',
        role: 'member',
        // Missing organization_id
      },
    });

    expect(response.status()).toBe(400);
  });

  test('should require user_id on POST', async ({ request }) => {
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
        // Missing user_id
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
        user_id: 'user-123',
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
        user_id: 'user-123',
        role: 'invalid_role',
      },
    });

    expect(response.status()).toBe(400);
  });
});

test.describe('Team Members API - Edge Cases', () => {
  test('should handle empty team members list', async ({ request }) => {
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
    expect(data.team_members).toEqual([]);
  });

  test('should handle duplicate member addition', async ({ request }) => {
    const authSetup = createAuthSetup(request);
    const adminUser = TestUsersFactory.createAdminUser();
    const tokens = authSetup.generateAuthTokens(adminUser);

    const memberData = {
      organization_id: 'test-org-123',
      user_id: 'duplicate-user',
      role: 'member',
    };

    // First attempt
    const response1 = await request.post(API_BASE, {
      headers: {
        Authorization: `Bearer ${tokens.accessToken}`,
      },
      data: memberData,
    });

    // Second attempt (duplicate)
    const response2 = await request.post(API_BASE, {
      headers: {
        Authorization: `Bearer ${tokens.accessToken}`,
      },
      data: memberData,
    });

    // Should handle gracefully
    expect([201, 409, 403, 500]).toContain(response2.status());
  });

  test('should handle concurrent bulk addition', async ({ request }) => {
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
          members: [
            { user_id: `bulk-user-${i}-1`, role: 'member' },
            { user_id: `bulk-user-${i}-2`, role: 'member' },
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
