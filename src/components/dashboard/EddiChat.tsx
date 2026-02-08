"use client";

import { useChat } from "@ai-sdk/react";
import { UIMessage, DefaultChatTransport } from "ai";
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

export function EddiChat() {
    const [isOpen, setIsOpen] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);
    const [input, setInput] = useState(''); // Manual input state

    const router = useRouter();
    const scrollRef = useRef<HTMLDivElement>(null);

    // Explicitly type the useChat return based on our inspection
    const { messages, sendMessage, status } = useChat({
        experimental_throttle: 50,
        transport: new DefaultChatTransport({
            api: '/api/eddi/chat',
        }),
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onFinish: (result: any) => {
            // result is { message: UIMessage, ... } in newer versions
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const message = result.message || result as unknown as UIMessage; // Fallback just in case

            // Handle tool executions client-side if needed for navigation
            if (message?.parts) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                message.parts.forEach((part: any) => {
                    // Check if part is a tool invocation (type usually starts with 'tool-' or check properties)
                    const isTool = part.type.startsWith('tool-') && 'toolName' in part;

                    if (isTool) {
                        const toolPart = part as ToolPart;
                        if (toolPart.toolName === 'mapsToModule' && toolPart.result) {
                            const result = toolPart.result as { action: string, url: string };
                            if (result.action === 'redirect') {
                                router.push(result.url);
                            }
                        }
                    }
                });
            }
        },
    } as any);




    const isLoading = status === 'streaming' || status === 'submitted';

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInput(e.target.value);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim()) return;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await (sendMessage as any)({ role: 'user', content: input });
        setInput('');
    };

    // Scroll to bottom when messages change
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    // Watch for tool calls that need confirmation (createSupportTicket)
    // We need to scan the last message to see if it has a PENDING tool call for ticket
    useEffect(() => {
        // Logic to confirm ticket is handled in render loop now via 'result' check
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
                        <ScrollArea className="flex-1 p-4" ref={scrollRef}>
                            <div className="flex flex-col gap-4">
                                {messages.length === 0 && (
                                    <div className="flex flex-col items-center justify-center h-full text-center p-6 text-muted-foreground mt-10">
                                        <Bot className="w-12 h-12 mb-4 text-[var(--worlded-blue)]/20" />
                                        <p className="text-sm">Hi! I&apos;m Eddi. I can help you navigate courses or create support tickets.</p>
                                    </div>
                                )}
                                <div className="space-y-4">
                                    {messages.map((m: UIMessage) => (
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
                                                        // Render Tool Parts
                                                        if (part.type.startsWith('tool-') && 'toolName' in part) {
                                                            const toolCall = part as ToolPart;
                                                            if (toolCall.toolName === 'createSupportTicket' && toolCall.result) {
                                                                const result = toolCall.result as { ticket: { title: string, description: string, priority: string } };
                                                                // Don't show if it's just the confirming result
                                                                if (!result?.ticket) return null;

                                                                return (
                                                                    <div key={toolCall.toolCallId} className="mt-3 bg-orange-50 border border-orange-200 rounded-lg p-3">
                                                                        <div className="flex items-center gap-2 mb-2">
                                                                            <AlertTriangle className="w-4 h-4 text-orange-700" />
                                                                            <span className="font-semibold text-orange-700">Review Ticket Draft</span>
                                                                        </div>
                                                                        <div className="space-y-1 text-xs text-orange-900 mb-3">
                                                                            <p><span className="font-medium">Title:</span> {result.ticket.title}</p>
                                                                            <p><span className="font-medium">Priority:</span> {result.ticket.priority}</p>
                                                                            <p><span className="font-medium">Description:</span> {result.ticket.description}</p>
                                                                        </div>
                                                                        <div className="flex gap-2">
                                                                            <Button
                                                                                size="sm"
                                                                                className="w-full bg-orange-600 hover:bg-orange-700 text-white"
                                                                                onClick={() => {
                                                                                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                                                                    (sendMessage as any)({ role: 'user', content: "Yes, please submit the ticket." });
                                                                                }}
                                                                            >
                                                                                Confirm & Send
                                                                            </Button>
                                                                            <Button
                                                                                size="sm"
                                                                                variant="outline"
                                                                                className="w-full border-orange-200 text-orange-700 hover:bg-orange-100"
                                                                                onClick={() => {
                                                                                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                                                                    (sendMessage as any)({ role: 'user', content: "No, cancel the ticket." });
                                                                                }}
                                                                            >
                                                                                Cancel
                                                                            </Button>
                                                                        </div>
                                                                    </div>
                                                                );
                                                            }
                                                        }
                                                        return null;
                                                    })
                                                ) : (
                                                    // Fallback for simple content (unlikely in new versions but good safety)
                                                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                                    <p className="whitespace-pre-wrap">{(m as any).content}</p>
                                                )}
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
