"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Progress } from "@/components/ui/progress";
import { BookOpen, Clock } from "lucide-react";

interface CourseWithProgress {
    id: string;
    title: string;
    description: string;
    iconName: string;
    moduleCount: number;
    completedCount: number;
    progress: number; // 0-100, from database
}

// Static metadata for presentation (images, categories, etc.)
const COURSE_META: Record<string, { category: string; difficulty: string; image: string }> = {
    "calculus": {
        category: "Mathematics",
        difficulty: "Intermediate",
        image: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400",
    },
    "linear-algebra": {
        category: "Mathematics",
        difficulty: "Intermediate",
        image: "https://images.unsplash.com/photo-1509228468518-180dd4864904?w=400",
    },
    "quantum": {
        category: "Physics",
        difficulty: "Advanced",
        image: "https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?w=400",
    },
    "algorithms": {
        category: "Computer Science",
        difficulty: "Intermediate",
        image: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=400",
    },
};

const DEFAULT_META = {
    category: "Course",
    difficulty: "Intermediate",
    image: "https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=400",
};

interface LearningOrbitProps {
    courseProgress?: CourseWithProgress[];
}

export function LearningOrbit({ courseProgress = [] }: LearningOrbitProps) {
    const getDifficultyColor = (difficulty: string) => {
        switch (difficulty) {
            case "Beginner": return "bg-emerald-100 text-emerald-700";
            case "Intermediate": return "bg-[var(--primary)]/10 text-[var(--primary)]";
            case "Advanced": return "bg-amber-100 text-amber-700";
            default: return "bg-gray-100 text-gray-700";
        }
    };

    if (courseProgress.length === 0) {
        return (
            <motion.div
                className="mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
            >
                <h2 className="text-2xl font-bold text-foreground mb-4">Enrolled Courses</h2>
                <div className="text-center py-8 text-[var(--text-muted)]">
                    <p>No courses available yet.</p>
                </div>
            </motion.div>
        );
    }

    return (
        <motion.div
            className="mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
        >
            <h2 className="text-2xl font-bold text-foreground mb-4">Enrolled Courses</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {courseProgress.map((course, index) => {
                    const meta = COURSE_META[course.id] || DEFAULT_META;
                    const estimatedHours = Math.round(course.moduleCount * 0.75);

                    return (
                        <Link key={course.id} href={`/courses/${course.id}`}>
                            <motion.div
                                className="bg-white rounded-2xl border border-[var(--border-subtle)] shadow-sm overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-200 cursor-pointer group"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3, delay: 0.45 + index * 0.05 }}
                            >
                                {/* Card Header with Image */}
                                <div className="relative h-36 overflow-hidden">
                                    <img
                                        src={meta.image}
                                        alt={course.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                    <div className="absolute top-3 left-3 flex gap-2">
                                        <span className={`px-2 py-1 rounded-md text-xs font-medium ${getDifficultyColor(meta.difficulty)}`}>
                                            {meta.difficulty}
                                        </span>
                                        <span className="px-2 py-1 rounded-md text-xs font-medium bg-white/90 text-gray-700">
                                            {meta.category}
                                        </span>
                                    </div>
                                </div>

                                {/* Card Content */}
                                <div className="p-5">
                                    <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-[var(--primary)] transition-colors">
                                        {course.title}
                                    </h3>
                                    <p className="text-sm text-[var(--text-muted)] mb-4 line-clamp-2">
                                        {course.description}
                                    </p>

                                    {/* Stats Row */}
                                    <div className="flex items-center gap-4 text-xs text-[var(--text-muted)] mb-4">
                                        <span className="flex items-center gap-1">
                                            <BookOpen className="w-3.5 h-3.5" />
                                            {course.moduleCount} modules
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Clock className="w-3.5 h-3.5" />
                                            ~{estimatedHours} hours
                                        </span>
                                    </div>

                                    {/* Dynamic Progress Bar */}
                                    {course.progress > 0 ? (
                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between">
                                                <Progress value={course.progress} className="flex-1 h-2 bg-[var(--border-subtle)] mr-3" />
                                                <span className="text-sm font-medium text-[var(--text-muted)]">{course.progress}%</span>
                                            </div>
                                            <button className="w-full py-2.5 bg-[var(--primary)] text-white text-sm font-medium rounded-xl hover:bg-[var(--primary-hover)] transition-colors">
                                                Continue
                                            </button>
                                        </div>
                                    ) : (
                                        <button className="w-full py-2.5 bg-[var(--primary)] text-white text-sm font-medium rounded-xl hover:bg-[var(--primary-hover)] transition-colors">
                                            Start Course
                                        </button>
                                    )}
                                </div>
                            </motion.div>
                        </Link>
                    );
                })}
            </div>
        </motion.div>
    );
}
