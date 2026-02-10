import { db } from "@/db";
import { modules, userProgress } from "@/app/db/drizzle/schema";
import ModuleContent from "@/components/courses/ModuleContent";
import { eq, and, ilike } from "drizzle-orm";
import { notFound, redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

// Only run DB queries on the server
export const dynamic = 'force-dynamic';
export default async function ModulePage({ params }: { params: Promise<{ courseId: string; moduleId: string }> }) {
    const { courseId, moduleId } = await params;

    // Auth check
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect('/auth');
    }

    // Attempt to find the module.
    const decodedTitle = moduleId.replace(/-/g, ' ');

    let moduleData;
    try {
        moduleData = await db.query.modules.findFirst({
            where: and(
                eq(modules.courseId, courseId),
                ilike(modules.title, `%${decodedTitle}%`)
            ),
            with: {
                quizzes: true
            }
        });
    } catch (e) {
        console.error("Failed to fetch module:", e);
    }

    if (!moduleData) {
        return notFound();
    }

    // Check if progress record exists
    const existingProgress = await db.select()
        .from(userProgress)
        .where(
            and(
                eq(userProgress.userId, user.id),
                eq(userProgress.moduleId, moduleData.id)
            )
        )
        .limit(1);

    // If no progress record, create one (marks module as "started")
    if (!existingProgress[0]) {
        try {
            await db.insert(userProgress).values({
                userId: user.id,
                moduleId: moduleData.id,
                courseId: courseId,
                completed: false,
                startedAt: new Date(),
            });
        } catch (e) {
            // Ignore unique constraint violations (race condition)
            console.error("Failed to create progress record:", e);
        }
    }

    const isCompleted = existingProgress[0]?.completed ?? false;

    return (
        <ModuleContent
            courseId={courseId}
            moduleId={moduleData.id}
            moduleTitle={moduleData.title}
            contentMarkdown={moduleData.contentMarkdown || ""}
            youtubeUrl={moduleData.youtubeUrl}
            initialCompleted={isCompleted}
            quizzes={moduleData.quizzes.map(q => ({
                question: q.question,
                options: q.options as string[],
                correctAnswer: q.correctAnswer
            }))}
        />
    );
}

