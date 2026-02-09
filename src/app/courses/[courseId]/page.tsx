import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, BookOpen, Clock, Video, CheckCircle, Lock } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

// Mock Data (Replace with DB fetch later)
const COURSES = {
    "calculus": {
        title: "Calculus I",
        description: "Master limits, derivatives, and integration fundamentals for advanced mathematics.",
        category: "Mathematics",
        difficulty: "Intermediate",
        hours: 12,
        image: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800",
        modules: [
            { id: "limits", title: "Limits and Continuity", order: 1, type: "reading", duration: "45 min", completed: true, inProgress: false },
            { id: "derivatives", title: "Derivatives", order: 2, type: "video", duration: "1h 20min", completed: true, inProgress: false },
            { id: "optimization", title: "Optimization Problems", order: 3, type: "reading", duration: "55 min", completed: false, inProgress: true },
            { id: "integration", title: "Integration", order: 4, type: "video", duration: "1h 30min", completed: false, inProgress: false },
        ]
    },
    "linear-algebra": {
        title: "Linear Algebra",
        description: "Explore vectors, matrices, eigenvalues and their applications in data science.",
        category: "Mathematics",
        difficulty: "Intermediate",
        hours: 10,
        image: "https://images.unsplash.com/photo-1509228468518-180dd4864904?w=800",
        modules: [
            { id: "vectors", title: "Vectors and Spaces", order: 1, type: "reading", duration: "50 min", completed: true, inProgress: false },
            { id: "gaussian", title: "Gaussian Elimination", order: 2, type: "video", duration: "1h 10min", completed: false, inProgress: true },
            { id: "matrix-algebra", title: "Matrix Algebra", order: 3, type: "reading", duration: "1h", completed: false, inProgress: false },
            { id: "eigenvectors", title: "Eigenvectors and Eigenvalues", order: 4, type: "video", duration: "1h 25min", completed: false, inProgress: false },
        ]
    }
};

export default async function CoursePage({ params }: { params: Promise<{ courseId: string }> }) {
    const { courseId } = await params;
    const course = COURSES[courseId as keyof typeof COURSES];

    if (!course) {
        return notFound();
    }

    const completedModules = course.modules.filter(m => m.completed).length;
    const progress = Math.round((completedModules / course.modules.length) * 100);

    const getDifficultyColor = (difficulty: string) => {
        switch (difficulty) {
            case "Beginner": return "bg-emerald-100 text-emerald-700";
            case "Intermediate": return "bg-[var(--primary)]/10 text-[var(--primary)]";
            case "Advanced": return "bg-amber-100 text-amber-700";
            default: return "bg-gray-100 text-gray-700";
        }
    };

    return (
        <div className="min-h-screen bg-[var(--background-subtle)]">
            {/* Hero Header */}
            <div className="relative h-64 overflow-hidden">
                <img
                    src={course.image}
                    alt={course.title}
                    className="w-full h-full object-cover"
                />
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
                                    <span className={`px-2 py-1 rounded-md text-xs font-medium ${getDifficultyColor(course.difficulty)}`}>
                                        {course.difficulty}
                                    </span>
                                    <span className="px-2 py-1 rounded-md text-xs font-medium bg-white/20 text-white">
                                        {course.category}
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
                                    {course.modules.length} modules
                                </span>
                                <span className="flex items-center gap-1">
                                    <Clock className="w-4 h-4" />
                                    ~{course.hours} hours
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
                    {course.modules.map((module) => {
                        const isLocked = !module.completed && !module.inProgress && course.modules.findIndex(m => m.id === module.id) > 0;

                        return (
                            <Link
                                key={module.id}
                                href={isLocked ? "#" : `/courses/${courseId}/${module.id}`}
                                className={isLocked ? "cursor-not-allowed" : ""}
                            >
                                <div className={`bg-white rounded-2xl border p-5 transition-all duration-200 ${isLocked
                                    ? "border-[var(--border-subtle)] opacity-60"
                                    : module.completed
                                        ? "border-[var(--success)]/30 hover:shadow-md hover:-translate-y-0.5"
                                        : module.inProgress
                                            ? "border-[var(--primary)] shadow-md ring-1 ring-[var(--primary)]/20"
                                            : "border-[var(--border-subtle)] hover:shadow-md hover:-translate-y-0.5"
                                    }`}>
                                    <div className="flex items-center gap-4">
                                        {/* Module Number / Status Icon */}
                                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg ${module.completed
                                            ? "bg-[var(--success)]/10 text-[var(--success)]"
                                            : module.inProgress
                                                ? "bg-[var(--primary)]/10 text-[var(--primary)]"
                                                : isLocked
                                                    ? "bg-gray-100 text-gray-400"
                                                    : "bg-[var(--primary)]/10 text-[var(--primary)]"
                                            }`}>
                                            {module.completed ? (
                                                <CheckCircle className="w-6 h-6" />
                                            ) : isLocked ? (
                                                <Lock className="w-5 h-5" />
                                            ) : (
                                                module.order
                                            )}
                                        </div>

                                        {/* Module Info */}
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                <h3 className="font-semibold text-lg text-foreground">
                                                    {module.title}
                                                </h3>
                                                {module.inProgress && (
                                                    <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-[var(--primary)]/10 text-[var(--primary)]">
                                                        In Progress
                                                    </span>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-3 text-sm text-[var(--text-muted)]">
                                                <span className="flex items-center gap-1">
                                                    {module.type === 'video' ? (
                                                        <Video className="w-4 h-4" />
                                                    ) : (
                                                        <BookOpen className="w-4 h-4" />
                                                    )}
                                                    {module.type === 'video' ? 'Video' : 'Reading'}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <Clock className="w-4 h-4" />
                                                    {module.duration}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Action Button */}
                                        {!isLocked && (
                                            <Button
                                                className={`rounded-xl px-6 ${module.completed
                                                    ? "bg-[var(--success)] hover:bg-emerald-600"
                                                    : module.inProgress
                                                        ? "bg-[var(--primary)] hover:bg-[var(--primary-hover)]"
                                                        : "bg-[var(--primary)] hover:bg-[var(--primary-hover)]"
                                                    } text-white`}
                                            >
                                                {module.completed ? "Review" : module.inProgress ? "Continue" : "Start"}
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
