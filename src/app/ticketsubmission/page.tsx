'use client';

import { useState } from "react";
import { motion } from "framer-motion";
import { Scan, Eye, Maximize2, Send, Sparkles, Activity } from "lucide-react";
import { KeypointOverlay } from "@/components/ticket-system/KeypointOverlay";

export default function TicketSubmissionPage() {
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [analysisStep, setAnalysisStep] = useState(0);
    const [showKeypoints, setShowKeypoints] = useState(false);

    const analysisSteps = [
        { label: "Object Detection", progress: 100 },
        { label: "Image Segmentation", progress: 85 },
        { label: "Depth Estimation", progress: 70 },
        { label: "OCR Text Extraction", progress: 60 }
    ];

    const handleAnalyze = () => {
        setIsAnalyzing(true);
        setShowKeypoints(true);
        // Simulate analysis progression
        const interval = setInterval(() => {
            setAnalysisStep((prev) => {
                if (prev >= analysisSteps.length - 1) {
                    clearInterval(interval);
                    return prev;
                }
                return prev + 1;
            });
        }, 800);
    };

    return (
        <div className="min-h-screen p-6 bg-gradient-to-br from-background via-background to-secondary">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-2">
                    Any-to-Any Ticket System
                </h1>
                <p className="text-muted-foreground font-mono text-sm">
                    Multimodal Problem Submission • AI-Powered Analysis
                </p>
            </div>

            {/* Split Pane Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left Side: Input Area */}
                <motion.div
                    className="bg-card border border-border rounded-xl p-6 shadow-lg"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="flex items-center gap-2 mb-4">
                        <Scan className="w-5 h-5 text-accent" />
                        <h2 className="text-xl font-semibold">Problem Input</h2>
                    </div>

                    {/* Image Preview with Bounding Boxes */}
                    <div className="relative bg-muted rounded-lg overflow-hidden mb-4 group h-80">
                        {/* In a real app, this would be the uploaded image */}
                        <img
                            src="https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=800"
                            alt="Textbook problem"
                            className="w-full h-full object-cover"
                        />

                        {showKeypoints && <KeypointOverlay imageUrl="active" onAnalyze={() => { }} />}


                        {/* Simulated Object Detection Overlays (Keep existing SVG logic if needed alongside Keypoints) */}
                        <svg
                            className="absolute inset-0 w-full h-full pointer-events-none"
                            style={{ mixBlendMode: "multiply" }}
                        >
                            {/* Bounding Box 1 */}
                            <motion.rect
                                x="10%"
                                y="15%"
                                width="80%"
                                height="25%"
                                fill="none"
                                stroke="#FF9100"
                                strokeWidth="2"
                                strokeDasharray="5,5"
                                initial={{ pathLength: 0 }}
                                animate={{ pathLength: 1 }}
                                transition={{ duration: 1, delay: 0.5 }}
                            />
                            {/* Label */}
                            <motion.text
                                x="12%"
                                y="13%"
                                fill="#FF9100"
                                className="text-xs font-mono font-bold"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 1 }}
                            >
                                Equation Detected
                            </motion.text>
                        </svg>

                        <div className="absolute bottom-4 right-4 bg-black/80 text-white px-3 py-1.5 rounded-lg text-xs font-mono flex items-center gap-2">
                            <Eye className="w-3 h-3" />
                            Object Detection {isAnalyzing ? 'Active' : 'Ready'}
                        </div>
                    </div>

                    {/* Controls */}
                    <div className="flex gap-2">
                        <button
                            onClick={handleAnalyze}
                            className="flex-1 bg-accent hover:bg-accent/90 text-accent-foreground py-3 rounded-lg font-semibold transition-all flex items-center justify-center gap-2"
                        >
                            <Scan className="w-4 h-4" />
                            Analyze Problem
                        </button>
                        <button className="px-4 bg-secondary hover:bg-secondary/80 rounded-lg transition-all">
                            <Maximize2 className="w-4 h-4" />
                        </button>
                    </div>
                </motion.div>

                {/* Right Side: AI Processing Feed */}
                <motion.div
                    className="bg-card border border-border rounded-xl p-6 shadow-lg"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="flex items-center gap-2 mb-4">
                        <Activity className="w-5 h-5 text-accent" />
                        <h2 className="text-xl font-semibold">Real-time AI Processing</h2>
                        <Sparkles className="w-4 h-4 text-accent ml-auto" />
                    </div>

                    <div className="space-y-4">
                        {analysisSteps.map((step, index) => (
                            <motion.div
                                key={step.label}
                                className={`p-4 rounded-lg border ${index <= analysisStep && isAnalyzing
                                    ? "border-accent bg-accent/5"
                                    : "border-border bg-input-background"
                                    }`}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-2">
                                        {index <= analysisStep && isAnalyzing ? (
                                            <motion.div
                                                className="w-2 h-2 bg-accent rounded-full"
                                                animate={{ scale: [1, 1.2, 1] }}
                                                transition={{ repeat: Infinity, duration: 1 }}
                                            />
                                        ) : (
                                            <div className="w-2 h-2 bg-muted rounded-full" />
                                        )}
                                        <span className="font-semibold text-sm">{step.label}</span>
                                    </div>
                                    <span className="text-xs font-mono text-muted-foreground">
                                        {index <= analysisStep && isAnalyzing ? `${step.progress}%` : "Waiting..."}
                                    </span>
                                </div>

                                {/* Progress Bar */}
                                <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                                    <motion.div
                                        className="h-full bg-gradient-to-r from-primary to-accent"
                                        initial={{ width: "0%" }}
                                        animate={{
                                            width: index <= analysisStep && isAnalyzing ? `${step.progress}%` : "0%"
                                        }}
                                        transition={{ duration: 0.8, ease: "easeOut" }}
                                    />
                                </div>

                                {/* Details */}
                                {index <= analysisStep && isAnalyzing && (
                                    <motion.div
                                        className="mt-2 text-xs text-muted-foreground font-mono"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 0.3 }}
                                    >
                                        {index === 0 && "Identifying mathematical symbols and diagrams..."}
                                        {index === 1 && "Segmenting text regions from background..."}
                                        {index === 2 && "Estimating spatial depth of problem elements..."}
                                        {index === 3 && "Extracting text from image regions..."}
                                    </motion.div>
                                )}
                            </motion.div>
                        ))}
                    </div>

                    {/* Extracted Text Preview */}
                    {analysisStep >= 3 && isAnalyzing && (
                        <motion.div
                            className="mt-6 p-4 bg-primary/5 border border-primary/20 rounded-lg"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            <div className="text-xs font-mono text-muted-foreground mb-2">
                                Extracted Content:
                            </div>
                            <div className="font-mono text-sm text-foreground">
                                &quot;Solve for x: 2x² + 5x - 3 = 0 using the quadratic formula...&quot;
                            </div>
                        </motion.div>
                    )}

                    {/* Submit Button */}
                    <motion.button
                        className="w-full mt-6 bg-primary hover:bg-primary/90 text-primary-foreground py-3 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={!isAnalyzing || analysisStep < 3}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        <Send className="w-4 h-4" />
                        Submit to Mentor
                        {isAnalyzing && analysisStep >= 3 && (
                            <span className="ml-2 px-2 py-0.5 bg-accent text-accent-foreground text-xs rounded font-mono">
                                Priority: HIGH
                            </span>
                        )}
                    </motion.button>
                </motion.div>
            </div>
        </div>
    );
}