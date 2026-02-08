"use client";

import { motion } from "framer-motion";

interface GaugeProps {
    value: number; // 0 to 100
    size?: number;
    strokeWidth?: number;
    color?: string;
    label?: string;
    subLabel?: string;
}

export function Gauge({
    value,
    size = 120,
    strokeWidth = 10,
    color = "#002A5C", // UofT Blue default
    label,
    subLabel,
}: GaugeProps) {
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const offset = circumference - (value / 100) * circumference;

    return (
        <div className="relative flex flex-col items-center justify-center">
            <div className="relative" style={{ width: size, height: size }}>
                {/* Background Circle */}
                <svg
                    className="transform -rotate-90 w-full h-full"
                    width={size}
                    height={size}
                >
                    <circle
                        className="text-muted/20"
                        stroke="currentColor"
                        strokeWidth={strokeWidth}
                        fill="transparent"
                        r={radius}
                        cx={size / 2}
                        cy={size / 2}
                    />
                    {/* Progress Circle */}
                    <motion.circle
                        stroke={color}
                        strokeWidth={strokeWidth}
                        fill="transparent"
                        r={radius}
                        cx={size / 2}
                        cy={size / 2}
                        strokeDasharray={circumference}
                        initial={{ strokeDashoffset: circumference }}
                        animate={{ strokeDashoffset: offset }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                        strokeLinecap="round"
                    />
                </svg>
                {/* Center Text */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-2xl font-bold" style={{ color }}>
                        {Math.round(value)}%
                    </span>
                    {subLabel && (
                        <span className="text-xs text-muted-foreground uppercase tracking-wider">
                            {subLabel}
                        </span>
                    )}
                </div>
            </div>
            {label && <span className="mt-2 text-sm font-medium">{label}</span>}
        </div>
    );
}
