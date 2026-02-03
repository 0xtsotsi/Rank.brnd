/**
 * Keywords API Schemas
 *
 * Zod validation schemas for keyword-related API routes.
 */

import { z } from 'zod';

/**
 * Keyword difficulty levels
 */
const keywordDifficultySchema = z.enum([
  'very-easy',
  'easy',
  'medium',
  'hard',
  'very-hard',
]);

/**
 * Keyword intent types
 */
const keywordIntentSchema = z.enum([
  'informational',
  'navigational',
  'commercial',
  'transactional',
]);

/**
 * Keyword status types
 */
const keywordStatusSchema = z.enum([
  'tracking',
  'opportunity',
  'paused',
  'completed',
]);

/**
 * Create Keyword Schema (single)
 *
 * POST /api/keywords
 */
export const createKeywordSchema = z.object({
  keyword: z.string().min(1, 'Keyword is required'),
  searchVolume: z.coerce.number().int().nonnegative().optional(),
  cpc: z.coerce.number().nonnegative().optional(),
  difficulty: keywordDifficultySchema.optional().default('medium'),
  intent: keywordIntentSchema.optional().default('informational'),
  tags: z.array(z.string()).optional().default([]),
  targetUrl: z.string().url('Invalid target URL').optional(),
  notes: z.string().optional(),
});

/**
 * Bulk Import Keywords Schema
 *
 * POST /api/keywords (bulk mode)
 */
export const bulkImportKeywordsSchema = z.object({
  bulk: z.literal(true),
  keywords: z
    .array(
      z.object({
        keyword: z.string().min(1, 'Keyword is required'),
        searchVolume: z.coerce.number().int().nonnegative().optional(),
        cpc: z.coerce.number().nonnegative().optional(),
        difficulty: keywordDifficultySchema.optional(),
        intent: keywordIntentSchema.optional(),
        tags: z.string().optional(), // Comma-separated string for bulk import
        targetUrl: z.string().optional(),
        notes: z.string().optional(),
      })
    )
    .min(1, 'At least one keyword is required'),
});

/**
 * Combined POST schema for keywords (single or bulk)
 */
export const keywordsPostSchema = z.discriminatedUnion('bulk', [
  bulkImportKeywordsSchema,
  createKeywordSchema
    .extend({
      bulk: z.literal(false).optional(),
    })
    .transform((val) => ({ ...val, bulk: false as const })),
]);

/**
 * Keywords Query Schema
 *
 * GET /api/keywords
 */
export const keywordsQuerySchema = z.object({
  search: z.string().optional(),
  intent: keywordIntentSchema.optional(),
  difficulty: keywordDifficultySchema.optional(),
  status: keywordStatusSchema.optional(),
  sort: z
    .enum([
      'keyword',
      'searchVolume',
      'difficulty',
      'intent',
      'status',
      'currentRank',
      'createdAt',
    ])
    .optional()
    .default('keyword'),
  order: z.enum(['asc', 'desc']).optional().default('asc'),
});

/**
 * Delete Keyword Schema
 *
 * DELETE /api/keywords
 */
export const deleteKeywordSchema = z.object({
  id: z.string().min(1, 'Keyword ID is required'),
});
