/**
 * Zod Schema Library
 *
 * Centralized validation schemas for API routes.
 * Import schemas from here and use with validateRequest() helper.
 *
 * @example
 * import { createCheckoutSessionSchema, validateRequest } from '@/lib/schemas';
 *
 * export async function POST(req: NextRequest) {
 *   const body = await req.json();
 *   const result = validateRequest(body, createCheckoutSessionSchema);
 *   if (!result.success) {
 *     return NextResponse.json(result.error, { status: 400 });
 *   }
 *   // Use result.data
 * }
 */

// Re-export validation helper
export { validateRequest, type ValidationResult } from './validation';

// Re-export all schemas
export * from './stripe';
export * from './keywords';
export * from './onboarding';
export * from './usage';
export * from './common';
