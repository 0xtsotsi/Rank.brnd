// @ts-nocheck - Database types need to be regenerated with Supabase CLI

/**
 * Vitest Setup File
 *
 * This file runs before each test file and sets up the testing environment.
 */

import { vi } from 'vitest';

// Mock environment variables that might be needed during tests
process.env.NODE_ENV = 'test';
process.env.NEXT_PUBLIC_APP_URL = 'http://localhost:3007';

// Mock Next.js router
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
    back: vi.fn(),
    pathname: '/',
    query: {},
  }),
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams(),
}));

// Global test utilities
declare global {
  const vi: typeof import('vitest').vi;
}

// Setup cleanup after each test
afterEach(() => {
  vi.clearAllMocks();
});
