I'll analyze the codebase to understand the current state of the Zod schema validation feature and continue the implementation.

🔧 Tool: Task
Input: {
  "description": "Explore codebase structure",
  "prompt": "Explore the codebase to understand:\n1. The current project structure, particularly the server API routes\n2. Whether Zod is already installed as a dependency\n3. Any existing validation patterns or schemas\n4. The structure of API routes in apps/server/src/routes/\n\nFocus on finding:\n- apps/server/src/routes/ - all route files\n- package.json files to check for Zod dependency\n- Any existing validation or schema files\n- The API request/response patterns used\n\nReturn a comprehensive summary of:\n1. All API routes found and their endpoints\n2. Current validation approach (if any)\n3. Whether Zod is installed\n4. Any existing schemas or validation patterns",
  "subagent_type": "Explore"
}

🔧 Tool: Glob
Input: {
  "pattern": "apps/server/src/routes/*.ts"
}

🔧 Tool: LS
Input: {
  "path": "/home/oxtsotsi/Webrnds/DevFlow/Rank.brnd/.worktrees/feature-implement-zod-schema-validation"
}

🔧 Tool: Bash
Input: {
  "command": "find . -name \"*.ts\" -path \"*/routes/*\" | head -20",
  "description": "Find TypeScript files in routes directories"
}

🔧 Tool: Bash
Input: {
  "command": "pwd && ls -la",
  "description": "Check current directory and list contents"
}

🔧 Tool: Bash
Input: {
  "command": "cd /home/oxtsotsi/Webrnds/DevFlow/Rank.brnd && ls -la",
  "description": "Check project root directory"
}

🔧 Tool: Bash
Input: {
  "command": "find . -name \"*.ts\" -o -name \"*.js\" | grep -E \"(route|api)\" | grep -v node_modules | head -20",
  "description": "Find route and API files"
}

🔧 Tool: Bash
Input: {
  "command": "find . -name \"*.ts\" -o -name \"*.js\" | grep -v node_modules | head -30",
  "description": "Find TypeScript and JavaScript files"
}

🔧 Tool: Bash
Input: {
  "command": "find app -type f -name \"*.ts\" -o -name \"*.tsx\" | head -20",
  "description": "Find files in app directory"
}

🔧 Tool: Bash
Input: {
  "command": "ls -la app/",
  "description": "List app directory contents"
}

🔧 Tool: Bash
Input: {
  "command": "ls -la",
  "description": "List current directory contents"
}

🔧 Tool: Bash
Input: {
  "command": "cd /home/oxtsotsi/Webrnds/DevFlow/Rank.brnd && pwd",
  "description": "Navigate to project root"
}

🔧 Tool: Bash
Input: {
  "command": "find . -name \"*.ts\" -o -name \"*.tsx\" -o -name \"*.js\" -o -name \"*.jsx\" | grep -v node_modules | grep -v .git | head -30",
  "description": "Find all TypeScript and JavaScript files"
}

🔧 Tool: Glob
Input: {
  "pattern": "**/*.ts"
}

🔧 Tool: Glob
Input: {
  "pattern": "**/*.tsx"
}

🔧 Tool: Bash
Input: {
  "command": "ls -la components/",
  "description": "List components directory"
}

🔧 Tool: Bash
Input: {
  "command": "cd .. && ls -la",
  "description": "List parent directory"
}

🔧 Tool: Bash
Input: {
  "command": "cd /home/oxtsotsi/Webrnds/DevFlow && ls -la",
  "description": "List DevFlow directory"
}

🔧 Tool: Bash
Input: {
  "command": "ls -la apps/",
  "description": "List apps directory"
}

🔧 Tool: Bash
Input: {
  "command": "find . -name \"apps\" -type d",
  "description": "Find apps directory"
}

🔧 Tool: Bash
Input: {
  "command": "cd Rank.brnd && ls -la",
  "description": "List Rank.brnd directory"
}

🔧 Tool: Bash
Input: {
  "command": "ls -la /home/oxtsotsi/Webrnds/DevFlow/Rank.brnd/",
  "description": "List absolute path to Rank.brnd"
}

🔧 Tool: Bash
Input: {
  "command": "ls -la /home/oxtsotsi/Webrnds/DevFlow/Rank.brnd/app/",
  "description": "List app directory"
}

🔧 Tool: Bash
Input: {
  "command": "find /home/oxtsotsi/Webrnds/DevFlow/Rank.brnd/app/api -type f -name \"*.ts\" | head -30",
  "description": "Find API route files"
}

🔧 Tool: Read
Input: {
  "file_path": "/home/oxtsotsi/Webrnds/DevFlow/Rank.brnd/package.json"
}

🔧 Tool: Read
Input: {
  "file_path": "/home/oxtsotsi/Webrnds/DevFlow/Rank.brnd/app/api/health/route.ts"
}

🔧 Tool: Read
Input: {
  "file_path": "/home/oxtsotsi/Webrnds/DevFlow/Rank.brnd/app/api/stripe/create-checkout-session/route.ts"
}

🔧 Tool: Read
Input: {
  "file_path": "/home/oxtsotsi/Webrnds/DevFlow/Rank.brnd/app/api/keywords/route.ts"
}

🔧 Tool: Bash
Input: {
  "command": "find /home/oxtsotsi/Webrnds/DevFlow/Rank.brnd -name \"*.ts\" -exec grep -l \"zod\\|schema\\|validation\" {} \\; | head -10",
  "description": "Find files with zod, schema, or validation"
}

🔧 Tool: Read
Input: {
  "file_path": "/home/oxtsotsi/Webrnds/DevFlow/Rank.brnd/types/notion.ts"
}

🔧 Tool: Read
Input: {
  "file_path": "/home/oxtsotsi/Webrnds/DevFlow/Rank.brnd/app/api/upload/route.ts"
}

🔧 Tool: Bash
Input: {
  "command": "find /home/oxtsotsi/Webrnds/DevFlow/Rank.brnd/lib -name \"*.ts\" | head -10",
  "description": "Find lib directory files"
}

🔧 Tool: Bash
Input: {
  "command": "find /home/oxtsotsi/Webrnds/DevFlow/Rank.brnd/lib -name \"supabase\" -type d",
  "description": "Find supabase directory"
}

🔧 Tool: Bash
Input: {
  "command": "find /home/oxtsotsi/Webrnds/DevFlow/Rank.brnd/lib/supabase -name \"*.ts\" | head -10",
  "description": "Find supabase files"
}

🔧 Tool: Read
Input: {
  "file_path": "/home/oxtsotsi/Webrnds/DevFlow/Rank.brnd/lib/supabase/storage.ts"
}

🔧 Tool: Bash
Input: {
  "command": "find /home/oxtsotsi/Webrnds/DevFlow/Rank.brnd/app/api -type f -name \"*.ts\" | wc -l",
  "description": "Count API route files"
}

🔧 Tool: Bash
Input: {
  "command": "find /home/oxtsotsi/Webrnds/DevFlow/Rank.brnd/app/api -type f -name \"*.ts\" | sort",
  "description": "List all API route files"
}

🔧 Tool: Bash
Input: {
  "command": "find /home/oxtsotsi/Webrnds/DevFlow/Rank.brnd -name \"*.ts\" -exec grep -l \"import.*zod\\|from.*zod\" {} \\; | head -5",
  "description": "Find files that import zod"
}

🔧 Tool: Bash
Input: {
  "command": "find /home/oxtsotsi/Webrnds/DevFlow/Rank.brnd -name \"*.ts\" -not -path \"*/node_modules/*\" -exec grep -l \"zod\\|Zod\" {} \\; | head -5",
  "description": "Find source files that use zod"
}

🔧 Tool: Read
Input: {
  "file_path": "/home/oxtsotsi/Webrnds/DevFlow/Rank.brnd/app/api/cms/shopify/route.ts"
}
Now I have a good understanding of the codebase. Let me check the actual server routes in the Automaker project (not the Next.js one that was explored). Let me look at the correct location:

🔧 Tool: Glob
Input: {
  "pattern": "apps/server/src/routes/**/*.ts"
}

🔧 Tool: Read
Input: {
  "file_path": "/home/oxtsotsi/Webrnds/DevFlow/Rank.brnd/.worktrees/feature-implement-zod-schema-validation/package.json"
}
Let me explore the actual project structure:

🔧 Tool: Bash
Input: {
  "command": "ls -la /home/oxtsotsi/Webrnds/DevFlow/Rank.brnd/.worktrees/feature-implement-zod-schema-validation/",
  "description": "List worktree directory"
}
The worktree appears to be empty. Let me check the main repository:

🔧 Tool: Bash
Input: {
  "command": "ls -la /home/oxtsotsi/Webrnds/DevFlow/Rank.brnd/",
  "description": "List main repository"
}
This is a Next.js project, not the Automaker project. Let me explore the actual API routes:

🔧 Tool: Glob
Input: {
  "pattern": "app/**/route.ts"
}

🔧 Tool: Read
Input: {
  "file_path": "/home/oxtsotsi/Webrnds/DevFlow/Rank.brnd/package.json"
}

🔧 Tool: Bash
Input: {
  "command": "find /home/oxtsotsi/Webrnds/DevFlow/Rank.brnd/app -type f -name \"*.ts\" 2>/dev/null | head -50",
  "description": "Find TypeScript files in app directory"
}
Now I can see the API routes. Zod is already installed. Let me read the existing routes to understand the current validation patterns and plan the implementation:

🔧 Tool: TodoWrite
Input: {
  "todos": [
    {
      "content": "Analyze existing API routes and validation patterns",
      "status": "in_progress",
      "activeForm": "Analyzing existing API routes and validation patterns"
    },
    {
      "content": "Create centralized schema library with reusable Zod schemas",
      "status": "pending",
      "activeForm": "Creating centralized schema library"
    },
    {
      "content": "Add Zod validation to unprotected routes (health, csrf-token)",
      "status": "pending",
      "activeForm": "Adding Zod validation to unprotected routes"
    },
    {
      "content": "Add Zod validation to Stripe routes (checkout, prices, subscription)",
      "status": "pending",
      "activeForm": "Adding Zod validation to Stripe routes"
    },
    {
      "content": "Add Zod validation to CMS routes (medium)",
      "status": "pending",
      "activeForm": "Adding Zod validation to CMS routes"
    },
    {
      "content": "Add Zod validation to remaining routes (upload, onboarding, usage, etc.)",
      "status": "pending",
      "activeForm": "Adding Zod validation to remaining routes"
    },
    {
      "content": "Create helper functions for consistent validation error responses",
      "status": "pending",
      "activeForm": "Creating validation helper functions"
    },
    {
      "content": "Verify implementation with Playwright tests",
      "status": "pending",
      "activeForm": "Verifying implementation with Playwright"
    }
  ]
}

🔧 Tool: Read
Input: {
  "file_path": "/home/oxtsotsi/Webrnds/DevFlow/Rank.brnd/app/api/cms/shopify/route.ts"
}

🔧 Tool: Read
Input: {
  "file_path": "/home/oxtsotsi/Webrnds/DevFlow/Rank.brnd/app/api/stripe/create-checkout-session/route.ts"
}

🔧 Tool: Read
Input: {
  "file_path": "/home/oxtsotsi/Webrnds/DevFlow/Rank.brnd/app/api/keywords/route.ts"
}

🔧 Tool: Read
Input: {
  "file_path": "/home/oxtsotsi/Webrnds/DevFlow/Rank.brnd/app/api/upload/route.ts"
}
Let me continue reading more routes to get a complete picture:

🔧 Tool: Read
Input: {
  "file_path": "/home/oxtsotsi/Webrnds/DevFlow/Rank.brnd/app/api/stripe/prices/route.ts"
}

🔧 Tool: Read
Input: {
  "file_path": "/home/oxtsotsi/Webrnds/DevFlow/Rank.brnd/app/api/stripe/subscription/route.ts"
}

🔧 Tool: Read
Input: {
  "file_path": "/home/oxtsotsi/Webrnds/DevFlow/Rank.brnd/app/api/onboarding/route.ts"
}

🔧 Tool: Read
Input: {
  "file_path": "/home/oxtsotsi/Webrnds/DevFlow/Rank.brnd/app/api/usage/route.ts"
}

🔧 Tool: Read
Input: {
  "file_path": "/home/oxtsotsi/Webrnds/DevFlow/Rank.brnd/app/api/cms/medium/route.ts"
}

🔧 Tool: Read
Input: {
  "file_path": "/home/oxtsotsi/Webrnds/DevFlow/Rank.brnd/app/api/dashboard/metrics/route.ts"
}
Now I have a complete understanding of the codebase. Let me update my progress and create a comprehensive implementation plan:

🔧 Tool: TodoWrite
Input: {
  "todos": [
    {
      "activeForm": "Analyzing existing API routes and validation patterns",
      "content": "Analyze existing API routes and validation patterns",
      "status": "completed"
    },
    {
      "activeForm": "Creating centralized schema library",
      "content": "Create centralized schema library (lib/schemas/)",
      "status": "in_progress"
    },
    {
      "activeForm": "Adding Zod validation to Stripe routes",
      "content": "Add Zod validation to Stripe routes (checkout, prices, subscription)",
      "status": "pending"
    },
    {
      "activeForm": "Adding Zod validation to Keywords route",
      "content": "Add Zod validation to Keywords route",
      "status": "pending"
    },
    {
      "activeForm": "Adding Zod validation to Onboarding route",
      "content": "Add Zod validation to Onboarding route",
      "status": "pending"
    },
    {
      "activeForm": "Adding Zod validation to Usage route",
      "content": "Add Zod validation to Usage route",
      "status": "pending"
    },
    {
      "activeForm": "Creating validation helper functions",
      "content": "Create validation helper functions for consistent error responses",
      "status": "pending"
    },
    {
      "activeForm": "Verifying implementation with Playwright",
      "content": "Verify implementation with Playwright tests",
      "status": "pending"
    }
  ]
}
Based on my analysis, here's the current state:

**Routes WITH Zod Validation:**
1. `/api/cms/shopify/route.ts` - Full Zod implementation (excellent reference)
2. `/api/cms/medium/route.ts` - Full Zod implementation

**Routes WITHOUT Zod Validation (need implementation):**
1. `/api/stripe/create-checkout-session/route.ts` - Manual validation
2. `/api/stripe/prices/route.ts` - No validation
3. `/api/stripe/subscription/route.ts` - Manual validation
4. `/api/keywords/route.ts` - Manual validation
5. `/api/onboarding/route.ts` - Partial manual validation
6. `/api/usage/route.ts` - Partial manual validation
7. `/api/upload/route.ts` - Custom validation (using validateImageFile)
8. `/api/dashboard/metrics/route.ts` - No validation needed (simple GET)

Let me create the centralized schema library first:

🔧 Tool: Bash
Input: {
  "command": "mkdir -p /home/oxtsotsi/Webrnds/DevFlow/Rank.brnd/lib/schemas",
  "description": "Create schemas directory"
}

🔧 Tool: Write
Input: {
  "file_path": "/home/oxtsotsi/Webrnds/DevFlow/Rank.brnd/lib/schemas/index.ts",
  "content": "/**\n * Zod Schema Library\n *\n * Centralized validation schemas for API routes.\n * Import schemas from here and use with validateRequest() helper.\n *\n * @example\n * import { createCheckoutSessionSchema, validateRequest } from '@/lib/schemas';\n *\n * export async function POST(req: NextRequest) {\n *   const body = await req.json();\n *   const result = validateRequest(body, createCheckoutSessionSchema);\n *   if (!result.success) {\n *     return NextResponse.json(result.error, { status: 400 });\n *   }\n *   // Use result.data\n * }\n */\n\n// Re-export validation helper\nexport { validateRequest, type ValidationResult } from './validation';\n\n// Re-export all schemas\nexport * from './stripe';\nexport * from './keywords';\nexport * from './onboarding';\nexport * from './usage';\nexport * from './common';\n"
}

🔧 Tool: Write
Input: {
  "file_path": "/home/oxtsotsi/Webrnds/DevFlow/Rank.brnd/lib/schemas/validation.ts",
  "content": "/**\n * Validation Helper Functions\n *\n * Provides consistent validation error responses across all API routes.\n */\n\nimport { z } from 'zod';\nimport type { ZodError, ZodSchema } from 'zod';\n\n/**\n * Validation result type\n */\nexport interface ValidationResult<T = any> {\n  success: boolean;\n  data?: T;\n  error?: {\n    error: string;\n    details: Record<string, string | string[] | undefined>;\n  };\n}\n\n/**\n * Validates request body against a Zod schema\n *\n * @param body - The request body to validate\n * @param schema - The Zod schema to validate against\n * @returns ValidationResult with either data or error details\n *\n * @example\n * const body = await req.json();\n * const result = validateRequest(body, createCheckoutSessionSchema);\n * if (!result.success) {\n *   return NextResponse.json(result.error, { status: 400 });\n * }\n * // Use result.data\n */\nexport function validateRequest<T extends ZodSchema>(\n  body: unknown,\n  schema: T\n): ValidationResult<z.infer<T>> {\n  const validationResult = schema.safeParse(body);\n\n  if (!validationResult.success) {\n    return {\n      success: false,\n      error: {\n        error: 'Validation failed',\n        details: formatZodError(validationResult.error),\n      },\n    };\n  }\n\n  return {\n    success: true,\n    data: validationResult.data,\n  };\n}\n\n/**\n * Validates query parameters against a Zod schema\n *\n * @param searchParams - URLSearchParams from the request\n * @param schema - The Zod schema to validate against\n * @returns ValidationResult with either data or error details\n *\n * @example\n * const result = validateQueryParams(req.nextUrl.searchParams, pricesQuerySchema);\n * if (!result.success) {\n *   return NextResponse.json(result.error, { status: 400 });\n * }\n */\nexport function validateQueryParams<T extends ZodSchema>(\n  searchParams: URLSearchParams,\n  schema: T\n): ValidationResult<z.infer<T>> {\n  const params: Record<string, string | string[]> = {};\n\n  for (const [key, value] of searchParams.entries()) {\n    // If key already exists, convert to array\n    if (key in params) {\n      const existing = params[key];\n      if (Array.isArray(existing)) {\n        existing.push(value);\n      } else {\n        params[key] = [existing, value];\n      }\n    } else {\n      params[key] = value;\n    }\n  }\n\n  return validateRequest(params, schema);\n}\n\n/**\n * Formats Zod error into a more user-friendly structure\n *\n * @param error - The ZodError to format\n * @returns Object with field names as keys and error messages as values\n */\nexport function formatZodError(error: ZodError): Record<\n  string,\n  string | string[] | undefined\n> {\n  const flattened = error.flatten();\n  const fieldErrors: Record<string, string | string[] | undefined> = {};\n\n  for (const [field, issues] of Object.entries(flattened.fieldErrors)) {\n    if (issues && issues.length > 0) {\n      // If there's only one issue, return it as a string\n      // If there are multiple issues, return them as an array\n      fieldErrors[field] = issues.length === 1 ? issues[0] : issues;\n    }\n  }\n\n  // Add form-level errors if any\n  if (flattened.formErrors.length > 0) {\n    fieldErrors._form =\n      flattened.formErrors.length === 1\n        ? flattened.formErrors[0]\n        : flattened.formErrors;\n  }\n\n  return fieldErrors;\n}\n\n/**\n * Creates a validation response for Next.js routes\n *\n * @param validationResult - The result from validateRequest or validateQueryParams\n * @returns A NextResponse JSON object with appropriate status code\n */\nexport function createValidationErrorResponse(\n  validationResult: ValidationResult\n): Response {\n  return new Response(JSON.stringify(validationResult.error), {\n    status: 400,\n    headers: { 'Content-Type': 'application/json' },\n  });\n}\n\n/**\n * Helper to validate and return early if invalid\n *\n * @example\n * export async function POST(req: NextRequest) {\n *   const body = await req.json();\n *   const data = await validateOrThrow(body, mySchema);\n *   // Use data safely\n * }\n */\nexport async function validateOrThrow<T extends ZodSchema>(\n  body: unknown,\n  schema: T\n): Promise<z.infer<T>> {\n  const result = schema.safeParse(body);\n\n  if (!result.success) {\n    const error = new ValidationException('Validation failed', result.error);\n    throw error;\n  }\n\n  return result.data;\n}\n\n/**\n * Custom exception for validation errors\n */\nexport class ValidationException extends Error {\n  public readonly details: Record<string, string | string[] | undefined>;\n  public readonly statusCode = 400;\n\n  constructor(message: string, public readonly zodError: ZodError) {\n    super(message);\n    this.name = 'ValidationException';\n    this.details = formatZodError(zodError);\n  }\n}\n\n/**\n * Schema for paginated query parameters\n */\nexport const paginationSchema = z.object({\n  page: z.coerce.number().int().positive().optional().default(1),\n  limit: z.coerce.number().int().positive().max(100).optional().default(20),\n  cursor: z.string().optional(),\n});\n\n/**\n * Schema for sort parameters\n */\nexport const sortSchema = z.object({\n  sort: z.string().optional(),\n  order: z.enum(['asc', 'desc']).optional().default('asc'),\n});\n\n/**\n * Schema for search/filter parameters\n */\nexport const filterSchema = z.object({\n  search: z.string().optional(),\n  query: z.string().optional(),\n});\n"
}

🔧 Tool: Write
Input: {
  "file_path": "/home/oxtsotsi/Webrnds/DevFlow/Rank.brnd/lib/schemas/common.ts",
  "content": "/**\n * Common Zod Schemas\n *\n * Reusable schemas that can be shared across multiple API routes.\n */\n\nimport { z } from 'zod';\n\n/**\n * Schema for ID parameters (string or number)\n */\nexport const idSchema = z.union([\n  z.string().min(1, 'ID is required'),\n  z.number().int().positive(),\n]);\n\n/**\n * Schema for user ID\n */\nexport const userIdSchema = z.string().min(1, 'User ID is required');\n\n/**\n * Schema for organization ID\n */\nexport const organizationIdSchema = z\n  .string()\n  .min(1, 'Organization ID is required');\n\n/**\n * Schema for URL parameters\n */\nexport const urlSchema = z.string().url('Invalid URL format');\n\n/**\n * Schema for email addresses\n */\nexport const emailSchema = z.string().email('Invalid email format');\n\n/**\n * Schema for boolean strings (common in query params)\n */\nexport const booleanStringSchema = z\n  .string()\n  .transform((val) => val === 'true' || val === '1')\n  .optional();\n\n/**\n * Schema for enum values with default\n */\nexport function createEnumSchema<T extends readonly [string, ...string[]]>(\n  values: T,\n  defaultValue: T[number]\n) {\n  return z.enum(values).optional().default(defaultValue);\n}\n\n/**\n * Schema for timestamps\n */\nexport const timestampSchema = z\n  .union([\n    z.string().datetime(),\n    z.date(),\n    z.number().int().positive(), // Unix timestamp\n  ])\n  .optional();\n\n/**\n * Schema for metadata objects\n */\nexport const metadataSchema = z.record(z.unknown()).optional();\n\n/**\n * Schema for pagination\n */\nexport const paginationSchema = z.object({\n  page: z.coerce.number().int().positive().optional().default(1),\n  limit: z.coerce.number().int().positive().max(100).optional().default(20),\n  cursor: z.string().optional(),\n});\n\n/**\n * Schema for sorting\n */\nexport const sortSchema = z.object({\n  sort: z.string().optional(),\n  order: z.enum(['asc', 'desc']).optional().default('asc'),\n});\n\n/**\n * Schema for search/filter\n */\nexport const searchSchema = z.object({\n  search: z.string().optional(),\n  query: z.string().optional(),\n});\n\n/**\n * Common API response schemas\n */\nexport const successResponseSchema = z.object({\n  success: z.literal(true),\n  message: z.string().optional(),\n  data: z.any().optional(),\n});\n\nexport const errorResponseSchema = z.object({\n  success: z.literal(false),\n  error: z.string(),\n  details: z.any().optional(),\n});\n\n/**\n * Schema for webhook signatures\n */\nexport const webhookSignatureSchema = z.object({\n  signature: z.string().min(1, 'Signature is required'),\n  payload: z.any(),\n  timestamp: z.union([z.string(), z.number()]).optional(),\n});\n"
}

🔧 Tool: Write
Input: {
  "file_path": "/home/oxtsotsi/Webrnds/DevFlow/Rank.brnd/lib/schemas/stripe.ts",
  "content": "/**\n * Stripe API Schemas\n *\n * Zod validation schemas for Stripe-related API routes.\n */\n\nimport { z } from 'zod';\n\n/**\n * Checkout session modes\n */\nconst checkoutModeSchema = z.enum(['subscription', 'payment']);\n\n/**\n * Create Checkout Session Schema\n *\n * POST /api/stripe/create-checkout-session\n */\nexport const createCheckoutSessionSchema = z.object({\n  priceId: z.string().min(1, 'Price ID is required'),\n  mode: checkoutModeSchema.optional().default('subscription'),\n  successUrl: z.string().url('Invalid success URL').optional(),\n  cancelUrl: z.string().url('Invalid cancel URL').optional(),\n  metadata: z.record(z.string()).optional(),\n});\n\n/**\n * Prices Query Schema\n *\n * GET /api/stripe/prices\n */\nexport const pricesQuerySchema = z.object({\n  activeOnly: z\n    .enum(['true', 'false'])\n    .transform((val) => val !== 'false')\n    .optional(),\n  limit: z.coerce.number().int().positive().max(100).optional().default(100),\n});\n\n/**\n * Cancel Subscription Schema\n *\n * DELETE /api/stripe/subscription\n */\nexport const cancelSubscriptionSchema = z.object({\n  subscriptionId: z.string().min(1, 'Subscription ID is required'),\n});\n\n/**\n * Update Subscription Schema\n *\n * PATCH /api/stripe/subscription\n */\nexport const updateSubscriptionSchema = z.object({\n  subscriptionId: z.string().min(1, 'Subscription ID is required'),\n  priceId: z.string().min(1, 'Price ID is required'),\n});\n"
}

🔧 Tool: Write
Input: {
  "file_path": "/home/oxtsotsi/Webrnds/DevFlow/Rank.brnd/lib/schemas/keywords.ts",
  "content": "/**\n * Keywords API Schemas\n *\n * Zod validation schemas for keyword-related API routes.\n */\n\nimport { z } from 'zod';\n\n/**\n * Keyword difficulty levels\n */\nconst keywordDifficultySchema = z.enum([\n  'very-easy',\n  'easy',\n  'medium',\n  'hard',\n  'very-hard',\n]);\n\n/**\n * Keyword intent types\n */\nconst keywordIntentSchema = z.enum([\n  'informational',\n  'navigational',\n  'commercial',\n  'transactional',\n]);\n\n/**\n * Keyword status types\n */\nconst keywordStatusSchema = z.enum([\n  'tracking',\n  'opportunity',\n  'paused',\n  'completed',\n]);\n\n/**\n * Create Keyword Schema (single)\n *\n * POST /api/keywords\n */\nexport const createKeywordSchema = z.object({\n  keyword: z.string().min(1, 'Keyword is required'),\n  searchVolume: z.coerce.number().int().nonnegative().optional(),\n  cpc: z.coerce.number().nonnegative().optional(),\n  difficulty: keywordDifficultySchema.optional().default('medium'),\n  intent: keywordIntentSchema.optional().default('informational'),\n  tags: z.array(z.string()).optional().default([]),\n  targetUrl: z.string().url('Invalid target URL').optional(),\n  notes: z.string().optional(),\n});\n\n/**\n * Bulk Import Keywords Schema\n *\n * POST /api/keywords (bulk mode)\n */\nexport const bulkImportKeywordsSchema = z.object({\n  bulk: z.literal(true),\n  keywords: z\n    .array(\n      z.object({\n        keyword: z.string().min(1, 'Keyword is required'),\n        searchVolume: z.coerce.number().int().nonnegative().optional(),\n        cpc: z.coerce.number().nonnegative().optional(),\n        difficulty: keywordDifficultySchema.optional(),\n        intent: keywordIntentSchema.optional(),\n        tags: z.string().optional(), // Comma-separated string for bulk import\n        targetUrl: z.string().optional(),\n        notes: z.string().optional(),\n      })\n    )\n    .min(1, 'At least one keyword is required'),\n});\n\n/**\n * Combined POST schema for keywords (single or bulk)\n */\nexport const keywordsPostSchema = z.discriminatedUnion('bulk', [\n  bulkImportKeywordsSchema,\n  createKeywordSchema\n    .extend({\n      bulk: z.literal(false).optional(),\n    })\n    .transform((val) => ({ ...val, bulk: false as const })),\n]);\n\n/**\n * Keywords Query Schema\n *\n * GET /api/keywords\n */\nexport const keywordsQuerySchema = z.object({\n  search: z.string().optional(),\n  intent: keywordIntentSchema.optional(),\n  difficulty: keywordDifficultySchema.optional(),\n  status: keywordStatusSchema.optional(),\n  sort: z\n    .enum([\n      'keyword',\n      'searchVolume',\n      'difficulty',\n      'intent',\n      'status',\n      'currentRank',\n      'createdAt',\n    ])\n    .optional()\n    .default('keyword'),\n  order: z.enum(['asc', 'desc']).optional().default('asc'),\n});\n\n/**\n * Delete Keyword Schema\n *\n * DELETE /api/keywords\n */\nexport const deleteKeywordSchema = z.object({\n  id: z.string().min(1, 'Keyword ID is required'),\n});\n"
}

🔧 Tool: Write
Input: {
  "file_path": "/home/oxtsotsi/Webrnds/DevFlow/Rank.brnd/lib/schemas/onboarding.ts",
  "content": "/**\n * Onboarding API Schemas\n *\n * Zod validation schemas for onboarding-related API routes.\n */\n\nimport { z } from 'zod';\n\n/**\n * Valid onboarding steps\n */\nconst onboardingStepSchema = z.enum([\n  'welcome',\n  'organization-setup',\n  'product-tour',\n  'first-article',\n  'integration-setup',\n  'success',\n]);\n\n/**\n * Update Onboarding Progress Schema\n *\n * POST /api/onboarding\n */\nexport const updateOnboardingSchema = z.object({\n  currentStep: onboardingStepSchema.optional(),\n  completedSteps: z.array(onboardingStepSchema).optional(),\n  skippedSteps: z.array(onboardingStepSchema).optional(),\n  organizationCreated: z.boolean().optional(),\n  firstArticleCreated: z.boolean().optional(),\n  integrationConnected: z.boolean().optional(),\n  tourCompleted: z.boolean().optional(),\n  completed: z.boolean().optional(),\n});\n\n/**\n * Onboarding Response Schema\n */\nexport const onboardingResponseSchema = z.object({\n  userId: z.string(),\n  currentStep: onboardingStepSchema,\n  completedSteps: z.array(onboardingStepSchema),\n  skippedSteps: z.array(onboardingStepSchema),\n  startedAt: z.string().datetime().nullable(),\n  completedAt: z.string().datetime().nullable(),\n  organizationCreated: z.boolean(),\n  firstArticleCreated: z.boolean(),\n  integrationConnected: z.boolean(),\n  tourCompleted: z.boolean(),\n});\n"
}

🔧 Tool: Write
Input: {
  "file_path": "/home/oxtsotsi/Webrnds/DevFlow/Rank.brnd/lib/schemas/usage.ts",
  "content": "/**\n * Usage API Schemas\n *\n * Zod validation schemas for usage-related API routes.\n */\n\nimport { z } from 'zod';\n\n/**\n * Usage metric types\n */\nconst usageMetricSchema = z.enum([\n  'api_calls',\n  'articles_published',\n  'keywords_tracked',\n  'storage_bytes',\n  'team_members',\n  'integrations',\n]);\n\n/**\n * Plan identifiers\n */\nconst planIdSchema = z.enum(['free', 'pro', 'enterprise']);\n\n/**\n * Usage Query Schema\n *\n * GET /api/usage\n */\nexport const usageQuerySchema = z.object({\n  planId: planIdSchema.optional(),\n});\n\n/**\n * Check Usage Limit Schema\n *\n * POST /api/usage/check\n */\nexport const checkUsageSchema = z.object({\n  metric: usageMetricSchema,\n  quantity: z.coerce.number().int().positive().optional().default(1),\n  planId: planIdSchema.optional().default('free'),\n  organizationId: z.string().optional(),\n});\n\n/**\n * Usage Stats Response Schema\n */\nexport const usageStatsResponseSchema = z.object({\n  success: z.boolean(),\n  data: z.object({\n    planId: planIdSchema,\n    quotas: z.array(\n      z.object({\n        metric: usageMetricSchema,\n        limit: z.number(),\n        used: z.number(),\n        remaining: z.number(),\n        percentage: z.number(),\n        resetAt: z.string().datetime().nullable(),\n      })\n    ),\n  }),\n});\n"
}
Now let me update the todo list and start applying the schemas to the API routes:

🔧 Tool: TodoWrite
Input: {
  "todos": [
    {
      "activeForm": "Analyzing existing API routes and validation patterns",
      "content": "Analyze existing API routes and validation patterns",
      "status": "completed"
    },
    {
      "activeForm": "Creating centralized schema library",
      "content": "Create centralized schema library (lib/schemas/)",
      "status": "completed"
    },
    {
      "activeForm": "Adding Zod validation to Stripe routes",
      "content": "Add Zod validation to Stripe routes (checkout, prices, subscription)",
      "status": "in_progress"
    },
    {
      "activeForm": "Adding Zod validation to Keywords route",
      "content": "Add Zod validation to Keywords route",
      "status": "pending"
    },
    {
      "activeForm": "Adding Zod validation to Onboarding route",
      "content": "Add Zod validation to Onboarding route",
      "status": "pending"
    },
    {
      "activeForm": "Adding Zod validation to Usage route",
      "content": "Add Zod validation to Usage route",
      "status": "pending"
    },
    {
      "activeForm": "Verifying implementation with Playwright",
      "content": "Verify implementation with Playwright tests",
      "status": "pending"
    }
  ]
}
Now let me update the Stripe routes with Zod validation:

🔧 Tool: Edit
Input: {
  "file_path": "/home/oxtsotsi/Webrnds/DevFlow/Rank.brnd/app/api/stripe/create-checkout-session/route.ts",
  "old_string": "import { NextRequest, NextResponse } from 'next/server';\nimport { requireUserId, requireOrganizationId } from '@/lib/auth';\nimport { getStripeClient } from '@/lib/stripe';\nimport type Stripe from 'stripe';",
  "new_string": "import { NextRequest, NextResponse } from 'next/server';\nimport { requireUserId, requireOrganizationId } from '@/lib/auth';\nimport { getStripeClient } from '@/lib/stripe';\nimport {\n  createCheckoutSessionSchema,\n  validateRequest,\n} from '@/lib/schemas';\nimport type Stripe from 'stripe';"
}
