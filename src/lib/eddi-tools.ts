import { db } from '@/db';
import { modules, courses, quizzes, resources } from '@/app/db/drizzle/schema';
import { ilike, eq, or, and, sql, gt, asc, count } from 'drizzle-orm';

// ============================================================================
// FEATURE DETECTION UTILITIES
// ============================================================================

/**
 * Check if a table has any data (for graceful feature degradation)
 */
export async function checkTableHasData(tableName: 'resources' | 'user_progress'): Promise<boolean> {
    try {
        if (tableName === 'resources') {
            const result = await db.select({ count: count() }).from(resources);
            return (result[0]?.count ?? 0) > 0;
        }
        // user_progress doesn't exist yet, always return false
        return false;
    } catch (error) {
        console.error(`Error checking ${tableName} table:`, error);
        return false;
    }
}

/**
 * Get available features for the current state
 */
export async function getAvailableFeatures(): Promise<{
    resources: boolean;
    progress: boolean;
}> {
    const resourcesAvailable = await checkTableHasData('resources');
    return {
        resources: resourcesAvailable,
        progress: false, // Not implemented yet
    };
}

// ============================================================================
// SEARCH & NAVIGATION TOOLS
// ============================================================================

/**
 * Search for courses or modules by title
 * Returns enriched data including quiz availability
 */
export async function find_module(query: string) {
    console.log('\n=== FIND_MODULE DEBUG ===');
    console.log('Query received:', query);

    try {
        // First, let's see what's actually in the database
        const allCourses = await db.select({
            id: courses.id,
            title: courses.title,
        }).from(courses);
        console.log('All courses in DB:', allCourses.map(c => `${c.id}: ${c.title}`));

        const allModules = await db.select({
            id: modules.id,
            title: modules.title,
            courseId: modules.courseId,
        }).from(modules).limit(20);
        console.log('Sample modules in DB:', allModules.map(m => `${m.title} (${m.courseId})`));

        // Clean the query - remove common words and normalize
        const cleanQuery = query.toLowerCase().trim();
        console.log('Clean query:', cleanQuery);

        // Search modules with quiz count
        const moduleResults = await db.select({
            id: modules.id,
            title: modules.title,
            courseId: modules.courseId,
            orderIndex: modules.orderIndex,
            type: sql<string>`'module'`,
        })
            .from(modules)
            .where(
                or(
                    ilike(modules.title, `%${query}%`),
                    ilike(modules.contentMarkdown, `%${query}%`)
                )
            )
            .limit(5);

        console.log('Module search results:', moduleResults.length, moduleResults.map(m => m.title));

        // Get quiz counts for found modules
        const modulesWithQuizInfo = await Promise.all(
            moduleResults.map(async (mod) => {
                const quizCount = await db.select({ count: count() })
                    .from(quizzes)
                    .where(eq(quizzes.moduleId, mod.id));
                return {
                    ...mod,
                    hasQuiz: (quizCount[0]?.count ?? 0) > 0,
                };
            })
        );

        // Search courses - try multiple patterns
        let courseResults = await db.select({
            id: courses.id,
            title: courses.title,
            description: courses.description,
            type: sql<string>`'course'`,
        })
            .from(courses)
            .where(
                or(
                    ilike(courses.title, `%${query}%`),
                    ilike(courses.description, `%${query}%`)
                )
            )
            .limit(3);

        console.log('Course search results:', courseResults.length, courseResults.map(c => c.title));

        // If no results, try looser matching (first word only, or partial)
        if (courseResults.length === 0 && modulesWithQuizInfo.length === 0) {
            console.log('No results found, trying looser matching...');

            // Try matching just the first few characters
            const partialQuery = query.slice(0, Math.min(4, query.length));
            console.log('Trying partial query:', partialQuery);

            courseResults = await db.select({
                id: courses.id,
                title: courses.title,
                description: courses.description,
                type: sql<string>`'course'`,
            })
                .from(courses)
                .where(ilike(courses.title, `%${partialQuery}%`))
                .limit(3);

            console.log('Partial match course results:', courseResults.length, courseResults.map(c => c.title));
        }

        const result = {
            modules: modulesWithQuizInfo,
            courses: courseResults,
            totalResults: modulesWithQuizInfo.length + courseResults.length,
        };

        console.log('Final result:', JSON.stringify(result, null, 2));
        console.log('=== END FIND_MODULE DEBUG ===\n');

        return result;
    } catch (error) {
        console.error("Error finding module:", error);
        return { modules: [], courses: [], totalResults: 0, error: 'Search failed' };
    }
}

/**
 * Get all modules for a specific course
 */
export async function get_modules_by_course(courseIdOrTitle: string) {
    console.log('\n=== GET_MODULES_BY_COURSE DEBUG ===');
    console.log('courseIdOrTitle received:', courseIdOrTitle);

    try {
        // First try to find the course
        let courseId = courseIdOrTitle;

        // Check if it's a title match needed
        const courseMatch = await db.select()
            .from(courses)
            .where(or(
                eq(courses.id, courseIdOrTitle),
                ilike(courses.title, `%${courseIdOrTitle}%`)
            ))
            .limit(1);

        console.log('Course match:', courseMatch.length > 0 ? courseMatch[0] : 'NOT FOUND');

        if (courseMatch.length === 0) {
            console.log('=== END GET_MODULES_BY_COURSE (not found) ===\n');
            return { error: 'Course not found', modules: [] };
        }

        courseId = courseMatch[0].id;

        // Get all modules for this course
        const moduleResults = await db.select({
            id: modules.id,
            title: modules.title,
            orderIndex: modules.orderIndex,
            courseId: modules.courseId,
        })
            .from(modules)
            .where(eq(modules.courseId, courseId))
            .orderBy(asc(modules.orderIndex));

        // Add quiz info for each module
        const modulesWithQuizInfo = await Promise.all(
            moduleResults.map(async (mod) => {
                const quizCount = await db.select({ count: count() })
                    .from(quizzes)
                    .where(eq(quizzes.moduleId, mod.id));
                return {
                    ...mod,
                    hasQuiz: (quizCount[0]?.count ?? 0) > 0,
                };
            })
        );

        return {
            course: courseMatch[0],
            modules: modulesWithQuizInfo,
            totalModules: modulesWithQuizInfo.length,
        };
    } catch (error) {
        console.error("Error getting modules by course:", error);
        return { error: 'Failed to get modules', modules: [] };
    }
}

/**
 * Get quiz data for a specific module
 */
export async function get_quiz_for_module(moduleIdOrTitle: string) {
    try {
        // Try to find the module
        const moduleMatch = await db.select()
            .from(modules)
            .where(or(
                eq(modules.id, moduleIdOrTitle),
                ilike(modules.title, `%${moduleIdOrTitle}%`)
            ))
            .limit(1);

        if (moduleMatch.length === 0) {
            return { error: 'Module not found', quiz: null };
        }

        const targetModule = moduleMatch[0];

        // Get quizzes for this module
        const quizResults = await db.select()
            .from(quizzes)
            .where(eq(quizzes.moduleId, targetModule.id));

        if (quizResults.length === 0) {
            return {
                module: targetModule,
                quiz: null,
                message: 'No quiz available for this module yet.',
            };
        }

        return {
            module: targetModule,
            quiz: quizResults,
            quizCount: quizResults.length,
        };
    } catch (error) {
        console.error("Error getting quiz:", error);
        return { error: 'Failed to get quiz', quiz: null };
    }
}

/**
 * Get the next module in sequence based on orderIndex
 */
export async function get_next_module(currentModuleId: string) {
    try {
        // Get current module
        const currentModule = await db.select()
            .from(modules)
            .where(eq(modules.id, currentModuleId))
            .limit(1);

        if (currentModule.length === 0) {
            return { error: 'Current module not found', nextModule: null };
        }

        const current = currentModule[0];

        // Find next module in same course with higher orderIndex
        const nextModule = await db.select()
            .from(modules)
            .where(and(
                eq(modules.courseId, current.courseId),
                gt(modules.orderIndex, current.orderIndex)
            ))
            .orderBy(asc(modules.orderIndex))
            .limit(1);

        if (nextModule.length === 0) {
            return {
                currentModule: current,
                nextModule: null,
                message: "You've reached the last module in this course! 🎉",
            };
        }

        return {
            currentModule: current,
            nextModule: nextModule[0],
        };
    } catch (error) {
        console.error("Error getting next module:", error);
        return { error: 'Failed to get next module', nextModule: null };
    }
}

/**
 * Search resources with graceful fallback
 */
export async function search_resources(query: string) {
    try {
        // Check if resources table has data
        const hasResources = await checkTableHasData('resources');

        if (!hasResources) {
            // Find a related module to suggest
            const relatedModule = await db.select({
                id: modules.id,
                title: modules.title,
                courseId: modules.courseId,
            })
                .from(modules)
                .where(ilike(modules.title, `%${query}%`))
                .limit(1);

            return {
                available: false,
                message: "Resource files are coming soon! For now, supplemental materials are built into module content.",
                suggestedModule: relatedModule.length > 0 ? relatedModule[0] : null,
            };
        }

        // Search resources
        const resourceResults = await db.select()
            .from(resources)
            .where(or(
                ilike(resources.title, `%${query}%`),
                ilike(resources.subject, `%${query}%`),
                ilike(resources.contentSummary, `%${query}%`)
            ))
            .limit(5);

        if (resourceResults.length === 0) {
            return {
                available: true,
                resources: [],
                message: `No resources found for "${query}". Try a different search term.`,
            };
        }

        return {
            available: true,
            resources: resourceResults,
            count: resourceResults.length,
        };
    } catch (error) {
        console.error("Error searching resources:", error);
        return { available: false, error: 'Search failed', resources: [] };
    }
}

/**
 * Get course details by ID or title
 */
export async function get_course(courseIdOrTitle: string) {
    try {
        const courseMatch = await db.select()
            .from(courses)
            .where(or(
                eq(courses.id, courseIdOrTitle),
                ilike(courses.title, `%${courseIdOrTitle}%`)
            ))
            .limit(1);

        if (courseMatch.length === 0) {
            return { error: 'Course not found', course: null };
        }

        return { course: courseMatch[0] };
    } catch (error) {
        console.error("Error getting course:", error);
        return { error: 'Failed to get course', course: null };
    }
}

/**
 * Parse current context from pathname to understand where user is
 */
export function parseUserContext(pathname: string): {
    type: 'module' | 'course' | 'dashboard' | 'other';
    courseId?: string;
    moduleId?: string;
} {
    // Match /courses/[courseId]/[moduleId]
    const moduleMatch = pathname.match(/^\/courses\/([^\/]+)\/([^\/]+)/);
    if (moduleMatch) {
        return {
            type: 'module',
            courseId: moduleMatch[1],
            moduleId: moduleMatch[2],
        };
    }

    // Match /courses/[courseId]
    const courseMatch = pathname.match(/^\/courses\/([^\/]+)$/);
    if (courseMatch) {
        return {
            type: 'course',
            courseId: courseMatch[1],
        };
    }

    // Dashboard
    if (pathname === '/dashboard' || pathname === '/') {
        return { type: 'dashboard' };
    }

    return { type: 'other' };
}

// ============================================================================
// ACTION TOOLS (Return payloads for frontend)
// ============================================================================

/**
 * Navigate user to a specific path
 */
export async function Maps_to(path: string) {
    return {
        action: 'navigate',
        path,
    };
}

/**
 * Navigate to module with quiz and trigger quiz mode
 */
export async function launch_quiz(moduleId: string, courseId: string) {
    return {
        action: 'launch_quiz',
        path: `/courses/${courseId}/${moduleId}`,
        scrollToQuiz: true,
    };
}

/**
 * Display a formatted list of items in chat
 */
export async function display_list(items: { title: string; path?: string; description?: string }[], listTitle: string) {
    return {
        action: 'display_list',
        listTitle,
        items,
    };
}

/**
 * Draft a support ticket for user to confirm
 */
export async function create_ticket(subject: string, body: string, priority: 'low' | 'medium' | 'high' = 'medium') {
    return {
        action: 'draft_ticket',
        ticket: {
            subject,
            body,
            priority,
        },
    };
}

/**
 * Return a friendly "feature not ready" message
 */
export async function feature_unavailable(featureName: string, alternativeSuggestion?: string) {
    return {
        action: 'feature_unavailable',
        feature: featureName,
        message: `${featureName} is coming soon!`,
        suggestion: alternativeSuggestion,
    };
}
