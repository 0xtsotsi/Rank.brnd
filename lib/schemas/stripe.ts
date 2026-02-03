/**
 * Stripe API Schemas
 *
 * Zod validation schemas for Stripe-related API routes.
 */

import { z } from 'zod';

/**
 * Checkout session modes
 */
const checkoutModeSchema = z.enum(['subscription', 'payment']);

/**
 * Create Checkout Session Schema
 *
 * POST /api/stripe/create-checkout-session
 */
export const createCheckoutSessionSchema = z.object({
  priceId: z.string().min(1, 'Price ID is required'),
  mode: checkoutModeSchema.optional().default('subscription'),
  successUrl: z.string().url('Invalid success URL').optional(),
  cancelUrl: z.string().url('Invalid cancel URL').optional(),
  metadata: z.record(z.string()).optional(),
});

/**
 * Prices Query Schema
 *
 * GET /api/stripe/prices
 */
export const pricesQuerySchema = z.object({
  activeOnly: z
    .enum(['true', 'false'])
    .transform((val) => val !== 'false')
    .optional(),
  limit: z.coerce.number().int().positive().max(100).optional().default(100),
});

/**
 * Cancel Subscription Schema
 *
 * DELETE /api/stripe/subscription
 */
export const cancelSubscriptionSchema = z.object({
  subscriptionId: z.string().min(1, 'Subscription ID is required'),
});

/**
 * Update Subscription Schema
 *
 * PATCH /api/stripe/subscription
 */
export const updateSubscriptionSchema = z.object({
  subscriptionId: z.string().min(1, 'Subscription ID is required'),
  priceId: z.string().min(1, 'Price ID is required'),
});
