import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { checkRateLimit } from '@/lib/security/rate-limiter'
import { z } from 'zod'

const requestSchema = z.object({
    email: z.string().email(),
})

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { email } = requestSchema.parse(body)

        // Rate limit: max 3 requests per email per hour
        const rateLimitKey = `password-reset:${email.toLowerCase()}`
        const rateLimit = checkRateLimit(rateLimitKey, {
            maxAttempts: 3,
            windowMs: 60 * 60 * 1000,
        })

        if (!rateLimit.allowed) {
            const retryAfter = Math.ceil((rateLimit.resetAt - Date.now()) / 60000)
            return NextResponse.json(
                { error: 'Too many reset requests. Please try again later.', retryAfter },
                { status: 429 }
            )
        }

        // Use Supabase's built-in password reset
        const supabase = await createClient()
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/auth/reset-callback`,
        })

        if (error) {
            console.error('[password-reset] Supabase error:', error.message)
            // Don't reveal if the email exists — always return success message
        }

        // Always return success to prevent email enumeration
        return NextResponse.json({
            success: true,
            message: 'If an account exists with this email, you will receive reset instructions.',
            remaining: rateLimit.remaining,
        })
    } catch (error) {
        console.error('[password-reset] Error:', error)
        return NextResponse.json(
            { error: 'An error occurred. Please try again.' },
            { status: 500 }
        )
    }
}
