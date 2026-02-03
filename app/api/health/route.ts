import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';

/**
 * Health Check Endpoint
 *
 * This endpoint provides a simple way to verify:
 * 1. The API is running
 * 2. Clerk authentication is configured
 * 3. Optional: User authentication status
 *
 * Usage:
 * - GET /api/health - Public health check
 * - GET /api/health?auth=true - Include auth status
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const includeAuth = searchParams.get('auth') === 'true';

  const healthData: Record<string, any> = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version || '0.1.0',
    environment: process.env.NODE_ENV || 'development',
  };

  // Include auth status if requested
  if (includeAuth) {
    try {
      const { userId, orgId } = await auth();
      healthData['auth'] = {
        configured: !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
        authenticated: !!userId,
        userId: userId || null,
        organizationId: orgId || null,
      };
    } catch (error) {
      healthData['auth'] = {
        configured: !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
        error: error instanceof Error ? error.message : 'Auth check failed',
      };
    }
  }

  // Check Clerk configuration
  const clerkConfigured = !!(
    process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY &&
    process.env.CLERK_SECRET_KEY
  );

  if (!clerkConfigured) {
    return NextResponse.json(
      {
        ...healthData,
        status: 'unhealthy',
        errors: ['Clerk environment variables not configured'],
      },
      { status: 503 }
    );
  }

  return NextResponse.json(healthData);
}
