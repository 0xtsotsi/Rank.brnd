'use client';

/**
 * Onboarding Store
 *
 * Client-side state management for the onboarding flow using
 * a simplified Zustand-like pattern for state management.
 */

import type {
  OnboardingStep,
  OnboardingStepId,
  OnboardingProgress,
} from '@/types/onboarding';

const ONBOARDING_STORAGE_KEY = 'rankbrnd_onboarding';
const ONBOARDING_VERSION = 1;

/**
 * All available onboarding steps in order
 */
const onboardingSteps: OnboardingStep[] = [
  {
    id: 'welcome',
    title: 'Welcome',
    description: 'Get started with Rank.brnd',
    estimatedTime: '2 min',
    isCompleted: false,
  },
  {
    id: 'organization-setup',
    title: 'Set Up Organization',
    description: 'Create your workspace',
    estimatedTime: '3 min',
    isCompleted: false,
  },
  {
    id: 'product-tour',
    title: 'Product Tour',
    description: 'Explore the key features',
    estimatedTime: '5 min',
    isOptional: true,
    isCompleted: false,
  },
  {
    id: 'first-article',
    title: 'Create First Article',
    description: 'Generate SEO content with AI',
    estimatedTime: '5 min',
    isCompleted: false,
  },
  {
    id: 'integration-setup',
    title: 'Connect CMS',
    description: 'Publish to your favorite platforms',
    estimatedTime: '3 min',
    isOptional: true,
    isCompleted: false,
  },
  {
    id: 'success',
    title: 'All Set!',
    description: "You're ready to go",
    isCompleted: false,
  },
];

/**
 * Default onboarding progress
 */
const defaultProgress: OnboardingProgress = {
  userId: '',
  currentStep: 'welcome',
  completedSteps: [],
  skippedSteps: [],
  startedAt: null,
  completedAt: null,
  organizationCreated: false,
  firstArticleCreated: false,
  integrationConnected: false,
  tourCompleted: false,
};

/**
 * Onboarding store class
 */
class OnboardingStore {
  private listeners: Set<() => void> = new Set();
  private state: OnboardingProgress & { steps: OnboardingStep[] };

  constructor() {
    this.state = {
      ...defaultProgress,
      steps: onboardingSteps,
    };
    this.loadFromStorage();
  }

  /**
   * Get current state
   */
  getState() {
    return { ...this.state };
  }

  /**
   * Subscribe to state changes
   */
  subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  /**
   * Notify all listeners
   */
  private notify() {
    this.listeners.forEach((listener) => listener());
  }

  /**
   * Save state to localStorage
   */
  private saveToStorage() {
    try {
      const { steps, ...progressToSave } = this.state;
      const data = {
        version: ONBOARDING_VERSION,
        progress: progressToSave,
      };
      localStorage.setItem(ONBOARDING_STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      console.warn('Failed to save onboarding state:', e);
    }
  }

  /**
   * Load state from localStorage
   */
  private loadFromStorage() {
    try {
      const stored = localStorage.getItem(ONBOARDING_STORAGE_KEY);
      if (!stored) return;

      const data = JSON.parse(stored);
      if (data.version !== ONBOARDING_VERSION) {
        // Version mismatch, clear old data
        localStorage.removeItem(ONBOARDING_STORAGE_KEY);
        return;
      }

      // Merge with default to ensure all fields exist
      this.state = {
        ...defaultProgress,
        ...data.progress,
        steps: this.updateStepsCompletion(data.progress),
      };
    } catch (e) {
      console.warn('Failed to load onboarding state:', e);
    }
  }

  /**
   * Update step completion status based on progress
   */
  private updateStepsCompletion(
    progress: Partial<OnboardingProgress>
  ): OnboardingStep[] {
    return onboardingSteps.map((step) => ({
      ...step,
      isCompleted: !!(
        progress.completedSteps?.includes(step.id) ||
        (step.id === 'organization-setup' && progress.organizationCreated) ||
        (step.id === 'first-article' && progress.firstArticleCreated) ||
        (step.id === 'integration-setup' && progress.integrationConnected) ||
        (step.id === 'product-tour' && progress.tourCompleted)
      ),
    }));
  }

  /**
   * Start onboarding for a user
   */
  start(userId: string) {
    this.state.userId = userId;
    this.state.currentStep = 'welcome';
    this.state.startedAt = new Date().toISOString();
    this.state.completedAt = null;
    this.state.completedSteps = [];
    this.state.skippedSteps = [];
    this.saveToStorage();
    this.notify();
  }

  /**
   * Move to next step
   */
  nextStep() {
    const currentIndex = onboardingSteps.findIndex(
      (s) => s.id === this.state.currentStep
    );
    if (currentIndex < onboardingSteps.length - 1) {
      const nextStep = onboardingSteps[currentIndex + 1];
      this.goToStep(nextStep.id);
    }
  }

  /**
   * Move to previous step
   */
  previousStep() {
    const currentIndex = onboardingSteps.findIndex(
      (s) => s.id === this.state.currentStep
    );
    if (currentIndex > 0) {
      const prevStep = onboardingSteps[currentIndex - 1];
      this.goToStep(prevStep.id);
    }
  }

  /**
   * Go to a specific step
   */
  goToStep(stepId: OnboardingStepId) {
    // Mark current step as completed if moving forward
    const currentIndex = onboardingSteps.findIndex(
      (s) => s.id === this.state.currentStep
    );
    const newIndex = onboardingSteps.findIndex((s) => s.id === stepId);

    if (newIndex > currentIndex) {
      const completedStep = this.state.currentStep;
      if (!this.state.completedSteps.includes(completedStep)) {
        this.state.completedSteps.push(completedStep);
      }
    }

    this.state.currentStep = stepId;
    this.state.steps = this.updateStepsCompletion(this.state);
    this.saveToStorage();
    this.notify();
  }

  /**
   * Skip current step
   */
  skipStep() {
    const currentStep = this.state.currentStep;
    if (!this.state.skippedSteps.includes(currentStep)) {
      this.state.skippedSteps.push(currentStep);
    }
    this.nextStep();
  }

  /**
   * Mark a specific achievement as complete
   */
  markAchievement(
    achievement: keyof Pick<
      OnboardingProgress,
      | 'organizationCreated'
      | 'firstArticleCreated'
      | 'integrationConnected'
      | 'tourCompleted'
    >
  ) {
    this.state[achievement] = true;
    this.state.steps = this.updateStepsCompletion(this.state);
    this.saveToStorage();
    this.notify();
  }

  /**
   * Complete onboarding
   */
  complete() {
    this.state.completedAt = new Date().toISOString();
    this.state.currentStep = 'success';
    if (!this.state.completedSteps.includes('success')) {
      this.state.completedSteps.push('success');
    }
    this.saveToStorage();
    this.notify();
  }

  /**
   * Reset onboarding (for testing or restart)
   */
  reset() {
    this.state = {
      ...defaultProgress,
      steps: onboardingSteps,
    };
    localStorage.removeItem(ONBOARDING_STORAGE_KEY);
    this.notify();
  }

  /**
   * Check if onboarding is complete
   */
  isComplete(): boolean {
    return !!this.state.completedAt;
  }

  /**
   * Get progress percentage
   */
  getProgressPercentage(): number {
    const requiredSteps = onboardingSteps.filter((s) => !s.isOptional);
    const completedRequiredSteps = requiredSteps.filter((s) =>
      this.state.completedSteps.includes(s.id)
    );
    return Math.round(
      (completedRequiredSteps.length / requiredSteps.length) * 100
    );
  }

  /**
   * Get current step index
   */
  getCurrentStepIndex(): number {
    return onboardingSteps.findIndex((s) => s.id === this.state.currentStep);
  }

  /**
   * Get total steps
   */
  getTotalSteps(): number {
    return onboardingSteps.length;
  }
}

// Singleton instance
let storeInstance: OnboardingStore | null = null;

function getOnboardingStore(): OnboardingStore {
  if (!storeInstance) {
    storeInstance = new OnboardingStore();
  }
  return storeInstance;
}

export { getOnboardingStore };
export type { OnboardingStore };
