import { createClient } from '@/utils/supabase/server'
import { db } from '@/db'
import { courses, modules, userProgress } from '@/app/db/drizzle/schema'
import { eq } from 'drizzle-orm'
import { NextResponse } from 'next/server'

export async function GET() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get all courses
    const allCourses = await db.select().from(courses)

    // Get all modules
    const allModules = await db.select().from(modules)

    // Get user's progress
    const progress = await db.select()
        .from(userProgress)
        .where(eq(userProgress.userId, user.id))

    const completedModules = progress.filter(p => p.completed).length
    const totalModules = allModules.length
    const completionPercentage = totalModules > 0
        ? Math.round((completedModules / totalModules) * 100)
        : 0

    // Calculate per-course progress
    const courseProgress = allCourses.map(course => {
        const courseModules = allModules.filter(m => m.courseId === course.id)
        const courseCompleted = progress.filter(
            p => p.courseId === course.id && p.completed
        ).length
        const courseStarted = progress.filter(
            p => p.courseId === course.id
        ).length

        return {
            ...course,
            moduleCount: courseModules.length,
            completedCount: courseCompleted,
            startedCount: courseStarted,
            progress: courseModules.length > 0
                ? Math.round((courseCompleted / courseModules.length) * 100)
                : 0,
        }
    })

    return NextResponse.json({
        stats: {
            coursesEnrolled: allCourses.length,
            modulesCompleted: completedModules,
            totalModules,
            completionPercentage,
        },
        courseProgress,
    })
}
