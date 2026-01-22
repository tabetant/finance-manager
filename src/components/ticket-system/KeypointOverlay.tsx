import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface Keypoint {
    x: number;
    y: number;
    label: string;
    confidence: number;
}

interface KeypointOverlayProps {
    imageUrl?: string;
    onAnalyze?: () => void;
}

export function KeypointOverlay({ imageUrl, onAnalyze }: KeypointOverlayProps) {
    const [keypoints, setKeypoints] = useState<Keypoint[]>([]);
    const [isAnalyzing, setIsAnalyzing] = useState(false);

    // Simulate keypoint detection
    const detectKeypoints = () => {
        setIsAnalyzing(true);
        setTimeout(() => {
            const mockKeypoints: Keypoint[] = [
                { x: 25, y: 20, label: "Title", confidence: 0.95 },
                { x: 40, y: 35, label: "Equation", confidence: 0.92 },
                { x: 60, y: 55, label: "Variable", confidence: 0.88 },
                { x: 30, y: 70, label: "Solution", confidence: 0.91 }
            ];
            setKeypoints(mockKeypoints);
            setIsAnalyzing(false);
            if (onAnalyze) onAnalyze();
        }, 1500);
    };

    useEffect(() => {
        if (imageUrl) {
            detectKeypoints();
        }
    }, [imageUrl]);

    return (
        <div className="relative w-full h-full">
            {/* Keypoint Markers */}
            {keypoints.map((point, index) => (
                <motion.div
                    key={index}
                    className="absolute"
                    style={{
                        left: `${point.x}%`,
                        top: `${point.y}%`,
                        transform: "translate(-50%, -50%)"
                    }}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: index * 0.2, type: "spring", bounce: 0.5 }}
                >
                    {/* Keypoint Dot */}
                    <motion.div
                        className="w-4 h-4 bg-accent rounded-full border-2 border-white shadow-lg"
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ repeat: Infinity, duration: 2, delay: index * 0.3 }}
                    />

                    {/* Label */}
                    <motion.div
                        className="absolute top-6 left-1/2 -translate-x-1/2 bg-black/90 text-white px-2 py-1 rounded text-xs font-mono whitespace-nowrap"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.2 + 0.3 }}
                    >
                        {point.label}
                        <div className="text-[10px] text-accent">
                            {(point.confidence * 100).toFixed(0)}%
                        </div>
                    </motion.div>

                    {/* Ripple Effect */}
                    <motion.div
                        className="absolute inset-0 w-4 h-4 bg-accent rounded-full"
                        animate={{
                            scale: [1, 2, 1],
                            opacity: [0.5, 0, 0.5]
                        }}
                        transition={{
                            repeat: Infinity,
                            duration: 2,
                            delay: index * 0.3
                        }}
                    />
                </motion.div>
            ))}

            {/* Analyzing Indicator */}
            {isAnalyzing && (
                <motion.div
                    className="absolute top-4 left-4 bg-accent/90 text-accent-foreground px-3 py-2 rounded-lg shadow-lg flex items-center gap-2"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                >
                    <motion.div
                        className="w-2 h-2 bg-white rounded-full"
                        animate={{ scale: [1, 1.5, 1] }}
                        transition={{ repeat: Infinity, duration: 1 }}
                    />
                    <span className="text-xs font-mono font-semibold">Detecting Keypoints...</span>
                </motion.div>
            )}

            {/* Confidence Score */}
            {keypoints.length > 0 && !isAnalyzing && (
                <motion.div
                    className="absolute top-4 right-4 bg-primary/90 text-primary-foreground px-3 py-2 rounded-lg shadow-lg"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                >
                    <div className="text-xs font-mono">
                        <div className="font-semibold">Keypoint Detection</div>
                        <div className="text-[10px] opacity-75">
                            {keypoints.length} points • Avg confidence:{" "}
                            {(
                                (keypoints.reduce((sum, p) => sum + p.confidence, 0) / keypoints.length) *
                                100
                            ).toFixed(0)}
                            %
                        </div>
                    </div>
                </motion.div>
            )}
        </div>
    );
}
