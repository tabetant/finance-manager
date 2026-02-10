"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, BookOpen, CheckCircle, ExternalLink, XCircle } from "lucide-react";
import Link from "next/link";
import { useState, useRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import { motion, useScroll, useSpring, AnimatePresence } from "framer-motion";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { ModuleCompletionToggle } from "./ModuleCompletionToggle";
import { saveQuizScore } from "@/app/actions/quiz";

type QuizQuestion = {
    question: string;
    options: string[];
    correctAnswer: string;
};

interface ModuleContentProps {
    courseId: string;
    moduleId: string;
    moduleTitle: string;
    contentMarkdown: string;
    youtubeUrl?: string | null;
    textbookUrl?: string | null;
    quizzes: QuizQuestion[];
    videoUrl?: string | null;
    initialCompleted?: boolean;
}

export default function ModuleContent({
    courseId,
    moduleId,
    moduleTitle,
    contentMarkdown,
    youtubeUrl,
    textbookUrl,
    quizzes,
    initialCompleted = false
}: ModuleContentProps) {
    const [showQuiz, setShowQuiz] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({ container: scrollRef });
    const scaleX = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    });

    return (
        <div className="container mx-auto h-[calc(100vh-4rem)] overflow-hidden flex flex-col lg:flex-row relative">
            {/* Reading Progress Bar */}
            <motion.div
                className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[var(--primary)] to-[var(--primary-light)] z-50 origin-left"
                style={{ scaleX }}
            />

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col h-full overflow-hidden border-r bg-background">
                <div className="p-4 border-b flex flex-col gap-2 bg-[var(--primary)]/5">
                    {/* Breadcrumbs */}
                    <div className="flex items-center text-xs text-[var(--text-muted)] gap-2 mb-1">
                        <Link href="/dashboard" className="hover:text-[var(--primary)] transition-colors">Courses</Link>
                        <span>/</span>
                        <Link href={`/courses/${courseId}`} className="hover:text-[var(--primary)] transition-colors capitalize">{courseId.replace('-', ' ')}</Link>
                        <span>/</span>
                        <span className="font-semibold text-[var(--primary)] truncate max-w-[200px]">{moduleTitle}</span>
                    </div>

                    <div className="flex items-center gap-4">
                        <Link href={`/courses/${courseId}`}>
                            <Button variant="ghost" size="icon" className="hover:bg-[var(--primary)]/10 text-[var(--primary)]">
                                <ArrowLeft className="w-5 h-5" />
                            </Button>
                        </Link>
                        <div className="flex-1">
                            <h1 className="text-xl font-bold text-[var(--primary)] flex items-center gap-2">
                                {moduleTitle}
                            </h1>
                        </div>
                        <ModuleCompletionToggle
                            moduleId={moduleId}
                            courseId={courseId}
                            initialCompleted={initialCompleted}
                        />
                    </div>
                </div>

                <ScrollArea className="flex-1 p-8 h-[calc(100vh-200px)]" viewportRef={scrollRef}>
                    <div className="prose prose-blue dark:prose-invert max-w-none">
                        <ReactMarkdown
                            remarkPlugins={[remarkMath]}
                            rehypePlugins={[rehypeKatex]}
                        >
                            {contentMarkdown || "No content available."}
                        </ReactMarkdown>
                    </div>

                    <div className="mt-12 mb-8">
                        <Separator className="mb-8" />
                        <h2 className="text-2xl font-bold mb-4 text-[var(--primary)]">Knowledge Check</h2>
                        {!showQuiz ? (
                            <div className="bg-[var(--primary)]/5 p-8 rounded-2xl text-center border border-[var(--primary)]/20">
                                <p className="mb-4 text-[var(--text-muted)]">Ready to test your understanding of this module?</p>
                                <Button onClick={() => setShowQuiz(true)} className="bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white rounded-xl px-8">
                                    Start Quiz
                                </Button>
                            </div>
                        ) : (
                            <QuizInterface quizzes={quizzes} moduleId={moduleId} courseId={courseId} />
                        )}
                    </div>
                </ScrollArea>
            </div>

            {/* Sidebar / Resources */}
            <div className="w-full lg:w-80 bg-white p-4 border-l overflow-y-auto h-[calc(100vh-4rem)]">
                <h3 className="font-semibold mb-4 flex items-center gap-2 text-[var(--primary)]">
                    <BookOpen className="w-4 h-4" /> Recommended Resources
                </h3>

                <div className="space-y-6">
                    {/* Video Embed */}
                    {youtubeUrl && (
                        <div className="space-y-2">
                            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                Video Lecture
                            </label>
                            <div className="aspect-video rounded-lg overflow-hidden border shadow-sm bg-black">
                                <iframe
                                    src={youtubeUrl}
                                    className="w-full h-full"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                />
                            </div>
                        </div>
                    )}

                    <Separator />

                    {/* Textbook Link */}
                    {textbookUrl && (
                        <div className="space-y-2">
                            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                Reading Material
                            </label>
                            <Link href={textbookUrl} target="_blank" rel="noopener noreferrer">
                                <Card className="hover:bg-[var(--primary)]/5 transition-colors border-l-4 border-l-[var(--primary)]">
                                    <CardContent className="p-3 flex items-start gap-3">
                                        <div className="p-2 bg-[var(--primary)]/10 rounded-md">
                                            <BookOpen className="w-4 h-4 text-[var(--primary)]" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium">Textbook Resource</p>
                                            <p className="text-xs text-muted-foreground flex items-center gap-1">
                                                External Link <ExternalLink className="w-3 h-3" />
                                            </p>
                                        </div>
                                    </CardContent>
                                </Card>
                            </Link>
                        </div>
                    )}
                </div>

                <Separator className="my-6" />

                {/* Key Concepts (Pedagogical Guidance) */}
                <div>
                    <h3 className="font-semibold mb-4 flex items-center gap-2 text-[var(--primary)]">
                        <BookOpen className="w-4 h-4" /> Key Concepts
                    </h3>
                    <div className="space-y-3">
                        <TooltipProvider>
                            <div className="flex flex-wrap gap-2">
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <div className="cursor-help px-3 py-1.5 bg-[var(--primary)]/10 text-[var(--primary)] rounded-lg text-xs font-medium border border-[var(--primary)]/20 hover:bg-[var(--primary)]/20 transition-colors">
                                            Eigenvector
                                        </div>
                                    </TooltipTrigger>
                                    <TooltipContent className="max-w-xs bg-[var(--primary)] text-white border-[var(--primary)]">
                                        <p>A non-zero vector that changes at most by a scalar factor when that linear transformation is applied to it.</p>
                                    </TooltipContent>
                                </Tooltip>

                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <div className="cursor-help px-3 py-1.5 bg-[var(--primary)]/10 text-[var(--primary)] rounded-lg text-xs font-medium border border-[var(--primary)]/20 hover:bg-[var(--primary)]/20 transition-colors">
                                            Linear Transformation
                                        </div>
                                    </TooltipTrigger>
                                    <TooltipContent className="max-w-xs bg-[var(--primary)] text-white border-[var(--primary)]">
                                        <p>A function between two vector spaces that preserves the operations of vector addition and scalar multiplication.</p>
                                    </TooltipContent>
                                </Tooltip>
                            </div>
                        </TooltipProvider>
                    </div>
                </div>
            </div>
        </div>
    );
}

function QuizInterface({ quizzes, moduleId, courseId }: { quizzes: QuizQuestion[]; moduleId: string; courseId: string }) {
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [score, setScore] = useState(0);
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isComplete, setIsComplete] = useState(false);

    if (!quizzes || quizzes.length === 0) {
        return <div className="text-muted-foreground">No quiz questions available for this module.</div>;
    }

    const question = quizzes[currentQuestion];

    const handleSubmit = () => {
        if (!selectedOption) return;
        setIsSubmitted(true);
        if (selectedOption === question.correctAnswer) {
            setScore(score + 1);
        }
    };

    const handleNext = () => {
        if (currentQuestion < quizzes.length - 1) {
            setCurrentQuestion(currentQuestion + 1);
            setSelectedOption(null);
            setIsSubmitted(false);
        } else {
            setIsComplete(true);
            // Save quiz score
            const finalScore = selectedOption === question.correctAnswer ? score + 1 : score;
            saveQuizScore(moduleId, courseId, finalScore, quizzes.length).catch(console.error);
        }
    };

    if (isComplete) {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{
                    opacity: 1,
                    scale: 1,
                    boxShadow: ["0 0 0 0 rgba(99, 102, 241, 0)", "0 0 0 20px rgba(99, 102, 241, 0)"],
                }}
                transition={{
                    duration: 0.5,
                    boxShadow: {
                        duration: 1.5,
                        repeat: Infinity,
                        repeatType: "loop"
                    }
                }}
                className="bg-[var(--success)]/10 border border-[var(--success)]/30 rounded-2xl p-8 text-center"
            >
                <div className="relative inline-block">
                    <CheckCircle className="w-12 h-12 text-[var(--success)] mx-auto mb-4 relative z-10" />
                    <motion.div
                        className="absolute inset-0 bg-[var(--primary)] rounded-full z-0"
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 2, opacity: 0 }}
                        transition={{ duration: 1, repeat: Infinity }}
                    />
                </div>
                <h3 className="text-xl font-bold text-[var(--success)] mb-2">Quiz Complete!</h3>
                <p className="text-[var(--success)] mb-4">You scored {score} out of {quizzes.length}</p>
                <div className="flex justify-center gap-4">
                    <Button onClick={() => window.location.reload()} variant="outline" className="rounded-xl">
                        Retake Quiz
                    </Button>
                    <Link href="/dashboard">
                        <Button className="bg-[var(--primary)] text-white hover:bg-[var(--primary-hover)] rounded-xl">
                            Back to Dashboard
                        </Button>
                    </Link>
                </div>
            </motion.div>
        );
    }

    return (
        <div className="bg-card border rounded-xl p-6 shadow-sm overflow-hidden">
            <div className="flex justify-between items-center mb-6">
                <span className="text-sm font-medium text-muted-foreground">Question {currentQuestion + 1} of {quizzes.length}</span>
                <span className="text-sm font-medium text-[var(--worlded-blue)]">Score: {score}</span>
            </div>

            <AnimatePresence mode="wait">
                <motion.div
                    key={currentQuestion}
                    initial={{ x: 20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: -20, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    <h3 className="text-lg font-semibold mb-6">{question.question}</h3>

                    <div className="space-y-3 mb-6">
                        {question.options.map((option, idx) => {
                            const isSelected = selectedOption === option;

                            let btnClass = "w-full justify-start h-auto py-4 px-6 text-left hover:bg-[var(--primary)]/5 transition-colors border border-[var(--border-subtle)] rounded-xl relative overflow-hidden";
                            let animate = {};

                            if (isSubmitted) {
                                if (option === question.correctAnswer) {
                                    btnClass = "w-full justify-start h-auto py-4 px-6 text-left bg-[var(--success)]/10 border-[var(--success)] text-[var(--success)] ring-1 ring-[var(--success)] rounded-xl";
                                    animate = { scale: [1, 1.02, 1] }; // Pulse
                                } else if (isSelected) {
                                    btnClass = "w-full justify-start h-auto py-4 px-6 text-left bg-red-50 border-red-500 text-red-900 rounded-xl";
                                    animate = { x: [-5, 5, -5, 5, 0] }; // Shake
                                }
                            } else if (isSelected) {
                                btnClass = "w-full justify-start h-auto py-4 px-6 text-left bg-[var(--primary)]/5 border-[var(--primary)] text-[var(--primary)] ring-1 ring-[var(--primary)] rounded-xl";
                            }

                            return (
                                <motion.button
                                    key={idx}
                                    className={`relative flex items-center rounded-lg text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${btnClass}`}
                                    onClick={() => !isSubmitted && setSelectedOption(option)}
                                    disabled={isSubmitted}
                                    animate={animate}
                                    transition={{ duration: 0.4 }}
                                >
                                    {option}
                                    {isSubmitted && option === question.correctAnswer && <CheckCircle className="ml-auto w-5 h-5 text-[var(--success)]" />}
                                    {isSubmitted && isSelected && option !== question.correctAnswer && <XCircle className="ml-auto w-5 h-5 text-red-600" />}
                                </motion.button>
                            );
                        })}
                    </div>

                    {isSubmitted && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-[var(--primary)]/5 border border-[var(--primary)]/20 rounded-xl p-4 mb-6"
                        >
                            <h4 className="font-semibold text-[var(--primary)] flex items-center gap-2 mb-1">
                                <BookOpen className="w-4 h-4" />
                                Why is this correct?
                            </h4>
                            <p className="text-sm text-[var(--primary)]/80">
                                This answer is correct because it follows the fundamental theorem of calculus which links the concept of differentiating a function with integrating a function.
                                {/* In a real app, this explanation would come from the database/AI metadata */}
                            </p>
                        </motion.div>
                    )}
                </motion.div>
            </AnimatePresence>

            <div className="flex justify-end">
                {!isSubmitted ? (
                    <Button
                        onClick={handleSubmit}
                        disabled={!selectedOption}
                        className="bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white rounded-xl"
                    >
                        Submit Answer
                    </Button>
                ) : (
                    <Button
                        onClick={handleNext}
                        className="bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white rounded-xl"
                    >
                        {currentQuestion < quizzes.length - 1 ? "Next Question" : "Finish Quiz"}
                    </Button>
                )}
            </div>
        </div>
    );
}
