"use client";

import { LearningOrbit } from "./LearningOrbit";
import { BookOpen, Video, Clock, Flame, Calendar, GraduationCap } from "lucide-react";
import { motion } from "framer-motion";
import { Progress } from "@/components/ui/progress";
import Link from "next/link";

interface MultimediaCard {
    id: string;
    title: string;
    type: "video" | "reading";
    badges: string[];
    thumbnail: string;
    duration?: string;
}

interface ContinueCard {
    id: string;
    courseTitle: string;
    moduleTitle: string;
    progress: number;
    timeLeft: string;
    href: string;
}

interface UserStats {
    coursesEnrolled: number;
    modulesCompleted: number;
    totalModules: number;
    completionPercentage: number;
}

interface StudentViewProps {
    firstName?: string;
    stats?: UserStats | null;
}

export function StudentView({ firstName = 'there', stats }: StudentViewProps) {

    const continueModules: ContinueCard[] = [
        {
            id: "1",
            courseTitle: "Calculus I",
            moduleTitle: "Integration Techniques",
            progress: 65,
            timeLeft: "15 min left",
            href: "/courses/calculus/integration"
        },
        {
            id: "2",
            courseTitle: "Linear Algebra",
            moduleTitle: "Matrix Operations",
            progress: 42,
            timeLeft: "23 min left",
            href: "/courses/linear-algebra/matrix-algebra"
        },
        {
            id: "3",
            courseTitle: "Quantum Mechanics",
            moduleTitle: "Wave Functions",
            progress: 18,
            timeLeft: "8 min left",
            href: "/courses/quantum-mechanics/wave-functions"
        }
    ];

    const multimodalLibrary: MultimediaCard[] = [
        {
            id: "1",
            title: "Quantum Physics Fundamentals",
            type: "video",
            badges: ["Video Summarized", "Translation Available"],
            thumbnail: "https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?w=400",
            duration: "12:34"
        },
        {
            id: "2",
            title: "Calculus: Integration Techniques",
            type: "reading",
            badges: ["3D Model Included", "AI-Augmented"],
            thumbnail: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400"
        },
        {
            id: "3",
            title: "World History: Renaissance Era",
            type: "video",
            badges: ["Video Summarized", "Interactive Quiz"],
            thumbnail: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=400",
            duration: "8:45"
        },
        {
            id: "4",
            title: "Chemistry: Organic Compounds",
            type: "reading",
            badges: ["Translation Available", "3D Model Included"],
            thumbnail: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=400"
        }
    ];

    return (
        <div className="min-h-screen bg-[var(--background-subtle)]">
            {/* Welcome Header Section */}
            <div className="bg-white border-b">
                <div className="container mx-auto px-6 py-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <h1 className="text-4xl font-bold text-foreground mb-2">
                            Welcome back, <span className="text-[var(--primary)]">{firstName}!</span>
                        </h1>
                        <p className="text-[var(--text-muted)] text-lg">
                            Continue your learning journey and achieve your goals.
                        </p>
                    </motion.div>
                </div>
            </div>

            <div className="container mx-auto px-6 py-8">
                {/* Stats Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    {/* Courses Enrolled */}
                    <motion.div
                        className="bg-white rounded-2xl p-6 border border-[var(--border-subtle)] shadow-sm hover:shadow-md transition-shadow"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                    >
                        <div className="flex items-start justify-between mb-4">
                            <div>
                                <p className="text-sm text-[var(--text-muted)] mb-1">Courses Enrolled</p>
                                <p className="text-4xl font-bold text-foreground">{stats?.coursesEnrolled ?? '—'}</p>
                            </div>
                            <div className="p-3 bg-[var(--primary)]/10 rounded-xl">
                                <BookOpen className="w-6 h-6 text-[var(--primary)]" />
                            </div>
                        </div>
                    </motion.div>

                    {/* Modules Completed */}
                    <motion.div
                        className="bg-white rounded-2xl p-6 border border-[var(--border-subtle)] shadow-sm hover:shadow-md transition-shadow"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.15 }}
                    >
                        <div className="flex items-start justify-between mb-2">
                            <div>
                                <p className="text-sm text-[var(--text-muted)] mb-1">Modules Completed</p>
                                <p className="text-4xl font-bold text-foreground">{stats?.modulesCompleted ?? 0}<span className="text-xl text-[var(--text-muted)]">/{stats?.totalModules ?? 0}</span></p>
                            </div>
                            <div className="relative w-16 h-16">
                                <svg className="w-16 h-16 transform -rotate-90">
                                    <circle
                                        cx="32"
                                        cy="32"
                                        r="28"
                                        stroke="var(--border-subtle)"
                                        strokeWidth="6"
                                        fill="none"
                                    />
                                    <circle
                                        cx="32"
                                        cy="32"
                                        r="28"
                                        stroke="var(--primary)"
                                        strokeWidth="6"
                                        fill="none"
                                        strokeLinecap="round"
                                        strokeDasharray={`${(stats?.completionPercentage ?? 0) * 1.76} 176`}
                                    />
                                </svg>
                                <span className="absolute inset-0 flex items-center justify-center text-sm font-semibold text-[var(--primary)]">
                                    {stats?.completionPercentage ?? 0}%
                                </span>
                            </div>
                        </div>
                    </motion.div>

                    {/* Current Streak */}
                    <motion.div
                        className="bg-white rounded-2xl p-6 border border-[var(--border-subtle)] shadow-sm hover:shadow-md transition-shadow"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        <div className="flex items-start justify-between mb-4">
                            <div>
                                <p className="text-sm text-[var(--text-muted)] mb-1">Current Streak</p>
                                <p className="text-4xl font-bold text-foreground">12 <span className="text-xl font-normal text-[var(--text-muted)]">days</span></p>
                            </div>
                            <div className="p-3 bg-amber-100 rounded-xl">
                                <Flame className="w-6 h-6 text-amber-500" />
                            </div>
                        </div>
                    </motion.div>

                    {/* Next Quiz */}
                    <motion.div
                        className="bg-white rounded-2xl p-6 border border-[var(--border-subtle)] shadow-sm hover:shadow-md transition-shadow"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.25 }}
                    >
                        <div className="flex items-start justify-between mb-4">
                            <div>
                                <p className="text-sm text-[var(--text-muted)] mb-1">Next Quiz</p>
                                <p className="text-2xl font-bold text-foreground">Calculus I</p>
                            </div>
                            <div className="p-3 bg-[var(--primary)]/10 rounded-xl">
                                <Calendar className="w-6 h-6 text-[var(--primary)]" />
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Pick up where you left off */}
                <motion.div
                    className="mb-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                >
                    <h2 className="text-2xl font-bold text-foreground mb-4">Pick up where you left off</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {continueModules.map((module, index) => (
                            <Link key={module.id} href={module.href}>
                                <motion.div
                                    className="bg-white rounded-2xl p-5 border border-[var(--border-subtle)] shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-200 cursor-pointer group"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3, delay: 0.35 + index * 0.05 }}
                                >
                                    <p className="text-sm text-[var(--text-muted)] mb-1">{module.courseTitle}</p>
                                    <h3 className="text-lg font-semibold text-foreground mb-3 group-hover:text-[var(--primary)] transition-colors">
                                        {module.moduleTitle}
                                    </h3>
                                    <div className="mb-3">
                                        <Progress value={module.progress} className="h-2 bg-[var(--border-subtle)]" />
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs text-[var(--text-muted)] flex items-center gap-1">
                                            <Clock className="w-3 h-3" />
                                            {module.timeLeft}
                                        </span>
                                        <button className="px-4 py-1.5 bg-[var(--primary)] text-white text-sm font-medium rounded-full hover:bg-[var(--primary-hover)] transition-colors">
                                            Continue
                                        </button>
                                    </div>
                                </motion.div>
                            </Link>
                        ))}
                    </div>
                </motion.div>

                {/* Enrolled Courses */}
                <LearningOrbit />

                {/* Multimodal Library */}
                <motion.div
                    className="bg-white border border-[var(--border-subtle)] rounded-2xl p-6 shadow-sm"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                >
                    <div className="flex items-center gap-2 mb-6">
                        <GraduationCap className="w-5 h-5 text-[var(--primary)]" />
                        <h2 className="text-xl font-semibold">Multimodal Library</h2>
                        <span className="ml-auto text-xs text-[var(--text-muted)]">
                            {multimodalLibrary.length} resources available
                        </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {multimodalLibrary.map((item, index) => (
                            <motion.div
                                key={item.id}
                                className="group relative bg-white border border-[var(--border-subtle)] rounded-xl overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-200 cursor-pointer"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3, delay: 0.55 + index * 0.05 }}
                            >
                                {/* Thumbnail */}
                                <div className="relative h-32 bg-muted overflow-hidden">
                                    <img
                                        src={item.thumbnail}
                                        alt={item.title}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                    />
                                    {item.duration && (
                                        <div className="absolute bottom-2 right-2 bg-black/80 text-white px-2 py-0.5 rounded text-[10px] font-mono backdrop-blur-sm">
                                            {item.duration}
                                        </div>
                                    )}
                                    <div className="absolute top-2 left-2">
                                        {item.type === "video" ? (
                                            <div className="bg-[var(--accent)] text-white p-1.5 rounded-md shadow-lg">
                                                <Video className="w-3 h-3" />
                                            </div>
                                        ) : (
                                            <div className="bg-[var(--primary)] text-white p-1.5 rounded-md shadow-lg">
                                                <BookOpen className="w-3 h-3" />
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-4">
                                    <h3 className="font-semibold mb-2 line-clamp-2 text-sm group-hover:text-[var(--primary)] transition-colors">
                                        {item.title}
                                    </h3>
                                    <div className="flex flex-wrap gap-1">
                                        {item.badges.map((badge, i) => (
                                            <span
                                                key={i}
                                                className="px-1.5 py-0.5 bg-[var(--background-subtle)] text-[var(--text-muted)] text-[10px] rounded-md border border-[var(--border-subtle)]"
                                            >
                                                {badge}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
