/**
 * Keyword Research API Route
 *
 * Server-side API endpoints for keyword research using DataForSEO.
 * These routes proxy requests to DataForSEO to keep credentials secure.
 */

import { NextRequest, NextResponse } from 'next/server';
import { DataForSEOClient } from '@/lib/dataforseo';

// ============================================================================
// Types
// ============================================================================

interface BatchMetricsRequestBody {
  keywords: string[];
  locationCode?: number;
  languageCode?: string;
}

interface SuggestionsRequestBody {
  seedKeyword: string;
  limit?: number;
  locationCode?: number;
  languageCode?: string;
}

// ============================================================================
// Helper Functions
// ============================================================================

function getDataForSEOCredentials(): { username: string; password: string } | null {
  const username = process.env.DATAFORSEO_API_USERNAME;
  const password = process.env.DATAFORSEO_API_PASSWORD;

  if (!username || !password) {
    return null;
  }

  return { username, password };
}

function createErrorResponse(message: string, status = 500) {
  return NextResponse.json(
    { error: message },
    { status },
  );
}

// ============================================================================
// GET /api/keywords - Get keyword metrics
// ============================================================================

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const keyword = searchParams.get('keyword');
    const locationCode = searchParams.get('locationCode');
    const languageCode = searchParams.get('languageCode');

    if (!keyword) {
      return createErrorResponse('Missing keyword parameter', 400);
    }

    const credentials = getDataForSEOCredentials();
    if (!credentials) {
      return createErrorResponse('DataForSEO credentials not configured', 503);
    }

    const client = new DataForSEOClient(credentials);

    const result = await client.getKeywordData({
      keyword,
      location_code: locationCode ? parseInt(locationCode, 10) : 2840, // Default: US
      language_code: languageCode ?? 'en', // Default: English
      include_kd: true,
      include_volume: true,
      include_opportunity: true,
      include_cpc: true,
    });

    if (!result) {
      return NextResponse.json({ error: 'No data found for keyword' }, { status: 404 });
    }

    // Transform result to a simpler format
    const metrics = {
      keyword: result.keyword ?? keyword,
      searchVolume: result.keyword_volume ?? 0,
      difficulty: result.keyword_difficulty ?? 0,
      opportunity: result.keyword_opportunity ?? 0,
      cpc: result.max_cpc ?? 0,
      competition: result.competition ?? 0,
      trend: {
        positive: result.keyword_positive_trend ?? 0,
        negative: result.keyword_negative_trend ?? 0,
      },
      backlinks: result.avg_backlinks ?? 0,
      traffic: result.avg_traffic ?? 0,
    };

    // Determine search intent
    const intent = client.determineSearchIntent(keyword);

    return NextResponse.json({
      metrics,
      intent,
    });
  } catch (error) {
    console.error('Error in GET /api/keywords:', error);

    const apiError = error as { code?: number; message?: string };
    return createErrorResponse(
      apiError.message ?? 'Failed to fetch keyword metrics',
      apiError.code ?? 500,
    );
  }
}

// ============================================================================
// POST /api/keywords - Batch operations and suggestions
// ============================================================================

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as
      | BatchMetricsRequestBody
      | SuggestionsRequestBody;

    const credentials = getDataForSEOCredentials();
    if (!credentials) {
      return createErrorResponse('DataForSEO credentials not configured', 503);
    }

    const client = new DataForSEOClient(credentials);

    // Handle keyword suggestions
    if ('seedKeyword' in body) {
      const { seedKeyword, limit = 50, locationCode = 2840, languageCode = 'en' } = body;

      const result = await client.getKeywordSuggestions(
        seedKeyword,
        locationCode,
        languageCode,
        { limit },
      );

      if (!result?.items) {
        return NextResponse.json({ suggestions: [] });
      }

      const suggestions = result.items.map((item) => ({
        keyword: item.keyword,
        searchVolume: item.keyword_volume ?? 0,
        difficulty: item.keyword_difficulty ?? 0,
        opportunity: item.keyword_opportunity ?? 0,
        cpc: item.max_cpc ?? 0,
        competition: item.competition ?? 0,
      }));

      return NextResponse.json({ suggestions });
    }

    // Handle batch metrics
    if ('keywords' in body) {
      const { keywords, locationCode = 2840, languageCode = 'en' } = body;

      if (!keywords || keywords.length === 0) {
        return createErrorResponse('No keywords provided', 400);
      }

      if (keywords.length > 100) {
        return createErrorResponse('Maximum 100 keywords per request', 400);
      }

      const results = await client.getKeywordDataBatch(
        keywords.map((keyword) => ({
          keyword,
          location_code: locationCode,
          language_code: languageCode,
          include_kd: true,
          include_volume: true,
          include_opportunity: true,
          include_cpc: true,
        })),
      );

      const metrics = results.map((result) => ({
        keyword: result.keyword ?? '',
        searchVolume: result.keyword_volume ?? 0,
        difficulty: result.keyword_difficulty ?? 0,
        opportunity: result.keyword_opportunity ?? 0,
        cpc: result.max_cpc ?? 0,
        competition: result.competition ?? 0,
      }));

      return NextResponse.json({ metrics });
    }

    return createErrorResponse('Invalid request body', 400);
  } catch (error) {
    console.error('Error in POST /api/keywords:', error);

    const apiError = error as { code?: number; message?: string };
    return createErrorResponse(
      apiError.message ?? 'Failed to process request',
      apiError.code ?? 500,
    );
  }
}
