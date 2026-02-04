'use client';

/**
 * Setup Wizard Store
 *
 * Client-side state management for the setup wizard flow using
 * a simplified Zustand-like pattern for state management.
 */

import type {
  SetupWizardStep,
  SetupWizardStepId,
  SetupWizardProgress,
  BrandConfig,
  CMSIntegration,
  KeywordConfig,
  ArticleGenerationOptions,
} from '@/types/setup-wizard';

const SETUP_WIZARD_STORAGE_KEY = 'rankbrnd_setup_wizard';
const SETUP_WIZARD_VERSION = 1;

/**
 * All available setup wizard steps in order
 */
const setupWizardSteps: SetupWizardStep[] = [
  {
    id: 'brand-setup',
    title: 'Brand Setup',
    description: 'Configure your brand identity',
    estimatedTime: '3 min',
    isCompleted: false,
  },
  {
    id: 'cms-connection',
    title: 'Connect CMS',
    description: 'Link your content management system',
    estimatedTime: '2 min',
    isOptional: true,
    isCompleted: false,
  },
  {
    id: 'keyword-setup',
    title: 'First Keyword',
    description: 'Add a keyword to track',
    estimatedTime: '2 min',
    isCompleted: false,
  },
  {
    id: 'article-generation',
    title: 'Generate Article',
    description: 'Create your first AI article',
    estimatedTime: '3 min',
    isCompleted: false,
  },
  {
    id: 'complete',
    title: 'All Set!',
    description: "You're ready to go",
    isCompleted: false,
  },
];

/**
 * Default setup wizard progress
 */
const defaultProgress: SetupWizardProgress = {
  userId: '',
  currentStep: 'brand-setup',
  completedSteps: [],
  skippedSteps: [],
  startedAt: null,
  completedAt: null,
  brandSetupComplete: false,
  cmsConnected: false,
  keywordCreated: false,
  articleGenerated: false,
};

/**
 * Setup wizard store class
 */
class SetupWizardStore {
  private listeners: Set<() => void> = new Set();
  private state: SetupWizardProgress & { steps: SetupWizardStep[] };

  constructor() {
    this.state = {
      ...defaultProgress,
      steps: setupWizardSteps,
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
        version: SETUP_WIZARD_VERSION,
        progress: progressToSave,
      };
      localStorage.setItem(SETUP_WIZARD_STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      console.warn('Failed to save setup wizard state:', e);
    }
  }

  /**
   * Load state from localStorage
   */
  private loadFromStorage() {
    try {
      const stored = localStorage.getItem(SETUP_WIZARD_STORAGE_KEY);
      if (!stored) return;

      const data = JSON.parse(stored);
      if (data.version !== SETUP_WIZARD_VERSION) {
        // Version mismatch, clear old data
        localStorage.removeItem(SETUP_WIZARD_STORAGE_KEY);
        return;
      }

      // Merge with default to ensure all fields exist
      this.state = {
        ...defaultProgress,
        ...data.progress,
        steps: this.updateStepsCompletion(data.progress),
      };
    } catch (e) {
      console.warn('Failed to load setup wizard state:', e);
    }
  }

  /**
   * Update step completion status based on progress
   */
  private updateStepsCompletion(
    progress: Partial<SetupWizardProgress>
  ): SetupWizardStep[] {
    return setupWizardSteps.map((step) => ({
      ...step,
      isCompleted: !!(
        progress.completedSteps?.includes(step.id) ||
        (step.id === 'brand-setup' && progress.brandSetupComplete) ||
        (step.id === 'cms-connection' && progress.cmsConnected) ||
        (step.id === 'keyword-setup' && progress.keywordCreated) ||
        (step.id === 'article-generation' && progress.articleGenerated)
      ),
    }));
  }

  /**
   * Start setup wizard for a user
   */
  start(userId: string) {
    this.state.userId = userId;
    this.state.currentStep = 'brand-setup';
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
    const currentIndex = setupWizardSteps.findIndex(
      (s) => s.id === this.state.currentStep
    );
    if (currentIndex < setupWizardSteps.length - 1) {
      const nextStep = setupWizardSteps[currentIndex + 1];
      this.goToStep(nextStep.id);
    }
  }

  /**
   * Move to previous step
   */
  previousStep() {
    const currentIndex = setupWizardSteps.findIndex(
      (s) => s.id === this.state.currentStep
    );
    if (currentIndex > 0) {
      const prevStep = setupWizardSteps[currentIndex - 1];
      this.goToStep(prevStep.id);
    }
  }

  /**
   * Go to a specific step
   */
  goToStep(stepId: SetupWizardStepId) {
    // Mark current step as completed if moving forward
    const currentIndex = setupWizardSteps.findIndex(
      (s) => s.id === this.state.currentStep
    );
    const newIndex = setupWizardSteps.findIndex((s) => s.id === stepId);

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
   * Save brand configuration
   */
  saveBrandConfig(config: BrandConfig) {
    this.state.brandConfig = config;
    this.state.brandSetupComplete = true;
    this.state.steps = this.updateStepsCompletion(this.state);
    this.saveToStorage();
    this.notify();
  }

  /**
   * Save CMS integration
   */
  saveCMSIntegration(integration: CMSIntegration) {
    this.state.cmsIntegration = integration;
    this.state.cmsConnected = integration.connected;
    this.state.steps = this.updateStepsCompletion(this.state);
    this.saveToStorage();
    this.notify();
  }

  /**
   * Save keyword configuration
   */
  saveKeywordConfig(config: KeywordConfig) {
    this.state.keywordConfig = config;
    this.state.keywordCreated = true;
    this.state.steps = this.updateStepsCompletion(this.state);
    this.saveToStorage();
    this.notify();
  }

  /**
   * Save article generation options
   */
  saveArticleOptions(options: ArticleGenerationOptions) {
    this.state.articleOptions = options;
    this.state.articleGenerated = true;
    this.state.steps = this.updateStepsCompletion(this.state);
    this.saveToStorage();
    this.notify();
  }

  /**
   * Complete setup wizard
   */
  complete() {
    this.state.completedAt = new Date().toISOString();
    this.state.currentStep = 'complete';
    if (!this.state.completedSteps.includes('complete')) {
      this.state.completedSteps.push('complete');
    }
    this.saveToStorage();
    this.notify();
  }

  /**
   * Reset setup wizard (for testing or restart)
   */
  reset() {
    this.state = {
      ...defaultProgress,
      steps: setupWizardSteps,
    };
    localStorage.removeItem(SETUP_WIZARD_STORAGE_KEY);
    this.notify();
  }

  /**
   * Check if setup wizard is complete
   */
  isComplete(): boolean {
    return !!this.state.completedAt;
  }

  /**
   * Check if step can be navigated to (previous steps completed)
   */
  canAccessStep(stepId: SetupWizardStepId): boolean {
    const stepIndex = setupWizardSteps.findIndex((s) => s.id === stepId);
    const currentStepIndex = setupWizardSteps.findIndex(
      (s) => s.id === this.state.currentStep
    );

    // Can access current step and any previous step
    return stepIndex <= currentStepIndex;
  }

  /**
   * Get progress percentage
   */
  getProgressPercentage(): number {
    const requiredSteps = setupWizardSteps.filter((s) => !s.isOptional);
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
    return setupWizardSteps.findIndex((s) => s.id === this.state.currentStep);
  }

  /**
   * Get total steps
   */
  getTotalSteps(): number {
    return setupWizardSteps.length;
  }

  /**
   * Get stored brand config
   */
  getBrandConfig(): BrandConfig | undefined {
    return this.state.brandConfig;
  }

  /**
   * Get stored CMS integration
   */
  getCMSIntegration(): CMSIntegration | undefined {
    return this.state.cmsIntegration;
  }

  /**
   * Get stored keyword config
   */
  getKeywordConfig(): KeywordConfig | undefined {
    return this.state.keywordConfig;
  }

  /**
   * Get stored article options
   */
  getArticleOptions(): ArticleGenerationOptions | undefined {
    return this.state.articleOptions;
  }
}

// Singleton instance
let storeInstance: SetupWizardStore | null = null;

function getSetupWizardStore(): SetupWizardStore {
  if (!storeInstance) {
    storeInstance = new SetupWizardStore();
  }
  return storeInstance;
}

export { getSetupWizardStore };
export type { SetupWizardStore };
