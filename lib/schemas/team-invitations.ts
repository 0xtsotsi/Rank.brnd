/**
 * Team Invitations API Schemas
 *
 * Zod validation schemas for team invitation-related API routes.
 */

import { z } from 'zod';

/**
 * Team member role enum (for invitations - different from team members)
 */
export const invitationTeamMemberRoleSchema = z.enum([
  'owner',
  'admin',
  'editor',
  'viewer',
]);

export type InvitationTeamMemberRole = z.infer<typeof invitationTeamMemberRoleSchema>;

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
  role: invitationTeamMemberRoleSchema.optional().default('viewer'),
});

/**
 * Bulk Invite Team Members Schema
 *
 * POST /api/team-invitations (bulk mode)
 */
export const bulkInviteTeamMembersSchema = z.object({
  bulk: z.literal(true),
  organization_id: z.string().min(1, 'Organization ID is required'),
  invitations: z
    .array(
      z.object({
        email: z.string().email('Invalid email address'),
        role: invitationTeamMemberRoleSchema.optional().default('viewer'),
      })
    )
    .min(1, 'At least one invitation is required')
    .max(50, 'Cannot send more than 50 invitations at once'),
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
  role: invitationTeamMemberRoleSchema,
});

// Namespace export to avoid conflicts with team-members
export namespace TeamInvitationsSchemas {
  export {
    createTeamInvitationSchema,
    bulkInviteTeamMembersSchema,
    validateInvitationTokenSchema,
    acceptInvitationSchema,
    cancelInvitationSchema,
    resendInvitationSchema,
    declineInvitationSchema,
    pendingInvitationsQuerySchema,
    checkInvitationStatusSchema,
    invitationEmailDataSchema,
    invitationTeamMemberRoleSchema,
    teamInvitationStatusSchema,
  };
}
