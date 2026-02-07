import { db } from "@/db";
import { modules } from "@/app/db/drizzle/schema";
import ModuleContent from "@/components/courses/ModuleContent";
import { eq, and, ilike } from "drizzle-orm";
import { notFound } from "next/navigation";

// Only run DB queries on the server
export default async function ModulePage({ params }: { params: Promise<{ courseId: string; moduleId: string }> }) {
    const { courseId, moduleId } = await params;

    // Attempt to find the module. 
    // Since IDs are UUIDs but URLs are slugs, we try a loose title match or exact ID match.
    // In a production app, we should add a 'slug' column to the modules table.
    const decodedTitle = moduleId.replace(/-/g, ' ');

    let moduleData;
    try {
        moduleData = await db.query.modules.findFirst({
            where: and(
                eq(modules.courseId, courseId),
                // Try to match UUID or Title
                // Note: relying on title match for now as schema lacks slug
                ilike(modules.title, `%${decodedTitle}%`)
            ),
            with: {
                quizzes: true
            }
        });
    } catch (e) {
        console.error("Failed to fetch module:", e);
        // Fallback or error handling
    }

    // Fallback logic not strictly implemented as user requested DB fetch.
    if (!moduleData) {
        return notFound();
    }

    return (
        <ModuleContent
            courseId={courseId}
            moduleTitle={moduleData.title}
            contentMarkdown={moduleData.contentMarkdown || ""}
            youtubeUrl={moduleData.youtubeUrl}
            quizzes={moduleData.quizzes.map(q => ({
                question: q.question,
                options: q.options as string[],
                correctAnswer: q.correctAnswer
            }))}
        />
    );
}
