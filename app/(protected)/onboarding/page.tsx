'use client';

/**
 * Interactive Onboarding Page
 *
 * A comprehensive onboarding flow that guides new users through:
 * 1. Welcome and expectations
 * 2. Organization setup
 * 3. Product tour (optional)
 * 4. First article creation walkthrough
 * 5. Integration setup (optional)
 * 6. Success celebration
 */

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { WelcomeStep } from '@/components/onboarding/welcome-step';
import { OrganizationStep } from '@/components/onboarding/organization-step';
import {
  ProductTourStep,
  ProductTourPreview,
} from '@/components/onboarding/product-tour-step';
import { FirstArticleStep } from '@/components/onboarding/first-article-step';
import { IntegrationStep } from '@/components/onboarding/integration-step';
import { SuccessStep } from '@/components/onboarding/success-step';
import { Modal } from '@/components/ui/modal';
import { getOnboardingStore } from '@/lib/onboarding-store';
import type { OnboardingStepId } from '@/types/onboarding';
import { useUser } from '@clerk/nextjs';

// Step component mapping
const stepComponents: Record<
  OnboardingStepId,
  React.ComponentType<{ onNext: () => void; onSkip?: () => void }>
> = {
  welcome: WelcomeStep,
  'organization-setup': OrganizationStep,
  'product-tour': ({ onNext, onSkip }) => (
    <ProductTourPreview onStartTour={onNext} onSkip={onSkip} />
  ),
  'first-article': FirstArticleStep,
  'integration-setup': IntegrationStep,
  success: () => <div />, // Handled separately
};

// Full tour mode component
const ProductTour = ProductTourStep;

export default function OnboardingPage() {
  const router = useRouter();
  const { user, isLoaded } = useUser();
  const [currentStep, setCurrentStep] = useState<OnboardingStepId>('welcome');
  const [isTourActive, setIsTourActive] = useState(false);
  const [achievements, setAchievements] = useState({
    organizationCreated: false,
    firstArticleCreated: false,
    integrationConnected: false,
    tourCompleted: false,
  });

  // Initialize onboarding store
  useEffect(() => {
    if (!isLoaded) return;

    const store = getOnboardingStore();

    // Check if onboarding is already complete
    if (store.isComplete()) {
      router.push('/dashboard');
      return;
    }

    // Start onboarding for this user
    if (user?.id) {
      store.start(user.id);
      setCurrentStep(store.getState().currentStep);
    }

    // Subscribe to state changes
    const unsubscribe = store.subscribe(() => {
      const state = store.getState();
      setCurrentStep(state.currentStep);
      setAchievements({
        organizationCreated: state.organizationCreated,
        firstArticleCreated: state.firstArticleCreated,
        integrationConnected: state.integrationConnected,
        tourCompleted: state.tourCompleted,
      });
    });

    return () => unsubscribe();
  }, [isLoaded, user, router]);

  const handleNext = () => {
    const store = getOnboardingStore();
    store.nextStep();
  };

  const handleSkip = () => {
    const store = getOnboardingStore();
    store.skipStep();
  };

  const handleStepComplete = (stepId: OnboardingStepId) => {
    const store = getOnboardingStore();
    store.markAchievement(
      stepId === 'organization-setup'
        ? 'organizationCreated'
        : stepId === 'first-article'
          ? 'firstArticleCreated'
          : stepId === 'integration-setup'
            ? 'integrationConnected'
            : 'tourCompleted'
    );
  };

  const handleTourComplete = () => {
    const store = getOnboardingStore();
    store.markAchievement('tourCompleted');
    setIsTourActive(false);
    handleNext();
  };

  const handleComplete = () => {
    const store = getOnboardingStore();
    store.complete();
    // Redirect to dashboard after a short delay
    setTimeout(() => {
      router.push('/dashboard');
    }, 500);
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" />
      </div>
    );
  }

  // Render success step as full page celebration
  if (currentStep === 'success') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900 flex items-center justify-center p-4">
        <div className="w-full max-w-lg">
          <SuccessStep
            userName={user?.firstName || undefined}
            achievements={achievements}
            onNext={handleComplete}
          />
        </div>
      </div>
    );
  }

  // Render tour in fullscreen overlay mode
  if (isTourActive) {
    return (
      <>
        {/* Background - dimmed */}
        <div className="fixed inset-0 bg-gray-100 dark:bg-gray-900 -z-10" />

        {/* Tour overlay */}
        <ProductTour onComplete={handleTourComplete} onSkip={handleSkip} />
      </>
    );
  }

  // Render regular step in modal
  const StepComponent = stepComponents[currentStep];
  if (!StepComponent) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900">
      {/* Progress Bar */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-gray-200 dark:bg-gray-800 z-50">
        <div
          className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-500"
          style={{
            width: `${getOnboardingStore().getProgressPercentage()}%`,
          }}
        />
      </div>

      {/* Main Content */}
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-lg">
          {/* Step Card */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8">
            <StepComponent
              onNext={handleNext}
              onSkip={currentStep !== 'welcome' ? handleSkip : undefined}
            />
          </div>

          {/* Step Indicator */}
          <div className="flex items-center justify-center gap-2 mt-6">
            {(
              [
                'welcome',
                'organization-setup',
                'product-tour',
                'first-article',
                'integration-setup',
              ] as OnboardingStepId[]
            ).map((stepId, index) => (
              <div
                key={stepId}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index <= getOnboardingStore().getCurrentStepIndex()
                    ? 'bg-indigo-500'
                    : 'bg-gray-300 dark:bg-gray-700'
                } ${index < getOnboardingStore().getCurrentStepIndex() ? 'w-8' : 'w-2'}`}
              />
            ))}
          </div>

          {/* Skip onboarding link */}
          {currentStep !== 'welcome' && (
            <button
              onClick={() => router.push('/dashboard')}
              className="mt-4 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            >
              Exit onboarding
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
