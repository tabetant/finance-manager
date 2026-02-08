import { google } from '@ai-sdk/google';
import { generateText, tool, zodSchema } from 'ai';
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/db';
import { modules, courses } from '@/app/db/drizzle/schema';
import { ilike, or, eq, and } from 'drizzle-orm';
import { searchModules, draftMentorTicket } from '@/lib/eddi-tools';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

// Define schemas for tools
const MapsToSchema = z.object({
    path: z.string().describe('The internal relative path to navigate to (e.g., "/courses/calculus/limits-and-continuity").'),
});

const DraftTicketSchema = z.object({
    subject: z.string().describe('The subject line of the ticket.'),
    body: z.string().describe('The main content/description of the issue.'),
    priority: z.enum(['low', 'medium', 'high']).default('medium'),
});

const SearchSchema = z.object({
    query: z.string().describe('The search query keyword.'),
});

export async function POST(req: Request) {
    const { messages } = await req.json();

    // System instructions for Action Agent behavior
    const systemInstructions = `
You are Eddi, an intelligent "Action Agent" for WorldEd.
Your goal is to help users navigate the platform, find content, and get support.

**CORE RULES:**
1. **NEVER ask for IDs or Slugs.** Users don't know them. 
2. **SEARCH FIRST.** If a user wants to go somewhere, query the database with \`search_content\`.
3. **ACT IMMEDIATELY.** When you find a matching module/course, CALL \`Maps_to\` with the path. Do not ask "Do you want me to open it?". Just do it.
4. **Generalist Scope.** You can help with math, science, or general platform questions.

**Your Tools:**
- \`search_content(query)\`: Search the database for courses or modules. Returns titles and IDs/Slugs.
- \`Maps_to(path)\`: Triggers a navigation action in the user's browser. Use the IDs/Slugs found from search to construct paths like \`/courses/[course-slug]/[module-id]\`.
- \`draft_mentor_ticket(subject, body)\`: Drafts a support ticket for the user to confirm.

**Example Flows:**
- User: "Take me to linear algebra."
  - You: Call \`search_content("Linear Algebra")\`
  - Tool Output: Found Course: title="Linear Algebra", id="linear-algebra"
  - You: Call \`Maps_to("/courses/linear-algebra")\`
  - You: "Navigating you to Linear Algebra."

- User: "Open the vectors module."
  - You: Call \`search_content("vectors")\`
  - Tool Output: Found ... id="introduction-to-vectors", courseId="linear-algebra"
  - You: Call \`Maps_to("/courses/linear-algebra/introduction-to-vectors")\`
  - You: "Opening Introduction to Vectors..."
`;

    try {
        const result = await generateText({
            model: google('gemini-2.0-flash'),
            system: systemInstructions,
            messages,
            // @ts-ignore - maxSteps is supported in ai^6.0
            maxSteps: 5,
            tools: {
                search_content: tool({
                    description: 'Search for courses or modules by title to find their IDs/Slugs.',
                    inputSchema: SearchSchema,
                    execute: async ({ query }) => {
                        const results = await searchModules(query);
                        return JSON.stringify(results);
                    }
                }),
                Maps_to: tool({
                    description: 'Navigate the user to a specific path. Returns the action payload.',
                    inputSchema: MapsToSchema,
                    execute: async ({ path }) => {
                        return { action: 'navigate', path };
                    }
                }),
                draft_mentor_ticket: tool({
                    description: 'Draft a support ticket for the user to review.',
                    inputSchema: DraftTicketSchema,
                    execute: async ({ subject, body, priority }) => {
                        return await draftMentorTicket(subject, body, priority);
                    }
                })
            },
        });

        // Log the reasoning steps and final response to debug loop
        console.log("Eddi Steps Count:", result.steps.length);
        console.log("Eddi Final Text:", result.text);

        // Extract action payload from tool results
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
