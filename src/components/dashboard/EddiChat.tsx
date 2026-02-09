"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { X, Send, Bot, Loader2, ExternalLink, BookOpen, FileText, Sparkles } from "lucide-react";
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

interface EddiChatProps {
    isOpen: boolean;
    onClose: () => void;
}

// ============================================================================
// COMPONENT
// ============================================================================

export function EddiChat({ isOpen, onClose }: EddiChatProps) {
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
                throw new Error("Failed to get response from Eddi.");
            }

            const data = await response.json();

            if (data.actionPayload) {
                handleAction(data.actionPayload, data.text);
            }

            const assistantMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: data.text,
                displayList: data.actionPayload?.action === 'display_list'
                    ? { listTitle: data.actionPayload.listTitle, items: data.actionPayload.items }
                    : undefined,
                isFeatureUnavailable: data.actionPayload?.action === 'feature_unavailable',
                featureSuggestion: data.actionPayload?.suggestion,
            };

            setMessages(prev => [...prev, assistantMessage]);
        } catch (error) {
            console.error('Error sending message:', error);
            const errorMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: error instanceof Error ? error.message : "Sorry, I encountered an error. Please try again.",
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
            setLoadingAction(null);
        }
    };

    const handleAction = (actionPayload: ActionPayload, textResponse: string) => {
        switch (actionPayload.action) {
            case 'navigate':
                if (actionPayload.path) {
                    setLoadingAction(`Navigating to ${actionPayload.path}...`);
                    setTimeout(() => {
                        router.push(actionPayload.path!);
                        onClose();
                    }, 500);
                }
                break;
            case 'launch_quiz':
                if (actionPayload.scrollToQuiz) {
                    setLoadingAction("Scrolling to quiz...");
                    setTimeout(() => {
                        const quizSection = document.getElementById('quiz-section');
                        if (quizSection) {
                            quizSection.scrollIntoView({ behavior: 'smooth' });
                        }
                        onClose();
                    }, 500);
                }
                break;
            case 'display_list':
                // Handled in message rendering
                break;
            case 'feature_unavailable':
                // Handled in message rendering
                break;
            default:
                break;
        }
    };

    const handleListItemClick = (path?: string) => {
        if (path) {
            router.push(path);
            onClose();
        }
    };

    // ========================================================================
    // RENDER
    // ========================================================================

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/20 z-40"
                    />

                    {/* Chat Panel - Slide from right */}
                    <motion.div
                        initial={{ opacity: 0, x: 400 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 400 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className={`fixed right-0 top-0 bottom-0 bg-white shadow-2xl z-50 flex flex-col border-l border-border
                            ${isExpanded ? 'w-[800px]' : 'w-full sm:w-[400px]'}`}
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-[var(--worlded-purple)] to-[var(--worlded-pink)] text-white">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                                    <Sparkles className="text-white" size={20} />
                                </div>
                                <div>
                                    <h2 className="font-semibold text-white">Eddi</h2>
                                    <p className="text-xs text-white/80">Your Learning Assistant</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-1">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-7 px-2 text-xs text-white hover:bg-white/20 hover:text-white hidden sm:flex"
                                    onClick={() => setIsExpanded(!isExpanded)}
                                >
                                    {isExpanded ? 'Collapse' : 'Expand'}
                                </Button>
                                <button
                                    onClick={onClose}
                                    className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                                >
                                    <X className="text-white" size={20} />
                                </button>
                            </div>
                        </div>

                        {/* Messages Area */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50" ref={scrollRef}>
                            {messages.length === 0 && (
                                <div className="flex flex-col items-center justify-center h-full text-center p-6 text-muted-foreground mt-10">
                                    <Sparkles className="w-12 h-12 mb-4 text-[var(--worlded-purple)]/30" />
                                    <p className="text-sm font-medium mb-2">Hi! I&apos;m Eddi, your learning assistant.</p>
                                    <p className="text-xs text-muted-foreground mb-4">
                                        I can help you navigate courses, find content, and start quizzes.
                                    </p>
                                    <div className="flex flex-wrap gap-2 justify-center">
                                        <SuggestionChip
                                            text="Show me all courses"
                                            onClick={() => setInput("Show me all courses")}
                                        />
                                        <SuggestionChip
                                            text="Start a quiz"
                                            onClick={() => setInput("Start a quiz")}
                                        />
                                        <SuggestionChip
                                            text="Help with calculus"
                                            onClick={() => setInput("Help me with calculus")}
                                        />
                                    </div>
                                </div>
                            )}

                            {messages.map((msg) => (
                                <motion.div
                                    key={msg.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div className={`
                                        max-w-[85%] rounded-2xl px-4 py-2.5
                                        ${msg.role === 'user'
                                            ? 'bg-primary text-white rounded-br-md'
                                            : 'bg-white border border-border rounded-bl-md shadow-sm'
                                        }
                                    `}>
                                        {msg.role === 'assistant' && (
                                            <div className="flex items-center gap-2 mb-1">
                                                <div className="w-5 h-5 bg-gradient-to-r from-[var(--worlded-purple)] to-[var(--worlded-pink)] rounded-full flex items-center justify-center">
                                                    <Sparkles className="text-white" size={12} />
                                                </div>
                                                <span className="text-xs font-medium text-muted-foreground">Eddi</span>
                                            </div>
                                        )}
                                        <p className={`text-sm leading-relaxed ${msg.role === 'user' ? 'text-white' : 'text-foreground'}`}>
                                            {msg.content}
                                        </p>

                                        {/* Display List */}
                                        {msg.displayList && (
                                            <div className="mt-3 space-y-2">
                                                <p className="text-xs font-medium text-muted-foreground">{msg.displayList.listTitle}</p>
                                                {msg.displayList.items.map((item, idx) => (
                                                    <button
                                                        key={idx}
                                                        onClick={() => handleListItemClick(item.path)}
                                                        className="w-full flex items-center gap-2 p-2 rounded-lg bg-muted/50 hover:bg-muted transition-colors text-left"
                                                    >
                                                        <BookOpen size={14} className="text-primary" />
                                                        <div className="flex-1 min-w-0">
                                                            <p className="text-sm font-medium truncate">{item.title}</p>
                                                            {item.description && (
                                                                <p className="text-xs text-muted-foreground truncate">{item.description}</p>
                                                            )}
                                                        </div>
                                                        <ExternalLink size={12} className="text-muted-foreground" />
                                                    </button>
                                                ))}
                                            </div>
                                        )}

                                        {/* Feature Unavailable */}
                                        {msg.isFeatureUnavailable && msg.featureSuggestion && (
                                            <div className="mt-2 p-2 rounded-lg bg-amber-50 border border-amber-200">
                                                <p className="text-xs text-amber-700">{msg.featureSuggestion}</p>
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            ))}

                            {/* Loading Indicator */}
                            {isLoading && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="flex justify-start"
                                >
                                    <div className="bg-white border border-border rounded-2xl rounded-bl-md px-4 py-3 shadow-sm">
                                        <div className="flex gap-1">
                                            <motion.div
                                                animate={{ scale: [1, 1.2, 1] }}
                                                transition={{ repeat: Infinity, duration: 0.6, delay: 0 }}
                                                className="w-2 h-2 bg-muted-foreground/50 rounded-full"
                                            />
                                            <motion.div
                                                animate={{ scale: [1, 1.2, 1] }}
                                                transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }}
                                                className="w-2 h-2 bg-muted-foreground/50 rounded-full"
                                            />
                                            <motion.div
                                                animate={{ scale: [1, 1.2, 1] }}
                                                transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }}
                                                className="w-2 h-2 bg-muted-foreground/50 rounded-full"
                                            />
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </div>

                        {/* Quick Actions */}
                        {messages.length <= 1 && (
                            <div className="px-4 py-2 border-t border-border bg-white">
                                <p className="text-xs text-muted-foreground mb-2">Quick Actions:</p>
                                <div className="flex gap-2 flex-wrap">
                                    <button
                                        onClick={() => setInput("Find a course")}
                                        className="flex items-center gap-2 px-3 py-1.5 bg-primary/5 text-primary rounded-full text-xs font-medium hover:bg-primary/10 transition-colors"
                                    >
                                        <BookOpen size={14} />
                                        Find a course
                                    </button>
                                    <button
                                        onClick={() => setInput("Start a quiz")}
                                        className="flex items-center gap-2 px-3 py-1.5 bg-primary/5 text-primary rounded-full text-xs font-medium hover:bg-primary/10 transition-colors"
                                    >
                                        <FileText size={14} />
                                        Start a quiz
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Input */}
                        <div className="p-4 border-t border-border bg-white">
                            <form onSubmit={handleSubmit} className="flex gap-2">
                                <input
                                    type="text"
                                    value={input}
                                    onChange={handleInputChange}
                                    placeholder="Ask Eddi anything..."
                                    className="flex-1 px-4 py-2.5 bg-slate-50 border border-border rounded-full focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
                                    disabled={isLoading}
                                />
                                <button
                                    type="submit"
                                    disabled={!input.trim() || isLoading}
                                    className="w-10 h-10 bg-gradient-to-r from-[var(--worlded-purple)] to-[var(--worlded-pink)] text-white rounded-full flex items-center justify-center hover:opacity-90 disabled:opacity-50 transition-opacity shadow-md"
                                >
                                    {isLoading ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
                                </button>
                            </form>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}

// ============================================================================
// SUB-COMPONENTS
// ============================================================================

function SuggestionChip({ text, onClick }: { text: string; onClick: () => void }) {
    return (
        <button
            onClick={onClick}
            className="px-3 py-1.5 text-xs rounded-full bg-[var(--worlded-purple)]/5 hover:bg-[var(--worlded-purple)]/10 text-[var(--worlded-purple)] transition-colors border border-[var(--worlded-purple)]/20"
        >
            {text}
        </button>
    );
}
