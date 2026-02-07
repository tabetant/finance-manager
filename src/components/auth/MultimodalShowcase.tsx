"use client"

import React, { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Mic, FileText, Video, Image as ImageIcon, Sparkles } from "lucide-react"

/**
 * MultimodalShowcase Component
 * Displayed on the left side of the Auth Page.
 * Features a Bento Grid layout with rotating "Heartstrings" quotes
 * and icons representing the multimodal nature of the platform.
 */
export default function MultimodalShowcase() {
    const [activeQuote, setActiveQuote] = useState(0)

    const quotes = [
        { text: "Learning unbounded.", author: "WorldEd" },
        { text: "Every voice has a story.", author: "The Platform" },
        { text: "Connect beyond words.", author: "Future of Ed" },
    ]

    useEffect(() => {
        const interval = setInterval(() => {
            setActiveQuote((prev) => (prev + 1) % quotes.length)
        }, 4000)
        return () => clearInterval(interval)
    }, [quotes.length])

    return (
        <div className="relative hidden h-full w-full flex-col justify-between overflow-hidden bg-[var(--worlded-blue)] p-10 text-white lg:flex">
            {/* Background Decor - Academic Kinetic */}
            <div className="absolute -left-20 -top-20 h-96 w-96 rounded-full bg-blue-500/20 blur-3xl" />
            <div className="absolute -bottom-20 -right-20 h-96 w-96 rounded-full bg-[var(--worlded-orange)]/10 blur-3xl" />

            {/* Header */}
            <div className="z-10 flex items-center gap-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 backdrop-blur-sm">
                    <Sparkles className="h-6 w-6 text-[var(--worlded-orange)]" />
                </div>
                <span className="text-2xl font-bold tracking-tight">WorldEd</span>
            </div>

            {/* Main Content - Bento Grid Effect */}
            <div className="z-10 flex flex-1 flex-col justify-center gap-8">

                {/* Dynamic Quote */}
                <div className="h-32">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeQuote}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.5 }}
                            className="space-y-4"
                        >
                            <h1 className="max-w-md text-4xl font-bold leading-tight">
                                &quot;{quotes[activeQuote].text}&quot;
                            </h1>
                            <p className="text-lg text-blue-200">
                                — {quotes[activeQuote].author}
                            </p>
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* Feature Icons Grid */}
                <div className="grid grid-cols-2 gap-4 max-w-sm">
                    <div className="group flex h-32 w-full flex-col items-center justify-center rounded-2xl bg-white/5 p-4 backdrop-blur-sm transition-all hover:bg-white/10 hover:scale-105 border border-white/10">
                        <Mic className="mb-2 h-8 w-8 text-[var(--worlded-orange)]" />
                        <span className="text-sm font-medium">Voice</span>
                    </div>
                    <div className="group flex h-32 w-full flex-col items-center justify-center rounded-2xl bg-white/5 p-4 backdrop-blur-sm transition-all hover:bg-white/10 hover:scale-105 border border-white/10">
                        <Video className="mb-2 h-8 w-8 text-blue-300" />
                        <span className="text-sm font-medium">Video</span>
                    </div>
                    <div className="group flex h-32 w-full flex-col items-center justify-center rounded-2xl bg-white/5 p-4 backdrop-blur-sm transition-all hover:bg-white/10 hover:scale-105 border border-white/10">
                        <ImageIcon className="mb-2 h-8 w-8 text-pink-300" />
                        <span className="text-sm font-medium">Image</span>
                    </div>
                    <div className="group flex h-32 w-full flex-col items-center justify-center rounded-2xl bg-white/5 p-4 backdrop-blur-sm transition-all hover:bg-white/10 hover:scale-105 border border-white/10">
                        <FileText className="mb-2 h-8 w-8 text-emerald-300" />
                        <span className="text-sm font-medium">Docs</span>
                    </div>
                </div>

            </div>

            {/* Footer */}
            <div className="z-10 flex items-center gap-2 text-sm text-blue-200/60">
                <div className="h-1 w-1 rounded-full bg-current" />
                <span>Multimodal Learning Platform</span>
                <div className="h-1 w-1 rounded-full bg-current" />
                <span>v2.0.0</span>
            </div>
        </div>
    )
}
