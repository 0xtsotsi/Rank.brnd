🔧 Tool: TodoWrite
Input: {
"todos": [
{
"content": "Explore codebase to understand existing API structure",
"status": "in_progress",
"activeForm": "Exploring codebase to understand existing API structure"
},
{
"content": "Plan error handling middleware implementation",
"status": "pending",
"activeForm": "Planning error handling middleware implementation"
},
{
"content": "Implement error handling middleware",
"status": "pending",
"activeForm": "Implementing error handling middleware"
},
{
"content": "Verify implementation with Playwright test",
"status": "pending",
"activeForm": "Verifying implementation with Playwright test"
},
{
"content": "Clean up verification test",
"status": "pending",
"activeForm": "Cleaning up verification test"
}
]
}

Let me explore the codebase to understand the existing structure and API patterns.

🔧 Tool: Glob
Input: {
"pattern": "\*_/_.{ts,tsx,js,jsx}"
}

🔧 Tool: Read
Input: {
"file_path": "/home/oxtsotsi/Webrnds/DevFlow/Rank.brnd/.worktrees/feature-implement-consistent-api-error-handling/package.json"
}

🔧 Tool: Bash
Input: {
"command": "ls -la /home/oxtsotsi/Webrnds/DevFlow/Rank.brnd/.worktrees/feature-implement-consistent-api-error-handling/",
"description": "List worktree directory contents"
}

Let me check the main project directory:

🔧 Tool: Bash
Input: {
"command": "ls -la /home/oxtsotsi/Webrnds/DevFlow/Rank.brnd/",
"description": "List main project directory"
}

🔧 Tool: Bash
Input: {
"command": "pwd",
"description": "Check current working directory"
}

I see the worktree directory is essentially empty (just initialized). Let me check if there's any content on this branch from the main repository:

🔧 Tool: Bash
Input: {
"command": "git status && git log --oneline -5",
"description": "Check git status and recent commits"
}

🔧 Tool: Bash
Input: {
"command": "git show --stat HEAD",
"description": "Show initial commit contents"
}

The repository only has an initial commit with no files. This is a new project that needs to be set up. Let me check if there's any reference project structure or documentation I should follow:

🔧 Tool: Read
Input: {
"file_path": "/home/oxtsotsi/Webrnds/DevFlow/Rank.brnd/.automaker/context/Reverse_engineering_guide.md"
}

Based on the documentation, this project is a clone of Outrank.so using Next.js 14+. Since this is a fresh project, I need to set up the basic structure. Let me check if there are more context files:

🔧 Tool: Bash
Input: {
"command": "ls -la /home/oxtsotsi/Webrnds/DevFlow/Rank.brnd/.automaker/context/",
"description": "List all context files"
}

Since this is a fresh repository, I need to set up a basic Next.js project structure with API routes. According to the documentation, this project uses:

- Next.js 14+ (with App Router)
- TypeScript
- Zod for runtime validation

Let me update my todo list and create the necessary files:

🔧 Tool: TodoWrite
Input: {
"todos": [
{
"content": "Set up basic Next.js project structure",
"status": "in_progress",
"activeForm": "Setting up basic Next.js project structure"
},
{
"content": "Create error handling middleware for API routes",
"status": "pending",
"activeForm": "Creating error handling middleware for API routes"
},
{
"content": "Create sample API route to demonstrate error handling",
"status": "pending",
"activeForm": "Creating sample API route to demonstrate error handling"
},
{
"content": "Verify implementation with Playwright test",
"status": "pending",
"activeForm": "Verifying implementation with Playwright test"
},
{
"content": "Clean up verification test",
"status": "pending",
"activeForm": "Cleaning up verification test"
}
]
}

🔧 Tool: Write
Input: {
"file_path": "/home/oxtsotsi/Webrnds/DevFlow/Rank.brnd/.worktrees/feature-implement-consistent-api-error-handling/package.json",
"content": "{\n \"name\": \"rank-brnd\",\n \"version\": \"0.1.0\",\n \"private\": true,\n \"scripts\": {\n \"dev\": \"next dev\",\n \"build\": \"next build\",\n \"start\": \"next start\",\n \"lint\": \"next lint\",\n \"test:e2e\": \"playwright test\"\n },\n \"dependencies\": {\n \"next\": \"14.2.15\",\n \"react\": \"^18.3.1\",\n \"react-dom\": \"^18.3.1\",\n \"zod\": \"^3.23.8\"\n },\n \"devDependencies\": {\n \"@playwright/test\": \"^1.48.0\",\n \"@types/node\": \"^20.17.0\",\n \"@types/react\": \"^18.3.11\",\n \"@types/react-dom\": \"^18.3.1\",\n \"typescript\": \"^5.6.3\"\n }\n}\n"
}

🔧 Tool: Write
Input: {
"file*path": "/home/oxtsotsi/Webrnds/DevFlow/Rank.brnd/.worktrees/feature-implement-consistent-api-error-handling/tsconfig.json",
"content": "{\n \"compilerOptions\": {\n \"lib\": [\"dom\", \"dom.iterable\", \"esnext\"],\n \"allowJs\": true,\n \"skipLibCheck\": true,\n \"strict\": true,\n \"noEmit\": true,\n \"esModuleInterop\": true,\n \"module\": \"esnext\",\n \"moduleResolution\": \"bundler\",\n \"resolveJsonModule\": true,\n \"isolatedModules\": true,\n \"jsx\": \"preserve\",\n \"incremental\": true,\n \"plugins\": [\n {\n \"name\": \"next\"\n }\n ],\n \"paths\": {\n \"@/*\": [\"./src/_\"]\n }\n },\n \"include\": [\"next-env.d.ts\", \"**/*.ts\", \"**/*.tsx\", \".next/types/**/*.ts\"],\n \"exclude\": [\"node_modules\"]\n}\n"
}

🔧 Tool: Write
Input: {
"file\*path": "/home/oxtsotsi/Webrnds/DevFlow/Rank.brnd/.worktrees/feature-implement-consistent-api-error-handling/next.config.js",
"content": "/\*\* @type {import('next').NextConfig} \_/\nconst nextConfig = {\n reactStrictMode: true,\n};\n\nmodule.exports = nextConfig;\n"
}

🔧 Tool: Write
Input: {
"file_path": "/home/oxtsotsi/Webrnds/DevFlow/Rank.brnd/.worktrees/feature-implement-consistent-api-error-handling/next-env.d.ts",
"content": "/// <reference types=\"next\" />\n/// <reference types=\"next/image-types/global\" />\n\n// NOTE: This file should not be edited\n// see https://nextjs.org/docs/basic-features/typescript for more information.\n"
}

Now let me create the source directory structure and the error handling middleware:

🔧 Tool: Bash
Input: {
"command": "mkdir -p /home/oxtsotsi/Webrnds/DevFlow/Rank.brnd/.worktrees/feature-implement-consistent-api-error-handling/src/lib && mkdir -p /home/oxtsotsi/Webrnds/DevFlow/Rank.brnd/.worktrees/feature-implement-consistent-api-error-handling/src/app/api/health && mkdir -p /home/oxtsotsi/Webrnds/DevFlow/Rank.brnd/.worktrees/feature-implement-consistent-api-error-handling/src/app/api/test",
"description": "Create directory structure"
}

🔧 Tool: TodoWrite
Input: {
"todos": [
{
"content": "Set up basic Next.js project structure",
"status": "completed",
"activeForm": "Setting up basic Next.js project structure"
},
{
"content": "Create error handling middleware for API routes",
"status": "in_progress",
"activeForm": "Creating error handling middleware for API routes"
},
{
"content": "Create sample API route to demonstrate error handling",
"status": "pending",
"activeForm": "Creating sample API route to demonstrate error handling"
},
{
"content": "Verify implementation with Playwright test",
"status": "pending",
"activeForm": "Verifying implementation with Playwright test"
},
{
"content": "Clean up verification test",
"status": "pending",
"activeForm": "Cleaning up verification test"
}
]
}

Now let me create the error handling middleware and related utilities:

🔧 Tool: Write
Input: {
"file*path": "/home/oxtsotsi/Webrnds/DevFlow/Rank.brnd/.worktrees/feature-implement-consistent-api-error-handling/src/lib/api-errors.ts",
"content": "/\*\*\n * API Error Classes and Utilities\n _\n _ This module provides a consistent error handling system for API routes.\n _ All errors are formatted as: { error: { code, message } }\n \*/\n\n/\*\*\n _ Standard error codes used across the API\n _/\nexport const ErrorCodes = {\n // 400 - Bad Request\n BAD_REQUEST: 'BAD_REQUEST',\n VALIDATION_ERROR: 'VALIDATION_ERROR',\n INVALID_INPUT: 'INVALID_INPUT',\n\n // 401 - Unauthorized\n UNAUTHORIZED: 'UNAUTHORIZED',\n INVALID_TOKEN: 'INVALID_TOKEN',\n TOKEN_EXPIRED: 'TOKEN_EXPIRED',\n\n // 403 - Forbidden\n FORBIDDEN: 'FORBIDDEN',\n INSUFFICIENT_PERMISSIONS: 'INSUFFICIENT_PERMISSIONS',\n\n // 404 - Not Found\n NOT_FOUND: 'NOT_FOUND',\n RESOURCE_NOT_FOUND: 'RESOURCE_NOT_FOUND',\n\n // 405 - Method Not Allowed\n METHOD_NOT_ALLOWED: 'METHOD_NOT_ALLOWED',\n\n // 409 - Conflict\n CONFLICT: 'CONFLICT',\n RESOURCE_EXISTS: 'RESOURCE_EXISTS',\n\n // 422 - Unprocessable Entity\n UNPROCESSABLE_ENTITY: 'UNPROCESSABLE_ENTITY',\n\n // 429 - Too Many Requests\n RATE_LIMIT_EXCEEDED: 'RATE_LIMIT_EXCEEDED',\n\n // 500 - Internal Server Error\n INTERNAL_ERROR: 'INTERNAL_ERROR',\n DATABASE_ERROR: 'DATABASE_ERROR',\n\n // 502 - Bad Gateway\n BAD_GATEWAY: 'BAD_GATEWAY',\n\n // 503 - Service Unavailable\n SERVICE_UNAVAILABLE: 'SERVICE_UNAVAILABLE',\n} as const;\n\nexport type ErrorCode = typeof ErrorCodes[keyof typeof ErrorCodes];\n\n/\*\*\n _ Standard API error response format\n _/\nexport interface ApiErrorResponse {\n error: {\n code: ErrorCode;\n message: string;\n details?: Record<string, unknown>;\n };\n}\n\n/\*\*\n _ Custom API Error class that provides consistent error formatting\n _/\nexport class ApiError extends Error {\n public readonly code: ErrorCode;\n public readonly statusCode: number;\n public readonly details?: Record<string, unknown>;\n\n constructor(\n code: ErrorCode,\n message: string,\n statusCode: number,\n details?: Record<string, unknown>\n ) {\n super(message);\n this.name = 'ApiError';\n this.code = code;\n this.statusCode = statusCode;\n this.details = details;\n\n // Maintains proper stack trace for where our error was thrown\n if (Error.captureStackTrace) {\n Error.captureStackTrace(this, ApiError);\n }\n }\n\n /\*_\n \_ Convert error to JSON response format\n \*/\n toJSON(): ApiErrorResponse {\n const response: ApiErrorResponse = {\n error: {\n code: this.code,\n message: this.message,\n },\n };\n\n if (this.details) {\n response.error.details = this.details;\n }\n\n return response;\n }\n\n // Factory methods for common errors\n\n static badRequest(message: string = 'Bad request', details?: Record<string, unknown>): ApiError {\n return new ApiError(ErrorCodes.BAD_REQUEST, message, 400, details);\n }\n\n static validationError(message: string = 'Validation failed', details?: Record<string, unknown>): ApiError {\n return new ApiError(ErrorCodes.VALIDATION_ERROR, message, 400, details);\n }\n\n static unauthorized(message: string = 'Unauthorized'): ApiError {\n return new ApiError(ErrorCodes.UNAUTHORIZED, message, 401);\n }\n\n static invalidToken(message: string = 'Invalid or expired token'): ApiError {\n return new ApiError(ErrorCodes.INVALID_TOKEN, message, 401);\n }\n\n static forbidden(message: string = 'Access forbidden'): ApiError {\n return new ApiError(ErrorCodes.FORBIDDEN, message, 403);\n }\n\n static insufficientPermissions(message: string = 'Insufficient permissions'): ApiError {\n return new ApiError(ErrorCodes.INSUFFICIENT_PERMISSIONS, message, 403);\n }\n\n static notFound(resource: string = 'Resource'): ApiError {\n return new ApiError(ErrorCodes.NOT_FOUND, `${resource} not found`, 404);\n }\n\n static methodNotAllowed(method: string, allowedMethods: string[]): ApiError {\n return new ApiError(\n ErrorCodes.METHOD_NOT_ALLOWED,\n `Method ${method} not allowed. Allowed methods: ${allowedMethods.join(', ')}`,\n 405,\n { allowedMethods }\n );\n }\n\n static conflict(message: string = 'Resource conflict'): ApiError {\n return new ApiError(ErrorCodes.CONFLICT, message, 409);\n }\n\n static resourceExists(resource: string = 'Resource'): ApiError {\n return new ApiError(ErrorCodes.RESOURCE_EXISTS, `${resource} already exists`, 409);\n }\n\n static unprocessableEntity(message: string, details?: Record<string, unknown>): ApiError {\n return new ApiError(ErrorCodes.UNPROCESSABLE_ENTITY, message, 422, details);\n }\n\n static rateLimitExceeded(message: string = 'Rate limit exceeded'): ApiError {\n return new ApiError(ErrorCodes.RATE_LIMIT_EXCEEDED, message, 429);\n }\n\n static internal(message: string = 'Internal server error'): ApiError {\n return new ApiError(ErrorCodes.INTERNAL_ERROR, message, 500);\n }\n\n static databaseError(message: string = 'Database error'): ApiError {\n return new ApiError(ErrorCodes.DATABASE_ERROR, message, 500);\n }\n\n static serviceUnavailable(message: string = 'Service temporarily unavailable'): ApiError {\n return new ApiError(ErrorCodes.SERVICE_UNAVAILABLE, message, 503);\n }\n}\n"
}

🔧 Tool: Write
Input: {
"file*path": "/home/oxtsotsi/Webrnds/DevFlow/Rank.brnd/.worktrees/feature-implement-consistent-api-error-handling/src/lib/api-handler.ts",
"content": "/\*\*\n * API Route Handler Middleware\n _\n _ This module provides a wrapper for API route handlers that ensures\n _ consistent error handling and response formatting across all API routes.\n \*/\n\nimport { NextRequest, NextResponse } from 'next/server';\nimport { ZodError, ZodSchema } from 'zod';\nimport { ApiError, ApiErrorResponse, ErrorCodes } from './api-errors';\n\n/\*\*\n _ Context object passed to API handlers\n _/\nexport interface ApiContext {\n params: Record<string, string>;\n}\n\n/\*\*\n _ Type for API route handler functions\n _/\nexport type ApiHandler<T = unknown> = (\n request: NextRequest,\n context: ApiContext\n) => Promise<T> | T;\n\n/\*\*\n _ Options for the API handler wrapper\n _/\nexport interface ApiHandlerOptions {\n /** Allowed HTTP methods for this route \*/\n allowedMethods?: string[];\n}\n\n/**\n _ Creates a consistent error response\n _/\nfunction createErrorResponse(error: ApiError): NextResponse<ApiErrorResponse> {\n return NextResponse.json(error.toJSON(), { status: error.statusCode });\n}\n\n/\*\*\n _ Handles Zod validation errors and converts them to ApiError format\n _/\nfunction handleZodError(error: ZodError): ApiError {\n const fieldErrors: Record<string, string[]> = {};\n\n for (const issue of error.issues) {\n const path = issue.path.join('.');\n if (!fieldErrors[path]) {\n fieldErrors[path] = [];\n }\n fieldErrors[path].push(issue.message);\n }\n\n return ApiError.validationError('Validation failed', { fields: fieldErrors });\n}\n\n/\*\*\n _ Converts unknown errors to ApiError instances\n _/\nfunction normalizeError(error: unknown): ApiError {\n // Already an ApiError\n if (error instanceof ApiError) {\n return error;\n }\n\n // Zod validation error\n if (error instanceof ZodError) {\n return handleZodError(error);\n }\n\n // Standard Error\n if (error instanceof Error) {\n // Check for specific error types\n if (error.message.includes('not found') || error.message.includes('NOT_FOUND')) {\n return ApiError.notFound(error.message);\n }\n\n // Log unexpected errors in development\n if (process.env.NODE_ENV === 'development') {\n console.error('Unexpected error:', error);\n }\n\n // Return generic internal error in production (don't leak error details)\n return ApiError.internal(\n process.env.NODE_ENV === 'development'\n ? error.message\n : 'An unexpected error occurred'\n );\n }\n\n // Unknown error type\n console.error('Unknown error type:', error);\n return ApiError.internal('An unexpected error occurred');\n}\n\n/\*\*\n _ Wraps an API handler with consistent error handling\n _\n _ @param handler - The API route handler function\n _ @param options - Configuration options\n _ @returns A wrapped handler with error handling\n _\n _ @example\n _ `ts\n * // In your route.ts file\n * import { withErrorHandler } from '@/lib/api-handler';\n *\n * async function handler(request: NextRequest) {\n *   // Your logic here\n *   return { data: 'success' };\n * }\n *\n * export const GET = withErrorHandler(handler);\n * `\n \*/\nexport function withErrorHandler<T>(\n handler: ApiHandler<T>,\n options: ApiHandlerOptions = {}\n): (request: NextRequest, context: { params: Promise<Record<string, string>> }) => Promise<NextResponse> {\n return async (request: NextRequest, context: { params: Promise<Record<string, string>> }) => {\n try {\n // Await the params since Next.js 15 makes them async\n const params = await context.params;\n\n // Check allowed methods if specified\n if (options.allowedMethods && options.allowedMethods.length > 0) {\n const method = request.method.toUpperCase();\n if (!options.allowedMethods.includes(method)) {\n const error = ApiError.methodNotAllowed(method, options.allowedMethods);\n return createErrorResponse(error);\n }\n }\n\n // Execute the handler\n const result = await handler(request, { params });\n\n // If the handler returns a NextResponse, use it directly\n if (result instanceof NextResponse) {\n return result;\n }\n\n // Otherwise, wrap the result in a JSON response\n return NextResponse.json(result);\n } catch (error) {\n const apiError = normalizeError(error);\n\n // Log errors (in production, you might want to use a proper logging service)\n if (apiError.statusCode >= 500) {\n console.error(`[API Error] ${apiError.code}:`, apiError.message, apiError.details);\n }\n\n return createErrorResponse(apiError);\n }\n };\n}\n\n/\*\*\n _ Helper to parse and validate request body with Zod\n _\n _ @param request - The Next.js request object\n _ @param schema - Zod schema for validation\n _ @returns Validated data\n _ @throws ApiError if validation fails\n _\n _ @example\n _ `ts\n _ const schema = z.object({\n _ name: z.string().min(1),\n _ email: z.string().email(),\n _ });\n _\n _ const data = await parseBody(request, schema);\n _ // data is typed as { name: string; email: string }\n _ `\n _/\nexport async function parseBody<T>(\n request: NextRequest,\n schema: ZodSchema<T>\n): Promise<T> {\n let body: unknown;\n\n try {\n body = await request.json();\n } catch {\n throw ApiError.badRequest('Invalid JSON in request body');\n }\n\n return schema.parse(body);\n}\n\n/\*\*\n _ Helper to parse and validate query parameters with Zod\n _\n _ @param request - The Next.js request object\n _ @param schema - Zod schema for validation\n _ @returns Validated query parameters\n _ @throws ApiError if validation fails\n \*/\nexport function parseQuery<T>(\n request: NextRequest,\n schema: ZodSchema<T>\n): T {\n const searchParams = Object.fromEntries(request.nextUrl.searchParams);\n return schema.parse(searchParams);\n}\n\n/\*\*\n _ Helper to create a success response with consistent format\n _\n _ @param data - The data to include in the response\n _ @param status - HTTP status code (default: 200)\n _ @returns NextResponse with JSON body\n _/\nexport function successResponse<T>(data: T, status: number = 200): NextResponse {\n return NextResponse.json(data, { status });\n}\n\n/\*\*\n _ Helper to create a created response (201)\n _/\nexport function createdResponse<T>(data: T): NextResponse {\n return successResponse(data, 201);\n}\n\n/\*\*\n _ Helper to create a no content response (204)\n \_/\nexport function noContentResponse(): NextResponse {\n return new NextResponse(null, { status: 204 });\n}\n"
}

You've hit your limit · resets 4pm (Europe/Amsterdam)
