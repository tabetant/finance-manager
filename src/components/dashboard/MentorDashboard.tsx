import { useState } from "react";
import { motion } from "framer-motion";
import {
    Video,
    Languages,
    PenTool,
    Mic,
    AlertCircle,
    Clock,
    BookOpen,
    Sparkles,
    Search
} from "lucide-react";

interface Ticket {
    id: string;
    student: string;
    subject: string;
    urgency: "high" | "medium" | "low";
    timestamp: string;
    preview: string;
    status: "pending" | "active" | "resolved";
}

export function MentorDashboard() {
    const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
    const [activeFilter, setActiveFilter] = useState<string>("all");
    const [similarityScore, setSimilarityScore] = useState(0);

    const tickets: Ticket[] = [
        {
            id: "T-001",
            student: "Maria Garcia",
            subject: "Calculus",
            urgency: "high",
            timestamp: "2 min ago",
            preview: "Help with integration by parts: ∫ x·e^x dx",
            status: "pending"
        },
        {
            id: "T-002",
            student: "John Smith",
            subject: "Physics",
            urgency: "medium",
            timestamp: "8 min ago",
            preview: "Projectile motion problem - finding max height",
            status: "pending"
        },
        {
            id: "T-003",
            student: "Li Wei",
            subject: "Chemistry",
            urgency: "high",
            timestamp: "12 min ago",
            preview: "Balancing redox reaction equations",
            status: "active"
        },
        {
            id: "T-004",
            student: "Sarah Johnson",
            subject: "Calculus",
            urgency: "low",
            timestamp: "15 min ago",
            preview: "Derivative of composite functions",
            status: "pending"
        }
    ];

    const handleSearchResource = () => {
        setSimilarityScore(0);
        const interval = setInterval(() => {
            setSimilarityScore((prev) => {
                if (prev >= 94) {
                    clearInterval(interval);
                    return 94;
                }
                return prev + 2;
            });
        }, 30);
    };

    return (
        <div className="min-h-screen p-6 bg-gradient-to-br from-background via-background to-secondary">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-2">
                    Mentor Command Center
                </h1>
                <p className="text-muted-foreground font-mono text-sm">
                    Advanced Dashboard • AI-Powered Support Tools
                </p>
            </div>

            {/* 3-Pane Dashboard */}
            <div className="grid grid-cols-12 gap-6">
                {/* Left Sidebar: Ticket Queue */}
                <motion.div
                    className="col-span-12 lg:col-span-3 bg-card border border-border rounded-xl p-4 shadow-lg max-h-[calc(100vh-12rem)] overflow-y-auto"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold">Ticket Queue</h2>
                        <div className="flex items-center gap-1">
                            <button
                                onClick={() => setActiveFilter("all")}
                                className={`px-2 py-1 rounded text-xs font-mono transition-all ${activeFilter === "all"
                                        ? "bg-accent text-accent-foreground"
                                        : "bg-secondary text-foreground hover:bg-secondary/80"
                                    }`}
                            >
                                All
                            </button>
                            <button
                                onClick={() => setActiveFilter("high")}
                                className={`px-2 py-1 rounded text-xs font-mono transition-all ${activeFilter === "high"
                                        ? "bg-accent text-accent-foreground"
                                        : "bg-secondary text-foreground hover:bg-secondary/80"
                                    }`}
                            >
                                <AlertCircle className="w-3 h-3" />
                            </button>
                        </div>
                    </div>

                    <div className="space-y-2">
                        {tickets.map((ticket, index) => (
                            <motion.div
                                key={ticket.id}
                                onClick={() => setSelectedTicket(ticket)}
                                className={`p-3 rounded-lg cursor-pointer transition-all ${selectedTicket?.id === ticket.id
                                        ? "bg-accent text-accent-foreground"
                                        : "bg-input-background hover:bg-secondary"
                                    }`}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                whileHover={{ x: 4 }}
                            >
                                <div className="flex items-start justify-between mb-1">
                                    <span className="text-xs font-mono font-bold">{ticket.id}</span>
                                    <div className="flex items-center gap-1">
                                        {ticket.urgency === "high" && (
                                            <AlertCircle className="w-3 h-3 text-destructive" />
                                        )}
                                        <Clock className="w-3 h-3 opacity-60" />
                                    </div>
                                </div>
                                <div className="text-sm font-semibold mb-1">{ticket.student}</div>
                                <div className="text-xs opacity-75 mb-1 flex items-center gap-1">
                                    <span className="px-1.5 py-0.5 bg-black/10 dark:bg-white/10 rounded">
                                        {ticket.subject}
                                    </span>
                                    <span>{ticket.timestamp}</span>
                                </div>
                                <div className="text-xs line-clamp-2 opacity-90">{ticket.preview}</div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* Center Stage: Active Query */}
                <motion.div
                    className="col-span-12 lg:col-span-6 space-y-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                >
                    {/* Student Question */}
                    <div className="bg-card border border-border rounded-xl p-6 shadow-lg">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-primary-foreground font-bold">
                                MG
                            </div>
                            <div>
                                <div className="font-semibold">Maria Garcia</div>
                                <div className="text-xs text-muted-foreground font-mono">Calculus • 2 min ago</div>
                            </div>
                            <div className="ml-auto px-3 py-1 bg-destructive/10 text-destructive rounded-full text-xs font-semibold">
                                HIGH PRIORITY
                            </div>
                        </div>

                        <div className="bg-input-background p-4 rounded-lg mb-4">
                            <p className="text-sm mb-2">
                                "I'm struggling with this integration by parts problem. Can you help me understand how to
                                choose u and dv?"
                            </p>
                            <div className="bg-muted p-3 rounded font-mono text-sm">
                                ∫ x·e^x dx
                            </div>
                        </div>

                        <div className="flex gap-2">
                            <button
                                onClick={handleSearchResource}
                                className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground py-2 px-4 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 text-sm"
                            >
                                <Search className="w-4 h-4" />
                                Find Similar Resources
                            </button>
                        </div>
                    </div>

                    {/* Visual Document Retrieval */}
                    <div className="bg-card border border-border rounded-xl p-6 shadow-lg">
                        <div className="flex items-center gap-2 mb-4">
                            <BookOpen className="w-5 h-5 text-accent" />
                            <h3 className="text-lg font-semibold">Visual Document Retrieval</h3>
                            {similarityScore > 0 && (
                                <motion.span
                                    className="ml-auto px-2 py-1 bg-accent/20 text-accent rounded text-xs font-mono"
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                >
                                    {similarityScore}% Match
                                </motion.span>
                            )}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            {/* Student's Question */}
                            <div className="border border-border rounded-lg overflow-hidden">
                                <div className="bg-accent/10 px-3 py-2 text-xs font-semibold">Student Query</div>
                                <div className="p-4 bg-input-background">
                                    <div className="font-mono text-sm mb-2">∫ x·e^x dx</div>
                                    <div className="text-xs text-muted-foreground">Integration by parts</div>
                                </div>
                            </div>

                            {/* Recommended Textbook Page */}
                            <div className="border border-accent/50 rounded-lg overflow-hidden">
                                <div className="bg-accent/10 px-3 py-2 text-xs font-semibold flex items-center justify-between">
                                    <span>Textbook Match</span>
                                    <Sparkles className="w-3 h-3 text-accent" />
                                </div>
                                <div className="relative h-40 bg-muted">
                                    <img
                                        src="https://images.unsplash.com/photo-1509228468518-180dd4864904?w=400"
                                        alt="Textbook page"
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-accent/20 to-transparent" />
                                    <div className="absolute bottom-2 left-2 right-2 bg-black/80 text-white p-2 rounded text-xs font-mono">
                                        Chapter 7.2: Integration by Parts
                                        <div className="text-[10px] opacity-75 mt-1">Page 342</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Similarity Metrics */}
                        {similarityScore > 0 && (
                            <motion.div
                                className="mt-4 p-3 bg-accent/5 border border-accent/20 rounded-lg"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                            >
                                <div className="text-xs font-mono text-muted-foreground mb-2">
                                    Sentence Similarity Analysis
                                </div>
                                <div className="flex gap-2 text-xs">
                                    <span className="px-2 py-1 bg-primary/10 text-primary rounded">
                                        Semantic: 96%
                                    </span>
                                    <span className="px-2 py-1 bg-accent/10 text-accent rounded">
                                        Contextual: 94%
                                    </span>
                                    <span className="px-2 py-1 bg-chart-3/10 text-chart-3 rounded">Syntactic: 89%</span>
                                </div>
                            </motion.div>
                        )}
                    </div>
                </motion.div>

                {/* Right Sidebar: AI Toolbox */}
                <motion.div
                    className="col-span-12 lg:col-span-3 bg-card border border-border rounded-xl p-4 shadow-lg"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                >
                    <div className="flex items-center gap-2 mb-4">
                        <Sparkles className="w-5 h-5 text-accent" />
                        <h3 className="text-lg font-semibold">AI Toolbox</h3>
                    </div>

                    <div className="space-y-3">
                        {/* Generate Video Explanation */}
                        <motion.button
                            className="w-full bg-gradient-to-r from-accent to-accent/80 text-accent-foreground p-4 rounded-lg shadow-md hover:shadow-lg transition-all text-left"
                            whileHover={{ scale: 1.02, y: -2 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <div className="flex items-center gap-3 mb-1">
                                <Video className="w-5 h-5" />
                                <span className="font-semibold text-sm">Generate Video</span>
                            </div>
                            <div className="text-xs opacity-90">Text-to-Video explanation</div>
                        </motion.button>

                        {/* Translate */}
                        <motion.button
                            className="w-full bg-gradient-to-r from-primary to-primary/80 text-primary-foreground p-4 rounded-lg shadow-md hover:shadow-lg transition-all text-left"
                            whileHover={{ scale: 1.02, y: -2 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <div className="flex items-center gap-3 mb-1">
                                <Languages className="w-5 h-5" />
                                <span className="font-semibold text-sm">Translate</span>
                            </div>
                            <div className="text-xs opacity-90">To student's language</div>
                        </motion.button>

                        {/* Interactive Quiz */}
                        <motion.button
                            className="w-full bg-gradient-to-r from-chart-3 to-chart-3/80 text-white p-4 rounded-lg shadow-md hover:shadow-lg transition-all text-left"
                            whileHover={{ scale: 1.02, y: -2 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <div className="flex items-center gap-3 mb-1">
                                <PenTool className="w-5 h-5" />
                                <span className="font-semibold text-sm">Quiz Generator</span>
                            </div>
                            <div className="text-xs opacity-90">Fill-mask & Summarization</div>
                        </motion.button>

                        {/* Analyze Audio */}
                        <motion.button
                            className="w-full bg-gradient-to-r from-chart-4 to-chart-4/80 text-white p-4 rounded-lg shadow-md hover:shadow-lg transition-all text-left"
                            whileHover={{ scale: 1.02, y: -2 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <div className="flex items-center gap-3 mb-1">
                                <Mic className="w-5 h-5" />
                                <span className="font-semibold text-sm">Analyze Audio</span>
                            </div>
                            <div className="text-xs opacity-90">Speech Recognition</div>
                        </motion.button>
                    </div>

                    {/* Stats */}
                    <div className="mt-6 pt-4 border-t border-border">
                        <div className="text-xs font-mono text-muted-foreground mb-3">Session Stats</div>
                        <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                                <span>Resolved Today</span>
                                <span className="font-semibold">24</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                                <span>Avg Response Time</span>
                                <span className="font-semibold font-mono">3.2m</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                                <span>Success Rate</span>
                                <span className="font-semibold text-accent">96%</span>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
