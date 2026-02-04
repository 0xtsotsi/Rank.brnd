/**
 * Sentry Utility Functions
 *
 * Helper functions for interacting with Sentry in the application.
 * These can be used throughout the app to capture errors, set user context,
 * and add breadcrumbs for better error tracking.
 */

import * as Sentry from '@sentry/nextjs';

export type { Breadcrumb, BreadcrumbHint, CaptureContext, EventHint, SeverityLevel } from '@sentry/nextjs';

/**
 * Capture an exception and send it to Sentry
 *
 * @param error - The error to capture
 * @param context - Additional context to include with the error
 * @returns The event ID
 */
export function captureException(error: Error | unknown, context?: Record<string, any>): string {
  return Sentry.captureException(error, {
    extra: context,
  });
}

/**
 * Capture a message and send it to Sentry
 *
 * @param message - The message to capture
 * @param level - The severity level
 * @returns The event ID
 */
export function captureMessage(message: string, level: Sentry.SeverityLevel = 'info'): string {
  return Sentry.captureMessage(message, level);
}

/**
 * Set the user context for Sentry events
 *
 * @param user - User information
 */
export function setUser(user: Sentry.User | null): void {
  Sentry.setUser(user);
}

/**
 * Add a breadcrumb for better error context
 *
 * @param category - Category of the breadcrumb
 * @param message - Message for the breadcrumb
 * @param level - Severity level
 * @param data - Additional data
 */
export function addBreadcrumb(
  category: string,
  message: string,
  level: Sentry.SeverityLevel = 'info',
  data?: Record<string, any>
): void {
  Sentry.addBreadcrumb({
    category,
    message,
    level,
    data,
  });
}

/**
 * Start a performance transaction
 *
 * @param name - Transaction name
 * @param op - Operation type
 * @returns The transaction object
 */
export function startTransaction(name: string, op: string) {
  return Sentry.startSpan({ name, op }, (span) => span);
}

/**
 * Set a tag on the scope
 *
 * @param key - Tag key
 * @param value - Tag value
 */
export function setTag(key: string, value: string | number | boolean): void {
  Sentry.setTag(key, value);
}

/**
 * Set context data on the scope
 *
 * @param key - Context key
 * @param context - Context data
 */
export function setContext(key: string, context: Record<string, any>): void {
  Sentry.setContext(key, context);
}

/**
 * Configure Sentry scope for a request or user interaction
 *
 * @param callback - Callback function to configure the scope
 */
export function configureScope(callback: (scope: any) => void): void {
  // configureScope is not available in @sentry/nextjs, use withScope instead
  Sentry.withScope((scope: any) => {
    callback(scope);
  });
}

/**
 * Wrapper for async functions with automatic error capture
 *
 * @param fn - The async function to wrap
 * @param context - Context for error reporting
 * @returns The wrapped function
 */
export function withErrorTracking<T extends (...args: any[]) => Promise<any>>(
  fn: T,
  context?: Record<string, any>
): T {
  return (async (...args: Parameters<T>) => {
    try {
      return await fn(...args);
    } catch (error) {
      captureException(error, {
        ...context,
        function: fn.name,
        arguments: args,
      });
      throw error;
    }
  }) as T;
}

/**
 * Create an API response with Sentry error tracking
 *
 * @param handler - The API route handler
 * @returns The wrapped handler
 */
export function withSentryAPI(
  handler: (request: Request) => Promise<Response>
): (request: Request) => Promise<Response> {
  return async (request: Request) => {
    try {
      return await handler(request);
    } catch (error) {
      captureException(error, {
        url: request.url,
        method: request.method,
      });
      throw error;
    }
  };
}

/**
 * Initialize Sentry user context from Clerk user data
 *
 * @param clerkUser - The Clerk user object
 */
export function initUserFromClerk(clerkUser: { id?: string; emailAddress?: string; firstName?: string; lastName?: string } | null): void {
  if (!clerkUser) {
    Sentry.setUser(null);
    return;
  }

  Sentry.setUser({
    id: clerkUser.id,
    email: clerkUser.emailAddress,
    username: [clerkUser.firstName, clerkUser.lastName].filter(Boolean).join(' ') || undefined,
  });
}

/**
 * Performance monitoring helper - wraps a function with performance tracking
 *
 * @param name - The name of the operation
 * @param fn - The function to track
 * @returns The result of the function
 */
export async function withPerformanceTracking<T>(
  name: string,
  fn: () => Promise<T>
): Promise<T> {
  return Sentry.startSpan(
    {
      name,
      op: 'function',
    },
    async (span) => {
      try {
        const result = await fn();
        span?.setStatus({ code: 1, message: 'success' });
        return result;
      } catch (error) {
        span?.setStatus({ code: 2, message: 'internal_error' });
        throw error;
      }
    }
  );
}

/**
 * Default export - convenience object containing all utilities
 */
export const sentry = {
  captureException,
  captureMessage,
  setUser,
  addBreadcrumb,
  setTag,
  setContext,
  configureScope,
  withErrorTracking,
  initUserFromClerk,
  withPerformanceTracking,
};

export default sentry;
