/**
 * Storage Types
 *
 * TypeScript types for Supabase Storage operations including
 * image uploads, retrieval, and management.
 */

/**
 * Supported image MIME types
 */
export const SUPPORTED_IMAGE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'image/svg+xml',
] as const;

export type SupportedImageType = (typeof SUPPORTED_IMAGE_TYPES)[number];

/**
 * Storage bucket names used in the application
 */
export const STORAGE_BUCKETS = {
  /** Article featured images and inline content images */
  ARTICLES: 'articles',
  /** User profile avatars */
  AVATARS: 'avatars',
  /** Product/website logos and branding */
  PRODUCTS: 'products',
  /** General purpose public assets */
  PUBLIC: 'public-assets',
} as const;

export type StorageBucket = (typeof STORAGE_BUCKETS)[keyof typeof STORAGE_BUCKETS];

/**
 * Image upload options
 */
export interface ImageUploadOptions {
  /** The storage bucket to upload to */
  bucket: StorageBucket;
  /** Custom path within the bucket (optional, will generate unique path if not provided) */
  path?: string;
  /** Maximum file size in bytes (default: 5MB) */
  maxSize?: number;
  /** Whether the uploaded file should be publicly accessible */
  isPublic?: boolean;
  /** Custom metadata to attach to the file */
  metadata?: Record<string, string>;
  /** Cache control header value */
  cacheControl?: string;
  /** Whether to upsert (replace if exists) */
  upsert?: boolean;
}

/**
 * Default upload options
 */
export const DEFAULT_UPLOAD_OPTIONS: Required<
  Omit<ImageUploadOptions, 'path' | 'metadata'>
> = {
  bucket: STORAGE_BUCKETS.PUBLIC,
  maxSize: 5 * 1024 * 1024, // 5MB
  isPublic: true,
  cacheControl: '3600', // 1 hour
  upsert: false,
};

/**
 * Result of a successful image upload
 */
export interface ImageUploadResult {
  /** Unique identifier for the uploaded file */
  id: string;
  /** Full path of the file in storage */
  path: string;
  /** Public URL to access the file (if public) */
  publicUrl: string | null;
  /** Signed URL for private files (with expiry) */
  signedUrl?: string;
  /** Size of the uploaded file in bytes */
  size: number;
  /** MIME type of the uploaded file */
  mimeType: string;
  /** Upload timestamp */
  createdAt: string;
}

/**
 * Error types for storage operations
 */
export type StorageErrorType =
  | 'FILE_TOO_LARGE'
  | 'INVALID_FILE_TYPE'
  | 'UPLOAD_FAILED'
  | 'FILE_NOT_FOUND'
  | 'PERMISSION_DENIED'
  | 'BUCKET_NOT_FOUND'
  | 'NETWORK_ERROR'
  | 'UNKNOWN_ERROR';

/**
 * Custom error class for storage operations
 */
export class StorageError extends Error {
  constructor(
    public readonly type: StorageErrorType,
    message: string,
    public readonly originalError?: unknown
  ) {
    super(message);
    this.name = 'StorageError';
  }
}

/**
 * Options for retrieving images
 */
export interface ImageRetrievalOptions {
  /** Width to resize the image to (optional) */
  width?: number;
  /** Height to resize the image to (optional) */
  height?: number;
  /** Quality for lossy formats (1-100) */
  quality?: number;
  /** Resize mode */
  mode?: 'cover' | 'contain' | 'fill';
  /** Duration in seconds for signed URLs (for private files) */
  signedUrlDuration?: number;
}

/**
 * File metadata returned from storage
 */
export interface FileMetadata {
  id: string;
  name: string;
  bucket: string;
  size: number;
  mimeType: string;
  createdAt: string;
  updatedAt: string;
  lastAccessedAt: string | null;
  metadata: Record<string, string> | null;
}

/**
 * List files options
 */
export interface ListFilesOptions {
  /** Maximum number of files to return */
  limit?: number;
  /** Offset for pagination */
  offset?: number;
  /** Sort column */
  sortBy?: {
    column: 'name' | 'created_at' | 'updated_at';
    order: 'asc' | 'desc';
  };
  /** Search filter */
  search?: string;
}
