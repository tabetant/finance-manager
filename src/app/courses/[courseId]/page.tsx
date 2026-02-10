import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, BookOpen, Clock, Video, CheckCircle, Lock } from "lucide-react";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { db } from "@/db";
import { courses, modules, userProgress } from "@/app/db/drizzle/schema";
import { eq, and, asc } from "drizzle-orm";
import { createClient } from "@/utils/supabase/server";

export const dynamic = 'force-dynamic';

export default async function CoursePage({ params }: { params: Promise<{ courseId: string }> }) {
    const { courseId } = await params;

    // Auth check
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect('/auth');
    }

    // Fetch course from DB
    const courseData = await db.select()
        .from(courses)
        .where(eq(courses.id, courseId))
        .limit(1);

    if (!courseData[0]) {
        return notFound();
    }

    const course = courseData[0];

    // Fetch modules for this course
    const courseModules = await db.select()
        .from(modules)
        .where(eq(modules.courseId, courseId))
        .orderBy(asc(modules.orderIndex));

    // Fetch user's progress for these modules
    const userModuleProgress = await db.select()
        .from(userProgress)
        .where(
            and(
                eq(userProgress.userId, user.id),
                eq(userProgress.courseId, courseId)
            )
        );

    // Create a map for quick lookup
    const progressMap = new Map(
        userModuleProgress.map(p => [p.moduleId, p])
    );

    const completedModules = courseModules.filter(m => progressMap.get(m.id)?.completed).length;
    const progress = courseModules.length > 0
        ? Math.round((completedModules / courseModules.length) * 100)
        : 0;

    // Estimate total hours (rough: 45 min per module)
    const estimatedHours = Math.round(courseModules.length * 0.75);

    return (
        <div className="min-h-screen bg-[var(--background-subtle)]">
            {/* Hero Header */}
            <div className="relative h-64 overflow-hidden bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)]">
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                <div className="absolute inset-0 flex flex-col justify-end p-8">
                    <div className="container mx-auto">
                        <Link
                            href="/dashboard"
                            className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-4 transition-colors"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Back to Dashboard
                        </Link>
                        <div className="flex items-start gap-4">
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="px-2 py-1 rounded-md text-xs font-medium bg-white/20 text-white">
                                        {course.iconName || '📚'}
                                    </span>
                                </div>
                                <h1 className="text-4xl font-bold text-white mb-2">{course.title}</h1>
                                <p className="text-white/80 text-lg max-w-2xl">{course.description}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-6 py-8">
                {/* Progress Overview */}
                <div className="bg-white rounded-2xl border border-[var(--border-subtle)] p-6 mb-8 shadow-sm">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-center gap-6">
                            <div>
                                <p className="text-sm text-[var(--text-muted)] mb-1">Your Progress</p>
                                <p className="text-3xl font-bold text-foreground">{progress}%</p>
                            </div>
                            <div className="flex items-center gap-4 text-sm text-[var(--text-muted)]">
                                <span className="flex items-center gap-1">
                                    <BookOpen className="w-4 h-4" />
                                    {courseModules.length} modules
                                </span>
                                <span className="flex items-center gap-1">
                                    <Clock className="w-4 h-4" />
                                    ~{estimatedHours} hours
                                </span>
                            </div>
                        </div>
                        <div className="flex-1 max-w-md">
                            <Progress value={progress} className="h-3 bg-[var(--border-subtle)]" />
                        </div>
                    </div>
                </div>

                {/* Module List */}
                <h2 className="text-2xl font-bold text-foreground mb-4">Course Modules</h2>
                <div className="space-y-4">
                    {courseModules.map((module, index) => {
                        const moduleProgress = progressMap.get(module.id);
                        const isCompleted = moduleProgress?.completed || false;
                        const isStarted = !!moduleProgress;

                        // A module is "locked" if: it's not started, not completed, and it's not the first un-started module
                        const firstUnstartedIndex = courseModules.findIndex(m => !progressMap.get(m.id));
                        const isLocked = !isStarted && !isCompleted && index > 0 && index > firstUnstartedIndex;

                        // Slugify module title for URL
                        const moduleSlug = module.title.toLowerCase().replace(/\s+/g, '-');

                        return (
                            <Link
                                key={module.id}
                                href={isLocked ? "#" : `/courses/${courseId}/${moduleSlug}`}
                                className={isLocked ? "cursor-not-allowed" : ""}
                            >
                                <div className={`bg-white rounded-2xl border p-5 transition-all duration-200 ${isLocked
                                    ? "border-[var(--border-subtle)] opacity-60"
                                    : isCompleted
                                        ? "border-[var(--success)]/30 hover:shadow-md hover:-translate-y-0.5"
                                        : isStarted
                                            ? "border-[var(--primary)] shadow-md ring-1 ring-[var(--primary)]/20"
                                            : "border-[var(--border-subtle)] hover:shadow-md hover:-translate-y-0.5"
                                    }`}>
                                    <div className="flex items-center gap-4">
                                        {/* Module Number / Status Icon */}
                                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg ${isCompleted
                                            ? "bg-[var(--success)]/10 text-[var(--success)]"
                                            : isStarted
                                                ? "bg-[var(--primary)]/10 text-[var(--primary)]"
                                                : isLocked
                                                    ? "bg-gray-100 text-gray-400"
                                                    : "bg-[var(--primary)]/10 text-[var(--primary)]"
                                            }`}>
                                            {isCompleted ? (
                                                <CheckCircle className="w-6 h-6" />
                                            ) : isLocked ? (
                                                <Lock className="w-5 h-5" />
                                            ) : (
                                                module.orderIndex
                                            )}
                                        </div>

                                        {/* Module Info */}
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                <h3 className="font-semibold text-lg text-foreground">
                                                    {module.title}
                                                </h3>
                                                {isStarted && !isCompleted && (
                                                    <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-[var(--primary)]/10 text-[var(--primary)]">
                                                        In Progress
                                                    </span>
                                                )}
                                                {isCompleted && moduleProgress?.quizScore != null && (
                                                    <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700">
                                                        Quiz: {moduleProgress.quizScore}%
                                                    </span>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-3 text-sm text-[var(--text-muted)]">
                                                <span className="flex items-center gap-1">
                                                    {module.youtubeUrl ? (
                                                        <Video className="w-4 h-4" />
                                                    ) : (
                                                        <BookOpen className="w-4 h-4" />
                                                    )}
                                                    {module.youtubeUrl ? 'Video' : 'Reading'}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Action Button */}
                                        {!isLocked && (
                                            <Button
                                                className={`rounded-xl px-6 ${isCompleted
                                                    ? "bg-[var(--success)] hover:bg-emerald-600"
                                                    : "bg-[var(--primary)] hover:bg-[var(--primary-hover)]"
                                                    } text-white`}
                                            >
                                                {isCompleted ? "Review" : isStarted ? "Continue" : "Start"}
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </div>

                {courseModules.length === 0 && (
                    <div className="text-center py-16">
                        <BookOpen className="w-12 h-12 mx-auto mb-4 text-muted-foreground/30" />
                        <p className="text-xl text-muted-foreground">No modules in this course yet.</p>
                    </div>
                )}
            </div>
        </div>
    );
}

