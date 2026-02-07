import { OmniSubmissionHub } from "./OmniSubmissionHub";
import { motion } from "framer-motion";
import { Activity, Zap } from "lucide-react";

export function LearningOrbit() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {/* Omni-Submission Hub - Spans 2 columns */}
            <OmniSubmissionHub />

            {/* Quick Stats - Spans 1 column */}
            <motion.div
                className="bg-card border border-border rounded-xl p-6 shadow-lg backdrop-blur-sm relative overflow-hidden group"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
            >
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-2xl -z-10 group-hover:bg-primary/20 transition-colors duration-500" />
                <div className="flex items-center gap-2 mb-4">
                    <div className="p-2 bg-primary/10 rounded-lg">
                        <Activity className="w-5 h-5 text-primary" />
                    </div>
                    <span className="text-sm font-medium text-muted-foreground">Active Streak</span>
                </div>
                <div className="text-4xl font-bold mb-1 tracking-tight">12 Days</div>
                <div className="text-xs text-muted-foreground font-mono">
                    <span className="text-emerald-500 font-bold">+3</span> from last week
                </div>
            </motion.div>

            {/* AI Status - Spans 1 column */}
            <motion.div
                className="bg-card border border-border rounded-xl p-6 shadow-lg backdrop-blur-sm relative overflow-hidden group"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
            >
                <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-accent/10 rounded-full blur-2xl -z-10 group-hover:bg-accent/20 transition-colors duration-500" />
                <div className="flex items-center gap-2 mb-4">
                    <div className="p-2 bg-accent/10 rounded-lg">
                        <Zap className="w-5 h-5 text-accent" />
                    </div>
                    <span className="text-sm font-medium text-muted-foreground">AI Latency</span>
                </div>
                <div className="text-4xl font-bold mb-1 tracking-tight">1.2s</div>
                <div className="flex items-center gap-2 mt-2">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                    <span className="text-xs text-muted-foreground font-mono">Operational</span>
                </div>
            </motion.div>
        </div>
    );
}
