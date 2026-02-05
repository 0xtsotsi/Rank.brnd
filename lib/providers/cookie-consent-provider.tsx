'use client';

/**
 * Cookie Consent Provider
 *
 * Initializes the cookie consent system and provides the banner.
 * Should be wrapped around the application content.
 */

import { useEffect } from 'react';
import { CookieConsentBanner } from '@/components/cookie';
import {
  initializeCookieConsent,
  type CookieConsentState,
} from '@/lib/cookie-consent-store';

interface CookieConsentProviderProps {
  children: React.ReactNode;
}

export function CookieConsentProvider({ children }: CookieConsentProviderProps) {
  useEffect(() => {
    // Initialize cookie consent on mount (client-side only)
    initializeCookieConsent();
  }, []);

  return (
    <>
      {children}
      <CookieConsentBanner />
    </>
  );
}

/**
 * Hook to get current cookie consent state
 */
export function useCookieConsentState(): CookieConsentState {
  // This will be updated to read from the store
  const { useCookieConsent } = require('@/lib/cookie-consent-store');
  return useCookieConsent();
}
