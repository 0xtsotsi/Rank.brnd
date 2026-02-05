'use client';

/**
 * Setup Wizard Page
 *
 * A comprehensive multi-step wizard that guides users through:
 * 1. Brand setup - Configure brand identity
 * 2. CMS connection - Link content management system
 * 3. First keyword - Add SEO keyword to track
 * 4. Article generation - Generate first AI article
 * 5. Complete - Celebration and next steps
 */

import { useEffect, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { BrandSetupStep } from '@/components/setup-wizard/brand-setup-step';
import { CMSConnectionStep } from '@/components/setup-wizard/cms-connection-step';
import { KeywordSetupStep } from '@/components/setup-wizard/keyword-setup-step';
import { ArticleGenerationStep } from '@/components/setup-wizard/article-generation-step';
import { WizardCompleteStep } from '@/components/setup-wizard/wizard-complete-step';
import { getSetupWizardStore } from '@/lib/setup-wizard-store';
import { cn } from '@/lib/utils';
import type { SetupWizardStepId } from '@/types/setup-wizard';

// Step component mapping
const stepComponents: Record<
  SetupWizardStepId,
  React.ComponentType<{ onNext: () => void; onSkip?: () => void }>
> = {
  'brand-setup': BrandSetupStep,
  'cms-connection': CMSConnectionStep,
  'keyword-setup': KeywordSetupStep,
  'article-generation': ArticleGenerationStep,
  complete: () => null, // Handled separately
};

// All steps in order for progress indicator
const WIZARD_STEPS: SetupWizardStepId[] = [
  'brand-setup',
  'cms-connection',
  'keyword-setup',
  'article-generation',
  'complete',
];

export default function SetupWizardPage() {
  const router = useRouter();
  const { user, isLoaded } = useUser();
  const [isPending, startTransition] = useTransition();
  const [currentStep, setCurrentStep] =
    useState<SetupWizardStepId>('brand-setup');
  const [achievements, setAchievements] = useState({
    brandSetupComplete: false,
    cmsConnected: false,
    keywordCreated: false,
    articleGenerated: false,
  });
  const [store] = useState(() => getSetupWizardStore());

  // Initialize wizard on mount
  useEffect(() => {
    if (!isLoaded) return;

    // Check if wizard is already complete
    if (store.isComplete()) {
      router.push('/dashboard');
      return;
    }

    // Start wizard for this user
    if (user?.id && !store.getState().startedAt) {
      store.start(user.id);
      setCurrentStep(store.getState().currentStep);
    } else {
      // Restore existing state
      setCurrentStep(store.getState().currentStep);
    }

    // Subscribe to state changes
    const unsubscribe = store.subscribe(() => {
      const state = store.getState();
      setCurrentStep(state.currentStep);
      setAchievements({
        brandSetupComplete: state.brandSetupComplete,
        cmsConnected: state.cmsConnected,
        keywordCreated: state.keywordCreated,
        articleGenerated: state.articleGenerated,
      });
    });

    return () => unsubscribe();
  }, [isLoaded, user, router, store]);

  const handleNext = () => {
    startTransition(() => {
      // The store.nextStep() will mark the current step as completed
      // and automatically update achievement flags based on the step
      const currentStepId = store.getState().currentStep;

      // Mark achievement based on current step before moving next
      switch (currentStepId) {
        case 'brand-setup':
          store.saveBrandConfig({
            name: '',
            // Component will save actual data before calling onNext
          });
          break;
        case 'cms-connection':
          store.saveCMSIntegration({
            provider: 'wordpress',
            connected: true,
          });
          break;
        case 'keyword-setup':
          store.saveKeywordConfig({
            keyword: '',
          });
          break;
        case 'article-generation':
          store.saveArticleOptions({
            keyword: '',
          });
          break;
      }

      store.nextStep();
    });
  };

  const handleSkip = () => {
    store.skipStep();
  };

  const handleComplete = () => {
    startTransition(() => {
      store.complete();
      // Redirect to dashboard after completion
      setTimeout(() => {
        router.push('/dashboard');
      }, 500);
    });
  };

  // Loading state
  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" />
      </div>
    );
  }

  // Render completion step as full page celebration
  if (currentStep === 'complete') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900 flex items-center justify-center p-4">
        <div className="w-full max-w-2xl">
          <WizardCompleteStep
            userName={user?.firstName || undefined}
            brandConfig={store.getBrandConfig()}
            achievements={achievements}
            onNext={handleComplete}
          />
        </div>
      </div>
    );
  }

  // Get current step component
  const StepComponent = stepComponents[currentStep];
  if (!StepComponent) {
    return null;
  }

  // Get store data for current step
  const storeData = {
    brandConfig: store.getBrandConfig(),
    cmsIntegration: store.getCMSIntegration(),
    keywordConfig: store.getKeywordConfig(),
    articleOptions: store.getArticleOptions(),
  };

  // Calculate progress
  const currentStepIndex = WIZARD_STEPS.indexOf(currentStep);
  const progressPercentage = Math.round(
    ((currentStepIndex + 1) / (WIZARD_STEPS.length - 1)) * 100
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900">
      {/* Progress Bar */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-gray-200 dark:bg-gray-800 z-50">
        <div
          className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 transition-all duration-500 ease-out"
          style={{ width: `${progressPercentage}%` }}
        />
      </div>

      {/* Step Header */}
      <div className="fixed top-1 left-0 right-0 z-40 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="font-semibold text-gray-900 dark:text-white">
              Setup Wizard
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Step {currentStepIndex + 1} of {WIZARD_STEPS.length - 1}
            </div>
          </div>
          <button
            onClick={() => router.push('/dashboard')}
            className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 transition-colors"
          >
            Exit
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex items-center justify-center min-h-screen p-4 pt-20">
        <div className="w-full max-w-lg">
          {/* Step Card */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8">
            <StepComponent
              onNext={handleNext}
              onSkip={currentStep !== 'brand-setup' ? handleSkip : undefined}
              {...((currentStep === 'brand-setup' && {
                initialData: storeData.brandConfig,
              }) ||
                {})}
              {...((currentStep === 'cms-connection' && {
                initialData: storeData.cmsIntegration,
              }) ||
                {})}
              {...((currentStep === 'keyword-setup' && {
                initialData: storeData.keywordConfig,
              }) ||
                {})}
              {...((currentStep === 'article-generation' && {
                keywordConfig: storeData.keywordConfig,
                initialOptions: storeData.articleOptions,
              }) ||
                {})}
            />
          </div>

          {/* Step Indicator */}
          <div className="flex items-center justify-center gap-2 mt-6">
            {WIZARD_STEPS.slice(0, -1).map((stepId, index) => (
              <div
                key={stepId}
                className={cn(
                  'h-2 rounded-full transition-all duration-300',
                  index < currentStepIndex
                    ? 'bg-indigo-500 w-8'
                    : index === currentStepIndex
                      ? 'bg-indigo-500 w-2'
                      : 'bg-gray-300 dark:bg-gray-700 w-2'
                )}
              />
            ))}
          </div>

          {/* Helper Text */}
          <div className="mt-4 text-center">
            {currentStep === 'brand-setup' && (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                This takes about 3 minutes. You can always update this later in
                Settings.
              </p>
            )}
            {currentStep === 'cms-connection' && (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Optional - Connect now or set up later in Integrations.
              </p>
            )}
            {currentStep === 'keyword-setup' && (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Start with your most important keyword for tracking.
              </p>
            )}
            {currentStep === 'article-generation' && (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Generate your first AI article to see the magic happen!
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
