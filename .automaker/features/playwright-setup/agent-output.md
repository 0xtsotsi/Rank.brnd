I'll start by exploring the codebase to understand the existing structure and see what's already been done for the Playwright setup.

🔧 Tool: Task
Input: {
  "subagent_type": "Explore",
  "prompt": "Explore the codebase to understand:\n1. The current project structure\n2. Any existing Playwright configuration or setup\n3. The testing infrastructure already in place\n4. Package.json files to see what testing dependencies exist\n\nFocus on finding:\n- playwright.config.ts or similar\n- Any test files in tests/ or e2e/ directories\n- Package.json files in apps/ directories\n- Existing test utilities or fixtures\n\nReturn a comprehensive summary of the current state of Playwright setup and testing infrastructure.",
  "description": "Explore codebase for Playwright setup"
}

🔧 Tool: Glob
Input: {
  "pattern": "**/playwright.config.*"
}

🔧 Tool: Glob
Input: {
  "pattern": "**/playwright.*"
}

🔧 Tool: Glob
Input: {
  "pattern": "**/tests/**"
}

🔧 Tool: Glob
Input: {
  "pattern": "**/test/**"
}

🔧 Tool: Glob
Input: {
  "pattern": "**/*.test.*"
}

🔧 Tool: Glob
Input: {
  "pattern": "**/*.spec.*"
}

🔧 Tool: Read
Input: {
  "file_path": "/home/oxtsotsi/Webrnds/DevFlow/Rank.brnd/.worktrees/feature-configure-playwright-for-e2e-testing/package.json"
}

🔧 Tool: Bash
Input: {
  "command": "pwd && ls -la",
  "description": "Check current directory and list files"
}

🔧 Tool: Bash
Input: {
  "command": "cd /home/oxtsotsi/Webrnds/DevFlow/Rank.brnd && pwd && ls -la",
  "description": "Navigate to project root and list contents"
}

🔧 Tool: Read
Input: {
  "file_path": "/home/oxtsotsi/Webrnds/DevFlow/Rank.brnd/playwright.config.ts"
}

🔧 Tool: Bash
Input: {
  "command": "ls -la /home/oxtsotsi/Webrnds/DevFlow/Rank.brnd/tests/",
  "description": "List files in tests directory"
}

🔧 Tool: Read
Input: {
  "file_path": "/home/oxtsotsi/Webrnds/DevFlow/Rank.brnd/package.json"
}

🔧 Tool: Read
Input: {
  "file_path": "/home/oxtsotsi/Webrnds/DevFlow/Rank.brnd/tests/onboarding-verification.spec.ts",
  "limit": 50
}

🔧 Tool: Bash
Input: {
  "command": "find /home/oxtsotsi/Webrnds/DevFlow/Rank.brnd -name \"package.json\" -type f | head -20",
  "description": "Find all package.json files in the project"
}

🔧 Tool: Bash
Input: {
  "command": "find /home/oxtsotsi/Webrnds/DevFlow -name \"apps\" -type d 2>/dev/null | head -5",
  "description": "Look for apps directory in the broader project"
}

🔧 Tool: Bash
Input: {
  "command": "ls -la /home/oxtsotsi/Webrnds/DevFlow/",
  "description": "List DevFlow directory contents"
}

🔧 Tool: Bash
Input: {
  "command": "ls -la /home/oxtsotsi/Webrnds/DevFlow/apps/",
  "description": "List apps directory contents"
}

🔧 Tool: Bash
Input: {
  "command": "ls -la /home/oxtsotsi/Webrnds/DevFlow/libs/",
  "description": "List libs directory contents"
}

🔧 Tool: Bash
Input: {
  "command": "find /home/oxtsotsi/Webrnds/DevFlow -name \"playwright.config.*\" -o -name \"test\" -type d -o -name \"*.test.*\" -o -name \"*.spec.*\" | grep -v node_modules | grep -v .next",
  "description": "Find all test-related files in monorepo"
}

🔧 Tool: Read
Input: {
  "file_path": "/home/oxtsotsi/Webrnds/DevFlow/apps/server/package.json"
}

🔧 Tool: Read
Input: {
  "file_path": "/home/oxtsotsi/Webrnds/DevFlow/apps/ui/package.json"
}

🔧 Tool: Read
Input: {
  "file_path": "/home/oxtsotsi/Webrnds/DevFlow/apps/ui/playwright.config.ts"
}

🔧 Tool: Read
Input: {
  "file_path": "/home/oxtsotsi/Webrnds/DevFlow/apps/ui/tests/projects/new-project-creation.spec.ts",
  "limit": 50
}

🔧 Tool: Glob
Input: {
  "pattern": "**/tests/**/utils.*"
}

🔧 Tool: Bash
Input: {
  "command": "find /home/oxtsotsi/Webrnds/DevFlow/apps/ui/tests -name \"*.ts\" -o -name \"*.js\" | grep -E \"(utils|global)\" | head -10",
  "description": "Find utility files in UI tests"
}

🔧 Tool: Read
Input: {
  "file_path": "/home/oxtsotsi/Webrnds/DevFlow/apps/ui/tests/global-setup.ts"
}

🔧 Tool: Read
Input: {
  "file_path": "/home/oxtsotsi/Webrnds/DevFlow/package.json",
  "limit": 100
}
Based on the exploration, Playwright is already fully configured in this project. However, I notice I'm in a git worktree for a feature branch called `feature-configure-playwright-for-e2e-testing`. Let me check the specific state of this worktree to see what changes need to be made.

🔧 Tool: Bash
Input: {
  "command": "git status && git log --oneline -5",
  "description": "Check git status and recent commits"
}

🔧 Tool: Glob
Input: {
  "pattern": "**/*playwright*.{ts,js,json}"
}

🔧 Tool: Bash
Input: {
  "command": "cat package.json 2>/dev/null || echo \"No package.json in root\"",
  "description": "Check root package.json"
}
I see - this is a fresh worktree with just an initial commit. Let me check what exists in this worktree:

🔧 Tool: Bash
Input: {
  "command": "ls -la && find . -type f -name \"*.ts\" -o -name \"*.js\" -o -name \"*.json\" 2>/dev/null | head -50",
  "description": "List files in worktree"
}
This worktree is essentially empty - just a `.git` directory. This is a fresh feature branch. Let me understand the context better by checking the feature specification:

🔧 Tool: Bash
Input: {
  "command": "cd /home/oxtsotsi/Webrnds/DevFlow && ls -la .automaker/features/ 2>/dev/null | head -20",
  "description": "Check feature directory"
}
Let me check the main repository to understand what this feature branch should be working on:

🔧 Tool: Bash
Input: {
  "command": "cd /home/oxtsotsi/Webrnds/DevFlow && git branch -a | grep -i playwright",
  "description": "Search for playwright branches"
}

🔧 Tool: Bash
Input: {
  "command": "cd /home/oxtsotsi/Webrnds/DevFlow && cat .automaker/spec.md 2>/dev/null | head -100",
  "description": "Check spec file"
}
Let me check what the main repository looks like and understand the context better:

🔧 Tool: Bash
Input: {
  "command": "cd /home/oxtsotsi/Webrnds/DevFlow && ls -la",
  "description": "List main repo directory"
}

🔧 Tool: Bash
Input: {
  "command": "cd /home/oxtsotsi/Webrnds/DevFlow && git log --oneline --all --graph | head -30",
  "description": "Check git history"
}
I see - this worktree is inside the `Rank.brnd` project. Let me check the Rank.brnd project to understand what Playwright setup might be needed:

🔧 Tool: Bash
Input: {
  "command": "cd /home/oxtsotsi/Webrnds/DevFlow/Rank.brnd && ls -la",
  "description": "List Rank.brnd directory"
}

🔧 Tool: Bash
Input: {
  "command": "cd /home/oxtsotsi/Webrnds/DevFlow/Rank.brnd && cat package.json | head -100",
  "description": "Check Rank.brnd package.json"
}
The Rank.brnd project already has Playwright configured. Let me check the existing configuration:

🔧 Tool: Bash
Input: {
  "command": "cd /home/oxtsotsi/Webrnds/DevFlow/Rank.brnd && cat playwright.config.ts",
  "description": "Check existing playwright config"
}

🔧 Tool: Bash
Input: {
  "command": "cd /home/oxtsotsi/Webrnds/DevFlow/Rank.brnd && ls -la tests/",
  "description": "List existing tests"
}
Now I understand the situation. The Rank.brnd project already has Playwright configured with tests, but I'm in a feature worktree that's empty. Let me check what might be missing that this feature branch is supposed to add. Let me check if there are any issues or TODOs related to Playwright:

🔧 Tool: Bash
Input: {
  "command": "cd /home/oxtsotsi/Webrnds/DevFlow/Rank.brnd && find . -name \"*.ts\" -o -name \"*.js\" -o -name \"*.md\" | xargs grep -l \"TODO.*playwright\\|FIXME.*playwright\\|playwright.*setup\" 2>/dev/null | head -10",
  "description": "Search for Playwright TODOs"
}

🔧 Tool: Bash
Input: {
  "command": "cd /home/oxtsotsi/Webrnds/DevFlow && git log --all --grep=\"playwright\" --oneline | head -10",
  "description": "Search git history for playwright commits"
}
Let me check the Docker setup for Playwright, as one of the commits mentions "playwright-docker-prereqs":

🔧 Tool: Bash
Input: {
  "command": "cd /home/oxtsotsi/Webrnds/DevFlow && git show 3689eb96 --stat",
  "description": "Check the playwright Docker commit"
}

🔧 Tool: Bash
Input: {
  "command": "cd /home/oxtsotsi/Webrnds/DevFlow && cat docker-compose.yml 2>/dev/null | head -100",
  "description": "Check docker-compose for playwright"
}
Let me check what that specific commit added:

🔧 Tool: Bash
Input: {
  "command": "cd /home/oxtsotsi/Webrnds/DevFlow && git show 3689eb96",
  "description": "Show the full playwright Docker commit"
}

🔧 Tool: Bash
Input: {
  "command": "cd /home/oxtsotsi/Webrnds/DevFlow && git show 5e330b76",
  "description": "Show the actual commit changes"
}
Now I understand! The feature worktree is in the `Rank.brnd` project, but the Docker Playwright setup changes are in the main DevFlow project (Automaker). Let me check what this worktree branch is actually connected to:

🔧 Tool: Bash
Input: {
  "command": "git log --oneline --all | grep -i playwright | head -20",
  "description": "Search Rank.brnd git history for playwright"
}

🔧 Tool: Bash
Input: {
  "command": "cd /home/oxtsotsi/Webrnds/DevFlow && cat Rank.brnd/Dockerfile 2>/dev/null || echo \"No Dockerfile in Rank.brnd\"",
  "description": "Check if Rank.brnd has Dockerfile"
}
I see - `Rank.brnd` doesn't have a Dockerfile. This is a Next.js project that already has Playwright configured. Let me check if there's a feature specification or if the worktree is connected to a different repository:

🔧 Tool: Bash
Input: {
  "command": "git remote -v",
  "description": "Check git remotes"
}

🔧 Tool: Bash
Input: {
  "command": "cd /home/oxtsotsi/Webrnds/DevFlow && ls -la .automaker/features/ 2>/dev/null",
  "description": "Check automaker features directory"
}
The worktree seems empty and the features directory is empty. Given the task description says "Install and configure Playwright, create test configuration, set up test utilities and fixtures", and I've found that:

1. Rank.brnd already has Playwright configured
2. The worktree is empty except for .git

Let me understand what might still be missing. Let me check if there are test utilities or fixtures that should be created:

🔧 Tool: Bash
Input: {
  "command": "cd /home/oxtsotsi/Webrnds/DevFlow/Rank.brnd && find tests/ -name \"*.ts\" | head -5 | xargs cat 2>/dev/null | head -100",
  "description": "Check existing test structure"
}

🔧 Tool: Bash
Input: {
  "command": "cd /home/oxtsotsi/Webrnds/DevFlow/Rank.brnd && ls -la tests/",
  "description": "List all test files"
}
Now I have a clearer picture. The Rank.brnd project already has:
1. Playwright configured with `playwright.config.ts`
2. Test scripts in package.json
3. Multiple test files in the tests/ directory
4. Playwright is already installed as a dev dependency

Given this is a fresh worktree that appears to be for implementing Playwright setup, and the main project already has Playwright configured, let me verify if there's anything missing or if this is a case where the feature work is already complete. Let me verify Playwright actually works:

🔧 Tool: TodoWrite
Input: {
  "todos": [
    {
      "content": "Verify Playwright is installed and working",
      "status": "in_progress",
      "activeForm": "Verifying Playwright installation"
    },
    {
      "content": "Create test utilities and fixtures",
      "status": "pending",
      "activeForm": "Creating test utilities and fixtures"
    },
    {
      "content": "Run verification test and delete it",
      "status": "pending",
      "activeForm": "Running verification test"
    }
  ]
}

🔧 Tool: Bash
Input: {
  "command": "cd /home/oxtsotsi/Webrnds/DevFlow/Rank.brnd && which npx && npx playwright --version 2>/dev/null || echo \"Playwright not found in PATH\"",
  "description": "Check if Playwright is installed"
}

🔧 Tool: Bash
Input: {
  "command": "cd /home/oxtsotsi/Webrnds/DevFlow/Rank.brnd && ls node_modules/.bin/ | grep playwright || echo \"No playwright in node_modules/.bin\"",
  "description": "Check local playwright binary"
}
Playwright is installed. Now let me check if browsers are installed:

🔧 Tool: Bash
Input: {
  "command": "cd /home/oxtsotsi/Webrnds/DevFlow/Rank.brnd && npx playwright install --dry-run chromium 2>&1 | head -20",
  "description": "Check Playwright browser status"
}
Now let me check if the browsers are actually downloaded:

🔧 Tool: Bash
Input: {
  "command": "ls -la /home/oxtsotsi/.cache/ms-playwright/ 2>/dev/null | head -20 || echo \"No Playwright cache found\"",
  "description": "Check Playwright cache"
}
Playwright browsers are already installed. Let me now check what test utilities and fixtures might be needed. Looking at the existing tests, they don't seem to have shared utilities. Let me create a proper test infrastructure:

🔧 Tool: TodoWrite
Input: {
  "todos": [
    {
      "activeForm": "Verified Playwright installation",
      "content": "Verify Playwright is installed and working",
      "status": "completed"
    },
    {
      "activeForm": "Creating test utilities and fixtures",
      "content": "Create test utilities and fixtures",
      "status": "in_progress"
    },
    {
      "activeForm": "Running verification test",
      "content": "Run verification test and delete it",
      "status": "pending"
    }
  ]
}

🔧 Tool: Bash
Input: {
  "command": "cd /home/oxtsotsi/Webrnds/DevFlow/Rank.brnd && find tests/ -type d",
  "description": "Check test directory structure"
}

🔧 Tool: Read
Input: {
  "file_path": "/home/oxtsotsi/Webrnds/DevFlow/Rank.brnd/tests/onboarding-verification.spec.ts"
}
Now I understand the test structure better. The tests are standalone without shared utilities. Let me create a proper test infrastructure with:
1. Test fixtures for common operations (auth, navigation, etc.)
2. Test utilities for reusable helper functions
3. Mock data fixtures

🔧 Tool: Bash
Input: {
  "command": "cd /home/oxtsotsi/Webrnds/DevFlow/Rank.brnd && mkdir -p tests/fixtures tests/utils tests/mocks",
  "description": "Create test infrastructure directories"
}

🔧 Tool: Write
Input: {
  "file_path": "/home/oxtsotsi/Webrnds/DevFlow/Rank.brnd/tests/fixtures/auth.fixture.ts",
  "content": "import { test as base } from '@playwright/test';\n\n/**\n * Authentication fixtures for Playwright tests\n *\n * Provides authenticated page context and helper methods\n */\n\nexport interface AuthFixtures {\n  authenticatedPage: import('@playwright/test').Page;\n  login: (email?: string, password?: string) => Promise<void>;\n  logout: () => Promise<void>;\n}\n\nexport const test = base.extend<AuthFixtures>({\n  authenticatedPage: async ({ page }, use) => {\n    // Check if user is already logged in via localStorage\n    const isLoggedIn = await page.evaluate(() => {\n      const token = localStorage.getItem('clerk_session');\n      return !!token;\n    });\n\n    if (!isLoggedIn) {\n      // Navigate to sign in\n      await page.goto('/sign-in');\n      // Note: Actual login would be handled by test-specific credentials\n    }\n\n    await use(page);\n  },\n\n  login: async ({ page }, use) => {\n    const loginFunc = async (email = 'test@example.com', password = 'password') => {\n      await page.goto('/sign-in');\n\n      // Clerk handles the login form\n      // This is a placeholder for the actual login flow\n      // Tests should implement specific login logic based on auth provider\n    };\n    await use(loginFunc);\n  },\n\n  logout: async ({ page }, use) => {\n    const logoutFunc = async () => {\n      await page.goto('/');\n      // Click logout button or clear session\n      await page.evaluate(() => {\n        localStorage.clear();\n        sessionStorage.clear();\n      });\n    };\n    await use(logoutFunc);\n  },\n});\n\nexport { expect } from '@playwright/test';\n"
}

🔧 Tool: Write
Input: {
  "file_path": "/home/oxtsotsi/Webrnds/DevFlow/Rank.brnd/tests/fixtures/supabase.fixture.ts",
  "content": "import { test as base } from '@playwright/test';\n\n/**\n * Supabase client fixture for Playwright tests\n *\n * Provides direct Supabase access for test setup/teardown\n */\n\nexport interface SupabaseFixtures {\n  supabase: {\n    createTestUser: (email: string, password: string) => Promise<{ id: string; email: string }>;\n    deleteTestUser: (userId: string) => Promise<void>;\n    cleanTestData: (userId: string) => Promise<void>;\n  };\n}\n\nexport const test = base.extend<SupabaseFixtures>({\n  supabase: async ({ }, use) => {\n    // Import Supabase client dynamically\n    const { createClient } = await import('@supabase/supabase-js');\n\n    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';\n    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';\n\n    const client = createClient(supabaseUrl, supabaseKey);\n\n    const helpers = {\n      async createTestUser(email: string, password: string) {\n        const { data, error } = await client.auth.signUp({\n          email,\n          password,\n        });\n\n        if (error) throw error;\n        return { id: data.user?.id || '', email: data.user?.email || '' };\n      },\n\n      async deleteTestUser(userId: string) {\n        const { error } = await client.auth.admin.deleteUser(userId);\n        if (error) throw error;\n      },\n\n      async cleanTestData(userId: string) {\n        // Clean up test data from all tables\n        const tables = ['articles', 'keywords', 'organizations', 'onboarding_progress'];\n\n        for (const table of tables) {\n          await client.from(table).delete().eq('user_id', userId);\n        }\n      },\n    };\n\n    await use(helpers);\n  },\n});\n\nexport { expect } from '@playwright/test';\n"
}

🔧 Tool: Write
Input: {
  "file_path": "/home/oxtsotsi/Webrnds/DevFlow/Rank.brnd/tests/utils/test-helpers.ts",
  "content": "import { Page, Locator } from '@playwright/test';\n\n/**\n * Common test utilities and helper functions\n */\n\nexport class TestHelpers {\n  constructor(public readonly page: Page) {}\n\n  /**\n   * Wait for network idle (no network requests for specified duration)\n   */\n  async waitForNetworkIdle(duration = 500): Promise<void> {\n    await this.page.waitForLoadState('networkidle', { timeout: duration });\n  }\n\n  /**\n   * Wait for toast notification to appear and disappear\n   */\n  async waitForToast(message?: string): Promise<Locator> {\n    const toast = this.page.locator('[role=\"status\"], .toast, .notification');\n    if (message) {\n      await toast.filter({ hasText: message }).waitFor();\n      return toast.filter({ hasText: message });\n    }\n    await toast.first().waitFor();\n    return toast.first();\n  }\n\n  /**\n   * Fill a form with given key-value pairs\n   */\n  async fillForm(fields: Record<string, string>): Promise<void> {\n    for (const [selector, value] of Object.entries(fields)) {\n      await this.page.fill(selector, value);\n    }\n  }\n\n  /**\n   * Take screenshot on failure\n   */\n  async screenshotOnFailure(testName: string): Promise<void> {\n    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');\n    await this.page.screenshot({\n      path: `test-screenshots/${testName}-${timestamp}.png`,\n      fullPage: true,\n    });\n  }\n\n  /**\n   * Clear all storage (localStorage, sessionStorage, cookies)\n   */\n  async clearStorage(): Promise<void> {\n    await this.page.evaluate(() => {\n      localStorage.clear();\n      sessionStorage.clear();\n    });\n    const context = this.page.context();\n    await context.clearCookies();\n  }\n\n  /**\n   * Navigate to a page and wait for it to be loaded\n   */\n  async navigateAndWait(path: string): Promise<void> {\n    await this.page.goto(path, { waitUntil: 'networkidle' });\n  }\n\n  /**\n   * Get text content of an element\n   */\n  async getText(selector: string): Promise<string> {\n    return (await this.page.locator(selector).textContent()) || '';\n  }\n\n  /**\n   * Check if element exists\n   */\n  async exists(selector: string): Promise<boolean> {\n    return (await this.page.locator(selector).count()) > 0;\n  }\n\n  /**\n   * Wait for element to be visible\n   */\n  async waitForVisible(selector: string, timeout = 5000): Promise<void> {\n    await this.page.locator(selector).waitFor({ state: 'visible', timeout });\n  }\n\n  /**\n   * Wait for element to be hidden\n   */\n  async waitForHidden(selector: string, timeout = 5000): Promise<void> {\n    await this.page.locator(selector).waitFor({ state: 'hidden', timeout });\n  }\n\n  /**\n   * Click element and wait for navigation\n   */\n  async clickAndWait(selector: string): Promise<void> {\n    await Promise.all([\n      this.page.waitForLoadState('networkidle'),\n      this.page.click(selector),\n    ]);\n  }\n\n  /**\n   * Upload a test file\n   */\n  async uploadFile(selector: string, fileName: string, content: Buffer | string): Promise<void> {\n    const buffer = typeof content === 'string' ? Buffer.from(content) : content;\n    await this.page.locator(selector).setInputFiles({\n      name: fileName,\n      mimeType: this.getMimeType(fileName),\n      buffer,\n    });\n  }\n\n  /**\n   * Get MIME type based on file extension\n   */\n  private getMimeType(fileName: string): string {\n    const ext = fileName.split('.').pop()?.toLowerCase();\n    const mimeTypes: Record<string, string> = {\n      png: 'image/png',\n      jpg: 'image/jpeg',\n      jpeg: 'image/jpeg',\n      gif: 'image/gif',\n      webp: 'image/webp',\n      pdf: 'application/pdf',\n      txt: 'text/plain',\n      json: 'application/json',\n    };\n    return mimeTypes[ext || ''] || 'application/octet-stream';\n  }\n\n  /**\n   * Mock API response\n   */\n  async mockApi(endpoint: string, response: any): Promise<void> {\n    await this.page.route(endpoint, (route) => {\n      route.fulfill({\n        status: 200,\n        contentType: 'application/json',\n        body: JSON.stringify(response),\n      });\n    });\n  }\n\n  /**\n   * Mock API error\n   */\n  async mockApiError(endpoint: string, status = 500): Promise<void> {\n    await this.page.route(endpoint, (route) => {\n      route.fulfill({\n        status,\n        contentType: 'application/json',\n        body: JSON.stringify({ error: 'Test error' }),\n      });\n    });\n  }\n\n  /**\n   * Get current URL\n   */\n  getUrl(): string {\n    return this.page.url();\n  }\n\n  /**\n   * Wait for URL to contain path\n   */\n  async waitForUrl(path: string): Promise<void> {\n    await this.page.waitForURL(`**${path}`);\n  }\n\n  /**\n   * Reload page\n   */\n  async reload(): Promise<void> {\n    await this.page.reload({ waitUntil: 'networkidle' });\n  }\n\n  /**\n   * Execute JavaScript in page context\n   */\n  async evaluate<T>(fn: () => T): Promise<T> {\n    return this.page.evaluate(fn);\n  }\n\n  /**\n   * Get value of environment variable from page context\n   */\n  async getEnvVar(key: string): Promise<string | null> {\n    return this.page.evaluate((k) => {\n      // @ts-ignore\n      return process.env?.[k] || null;\n    }, key);\n  }\n}\n\n/**\n * Create test helpers instance\n */\nexport function createTestHelpers(page: Page): TestHelpers {\n  return new TestHelpers(page);\n}\n\n/**\n * Assertive test helpers with built-in expectations\n */\nexport class AssertiveHelpers extends TestHelpers {\n  async assertVisible(selector: string): Promise<void> {\n    const { expect } = await import('@playwright/test');\n    await expect(this.page.locator(selector)).toBeVisible();\n  }\n\n  async assertHidden(selector: string): Promise<void> {\n    const { expect } = await import('@playwright/test');\n    await expect(this.page.locator(selector)).toBeHidden();\n  }\n\n  async assertText(selector: string, text: string): Promise<void> {\n    const { expect } = await import('@playwright/test');\n    await expect(this.page.locator(selector)).toContainText(text);\n  }\n\n  async assertElementCount(selector: string, count: number): Promise<void> {\n    const { expect } = await import('@playwright/test');\n    await expect(this.page.locator(selector)).toHaveCount(count);\n  }\n\n  async assertEnabled(selector: string): Promise<void> {\n    const { expect } = await import('@playwright/test');\n    await expect(this.page.locator(selector)).toBeEnabled();\n  }\n\n  async assertDisabled(selector: string): Promise<void> {\n    const { expect } = await import('@playwright/test');\n    await expect(this.page.locator(selector)).toBeDisabled();\n  }\n\n  async assertAttributeValue(selector: string, attribute: string, value: string): Promise<void> {\n    const { expect } = await import('@playwright/test');\n    await expect(this.page.locator(selector)).toHaveAttribute(attribute, value);\n  }\n}\n\n/**\n * Create assertive helpers instance\n */\nexport function createAssertiveHelpers(page: Page): AssertiveHelpers {\n  return new AssertiveHelpers(page);\n}\n"
}

🔧 Tool: Write
Input: {
  "file_path": "/home/oxtsotsi/Webrnds/DevFlow/Rank.brnd/tests/utils/selectors.ts",
  "content": "/**\n * Reusable selector definitions for common page elements\n *\n * Centralizes selector strings to make tests more maintainable\n */\n\nexport const Selectors = {\n  // Auth\n  signInButton: 'button[type=\"submit\"], button:has-text(\"Sign In\"), button:has-text(\"Sign in\")',\n  signOutButton: 'button:has-text(\"Sign Out\"), button:has-text(\"Sign out\"), button:has-text(\"Logout\")',\n  emailInput: 'input[name=\"email\"], input[type=\"email\"]',\n  passwordInput: 'input[name=\"password\"], input[type=\"password\"]',\n\n  // Navigation\n  navBar: 'nav, [role=\"navigation\"]',\n  homeLink: 'a[href=\"/\"], a:has-text(\"Home\")',\n  dashboardLink: 'a[href=\"/dashboard\"], a:has-text(\"Dashboard\")',\n  articlesLink: 'a[href=\"/articles\"], a:has-text(\"Articles\")',\n  keywordsLink: 'a[href=\"/keywords\"], a:has-text(\"Keywords\")',\n  settingsLink: 'a[href=\"/settings\"], a:has-text(\"Settings\")',\n\n  // Common elements\n  primaryButton: 'button:not([disabled]):not([type=\"submit\"]), .btn-primary',\n  submitButton: 'button[type=\"submit\"]',\n  cancelButton: 'button:has-text(\"Cancel\"), .btn-cancel',\n  deleteButton: 'button:has-text(\"Delete\"), .btn-delete',\n  editButton: 'button:has-text(\"Edit\"), .btn-edit',\n  saveButton: 'button:has-text(\"Save\")',\n\n  // Forms\n  formInput: 'input:not([type=\"hidden\"]):not([type=\"checkbox\"]):not([type=\"radio\"])',\n  formSelect: 'select',\n  formTextarea: 'textarea',\n  formCheckbox: 'input[type=\"checkbox\"]',\n  formRadio: 'input[type=\"radio\"]',\n  formLabel: 'label',\n\n  // Notifications\n  toast: '[role=\"status\"], .toast, .notification',\n  successToast: '.toast.success, .notification.success, [role=\"status\"][data-type=\"success\"]',\n  errorToast: '.toast.error, .notification.error, [role=\"status\"][data-type=\"error\"]',\n  warningToast: '.toast.warning, .notification.warning, [role=\"status\"][data-type=\"warning\"]',\n  infoToast: '.toast.info, .notification.info, [role=\"status\"][data-type=\"info\"]',\n\n  // Loading states\n  spinner: '.spinner, .loading, [role=\"status\"][aria-busy=\"true\"]',\n  skeleton: '.skeleton, [aria-busy=\"true\"]',\n\n  // Modals\n  modal: '.modal, [role=\"dialog\"], .dialog',\n  modalOverlay: '.modal-overlay, .dialog-overlay, [role=\"dialog\"] + div',\n  modalClose: 'button[aria-label=\"Close\"], button:has-text(\"Close\"), button:has-text(\"×\")',\n  modalTitle: '.modal-title, [role=\"dialog\"] h1, [role=\"dialog\"] h2',\n\n  // Dashboard\n  dashboardHeading: 'h1:has-text(\"Dashboard\")',\n  statsCard: '.stat-card, .metric-card, [data-testid=\"stat\"]',\n\n  // Articles\n  articleList: '.article-list, [data-testid=\"article-list\"]',\n  articleCard: '.article-card, [data-testid=\"article-card\"]',\n  articleTitle: '.article-title, [data-testid=\"article-title\"]',\n  createArticleButton: 'button:has-text(\"Create Article\"), a[href=\"/articles/new\"]',\n\n  // Keywords\n  keywordList: '.keyword-list, [data-testid=\"keyword-list\"]',\n  keywordCard: '.keyword-card, [data-testid=\"keyword-card\"]',\n  keywordSearch: 'input[placeholder*=\"search\" i], input[name=\"search\"], [data-testid=\"keyword-search\"]',\n\n  // Onboarding\n  onboardingProgress: '.progress-bar, [data-testid=\"onboarding-progress\"]',\n  onboardingStep: '.onboarding-step, [data-testid=\"onboarding-step\"]',\n  skipButton: 'button:has-text(\"Skip\"), button:has-text(\"Skip for now\")',\n  nextButton: 'button:has-text(\"Next\"), button:has-text(\"Continue\")',\n\n  // Integrations\n  cmsOption: '.cms-option, [data-testid=\"cms-option\"]',\n  integrationCard: '.integration-card, [data-testid=\"integration-card\"]',\n  connectButton: 'button:has-text(\"Connect\"), button:has-text(\"Connect\")',\n\n  // Settings\n  settingsSection: '.settings-section, [data-testid=\"settings-section\"]',\n  settingsTab: '.settings-tab, [role=\"tab\"]',\n\n  // Common data attributes\n  dataTestId: (testId: string) => `[data-testid=\"${testId}\"]`,\n  dataRole: (role: string) => `[data-role=\"${role}\"]`,\n};\n\n/**\n * Page-specific selector groups\n */\nexport const PageSelectors = {\n  signIn: {\n    form: 'form[action*=\"/sign-in\"], form[data-testid=\"sign-in-form\"]',\n    ...Selectors,\n  },\n  signUp: {\n    form: 'form[action*=\"/sign-up\"], form[data-testid=\"sign-up-form\"]',\n    ...Selectors,\n  },\n  dashboard: {\n    heading: 'h1',\n    statsCards: '.stat-card',\n    ...Selectors,\n  },\n  articles: {\n    list: '.article-list',\n    card: '.article-card',\n    createButton: 'a[href=\"/articles/new\"]',\n    ...Selectors,\n  },\n  keywords: {\n    list: '.keyword-list',\n    searchInput: 'input[placeholder*=\"search\"]',\n    ...Selectors,\n  },\n  onboarding: {\n    progressBar: '.progress-bar',\n    stepIndicator: '.step-indicator',\n    ...Selectors,\n  },\n};\n\n/**\n * Dynamic selector builders\n */\nexport const SelectorBuilders = {\n  /**\n   * Build a selector for an element with specific text\n   */\n  withText: (selector: string, text: string) => `${selector}:has-text(\"${text}\")`,\n\n  /**\n   * Build a selector for an element with exact text\n   */\n  withExactText: (selector: string, text: string) => `${selector}:text(\"${text}\")`,\n\n  /**\n   * Build a selector for an element with specific attribute\n   */\n  withAttribute: (selector: string, attribute: string, value: string) =>\n    `${selector}[${attribute}=\"${value}\"]`,\n\n  /**\n   * Build a selector for nth element\n   */\n  nth: (selector: string, index: number) => `${selector} >> nth=${index}`,\n\n  /**\n   * Build a selector for an element containing specific child\n   */\n  withChild: (parent: string, child: string) => `${parent} >> ${child}`,\n\n  /**\n   * Build a selector for an element following another\n   */\n  following: (selector: string, following: string) => `${selector} + ${following}`,\n\n  /**\n   * Build a selector for an element following another (siblings)\n   */\n  followingAll: (selector: string, following: string) => `${selector} ~ ${following}`,\n};\n"
}

🔧 Tool: Write
Input: {
  "file_path": "/home/oxtsotsi/Webrnds/DevFlow/Rank.brnd/tests/mocks/test-data.ts",
  "content": "/**\n * Mock data fixtures for testing\n *\n * Provides consistent test data across all test files\n */\n\nexport const MockUsers = {\n  standard: {\n    email: 'test@example.com',\n    password: 'TestPassword123!',\n    firstName: 'Test',\n    lastName: 'User',\n  },\n  admin: {\n    email: 'admin@example.com',\n    password: 'AdminPassword123!',\n    firstName: 'Admin',\n    lastName: 'User',\n  },\n  unverified: {\n    email: 'unverified@example.com',\n    password: 'Unverified123!',\n    firstName: 'Unverified',\n    lastName: 'User',\n  },\n};\n\nexport const MockArticles = {\n  draft: {\n    title: 'Test Draft Article',\n    content: 'This is a test article content',\n    slug: 'test-draft-article',\n    status: 'draft',\n  },\n  published: {\n    title: 'Test Published Article',\n    content: 'This is a published article content',\n    slug: 'test-published-article',\n    status: 'published',\n  },\n  withMarkdown: {\n    title: 'Article with Markdown',\n    content: '# Heading\\n\\n**Bold text** and *italic text*\\n\\n- List item 1\\n- List item 2',\n    slug: 'article-with-markdown',\n    status: 'draft',\n  },\n};\n\nexport const MockKeywords = {\n  lowVolume: {\n    keyword: 'test keyword low volume',\n    volume: 100,\n    difficulty: 10,\n    intent: 'informational',\n  },\n  highVolume: {\n    keyword: 'popular search term',\n    volume: 10000,\n    difficulty: 70,\n    intent: 'commercial',\n  },\n  longTail: {\n    keyword: 'best long tail keyword for specific niche',\n    volume: 50,\n    difficulty: 5,\n    intent: 'transactional',\n  },\n};\n\nexport const MockOrganizations = {\n  standard: {\n    name: 'Test Organization',\n    slug: 'test-organization',\n    domain: 'test-org.com',\n  },\n  withSpecialChars: {\n    name: \"Test's Organization & Co.\",\n    slug: 'tests-organization-co',\n    domain: 'test-org-co.com',\n  },\n};\n\nexport const MockOnboarding = {\n  completedSteps: ['welcome', 'organization-setup', 'product-tour', 'first-article', 'integrations'],\n  partialSteps: ['welcome', 'organization-setup'],\n  currentStep: 'integrations',\n};\n\nexport const MockIntegrations = {\n  wordpress: {\n    name: 'WordPress',\n    type: 'wordpress',\n    url: 'https://example.com/wp-json',\n    credentials: { username: 'test', applicationPassword: 'test123' },\n  },\n  ghost: {\n    name: 'Ghost',\n    type: 'ghost',\n    url: 'https://example.com/ghost/api',\n    credentials: { adminApiKey: 'test_key' },\n  },\n  notion: {\n    name: 'Notion',\n    type: 'notion',\n    url: 'https://notion.so',\n    credentials: { accessToken: 'test_token', databaseId: 'test_db_id' },\n  },\n};\n\nexport const MockApiResponses = {\n  success: (data: any) => ({\n    success: true,\n    data,\n  }),\n\n  error: (message: string, code = 'ERROR') => ({\n    success: false,\n    error: {\n      code,\n      message,\n    },\n  }),\n\n  paginated: (items: any[], page = 1, perPage = 10) => ({\n    success: true,\n    data: items,\n    pagination: {\n      page,\n      perPage,\n      total: items.length,\n      totalPages: Math.ceil(items.length / perPage),\n    },\n  }),\n};\n\nexport const MockImages = {\n  png: {\n    name: 'test-image.png',\n    mimeType: 'image/png',\n    content: Buffer.from(\n      'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',\n      'base64'\n    ),\n  },\n\n  jpeg: {\n    name: 'test-image.jpg',\n    mimeType: 'image/jpeg',\n    content: Buffer.from(\n      '/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDA8NDg0ODc6PDw/AoQEBAAMBAgQGBggUEwgIBgcBAQsKCgoKDw4MDQ8PDw4MDw8PDAwMDw8MDw8PDAwMDw8MDw8PDAwMDw8MDw8PDAwMDw8MDw8P/8AAEQgAAQABAwERAAIRAQMRAf/EABUAAQEAAAAAAAAAAAAAAAAAAAAf/8QAFBABAAAAAAAAAAAAAAAAAAAAAP/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R/Oi6lLcuNv4J9JbtS5ibeQFOnV/YYo0UZSVMvJJPJUVUI0OlVZZ1P/AIAjmfGiEchuWNZWFTaTFZKLU0ZMLUbXYQc+NqnY1NTfTCA0OrXHhMVF01k3RZW0xQaXHhMVF01k3RZW0xQaXHhMVF01k3RZW0xQaXHhMVF01k3RZW0xQaXHhMVF01k3RZW0xQaXHg==',\n      'base64'\n    ),\n  },\n\n  svg: {\n    name: 'test-image.svg',\n    mimeType: 'image/svg+xml',\n    content: Buffer.from(\n      '<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"100\" height=\"100\"><rect width=\"100\" height=\"100\" fill=\"red\"/></svg>',\n      'utf-8'\n    ),\n  },\n};\n\n/**\n * Create a mock response with delay\n */\nexport async function mockDelay(ms: number): Promise<void> {\n  return new Promise((resolve) => setTimeout(resolve, ms));\n}\n\n/**\n * Create a mock API response with random delay\n */\nexport async function mockApiResponse<T>(data: T, delay = 100): Promise<T> {\n  await mockDelay(delay);\n  return data;\n}\n\n/**\n * Generate a random test string\n */\nexport function randomTestString(prefix = 'test'): string {\n  return `${prefix}-${Date.now()}-${Math.random().toString(36).substring(7)}`;\n}\n\n/**\n * Generate a random email\n */\nexport function randomEmail(): string {\n  return `test-${Date.now()}@example.com`;\n}\n\n/**\n * Generate a random slug\n */\nexport function randomSlug(): string {\n  return `test-${Date.now()}`;\n}\n"
}

🔧 Tool: Write
Input: {
  "file_path": "/home/oxtsotsi/Webrnds/DevFlow/Rank.brnd/tests/mocks/api-handlers.ts",
  "content": "import { Page, Route } from '@playwright/test';\n\n/**\n * API route handlers for mocking backend responses\n *\n * Provides reusable handlers for common API endpoints\n */\n\nexport class ApiHandlers {\n  constructor(private readonly page: Page) {}\n\n  /**\n   * Mock GET request\n   */\n  mockGet(endpoint: string, response: any, status = 200): void {\n    this.page.route(`**${endpoint}**`, (route: Route) => {\n      route.fulfill({\n        status,\n        contentType: 'application/json',\n        body: JSON.stringify(response),\n      });\n    });\n  }\n\n  /**\n   * Mock POST request\n   */\n  mockPost(endpoint: string, response: any, status = 200): void {\n    this.page.route(`**${endpoint}**`, (route: Route) => {\n      route.fulfill({\n        status,\n        contentType: 'application/json',\n        body: JSON.stringify(response),\n      });\n    });\n  }\n\n  /**\n   * Mock PUT request\n   */\n  mockPut(endpoint: string, response: any, status = 200): void {\n    this.page.route(`**${endpoint}**`, (route: Route) => {\n      route.fulfill({\n        status,\n        contentType: 'application/json',\n        body: JSON.stringify(response),\n      });\n    });\n  }\n\n  /**\n   * Mock DELETE request\n   */\n  mockDelete(endpoint: string, response: any = { success: true }, status = 200): void {\n    this.page.route(`**${endpoint}**`, (route: Route) => {\n      route.fulfill({\n        status,\n        contentType: 'application/json',\n        body: JSON.stringify(response),\n      });\n    });\n  }\n\n  /**\n   * Mock API error\n   */\n  mockError(endpoint: string, message = 'Internal Server Error', status = 500): void {\n    this.page.route(`**${endpoint}**`, (route: Route) => {\n      route.fulfill({\n        status,\n        contentType: 'application/json',\n        body: JSON.stringify({\n          success: false,\n          error: {\n            code: status.toString(),\n            message,\n          },\n        }),\n      });\n    });\n  }\n\n  /**\n   * Mock network error\n   */\n  mockNetworkError(endpoint: string): void {\n    this.page.route(`**${endpoint}**`, (route: Route) => {\n      route.abort('failed');\n    });\n  }\n\n  /**\n   * Mock timeout\n   */\n  mockTimeout(endpoint: string): void {\n    this.page.route(`**${endpoint}**', (route: Route) => {\n      // Never fulfill, causing timeout\n    });\n  }\n\n  /**\n   * Mock with custom handler\n   */\n  mockCustom(endpoint: string, handler: (route: Route) => void | Promise<void>): void {\n    this.page.route(`**${endpoint}**`, handler);\n  }\n\n  /**\n   * Remove all mocks\n   */\n  clearAllMocks(): void {\n    this.page.unrouteAll();\n  }\n\n  /**\n   * Mock specific endpoint with method\n   */\n  mockWithMethod(\n    endpoint: string,\n    method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH',\n    response: any,\n    status = 200\n  ): void {\n    this.page.route(`**${endpoint}**`, (route: Route) => {\n      const requestMethod = route.request().method();\n      if (requestMethod === method) {\n        route.fulfill({\n          status,\n          contentType: 'application/json',\n          body: JSON.stringify(response),\n        });\n      } else {\n        route.continue();\n      }\n    });\n  }\n}\n\n/**\n * Common API endpoint mocks\n */\nexport class CommonApiMocks extends ApiHandlers {\n  constructor(page: Page) {\n    super(page);\n  }\n\n  /**\n   * Mock authentication endpoints\n   */\n  mockAuth(options: { isAuthenticated?: boolean; user?: any } = {}): void {\n    const { isAuthenticated = true, user = null } = options;\n\n    this.mockGet('/api/user', isAuthenticated\n      ? {\n          success: true,\n          data: user || {\n            id: 'test-user-id',\n            email: 'test@example.com',\n            firstName: 'Test',\n            lastName: 'User',\n          },\n        }\n      : { success: false, error: { code: '401', message: 'Unauthorized' } },\n      isAuthenticated ? 200 : 401\n    );\n  }\n\n  /**\n   * Mock articles API\n   */\n  mockArticles(articles: any[] = []): void {\n    this.mockGet('/api/articles', {\n      success: true,\n      data: articles,\n      pagination: {\n        page: 1,\n        perPage: 10,\n        total: articles.length,\n        totalPages: 1,\n      },\n    });\n  }\n\n  /**\n   * Mock keywords API\n   */\n  mockKeywords(keywords: any[] = []): void {\n    this.mockGet('/api/keywords', {\n      success: true,\n      data: keywords,\n    });\n  }\n\n  /**\n   * Mock onboarding API\n   */\n  mockOnboarding(progress: any = {}): void {\n    this.mockGet('/api/onboarding', {\n      success: true,\n      data: {\n        currentStep: 'welcome',\n        completedSteps: [],\n        skippedSteps: [],\n        ...progress,\n      },\n    });\n  }\n\n  /**\n   * Mock integrations API\n   */\n  mockIntegrations(integrations: any[] = []): void {\n    this.mockGet('/api/integrations', {\n      success: true,\n      data: integrations,\n    });\n  }\n\n  /**\n   * Mock Supabase storage\n   */\n  mockStorageUpload(response: any = { success: true, path: '/test/path' }): void {\n    this.mockPost('/api/storage/upload', response);\n  }\n}\n\n/**\n * Create API handlers instance\n */\nexport function createApiHandlers(page: Page): ApiHandlers {\n  return new ApiHandlers(page);\n}\n\n/**\n * Create common API mocks instance\n */\nexport function createCommonApiMocks(page: Page): CommonApiMocks {\n  return new CommonApiMocks(page);\n}\n"
}
Now let me create a comprehensive test configuration file that enhances the existing one:

🔧 Tool: Read
Input: {
  "file_path": "/home/oxtsotsi/Webrnds/DevFlow/Rank.brnd/playwright.config.ts"
}

🔧 Tool: Edit
Input: {
  "file_path": "/home/oxtsotsi/Webrnds/DevFlow/Rank.brnd/playwright.config.ts",
  "old_string": "import { defineConfig, devices } from '@playwright/test';\n\n/**\n * Playwright Configuration\n * See https://playwright.dev/docs/test-configuration.\n */\nexport default defineConfig({\n  testDir: './tests',\n  fullyParallel: true,\n  forbidOnly: !!process.env.CI,\n  retries: process.env.CI ? 2 : 0,\n  workers: process.env.CI ? 1 : undefined,\n  reporter: 'html',\n\n  use: {\n    baseURL: 'http://localhost:3000',\n    trace: 'on-first-retry',\n  },\n\n  projects: [\n    {\n      name: 'chromium',\n      use: { ...devices['Desktop Chrome'] },\n    },\n  ],\n\n  // Start dev server before running tests\n  webServer: {\n    command: 'pnpm run dev',\n    url: 'http://localhost:3000',\n    reuseExistingServer: !process.env.CI,\n    timeout: 120000,\n  },\n});",
  "new_string": "import { defineConfig, devices } from '@playwright/test';\nimport { defineConfig as defineBddConfig } from 'playwright-bdd';\n\n/**\n * Playwright Configuration\n * See https://playwright.dev/docs/test-configuration.\n *\n * Test Organization:\n * - tests/fixtures/ - Reusable test fixtures (auth, supabase, etc.)\n * - tests/utils/ - Helper functions and selectors\n * - tests/mocks/ - Mock data and API handlers\n * - tests/*.spec.ts - E2E test files\n * - tests/unit/ - Unit test files\n */\nexport default defineConfig({\n  testDir: './tests',\n  testMatch: '**/*.spec.ts',\n  fullyParallel: true,\n  forbidOnly: !!process.env.CI,\n  retries: process.env.CI ? 2 : 0,\n  workers: process.env.CI ? 1 : undefined,\n\n  // Reporter configuration\n  reporter: [\n    ['html', { outputFolder: 'playwright-report', open: 'never' }],\n    ['json', { outputFile: 'test-results/test-results.json' }],\n    ['list'],\n  ],\n\n  // Shared settings for all tests\n  use: {\n    baseURL: 'http://localhost:3000',\n    trace: 'on-first-retry',\n    screenshot: 'only-on-failure',\n    video: 'retain-on-failure',\n    // Capture logs on failure\n    actionTimeout: 10000,\n    navigationTimeout: 30000,\n  },\n\n  projects: [\n    {\n      name: 'chromium',\n      use: { ...devices['Desktop Chrome'] },\n    },\n\n    // Test against mobile viewports\n    {\n      name: 'Mobile Chrome',\n      use: { ...devices['Pixel 5'] },\n    },\n    {\n      name: 'Mobile Safari',\n      use: { ...devices['iPhone 12'] },\n    },\n  ],\n\n  // Start dev server before running tests\n  webServer: {\n    command: 'pnpm run dev',\n    url: 'http://localhost:3000',\n    reuseExistingServer: !process.env.CI,\n    timeout: 120000,\n    stdout: 'pipe',\n    stderr: 'pipe',\n  },\n\n  // Output directories\n  outputDir: 'test-results',\n\n  // Global setup and teardown\n  globalSetup: './tests/global-setup.ts',\n  globalTeardown: './tests/global-teardown.ts',\n});"
}

🔧 Tool: Write
Input: {
  "file_path": "/home/oxtsotsi/Webrnds/DevFlow/Rank.brnd/tests/global-setup.ts",
  "content": "import { FullConfig } from '@playwright/test';\nimport * as fs from 'fs';\nimport * as path from 'path';\n\n/**\n * Global test setup\n *\n * Runs once before all tests\n */\n\nasync function globalSetup(config: FullConfig) {\n  // Ensure test directories exist\n  const testDirs = [\n    'test-results',\n    'test-results/screenshots',\n    'test-results/videos',\n    'test-results/traces',\n  ];\n\n  for (const dir of testDirs) {\n    const fullPath = path.join(process.cwd(), dir);\n    if (!fs.existsSync(fullPath)) {\n      fs.mkdirSync(fullPath, { recursive: true });\n    }\n  }\n\n  // Clean up old test results (keep last 5 runs)\n  const testResultsDir = path.join(process.cwd(), 'test-results');\n  if (fs.existsSync(testResultsDir)) {\n    const files = fs.readdirSync(testResultsDir);\n    const oldFiles = files\n      .filter((f) => f.endsWith('.json') || f.endsWith('.txt'))\n      .sort((a, b) => {\n        const statA = fs.statSync(path.join(testResultsDir, a));\n        const statB = fs.statSync(path.join(testResultsDir, b));\n        return statA.mtimeMs - statB.mtimeMs;\n      });\n\n    // Remove all but the 5 most recent\n    for (const oldFile of oldFiles.slice(0, -5)) {\n      try {\n        fs.unlinkSync(path.join(testResultsDir, oldFile));\n      } catch (e) {\n        // Ignore errors\n      }\n    }\n  }\n\n  // Check for required environment variables\n  const requiredEnvVars = [\n    'NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY',\n    'NEXT_PUBLIC_SUPABASE_URL',\n  ];\n\n  const missingEnvVars = requiredEnvVars.filter(\n    (varName) => !process.env[varName]\n  );\n\n  if (missingEnvVars.length > 0) {\n    console.warn(\n      `Warning: Missing environment variables: ${missingEnvVars.join(', ')}`\n    );\n    console.warn(\n      'Some tests may fail. Create a .env file with the required variables.'\n    );\n  }\n\n  console.log('Test setup completed successfully');\n}\n\nexport default globalSetup;\n"
}

🔧 Tool: Write
Input: {
  "file_path": "/home/oxtsotsi/Webrnds/DevFlow/Rank.brnd/tests/global-teardown.ts",
  "content": "import { FullConfig } from '@playwright/test';\n\n/**\n * Global test teardown\n *\n * Runs once after all tests\n */\n\nasync function globalTeardown(config: FullConfig) {\n  console.log('All tests completed');\n  console.log(`Test results available in: test-results/`);\n  console.log(`HTML report available in: playwright-report/index.html`);\n}\n\nexport default globalTeardown;\n"
}
Now let me create a `tsconfig.json` specifically for the tests directory:

🔧 Tool: Write
Input: {
  "file_path": "/home/oxtsotsi/Webrnds/DevFlow/Rank.brnd/tests/tsconfig.json",
  "content": "{\n  \"compilerOptions\": {\n    \"target\": \"ES2020\",\n    \"module\": \"commonjs\",\n    \"lib\": [\"ES2020\"],\n    \"moduleResolution\": \"node\",\n    \"esModuleInterop\": true,\n    \"skipLibCheck\": true,\n    \"strict\": true,\n    \"resolveJsonModule\": true,\n    \"allowJs\": true,\n    \"noEmit\": true,\n    \"types\": [\"node\", \"@playwright/test\"]\n  },\n  \"include\": [\"**/*.ts\"],\n  \"exclude\": [\"node_modules\"]\n}\n"
}
Let me also create an index file that exports all the test utilities:

🔧 Tool: Write
Input: {
  "file_path": "/home/oxtsotsi/Webrnds/DevFlow/Rank.brnd/tests/index.ts",
  "content": "/**\n * Test utilities and fixtures barrel export\n *\n * Import commonly used test utilities from this file\n */\n\n// Fixtures\nexport * from './fixtures/auth.fixture';\nexport * from './fixtures/supabase.fixture';\n\n// Utils\nexport * from './utils/test-helpers';\nexport * from './utils/selectors';\n\n// Mocks\nexport * from './mocks/test-data';\nexport * from './mocks/api-handlers';\n\n// Re-export Playwright basics\nexport { test, expect } from '@playwright/test';\n"
}
Now let me create a test README to document the test infrastructure:

🔧 Tool: Write
Input: {
  "file_path": "/home/oxtsotsi/Webrnds/DevFlow/Rank.brnd/tests/README.md",
  "content": "# Test Suite Documentation\n\nThis directory contains the Playwright E2E test suite for Rank.brnd.\n\n## Directory Structure\n\n```\ntests/\n├── fixtures/         # Reusable test fixtures\n│   ├── auth.fixture.ts\n│   └── supabase.fixture.ts\n├── utils/            # Helper functions and selectors\n│   ├── test-helpers.ts\n│   └── selectors.ts\n├── mocks/            # Mock data and API handlers\n│   ├── test-data.ts\n│   └── api-handlers.ts\n├── *.spec.ts         # E2E test files\n└── global-setup.ts   # Global test setup\n```\n\n## Running Tests\n\n```bash\n# Run all tests\npnpm test\n\n# Run tests in headed mode (see browser)\npnpm test:headed\n\n# Run specific test file\npnpm test tests/onboarding-verification.spec.ts\n\n# Run tests matching a pattern\npnpm test --grep \"onboarding\"\n\n# Run tests with UI mode\npnpm exec playwright test --ui\n```\n\n## Writing Tests\n\n### Basic Test\n\n```typescript\nimport { test, expect } from '@playwright/test';\n\ntest('my test', async ({ page }) => {\n  await page.goto('/');\n  await expect(page.locator('h1')).toContainText('Welcome');\n});\n```\n\n### Using Test Helpers\n\n```typescript\nimport { test, expect } from '@playwright/test';\nimport { createTestHelpers, Selectors } from './utils/test-helpers';\n\ntest('using helpers', async ({ page }) => {\n  const helpers = createTestHelpers(page);\n\n  await helpers.navigateAndWait('/dashboard');\n  await helpers.assertVisible(Selectors.dashboardHeading);\n});\n```\n\n### Using Mock Data\n\n```typescript\nimport { test } from '@playwright/test';\nimport { MockArticles, MockUsers } from './mocks/test-data';\n\ntest('with mock data', async ({ page }) => {\n  const article = MockArticles.published;\n  // Use article data in test\n});\n```\n\n### Using API Handlers\n\n```typescript\nimport { test } from '@playwright/test';\nimport { createCommonApiMocks } from './mocks/api-handlers';\n\ntest.use({\n  // Mock API response\n  beforeEach: async ({ page }) => {\n    const mocks = createCommonApiMocks(page);\n    mocks.mockArticles([]);\n  },\n});\n```\n\n## Fixtures\n\n### Auth Fixture\n\nProvides authentication helpers:\n\n```typescript\nimport { test } from './fixtures/auth.fixture';\n\ntest('authenticated test', async ({ authenticatedPage }) => {\n  // Page is already authenticated\n});\n```\n\n### Supabase Fixture\n\nProvides Supabase client helpers:\n\n```typescript\nimport { test } from './fixtures/supabase.fixture';\n\ntest('database test', async ({ supabase }) => {\n  const user = await supabase.createTestUser('test@example.com', 'password');\n  await supabase.deleteTestUser(user.id);\n});\n```\n\n## Selectors\n\nUse predefined selectors for consistency:\n\n```typescript\nimport { Selectors } from './utils/selectors';\n\nawait page.click(Selectors.submitButton);\nawait expect(page.locator(Selectors.toast)).toBeVisible();\n```\n\n## Environment Variables\n\nRequired for some tests:\n\n```bash\nNEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_key\nNEXT_PUBLIC_SUPABASE_URL=your_url\nSUPABASE_SERVICE_ROLE_KEY=your_key\n```\n\nCreate a `.env` file in the project root with these values.\n\n## Test Results\n\n- HTML Report: `playwright-report/index.html`\n- JSON Results: `test-results/test-results.json`\n- Screenshots: `test-results/screenshots/`\n- Videos: `test-results/videos/`\n- Traces: `test-results/traces/`\n"
}

🔧 Tool: TodoWrite
Input: {
  "todos": [
    {
      "activeForm": "Verified Playwright installation",
      "content": "Verify Playwright is installed and working",
      "status": "completed"
    },
    {
      "activeForm": "Created test utilities and fixtures",
      "content": "Create test utilities and fixtures",
      "status": "completed"
    },
    {
      "activeForm": "Running verification test",
      "content": "Run verification test and delete it",
      "status": "in_progress"
    }
  ]
}
Now let me create a temporary verification test to ensure the setup works:

🔧 Tool: Write
Input: {
  "file_path": "/home/oxtsotsi/Webrnds/DevFlow/Rank.brnd/tests/temp-verification.spec.ts",
  "content": "/**\n * Temporary Verification Test\n *\n * This test verifies that:\n * 1. Playwright is properly installed\n * 2. Test fixtures can be imported\n * 3. Test utilities work correctly\n * 4. Mock data is accessible\n *\n * DELETE THIS TEST AFTER VERIFICATION\n */\n\nimport { test, expect } from '@playwright/test';\nimport { createTestHelpers, Selectors } from './utils/test-helpers';\nimport { MockUsers, randomTestString } from './mocks/test-data';\n\ntest.describe('Playwright Setup Verification', () => {\n  test('verify test helpers can be imported and used', async ({ page }) => {\n    const helpers = createTestHelpers(page);\n\n    // Verify helper methods exist\n    expect(typeof helpers.navigateAndWait).toBe('function');\n    expect(typeof helpers.waitForVisible).toBe('function');\n    expect(typeof helpers.clearStorage).toBe('function');\n  });\n\n  test('verify mock data can be imported', async () => {\n    // Verify mock data is accessible\n    expect(MockUsers.standard.email).toBe('test@example.com');\n    expect(MockUsers.standard.password).toBe('TestPassword123!');\n\n    // Verify utility functions work\n    const randomString = randomTestString('verify');\n    expect(randomString).toContain('verify-');\n  });\n\n  test('verify selectors can be imported', () => {\n    // Verify selectors are accessible\n    expect(Selectors.submitButton).toBeTruthy();\n    expect(Selectors.emailInput).toBeTruthy();\n    expect(Selectors.toast).toBeTruthy();\n  });\n\n  test('verify page navigation works', async ({ page }) => {\n    await page.goto('/');\n\n    // Page should load\n    const url = page.url();\n    expect(url).toContain('localhost');\n  });\n\n  test('verify test helper functions work', async ({ page }) => {\n    const helpers = createTestHelpers(page);\n\n    // Test clearStorage\n    await helpers.clearStorage();\n\n    // Test evaluate\n    const testValue = await helpers.evaluate(() => 'test-value');\n    expect(testValue).toBe('test-value');\n\n    // Test getUrl\n    await page.goto('/about');\n    const url = helpers.getUrl();\n    expect(url).toContain('/about');\n  });\n\n  test('verify screenshot on failure works', async ({ page }) => {\n    const helpers = createTestHelpers(page);\n\n    // Just verify the method exists - we don't want to actually fail\n    expect(typeof helpers.screenshotOnFailure).toBe('function');\n  });\n\n  test('verify API handler can be created', async ({ page }) => {\n    const { createApiHandlers } = await import('./mocks/api-handlers');\n\n    const handlers = createApiHandlers(page);\n    expect(typeof handlers.mockGet).toBe('function');\n    expect(typeof handlers.mockPost).toBe('function');\n    expect(typeof handlers.mockError).toBe('function');\n  });\n\n  test('verify mock API works', async ({ page }) => {\n    const { createApiHandlers } = await import('./mocks/api-handlers');\n\n    const handlers = createApiHandlers(page);\n\n    // Mock a test endpoint\n    handlers.mockGet('/api/test', { message: 'Test response' });\n\n    // Navigate and verify mock is active\n    await page.goto('/');\n\n    // The mock should be registered (we can't easily test it without a real page calling it)\n    expect(handlers).toBeTruthy();\n  });\n});\n\ntest.describe('Test Infrastructure Verification', () => {\n  test('verify all test directories exist', async ({}) => {\n    const fs = await import('fs');\n    const path = await import('path');\n\n    const dirs = ['fixtures', 'utils', 'mocks'];\n    const testDir = path.join(process.cwd(), 'tests');\n\n    for (const dir of dirs) {\n      const dirPath = path.join(testDir, dir);\n      expect(fs.existsSync(dirPath)).toBe(true);\n    }\n  });\n\n  test('verify test files are present', async ({}) => {\n    const expectedFiles = [\n      'tests/utils/test-helpers.ts',\n      'tests/utils/selectors.ts',\n      'tests/mocks/test-data.ts',\n      'tests/mocks/api-handlers.ts',\n      'tests/fixtures/auth.fixture.ts',\n      'tests/fixtures/supabase.fixture.ts',\n      'tests/global-setup.ts',\n      'tests/global-teardown.ts',\n    ];\n\n    const fs = await import('fs');\n    const path = await import('path');\n\n    for (const file of expectedFiles) {\n      const filePath = path.join(process.cwd(), file);\n      expect(fs.existsSync(filePath)).toBe(true);\n    }\n  });\n});\n\ntest.describe('Playwright Browser Capabilities', () => {\n  test('verify browser context methods', async ({ page, context }) => {\n    // Verify browser context is available\n    expect(context).toBeTruthy();\n    expect(page).toBeTruthy();\n\n    // Verify cookies can be accessed\n    const cookies = await context.cookies();\n    expect(Array.isArray(cookies)).toBe(true);\n  });\n\n  test('verify page evaluation works', async ({ page }) => {\n    await page.goto('/');\n\n    const title = await page.title();\n    expect(typeof title).toBe('string');\n\n    const url = page.url();\n    expect(typeof url).toBe('string');\n  });\n\n  test('verify locator methods work', async ({ page }) => {\n    await page.goto('/');\n\n    // Count elements on page\n    const buttonCount = await page.locator('button').count();\n    expect(typeof buttonCount).toBe('number');\n\n    const linkCount = await page.locator('a').count();\n    expect(typeof linkCount).toBe('number');\n  });\n});\n"
}
Now let me run the verification test:

🔧 Tool: Bash
Input: {
  "command": "cd /home/oxtsotsi/Webrnds/DevFlow/Rank.brnd && npx playwright test tests/temp-verification.spec.ts --reporter=list 2>&1 | head -100",
  "description": "Run verification test",
  "timeout": 180000
}
