"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageSquare, X, Send, Bot, AlertTriangle, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
// Removed createClient as it's no longer used directly in this component

// Define a flexible interface for tool parts since the specific types are complex
interface ToolPart {
    type: string;
    toolName: string;
    toolCallId: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    args: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    result?: any;
    state?: string;
}

interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    parts?: any[];
}



export function EddiChat() {
    const [isOpen, setIsOpen] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);
    const [input, setInput] = useState('');
    // Manual state management to replace useChat for non-streaming stability
    const [messages, setMessages] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const router = useRouter();
    const scrollRef = useRef<HTMLDivElement>(null);

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

        // Optimistic update
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            const response = await fetch('/api/eddi/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    messages: [...messages, userMessage],
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

            // Handle Action Agent payloads
            if (data.action) {
                if (data.action.action === 'navigate') {
                    const path = data.action.path;

                    // Extract a readable name from path if possible, or use generic
                    const destination = path.split('/').pop()?.replace(/-/g, ' ') || "destination";
                    const formattedDestination = destination.charAt(0).toUpperCase() + destination.slice(1);

                    // Add assistant message with specific feedback
                    const assistantMessage: Message = {
                        id: (Date.now() + 1).toString(),
                        role: 'assistant',
                        content: data.text || `Opening ${formattedDestination}...`,
                    };
                    setMessages(prev => [...prev, assistantMessage]);

                    // Delay slightly to let the message appear
                    setTimeout(() => {
                        router.push(path);
                    }, 800);
                    return; // Stop here and don't add another message
                }

                if (data.action.action === 'draft_ticket') {
                    // Placeholder for ticket confirmation
                    const assistantMessage: Message = {
                        id: (Date.now() + 1).toString(),
                        role: 'assistant',
                        content: data.text || "I've drafted a ticket for you (Draft UI coming soon).",
                    };
                    setMessages(prev => [...prev, assistantMessage]);
                    return;
                }
            }

            // Create assistant message from standardized 'text' response
            const assistantMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: data.text || "",
            };

            setMessages(prev => [...prev, assistantMessage]);

        } catch (error: any) {
            console.error("Chat Error:", error);
            const errorMessage: Message = {
                id: Date.now().toString(),
                role: 'assistant',
                content: error.message || "Something went wrong. Please try again.",
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };



    // Scroll to bottom when messages change
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);


    return (
        <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className={`mb-4 bg-background border rounded-lg shadow-xl overflow-hidden flex flex-col
                            ${isExpanded ? 'w-[800px] h-[600px]' : 'w-[350px] h-[500px]'}
                            transition-all duration-300 ease-in-out`}
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-3 border-b bg-muted/50">
                            <div className="flex items-center gap-2">
                                <div className="p-1.5 bg-[var(--worlded-blue)] rounded-md">
                                    <Bot className="w-4 h-4 text-white" />
                                </div>
                                <span className="font-semibold text-sm">Eddi AI</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setIsExpanded(!isExpanded)}>
                                    {isExpanded ? <span className="text-xs">Collapse</span> : <span className="text-xs">Expand</span>}
                                </Button>
                                <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setIsOpen(false)}>
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
                                        <p className="text-sm">Hi! I&apos;m Eddi. I can help you navigate courses or create support tickets.</p>
                                    </div>
                                )}
                                <div className="space-y-4">
                                    {messages.map((m: Message) => (
                                        <div
                                            key={m.id}
                                            className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                        >
                                            <div
                                                className={`max-w-[85%] rounded-lg p-3 text-sm ${m.role === 'user'
                                                    ? 'bg-[var(--worlded-blue)] text-white'
                                                    : 'bg-muted text-foreground'
                                                    }`}
                                            >
                                                {/* Render text parts */}
                                                {m.parts ? (
                                                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                                    m.parts.map((part: any, index: number) => {
                                                        if (part.type === 'text') {
                                                            return <p key={index} className="whitespace-pre-wrap">{part.text}</p>;
                                                        }
                                                        // Render Tool Call (if visible) or Results
                                                        // For now simplified to just text or specific tool handling

                                                        // NOTE: In non-streaming generateText, tool calls might be in parts
                                                        // But without tool execution on server (maxSteps), we see the call.
                                                        // If we enable maxSteps, we see the RESULT.

                                                        // For this refactor, we focus on TEXT.

                                                        return null;
                                                    })
                                                ) : (
                                                    <p className="whitespace-pre-wrap">{m.content}</p>
                                                )}

                                                {/** Fallback for string content if parts map didn't output anything (e.g. pure text message with parts populated for safety) */}
                                                {m.parts && m.parts.length === 0 && <p className="whitespace-pre-wrap">{m.content}</p>}
                                            </div>
                                        </div>
                                    ))}
                                    {isLoading && (
                                        <div className="flex justify-start">
                                            <div className="bg-muted rounded-lg p-3">
                                                <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
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
                                    placeholder="Ask Eddi..."
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
