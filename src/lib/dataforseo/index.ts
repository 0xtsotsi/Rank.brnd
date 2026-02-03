/**
 * DataForSEO API Library
 *
 * Main entry point for DataForSEO integration.
 * Exports client, types, and service functions.
 */

// Re-export all types
export * from './types';

// Export the client class
export { DataForSEOClient, createDataForSEOClient } from './client';

// Export service functions
export {
  // Main service exports
  getKeywordMetrics,
  getBatchKeywordMetrics,
  getKeywordSuggestions,
  getKeywordDifficulty,
  getSearchVolume,
  getOpportunityScore,
  getSearchIntent,
  researchKeyword,
  researchKeywordsBatch,

  // Constants
  LocationCodes,
  LanguageCodes,

  // Types
  type KeywordMetrics,
  type KeywordResearchOptions,
  type BatchKeywordResearchOptions,
  type SearchIntent,
  type KeywordResearchResult,
} from './keyword-service';
