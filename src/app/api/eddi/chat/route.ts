import { google } from '@ai-sdk/google';
import { generateText, tool, zodSchema } from 'ai';
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/db';
import { modules, courses } from '@/app/db/drizzle/schema';
import { ilike, or, eq, and } from 'drizzle-orm';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

// Define schemas for tools
const MapsToSchema = z.object({
    path: z.string().describe('The internal relative path to navigate to (e.g., "/courses/calculus" or "/dashboard").'),
});

const DraftTicketSchema = z.object({
    subject: z.string().describe('The subject line of the ticket.'),
    body: z.string().describe('The main content/description of the issue.'),
    priority: z.enum(['low', 'medium', 'high']).default('medium'),
});

const SearchSchema = z.object({
    query: z.string().describe('The search query keyword.'),
    type: z.enum(['course', 'module']).default('module').describe('The type of content to search for.'),
});

export async function POST(req: Request) {
    const { messages } = await req.json();

    // System instructions for Action Agent behavior
    const systemInstructions = `
You are Eddi, an intelligent "Action Agent" for WorldEd.
Your goal is to help users navigate the platform, find content, and get support.

**CORE RULES:**
1. **NEVER ask for IDs or Slugs.** Users don't know them. Use \`search_content\` to find them yourself.
2. **Be Proactive.** If a user says "Open Calculus", SEARCH for "Calculus", find the slug, then CALL \`Maps_to\` with the path.
3. **Generalist Scope.** You can help with math, science, or general platform questions.

**Your Tools:**
- \`search_content(query, type)\`: Search the database for courses or modules. Returns titles and IDs/Slugs.
- \`Maps_to(path)\`: Triggers a navigation action in the user's browser. Use the IDs/Slugs found from search to construct paths like \`/courses/[course-slug]/[module-id]\`.
- \`draft_mentor_ticket(subject, body)\`: Drafts a support ticket for the user to confirm.

**Example Flows:**
- User: "Take me to linear algebra."
  - You: Call \`search_content("Linear Algebra", "course")\`
  - Tool Output: Found Course: title="Linear Algebra", id="linear-algebra"
  - You: Call \`Maps_to("/courses/linear-algebra")\`
  - You: "Navigating you to Linear Algebra."

- User: "I found a bug in the quiz."
  - You: Call \`draft_mentor_ticket("Bug Report: Quiz Issue", "User reported a bug in the quiz...")\`
  - You: "I've drafted a ticket for you. Does this look right?"
`;

    try {
        const result = await generateText({
            model: google('gemini-2.0-flash'),
            system: systemInstructions,
            messages,
            maxSteps: 5, // Enable multi-step reasoning loop
            tools: {
                search_content: tool({
                    description: 'Search for courses or modules by title to find their IDs/Slugs.',
                    inputSchema: SearchSchema,
                    execute: async ({ query, type }) => {
                        try {
                            if (type === 'course') {
                                const results = await db.select({
                                    id: courses.id,
                                    title: courses.title
                                }).from(courses).where(ilike(courses.title, `%${query}%`)).limit(3);
                                return JSON.stringify(results);
                            } else {
                                const results = await db.select({
                                    id: modules.id,
                                    title: modules.title,
                                    courseId: modules.courseId
                                }).from(modules).where(ilike(modules.title, `%${query}%`)).limit(5);
                                return JSON.stringify(results);
                            }
                        } catch (error) {
                            console.error("Search Error:", error);
                            return "Error searching content.";
                        }
                    }
                }),
                Maps_to: tool({
                    description: 'Navigate the user to a specific path. Returns the action payload.',
                    inputSchema: MapsToSchema,
                    execute: async ({ path }) => {
                        // This tool returns a special object that the frontend will intercept
                        return { action: 'navigate', path };
                    }
                }),
                draft_mentor_ticket: tool({
                    description: 'Draft a support ticket for the user to review.',
                    inputSchema: DraftTicketSchema,
                    execute: async ({ subject, body, priority }) => {
                        return { action: 'draft_ticket', ticket: { subject, body, priority } };
                    }
                })
            },
        });

        // Log the reasoning steps and final response
        console.log("Eddi Steps:", result.steps);

        // Check if the final step had tool calls that returned 'action' payloads
        // or if the model just replied with text.
        // Since we are not streaming, 'result.text' contains the final model response text.
        // However, if the LAST step was a tool execution that returned a client-action, we need to pass that to the client.

        // In this architecture, 'Maps_to' returns a JSON object.
        // The model sees this JSON. Then it generates a text response like "Navigating...".
        // WE need to send the ACTION to the frontend alongside the text.

        // Let's inspect the tool calls in the result.
        // We want to extract any 'navigate' or 'draft_ticket' actions from the tool results of the conversation.
        // But simpler: The tool returns the action object as its result.
        // The MODEL reads this result.
        // We need to pass this RESULT to the frontend.

        // Check for 'navigate' or 'draft_ticket' actions in the tool results
        let actionPayload = null;

        const steps = result.steps;

        if (steps && steps.length > 0) {
            for (const step of steps) {
                if (step.toolResults && Array.isArray(step.toolResults)) {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    for (const toolResult of step.toolResults as any[]) {
                        if (toolResult.toolName === 'Maps_to' || toolResult.toolName === 'draft_mentor_ticket') {
                            if (toolResult.result && toolResult.result.action) {
                                actionPayload = toolResult.result;
                            }
                        }
                    }
                }
            }
        }

        return NextResponse.json({
            text: result.text,
            action: actionPayload
        });

    } catch (error: any) {
        console.error("Gemini API Error:", error);
        if (error.status === 429 || (error.message && error.message.includes('429'))) {
            return NextResponse.json(
                { text: "I'm currently overwhelmed with requests. Please give me a moment to catch my breath and try again." },
                { status: 429 }
            );
        }
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
