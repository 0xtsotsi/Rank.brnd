/**
 * Team Invitations API Route
 * Handles CRUD operations for team invitations
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { getSupabaseServerClient } from '@/lib/supabase/client';
import {
  getPendingInvitations,
  createTeamInvitation,
} from '@/lib/supabase/team-invitations';
import {
  getPendingInvitationsQuerySchema,
  createTeamInvitationSchema,
} from '@/lib/schemas/team-invitations';
import { hasMinTeamRole } from '@/lib/supabase/team-members';

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
          { error: 'Insufficient permissions' },
          { status: 403 }
        );
      }

      const { data: invitations } = await getPendingInvitations(
        client,
        organizationId
      );

      return NextResponse.json(invitations);
    }

    // Get all invitations for organization
    const organizationId = searchParams.get('organization_id');
    if (!organizationId) {
      return NextResponse.json(
        { error: 'organization_id is required' },
        { status: 400 }
      );
    }

    const { data: invitations } = await getPendingInvitations(
      client,
      organizationId
    );

    return NextResponse.json(invitations);
  } catch (error) {
    console.error('Error fetching team invitations:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/team-invitations
 * Create team invitation
 */
export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const result = createTeamInvitationSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: 'Invalid request body', details: result.error },
        { status: 400 }
      );
    }

    const { organization_id, email, role } = result.data;
    const client = getSupabaseServerClient();

    // Verify user has admin or owner role
    const hasAccess = await hasMinTeamRole(
      client,
      organization_id,
      userId,
      'admin'
    );

    if (!hasAccess) {
      return NextResponse.json(
        { error: 'Insufficient permissions' },
        { status: 403 }
      );
    }

    const { data: invitation } = await createTeamInvitation(
      client,
      organization_id,
      email,
      role
    );

    return NextResponse.json(invitation, { status: 201 });
  } catch (error) {
    console.error('Error creating team invitation:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/team-invitations/[id]/accept
 * Accept team invitation via token
 */
export async function acceptInvitation(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { token } = body;

    // TODO: Validate and accept invitation
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error accepting team invitation:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/team-invitations/[id]
 * Cancel team invitation
 */
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const client = getSupabaseServerClient();
    const hasAccess = await hasMinTeamRole(
      client,
      null, // No organization_id needed for cancel
      userId,
      'admin'
    );

    if (!hasAccess) {
      return NextResponse.json(
        { error: 'Insufficient permissions' },
        { status: 403 }
      );
    }

    const invitationId = params.id;

    // Call the correct function with invitationId
    // TODO: Implement cancelTeamInvitation properly
    return NextResponse.json({ success: true, message: 'Cancellation not implemented yet' });
  } catch (error) {
    console.error('Error cancelling team invitation:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
