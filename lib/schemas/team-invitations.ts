/**
 * Team Invitations API Schemas
 *
 * Zod validation schemas for team invitation-related API routes.
 */

import { z } from 'zod';

/**
 * Create Team Invitation Schema
 *
 * POST /api/team-invitations
 */
export const createTeamInvitationSchema = z.object({
  organization_id: z.string().min(1, 'Organization ID is required'),
  email: z.string().email('Invalid email address'),
  role: z.enum(['owner', 'admin', 'editor', 'viewer']).optional().default('viewer'),
});

/**
 * Bulk Invite Team Members Schema
 *
 * POST /api/team-invitations (bulk mode)
 */
  bulk: z.literal(true),
  organization_id: z.string().min(1, 'Organization ID is required'),
  members: z
    .array(
      z.object({
        email: z.string().min(1, 'User ID is required'),
        role: z.enum(['owner', 'admin', 'editor', 'viewer']).optional().default('viewer'),
      })
    )
    .min(1, 'At least one member is required'),
});

/**
 * Validate Invitation Token Schema
 *
 * GET /api/team-invitations/validate?token=<token>
 */
export const validateInvitationTokenSchema = z.object({
  token: z.string().min(1, 'Token is required'),
});

/**
 * Accept Invitation Schema
 *
 * POST /api/team-invitations/accept
 */
export const acceptInvitationSchema = z.object({
  token: z.string().min(1, 'Token is required'),
});

/**
 * Cancel Invitation Schema
 *
 * DELETE /api/team-invitations/[id]
 */
export const cancelInvitationSchema = z.object({
  invitation_id: z.string().min(1, 'Invitation ID is required'),
});

/**
 * Resend Invitation Schema
 *
 * POST /api/team-invitations/[id]/resend
 */
export const resendInvitationSchema = z.object({
  invitation_id: z.string().min(1, 'Invitation ID is required'),
});

/**
 * Decline Invitation Schema
 *
 * POST /api/team-invitations/[id]/decline
 */
export const declineInvitationSchema = z.object({
  token: z.string().min(1, 'Token is required'),
});

/**
 * Get Pending Invitations Query Schema
 *
 * GET /api/team-invitations/pending
 */
export const pendingInvitationsQuerySchema = z.object({
  organization_id: z.string().min(1, 'Organization ID is required'),
});

/**
 * Check Invitation Status Schema
 *
 * GET /api/team-invitations/check?email=<email>
 */
export const checkInvitationStatusSchema = z.object({
  email: z.string().email('Invalid email address'),
});

/**
 * Invitation Email Template Schema
 */
export const invitationEmailDataSchema = z.object({
  organization_name: z.string(),
  inviter_name: z.string(),
  invite_link: z.string().url(),
  role: z.enum(['owner', 'admin', 'editor', 'viewer']),
});
