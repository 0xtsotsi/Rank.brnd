/**
 * DataForSEO API Client
 *
 * This client handles authentication and API requests to DataForSEO APIs.
 * Supports Keywords Data API for keyword research metrics.
 *
 * DataForSEO Docs: https://docs.dataforseo.com/v3/keywords_data/
 */

import type {
  DataForSEOAuthConfig,
  DataForSEOClientOptions,
  DataForSEOApiError,
  KeywordDataTaskRequest,
  KeywordDataResponse,
  KeywordDataTaskResult,
  KeywordSuggestionsTaskResult,
} from './types';

export class DataForSEOClient {
  private readonly username: string;
  private readonly password: string;
  private readonly apiBaseUrl: string;
  private readonly apiVersion: string;
  private readonly timeout: number;

  /**
   * Create a new DataForSEO API client
   */
  constructor(auth: DataForSEOAuthConfig, options: DataForSEOClientOptions = {}) {
    this.username = auth.username;
    this.password = auth.password;
    this.apiBaseUrl = options.apiBaseUrl ?? 'https://api.dataforseo.com';
    this.apiVersion = options.apiVersion ?? 'v3';
    this.timeout = options.timeout ?? 60000; // Default 60 seconds
  }

  // ============================================================================
  // Private Methods
  // ============================================================================

  /**
   * Get basic auth header
   */
  private getAuthHeader(): string {
    const credentials = `${this.username}:${this.password}`;
    return `Basic ${Buffer.from(credentials).toString('base64')}`;
  }

  /**
   * Build full API URL
   */
  private buildUrl(endpoint: string): string {
    return `${this.apiBaseUrl}/${this.apiVersion}${endpoint}`;
  }

  /**
   * Parse API error response
   */
  private parseError(response: Response, data?: unknown): DataForSEOApiError {
    if (data && typeof data === 'object' && 'message' in data) {
      const errorData = data as { code?: number; message: string; errors?: unknown };
      return {
        code: errorData.code ?? response.status,
        message: errorData.message,
        errors: errorData.errors as DataForSEOApiError['errors'],
      };
    }
    return {
      code: response.status,
      message: response.statusText || 'Unknown error occurred',
    };
  }

  /**
   * Make an authenticated POST request to DataForSEO API
   */
  private async post<T>(
    endpoint: string,
    body: unknown,
  ): Promise<T> {
    const url = this.buildUrl(endpoint);
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          Authorization: this.getAuthHeader(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      let data: unknown;
      const contentType = response.headers.get('content-type');

      if (contentType?.includes('application/json')) {
        data = await response.json();
      } else {
        const text = await response.text();
        try {
          data = JSON.parse(text);
        } catch {
          data = text;
        }
      }

      if (!response.ok) {
        throw this.parseError(response, data);
      }

      return data as T;
    } catch (error) {
      clearTimeout(timeoutId);

      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw {
            code: 408,
            message: `Request timeout after ${this.timeout}ms`,
          } as DataForSEOApiError;
        }
        throw error;
      }

      throw error;
    }
  }

  // ============================================================================
  // Keywords Data API - Keywords Data
  // ============================================================================

  /**
   * Get keyword data including search volume, difficulty, and opportunity
   *
   * @param request - Keyword data request parameters
   * @returns Promise with keyword data result
   *
   * @example
   * ```ts
   * const result = await client.getKeywordData({
   *   keyword: "best running shoes",
   *   location_code: 2840, // United States
   *   language_code: "en",
   *   include_kd: true,
   *   include_volume: true,
   *   include_opportunity: true,
   * });
   * ```
   */
  async getKeywordData(request: KeywordDataTaskRequest): Promise<KeywordDataTaskResult | null> {
    const response = await this.post<KeywordDataResponse>(
      '/keywords_data/google_ads/search_volume/live',
      [{ ...request }],
    );

    const task = response.tasks?.[0];
    return task?.result?.[0] ?? null;
  }

  /**
   * Get keyword data for multiple keywords in a single request
   *
   * @param requests - Array of keyword data request parameters
   * @returns Promise with keyword data results
   *
   * @example
   * ```ts
   * const results = await client.getKeywordDataBatch([
   *   { keyword: "running shoes", location_code: 2840, language_code: "en" },
   *   { keyword: "walking shoes", location_code: 2840, language_code: "en" },
   * ]);
   * ```
   */
  async getKeywordDataBatch(
    requests: KeywordDataTaskRequest[],
  ): Promise<KeywordDataTaskResult[]> {
    const response = await this.post<KeywordDataResponse>(
      '/keywords_data/google_ads/search_volume/live',
      requests,
    );

    const results: KeywordDataTaskResult[] = [];
    for (const task of response.tasks ?? []) {
      if (task.result) {
        results.push(...task.result);
      }
    }

    return results;
  }

  // ============================================================================
  // Keywords Data API - Keyword Suggestions
  // ============================================================================

  /**
   * Get keyword suggestions for a seed keyword
   *
   * @param keyword - Seed keyword
   * @param locationCode - Location code (e.g., 2840 for United States)
   * @param languageCode - Language code (e.g., "en")
   * @param options - Optional parameters
   * @returns Promise with keyword suggestions
   */
  async getKeywordSuggestions(
    keyword: string,
    locationCode: number,
    languageCode: string,
    options: {
      limit?: number;
      offset?: number;
      orderBy?: string;
    } = {},
  ): Promise<KeywordSuggestionsTaskResult | null> {
    const response = await this.post<{ tasks: Array<{ result?: KeywordSuggestionsTaskResult[] }> }>(
      '/keywords_data/google_ads/keyword_suggestions/live',
      [
        {
          keyword,
          location_code: locationCode,
          language_code: languageCode,
          limit: options.limit ?? 100,
          offset: options.offset ?? 0,
          order_by: options.orderBy ?? 'keyword_volume,desc',
        },
      ],
    );

    const task = response.tasks?.[0];
    return task?.result?.[0] ?? null;
  }

  // ============================================================================
  // Keywords Data API - Keyword Difficulty
  // ============================================================================

  /**
   * Get keyword difficulty score (0-100)
   *
   * @param keyword - Keyword to check
   * @param locationCode - Location code
   * @param languageCode - Language code
   * @returns Promise with keyword difficulty
   */
  async getKeywordDifficulty(
    keyword: string,
    locationCode: number,
    languageCode: string,
  ): Promise<number | null> {
    const result = await this.getKeywordData({
      keyword,
      location_code: locationCode,
      language_code: languageCode,
      include_kd: true,
    });

    return result?.keyword_difficulty ?? null;
  }

  // ============================================================================
  // Helper Methods
  // ============================================================================

  /**
   * Calculate opportunity score from keyword data
   * Opportunity = (Volume * (1 - Difficulty/100)) / Competition
   * This is a simplified formula - DataForSEO provides its own opportunity score
   */
  calculateOpportunityScore(data: KeywordDataTaskResult): number {
    const volume = data.keyword_volume ?? 0;
    const difficulty = data.keyword_difficulty ?? 0;
    const competition = data.competition ?? 1;

    if (competition === 0) return 0;

    // Use DataForSEO's opportunity score if available
    if (data.keyword_opportunity !== undefined) {
      return data.keyword_opportunity;
    }

    // Otherwise calculate a basic score
    const normalizedDifficulty = difficulty / 100;
    return Math.round(volume * (1 - normalizedDifficulty) / competition);
  }

  /**
   * Determine search intent based on keyword modifiers
   * Returns a basic intent classification
   */
  determineSearchIntent(keyword: string): 'informational' | 'navigational' | 'transactional' | 'commercial' {
    const lowerKeyword = keyword.toLowerCase();

    // Transactional intent (buying intent)
    const transactionalWords = [
      'buy', 'purchase', 'order', 'cheap', 'discount', 'deal', 'sale',
      'price', 'cost', 'coupon', 'best price', 'shop', 'store',
    ];
    if (transactionalWords.some(word => lowerKeyword.includes(word))) {
      return 'transactional';
    }

    // Commercial intent (researching to buy)
    const commercialWords = [
      'best', 'top', 'review', 'comparison', 'compare', 'vs',
      'rating', 'recommended', 'worst', 'better',
    ];
    if (commercialWords.some(word => lowerKeyword.includes(word))) {
      return 'commercial';
    }

    // Navigational intent (looking for specific site/brand)
    const navigationalPatterns = [
      '.com', '.org', '.net', '.co', 'www', 'http', 'login', 'sign in',
      'facebook', 'google', 'amazon', 'youtube', 'twitter',
    ];
    if (navigationalPatterns.some(pattern => lowerKeyword.includes(pattern))) {
      return 'navigational';
    }

    // Default to informational
    return 'informational';
  }
}

/**
 * Create a DataForSEO client from environment variables
 */
export function createDataForSEOClient(
  username?: string,
  password?: string,
  options?: DataForSEOClientOptions,
): DataForSEOClient | null {
  if (!username || !password) {
    return null;
  }

  return new DataForSEOClient(
    { username, password },
    options,
  );
}
