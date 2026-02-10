import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/db'
import { courses, modules } from '@/app/db/drizzle/schema'
import { ilike, or } from 'drizzle-orm'
import { errorResponse } from '@/lib/errors/error-handler'

export async function GET(request: NextRequest) {
    try {
        const query = request.nextUrl.searchParams.get('q')?.trim()

        if (!query || query.length < 2) {
            return NextResponse.json({ results: [] })
        }

        const pattern = `%${query}%`

        // Search courses by title or description
        const matchedCourses = await db.select({
            id: courses.id,
            title: courses.title,
            description: courses.description,
            iconName: courses.iconName,
        })
            .from(courses)
            .where(
                or(
                    ilike(courses.title, pattern),
                    ilike(courses.description, pattern)
                )
            )
            .limit(5)

        // Search modules by title or content
        const matchedModules = await db.select({
            id: modules.id,
            title: modules.title,
            courseId: modules.courseId,
            orderIndex: modules.orderIndex,
        })
            .from(modules)
            .where(
                ilike(modules.title, pattern)
            )
            .limit(5)

        // Format results
        const results = [
            ...matchedCourses.map(c => ({
                type: 'course' as const,
                id: c.id,
                title: c.title,
                description: c.description || '',
                href: `/courses/${c.id}`,
                icon: c.iconName,
            })),
            ...matchedModules.map(m => ({
                type: 'module' as const,
                id: m.id,
                title: m.title,
                description: `Module ${(m.orderIndex ?? 0) + 1}`,
                href: `/courses/${m.courseId}/${m.id}`,
                icon: null,
            })),
        ]

        return NextResponse.json({ results })
    } catch (error) {
        return errorResponse(error)
    }
}
