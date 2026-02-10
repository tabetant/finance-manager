import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

// =============================================================================
// CORS Configuration
// TODO: Before deploying to production, update ALLOWED_ORIGINS with actual domain
// Example: 'https://worlded.app' or 'https://app.worlded.com'
// =============================================================================
const ALLOWED_ORIGINS = [
    'http://localhost:3000',        // Development
    'https://worlded.com',          // TODO: Replace with actual production domain
    'https://www.worlded.com',      // TODO: Replace with actual production domain
]

export async function middleware(request: NextRequest) {
    const origin = request.headers.get('origin')
    const isApiRoute = request.nextUrl.pathname.startsWith('/api')

    // -------------------------------------------------------------------------
    // Handle CORS preflight (OPTIONS) for API routes
    // -------------------------------------------------------------------------
    if (isApiRoute && request.method === 'OPTIONS') {
        const preflightResponse = new NextResponse(null, { status: 204 })
        if (origin && ALLOWED_ORIGINS.includes(origin)) {
            preflightResponse.headers.set('Access-Control-Allow-Origin', origin)
            preflightResponse.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
            preflightResponse.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
            preflightResponse.headers.set('Access-Control-Max-Age', '86400')
        }
        return preflightResponse
    }

    // -------------------------------------------------------------------------
    // Block cross-origin API requests from unknown origins
    // -------------------------------------------------------------------------
    if (isApiRoute && origin && !ALLOWED_ORIGINS.includes(origin)) {
        return new NextResponse('CORS policy violation', { status: 403 })
    }

    // -------------------------------------------------------------------------
    // Supabase Auth session handling (existing logic)
    // -------------------------------------------------------------------------
    let response = NextResponse.next({
        request: {
            headers: request.headers,
        },
    })

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll()
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value, options }) =>
                        request.cookies.set(name, value)
                    )
                    response = NextResponse.next({
                        request,
                    })
                    cookiesToSet.forEach(({ name, value, options }) =>
                        response.cookies.set(name, value, options)
                    )
                },
            },
        }
    )

    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (
        !user &&
        !request.nextUrl.pathname.startsWith('/auth') &&
        request.nextUrl.pathname.startsWith('/dashboard')
    ) {
        const url = request.nextUrl.clone()
        url.pathname = '/auth'
        return NextResponse.redirect(url)
    }

    // -------------------------------------------------------------------------
    // Set CORS headers on actual API responses
    // -------------------------------------------------------------------------
    if (isApiRoute && origin && ALLOWED_ORIGINS.includes(origin)) {
        response.headers.set('Access-Control-Allow-Origin', origin)
        response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
        response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    }

    return response
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        '/((?!_next/static|_next/image|favicon.ico).*)',
    ],
}
