import { LearningOrbit } from "./LearningOrbit";
import { BookOpen, Video } from "lucide-react";
import { motion } from "framer-motion";

interface MultimediaCard {
    id: string;
    title: string;
    type: "video" | "reading";
    badges: string[];
    thumbnail: string;
    duration?: string;
}

export function StudentView() {
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

    return (
        <div className="min-h-screen p-6 bg-gradient-to-br from-background via-background to-secondary">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-2">
                    Learning Orbit
                </h1>
                <p className="text-muted-foreground font-mono text-sm">Student Dashboard • Real-time AI Processing</p>
            </div>

            {/* Bento Grid */}
            <LearningOrbit />

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
                            className="group relative bg-card border border-border rounded-lg overflow-hidden hover:border-accent/50 transition-all cursor-pointer shadow-sm hover:shadow-md"
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
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                />
                                {item.duration && (
                                    <div className="absolute bottom-2 right-2 bg-black/80 text-white px-2 py-0.5 rounded text-[10px] font-mono backdrop-blur-sm">
                                        {item.duration}
                                    </div>
                                )}
                                <div className="absolute top-2 left-2">
                                    {item.type === "video" ? (
                                        <div className="bg-accent text-accent-foreground p-1.5 rounded-md shadow-lg">
                                            <Video className="w-3 h-3" />
                                        </div>
                                    ) : (
                                        <div className="bg-primary text-primary-foreground p-1.5 rounded-md shadow-lg">
                                            <BookOpen className="w-3 h-3" />
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-4">
                                <h3 className="font-semibold mb-2 line-clamp-2 text-sm group-hover:text-accent transition-colors">
                                    {item.title}
                                </h3>
                                <div className="flex flex-wrap gap-1">
                                    {item.badges.map((badge, i) => (
                                        <span
                                            key={i}
                                            className="px-1.5 py-0.5 bg-secondary text-secondary-foreground text-[10px] rounded-md font-mono border border-border"
                                        >
                                            {badge}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}
