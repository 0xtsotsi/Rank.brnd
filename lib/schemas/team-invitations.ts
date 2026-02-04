/**
 * Team Invitations API Schemas
 *
 * Zod validation schemas for team invitation-related API routes.
 */

import { z } from 'zod';

/**
 * Team member role enum
 */
export const teamMemberRoleSchema = z.enum([
  'owner',
  'admin',
  'editor',
  'viewer',
]);

export type TeamMemberRole = z.infer<typeof teamMemberRoleSchema>;

/**
 * Team invitation status enum
 */
export const teamInvitationStatusSchema = z.enum([
  'pending',
  'accepted',
  'declined',
  'expired',
  'cancelled',
]);

export type TeamInvitationStatus = z.infer<typeof teamInvitationStatusSchema>;

/**
 * Create Team Invitation Schema
 *
 * POST /api/team-invitations
 */
export const createTeamInvitationSchema = z.object({
  organization_id: z.string().min(1, 'Organization ID is required'),
  email: z.string().email('Invalid email address'),
  role: teamMemberRoleSchema.optional().default('viewer'),
});

/**
 * Bulk Invite Team Members Schema
 *
 * POST /api/team-invitations (bulk mode)
 */
export const bulkCreateTeamInvitationsSchema = z.object({
  bulk: z.literal(true),
  organization_id: z.string().min(1, 'Organization ID is required'),
  invitations: z
    .array(
      z.object({
        email: z.string().email('Invalid email address'),
        role: teamMemberRoleSchema.optional().default('viewer'),
      })
    )
    .min(1, 'At least one invitation is required')
    .max(50, 'Cannot send more than 50 invitations at once'),
});

/**
 * Combined POST schema for team invitations (single or bulk)
 */
export const teamInvitationsPostSchema = z.discriminatedUnion('bulk', [
  bulkCreateTeamInvitationsSchema,
  createTeamInvitationSchema
    .extend({
      bulk: z.literal(false).optional(),
    })
    .transform((val) => ({ ...val, bulk: false as const })),
]);

/**
 * Team Invitations Query Schema
 *
 * GET /api/team-invitations
 */
export const teamInvitationsQuerySchema = z.object({
  organization_id: z.string().min(1, 'Organization ID is required'),
  status: teamInvitationStatusSchema.optional(),
  sort: z
    .enum(['created_at', 'expires_at', 'email', 'role'])
    .optional()
    .default('created_at'),
  order: z.enum(['asc', 'desc']).optional().default('desc'),
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
  role: teamMemberRoleSchema,
});
