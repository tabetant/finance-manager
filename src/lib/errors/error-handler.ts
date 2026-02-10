/**
 * Error Handling Utilities
 * Sanitize errors for client responses — NEVER expose raw errors, stack traces,
 * or sensitive information to users.
 */

import { NextResponse } from 'next/server'

/**
 * Sanitize an error for client response.
 * Logs full error server-side for debugging.
 */
export function sanitizeError(error: unknown): string {
    // Log full error server-side
    console.error('[server error]', error)

    if (process.env.NODE_ENV === 'production') {
        return 'An error occurred. Please try again later.'
    }

    // In development, show the message (but not the stack)
    if (error instanceof Error) {
        return `Error: ${error.message}`
    }

    return 'An unexpected error occurred.'
}

/**
 * Standardized JSON error response for API routes.
 */
export function errorResponse(error: unknown, status: number = 500) {
    return NextResponse.json(
        { error: sanitizeError(error) },
        { status }
    )
}
