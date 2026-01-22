import { useState } from "react";
import { Mic, Camera, FileUp, Video, BookOpen, Brain, Sparkles, Waves } from "lucide-react";
import { motion } from "framer-motion";
import { ShimmerLoader } from "@/components/ui/ShimmerLoader";

interface MultimediaCard {
    id: string;
    title: string;
    type: "video" | "reading";
    badges: string[];
    thumbnail: string;
    duration?: string;
}

export function StudentView() {
    const [isRecording, setIsRecording] = useState(false);
    const [processingType, setProcessingType] = useState<string | null>(null);

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

    const handleSubmit = (type: string) => {
        setProcessingType(type);
        setTimeout(() => setProcessingType(null), 2000);
    };

    return (
        <div className="min-h-screen p-6 bg-gradient-to-br from-background via-background to-secondary">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-2">
                    Learning Orbit
                </h1>
                <p className="text-muted-foreground font-mono text-sm">Student Dashboard • Real-time AI Processing</p>
            </div>

            {/* 4-Column Bento Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {/* Omni-Submission Hub - Spans 2 columns */}
                <motion.div
                    className="lg:col-span-2 bg-card border border-border rounded-xl p-6 shadow-lg backdrop-blur-sm"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="flex items-center gap-2 mb-4">
                        <Brain className="w-5 h-5 text-accent" />
                        <h2 className="text-xl font-semibold">Omni-Submission Hub</h2>
                        <Sparkles className="w-4 h-4 text-accent ml-auto" />
                    </div>

                    <div className="space-y-4">
                        {/* Audio Input */}
                        <motion.button
                            onClick={() => {
                                setIsRecording(!isRecording);
                                if (!isRecording) handleSubmit("audio");
                            }}
                            className={`w-full flex items-center gap-4 p-4 rounded-lg border-2 transition-all ${isRecording
                                    ? "border-accent bg-accent/10"
                                    : "border-border bg-input-background hover:border-accent/50"
                                }`}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <div className="relative">
                                <Mic className="w-6 h-6 text-foreground" />
                                {isRecording && (
                                    <motion.div
                                        className="absolute -right-1 -top-1 w-3 h-3 bg-accent rounded-full"
                                        animate={{ scale: [1, 1.2, 1] }}
                                        transition={{ repeat: Infinity, duration: 1 }}
                                    />
                                )}
                            </div>
                            <div className="flex-1 text-left">
                                <div className="font-semibold">Audio-Text</div>
                                <div className="text-xs text-muted-foreground font-mono">
                                    {isRecording ? "Recording..." : "Click to record question"}
                                </div>
                            </div>
                            {isRecording && (
                                <Waves className="w-5 h-5 text-accent animate-pulse" />
                            )}
                        </motion.button>

                        {/* Image/Video Input */}
                        <motion.button
                            onClick={() => handleSubmit("image")}
                            className="w-full flex items-center gap-4 p-4 rounded-lg border-2 border-border bg-input-background hover:border-accent/50 transition-all"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <Camera className="w-6 h-6 text-foreground" />
                            <div className="flex-1 text-left">
                                <div className="font-semibold">Image-to-Text/Video</div>
                                <div className="text-xs text-muted-foreground font-mono">
                                    Scan textbook or capture video
                                </div>
                            </div>
                            <div className="px-2 py-1 bg-accent/20 text-accent text-xs rounded font-mono">
                                Scan
                            </div>
                        </motion.button>

                        {/* Document Upload */}
                        <motion.button
                            onClick={() => handleSubmit("document")}
                            className="w-full flex items-center gap-4 p-4 rounded-lg border-2 border-border bg-input-background hover:border-accent/50 transition-all"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <FileUp className="w-6 h-6 text-foreground" />
                            <div className="flex-1 text-left">
                                <div className="font-semibold">Document Upload</div>
                                <div className="text-xs text-muted-foreground font-mono">
                                    Upload PDF for analysis
                                </div>
                            </div>
                            <div className="px-2 py-1 bg-primary/20 text-primary text-xs rounded font-mono">
                                Analyze
                            </div>
                        </motion.button>
                    </div>

                    {/* Processing Indicator */}
                    {processingType && (
                        <motion.div
                            className="mt-4 p-3 bg-accent/10 border border-accent/30 rounded-lg"
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            <div className="flex items-center gap-2">
                                <motion.div
                                    className="w-2 h-2 bg-accent rounded-full"
                                    animate={{ scale: [1, 1.5, 1] }}
                                    transition={{ repeat: Infinity, duration: 1 }}
                                />
                                <span className="text-sm font-mono">
                                    AI processing {processingType} input...
                                </span>
                            </div>
                        </motion.div>
                    )}
                </motion.div>

                {/* Quick Stats */}
                <motion.div
                    className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground rounded-xl p-6 shadow-lg"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                >
                    <div className="text-sm opacity-90 mb-2 font-mono">Active Sessions</div>
                    <div className="text-4xl font-bold mb-1">12</div>
                    <div className="text-xs opacity-75">+3 from yesterday</div>
                </motion.div>

                {/* AI Status */}
                <motion.div
                    className="bg-gradient-to-br from-accent to-accent/80 text-accent-foreground rounded-xl p-6 shadow-lg"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                >
                    <div className="text-sm opacity-90 mb-2 font-mono">AI Response Time</div>
                    <div className="text-4xl font-bold mb-1">1.2s</div>
                    <div className="text-xs opacity-75">Low-latency mode</div>
                </motion.div>
            </div>

            {/* Multimodal Library */}
            <div className="bg-card border border-border rounded-xl p-6 shadow-lg backdrop-blur-sm">
                <div className="flex items-center gap-2 mb-6">
                    <BookOpen className="w-5 h-5 text-accent" />
                    <h2 className="text-xl font-semibold">Multimodal Library</h2>
                    <span className="ml-auto text-xs text-muted-foreground font-mono">
                        {multimodalLibrary.length} resources available
                    </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {multimodalLibrary.map((item, index) => (
                        <motion.div
                            key={item.id}
                            className="group relative bg-card border border-border rounded-lg overflow-hidden hover:border-accent/50 transition-all cursor-pointer"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                            whileHover={{ y: -4 }}
                        >
                            {/* Thumbnail */}
                            <div className="relative h-32 bg-muted overflow-hidden">
                                <img
                                    src={item.thumbnail}
                                    alt={item.title}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                />
                                {item.duration && (
                                    <div className="absolute bottom-2 right-2 bg-black/80 text-white px-2 py-1 rounded text-xs font-mono">
                                        {item.duration}
                                    </div>
                                )}
                                <div className="absolute top-2 left-2">
                                    {item.type === "video" ? (
                                        <div className="bg-accent text-accent-foreground p-1.5 rounded">
                                            <Video className="w-4 h-4" />
                                        </div>
                                    ) : (
                                        <div className="bg-primary text-primary-foreground p-1.5 rounded">
                                            <BookOpen className="w-4 h-4" />
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-4">
                                <h3 className="font-semibold mb-2 line-clamp-2 text-sm">
                                    {item.title}
                                </h3>
                                <div className="flex flex-wrap gap-1">
                                    {item.badges.map((badge, i) => (
                                        <span
                                            key={i}
                                            className="px-2 py-0.5 bg-accent/10 text-accent text-[10px] rounded-full font-mono"
                                        >
                                            {badge}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Hover Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-accent/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}
