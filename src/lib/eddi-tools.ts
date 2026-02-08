import { db } from '@/db';
import { modules, courses, tickets } from '@/app/db/drizzle/schema';
import { ilike, eq, or, and } from 'drizzle-orm';

export async function searchModules(query: string) {
    try {
        const results = await db.select({
            id: modules.id,
            title: modules.title,
            courseId: modules.courseId,
            content: modules.contentMarkdown
        })
            .from(modules)
            .where(
                or(
                    ilike(modules.title, `%${query}%`),
                    ilike(modules.contentMarkdown, `%${query}%`)
                )
            )
            .limit(5);

        return results;
    } catch (error) {
        console.error("Error searching modules:", error);
        return [];
    }
}

export async function getCourseSummary(courseId: string) {
    try {
        const course = await db.query.courses.findFirst({
            where: eq(courses.id, courseId),
            with: {
                modules: {
                    columns: {
                        id: true,
                        title: true,
                        orderIndex: true
                    },
                    orderBy: (modules, { asc }) => [asc(modules.orderIndex)]
                }
            }
        });

        if (!course) return null;

        const moduleList = course.modules.map(m => `- ${m.title} (ID: ${m.id})`).join('\n');

        return {
            title: course.title,
            description: course.description,
            modules: moduleList
        };
    } catch (error) {
        console.error("Error getting course summary:", error);
        return null;
    }
}

export async function draftMentorTicket(subject: string, body: string, priority: 'low' | 'medium' | 'high' = 'medium') {
    // Return action payload strictly as requested by the architecture
    return {
        action: 'draft_ticket',
        ticket: {
            subject,
            body,
            priority
        }
    };
}
