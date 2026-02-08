import { google } from '@ai-sdk/google';
import { streamText, tool, zodSchema } from 'ai'; // 'zodSchema' is unused but kept for now as per previous context
import { z } from 'zod';
import { db } from '@/db';
import { modules, courses } from '@/app/db/drizzle/schema';
import { ilike, or, eq, and } from 'drizzle-orm';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

// Define schemas outside to help type inference
const MapsToModuleSchema = z.object({
    courseSlug: z.string().describe('The slug of the course'),
    moduleSlug: z.string().describe('The slug/id of the module'),
});

const CreateTicketSchema = z.object({
    title: z.string(),
    description: z.string(),
    priority: z.enum(['low', 'medium', 'high']).default('medium'),
});

const SearchSchema = z.object({
    query: z.string(),
});

export async function POST(req: Request) {
    const { messages } = await req.json();

    // Construct system instructions with context
    const systemInstructions = `
You are Eddi, the WorldEd learning assistant.
You help students with Calculus and Linear Algebra.
You can suggest opening modules or creating mentor tickets.

**Your Capabilities:**
1. **Navigation**: You can redirect users to specific course modules using the \`mapsToModule\` tool.
2. **Support**: You can draft support tickets for users using the \`createSupportTicket\` tool.
3. **Knowledge**: You can search the course content and quizzes to answer questions using the \`searchCourseContent\` tool.

**Context:**
- You should always try to answer questions based on the course content first.
- If a user reports a bug or technical issue, suggest drafting a support ticket.
- If a user asks to go to a specific topic, use the navigation tool.

**Tone:**
- Professional but approachable.
- Academic and precise when discussing math/science.
- Encouraging and helpful.
`;

    const result = streamText({
        model: google('gemini-2.0-flash'), // Updated to available 2.0 flash model
        system: systemInstructions,
        messages,
        tools: {
            mapsToModule: tool({
                description: 'Redirect the user to a specific course module page',
                // Use inputSchema as per provider-utils definition
                // We can use the Zod schema directly as it satisfies FlexibleSchema
                inputSchema: MapsToModuleSchema,
                execute: async (args) => {
                    const { courseSlug, moduleSlug } = args;

                    try {
                        // Validate Course
                        const course = await db.query.courses.findFirst({
                            where: eq(courses.id, courseSlug)
                        });

                        if (!course) {
                            return {
                                action: 'error',
                                message: `I couldn't find a course named "${courseSlug}". Available courses: Calculus, Linear Algebra.`
                            };
                        }

                        // Validate Module (check ID or partial title match)
                        // Since moduleSlug might be a guess, we search.
                        const module = await db.query.modules.findFirst({
                            where: and(
                                eq(modules.courseId, courseSlug),
                                or(
                                    eq(modules.id, moduleSlug), // strict ID check
                                    ilike(modules.title, `%${moduleSlug}%`) // loose title check
                                )
                            )
                        });

                        if (!module) {
                            // Find available modules for suggestion
                            const courseModules = await db.query.modules.findMany({
                                where: eq(modules.courseId, courseSlug),
                                limit: 5,
                                columns: { title: true }
                            });
                            const suggestions = courseModules.map(m => m.title).join(', ');
                            return {
                                action: 'error',
                                message: `I couldn't find a module matching "${moduleSlug}" in ${course.title}. Try searching for: ${suggestions || 'Introduction'}`
                            };
                        }

                        return {
                            action: 'redirect',
                            url: `/courses/${courseSlug}/${module.id}`,
                            message: `Navigating to ${course.title} - ${module.title}...`
                        };
                    } catch (error) {
                        console.error("Tool execution error:", error);
                        return {
                            action: 'error',
                            message: "I encountered an error while trying to find that module."
                        }
                    }
                },
            }),
            createSupportTicket: tool({
                description: 'Draft a support ticket for the user. ALWAYS ask for confirmation before submitting.',
                inputSchema: CreateTicketSchema,
                execute: async (args) => {
                    const { title, description, priority } = args;
                    // This tool doesn't actually write to DB directly in this flow.
                    // It returns a "draft" state that the UI will render as a confirmation card.
                    return {
                        action: 'draft_ticket',
                        ticket: { title, description, priority }
                    };
                },
            }),
            searchCourseContent: tool({
                description: 'Search the database for course content, modules, or quizzes to answer a question.',
                inputSchema: SearchSchema,
                execute: async (args) => {
                    const { query } = args;
                    try {
                        // Perform a basic text search on modules (title and content)
                        const results = await db.select({
                            title: modules.title,
                            content: modules.contentMarkdown,
                            courseId: modules.courseId
                        })
                            .from(modules)
                            .where(
                                or(
                                    ilike(modules.title, `%${query}%`),
                                    ilike(modules.contentMarkdown, `%${query}%`)
                                )
                            )
                            .limit(3);

                        if (results.length === 0) {
                            return "No relevant course content found.";
                        }

                        // Format results for the LLM
                        return results.map(r => `Found in ${r.courseId} - ${r.title}: ${r.content?.substring(0, 200)}...`).join('\n');

                    } catch (error) {
                        console.error("Search error:", error);
                        return "Failed to search course content.";
                    }
                },
            }),
        },
    });

    return result.toTextStreamResponse();
}
