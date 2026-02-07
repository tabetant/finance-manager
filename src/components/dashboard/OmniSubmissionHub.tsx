import { useState } from "react";
import { Mic, Camera, FileUp, Sparkles, Waves, Brain } from "lucide-react";
import { motion } from "framer-motion";

export function OmniSubmissionHub() {
    const [isRecording, setIsRecording] = useState(false);
    const [processingType, setProcessingType] = useState<string | null>(null);

    const handleSubmit = (type: string) => {
        setProcessingType(type);
        setTimeout(() => setProcessingType(null), 2000);
    };

    return (
        <motion.div
            className="lg:col-span-2 bg-card border border-border rounded-xl p-6 shadow-lg backdrop-blur-sm relative overflow-hidden group"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            {/* Background Glow Effect */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 rounded-full blur-3xl -z-10 group-hover:bg-accent/10 transition-colors duration-500" />

            <div className="flex items-center gap-2 mb-6">
                <div className="p-2 bg-accent/10 rounded-lg">
                    <Brain className="w-5 h-5 text-accent" />
                </div>
                <h2 className="text-xl font-bold tracking-tight">Omni-Submission Hub</h2>
                <div className="ml-auto flex items-center gap-1 text-xs font-mono text-muted-foreground bg-secondary/50 px-2 py-1 rounded-full">
                    <Sparkles className="w-3 h-3 text-accent" />
                    <span>AI Ready</span>
                </div>
            </div>

            <div className="space-y-4">
                {/* Audio Input */}
                <motion.button
                    onClick={() => {
                        setIsRecording(!isRecording);
                        if (!isRecording) handleSubmit("audio");
                    }}
                    className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all duration-300 ${isRecording
                        ? "border-accent bg-accent/5 shadow-[0_0_20px_rgba(var(--accent),0.2)]"
                        : "border-border bg-card/50 hover:border-accent/50 hover:bg-accent/5"
                        }`}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                >
                    <div className="relative p-3 bg-background rounded-lg shadow-sm">
                        <Mic className={`w-6 h-6 ${isRecording ? "text-accent" : "text-foreground"}`} />
                        {isRecording && (
                            <motion.div
                                className="absolute inset-0 border-2 border-accent rounded-lg"
                                animate={{ scale: [1, 1.2, 1], opacity: [1, 0, 1] }}
                                transition={{ repeat: Infinity, duration: 1.5 }}
                            />
                        )}
                    </div>
                    <div className="flex-1 text-left">
                        <div className="font-semibold flex items-center gap-2">
                            Audio-Text
                            {isRecording && <span className="text-[10px] bg-red-500/10 text-red-500 px-1.5 py-0.5 rounded-full animate-pulse">REC</span>}
                        </div>
                        <div className="text-xs text-muted-foreground font-mono mt-0.5">
                            {isRecording ? "Listening..." : "Click to record question"}
                        </div>
                    </div>
                    {isRecording && (
                        <div className="flex gap-1 h-4 items-center">
                            {[1, 2, 3, 4, 5].map((i) => (
                                <motion.div
                                    key={i}
                                    className="w-1 bg-accent rounded-full"
                                    animate={{ height: [4, 16, 4] }}
                                    transition={{ repeat: Infinity, duration: 0.5, delay: i * 0.1 }}
                                />
                            ))}
                        </div>
                    )}
                </motion.button>

                {/* Image/Video Input */}
                <motion.button
                    onClick={() => handleSubmit("image")}
                    className="w-full flex items-center gap-4 p-4 rounded-xl border-2 border-border bg-card/50 hover:border-accent/50 hover:bg-accent/5 transition-all duration-300"
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                >
                    <div className="p-3 bg-background rounded-lg shadow-sm">
                        <Camera className="w-6 h-6 text-foreground" />
                    </div>
                    <div className="flex-1 text-left">
                        <div className="font-semibold">Image-to-Text/Video</div>
                        <div className="text-xs text-muted-foreground font-mono mt-0.5">
                            Scan textbook or capture video
                        </div>
                    </div>
                    <div className="px-2.5 py-1 bg-blue-500/10 text-blue-500 text-[10px] font-bold rounded-full font-mono uppercase tracking-wider">
                        Scan
                    </div>
                </motion.button>

                {/* Document Upload */}
                <motion.button
                    onClick={() => handleSubmit("document")}
                    className="w-full flex items-center gap-4 p-4 rounded-xl border-2 border-border bg-card/50 hover:border-accent/50 hover:bg-accent/5 transition-all duration-300"
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                >
                    <div className="p-3 bg-background rounded-lg shadow-sm">
                        <FileUp className="w-6 h-6 text-foreground" />
                    </div>
                    <div className="flex-1 text-left">
                        <div className="font-semibold">Document Upload</div>
                        <div className="text-xs text-muted-foreground font-mono mt-0.5">
                            Upload PDF for analysis
                        </div>
                    </div>
                    <div className="px-2.5 py-1 bg-green-500/10 text-green-500 text-[10px] font-bold rounded-full font-mono uppercase tracking-wider">
                        Analyze
                    </div>
                </motion.button>
            </div>

            {/* Processing Indicator */}
            {processingType && (
                <motion.div
                    className="mt-4 p-3 bg-accent/10 border border-accent/20 rounded-lg backdrop-blur-md"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <div className="flex items-center gap-3">
                        <div className="relative w-4 h-4">
                            <motion.div
                                className="absolute inset-0 border-2 border-accent rounded-full border-t-transparent"
                                animate={{ rotate: 360 }}
                                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                            />
                        </div>
                        <span className="text-sm font-mono text-accent-foreground">
                            AI processing {processingType} input...
                        </span>
                    </div>
                </motion.div>
            )}
        </motion.div>
    );
}
