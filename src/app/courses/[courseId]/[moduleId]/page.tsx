"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, BookOpen, CheckCircle, ExternalLink, PlayCircle, XCircle } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { useState } from "react";
import ReactMarkdown from "react-markdown";

// Mock Data matching the Seed Script for immediate UI validation
const MODULE_CONTENT = {
    "calculus": {
        "limits": {
            id: "limits",
            title: "Limits and Continuity",
            content: `# Limits and Continuity\n\n**Limits** are the foundational building block of calculus... (See seed for full content)`,
            youtube: "https://www.youtube.com/embed/kfF40MiS7zA",
            textbook: "https://openstax.org/books/calculus-volume-1/pages/2-2-the-limit-of-a-function",
            quizzes: [
                { id: "q1", question: "What condition is NOT required for a function to be continuous at x=c?", options: ["f(c) is defined", "Limit exists as x approaches c", "The derivative exists at c", "The limit equals f(c)"], correct: "The derivative exists at c" },
                { id: "q2", question: "If the limit from the left does not equal the limit from the right, what exists at that point?", options: ["A jump discontinuity", "A hole", "A vertical asymptote", "Continuous point"], correct: "A jump discontinuity" },
                { id: "q3", question: "Can a limit exist at a point where the function is undefined?", options: ["Yes", "No"], correct: "Yes" }
            ]
        },
        "derivatives": {
            id: "derivatives",
            title: "Derivatives",
            content: `# Differentiation Rules\n\nFinding derivatives using the limit definition is tedious...`,
            youtube: "https://www.youtube.com/embed/9vKqVkMQHKk",
            textbook: "https://openstax.org/books/calculus-volume-1/pages/3-1-defining-the-derivative",
            quizzes: [
                { id: "q1", question: "What is the derivative of x^5?", options: ["5x^4", "x^4", "5x^5", "4x^5"], correct: "5x^4" },
                { id: "q2", question: "Which rule is used for f(x) = u(x) * v(x)?", options: ["Chain Rule", "Product Rule", "Quotient Rule", "Power Rule"], correct: "Product Rule" },
                { id: "q3", question: "What is the derivative of a constant?", options: ["7", "1", "0", "Undefined"], correct: "0" }
            ]
        }
    },
    // Mocking Linear Algebra similarly for UI dev purposes
    "linear-algebra": {
        "vectors": {
            id: "vectors",
            title: "Vectors and Spaces",
            content: `# Introduction to Vectors\n\nIn linear algebra, a **vector** is an object...`,
            youtube: "",
            textbook: "https://openstax.org/books/calculus-volume-3/pages/2-1-vectors-in-the-plane",
            quizzes: [
                { id: "q1", question: "A vector is defined by which two properties?", options: ["Mass and Velocity", "Magnitude and Direction", "Length and Width"], correct: "Magnitude and Direction" },
                { id: "q2", question: "In R2, how many components does a vector have?", options: ["1", "2", "3", "Infinite"], correct: "2" },
                { id: "q3", question: "Vectors are typically represented as:", options: ["Circles", "Arrows", "Points"], correct: "Arrows" }
            ]
        }
    }
} as const;

export default function ModulePage({ params }: { params: { courseId: string; moduleId: string } }) {
    const { courseId, moduleId } = params;

    // In a real app, use `await db.select()...` here
    const course = MODULE_CONTENT[courseId as keyof typeof MODULE_CONTENT];
    // @ts-ignore - Quick mock data access
    const moduleData = course ? course[moduleId as keyof typeof course] : null;

    if (!moduleData) {
        return notFound();
    }

    const [showQuiz, setShowQuiz] = useState(false);

    return (
        <div className="container mx-auto h-[calc(100vh-4rem)] overflow-hidden flex flex-col lg:flex-row">
            {/* Main Content Area */}
            <div className="flex-1 flex flex-col h-full overflow-hidden border-r bg-background">
                <div className="p-4 border-b flex items-center gap-4 bg-[var(--worlded-blue)]/5">
                    <Link href={`/courses/${courseId}`}>
                        <Button variant="ghost" size="icon" className="hover:bg-[var(--worlded-blue)]/10 text-[var(--worlded-blue)]">
                            <ArrowLeft className="w-5 h-5" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-xl font-bold text-[var(--worlded-blue)]">{moduleData.title}</h1>
                        <p className="text-sm text-muted-foreground capitalize">{courseId.replace('-', ' ')}</p>
                    </div>
                </div>

                <ScrollArea className="flex-1 p-8">
                    <div className="prose prose-blue dark:prose-invert max-w-none">
                        <ReactMarkdown>
                            {moduleData.content}
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
                            <QuizInterface quizzes={moduleData.quizzes} />
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
                    {moduleData.youtube && (
                        <div className="space-y-2">
                            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                Video Lecture
                            </label>
                            <div className="aspect-video rounded-lg overflow-hidden border shadow-sm bg-black">
                                <iframe
                                    src={moduleData.youtube}
                                    className="w-full h-full"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                />
                            </div>
                        </div>
                    )}

                    <Separator />

                    {/* Textbook Link */}
                    {moduleData.textbook && (
                        <div className="space-y-2">
                            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                Reading Material
                            </label>
                            <Link href={moduleData.textbook} target="_blank" rel="noopener noreferrer">
                                <Card className="hover:bg-accent transition-colors border-l-4 border-l-[var(--worlded-blue)]">
                                    <CardContent className="p-3 flex items-start gap-3">
                                        <div className="p-2 bg-blue-100 rounded-md">
                                            <BookOpen className="w-4 h-4 text-[var(--worlded-blue)]" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium">OpenStax Calculus</p>
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

function QuizInterface({ quizzes }: { quizzes: any[] }) {
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [score, setScore] = useState(0);
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [isComplete, setIsComplete] = useState(false);

    const handleAnswer = (option: string) => {
        setSelectedOption(option);
        if (option === quizzes[currentQuestion].correct) {
            setScore(score + 1);
        }

        setTimeout(() => {
            if (currentQuestion < quizzes.length - 1) {
                setCurrentQuestion(currentQuestion + 1);
                setSelectedOption(null);
            } else {
                setIsComplete(true);
            }
        }, 1000);
    };

    if (isComplete) {
        return (
            <div className="bg-green-50 border border-green-200 rounded-xl p-8 text-center">
                <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-green-800 mb-2">Quiz Complete!</h3>
                <p className="text-green-700">You scored {score} out of {quizzes.length}</p>
                <Button onClick={() => window.location.reload()} variant="outline" className="mt-4">
                    Retake Quiz
                </Button>
            </div>
        );
    }

    const question = quizzes[currentQuestion];

    return (
        <div className="bg-card border rounded-xl p-6 shadow-sm">
            <div className="flex justify-between items-center mb-6">
                <span className="text-sm font-medium text-muted-foreground">Question {currentQuestion + 1} of {quizzes.length}</span>
                <span className="text-sm font-medium text-[var(--worlded-blue)]">Score: {score}</span>
            </div>

            <h3 className="text-lg font-semibold mb-6">{question.question}</h3>

            <div className="space-y-3">
                {question.options.map((option: string, idx: number) => {
                    const isSelected = selectedOption === option;
                    const isCorrect = option === question.correct;

                    let btnClass = "w-full justify-start h-auto py-4 px-6 text-left hover:bg-muted";

                    if (isSelected) {
                        btnClass = isCorrect
                            ? "w-full justify-start h-auto py-4 px-6 text-left bg-green-100 hover:bg-green-100 border-green-500 text-green-800"
                            : "w-full justify-start h-auto py-4 px-6 text-left bg-red-100 hover:bg-red-100 border-red-500 text-red-800";
                    }

                    return (
                        <Button
                            key={idx}
                            variant="outline"
                            className={btnClass}
                            onClick={() => !selectedOption && handleAnswer(option)}
                            disabled={!!selectedOption}
                        >
                            {option}
                        </Button>
                    );
                })}
            </div>
        </div>
    );
}
