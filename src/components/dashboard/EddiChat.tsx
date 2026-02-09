"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageSquare, X, Send, Bot, Loader2, ExternalLink, BookOpen, FileText } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter, usePathname } from "next/navigation";

// ============================================================================
// TYPES
// ============================================================================

interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    displayList?: {
        listTitle: string;
        items: { title: string; path?: string; description?: string }[];
    };
    isFeatureUnavailable?: boolean;
    featureSuggestion?: string;
}

interface ActionPayload {
    action: 'navigate' | 'launch_quiz' | 'display_list' | 'draft_ticket' | 'feature_unavailable';
    path?: string;
    scrollToQuiz?: boolean;
    listTitle?: string;
    items?: { title: string; path?: string; description?: string }[];
    feature?: string;
    message?: string;
    suggestion?: string;
    ticket?: { subject: string; body: string; priority: string };
}

// ============================================================================
// COMPONENT
// ============================================================================

export function EddiChat() {
    const [isOpen, setIsOpen] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [loadingAction, setLoadingAction] = useState<string | null>(null);

    const router = useRouter();
    const pathname = usePathname();
    const scrollRef = useRef<HTMLDivElement>(null);

    // Scroll to bottom when messages change
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInput(e.target.value);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            role: 'user',
            content: input,
        };

        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);
        setLoadingAction(null);

        try {
            const response = await fetch('/api/eddi/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    messages: [...messages, userMessage].map(m => ({
                        role: m.role,
                        content: m.content,
                    })),
                    context: {
                        currentPath: pathname,
                    },
                }),
            });

            if (!response.ok) {
                if (response.status === 429) {
                    const errorData = await response.json();
                    throw new Error(errorData.text || "Rate limit exceeded.");
                }
                throw new Error(`API Error: ${response.statusText}`);
            }

            const data = await response.json();
            console.log("Eddi Response:", data);

            // Handle different action types
            if (data.action) {
                handleAction(data.action as ActionPayload, data.text);
                return;
            }

            // Regular text response
            const assistantMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: data.text || "",
            };
            setMessages(prev => [...prev, assistantMessage]);

        } catch (error: unknown) {
            console.error("Chat Error:", error);
            const errorMessage: Message = {
                id: Date.now().toString(),
                role: 'assistant',
                content: (error as Error).message || "Something went wrong. Please try again.",
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
            setLoadingAction(null);
        }
    };

    const handleAction = (action: ActionPayload, textResponse: string) => {
        switch (action.action) {
            case 'navigate':
                handleNavigate(action.path!, textResponse);
                break;
            case 'launch_quiz':
                handleQuizLaunch(action.path!, textResponse, action.scrollToQuiz);
                break;
            case 'display_list':
                handleDisplayList(action.listTitle!, action.items!, textResponse);
                break;
            case 'draft_ticket':
                handleDraftTicket(action.ticket!, textResponse);
                break;
            case 'feature_unavailable':
                handleFeatureUnavailable(action.message!, action.suggestion, textResponse);
                break;
            default:
                // Fallback: just show the text
                const message: Message = {
                    id: (Date.now() + 1).toString(),
                    role: 'assistant',
                    content: textResponse,
                };
                setMessages(prev => [...prev, message]);
        }
    };

    const handleNavigate = (path: string, textResponse: string) => {
        const destination = path.split('/').pop()?.replace(/-/g, ' ') || "destination";
        const formattedDestination = destination.charAt(0).toUpperCase() + destination.slice(1);

        const assistantMessage: Message = {
            id: (Date.now() + 1).toString(),
            role: 'assistant',
            content: textResponse || `Opening ${formattedDestination}...`,
        };
        setMessages(prev => [...prev, assistantMessage]);
        setLoadingAction('Navigating...');

        setTimeout(() => {
            router.push(path);
        }, 600);
    };

    const handleQuizLaunch = (path: string, textResponse: string, scrollToQuiz?: boolean) => {
        const assistantMessage: Message = {
            id: (Date.now() + 1).toString(),
            role: 'assistant',
            content: textResponse || "Starting the quiz...",
        };
        setMessages(prev => [...prev, assistantMessage]);
        setLoadingAction('Loading quiz...');

        setTimeout(() => {
            router.push(path);
            // If scrollToQuiz is true, we'll scroll after navigation
            if (scrollToQuiz) {
                // Give time for the page to load, then scroll
                setTimeout(() => {
                    const quizSection = document.getElementById('quiz-section');
                    if (quizSection) {
                        quizSection.scrollIntoView({ behavior: 'smooth' });
                    }
                }, 1000);
            }
        }, 600);
    };

    const handleDisplayList = (listTitle: string, items: { title: string; path?: string; description?: string }[], textResponse: string) => {
        const assistantMessage: Message = {
            id: (Date.now() + 1).toString(),
            role: 'assistant',
            content: textResponse,
            displayList: { listTitle, items },
        };
        setMessages(prev => [...prev, assistantMessage]);
    };

    const handleDraftTicket = (ticket: { subject: string; body: string; priority: string }, textResponse: string) => {
        const assistantMessage: Message = {
            id: (Date.now() + 1).toString(),
            role: 'assistant',
            content: textResponse || `I've drafted a ticket for you:\n\n**Subject:** ${ticket.subject}\n**Priority:** ${ticket.priority}\n\n${ticket.body}\n\n(Ticket submission coming soon!)`,
        };
        setMessages(prev => [...prev, assistantMessage]);
    };

    const handleFeatureUnavailable = (message: string, suggestion?: string, textResponse?: string) => {
        const assistantMessage: Message = {
            id: (Date.now() + 1).toString(),
            role: 'assistant',
            content: textResponse || message,
            isFeatureUnavailable: true,
            featureSuggestion: suggestion,
        };
        setMessages(prev => [...prev, assistantMessage]);
    };

    const handleListItemClick = (path: string) => {
        router.push(path);
    };

    // ========================================================================
    // RENDER
    // ========================================================================

    return (
        <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className={`mb-4 bg-background border rounded-lg shadow-xl overflow-hidden flex flex-col
                            ${isExpanded ? 'w-[800px] h-[600px]' : 'w-[380px] h-[520px]'}
                            transition-all duration-300 ease-in-out`}
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-3 border-b bg-muted/50">
                            <div className="flex items-center gap-2">
                                <div className="p-1.5 bg-[var(--worlded-blue)] rounded-md">
                                    <Bot className="w-4 h-4 text-white" />
                                </div>
                                <span className="font-semibold text-sm">Eddi AI</span>
                                {loadingAction && (
                                    <span className="text-xs text-muted-foreground animate-pulse">
                                        {loadingAction}
                                    </span>
                                )}
                            </div>
                            <div className="flex items-center gap-1">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-7 px-2 text-xs"
                                    onClick={() => setIsExpanded(!isExpanded)}
                                >
                                    {isExpanded ? 'Collapse' : 'Expand'}
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-7 w-7"
                                    onClick={() => setIsOpen(false)}
                                >
                                    <X className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>

                        {/* Messages Area */}
                        <ScrollArea className="flex-1 p-4" viewportRef={scrollRef}>
                            <div className="flex flex-col gap-4">
                                {messages.length === 0 && (
                                    <div className="flex flex-col items-center justify-center h-full text-center p-6 text-muted-foreground mt-10">
                                        <Bot className="w-12 h-12 mb-4 text-[var(--worlded-blue)]/20" />
                                        <p className="text-sm font-medium mb-2">Hi! I&apos;m Eddi, your learning assistant.</p>
                                        <p className="text-xs text-muted-foreground">
                                            I can help you navigate courses, find content, and start quizzes.
                                        </p>
                                        <div className="mt-4 flex flex-wrap gap-2 justify-center">
                                            <SuggestionChip
                                                text="Show me all courses"
                                                onClick={() => setInput("Show me all courses")}
                                            />
                                            <SuggestionChip
                                                text="Open calculus"
                                                onClick={() => setInput("Open the calculus course")}
                                            />
                                        </div>
                                    </div>
                                )}
                                <div className="space-y-4">
                                    {messages.map((m: Message) => (
                                        <div
                                            key={m.id}
                                            className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                        >
                                            <div
                                                className={`max-w-[90%] rounded-lg p-3 text-sm ${m.role === 'user'
                                                    ? 'bg-[var(--worlded-blue)] text-white'
                                                    : 'bg-muted text-foreground'
                                                    }`}
                                            >
                                                <p className="whitespace-pre-wrap">{m.content}</p>

                                                {/* Display List */}
                                                {m.displayList && (
                                                    <div className="mt-3 border-t border-border/50 pt-3">
                                                        <p className="text-xs font-medium text-muted-foreground mb-2">
                                                            {m.displayList.listTitle}
                                                        </p>
                                                        <div className="space-y-2">
                                                            {m.displayList.items.map((item, idx) => (
                                                                <div
                                                                    key={idx}
                                                                    className={`flex items-center gap-2 p-2 rounded-md bg-background/50 ${item.path ? 'cursor-pointer hover:bg-background/80 transition-colors' : ''
                                                                        }`}
                                                                    onClick={() => item.path && handleListItemClick(item.path)}
                                                                >
                                                                    <BookOpen className="w-3.5 h-3.5 text-muted-foreground" />
                                                                    <span className="flex-1 text-sm">{item.title}</span>
                                                                    {item.path && (
                                                                        <ExternalLink className="w-3 h-3 text-muted-foreground" />
                                                                    )}
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Feature Unavailable Indicator */}
                                                {m.isFeatureUnavailable && (
                                                    <div className="mt-2 flex items-center gap-2 text-xs text-amber-600 dark:text-amber-400">
                                                        <FileText className="w-3 h-3" />
                                                        <span>Coming soon</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                    {isLoading && (
                                        <div className="flex justify-start">
                                            <div className="bg-muted rounded-lg p-3 flex items-center gap-2">
                                                <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
                                                <span className="text-xs text-muted-foreground">
                                                    {loadingAction || 'Thinking...'}
                                                </span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </ScrollArea>

                        {/* Input Area */}
                        <div className="p-3 border-t bg-background">
                            <form onSubmit={handleSubmit} className="flex gap-2">
                                <Input
                                    value={input}
                                    onChange={handleInputChange}
                                    placeholder="Ask Eddi anything..."
                                    className="flex-1 focus-visible:ring-[var(--worlded-blue)]"
                                    disabled={isLoading}
                                />
                                <Button
                                    type="submit"
                                    size="icon"
                                    className="bg-[var(--worlded-blue)] hover:bg-blue-900"
                                    disabled={isLoading || !input.trim()}
                                >
                                    <Send className="w-4 h-4" />
                                </Button>
                            </form>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Toggle Button */}
            {!isOpen && (
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsOpen(true)}
                    className="h-14 w-14 rounded-full bg-[var(--worlded-blue)] text-white shadow-lg flex items-center justify-center hover:bg-blue-900 transition-colors"
                >
                    <MessageSquare className="w-7 h-7" />
                </motion.button>
            )}
        </div>
    );
}

// ============================================================================
// SUB-COMPONENTS
// ============================================================================

function SuggestionChip({ text, onClick }: { text: string; onClick: () => void }) {
    return (
        <button
            onClick={onClick}
            className="px-3 py-1.5 text-xs rounded-full bg-muted hover:bg-muted/80 transition-colors border"
        >
            {text}
        </button>
    );
}
