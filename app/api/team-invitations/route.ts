/**
 * Team Invitations API Route
 * Handles CRUD operations for team invitations
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { getSupabaseServerClient } from '@/lib/supabase/client';
import {
  getPendingInvitations,
  cancelTeamInvitation,
  createTeamInvitation,
} from '@/lib/supabase/team-invitations';
import { hasMinTeamRole } from '@/lib/supabase/team-members';
import {
  teamInvitationsQuerySchema,
  teamInvitationsPostSchema,
} from '@/lib/schemas/team-invitations';
import { ZodError } from 'zod';

/**
 * GET /api/team-invitations
 * Fetch team invitations with filtering
 */
export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const path = request.nextUrl.pathname;

    // Check if this is a request for pending invitations
    if (path.endsWith('/pending')) {
      const organizationId = searchParams.get('organization_id');
      if (!organizationId) {
        return NextResponse.json(
          { error: 'organization_id is required' },
          { status: 400 }
        );
      }

      const client = getSupabaseServerClient();

      // Verify user has admin or owner role
      const hasAccess = await hasMinTeamRole(
        client,
        organizationId,
        userId,
        'admin'
      );

      if (!hasAccess) {
        return NextResponse.json(
          { error: 'Forbidden - Insufficient permissions' },
          { status: 403 }
        );
      }

      const result = await getPendingInvitations(client, organizationId);

      if (!result.success) {
        return NextResponse.json({ error: result.error }, { status: 500 });
      }

      return NextResponse.json({
        invitations: result.data,
        total: result.data.length,
      });
    }

    // Parse and validate query parameters
    const queryParams = {
      organization_id: searchParams.get('organization_id') || undefined,
      status: searchParams.get('status') as
        | 'pending'
        | 'accepted'
        | 'declined'
        | 'expired'
        | 'cancelled'
        | null
        | undefined,
      sort: (searchParams.get('sort') as 'created_at' | 'expires_at' | 'email' | 'role') || 'created_at',
      order: (searchParams.get('order') as 'asc' | 'desc') || 'desc',
    };

    const validatedParams = teamInvitationsQuerySchema.parse(queryParams);

    // Verify user is a member of the organization
    const client = getSupabaseServerClient();
    const isMember = await hasMinTeamRole(
      client,
      validatedParams.organization_id,
      userId,
      'viewer'
    );

    if (!isMember) {
      return NextResponse.json(
        { error: 'Forbidden - Not a member of this organization' },
        { status: 403 }
      );
    }

    // Build the query
    let query = client
      .from('team_invitations')
      .select('*')
      .eq('organization_id', validatedParams.organization_id);

    if (validatedParams.status) {
      query = query.eq('status', validatedParams.status);
    }

    const { data, error } = await query.order(
      validatedParams.sort,
      { ascending: validatedParams.order === 'asc' }
    );

    if (error) throw error;

    return NextResponse.json({
      invitations: data || [],
      total: data?.length || 0,
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: 'Invalid query parameters', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Error fetching team invitations:', error);
    return NextResponse.json(
      { error: 'Failed to fetch team invitations' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/team-invitations
 * Create a team invitation or bulk create invitations
 */
export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = teamInvitationsPostSchema.parse(body);

    const client = getSupabaseServerClient();

    // Get the requesting user's internal ID
    const { data: userRecord } = await client
      .from('users')
      .select('id')
      .eq('clerk_id', userId)
      .single();

    if (!userRecord) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Verify user has admin or owner role in the organization
    const hasAccess = await hasMinTeamRole(
      client,
      validatedData.organization_id,
      userId,
      'admin'
    );

    if (!hasAccess) {
      return NextResponse.json(
        { error: 'Forbidden - Insufficient permissions to create invitations' },
        { status: 403 }
      );
    }

    if (validatedData.bulk && validatedData.invitations) {
      // Bulk invite
      const results = await Promise.allSettled(
        validatedData.invitations.map((invitation) =>
          createTeamInvitation(
            client,
            validatedData.organization_id,
            invitation.email,
            invitation.role,
            userRecord.id
          )
        )
      );

      const successful = results.filter(
        (r) => r.status === 'fulfilled' && r.value.success
      );
      const failed = results.filter(
        (r) => r.status === 'rejected' || (r.status === 'fulfilled' && !r.value.success)
      );

      return NextResponse.json({
        total: validatedData.invitations.length,
        successful: successful.length,
        failed: failed.length,
        invitations: successful.map((r) =>
          r.status === 'fulfilled' ? r.value.data : null
        ),
      });
    }

    // Single invitation creation
    const result = await createTeamInvitation(
      client,
      validatedData.organization_id,
      validatedData.email,
      validatedData.role,
      userRecord.id
    );

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    return NextResponse.json(result.data, { status: 201 });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Error creating team invitation:', error);
    return NextResponse.json(
      { error: 'Failed to create team invitation' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/team-invitations?invitation_id=<id>
 * Cancel/delete a team invitation
 */
export async function DELETE(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const invitationId = searchParams.get('invitation_id');

    if (!invitationId) {
      return NextResponse.json(
        { error: 'Invitation ID is required' },
        { status: 400 }
      );
    }

    const client = getSupabaseServerClient();

    // Cancel invitation (permissions are checked inside the function)
    const result = await cancelTeamInvitation(client, invitationId, userId);

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error canceling team invitation:', error);
    return NextResponse.json(
      { error: 'Failed to cancel team invitation' },
      { status: 500 }
    );
  }
}
