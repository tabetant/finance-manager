import Link from "next/link";
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

            {/* Course Cards - Added for Navigation */}
            <div className="bg-card border border-border rounded-xl p-6 shadow-lg backdrop-blur-sm flex flex-col justify-center items-center gap-2 hover:border-primary/50 transition-colors cursor-pointer group">
                <Link href="/courses/calculus" className="flex flex-col items-center text-center w-full h-full">
                    <div className="p-3 bg-blue-500/10 rounded-full mb-2 group-hover:scale-110 transition-transform">
                        <Activity className="w-6 h-6 text-blue-500" />
                    </div>
                    <span className="font-semibold">Calculus</span>
                    <span className="text-xs text-muted-foreground">4 Modules</span>
                </Link>
            </div>

            <div className="bg-card border border-border rounded-xl p-6 shadow-lg backdrop-blur-sm flex flex-col justify-center items-center gap-2 hover:border-orange-500/50 transition-colors cursor-pointer group">
                <Link href="/courses/linear-algebra" className="flex flex-col items-center text-center w-full h-full">
                    <div className="p-3 bg-orange-500/10 rounded-full mb-2 group-hover:scale-110 transition-transform">
                        <Zap className="w-6 h-6 text-orange-500" />
                    </div>
                    <span className="font-semibold">Linear Algebra</span>
                    <span className="text-xs text-muted-foreground">4 Modules</span>
                </Link>
            </div>
        </div>
    );
}
