import { db } from '@/db'
import { courses, modules, userProgress } from '@/app/db/drizzle/schema'
import { eq, and, count } from 'drizzle-orm'

export interface CourseProgress {
    courseId: string
    courseName: string
    totalModules: number
    completedModules: number
    percentage: number
    timeRemaining: string
    lastModule?: {
        id: string
        title: string
    }
}

/**
 * Calculate progress for a specific course and user
 */
export async function getCourseProgress(
    courseId: string,
    userId: string
): Promise<CourseProgress> {
    // Get all modules in this course
    const allModules = await db.select()
        .from(modules)
        .where(eq(modules.courseId, courseId))
        .orderBy(modules.orderIndex)

    const totalModules = allModules.length

    // Get user's completed modules for this course
    const completedModulesData = await db.select()
        .from(userProgress)
        .where(
            and(
                eq(userProgress.userId, userId),
                eq(userProgress.courseId, courseId),
                eq(userProgress.completed, true)
            )
        )

    const completedModules = completedModulesData.length
    const percentage = totalModules > 0 ? Math.round((completedModules / totalModules) * 100) : 0

    // Calculate time remaining (estimate: 15 min per module)
    const remainingModules = totalModules - completedModules
    const estimatedMinutes = remainingModules * 15

    // Find the next incomplete module (for "continue" button)
    const completedModuleIds = new Set(completedModulesData.map(p => p.moduleId))
    const nextModule = allModules.find(m => !completedModuleIds.has(m.id))

    // Get course name
    const course = await db.select()
        .from(courses)
        .where(eq(courses.id, courseId))
        .limit(1)

    return {
        courseId,
        courseName: course[0]?.title || '',
        totalModules,
        completedModules,
        percentage,
        timeRemaining: `${estimatedMinutes} min left`,
        lastModule: nextModule ? {
            id: nextModule.id,
            title: nextModule.title,
        } : undefined,
    }
}

/**
 * Get progress for all courses a user has started (not yet 100% complete)
 */
export async function getInProgressCourses(
    userId: string
): Promise<CourseProgress[]> {
    // Get distinct courses user has progress in
    const userCourses = await db.selectDistinct({
        courseId: userProgress.courseId
    })
        .from(userProgress)
        .where(eq(userProgress.userId, userId))

    // Get progress for each course
    const progressData = await Promise.all(
        userCourses.map(({ courseId }) => getCourseProgress(courseId, userId))
    )

    // Filter to only courses that aren't 100% complete
    return progressData.filter(p => p.percentage < 100)
}

/**
 * Get overall stats for dashboard
 */
export async function getOverallProgress(userId: string) {
    const totalModulesResult = await db.select({ count: count() })
        .from(modules)

    const completedModulesResult = await db.select({ count: count() })
        .from(userProgress)
        .where(
            and(
                eq(userProgress.userId, userId),
                eq(userProgress.completed, true)
            )
        )

    const totalModules = totalModulesResult[0]?.count || 0
    const completedModules = completedModulesResult[0]?.count || 0
    const percentage = totalModules > 0 ? Math.round((completedModules / totalModules) * 100) : 0

    return {
        totalModules,
        completedModules,
        percentage,
    }
}
