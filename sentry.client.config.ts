// This file configures the initialization of Sentry on the client.
// The config you add here will be used whenever a users loads a page in their browser.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

  // Environment
  environment: process.env.NEXT_PUBLIC_SENTRY_ENVIRONMENT || process.env.NODE_ENV,

  // Adjust this value in production, or use tracesSampler for greater control
  tracesSampleRate: Number(process.env.NEXT_PUBLIC_SENTRY_TRACES_SAMPLE_RATE) || 0.1,

  // Setting this option to true will print useful information to the console while you're setting up Sentry.
  debug: false,

  // Replay
  replaysOnErrorSampleRate: 1.0,
  replaysSessionSampleRate: 0.1,

  // This sets the sample rate to be 10%. You may want this to be 100% while
  // in development and sample at a lower rate in production
  profilesSampleRate: Number(process.env.NEXT_PUBLIC_SENTRY_PROFILES_SAMPLE_RATE) || 0.1,

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

  integrations: [
    Sentry.replayIntegration({
      // Additional Replay configuration goes in here, for example:
      maskAllText: true,
      blockAllMedia: true,
    }),
    Sentry.browserTracingIntegration(),
  ],

  // Ignore specific errors
  ignoreErrors: [
    // Random plugins/extensions
    'top.GLOBALS',
    // Facebook borked
    'OriginalEvent',
    // Network errors that are usually transient
    'Non-Error promise rejection captured',
    // Browser extensions
    'chrome-extension://',
    'moz-extension://',
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
