// This file configures the initialization of Sentry for edge features (middleware, edge routes, etc.).
// The config you add here will be used whenever one of the edge features is loaded.
// Note that this config is unrelated to the Vercel Edge Runtime and is also required when running locally.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.SENTRY_DSN,

  // Environment
  environment: process.env.SENTRY_ENVIRONMENT || process.env.NODE_ENV,

  // Adjust this value in production, or use tracesSampler for greater control
  tracesSampleRate: Number(process.env.SENTRY_TRACES_SAMPLE_RATE) || 0.1,

  // Setting this option to true will print useful information to the console while you're setting up Sentry.
  debug: false,

  // Filter out localhost and development errors
  beforeSend(event, hint) {
    // Don't send events from localhost in development
    if (event.request?.url?.includes('localhost') && process.env.NODE_ENV === 'development') {
      return null;
    }

    // Filter out specific error types that are noisy
    if (event.exception) {
      const error = hint.originalException;
      // Ignore cancelled request errors
      if (error instanceof Error && error.name === 'AbortError') {
        return null;
      }
    }

    return event;
  },

  // Ignore specific errors
  ignoreErrors: [
    // Random plugins/extensions
    'top.GLOBALS',
    // Facebook borked
    'OriginalEvent',
    // Network errors that are usually transient
    'Non-Error promise rejection captured',
  ],

  // Exclude URLs from tracing
  tracePropagationTargets: [
    'localhost',
    /^\//,
    // Add your production domains here
    /^(https:\/\/)?(.*\.)?yourdomain\.com/,
  ],

  // beforeSendTransaction for filtering transactions
  beforeSendTransaction(event) {
    // Filter out health check or ping endpoints
    if (event.transaction?.includes('/health') || event.transaction?.includes('/ping')) {
      return null;
    }
    return event;
  },
});
