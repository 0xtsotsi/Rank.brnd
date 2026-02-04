/**
 * Publishing Queue API Schemas
 *
 * Zod validation schemas for publishing queue related API routes.
 */

import { z } from 'zod';

/**
 * Publishing queue status types
 */
const publishingQueueStatusSchema = z.enum([
  'pending',
  'queued',
  'publishing',
  'published',
  'failed',
  'cancelled',
]);

/**
 * Publishing platform types
 */
const publishingPlatformSchema = z.enum([
  'wordpress',
  'webflow',
  'shopify',
  'ghost',
  'notion',
  'squarespace',
  'wix',
  'contentful',
  'strapi',
  'custom',
]);

/**
 * Error type classification for retry logic
 */
const publishingErrorTypeSchema = z.enum([
  'network',
  'timeout',
  'rate_limit',
  'auth',
  'validation',
  'server_error',
  'unknown',
]);

/**
 * Create Publishing Queue Item Schema
 *
 * POST /api/publishing-queue
 */
export const createPublishingQueueItemSchema = z.object({
  organization_id: z.string().uuid('Invalid organization ID'),
  product_id: z.string().uuid('Invalid product ID').optional(),
  article_id: z.string().uuid('Invalid article ID'),
  integration_id: z.string().uuid('Invalid integration ID').optional(),
  platform: publishingPlatformSchema,
  priority: z.coerce.number().int().min(0).max(100).optional().default(0),
  scheduled_for: z.string().datetime('Invalid scheduled date').optional(),
  max_retries: z.coerce.number().int().nonnegative().optional().default(3),
  metadata: z.record(z.unknown()).optional(),
});

/**
 * Queue Article for Publishing Schema
 *
 * POST /api/publishing-queue/queue
 */
export const queueArticleForPublishingSchema = z.object({
  organization_id: z.string().uuid('Invalid organization ID'),
  article_id: z.string().uuid('Invalid article ID'),
  platform: publishingPlatformSchema,
  integration_id: z.string().uuid('Invalid integration ID').optional(),
  priority: z.coerce.number().int().min(0).max(100).optional().default(0),
  scheduled_for: z.string().datetime('Invalid scheduled date').optional(),
  product_id: z.string().uuid('Invalid product ID').optional(),
});

/**
 * Publishing Queue Query Schema
 *
 * GET /api/publishing-queue
 */
export const publishingQueueQuerySchema = z.object({
  organization_id: z.string().uuid('Invalid organization ID').optional(),
  product_id: z.string().uuid('Invalid product ID').optional(),
  article_id: z.string().uuid('Invalid article ID').optional(),
  status: publishingQueueStatusSchema.optional(),
  platform: publishingPlatformSchema.optional(),
  search: z.string().optional(),
  sort: z
    .enum([
      'created_at',
      'updated_at',
      'status',
      'platform',
      'priority',
      'scheduled_for',
      'completed_at',
    ])
    .optional()
    .default('created_at'),
  order: z.enum(['asc', 'desc']).optional().default('desc'),
  limit: z.coerce.number().int().positive().max(100).optional().default(50),
  offset: z.coerce.number().int().nonnegative().optional().default(0),
});

/**
 * Update Publishing Queue Item Schema
 *
 * PATCH /api/publishing-queue
 */
export const updatePublishingQueueItemSchema = z.object({
  id: z.string().uuid('Invalid queue item ID'),
  platform: publishingPlatformSchema.optional(),
  priority: z.coerce.number().int().min(0).max(100).optional(),
  scheduled_for: z.string().datetime('Invalid scheduled date').optional(),
  max_retries: z.coerce.number().int().nonnegative().optional(),
  status: publishingQueueStatusSchema.optional(),
  metadata: z.record(z.unknown()).optional(),
});

/**
 * Cancel Publishing Queue Item Schema
 *
 * POST /api/publishing-queue/cancel
 */
export const cancelPublishingQueueItemSchema = z.object({
  id: z.string().uuid('Invalid queue item ID'),
});

/**
 * Retry Publishing Queue Item Schema
 *
 * POST /api/publishing-queue/retry
 */
export const retryPublishingQueueItemSchema = z.object({
  id: z.string().uuid('Invalid queue item ID'),
});

/**
 * Mark Item as Completed Schema
 *
 * POST /api/publishing-queue/complete
 */
export const markPublishingQueueItemCompletedSchema = z.object({
  id: z.string().uuid('Invalid queue item ID'),
  published_url: z.string().url('Invalid published URL').optional().or(z.literal('')),
  published_post_id: z.string().optional(),
  published_data: z.record(z.unknown()).optional(),
});

/**
 * Mark Item as Failed Schema
 *
 * POST /api/publishing-queue/fail
 */
export const markPublishingQueueItemFailedSchema = z.object({
  id: z.string().uuid('Invalid queue item ID'),
  error_message: z.string().min(1, 'Error message is required'),
  error_type: publishingErrorTypeSchema.optional(),
});

/**
 * Delete Publishing Queue Item Schema
 *
 * DELETE /api/publishing-queue
 */
export const deletePublishingQueueItemSchema = z.object({
  id: z.string().uuid('Invalid queue item ID'),
});

/**
 * Bulk Queue Articles Schema
 *
 * POST /api/publishing-queue/bulk
 */
export const bulkQueueArticlesSchema = z.object({
  organization_id: z.string().uuid('Invalid organization ID'),
  article_ids: z.array(z.string().uuid('Invalid article ID'))
    .min(1, 'At least one article ID is required')
    .max(50, 'Cannot queue more than 50 articles at once'),
  platform: publishingPlatformSchema,
  integration_id: z.string().uuid('Invalid integration ID').optional(),
  priority: z.coerce.number().int().min(0).max(100).optional().default(0),
  scheduled_for: z.string().datetime('Invalid scheduled date').optional(),
});
