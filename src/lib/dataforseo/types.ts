/**
 * DataForSEO API Types
 *
 * This file contains TypeScript types for DataForSEO API requests and responses.
 * Based on DataForSEO API documentation for:
 * - DataForSEO Keywords Data API
 * - DataForSEO SERP API
 */

// ============================================================================
// Common Types
// ============================================================================

export interface DataForSEOApiError {
  code: number;
  message: string;
  errors?: Array<{
    code: number;
    message: string;
  }>;
}

export interface DataForSEOResponseMeta {
  code: number;
  message: string;
  header?: Record<string, string>;
}

export interface DataForSEORateLimitInfo {
  total_limit: number;
  remaining: number;
  reset_at: string;
}

export interface DataForSEOCostInfo {
  total_cost: number;
  tasks_count: number;
}

// ============================================================================
// Keywords Data API Types
// ============================================================================

export interface KeywordDataKeywordInfo {
  se_type: string;
  keyword: string;
  location_code: number;
  language_code: string;
  keyword_length?: number;
  keyword_difficulty?: number;
  keyword_volume?: number;
  keyword_positive_trend?: number;
  keyword_negative_trend?: number;
  keyword_opportunity?: number;
  max_cpc?: number;
  avg_backlinks?: number;
  avg_traffic?: number;
  competition?: number;
  SERP_info?: SERPInfo;
}

export interface SERPInfo {
  check_url: string;
  se_domain?: string;
  location_code: number;
  language_code: string;
  check_time: string;
  total_results_count: number;
  keyword_difficulty: number;
  keyword_volume: number;
  keyword_positive_trend: number;
  keyword_negative_trend: number;
  keyword_opportunity: number;
}

export interface KeywordDataTaskResult {
  keyword: string;
  se_type: string;
  location_code: number;
  language_code: string;
  keyword_length: number;
  keyword_difficulty: number;
  keyword_volume: number;
  keyword_positive_trend: number;
  keyword_negative_trend: number;
  keyword_opportunity: number;
  max_cpc: number;
  avg_backlinks: number;
  avg_traffic: number;
  competition: number;
  SERP_info: SERPInfo;
}

export interface KeywordDataTaskPostResponse {
  id: string;
  status_code: number;
  status_message: string;
  time: string;
  cost: number;
  result_count: number;
  result?: KeywordDataTaskResult[];
  endpoint?: string;
}

export interface KeywordDataTaskReadyResponse {
  id: string;
  status_code: number;
  status_message: string;
  time: string;
  cost: number;
  result_count: number;
  result?: KeywordDataTaskResult[];
}

// ============================================================================
// Keywords Data API - Request Types
// ============================================================================

export interface KeywordDataTaskRequest {
  keyword: string;
  location_code: number;
  language_code: string;
  include_kd?: boolean; // keyword difficulty
  include_volume?: boolean; // search volume
  include_positive_trend?: boolean;
  include_negative_trend?: boolean;
  include_opportunity?: boolean; // opportunity score
  include_cpc?: boolean; // cost per click
  include_backlinks?: boolean;
  include_traffic?: boolean;
  include_competition?: boolean;
}

// ============================================================================
// Keywords Data API - Full Response Types
// ============================================================================

export interface KeywordDataResponse {
  status_code: number;
  status_message: string;
  time: string;
  tasks: Array<{
    id: string;
    status_code: number;
    status_message: string;
    time: string;
    cost: number;
    result_count: number;
    result?: KeywordDataTaskResult[];
    endpoint?: string;
  }>;
  tasks_limit?: number;
  tasks_filtered?: number;
}

// ============================================================================
// Keywords For App / Keywords For Keywords Types
// ============================================================================

export interface KeywordSuggestionItem {
  keyword: string;
  keyword_length: number;
  keyword_difficulty: number;
  keyword_volume: number;
  keyword_positive_trend: number;
  keyword_negative_trend: number;
  keyword_opportunity: number;
  max_cpc: number;
  avg_backlinks: number;
  avg_traffic: number;
  competition: number;
}

export interface KeywordSuggestionsTaskResult {
  keyword: string;
  location_code: number;
  language_code: string;
  se_type: string;
  total_count: number;
  items?: KeywordSuggestionItem[];
}

// ============================================================================
// Search Intent Types
// ============================================================================

export type SearchIntentType =
  | 'transactional'
  | 'informational'
  | 'navigational'
  | 'commercial'
  | 'mixed'
  | 'none';

export interface SearchIntentData {
  type: SearchIntentType;
  confidence: number;
}

// ============================================================================
// Batch Operations
// ============================================================================

export interface BatchKeywordDataRequest {
  keywords: string[];
  location_code: number;
  language_code: string;
  include_kd?: boolean;
  include_volume?: boolean;
  include_opportunity?: boolean;
  include_cpc?: boolean;
}

export interface BatchKeywordDataResult {
  keyword: string;
  success: boolean;
  data?: KeywordDataTaskResult;
  error?: string;
}

// ============================================================================
// Client Options
// ============================================================================

export interface DataForSEOClientOptions {
  apiBaseUrl?: string;
  apiVersion?: string;
  timeout?: number;
}

export interface DataForSEOAuthConfig {
  username: string;
  password: string;
}
