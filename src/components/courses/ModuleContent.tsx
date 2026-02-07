"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, BookOpen, CheckCircle, ExternalLink, PlayCircle, XCircle } from "lucide-react";
import Link from "next/link";
import { useState, useRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";
import { motion, useScroll, useSpring } from "framer-motion";

type QuizQuestion = {
    question: string;
    options: string[];
    correctAnswer: string;
};

interface ModuleContentProps {
    courseId: string;
    moduleTitle: string;
    contentMarkdown: string;
    youtubeUrl?: string | null;
    textbookUrl?: string | null;
    quizzes: QuizQuestion[];
    videoUrl?: string | null;
}

export default function ModuleContent({
    courseId,
    moduleTitle,
    contentMarkdown,
    youtubeUrl,
    textbookUrl,
    quizzes
}: ModuleContentProps) {
    const [showQuiz, setShowQuiz] = useState(false);
    const scrollRef = useRef(null);
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
                className="absolute top-0 left-0 right-0 h-1 bg-[var(--worlded-orange)] z-50 origin-left"
                style={{ scaleX }}
            />

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col h-full overflow-hidden border-r bg-background">
                <div className="p-4 border-b flex items-center gap-4 bg-[var(--worlded-blue)]/5">
                    <Link href={`/courses/${courseId}`}>
                        <Button variant="ghost" size="icon" className="hover:bg-[var(--worlded-blue)]/10 text-[var(--worlded-blue)]">
                            <ArrowLeft className="w-5 h-5" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-xl font-bold text-[var(--worlded-blue)]">{moduleTitle}</h1>
                        <p className="text-sm text-muted-foreground capitalize">{courseId.replace('-', ' ')}</p>
                    </div>
                </div>

                <ScrollArea className="flex-1 p-8" ref={scrollRef}>
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
                        <h2 className="text-2xl font-bold mb-4 text-[var(--worlded-blue)]">Knowledge Check</h2>
                        {!showQuiz ? (
                            <div className="bg-muted/30 p-8 rounded-xl text-center">
                                <p className="mb-4 text-muted-foreground">Ready to test your understanding of this module?</p>
                                <Button onClick={() => setShowQuiz(true)} className="bg-[var(--worlded-orange)] hover:bg-orange-600 text-white">
                                    Start Quiz
                                </Button>
                            </div>
                        ) : (
                            <QuizInterface quizzes={quizzes} />
                        )}
                    </div>
                </ScrollArea>
            </div>

            {/* Sidebar / Resources */}
            <div className="w-full lg:w-80 bg-muted/30 p-4 border-l overflow-y-auto">
                <h3 className="font-semibold mb-4 flex items-center gap-2 text-[var(--worlded-blue)]">
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
                                <Card className="hover:bg-accent transition-colors border-l-4 border-l-[var(--worlded-blue)]">
                                    <CardContent className="p-3 flex items-start gap-3">
                                        <div className="p-2 bg-blue-100 rounded-md">
                                            <BookOpen className="w-4 h-4 text-[var(--worlded-blue)]" />
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
            </div>
        </div>
    );
}

function QuizInterface({ quizzes }: { quizzes: QuizQuestion[] }) {
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
        }
    };

    if (isComplete) {
        return (
            <div className="bg-green-50 border border-green-200 rounded-xl p-8 text-center animate-in fade-in zoom-in duration-300">
                <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-green-800 mb-2">Quiz Complete!</h3>
                <p className="text-green-700 mb-4">You scored {score} out of {quizzes.length}</p>
                <div className="flex justify-center gap-4">
                    <Button onClick={() => window.location.reload()} variant="outline">
                        Retake Quiz
                    </Button>
                    <Link href="/dashboard">
                        <Button className="bg-[var(--worlded-blue)] text-white hover:bg-blue-800">
                            Back to Dashboard
                        </Button>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-card border rounded-xl p-6 shadow-sm">
            <div className="flex justify-between items-center mb-6">
                <span className="text-sm font-medium text-muted-foreground">Question {currentQuestion + 1} of {quizzes.length}</span>
                <span className="text-sm font-medium text-[var(--worlded-blue)]">Score: {score}</span>
            </div>

            <h3 className="text-lg font-semibold mb-6">{question.question}</h3>

            <div className="space-y-3 mb-6">
                {question.options.map((option, idx) => {
                    const isSelected = selectedOption === option;
                    const isCorrect = option === question.correctAnswer;

                    let btnClass = "w-full justify-start h-auto py-4 px-6 text-left hover:bg-muted transition-colors";

                    if (isSubmitted) {
                        if (option === question.correctAnswer) {
                            btnClass = "w-full justify-start h-auto py-4 px-6 text-left bg-green-100 border-green-500 text-green-800";
                        } else if (isSelected) {
                            btnClass = "w-full justify-start h-auto py-4 px-6 text-left bg-red-100 border-red-500 text-red-800";
                        }
                    } else if (isSelected) {
                        btnClass = "w-full justify-start h-auto py-4 px-6 text-left bg-[var(--worlded-blue)] text-white hover:bg-[var(--worlded-blue)]/90";
                    }

                    return (
                        <Button
                            key={idx}
                            variant="outline"
                            className={btnClass}
                            onClick={() => !isSubmitted && setSelectedOption(option)}
                            disabled={isSubmitted}
                        >
                            {option}
                            {isSubmitted && option === question.correctAnswer && <CheckCircle className="ml-auto w-5 h-5 text-green-600" />}
                            {isSubmitted && isSelected && option !== question.correctAnswer && <XCircle className="ml-auto w-5 h-5 text-red-600" />}
                        </Button>
                    );
                })}
            </div>

            <div className="flex justify-end">
                {!isSubmitted ? (
                    <Button
                        onClick={handleSubmit}
                        disabled={!selectedOption}
                        className="bg-[var(--worlded-orange)] hover:bg-orange-600 text-white"
                    >
                        Submit Answer
                    </Button>
                ) : (
                    <Button
                        onClick={handleNext}
                        className="bg-[var(--worlded-blue)] hover:bg-blue-800 text-white"
                    >
                        {currentQuestion < quizzes.length - 1 ? "Next Question" : "Finish Quiz"}
                    </Button>
                )}
            </div>
        </div>
    );
}
